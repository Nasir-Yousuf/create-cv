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
import { Github, Globe, Linkedin, Mail, Phone, Terminal } from 'lucide-react';

export const OnePageTechGrid = ({ cvData, onOpenPhotoModal }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#4f46e5';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  // Group skills by category dynamically for clean Tech Stack matrix
  const groupedSkills = skills.reduce((acc, s) => {
    const key = s.category || 'Core Stack';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s.name);
    return acc;
  }, {});

  return (
    <div className="bg-white text-slate-900 leading-snug" style={{ fontFamily }}>
      {/* Sleek Compact Slate Engineering Header */}
      <div className="bg-slate-900 text-white px-7 py-4 flex items-center justify-between gap-4 border-b-4" style={{ borderColor: primary }}>
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 text-[9.5px] font-mono text-indigo-300 uppercase tracking-wider mb-0.5">
            <Terminal className="w-3 h-3" />
            <span>Software & Engineering Profile</span>
          </div>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Engineer Name"
            className="text-[22px] font-extrabold tracking-tight text-white block leading-tight"
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Software Engineer"
            className="text-[12px] font-mono text-indigo-300 block"
          />

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-2 text-[10px] font-mono text-slate-300">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-400" />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3 text-indigo-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Github className="w-3 h-3 text-indigo-400" />
                <span>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-indigo-400" />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'circle'}
          photoSize={design?.photoSize}
          borderColor={primary}
          darkPlaceholder={true}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </div>

      {/* Main Compact Body */}
      <div className="px-7 py-4 space-y-3">
        {personalInfo.summary && (
          <EditableElement
            section="personalInfo"
            field="summary"
            value={personalInfo.summary}
            multiline={true}
            onSave={editors.savePersonal('summary')}
            className="text-[11px] text-slate-700 leading-relaxed block"
          />
        )}

        {/* Categorized Tech Stack Matrix */}
        {skills.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
            <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: primary }}>
              Technical Stack Matrix
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10.5px]">
              {Object.entries(groupedSkills).map(([cat, names]) => (
                <div key={cat} className="truncate">
                  <span className="font-bold text-slate-900">{cat}: </span>
                  <span className="text-slate-700 font-mono text-[10px]">{names.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Engineering Experience" color={primary} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Shipped Projects" color={primary} />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={primary}
              twoColumns={true}
            />
          </section>
        )}

        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {education.length > 0 && (
            <section className={certifications.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Education" color={primary} />
              <OnePageEducationList
                education={education}
                editors={editors}
                accentColor={primary}
              />
            </section>
          )}
          {certifications.length > 0 && (
            <section className={education.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Honors & Certifications" color={primary} />
              <div className="space-y-1 text-[10.5px]">
                {certifications.slice(0, 3).map((c, idx) => (
                  <div key={c.id || idx}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-[9.5px] text-slate-500">
                      {c.issuer}
                      {c.date ? ` • ${c.date}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnePageTechGrid;

