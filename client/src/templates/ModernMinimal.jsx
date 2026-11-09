import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const ModernMinimal = ({ cvData }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    customSections = [],
    design = {},
  } = cvData;

  const primary = design?.primaryColor || '#4f46e5';
  const textColor = design?.textColor || '#1e293b';
  const fontFamily = design?.fontFamily || 'Inter';
  const sectionOrder = design?.sectionOrder || [
    'summary',
    'experience',
    'skills',
    'education',
    'projects',
    'certifications',
    'languages',
  ];

  // Photo size calculation
  const photoSizeClass =
    design?.photoSize === 'sm'
      ? 'w-16 h-16'
      : design?.photoSize === 'lg'
      ? 'w-28 h-28'
      : design?.photoSize === 'xl'
      ? 'w-36 h-36'
      : 'w-24 h-24';

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section key="summary" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{personalInfo.summary}</p>
          </section>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <section key="experience" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id || exp.company} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">{exp.jobTitle}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && <p className="text-xs text-slate-700 mt-1">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 mt-1.5">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Skills & Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id || skill.name}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800"
                  style={{ borderLeft: `3px solid ${primary}` }}
                >
                  {skill.name} {skill.level && <span className="opacity-60 text-[10px]">({skill.level})</span>}
                </span>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <section key="education" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id || edu.institution} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </span>
                      <p className="text-xs text-slate-600">
                        {edu.institution} {edu.grade && `• ${edu.grade}`}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.description && <p className="text-xs text-slate-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <section key="projects" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id || proj.title} className="text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{proj.title}</span>
                    {proj.startDate && (
                      <span className="text-slate-500">{proj.startDate} - {proj.endDate || 'Present'}</span>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-slate-500 mt-1 font-mono text-[11px]">
                      Technologies: {proj.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <section key="certifications" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id || c.name}>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-slate-500 text-[11px]">{c.issuer} {c.date && `• ${c.date}`}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <section key="languages" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-4 text-xs">
              {languages.map((l) => (
                <div key={l.id || l.language} className="flex gap-1.5">
                  <span className="font-medium text-slate-800">{l.language}:</span>
                  <span className="text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        // Handle custom sections
        if (sectionId.startsWith('custom-')) {
          const custom = customSections?.find((s) => s.id === sectionId);
          if (!custom || !custom.items || custom.items.length === 0) return null;
          return (
            <section key={sectionId} className="mb-6">
              <h2
                className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
                style={{ color: primary, borderColor: primary }}
              >
                {custom.title}
              </h2>
              <div className="space-y-2 text-xs">
                {custom.items.map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.title}</span>
                      {item.date && <span className="text-slate-500 font-normal">{item.date}</span>}
                    </div>
                    {item.subtitle && <p className="text-slate-600 font-medium">{item.subtitle}</p>}
                    {item.description && <p className="text-slate-700">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div
      className="p-8 sm:p-12 bg-white text-slate-800 transition-all leading-relaxed"
      style={{ fontFamily, color: textColor }}
    >
      {/* Header */}
      <div className="border-b pb-6 mb-6" style={{ borderColor: `${primary}30` }}>
        <div
          className={`flex flex-col sm:flex-row items-start justify-between gap-4 ${
            design?.photoPosition === 'center' ? 'sm:flex-col sm:items-center text-center' : ''
          }`}
        >
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: primary }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg font-medium text-slate-600">
              {personalInfo.jobTitle || 'Your Job Title'}
            </p>
          </div>

          {personalInfo.photo && design?.showPhoto && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className={`${photoSizeClass} object-cover border-2 shadow-sm ${
                personalInfo.photoStyle === 'square'
                  ? 'rounded-none'
                  : personalInfo.photoStyle === 'rounded'
                  ? 'rounded-2xl'
                  : 'rounded-full'
              }`}
              style={{ borderColor: primary }}
            />
          )}
        </div>

        {/* Contact Strip */}
        <div
          className={`flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-slate-600 ${
            design?.photoPosition === 'center' ? 'justify-center' : ''
          }`}
        >
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" style={{ color: primary }} />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Sections rendering in exact order defined in design.sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
};

export default ModernMinimal;
