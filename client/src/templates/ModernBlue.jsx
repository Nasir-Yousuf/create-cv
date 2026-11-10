import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
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
  Zap,
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
    interests = ['Travel', 'Photography', 'Technology', 'Fitness'],
    declaration = {},
    customSections = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#2563eb'; // Royal Blue as in reference photo
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

  // Sample Daniel Carter photo fallback if no photo uploaded
  const displayPhoto =
    personalInfo?.photo ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

  return (
    <div
      className="p-8 sm:p-10 bg-white text-slate-800 transition-all text-xs leading-relaxed selection:bg-blue-100 min-h-full font-sans"
      style={{ fontFamily, color: textColor }}
    >
      {/* 1. HEADER (Photo on Left + Name, Title & 2-Column Contact on Right) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-200">
        {/* Circular Profile Photo */}
        <div
          onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
          className="relative group cursor-pointer shrink-0"
          title="Click to change photo"
        >
          <img
            src={displayPhoto}
            alt={personalInfo.fullName || 'Daniel Carter'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:opacity-90 group-hover:scale-105 transition-all duration-200"
          />
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium backdrop-blur-[1px]">
            <Camera className="w-4 h-4 mr-1" /> Edit
          </div>
        </div>

        {/* Name, Title & Contact Grid */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName || 'Daniel Carter'}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Daniel Carter"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 block"
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle || 'Senior Software Engineer'}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Senior Software Engineer"
              className="text-base sm:text-lg font-medium text-blue-600 block mt-0.5"
            />
          </div>

          {/* 2-Column Contact Info Grid matching Reference Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-2 text-xs text-slate-600">
            {/* Email */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <EditableElement
                section="personalInfo"
                field="email"
                value={personalInfo.email || 'daniel.carter@example.com'}
                onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                placeholder="daniel.carter@example.com"
                className="hover:text-blue-600 truncate"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <EditableElement
                section="personalInfo"
                field="phone"
                value={personalInfo.phone || '+1 (555) 123-4567'}
                onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                placeholder="+1 (555) 123-4567"
                className="hover:text-blue-600"
              />
            </div>

            {/* Location */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <EditableElement
                section="personalInfo"
                field="location"
                value={personalInfo.location || 'San Francisco, CA'}
                onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                placeholder="San Francisco, CA"
                className="hover:text-blue-600"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <EditableElement
                section="personalInfo"
                field="linkedin"
                value={personalInfo.linkedin || 'linkedin.com/in/danielcarter'}
                onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                placeholder="linkedin.com/in/danielcarter"
                className="hover:text-blue-600 truncate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN BODY LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
        {/* LEFT COLUMN (35% - Skills, Languages, Interests) */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills Section */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Skills</span>
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-3">
              {(skills && skills.length > 0
                ? skills
                : [
                    { name: 'React' },
                    { name: 'Next.js' },
                    { name: 'TypeScript' },
                    { name: 'Node.js' },
                    { name: 'Python' },
                    { name: 'AWS' },
                    { name: 'UI/UX Design' },
                    { name: 'Project Management' },
                  ]
              ).map((skill, index) => (
                <span
                  key={skill.id || index}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200/60 transition-colors"
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

          {/* Languages Section */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <LangIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Languages</span>
            </h2>
            <div className="space-y-1.5 pt-3 text-xs text-slate-700">
              {(languages && languages.length > 0
                ? languages
                : [
                    { name: 'English', proficiency: 'Native' },
                    { name: 'Spanish', proficiency: 'Fluent' },
                    { name: 'French', proficiency: 'Intermediate' },
                  ]
              ).map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">
                    {typeof lang === 'string' ? lang : (lang.name || lang.language)}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {typeof lang === 'string' ? '' : `(${lang.proficiency || 'Fluent'})`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Interests Section */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <Heart className="w-3.5 h-3.5 text-blue-600" />
              <span>Interests</span>
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-3">
              {['Travel', 'Photography', 'Technology', 'Fitness'].map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (65% - Professional Summary, Work Experience, Education) */}
        <div className="md:col-span-8 space-y-6 md:border-l md:border-slate-100 md:pl-6">
          {/* Professional Summary */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Professional Summary</span>
            </h2>
            <div className="pt-2">
              <EditableElement
                section="personalInfo"
                field="summary"
                value={
                  personalInfo.summary ||
                  'Passionate Senior Software Engineer with 5+ years of experience in building scalable web applications. Skilled in modern technologies and delivering innovative solutions that make an impact.'
                }
                multiline={true}
                onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
                placeholder="Passionate Senior Software Engineer with 5+ years of experience..."
                className="text-xs leading-relaxed text-slate-600 block"
              />
            </div>
          </section>

          {/* Work Experience */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Work Experience</span>
            </h2>
            <div className="space-y-4 pt-3">
              {(experience && experience.length > 0
                ? experience
                : [
                    {
                      jobTitle: 'Senior Software Engineer',
                      company: 'TechCorp Inc.',
                      location: 'San Francisco, CA',
                      startDate: '2021',
                      endDate: 'Present',
                      highlights: [
                        'Lead development of cloud-based applications',
                        'Mentor junior developers',
                        'Improve system performance by 40%',
                      ],
                    },
                    {
                      jobTitle: 'Software Engineer',
                      company: 'InnovateLabs',
                      location: 'New York, NY',
                      startDate: '2019',
                      endDate: '2021',
                      highlights: [
                        'Developed responsive web applications',
                        'Collaborated with cross-functional teams',
                        'Implemented CI/CD pipelines',
                      ],
                    },
                  ]
              ).map((exp, index) => (
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
                      placeholder="Senior Software Engineer"
                      className="font-bold text-slate-900 text-xs inline"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
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
                      placeholder="TechCorp Inc."
                      className="inline text-slate-700"
                    />
                    {exp.location && <span> • {exp.location}</span>}
                  </div>

                  {/* Highlights / Bullet points */}
                  {exp.highlights && exp.highlights.length > 0 ? (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-600 pt-1">
                      {exp.highlights.map((item, hIdx) => (
                        <li key={hIdx}>{item}</li>
                      ))}
                    </ul>
                  ) : exp.description ? (
                    <p className="text-xs text-slate-600 pt-1">{exp.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 flex items-center gap-1.5 border-b border-slate-100">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Education</span>
            </h2>
            <div className="space-y-3 pt-3">
              {(education && education.length > 0
                ? education
                : [
                    {
                      degree: 'Bachelor of Science in Computer Science',
                      institution: 'University of California',
                      location: 'Berkeley, CA',
                      startDate: '2015',
                      endDate: '2019',
                    },
                  ]
              ).map((edu, index) => (
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
                      placeholder="Bachelor of Science in Computer Science"
                      className="font-bold text-slate-900 text-xs inline"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      {edu.startDate} – {edu.endDate || '2019'}
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
                      placeholder="University of California"
                      className="inline text-slate-700"
                    />
                    {edu.location && <span> • {edu.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernBlue;
