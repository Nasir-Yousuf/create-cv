import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AuthModal from './components/auth/AuthModal';
import AIAssistantModal from './components/common/AIAssistantModal';
import WhatsAppSupportButton from './components/common/WhatsAppSupportButton';
import LandingPage from './pages/LandingPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import DashboardPage from './pages/DashboardPage';
import CVEditorPage from './features/cv-editor/CVEditorPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';

export const App = () => {
  const location = useLocation();
  const isEditorPage = location.pathname === '/builder';
  const isAdminPage = location.pathname.startsWith('/admin');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  return (
    <div className={`flex flex-col min-h-screen ${isEditorPage ? 'h-screen overflow-hidden' : 'bg-slate-50 dark:bg-slate-950'} text-slate-900 dark:text-slate-100`}>
      <Toast />
      <WhatsAppSupportButton />
      <AIAssistantModal />
      {!isEditorPage && !isAdminPage && <Navbar onOpenAuth={handleOpenAuth} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
          <Route path="/templates" element={<TemplateGalleryPage />} />
          <Route path="/dashboard" element={<DashboardPage onOpenAuth={handleOpenAuth} />} />
          <Route path="/builder" element={<CVEditorPage />} />
          <Route path="/admin" element={<AdminPaymentsPage />} />
          <Route path="/pricing" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
        </Routes>
      </main>

      {!isEditorPage && !isAdminPage && <Footer />}

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
      />
    </div>
  );
};

export default App;
