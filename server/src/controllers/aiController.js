import {
  improveSummary,
  rewriteObjective,
  improveExperience,
  fixGrammarAndConcise,
  suggestSkills,
  matchJobDescription,
  detectCVIssues,
} from '../services/ai/geminiService.js';

/**
 * POST /api/ai/improve-summary
 */
export const handleImproveSummary = async (req, res, next) => {
  try {
    const { text, role, tone, existingCV, cvData } = req.body;
    const result = await improveSummary({
      text,
      role,
      tone,
      existingCV: existingCV || cvData,
    });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/rewrite-objective
 */
export const handleRewriteObjective = async (req, res, next) => {
  try {
    const { text, role, field, education } = req.body;
    const result = await rewriteObjective({ text, role, field, education });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/improve-experience
 */
export const handleImproveExperience = async (req, res, next) => {
  try {
    const { experienceItem, role, targetBullet } = req.body;
    const result = await improveExperience({ experienceItem, role, targetBullet });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/fix-grammar
 */
export const handleFixGrammar = async (req, res, next) => {
  try {
    const { text } = req.body;
    const result = await fixGrammarAndConcise({ text });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/suggest-skills
 */
export const handleSuggestSkills = async (req, res, next) => {
  try {
    const { jobTitle, existingSkills, industry } = req.body;
    const result = await suggestSkills({ jobTitle, existingSkills, industry });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/match-job
 */
export const handleMatchJob = async (req, res, next) => {
  try {
    const { cvData, jobDescription } = req.body;
    const result = await matchJobDescription({ cvData, jobDescription });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/detect-issues
 */
export const handleDetectIssues = async (req, res, next) => {
  try {
    const { cvData } = req.body;
    const result = detectCVIssues(cvData || {});
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/generate-summary (alias for backward compatibility)
 */
export const handleGenerateSummary = async (req, res, next) => {
  try {
    const { cvData, tone, role, prompt } = req.body;
    const text = prompt || cvData?.personalInfo?.summary || '';
    const jobTitle = role || cvData?.personalInfo?.jobTitle || '';
    const result = await improveSummary({ text, role: jobTitle, tone, existingCV: cvData });
    return res.status(200).json({
      success: true,
      data: {
        summary: result.options?.[0]?.text || '',
        options: result.options || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/review-cv
 */
export const handleReviewCV = async (req, res, next) => {
  try {
    const { cvData } = req.body;
    const issuesResult = detectCVIssues(cvData || {});

    // Compute basic score
    const deduction = issuesResult.criticalCount * 15 + issuesResult.warningCount * 5;
    const score = Math.max(40, 100 - deduction);

    return res.status(200).json({
      success: true,
      data: {
        score,
        issues: issuesResult.issues,
        strengths: [
          'Professional modern schema format',
          'Standardized ISO date support',
          'ATS-parseable vector layout',
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  handleImproveSummary,
  handleRewriteObjective,
  handleImproveExperience,
  handleFixGrammar,
  handleSuggestSkills,
  handleMatchJob,
  handleDetectIssues,
  handleGenerateSummary,
  handleReviewCV,
};
