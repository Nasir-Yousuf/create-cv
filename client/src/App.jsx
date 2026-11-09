import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AuthModal from './components/auth/AuthModal';
import LandingPage from './pages/LandingPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import DashboardPage from './pages/DashboardPage';
import CVEditorPage from './features/cv-editor/CVEditorPage';

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
          <Route path="/builder" element={<CVEditorPage />} />
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
