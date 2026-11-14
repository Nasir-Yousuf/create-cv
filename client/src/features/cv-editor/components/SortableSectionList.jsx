import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  reorderSections,
  addCustomSection,
  removeCustomSection,
  updateDesign,
} from '../../../store/cvSlice';
import { setActiveSection } from '../../../store/uiSlice';
import SortableItem from './SortableItem';
import {
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  BookOpen,
  Globe,
  User,
  Users,
  FileCheck,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Heart,
  Info,
} from 'lucide-react';

const SECTION_METADATA = {
  summary: { label: 'Professional Summary', icon: Sparkles, countKey: null },
  careerObjective: { label: 'Career Objective', icon: Target, countKey: null },
  experience: { label: 'Work Experience', icon: Briefcase, countKey: 'experience' },
  internships: { label: 'Internships', icon: Briefcase, countKey: 'internships' },
  skills: { label: 'Skills & Competencies', icon: Award, countKey: 'skills' },
  education: { label: 'Education', icon: GraduationCap, countKey: 'education' },
  projects: { label: 'Projects', icon: FolderGit2, countKey: 'projects' },
  certifications: { label: 'Certifications', icon: BookOpen, countKey: 'certifications' },
  languages: { label: 'Languages', icon: Globe, countKey: 'languages' },
  achievements: { label: 'Key Achievements', icon: Award, countKey: 'achievements' },
  volunteer: { label: 'Volunteer Experience', icon: Heart, countKey: 'volunteer' },
  publications: { label: 'Publications & Research', icon: BookOpen, countKey: 'publications' },
  additionalInfo: { label: 'Additional Information', icon: Info, countKey: 'additionalInfo' },
  personalDetails: { label: 'Personal Details (BD)', icon: User, countKey: null },
  references: { label: 'References', icon: Users, countKey: 'references' },
  declaration: { label: 'Declaration & Signature', icon: FileCheck, countKey: null },
};

export const SortableSectionList = () => {
  const dispatch = useDispatch();
  const cvData = useSelector((state) => state.cv.currentCV);
  const activeSection = useSelector((state) => state.ui.activeSection);

  const sectionOrder = cvData.design?.sectionOrder || [
    'summary',
    'experience',
    'skills',
    'education',
    'projects',
    'certifications',
    'languages',
  ];

  // Configure touch and pointer sensors with distance threshold to distinguish taps from drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      dispatch(reorderSections(newOrder));
    }
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newOrder = arrayMove(sectionOrder, index, index - 1);
      dispatch(reorderSections(newOrder));
    }
  };

  const handleMoveDown = (index) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = arrayMove(sectionOrder, index, index + 1);
      dispatch(reorderSections(newOrder));
    }
  };

  const handleAddCustom = () => {
    dispatch(addCustomSection({ title: 'Awards & Honors' }));
  };

  return (
    <div className="space-y-4">
      {/* Permanent Fixed Top Header Section */}
      <div
        onClick={() => dispatch(setActiveSection('personalInfo'))}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
          activeSection === 'personalInfo'
            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Personal Info & Contact
            </h4>
            <p className="text-[10px] text-slate-500">
              {cvData.personalInfo?.fullName || 'Required section'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
          Fixed Top
        </span>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Reorderable CV Sections ({sectionOrder.length})
          </span>
          <span className="text-[10px] text-slate-400">Drag to prioritize</span>
        </div>

        {/* Drag and drop context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sectionOrder.map((sectionId, index) => {
                const isCustom = sectionId.startsWith('custom-');
                const customSec = isCustom
                  ? cvData.customSections?.find((s) => s.id === sectionId)
                  : null;

                const meta = SECTION_METADATA[sectionId] || {
                  label: customSec?.title || 'Custom Section',
                  icon: Sparkles,
                  countKey: null,
                };
                const Icon = meta.icon;

                let itemCount = null;
                if (meta.countKey && Array.isArray(cvData[meta.countKey])) {
                  itemCount = cvData[meta.countKey].length;
                } else if (customSec && Array.isArray(customSec.items)) {
                  itemCount = customSec.items.length;
                }

                const isActive = activeSection === sectionId;

                return (
                  <SortableItem
                    key={sectionId}
                    id={sectionId}
                    isFirst={index === 0}
                    isLast={index === sectionOrder.length - 1}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                  >
                    <div
                      onClick={() => dispatch(setActiveSection(sectionId))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {meta.label}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {itemCount !== null && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {itemCount}
                          </span>
                        )}

                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeCustomSection(sectionId));
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            title="Delete custom section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Custom Section Button */}
      <button
        type="button"
        onClick={handleAddCustom}
        className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add Custom Section
      </button>
    </div>
  );
};

export default SortableSectionList;

