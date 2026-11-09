import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_CV_DATA } from '@shared/constants/cvDefaults.js';

const initialState = {
  currentCV: { ...INITIAL_CV_DATA },
  cvId: null,
  isDirty: false,
  isAutosaving: false,
  lastSavedAt: null,
};

export const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVData: (state, action) => {
      state.currentCV = action.payload;
      state.isDirty = false;
    },
    setCVId: (state, action) => {
      state.cvId = action.payload;
    },
    updateTitle: (state, action) => {
      state.currentCV.title = action.payload;
      state.isDirty = true;
    },
    updatePersonalInfo: (state, action) => {
      state.currentCV.personalInfo = {
        ...state.currentCV.personalInfo,
        ...action.payload,
      };
      state.isDirty = true;
    },
    updateDesign: (state, action) => {
      state.currentCV.design = {
        ...state.currentCV.design,
        ...action.payload,
      };
      state.isDirty = true;
    },
    setTemplateId: (state, action) => {
      state.currentCV.templateId = action.payload;
      state.isDirty = true;
    },

    // Experience Actions
    addExperience: (state, action) => {
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
      state.isDirty = true;
    },
    updateExperience: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.experience[index]) {
        state.currentCV.experience[index] = {
          ...state.currentCV.experience[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeExperience: (state, action) => {
      state.currentCV.experience.splice(action.payload, 1);
      state.isDirty = true;
    },
    reorderExperience: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentCV.experience.splice(sourceIndex, 1);
      state.currentCV.experience.splice(destinationIndex, 0, removed);
      state.isDirty = true;
    },

    // Education Actions
    addEducation: (state, action) => {
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
      state.isDirty = true;
    },
    updateEducation: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.education[index]) {
        state.currentCV.education[index] = {
          ...state.currentCV.education[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeEducation: (state, action) => {
      state.currentCV.education.splice(action.payload, 1);
      state.isDirty = true;
    },

    // Skills Actions
    addSkill: (state, action) => {
      const newSkill = action.payload || {
        id: `skill-${Date.now()}`,
        name: '',
        level: 'Advanced',
        category: 'General',
      };
      state.currentCV.skills.push(newSkill);
      state.isDirty = true;
    },
    updateSkill: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.skills[index]) {
        state.currentCV.skills[index] = {
          ...state.currentCV.skills[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeSkill: (state, action) => {
      state.currentCV.skills.splice(action.payload, 1);
      state.isDirty = true;
    },

    // Projects Actions
    addProject: (state, action) => {
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
      state.isDirty = true;
    },
    updateProject: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.projects[index]) {
        state.currentCV.projects[index] = {
          ...state.currentCV.projects[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeProject: (state, action) => {
      state.currentCV.projects.splice(action.payload, 1);
      state.isDirty = true;
    },

    // Certifications Actions
    addCertification: (state, action) => {
      const newCert = action.payload || {
        id: `cert-${Date.now()}`,
        name: '',
        issuer: '',
        date: '',
        link: '',
      };
      state.currentCV.certifications.push(newCert);
      state.isDirty = true;
    },
    updateCertification: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.certifications[index]) {
        state.currentCV.certifications[index] = {
          ...state.currentCV.certifications[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeCertification: (state, action) => {
      state.currentCV.certifications.splice(action.payload, 1);
      state.isDirty = true;
    },

    // Languages Actions
    addLanguage: (state, action) => {
      const newLang = action.payload || {
        id: `lang-${Date.now()}`,
        language: '',
        proficiency: 'Fluent',
      };
      state.currentCV.languages.push(newLang);
      state.isDirty = true;
    },
    updateLanguage: (state, action) => {
      const { index, data } = action.payload;
      if (state.currentCV.languages[index]) {
        state.currentCV.languages[index] = {
          ...state.currentCV.languages[index],
          ...data,
        };
        state.isDirty = true;
      }
    },
    removeLanguage: (state, action) => {
      state.currentCV.languages.splice(action.payload, 1);
      state.isDirty = true;
    },

    // Section Ordering & Visibility
    setSectionOrder: (state, action) => {
      state.currentCV.design.sectionOrder = action.payload;
      state.isDirty = true;
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
  updateDesign,
  setTemplateId,
  addExperience,
  updateExperience,
  removeExperience,
  reorderExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  updateSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  addCertification,
  updateCertification,
  removeCertification,
  addLanguage,
  updateLanguage,
  removeLanguage,
  setSectionOrder,
  setSavingState,
  resetCV,
} = cvSlice.actions;

export default cvSlice.reducer;

