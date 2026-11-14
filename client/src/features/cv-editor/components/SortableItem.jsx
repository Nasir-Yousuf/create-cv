import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown, Copy, EyeOff } from 'lucide-react';

export const SortableItem = ({
  id,
  children,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onHide,
  isFirst = false,
  isLast = false,
  className = '',
  handleOnly = true,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1), opacity 150ms ease',
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : 1,
    position: 'relative',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative transition-all duration-150 min-w-0 max-w-full ${
        isDragging
          ? 'shadow-2xl ring-2 ring-indigo-500 rounded-2xl bg-white dark:bg-slate-900 scale-[1.01]'
          : ''
      } ${className}`}
    >
      {/* Visual Drop Indicator Line & Alignment Guide */}
      {isOver && !isDragging && (
        <div
          className="cv-drop-indicator absolute -top-1.5 left-0 right-0 h-1 bg-indigo-600 rounded-full shadow-md z-30 animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="flex items-start gap-1.5 sm:gap-2">
        {/* Left Side: Drag Handle & Touch Action Toolbar */}
        <div className="flex flex-col items-center pt-2.5 pr-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 select-none">
          {/* Accessible Touch / Mouse Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-none transition-colors"
            title="Drag to reorder section"
            aria-label="Drag to reorder section"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Explicit Up / Down Reordering Buttons for Smartphones & Rapid Click Reordering */}
          <div className="flex flex-col gap-0.5 mt-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveUp) onMoveUp();
              }}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move Up"
              aria-label="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveDown) onMoveDown();
              }}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
              title="Move Down"
              aria-label="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Item Content */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default SortableItem;
