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
  Linkedin,
  TrendingUp,
  DollarSign,
  PieChart,
  ShieldAlert,
  Award,
} from 'lucide-react';

export const OnePageFinanceLedger = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#047857', // Ledger Emerald / Wealth Green
    accentColor: '#059669',
    headingColor: '#064e3b',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    sidebarColor: '#f0fdf4',
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
      {/* 1. Finance Header */}
      <div
        className="flex items-center gap-4 pb-3.5 mb-3 border-b-2"
        style={{ borderColor: tokens.primaryColor }}
      >
        <OnePageAvatar
          photo={personalInfo.photo || personalInfo.photoUrl}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'square'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          onOpenPhotoModal={onOpenPhotoModal}
        />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-semibold border"
              style={{
                backgroundColor: `${tokens.primaryColor}10`,
                borderColor: `${tokens.primaryColor}30`,
                color: tokens.primaryColor,
              }}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Financial Planning &amp; Commercial Banking Profile</span>
            </span>
          </div>

          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Full Name, CFA / CA / ACCA"
            className="text-[22px] font-extrabold tracking-tight text-slate-900 block leading-tight"
            style={{ fontFamily: tokens.headingFont }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Senior FP&A Manager / Commercial Banking MTO / Corporate Auditor"
            className="text-[12.5px] font-semibold block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Details */}
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
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Ledger Highlight Bar (Certifications & Quantifiable Credentials) */}
      <div
        className="p-2.5 rounded-lg mb-3 border grid grid-cols-2 sm:grid-cols-4 gap-2 text-center"
        style={{
          backgroundColor: `${tokens.primaryColor}08`,
          borderColor: `${tokens.primaryColor}25`,
        }}
      >
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Licensure</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">
            {certifications[0]?.name || 'CFA / CA / ACCA'}
          </span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Accounting Standards</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">IFRS &amp; US GAAP</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Enterprise ERP</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">SAP / Oracle / Finacle</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Quantitative Focus</span>
          <span className="text-xs font-extrabold text-slate-900 block truncate">DCF / P&amp;L / FP&amp;A</span>
        </div>
      </div>

      {/* 3. Main Stream */}
      <div className="space-y-3">
        {/* Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Executive Finance Profile" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Financial modeling expertise, P&L stewardship, and strategic advisory summary..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Experience */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Financial & Commercial Experience" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Education */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Academic & Business Education" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* 2-Column: Financial Skills + Certifications / Languages */}
        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('skills') && skills.length > 0 && (
            <section className={certifications.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Financial Modeling & Quantitative Skills" color={tokens.primaryColor} />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={s.id || idx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-medium border border-emerald-200 bg-emerald-50/70 text-emerald-950 font-mono"
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

          {(certifications.length > 0 || languages.length > 0) && (
            <section className={skills.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Credentials & Languages" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {certifications.map((c, idx) => (
                  <div key={c.id || idx} className="leading-snug">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    {c.issuer && <span className="text-slate-500"> — {c.issuer}</span>}
                  </div>
                ))}
                {languages.length > 0 && (
                  <p className="text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800">Languages: </span>
                    {languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
                  </p>
                )}
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

export default OnePageFinanceLedger;
