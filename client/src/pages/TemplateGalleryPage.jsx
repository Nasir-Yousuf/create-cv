import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Heart,
  Eye,
  ArrowRight,
  Layout,
  Layers,
  Download,
  FileText,
  X,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Filter,
  Check,
  Camera,
  SlidersHorizontal,
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

// Curated designer palette swatches for live modal preview testing
const PALETTE_SWATCHES = [
  { id: 'original', name: 'Original', primary: null, accent: null },
  { id: 'oxford-navy', name: 'Oxford Navy', primary: '#1e3a8a', accent: '#3b82f6' },
  { id: 'slate-executive', name: 'Slate Executive', primary: '#0f172a', accent: '#38bdf8' },
  { id: 'emerald-corporate', name: 'Emerald Corporate', primary: '#047857', accent: '#10b981' },
  { id: 'dhaka-teal', name: 'Dhaka Teal', primary: '#0f766e', accent: '#14b8a6' },
  { id: 'cobalt-tech', name: 'Cobalt Tech', primary: '#1d4ed8', accent: '#60a5fa' },
  { id: 'sunset-coral', name: 'Sunset Coral', primary: '#ea580c', accent: '#fb923c' },
  { id: 'royal-burgundy', name: 'Royal Burgundy', primary: '#881337', accent: '#f43f5e' },
  { id: 'amber-bronze', name: 'Amber Bronze', primary: '#b45309', accent: '#f59e0b' },
  { id: 'minimal-charcoal', name: 'Minimal Charcoal', primary: '#18181b', accent: '#71717a' },
  { id: 'violet-tech', name: 'Violet Tech', primary: '#6d28d9', accent: '#a78bfa' },
  { id: 'crimson-edge', name: 'Crimson Edge', primary: '#dc2626', accent: '#f87171' },
];

/**
 * Lightweight animated skeleton placeholder displayed when a card is offscreen.
 * Mimics the template's layout architecture without rendering the heavy 794x1123 DOM tree.
 */
const TemplateSkeleton = ({ template }) => {
  const accent = template.thumbnailColor || '#2563eb';
  const isSplitLeft =
    template.layoutType === 'two-column-left' ||
    template.layoutArchitecture?.includes('split') ||
    template.layoutArchitecture?.includes('sidebar');
  const isSplitRight =
    template.layoutType === 'two-column-right' ||
    template.layoutArchitecture === 'onepage-bd-compact';
  const isGrid = template.layoutType === 'grid';

  return (
    <div className="w-full h-full p-4 flex flex-col justify-between bg-white dark:bg-slate-900 select-none">
      {/* Skeleton Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div
          className="w-9 h-9 rounded-full shrink-0 opacity-25 animate-pulse"
          style={{ backgroundColor: accent }}
        />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
          <div
            className="h-2 rounded w-1/3 opacity-40 animate-pulse"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      {/* Skeleton Body Layout */}
      <div className="flex gap-3 flex-1 pt-3 min-h-0 overflow-hidden">
        {isSplitLeft && (
          <div
            className="w-1/3 rounded-lg p-2 space-y-2 opacity-20 animate-pulse"
            style={{ backgroundColor: accent }}
          >
            <div className="h-2 bg-slate-400 rounded w-3/4" />
            <div className="h-2 bg-slate-400 rounded w-1/2" />
            <div className="h-2 bg-slate-400 rounded w-2/3" />
            <div className="h-2 bg-slate-400 rounded w-4/5 pt-1" />
          </div>
        )}

        <div className="flex-1 space-y-2.5">
          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
          <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-full animate-pulse" />
          <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-4/5 animate-pulse" />

          {isGrid ? (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-8 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200/60 dark:border-slate-800" />
              <div className="h-8 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200/60 dark:border-slate-800" />
            </div>
          ) : (
            <>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2 pt-1 animate-pulse" />
              <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-full animate-pulse" />
              <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-3/4 animate-pulse" />
            </>
          )}
        </div>

        {isSplitRight && (
          <div
            className="w-1/3 rounded-lg p-2 space-y-2 opacity-20 animate-pulse"
            style={{ backgroundColor: accent }}
          >
            <div className="h-2 bg-slate-400 rounded w-3/4" />
            <div className="h-2 bg-slate-400 rounded w-1/2" />
          </div>
        )}
      </div>

      {/* Skeleton Footer */}
      <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
          {template.isOnePage !== false ? '1-Page A4' : 'Multi-Page A4'}
        </span>
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </div>
  );
};

/**
 * High-performance Lazy Template Card that utilizes IntersectionObserver
 * to defer mounting heavy React A4 trees until the card approaches the viewport.
 * Guarantees a steady 60fps scroll experience across 160+ templates on mobile devices.
 */
