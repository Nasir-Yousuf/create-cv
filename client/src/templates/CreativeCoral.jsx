import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles, Camera } from 'lucide-react';

export const CreativeCoral = ({ cvData, onOpenPhotoModal }) => {
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
    <div className="bg-white text-slate-800 text-xs min-h-full" style={{ fontFamily }}>
      {/* Top Banner with organic wave & portrait/circle avatar */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 p-8 sm:p-10 text-white relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {design?.showPhoto && (
            <div
              onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
              className="cursor-pointer group relative shrink-0"
              title="Click to edit photo"
            >
              {personalInfo.photo ? (
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className={`${photoSizeClass} object-cover rounded-xl border-4 border-white shadow-xl`}
                />
              ) : (
                <div className={`${photoSizeClass} border-2 border-dashed border-white/80 rounded-xl flex flex-col items-center justify-center text-white p-2 text-center`}>
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[9px]">Portrait</span>
                </div>
              )}
            </div>
          )}
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {personalInfo.fullName || 'Creative Name'}
            </h1>
            <p className="text-rose-100 font-medium text-base tracking-wide">
              {personalInfo.jobTitle || 'UI/UX & Product Designer'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2 text-xs text-white/90">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> About Me
              </h3>
              <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Experience History
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id || exp.company} className="relative pl-4 border-l-2 border-rose-300 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-500" />
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.jobTitle}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-rose-600 font-semibold">{exp.company}</div>
                    {exp.description && <p className="text-slate-700">{exp.description}</p>}
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
                {projects.map((proj) => (
                  <div key={proj.id || proj.title} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <p className="font-bold text-slate-900">{proj.title}</p>
                    <p className="text-slate-600 mt-1">{proj.description}</p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-white text-rose-600 rounded text-[10px] font-medium border border-rose-200">
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
                {skills.map((s) => (
                  <span key={s.id || s.name} className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-medium border border-amber-200">
                    {s.name}
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
                {education.map((edu) => (
                  <div key={edu.id || edu.institution} className="space-y-0.5">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600 text-[11px]">{edu.institution} {edu.grade && `(${edu.grade})`}</p>
                    <p className="text-slate-400 text-[10px]">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {personalDetails?.fatherName && (
            <section className="space-y-1.5 pt-2 border-t border-rose-100">
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
                  <p className="font-bold text-slate-900">{r.name}</p>
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
