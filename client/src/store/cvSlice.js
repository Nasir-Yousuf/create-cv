import { createSlice } from '@reduxjs/toolkit';
import {
  INITIAL_CV_DATA,
  resolveTemplateId,
  resolveTemplateMeta,
  TEMPLATE_ALIAS_COLORS,
} from '@shared/constants/cvDefaults.js';
import {
  normalizeCvData,
  DEFAULT_DESIGN_TOKENS,
  DEFAULT_SECTION_CONFIG,
} from '@shared/utils/cvNormalize.js';

const MAX_HISTORY = 40;

/**
 * Normalizes loaded CV data with safe backward-compatible defaults.
 */
const normalizeLoadedCV = (raw = {}) => {
  const rawTemplateId = raw?.templateId || INITIAL_CV_DATA.templateId;
  const canonicalId = resolveTemplateId(rawTemplateId);
  const aliasColors = canonicalId !== rawTemplateId ? TEMPLATE_ALIAS_COLORS[rawTemplateId] || {} : {};

  return normalizeCvData({
    ...INITIAL_CV_DATA,
    ...raw,
    templateId: canonicalId,
    design: {
      ...INITIAL_CV_DATA.design,
      ...aliasColors,
      ...(raw.design || {}),
    },
  });
};

const loadInitialDraft = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('resumecraft_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
          return normalizeLoadedCV(parsed);
        }
      }
    }
  } catch (err) {
    console.warn('Could not restore draft from localStorage:', err);
  }
  return normalizeLoadedCV(INITIAL_CV_DATA);
};

const initialState = {
  currentCV: loadInitialDraft(),
  past: [], // max 40 snapshots for undo
  future: [], // redo stack
  cvId: null,
  version: 1,
  isExportUnlocked: false,
  unlockType: null,
  isDirty: false,
  saveStatus: 'saved', // 'saved' | 'saving' | 'unsaved' | 'error'
  isAutosaving: false,
  lastSavedAt: null,
};

const pushHistory = (state) => {
  state.past.push(JSON.parse(JSON.stringify(state.currentCV)));
  if (state.past.length > MAX_HISTORY) {
    state.past.shift();
  }
  state.future = []; // Clear redo stack on new user mutation
  state.isDirty = true;
  state.saveStatus = 'unsaved';
};

