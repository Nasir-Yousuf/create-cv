import React from 'react';
import ModernMinimal from './ModernMinimal';
import ExecutiveSlate from './ExecutiveSlate';
import OceanSplit from './OceanSplit';
import ATSClassic from './ATSClassic';
import CreativeCoral from './CreativeCoral';

export const TEMPLATE_COMPONENTS = {
  'modern-minimal': ModernMinimal,
  'executive-slate': ExecutiveSlate,
  'ocean-split': OceanSplit,
  'ats-classic': ATSClassic,
  'creative-coral': CreativeCoral,
  'forest-professional': (props) => (
    <ModernMinimal
      {...props}
      cvData={{
        ...props.cvData,
        design: {
          ...props.cvData.design,
          primaryColor: props.cvData.design?.primaryColor || '#059669',
        },
      }}
    />
  ),
  'tech-flow': (props) => (
    <OceanSplit
      {...props}
      cvData={{
        ...props.cvData,
        design: {
          ...props.cvData.design,
          primaryColor: props.cvData.design?.primaryColor || '#6366f1',
          fontFamily: 'JetBrains Mono',
        },
      }}
    />
  ),
  'academic-elegance': (props) => (
    <ATSClassic
      {...props}
      cvData={{
        ...props.cvData,
        design: {
          ...props.cvData.design,
          fontFamily: 'Merriweather',
        },
      }}
    />
  ),
  'sun-graduate': (props) => (
    <ModernMinimal
      {...props}
      cvData={{
        ...props.cvData,
        design: {
          ...props.cvData.design,
          primaryColor: props.cvData.design?.primaryColor || '#d97706',
        },
      }}
    />
  ),
  'breeze-compact': (props) => (
    <ModernMinimal
      {...props}
      cvData={{
        ...props.cvData,
        design: {
          ...props.cvData.design,
          primaryColor: props.cvData.design?.primaryColor || '#0d9488',
          lineSpacing: 'compact',
          sectionSpacing: 'compact',
        },
      }}
    />
  ),
};

export const RenderCVTemplate = ({ cvData, scale = 1, onOpenPhotoModal }) => {
  const templateId = cvData?.templateId || 'modern-minimal';
  const Component = TEMPLATE_COMPONENTS[templateId] || ModernMinimal;

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
