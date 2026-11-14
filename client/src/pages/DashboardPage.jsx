import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { setCVData, setCVSyncMeta, resetCV } from '../store/cvSlice';
import { showToast } from '../store/uiSlice';
import { syncUserProfile } from '../store/authSlice';
import cvService from '../services/cvService';
import paymentService from '../services/paymentService';
import authService from '../services/authService';
import { runProtectedExport } from '../utils/runProtectedExport';
import PaymentExportModal from '../components/common/PaymentExportModal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { resolveTemplateMeta } from '@shared/constants/cvDefaults.js';
import { RenderCVTemplate } from '../templates';
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Edit3,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  Search,
  RotateCcw,
  History,
  Pencil,
  Check,
  X,
  Activity,
  CreditCard,
  Clock,
  XCircle,
  BookmarkPlus,
  Eye,
} from 'lucide-react';

const PAYMENT_BADGE = {
  pending: { label: 'Pending Verification', cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800', icon: XCircle },
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'trash' | 'payments' | 'activity'
  const [searchQuery, setSearchQuery] = useState('');
  const [cvList, setCvList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [entitlements, setEntitlements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyCvId, setBusyCvId] = useState(null);

  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState('');

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cvId: null,
    title: '',
    permanent: false,
  });

  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    cv: null,
    versions: [],
    loading: false,
    checkpointLabel: '',
  });

  const [paymentModalState, setPaymentModalState] = useState({
    isOpen: false,
    exportType: 'pdf',
    cvId: null,
    cvTitle: '',
    retryExport: null,
  });

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    cv: null,
    cvData: null,
    loading: false,
  });

  const formatLastModified = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400 && d.getDate() === now.getDate()) {
      return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffSec < 172800) {
      return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [cvsRes, entRes, actRes, payRes, meRes] = await Promise.all([
        cvService.getCVs({
          trash: activeTab === 'trash',
          search: searchQuery.trim() || undefined,
        }),
        paymentService.getEntitlements().catch(() => null),
        cvService.getRecentActivity(25).catch(() => null),
        paymentService.getMyPayments().catch(() => null),
        authService.getMe().catch(() => null),
      ]);

      setCvList(Array.isArray(cvsRes?.data) ? cvsRes.data : []);
      if (entRes?.data) setEntitlements(entRes.data);
      if (actRes?.data) setActivityList(actRes.data);
      if (payRes?.data) setMyPayments(payRes.data);
      if (meRes?.user) dispatch(syncUserProfile(meRes.user));
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Unable to load cloud documents right now.',
          type: 'error',
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeTab, searchQuery, dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateNew = () => {
    dispatch(resetCV());
    navigate('/builder');
  };

  const handleEditCV = async (cv) => {
    setBusyCvId(cv._id);
    try {
      const fullCV = await cvService.getCVById(cv._id);
      if (fullCV?.data) {
        dispatch(setCVData(fullCV.data));
        dispatch(
          setCVSyncMeta({
            cvId: fullCV.data._id,
            version: fullCV.data.version || 1,
            isExportUnlocked: Boolean(fullCV.data.isExportUnlocked),
            unlockType: fullCV.data.unlockType || null,
          })
        );
        navigate(`/builder?cvId=${cv._id}`);
      }
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to load document.', type: 'error' }));
    } finally {
      setBusyCvId(null);
    }
  };

  const handlePreviewCV = async (cv) => {
    setPreviewModal({ isOpen: true, cv, cvData: null, loading: true });
    try {
      const res = await cvService.getCVById(cv._id);
      if (res?.data) {
        setPreviewModal({ isOpen: true, cv, cvData: res.data, loading: false });
      } else {
        throw new Error('Unable to fetch CV document');
      }
    } catch (err) {
      setPreviewModal({ isOpen: false, cv: null, cvData: null, loading: false });
      dispatch(showToast({ message: err.message || 'Could not load preview.', type: 'error' }));
    }
  };

  const handleDuplicate = async (cv) => {
    setBusyCvId(cv._id);
    try {
      await cvService.duplicateCV(cv._id);
      dispatch(showToast({ message: 'CV duplicated as a separate document.', type: 'success' }));
      await fetchDashboardData();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to duplicate CV.', type: 'error' }));
    } finally {
      setBusyCvId(null);
    }
  };

  const handleStartRename = (cv) => {
    setRenamingId(cv._id);
    setRenameText(cv.title || '');
  };

  const handleSaveRename = async (cv) => {
    const trimmed = renameText.trim();
    if (!trimmed) return;
    try {
      await cvService.updateCV(cv._id, { title: trimmed });
      setRenamingId(null);
      dispatch(showToast({ message: 'Document renamed.', type: 'success' }));
      await fetchDashboardData();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Rename failed.', type: 'error' }));
    }
  };

  const handleExportDocument = async (cv, format) => {
    setBusyCvId(cv._id);
    try {
      const res = await cvService.getCVById(cv._id);
      if (!res?.data) throw new Error('Unable to load document contents.');
      await runProtectedExport({
        dispatch,
        getState: store.getState,
        cvData: res.data,
        cvId: res.data._id,
        format,
        openPaymentModal: ({ cvId, cvTitle, format: payFmt, retryExport }) => {
          setPaymentModalState({
            isOpen: true,
            exportType: payFmt,
            cvId,
            cvTitle,
            retryExport,
          });
        },
        onExportSuccess: () => {
          fetchDashboardData();
        },
      });
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to prepare export.', type: 'error' }));
    } finally {
      setBusyCvId(null);
    }
  };

  const confirmDelete = async () => {
    const { cvId, permanent } = deleteModal;
    try {
      await cvService.deleteCV(cvId, { permanent });
      dispatch(
        showToast({
          message: permanent ? 'Document permanently deleted.' : 'Moved to Trash.',
          type: 'info',
        })
      );
      setDeleteModal({ isOpen: false, cvId: null, title: '', permanent: false });
      await fetchDashboardData();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Delete failed.', type: 'error' }));
    }
  };

  const handleRestoreFromTrash = async (cv) => {
    try {
      await cvService.restoreCV(cv._id);
      dispatch(showToast({ message: 'Document restored to Active CVs.', type: 'success' }));
      await fetchDashboardData();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Restore failed.', type: 'error' }));
    }
  };

  const openVersionHistory = async (cv) => {
    setHistoryModal({ isOpen: true, cv, versions: [], loading: true, checkpointLabel: '' });
    try {
      const res = await cvService.getVersions(cv._id);
      setHistoryModal((prev) => ({
        ...prev,
        versions: Array.isArray(res?.data) ? res.data : [],
        loading: false,
      }));
    } catch (err) {
      setHistoryModal((prev) => ({ ...prev, loading: false }));
      dispatch(showToast({ message: err.message || 'Failed to fetch history.', type: 'error' }));
    }
  };

  const handleCreateCheckpoint = async () => {
    if (!historyModal.cv) return;
    try {
      await cvService.createCheckpoint(
        historyModal.cv._id,
        historyModal.checkpointLabel.trim() || `Manual snapshot (${new Date().toLocaleTimeString()})`
      );
      const res = await cvService.getVersions(historyModal.cv._id);
      setHistoryModal((prev) => ({
        ...prev,
        versions: Array.isArray(res?.data) ? res.data : [],
        checkpointLabel: '',
      }));
      dispatch(showToast({ message: 'Version snapshot saved.', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Could not create snapshot.', type: 'error' }));
    }
  };

  const handleRestoreVersion = async (versionId) => {
    if (!historyModal.cv) return;
    try {
      await cvService.restoreVersion(historyModal.cv._id, versionId);
      dispatch(showToast({ message: 'Document restored to selected snapshot!', type: 'success' }));
      setHistoryModal({ isOpen: false, cv: null, versions: [], loading: false, checkpointLabel: '' });
      await fetchDashboardData();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to restore snapshot.', type: 'error' }));
    }
  };

  const freeLeft = Number(entitlements?.freeExportsRemaining ?? user?.freeExportsRemaining ?? 0);
  const paidLeft = Number(entitlements?.paidExportCredits ?? user?.paidExportCredits ?? 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar & Entitlements Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My Cloud Documents
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Signed in as <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> ({user?.email}) • Synced automatically across devices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {user?.role !== 'admin' && (
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Credits</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {freeLeft} Free + {paidLeft} Paid
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPaymentModalState({
                      isOpen: true,
                      exportType: 'pdf',
                      cvId: null,
                      cvTitle: 'Additional CV Export Credit',
                      retryExport: () => fetchDashboardData(),
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#E2136E] hover:bg-[#c91060] text-white font-bold text-[11px] cursor-pointer"
                >
                  + Add ৳10 Credit
                </button>
              </div>
            )}

            <Link to="/templates">
              <Button variant="secondary" iconLeft={Layers}>
                Browse Templates
              </Button>
            </Link>
            <Button variant="primary" iconLeft={Plus} onClick={handleCreateNew}>
              Create New CV
            </Button>
          </div>
        </div>

        {/* Navigation Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {[
              { id: 'active', label: 'Active CVs', icon: FileText },
              { id: 'trash', label: 'Trash', icon: Trash2 },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'activity', label: 'Activity', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {(activeTab === 'active' || activeTab === 'trash') && (
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CVs by title, name, or role..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* ACTIVE / TRASH CV LIST */}
        {(activeTab === 'active' || activeTab === 'trash') && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                    </div>
                    <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : cvList.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeTab === 'trash'
                      ? 'Trash is empty'
                      : searchQuery
                        ? 'No matching CVs found'
                        : 'No CVs saved to your cloud account yet'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {activeTab === 'trash'
                      ? 'Deleted resumes appear here for 30+ days so you can restore them anytime.'
                      : 'Start with a dedicated One-Page CV for students & freshers or choose a Multiple-Page executive template.'}
                  </p>
                </div>
                {activeTab === 'active' && (
                  <div className="pt-2 flex justify-center gap-2">
                    <Button variant="primary" iconLeft={Plus} onClick={handleCreateNew}>
                      Create Your First CV
                    </Button>
                    <Link to="/templates">
                      <Button variant="secondary">Explore Templates</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvList.map((cv) => {
                  const tmplMeta = resolveTemplateMeta(cv.templateId);
                  const isBusy = busyCvId === cv._id;
                  const isRenaming = renamingId === cv._id;
                  return (
                    <div
                      key={cv._id}
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
                    >
                      <div className="h-2 w-full" style={{ backgroundColor: cv.design?.primaryColor || tmplMeta.thumbnailColor || '#2563eb' }} />

                      <div className="p-5 space-y-3 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {isRenaming ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={renameText}
                                  onChange={(e) => setRenameText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(cv);
                                    if (e.key === 'Escape') setRenamingId(null);
                                  }}
                                  className="w-full px-2 py-1 text-xs rounded-lg border border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveRename(cv)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                                  title="Save title"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRenamingId(null)}
                                  className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {cv.title || 'Untitled Resume'}
                                </h3>
                                {activeTab === 'active' && (
                                  <button
                                    type="button"
                                    onClick={() => handleStartRename(cv)}
                                    className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer"
                                    title="Rename CV"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}

                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {cv.personalInfo?.fullName || 'Unnamed'} • {cv.personalInfo?.jobTitle || 'Role not set'}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                              cv.isExportUnlocked
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                            title={
                              cv.isExportUnlocked
                                ? 'Unlocked: unlimited free edits and re-downloads for this CV'
                                : 'Locked: uses 1st free credit or ৳10 credit on first export'
                            }
                          >
                            {cv.isExportUnlocked ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Unlocked
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                Locked
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: cv.design?.primaryColor || tmplMeta.thumbnailColor || '#2563eb' }}
                            />
                            {tmplMeta.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">
                            {tmplMeta.isOnePage !== false ? '1-Page' : 'Multi-Page'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            v{cv.version || 1}
                          </span>
                          {cv.versionSnapshots && cv.versionSnapshots.length > 0 && (
                            <button
                              type="button"
                              onClick={() => openVersionHistory(cv)}
                              className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
                              title="Saved Version Snapshots"
                            >
                              📸 {cv.versionSnapshots.length} snapshot{cv.versionSnapshots.length > 1 ? 's' : ''}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span className="flex items-center gap-1" title={new Date(cv.updatedAt).toLocaleString()}>
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatLastModified(cv.updatedAt)}
                          </span>
                          <span>Exports: {(cv.pdfExportCount || 0) + (cv.docxExportCount || 0)}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        {activeTab === 'active' ? (
                          <>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleEditCV(cv)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 cursor-pointer disabled:opacity-50"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handlePreviewCV(cv)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 cursor-pointer disabled:opacity-50"
                                title="Quick Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleExportDocument(cv, 'pdf')}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 cursor-pointer disabled:opacity-50"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleExportDocument(cv, 'docx')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 cursor-pointer disabled:opacity-50"
                                title="Download Word (.docx)"
                              >
                                DOCX
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openVersionHistory(cv)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                title="Version History"
                              >
                                <History className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDuplicate(cv)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                title="Duplicate CV"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    cvId: cv._id,
                                    title: cv.title,
                                    permanent: false,
                                  })
                                }
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                title="Move to Trash"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRestoreFromTrash(cv)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  cvId: cv._id,
                                  title: cv.title,
                                  permanent: true,
                                })
                              }
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Permanently</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Your bKash Payment History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track verification statuses for all submitted Transaction IDs.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setPaymentModalState({
                    isOpen: true,
                    exportType: 'pdf',
                    cvId: null,
                    cvTitle: 'New CV Export Credit',
                    retryExport: () => fetchDashboardData(),
                  })
                }
              >
                Submit bKash Payment (৳10)
              </Button>
            </div>

            {myPayments.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                No payment requests submitted yet. Your first CV export is free!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">TrxID</th>
                      <th className="py-2.5 pr-4 font-semibold">Sender Number</th>
                      <th className="py-2.5 pr-4 font-semibold">Amount</th>
                      <th className="py-2.5 pr-4 font-semibold">Status</th>
                      <th className="py-2.5 pr-4 font-semibold">Details / Reason</th>
                      <th className="py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {myPayments.map((p) => {
                      const badge = PAYMENT_BADGE[p.status] || PAYMENT_BADGE.pending;
                      const Icon = badge.icon;
                      return (
                        <tr key={p._id}>
                          <td className="py-3 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.transactionId}
                          </td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 font-mono">{p.phoneNumber || p.phone || '—'}</td>
                          <td className="py-3 pr-4 font-semibold">৳{p.amount || 10}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.cls}`}>
                              <Icon className="w-3 h-3" />
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-500">
                            {p.status === 'rejected' && p.rejectionReason
                              ? p.rejectionReason
                              : p.notes || '—'}
                          </td>
                          <td className="py-3 text-slate-500">
                            {new Date(p.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Account Activity
            </h2>
            {activityList.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No recent document activity logged.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activityList.map((act) => (
                  <div key={act._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {act.cvTitle || 'Account Action'}
                      </span>
                      <span className="mx-2 text-slate-400">•</span>
                      <span className="uppercase tracking-wider text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {String(act.action || '').replace(/_/g, ' ')}
                      </span>
                      {act.details && <p className="text-[11px] text-slate-500 mt-0.5">{act.details}</p>}
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cvId: null, title: '', permanent: false })}
        title={deleteModal.permanent ? 'Delete CV Permanently' : 'Move CV to Trash'}
        subtitle={
          deleteModal.permanent
            ? 'This permanently removes the CV and its version history. Export unlock records remain safe.'
            : 'You can restore trashed CVs anytime from the Trash tab.'
        }
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Document: <strong>{deleteModal.title || 'Untitled CV'}</strong>
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, cvId: null, title: '', permanent: false })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              {deleteModal.permanent ? 'Delete Forever' : 'Move to Trash'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Version History Modal */}
      <Modal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false, cv: null, versions: [], loading: false, checkpointLabel: '' })}
        title={`Version History • ${historyModal.cv?.title || 'CV'}`}
        subtitle="Create manual checkpoints or restore any previous version."
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={historyModal.checkpointLabel}
              onChange={(e) => setHistoryModal((prev) => ({ ...prev, checkpointLabel: e.target.value }))}
              placeholder="Checkpoint note (e.g. Tailored for Frontend Role)"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <Button variant="primary" size="sm" iconLeft={BookmarkPlus} onClick={handleCreateCheckpoint}>
              Save Snapshot
            </Button>
          </div>

          {historyModal.loading ? (
            <p className="text-xs text-slate-500 py-6 text-center">Loading version history...</p>
          ) : historyModal.versions.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No saved checkpoints yet. Snapshots are created on checkpoints and version restores.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {historyModal.versions.map((ver) => (
                <div
                  key={ver._id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 dark:text-white truncate">
                      v{ver.versionNumber || ver.version || 1} • {ver.label || 'Autosave Checkpoint'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatLastModified(ver.createdAt)} ({new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft={RotateCcw}
                    onClick={() => handleRestoreVersion(ver._id)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Quick Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {previewModal.cv?.title || 'CV Document Preview'}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                    {resolveTemplateMeta(previewModal.cv?.templateId).name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High-fidelity document preview • Ready for PDF & Word export
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModal({ isOpen: false, cv: null, cvData: null, loading: false })}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scaled Document Preview */}
            <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 flex justify-center items-start">
              {previewModal.loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Loading document preview...</p>
                </div>
              ) : previewModal.cvData ? (
                <div
                  className="shrink-0 shadow-2xl bg-white origin-top transition-transform my-2"
                  style={{
                    width: '675px', // ~0.85 scale of 794
                    minHeight: '954px', // ~0.85 scale of 1123
                  }}
                >
                  <div
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      transform: 'scale(0.85)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <RenderCVTemplate cvData={previewModal.cvData} scale={1} />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-12">Failed to render preview.</p>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  iconLeft={Edit3}
                  onClick={() => {
                    const targetCv = previewModal.cv;
                    setPreviewModal({ isOpen: false, cv: null, cvData: null, loading: false });
                    if (targetCv) handleEditCV(targetCv);
                  }}
                >
                  Edit in Builder
                </Button>
                <Button
                  variant="secondary"
                  iconLeft={Download}
                  onClick={() => {
                    const targetCv = previewModal.cv;
                    if (targetCv) handleExportDocument(targetCv, 'pdf');
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const targetCv = previewModal.cv;
                    if (targetCv) handleExportDocument(targetCv, 'docx');
                  }}
                >
                  DOCX
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={() => setPreviewModal({ isOpen: false, cv: null, cvData: null, loading: false })}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentExportModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState((prev) => ({ ...prev, isOpen: false }))}
        exportType={paymentModalState.exportType}
        cvId={paymentModalState.cvId}
        cvTitle={paymentModalState.cvTitle}
        onSuccess={() => {
          const retry = paymentModalState.retryExport;
          setPaymentModalState((prev) => ({ ...prev, isOpen: false }));
          if (typeof retry === 'function') retry();
        }}
      />
    </div>
  );
};

export default DashboardPage;
