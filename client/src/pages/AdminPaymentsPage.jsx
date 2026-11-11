import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { showToast, toggleDarkMode } from '../store/uiSlice';
import adminService from '../services/adminService';
import authService from '../services/authService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  DollarSign,
  Users,
  FileText,
  Activity,
  LayoutGrid,
  ChevronLeft,
  Eye,
  PlusCircle,
  UserX,
  UserCheck,
  Bell,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Download,
} from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  approved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.ui);

  const [activeTab, setActiveTab] = useState('payments'); // 'overview' | 'payments' | 'users' | 'activity' | 'templates'
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Payments state
  const [payments, setPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [busyPaymentId, setBusyPaymentId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payment: null, reason: '' });

  // Users state
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [busyUserId, setBusyUserId] = useState(null);
  const [userDetailModal, setUserDetailModal] = useState({
    isOpen: false,
    loading: false,
    data: null,
  });

  // Activity state
  const [activities, setActivities] = useState([]);

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [editingBadgeId, setEditingBadgeId] = useState(null);
  const [badgeInput, setBadgeInput] = useState('');

  const loadAnalyticsAndAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [anaRes, payRes, usrRes, actRes, tplRes] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getPayments({ status: paymentFilter, q: paymentSearch.trim() }),
        adminService.getUsers({ status: userFilter, q: userSearch.trim() }),
        adminService.getActivity(50),
        adminService.getTemplates(),
      ]);

      if (anaRes?.data) setAnalytics(anaRes.data);
      if (payRes?.data) setPayments(payRes.data);
      if (usrRes?.data) setUsers(usrRes.data);
      if (actRes?.data) setActivities(actRes.data);
      if (tplRes?.data) setTemplates(tplRes.data);
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to load admin dashboard data.',
          type: 'error',
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, paymentFilter, paymentSearch, userFilter, userSearch]);

  useEffect(() => {
    if (authUser?.role === 'admin') {
      loadAnalyticsAndAll();
    }
  }, [authUser, loadAnalyticsAndAll]);

  const handleApprovePayment = async (payment) => {
    setBusyPaymentId(payment._id);
    try {
      const res = await adminService.approvePayment(payment._id);
      dispatch(
        showToast({
          message: res?.message || `Approved TrxID ${payment.transactionId} (+1 credit granted).`,
          type: 'success',
        })
      );
      await loadAnalyticsAndAll();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Approval failed.', type: 'error' }));
    } finally {
      setBusyPaymentId(null);
    }
  };

  const submitRejectPayment = async (e) => {
    e.preventDefault();
    if (!rejectModal.payment) return;
    setBusyPaymentId(rejectModal.payment._id);
    try {
      await adminService.rejectPayment(rejectModal.payment._id, rejectModal.reason.trim());
      dispatch(showToast({ message: 'Payment marked as rejected.', type: 'info' }));
      setRejectModal({ isOpen: false, payment: null, reason: '' });
      await loadAnalyticsAndAll();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Rejection failed.', type: 'error' }));
    } finally {
      setBusyPaymentId(null);
    }
  };

  const handleToggleUserStatus = async (u) => {
    const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
    setBusyUserId(u._id);
    try {
      await adminService.updateUserStatus(u._id, nextStatus);
      dispatch(
        showToast({
          message: `${u.email} is now ${nextStatus}.`,
          type: nextStatus === 'active' ? 'success' : 'warning',
        })
      );
      await loadAnalyticsAndAll();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Status update failed.', type: 'error' }));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleGrantCredit = async (u, delta = 1) => {
    setBusyUserId(u._id);
    try {
      const res = await adminService.grantEntitlement(u._id, delta);
      dispatch(showToast({ message: res?.message || 'Updated paid credits.', type: 'success' }));
      await loadAnalyticsAndAll();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Could not update credits.', type: 'error' }));
    } finally {
      setBusyUserId(null);
    }
  };

  const openUserInspector = async (u) => {
    setUserDetailModal({ isOpen: true, loading: true, data: null });
    try {
      const res = await adminService.getUserDetail(u._id);
      setUserDetailModal({ isOpen: true, loading: false, data: res?.data || null });
    } catch (err) {
      setUserDetailModal({ isOpen: false, loading: false, data: null });
      dispatch(showToast({ message: err.message || 'Failed to load user details.', type: 'error' }));
    }
  };

  const handleUpdateTemplate = async (tmpl, updates) => {
    try {
      await adminService.updateTemplate(tmpl.templateId, updates);
      dispatch(showToast({ message: `Updated "${tmpl.name}".`, type: 'success' }));
      await loadAnalyticsAndAll();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Template update failed.', type: 'error' }));
    }
  };

  const handleAdminLogout = () => {
    authService.logout().catch(() => {});
    dispatch(logout());
    navigate('/');
  };

  const pendingCount = Number(analytics?.pendingPaymentsCount || 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top macOS Admin Bar */}
      <header className="sticky top-0 z-30 h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Site</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-[#E2136E] shrink-0" />
            <h1 className="text-xs sm:text-sm font-black tracking-tight truncate">
              ResumeCraft Admin Control Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('payments');
                setPaymentFilter('pending');
              }}
              className="px-2.5 py-1 rounded-full bg-[#E2136E] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm animate-pulse cursor-pointer"
            >
              <Bell className="w-3 h-3" />
              <span>{pendingCount} Pending</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadAnalyticsAndAll}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Refresh live data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => dispatch(toggleDarkMode())}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {authUser?.email}
          </span>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Registered Users', value: analytics?.totalUsers ?? 0, sub: `${analytics?.suspendedUsers ?? 0} suspended`, icon: Users, color: 'text-blue-600' },
            { label: 'Active CVs', value: analytics?.totalCVs ?? 0, sub: `${analytics?.unlockedCVs ?? 0} unlocked`, icon: FileText, color: 'text-indigo-600' },
            { label: 'PDF / DOCX', value: `${analytics?.totalPdfExports ?? 0} / ${analytics?.totalDocxExports ?? 0}`, sub: 'Total exports', icon: Download, color: 'text-emerald-600' },
            { label: 'Pending Review', value: pendingCount, sub: 'Awaiting check', icon: Clock, color: 'text-amber-600' },
            { label: 'Approved / Rej', value: `${analytics?.approvedPaymentsCount ?? 0} / ${analytics?.rejectedPaymentsCount ?? 0}`, sub: 'bKash requests', icon: CheckCircle2, color: 'text-teal-600' },
            { label: 'Revenue (BDT)', value: `৳${analytics?.totalCollectedRevenue ?? 0}`, sub: 'Verified total', icon: DollarSign, color: 'text-[#E2136E]' },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>{kpi.label}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-lg sm:text-xl font-black mt-1 text-slate-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{kpi.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'payments', label: `Payments (${pendingCount} Pending)`, icon: DollarSign },
            { id: 'users', label: `Users (${analytics?.totalUsers ?? users.length})`, icon: Users },
            { id: 'activity', label: 'Activity Feed', icon: Activity },
            { id: 'templates', label: `Templates (${templates.length})`, icon: LayoutGrid },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Pending Verification Queue</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-semibold text-[#E2136E] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
              {payments.filter((p) => p.status === 'pending').length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No pending bKash requests.</p>
              ) : (
                <div className="space-y-2.5">
                  {payments
                    .filter((p) => p.status === 'pending')
                    .slice(0, 5)
                    .map((p) => (
                      <div
                        key={p._id}
                        className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {p.transactionId} • ৳{p.amount || 10}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.userId?.email || p.customerEmail} • From {p.phoneNumber || p.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={busyPaymentId === p._id}
                            onClick={() => handleApprovePayment(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50"
                          >
                            Approve +1
                          </button>
                          <button
                            type="button"
                            disabled={busyPaymentId === p._id}
                            onClick={() => setRejectModal({ isOpen: true, payment: p, reason: '' })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Latest Platform Events</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Full Log
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {(analytics?.recentActivity || activities).slice(0, 8).map((act) => (
                  <div key={act._id} className="py-2 text-xs flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {act.userId?.email || 'System'}
                      </span>{' '}
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">
                        {String(act.action || '').replace(/_/g, ' ')}
                      </span>
                      {act.details && <p className="text-[11px] text-slate-500">{act.details}</p>}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(act.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPaymentFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                      paymentFilter === st
                        ? 'bg-[#E2136E] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search TrxID, email, phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No matching payment records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">TrxID</th>
                      <th className="py-2.5 pr-4 font-semibold">User</th>
                      <th className="py-2.5 pr-4 font-semibold">Sender Phone</th>
                      <th className="py-2.5 pr-4 font-semibold">Amount</th>
                      <th className="py-2.5 pr-4 font-semibold">Status</th>
                      <th className="py-2.5 pr-4 font-semibold">Review Info</th>
                      <th className="py-2.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payments.map((p) => {
                      const isBusy = busyPaymentId === p._id;
                      return (
                        <tr key={p._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                          <td className="py-3 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.transactionId}
                            {p.notes && (
                              <div className="font-sans font-normal text-[10px] text-slate-400">
                                {p.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {p.userId?.name || p.customerName || 'User'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {p.userId?.email || p.customerEmail}
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-mono">{p.phoneNumber || p.phone}</td>
                          <td className="py-3 pr-4 font-bold">৳{p.amount || 10}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                                STATUS_STYLES[p.status] || STATUS_STYLES.pending
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-[11px] text-slate-500">
                            {p.reviewedBy?.email && <div>By: {p.reviewedBy.email}</div>}
                            {p.rejectionReason && (
                              <div className="text-rose-600 dark:text-rose-400">Reason: {p.rejectionReason}</div>
                            )}
                            <div>{new Date(p.createdAt).toLocaleString()}</div>
                          </td>
                          <td className="py-3 text-right">
                            {p.status === 'pending' ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleApprovePayment(p)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    setRejectModal({ isOpen: true, payment: p, reason: '' })
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Reviewed</span>
                            )}
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

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'active', 'suspended'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setUserFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                      userFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 pr-4 font-semibold">User</th>
                    <th className="py-2.5 pr-4 font-semibold">Role & Status</th>
                    <th className="py-2.5 pr-4 font-semibold">CVs / Exports</th>
                    <th className="py-2.5 pr-4 font-semibold">Credits Left</th>
                    <th className="py-2.5 pr-4 font-semibold">Paid Total</th>
                    <th className="py-2.5 font-semibold text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => {
                    const isBusy = busyUserId === u._id;
                    const isAdminRow = u.role === 'admin';
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-3 pr-4 space-x-1">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase">
                            {u.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.status === 'suspended'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {u.cvCount || 0} CVs • {(u.pdfExports || 0) + (u.docxExports || 0)} downloads
                        </td>
                        <td className="py-3 pr-4 font-semibold">
                          {u.freeExportsRemaining || 0} Free + {u.paidExportCredits || 0} Paid
                        </td>
                        <td className="py-3 pr-4 font-bold text-emerald-600">
                          ৳{u.totalPaidBdt || 0} ({u.paymentCount || 0})
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openUserInspector(u)}
                              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Inspect
                            </button>
                            {!isAdminRow && (
                              <>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleGrantCredit(u, 1)}
                                  className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
                                  title="Grant +1 paid CV credit"
                                >
                                  <PlusCircle className="w-3 h-3" />
                                  +1 Credit
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`px-2 py-1 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 ${
                                    u.status === 'suspended'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                  }`}
                                >
                                  {u.status === 'suspended' ? (
                                    <>
                                      <UserCheck className="w-3 h-3" /> Reactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3 h-3" /> Suspend
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold">Global System Audit Log (Latest 50 Events)</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activities.map((act) => (
                <div key={act._id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {act.userId?.name || act.userId?.email || 'User'}
                    </span>{' '}
                    <span className="mx-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-300">
                      {String(act.action || '').replace(/_/g, ' ')}
                    </span>
                    {act.cvTitle && <span className="font-semibold">({act.cvTitle})</span>}
                    {act.details && <p className="text-[11px] text-slate-500 mt-0.5">{act.details}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATES MANAGER TAB */}
        {activeTab === 'templates' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold">Published CV Template Catalog</h2>
              <p className="text-xs text-slate-500">
                Toggle visibility, one-page defaults, featured badges, and classification metadata in MongoDB.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 pr-4 font-semibold">Template</th>
                    <th className="py-2.5 pr-4 font-semibold">Categories</th>
                    <th className="py-2.5 pr-4 font-semibold">Format</th>
                    <th className="py-2.5 pr-4 font-semibold">Badge</th>
                    <th className="py-2.5 font-semibold text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {templates.map((tpl) => (
                    <tr key={tpl.templateId} className={!tpl.isPublished ? 'opacity-50' : ''}>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-slate-900 dark:text-white">{tpl.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{tpl.templateId}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(tpl.categories || [tpl.category]).map((c) => (
                            <span
                              key={c}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() => handleUpdateTemplate(tpl, { isOnePage: !tpl.isOnePage })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                            tpl.isOnePage !== false
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {tpl.isOnePage !== false ? 'One-Page' : 'Multiple-Page'}
                        </button>
                      </td>
                      <td className="py-3 pr-4">
                        {editingBadgeId === tpl.templateId ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={badgeInput}
                              onChange={(e) => setBadgeInput(e.target.value)}
                              className="px-2 py-1 text-xs border rounded w-28 dark:bg-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateTemplate(tpl, { badge: badgeInput });
                                setEditingBadgeId(null);
                              }}
                              className="text-emerald-600 font-bold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBadgeId(tpl.templateId);
                              setBadgeInput(tpl.badge || '');
                            }}
                            className="text-slate-700 dark:text-slate-300 hover:underline cursor-pointer"
                          >
                            {tpl.badge || 'Set badge'}
                          </button>
                        )}
                      </td>
                      <td className="py-3 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateTemplate(tpl, { isPublished: !tpl.isPublished })
                          }
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                            tpl.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {tpl.isPublished ? 'Published' : 'Hidden'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Reject Payment Reason Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, payment: null, reason: '' })}
        title="Reject bKash Payment Request"
        subtitle={`TrxID: ${rejectModal.payment?.transactionId || ''}`}
      >
        <form onSubmit={submitRejectPayment} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Optional Rejection Reason (shown to user)
            </label>
            <input
              type="text"
              value={rejectModal.reason}
              onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g. TrxID not found in bKash statement / wrong amount"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejectModal({ isOpen: false, payment: null, reason: '' })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={busyPaymentId === rejectModal.payment?._id}>
              Confirm Reject
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Inspector Modal */}
      <Modal
        isOpen={userDetailModal.isOpen}
        onClose={() => setUserDetailModal({ isOpen: false, loading: false, data: null })}
        title={`User Account • ${userDetailModal.data?.user?.name || 'Inspect'}`}
        subtitle={userDetailModal.data?.user?.email || ''}
      >
        {userDetailModal.loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading user records...</p>
        ) : userDetailModal.data ? (
          <div className="space-y-4 pt-2 text-xs max-h-[65vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap justify-between gap-2">
              <span>Free Left: <strong>{userDetailModal.data.user.freeExportsRemaining}</strong></span>
              <span>Paid Credits: <strong>{userDetailModal.data.user.paidExportCredits}</strong></span>
              <span>Status: <strong>{userDetailModal.data.user.status}</strong></span>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                User CVs ({userDetailModal.data.cvs?.length || 0})
              </h4>
              <div className="space-y-1.5">
                {(userDetailModal.data.cvs || []).map((c) => (
                  <div
                    key={c._id}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold">{c.title}</span>{' '}
                      <span className="text-slate-400">({c.templateId})</span>
                      {c.isDeleted && <span className="ml-1 text-rose-500">[Trashed]</span>}
                    </div>
                    <span className={c.isExportUnlocked ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {c.isExportUnlocked ? `Unlocked (${c.unlockType})` : 'Locked'} • {c.pdfExportCount || 0} PDF / {c.docxExportCount || 0} DOCX
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Payments ({userDetailModal.data.payments?.length || 0})
              </h4>
              <div className="space-y-1.5">
                {(userDetailModal.data.payments || []).map((p) => (
                  <div
                    key={p._id}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <span className="font-mono font-bold">{p.transactionId} (৳{p.amount})</span>
                    <span className="uppercase font-bold text-[10px]">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AdminPaymentsPage;
