import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setTemplateId, updateDesign } from '../store/cvSlice';
import { showToast } from '../store/uiSlice';
import templateService from '../services/templateService';
import { runProtectedExport } from '../utils/runProtectedExport';
import { stripTransientCvMeta } from '@shared/utils/cvNormalize.js';
import PaymentExportModal from '../components/common/PaymentExportModal';
import { RenderCVTemplate } from '../templates';
import {
  Search,
  Star,
  Eye,
  ArrowRight,
  Layout,
  Layers,
  Download,
  FileText,
  X,
  Edit3,
} from 'lucide-react';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  FRESHER_ONE_PAGE_CV,
  DANIEL_CARTER_CV,
  TAHMIDUR_RAHMAN_CV,
  resolveTemplateId,
  resolveTemplateMeta,
  templateMatchesCategory,
} from '@shared/constants/cvDefaults.js';

export const TemplateGalleryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();

  const { currentCV } = useSelector((state) => state.cv);

  const [templatesList, setTemplatesList] = useState(TEMPLATES_REGISTRY);
  const [categoriesList, setCategoriesList] = useState(TEMPLATE_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadType, setDownloadType] = useState(null);
  const [favorites, setFavorites] = useState(['onepage-fresher-clean', 'onepage-bd-compact', 'bd-corporate-standard']);
  const [galleryCvIds, setGalleryCvIds] = useState({});
  const [paymentModalState, setPaymentModalState] = useState({
    isOpen: false,
    exportType: 'pdf',
    cvId: null,
    cvTitle: '',
    retryExport: null,
  });
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    templateService
      .getTemplatesCatalog()
      .then(({ templates, categories }) => {
        if (Array.isArray(templates) && templates.length > 0) setTemplatesList(templates);
        if (Array.isArray(categories) && categories.length > 0) setCategoriesList(categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const previewScaleFactor = Math.min(
    0.85,
    Math.max(0.25, (windowWidth - 48) / 794)
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTemplates = useMemo(() => {
    return templatesList.filter((tpl) => {
      const matchesCategory = templateMatchesCategory(tpl, selectedCategory);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.features?.some((f) => f.toLowerCase().includes(q)) ||
        tpl.professions?.some((p) => p.toLowerCase().includes(q)) ||
        tpl.categories?.some((c) => c.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [templatesList, selectedCategory, searchQuery]);

  const displayedTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  // Handle template selection and launch editor
  const handleSelectTemplate = (id) => {
    const canonicalId = resolveTemplateId(id);
    dispatch(setTemplateId(canonicalId));
    const meta = templatesList.find((t) => t.id === canonicalId) || resolveTemplateMeta(canonicalId);
    if (meta?.thumbnailColor) {
      dispatch(
        updateDesign({
          primaryColor: meta.thumbnailColor,
          accentColor: meta.accentColor || meta.thumbnailColor,
        })
      );
    }
    dispatch(
      showToast({
        message: `Template selected: ${meta?.name || canonicalId}`,
        type: 'success',
      })
    );
    navigate('/builder');
  };

  const triggerCardExport = async (template, format) => {
    if (!template || downloadingId) return;
    setDownloadingId(template.id);
    setDownloadType(format);

    try {
      const cvToExport = getCardCVData(template);
      const elementId = `gallery-preview-sheet-${template.id}`;
      await runProtectedExport({
        dispatch,
        getState: store.getState,
        cvData: cvToExport,
        cvId: galleryCvIds[template.id] || null,
        format,
        elementId,
        onSyncCV: (createdDoc) => {
          if (createdDoc?._id) {
            setGalleryCvIds((prev) => ({ ...prev, [template.id]: createdDoc._id }));
          }
        },
        openPaymentModal: ({ cvId, cvTitle, format: payFormat, retryExport }) => {
          setPaymentModalState({
            isOpen: true,
            exportType: payFormat,
            cvId,
            cvTitle,
            retryExport,
          });
        },
      });
    } finally {
      setDownloadingId(null);
      setDownloadType(null);
    }
  };

  const handleDownloadPDF = (template) => triggerCardExport(template, 'pdf');

  const handleDownloadDOCX = (template) => triggerCardExport(template, 'docx');

  // Get realistic CV Data for template preview card
  const getCardCVData = (template) => {
    const isOnePage = template.isOnePage !== false;
    const isBD =
      template.category === 'Bangladesh CVs' ||
      template.categories?.includes('Bangladesh CVs') ||
      template.id?.startsWith('bd-') ||
      template.id === 'onepage-bd-compact';

    const defaultSampleNames = new Set([
      'Nafis Ahmed',
      'Daniel Carter',
      'Tahmidur Rahman Dipto',
      'Tahmidur Rahman',
      'Marcus Sterling',
      'Dr. Nusrat Jahan',
      'Dr. Md. Saiful Islam',
      'Tanvir Hasan Chowdhury',
      'Mohammad Shakil Ahmed',
      'Sadia Rahman',
      'Farhan Kabir',
      'Sophia Chen',
    ]);
    const userHasCustomData =
      currentCV?.personalInfo?.fullName &&
      !defaultSampleNames.has(currentCV.personalInfo.fullName.trim());

    const baseData = userHasCustomData
      ? currentCV
      : template.personaPreviewData
        ? template.personaPreviewData
        : isOnePage
          ? FRESHER_ONE_PAGE_CV
          : isBD
            ? TAHMIDUR_RAHMAN_CV
            : DANIEL_CARTER_CV;

    return stripTransientCvMeta({
      ...baseData,
      templateId: template.id,
      designTokens: template.defaultDesignTokens || baseData.designTokens,
      design: {
        ...baseData.design,
        primaryColor: template.thumbnailColor || baseData.design?.primaryColor || '#2563eb',
        accentColor: template.accentColor || baseData.design?.accentColor || '#3b82f6',
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
            <Layout className="w-3.5 h-3.5 text-blue-600" />
            <span>{templatesList.length} Curated One-Page &amp; Multi-Page Templates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Your Resume Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Explore our default One-Page Collection for students and fresh graduates, or filter by Multiple-Page, Bangladesh, Tech, Executive, and Academic styles.
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
                placeholder="Search templates (e.g. One-Page, Bangladesh, Tech)..."
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

          {/* Dynamic Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? category === 'One-Page CVs'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : category === 'Multiple-Page CVs'
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800 hover:bg-purple-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category === 'Bangladesh CVs' ? '🇧🇩 Bangladesh CVs' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid with Real Live Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            const isDownloading = downloadingId === tpl.id;
            const cardCVData = getCardCVData(tpl);

            return (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header bar with Template Name & Badges */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tpl.thumbnailColor || '#2563eb' }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tpl.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        tpl.isOnePage !== false
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800'
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800'
                      }`}
                    >
                      {tpl.isOnePage !== false ? '1-Page' : 'Multi-Page'}
                    </span>
                    {tpl.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800">
                        {tpl.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(tpl.id)}
                      className="text-slate-400 hover:text-amber-500 p-0.5 transition-colors cursor-pointer"
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
                    id={`gallery-preview-sheet-${tpl.id}`}
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

                  <div className="space-y-1.5 pt-1">
                    {/* Primary Button: Use Template (Opens in Full Editor) */}
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Use Template</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Instant PDF Download */}
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => handleDownloadPDF(tpl)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        title="Download crisp A4 PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span>{isDownloading && downloadType === 'pdf' ? '...' : 'PDF'}</span>
                      </button>

                      {/* Instant Word DOCX Download */}
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => handleDownloadDOCX(tpl)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        title="Download Microsoft Word .docx"
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>{isDownloading && downloadType === 'docx' ? '...' : 'Word'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Pagination */}
        {visibleCount < filteredTemplates.length && (
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm hover:shadow hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Load More Templates</span>
              <span className="text-xs text-slate-500 font-normal">
                ({displayedTemplates.length} of {filteredTemplates.length} shown)
              </span>
            </button>
          </div>
        )}

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
                setSelectedCategory('All CVs');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="min-w-0 pr-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                  <span className="truncate">{previewTemplate.name}</span>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {previewTemplate.category}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {previewTemplate.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Canvas */}
            <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-6 flex justify-center items-start">
              <div
                className="shrink-0 origin-top shadow-2xl rounded bg-white my-2"
                style={{
                  width: `${Math.round(794 * previewScaleFactor)}px`,
                  minHeight: `${Math.round(1123 * previewScaleFactor)}px`,
                }}
              >
                <div
                  id="modal-preview-sheet"
                  style={{
                    width: '794px',
                    minHeight: '1123px',
                    transform: `scale(${previewScaleFactor})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <RenderCVTemplate
                    cvData={getCardCVData(previewTemplate)}
                    scale={1}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <button
                  type="button"
                  disabled={Boolean(downloadingId)}
                  onClick={() => handleDownloadPDF(previewTemplate)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {downloadingId === previewTemplate.id && downloadType === 'pdf'
                      ? 'Generating...'
                      : 'Download PDF'}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={Boolean(downloadingId)}
                  onClick={() => handleDownloadDOCX(previewTemplate)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {downloadingId === previewTemplate.id && downloadType === 'docx'
                      ? 'Generating...'
                      : 'Download Word'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = previewTemplate.id;
                    setPreviewTemplate(null);
                    handleSelectTemplate(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Open in Full Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment & Export Authorization Modal */}
      <PaymentExportModal
        isOpen={paymentModalState.isOpen}
        onClose={() =>
          setPaymentModalState((prev) => ({ ...prev, isOpen: false }))
        }
        exportType={paymentModalState.exportType}
        cvId={paymentModalState.cvId}
        cvTitle={paymentModalState.cvTitle}
        onSuccess={() => {
          const retry = paymentModalState.retryExport;
          setPaymentModalState((prev) => ({ ...prev, isOpen: false }));
          if (typeof retry === 'function') {
            retry();
          }
        }}
      />
    </div>
  );
};

export default TemplateGalleryPage;
