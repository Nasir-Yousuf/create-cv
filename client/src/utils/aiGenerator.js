/**
 * Client-side Heuristic Helpers & Fallback Generators
 * Note: All real AI transformations run strictly server-side via /api/ai endpoints.
 * These client helpers provide instant local fallbacks and 0ms validation for UI badges.
 */

export const PRESET_ROLES = [
  {
    role: "Software Engineer / IT Professional",
    category: "Tech & Engineering",
    keywords: ["Full Stack", "React", "Node.js", "Python", "Cloud Architecture", "Agile"],
    bios: [
      "Results-driven Software Engineer with proven experience developing high-performance web applications and scalable microservices. Passionate about clean code architecture, database optimization, and cross-functional team collaboration to deliver resilient digital products.",
      "Dedicated Full-Stack Developer proficient in modern frontend frameworks and distributed backend systems. Track record of improving system uptime and reducing API response latency while adhering to agile sprint deadlines.",
      "Detail-oriented IT Professional with strong problem-solving skills and a solid academic background in Computer Science. Experienced in architecting RESTful APIs, cloud containerization, and modern CI/CD delivery pipelines."
    ]
  },
  {
    role: "Banking & Financial Analyst",
    category: "Banking & Finance",
    keywords: ["Credit Analysis", "Commercial Banking", "Risk Assessment", "Financial Modeling", "MS Excel"],
    bios: [
      "Ambitious Banking and Finance professional with a strong foundation in credit risk analysis, financial reporting, and portfolio evaluation. Committed to ensuring rigorous compliance with Bangladesh Bank guidelines while optimizing client relationship growth.",
      "Detail-oriented Financial Analyst with expertise in quantitative data analysis, commercial loan underwriting, and variance analysis. Proven ability to synthesize complex fiscal statements into actionable executive insights.",
      "Energetic Banking Officer with solid experience in retail operations, customer portfolio management, and automated ledger balancing. Dedicated to maintaining high accuracy, integrity, and client satisfaction."
    ]
  },
  {
    role: "Fresh University Graduate / Entry Level",
    category: "Freshers / Entry",
    keywords: ["Academic Excellence", "Leadership", "Extracurriculars", "Quick Learner", "Problem Solving"],
    bios: [
      "Motivated and academically distinguished graduate seeking an entry-level position to apply solid theoretical foundations, strong analytical problem-solving skills, and a proactive work ethic within a forward-thinking organization.",
      "Energetic and detail-oriented fresher with demonstrated leadership through student organizations, project coordination, and internships. Eager to contribute fresh perspectives, continuous learning agility, and dependable team support.",
      "Goal-driven university graduate with a solid academic track record and passion for professional excellence. Ready to leverage strong communication, digital literacy, and collaborative abilities to achieve organizational objectives."
    ]
  },
  {
    role: "Corporate Executive & Management",
    category: "Executive",
    keywords: ["Strategic Planning", "P&L Management", "Operational Excellence", "Team Leadership"],
    bios: [
      "Strategic Senior Executive with 8+ years of cross-industry leadership driving revenue growth, operational efficiency, and organizational transformation. Adept at navigating complex market dynamics and scaling high-performing teams.",
      "Accomplished Business Manager with a demonstrated history of optimizing corporate supply chains, stakeholder relationships, and profitability. Combines analytical rigor with visionary human capital management.",
      "Versatile Operations Director experienced in multi-million project governance, resource allocation, and change management. Committed to long-term sustainable enterprise value and client satisfaction."
    ]
  },
  {
    role: "Sales & Marketing Specialist",
    category: "Commercial & Marketing",
    keywords: ["B2B Sales", "Brand Strategy", "Digital Marketing", "Client Acquisition", "CRM"],
    bios: [
      "Dynamic Marketing & Sales Specialist with extensive experience in campaign strategy, lead generation, and B2B client relationship management. Track record of consistently outperforming quarterly revenue targets.",
      "Results-focused Growth Marketer proficient in digital advertising, social media analytics, and customer retention funnels. Skilled at translating market research into compelling brand positioning and measurable ROI.",
      "High-energy Business Development Executive skilled in negotiation, consultative sales, and strategic partnerships. Proven ability to expand market share and drive repeat corporate business."
    ]
  },
  {
    role: "Medical & Healthcare Professional",
    category: "Healthcare",
    keywords: ["Patient Care", "Clinical Rotations", "BMDC Registered", "Emergency Medicine", "Diagnostics"],
    bios: [
      "Compassionate, BMDC-registered Medical Officer with robust clinical training across inpatient, emergency, and outpatient departments. Dedicated to evidence-based healthcare delivery, thorough diagnostic assessment, and patient-first care.",
      "Diligent Healthcare Professional committed to high standards of clinical excellence, medical ethics, and empathetic bedside manner. Experienced in interdisciplinary medical team coordination and emergency triage.",
      "Analytical and caring physician with proven capability in patient diagnosis, surgical assistance, and preventive healthcare counseling. Eager to contribute to a premier clinical healthcare institution."
    ]
  }
];

/**
 * Generate fallback bio / summary based on role
 */
