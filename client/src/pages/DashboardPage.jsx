import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCVData, setCVId } from '../store/cvSlice';
import { showToast, openExportModal, updateExportState, closeExportModal } from '../store/uiSlice';
import cvService from '../services/cvService';
import exportService from '../services/exportService';
import ExportStatusModal from '../components/common/ExportStatusModal';
import {
  Plus,
  Sparkles,
  FileText,
  Copy,
  Trash2,
  ExternalLink,
  Edit3,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { INITIAL_CV_DATA } from '@shared/constants/cvDefaults.js';

export const DashboardPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [cvList, setCvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cvId: null, title: '' });

  // Sample fallback CVs for previewing the dashboard when guest or database is empty
  const sampleCVs = [
    {
      _id: 'sample-1',
      title: 'Senior Software Engineer CV',
      templateId: 'modern-minimal',
      updatedAt: new Date().toISOString(),
      personalInfo: {
        fullName: user?.name || 'Alex Morgan',
        jobTitle: 'Senior Full Stack Software Engineer',
      },
      design: {
        primaryColor: '#4f46e5',
      },
    },
    {
      _id: 'sample-2',
      title: 'Executive Leadership Profile',
      templateId: 'executive-slate',
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      personalInfo: {
        fullName: user?.name || 'Alex Morgan',
        jobTitle: 'Director of Engineering',
      },
      design: {
        primaryColor: '#0f172a',
      },
    },
  ];

  const fetchCVs = async () => {
    if (!isAuthenticated) {
      setCvList(sampleCVs);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await cvService.getCVs();
      if (res.data && res.data.length > 0) {
        setCvList(res.data);
      } else {
        setCvList(sampleCVs); // Friendly initial sample so dashboard is never barren
      }
    } catch (err) {
      console.warn('Could not load CVs from backend, using local sample:', err.message);
      setCvList(sampleCVs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, [isAuthenticated]);

  const handleCreateNew = () => {
    dispatch(setCVData({ ...INITIAL_CV_DATA }));
    dispatch(setCVId(null));
    navigate('/builder');
  };

  const handleEditCV = async (cv) => {
    try {
      if (isAuthenticated && !cv._id.startsWith('sample-')) {
        const fullCV = await cvService.getCVById(cv._id);
        dispatch(setCVData(fullCV.data));
        dispatch(setCVId(cv._id));
      } else {
        dispatch(
          setCVData({
            ...INITIAL_CV_DATA,
            title: cv.title,
            templateId: cv.templateId || 'modern-minimal',
          })
        );
        dispatch(setCVId(cv._id));
      }
      navigate('/builder');
    } catch (err) {
      dispatch(showToast({ message: 'Failed to load resume details', type: 'error' }));
    }
  };

  const handleDuplicate = async (cv) => {
    try {
      if (isAuthenticated && !cv._id.startsWith('sample-')) {
        const res = await cvService.duplicateCV(cv._id);
        setCvList([res.data, ...cvList]);
        dispatch(showToast({ message: 'Resume duplicated successfully', type: 'success' }));
      } else {
        const copy = {
          ...cv,
          _id: `sample-${Date.now()}`,
          title: `${cv.title} (Copy)`,
          updatedAt: new Date().toISOString(),
        };
        setCvList([copy, ...cvList]);
        dispatch(showToast({ message: 'Resume duplicated', type: 'success' }));
      }
    } catch (err) {
      dispatch(showToast({ message: 'Could not duplicate resume', type: 'error' }));
    }
  };

  const handleDownloadPDF = async (cv) => {
    try {
      const fullCv = { ...INITIAL_CV_DATA, ...cv };
      dispatch(
        openExportModal({
          format: 'pdf',
          stage: 'preparing',
          progress: 15,
          statusMessage: `Preparing vector PDF for ${fullCv.title || 'Resume'}...`,
        })
      );

      await exportService.exportPDF(fullCv, '', 'cv-export-sheet', (update) => {
        if (typeof update === 'object') {
          dispatch(
            updateExportState({
              stage: update.stage || 'rendering',
              progress: update.progress || 50,
              statusMessage: update.message || 'Processing...',
            })
          );
        } else {
          dispatch(updateExportState({ statusMessage: String(update) }));
        }
      });

      dispatch(
        updateExportState({
          stage: 'ready',
          progress: 100,
          isGenerating: false,
          statusMessage: 'PDF downloaded successfully!',
        })
      );
      setTimeout(() => {
        dispatch(closeExportModal());
      }, 1500);
    } catch (err) {
      console.error('Dashboard PDF download error:', err);
      dispatch(
        updateExportState({
          stage: 'error',
          isGenerating: false,
          error: {
            title: 'PDF Generation Interrupted',
            message: 'We were unable to render this resume. You can open it in the editor to review and download.',
          },
        })
      );
    }
  };

  const confirmDelete = async () => {
    const { cvId } = deleteModal;
    try {
      if (isAuthenticated && !cvId.startsWith('sample-')) {
        await cvService.deleteCV(cvId);
      }
      setCvList(cvList.filter((item) => item._id !== cvId));
      dispatch(showToast({ message: 'Resume deleted', type: 'info' }));
    } catch (err) {
      dispatch(showToast({ message: 'Failed to delete resume', type: 'error' }));
    } finally {
      setDeleteModal({ isOpen: false, cvId: null, title: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Greeting & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.name || 'Professional'}!
              </h1>
              {user?.plan === 'pro' ? (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                  Pro Plan
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Starter Plan
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your career documents, tailor ATS keywords, and download high-resolution exports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/templates">
              <Button variant="outline" size="md" icon={Layers}>
                Browse Templates
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleCreateNew}
            >
              New Resume
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Resumes</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cvList.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">ATS Readiness</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              98% <CheckCircle2 className="w-4 h-4" />
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Assistant</span>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              Active <Sparkles className="w-4 h-4 text-blue-500" />
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Exports Available</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">PDF + DOCX</p>
          </div>
        </div>

        {/* Saved Resumes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Saved Resumes
            </h2>
            <span className="text-xs text-slate-500">
              {cvList.length} {cvList.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : cvList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvList.map((cv) => (
                <div
                  key={cv._id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Miniature Header Preview */}
                  <div
                    onClick={() => handleEditCV(cv)}
                    className="h-44 p-5 cursor-pointer relative flex flex-col justify-between border-b border-slate-100 dark:border-slate-800/80 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40 transition-colors"
                    style={{
                      borderTop: `4px solid ${cv.design?.primaryColor || '#4f46e5'}`,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded">
                          {cv.templateId || 'modern-minimal'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cv.updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2 line-clamp-1">
                        {cv.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cv.personalInfo?.fullName || 'Full Name'} • {cv.personalInfo?.jobTitle || 'Profession'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <span>Click to edit in builder</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditCV(cv)}
                      icon={Edit3}
                    >
                      Edit
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicate(cv)}
                        title="Duplicate"
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(cv)}
                        title="Download PDF"
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteModal({ isOpen: true, cvId: cv._id, title: cv.title })}
                        title="Delete"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No resumes created yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Start by creating your first resume with our AI writing assistant or choose from 10+ professional templates.
              </p>
              <Button variant="primary" size="md" icon={Plus} onClick={handleCreateNew}>
                Create My First Resume
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cvId: null, title: '' })}
        title="Delete Resume"
        subtitle={`Are you sure you want to permanently delete "${deleteModal.title}"? This action cannot be undone.`}
        maxWidth="max-w-md"
      >
        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setDeleteModal({ isOpen: false, cvId: null, title: '' })}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            icon={Trash2}
            onClick={confirmDelete}
          >
            Delete Permanently
          </Button>
        </div>
      </Modal>

      {/* Modern macOS Export Status & Error Modal */}
      <ExportStatusModal />
    </div>
  );
};

export default DashboardPage;

