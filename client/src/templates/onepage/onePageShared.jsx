import React from 'react';
import { useDispatch } from 'react-redux';
import '../shared/cvElements.css';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
  updateCertification,
  updateLanguage,
  updateReference,
  updateDeclaration,
} from '../../store/cvSlice';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import { Camera } from 'lucide-react';

/**
 * Shared Redux dispatch helpers & reusable inline-editable subcomponents
 * for the Dedicated One-Page CV Collection.
 */
export const useOnePageEditors = () => {
  const dispatch = useDispatch();

  return {
    savePersonal: (field) => (val) => dispatch(updatePersonalInfo({ [field]: val })),
    saveExperienceField: (index, field) => (val) =>
      dispatch(updateExperience({ index, data: { [field]: val } })),
    saveExperienceHighlight: (index, hIdx, highlights = []) => (val) => {
      const next = [...highlights];
      next[hIdx] = val;
      dispatch(updateExperience({ index, data: { highlights: next } }));
    },
    saveEducationField: (index, field) => (val) =>
      dispatch(updateEducation({ index, data: { [field]: val } })),
    saveSkillName: (index) => (val) =>
      dispatch(updateSkill({ index, data: { name: val } })),
    saveProjectField: (index, field) => (val) =>
      dispatch(updateProject({ index, data: { [field]: val } })),
    saveCertificationField: (index, field) => (val) =>
      dispatch(updateCertification({ index, data: { [field]: val } })),
    saveLanguageField: (index, field) => (val) =>
      dispatch(updateLanguage({ index, data: { [field]: val } })),
    saveReferenceField: (index, field) => (val) =>
      dispatch(updateReference({ index, data: { [field]: val } })),
    saveDeclarationField: (field) => (val) =>
      dispatch(updateDeclaration({ [field]: val })),
  };
};

