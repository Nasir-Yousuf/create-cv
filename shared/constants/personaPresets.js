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

// ============================================================================
// Complete Realistic Persona CV Datasets (Never Lorem Ipsum)
// ============================================================================

export const PERSONA_TECH_LEAD = {
  title: "Daniel Carter - Senior Cloud Architect Resume",
  personalInfo: {
    fullName: "Daniel Carter",
    jobTitle: "Senior Full-Stack & Cloud Solutions Architect",
    email: "daniel.carter@example.com",
    phone: "+1 (555) 389-2041",
    location: "San Francisco, CA",
    website: "https://danielcarter.dev",
    linkedin: "linkedin.com/in/danielcarter-cloud",
    github: "github.com/danielcarter",
    summary: "Senior Full-Stack & Cloud Solutions Architect with 6+ years of experience leading high-throughput distributed architectures, microservices in Node.js/Go, and modern React/TypeScript user experiences. Proven track record scaling systems from 50k to 5M+ DAU with 99.99% uptime.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  experience: [
    {
      id: "exp-tech-1",
      jobTitle: "Staff Cloud Architect & Engineering Lead",
      company: "CloudScale Technologies",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Direct distributed systems architecture and mentor 18 backend/frontend software engineers.",
      highlights: [
        "Architected event-driven microservices processing 120M+ daily events using Kafka, Node.js, and Redis.",
        "Reduced p99 API query latency by 44% by implementing multi-tiered distributed caching.",
        "Spearheaded cloud migration to Kubernetes (EKS), slashing AWS infrastructure costs by $180k/yr."
      ]
    },
    {
      id: "exp-tech-2",
      jobTitle: "Senior Software Engineer",
      company: "Stripe Partner Engineering",
      location: "San Francisco, CA",
      startDate: "2019",
      endDate: "2022",
      current: false,
      description: "Engineered high-security payment processing integrations and developer portal dashboards.",
      highlights: [
        "Built responsive developer dashboard and billing UI in React, TypeScript, and GraphQL.",
        "Engineered automated webhook delivery engine processing 15M webhooks daily with 99.98% SLA."
      ]
    }
  ],
  education: [
    {
      id: "edu-tech-1",
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2015",
      endDate: "2019",
      grade: "3.86 GPA",
      highlights: ["Dean's Honor List across all 8 semesters."]
    }
  ],
  skills: [
    { name: "React & Next.js" },
    { name: "TypeScript" },
    { name: "Node.js & Go" },
    { name: "AWS (EKS, RDS, S3)" },
    { name: "Apache Kafka" },
    { name: "PostgreSQL & Redis" },
    { name: "Docker & Kubernetes" },
    { name: "CI/CD & Terraform" }
  ],
  projects: [
    {
      id: "proj-tech-1",
      name: "HyperScale KV",
      role: "Lead Author",
      description: "Distributed in-memory key-value cache with Raft consensus protocol in Go.",
      technologies: ["Go", "Raft", "gRPC", "Docker"]
    },
    {
      id: "proj-tech-2",
      name: "NextAuth Connect",
      role: "Maintainer",
      description: "Zero-config OAuth2 SSO gateway for enterprise multi-tenant microservices.",
      technologies: ["TypeScript", "React", "OAuth2", "Redis"]
    }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect - Professional", issuer: "Amazon Web Services", date: "2023" },
    { name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation", date: "2022" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Conversational" }
  ]
};