const LazyTemplateCard = ({
  template,
  isFav,
  isDownloading,
  downloadType,
  cardCVData,
  onToggleFavorite,
  onPreview,
  onSelect,
  onDownloadPDF,
  onDownloadDOCX,
}) => {
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '300px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Header bar with Template Name & Badges */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
            style={{ backgroundColor: template.thumbnailColor || '#2563eb' }}
          />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {template.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
              template.isOnePage !== false
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800'
                : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800'
            }`}
          >
            {template.isOnePage !== false ? '1-Page' : 'Multi-Page'}
          </span>
          {template.badge && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9.5px] font-bold border border-emerald-200/60 dark:border-emerald-800 hidden sm:inline-block">
              {template.badge}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template.id);
            }}
            className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
                isFav ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* SCALED LIVE SHEET PREVIEW (Lazy Mounted via IntersectionObserver) */}
      <div
        className="relative h-[375px] bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-start justify-center pt-2 cursor-pointer group/preview"
        onClick={() => onPreview(template)}
        title="Click to view full preview and test color swatches"
      >
        {isIntersecting ? (
          <div
            id={`gallery-preview-sheet-${template.id}`}
            className="w-[794px] origin-top pointer-events-none select-none transition-transform duration-300 group-hover/preview:scale-[0.35]"
            style={{ transform: 'scale(0.33)' }}
          >
            <RenderCVTemplate cvData={cardCVData} scale={1} />
          </div>
        ) : (
          <TemplateSkeleton template={template} />
        )}

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
          {template.description}
        </p>

        <div className="space-y-1.5 pt-1">
          {/* Primary Button: Use Template (Opens in Full Editor) */}
          <button
            type="button"
            onClick={() => onSelect(template.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Use Template</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Instant PDF Download */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onDownloadPDF(template)}
              className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Download crisp A4 PDF"
            >
              <Download className="w-3 h-3" />
              <span>{isDownloading && downloadType === 'pdf' ? 'Exporting...' : 'PDF'}</span>
            </button>

            {/* Instant Word DOCX Download */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onDownloadDOCX(template)}
              className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Download Microsoft Word .docx"
            >
              <FileText className="w-3 h-3 text-blue-600" />
              <span>{isDownloading && downloadType === 'docx' ? 'Exporting...' : 'Word'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TemplateGalleryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();

  const { currentCV } = useSelector((state) => state.cv);

  const [templatesList, setTemplatesList] = useState(TEMPLATES_REGISTRY);
  const [categoriesList, setCategoriesList] = useState(TEMPLATE_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [formatFilter, setFormatFilter] = useState('all'); // 'all' | 'onepage' | 'multipage'
  const [photoFilter, setPhotoFilter] = useState('all'); // 'all' | 'with-photo' | 'no-photo'
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [selectedPalette, setSelectedPalette] = useState(PALETTE_SWATCHES[0]);
  const [previewZoom, setPreviewZoom] = useState(null); // dynamic calculation or manual override
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadType, setDownloadType] = useState(null);
  const [favorites, setFavorites] = useState(() => templateService.getFavorites());
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
  }, [selectedCategory, formatFilter, photoFilter, onlyFavorites, searchQuery]);

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

  // When preview modal opens, reset selected palette to default
  useEffect(() => {
    if (previewTemplate) {
      setSelectedPalette(PALETTE_SWATCHES[0]);
      setPreviewZoom(null);
    }
  }, [previewTemplate]);

  const toggleFavorite = (id) => {
    const updated = templateService.toggleFavorite(id);
    setFavorites(updated);
  };

  const filteredTemplates = useMemo(() => {
    return templatesList.filter((tpl) => {
      // 1. Category Filter
      const matchesCategory = templateMatchesCategory(tpl, selectedCategory);
      if (!matchesCategory) return false;

      // 2. Format Filter (One-Page vs Multi-Page)
      if (formatFilter === 'onepage' && tpl.isOnePage === false) return false;
      if (formatFilter === 'multipage' && tpl.isOnePage !== false) return false;

      // 3. Photo Filter (With Photo vs No Photo)
      const hasPhoto = tpl.photoFormat && tpl.photoFormat !== 'none';
      if (photoFilter === 'with-photo' && !hasPhoto) return false;
      if (photoFilter === 'no-photo' && hasPhoto) return false;

      // 4. Favorites Filter
      if (onlyFavorites && !favorites.includes(tpl.id)) return false;

      // 5. Search Query
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const matchesSearch =
        tpl.name.toLowerCase().includes(q) ||
        tpl.description?.toLowerCase().includes(q) ||
        tpl.badge?.toLowerCase().includes(q) ||
        tpl.category?.toLowerCase().includes(q) ||
        tpl.features?.some((f) => f.toLowerCase().includes(q)) ||
        tpl.professions?.some((p) => p.toLowerCase().includes(q)) ||
        tpl.categories?.some((c) => c.toLowerCase().includes(q));

      return matchesSearch;
    });
  }, [templatesList, selectedCategory, formatFilter, photoFilter, onlyFavorites, searchQuery, favorites]);

  const displayedTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  // Handle template selection and launch editor with optional custom palette
  const handleSelectTemplate = (id, customPalette = null) => {
    const canonicalId = resolveTemplateId(id);
    dispatch(setTemplateId(canonicalId));
    const meta = templatesList.find((t) => t.id === canonicalId) || resolveTemplateMeta(canonicalId);

    const primaryColor =
      customPalette?.primary ||
      meta?.thumbnailColor ||
      meta?.defaultDesignTokens?.primaryColor ||
      '#2563eb';
    const accentColor =
      customPalette?.accent ||
      meta?.accentColor ||
      primaryColor;

    dispatch(updateDesign({ primaryColor, accentColor }));
    dispatch(
      showToast({
        message: `Template selected: ${meta?.name || canonicalId}`,
        type: 'success',
      })
    );
    navigate('/builder');
  };

  const triggerCardExport = async (template, format, customCVData = null) => {
    if (!template || downloadingId) return;
    setDownloadingId(template.id);
    setDownloadType(format);

    try {
      const cvToExport = customCVData || getCardCVData(template);
      const elementId = customCVData
        ? 'modal-preview-sheet'
        : `gallery-preview-sheet-${template.id}`;

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

  const handleDownloadPDF = (template, customCV = null) => triggerCardExport(template, 'pdf', customCV);
  const handleDownloadDOCX = (template, customCV = null) => triggerCardExport(template, 'docx', customCV);

  // Get realistic profession-relevant CV Data for template preview card
  const getCardCVData = (template, overridePalette = null) => {
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
      'Arifa Sultana',
      'Engr. Tariqul Islam, P.Eng.',
      'Md. Kamal Hossain',
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

    const effectivePrimary =
      overridePalette?.primary ||
      template.thumbnailColor ||
      baseData.design?.primaryColor ||
      '#2563eb';
    const effectiveAccent =
      overridePalette?.accent ||
      template.accentColor ||
      baseData.design?.accentColor ||
      '#3b82f6';

    return stripTransientCvMeta({
      ...baseData,
      templateId: template.id,
      isOnePage,
      designTokens: {
        ...(template.defaultDesignTokens || baseData.designTokens || {}),
        primaryColor: effectivePrimary,
        accentColor: effectiveAccent,
      },
      design: {
        ...baseData.design,
        primaryColor: effectivePrimary,
        accentColor: effectiveAccent,
      },
    });
  };

  // Compute responsive modal scale
  const modalScaleFactor = useMemo(() => {
    if (previewZoom !== null) return previewZoom;
    const availableWidth = Math.min(windowWidth - 48, 880);
    return Math.min(0.9, Math.max(0.38, availableWidth / 794));
  }, [windowWidth, previewZoom]);

  const activeFiltersCount =
    (selectedCategory !== 'All Templates' && selectedCategory !== 'All CVs' ? 1 : 0) +
    (formatFilter !== 'all' ? 1 : 0) +
    (photoFilter !== 'all' ? 1 : 0) +
    (onlyFavorites ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('All Templates');
    setFormatFilter('all');
    setPhotoFilter('all');
    setOnlyFavorites(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors select-none">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{templatesList.length} Profession-Tuned CV &amp; Resume Templates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your High-Impact Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real A4 previews rendered with authentic industry sample profiles. Zero lorem ipsum, 100% vector PDF accuracy, and instantaneous 60fps scrolling.
          </p>
        </div>

        {/* Search, Filter Bar & Formats */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search templates by profession, industry, skill, or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Format & Photo Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Format Filter */}
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setFormatFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    formatFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  onClick={() => setFormatFilter('onepage')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    formatFilter === 'onepage'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1-Page
                </button>
                <button
                  type="button"
                  onClick={() => setFormatFilter('multipage')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    formatFilter === 'multipage'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Multi-Page
                </button>
              </div>

              {/* Photo Filter */}
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setPhotoFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    photoFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Show all templates"
                >
                  All Photos
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('with-photo')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    photoFilter === 'with-photo'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Templates with profile photo"
                >
                  <Camera className="w-3 h-3" />
                  <span>With Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('no-photo')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    photoFilter === 'no-photo'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Text-only ATS templates without photo"
                >
                  No Photo (ATS)
                </button>
              </div>

              {/* Favorites Toggle Pill */}
              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  onlyFavorites
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
                title="Toggle favorite templates"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    onlyFavorites ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>Favorites ({favorites.length})</span>
              </button>

              {/* Reset Filters if active */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline cursor-pointer"
                >
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* 20 Category Pills Horizontal Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
            {categoriesList.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? category === 'One-Page CVs'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : category === 'Bangladesh CVs'
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : category === 'Bangladesh CVs'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/80 hover:bg-emerald-100'
                      : category === 'Multiple-Page CVs'
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/80 hover:bg-purple-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {category === 'Bangladesh CVs' ? '🇧🇩 Bangladesh CVs' : category}
                </button>
              );
            })}
          </div>

          {/* Result Count Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredTemplates.length}</strong> of{' '}
              {templatesList.length} templates
            </span>
            {selectedCategory !== 'All Templates' && (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Filtered by: {selectedCategory}
              </span>
            )}
          </div>
        </div>

        {/* 60fps Lazy Loaded Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            const isDownloading = downloadingId === tpl.id;
            const cardCVData = getCardCVData(tpl);

            return (
              <LazyTemplateCard
                key={tpl.id}
                template={tpl}
                isFav={isFav}
                isDownloading={isDownloading}
                downloadType={downloadType}
                cardCVData={cardCVData}
                onToggleFavorite={toggleFavorite}
                onPreview={(t) => setPreviewTemplate(t)}
                onSelect={(id) => handleSelectTemplate(id)}
                onDownloadPDF={(t) => handleDownloadPDF(t)}
                onDownloadDOCX={(t) => handleDownloadDOCX(t)}
              />
            );
          })}
        </div>

        {/* Pagination: Load More */}
        {visibleCount < filteredTemplates.length && (
          <div className="flex justify-center pt-6 pb-4">
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

        {/* Empty Search / Filter State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <Layers className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching templates found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any templates matching your current search or filter combination. Try resetting your filters to explore our full collection.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN HIGH-RESOLUTION PREVIEW MODAL WITH LIVE PALETTE SWATCH TESTING */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[96vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 gap-3">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {previewTemplate.name}
                  </h3>
                  <span className="shrink-0 text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {previewTemplate.isOnePage !== false ? '1-Page A4' : 'Multi-Page A4'}
                  </span>
                  {previewTemplate.badge && (
                    <span className="shrink-0 text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 hidden sm:inline-block">
                      {previewTemplate.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {previewTemplate.description}
                </p>
              </div>

              {/* Zoom & Close Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((prev) => Math.max(0.4, (prev || modalScaleFactor) - 0.1))}
                    className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold px-1.5 text-slate-700 dark:text-slate-300">
                    {Math.round((previewZoom || modalScaleFactor) * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((prev) => Math.min(1.2, (prev || modalScaleFactor) + 0.1))}
                    className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(null)}
                    className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Reset Zoom to Fit"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Color Palette Swatch Bar */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Test Palette:</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {PALETTE_SWATCHES.map((swatch) => {
                  const isSelected = selectedPalette.id === swatch.id;
                  const color =
                    swatch.primary || previewTemplate.thumbnailColor || '#2563eb';

                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setSelectedPalette(swatch)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 border-slate-900 dark:border-white text-slate-900 dark:text-white shadow-xs ring-2 ring-blue-500/30'
                          : 'bg-white/70 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span>{swatch.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-blue-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable High-Res Document Canvas */}
            <div className="flex-1 overflow-auto bg-slate-150 dark:bg-slate-950 p-2 sm:p-6 flex justify-center items-start">
              <div
                className="shrink-0 origin-top shadow-2xl rounded-sm bg-white my-2 transition-transform duration-200"
                style={{
                  width: `${Math.round(794 * modalScaleFactor)}px`,
                  minHeight: `${Math.round(1123 * modalScaleFactor)}px`,
                }}
              >
                <div
                  id="modal-preview-sheet"
                  style={{
                    width: '794px',
                    minHeight: '1123px',
                    transform: `scale(${modalScaleFactor})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <RenderCVTemplate
                    cvData={getCardCVData(previewTemplate, selectedPalette)}
                    scale={1}
                  />
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <button
                  type="button"
                  disabled={Boolean(downloadingId)}
                  onClick={() =>
                    handleDownloadPDF(
                      previewTemplate,
                      getCardCVData(previewTemplate, selectedPalette)
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {downloadingId === previewTemplate.id && downloadType === 'pdf'
                      ? 'Generating PDF...'
                      : 'Download PDF'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={Boolean(downloadingId)}
                  onClick={() =>
                    handleDownloadDOCX(
                      previewTemplate,
                      getCardCVData(previewTemplate, selectedPalette)
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {downloadingId === previewTemplate.id && downloadType === 'docx'
                      ? 'Generating Word...'
                      : 'Download Word'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const tpl = previewTemplate;
                    const pal = selectedPalette;
                    setPreviewTemplate(null);
                    handleSelectTemplate(tpl.id, pal);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Use This Template</span>
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
