import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  resolveDesignTokens,
  getSectionVisibility,
  CVCustomSections,
  CVDeclaration,
  CVPersonalDetailsTable,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export const OnePageBDCompact = ({ cvData, onOpenPhotoModal }) => {
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
    primaryColor: '#059669', // Emerald BD Green
    accentColor: '#10b981',
    headingColor: '#064e3b',
    bodyColor: '#1e293b',
    backgroundColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    sectionSpacing: 12,
    itemSpacing: 6,
    dividerThickness: 1.5,
  });

  const isVisible = (key) => getSectionVisibility(key, cvData);

  const quickBdFacts = [
    personalDetails.fatherName ? `Father: ${personalDetails.fatherName}` : null,
    personalDetails.motherName ? `Mother: ${personalDetails.motherName}` : null,
    personalDetails.dateOfBirth ? `DOB: ${personalDetails.dateOfBirth}` : null,
    personalDetails.nationality ? `Nationality: ${personalDetails.nationality}` : null,
    personalDetails.nid ? `NID: ${personalDetails.nid}` : null,
    personalDetails.religion ? `Religion: ${personalDetails.religion}` : null,
    personalDetails.maritalStatus ? `Marital Status: ${personalDetails.maritalStatus}` : null,
    personalDetails.bloodGroup ? `Blood: ${personalDetails.bloodGroup}` : null,
  ].filter(Boolean);

  return (
    <div
      className="px-7 py-6 bg-white leading-snug min-h-[1060px]"
      style={{
        fontFamily: `${tokens.bodyFont}, sans-serif`,
        color: tokens.bodyColor,
        backgroundColor: tokens.backgroundColor,
      }}
    >
      {/* Top Banner with Top-Right Bangladeshi Portrait Photo */}
      <div
        className="flex justify-between items-start gap-4 pb-3 mb-3 border-b-2"
        style={{ borderColor: tokens.primaryColor }}
      >
        <div className="flex-1 min-w-0 space-y-1">
          <span
            className="text-[9.5px] font-bold uppercase tracking-widest block"
            style={{ color: tokens.primaryColor }}
          >
            Curriculum Vitae
          </span>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="YOUR FULL NAME"
            className="text-[22px] font-extrabold uppercase tracking-tight block leading-tight"
            style={{ color: tokens.headingColor, fontFamily: `${tokens.headingFont}, sans-serif` }}
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Target Role / Designation"
            className="text-[12.5px] font-bold text-slate-700 block"
          />
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-1 text-[10.5px] text-slate-600">
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Phone className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3 shrink-0" style={{ color: tokens.primaryColor }} />
                <span>{personalInfo.website}</span>
              </span>
            )}
          </div>
        </div>

        <OnePageAvatar
          photo={personalInfo.photo}
          fullName={personalInfo.fullName}
          showPhoto={design?.showPhoto}
          photoStyle={personalInfo.photoStyle || 'portrait'}
          shapeOverride={personalInfo.photoStyle === 'circle' ? 'circle' : 'portrait'}
          photoSize={design?.photoSize}
          photoConfig={personalInfo.photoConfig}
          borderColor={tokens.primaryColor}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </div>

      <div className="space-y-3">
        {/* Career Objective */}
        {isVisible('summary') && personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Career Objective" color={tokens.primaryColor} variant="bar" />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Write your concise career objective..."
              className="text-[11px] text-slate-700 leading-relaxed block"
            />
          </section>
        )}

        {/* Academic Qualifications Table (BD Recruiter Favorite — Compact 1-page) */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <CompactSectionTitle title="Academic Qualifications" color={tokens.primaryColor} variant="bar" />
            <div className="overflow-hidden rounded border border-slate-200">
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="py-1 px-2">Exam / Degree</th>
                    <th className="py-1 px-2">Institution</th>
                    <th className="py-1 px-2 text-center">Year</th>
                    <th className="py-1 px-2 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {education.map((edu, idx) => (
                    <tr key={edu.id || idx}>
                      <td className="py-1 px-2 font-semibold text-slate-900">{edu.degree}</td>
                      <td className="py-1 px-2 text-slate-700">{edu.institution}</td>
                      <td className="py-1 px-2 text-center text-slate-600 whitespace-nowrap">
                        {edu.endDate || edu.startDate || '-'}
                      </td>
                      <td className="py-1 px-2 text-right font-bold whitespace-nowrap" style={{ color: tokens.primaryColor }}>
                        {edu.grade || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Work Experience */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Work Experience" color={tokens.primaryColor} variant="bar" />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={tokens.primaryColor}
              compact={true}
            />
          </section>
        )}

        {/* Key Projects (compact inline list) */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Notable Projects" color={tokens.primaryColor} variant="bar" />
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {projects.slice(0, 2).map((proj, idx) => (
                <div key={proj.id || idx} className="border-l-2 pl-2" style={{ borderColor: tokens.primaryColor }}>
                  <p className="font-bold text-slate-900">{proj.name}</p>
                  {proj.description && <p className="text-slate-600 leading-snug">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Skills & Personal Snapshot */}
        <div className="grid grid-cols-12 gap-4">
          {isVisible('skills') && skills.length > 0 && (
            <section className={languages.length > 0 ? 'col-span-8' : 'col-span-12'}>
              <CompactSectionTitle title="Skills & Competencies" color={tokens.primaryColor} variant="bar" />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={s.id || idx}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10.5px] font-medium"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          {isVisible('languages') && languages.length > 0 && (
            <section className={skills.length > 0 ? 'col-span-4' : 'col-span-12'}>
              <CompactSectionTitle title="Languages" color={tokens.primaryColor} variant="bar" />
              <div className="space-y-0.5 text-[10.5px] text-slate-700">
                {languages.map((l, idx) => (
                  <div key={l.id || idx}>
                    <span className="font-semibold text-slate-900">{l.name}</span>
                    {l.proficiency ? ` — ${l.proficiency}` : ''}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Personal Details Snapshot (BD Standard / Bank Format) */}
        {isVisible('personalDetails') && (
          <div className="pt-1.5 border-t border-slate-200">
            <CompactSectionTitle title="Personal & Official Details" color={tokens.primaryColor} variant="bar" />
            <CVPersonalDetailsTable
              cvData={cvData}
              personalDetails={personalDetails}
              designTokens={tokens}
              compact={true}
              onSaveField={(field) => editors.savePersonal(field)}
            />
          </div>
        )}

        {/* Custom Sections */}
        {isVisible('customSections') && customSections.length > 0 && (
          <CVCustomSections customSections={customSections} primaryColor={tokens.primaryColor} />
        )}

        {/* References 1 & 2 Side-by-Side (Bangladesh Bank / BCS Standard) */}
        {isVisible('references') && references.length > 0 && (
          <div className="pt-1">
            <CompactSectionTitle title="Professional References" color={tokens.primaryColor} variant="bar" />
            <div className="grid grid-cols-2 gap-2.5 text-[9.5px] text-slate-700">
              {references.slice(0, 2).map((ref, idx) => (
                <div
                  key={ref.id || idx}
                  className="p-1.5 rounded bg-slate-50/80 border border-slate-200/90 space-y-0.5 leading-snug"
                >
                  <p className="font-bold text-slate-900">{ref.name}</p>
                  <p className="text-slate-600 truncate">{ref.designation}{ref.company ? `, ${ref.company}` : ''}</p>
                  <div className="flex flex-wrap gap-x-2 text-[9px] text-slate-500 font-mono pt-0.5">
                    {ref.phone && <span>Mob: {ref.phone}</span>}
                    {ref.email && <span>Email: {ref.email}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formal Declaration & Signature Footer */}
        {isVisible('declaration') && (
          <div className="pt-1.5 border-t border-slate-200">
            <CVDeclaration
              declaration={declaration}
              fullName={personalInfo.fullName}
              designTokens={tokens}
              onSaveText={editors.savePersonal('declarationText')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageBDCompact;

