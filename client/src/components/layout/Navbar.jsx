import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, openAuthModal } from '../../store/authSlice';
import { toggleDarkMode, openAIModal } from '../../store/uiSlice';
import authService from '../../services/authService';
import {
  FileText,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  LayoutGrid,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Coins,
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.ui);

  const triggerAuth = (mode = 'login') => {
    if (typeof onOpenAuth === 'function') {
      onOpenAuth(mode);
    } else {
      dispatch(openAuthModal({ mode }));
    }
  };

  const handleLogout = () => {
    authService.logout().catch(() => {});
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/');
  };

  const freeLeft = Number(user?.freeExportsRemaining || 0);
  const paidLeft = Number(user?.paidExportCredits || 0);
  const totalCredits = freeLeft + paidLeft;
  const initials = (user?.name || user?.email || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');

  const navTabs = [
    { name: 'Templates', href: '/templates', icon: LayoutGrid },
    { name: 'Editor', href: '/builder', icon: Edit3 },
    {
      name: 'AI Assistant',
      isAction: true,
      action: () => dispatch(openAIModal({ mode: 'summary' })),
      icon: Sparkles,
    },
    { name: 'My Documents', href: '/dashboard', icon: FileText },
    ...(user?.role === 'admin'
      ? [{ name: 'Admin', href: '/admin', icon: LayoutDashboard }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none transition-colors">
      {/* Left: Traffic Lights, History Chevrons & Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            title="Return to Home"
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
          />
          <button
            type="button"
            onClick={() => navigate('/templates')}
            title="Browse Templates"
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
          />
          <button
            type="button"
            onClick={() => navigate('/builder')}
            title="Open Fullscreen Editor"
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-80 active:scale-95 transition-all shadow-sm cursor-pointer"
          />
        </div>

        <div className="hidden sm:flex items-center text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-0.5 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            title="Go back"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="p-0.5 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            title="Go forward"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h4.5l3.5 5 3.5-5H20v16h-4.5v-8.5L12 12l-3.5-4.5V20H4V4z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-white">
            ResumeCraft
          </span>
        </Link>
      </div>

      {/* Center: Segmented Navigation Control */}
      <nav className="hidden md:flex items-center gap-1.5">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.href;

          if (tab.isAction) {
            return (
              <button
                key={tab.name}
                type="button"
                onClick={tab.action}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500" />
                <span>{tab.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-blue-50/70 dark:bg-blue-950/60 border border-blue-500/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            {user?.role === 'admin' ? (
              <Link
                to="/admin"
                className="px-2.5 py-1 rounded-lg bg-[#E2136E]/10 text-[#E2136E] border border-[#E2136E]/30 text-xs font-bold hover:bg-[#E2136E]/20 transition-all flex items-center gap-1"
                title="Open Admin Center"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                title="Available new CV export credits"
              >
                <Coins className="w-3 h-3" />
                <span>
                  {freeLeft > 0 && paidLeft === 0
                    ? '1 Free CV'
                    : totalCredits > 0
                      ? `${totalCredits} Credit${totalCredits > 1 ? 's' : ''}`
                      : '৳10 / New CV'}
                </span>
              </Link>
            )}

            <Link to="/dashboard" title={`${user?.name || 'User'} (${user?.email || ''})`}>
              {user?.avatar ? (
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all">
                  <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer">
                  {initials}
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => triggerAuth('login')}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => triggerAuth('register')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-all cursor-pointer"
            >
              Register
            </button>
            <Link to="/builder" className="hidden sm:inline-flex">
              <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Editor</span>
              </button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 shadow-xl z-50">
          {navTabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.href || '#'}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (tab.isAction) {
                  e.preventDefault();
                  tab.action();
                }
              }}
              className="block py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              {tab.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 py-1">
                <span>
                  Signed in as <strong>{user?.name || user?.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-rose-600 font-semibold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerAuth('login');
                  }}
                  className="py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerAuth('register');
                  }}
                  className="py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
                >
                  Register Free
                </button>
              </div>
            )}

            <Link to="/builder" onClick={() => setMobileMenuOpen(false)} className="block">
              <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow">
                Launch CV Editor
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
