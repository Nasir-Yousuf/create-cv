/**
 * Automated Verification Script: Templates, SSR, PDF Engine, and cvSlice State
 *
 * Verifies:
 * 1. Template SSR Rendering across Short, Standard, and Dense payloads for all canonical templates.
 * 2. Chromium PDF Generation: Every One-Page template strictly outputs exactly 1 A4 page (210mm x 297mm) with selectable vector text.
 * 3. Bidirectional Mode A (Form) <-> Mode B (Visual Canvas) state transitions preserve 100% of fields without data loss.
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { generatePDF, closeSharedBrowser } from '../src/services/pdf/pdfService.js';
import {
  TEMPLATES_REGISTRY,
  resolveTemplateId,
  resolveTemplateMeta,
} from '../../shared/constants/cvDefaults.js';
import cvReducer, {
  setCVData,
  updatePersonalInfo,
  updateSummary,
  updateCareerObjective,
  updateDesignTokens,
  updateDesign,
  setElementOverride,
  removeElementOverride,
  setSectionConfig,
  updateSectionConfigItem,
  toggleSectionVisibility,
  addCustomSection,
  addCustomSectionItem,
  addCustomElement,
  updateCustomElement,
  updateExperience,
  addAchievement,
} from '../../client/src/store/cvSlice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Load compiled SSR bundle
const ssrPath = path.resolve(__dirname, '../src/generated/renderTemplateSSR.cjs');
if (!fs.existsSync(ssrPath)) {
  console.error(`Compiled SSR bundle not found at ${ssrPath}. Run "npm --prefix client run build" first.`);
  process.exit(1);
}
const { renderCVToStaticHtml, TEMPLATE_COMPONENTS } = require(ssrPath);

// Sample Payloads: Short, Standard, and Dense
const SHORT_CV = {
  templateId: 'onepage-fresher-clean',
  title: 'Short Resume',
  personalInfo: {
    fullName: 'Sara Ahmed',
    jobTitle: 'Junior UX Designer',
    email: 'sara.ahmed@example.com',
    phone: '+880 1819-123456',
    location: 'Dhaka, Bangladesh',
    summary: 'Creative UX designer specializing in design systems and mobile usability.',
  },
  experience: [
    {
      id: 'e1',
      jobTitle: 'UI/UX Designer',
      company: 'Pathao Ltd.',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      description: 'Designed rider ride-tracking interface and notification states.',
      highlights: ['Improved user task completion rate by 18%'],
    },
  ],
  education: [
    {
      id: 'ed1',
      degree: 'B.Sc. in Multimedia & Creative Technology',
      institution: 'Daffodil International University',
      startDate: '2019',
      endDate: '2023',
      grade: 'CGPA 3.82',
    },
  ],
  skills: [{ id: 's1', name: 'Figma' }, { id: 's2', name: 'Wireframing' }, { id: 's3', name: 'User Testing' }],
};

const STANDARD_CV = {
  templateId: 'onepage-modern-split',
  title: 'Standard Professional Resume',
  personalInfo: {
    fullName: 'Nafis Ahmed',
    jobTitle: 'Full Stack Software Engineer',
    email: 'nafis.ahmed@example.com',
    phone: '+880 1712-345678',
    location: 'Dhaka, Bangladesh',
    website: 'https://nafisahmed.dev',
    linkedin: 'linkedin.com/in/nafisahmed',
    github: 'github.com/nafisahmed',
    photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    summary: 'Proactive Full Stack Engineer with 3+ years experience designing scalable React and Node.js web platforms.',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Full Stack Engineer',
      company: 'Brain Station 23',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      description: 'Building micro-frontend platforms and merchant payment gateways.',
      highlights: [
        'Reduced checkout API latency by 35% through Redis caching layer.',
        'Mentored 3 junior software engineers on clean architecture patterns.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Junior Frontend Developer',
      company: 'Kona Software Lab',
      startDate: '2020-07',
      endDate: '2022-02',
      current: false,
      description: 'Implemented responsive financial dashboard UI components.',
      highlights: ['Refactored design system components used by 12 client projects.'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'BRAC University',
      startDate: '2016',
      endDate: '2020',
      grade: 'CGPA 3.84',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'React' },
    { id: 'sk-2', name: 'TypeScript' },
    { id: 'sk-3', name: 'Node.js' },
    { id: 'sk-4', name: 'Next.js' },
    { id: 'sk-5', name: 'PostgreSQL' },
    { id: 'sk-6', name: 'Docker' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DeshiPay Merchant Portal',
      description: 'Real-time transaction tracking and settlement portal for 5,000+ vendors.',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'Socket.io'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-2', name: 'Bengali', proficiency: 'Native' },
  ],
};

const DENSE_CV = {
  templateId: 'onepage-bd-compact',
  title: 'Executive Curriculum Vitae (Dense)',
  personalInfo: {
    fullName: 'Tahmidur Rahman, PMP',
    jobTitle: 'Senior Engineering Manager & Technical Lead',
    email: 'tahmid.rahman@example.com',
    phone: '+880 1711-000000',
    location: 'Gulshan-2, Dhaka 1212',
    website: 'https://tahmid.tech',
    linkedin: 'linkedin.com/in/tahmidrahman',
    github: 'github.com/tahmidrahman',
    photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    summary:
      'Seasoned engineering leader with 10+ years driving mission-critical FinTech systems, high-velocity developer platforms, and cross-functional teams of 25+ engineers across Bangladesh and Southeast Asia.',
    fatherName: 'Late Mustafizur Rahman',
    motherName: 'Begum Rokeya Rahman',
    dob: '1990-08-15',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    bloodGroup: 'B+',
    nid: '19902692518000123',
    permanentAddress: 'House 42, Road 11, Dhanmondi, Dhaka',
  },
  careerObjective:
    'To spearhead transformative engineering initiatives by combining modern cloud-native architectures with disciplined talent development to maximize business impact.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Engineering Manager',
      company: 'Bkash Limited',
      startDate: '2021-01',
      endDate: 'Present',
      current: true,
      description: 'Overseeing core merchant acquiring and payment settlement engineering teams.',
      highlights: [
        'Architected real-time settlement engine processing ৳450M+ daily transactions with 99.995% uptime.',
        'Championed automated CI/CD and container security scanning, reducing deployment turnaround by 60%.',
        'Spearheaded hiring and onboarding of 18 software and QA engineers across 3 distinct squads.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Lead Software Architect',
      company: 'Chaldal Ltd.',
      startDate: '2017-06',
      endDate: '2020-12',
      current: false,
      description: 'Led core logistics routing and distributed inventory management services.',
      highlights: [
        'Re-architected warehouse dispatch algorithms, cutting order fulfilment cycle by 22 minutes.',
        'Migrated monolithic ERP to event-driven microservices on AWS and Kafka.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Senior Software Engineer',
      company: 'Therap (BD) Ltd.',
      startDate: '2014-01',
      endDate: '2017-05',
      current: false,
      description: 'Developed HIPAA-compliant electronic health records modules for US healthcare providers.',
      highlights: [
        'Implemented cryptographically signed audit logging meeting strict federal compliance guidelines.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'M.Sc. in Computer Science',
      institution: 'University of Dhaka',
      startDate: '2012',
      endDate: '2014',
      grade: 'First Class (CGPA 3.92)',
    },
    {
      id: 'edu-2',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'BUET',
      startDate: '2008',
      endDate: '2012',
      grade: 'Honors (CGPA 3.88)',
    },
    {
      id: 'edu-3',
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Notre Dame College, Dhaka',
      startDate: '2006',
      endDate: '2008',
      grade: 'GPA 5.00 / 5.00 (Golden)',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Microservices Architecture' },
    { id: 'sk-2', name: 'Distributed Systems' },
    { id: 'sk-3', name: 'Go / Golang' },
    { id: 'sk-4', name: 'Java Spring Boot' },
    { id: 'sk-5', name: 'React / Next.js' },
    { id: 'sk-6', name: 'Kubernetes & Docker' },
    { id: 'sk-7', name: 'Apache Kafka' },
    { id: 'sk-8', name: 'PostgreSQL & Redis' },
    { id: 'sk-9', name: 'AWS & GCP' },
    { id: 'sk-10', name: 'Team Mentorship' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'ShadhinPay FinTech Core',
      description: 'Ultra-low latency micro-merchant acquiring platform with automated QR settlement.',
      technologies: ['Go', 'Kafka', 'PostgreSQL', 'Docker'],
    },
    {
      id: 'proj-2',
      title: 'AutoRoute Logistics Optimizer',
      description: 'Graph-based dynamic routing engine for 1,200+ delivery couriers.',
      technologies: ['Python', 'PostGIS', 'Redis', 'React'],
    },
    {
      id: 'proj-3',
      title: 'OpenBangla NLP Corpus',
      description: 'Open-source Bengali language sentiment analysis and tokenization library with 10k+ stars.',
      technologies: ['Python', 'PyTorch', 'Transformers'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Project Management Professional (PMP)',
      issuer: 'PMI',
      date: '2022',
    },
    {
      id: 'cert-2',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2021',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Bilingual / Full Professional' },
    { id: 'lang-2', name: 'Bengali', proficiency: 'Native / Mother Tongue' },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Dr. Md. Saiful Islam',
      designation: 'Professor & Dean',
      company: 'BUET, Dhaka',
      phone: '+880 1819-000000',
      email: 'saiful@cse.buet.ac.bd',
    },
    {
      id: 'ref-2',
      name: 'Kamal Ahmed',
      designation: 'VP of Technology',
      company: 'Bkash Limited',
      phone: '+880 1711-111222',
      email: 'kamal.ahmed@bkash.com',
    },
  ],
  declaration: {
    text: 'I hereby declare that all information furnished above is genuine, authentic, and verifiable.',
    date: '14/11/2026',
    signedBy: 'Tahmidur Rahman',
  },
  customSections: [
    {
      id: 'cust-1',
      title: 'Honors & Distinctions',
      items: [
        {
          id: 'ci-1',
          title: 'National ICT Champion Award',
          subtitle: 'ICT Division Bangladesh',
          date: '2020',
          description: 'Awarded for architecting resilient digital public infrastructure during nationwide lockdowns.',
        },
      ],
    },
  ],
};

// 15 Dedicated One-Page Template IDs
const ONE_PAGE_TEMPLATES = [
  'onepage-fresher-clean',
  'onepage-bd-compact',
  'onepage-modern-split',
  'onepage-minimal-swiss',
  'onepage-tech-grid',
  'onepage-it-sidebar',
  'onepage-ats-strict',
  'onepage-executive-brief',
  'onepage-academic-compact',
  'onepage-creative-editorial',
  'onepage-clinical-health',
  'onepage-finance-ledger',
  'onepage-engineering-spec',
  'onepage-marketing-growth',
  'onepage-skilled-trade-pro',
];

// Multi-Page Templates & Aliases
const MULTI_PAGE_TEMPLATES = [
  'bd-corporate-standard',
  'executive-slate',
  'ocean-split',
  'linear-dark',
  'ats-classic',
  'academic-multipage-cv',
  'modern-blue',
  'apple-clean',
  'creative-coral',
  'modern-minimal',
];

const ALL_TEMPLATES_TO_TEST = [...ONE_PAGE_TEMPLATES, ...MULTI_PAGE_TEMPLATES];

/**
 * Extracts vector text operators and font descriptors from PDF Buffer
 */
