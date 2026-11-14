import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  OnePageExperienceList,
  OnePageEducationList,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';

export const OnePageMinimalSwiss = ({ cvData, onOpenPhotoModal }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    declaration = {},
    customSections = [],
    design = {},
  } = cvData || {};

  const tokens = resolveDesignTokens(cvData, {
    primaryColor: '#0f172a', // Swiss Minimal Slate
    accentColor: '#475569',
    headingColor: '#000000',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <div
      className="px-7 py-6 bg-white leading-snug min-h-[1060px]"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Swiss Clean Asymmetric Header */}
      <header className="flex items-center justify-between gap-4 pb-4 mb-3.5 border-b border-slate-300">
        <div className="min-w-0">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Your Full Name"
            className="text-[24px] font-semibold tracking-tight block leading-tight"
            style={{ color: tokens.headingColor, fontFamily: `${tokens.headingFont}, sans-serif` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Designation"
            className="text-[12.5px] font-medium text-slate-500 mt-0.5 block"
          />
          <p className="text-[10px] text-slate-500 mt-2">{contactBits.join('  /  ')}</p>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'rounded'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor="#cbd5e1"
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </header>

      {/* Architectural 25% Label / 75% Content Rows */}
      <div className="divide-y divide-slate-200/80">
        {isVisible('summary') && personalInfo.summary && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
                Profile
              </span>
            </div>
            <div className="col-span-9">
              <EditableElement
                section="personalInfo"
                field="summary"
                value={personalInfo.summary}
                multiline={true}
                onSave={editors.savePersonal('summary')}
                className="text-[11px] text-slate-700 leading-relaxed block"
              />
            </div>
          </div>
        )}

        {isVisible('experience') && experience.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
                Experience
              </span>
            </div>
            <div className="col-span-9">
              <OnePageExperienceList
                experience={experience}
                editors={editors}
                accentColor={tokens.primaryColor}
                compact={true}
              />
            </div>
          </div>
        )}

        {isVisible('education') && education.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
                Education
              </span>
            </div>
            <div className="col-span-9">
              <OnePageEducationList
                education={education}
                editors={editors}
                accentColor={tokens.primaryColor}
              />
            </div>
          </div>
        )}

        {isVisible('projects') && projects.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
                Projects
              </span>
            </div>
            <div className="col-span-9 space-y-1.5">
              {projects.map((p, idx) => (
                <div key={p.id || idx} className="text-[11px]">
                  <span className="font-bold text-slate-900">{p.name}</span>
                  {p.role && <span className="text-slate-500"> — {p.role}</span>}
                  {p.description && <p className="text-slate-600 text-[10.5px]">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {((isVisible('skills') && skills.length > 0) ||
          (isVisible('certifications') && certifications.length > 0) ||
          (isVisible('languages') && languages.length > 0)) && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
                Capabilities
              </span>
            </div>
            <div className="col-span-9 space-y-1.5 text-[10.5px]">
              {isVisible('skills') && skills.length > 0 && (
                <p className="text-slate-800">
                  <span className="font-semibold">Skills: </span>
                  {skills.map((s) => s.name).join(' · ')}
                </p>
              )}
              {isVisible('certifications') && certifications.length > 0 && (
                <p className="text-slate-700">
                  <span className="font-semibold">Credentials: </span>
                  {certifications.map((c) => c.name).join(' · ')}
                </p>
              )}
              {isVisible('languages') && languages.length > 0 && (
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Languages: </span>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {isVisible('personalDetails') && (
          <div className="py-2.5">
            <CVPersonalDetailsTable personalDetails={personalDetails} compact={true} />
          </div>
        )}

        {isVisible('customSections') && customSections.length > 0 && (
          <div className="py-2.5">
            <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
          </div>
        )}

        {isVisible('declaration') && declaration?.text && (
          <div className="py-2.5 text-[9px]">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageMinimalSwiss;

