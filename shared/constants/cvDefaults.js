/**
 * Standard CV Data Structure and Multi-Category Template Registry
 * Supports international and Bangladeshi recruiter formats (BDJobs standard, Corporate, Banking)
 */

export const DANIEL_CARTER_CV = {
  title: "Daniel Carter - Resume",
  templateId: "modern-blue",
  personalInfo: {
    fullName: "Daniel Carter",
    jobTitle: "Senior Software Engineer",
    email: "daniel.carter@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://danielcarter.dev",
    linkedin: "linkedin.com/in/danielcarter",
    github: "github.com/danielcarter",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle",
    summary: "Passionate Senior Software Engineer with 5+ years of experience in building scalable web applications. Skilled in modern technologies and delivering innovative solutions that make an impact."
  },
  design: {
    primaryColor: "#2563eb",
    accentColor: "#3b82f6",
    textColor: "#0f172a",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "medium",
    lineSpacing: "normal",
    sectionSpacing: "normal",
    margins: "normal",
    pageSize: "A4",
    showPhoto: true,
    photoSize: "md",
    photoPosition: "left",
    sectionOrder: ["summary", "experience", "education", "skills", "languages", "interests"]
  },
  skills: [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "AWS", level: 70 },
    { name: "UI/UX Design", level: 80 },
    { name: "Project Management", level: 75 }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Fluent" },
    { name: "French", proficiency: "Intermediate" }
  ],
  interests: ["Travel", "Photography", "Technology", "Fitness"],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Leading development of cloud-based applications and mentoring engineers.",
      highlights: [
        "Lead development of cloud-based applications",
        "Mentor junior developers",
        "Improve system performance by 40%"
      ]
    },
    {
      id: "exp-2",
      jobTitle: "Software Engineer",
      company: "InnovateLabs",
      location: "New York, NY",
      startDate: "2019",
      endDate: "2021",
      current: false,
      description: "Built responsive client portals and implemented CI/CD pipelines.",
      highlights: [
        "Developed responsive web applications",
        "Collaborated with cross-functional teams",
        "Implemented CI/CD pipelines"
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      startDate: "2015",
      endDate: "2019",
      grade: "3.85 GPA"
    }
  ],
  projects: [],
  certifications: []
};

