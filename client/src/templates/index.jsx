import React from 'react';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  PREFERRED_CATEGORY_ORDER,
  resolveTemplateId,
  resolveTemplateMeta,
  templateMatchesCategory,
  getDynamicCategories,
  TEMPLATE_ALIAS_COLORS,
} from '@shared/constants/cvDefaults.js';
import { normalizeCvData } from '@shared/utils/cvNormalize.js';
import {
  resolveDesignTokens,
  getSectionVisibility,
  getOrderedSectionKeys,
  CVSection,
  CVSectionTitle,
  CVPersonalDetailsTable,
  CVCustomSections,
  CVDeclaration,
} from './shared/cvElements';
import EditableElement from '../features/cv-editor/components/EditableElement';
import {
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
} from './onepage/onePageShared';

// Multiple-Page Templates
import { BangladeshStandard } from './BangladeshStandard';
import { ExecutiveSlate } from './ExecutiveSlate';
import { OceanSplit } from './OceanSplit';
import { LinearDark } from './LinearDark';
import { ATSClassic } from './ATSClassic';

// Legacy Base Templates (kept internally for backward-compatibility fallback if ever needed)
import { ModernBlue } from './ModernBlue';
import { ModernMinimal } from './ModernMinimal';
import { AppleClean } from './AppleClean';
import { CreativeCoral } from './CreativeCoral';

// Dedicated One-Page Templates (Default Collection)
import { OnePageFresherClean } from './onepage/OnePageFresherClean';
import { OnePageBDCompact } from './onepage/OnePageBDCompact';
import { OnePageModernSplit } from './onepage/OnePageModernSplit';
import { OnePageMinimalSwiss } from './onepage/OnePageMinimalSwiss';
import { OnePageTechGrid } from './onepage/OnePageTechGrid';
import { OnePageITSidebar } from './onepage/OnePageITSidebar';
import { OnePageATSStrict } from './onepage/OnePageATSStrict';
import { OnePageExecutiveBrief } from './onepage/OnePageExecutiveBrief';
import { OnePageAcademicCompact } from './onepage/OnePageAcademicCompact';
import { OnePageCreativeEditorial } from './onepage/OnePageCreativeEditorial';

export const TEMPLATE_COMPONENTS = {
  // Dedicated One-Page Collection (10 Distinct Designs)
  'onepage-fresher-clean': OnePageFresherClean,
  'onepage-bd-compact': OnePageBDCompact,
  'onepage-modern-split': OnePageModernSplit,
  'onepage-minimal-swiss': OnePageMinimalSwiss,
  'onepage-tech-grid': OnePageTechGrid,
  'onepage-it-sidebar': OnePageITSidebar,
  'onepage-ats-strict': OnePageATSStrict,
  'onepage-executive-brief': OnePageExecutiveBrief,
  'onepage-academic-compact': OnePageAcademicCompact,
  'onepage-creative-editorial': OnePageCreativeEditorial,

  // Multiple-Page Collection (5 Distinct Detailed Designs)
  'bd-corporate-standard': BangladeshStandard,
  'executive-slate': ExecutiveSlate,
  'ocean-split': OceanSplit,
  'linear-dark': LinearDark,
  'ats-classic': ATSClassic,

  // Internal legacy references (if referenced explicitly)
  'legacy-modern-blue': ModernBlue,
  'legacy-modern-minimal': ModernMinimal,
  'legacy-apple-clean': AppleClean,
  'legacy-creative-coral': CreativeCoral,
};

