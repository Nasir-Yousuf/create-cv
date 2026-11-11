import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export const OnePageFresherClean = ({ cvData, onOpenPhotoModal }) => {
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

  const primary = design?.primaryColor || '#2563eb';
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  return (
    <div
      className="px-7 py-6 bg-white text-slate-800 leading-snug"
      style={{ fontFamily, color: textColor }}
    >
      {/* Top Header */}
      <div
        className="flex items-center gap-4 pb-3.5 mb-3.5 border-b-2"
        style={{ borderColor: primary }}
      >
        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'circle'}
          photoSize={design?.photoSize}
          borderColor={`${primary}40`}
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
            className="text-[22px] font-extrabold tracking-tight text-slate-950 block leading-tight"
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Graduate / Target Position"
            className="text-[12.5px] font-semibold mt-0.5 block"
            style={{ color: primary }}
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10.5px] text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Github className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.website && !personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Career Profile */}
        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Career Objective" color={primary} />
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
        {education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={primary} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={primary}
            />
          </section>
        )}

        {/* Experience / Internships */}
        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Experience & Internships" color={primary} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {/* Key Projects in 2 columns */}
        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Key Projects" color={primary} />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={primary}
              twoColumns={true}
            />
          </section>
        )}

        {/* Bottom 2-column Skills + Certifications / Languages */}
        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {skills.length > 0 && (
            <section className={certifications.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Core Skills" color={primary} />
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

          {(certifications.length > 0 || languages.length > 0) && (
            <section className={skills.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle
                title={certifications.length > 0 ? 'Certifications & Languages' : 'Languages'}
                color={primary}
              />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {certifications.slice(0, 3).map((cert, idx) => (
                  <div key={cert.id || idx} className="leading-snug">
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                  </div>
                ))}
                {languages.length > 0 && (
                  <p className="text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800">Languages: </span>
                    {languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnePageFresherClean;

