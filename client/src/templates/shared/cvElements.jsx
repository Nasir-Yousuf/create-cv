import React from 'react';
import EditableElement from '../../features/cv-editor/components/EditableElement';
import './cvElements.css';

/**
 * Reusable icon-and-text row ensuring consistent vertical centering,
 * non-shrinking icon bounds, and clean line-wrapping across preview and PDF exports.
 */
export const CVIconRow = ({
  icon: Icon,
  iconClassName = 'w-3.5 h-3.5',
  iconStyle,
  className = '',
  as: Tag = 'div',
  children,
}) => (
  <Tag className={`cv-icon-row ${className}`}>
    {Icon && <Icon className={`cv-icon-svg shrink-0 ${iconClassName}`} style={iconStyle} aria-hidden="true" />}
    {children}
  </Tag>
);

/**
 * Reusable badge/pill wrapper guaranteeing centered horizontal & vertical
 * text placement regardless of font size, text length, or PDF renderer.
 */
export const CVBadge = ({ className = '', style, children }) => (
  <span className={`cv-badge ${className}`} style={style}>
    {children}
  </span>
);

const DEFAULT_CIRCLE_SIZES = {
  sm: 'w-24 h-24',
  md: 'w-28 h-28',
  lg: 'w-36 h-36',
  xl: 'w-40 h-40',
};

const DEFAULT_PORTRAIT_SIZES = {
  sm: 'w-24 h-32',
  md: 'w-28 h-36',
  lg: 'w-36 h-48',
  xl: 'w-40 h-52',
};

/**
 * Resolves mutually-exclusive width/height classes for profile photos so
 * circular styles never inherit conflicting portrait height utilities.
 */
export const resolvePhotoBoxClasses = ({
  photoSize = 'md',
  photoStyle = 'portrait',
  circleSizes = DEFAULT_CIRCLE_SIZES,
  portraitSizes = DEFAULT_PORTRAIT_SIZES,
  squareSizes = DEFAULT_CIRCLE_SIZES,
} = {}) => {
  if (photoStyle === 'circle') {
    const dims = circleSizes[photoSize] || circleSizes.md;
    return `${dims} cv-photo-frame cv-photo-circle rounded-full`;
  }
  if (photoStyle === 'square') {
    const dims = squareSizes[photoSize] || squareSizes.md;
    return `${dims} cv-photo-frame rounded-none`;
  }
  if (photoStyle === 'rounded') {
    const dims = portraitSizes[photoSize] || portraitSizes.md;
    return `${dims} cv-photo-frame rounded-xl`;
  }
  const dims = portraitSizes[photoSize] || portraitSizes.md;
  return `${dims} cv-photo-frame rounded-md`;
};

/**
 * Resolves the complete design tokens hierarchy for any template.
 * Hierarchy: user cvData.designTokens > user cvData.design > templateDefaultTokens > system defaults.
 */
