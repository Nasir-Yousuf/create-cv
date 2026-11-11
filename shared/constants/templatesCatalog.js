/**
 * Canonical Template Catalog, Dynamic Categories, One-Page Guidance, and Backward-Compatible Aliases.
 * Every template in TEMPLATES_REGISTRY represents a genuinely distinct layout architecture.
 */

export const PREFERRED_CATEGORY_ORDER = [
  'All CVs',
  'One-Page CVs',
  'Bangladesh CVs',
  'Student / Fresh Graduate',
  'Modern',
  'Minimal',
  'Standard',
  'Professional',
  'Executive',
  'Technology',
  'IT',
  'Academic',
  'Multiple-Page CVs',
];

export const TEMPLATES_REGISTRY = [
  // =========================================================================
  // DEDICATED ONE-PAGE CV COLLECTION (Prominent Default Experience)
  // =========================================================================
  {
    id: 'onepage-fresher-clean',
    name: 'Fresh Graduate Clean',
    category: 'One-Page CVs',
    categories: ['One-Page CVs', 'Student / Fresh Graduate', 'Modern', 'Minimal', 'Standard'],
    isOnePage: true,
    isFeatured: true,
    description:
      'Purpose-built single-page A4 CV prioritizing fresh graduates and early-career applicants. Highlights education, key projects, skills pills, and concise experience with clean breathing room.',
    badge: '1-Page Default',
    isPremium: false,
    thumbnailColor: '#2563eb',
    photoFormat: 'circle',
    features: [
      'Guaranteed 1-Page Balanced Layout',
      'Education & Projects Priority',
      'Crisp Contact Strip & Skill Pills',
      'ATS-Readable Hierarchy',
    ],
    pageGuidance: {
      recommendedMaxWords: 430,
      maxExperienceItems: 2,
      maxEducationItems: 3,
      maxBulletsPerRole: 3,
      tip: 'Best with concise career summary (2-3 lines), top 2-3 education rows, 2 projects/internships, and up to 3 impactful bullets per role.',
    },
  },
  {
    id: 'onepage-bd-compact',
    name: 'BD Graduate & Corporate 1-Page',
    category: 'Bangladesh CVs',
    categories: [
      'One-Page CVs',
      'Bangladesh CVs',
      'Student / Fresh Graduate',
      'Professional',
      'Standard',
    ],
    isOnePage: true,
    isFeatured: true,
    description:
      'Modern Bangladeshi CV tailored to fit a crisp single A4 page. Features top-right portrait/passport photo, Career Objective, structured SSC/HSC/University table, skills, projects, and a single-line declaration.',
    badge: 'Bangladesh 1-Page',
    isPremium: false,
    thumbnailColor: '#059669',
    photoFormat: 'portrait',
    features: [
      'Portrait Photo Top-Right',
      'Compact Academic CGPA Table',
      'Clean Contact & BD Context',
      'Fits Single A4 Page',
    ],
    pageGuidance: {
      recommendedMaxWords: 440,
      maxExperienceItems: 2,
      maxEducationItems: 3,
      maxBulletsPerRole: 2,
      tip: 'Keeps Bangladeshi recruiter expectations (passport photo, academic credentials, objective, 1 referee line) clean on one page without extra personal trivia clutter.',
    },
  },
  {
    id: 'onepage-modern-split',
    name: 'Modern Split One-Pager',
    category: 'Modern',
    categories: ['One-Page CVs', 'Modern', 'Professional', 'Student / Fresh Graduate'],
    isOnePage: true,
    isFeatured: true,
    description:
      'Clean 30/70 two-column one-page architecture placing contact details, skills tags, certifications, and languages in a subtle tinted sidebar so experience and projects shine in the main column.',
    badge: 'Split 1-Page',
    isPremium: false,
    thumbnailColor: '#0284c7',
    photoFormat: 'circle',
    features: [
      '30/70 Space-Smart Split Column',
      'High Readability at 10pt Equivalent',
      'Sidebar Skill & Language Badges',
      'Zero Wasted Horizontal Space',
    ],
    pageGuidance: {
      recommendedMaxWords: 470,
      maxExperienceItems: 3,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Two-column density lets early-career professionals fit up to 3 roles/projects cleanly on 1 A4 sheet.',
    },
  },
  {
    id: 'onepage-minimal-swiss',
    name: 'Swiss Minimalist One-Page',
    category: 'Minimal',
    categories: ['One-Page CVs', 'Minimal', 'Modern', 'Professional'],
    isOnePage: true,
    isFeatured: false,
    description:
      'Scandinavian/Apple-inspired monochrome typographic grid with left-aligned uppercase section labels and whisper-clean hairline dividers.',
    badge: 'Swiss Minimal',
    isPremium: false,
    thumbnailColor: '#1e293b',
    photoFormat: 'rounded',
    features: [
      'Left Label Grid Alignment',
      'Ultra-Clean Monochrome Palette',
      'Generous Scannability',
      'Modern Whitespace Rhythm',
    ],
    pageGuidance: {
      recommendedMaxWords: 400,
      maxExperienceItems: 2,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Keep bullets sharp (1 line each) to preserve the calm Swiss typographic whitespace.',
    },
  },
  {
    id: 'onepage-tech-grid',
    name: 'Tech & Engineering Matrix',
    category: 'Technology',
    categories: ['One-Page CVs', 'Technology', 'IT', 'Modern', 'Student / Fresh Graduate'],
    isOnePage: true,
    isFeatured: true,
    description:
      'Engineered for software developers, CS graduates, and technical roles. Features GitHub/Portfolio strip, categorized tech stack matrix, and impact-focused project & work cards.',
    badge: 'Tech 1-Page',
    isPremium: false,
    thumbnailColor: '#4f46e5',
    photoFormat: 'circle',
    features: [
      'GitHub & Stack Header Bar',
      'Categorized Tech Skills Matrix',
      'Project & Internship Impact Cards',
      'Developer-Friendly Typography',
    ],
    pageGuidance: {
      recommendedMaxWords: 460,
      maxExperienceItems: 3,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Group tools concisely by stack and keep 2-3 high-impact shipped projects or internships.',
    },
  },
  {
    id: 'onepage-it-sidebar',
    name: 'IT Dark Rail One-Page',
    category: 'IT',
    categories: ['One-Page CVs', 'IT', 'Technology', 'Modern'],
    isOnePage: true,
    isFeatured: false,
    description:
      'High-contrast obsidian left navigation rail with crisp technical badges paired against a spacious white main column for infrastructure, QA, cloud, and IT specialists.',
    badge: 'IT & Cloud',
    isPremium: false,
    thumbnailColor: '#0f172a',
    photoFormat: 'circle',
    features: [
      'High-Contrast Dark Sidebar',
      'Certifications & Stack Rail',
      'Clean Technical Timeline',
      'Print-Balanced Contrast',
    ],
    pageGuidance: {
      recommendedMaxWords: 460,
      maxExperienceItems: 3,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Place core certifications, systems, and languages in the dark rail to keep the main column uncluttered.',
    },
  },
  {
    id: 'onepage-ats-strict',
    name: 'Standard ATS One-Page',
    category: 'Standard',
    categories: ['One-Page CVs', 'Standard', 'Minimal', 'Professional', 'Student / Fresh Graduate'],
    isOnePage: true,
    isFeatured: false,
    description:
      'Single-column, plain-structure corporate standard built for automated Applicant Tracking Systems (ATS), LinkedIn Easy Apply, and multinational graduate programs.',
    badge: 'ATS 100%',
    isPremium: false,
    thumbnailColor: '#334155',
    photoFormat: 'none',
    features: [
      '100% Machine-Parseable Flow',
      'Standard Section Headings',
      'Compact Serif/Sans Letterhead',
      'Zero Columns or Graphics Overlap',
    ],
    pageGuidance: {
      recommendedMaxWords: 450,
      maxExperienceItems: 3,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Avoids photos and sidebars for maximum ATS compliance; use concise quantified bullets.',
    },
  },
  {
    id: 'onepage-executive-brief',
    name: 'Executive Brief One-Page',
    category: 'Executive',
    categories: ['One-Page CVs', 'Executive', 'Professional', 'Minimal'],
    isOnePage: true,
    isFeatured: false,
    description:
      'Distilled leadership summary format for managers, team leads, and senior candidates applying to executive roles that strictly request a 1-page resume.',
    badge: 'Executive 1-Page',
    isPremium: false,
    thumbnailColor: '#1e3a8a',
    photoFormat: 'portrait',
    features: [
      'Double-Rule Letterhead Accent',
      '2-Column Competency Highlights',
      'Board & KPI Focused Narrative',
      '1-Page Senior Precision',
    ],
    pageGuidance: {
      recommendedMaxWords: 430,
      maxExperienceItems: 3,
      maxEducationItems: 2,
      maxBulletsPerRole: 2,
      tip: 'Focus on the last 2-3 leadership roles and headline revenue/team metrics.',
    },
  },
  {
    id: 'onepage-academic-compact',
    name: 'Academic & Scholarship 1-Page',
    category: 'Academic',
    categories: ['One-Page CVs', 'Academic', 'Student / Fresh Graduate', 'Standard'],
    isOnePage: true,
    isFeatured: false,
    description:
      'Clean scholarly single-page layout emphasizing Education, CGPA, Thesis/Publications/Research Projects, Teaching Assistantships, and two side-by-side referees.',
    badge: 'Scholar / Research',
    isPremium: false,
    thumbnailColor: '#7c2d12',
    photoFormat: 'none',
    features: [
      'Education & Research First',
      'Thesis & Lab Highlights',
      '2-Column Academic Referees',
      'Clean Grant/Admission Style',
    ],
    pageGuidance: {
      recommendedMaxWords: 430,
      maxExperienceItems: 2,
      maxEducationItems: 3,
      maxBulletsPerRole: 3,
      tip: 'Ideal for scholarship applications, MS/PhD cover CVs, lecturer shortlists, and fresh research graduates.',
    },
  },
  {
    id: 'onepage-creative-editorial',
    name: 'Editorial Studio One-Page',
    category: 'Modern',
    categories: ['One-Page CVs', 'Modern', 'Minimal', 'Student / Fresh Graduate'],
    isOnePage: true,
    isFeatured: false,
    description:
      'Contemporary magazine-inspired one-pager featuring a crisp vertical accent bar, balanced header badge, and asymmetric two-column showcase for portfolio work and skills.',
    badge: 'Editorial Style',
    isPremium: false,
    thumbnailColor: '#e11d48',
    photoFormat: 'rounded',
    features: [
      'Vertical Accent Stripe Header',
      'Portfolio & Case Study Blocks',
      'Asymmetric 2-Col Footer Grid',
      'Distinct Modern Personality',
    ],
    pageGuidance: {
      recommendedMaxWords: 410,
      maxExperienceItems: 2,
      maxEducationItems: 2,
      maxBulletsPerRole: 3,
      tip: 'Designed for product, design, marketing, and creative graduates wanting distinction on 1 page.',
    },
  },

  // =========================================================================
  // MULTIPLE-PAGE CV COLLECTION (Detailed Senior, Academic & Full BD Formats)
  // =========================================================================
  {
    id: 'bd-corporate-standard',
    name: 'BD Corporate Standard (Detailed Multi-Page)',
    category: 'Multiple-Page CVs',
    categories: ['Multiple-Page CVs', 'Bangladesh CVs', 'Standard', 'Professional'],
    isOnePage: false,
    isFeatured: false,
    description:
      'Comprehensive traditional Bangladeshi CV format with formal passport photo box, Career Objective, full work history, SSC/HSC/Honors academic table, personal bio-data, 2 referees, and signed declaration.',
    badge: 'Multi-Page BD',
    isPremium: false,
    thumbnailColor: '#059669',
    photoFormat: 'portrait',
    features: [
      'Full BD Academic Table (SSC/HSC/BSc)',
      'Detailed Personal Information Block',
      '2 Formal Referees & Declaration',
      'Supports 2+ Detailed Pages',
    ],
    pageGuidance: {
      recommendedMaxWords: 1200,
      tip: 'Designed to span 2 or more pages naturally for full Bangladeshi corporate, government, or bank dossiers.',
    },
  },
  {
    id: 'executive-slate',
    name: 'Executive Slate Prestige (Multi-Page)',
    category: 'Multiple-Page CVs',
    categories: ['Multiple-Page CVs', 'Executive', 'Professional'],
    isOnePage: false,
    isFeatured: false,
    description:
      'Authoritative dark slate banner with portrait framing, refined serif headings, and spacious chronological blocks built for directors, VPs, and seasoned executives with extensive career histories.',
    badge: 'Multi-Page Exec',
    isPremium: false,
    thumbnailColor: '#0f172a',
    photoFormat: 'portrait',
    features: [
      'Dark Slate Executive Header',
      'Serif Prestige Hierarchy',
      'Full Board & Career Archive',
      'Natural Multi-Page Flow',
    ],
    pageGuidance: {
      recommendedMaxWords: 1300,
      tip: 'Allows comprehensive executive roles, metrics, board memberships, and references without compression.',
    },
  },
  {
    id: 'ocean-split',
    name: 'Ocean Dual-Column (Multi-Page)',
    category: 'Multiple-Page CVs',
    categories: ['Multiple-Page CVs', 'Professional', 'Modern', 'Technology'],
    isOnePage: false,
    isFeatured: false,
    description:
      'Full-length deep navy two-column sidebar layout offering generous room for detailed work histories, multiple projects, skill ratings, languages, and certifications across pages.',
    badge: 'Multi-Page Split',
    isPremium: false,
    thumbnailColor: '#0284c7',
    photoFormat: 'circle',
    features: [
      'Full-Height Navy Sidebar',
      'Room for Extensive Experience',
      'Visual Skill Tags & Contact Rail',
      'Ideal for 4+ Years Experience',
    ],
    pageGuidance: {
      recommendedMaxWords: 1100,
      tip: 'Recommended for professionals with multiple roles, detailed project logs, and certifications.',
    },
  },
  {
    id: 'linear-dark',
    name: 'Linear Obsidian Tech (Multi-Page)',
    category: 'Multiple-Page CVs',
    categories: ['Multiple-Page CVs', 'Technology', 'IT', 'Modern'],
    isOnePage: false,
    isFeatured: false,
    description:
      'Spacious dark-header engineering profile built for senior engineers and architects showcasing multi-year system architectures, technical stacks, and multiple open-source/work projects.',
    badge: 'Multi-Page Tech',
    isPremium: false,
    thumbnailColor: '#6366f1',
    photoFormat: 'circle',
    features: [
      'Obsidian Terminal Header',
      'Detailed Architecture Timelines',
      'Extensive Project & Stack Cards',
      'Senior Engineer Scale',
    ],
    pageGuidance: {
      recommendedMaxWords: 1200,
      tip: 'Best suited for Senior/Staff engineers needing full multi-page space for technical depth.',
    },
  },
  {
    id: 'ats-classic',
    name: 'ATS Scholarly Full CV (Multi-Page)',
    category: 'Multiple-Page CVs',
    categories: ['Multiple-Page CVs', 'Academic', 'Standard'],
    isOnePage: false,
    isFeatured: false,
    description:
      'Traditional academic and institutional multi-page curriculum vitae supporting exhaustive publication lists, degrees, certifications, references, and declaration.',
    badge: 'Multi-Page Academic',
    isPremium: false,
    thumbnailColor: '#000000',
    photoFormat: 'none',
    features: [
      'Pure Classical Serif Typography',
      'Full Academic & Publication Flow',
      'Complete Reference & Declaration',
      'Zero Page-Length Constraint',
    ],
    pageGuidance: {
      recommendedMaxWords: 1600,
      tip: 'Ideal for faculty, researchers, PhD applicants, and extensive multi-page academic CVs.',
    },
  },
];

