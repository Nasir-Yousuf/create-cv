import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, clearError } from '../../store/authSlice';
import { showToast } from '../../store/uiSlice';
import authService from '../../services/authService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!formData.name.trim()) {
        dispatch(authFailure('Please enter your full name'));
        return;
      }
      if (formData.password.length < 6) {
        dispatch(authFailure('Password must be at least 6 characters'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        dispatch(authFailure('Passwords do not match'));
        return;
      }
    }

    try {
      dispatch(authStart());
      let res;
      if (mode === 'login') {
        res = await authService.login(formData.email, formData.password);
        dispatch(showToast({ message: `Welcome back, ${res.user.name}!`, type: 'success' }));
      } else {
        res = await authService.register(formData.name, formData.email, formData.password);
        dispatch(showToast({ message: 'Account created successfully!', type: 'success' }));
      }
      dispatch(authSuccess(res));
      onClose();
    } catch (err) {
      dispatch(authFailure(err.message || 'Authentication failed. Please check credentials.'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
      subtitle={
        mode === 'login'
          ? 'Sign in to access your saved CVs and AI assistant.'
          : 'Join thousands of professionals creating standout resumes.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
            {error}
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
                placeholder="Sarah Jenkins"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

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

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {mode === 'register' && (
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
          iconRight={ArrowRight}
        >
          {mode === 'login' ? 'Sign In to NovaCV' : 'Create Account'}
        </Button>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  dispatch(clearError());
                }}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  dispatch(clearError());
                }}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;

