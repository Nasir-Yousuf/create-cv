import express from 'express';
import { exportPDF, exportDOCX } from '../controllers/exportController.js';

const router = express.Router();

router.post('/pdf', exportPDF);
router.post('/docx', exportDOCX);

export default router;