export const generateSmartBio = (jobTitle = '', education = [], experience = [], rolePreset = null) => {
  const title = (jobTitle || '').trim().toLowerCase();

  if (rolePreset && rolePreset.bios) {
    const randomIdx = Math.floor(Math.random() * rolePreset.bios.length);
    return rolePreset.bios[randomIdx];
  }

  if (title.includes('software') || title.includes('developer') || title.includes('engineer') || title.includes('frontend') || title.includes('backend') || title.includes('full stack')) {
    const list = PRESET_ROLES[0].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (title.includes('bank') || title.includes('finance') || title.includes('account') || title.includes('audit') || title.includes('credit')) {
    const list = PRESET_ROLES[1].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (title.includes('fresher') || title.includes('graduate') || title.includes('intern') || title.includes('entry') || (!experience || experience.length === 0)) {
    const list = PRESET_ROLES[2].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (title.includes('director') || title.includes('manager') || title.includes('executive') || title.includes('lead') || title.includes('head')) {
    const list = PRESET_ROLES[3].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (title.includes('market') || title.includes('sales') || title.includes('business development') || title.includes('seo') || title.includes('growth')) {
    const list = PRESET_ROLES[4].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (title.includes('doctor') || title.includes('medical') || title.includes('nurse') || title.includes('clinical') || title.includes('health')) {
    const list = PRESET_ROLES[5].bios;
    return list[Math.floor(Math.random() * list.length)];
  }

  const latestDegree = education?.[0]?.degree || 'higher education';
  const displayTitle = jobTitle || 'Professional';
  return `Dedicated and analytical ${displayTitle} with a solid background in ${latestDegree}. Proven track record in streamlining operational workflows, managing client deliverables under pressure, and maintaining high standards of quality and teamwork.`;
};

/**
 * Enhance single bullet point (rule-based client fallback with [X]% metric placeholder)
 */
export const enhanceBulletPoint = (text, role = '') => {
  if (!text || text.trim().length < 5) {
    return "Architected key operational processes, improving team efficiency by [X]% and reducing turn-around time by [Number] days.";
  }

  const clean = text.trim();
  const prefixes = [
    "Spearheaded the development and deployment of ",
    "Streamlined cross-functional workflows for ",
    "Successfully delivered end-to-end deliverables for ",
    "Analyzed, optimized, and maintained core infrastructure for "
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}${clean.charAt(0).toLowerCase() + clean.slice(1)}, improving efficiency by [X]% and reducing turnaround time by [Number] days.`;
};

/**
 * Instant client-side validation for bullet length and missing info
 */
export const checkBulletLength = (bulletText = '') => {
  const len = (bulletText || '').trim().length;
  if (len === 0) return { status: 'empty', length: 0 };
  if (len > 200) {
    return {
      status: 'too_long',
      length: len,
      warning: `Bullet is ${len} chars. Recruiters prefer concise bullets (<200 chars).`,
    };
  }
  if (len < 25) {
    return {
      status: 'too_short',
      length: len,
      warning: 'Bullet is very short. Consider elaborating with an action verb.',
    };
  }
  return { status: 'optimal', length: len };
};

/**
 * Fast client-side missing info scan
 */
export const detectCVIssuesClient = (cvData = {}) => {
  const issues = [];
  const p = cvData?.personalInfo || {};

  if (!p.email) issues.push({ section: 'Personal Info', message: 'Email address is missing' });
  if (!p.phone) issues.push({ section: 'Personal Info', message: 'Phone number is missing' });
  if (!p.jobTitle) issues.push({ section: 'Personal Info', message: 'Job title / headline is missing' });

  const edu = cvData?.education || [];
  if (edu.length === 0) {
    issues.push({ section: 'Education', message: 'No education entries added' });
  } else {
    edu.forEach((e, idx) => {
      if (!e.degree || !e.institution) {
        issues.push({ section: 'Education', message: `Education #${idx + 1} is missing degree or school name` });
      }
      if (!e.year && !e.graduationYear && !e.startDate && !e.endDate) {
        issues.push({ section: 'Education', message: `Education #${idx + 1} is missing graduation year/dates` });
      }
    });
  }

  const exp = cvData?.experience || [];
  exp.forEach((x, idx) => {
    if (!x.jobTitle) issues.push({ section: 'Experience', message: `Job #${idx + 1} is missing title` });
    if (!x.startDate && !x.year) issues.push({ section: 'Experience', message: `Job #${idx + 1} is missing dates` });

    const bullets = Array.isArray(x.highlights) ? x.highlights : (x.description || '').split('\n').filter(Boolean);
    bullets.forEach((b) => {
      if (b.trim().length > 200) {
        issues.push({
          section: 'Experience',
          type: 'length',
          message: `Bullet in ${x.company || 'Job ' + (idx + 1)} is too long (${b.trim().length} chars > 200)`,
        });
      }
    });
  });

  return issues;
};

export default {
  PRESET_ROLES,
  generateSmartBio,
  enhanceBulletPoint,
  checkBulletLength,
  detectCVIssuesClient,
};