export const RenderCVTemplate = ({ cvData, scale = 1, onOpenPhotoModal }) => {
  const rawTemplateId = cvData?.templateId || 'onepage-fresher-clean';
  const resolvedId = resolveTemplateId(rawTemplateId);
  const templateMeta = resolveTemplateMeta(rawTemplateId);
  const layoutArchitecture = templateMeta?.layoutArchitecture || templateMeta?.baseLayout || resolvedId;
  const Component = TEMPLATE_COMPONENTS[resolvedId] || TEMPLATE_COMPONENTS[layoutArchitecture] || OnePageFresherClean;
  const safeCvData = normalizeCvData(cvData);

  // Preserve custom palette or template's designated thumbnailColor
  const aliasColor = TEMPLATE_ALIAS_COLORS[rawTemplateId];
  const templateColor = templateMeta?.thumbnailColor;
  const templateAccent = templateMeta?.accentColor;

  const currentPrimary = safeCvData?.design?.primaryColor;
  const isDefaultPrimary =
    !currentPrimary ||
    currentPrimary === '#2563EB' ||
    currentPrimary === '#2563eb' ||
    currentPrimary === '#059669';

  let appliedPrimary = currentPrimary || '#2563EB';
  let appliedAccent = safeCvData?.design?.accentColor || '#3b82f6';

  if (aliasColor && isDefaultPrimary) {
    appliedPrimary = aliasColor.primaryColor;
    appliedAccent = aliasColor.accentColor;
  } else if (templateColor && isDefaultPrimary) {
    appliedPrimary = templateColor;
    appliedAccent = templateAccent || templateColor;
  }

  const isOnePage =
    cvData?.isOnePage !== undefined
      ? Boolean(cvData.isOnePage)
      : Boolean(
          templateMeta?.isOnePage ||
            cvData?.category === 'One-Page CVs' ||
            templateMeta?.categories?.includes('One-Page CVs')
        );

  const designTokens = resolveDesignTokens(
    {
      ...safeCvData,
      design: {
        ...safeCvData.design,
        primaryColor: appliedPrimary,
        accentColor: appliedAccent,
      },
    },
    templateMeta?.defaultDesignTokens
  );

  const sectionConfig = safeCvData?.sectionConfig || {
    order: safeCvData?.design?.sectionOrder || [
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'projects',
      'certifications',
    ],
    hidden: [],
    bdFields: {
      fatherName: true,
      motherName: true,
      dob: true,
      nid: true,
      maritalStatus: true,
      bloodGroup: true,
      permanentAddress: true,
    },
  };

  const elementOverrides = safeCvData?.elementOverrides || {};

  const mergedCvData = {
    ...safeCvData,
    isOnePage,
    designTokens,
    sectionConfig,
    elementOverrides,
    design: {
      ...safeCvData.design,
      primaryColor: designTokens.primaryColor,
      accentColor: designTokens.accentColor,
    },
  };

  const fontSizeCss =
    designTokens.fontSize === 'compact'
      ? '9.5pt'
      : designTokens.fontSize === 'relaxed'
      ? '11.5pt'
      : typeof designTokens.fontSize === 'number'
      ? `${designTokens.fontSize}pt`
      : '10.5pt';

  const lineSpacingCss =
    designTokens.lineSpacing === 'tight'
      ? '1.25'
      : designTokens.lineSpacing === 'relaxed'
      ? '1.6'
      : typeof designTokens.lineSpacing === 'number'
      ? `${designTokens.lineSpacing}`
      : '1.4';

  return (
    <div
      className="resume-preview-wrapper transition-transform origin-top"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div
        className={`${
          mergedCvData?.design?.pageSize === 'Letter' ? 'resume-sheet-letter' : 'resume-sheet-a4'
        } ${isOnePage ? 'cv-one-page-sheet' : 'cv-multi-page-sheet'} bg-white shadow-2xl rounded-sm`}
        id="cv-export-sheet"
        data-one-page={isOnePage ? 'true' : 'false'}
        style={{
          '--cv-primary': designTokens.primaryColor,
          '--cv-accent': designTokens.accentColor,
          '--cv-heading-color': designTokens.headingColor,
          '--cv-body-color': designTokens.bodyColor,
          '--cv-heading-font': designTokens.headingFont,
          '--cv-body-font': designTokens.bodyFont,
          '--cv-font-size': fontSizeCss,
          '--cv-line-spacing': lineSpacingCss,
          '--cv-section-spacing': `${designTokens.sectionSpacing || 14}px`,
          '--cv-item-spacing': `${designTokens.itemSpacing || 10}px`,
          '--cv-divider-thickness': `${designTokens.dividerThickness || 1}px`,
          fontFamily: designTokens.bodyFont || designTokens.fontFamily || 'Inter, sans-serif',
          color: designTokens.bodyColor || '#334155',
          backgroundColor: designTokens.backgroundColor || '#ffffff',
        }}
      >
        <Component cvData={mergedCvData} onOpenPhotoModal={onOpenPhotoModal} />
      </div>
    </div>
  );
};

export {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  PREFERRED_CATEGORY_ORDER,
  resolveTemplateId,
  resolveTemplateMeta,
  templateMatchesCategory,
  getDynamicCategories,
  resolveDesignTokens,
  getSectionVisibility,
  getOrderedSectionKeys,
  CVSection,
  CVSectionTitle,
  CVPersonalDetailsTable,
  CVCustomSections,
  CVDeclaration,
  EditableElement,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
};

export default RenderCVTemplate;
