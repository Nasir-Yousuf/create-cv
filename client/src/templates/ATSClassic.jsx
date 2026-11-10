import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateCertification,
  updateLanguage,
  updateReference,
  updateDeclaration,
  updatePersonalDetails,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';

export const ATSClassic = ({ cvData }) => {
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
  const fontFamily = design?.fontFamily || 'Merriweather';

  return (
    <div className="p-6 sm:p-8 md:p-10 bg-white text-black text-xs leading-normal font-serif" style={{ fontFamily }}>
      {/* Header */}
      <div className="text-center pb-4 border-b border-black">
        <EditableElement
          section="personalInfo"
          field="fullName"
          tag="h1"
          value={personalInfo.fullName}
          onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
          placeholder="YOUR FULL NAME"
          className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-black block"
        />
        <EditableElement
          section="personalInfo"
          field="jobTitle"
          tag="p"
          value={personalInfo.jobTitle}
          onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
          placeholder="TARGET PROFESSION"
          className="text-sm font-medium mt-1 text-slate-800 block"
        />

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-700">
          {personalInfo.location && (
            <EditableElement
              section="personalInfo"
              field="location"
              value={personalInfo.location}
              onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
              placeholder="City, Country"
              className="inline"
            />
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <EditableElement
                section="personalInfo"
                field="email"
                value={personalInfo.email}
                onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                placeholder="email@example.com"
                className="inline"
              />
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <EditableElement
                section="personalInfo"
                field="phone"
                value={personalInfo.phone}
                onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                placeholder="+1 555-0199"
                className="inline"
              />
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <EditableElement
                section="personalInfo"
                field="linkedin"
                value={personalInfo.linkedin}
                onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                placeholder="linkedin.com/in/username"
                className="inline"
              />
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <EditableElement
                section="personalInfo"
                field="website"
                value={personalInfo.website}
                onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                placeholder="portfolio.com"
                className="inline"
              />
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            PROFESSIONAL SUMMARY
          </h2>
          <EditableElement
            section="personalInfo"
            field="summary"
            value={personalInfo.summary}
            multiline={true}
            onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
            placeholder="Write your professional summary..."
            className="text-slate-800 text-justify leading-relaxed block text-xs"
          />
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="space-y-0.5">
                <div className="flex justify-between font-bold text-black text-xs">
                  <EditableElement
                    section="experience"
                    field="jobTitle"
                    index={index}
                    value={exp.jobTitle}
                    onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                    placeholder="Job Title"
                    className="inline font-bold"
                  />
                  <span className="text-[11px] font-normal text-slate-700">
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
                <div className="flex justify-between italic text-slate-700 mb-1 text-[11px]">
                  <EditableElement
                    section="experience"
                    field="company"
                    index={index}
                    value={exp.company}
                    onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                    placeholder="Company Name"
                    className="inline italic"
                  />
                  {exp.location && (
                    <EditableElement
                      section="experience"
                      field="location"
                      index={index}
                      value={exp.location}
                      onSave={(val) => dispatch(updateExperience({ index, data: { location: val } }))}
                      placeholder="Location"
                      className="inline"
                    />
                  )}
                </div>
                {exp.description && (
                  <EditableElement
                    section="experience"
                    field="description"
                    index={index}
                    value={exp.description}
                    multiline={true}
                    onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                    placeholder="Role responsibilities..."
                    className="text-slate-800 text-xs leading-relaxed block"
                  />
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-800 text-xs">
                    {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            EDUCATION
          </h2>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between font-bold text-black text-xs">
                  <EditableElement
                    section="education"
                    field="institution"
                    index={index}
                    value={edu.institution}
                    onSave={(val) => dispatch(updateEducation({ index, data: { institution: val } }))}
                    placeholder="Institution Name"
                    className="inline font-bold"
                  />
                  <span className="text-[11px] font-normal text-slate-700">
                    <EditableElement
                      section="education"
                      field="startDate"
                      index={index}
                      value={edu.startDate}
                      onSave={(val) => dispatch(updateEducation({ index, data: { startDate: val } }))}
                      placeholder="Start"
                      className="inline"
                    />
                    {' – '}
                    <EditableElement
                      section="education"
                      field="endDate"
                      index={index}
                      value={edu.endDate}
                      onSave={(val) => dispatch(updateEducation({ index, data: { endDate: val } }))}
                      placeholder="End"
                      className="inline"
                    />
                  </span>
                </div>
                <div className="text-slate-800 text-xs">
                  <EditableElement
                    section="education"
                    field="degree"
                    index={index}
                    value={edu.degree}
                    onSave={(val) => dispatch(updateEducation({ index, data: { degree: val } }))}
                    placeholder="Degree"
                    className="inline font-medium"
                  />
                  {edu.fieldOfStudy && (
                    <span>
                      {' in '}
                      <EditableElement
                        section="education"
                        field="fieldOfStudy"
                        index={index}
                        value={edu.fieldOfStudy}
                        onSave={(val) => dispatch(updateEducation({ index, data: { fieldOfStudy: val } }))}
                        placeholder="Field of Study"
                        className="inline"
                      />
                    </span>
                  )}
                  {edu.grade && (
                    <span className="italic">
                      {' — GPA: '}
                      <EditableElement
                        section="education"
                        field="grade"
                        index={index}
                        value={edu.grade}
                        onSave={(val) => dispatch(updateEducation({ index, data: { grade: val } }))}
                        placeholder="Grade / GPA"
                        className="inline italic"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            CORE SKILLS & EXPERTISE
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-800 text-xs">
            {skills.map((s, index) => (
              <span key={s.id || index} className="inline-flex items-center gap-1">
                <EditableElement
                  section="skills"
                  field="name"
                  index={index}
                  value={s.name}
                  onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                  placeholder="Skill"
                  className="inline font-medium"
                />
                {index < skills.length - 1 && <span className="text-slate-400">•</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            SELECTED PROJECTS
          </h2>
          <div className="space-y-2">
            {projects.map((proj, index) => (
              <div key={proj.id || index} className="space-y-0.5">
                <div className="flex justify-between font-bold text-black text-xs">
                  <EditableElement
                    section="projects"
                    field="title"
                    index={index}
                    value={proj.title}
                    onSave={(val) => dispatch(updateProject({ index, data: { title: val } }))}
                    placeholder="Project Title"
                    className="inline font-bold"
                  />
                  {proj.startDate && (
                    <span className="text-[11px] font-normal text-slate-700">
                      {proj.startDate} - {proj.endDate || 'Present'}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <EditableElement
                    section="projects"
                    field="description"
                    index={index}
                    value={proj.description}
                    multiline={true}
                    onSave={(val) => dispatch(updateProject({ index, data: { description: val } }))}
                    placeholder="Project details..."
                    className="text-slate-800 text-xs block"
                  />
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="italic text-slate-600 text-[11px]">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              CERTIFICATIONS
            </h2>
            <div className="space-y-1 text-slate-800 text-xs">
              {certifications.map((c, index) => (
                <div key={c.id || index} className="flex items-baseline gap-1">
                  <span>•</span>
                  <EditableElement
                    section="certifications"
                    field="name"
                    index={index}
                    value={c.name}
                    onSave={(val) => dispatch(updateCertification({ index, data: { name: val } }))}
                    placeholder="Certification"
                    className="inline font-medium"
                  />
                  {c.issuer && <span className="text-slate-600 text-[11px]">({c.issuer})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              LANGUAGES
            </h2>
            <div className="space-y-1 text-slate-800 text-xs">
              {languages.map((l, index) => (
                <div key={l.id || index} className="flex items-baseline gap-1">
                  <span>•</span>
                  <EditableElement
                    section="languages"
                    field="language"
                    index={index}
                    value={l.language || l.name}
                    onSave={(val) => dispatch(updateLanguage({ index, data: { language: val, name: val } }))}
                    placeholder="Language"
                    className="inline font-medium"
                  />
                  {l.proficiency && <span className="text-slate-600 text-[11px]">({l.proficiency})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Details */}
      {personalDetails?.fatherName && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            PERSONAL DETAILS
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-800 text-xs">
            <p><strong>Father's Name:</strong> {personalDetails.fatherName}</p>
            <p><strong>Mother's Name:</strong> {personalDetails.motherName}</p>
            <p><strong>Date of Birth:</strong> {personalDetails.dob}</p>
            <p><strong>Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
            {personalDetails.nid && <p><strong>National ID:</strong> {personalDetails.nid}</p>}
            {personalDetails.bloodGroup && <p><strong>Blood Group:</strong> {personalDetails.bloodGroup}</p>}
          </div>
        </div>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            REFERENCES
          </h2>
          <div className="grid grid-cols-2 gap-4 text-slate-800 text-xs">
            {references.map((r, i) => (
              <div key={r.id || i} className="space-y-0.5">
                <EditableElement
                  section="references"
                  field="name"
                  index={i}
                  value={r.name}
                  onSave={(val) => dispatch(updateReference({ index: i, data: { name: val } }))}
                  placeholder="Referee Name"
                  className="font-bold inline-block"
                />
                <p className="text-[11px] text-slate-700">{r.designation}, {r.company}</p>
                {r.phone && <p className="text-[11px]">Phone: {r.phone}</p>}
                {r.email && <p className="text-[11px]">Email: {r.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration */}
      {(declaration?.signedBy || declaration?.text) && (
        <div className="mt-6 pt-4 border-t border-black text-[11px] flex justify-between items-end">
          <EditableElement
            section="declaration"
            field="text"
            value={declaration.text || 'I hereby declare that all information above is true.'}
            multiline={true}
            onSave={(val) => dispatch(updateDeclaration({ text: val }))}
            placeholder="Declaration text..."
            className="italic text-slate-700 max-w-md inline-block"
          />
          <div className="text-right">
            <EditableElement
              section="declaration"
              field="signedBy"
              value={declaration.signedBy || personalInfo.fullName}
              onSave={(val) => dispatch(updateDeclaration({ signedBy: val }))}
              placeholder="Signed by name"
              className="font-bold inline-block"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSClassic;
