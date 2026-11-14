import CV from '../models/CV.js';
import CVVersion from '../models/CVVersion.js';
import CVActivity from '../models/CVActivity.js';
import {
  resolveTemplateId,
  resolveTemplateMeta,
} from '../../../shared/constants/cvDefaults.js';
import { normalizeCvData } from '../../../shared/utils/cvNormalize.js';
import { validateAndSanitizePhoto } from '../utils/sanitizeHtml.js';

export const ALLOWED_CV_FIELDS = [
  'title',
  'templateId',
  'category',
  'isOnePage',
  'profileType',
  'personalInfo',
  'personalDetails',
  'summary',
  'careerObjective',
  'design',
  'designTokens',
  'sectionConfig',
  'elementOverrides',
  'customElements',
  'experience',
  'internships',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
  'volunteer',
  'publications',
  'references',
  'additionalInfo',
  'declaration',
  'customSections',
];

const DESIGN_ENUM_DEFAULTS = {
  fontSize: ['small', 'medium', 'large'],
  lineSpacing: ['compact', 'normal', 'relaxed'],
  sectionSpacing: ['compact', 'normal', 'relaxed'],
  margins: ['compact', 'normal', 'wide'],
};

export const pickAllowedCVData = (payload = {}) => {
  const src = payload && typeof payload === 'object' ? payload : {};
  const clean = {};
  ALLOWED_CV_FIELDS.forEach((field) => {
    if (src[field] !== undefined) {
      clean[field] = src[field];
    }
  });

  // Coerce string/null subdocuments without injecting unrequested fields on partial updates
  const normalized = normalizeCvData(clean);
  ALLOWED_CV_FIELDS.forEach((field) => {
    if (clean[field] !== undefined && normalized[field] !== undefined) {
      clean[field] = normalized[field];
    }
  });

  if (clean.design && typeof clean.design === 'object') {
    Object.entries(DESIGN_ENUM_DEFAULTS).forEach(([key, allowed]) => {
      if (clean.design[key] !== undefined && !allowed.includes(clean.design[key])) {
        delete clean.design[key];
      }
    });
  }

  if (clean.templateId) {
    const canonical = resolveTemplateId(clean.templateId);
    const meta = resolveTemplateMeta(canonical);
    clean.templateId = canonical;
    clean.category = meta.category;
    clean.isOnePage = Boolean(meta.isOnePage);
  }

  // Validate and sanitize image payloads to strictly allowed formats (JPEG, PNG, WebP)
  if (clean.personalInfo && typeof clean.personalInfo === 'object') {
    if (clean.personalInfo.photo) {
      clean.personalInfo.photo = validateAndSanitizePhoto(clean.personalInfo.photo);
    }
    if (clean.personalInfo.photoUrl) {
      clean.personalInfo.photoUrl = validateAndSanitizePhoto(clean.personalInfo.photoUrl);
    }
  }

  return clean;
};

const logActivity = async ({
  userId,
  cvId = null,
  cvTitle = '',
  action,
  details = '',
  actorRole = 'user',
  actorId = null,
}) => {
  try {
    await CVActivity.create({
      userId,
      cvId,
      cvTitle,
      action,
      details,
      actorRole,
      actorId: actorId || userId,
    });
  } catch (err) {
    console.warn('Activity log skipped:', err.message);
  }
};

