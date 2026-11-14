import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePersonalInfo,
  updatePersonalDetails,
  updateDeclaration,
  updateExperience,
  addExperience,
  removeExperience,
  reorderExperience,
  duplicateExperience,
  updateEducation,
  addEducation,
  removeEducation,
  reorderEducation,
  duplicateEducation,
  updateSkill,
  addSkill,
  removeSkill,
  reorderSkills,
  duplicateSkill,
  updateProject,
  addProject,
  removeProject,
  reorderProjects,
  duplicateProject,
  updateCertification,
  addCertification,
  removeCertification,
  reorderCertifications,
  duplicateCertification,
  updateLanguage,
  addLanguage,
  removeLanguage,
  reorderLanguages,
  duplicateLanguage,
  addReference,
  updateReference,
  removeReference,
  reorderReferences,
  duplicateReference,
  updateCustomSection,
  updateCareerObjective,
  updateSummary,
  addInternship,
  updateInternship,
  removeInternship,
  reorderInternships,
  duplicateInternship,
  addAchievement,
  updateAchievement,
  removeAchievement,
  reorderAchievements,
  duplicateAchievement,
  addVolunteer,
  updateVolunteer,
  removeVolunteer,
  reorderVolunteer,
  duplicateVolunteer,
  addPublication,
  updatePublication,
  removePublication,
  reorderPublications,
  duplicatePublication,
  addAdditionalInfo,
  updateAdditionalInfo,
  removeAdditionalInfo,
  reorderAdditionalInfo,
  duplicateAdditionalInfo,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  reorderCustomSectionItems,
  duplicateCustomSectionItem,
  moveSection,
  hideSection,
  restoreSection,
} from '../../../store/cvSlice';
import { openAIModal } from '../../../store/uiSlice';
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
import SortableItem from './SortableItem';
import Button from '../../../components/common/Button';
import { SECTION_TIPS } from './sectionTipsData';
import {
  getPersonaById,
  isSectionSuggestedForPersona,
} from '@shared/constants/personaPresets.js';
import {
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Camera,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lightbulb,
  Star,
  Check,
  Calendar,
  Globe,
  Link as LinkIcon,
  Github,
  AlertCircle,
  AlertTriangle,
  CheckCheck,
  Wand2,
  FileCheck,
} from 'lucide-react';

/**
 * Reusable Micro-Tip Accordion
 */
