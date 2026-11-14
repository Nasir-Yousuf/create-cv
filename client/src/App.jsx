import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AuthModal from './components/auth/AuthModal';
import AIAssistantModal from './components/common/AIAssistantModal';
import WhatsAppSupportButton from './components/common/WhatsAppSupportButton';
import LandingPage from './pages/LandingPage';
import authService from './services/authService';
import {
  openAuthModal,
  syncUserProfile,
  logout,
} from './store/authSlice';
import { showToast } from './store/uiSlice';
import { ShieldAlert, Lock, LogIn, Loader2 } from 'lucide-react';

// Code-split heavy routes for Lighthouse 95+ FCP on mobile
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CVEditorPage = lazy(() => import('./features/cv-editor/CVEditorPage'));
const AdminPaymentsPage = lazy(() => import('./pages/AdminPaymentsPage'));

const PageRouteSkeleton = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
    <div className="w-9 h-9 rounded-full border-3 border-blue-600/20 border-t-blue-600 animate-spin" />
    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
      Loading NovaCV...
    </span>
  </div>
);

const ProtectedUserRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sign In Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in or create a free account to access your saved cloud CVs, version history, and export entitlements across devices.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => dispatch(openAuthModal({ mode: 'login' }))}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(openAuthModal({ mode: 'register' }))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E2136E]/10 text-[#E2136E] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Administrator Authentication Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with the dedicated administrator account to access platform controls.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(openAuthModal({ mode: 'login' }))}
            className="w-full py-2.5 rounded-xl bg-[#E2136E] hover:bg-[#c91060] text-white text-xs font-bold cursor-pointer"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 text-center shadow-lg space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            403 • Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your current account does not have administrator permissions to view this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const isEditorPage = location.pathname === '/builder';
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleOpenAuth = (mode = 'login') => {
    dispatch(openAuthModal({ mode }));
  };

  // Hydrate live account + entitlement balance on startup and whenever token changes
  useEffect(() => {
    if (!token) return;
    let active = true;
    authService
      .getMe()
      .then((res) => {
        if (active && res?.user) {
          dispatch(syncUserProfile(res.user));
        }
      })
      .catch((err) => {
        if (!active) return;
        if (err?.status === 401 || err?.status === 403) {
          dispatch(logout());
          if (err?.code === 'ACCOUNT_SUSPENDED') {
            dispatch(showToast({ message: err.message || 'Account suspended.', type: 'error' }));
          }
        }
      });
    return () => {
      active = false;
    };
  }, [token, dispatch]);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isEditorPage ? 'h-screen overflow-hidden' : 'bg-slate-50 dark:bg-slate-950'
      } text-slate-900 dark:text-slate-100`}
    >
      <Toast />
      <WhatsAppSupportButton />
      <AIAssistantModal />
      {!isEditorPage && !isAdminPage && <Navbar onOpenAuth={handleOpenAuth} />}

      <main className="flex-1">
        <Suspense fallback={<PageRouteSkeleton />}>
          <Routes>
            <Route path="/" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/templates" element={<TemplateGalleryPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedUserRoute>
                  <DashboardPage onOpenAuth={handleOpenAuth} />
                </ProtectedUserRoute>
              }
            />
            <Route path="/builder" element={<CVEditorPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPaymentsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/pricing" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
          </Routes>
        </Suspense>
      </main>

      {!isEditorPage && !isAdminPage && <Footer />}

      <AuthModal />
    </div>
  );
};

export default App;
