import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateDesign,
  updateDesignTokens,
  updatePersonalInfo,
  setTemplateId,
  setElementOverride,
  removeElementOverride,
  resetDesignToTemplateDefaults,
} from '../../../store/cvSlice';
import { clearSelectedElement, openAIModal, showToast } from '../../../store/uiSlice';
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
  Plus,
  Minus,
  RotateCcw,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  FONT_OPTIONS,
  CURATED_FONT_PAIRINGS,
  COLOR_PALETTES,
  TEMPLATES_REGISTRY,
} from '@shared/constants/cvDefaults.js';

export const EditorInspector = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const currentCV = useSelector((state) => state.cv.currentCV || {});
  const { design = {}, designTokens = {}, personalInfo = {}, templateId } = currentCV;
  const { activeField, selectedElementPath, selectedElementType } = useSelector(
    (state) => state.ui
  );
  const elementOverrides = currentCV?.elementOverrides || {};

  const targetPath = selectedElementPath || activeField;
  const activeOverride = targetPath ? elementOverrides[targetPath] || {} : {};
  const primaryColor = designTokens?.primaryColor || design?.primaryColor || '#2563eb';
  const accentColor = designTokens?.accentColor || design?.accentColor || '#0ea5e9';
  const headingColor = designTokens?.headingColor || design?.headingColor || '#0f172a';
  const bodyColor = designTokens?.bodyColor || design?.textColor || '#334155';
  const backgroundColor = designTokens?.backgroundColor || design?.backgroundColor || '#ffffff';
  const sidebarBgColor = designTokens?.sidebarBgColor || design?.sidebarBgColor || '#f8fafc';
  const dividerColor = designTokens?.dividerColor || design?.dividerColor || '#e2e8f0';
  const badgeBgColor = designTokens?.badgeBgColor || design?.badgeBgColor || '#eff6ff';

  const [activeTab, setActiveTab] = useState('typography'); // 'typography' | 'colors' | 'layout'

  const formatElementLabel = (path) => {
    if (!path) return 'Text Element';
    const parts = path.split('.');
    if (parts.length === 1) return parts[0].replace(/([A-Z])/g, ' $1');
    if (parts.length === 2) return `${parts[0]} • ${parts[1].replace(/([A-Z])/g, ' $1')}`;
    return `${parts[0]} #${parseInt(parts[1], 10) + 1} • ${parts[2]?.replace(/([A-Z])/g, ' $1') || parts[1]}`;
  };

  const currentFontSize =
    typeof activeOverride.fontSize === 'number'
      ? activeOverride.fontSize
      : parseInt(activeOverride.fontSize || (design?.fontSize === 'large' ? 14 : design?.fontSize === 'small' ? 11 : 12), 10);

  const handleApplyPalette = (pal) => {
    dispatch(
      updateDesignTokens({
        primaryColor: pal.primary,
        accentColor: pal.accent,
        headingColor: pal.heading || '#0f172a',
        bodyColor: pal.body || '#334155',
        backgroundColor: pal.bg || '#ffffff',
        sidebarBgColor: pal.sidebarBg || '#f8fafc',
        dividerColor: pal.divider || '#e2e8f0',
        badgeBgColor: pal.badge || '#eff6ff',
      })
    );
    dispatch(
      showToast({
        message: `Applied ${pal.name} color palette`,
        type: 'success',
      })
    );
  };

  const handleApplyFontPairing = (pairing) => {
    dispatch(
      updateDesignTokens({
        fontHeading: pairing.heading,
        fontBody: pairing.body,
      })
    );
    dispatch(
      updateDesign({
        fontFamily: pairing.heading,
        fontBody: pairing.body,
      })
    );
    dispatch(
      showToast({
        message: `Applied ${pairing.name} font pairing (${pairing.heading} + ${pairing.body})`,
        type: 'success',
      })
    );
  };

  const handleResetDefaults = () => {
    dispatch(resetDesignToTemplateDefaults());
    dispatch(
      showToast({
        message: 'Design styling reset to template defaults.',
        type: 'info',
      })
    );
  };

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto text-xs">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {targetPath ? 'Element Inspector' : 'Visual Design Settings'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[210px]">
            {targetPath
              ? formatElementLabel(targetPath)
              : 'Typography, Colors, Tokens & Layout'}
          </p>
        </div>
        {targetPath ? (
          <button
            type="button"
            onClick={() => dispatch(clearSelectedElement())}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Deselect element"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Reset Design to Template Default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-2 py-1.5 gap-1">
        {[
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'colors', label: 'Palettes & Tokens', icon: Palette },
          { id: 'layout', label: 'Layout & Spacing', icon: Sliders },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            <span>{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Selected Element Specific Formatting Banner (if element active) */}
        {targetPath && (
          <div className="space-y-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Selected Element
              </span>
              <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {selectedElementType || 'Text'}
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {formatElementLabel(targetPath)}
            </p>

            {/* Quick Formatting Bar for this element */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40">
              <button
                type="button"
                onClick={() => {
                  const isBold =
                    activeOverride.fontWeight === 'bold' || activeOverride.fontWeight === 700;
                  dispatch(
                    setElementOverride({
                      path: targetPath,
                      overrides: { fontWeight: isBold ? 'normal' : 'bold' },
                    })
                  );
                }}
                className={`p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold transition-colors ${
                  activeOverride.fontWeight === 'bold' || activeOverride.fontWeight === 700
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : ''
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    setElementOverride({
                      path: targetPath,
                      overrides: { italic: !activeOverride.italic },
                    })
                  )
                }
                className={`p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 italic transition-colors ${
                  activeOverride.italic
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : ''
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    setElementOverride({
                      path: targetPath,
                      overrides: { underline: !activeOverride.underline },
                    })
                  )
                }
                className={`p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 underline transition-colors ${
                  activeOverride.underline
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : ''
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
              {['left', 'center', 'right', 'justify'].map((al) => (
                <button
                  key={al}
                  type="button"
                  onClick={() =>
                    dispatch(setElementOverride({ path: targetPath, overrides: { align: al } }))
                  }
                  className={`p-1.5 rounded-lg transition-colors ${
                    activeOverride.align === al
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                  title={`Align ${al}`}
                >
                  {al === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                  {al === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                  {al === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                  {al === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Granular Font Size Stepper */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Element Font Size</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {currentFontSize}px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      setElementOverride({
                        path: targetPath,
                        overrides: { fontSize: Math.max(8, currentFontSize - 1) },
                      })
                    )
                  }
                  className="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="range"
                  min="8"
                  max="44"
                  value={currentFontSize}
                  onChange={(e) =>
                    dispatch(
                      setElementOverride({
                        path: targetPath,
                        overrides: { fontSize: parseInt(e.target.value, 10) },
                      })
                    )
                  }
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      setElementOverride({
                        path: targetPath,
                        overrides: { fontSize: Math.min(44, currentFontSize + 1) },
                      })
                    )
                  }
                  className="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Element Specific Color Override */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Custom Color
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={activeOverride.color || bodyColor}
                  onChange={(e) =>
                    dispatch(
                      setElementOverride({
                        path: targetPath,
                        overrides: { color: e.target.value },
                      })
                    )
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  placeholder={bodyColor}
                  value={activeOverride.color || ''}
                  onChange={(e) =>
                    dispatch(
                      setElementOverride({
                        path: targetPath,
                        overrides: { color: e.target.value },
                      })
                    )
                  }
                  className="w-20 px-2 py-0.5 text-[11px] font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Reset Element & AI Polish */}
            <div className="pt-2 flex items-center justify-between border-t border-indigo-200/50 dark:border-indigo-900/40">
              <button
                type="button"
                onClick={() => dispatch(removeElementOverride(targetPath))}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Element</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    openAIModal({
                      mode: 'summary',
                      contextData: { targetPath },
                    })
                  )
                }
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>AI Polish</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: TYPOGRAPHY CONTROLS */}
        {activeTab === 'typography' && (
          <div className="space-y-5">
            {/* 1. Curated Professional Font Pairings */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Curated Font Pairings</span>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded">
                  4 Designer Combos
                </span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {CURATED_FONT_PAIRINGS.map((pair) => {
                  const isActive =
                    (designTokens?.fontHeading === pair.heading || design?.fontFamily === pair.heading) &&
                    (designTokens?.fontBody === pair.body || design?.fontBody === pair.body);
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => handleApplyFontPairing(pair)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {pair.name}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                      <div className="text-[10.5px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {pair.heading} <span className="text-slate-400 font-normal">+</span> {pair.body}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {pair.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Global Font Selectors */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Font Family Selection
              </label>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500">Heading Font</span>
                <select
                  value={designTokens?.fontHeading || design?.fontFamily || 'Inter'}
                  onChange={(e) => {
                    dispatch(updateDesignTokens({ fontHeading: e.target.value }));
                    dispatch(updateDesign({ fontFamily: e.target.value }));
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500">Body Copy Font</span>
                <select
                  value={designTokens?.fontBody || design?.fontBody || 'Inter'}
                  onChange={(e) => {
                    dispatch(updateDesignTokens({ fontBody: e.target.value }));
                    dispatch(updateDesign({ fontBody: e.target.value }));
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Base Font Scale */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Document Text Scale</span>
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
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Fine-Tuned Typography Spacing */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Spacing & Proportions
              </label>

              {/* Line Height */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Line Height (Leading)</span>
                  <span className="font-mono">{designTokens?.lineHeight || design?.lineHeight || 1.4}</span>
                </div>
                <input
                  type="range"
                  min="1.15"
                  max="1.85"
                  step="0.05"
                  value={parseFloat(designTokens?.lineHeight || design?.lineHeight || 1.4)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    dispatch(updateDesignTokens({ lineHeight: val }));
                    dispatch(updateDesign({ lineHeight: val }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Letter Spacing */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Letter Spacing (Tracking)</span>
                  <span className="font-mono">{designTokens?.letterSpacing || design?.letterSpacing || '0px'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {['-0.5px', '0px', '0.5px', '1px'].map((ls) => (
                    <button
                      key={ls}
                      type="button"
                      onClick={() => {
                        dispatch(updateDesignTokens({ letterSpacing: ls }));
                        dispatch(updateDesign({ letterSpacing: ls }));
                      }}
                      className={`py-1 rounded-lg border text-[10px] font-semibold ${
                        (designTokens?.letterSpacing || design?.letterSpacing || '0px') === ls
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {ls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paragraph Spacing */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Paragraph Gap</span>
                  <span className="font-mono">{designTokens?.paragraphSpacing || design?.paragraphSpacing || '8px'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {['4px', '8px', '12px', '16px'].map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => {
                        dispatch(updateDesignTokens({ paragraphSpacing: ps }));
                        dispatch(updateDesign({ paragraphSpacing: ps }));
                      }}
                      className={`py-1 rounded-lg border text-[10px] font-semibold ${
                        (designTokens?.paragraphSpacing || design?.paragraphSpacing || '8px') === ps
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 12 CURATED COLOR PALETTES & 8 DESIGN TOKENS */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            {/* 1. 12 Designer-Crafted Color Palettes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  12 Designer Palettes
                </label>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Default
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COLOR_PALETTES.map((pal) => {
                  const isSelected =
                    (designTokens?.primaryColor || design?.primaryColor) === pal.primary;
                  return (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => handleApplyPalette(pal)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1.5">
                        <div
                          className="w-4 h-4 rounded-full shadow-xs shrink-0"
                          style={{ backgroundColor: pal.primary }}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0"
                          style={{ backgroundColor: pal.accent }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: pal.sidebarBg || pal.bg || '#ffffff' }}
                        />
                        {isSelected && (
                          <Check className="w-3 h-3 text-indigo-600 ml-auto shrink-0" />
                        )}
                      </div>
                      <span className="font-bold text-[10.5px] text-slate-800 dark:text-slate-200 block truncate">
                        {pal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Color Pickers for 8 Design Tokens */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Design Token Color Overrides
              </label>

              {[
                { id: 'primaryColor', label: 'Primary Brand Color', val: primaryColor },
                { id: 'accentColor', label: 'Accent / Highlight', val: accentColor },
                { id: 'headingColor', label: 'Section Headings', val: headingColor },
                { id: 'bodyColor', label: 'Body Text', val: bodyColor },
                { id: 'backgroundColor', label: 'Page Background', val: backgroundColor },
                { id: 'sidebarBgColor', label: 'Sidebar Background', val: sidebarBgColor },
                { id: 'dividerColor', label: 'Dividers & Borders', val: dividerColor },
                { id: 'badgeBgColor', label: 'Skill Badge Background', val: badgeBgColor },
              ].map((token) => (
                <div key={token.id} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {token.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={token.val}
                      onChange={(e) => {
                        dispatch(updateDesignTokens({ [token.id]: e.target.value }));
                        dispatch(updateDesign({ [token.id]: e.target.value }));
                      }}
                      className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={token.val}
                      onChange={(e) => {
                        dispatch(updateDesignTokens({ [token.id]: e.target.value }));
                        dispatch(updateDesign({ [token.id]: e.target.value }));
                      }}
                      className="w-20 px-2 py-0.5 text-[10.5px] font-mono rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT & SPACING CONTROLS */}
        {activeTab === 'layout' && (
          <div className="space-y-5">
            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Active Template</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  {TEMPLATES_REGISTRY.length} Available
                </span>
              </label>
              <select
                value={templateId || 'onepage-fresher-clean'}
                onChange={(e) => dispatch(setTemplateId(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {TEMPLATES_REGISTRY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.isOnePage ? '1-Page' : 'Multi-Page'})
                  </option>
                ))}
              </select>
            </div>

            {/* Page Paper Size & Margins */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Paper Dimensions & Margin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 mb-1 block">Paper Format</span>
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
                    onChange={(e) => {
                      const m = e.target.value;
                      const pageMargin = m === 'compact' ? '16px' : m === 'wide' ? '32px' : '24px';
                      dispatch(updateDesign({ margins: m, pageMargin }));
                      dispatch(updateDesignTokens({ pageMargin }));
                    }}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <option value="compact">Compact (16px / 0.5")</option>
                    <option value="normal">Normal (24px / 0.75")</option>
                    <option value="wide">Spacious (32px / 1.0")</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Column Ratio */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Column Ratio
              </label>
              <select
                value={designTokens?.columnRatio || design?.columnRatio || '35/65'}
                onChange={(e) => {
                  dispatch(updateDesignTokens({ columnRatio: e.target.value }));
                  dispatch(updateDesign({ columnRatio: e.target.value }));
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="30/70">30% Sidebar / 70% Main Body</option>
                <option value="35/65">35% Sidebar / 65% Main Body</option>
                <option value="65/35">65% Main Body / 35% Sidebar</option>
                <option value="100">Single Column (Full Width)</option>
              </select>
            </div>

            {/* Section Spacing & Divider Thickness */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Section Spacing</span>
                  <span className="font-mono">{designTokens?.sectionSpacing || design?.sectionSpacing || '16px'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {['compact', 'normal', 'spacious'].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => {
                        const px = sp === 'compact' ? '10px' : sp === 'spacious' ? '22px' : '16px';
                        dispatch(updateDesign({ sectionSpacing: sp }));
                        dispatch(updateDesignTokens({ sectionSpacing: px }));
                      }}
                      className={`py-1 rounded-lg border text-[11px] font-semibold capitalize ${
                        (design?.sectionSpacing || 'normal') === sp
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Divider Thickness</span>
                  <span className="font-mono">{designTokens?.dividerThickness || design?.dividerThickness || '1px'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {['0px', '1px', '2px', '3px'].map((dt) => (
                    <button
                      key={dt}
                      type="button"
                      onClick={() => {
                        dispatch(updateDesignTokens({ dividerThickness: dt }));
                        dispatch(updateDesign({ dividerThickness: dt }));
                      }}
                      className={`py-1 rounded-lg border text-[11px] font-semibold ${
                        (designTokens?.dividerThickness || design?.dividerThickness || '1px') === dt
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {dt === '0px' ? 'None' : dt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Photo Studio Shortcut */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onOpenPhotoModal}
                className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Open Photo Studio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorInspector;
