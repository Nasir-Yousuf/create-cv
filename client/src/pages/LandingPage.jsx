import React, { useState } from 'react';
import QuickCVWizard from '../features/quick-wizard/QuickCVWizard';
import { ChevronDown } from 'lucide-react';
import { TEMPLATES_REGISTRY } from '@shared/constants/cvDefaults.js';

export const LandingPage = ({ onOpenAuth }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const templateCount = TEMPLATES_REGISTRY.length;

  const faqs = [
    {
      q: 'Why is there a dedicated One-Page CV collection?',
      a: 'Most students, fresh graduates, and entry-level candidates need a sharp, recruiter-ready single-page CV rather than a stretched multi-page document. Our One-Page collection uses smart spacing and clean typography calibrated specifically for A4 single-page PDF exports.',
    },
    {
      q: 'How does the First-CV Free and ৳10 bKash pricing model work?',
      a: 'Every registered account gets its first CV export completely free. Once unlocked, that CV can be edited and re-downloaded in PDF or Word formats unlimited times at no extra cost. To export each additional separate CV, simply pay ৳10 once via bKash.',
    },
    {
      q: 'Does this match Bangladeshi corporate & BDJobs recruiter expectations?',
      a: 'Yes! Our Bangladesh CVs include compact one-page fresher formats as well as detailed Multi-Page Corporate templates with passport-size (35×45mm) photo framing, structured academic tables (SSC, HSC, Bachelor’s/Master’s), personal details, references, and declaration.',
    },
    {
      q: 'Can I switch templates or log in from another device without losing my CVs?',
      a: `Yes! All your CVs and version history are stored securely under your authenticated account in the cloud. You can switch across any of our ${templateCount} curated layouts anytime or continue editing from another computer.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* 1. Primary Feature: Quick CV Wizard & Instant Multi-Template Showcase */}
      <QuickCVWizard />

      {/* 2. Apple-Clean Minimal FAQ Section */}
      <section className="py-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about ResumeCraft templates, ATS scoring, and recruiter formats.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === index ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