export const resolveDesignTokens = (cvData = {}, templateDefaultTokens = {}) => {
  const dt = cvData?.designTokens || {};
  const d = cvData?.design || {};
  const def = templateDefaultTokens || {};

  const primaryColor = dt.primaryColor || d.primaryColor || def.primaryColor || '#2563eb';
  const accentColor = dt.accentColor || d.accentColor || def.accentColor || '#0ea5e9';
  const headingColor = dt.headingColor || dt.textColor || d.textColor || def.headingColor || '#0f172a';
  const bodyColor = dt.bodyColor || dt.textColor || d.textColor || def.bodyColor || '#334155';
  const backgroundColor = dt.backgroundColor || d.backgroundColor || def.backgroundColor || '#ffffff';
  const sidebarColor = dt.sidebarColor || def.sidebarColor || '#f8fafc';
  const fontFamily = dt.fontFamily || d.fontFamily || def.fontFamily || 'Inter, sans-serif';
  const headingFont = dt.headingFont || dt.fontFamily || d.fontFamily || def.headingFont || fontFamily;
  const bodyFont = dt.bodyFont || dt.fontFamily || d.fontFamily || def.bodyFont || fontFamily;
  const fontSize = dt.fontSize || (d.fontSize === 'small' ? '11px' : d.fontSize === 'large' ? '13px' : '12px');
  const lineSpacing = dt.lineSpacing || (d.lineSpacing === 'compact' ? '1.25' : d.lineSpacing === 'spacious' ? '1.6' : '1.4');
  const sectionSpacing = dt.sectionSpacing || (d.sectionSpacing === 'compact' ? '10px' : d.sectionSpacing === 'spacious' ? '24px' : '16px');
  const itemSpacing = dt.itemSpacing || def.itemSpacing || '8px';
  const pageMargin = dt.pageMargin || (d.margins === 'compact' ? '16px' : d.margins === 'spacious' ? '32px' : '24px');
  const dividerThickness = dt.dividerThickness || def.dividerThickness || '1px';
  const columnRatio = dt.columnRatio || def.columnRatio || '35/65';

  return {
    primaryColor,
    accentColor,
    headingColor,
    bodyColor,
    backgroundColor,
    sidebarColor,
    fontFamily,
    headingFont,
    bodyFont,
    fontSize,
    lineSpacing,
    sectionSpacing,
    itemSpacing,
    pageMargin,
    dividerThickness,
    columnRatio,
  };
};

/**
 * Checks whether a section is visible according to sectionConfig.
 */
export const getSectionVisibility = (sectionKey, cvData = {}) => {
  const hidden = cvData?.sectionConfig?.hidden;
  if (Array.isArray(hidden) && hidden.includes(sectionKey)) {
    return false;
  }
  const visibility = cvData?.sectionConfig?.visibility;
  if (visibility && visibility[sectionKey] === false) {
    return false;
  }
  return true;
};

/**
 * Returns an ordered array of active section keys according to user sectionConfig.
 */
export const getOrderedSectionKeys = (
  cvData = {},
  defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'personalDetails',
    'references',
    'declaration',
    'customSections',
  ]
) => {
  const userOrder = cvData?.sectionConfig?.order || cvData?.design?.sectionOrder;
  const baseOrder = Array.isArray(userOrder) && userOrder.length > 0 ? userOrder : defaultOrder;

  return baseOrder.filter((key) => getSectionVisibility(key, cvData));
};

/**
 * Universal Section Title renderer with full support for designTokens,
 * visual styles (underline, pill, bar, plain, boxed, left-border),
 * and EditableElement inline editing.
 */
export const CVSectionTitle = ({
  title,
  color,
  fontFamily,
  dividerThickness = '2px',
  variant = 'underline',
  className = '',
  style = {},
  sectionKey,
  onSave,
}) => {
  const activeColor = color || '#2563eb';

  const headingContent = onSave && sectionKey ? (
    <EditableElement
      section="sectionHeaders"
      field={sectionKey}
      tag="span"
      value={title}
      onSave={onSave}
      placeholder="Section Title"
      className="inline"
    />
  ) : (
    title
  );

  if (variant === 'pill') {
    return (
      <h2
        className={`cv-section-title cv-heading-avoid-break text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded inline-block mb-2 ${className}`}
        style={{
          fontFamily,
          color: activeColor,
          backgroundColor: `${activeColor}15`,
          ...style,
        }}
      >
        {headingContent}
      </h2>
    );
  }

  if (variant === 'bar') {
    return (
      <div
        className={`cv-section-title cv-heading-avoid-break flex items-center gap-2 mb-2 ${className}`}
        style={style}
      >
        <span
          className="w-1.5 h-4 rounded-full shrink-0"
          style={{ backgroundColor: activeColor }}
        />
        <h2
          className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-900"
          style={{ fontFamily }}
        >
          {headingContent}
        </h2>
      </div>
    );
  }

  if (variant === 'left-border') {
    return (
      <h2
        className={`cv-section-title cv-heading-avoid-break text-[11.5px] font-extrabold uppercase tracking-wider pl-2.5 mb-2 border-l-4 ${className}`}
        style={{
          fontFamily,
          color: activeColor,
          borderColor: activeColor,
          borderLeftWidth: dividerThickness,
          ...style,
        }}
      >
        {headingContent}
      </h2>
    );
  }

  if (variant === 'plain') {
    return (
      <h2
        className={`cv-section-title cv-heading-avoid-break text-[11px] font-bold uppercase tracking-widest pb-1 mb-2 border-b ${className}`}
        style={{
          fontFamily,
          color: activeColor,
          borderColor: '#e2e8f0',
          borderBottomWidth: dividerThickness,
          ...style,
        }}
      >
        {headingContent}
      </h2>
    );
  }

  // Default 'underline' variant
  return (
    <h2
      className={`cv-section-title cv-heading-avoid-break text-[11.5px] font-extrabold uppercase tracking-wider pb-1 mb-2 border-b-2 ${className}`}
      style={{
        fontFamily,
        color: activeColor,
        borderColor: activeColor,
        borderBottomWidth: dividerThickness,
        ...style,
      }}
    >
      {headingContent}
    </h2>
  );
};

