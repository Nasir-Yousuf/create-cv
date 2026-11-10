import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTemplateId, setCVData } from '../store/cvSlice';
import { showToast } from '../store/uiSlice';
import exportService from '../services/exportService';
import { RenderCVTemplate } from '../templates';
import {
  Search,
  Filter,
  Check,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  Layout,
  Layers,
  Download,
  X,
  Edit3,
} from 'lucide-react';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  INITIAL_CV_DATA,
  DANIEL_CARTER_CV,
} from '@shared/constants/cvDefaults.js';

export const TemplateGalleryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCV } = useSelector((state) => state.cv);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [favorites, setFavorites] = useState(['modern-blue', 'bd-corporate-standard']);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_REGISTRY.filter((tpl) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        tpl.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Modern Minimal' && tpl.category === 'Modern Minimal') ||
        (selectedCategory === 'Bangladesh Standard' && tpl.category === 'Bangladesh Standard');

      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.features?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle template selection and launch editor
  const handleSelectTemplate = (id) => {
    dispatch(setTemplateId(id));
    // If selecting modern-blue and user data is blank, load Daniel Carter demo
    if (id === 'modern-blue' && (!currentCV?.personalInfo?.fullName || currentCV?.personalInfo?.fullName === 'Tahmidur Rahman')) {
      dispatch(setCVData({ ...DANIEL_CARTER_CV, templateId: id }));
    }
    dispatch(
      showToast({
        message: `Template selected: ${TEMPLATES_REGISTRY.find((t) => t.id === id)?.name || id}`,
        type: 'success',
      })
    );
    navigate('/builder');
  };

  // Instant PDF Download
  const handleDownloadPDF = async (template) => {
    try {
      setDownloadingId(template.id);
      dispatch(
        showToast({
          message: `Generating vector PDF for ${template.name}...`,
          type: 'info',
        })
      );
      const cvToExport = getCardCVData(template);
      const blob = await exportService.exportPDF(cvToExport);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${(cvToExport.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_${template.id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(
        showToast({
          message: 'PDF downloaded successfully!',
          type: 'success',
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: 'PDF export failed. Opening print dialog.',
          type: 'info',
        })
      );
      window.print();
    } finally {
      setDownloadingId(null);
    }
  };

  // Get realistic CV Data for template preview card
  const getCardCVData = (template) => {
    // If template is BDJobs standard, show BD data
    if (template.category === 'Bangladesh Standard' || template.id.startsWith('bd-')) {
      return {
        ...INITIAL_CV_DATA,
        templateId: template.id,
        design: {
          ...INITIAL_CV_DATA.design,
          primaryColor: template.thumbnailColor || INITIAL_CV_DATA.design.primaryColor,
        },
      };
    }

    // Default to Daniel Carter or current CV data
    const baseData =
      currentCV?.personalInfo?.fullName && currentCV.personalInfo.fullName !== 'Tahmidur Rahman'
        ? currentCV
        : DANIEL_CARTER_CV;

    return {
      ...baseData,
      templateId: template.id,
      design: {
        ...baseData.design,
        primaryColor: template.thumbnailColor || baseData.design?.primaryColor || '#2563eb',
      },
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
            <Layout className="w-3.5 h-3.5 text-blue-600" />
            <span>50+ Recruiter-Approved Resume Templates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Your Resume Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Browse authentic live previews of each template below. Click any design to preview in fullscreen or launch directly in the full editor.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search templates (e.g. Modern, BDJobs, ATS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template Count Info */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTemplates.length}</span> templates
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category === 'Bangladesh Standard' ? '🇧🇩 BD Standard' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid with Real Live Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            const isDownloading = downloadingId === tpl.id;
            const cardCVData = getCardCVData(tpl);

            return (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header bar with Template Name & Badge */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tpl.thumbnailColor || '#2563eb' }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tpl.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {tpl.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200/60 dark:border-blue-800">
                        {tpl.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(tpl.id)}
                      className="text-slate-400 hover:text-amber-500 p-0.5 transition-colors"
                      title="Save to favorites"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'text-amber-500 fill-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* SCALED LIVE SHEET PREVIEW (Real Template Rendering) */}
                <div
                  className="relative h-[370px] bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-start justify-center pt-2 cursor-pointer group/preview"
                  onClick={() => setPreviewTemplate(tpl)}
                  title="Click to view full preview"
                >
                  <div
                    className="w-[794px] origin-top pointer-events-none select-none transition-transform duration-300 group-hover/preview:scale-[0.35]"
                    style={{ transform: 'scale(0.33)' }}
                  >
                    <RenderCVTemplate cvData={cardCVData} scale={1} />
                  </div>

                  {/* Hover Overlay with Preview Action */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-xl flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preview Fullscreen</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-auto">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tpl.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Primary Button: Use Template (Opens in Full Editor) */}
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Use Template</span>
                    </button>

                    {/* Instant PDF Download */}
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownloadPDF(tpl)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>{isDownloading ? 'Generating...' : 'Export PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching templates found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any templates matching "{searchQuery}". Try selecting another category or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold rounded-xl hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{previewTemplate.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {previewTemplate.category}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {previewTemplate.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Canvas */}
            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6 flex justify-center items-start">
              <div className="shadow-2xl rounded origin-top bg-white">
                <RenderCVTemplate
                  cvData={getCardCVData(previewTemplate)}
                  scale={0.85}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  handleSelectTemplate(id);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Use This Template in Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGalleryPage;
