import api from './api';

export const cvService = {
  async getCVs() {
    const res = await api.get('/cvs');
    return res.data;
  },

  async getCVById(id) {
    const res = await api.get(`/cvs/${id}`);
    return res.data;
  },

  async createCV(cvData) {
    const res = await api.post('/cvs', cvData);
    return res.data;
  },

  async updateCV(id, cvData) {
    const res = await api.put(`/cvs/${id}`, cvData);
    return res.data;
  },

  async duplicateCV(id) {
    const res = await api.post(`/cvs/${id}/duplicate`);
    return res.data;
  },

  async deleteCV(id) {
    const res = await api.delete(`/cvs/${id}`);
    return res.data;
  },

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await api.post('/cvs/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default cvService;

