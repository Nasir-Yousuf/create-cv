import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCVData,
  updatePersonalInfo,
  updatePersonalDetails,
  setTemplateId,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  removeSkill,
} from "../../store/cvSlice";
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  INITIAL_CV_DATA,
  TAHMIDUR_RAHMAN_CV,
  DANIEL_CARTER_CV,
} from "@shared/constants/cvDefaults.js";
import { RenderCVTemplate } from "../../templates";
import exportService from "../../services/exportService";
import paymentService from "../../services/paymentService";
import PaymentExportModal from "../../components/common/PaymentExportModal";
import {
  generateSmartBio,
  enhanceBulletPoint,
  PRESET_ROLES,
} from "../../utils/aiGenerator";
import {
  Sparkles,
  Camera,
  Download,
  FileText,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Eye,
  X,
  Upload,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  Edit3,
} from "lucide-react";
import Button from "../../components/common/Button";

const FRESHER_SAMPLE = {
  ...INITIAL_CV_DATA,
  title: "Management Trainee Resume",
  templateId: "bd-fresher-graduate",
  personalInfo: {
    fullName: "Nusrat Jahan",
    jobTitle: "Management Trainee / Business Analyst",
    email: "nusrat.jahan@email.com",
    phone: "+880 1819-234567",
    location: "Dhanmondi, Dhaka, Bangladesh",
    website: "https://nusratjahan.me",
    linkedin: "linkedin.com/in/nusratjahan",
    github: "",
    photo: null,
    photoStyle: "portrait",
    summary:
      "High-achieving BBA graduate from IBA, University of Dhaka, with strong analytical acumen, team leadership experience in national business competitions, and excellent communication skills. Eager to contribute strategic problem-solving to corporate operations and marketing strategy.",
  },
  personalDetails: {
    fatherName: "Kazi Anwar Hossain",
    motherName: "Syeda Yasmin",
    dob: "12/04/2001",
    gender: "Female",
    maritalStatus: "Single",
    nationality: "Bangladeshi",
    nid: "20012692518000456",
    religion: "Islam",
    bloodGroup: "O+",
    permanentAddress:
      "House 18, Road 5, Sector 4, Uttara, Dhaka-1230, Bangladesh",
    presentAddress: "House 45, Road 8/A, Dhanmondi, Dhaka-1209, Bangladesh",
  },
  education: [
    {
      id: "edu-f1",
      institution:
        "Institute of Business Administration (IBA), University of Dhaka",
      degree: "Bachelor of Business Administration (BBA)",
      fieldOfStudy: "Finance & Marketing",
      startDate: "2020",
      endDate: "2024",
      grade: "CGPA 3.86 out of 4.00",
      description:
        "Dean's Honor List for 6 consecutive semesters. Champion at Battle of Minds 2023.",
    },
    {
      id: "edu-f2",
      institution: "Holy Cross College, Dhaka",
      degree: "Higher Secondary Certificate (HSC)",
      fieldOfStudy: "Business Studies",
      startDate: "2018",
      endDate: "2020",
      grade: "GPA 5.00 out of 5.00",
      description: "Dhaka Board. General Board Scholarship.",
    },
    {
      id: "edu-f3",
      institution: "Viqarunnisa Noon School & College, Dhaka",
      degree: "Secondary School Certificate (SSC)",
      fieldOfStudy: "Science",
      startDate: "2016",
      endDate: "2018",
      grade: "GPA 5.00 out of 5.00",
      description: "Dhaka Board. Golden GPA-5.",
    },
  ],
  experience: [
    {
      id: "exp-f1",
      jobTitle: "Business Strategy Intern",
      company: "Unilever Bangladesh Ltd.",
      location: "Gulshan, Dhaka",
      startDate: "2023-06",
      endDate: "2023-09",
      current: false,
      description:
        "Conducted retail channel market research across 12 distributor points in Dhaka metro.",
      highlights: [
        "Analyzed FMCG consumer purchasing patterns using SPSS and advanced Excel pivot models.",
        "Delivered executive presentation on digital distributor restocking to brand director.",
      ],
    },
  ],
  skills: [
    {
      id: "s-f1",
      name: "Financial Modeling & Valuation",
      level: "Advanced",
      category: "Finance",
    },
    {
      id: "s-f2",
      name: "MS Excel (VLOOKUP, Macros, Pivots)",
      level: "Expert",
      category: "Office",
    },
    {
      id: "s-f3",
      name: "PowerPoint & Executive Pitching",
      level: "Expert",
      category: "Communication",
    },
    {
      id: "s-f4",
      name: "Market Research & SPSS",
      level: "Advanced",
      category: "Analytics",
    },
    {
      id: "s-f5",
      name: "English (IELTS 8.0)",
      level: "Expert",
      category: "Language",
    },
  ],
};