export const createSnapshotRecord = async (cvDoc, label = 'Auto Checkpoint') => {
  try {
    const plain = cvDoc.toObject();
    delete plain._id;
    delete plain.userId;
    delete plain.createdAt;
    delete plain.updatedAt;
    delete plain.__v;
    delete plain.versionSnapshots;

    await CVVersion.create({
      cvId: cvDoc._id,
      userId: cvDoc.userId,
      version: cvDoc.version,
      label,
      title: cvDoc.title,
      templateId: cvDoc.templateId,
      snapshot: plain,
    });

    // Retain at most 20 most recent versions in collection
    const oldVersions = await CVVersion.find({ cvId: cvDoc._id })
      .sort({ version: -1 })
      .skip(20)
      .select('_id');
    if (oldVersions.length > 0) {
      await CVVersion.deleteMany({ _id: { $in: oldVersions.map((v) => v._id) } });
    }

    // Embed in CV document (keep last 5 lightweight snapshots)
    if (!Array.isArray(cvDoc.versionSnapshots)) {
      cvDoc.versionSnapshots = [];
    }
    cvDoc.versionSnapshots.push({
      versionNumber: cvDoc.version || 1,
      label: label || `Snapshot v${cvDoc.version || 1}`,
      createdAt: new Date(),
      templateId: cvDoc.templateId,
      snapshot: plain,
    });
    if (cvDoc.versionSnapshots.length > 5) {
      cvDoc.versionSnapshots = cvDoc.versionSnapshots.slice(-5);
    }
    await cvDoc.save();
  } catch (err) {
    console.warn('Version checkpoint skipped:', err.message);
  }
};

