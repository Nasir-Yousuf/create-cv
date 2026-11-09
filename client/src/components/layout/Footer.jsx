import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Nova<span className="text-indigo-600">CV</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering job seekers worldwide with AI-powered resume building, ATS-friendly designs, and instant multi-format downloads.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com/Nasir-Yousuf/create-cv" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/templates" className="hover:text-indigo-600 transition-colors">Resume Templates</Link></li>
              <li><Link to="/builder" className="hover:text-indigo-600 transition-colors">AI CV Generator</Link></li>
              <li><Link to="/#features" className="hover:text-indigo-600 transition-colors">ATS Optimization</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/#faq" className="hover:text-indigo-600 transition-colors">CV Writing Guide</Link></li>
              <li><Link to="/#faq" className="hover:text-indigo-600 transition-colors">Job Search Tips</Link></li>
              <li><Link to="/#faq" className="hover:text-indigo-600 transition-colors">Frequently Asked Questions</Link></li>
              <li><a href="mailto:support@novacv.com" className="hover:text-indigo-600 transition-colors">Customer Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Security & Data Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NovaCV AI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious career builders worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

