import express from 'express';
import {
  getAdminAnalytics,
  getAdminUsers,
  getAdminUserDetail,
  updateUserStatus,
  grantUserEntitlement,
  getAdminPayments,
  approvePayment,
  rejectPayment,
  getAdminActivity,
  getAdminTemplates,
  updateAdminTemplate,
} from '../controllers/adminController.js';
import { authGuard, adminGuard } from '../middleware/authGuard.js';

const router = express.Router();

// Strictly require both authenticated JWT AND admin role for every route below
router.use(authGuard, adminGuard);

router.get('/analytics', getAdminAnalytics);
router.get('/activity', getAdminActivity);

router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserDetail);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/entitlements', grantUserEntitlement);

router.get('/payments', getAdminPayments);
router.post('/payments/:id/approve', approvePayment);
router.post('/payments/:id/reject', rejectPayment);

router.get('/templates', getAdminTemplates);
router.patch('/templates/:templateId', updateAdminTemplate);

export default router;

