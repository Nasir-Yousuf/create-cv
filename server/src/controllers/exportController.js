import { generatePDF } from '../services/pdf/pdfService.js';
import { generateDOCX } from '../services/docx/docxService.js';

/**
 * Validates baseline CV data required for export.
 */
const validateCvData = (cvData) => {
  if (!cvData || typeof cvData !== 'object') {
    return { valid: false, message: 'Invalid CV data payload: Expected a JSON object.' };
  }
  return { valid: true };
};

/**
 * Generates a safe file attachment name.
 */
const getSafeFilename = (cvData, extension) => {
  const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
  const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
  return `${cleanName}.${extension}`;
};

export const exportPDF = async (req, res, next) => {
  const requestId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startTime = Date.now();

  try {
    const { cvData, html } = req.body || {};

    const validation = validateCvData(cvData);
    if (!validation.valid) {
      console.warn(`[${requestId}] Validation Error: ${validation.message}`);
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const templateId = cvData.templateId || 'bd-corporate-standard';
    console.log(
      `[${requestId}] Starting PDF generation (Template: ${templateId}, HasClientHtml: ${Boolean(
        html && html.length > 50
      )})`
    );

    const pdfBuffer = await generatePDF(cvData, html || '');

    if (!pdfBuffer || pdfBuffer.length < 5000) {
      throw new Error(`Generated PDF validation failed: Buffer is too small (${pdfBuffer ? pdfBuffer.length : 0} bytes).`);
    }

    const filename = getSafeFilename(cvData, 'pdf');
    const duration = Date.now() - startTime;
    console.log(
      `[${requestId}] PDF generated successfully in ${duration}ms (${(pdfBuffer.length / 1024).toFixed(1)} KB)`
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': pdfBuffer.length,
      'X-Export-Request-Id': requestId,
      'X-Export-Duration-Ms': duration.toString(),
    });

    res.end(pdfBuffer);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] PDF Export Error after ${duration}ms:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF document. Please try again.',
      requestId,
    });
  }
};

export const exportDOCX = async (req, res, next) => {
  const requestId = `docx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startTime = Date.now();

  try {
    const { cvData } = req.body || {};

    const validation = validateCvData(cvData);
    if (!validation.valid) {
      console.warn(`[${requestId}] Validation Error: ${validation.message}`);
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const templateId = cvData.templateId || 'bd-corporate-standard';
    console.log(`[${requestId}] Starting DOCX generation (Template: ${templateId})`);

    const docxBuffer = await generateDOCX(cvData);

    if (!docxBuffer || docxBuffer.length < 3000) {
      throw new Error(`Generated DOCX validation failed: Buffer is too small (${docxBuffer ? docxBuffer.length : 0} bytes).`);
    }

    const filename = getSafeFilename(cvData, 'docx');
    const duration = Date.now() - startTime;
    console.log(
      `[${requestId}] DOCX generated successfully in ${duration}ms (${(docxBuffer.length / 1024).toFixed(1)} KB)`
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': docxBuffer.length,
      'X-Export-Request-Id': requestId,
      'X-Export-Duration-Ms': duration.toString(),
    });

    res.end(docxBuffer);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] DOCX Export Error after ${duration}ms:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate DOCX document. Please try again.',
      requestId,
    });
  }
};

export default { exportPDF, exportDOCX };
