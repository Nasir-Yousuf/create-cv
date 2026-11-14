import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export const OnePageFresherClean = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#2563eb', // Clean Royal Blue
    accentColor: '#3b82f6',
    headingColor: '#1e3a8a',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans',
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
      {/* Top Header */}
      <div
        className="flex items-center gap-4 pb-3.5 mb-3.5 border-b-2"
        style={{ borderColor: tokens.primaryColor }}
      >
        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'circle'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={`${tokens.primaryColor}40`}
          onOpenPhotoModal={onOpenPhotoModal}
        />

        <div className="flex-1 min-w-0">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Your Full Name"
            className="text-[22px] font-extrabold tracking-tight block leading-tight"
            style={{ color: tokens.headingColor, fontFamily: `${tokens.headingFont}, sans-serif` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Graduate / Target Position"
            className="text-[12.5px] font-semibold mt-0.5 block"
            style={{ color: tokens.primaryColor }}
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10.5px] text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Github className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.website && !personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Career Profile */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Career Objective" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Concise career goal highlighting key strengths..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Education prioritized for Students / Fresh Graduates */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* Experience / Internships */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Experience & Internships" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Key Projects in 2 columns */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Key Projects" color={tokens.primaryColor} />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={tokens.primaryColor}
              twoColumns={true}
            />
          </section>
        )}

        {/* Bottom 2-column Skills + Certifications / Languages */}
        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('skills') && skills.length > 0 && (
            <section className={certifications.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Core Skills" color={tokens.primaryColor} />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={s.id || idx}
                    className="px-2 py-0.5 rounded-md text-[10.5px] font-medium border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    <EditableElement
                      section="skills"
                      field="name"
                      index={idx}
                      value={s.name || ''}
                      onSave={editors.saveSkillName(idx)}
                      className="inline"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}

          {((isVisible('certifications') && certifications.length > 0) || (isVisible('languages') && languages.length > 0)) && (
            <section className={skills.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle
                title={certifications.length > 0 ? 'Certifications & Languages' : 'Languages'}
                color={tokens.primaryColor}
              />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {isVisible('certifications') && certifications.slice(0, 3).map((cert, idx) => (
                  <div key={cert.id || idx} className="leading-snug">
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                  </div>
                ))}
                {isVisible('languages') && languages.length > 0 && (
                  <p className="text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800">Languages: </span>
                    {languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
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

export default OnePageFresherClean;

