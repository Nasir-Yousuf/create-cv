import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  setDesktopTab,
  setPreviewScale,
  showToast,
  openAIModal,
} from '../../store/uiSlice';
import cvService from '../../services/cvService';
import exportService from '../../services/exportService';
import { RenderCVTemplate } from '../../templates';
import SortableSectionList from './components/SortableSectionList';
import SectionFormEditor from './components/SectionFormEditor';
import AdvancedLayoutControls from './components/AdvancedLayoutControls';
import PhotoUploadCropModal from './components/PhotoUploadCropModal';
import Button from '../../components/common/Button';
import {
  Save,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Layout,
  Sliders,
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
} from 'lucide-react';

export const CVEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { currentCV, cvId, isDirty, past, future, isAutosaving, lastSavedAt } = useSelector(
    (state) => state.cv
  );
  const { mobileViewMode, desktopTab, previewScale } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [editorMode, setEditorMode] = useState('standard'); // 'standard' | 'advanced'
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
          // Local storage autosave for guests
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

  // Export PDF directly
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      dispatch(showToast({ message: 'Generating high-resolution vector PDF...', type: 'info' }));
      const blob = await exportService.exportPDF(currentCV);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentCV.title || 'Resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(showToast({ message: 'PDF downloaded successfully!', type: 'success' }));
    } catch (err) {
      // Client-side print fallback if backend export is offline
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Export DOCX directly
  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      dispatch(showToast({ message: 'Compiling Microsoft Word document...', type: 'info' }));
      const blob = await exportService.exportDOCX(currentCV);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentCV.title || 'Resume'}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(showToast({ message: 'Word document downloaded successfully!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'DOCX generation failed. Please try PDF.', type: 'error' }));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          {/* Back & Document Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={currentCV.title || ''}
                onChange={(e) => dispatch(updateTitle(e.target.value))}
                className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 truncate max-w-[180px] sm:max-w-xs"
                placeholder="Resume Title..."
              />
              {/* Autosave Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
                {isAutosaving ? (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Mode Toggle (Standard Form vs Advanced Design) */}
          <div className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setEditorMode('standard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                editorMode === 'standard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Standard Editor
            </button>
            <button
              onClick={() => setEditorMode('advanced')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                editorMode === 'advanced'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Advanced Design
            </button>
          </div>

          {/* Action Tools: Undo, Redo, AI Trigger, Export */}
          <div className="flex items-center gap-2 shrink-0">
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

            {/* AI Assistant Button */}
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={() => dispatch(openAIModal({ mode: 'generate' }))}
              className="hidden sm:inline-flex"
            >
              AI Assistant
            </Button>

            {/* Export Dropdown / Buttons */}
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              isLoading={isExporting}
              onClick={handleExportPDF}
              title="Download Vector PDF"
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

      {/* Main Responsive Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SPLIT VIEW: Left Controls */}
        <div
          className={`w-full lg:w-[480px] xl:w-[540px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-65px)] overflow-hidden shrink-0 ${
            mobileViewMode === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Controls Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {editorMode === 'standard' ? 'Resume Sections & Content' : 'Visual Design & Layout'}
            </h2>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
              {currentCV.templateId}
            </span>
          </div>

          {/* Dynamic Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {editorMode === 'standard' ? (
              <>
                <SortableSectionList />
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <SectionFormEditor onOpenPhotoModal={() => setPhotoModalOpen(true)} />
                </div>
              </>
            ) : (
              <AdvancedLayoutControls onOpenPhotoModal={() => setPhotoModalOpen(true)} />
            )}
          </div>
        </div>

        {/* CENTER / RIGHT PANE: Live Scaled A4 Preview Sheet */}
        <div
          className={`flex-1 bg-slate-200/80 dark:bg-slate-950 flex flex-col h-[calc(100vh-65px)] overflow-y-auto ${
            mobileViewMode !== 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Viewport Toolbar */}
          <div className="sticky top-0 z-20 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Live Recruiter Preview</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                {currentCV.design?.pageSize || 'A4'}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => dispatch(setPreviewScale(previewScale - 0.1))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 min-w-[40px] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => dispatch(setPreviewScale(previewScale + 0.1))}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => dispatch(setPreviewScale(0.95))}
                className="p-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                title="Reset zoom"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Scaled Live Sheet Render */}
          <div className="flex-1 p-4 sm:p-8 flex justify-center items-start overflow-x-auto">
            <div className="shadow-2xl transition-all duration-200">
              <RenderCVTemplate cvData={currentCV} scale={previewScale} />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Matching image3.png) */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            dispatch(setMobileViewMode('edit'));
            setEditorMode('standard');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'edit'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Fill Resume</span>
        </button>

        <button
          onClick={() => {
            dispatch(setMobileViewMode('design'));
            setEditorMode('advanced');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'design'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Design</span>
        </button>

        <button
          onClick={() => dispatch(setMobileViewMode('preview'))}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            mobileViewMode === 'preview'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Preview & Export</span>
        </button>
      </div>

      {/* Photo Upload and Crop Modal */}
      <PhotoUploadCropModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};

export default CVEditorPage;
