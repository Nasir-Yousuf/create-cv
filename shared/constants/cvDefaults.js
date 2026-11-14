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

import {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  TEMPLATE_ID_ALIASES,
  TEMPLATE_ALIAS_COLORS,
  PREFERRED_CATEGORY_ORDER,
  resolveTemplateId,
  resolveTemplateMeta,
  templateMatchesCategory,
  getDynamicCategories,
} from './templatesCatalog.js';

export const FRESHER_ONE_PAGE_CV = {
  templateId: "onepage-fresher-clean",
  title: "One-Page Graduate CV",
  design: {
    primaryColor: "#2563eb",
    accentColor: "#0ea5e9",
    textColor: "#0f172a",
    fontFamily: "Inter",
    fontSize: "medium",
    sectionSpacing: "compact",
    layout: "single-column",
    pageSize: "A4",
    showPhoto: true,
    photoSize: "md",
    sectionOrder: ["summary", "education", "experience", "projects", "skills", "certifications", "languages", "references", "declaration"]
  },
  personalInfo: {
    fullName: "Nafis Ahmed",
    jobTitle: "Junior Software Engineer & CS Graduate",
    email: "nafis.ahmed@example.com",
    phone: "+880 1712-345678",
    location: "Dhanmondi, Dhaka",
    linkedin: "linkedin.com/in/nafisahmed",
    github: "github.com/nafisahmed",
    website: "nafisahmed.dev",
    summary: "Computer Science graduate (CGPA 3.78/4.00) with hands-on internship experience building responsive React and Node.js web applications. Eager to contribute clean, maintainable code to a collaborative engineering team.",
    photo: "",
    photoStyle: "circle"
  },
  personalDetails: {
    nationality: "Bangladeshi",
    presentAddress: "Dhanmondi 15, Dhaka 1209",
    dateOfBirth: "2002-05-14"
  },
  experience: [
    {
      id: "exp-f1",
      jobTitle: "Software Engineering Intern",
      company: "Pathao Tech (Product Lab)",
      location: "Dhaka, Bangladesh",
      startDate: "Jan 2025",
      endDate: "Jun 2025",
      current: false,
      description: "Contributed to merchant dashboard features in React, TypeScript, and REST APIs.",
      highlights: [
        "Reduced checkout form validation latency by 28% across key onboarding screens.",
        "Wrote automated unit tests achieving 85% coverage for new billing utility modules."
      ]
    },
    {
      id: "exp-f2",
      jobTitle: "Undergraduate Teaching Assistant",
      company: "North South University (Dept. of ECE)",
      location: "Dhaka, Bangladesh",
      startDate: "Sep 2024",
      endDate: "Dec 2024",
      current: false,
      description: "Guided 60+ sophomore students during weekly Data Structures & Algorithms lab sessions.",
      highlights: [
        "Evaluated programming assignments and conducted review clinics before midterms."
      ]
    }
  ],
  education: [
    {
      id: "edu-f1",
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "North South University, Dhaka",
      location: "Dhaka",
      startDate: "2021",
      endDate: "2025",
      grade: "CGPA 3.78 / 4.00",
      highlights: ["Dean's Honor List recipient across 4 semesters."]
    },
    {
      id: "edu-f2",
      degree: "Higher Secondary Certificate (HSC - Science)",
      institution: "Dhaka City College",
      location: "Dhaka",
      startDate: "2018",
      endDate: "2020",
      grade: "GPA 5.00 / 5.00",
      highlights: []
    }
  ],
  skills: [
    { id: "sk-f1", name: "JavaScript / React.js", level: "Advanced", category: "Frontend" },
    { id: "sk-f2", name: "Node.js & Express", level: "Intermediate", category: "Backend" },
    { id: "sk-f3", name: "MongoDB & PostgreSQL", level: "Intermediate", category: "Database" },
    { id: "sk-f4", name: "Tailwind CSS", level: "Advanced", category: "Frontend" },
    { id: "sk-f5", name: "Git & GitHub Actions", level: "Intermediate", category: "Tools" },
    { id: "sk-f6", name: "Python & Problem Solving", level: "Advanced", category: "Core" }
  ],
  projects: [
    {
      id: "proj-f1",
      name: "CampusRide Carpool Matcher",
      role: "Full Stack Lead",
      technologies: ["React", "Node.js", "MongoDB"],
      url: "github.com/nafis/campusride",
      description: "Real-time student commute sharing app matching verified university commuters along Dhaka routes."
    },
    {
      id: "proj-f2",
      name: "SmartInvoice BD Generator",
      role: "Creator",
      technologies: ["TypeScript", "Vite", "PDFKit"],
      url: "github.com/nafis/smartinvoice",
      description: "Lightweight invoice and tax receipt builder tailored for local SMEs and freelancers."
    }
  ],
  certifications: [
    { id: "cert-f1", name: "Meta Front-End Developer Professional Certificate", issuer: "Coursera", date: "2024" },
    { id: "cert-f2", name: "ICPC Dhaka Regional Contestant", issuer: "ICPC Foundation", date: "2024" }
  ],
  languages: [
    { id: "lang-f1", name: "Bengali", proficiency: "Native" },
    { id: "lang-f2", name: "English", proficiency: "Fluent (IELTS 7.5)" }
  ],
  references: [
    {
      id: "ref-f1",
      name: "Dr. Tania Rahman",
      designation: "Associate Professor, Dept. of ECE",
      company: "North South University",
      phone: "+880 1711-000111",
      email: "tania.rahman@northsouth.edu"
    }
  ],
  declaration: {
    text: "I hereby declare that the above information is accurate to the best of my knowledge.",
    date: "",
    signedBy: "Nafis Ahmed"
  },
  customSections: []
};