/**
 * Universal Section Container that automatically respects sectionConfig visibility
 * and injects designTokens.sectionSpacing cleanly.
 */
export const CVSection = ({
  sectionKey,
  cvData = {},
  title,
  titleVariant = 'underline',
  designTokens = {},
  children,
  className = '',
  style = {},
  onSaveTitle,
}) => {
  if (sectionKey && !getSectionVisibility(sectionKey, cvData)) {
    return null;
  }

  const tokens = Object.keys(designTokens).length > 0 ? designTokens : resolveDesignTokens(cvData);

  return (
    <section
      className={`cv-section ${className}`}
      data-cv-section={sectionKey}
      style={{
        marginBottom: tokens.sectionSpacing || '16px',
        ...style,
      }}
    >
      {title && (
        <CVSectionTitle
          title={title}
          color={tokens.primaryColor}
          fontFamily={tokens.headingFont}
          dividerThickness={tokens.dividerThickness}
          variant={titleVariant}
          sectionKey={sectionKey}
          onSave={onSaveTitle}
        />
      )}
      {children}
    </section>
  );
};

/**
 * Universal Bangladesh Standard Personal Details Table.
 * Renders Father's Name, Mother's Name, Date of Birth, Gender, Marital Status,
 * Nationality, National ID (NID), Religion, Blood Group, Permanent Address.
 * Respects cvData.sectionConfig.bdFields and supports EditableElement.
 */
