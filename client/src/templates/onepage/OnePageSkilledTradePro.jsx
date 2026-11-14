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
  Clock,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Truck,
} from 'lucide-react';

export const OnePageSkilledTradePro = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#b45309', // Warm Amber / Skilled Trade
    accentColor: '#d97706',
    headingColor: '#78350f',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: '#fffbeb',
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
      {/* 1. Header */}
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
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-semibold bg-amber-50 border border-amber-200 text-amber-800">
            <Wrench className="w-3 h-3 text-amber-700" />
            <span>Skilled Technician, Services &amp; Trade Profile</span>
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
            placeholder="Certified Electrician / HVAC Technician / Store Supervisor / Executive Assistant"
            className="text-[12.5px] font-semibold block"
            style={{ color: tokens.primaryColor, fontFamily: tokens.headingFont }}
          />

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-0.5">
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Availability, Safety & Licensing Quick-Facts Ribbon */}
      <div
        className="p-2.5 rounded-lg mb-3 border grid grid-cols-2 sm:grid-cols-4 gap-2 text-center"
        style={{
          backgroundColor: `${tokens.primaryColor}08`,
          borderColor: `${tokens.primaryColor}25`,
        }}
      >
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Availability</span>
          <span className="text-xs font-bold text-slate-900 block truncate">Immediate / Flexible Shifts</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Licensure / Trade</span>
          <span className="text-xs font-bold text-slate-900 block truncate">
            {certifications[0]?.name || 'Licensed Trade Professional'}
          </span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Safety & Compliance</span>
          <span className="text-xs font-bold text-slate-900 block truncate">OSHA / First Aid Certified</span>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Driving / Mobility</span>
          <span className="text-xs font-bold text-slate-900 block truncate">Clean Driving Record</span>
        </div>
      </div>

      {/* 3. Main Stream */}
      <div className="space-y-3">
        {/* Professional Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Work Summary & Hands-On Capabilities" color={tokens.primaryColor} />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Reliable hands-on experience, equipment maintenance, and shift leadership summary..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Practical Skills FIRST */}
        {isVisible('skills') && skills.length > 0 && (
          <section>
            <CompactSectionTitle title="Practical Skills, Tools & Equipment" color={tokens.primaryColor} />
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-amber-200 bg-amber-50/70 text-amber-950 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
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

        {/* Work Experience */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Employment History & Work Record" color={tokens.primaryColor} />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Education & Trade Training */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education & Vocational Training" color={tokens.primaryColor} />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={tokens.primaryColor}
            />
          </section>
        )}

        {/* 2-Column: Certifications & References */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0.5">
          {certifications.length > 0 && (
            <section>
              <CompactSectionTitle title="Certificates & Training" color={tokens.primaryColor} />
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

          {references.length > 0 && (
            <section>
              <CompactSectionTitle title="Employer References" color={tokens.primaryColor} />
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {references.slice(0, 2).map((r, i) => (
                  <div key={r.id || i} className="leading-snug">
                    <span className="font-bold text-slate-900">{r.name}</span>
                    <span className="text-slate-600"> ({r.designation}, {r.company})</span>
                    {r.phone && <div className="text-[10px] text-amber-800 font-semibold">Phone: {r.phone}</div>}
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

export default OnePageSkilledTradePro;
