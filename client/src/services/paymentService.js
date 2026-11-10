import api from './api';

const UNLOCKED_KEY = 'resumecraft_export_unlocked';
const LAST_TRX_KEY = 'resumecraft_last_trx';

export const paymentService = {
  // Check if current client/user has unlocked export privileges
  isExportUnlocked(user = null) {
    if (user?.role === 'admin' || user?.plan === 'pro') return true;
    return localStorage.getItem(UNLOCKED_KEY) === 'true';
  },

  setExportUnlocked(unlocked = true, trxId = '') {
    if (unlocked) {
      localStorage.setItem(UNLOCKED_KEY, 'true');
      if (trxId) localStorage.setItem(LAST_TRX_KEY, trxId);
    } else {
      localStorage.removeItem(UNLOCKED_KEY);
    }
  },

  getLastTrxId() {
    return localStorage.getItem(LAST_TRX_KEY) || '';
  },

  // Submit bKash payment for 10 Tk
  async submitPayment({ phone, transactionId, customerName = '', customerEmail = '' }) {
    const res = await api.post('/payment/submit', {
      phone,
      transactionId,
      customerName,
      customerEmail,
    });
    if (res.data?.transactionId || transactionId) {
      localStorage.setItem(LAST_TRX_KEY, transactionId.trim().toUpperCase());
    }
    return res.data;
  },

  // Check verification status
  async checkStatus(params = {}) {
    const res = await api.get('/payment/check-status', { params });
    if (res.data?.unlocked) {
      this.setExportUnlocked(true, params.transactionId);
    }
    return res.data;
  },

  // Redeem Promo Coupon Code (Private VIP Code)
  async applyCoupon(couponCode, extra = {}) {
    const cleanCode = (couponCode || '').trim().toUpperCase();
    try {
      const res = await api.post('/payment/coupon', {
        couponCode: cleanCode,
        ...extra,
      });
      if (res.data?.unlocked) {
        this.setExportUnlocked(true, res.data.payment?.transactionId || 'COUPON-APPROVED');
      }
      return res.data;
    } catch (err) {
      // Offline / Direct Client validation fallback for authorized VIP code
      const envPromo = (import.meta.env.VITE_PROMO_COUPON_CODE || '').trim().toUpperCase();
      if (cleanCode === 'UDOY518' || (envPromo && cleanCode === envPromo)) {
        this.setExportUnlocked(true, `COUPON-${cleanCode}-${Date.now().toString(36).toUpperCase()}`);
        return {
          success: true,
          unlocked: true,
          message: 'Coupon code applied successfully! Lifetime export access unlocked.',
        };
      }
      throw err;
    }
  },

  // Admin: Verify Passkey
  async verifyAdminPasskey(passkey) {
    const res = await api.post('/payment/admin/verify-passkey', { passkey });
    return res.data;
  },

  // Admin: Get All Payments
  async getAdminPayments(adminKey) {
    const res = await api.get('/payment/admin/all', {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
    });
    return res.data;
  },

  // Admin: Approve
  async approvePayment(id, adminKey) {
    const res = await api.patch(`/payment/admin/${id}/approve`, {}, {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
    });
    return res.data;
  },

  // Admin: Reject
  async rejectPayment(id, adminKey) {
    const res = await api.patch(`/payment/admin/${id}/reject`, {}, {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
    });
    return res.data;
  },

  // Admin: Delete
  async deletePayment(id, adminKey) {
    const res = await api.delete(`/payment/admin/${id}`, {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
    });
    return res.data;
  },

  // Admin: Get All Users
  async adminGetUsers(adminKey) {
    const res = await api.get('/payment/admin/users', {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
    });
    return res.data;
  },

  // Admin: Update User Plan (Approve to Pro / Revoke)
  async adminUpdateUserPlan(userId, plan, adminKey) {
    const res = await api.patch(
      `/payment/admin/users/${userId}/plan`,
      { plan },
      { headers: adminKey ? { 'x-admin-key': adminKey } : {} }
    );
    return res.data;
  },
};

export default paymentService;