export const PERSONA_BD_BANKING_MTO = {
  title: "Tanvir Hasan Chowdhury - Commercial Banking CV",
  personalInfo: {
    fullName: "Tanvir Hasan Chowdhury",
    jobTitle: "Management Trainee Officer (MTO) & Commercial Banking Specialist",
    email: "tanvir.chowdhury@example.com",
    phone: "+880 1711-987654",
    location: "Gulshan-2, Dhaka",
    linkedin: "linkedin.com/in/tanvir-hasan-chowdhury",
    summary: "Results-driven IBA graduate (CGPA 3.82/4.00) with proven analytical and leadership capabilities across SME credit appraisal, corporate treasury operations, and digital banking workflows. Experienced in financial modeling, credit risk assessment, and client relationship management.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait"
  },
  personalDetails: {
    fatherName: "Rafiqul Hasan Chowdhury",
    motherName: "Nasreen Sultana",
    dateOfBirth: "1999-10-14",
    dob: "1999-10-14",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Bangladeshi",
    nationalId: "19992691234567890",
    nid: "19992691234567890",
    religion: "Islam",
    bloodGroup: "B+",
    permanentAddress: "Chowdhury Bari, Village: Noapara, P.S: Raozan, District: Chattogram",
    presentAddress: "House 24, Road 11, Block D, Gulshan-2, Dhaka 1212"
  },
  experience: [
    {
      id: "exp-mto-1",
      jobTitle: "Management Trainee Officer (MTO)",
      company: "BRAC Bank Limited (Corporate Head Office)",
      location: "Dhaka, Bangladesh",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      description: "Rotate across Corporate Banking Division, Treasury, and SME Credit Underwriting units.",
      highlights: [
        "Analyzed credit appraisals for 35+ corporate clients with total disbursed sanctions exceeding BDT 45 Crore.",
        "Formulated financial risk assessment scorecards reducing turnaround time for SME loan approvals by 30%.",
        "Coordinated with Bangladesh Bank regulatory compliance teams for quarterly liquidity and CRR audits."
      ]
    },
    {
      id: "exp-mto-2",
      jobTitle: "Financial Analyst Intern",
      company: "bKash Limited (Commercial Strategy)",
      location: "Dhaka, Bangladesh",
      startDate: "Jun 2023",
      endDate: "Dec 2023",
      current: false,
      description: "Conducted financial feasibility analysis for new micro-merchant QR payment integrations.",
      highlights: [
        "Built automated merchant settlement dashboards in SQL and Power BI tracking BDT 12 Crore daily turnover."
      ]
    }
  ],
  education: [
    {
      id: "edu-mto-1",
      degree: "BBA in Finance & Accounting",
      institution: "Institute of Business Administration (IBA), University of Dhaka",
      location: "Dhaka",
      startDate: "2019",
      endDate: "2023",
      grade: "CGPA 3.82 / 4.00",
      highlights: ["Dean's Honor Roll recipient. Executive Member, IBA Finance Club."]
    },
    {
      id: "edu-mto-2",
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Notre Dame College, Dhaka",
      location: "Dhaka",
      startDate: "2016",
      endDate: "2018",
      grade: "GPA 5.00 / 5.00",
      highlights: ["Science Group. Champion, Notre Dame College Business Quiz 2018."]
    },
    {
      id: "edu-mto-3",
      degree: "Secondary School Certificate (SSC)",
      institution: "Dhaka Residential Model College",
      location: "Dhaka",
      startDate: "2014",
      endDate: "2016",
      grade: "GPA 5.00 / 5.00",
      highlights: ["Science Group. Board General Scholarship."]
    }
  ],
  skills: [
    { name: "Credit Risk Appraisal" },
    { name: "Financial Modeling & Valuation" },
    { name: "Corporate Treasury Operations" },
    { name: "Bangladesh Bank Regulations" },
    { name: "Advanced MS Excel & VBA" },
    { name: "Power BI & SQL" },
    { name: "SME Loan Structuring" },
    { name: "Client Relationship Management" }
  ],
  certifications: [
    { name: "Financial Modeling & Valuation Analyst (FMVA®)", issuer: "Corporate Finance Institute (CFI)", date: "2023" },
    { name: "Certified Anti-Money Laundering Specialist (CAMS) Candidate", issuer: "ACAMS", date: "2024" }
  ],
  languages: [
    { name: "Bengali", proficiency: "Native" },
    { name: "English", proficiency: "Fluent (IELTS 8.0)" }
  ],
  references: [
    {
      id: "ref-mto-1",
      name: "Dr. Syed Farhat Anwar",
      designation: "Professor & Former Director",
      company: "IBA, University of Dhaka",
      phone: "+880 1819-111111",
      email: "farhat@iba-du.edu"
    },
    {
      id: "ref-mto-2",
      name: "Kazi Asaduzzaman",
      designation: "Senior Vice President & Head of Corporate Banking",
      company: "BRAC Bank Limited",
      phone: "+880 1713-222222",
      email: "asad.kazi@bracbank.com"
    }
  ],
  declaration: {
    text: "I hereby solemnly declare that all information furnished above is true, authentic and complete to the best of my knowledge and belief.",
    date: new Date().toLocaleDateString('en-GB'),
    signedBy: "Tanvir Hasan Chowdhury"
  }
};