/**
 * Backward compatibility: map all deprecated/duplicate legacy template IDs
 * to their cleanest surviving equivalent in TEMPLATES_REGISTRY so saved CVs
 * and legacy URLs continue working without errors.
 */
export const TEMPLATE_ID_ALIASES = {
  // Old generic & modern duplicates
  'modern-blue': 'onepage-fresher-clean',
  'minimal-blue': 'onepage-fresher-clean',
  'daniel-carter': 'onepage-fresher-clean',
  'breeze-compact': 'onepage-modern-split',
  'sun-graduate': 'onepage-fresher-clean',
  'forest-professional': 'onepage-modern-split',
  'modern-minimal': 'onepage-minimal-swiss',
  'elegant-minimal': 'onepage-minimal-swiss',
  'simple-white': 'onepage-ats-strict',
  'clean-layout': 'onepage-minimal-swiss',
  'apple-clean': 'onepage-minimal-swiss',
  'apple-silicon-light': 'onepage-minimal-swiss',
  'apple-dark': 'onepage-minimal-swiss',
  'zurich-clean': 'onepage-minimal-swiss',
  'nordic-minimal': 'onepage-minimal-swiss',

  // Old Bangladesh duplicates
  'bd-fresher-graduate': 'onepage-bd-compact',
  'bd-it-engineer': 'onepage-tech-grid',
  'bd-academic-lecturer': 'onepage-academic-compact',
  'bd-bank-officer': 'bd-corporate-standard',
  'bd-dhaka-executive': 'bd-corporate-standard',
  'bd-medical-clinical': 'bd-corporate-standard',
  'bd-corporate-navy': 'bd-corporate-standard',
  'bd-corporate-maroon': 'bd-corporate-standard',

  // Old tech/executive/split/ats/creative duplicates
  'dark-mode': 'linear-dark',
  'tech-flow': 'onepage-it-sidebar',
  'wall-street-fintech': 'onepage-tech-grid',
  'silicon-valley-tech': 'onepage-tech-grid',
  'bold-style': 'executive-slate',
  professional: 'executive-slate',
  'corporate-royal': 'executive-slate',
  'harvard-executive': 'onepage-executive-brief',
  'director-standard': 'executive-slate',
  'emerald-split': 'ocean-split',
  'violet-split': 'ocean-split',
  'ats-academic': 'ats-classic',
  'academic-elegance': 'ats-classic',
  'creative-design': 'onepage-creative-editorial',
  'creative-coral': 'onepage-creative-editorial',
  'sunset-gradient': 'onepage-creative-editorial',
  'horizon-purple': 'onepage-creative-editorial',
};

