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
  CVPersonalDetailsTable,
} from './onePageShared';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export const OnePageCreativeEditorial = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#e11d48', // Vibrant Rose / Editorial Coral
    accentColor: '#fb7185',
    headingColor: '#881337',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  return (
    <div
      className="min-h-[1060px] bg-white leading-snug border-l-8"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
        borderLeftColor: tokens.primaryColor,
      }}
    >
      {/* Editorial Tinted Header Block */}
      <header
        className="px-7 py-5 flex items-center justify-between gap-5"
        style={{ backgroundColor: `${tokens.primaryColor}10` }}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-widest" style={{ color: tokens.primaryColor }}>
            <span>Portfolio Resume</span>
          </div>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Creative Full Name"
            className="text-[24px] font-extrabold tracking-tight block leading-tight"
            style={{ color: tokens.headingColor, fontFamily: `${tokens.headingFont}, sans-serif` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Product Designer / Creative Lead"
            className="text-[12.5px] font-semibold text-slate-700 block"
          />

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-1.5 text-[10.5px] text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.location}
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.website}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3" style={{ color: tokens.primaryColor }} /> {personalInfo.linkedin}
              </span>
            )}
          </div>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'rounded'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </header>

      {/* Main Content + Asymmetric 62/38 Split */}
      <div className="px-7 py-5 space-y-3.5">
        {isVisible('summary') && personalInfo.summary && (
          <section className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70">
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        <div className="grid grid-cols-12 gap-5">
          {/* Left 7 cols (62%): Experience & Portfolio Projects */}
          <div className="col-span-7 space-y-3">
            {isVisible('experience') && experience.length > 0 && (
              <section>
                <CompactSectionTitle title="Experience" color={tokens.primaryColor} variant="pill" />
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
                <CompactSectionTitle title="Selected Work" color={tokens.primaryColor} variant="pill" />
                <div className="space-y-2">
                  {projects.map((p, idx) => (
                    <div key={p.id || idx} className="p-2 rounded-lg border border-slate-200 bg-white">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-[11.5px] text-slate-900">{p.name}</span>
                        {p.role && (
                          <span className="text-[9.5px] font-semibold" style={{ color: tokens.primaryColor }}>
                            {p.role}
                          </span>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                          {p.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isVisible('customSections') && customSections.length > 0 && (
              <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
            )}
          </div>

          {/* Right 5 cols (38%): Education, Skill Tags, Honors, Languages */}
          <div className="col-span-5 space-y-3">
            {isVisible('education') && education.length > 0 && (
              <section>
                <CompactSectionTitle title="Education" color={tokens.primaryColor} variant="pill" />
                <OnePageEducationList
                  education={education}
                  editors={editors}
                  accentColor={tokens.primaryColor}
                />
              </section>
            )}

            {isVisible('skills') && skills.length > 0 && (
              <section>
                <CompactSectionTitle title="Toolkit & Craft" color={tokens.primaryColor} variant="pill" />
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={s.id || idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200 bg-slate-50 text-slate-800"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {isVisible('certifications') && certifications.length > 0 && (
              <section>
                <CompactSectionTitle title="Recognition" color={tokens.primaryColor} variant="pill" />
                <div className="space-y-1 text-[10.5px]">
                  {certifications.slice(0, 3).map((c, idx) => (
                    <div key={c.id || idx}>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      {c.issuer && <p className="text-[9.5px] text-slate-500">{c.issuer}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isVisible('languages') && languages.length > 0 && (
              <section>
                <CompactSectionTitle title="Languages" color={tokens.primaryColor} variant="pill" />
                <div className="space-y-0.5 text-[10.5px] text-slate-700">
                  {languages.map((l, idx) => (
                    <p key={l.id || idx}>
                      <span className="font-semibold text-slate-900">{l.name}</span>
                      {l.proficiency ? ` — ${l.proficiency}` : ''}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {isVisible('personalDetails') && (
              <CVPersonalDetailsTable personalDetails={personalDetails} compact={true} />
            )}
          </div>
        </div>

        {isVisible('declaration') && declaration?.text && (
          <div className="pt-2 text-[9px] border-t border-slate-200">
            <CVDeclaration declaration={declaration} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageCreativeEditorial;

