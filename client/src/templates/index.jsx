import React from 'react';
import ModernBlue from './ModernBlue';
import ModernMinimal from './ModernMinimal';
import BangladeshStandard from './BangladeshStandard';
import AppleClean from './AppleClean';
import LinearDark from './LinearDark';
import ExecutiveSlate from './ExecutiveSlate';
import OceanSplit from './OceanSplit';
import ATSClassic from './ATSClassic';
import CreativeCoral from './CreativeCoral';

// Factory helper to clone props with customized design overrides
const withCustomDesign = (Component, defaultDesign) => {
  return function CustomTemplate(props) {
    const mergedCvData = {
      ...props.cvData,
      design: {
        ...props.cvData?.design,
        primaryColor: props.cvData?.design?.primaryColor || defaultDesign.primaryColor,
        fontFamily: props.cvData?.design?.fontFamily || defaultDesign.fontFamily,
        ...(defaultDesign.extra || {}),
      },
    };
    return <Component {...props} cvData={mergedCvData} />;
  };
};

export const TEMPLATE_COMPONENTS = {
  // 0. macOS Reference "Modern Blue" & Gallery Presets
  'modern-blue': ModernBlue,
  'daniel-carter': ModernBlue,
  'elegant-minimal': withCustomDesign(ModernBlue, { primaryColor: '#334155' }),
  'professional': withCustomDesign(ModernBlue, { primaryColor: '#0f172a' }),
  'creative-design': CreativeCoral,
  'clean-layout': AppleClean,
  'bold-style': ExecutiveSlate,
  'simple-white': withCustomDesign(ModernBlue, { primaryColor: '#475569' }),
  'dark-mode': LinearDark,
  'minimal-blue': withCustomDesign(ModernBlue, { primaryColor: '#0284c7' }),

  // 1. Bangladesh Recruiter Standards
  'bd-corporate-standard': BangladeshStandard,
  'bd-bank-officer': withCustomDesign(BangladeshStandard, { primaryColor: '#0369a1' }),
  'bd-dhaka-executive': withCustomDesign(BangladeshStandard, { primaryColor: '#0f766e' }),
  'bd-fresher-graduate': withCustomDesign(BangladeshStandard, { primaryColor: '#b45309' }),
  'bd-it-engineer': withCustomDesign(BangladeshStandard, { primaryColor: '#4338ca' }),
  'bd-medical-clinical': withCustomDesign(BangladeshStandard, { primaryColor: '#0d9488' }),
  'bd-academic-lecturer': withCustomDesign(BangladeshStandard, { primaryColor: '#991b1b', fontFamily: 'Merriweather' }),
  'bd-corporate-navy': withCustomDesign(BangladeshStandard, { primaryColor: '#1e3a8a' }),
  'bd-corporate-maroon': withCustomDesign(BangladeshStandard, { primaryColor: '#881337' }),

  // 2. Apple & Modern Minimal
  'apple-clean': AppleClean,
  'apple-silicon-light': withCustomDesign(AppleClean, { primaryColor: '#334155' }),
  'apple-dark': withCustomDesign(AppleClean, { primaryColor: '#09090b' }),
  'zurich-clean': withCustomDesign(AppleClean, { primaryColor: '#18181b' }),
  'nordic-minimal': withCustomDesign(AppleClean, { primaryColor: '#0284c7' }),
  'modern-minimal': ModernMinimal,
  'breeze-compact': withCustomDesign(ModernMinimal, {
    primaryColor: '#0d9488',
    extra: { lineSpacing: 'compact', sectionSpacing: 'compact' },
  }),
  'forest-professional': withCustomDesign(ModernMinimal, { primaryColor: '#059669' }),
  'sun-graduate': withCustomDesign(ModernMinimal, { primaryColor: '#d97706' }),

  // 3. Tech & Engineering
  'linear-dark': LinearDark,
  'tech-flow': withCustomDesign(LinearDark, { primaryColor: '#06b6d4', fontFamily: 'JetBrains Mono' }),
  'wall-street-fintech': withCustomDesign(LinearDark, { primaryColor: '#10b981' }),
  'silicon-valley-tech': withCustomDesign(LinearDark, { primaryColor: '#8b5cf6' }),

  // 4. Executive & Leadership
  'executive-slate': ExecutiveSlate,
  'corporate-royal': withCustomDesign(ExecutiveSlate, { primaryColor: '#1e3a8a' }),
  'harvard-executive': withCustomDesign(ExecutiveSlate, { primaryColor: '#881337', fontFamily: 'Merriweather' }),
  'director-standard': withCustomDesign(ExecutiveSlate, { primaryColor: '#0f172a' }),

  // 5. Dual-Column & Modern Split
  'ocean-split': OceanSplit,
  'emerald-split': withCustomDesign(OceanSplit, { primaryColor: '#047857' }),
  'violet-split': withCustomDesign(OceanSplit, { primaryColor: '#7c3aed' }),

  // 6. ATS Recruiter 100%
  'ats-classic': ATSClassic,
  'ats-academic': withCustomDesign(ATSClassic, { fontFamily: 'Merriweather' }),
  'academic-elegance': withCustomDesign(ATSClassic, { fontFamily: 'Merriweather' }),

  // 7. Creative & Studio
  'creative-coral': CreativeCoral,
  'sunset-gradient': withCustomDesign(CreativeCoral, { primaryColor: '#ea580c' }),
  'horizon-purple': withCustomDesign(CreativeCoral, { primaryColor: '#9333ea' }),
};

export const RenderCVTemplate = ({ cvData, scale = 1, onOpenPhotoModal }) => {
  const templateId = cvData?.templateId || 'bd-corporate-standard';
  const Component = TEMPLATE_COMPONENTS[templateId] || BangladeshStandard;

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
          cvData?.design?.pageSize === 'Letter' ? 'resume-sheet-letter' : 'resume-sheet-a4'
        } bg-white shadow-2xl rounded-sm overflow-hidden`}
        id="cv-export-sheet"
      >
        <Component cvData={cvData} onOpenPhotoModal={onOpenPhotoModal} />
      </div>
    </div>
  );
};

export default RenderCVTemplate;
