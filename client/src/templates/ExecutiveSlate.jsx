import React from 'react';
import './shared/cvElements.css';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateCertification,
  updateLanguage,
  updateReference,
  updateDeclaration,
  updatePersonalDetails,
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
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase } from 'lucide-react';

export const ExecutiveSlate = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#0f172a', // Executive Slate
    accentColor: '#475569',
    headingColor: '#0f172a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f8fafc',
    headingFont: 'Merriweather',
    bodyFont: 'Plus Jakarta Sans',
    sectionSpacing: 18,
    itemSpacing: 10,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
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
            <CVSectionTitle
              title="Executive Profile & Core Competencies"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Executive leadership overview..."
              className="text-slate-700 leading-relaxed text-xs block text-justify"
              style={{ fontFamily: tokens.bodyFont }}
            />
          </CVSection>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <CVSection key="experience" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Career History & Quantified Achievements"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="cv-item-avoid-break space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="experience"
                        field="jobTitle"
                        index={index}
                        value={exp.jobTitle}
                        onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                        placeholder="Job Title"
                        className="inline font-bold"
                        style={{ fontFamily: tokens.headingFont }}
                      />
                      {' — '}
                      <span style={{ color: tokens.primaryColor }}>
                        <EditableElement
                          section="experience"
                          field="company"
                          index={index}
                          value={exp.company}
                          onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                          placeholder="Organization"
                          className="inline font-semibold"
                        />
                      </span>
                    </span>
                    <span className="text-[11px] font-sans text-slate-500 shrink-0">
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
                  {exp.location && (
                    <div className="text-[11px] text-slate-500 italic">
                      <EditableElement
                        section="experience"
                        field="location"
                        index={index}
                        value={exp.location}
                        onSave={(val) => dispatch(updateExperience({ index, data: { location: val } }))}
                        placeholder="Location"
                        className="inline"
                      />
                    </div>
                  )}
                  {exp.description && (
                    <EditableElement
                      section="experience"
                      field="description"
                      index={index}
                      value={exp.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                      placeholder="Executive scope and P&L responsibility..."
                      className="text-slate-700 text-xs leading-relaxed block"
                      style={{ fontFamily: tokens.bodyFont }}
                    />
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-xs mt-1">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
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
            <CVSectionTitle
              title="Education & Executive Credentials"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
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
                      placeholder="Degree"
                      className="font-bold text-slate-900 text-xs inline"
                      style={{ fontFamily: tokens.headingFont }}
                    />
                    <div className="text-[11.5px] text-slate-600">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={idx}
                        value={edu.institution}
                        onSave={(val) => dispatch(updateEducation({ index: idx, data: { institution: val } }))}
                        placeholder="Institution"
                        className="inline"
                      />
                      {edu.grade && <span className="text-slate-500 italic"> — {edu.grade}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium font-sans">
                    {edu.endDate || edu.startDate}
                  </span>
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <CVSection key="skills" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Leadership Competencies & Strategic Skills"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skills.map((s, index) => (
                <span
                  key={s.id || index}
                  className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-medium"
                >
                  <EditableElement
                    section="skills"
                    field="name"
                    index={index}
                    value={s.name}
                    onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                    placeholder="Competency"
                    className="inline"
                  />
                </span>
              ))}
            </div>
          </CVSection>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <CVSection key="projects" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Key Initiatives & Advisory Engagements"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-2.5">
              {projects.map((proj, index) => (
                <div key={proj.id || index} className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="projects"
                        field="title"
                        index={index}
                        value={proj.title || proj.name}
                        onSave={(val) => dispatch(updateProject({ index, data: { title: val, name: val } }))}
                        placeholder="Initiative"
                        className="inline font-bold"
                        style={{ fontFamily: tokens.headingFont }}
                      />
                    </span>
                    {proj.url && <span className="text-[10px] text-slate-500 font-mono">{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <EditableElement
                      section="projects"
                      field="description"
                      index={index}
                      value={proj.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateProject({ index, data: { description: val } }))}
                      placeholder="Impact..."
                      className="text-slate-700 text-xs leading-relaxed block"
                    />
                  )}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <CVSection key="certifications" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Board Memberships & Certifications"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-1.5 text-xs text-slate-800">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="cv-item-avoid-break flex justify-between">
                  <span>
                    <strong>
                      <EditableElement
                        section="certifications"
                        field="name"
                        index={idx}
                        value={cert.name}
                        onSave={(val) => dispatch(updateCertification({ index: idx, data: { name: val } }))}
                        placeholder="Certification"
                        className="inline"
                      />
                    </strong>
                    {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                  </span>
                  {cert.date && <span className="text-slate-500 text-[11px] font-sans">{cert.date}</span>}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <CVSection key="languages" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Languages"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map((l, idx) => (
                <span key={l.id || idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-sans">
                  <EditableElement
                    section="languages"
                    field="name"
                    index={idx}
                    value={l.name || l.language}
                    onSave={(val) => dispatch(updateLanguage({ index: idx, data: { name: val, language: val } }))}
                    placeholder="Language"
                    className="inline font-semibold"
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
            <CVSectionTitle
              title="Executive References"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {references.map((r, i) => (
                <div key={r.id || i} className="cv-item-avoid-break p-3 bg-slate-50 border border-slate-200 rounded space-y-0.5">
                  <EditableElement
                    section="references"
                    field="name"
                    index={i}
                    value={r.name}
                    onSave={(val) => dispatch(updateReference({ index: i, data: { name: val } }))}
                    placeholder="Referee Name"
                    className="font-bold text-slate-900 block"
                  />
                  <p className="text-slate-700">{r.designation}, {r.company}</p>
                  {r.phone && <p className="text-slate-600 text-[11px] font-sans">Phone: {r.phone}</p>}
                  {r.email && <p className="text-slate-600 text-[11px] font-sans">Email: {r.email}</p>}
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
      className="p-8 sm:p-12 bg-white text-slate-800 transition-all text-xs leading-normal"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Executive Slate Clean Header (No Dark Ink-Traps) */}
      <div className="flex justify-between items-start pb-5 mb-5 border-b-2" style={{ borderColor: tokens.primaryColor }}>
        <div className="space-y-1.5 flex-1 pr-6 min-w-0">
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 font-sans">
            Executive Curriculum Vitae
          </div>

          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName}
            onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
            placeholder="Your Full Name"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 block"
            style={{ fontFamily: tokens.headingFont }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle}
            onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
            placeholder="Chief Executive Officer / Vice President"
            className="text-sm font-semibold tracking-wide text-slate-700 block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] font-sans text-slate-600">
            {personalInfo.email && (
              <span className="cv-icon-row gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" />
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
                <Phone className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <EditableElement
                  section="personalInfo"
                  field="phone"
                  value={personalInfo.phone}
                  onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                  placeholder="+1 555-0100"
                  className="inline min-w-0 break-words"
                />
              </span>
            )}
            {personalInfo.location && (
              <span className="cv-icon-row gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
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
            {personalInfo.linkedin && (
              <span className="cv-icon-row gap-1.5">
                <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
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
                <Globe className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <EditableElement
                  section="personalInfo"
                  field="website"
                  value={personalInfo.website}
                  onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                  placeholder="executive.com"
                  className="inline min-w-0 break-words"
                />
              </span>
            )}
          </div>
        </div>

        {/* Executive Portrait Photo */}
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

      {/* 2. Dynamic Section Stream */}
      <div className="space-y-4">
        {orderedKeys.map((k) => (isVisible(k) ? renderSectionContent(k) : null))}
      </div>
    </div>
  );
};

export default ExecutiveSlate;