export const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVData: (state, action) => {
      const payload = action.payload || {};
      state.currentCV = normalizeLoadedCV(payload);
      if (payload._id) state.cvId = payload._id;
      if (payload.version !== undefined) state.version = payload.version;
      if (payload.isExportUnlocked !== undefined) {
        state.isExportUnlocked = Boolean(payload.isExportUnlocked);
      }
      if (payload.unlockType !== undefined) {
        state.unlockType = payload.unlockType || null;
      }
      state.past = [];
      state.future = [];
      state.isDirty = false;
      state.saveStatus = 'saved';
    },
    setCVId: (state, action) => {
      state.cvId = action.payload;
    },
    setCVSyncMeta: (state, action) => {
      const { cvId, version, isExportUnlocked, unlockType } = action.payload || {};
      if (cvId !== undefined) state.cvId = cvId;
      if (version !== undefined) state.version = version;
      if (isExportUnlocked !== undefined) state.isExportUnlocked = Boolean(isExportUnlocked);
      if (unlockType !== undefined) state.unlockType = unlockType;
    },
    markExportUnlocked: (state, action) => {
      state.isExportUnlocked = true;
      state.unlockType = action.payload || state.unlockType || 'free';
    },
    updateTitle: (state, action) => {
      pushHistory(state);
      state.currentCV.title = action.payload;
    },

    // Personal Info & BD Fields
    updatePersonalInfo: (state, action) => {
      pushHistory(state);
      const updated = {
        ...state.currentCV.personalInfo,
        ...action.payload,
      };
      // Keep photoUrl and photo in sync
      if (action.payload?.photoUrl !== undefined) {
        updated.photo = action.payload.photoUrl;
      } else if (action.payload?.photo !== undefined) {
        updated.photoUrl = action.payload.photo;
      }
      // Keep photoConfig shape and photoStyle in sync
      if (action.payload?.photoConfig?.shape) {
        updated.photoStyle = action.payload.photoConfig.shape;
      } else if (action.payload?.photoStyle) {
        updated.photoConfig = {
          ...(updated.photoConfig || {}),
          shape: action.payload.photoStyle,
        };
      }
      state.currentCV.personalInfo = updated;

      // Sync summary and careerObjective to root
      if (action.payload?.summary !== undefined) {
        state.currentCV.summary = action.payload.summary;
      }
      if (action.payload?.careerObjective !== undefined) {
        state.currentCV.careerObjective = action.payload.careerObjective;
      }

      // Sync BD fields with personalDetails
      const bdFields = [
        'fatherName',
        'motherName',
        'dob',
        'dateOfBirth',
        'nationality',
        'nid',
        'religion',
        'maritalStatus',
        'permanentAddress',
        'bloodGroup',
        'gender',
        'presentAddress',
      ];
      bdFields.forEach((key) => {
        if (action.payload?.[key] !== undefined) {
          state.currentCV.personalDetails[key] = action.payload[key];
        }
      });
    },

    updatePersonalDetails: (state, action) => {
      pushHistory(state);
      state.currentCV.personalDetails = {
        ...state.currentCV.personalDetails,
        ...action.payload,
      };
      // Mirror to personalInfo
      Object.entries(action.payload || {}).forEach(([k, v]) => {
        state.currentCV.personalInfo[k] = v;
      });
    },

    updateSummary: (state, action) => {
      pushHistory(state);
      const text = String(action.payload || '');
      state.currentCV.summary = text;
      state.currentCV.personalInfo.summary = text;
    },

    updateCareerObjective: (state, action) => {
      pushHistory(state);
      const text = String(action.payload || '');
      state.currentCV.careerObjective = text;
      state.currentCV.personalInfo.careerObjective = text;
    },

    updateDeclaration: (state, action) => {
      pushHistory(state);
      state.currentCV.declaration = {
        ...state.currentCV.declaration,
        ...action.payload,
      };
    },

    // Design & Tokens (Mode A + Mode B sync)
    updateDesign: (state, action) => {
      pushHistory(state);
      state.currentCV.design = {
        ...state.currentCV.design,
        ...action.payload,
      };
      // Synchronize designTokens
      if (action.payload.primaryColor) {
        state.currentCV.designTokens.primaryColor = action.payload.primaryColor;
      }
      if (action.payload.accentColor) {
        state.currentCV.designTokens.accentColor = action.payload.accentColor;
      }
      if (action.payload.textColor) {
        state.currentCV.designTokens.bodyColor = action.payload.textColor;
      }
      if (action.payload.backgroundColor) {
        state.currentCV.designTokens.backgroundColor = action.payload.backgroundColor;
      }
      if (action.payload.fontFamily) {
        state.currentCV.designTokens.fontHeading = action.payload.fontFamily;
        state.currentCV.designTokens.fontBody = action.payload.fontFamily;
      }
    },

    updateDesignTokens: (state, action) => {
      pushHistory(state);
      state.currentCV.designTokens = {
        ...state.currentCV.designTokens,
        ...action.payload,
      };
      // Synchronize design
      if (action.payload.primaryColor) {
        state.currentCV.design.primaryColor = action.payload.primaryColor;
      }
      if (action.payload.accentColor) {
        state.currentCV.design.accentColor = action.payload.accentColor;
      }
      if (action.payload.bodyColor) {
        state.currentCV.design.textColor = action.payload.bodyColor;
      }
      if (action.payload.backgroundColor) {
        state.currentCV.design.backgroundColor = action.payload.backgroundColor;
      }
      if (action.payload.fontHeading) {
        state.currentCV.design.fontFamily = action.payload.fontHeading;
      }
    },

    resetDesignToTemplateDefaults: (state) => {
      pushHistory(state);
      const templateId = state.currentCV.templateId || 'onepage-fresher-clean';
      const meta = resolveTemplateMeta(templateId);
      const aliasColors = TEMPLATE_ALIAS_COLORS[templateId] || {};

      const basePrimary = (
        aliasColors.primaryColor ||
        meta?.primaryColor ||
        DEFAULT_DESIGN_TOKENS.primaryColor
      ).toUpperCase();
      const baseAccent = (
        aliasColors.accentColor ||
        meta?.accentColor ||
        DEFAULT_DESIGN_TOKENS.accentColor
      ).toUpperCase();
      const baseFont = aliasColors.fontFamily || meta?.fontFamily || DEFAULT_DESIGN_TOKENS.fontHeading;

      state.currentCV.designTokens = {
        ...DEFAULT_DESIGN_TOKENS,
        primaryColor: basePrimary,
        accentColor: baseAccent,
        fontHeading: baseFont,
        fontBody: baseFont,
      };

      state.currentCV.design = {
        ...state.currentCV.design,
        primaryColor: basePrimary,
        accentColor: baseAccent,
        textColor: DEFAULT_DESIGN_TOKENS.bodyColor,
        backgroundColor: DEFAULT_DESIGN_TOKENS.backgroundColor,
        fontFamily: baseFont,
      };

      state.currentCV.elementOverrides = {};
    },

    setTemplateId: (state, action) => {
      pushHistory(state);
      const rawId = action.payload;
      const canonicalId = resolveTemplateId(rawId);
      const meta = resolveTemplateMeta(rawId);
      state.currentCV.templateId = canonicalId;
      if (meta?.isOnePage !== undefined) {
        state.currentCV.isOnePage = Boolean(meta.isOnePage);
        state.currentCV.category = meta.isOnePage ? 'One-Page CVs' : 'Multiple-Page CVs';
      }
      if (canonicalId !== rawId && TEMPLATE_ALIAS_COLORS[rawId]) {
        state.currentCV.design = {
          ...state.currentCV.design,
          ...TEMPLATE_ALIAS_COLORS[rawId],
        };
        if (TEMPLATE_ALIAS_COLORS[rawId].primaryColor) {
          state.currentCV.designTokens.primaryColor = TEMPLATE_ALIAS_COLORS[rawId].primaryColor;
        }
        if (TEMPLATE_ALIAS_COLORS[rawId].accentColor) {
          state.currentCV.designTokens.accentColor = TEMPLATE_ALIAS_COLORS[rawId].accentColor;
        }
      }
    },

    // Mode B: Element Overrides & Custom Elements
    setElementOverride: (state, action) => {
      const path = action.payload?.path;
      const override = action.payload?.override || action.payload?.overrides || {};
      if (path) {
        pushHistory(state);
        if (!state.currentCV.elementOverrides) {
          state.currentCV.elementOverrides = {};
        }
        state.currentCV.elementOverrides[path] = {
          ...(state.currentCV.elementOverrides[path] || {}),
          ...override,
        };
      }
    },
    removeElementOverride: (state, action) => {
      const path = action.payload;
      if (path && state.currentCV.elementOverrides?.[path]) {
        pushHistory(state);
        delete state.currentCV.elementOverrides[path];
      }
    },
    clearAllElementOverrides: (state) => {
      pushHistory(state);
      state.currentCV.elementOverrides = {};
    },

    addCustomElement: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.customElements)) {
        state.currentCV.customElements = [];
      }
      const newElem = action.payload || {
        id: `ce-${Date.now()}`,
        type: 'text',
        content: 'Custom text element',
        sectionAnchor: null,
        style: {},
      };
      state.currentCV.customElements.push(newElem);
    },
    updateCustomElement: (state, action) => {
      const { id, changes } = action.payload || {};
      if (!Array.isArray(state.currentCV.customElements)) return;
      const elem = state.currentCV.customElements.find((e) => e.id === id);
      if (elem) {
        pushHistory(state);
        Object.assign(elem, changes);
      }
    },
    removeCustomElement: (state, action) => {
      const id = action.payload;
      if (Array.isArray(state.currentCV.customElements)) {
        pushHistory(state);
        state.currentCV.customElements = state.currentCV.customElements.filter((e) => e.id !== id);
      }
    },

    // Section Configuration (Ordering, Visibility, Column Placement)
    setSectionConfig: (state, action) => {
      pushHistory(state);
      state.currentCV.sectionConfig = action.payload;
      state.currentCV.design.sectionOrder = action.payload
        .filter((s) => s.visible !== false)
        .map((s) => s.id);
    },
    updateSectionConfigItem: (state, action) => {
      const payload = action.payload || {};
      const id = payload.id;
      const changes = payload.changes || (({ id: _id, ...rest }) => rest)(payload);
      const item = state.currentCV.sectionConfig?.find((s) => s.id === id);
      if (item) {
        pushHistory(state);
        Object.assign(item, changes);
        state.currentCV.design.sectionOrder = state.currentCV.sectionConfig
          .filter((s) => s.visible !== false)
          .map((s) => s.id);
      }
    },
    toggleSectionVisibility: (state, action) => {
      const id = action.payload;
      const item = state.currentCV.sectionConfig.find((s) => s.id === id);
      if (item) {
        pushHistory(state);
        item.visible = !item.visible;
        state.currentCV.design.sectionOrder = state.currentCV.sectionConfig
          .filter((s) => s.visible !== false)
          .map((s) => s.id);
      }
    },
    reorderSections: (state, action) => {
      pushHistory(state);
      if (Array.isArray(action.payload)) {
        state.currentCV.design.sectionOrder = action.payload;
        // Reorder sectionConfig to match
        const seenIds = new Set(action.payload);
        const reordered = [];
        action.payload.forEach((id) => {
          const found = state.currentCV.sectionConfig.find((s) => s.id === id);
          if (found) reordered.push(found);
        });
        state.currentCV.sectionConfig.forEach((s) => {
          if (!seenIds.has(s.id)) reordered.push(s);
        });
        state.currentCV.sectionConfig = reordered;
      } else {
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.design.sectionOrder.splice(sourceIndex, 1);
        state.currentCV.design.sectionOrder.splice(destinationIndex, 0, removed);
      }
    },

    // Undo / Redo
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop();
        state.future.unshift(JSON.parse(JSON.stringify(state.currentCV)));
        state.currentCV = previous;
        state.isDirty = true;
        state.saveStatus = 'unsaved';
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.shift();
        state.past.push(JSON.parse(JSON.stringify(state.currentCV)));
        state.currentCV = next;
        state.isDirty = true;
        state.saveStatus = 'unsaved';
      }
    },

    // Experience Actions
    addExperience: (state, action) => {
      pushHistory(state);
      const newExp = action.payload || {
        id: `exp-${Date.now()}`,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        highlights: [''],
        visible: true,
      };
      state.currentCV.experience.unshift(newExp);
    },
    updateExperience: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.experience[index]) {
        pushHistory(state);
        state.currentCV.experience[index] = {
          ...state.currentCV.experience[index],
          ...data,
        };
      }
    },
    removeExperience: (state, action) => {
      pushHistory(state);
      state.currentCV.experience.splice(action.payload, 1);
    },
    reorderExperience: (state, action) => {
      pushHistory(state);
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.experience.splice(sourceIndex, 1);
      state.currentCV.experience.splice(destinationIndex, 0, removed);
    },

    // Internships Actions
    addInternship: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.internships)) {
        state.currentCV.internships = [];
      }
      const newIntern = action.payload || {
        id: `intern-${Date.now()}`,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        highlights: [''],
        visible: true,
      };
      state.currentCV.internships.unshift(newIntern);
    },
    updateInternship: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.internships && state.currentCV.internships[index]) {
        pushHistory(state);
        state.currentCV.internships[index] = {
          ...state.currentCV.internships[index],
          ...data,
        };
      }
    },
    removeInternship: (state, action) => {
      if (Array.isArray(state.currentCV.internships)) {
        pushHistory(state);
        state.currentCV.internships.splice(action.payload, 1);
      }
    },
    reorderInternships: (state, action) => {
      if (Array.isArray(state.currentCV.internships)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.internships.splice(sourceIndex, 1);
        state.currentCV.internships.splice(destinationIndex, 0, removed);
      }
    },

    // Education Actions
    addEducation: (state, action) => {
      pushHistory(state);
      const newEdu = action.payload || {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
        visible: true,
      };
      state.currentCV.education.unshift(newEdu);
    },
    updateEducation: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.education[index]) {
        pushHistory(state);
        state.currentCV.education[index] = {
          ...state.currentCV.education[index],
          ...data,
        };
      }
    },
    removeEducation: (state, action) => {
      pushHistory(state);
      state.currentCV.education.splice(action.payload, 1);
    },
    reorderEducation: (state, action) => {
      pushHistory(state);
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.education.splice(sourceIndex, 1);
      state.currentCV.education.splice(destinationIndex, 0, removed);
    },

    // Skills Actions
    addSkill: (state, action) => {
      pushHistory(state);
      const newSkill = action.payload || {
        id: `skill-${Date.now()}`,
        name: '',
        level: 'Advanced',
        category: 'General',
        visible: true,
      };
      state.currentCV.skills.push(newSkill);
    },
    updateSkill: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.skills[index]) {
        pushHistory(state);
        state.currentCV.skills[index] = {
          ...state.currentCV.skills[index],
          ...data,
        };
      }
    },
    removeSkill: (state, action) => {
      pushHistory(state);
      state.currentCV.skills.splice(action.payload, 1);
    },
    reorderSkills: (state, action) => {
      pushHistory(state);
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.skills.splice(sourceIndex, 1);
      state.currentCV.skills.splice(destinationIndex, 0, removed);
    },

    // Projects Actions
    addProject: (state, action) => {
      pushHistory(state);
      const newProj = action.payload || {
        id: `proj-${Date.now()}`,
        title: '',
        link: '',
        github: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: [],
        visible: true,
      };
      state.currentCV.projects.unshift(newProj);
    },
    updateProject: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.projects[index]) {
        pushHistory(state);
        state.currentCV.projects[index] = {
          ...state.currentCV.projects[index],
          ...data,
        };
      }
    },
    removeProject: (state, action) => {
      pushHistory(state);
      state.currentCV.projects.splice(action.payload, 1);
    },
    reorderProjects: (state, action) => {
      pushHistory(state);
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.projects.splice(sourceIndex, 1);
      state.currentCV.projects.splice(destinationIndex, 0, removed);
    },

    // Certifications Actions
    addCertification: (state, action) => {
      pushHistory(state);
      const newCert = action.payload || {
        id: `cert-${Date.now()}`,
        name: '',
        issuer: '',
        date: '',
        link: '',
        visible: true,
      };
      state.currentCV.certifications.push(newCert);
    },
    updateCertification: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.certifications[index]) {
        pushHistory(state);
        state.currentCV.certifications[index] = {
          ...state.currentCV.certifications[index],
          ...data,
        };
      }
    },
    removeCertification: (state, action) => {
      pushHistory(state);
      state.currentCV.certifications.splice(action.payload, 1);
    },
    reorderCertifications: (state, action) => {
      pushHistory(state);
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.certifications.splice(sourceIndex, 1);
      state.currentCV.certifications.splice(destinationIndex, 0, removed);
    },

    // Languages Actions
    addLanguage: (state, action) => {
      pushHistory(state);
      const newLang = action.payload || {
        id: `lang-${Date.now()}`,
        language: '',
        proficiency: 'Fluent',
        visible: true,
      };
      state.currentCV.languages.push(newLang);
    },
    updateLanguage: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.languages[index]) {
        pushHistory(state);
        state.currentCV.languages[index] = {
          ...state.currentCV.languages[index],
          ...data,
        };
      }
    },
    removeLanguage: (state, action) => {
      pushHistory(state);
      state.currentCV.languages.splice(action.payload, 1);
    },

    // Achievements Actions
    addAchievement: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.achievements)) {
        state.currentCV.achievements = [];
      }
      const newAch = action.payload || {
        id: `ach-${Date.now()}`,
        title: '',
        date: '',
        issuer: '',
        description: '',
        visible: true,
      };
      state.currentCV.achievements.push(newAch);
    },
    updateAchievement: (state, action) => {
      const { index, data } = action.payload;
      if (Array.isArray(state.currentCV.achievements) && state.currentCV.achievements[index]) {
        pushHistory(state);
        state.currentCV.achievements[index] = {
          ...state.currentCV.achievements[index],
          ...data,
        };
      }
    },
    removeAchievement: (state, action) => {
      if (Array.isArray(state.currentCV.achievements)) {
        pushHistory(state);
        state.currentCV.achievements.splice(action.payload, 1);
      }
    },

    // Volunteer Actions
    addVolunteer: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.volunteer)) {
        state.currentCV.volunteer = [];
      }
      const newVol = action.payload || {
        id: `vol-${Date.now()}`,
        role: '',
        organization: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        highlights: [''],
        visible: true,
      };
      state.currentCV.volunteer.push(newVol);
    },
    updateVolunteer: (state, action) => {
      const { index, data } = action.payload;
      if (Array.isArray(state.currentCV.volunteer) && state.currentCV.volunteer[index]) {
        pushHistory(state);
        state.currentCV.volunteer[index] = {
          ...state.currentCV.volunteer[index],
          ...data,
        };
      }
    },
    removeVolunteer: (state, action) => {
      if (Array.isArray(state.currentCV.volunteer)) {
        pushHistory(state);
        state.currentCV.volunteer.splice(action.payload, 1);
      }
    },

    // Publications Actions
    addPublication: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.publications)) {
        state.currentCV.publications = [];
      }
      const newPub = action.payload || {
        id: `pub-${Date.now()}`,
        title: '',
        publisher: '',
        date: '',
        url: '',
        description: '',
        visible: true,
      };
      state.currentCV.publications.push(newPub);
    },
    updatePublication: (state, action) => {
      const { index, data } = action.payload;
      if (Array.isArray(state.currentCV.publications) && state.currentCV.publications[index]) {
        pushHistory(state);
        state.currentCV.publications[index] = {
          ...state.currentCV.publications[index],
          ...data,
        };
      }
    },
    removePublication: (state, action) => {
      if (Array.isArray(state.currentCV.publications)) {
        pushHistory(state);
        state.currentCV.publications.splice(action.payload, 1);
      }
    },

    // References Actions
    addReference: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.references)) {
        state.currentCV.references = [];
      }
      const newRef = action.payload || {
        id: `ref-${Date.now()}`,
        name: '',
        designation: '',
        company: '',
        phone: '',
        email: '',
        visible: true,
      };
      state.currentCV.references.push(newRef);
    },
    updateReference: (state, action) => {
      const { index, data } = action.payload;
      if (!Array.isArray(state.currentCV.references)) {
        state.currentCV.references = [];
      }
      if (state.currentCV.references[index]) {
        pushHistory(state);
        state.currentCV.references[index] = {
          ...state.currentCV.references[index],
          ...data,
        };
      }
    },
    removeReference: (state, action) => {
      pushHistory(state);
      if (Array.isArray(state.currentCV.references)) {
        state.currentCV.references.splice(action.payload, 1);
      }
    },
    reorderReferences: (state, action) => {
      pushHistory(state);
      if (Array.isArray(state.currentCV.references)) {
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.references.splice(sourceIndex, 1);
        state.currentCV.references.splice(destinationIndex, 0, removed);
      }
    },

    // Additional Info Actions
    addAdditionalInfo: (state, action) => {
      pushHistory(state);
      if (!Array.isArray(state.currentCV.additionalInfo)) {
        state.currentCV.additionalInfo = [];
      }
      const newInfo = action.payload || {
        id: `add-${Date.now()}`,
        title: '',
        description: '',
        visible: true,
      };
      state.currentCV.additionalInfo.push(newInfo);
    },
    updateAdditionalInfo: (state, action) => {
      const { index, data } = action.payload;
      if (Array.isArray(state.currentCV.additionalInfo) && state.currentCV.additionalInfo[index]) {
        pushHistory(state);
        state.currentCV.additionalInfo[index] = {
          ...state.currentCV.additionalInfo[index],
          ...data,
        };
      }
    },
    removeAdditionalInfo: (state, action) => {
      if (Array.isArray(state.currentCV.additionalInfo)) {
        pushHistory(state);
        state.currentCV.additionalInfo.splice(action.payload, 1);
      }
    },

    // Custom Sections
    addCustomSection: (state, action) => {
      pushHistory(state);
      const sectionId = `custom-${Date.now()}`;
      const title = action.payload?.title || 'Additional Information';
      state.currentCV.customSections.push({
        id: sectionId,
        title,
        visible: true,
        items: [
          {
            id: `item-${Date.now()}`,
            title: 'Sample Item Title',
            subtitle: 'Organization / Issuer',
            date: '2023',
            description: 'Description of achievement, publication, or activity.',
          },
        ],
      });
      state.currentCV.design.sectionOrder.push(sectionId);
      state.currentCV.sectionConfig.push({
        id: sectionId,
        label: title,
        visible: true,
        column: 'main',
      });
    },
    updateCustomSection: (state, action) => {
      const { sectionId, data } = action.payload;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section) {
        pushHistory(state);
        Object.assign(section, data);
        if (data.title) {
          const cfg = state.currentCV.sectionConfig.find((s) => s.id === sectionId);
          if (cfg) cfg.label = data.title;
        }
      }
    },
    removeCustomSection: (state, action) => {
      pushHistory(state);
      const sectionId = action.payload;
      state.currentCV.customSections = state.currentCV.customSections.filter((s) => s.id !== sectionId);
      state.currentCV.design.sectionOrder = state.currentCV.design.sectionOrder.filter((id) => id !== sectionId);
      state.currentCV.sectionConfig = state.currentCV.sectionConfig.filter((s) => s.id !== sectionId);
    },
    addCustomSectionItem: (state, action) => {
      const { sectionId, item } = action.payload;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section) {
        pushHistory(state);
        if (!Array.isArray(section.items)) section.items = [];
        section.items.push(
          item || {
            id: `item-${Date.now()}`,
            title: 'New Item',
            subtitle: '',
            date: '',
            description: '',
          }
        );
      }
    },
    updateCustomSectionItem: (state, action) => {
      const { sectionId, itemIndex, data } = action.payload;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items) && section.items[itemIndex]) {
        pushHistory(state);
        Object.assign(section.items[itemIndex], data);
      }
    },
    removeCustomSectionItem: (state, action) => {
      const { sectionId, itemIndex } = action.payload;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items)) {
        pushHistory(state);
        section.items.splice(itemIndex, 1);
      }
    },

    // Autosave & Sync State Tracking
    setSaveStatus: (state, action) => {
      const status = action.payload; // 'saved' | 'saving' | 'unsaved' | 'error'
      state.saveStatus = status;
      state.isAutosaving = status === 'saving';
      if (status === 'saved') {
        state.isDirty = false;
        state.lastSavedAt = new Date().toISOString();
      } else if (status === 'unsaved') {
        state.isDirty = true;
      }
    },
    setSavingState: (state, action) => {
      state.isAutosaving = Boolean(action.payload);
      if (action.payload) {
        state.saveStatus = 'saving';
      } else {
        state.saveStatus = 'saved';
        state.isDirty = false;
        state.lastSavedAt = new Date().toISOString();
      }
    },

    resetCV: (state) => {
      state.currentCV = normalizeLoadedCV(INITIAL_CV_DATA);
      state.past = [];
      state.future = [];
      state.cvId = null;
      state.version = 1;
      state.isExportUnlocked = false;
      state.unlockType = null;
      state.isDirty = false;
      state.saveStatus = 'saved';
      state.isAutosaving = false;
      state.lastSavedAt = null;
    },
  },
});

