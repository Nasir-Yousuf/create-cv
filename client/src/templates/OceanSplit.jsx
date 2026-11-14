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
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const OceanSplit = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#0284c7', // Sky / Ocean Blue
    accentColor: '#38bdf8',
    headingColor: '#0f172a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f0f9ff',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 16,
    itemSpacing: 8,
    dividerThickness: 1,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  return (
    <div
      className="flex flex-col sm:flex-row min-h-full bg-white text-slate-800 text-xs leading-normal"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Left Sidebar (35%) */}
      <div
        className="w-full sm:w-[36%] p-6 sm:p-7 border-b sm:border-b-0 sm:border-r border-sky-100 space-y-5"
        style={{ backgroundColor: tokens.sidebarColor }}
      >
        {/* Photo */}
        <div className="flex justify-center pb-2">
          <CVPhoto
            photo={personalInfo.photo || personalInfo.photoUrl}
            fullName={personalInfo.fullName}
            showPhoto={design?.showPhoto}
            photoStyle={personalInfo.photoStyle || 'circle'}
            photoSize={design?.photoSize}
            photoConfig={personalInfo.photoConfig}
            borderColor={tokens.primaryColor}
            onOpenPhotoModal={onOpenPhotoModal}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-[11px] text-slate-700">
          <div className="font-bold text-xs uppercase tracking-wider pb-1 border-b" style={{ color: tokens.primaryColor, borderColor: `${tokens.primaryColor}30` }}>
            Contact
          </div>
          {personalInfo.email && (
            <div className="cv-icon-row gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="email"
                value={personalInfo.email}
                onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                placeholder="email@example.com"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
          {personalInfo.phone && (
            <div className="cv-icon-row gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="phone"
                value={personalInfo.phone}
                onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                placeholder="+1 555-0199"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
          {personalInfo.location && (
            <div className="cv-icon-row gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="location"
                value={personalInfo.location}
                onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                placeholder="City, Country"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="cv-icon-row gap-2">
              <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="linkedin"
                value={personalInfo.linkedin}
                onSave={(val) => dispatch(updatePersonalInfo({ linkedin: val }))}
                placeholder="linkedin.com/in/username"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
          {personalInfo.github && (
            <div className="cv-icon-row gap-2">
              <Github className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="github"
                value={personalInfo.github}
                onSave={(val) => dispatch(updatePersonalInfo({ github: val }))}
                placeholder="github.com/username"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
          {personalInfo.website && (
            <div className="cv-icon-row gap-2">
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
              <EditableElement
                section="personalInfo"
                field="website"
                value={personalInfo.website}
                onSave={(val) => dispatch(updatePersonalInfo({ website: val }))}
                placeholder="portfolio.com"
                className="inline min-w-0 break-words"
              />
            </div>
          )}
        </div>

        {/* Skills in Sidebar */}
        {isVisible('skills') && skills && skills.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider pb-1 border-b" style={{ color: tokens.primaryColor, borderColor: `${tokens.primaryColor}30` }}>
              Core Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="px-2 py-0.5 rounded bg-white text-slate-800 text-[10.5px] border border-sky-200 font-medium"
                >
                  <EditableElement
                    section="skills"
                    field="name"
                    index={idx}
                    value={s.name}
                    onSave={(val) => dispatch(updateSkill({ index: idx, data: { name: val } }))}
                    placeholder="Skill"
                    className="inline"
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {isVisible('certifications') && certifications && certifications.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider pb-1 border-b" style={{ color: tokens.primaryColor, borderColor: `${tokens.primaryColor}30` }}>
              Certifications
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              {certifications.map((c, idx) => (
                <div key={c.id || idx} className="cv-item-avoid-break">
                  <div className="font-semibold text-slate-900 leading-snug">
                    <EditableElement
                      section="certifications"
                      field="name"
                      index={idx}
                      value={c.name}
                      onSave={(val) => dispatch(updateCertification({ index: idx, data: { name: val } }))}
                      placeholder="Certification"
                      className="inline"
                    />
                  </div>
                  {c.issuer && <div className="text-[10px] text-slate-500">{c.issuer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Sidebar */}
        {isVisible('languages') && languages && languages.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider pb-1 border-b" style={{ color: tokens.primaryColor, borderColor: `${tokens.primaryColor}30` }}>
              Languages
            </div>
            <div className="space-y-1 text-[11px]">
              {languages.map((l, idx) => (
                <div key={l.id || idx} className="flex justify-between">
                  <span className="font-medium text-slate-800">
                    <EditableElement
                      section="languages"
                      field="name"
                      index={idx}
                      value={l.name || l.language}
                      onSave={(val) => dispatch(updateLanguage({ index: idx, data: { name: val, language: val } }))}
                      placeholder="Language"
                      className="inline font-medium"
                    />
                  </span>
                  {l.proficiency && <span className="text-slate-500 text-[10px]">{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Details Table in Sidebar */}
        {isVisible('personalDetails') && personalDetails?.fatherName && (
          <div className="space-y-2 pt-2 border-t border-sky-200">
            <div className="font-bold text-[11px] uppercase tracking-wider" style={{ color: tokens.primaryColor }}>
              Personal Info
            </div>
            <div className="space-y-1 text-[10.5px] text-slate-600">
              <p><strong className="text-slate-800">Father:</strong> {personalDetails.fatherName}</p>
              <p><strong className="text-slate-800">Mother:</strong> {personalDetails.motherName}</p>
              <p><strong className="text-slate-800">DOB:</strong> {personalDetails.dob}</p>
              <p><strong className="text-slate-800">Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
              {personalDetails.nid && <p><strong className="text-slate-800">NID:</strong> {personalDetails.nid}</p>}
            </div>
          </div>
        )}
      </div>

      {/* 2. Right Main Column (64%) */}
      <div className="w-full sm:w-[64%] p-6 sm:p-8 space-y-5">
        {/* Header Block */}
        <div className="pb-3 border-b-2" style={{ borderColor: tokens.primaryColor }}>
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
            placeholder="Target Professional Designation"
            className="text-sm font-semibold tracking-wide block mt-0.5"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />
        </div>

        {/* Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <div className="space-y-1.5">
            <CVSectionTitle
              title="Profile Summary"
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
              placeholder="Write your professional summary..."
              className="text-slate-700 leading-relaxed text-xs block text-justify"
              style={{ fontFamily: tokens.bodyFont }}
            />
          </div>
        )}

        {/* Experience */}
        {isVisible('experience') && experience && experience.length > 0 && (
          <div className="space-y-2">
            <CVSectionTitle
              title="Work Experience"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-3.5">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="experience"
                        field="jobTitle"
                        index={idx}
                        value={exp.jobTitle}
                        onSave={(val) => dispatch(updateExperience({ index: idx, data: { jobTitle: val } }))}
                        placeholder="Job Title"
                        className="inline"
                        style={{ fontFamily: tokens.headingFont }}
                      />
                      {' — '}
                      <span style={{ color: tokens.primaryColor }}>
                        <EditableElement
                          section="experience"
                          field="company"
                          index={idx}
                          value={exp.company}
                          onSave={(val) => dispatch(updateExperience({ index: idx, data: { company: val } }))}
                          placeholder="Company"
                          className="inline font-semibold"
                        />
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      <EditableElement
                        section="experience"
                        field="startDate"
                        index={idx}
                        value={exp.startDate}
                        onSave={(val) => dispatch(updateExperience({ index: idx, data: { startDate: val } }))}
                        placeholder="Start"
                        className="inline"
                      />
                      {' – '}
                      {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <EditableElement
                      section="experience"
                      field="description"
                      index={idx}
                      value={exp.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateExperience({ index: idx, data: { description: val } }))}
                      placeholder="Responsibilities..."
                      className="text-slate-700 text-xs leading-relaxed block"
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
          </div>
        )}

        {/* Education */}
        {isVisible('education') && education && education.length > 0 && (
          <div className="space-y-2">
            <CVSectionTitle
              title="Education"
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
                      {edu.grade && <span className="text-slate-500 italic"> — {edu.grade}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                    {edu.endDate || edu.startDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {isVisible('projects') && projects && projects.length > 0 && (
          <div className="space-y-2">
            <CVSectionTitle
              title="Key Projects"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="cv-item-avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      <EditableElement
                        section="projects"
                        field="title"
                        index={idx}
                        value={proj.title || proj.name}
                        onSave={(val) => dispatch(updateProject({ index: idx, data: { title: val, name: val } }))}
                        placeholder="Project Title"
                        className="inline font-bold"
                      />
                    </span>
                    {proj.url && <span className="text-[10px] text-slate-500 font-mono">{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <EditableElement
                      section="projects"
                      field="description"
                      index={idx}
                      value={proj.description}
                      multiline={true}
                      onSave={(val) => dispatch(updateProject({ index: idx, data: { description: val } }))}
                      placeholder="Details..."
                      className="text-slate-700 text-xs leading-relaxed block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {isVisible('customSections') && (
          <CVCustomSections
            customSections={customSections}
            designTokens={tokens}
            onSaveTitle={(idx) => (val) => dispatch(updateCustomSection({ index: idx, data: { title: val } }))}
            onSaveContent={(idx) => (val) => dispatch(updateCustomSection({ index: idx, data: { content: val } }))}
          />
        )}

        {/* References */}
        {isVisible('references') && references && references.length > 0 && (
          <div className="space-y-2">
            <CVSectionTitle
              title="References"
              color={tokens.primaryColor}
              fontFamily={tokens.headingFont}
              dividerThickness={tokens.dividerThickness}
              variant="underline"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {references.map((r, i) => (
                <div key={r.id || i} className="cv-item-avoid-break p-2.5 bg-sky-50/50 border border-sky-100 rounded space-y-0.5">
                  <div className="font-bold text-slate-900">{r.name}</div>
                  <p className="text-slate-700">{r.designation}, {r.company}</p>
                  {r.phone && <p className="text-slate-600 text-[11px]">Tel: {r.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Declaration */}
        {isVisible('declaration') && (declaration?.signedBy || declaration?.text) && (
          <CVDeclaration
            declaration={declaration}
            fullName={personalInfo.fullName}
            designTokens={tokens}
            onSaveText={(val) => dispatch(updateDeclaration({ text: val }))}
          />
        )}
      </div>
    </div>
  );
};

export default OceanSplit;
