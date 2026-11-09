import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updatePersonalInfo,
  updatePersonalDetails,
  setTemplateId,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  removeSkill,
} from '../../store/cvSlice';
import { TEMPLATES_REGISTRY, TEMPLATE_CATEGORIES } from '@shared/constants/cvDefaults.js';
import { RenderCVTemplate } from '../../templates';
import exportService from '../../services/exportService';
import { generateSmartBio, enhanceBulletPoint, PRESET_ROLES } from '../../utils/aiGenerator';
import {
  Sparkles,
  Camera,
  Download,
  FileText,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Eye,
  X,
  Upload,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const QuickCVWizard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cvData = useSelector((state) => state.cv.currentCV || state.cv.present || {});

  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadingTemplateId, setDownloadingTemplateId] = useState(null);
  const [downloadType, setDownloadType] = useState(null); // 'pdf' | 'docx'
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [showBDDetails, setShowBDDetails] = useState(true);
  const [fullscreenPreview, setFullscreenPreview] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const fileInputRef = useRef(null);

  const personalInfo = cvData.personalInfo || {};
  const personalDetails = cvData.personalDetails || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];

  // Filter templates
  const filteredTemplates = TEMPLATES_REGISTRY.filter((t) => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  // Handle Image Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(updatePersonalInfo({ photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Bio Generation
  const handleGenerateBio = async (preset = null) => {
    setIsGeneratingBio(true);
    try {
      // Use our fast, intelligent role-aware bio generator
      setTimeout(() => {
        const generated = generateSmartBio(
          personalInfo.jobTitle,
          education,
          experience,
          preset
        );
        dispatch(updatePersonalInfo({ summary: generated }));
        setIsGeneratingBio(false);
      }, 350);
    } catch (err) {
      setIsGeneratingBio(false);
    }
  };

  // One-click PDF download for specific template card
  const handleDownloadPDF = async (template) => {
    try {
      setDownloadingTemplateId(template.id);
      setDownloadType('pdf');
      const targetCVData = {
        ...cvData,
        templateId: template.id,
        design: {
          ...cvData.design,
          primaryColor: template.thumbnailColor || cvData.design?.primaryColor,
        },
      };

      // Query template container element if mounted on screen
      const cardEl = document.getElementById(`preview-sheet-${template.id}`);
      const html = cardEl ? cardEl.outerHTML : '';

      const blob = await exportService.exportPDF(targetCVData, html);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_${template.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate PDF. You can also click "Customize & Edit" to download from the editor.');
    } finally {
      setDownloadingTemplateId(null);
      setDownloadType(null);
    }
  };

  // One-click DOCX download for specific template card
  const handleDownloadDOCX = async (template) => {
    try {
      setDownloadingTemplateId(template.id);
      setDownloadType('docx');
      const targetCVData = {
        ...cvData,
        templateId: template.id,
      };

      const blob = await exportService.exportDOCX(targetCVData);
      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${(personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('DOCX download error:', error);
      alert('Failed to generate DOCX document.');
    } finally {
      setDownloadingTemplateId(null);
      setDownloadType(null);
    }
  };

  // Open full editor with selected template
  const handleCustomize = (templateId) => {
    dispatch(setTemplateId(templateId));
    navigate('/builder');
  };

  // Popular quick skill suggestions
  const QUICK_SKILLS = [
    'MS Office (Word, Excel)',
    'English Communication',
    'JavaScript',
    'React',
    'Python',
    'Node.js',
    'Financial Analysis',
    'Project Management',
    'Data Analysis',
    'Team Leadership',
  ];

  const handleToggleQuickSkill = (skillName) => {
    const exists = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      const idx = skills.findIndex((s) => s.name.toLowerCase() === skillName.toLowerCase());
      if (idx !== -1) dispatch(removeSkill(idx));
    } else {
      dispatch(
        addSkill({
          id: `skill-${Date.now()}`,
          name: skillName,
          level: 'Expert',
          category: 'General',
        })
      );
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    dispatch(
      addSkill({
        id: `skill-${Date.now()}`,
        name: newSkillInput.trim(),
        level: 'Advanced',
        category: 'Custom',
      })
    );
    setNewSkillInput('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Header: Apple-style Minimalism */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Instant CV Creator • So simple anyone can build in 2 minutes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Type Your Info. Get{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
            30+ Styled CVs Instantly.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Fill in your basic information below. Your CV automatically renders across 30+ recruiter-approved styles—including Bangladesh BDJobs standards and Apple clean templates.
        </p>
      </div>

      {/* 2. Primary Feature: Quick Input Form (Apple Native Style) */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl rounded-2xl p-6 sm:p-8 mb-16">
        <div className="space-y-8">
          {/* Section A: Photo & Key Personal Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                1
              </span>
              Personal Information & Portrait Photo
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Portrait Photo Uploader */}
              <div className="lg:col-span-3 flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative cursor-pointer w-32 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden shadow-sm transition-all"
                  title="Click to upload portrait photo"
                >
                  {personalInfo.photo ? (
                    <>
                      <img
                        src={personalInfo.photo}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity">
                        <Upload className="w-5 h-5 mb-1" />
                        <span>Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                      <Camera className="w-7 h-7 mx-auto mb-1 text-slate-400 group-hover:text-emerald-500" />
                      <span className="text-[11px] font-semibold block text-slate-700 dark:text-slate-300">
                        Passport Photo
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">35×45mm ratio</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    {personalInfo.photo ? 'Change' : 'Upload Photo'}
                  </button>
                  {personalInfo.photo && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => dispatch(updatePersonalInfo({ photo: null }))}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Name, Title, Contact Inputs */}
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalInfo.fullName || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
                    placeholder="e.g. Tahmidur Rahman"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Target Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalInfo.jobTitle || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ jobTitle: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer / Bank Officer"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ email: e.target.value }))}
                    placeholder="e.g. tahmid.rahman@email.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (BD / International)
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ phone: e.target.value }))}
                    placeholder="e.g. +880 1712-345678"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Present Address / City
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ location: e.target.value }))}
                    placeholder="e.g. Banani, Dhaka, Bangladesh"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn / Portfolio (Optional)
                  </label>
                  <input
                    type="text"
                    value={personalInfo.linkedin || ''}
                    onChange={(e) => dispatch(updatePersonalInfo({ linkedin: e.target.value }))}
                    placeholder="e.g. linkedin.com/in/tahmidrahman"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Bio & Career Objective with AI Generation */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  2
                </span>
                Career Objective / Professional Summary
              </h2>

              {/* Glowing AI Bio Button */}
              <button
                type="button"
                onClick={() => handleGenerateBio()}
                disabled={isGeneratingBio}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingBio ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBio ? 'Crafting Bio...' : '✨ Generate Bio with AI'}</span>
              </button>
            </div>

            {/* Quick 1-click Preset Selector */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-medium text-slate-500">Quick Bio Presets:</span>
              {PRESET_ROLES.slice(0, 4).map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleGenerateBio(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
                >
                  + {preset.role.split('/')[0]}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={personalInfo.summary || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ summary: e.target.value }))}
              placeholder="Click 'Generate Bio with AI' or type your career objective here..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>

          {/* Section C: Education (BD Table / Academic Format) */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  3
                </span>
                Academic Qualifications (SSC, HSC, Degree)
              </h2>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    addEducation({
                      id: `edu-${Date.now()}`,
                      degree: 'Degree / Certificate',
                      institution: 'University / Board',
                      fieldOfStudy: 'Field / Major',
                      startDate: '',
                      endDate: '2024',
                      grade: 'CGPA 3.80',
                    })
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree / Exam
              </button>
            </div>

            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 items-center"
                >
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) =>
                        dispatch(updateEducation({ index: idx, data: { degree: e.target.value } }))
                      }
                      placeholder="Exam / Degree (e.g. B.Sc. / HSC)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({ index: idx, data: { institution: e.target.value } })
                        )
                      }
                      placeholder="Institution / Board (e.g. Dhaka University)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({ index: idx, data: { fieldOfStudy: e.target.value } })
                        )
                      }
                      placeholder="Major (e.g. Science / CSE)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={edu.grade || ''}
                      onChange={(e) =>
                        dispatch(updateEducation({ index: idx, data: { grade: e.target.value } }))
                      }
                      placeholder="Result (e.g. CGPA 3.82)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => dispatch(removeEducation(idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove Degree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section D: Work Experience */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  4
                </span>
                Employment History
              </h2>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    addExperience({
                      id: `exp-${Date.now()}`,
                      jobTitle: 'Job Title',
                      company: 'Company Name',
                      location: 'Dhaka',
                      startDate: '2022',
                      endDate: 'Present',
                      current: true,
                      description: 'Key responsibilities and achievements...',
                    })
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={exp.jobTitle || ''}
                        onChange={(e) =>
                          dispatch(
                            updateExperience({ index: idx, data: { jobTitle: e.target.value } })
                          )
                        }
                        placeholder="Job Title"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) =>
                          dispatch(
                            updateExperience({ index: idx, data: { company: e.target.value } })
                          )
                        }
                        placeholder="Company Name"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={`${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('–');
                          dispatch(
                            updateExperience({
                              index: idx,
                              data: { startDate: parts[0]?.trim(), endDate: parts[1]?.trim() },
                            })
                          );
                        }}
                        placeholder="2021 – Present"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => dispatch(removeExperience(idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.description || ''}
                      onChange={(e) =>
                        dispatch(
                          updateExperience({ index: idx, data: { description: e.target.value } })
                        )
                      }
                      placeholder="Brief description of your daily responsibilities..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const enhanced = enhanceBulletPoint(exp.description, exp.jobTitle);
                        dispatch(
                          updateExperience({ index: idx, data: { description: enhanced } })
                        );
                      }}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      title="AI Polish description"
                    >
                      <Sparkles className="w-3 h-3" /> Enhance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section E: Skills & Competencies */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                5
              </span>
              Key Skills & Competencies
            </h2>

            {/* Quick 1-click toggle chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_SKILLS.map((qs) => {
                const isSelected = skills.some(
                  (s) => s.name.toLowerCase() === qs.toLowerCase()
                );
                return (
                  <button
                    key={qs}
                    type="button"
                    onClick={() => handleToggleQuickSkill(qs)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{qs}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom skill input */}
            <form onSubmit={handleAddCustomSkill} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type custom skill (e.g. AutoCAD, Docker)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* Section F: Optional BD Recruiter Details Accordion */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowBDDetails(!showBDDetails)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇧🇩</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Bangladeshi Recruiter Details (BDJobs / Bank Standard)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Father/Mother's name, DOB, NID, Blood Group, Permanent Address & References
                  </span>
                </div>
              </div>
              {showBDDetails ? (
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {showBDDetails && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={personalDetails.fatherName || ''}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ fatherName: e.target.value }))
                    }
                    placeholder="e.g. Md. Abdur Rahman"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    value={personalDetails.motherName || ''}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ motherName: e.target.value }))
                    }
                    placeholder="e.g. Begum Rokeya Sultana"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth (DD/MM/YYYY)
                  </label>
                  <input
                    type="text"
                    value={personalDetails.dob || ''}
                    onChange={(e) => dispatch(updatePersonalDetails({ dob: e.target.value }))}
                    placeholder="e.g. 15/10/1996"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National ID (NID)
                  </label>
                  <input
                    type="text"
                    value={personalDetails.nid || ''}
                    onChange={(e) => dispatch(updatePersonalDetails({ nid: e.target.value }))}
                    placeholder="e.g. 19962692518000123"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={personalDetails.bloodGroup || 'B+'}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ bloodGroup: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={personalDetails.religion || 'Islam'}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ religion: e.target.value }))
                    }
                    placeholder="e.g. Islam / Hinduism / Christianity"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    value={personalDetails.permanentAddress || ''}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ permanentAddress: e.target.value }))
                    }
                    placeholder="e.g. Vill: Shantinagar, P.O: Mirpur, Dist: Kushtia, Bangladesh"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Real-Time Multi-Template Showcase: "Your Generated CVs" */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Your Generated CVs
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {filteredTemplates.length} Styles Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any design below. One-click download genuine PDF or Word DOCX with your details and portrait photo.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {category === 'Bangladesh Standard' ? '🇧🇩 BD Standard' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid of Live Rendered CV Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const isDownloadingThis = downloadingTemplateId === template.id;
            const templateCVData = {
              ...cvData,
              templateId: template.id,
              design: {
                ...cvData.design,
                primaryColor: template.thumbnailColor || cvData.design?.primaryColor,
              },
            };

            return (
              <div
                key={template.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Header bar with Template Name & Badge */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: template.thumbnailColor }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {template.name}
                    </h3>
                  </div>
                  {template.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Scaled Live Sheet Preview Container */}
                <div
                  className="relative h-[380px] bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-start justify-center pt-3 cursor-pointer group"
                  onClick={() => setFullscreenPreview(template)}
                  title="Click to view full preview"
                >
                  <div
                    id={`preview-sheet-${template.id}`}
                    className="w-[794px] origin-top pointer-events-none select-none transition-transform group-hover:scale-[0.37]"
                    style={{ transform: 'scale(0.35)' }}
                  >
                    <RenderCVTemplate cvData={templateCVData} scale={1} />
                  </div>

                  {/* Hover Overlay with Preview Icon */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Preview Fullscreen
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 space-y-2 mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Instant PDF Download */}
                    <button
                      type="button"
                      disabled={isDownloadingThis}
                      onClick={() => handleDownloadPDF(template)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloadingThis && downloadType === 'pdf' ? 'Exporting...' : 'PDF'}</span>
                    </button>

                    {/* Instant DOCX Download */}
                    <button
                      type="button"
                      disabled={isDownloadingThis}
                      onClick={() => handleDownloadDOCX(template)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isDownloadingThis && downloadType === 'docx' ? 'Exporting...' : 'Word'}</span>
                    </button>
                  </div>

                  {/* Customize in Full Editor */}
                  <button
                    type="button"
                    onClick={() => handleCustomize(template.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Customize & Drag-and-Drop Edit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fullscreen Preview Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {fullscreenPreview.name}
                </h3>
                <span className="text-xs text-slate-500">{fullscreenPreview.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(fullscreenPreview)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDOCX(fullscreenPreview)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Word
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomize(fullscreenPreview.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" /> Open in Editor
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenPreview(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div className="w-[794px] shadow-2xl bg-white">
                <RenderCVTemplate
                  cvData={{
                    ...cvData,
                    templateId: fullscreenPreview.id,
                    design: {
                      ...cvData.design,
                      primaryColor: fullscreenPreview.thumbnailColor || cvData.design?.primaryColor,
                    },
                  }}
                  scale={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCVWizard;
