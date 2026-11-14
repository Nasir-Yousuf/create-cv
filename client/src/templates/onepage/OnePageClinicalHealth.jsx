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
  getOrderedSectionKeys,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';
import {
  Mail,
  Phone,
  MapPin,
  Activity,
  Award,
  Stethoscope,
  Heart,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export const OnePageClinicalHealth = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#0f766e', // Clinical Teal
    accentColor: '#14b8a6',
    headingColor: '#134e4a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#f0fdfa',
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
      {/* 1. Clinical Header */}
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
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-semibold border"
              style={{
                backgroundColor: `${tokens.primaryColor}10`,
                borderColor: `${tokens.primaryColor}30`,
                color: tokens.primaryColor,
              }}
            >
              <Stethoscope className="w-3 h-3" />
              <span>Medical & Clinical Healthcare Profile</span>
            </span>
          </div>

          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Dr. Full Name / RN Nurse Name"
            className="text-[22px] font-extrabold tracking-tight text-slate-900 block leading-tight"
            style={{ fontFamily: tokens.headingFont }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Resident Medical Officer (MBBS) / Registered Nurse (BSN)"
            className="text-[12.5px] font-semibold block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Strip with Clean Vector Icons */}
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
                <MapPin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Prominent Clinical Credentials Ribbon (Licenses, Registrations & Certs) */}
      {certifications.length > 0 && (
        <div
          className="p-2.5 rounded-lg mb-3 border flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: `${tokens.primaryColor}08`,
            borderColor: `${tokens.primaryColor}25`,
          }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: tokens.primaryColor }}>
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Licensure & Clinical Certifications:</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-700">
            {certifications.slice(0, 3).map((cert, idx) => (
              <span key={cert.id || idx} className="inline-flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-teal-600" />
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span className="text-slate-500 text-[10px]">({cert.issuer})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Clinical Layout */}
      <div className="space-y-3">
        {/* Clinical Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Clinical Profile & Patient Care Overview" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Clinical practice background, acute care rotations, and specialization..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Clinical Experience / Rotations / Residency */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Clinical Experience, Rotations & Hospital Postings" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Medical Education & Degrees */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Medical Education & Training" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* 2-Column: Clinical Skills & Diagnostics + Rotations/Languages */}
        <div className="grid grid-cols-12 gap-4 pt-0.5">
          {isVisible('skills') && skills.length > 0 && (
            <section className={languages.length > 0 || references.length > 0 ? 'col-span-7' : 'col-span-12'}>
              <CompactSectionTitle title="Clinical Competencies & Procedures" color={tokens.primaryColor} />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={s.id || idx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-medium border border-teal-200 bg-teal-50/60 text-teal-950"
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

          {(languages.length > 0 || references.length > 0) && (
            <section className={skills.length > 0 ? 'col-span-5' : 'col-span-12'}>
              <CompactSectionTitle title="Languages & References" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {languages.length > 0 && (
                  <p>
                    <span className="font-semibold text-slate-900">Languages: </span>
                    {languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
                  </p>
                )}
                {references.slice(0, 1).map((r, i) => (
                  <div key={r.id || i} className="text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-900">Referee: </span>
                    <span>{r.name} ({r.designation}, {r.company})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Custom Sections (e.g. Clinical Audits / Medical CME) */}
        {isVisible('customSections') && (
          <CVCustomSections
            customSections={customSections}
            designTokens={tokens}
            onSaveTitle={editors.saveCustomSectionTitle}
            onSaveContent={editors.saveCustomSectionContent}
          />
        )}

        {/* Formal Medical Declaration */}
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

export default OnePageClinicalHealth;
