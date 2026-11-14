import { resolvePersonaForTemplate } from './personaPresets.js';

/**
 * Canonical Template Catalog, Dynamic Categories, One-Page Guidance, and Backward-Compatible Aliases.
 * Every template in TEMPLATES_REGISTRY represents a genuinely distinct layout architecture,
 * color palette, target industry, and export-tested configuration.
 */

const RAW_TEMPLATES_REGISTRY = [
  {
    "id": "onepage-fresher-clean",
    "name": "Fresh Graduate Clean",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Modern",
      "Minimal",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Purpose-built single-page A4 CV prioritizing fresh graduates and early-career applicants. Highlights education, key projects, skills pills, and concise experience with clean breathing room.",
    "badge": "1-Page Default",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-fresher-clean",
    "features": [
      "Guaranteed 1-Page Balanced Layout",
      "Education & Projects Priority",
      "Crisp Contact Strip & Skill Pills",
      "ATS-Readable Hierarchy"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 430,
      "maxExperienceItems": 2,
      "maxEducationItems": 3,
      "maxBulletsPerRole": 3,
      "tip": "Best with concise career summary (2-3 lines), top 2-3 education rows, 2 projects/internships, and up to 3 impactful bullets per role."
    }
  },
  {
    "id": "onepage-bd-compact",
    "name": "BD Graduate & Corporate 1-Page",
    "category": "Bangladesh CVs",
    "categories": [
      "One-Page CVs",
      "Bangladesh CVs",
      "Student / Fresh Graduate",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Modern Bangladeshi CV tailored to fit a crisp single A4 page. Features top-right portrait/passport photo, Career Objective, structured SSC/HSC/University table, skills, projects, and a single-line declaration.",
    "badge": "Bangladesh 1-Page",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Portrait Photo Top-Right",
      "Compact Academic CGPA Table",
      "Clean Contact & BD Context",
      "Fits Single A4 Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 2,
      "maxEducationItems": 3,
      "maxBulletsPerRole": 2,
      "tip": "Keeps Bangladeshi recruiter expectations clean on one page without extra personal trivia clutter."
    }
  },
  {
    "id": "onepage-modern-split",
    "name": "Modern Split One-Pager",
    "category": "Modern",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Professional",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Clean 30/70 two-column one-page architecture placing contact details, skills tags, certifications, and languages in a subtle tinted sidebar so experience and projects shine in the main column.",
    "badge": "Split 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "30/70 Space-Smart Split Column",
      "High Readability at 10pt Equivalent",
      "Sidebar Skill & Language Badges",
      "Zero Wasted Horizontal Space"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 470,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Two-column density lets early-career professionals fit up to 3 roles/projects cleanly on 1 A4 sheet."
    }
  },
  {
    "id": "onepage-minimal-swiss",
    "name": "Swiss Minimalist One-Page",
    "category": "Minimal",
    "categories": [
      "One-Page CVs",
      "Minimal",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Scandinavian/Apple-inspired monochrome typographic grid with left-aligned uppercase section labels and whisper-clean hairline dividers.",
    "badge": "Swiss Minimal",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#475569",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-minimal-swiss",
    "features": [
      "Left Label Grid Alignment",
      "Ultra-Clean Monochrome Palette",
      "Generous Scannability",
      "Modern Whitespace Rhythm"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 400,
      "maxExperienceItems": 2,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Keep bullets sharp (1 line each) to preserve the calm Swiss typographic whitespace."
    }
  },
  {
    "id": "onepage-tech-grid",
    "name": "Tech & Engineering Matrix",
    "category": "Technology",
    "categories": [
      "One-Page CVs",
      "Technology",
      "IT",
      "Modern",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Engineered for software developers, CS graduates, and technical roles. Features GitHub/Portfolio strip, categorized tech stack matrix, and impact-focused project & work cards.",
    "badge": "Tech 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "square",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Monospace Tech Accent Details",
      "Categorized Tech Stack Matrix",
      "Direct GitHub & Project Links",
      "High-Density Technical Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 480,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Categorize your skills (Frontend, Backend, Cloud, DB) and feature 2 top software projects with live/github URLs."
    }
  },
  {
    "id": "onepage-it-sidebar",
    "name": "IT & Cloud Engineer Sidebar",
    "category": "IT",
    "categories": [
      "One-Page CVs",
      "IT",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Dark-slate header and dedicated certifications sidebar designed for sysadmins, DevOps, cloud architects, and network engineers.",
    "badge": "Cloud & IT",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-it-sidebar",
    "features": [
      "Dark-Accented Professional Header",
      "Prominent Cloud Certifications Block",
      "Dual-Pillar Systems Layout",
      "Infrastructure Focus"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 460,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Feature AWS/GCP/Azure/Cisco certifications prominently in the left pillar."
    }
  },
  {
    "id": "onepage-ats-strict",
    "name": "ATS Ultra-Strict One-Page",
    "category": "Standard",
    "categories": [
      "One-Page CVs",
      "Standard",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered specifically to score 100% on automated Applicant Tracking Systems (Taleo, Workday, Greenhouse, Lever). Zero tables, zero columns, standard headings, pure linear parsing.",
    "badge": "100% ATS Ready",
    "isPremium": false,
    "thumbnailColor": "#374151",
    "accentColor": "#4b5563",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-ats-strict",
    "features": [
      "Pure Linear Single-Column Stream",
      "Standard Universal Header Tags",
      "Zero Graphic Columns or Icons",
      "Maximum ATS Machine Parsability"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 450,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 4,
      "tip": "The gold standard for large multinational portals. Clean text with zero formatting quirks."
    }
  },
  {
    "id": "onepage-executive-brief",
    "name": "Executive Brief & Leadership",
    "category": "Executive",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "High-impact single-page summary for senior leaders, managers, and directors. Features Core Competencies grid, executive summary, and key quantified achievements.",
    "badge": "Executive Brief",
    "isPremium": false,
    "thumbnailColor": "#78350f",
    "accentColor": "#b45309",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "Executive Competencies Matrix",
      "Metric-Driven Accomplishment Cards",
      "Distinguished Serif Accents",
      "Director-Grade Density"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 460,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Highlight metrics ($ revenue, % efficiency, team size) in the executive highlight callouts."
    }
  },
  {
    "id": "onepage-academic-compact",
    "name": "Academic & Research One-Page",
    "category": "Academic",
    "categories": [
      "One-Page CVs",
      "Academic",
      "Standard",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Structured for university teaching assistants, graduate researchers, lecturers, and academic scholarship applicants. Highlights thesis title, publications, conferences, and honours.",
    "badge": "Academic 1-Page",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "Publications & Thesis Focus",
      "Academic Awards & Honors Block",
      "Serif Typography for Scholars",
      "Conference & Research Strip"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 460,
      "maxExperienceItems": 2,
      "maxEducationItems": 3,
      "maxBulletsPerRole": 3,
      "tip": "Put education and research publications at the top; list degree supervisor and thesis title."
    }
  },
  {
    "id": "onepage-creative-editorial",
    "name": "Creative Editorial One-Pager",
    "category": "Modern",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Minimal"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Editorial layout for UI/UX designers, creative leads, copywriters, and content creators. Features warm coral typography, portfolio link banner, and visual project highlight cards.",
    "badge": "Creative 1-Page",
    "isPremium": false,
    "thumbnailColor": "#c2410c",
    "accentColor": "#ea580c",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Warm Editorial Typography",
      "Portfolio Showcase Strip",
      "Creative Project Highlights",
      "Distinctive Visual Rhythm"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 420,
      "maxExperienceItems": 2,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Include your Behance, Dribbble, or portfolio website URL; keep text engaging and outcome-oriented."
    }
  },
  {
    "id": "onepage-clinical-health",
    "name": "Clinical Healthcare & Medical Practitioner",
    "category": "Healthcare",
    "categories": [
      "One-Page CVs",
      "Healthcare",
      "Experienced Professionals",
      "International Standard",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Specialized clinical and healthcare single-page layout featuring Licensure & Registration ribbon, clinical rotations, diagnostics/procedures competencies, and ethical medical declaration.",
    "badge": "Healthcare 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-clinical-health",
    "features": [
      "Medical Licensure Banner",
      "Clinical Rotation Cards",
      "Procedures & Diagnostics Matrix",
      "Ethical Clinical Declaration"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 450,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Highlight hospital appointments, medical licensure/BMDC numbers, and procedural competencies."
    }
  },
  {
    "id": "onepage-finance-ledger",
    "name": "Finance & Accounting Ledger",
    "category": "Finance and Accounting",
    "categories": [
      "One-Page CVs",
      "Finance and Accounting",
      "Corporate",
      "Experienced Professionals",
      "International Standard"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Rigorous single-page layout tailored for financial analysts, chartered accountants, and controllers. Features professional credential ribbon (CFA/CA/ACCA), financial modeling matrix, and quantitative KPI highlights.",
    "badge": "Finance 1-Page",
    "isPremium": false,
    "thumbnailColor": "#047857",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-finance-ledger",
    "features": [
      "CFA/CA/ACCA Credential Ribbon",
      "Financial Tooling & IFRS Matrix",
      "Quantitative Metric Rows",
      "Tabular Experience Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 460,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Emphasize quantifiable achievements (e.g., $M budgets managed, % cost reduction, audit accuracy)."
    }
  },
  {
    "id": "onepage-engineering-spec",
    "name": "Engineering Specification & Blueprint",
    "category": "Engineering",
    "categories": [
      "One-Page CVs",
      "Engineering",
      "Technology",
      "Experienced Professionals",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Technical blueprint layout designed for Civil, Mechanical, Electrical, and Structural engineers. Highlights professional engineering certifications (PE/IEB), CAD/BIM tools, and detailed project specification cards.",
    "badge": "Engineering 1-Page",
    "isPremium": false,
    "thumbnailColor": "#1d4ed8",
    "accentColor": "#3b82f6",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-engineering-spec",
    "features": [
      "PE / IEB Accreditation Bar",
      "CAD/BIM & Codes Toolset",
      "Project Scope & Budget Cards",
      "Technical Precision Structure"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 450,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Specify structural codes, design software, and budget/scope metrics for key projects."
    }
  },
  {
    "id": "onepage-marketing-growth",
    "name": "Growth Marketing & Brand Strategy",
    "category": "Marketing and Sales",
    "categories": [
      "One-Page CVs",
      "Marketing and Sales",
      "Creative",
      "Modern",
      "Experienced Professionals"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "High-impact editorial layout for growth marketers, campaign directors, and sales strategists. Features key performance indicator ribbons (CAC/LTV, ROAS), campaign case study cards, and MarTech stack.",
    "badge": "Marketing 1-Page",
    "isPremium": false,
    "thumbnailColor": "#ea580c",
    "accentColor": "#f97316",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-marketing-growth",
    "features": [
      "CAC / ROAS KPI Ribbon",
      "Campaign Case Study Cards",
      "MarTech & Ad Stack Grid",
      "Editorial Split Architecture"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Lead with conversion figures, revenue impact, and growth multipliers."
    }
  },
  {
    "id": "onepage-skilled-trade-pro",
    "name": "Skilled Trade & Practical Pro",
    "category": "Experienced Professionals",
    "categories": [
      "One-Page CVs",
      "Experienced Professionals",
      "Standard",
      "International Standard"
    ],
    "isOnePage": true,
    "isFeatured": true,
    "description": "Pragmatic, high-visibility layout built for technicians, hospitality managers, retail supervisors, and skilled service workers. Highlights trade certifications, shift availability, practical skills, and direct reference contact.",
    "badge": "Trade Pro 1-Page",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-skilled-trade-pro",
    "features": [
      "Shift Availability & Work Permit Badge",
      "Trade Licensure Ribbon",
      "Hands-On Competencies First",
      "Direct Contact & Verified References"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 420,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Clearly state your certifications (OSHA, HVAC, Electrical), shift availability, and driver license status."
    }
  },
  {
    "id": "onepage-frontend-dev",
    "name": "Frontend React Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Modern",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Optimized for React, Next.js, and modern frontend developers. Features GitHub commits preview, component libraries, and live application URLs.",
    "badge": "Frontend 1P",
    "isPremium": false,
    "thumbnailColor": "#0ea5e9",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "UI Tech Stack Focus",
      "Live Project Demo URLs",
      "Component Design System Badges",
      "1-Page A4 Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-backend-node",
    "name": "Backend & Microservices Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "IT",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Node.js, Python, Go, and Java backend developers. Showcases API throughput, database schemas, and microservice architecture.",
    "badge": "Backend 1P",
    "isPremium": false,
    "thumbnailColor": "#16a34a",
    "accentColor": "#22c55e",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "API Performance Metrics",
      "Database & Caching Matrix",
      "Microservices Highlight",
      "Crisp Single-Sheet Density"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-fullstack-ts",
    "name": "Full-Stack TypeScript Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "End-to-end full-stack profile showcasing TypeScript, Next.js, Node.js, and PostgreSQL full-stack delivery on a single page.",
    "badge": "Full-Stack 1P",
    "isPremium": false,
    "thumbnailColor": "#3178c6",
    "accentColor": "#60a5fa",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "TypeScript Ecosystem Stack",
      "End-to-End Architecture",
      "Balanced 30/70 Column Flow",
      "Zero Page Spill"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-devops-cloud",
    "name": "DevOps & SRE Cloud Lead 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "IT",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for DevOps, Kubernetes, Terraform, and AWS/GCP specialists. Displays CI/CD pipelines and infrastructure uptime statistics.",
    "badge": "DevOps 1P",
    "isPremium": false,
    "thumbnailColor": "#4f46e5",
    "accentColor": "#818cf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-it-sidebar",
    "features": [
      "Cloud Certifications Bar",
      "Infrastructure as Code Focus",
      "Kubernetes / Docker Pills",
      "Dark IT Accents"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-mobile-flutter",
    "name": "Mobile App Developer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered for Flutter, iOS Swift, and Android Kotlin mobile app creators. Highlights Google Play & App Store install counts.",
    "badge": "Mobile 1P",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Play Store & App Store Links",
      "Cross-Platform Frameworks",
      "Mobile Performance Metrics",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-data-analyst",
    "name": "Data Analyst & BI Specialist 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Standard",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on SQL, Tableau, Power BI, and Python analytics. Emphasizes business KPI impact, data modeling, and automated dashboard delivery.",
    "badge": "Data Analyst 1P",
    "isPremium": false,
    "thumbnailColor": "#0891b2",
    "accentColor": "#22d3ee",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "SQL & BI Tool Matrix",
      "Business Revenue Impact",
      "Dashboard Portfolio Strip",
      "A4 Metric Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-ai-ml-engineer",
    "name": "AI & Machine Learning Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Modern",
      "Academic"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting PyTorch, LLMs, fine-tuning, vector databases, and deployed AI models with research rigor on a single sheet.",
    "badge": "AI / ML 1P",
    "isPremium": false,
    "thumbnailColor": "#7c3aed",
    "accentColor": "#a78bfa",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Model Deployment Metrics",
      "PyTorch / HuggingFace Stack",
      "AI Evaluation Benchmark",
      "Technical Paper Citations"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-cyber-security",
    "name": "Cybersecurity & InfoSec Analyst 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "IT",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Structured for SOC analysts, ethical hackers, and security engineers. Highlights CEH/CISSP certifications, vulnerability management, and incident response.",
    "badge": "CyberSec 1P",
    "isPremium": false,
    "thumbnailColor": "#991b1b",
    "accentColor": "#ef4444",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-it-sidebar",
    "features": [
      "Security Certifications Sidebar",
      "Vulnerability Remediation Stats",
      "Threat Intel & SIEM Focus",
      "High-Integrity Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-qa-automation",
    "name": "QA & Test Automation Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Optimized for Selenium, Cypress, Playwright, and test architects. Displays test coverage gains and automated regression pipeline delivery.",
    "badge": "QA Auto 1P",
    "isPremium": false,
    "thumbnailColor": "#0d9488",
    "accentColor": "#2dd4bf",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Automation Framework Matrix",
      "Test Coverage Percentage",
      "CI Pipeline Integration",
      "1-Page Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-cs-intern",
    "name": "Computer Science Student & Intern 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Entry-level template designed for university CS undergraduates seeking internships. Features academic coursework, competitive programming, and GitHub projects.",
    "badge": "CS Intern 1P",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#60a5fa",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-fresher-clean",
    "features": [
      "Coursework & GPA Focus",
      "Hackathon & Contest Badges",
      "GitHub Repository Showcase",
      "Zero Fluff Single Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-uiux-designer",
    "name": "UI/UX Product Designer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Minimal",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Modern aesthetic layout for Figma power users, design systems leads, and UX researchers with prominent portfolio URL and design process callouts.",
    "badge": "UI/UX 1P",
    "isPremium": false,
    "thumbnailColor": "#ec4899",
    "accentColor": "#f472b6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Figma Design System Focus",
      "Live Prototype & Case Study Links",
      "Clean Whitespace Rhythm",
      "Typography Centric"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-product-manager",
    "name": "Product Manager Impact 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Data-informed single-page layout for PMs and POs. Quantifies ARR growth, retention gains, sprint velocity, and cross-functional leadership.",
    "badge": "Product 1P",
    "isPremium": false,
    "thumbnailColor": "#8b5cf6",
    "accentColor": "#a78bfa",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "ARR & Retention KPI Blocks",
      "Agile Roadmap Delivery",
      "Product Discovery Metrics",
      "Executive Scannability"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-brand-designer",
    "name": "Brand & Visual Identity Designer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Minimal"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for brand identity specialists, illustrators, and visual designers with elegant font contrast and portfolio showcase ribbon.",
    "badge": "Brand Designer",
    "isPremium": false,
    "thumbnailColor": "#d97706",
    "accentColor": "#fbbf24",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Identity & Typography Hierarchy",
      "Behance / Dribbble Integration",
      "Visual Design Accents",
      "Contemporary Palette"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-graphic-designer",
    "name": "Graphic Designer Portfolio 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcases Adobe Creative Suite (Photoshop, Illustrator, InDesign), print campaigns, and digital branding with balanced creative margins.",
    "badge": "Graphic 1P",
    "isPremium": false,
    "thumbnailColor": "#e11d48",
    "accentColor": "#fb7185",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Creative Suite Competencies",
      "Campaign Impact Cards",
      "Editorial Balance",
      "Fits Single A4 Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-content-copy",
    "name": "Content Strategist & Copywriter 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Minimal",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on SEO writing, brand tone of voice, editorial calendars, and viral engagement metrics with crisp Swiss typography.",
    "badge": "Content 1P",
    "isPremium": false,
    "thumbnailColor": "#475569",
    "accentColor": "#94a3b8",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-minimal-swiss",
    "features": [
      "Editorial Metrics & Readership",
      "SEO Content Performance",
      "Brand Storytelling Callout",
      "Typographic Elegance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-video-editor",
    "name": "Motion & Video Producer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for Premiere Pro, After Effects, and DaVinci Resolve editors with YouTube/Vimeo view counts and commercial reel links.",
    "badge": "Video 1P",
    "isPremium": false,
    "thumbnailColor": "#be123c",
    "accentColor": "#f43f5e",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Showreel & Vimeo Badges",
      "Motion Graphics Toolset",
      "Viewership & Client Stats",
      "Dynamic 1-Page Contrast"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-business-analyst",
    "name": "Business Analyst & Strategy 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Structured for process re-engineering, stakeholder management, BRD/FRD documentation, and cost optimization initiatives.",
    "badge": "Business Analyst",
    "isPremium": false,
    "thumbnailColor": "#1e40af",
    "accentColor": "#60a5fa",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Process Optimization KPIs",
      "Stakeholder & BRD Matrix",
      "Structured Left Sidebar",
      "Corporate Readability"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-finance-analyst",
    "name": "Financial Planning & Analysis (FP&A) 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Executive",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for corporate finance, cash flow forecasting, budget variance, and financial modeling analysts with quantitative metrics.",
    "badge": "FP&A 1P",
    "isPremium": false,
    "thumbnailColor": "#065f46",
    "accentColor": "#34d399",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-ats-strict",
    "features": [
      "Financial Modeling Focus",
      "Budget Variance Analysis",
      "100% ATS Linear Stream",
      "Quantitative Highlights"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-investment-banking",
    "name": "Investment Banking & M&A Analyst 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Executive"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Wall Street standard single-sheet resume for valuation, DCF modeling, LBO, and deal execution with distinguished classic serif.",
    "badge": "IB / M&A 1P",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#334155",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-ats-strict",
    "features": [
      "Deal Experience Bullets",
      "Valuation & DCF Modeling",
      "Conservative Wall St Font",
      "Single Page Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-corp-accountant",
    "name": "Corporate Accountant & Tax 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on general ledger reconciliation, IFRS/GAAP standards, VAT compliance, and audit defense with structured clean tables.",
    "badge": "Accountant 1P",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "IFRS & GAAP Compliance",
      "Tax & Audit Reconciliation",
      "Clean Credentials Strip",
      "Zero Clutter A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-management-consultant",
    "name": "Management Consultant Impact 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "McKinsey/BCG style problem-solving resume focusing on corporate restructuring, strategic hypotheses, and client EBITDA expansion.",
    "badge": "Consultant 1P",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#3b82f6",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "EBITDA Growth Highlights",
      "Strategy Framework Matrix",
      "Client Engagement Scope",
      "Distinguished Typography"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-project-manager",
    "name": "Agile Project Manager (PMP) 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting PMP/Scrum certifications, on-time delivery percentages, budget governance, and multi-team resource allocation.",
    "badge": "Project Manager",
    "isPremium": false,
    "thumbnailColor": "#0369a1",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "PMP / Agile Badges",
      "Budget & Timeline Metrics",
      "Sidebar Core Competencies",
      "Clear Role Milestones"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-scrum-master",
    "name": "Scrum Master & Agile Coach 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered for CSM/PSM certified scrum masters focusing on sprint burndown, team velocity, and agile transformation leadership.",
    "badge": "Scrum Master",
    "isPremium": false,
    "thumbnailColor": "#4338ca",
    "accentColor": "#818cf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Sprint Velocity Gains",
      "Agile Ceremony Governance",
      "Certifications Showcase",
      "Crisp 1-Page Spacing"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-digital-marketing",
    "name": "Digital Marketing Performance 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Quantifying ROAS, CAC, Meta & Google Ads budgets, conversion funnels, and marketing analytics on a vibrant single sheet.",
    "badge": "Digital Mktg",
    "isPremium": false,
    "thumbnailColor": "#ea580c",
    "accentColor": "#f97316",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "ROAS & CAC Performance Badges",
      "Paid Ads Channel Mix",
      "Conversion Rate Milestones",
      "Visual Split Density"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-seo-specialist",
    "name": "SEO & Organic Growth Lead 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing organic traffic growth (+300%), technical site audits, backlink profiles, and Semrush/Ahrefs mastery on 1 page.",
    "badge": "SEO Growth",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#22c55e",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Organic Traffic Trajectory",
      "Technical SEO Toolset",
      "Core Web Vitals Focus",
      "Compact A4 Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-social-growth",
    "name": "Social Media & Community Lead 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Featuring follower growth, viral campaigns, TikTok/Instagram creator partnerships, and community engagement statistics.",
    "badge": "Social Media",
    "isPremium": false,
    "thumbnailColor": "#db2777",
    "accentColor": "#f472b6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Audience Growth Statistics",
      "Viral Campaign Highlights",
      "Content Pillar Breakdown",
      "Aesthetic Modern Accent"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-sales-executive",
    "name": "Sales & Business Development Lead 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for quota-crushing B2B sales professionals, demonstrating 120%+ quota attainment, pipeline value, and territory expansion.",
    "badge": "Sales Lead 1P",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#4ade80",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Quota Attainment Callouts",
      "Pipeline & Deal Size Metrics",
      "Key Account Relationships",
      "Executive Readability"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-account-executive",
    "name": "SaaS Account Executive (AE) 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered for B2B tech SaaS sales. Quantifies closed-won ARR, sales cycle velocity, and CRM (Salesforce/HubSpot) pipeline mastery.",
    "badge": "SaaS AE 1P",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "Closed ARR Milestones",
      "Sales Cycle Compression",
      "CRM & Tech Stack Matrix",
      "Crisp 1-Page Delivery"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-customer-success",
    "name": "Customer Success Manager (CSM) 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting net revenue retention (NRR 115%+), low churn rates, onboarding CSAT scores, and account expansion revenue.",
    "badge": "CSM 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0891b2",
    "accentColor": "#06b6d4",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "NRR & Retention Metrics",
      "CSAT & NPS Scorecards",
      "Onboarding Flow Impact",
      "Clean Split Alignment"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-pr-communications",
    "name": "PR & Corporate Communications 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Minimal"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for press spokespersons, media relations, and corporate communicators with press mentions and crisis response leadership.",
    "badge": "PR & Comms",
    "isPremium": false,
    "thumbnailColor": "#4338ca",
    "accentColor": "#6366f1",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-minimal-swiss",
    "features": [
      "Top-Tier Media Coverage",
      "Crisis Management Record",
      "Editorial Typography",
      "Balanced Swiss Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-hr-specialist",
    "name": "HR & Talent Acquisition Specialist 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating time-to-hire reduction, candidate sourcing pipelines, employer branding, and HR compliance on a tidy single page.",
    "badge": "HR & Talent",
    "isPremium": false,
    "thumbnailColor": "#9333ea",
    "accentColor": "#c084fc",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Time-to-Hire Reduction Stats",
      "Employee Retention Programs",
      "HRIS & ATS Experience",
      "Human-Centered Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-hrbp-executive",
    "name": "HR Business Partner (HRBP) 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Strategic leadership layout for HR directors focusing on organizational design, leadership development, compensation, and culture.",
    "badge": "HRBP Lead",
    "isPremium": false,
    "thumbnailColor": "#581c87",
    "accentColor": "#9333ea",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "Org Design & Culture Metrics",
      "Succession Planning Focus",
      "Executive Presence",
      "Director Density"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-operations-lead",
    "name": "Operations & Logistics Manager 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Optimized for operations directors. Highlights warehouse throughput, fulfillment SLA improvement, and cost per unit reduction.",
    "badge": "Ops Lead 1P",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "square",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "SLA & On-Time Delivery KPIs",
      "Warehouse Capacity Metrics",
      "Lean Six Sigma Principles",
      "Structured Tech Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-supply-chain",
    "name": "Supply Chain & Procurement Analyst 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing vendor negotiation savings, inventory turnover, freight optimization, and ERP (SAP/Oracle) experience on single A4.",
    "badge": "Supply Chain",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Procurement Cost Savings",
      "Vendor Scorecard Management",
      "ERP System Competencies",
      "Zero Vertical Overflow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-clinical-doctor",
    "name": "Clinical Medical Officer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Academic",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for licensed physicians and resident doctors. Details clinical rotations, emergency triage, certifications (BLS/ACLS), and patient care.",
    "badge": "Doctor 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Medical Registration Focus",
      "Clinical Rotation Badges",
      "BLS / ACLS Certifications",
      "Clean Hospital Standard"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-nursing-officer",
    "name": "Registered Staff Nurse 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for ICU/CCU and general ward staff nurses. Emphasizes patient monitoring protocols, medication administration, and clinical bedside care.",
    "badge": "Staff Nurse 1P",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#34d399",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-fresher-clean",
    "features": [
      "Patient Care Ratios",
      "ICU / Emergency Protocols",
      "Nursing Licensing Record",
      "Clear A4 Structure"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-pharma-specialist",
    "name": "Pharmaceutical Sales & QA 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Structured for pharmaceutical product executives and chemists. Details GMP standards, clinical detailing, and territory growth.",
    "badge": "Pharma 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#0ea5e9",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "GMP & Pharmacopeia Standard",
      "Prescription Share Growth",
      "Doctor Detailing Track Record",
      "Precise 1-Page Form"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-research-fellow",
    "name": "Research Fellow & Scientist 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Academic",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Academic layout showcasing grant awards, laboratory methodologies, peer-reviewed publications, and statistical modeling.",
    "badge": "Scientist 1P",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "Research Grant Awards",
      "First-Author Publications",
      "Methodology Competencies",
      "Serif Academic Contrast"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-teacher-educator",
    "name": "Educator & High School Teacher 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Academic",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for school teachers, lecturers, and STEM educators with curriculum design, classroom management, and student exam improvement.",
    "badge": "Teacher 1P",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-fresher-clean",
    "features": [
      "Curriculum Planning Focus",
      "Student Pass Rate Gains",
      "Pedagogy & Classroom Skills",
      "Warm Approachable Tone"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-lawyer-associate",
    "name": "Legal Associate & Advocate 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Distinguished layout for corporate attorneys, junior advocates, and paralegals. Highlights contract drafting, litigation, and bar membership.",
    "badge": "Legal 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#475569",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-ats-strict",
    "features": [
      "Bar Association Credentials",
      "Contract Drafting & Due Diligence",
      "Courtroom Litigation Record",
      "Classic Legal Elegance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-civil-engineer",
    "name": "Civil & Structural Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for AutoCAD, ETABS, and structural site supervisors. Highlights high-rise construction milestones, BOQ estimation, and safety compliance.",
    "badge": "Civil Eng 1P",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#0284c7",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "AutoCAD & ETABS Stack",
      "BOQ Cost Estimation",
      "Site Safety Compliance",
      "Structured Pillar Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-electrical-eng",
    "name": "Electrical & Power Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcases substation maintenance, PLC automation, circuit design, and industrial power distribution engineering on a clean single sheet.",
    "badge": "EEE Eng 1P",
    "isPremium": false,
    "thumbnailColor": "#ca8a04",
    "accentColor": "#eab308",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "PLC & Substation Engineering",
      "Single-Line Diagram Audits",
      "Industrial Safety Standards",
      "Clean Tech Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-mechanical-eng",
    "name": "Mechanical & HVAC Engineer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on SolidWorks, HVAC plant maintenance, thermal dynamics, and manufacturing machinery upkeep with quantitative uptime stats.",
    "badge": "Mechanical 1P",
    "isPremium": false,
    "thumbnailColor": "#475569",
    "accentColor": "#64748b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "SolidWorks / CAD Modeling",
      "HVAC & Plant Maintenance",
      "Machine Downtime Reduction",
      "Single Page Density"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-architect-compact",
    "name": "Architectural Designer 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Modern",
      "Minimal"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Minimalist blueprint-inspired aesthetic for Revit, SketchUp, and interior architecture portfolios with generous visual balance.",
    "badge": "Architect 1P",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "square",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "3D Modeling & BIM Skills",
      "Design Portfolio Ribbons",
      "Blueprint Spatial Aesthetic",
      "Crisp Minimal Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-startup-founder",
    "name": "Startup Founder & Chief of Staff 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for venture-backed founders, general managers, and Chiefs of Staff. Quantifies seed fundraising, headcount scaling, and product-market fit.",
    "badge": "Founder 1-Page",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#2563eb",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "Venture Capital Raised",
      "0-to-1 Product Traction",
      "Team Headcount Growth",
      "Concise C-Level Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-director-brief",
    "name": "Managing Director Compact 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Executive",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "High-level governance resume for board members and managing directors focusing on P&L stewardship, enterprise risk, and mergers.",
    "badge": "Director 1P",
    "isPremium": false,
    "thumbnailColor": "#881337",
    "accentColor": "#be123c",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "P&L Stewardship Scale",
      "Board Governance Record",
      "M&A Deal Milestones",
      "Distinguished Crimson"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-entry-intern",
    "name": "General Entry-Level Intern 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Universal first-job resume for students and high school graduates. Highlights soft skills, computer literacy, volunteering, and extracurriculars.",
    "badge": "Intern 1-Page",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-fresher-clean",
    "features": [
      "Extracurricular & Leadership",
      "Computer & Software Skills",
      "Approachable Clear Design",
      "Guaranteed Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "onepage-student-scholarship",
    "name": "Student Scholarship & Honours 1-Page",
    "category": "One-Page CVs",
    "categories": [
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Academic"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered for Erasmus, Fulbright, and university merit scholarships. Puts academic GPA, dean lists, research papers, and faculty referees front and center.",
    "badge": "Scholarship 1P",
    "isPremium": false,
    "thumbnailColor": "#1d4ed8",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "GPA & Dean Honors Strip",
      "Faculty Referee Callout",
      "Merit Scholarship Ready",
      "Scholarly Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-corporate-standard",
    "name": "Bangladesh Recruiter Standard (Detailed)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Multiple-Page CVs",
      "Standard",
      "Professional"
    ],
    "isOnePage": false,
    "isFeatured": true,
    "description": "Comprehensive Bangladeshi corporate format with passport photo, personal details table (Parents, NID, Blood Group, Religion), academic matriculation table, career history, detailed references, and signed declaration.",
    "badge": "BD Standard Multi",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Full Personal Details Table",
      "BD Academic CGPA Matrix",
      "Dual Professional Referees",
      "Signed Legal Declaration"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 900,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 4,
      "tip": "Ideal for Bangladeshi banks, civil service, autonomous enterprises, and multi-page job portals."
    }
  },
  {
    "id": "executive-slate",
    "name": "Executive Slate & Corporate",
    "category": "Executive",
    "categories": [
      "Multiple-Page CVs",
      "Executive",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Detailed multi-page corporate standard with dark slate title banner, prominent summary, and exhaustive chronology for senior managers.",
    "badge": "Executive Multi",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#334155",
    "photoFormat": "portrait",
    "layoutArchitecture": "executive-slate",
    "features": [
      "Corporate Slate Header",
      "Exhaustive Career Timeline",
      "Board Reference Ready",
      "Multi-Page A4 Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 950,
      "maxExperienceItems": 8,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 5,
      "tip": "Best suited for senior leadership with 10+ years of detailed achievements."
    }
  },
  {
    "id": "ocean-split",
    "name": "Ocean Split-Column Detailed",
    "category": "Modern",
    "categories": [
      "Multiple-Page CVs",
      "Modern",
      "Professional"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Multi-page split layout with tinted navy sidebar across all pages for persistent contact, skills, and language visibility.",
    "badge": "Split Multi",
    "isPremium": false,
    "thumbnailColor": "#0369a1",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "ocean-split",
    "features": [
      "Persistent Side Pillar",
      "High-Density Information",
      "Dual Column Typography",
      "Modern Professional Styling"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 850,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 4,
      "tip": "Keeps your skills and contact details visible as the recruiter turns through multiple pages."
    }
  },
  {
    "id": "linear-dark",
    "name": "Linear Dark Tech Detailed",
    "category": "Technology",
    "categories": [
      "Multiple-Page CVs",
      "Technology",
      "IT"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Sleek dark-accented multi-page theme engineered for senior software architects, engineering leads, and technical founders.",
    "badge": "Dark Tech Multi",
    "isPremium": false,
    "thumbnailColor": "#18181b",
    "accentColor": "#6366f1",
    "photoFormat": "square",
    "layoutArchitecture": "linear-dark",
    "features": [
      "Modern Dark Slate Header",
      "Extensive Technical Project Logs",
      "System Architecture Focus",
      "High Developer Appeal"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 900,
      "maxExperienceItems": 7,
      "maxEducationItems": 3,
      "maxBulletsPerRole": 4,
      "tip": "Document complete architecture implementations, microservice migrations, and patents."
    }
  },
  {
    "id": "ats-classic",
    "name": "ATS Classic Multi-Page Stream",
    "category": "Standard",
    "categories": [
      "Multiple-Page CVs",
      "Standard",
      "Academic",
      "Professional"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Universal linear single-column format that parses cleanly through every corporate ATS portal without formatting loss.",
    "badge": "ATS Multi",
    "isPremium": false,
    "thumbnailColor": "#475569",
    "accentColor": "#64748b",
    "photoFormat": "none",
    "layoutArchitecture": "ats-classic",
    "features": [
      "Pure Linear Machine Readability",
      "Zero Parsing Friction",
      "Exhaustive Career Chronology",
      "Universal International Standard"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 1000,
      "maxExperienceItems": 10,
      "maxEducationItems": 5,
      "maxBulletsPerRole": 5,
      "tip": "Ideal for academic curricula vitae, medical residencies, and extensive international applications."
    }
  },
  {
    "id": "academic-multipage-cv",
    "name": "Academic & Scholarly Multi-Page CV",
    "category": "Academic and Research",
    "categories": [
      "Multiple-Page CVs",
      "Academic and Research",
      "Education and Teaching",
      "Experienced Professionals",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": true,
    "description": "Comprehensive multi-page academic curriculum vitae for university professors, postdoctoral researchers, doctoral candidates, and scientific fellows. Structured for peer-reviewed journal articles, DOI links, funded grants, academic honors, teaching dossiers, and scholarly referees.",
    "badge": "Academic Multi-Page",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "academic-multipage-cv",
    "features": [
      "Peer-Reviewed Publication Citations & DOIs",
      "Funded Research Grants & Fellowships",
      "Formal Teaching & Advising Dossier",
      "Multi-Page Continuous Scholarly Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 1500,
      "maxExperienceItems": 8,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 5,
      "tip": "List research interests first, followed by education, peer-reviewed publications with full DOI citations, funded grants, and academic references."
    }
  },
  {
    "id": "bd-bank-mto",
    "name": "Banking Management Trainee Officer (MTO)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for MTO recruitment exams at Eastern Bank, BRAC Bank, City Bank, and Dhaka Bank. Highlights university CGPA, aptitude test strengths, and analytical projects.",
    "badge": "BD Bank MTO",
    "isPremium": false,
    "thumbnailColor": "#0369a1",
    "accentColor": "#0284c7",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Passport Photo Top-Right",
      "University CGPA Matriculation Table",
      "Financial Aptitude Focus",
      "Fits 1-Page A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bank-po",
    "name": "Bank Probationary Officer (PO)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Standard format for private commercial bank PO circulars. Emphasizes academic credentials, computer literacy, and clean professional declaration.",
    "badge": "Bank PO 1P",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Standard PO Exam Structure",
      "SSC/HSC/Graduation Grid",
      "Computer Proficiency Block",
      "Single-Page Clean"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bank-cash-officer",
    "name": "Bank Cash Officer & General Banking",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Optimized for general banking, cash operations, and customer service officers at Islami Bank, Pubali Bank, and Dutch-Bangla Bank.",
    "badge": "General Banking",
    "isPremium": false,
    "thumbnailColor": "#047857",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Cash Reconciliation Skills",
      "Customer Service Record",
      "Academic Table with GPA",
      "Signed Declaration"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bank-credit-analyst",
    "name": "SME & Corporate Credit Analyst",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Bangladesh CVs",
      "Professional",
      "One-Page CVs"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on financial statement analysis, CIB verification, collateral valuation, and Bangladesh Bank prudential guidelines.",
    "badge": "Credit Analyst",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "CIB & Loan Appraisal Track",
      "Financial Ratios Competencies",
      "Corporate Lending Scale",
      "BD Recruiter Ready"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bank-islamic",
    "name": "Islamic Banking & Shariah Operations",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Shariah-compliant banks (IBBL, Al-Arafah, First Security). Highlights Murabaha, Mudaraba, and Islamic financial products.",
    "badge": "Islamic Bank",
    "isPremium": false,
    "thumbnailColor": "#065f46",
    "accentColor": "#059669",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Shariah Product Competencies",
      "Murabaha / Ijara Experience",
      "Academic Matrix",
      "Clean BD Style"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bank-compliance",
    "name": "AML / CFT Banking Compliance Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Designed for BFIU reporting, Anti-Money Laundering (AML/CFT) audits, KYC verification, and Bangladesh Bank regulatory inspections.",
    "badge": "AML Compliance",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "BFIU Compliance Experience",
      "KYC & Sanction Screening",
      "Audit Defense Record",
      "Comprehensive 2-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-bank-fintech-digital",
    "name": "Fintech & Digital Banking Specialist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for bKash, Nagad, Upay, and digital banking apps. Showcases NPSB, BEFTN, RTGS payment switches, and merchant onboarding.",
    "badge": "Fintech BD",
    "isPremium": false,
    "thumbnailColor": "#d97706",
    "accentColor": "#f59e0b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Payment Switch Protocols",
      "MFS Product Traction",
      "API Integration Record",
      "1-Page Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-microfinance-officer",
    "name": "Microfinance & Branch Coordinator",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for Grameen Bank, ASA, BRAC Microfinance, and TMSS branch managers and loan disbursement officers with field collection metrics.",
    "badge": "Microfinance",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#22c55e",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Field Loan Disbursement Stats",
      "Recovery Rate Milestones",
      "Community Organizing",
      "A4 Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-bcs-admin-cadre",
    "name": "BCS Administration Cadre Standard",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Multiple-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Official format for BCS Cadre officers, Executive Magistrates, and Ministry administrative roles with full parents names, permanent address, and credentials.",
    "badge": "BCS Admin Cadre",
    "isPremium": false,
    "thumbnailColor": "#172554",
    "accentColor": "#1e40af",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Official Govt Format",
      "SSC / HSC Board Division Table",
      "Permanent Address & NID",
      "Signed Formal Declaration"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-bcs-police-cadre",
    "name": "BCS Police Service Cadre Profile",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Multiple-Page CVs",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Structured for ASPs, police inspectors, and law enforcement executives. Details training academy courses, division postings, and commendations.",
    "badge": "BCS Police",
    "isPremium": false,
    "thumbnailColor": "#1e1b4b",
    "accentColor": "#312e81",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Police Academy Training Log",
      "District Posting History",
      "Full Personal Particulars",
      "Official Multi-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-bcs-education-cadre",
    "name": "BCS Education Cadre / Govt College Lecturer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Academic",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Designed for government college lecturers and education cadre officers. Features subject honors, teaching appointments, and academic publications.",
    "badge": "BCS Education",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#2563eb",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Academic Department Matrix",
      "Govt Appointment History",
      "Subject Specialization",
      "Comprehensive Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-bcs-customs-tax",
    "name": "BCS Customs, Excise & Taxation Cadre",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Multiple-Page CVs",
      "Professional"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Official profile for National Board of Revenue (NBR) assistant commissioners, customs superintendents, and tax circles.",
    "badge": "BCS Customs",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "NBR Circle Administration",
      "Revenue Target Accomplishments",
      "Legal & Tax Assessments",
      "Detailed 2-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-bank-ad-officer",
    "name": "Bangladesh Bank Assistant Director (AD)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Gold standard resume for Bangladesh Bank AD exam applicants. Features top tier university CGPA, monetary policy knowledge, and analytical rigor.",
    "badge": "BB AD Exam",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Central Bank Exam Ready",
      "Academic Honors Front & Center",
      "Compact Single Sheet",
      "Signed BD Declaration"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-govt-autonomous-officer",
    "name": "Govt Autonomous Body Executive (Biman / BSEC)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Standard",
      "Multiple-Page CVs"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Suited for Bangladesh Biman, BSEC, BEPZA, and BTRC executive circulars requiring verified personal background and matriculation.",
    "badge": "Govt Autonomous",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Comprehensive Personal Details",
      "Matriculation Board Division",
      "Executive Grade Progression",
      "Signed Attestation"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-public-university-lecturer",
    "name": "Public University Faculty (DU / JU / RU / CU)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Academic",
      "Multiple-Page CVs"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Standard format for Dhaka University and public university faculty search committees. Highlights department merit positions, M.Phil/Ph.D. thesis, and journals.",
    "badge": "University Faculty",
    "isPremium": false,
    "thumbnailColor": "#172554",
    "accentColor": "#2563eb",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Department Merit Position",
      "Published Research Papers",
      "Academic Referees & Supervisors",
      "Scholarly Multi-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-textile-senior-merchandiser",
    "name": "Senior Woven / Knitwear Merchandiser",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for RMG buying houses and garment manufacturing giants (Ha-Meem, DBL, Beximco, Pacific Jeans). Details FOB costing, T&A calendar, and European buyer relations.",
    "badge": "Senior Merchandiser",
    "isPremium": false,
    "thumbnailColor": "#881337",
    "accentColor": "#be123c",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Buyer Relationship Portfolio (H&M, Inditex)",
      "FOB Costing & Consumption",
      "Time & Action (T&A) Governance",
      "1-Page A4 Executive"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-textile-production-manager",
    "name": "Garment Production Manager (PM)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Demonstrating daily floor output (Pcs/Day), line efficiency (65%+), SMV reduction, and factory worker management on RMG production floors.",
    "badge": "Garment PM",
    "isPremium": false,
    "thumbnailColor": "#475569",
    "accentColor": "#64748b",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Floor Line Efficiency KPIs",
      "SMV & Machine Allocation",
      "Worker Attendance & Safety",
      "Detailed Factory Track"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-textile-qa-head",
    "name": "Garment QA & Final Inspection Head",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on AQL 1.5/2.5 inspection standards, inline defect rate reduction, lab test reports (washing, colorfastness), and buyer audit pass rates.",
    "badge": "RMG Quality QA",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "AQL 1.5 / 2.5 Standards",
      "Inline Defect DHU Reduction",
      "Fabric Testing Lab Reports",
      "Compact 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-textile-dyeing-engineer",
    "name": "Textile Dyeing, Printing & Washing Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for BUTEX and textile engineering graduates. Emphasizes lab dip matching, recipe formulation, effluent treatment (ETP), and fabric finishing.",
    "badge": "Textile Dyeing",
    "isPremium": false,
    "thumbnailColor": "#0369a1",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Lab Dip Color Matching",
      "Chemical Recipe Formulation",
      "ETP & Environmental Compliance",
      "Engineering Credentials"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-textile-fashion-designer",
    "name": "RMG Apparel Fashion & Pattern Designer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Modern",
      "One-Page CVs"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for BGMEA University (BUFT) and Shanto-Mariam fashion graduates. Highlights Tech Pack creation, 3D Clo3D modeling, and seasonal lookbooks.",
    "badge": "Fashion Designer",
    "isPremium": false,
    "thumbnailColor": "#c026d3",
    "accentColor": "#e879f9",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Clo3D & Tech Pack Skills",
      "Seasonal Moodboard Links",
      "Trend Forecasting Portfolio",
      "Vibrant Visual Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-textile-supply-sourcing",
    "name": "Raw Material & Fabric Sourcing Specialist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing yarn/fabric mill negotiation in China and India, LC opening terms, import clearance, and lead time reduction for exporters.",
    "badge": "Fabric Sourcing",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "International Mill Relations",
      "Commercial LC & Customs",
      "Lead Time Compression",
      "1-Page A4 Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-textile-compliance-officer",
    "name": "Social & Fire Safety Compliance (RSC / SEDEX)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Standard",
      "Multiple-Page CVs"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Tailored for factory compliance heads. Details RSC (former Accord/Alliance) safety audits, SEDEX SMETA, BSCI, and labor law compliance.",
    "badge": "RMG Compliance",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#475569",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "RSC Safety Audit Record",
      "SEDEX / BSCI Standards",
      "Bangladesh Labor Act 2006",
      "Detailed Factory Profile"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-textile-industrial-eng",
    "name": "Industrial Engineering (IE) Apparel Specialist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting GSD (General Sewing Data), line balancing, operator skill matrix, and method-time measurement on RMG production floors.",
    "badge": "Apparel IE",
    "isPremium": false,
    "thumbnailColor": "#4f46e5",
    "accentColor": "#818cf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "GSD & Line Balancing",
      "Skill Matrix Governance",
      "Efficiency Gains (+18%)",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-medical-mbbs-doctor",
    "name": "MBBS Medical Officer (BMDC Registered)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Academic",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Standard format for BMDC licensed doctors applying to Apollo/Evercare, Square Hospital, United Hospital, and Upazila Health Complexes.",
    "badge": "BMDC Doctor 1P",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BMDC Registration Number",
      "Hospital Internship Rotations",
      "Emergency Ward & OPD Record",
      "Fits Single Page A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-medical-resident-doctor",
    "name": "FCPS / MS Trainee Resident Physician",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Academic",
      "Multiple-Page CVs"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Designed for BSMMU, DMC, and SSMC postgraduate residents. Features BCPS Part-1 credentials, clinical case log, and thesis synopsis.",
    "badge": "FCPS Resident",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "BCPS / MS Course Status",
      "Clinical Procedure Logbook",
      "Professor Referees & Mentors",
      "Comprehensive Academic CV"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-medical-dental-surgeon",
    "name": "BDS Dental Surgeon Clinical Practice",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for licensed dental surgeons. Details endodontic treatment, dental extractions, cosmetic crowns, and clinic management.",
    "badge": "Dental Surgeon",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#0ea5e9",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BMDC Dental License",
      "Prosthodontics & Root Canal",
      "Clinical Internship Record",
      "Single Sheet Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-medical-staff-nurse",
    "name": "Registered Staff Nurse (BNMC Certified)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for Bangladesh Nursing and Midwifery Council (BNMC) certified nurses across ICU, CCU, OT, and general wards.",
    "badge": "BNMC Staff Nurse",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#34d399",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BNMC Registration ID",
      "ICU / OT Nursing Skills",
      "Patient Care & Medication",
      "Clean BD Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-medical-lab-technologist",
    "name": "Clinical Laboratory Technologist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting biochemistry, hematology, microbiology sample processing, automated analyzers, and diagnostic quality control.",
    "badge": "Lab Technologist",
    "isPremium": false,
    "thumbnailColor": "#0d9488",
    "accentColor": "#2dd4bf",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Diagnostic Analyzer Equipment",
      "Hematology & PCR Testing",
      "Diagnostic Accuracy Record",
      "1-Page A4 Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-hospital-admin-officer",
    "name": "Hospital Administration & Operations Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Managing patient admissions, billing operations, emergency dispatch, and hospital concierge for top private medical facilities.",
    "badge": "Hospital Admin",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Bed Occupancy & Billing Flow",
      "Patient Satisfaction Stats",
      "Staff Roster Management",
      "Detailed Corporate Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-pharma-mpo-executive",
    "name": "Medical Promotion Officer (MPO) - Square / Beximco",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for MPO recruitment drives at Square, Beximco, Incepta, and Renata. Details territorial doctor coverage, chemist orders, and sales targets.",
    "badge": "Pharma MPO",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Doctor Detailing Mastery",
      "Chemist Order Generation",
      "Territory Target Attainment",
      "Clean 1-Page Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-pharma-pme-lead",
    "name": "Pharma Product Management Executive (PME)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for pharmacy graduates (B.Pharm/M.Pharm) leading therapeutic brand portfolios, physician symposiums, and market launches.",
    "badge": "Pharma PME",
    "isPremium": false,
    "thumbnailColor": "#7c3aed",
    "accentColor": "#a78bfa",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Therapeutic Brand Portfolio",
      "Scientific Literature Strategy",
      "Prescription Share Growth",
      "Balanced Split Column"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-pharma-qc-chemist",
    "name": "Pharmaceutical Quality Control (QC) Chemist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating HPLC, dissolution testing, raw material assay, and cGMP compliance in pharmaceutical analytical testing laboratories.",
    "badge": "Pharma QC Chemist",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "HPLC & UV Spectrophotometry",
      "Assay & Dissolution Testing",
      "cGMP Protocol Adherence",
      "Single Sheet Fit"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-pharma-formulation-rd",
    "name": "Formulation R&D Research Scientist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Academic",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on solid oral dosage formulation, bioequivalence studies, stability testing, and novel drug delivery system development.",
    "badge": "Pharma R&D",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "Formulation Recipe Trials",
      "Stability Chamber Audits",
      "Bioequivalence Testing",
      "Academic Scientific Rigor"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-pharma-regulatory-affairs",
    "name": "DGDA Regulatory Affairs Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Managing Directorate General of Drug Administration (DGDA) product dossier submissions, recipe approvals, and export registrations.",
    "badge": "Regulatory Affairs",
    "isPremium": false,
    "thumbnailColor": "#374151",
    "accentColor": "#4b5563",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "DGDA Dossier Submission CTD",
      "Product License Renewals",
      "Export Market Compliance",
      "Structured Multi-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-brac-project-coordinator",
    "name": "BRAC Development Program Coordinator",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for BRAC, Save the Children, and UNDP program officers. Details community mobilization, donor grant reporting, and poverty alleviation.",
    "badge": "BRAC Coordinator",
    "isPremium": false,
    "thumbnailColor": "#ea580c",
    "accentColor": "#f97316",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Community Mobilization Stats",
      "Donor Grant Governance (FCDO/USAID)",
      "Field Team Coordination",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-icddrb-research-officer",
    "name": "icddr,b Health & Clinical Research Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Academic"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Standard format for icddr,b field research, epidemiology studies, surveillance data collection, and statistical publication analysis.",
    "badge": "icddr,b Research",
    "isPremium": false,
    "thumbnailColor": "#0369a1",
    "accentColor": "#0ea5e9",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "Field Epidemiology Research",
      "Clinical Data Quality Control",
      "Peer-Reviewed Author Record",
      "Academic Standard"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-ngo-field-operations",
    "name": "Humanitarian Emergency Field Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Cox’s Bazar Rohingya response and disaster relief teams. Details emergency distribution, camp coordination, and rapid assessment.",
    "badge": "Humanitarian Field",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Camp Management & Logistics",
      "Rapid Needs Assessment",
      "Multi-Agency Coordination",
      "Single Page Form"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-ngo-wash-specialist",
    "name": "WASH (Water, Sanitation & Hygiene) Specialist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting deep tube well installations, sanitation block construction, water quality testing, and hygiene community education.",
    "badge": "WASH Specialist",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Water Quality Testing & Testing",
      "Sanitation Facility Construction",
      "Hygiene Promotion Outreach",
      "Single Sheet Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-ngo-me-officer",
    "name": "Monitoring, Evaluation & Learning (MEAL) Specialist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating KoboToolbox mobile data collection, logframe indicator tracking, baseline/endline surveys, and donor reporting.",
    "badge": "MEAL Specialist",
    "isPremium": false,
    "thumbnailColor": "#4f46e5",
    "accentColor": "#818cf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "KoboToolbox & ODK Survey Flow",
      "Logframe Indicator Matrix",
      "Data Visualization Dashboards",
      "Modern Technical Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-telecom-gp-engineer",
    "name": "Grameenphone / Robi Core Network Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "IT"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Engineered for telecom core engineers. Details 4G/5G core nodes, BTRC regulatory KPIs, call drop rate minimization, and subscriber traffic.",
    "badge": "Telecom Core Eng",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Core Network Performance KPIs",
      "BTRC Regulatory Standards",
      "Subsystem Uptime (>99.99%)",
      "Single Sheet Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-telecom-rf-planning",
    "name": "Cellular RF Planning & Optimization Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "IT"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting Atoll propagation modeling, drive test analysis (Nemo/TEMS), antenna azimuth adjustment, and coverage hole fixes.",
    "badge": "RF Optimization",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Drive Test Analysis (TEMS)",
      "Atoll RF Propagation Modeling",
      "Cluster Optimization Results",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-telecom-isp-noc",
    "name": "Broadband ISP & Fiber NOC Network Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "IT"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for nationwide ISP providers (Link3, AmberIT, Dot Internet). Details BGP peering, MikroTik/Cisco routing, and fiber fault resolution.",
    "badge": "ISP NOC Engineer",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-it-sidebar",
    "features": [
      "MikroTik & Cisco Routing",
      "BGP Peering & Bandwidth Shaping",
      "24/7 Incident Resolution Stats",
      "Dark IT Accents"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-telecom-b2b-corporate",
    "name": "Enterprise Telecom Corporate Sales Executive",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focusing on dedicated leased line sales, corporate cloud connectivity, and enterprise bulk SMS contracts across Dhaka corporate hubs.",
    "badge": "Telecom B2B",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#2563eb",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Corporate Leased Line Quotas",
      "Enterprise Client Portfolio",
      "Revenue Growth Milestones",
      "Balanced Split Column"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-software-fullstack",
    "name": "Dhaka Software Hub Full-Stack Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for BASIS tech firm engineers in Mohakhali DOHS, Banani, and Uttara. Showcases React, Node.js, Next.js, and payment gateway integration.",
    "badge": "Dhaka Tech 1P",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "BASIS Software Firm Standard",
      "Local Payment Gateway APIs",
      "Clean Tech Stack Matrix",
      "1-Page A4 Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-software-sqa-engineer",
    "name": "SQA & Automation Test Engineer (BASIS Standard)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating automated regression testing, Postman API collections, JMeter load benchmarking, and defect lifecycle governance.",
    "badge": "BD SQA Engineer",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Postman & Selenium Automation",
      "JMeter Load Testing Benchmarks",
      "Bug Severity Tracking",
      "Compact 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-software-flutter-mobile",
    "name": "Mobile App Developer (Flutter & Android)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for Bangladeshi ride-sharing, grocery delivery, and e-commerce mobile app developers with live Google Play Store links.",
    "badge": "Flutter BD",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Google Play Store Live Apps",
      "Bloc / Riverpod Architecture",
      "Push Notification Services",
      "Clean Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-software-devops-cloud",
    "name": "DevOps & AWS Cloud Operations Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "IT"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Managing cloud infrastructure for high-traffic Bangladeshi websites and fintech portals with automated CI/CD and Docker containers.",
    "badge": "DevOps BD",
    "isPremium": false,
    "thumbnailColor": "#4f46e5",
    "accentColor": "#818cf8",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-it-sidebar",
    "features": [
      "AWS / GCP Cloud Architecture",
      "Docker & Kubernetes Pods",
      "GitHub Actions CI/CD",
      "Dark IT Accents"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-software-uiux-designer",
    "name": "UI/UX Product Designer (Dhaka Startups)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for local startup product designers. Highlights localized Bangla typography, mobile-first e-commerce flows, and Figma components.",
    "badge": "UI/UX Dhaka",
    "isPremium": false,
    "thumbnailColor": "#ec4899",
    "accentColor": "#f472b6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Localized Bangla Typography",
      "Figma Design System Mastery",
      "Mobile-First E-Commerce Flow",
      "Creative 1-Page Polish"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fmcg-brand-manager",
    "name": "FMCG Brand Manager (Unilever / PRAN / Marico)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Modern",
      "One-Page CVs"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing market share gains, ATL/BTL campaign execution, brand health tracking, and nationwide distributor channel growth.",
    "badge": "FMCG Brand 1P",
    "isPremium": false,
    "thumbnailColor": "#1d4ed8",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "Market Share & Penetration Stats",
      "Nationwide ATL / BTL Campaigns",
      "Distributor Network Growth",
      "Executive A4 Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fmcg-tsm-sales",
    "name": "Territory Sales Manager (TSM - FMCG)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating territory secondary sales volume, dealer appointment, retail outlet coverage, and field sales officer (SR) supervision.",
    "badge": "FMCG TSM",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#22c55e",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Secondary Sales Achievement",
      "Outlet Coverage & Distribution",
      "Field Team Supervision",
      "1-Page A4 Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fmcg-supply-chain",
    "name": "FMCG Procurement & Warehouse Logistics Manager",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Managing central distribution centers (CDC), raw material procurement, fleet route planning, and damaged stock minimization.",
    "badge": "FMCG Logistics",
    "isPremium": false,
    "thumbnailColor": "#334155",
    "accentColor": "#64748b",
    "photoFormat": "portrait",
    "layoutArchitecture": "bd-corporate-standard",
    "features": [
      "Central Depot Inventory Scale",
      "Fleet Logistics Turnaround",
      "SAP MM / SD Module Fluency",
      "Comprehensive 2-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-ca-article-audit",
    "name": "CA Article Student / Audit Senior (ICAB Standard)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for chartered accountancy firms (Rahman Rahman Huq, Hoda Vasi, A. Qasem). Details statutory bank audits, taxation, and IFRS.",
    "badge": "CA Article 1P",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#2563eb",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "ICAB Registration Credentials",
      "Statutory Bank & Corporate Audits",
      "IFRS Compliance & Working Papers",
      "Clean Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-cma-cost-accountant",
    "name": "Cost & Management Accountant (ICMAB Standard)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on factory cost audits, variance analysis, raw material bill of materials (BOM), and cost optimization for manufacturing.",
    "badge": "CMA Accountant",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "ICMAB Professional Level",
      "Cost Variance & Inventory Audits",
      "Factory BOM Optimization",
      "1-Page A4 Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-advocate-high-court",
    "name": "Supreme Court / High Court Division Advocate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": false,
    "isFeatured": false,
    "description": "Official profile for Bar Council enrolled advocates. Details writ petitions, corporate litigation, civil appeals, and chamber practice.",
    "badge": "Advocate HC",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#334155",
    "photoFormat": "none",
    "layoutArchitecture": "ats-classic",
    "features": [
      "Bangladesh Bar Council Enrolment",
      "High Court Division Sanad",
      "Corporate Litigation Record",
      "Classic Legal Form"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 800,
      "maxExperienceItems": 6,
      "maxEducationItems": 4,
      "maxBulletsPerRole": 3,
      "tip": "Comprehensive multi-page layout suited for experienced applicants with extensive career history."
    }
  },
  {
    "id": "bd-tax-vat-consultant",
    "name": "Income Tax & VAT Practitioner (ITP - NBR Standard)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Managing annual corporate tax return filing, VAT return submission on NBR portal, assessment hearings, and tax dispute resolution.",
    "badge": "Tax / VAT ITP",
    "isPremium": false,
    "thumbnailColor": "#374151",
    "accentColor": "#4b5563",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "NBR Tax Practitioner Enrolment",
      "E-TDS & VAT Portal Operations",
      "Tax Assessment Tribunal History",
      "Clean 1-Page Stream"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-civil-site-engineer",
    "name": "Civil Site Engineer (Bridge & High-Rise)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for mega-infrastructure projects (Padma Bridge, Metro Rail, Elevated Expressway) and high-rise commercial structures.",
    "badge": "Civil Engineer",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Piling & RCC Structural Supervision",
      "AutoCAD & Bar Bending Schedules",
      "Concrete Quality Test Verification",
      "Fits 1-Page A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-electrical-substation",
    "name": "Electrical Substation & Switchgear Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting 33/11kV substation installation, transformer testing, HT/LT switchgear, and DESCO/DPDC power distribution approvals.",
    "badge": "Substation EEE",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "33/11kV Substation Commissioning",
      "DESCO / DPDC Approval Standards",
      "Transformer & Relay Testing",
      "Single Sheet Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-mechanical-hvac-eng",
    "name": "Mechanical Maintenance & Plant Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on industrial chiller plants, boiler operations, air compressor upkeep, and preventive factory maintenance schedules.",
    "badge": "Mechanical Eng",
    "isPremium": false,
    "thumbnailColor": "#475569",
    "accentColor": "#64748b",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Boiler & Chiller Plant Upkeep",
      "Preventive Maintenance Schedules",
      "Safety Certificate Compliance",
      "Clean Tech Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-architect-interior-lead",
    "name": "Architect & Interior Design Project Lead",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Institute of Architects Bangladesh (IAB) members leading residential renovations, commercial offices, and landscape masterplans.",
    "badge": "Architect IAB",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "IAB Membership Credentials",
      "Interior Fit-Out Portfolio Links",
      "3D Lumion & AutoCAD Fluency",
      "Contemporary Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-buet-cse",
    "name": "BUET CSE Engineering Honours Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Prestigious engineering template for BUET CSE graduates. Features high CGPA, ICPC problem-solving rank, undergraduate thesis, and technical stack.",
    "badge": "BUET CSE 1P",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#2563eb",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BUET Academic Merit & CGPA",
      "ICPC / Competitive Problem Solving",
      "Undergraduate Thesis Synopsis",
      "Fits 1-Page A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-du-iba-bba",
    "name": "DU IBA BBA Honours Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Executive",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "The definitive business executive profile for IBA Dhaka University graduates. Features business case competition wins and internship leadership.",
    "badge": "IBA BBA 1P",
    "isPremium": false,
    "thumbnailColor": "#881337",
    "accentColor": "#be123c",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "IBA University Merit Standings",
      "National Case Competition Wins",
      "MNC Internship Achievements",
      "Crisp Executive Single Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-nsu-bba",
    "name": "North South University BBA Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for NSU School of Business & Economics alumni. Features major in Finance/Marketing, club executive roles, and corporate internships.",
    "badge": "NSU BBA 1P",
    "isPremium": false,
    "thumbnailColor": "#1d4ed8",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "NSU Dean’s List Distinction",
      "Major Coursework Highlights",
      "Corporate Internship Impact",
      "Modern Split Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-bracu-cse",
    "name": "BRAC University CSE Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for BRACU CS graduates. Highlights capstone software projects, hackathon achievements, and frontend/backend software skills.",
    "badge": "BRACU CSE 1P",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Capstone Project Showcase",
      "Hackathon Participation Badges",
      "GitHub Repository Strip",
      "Clean 1-Page Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-du-economics",
    "name": "Dhaka University Economics Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Academic",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Academic profile for DU Department of Economics students with econometric modeling, Stata/R data analysis, and policy research.",
    "badge": "DU Economics 1P",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#22c55e",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Econometric Research Project",
      "Stata & R Data Modeling",
      "Department Honors Standing",
      "Single Page Form"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-iut-engineer",
    "name": "IUT Islamic University of Technology Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing OIC university excellence across EEE, MCE, and CSE departments with international technical standards and thesis.",
    "badge": "IUT Eng 1P",
    "isPremium": false,
    "thumbnailColor": "#047857",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "OIC International Standard",
      "Engineering Project Portfolio",
      "GPA & Laboratory Skills",
      "A4 Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-cuet-civil",
    "name": "Engineering University Graduate (CUET / RUET / KUET)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for public engineering university graduates across Bangladesh applying to EPC contractors, consulting, and govt engineering.",
    "badge": "Public Eng 1P",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Public Engineering CGPA",
      "AutoCAD & Technical Analysis",
      "Undergraduate Project Focus",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-ju-science",
    "name": "Jahangirnagar University Science Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for JU graduates in Statistics, Physics, Chemistry, and Environmental Science seeking commercial and research roles.",
    "badge": "JU Science 1P",
    "isPremium": false,
    "thumbnailColor": "#4f46e5",
    "accentColor": "#818cf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Statistical Analysis Focus",
      "University Department Ranking",
      "Extracurricular Club Roles",
      "Single Page Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-aiub-cs",
    "name": "AIUB Computer Science Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for AIUB CS and software engineering graduates highlighting C#, .NET, web development projects, and software internships.",
    "badge": "AIUB CS 1P",
    "isPremium": false,
    "thumbnailColor": "#1d4ed8",
    "accentColor": "#3b82f6",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "C# .NET & Web Stack",
      "Internship & Final Year Project",
      "Technical Certifications",
      "Clean Tech Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-ewu-business",
    "name": "East West University Business Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for East West University BBA alumni with major in Accounting, Finance, or HRM. Focuses on internships and soft skills.",
    "badge": "EWU BBA 1P",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#14b8a6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Business Major Specialization",
      "Corporate Internship Experience",
      "Student Leadership Activities",
      "1-Page Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-aust-eng",
    "name": "Ahsanullah University of Science & Tech (AUST) Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for AUST engineering graduates across Textile, Civil, EEE, and CSE entering Bangladeshi industrial and corporate sectors.",
    "badge": "AUST Eng 1P",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "IEB Accredited Engineering Degree",
      "Technical Project Execution",
      "Academic CGPA Table",
      "Single Sheet Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-general-bdjobs",
    "name": "BDJobs Standard Graduate Profile",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Clean universal 1-page template compliant with BDJobs portal expectations. Perfect for freshers across all degrees and universities.",
    "badge": "BDJobs Standard",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BDJobs Universal Layout",
      "SSC / HSC / Degree Table",
      "Career Objective Focus",
      "Guaranteed 1-Page A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-agri-krishi-officer",
    "name": "Upazila Agriculture Officer (DAE Standard)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Department of Agricultural Extension (DAE) officers, agronomists, and seed breeding executives with crop yield statistics.",
    "badge": "Krishi Officer",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#4ade80",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "DAE Agricultural Standards",
      "Agronomy & Seed Research",
      "Upazila Extension Projects",
      "1-Page A4 Precision"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fisheries-officer",
    "name": "Fisheries & Aquaculture Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for Department of Fisheries and commercial fish hatcheries. Highlights broodstock management, water parameters, and export shrimp farming.",
    "badge": "Fisheries BD",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Aquaculture Hatchery Skills",
      "HACCP & Export Processing",
      "Water Quality Management",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-livestock-veterinary",
    "name": "Veterinary Surgeon & Livestock Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for DVM graduates (BAU/CVASU). Details dairy/poultry farm disease management, vaccination protocols, and clinical surgeries.",
    "badge": "Vet Surgeon",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#34d399",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "DLS Veterinary Registration",
      "Poultry & Dairy Farm Health",
      "Surgical & Vaccination Logs",
      "A4 Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-petrobangla-energy",
    "name": "Petrobangla & Gas Field Petroleum Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Technology",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for BAPEX, Sylhet Gas Fields, and Titas Gas engineers. Highlights seismic survey analysis, wellhead operations, and gas pipeline safety.",
    "badge": "Petroleum BD",
    "isPremium": false,
    "thumbnailColor": "#ca8a04",
    "accentColor": "#eab308",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Gas Field Wellhead Operations",
      "Seismic Exploration Data",
      "Petrobangla Pipeline Standards",
      "Clean Tech Grid"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-power-desco-engineer",
    "name": "DESCO / DPDC / NESCO Power Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Focused on urban electrical distribution, 11kV feeder line maintenance, transformer load balancing, and smart metering rollouts.",
    "badge": "Power Utility",
    "isPremium": false,
    "thumbnailColor": "#ea580c",
    "accentColor": "#f97316",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "11kV Feeder Maintenance",
      "Smart Prepayment Metering",
      "System Loss Reduction Stats",
      "1-Page A4 Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-solar-renewable",
    "name": "Solar PV & Renewable Energy Project Engineer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing rooftop solar EPC execution, IDCOL refinancing compliance, PVsyst simulations, and industrial net metering.",
    "badge": "Solar Renewable",
    "isPremium": false,
    "thumbnailColor": "#16a34a",
    "accentColor": "#86efac",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "PVsyst Solar Simulation",
      "IDCOL Net Metering Compliance",
      "Megawatt Rooftop EPC Logs",
      "Modern 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-maritime-deck-officer",
    "name": "Merchant Navy Deck Officer (Marine Academy)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Official format for Bangladesh Marine Academy cadets and ocean-going deck officers. Details STCW certificates, sea-time discharge, and ECDIS navigation.",
    "badge": "Marine Cadet",
    "isPremium": false,
    "thumbnailColor": "#0f172a",
    "accentColor": "#0284c7",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "STCW & CDC Continuous Discharge",
      "Ocean Sea-Time Logbook",
      "Bridge Watchkeeping Record",
      "Clean Maritime Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-biman-aviation-officer",
    "name": "Biman Bangladesh Airlines Operations Officer",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting IATA ground handling standards, passenger service, air cargo manifest, and flight dispatch operations at Hazrat Shahjalal International Airport.",
    "badge": "Biman Aviation",
    "isPremium": false,
    "thumbnailColor": "#047857",
    "accentColor": "#10b981",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "IATA Ground Handling Certs",
      "Flight Dispatch & Load Control",
      "HSIA Airport Operations",
      "Single Sheet Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-chittagong-port-logistics",
    "name": "Chittagong Port Authority (CPA) Terminal Lead",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Professional",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Managing container terminal operations (TEU throughput), customs clearance at C&F agents, off-dock ICD logistics, and berth scheduling.",
    "badge": "Port Logistics",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "TEU Container Handling Stats",
      "C&F Customs Clearance Protocol",
      "Off-Dock ICD Operations",
      "A4 Structured Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-journalist-news-reporter",
    "name": "Broadcast News Reporter & Journalist",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Modern"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for television news channels (Somoy, Channel i, Jamuna TV) and national dailies with investigative reporting and live on-air pieces.",
    "badge": "Broadcast News",
    "isPremium": false,
    "thumbnailColor": "#dc2626",
    "accentColor": "#f87171",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Investigative Scoop Portfolio",
      "Live On-Air Reporting Record",
      "Press Club Accreditation",
      "Dynamic Media Flow"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-media-sub-editor",
    "name": "National Daily News Sub-Editor",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Demonstrating Bangla headline editing, newsroom translation (English to Bangla), fact-checking, and digital portal publishing.",
    "badge": "News Editor",
    "isPremium": false,
    "thumbnailColor": "#374151",
    "accentColor": "#6b7280",
    "photoFormat": "rounded",
    "layoutArchitecture": "onepage-minimal-swiss",
    "features": [
      "Bilingual Translation Skills",
      "Fact-Checking & News Ethics",
      "Digital Portal Publishing",
      "Clean Typographic A4"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-english-medium-teacher",
    "name": "English Medium Faculty (Cambridge / Edexcel)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Academic"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for top English medium institutions (Scholastica, Sunbeams, Mastermind). Highlights O/A Level syllabus delivery and student A* grades.",
    "badge": "English Medium",
    "isPremium": false,
    "thumbnailColor": "#1e40af",
    "accentColor": "#60a5fa",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "Cambridge & Edexcel Experience",
      "O / A Level Exam Grade Stats",
      "Pedagogical Methodology",
      "Scholarly 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-primary-assistant-teacher",
    "name": "Govt Primary School Assistant Teacher",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Official format for DPE primary school teacher circulars. Features academic matriculation grades, C-in-Ed/B.Ed training, and student literacy initiatives.",
    "badge": "Primary Teacher",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#34d399",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "DPE Recruitment Standard",
      "Academic Board Examination Table",
      "B.Ed / C-in-Ed Certifications",
      "Single Page Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-defense-retired-officer",
    "name": "Corporate Security Director (Retired Defense Officer)",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "Executive",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Suited for retired Army/Navy/Air Force officers transitioning to corporate security, crisis control, and risk management in MNCs.",
    "badge": "Defense Transition",
    "isPremium": false,
    "thumbnailColor": "#1e293b",
    "accentColor": "#475569",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-executive-brief",
    "features": [
      "Military Command Record",
      "VIP Protection & Crisis Protocols",
      "Corporate Facility Security",
      "Executive 1-Page Tone"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-hotel-general-manager",
    "name": "5-Star Hotel Operations & Hospitality Manager",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for Radisson, Westin, InterContinental, and Pan Pacific managers. Features guest satisfaction ratings, F&B banquet revenue, and room yields.",
    "badge": "Hospitality GM",
    "isPremium": false,
    "thumbnailColor": "#b45309",
    "accentColor": "#f59e0b",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-modern-split",
    "features": [
      "5-Star Luxury Brand Standards",
      "Banquet & F&B Revenue Targets",
      "TripAdvisor / RevPAR Growth",
      "Polished Split Form"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-sust-cse",
    "name": "SUST Computer Science & Tech Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Showcasing Shahjalal University of Science and Technology software engineering excellence, national hackathon podiums, and AI research.",
    "badge": "SUST CSE 1P",
    "isPremium": false,
    "thumbnailColor": "#0f766e",
    "accentColor": "#2dd4bf",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "SUST Academic Standings",
      "National Hackathon Wins",
      "AI / Systems Research Projects",
      "High-Density 1-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-cu-commerce",
    "name": "Chittagong University Business Administration Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Student / Fresh Graduate",
      "Standard"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for CU Faculty of Business Administration graduates entering Chittagong port corporations, MNCs, and private banks.",
    "badge": "CU BBA 1P",
    "isPremium": false,
    "thumbnailColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "CU Department Honors Table",
      "Port & Banking Internship Track",
      "Extracurricular Club Roles",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-ru-law",
    "name": "Rajshahi University Faculty of Law Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Professional",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for RU LL.B (Honours) graduates preparing for Bar Council examinations and judicial service commission (BJC) appointments.",
    "badge": "RU Law 1P",
    "isPremium": false,
    "thumbnailColor": "#374151",
    "accentColor": "#4b5563",
    "photoFormat": "none",
    "layoutArchitecture": "onepage-ats-strict",
    "features": [
      "LL.B Academic Division",
      "Moot Court Competition Honors",
      "Judicial Exam Preparation",
      "100% ATS Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-ku-biotech",
    "name": "Khulna University Biotechnology Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Academic",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting molecular biology techniques, genetics lab experiments, and undergraduate dissertation for pharma and biotech industries.",
    "badge": "KU Biotech 1P",
    "isPremium": false,
    "thumbnailColor": "#059669",
    "accentColor": "#10b981",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-academic-compact",
    "features": [
      "Molecular Genetics Lab Skills",
      "Undergraduate Thesis Synopsis",
      "Department Academic Standings",
      "Clean Academic Format"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-bau-agri",
    "name": "Bangladesh Agricultural University (BAU) Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Prestigious Mymensingh BAU graduate profile across Agriculture, Animal Husbandry, and Agricultural Economics for corporate agro firms.",
    "badge": "BAU Mymensingh",
    "isPremium": false,
    "thumbnailColor": "#15803d",
    "accentColor": "#22c55e",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "BAU Academic Excellence",
      "Agro-Chemical Lab Experience",
      "Field Demonstration Trials",
      "Single Page Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-diu-software",
    "name": "Daffodil International University (DIU) Software Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for DIU Software Engineering alumni. Showcases Flutter apps, web projects, competitive coding, and software firm internships.",
    "badge": "DIU SWE 1P",
    "isPremium": false,
    "thumbnailColor": "#2563eb",
    "accentColor": "#60a5fa",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Software Engineering Capstone",
      "Full-Stack Web Repository",
      "Internship & Soft Skills",
      "Clean 1-Page Layout"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-uiu-cse",
    "name": "United International University (UIU) CSE Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Highlighting UIU computer science graduates with machine learning capstone, data science certifications, and high-impact web apps.",
    "badge": "UIU CSE 1P",
    "isPremium": false,
    "thumbnailColor": "#ea580c",
    "accentColor": "#f97316",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Machine Learning Capstone",
      "Data Science Competitions",
      "GitHub Repository Showcases",
      "Single Sheet Balance"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-ulab-media",
    "name": "ULAB Media Studies & Journalism Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Modern",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Built for University of Liberal Arts Bangladesh MSJ alumni with digital storytelling, documentary film reels, and agency internships.",
    "badge": "ULAB Media 1P",
    "isPremium": false,
    "thumbnailColor": "#c2410c",
    "accentColor": "#fb923c",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-creative-editorial",
    "features": [
      "Documentary & Film Reel Links",
      "Digital Media Production",
      "Agency Copywriting Portfolio",
      "Contemporary 1-Page"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-uap-civil",
    "name": "University of Asia Pacific (UAP) Civil Engineering",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Designed for UAP Civil Engineering alumni focusing on structural design, concrete technology lab tests, and AutoCAD drafting.",
    "badge": "UAP Civil 1P",
    "isPremium": false,
    "thumbnailColor": "#0284c7",
    "accentColor": "#38bdf8",
    "photoFormat": "portrait",
    "layoutArchitecture": "onepage-bd-compact",
    "features": [
      "AutoCAD & Civil Drafting Skills",
      "Concrete Compressive Strength Lab",
      "IEB Accreditations",
      "Single Page Guarantee"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  },
  {
    "id": "bd-fresher-green-eee",
    "name": "Green University of Bangladesh EEE Graduate",
    "category": "Bangladesh CVs",
    "categories": [
      "Bangladesh CVs",
      "One-Page CVs",
      "Technology",
      "Student / Fresh Graduate"
    ],
    "isOnePage": true,
    "isFeatured": false,
    "description": "Tailored for Green University EEE graduates with embedded systems projects, PCB design, and power grid automation internships.",
    "badge": "Green EEE 1P",
    "isPremium": false,
    "thumbnailColor": "#047857",
    "accentColor": "#10b981",
    "photoFormat": "circle",
    "layoutArchitecture": "onepage-tech-grid",
    "features": [
      "Microcontroller & PCB Design",
      "Power System Analysis Labs",
      "Internship & Final Year Project",
      "A4 Single Sheet"
    ],
    "pageGuidance": {
      "recommendedMaxWords": 440,
      "maxExperienceItems": 3,
      "maxEducationItems": 2,
      "maxBulletsPerRole": 3,
      "tip": "Designed to fit cleanly on one single page. Focus on high-impact summary and key achievements."
    }
  }
];

export const TEMPLATE_ID_ALIASES = {
  "modern-blue": "onepage-fresher-clean",
  "modern-minimal": "onepage-minimal-swiss",
  "apple-clean": "onepage-fresher-clean",
  "creative-coral": "onepage-creative-editorial",
  "bd-fresher-graduate": "onepage-bd-compact",
  "bd-it-engineer": "onepage-tech-grid",
  "bd-academic-lecturer": "onepage-academic-compact",
  "bd-bank-officer": "bd-bank-po",
  "bd-dhaka-executive": "bd-corporate-standard",
  "bd-medical-clinical": "bd-medical-mbbs-doctor",
  "bd-corporate-navy": "bd-corporate-standard",
  "bd-corporate-maroon": "bd-corporate-standard",
  "dark-mode": "linear-dark",
  "tech-flow": "onepage-it-sidebar",
  "wall-street-fintech": "onepage-investment-banking",
  "silicon-valley-tech": "onepage-tech-grid",
  "bold-style": "executive-slate",
  "professional": "executive-slate",
  "corporate-royal": "executive-slate",
  "harvard-executive": "onepage-executive-brief",
  "director-standard": "executive-slate",
  "emerald-split": "ocean-split",
  "violet-split": "ocean-split",
  "ats-academic": "ats-classic",
  "academic-elegance": "ats-classic",
  "creative-design": "onepage-creative-editorial",
  "sunset-gradient": "onepage-creative-editorial",
  "horizon-purple": "onepage-creative-editorial"
};

export const TEMPLATE_ALIAS_COLORS = {
  "forest-professional": {
    "primaryColor": "#15803d",
    "accentColor": "#22c55e"
  },
  "sun-graduate": {
    "primaryColor": "#d97706",
    "accentColor": "#f59e0b"
  },
  "bd-bank-officer": {
    "primaryColor": "#0369a1",
    "accentColor": "#0284c7"
  },
  "bd-dhaka-executive": {
    "primaryColor": "#1e3a8a",
    "accentColor": "#3b82f6"
  },
  "bd-medical-clinical": {
    "primaryColor": "#0f766e",
    "accentColor": "#14b8a6"
  },
  "bd-corporate-navy": {
    "primaryColor": "#172554",
    "accentColor": "#1e40af"
  },
  "bd-corporate-maroon": {
    "primaryColor": "#881337",
    "accentColor": "#be123c"
  },
  "tech-flow": {
    "primaryColor": "#06b6d4",
    "accentColor": "#0284c7"
  },
  "wall-street-fintech": {
    "primaryColor": "#16a34a",
    "accentColor": "#15803d"
  },
  "silicon-valley-tech": {
    "primaryColor": "#8b5cf6",
    "accentColor": "#a855f7"
  },
  "corporate-royal": {
    "primaryColor": "#1e3a8a",
    "accentColor": "#3b82f6"
  },
  "harvard-executive": {
    "primaryColor": "#991b1b",
    "accentColor": "#dc2626"
  },
  "emerald-split": {
    "primaryColor": "#059669",
    "accentColor": "#10b981"
  },
  "violet-split": {
    "primaryColor": "#7c3aed",
    "accentColor": "#a855f7"
  },
  "sunset-gradient": {
    "primaryColor": "#ea580c",
    "accentColor": "#f59e0b"
  },
  "horizon-purple": {
    "primaryColor": "#9333ea",
    "accentColor": "#a855f7"
  }
};

export const TEMPLATE_CATEGORIES = [
  "All Templates",
  "Bangladesh CVs",
  "International Standard",
  "Modern",
  "Minimal",
  "Executive",
  "Corporate",
  "Technology",
  "IT and Software Engineering",
  "Creative",
  "Academic and Research",
  "Healthcare",
  "Education and Teaching",
  "Business and Management",
  "Finance and Accounting",
  "Engineering",
  "Marketing and Sales",
  "Student and Fresh Graduate",
  "Experienced Professionals",
  "Multiple-Page CVs",
];

export const PREFERRED_CATEGORY_ORDER = [...TEMPLATE_CATEGORIES];

export const deriveLayoutType = (t) => {
  const arch = String(t.layoutArchitecture || t.baseLayout || t.id || '').toLowerCase();
  if (arch === 'onepage-academic-compact' || arch === 'academic-multipage-cv' || arch.includes('academic')) return 'academic';
  if (arch === 'onepage-tech-grid' || arch.includes('grid')) return 'grid';
  if (
    arch === 'onepage-executive-brief' ||
    arch === 'onepage-creative-editorial' ||
    arch === 'onepage-marketing-growth' ||
    arch.includes('editorial')
  ) {
    return 'editorial';
  }
  if (arch === 'onepage-bd-compact' || arch === 'bd-corporate-standard') return 'two-column-right';
  if (
    arch === 'onepage-modern-split' ||
    arch === 'onepage-it-sidebar' ||
    arch === 'onepage-clinical-health' ||
    arch === 'onepage-skilled-trade-pro' ||
    arch === 'executive-slate' ||
    arch === 'ocean-split' ||
    arch.includes('split') ||
    arch.includes('sidebar')
  ) {
    return 'two-column-left';
  }
  return 'single-column';
};

export const deriveProfessions = (t) => {
  const id = String(t.id || '').toLowerCase();

  if (id.includes('trade') || id.includes('skilled')) {
    return ['Senior Technician', 'Field Service Specialist', 'Maintenance Lead'];
  }
  if (id.includes('doctor') || id.includes('clinical') || id.includes('medical')) {
    return ['Medical Officer', 'Clinical Doctor', 'Resident Physician'];
  }
  if (id.includes('nurse') || id.includes('nursing')) {
    return ['Registered Nurse', 'Staff Nurse', 'Clinical Nurse'];
  }
  if (id.includes('pharma')) {
    return ['Pharmacist', 'QA Officer', 'Medical Representative'];
  }
  if (id.includes('frontend') || id.includes('react')) {
    return ['Frontend Developer', 'React Specialist', 'UI Engineer'];
  }
  if (id.includes('backend') || id.includes('node') || id.includes('microservices')) {
    return ['Backend Engineer', 'Node.js Developer', 'API Architect'];
  }
  if (id.includes('fullstack') || id.includes('ts')) {
    return ['Full-Stack Developer', 'TypeScript Engineer', 'Software Architect'];
  }
  if (id.includes('devops') || id.includes('cloud') || id.includes('sre')) {
    return ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'];
  }
  if (id.includes('mobile') || id.includes('flutter') || id.includes('ios') || id.includes('android')) {
    return ['Mobile App Developer', 'Flutter Engineer', 'iOS/Android Specialist'];
  }
  if (id.includes('data-analyst') || id.includes('bi')) {
    return ['Data Analyst', 'BI Specialist', 'Analytics Consultant'];
  }
  if (id.includes('ai') || id.includes('ml')) {
    return ['Machine Learning Engineer', 'AI Researcher', 'Data Scientist'];
  }
  if (id.includes('cyber') || id.includes('security')) {
    return ['Cybersecurity Analyst', 'InfoSec Officer', 'SOC Specialist'];
  }
  if (id.includes('qa') || id.includes('test')) {
    return ['QA Automation Engineer', 'SDET', 'Software Quality Lead'];
  }
  if (id.includes('uiux') || id.includes('designer') || id.includes('product-design')) {
    return ['Product Designer', 'UI/UX Specialist', 'Design System Lead'];
  }
  if (id.includes('product-manager')) {
    return ['Product Manager', 'Technical PO', 'Product Lead'];
  }
  if (id.includes('brand')) {
    return ['Brand Designer', 'Visual Identity Lead', 'Creative Director'];
  }
  if (id.includes('graphic')) {
    return ['Graphic Designer', 'Visual Content Creator', 'Print Designer'];
  }
  if (id.includes('copy') || id.includes('content')) {
    return ['Content Strategist', 'Technical Copywriter', 'Creative Writer'];
  }
  if (id.includes('video') || id.includes('motion')) {
    return ['Motion Designer', 'Video Producer', 'Multimedia Creator'];
  }
  if (id.includes('finance') || id.includes('fpa') || id.includes('investment') || id.includes('accountant') || id.includes('tax')) {
    return ['Financial Analyst', 'FP&A Manager', 'Corporate Accountant'];
  }
  if (id.includes('bank') || id.includes('mto') || id.includes('po')) {
    return ['Bank Officer', 'Management Trainee (MTO)', 'Credit Analyst'];
  }
  if (id.includes('bcs') || id.includes('cadre') || id.includes('govt')) {
    return ['Cadre Officer', 'Govt Administrator', 'Public Sector Executive'];
  }
  if (id.includes('textile') || id.includes('merchandis') || id.includes('garment')) {
    return ['Senior Merchandiser', 'Apparel Production Lead', 'Garment Sourcing Manager'];
  }
  if (id.includes('civil')) {
    return ['Civil Engineer', 'Structural Designer', 'Project Site Engineer'];
  }
  if (id.includes('electrical')) {
    return ['Electrical Engineer', 'Power Systems Specialist', 'Control Systems Engineer'];
  }
  if (id.includes('mechanical')) {
    return ['Mechanical Engineer', 'HVAC Specialist', 'Manufacturing Engineer'];
  }
  if (id.includes('architect')) {
    return ['Architectural Designer', 'BIM Specialist', 'Spatial Planner'];
  }
  if (id.includes('marketing') || id.includes('sales') || id.includes('seo') || id.includes('social')) {
    return ['Growth Marketer', 'SEO Specialist', 'Sales Executive'];
  }
  if (id.includes('hr') || id.includes('talent')) {
    return ['HR Specialist', 'Talent Acquisition Partner', 'People Operations Lead'];
  }
  if (id.includes('teacher') || id.includes('educator') || id.includes('faculty') || id.includes('lecturer')) {
    return ['Educator', 'University Lecturer', 'High School Teacher'];
  }
  if (id.includes('academic') || id.includes('research') || id.includes('scientist') || id.includes('fellow')) {
    return ['Research Fellow', 'Computational Scientist', 'Postdoctoral Scholar'];
  }
  if (id.includes('fresher') || id.includes('intern') || id.includes('student') || id.includes('entry')) {
    return ['Junior Software Engineer', 'Graduate Trainee', 'Intern'];
  }
  if (id.includes('executive') || id.includes('director') || id.includes('founder') || id.includes('slate')) {
    return ['Chief Operating Officer (COO)', 'Managing Director', 'Executive VP'];
  }
  return ['Software Engineer', 'Technical Specialist', 'Professional'];
};

export const deriveCategories = (t) => {
  const cats = new Set();
  const id = String(t.id || '').toLowerCase();
  const oldCats = (t.categories || []).map((c) => String(c).toLowerCase());
  const arch = String(t.layoutArchitecture || '').toLowerCase();
  const desc = String(t.description || '').toLowerCase();

  // Bangladesh CVs
  if (
    id.startsWith('bd-') ||
    id.includes('bangladesh') ||
    oldCats.includes('bangladesh cvs') ||
    id.includes('bd-compact') ||
    desc.includes('bangladeshi')
  ) {
    cats.add('Bangladesh CVs');
  }

  // Technology / IT and Software Engineering
  if (
    id.includes('tech') ||
    id.includes('dev') ||
    id.includes('frontend') ||
    id.includes('backend') ||
    id.includes('fullstack') ||
    id.includes('mobile') ||
    id.includes('ai-') ||
    id.includes('ml-') ||
    id.includes('cyber') ||
    id.includes('qa') ||
    id.includes('cs-') ||
    id.includes('it-') ||
    id.includes('cloud') ||
    oldCats.includes('technology') ||
    oldCats.includes('it')
  ) {
    cats.add('Technology');
    cats.add('IT and Software Engineering');
  }

  // Creative
  if (
    id.includes('creative') ||
    id.includes('design') ||
    id.includes('uiux') ||
    id.includes('brand') ||
    id.includes('graphic') ||
    id.includes('video') ||
    id.includes('editorial') ||
    arch === 'onepage-creative-editorial'
  ) {
    cats.add('Creative');
  }

  // Academic and Research
  if (
    id.includes('academic') ||
    id.includes('research') ||
    id.includes('scientist') ||
    id.includes('fellow') ||
    id.includes('phd') ||
    oldCats.includes('academic') ||
    arch === 'onepage-academic-compact'
  ) {
    cats.add('Academic and Research');
  }

  // Education and Teaching
  if (
    id.includes('teacher') ||
    id.includes('educator') ||
    id.includes('lecturer') ||
    id.includes('faculty') ||
    id.includes('education') ||
    desc.includes('teaching') ||
    desc.includes('faculty')
  ) {
    cats.add('Education and Teaching');
  }

  // Healthcare
  if (
    id.includes('doctor') ||
    id.includes('nurse') ||
    id.includes('nursing') ||
    id.includes('clinical') ||
    id.includes('pharma') ||
    id.includes('medical') ||
    desc.includes('medical') ||
    desc.includes('clinical')
  ) {
    cats.add('Healthcare');
  }

  // Business and Management
  if (
    id.includes('business') ||
    id.includes('management') ||
    id.includes('manager') ||
    id.includes('pmp') ||
    id.includes('scrum') ||
    id.includes('operations') ||
    id.includes('supply-chain') ||
    id.includes('consultant')
  ) {
    cats.add('Business and Management');
  }

  // Finance and Accounting
  if (
    id.includes('finance') ||
    id.includes('accountant') ||
    id.includes('banking') ||
    id.includes('investment') ||
    id.includes('tax') ||
    id.includes('bank') ||
    desc.includes('banking') ||
    desc.includes('accounting')
  ) {
    cats.add('Finance and Accounting');
  }

  // Engineering
  if (
    id.includes('engineer') ||
    id.includes('civil') ||
    id.includes('electrical') ||
    id.includes('mechanical') ||
    id.includes('architect') ||
    id.includes('tech-grid')
  ) {
    cats.add('Engineering');
  }

  // Marketing and Sales
  if (
    id.includes('marketing') ||
    id.includes('sales') ||
    id.includes('seo') ||
    id.includes('social') ||
    id.includes('pr-') ||
    id.includes('communications') ||
    id.includes('account-executive') ||
    id.includes('customer-success')
  ) {
    cats.add('Marketing and Sales');
  }

  // Executive
  if (
    id.includes('executive') ||
    id.includes('director') ||
    id.includes('founder') ||
    id.includes('lead') ||
    id.includes('slate') ||
    oldCats.includes('executive')
  ) {
    cats.add('Executive');
  }

  // Corporate
  if (
    id.includes('corp') ||
    id.includes('standard') ||
    id.includes('management') ||
    id.includes('hr') ||
    oldCats.includes('professional') ||
    cats.has('Business and Management') ||
    cats.has('Finance and Accounting')
  ) {
    cats.add('Corporate');
  }

  // Student and Fresh Graduate
  if (
    id.includes('fresher') ||
    id.includes('intern') ||
    id.includes('student') ||
    id.includes('graduate') ||
    id.includes('scholarship') ||
    id.includes('entry') ||
    oldCats.includes('student / fresh graduate')
  ) {
    cats.add('Student and Fresh Graduate');
  }

  // Experienced Professionals
  if (
    !cats.has('Student and Fresh Graduate') ||
    t.isOnePage === false ||
    cats.has('Executive') ||
    id.includes('senior') ||
    id.includes('lead') ||
    id.includes('manager')
  ) {
    cats.add('Experienced Professionals');
  }

  // Modern & Minimal
  if (
    oldCats.includes('modern') ||
    id.includes('modern') ||
    arch.includes('modern') ||
    arch.includes('split')
  ) {
    cats.add('Modern');
  }
  if (
    oldCats.includes('minimal') ||
    id.includes('minimal') ||
    arch.includes('swiss') ||
    arch.includes('minimal')
  ) {
    cats.add('Minimal');
  }

  // International Standard
  if (
    oldCats.includes('standard') ||
    id.includes('ats') ||
    arch.includes('ats') ||
    id.includes('standard') ||
    arch.includes('linear')
  ) {
    cats.add('International Standard');
  }

  // Multiple-Page CVs
  if (t.isOnePage === false || oldCats.includes('multiple-page cvs')) {
    cats.add('Multiple-Page CVs');
  }

  return Array.from(cats);
};

export const deriveDefaultDesignTokens = (t, layoutType) => {
  const id = String(t.id || '').toLowerCase();
  const primary = t.thumbnailColor || '#2563eb';
  const accent = t.accentColor || primary;
  const isAcademic = layoutType === 'academic' || id.includes('academic');
  const isTech = id.includes('tech') || id.includes('dev') || id.includes('cloud') || id.includes('it');
  const isExecutive = layoutType === 'editorial' || id.includes('executive');

  const headingFont = isAcademic ? 'Lora' : isExecutive ? 'Merriweather' : 'Plus Jakarta Sans';
  const bodyFont = isTech ? 'JetBrains Mono' : 'Inter';

  return {
    primaryColor: primary,
    accentColor: accent,
    headingColor: '#0f172a',
    bodyColor: '#334155',
    backgroundColor: '#ffffff',
    sidebarColor: layoutType === 'two-column-left' ? '#f8fafc' : '#ffffff',
    fontFamily: headingFont,
    headingFont,
    bodyFont,
    fontSize: 'normal',
    lineSpacing: 'normal',
    sectionSpacing: 14,
    itemSpacing: 10,
    pageMargin: 24,
    dividerThickness: 1,
    columnRatio:
      layoutType === 'two-column-left'
        ? '30/70'
        : layoutType === 'two-column-right'
        ? '70/30'
        : '100',
  };
};

export const enrichTemplate = (t) => {
  const layoutType = deriveLayoutType(t);
  const hasPhoto = Boolean(t.photoFormat && t.photoFormat !== 'none');
  const professions = deriveProfessions(t);
  const categories = deriveCategories(t);
  const defaultDesignTokens = deriveDefaultDesignTokens(t, layoutType);
  const personaPreviewData = resolvePersonaForTemplate(t);

  return {
    ...t,
    categories,
    professions,
    layoutType,
    hasPhoto,
    defaultDesignTokens,
    personaPreviewData,
  };
};

export const TEMPLATES_REGISTRY = RAW_TEMPLATES_REGISTRY.map(enrichTemplate);

export const resolveTemplateId = (templateId) => {
  if (!templateId) return 'onepage-fresher-clean';
  const normalized = String(templateId).trim();
  const existsDirectly = TEMPLATES_REGISTRY.some((t) => t.id === normalized);
  if (existsDirectly) return normalized;
  return TEMPLATE_ID_ALIASES[normalized] || 'onepage-fresher-clean';
};

export const resolveTemplateMeta = (templateId, templates = TEMPLATES_REGISTRY) => {
  const canonicalId = resolveTemplateId(templateId);
  return (
    templates.find((t) => t.id === canonicalId) ||
    TEMPLATES_REGISTRY.find((t) => t.id === canonicalId) ||
    TEMPLATES_REGISTRY[0]
  );
};

export const templateMatchesCategory = (template, selectedCategory) => {
  if (
    !selectedCategory ||
    selectedCategory === 'All Templates' ||
    selectedCategory === 'All CVs' ||
    selectedCategory === 'All'
  ) {
    return true;
  }
  if (selectedCategory === 'One-Page CVs') {
    return Boolean(template.isOnePage || template.categories?.includes('One-Page CVs'));
  }
  if (selectedCategory === 'Multiple-Page CVs') {
    return template.isOnePage === false || Boolean(template.categories?.includes('Multiple-Page CVs'));
  }
  if (Array.isArray(template.categories) && template.categories.includes(selectedCategory)) {
    return true;
  }
  if (selectedCategory === 'Bangladesh CVs') {
    return (
      template.category === 'Bangladesh CVs' ||
      template.categories?.includes('Bangladesh CVs') ||
      template.id?.startsWith('bd-') ||
      template.id === 'onepage-bd-compact'
    );
  }
  if (selectedCategory === 'International Standard') {
    return (
      template.categories?.includes('Standard') ||
      template.categories?.includes('Professional') ||
      template.category === 'Standard' ||
      template.id?.includes('ats')
    );
  }
  if (selectedCategory === 'Technology') {
    return (
      template.categories?.includes('Technology') ||
      template.categories?.includes('IT') ||
      template.categories?.includes('IT and Software Engineering')
    );
  }
  if (selectedCategory === 'IT and Software Engineering') {
    return (
      template.categories?.includes('IT and Software Engineering') ||
      template.categories?.includes('IT') ||
      template.categories?.includes('Technology')
    );
  }
  if (selectedCategory === 'Academic and Research') {
    return (
      template.categories?.includes('Academic and Research') ||
      template.categories?.includes('Academic') ||
      template.category === 'Academic'
    );
  }
  if (selectedCategory === 'Student and Fresh Graduate') {
    return (
      template.categories?.includes('Student and Fresh Graduate') ||
      template.categories?.includes('Student / Fresh Graduate')
    );
  }
  if (selectedCategory === 'Experienced Professionals') {
    return (
      template.categories?.includes('Experienced Professionals') ||
      (!template.categories?.includes('Student and Fresh Graduate') &&
        !template.categories?.includes('Student / Fresh Graduate'))
    );
  }
  return template.category === selectedCategory;
};

export const getDynamicCategories = (templates = TEMPLATES_REGISTRY) => {
  return [...TEMPLATE_CATEGORIES];
};
