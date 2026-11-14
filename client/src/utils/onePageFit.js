import { resolveTemplateMeta } from '@shared/constants/cvDefaults.js';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1122; // 297mm at 96 DPI = 1122.5px
export const LETTER_HEIGHT_PX = 1056; // 11in at 96 DPI = 1056px
export const MIN_READABLE_FIT_SCALE = 0.86;

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
 * Deterministic 3-Step Auto-Fit Engine for Strict One-Page CVs.
 * Shared between the Live Browser Preview, Puppeteer Print Evaluation, and Client Fallback.
 *
 * Step A: Measure inner content against the 297mm (1122px) budget. If fits, keep 100% scale.
 * Step B: If content slightly overflows (up to 15%), progressively tighten CSS custom properties
 *         --cv-section-gap, --cv-item-gap, and --cv-line-height before touching font size.
 * Step C: If still overflowing, apply proportional layout scale (--cv-fit-scale) down to floor 0.86.
 * Step D: Calculate whether content overflows beyond the minimum readable floor (isOverflowingBeyondLimit).
 */
export const applyOnePageAutoFit = (sheetElement, isLetter = false) => {
  if (!sheetElement) return null;

  const targetHeight = isLetter ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;

  // Reset any previous auto-fit styles to measure pure natural height
  sheetElement.style.setProperty('--cv-section-gap', '');
  sheetElement.style.setProperty('--cv-item-gap', '');
  sheetElement.style.setProperty('--cv-line-height', '');
  sheetElement.style.setProperty('--cv-fit-scale', '1');
  sheetElement.style.zoom = '1';
  sheetElement.style.maxHeight = 'none';
  sheetElement.style.overflow = 'visible';

  const naturalHeight = sheetElement.scrollHeight || sheetElement.offsetHeight;

  // Step A: Content fits within single page budget (1122px)
  if (naturalHeight <= targetHeight + 3) {
    sheetElement.style.setProperty('--cv-section-gap', '0.75rem');
    sheetElement.style.setProperty('--cv-item-gap', '0.45rem');
    sheetElement.style.setProperty('--cv-line-height', '1.375');
    sheetElement.style.setProperty('--cv-fit-scale', '1');
    sheetElement.style.zoom = '1';
    sheetElement.style.maxHeight = `${targetHeight}px`;
    sheetElement.style.overflow = 'hidden';

    return {
      step: 'A',
      naturalHeight,
      effectiveHeight: naturalHeight,
      targetHeight,
      fitScale: 1,
      isOverflowingBeyondLimit: false,
      appliedSectionGap: '0.75rem',
      appliedItemGap: '0.45rem',
      appliedLineHeight: '1.375',
    };
  }

  // Step B: Progressively tighten section/item spacing and line-height (handles up to ~15% overflow)
  const overflowPx = naturalHeight - targetHeight;
  const tighteningFactor = Math.min(1.0, Math.max(0.1, overflowPx / (targetHeight * 0.15)));

  const sectionGapRem = (0.75 - tighteningFactor * 0.33).toFixed(3);
  const itemGapRem = (0.45 - tighteningFactor * 0.20).toFixed(3);
  const lineHeightVal = (1.375 - tighteningFactor * 0.155).toFixed(3);

  const sectionGapStr = `${sectionGapRem}rem`;
  const itemGapStr = `${itemGapRem}rem`;

  sheetElement.style.setProperty('--cv-section-gap', sectionGapStr);
  sheetElement.style.setProperty('--cv-item-gap', itemGapStr);
  sheetElement.style.setProperty('--cv-line-height', lineHeightVal);

  const tightenedHeight = sheetElement.scrollHeight || sheetElement.offsetHeight;

  if (tightenedHeight <= targetHeight + 3) {
    sheetElement.style.setProperty('--cv-fit-scale', '1');
    sheetElement.style.zoom = '1';
    sheetElement.style.maxHeight = `${targetHeight}px`;
    sheetElement.style.overflow = 'hidden';

    return {
      step: 'B',
      naturalHeight,
      effectiveHeight: tightenedHeight,
      targetHeight,
      fitScale: 1,
      isOverflowingBeyondLimit: false,
      appliedSectionGap: sectionGapStr,
      appliedItemGap: itemGapStr,
      appliedLineHeight: lineHeightVal,
    };
  }

  // Step C: Content still overflows -> apply proportional layout scale down to minimum floor 0.86
  const rawScale = (targetHeight - 2) / tightenedHeight;
  const fitScale = Math.max(MIN_READABLE_FIT_SCALE, Math.min(1.0, Math.floor(rawScale * 1000) / 1000));

  sheetElement.style.setProperty('--cv-fit-scale', String(fitScale));
  sheetElement.style.zoom = String(fitScale);
  sheetElement.style.maxHeight = `${targetHeight}px`;
  sheetElement.style.overflow = 'hidden';

  // Step D: Detect if content overflows beyond the minimum readable scale floor of 0.86
  const scaledContentHeight = tightenedHeight * fitScale;
  const isOverflowingBeyondLimit = Boolean(
    scaledContentHeight > targetHeight + 10 || naturalHeight > targetHeight * 1.30
  );

  return {
    step: 'C',
    naturalHeight,
    effectiveHeight: Math.round(scaledContentHeight),
    targetHeight,
    fitScale,
    isOverflowingBeyondLimit,
    appliedSectionGap: sectionGapStr,
    appliedItemGap: itemGapStr,
    appliedLineHeight: lineHeightVal,
  };
};

