import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

export const SortableItem = ({
  id,
  children,
  onMoveUp,
  onMoveDown,
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
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
    position: 'relative',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group transition-shadow duration-200 ${
        isDragging ? 'shadow-2xl ring-2 ring-indigo-500 rounded-2xl bg-white dark:bg-slate-900' : ''
      } ${className}`}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle & Mobile Accessible Fallback Buttons */}
        <div className="flex flex-col items-center pt-3.5 pr-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          {/* Accessible Touch / Mouse Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-none transition-colors"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Accessible Fallback Up / Down Buttons */}
          <div className="flex flex-col gap-0.5 mt-1 sm:hidden">
            <button
              type="button"
              disabled={isFirst}
              onClick={onMoveUp}
              className="p-0.5 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={onMoveDown}
              className="p-0.5 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Item Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SortableItem;

