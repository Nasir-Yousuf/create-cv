import React from 'react';
import {
  resolveTemplateId,
  TEMPLATE_ALIAS_COLORS,
} from '@shared/constants/cvDefaults.js';
import { normalizeCvData } from '@shared/utils/cvNormalize.js';

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
  const Component = TEMPLATE_COMPONENTS[resolvedId] || OnePageFresherClean;
  const safeCvData = normalizeCvData(cvData);

  // Preserve custom palette if user loaded a legacy alias ID without custom design overrides
  const aliasColor = TEMPLATE_ALIAS_COLORS[rawTemplateId];
  const mergedCvData =
    aliasColor && safeCvData && (!safeCvData.design?.primaryColor || safeCvData.design.primaryColor === '#2563EB' || safeCvData.design.primaryColor === '#059669')
      ? {
          ...safeCvData,
          design: {
            ...safeCvData.design,
            primaryColor: aliasColor.primaryColor,
            accentColor: aliasColor.accentColor,
          },
        }
      : safeCvData;

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
        } bg-white shadow-2xl rounded-sm overflow-hidden`}
        id="cv-export-sheet"
      >
        <Component cvData={mergedCvData} onOpenPhotoModal={onOpenPhotoModal} />
      </div>
    </div>
  );
};

export default RenderCVTemplate;
