import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDesign, updatePersonalInfo, setTemplateId } from '../../../store/cvSlice';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Sliders,
  Type,
  Maximize2,
  Sparkles,
  Camera,
  Trash2,
  Check,
  Circle,
  Square,
  Layers,
  Layout,
} from 'lucide-react';
import { FONT_OPTIONS, COLOR_PALETTES, TEMPLATES_REGISTRY } from '@shared/constants/cvDefaults.js';

export const EditorInspector = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const currentCV = useSelector((state) => state.cv.currentCV);
  const { design = {}, personalInfo = {}, templateId } = currentCV || {};
  const { activeSection, activeField } = useSelector((state) => state.ui);

  const primaryColor = design?.primaryColor || '#4f46e5';

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto text-xs">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          {activeField ? 'Inspector & Text Formatting' : 'Design & Document Settings'}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {activeField
            ? `Editing element: ${activeField}`
            : 'Select any element on your CV to format text'}
        </p>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Template Switcher */}
        <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-emerald-600" />
              Active Template
            </label>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              {TEMPLATES_REGISTRY.length} Distinct Designs
            </span>
          </div>
          <select
            value={templateId || 'onepage-fresher-clean'}
            onChange={(e) => dispatch(setTemplateId(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {TEMPLATES_REGISTRY.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.isOnePage ? '1-Page' : 'Multi-Page'})
              </option>
            ))}
          </select>
        </div>

        {/* 1. Quick Formatting Toolbar (Matches screenshot 1 & 2) */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Typography & Style
          </label>

          {/* Bold, Italic, Alignment Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 font-bold"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 italic"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 underline"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => dispatch(updateDesign({ textAlignment: 'left' }))}
              className={`p-1.5 rounded-lg ${
                design?.textAlignment === 'left' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(updateDesign({ textAlignment: 'center' }))}
              className={`p-1.5 rounded-lg ${
                design?.textAlignment === 'center' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(updateDesign({ textAlignment: 'right' }))}
              className={`p-1.5 rounded-lg ${
                design?.textAlignment === 'right' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(updateDesign({ textAlignment: 'justify' }))}
              className={`p-1.5 rounded-lg ${
                design?.textAlignment === 'justify' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
              }`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Font Family Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500">Font Family</span>
            <select
              value={design?.fontFamily || 'Inter'}
              onChange={(e) => dispatch(updateDesign({ fontFamily: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Scale */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>Text Scale</span>
              <span className="capitalize text-indigo-600 dark:text-indigo-400 font-bold">
                {design?.fontSize || 'medium'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['small', 'medium', 'large'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => dispatch(updateDesign({ fontSize: sz }))}
                  className={`py-1.5 rounded-xl border text-xs capitalize font-medium transition-all ${
                    design?.fontSize === sz
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Color Scheme & Swatches (Matches screenshot 1 & 2) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl shadow-sm border border-slate-300 shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => dispatch(updateDesign({ primaryColor: e.target.value }))}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => dispatch(updateDesign({ primaryColor: e.target.value }))}
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          {/* Quick preset color dots */}
          <div className="flex items-center gap-2 pt-1">
            {['#4f46e5', '#0284c7', '#059669', '#f43f5e', '#d97706', '#0f172a'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => dispatch(updateDesign({ primaryColor: c }))}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  primaryColor === c ? 'scale-110 border-indigo-600 ring-2 ring-indigo-500/30' : 'border-white'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* 3. Photo & Headshot Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Profile Photo
            </label>
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              {personalInfo.photo ? 'Crop / Edit' : 'Add Photo'}
            </button>
          </div>

          {personalInfo.photo ? (
            <div className="space-y-3">
              {/* Photo Shape */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'portrait', label: 'Portrait (35×45mm)', icon: Square },
                  { id: 'circle', label: 'Circle', icon: Circle },
                  { id: 'rounded', label: 'Rounded', icon: Square },
                  { id: 'square', label: 'Square', icon: Square },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => dispatch(updatePersonalInfo({ photoStyle: s.id }))}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                      personalInfo.photoStyle === s.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 font-bold'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                ))}
              </div>

              {/* Photo Size on Page */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'sm', label: 'S' },
                  { id: 'md', label: 'M' },
                  { id: 'lg', label: 'L' },
                  { id: 'xl', label: 'XL' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => dispatch(updateDesign({ photoSize: sz.id }))}
                    className={`py-1 rounded-lg border text-xs font-semibold ${
                      design?.photoSize === sz.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Upload Professional Photo
            </button>
          )}
        </div>

        {/* 4. Page Spacing & Margins */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Page Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Paper Size</span>
              <select
                value={design?.pageSize || 'A4'}
                onChange={(e) => dispatch(updateDesign({ pageSize: e.target.value }))}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="A4">A4 (210 × 297mm)</option>
                <option value="Letter">US Letter (8.5 × 11")</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Page Margins</span>
              <select
                value={design?.margins || 'normal'}
                onChange={(e) => dispatch(updateDesign({ margins: e.target.value }))}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="compact">Compact (0.5")</option>
                <option value="normal">Normal (0.75")</option>
                <option value="wide">Wide (1.0")</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorInspector;

