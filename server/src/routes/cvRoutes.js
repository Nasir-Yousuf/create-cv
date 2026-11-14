import express from 'express';
import multer from 'multer';
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
  uploadPhoto,
} from '../controllers/cvController.js';
import { authGuard } from '../middleware/authGuard.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

const router = express.Router();

router.use(authGuard);

router.post('/upload-photo', upload.single('photo'), uploadPhoto);
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
