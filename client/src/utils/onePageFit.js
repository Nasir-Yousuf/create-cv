import { resolveTemplateMeta } from '@shared/constants/cvDefaults.js';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1122;
export const LETTER_HEIGHT_PX = 1056;

const countWords = (text) =>
  String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

/**
 * Estimates total content density from structured CV data without mutating or truncating anything.
 */
export const estimateCVContentDensity = (cvData = {}) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    customSections = [],
  } = cvData || {};

  let words = countWords(personalInfo.summary);
  experience.forEach((exp) => {
    words += countWords(exp.jobTitle) + countWords(exp.company) + countWords(exp.description);
    (exp.highlights || []).forEach((h) => {
      words += countWords(h);
    });
  });
  education.forEach((edu) => {
    words += countWords(edu.degree) + countWords(edu.institution);
  });
  projects.forEach((proj) => {
    words += countWords(proj.name) + countWords(proj.description);
  });
  certifications.forEach((c) => {
    words += countWords(c.name) + countWords(c.issuer);
  });
  customSections.forEach((s) => {
    words += countWords(s.title) + countWords(s.content);
  });
  words += skills.length * 2;

  return {
    words,
    experienceCount: experience.length,
    educationCount: education.length,
    projectCount: projects.length,
    skillsCount: skills.length,
    extraSectionsCount: customSections.length,
  };
};

/**
 * Analyzes whether the current CV fits smoothly onto a single page (when using a One-Page template).
 * Never deletes, hides, or clips user data — only provides non-destructive guidance.
 */
export const analyzeOnePageFit = (cvData, sheetElement = null) => {
  const meta = resolveTemplateMeta(cvData?.templateId);
  if (!meta?.isOnePage) {
    return {
      isOnePageTemplate: false,
      status: 'multi-page',
      percentUsed: 0,
      measuredHeightPx: sheetElement?.scrollHeight || null,
      suggestions: [],
    };
  }

  const pageLimitPx =
    cvData?.design?.pageSize === 'Letter' ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;
  const density = estimateCVContentDensity(cvData);
  const guidance = meta.pageGuidance || {};
  const maxWords = guidance.recommendedMaxWords || 440;

  let measuredHeightPx = null;
  if (sheetElement && typeof sheetElement.scrollHeight === 'number' && sheetElement.scrollHeight > 100) {
    measuredHeightPx = sheetElement.scrollHeight;
  }

  const ratio = measuredHeightPx
    ? measuredHeightPx / pageLimitPx
    : density.words / maxWords;
  const percentUsed = Math.round(ratio * 100);

  let status = 'optimal';
  if (ratio > 1.01) {
    status = 'overflow';
  } else if (ratio >= 0.88) {
    status = 'tight';
  }

  const suggestions = [];
  if (status === 'overflow' || status === 'tight') {
    if (density.words > maxWords) {
      suggestions.push(
        `Content is ~${density.words} words (1-page ideal is ~${maxWords} words). Tightening summary or repetitive bullets helps keep a clean 1-page balance.`
      );
    }
    if (density.experienceCount > (guidance.maxExperienceItems || 3)) {
      suggestions.push(
        `You have ${density.experienceCount} experience entries. Keep older/less relevant roles in a Multiple-Page CV or summarize briefly.`
      );
    }
    if (density.projectCount > 3) {
      suggestions.push(
        `Listing your top 2-3 flagship projects keeps the page sharp and scannable.`
      );
    }
    if (status === 'overflow') {
      suggestions.push(
        'Nothing is deleted—all content remains safe. Prefer keeping everything? Switch seamlessly to a Multiple-Page CV template.'
      );
    }
  }

  return {
    isOnePageTemplate: true,
    status, // 'optimal' | 'tight' | 'overflow'
    percentUsed,
    measuredHeightPx,
    pageLimitPx,
    estimatedPages: measuredHeightPx ? Math.max(1, Math.ceil(measuredHeightPx / pageLimitPx)) : ratio > 1.01 ? 2 : 1,
    wordCount: density.words,
    recommendedMaxWords: maxWords,
    suggestions,
  };
};

