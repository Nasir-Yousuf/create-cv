import express from 'express';
import {
  handleImproveSummary,
  handleRewriteObjective,
  handleImproveExperience,
  handleFixGrammar,
  handleSuggestSkills,
  handleMatchJob,
  handleDetectIssues,
  handleGenerateSummary,
  handleReviewCV,
} from '../controllers/aiController.js';

const router = express.Router();

// Contextual AI actions
router.post('/improve-summary', handleImproveSummary);
router.post('/rewrite-objective', handleRewriteObjective);
router.post('/improve-experience', handleImproveExperience);
router.post('/fix-grammar', handleFixGrammar);
router.post('/suggest-skills', handleSuggestSkills);
router.post('/match-job', handleMatchJob);
router.post('/detect-issues', handleDetectIssues);

// Backward-compatible endpoints
router.post('/generate-summary', handleGenerateSummary);
router.post('/review-cv', handleReviewCV);

export default router;
