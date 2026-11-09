import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Camera } from 'lucide-react';

export const ExecutiveSlate = ({ cvData, onOpenPhotoModal }) => {
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
    <div className="bg-white text-slate-800 transition-all text-xs" style={{ fontFamily }}>
      {/* Executive Dark Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Curriculum Vitae
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-sans tracking-wide text-indigo-300">
            {personalInfo.jobTitle || 'Executive Job Title'}
          </p>
        </div>

        {/* Portrait Passport Photo */}
        {design?.showPhoto && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="shrink-0 relative group cursor-pointer"
            title="Click to edit portrait photo"
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className={`${photoSizeClass} object-cover border-2 border-slate-700 shadow-xl rounded-md`}
              />
            ) : (
              <div
                className={`${photoSizeClass} border border-dashed border-slate-600 rounded-md bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 text-center`}
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px]">Photo</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Banner */}
      <div className="bg-slate-100 border-b border-slate-200 px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-slate-700">
        {personalInfo.email && (
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" />{personalInfo.email}</span>
        )}
        {personalInfo.phone && (
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" />{personalInfo.phone}</span>
        )}
        {personalInfo.location && (
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" />{personalInfo.location}</span>
        )}
        {personalInfo.linkedin && (
          <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-slate-500" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
        )}
      </div>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-6">
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">
              Executive Profile
            </h2>
            <p className="text-slate-700 font-sans leading-relaxed text-xs">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-700" /> Career History & Achievements
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id || exp.company} className="space-y-1">
                  <div className="flex justify-between items-baseline font-sans">
                    <span className="font-bold text-sm text-slate-900">{exp.jobTitle}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-serif text-slate-600 italic">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-slate-700 font-sans mt-1">{exp.description}</p>}
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
              <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-700" /> Education
              </h2>
              <div className="space-y-3 font-sans">
                {education.map((edu) => (
                  <div key={edu.id || edu.institution}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600 text-[11px]">
                      {edu.institution} {edu.grade && `• ${edu.grade}`}
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
                {skills.map((s) => (
                  <span
                    key={s.id || s.name}
                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-medium"
                  >
                    {s.name}
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
              {personalDetails.permanentAddress && (
                <p className="sm:col-span-2"><strong className="text-slate-900">Permanent Address:</strong> {personalDetails.permanentAddress}</p>
              )}
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
                  <p className="font-bold text-slate-900">{r.name}</p>
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
