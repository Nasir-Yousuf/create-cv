import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCVData,
  setCVId,
  updateTitle,
  undo,
  redo,
  setSavingState,
} from '../../store/cvSlice';
import {
  setMobileViewMode,
  setPreviewScale,
  showToast,
  openAIModal,
} from '../../store/uiSlice';
import cvService from '../../services/cvService';
import exportService from '../../services/exportService';
import { RenderCVTemplate } from '../../templates';
import SortableSectionList from './components/SortableSectionList';
import SectionFormEditor from './components/SectionFormEditor';
import EditorInspector from './components/EditorInspector';
import PhotoUploadCropModal from './components/PhotoUploadCropModal';
import Button from '../../components/common/Button';
import {
  Undo2,
  Redo2,
  Download,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Edit3,
  Palette,
  CheckCircle2,
  Clock,
  Layers,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  PanelLeft,
  PanelRight,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';

export const CVEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasContainerRef = useRef(null);

  const { currentCV, cvId, isDirty, past, future, isAutosaving } = useSelector(
    (state) => state.cv
  );
  const { mobileViewMode, previewScale } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Auto-calculate optimal fit zoom based on available screen space
  const handleFitZoom = () => {
    const leftWidth = leftSidebarOpen ? (window.innerWidth >= 1280 ? 384 : 320) : 0;
    const rightWidth = inspectorOpen ? 320 : 0;
    const availableWidth = window.innerWidth - leftWidth - rightWidth - 64;
    // Standard A4 sheet is 794px wide
    const optimalScale = Math.min(1.0, Math.max(0.45, availableWidth / 820));
    dispatch(setPreviewScale(Math.round(optimalScale * 100) / 100));
  };

  // Set initial fit zoom on mount
  useEffect(() => {
    handleFitZoom();
  }, [leftSidebarOpen, inspectorOpen]);

  // Keyboard shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch(redo());
        } else {
          dispatch(undo());
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        dispatch(redo());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Debounced Autosave (saves to backend if authenticated)
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(async () => {
      dispatch(setSavingState(true));
      try {
        if (isAuthenticated && cvId && !cvId.startsWith('sample-')) {
          await cvService.updateCV(cvId, currentCV);
        } else {
          localStorage.setItem('novacv_draft', JSON.stringify(currentCV));
        }
        dispatch(setSavingState(false));
      } catch (err) {
        console.warn('Autosave warning:', err.message);
        dispatch(setSavingState(false));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentCV, isDirty, cvId, isAuthenticated, dispatch]);

  // Export PDF directly using single-source rendering architecture
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      dispatch(
        showToast({
          message: 'Rendering 1:1 vector PDF matching live preview...',
          type: 'info',
        })
      );
      const blob = await exportService.exportPDF(currentCV);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(currentCV.title || 'Resume').replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(
        showToast({
          message: 'PDF generated and downloaded successfully!',
          type: 'success',
        })
      );
    } catch (err) {
      console.warn('Backend PDF generation fallback:', err.message);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Export DOCX directly
  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      dispatch(
        showToast({
          message: 'Compiling genuine Microsoft Word (DOCX) document...',
          type: 'info',
        })
      );
      const blob = await exportService.exportDOCX(currentCV);
      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(currentCV.title || 'Resume').replace(/\s+/g, '_')}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(
        showToast({
          message: 'Word document downloaded successfully!',
          type: 'success',
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: 'DOCX generation failed. Please try PDF.',
          type: 'error',
        })
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Breadcrumbs, Title & Left Panel Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Toggle Left Sidebar Button */}
            <button
              type="button"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={`p-1.5 rounded-xl border text-xs font-semibold hidden lg:flex items-center gap-1.5 transition-all ${
                leftSidebarOpen
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title={leftSidebarOpen ? 'Hide Sections Panel' : 'Show Sections Panel'}
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
              <span className="hidden xl:inline">Sections</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-slate-400 hidden md:inline">
                Dashboard &gt;
              </span>
              <input
                type="text"
                value={currentCV.title || ''}
                onChange={(e) => dispatch(updateTitle(e.target.value))}
                className="font-bold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:outline-none px-1 py-0.5 truncate max-w-[140px] sm:max-w-xs"
                placeholder="Resume Title..."
              />

              {/* Autosave Pill */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {isAutosaving ? (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Clock className="w-3 h-3 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Tools: Undo, Redo, Zoom, AI, Inspector Toggle, Export */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Undo / Redo */}
            <div className="hidden sm:flex items-center gap-1 pr-2 border-r border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={past.length === 0}
                onClick={() => dispatch(undo())}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={future.length === 0}
                onClick={() => dispatch(redo())}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* AI Generator Button */}
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={() => dispatch(openAIModal({ mode: 'generate' }))}
              className="hidden sm:inline-flex"
            >
              AI Generator
            </Button>

            {/* Right Inspector Toggle Button */}
            <button
              type="button"
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs font-semibold hidden lg:flex items-center gap-1.5 transition-all ${
                inspectorOpen
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title={inspectorOpen ? 'Hide Formatting Inspector' : 'Show Formatting Inspector'}
            >
              {inspectorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
              <span className="hidden xl:inline">Formatting</span>
            </button>

            {/* Export Buttons */}
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              isLoading={isExporting}
              onClick={handleExportPDF}
              title="Download High-Res PDF"
            >
              PDF
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={FileDown}
              isLoading={isExporting}
              onClick={handleExportDOCX}
              title="Download Microsoft Word Document"
            >
              DOCX
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Responsive Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. LEFT COLUMN: Accordion & Drag-and-Drop Sections */}
        {leftSidebarOpen && (
          <div
            className={`w-full lg:w-80 xl:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-65px)] overflow-hidden shrink-0 transition-all ${
              mobileViewMode === 'preview' || mobileViewMode === 'design'
                ? 'hidden lg:flex'
                : 'flex'
            }`}
          >
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sections & Fields
              </h2>
              <button
                type="button"
                onClick={() => setLeftSidebarOpen(false)}
                className="hidden lg:block text-slate-400 hover:text-slate-600"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <SortableSectionList />
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <SectionFormEditor onOpenPhotoModal={() => setPhotoModalOpen(true)} />
              </div>
            </div>
          </div>
        )}

        {/* 2. CENTER COLUMN: Live Document Canvas with Direct WYSIWYG Editing */}
        <div
          ref={canvasContainerRef}
          className={`flex-1 bg-slate-200/90 dark:bg-slate-950 flex flex-col h-[calc(100vh-65px)] overflow-hidden min-w-0 ${
            mobileViewMode === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Canvas Toolbar with Zoom controls */}
          <div className="sticky top-0 z-20 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
              <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Interactive Canvas</span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                Click any text on the CV to edit directly
              </span>
            </div>

            {/* Zoom Controls & Fit Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => dispatch(setPreviewScale(Math.max(0.4, previewScale - 0.1)))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 min-w-[36px] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => dispatch(setPreviewScale(Math.min(1.5, previewScale + 0.1)))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleFitZoom}
                className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 rounded border border-emerald-200/60 dark:border-emerald-800 hover:bg-emerald-100 ml-1"
                title="Fit to Screen Width"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Centered A4 Canvas Sheet with Responsive Auto-Scroll */}
          <div className="flex-1 p-4 sm:p-8 flex justify-center items-start overflow-auto">
            <div className="shadow-2xl transition-transform duration-200 origin-top">
              <RenderCVTemplate
                cvData={currentCV}
                scale={previewScale}
                onOpenPhotoModal={() => setPhotoModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Inspector & Typography Formatting Panel */}
        {inspectorOpen && (
          <div
            className={`hidden lg:flex shrink-0 h-[calc(100vh-65px)] ${
              mobileViewMode === 'design' ? 'flex' : ''
            }`}
          >
            <EditorInspector onOpenPhotoModal={() => setPhotoModalOpen(true)} />
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => dispatch(setMobileViewMode('edit'))}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'edit'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Form</span>
        </button>

        <button
          onClick={() => dispatch(setMobileViewMode('preview'))}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'preview'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>

        <button
          onClick={() => dispatch(setMobileViewMode('design'))}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'design'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Design</span>
        </button>
      </div>

      {/* Profile Photo Upload & Crop Modal */}
      <PhotoUploadCropModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};

export default CVEditorPage;
