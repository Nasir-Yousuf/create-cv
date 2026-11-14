import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  setCVData,
  setCVId,
  setCVSyncMeta,
  updateTitle,
  updateDesign,
  setTemplateId,
  undo,
  redo,
  setSavingState,
  setSaveStatus,
} from '../../store/cvSlice';
import { openAuthModal } from '../../store/authSlice';
import {
  setMobileViewMode,
  setPreviewScale,
  showToast,
  openAIModal,
  toggleDarkMode,
  setEditorMode,
} from '../../store/uiSlice';
import cvService from '../../services/cvService';
import exportService from '../../services/exportService';
import templateService from '../../services/templateService';
import { RenderCVTemplate } from '../../templates';
import SortableSectionList from './components/SortableSectionList';
import SectionFormEditor from './components/SectionFormEditor';
import EditorInspector from './components/EditorInspector';
import PhotoUploadCropModal from './components/PhotoUploadCropModal';
import AIAssistantModal from '../../components/common/AIAssistantModal';
import WhatsAppSupportButton from '../../components/common/WhatsAppSupportButton';
import PaymentExportModal from '../../components/common/PaymentExportModal';
import PDFPreviewModal from '../../components/common/PDFPreviewModal';
import { runProtectedExport } from '../../utils/runProtectedExport';
import { analyzeOnePageFit } from '../../utils/onePageFit';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  resolveTemplateId,
  templateMatchesCategory,
  DANIEL_CARTER_CV,
  TAHMIDUR_RAHMAN_CV,
  INITIAL_CV_DATA,
} from '@shared/constants/cvDefaults.js';
import {
  Undo2,
  Redo2,
  Download,
  FileDown,
  Sparkles,
  LayoutGrid,
  Palette,
  Layers,
  Settings,
  Crown,
  Check,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  MousePointer,
  Move,
  Plus,
  Edit3,
  FileText,
  Clock,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Sliders,
  Maximize2,
  Minimize2,
  Save,
  Share2,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const CVEditorPage = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasScrollContainerRef = useRef(null);

  const {
    currentCV,
    cvId,
    version,
    isDirty,
    past,
    future,
    isAutosaving,
    saveStatus,
    lastSavedAt,
  } = useSelector((state) => state.cv);
  const { previewScale, isDarkMode, editorMode = 'form', selectedElementPath } = useSelector(
    (state) => state.ui
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Auto-switch to Inspector tab and open drawer when user selects an element on the canvas
  useEffect(() => {
    if (selectedElementPath) {
      setActiveSidebarTab('inspector');
      setIsSidebarOpen(true);
    }
  }, [selectedElementPath]);

  // Warn on tab/window close if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'unsaved' || isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus, isDirty]);

  // macOS App State
  const [templatesList, setTemplatesList] = useState(TEMPLATES_REGISTRY);
  const [categoriesList, setCategoriesList] = useState(TEMPLATE_CATEGORIES);
  const [activeSidebarTab, setActiveSidebarTab] = useState('templates'); // 'templates' | 'design' | 'sections' | 'settings'
  const [templateFilter, setTemplateFilter] = useState('One-Page CVs');
  const [devicePreview, setDevicePreview] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [zoomDropdownOpen, setZoomDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );
  const [isRightDockOpen, setIsRightDockOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeActionDock, setActiveActionDock] = useState('edit');
  const [paymentModalState, setPaymentModalState] = useState({
    isOpen: false,
    exportType: 'pdf',
    cvId: null,
    cvTitle: '',
    retryExport: null,
  });
  const [mobileExportSheetOpen, setMobileExportSheetOpen] = useState(false);
  const [pdfPreviewModalOpen, setPdfPreviewModalOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');
  const [versionConflict, setVersionConflict] = useState(null);
  const [onePageFit, setOnePageFit] = useState(() => analyzeOnePageFit(currentCV));

  // Zoom preset values
  const zoomPresets = [
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '90%', value: 0.9 },
    { label: '100%', value: 1.0 },
    { label: '125%', value: 1.25 },
    { label: 'Fit to Window', value: 'fit' },
  ];

  // Auto-fit canvas calculation
  const handleFitZoom = () => {
    const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobileScreen) {
      const availableWidth = Math.max(280, window.innerWidth - 12);
      const targetPaperWidth = devicePreview === 'mobile' ? 400 : 794;
      const optimalScale = Math.min(1.0, Math.max(0.30, Math.floor((availableWidth / targetPaperWidth) * 100) / 100));
      dispatch(setPreviewScale(optimalScale));
      return;
    }

    const containerWidth =
      canvasScrollContainerRef.current?.clientWidth ||
      (window.innerWidth - (isSidebarOpen ? 370 : 70) - (isRightDockOpen ? 90 : 28));
    const availableWidth = Math.max(300, containerWidth - 48);
    const targetPaperWidth = devicePreview === 'mobile' ? 400 : devicePreview === 'tablet' ? 680 : 800;
    const optimalScale = Math.min(1.0, Math.max(0.35, Math.floor((availableWidth / targetPaperWidth) * 100) / 100));
    dispatch(setPreviewScale(optimalScale));
  };

  const handleOpenAI = (mode = 'summary') => {
    setAiModalOpen(true);
    dispatch(openAIModal({ mode }));
  };

  useEffect(() => {
    handleFitZoom();
    const timer = setTimeout(() => handleFitZoom(), 150);
    const handleResize = () => handleFitZoom();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen, isRightDockOpen, devicePreview]);

  // Keyboard shortcuts (Ctrl/Cmd+Z, Ctrl/Cmd+Y, Ctrl/Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) dispatch(redo());
        else dispatch(undo());
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        dispatch(redo());
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Load dynamic published templates catalog + measure live 1-page fit
  useEffect(() => {
    templateService
      .getTemplatesCatalog()
      .then(({ templates, categories }) => {
        if (Array.isArray(templates) && templates.length > 0) setTemplatesList(templates);
        if (Array.isArray(categories) && categories.length > 0) setCategoriesList(categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sheetEl = document.getElementById('cv-export-sheet');
      setOnePageFit(analyzeOnePageFit(currentCV, sheetEl));
    }, 180);
    return () => clearTimeout(timer);
  }, [currentCV]);

  // Cloud Document Auto-Sync on Mount / Login / URL ?cvId= across devices
  useEffect(() => {
    const syncCloudCV = async () => {
      if (!isAuthenticated) return;
      const requestedCvId = searchParams.get('cvId');

      if (requestedCvId && requestedCvId !== cvId) {
        try {
          const fullCVRes = await cvService.getCVById(requestedCvId);
          if (fullCVRes?.data) {
            dispatch(setCVData(fullCVRes.data));
            dispatch(
              setCVSyncMeta({
                cvId: fullCVRes.data._id,
                version: fullCVRes.data.version || 1,
                isExportUnlocked: Boolean(fullCVRes.data.isExportUnlocked),
                unlockType: fullCVRes.data.unlockType || null,
              })
            );
            setVersionConflict(null);
            return;
          }
        } catch (err) {
          console.warn('Requested CV load error:', err.message);
        }
      }

      if (cvId && !String(cvId).startsWith('sample-')) return;
      if (isDirty) return; // Never overwrite unsaved local edits when logging in

      try {
        const res = await cvService.getCVs();
        if (res.data && res.data.length > 0) {
          const latestCVMeta = res.data[0];
          const fullCVRes = await cvService.getCVById(latestCVMeta._id);
          if (fullCVRes.data) {
            dispatch(setCVData(fullCVRes.data));
            dispatch(
              setCVSyncMeta({
                cvId: fullCVRes.data._id,
                version: fullCVRes.data.version || 1,
                isExportUnlocked: Boolean(fullCVRes.data.isExportUnlocked),
                unlockType: fullCVRes.data.unlockType || null,
              })
            );
            dispatch(
              showToast({
                message: `Loaded cloud document: ${fullCVRes.data.title || 'My Resume'}`,
                type: 'info',
              })
            );
          }
        } else {
          const created = await cvService.createCV(currentCV);
          if (created.data?._id) {
            dispatch(
              setCVSyncMeta({
                cvId: created.data._id,
                version: created.data.version || 1,
                isExportUnlocked: Boolean(created.data.isExportUnlocked),
                unlockType: created.data.unlockType || null,
              })
            );
          }
        }
      } catch (err) {
        console.warn('Cloud sync error:', err.message);
      }
    };

    syncCloudCV();
  }, [isAuthenticated, searchParams]);

  // Debounced Autosave with optimistic version guard and saveStatus tracking
  useEffect(() => {
    if ((saveStatus !== 'unsaved' && !isDirty) || versionConflict) return;

    const timer = setTimeout(async () => {
      dispatch(setSaveStatus('saving'));
      try {
        if (isAuthenticated) {
          if (cvId && !String(cvId).startsWith('sample-')) {
            const res = await cvService.updateCV(cvId, {
              ...currentCV,
              expectedVersion: version,
            });
            if (res?.data) {
              dispatch(
                setCVSyncMeta({
                  cvId: res.data._id,
                  version: res.data.version,
                  isExportUnlocked: Boolean(res.data.isExportUnlocked),
                  unlockType: res.data.unlockType || null,
                })
              );
            }
          } else {
            const res = await cvService.createCV(currentCV);
            if (res.data?._id) {
              dispatch(
                setCVSyncMeta({
                  cvId: res.data._id,
                  version: res.data.version || 1,
                  isExportUnlocked: Boolean(res.data.isExportUnlocked),
                  unlockType: res.data.unlockType || null,
                })
              );
            }
          }
        }
        localStorage.setItem('resumecraft_draft', JSON.stringify(currentCV));
        dispatch(setSaveStatus('saved'));
      } catch (err) {
        if (err?.status === 409) {
          setVersionConflict({
            serverVersion: err?.data?.serverVersion || err?.serverVersion,
            message: err.message || 'This CV was updated on another device.',
          });
        } else {
          console.warn('Autosave status:', err.message);
        }
        localStorage.setItem('resumecraft_draft', JSON.stringify(currentCV));
        dispatch(setSaveStatus('error'));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentCV, isDirty, saveStatus, cvId, version, versionConflict, isAuthenticated, dispatch]);

  const handleReloadLatestCloud = async () => {
    if (!cvId) return;
    try {
      const fullCVRes = await cvService.getCVById(cvId);
      if (fullCVRes?.data) {
        dispatch(setCVData(fullCVRes.data));
        dispatch(
          setCVSyncMeta({
            cvId: fullCVRes.data._id,
            version: fullCVRes.data.version || 1,
            isExportUnlocked: Boolean(fullCVRes.data.isExportUnlocked),
            unlockType: fullCVRes.data.unlockType || null,
          })
        );
        setVersionConflict(null);
        dispatch(showToast({ message: 'Reloaded latest cloud version.', type: 'success' }));
      }
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to reload latest version.', type: 'error' }));
    }
  };

  const handleManualSave = async ({ forceOverwrite = false } = {}) => {
    dispatch(setSaveStatus('saving'));
    try {
      if (isAuthenticated) {
        if (cvId && !String(cvId).startsWith('sample-')) {
          const payload = forceOverwrite ? currentCV : { ...currentCV, expectedVersion: version };
          const res = await cvService.updateCV(cvId, payload);
          if (res?.data) {
            dispatch(
              setCVSyncMeta({
                cvId: res.data._id,
                version: res.data.version,
                isExportUnlocked: Boolean(res.data.isExportUnlocked),
                unlockType: res.data.unlockType || null,
              })
            );
            setVersionConflict(null);
          }
        } else {
          const res = await cvService.createCV(currentCV);
          if (res.data?._id) {
            dispatch(
              setCVSyncMeta({
                cvId: res.data._id,
                version: res.data.version || 1,
                isExportUnlocked: Boolean(res.data.isExportUnlocked),
                unlockType: res.data.unlockType || null,
              })
            );
          }
        }
      }
      localStorage.setItem('resumecraft_draft', JSON.stringify(currentCV));
      dispatch(setSaveStatus('saved'));
      dispatch(
        showToast({
          message: isAuthenticated
            ? 'Changes saved to your cloud account!'
            : 'Saved locally. Sign in to sync across devices!',
          type: 'success',
        })
      );
    } catch (err) {
      if (err?.status === 409) {
        setVersionConflict({
          serverVersion: err?.data?.serverVersion || err?.serverVersion,
          message: err.message || 'Document updated from another session.',
        });
        dispatch(
          showToast({
            message: 'Sync conflict detected — choose Reload Latest or Overwrite.',
            type: 'warning',
          })
        );
      } else {
        localStorage.setItem('resumecraft_draft', JSON.stringify(currentCV));
        dispatch(showToast({ message: 'Saved locally in browser cache.', type: 'info' }));
      }
      dispatch(setSaveStatus('error'));
    }
  };

  // Explicit In-Editor Preview (preserved strictly for the explicit Preview button — never triggered on download)
  const handlePreviewPDF = async () => {
    if (isExporting) return;
    if (!isAuthenticated) {
      dispatch(
        openAuthModal({
          mode: 'login',
          promptMessage: 'Sign in to generate and inspect the live server PDF preview.',
        })
      );
      return;
    }
    if (typeof document !== 'undefined' && document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    try {
      setIsExporting(true);
      setExportDropdownOpen(false);
      const result = await exportService.generatePDFBlob(currentCV, '', 'cv-export-sheet', null, {
        cvId,
        previewOnly: true,
      });
      setPreviewPdfUrl(result.url);
      setPdfPreviewModalOpen(true);
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Unable to generate PDF preview right now.',
          type: 'error',
        })
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Unified Export Handler (direct browser download + Toast feedback; never opens post-download preview panel)
  const triggerEditorExport = async (format) => {
    if (isExporting) return;
    if (typeof document !== 'undefined' && document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    setIsExporting(true);
    setExportDropdownOpen(false);
    try {
      await runProtectedExport({
        dispatch,
        getState: store.getState,
        cvData: currentCV,
        cvId,
        format,
        elementId: 'cv-export-sheet',
        isActiveEditorCV: true,
        openPaymentModal: ({ cvId: lockedId, cvTitle, format: payFormat, retryExport }) => {
          setPaymentModalState({
            isOpen: true,
            exportType: payFormat,
            cvId: lockedId,
            cvTitle,
            retryExport,
          });
        },
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => triggerEditorExport('pdf');

  const handleExportDOCX = () => triggerEditorExport('docx');

  // Filter templates dynamically inside sidebar
  const filteredTemplates = templatesList.filter((tmpl) =>
    templateMatchesCategory(tmpl, templateFilter)
  );

  const activeTemplateId = resolveTemplateId(currentCV?.templateId);

  const handleSelectTemplate = (tmplId) => {
    const canonicalId = resolveTemplateId(tmplId);
    dispatch(setTemplateId(canonicalId));
    dispatch(
      showToast({
        message: `Template applied: ${templatesList.find((t) => t.id === canonicalId)?.name || canonicalId}`,
        type: 'info',
      })
    );
  };

  // Color Swatches
  const colorSwatches = [
    { label: 'Royal Blue', hex: '#2563eb' },
    { label: 'Slate Obsidian', hex: '#0f172a' },
    { label: 'Forest Green', hex: '#059669' },
    { label: 'Ocean Sky', hex: '#0284c7' },
    { label: 'Crimson Maroon', hex: '#881337' },
    { label: 'Warm Amber', hex: '#d97706' },
    { label: 'Linear Violet', hex: '#6366f1' },
    { label: 'Sunset Coral', hex: '#ea580c' },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* -----------------------------------------------------------------------
          1. FULL-WIDTH APPLICATION TOP BAR (100% Window Width)
      ------------------------------------------------------------------------ */}
      <header className="h-14 w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left Group: Chevrons & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 3 macOS Window Controls (Desktop Only) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Return to Home"
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Toggle Sidebar Panel"
              className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
            />
            <button
              type="button"
              onClick={toggleFullScreen}
              title="Toggle Fullscreen"
              className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
            />
          </div>

          {/* Back to Home Chevron (Mobile Only) */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="sm:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Back / Forward History Chevrons (Desktop Only) */}
          <div className="hidden sm:flex items-center text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-0.5 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Go back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="p-0.5 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Go forward"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ResumeCraft Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* Purple squircle icon with folded ribbon/origami 'M' */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h4.5l3.5 5 3.5-5H20v16h-4.5v-8.5L12 12l-3.5-4.5V20H4V4z" />
              </svg>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-slate-800 dark:text-white truncate">
              ResumeCraft
            </span>
          </div>
        </div>

        {/* Center Group: Segmented Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5">
            {/* Templates Pill */}
            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(true);
                setActiveSidebarTab('templates');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSidebarTab === 'templates' && isSidebarOpen
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>

            {/* Mode A / Mode B Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  dispatch(setEditorMode('form'));
                  setActiveSidebarTab('sections');
                  setIsSidebarOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editorMode === 'form' && activeSidebarTab === 'sections' && isSidebarOpen
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mode A: Simple Form Builder"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Form Builder</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setEditorMode('visual'));
                  setActiveSidebarTab('inspector');
                  setIsSidebarOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editorMode === 'visual' || (activeSidebarTab === 'inspector' && isSidebarOpen)
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mode B: Advanced Visual Canvas Editor"
              >
                <MousePointer className="w-3.5 h-3.5 text-indigo-500" />
                <span>Visual Canvas</span>
              </button>
            </div>

            {/* AI Assistant Pill */}
            <button
              type="button"
              onClick={() => handleOpenAI('summary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Assistant</span>
            </button>

            {/* My Documents Pill */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Documents</span>
            </button>
          </nav>

          {/* Right Group: Theme Toggle & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Moon/Sun) */}
            <button
              type="button"
              onClick={() => dispatch(toggleDarkMode())}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div
                onClick={() => navigate('/dashboard')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all shrink-0 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-500 text-white text-xs font-bold"
                title={user?.name || user?.email || 'User Profile'}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {(user?.name || user?.email || 'U')
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase() || '')
                      .join('')}
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openAuthModal({ mode: 'login' }))}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* -----------------------------------------------------------------------
            2. MAIN TWO-TIER WORKSPACE (Left Sidebars + Canvas + Floating Dock)
        ------------------------------------------------------------------------ */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* ===================================================================
              A. TIER 1: FAR-LEFT SLIM ICON STRIP (~68px) (Desktop Only)
          ==================================================================== */}
          <aside className="hidden md:flex w-[68px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col items-center py-4 justify-between shrink-0 select-none z-20">
            {/* Top Navigation Icons */}
            <div className="flex flex-col items-center gap-5 w-full px-2">
              {/* Templates */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidebarTab('templates');
                  setIsSidebarOpen(true);
                }}
                className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${
                  activeSidebarTab === 'templates' && isSidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-[10px]">Templates</span>
              </button>

              {/* Design */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidebarTab('design');
                  setIsSidebarOpen(true);
                }}
                className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${
                  activeSidebarTab === 'design' && isSidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span className="text-[10px]">Design</span>
              </button>

              {/* Sections */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidebarTab('sections');
                  setIsSidebarOpen(true);
                }}
                className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${
                  activeSidebarTab === 'sections' && isSidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="text-[10px]">Sections</span>
              </button>

              {/* Inspector (Mode B) */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidebarTab('inspector');
                  setIsSidebarOpen(true);
                }}
                className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${
                  activeSidebarTab === 'inspector' && isSidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title="Canvas Element Inspector"
              >
                <Sliders className="w-5 h-5" />
                <span className="text-[10px]">Inspector</span>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidebarTab('settings');
                  setIsSidebarOpen(true);
                }}
                className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${
                  activeSidebarTab === 'settings' && isSidebarOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px]">Settings</span>
              </button>
            </div>

            {/* Bottom Upgrade with Golden Crown */}
            <div className="w-full px-2">
              <button
                type="button"
                onClick={() => handleOpenAI('summary')}
                className="flex flex-col items-center gap-1 w-full py-2 text-slate-500 hover:text-amber-500 transition-colors group cursor-pointer"
                title="Upgrade to Pro"
              >
                <Crown className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  Upgrade
                </span>
              </button>
            </div>
          </aside>

          {/* ===================================================================
              B. TIER 2: SECONDARY PANEL (~310px Desktop / Full-screen Sheet on Mobile)
          ==================================================================== */}
          {isSidebarOpen && (
            <aside className="fixed inset-0 z-40 bg-white dark:bg-slate-900 md:relative md:w-[310px] md:z-10 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full shrink-0 transition-all select-none overflow-hidden">
              {/* Mobile Drawer Top Header with Done Button */}
              <div className="flex md:hidden items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                <span className="font-bold text-sm text-slate-800 dark:text-white capitalize">
                  {activeSidebarTab === 'sections'
                    ? 'Edit CV Content'
                    : activeSidebarTab === 'inspector'
                    ? 'Element Inspector'
                    : activeSidebarTab === 'templates'
                    ? 'Choose Template'
                    : activeSidebarTab === 'design'
                    ? 'Design & Styling'
                    : 'Document Settings'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold active:scale-95 shadow cursor-pointer"
                >
                  Done ✕
                </button>
              </div>
              {/* --- 1. TEMPLATES VIEW (Exact 3-Column Grid in Reference Image) --- */}
              {activeSidebarTab === 'templates' && (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Header */}
                  <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">
                        Templates
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Collapse panel"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Choose from our professional designs
                    </p>

                    {/* Dynamic Category Filter Pills */}
                    <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs scrollbar-none">
                      {categoriesList.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setTemplateFilter(category)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                            templateFilter === category
                              ? 'bg-blue-600 text-white shadow-sm'
                              : category === 'Multiple-Page CVs'
                                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3-Column Thumbnail Grid */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-2.5">
                      {filteredTemplates.map((tmpl) => {
                        const isSelected = activeTemplateId === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => handleSelectTemplate(tmpl.id)}
                            className="flex flex-col items-center group cursor-pointer"
                          >
                            {/* Card Box */}
                            <div
                              className={`relative w-full aspect-[3/4] bg-white dark:bg-slate-800 rounded-lg border shadow-sm transition-all overflow-hidden flex flex-col p-1.5 ${
                                isSelected
                                  ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-bold z-10 ${
                                  tmpl.isOnePage !== false
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                }`}
                              >
                                {tmpl.isOnePage !== false ? '1P' : 'MP'}
                              </span>
                              {/* Blue Checkmark Badge on Active Card */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10 animate-fade-in">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}

                              {/* Miniature Mockup Layout Lines */}
                              <div className="w-full h-full flex flex-col gap-1 opacity-80 pointer-events-none">
                                {/* Header miniature */}
                                <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-700 pb-1">
                                  <div
                                    className="w-3.5 h-3.5 rounded-full shrink-0"
                                    style={{ backgroundColor: tmpl.thumbnailColor || '#2563eb' }}
                                  />
                                  <div className="flex-1 space-y-0.5">
                                    <div className="w-10 h-1 bg-slate-400 rounded-full" />
                                    <div className="w-6 h-0.5 bg-slate-300 rounded-full" />
                                  </div>
                                </div>
                                {/* Body miniature */}
                                <div className="flex gap-1 flex-1 pt-0.5">
                                  <div className="w-1/3 flex flex-col gap-0.5">
                                    <div className="w-full h-1 bg-slate-200 rounded" />
                                    <div className="w-3/4 h-1 bg-slate-200 rounded" />
                                    <div className="w-full h-1 bg-slate-200 rounded" />
                                  </div>
                                  <div className="w-2/3 flex flex-col gap-0.5">
                                    <div className="w-full h-1 bg-slate-300 rounded" />
                                    <div className="w-5/6 h-0.5 bg-slate-200 rounded" />
                                    <div className="w-full h-0.5 bg-slate-200 rounded" />
                                    <div className="w-4/5 h-0.5 bg-slate-200 rounded" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Label */}
                            <span
                              className={`text-[10px] mt-1 text-center truncate max-w-full font-medium ${
                                isSelected
                                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                                  : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                              }`}
                            >
                              {tmpl.name.replace(' (BDJobs)', '').replace('BD ', '')}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom AI Design Card from Reference Image */}
                    <div className="pt-2">
                      <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Try AI-Powered Design</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Let AI create a perfect CV design for you!
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenAI('generate')}
                          className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>Generate with AI</span>
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. DESIGN VIEW (Color Palette, Typography, Margins) --- */}
              {activeSidebarTab === 'design' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">Design & Styling</h2>
                      <p className="text-[11px] text-slate-400">Customize visual appearance & colors</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Primary Color Swatches */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        Accent Color
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {colorSwatches.map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => dispatch(updateDesign({ primaryColor: swatch.hex }))}
                            className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                              currentCV?.design?.primaryColor === swatch.hex
                                ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-105'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.label}
                          >
                            {currentCV?.design?.primaryColor === swatch.hex && (
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Typography Font
                      </label>
                      <select
                        value={currentCV?.design?.fontFamily || 'Inter'}
                        onChange={(e) => dispatch(updateDesign({ fontFamily: e.target.value }))}
                        className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Inter">Inter (Apple Modern Sans)</option>
                        <option value="Merriweather">Merriweather (Classic Editorial Serif)</option>
                        <option value="Poppins">Poppins (Clean Geometric)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Tech Terminal)</option>
                      </select>
                    </div>

                    {/* Font Scale */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Text Scale
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map((scale) => (
                          <button
                            key={scale}
                            type="button"
                            onClick={() => dispatch(updateDesign({ fontSize: scale }))}
                            className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                              (currentCV?.design?.fontSize || 'medium') === scale
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Change Profile Photo Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setPhotoModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Upload & Crop Profile Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 3. SECTIONS VIEW (Sortable Drag & Drop and Form Fields) --- */}
              {activeSidebarTab === 'sections' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">CV Sections</h2>
                      <p className="text-[11px] text-slate-400">Reorder & edit content fields</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <SortableSectionList />
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <SectionFormEditor onOpenPhotoModal={() => setPhotoModalOpen(true)} />
                    </div>
                  </div>
                </div>
              )}

              {/* --- 4. SETTINGS VIEW (Title, Presets, ATS Score) --- */}
              {activeSidebarTab === 'settings' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-white">Document Settings</h2>
                      <p className="text-[11px] text-slate-400">Paper, title & template presets</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Document Title */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Resume Title
                      </label>
                      <input
                        type="text"
                        value={currentCV?.title || ''}
                        onChange={(e) => dispatch(updateTitle(e.target.value))}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                        placeholder="My Executive CV"
                      />
                    </div>

                    {/* Presets */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        Sample Presets
                      </label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setCVData({ ...DANIEL_CARTER_CV }));
                            dispatch(
                              showToast({
                                message: 'Loaded Daniel Carter demo profile!',
                                type: 'success',
                              })
                            );
                          }}
                          className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center justify-between"
                        >
                          <span>Load Daniel Carter (Modern Blue)</span>
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setCVData({ ...TAHMIDUR_RAHMAN_CV }));
                            dispatch(
                              showToast({
                                message: 'Loaded Bangladeshi Corporate recruiter demo profile!',
                                type: 'success',
                              })
                            );
                          }}
                          className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center justify-between"
                        >
                          <span>Load BD Recruiter (Tahmidur)</span>
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setCVData({ ...INITIAL_CV_DATA }));
                            dispatch(
                              showToast({
                                message: 'Started fresh with a clean blank document!',
                                type: 'info',
                              })
                            );
                          }}
                          className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-between"
                        >
                          <span>Start Blank Resume</span>
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Paper Size */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Paper Dimensions
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['A4', 'Letter'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => dispatch(updateDesign({ pageSize: size }))}
                            className={`py-1.5 rounded-lg text-xs font-medium border ${
                              (currentCV?.design?.pageSize || 'A4') === size
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {size} {size === 'A4' ? '(International)' : '(US)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ATS Badge */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white">
                        <span>ATS Compliance Score</span>
                        <span className="text-emerald-600 font-mono">98 / 100</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Semantic hierarchy passes Taleo, Workday, and BDJobs parsing algorithms.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 5. INSPECTOR VIEW (Mode B Visual Element Formatting) --- */}
              {activeSidebarTab === 'inspector' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <EditorInspector onOpenPhotoModal={() => setPhotoModalOpen(true)} />
                </div>
              )}
            </aside>
          )}

          {/* ===================================================================
              C. CENTER WORKSPACE: CANVAS & TOP/BOTTOM TOOLBARS
          ==================================================================== */}
          <main className="flex-1 bg-[#f4f5f9] dark:bg-slate-950/90 flex flex-col h-full overflow-hidden relative min-w-0">
            {/* -----------------------------------------------------------------
                TOP CANVAS TOOLBAR (Undo/Redo, Zoom, Device Selector, Save, Export)
            ------------------------------------------------------------------ */}
            <div className="h-12 px-4 flex items-center justify-between shrink-0 z-10 select-none">
              {/* Left Group: Undo / Redo + Zoom Dropdown */}
              <div className="flex items-center gap-2">
                {/* Left Sidebar Toggle Button (Desktop Only) */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`hidden md:flex p-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
                    isSidebarOpen
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                  }`}
                  title={isSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
                >
                  {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                </button>

                {/* Undo, Redo & Divider Container */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <button
                    type="button"
                    disabled={past.length === 0}
                    onClick={() => dispatch(undo())}
                    className="p-1 rounded hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={future.length === 0}
                    onClick={() => dispatch(redo())}
                    className="p-1 rounded hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-1" />

                  {/* Zoom Dropdown (100% ▾) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setZoomDropdownOpen(!zoomDropdownOpen)}
                      className="flex items-center gap-1 text-xs font-medium hover:text-slate-900 dark:hover:text-white px-1 py-0.5"
                    >
                      <span>{Math.round(previewScale * 100)}%</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {zoomDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-30 animate-fade-in text-xs">
                        {zoomPresets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              if (preset.value === 'fit') {
                                handleFitZoom();
                              } else {
                                dispatch(setPreviewScale(preset.value));
                              }
                              setZoomDropdownOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                          >
                            <span>{preset.label}</span>
                            {preset.value !== 'fit' &&
                              Math.round(previewScale * 100) === Math.round(preset.value * 100) && (
                                <Check className="w-3 h-3 text-blue-600" />
                              )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Group: Device Selector [Desktop] [Tablet] [Mobile] */}
              <div className="hidden sm:flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'desktop'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Desktop Canvas (A4 Standard)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('tablet')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'tablet'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Tablet Screen (~768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'mobile'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Mobile View (~390px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Right Group: Save Changes, Export Dropdown, and Action Dock Toggle */}
              <div className="flex items-center gap-2">
                {/* Right Actions Dock Toggle Button (Desktop Only) */}
                <button
                  type="button"
                  onClick={() => setIsRightDockOpen(!isRightDockOpen)}
                  className={`hidden md:flex p-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
                    isRightDockOpen
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                  }`}
                  title={isRightDockOpen ? 'Hide Right Action Dock' : 'Show Right Action Dock'}
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* [✔ Save Changes] Pill Button with saveStatus tracking */}
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all active:scale-95 cursor-pointer"
                  title={
                    saveStatus === 'error'
                      ? 'Error saving changes. Click to retry.'
                      : saveStatus === 'unsaved'
                      ? 'Unsaved changes. Click to save now.'
                      : 'All changes saved.'
                  }
                >
                  {saveStatus === 'saving' || isAutosaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  ) : saveStatus === 'error' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  ) : saveStatus === 'unsaved' ? (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span className="hidden sm:inline">
                    {saveStatus === 'saving' || isAutosaving
                      ? 'Saving...'
                      : saveStatus === 'error'
                      ? 'Save Error'
                      : saveStatus === 'unsaved'
                      ? 'Save Changes'
                      : 'Saved'}
                  </span>
                  <span className="sm:hidden">
                    {saveStatus === 'saving' || isAutosaving
                      ? '...'
                      : saveStatus === 'error'
                      ? 'Retry'
                      : saveStatus === 'unsaved'
                      ? 'Save*'
                      : 'Saved'}
                  </span>
                </button>

                {/* [📥 Export ▾] Blue/Indigo Pill Button from Reference Image */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
                  </button>

                  {exportDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-30 animate-fade-in text-xs">
                      <button
                        type="button"
                        onClick={handlePreviewPDF}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60"
                      >
                        <Eye className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-semibold">Preview Generated PDF</div>
                          <div className="text-[10px] text-slate-400">Inspect exact PDF binary</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportPDF}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-rose-500" />
                        <div>
                          <div className="font-semibold">Download PDF</div>
                          <div className="text-[10px] text-slate-400">Vector print-ready</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportDOCX}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center gap-2"
                      >
                        <FileDown className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-semibold">Download Word (.docx)</div>
                          <div className="text-[10px] text-slate-400">Fully editable document</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Version Conflict Banner (cross-device safety) */}
            {versionConflict && (
              <div className="mx-3 sm:mx-6 mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-100 z-20 shrink-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{versionConflict.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReloadLatestCloud}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-semibold hover:bg-amber-100 cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reload Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualSave({ forceOverwrite: true })}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer"
                  >
                    Keep My Edits
                  </button>
                </div>
              </div>
            )}

            {/* Overflow Beyond Limit Banner */}
            {onePageFit.isOnePageTemplate && onePageFit.isOverflowingBeyondLimit && (
              <div className="mx-4 mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-fade-in z-10">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>
                    <strong>Content exceeds 1-page capacity (~{onePageFit.wordCount} words):</strong> In a strict 1-page template, text beyond the minimum readable scale floor may spill or be trimmed.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setTemplateId('bd-corporate-standard'));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-sm transition-all"
                  >
                    Switch to Multi-Page
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAI('summary')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer transition-all"
                  >
                    Condense Content
                  </button>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------------------
                DOCUMENT CANVAS (Centered, Scaled, Fully Click-to-Edit WYSIWYG)
            ------------------------------------------------------------------ */}
            <div
              ref={canvasScrollContainerRef}
              className="flex-1 overflow-auto p-1.5 sm:p-6 md:p-8 relative select-text"
            >
              <div className="w-fit min-w-full flex justify-center py-2 sm:py-4 px-0.5 sm:px-2">
                <div
                  className="shrink-0 transition-all duration-150"
                  style={{
                    width: `${Math.round((devicePreview === 'mobile' ? 400 : devicePreview === 'tablet' ? 680 : 794) * previewScale)}px`,
                    minHeight: `${Math.round(1123 * previewScale)}px`,
                  }}
                >
                  {/* Device Frame Wrapper (for Desktop, Tablet, Mobile) */}
                  <div
                    className={`transition-all duration-300 ${
                      devicePreview === 'mobile'
                        ? 'border-[10px] border-slate-800 rounded-[38px] p-2 bg-slate-800 shadow-2xl'
                        : devicePreview === 'tablet'
                        ? 'border-[12px] border-slate-700 rounded-[28px] p-2 bg-slate-700 shadow-2xl'
                        : 'shadow-2xl rounded-sm'
                    } bg-white overflow-hidden max-w-full`}
                    style={{
                      width: `${devicePreview === 'mobile' ? 400 : devicePreview === 'tablet' ? 680 : 794}px`,
                      minHeight: '1123px',
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'top left',
                      boxSizing: 'border-box',
                    }}
                  >
                    <RenderCVTemplate
                      cvData={currentCV}
                      scale={1}
                      onOpenPhotoModal={() => setPhotoModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                BOTTOM PAGE NAVIGATOR & ONE-PAGE FIT GUIDANCE
            ------------------------------------------------------------------ */}
            <div className="min-h-10 flex flex-wrap items-center justify-center gap-2 px-3 shrink-0 z-10 pointer-events-none pb-16 md:pb-2">
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm rounded-full px-3 py-1 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 pointer-events-auto">
                <span className="font-semibold text-[11px] tracking-wide">
                  {onePageFit.isOnePageTemplate
                    ? `Page 1 / ${onePageFit.estimatedPages || 1}`
                    : 'Multi-Page Layout'}
                </span>

                {onePageFit.isOnePageTemplate && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      onePageFit.isOverflowingBeyondLimit
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                        : onePageFit.status === 'overflow'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : onePageFit.status === 'tight'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                    title={onePageFit.suggestions?.[0] || 'Fits comfortably on one A4 page'}
                  >
                    {onePageFit.isOverflowingBeyondLimit
                      ? `Exceeds 1-Page Limit (~${onePageFit.wordCount}w)`
                      : onePageFit.status === 'overflow'
                        ? `Exceeds 1 Page (~${onePageFit.wordCount}w)`
                        : onePageFit.status === 'tight'
                          ? `Tight 1-Page (${onePageFit.percentUsed}%)`
                          : `1-Page Fit (${onePageFit.percentUsed}%)`}
                  </span>
                )}

                {onePageFit.isOnePageTemplate && (onePageFit.isOverflowingBeyondLimit || onePageFit.status === 'overflow') && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setTemplateId('bd-corporate-standard'));
                      }}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Switch to Multi-Page
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => handleOpenAI('summary')}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Condense Content
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ===============================================================
                D. FAR-RIGHT FLOATING ACTION DOCK (Exact Match to Reference Image - Desktop Only)
            ================================================================ */}
            {isRightDockOpen && (
              <div className="hidden md:block absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200/80 dark:border-slate-700 rounded-2xl py-3 px-2 flex flex-col items-center gap-3.5 relative">
                  {/* Minimize dock button */}
                  <button
                    type="button"
                    onClick={() => setIsRightDockOpen(false)}
                    className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center text-[10px] hover:scale-110 transition-transform cursor-pointer"
                    title="Minimize Dock"
                  >
                    ×
                  </button>
                {/* 1. Edit */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveActionDock('edit');
                    setActiveSidebarTab('sections');
                    setIsSidebarOpen(true);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                    activeActionDock === 'edit'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                  }`}
                  title="Direct Inline Editing Mode"
                >
                  <MousePointer className="w-4 h-4" />
                  <span className="text-[10px]">Edit</span>
                </button>

                {/* 2. Move */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveActionDock('move');
                    setActiveSidebarTab('sections');
                    setIsSidebarOpen(true);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                    activeActionDock === 'move'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                  }`}
                  title="Move / Reorder Sections"
                >
                  <Move className="w-4 h-4" />
                  <span className="text-[10px]">Move</span>
                </button>

                {/* 3. Add */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveActionDock('add');
                    setActiveSidebarTab('sections');
                    setIsSidebarOpen(true);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                    activeActionDock === 'add'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                  }`}
                  title="Add Section / Entry"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px]">Add</span>
                </button>

                {/* 4. Color */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveActionDock('color');
                    setActiveSidebarTab('design');
                    setIsSidebarOpen(true);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                    activeActionDock === 'color'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                  }`}
                  title="Color & Typography Styles"
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-[10px]">Color</span>
                </button>

                {/* 5. Download */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
                  title="Instant PDF Export"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-[10px]">Download</span>
                </button>
              </div>
            </div>
          )}
          </main>
        </div>

        {/* ===================================================================
            MOBILE BOTTOM NAVIGATION BAR (Native Mobile Experience for Smartphones)
        ==================================================================== */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-30 flex items-center justify-around px-2 select-none shadow-lg">
          {/* 1. Templates Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveSidebarTab('templates');
              setIsSidebarOpen(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              isSidebarOpen && activeSidebarTab === 'templates'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Templates</span>
          </button>

          {/* 2. Design Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveSidebarTab('design');
              setIsSidebarOpen(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              isSidebarOpen && activeSidebarTab === 'design'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Design</span>
          </button>

          {/* 3. Edit Sections Tab (Center Floating Action Badge) */}
          <button
            type="button"
            onClick={() => {
              setActiveSidebarTab('sections');
              setIsSidebarOpen(true);
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 -mt-4 mb-0.5 active:scale-95 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Edit</span>
          </button>

          {/* 4. Fit / Zoom Tab */}
          <button
            type="button"
            onClick={() => {
              if (previewScale < 0.6) {
                dispatch(setPreviewScale(0.85));
              } else if (previewScale < 0.9) {
                dispatch(setPreviewScale(1.0));
              } else {
                handleFitZoom();
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            title="Toggle Zoom / Fit"
          >
            <Eye className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">
              {Math.round(previewScale * 100)}%
            </span>
          </button>

          {/* 5. Export Tab (Opens Mobile Choice Sheet) */}
          <button
            type="button"
            onClick={() => setMobileExportSheetOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-blue-600 dark:text-blue-400 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">Export</span>
          </button>
        </nav>

        {/* Mobile Export Choice Bottom Sheet */}
        {mobileExportSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:hidden animate-fade-in"
            onClick={() => setMobileExportSheetOpen(false)}
          >
            <div
              className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 dark:border-slate-800 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2" />
              <div className="text-center pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Export Document
                </h4>
                <p className="text-xs text-slate-500">
                  Select your desired download format:
                </p>
              </div>

              {/* Preview PDF Option */}
              <button
                type="button"
                onClick={() => {
                  setMobileExportSheetOpen(false);
                  handlePreviewPDF();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Preview Generated PDF
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inspect exact binary document before saving
                  </div>
                </div>
              </button>

              {/* PDF Option */}
              <button
                type="button"
                onClick={() => {
                  setMobileExportSheetOpen(false);
                  handleExportPDF();
                }}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                    Download PDF Document
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    High-res vector print format • BDJobs & global standard
                  </div>
                </div>
              </button>

              {/* Word DOCX Option */}
              <button
                type="button"
                onClick={() => {
                  setMobileExportSheetOpen(false);
                  handleExportDOCX();
                }}
                className="w-full p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-blue-950 dark:text-blue-200">
                    Download Word Document (.docx)
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-blue-400">
                    Microsoft Word editable doc • All BD & executive sections
                  </div>
                </div>
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setMobileExportSheetOpen(false)}
                className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      {/* AI Assistant Generator Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      {/* Profile Photo Upload & Crop Modal */}
      <PhotoUploadCropModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />

      {/* Payment & Export Authorization Modal */}
      <PaymentExportModal
        isOpen={paymentModalState.isOpen}
        onClose={() =>
          setPaymentModalState((prev) => ({ ...prev, isOpen: false }))
        }
        exportType={paymentModalState.exportType}
        cvId={paymentModalState.cvId}
        cvTitle={paymentModalState.cvTitle}
        onSuccess={() => {
          const retry = paymentModalState.retryExport;
          setPaymentModalState((prev) => ({ ...prev, isOpen: false }));
          if (typeof retry === 'function') retry();
        }}
      />

      {/* Explicit PDF Binary Preview Modal (only triggered via Preview button) */}
      <PDFPreviewModal
        isOpen={pdfPreviewModalOpen}
        onClose={() => setPdfPreviewModalOpen(false)}
        pdfUrl={previewPdfUrl}
        filename={`${(currentCV?.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}.pdf`}
        onDownload={() => {
          setPdfPreviewModalOpen(false);
          handleExportPDF();
        }}
        isDownloading={isExporting}
      />
    </div>
  );
};

export default CVEditorPage;
