import express from 'express';
import {
  getCVs,
  getRecentActivity,
  getCVById,
  createCV,
  updateCV,
  duplicateCV,
  deleteCV,
  restoreCV,
  getCVVersions,
  createManualCheckpoint,
  restoreCVVersion,
} from '../controllers/cvController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

router.use(authGuard);

router.get('/activity', getRecentActivity);

router.route('/')
  .get(getCVs)
  .post(createCV);

router.route('/:id')
  .get(getCVById)
  .put(updateCV)
  .delete(deleteCV);

router.post('/:id/duplicate', duplicateCV);
router.post('/:id/restore', restoreCV);

router.route('/:id/versions')
  .get(getCVVersions)
  .post(createManualCheckpoint);

router.post('/:id/versions/:versionId/restore', restoreCVVersion);

export default router;
