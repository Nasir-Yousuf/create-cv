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
  saveStatus: 'saved', // 'saved' | 'saving' | 'unsaved' | 'error' | 'offline-queued'
  isAutosaving: false,
  lastSavedAt: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  offlineQueue: [],
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
      if (!state.currentCV.designTokens) {
        state.currentCV.designTokens = { ...DEFAULT_DESIGN_TOKENS };
      }
      if (action.payload.primaryColor) {
        state.currentCV.designTokens.primaryColor = action.payload.primaryColor;
      }
      if (action.payload.accentColor) {
        state.currentCV.designTokens.accentColor = action.payload.accentColor;
      }
      if (action.payload.textColor || action.payload.bodyColor) {
        state.currentCV.designTokens.bodyColor = action.payload.bodyColor || action.payload.textColor;
      }
      if (action.payload.headingColor) {
        state.currentCV.designTokens.headingColor = action.payload.headingColor;
      }
      if (action.payload.backgroundColor) {
        state.currentCV.designTokens.backgroundColor = action.payload.backgroundColor;
      }
      if (action.payload.sidebarBgColor) {
        state.currentCV.designTokens.sidebarBgColor = action.payload.sidebarBgColor;
      }
      if (action.payload.dividerColor) {
        state.currentCV.designTokens.dividerColor = action.payload.dividerColor;
      }
      if (action.payload.badgeBgColor) {
        state.currentCV.designTokens.badgeBgColor = action.payload.badgeBgColor;
      }
      if (action.payload.fontFamily) {
        state.currentCV.designTokens.fontHeading = action.payload.fontFamily;
        if (!action.payload.fontBody) {
          state.currentCV.designTokens.fontBody = action.payload.fontFamily;
        }
      }
      if (action.payload.fontHeading) {
        state.currentCV.designTokens.fontHeading = action.payload.fontHeading;
      }
      if (action.payload.fontBody) {
        state.currentCV.designTokens.fontBody = action.payload.fontBody;
      }
      if (action.payload.lineHeight) {
        state.currentCV.designTokens.lineHeight = action.payload.lineHeight;
      }
      if (action.payload.letterSpacing) {
        state.currentCV.designTokens.letterSpacing = action.payload.letterSpacing;
      }
      if (action.payload.paragraphSpacing) {
        state.currentCV.designTokens.paragraphSpacing = action.payload.paragraphSpacing;
      }
      if (action.payload.pageMargin) {
        state.currentCV.designTokens.pageMargin = action.payload.pageMargin;
      }
      if (action.payload.sectionSpacing) {
        state.currentCV.designTokens.sectionSpacing = action.payload.sectionSpacing;
      }
      if (action.payload.itemSpacing) {
        state.currentCV.designTokens.itemSpacing = action.payload.itemSpacing;
      }
      if (action.payload.columnRatio) {
        state.currentCV.designTokens.columnRatio = action.payload.columnRatio;
      }
      if (action.payload.dividerThickness) {
        state.currentCV.designTokens.dividerThickness = action.payload.dividerThickness;
      }
    },

    updateDesignTokens: (state, action) => {
      pushHistory(state);
      state.currentCV.designTokens = {
        ...(state.currentCV.designTokens || DEFAULT_DESIGN_TOKENS),
        ...action.payload,
      };
      // Synchronize design
      state.currentCV.design = {
        ...state.currentCV.design,
      };
      if (action.payload.primaryColor) {
        state.currentCV.design.primaryColor = action.payload.primaryColor;
      }
      if (action.payload.accentColor) {
        state.currentCV.design.accentColor = action.payload.accentColor;
      }
      if (action.payload.bodyColor) {
        state.currentCV.design.textColor = action.payload.bodyColor;
      }
      if (action.payload.headingColor) {
        state.currentCV.design.headingColor = action.payload.headingColor;
      }
      if (action.payload.backgroundColor) {
        state.currentCV.design.backgroundColor = action.payload.backgroundColor;
      }
      if (action.payload.sidebarBgColor) {
        state.currentCV.design.sidebarBgColor = action.payload.sidebarBgColor;
      }
      if (action.payload.dividerColor) {
        state.currentCV.design.dividerColor = action.payload.dividerColor;
      }
      if (action.payload.badgeBgColor) {
        state.currentCV.design.badgeBgColor = action.payload.badgeBgColor;
      }
      if (action.payload.fontFamily) {
        state.currentCV.designTokens.fontHeading = action.payload.fontFamily;
        if (!action.payload.fontBody && !action.payload.fontHeading) {
          state.currentCV.designTokens.fontBody = action.payload.fontFamily;
        }
        state.currentCV.design.fontFamily = action.payload.fontFamily;
      }
      if (action.payload.fontHeading) {
        state.currentCV.design.fontFamily = action.payload.fontHeading;
      }
      if (action.payload.fontBody) {
        state.currentCV.design.fontBody = action.payload.fontBody;
      }
      if (action.payload.lineHeight) {
        state.currentCV.design.lineHeight = action.payload.lineHeight;
      }
      if (action.payload.letterSpacing) {
        state.currentCV.design.letterSpacing = action.payload.letterSpacing;
      }
      if (action.payload.paragraphSpacing) {
        state.currentCV.design.paragraphSpacing = action.payload.paragraphSpacing;
      }
      if (action.payload.pageMargin) {
        state.currentCV.design.pageMargin = action.payload.pageMargin;
      }
      if (action.payload.sectionSpacing) {
        state.currentCV.design.sectionSpacing = action.payload.sectionSpacing;
      }
      if (action.payload.itemSpacing) {
        state.currentCV.design.itemSpacing = action.payload.itemSpacing;
      }
      if (action.payload.columnRatio) {
        state.currentCV.design.columnRatio = action.payload.columnRatio;
      }
      if (action.payload.dividerThickness) {
        state.currentCV.design.dividerThickness = action.payload.dividerThickness;
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
      const path = action.payload?.path || action.payload?.elementId;
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

    updateFieldByPath: (state, action) => {
      const { path, value } = action.payload || {};
      if (!path) return;
      pushHistory(state);
      const parts = path.split('.');
      let curr = state.currentCV;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (!curr[key] || typeof curr[key] !== 'object') {
          curr[key] = isNaN(Number(parts[i + 1])) ? {} : [];
        }
        curr = curr[key];
      }
      curr[parts[parts.length - 1]] = value;
      // Sync personalInfo aliases
      if (parts[0] === 'personalInfo' && (parts[1] === 'summary' || parts[1] === 'careerObjective')) {
        state.currentCV[parts[1]] = value;
      }
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
    moveSection: (state, action) => {
      const { id, direction } = action.payload || {};
      const currentOrder = state.currentCV.design?.sectionOrder || [];
      const index = currentOrder.indexOf(id);
      if (index === -1) return;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
      pushHistory(state);
      const newOrder = [...currentOrder];
      const [moved] = newOrder.splice(index, 1);
      newOrder.splice(targetIndex, 0, moved);
      state.currentCV.design.sectionOrder = newOrder;

      // Also align sectionConfig
      const seen = new Set(newOrder);
      const reordered = [];
      newOrder.forEach((sid) => {
        const item = state.currentCV.sectionConfig?.find((s) => s.id === sid);
        if (item) reordered.push(item);
      });
      state.currentCV.sectionConfig?.forEach((s) => {
        if (!seen.has(s.id)) reordered.push(s);
      });
      state.currentCV.sectionConfig = reordered;
    },
    setProfileType: (state, action) => {
      pushHistory(state);
      state.currentCV.profileType = action.payload;
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
    duplicateExperience: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.experience) && state.currentCV.experience[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.experience[index]));
        copy.id = `exp-${Date.now()}`;
        state.currentCV.experience.splice(index + 1, 0, copy);
      }
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
    duplicateInternship: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.internships) && state.currentCV.internships[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.internships[index]));
        copy.id = `intern-${Date.now()}`;
        state.currentCV.internships.splice(index + 1, 0, copy);
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
    duplicateEducation: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.education) && state.currentCV.education[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.education[index]));
        copy.id = `edu-${Date.now()}`;
        state.currentCV.education.splice(index + 1, 0, copy);
      }
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
    duplicateSkill: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.skills) && state.currentCV.skills[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.skills[index]));
        copy.id = `skill-${Date.now()}`;
        state.currentCV.skills.splice(index + 1, 0, copy);
      }
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
    duplicateProject: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.projects) && state.currentCV.projects[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.projects[index]));
        copy.id = `proj-${Date.now()}`;
        state.currentCV.projects.splice(index + 1, 0, copy);
      }
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
    duplicateCertification: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.certifications) && state.currentCV.certifications[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.certifications[index]));
        copy.id = `cert-${Date.now()}`;
        state.currentCV.certifications.splice(index + 1, 0, copy);
      }
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
    reorderLanguages: (state, action) => {
      if (Array.isArray(state.currentCV.languages)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.languages.splice(sourceIndex, 1);
        state.currentCV.languages.splice(destinationIndex, 0, removed);
      }
    },
    duplicateLanguage: (state, action) => {
      const index = typeof action.payload === 'number'
        ? action.payload
        : state.currentCV.languages?.findIndex((x) => x.id === action.payload);
      if (Array.isArray(state.currentCV.languages) && index >= 0 && state.currentCV.languages[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.languages[index]));
        copy.id = `lang-${Date.now()}`;
        state.currentCV.languages.splice(index + 1, 0, copy);
      }
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
    reorderAchievements: (state, action) => {
      if (Array.isArray(state.currentCV.achievements)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.achievements.splice(sourceIndex, 1);
        state.currentCV.achievements.splice(destinationIndex, 0, removed);
      }
    },
    duplicateAchievement: (state, action) => {
      const index = typeof action.payload === 'number'
        ? action.payload
        : state.currentCV.achievements?.findIndex((x) => x.id === action.payload);
      if (Array.isArray(state.currentCV.achievements) && index >= 0 && state.currentCV.achievements[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.achievements[index]));
        copy.id = `ach-${Date.now()}`;
        state.currentCV.achievements.splice(index + 1, 0, copy);
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
    reorderVolunteer: (state, action) => {
      if (Array.isArray(state.currentCV.volunteer)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.volunteer.splice(sourceIndex, 1);
        state.currentCV.volunteer.splice(destinationIndex, 0, removed);
      }
    },
    duplicateVolunteer: (state, action) => {
      const index = typeof action.payload === 'number'
        ? action.payload
        : state.currentCV.volunteer?.findIndex((x) => x.id === action.payload);
      if (Array.isArray(state.currentCV.volunteer) && index >= 0 && state.currentCV.volunteer[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.volunteer[index]));
        copy.id = `vol-${Date.now()}`;
        state.currentCV.volunteer.splice(index + 1, 0, copy);
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
    reorderPublications: (state, action) => {
      if (Array.isArray(state.currentCV.publications)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.publications.splice(sourceIndex, 1);
        state.currentCV.publications.splice(destinationIndex, 0, removed);
      }
    },
    duplicatePublication: (state, action) => {
      const index = typeof action.payload === 'number'
        ? action.payload
        : state.currentCV.publications?.findIndex((x) => x.id === action.payload);
      if (Array.isArray(state.currentCV.publications) && index >= 0 && state.currentCV.publications[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.publications[index]));
        copy.id = `pub-${Date.now()}`;
        state.currentCV.publications.splice(index + 1, 0, copy);
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
    duplicateReference: (state, action) => {
      const index = action.payload;
      if (Array.isArray(state.currentCV.references) && state.currentCV.references[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.references[index]));
        copy.id = `ref-${Date.now()}`;
        state.currentCV.references.splice(index + 1, 0, copy);
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
    reorderAdditionalInfo: (state, action) => {
      if (Array.isArray(state.currentCV.additionalInfo)) {
        pushHistory(state);
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.additionalInfo.splice(sourceIndex, 1);
        state.currentCV.additionalInfo.splice(destinationIndex, 0, removed);
      }
    },
    duplicateAdditionalInfo: (state, action) => {
      const index = typeof action.payload === 'number'
        ? action.payload
        : state.currentCV.additionalInfo?.findIndex((x) => x.id === action.payload);
      if (Array.isArray(state.currentCV.additionalInfo) && index >= 0 && state.currentCV.additionalInfo[index]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(state.currentCV.additionalInfo[index]));
        copy.id = `add-${Date.now()}`;
        state.currentCV.additionalInfo.splice(index + 1, 0, copy);
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
      const { sectionId, itemIndex, index, data } = action.payload;
      const idx = itemIndex !== undefined ? itemIndex : index;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items) && section.items[idx]) {
        pushHistory(state);
        Object.assign(section.items[idx], data);
      }
    },
    removeCustomSectionItem: (state, action) => {
      const { sectionId, itemIndex, index } = action.payload;
      const idx = itemIndex !== undefined ? itemIndex : index;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items)) {
        pushHistory(state);
        section.items.splice(idx, 1);
      }
    },
    reorderCustomSectionItems: (state, action) => {
      const { sectionId, sourceIndex, destinationIndex } = action.payload || {};
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items)) {
        pushHistory(state);
        const [removed] = section.items.splice(sourceIndex, 1);
        section.items.splice(destinationIndex, 0, removed);
      }
    },
    duplicateCustomSectionItem: (state, action) => {
      const { sectionId, itemIndex, index } = action.payload || {};
      const idx = itemIndex !== undefined ? itemIndex : index;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section && Array.isArray(section.items) && section.items[idx]) {
        pushHistory(state);
        const copy = JSON.parse(JSON.stringify(section.items[idx]));
        copy.id = `item-${Date.now()}`;
        section.items.splice(idx + 1, 0, copy);
      }
    },
    hideSection: (state, action) => {
      const id = action.payload;
      pushHistory(state);
      if (!Array.isArray(state.currentCV.sectionConfig)) {
        state.currentCV.sectionConfig = [];
      }
      let item = state.currentCV.sectionConfig.find((s) => s.id === id);
      if (item) {
        item.visible = false;
      } else {
        state.currentCV.sectionConfig.push({ id, label: id, visible: false, column: 'main' });
      }
      state.currentCV.design.sectionOrder = (state.currentCV.design?.sectionOrder || []).filter(
        (sid) => sid !== id
      );
    },
    restoreSection: (state, action) => {
      const id = action.payload;
      pushHistory(state);
      if (!Array.isArray(state.currentCV.sectionConfig)) {
        state.currentCV.sectionConfig = [];
      }
      let item = state.currentCV.sectionConfig.find((s) => s.id === id);
      if (item) {
        item.visible = true;
      } else {
        state.currentCV.sectionConfig.push({ id, label: id, visible: true, column: 'main' });
      }
      if (!Array.isArray(state.currentCV.design?.sectionOrder)) {
        state.currentCV.design.sectionOrder = [];
      }
      if (!state.currentCV.design.sectionOrder.includes(id)) {
        state.currentCV.design.sectionOrder.push(id);
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

    setNetworkStatus: (state, action) => {
      state.isOnline = Boolean(action.payload);
      if (!action.payload) {
        state.saveStatus = 'offline-queued';
      }
    },
    queueOfflineEdit: (state, action) => {
      state.offlineQueue.push(action.payload);
      state.saveStatus = 'offline-queued';
    },
    clearOfflineQueue: (state) => {
      state.offlineQueue = [];
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
  updateFieldByPath,
  addCustomElement,
  updateCustomElement,
  removeCustomElement,
  setSectionConfig,
  updateSectionConfigItem,
  toggleSectionVisibility,
  hideSection,
  restoreSection,
  moveSection,
  reorderSections,
  setProfileType,
  undo,
  redo,
  addExperience,
  updateExperience,
  removeExperience,
  reorderExperience,
  duplicateExperience,
  addInternship,
  updateInternship,
  removeInternship,
  reorderInternships,
  duplicateInternship,
  addEducation,
  updateEducation,
  removeEducation,
  reorderEducation,
  duplicateEducation,
  addSkill,
  updateSkill,
  removeSkill,
  reorderSkills,
  duplicateSkill,
  addProject,
  updateProject,
  removeProject,
  reorderProjects,
  duplicateProject,
  addCertification,
  updateCertification,
  removeCertification,
  reorderCertifications,
  duplicateCertification,
  addLanguage,
  updateLanguage,
  removeLanguage,
  reorderLanguages,
  duplicateLanguage,
  addAchievement,
  updateAchievement,
  removeAchievement,
  reorderAchievements,
  duplicateAchievement,
  addVolunteer,
  updateVolunteer,
  removeVolunteer,
  reorderVolunteer,
  duplicateVolunteer,
  addPublication,
  updatePublication,
  removePublication,
  reorderPublications,
  duplicatePublication,
  addReference,
  updateReference,
  removeReference,
  reorderReferences,
  duplicateReference,
  addAdditionalInfo,
  updateAdditionalInfo,
  removeAdditionalInfo,
  reorderAdditionalInfo,
  duplicateAdditionalInfo,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  reorderCustomSectionItems,
  duplicateCustomSectionItem,
  setSaveStatus,
  setSavingState,
  setNetworkStatus,
  queueOfflineEdit,
  clearOfflineQueue,
  resetCV,
} = cvSlice.actions;

export default cvSlice.reducer;
