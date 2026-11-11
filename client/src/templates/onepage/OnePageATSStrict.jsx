import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
} from './onePageShared';

export const OnePageATSStrict = ({ cvData }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  const contactItems = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.github || personalInfo.website,
  ].filter(Boolean);

  return (
    <div className="px-8 py-6 bg-white text-black leading-snug" style={{ fontFamily }}>
      {/* Centered Pure Text ATS Letterhead */}
      <header className="text-center pb-3 mb-3 border-b-2 border-slate-900">
        <EditableElement
          section="personalInfo"
          field="fullName"
          tag="h1"
          value={personalInfo.fullName || ''}
          onSave={editors.savePersonal('fullName')}
          placeholder="YOUR FULL NAME"
          className="text-[22px] font-bold uppercase tracking-wider text-black block leading-tight"
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
        <p className="text-[10.5px] text-slate-700 mt-1.5">
          {contactItems.join('  |  ')}
        </p>
      </header>

      <div className="space-y-3">
        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Professional Summary" color={primary} variant="plain" />
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

        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Experience" color={primary} variant="plain" />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={primary} variant="plain" />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={primary}
            />
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Projects" color={primary} variant="plain" />
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

        {skills.length > 0 && (
          <section>
            <CompactSectionTitle title="Technical & Core Skills" color={primary} variant="plain" />
            <p className="text-[11px] text-slate-900 leading-relaxed">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </section>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
          <section>
            <CompactSectionTitle title="Additional Credentials" color={primary} variant="plain" />
            <div className="space-y-0.5 text-[10.5px] text-slate-800">
              {certifications.length > 0 && (
                <p>
                  <span className="font-bold">Certifications: </span>
                  {certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`).join('; ')}
                </p>
              )}
              {languages.length > 0 && (
                <p>
                  <span className="font-bold">Languages: </span>
                  {languages.map((l) => `${l.name}${l.proficiency ? ` - ${l.proficiency}` : ''}`).join(', ')}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default OnePageATSStrict;