export const TEMPLATE_ALIAS_COLORS = {
  'forest-professional': { primaryColor: '#15803d', accentColor: '#22c55e' },
  'sun-graduate': { primaryColor: '#d97706', accentColor: '#f59e0b' },
  'bd-bank-officer': { primaryColor: '#0369a1', accentColor: '#0284c7' },
  'bd-dhaka-executive': { primaryColor: '#1e3a8a', accentColor: '#3b82f6' },
  'bd-medical-clinical': { primaryColor: '#0f766e', accentColor: '#14b8a6' },
  'bd-corporate-navy': { primaryColor: '#172554', accentColor: '#1e40af' },
  'bd-corporate-maroon': { primaryColor: '#881337', accentColor: '#be123c' },
  'tech-flow': { primaryColor: '#06b6d4', accentColor: '#0284c7' },
  'wall-street-fintech': { primaryColor: '#16a34a', accentColor: '#15803d' },
  'silicon-valley-tech': { primaryColor: '#8b5cf6', accentColor: '#a855f7' },
  'corporate-royal': { primaryColor: '#1e3a8a', accentColor: '#3b82f6' },
  'harvard-executive': { primaryColor: '#991b1b', accentColor: '#dc2626' },
  'emerald-split': { primaryColor: '#059669', accentColor: '#10b981' },
  'violet-split': { primaryColor: '#7c3aed', accentColor: '#a855f7' },
  'sunset-gradient': { primaryColor: '#ea580c', accentColor: '#f59e0b' },
  'horizon-purple': { primaryColor: '#9333ea', accentColor: '#a855f7' },
};

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
  if (!selectedCategory || selectedCategory === 'All CVs' || selectedCategory === 'All') {
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
  return template.category === selectedCategory;
};

export const getDynamicCategories = (templates = TEMPLATES_REGISTRY) => {
  const found = new Set(['All CVs']);
  templates.forEach((t) => {
    if (t.isOnePage) found.add('One-Page CVs');
    if (t.isOnePage === false) found.add('Multiple-Page CVs');
    if (t.category) found.add(t.category);
    if (Array.isArray(t.categories)) {
      t.categories.forEach((cat) => {
        if (cat && cat !== 'All') found.add(cat);
      });
    }
  });

  const ordered = PREFERRED_CATEGORY_ORDER.filter((cat) => found.has(cat));
  const extra = Array.from(found).filter((cat) => !PREFERRED_CATEGORY_ORDER.includes(cat));
  return [...ordered, ...extra];
};

export const TEMPLATE_CATEGORIES = getDynamicCategories(TEMPLATES_REGISTRY);

