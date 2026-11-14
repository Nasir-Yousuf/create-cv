import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateDesign,
  updateDesignTokens,
  setTemplateId,
  resetDesignToTemplateDefaults,
} from '../../../store/cvSlice';
import { showToast } from '../../../store/uiSlice';
import {
  Palette,
  Type,
  Layout,
  Sliders,
  Columns,
  Maximize2,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  FONT_OPTIONS,
  COLOR_PALETTES,
  TEMPLATES_REGISTRY,
} from '@shared/constants/cvDefaults.js';

export const AdvancedLayoutControls = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const currentCV = useSelector((state) => state.cv.currentCV || {});
  const { design = {}, designTokens = {}, templateId } = currentCV;

  const pageMargin = designTokens?.pageMargin || design?.pageMargin || '24px';
  const sectionSpacing = designTokens?.sectionSpacing || design?.sectionSpacing || '16px';
  const itemSpacing = designTokens?.itemSpacing || design?.itemSpacing || '8px';
  const columnRatio = designTokens?.columnRatio || design?.columnRatio || '35/65';
  const dividerThickness = designTokens?.dividerThickness || design?.dividerThickness || '1px';

  const handleResetDefaults = () => {
    dispatch(resetDesignToTemplateDefaults());
    dispatch(
      showToast({
        message: 'Reset layout & styling to template default',
        type: 'info',
      })
    );
  };

  const handleSetMargin = (m) => {
    const px = m === 'compact' ? '16px' : m === 'spacious' ? '32px' : '24px';
    dispatch(updateDesign({ margins: m, pageMargin: px }));
    dispatch(updateDesignTokens({ pageMargin: px }));
  };

  const handleSetSectionSpacing = (sp) => {
    const px = sp === 'compact' ? '10px' : sp === 'spacious' ? '24px' : '16px';
    dispatch(updateDesign({ sectionSpacing: sp }));
    dispatch(updateDesignTokens({ sectionSpacing: px }));
  };

  const handleSetItemSpacing = (it) => {
    const px = it === 'compact' ? '4px' : it === 'spacious' ? '12px' : '8px';
    dispatch(updateDesign({ itemSpacing: px }));
    dispatch(updateDesignTokens({ itemSpacing: px }));
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Template Switcher & Reset Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-500" /> Active Template
          </label>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            title="Reset layout and styling to template defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Default</span>
          </button>
        </div>

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
                {templateId === t.id && (
                  <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {t.isOnePage ? '1-Page CV' : 'Multi-Page'} • {t.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Page Margins & Paper Format */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" /> Page Margins & Paper
          </span>
          <span className="text-[10px] font-mono text-slate-500">{pageMargin}</span>
        </label>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'compact', label: 'Compact', desc: '16px (0.5")' },
            { id: 'normal', label: 'Normal', desc: '24px (0.75")' },
            { id: 'spacious', label: 'Spacious', desc: '32px (1.0")' },
          ].map((m) => {
            const isMatch =
              design.margins === m.id ||
              pageMargin === (m.id === 'compact' ? '16px' : m.id === 'spacious' ? '32px' : '24px');
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSetMargin(m.id)}
                className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                  isMatch
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">{m.label}</div>
                <div className="text-[9.5px] opacity-70 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            Paper Standard
          </span>
          <div className="flex gap-1.5">
            {['A4', 'Letter'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => dispatch(updateDesign({ pageSize: fmt }))}
                className={`px-3 py-1 rounded-lg border text-[11px] font-semibold ${
                  (design.pageSize || 'A4') === fmt
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {fmt === 'A4' ? 'A4 (210×297mm)' : 'US Letter'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Section Spacing & Item Spacing */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Vertical Density & Spacing
          </span>
          <span className="text-[10px] font-mono text-slate-500">{sectionSpacing}</span>
        </label>

        {/* Section Spacing */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Section Spacing</span>
            <span className="font-mono text-indigo-600 font-semibold">{sectionSpacing}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {['compact', 'normal', 'spacious'].map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => handleSetSectionSpacing(sp)}
                className={`py-1 rounded-lg border text-[11px] capitalize font-medium ${
                  (design.sectionSpacing || 'normal') === sp
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="2"
            value={parseInt(sectionSpacing, 10) || 16}
            onChange={(e) => {
              const val = `${e.target.value}px`;
              dispatch(updateDesign({ sectionSpacing: val }));
              dispatch(updateDesignTokens({ sectionSpacing: val }));
            }}
            className="w-full accent-indigo-600 cursor-pointer pt-1"
          />
        </div>

        {/* Item Spacing */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Item Gap (Jobs, Degrees, Projects)</span>
            <span className="font-mono text-indigo-600 font-semibold">{itemSpacing}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {['compact', 'normal', 'spacious'].map((it) => (
              <button
                key={it}
                type="button"
                onClick={() => handleSetItemSpacing(it)}
                className={`py-1 rounded-lg border text-[11px] capitalize font-medium ${
                  (design.itemSpacing || '8px') === (it === 'compact' ? '4px' : it === 'spacious' ? '12px' : '8px')
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                {it}
              </button>
            ))}
          </div>
          <input
            type="range"
            min="2"
            max="18"
            step="1"
            value={parseInt(itemSpacing, 10) || 8}
            onChange={(e) => {
              const val = `${e.target.value}px`;
              dispatch(updateDesign({ itemSpacing: val }));
              dispatch(updateDesignTokens({ itemSpacing: val }));
            }}
            className="w-full accent-indigo-600 cursor-pointer pt-1"
          />
        </div>
      </div>

      {/* 4. Column Ratio & Divider Thickness */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Columns className="w-3.5 h-3.5 text-indigo-500" /> Columns & Divider Lines
          </span>
          <span className="text-[10px] font-mono text-slate-500">{columnRatio}</span>
        </label>

        {/* Column Ratio Presets */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: '30/70', label: '30 / 70 Sidebar' },
            { id: '35/65', label: '35 / 65 Balanced' },
            { id: '65/35', label: '65 / 35 Right Col' },
            { id: '100', label: 'Single Column (Full)' },
          ].map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => {
                dispatch(updateDesign({ columnRatio: col.id }));
                dispatch(updateDesignTokens({ columnRatio: col.id }));
              }}
              className={`p-2 rounded-xl border text-left text-[11px] transition-all ${
                columnRatio === col.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>

        {/* Divider Thickness */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Divider Thickness</span>
            <span className="font-mono text-indigo-600 font-semibold">{dividerThickness}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['0px', '1px', '2px', '3px'].map((dt) => (
              <button
                key={dt}
                type="button"
                onClick={() => {
                  dispatch(updateDesign({ dividerThickness: dt }));
                  dispatch(updateDesignTokens({ dividerThickness: dt }));
                }}
                className={`py-1 rounded-lg border text-[11px] font-semibold ${
                  dividerThickness === dt
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                {dt === '0px' ? 'None' : dt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Headshot Studio Access */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onOpenPhotoModal}
          className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-indigo-600" />
          <span>Profile Photo Studio & Framing</span>
        </button>
      </div>
    </div>
  );
};

export default AdvancedLayoutControls;