export const PERSONA_BD_BCS_CADRE = {
  title: "Mohammad Shakil Ahmed - Civil Service CV",
  personalInfo: {
    fullName: "Mohammad Shakil Ahmed",
    jobTitle: "Assistant Commissioner & Executive Magistrate (38th BCS Administration Cadre)",
    email: "shakil.ahmed.bcs@example.com",
    phone: "+880 1812-456789",
    location: "Divisional Commissioner Office, Chattogram",
    summary: "Dedicated civil service officer with 4+ years of grassroots administrative experience in revenue administration, public grievance redressal, law and order maintenance, and mobile court operations. Committed to transparent, citizen-centric public governance and digital service delivery.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait"
  },
  personalDetails: {
    fatherName: "Nurul Islam Ahmed",
    motherName: "Salma Begum",
    dateOfBirth: "1995-03-22",
    dob: "1995-03-22",
    gender: "Male",
    maritalStatus: "Married",
    nationality: "Bangladeshi",
    nationalId: "19952693456789012",
    nid: "19952693456789012",
    religion: "Islam",
    bloodGroup: "O+",
    permanentAddress: "Holding 45, Masterpara, P.S: Kotwali, District: Chattogram",
    presentAddress: "Circuit House Residential Complex, Chattogram"
  },
  experience: [
    {
      id: "exp-bcs-1",
      jobTitle: "Assistant Commissioner (Land) & Executive Magistrate",
      company: "Office of the Deputy Commissioner, Chattogram",
      location: "Chattogram, Bangladesh",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Supervise upazila land administration, e-mutation portals, and judicial mobile court enforcement.",
      highlights: [
        "Supervised digital land e-mutation system, processing 4,200+ citizen mutation applications with zero backlog.",
        "Conducted 120+ mobile courts for consumer rights protection, illegal encroachment removal, and environmental conservation.",
        "Coordinated disaster management and emergency relief distribution reaching 28,000 vulnerable families."
      ]
    },
    {
      id: "exp-bcs-2",
      jobTitle: "Assistant Commissioner",
      company: "Office of the Divisional Commissioner, Dhaka",
      location: "Dhaka, Bangladesh",
      startDate: "2020",
      endDate: "2022",
      current: false,
      description: "Managed executive coordination and inter-agency development taskforces.",
      highlights: [
        "Handled protocol, general administration, and executive coordination for inter-ministerial development projects."
      ]
    }
  ],
  education: [
    {
      id: "edu-bcs-1",
      degree: "M.S.S. in Public Administration",
      institution: "University of Dhaka",
      location: "Dhaka",
      startDate: "2017",
      endDate: "2018",
      grade: "First Class (1st Position)",
      highlights: ["Awarded Dean's Gold Medal for academic distinction."]
    },
    {
      id: "edu-bcs-2",
      degree: "B.S.S. in Public Administration",
      institution: "University of Dhaka",
      location: "Dhaka",
      startDate: "2013",
      endDate: "2017",
      grade: "CGPA 3.88 / 4.00",
      highlights: ["Faculty Merit Scholarship."]
    }
  ],
  skills: [
    { name: "Land Revenue Administration" },
    { name: "Code of Criminal Procedure (CrPC)" },
    { name: "Public Procurement Rules (PPR/e-GP)" },
    { name: "Grievance Redress System (GRS)" },
    { name: "Disaster Risk Reduction" },
    { name: "Executive Law Enforcement" }
  ],
  declaration: {
    text: "I hereby declare under official oath that all information submitted in this curriculum vitae is completely authentic and verifiable from service records.",
    date: new Date().toLocaleDateString('en-GB'),
    signedBy: "Mohammad Shakil Ahmed"
  }
};

