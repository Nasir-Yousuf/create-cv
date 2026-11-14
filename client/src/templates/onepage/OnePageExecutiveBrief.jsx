import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export const OnePageExecutiveBrief = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#1e3a8a', // Executive Navy
    accentColor: '#3b82f6',
    headingColor: '#172554',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Merriweather',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  return (
    <div
      className="px-7 py-6 bg-white leading-snug min-h-[1060px]"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Executive Double-Bordered Header */}
      <div
        className="p-4 rounded-lg border-2 mb-3.5 flex items-center justify-between gap-4 bg-slate-50/70"
        style={{ borderColor: tokens.primaryColor }}
      >
        <div className="min-w-0 flex-1">
          <span className="text-[9.5px] font-sans font-bold uppercase tracking-[0.2em] text-slate-500 block">
            Executive Brief
          </span>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Executive Full Name"
            className="text-[22px] font-bold tracking-tight block mt-0.5 leading-tight"
            style={{
              color: tokens.headingColor,
              fontFamily: `${tokens.headingFont}, Georgia, serif`,
            }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Senior Leadership Role"
            className="text-[12px] font-sans font-bold mt-0.5 block"
            style={{ color: tokens.primaryColor }}
          />
          <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-2 text-[10px] font-sans text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.website}
              </span>
            )}
          </div>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'portrait'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </div>

      <div className="space-y-3 font-sans">
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Executive Profile" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* 2-Column Core Leadership Competencies Strip */}
        {isVisible('skills') && skills.length > 0 && (
          <section>
            <CompactSectionTitle title="Core Competencies" color={tokens.primaryColor} />
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10.5px] bg-slate-50 px-3 py-2 rounded border border-slate-200">
              {skills.slice(0, 9).map((s, idx) => (
                <div key={s.id || idx} className="flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tokens.primaryColor }} />
                  <span className="truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Leadership Trajectory" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Strategic Initiatives" color={tokens.primaryColor} />
            <div className="space-y-1 text-[10.5px]">
              {projects.slice(0, 2).map((p, idx) => (
                <div key={p.id || idx}>
                  <span className="font-bold text-slate-900">{p.name}: </span>
                  <span className="text-slate-700">{p.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('education') && education.length > 0 && (
            <section className={certifications.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Education" color={tokens.primaryColor} />
              <OnePageEducationList
                education={education}
                editors={editors}
                accentColor={tokens.primaryColor}
              />
            </section>
          )}
          {((isVisible('certifications') && certifications.length > 0) || (isVisible('languages') && languages.length > 0)) && (
            <section className={education.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Board & Credentials" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {isVisible('certifications') && certifications.slice(0, 2).map((c, idx) => (
                  <p key={c.id || idx}>
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    {c.issuer ? ` (${c.issuer})` : ''}
                  </p>
                ))}
                {isVisible('languages') && languages.length > 0 && (
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Languages: </span>
                    {languages.map((l) => l.name).join(', ')}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {isVisible('personalDetails') && (
          <CVPersonalDetailsTable personalDetails={personalDetails} compact={true} />
        )}

        {isVisible('customSections') && customSections.length > 0 && (
          <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
        )}

        {isVisible('declaration') && declaration?.text && (
          <div className="pt-2 text-[9px] border-t border-slate-200">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageExecutiveBrief;

