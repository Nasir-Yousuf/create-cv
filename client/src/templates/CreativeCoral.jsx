import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateReference,
  updateDeclaration,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Sparkles, Camera } from 'lucide-react';

export const CreativeCoral = ({ cvData, onOpenPhotoModal }) => {
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
  const primary = design?.primaryColor || '#f43f5e'; // Coral
  const fontFamily = design?.fontFamily || 'Outfit';

  const photoSizeClass =
    design?.photoSize === 'sm'
      ? 'w-20 h-28'
      : design?.photoSize === 'lg'
      ? 'w-32 h-44'
      : design?.photoSize === 'xl'
      ? 'w-36 h-48'
      : 'w-24 h-32';

  return (
    <div className="bg-white text-slate-800 text-xs min-h-full font-sans" style={{ fontFamily }}>
      {/* Top Banner with organic wave & portrait/circle avatar */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {design?.showPhoto !== false && (
            <div
              onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
              className="cursor-pointer group relative shrink-0"
              title="Click to edit photo"
            >
              {personalInfo.photo ? (
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName || 'Profile'}
                  className={`${photoSizeClass} shrink-0 object-cover object-center block rounded-xl border-4 border-white shadow-xl`}
                />
              ) : (
                <div className={`${photoSizeClass} border-2 border-dashed border-white/80 rounded-xl flex flex-col items-center justify-center text-white p-2 text-center print:hidden cv-photo-placeholder`}>
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[9px]">Portrait</span>
                </div>
              )}
            </div>
          )}
          <div className="space-y-1 text-center sm:text-left flex-1">
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Creative Name"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white block"
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="UI/UX & Product Designer"
              className="text-rose-100 font-medium text-base tracking-wide block"
            />
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2 text-xs text-white/90">
              {personalInfo.email && (
                <span className="cv-icon-row gap-1.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <EditableElement
                    section="personalInfo"
                    field="email"
                    value={personalInfo.email}
                    onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                    placeholder="email@example.com"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.phone && (
                <span className="cv-icon-row gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <EditableElement
                    section="personalInfo"
                    field="phone"
                    value={personalInfo.phone}
                    onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                    placeholder="+1 555-0123"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.location && (
                <span className="cv-icon-row gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <EditableElement
                    section="personalInfo"
                    field="location"
                    value={personalInfo.location}
                    onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                    placeholder="City, Country"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Summary & Experience */}
        <div className="md:col-span-2 space-y-6">
          {personalInfo.summary && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 cv-icon-row gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> <span>About Me</span>
              </h3>
              <EditableElement
                section="personalInfo"
                field="summary"
                value={personalInfo.summary}
                multiline={true}
                onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
                placeholder="Write your professional summary..."
                className="text-slate-700 leading-relaxed block text-xs"
              />
            </section>
          )}

          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Experience History
              </h3>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="relative pl-4 border-l-2 border-rose-300 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-500" />
                    <div className="flex justify-between font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="experience"
                        field="jobTitle"
                        index={index}
                        value={exp.jobTitle}
                        onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                        placeholder="Job Title"
                        className="inline font-bold"
                      />
                      <span className="text-[11px] text-slate-500 font-normal">
                        <EditableElement
                          section="experience"
                          field="startDate"
                          index={index}
                          value={exp.startDate}
                          onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                          placeholder="Start"
                          className="inline"
                        />
                        {' - '}
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
                    <div className="text-rose-600 font-semibold text-xs">
                      <EditableElement
                        section="experience"
                        field="company"
                        index={index}
                        value={exp.company}
                        onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                        placeholder="Company"
                        className="inline"
                      />
                    </div>
                    {exp.description && (
                      <EditableElement
                        section="experience"
                        field="description"
                        index={index}
                        value={exp.description}
                        multiline={true}
                        onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                        placeholder="Job description..."
                        className="text-slate-700 text-xs leading-relaxed block"
                      />
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700 mt-1">
                        {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Featured Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj, index) => (
                  <div key={proj.id || index} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-1">
                    <EditableElement
                      section="projects"
                      field="title"
                      index={index}
                      value={proj.title}
                      onSave={(val) => dispatch(updateProject({ index, data: { title: val } }))}
                      placeholder="Project Title"
                      className="font-bold text-slate-900 block"
                    />
                    {proj.description && (
                      <EditableElement
                        section="projects"
                        field="description"
                        index={index}
                        value={proj.description}
                        multiline={true}
                        onSave={(val) => dispatch(updateProject({ index, data: { description: val } }))}
                        placeholder="Project overview..."
                        className="text-slate-600 text-xs block"
                      />
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="cv-badge px-1.5 py-0.5 bg-white text-rose-600 rounded text-[10px] font-medium border border-rose-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Skills, Education, References */}
        <div className="space-y-6">
          {skills && skills.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, index) => (
                  <span key={s.id || index} className="cv-badge px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-medium border border-amber-200">
                    <EditableElement
                      section="skills"
                      field="name"
                      index={index}
                      value={s.name}
                      onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                      placeholder="Skill"
                      className="inline"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Education
              </h3>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="space-y-0.5 text-xs">
                    <EditableElement
                      section="education"
                      field="degree"
                      index={index}
                      value={edu.degree}
                      onSave={(val) => dispatch(updateEducation({ index, data: { degree: val } }))}
                      placeholder="Degree"
                      className="font-bold text-slate-900 block"
                    />
                    <p className="text-slate-600 text-[11px]">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={index}
                        value={edu.institution}
                        onSave={(val) => dispatch(updateEducation({ index, data: { institution: val } }))}
                        placeholder="Institution"
                        className="inline"
                      />
                      {edu.grade && ` (${edu.grade})`}
                    </p>
                    <p className="text-slate-400 text-[10px]">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {personalDetails?.fatherName && (
            <section className="space-y-1.5 pt-2 border-t border-rose-100 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 pb-1">
                Personal
              </h3>
              <p><strong>DOB:</strong> {personalDetails.dob}</p>
              <p><strong>NID:</strong> {personalDetails.nid}</p>
              <p><strong>Blood:</strong> {personalDetails.bloodGroup}</p>
            </section>
          )}

          {references && references.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-rose-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 pb-1">
                References
              </h3>
              {references.map((r, i) => (
                <div key={r.id || i} className="p-2 bg-slate-50 rounded text-[11px]">
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
                  {r.phone && <p className="text-slate-500">Phone: {r.phone}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeCoral;
