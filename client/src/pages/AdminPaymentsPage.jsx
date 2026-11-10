import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const navigate = useNavigate();

  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('resumecraft_admin_key') || '');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Check stored passkey on mount
  useEffect(() => {
    if (adminKey) {
      verifyAndLoad(adminKey);
    }
  }, []);

  const verifyAndLoad = async (key) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await paymentService.verifyAdminPasskey(key);
      setIsAuthenticated(true);
      localStorage.setItem('resumecraft_admin_key', key);
      await fetchPayments(key);
    } catch (err) {
      setIsAuthenticated(false);
      setAuthError('Invalid Admin Passkey. Enter your phone number (01816550751).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setAdminKey(passkeyInput.trim());
    verifyAndLoad(passkeyInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('resumecraft_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
  };

  const fetchPayments = async (keyToUse) => {
    setIsLoading(true);
    try {
      const res = await paymentService.getAdminPayments(keyToUse || adminKey);
      if (res.success) {
        setPayments(res.payments || []);
        setStats(res.stats || { total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
      }
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a payment
  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await paymentService.approvePayment(id, adminKey);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: 'approved', approvedAt: new Date() } : p))
        );
        setStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          approved: prev.approved + 1,
          totalRevenue: prev.totalRevenue + 10,
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving payment');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject a payment
  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await paymentService.rejectPayment(id, adminKey);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: 'rejected' } : p))
        );
        setStats((prev) => ({
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
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record permanently?')) return;
    try {
      await paymentService.deletePayment(id, adminKey);
      setPayments((prev) => prev.filter((p) => p._id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      alert('Error deleting payment');
    }
  };

  const handleCopyTrx = (trx, id) => {
    navigator.clipboard.writeText(trx);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.customerEmail?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // If not authenticated as admin, show passkey login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 select-none">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#E2136E] to-blue-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              ResumeCraft Admin Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your Admin Passkey to verify bKash payments and manage user approvals.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Passkey (Phone Number or Key)
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

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
              <span>Admin Center</span>
              <span className="text-[10px] bg-[#E2136E] text-white px-2 py-0.5 rounded-full font-bold">
                bKash Payments
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Target Number: 01816550751 (10 Tk per export)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchPayments()}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
            title="Refresh payments"
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

      {/* 2. Main Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
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
                {stats.pending}
              </span>
              {stats.pending > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting TrxID check</p>
          </div>

          {/* Card 2: Approved */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Approved Users</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.approved}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Unlocked exports</p>
          </div>

          {/* Card 3: Total Submissions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Total Orders</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {stats.total}
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
              ৳ {stats.totalRevenue}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">BDT verified in bKash</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab} {tab === 'pending' && stats.pending > 0 ? `(${stats.pending})` : ''}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                              onClick={() => handleApprove(item._id)}
                              disabled={actionLoadingId === item._id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                              title="Approve and Unlock Export"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleReject(item._id)}
                              disabled={actionLoadingId === item._id}
                              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
                              title="Reject TrxID"
                            >
                              Reject
                            </button>
                          )}

                          {/* WhatsApp Customer Link */}
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
                            onClick={() => handleDelete(item._id)}
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
      </main>
    </div>
  );
};

export default AdminPaymentsPage;

