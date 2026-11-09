import api from './api';

export const exportService = {
  // Export genuine high-resolution PDF
  async exportPDF(cvData) {
    const res = await api.post('/export/pdf', { cvData }, {
      responseType: 'blob',
    });
    return res.data;
  },

  // Export genuine DOCX document
  async exportDOCX(cvData) {
    const res = await api.post('/export/docx', { cvData }, {
      responseType: 'blob',
    });
    return res.data;
  },
};

export default exportService;