/**
 * Analyzes whether the current CV fits smoothly onto a single page (when using a One-Page template).
 * Never deletes, hides, or clips user data — provides non-destructive guidance and executes the auto-fit pass.
 */
export const analyzeOnePageFit = (cvData, sheetElement = null) => {
  const meta = resolveTemplateMeta(cvData?.templateId);
  const isOnePage =
    cvData?.isOnePage !== undefined
      ? Boolean(cvData.isOnePage)
      : Boolean(
          meta?.isOnePage ||
            cvData?.category === 'One-Page CVs' ||
            meta?.categories?.includes('One-Page CVs')
        );

  if (!isOnePage) {
    return {
      isOnePageTemplate: false,
      isOverflowingBeyondLimit: false,
      status: 'multi-page',
      percentUsed: 0,
      fitScale: 1,
      autoFitStep: 'none',
      measuredHeightPx: sheetElement?.scrollHeight || null,
      suggestions: [],
    };
  }

  const isLetter = cvData?.design?.pageSize === 'Letter';
  const pageLimitPx = isLetter ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;
  const density = estimateCVContentDensity(cvData);
  const guidance = meta?.pageGuidance || {};
  const maxWords = guidance.recommendedMaxWords || 440;

  // Execute deterministic DOM auto-fit pass if sheetElement is rendered
  let autoFitResult = null;
  if (sheetElement && typeof sheetElement.scrollHeight === 'number' && sheetElement.scrollHeight > 100) {
    autoFitResult = applyOnePageAutoFit(sheetElement, isLetter);
  }

  const measuredHeightPx = autoFitResult ? autoFitResult.naturalHeight : sheetElement?.scrollHeight || null;
  const ratio = measuredHeightPx
    ? measuredHeightPx / pageLimitPx
    : density.words / maxWords;
  const percentUsed = Math.round(ratio * 100);

  let status = 'optimal';
  if (autoFitResult?.isOverflowingBeyondLimit || ratio > 1.15) {
    status = 'overflow';
  } else if (ratio > 1.01 || autoFitResult?.step === 'B' || autoFitResult?.step === 'C') {
    status = 'tight';
  }

  const isOverflowingBeyondLimit = Boolean(
    autoFitResult ? autoFitResult.isOverflowingBeyondLimit : ratio > 1.25 || density.words > maxWords * 1.35
  );

  const suggestions = [];
  if (isOverflowingBeyondLimit) {
    suggestions.push(
      `Content is ~${density.words} words and exceeds a 1-page layout. Switch to a Multiple-Page CV or condense your text to keep it looking sharp.`
    );
  } else if (status === 'tight') {
    suggestions.push(
      `Content is comfortably condensed (~${percentUsed}% capacity). Tightening bullet points helps maintain an airy, executive feel.`
    );
  }

  if (density.experienceCount > (guidance.maxExperienceItems || 4)) {
    suggestions.push(
      `You have ${density.experienceCount} experience entries. For a 1-page CV, focus on your top 2-3 most recent or impactful roles.`
    );
  }
  if (density.projectCount > 3) {
    suggestions.push(
      'Listing 2-3 flagship projects keeps your one-page CV clean and readable.'
    );
  }

  return {
    isOnePageTemplate: true,
    isOverflowingBeyondLimit,
    status, // 'optimal' | 'tight' | 'overflow'
    percentUsed,
    measuredHeightPx,
    pageLimitPx,
    fitScale: autoFitResult?.fitScale || 1,
    autoFitStep: autoFitResult?.step || (ratio > 1.01 ? 'C' : 'A'),
    estimatedPages: measuredHeightPx ? Math.max(1, Math.ceil(measuredHeightPx / pageLimitPx)) : ratio > 1.01 ? 2 : 1,
    wordCount: density.words,
    recommendedMaxWords: maxWords,
    suggestions,
  };
};