const SectionTipBox = ({ sectionId, profileType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tipData = SECTION_TIPS[sectionId];
  if (!tipData) return null;

  const isStudent = profileType === 'student';

  return (
    <div className="mb-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/40 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span>Pro Tips & Examples for {tipData.title}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-amber-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-700 dark:text-slate-300 space-y-2.5 border-t border-amber-200/50 dark:border-amber-900/30">
          <p className="leading-relaxed text-[11.5px]">{tipData.tip}</p>

          {isStudent && tipData.studentTip && (
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200">
              <strong className="font-bold flex items-center gap-1 mb-0.5">
                <Star className="w-3 h-3 text-indigo-500 fill-current" /> Campus & Fresh Grad Advice:
              </strong>
              {tipData.studentTip}
            </div>
          )}

          {Array.isArray(tipData.examples) && tipData.examples.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Sample Copy / Real Examples:
              </span>
              <div className="space-y-1.5">
                {tipData.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 text-[11px]"
                  >
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5 text-[10.5px]">
                      {ex.label}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-snug">{ex.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Reusable Section Header with Move, Hide/Restore, and Add Controls
 */
const SectionHeaderControls = ({
  title,
  sectionId,
  count,
  onAdd,
  addLabel,
  extraButton,
  cvData,
}) => {
  const dispatch = useDispatch();
  const profileType = cvData?.profileType || 'student';
  const persona = getPersonaById(profileType);
  const isSuggested = isSectionSuggestedForPersona(sectionId, profileType);

  const sectionOrder = cvData?.design?.sectionOrder || [];
  const currentIndex = sectionOrder.indexOf(sectionId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === sectionOrder.length - 1;
  const isHidden = currentIndex === -1;

  return (
    <div className="pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>{title}</span>
          {count !== undefined && count !== null && (
            <span className="text-[10.5px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </h3>

        {isSuggested && (
          <span
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            title={`Recommended for ${persona.title}`}
          >
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>Suggested for {persona.shortTitle}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Intra-page Section Reordering */}
        {currentIndex !== -1 && (
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => dispatch(moveSection({ id: sectionId, direction: 'up' }))}
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-1.5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Move section up on CV page"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => dispatch(moveSection({ id: sectionId, direction: 'down' }))}
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-1.5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-slate-200 dark:border-slate-700"
              title="Move section down on CV page"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hide / Show Section Toggle */}
        <button
          type="button"
          onClick={() => {
            if (isHidden) {
              dispatch(restoreSection(sectionId));
            } else {
              dispatch(hideSection(sectionId));
            }
          }}
          className={`min-h-[44px] sm:min-h-0 sm:p-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            isHidden
              ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          title={isHidden ? 'Restore section to CV' : 'Hide section from CV'}
        >
          {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="text-[11px]">{isHidden ? 'Restore' : 'Hide'}</span>
        </button>

        {extraButton}

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="min-h-[44px] px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{addLabel || 'Add Entry'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Reusable Alert Banner for Hidden Sections
 */
const HiddenSectionBanner = ({ sectionId }) => {
  const dispatch = useDispatch();
  return (
    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>This section is currently hidden from your CV preview and exported PDF/DOCX.</span>
      </div>
      <button
        type="button"
        onClick={() => dispatch(restoreSection(sectionId))}
        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
      >
        Restore Section
      </button>
    </div>
  );
};

/**
 * Reusable Card Item Control Header (Title, Move Up, Move Down, Duplicate, Delete)
 */
const ItemCardControls = ({
  title,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[320px]">
        {title}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {onMoveUp && onMoveDown && (
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800 mr-1">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Move item up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={onMoveDown}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-slate-200 dark:border-slate-700"
              title="Move item down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
        {onDuplicate && (
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
            title="Duplicate entry"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const SectionFormEditor = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const cvData = useSelector((state) => state.cv.currentCV || {});
  const activeSection = useSelector((state) => state.ui.activeSection);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const isSectionHidden =
    !Array.isArray(cvData.design?.sectionOrder) ||
    !cvData.design.sectionOrder.includes(activeSection);

  // 1. Personal Info Editor
  if (activeSection === 'personalInfo') {
    const { personalInfo = {} } = cvData;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Personal Information &amp; Contact Header
          </h3>
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            {personalInfo.photo ? 'Manage Photo' : 'Upload Photo'}
          </button>
        </div>

        <SectionTipBox sectionId="personalInfo" profileType={cvData.profileType} />

        {/* Photo avatar thumbnail badge */}
        {personalInfo.photo && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <img
              src={personalInfo.photo}
              alt="Avatar"
              className={`w-12 h-12 object-cover ${
                personalInfo.photoStyle === 'circle' ? 'rounded-full' : 'rounded-lg'
              }`}
            />
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-bold text-slate-900 dark:text-white truncate">Profile Photo Added</p>
              <p className="text-[11px] text-slate-500 capitalize">{personalInfo.photoStyle || 'Circle'} frame</p>
            </div>
            <Button variant="outline" size="sm" onClick={onOpenPhotoModal}>
              Edit Photo
            </Button>
          </div>
        )}

        {/* Missing Info Warning */}
        {(!personalInfo.email || !personalInfo.phone || !personalInfo.jobTitle) && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              {!personalInfo.email
                ? 'Missing email address.'
                : !personalInfo.phone
                ? 'Missing contact phone number.'
                : 'Missing target job title / headline.'}{' '}
              Recruiters need these key details to contact and evaluate you.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={personalInfo.fullName || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
              placeholder="Alex Morgan"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Title / Designation *
            </label>
            <input
              type="text"
              value={personalInfo.jobTitle || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ jobTitle: e.target.value }))}
              placeholder="Senior Software Engineer / Management Trainee"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={personalInfo.email || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ email: e.target.value }))}
              placeholder="alex.morgan@example.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              value={personalInfo.phone || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ phone: e.target.value }))}
              placeholder="+880 1712-345678 or +1 (555) 019-2834"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location (City, Country)
            </label>
            <input
              type="text"
              value={personalInfo.location || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ location: e.target.value }))}
              placeholder="Dhaka, Bangladesh / San Francisco, CA"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Portfolio / Personal Website
            </label>
            <input
              type="text"
              value={personalInfo.website || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ website: e.target.value }))}
              placeholder="https://alexmorgan.dev"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="text"
              value={personalInfo.linkedin || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ linkedin: e.target.value }))}
              placeholder="linkedin.com/in/alexmorgan"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub / Code Repository
            </label>
            <input
              type="text"
              value={personalInfo.github || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ github: e.target.value }))}
              placeholder="github.com/alexmorgan"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Summary Editor
  if (activeSection === 'summary') {
    const summaryText = cvData.personalInfo?.summary || cvData.summary || '';
    const charCount = summaryText.length;
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="summary" />}
        <SectionHeaderControls
          title="Professional Summary"
          sectionId="summary"
          cvData={cvData}
          extraButton={
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                icon={Sparkles}
                onClick={() => dispatch(openAIModal({ mode: 'summary' }))}
              >
                Enhance with AI
              </Button>
              {summaryText.trim() && (
                <button
                  type="button"
                  onClick={() => dispatch(openAIModal({ mode: 'grammar', contextData: { text: summaryText, section: 'summary' } }))}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors"
                  title="Fix grammar, spelling and tighten phrasing"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Fix Grammar</span>
                </button>
              )}
            </div>
          }
        />
        <SectionTipBox sectionId="summary" profileType={cvData.profileType} />

        <div className="space-y-1.5">
          <textarea
            rows={6}
            value={summaryText}
            onChange={(e) => dispatch(updatePersonalInfo({ summary: e.target.value }))}
            placeholder="Results-driven Software Engineer with 6+ years of experience architecting scalable microservices..."
            className="w-full p-3.5 text-xs leading-relaxed rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className={charCount > 500 ? 'text-amber-600 font-semibold' : ''}>
              {charCount} characters
            </span>
            <span>Recommended: 200–450 characters (2–4 lines)</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Career Objective Editor
  if (activeSection === 'careerObjective') {
    const objectiveText = cvData.careerObjective || '';
    const charCount = objectiveText.length;
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="careerObjective" />}
        <SectionHeaderControls
          title="Career Objective"
          sectionId="careerObjective"
          cvData={cvData}
          extraButton={
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                icon={Sparkles}
                onClick={() => dispatch(openAIModal({ mode: 'objective' }))}
              >
                Draft with AI
              </Button>
              {objectiveText.trim() && (
                <button
                  type="button"
                  onClick={() => dispatch(openAIModal({ mode: 'grammar', contextData: { text: objectiveText, section: 'careerObjective' } }))}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors"
                  title="Fix grammar, spelling and tighten phrasing"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Fix Grammar</span>
                </button>
              )}
            </div>
          }
        />
        <SectionTipBox sectionId="careerObjective" profileType={cvData.profileType} />

        <div className="space-y-1.5">
          <textarea
            rows={5}
            value={objectiveText}
            onChange={(e) => dispatch(updateCareerObjective(e.target.value))}
            placeholder="Dedicated Computer Science graduate seeking an entry-level Junior Developer role to apply strong algorithm design and full-stack web development skills..."
            className="w-full p-3.5 text-xs leading-relaxed rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className={charCount > 350 ? 'text-amber-600 font-semibold' : ''}>
              {charCount} characters
            </span>
            <span>Recommended: 100–300 characters</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Work Experience Editor
  if (activeSection === 'experience') {
    const list = cvData.experience || [];
    const handleExperienceDragEnd = (event) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = list.findIndex((item) => item.id === active.id);
        const newIndex = list.findIndex((item) => item.id === over.id);
        dispatch(reorderExperience({ sourceIndex: oldIndex, destinationIndex: newIndex }));
      }
    };

    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="experience" />}
        <SectionHeaderControls
          title="Work Experience"
          sectionId="experience"
          count={list.length}
          onAdd={() => dispatch(addExperience())}
          addLabel="Add Job"
          cvData={cvData}
        />
        <SectionTipBox sectionId="experience" profileType={cvData.profileType} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
          <SortableContext items={list.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {list.map((exp, index) => (
                <SortableItem
                  key={exp.id}
                  id={exp.id}
                  isFirst={index === 0}
                  isLast={index === list.length - 1}
                  onMoveUp={() => {
                    if (index > 0) {
                      dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index - 1 }));
                    }
                  }}
                  onMoveDown={() => {
                    if (index < list.length - 1) {
                      dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index + 1 }));
                    }
                  }}
                >
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <ItemCardControls
                      title={`${exp.jobTitle || 'New Position'} ${exp.company ? `@ ${exp.company}` : ''}`}
                      index={index}
                      total={list.length}
                      onMoveUp={
                        index > 0
                          ? () => dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index - 1 }))
                          : null
                      }
                      onMoveDown={
                        index < list.length - 1
                          ? () => dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index + 1 }))
                          : null
                      }
                      onDuplicate={() => dispatch(duplicateExperience(index))}
                      onDelete={() => dispatch(removeExperience(index))}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Job Title *"
                        value={exp.jobTitle || ''}
                        onChange={(e) => dispatch(updateExperience({ index, data: { jobTitle: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Company Name *"
                        value={exp.company || ''}
                        onChange={(e) => dispatch(updateExperience({ index, data: { company: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Location (e.g. Dhaka / Remote)"
                        value={exp.location || ''}
                        onChange={(e) => dispatch(updateExperience({ index, data: { location: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Start Date (e.g. 2022-01)"
                          value={exp.startDate || ''}
                          onChange={(e) => dispatch(updateExperience({ index, data: { startDate: e.target.value } }))}
                          className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          disabled={exp.current}
                          value={exp.current ? 'Present' : exp.endDate || ''}
                          onChange={(e) => dispatch(updateExperience({ index, data: { endDate: e.target.value } }))}
                          className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {!exp.startDate && !exp.year && !exp.current && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3" /> Missing employment start / end dates.
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!exp.current}
                          onChange={(e) => dispatch(updateExperience({ index, data: { current: e.target.checked } }))}
                          className="rounded accent-indigo-600"
                        />
                        <span>Currently Working Here</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => dispatch(openAIModal({ mode: 'bullet', contextData: { experienceItem: exp, itemIndex: index } }))}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Action Bullets
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(openAIModal({ mode: 'experience', contextData: { experienceItem: exp, itemIndex: index } }))}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Wand2 className="w-3 h-3" /> Quantify [X]%
                        </button>
                      </div>
                    </div>

                    {/* Real-time Bullet Length Detector */}
                    {(() => {
                      const expLines = Array.isArray(exp.highlights)
                        ? exp.highlights
                        : (exp.description || '').split('\n').filter(Boolean);
                      const longBullets = expLines.filter((l) => l.trim().length > 200);
                      const longestBullet = longBullets.reduce((max, b) => (b.length > max.length ? b : max), '');

                      if (longBullets.length === 0) return null;

                      return (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">
                              {longBullets.length === 1
                                ? `Bullet exceeds 200 characters (${longestBullet.trim().length} chars).`
                                : `${longBullets.length} bullets exceed 200 characters.`}{' '}
                              Recruiters prefer punchy 1-2 line bullets.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                openAIModal({
                                  mode: 'bullet',
                                  contextData: {
                                    experienceItem: exp,
                                    itemIndex: index,
                                    targetBullet: longestBullet,
                                  },
                                })
                              )
                            }
                            className="underline font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2 hover:text-indigo-700"
                          >
                            Trim with AI
                          </button>
                        </div>
                      );
                    })()}

                    <textarea
                      rows={3}
                      placeholder="• Spearheaded customer onboarding redesign, increasing conversion by 28%..."
                      value={exp.highlights ? exp.highlights.join('\n') : exp.description || ''}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        dispatch(updateExperience({ index, data: { highlights: lines, description: e.target.value } }));
                      }}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // 5. Internships Editor
  if (activeSection === 'internships') {
    const list = cvData.internships || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="internships" />}
        <SectionHeaderControls
          title="Internships &amp; Traineeships"
          sectionId="internships"
          count={list.length}
          onAdd={() => dispatch(addInternship())}
          addLabel="Add Internship"
          cvData={cvData}
        />
        <SectionTipBox sectionId="internships" profileType={cvData.profileType} />

        <div className="space-y-4">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <ItemCardControls
                title={`${item.jobTitle || 'Internship'} ${item.company ? `@ ${item.company}` : ''}`}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderInternships({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderInternships({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateInternship(index))}
                onDelete={() => dispatch(removeInternship(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Role / Title *"
                  value={item.jobTitle || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { jobTitle: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Organization / Company *"
                  value={item.company || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { company: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={item.location || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { location: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={item.startDate || ''}
                    onChange={(e) => dispatch(updateInternship({ index, data: { startDate: e.target.value } }))}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={item.endDate || ''}
                    onChange={(e) => dispatch(updateInternship({ index, data: { endDate: e.target.value } }))}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Key learnings, projects, and deliverables during internship..."
                value={item.highlights ? item.highlights.join('\n') : item.description || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  dispatch(updateInternship({ index, data: { highlights: lines, description: e.target.value } }));
                }}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Education Editor
  if (activeSection === 'education') {
    const list = cvData.education || [];
    const handleEducationDragEnd = (event) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = list.findIndex((item) => item.id === active.id);
        const newIndex = list.findIndex((item) => item.id === over.id);
        dispatch(reorderEducation({ sourceIndex: oldIndex, destinationIndex: newIndex }));
      }
    };

    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="education" />}
        <SectionHeaderControls
          title="Education &amp; Academics"
          sectionId="education"
          count={list.length}
          onAdd={() => dispatch(addEducation())}
          addLabel="Add Degree"
          cvData={cvData}
        />
        <SectionTipBox sectionId="education" profileType={cvData.profileType} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEducationDragEnd}>
          <SortableContext items={list.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {list.map((edu, index) => (
                <SortableItem
                  key={edu.id}
                  id={edu.id}
                  isFirst={index === 0}
                  isLast={index === list.length - 1}
                  onMoveUp={() => {
                    if (index > 0) {
                      dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index - 1 }));
                    }
                  }}
                  onMoveDown={() => {
                    if (index < list.length - 1) {
                      dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index + 1 }));
                    }
                  }}
                >
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <ItemCardControls
                      title={`${edu.degree || 'Degree'} ${edu.institution ? `@ ${edu.institution}` : ''}`}
                      index={index}
                      total={list.length}
                      onMoveUp={
                        index > 0
                          ? () => dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index - 1 }))
                          : null
                      }
                      onMoveDown={
                        index < list.length - 1
                          ? () => dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index + 1 }))
                          : null
                      }
                      onDuplicate={() => dispatch(duplicateEducation(index))}
                      onDelete={() => dispatch(removeEducation(index))}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Institution / University / Board *"
                        value={edu.institution || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { institution: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Degree / Certificate (e.g. B.Sc. in CSE) *"
                        value={edu.degree || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { degree: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study / Major"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { fieldOfStudy: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="GPA / CGPA (e.g. CGPA 3.85 / 4.00)"
                        value={edu.grade || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { grade: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Start Year / Date"
                        value={edu.startDate || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { startDate: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="End Year / Graduation Date"
                        value={edu.endDate || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { endDate: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {(!edu.institution || (!edu.year && !edu.graduationYear && !edu.endDate)) && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        {!edu.institution ? 'Missing institution name.' : 'Missing graduation year or completion date.'}
                      </p>
                    )}

                    <textarea
                      rows={2}
                      placeholder="Honors, Dean's List, relevant coursework, thesis topic..."
                      value={edu.description || ''}
                      onChange={(e) => dispatch(updateEducation({ index, data: { description: e.target.value } }))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // 7. Skills & Competencies Editor
  if (activeSection === 'skills') {
    const list = cvData.skills || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="skills" />}
        <SectionHeaderControls
          title="Skills &amp; Competencies"
          sectionId="skills"
          count={list.length}
          onAdd={() => dispatch(addSkill())}
          addLabel="Add Skill"
          cvData={cvData}
          extraButton={
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={() => dispatch(openAIModal({ mode: 'skills' }))}
            >
              Suggest with AI
            </Button>
          }
        />
        <SectionTipBox sectionId="skills" profileType={cvData.profileType} />

        {list.length < 4 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Recruiters scan for 6–10 industry skills to pass ATS screening.</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(openAIModal({ mode: 'skills' }))}
              className="underline font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2"
            >
              Suggest Skills
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {list.map((skill, index) => (
            <div
              key={skill.id || index}
              className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. React.js, Python) *"
                  value={skill.name || ''}
                  onChange={(e) => dispatch(updateSkill({ index, data: { name: e.target.value } }))}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Frontend, DevOps)"
                  value={skill.category || ''}
                  onChange={(e) => dispatch(updateSkill({ index, data: { category: e.target.value } }))}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <select
                  value={skill.level || 'Advanced'}
                  onChange={(e) => dispatch(updateSkill({ index, data: { level: e.target.value } }))}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert / Master</option>
                </select>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => dispatch(duplicateSkill(index))}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                  title="Duplicate skill"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(removeSkill(index))}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  title="Delete skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Projects & Portfolio Editor
  if (activeSection === 'projects') {
    const list = cvData.projects || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="projects" />}
        <SectionHeaderControls
          title="Projects &amp; Portfolio"
          sectionId="projects"
          count={list.length}
          onAdd={() => dispatch(addProject())}
          addLabel="Add Project"
          cvData={cvData}
        />
        <SectionTipBox sectionId="projects" profileType={cvData.profileType} />

        <div className="space-y-4">
          {list.map((proj, index) => (
            <div
              key={proj.id || index}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <ItemCardControls
                title={proj.title || 'Untitled Project'}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderProjects({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderProjects({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateProject(index))}
                onDelete={() => dispatch(removeProject(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Project Name *"
                  value={proj.title || ''}
                  onChange={(e) => dispatch(updateProject({ index, data: { title: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Tech Stack / Role (e.g. React, Node.js, AWS)"
                  value={proj.role || (Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '')}
                  onChange={(e) =>
                    dispatch(
                      updateProject({
                        index,
                        data: {
                          role: e.target.value,
                          technologies: e.target.value.split(',').map((t) => t.trim()),
                        },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Live URL / Demo Link"
                  value={proj.link || proj.url || ''}
                  onChange={(e) => dispatch(updateProject({ index, data: { link: e.target.value, url: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="GitHub / Code Repository"
                  value={proj.github || ''}
                  onChange={(e) => dispatch(updateProject({ index, data: { github: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Key architecture challenge, scale milestone, or measurable business impact..."
                value={proj.highlights ? proj.highlights.join('\n') : proj.description || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  dispatch(updateProject({ index, data: { highlights: lines, description: e.target.value } }));
                }}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Certifications Editor
  if (activeSection === 'certifications') {
    const list = cvData.certifications || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="certifications" />}
        <SectionHeaderControls
          title="Certifications &amp; Licenses"
          sectionId="certifications"
          count={list.length}
          onAdd={() => dispatch(addCertification())}
          addLabel="Add Certification"
          cvData={cvData}
        />
        <SectionTipBox sectionId="certifications" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((cert, index) => (
            <div
              key={cert.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={`${cert.name || 'Certification'} ${cert.issuer ? `@ ${cert.issuer}` : ''}`}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderCertifications({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderCertifications({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateCertification(index))}
                onDelete={() => dispatch(removeCertification(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Certification Name *"
                  value={cert.name || ''}
                  onChange={(e) => dispatch(updateCertification({ index, data: { name: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Issuing Organization (e.g. AWS, Cisco)"
                  value={cert.issuer || ''}
                  onChange={(e) => dispatch(updateCertification({ index, data: { issuer: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Issue Date (e.g. 2023)"
                  value={cert.date || ''}
                  onChange={(e) => dispatch(updateCertification({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Credential ID or URL"
                  value={cert.credentialId || cert.url || ''}
                  onChange={(e) =>
                    dispatch(
                      updateCertification({
                        index,
                        data: { credentialId: e.target.value, url: e.target.value },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. Languages Editor
  if (activeSection === 'languages') {
    const list = cvData.languages || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="languages" />}
        <SectionHeaderControls
          title="Languages"
          sectionId="languages"
          count={list.length}
          onAdd={() => dispatch(addLanguage())}
          addLabel="Add Language"
          cvData={cvData}
        />
        <SectionTipBox sectionId="languages" profileType={cvData.profileType} />

        <div className="space-y-2">
          {list.map((lang, index) => (
            <div
              key={lang.id || index}
              className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="grid grid-cols-2 gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Language (e.g. English, Bengali) *"
                  value={lang.language || ''}
                  onChange={(e) => dispatch(updateLanguage({ index, data: { language: e.target.value } }))}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <select
                  value={lang.proficiency || 'Fluent'}
                  onChange={(e) => dispatch(updateLanguage({ index, data: { proficiency: e.target.value } }))}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Fluent / Full Professional">Fluent / Full Professional</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => dispatch(duplicateLanguage(index))}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                  title="Duplicate language"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(removeLanguage(index))}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  title="Delete language"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 11. Achievements Editor
  if (activeSection === 'achievements') {
    const list = cvData.achievements || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="achievements" />}
        <SectionHeaderControls
          title="Key Achievements &amp; Honors"
          sectionId="achievements"
          count={list.length}
          onAdd={() => dispatch(addAchievement())}
          addLabel="Add Achievement"
          cvData={cvData}
        />
        <SectionTipBox sectionId="achievements" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={item.title || 'Achievement'}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderAchievements({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderAchievements({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateAchievement(index))}
                onDelete={() => dispatch(removeAchievement(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Achievement / Award Title *"
                  value={item.title || ''}
                  onChange={(e) => dispatch(updateAchievement({ index, data: { title: e.target.value } }))}
                  className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Year / Date"
                  value={item.date || ''}
                  onChange={(e) => dispatch(updateAchievement({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Issuer / Competition / Organization"
                value={item.issuer || ''}
                onChange={(e) => dispatch(updateAchievement({ index, data: { issuer: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Description of competition scale, rank, or impact..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateAchievement({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 12. Volunteer Experience Editor
  if (activeSection === 'volunteer') {
    const list = cvData.volunteer || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="volunteer" />}
        <SectionHeaderControls
          title="Volunteer Experience &amp; Leadership"
          sectionId="volunteer"
          count={list.length}
          onAdd={() => dispatch(addVolunteer())}
          addLabel="Add Volunteer Entry"
          cvData={cvData}
        />
        <SectionTipBox sectionId="volunteer" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={`${item.role || 'Volunteer'} ${item.organization ? `@ ${item.organization}` : ''}`}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderVolunteer({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderVolunteer({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateVolunteer(index))}
                onDelete={() => dispatch(removeVolunteer(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Role / Title *"
                  value={item.role || ''}
                  onChange={(e) => dispatch(updateVolunteer({ index, data: { role: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Club / NGO / Organization *"
                  value={item.organization || ''}
                  onChange={(e) => dispatch(updateVolunteer({ index, data: { organization: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Initiatives led, funds raised, or community impact delivered..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateVolunteer({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 13. Publications & Research Editor
  if (activeSection === 'publications') {
    const list = cvData.publications || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="publications" />}
        <SectionHeaderControls
          title="Publications &amp; Research"
          sectionId="publications"
          count={list.length}
          onAdd={() => dispatch(addPublication())}
          addLabel="Add Publication"
          cvData={cvData}
        />
        <SectionTipBox sectionId="publications" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={item.title || 'Publication Title'}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderPublications({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderPublications({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicatePublication(index))}
                onDelete={() => dispatch(removePublication(index))}
              />

              <input
                type="text"
                placeholder="Paper / Article / Book Title *"
                value={item.title || ''}
                onChange={(e) => dispatch(updatePublication({ index, data: { title: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Journal / Conference / Publisher"
                  value={item.publisher || ''}
                  onChange={(e) => dispatch(updatePublication({ index, data: { publisher: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Date / Year"
                  value={item.date || ''}
                  onChange={(e) => dispatch(updatePublication({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="DOI or URL link"
                value={item.url || ''}
                onChange={(e) => dispatch(updatePublication({ index, data: { url: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 14. References Editor
  if (activeSection === 'references') {
    const list = cvData.references || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="references" />}
        <SectionHeaderControls
          title="References"
          sectionId="references"
          count={list.length}
          onAdd={() => dispatch(addReference())}
          addLabel="Add Reference"
          cvData={cvData}
        />
        <SectionTipBox sectionId="references" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((ref, index) => (
            <div
              key={ref.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={`${ref.name || 'Referee'} ${ref.designation ? `(${ref.designation})` : ''}`}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderReferences({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderReferences({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateReference(index))}
                onDelete={() => dispatch(removeReference(index))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Referee Name *"
                  value={ref.name || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { name: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Designation / Title *"
                  value={ref.designation || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { designation: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Company / University *"
                  value={ref.company || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { company: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={ref.phone || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { phone: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={ref.email || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { email: e.target.value } }))}
                  className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15. Personal Details (BD Recruiter Standard)
  if (activeSection === 'personalDetails') {
    const details = cvData.personalDetails || {};
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="personalDetails" />}
        <SectionHeaderControls
          title="Personal Details (BD Standard)"
          sectionId="personalDetails"
          cvData={cvData}
        />
        <SectionTipBox sectionId="personalDetails" profileType={cvData.profileType} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              value={details.fatherName || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ fatherName: e.target.value }))}
              placeholder="Md. Abdur Rahman"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mother's Name
            </label>
            <input
              type="text"
              value={details.motherName || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ motherName: e.target.value }))}
              placeholder="Begum Rokeya Sultana"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date of Birth
            </label>
            <input
              type="text"
              value={details.dob || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ dob: e.target.value }))}
              placeholder="15/10/1998"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              National ID (NID)
            </label>
            <input
              type="text"
              value={details.nid || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ nid: e.target.value }))}
              placeholder="19982692518000123"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={details.nationality || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ nationality: e.target.value }))}
              placeholder="Bangladeshi"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Religion
            </label>
            <input
              type="text"
              value={details.religion || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ religion: e.target.value }))}
              placeholder="Islam / Hinduism / Christianity / Buddhism"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Marital Status
            </label>
            <select
              value={details.maritalStatus || 'Single'}
              onChange={(e) => dispatch(updatePersonalDetails({ maritalStatus: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Unspecified">Unspecified</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Blood Group
            </label>
            <input
              type="text"
              value={details.bloodGroup || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ bloodGroup: e.target.value }))}
              placeholder="B+ (Positive) or O+"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Permanent Address
            </label>
            <input
              type="text"
              value={details.permanentAddress || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ permanentAddress: e.target.value }))}
              placeholder="Vill: Shantinagar, P.O: Mirpur, Upazila: Mirpur, Dist: Kushtia, Bangladesh"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Present / Mailing Address
            </label>
            <input
              type="text"
              value={details.presentAddress || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ presentAddress: e.target.value }))}
              placeholder="House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  // 16. Declaration & Signature Editor
  if (activeSection === 'declaration') {
    const decl = cvData.declaration || {};
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="declaration" />}
        <SectionHeaderControls
          title="Declaration &amp; Signature"
          sectionId="declaration"
          cvData={cvData}
        />
        <SectionTipBox sectionId="declaration" profileType={cvData.profileType} />

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Declaration Statement
            </label>
            <textarea
              rows={3}
              value={decl.statement || ''}
              onChange={(e) => dispatch(updateDeclaration({ statement: e.target.value }))}
              placeholder="I hereby declare that the particulars given above are correct and complete to the best of my knowledge and belief."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="Signature / Full Name"
              value={decl.signatureName || ''}
              onChange={(e) => dispatch(updateDeclaration({ signatureName: e.target.value }))}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Place (e.g. Dhaka)"
              value={decl.place || ''}
              onChange={(e) => dispatch(updateDeclaration({ place: e.target.value }))}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Date (e.g. 14/11/2026)"
              value={decl.date || ''}
              onChange={(e) => dispatch(updateDeclaration({ date: e.target.value }))}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  // 17. Additional Info Editor
  if (activeSection === 'additionalInfo') {
    const list = cvData.additionalInfo || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId="additionalInfo" />}
        <SectionHeaderControls
          title="Additional Information"
          sectionId="additionalInfo"
          count={list.length}
          onAdd={() => dispatch(addAdditionalInfo())}
          addLabel="Add Entry"
          cvData={cvData}
        />
        <SectionTipBox sectionId="additionalInfo" profileType={cvData.profileType} />

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <ItemCardControls
                title={item.title || 'Additional Info Entry'}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () => dispatch(reorderAdditionalInfo({ sourceIndex: index, destinationIndex: index - 1 }))
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () => dispatch(reorderAdditionalInfo({ sourceIndex: index, destinationIndex: index + 1 }))
                    : null
                }
                onDuplicate={() => dispatch(duplicateAdditionalInfo(index))}
                onDelete={() => dispatch(removeAdditionalInfo(index))}
              />

              <input
                type="text"
                placeholder="Topic / Category Title (e.g. Hobbies, Open Source Contributions)"
                value={item.title || ''}
                onChange={(e) => dispatch(updateAdditionalInfo({ index, data: { title: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Details, descriptions, or bullet items..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateAdditionalInfo({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 18. Custom Sections Editor
  const activeCustomSection = (cvData.customSections || []).find((s) => s.id === activeSection);
  if (activeCustomSection) {
    const list = activeCustomSection.items || [];
    return (
      <div className="space-y-4">
        {isSectionHidden && <HiddenSectionBanner sectionId={activeCustomSection.id} />}
        <SectionHeaderControls
          title={activeCustomSection.title || 'Custom Section'}
          sectionId={activeCustomSection.id}
          count={list.length}
          onAdd={() => dispatch(addCustomSectionItem({ sectionId: activeCustomSection.id }))}
          addLabel="Add Item"
          cvData={cvData}
        />

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={activeCustomSection.title || ''}
            onChange={(e) =>
              dispatch(updateCustomSection({ sectionId: activeCustomSection.id, data: { title: e.target.value } }))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm"
            >
              <ItemCardControls
                title={item.title || `Item #${index + 1}`}
                index={index}
                total={list.length}
                onMoveUp={
                  index > 0
                    ? () =>
                        dispatch(
                          reorderCustomSectionItems({
                            sectionId: activeCustomSection.id,
                            sourceIndex: index,
                            destinationIndex: index - 1,
                          })
                        )
                    : null
                }
                onMoveDown={
                  index < list.length - 1
                    ? () =>
                        dispatch(
                          reorderCustomSectionItems({
                            sectionId: activeCustomSection.id,
                            sourceIndex: index,
                            destinationIndex: index + 1,
                          })
                        )
                    : null
                }
                onDuplicate={() =>
                  dispatch(duplicateCustomSectionItem({ sectionId: activeCustomSection.id, index }))
                }
                onDelete={() =>
                  dispatch(removeCustomSectionItem({ sectionId: activeCustomSection.id, index }))
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Title / Role / Honor *"
                  value={item.title || ''}
                  onChange={(e) =>
                    dispatch(
                      updateCustomSectionItem({
                        sectionId: activeCustomSection.id,
                        index,
                        data: { title: e.target.value },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Subtitle / Organization"
                  value={item.subtitle || ''}
                  onChange={(e) =>
                    dispatch(
                      updateCustomSectionItem({
                        sectionId: activeCustomSection.id,
                        index,
                        data: { subtitle: e.target.value },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Date / Year"
                  value={item.date || ''}
                  onChange={(e) =>
                    dispatch(
                      updateCustomSectionItem({
                        sectionId: activeCustomSection.id,
                        index,
                        data: { date: e.target.value },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Description / Context / Details..."
                value={item.description || ''}
                onChange={(e) =>
                  dispatch(
                    updateCustomSectionItem({
                      sectionId: activeCustomSection.id,
                      index,
                      data: { description: e.target.value },
                    })
                  )
                }
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for unexpected or missing active section
  return (
    <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
      <p className="font-bold text-slate-800 dark:text-white">Active Section Selected: {activeSection}</p>
      <p className="text-[11px] text-slate-400 mt-1">
        Select another section from the left sidebar or click below to return to Personal Info.
      </p>
      <Button
        variant="primary"
        size="sm"
        className="mt-3 mx-auto"
        onClick={() => dispatch(updatePersonalInfo({}))}
      >
        Go to Personal Info
      </Button>
    </div>
  );
};

export default SectionFormEditor;
