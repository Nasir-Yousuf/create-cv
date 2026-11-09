import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
            <FileText className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            Nova<span className="text-emerald-600">CV</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Effortless Professional CV Builder</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Quick Creator
          </Link>
          <Link to="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Templates (30+)
          </Link>
          <Link to="/builder" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Editor
          </Link>
          <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            My CVs
          </Link>
        </div>

        <div>
          <span>© {new Date().getFullYear()} NovaCV. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
