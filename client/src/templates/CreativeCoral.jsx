import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export const CreativeCoral = ({ cvData }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, design } = cvData;
  const primary = design?.primaryColor || '#f43f5e'; // Coral
  const fontFamily = design?.fontFamily || 'Outfit';

  return (
    <div className="bg-white text-slate-800 text-xs min-h-full" style={{ fontFamily }}>
      {/* Top Banner with organic wave & avatar */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 p-8 sm:p-10 text-white relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {personalInfo.photo && design?.showPhoto && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-xl"
            />
          )}
          <div className="space-y-1 text-center sm:text-left">
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
                      <span className="text-rose-600 font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{exp.company} {exp.location && `• ${exp.location}`}</p>
                    {exp.description && <p className="text-slate-700">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 mt-1">
                        {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1">
                Featured Work
              </h3>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id || proj.title} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <p className="font-bold text-slate-900">{proj.title}</p>
                    <p className="text-slate-700 mt-0.5">{proj.description}</p>
                    {proj.technologies && (
                      <p className="text-rose-600 font-semibold text-[10px] mt-1">
                        {proj.technologies.join(' • ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Skills, Education, Languages */}
        <div className="space-y-6">
          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1 mb-3">
                Creative Skills
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id || skill.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-800">{skill.name}</span>
                      <span className="text-rose-500 font-semibold">{skill.level || 'Expert'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1 mb-2">
                Education
              </h3>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id || edu.institution}>
                    <p className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.startDate} - {edu.endDate})</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-200 pb-1 mb-2">
                Languages
              </h3>
              <div className="space-y-1">
                {languages.map((l) => (
                  <div key={l.id || l.language} className="flex justify-between text-[11px]">
                    <span className="text-slate-800">{l.language}</span>
                    <span className="text-rose-500 font-medium">{l.proficiency}</span>
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

export default CreativeCoral;

