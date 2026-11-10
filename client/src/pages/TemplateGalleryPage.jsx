import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTemplateId } from '../store/cvSlice';
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
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import RenderCVTemplate from '../templates';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  INITIAL_CV_DATA,
} from '@shared/constants/cvDefaults.js';

export const TemplateGalleryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [favorites, setFavorites] = useState(['modern-minimal', 'ocean-split']);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_REGISTRY.filter((tpl) => {
      const matchesCategory =
        selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.features?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = (id) => {
    dispatch(setTemplateId(id));
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Layout className="w-3.5 h-3.5" /> Curated Template Library
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Select Your Resume Template
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered by recruitment specialists and tested on leading enterprise ATS platforms. Switch templates anytime without losing your work.
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
                placeholder="Search 50+ templates (e.g. Modern, BDJobs, ATS)..."
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
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            return (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Thumbnail Frame */}
                <div
                  className="h-64 relative p-4 flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100 dark:border-slate-800"
                  style={{ backgroundColor: `${tpl.thumbnailColor}08` }}
                  onClick={() => setPreviewTemplate(tpl)}
                >
                  {/* Mock Miniature Document */}
                  <div className="w-full h-full bg-white rounded shadow-md p-3 text-[7px] leading-tight overflow-hidden pointer-events-none group-hover:scale-105 transition-transform duration-300 border border-slate-100">
                    <div className="h-3 w-24 rounded mb-2" style={{ backgroundColor: tpl.thumbnailColor }} />
                    <div className="h-1.5 w-36 bg-slate-200 rounded mb-3" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-100 rounded" />
                      <div className="h-1 w-5/6 bg-slate-100 rounded" />
                      <div className="h-1 w-4/6 bg-slate-100 rounded" />
                    </div>
                    <div className="h-2 w-16 bg-slate-300 rounded mt-4 mb-1.5" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-100 rounded" />
                      <div className="h-1 w-11/12 bg-slate-100 rounded" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700">
                    {tpl.badge}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tpl.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isFav ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>

                  {/* Hover Overlay with Preview Trigger */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(tpl);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-lg flex items-center gap-1.5 hover:bg-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" /> Quick Preview
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {tpl.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                        {tpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    {/* Features list */}
                    {tpl.features && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tpl.features.slice(0, 2).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                          >
                            • {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      iconRight={ArrowRight}
                    >
                      Use Template
                    </Button>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          maxWidth="max-w-4xl"
          title={previewTemplate.name}
          subtitle={`${previewTemplate.category} Template • ${previewTemplate.description}`}
        >
          <div className="space-y-4">
            <div className="py-4 flex justify-center bg-slate-900 rounded-2xl overflow-x-auto p-4 max-h-[65vh]">
              <div className="transform scale-[0.65] sm:scale-[0.8] origin-top">
                <RenderCVTemplate
                  cvData={{
                    ...INITIAL_CV_DATA,
                    templateId: previewTemplate.id,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setPreviewTemplate(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSelectTemplate(previewTemplate.id)}
                iconRight={ArrowRight}
              >
                Use This Template Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TemplateGalleryPage;

