import React, { useState } from 'react';
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
  hideSection,
  restoreSection,
  setProfileType,
  addCustomSection,
  removeCustomSection,
} from '../../../store/cvSlice';
import { setActiveSection } from '../../../store/uiSlice';
import SortableItem from './SortableItem';
import {
  PERSONA_PRESETS,
  getPersonaById,
  isSectionSuggestedForPersona,
} from '@shared/constants/personaPresets.js';
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
  Star,
  ChevronDown,
  Code,
  Landmark,
  Stethoscope,
  Wrench,
  HelpCircle,
} from 'lucide-react';

const PERSONA_ICONS = {
  GraduationCap,
  Code,
  Briefcase,
  Landmark,
  Stethoscope,
  BookOpen,
  Wrench,
};

const ALL_STANDARD_SECTIONS = [
  { id: 'summary', label: 'Professional Summary', icon: Sparkles, countKey: null },
  { id: 'careerObjective', label: 'Career Objective', icon: Target, countKey: null },
  { id: 'experience', label: 'Work Experience', icon: Briefcase, countKey: 'experience' },
  { id: 'internships', label: 'Internships', icon: Briefcase, countKey: 'internships' },
  { id: 'skills', label: 'Skills & Competencies', icon: Award, countKey: 'skills' },
  { id: 'education', label: 'Education', icon: GraduationCap, countKey: 'education' },
  { id: 'projects', label: 'Projects & Portfolio', icon: FolderGit2, countKey: 'projects' },
  { id: 'certifications', label: 'Certifications', icon: BookOpen, countKey: 'certifications' },
  { id: 'languages', label: 'Languages', icon: Globe, countKey: 'languages' },
  { id: 'achievements', label: 'Key Achievements', icon: Award, countKey: 'achievements' },
  { id: 'volunteer', label: 'Volunteer Experience', icon: Heart, countKey: 'volunteer' },
  { id: 'publications', label: 'Publications & Research', icon: BookOpen, countKey: 'publications' },
  { id: 'personalDetails', label: 'Personal Details (BD)', icon: User, countKey: null },
  { id: 'references', label: 'References', icon: Users, countKey: 'references' },
  { id: 'declaration', label: 'Declaration & Signature', icon: FileCheck, countKey: null },
  { id: 'additionalInfo', label: 'Additional Information', icon: Info, countKey: 'additionalInfo' },
];

const SECTION_METADATA = ALL_STANDARD_SECTIONS.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

export const SortableSectionList = () => {
  const dispatch = useDispatch();
  const cvData = useSelector((state) => state.cv.currentCV || {});
  const activeSection = useSelector((state) => state.ui.activeSection);
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);

  const activePersonaId = cvData.profileType || 'student';
  const currentPersona = getPersonaById(activePersonaId);
  const PersonaIcon = PERSONA_ICONS[currentPersona?.iconName] || GraduationCap;

  const sectionOrder = Array.isArray(cvData.design?.sectionOrder)
    ? cvData.design.sectionOrder
    : [
        'summary',
        'experience',
        'skills',
        'education',
        'projects',
        'certifications',
        'languages',
      ];

  // Configure touch and pointer sensors
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

  // Find inactive standard sections
  const inactiveSections = ALL_STANDARD_SECTIONS.filter(
    (sec) => !sectionOrder.includes(sec.id)
  ).sort((a, b) => {
    const aSuggested = isSectionSuggestedForPersona(a.id, activePersonaId) ? 1 : 0;
    const bSuggested = isSectionSuggestedForPersona(b.id, activePersonaId) ? 1 : 0;
    return bSuggested - aSuggested;
  });

  return (
    <div className="space-y-4">
      {/* 1. Persona / Profession Selector Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <PersonaIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Target Profile
              </span>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentPersona.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPersonaDetails(!showPersonaDetails)}
            className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 flex items-center gap-0.5"
            title="Toggle persona recommendations"
          >
            <span>{showPersonaDetails ? 'Hide Tips' : 'Tips'}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showPersonaDetails ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Profile Switcher Dropdown */}
        <div className="relative">
          <select
            value={activePersonaId}
            onChange={(e) => dispatch(setProfileType(e.target.value))}
            className="w-full appearance-none px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8 shadow-xs"
          >
            {PERSONA_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.badge})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Highlight Advice Box */}
        {showPersonaDetails ? (
          <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 animate-fadeIn">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              Tailored Advice for {currentPersona.shortTitle}
            </p>
            <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              {currentPersona.highlightAdvice}
            </p>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              Suggested: {currentPersona.suggestedSections.join(', ')}
            </div>
          </div>
        ) : (
          <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">
            💡 {currentPersona.highlightAdvice}
          </p>
        )}
      </div>

      {/* 2. Permanent Fixed Top Header Section */}
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
              {cvData.personalInfo?.fullName || 'Required header'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
          Fixed Top
        </span>
      </div>

      {/* 3. Reorderable CV Sections */}
      <div className="pt-1">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Sections ({sectionOrder.length})
          </span>
          <span className="text-[10px] text-slate-400">Drag or use arrows</span>
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
                const isSuggested = isSectionSuggestedForPersona(sectionId, activePersonaId);

                return (
                  <SortableItem
                    key={sectionId}
                    id={sectionId}
                    isFirst={index === 0}
                    isLast={index === sectionOrder.length - 1}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    onHide={() => dispatch(hideSection(sectionId))}
                    onDuplicate={
                      isCustom && customSec
                        ? () => dispatch(addCustomSection({ title: `${customSec.title} (Copy)` }))
                        : null
                    }
                  >
                    <div
                      onClick={() => dispatch(setActiveSection(sectionId))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-sm'
                          : isSuggested
                          ? 'border-indigo-200/70 dark:border-indigo-900/60 bg-white dark:bg-slate-900 hover:border-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSuggested
                              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {meta.label}
                            </h4>
                            {isSuggested && (
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 shrink-0"
                                title={`Recommended for ${currentPersona.shortTitle}`}
                              >
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Suggested</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {itemCount !== null && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {itemCount}
                          </span>
                        )}

                        {/* Hide section button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(hideSection(sectionId));
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                          title="Hide section from CV"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeCustomSection(sectionId));
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
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

      {/* 4. Available & Suggested Sections Tray */}
      {inactiveSections.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Available Sections
            </span>
            <span className="text-[10px] text-slate-400">1-click restore</span>
          </div>

          <div className="space-y-1.5">
            {inactiveSections.map((sec) => {
              const Icon = sec.icon;
              const isSuggested = isSectionSuggestedForPersona(sec.id, activePersonaId);
              return (
                <div
                  key={sec.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isSuggested
                      ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSuggested
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {sec.label}
                      </span>
                      {isSuggested && (
                        <span className="ml-1.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                          ★ Recommended
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      dispatch(restoreSection(sec.id));
                      dispatch(setActiveSection(sec.id));
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                      isSuggested
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Add Custom Section Button */}
      <button
        type="button"
        onClick={handleAddCustom}
        className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" /> Add Custom Section
      </button>
    </div>
  );
};

export default SortableSectionList;
