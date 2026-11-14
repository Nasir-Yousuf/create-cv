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
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export const BangladeshStandard = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#059669', // Bangladesh Emerald
    accentColor: '#10b981',
    headingColor: '#064e3b',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 16,
    itemSpacing: 8,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const defaultOrder = [
    'summary',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
    'personalDetails',
    'languages',
    'references',
    'customSections',
    'declaration',
  ];

  const orderedKeys = getOrderedSectionKeys(cvData, defaultOrder);

  const renderSectionContent = (key) => {
    switch (key) {
      case 'summary':
        if (!personalInfo.summary && !personalInfo.careerObjective) return null;
        return (
          <CVSection key="summary" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Career Objective & Summary"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary || personalInfo.careerObjective}
              multiline={true}
              onSave={(val) => dispatch(updatePersonalInfo({ summary: val, careerObjective: val }))}
              placeholder="Career objective tailored for Bangladeshi corporate, banking, or government sector..."
              className="text-slate-800 text-xs leading-relaxed block text-justify"
              style={{ fontFamily: tokens.bodyFont }}
            />
          </CVSection>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <CVSection key="education" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Academic Qualifications"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            {/* Bangladesh Standard Academic Table Format */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 rounded-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                    <th className="p-2 border-r border-slate-300">Degree / Exam</th>
                    <th className="p-2 border-r border-slate-300">Institute / Board / University</th>
                    <th className="p-2 border-r border-slate-300">Major / Group</th>
                    <th className="p-2 border-r border-slate-300 text-center">Passing Year</th>
                    <th className="p-2 text-center">CGPA / Division</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu, idx) => (
                    <tr key={edu.id || idx} className="border-b border-slate-200 hover:bg-slate-50/50">
                      <td className="p-2 font-semibold border-r border-slate-200">
                        <EditableElement
                          section="education"
                          field="degree"
                          index={idx}
                          value={edu.degree}
                          onSave={(val) => dispatch(updateEducation({ index: idx, data: { degree: val } }))}
                          placeholder="Degree"
                          className="inline"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <EditableElement
                          section="education"
                          field="institution"
                          index={idx}
                          value={edu.institution}
                          onSave={(val) => dispatch(updateEducation({ index: idx, data: { institution: val } }))}
                          placeholder="Institution"
                          className="inline"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <EditableElement
                          section="education"
                          field="fieldOfStudy"
                          index={idx}
                          value={edu.fieldOfStudy || 'Science / Business'}
                          onSave={(val) => dispatch(updateEducation({ index: idx, data: { fieldOfStudy: val } }))}
                          placeholder="Major"
                          className="inline"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        <EditableElement
                          section="education"
                          field="endDate"
                          index={idx}
                          value={edu.endDate || edu.startDate}
                          onSave={(val) => dispatch(updateEducation({ index: idx, data: { endDate: val } }))}
                          placeholder="Year"
                          className="inline text-center"
                        />
                      </td>
                      <td className="p-2 text-center font-semibold" style={{ color: tokens.primaryColor }}>
                        <EditableElement
                          section="education"
                          field="grade"
                          index={idx}
                          value={edu.grade}
                          onSave={(val) => dispatch(updateEducation({ index: idx, data: { grade: val } }))}
                          placeholder="3.80 / 4.00"
                          className="inline text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CVSection>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <CVSection key="experience" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Employment History & Work Experience"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-3.5">
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
                        placeholder="Job Title"
                        className="inline"
                      />
                      {' — '}
                      <span style={{ color: tokens.primaryColor }}>
                        <EditableElement
                          section="experience"
                          field="company"
                          index={index}
                          value={exp.company}
                          onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                          placeholder="Company / Organization"
                          className="inline font-semibold"
                        />
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                      <EditableElement
                        section="experience"
                        field="startDate"
                        index={index}
                        value={exp.startDate}
                        onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                        placeholder="Start"
                        className="inline"
                      />
                      {' to '}
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
                      placeholder="Key job responsibilities..."
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

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <CVSection key="skills" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Skills & Core Competencies"
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
                    placeholder="Skill"
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
              title="Projects & Major Initiatives"
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
                        placeholder="Project Title"
                        className="inline"
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
                      placeholder="Project details..."
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
              title="Professional Certifications & Training"
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

      case 'personalDetails':
        return (
          <CVPersonalDetailsTable
            key="personalDetails"
            cvData={cvData}
            personalDetails={personalDetails}
            designTokens={tokens}
            sectionConfig={cvData?.sectionConfig}
            onSave={(field) => (val) => dispatch(updatePersonalDetails({ [field]: val }))}
          />
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <CVSection key="languages" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Language Proficiency"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map((l, idx) => (
                <span key={l.id || idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded">
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

      case 'references':
        if (!references || references.length === 0) return null;
        return (
          <CVSection key="references" spacing={tokens.sectionSpacing}>
            <CVSectionTitle
              title="Professional References"
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
                  <p className="text-slate-700">{r.designation}</p>
                  <p className="text-slate-600 font-medium">{r.company}</p>
                  {r.phone && <p className="text-slate-600 text-[11px]">Cell: {r.phone}</p>}
                  {r.email && <p className="text-slate-600 text-[11px]">Email: {r.email}</p>}
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
      className="p-8 sm:p-12 bg-white text-slate-800 transition-all leading-normal text-xs"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Header with Name, Contact and Portrait Passport Photo on Right */}
      <div className="flex justify-between items-start pb-4 mb-4 border-b-2" style={{ borderColor: tokens.primaryColor }}>
        <div className="space-y-1.5 flex-1 pr-4 min-w-0">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName}
            onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
            placeholder="YOUR FULL NAME"
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle}
            onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
            placeholder="Target Designation / Profession"
            className="text-sm font-bold text-slate-700 block"
            style={{ fontFamily: tokens.headingFont }}
          />

          {/* Contact Details */}
          <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
            {personalInfo.location && (
              <div className="cv-icon-row gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <EditableElement
                  section="personalInfo"
                  field="location"
                  tag="span"
                  value={personalInfo.location}
                  onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                  placeholder="Present Address"
                  className="inline"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {personalInfo.phone && (
                <div className="cv-icon-row gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="phone"
                    tag="span"
                    value={personalInfo.phone}
                    onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                    placeholder="+880 1711-000000"
                    className="inline"
                  />
                </div>
              )}
              {personalInfo.email && (
                <div className="cv-icon-row gap-1.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="email"
                    tag="span"
                    value={personalInfo.email}
                    onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                    placeholder="email@example.com"
                    className="inline"
                  />
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="cv-icon-row gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="linkedin"
                    tag="span"
                    value={personalInfo.linkedin}
                    onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                    placeholder="linkedin.com/in/username"
                    className="inline"
                  />
                </div>
              )}
              {personalInfo.website && (
                <div className="cv-icon-row gap-1.5">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                  <EditableElement
                    section="personalInfo"
                    field="website"
                    tag="span"
                    value={personalInfo.website}
                    onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                    placeholder="portfolio.com"
                    className="inline"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Passport Photo */}
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

export default BangladeshStandard;
