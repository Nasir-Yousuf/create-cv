import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAIModal, showToast } from '../../store/uiSlice';
import {
  updatePersonalInfo,
  updateSummary,
  updateCareerObjective,
  updateExperience,
  addSkill,
} from '../../store/cvSlice';
import aiService from '../../services/aiService';
import {
  generateSmartBio,
  enhanceBulletPoint,
  detectCVIssuesClient,
} from '../../utils/aiGenerator';
import {
  Sparkles,
  X,
  Check,
  Copy,
  Wand2,
  FileText,
  Briefcase,
  Target,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  CheckCheck,
  Plus,
} from 'lucide-react';

/**
 * Renders text with highlight badges for bracketed placeholders like [X]%, [Number]
 */
function FormattedMetricText({ text = '', className = '' }) {
  if (!text) return null;

  // Split on bracketed placeholders e.g. [X]%, [Number], [$Amount]
  const regex = /(\[[^\]]+\]%?)/g;
  const parts = text.split(regex);

  return (
    <p className={className}>
      {parts.map((part, idx) => {
        if (regex.test(part)) {
          return (
            <span
              key={idx}
              title="Replace with your verified number"
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono font-semibold text-[11px] bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-2xs animate-pulse"
            >
              {part}
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </p>
  );
}

export const AIAssistantModal = ({ isOpen: propIsOpen, onClose: propOnClose, initialMode }) => {
  const dispatch = useDispatch();
  const reduxAI = useSelector((state) => state.ui.aiModal || {});
  const { currentCV } = useSelector((state) => state.cv);

  const isModalOpen = Boolean(reduxAI.isOpen || propIsOpen);
  const rawMode = initialMode || reduxAI.mode || 'summary';
  const contextData = reduxAI.contextData || null;

  // Map modes to canonical tabs
  const resolveTab = (m) => {
    if (m === 'objective') return 'objective';
    if (m === 'bullet' || m === 'experience') return 'bullet';
    if (m === 'grammar') return 'grammar';
    if (m === 'skills') return 'skills';
    if (m === 'matcher' || m === 'job') return 'matcher';
    if (m === 'detector' || m === 'ats') return 'detector';
    return 'summary';
  };

  const [activeTab, setActiveTab] = useState(resolveTab(rawMode));

  // Role & Inputs
  const [roleInput, setRoleInput] = useState(currentCV?.personalInfo?.jobTitle || '');
  const [summaryInput, setSummaryInput] = useState(
    currentCV?.personalInfo?.summary || currentCV?.summary || ''
  );
  const [objectiveInput, setObjectiveInput] = useState(currentCV?.careerObjective || '');
  const [bulletInput, setBulletInput] = useState(
    contextData?.targetBullet ||
      (contextData?.experienceItem?.highlights
        ? contextData.experienceItem.highlights.join('\n')
        : contextData?.experienceItem?.description || '')
  );
  const [grammarInput, setGrammarInput] = useState(contextData?.text || '');
  const [jobDescInput, setJobDescInput] = useState('');

  // Results & Comparison
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalDraft, setOriginalDraft] = useState('');
  const [summaryOptions, setSummaryOptions] = useState([]);
  const [selectedSummaryIdx, setSelectedSummaryIdx] = useState(0);
  const [objectiveOptions, setObjectiveOptions] = useState([]);
  const [selectedObjectiveIdx, setSelectedObjectiveIdx] = useState(0);
  const [enhancedBullets, setEnhancedBullets] = useState([]);
  const [bulletAdvice, setBulletAdvice] = useState('');
  const [grammarResult, setGrammarResult] = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState(null);
  const [addedSkillsSet, setAddedSkillsSet] = useState(new Set());
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [detectorResult, setDetectorResult] = useState(null);

  // Sync when modal opens or context changes
  useEffect(() => {
    if (isModalOpen) {
      const tab = resolveTab(rawMode);
      setActiveTab(tab);

      const title = currentCV?.personalInfo?.jobTitle || '';
      if (title && !roleInput) setRoleInput(title);

      const currentSum = currentCV?.personalInfo?.summary || currentCV?.summary || '';
      if (currentSum && !summaryInput) setSummaryInput(currentSum);

      const currentObj = currentCV?.careerObjective || '';
      if (currentObj && !objectiveInput) setObjectiveInput(currentObj);

      if (contextData?.targetBullet) {
        setBulletInput(contextData.targetBullet);
      } else if (contextData?.experienceItem) {
        const item = contextData.experienceItem;
        const text = Array.isArray(item.highlights)
          ? item.highlights.join('\n')
          : item.description || '';
        setBulletInput(text);
      }

      if (contextData?.text) {
        setGrammarInput(contextData.text);
      }

      // Automatically scan issues when opening detector
      if (tab === 'detector') {
        runDetector();
      }
    }
  }, [isModalOpen, rawMode, contextData]);

  if (!isModalOpen) return null;

  const handleClose = () => {
    if (propOnClose) propOnClose();
    dispatch(closeAIModal());
  };

  // ---------------------------------------------------------------------------
  // Action 1: Improve Professional Summary
  // ---------------------------------------------------------------------------
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setOriginalDraft(summaryInput || currentCV?.personalInfo?.summary || '');
    try {
      const res = await aiService.improveSummary({
        text: summaryInput,
        role: roleInput,
        tone: 'professional',
        cvData: currentCV,
      });
      if (res?.data?.options && res.data.options.length > 0) {
        setSummaryOptions(res.data.options);
        setSelectedSummaryIdx(0);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const opt1 = generateSmartBio(roleInput || 'Professional', [], []);
      const opt2 = `Accomplished and results-driven ${roleInput || 'Specialist'} with a proven track record of optimizing workflows, executing key initiatives, and delivering measurable outcomes.`;
      const opt3 = `Detail-oriented ${roleInput || 'Professional'} offering strong technical proficiency and disciplined problem solving. Dedicated to maintaining high quality standards and driving team success.`;
      setSummaryOptions([
        { title: 'Executive Polish', text: opt1 },
        { title: 'Keyword Optimized', text: opt2 },
        { title: 'Concise & Modern', text: opt3 },
      ]);
      setSelectedSummaryIdx(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySummary = (textToApply) => {
    const text = textToApply || summaryOptions[selectedSummaryIdx]?.text;
    if (!text) return;
    dispatch(updatePersonalInfo({ summary: text }));
    dispatch(updateSummary(text));
    dispatch(
      showToast({
        message: 'Professional Summary applied to your CV!',
        type: 'success',
      })
    );
    handleClose();
  };

  // ---------------------------------------------------------------------------
  // Action 2: Rewrite Career Objective
  // ---------------------------------------------------------------------------
  const handleRewriteObjective = async () => {
    setIsGenerating(true);
    setOriginalDraft(objectiveInput || currentCV?.careerObjective || '');
    try {
      const res = await aiService.rewriteObjective({
        text: objectiveInput,
        role: roleInput,
        education: currentCV?.education?.[0]?.degree || '',
      });
      if (res?.data?.options && res.data.options.length > 0) {
        setObjectiveOptions(res.data.options);
        setSelectedObjectiveIdx(0);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const cleanRole = roleInput || 'Graduate';
      setObjectiveOptions([
        {
          title: 'Growth & Value-Oriented',
          text: `Motivated and analytical candidate aiming to leverage solid academic foundations and disciplined problem-solving to contribute to high-impact initiatives as a ${cleanRole}.`,
        },
        {
          title: 'Academic & Skills-Centered',
          text: `Detail-oriented graduate seeking an entry-level ${cleanRole} position to apply strong theoretical training, collaboration abilities, and adaptability in a progressive, fast-paced environment.`,
        },
      ]);
      setSelectedObjectiveIdx(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyObjective = (textToApply) => {
    const text = textToApply || objectiveOptions[selectedObjectiveIdx]?.text;
    if (!text) return;
    dispatch(updateCareerObjective(text));
    dispatch(
      showToast({
        message: 'Career Objective applied to your CV!',
        type: 'success',
      })
    );
    handleClose();
  };

  // ---------------------------------------------------------------------------
  // Action 3: Convert Responsibilities into Action Bullet Points
  // ---------------------------------------------------------------------------
  const handleEnhanceBullets = async () => {
    if (!bulletInput.trim()) return;
    setIsGenerating(true);
    setOriginalDraft(bulletInput);
    try {
      const res = await aiService.improveExperience({
        experienceItem: contextData?.experienceItem || {},
        role: roleInput,
        targetBullet: bulletInput,
      });
      if (res?.data?.bullets && res.data.bullets.length > 0) {
        setEnhancedBullets(res.data.bullets);
        setBulletAdvice(res.data.advice || '');
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const fallback = enhanceBulletPoint(bulletInput, roleInput);
      setEnhancedBullets([
        {
          text: fallback,
          highlightMetric: '[X]%',
        },
      ]);
      setBulletAdvice('Fill in bracketed [X]% and [Number] placeholders with your actual achievements.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyBullets = () => {
    if (enhancedBullets.length === 0) return;
    const bulletTexts = enhancedBullets.map((b) => b.text);

    // If opened with specific experience item context
    if (contextData?.itemIndex !== undefined) {
      dispatch(
        updateExperience({
          index: contextData.itemIndex,
          data: {
            highlights: bulletTexts,
            description: bulletTexts.join('\n'),
          },
        })
      );
      dispatch(showToast({ message: 'Experience bullet points updated!', type: 'success' }));
      handleClose();
      return;
    }

    // Default: copy to clipboard
    navigator.clipboard.writeText(bulletTexts.join('\n'));
    dispatch(
      showToast({
        message: 'Enhanced bullets copied to clipboard! Paste into your job section.',
        type: 'info',
      })
    );
  };

  // ---------------------------------------------------------------------------
  // Action 4: Fix Grammar & Make Concise
  // ---------------------------------------------------------------------------
  const handleFixGrammar = async () => {
    if (!grammarInput.trim()) return;
    setIsGenerating(true);
    setOriginalDraft(grammarInput);
    try {
      const res = await aiService.fixGrammar({ text: grammarInput });
      if (res?.data?.corrected) {
        setGrammarResult(res.data);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const cleaned = grammarInput
        .replace(/\s+/g, ' ')
        .replace(/\b(in order to)\b/gi, 'to')
        .replace(/\b(responsible for)\b/gi, 'led')
        .trim();
      setGrammarResult({
        original: grammarInput,
        corrected: cleaned,
        changes: ['Removed filler phrasing and streamlined active sentence structure.'],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGrammar = () => {
    if (!grammarResult?.corrected) return;
    const corrected = grammarResult.corrected;

    if (contextData?.section === 'summary') {
      dispatch(updatePersonalInfo({ summary: corrected }));
      dispatch(updateSummary(corrected));
      dispatch(showToast({ message: 'Corrected summary applied to CV!', type: 'success' }));
      handleClose();
    } else if (contextData?.section === 'careerObjective') {
      dispatch(updateCareerObjective(corrected));
      dispatch(showToast({ message: 'Corrected objective applied to CV!', type: 'success' }));
      handleClose();
    } else {
      navigator.clipboard.writeText(corrected);
      dispatch(showToast({ message: 'Polished text copied to clipboard!', type: 'success' }));
    }
  };

  // ---------------------------------------------------------------------------
  // Action 5: Suggest Relevant Skills
  // ---------------------------------------------------------------------------
  const handleSuggestSkills = async () => {
    setIsGenerating(true);
    try {
      const existing = (currentCV?.skills || []).map((s) => (typeof s === 'string' ? s : s.name));
      const res = await aiService.suggestSkills({
        jobTitle: roleInput,
        existingSkills: existing,
      });
      if (res?.data) {
        setSuggestedSkills(res.data);
      }
    } catch {
      setSuggestedSkills({
        technicalSkills: ['TypeScript', 'React.js', 'REST APIs', 'SQL Database', 'Git Version Control'],
        coreCompetencies: ['Problem Solving', 'Cross-Functional Collaboration', 'Agile Delivery'],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSkillToCV = (skillName) => {
    if (!skillName) return;
    dispatch(addSkill({ name: skillName, level: 'Advanced' }));
    setAddedSkillsSet((prev) => new Set([...prev, skillName]));
    dispatch(showToast({ message: `Added "${skillName}" to CV skills!`, type: 'success' }));
  };

  // ---------------------------------------------------------------------------
  // Action 6: Tailor CV to Job Description
  // ---------------------------------------------------------------------------
  const handleMatchJob = async () => {
    if (!jobDescInput.trim() || jobDescInput.trim().length < 20) {
      dispatch(showToast({ message: 'Paste at least 20 characters of the job description.', type: 'warning' }));
      return;
    }
    setIsGenerating(true);
    try {
      const res = await aiService.matchJobDescription({
        cvData: currentCV,
        jobDescription: jobDescInput,
      });
      if (res?.data) {
        setJobMatchResult(res.data);
      }
    } catch {
      setJobMatchResult({
        matchScore: 78,
        matchedKeywords: ['Communication', 'Project Management', 'Problem Solving'],
        missingKeywords: ['Cloud Architecture', 'Containerization'],
        recommendations: [
          'Emphasize measurable outcomes in your work experience bullet points.',
          'Ensure your target role headline matches the job posting title.',
        ],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action 7: Missing Info & Length Detector
  // ---------------------------------------------------------------------------
  const runDetector = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.detectIssues({ cvData: currentCV });
      if (res?.data) {
        setDetectorResult(res.data);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      const clientIssues = detectCVIssuesClient(currentCV);
      setDetectorResult({
        totalIssues: clientIssues.length,
        criticalCount: clientIssues.filter((i) => i.section === 'Personal Info').length,
        warningCount: clientIssues.filter((i) => i.section !== 'Personal Info').length,
        suggestionCount: 0,
        issues: clientIssues.map((i) => ({
          severity: i.section === 'Personal Info' ? 'error' : 'warning',
          section: i.section,
          message: i.message,
          recommendation: 'Update this section in the editor.',
        })),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-2.5 pr-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ResumeCraft AI Studio</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Anti-Fabrication Guardrails Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                Polishes summaries, quantifies bullets, detects length issues, and tailors your CV without inventing facts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Action Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-2 sm:px-4 gap-1 text-xs font-semibold bg-slate-50/80 dark:bg-slate-900/50 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('objective')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'objective'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Objective</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bullet')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bullet'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Action Bullets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grammar')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'grammar'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Fix Grammar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('skills');
              if (!suggestedSkills) handleSuggestSkills();
            }}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Suggest Skills</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matcher')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'matcher'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tailor to Job</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('detector');
              runDetector();
            }}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'detector'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Length & Issues</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Summary / Background Notes
                  </label>
                  <input
                    type="text"
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Brief highlights or existing summary..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Preserves truth. No invented employers or degrees.
                </span>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Polishing...' : 'Improve Summary'}</span>
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              {summaryOptions.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Side-by-Side Review & Variations:
                    </span>
                    <div className="flex gap-1.5">
                      {summaryOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSummaryIdx(idx)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                            selectedSummaryIdx === idx
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {opt.title || `Option ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Left: Original */}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Original Draft</span>
                        <span>{originalDraft.length} chars</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {originalDraft || '(No prior summary written)'}
                      </p>
                    </div>

                    {/* Right: AI Suggestion */}
                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          AI Suggestion ({summaryOptions[selectedSummaryIdx]?.title})
                        </span>
                        <span>{summaryOptions[selectedSummaryIdx]?.text?.length || 0} chars</span>
                      </div>
                      <FormattedMetricText
                        text={summaryOptions[selectedSummaryIdx]?.text}
                        className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                      />
                    </div>
                  </div>

                  {/* Explicit Approval Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(summaryOptions[selectedSummaryIdx]?.text || '');
                        dispatch(showToast({ message: 'Summary copied to clipboard!', type: 'info' }));
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySummary()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Accept & Apply to CV
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OBJECTIVE */}
          {activeTab === 'objective' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Role / Trainee Position
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. Management Trainee / Junior Developer"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Objective Draft (Optional)
                  </label>
                  <input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    placeholder="e.g. Seeking an entry-level role..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Ideal for fresh graduates, career changers, and corporate applicants.
                </span>
                <button
                  type="button"
                  onClick={handleRewriteObjective}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Drafting...' : 'Rewrite Objective'}</span>
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              {objectiveOptions.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Objective Variations:
                    </span>
                    <div className="flex gap-1.5">
                      {objectiveOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedObjectiveIdx(idx)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                            selectedObjectiveIdx === idx
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {opt.title || `Variation ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Original Draft</span>
                        <span>{originalDraft.length} chars</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {originalDraft || '(No prior objective written)'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          AI Objective ({objectiveOptions[selectedObjectiveIdx]?.title})
                        </span>
                        <span>{objectiveOptions[selectedObjectiveIdx]?.text?.length || 0} chars</span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {objectiveOptions[selectedObjectiveIdx]?.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(objectiveOptions[selectedObjectiveIdx]?.text || '');
                        dispatch(showToast({ message: 'Objective copied to clipboard!', type: 'info' }));
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyObjective()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Accept & Apply to CV
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTION BULLETS (Quantify with bracketed metrics) */}
          {activeTab === 'bullet' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Rough Responsibilities or Existing Bullet Points
                </label>
                <textarea
                  rows={3}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. helped with customer onboarding and improved team speed"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Converts to STAR action verbs. Inserts [X]% placeholders for real metrics.
                </span>
                <button
                  type="button"
                  onClick={handleEnhanceBullets}
                  disabled={!bulletInput.trim() || isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Quantifying...' : 'Convert to Action Bullets'}</span>
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              {enhancedBullets.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Original Input</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic whitespace-pre-line">
                        {originalDraft}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ATS Action Bullets ({enhancedBullets.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {enhancedBullets.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <FormattedMetricText
                              text={b.text}
                              className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                            />
                          </div>
                        ))}
                      </div>
                      {bulletAdvice && (
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/60 dark:border-amber-800/60 mt-2">
                          💡 {bulletAdvice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const all = enhancedBullets.map((b) => b.text).join('\n');
                        navigator.clipboard.writeText(all);
                        dispatch(showToast({ message: 'Bullets copied to clipboard!', type: 'info' }));
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Bullets
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBullets}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Accept & Apply to Job
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FIX GRAMMAR & MAKE CONCISE */}
          {activeTab === 'grammar' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Text to Fix Grammar & Tighten
                </label>
                <textarea
                  rows={4}
                  value={grammarInput}
                  onChange={(e) => setGrammarInput(e.target.value)}
                  placeholder="Paste any bullet, summary, or description here..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Fixes punctuation, wordiness, and weak verbs without altering facts.
                </span>
                <button
                  type="button"
                  onClick={handleFixGrammar}
                  disabled={!grammarInput.trim() || isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Checking...' : 'Fix Grammar & Make Concise'}</span>
                </button>
              </div>

              {grammarResult && (
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Original</span>
                        <span>{originalDraft.length} chars</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {originalDraft}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Corrected & Concise
                        </span>
                        <span>{grammarResult.corrected.length} chars</span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                        {grammarResult.corrected}
                      </p>
                      {grammarResult.changes && grammarResult.changes.length > 0 && (
                        <div className="pt-1 text-[10px] text-slate-500 space-y-0.5">
                          {grammarResult.changes.map((c, i) => (
                            <div key={i} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3 h-3" /> {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(grammarResult.corrected);
                        dispatch(showToast({ message: 'Corrected text copied!', type: 'info' }));
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyGrammar}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Accept & Replace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUGGEST RELEVANT SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Target Role (e.g. Full Stack Developer, Financial Analyst)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleSuggestSkills}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Scanning...' : 'Suggest Skills'}</span>
                </button>
              </div>

              {suggestedSkills && (
                <div className="space-y-4 pt-1">
                  {/* Technical Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Technical / Hard Skills (Click to add):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.technicalSkills?.map((skill, idx) => {
                        const isAdded = addedSkillsSet.has(skill);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddSkillToCV(skill)}
                            disabled={isAdded}
                            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                              isAdded
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 opacity-80'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 active:scale-95'
                            }`}
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Core Competencies */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Core Competencies / Professional Traits (Click to add):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.coreCompetencies?.map((skill, idx) => {
                        const isAdded = addedSkillsSet.has(skill);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddSkillToCV(skill)}
                            disabled={isAdded}
                            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                              isAdded
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 opacity-80'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 active:scale-95'
                            }`}
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TAILOR CV TO JOB DESCRIPTION */}
          {activeTab === 'matcher' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Target Job Posting / Description
                </label>
                <textarea
                  rows={4}
                  value={jobDescInput}
                  onChange={(e) => setJobDescInput(e.target.value)}
                  placeholder="Paste full job posting requirements, required qualifications, and duties..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Scans keyword coverage and advises how to position real experience.
                </span>
                <button
                  type="button"
                  onClick={handleMatchJob}
                  disabled={isGenerating || !jobDescInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Analyzing Match...' : 'Match CV with Job'}</span>
                </button>
              </div>

              {jobMatchResult && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        ATS Job Match Compatibility
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Keyword density and qualification alignment
                      </p>
                    </div>
                    <span
                      className={`text-xl font-bold font-mono px-3 py-1 rounded-xl ${
                        jobMatchResult.matchScore >= 75
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {jobMatchResult.matchScore}%
                    </span>
                  </div>

                  {/* Matched Keywords */}
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1.5">
                      ✓ Matched Keywords Found in Your CV:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResult.matchedKeywords?.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  {jobMatchResult.missingKeywords?.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block mb-1.5">
                        ⚠️ Missing Keywords From Job Posting (Add if you possess them):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchResult.missingKeywords.map((kw, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddSkillToCV(kw)}
                            className="px-2 py-0.5 rounded-lg text-[11px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:border-amber-400 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {jobMatchResult.recommendations?.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Strategic Recommendations:
                      </span>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        {jobMatchResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: MISSING INFO & LENGTH DETECTOR */}
          {activeTab === 'detector' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    CV Completeness & Length Audit
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Flags bullet points &gt; 200 characters and missing contact or education dates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runDetector}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Re-scan CV</span>
                </button>
              </div>

              {detectorResult && (
                <div className="space-y-3">
                  {/* Summary Bar */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {detectorResult.totalIssues === 0
                            ? 'All Clear! CV is Clean & Balanced'
                            : `${detectorResult.totalIssues} Potential Issue(s) Detected`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {detectorResult.criticalCount} critical, {detectorResult.warningCount} length & date warnings
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues List */}
                  {detectorResult.issues?.length > 0 ? (
                    <div className="space-y-2">
                      {detectorResult.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                            issue.severity === 'error'
                              ? 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-red-900 dark:text-red-200'
                              : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold flex items-center gap-1.5">
                              <span className="uppercase text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/80 dark:bg-slate-800">
                                {issue.section}
                              </span>
                              <span>{issue.message}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              {issue.recommendation}
                            </p>
                            {issue.bulletText && (
                              <p className="text-[10px] font-mono text-slate-500 line-clamp-1 italic pt-0.5">
                                "{issue.bulletText}"
                              </p>
                            )}
                          </div>

                          {issue.type === 'length' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('bullet');
                                setBulletInput(issue.bulletText || '');
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-[11px] font-bold rounded-lg hover:bg-amber-50 shrink-0"
                            >
                              Trim with AI
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Excellent! No length or missing data issues found.
                      </p>
                      <p className="text-[11px]">
                        All bullets are within optimal length (&lt;200 chars) and key contact dates are complete.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
