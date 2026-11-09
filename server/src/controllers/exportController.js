import { generatePDF } from '../services/pdf/pdfService.js';
import { generateDOCX } from '../services/docx/docxService.js';

export const exportPDF = async (req, res, next) => {
  try {
    const { cvData, html } = req.body;

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: 'No CV data provided for export.',
      });
    }

    const pdfBuffer = await generatePDF(cvData, html || '');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        cvData.title || 'Resume'
      )}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Export Error:', error);
    next(error);
  }
};

export const exportDOCX = async (req, res, next) => {
  try {
    const { cvData } = req.body;

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: 'No CV data provided for export.',
      });
    }

    const docxBuffer = await generateDOCX(cvData);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        cvData.title || 'Resume'
      )}.docx"`,
      'Content-Length': docxBuffer.length,
    });

    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX Export Error:', error);
    next(error);
  }
};