export const INITIAL_CV_DATA = {
  ...FRESHER_ONE_PAGE_CV,
  title: "One-Page Resume",
};

export {
  TEMPLATES_REGISTRY,
  TEMPLATE_CATEGORIES,
  TEMPLATE_ID_ALIASES,
  TEMPLATE_ALIAS_COLORS,
  PREFERRED_CATEGORY_ORDER,
  resolveTemplateId,
  resolveTemplateMeta,
  templateMatchesCategory,
  getDynamicCategories,
};

export const FONT_OPTIONS = [
  { name: "Inter (Apple Modern)", value: "Inter", class: "font-sans" },
  { name: "Plus Jakarta Sans (Clean Modern)", value: "Plus Jakarta Sans", class: "font-display" },
  { name: "Merriweather (Classic Serif)", value: "Merriweather", class: "font-serif" },
  { name: "Playfair Display (Executive Serif)", value: "Playfair Display", class: "font-serif" },
  { name: "Lora (Academic Book)", value: "Lora", class: "font-serif" },
  { name: "JetBrains Mono (Tech Code)", value: "JetBrains Mono", class: "font-mono" },
  { name: "Outfit (Creative Dynamic)", value: "Outfit", class: "font-sans" },
  { name: "Hind Siliguri (Bengali Clean)", value: "Hind Siliguri", class: "font-sans" }
];

export const CURATED_FONT_PAIRINGS = [
  {
    id: "modern-tech",
    name: "Modern Tech",
    heading: "Inter",
    body: "JetBrains Mono",
    description: "Crisp neutral headings with technical monospace accents.",
  },
  {
    id: "executive-serif",
    name: "Executive Serif",
    heading: "Merriweather",
    body: "Plus Jakarta Sans",
    description: "Authoritative editorial serif paired with clean corporate sans.",
  },
  {
    id: "clean-swiss",
    name: "Clean Swiss",
    heading: "Plus Jakarta Sans",
    body: "Inter",
    description: "High-contrast geometric titles with ultra-legible neutral body copy.",
  },
  {
    id: "academic",
    name: "Academic",
    heading: "Lora",
    body: "Inter",
    description: "Refined book serif for university, research, and formal CVs.",
  },
];

export const COLOR_PALETTES = [
  {
    name: "Slate Executive",
    primary: "#334155",
    accent: "#64748b",
    heading: "#0f172a",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#f8fafc",
    divider: "#e2e8f0",
    badge: "#f1f5f9",
  },
  {
    name: "Oxford Navy",
    primary: "#1e3a8a",
    accent: "#3b82f6",
    heading: "#0f172a",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#f0f7ff",
    divider: "#dbeafe",
    badge: "#eff6ff",
  },
  {
    name: "Emerald Corporate",
    primary: "#059669",
    accent: "#10b981",
    heading: "#064e3b",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#f0fdf4",
    divider: "#d1fae5",
    badge: "#ecfdf5",
  },
  {
    name: "Dhaka Teal",
    primary: "#0f766e",
    accent: "#14b8a6",
    heading: "#134e4a",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#f0fdfa",
    divider: "#ccfbf1",
    badge: "#e6fffa",
  },
  {
    name: "Royal Burgundy",
    primary: "#831843",
    accent: "#be185d",
    heading: "#500724",
    body: "#374151",
    bg: "#ffffff",
    sidebarBg: "#fdf2f8",
    divider: "#fce7f3",
    badge: "#fdf2f8",
  },
  {
    name: "Minimal Monochrome",
    primary: "#18181b",
    accent: "#52525b",
    heading: "#09090b",
    body: "#27272a",
    bg: "#ffffff",
    sidebarBg: "#f4f4f5",
    divider: "#e4e4e7",
    badge: "#f4f4f5",
  },
  {
    name: "Sunset Coral",
    primary: "#ea580c",
    accent: "#f97316",
    heading: "#7c2d12",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#fff7ed",
    divider: "#ffedd5",
    badge: "#fff7ed",
  },
  {
    name: "Forest Botanical",
    primary: "#15803d",
    accent: "#22c55e",
    heading: "#14532d",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#f0fdf4",
    divider: "#bbf7d0",
    badge: "#f0fdf4",
  },
  {
    name: "Cobalt Tech",
    primary: "#2563eb",
    accent: "#06b6d4",
    heading: "#1e3a8a",
    body: "#1e293b",
    bg: "#ffffff",
    sidebarBg: "#f8fafc",
    divider: "#e2e8f0",
    badge: "#eff6ff",
  },
  {
    name: "Warm Sand",
    primary: "#78350f",
    accent: "#b45309",
    heading: "#451a03",
    body: "#44403c",
    bg: "#fefdfa",
    sidebarBg: "#faf6f0",
    divider: "#f5ebd7",
    badge: "#fef3c7",
  },
  {
    name: "Deep Indigo",
    primary: "#4338ca",
    accent: "#6366f1",
    heading: "#1e1b4b",
    body: "#334155",
    bg: "#ffffff",
    sidebarBg: "#eef2ff",
    divider: "#e0e7ff",
    badge: "#e0e7ff",
  },
  {
    name: "Classic Charcoal",
    primary: "#27272a",
    accent: "#3f3f46",
    heading: "#18181b",
    body: "#3f3f46",
    bg: "#ffffff",
    sidebarBg: "#fafafa",
    divider: "#e4e4e7",
    badge: "#f4f4f5",
  },
];
