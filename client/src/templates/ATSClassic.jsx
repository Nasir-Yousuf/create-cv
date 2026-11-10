import React from 'react';

export const ATSClassic = ({ cvData }) => {
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
  } = cvData;
  const fontFamily = design?.fontFamily || 'Merriweather';

  return (
    <div className="p-6 sm:p-8 md:p-10 bg-white text-black text-xs leading-normal" style={{ fontFamily }}>
      {/* Header */}
      <div className="text-center pb-4 border-b border-black">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-black">
          {personalInfo.fullName || 'YOUR FULL NAME'}
        </h1>
        <p className="text-sm font-medium mt-1 text-slate-800">
          {personalInfo.jobTitle || 'TARGET PROFESSION'}
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-700">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-800 text-justify leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id || exp.company}>
                <div className="flex justify-between font-bold text-black">
                  <span>{exp.jobTitle}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between italic text-slate-700 mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && <p className="text-slate-800 mb-1">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
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
            {education.map((edu) => (
              <div key={edu.id || edu.institution}>
                <div className="flex justify-between font-bold text-black">
                  <span>{edu.institution}</span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-slate-800">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.grade && <span className="italic"> — GPA: {edu.grade}</span>}
                </div>
                {edu.description && <p className="text-slate-700 text-[11px] mt-0.5">{edu.description}</p>}
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
          <p className="text-slate-800 leading-relaxed">
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            SELECTED PROJECTS
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id || proj.title}>
                <div className="flex justify-between font-bold text-black">
                  <span>{proj.title}</span>
                  {proj.startDate && <span>{proj.startDate} - {proj.endDate || 'Present'}</span>}
                </div>
                <p className="text-slate-800">{proj.description}</p>
                {proj.technologies && (
                  <p className="italic text-slate-600 text-[11px]">Technologies: {proj.technologies.join(', ')}</p>
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
            <div className="space-y-1 text-slate-800">
              {certifications.map((c) => (
                <p key={c.id || c.name}>• {c.name} ({c.issuer})</p>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              LANGUAGES
            </h2>
            <div className="space-y-1 text-slate-800">
              {languages.map((l) => (
                <p key={l.id || l.language}>• {l.language}: {l.proficiency}</p>
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-800">
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
          <div className="grid grid-cols-2 gap-4 text-slate-800">
            {references.map((r, i) => (
              <div key={r.id || i}>
                <p className="font-bold">{r.name}</p>
                <p>{r.designation}, {r.company}</p>
                {r.phone && <p>Phone: {r.phone}</p>}
                {r.email && <p>Email: {r.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration */}
      {declaration?.signedBy && (
        <div className="mt-6 pt-4 border-t border-black text-[11px] flex justify-between items-end">
          <p className="italic text-slate-700">{declaration.text || 'I hereby declare that all information above is true.'}</p>
          <div className="text-right">
            <p className="font-bold">{declaration.signedBy || personalInfo.fullName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSClassic;
