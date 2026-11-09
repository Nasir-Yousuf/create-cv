import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Award, Briefcase, GraduationCap } from 'lucide-react';

export const ExecutiveSlate = ({ cvData }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, design } = cvData;
  const primary = design?.primaryColor || '#0f172a'; // Dark slate
  const accent = design?.accentColor || '#64748b';
  const fontFamily = design?.fontFamily || 'Merriweather';

  return (
    <div className="bg-white text-slate-800 transition-all text-xs" style={{ fontFamily }}>
      {/* Executive Dark Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
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

        {personalInfo.photo && design?.showPhoto && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className={`w-24 h-24 object-cover border-2 border-slate-700 shadow-xl ${
              personalInfo.photoStyle === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          />
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
                    <p className="font-bold text-slate-900">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                    <p className="text-slate-600 text-[11px]">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
                    {edu.grade && <p className="text-slate-500 text-[10px]">{edu.grade}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-700" /> Key Expertise
              </h2>
              <div className="grid grid-cols-2 gap-2 font-sans">
                {skills.map((skill) => (
                  <div key={skill.id || skill.name} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                    <p className="font-semibold text-slate-800">{skill.name}</p>
                    {skill.level && <p className="text-[10px] text-slate-500">{skill.level}</p>}
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

export default ExecutiveSlate;

