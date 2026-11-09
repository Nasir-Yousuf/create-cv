import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
} from '../store/cvSlice';
import EditableElement from '../features/cv-editor/components/EditableElement';
import { Mail, Phone, MapPin, Globe, Linkedin, Camera } from 'lucide-react';

export const BangladeshStandard = ({ cvData, onOpenPhotoModal }) => {
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

  const primary = design?.primaryColor || '#059669'; // Emerald green / Navy
  const textColor = design?.textColor || '#1e293b';
  const fontFamily = design?.fontFamily || 'Inter';

  // Portrait Passport photo dimensions (35x45mm ratio, approx 110x140px)
  const portraitPhotoClass =
    design?.photoSize === 'sm'
      ? 'w-24 h-32'
      : design?.photoSize === 'lg'
      ? 'w-36 h-48'
      : design?.photoSize === 'xl'
      ? 'w-40 h-52'
      : 'w-28 h-36';

  return (
    <div
      className="p-8 sm:p-12 bg-white text-slate-800 transition-all leading-normal text-xs"
      style={{ fontFamily, color: textColor }}
    >
      {/* 1. Header with Name, Contact and Portrait Passport Photo on Right */}
      <div className="flex justify-between items-start pb-4 mb-4 border-b-2" style={{ borderColor: primary }}>
        <div className="space-y-1.5 flex-1 pr-4">
          <EditableElement
            section="personalInfo"
            field="fullName"
            tag="h1"
            value={personalInfo.fullName}
            onSave={(val) => dispatch(updatePersonalInfo({ fullName: val }))}
            placeholder="YOUR FULL NAME"
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide block"
            style={{ color: primary }}
          />

          <EditableElement
            section="personalInfo"
            field="jobTitle"
            tag="p"
            value={personalInfo.jobTitle}
            onSave={(val) => dispatch(updatePersonalInfo({ jobTitle: val }))}
            placeholder="Target Designation / Profession"
            className="text-sm font-bold text-slate-700 block"
          />

          {/* Contact Details */}
          <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
              <EditableElement
                section="personalInfo"
                field="location"
                value={personalInfo.location}
                onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                placeholder="Present Address: House, Road, Area, Dhaka"
                className="inline"
              />
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
              <EditableElement
                section="personalInfo"
                field="phone"
                value={personalInfo.phone}
                onSave={(val) => dispatch(updatePersonalInfo({ phone: val }))}
                placeholder="+880 17XX-XXXXXX"
                className="inline font-semibold"
              />
              <span className="mx-1">•</span>
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
              <EditableElement
                section="personalInfo"
                field="email"
                value={personalInfo.email}
                onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                placeholder="your.email@gmail.com"
                className="inline"
              />
            </p>
            {personalInfo.linkedin && (
              <p className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>linkedin.com/in/{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Portrait Passport Size Photo Frame (Standard BD Requirement) */}
        {design?.showPhoto && (
          <div
            onClick={() => onOpenPhotoModal && onOpenPhotoModal()}
            className="shrink-0 relative group cursor-pointer"
            title="Click to change / crop portrait passport photo"
          >
            {personalInfo.photo ? (
              <div
                className={`${portraitPhotoClass} border-2 border-slate-300 shadow-sm overflow-hidden bg-slate-100 ${
                  personalInfo.photoStyle === 'circle'
                    ? 'rounded-full w-28 h-28'
                    : personalInfo.photoStyle === 'rounded'
                    ? 'rounded-xl'
                    : 'rounded-none'
                }`}
                style={{ borderColor: primary }}
              >
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`${portraitPhotoClass} border-2 border-dashed border-slate-300 rounded bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-2 text-center hover:border-emerald-600 transition-colors`}
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-semibold leading-tight">Passport Size Photo (35×45mm)</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-[10px] font-bold rounded">
              Edit Photo
            </div>
          </div>
        )}
      </div>

      {/* 2. Career Objective / Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            Career Objective
          </h2>
          <EditableElement
            section="personalInfo"
            field="summary"
            value={personalInfo.summary}
            multiline={true}
            onSave={(val) => dispatch(updatePersonalInfo({ summary: val }))}
            placeholder="Write your targeted career objective..."
            className="text-slate-700 leading-relaxed text-justify block"
          />
        </section>
      )}

      {/* 3. Employment History / Work Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            Employment History
          </h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>
                    {index + 1}. {exp.jobTitle}
                  </span>
                  <span className="text-[11px] text-slate-600 font-normal">
                    {exp.startDate} to {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 italic font-medium">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.description && <p className="text-slate-700 text-[11px]">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-[11px]">
                    {exp.highlights.map((h, i) => h && <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Academic Qualifications (Standard BD Structured Table) */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            Academic Qualifications
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-[11px] text-slate-800">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-left font-bold">
                  <th className="border border-slate-300 px-2 py-1.5">Exam / Degree</th>
                  <th className="border border-slate-300 px-2 py-1.5">Institute / Board</th>
                  <th className="border border-slate-300 px-2 py-1.5">Passing Year</th>
                  <th className="border border-slate-300 px-2 py-1.5">Group / Major</th>
                  <th className="border border-slate-300 px-2 py-1.5">Result / CGPA</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, i) => (
                  <tr key={edu.id || i} className={i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="border border-slate-300 px-2 py-1 font-semibold">{edu.degree}</td>
                    <td className="border border-slate-300 px-2 py-1">{edu.institution}</td>
                    <td className="border border-slate-300 px-2 py-1 text-center">{edu.endDate || edu.startDate}</td>
                    <td className="border border-slate-300 px-2 py-1">{edu.fieldOfStudy || '—'}</td>
                    <td className="border border-slate-300 px-2 py-1 font-bold text-center">{edu.grade || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. Computer & Professional Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            Specialized Skills & Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700">
            {skills.map((s) => (
              <div key={s.id || s.name} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
                <span className="font-medium text-slate-800">{s.name}</span>
                {s.level && <span className="text-slate-500 text-[10px]">({s.level})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Personal Details (Standard BD Recruiter Requirement) */}
      <section className="mb-4">
        <h2
          className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b"
          style={{ color: primary, borderColor: `${primary}50` }}
        >
          Personal Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-700">
          <p><strong className="text-slate-800">Father's Name:</strong> {personalDetails.fatherName || 'Md. Abdur Rahman'}</p>
          <p><strong className="text-slate-800">Mother's Name:</strong> {personalDetails.motherName || 'Begum Rokeya Sultana'}</p>
          <p><strong className="text-slate-800">Date of Birth:</strong> {personalDetails.dob || '15/10/1996'}</p>
          <p><strong className="text-slate-800">Gender:</strong> {personalDetails.gender || 'Male'}</p>
          <p><strong className="text-slate-800">Marital Status:</strong> {personalDetails.maritalStatus || 'Single'}</p>
          <p><strong className="text-slate-800">Nationality:</strong> {personalDetails.nationality || 'Bangladeshi'}</p>
          <p><strong className="text-slate-800">National ID (NID):</strong> {personalDetails.nid || '19962692518000123'}</p>
          <p><strong className="text-slate-800">Blood Group:</strong> {personalDetails.bloodGroup || 'B+'}</p>
          <p className="sm:col-span-2"><strong className="text-slate-800">Permanent Address:</strong> {personalDetails.permanentAddress || 'Vill: Shantinagar, P.O: Mirpur, Kushtia, Bangladesh'}</p>
        </div>
      </section>

      {/* 7. Language Proficiency */}
      {languages && languages.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            Language Proficiency
          </h2>
          <div className="space-y-1 text-[11px] text-slate-700">
            {languages.map((l) => (
              <p key={l.id || l.language}>
                • <strong>{l.language}:</strong> {l.proficiency}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 8. References */}
      {references && references.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
            style={{ color: primary, borderColor: `${primary}50` }}
          >
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-700">
            {references.map((ref, idx) => (
              <div key={ref.id || idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <p className="font-bold text-slate-900">{ref.name}</p>
                <p className="text-slate-700">{ref.designation}</p>
                <p className="text-slate-600">{ref.company}</p>
                {ref.phone && <p className="text-slate-600 mt-1">Phone: {ref.phone}</p>}
                {ref.email && <p className="text-slate-600">Email: {ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Declaration & Signature */}
      <section className="pt-4 border-t border-slate-200">
        <p className="text-[10px] text-slate-600 italic leading-relaxed">
          {declaration.text ||
            'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'}
        </p>
        <div className="flex justify-between items-end pt-6 text-[11px]">
          <div>
            <p className="font-semibold text-slate-700">Date: {declaration.date || new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <p className="font-bold text-slate-900">{personalInfo.fullName || 'Applicant Signature'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BangladeshStandard;
