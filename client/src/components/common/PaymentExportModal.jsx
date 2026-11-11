import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import paymentService from '../../services/paymentService';
import authService from '../../services/authService';
import { syncUserProfile } from '../../store/authSlice';
import {
  X,
  Check,
  Copy,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Smartphone,
  XCircle,
  Info,
} from 'lucide-react';

const STATUS_BADGE = {
  pending: {
    label: 'Pending Verification',
    cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    cls: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    icon: XCircle,
  },
};

export const PaymentExportModal = ({
  isOpen,
  onClose,
  onSuccess,
  exportType = 'pdf',
  cvId = null,
  cvTitle = '',
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [config, setConfig] = useState({
    bkashNumber: '',
    amountBdt: 10,
    pricingPolicy: 'First CV export is free. Each additional new CV costs ৳10 via bKash.',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const [myPayments, setMyPayments] = useState([]);
  const [entitlements, setEntitlements] = useState(null);

  const [copied, setCopied] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const loadModalState = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingData(true);
    try {
      const [cfgRes, entRes, payRes] = await Promise.all([
        paymentService.getPaymentConfig().catch(() => null),
        paymentService.getEntitlements().catch(() => null),
        paymentService.getMyPayments().catch(() => null),
      ]);

      if (cfgRes?.data) {
        setConfig((prev) => ({ ...prev, ...cfgRes.data }));
      }
      if (payRes?.data) {
        setMyPayments(payRes.data);
      }
      if (entRes?.data) {
        setEntitlements(entRes.data);
        const credits = Number(entRes.data.availableNewCvExports || 0);
        if (credits > 0 && entRes.data.isAdmin !== true) {
          // Credit was approved! Sync user profile & resume export automatically
          const me = await authService.getMe().catch(() => null);
          if (me?.user) dispatch(syncUserProfile(me.user));
          setStatusMessage({
            text: 'Payment approved! Your new CV export credit is ready. Starting download...',
            type: 'success',
          });
          setTimeout(() => {
            if (typeof onSuccess === 'function') onSuccess();
            if (typeof onClose === 'function') onClose();
          }, 900);
        }
      }
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  }, [dispatch, onClose, onSuccess]);

  useEffect(() => {
    if (!isOpen) {
      setStatusMessage({ text: '', type: '' });
      return;
    }
    loadModalState();
  }, [isOpen, loadModalState]);

  const hasPendingPayment = myPayments.some((p) => p.status === 'pending');

  // Poll every 5 seconds only while a payment is awaiting admin review
  useEffect(() => {
    if (!isOpen || !hasPendingPayment) return undefined;
    const timer = setInterval(() => {
      loadModalState({ silent: true });
    }, 5000);
    return () => clearInterval(timer);
  }, [isOpen, hasPendingPayment, loadModalState]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    if (!config.bkashNumber) return;
    navigator.clipboard.writeText(config.bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualRefresh = async () => {
    setIsChecking(true);
    await loadModalState({ silent: true });
    setIsChecking(false);
  };

  const handleSubmitBkash = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setStatusMessage({
        text: 'Please enter the bKash sender mobile number you used (e.g. 017XXXXXXXX).',
        type: 'error',
      });
      return;
    }
    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setStatusMessage({
        text: 'Please enter the valid bKash Transaction ID (TrxID).',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const res = await paymentService.submitPayment({
        phoneNumber: phoneNumber.trim(),
        transactionId: transactionId.trim().toUpperCase(),
        cvId,
        notes: notes.trim(),
      });

      setStatusMessage({
        text:
          res?.message ||
          'Payment submitted for verification! Once the admin approves your TrxID, you will receive +1 CV export credit.',
        type: 'info',
      });
      setTransactionId('');
      setNotes('');
      await loadModalState({ silent: true });
    } catch (err) {
      setStatusMessage({
        text: err.message || 'Could not submit payment request. Please verify details and retry.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = exportType === 'docx' ? 'Word (.docx)' : 'PDF';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[94vh]">
        {/* macOS Titlebar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 cursor-pointer shrink-0"
              aria-label="Close payment window"
            />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-60 shrink-0" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-60 shrink-0" />
            <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              Unlock Additional CV Export • bKash
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Hero Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2136E] to-[#a90a4c] p-5 text-white shadow-lg shadow-[#e2136e]/20">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide uppercase">
                  <ShieldCheck className="w-3 h-3" />
                  1st CV Free • Additional CV ৳{config.amountBdt || 10}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                  ৳{config.amountBdt || 10} via bKash
                </h3>
                <p className="text-xs text-pink-100 mt-1 leading-relaxed">
                  Pay ৳{config.amountBdt || 10} once to unlock {formatLabel} &amp; Word exports permanently for{' '}
                  <strong className="text-white">{cvTitle || 'this new CV'}</strong>. Future edits and re-downloads stay free.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#E2136E] flex items-center justify-center font-black text-xs shadow-md shrink-0">
                bKash
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-pink-200 block text-[10px] uppercase font-semibold">
                  Send Money (Personal bKash Number)
                </span>
                <span className="font-mono font-bold text-base tracking-wider text-white">
                  {config.bkashNumber || (isLoadingData ? 'Loading...' : 'Not configured')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                disabled={!config.bkashNumber}
                className="px-3 py-1.5 rounded-xl bg-white text-[#E2136E] text-xs font-bold shadow-sm hover:bg-pink-50 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Number</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#E2136E]" />
              <span>How Manual Verification Works</span>
            </div>
            <p>1. Open your bKash app and tap <strong>Send Money</strong> to the number above for <strong>৳{config.amountBdt || 10}</strong>.</p>
            <p>2. Enter your bKash mobile number and the <strong>Transaction ID (TrxID)</strong> below.</p>
            <p>3. Admin verifies your TrxID and grants <strong>+1 CV export credit</strong> to <strong>{user?.email}</strong>.</p>
          </div>

          {/* Feedback message */}
          {statusMessage.text && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 leading-relaxed ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : statusMessage.type === 'info'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'info' ? (
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Payment Request Form */}
          <form onSubmit={handleSubmitBkash} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your bKash Mobile Number *
                </label>
                <div className="relative">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E2136E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  bKash Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. BL93K8X2MP"
                  className="w-full px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E2136E] placeholder:normal-case placeholder:font-sans placeholder:tracking-normal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Optional Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reference or note for admin (optional)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E2136E]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#E2136E] hover:bg-[#c91060] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#e2136e]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit bKash TrxID (৳{config.amountBdt || 10})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isChecking}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Refresh approval status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#E2136E]' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </form>

          {/* Recent Payment Requests & Status Tracking */}
          {myPayments.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <span>Your Recent Payment Requests</span>
                {entitlements && (
                  <span className="text-emerald-600 dark:text-emerald-400 normal-case font-semibold">
                    Credits Available: {entitlements.availableNewCvExports || 0}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {myPayments.slice(0, 5).map((p) => {
                  const meta = STATUS_BADGE[p.status] || STATUS_BADGE.pending;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={p._id}
                      className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-100">
                          {p.transactionId}{' '}
                          <span className="font-sans font-normal text-[11px] text-slate-500">
                            • ৳{p.amount || 10}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${meta.cls}`}
                        >
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </div>
                      {p.status === 'rejected' && p.rejectionReason && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400">
                          Reason: {p.rejectionReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentExportModal;
