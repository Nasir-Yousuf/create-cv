import express from 'express';
import { exportPDF, exportDOCX, exportPDFFallbackRecord } from '../controllers/exportController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

router.post('/pdf', authGuard, exportPDF);
router.post('/pdf/record-fallback', authGuard, exportPDFFallbackRecord);
router.post('/docx', authGuard, exportDOCX);

export default router;
