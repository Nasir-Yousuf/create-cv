import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
} from './onePageShared';

export const OnePageAcademicCompact = ({ cvData }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#7c2d12';
  const fontFamily = design?.fontFamily || 'Merriweather, Georgia, serif';

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website || personalInfo.linkedin,
  ].filter(Boolean);

  return (
    <div className="px-8 py-6 bg-white text-slate-900 leading-snug" style={{ fontFamily }}>
      {/* Scholarly Header with Top Crimson/Maroon Accent Line */}
      <header className="pt-2 pb-3 mb-3 border-t-4 border-b border-slate-300" style={{ borderTopColor: primary }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName || ''}
              onSave={editors.savePersonal('fullName')}
              placeholder="Applicant Full Name"
              className="text-[21px] font-bold tracking-tight text-slate-950 block"
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle || ''}
              onSave={editors.savePersonal('jobTitle')}
              placeholder="Academic Focus / Research Candidate"
              className="text-[12px] italic font-medium mt-0.5 block"
              style={{ color: primary }}
            />
          </div>
          <p className="text-[10px] font-sans text-slate-600 sm:text-right max-w-[260px]">
            {contactBits.join(' • ')}
          </p>
        </div>
      </header>

      <div className="space-y-3 font-sans">
        {/* Research Statement */}
        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Research Interests & Statement" color={primary} />
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
        {education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education & Academic Standing" color={primary} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={primary}
            />
          </section>
        )}

        {/* Thesis / Research Projects */}
        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Thesis, Research & Publications" color={primary} />
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
        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Teaching, Lab & Professional Appointments" color={primary} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {/* Awards, Methods & Languages */}
        {(certifications.length > 0 || skills.length > 0 || languages.length > 0) && (
          <section>
            <CompactSectionTitle title="Honors, Methodologies & Skills" color={primary} />
            <div className="space-y-1 text-[10.5px] text-slate-700">
              {certifications.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Honors & Fellowships: </span>
                  {certifications.map((c) => `${c.name}${c.date ? ` (${c.date})` : ''}`).join(' • ')}
                </p>
              )}
              {skills.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Tools & Research Methods: </span>
                  {skills.map((s) => s.name).join(', ')}
                </p>
              )}
              {languages.length > 0 && (
                <p>
                  <span className="font-bold text-slate-900">Languages: </span>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
                </p>
              )}
            </div>
          </section>
        )}

        {/* 2-Column Academic Referees */}
        {references.length > 0 && (
          <section>
            <CompactSectionTitle title="Academic Referees" color={primary} />
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
      </div>
    </div>
  );
};

export default OnePageAcademicCompact;

