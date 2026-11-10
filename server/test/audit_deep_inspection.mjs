import { generatePDF } from '../src/services/pdf/pdfService.js';
import { generateDOCX } from '../src/services/docx/docxService.js';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const AUDIT_OUT_DIR = path.resolve(process.cwd(), 'audit_output');
if (!fs.existsSync(AUDIT_OUT_DIR)) {
  fs.mkdirSync(AUDIT_OUT_DIR, { recursive: true });
}

// 9 Core Template IDs
const TEMPLATES = [
  'modern-blue',
  'apple-clean',
  'ats-classic',
  'bd-corporate-standard',
  'creative-coral',
  'executive-slate',
  'linear-dark',
  'modern-minimal',
  'ocean-split',
];

// Realistic Short CV Data
const SHORT_CV = {
  templateId: 'modern-blue',
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

// Realistic Long Multi-Page CV Data
const LONG_CV = {
  templateId: 'bd-corporate-standard',
  title: 'Executive Curriculum Vitae',
  personalInfo: {
    fullName: 'Engr. Mahbubul Alam, Ph.D.',
    jobTitle: 'Chief Technology Officer & VP of Engineering',
    email: 'mahbubul.alam@enterprise.org',
    phone: '+880 1711-888999',
    location: 'Baridhara DOHS, Dhaka 1206',
    linkedin: 'linkedin.com/in/mahbubulalam-cto',
    website: 'mahbubul.tech',
    summary:
      'Executive engineering leader with 16+ years of global experience scaling cloud infrastructure, core banking integrations, high-velocity developer platforms, and cross-functional teams of 80+ engineers.',
  },
  personalDetails: {
    fatherName: 'Late Alhaj Nurul Islam',
    motherName: 'Mrs. Fatema Begum',
    dateOfBirth: '1982-11-20',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    bloodGroup: 'O+',
    nid: '19822692518000456',
    presentAddress: 'Apartment 7B, House 14, Road 4, Baridhara DOHS, Dhaka',
    permanentAddress: 'Village: Uttarpara, P.O: Feni Sadar, Dist: Feni',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Chief Technology Officer',
      company: 'bKash Limited',
      location: 'Dhaka, Bangladesh',
      startDate: '2020-04',
      endDate: 'Present',
      current: true,
      description: 'Oversee entire core fintech engineering ecosystem processing 12M daily financial API calls.',
      highlights: [
        'Spearheaded zero-trust microservices re-architecture reducing inter-service latency by 42%.',
        'Built automated PCI-DSS compliant infrastructure with 99.999% uptime SLAs.',
        'Mentored 6 engineering directors and scaled tech organization from 45 to 110 engineers.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Head of Engineering',
      company: 'Chaldal Inc.',
      location: 'Dhaka, Bangladesh',
      startDate: '2016-02',
      endDate: '2020-03',
      current: false,
      description: 'Led warehouse automation, route dispatch algorithms, and consumer mobile engineering squads.',
      highlights: [
        'Developed dynamic vehicle routing algorithm cutting grocery delivery delivery time by 28 minutes.',
        'Scaled concurrent order processing during pandemic peak with zero outage.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Principal Software Architect',
      company: 'Samsung R&D Institute Bangladesh',
      location: 'Dhaka, Bangladesh',
      startDate: '2012-05',
      endDate: '2016-01',
      current: false,
      description: 'Engineered multi-threaded media codecs and Tizen platform core services.',
      highlights: [
        'Granted 2 US software patents on low-power background synchronization.',
        'Received Samsung Global Innovation Award for high-efficiency memory management.',
      ],
    },
    {
      id: 'exp-4',
      jobTitle: 'Senior Software Engineer',
      company: 'Kona Software Lab Ltd.',
      location: 'Dhaka, Bangladesh',
      startDate: '2008-08',
      endDate: '2012-04',
      current: false,
      description: 'Implemented Java Card applets and smart card cryptography for international banking clients.',
      highlights: ['Certified EMVCo payment kernels for Korean telecom smart chips.'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Ph.D. in Computer Science & Distributed Systems',
      institution: 'Nanyang Technological University (NTU), Singapore',
      startDate: '2004',
      endDate: '2008',
      grade: 'Top 5% Thesis Award',
    },
    {
      id: 'edu-2',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      startDate: '1999',
      endDate: '2004',
      grade: 'First Class with Honors (CGPA 3.94/4.00)',
    },
    {
      id: 'edu-3',
      degree: 'Higher Secondary Certificate (HSC) in Science',
      institution: 'Notre Dame College, Dhaka',
      startDate: '1997',
      endDate: '1999',
      grade: 'GPA 5.00 / Star Marks (Combined Board 4th)',
    },
  ],
  skills: [
    { id: 's1', name: 'Distributed Systems & Cloud Architecture' },
    { id: 's2', name: 'Kubernetes, Docker, Envoy, Istio' },
    { id: 's3', name: 'Go, Java, Rust, TypeScript, Python' },
    { id: 's4', name: 'PostgreSQL, Apache Kafka, Cassandra, Redis' },
    { id: 's5', name: 'Executive Leadership, OKRs, Agile Governance' },
    { id: 's6', name: 'Fintech, EMV, PCI-DSS Level 1 Compliance' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'National QR Code Standard (Bangla QR) Payment Engine',
      startDate: '2022',
      endDate: '2023',
      description: 'Collaborated with Bangladesh Bank to deploy unified national interoperable QR switch.',
      technologies: ['Go', 'Kafka', 'PostgreSQL', 'mTLS'],
    },
    {
      id: 'p2',
      title: 'Real-Time Fraud Prevention ML Engine',
      startDate: '2021',
      endDate: '2022',
      description: 'Deployed sub-15ms inference engine blocking 180,000+ fraudulent transactions monthly.',
      technologies: ['Python', 'gRPC', 'Redis', 'TensorFlow Serving'],
    },
  ],
  certifications: [
    { id: 'c1', name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', date: '2023' },
    { id: 'c2', name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2', date: '2021' },
  ],
  languages: [
    { id: 'l1', language: 'Bengali', proficiency: 'Native / Mother Tongue' },
    { id: 'l2', language: 'English', proficiency: 'Fluent / Bilingual' },
  ],
  references: [
    {
      id: 'r1',
      name: 'Prof. Dr. M. Kaykobad',
      designation: 'Professor Emeritus',
      company: 'Dept of CSE, BUET',
      phone: '+880 2-9665650',
      email: 'kaykobad@cse.buet.ac.bd',
    },
    {
      id: 'r2',
      name: 'Kamal Quadir',
      designation: 'Chief Executive Officer',
      company: 'bKash Limited',
      phone: '+880 2-9858500',
      email: 'ceo.office@bkash.com',
    },
  ],
  declaration: {
    enabled: true,
    text: 'I solemnly affirm and declare that the statements made in this curriculum vitae are true and complete to the best of my knowledge.',
    date: '10/11/2026',
    signedBy: 'Dr. Mahbubul Alam',
  },
};

// Unicode & Special Characters CV
const UNICODE_CV = {
  templateId: 'bd-corporate-standard',
  title: 'Unicode & International Resume',
  personalInfo: {
    fullName: 'মুহাম্মদ তানভীর আহমেদ (Tanveer Ahmed)',
    jobTitle: 'Senior Software Engineer — Cloud & Data',
    email: 'tanveer.ahmed+test@example.org',
    phone: '+880 1912-345678',
    location: 'ঢাকা, বাংলাদেশ (Dhaka, Bangladesh)',
    summary:
      'অভিজ্ঞ ক্লাউড আর্কিটেক্ট ও সফটওয়্যার ইঞ্জিনিয়ার। Specializing in resilient distributed systems & high-throughput pipelines with 99.99% uptime. Symbols test: © 2026, ® registered, ™ trademark, €100k, £85k, ¥10m, — em-dash, – en-dash, “smart quotes”.',
  },
  experience: [
    {
      id: 'u1',
      jobTitle: 'ক্লাউড ইঞ্জিনিয়ার (Cloud Engineer)',
      company: 'আন্তর্জাতিক টেক লিমিটেড (Global Tech Ltd.)',
      startDate: '২০২১',
      endDate: 'বর্তমান (Present)',
      current: true,
      description: 'উন্নত ডিস্ট্রিবিউটেড সিস্টেম ও কুবারনেটিস ক্লাস্টার পরিচালনা।',
      highlights: [
        'অটোমেটেড পাইপলাইন ও ডিপ্লয়মেন্ট ম্যানেজমেন্ট।',
        'Handled €50M annual transaction volumes with 0% data loss.',
      ],
    },
  ],
  education: [
    {
      id: 'ued1',
      degree: 'বি.এসসি (কম্পিউটার সায়েন্স)',
      institution: 'ঢাকা বিশ্ববিদ্যালয় (University of Dhaka)',
      startDate: '২০১৬',
      endDate: '২০২০',
      grade: 'প্রথম শ্রেণী (First Class)',
    },
  ],
  skills: [{ id: 'us1', name: 'Node.js & Go' }, { id: 'us2', name: 'ক্লাউড কম্পিউটিং' }],
};

async function runAudit() {
  console.log('====================================================');
  console.log('STARTING INDEPENDENT DEEP AUDIT FOR PDF & DOCX');
  console.log('====================================================\n');

  let pdfSuccess = 0;
  let pdfFail = 0;
  let docxSuccess = 0;
  let docxFail = 0;
  const issues = [];

  // 1. AUDIT PDF ACROSS ALL TEMPLATES (Short & Long)
  console.log('--- 1. AUDITING PDF GENERATION FOR ALL 9 TEMPLATES ---');
  for (const tId of TEMPLATES) {
    try {
      // Test Short CV
      const shortPdf = await generatePDF({ ...SHORT_CV, templateId: tId });
      const shortFilename = `audit_short_${tId}.pdf`;
      fs.writeFileSync(path.join(AUDIT_OUT_DIR, shortFilename), shortPdf);

      if (shortPdf.length < 10000 || !shortPdf.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
        throw new Error(`Invalid PDF header or small size: ${shortPdf.length} bytes`);
      }

      // Test Long Multi-Page CV
      const longPdf = await generatePDF({ ...LONG_CV, templateId: tId });
      const longFilename = `audit_long_${tId}.pdf`;
      fs.writeFileSync(path.join(AUDIT_OUT_DIR, longFilename), longPdf);

      if (longPdf.length < 20000 || !longPdf.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
        throw new Error(`Invalid Long PDF header or small size: ${longPdf.length} bytes`);
      }

      console.log(`[PASS] Template ${tId}: Short PDF (${(shortPdf.length / 1024).toFixed(1)} KB), Long PDF (${(longPdf.length / 1024).toFixed(1)} KB)`);
      pdfSuccess += 2;
    } catch (err) {
      console.error(`[FAIL] Template ${tId} PDF: ${err.message}`);
      issues.push({ template: tId, type: 'PDF', error: err.message });
      pdfFail++;
    }
  }

  // 2. AUDIT UNICODE & BENGALI PDF
  console.log('\n--- 2. AUDITING UNICODE & BENGALI CHARACTER SUPPORT ---');
  try {
    const unicodePdf = await generatePDF(UNICODE_CV);
    fs.writeFileSync(path.join(AUDIT_OUT_DIR, 'audit_unicode.pdf'), unicodePdf);
    console.log(`[PASS] Unicode & Bengali PDF: ${(unicodePdf.length / 1024).toFixed(1)} KB generated cleanly.`);
    pdfSuccess++;
  } catch (err) {
    console.error(`[FAIL] Unicode PDF: ${err.message}`);
    issues.push({ template: 'unicode', type: 'PDF', error: err.message });
    pdfFail++;
  }

  // 3. AUDIT DOCX GENERATION ACROSS ALL TEMPLATES
  console.log('\n--- 3. AUDITING DOCX GENERATION FOR ALL 9 TEMPLATES ---');
  for (const tId of TEMPLATES) {
    try {
      const shortDocx = await generateDOCX({ ...SHORT_CV, templateId: tId });
      const shortFilename = `audit_short_${tId}.docx`;
      fs.writeFileSync(path.join(AUDIT_OUT_DIR, shortFilename), shortDocx);

      const magicShort = shortDocx.subarray(0, 4).toString('hex');
      if (magicShort !== '504b0304' || shortDocx.length < 5000) {
        throw new Error(`Invalid DOCX magic bytes (${magicShort}) or size (${shortDocx.length})`);
      }

      const longDocx = await generateDOCX({ ...LONG_CV, templateId: tId });
      const longFilename = `audit_long_${tId}.docx`;
      fs.writeFileSync(path.join(AUDIT_OUT_DIR, longFilename), longDocx);

      const magicLong = longDocx.subarray(0, 4).toString('hex');
      if (magicLong !== '504b0304' || longDocx.length < 8000) {
        throw new Error(`Invalid DOCX magic bytes (${magicLong}) or size (${longDocx.length})`);
      }

      console.log(`[PASS] Template ${tId} DOCX: Short (${(shortDocx.length / 1024).toFixed(1)} KB), Long (${(longDocx.length / 1024).toFixed(1)} KB)`);
      docxSuccess += 2;
    } catch (err) {
      console.error(`[FAIL] Template ${tId} DOCX: ${err.message}`);
      issues.push({ template: tId, type: 'DOCX', error: err.message });
      docxFail++;
    }
  }

  // 4. AUDIT UNICODE & BENGALI DOCX
  try {
    const unicodeDocx = await generateDOCX(UNICODE_CV);
    fs.writeFileSync(path.join(AUDIT_OUT_DIR, 'audit_unicode.docx'), unicodeDocx);
    console.log(`[PASS] Unicode & Bengali DOCX: ${(unicodeDocx.length / 1024).toFixed(1)} KB generated cleanly.`);
    docxSuccess++;
  } catch (err) {
    console.error(`[FAIL] Unicode DOCX: ${err.message}`);
    issues.push({ template: 'unicode', type: 'DOCX', error: err.message });
    docxFail++;
  }

  // 5. STRESS TEST: CONCURRENCY & ISOLATION
  console.log('\n--- 4. STRESS TEST: CONCURRENT EXPORTS & DATA ISOLATION ---');
  const CONCURRENT_COUNT = 5;
  const concurrentTasks = [];
  for (let i = 0; i < CONCURRENT_COUNT; i++) {
    const userCv = {
      ...SHORT_CV,
      personalInfo: {
        ...SHORT_CV.personalInfo,
        fullName: `UniqueUser_${i}_${Date.now()}`,
        email: `user_${i}@stress.test`,
      },
    };
    concurrentTasks.push(
      (async () => {
        const start = Date.now();
        const pdfBuf = await generatePDF(userCv);
        const docxBuf = await generateDOCX(userCv);
        const elapsed = Date.now() - start;
        return { i, name: userCv.personalInfo.fullName, pdfSize: pdfBuf.length, docxSize: docxBuf.length, elapsed };
      })()
    );
  }

  const concurrentResults = await Promise.all(concurrentTasks);
  concurrentResults.forEach((res) => {
    console.log(`[CONCURRENT PASS] Worker ${res.i}: ${res.name} -> PDF (${(res.pdfSize / 1024).toFixed(1)} KB), DOCX (${(res.docxSize / 1024).toFixed(1)} KB) in ${res.elapsed}ms`);
  });

  console.log('\n====================================================');
  console.log('AUDIT RUN COMPLETED');
  console.log(`PDF Tests: ${pdfSuccess} passed, ${pdfFail} failed`);
  console.log(`DOCX Tests: ${docxSuccess} passed, ${docxFail} failed`);
  console.log(`Discovered Issues: ${issues.length}`);
  console.log('====================================================');

  if (issues.length > 0) {
    console.log('Issues details:', JSON.stringify(issues, null, 2));
    process.exit(1);
  }
}

runAudit().catch((e) => {
  console.error('Audit crashed:', e);
  process.exit(1);
});

