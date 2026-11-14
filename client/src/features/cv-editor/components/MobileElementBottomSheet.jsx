import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setElementOverride,
  removeElementOverride,
  updateFieldByPath,
  reorderExperience,
  reorderEducation,
  reorderSkills,
  reorderProjects,
  moveSection,
} from '../../../store/cvSlice';
import { clearSelectedElement, openAIModal } from '../../../store/uiSlice';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Check,
  X,
  Palette,
} from 'lucide-react';

const getDeepValue = (obj, path) => {
  if (!obj || !path) return '';
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === null || curr === undefined) return '';
    curr = curr[p];
  }
  return typeof curr === 'string' ? curr : typeof curr === 'number' ? String(curr) : '';
};

export const MobileElementBottomSheet = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentCV = useSelector((state) => state.cv.currentCV || {});
  const { selectedElementPath, selectedElementType } = useSelector((state) => state.ui);
  const elementOverrides = currentCV?.elementOverrides || {};
  const designTokens = currentCV?.designTokens || {};
  const design = currentCV?.design || {};

  const primaryColor = designTokens?.primaryColor || design?.primaryColor || '#2563eb';
  const accentColor = designTokens?.accentColor || design?.accentColor || '#0ea5e9';

  const targetPath = selectedElementPath;
  const activeOverride = targetPath ? elementOverrides[targetPath] || {} : {};

  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    if (targetPath) {
      setTextValue(getDeepValue(currentCV, targetPath));
    }
  }, [targetPath, currentCV]);

  if (!isOpen || !targetPath) return null;

  const formatLabel = (path) => {
    if (!path) return 'Selected Element';
    const parts = path.split('.');
    if (parts.length === 1) return parts[0].replace(/([A-Z])/g, ' $1');
    if (parts.length === 2) return `${parts[0]} • ${parts[1].replace(/([A-Z])/g, ' $1')}`;
    return `${parts[0]} #${parseInt(parts[1], 10) + 1} • ${parts[2]?.replace(/([A-Z])/g, ' $1') || parts[1]}`;
  };

  const handleTextChange = (newVal) => {
    setTextValue(newVal);
    dispatch(updateFieldByPath({ path: targetPath, value: newVal }));
  };

  const currentFontSize =
    typeof activeOverride.fontSize === 'number'
      ? activeOverride.fontSize
      : parseInt(activeOverride.fontSize || 12, 10);

  const parts = targetPath.split('.');
  const sectionName = parts[0];
  const itemIndex = parts.length >= 3 && !isNaN(Number(parts[1])) ? Number(parts[1]) : null;
  const isMultiline =
    selectedElementType === 'multiline' ||
    targetPath.includes('summary') ||
    targetPath.includes('description') ||
    targetPath.includes('objective');

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-40 max-h-[42vh] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-xs select-none animate-slide-up"
      style={{ touchAction: 'pan-y' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Grab bar */}
      <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2 mb-1 shrink-0" />

      {/* Sheet Header */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {selectedElementType || 'Text'}
            </span>
            <span className="font-bold text-slate-800 dark:text-white truncate text-xs">
              {formatLabel(targetPath)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            dispatch(clearSelectedElement());
            if (onClose) onClose();
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95"
          title="Close sheet"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Sheet Content */}
      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
        {/* 1. Direct Inline Text Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Edit Text Content
          </label>
          {isMultiline ? (
            <textarea
              rows={2}
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your text..."
              className="w-full p-3 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[64px]"
            />
          ) : (
            <input
              type="text"
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type text..."
              className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          )}
        </div>

        {/* 2. Styling Pills Row: Font Size, Bold, Italic, Underline, Alignment */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Font Size Steppers */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 active:scale-95"
              title="Decrease size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="min-w-[36px] text-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
              {currentFontSize}px
            </span>
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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 active:scale-95"
              title="Increase size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Bold, Italic, Underline Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
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
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg font-bold transition-colors ${
                activeOverride.fontWeight === 'bold' || activeOverride.fontWeight === 700
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
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
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg italic transition-colors ${
                activeOverride.italic
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
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
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg underline transition-colors ${
                activeOverride.underline
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
            {['left', 'center', 'right'].map((al) => (
              <button
                key={al}
                type="button"
                onClick={() =>
                  dispatch(setElementOverride({ path: targetPath, overrides: { align: al } }))
                }
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${
                  activeOverride.align === al
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title={`Align ${al}`}
              >
                {al === 'left' && <AlignLeft className="w-4 h-4" />}
                {al === 'center' && <AlignCenter className="w-4 h-4" />}
                {al === 'right' && <AlignRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Color Swatch Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Color:
          </span>
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-1">
            {[primaryColor, accentColor, '#0f172a', '#475569', '#059669', '#dc2626'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  dispatch(setElementOverride({ path: targetPath, overrides: { color: c } }))
                }
                className={`w-7 h-7 rounded-full border-2 transition-transform shrink-0 ${
                  activeOverride.color === c ? 'scale-110 border-indigo-600 ring-2 ring-indigo-500/30' : 'border-white'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="relative min-w-[36px] min-h-[36px] flex items-center justify-center">
              <input
                type="color"
                value={activeOverride.color || '#0f172a'}
                onChange={(e) =>
                  dispatch(setElementOverride({ path: targetPath, overrides: { color: e.target.value } }))
                }
                className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent shrink-0"
              />
            </div>
          </div>
        </div>

        {/* 4. Action Buttons Row: AI Polish, Reset, Move Up, Move Down, Done */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
            className="min-h-[44px] px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Polish</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(removeElementOverride(targetPath))}
            className="min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Style</span>
          </button>
        </div>

        {/* Done / Apply Button */}
        <button
          type="button"
          onClick={() => {
            dispatch(clearSelectedElement());
            if (onClose) onClose();
          }}
          className="w-full min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Done Editing</span>
        </button>
      </div>
    </div>
  );
};

export default MobileElementBottomSheet;
