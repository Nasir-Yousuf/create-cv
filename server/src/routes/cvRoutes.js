import express from 'express';
import {
  getCVs,
  getCVById,
  createCV,
  updateCV,
  duplicateCV,
  deleteCV,
} from '../controllers/cvController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// All CV routes are protected by authGuard
router.use(authGuard);

router.route('/')
  .get(getCVs)
  .post(createCV);

router.route('/:id')
  .get(getCVById)
  .put(updateCV)
  .delete(deleteCV);

router.post('/:id/duplicate', duplicateCV);

export default router;

