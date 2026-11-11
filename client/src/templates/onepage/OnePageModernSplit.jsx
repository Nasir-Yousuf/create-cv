import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import {
  useOnePageEditors,
  OnePageAvatar,
  CompactSectionTitle,
  OnePageExperienceList,
  OnePageEducationList,
  OnePageProjectsGrid,
} from './onePageShared';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export const OnePageModernSplit = ({ cvData, onOpenPhotoModal }) => {
  const editors = useOnePageEditors();
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    design = {},
  } = cvData || {};

  const primary = design?.primaryColor || '#0284c7';
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  return (
    <div
      className="flex min-h-[1080px] bg-white text-slate-800 leading-snug"
      style={{ fontFamily, color: textColor }}
    >
      {/* Left Tinted Sidebar (31%) */}
      <aside
        className="w-[31%] shrink-0 px-5 py-6 border-r border-slate-200 flex flex-col gap-4"
        style={{ backgroundColor: `${primary}0d` }}
      >
        <div className="flex flex-col items-center text-center gap-2.5">
          <OnePageAvatar
            photo={personalInfo.photo}
            fullName={personalInfo.fullName}
            showPhoto={design?.showPhoto}
            photoStyle={personalInfo.photoStyle || 'circle'}
            photoSize={design?.photoSize}
            borderColor={primary}
            onOpenPhotoModal={onOpenPhotoModal}
          />
        </div>

        {/* Contact Stack */}
        <section className="space-y-1.5">
          <CompactSectionTitle title="Contact" color={primary} />
          <div className="space-y-1.5 text-[10.5px] text-slate-700 break-words">
            {personalInfo.phone && (
              <div className="flex items-start gap-1.5">
                <Phone className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-1.5">
                <Linkedin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-start gap-1.5">
                <Github className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span className="break-all">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-1.5">
                <Globe className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primary }} />
                <span className="break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills Badges */}
        {skills.length > 0 && (
          <section>
            <CompactSectionTitle title="Skills" color={primary} />
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-800 shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <CompactSectionTitle title="Certifications" color={primary} />
            <div className="space-y-1.5 text-[10.5px]">
              {certifications.slice(0, 3).map((cert, idx) => (
                <div key={cert.id || idx} className="leading-snug">
                  <p className="font-semibold text-slate-900">{cert.name}</p>
                  <p className="text-[9.5px] text-slate-500">
                    {cert.issuer}
                    {cert.date ? ` (${cert.date})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <CompactSectionTitle title="Languages" color={primary} />
            <div className="space-y-1 text-[10.5px]">
              {languages.map((l, idx) => (
                <div key={l.id || idx} className="flex justify-between gap-2">
                  <span className="font-semibold text-slate-900">{l.name}</span>
                  <span className="text-slate-500 text-[10px]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Main Content Area (69%) */}
      <main className="flex-1 px-6 py-6 space-y-3.5 min-w-0">
        <div className="pb-2.5 border-b border-slate-200">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Your Full Name"
            className="text-[23px] font-extrabold tracking-tight text-slate-950 block leading-tight"
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Target Role"
            className="text-[12.5px] font-bold mt-0.5 block"
            style={{ color: primary }}
          />
        </div>

        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Profile Summary" color={primary} variant="bar" />
            <EditableElement
              section="personalInfo"
              field="summary"
              value={personalInfo.summary}
              multiline={true}
              onSave={editors.savePersonal('summary')}
              placeholder="Write your concise summary..."
              className="text-[11px] text-slate-700 leading-relaxed block border-l-2 pl-2.5"
              style={{ borderColor: primary }}
            />
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Experience" color={primary} variant="bar" />
            <OnePageExperienceList
              experience={experience}
              editors={editors}
              accentColor={primary}
              compact={true}
            />
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <CompactSectionTitle title="Key Projects" color={primary} variant="bar" />
            <OnePageProjectsGrid
              projects={projects}
              editors={editors}
              accentColor={primary}
              twoColumns={false}
            />
          </section>
        )}

        {education.length > 0 && (
          <section>
            <CompactSectionTitle title="Education" color={primary} variant="bar" />
            <OnePageEducationList
              education={education}
              editors={editors}
              accentColor={primary}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default OnePageModernSplit;

