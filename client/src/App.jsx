import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AuthModal from './components/auth/AuthModal';
import LandingPage from './pages/LandingPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder for CV Editor arriving in Phase 4
const BuilderPlaceholder = ({ onOpenAuth }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
      <span className="text-2xl font-bold">CV</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">CV Editor Interface</h2>
    <p className="text-sm text-slate-500 max-w-md">
      Phase 2 Complete. Split-screen desktop editor and 3-mode mobile editor arriving in Phase 4.
    </p>
  </div>
);

export const App = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Toast />
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
          <Route path="/templates" element={<TemplateGalleryPage />} />
          <Route path="/dashboard" element={<DashboardPage onOpenAuth={handleOpenAuth} />} />
          <Route path="/builder" element={<BuilderPlaceholder onOpenAuth={handleOpenAuth} />} />
          <Route path="/pricing" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
      />
    </div>
  );
};

export default App;