export const {
  setCVData,
  setCVId,
  setCVSyncMeta,
  markExportUnlocked,
  updateTitle,
  updatePersonalInfo,
  updatePersonalDetails,
  updateSummary,
  updateCareerObjective,
  updateDeclaration,
  updateDesign,
  updateDesignTokens,
  resetDesignToTemplateDefaults,
  setTemplateId,
  setElementOverride,
  removeElementOverride,
  clearAllElementOverrides,
  addCustomElement,
  updateCustomElement,
  removeCustomElement,
  setSectionConfig,
  updateSectionConfigItem,
  toggleSectionVisibility,
  reorderSections,
  undo,
  redo,
  addExperience,
  updateExperience,
  removeExperience,
  reorderExperience,
  addInternship,
  updateInternship,
  removeInternship,
  reorderInternships,
  addEducation,
  updateEducation,
  removeEducation,
  reorderEducation,
  addSkill,
  updateSkill,
  removeSkill,
  reorderSkills,
  addProject,
  updateProject,
  removeProject,
  reorderProjects,
  addCertification,
  updateCertification,
  removeCertification,
  reorderCertifications,
  addLanguage,
  updateLanguage,
  removeLanguage,
  addAchievement,
  updateAchievement,
  removeAchievement,
  addVolunteer,
  updateVolunteer,
  removeVolunteer,
  addPublication,
  updatePublication,
  removePublication,
  addReference,
  updateReference,
  removeReference,
  reorderReferences,
  addAdditionalInfo,
  updateAdditionalInfo,
  removeAdditionalInfo,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  setSaveStatus,
  setSavingState,
  resetCV,
} = cvSlice.actions;

export default cvSlice.reducer;