export const TAHMIDUR_RAHMAN_CV = {
  title: "Tahmidur Rahman - Professional Resume",
  templateId: "bd-corporate-standard",
  personalInfo: {
    fullName: "Tahmidur Rahman Dipto",
    jobTitle: "Senior Software Engineer / Project Coordinator",
    email: "tahmid.rahman@email.com",
    phone: "+880 1712-345678",
    location: "Gulshan-2, Dhaka, Bangladesh",
    website: "https://tahmidrahman.dev",
    linkedin: "linkedin.com/in/tahmidrahman",
    github: "github.com/tahmidrahman",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait",
    summary: "Detail-oriented IT Professional with strong problem-solving skills and a solid academic background in Computer Science & Engineering. Experienced in architecting RESTful APIs, cloud containerization, and modern CI/CD delivery pipelines."
  },
  personalDetails: {
    fatherName: "Md. Abdur Rahman",
    motherName: "Begum Rokeya Sultana",
    dob: "15/10/1996",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Bangladeshi",
    nid: "19962692518000123",
    religion: "Islam",
    bloodGroup: "B+",
    permanentAddress: "Vill: Shantinagar, P.O: Shantinagar, Upazila: Mirpur, Dist: Kushtia, Bangladesh",
    presentAddress: "House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh",
  },
  design: {
    primaryColor: "#059669",
    accentColor: "#0284c7",
    textColor: "#1e293b",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "medium",
    lineSpacing: "normal",
    sectionSpacing: "normal",
    margins: "normal",
    pageSize: "A4",
    showPhoto: true,
    photoSize: "md",
    photoPosition: "right",
    columnRatio: "33/67",
    textAlignment: "left",
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "personalDetails",
      "languages",
      "references",
      "declaration"
    ]
  },
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Bangladesh Ltd.",
      location: "Gulshan, Dhaka",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Lead development of cloud-based fintech applications and mentor junior developers.",
      highlights: [
        "Lead development of cloud-based applications",
        "Mentor junior developers",
        "Improve system performance by 40%"
      ]
    },
    {
      id: "exp-2",
      jobTitle: "Software Engineer",
      company: "InnovateLabs Ltd.",
      location: "Banani, Dhaka",
      startDate: "2019",
      endDate: "2021",
      current: false,
      description: "Developed responsive web applications and automated CI/CD pipelines.",
      highlights: [
        "Developed responsive web applications",
        "Collaborated with cross-functional teams",
        "Implemented CI/CD pipelines"
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Dhaka",
      degree: "Bachelor of Science in CSE",
      fieldOfStudy: "Computer Science & Engineering",
      location: "Dhaka, Bangladesh",
      startDate: "2015",
      endDate: "2019",
      grade: "CGPA 3.85 out of 4.00",
      description: "Graduated with Honors. Dean's Honor List."
    }
  ],
  skills: [
    { id: "skill-1", name: "React" },
    { id: "skill-2", name: "Next.js" },
    { id: "skill-3", name: "TypeScript" },
    { id: "skill-4", name: "Node.js" },
    { id: "skill-5", name: "Python" },
    { id: "skill-6", name: "AWS" },
    { id: "skill-7", name: "UI/UX Design" },
    { id: "skill-8", name: "Project Management" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "ShadhinPay - Digital Micro-Merchant Payment App",
      link: "https://shadhinpay.example.com",
      github: "https://github.com/tahmid/shadhinpay",
      startDate: "2023-01",
      endDate: "2023-09",
      description: "Built QR-based mobile financial merchant payment platform with SMS verification and automated ledger.",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Tailwind CSS"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      link: ""
    },
    {
      id: "cert-2",
      name: "Professional Scrum Master (PSM I)",
      issuer: "Scrum.org",
      date: "2022",
      link: ""
    }
  ],
  languages: [
    { id: "lang-1", name: "English", language: "English", proficiency: "Fluent" },
    { id: "lang-2", name: "Bengali", language: "Bengali", proficiency: "Native" }
  ],
  references: [
    {
      id: "ref-1",
      name: "Dr. Md. Saiful Islam",
      designation: "Professor & Chairman, Dept. of CSE",
      company: "University of Dhaka",
      phone: "+880 1819-000000",
      email: "saiful.cse@du.ac.bd"
    }
  ],
  declaration: {
    text: "I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.",
    date: new Date().toLocaleDateString('en-GB'),
    signedBy: "Tahmidur Rahman"
  },
  customSections: []
};

export const INITIAL_CV_DATA = {
  title: "Untitled Resume",
  templateId: "bd-corporate-standard",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photo: null,
    photoStyle: "portrait",
    summary: ""
  },

  // Personal details expected by Bangladesh corporate recruiters, banks, and BDJobs
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

  design: {
    primaryColor: "#059669", // Emerald Green (Bangladesh national flag green / corporate)
    accentColor: "#0284c7",
    textColor: "#1e293b",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "medium", // small | medium | large
    lineSpacing: "normal", // compact | normal | relaxed
    sectionSpacing: "normal", // compact | normal | relaxed
    margins: "normal", // compact | normal | wide
    pageSize: "A4",
    showPhoto: true,
    photoSize: "md", // sm | md | lg | xl
    photoPosition: "right", // left | center | right
    columnRatio: "33/67",
    textAlignment: "left",
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "personalDetails",
      "languages",
      "references",
      "declaration"
    ]
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
  declaration: {
    text: "I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.",
    date: new Date().toLocaleDateString('en-GB'),
    signedBy: ""
  },
  customSections: []
};

