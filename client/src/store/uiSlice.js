import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editorMode: 'form', // 'form' (Mode A) | 'visual' (Mode B)
  mobileViewMode: 'edit', // 'edit' | 'preview' | 'design'
  desktopTab: 'content', // 'content' | 'design' | 'templates' | 'ai'
  activeSection: 'personalInfo',
  activeField: null, // e.g. 'fullName', 'jobTitle', 'summary'
  selectedElementPath: null, // e.g. 'personalInfo.fullName', 'experience.0.jobTitle'
  selectedElementType: null, // e.g. 'heading', 'text', 'multiline', 'badge', 'date'
  previewScale: 0.95,
  isDarkMode: false,
  aiModal: {
    isOpen: false,
    mode: 'generate', // 'generate' | 'summary' | 'experience' | 'skills' | 'matcher' | 'review' | 'design'
    contextData: null,
  },
  exportModal: {
    isOpen: false,
    format: 'pdf', // 'pdf' | 'docx'
    isGenerating: false,
    progress: 0,
    downloadUrl: null,
    error: null,
  },
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
    actionLabel: '',
    actionKey: null,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setEditorMode: (state, action) => {
      state.editorMode = action.payload === 'visual' ? 'visual' : 'form';
    },
    setMobileViewMode: (state, action) => {
      state.mobileViewMode = action.payload;
    },
    setDesktopTab: (state, action) => {
      state.desktopTab = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setActiveField: (state, action) => {
      state.activeField = action.payload;
      state.selectedElementPath = action.payload;
    },
    setSelectedElement: (state, action) => {
      const { path, type } = action.payload || {};
      state.selectedElementPath = path || null;
      state.selectedElementType = type || 'text';
      state.activeField = path || null;
    },
    clearSelectedElement: (state) => {
      state.selectedElementPath = null;
      state.selectedElementType = null;
      state.activeField = null;
    },
    setPreviewScale: (state, action) => {
      state.previewScale = Math.max(0.25, Math.min(2.0, action.payload));
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    openAIModal: (state, action) => {
      state.aiModal = {
        isOpen: true,
        mode: action?.payload?.mode || 'generate',
        contextData: action?.payload?.contextData || null,
      };
    },
    closeAIModal: (state) => {
      state.aiModal = {
        isOpen: false,
        mode: 'generate',
        contextData: null,
      };
    },
    openExportModal: (state, action) => {
      state.exportModal = {
        isOpen: true,
        format: action.payload?.format || 'pdf',
        isGenerating: false,
        progress: 0,
        downloadUrl: null,
        error: null,
      };
    },
    updateExportState: (state, action) => {
      state.exportModal = {
        ...state.exportModal,
        ...action.payload,
      };
    },
    closeExportModal: (state) => {
      state.exportModal.isOpen = false;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        actionLabel: action.payload.actionLabel || '',
        actionKey: action.payload.actionKey || null,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
      state.toast.actionLabel = '';
      state.toast.actionKey = null;
    },
  },
});

export const {
  setEditorMode,
  setMobileViewMode,
  setDesktopTab,
  setActiveSection,
  setActiveField,
  setSelectedElement,
  clearSelectedElement,
  setPreviewScale,
  toggleDarkMode,
  openAIModal,
  closeAIModal,
  openExportModal,
  updateExportState,
  closeExportModal,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
