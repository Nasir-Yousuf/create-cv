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
import { Github, Globe, Linkedin, Mail, Phone, Terminal } from 'lucide-react';

export const OnePageTechGrid = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#4f46e5', // Tech Indigo
    accentColor: '#6366f1',
    headingColor: '#1e1b4b',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f5f3ff',
    headingFont: 'JetBrains Mono',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 2,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  // Group skills by category dynamically for clean Tech Stack matrix
  const groupedSkills = skills.reduce((acc, s) => {
    const key = s.category || 'Core Stack';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s.name);
    return acc;
  }, {});

  return (
    <div
      className="bg-white leading-snug min-h-[1060px]"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Sleek High-Contrast Engineering Header - Print Safe, Zero Ink-Trap */}
      <div
        className="px-7 py-4.5 flex items-center justify-between gap-4 border-b-2 bg-slate-50/80"
        style={{ borderColor: tokens.primaryColor }}
      >
        <div className="min-w-0 flex-1">
          <div
            className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-semibold uppercase tracking-wider mb-0.5"
            style={{ color: tokens.primaryColor }}
          >
            <Terminal className="w-3 h-3" />
            <span>Software & Systems Architecture</span>
          </div>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Engineer Name"
            className="text-[22px] font-extrabold tracking-tight block leading-tight text-slate-900"
            style={{ fontFamily: `${tokens.headingFont}, monospace` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Software Engineer"
            className="text-[12px] font-mono font-bold block"
            style={{ color: tokens.primaryColor }}
          />

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-2 text-[10px] font-mono text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="inline-flex items-center gap-1">
                <Github className="w-3 h-3" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'circle'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          darkPlaceholder={false}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </div>

      {/* Main Compact Body */}
      <div className="px-7 py-4 space-y-3">
        {isVisible('summary') && personalInfo.summary && (
          <EditableElement
            section="personalInfo"
            field="summary"
            value={personalInfo.summary}
            multiline={true}
            onSave={editors.savePersonal('summary')}
            className="text-[11px] text-slate-700 leading-relaxed block"
          />
        )}

        {/* Categorized Tech Stack Matrix */}
        {isVisible('skills') && skills.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
            <h2
              className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5 font-mono"
              style={{ color: tokens.primaryColor }}
            >
              // Technical Stack Matrix
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10.5px]">
              {Object.entries(groupedSkills).map(([cat, names]) => (
                <div key={cat} className="truncate">
                  <span className="font-bold text-slate-900">{cat}: </span>
                  <span className="text-slate-700 font-mono text-[10px]">{names.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Engineering Experience" color={tokens.primaryColor} />
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
            <CompactSectionTitle title="Shipped Systems & Deployments" color={tokens.primaryColor} />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={tokens.primaryColor}
              twoColumns={true}
            />
          </section>
        )}

        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('education') && education.length > 0 && (
            <section className={certifications.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Education" color={tokens.primaryColor} />
              <OnePageEducationList
                education={education}
                editors={editors}
                accentColor={tokens.primaryColor}
              />
            </section>
          )}
          {((isVisible('certifications') && certifications.length > 0) || (isVisible('languages') && languages.length > 0)) && (
            <section className={education.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Honors & Credentials" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px]">
                {isVisible('certifications') && certifications.slice(0, 3).map((c, idx) => (
                  <div key={c.id || idx}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-[9.5px] text-slate-500 font-mono">
                      {c.issuer}
                      {c.date ? ` • ${c.date}` : ''}
                    </p>
                  </div>
                ))}
                {isVisible('languages') && languages.length > 0 && (
                  <p className="text-[10px] text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800">Languages: </span>
                    {languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {isVisible('personalDetails') && (
          <CVPersonalDetailsTable personalDetails={personalDetails} compact={true} />
        )}

        {isVisible('customSections') && customSections.length > 0 && (
          <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
        )}

        {isVisible('declaration') && declaration?.text && (
          <div className="pt-2 text-[9px] border-t border-slate-200">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageTechGrid;

