import React, { useState } from 'react';
import QuickCVWizard from '../features/quick-wizard/QuickCVWizard';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Does this match Bangladeshi corporate & BDJobs recruiter expectations?',
      a: 'Yes, 100%. Our Bangladeshi CV templates feature formal passport-size (35×45mm) portrait photos on the top-right, structured academic qualification tables (SSC, HSC, Honours/B.Sc. with passing year and CGPA), complete personal details (Father/Mother’s name, DOB, NID, Blood Group), 2 professional references, and a signed declaration statement.',
    },
    {
      q: 'Will my CV pass modern Applicant Tracking Systems (ATS)?',
      a: 'Every template is engineered to strict semantic markup standards. In addition, our dedicated "ATS Friendly" category uses single-column linear hierarchy and standard header tags ensuring a 100% parse rate on Taleo, Workday, Greenhouse, and BDJobs automated screening engines.',
    },
    {
      q: 'Can I export both PDF and editable Microsoft Word (DOCX)?',
      a: 'Yes. You can download vector-crisp A4 PDFs rendered via our headless browser engine with zero margins and font embedding, as well as genuine, fully editable .docx Word documents.',
    },
    {
      q: 'Can I switch templates without losing my typed information?',
      a: 'Yes! Your personal details, work experience, education, and photo remain intact across all 30+ templates. You can switch between styles anytime with zero risk of data loss.',
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
              Everything you need to know about NovaCV templates, ATS scoring, and recruiter formats.
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
