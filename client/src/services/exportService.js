import api from './api';

export const exportService = {
  // Export genuine high-resolution PDF matching live preview 1:1
  async exportPDF(cvData) {
    const sheetEl = document.getElementById('cv-export-sheet');
    const html = sheetEl ? sheetEl.outerHTML : '';

    const res = await api.post(
      '/export/pdf',
      { cvData, html },
      {
        responseType: 'blob',
      }
    );
    return res.data;
  },

  // Export genuine DOCX document
  async exportDOCX(cvData) {
    const res = await api.post(
      '/export/docx',
      { cvData },
      {
        responseType: 'blob',
      }
    );
    return res.data;
  },
};

export default exportService;
