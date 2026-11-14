/**
 * Shared CV payload sanitization, OpenXML color/text normalization, and image type helpers.
 * Used across client exporters, templates, controllers, PDF SSR, and DOCX generators so
 * partial/sparse/custom CVs never fail validation, SSR rendering, or DOCX/PDF exports.
 */

export const MONGO_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const isValidMongoObjectId = (value) =>
  typeof value === 'string' && MONGO_OBJECT_ID_REGEX.test(value.trim());

/**
 * Strips XML 1.0 invalid control characters that break WordprocessingML (.docx) parsers.
 */
export const stripXmlUnsafeChars = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '');
};

/**
 * Normalizes any CSS color (#RGB, #RRGGBB, #RRGGBBAA, rgb(...), rgba(...)) to uppercase #RRGGBB.
 */
export const normalizeHexColor = (rawColor, fallback = '#1E40AF') => {
  const safeFallback = /^#?[0-9a-fA-F]{6}$/.test(String(fallback || ''))
    ? `#${String(fallback).replace(/^#/, '').toUpperCase()}`
    : '#1E40AF';

  if (!rawColor || typeof rawColor !== 'string') return safeFallback;
  const trimmed = rawColor.trim();

  const shortMatch = trimmed.match(/^#([0-9a-fA-F]{3})$/);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  const fullMatch = trimmed.match(/^#?([0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?$/);
  if (fullMatch) {
    return `#${fullMatch[1].toUpperCase()}`;
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/i
  );
  if (rgbMatch) {
    const toHex = (n) => Math.max(0, Math.min(255, Number(n) || 0)).toString(16).padStart(2, '0');
    return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`.toUpperCase();
  }

  return safeFallback;
};

/**
 * Returns a strict 6-character uppercase hex value without '#' as required by `docx`.
 */
export const toDocxHex = (rawColor, fallback = '1E40AF') =>
  normalizeHexColor(rawColor, fallback).replace(/^#/, '');

/**
 * Detects docx-compatible raster image type ('png' | 'jpg' | 'gif') from magic bytes.
 */
export const detectImageFormatFromBytes = (bytes) => {
  if (!bytes || bytes.length < 4) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'png';
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg';
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return 'gif';
  }
  return null;
};

const toPlainObject = (val) =>
  val && typeof val === 'object' && !Array.isArray(val) ? val : {};

const toStringList = (val) => {
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === 'string' ? item.trim() : item?.name || item?.title || ''))
      .filter(Boolean);
  }
  if (typeof val === 'string') {
    return val
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

export const DEFAULT_DESIGN_TOKENS = {
  primaryColor: '#2563eb',
  accentColor: '#0ea5e9',
  headingColor: '#0f172a',
  bodyColor: '#334155',
  backgroundColor: '#ffffff',
  sidebarBgColor: '#f8fafc',
  dividerColor: '#e2e8f0',
  badgeBgColor: '#eff6ff',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  baseFontSize: '14px',
  lineHeight: 1.5,
  letterSpacing: '0px',
  paragraphSpacing: '8px',
  pageMargin: '24px',
  sectionSpacing: '16px',
  columnRatio: '35/65',
  dividerThickness: '1px',
};

export const DEFAULT_SECTION_CONFIG = [
  { id: 'summary', label: 'Professional Summary', visible: true, column: 'main' },
  { id: 'experience', label: 'Work Experience', visible: true, column: 'main' },
  { id: 'internships', label: 'Internships', visible: true, column: 'main' },
  { id: 'education', label: 'Education', visible: true, column: 'main' },
  { id: 'projects', label: 'Projects', visible: true, column: 'main' },
  { id: 'skills', label: 'Skills & Competencies', visible: true, column: 'sidebar' },
  { id: 'certifications', label: 'Certifications', visible: true, column: 'sidebar' },
  { id: 'languages', label: 'Languages', visible: true, column: 'sidebar' },
  { id: 'achievements', label: 'Achievements', visible: true, column: 'main' },
  { id: 'volunteer', label: 'Volunteer Experience', visible: true, column: 'main' },
  { id: 'publications', label: 'Publications', visible: true, column: 'main' },
  { id: 'references', label: 'References', visible: true, column: 'main' },
  { id: 'personalDetails', label: 'Personal Details (BD)', visible: true, column: 'sidebar' },
  { id: 'declaration', label: 'Declaration', visible: true, column: 'main' },
  { id: 'additionalInfo', label: 'Additional Information', visible: true, column: 'main' },
  { id: 'customSections', label: 'Custom Sections', visible: true, column: 'main' },
];

const VALID_PHOTO_STYLES = new Set(['circle', 'square', 'rounded', 'portrait']);

/**
 * Coerces arbitrary CV payloads into clean, crash-free canonical structures without deleting user text.
 */
export const normalizeCvData = (raw = {}) => {
  const src = raw && typeof raw === 'object' ? raw : {};
  const rawPersonalInfo = toPlainObject(src.personalInfo);
  const rawPersonalDetails = toPlainObject(src.personalDetails);
  const rawDesign = toPlainObject(src.design);
  const rawDesignTokens = toPlainObject(src.designTokens);

  const normalizedPhotoStyle = VALID_PHOTO_STYLES.has(rawPersonalInfo.photoStyle)
    ? rawPersonalInfo.photoStyle
    : 'circle';

  const rawPhotoConfig = toPlainObject(rawPersonalInfo.photoConfig);
  const photoConfig = {
    shape: ['circle', 'rounded', 'square'].includes(rawPhotoConfig.shape)
      ? rawPhotoConfig.shape
      : normalizedPhotoStyle === 'portrait'
      ? 'rounded'
      : normalizedPhotoStyle || 'circle',
    zoom: typeof rawPhotoConfig.zoom === 'number' ? rawPhotoConfig.zoom : 1,
    aspect: typeof rawPhotoConfig.aspect === 'number' ? rawPhotoConfig.aspect : 1,
    borderWidth: typeof rawPhotoConfig.borderWidth === 'number' ? rawPhotoConfig.borderWidth : 2,
    borderColor: typeof rawPhotoConfig.borderColor === 'string' ? rawPhotoConfig.borderColor : '',
  };

  const fatherName = rawPersonalInfo.fatherName || rawPersonalDetails.fatherName || '';
  const motherName = rawPersonalInfo.motherName || rawPersonalDetails.motherName || '';
  const dob = rawPersonalInfo.dob || rawPersonalInfo.dateOfBirth || rawPersonalDetails.dob || rawPersonalDetails.dateOfBirth || '';
  const dateOfBirth = dob;
  const gender = rawPersonalInfo.gender || rawPersonalDetails.gender || '';
  const maritalStatus = rawPersonalInfo.maritalStatus || rawPersonalDetails.maritalStatus || '';
  const nationality = rawPersonalInfo.nationality || rawPersonalDetails.nationality || '';
  const religion = rawPersonalInfo.religion || rawPersonalDetails.religion || '';
  const bloodGroup = rawPersonalInfo.bloodGroup || rawPersonalDetails.bloodGroup || '';
  const nid = rawPersonalInfo.nid || rawPersonalInfo.nationalId || rawPersonalDetails.nid || rawPersonalDetails.nationalId || '';
  const presentAddress = rawPersonalInfo.presentAddress || rawPersonalDetails.presentAddress || '';
  const permanentAddress = rawPersonalInfo.permanentAddress || rawPersonalDetails.permanentAddress || '';

  const summary = src.summary || rawPersonalInfo.summary || '';
  const careerObjective = src.careerObjective || rawPersonalInfo.careerObjective || '';

  const personalInfo = {
    ...rawPersonalInfo,
    fullName: rawPersonalInfo.fullName || '',
    jobTitle: rawPersonalInfo.jobTitle || '',
    email: rawPersonalInfo.email || '',
    phone: rawPersonalInfo.phone || '',
    location: rawPersonalInfo.location || rawPersonalInfo.address || '',
    address: rawPersonalInfo.address || rawPersonalInfo.location || '',
    website: rawPersonalInfo.website || '',
    linkedin: rawPersonalInfo.linkedin || '',
    github: rawPersonalInfo.github || '',
    portfolio: rawPersonalInfo.portfolio || rawPersonalInfo.website || '',
    photo: rawPersonalInfo.photo || rawPersonalInfo.photoUrl || '',
    photoUrl: rawPersonalInfo.photoUrl || rawPersonalInfo.photo || '',
    photoStyle: photoConfig.shape,
    photoConfig,
    summary,
    careerObjective,
    fatherName,
    motherName,
    dob,
    dateOfBirth,
    gender,
    maritalStatus,
    nationality,
    religion,
    bloodGroup,
    nid,
    presentAddress,
    permanentAddress,
  };

  const personalDetails = {
    ...rawPersonalDetails,
    fatherName,
    motherName,
    dob,
    dateOfBirth,
    gender,
    maritalStatus,
    nationality,
    religion,
    bloodGroup,
    nid,
    presentAddress,
    permanentAddress,
  };

  const experience = (Array.isArray(src.experience) ? src.experience : [])
    .filter((item) => item && typeof item === 'object')
    .map((exp, idx) => ({
      ...exp,
      id: exp.id || `exp-${idx}`,
      jobTitle: exp.jobTitle || exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: Boolean(exp.current),
      description: exp.description || '',
      visible: exp.visible !== false,
      highlights: Array.isArray(exp.highlights)
        ? exp.highlights.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
        : Array.isArray(exp.bullets)
          ? exp.bullets.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
          : toStringList(exp.highlights || exp.bullets),
    }));

  const internships = (Array.isArray(src.internships) ? src.internships : [])
    .filter((item) => item && typeof item === 'object')
    .map((intern, idx) => ({
      ...intern,
      id: intern.id || `intern-${idx}`,
      jobTitle: intern.jobTitle || intern.position || '',
      company: intern.company || '',
      location: intern.location || '',
      startDate: intern.startDate || '',
      endDate: intern.endDate || '',
      current: Boolean(intern.current),
      description: intern.description || '',
      visible: intern.visible !== false,
      highlights: Array.isArray(intern.highlights)
        ? intern.highlights.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
        : toStringList(intern.highlights),
    }));

  const education = (Array.isArray(src.education) ? src.education : [])
    .filter((item) => item && typeof item === 'object')
    .map((edu, idx) => ({
      ...edu,
      id: edu.id || `edu-${idx}`,
      institution: edu.institution || edu.school || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || edu.year || '',
      grade: edu.grade || edu.cgpa || '',
      description: edu.description || '',
      visible: edu.visible !== false,
      highlights: Array.isArray(edu.highlights)
        ? edu.highlights.filter((h) => typeof h === 'string' && h.trim())
        : toStringList(edu.highlights),
    }));

  const skills = (Array.isArray(src.skills) ? src.skills : [])
    .map((s, idx) => {
      if (typeof s === 'string') {
        const trimmed = s.trim();
        return trimmed ? { id: `skill-${idx}`, name: trimmed, level: 'Intermediate', category: 'General', visible: true } : null;
      }
      if (s && typeof s === 'object' && (s.name || s.title)) {
        return {
          ...s,
          id: s.id || `skill-${idx}`,
          name: String(s.name || s.title).trim(),
          level: s.level || 'Intermediate',
          category: s.category || 'General',
          visible: s.visible !== false,
        };
      }
      return null;
    })
    .filter(Boolean);

  const projects = (Array.isArray(src.projects) ? src.projects : [])
    .map((proj, idx) => {
      if (typeof proj === 'string') {
        const trimmed = proj.trim();
        return trimmed ? { id: `proj-${idx}`, name: trimmed, title: trimmed, technologies: [], visible: true } : null;
      }
      if (proj && typeof proj === 'object') {
        const techList = toStringList(proj.technologies || proj.techStack);
        return {
          ...proj,
          id: proj.id || `proj-${idx}`,
          name: proj.name || proj.title || '',
          title: proj.title || proj.name || '',
          description: proj.description || '',
          link: proj.link || proj.url || '',
          technologies: techList,
          visible: proj.visible !== false,
        };
      }
      return null;
    })
    .filter(Boolean);

  const certifications = (Array.isArray(src.certifications) ? src.certifications : [])
    .map((cert, idx) => {
      if (typeof cert === 'string') {
        const trimmed = cert.trim();
        return trimmed ? { id: `cert-${idx}`, name: trimmed, visible: true } : null;
      }
      if (cert && typeof cert === 'object') {
        return {
          ...cert,
          id: cert.id || `cert-${idx}`,
          name: cert.name || cert.title || '',
          issuer: cert.issuer || '',
          date: cert.date || cert.year || '',
          visible: cert.visible !== false,
        };
      }
      return null;
    })
    .filter(Boolean);

  const languages = (Array.isArray(src.languages) ? src.languages : [])
    .map((lang, idx) => {
      if (typeof lang === 'string') {
        const trimmed = lang.trim();
        return trimmed ? { id: `lang-${idx}`, name: trimmed, proficiency: '', visible: true } : null;
      }
      if (lang && typeof lang === 'object') {
        const name = String(lang.name || lang.language || '').trim();
        if (!name) return null;
        return {
          ...lang,
          id: lang.id || `lang-${idx}`,
          name,
          language: name,
          proficiency: lang.proficiency || lang.level || '',
          visible: lang.visible !== false,
        };
      }
      return null;
    })
    .filter(Boolean);

  const achievements = (Array.isArray(src.achievements) ? src.achievements : [])
    .filter((item) => item && typeof item === 'object')
    .map((ach, idx) => ({
      ...ach,
      id: ach.id || `ach-${idx}`,
      title: ach.title || ach.name || '',
      date: ach.date || ach.year || '',
      issuer: ach.issuer || '',
      description: ach.description || '',
      visible: ach.visible !== false,
    }));

  const volunteer = (Array.isArray(src.volunteer) ? src.volunteer : [])
    .filter((item) => item && typeof item === 'object')
    .map((vol, idx) => ({
      ...vol,
      id: vol.id || `vol-${idx}`,
      role: vol.role || vol.jobTitle || '',
      organization: vol.organization || vol.company || '',
      location: vol.location || '',
      startDate: vol.startDate || '',
      endDate: vol.endDate || '',
      current: Boolean(vol.current),
      description: vol.description || '',
      visible: vol.visible !== false,
      highlights: Array.isArray(vol.highlights)
        ? vol.highlights.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
        : toStringList(vol.highlights),
    }));

  const publications = (Array.isArray(src.publications) ? src.publications : [])
    .filter((item) => item && typeof item === 'object')
    .map((pub, idx) => ({
      ...pub,
      id: pub.id || `pub-${idx}`,
      title: pub.title || '',
      publisher: pub.publisher || '',
      date: pub.date || pub.year || '',
      url: pub.url || pub.link || '',
      description: pub.description || '',
      visible: pub.visible !== false,
    }));

  const references = (Array.isArray(src.references) ? src.references : [])
    .map((ref, idx) => {
      if (typeof ref === 'string') {
        const trimmed = ref.trim();
        return trimmed ? { id: `ref-${idx}`, name: trimmed, visible: true } : null;
      }
      if (ref && typeof ref === 'object') {
        return {
          ...ref,
          id: ref.id || `ref-${idx}`,
          name: ref.name || '',
          visible: ref.visible !== false,
        };
      }
      return null;
    })
    .filter(Boolean);

  const additionalInfo = (Array.isArray(src.additionalInfo) ? src.additionalInfo : [])
    .filter((item) => item && typeof item === 'object')
    .map((info, idx) => ({
      ...info,
      id: info.id || `add-${idx}`,
      title: info.title || '',
      description: info.description || '',
      visible: info.visible !== false,
    }));

  const interests = (Array.isArray(src.interests) ? src.interests : [])
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') return String(item.name || item.title || '').trim();
      return '';
    })
    .filter(Boolean);

  const customSections = (Array.isArray(src.customSections) ? src.customSections : [])
    .filter((sec) => sec && typeof sec === 'object')
    .map((sec, idx) => ({
      ...sec,
      id: sec.id || `custom-${idx}`,
      title: sec.title || sec.name || 'Additional Information',
      content: typeof sec.content === 'string' ? sec.content : '',
      visible: sec.visible !== false,
      items: (Array.isArray(sec.items) ? sec.items : [])
        .map((item, itemIdx) => {
          if (typeof item === 'string') {
            const trimmed = item.trim();
            return trimmed ? { id: `item-${idx}-${itemIdx}`, title: trimmed } : null;
          }
          if (item && typeof item === 'object') {
            return {
              ...item,
              id: item.id || `item-${idx}-${itemIdx}`,
            };
          }
          return null;
        })
        .filter(Boolean),
    }));

  const declaration =
    typeof src.declaration === 'string'
      ? { enabled: Boolean(src.declaration.trim()), text: src.declaration.trim(), signedBy: personalInfo.fullName || '' }
      : {
          ...toPlainObject(src.declaration),
        };

  // Section Configuration Normalization & Ordering
  const rawOrder = Array.isArray(rawDesign.sectionOrder) && rawDesign.sectionOrder.length > 0
    ? rawDesign.sectionOrder
    : DEFAULT_SECTION_CONFIG.map((s) => s.id);

  let sectionConfig = [];
  if (Array.isArray(src.sectionConfig) && src.sectionConfig.length > 0) {
    const seenIds = new Set();
    sectionConfig = src.sectionConfig
      .filter((s) => s && typeof s === 'object' && s.id)
      .map((s) => {
        seenIds.add(s.id);
        return {
          id: String(s.id),
          label: s.label || s.id,
          visible: s.visible !== false,
          column: s.column === 'sidebar' ? 'sidebar' : 'main',
        };
      });
    // Append any default sections not in sectionConfig
    DEFAULT_SECTION_CONFIG.forEach((def) => {
      if (!seenIds.has(def.id)) {
        sectionConfig.push({ ...def });
      }
    });
  } else {
    const seenIds = new Set();
    rawOrder.forEach((secId) => {
      const match = DEFAULT_SECTION_CONFIG.find((d) => d.id === secId);
      if (match) {
        seenIds.add(secId);
        sectionConfig.push({ ...match });
      } else {
        seenIds.add(secId);
        sectionConfig.push({
          id: secId,
          label: secId.startsWith('custom') ? 'Custom Section' : secId,
          visible: true,
          column: 'main',
        });
      }
    });
    DEFAULT_SECTION_CONFIG.forEach((def) => {
      if (!seenIds.has(def.id)) {
        sectionConfig.push({ ...def });
      }
    });
  }

  // Design Tokens Normalization
  const designTokens = {
    ...DEFAULT_DESIGN_TOKENS,
    ...rawDesignTokens,
    primaryColor: normalizeHexColor(rawDesignTokens.primaryColor || rawDesign.primaryColor || DEFAULT_DESIGN_TOKENS.primaryColor),
    accentColor: normalizeHexColor(rawDesignTokens.accentColor || rawDesign.accentColor || DEFAULT_DESIGN_TOKENS.accentColor),
    headingColor: normalizeHexColor(rawDesignTokens.headingColor || rawDesign.headingColor || rawDesign.textColor || DEFAULT_DESIGN_TOKENS.headingColor),
    bodyColor: normalizeHexColor(rawDesignTokens.bodyColor || rawDesign.textColor || rawDesign.bodyColor || DEFAULT_DESIGN_TOKENS.bodyColor),
    backgroundColor: normalizeHexColor(rawDesignTokens.backgroundColor || rawDesign.backgroundColor || DEFAULT_DESIGN_TOKENS.backgroundColor),
    sidebarBgColor: normalizeHexColor(rawDesignTokens.sidebarBgColor || rawDesign.sidebarBgColor || DEFAULT_DESIGN_TOKENS.sidebarBgColor),
    dividerColor: normalizeHexColor(rawDesignTokens.dividerColor || rawDesign.dividerColor || DEFAULT_DESIGN_TOKENS.dividerColor),
    badgeBgColor: normalizeHexColor(rawDesignTokens.badgeBgColor || rawDesign.badgeBgColor || DEFAULT_DESIGN_TOKENS.badgeBgColor),
    fontHeading: rawDesignTokens.fontHeading || rawDesign.fontFamily || DEFAULT_DESIGN_TOKENS.fontHeading,
    fontBody: rawDesignTokens.fontBody || rawDesign.fontFamily || DEFAULT_DESIGN_TOKENS.fontBody,
    baseFontSize: rawDesignTokens.baseFontSize || (rawDesign.fontSize === 'small' ? '12px' : rawDesign.fontSize === 'large' ? '16px' : DEFAULT_DESIGN_TOKENS.baseFontSize),
    lineHeight: typeof rawDesignTokens.lineHeight === 'number' ? rawDesignTokens.lineHeight : DEFAULT_DESIGN_TOKENS.lineHeight,
    letterSpacing: rawDesignTokens.letterSpacing || DEFAULT_DESIGN_TOKENS.letterSpacing,
    paragraphSpacing: rawDesignTokens.paragraphSpacing || DEFAULT_DESIGN_TOKENS.paragraphSpacing,
    pageMargin: rawDesignTokens.pageMargin || DEFAULT_DESIGN_TOKENS.pageMargin,
    sectionSpacing: rawDesignTokens.sectionSpacing || DEFAULT_DESIGN_TOKENS.sectionSpacing,
    columnRatio: rawDesignTokens.columnRatio || rawDesign.columnRatio || DEFAULT_DESIGN_TOKENS.columnRatio,
    dividerThickness: rawDesignTokens.dividerThickness || DEFAULT_DESIGN_TOKENS.dividerThickness,
  };

  const design = {
    ...rawDesign,
    primaryColor: designTokens.primaryColor,
    accentColor: designTokens.accentColor,
    textColor: designTokens.bodyColor,
    backgroundColor: designTokens.backgroundColor,
    fontFamily: designTokens.fontHeading,
    columnRatio: designTokens.columnRatio,
    pageSize: rawDesign.pageSize === 'Letter' ? 'Letter' : 'A4',
    sectionOrder: sectionConfig.filter((s) => s.visible !== false).map((s) => s.id),
  };

  const elementOverrides = toPlainObject(src.elementOverrides);

  const customElements = (Array.isArray(src.customElements) ? src.customElements : [])
    .filter((el) => el && typeof el === 'object')
    .map((el, idx) => ({
      id: el.id || `ce-${idx}`,
      type: ['text', 'divider', 'badge'].includes(el.type) ? el.type : 'text',
      content: el.content || '',
      sectionAnchor: el.sectionAnchor || null,
      style: toPlainObject(el.style),
    }));

  return {
    ...src,
    profileType: src.profileType || 'student',
    summary,
    careerObjective,
    personalInfo,
    personalDetails,
    design,
    designTokens,
    sectionConfig,
    elementOverrides,
    customElements,
    experience,
    internships,
    education,
    skills,
    projects,
    certifications,
    languages,
    achievements,
    volunteer,
    publications,
    references,
    additionalInfo,
    interests,
    customSections,
    declaration,
  };
};

const TRANSIENT_CV_KEYS = [
  '_id',
  'id',
  'userId',
  'isExportUnlocked',
  'unlockType',
  'unlockedAt',
  'pdfExportCount',
  'docxExportCount',
  'lastExportedAt',
  'isDeleted',
  'deletedAt',
  'version',
  'createdAt',
  'updatedAt',
  '__v',
];

/**
 * Strips persistence/unlock metadata when cloning a template preview or wizard draft
 * so it never accidentally inherits another CV's MongoDB `_id` or entitlement state.
 */
export const stripTransientCvMeta = (cvData = {}) => {
  if (!cvData || typeof cvData !== 'object') return {};
  const clone = { ...cvData };
  TRANSIENT_CV_KEYS.forEach((key) => {
    delete clone[key];
  });
  return clone;
};

/**
 * Checks whether a CV payload contains enough meaningful content to save/export.
 */
export const hasExportableCvContent = (cvData) => {
  if (!cvData || typeof cvData !== 'object') return false;
  const norm = normalizeCvData(cvData);
  const p = norm.personalInfo || {};
  if (p.fullName || p.email || p.phone || p.jobTitle || p.summary || norm.summary || norm.careerObjective) return true;
  if (
    norm.experience.length > 0 ||
    norm.internships.length > 0 ||
    norm.education.length > 0 ||
    norm.skills.length > 0 ||
    norm.projects.length > 0 ||
    norm.certifications.length > 0 ||
    norm.languages.length > 0 ||
    norm.achievements.length > 0 ||
    norm.volunteer.length > 0 ||
    norm.publications.length > 0 ||
    norm.references.length > 0 ||
    norm.additionalInfo.length > 0 ||
    norm.customSections.length > 0
  ) {
    return true;
  }
  return false;
};

/**
 * Detects whether CV text contains Bangla / Bengali characters (range \u0980-\u09FF).
 */
export const containsBanglaText = (data) => {
  if (!data) return false;
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return /[\u0980-\u09FF]/.test(str);
  } catch (_) {
    return false;
  }
};

/**
 * Returns Google Fonts CSS URL containing all supported typography presets:
 * Inter, JetBrains Mono, Lora, Merriweather, Outfit, Plus Jakarta Sans, Poppins.
 * If Bangla text or a Bangladesh template is present, Hind Siliguri and Noto Sans Bengali are included.
 */
export const getGoogleFontsUrl = (cvData) => {
  const isBangla =
    containsBanglaText(cvData) ||
    String(cvData?.templateId || '').includes('bd') ||
    String(cvData?.templateId || '').includes('bangladesh') ||
    cvData?.category === 'Bangladesh Standards (BD)';

  const families = [
    'family=Inter:wght@300;400;500;600;700;800',
    'family=JetBrains+Mono:wght@400;500;600;700',
    'family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400',
    'family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400',
    'family=Outfit:wght@400;500;600;700',
    'family=Plus+Jakarta+Sans:wght@400;500;600;700;800',
    'family=Poppins:wght@300;400;500;600;700',
  ];

  if (isBangla) {
    families.push('family=Hind+Siliguri:wght@300;400;500;600;700');
    families.push('family=Noto+Sans+Bengali:wght@400;500;600;700');
  }

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
};

/**
 * Formats CSS font-family safely without quoting multi-font fallback stacks,
 * appending Bengali fallbacks if Bangla text or Bangladesh standard is present.
 */
export const formatFontStack = (rawFontFamily, isBangla = false) => {
  const cleaned = String(rawFontFamily || 'Inter').trim();
  const banglaFallbacks = isBangla ? ", 'Hind Siliguri', 'Noto Sans Bengali'" : '';
  if (!cleaned) {
    return `'Inter'${banglaFallbacks}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
  }
  if (cleaned.includes(',')) {
    return `${cleaned}${banglaFallbacks}`;
  }
  return `'${cleaned}'${banglaFallbacks}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
};
