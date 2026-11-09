import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_CV_DATA } from '@shared/constants/cvDefaults.js';

const MAX_HISTORY = 20;

const initialState = {
  currentCV: { ...INITIAL_CV_DATA },
  past: [],
  future: [],
  cvId: null,
  isDirty: false,
  isAutosaving: false,
  lastSavedAt: null,
};

const pushHistory = (state) => {
  state.past.push(JSON.parse(JSON.stringify(state.currentCV)));
  if (state.past.length > MAX_HISTORY) {
    state.past.shift();
  }
  state.future = []; // Clear redo stack on new action
  state.isDirty = true;
};

export const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVData: (state, action) => {
      state.currentCV = action.payload;
      state.past = [];
      state.future = [];
      state.isDirty = false;
    },
    setCVId: (state, action) => {
      state.cvId = action.payload;
    },
    updateTitle: (state, action) => {
      pushHistory(state);
      state.currentCV.title = action.payload;
    },
    updatePersonalInfo: (state, action) => {
      pushHistory(state);
      state.currentCV.personalInfo = {
        ...state.currentCV.personalInfo,
        ...action.payload,
      };
    },
    updatePersonalDetails: (state, action) => {
      pushHistory(state);
      state.currentCV.personalDetails = {
        ...state.currentCV.personalDetails,
        ...action.payload,
      };
    },
    updateDeclaration: (state, action) => {
      pushHistory(state);
      state.currentCV.declaration = {
        ...state.currentCV.declaration,
        ...action.payload,
      };
    },
    updateDesign: (state, action) => {
      pushHistory(state);
      state.currentCV.design = {
        ...state.currentCV.design,
        ...action.payload,
      };
    },
    setTemplateId: (state, action) => {
      pushHistory(state);
      state.currentCV.templateId = action.payload;
    },

    // Undo / Redo
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop();
        state.future.unshift(JSON.parse(JSON.stringify(state.currentCV)));
        state.currentCV = previous;
        state.isDirty = true;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.shift();
        state.past.push(JSON.parse(JSON.stringify(state.currentCV)));
        state.currentCV = next;
        state.isDirty = true;
      }
    },

    // Section Ordering
    reorderSections: (state, action) => {
      pushHistory(state);
      if (Array.isArray(action.payload)) {
        state.currentCV.design.sectionOrder = action.payload;
      } else {
        const { sourceIndex, destinationIndex } = action.payload;
        const [removed] = state.currentCV.design.sectionOrder.splice(sourceIndex, 1);
        state.currentCV.design.sectionOrder.splice(destinationIndex, 0, removed);
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

    // Custom Sections
    addCustomSection: (state, action) => {
      pushHistory(state);
      const sectionId = `custom-${Date.now()}`;
      const title = action.payload?.title || 'Additional Information';
      state.currentCV.customSections.push({
        id: sectionId,
        title,
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
    },
    updateCustomSection: (state, action) => {
      const { sectionId, data } = action.payload;
      const section = state.currentCV.customSections.find((s) => s.id === sectionId);
      if (section) {
        pushHistory(state);
        Object.assign(section, data);
      }
    },
    removeCustomSection: (state, action) => {
      pushHistory(state);
      const sectionId = action.payload;
      state.currentCV.customSections = state.currentCV.customSections.filter((s) => s.id !== sectionId);
      state.currentCV.design.sectionOrder = state.currentCV.design.sectionOrder.filter((id) => id !== sectionId);
    },

    // Autosave tracking
    setSavingState: (state, action) => {
      state.isAutosaving = action.payload;
      if (!action.payload) {
        state.lastSavedAt = new Date().toISOString();
        state.isDirty = false;
      }
    },
    resetCV: (state) => {
      state.currentCV = { ...INITIAL_CV_DATA };
      state.past = [];
      state.future = [];
      state.cvId = null;
      state.isDirty = false;
    },
  },
});

export const {
  setCVData,
  setCVId,
  updateTitle,
  updatePersonalInfo,
  updatePersonalDetails,
  updateDeclaration,
  updateDesign,
  setTemplateId,
  undo,
  redo,
  reorderSections,
  addExperience,
  updateExperience,
  removeExperience,
  reorderExperience,
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
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
  setSavingState,
  resetCV,
} = cvSlice.actions;

export default cvSlice.reducer;
