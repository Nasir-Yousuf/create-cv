import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateProject,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Camera } from 'lucide-react';

export const AppleClean = ({ cvData, onOpenPhotoModal }) => {
  const dispatch = useDispatch();

  const {
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    declaration = {},
    design = {},
  } = cvData;

  const primary = design?.primaryColor || '#1e293b'; // Apple sleek slate / dark neutral
  const textColor = design?.textColor || '#0f172a';
  const fontFamily = design?.fontFamily || 'Inter';

  const isPortrait = personalInfo?.photoStyle === 'portrait' || design?.photoFormat === 'portrait' || true;
  const photoSizeClass =
    design?.photoSize === 'sm'
      ? 'w-20 h-28'
      : design?.photoSize === 'lg'
      ? 'w-32 h-44'
      : design?.photoSize === 'xl'
      ? 'w-36 h-48'
      : 'w-24 h-32';

  return (
    <div
      className="p-6 sm:p-8 md:p-10 bg-white text-slate-900 transition-all text-xs leading-normal selection:bg-slate-200"
      style={{ fontFamily, color: textColor }}
    >
      {/* 1. Apple-Style Minimal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 mb-6 border-b border-slate-200">
        <div className="space-y-2 flex-1">
          <div className="space-y-0.5">
            <EditableElement
              section="personalInfo"
              field="fullName"
              tag="h1"
              value={personalInfo.fullName}
              onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
              placeholder="Your Full Name"
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 block"
            />
            <EditableElement
              section="personalInfo"
              field="jobTitle"
              tag="p"
              value={personalInfo.jobTitle}
              onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
              placeholder="Your Job Title / Professional Designation"
              className="text-base font-normal text-slate-500 block"
            />
          </div>

          {/* Minimalist Contact Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[11px] text-slate-500">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="email"
                  value={personalInfo.email}
                  onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                  placeholder="email@example.com"
                  className="inline hover:text-slate-900"
                />
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="phone"
                  value={personalInfo.phone}
                  onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                  placeholder="+880 17XX-XXXXXX"
                  className="inline hover:text-slate-900"
                />
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <EditableElement
                  section="personalInfo"
                  field="location"
                  value={personalInfo.location}
                  onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                  placeholder="City, Country"
                  className="inline hover:text-slate-900"
                />
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                <span>linkedin.com/in/{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Minimal Portrait Photo */}
        {design?.showPhoto && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="shrink-0 relative group cursor-pointer"
            title="Click to edit portrait photo"
          >
            {personalInfo.photo ? (
              <div
                className={`${photoSizeClass} overflow-hidden rounded-lg border border-slate-200/90 shadow-sm bg-slate-50 transition-all group-hover:border-slate-400`}
              >
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`${photoSizeClass} border border-dashed border-slate-300 rounded-lg bg-slate-50/70 flex flex-col items-center justify-center text-slate-400 p-2 text-center group-hover:border-slate-500 transition-colors`}
              >
                <Camera className="w-5 h-5 mb-1 text-slate-400" />
                <span className="text-[9px] font-medium text-slate-500">Portrait Photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-[10px] font-medium">
              Change
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary / Career Bio */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-2">
            Overview
          </h2>
          <EditableElement
            section="personalInfo"
            field="summary"
            value={personalInfo.summary}
            multiline={true}
            onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
            placeholder="Write your professional bio..."
            className="text-slate-700 leading-relaxed text-justify block text-xs"
          />
        </section>
      )}

      {/* 3. Work Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      value={exp.jobTitle}
                      onSave={(val) =>
                        dispatch(updateExperience({ index, data: { jobTitle: val } }))
                      }
                      placeholder="Job Title"
                      className="font-semibold text-slate-950 inline-block"
                    />
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">{exp.company}</span>
                    {exp.location && <span className="text-slate-400 text-[11px]">({exp.location})</span>}
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal mt-0.5 sm:mt-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-slate-600 text-xs mt-0.5">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs mt-1">
                    {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Education (Clean Minimal Style or BD Table) */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{edu.degree}</span>
                  {edu.fieldOfStudy && <span className="text-slate-600 font-medium">, {edu.fieldOfStudy}</span>}
                  <p className="text-slate-500 text-[11px]">
                    {edu.institution} {edu.grade && `• ${edu.grade}`}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 sm:mt-0">
                  {edu.endDate || edu.startDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Skills (Minimal Apple Tag Pills) */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-2.5">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id || s.name}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200/60"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 6. Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-slate-900">{proj.title}</span>
                  {proj.startDate && (
                    <span className="text-[11px] text-slate-400">
                      {proj.startDate} – {proj.endDate || 'Present'}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 text-xs">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-slate-400 text-[10px] font-mono">
                    Stack: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Bangladeshi Recruiter Personal Details (if populated) */}
      {personalDetails?.fatherName && (
        <section className="mb-6 pt-2 border-t border-slate-100">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-600">
            <p><strong className="text-slate-800">Father's Name:</strong> {personalDetails.fatherName}</p>
            <p><strong className="text-slate-800">Mother's Name:</strong> {personalDetails.motherName}</p>
            <p><strong className="text-slate-800">Date of Birth:</strong> {personalDetails.dob}</p>
            <p><strong className="text-slate-800">Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
            {personalDetails.nid && <p><strong className="text-slate-800">National ID (NID):</strong> {personalDetails.nid}</p>}
            {personalDetails.bloodGroup && <p><strong className="text-slate-800">Blood Group:</strong> {personalDetails.bloodGroup}</p>}
            {personalDetails.permanentAddress && (
              <p className="sm:col-span-2"><strong className="text-slate-800">Permanent Address:</strong> {personalDetails.permanentAddress}</p>
            )}
          </div>
        </section>
      )}

      {/* 8. References (if populated) */}
      {references && references.length > 0 && (
        <section className="mb-6 pt-2 border-t border-slate-100">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1 mb-2">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
            {references.map((ref, idx) => (
              <div key={ref.id || idx} className="p-2 bg-slate-50/80 rounded border border-slate-200/50">
                <p className="font-semibold text-slate-900">{ref.name}</p>
                <p className="text-slate-600">{ref.designation}, {ref.company}</p>
                {ref.phone && <p className="text-slate-500">Phone: {ref.phone}</p>}
                {ref.email && <p className="text-slate-500">Email: {ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Declaration (if populated) */}
      {declaration?.signedBy && (
        <section className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-end">
          <p className="italic max-w-sm">
            {declaration.text || 'I hereby declare that the information provided is true and correct.'}
          </p>
          <div className="text-right">
            <div className="w-28 border-b border-slate-300 mb-1" />
            <p className="font-semibold text-slate-800">{declaration.signedBy || personalInfo.fullName}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default AppleClean;

