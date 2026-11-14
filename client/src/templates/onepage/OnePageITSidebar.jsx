import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';
import { Mail, Phone, MapPin, Github, Linkedin, Terminal, Globe, Award, Globe2 } from 'lucide-react';

export const OnePageITSidebar = ({ cvData, onOpenPhotoModal }) => {
  const editors = useOnePageEditors();
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
    primaryColor: '#0284c7', // Sky / Tech Blue
    accentColor: '#0369a1',
    headingColor: '#0f172a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f8fafc',
    headingFont: 'JetBrains Mono',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  return (
    <div
      className="flex min-h-[1060px] bg-white leading-snug"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Light Tech Left Sidebar (30%) - High contrast, print safe, zero ink trap */}
      <aside
        className="w-[32%] shrink-0 px-4 py-5 flex flex-col gap-3.5 border-r"
        style={{
          backgroundColor: tokens.sidebarColor,
          borderColor: '#e2e8f0',
        }}
      >
        <div className="flex flex-col items-center text-center gap-2 pb-3 border-b border-slate-200">
          <OnePageAvatar
            photo={personalInfo.photo}
            fullName={personalInfo.fullName}
            showPhoto={design?.showPhoto}
            photoStyle={personalInfo.photoStyle || 'rounded'}
            photoSize={design?.photoSize}
            photoConfig={personalInfo.photoConfig}
            borderColor={tokens.primaryColor}
            darkPlaceholder={false}
            onOpenPhotoModal={onOpenPhotoModal}
          />
          <div
            className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
            style={{
              color: tokens.primaryColor,
              backgroundColor: '#ffffff',
              borderColor: `${tokens.primaryColor}30`,
            }}
          >
            <Terminal className="w-2.5 h-2.5" />
            <span>Systems & Architecture</span>
          </div>
        </div>

        {/* Contact Block */}
        <section className="space-y-1.5">
          <h3
            className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b font-mono"
            style={{ color: tokens.primaryColor, borderColor: '#cbd5e1' }}
          >
            // Contact Endpoints
          </h3>
          <div className="space-y-1.5 text-[9.5px] font-mono text-slate-700 break-words">
            {personalInfo.email && (
              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-1.5">
                <Phone className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-1.5">
                <Globe className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span className="break-all">{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-start gap-1.5">
                <Github className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span className="break-all">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-1.5">
                <Linkedin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: tokens.primaryColor }} />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </section>

        {/* Tech Stack Skills */}
        {isVisible('skills') && skills.length > 0 && (
          <section className="space-y-1.5">
            <h3
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b font-mono"
              style={{ color: tokens.primaryColor, borderColor: '#cbd5e1' }}
            >
              // Tech Stack & Tooling
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-mono text-slate-800 shadow-2xs"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {isVisible('certifications') && certifications.length > 0 && (
          <section className="space-y-1">
            <h3
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b font-mono"
              style={{ color: tokens.primaryColor, borderColor: '#cbd5e1' }}
            >
              // Verified Certs
            </h3>
            <div className="space-y-1.5 text-[9.5px]">
              {certifications.slice(0, 4).map((cert, idx) => (
                <div key={cert.id || idx} className="bg-white p-1.5 rounded border border-slate-200">
                  <p className="font-semibold text-slate-900 leading-tight">{cert.name}</p>
                  <p className="text-[8.5px] font-mono text-slate-500 mt-0.5">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {isVisible('languages') && languages.length > 0 && (
          <section className="space-y-1">
            <h3
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b font-mono"
              style={{ color: tokens.primaryColor, borderColor: '#cbd5e1' }}
            >
              // Spoken Languages
            </h3>
            <div className="space-y-1 text-[9.5px] text-slate-700">
              {languages.map((l, idx) => (
                <div key={l.id || idx} className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">{l.name}</span>
                  <span className="text-[8.5px] font-mono text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Personal Details Table if enabled */}
        {isVisible('personalDetails') && (
          <div className="text-[9px] pt-1">
            <CVPersonalDetailsTable personalDetails={personalDetails} compact={true} />
          </div>
        )}
      </aside>

      {/* Main Technical Workspace (68%) */}
      <main className="flex-1 px-5 py-5 space-y-3 min-w-0">
        <div className="pb-2.5 border-b-2" style={{ borderColor: tokens.primaryColor }}>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Full Name"
            className="text-[22px] font-extrabold tracking-tight text-slate-900 block leading-tight"
            style={{ fontFamily: `${tokens.headingFont}, monospace` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Systems / IT / Cloud Engineer"
            className="text-[12px] font-mono font-semibold mt-0.5 block"
            style={{ color: tokens.primaryColor }}
          />
        </div>

        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Technical Summary" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              className="text-[10.5px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Engineering & Work Experience" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Infrastructure & Software Deployments" color={tokens.primaryColor} />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={tokens.primaryColor}
              twoColumns={false}
            />
          </section>
        )}

        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education & Credentials" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* Custom Sections */}
        {isVisible('customSections') && customSections.length > 0 && (
          <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
        )}

        {/* Declaration if configured */}
        {isVisible('declaration') && declaration?.text && (
          <div className="pt-2 text-[9px] border-t border-slate-200">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </main>
    </div>
  );
};

export default OnePageITSidebar;


