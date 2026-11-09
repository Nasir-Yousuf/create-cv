/**
 * Standard CV Data Structure and Default Templates
 * Used across Frontend live preview and Backend PDF/DOCX renderers
 */

export const INITIAL_CV_DATA = {
  title: "Professional Resume",
  templateId: "modern-minimal",
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    photo: null,
    photoStyle: "circle", // circle | square | rounded
    summary: "Results-driven Software Engineer with 6+ years of experience designing and scaling high-performance web applications and cloud architectures. Proven expertise in React, Node.js, TypeScript, and distributed systems. Passionate about engineering velocity, clean code architecture, and mentoring high-impact teams."
  },
  design: {
    primaryColor: "#4f46e5", // Indigo
    accentColor: "#0ea5e9", // Sky
    textColor: "#1e293b", // Slate 800
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "medium", // small | medium | large
    lineSpacing: "normal", // compact | normal | relaxed
    sectionSpacing: "normal", // compact | normal | relaxed
    margins: "normal", // compact | normal | wide
    pageSize: "A4", // A4 | Letter
    showPhoto: true,
    sectionOrder: [
      "summary",
      "experience",
      "skills",
      "education",
      "projects",
      "certifications",
      "languages"
    ]
  },
  experience: [
    {
      id: "exp-1",
      jobTitle: "Lead Full Stack Engineer",
      company: "CloudScale Technologies",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description: "Led core infrastructure migration to event-driven microservices architecture, serving 4M+ monthly active users.",
      highlights: [
        "Architected scalable microservices using Node.js, Express, and Redis, reducing p99 API response latencies by 42%.",
        "Spearheaded adoption of Vite & React 18, cutting production bundle size by 35% and improving Core Web Vitals score to 98.",
        "Mentored a cross-functional squad of 8 junior and mid-level software engineers across agile sprints."
      ]
    },
    {
      id: "exp-2",
      jobTitle: "Full Stack Developer",
      company: "Nexus Digital Studio",
      location: "Austin, TX",
      startDate: "2019-06",
      endDate: "2021-12",
      current: false,
      description: "Developed enterprise web apps and client portals using React, Node.js, PostgreSQL, and AWS.",
      highlights: [
        "Engineered real-time dashboard analytics with WebSockets and Chart.js, increasing daily user retention by 28%.",
        "Automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing deployment cycle times from 2 hours to 8 minutes.",
        "Integrated secure Stripe billing and multi-tenant authentication with OAuth 2.0 and JWT."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      grade: "3.85 GPA",
      description: "Dean's Honors List. Coursework: Distributed Systems, Algorithms & Data Structures, Cloud Computing."
    }
  ],
  skills: [
    { id: "skill-1", name: "JavaScript / TypeScript", level: "Expert", category: "Languages" },
    { id: "skill-2", name: "React / Next.js / Redux", level: "Expert", category: "Frontend" },
    { id: "skill-3", name: "Node.js / Express / NestJS", level: "Expert", category: "Backend" },
    { id: "skill-4", name: "MongoDB / PostgreSQL / Redis", level: "Advanced", category: "Databases" },
    { id: "skill-5", name: "Docker / Kubernetes / AWS", level: "Advanced", category: "DevOps & Cloud" },
    { id: "skill-6", name: "REST APIs & GraphQL", level: "Expert", category: "Architecture" },
    { id: "skill-7", name: "Tailwind CSS & Framer Motion", level: "Advanced", category: "Frontend" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "PulseAI - Conversational Task Automation Platform",
      link: "https://pulseai.example.com",
      github: "https://github.com/alexmorgan/pulseai",
      startDate: "2023-03",
      endDate: "2023-11",
      description: "Built an intelligent workflow automation engine powered by LLMs and asynchronous queue workers.",
      technologies: ["React", "Node.js", "Gemini API", "BullMQ", "Redis", "Tailwind CSS"]
    },
    {
      id: "proj-2",
      title: "HyperStore - Scalable E-Commerce Microservices",
      link: "https://hyperstore.example.com",
      github: "https://github.com/alexmorgan/hyperstore",
      startDate: "2022-04",
      endDate: "2022-10",
      description: "Architected end-to-end multi-currency checkout platform with high-concurrency inventory reservation.",
      technologies: ["TypeScript", "Express", "PostgreSQL", "Stripe API", "Docker"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2023-08",
      link: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Google Cloud Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "2022-11",
      link: "https://cloud.google.com/certification"
    }
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
    { id: "lang-2", language: "Spanish", proficiency: "Conversational" }
  ],
  references: [],
  customSections: []
};

export const TEMPLATES_REGISTRY = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Minimalist",
    description: "Ultra-clean layout with refined typography, balanced whitespace, and subtle indigo accent lines. Highly ATS-friendly.",
    badge: "Popular",
    isPremium: false,
    thumbnailColor: "#4f46e5",
    features: ["Single or Multi-page", "ATS Friendly", "Optional Photo", "Compact Header"]
  },
  {
    id: "executive-slate",
    name: "Executive Slate",
    category: "Executive",
    description: "Prestigious corporate design with a distinctive dark header banner, serif headings, and structured chronological timelines.",
    badge: "Recommended",
    isPremium: false,
    thumbnailColor: "#0f172a",
    features: ["Distinguished Header", "Executive Summary Focus", "Photo Supported", "Corporate Styling"]
  },
  {
    id: "ocean-split",
    name: "Ocean Split",
    category: "Modern",
    description: "Dual-column layout featuring a cool navy-tinted left sidebar for skills, contact, and education alongside an expansive work timeline.",
    badge: "Top Rated",
    isPremium: false,
    thumbnailColor: "#0284c7",
    features: ["Dual-Column", "Skill Visualizers", "Avatar Badge", "High Visual Impact"]
  },
  {
    id: "ats-classic",
    name: "ATS Classic Pure",
    category: "ATS-friendly",
    description: "Optimized specifically to pass Applicant Tracking Systems with a 100% parse rate. Standard margins and clean typography.",
    badge: "ATS 100%",
    isPremium: false,
    thumbnailColor: "#334155",
    features: ["Zero Parsing Errors", "No Columns", "Standard Heading Tags", "Recruiter Standard"]
  },
  {
    id: "creative-coral",
    name: "Creative Coral",
    category: "Creative",
    description: "Designed for designers, product managers, and creatives. Features warm coral accents, modern badges, and project highlights.",
    badge: "Creative",
    isPremium: true,
    thumbnailColor: "#f43f5e",
    features: ["Creative Accent Bars", "Portfolio Focus", "Custom Badges", "Dynamic Layout"]
  },
  {
    id: "forest-professional",
    name: "Forest Pro",
    category: "Corporate",
    description: "Deep emerald tones with clean geometric borders and prominent skill tags. Ideal for finance, consulting, and senior leadership.",
    badge: "Executive",
    isPremium: false,
    thumbnailColor: "#059669",
    features: ["Deep Emerald Theme", "Chronological Milestones", "Compact Metrics", "Formal Tone"]
  },
  {
    id: "tech-flow",
    name: "TechFlow Dark",
    category: "Modern",
    description: "Engineering-centric template with monospace accents, GitHub/tech-stack emphasis, and high-density technical skill grids.",
    badge: "Engineers",
    isPremium: false,
    thumbnailColor: "#6366f1",
    features: ["Tech Stack Tags", "GitHub & Project Links", "Code-Inspired Accent", "High Information Density"]
  },
  {
    id: "academic-elegance",
    name: "Academic Elegance",
    category: "Academic",
    description: "Scholarly serif typography, generous margins, and dedicated sections for publications, research, teaching, and education.",
    badge: "Academic",
    isPremium: false,
    thumbnailColor: "#78350f",
    features: ["Serif Typography", "Research & Education Focus", "Multi-page Scalable", "Classic Scholarly"]
  },
  {
    id: "sun-graduate",
    name: "Sun Graduate",
    category: "Student",
    description: "Optimized for college students and fresh graduates. Prioritizes education, academic projects, leadership, and internships.",
    badge: "Entry Level",
    isPremium: false,
    thumbnailColor: "#d97706",
    features: ["Education-First Order", "Projects Showcase", "Extracurriculars", "No Experience Required"]
  },
  {
    id: "breeze-compact",
    name: "Breeze Compact",
    category: "Minimalist",
    description: "One-page powerhouse with streamlined spacing and horizontal contact ribbons. Perfect for concise, high-impact profiles.",
    badge: "1-Pager",
    isPremium: false,
    thumbnailColor: "#0d9488",
    features: ["Guaranteed 1-Page Fit", "Contact Ribbon", "Compact Spacing", "Quick Scan Layout"]
  }
];

export const TEMPLATE_CATEGORIES = [
  "All",
  "Minimalist",
  "Modern",
  "Corporate",
  "Creative",
  "ATS-friendly",
  "Executive",
  "Student",
  "Academic"
];

export const FONT_OPTIONS = [
  { name: "Inter", value: "Inter", class: "font-sans" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", class: "font-display" },
  { name: "Merriweather (Serif)", value: "Merriweather", class: "font-serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono", class: "font-mono" },
  { name: "Roboto", value: "Roboto", class: "font-sans" },
  { name: "Outfit", value: "Outfit", class: "font-sans" }
];

export const COLOR_PALETTES = [
  { name: "Indigo", primary: "#4f46e5", accent: "#0ea5e9" },
  { name: "Slate Corporate", primary: "#0f172a", accent: "#64748b" },
  { name: "Emerald Forest", primary: "#059669", accent: "#10b981" },
  { name: "Ocean Blue", primary: "#0284c7", accent: "#38bdf8" },
  { name: "Rose Coral", primary: "#e11d48", accent: "#f43f5e" },
  { name: "Amber Gold", primary: "#d97706", accent: "#f59e0b" },
  { name: "Violet Luxury", primary: "#7c3aed", accent: "#a855f7" }
];