// @desc    Get user's active or trashed CVs
// @route   GET /api/cvs
// @access  Private
export const getCVs = async (req, res, next) => {
  try {
    const showTrash = req.query.trash === 'true';
    const search = String(req.query.search || '').trim();

    const query = {
      userId: req.user.id,
      isDeleted: showTrash ? true : { $ne: true },
    };

    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: rx },
        { 'personalInfo.fullName': rx },
        { 'personalInfo.jobTitle': rx },
      ];
    }

    const cvs = await CV.find(query)
      .sort({ updatedAt: -1 })
      .select(
        'title templateId category isOnePage isExportUnlocked unlockType unlockedAt pdfExportCount docxExportCount lastExportedAt isDeleted deletedAt updatedAt createdAt version personalInfo.fullName personalInfo.jobTitle personalInfo.email design.primaryColor versionSnapshots'
      );

    res.status(200).json({
      success: true,
      count: cvs.length,
      data: cvs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent user activity history across documents and exports
// @route   GET /api/cvs/activity
// @access  Private
export const getRecentActivity = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const logs = await CVActivity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single full CV by ID (strict owner check)
// @route   GET /api/cvs/:id
// @access  Private
export const getCVById = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV document not found',
      });
    }

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new persistent CV document in MongoDB
// @route   POST /api/cvs
// @access  Private
export const createCV = async (req, res, next) => {
  try {
    const allowedData = pickAllowedCVData(req.body || {});
    if (!allowedData.templateId) {
      allowedData.templateId = 'onepage-fresher-clean';
      const meta = resolveTemplateMeta(allowedData.templateId);
      allowedData.category = meta.category;
      allowedData.isOnePage = Boolean(meta.isOnePage);
    }

    const cv = await CV.create({
      ...allowedData,
      userId: req.user.id,
      isExportUnlocked: false,
      unlockType: 'none',
      version: 1,
    });

    await createSnapshotRecord(cv, 'Initial Creation');
    await logActivity({
      userId: req.user.id,
      cvId: cv._id,
      cvTitle: cv.title,
      action: 'created',
      details: `Created with template ${resolveTemplateMeta(cv.templateId).name}`,
    });

    res.status(201).json({
      success: true,
      data: cv,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update CV document with allowlisted fields, conflict check & version history
// @route   PUT /api/cvs/:id
// @access  Private
export const updateCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV document not found',
      });
    }

    const { expectedVersion, createSnapshot, snapshotLabel } = req.body || {};
    if (
      typeof expectedVersion === 'number' &&
      expectedVersion > 0 &&
      cv.version !== expectedVersion &&
      !req.body?.forceOverwrite
    ) {
      return res.status(409).json({
        success: false,
        code: 'VERSION_CONFLICT',
        message:
          'This CV was updated on another device or browser tab. Reload the latest version or choose Save Anyway.',
        serverVersion: cv.version,
        serverUpdatedAt: cv.updatedAt,
      });
    }

    const prevTitle = cv.title;
    const prevTemplate = cv.templateId;
    const updates = pickAllowedCVData(req.body || {});

    Object.assign(cv, updates);
    cv.version = (cv.version || 1) + 1;
    if (cv.isDeleted && req.body?.restoreOnSave) {
      cv.isDeleted = false;
      cv.deletedAt = null;
    }

    await cv.save();

    if (createSnapshot || cv.version % 5 === 0 || updates.templateId && updates.templateId !== prevTemplate) {
      await createSnapshotRecord(cv, snapshotLabel || (updates.templateId && updates.templateId !== prevTemplate ? `Switched to ${cv.templateId}` : `Version ${cv.version}`));
    }

    if (updates.title && updates.title !== prevTitle) {
      await logActivity({
        userId: req.user.id,
        cvId: cv._id,
        cvTitle: cv.title,
        action: 'renamed',
        details: `Renamed from "${prevTitle}" to "${cv.title}"`,
      });
    } else if (updates.templateId && updates.templateId !== prevTemplate) {
      await logActivity({
        userId: req.user.id,
        cvId: cv._id,
        cvTitle: cv.title,
        action: 'template_changed',
        details: `Changed template to ${resolveTemplateMeta(cv.templateId).name}`,
      });
    } else if (createSnapshot) {
      await logActivity({
        userId: req.user.id,
        cvId: cv._id,
        cvTitle: cv.title,
        action: 'updated',
        details: 'Saved manual checkpoint',
      });
    }

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Duplicate an existing CV into a new independent document (resets export lock)
// @route   POST /api/cvs/:id/duplicate
// @access  Private
export const duplicateCV = async (req, res, next) => {
  try {
    const sourceCV = await CV.findOne({ _id: req.params.id, userId: req.user.id });

    if (!sourceCV) {
      return res.status(404).json({
        success: false,
        message: 'CV document not found',
      });
    }

    const clonedData = sourceCV.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.__v;

    const duplicatedCV = await CV.create({
      ...clonedData,
      userId: req.user.id,
      title: `${sourceCV.title} (Copy)`,
      isExportUnlocked: false,
      unlockType: 'none',
      unlockedAt: null,
      pdfExportCount: 0,
      docxExportCount: 0,
      lastExportedAt: null,
      isDeleted: false,
      deletedAt: null,
      version: 1,
    });

    await createSnapshotRecord(duplicatedCV, 'Duplicated Copy');
    await logActivity({
      userId: req.user.id,
      cvId: duplicatedCV._id,
      cvTitle: duplicatedCV.title,
      action: 'duplicated',
      details: `Duplicated from "${sourceCV.title}"`,
    });

    res.status(201).json({
      success: true,
      data: duplicatedCV,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Soft-delete CV to Trash (or permanent delete if ?permanent=true)
// @route   DELETE /api/cvs/:id
// @access  Private
export const deleteCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV document not found',
      });
    }

    const permanent = req.query.permanent === 'true';

    if (permanent) {
      await CV.deleteOne({ _id: cv._id, userId: req.user.id });
      await CVVersion.deleteMany({ cvId: cv._id });
      await logActivity({
        userId: req.user.id,
        cvId: cv._id,
        cvTitle: cv.title,
        action: 'deleted',
        details: 'Permanently deleted from Trash',
      });
      return res.status(200).json({
        success: true,
        permanent: true,
        message: 'CV permanently deleted.',
      });
    }

    cv.isDeleted = true;
    cv.deletedAt = new Date();
    await cv.save();

    await logActivity({
      userId: req.user.id,
      cvId: cv._id,
      cvTitle: cv.title,
      action: 'deleted',
      details: 'Moved document to Trash',
    });

    res.status(200).json({
      success: true,
      permanent: false,
      message: 'CV moved to Trash. You can restore it anytime.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Restore a soft-deleted CV from Trash
// @route   POST /api/cvs/:id/restore
// @access  Private
export const restoreCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV document not found',
      });
    }

    cv.isDeleted = false;
    cv.deletedAt = null;
    await cv.save();

    await logActivity({
      userId: req.user.id,
      cvId: cv._id,
      cvTitle: cv.title,
      action: 'restored',
      details: 'Restored document from Trash',
    });

    res.status(200).json({
      success: true,
      data: cv,
      message: 'CV restored successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get saved version checkpoints for a CV (Embedded snapshots + CVVersion collection)
// @route   GET /api/cvs/:id/versions
// @access  Private
export const getCVVersions = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cv || cv.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'CV document not found' });
    }

    const dbVersions = await CVVersion.find({ cvId: cv._id, userId: req.user.id })
      .sort({ version: -1 })
      .select('version label title templateId createdAt');

    // Merge embedded document versionSnapshots
    const embedded = (cv.versionSnapshots || []).map((s) => ({
      _id: s._id,
      version: s.versionNumber,
      label: s.label,
      title: cv.title,
      templateId: s.templateId || cv.templateId,
      createdAt: s.createdAt,
      isEmbedded: true,
    }));

    const seen = new Set();
    const combined = [];
    for (const v of [...embedded, ...dbVersions]) {
      const key = `${v.version}-${v.label}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(v);
      }
    }
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: combined.length,
      data: combined.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a manual version checkpoint
// @route   POST /api/cvs/:id/versions
// @access  Private
export const createManualCheckpoint = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cv || cv.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'CV document not found' });
    }

    const label = String(req.body?.label || `Checkpoint v${cv.version}`).trim();
    await createSnapshotRecord(cv, label);

    res.status(201).json({
      success: true,
      message: 'Version checkpoint saved.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Restore a CV document to a saved snapshot version
// @route   POST /api/cvs/:id/versions/:versionId/restore
// @access  Private
export const restoreCVVersion = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cv || cv.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ success: false, message: 'CV document not found' });
    }

    let targetSnapshot = null;
    let targetVersionNum = 1;

    // First check CVVersion collection
    const targetVersion = await CVVersion.findOne({
      _id: req.params.versionId,
      cvId: cv._id,
      userId: req.user.id,
    });

    if (targetVersion) {
      targetSnapshot = targetVersion.snapshot;
      targetVersionNum = targetVersion.version;
    } else if (Array.isArray(cv.versionSnapshots)) {
      // Check embedded snapshots by _id or versionNumber
      const found = cv.versionSnapshots.find(
        (s) => String(s._id) === String(req.params.versionId) || String(s.versionNumber) === String(req.params.versionId)
      );
      if (found) {
        targetSnapshot = found.snapshot;
        targetVersionNum = found.versionNumber;
      }
    }

    if (!targetSnapshot) {
      return res.status(404).json({ success: false, message: 'Version snapshot not found' });
    }

    const allowedSnapshot = pickAllowedCVData(targetSnapshot || {});
    Object.assign(cv, allowedSnapshot);
    cv.version = (cv.version || 1) + 1;
    await cv.save();

    await createSnapshotRecord(cv, `Restored from v${targetVersionNum}`);
    await logActivity({
      userId: req.user.id,
      cvId: cv._id,
      cvTitle: cv.title,
      action: 'restored',
      details: `Restored content to snapshot v${targetVersionNum}`,
    });

    res.status(200).json({
      success: true,
      data: cv,
      message: `Restored document to v${targetVersionNum}.`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile photo with strict MIME and size enforcement
// @route   POST /api/cvs/upload-photo
// @access  Private
export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const mime = req.file.mimetype;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(mime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Allowed formats: image/jpeg, image/png, image/webp.',
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 5MB.',
      });
    }

    const base64 = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    return res.status(200).json({
      success: true,
      photoUrl: base64,
      size: req.file.size,
      mimetype: mime,
    });
  } catch (err) {
    next(err);
  }
};
