import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateReference,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Terminal, Camera } from 'lucide-react';

export const LinearDark = ({ cvData, onOpenPhotoModal }) => {
  const dispatch = useDispatch();

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
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#6366f1'; // Indigo tech
  const fontFamily = design?.fontFamily || 'Inter';

  const photoSizeClass =
    design?.photoSize === 'sm'
      ? 'w-20 h-28'
      : design?.photoSize === 'lg'
      ? 'w-32 h-44'
      : design?.photoSize === 'xl'
      ? 'w-36 h-48'
      : 'w-24 h-32';

  return (
    <div className="bg-white text-slate-900 transition-all text-xs font-sans" style={{ fontFamily }}>
      {/* 1. Linear Obsidian Dark Top Header */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 border-b-2 border-indigo-500/50">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2 flex-1">
            <div className="cv-badge gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-[10px] font-mono text-indigo-300">
              <Terminal className="w-3 h-3 shrink-0 text-indigo-400" />
              <span>cv://profile/active</span>
            </div>

            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Your Full Name"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white block"
            />

            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Senior Software Architect / Engineer"
              className="text-sm font-mono text-indigo-300 block"
            />

            {/* Contact Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] text-slate-400 font-mono">
              {personalInfo.email && (
                <span className="cv-icon-row gap-1.5">
                  <Mail className="w-3 h-3 shrink-0 text-indigo-400" />
                  <EditableElement
                    section="personalInfo"
                    field="email"
                    value={personalInfo.email}
                    onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                    placeholder="email@example.com"
                    className="inline min-w-0 break-words text-slate-300 hover:text-white"
                  />
                </span>
              )}
              {personalInfo.phone && (
                <span className="cv-icon-row gap-1.5">
                  <Phone className="w-3 h-3 shrink-0 text-indigo-400" />
                  <EditableElement
                    section="personalInfo"
                    field="phone"
                    value={personalInfo.phone}
                    onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                    placeholder="+1 555-0199"
                    className="inline min-w-0 break-words text-slate-300 hover:text-white"
                  />
                </span>
              )}
              {personalInfo.location && (
                <span className="cv-icon-row gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 text-indigo-400" />
                  <EditableElement
                    section="personalInfo"
                    field="location"
                    value={personalInfo.location}
                    onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                    placeholder="City, Country"
                    className="inline min-w-0 break-words text-slate-300 hover:text-white"
                  />
                </span>
              )}
              {personalInfo.github && (
                <span className="cv-icon-row gap-1.5">
                  <Github className="w-3 h-3 shrink-0 text-indigo-400" />
                  <EditableElement
                    section="personalInfo"
                    field="github"
                    value={personalInfo.github}
                    onSave={(val) => dispatch(updatePersonalInfo({ github: val }))}
                    placeholder="github.com/username"
                    className="inline min-w-0 break-words text-slate-300 hover:text-white"
                  />
                </span>
              )}
            </div>
          </div>

          {/* Portrait Photo with Dark Tech Border */}
          {design?.showPhoto !== false && (
            <div
              onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
              className="shrink-0 relative group cursor-pointer"
              title="Click to edit portrait photo"
            >
              {personalInfo.photo ? (
                <div
                  className={`${photoSizeClass} cv-photo-frame rounded-md border-2 border-indigo-500/80 shadow-2xl bg-slate-900`}
                >
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.fullName || 'Photo'}
                    className="cv-photo-img"
                  />
                </div>
              ) : (
                <div
                  className={`${photoSizeClass} border border-dashed border-slate-700 rounded-md bg-slate-900 flex flex-col items-center justify-center text-slate-500 p-2 text-center group-hover:border-indigo-400 transition-colors print:hidden cv-photo-placeholder`}
                >
                  <Camera className="w-5 h-5 mb-1 text-slate-500" />
                  <span className="text-[9px] font-mono">PORTRAIT</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-6">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-2 border-b border-slate-200">
              01 // Professional Overview
            </h2>
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Write your technical overview..."
              className="text-slate-700 leading-relaxed text-xs block"
            />
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-3 border-b border-slate-200">
              02 // Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                      placeholder="Role Title"
                      className="font-bold text-slate-950 inline-block text-xs"
                    />
                    <span className="text-[11px] font-mono text-slate-500">
                      <EditableElement
                        section="experience"
                        field="startDate"
                        index={index}
                        value={exp.startDate}
                        onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                        placeholder="Start"
                        className="inline"
                      />
                      {' – '}
                      {exp.current ? (
                        'Present'
                      ) : (
                        <EditableElement
                          section="experience"
                          field="endDate"
                          index={index}
                          value={exp.endDate}
                          onSave={(val) => dispatch(updateExperience({ index, data: { endDate: val } }))}
                          placeholder="End"
                          className="inline"
                        />
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-900 font-semibold">
                    <EditableElement
                      section="experience"
                      field="company"
                      index={index}
                      value={exp.company}
                      onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                      placeholder="Company"
                      className="inline"
                    />
                    {exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <EditableElement
                      section="experience"
                      field="description"
                      index={index}
                      value={exp.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                      placeholder="Responsibilities and impact..."
                      className="text-slate-600 text-xs leading-relaxed block"
                    />
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-xs mt-1">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills & Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-2.5 border-b border-slate-200">
                03 // Technical Stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, index) => (
                  <span
                    key={s.id || index}
                    className="cv-badge px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200"
                  >
                    <EditableElement
                      section="skills"
                      field="name"
                      index={index}
                      value={s.name}
                      onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                      placeholder="Skill"
                      className="inline font-mono"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-2.5 border-b border-slate-200">
                04 // Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx}>
                    <EditableElement
                      section="education"
                      field="degree"
                      index={idx}
                      value={edu.degree}
                      onSave={(val) => dispatch(updateEducation({ index: idx, data: { degree: val } }))}
                      placeholder="Degree"
                      className="font-bold text-slate-900 block"
                    />
                    <p className="text-slate-600 text-[11px]">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={idx}
                        value={edu.institution}
                        onSave={(val) => dispatch(updateEducation({ index: idx, data: { institution: val } }))}
                        placeholder="Institution"
                        className="inline"
                      />
                      {edu.grade && ` • ${edu.grade}`}
                    </p>
                    <p className="text-slate-400 text-[10px] font-mono">{edu.endDate || edu.startDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bangladeshi Recruiter Details (if populated) */}
        {personalDetails?.fatherName && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-2 border-b border-slate-200">
              05 // Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-600">
              <p><strong className="text-slate-900">Father's Name:</strong> {personalDetails.fatherName}</p>
              <p><strong className="text-slate-900">Mother's Name:</strong> {personalDetails.motherName}</p>
              <p><strong className="text-slate-900">Date of Birth:</strong> {personalDetails.dob}</p>
              <p><strong className="text-slate-900">Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
              {personalDetails.nid && <p><strong className="text-slate-900">National ID:</strong> {personalDetails.nid}</p>}
              {personalDetails.bloodGroup && <p><strong className="text-slate-900">Blood Group:</strong> {personalDetails.bloodGroup}</p>}
            </div>
          </section>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 pb-1 mb-2 border-b border-slate-200">
              06 // References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {references.map((r, i) => (
                <div key={r.id || i} className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px]">
                  <EditableElement
                    section="references"
                    field="name"
                    index={i}
                    value={r.name}
                    onSave={(val) => dispatch(updateReference({ index: i, data: { name: val } }))}
                    placeholder="Referee Name"
                    className="font-bold text-slate-900 block"
                  />
                  <p className="text-slate-600">{r.designation}, {r.company}</p>
                  {r.phone && <p className="text-slate-500">Tel: {r.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LinearDark;
