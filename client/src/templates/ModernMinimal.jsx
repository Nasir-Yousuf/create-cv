import React from 'react';
import './shared/cvElements.css';
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

export const ModernMinimal = ({ cvData, onOpenPhotoModal }) => {
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

  const isCircleOrSquare = personalInfo?.photoStyle === 'circle' || personalInfo?.photoStyle === 'square';
  const photoSizeClass = isCircleOrSquare
    ? (design?.photoSize === 'sm' ? 'w-16 h-16' : design?.photoSize === 'lg' ? 'w-28 h-28' : design?.photoSize === 'xl' ? 'w-36 h-36' : 'w-24 h-24')
    : (design?.photoSize === 'sm' ? 'w-20 h-28' : design?.photoSize === 'lg' ? 'w-32 h-44' : design?.photoSize === 'xl' ? 'w-36 h-48' : 'w-24 h-32');

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <section key="summary" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Professional Summary
            </h2>
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Click to write or edit your executive professional summary..."
              className="text-sm leading-relaxed text-slate-700 block"
            />
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
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) =>
                        dispatch(updateExperience({ index, data: { jobTitle: val } }))
                      }
                      placeholder="Job Title"
                      className="font-bold text-slate-900 inline-block"
                    />
                    <EditableElement
                      section="experience"
                      field="startDate"
                      index={index}
                      value={`${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`}
                      onSave={(val) => {
                        const parts = val.split('–').map((s) => s.trim());
                        dispatch(
                          updateExperience({
                            index,
                            data: { startDate: parts[0] || '', endDate: parts[1] || '' },
                          })
                        );
                      }}
                      placeholder="Start – End Date"
                      className="text-xs text-slate-500 font-medium inline-block"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <EditableElement
                      section="experience"
                      field="company"
                      index={index}
                      value={exp.company}
                      onSave={(val) =>
                        dispatch(updateExperience({ index, data: { company: val } }))
                      }
                      placeholder="Company Name"
                      className="inline-block"
                    />
                    <EditableElement
                      section="experience"
                      field="location"
                      index={index}
                      value={exp.location}
                      onSave={(val) =>
                        dispatch(updateExperience({ index, data: { location: val } }))
                      }
                      placeholder="Location"
                      className="inline-block text-slate-400"
                    />
                  </div>

                  {/* Description / Highlights */}
                  <EditableElement
                    section="experience"
                    field="description"
                    index={index}
                    value={exp.description}
                    multiline={true}
                    onSave={(val) =>
                      dispatch(updateExperience({ index, data: { description: val } }))
                    }
                    placeholder="Brief role overview..."
                    className="text-xs text-slate-700 mt-1 block"
                  />

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 mt-1.5">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          <EditableElement
                            section="experience"
                            field={`highlight_${hIdx}`}
                            index={index}
                            value={h}
                            onSave={(val) => {
                              const newHighlights = [...exp.highlights];
                              newHighlights[hIdx] = val;
                              dispatch(
                                updateExperience({ index, data: { highlights: newHighlights } })
                              );
                            }}
                            placeholder="Key achievement bullet point..."
                            className="inline"
                          />
                        </li>
                      ))}
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
              {skills.map((skill, index) => (
                <span
                  key={skill.id || index}
                  className="cv-badge px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800"
                  style={{ borderLeft: `3px solid ${primary}` }}
                >
                  <EditableElement
                    section="skills"
                    field="name"
                    index={index}
                    value={skill.name}
                    onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                    placeholder="Skill"
                    className="inline"
                  />
                  {skill.level && (
                    <span className="opacity-60 text-[10px] ml-1">({skill.level})</span>
                  )}
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
              {education.map((edu, index) => (
                <div key={edu.id || index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <EditableElement
                        section="education"
                        field="degree"
                        index={index}
                        value={`${edu.degree || ''} in ${edu.fieldOfStudy || ''}`}
                        onSave={(val) => {
                          const parts = val.split(' in ');
                          dispatch(
                            updateEducation({
                              index,
                              data: { degree: parts[0] || '', fieldOfStudy: parts[1] || '' },
                            })
                          );
                        }}
                        placeholder="Degree in Field"
                        className="font-bold text-slate-900 inline-block"
                      />
                      <p className="text-xs text-slate-600">
                        <EditableElement
                          section="education"
                          field="institution"
                          index={index}
                          value={edu.institution}
                          onSave={(val) =>
                            dispatch(updateEducation({ index, data: { institution: val } }))
                          }
                          placeholder="Institution / University"
                          className="inline-block"
                        />
                        {edu.grade && ` • ${edu.grade}`}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-slate-700 mt-1">{edu.description}</p>
                  )}
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
              {projects.map((proj, index) => (
                <div key={proj.id || index} className="text-xs">
                  <div className="flex justify-between items-center">
                    <EditableElement
                      section="projects"
                      field="title"
                      index={index}
                      value={proj.title}
                      onSave={(val) => dispatch(updateProject({ index, data: { title: val } }))}
                      placeholder="Project Title"
                      className="font-bold text-slate-900 text-sm inline-block"
                    />
                    {proj.startDate && (
                      <span className="text-slate-500">
                        {proj.startDate} - {proj.endDate || 'Present'}
                      </span>
                    )}
                  </div>
                  <EditableElement
                    section="projects"
                    field="description"
                    index={index}
                    value={proj.description}
                    multiline={true}
                    onSave={(val) =>
                      dispatch(updateProject({ index, data: { description: val } }))
                    }
                    placeholder="Project description..."
                    className="text-slate-700 mt-0.5 block"
                  />
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
                  <p className="text-slate-500 text-[11px]">
                    {c.issuer} {c.date && `• ${c.date}`}
                  </p>
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

      case 'personalDetails':
        if (!personalDetails?.fatherName && !personalDetails?.nid) return null;
        return (
          <section key="personalDetails" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700">
              {personalDetails.fatherName && <p><strong className="text-slate-900">Father's Name:</strong> {personalDetails.fatherName}</p>}
              {personalDetails.motherName && <p><strong className="text-slate-900">Mother's Name:</strong> {personalDetails.motherName}</p>}
              {personalDetails.dob && <p><strong className="text-slate-900">Date of Birth:</strong> {personalDetails.dob}</p>}
              {personalDetails.gender && <p><strong className="text-slate-900">Gender:</strong> {personalDetails.gender}</p>}
              {personalDetails.nationality && <p><strong className="text-slate-900">Nationality:</strong> {personalDetails.nationality}</p>}
              {personalDetails.nid && <p><strong className="text-slate-900">National ID (NID):</strong> {personalDetails.nid}</p>}
              {personalDetails.bloodGroup && <p><strong className="text-slate-900">Blood Group:</strong> {personalDetails.bloodGroup}</p>}
              {personalDetails.permanentAddress && (
                <p className="sm:col-span-2"><strong className="text-slate-900">Permanent Address:</strong> {personalDetails.permanentAddress}</p>
              )}
            </div>
          </section>
        );

      case 'references':
        if (!references || references.length === 0) return null;
        return (
          <section key="references" className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ color: primary, borderColor: primary }}
            >
              References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {references.map((r, i) => (
                <div key={r.id || i} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
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
                  {r.email && <p className="text-slate-500">Email: {r.email}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'declaration':
        if (!declaration?.signedBy && !declaration?.text) return null;
        return (
          <section key="declaration" className="pt-4 border-t border-slate-200 text-[10px] text-slate-600">
            <p className="italic">
              {declaration.text || 'I hereby declare that all the information provided above is true and correct.'}
            </p>
            <div className="flex justify-between items-end pt-4 text-xs">
              <p className="text-slate-500">Date: {declaration.date || new Date().toLocaleDateString('en-GB')}</p>
              <div className="text-right">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <p className="font-bold text-slate-900">{declaration.signedBy || personalInfo.fullName}</p>
              </div>
            </div>
          </section>
        );

      default:
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
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Your Full Name"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight block"
              style={{ color: primary }}
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Your Job Title / Target Role"
              className="text-lg font-medium text-slate-600 block"
            />
          </div>

          {/* Profile Photo (Click to edit directly) */}
          {personalInfo.photo && design?.showPhoto && (
            <div
              onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
              className="relative group/photo cursor-pointer shrink-0"
              title="Click to edit, crop, or replace photo"
            >
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className={`${photoSizeClass} shrink-0 object-cover object-center block border-2 shadow-sm transition-transform group-hover/photo:scale-105 ${
                  personalInfo.photoStyle === 'square'
                    ? 'rounded-none'
                    : personalInfo.photoStyle === 'circle'
                    ? 'rounded-full aspect-square'
                    : personalInfo.photoStyle === 'rounded'
                    ? 'rounded-2xl'
                    : 'rounded-md'
                }`}
                style={{ borderColor: primary }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/photo:opacity-100 flex items-center justify-center text-white transition-opacity text-[10px] font-bold">
                <Camera className="w-4 h-4 mr-1" /> Edit
              </div>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div
          className={`flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-slate-600 ${
            design?.photoPosition === 'center' ? 'justify-center' : ''
          }`}
        >
          <div className="cv-icon-row gap-1.5">
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
            <EditableElement
              section="personalInfo"
              field="email"
              value={personalInfo.email}
              onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
              placeholder="email@example.com"
              className="inline min-w-0 break-words"
            />
          </div>

          <div className="cv-icon-row gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
            <EditableElement
              section="personalInfo"
              field="phone"
              value={personalInfo.phone}
              onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
              placeholder="+1 555-1234"
              className="inline min-w-0 break-words"
            />
          </div>

          <div className="cv-icon-row gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
            <EditableElement
              section="personalInfo"
              field="location"
              value={personalInfo.location}
              onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
              placeholder="City, Country"
              className="inline min-w-0 break-words"
            />
          </div>

          <div className="cv-icon-row gap-1.5">
            <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
            <EditableElement
              section="personalInfo"
              field="website"
              value={personalInfo.website}
              onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
              placeholder="portfolio.com"
              className="inline min-w-0 break-words"
            />
          </div>

          <div className="cv-icon-row gap-1.5">
            <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
            <EditableElement
              section="personalInfo"
              field="linkedin"
              value={personalInfo.linkedin}
              onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
              placeholder="linkedin.com/in/user"
              className="inline min-w-0 break-words"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Sections rendering in exact order defined in design.sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
};

export default ModernMinimal;
