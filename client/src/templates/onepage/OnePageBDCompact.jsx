import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export const OnePageBDCompact = ({ cvData, onOpenPhotoModal }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    references = [],
    declaration = {},
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#059669';
  const textColor = design?.textColor || '#1e293b';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  const quickBdFacts = [
    personalDetails.nationality ? `Nationality: ${personalDetails.nationality}` : null,
    personalDetails.presentAddress ? `Address: ${personalDetails.presentAddress}` : null,
    personalDetails.dateOfBirth ? `DOB: ${personalDetails.dateOfBirth}` : null,
  ].filter(Boolean);

  return (
    <div
      className="px-7 py-6 bg-white text-slate-800 leading-snug"
      style={{ fontFamily, color: textColor }}
    >
      {/* Top Banner with Top-Right Bangladeshi Portrait Photo */}
      <div
        className="flex justify-between items-start gap-4 pb-3 mb-3 border-b-2"
        style={{ borderColor: primary }}
      >
        <div className="flex-1 min-w-0 space-y-1">
          <span
            className="text-[9.5px] font-bold uppercase tracking-widest block"
            style={{ color: primary }}
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
            className="text-[22px] font-extrabold uppercase tracking-tight text-slate-950 block leading-tight"
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
                <Phone className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: primary }} />
                <span>{personalInfo.linkedin}</span>
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
          borderColor={primary}
          onOpenPhotoModal={onOpenPhotoModal}
        />
      </div>

      <div className="space-y-3">
        {/* Career Objective */}
        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Career Objective" color={primary} variant="bar" />
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
        {education.length > 0 && (
          <section>
            <CompactSectionTitle title="Academic Qualifications" color={primary} variant="bar" />
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
                      <td className="py-1 px-2 text-right font-bold whitespace-nowrap" style={{ color: primary }}>
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
        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Work Experience" color={primary} variant="bar" />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {/* Key Projects (compact inline list) */}
        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Notable Projects" color={primary} variant="bar" />
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {projects.slice(0, 2).map((proj, idx) => (
                <div key={proj.id || idx} className="border-l-2 pl-2" style={{ borderColor: primary }}>
                  <p className="font-bold text-slate-900">{proj.name}</p>
                  {proj.description && <p className="text-slate-600 leading-snug">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Skills & Personal Snapshot */}
        <div className="grid grid-cols-12 gap-4">
          {skills.length > 0 && (
            <section className={languages.length > 0 ? 'col-span-8' : 'col-span-12'}>
              <CompactSectionTitle title="Skills & Competencies" color={primary} variant="bar" />
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
          {languages.length > 0 && (
            <section className={skills.length > 0 ? 'col-span-4' : 'col-span-12'}>
              <CompactSectionTitle title="Languages" color={primary} variant="bar" />
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

        {/* Concise Personal Snapshot + Reference + Declaration Footer */}
        {(quickBdFacts.length > 0 || references.length > 0 || declaration?.text) && (
          <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[10px] text-slate-600">
            {quickBdFacts.length > 0 && (
              <p>
                <span className="font-bold text-slate-800">Personal Info: </span>
                {quickBdFacts.join('  •  ')}
              </p>
            )}
            {references.length > 0 && (
              <p>
                <span className="font-bold text-slate-800">Reference: </span>
                {references[0].name}
                {references[0].designation ? `, ${references[0].designation}` : ''}
                {references[0].company ? `, ${references[0].company}` : ''}
                {references[0].phone ? ` (${references[0].phone})` : ''}
              </p>
            )}
            {declaration?.text && (
              <div className="flex items-end justify-between gap-4 pt-1">
                <p className="italic text-slate-500 flex-1">{declaration.text}</p>
                <span className="font-bold text-slate-800 border-t border-slate-400 pt-0.5 px-2 whitespace-nowrap">
                  {declaration.signedBy || personalInfo.fullName}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePageBDCompact;