const BLANK_SAMPLE = {
  ...INITIAL_CV_DATA,
  title: "My Professional Resume",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "+880 ",
    location: "Dhaka, Bangladesh",
    website: "",
    linkedin: "",
    github: "",
    photo: null,
    photoStyle: "portrait",
    summary: "",
  },
  personalDetails: {
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Bangladeshi",
    nid: "",
    religion: "Islam",
    bloodGroup: "B+",
    permanentAddress: "",
    presentAddress: "",
  },
  education: [
    {
      id: "edu-b1",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    },
  ],
  experience: [
    {
      id: "exp-b1",
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: true,
      description: "",
      highlights: [],
    },
  ],
  skills: [],
};

export const QuickCVWizard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cvData = useSelector(
    (state) => state.cv.currentCV || state.cv.present || {},
  );
  const { user } = useSelector((state) => state.auth);

  const [activeCategory, setActiveCategory] = useState("All");
  const [downloadingTemplateId, setDownloadingTemplateId] = useState(null);
  const [downloadType, setDownloadType] = useState(null); // 'pdf' | 'docx'
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [showBDDetails, setShowBDDetails] = useState(true);
  const [fullscreenPreview, setFullscreenPreview] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingExportType, setPendingExportType] = useState("pdf");
  const [pendingExportTemplate, setPendingExportTemplate] = useState(null);
  const [showSampleInInputs, setShowSampleInInputs] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const previewScaleFactor = Math.min(
    0.85,
    Math.max(0.25, (windowWidth - 48) / 794),
  );

  // Default sample strings that should NOT force user to backspace or delete from form inputs
  const SAMPLE_DUMMY_STRINGS = new Set([
    "Tahmidur Rahman Dipto",
    "Tahmidur Rahman",
    "Daniel Carter",
    "Senior Software Engineer / Project Coordinator",
    "Senior Software Engineer",
    "tahmid.rahman@email.com",
    "daniel.carter@example.com",
    "+880 1712-345678",
    "+1 (555) 123-4567",
    "Gulshan-2, Dhaka, Bangladesh",
    "San Francisco, CA",
    "linkedin.com/in/tahmidrahman",
    "linkedin.com/in/danielcarter",
    "https://linkedin.com/in/tahmidrahman",
    "Md. Abdur Rahman",
    "Begum Rokeya Sultana",
    "19962692518000123",
    "15/10/1996",
    "Vill: Shantinagar, P.O: Shantinagar, Upazila: Mirpur, Dist: Kushtia, Bangladesh",
    "House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh",
    "Detail-oriented IT Professional with strong problem-solving skills and a solid academic background in Computer Science & Engineering. Experienced in architecting RESTful APIs, cloud containerization, and modern CI/CD delivery pipelines.",
    "Passionate Senior Software Engineer with 5+ years of experience in building scalable web applications. Skilled in modern technologies and delivering innovative solutions that make an impact.",
    "University of Dhaka",
    "University of California",
    "Bachelor of Science in CSE",
    "Bachelor of Science in Computer Science",
    "Computer Science & Engineering",
    "Computer Science",
    "CGPA 3.85 out of 4.00",
    "3.85 GPA",
    "Graduated with Honors. Dean's Honor List.",
    "TechCorp Bangladesh Ltd.",
    "TechCorp Inc.",
    "InnovateLabs Ltd.",
    "InnovateLabs",
  ]);

  // Clean empty input value for user if it's currently holding a dummy template string
  const getInputValue = (val) => {
    if (showSampleInInputs) return val || "";
    if (!val || SAMPLE_DUMMY_STRINGS.has(val)) return "";
    return val;
  };

  // Get complete, rich CV Data for template preview card or export
  const getTemplateCVData = (template) => {
    if (!template) return cvData;
    const isBD =
      template.category === "Bangladesh Standard" ||
      template.id?.startsWith("bd-");
    const fallback = isBD ? TAHMIDUR_RAHMAN_CV : DANIEL_CARTER_CV;

    const userPersonalInfo = { ...cvData.personalInfo };
    const userPersonalDetails = { ...cvData.personalDetails };

    return {
      ...fallback,
      ...cvData,
      templateId: template.id,
      personalInfo: {
        ...fallback.personalInfo,
        ...userPersonalInfo,
        fullName:
          userPersonalInfo.fullName && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.fullName)
            ? userPersonalInfo.fullName
            : fallback.personalInfo.fullName,
        jobTitle:
          userPersonalInfo.jobTitle && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.jobTitle)
            ? userPersonalInfo.jobTitle
            : fallback.personalInfo.jobTitle,
        email:
          userPersonalInfo.email && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.email)
            ? userPersonalInfo.email
            : fallback.personalInfo.email,
        phone:
          userPersonalInfo.phone && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.phone)
            ? userPersonalInfo.phone
            : fallback.personalInfo.phone,
        location:
          userPersonalInfo.location && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.location)
            ? userPersonalInfo.location
            : fallback.personalInfo.location,
        summary:
          userPersonalInfo.summary && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.summary)
            ? userPersonalInfo.summary
            : fallback.personalInfo.summary,
        photo: userPersonalInfo.photo || fallback.personalInfo.photo,
        linkedin:
          userPersonalInfo.linkedin && !SAMPLE_DUMMY_STRINGS.has(userPersonalInfo.linkedin)
            ? userPersonalInfo.linkedin
            : fallback.personalInfo.linkedin,
      },
      personalDetails: {
        ...fallback.personalDetails,
        ...userPersonalDetails,
        fatherName:
          userPersonalDetails.fatherName && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.fatherName)
            ? userPersonalDetails.fatherName
            : fallback.personalDetails?.fatherName,
        motherName:
          userPersonalDetails.motherName && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.motherName)
            ? userPersonalDetails.motherName
            : fallback.personalDetails?.motherName,
        nid:
          userPersonalDetails.nid && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.nid)
            ? userPersonalDetails.nid
            : fallback.personalDetails?.nid,
        dob:
          userPersonalDetails.dob && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.dob)
            ? userPersonalDetails.dob
            : fallback.personalDetails?.dob,
        permanentAddress:
          userPersonalDetails.permanentAddress && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.permanentAddress)
            ? userPersonalDetails.permanentAddress
            : fallback.personalDetails?.permanentAddress,
        presentAddress:
          userPersonalDetails.presentAddress && !SAMPLE_DUMMY_STRINGS.has(userPersonalDetails.presentAddress)
            ? userPersonalDetails.presentAddress
            : fallback.personalDetails?.presentAddress,
      },
      experience:
        cvData.experience &&
        cvData.experience.length > 0 &&
        cvData.experience.some(
          (e) =>
            (e.jobTitle && !SAMPLE_DUMMY_STRINGS.has(e.jobTitle)) ||
            (e.company && !SAMPLE_DUMMY_STRINGS.has(e.company)),
        )
          ? cvData.experience
          : fallback.experience,
      education:
        cvData.education &&
        cvData.education.length > 0 &&
        cvData.education.some(
          (e) =>
            (e.degree && !SAMPLE_DUMMY_STRINGS.has(e.degree)) ||
            (e.institution && !SAMPLE_DUMMY_STRINGS.has(e.institution)),
        )
          ? cvData.education
          : fallback.education,
      skills:
        cvData.skills && cvData.skills.length > 0
          ? cvData.skills
          : fallback.skills,
      projects:
        cvData.projects && cvData.projects.length > 0
          ? cvData.projects
          : fallback.projects,
      certifications:
        cvData.certifications && cvData.certifications.length > 0
          ? cvData.certifications
          : fallback.certifications,
      languages:
        cvData.languages && cvData.languages.length > 0
          ? cvData.languages
          : fallback.languages,
      references:
        cvData.references && cvData.references.length > 0
          ? cvData.references
          : fallback.references,
      declaration:
        cvData.declaration?.signedBy && !SAMPLE_DUMMY_STRINGS.has(cvData.declaration.signedBy)
          ? cvData.declaration
          : fallback.declaration,
      design: {
        ...fallback.design,
        ...cvData.design,
        primaryColor:
          template.thumbnailColor ||
          cvData.design?.primaryColor ||
          fallback.design?.primaryColor,
      },
    };
  };

  const personalInfo = cvData.personalInfo || {};
  const personalDetails = cvData.personalDetails || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];

  // Filter templates
  const filteredTemplates = TEMPLATES_REGISTRY.filter((t) => {
    if (activeCategory === "All") return true;
    return t.category === activeCategory;
  });

  // Handle Image Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please choose an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(updatePersonalInfo({ photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Bio Generation
  const handleGenerateBio = async (preset = null) => {
    setIsGeneratingBio(true);
    try {
      // Use our fast, intelligent role-aware bio generator
      setTimeout(() => {
        const generated = generateSmartBio(
          personalInfo.jobTitle,
          education,
          experience,
          preset,
        );
        dispatch(updatePersonalInfo({ summary: generated }));
        setIsGeneratingBio(false);
      }, 350);
    } catch (err) {
      setIsGeneratingBio(false);
    }
  };

  // Execute One-click PDF download
  const executeDownloadPDF = async (template) => {
    try {
      setDownloadingTemplateId(template.id);
      setDownloadType("pdf");
      const targetCVData = getTemplateCVData(template);

      // Query template container element if mounted on screen
      const cardEl = document.getElementById(`preview-sheet-${template.id}`);
      const sheetEl = cardEl
        ? cardEl.querySelector("#cv-export-sheet") || cardEl
        : null;
      const html = sheetEl ? sheetEl.outerHTML : "";

      const blob = await exportService.exportPDF(targetCVData, html);
      if (blob?.type === "application/json") {
        const text = await blob.text();
        const json = JSON.parse(text);
        throw new Error(json.message || "Export error");
      }
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${(targetCVData.personalInfo?.fullName || "Resume").replace(/\s+/g, "_")}_${template.id}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Download error:", error);
      alert(
        'Failed to generate PDF. You can also click "Customize & Edit" to download from the editor.',
      );
    } finally {
      setDownloadingTemplateId(null);
      setDownloadType(null);
    }
  };

  // PDF download with bKash 10 Tk / Coupon Check
  const handleDownloadPDF = async (template) => {
    if (!paymentService.isExportUnlocked(user)) {
      setPendingExportTemplate(template);
      setPendingExportType("pdf");
      setPaymentModalOpen(true);
      return;
    }
    executeDownloadPDF(template);
  };

  // Execute One-click DOCX download
  const executeDownloadDOCX = async (template) => {
    try {
      setDownloadingTemplateId(template.id);
      setDownloadType("docx");
      const targetCVData = getTemplateCVData(template);

      const blob = await exportService.exportDOCX(targetCVData);
      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${(targetCVData.personalInfo?.fullName || "Resume").replace(/\s+/g, "_")}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("DOCX download error:", error);
      alert("Failed to generate DOCX document.");
    } finally {
      setDownloadingTemplateId(null);
      setDownloadType(null);
    }
  };

  // DOCX download with bKash 10 Tk / Coupon Check
  const handleDownloadDOCX = async (template) => {
    if (!paymentService.isExportUnlocked(user)) {
      setPendingExportTemplate(template);
      setPendingExportType("docx");
      setPaymentModalOpen(true);
      return;
    }
    executeDownloadDOCX(template);
  };

  // Open full editor with selected template
  const handleCustomize = (templateId) => {
    const tmpl = TEMPLATES_REGISTRY.find((t) => t.id === templateId) || { id: templateId };
    const cvToLoad = getTemplateCVData(tmpl);
    dispatch(setCVData(cvToLoad));
    dispatch(setTemplateId(templateId));
    navigate("/builder");
  };

  // Popular quick skill suggestions
  const QUICK_SKILLS = [
    "MS Office (Word, Excel)",
    "English Communication",
    "JavaScript",
    "React",
    "Python",
    "Node.js",
    "Financial Analysis",
    "Project Management",
    "Data Analysis",
    "Team Leadership",
  ];

  const handleToggleQuickSkill = (skillName) => {
    const exists = skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase(),
    );
    if (exists) {
      const idx = skills.findIndex(
        (s) => s.name.toLowerCase() === skillName.toLowerCase(),
      );
      if (idx !== -1) dispatch(removeSkill(idx));
    } else {
      dispatch(
        addSkill({
          id: `skill-${Date.now()}`,
          name: skillName,
          level: "Expert",
          category: "General",
        }),
      );
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    dispatch(
      addSkill({
        id: `skill-${Date.now()}`,
        name: newSkillInput.trim(),
        level: "Advanced",
        category: "Custom",
      }),
    );
    setNewSkillInput("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Header: Sleek ResumeCraft Desktop Aesthetic */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>
            Effortless Professional CV Builder • Instant Preview & 1-Click
            Export
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Enter Your Details Once. Get{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            50+ Styled CVs Instantly.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Fill in your details below or launch our full desktop editor. Your CV
          automatically renders across 50+ recruiter-approved styles—including
          Bangladesh BDJobs standards and modern dual-column layouts.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/builder")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Launch Full macOS Editor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("quick-creator-card");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center"
          >
            ⚡ Quick Form Creator
          </button>
        </div>
      </div>

      {/* 2. Primary Feature: Quick Input Form (Apple Native Style) */}
      <div
        id="quick-creator-card"
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl rounded-2xl p-4 sm:p-8 mb-10 sm:mb-16"
      >
        <div className="space-y-8">
          {/* Section A: Photo & Key Personal Details */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">
                  1
                </span>
                Personal Information & Portrait Photo
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSampleInInputs(true);
                    dispatch(setCVData({ ...TAHMIDUR_RAHMAN_CV }));
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 transition-colors cursor-pointer"
                  title="Fill with sample data to preview"
                >
                  Load Sample Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSampleInInputs(false);
                    dispatch(setCVData({ ...BLANK_SAMPLE }));
                  }}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Clear all fields"
                >
                  Clear Form
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Portrait Photo Uploader */}
              <div className="lg:col-span-3 flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative cursor-pointer w-32 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden shadow-sm transition-all"
                  title="Click to upload portrait photo"
                >
                  {personalInfo.photo ? (
                    <>
                      <img
                        src={personalInfo.photo}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity">
                        <Upload className="w-5 h-5 mb-1" />
                        <span>Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                      <Camera className="w-7 h-7 mx-auto mb-1 text-slate-400 group-hover:text-emerald-500" />
                      <span className="text-[11px] font-semibold block text-slate-700 dark:text-slate-300">
                        Passport Photo
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        35×45mm ratio
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    {personalInfo.photo ? "Change" : "Upload Photo"}
                  </button>
                  {personalInfo.photo && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(updatePersonalInfo({ photo: null }))
                        }
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Name, Title, Contact Inputs */}
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalInfo.fullName)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ fullName: e.target.value }))
                    }
                    placeholder="e.g. Tahmidur Rahman"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Target Designation{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalInfo.jobTitle)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ jobTitle: e.target.value }))
                    }
                    placeholder="e.g. Senior Software Engineer / Bank Officer"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={getInputValue(personalInfo.email)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ email: e.target.value }))
                    }
                    placeholder="e.g. tahmid.rahman@email.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (BD / International)
                  </label>
                  <input
                    type="tel"
                    value={getInputValue(personalInfo.phone)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ phone: e.target.value }))
                    }
                    placeholder="e.g. +880 1712-345678"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Present Address / City
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalInfo.location)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ location: e.target.value }))
                    }
                    placeholder="e.g. Banani, Dhaka, Bangladesh"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn / Portfolio (Optional)
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalInfo.linkedin)}
                    onChange={(e) =>
                      dispatch(updatePersonalInfo({ linkedin: e.target.value }))
                    }
                    placeholder="e.g. linkedin.com/in/tahmidrahman"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Bio & Career Objective with AI Generation */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  2
                </span>
                Career Objective / Professional Summary
              </h2>

              {/* Glowing AI Bio Button */}
              <button
                type="button"
                onClick={() => handleGenerateBio()}
                disabled={isGeneratingBio}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${isGeneratingBio ? "animate-spin" : ""}`}
                />
                <span>
                  {isGeneratingBio
                    ? "Crafting Bio..."
                    : "✨ Generate Bio with AI"}
                </span>
              </button>
            </div>

            {/* Quick 1-click Preset Selector */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-medium text-slate-500">
                Quick Bio Presets:
              </span>
              {PRESET_ROLES.slice(0, 4).map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleGenerateBio(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
                >
                  + {preset.role.split("/")[0]}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={getInputValue(personalInfo.summary)}
              onChange={(e) =>
                dispatch(updatePersonalInfo({ summary: e.target.value }))
              }
              placeholder="Click 'Generate Bio with AI' or type your career objective here..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>

          {/* Section C: Education (BD Table / Academic Format) */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  3
                </span>
                Academic Qualifications (SSC, HSC, Degree)
              </h2>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    addEducation({
                      id: `edu-${Date.now()}`,
                      degree: "Degree / Certificate",
                      institution: "University / Board",
                      fieldOfStudy: "Field / Major",
                      startDate: "",
                      endDate: "2024",
                      grade: "CGPA 3.80",
                    }),
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree / Exam
              </button>
            </div>

            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 items-center"
                >
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={getInputValue(edu.degree)}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({
                            index: idx,
                            data: { degree: e.target.value },
                          }),
                        )
                      }
                      placeholder="Exam / Degree (e.g. B.Sc. / HSC)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={getInputValue(edu.institution)}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({
                            index: idx,
                            data: { institution: e.target.value },
                          }),
                        )
                      }
                      placeholder="Institution / Board (e.g. Dhaka University)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={getInputValue(edu.fieldOfStudy)}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({
                            index: idx,
                            data: { fieldOfStudy: e.target.value },
                          }),
                        )
                      }
                      placeholder="Major (e.g. Science / CSE)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={getInputValue(edu.grade)}
                      onChange={(e) =>
                        dispatch(
                          updateEducation({
                            index: idx,
                            data: { grade: e.target.value },
                          }),
                        )
                      }
                      placeholder="Result (e.g. CGPA 3.82)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => dispatch(removeEducation(idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove Degree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section D: Work Experience */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                  4
                </span>
                Employment History
              </h2>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    addExperience({
                      id: `exp-${Date.now()}`,
                      jobTitle: "Job Title",
                      company: "Company Name",
                      location: "Dhaka",
                      startDate: "2022",
                      endDate: "Present",
                      current: true,
                      description: "Key responsibilities and achievements...",
                    }),
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={getInputValue(exp.jobTitle)}
                        onChange={(e) =>
                          dispatch(
                            updateExperience({
                              index: idx,
                              data: { jobTitle: e.target.value },
                            }),
                          )
                        }
                        placeholder="Job Title"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={getInputValue(exp.company)}
                        onChange={(e) =>
                          dispatch(
                            updateExperience({
                              index: idx,
                              data: { company: e.target.value },
                            }),
                          )
                        }
                        placeholder="Company Name"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={`${exp.startDate || ""} – ${exp.current ? "Present" : exp.endDate || ""}`}
                        onChange={(e) => {
                          const parts = e.target.value.split("–");
                          dispatch(
                            updateExperience({
                              index: idx,
                              data: {
                                startDate: parts[0]?.trim(),
                                endDate: parts[1]?.trim(),
                              },
                            }),
                          );
                        }}
                        placeholder="2021 – Present"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => dispatch(removeExperience(idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.description || ""}
                      onChange={(e) =>
                        dispatch(
                          updateExperience({
                            index: idx,
                            data: { description: e.target.value },
                          }),
                        )
                      }
                      placeholder="Brief description of your daily responsibilities..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const enhanced = enhanceBulletPoint(
                          exp.description,
                          exp.jobTitle,
                        );
                        dispatch(
                          updateExperience({
                            index: idx,
                            data: { description: enhanced },
                          }),
                        );
                      }}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      title="AI Polish description"
                    >
                      <Sparkles className="w-3 h-3" /> Enhance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section E: Skills & Competencies */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                5
              </span>
              Key Skills & Competencies
            </h2>

            {/* Quick 1-click toggle chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_SKILLS.map((qs) => {
                const isSelected = skills.some(
                  (s) => s.name.toLowerCase() === qs.toLowerCase(),
                );
                return (
                  <button
                    key={qs}
                    type="button"
                    onClick={() => handleToggleQuickSkill(qs)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{qs}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom skill input */}
            <form
              onSubmit={handleAddCustomSkill}
              className="flex gap-2 max-w-md"
            >
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type custom skill (e.g. AutoCAD, Docker)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* Section F: Optional BD Recruiter Details Accordion */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowBDDetails(!showBDDetails)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇧🇩</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Bangladeshi Recruiter Details (BDJobs / Bank Standard)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Father/Mother's name, DOB, NID, Blood Group, Permanent
                    Address & References
                  </span>
                </div>
              </div>
              {showBDDetails ? (
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {showBDDetails && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalDetails.fatherName)}
                    onChange={(e) =>
                      dispatch(
                        updatePersonalDetails({ fatherName: e.target.value }),
                      )
                    }
                    placeholder="e.g. Md. Abdur Rahman"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalDetails.motherName)}
                    onChange={(e) =>
                      dispatch(
                        updatePersonalDetails({ motherName: e.target.value }),
                      )
                    }
                    placeholder="e.g. Begum Rokeya Sultana"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth (DD/MM/YYYY)
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalDetails.dob)}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ dob: e.target.value }))
                    }
                    placeholder="e.g. 15/10/1996"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National ID (NID)
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalDetails.nid)}
                    onChange={(e) =>
                      dispatch(updatePersonalDetails({ nid: e.target.value }))
                    }
                    placeholder="e.g. 19962692518000123"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={personalDetails.bloodGroup || "B+"}
                    onChange={(e) =>
                      dispatch(
                        updatePersonalDetails({ bloodGroup: e.target.value }),
                      )
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={personalDetails.religion || "Islam"}
                    onChange={(e) =>
                      dispatch(
                        updatePersonalDetails({ religion: e.target.value }),
                      )
                    }
                    placeholder="e.g. Islam / Hinduism / Christianity"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    value={getInputValue(personalDetails.permanentAddress)}
                    onChange={(e) =>
                      dispatch(
                        updatePersonalDetails({
                          permanentAddress: e.target.value,
                        }),
                      )
                    }
                    placeholder="e.g. Vill: Shantinagar, P.O: Mirpur, Dist: Kushtia, Bangladesh"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Real-Time Multi-Template Showcase: "Your Generated CVs" */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Your Generated CVs
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {filteredTemplates.length} Styles Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any design below. One-click download genuine PDF or Word
              DOCX with your details and portrait photo.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {category === "Bangladesh Standard"
                  ? "🇧🇩 BD Standard"
                  : category}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid of Live Rendered CV Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const isDownloadingThis = downloadingTemplateId === template.id;
            const templateCVData = getTemplateCVData(template);

            return (
              <div
                key={template.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Header bar with Template Name & Badge */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: template.thumbnailColor }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {template.name}
                    </h3>
                  </div>
                  {template.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Scaled Live Sheet Preview Container */}
                <div
                  className="relative h-[380px] bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-start justify-center pt-3 cursor-pointer group"
                  onClick={() => setFullscreenPreview(template)}
                  title="Click to view full preview"
                >
                  <div
                    id={`preview-sheet-${template.id}`}
                    className="w-[794px] origin-top pointer-events-none select-none transition-transform group-hover:scale-[0.37]"
                    style={{ transform: "scale(0.35)" }}
                  >
                    <RenderCVTemplate cvData={templateCVData} scale={1} />
                  </div>

                  {/* Hover Overlay with Preview Icon */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Preview Fullscreen
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 space-y-2 mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Instant PDF Download */}
                    <button
                      type="button"
                      disabled={isDownloadingThis}
                      onClick={() => handleDownloadPDF(template)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {isDownloadingThis && downloadType === "pdf"
                          ? "Exporting..."
                          : "PDF"}
                      </span>
                    </button>

                    {/* Instant DOCX Download */}
                    <button
                      type="button"
                      disabled={isDownloadingThis}
                      onClick={() => handleDownloadDOCX(template)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        {isDownloadingThis && downloadType === "docx"
                          ? "Exporting..."
                          : "Word"}
                      </span>
                    </button>
                  </div>

                  {/* Customize in Full Editor */}
                  <button
                    type="button"
                    onClick={() => handleCustomize(template.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Customize & Drag-and-Drop Edit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fullscreen Preview Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header: Title + Close */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  {fullscreenPreview.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {fullscreenPreview.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFullscreenPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Body: Responsive Scaled A4 Document */}
            <div className="flex-1 overflow-auto p-2 sm:p-6 bg-slate-100 dark:bg-slate-950 flex justify-center items-start">
              <div
                className="shrink-0 origin-top shadow-2xl rounded bg-white my-2"
                style={{
                  width: `${Math.round(794 * previewScaleFactor)}px`,
                  minHeight: `${Math.round(1123 * previewScaleFactor)}px`,
                }}
              >
                <div
                  style={{
                    width: "794px",
                    minHeight: "1123px",
                    transform: `scale(${previewScaleFactor})`,
                    transformOrigin: "top left",
                  }}
                >
                  <RenderCVTemplate
                    cvData={getTemplateCVData(fullscreenPreview)}
                    scale={1}
                  />
                </div>
              </div>
            </div>

            {/* Mobile-Friendly Sticky Bottom Action Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadPDF(fullscreenPreview)}
                className="px-3.5 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadDOCX(fullscreenPreview)}
                className="px-3.5 py-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> <span>Download Word</span>
              </button>
              <button
                type="button"
                onClick={() => handleCustomize(fullscreenPreview.id)}
                className="col-span-2 sm:col-span-1 px-4 py-2.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" /> <span>Open in Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment & Export Authorization Modal */}
      <PaymentExportModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        exportType={pendingExportType}
        onSuccess={() => {
          if (pendingExportTemplate) {
            if (pendingExportType === "docx") {
              executeDownloadDOCX(pendingExportTemplate);
            } else {
              executeDownloadPDF(pendingExportTemplate);
            }
          }
        }}
      />
    </div>
  );
};

export default QuickCVWizard;
