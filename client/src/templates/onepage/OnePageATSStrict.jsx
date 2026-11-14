import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';

export const OnePageATSStrict = ({ cvData }) => {
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
    primaryColor: '#0f172a',
    accentColor: '#334155',
    headingColor: '#000000',
    bodyColor: '#000000',
    backgroundColor: '#ffffff',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const contactItems = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.github || personalInfo.website,
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
      {/* Centered Pure Text ATS Letterhead */}
      <header className="text-center pb-3 mb-3 border-b-2" style={{ borderColor: tokens.headingColor }}>
        <EditableElement
          section="personalInfo"
          field="fullName"
          tag="h1"
          value={personalInfo.fullName || ''}
          onSave={editors.savePersonal('fullName')}
          placeholder="YOUR FULL NAME"
          className="text-[22px] font-bold uppercase tracking-wider block leading-tight"
          style={{ color: tokens.headingColor, fontFamily: `${tokens.headingFont}, sans-serif` }}
        />
        <EditableElement
          section="personalInfo"
          field="jobTitle"
          tag="p"
          value={personalInfo.jobTitle || ''}
          onSave={editors.savePersonal('jobTitle')}
          placeholder="Target Designation"
          className="text-[12px] font-semibold text-slate-700 mt-0.5 block"
        />
        <p className="text-[10px] text-slate-700 mt-1.5">
          {contactItems.join('  |  ')}
        </p>
      </header>

      <div className="space-y-3">
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Professional Summary" color={tokens.primaryColor} variant="plain" />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              className="text-[11px] text-slate-900 leading-relaxed block"
            />
          </section>
        )}

        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Experience" color={tokens.primaryColor} variant="plain" />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={tokens.primaryColor} variant="plain" />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Projects" color={tokens.primaryColor} variant="plain" />
            <div className="space-y-1.5">
              {projects.map((p, idx) => (
                <div key={p.id || idx} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {p.name}
                      {p.role ? ` — ${p.role}` : ''}
                    </span>
                    {p.url && <span className="font-normal text-[10px] text-slate-600">{p.url}</span>}
                  </div>
                  {p.description && <p className="text-slate-800">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {isVisible('skills') && skills.length > 0 && (
          <section>
            <CompactSectionTitle title="Technical & Core Skills" color={tokens.primaryColor} variant="plain" />
            <p className="text-[11px] text-slate-900 leading-relaxed">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </section>
        )}

        {((isVisible('certifications') && certifications.length > 0) || (isVisible('languages') && languages.length > 0)) && (
          <section>
            <CompactSectionTitle title="Additional Credentials" color={tokens.primaryColor} variant="plain" />
            <div className="space-y-0.5 text-[10.5px] text-slate-800">
              {isVisible('certifications') && certifications.length > 0 && (
                <p>
                  <span className="font-bold">Certifications: </span>
                  {certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`).join('; ')}
                </p>
              )}
              {isVisible('languages') && languages.length > 0 && (
                <p>
                  <span className="font-bold">Languages: </span>
                  {languages.map((l) => `${l.name}${l.proficiency ? ` - ${l.proficiency}` : ''}`).join(', ')}
                </p>
              )}
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
          <div className="pt-2 text-[9px] border-t border-slate-300">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageATSStrict;

