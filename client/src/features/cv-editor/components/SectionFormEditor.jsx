import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePersonalInfo,
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
  updateCustomSection,
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
              value={personalInfo.website || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ website: e.target.value }))}
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

