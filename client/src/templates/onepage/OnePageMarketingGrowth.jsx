import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
} from './onePageShared';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

export const OnePageMarketingGrowth = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#ea580c', // Growth Sunset Coral
    accentColor: '#f97316',
    headingColor: '#7c2d12',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#fff7ed',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  return (
    <div
      className="px-7 py-6 bg-white text-slate-800 leading-snug"
      style={{
        fontFamily: tokens.bodyFont,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* 1. Header Block */}
      <div
        className="flex items-center gap-4 pb-3.5 mb-3 border-b-2"
        style={{ borderColor: tokens.primaryColor }}
      >
        <OnePageAvatar
          photo={personalInfo.photo || personalInfo.photoUrl}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'rounded'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          onOpenPhotoModal={onOpenPhotoModal}
        />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-orange-50 border border-orange-200 text-orange-700">
            <Flame className="w-3 h-3 text-orange-600" />
            <span>Growth Marketing &amp; Sales Strategy Profile</span>
          </div>

          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Your Full Name"
            className="text-[22px] font-extrabold tracking-tight text-slate-900 block leading-tight"
            style={{ fontFamily: tokens.headingFont }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Head of Growth / Senior Performance Marketer / SaaS Account Executive"
            className="text-[12.5px] font-semibold block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[10.5px] text-slate-600 pt-0.5">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quantified Growth Metrics Ribbon */}
      <div
        className="p-2.5 rounded-lg mb-3 border grid grid-cols-2 sm:grid-cols-4 gap-2 text-center"
        style={{
          backgroundColor: `${tokens.primaryColor}08`,
          borderColor: `${tokens.primaryColor}25`,
        }}
      >
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Acquisition</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">+145% Organic Traffic</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Revenue Impact</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">$2.8M Pipeline Closed</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Paid Efficiency</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">4.6x Blended ROAS</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">CAC / LTV</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">-38% CAC Reduction</span>
        </div>
      </div>

      {/* 3. Main Stream */}
      <div className="space-y-3">
        {/* Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Growth Strategy & Market Position" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Proven track record scaling B2B/B2C acquisition funnels, demand generation, and revenue operations..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Experience */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Growth & Commercial Leadership Experience" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Campaign Showcases / Growth Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="High-Impact Campaigns & Growth Experiments" color={tokens.primaryColor} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-2.5 rounded border border-orange-200/80 bg-orange-50/30 space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      {proj.title || proj.name}
                    </span>
                    {proj.url && <span className="text-[9.5px] text-orange-600 truncate max-w-[120px]">{proj.url}</span>}
                  </div>
                  {proj.description && <p className="text-[11px] text-slate-600 leading-snug">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* 2-Column: MarTech Stack + Certifications */}
        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('skills') && skills.length > 0 && (
            <section className={certifications.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="MarTech & Growth Stack" color={tokens.primaryColor} />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={s.id || idx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-medium border border-orange-200 bg-orange-50 text-orange-950"
                  >
                    <EditableElement
                      section="skills"
                      field="name"
                      index={idx}
                      value={s.name || ''}
                      onSave={editors.saveSkillName(idx)}
                      className="inline"
                    />
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section className={skills.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Growth Certifications" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {certifications.map((c, idx) => (
                  <div key={c.id || idx} className="leading-snug">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    {c.issuer && <span className="text-slate-500"> — {c.issuer}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Custom Sections */}
        {isVisible('customSections') && (
          <CVCustomSections
            customSections={customSections}
            designTokens={tokens}
            onSaveTitle={editors.saveCustomSectionTitle}
            onSaveContent={editors.saveCustomSectionContent}
          />
        )}

        {/* Declaration */}
        {isVisible('declaration') && (declaration?.signedBy || declaration?.text) && (
          <CVDeclaration
            declaration={declaration}
            fullName={personalInfo.fullName}
            designTokens={tokens}
            onSaveText={editors.saveDeclarationText}
          />
        )}
      </div>
    </div>
  );
};

export default OnePageMarketingGrowth;
