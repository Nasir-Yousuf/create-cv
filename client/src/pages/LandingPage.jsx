import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTemplateId } from '../store/cvSlice';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  FileDown,
  Layout,
  Wand2,
  Bot,
  Star,
  ChevronDown,
  Layers,
  Award,
} from 'lucide-react';
import Button from '../components/common/Button';
import RenderCVTemplate from '../templates';
import { INITIAL_CV_DATA, TEMPLATES_REGISTRY } from '@shared/constants/cvDefaults.js';

export const LandingPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activePreviewTemplate, setActivePreviewTemplate] = useState('modern-minimal');
  const [openFaq, setOpenFaq] = useState(null);

  const previewCVData = {
    ...INITIAL_CV_DATA,
    templateId: activePreviewTemplate,
  };

  const handleUseTemplate = (id) => {
    dispatch(setTemplateId(id));
    navigate('/builder');
  };

  const faqs = [
    {
      q: 'Will my CV pass Applicant Tracking Systems (ATS)?',
      a: 'Yes, 100%. All NovaCV templates are engineered according to strict recruiter and ATS parsing standards. Our ATS-Classic template is specifically formatted with single-column linear hierarchy to ensure flawless machine readability.',
    },
    {
      q: 'How does the Gemini AI integration assist with my CV?',
      a: 'NovaCV integrates Google Gemini AI to analyze your career background, rewrite and quantify work bullet points, suggest industry-specific high-impact keywords, match job descriptions, and write compelling executive summaries in seconds.',
    },
    {
      q: 'Can I download genuine PDF and Microsoft Word (DOCX) files?',
      a: 'Absolutely. NovaCV uses a headless Puppeteer rendering engine to generate crystal-clear, high-resolution A4 and Letter vector PDFs, as well as genuine, fully editable DOCX Word files generated using native Word document specifications.',
    },
    {
      q: 'Can I switch templates without losing my typed information?',
      a: 'Yes! Our unified CV data model completely separates your resume content from design styles. You can switch between any of our 10+ templates anytime with zero risk of data loss.',
    },
    {
      q: 'Is NovaCV usable on mobile devices?',
      a: 'Yes, NovaCV features a dedicated mobile architecture with 3 dedicated modes: Fill Resume, Design, and Live A4 Preview, allowing you to edit and export your CV on smartphones and tablets seamlessly.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-sky-400/15 dark:bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Next-Gen Gemini 2.0 AI Integration Active</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your Next Opportunity Starts With a{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                Better CV.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Create a professional, beautifully designed CV in minutes. Customize stunning templates, get AI-powered writing assistance, and download your CV in seconds.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/builder" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-indigo-500/30 shadow-lg" iconRight={ArrowRight}>
                  Start Building Free
                </Button>
              </Link>
              <Link to="/templates" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Templates
                </Button>
              </Link>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>Trusted by 50,000+ job seekers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span>ATS-friendly templates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero data selling</span>
              </div>
            </div>
          </div>

          {/* Interactive Live CV Preview Demonstration */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-slate-900 dark:bg-slate-900/95 rounded-2xl p-3 sm:p-5 shadow-2xl border border-slate-800">
              {/* Window Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs text-slate-400 font-mono hidden sm:inline">
                    novacv.site/builder/live-preview
                  </span>
                </div>

                {/* Template switch tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-400 mr-2 shrink-0">Live Switch:</span>
                  {[
                    { id: 'modern-minimal', name: 'Minimal' },
                    { id: 'executive-slate', name: 'Executive' },
                    { id: 'ocean-split', name: 'Ocean' },
                    { id: 'ats-classic', name: 'ATS Classic' },
                    { id: 'creative-coral', name: 'Creative' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setActivePreviewTemplate(tpl.id)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all shrink-0 ${
                        activePreviewTemplate === tpl.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scaled Preview Frame */}
              <div className="py-6 flex justify-center overflow-x-auto bg-slate-950/60 rounded-xl mt-3 p-2">
                <div className="transform scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-top transition-all duration-300 shadow-2xl">
                  <RenderCVTemplate cvData={previewCVData} />
                </div>
              </div>

              {/* Action Bar below preview */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span>Currently Previewing: <strong className="text-white capitalize">{activePreviewTemplate.replace('-', ' ')}</strong></span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUseTemplate(activePreviewTemplate)}
                  iconRight={ArrowRight}
                >
                  Edit This Resume Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Template Gallery Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Job-Winning Modern Templates
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Crafted to meet the exact criteria hiring managers and modern Applicant Tracking Systems look for.
              </p>
            </div>
            <Link to="/templates">
              <Button variant="outline" size="sm" iconRight={ArrowRight}>
                View All Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES_REGISTRY.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Thumbnail Mockup */}
                  <div
                    className="h-56 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center p-3"
                    style={{ backgroundColor: `${tpl.thumbnailColor}10` }}
                  >
                    <div className="w-full h-full bg-white rounded shadow-md p-3 text-[7px] leading-tight overflow-hidden pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-300">
                      <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: tpl.thumbnailColor }} />
                      <div className="h-1.5 w-32 bg-slate-200 rounded mb-3" />
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-100 rounded" />
                        <div className="h-1 w-4/5 bg-slate-100 rounded" />
                        <div className="h-1 w-3/4 bg-slate-100 rounded" />
                      </div>
                    </div>

                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700">
                      {tpl.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {tpl.category}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUseTemplate(tpl.id)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Intelligent Career Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Powered by Google Gemini AI
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No generic templates or placeholder text. Intelligent algorithms analyze your trajectory and optimize your CV for real hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Conversational CV Builder
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Simply describe your career history in everyday plain English. Gemini extracts key milestones, organizes sections, and populates the editor automatically.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bullet Point Quantifier
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Transform weak task descriptions like "worked on backend" into high-impact accomplishment bullets like "Engineered Node.js microservices reducing latency by 42%".
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Job Description Matcher
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Paste any target job description. The AI immediately pinpoints missing keywords, recommends relevant skills, and rates your resume alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Three Simple Steps to Your Dream Job
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Effortless, fast, and engineered for maximum interview callbacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pick a Proven Template
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select from our curated library of ATS-friendly and modern design templates.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Input or AI Generate
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Fill your details using live forms or tell Gemini AI your background to auto-write it.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Download PDF or Word
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Export genuine vector PDFs or fully editable DOCX files ready for recruiter submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Start free, upgrade anytime for unlimited Gemini AI powers and premium templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter Plan
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500">Free forever</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Everything you need to create and export a recruiter-ready resume.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 2 Saved Resumes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Access to All Core Templates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Standard PDF Exports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mobile & Desktop Live Preview</li>
                </ul>
              </div>

              <Link to="/builder">
                <Button variant="outline" className="w-full">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Pro AI Career Pass
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">$9</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300">
                  Full AI capabilities, genuine DOCX exports, and unlimited custom variations.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Unlimited Saved CVs & Cover Letters</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Full Gemini AI Assistant Suite</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Genuine Microsoft Word (DOCX) Exports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Job Description Keyword Matcher</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Priority Cloud Image Storage</li>
                </ul>
              </div>

              <Link to="/builder">
                <Button variant="primary" className="w-full shadow-lg shadow-indigo-500/40">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clear answers to common questions about our templates, AI, and exports.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === i ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 pt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join over 50,000 professionals using NovaCV to build polished, recruiter-approved resumes in minutes.
          </p>
          <div className="pt-2">
            <Link to="/builder">
              <Button variant="primary" size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl">
                Create My Resume Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

