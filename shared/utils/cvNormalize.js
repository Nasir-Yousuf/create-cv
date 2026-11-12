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

const VALID_PHOTO_STYLES = new Set(['circle', 'square', 'rounded', 'portrait']);

/**
 * Coerces arbitrary CV payloads into clean, crash-free canonical structures without deleting user text.
 */
export const normalizeCvData = (raw = {}) => {
  const src = raw && typeof raw === 'object' ? raw : {};
  const rawPersonalInfo = toPlainObject(src.personalInfo);
  const rawPersonalDetails = toPlainObject(src.personalDetails);
  const rawDesign = toPlainObject(src.design);

  const normalizedPhotoStyle = VALID_PHOTO_STYLES.has(rawPersonalInfo.photoStyle)
    ? rawPersonalInfo.photoStyle
    : 'circle';

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
      highlights: Array.isArray(exp.highlights)
        ? exp.highlights.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
        : Array.isArray(exp.bullets)
          ? exp.bullets.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
          : toStringList(exp.highlights || exp.bullets),
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
      highlights: Array.isArray(edu.highlights)
        ? edu.highlights.filter((h) => typeof h === 'string' && h.trim())
        : toStringList(edu.highlights),
    }));

  const skills = (Array.isArray(src.skills) ? src.skills : [])
    .map((s, idx) => {
      if (typeof s === 'string') {
        const trimmed = s.trim();
        return trimmed ? { id: `skill-${idx}`, name: trimmed, level: 'Intermediate', category: 'General' } : null;
      }
      if (s && typeof s === 'object' && (s.name || s.title)) {
        return {
          ...s,
          id: s.id || `skill-${idx}`,
          name: String(s.name || s.title).trim(),
          level: s.level || 'Intermediate',
          category: s.category || 'General',
        };
      }
      return null;
    })
    .filter(Boolean);

  const projects = (Array.isArray(src.projects) ? src.projects : [])
    .map((proj, idx) => {
      if (typeof proj === 'string') {
        const trimmed = proj.trim();
        return trimmed ? { id: `proj-${idx}`, name: trimmed, title: trimmed, technologies: [] } : null;
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
        };
      }
      return null;
    })
    .filter(Boolean);

  const certifications = (Array.isArray(src.certifications) ? src.certifications : [])
    .map((cert, idx) => {
      if (typeof cert === 'string') {
        const trimmed = cert.trim();
        return trimmed ? { id: `cert-${idx}`, name: trimmed } : null;
      }
      if (cert && typeof cert === 'object') {
        return {
          ...cert,
          id: cert.id || `cert-${idx}`,
          name: cert.name || cert.title || '',
          issuer: cert.issuer || '',
          date: cert.date || cert.year || '',
        };
      }
      return null;
    })
    .filter(Boolean);

  const languages = (Array.isArray(src.languages) ? src.languages : [])
    .map((lang, idx) => {
      if (typeof lang === 'string') {
        const trimmed = lang.trim();
        return trimmed ? { id: `lang-${idx}`, name: trimmed, proficiency: '' } : null;
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
        };
      }
      return null;
    })
    .filter(Boolean);

  const references = (Array.isArray(src.references) ? src.references : [])
    .map((ref, idx) => {
      if (typeof ref === 'string') {
        const trimmed = ref.trim();
        return trimmed ? { id: `ref-${idx}`, name: trimmed } : null;
      }
      if (ref && typeof ref === 'object') {
        return {
          ...ref,
          id: ref.id || `ref-${idx}`,
          name: ref.name || '',
        };
      }
      return null;
    })
    .filter(Boolean);

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
      items: (Array.isArray(sec.items) ? sec.items : [])
        .map((item) => {
          if (typeof item === 'string') {
            const trimmed = item.trim();
            return trimmed ? { title: trimmed } : null;
          }
          if (item && typeof item === 'object') return item;
          return null;
        })
        .filter(Boolean),
    }));

  const declaration =
    typeof src.declaration === 'string'
      ? { enabled: Boolean(src.declaration.trim()), text: src.declaration.trim(), signedBy: rawPersonalInfo.fullName || '' }
      : {
          ...toPlainObject(src.declaration),
        };

  return {
    ...src,
    personalInfo: {
      ...rawPersonalInfo,
      photoStyle: normalizedPhotoStyle,
    },
    personalDetails: {
      ...rawPersonalDetails,
      dateOfBirth: rawPersonalDetails.dateOfBirth || rawPersonalDetails.dob || '',
      dob: rawPersonalDetails.dob || rawPersonalDetails.dateOfBirth || '',
    },
    design: {
      ...rawDesign,
      ...(rawDesign.primaryColor ? { primaryColor: normalizeHexColor(rawDesign.primaryColor, '#2563EB') } : {}),
      ...(rawDesign.accentColor ? { accentColor: normalizeHexColor(rawDesign.accentColor, '#38BDF8') } : {}),
      pageSize: rawDesign.pageSize === 'Letter' ? 'Letter' : 'A4',
    },
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    references,
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
  if (p.fullName || p.email || p.phone || p.jobTitle || p.summary) return true;
  if (
    norm.experience.length > 0 ||
    norm.education.length > 0 ||
    norm.skills.length > 0 ||
    norm.projects.length > 0 ||
    norm.certifications.length > 0 ||
    norm.languages.length > 0 ||
    norm.references.length > 0 ||
    norm.customSections.length > 0
  ) {
    return true;
  }
  return false;
};
