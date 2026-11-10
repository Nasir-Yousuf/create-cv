import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authSuccess } from '../store/authSlice';
import authService from '../services/authService';
import paymentService from '../services/paymentService';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MessageCircle,
  DollarSign,
  Users,
  Smartphone,
  ChevronLeft,
  KeyRound,
  AlertCircle,
  Mail,
  Lock,
  UserCheck,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: authUser, isAuthenticated: isUserLoggedIn } = useSelector((state) => state.auth);

  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('resumecraft_admin_key') || '');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [loginMode, setLoginMode] = useState('passkey'); // 'passkey' | 'credentials'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Main Tabs: 'payments' | 'users'
  const [currentTab, setCurrentTab] = useState('payments');

  // Payments Data & Filter
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [paymentSearch, setPaymentSearch] = useState('');

  // Users Data & Filter
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'pro' | 'free'
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [userActionLoadingId, setUserActionLoadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Auto-verify if already logged in as Admin user
  useEffect(() => {
    if (isUserLoggedIn && authUser?.role === 'admin') {
      setIsAuthenticated(true);
      fetchPayments('01816550751');
      fetchUsers('01816550751');
      return;
    }

    if (adminKey) {
      verifyAndLoad(adminKey);
    }
  }, [isUserLoggedIn, authUser]);

  const verifyAndLoad = async (key) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await paymentService.verifyAdminPasskey(key);
      setIsAuthenticated(true);
      localStorage.setItem('resumecraft_admin_key', key);
      await Promise.all([fetchPayments(key), fetchUsers(key)]);
    } catch (err) {
      setIsAuthenticated(false);
      setAuthError('Invalid Admin Passkey. Enter your admin phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = (e) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setAdminKey(passkeyInput.trim());
    verifyAndLoad(passkeyInput.trim());
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await authService.login(emailInput.trim(), passwordInput);
      dispatch(authSuccess(res));
      if (res.user?.role === 'admin') {
        setIsAuthenticated(true);
        setAdminKey('01816550751');
        localStorage.setItem('resumecraft_admin_key', '01816550751');
        await Promise.all([fetchPayments('01816550751'), fetchUsers('01816550751')]);
      } else {
        setAuthError('This account does not have Admin privileges.');
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('resumecraft_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
  };

  const fetchPayments = async (keyToUse) => {
    try {
      const res = await paymentService.getAdminPayments(keyToUse || adminKey);
      if (res.success) {
        setPayments(res.payments || []);
        setPaymentStats(res.stats || { total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
      }
    } catch (err) {
      console.warn('Fetch payments error:', err);
    }
  };

  const fetchUsers = async (keyToUse) => {
    setUsersLoading(true);
    try {
      const res = await paymentService.adminGetUsers(keyToUse || adminKey);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.warn('Fetch users error:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchPayments(), fetchUsers()]);
    setIsLoading(false);
  };

  // Approve a payment
  const handleApprovePayment = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await paymentService.approvePayment(id, adminKey);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: 'approved', approvedAt: new Date() } : p))
        );
        setPaymentStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          approved: prev.approved + 1,
          totalRevenue: prev.totalRevenue + 10,
        }));
        // Also refresh users list so plan status reflects immediately
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving payment');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject a payment
  const handleRejectPayment = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await paymentService.rejectPayment(id, adminKey);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: 'rejected' } : p))
        );
        setPaymentStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          rejected: prev.rejected + 1,
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting payment');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete payment record
  const handleDeletePayment = async (id) => {
    if (!window.confirm('Delete this payment record permanently?')) return;
    try {
      await paymentService.deletePayment(id, adminKey);
      setPayments((prev) => prev.filter((p) => p._id !== id));
      setPaymentStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      alert('Error deleting payment');
    }
  };

  // Toggle or Update User Plan (Approve to Pro / Revoke)
  const handleUpdateUserPlan = async (userId, targetPlan) => {
    setUserActionLoadingId(userId);
    try {
      const res = await paymentService.adminUpdateUserPlan(userId, targetPlan, adminKey);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, plan: targetPlan } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user plan');
    } finally {
      setUserActionLoadingId(null);
    }
  };

  const handleCopyTrx = (trx, id) => {
    navigator.clipboard.writeText(trx);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Payments
  const filteredPayments = payments.filter((p) => {
    const matchesFilter = paymentFilter === 'all' || p.status === paymentFilter;
    const q = paymentSearch.toLowerCase();
    const matchesSearch =
      !q ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.customerEmail?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      userFilter === 'all' ||
      (userFilter === 'pro' && (u.plan === 'pro' || u.plan === 'enterprise')) ||
      (userFilter === 'free' && u.plan === 'free');
    const q = userSearch.toLowerCase();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Total resumes across all users
  const totalCVsCount = users.reduce((sum, u) => sum + (u.cvCount || 0), 0);
  const proUsersCount = users.filter((u) => u.plan === 'pro' || u.plan === 'enterprise').length;

  // If not authenticated as admin, show unified login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 select-none">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#E2136E] to-blue-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              ResumeCraft Admin Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your Admin credentials to verify payments and manage user approvals.
            </p>
          </div>

          {/* Login Option Switcher: Passkey vs Email/Password */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('passkey');
                setAuthError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                loginMode === 'passkey'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Phone Passkey
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('credentials');
                setAuthError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                loginMode === 'credentials'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Email & Password
            </button>
          </div>

          {loginMode === 'passkey' ? (
            <form onSubmit={handlePasskeyLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Passkey (Phone Number)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter 01816550751"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Passkey...</span>
                  </>
                ) : (
                  <span>Access Admin Dashboard</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@resumecraft.com"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In as Admin</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              ← Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col select-none">
      {/* 1. Header Bar */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
            title="Back to site"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Admin Management Center</span>
              <span className="text-[10px] bg-[#E2136E] text-white px-2 py-0.5 rounded-full font-bold">
                01816550751
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Payment Approvals & User Access Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={refreshAll}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
            title="Refresh payments and users"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
          >
            Lock Admin
          </button>
        </div>
      </header>

      {/* 2. Top Navigation Tabs: Payments vs Users */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6">
        <div className="flex gap-2 max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => setCurrentTab('payments')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'payments'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>bKash Payments & Approvals</span>
            {paymentStats.pending > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {paymentStats.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('users')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'users'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Users & Accounts</span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {users.length}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ===================================================================
            TAB 1: PAYMENTS & APPROVALS VIEW
        ==================================================================== */}
        {currentTab === 'payments' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Pending */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {paymentStats.pending}
                  </span>
                  {paymentStats.pending > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Awaiting TrxID check</p>
              </div>

              {/* Card 2: Approved */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Approved Payments</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {paymentStats.approved}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Unlocked exports</p>
              </div>

              {/* Card 3: Total Orders */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Total Orders</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {paymentStats.total}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">bKash & coupons</p>
              </div>

              {/* Card 4: Total Revenue */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Collected Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#E2136E]" />
                </div>
                <span className="text-2xl font-black text-[#E2136E]">
                  ৳ {paymentStats.totalRevenue}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">BDT verified in bKash</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPaymentFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      paymentFilter === tab
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab} {tab === 'pending' && paymentStats.pending > 0 ? `(${paymentStats.pending})` : ''}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search TrxID, phone, name..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Sender Phone</th>
                      <th className="py-3 px-4">bKash TrxID</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-slate-400">
                          No payment submissions found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Date */}
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}{' '}
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800 dark:text-white">
                              {item.customerName || 'Guest User'}
                            </div>
                            {item.customerEmail && (
                              <div className="text-[10px] text-slate-400">{item.customerEmail}</div>
                            )}
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                            {item.phone}
                          </td>

                          {/* Transaction ID */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {item.transactionId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyTrx(item.transactionId, item._id)}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Copy TrxID"
                              >
                                {copiedId === item._id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Amount / Method */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#E2136E]">
                              ৳ {item.amount}
                            </span>{' '}
                            <span className="text-[10px] text-slate-400">({item.paymentMethod})</span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {item.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                              </span>
                            ) : item.status === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse">
                                <Clock className="w-3 h-3" /> Pending Check
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleApprovePayment(item._id)}
                                  disabled={actionLoadingId === item._id}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                  title="Approve and Unlock Export for this User"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {item.status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleRejectPayment(item._id)}
                                  disabled={actionLoadingId === item._id}
                                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
                                  title="Reject TrxID"
                                >
                                  Reject
                                </button>
                              )}

                              {item.phone && item.phone.length >= 10 && (
                                <a
                                  href={`https://wa.me/88${item.phone.replace(/^0/, '')}?text=Hello%20${encodeURIComponent(item.customerName || '')},%20your%20CV%20export%20has%20been%20approved%20on%20ResumeCraft!%20You%20can%20now%20download%20your%20PDF%20and%20Word%20files.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                                  title="Send WhatsApp confirmation to customer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeletePayment(item._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            TAB 2: REGISTERED USERS & ACCOUNTS VIEW
        ==================================================================== */}
        {currentTab === 'users' && (
          <>
            {/* User Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Total Registered Users</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {users.length}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Accounts in MongoDB</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Approved / Pro Users</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {proUsersCount}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Can export unlimited PDF/Word</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Free Tier Users</span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-2xl font-black text-slate-600 dark:text-slate-300">
                  {users.length - proUsersCount}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Prompted for 10 Tk export</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Total Saved CVs</span>
                  <FileText className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {totalCVsCount}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Cloud CVs synced in DB</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pro', 'free'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setUserFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      userFilter === tab
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'all' ? 'All Users' : tab === 'pro' ? 'Pro / Approved' : 'Free Tier'}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name, email..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Export Status</th>
                      <th className="py-3 px-4">Saved CVs</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Approve / Toggle Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-slate-400">
                          {usersLoading ? 'Loading users...' : 'No users found matching your criteria.'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isPro = u.plan === 'pro' || u.plan === 'enterprise';
                        const isAdmin = u.role === 'admin';

                        return (
                          <tr
                            key={u._id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* User Avatar + Name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm shrink-0">
                                  {u.name?.charAt(0) || 'U'}
                                </div>
                                <div className="font-semibold text-slate-800 dark:text-white">
                                  {u.name}
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                              {u.email}
                            </td>

                            {/* Role */}
                            <td className="py-3 px-4">
                              {isAdmin ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                  <ShieldCheck className="w-3 h-3" /> Admin
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-medium">User</span>
                              )}
                            </td>

                            {/* Export Status Badge */}
                            <td className="py-3 px-4">
                              {isPro ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3 h-3" /> Approved to Export
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  Free (Unapproved)
                                </span>
                              )}
                            </td>

                            {/* Saved CVs */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>{u.cvCount || 0} document{u.cvCount === 1 ? '' : 's'}</span>
                              </div>
                            </td>

                            {/* Joined Date */}
                            <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>

                            {/* Approve / Revoke Action Button */}
                            <td className="py-3 px-4 text-right">
                              {!isPro ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateUserPlan(u._id, 'pro')}
                                  disabled={userActionLoadingId === u._id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-50"
                                  title="Manually grant this user lifetime export approval"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve Export (Make Pro)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateUserPlan(u._id, 'free')}
                                  disabled={userActionLoadingId === u._id || isAdmin}
                                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-semibold text-xs transition-all active:scale-95 ml-auto cursor-pointer disabled:opacity-40"
                                  title="Revoke Pro export privileges"
                                >
                                  Revoke Pro
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPaymentsPage;