export const PERSONA_HEALTHCARE_MBBS = {
  title: "Dr. Nusrat Jahan - Medical Officer CV",
  personalInfo: {
    fullName: "Dr. Nusrat Jahan",
    jobTitle: "Resident Medical Officer (MBBS, BMDC Reg: A-78921)",
    email: "dr.nusrat.jahan@example.com",
    phone: "+880 1715-678901",
    location: "Dhanmondi, Dhaka",
    summary: "BMDC-registered physician with 3+ years of clinical experience across Internal Medicine, Emergency Triage, and Post-Operative ICU management. Dedicated to empathetic evidence-based patient care, clinical diagnosis, and infection control standards.",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  personalDetails: {
    fatherName: "Dr. MA Jalil",
    motherName: "Hosne Ara Begum",
    dateOfBirth: "1997-08-19",
    dob: "1997-08-19",
    gender: "Female",
    maritalStatus: "Single",
    nationality: "Bangladeshi",
    nationalId: "19972695678901234",
    nid: "19972695678901234",
    religion: "Islam",
    bloodGroup: "A+",
    permanentAddress: "Jalil Villa, Station Road, Mymensingh Sadar, Mymensingh"
  },
  experience: [
    {
      id: "exp-med-1",
      jobTitle: "Resident Medical Officer (Internal Medicine)",
      company: "Square Hospitals Limited",
      location: "Dhaka, Bangladesh",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description: "Manage 25-bed acute medical ward overseeing patient admissions, clinical evaluations, and emergency interventions.",
      highlights: [
        "Performed arterial blood gas sampling, endotracheal intubation, central venous catheterizations, and lumbar punctures.",
        "Conducted daily clinical rounds collaborating with multidisciplinary specialist teams for complex diagnostic dilemmas.",
        "Maintained hospital infection control compliance rate above 98% across acute inpatient admissions."
      ]
    },
    {
      id: "exp-med-2",
      jobTitle: "Honorary Medical Officer (Emergency & Triage)",
      company: "Dhaka Medical College Hospital (DMCH)",
      location: "Dhaka, Bangladesh",
      startDate: "2022",
      endDate: "2023",
      current: false,
      description: "Handled emergency triage and resuscitation protocols for critically ill acute admissions.",
      highlights: [
        "Managed emergency department triaging 150+ acute clinical admissions daily during peak emergency shifts."
      ]
    }
  ],
  education: [
    {
      id: "edu-med-1",
      degree: "FCPS Part-I (Medicine)",
      institution: "Bangladesh College of Physicians and Surgeons (BCPS)",
      location: "Dhaka",
      startDate: "2024",
      endDate: "2024",
      grade: "Passed"
    },
    {
      id: "edu-med-2",
      degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
      institution: "Dhaka Medical College (DMC), University of Dhaka",
      location: "Dhaka",
      startDate: "2016",
      endDate: "2021",
      grade: "Passed with Honors in Pathology & Pharmacology"
    }
  ],
  skills: [
    { name: "Emergency Clinical Triage" },
    { name: "Basic & Advanced Life Support (BLS/ACLS)" },
    { name: "Internal Medicine Clinical Care" },
    { name: "ICU & Ventilator Management" },
    { name: "12-Lead ECG Interpretation" },
    { name: "Patient Counseling & Empathy" }
  ],
  certifications: [
    { name: "BMDC Permanent Registration (Reg: A-78921)", issuer: "Bangladesh Medical & Dental Council", date: "2022" },
    { name: "Advanced Cardiovascular Life Support (ACLS)", issuer: "American Heart Association", date: "2023" }
  ]
};

export const PERSONA_ACADEMIC_RESEARCH = {
  title: "Dr. Md. Saiful Islam - Academic & Research CV",
  personalInfo: {
    fullName: "Dr. Md. Saiful Islam",
    jobTitle: "Associate Professor & Computational Biology Researcher",
    email: "saiful.cse@du.ac.bd",
    phone: "+880 1819-234567",
    location: "Dhaka, Bangladesh",
    website: "https://saiful-cs.du.ac.bd",
    linkedin: "linkedin.com/in/saiful-islam-phd",
    summary: "Computational biology and machine learning researcher with 18 peer-reviewed publications in IEEE, Nature Scientific Reports, and ACM Transactions. 8+ years experience mentoring graduate researchers, authoring competitive research grants, and teaching undergraduate algorithms.",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  experience: [
    {
      id: "exp-acad-1",
      jobTitle: "Associate Professor (Dept. of CSE)",
      company: "University of Dhaka",
      location: "Dhaka, Bangladesh",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Teach Advanced Algorithms and Machine Learning; direct the Bioinformatics Computing Lab.",
      highlights: [
        "Principal Investigator for $140k Ministry of ICT research grant on deep learning models for genomic variant classification.",
        "Supervised 14 M.Sc. thesis projects and 28 undergraduate capstone design groups to completion.",
        "Published 6 Q1 journal articles as corresponding author over the past 3 academic years."
      ]
    },
    {
      id: "exp-acad-2",
      jobTitle: "Postdoctoral Research Fellow",
      company: "Max Planck Institute for Informatics",
      location: "Saarbrücken, Germany",
      startDate: "2018",
      endDate: "2021",
      current: false,
      description: "Conducted fundamental research in graph representation learning for molecular property prediction.",
      highlights: [
        "Developed graph neural network framework for molecular property prediction cited 450+ times."
      ]
    }
  ],
  education: [
    {
      id: "edu-acad-1",
      degree: "Ph.D. in Computer Science",
      institution: "National University of Singapore (NUS)",
      location: "Singapore",
      startDate: "2014",
      endDate: "2018",
      grade: "Doctoral Dissertation with Distinction"
    },
    {
      id: "edu-acad-2",
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      location: "Dhaka",
      startDate: "2009",
      endDate: "2013",
      grade: "CGPA 3.94 / 4.00 (First Class 2nd)"
    }
  ],
  skills: [
    { name: "Machine Learning & PyTorch" },
    { name: "Genomic Sequence Analysis" },
    { name: "Graph Neural Networks" },
    { name: "Algorithmic Design" },
    { name: "Peer Review & Grant Writing" },
    { name: "Curriculum Accreditation (BAETE)" }
  ]
};

export const PERSONA_EXECUTIVE_LEAD = {
  title: "Marcus Sterling - Chief Operating Officer CV",
  personalInfo: {
    fullName: "Marcus Sterling",
    jobTitle: "Chief Operating Officer & Enterprise Transformation Leader",
    email: "marcus.sterling@example.com",
    phone: "+1 (555) 789-0123",
    location: "New York, NY",
    linkedin: "linkedin.com/in/marcussterling-coo",
    summary: "Transformational executive leader with 15+ years driving global operations, P&L management ($150M+), enterprise M&A integration, and digital supply chain modernizations across Fortune 500 tech and logistics enterprises. Expert at turning vision into scalable operating margin expansions.",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  experience: [
    {
      id: "exp-exec-1",
      jobTitle: "Chief Operating Officer",
      company: "Apex Global Logistics & Cloud Solutions",
      location: "New York, NY",
      startDate: "2020",
      endDate: "Present",
      current: true,
      description: "Direct enterprise strategy, customer fulfillment, technology operations, and P&L governance across 14 countries.",
      highlights: [
        "Oversee 1,400-person global operations across North America, EMEA, and APAC generating $180M ARR.",
        "Accelerated EBITDA margins by 420 bps through automated fulfillment robotics and predictive AI routing.",
        "Led post-merger integration of $45M SaaS acquisition ahead of schedule, capturing $6.2M in annual synergies."
      ]
    },
    {
      id: "exp-exec-2",
      jobTitle: "Vice President of Operations & Strategy",
      company: "Vanguard Industrial Partners",
      location: "Chicago, IL",
      startDate: "2015",
      endDate: "2020",
      current: false,
      description: "Managed business unit operations with $90M annual spend.",
      highlights: [
        "Restructured supply chain procurement network, lowering vendor COGS by 18% over 3 fiscal years."
      ]
    }
  ],
  education: [
    {
      id: "edu-exec-1",
      degree: "MBA in Strategic Management & Operations",
      institution: "Wharton School, University of Pennsylvania",
      location: "Philadelphia, PA",
      startDate: "2013",
      endDate: "2015",
      grade: "Palmer Scholar (Top 5%)"
    },
    {
      id: "edu-exec-2",
      degree: "B.S. in Industrial & Systems Engineering",
      institution: "Northwestern University",
      location: "Evanston, IL",
      startDate: "2007",
      endDate: "2011",
      grade: "Magna Cum Laude"
    }
  ],
  skills: [
    { name: "P&L Management ($150M+)" },
    { name: "Enterprise M&A Integration" },
    { name: "Global Supply Chain Operations" },
    { name: "EBITDA Margin Optimization" },
    { name: "Executive Stakeholder Governance" },
    { name: "Organizational Leadership" }
  ]
};

export const PERSONA_STUDENT_FRESHER = {
  title: "Nafis Ahmed - Computer Science Graduate CV",
  personalInfo: {
    fullName: "Nafis Ahmed",
    jobTitle: "Junior Software Engineer & CS Graduate",
    email: "nafis.ahmed@example.com",
    phone: "+880 1712-345678",
    location: "Dhanmondi, Dhaka",
    linkedin: "linkedin.com/in/nafisahmed",
    github: "github.com/nafisahmed",
    website: "https://nafisahmed.dev",
    summary: "Computer Science graduate (CGPA 3.78/4.00) with hands-on internship experience building responsive React and Node.js web applications. Eager to contribute clean, maintainable code to a collaborative engineering team.",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
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
    }
  ],
  skills: [
    { name: "React & Next.js" },
    { name: "TypeScript & JavaScript" },
    { name: "Node.js & Express" },
    { name: "PostgreSQL & Prisma" },
    { name: "Tailwind CSS" },
    { name: "Git & GitHub Actions" }
  ],
  projects: [
    {
      id: "proj-f1",
      name: "MedTrack BD",
      role: "Solo Developer",
      description: "Real-time pharmacy prescription dispenser and inventory alert dashboard in Next.js.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Supabase"]
    },
    {
      id: "proj-f2",
      name: "SmartCampus",
      role: "Team Lead",
      description: "University campus room allocation & student event calendar app with QR verification.",
      technologies: ["TypeScript", "Node.js", "PostgreSQL"]
    }
  ],
  certifications: [
    { name: "Meta Front-End Developer Professional Certificate", issuer: "Coursera", date: "2024" }
  ],
  languages: [
    { name: "Bengali", proficiency: "Native" },
    { name: "English", proficiency: "Fluent" }
  ]
};

export const PERSONA_CREATIVE_UIUX = {
  title: "Sophia Chen - Lead Product Designer CV",
  personalInfo: {
    fullName: "Sophia Chen",
    jobTitle: "Lead Product & Interaction Designer",
    email: "sophia.chen@example.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    website: "https://sophiachen.design",
    linkedin: "linkedin.com/in/sophiachen-design",
    summary: "Design systems and product interaction lead with 7+ years crafting scalable Figma component ecosystems, micro-interactions, and high-conversion SaaS web applications. Passionate about accessibility (WCAG AAA) and intuitive user onboarding.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  experience: [
    {
      id: "exp-ui-1",
      jobTitle: "Staff Product Designer",
      company: "Figma Ecosystem Studio",
      location: "Seattle, WA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Lead design tokens architecture and multi-platform component library supporting 40+ engineering pods.",
      highlights: [
        "Architected multi-brand design token system reducing UI development turnaround by 35%.",
        "Redesigned core onboarding flow, elevating 30-day user activation rate from 42% to 68%."
      ]
    }
  ],
  education: [
    {
      id: "edu-ui-1",
      degree: "B.Des. in Human-Computer Interaction",
      institution: "University of Washington",
      location: "Seattle, WA",
      startDate: "2014",
      endDate: "2018",
      grade: "3.91 GPA"
    }
  ],
  skills: [
    { name: "Figma Component Systems" },
    { name: "Design Tokens & Styling" },
    { name: "User Research & Prototyping" },
    { name: "Accessibility (WCAG AAA)" },
    { name: "HTML5/CSS3/Tailwind" },
    { name: "Design Sprint Facilitation" }
  ]
};

export const PERSONA_FINANCE_ACCOUNTING = {
  title: "Sadia Rahman, ACA - Financial Planning & Analysis CV",
  personalInfo: {
    fullName: "Sadia Rahman, ACA",
    jobTitle: "Senior Financial Planning & Analysis (FP&A) Manager",
    email: "sadia.rahman.aca@example.com",
    phone: "+880 1718-234567",
    location: "Banani, Dhaka",
    linkedin: "linkedin.com/in/sadia-rahman-aca",
    summary: "Chartered Accountant (ICAB) with 6+ years experience in corporate budgeting, statutory financial audits, treasury management, and IFRS/BFRS reporting. Expert at building automated financial forecast models and driving working capital optimization.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait"
  },
  experience: [
    {
      id: "exp-fin-1",
      jobTitle: "Senior FP&A Manager",
      company: "Grameenphone Ltd. (Finance Division)",
      location: "Dhaka, Bangladesh",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Direct annual OPEX and CAPEX budget planning ($120M) and board financial reviews.",
      highlights: [
        "Led quarterly financial forecasting models yielding under 2% variance from actual fiscal outcomes.",
        "Identified working capital inefficiencies, unlocking BDT 14 Crore in cash flow liquidity."
      ]
    }
  ],
  education: [
    {
      id: "edu-fin-1",
      degree: "Associate Chartered Accountant (ACA)",
      institution: "Institute of Chartered Accountants of Bangladesh (ICAB)",
      location: "Dhaka",
      startDate: "2017",
      endDate: "2021",
      grade: "Passed in First Attempt"
    },
    {
      id: "edu-fin-2",
      degree: "BBA in Accounting & Information Systems",
      institution: "University of Dhaka",
      location: "Dhaka",
      startDate: "2013",
      endDate: "2017",
      grade: "CGPA 3.85 / 4.00"
    }
  ],
  skills: [
    { name: "IFRS / BFRS Financial Reporting" },
    { name: "Corporate Financial Modeling" },
    { name: "Statutory & Tax Audit" },
    { name: "Working Capital Optimization" },
    { name: "ERP (SAP S/4HANA Finance)" },
    { name: "Treasury & Cash Management" }
  ]
};

export const PERSONA_TEXTILE_MERCHANDISER = {
  title: "Farhan Kabir - Apparel Merchandiser CV",
  personalInfo: {
    fullName: "Farhan Kabir",
    jobTitle: "Senior Apparel Merchandiser & Supply Chain Lead",
    email: "farhan.textile@example.com",
    phone: "+880 1719-876543",
    location: "Gazipur, Dhaka",
    linkedin: "linkedin.com/in/farhan-textile-merchandiser",
    summary: "Textile engineering graduate with 8+ years managing woven and knit apparel merchandising for premier European buyers (H&M, Zara, Primark). Expert in consumption costing, lab dip approvals, yarn-to-garment production lead times, and factory compliance audits.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait"
  },
  experience: [
    {
      id: "exp-tex-1",
      jobTitle: "Senior Apparel Merchandiser",
      company: "Beximco Apparels Ltd.",
      location: "Gazipur, Bangladesh",
      startDate: "2020",
      endDate: "Present",
      current: true,
      description: "Manage buyer accounts with annual order volumes exceeding 4.5 million garment pieces.",
      highlights: [
        "Achieved 99.2% on-time garment shipment delivery across 12 consecutive export seasons.",
        "Negotiated fabric sourcing contracts saving $240k across bulk woven production orders."
      ]
    }
  ],
  education: [
    {
      id: "edu-tex-1",
      degree: "B.Sc. in Textile Engineering (Fabric & Apparel)",
      institution: "Bangladesh University of Textiles (BUTEX)",
      location: "Dhaka",
      startDate: "2012",
      endDate: "2016",
      grade: "First Class"
    }
  ],
  skills: [
    { name: "Garment Consumption & Costing" },
    { name: "Yarn & Fabric Sourcing" },
    { name: "Lab Dip & Sample Approval" },
    { name: "Production Planning (T&A)" },
    { name: "Buyer Communication (H&M, Inditex)" },
    { name: "Sedex & BSCI Social Compliance" }
  ]
};

export const PERSONA_ENGINEERING_SPEC = {
  title: "Engr. Tariqul Islam, P.Eng. - Structural & Civil Engineering CV",
  personalInfo: {
    fullName: "Engr. Tariqul Islam, P.Eng.",
    jobTitle: "Senior Structural & Civil Projects Engineer (IEB #34281)",
    email: "tariqul.islam.pe@example.com",
    phone: "+880 1713-456789",
    location: "Uttara, Dhaka",
    linkedin: "linkedin.com/in/tariqul-islam-civil",
    summary: "Professional Engineer (IEB Registered #34281) with 8+ years experience in structural modeling, high-rise seismic analysis, and EPC project supervision. Expert in BNBC/ACI codes, ETABS, SAP2000, and AutoCAD Civil 3D.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    photoStyle: "rounded"
  },
  experience: [
    {
      id: "exp-eng-1",
      jobTitle: "Senior Project Structural Engineer",
      company: "Concord Engineers & Construction Ltd.",
      location: "Dhaka, Bangladesh",
      startDate: "2020",
      endDate: "Present",
      current: true,
      description: "Direct structural design validation and on-site quality assurance for 24-storied commercial towers.",
      highlights: [
        "Modeled seismic response spectrum in ETABS complying strictly with BNBC 2020 building code.",
        "Reduced reinforced concrete slab dead load by 8% through post-tensioned beam optimization."
      ]
    }
  ],
  education: [
    {
      id: "edu-eng-1",
      degree: "B.Sc. in Civil & Structural Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      location: "Dhaka",
      startDate: "2012",
      endDate: "2016",
      grade: "CGPA 3.82 / 4.00"
    }
  ],
  skills: [
    { name: "Structural Design (ETABS, SAP2000)" },
    { name: "AutoCAD & Revit BIM Modeling" },
    { name: "BNBC 2020 & ACI 318 Building Codes" },
    { name: "Soil Foundation & Deep Piling QA" },
    { name: "BOQ & Construction Cost Estimation" },
    { name: "Site Safety & OSHA Compliance" }
  ]
};

export const PERSONA_MARKETING_GROWTH = {
  title: "Arifa Sultana - Growth Marketing & Strategy CV",
  personalInfo: {
    fullName: "Arifa Sultana",
    jobTitle: "Head of Growth & Performance Marketing",
    email: "arifa.growth@example.com",
    phone: "+880 1819-345678",
    location: "Gulshan-2, Dhaka",
    linkedin: "linkedin.com/in/arifa-sultana-growth",
    summary: "Data-driven Growth Marketing Strategist with 7+ years scaling digital products and direct-to-consumer brands across South Asia. Managed $2.4M+ paid media budgets delivering a 3.8x blended ROAS, with deep expertise in full-funnel CRO, retention, and attribution.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    photoStyle: "circle"
  },
  experience: [
    {
      id: "exp-mkt-1",
      jobTitle: "Head of Growth",
      company: "Pathao Ltd. (Digital Services)",
      location: "Dhaka, Bangladesh",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Lead multi-channel customer acquisition and lifecycle retention teams across rides and food delivery.",
      highlights: [
        "Scaled monthly active transacting users from 420k to 1.1M while decreasing blended CAC by 28%.",
        "Orchestrated A/B landing page testing program boosting app installation conversion rate from 14% to 22%."
      ]
    }
  ],
  education: [
    {
      id: "edu-mkt-1",
      degree: "BBA in Marketing & Analytics",
      institution: "Institute of Business Administration (IBA), University of Dhaka",
      location: "Dhaka",
      startDate: "2014",
      endDate: "2018",
      grade: "CGPA 3.88 / 4.00"
    }
  ],
  skills: [
    { name: "Performance Paid Ads (Meta, Google, TikTok)" },
    { name: "Full-Funnel CAC & LTV Optimization" },
    { name: "Marketing Attribution (Mixpanel, GA4)" },
    { name: "Lifecycle CRM (Braze, Clevertap)" },
    { name: "Conversion Rate Optimization (CRO)" },
    { name: "Go-to-Market (GTM) Product Launch" }
  ]
};

export const PERSONA_SKILLED_TRADE_PRO = {
  title: "Md. Kamal Hossain - Industrial Technical Lead CV",
  personalInfo: {
    fullName: "Md. Kamal Hossain",
    jobTitle: "Senior Industrial HVAC & Electrical Maintenance Lead",
    email: "kamal.trade.lead@example.com",
    phone: "+880 1912-345678",
    location: "Tongi, Gazipur",
    summary: "Certified Industrial Plant Technician (OSHA 30, B-Grade Electrical Licensure) with 10+ years experience maintaining commercial HVAC chillers, diesel backup generators, and 3-phase automated machinery. Dedicated to zero downtime and stringent factory safety.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    photoStyle: "portrait"
  },
  experience: [
    {
      id: "exp-trade-1",
      jobTitle: "Maintenance Engineering Lead",
      company: "Apex Footwear Ltd. (Central Plant)",
      location: "Gazipur, Bangladesh",
      startDate: "2018",
      endDate: "Present",
      current: true,
      description: "Supervise 14 on-duty electro-mechanical technicians managing factory utility plant infrastructure.",
      highlights: [
        "Maintained 99.8% plant uptime across 3 factory shifts via computerized preventative maintenance.",
        "Successfully overhauled three 500-Ton Daikin chillers with zero reported incidents."
      ]
    }
  ],
  education: [
    {
      id: "edu-trade-1",
      degree: "Diploma in Mechanical & Refrigeration Technology",
      institution: "Dhaka Polytechnic Institute",
      location: "Dhaka",
      startDate: "2010",
      endDate: "2014",
      grade: "First Division"
    }
  ],
  skills: [
    { name: "Industrial HVAC Chiller Overhaul" },
    { name: "3-Phase Electrical Switchgear & VFDs" },
    { name: "PLC Diagnostics & Automated Controls" },
    { name: "Preventative Maintenance (CMMS)" },
    { name: "OSHA 30 Certified Industrial Safety" },
    { name: "Welding & Brazing Piping Systems" }
  ]
};

/**
 * Resolver function to return the most accurate persona preview data for any template.
 */
export const resolvePersonaForTemplate = (template = {}) => {
  const id = String(template.id || '').toLowerCase();
  const cat = String(template.category || '').toLowerCase();
  const cats = (template.categories || []).map((c) => String(c).toLowerCase());

  if (id.includes('doctor') || id.includes('medical') || id.includes('mbbs') || id.includes('nurse') || id.includes('clinical') || cats.includes('healthcare')) {
    return PERSONA_HEALTHCARE_MBBS;
  }
  if (id.includes('trade') || id.includes('skilled') || id.includes('technician')) {
    return PERSONA_SKILLED_TRADE_PRO;
  }
  if (id.includes('marketing') || id.includes('growth') || id.includes('sales') || cats.includes('marketing and sales')) {
    return PERSONA_MARKETING_GROWTH;
  }
  if (id.includes('engineering-spec') || id.includes('civil-eng') || id.includes('mechanical-eng') || id.includes('electrical-eng') || (id.includes('engineer') && !id.includes('software') && !id.includes('frontend') && !id.includes('backend'))) {
    return PERSONA_ENGINEERING_SPEC;
  }
  if (id.includes('bcs') || id.includes('admin-cadre') || id.includes('govt')) {
    return PERSONA_BD_BCS_CADRE;
  }
  if (id.includes('accountant') || id.includes('audit') || id.includes('fpa') || id.includes('tax') || id.includes('ledger') || (id.includes('finance') && !id.includes('bank'))) {
    return PERSONA_FINANCE_ACCOUNTING;
  }
  if (id.includes('bank') || id.includes('mto') || id.includes('finance') || id.includes('fin-') || cats.includes('finance and accounting')) {
    return PERSONA_BD_BANKING_MTO;
  }
  if (id.includes('academic') || id.includes('research') || id.includes('professor') || id.includes('faculty') || cats.includes('academic and research')) {
    return PERSONA_ACADEMIC_RESEARCH;
  }
  if (id.includes('textile') || id.includes('merchandis') || id.includes('apparel') || id.includes('garment')) {
    return PERSONA_TEXTILE_MERCHANDISER;
  }
  if (id.includes('creative') || id.includes('design') || id.includes('uiux') || cats.includes('creative')) {
    return PERSONA_CREATIVE_UIUX;
  }
  if (id.includes('executive') || id.includes('leadership') || id.includes('coo') || id.includes('director') || cats.includes('executive')) {
    return PERSONA_EXECUTIVE_LEAD;
  }
  if (id.includes('fresher') || id.includes('graduate') || cats.includes('student and fresh graduate')) {
    return PERSONA_STUDENT_FRESHER;
  }
  if (id.startsWith('bd-') || id.includes('bd') || cat.includes('bangladesh') || cats.includes('bangladesh cvs')) {
    return PERSONA_BD_BANKING_MTO;
  }
  return PERSONA_TECH_LEAD;
};

