import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  resolveDesignTokens,
  getSectionVisibility,
  CVPhoto,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';

export const OnePageAcademicCompact = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#7c2d12', // Scholarly Crimson / Maroon
    accentColor: '#9a3412',
    headingColor: '#451a03',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Merriweather',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website || personalInfo.linkedin,
  ].filter(Boolean);

  return (
    <div
      className="px-8 py-6 bg-white leading-snug min-h-[1060px]"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Scholarly Header with Top Crimson/Maroon Accent Line */}
      <header
        className="pt-2 pb-3 mb-3 border-t-4 border-b border-slate-300"
        style={{ borderTopColor: tokens.primaryColor }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName || ''}
              onSave={editors.savePersonal('fullName')}
              placeholder="Applicant Full Name"
              className="text-[21px] font-bold tracking-tight block"
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
              placeholder="Academic Focus / Research Candidate"
              className="text-[12px] italic font-medium mt-0.5 block"
              style={{ color: tokens.primaryColor }}
            />
            <p className="text-[10px] text-slate-600 mt-1">
              {contactBits.join(' • ')}
            </p>
          </div>
          {design?.showPhoto && (
            <CVPhoto
              photo={personalInfo.photo}
              fullName={personalInfo.fullName}
              showPhoto={design?.showPhoto}
              photoStyle={personalInfo.photoStyle || 'rounded'}
              photoSize={design?.photoSize || 'sm'}
              photoConfig={personalInfo.photoConfig}
              onOpenPhotoModal={onOpenPhotoModal}
            />
          )}
        </div>
      </header>

      <div className="space-y-3">
        {/* Research Statement */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Research Interests & Statement" color={tokens.primaryColor} />
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

        {/* Education & Honors First */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education & Academic Standing" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* Thesis / Research Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Thesis, Research & Publications" color={tokens.primaryColor} />
            <div className="space-y-1.5 text-[11px]">
              {projects.map((p, idx) => (
                <div key={p.id || idx}>
                  <span className="font-bold text-slate-900">{p.name}</span>
                  {p.role && <span className="text-slate-500"> ({p.role})</span>}
                  {p.description && <p className="text-slate-700 text-[10.5px]">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Teaching / Lab / Work Appointments */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Teaching, Lab & Professional Appointments" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Awards, Methods & Languages */}
        {((isVisible('certifications') && certifications.length > 0) ||
          (isVisible('skills') && skills.length > 0) ||
          (isVisible('languages') && languages.length > 0)) && (
          <section>
            <CompactSectionTitle title="Honors, Methodologies & Skills" color={tokens.primaryColor} />
            <div className="space-y-1 text-[10.5px] text-slate-700">
              {isVisible('certifications') && certifications.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Honors & Fellowships: </span>
                  {certifications.map((c) => `${c.name}${c.date ? ` (${c.date})` : ''}`).join(' • ')}
                </p>
              )}
              {isVisible('skills') && skills.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Tools & Research Methods: </span>
                  {skills.map((s) => s.name).join(', ')}
                </p>
              )}
              {isVisible('languages') && languages.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Languages: </span>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
                </p>
              )}
            </div>
          </section>
        )}

        {/* 2-Column Academic Referees */}
        {isVisible('references') && references.length > 0 && (
          <section>
            <CompactSectionTitle title="Academic Referees" color={tokens.primaryColor} />
            <div className="grid grid-cols-2 gap-3 text-[10.5px]">
              {references.slice(0, 2).map((ref, idx) => (
                <div key={ref.id || idx} className="p-2 rounded border border-slate-200 bg-slate-50/70">
                  <p className="font-bold text-slate-900">{ref.name}</p>
                  <p className="text-slate-600">{ref.designation}{ref.company ? `, ${ref.company}` : ''}</p>
                  <p className="text-[10px] text-slate-500">
                    {[ref.email, ref.phone].filter(Boolean).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

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

export default OnePageAcademicCompact;

