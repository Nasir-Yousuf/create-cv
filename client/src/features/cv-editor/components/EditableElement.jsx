import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection, setActiveField } from '../../../store/uiSlice';
import { Edit2, Check, X } from 'lucide-react';

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
  children,
}) => {
  const dispatch = useDispatch();
  const activeSection = useSelector((state) => state.ui.activeSection);
  const activeField = useSelector((state) => state.ui.activeField);
  const elementOverrides = useSelector((state) => state.cv?.currentCV?.elementOverrides || {});

  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value || '');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentText(value || '');
  }, [value]);

  const fieldKey = index !== null ? `${section}.${index}.${field}` : `${section}.${field}`;
  const isSelected = activeSection === section && activeField === fieldKey;
  const override = elementOverrides[fieldKey] || {};

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
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveSection(section));
    dispatch(setActiveField(fieldKey));
    setIsEditing(true);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveSection(section));
    dispatch(setActiveField(fieldKey));
    setIsEditing(true);
  };

  const handleCommit = () => {
    setIsEditing(false);
    if (currentText !== value) {
      onSave(currentText);
    }
  };

  const handleCancel = () => {
    setCurrentText(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block w-full z-30"
      >
        {multiline ? (
          <textarea
            ref={inputRef}
            rows={3}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className="w-full p-2 text-xs border-2 border-indigo-500 rounded-lg bg-white text-slate-900 shadow-xl focus:outline-none resize-y"
            style={mergedStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-xs border-2 border-indigo-500 rounded-lg bg-white text-slate-900 shadow-xl focus:outline-none"
            style={mergedStyle}
          />
        )}

        {/* Action Commit Bubble */}
        <div className="absolute -top-7 right-0 flex items-center gap-1 bg-slate-900 text-white rounded-md px-1.5 py-0.5 shadow-lg text-[10px]">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCommit();
            }}
            className="hover:text-emerald-400 p-0.5"
            title="Save"
          >
            <Check className="w-3 h-3" />
          </button>
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

  const Tag = (tag === 'div' && (className.includes('inline') || className.includes('break-'))) ? 'span' : tag;

  return (
    <Tag
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative cursor-pointer transition-all duration-150 group/editable ${
        isSelected
          ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50/30 rounded-sm'
          : 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/80 hover:bg-indigo-50/10 rounded-sm'
      } ${className}`}
      style={mergedStyle}
      title="Click to edit directly"
    >
      {/* Corner pip indicators when selected (matches Canva / smallseotools screenshot 2) */}
      {isSelected && (
        <>
          <span className="cv-editor-pip absolute -top-1 -left-1 w-2 h-2 bg-indigo-600 rounded-full border border-white pointer-events-none z-10" />
          <span className="cv-editor-pip absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full border border-white pointer-events-none z-10" />
          <span className="cv-editor-pip absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-600 rounded-full border border-white pointer-events-none z-10" />
          <span className="cv-editor-pip absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full border border-white pointer-events-none z-10" />
          <span className="cv-editor-pip absolute -top-6 left-0 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
            {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </span>
        </>
      )}

      {children || currentText || (
        <span className="cv-placeholder opacity-40 italic print:hidden">{placeholder}</span>
      )}
    </Tag>
  );
};

export default EditableElement;