export const OnePageAvatar = ({
  photo,
  fullName,
  showPhoto = true,
  photoStyle = 'circle',
  photoSize = 'md',
  shapeOverride,
  borderColor: propBorderColor,
  borderWidth: propBorderWidth,
  photoConfig = {},
  darkPlaceholder = false,
  onOpenPhotoModal,
}) => {
  if (showPhoto === false) return null;

  const styleType = shapeOverride || photoConfig?.shape || photoStyle || 'circle';
  const effectiveBorderWidth =
    typeof propBorderWidth === 'number'
      ? propBorderWidth
      : typeof photoConfig?.borderWidth === 'number'
      ? photoConfig.borderWidth
      : 2;
  const effectiveBorderColor =
    propBorderColor || photoConfig?.borderColor || '#e2e8f0';
  const effectiveBgColor = photoConfig?.bgColor || '#ffffff';

  const isPortraitAspect =
    photoConfig?.aspect === 0.75 || photoConfig?.aspect === 0.8 || styleType === 'portrait';

  const sizeClass =
    isPortraitAspect
      ? photoSize === 'sm'
        ? 'w-16 h-20'
        : photoSize === 'lg'
        ? 'w-22 h-28'
        : 'w-[74px] h-[94px]'
      : photoSize === 'sm'
      ? 'w-14 h-14'
      : photoSize === 'lg'
      ? 'w-24 h-24'
      : 'w-[76px] h-[76px]';

  const radiusClass =
    styleType === 'circle' && !isPortraitAspect
      ? 'rounded-full'
      : styleType === 'square'
      ? 'rounded-none'
      : 'rounded-xl';

  if (photo) {
    return (
      <div
        onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
        className={`relative group cursor-pointer shrink-0 overflow-hidden ${sizeClass} ${radiusClass} shadow-sm`}
        style={{
          border: `${effectiveBorderWidth}px solid ${effectiveBorderColor}`,
          backgroundColor: effectiveBgColor,
        }}
        title="Click to change photo"
      >
        <img
          src={photo}
          alt={fullName || 'Profile Photo'}
          className="w-full h-full object-cover object-center block"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
      className={`cursor-pointer shrink-0 ${sizeClass} ${radiusClass} border border-dashed flex flex-col items-center justify-center text-center p-1 transition-colors print:hidden cv-photo-placeholder ${
        darkPlaceholder
          ? 'border-slate-600 bg-slate-800/70 text-slate-300 hover:border-sky-400'
          : 'border-slate-300 bg-slate-50 text-slate-400 hover:border-blue-400 hover:text-blue-500'
      }`}
      title="Click to upload photo"
    >
      <Camera className="w-4 h-4 mb-0.5 opacity-80" />
      <span className="text-[8.5px] font-semibold leading-tight">Photo</span>
    </div>
  );
};

export const CompactSectionTitle = ({
  title,
  color = '#2563eb',
  variant = 'underline',
}) => {
  if (variant === 'pill') {
    return (
      <h2
        className="cv-section-title cv-heading-avoid-break text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded inline-block mb-1.5"
        style={{ color, backgroundColor: `${color}15` }}
      >
        {title}
      </h2>
    );
  }

  if (variant === 'plain') {
    return (
      <h2
        className="cv-section-title cv-heading-avoid-break text-[11px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b"
        style={{ color, borderColor: '#cbd5e1' }}
      >
        {title}
      </h2>
    );
  }

  if (variant === 'bar') {
    return (
      <div className="cv-section-title cv-heading-avoid-break flex items-center gap-2 mb-1.5">
        <span className="w-1 h-3.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  return (
    <h2
      className="cv-section-title cv-heading-avoid-break text-[11px] font-extrabold uppercase tracking-wider pb-0.5 mb-1.5 border-b-2"
      style={{ color, borderColor: color }}
    >
      {title}
    </h2>
  );
};

export const OnePageExperienceList = ({
  experience = [],
  editors,
  accentColor = '#2563eb',
  compact = false,
}) => {
  if (!experience?.length) return null;

  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="leading-snug cv-experience-item cv-item-avoid-break">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5 min-w-0">
              <EditableElement
                section="experience"
                field="jobTitle"
                index={index}
                value={exp.jobTitle || ''}
                onSave={editors.saveExperienceField(index, 'jobTitle')}
                placeholder="Role / Position"
                className="text-[12px] font-bold text-slate-900 inline"
              />
              {exp.company && (
                <>
                  <span className="text-slate-400 text-[11px]">•</span>
                  <EditableElement
                    section="experience"
                    field="company"
                    index={index}
                    value={exp.company}
                    onSave={editors.saveExperienceField(index, 'company')}
                    placeholder="Organization"
                    className="text-[11.5px] font-semibold inline"
                    style={{ color: accentColor }}
                  />
                </>
              )}
              {exp.location && (
                <span className="text-[10.5px] text-slate-500">({exp.location})</span>
              )}
            </div>
            <span className="text-[10.5px] font-semibold text-slate-500 whitespace-nowrap shrink-0">
              {exp.startDate || ''}
              {exp.startDate || exp.endDate || exp.current ? ' – ' : ''}
              {exp.current ? 'Present' : exp.endDate || ''}
            </span>
          </div>

          {exp.description && (
            <EditableElement
              section="experience"
              field="description"
              index={index}
              value={exp.description}
              onSave={editors.saveExperienceField(index, 'description')}
              placeholder="Summary of responsibilities..."
              className="text-[11px] text-slate-700 mt-0.5 block leading-snug"
            />
          )}

          {Array.isArray(exp.highlights) && exp.highlights.filter(Boolean).length > 0 && (
            <ul className="list-disc list-outside pl-4 mt-0.5 space-y-0.5 text-[11px] text-slate-700 leading-snug">
              {exp.highlights.map(
                (h, hIdx) =>
                  h && (
                    <li key={hIdx}>
                      <EditableElement
                        section="experience"
                        field={`highlight_${hIdx}`}
                        index={index}
                        value={h}
                        onSave={editors.saveExperienceHighlight(index, hIdx, exp.highlights)}
                        placeholder="Achievement bullet..."
                        className="inline"
                      />
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export const OnePageEducationList = ({
  education = [],
  editors,
  accentColor = '#2563eb',
  showGradesProminent = true,
}) => {
  if (!education?.length) return null;

  return (
    <div className="space-y-1.5">
      {education.map((edu, index) => (
        <div key={edu.id || index} className="leading-snug cv-education-item cv-item-avoid-break">
          <div className="flex items-baseline justify-between gap-2">
            <EditableElement
              section="education"
              field="degree"
              index={index}
              value={edu.degree || ''}
              onSave={editors.saveEducationField(index, 'degree')}
              placeholder="Degree / Certificate"
              className="text-[11.5px] font-bold text-slate-900 inline"
            />
            <span className="text-[10.5px] font-semibold text-slate-500 whitespace-nowrap shrink-0">
              {edu.startDate || ''}
              {edu.startDate && edu.endDate ? ' – ' : ''}
              {edu.endDate || ''}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600">
            <EditableElement
              section="education"
              field="institution"
              index={index}
              value={edu.institution || ''}
              onSave={editors.saveEducationField(index, 'institution')}
              placeholder="Institution / University"
              className="inline font-medium"
            />
            {showGradesProminent && edu.grade && (
              <EditableElement
                section="education"
                field="grade"
                index={index}
                value={edu.grade}
                onSave={editors.saveEducationField(index, 'grade')}
                placeholder="GPA / CGPA"
                className="font-bold whitespace-nowrap shrink-0 text-[10.5px]"
                style={{ color: accentColor }}
              />
            )}
          </div>
          {Array.isArray(edu.highlights) && edu.highlights[0] && (
            <p className="text-[10.5px] text-slate-500 mt-0.5">{edu.highlights[0]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export const OnePageProjectsGrid = ({
  projects = [],
  editors,
  accentColor = '#2563eb',
  twoColumns = true,
}) => {
  if (!projects?.length) return null;

  return (
    <div className={twoColumns && projects.length > 1 ? 'grid grid-cols-2 gap-2.5' : 'space-y-2'}>
      {projects.map((proj, index) => (
        <div
          key={proj.id || index}
          className="p-2 rounded-lg border border-slate-200/90 bg-slate-50/70 leading-snug cv-project-item cv-item-avoid-break"
        >
          <div className="flex items-baseline justify-between gap-1.5">
            <EditableElement
              section="projects"
              field="name"
              index={index}
              value={proj.name || ''}
              onSave={editors.saveProjectField(index, 'name')}
              placeholder="Project Name"
              className="text-[11.5px] font-bold text-slate-900 inline"
            />
            {proj.role && (
              <span className="text-[9.5px] font-semibold shrink-0" style={{ color: accentColor }}>
                {proj.role}
              </span>
            )}
          </div>
          {proj.description && (
            <EditableElement
              section="projects"
              field="description"
              index={index}
              value={proj.description}
              onSave={editors.saveProjectField(index, 'description')}
              placeholder="Project outcome..."
              className="text-[10.5px] text-slate-600 mt-0.5 block leading-snug"
            />
          )}
          {(Array.isArray(proj.technologies) ? proj.technologies.length > 0 : proj.technologies) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {(Array.isArray(proj.technologies)
                ? proj.technologies
                : String(proj.technologies).split(',')
              )
                .map((t) => String(t).trim())
                .filter(Boolean)
                .slice(0, 4)
                .map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[9.5px] font-medium text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

