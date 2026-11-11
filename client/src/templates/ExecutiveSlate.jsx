import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateReference,
  updateDeclaration,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Camera } from 'lucide-react';

export const ExecutiveSlate = ({ cvData, onOpenPhotoModal }) => {
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

  const primary = design?.primaryColor || '#0f172a'; // Dark slate
  const accent = design?.accentColor || '#64748b';
  const fontFamily = design?.fontFamily || 'Merriweather';

  const photoSizeClass =
    design?.photoSize === 'sm'
      ? 'w-20 h-28'
      : design?.photoSize === 'lg'
      ? 'w-32 h-44'
      : design?.photoSize === 'xl'
      ? 'w-36 h-48'
      : 'w-24 h-32';

  return (
    <div className="bg-white text-slate-800 transition-all text-xs font-serif" style={{ fontFamily }}>
      {/* Executive Dark Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase font-sans">
            Curriculum Vitae
          </span>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName}
            onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
            placeholder="Your Full Name"
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white block"
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle}
            onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
            placeholder="Executive Job Title"
            className="text-sm font-sans tracking-wide text-indigo-300 block"
          />
        </div>

        {/* Portrait Passport Photo */}
        {design?.showPhoto !== false && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="shrink-0 relative group cursor-pointer"
            title="Click to edit portrait photo"
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || 'Photo'}
                className={`${photoSizeClass} shrink-0 object-cover object-center block border-2 border-slate-700 shadow-xl rounded-md`}
              />
            ) : (
              <div
                className={`${photoSizeClass} border border-dashed border-slate-600 rounded-md bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 text-center print:hidden cv-photo-placeholder`}
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-sans">Photo</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Banner */}
      <div className="bg-slate-100 border-b border-slate-200 px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-slate-700">
        {personalInfo.email && (
          <span className="cv-icon-row gap-1.5">
            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" />
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
            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <EditableElement
              section="personalInfo"
              field="phone"
              value={personalInfo.phone}
              onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
              placeholder="+1 555-0100"
              className="inline min-w-0 break-words"
            />
          </span>
        )}
        {personalInfo.location && (
          <span className="cv-icon-row gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
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
        {personalInfo.linkedin && (
          <span className="cv-icon-row gap-1.5">
            <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <EditableElement
              section="personalInfo"
              field="linkedin"
              value={personalInfo.linkedin}
              onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
              placeholder="linkedin.com/in/username"
              className="inline min-w-0 break-words"
            />
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-6">
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">
              Executive Profile
            </h2>
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Executive profile summary..."
              className="text-slate-700 font-sans leading-relaxed text-xs block"
            />
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3 cv-icon-row gap-2">
              <Briefcase className="w-4 h-4 shrink-0 text-slate-700" /> <span>Career History & Achievements</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-1">
                  <div className="flex justify-between items-baseline font-sans text-xs">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                      placeholder="Role / Title"
                      className="font-bold text-sm text-slate-900 inline-block"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      <EditableElement
                        section="experience"
                        field="startDate"
                        index={index}
                        value={exp.startDate}
                        onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                        placeholder="Start Date"
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
                          placeholder="End Date"
                          className="inline"
                        />
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] font-serif text-slate-600 italic">
                    <EditableElement
                      section="experience"
                      field="company"
                      index={index}
                      value={exp.company}
                      onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                      placeholder="Organization"
                      className="inline italic"
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
                      placeholder="Executive responsibilities..."
                      className="text-slate-700 font-sans mt-1 text-xs block"
                    />
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 font-sans text-slate-700 mt-1">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid: Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {education && education.length > 0 && (
            <section>
              <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3 cv-icon-row gap-2">
                <GraduationCap className="w-4 h-4 shrink-0 text-slate-700" /> <span>Education</span>
              </h2>
              <div className="space-y-3 font-sans text-xs">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="space-y-0.5">
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
                      {edu.grade && ` • ${edu.grade}`}
                    </p>
                    <p className="text-[11px] text-slate-500">{edu.endDate || edu.startDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {skills.map((s, index) => (
                  <span
                    key={s.id || index}
                    className="cv-badge px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-medium"
                  >
                    <EditableElement
                      section="skills"
                      field="name"
                      index={index}
                      value={s.name}
                      onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                      placeholder="Competency"
                      className="inline"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bangladeshi Recruiter Details (if present) */}
        {personalDetails?.fatherName && (
          <section className="pt-2 border-t border-slate-200">
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-600 font-sans">
              <p><strong className="text-slate-900">Father's Name:</strong> {personalDetails.fatherName}</p>
              <p><strong className="text-slate-900">Mother's Name:</strong> {personalDetails.motherName}</p>
              <p><strong className="text-slate-900">Date of Birth:</strong> {personalDetails.dob}</p>
              <p><strong className="text-slate-900">Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
              {personalDetails.nid && <p><strong className="text-slate-900">National ID (NID):</strong> {personalDetails.nid}</p>}
              {personalDetails.bloodGroup && <p><strong className="text-slate-900">Blood Group:</strong> {personalDetails.bloodGroup}</p>}
            </div>
          </section>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <section className="pt-2 border-t border-slate-200">
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">
              References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
              {references.map((r, i) => (
                <div key={r.id || i} className="p-2 bg-slate-50 border border-slate-200 rounded">
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

export default ExecutiveSlate;
