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
import { Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export const CreativeCoral = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#f43f5e', // Coral Rose
    accentColor: '#fb7185',
    headingColor: '#881337',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#fff1f2',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    sectionSpacing: 16,
    itemSpacing: 8,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const defaultOrder = [
    'summary',
    'experience',
    'projects',
    'skills',
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
            <CVSectionTitle
              title="Creative Profile & Vision"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
              placeholder="Creative philosophy, artistic direction, and key achievements..."
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
              title="Experience & Creative Roles"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="cv-item-avoid-break space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="experience"
                        field="jobTitle"
                        index={index}
                        value={exp.jobTitle}
                        onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                        placeholder="Role / Title"
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
                          placeholder="Studio / Agency"
                          className="inline font-semibold"
                        />
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <EditableElement
                      section="experience"
                      field="description"
                      index={index}
                      value={exp.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                      placeholder="Role highlights and deliverables..."
                      className="text-slate-700 text-xs leading-relaxed block"
                    />
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-xs">
                      {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CVSection>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <CVSection key="projects" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Featured Campaigns & Creative Works"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="cv-item-avoid-break p-3 rounded-lg border border-rose-100 bg-rose-50/30 space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="projects"
                        field="title"
                        index={idx}
                        value={proj.title || proj.name}
                        onSave={(val) => dispatch(updateProject({ index: idx, data: { title: val, name: val } }))}
                        placeholder="Project Title"
                        className="inline font-bold"
                        style={{ fontFamily: tokens.headingFont }}
                      />
                    </span>
                    {proj.url && <span className="text-[10px] text-rose-600 truncate max-w-[120px]">{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <EditableElement
                      section="projects"
                      field="description"
                      index={idx}
                      value={proj.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateProject({ index: idx, data: { description: val } }))}
                      placeholder="Campaign details..."
                      className="text-slate-600 text-[11px] leading-relaxed block"
                    />
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
            <CVSectionTitle
              title="Creative Disciplines & Tools"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skills.map((s, index) => (
                <span
                  key={s.id || index}
                  className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 text-[11px] font-medium"
                >
                  <EditableElement
                    section="skills"
                    field="name"
                    index={index}
                    value={s.name}
                    onSave={(val) => dispatch(updateSkill({ index, data: { name: val } }))}
                    placeholder="Skill"
                    className="inline"
                  />
                </span>
              ))}
            </div>
          </CVSection>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <CVSection key="education" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Education & Creative Training"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="cv-item-avoid-break flex justify-between items-start gap-4">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="education"
                        field="degree"
                        index={idx}
                        value={edu.degree}
                        onSave={(val) => dispatch(updateEducation({ index: idx, data: { degree: val } }))}
                        placeholder="Degree"
                        className="inline"
                        style={{ fontFamily: tokens.headingFont }}
                      />
                    </span>
                    <div className="text-[11.5px] text-slate-600">{edu.institution}</div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium">
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
            <CVSectionTitle
              title="Awards & Honors"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
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
                        placeholder="Award / Certification"
                        className="inline font-bold"
                      />
                    </strong>
                    {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                  </span>
                  {cert.date && <span className="text-slate-500 text-[11px] font-medium">{cert.date}</span>}
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
              variant="pill"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map((l, idx) => (
                <span key={l.id || idx} className="px-2.5 py-1 bg-rose-50/50 border border-rose-200 rounded text-xs">
                  <strong>{l.name || l.language}</strong>
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
              title="Creative References"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="pill"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {references.map((r, i) => (
                <div key={r.id || i} className="cv-item-avoid-break p-3 bg-rose-50/30 border border-rose-100 rounded space-y-0.5">
                  <div className="font-bold text-slate-900">{r.name}</div>
                  <p className="text-slate-600">{r.designation}, {r.company}</p>
                  {r.phone && <p className="text-slate-500 text-[11px]">Tel: {r.phone}</p>}
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
      className="p-8 sm:p-10 bg-white text-slate-800 text-xs min-h-full leading-normal"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Creative Coral Header (Clean, Zero Ink-Trap) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 mb-6 border-b-2" style={{ borderColor: tokens.primaryColor }}>
        <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>Creative Portfolio &amp; Resume</span>
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
            placeholder="Creative Director / Lead Designer"
            className="text-sm font-semibold tracking-wide block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-600">
            {personalInfo.email && (
              <span className="cv-icon-row gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="cv-icon-row gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="cv-icon-row gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="cv-icon-row gap-1.5">
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>

        {/* Photo */}
        <CVPhoto
          photo={personalInfo.photo || personalInfo.photoUrl}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'rounded'}
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

export default CreativeCoral;
