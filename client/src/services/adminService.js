import api from './api';

export const adminService = {
  async getAnalytics() {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  async getUsers({ q = '', status = 'all' } = {}) {
    const res = await api.get('/admin/users', { params: { q, status } });
    return res.data;
  },

  async getUserDetail(userId) {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data;
  },

  async updateUserStatus(userId, status) {
    const res = await api.patch(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  async grantEntitlement(userId, addPaidCredits = 1) {
    const res = await api.patch(`/admin/users/${userId}/entitlements`, { addPaidCredits });
    return res.data;
  },

  async getPayments({ q = '', status = 'all' } = {}) {
    const res = await api.get('/admin/payments', { params: { q, status } });
    return res.data;
  },

  async approvePayment(paymentId) {
    const res = await api.post(`/admin/payments/${paymentId}/approve`);
    return res.data;
  },

  async rejectPayment(paymentId, reason = '') {
    const res = await api.post(`/admin/payments/${paymentId}/reject`, { reason });
    return res.data;
  },

  async getActivity(limit = 40) {
    const res = await api.get('/admin/activity', { params: { limit } });
    return res.data;
  },

  async getTemplates() {
    const res = await api.get('/admin/templates');
    return res.data;
  },

  async updateTemplate(templateId, updates) {
    const res = await api.patch(`/admin/templates/${templateId}`, updates);
    return res.data;
  },
};

export default adminService;