export const TEMPLATES_REGISTRY = [
  // --- MACOS REFERENCE & MODERN DESIGNS ---
  {
    id: "modern-blue",
    name: "Modern Blue",
    category: "Modern Minimal",
    description: "Featured flagship design from ResumeCraft. Two-column layout with circular profile headshot, 2-column contact grid, skill pill badges, and clean chronological experience.",
    badge: "Featured",
    isPremium: false,
    thumbnailColor: "#2563eb",
    photoFormat: "circle",
    features: ["Circular Headshot", "Two-Column Balance", "Skill Pills", "ATS Optimized"]
  },
  {
    id: "elegant-minimal",
    name: "Elegant Minimal",
    category: "Modern Minimal",
    description: "Refined dark slate accents, clean lines, and crisp typography for senior professionals and executives.",
    badge: "Minimal",
    isPremium: false,
    thumbnailColor: "#334155",
    photoFormat: "circle",
    features: ["Slate Tones", "Executive Clarity", "Skill Badges"]
  },
  {
    id: "professional",
    name: "Professional",
    category: "Classic Formal",
    description: "Timeless corporate standard with midnight blue accents and structured career achievements.",
    badge: "Formal",
    isPremium: false,
    thumbnailColor: "#0f172a",
    photoFormat: "circle",
    features: ["Formal Header", "High Readability", "Chronological"]
  },
  {
    id: "creative-design",
    name: "Creative Design",
    category: "Creative & Design",
    description: "Vibrant coral accents, asymmetric layouts, and standout typography for designers, marketers, and creators.",
    badge: "Creative",
    isPremium: false,
    thumbnailColor: "#f97316",
    photoFormat: "circle",
    features: ["Coral Accent", "Portfolio Ready", "Dynamic"]
  },
  {
    id: "clean-layout",
    name: "Clean Layout",
    category: "Modern Minimal",
    description: "Apple-inspired pure whitespace, hairline dividers, and San Francisco style typography.",
    badge: "Apple Style",
    isPremium: false,
    thumbnailColor: "#1e293b",
    photoFormat: "circle",
    features: ["Pure Whitespace", "Hairline Dividers", "Crisp Text"]
  },
  {
    id: "bold-style",
    name: "Bold Style",
    category: "Classic Formal",
    description: "Strong high-contrast headings and clear hierarchy for technical leadership.",
    badge: "Bold",
    isPremium: false,
    thumbnailColor: "#0f172a",
    photoFormat: "circle",
    features: ["High Contrast", "Strong Headers", "Leadership"]
  },
  {
    id: "simple-white",
    name: "Simple White",
    category: "Modern Minimal",
    description: "Monochrome elegance with zero distractions and maximum ATS parser compatibility.",
    badge: "Simple",
    isPremium: false,
    thumbnailColor: "#475569",
    photoFormat: "circle",
    features: ["Monochrome", "100% ATS Safe", "Clean"]
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    category: "Tech & IT",
    description: "Linear Obsidian dark mode theme for software engineers, product builders, and designers.",
    badge: "Dark",
    isPremium: false,
    thumbnailColor: "#6366f1",
    photoFormat: "circle",
    features: ["Dark Theme", "Tech Stack Focus", "Modern"]
  },
  {
    id: "minimal-blue",
    name: "Minimal Blue",
    category: "Modern Minimal",
    description: "Electric cyan and sky blue accents with light and airy structure.",
    badge: "Fresh",
    isPremium: false,
    thumbnailColor: "#0284c7",
    photoFormat: "circle",
    features: ["Sky Blue", "Modern Balance", "Compact"]
  },

  // --- BANGLADESH & BDJOBS CORPORATE STANDARDS ---
  {
    id: "bd-corporate-standard",
    name: "BD Corporate Standard (BDJobs)",
    category: "Bangladesh Standard",
    description: "The gold standard for Bangladeshi recruiters, multinationals, and Bdjobs. Features formal header, portrait passport photo on top-right, academic qualifications table, personal details, 2 references, and declaration.",
    badge: "BD Recruiter #1",
    isPremium: false,
    thumbnailColor: "#059669",
    photoFormat: "portrait",
    features: ["Portrait Passport Photo", "Academic Table (SSC/HSC/Degree)", "Personal Details Box", "References & Declaration"]
  },
  {
    id: "bd-bank-officer",
    name: "BD Banking & Finance Executive",
    category: "Bangladesh Standard",
    description: "Designed specifically for commercial banks in Bangladesh (BRAC Bank, EBL, City Bank, Sonali Bank). Structured table layout, CGPA emphasis, and formal tone.",
    badge: "Banking Standard",
    isPremium: false,
    thumbnailColor: "#0369a1",
    photoFormat: "portrait",
    features: ["Banking Grid", "CGPA Highlighting", "Portrait Photo", "Dual Academic References"]
  },
  {
    id: "bd-dhaka-executive",
    name: "Dhaka Executive Professional",
    category: "Bangladesh Standard",
    description: "Prestigious corporate CV with dual-tone green and charcoal accents, executive summary, comprehensive milestone history, and formal credentials.",
    badge: "Executive BD",
    isPremium: false,
    thumbnailColor: "#0f766e",
    photoFormat: "portrait",
    features: ["Executive Styling", "Passport Photo Frame", "BD Contact Strip", "Formal Declaration"]
  },
  {
    id: "bd-fresher-graduate",
    name: "BD University Fresh Graduate",
    category: "Bangladesh Standard",
    description: "Tailored for fresh graduates from DU, BUET, NSU, BRACU, IBA, and other universities. Highlights academic excellence, projects, internships, and extracurricular leadership.",
    badge: "Freshers / Entry",
    isPremium: false,
    thumbnailColor: "#b45309",
    photoFormat: "portrait",
    features: ["Education-First", "Academic Projects", "Extracurriculars", "Passport Photo"]
  },
  {
    id: "bd-it-engineer",
    name: "BD IT & Software Engineer",
    category: "Bangladesh Standard",
    description: "Built for Bangladeshi software engineers applying to Brain Station 23, BJIT, Enosis, and international remote teams. Highlights tech stack, projects, and academic pedigree.",
    badge: "Tech BD",
    isPremium: false,
    thumbnailColor: "#4338ca",
    photoFormat: "portrait",
    features: ["Tech Stack Matrix", "GitHub / Portfolio", "Passport Photo", "Academic Credentials"]
  },
  {
    id: "bd-medical-clinical",
    name: "BD Medical & Clinical Doctor",
    category: "Bangladesh Standard",
    description: "Tailored for BMDC-registered doctors, clinical officers, and healthcare professionals applying to BSMMU, Square, Evercare, and United Hospital.",
    badge: "Healthcare",
    isPremium: false,
    thumbnailColor: "#0d9488",
    photoFormat: "portrait",
    features: ["BMDC Registration", "Clinical Rotations", "Passport Photo", "Academic Table"]
  },
  {
    id: "bd-academic-lecturer",
    name: "BD Academic Lecturer / Faculty",
    category: "Bangladesh Standard",
    description: "Formally organized for faculty positions at public and private universities in Bangladesh. Highlighting research publications, degrees with CGPA, and department references.",
    badge: "Academic BD",
    isPremium: false,
    thumbnailColor: "#991b1b",
    photoFormat: "portrait",
    features: ["Publications", "Serif Credentials Table", "Faculty Referees", "Passport Photo"]
  },
  {
    id: "bd-corporate-navy",
    name: "BD Corporate Royal Navy",
    category: "Bangladesh Standard",
    description: "Deep royal blue corporate format for senior management and conglomerate leadership (Beximco, Square, Summit, PRAN-RFL).",
    badge: "Corporate Elite",
    isPremium: false,
    thumbnailColor: "#1e3a8a",
    photoFormat: "portrait",
    features: ["Royal Navy Palette", "Board Qualifications", "Portrait Photo", "Full BD Compliance"]
  },
  {
    id: "bd-corporate-maroon",
    name: "BD Executive Maroon",
    category: "Bangladesh Standard",
    description: "Distinguished deep maroon design popular with supply chain, manufacturing, and textile sector managers in Bangladesh.",
    badge: "Industrial BD",
    isPremium: false,
    thumbnailColor: "#881337",
    photoFormat: "portrait",
    features: ["Industrial Hierarchy", "Portrait Photo", "Dual References", "Formal Declaration"]
  },

  // --- MODERN & APPLE MINIMALIST ---
  {
    id: "apple-clean",
    name: "Apple Silicon Clean",
    category: "Modern Minimal",
    description: "Inspired by Apple's native software design. Clean SF Pro typography, generous whitespace, refined hairline dividers, and optional portrait photo.",
    badge: "Apple Design",
    isPremium: false,
    thumbnailColor: "#1e293b",
    photoFormat: "portrait",
    features: ["Minimalist Layout", "Portrait or Circle Photo", "Refined Typography", "High Readability"]
  },
  {
    id: "apple-silicon-light",
    name: "Apple Cupertino Light",
    category: "Modern Minimal",
    description: "Clean, ultra-light slate tones with subtle typography and razor-sharp margins. Flawless aesthetic simplicity.",
    badge: "Minimalist",
    isPremium: false,
    thumbnailColor: "#334155",
    photoFormat: "portrait",
    features: ["Ultra Clean", "Hairline Dividers", "Portrait Photo", "SF Style"]
  },
  {
    id: "apple-dark",
    name: "Apple Space Black",
    category: "Modern Minimal",
    description: "Deep midnight charcoal aesthetics with pure white typography and refined contrast for modern tech builders.",
    badge: "Space Black",
    isPremium: false,
    thumbnailColor: "#09090b",
    photoFormat: "portrait",
    features: ["Dark Aesthetics", "High Contrast", "Portrait Photo", "Precision Spacing"]
  },
  {
    id: "zurich-clean",
    name: "Zurich Swiss Minimal",
    category: "Modern Minimal",
    description: "Inspired by Swiss typography rules: stark geometric grids, asymmetric balance, and crisp black lettering.",
    badge: "Swiss Style",
    isPremium: false,
    thumbnailColor: "#18181b",
    photoFormat: "portrait",
    features: ["Grid Layout", "Clean Geometry", "Portrait Photo", "Timeless"]
  },
  {
    id: "nordic-minimal",
    name: "Nordic Minimalist Frost",
    category: "Modern Minimal",
    description: "Cool blue Nordic color palette with clean modern headings and spacious paragraph flow.",
    badge: "Nordic",
    isPremium: false,
    thumbnailColor: "#0284c7",
    photoFormat: "portrait",
    features: ["Frost Blue Palette", "Minimalist Clean", "Portrait Photo", "High Readability"]
  },
  {
    id: "modern-minimal",
    name: "Modern Indigo Minimal",
    category: "Modern Minimal",
    description: "Ultra-clean layout with refined typography, balanced whitespace, and subtle indigo accent lines. Highly ATS-friendly.",
    badge: "Popular",
    isPremium: false,
    thumbnailColor: "#4f46e5",
    photoFormat: "both",
    features: ["Single or Multi-page", "ATS Friendly", "Optional Photo", "Compact Header"]
  },
  {
    id: "breeze-compact",
    name: "Breeze 1-Pager",
    category: "Modern Minimal",
    description: "One-page powerhouse with streamlined spacing and horizontal contact ribbon. Perfect for concise, high-impact profiles.",
    badge: "1-Pager",
    isPremium: false,
    thumbnailColor: "#0d9488",
    photoFormat: "circle",
    features: ["Guaranteed 1-Page Fit", "Contact Ribbon", "Compact Spacing", "Quick Scan"]
  },
  {
    id: "forest-professional",
    name: "Forest Green Minimal",
    category: "Modern Minimal",
    description: "Subtle forest emerald accents with balanced typography and organized sections for natural elegance.",
    badge: "Forest Eco",
    isPremium: false,
    thumbnailColor: "#059669",
    photoFormat: "both",
    features: ["Emerald Green", "Clean Dividers", "Portrait Photo", "Compact"]
  },
  {
    id: "sun-graduate",
    name: "Sunbeam Warm Amber",
    category: "Modern Minimal",
    description: "Warm amber tones that bring energy and optimism to career starters, students, and creative freelancers.",
    badge: "Warm Sun",
    isPremium: false,
    thumbnailColor: "#d97706",
    photoFormat: "both",
    features: ["Warm Amber", "Friendly Layout", "Portrait Photo", "Youthful"]
  },

  // --- TECH & IT ---
  {
    id: "linear-dark",
    name: "Linear Obsidian",
    category: "Tech & IT",
    description: "Sleek dark theme header with high-contrast monochrome body. Perfect for tech leads, software engineers, and product builders.",
    badge: "Tech Pro",
    isPremium: false,
    thumbnailColor: "#6366f1",
    photoFormat: "portrait",
    features: ["Dark Accent", "Tech Stack Focus", "Compact Spacing", "Code-inspired"]
  },
  {
    id: "tech-flow",
    name: "TechFlow Cyan Terminal",
    category: "Tech & IT",
    description: "Monospace coding typography, terminal badges, and clean project highlights designed for DevOps and cloud architects.",
    badge: "DevOps",
    isPremium: false,
    thumbnailColor: "#06b6d4",
    photoFormat: "portrait",
    features: ["Terminal Styling", "Monospace Font", "Portrait Photo", "Cloud Stack"]
  },
  {
    id: "wall-street-fintech",
    name: "FinTech Quant Green",
    category: "Tech & IT",
    description: "High-precision layout for quantitative engineers, blockchain developers, and algorithmic traders.",
    badge: "FinTech",
    isPremium: false,
    thumbnailColor: "#10b981",
    photoFormat: "portrait",
    features: ["Quant Focus", "Metrics Badges", "Portrait Photo", "Clean Code"]
  },
  {
    id: "silicon-valley-tech",
    name: "Silicon Valley Violet",
    category: "Tech & IT",
    description: "Vibrant violet headers and modern project metric cards tailored for Silicon Valley startups and venture teams.",
    badge: "Startup Ready",
    isPremium: false,
    thumbnailColor: "#8b5cf6",
    photoFormat: "portrait",
    features: ["Startup Vibe", "Vibrant Violet", "Portrait Photo", "Metrics"]
  },

  // --- EXECUTIVE & LEADERSHIP ---
  {
    id: "executive-slate",
    name: "Executive Slate Prestige",
    category: "Executive",
    description: "Prestigious corporate design with dark header banner, serif headings, portrait photo, and structured chronological timelines.",
    badge: "Recommended",
    isPremium: false,
    thumbnailColor: "#0f172a",
    photoFormat: "portrait",
    features: ["Distinguished Header", "Executive Summary Focus", "Portrait Photo", "Corporate Styling"]
  },
  {
    id: "corporate-royal",
    name: "Royal Navy Corporate",
    category: "Executive",
    description: "Deep navy banner with gold foil accent lines. Tailored for directors, general managers, and management consultants.",
    badge: "Director Standard",
    isPremium: false,
    thumbnailColor: "#1e3a8a",
    photoFormat: "portrait",
    features: ["Royal Navy Theme", "Milestone Badges", "Formal Grid", "Portrait Photo"]
  },
  {
    id: "harvard-executive",
    name: "Harvard Crimson Executive",
    category: "Executive",
    description: "Classic crimson and serif typography inspired by Ivy League executive leadership programs and boardroom CVs.",
    badge: "Ivy Standard",
    isPremium: false,
    thumbnailColor: "#881337",
    photoFormat: "portrait",
    features: ["Crimson Banner", "Serif Hierarchy", "Portrait Photo", "Executive Board"]
  },
  {
    id: "director-standard",
    name: "Global Managing Director",
    category: "Executive",
    description: "Sleek charcoal and slate layout for C-level executives, VP of Engineering, and Board Members.",
    badge: "C-Level",
    isPremium: false,
    thumbnailColor: "#0f172a",
    photoFormat: "portrait",
    features: ["Boardroom Layout", "Strategic Summary", "Portrait Photo", "Executive Referees"]
  },

  // --- DUAL-COLUMN & MODERN SPLIT ---
  {
    id: "ocean-split",
    name: "Ocean Split Dual-Column",
    category: "Modern Minimal",
    description: "Dual-column layout featuring a cool navy left sidebar for portrait photo, contact, and skills alongside an expansive career timeline.",
    badge: "Top Rated",
    isPremium: false,
    thumbnailColor: "#0284c7",
    photoFormat: "portrait",
    features: ["Dual-Column", "Skill Visualizers", "Portrait Photo", "High Visual Impact"]
  },
  {
    id: "emerald-split",
    name: "Emerald Forest Split",
    category: "Modern Minimal",
    description: "Deep emerald sidebar with clean geometric borders and prominent skill tags. Ideal for management, healthcare, and finance.",
    badge: "Emerald Pro",
    isPremium: false,
    thumbnailColor: "#047857",
    photoFormat: "portrait",
    features: ["Emerald Sidebar", "Portrait Photo", "Structured Timeline", "Skill Meters"]
  },
  {
    id: "violet-split",
    name: "Violet Modern Split",
    category: "Creative",
    description: "Striking violet sidebar with high visual contrast for creators, marketing managers, and product leads.",
    badge: "Violet Vibe",
    isPremium: false,
    thumbnailColor: "#7c3aed",
    photoFormat: "portrait",
    features: ["Violet Sidebar", "Skill Meters", "Portrait Photo", "Portfolio"]
  },

  // --- ATS FRIENDLY 100% ---
  {
    id: "ats-classic",
    name: "ATS Pure Recruiter",
    category: "ATS Friendly",
    description: "Optimized specifically to pass Applicant Tracking Systems with a 100% parse rate. Standard margins and clean typography without complex columns.",
    badge: "ATS 100%",
    isPremium: false,
    thumbnailColor: "#000000",
    photoFormat: "none",
    features: ["Zero Parsing Errors", "No Columns", "Standard Heading Tags", "Recruiter Standard"]
  },
  {
    id: "ats-academic",
    name: "ATS Scholarly Clean",
    category: "ATS Friendly",
    description: "Scholarly serif typography, linear order, and dedicated publication / research sections for educators, scientists, and academics.",
    badge: "Academic ATS",
    isPremium: false,
    thumbnailColor: "#1e293b",
    photoFormat: "none",
    features: ["Serif Typography", "Academic Hierarchy", "Single Column", "100% ATS"]
  },
  {
    id: "academic-elegance",
    name: "Academic Classical ATS",
    category: "ATS Friendly",
    description: "Traditional academic format with classic headings, formal margin ratios, and flawless plain-text ATS parseability.",
    badge: "Classic ATS",
    isPremium: false,
    thumbnailColor: "#334155",
    photoFormat: "none",
    features: ["Traditional Format", "100% Parseable", "Linear Flow", "Full Credentials"]
  },

  // --- CREATIVE & DESIGNER ---
  {
    id: "creative-coral",
    name: "Creative Coral Studio",
    category: "Creative",
    description: "Designed for UX designers, frontend engineers, and creative directors. Features warm coral accents, portrait photo, and project showcases.",
    badge: "Creative",
    isPremium: false,
    thumbnailColor: "#f43f5e",
    photoFormat: "portrait",
    features: ["Creative Accent Bars", "Portfolio Focus", "Custom Badges", "Dynamic Layout"]
  },
  {
    id: "sunset-gradient",
    name: "Sunset Studio Warm",
    category: "Creative",
    description: "Warm sunset gradient accents with modern typography and creative skill badges.",
    badge: "Portfolio",
    isPremium: false,
    thumbnailColor: "#ea580c",
    photoFormat: "portrait",
    features: ["Warm Sunset Styling", "Portrait Photo", "Project Gallery", "Modern Badges"]
  },
  {
    id: "horizon-purple",
    name: "Horizon Purple Studio",
    category: "Creative",
    description: "Vibrant royal purple accents with modern layout cards and prominent project thumbnails.",
    badge: "Visual Art",
    isPremium: false,
    thumbnailColor: "#9333ea",
    photoFormat: "portrait",
    features: ["Purple Header", "Portfolio Grid", "Portrait Photo", "Modern Badges"]
  }
];

