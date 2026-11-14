/**
 * Predefined Persona & Profession Profiles for Guided Onboarding
 * Helps first-time users, students, career switchers, and professionals
 * get tailored section recommendations, realistic sample copy, and tips.
 */

export const PERSONA_PRESETS = [
  {
    id: 'student',
    title: 'Student / Fresh Graduate',
    shortTitle: 'Fresh Grad',
    badge: 'Campus & Entry',
    iconName: 'GraduationCap',
    accentColor: '#4f46e5', // indigo
    description: 'Perfect for university students, recent diploma holders, and fresh graduates applying for internships or first corporate jobs.',
    suggestedSections: [
      'personalInfo',
      'careerObjective',
      'education',
      'projects',
      'skills',
      'internships',
      'achievements',
      'languages',
      'references',
    ],
    highlightAdvice: 'Focus on high CGPA/GPA, major semester capstone projects, hackathons, and campus club leadership when you lack formal years of experience.',
    sampleRole: 'Junior Associate / Management Trainee',
    sampleObjective: 'Ambitious and academically distinguished graduate with a strong analytical foundation and hands-on project leadership. Eager to contribute fresh perspectives, rapid learning agility, and dependable team collaboration to drive organizational goals.',
    tipsBySection: {
      summary: 'For students and entry-level applicants, a "Career Objective" is stronger than a generic summary. State your degree, top strengths, and what value you offer.',
      projects: 'Describe 2–3 notable academic, capstone, or self-initiated projects with technologies used and tangible results.',
      skills: 'List concrete software, tools, and technical competencies you learned in labs or coursework.',
      education: 'Include GPA/CGPA, university honors, dean’s list mentions, and relevant coursework.',
    },
  },
  {
    id: 'it_software',
    title: 'IT & Software Engineering',
    shortTitle: 'IT & Tech',
    badge: 'Engineering',
    iconName: 'Code',
    accentColor: '#0284c7', // sky
    description: 'Tailored for software engineers, full-stack/frontend/backend devs, DevOps, data engineers, QA, and cloud architects.',
    suggestedSections: [
      'personalInfo',
      'summary',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications',
      'publications',
    ],
    highlightAdvice: 'Recruiters scan tech stacks in 6 seconds. Prioritize your Technical Skills (Languages, Frameworks, Cloud, Databases) and link your GitHub / live web apps.',
    sampleRole: 'Full Stack Software Engineer',
    sampleObjective: 'Detail-oriented Software Engineer with experience building scalable RESTful APIs, modern reactive user interfaces, and automated CI/CD pipelines. Dedicated to clean architecture and high-availability cloud deployments.',
    tipsBySection: {
      summary: 'Mention your primary stack (e.g. React, Node.js, AWS), years of experience, and a notable scale milestone (e.g. "servicing 100k+ daily users").',
      skills: 'Categorize your skills: Languages, Frameworks/Libraries, Databases, and Cloud/DevOps tools.',
      projects: 'Include live URLs, GitHub repositories, and architectural challenges you solved.',
      experience: 'Use action verbs: "Architected", "Engineered", "Refactored", "Optimized", "Automated".',
    },
  },
  {
    id: 'corporate_business',
    title: 'Corporate & Business',
    shortTitle: 'Corporate',
    badge: 'Business',
    iconName: 'Briefcase',
    accentColor: '#0f766e', // teal
    description: 'Designed for corporate managers, banking executives, accountants, HR professionals, sales heads, and operational directors.',
    suggestedSections: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'achievements',
      'certifications',
      'references',
    ],
    highlightAdvice: 'Quantify your impact using the Google XYZ formula: "Accomplished [X], measured by [Y], by doing [Z]" with revenue numbers, cost savings, or efficiency gains.',
    sampleRole: 'Senior Operations & Strategy Manager',
    sampleObjective: 'Strategic and results-driven Business Manager with 6+ years of experience leading cross-functional teams, optimizing operational workflows, and driving top-line revenue growth across retail and B2B markets.',
    tipsBySection: {
      summary: 'Highlight management scope, budget/P&L oversight, and core domain expertise.',
      experience: 'Focus on measurable accomplishments: percentage growth, deal sizes, team headcount managed, and cost reductions.',
      skills: 'Include financial modeling, strategic planning, ERP tools (SAP, Oracle), CRM, and cross-team negotiation.',
    },
  },
  {
    id: 'bd_jobs',
    title: 'Bangladesh Job / BCS / Bank',
    shortTitle: 'BD Govt & Bank',
    badge: 'BD Standard',
    iconName: 'Landmark',
    accentColor: '#059669', // emerald
    description: 'Official format for BCS cadres, Bangladesh Bank, commercial banks, government agencies, and local conglomerates (Beximco, Square, Pran).',
    suggestedSections: [
      'personalInfo',
      'careerObjective',
      'education',
      'personalDetails',
      'experience',
      'skills',
      'declaration',
      'references',
    ],
    highlightAdvice: 'Includes mandatory civil service fields (Father/Mother Name, NID Number, Permanent Address, Blood Group, Marital Status) and formal declaration.',
    sampleRole: 'Assistant Director / Management Trainee Officer (MTO)',
    sampleObjective: 'Disciplined and analytical professional seeking a competitive position in a reputed financial / government institution to leverage leadership integrity, procedural compliance, and strong public administration skills.',
    tipsBySection: {
      personalDetails: 'Essential for BD corporate background verification and government circular verification. Ensure NID and permanent address match official records.',
      education: 'List both SSC and HSC along with University Bachelor/Masters degrees including Education Board names and GPA/division.',
      declaration: 'Include the standard signed declaration statement verifying factual accuracy under signature.',
    },
  },
  {
    id: 'healthcare',
    title: 'Healthcare / Doctor / Nurse',
    shortTitle: 'Healthcare',
    badge: 'Clinical',
    iconName: 'Stethoscope',
    accentColor: '#e11d48', // rose
    description: 'Created for MBBS doctors, registered nurses, clinical officers, pharmacists, medical lab technicians, and hospital specialists.',
    suggestedSections: [
      'personalInfo',
      'summary',
      'education',
      'experience',
      'certifications',
      'skills',
      'publications',
      'volunteer',
      'references',
    ],
    highlightAdvice: 'Prominently feature medical registration numbers (BMDC / Nursing Council), clinical department rotations, emergency triage certifications, and patient care hours.',
    sampleRole: 'Medical Officer / Resident Physician',
    sampleObjective: 'Compassionate and BMDC-registered Medical Officer with comprehensive inpatient and emergency rotation experience. Dedicated to evidence-based clinical diagnosis, patient safety protocols, and multidisciplinary healthcare teamwork.',
    tipsBySection: {
      education: 'Include MBBS/BSc Nursing with Medical College affiliation and Internship completion details.',
      certifications: 'Add BLS, ACLS, BMDC registration number, and relevant clinical training workshops.',
      experience: 'Detail specific ward duties: ICU, Emergency, Outpatient, Surgery Assistance, and patient bed capacity managed.',
    },
  },
  {
    id: 'academic_teacher',
    title: 'Teacher / Academic',
    shortTitle: 'Academic',
    badge: 'Education',
    iconName: 'BookOpen',
    accentColor: '#d97706', // amber
    description: 'Ideal for university lecturers, school educators, academic researchers, PhD scholars, and curriculum designers.',
    suggestedSections: [
      'personalInfo',
      'summary',
      'education',
      'publications',
      'experience',
      'achievements',
      'skills',
      'references',
    ],
    highlightAdvice: 'Prioritize peer-reviewed journal papers, conferences, thesis defense titles, research grants, and student mentoring accomplishments.',
    sampleRole: 'Lecturer in Computer Science / Researcher',
    sampleObjective: 'Dedicated educator and researcher with a proven record of published research, innovative pedagogy, and student mentorship. Eager to foster analytical inquiry and academic excellence within a world-class institution.',
    tipsBySection: {
      publications: 'List DOI links, journal impact factors, and conference proceedings in standard IEEE or APA citation style.',
      education: 'Highlight thesis title, academic advisors, and research distinctions.',
      experience: 'Specify courses taught, lab sessions conducted, and student cohorts supervised.',
    },
  },
  {
    id: 'hospitality_trade',
    title: 'Skilled Trade / Hospitality',
    shortTitle: 'Trade & Service',
    badge: 'Hands-on',
    iconName: 'Sparkles',
    accentColor: '#9333ea', // purple
    description: 'Tailored for hospitality managers, executive chefs, culinary experts, aviation crew, technicians, electricians, and customer specialists.',
    suggestedSections: [
      'personalInfo',
      'summary',
      'experience',
      'skills',
      'certifications',
      'languages',
      'references',
    ],
    highlightAdvice: 'Spotlight vocational trade certifications, food safety protocols (HACCP), hands-on technical proficiencies, and multilingual communication abilities.',
    sampleRole: 'Hospitality Supervisor / Lead Technician',
    sampleObjective: 'Energetic and detail-focused professional with extensive experience in luxury hospitality operations, team coordination, and international customer service standards. Proven ability to handle high-pressure environments with excellence.',
    tipsBySection: {
      skills: 'Include technical tools, safety standards, POS software, culinary stations, or trade equipment.',
      certifications: 'Add trade licenses, safety clearances, and vocational diplomas.',
      experience: 'Highlight customer satisfaction scores, shift turnaround times, and team coordination duties.',
    },
  },
];

/**
 * Returns the persona configuration by id, falling back to 'student'
 */
export const getPersonaById = (personaId) => {
  return PERSONA_PRESETS.find((p) => p.id === personaId) || PERSONA_PRESETS[0];
};

/**
 * Check whether a section is recommended for a given persona
 */
export const isSectionSuggestedForPersona = (sectionId, personaId) => {
  const persona = getPersonaById(personaId);
  return persona.suggestedSections.includes(sectionId);
};
