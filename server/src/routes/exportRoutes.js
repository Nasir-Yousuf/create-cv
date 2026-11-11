import express from 'express';
import { exportPDF, exportDOCX } from '../controllers/exportController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

router.post('/pdf', authGuard, exportPDF);
router.post('/docx', authGuard, exportDOCX);

export default router;
