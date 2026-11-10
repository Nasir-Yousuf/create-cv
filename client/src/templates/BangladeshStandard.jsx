import React from 'react';
import { useDispatch } from 'react-redux';
import {
  updatePersonalInfo,
  updatePersonalDetails,
  updateExperience,
  updateEducation,
  updateSkill,
  updateDeclaration,
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
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
              <EditableElement
                section="personalInfo"
                field="location"
                tag="span"
                value={personalInfo.location}
                onSave={(val) => dispatch(updatePersonalInfo({ location: val }))}
                placeholder="Present Address: House, Road, Area, Dhaka"
                className="inline"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
              <EditableElement
                section="personalInfo"
                field="phone"
                tag="span"
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
                tag="span"
                value={personalInfo.email}
                onSave={(val) => dispatch(updatePersonalInfo({ email: val }))}
                placeholder="your.email@gmail.com"
                className="inline"
              />
            </div>
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: primary }} />
                <span>linkedin.com/in/{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </div>
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
                  <div className="flex items-center gap-1.5">
                    <span>{index + 1}.</span>
                    <EditableElement
                      section="experience"
                      field="jobTitle"
                      index={index}
                      tag="span"
                      value={exp.jobTitle}
                      onSave={(val) => dispatch(updateExperience({ index, data: { jobTitle: val } }))}
                      placeholder="Job Title"
                      className="font-bold inline text-slate-900"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 font-normal flex items-center gap-1">
                    <EditableElement
                      section="experience"
                      field="startDate"
                      index={index}
                      tag="span"
                      value={exp.startDate}
                      onSave={(val) => dispatch(updateExperience({ index, data: { startDate: val } }))}
                      placeholder="Start Date"
                      className="inline"
                    />
                    <span>to</span>
                    <EditableElement
                      section="experience"
                      field="endDate"
                      index={index}
                      tag="span"
                      value={exp.current ? 'Present' : exp.endDate}
                      onSave={(val) => dispatch(updateExperience({ index, data: { endDate: val } }))}
                      placeholder="End Date"
                      className="inline"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 italic font-medium flex items-center gap-1">
                  <EditableElement
                    section="experience"
                    field="company"
                    index={index}
                    tag="span"
                    value={exp.company}
                    onSave={(val) => dispatch(updateExperience({ index, data: { company: val } }))}
                    placeholder="Company Name"
                    className="inline font-medium not-italic text-slate-800"
                  />
                  {exp.location && <span>• {exp.location}</span>}
                </div>

                <EditableElement
                  section="experience"
                  field="description"
                  index={index}
                  tag="p"
                  multiline={true}
                  value={exp.description}
                  onSave={(val) => dispatch(updateExperience({ index, data: { description: val } }))}
                  placeholder="Key responsibilities and achievements..."
                  className="text-slate-700 text-[11px] mt-0.5 block"
                />

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
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Passing Year</th>
                  <th className="border border-slate-300 px-2 py-1.5">Group / Major</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Result / CGPA</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, i) => (
                  <tr key={edu.id || i} className={i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="border border-slate-300 px-2 py-1 font-semibold">
                      <EditableElement
                        section="education"
                        field="degree"
                        index={i}
                        tag="span"
                        value={edu.degree}
                        onSave={(val) => dispatch(updateEducation({ index: i, data: { degree: val } }))}
                        placeholder="Degree / Exam"
                        className="font-semibold inline"
                      />
                    </td>
                    <td className="border border-slate-300 px-2 py-1">
                      <EditableElement
                        section="education"
                        field="institution"
                        index={i}
                        tag="span"
                        value={edu.institution}
                        onSave={(val) => dispatch(updateEducation({ index: i, data: { institution: val } }))}
                        placeholder="Institute / Board"
                        className="inline"
                      />
                    </td>
                    <td className="border border-slate-300 px-2 py-1 text-center font-mono">
                      <EditableElement
                        section="education"
                        field="endDate"
                        index={i}
                        tag="span"
                        value={edu.endDate || edu.startDate}
                        onSave={(val) => dispatch(updateEducation({ index: i, data: { endDate: val } }))}
                        placeholder="Year"
                        className="inline text-center"
                      />
                    </td>
                    <td className="border border-slate-300 px-2 py-1">
                      <EditableElement
                        section="education"
                        field="fieldOfStudy"
                        index={i}
                        tag="span"
                        value={edu.fieldOfStudy}
                        onSave={(val) => dispatch(updateEducation({ index: i, data: { fieldOfStudy: val } }))}
                        placeholder="Group / Major"
                        className="inline"
                      />
                    </td>
                    <td className="border border-slate-300 px-2 py-1 font-bold text-center">
                      <EditableElement
                        section="education"
                        field="grade"
                        index={i}
                        tag="span"
                        value={edu.grade}
                        onSave={(val) => dispatch(updateEducation({ index: i, data: { grade: val } }))}
                        placeholder="Result / CGPA"
                        className="font-bold inline text-center text-emerald-800"
                      />
                    </td>
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
            {skills.map((s, idx) => (
              <div key={s.id || idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primary }} />
                <EditableElement
                  section="skills"
                  field="name"
                  index={idx}
                  tag="span"
                  value={s.name}
                  onSave={(val) => dispatch(updateSkill({ index: idx, data: { name: val } }))}
                  placeholder="Skill name"
                  className="font-medium text-slate-800 inline"
                />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Father's Name:</strong>
            <EditableElement
              section="personalDetails"
              field="fatherName"
              tag="span"
              value={personalDetails.fatherName}
              onSave={(val) => dispatch(updatePersonalDetails({ fatherName: val }))}
              placeholder="Father's Name"
              className="inline"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Mother's Name:</strong>
            <EditableElement
              section="personalDetails"
              field="motherName"
              tag="span"
              value={personalDetails.motherName}
              onSave={(val) => dispatch(updatePersonalDetails({ motherName: val }))}
              placeholder="Mother's Name"
              className="inline"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Date of Birth:</strong>
            <EditableElement
              section="personalDetails"
              field="dob"
              tag="span"
              value={personalDetails.dob}
              onSave={(val) => dispatch(updatePersonalDetails({ dob: val }))}
              placeholder="DD/MM/YYYY"
              className="inline font-mono"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Gender:</strong>
            <EditableElement
              section="personalDetails"
              field="gender"
              tag="span"
              value={personalDetails.gender || 'Male'}
              onSave={(val) => dispatch(updatePersonalDetails({ gender: val }))}
              placeholder="Gender"
              className="inline"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Marital Status:</strong>
            <EditableElement
              section="personalDetails"
              field="maritalStatus"
              tag="span"
              value={personalDetails.maritalStatus || 'Single'}
              onSave={(val) => dispatch(updatePersonalDetails({ maritalStatus: val }))}
              placeholder="Marital Status"
              className="inline"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Nationality:</strong>
            <EditableElement
              section="personalDetails"
              field="nationality"
              tag="span"
              value={personalDetails.nationality || 'Bangladeshi'}
              onSave={(val) => dispatch(updatePersonalDetails({ nationality: val }))}
              placeholder="Nationality"
              className="inline"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">National ID (NID):</strong>
            <EditableElement
              section="personalDetails"
              field="nid"
              tag="span"
              value={personalDetails.nid}
              onSave={(val) => dispatch(updatePersonalDetails({ nid: val }))}
              placeholder="NID Number"
              className="inline font-mono"
            />
          </div>
          <div className="flex items-center gap-1">
            <strong className="text-slate-800 shrink-0">Blood Group:</strong>
            <EditableElement
              section="personalDetails"
              field="bloodGroup"
              tag="span"
              value={personalDetails.bloodGroup || 'B+'}
              onSave={(val) => dispatch(updatePersonalDetails({ bloodGroup: val }))}
              placeholder="Blood Group"
              className="inline font-bold"
            />
          </div>
          <div className="sm:col-span-2 flex items-start gap-1">
            <strong className="text-slate-800 shrink-0">Permanent Address:</strong>
            <EditableElement
              section="personalDetails"
              field="permanentAddress"
              tag="span"
              value={personalDetails.permanentAddress}
              onSave={(val) => dispatch(updatePersonalDetails({ permanentAddress: val }))}
              placeholder="Village, PO, Upazila, District, Bangladesh"
              className="inline"
            />
          </div>
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
                <EditableElement
                  section="references"
                  field="name"
                  index={idx}
                  tag="p"
                  value={ref.name}
                  onSave={(val) => {
                    const updated = [...references];
                    updated[idx] = { ...updated[idx], name: val };
                    dispatch(updatePersonalInfo({ references: updated }));
                  }}
                  placeholder="Referee Name"
                  className="font-bold text-slate-900 block"
                />
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
        <EditableElement
          section="declaration"
          field="text"
          tag="p"
          multiline={true}
          value={declaration.text}
          onSave={(val) => dispatch(updateDeclaration({ text: val }))}
          placeholder="I hereby declare that all the information provided above is true and correct..."
          className="text-[10px] text-slate-600 italic leading-relaxed block"
        />
        <div className="flex justify-between items-end pt-6 text-[11px]">
          <div>
            <span className="font-semibold text-slate-700">Date: </span>
            <EditableElement
              section="declaration"
              field="date"
              tag="span"
              value={declaration.date || new Date().toLocaleDateString('en-GB')}
              onSave={(val) => dispatch(updateDeclaration({ date: val }))}
              placeholder="DD/MM/YYYY"
              className="inline font-mono"
            />
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <EditableElement
              section="declaration"
              field="signedBy"
              tag="p"
              value={declaration.signedBy || personalInfo.fullName}
              onSave={(val) => dispatch(updateDeclaration({ signedBy: val }))}
              placeholder="Signatory Name"
              className="font-bold text-slate-900 block"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BangladeshStandard;
