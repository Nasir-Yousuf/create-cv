import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateReference,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Camera } from 'lucide-react';

export const OceanSplit = ({ cvData, onOpenPhotoModal }) => {
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

  const primary = design?.primaryColor || '#0284c7'; // Sky/Ocean blue
  const accent = design?.accentColor || '#38bdf8';
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
    <div className="flex flex-col sm:flex-row min-h-full bg-white text-slate-800 text-xs font-sans" style={{ fontFamily }}>
      {/* Left Sidebar */}
      <div className="w-full sm:w-1/3 bg-slate-900 text-white p-6 sm:p-8 space-y-6 shrink-0">
        {/* Photo */}
        {design?.showPhoto !== false && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="flex justify-center cursor-pointer group relative"
            title="Click to edit photo"
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || 'User Photo'}
                className={`${photoSizeClass} object-cover border-4 border-sky-400 shadow-lg ${
                  personalInfo.photoStyle === 'circle'
                    ? 'rounded-full w-28 h-28'
                    : personalInfo.photoStyle === 'square'
                    ? 'rounded-none'
                    : 'rounded-lg'
                }`}
              />
            ) : (
              <div className={`${photoSizeClass} border-2 border-dashed border-sky-400/60 rounded-lg flex flex-col items-center justify-center text-sky-300 p-2 text-center print:hidden cv-photo-placeholder`}>
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px]">Passport Photo</span>
              </div>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-700 pb-1">
            Contact
          </h3>
          <div className="space-y-2 text-slate-300">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <EditableElement
                  section="personalInfo"
                  field="email"
                  value={personalInfo.email}
                  onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                  placeholder="email@example.com"
                  className="break-all inline"
                />
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <EditableElement
                  section="personalInfo"
                  field="phone"
                  value={personalInfo.phone}
                  onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                  placeholder="+1 555-0100"
                  className="inline"
                />
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <EditableElement
                  section="personalInfo"
                  field="location"
                  value={personalInfo.location}
                  onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                  placeholder="City, Country"
                  className="inline"
                />
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <EditableElement
                  section="personalInfo"
                  field="website"
                  value={personalInfo.website}
                  onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                  placeholder="website.com"
                  className="break-all inline"
                />
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 min-w-0">
                <Github className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <EditableElement
                  section="personalInfo"
                  field="github"
                  value={personalInfo.github}
                  onSave={(val) => dispatch(updatePersonalInfo({ github: val }))}
                  placeholder="github.com/username"
                  className="break-all inline"
                />
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 min-w-0">
                <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <EditableElement
                  section="personalInfo"
                  field="linkedin"
                  value={personalInfo.linkedin}
                  onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                  placeholder="linkedin.com/in/username"
                  className="break-all inline"
                />
              </div>
            )}
          </div>
        </div>

        {/* Skills in Sidebar */}
        {skills && skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-700 pb-1">
              Skills & Expertise
            </h3>
            <div className="space-y-2 text-xs">
              {skills.map((skill, index) => (
                <div key={skill.id || index} className="space-y-1">
                  <div className="flex justify-between text-slate-200">
                    <EditableElement
                      section="skills"
                      field="name"
                      index={index}
                      value={skill.name}
                      onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                      placeholder="Skill"
                      className="inline font-medium"
                    />
                    <span className="text-[10px] text-slate-400">{skill.level || 'Advanced'}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full"
                      style={{
                        width:
                          skill.level === 'Expert'
                            ? '95%'
                            : skill.level === 'Advanced'
                            ? '80%'
                            : skill.level === 'Intermediate'
                            ? '60%'
                            : '40%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Details in Sidebar (if available) */}
        {personalDetails?.fatherName && (
          <div className="space-y-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Personal Info</h3>
            <p><strong>DOB:</strong> {personalDetails.dob}</p>
            <p><strong>NID:</strong> {personalDetails.nid}</p>
            <p><strong>Blood:</strong> {personalDetails.bloodGroup}</p>
            <p><strong>Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-full sm:w-2/3 p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName}
            onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
            placeholder="Your Full Name"
            className="text-3xl font-extrabold tracking-tight text-slate-900 block"
            style={{ color: primary }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle}
            onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
            placeholder="Your Title"
            className="text-base font-semibold text-slate-600 mt-1 block"
          />
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2">
              Professional Profile
            </h3>
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Write your professional profile..."
              className="text-slate-700 leading-relaxed block text-xs"
            />
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                      placeholder="Job Title"
                      className="inline font-bold"
                    />
                    <span className="text-slate-500 font-normal">
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
                  <div className="text-slate-600 font-medium">
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
                      placeholder="Job duties..."
                      className="text-slate-700 text-xs block"
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

        {/* Education */}
        {education && education.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Education
            </h3>
            <div className="space-y-2 text-xs">
              {education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      <EditableElement
                        section="education"
                        field="degree"
                        index={index}
                        value={edu.degree}
                        onSave={(val) => dispatch(updateEducation({ index, data: { degree: val } }))}
                        placeholder="Degree"
                        className="inline font-bold"
                      />
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </span>
                    <span className="text-slate-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-slate-600">
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Projects
            </h3>
            <div className="space-y-2 text-xs">
              {projects.map((proj, index) => (
                <div key={proj.id || index}>
                  <EditableElement
                    section="projects"
                    field="title"
                    index={index}
                    value={proj.title}
                    onSave={(val) => dispatch(updateProject({ index, data: { title: val } }))}
                    placeholder="Project Name"
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
                      placeholder="Project details..."
                      className="text-slate-700 block text-xs"
                    />
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-slate-500 text-[10px] mt-0.5">Stack: {proj.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <section className="space-y-2 pt-2 border-t">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">
              References
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {references.map((r, i) => (
                <div key={r.id || i} className="p-2 bg-slate-50 rounded border border-slate-200">
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
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default OceanSplit;
