import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import paymentService from '../../services/paymentService';
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export const PaymentExportModal = ({
  isOpen,
  onClose,
  onSuccess,
  exportType = 'pdf', // 'pdf' | 'docx'
}) => {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('bkash'); // 'bkash' | 'coupon'
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const [submittedPayment, setSubmittedPayment] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const BKASH_NUMBER = '01816550751';
  const WHATSAPP_URL = 'https://wa.me/8801816550751?text=Hello%20I%20sent%2010%20Taka%20on%20bKash%20to%20export%20my%20CV.%20TrxID:%20';

  useEffect(() => {
    if (isOpen) {
      // Check if user already has a pending or approved payment saved locally
      const lastTrx = paymentService.getLastTrxId();
      if (lastTrx) {
        setTransactionId(lastTrx);
        checkStatus(lastTrx);
      }
      if (user) {
        if (!customerName) setCustomerName(user.name || '');
        if (!customerEmail) setCustomerEmail(user.email || '');
      }
    }
  }, [isOpen, user]);

  // Auto-poll approval status every 4 seconds when payment is pending
  useEffect(() => {
    let interval = null;
    const currentTrx = transactionId || submittedPayment?.transactionId;
    if (isOpen && currentTrx && statusMessage.type === 'info') {
      interval = setInterval(() => {
        checkStatus(currentTrx);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, transactionId, submittedPayment, statusMessage.type]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Submit bKash payment
  const handleSubmitBkash = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setStatusMessage({ text: 'Please enter your bKash sender phone number.', type: 'error' });
      return;
    }
    if (!transactionId.trim()) {
      setStatusMessage({ text: 'Please enter the bKash Transaction ID (TrxID).', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const res = await paymentService.submitPayment({
        phone: phone.trim(),
        transactionId: transactionId.trim().toUpperCase(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
      });

      if (res.unlocked || res.status === 'approved') {
        setStatusMessage({ text: 'Payment verified and approved! Unlocking download...', type: 'success' });
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1200);
      } else {
        setSubmittedPayment(res.payment);
        setStatusMessage({
          text: 'bKash submission recorded! Admin will review your TrxID shortly.',
          type: 'info',
        });
      }
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Error submitting payment. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check Approval Status
  const checkStatus = async (trxToCheck) => {
    const trx = trxToCheck || transactionId || submittedPayment?.transactionId;
    if (!trx) return;

    setIsChecking(true);
    try {
      const res = await paymentService.checkStatus({ transactionId: trx });
      if (res.unlocked || res.status === 'approved') {
        setStatusMessage({ text: 'Approved! Your export is unlocked 🎉', type: 'success' });
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1200);
      } else if (res.status === 'pending') {
        setStatusMessage({ text: 'Status: Pending Admin verification. Please wait a moment.', type: 'info' });
      } else if (res.status === 'rejected') {
        setStatusMessage({ text: 'Transaction was rejected. Please contact support.', type: 'error' });
      }
    } catch (err) {
      console.warn('Status check error:', err.message);
    } finally {
      setIsChecking(false);
    }
  };

  // Apply Coupon Code (Private VIP Promo)
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setStatusMessage({ text: 'Please enter a coupon code.', type: 'error' });
      return;
    }

    setIsApplyingCoupon(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const res = await paymentService.applyCoupon(couponCode.trim(), {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        phone: phone.trim(),
      });

      if (res.unlocked) {
        setStatusMessage({ text: 'Coupon applied successfully! Lifetime download unlocked 🎉', type: 'success' });
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Invalid coupon code. Please verify your code or pay 10 Tk via bKash.',
        type: 'error',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* 1. macOS Window Titlebar */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
            />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-60" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-60" />
            <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              ResumeCraft • Export Authorization
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Hero Banner: 10 Taka bKash */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2136E] to-[#b80c54] p-5 text-white shadow-lg shadow-[#e2136e]/20">
            {/* Background Decorative Rings */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-12 -top-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Export Access
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                  Only 10 Taka (১০ টাকা)
                </h3>
                <p className="text-xs text-pink-100 mt-1 max-w-xs leading-relaxed">
                  Pay 10 Tk in bKash to export your {exportType === 'docx' ? 'Microsoft Word (.docx)' : 'Vector PDF'} document, or use the promo code.
                </p>
              </div>

              {/* bKash Icon / Badge */}
              <div className="w-12 h-12 rounded-2xl bg-white text-[#E2136E] flex items-center justify-center font-black text-xs shadow-md shrink-0">
                bKash
              </div>
            </div>

            {/* Recipient Number Card with Copy */}
            <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-pink-200 block text-[10px] uppercase font-semibold">
                  Personal bKash (Send Money)
                </span>
                <span className="font-mono font-bold text-base tracking-wider text-white">
                  {BKASH_NUMBER}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#E2136E] text-xs font-bold shadow-sm hover:bg-pink-50 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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

                <a
                  href={`${WHATSAPP_URL}${transactionId || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
                  title="WhatsApp Chat for Instant Verification"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Segmented Option Selector: bKash vs Coupon */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('bkash')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bkash'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#E2136E]" />
              <span>1. Pay via bKash (10 Tk)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupon')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'coupon'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Promo / Coupon Code</span>
            </button>
          </div>

          {/* Notification status message if any */}
          {statusMessage.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: BKASH FORM */}
          {activeTab === 'bkash' && (
            <form onSubmit={handleSubmitBkash} className="space-y-3.5">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Quick Steps to Pay 10 Tk:
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                  <li>Send Money <strong>10 Tk</strong> to <strong>01816550751</strong> via bKash.</li>
                  <li>Copy the <strong>Transaction ID (TrxID)</strong> from your bKash SMS.</li>
                  <li>Paste below and click submit. Admin approves your request!</li>
                </ol>
              </div>

              {/* Sender Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your bKash Sender Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#E2136E]"
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  bKash Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9J24K9L8"
                  className="w-full text-xs font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#E2136E]"
                />
              </div>

              {/* Name & Email (optional) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E2136E] to-[#c70f5e] hover:opacity-95 active:scale-95 text-white font-bold text-xs shadow-md shadow-[#e2136e]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Payment (10 Tk)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {transactionId && (
                  <button
                    type="button"
                    onClick={() => checkStatus()}
                    disabled={isChecking}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
                    title="Check if admin has approved your payment"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-blue-600' : ''}`} />
                    <span>Check Status</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: COUPON FORM */}
          {activeTab === 'coupon' && (
            <form onSubmit={handleApplyCoupon} className="space-y-4">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Instant Download Promo Code
                </div>
                <p className="text-[11px] leading-relaxed">
                  Enter your private authorization promo code to immediately unlock instant PDF and Word downloads without waiting for approval.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter Coupon Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter your coupon code"
                    className="w-full text-sm font-mono tracking-wider uppercase bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isApplyingCoupon}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isApplyingCoupon ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Coupon & Unlock Download</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* WhatsApp Support Notice */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Any issues? Message admin on WhatsApp:</span>
            <a
              href={`${WHATSAPP_URL}${transactionId || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-bold hover:underline flex items-center gap-1"
            >
              <span>01816550751</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentExportModal;

