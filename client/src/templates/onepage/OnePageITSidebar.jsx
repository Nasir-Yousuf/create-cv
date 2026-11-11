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
import { Mail, Phone, MapPin, Github, Linkedin, Terminal } from 'lucide-react';

export const OnePageITSidebar = ({ cvData, onOpenPhotoModal }) => {
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
  const accent = design?.accentColor || '#38bdf8';
  const fontFamily = design?.fontFamily || 'Inter, sans-serif';

  return (
    <div className="flex min-h-[1060px] bg-white text-slate-900 leading-snug" style={{ fontFamily }}>
      {/* Dark Obsidian Left Sidebar (30%) */}
      <aside className="w-[30%] shrink-0 bg-slate-950 text-slate-100 px-5 py-6 flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-2 pb-3 border-b border-slate-800">
          <OnePageAvatar
            photo={personalInfo.photo}
            fullName={personalInfo.fullName}
            showPhoto={design?.showPhoto}
            photoStyle={personalInfo.photoStyle || 'circle'}
            photoSize={design?.photoSize}
            borderColor={accent}
            darkPlaceholder={true}
            onOpenPhotoModal={onOpenPhotoModal}
          />
          <div className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700" style={{ color: accent }}>
            <Terminal className="w-2.5 h-2.5" />
            <span>IT & Systems</span>
          </div>
        </div>

        {/* Contact Block */}
        <section className="space-y-1.5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b border-slate-800" style={{ color: accent }}>
            Endpoints
          </h3>
          <div className="space-y-1.5 text-[10px] font-mono text-slate-300 break-words">
            {personalInfo.email && (
              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-1.5">
                <Phone className="w-3 h-3 shrink-0 mt-0.5" style={{ color: accent }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: accent }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-start gap-1.5">
                <Github className="w-3 h-3 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-all">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-1.5">
                <Linkedin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </section>

        {/* Tech Skills Dark Pills */}
        {skills.length > 0 && (
          <section className="space-y-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b border-slate-800" style={{ color: accent }}>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono text-slate-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b border-slate-800" style={{ color: accent }}>
              Certifications
            </h3>
            <div className="space-y-1.5 text-[10px]">
              {certifications.slice(0, 3).map((cert, idx) => (
                <div key={cert.id || idx}>
                  <p className="font-semibold text-white">{cert.name}</p>
                  <p className="text-[9.5px] text-slate-400">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b border-slate-800" style={{ color: accent }}>
              Languages
            </h3>
            <div className="space-y-0.5 text-[10px] text-slate-300">
              {languages.map((l, idx) => (
                <div key={l.id || idx}>
                  <span className="font-semibold text-white">{l.name}</span>
                  {l.proficiency ? ` — ${l.proficiency}` : ''}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Main White Technical Workspace (70%) */}
      <main className="flex-1 px-6 py-6 space-y-3.5 min-w-0">
        <div className="pb-2.5 border-b-2" style={{ borderColor: primary }}>
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName || ''}
            onSave={editors.savePersonal('fullName')}
            placeholder="Full Name"
            className="text-[23px] font-extrabold tracking-tight text-slate-950 block leading-tight"
          />
          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle || ''}
            onSave={editors.savePersonal('jobTitle')}
            placeholder="Systems / IT / Cloud Engineer"
            className="text-[12px] font-mono font-semibold mt-0.5 block"
            style={{ color: primary }}
          />
        </div>

        {personalInfo.summary && (
          <section>
            <CompactSectionTitle title="Technical Summary" color={primary} />
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

        {experience.length > 0 && (
          <section>
            <CompactSectionTitle title="Work Experience" color={primary} />
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
            <CompactSectionTitle title="Infrastructure & Software Projects" color={primary} />
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
            <CompactSectionTitle title="Education" color={primary} />
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

export default OnePageITSidebar;

