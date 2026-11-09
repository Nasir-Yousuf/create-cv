import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const OceanSplit = ({ cvData }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, design } = cvData;
  const primary = design?.primaryColor || '#0284c7'; // Sky/Ocean blue
  const accent = design?.accentColor || '#38bdf8';
  const fontFamily = design?.fontFamily || 'Inter';

  return (
    <div className="flex flex-col sm:flex-row min-h-full bg-white text-slate-800" style={{ fontFamily }}>
      {/* Left Sidebar */}
      <div className="w-full sm:w-1/3 bg-slate-900 text-white p-6 sm:p-8 space-y-6 shrink-0">
        {/* Photo */}
        {personalInfo.photo && design?.showPhoto && (
          <div className="flex justify-center">
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className={`w-28 h-28 object-cover border-4 border-sky-400 shadow-lg ${
                personalInfo.photoStyle === 'square' ? 'rounded-none' : 'rounded-full'
              }`}
            />
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
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-3 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-700 pb-1">
              Skills
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id || skill.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className="text-slate-400 text-[10px]">{skill.level || 'Proficient'}</span>
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
                            : '45%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-700 pb-1">
              Languages
            </h3>
            <div className="space-y-1 text-slate-300">
              {languages.map((l) => (
                <div key={l.id || l.language} className="flex justify-between text-[11px]">
                  <span>{l.language}</span>
                  <span className="text-slate-400">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full sm:w-2/3 p-6 sm:p-8 space-y-6">
        {/* Name Header */}
        <div className="border-b-2 pb-4" style={{ borderColor: primary }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-base font-semibold mt-1" style={{ color: primary }}>
            {personalInfo.jobTitle || 'Your Job Title'}
          </p>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Profile
            </h3>
            <p className="text-xs leading-relaxed text-slate-700">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id || exp.company} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.jobTitle}</span>
                    <span className="text-slate-500 font-normal">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
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

        {/* Education */}
        {education && education.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Education
            </h3>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id || edu.institution}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                    <span className="text-slate-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-slate-600">{edu.institution} {edu.grade && `(${edu.grade})`}</p>
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
              {projects.map((proj) => (
                <div key={proj.id || proj.title}>
                  <p className="font-bold text-slate-900">{proj.title}</p>
                  <p className="text-slate-700">{proj.description}</p>
                  {proj.technologies && (
                    <p className="text-slate-500 text-[10px] mt-0.5">Stack: {proj.technologies.join(', ')}</p>
                  )}
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

