import express from 'express';
import {
  getPaymentConfig,
  getMyEntitlements,
  submitPayment,
  getMyPayments,
} from '../controllers/paymentController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// Public non-sensitive checkout metadata (bKash number & ৳10 fee info)
router.get('/config', getPaymentConfig);

// Authenticated user payment & entitlement endpoints
router.get('/entitlements', authGuard, getMyEntitlements);
router.post('/submit', authGuard, submitPayment);
router.get('/my-payments', authGuard, getMyPayments);

export default router;
