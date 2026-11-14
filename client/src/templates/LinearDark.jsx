import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updatePersonalDetails,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateCertification,
  updateLanguage,
  updateReference,
  updateDeclaration,
  updateCustomSection,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import {
  resolveDesignTokens,
  getSectionVisibility,
  getOrderedSectionKeys,
  CVSection,
  CVSectionTitle,
  CVPersonalDetailsTable,
  CVCustomSections,
  CVDeclaration,
  CVPhoto,
} from './shared/cvElements';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Terminal,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  FolderGit2,
  Code,
  Users,
} from 'lucide-react';

export const LinearDark = ({ cvData, onOpenPhotoModal }) => {
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
  } = cvData || {};

  const tokens = resolveDesignTokens(cvData, {
    primaryColor: '#4f46e5', // Tech Indigo
    accentColor: '#06b6d4',
    headingColor: '#0f172a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f8fafc',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 16,
    itemSpacing: 10,
    dividerThickness: 1,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const defaultOrder = [
    'summary',
    'experience',
    'skills',
    'projects',
    'education',
    'certifications',
    'languages',
    'personalDetails',
    'references',
    'customSections',
    'declaration',
  ];

  const orderedKeys = getOrderedSectionKeys(cvData, defaultOrder);

  const renderSectionContent = (key) => {
    switch (key) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <CVSection key="summary" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">01 //</span>
              <CVSectionTitle
                title="Professional Overview"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Write your technical overview..."
              className="text-slate-700 leading-relaxed text-xs block text-justify"
              style={{ fontFamily: tokens.bodyFont }}
            />
          </CVSection>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <CVSection key="experience" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">02 //</span>
              <CVSectionTitle
                title="Experience & Engineering History"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="space-y-3.5">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="cv-item-avoid-break space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                      placeholder="Role / Title"
                      className="font-bold text-slate-900 inline-block text-xs"
                      style={{ fontFamily: tokens.headingFont }}
                    />
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      <EditableElement
                        section="experience"
                        field="startDate"
                        index={index}
                        value={exp.startDate}
                        onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                        placeholder="Start"
                        className="inline"
                      />
                      {' — '}
                      {exp.current ? (
                        <span className="text-emerald-700 font-semibold">Present</span>
                      ) : (
                        <EditableElement
                          section="experience"
                          field="endDate"
                          index={index}
                          value={exp.endDate}
                          onSave={(val) => dispatch(updateExperience({ index, data: { endDate: val } }))}
                          placeholder="End"
                          className="inline"
                        />
                      )}
                    </span>
                  </div>
                  <div className="text-[11.5px] font-medium" style={{ color: tokens.primaryColor }}>
                    <EditableElement
                      section="experience"
                      field="company"
                      index={index}
                      value={exp.company}
                      onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                      placeholder="Company"
                      className="inline font-semibold"
                    />
                    {exp.location && (
                      <span className="text-slate-500 font-normal">
                        {' • '}
                        <EditableElement
                          section="experience"
                          field="location"
                          index={index}
                          value={exp.location}
                          onSave={(val) => dispatch(updateExperience({ index, data: { location: val } }))}
                          placeholder="Location"
                          className="inline"
                        />
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <EditableElement
                      section="experience"
                      field="description"
                      index={index}
                      value={exp.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                      placeholder="Responsibilities and architectural impact..."
                      className="text-slate-700 text-xs leading-relaxed block mt-1"
                      style={{ fontFamily: tokens.bodyFont }}
                    />
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-xs mt-1">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <CVSection key="skills" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">03 //</span>
              <CVSectionTitle
                title="Technical Stack & Proficiencies"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skills.map((s, index) => (
                <span
                  key={s.id || index}
                  className="cv-badge px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-mono hover:border-indigo-400 transition-colors"
                >
                  <EditableElement
                    section="skills"
                    field="name"
                    index={index}
                    value={s.name}
                    onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                    placeholder="Skill"
                    className="inline font-mono font-medium"
                  />
                  {s.level ? <span className="ml-1 text-[9px] text-slate-400 font-sans">({s.level}%)</span> : null}
                </span>
              ))}
            </div>
          </CVSection>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <CVSection key="projects" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">04 //</span>
              <CVSectionTitle
                title="System Projects & Deliverables"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj, index) => (
                <div
                  key={proj.id || index}
                  className="cv-item-avoid-break p-2.5 bg-slate-50/70 border border-slate-200 rounded-md space-y-1"
                >
                  <div className="flex justify-between items-baseline gap-2">
                    <EditableElement
                      section="projects"
                      field="title"
                      index={index}
                      value={proj.title || proj.name}
                      onSave={(val) => dispatch(updateProject({ index, data: { title: val, name: val } }))}
                      placeholder="Project Name"
                      className="font-bold text-slate-900 text-xs inline"
                      style={{ fontFamily: tokens.headingFont }}
                    />
                    {proj.url && (
                      <span className="text-[10px] font-mono text-indigo-600 truncate max-w-[130px]">
                        {proj.url.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <EditableElement
                      section="projects"
                      field="description"
                      index={index}
                      value={proj.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateProject({ index, data: { description: val } }))}
                      placeholder="Project architecture and achievements..."
                      className="text-slate-600 text-[11px] leading-relaxed block"
                      style={{ fontFamily: tokens.bodyFont }}
                    />
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1 text-[9.5px] font-mono text-slate-500">
                      {proj.technologies.map((t, tidx) => (
                        <span key={tidx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <CVSection key="education" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">05 //</span>
              <CVSectionTitle
                title="Academic Qualifications"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="cv-item-avoid-break flex justify-between items-start gap-4">
                  <div>
                    <EditableElement
                      section="education"
                      field="degree"
                      index={idx}
                      value={edu.degree}
                      onSave={(val) => dispatch(updateEducation({ index: idx, data: { degree: val } }))}
                      placeholder="Degree / Certificate"
                      className="font-bold text-slate-900 text-xs inline"
                      style={{ fontFamily: tokens.headingFont }}
                    />
                    <div className="text-[11px] text-slate-600">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={idx}
                        value={edu.institution}
                        onSave={(val) => dispatch(updateEducation({ index: idx, data: { institution: val } }))}
                        placeholder="Institution"
                        className="inline"
                      />
                      {edu.grade && (
                        <span className="text-slate-500 italic">
                          {' — GPA: '}
                          <EditableElement
                            section="education"
                            field="grade"
                            index={idx}
                            value={edu.grade}
                            onSave={(val) => dispatch(updateEducation({ index: idx, data: { grade: val } }))}
                            placeholder="Grade"
                            className="inline"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {edu.endDate || edu.startDate}
                  </span>
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <CVSection key="certifications" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">06 //</span>
              <CVSectionTitle
                title="Licenses & Professional Certifications"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="cv-item-avoid-break p-2 bg-slate-50 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900 text-[11.5px]">
                    <EditableElement
                      section="certifications"
                      field="name"
                      index={idx}
                      value={cert.name}
                      onSave={(val) => dispatch(updateCertification({ index: idx, data: { name: val } }))}
                      placeholder="Certification Title"
                      className="inline"
                    />
                  </div>
                  <div className="flex justify-between text-[10.5px] text-slate-500 font-mono mt-0.5">
                    <span>{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <CVSection key="languages" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">07 //</span>
              <CVSectionTitle
                title="Languages"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map((l, idx) => (
                <span key={l.id || idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">
                  <EditableElement
                    section="languages"
                    field="name"
                    index={idx}
                    value={l.name || l.language}
                    onSave={(val) => dispatch(updateLanguage({ index: idx, data: { name: val, language: val } }))}
                    placeholder="Language"
                    className="inline font-semibold text-slate-800"
                  />
                  {l.proficiency && <span className="text-slate-500 ml-1">({l.proficiency})</span>}
                </span>
              ))}
            </div>
          </CVSection>
        );

      case 'personalDetails':
        return (
          <CVPersonalDetailsTable
            key="personalDetails"
            personalDetails={personalDetails}
            designTokens={tokens}
            sectionConfig={cvData?.sectionConfig}
            onSave={(field) => (val) => dispatch(updatePersonalDetails({ [field]: val }))}
          />
        );

      case 'references':
        if (!references || references.length === 0) return null;
        return (
          <CVSection key="references" spacing={tokens.sectionSpacing}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${tokens.primaryColor}30` }}>
              <span className="text-[10px] font-mono font-bold text-slate-400">08 //</span>
              <CVSectionTitle
                title="Professional References"
                color={tokens.primaryColor}
                fontFamily={tokens.headingFont}
                dividerThickness={0}
                variant="plain"
                className="text-xs uppercase tracking-wider font-mono font-bold"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {references.map((r, i) => (
                <div key={r.id || i} className="cv-item-avoid-break p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[10.5px]">
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
                  {r.phone && <p className="text-slate-500">Tel: {r.phone}</p>}
                  {r.email && <p className="text-slate-500">Email: {r.email}</p>}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'customSections':
        return (
          <CVCustomSections
            key="customSections"
            customSections={customSections}
            designTokens={tokens}
            onSaveTitle={(idx) => (val) => dispatch(updateCustomSection({ index: idx, data: { title: val } }))}
            onSaveContent={(idx) => (val) => dispatch(updateCustomSection({ index: idx, data: { content: val } }))}
          />
        );

      case 'declaration':
        if (!declaration?.signedBy && !declaration?.text) return null;
        return (
          <CVDeclaration
            key="declaration"
            declaration={declaration}
            fullName={personalInfo.fullName}
            designTokens={tokens}
            onSaveText={(val) => dispatch(updateDeclaration({ text: val }))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="p-6 sm:p-8 md:p-10 bg-white text-slate-800 transition-all text-xs leading-normal"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Executive High-Contrast Tech Header (No Dark Ink-Traps) */}
      <div
        className="pb-4 mb-4 border-b-2"
        style={{ borderColor: tokens.primaryColor }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Tech Status Tag */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono border"
              style={{
                backgroundColor: `${tokens.primaryColor}10`,
                borderColor: `${tokens.primaryColor}30`,
                color: tokens.primaryColor,
              }}
            >
              <Terminal className="w-3 h-3 shrink-0" />
              <span>cv://engineering/active</span>
            </div>

            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Your Full Name"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 block"
              style={{ fontFamily: tokens.headingFont }}
            />

            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Senior Software Architect / Full-Stack Lead"
              className="text-sm font-semibold block"
              style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
            />

            {/* Contact Strip with Crisp Icons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[11px] text-slate-600 font-mono">
              {personalInfo.email && (
                <span className="cv-icon-row gap-1.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="email"
                    value={personalInfo.email}
                    onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                    placeholder="email@example.com"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.phone && (
                <span className="cv-icon-row gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="phone"
                    value={personalInfo.phone}
                    onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                    placeholder="+1 555-0199"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.location && (
                <span className="cv-icon-row gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="location"
                    value={personalInfo.location}
                    onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                    placeholder="City, Country"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.github && (
                <span className="cv-icon-row gap-1.5">
                  <Github className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="github"
                    value={personalInfo.github}
                    onSave={(val) => dispatch(updatePersonalInfo({ github: val }))}
                    placeholder="github.com/username"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="cv-icon-row gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="linkedin"
                    value={personalInfo.linkedin}
                    onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                    placeholder="linkedin.com/in/username"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
              {personalInfo.website && (
                <span className="cv-icon-row gap-1.5">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="website"
                    value={personalInfo.website}
                    onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                    placeholder="portfolio.dev"
                    className="inline min-w-0 break-words"
                  />
                </span>
              )}
            </div>
          </div>

          {/* Photo using universal CVPhoto */}
          <CVPhoto
            photo={personalInfo.photo || personalInfo.photoUrl}
            fullName={personalInfo.fullName}
            showPhoto={design?.showPhoto}
            photoStyle={personalInfo.photoStyle || 'portrait'}
            photoSize={design?.photoSize}
            photoConfig={personalInfo.photoConfig}
            borderColor={tokens.primaryColor}
            onOpenPhotoModal={onOpenPhotoModal}
          />
        </div>
      </div>

      {/* 2. Dynamic Section Stream */}
      <div className="space-y-4">
        {orderedKeys.map((k) => (isVisible(k) ? renderSectionContent(k) : null))}
      </div>
    </div>
  );
};

export default LinearDark;