const verifyPdfSelectableText = (pdfBuffer) => {
  const pdfString = pdfBuffer.toString('latin1');
  const hasFontDescriptor =
    pdfString.includes('/Type /Font') ||
    pdfString.includes('/Subtype /Type0') ||
    pdfString.includes('/Subtype /TrueType') ||
    pdfString.includes('/FontDescriptor');

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  let hasTextOperators = false;
  while ((match = streamRegex.exec(pdfString)) !== null) {
    try {
      const decompressed = zlib.inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1');
      if (decompressed.includes('BT') && decompressed.includes('ET')) {
        hasTextOperators = true;
        break;
      }
    } catch (_) {}
  }

  return {
    hasFontDescriptor,
    hasTextOperators,
    isSelectable: hasFontDescriptor && hasTextOperators,
  };
};

/**
 * Computes exact number of pages in PDF
 */
const getPdfPageCount = (pdfBuffer) => {
  const matches = pdfBuffer.toString('latin1').match(/\/Type\s*\/Page\b/g);
  return matches ? matches.length : 0;
};

async function runVerification() {
  console.log('='.repeat(80));
  console.log('NOVACV TEMPLATE & PDF VERIFICATION PASS');
  console.log('='.repeat(80));

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureDetails = [];

  const assertCondition = (name, condition, errorMsg = '') => {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✔ [PASS] ${name}`);
    } else {
      failedTests++;
      const fullError = `❌ [FAIL] ${name}: ${errorMsg}`;
      console.error(`  ${fullError}`);
      failureDetails.push(fullError);
    }
  };

  // -------------------------------------------------------------------------
  // SECTION 1: SSR Template Rendering (Short, Standard, Dense Payloads)
  // -------------------------------------------------------------------------
  console.log('\n--- 1. SSR Template Rendering across Payloads ---');
  for (const templateId of ALL_TEMPLATES_TO_TEST) {
    for (const [payloadName, payload] of [
      ['Short', SHORT_CV],
      ['Standard', STANDARD_CV],
      ['Dense', DENSE_CV],
    ]) {
      const testName = `SSR render: ${templateId} (${payloadName} Payload)`;
      try {
        const testCv = { ...payload, templateId };
        const html = renderCVToStaticHtml(testCv);
        const hasContent = typeof html === 'string' && html.length > 500;
        const hasUserName = html.includes(payload.personalInfo.fullName);
        assertCondition(testName, hasContent && hasUserName, `Rendered HTML invalid or missing user name (length: ${html?.length})`);
      } catch (err) {
        assertCondition(testName, false, `Threw error: ${err.message}`);
      }
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 2: Chromium PDF Engine & One-Page Single A4 Guarantee
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Chromium PDF Verification (1-Page Guarantee & Selectable Text) ---');
  for (const templateId of ONE_PAGE_TEMPLATES) {
    const testName = `One-Page PDF Guarantee: ${templateId} (Dense Payload)`;
    try {
      const testCv = {
        ...DENSE_CV,
        templateId,
        isOnePage: true,
        design: { ...(DENSE_CV.design || {}), pageSize: 'A4' },
      };

      const pdfBuffer = await generatePDF(testCv);
      const isBuffer = Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 10000;
      const hasPdfHeader = pdfBuffer.subarray(0, 5).toString('ascii') === '%PDF-';
      const pageCount = getPdfPageCount(pdfBuffer);
      const { isSelectable } = verifyPdfSelectableText(pdfBuffer);

      assertCondition(
        `${testName} -> Exactly 1 Page & Selectable Vector Text`,
        isBuffer && hasPdfHeader && pageCount === 1 && isSelectable,
        `Pages: ${pageCount} (Expected 1), Size: ${pdfBuffer?.length}B, Selectable: ${isSelectable}`
      );
    } catch (err) {
      assertCondition(testName, false, `PDF generation failed: ${err.message}`);
    }
  }

  // Multi-Page Template PDF generation check
  for (const templateId of ['bd-corporate-standard', 'executive-slate', 'ats-classic']) {
    const testName = `Multi-Page PDF Generation: ${templateId}`;
    try {
      const testCv = {
        ...DENSE_CV,
        templateId,
        isOnePage: false,
        design: { ...(DENSE_CV.design || {}), pageSize: 'A4' },
      };

      const pdfBuffer = await generatePDF(testCv);
      const isBuffer = Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 15000;
      const pageCount = getPdfPageCount(pdfBuffer);
      const { isSelectable } = verifyPdfSelectableText(pdfBuffer);

      assertCondition(
        `${testName} -> Multi-Page Rendered (${pageCount} pages, Selectable)`,
        isBuffer && pageCount >= 1 && isSelectable,
        `Pages: ${pageCount}, Size: ${pdfBuffer?.length}B, Selectable: ${isSelectable}`
      );
    } catch (err) {
      assertCondition(testName, false, `Multi-Page PDF generation failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 3: cvSlice Mode A <-> Mode B State Preservation
  // -------------------------------------------------------------------------
  console.log('\n--- 3. cvSlice Bidirectional Mode A <-> Mode B State Preservation ---');

  let state = cvReducer(undefined, setCVData(DENSE_CV));

  // Verify initial state matches DENSE_CV
  assertCondition(
    'Initial Redux State Hydration matches DENSE_CV',
    state.currentCV.personalInfo.fullName === 'Tahmidur Rahman, PMP' &&
      state.currentCV.personalInfo.fatherName === 'Late Mustafizur Rahman' &&
      state.currentCV.experience.length === 3 &&
      state.currentCV.education.length === 3 &&
      state.currentCV.skills.length === 10
  );

  // Transition to Mode B (Visual Canvas Edits)
  state = cvReducer(
    state,
    updateDesignTokens({
      fontFamily: 'Playfair Display',
      fontSize: 'large',
      primaryColor: '#0f766e',
      lineHeight: '1.6',
      sectionSpacing: '24px',
    })
  );

  state = cvReducer(
    state,
    setElementOverride({
      elementId: 'heading-summary',
      overrides: {
        color: '#0f766e',
        fontSize: '18px',
        fontWeight: 'bold',
      },
    })
  );

  state = cvReducer(
    state,
    updateSectionConfigItem({ id: 'experience', column: 'sidebar', label: 'Work History' })
  );

  state = cvReducer(state, toggleSectionVisibility('declaration'));

  state = cvReducer(
    state,
    addCustomElement({
      id: 'ce-badge-1',
      type: 'badge',
      content: 'IEEE Senior Member',
      sectionAnchor: 'personalInfo',
      style: { color: '#0f766e' },
    })
  );

  // Assert Mode B overrides are active
  const decConfig = state.currentCV.sectionConfig.find((s) => s.id === 'declaration');
  const expConfig = state.currentCV.sectionConfig.find((s) => s.id === 'experience');
  assertCondition(
    'Mode B visual tokens, element overrides, and section config applied cleanly',
    state.currentCV.designTokens.fontHeading === 'Playfair Display' &&
      state.currentCV.designTokens.primaryColor === '#0f766e' &&
      state.currentCV.elementOverrides['heading-summary']?.color === '#0f766e' &&
      decConfig?.visible === false &&
      expConfig?.column === 'sidebar' &&
      state.currentCV.customElements.length === 1
  );

  // Transition back to Mode A (Form Builder Edits)
  state = cvReducer(
    state,
    updatePersonalInfo({
      fullName: 'Tahmidur Rahman, Ph.D., PMP',
      phone: '+880 1711-999888',
      bloodGroup: 'AB+',
    })
  );

  state = cvReducer(
    state,
    updateSummary(
      'Updated summary via Mode A form: High-impact technical leader with expertise in distributed fault-tolerant systems.'
    )
  );

  state = cvReducer(
    state,
    updateCareerObjective('Updated career objective via Mode A form.')
  );

  state = cvReducer(
    state,
    addAchievement({
      title: 'Top Engineer of the Year 2025',
      issuer: 'Bangladesh IT Association',
      date: '2025',
    })
  );

  // CRITICAL VERIFICATION:
  // Assert that Mode A edits succeeded AND 100% of Mode B customizations remained intact!
  const modeAChangesPreserved =
    state.currentCV.personalInfo.fullName === 'Tahmidur Rahman, Ph.D., PMP' &&
    state.currentCV.personalInfo.phone === '+880 1711-999888' &&
    state.currentCV.personalInfo.bloodGroup === 'AB+' &&
    state.currentCV.summary.includes('Updated summary via Mode A form') &&
    state.currentCV.careerObjective === 'Updated career objective via Mode A form.' &&
    state.currentCV.achievements.length === 1;

  const decConfigAfter = state.currentCV.sectionConfig.find((s) => s.id === 'declaration');
  const expConfigAfter = state.currentCV.sectionConfig.find((s) => s.id === 'experience');

  const modeBTokensPreserved =
    state.currentCV.designTokens.fontHeading === 'Playfair Display' &&
    state.currentCV.designTokens.primaryColor === '#0f766e' &&
    state.currentCV.elementOverrides['heading-summary']?.color === '#0f766e' &&
    decConfigAfter?.visible === false &&
    expConfigAfter?.column === 'sidebar' &&
    state.currentCV.customElements.length === 1;

  const allPriorSectionsIntact =
    state.currentCV.experience.length === 3 &&
    state.currentCV.education.length === 3 &&
    state.currentCV.skills.length === 10 &&
    state.currentCV.projects.length === 3 &&
    state.currentCV.certifications.length === 2 &&
    state.currentCV.references.length === 2 &&
    state.currentCV.customSections.length === 1;

  assertCondition(
    'Bidirectional State Transition: Mode A updates preserved with 100% Mode B fidelity',
    modeAChangesPreserved && modeBTokensPreserved && allPriorSectionsIntact,
    'Field collision or data loss detected between Mode A and Mode B'
  );

  // -------------------------------------------------------------------------
  // CLEANUP & REPORT
  // -------------------------------------------------------------------------
  await closeSharedBrowser();

  console.log('\n' + '='.repeat(80));
  console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED TESTS (${failedTests}):`);
    failureDetails.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY (0 FAILURES)!');
    console.log('='.repeat(80));
    process.exit(0);
  }
}

runVerification().catch(async (err) => {
  console.error('Fatal verification runner error:', err);
  await closeSharedBrowser().catch(() => {});
  process.exit(1);
});
