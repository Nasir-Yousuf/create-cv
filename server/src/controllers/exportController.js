import mongoose from 'mongoose';
import { generatePDF } from '../services/pdf/pdfService.js';
import { generateDOCX } from '../services/docx/docxService.js';
import CV from '../models/CV.js';
import User from '../models/User.js';
import CVActivity from '../models/CVActivity.js';
import { pickAllowedCVData } from './cvController.js';
import { computeUserEntitlements, getPaymentConfigValues } from './paymentController.js';

const validateCvPayload = (cvData) => {
  if (!cvData || typeof cvData !== 'object') {
    return 'Invalid CV data payload: Expected a JSON object.';
  }
  const hasPersonal =
    cvData.personalInfo &&
    (cvData.personalInfo.fullName ||
      cvData.personalInfo.email ||
      cvData.personalInfo.phone);
  const hasContent =
    hasPersonal ||
    (Array.isArray(cvData.experience) && cvData.experience.length > 0) ||
    (Array.isArray(cvData.education) && cvData.education.length > 0) ||
    (Array.isArray(cvData.skills) && cvData.skills.length > 0);
  if (!hasContent) {
    return 'CV data appears empty. Please fill in at least a name, contact, or content section before exporting.';
  }
  return null;
};

const verifyExportEligibility = async ({ userId, role, cvId }) => {
  const user = await User.findById(userId).select('role status freeExportsRemaining paidExportCredits totalExports');
  if (!user) {
    return { errorStatus: 401, code: 'AUTH_REQUIRED', message: 'User account not found.' };
  }
  if (user.status === 'suspended') {
    return { errorStatus: 403, code: 'ACCOUNT_SUSPENDED', message: 'Your account is suspended.' };
  }

  let existingCv = null;
  if (cvId) {
    if (!mongoose.Types.ObjectId.isValid(cvId)) {
      return { errorStatus: 404, code: 'CV_NOT_FOUND', message: 'Invalid CV document ID.' };
    }
    existingCv = await CV.findOne({ _id: cvId, userId, isDeleted: { $ne: true } });
    if (!existingCv) {
      return { errorStatus: 404, code: 'CV_NOT_FOUND', message: 'CV document not found for your account.' };
    }
    if (existingCv.isExportUnlocked) {
      return { authorized: true, user, cv: existingCv, unlockSource: existingCv.unlockType || 'unlocked' };
    }
  }

  if (role === 'admin' || user.role === 'admin') {
    return { authorized: true, user, cv: existingCv, unlockSource: 'admin' };
  }

  if ((user.freeExportsRemaining || 0) > 0) {
    return { authorized: true, user, cv: existingCv, unlockSource: 'free' };
  }

  if ((user.paidExportCredits || 0) > 0) {
    return { authorized: true, user, cv: existingCv, unlockSource: 'paid' };
  }

  const cfg = getPaymentConfigValues();
  const entitlements = await computeUserEntitlements(userId);
  return {
    errorStatus: 402,
    code: 'PAYMENT_REQUIRED',
    message: `Your free CV export has been used. Pay ৳${cfg.amountBdt} via bKash to unlock an additional CV export.`,
    entitlements,
  };
};

const commitExportConsumptionAndLog = async ({
  user,
  cv,
  cvData,
  unlockSource,
  format,
  previewOnly,
}) => {
  if (previewOnly) return { cvId: cv?._id ? String(cv._id) : null, unlockType: unlockSource };

  let targetCv = cv;
  if (!targetCv) {
    const clean = pickAllowedCVData(cvData);
    targetCv = await CV.create({
      ...clean,
      userId: user._id,
      version: 1,
    });
  }

  let appliedUnlock = targetCv.unlockType || 'none';

  if (!targetCv.isExportUnlocked) {
    if (user.role === 'admin' || unlockSource === 'admin') {
      appliedUnlock = 'admin';
    } else {
      // Atomic entitlement decrement so concurrent requests cannot double-spend free/paid credit
      const freeUpdated = await User.findOneAndUpdate(
        { _id: user._id, freeExportsRemaining: { $gt: 0 } },
        { $inc: { freeExportsRemaining: -1, totalExports: 1 } },
        { new: true }
      );
      if (freeUpdated) {
        appliedUnlock = 'free';
      } else {
        const paidUpdated = await User.findOneAndUpdate(
          { _id: user._id, paidExportCredits: { $gt: 0 } },
          { $inc: { paidExportCredits: -1, totalExports: 1 } },
          { new: true }
        );
        if (!paidUpdated) {
          throw Object.assign(new Error('No remaining CV export credits available.'), {
            status: 402,
            code: 'PAYMENT_REQUIRED',
          });
        }
        appliedUnlock = 'paid';
      }
    }

    targetCv.isExportUnlocked = true;
    targetCv.unlockType = appliedUnlock;
    targetCv.unlockedAt = new Date();
  } else {
    await User.updateOne({ _id: user._id }, { $inc: { totalExports: 1 } });
  }

  if (format === 'pdf') {
    targetCv.pdfExportCount = (targetCv.pdfExportCount || 0) + 1;
  } else {
    targetCv.docxExportCount = (targetCv.docxExportCount || 0) + 1;
  }
  targetCv.lastExportedAt = new Date();
  await targetCv.save();

  await CVActivity.create({
    userId: user._id,
    cvId: targetCv._id,
    cvTitle: targetCv.title,
    action: format === 'pdf' ? 'exported_pdf' : 'exported_docx',
    details: `Exported ${format.toUpperCase()} (${appliedUnlock})`,
    actorRole: user.role,
    actorId: user._id,
  }).catch(() => {});

  return {
    cvId: String(targetCv._id),
    unlockType: appliedUnlock,
  };
};