export const TEMPLATE_CATEGORIES = [
  "All",
  "Bangladesh Standard",
  "Modern Minimal",
  "Executive",
  "Tech & IT",
  "ATS Friendly",
  "Creative"
];

export const FONT_OPTIONS = [
  { name: "Inter (Apple Modern)", value: "Inter", class: "font-sans" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", class: "font-display" },
  { name: "Merriweather (Classic Serif)", value: "Merriweather", class: "font-serif" },
  { name: "JetBrains Mono (Tech)", value: "JetBrains Mono", class: "font-mono" },
  { name: "Outfit (Creative)", value: "Outfit", class: "font-sans" }
];

export const COLOR_PALETTES = [
  { name: "Bangladesh Emerald", primary: "#059669", accent: "#0284c7" },
  { name: "Royal Navy Blue", primary: "#1e3a8a", accent: "#38bdf8" },
  { name: "Classic Slate", primary: "#0f172a", accent: "#64748b" },
  { name: "Indigo Modern", primary: "#4f46e5", accent: "#0ea5e9" },
  { name: "Crimson Red", primary: "#dc2626", accent: "#f87171" },
  { name: "Amber Gold", primary: "#d97706", accent: "#f59e0b" },
  { name: "Teal Corporate", primary: "#0d9488", accent: "#2dd4bf" },
  { name: "Dark Graphite", primary: "#18181b", accent: "#71717a" }
];
