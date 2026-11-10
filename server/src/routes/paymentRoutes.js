import express from 'express';
import {
  submitPayment,
  checkPaymentStatus,
  applyCoupon,
  adminGetPayments,
  adminApprovePayment,
  adminRejectPayment,
  adminDeletePayment,
  adminVerifyPasskey,
} from '../controllers/paymentController.js';

const router = express.Router();

// Public user endpoints
router.post('/submit', submitPayment);
router.get('/check-status', checkPaymentStatus);
router.post('/coupon', applyCoupon);

// Admin endpoints
router.post('/admin/verify-passkey', adminVerifyPasskey);
router.get('/admin/all', adminGetPayments);
router.patch('/admin/:id/approve', adminApprovePayment);
router.patch('/admin/:id/reject', adminRejectPayment);
router.delete('/admin/:id', adminDeletePayment);

export default router;