// @desc    Export CV to High-Resolution Vector PDF (Authenticated + Entitlement Checked)
// @route   POST /api/export/pdf
// @access  Private
export const exportPDF = async (req, res) => {
  const requestId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Please log in or register before exporting your CV.',
      });
    }

    const { cvData, html, css, cvId, previewOnly } = req.body || {};
    const validationErr = validateCvPayload(cvData);
    if (validationErr) {
      return res.status(400).json({
        success: false,
        message: validationErr,
      });
    }

    const gate = await verifyExportEligibility({
      userId: req.user.id,
      role: req.user.role,
      cvId: cvId || cvData?._id || null,
    });

    if (gate.errorStatus) {
      return res.status(gate.errorStatus).json({
        success: false,
        code: gate.code,
        message: gate.message,
        entitlements: gate.entitlements,
      });
    }

    const safeHtml =
      typeof html === 'string' && html.length > 50 && html.length < 3000000 ? html : null;
    const safeCss =
      typeof css === 'string' && css.length > 50 && css.length < 1500000 ? css : '';

    const pdfBuffer = await generatePDF(cvData, safeHtml, safeCss);

    if (!pdfBuffer || pdfBuffer.length < 5000) {
      throw new Error('Generated PDF buffer is invalid or too small.');
    }

    const meta = await commitExportConsumptionAndLog({
      user: gate.user,
      cv: gate.cv,
      cvData,
      unlockSource: gate.unlockSource,
      format: 'pdf',
      previewOnly: Boolean(previewOnly),
    });

    const rawName = (cvData.personalInfo?.fullName || cvData.title || 'Resume').trim();
    const safeName =
      rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${safeName}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Export-Request-Id': requestId,
      ...(meta?.cvId ? { 'X-CV-Id': meta.cvId } : {}),
      ...(meta?.unlockType ? { 'X-Unlock-Type': meta.unlockType } : {}),
    });

    return res.end(pdfBuffer);
  } catch (err) {
    console.error(`[${requestId}] Export PDF Error:`, err.message);
    if (err.status === 402) {
      return res.status(402).json({
        success: false,
        code: 'PAYMENT_REQUIRED',
        message: err.message,
      });
    }
    if (err.status === 503 || err.code === 'PDF_ENGINE_UNAVAILABLE') {
      return res.status(503).json({
        success: false,
        code: 'PDF_ENGINE_UNAVAILABLE',
        fallbackAllowed: true,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: `PDF Export failed: ${err.message || 'Internal engine error'}.`,
    });
  }
};

// @desc    Verify & record PDF export entitlement when client fallback PDF engine is used (e.g. serverless without Chromium)
// @route   POST /api/export/pdf/record-fallback
// @access  Private
export const exportPDFFallbackRecord = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Please log in or register before exporting your CV.',
      });
    }

    const { cvData, cvId, previewOnly } = req.body || {};
    const validationErr = validateCvPayload(cvData);
    if (validationErr) {
      return res.status(400).json({
        success: false,
        message: validationErr,
      });
    }

    const gate = await verifyExportEligibility({
      userId: req.user.id,
      role: req.user.role,
      cvId: cvId || cvData?._id || null,
    });

    if (gate.errorStatus) {
      return res.status(gate.errorStatus).json({
        success: false,
        code: gate.code,
        message: gate.message,
        entitlements: gate.entitlements,
      });
    }

    const meta = await commitExportConsumptionAndLog({
      user: gate.user,
      cv: gate.cv,
      cvData,
      unlockSource: gate.unlockSource,
      format: 'pdf',
      previewOnly: Boolean(previewOnly),
    });

    return res.status(200).json({
      success: true,
      ...meta,
    });
  } catch (err) {
    if (err.status === 402) {
      return res.status(402).json({
        success: false,
        code: 'PAYMENT_REQUIRED',
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to record PDF export.',
    });
  }
};

// @desc    Export CV to Editable Word (.docx) (Authenticated + Entitlement Checked)
// @route   POST /api/export/docx
// @access  Private
export const exportDOCX = async (req, res) => {
  const requestId = `docx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Please log in or register before exporting your CV.',
      });
    }

    const { cvData, cvId } = req.body || {};
    const validationErr = validateCvPayload(cvData);
    if (validationErr) {
      return res.status(400).json({
        success: false,
        message: validationErr,
      });
    }

    const gate = await verifyExportEligibility({
      userId: req.user.id,
      role: req.user.role,
      cvId: cvId || cvData?._id || null,
    });

    if (gate.errorStatus) {
      return res.status(gate.errorStatus).json({
        success: false,
        code: gate.code,
        message: gate.message,
        entitlements: gate.entitlements,
      });
    }

    const docxBuffer = await generateDOCX(cvData);

    if (!docxBuffer || docxBuffer.length < 2000) {
      throw new Error('Generated DOCX buffer is empty or corrupted.');
    }

    const meta = await commitExportConsumptionAndLog({
      user: gate.user,
      cv: gate.cv,
      cvData,
      unlockSource: gate.unlockSource,
      format: 'docx',
      previewOnly: false,
    });

    const rawName = (cvData.personalInfo?.fullName || cvData.title || 'Resume').trim();
    const safeName =
      rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${safeName}.docx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': docxBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Export-Request-Id': requestId,
      ...(meta?.cvId ? { 'X-CV-Id': meta.cvId } : {}),
      ...(meta?.unlockType ? { 'X-Unlock-Type': meta.unlockType } : {}),
    });

    return res.end(docxBuffer);
  } catch (err) {
    console.error(`[${requestId}] Export DOCX Error:`, err.message);
    if (err.status === 402) {
      return res.status(402).json({
        success: false,
        code: 'PAYMENT_REQUIRED',
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: `Word Export failed: ${err.message || 'Internal engine error'}.`,
    });
  }
};
