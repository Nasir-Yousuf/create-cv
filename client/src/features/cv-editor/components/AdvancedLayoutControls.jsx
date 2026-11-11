import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDesign, setTemplateId } from '../../../store/cvSlice';
import {
  Palette,
  Type,
  Layout,
  Sliders,
  AlignLeft,
  AlignJustify,
  Columns,
  Maximize2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import {
  FONT_OPTIONS,
  COLOR_PALETTES,
  TEMPLATES_REGISTRY,
} from '@shared/constants/cvDefaults.js';

export const AdvancedLayoutControls = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const { design, templateId, personalInfo } = useSelector((state) => state.cv.currentCV);

  const handleColorChange = (primary, accent) => {
    dispatch(updateDesign({ primaryColor: primary, accentColor: accent }));
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Template Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-indigo-500" /> Active Template
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {TEMPLATES_REGISTRY.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => dispatch(setTemplateId(t.id))}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                templateId === t.id
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/80 ring-1 ring-indigo-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                  {t.name}
                </span>
                {templateId === t.id && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {t.isOnePage ? '1-Page CV' : 'Multi-Page'} • {t.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Color Palettes */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-500" /> Color Accent & Palette
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PALETTES.map((pal) => (
            <button
              key={pal.name}
              type="button"
              onClick={() => handleColorChange(pal.primary, pal.accent)}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                design.primaryColor === pal.primary
                  ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full shadow-sm"
                style={{ backgroundColor: pal.primary }}
              />
              <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate w-full text-center">
                {pal.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Hex Color Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="color"
            value={design.primaryColor || '#4f46e5'}
            onChange={(e) => dispatch(updateDesign({ primaryColor: e.target.value }))}
            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
          />
          <input
            type="text"
            value={design.primaryColor || '#4f46e5'}
            onChange={(e) => dispatch(updateDesign({ primaryColor: e.target.value }))}
            className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* 3. Typography */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-500" /> Typography & Font Family
        </label>
        <select
          value={design.fontFamily || 'Inter'}
          onChange={(e) => dispatch(updateDesign({ fontFamily: e.target.value }))}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Font Size & Spacing buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Font Size</span>
            <div className="grid grid-cols-3 gap-1">
              {['small', 'medium', 'large'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => dispatch(updateDesign({ fontSize: sz }))}
                  className={`py-1.5 rounded-lg border text-[10px] font-medium capitalize transition-all ${
                    design.fontSize === sz
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sz[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Line Spacing</span>
            <div className="grid grid-cols-3 gap-1">
              {['compact', 'normal', 'relaxed'].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => dispatch(updateDesign({ lineSpacing: sp }))}
                  className={`py-1.5 rounded-lg border text-[10px] font-medium capitalize transition-all ${
                    design.lineSpacing === sp
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sp[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Column Ratio & Margins */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Columns className="w-3.5 h-3.5 text-indigo-500" /> Layout Columns & Margins
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Dual-Column Ratio</span>
            <select
              value={design.columnRatio || '33/67'}
              onChange={(e) => dispatch(updateDesign({ columnRatio: e.target.value }))}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <option value="25/75">25% Sidebar / 75% Body</option>
              <option value="33/67">33% Sidebar / 67% Body</option>
              <option value="40/60">40% Sidebar / 60% Body</option>
              <option value="50/50">50% / 50% Balanced</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Page Margins</span>
            <div className="grid grid-cols-3 gap-1">
              {['compact', 'normal', 'wide'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => dispatch(updateDesign({ margins: m }))}
                  className={`py-1.5 rounded-lg border text-[10px] font-medium capitalize transition-all ${
                    design.margins === m
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Photo Positioning & Visibility */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Headshot Settings
          </label>
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Crop / Upload
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Position</span>
            <div className="grid grid-cols-3 gap-1">
              {['left', 'center', 'right'].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => dispatch(updateDesign({ photoPosition: pos }))}
                  className={`py-1.5 rounded-lg border text-[10px] font-medium capitalize transition-all ${
                    design.photoPosition === pos
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {pos[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Visibility</span>
            <button
              type="button"
              onClick={() => dispatch(updateDesign({ showPhoto: !design.showPhoto }))}
              className={`w-full py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                design.showPhoto
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-300 text-slate-500'
              }`}
            >
              {design.showPhoto ? 'Photo Visible' : 'Photo Hidden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLayoutControls;

