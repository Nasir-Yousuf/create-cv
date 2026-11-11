import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Heart } from 'lucide-react';
import { TEMPLATES_REGISTRY } from '@shared/constants/cvDefaults.js';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h4.5l3.5 5 3.5-5H20v16h-4.5v-8.5L12 12l-3.5-4.5V20H4V4z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            ResumeCraft
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Effortless Professional CV Builder</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Quick Creator
          </Link>
          <Link to="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Templates ({TEMPLATES_REGISTRY.length})
          </Link>
          <Link to="/builder" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Editor
          </Link>
          <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            My CVs
          </Link>
          <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors opacity-70 hover:opacity-100">
            Admin
          </Link>
        </div>

        <div>
          <span>© {new Date().getFullYear()} ResumeCraft. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
