import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  X,
  FileCheck,
  LayoutGrid,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { closeExportModal, updateExportState } from '../../store/uiSlice';

export const ExportStatusModal = ({ onRetry, onAlternativeExport }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exportModal } = useSelector((state) => state.ui);

  const {
    isOpen,
    format = 'pdf',
    isGenerating,
    stage = 'preparing',
    progress = 0,
    statusMessage = '',
    error = null,
  } = exportModal || {};

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isPDF = format === 'pdf';
  const isError = stage === 'error' || !!error;
  const isSuccess = stage === 'ready' || progress >= 100;

  const STAGES = [
    { key: 'preparing', label: 'Preparing document & data' },
    { key: 'rendering', label: 'Rendering typography & layout' },
    { key: 'generating', label: isPDF ? 'Generating vector PDF document' : 'Compiling Microsoft Word (.docx)' },
    { key: 'ready', label: 'Ready for download' },
  ];

  const getStageStatus = (stageKey, index) => {
    if (isError) return 'error';
    const stageOrder = ['preparing', 'rendering', 'generating', 'ready'];
    const currentIndex = stageOrder.indexOf(stage);

    if (stage === 'ready' || progress >= 100) return 'completed';
    if (currentIndex > index) return 'completed';
    if (currentIndex === index) return 'active';
    return 'pending';
  };

  const handleClose = () => {
    dispatch(closeExportModal());
  };

  const handleRetryClick = () => {
    if (typeof onRetry === 'function') {
      onRetry();
    } else {
      handleClose();
    }
  };

  const handleAlternativeClick = () => {
    if (typeof onAlternativeExport === 'function') {
      onAlternativeExport(isPDF ? 'docx' : 'pdf');
    } else {
      handleClose();
    }
  };

  const handleSelectTemplate = () => {
    handleClose();
    navigate('/templates');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* macOS Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isGenerating ? undefined : handleClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
          />

          {/* macOS Window Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/90 hover:opacity-80 transition-opacity" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90 hover:opacity-80 transition-opacity" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90 hover:opacity-80 transition-opacity" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isError ? 'Export Notice' : isSuccess ? 'Export Complete' : 'Exporting Document'}
              </span>
              {!isGenerating && (
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {isGenerating && <div className="w-3.5 h-3.5" />}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* ERROR STATE */}
              {isError ? (
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {error?.title || 'Document Export Interrupted'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {error?.message ||
                          'Something went wrong while compiling your document. Your CV data and all recent edits are completely safe.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Your changes have been safely saved to your account.
                    </span>
                  </div>

                  {/* Action Choices */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleRetryClick}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Try Again
                    </button>

                    <button
                      onClick={handleAlternativeClick}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Export as {isPDF ? 'Microsoft Word (.docx)' : 'Vector PDF'} instead
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSelectTemplate}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
                      >
                        <LayoutGrid className="w-3 h-3" />
                        Change Template
                      </button>
                      <button
                        onClick={handleClose}
                        className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
                      >
                        Return to Editor
                      </button>
                    </div>
                  </div>
                </div>
              ) : isSuccess ? (
                /* SUCCESS STATE */
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Document Ready!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Your {isPDF ? 'PDF' : 'Word (.docx)'} document has been generated and downloaded.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* IN-PROGRESS STATE */
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {isPDF ? 'Generating Vector PDF' : 'Compiling Microsoft Word'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {statusMessage || 'Preparing high-resolution document...'}
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Stage Checklist */}
                  <div className="space-y-2.5 pt-1">
                    {STAGES.map((s, idx) => {
                      const stageStatus = getStageStatus(s.key, idx);
                      return (
                        <div
                          key={s.key}
                          className="flex items-center gap-3 text-xs transition-colors"
                        >
                          {stageStatus === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : stageStatus === 'active' ? (
                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                            </div>
                          )}
                          <span
                            className={
                              stageStatus === 'completed'
                                ? 'text-slate-500 dark:text-slate-400 line-through'
                                : stageStatus === 'active'
                                ? 'font-semibold text-slate-900 dark:text-white'
                                : 'text-slate-400 dark:text-slate-600'
                            }
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExportStatusModal;

