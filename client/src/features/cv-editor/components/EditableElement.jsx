import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import {
  setActiveSection,
  setActiveField,
  setSelectedElement,
  openAIModal,
} from '../../../store/uiSlice';
import { setElementOverride } from '../../../store/cvSlice';
import {
  Bold,
  Italic,
  Underline,
  Sparkles,
  Check,
  X,
  Plus,
  Minus,
} from 'lucide-react';

const EMPTY_OVERRIDE = {};

export const EditableElement = ({
  section,
  field,
  index = null,
  value = '',
  onSave,
  tag = 'div',
  className = '',
  style = {},
  multiline = false,
  placeholder = 'Click to edit...',
  elementType = null,
  children,
}) => {
  const dispatch = useDispatch();
  const activeSection = useSelector((state) => state.ui?.activeSection);
  const activeField = useSelector((state) => state.ui?.activeField);
  const selectedElementPath = useSelector((state) => state.ui?.selectedElementPath);

  const fieldKey = index !== null ? `${section}.${index}.${field}` : `${section}.${field}`;
  const isSelected = selectedElementPath === fieldKey || activeField === fieldKey;
  const override = useSelector(
    (state) => state.cv?.currentCV?.elementOverrides?.[fieldKey] || EMPTY_OVERRIDE
  );

  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value || '');
  const localTextRef = useRef(value || '');
  const isTypingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Sync external changes from Redux/Form Editor when user is NOT actively typing
  useEffect(() => {
    if (!isTypingRef.current) {
      setCurrentText(value || '');
      localTextRef.current = value || '';
    }
  }, [value]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Determine element type for Inspector formatting
  const resolvedType =
    elementType ||
    (field === 'fullName'
      ? 'heading'
      : field === 'jobTitle' || field === 'degree' || field === 'title'
      ? 'title'
      : field === 'company' || field === 'institution'
      ? 'subtitle'
      : multiline || field === 'summary' || field === 'careerObjective' || field === 'description'
      ? 'multiline'
      : field === 'startDate' || field === 'endDate' || field === 'date'
      ? 'date'
      : field === 'level' || field === 'proficiency'
      ? 'badge'
      : 'text');

  // Compute merged styles combining template styles and user overrides
  const mergedStyle = {
    ...style,
    ...(override.fontSize
      ? { fontSize: typeof override.fontSize === 'number' ? `${override.fontSize}px` : override.fontSize }
      : {}),
    ...(override.fontWeight ? { fontWeight: override.fontWeight } : {}),
    ...(override.italic ? { fontStyle: 'italic' } : {}),
    ...(override.underline ? { textDecoration: 'underline' } : {}),
    ...(override.color ? { color: override.color } : {}),
    ...(override.align ? { textAlign: override.align } : {}),
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    boxSizing: 'border-box',
  };

  // Auto-focus and adjust height on editing start
  useIsomorphicLayoutEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Auto-grow textarea height to fit content perfectly
      if (multiline && inputRef.current.scrollHeight) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight + 4}px`;
      }
    }
  }, [isEditing, multiline]);

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(setActiveSection(section));
    dispatch(setActiveField(fieldKey));
    dispatch(setSelectedElement({ path: fieldKey, type: resolvedType }));
  };

  const handleClick = (e) => {
    handleSelect(e);
    // On click, if already selected, open editor; if not selected, select first
    if (isSelected && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleDoubleClick = (e) => {
    handleSelect(e);
    setIsEditing(true);
  };

  // Immediate debounced keystroke handler: updates local state without cursor jumps
  // and streams changes to Redux / Mode A after 200ms
  const handleInputChange = (e) => {
    const newVal = e.target.value;
    isTypingRef.current = true;
    setCurrentText(newVal);
    localTextRef.current = newVal;

    if (multiline && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight + 4}px`;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (typeof onSave === 'function') {
        onSave(newVal);
      }
      isTypingRef.current = false;
    }, 200);
  };

  const handleCommit = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    isTypingRef.current = false;
    setIsEditing(false);
    if (typeof onSave === 'function' && localTextRef.current !== value) {
      onSave(localTextRef.current);
    }
  };

  const handleCancel = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    isTypingRef.current = false;
    setCurrentText(value || '');
    localTextRef.current = value || '';
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Quick formatting actions for Canva-style floating toolbar
  const handleToggleBold = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isBold = override.fontWeight === 'bold' || override.fontWeight === 700;
    dispatch(
      setElementOverride({
        path: fieldKey,
        overrides: { fontWeight: isBold ? 'normal' : 'bold' },
      })
    );
  };

  const handleToggleItalic = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setElementOverride({
        path: fieldKey,
        overrides: { italic: !override.italic },
      })
    );
  };

  const handleToggleUnderline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setElementOverride({
        path: fieldKey,
        overrides: { underline: !override.underline },
      })
    );
  };

  const handleFontSizeChange = (delta) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentSize =
      typeof override.fontSize === 'number'
        ? override.fontSize
        : parseInt(override.fontSize || style.fontSize || 13, 10);
    const newSize = Math.max(8, Math.min(48, currentSize + delta));
    dispatch(
      setElementOverride({
        path: fieldKey,
        overrides: { fontSize: newSize },
      })
    );
  };

  const handleOpenAI = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      openAIModal({
        mode: field === 'summary' ? 'summary' : 'experience',
        contextData: { text: currentText, field: fieldKey },
      })
    );
  };

  const displayLabel = (
    index !== null ? `${section} #${index + 1} • ${field}` : `${section} • ${field}`
  ).replace(/([A-Z])/g, ' $1');

  // Inline editing active view: zero padding/margin changes to prevent shifting surrounding layout
  if (isEditing) {
    return (
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block w-full max-w-full z-30"
      >
        {multiline ? (
          <textarea
            ref={inputRef}
            rows={2}
            value={currentText}
            onChange={handleInputChange}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className="w-full max-w-full p-1 -m-1 text-inherit font-inherit leading-inherit border-2 border-indigo-600 rounded bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-xl focus:outline-none resize-none box-border"
            style={mergedStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={handleInputChange}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className="w-full max-w-full px-1 py-0.5 -mx-1 -my-0.5 text-inherit font-inherit leading-inherit border-2 border-indigo-600 rounded bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-xl focus:outline-none box-border"
            style={mergedStyle}
          />
        )}

        {/* Floating Commit Bubble */}
        <div className="cv-editor-toolbar absolute -top-7 right-0 flex items-center gap-1 bg-slate-900 text-white rounded-md px-1.5 py-0.5 shadow-xl text-[10px] z-40 print:hidden select-none">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCommit();
            }}
            className="hover:text-emerald-400 p-0.5 flex items-center gap-0.5"
            title="Save changes"
          >
            <Check className="w-3 h-3" />
            <span>Done</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="hover:text-rose-400 p-0.5"
            title="Cancel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  const Tag = tag === 'div' && (className.includes('inline') || className.includes('break-')) ? 'span' : tag;

  return (
    <Tag
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`cv-editable-element ${
        isSelected
          ? 'cv-selected ring-2 ring-indigo-500 ring-offset-2 bg-indigo-50/25 rounded-xs'
          : 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/80 hover:bg-indigo-50/10'
      } ${className}`}
      style={mergedStyle}
      title="Click to select • Double-click to edit directly"
    >
      {/* Canva-Style Selection Bounding Box with Corner Pips and Quick Actions */}
      {isSelected && (
        <>
          {/* Corner Pips */}
          <span className="cv-editor-pip absolute -top-1 -left-1 w-2.5 h-2.5 bg-indigo-600 rounded-xs border-2 border-white shadow-xs z-20 pointer-events-none print:hidden" />
          <span className="cv-editor-pip absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-xs border-2 border-white shadow-xs z-20 pointer-events-none print:hidden" />
          <span className="cv-editor-pip absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-indigo-600 rounded-xs border-2 border-white shadow-xs z-20 pointer-events-none print:hidden" />
          <span className="cv-editor-pip absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-xs border-2 border-white shadow-xs z-20 pointer-events-none print:hidden" />

          {/* Floating Element Identifier Badge */}
          <span className="cv-editor-badge absolute -top-6 left-0 bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md pointer-events-none z-30 whitespace-nowrap uppercase tracking-wider print:hidden">
            {displayLabel}
          </span>

          {/* Floating Mini Formatting Toolbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="cv-editor-toolbar absolute -top-7 right-0 flex items-center gap-0.5 bg-slate-900/90 text-white rounded-lg px-1.5 py-0.5 shadow-xl text-[10px] z-30 backdrop-blur-xs print:hidden"
          >
            <button
              type="button"
              onClick={handleToggleBold}
              className={`p-1 rounded hover:bg-slate-800 ${
                override.fontWeight === 'bold' || override.fontWeight === 700 ? 'text-indigo-400 font-bold' : ''
              }`}
              title="Toggle Bold"
            >
              <Bold className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleToggleItalic}
              className={`p-1 rounded hover:bg-slate-800 ${override.italic ? 'text-indigo-400' : ''}`}
              title="Toggle Italic"
            >
              <Italic className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleToggleUnderline}
              className={`p-1 rounded hover:bg-slate-800 ${override.underline ? 'text-indigo-400' : ''}`}
              title="Toggle Underline"
            >
              <Underline className="w-3 h-3" />
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={handleFontSizeChange(1)}
              className="p-1 rounded hover:bg-slate-800 flex items-center gap-0.5 text-[9px] font-bold"
              title="Increase Font Size"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={handleFontSizeChange(-1)}
              className="p-1 rounded hover:bg-slate-800 flex items-center gap-0.5 text-[9px] font-bold"
              title="Decrease Font Size"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            {multiline && (
              <>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={handleOpenAI}
                  className="p-1 rounded hover:bg-slate-800 text-amber-400"
                  title="Improve with AI"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              </>
            )}
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-1.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px]"
              title="Edit text"
            >
              Type
            </button>
          </div>
        </>
      )}

      {children || currentText || (
        <span className="cv-placeholder opacity-40 italic print:hidden">{placeholder}</span>
      )}
    </Tag>
  );
};

export default EditableElement;
