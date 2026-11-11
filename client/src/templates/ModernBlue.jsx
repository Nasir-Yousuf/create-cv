import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateLanguage,
  updateReference,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Camera,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Languages as LangIcon,
  Heart,
  FolderGit2,
  User,
  Users,
} from 'lucide-react';

export const ModernBlue = ({ cvData, onOpenPhotoModal }) => {
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
    interests = [],
    declaration = {},
    customSections = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#2563eb'; // Royal Blue
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

  return (
    <div
      className="p-6 sm:p-8 md:p-9 bg-white text-slate-800 transition-all text-xs leading-normal font-sans min-h-full"
      style={{ fontFamily, color: textColor }}
    >
      {/* 1. HEADER (Photo on Left + Name, Title & 2-Column Contact on Right) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-4 border-b border-slate-200">
        {/* Circular Profile Photo */}
        {design?.showPhoto !== false && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="relative group cursor-pointer shrink-0"
            title="Click to change photo"
          >
            {personalInfo?.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || 'User Profile Photo'}
                className="w-20 h-20 sm:w-24 sm:h-24 aspect-square shrink-0 rounded-full object-cover object-center block border-2 border-slate-100 shadow-sm group-hover:opacity-90 group-hover:scale-105 transition-all duration-200"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-all print:hidden cv-photo-placeholder">
                <Camera className="w-5 h-5 mb-1 opacity-70" />
                <span className="text-[10px] font-medium">Add Photo</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium backdrop-blur-[1px]">
              <Camera className="w-3.5 h-3.5 mr-1" /> Edit
            </div>
          </div>
        )}

        {/* Name, Title & Contact Grid */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
          <div>
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName || ''}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Full Name"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 block"
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle || ''}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Job Title / Professional Headline"
              className="text-sm font-semibold mt-0.5 block"
              style={{ color: primary }}
            />
          </div>

          {/* 2-Column Contact Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 text-[11px] text-slate-600 leading-normal">
            {personalInfo.email && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="email"
                  tag="span"
                  value={personalInfo.email}
                  onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                  placeholder="email@example.com"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
            {personalInfo.phone && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="phone"
                  tag="span"
                  value={personalInfo.phone}
                  onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                  placeholder="+1 555-0199"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
            {personalInfo.location && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="location"
                  tag="span"
                  value={personalInfo.location}
                  onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                  placeholder="City, Country"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
            {personalInfo.website && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="website"
                  tag="span"
                  value={personalInfo.website}
                  onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                  placeholder="portfolio.com"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="linkedin"
                  tag="span"
                  value={personalInfo.linkedin}
                  onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                  placeholder="linkedin.com/in/username"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
            {personalInfo.github && (
              <div className="cv-icon-row gap-1.5 justify-center sm:justify-start min-w-0">
                <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="github"
                  tag="span"
                  value={personalInfo.github}
                  onSave={(val) => dispatch(updatePersonalInfo({ github: val }))}
                  placeholder="github.com/username"
                  className="inline min-w-0 break-words hover:text-slate-900 leading-normal"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN BODY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
        {/* LEFT COLUMN (35% - Skills, Languages, Interests) */}
        <div className="md:col-span-4 space-y-5">
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <Award className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Skills</span>
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {skills.map((skill, index) => (
                  <span
                    key={skill.id || index}
                    className="cv-badge text-xs font-semibold px-2.5 py-1 rounded-md text-white shadow-xs"
                    style={{ backgroundColor: primary }}
                  >
                    <EditableElement
                      section="skills"
                      field="name"
                      index={index}
                      value={typeof skill === 'string' ? skill : skill.name}
                      onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                      placeholder="Skill"
                      className="inline"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <LangIcon className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Languages</span>
              </h2>
              <div className="space-y-1 pt-2 text-xs text-slate-700">
                {languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <EditableElement
                      section="languages"
                      field="language"
                      index={index}
                      value={typeof lang === 'string' ? lang : (lang.name || lang.language)}
                      onSave={(val) => dispatch(updateLanguage({ index, data: { language: val, name: val } }))}
                      placeholder="Language"
                      className="font-medium text-slate-900 inline"
                    />
                    <span className="text-slate-500 text-[11px]">
                      {typeof lang === 'string' ? '' : `(${lang.proficiency || 'Fluent'})`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests Section */}
          {interests && interests.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <Heart className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Interests</span>
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="cv-badge bg-slate-50 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Personal Details (BD recruiter format) */}
          {personalDetails?.fatherName && (
            <section className="pt-2 border-t border-slate-100 text-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">
                Personal Info
              </h2>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p><strong>DOB:</strong> {personalDetails.dob}</p>
                <p><strong>NID:</strong> {personalDetails.nid}</p>
                <p><strong>Blood:</strong> {personalDetails.bloodGroup}</p>
                <p><strong>Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN (65% - Professional Summary, Work Experience, Education, Projects, References) */}
        <div className="md:col-span-8 space-y-4 md:border-l md:border-slate-100 md:pl-6">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <User className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Professional Summary</span>
              </h2>
              <div className="pt-1.5">
                <EditableElement
                  section="personalInfo"
                  field="summary"
                  value={personalInfo.summary}
                  multiline={true}
                  onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
                  placeholder="Write your professional summary..."
                  className="text-xs leading-relaxed text-slate-600 block"
                />
              </div>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <Briefcase className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Work Experience</span>
              </h2>
              <div className="space-y-3 pt-2">
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <EditableElement
                        section="experience"
                        field="jobTitle"
                        index={index}
                        value={exp.jobTitle}
                        onSave={(val) =>
                          dispatch(updateExperience({ index, data: { jobTitle: val } }))
                        }
                        placeholder="Job Title"
                        className="font-bold text-slate-900 text-xs inline"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">
                        <EditableElement
                          section="experience"
                          field="startDate"
                          index={index}
                          value={exp.startDate}
                          onSave={(val) =>
                            dispatch(updateExperience({ index, data: { startDate: val } }))
                          }
                          placeholder="Start"
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
                            onSave={(val) =>
                              dispatch(updateExperience({ index, data: { endDate: val } }))
                            }
                            placeholder="End"
                            className="inline"
                          />
                        )}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium">
                      <EditableElement
                        section="experience"
                        field="company"
                        index={index}
                        value={exp.company}
                        onSave={(val) =>
                          dispatch(updateExperience({ index, data: { company: val } }))
                        }
                        placeholder="Company Name"
                        className="inline text-slate-700"
                      />
                      {exp.location && <span> • {exp.location}</span>}
                    </div>

                    {exp.description && (
                      <EditableElement
                        section="experience"
                        field="description"
                        index={index}
                        value={exp.description}
                        multiline={true}
                        onSave={(val) =>
                          dispatch(updateExperience({ index, data: { description: val } }))
                        }
                        placeholder="Responsibilities..."
                        className="text-xs text-slate-600 pt-0.5 block leading-relaxed"
                      />
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-600 pt-0.5">
                        {exp.highlights.map((item, hIdx) => (
                          <li key={hIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <GraduationCap className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Education</span>
              </h2>
              <div className="space-y-2 pt-2">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <EditableElement
                        section="education"
                        field="degree"
                        index={index}
                        value={edu.degree}
                        onSave={(val) =>
                          dispatch(updateEducation({ index, data: { degree: val } }))
                        }
                        placeholder="Degree"
                        className="font-bold text-slate-900 text-xs inline"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">
                        {edu.startDate} – {edu.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={index}
                        value={edu.institution}
                        onSave={(val) =>
                          dispatch(updateEducation({ index, data: { institution: val } }))
                        }
                        placeholder="Institution"
                        className="inline text-slate-700"
                      />
                      {edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <FolderGit2 className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>Key Projects</span>
              </h2>
              <div className="space-y-2 pt-2 text-xs">
                {projects.map((proj, index) => (
                  <div key={proj.id || index} className="space-y-0.5">
                    <EditableElement
                      section="projects"
                      field="title"
                      index={index}
                      value={proj.title}
                      onSave={(val) => dispatch(updateProject({ index, data: { title: val } }))}
                      placeholder="Project Title"
                      className="font-bold text-slate-900 inline"
                    />
                    {proj.description && <p className="text-slate-600 text-xs">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1.5 cv-icon-row gap-1.5 border-b border-slate-100">
                <Users className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>References</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {references.map((r, i) => (
                  <div key={r.id || i} className="p-2 bg-slate-50 rounded border border-slate-100">
                    <EditableElement
                      section="references"
                      field="name"
                      index={i}
                      value={r.name}
                      onSave={(val) => dispatch(updateReference({ index: i, data: { name: val } }))}
                      placeholder="Referee Name"
                      className="font-bold text-slate-900 block"
                    />
                    <p className="text-slate-600 text-[11px]">{r.designation}, {r.company}</p>
                    {r.phone && <p className="text-slate-500 text-[11px]">Phone: {r.phone}</p>}
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

export default ModernBlue;
