import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  OnePageExperienceList,
  OnePageEducationList,
} from './onePageShared';

export const OnePageMinimalSwiss = ({ cvData, onOpenPhotoModal }) => {
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

  const primary = design?.primaryColor || '#1e293b';
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <div
      className="px-7 py-6 bg-white text-slate-900 leading-snug"
      style={{ fontFamily, color: textColor }}
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
            className="text-[24px] font-semibold tracking-tight text-slate-950 block leading-tight"
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
          <p className="text-[10.5px] text-slate-500 mt-2">{contactBits.join('  /  ')}</p>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'rounded'}
          photoSize={design?.photoSize}
          borderColor="#cbd5e1"
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </header>

      {/* Architectural 22% Label / 78% Content Rows */}
      <div className="divide-y divide-slate-200/80">
        {personalInfo.summary && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primary }}>
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

        {experience.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primary }}>
                Experience
              </span>
            </div>
            <div className="col-span-9">
              <OnePageExperienceList
                experience={experience}
                editors={editors}
                accentColor={primary}
                compact={true}
              />
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primary }}>
                Education
              </span>
            </div>
            <div className="col-span-9">
              <OnePageEducationList
                education={education}
                editors={editors}
                accentColor={primary}
              />
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primary }}>
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

        {(skills.length > 0 || certifications.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-12 gap-4 py-2.5">
            <div className="col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primary }}>
                Capabilities
              </span>
            </div>
            <div className="col-span-9 space-y-1.5 text-[10.5px]">
              {skills.length > 0 && (
                <p className="text-slate-800">
                  <span className="font-semibold">Skills: </span>
                  {skills.map((s) => s.name).join(' · ')}
                </p>
              )}
              {certifications.length > 0 && (
                <p className="text-slate-700">
                  <span className="font-semibold">Credentials: </span>
                  {certifications.map((c) => c.name).join(' · ')}
                </p>
              )}
              {languages.length > 0 && (
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Languages: </span>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageMinimalSwiss;

