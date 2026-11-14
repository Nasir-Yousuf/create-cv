import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePersonalInfo,
  updatePersonalDetails,
  updateDeclaration,
  updateExperience,
  addExperience,
  removeExperience,
  reorderExperience,
  updateEducation,
  addEducation,
  removeEducation,
  reorderEducation,
  updateSkill,
  addSkill,
  removeSkill,
  updateProject,
  addProject,
  removeProject,
  updateCertification,
  addCertification,
  removeCertification,
  updateLanguage,
  addLanguage,
  removeLanguage,
  addReference,
  updateReference,
  removeReference,
  updateCustomSection,
  updateCareerObjective,
  updateSummary,
  addInternship,
  updateInternship,
  removeInternship,
  addAchievement,
  updateAchievement,
  removeAchievement,
  addVolunteer,
  updateVolunteer,
  removeVolunteer,
  addPublication,
  updatePublication,
  removePublication,
  addAdditionalInfo,
  updateAdditionalInfo,
  removeAdditionalInfo,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
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
import {
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Link as LinkIcon,
  Github,
  Calendar,
  Check,
} from 'lucide-react';

export const SectionFormEditor = ({ onOpenPhotoModal }) => {
  const dispatch = useDispatch();
  const cvData = useSelector((state) => state.cv.currentCV);
  const activeSection = useSelector((state) => state.ui.activeSection);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 1. Personal Info Editor
  if (activeSection === 'personalInfo') {
    const { personalInfo } = cvData;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Personal Information
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
              Job Title *
            </label>
            <input
              type="text"
              value={personalInfo.jobTitle || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ jobTitle: e.target.value }))}
              placeholder="Senior Full Stack Engineer"
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
              Phone Number
            </label>
            <input
              type="text"
              value={personalInfo.phone || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ phone: e.target.value }))}
              placeholder="+1 (555) 234-5678"
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
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Portfolio / Website
            </label>
            <input
              type="text"
              value={personalInfo.website || personalInfo.portfolio || ''}
              onChange={(e) =>
                dispatch(updatePersonalInfo({ website: e.target.value, portfolio: e.target.value }))
              }
              placeholder="https://alexmorgan.dev"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn
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
              GitHub / Code Profile
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
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Professional Summary
            </h3>
            <p className="text-[11px] text-slate-500">
              A high-impact 3–4 sentence executive pitch at the top of your resume.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={() => dispatch(openAIModal({ mode: 'summary' }))}
          >
            Improve with AI
          </Button>
        </div>

        <textarea
          rows={6}
          value={cvData.personalInfo?.summary || ''}
          onChange={(e) => dispatch(updatePersonalInfo({ summary: e.target.value }))}
          placeholder="Results-driven Software Engineer with 6+ years of experience..."
          className="w-full p-3.5 text-xs leading-relaxed rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  }

  // 3. Work Experience with Drag and Drop Reordering
  if (activeSection === 'experience') {
    const handleExperienceDragEnd = (event) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = cvData.experience.findIndex((item) => item.id === active.id);
        const newIndex = cvData.experience.findIndex((item) => item.id === over.id);
        dispatch(reorderExperience({ sourceIndex: oldIndex, destinationIndex: newIndex }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Work Experience ({cvData.experience?.length || 0})
            </h3>
            <p className="text-[11px] text-slate-500">Drag to reorder your career history.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addExperience())}
          >
            Add Job
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
          <SortableContext
            items={cvData.experience.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <SortableItem
                  key={exp.id}
                  id={exp.id}
                  isFirst={index === 0}
                  isLast={index === cvData.experience.length - 1}
                  onMoveUp={() => {
                    if (index > 0) {
                      dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index - 1 }));
                    }
                  }}
                  onMoveDown={() => {
                    if (index < cvData.experience.length - 1) {
                      dispatch(reorderExperience({ sourceIndex: index, destinationIndex: index + 1 }));
                    }
                  }}
                >
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {exp.jobTitle || 'New Position'} {exp.company && `@ ${exp.company}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(removeExperience(index))}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

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
                        placeholder="Start Date (e.g. 2022-01)"
                        value={exp.startDate || ''}
                        onChange={(e) => dispatch(updateExperience({ index, data: { startDate: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="End Date"
                          disabled={exp.current}
                          value={exp.current ? 'Present' : exp.endDate || ''}
                          onChange={(e) => dispatch(updateExperience({ index, data: { endDate: e.target.value } }))}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50"
                        />
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!exp.current}
                            onChange={(e) => dispatch(updateExperience({ index, data: { current: e.target.checked } }))}
                            className="rounded accent-indigo-600"
                          />
                          Current
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Achievements & Responsibilities
                        </label>
                        <button
                          type="button"
                          onClick={() => dispatch(openAIModal({ mode: 'experience', contextData: exp }))}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Quantify Bullets with AI
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="• Architected microservices reducing latency by 42%..."
                        value={exp.highlights ? exp.highlights.join('\n') : exp.description || ''}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n');
                          dispatch(updateExperience({ index, data: { highlights: lines, description: e.target.value } }));
                        }}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // 4. Education with Drag and Drop Reordering
  if (activeSection === 'education') {
    const handleEducationDragEnd = (event) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = cvData.education.findIndex((item) => item.id === active.id);
        const newIndex = cvData.education.findIndex((item) => item.id === over.id);
        dispatch(reorderEducation({ sourceIndex: oldIndex, destinationIndex: newIndex }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Education ({cvData.education?.length || 0})
            </h3>
            <p className="text-[11px] text-slate-500">Drag to prioritize degrees.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addEducation())}
          >
            Add Degree
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEducationDragEnd}>
          <SortableContext items={cvData.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {cvData.education.map((edu, index) => (
                <SortableItem
                  key={edu.id}
                  id={edu.id}
                  isFirst={index === 0}
                  isLast={index === cvData.education.length - 1}
                  onMoveUp={() => {
                    if (index > 0) {
                      dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index - 1 }));
                    }
                  }}
                  onMoveDown={() => {
                    if (index < cvData.education.length - 1) {
                      dispatch(reorderEducation({ sourceIndex: index, destinationIndex: index + 1 }));
                    }
                  }}
                >
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {edu.degree || 'Degree'} {edu.institution && `@ ${edu.institution}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(removeEducation(index))}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Institution / University *"
                        value={edu.institution || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { institution: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. Bachelor of Science)"
                        value={edu.degree || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { degree: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study (e.g. Computer Science)"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => dispatch(updateEducation({ index, data: { fieldOfStudy: e.target.value } }))}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Graduation Year"
                          value={edu.endDate || ''}
                          onChange={(e) => dispatch(updateEducation({ index, data: { endDate: e.target.value } }))}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Grade / GPA"
                          value={edu.grade || ''}
                          onChange={(e) => dispatch(updateEducation({ index, data: { grade: e.target.value } }))}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // 5. Skills Editor
  if (activeSection === 'skills') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Skills & Expertise ({cvData.skills?.length || 0})
            </h3>
            <p className="text-[11px] text-slate-500">Add technical and core competencies.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={() => dispatch(openAIModal({ mode: 'skills' }))}
            >
              Suggest Skills
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => dispatch(addSkill())}
            >
              Add Skill
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {cvData.skills?.map((skill, index) => (
            <div
              key={skill.id || index}
              className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <input
                type="text"
                placeholder="Skill name (e.g. React.js, Python)"
                value={skill.name || ''}
                onChange={(e) => dispatch(updateSkill({ index, data: { name: e.target.value } }))}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <select
                value={skill.level || 'Advanced'}
                onChange={(e) => dispatch(updateSkill({ index, data: { level: e.target.value } }))}
                className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={() => dispatch(removeSkill(index))}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Projects Editor
  if (activeSection === 'projects') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Projects ({cvData.projects?.length || 0})
          </h3>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => dispatch(addProject())}>
            Add Project
          </Button>
        </div>

        <div className="space-y-3">
          {cvData.projects?.map((proj, index) => (
            <div key={proj.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{proj.title || 'New Project'}</span>
                <button type="button" onClick={() => dispatch(removeProject(index))} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Title *"
                value={proj.title || ''}
                onChange={(e) => dispatch(updateProject({ index, data: { title: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Live URL"
                  value={proj.link || ''}
                  onChange={(e) => dispatch(updateProject({ index, data: { link: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={proj.technologies ? proj.technologies.join(', ') : ''}
                  onChange={(e) => dispatch(updateProject({ index, data: { technologies: e.target.value.split(',').map((s) => s.trim()) } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Brief project description..."
                value={proj.description || ''}
                onChange={(e) => dispatch(updateProject({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. Certifications Editor
  if (activeSection === 'certifications') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Certifications & Licenses ({cvData.certifications?.length || 0})
          </h3>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => dispatch(addCertification())}>
            Add Certification
          </Button>
        </div>

        <div className="space-y-3">
          {cvData.certifications?.map((cert, index) => (
            <div key={cert.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{cert.name || 'New Certification'}</span>
                <button type="button" onClick={() => dispatch(removeCertification(index))} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Certification Name *"
                value={cert.name || ''}
                onChange={(e) => dispatch(updateCertification({ index, data: { name: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Issuing Organization"
                  value={cert.issuer || ''}
                  onChange={(e) => dispatch(updateCertification({ index, data: { issuer: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Year / Date"
                  value={cert.date || ''}
                  onChange={(e) => dispatch(updateCertification({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Languages Editor
  if (activeSection === 'languages') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Languages ({cvData.languages?.length || 0})
          </h3>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => dispatch(addLanguage())}>
            Add Language
          </Button>
        </div>

        <div className="space-y-2">
          {cvData.languages?.map((lang, index) => (
            <div key={lang.id || index} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <input
                type="text"
                placeholder="Language (e.g. English, Bengali)"
                value={typeof lang === 'string' ? lang : lang.language || lang.name || ''}
                onChange={(e) => dispatch(updateLanguage({ index, data: { language: e.target.value, name: e.target.value } }))}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <select
                value={typeof lang === 'object' ? lang.proficiency || 'Fluent' : 'Fluent'}
                onChange={(e) => dispatch(updateLanguage({ index, data: { proficiency: e.target.value } }))}
                className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
              <button
                type="button"
                onClick={() => dispatch(removeLanguage(index))}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Personal Details Editor (Bangladeshi Recruiter Format)
  if (activeSection === 'personalDetails') {
    const pd = cvData.personalDetails || {};
    return (
      <div className="space-y-4">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Personal Details (BD Recruiter Standard)
          </h3>
          <p className="text-[11px] text-slate-500">Corporate & government standard personal information.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Father's Name</label>
            <input
              type="text"
              value={pd.fatherName || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ fatherName: e.target.value }))}
              placeholder="e.g. Md. Abdur Rahman"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Mother's Name</label>
            <input
              type="text"
              value={pd.motherName || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ motherName: e.target.value }))}
              placeholder="e.g. Begum Rokeya Sultana"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Date of Birth</label>
            <input
              type="text"
              value={pd.dob || pd.dateOfBirth || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ dob: e.target.value, dateOfBirth: e.target.value }))}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">National ID (NID)</label>
            <input
              type="text"
              value={pd.nid || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ nid: e.target.value }))}
              placeholder="e.g. 19962692518..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
            <input
              type="text"
              value={pd.gender || 'Male'}
              onChange={(e) => dispatch(updatePersonalDetails({ gender: e.target.value }))}
              placeholder="Male / Female"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Blood Group</label>
            <input
              type="text"
              value={pd.bloodGroup || ''}
              onChange={(e) => dispatch(updatePersonalDetails({ bloodGroup: e.target.value }))}
              placeholder="e.g. B+, O+, A+"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Nationality</label>
            <input
              type="text"
              value={pd.nationality || 'Bangladeshi'}
              onChange={(e) => dispatch(updatePersonalDetails({ nationality: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Marital Status</label>
            <input
              type="text"
              value={pd.maritalStatus || 'Single'}
              onChange={(e) => dispatch(updatePersonalDetails({ maritalStatus: e.target.value }))}
              placeholder="Single / Married"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Present Address</label>
          <input
            type="text"
            value={pd.presentAddress || ''}
            onChange={(e) => dispatch(updatePersonalDetails({ presentAddress: e.target.value }))}
            placeholder="Current living address"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Permanent Address</label>
          <input
            type="text"
            value={pd.permanentAddress || ''}
            onChange={(e) => dispatch(updatePersonalDetails({ permanentAddress: e.target.value }))}
            placeholder="Village, Post Office, Upazila, District"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>
      </div>
    );
  }

  // 10. References Editor
  if (activeSection === 'references') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            References ({cvData.references?.length || 0})
          </h3>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => dispatch(addReference())}>
            Add Reference
          </Button>
        </div>

        <div className="space-y-3">
          {cvData.references?.map((ref, index) => (
            <div key={ref.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{ref.name || 'New Reference'}</span>
                <button type="button" onClick={() => dispatch(removeReference(index))} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Full Name *"
                value={ref.name || ''}
                onChange={(e) => dispatch(updateReference({ index, data: { name: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Designation"
                  value={ref.designation || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { designation: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Company / Institution"
                  value={ref.company || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { company: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={ref.phone || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { phone: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={ref.email || ''}
                  onChange={(e) => dispatch(updateReference({ index, data: { email: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 11. Declaration Editor
  if (activeSection === 'declaration') {
    const decl = cvData.declaration || {};
    return (
      <div className="space-y-4">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Declaration & Signature
          </h3>
          <p className="text-[11px] text-slate-500">Legal confirmation for corporate and recruiter applications.</p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Declaration Statement</label>
          <textarea
            rows={3}
            value={decl.text || ''}
            onChange={(e) => dispatch(updateDeclaration({ text: e.target.value }))}
            placeholder="I hereby declare that all information..."
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Signed By (Authorized Name)</label>
          <input
            type="text"
            value={decl.signedBy || cvData.personalInfo?.fullName || ''}
            onChange={(e) => dispatch(updateDeclaration({ signedBy: e.target.value }))}
            placeholder="Your Full Name"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>
      </div>
    );
  }

  // 12. Career Objective Editor
  if (activeSection === 'careerObjective') {
    const objectiveText = cvData.careerObjective || cvData.personalInfo?.careerObjective || '';
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Career Objective
            </h3>
            <p className="text-[11px] text-slate-500">
              Targeted career goals and value proposition for entry or transitioning roles.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={() => dispatch(openAIModal({ mode: 'summary' }))}
          >
            Improve with AI
          </Button>
        </div>

        <textarea
          rows={5}
          value={objectiveText}
          onChange={(e) => dispatch(updateCareerObjective(e.target.value))}
          placeholder="Seeking a challenging role in software engineering to contribute..."
          className="w-full p-3.5 text-xs leading-relaxed rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  }

  // 13. Internships Editor
  if (activeSection === 'internships') {
    const internships = cvData.internships || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Internships ({internships.length})
            </h3>
            <p className="text-[11px] text-slate-500">Internship and trainee experiences.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addInternship())}
          >
            Add Internship
          </Button>
        </div>

        <div className="space-y-4">
          {internships.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.role || 'New Internship'} {item.company ? `at ${item.company}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(removeInternship(index))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Role / Job Title *"
                  value={item.role || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { role: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Company / Organization *"
                  value={item.company || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { company: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Location (e.g. Dhaka, Bangladesh)"
                  value={item.location || ''}
                  onChange={(e) => dispatch(updateInternship({ index, data: { location: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={item.startDate || ''}
                    onChange={(e) => dispatch(updateInternship({ index, data: { startDate: e.target.value } }))}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={item.endDate || ''}
                    onChange={(e) => dispatch(updateInternship({ index, data: { endDate: e.target.value } }))}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Key responsibilities and achievements..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateInternship({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 14. Achievements Editor
  if (activeSection === 'achievements') {
    const achievements = cvData.achievements || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Key Achievements & Honors ({achievements.length})
            </h3>
            <p className="text-[11px] text-slate-500">Awards, honors, competitions, and notable milestones.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addAchievement())}
          >
            Add Achievement
          </Button>
        </div>

        <div className="space-y-3">
          {achievements.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title || 'New Achievement'}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(removeAchievement(index))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Achievement / Award Title *"
                  value={item.title || ''}
                  onChange={(e) => dispatch(updateAchievement({ index, data: { title: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Issuer / Organization"
                  value={item.issuer || item.organization || ''}
                  onChange={(e) =>
                    dispatch(
                      updateAchievement({
                        index,
                        data: { issuer: e.target.value, organization: e.target.value },
                      })
                    )
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Date (e.g. 2024 or Nov 2023)"
                  value={item.date || ''}
                  onChange={(e) => dispatch(updateAchievement({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Brief description of the impact or distinction..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateAchievement({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15. Volunteer Experience Editor
  if (activeSection === 'volunteer') {
    const volunteer = cvData.volunteer || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Volunteer Experience ({volunteer.length})
            </h3>
            <p className="text-[11px] text-slate-500">Community service, leadership, and non-profit roles.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addVolunteer())}
          >
            Add Volunteer
          </Button>
        </div>

        <div className="space-y-3">
          {volunteer.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.role || 'Volunteer Role'} {item.organization ? `at ${item.organization}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(removeVolunteer(index))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Role Title *"
                  value={item.role || ''}
                  onChange={(e) => dispatch(updateVolunteer({ index, data: { role: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Organization *"
                  value={item.organization || ''}
                  onChange={(e) =>
                    dispatch(updateVolunteer({ index, data: { organization: e.target.value } }))
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Start Date"
                  value={item.startDate || ''}
                  onChange={(e) => dispatch(updateVolunteer({ index, data: { startDate: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={item.endDate || ''}
                  onChange={(e) => dispatch(updateVolunteer({ index, data: { endDate: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Description of activities..."
                value={item.description || ''}
                onChange={(e) => dispatch(updateVolunteer({ index, data: { description: e.target.value } }))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 16. Publications Editor
  if (activeSection === 'publications') {
    const publications = cvData.publications || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Publications & Research ({publications.length})
            </h3>
            <p className="text-[11px] text-slate-500">Academic papers, journal publications, and articles.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addPublication())}
          >
            Add Publication
          </Button>
        </div>

        <div className="space-y-3">
          {publications.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title || 'New Publication'}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(removePublication(index))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Publication Title *"
                value={item.title || ''}
                onChange={(e) => dispatch(updatePublication({ index, data: { title: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Publisher / Journal / Conference"
                  value={item.publisher || ''}
                  onChange={(e) => dispatch(updatePublication({ index, data: { publisher: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Date / Year"
                  value={item.date || ''}
                  onChange={(e) => dispatch(updatePublication({ index, data: { date: e.target.value } }))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <input
                type="text"
                placeholder="URL / DOI Link"
                value={item.url || ''}
                onChange={(e) => dispatch(updatePublication({ index, data: { url: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 17. Additional Information Editor
  if (activeSection === 'additionalInfo') {
    const additionalInfo = cvData.additionalInfo || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Additional Information ({additionalInfo.length})
            </h3>
            <p className="text-[11px] text-slate-500">Hobbies, security clearances, affiliations, or other details.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addAdditionalInfo())}
          >
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {additionalInfo.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title || 'Information Item'}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(removeAdditionalInfo(index))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Title / Category (e.g. Interests, Clearance)"
                value={item.title || ''}
                onChange={(e) => dispatch(updateAdditionalInfo({ index, data: { title: e.target.value } }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
              <textarea
                rows={2}
                placeholder="Details..."
                value={item.description || ''}
                onChange={(e) =>
                  dispatch(updateAdditionalInfo({ index, data: { description: e.target.value } }))
                }
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
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
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeCustomSection.title || 'Custom Section'}
            </h3>
            <p className="text-[11px] text-slate-500">Custom user-defined section items.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => dispatch(addCustomSectionItem({ sectionId: activeCustomSection.id }))}
          >
            Add Item
          </Button>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={activeCustomSection.title || ''}
            onChange={(e) =>
              dispatch(updateCustomSection({ id: activeCustomSection.id, title: e.target.value }))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>

        <div className="space-y-3">
          {(activeCustomSection.items || []).map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title || 'Item #' + (index + 1)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      removeCustomSectionItem({ sectionId: activeCustomSection.id, index })
                    )
                  }
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Title / Role / Name"
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
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
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
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
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
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Description / Details..."
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
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for custom sections or others
  return (
    <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
      <p className="font-bold text-slate-800 dark:text-white">Active Section Selected: {activeSection}</p>
      <p className="text-[11px] text-slate-400 mt-1">Configure section fields or switch to another section from the left list.</p>
    </div>
  );
};

export default SectionFormEditor;

