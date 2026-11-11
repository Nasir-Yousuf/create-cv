import api from './api';

export const paymentService = {
  async getPaymentConfig() {
    const res = await api.get('/payment/config');
    return res.data;
  },

  async getEntitlements() {
    const res = await api.get('/payment/entitlements');
    return res.data;
  },

  async submitPayment({ phoneNumber, transactionId, cvId = null, notes = '' }) {
    const res = await api.post('/payment/submit', {
      phoneNumber,
      transactionId: String(transactionId || '').trim().toUpperCase(),
      cvId,
      notes,
    });
    return res.data;
  },

  async getMyPayments() {
    const res = await api.get('/payment/my-payments');
    return res.data;
  },

  /**
   * Computes client-side quick check whether exporting `cvDoc` can proceed immediately
   * without triggering the ৳10 manual bKash payment modal.
   * Server always performs authoritative verification before generating PDF/DOCX.
   */
  canExportWithoutPayment(user, cvDoc = null) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (cvDoc?.isExportUnlocked) return true;
    const freeLeft = Number(user.freeExportsRemaining || 0);
    const paidLeft = Number(user.paidExportCredits || 0);
    return freeLeft + paidLeft > 0;
  },
};

export default paymentService;
