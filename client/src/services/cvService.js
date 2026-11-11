import api from './api';

export const cvService = {
  async getCVs(options = {}) {
    const params = {};
    if (options.trash) params.trash = 'true';
    if (options.search) params.search = options.search;
    const res = await api.get('/cvs', { params });
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

  async deleteCV(id, { permanent = false } = {}) {
    const res = await api.delete(`/cvs/${id}`, {
      params: permanent ? { permanent: 'true' } : undefined,
    });
    return res.data;
  },

  async restoreCV(id) {
    const res = await api.post(`/cvs/${id}/restore`);
    return res.data;
  },

  async getVersions(id) {
    const res = await api.get(`/cvs/${id}/versions`);
    return res.data;
  },

  async createCheckpoint(id, label) {
    const res = await api.post(`/cvs/${id}/versions`, { label });
    return res.data;
  },

  async restoreVersion(id, versionId) {
    const res = await api.post(`/cvs/${id}/versions/${versionId}/restore`);
    return res.data;
  },

  async getRecentActivity(limit = 20) {
    const res = await api.get('/cvs/activity', { params: { limit } });
    return res.data;
  },
};

export default cvService;
