import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authStart,
  authSuccess,
  authFailure,
  clearError,
  closeAuthModal,
} from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import authService from '../../services/authService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  consumePendingAuthAction,
  clearPendingAuthAction,
} from '../../utils/authPendingAction';
import { Mail, Lock, User, ArrowRight, Info, KeyRound, ArrowLeft } from 'lucide-react';

export const AuthModal = ({ isOpen: propOpen, onClose: propClose, initialMode = 'login' }) => {
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    authModalOpen,
    authModalMode,
    authPromptMessage,
  } = useSelector((state) => state.auth);

  const effectiveOpen = typeof propOpen === 'boolean' ? propOpen : authModalOpen;
  const effectiveInitialMode = propOpen ? initialMode : authModalMode || initialMode;

  const [mode, setMode] = useState(effectiveInitialMode); // 'login' | 'register' | 'forgot' | 'reset'
  const [infoNotice, setInfoNotice] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
  });

  useEffect(() => {
    if (effectiveOpen) {
      setMode(effectiveInitialMode || 'login');
      setInfoNotice('');
      dispatch(clearError());
    }
  }, [effectiveOpen, effectiveInitialMode, dispatch]);

  const handleDismiss = () => {
    clearPendingAuthAction();
    dispatch(clearError());
    dispatch(closeAuthModal());
    if (typeof propClose === 'function') {
      propClose();
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
    if (infoNotice) setInfoNotice('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setInfoNotice('');
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'forgot') {
      if (!formData.email.trim()) {
        dispatch(authFailure('Please enter your registered email address.'));
        return;
      }
      setResetLoading(true);
      try {
        const res = await authService.forgotPassword(formData.email.trim());
        setInfoNotice(
          res?.message ||
            'If an account exists for that email, password reset instructions have been sent.'
        );
        if (res?.resetToken) {
          setFormData((prev) => ({ ...prev, resetToken: res.resetToken }));
        }
        setMode('reset');
      } catch (err) {
        if (err?.status === 501 || err?.code === 'EMAIL_NOT_CONFIGURED') {
          setInfoNotice(
            err.message ||
              'Automated email delivery is not configured on this server. Contact the site administrator to reset your password.'
          );
        } else {
          dispatch(authFailure(err.message || 'Unable to process password reset request.'));
        }
      } finally {
        setResetLoading(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (!formData.resetToken.trim()) {
        dispatch(authFailure('Please enter your password reset token.'));
        return;
      }
      if (formData.password.length < 6) {
        dispatch(authFailure('New password must be at least 6 characters.'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        dispatch(authFailure('Passwords do not match.'));
        return;
      }
      setResetLoading(true);
      try {
        await authService.resetPassword(formData.resetToken.trim(), formData.password);
        dispatch(showToast({ message: 'Password updated! You can now sign in.', type: 'success' }));
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '', resetToken: '' }));
        switchMode('login');
      } catch (err) {
        dispatch(authFailure(err.message || 'Failed to reset password.'));
      } finally {
        setResetLoading(false);
      }
      return;
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        dispatch(authFailure('Please enter your full name.'));
        return;
      }
      if (formData.password.length < 6) {
        dispatch(authFailure('Password must be at least 6 characters.'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        dispatch(authFailure('Passwords do not match.'));
        return;
      }
    }

    try {
      dispatch(authStart());
      let res;
      if (mode === 'login') {
        res = await authService.login(formData.email.trim(), formData.password);
        dispatch(
          showToast({
            message: `Welcome back, ${res.user?.name || 'User'}!`,
            type: 'success',
          })
        );
      } else {
        res = await authService.register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
        dispatch(
          showToast({
            message: 'Account created! Your first CV export is unlocked free.',
            type: 'success',
          })
        );
      }

      dispatch(authSuccess(res));
      dispatch(closeAuthModal());
      if (typeof propClose === 'function') propClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        resetToken: '',
      });
      consumePendingAuthAction();
    } catch (err) {
      dispatch(
        authFailure(err.message || 'Authentication failed. Please check your credentials.')
      );
    }
  };

  const titleByMode = {
    login: 'Sign In to NovaCV',
    register: 'Create Free Account',
    forgot: 'Reset Your Password',
    reset: 'Set New Password',
  };

  const subtitleByMode = {
    login: 'Access your saved CVs, export history, and cross-device sync.',
    register: 'Save CVs securely across devices and download your first CV free.',
    forgot: 'Enter your account email to request a password reset link.',
    reset: 'Enter the reset token and choose a new password.',
  };

  return (
    <Modal
      isOpen={effectiveOpen}
      onClose={handleDismiss}
      title={titleByMode[mode] || 'Account'}
      subtitle={subtitleByMode[mode] || ''}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {authPromptMessage && (mode === 'login' || mode === 'register') && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>{authPromptMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {infoNotice && (
          <div className="p-3 text-xs font-medium text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800 leading-relaxed">
            {infoNotice}
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nafis Ahmed"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

        {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

        {mode === 'reset' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reset Token
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="resetToken"
                value={formData.resetToken}
                onChange={handleChange}
                placeholder="Paste reset token from email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
              />
            </div>
          </div>
        )}

        {(mode === 'login' || mode === 'register' || mode === 'reset') && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {mode === 'reset' ? 'New Password' : 'Password'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

        {(mode === 'register' || mode === 'reset') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading || resetLoading}
          className="w-full mt-2"
          iconRight={ArrowRight}
        >
          {mode === 'login'
            ? 'Sign In'
            : mode === 'register'
              ? 'Create Free Account'
              : mode === 'forgot'
                ? 'Request Reset Link'
                : 'Update Password'}
        </Button>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