export const CVPersonalDetailsTable = ({
  cvData = {},
  designTokens = {},
  columns = 2, // 2 or 4
  className = '',
  onSaveField,
}) => {
  const pd = cvData?.personalDetails || {};
  const pi = cvData?.personalInfo || {};
  const activeBdFields = cvData?.sectionConfig?.bdFields;

  const rawFields = [
    { key: 'fatherName', label: "Father's Name", value: pd.fatherName || pi.fatherName || '' },
    { key: 'motherName', label: "Mother's Name", value: pd.motherName || pi.motherName || '' },
    { key: 'dob', label: 'Date of Birth', value: pd.dateOfBirth || pd.dob || pi.dob || '' },
    { key: 'gender', label: 'Gender', value: pd.gender || pi.gender || '' },
    { key: 'maritalStatus', label: 'Marital Status', value: pd.maritalStatus || pi.maritalStatus || '' },
    { key: 'nationality', label: 'Nationality', value: pd.nationality || pi.nationality || 'Bangladeshi' },
    { key: 'nid', label: 'National ID (NID)', value: pd.nationalId || pd.nid || pi.nid || '' },
    { key: 'religion', label: 'Religion', value: pd.religion || pi.religion || '' },
    { key: 'bloodGroup', label: 'Blood Group', value: pd.bloodGroup || pi.bloodGroup || '' },
    { key: 'permanentAddress', label: 'Permanent Address', value: pd.permanentAddress || pi.permanentAddress || '' },
    { key: 'presentAddress', label: 'Present Address', value: pd.presentAddress || pi.location || '' },
  ];

  // Filter by user selection if configured, or keep fields with content
  const fields = rawFields.filter((f) => {
    if (Array.isArray(activeBdFields) && activeBdFields.length > 0) {
      return activeBdFields.includes(f.key);
    }
    return Boolean(f.value);
  });

  if (fields.length === 0) return null;

  const tokens = Object.keys(designTokens).length > 0 ? designTokens : resolveDesignTokens(cvData);

  return (
    <div className={`cv-bd-table-wrapper cv-item-avoid-break overflow-x-auto ${className}`}>
      <table
        className="cv-bd-table w-full text-[11px] border border-slate-200 dark:border-slate-700 border-collapse"
        style={{ fontFamily: tokens.bodyFont }}
      >
        <tbody>
          {fields.map((f, idx) => (
            <tr
              key={f.key}
              className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-800/40'}
            >
              <td
                className="w-1/3 sm:w-1/4 p-1.5 font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                style={{ color: tokens.headingColor }}
              >
                {f.label}
              </td>
              <td className="p-1.5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
                {onSaveField ? (
                  <EditableElement
                    section="personalDetails"
                    field={f.key}
                    value={f.value}
                    onSave={onSaveField(f.key)}
                    placeholder={`Enter ${f.label}`}
                    className="inline"
                  />
                ) : (
                  f.value || '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Universal Custom Sections Renderer with EditableElement integration.
 */
export const CVCustomSections = ({
  customSections = [],
  designTokens = {},
  onSaveTitle,
  onSaveContent,
}) => {
  const visibleSections = (customSections || []).filter((s) => s && s.visible !== false);
  if (visibleSections.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleSections.map((sec, idx) => (
        <div key={sec.id || idx} className="cv-custom-section cv-item-avoid-break leading-snug">
          <CVSectionTitle
            title={sec.title || 'Custom Section'}
            color={designTokens.primaryColor}
            fontFamily={designTokens.headingFont}
            dividerThickness={designTokens.dividerThickness}
            sectionKey={`custom_${idx}`}
            onSave={onSaveTitle ? onSaveTitle(idx) : undefined}
          />
          {onSaveContent ? (
            <EditableElement
              section="customSections"
              field="content"
              index={idx}
              value={sec.content || ''}
              multiline={true}
              onSave={onSaveContent(idx)}
              placeholder="Enter custom section details..."
              className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed block"
            />
          ) : (
            <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Formal Declaration block for Bangladeshi & European applications.
 */
export const CVDeclaration = ({
  declaration = {},
  fullName = '',
  designTokens = {},
  onSaveText,
}) => {
  const text =
    declaration?.text ||
    'I hereby declare that all information furnished in this curriculum vitae is true, complete and correct to the best of my knowledge and belief.';
  const dateStr = declaration?.date || new Date().toLocaleDateString('en-GB');
  const signed = declaration?.signedBy || fullName;

  return (
    <div
      className="cv-declaration cv-item-avoid-break text-[10.5px] text-slate-600 dark:text-slate-400 space-y-2 pt-1"
      style={{ fontFamily: designTokens.bodyFont }}
    >
      {onSaveText ? (
        <EditableElement
          section="declaration"
          field="text"
          value={text}
          multiline={true}
          onSave={onSaveText}
          placeholder="Declaration text..."
          className="italic leading-relaxed block"
        />
      ) : (
        <p className="italic leading-relaxed">{text}</p>
      )}

      <div className="flex justify-between items-end pt-2 text-[10.5px]">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Date: </span>
          <span>{dateStr}</span>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-800 dark:text-slate-200 border-t border-slate-400 dark:border-slate-600 pt-0.5 min-w-[120px] text-center">
            {signed}
          </div>
          <span className="text-[9.5px] text-slate-500">Signature of Applicant</span>
        </div>
      </div>
    </div>
  );
};

export { EditableElement };
