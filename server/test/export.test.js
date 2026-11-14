import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'zlib';
import mongoose from 'mongoose';
import { generatePDF, generateTemplateHtml } from '../src/services/pdf/pdfService.js';
import { generateDOCX } from '../src/services/docx/docxService.js';
import {
  exportPDF,
  exportDOCX,
  exportPDFFallbackRecord,
  validateCvPayload,
} from '../src/controllers/exportController.js';
import { pickAllowedCVData } from '../src/controllers/cvController.js';
import CV from '../src/models/CV.js';
import {
  toDocxHex,
  stripTransientCvMeta,
  hasExportableCvContent,
} from '../../shared/utils/cvNormalize.js';

// 1. Minimal CV Data
const MINIMAL_CV = {
  templateId: 'modern-minimal',
  title: 'Minimal Resume',
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555-0199',
    jobTitle: 'Software Engineer',
    address: 'San Francisco, CA',
  },
  design: { pageSize: 'A4' },
};

// 2. Full CV Data with All Sections & BD Details
const FULL_CV = {
  templateId: 'bd-corporate-standard',
  title: 'Full Professional CV',
  personalInfo: {
    fullName: 'Tahmidur Rahman',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'tahmid.rahman@example.com',
    phone: '+880 1711-000000',
    address: 'Gulshan-2, Dhaka 1212',
    linkedin: 'linkedin.com/in/tahmidrahman',
    github: 'github.com/tahmidrahman',
    summary:
      'High-impact software engineer with 7+ years of experience engineering scalable microservices and real-time distributed platforms.',
  },
  personalDetails: {
    fatherName: 'Late Mustafizur Rahman',
    motherName: 'Begum Rokeya Rahman',
    dateOfBirth: '1994-08-15',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    bloodGroup: 'B+',
    nid: '19942692518000123',
    permanentAddress: 'House 42, Road 11, Dhanmondi, Dhaka',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Lead Software Architect',
      company: 'Grameenphone Ltd.',
      location: 'Dhaka, Bangladesh',
      startDate: '2021-03',
      endDate: 'Present',
      current: true,
      description: 'Lead engineering squad of 14 across digital microservices.',
      highlights: [
        'Architected high-throughput payment webhook processing 4M+ daily transactions.',
        'Migrated monolithic billing portal to containerized microservices on Kubernetes.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Senior Full Stack Developer',
      company: 'Brain Station 23',
      location: 'Dhaka, Bangladesh',
      startDate: '2018-07',
      endDate: '2021-02',
      current: false,
      description: 'Developed fintech mobile banking APIs and merchant portal.',
      highlights: [
        'Optimized PostgreSQL query latency by 45% using composite indexing and read replicas.',
        'Implemented OAuth 2.0 / OpenID Connect security architecture.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'Bangladesh University of Engineering & Technology (BUET)',
      location: 'Dhaka',
      startDate: '2013-02',
      endDate: '2017-10',
      grade: 'CGPA 3.86/4.00',
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Notre Dame College, Dhaka',
      location: 'Dhaka',
      startDate: '2010-06',
      endDate: '2012-06',
      grade: 'GPA 5.00/5.00',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Node.js & Express', level: 'Expert', category: 'Backend' },
    { id: 'sk-2', name: 'React.js & Next.js', level: 'Expert', category: 'Frontend' },
    { id: 'sk-3', name: 'PostgreSQL & MongoDB', level: 'Advanced', category: 'Database' },
    { id: 'sk-4', name: 'Docker & Kubernetes', level: 'Advanced', category: 'DevOps' },
    { id: 'sk-5', name: 'TypeScript & Golang', level: 'Intermediate', category: 'Languages' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniPay Open Banking Engine',
      link: 'github.com/tahmidrahman/omnipay',
      startDate: '2023-01',
      endDate: '2023-11',
      description:
        'Unified financial switch connecting bKash, Nagad, and Bangladesh Bank RTGS protocols.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2022-09',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Bangla', proficiency: 'Native / Bilingual' },
    { id: 'lang-2', name: 'English', proficiency: 'Professional Working' },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Dr. Mohammad Kaykobad',
      title: 'Distinguished Professor, Dept. of CSE',
      organization: 'BUET',
      email: 'kaykobad@cse.buet.ac.bd',
      phone: '+880 2-9665650',
    },
  ],
  declaration: {
    enabled: true,
    text: 'I hereby declare that all the information stated above is true and authentic to the best of my knowledge.',
  },
  design: {
    pageSize: 'A4',
    fontFamily: 'Inter',
    primaryColor: '#0f172a',
  },
};

// 3. Multi-page CV Data
const MULTI_PAGE_CV = {
  ...FULL_CV,
  templateId: 'modern-blue',
  experience: [
    ...FULL_CV.experience,
    {
      id: 'exp-3',
      jobTitle: 'Junior Software Engineer',
      company: 'Kaz Software',
      startDate: '2017-11',
      endDate: '2018-06',
      description: 'Worked on enterprise ERP customization and SQL reporting.',
      highlights: ['Created 30+ SSRS reports', 'Built automated reconciliation batch jobs'],
    },
    {
      id: 'exp-4',
      jobTitle: 'Software Engineering Intern',
      company: 'Therap Services LLC',
      startDate: '2016-06',
      endDate: '2016-12',
      description: 'Built automated test suites using Selenium WebDriver and JUnit.',
      highlights: ['Maintained 120 regression tests', 'Improved CI build reliability by 20%'],
    },
    {
      id: 'exp-5',
      jobTitle: 'Independent Technical Consultant',
      company: 'Upwork Global Inc.',
      startDate: '2015-01',
      endDate: '2016-05',
      description: 'Delivered web applications and cloud deployments for international clients.',
      highlights: ['Completed 25+ successful contracts with 100% job success rate'],
    },
  ],
};

// 4. CV with Photo (Valid 1x1 Transparent PNG data URI)
const CV_WITH_PHOTO = {
  ...FULL_CV,
  templateId: 'creative-coral',
  personalInfo: {
    ...FULL_CV.personalInfo,
    photo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  },
};

// All 15 Canonical Unique Templates + Legacy Backward-Compatibility Aliases
const ALL_TEMPLATE_IDS = [
  // Dedicated 1-Page Collection (10)
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
  // Expanded One-Page Collection samples
  'onepage-frontend-dev',
  'onepage-devops-cloud',
  'onepage-uiux-designer',
  'onepage-business-analyst',
  // Multiple-Page Collection (5)
  'bd-corporate-standard',
  'modern-blue',
  'executive-slate',
  'ocean-split',
  'ats-classic',
  // Expanded Bangladesh Collection samples
  'bd-bank-mto',
  'bd-bcs-admin-cadre',
  'bd-textile-senior-merchandiser',
  'bd-medical-mbbs-doctor',
  'bd-fresher-buet-cse',
  // Legacy Aliases (must still render cleanly via resolveTemplateId)
  'bd-fresher-graduate',
  'harvard-executive',
  'emerald-split',
  'creative-coral',
  'dark-mode',
];

describe('PDF Export Engine Test Suite', () => {
  it('should generate a valid PDF for Minimal CV (A4)', async () => {
    const buffer = await generatePDF(MINIMAL_CV);
    assert.ok(Buffer.isBuffer(buffer), 'Result must be a Buffer');
    assert.ok(buffer.length > 10000, `Buffer size (${buffer.length} bytes) must exceed 10KB`);
    const header = buffer.subarray(0, 5).toString('ascii');
    assert.strictEqual(header, '%PDF-', 'PDF must begin with %PDF- magic bytes');
  });

  it('should generate a valid PDF for Full CV with all sections', async () => {
    const buffer = await generatePDF(FULL_CV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 20000, `Full CV PDF size (${buffer.length} bytes) must exceed 20KB`);
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('should generate a valid PDF for Multi-page CV', async () => {
    const buffer = await generatePDF(MULTI_PAGE_CV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 25000, 'Multi-page PDF must be substantial');
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('should generate a valid PDF with embedded photo', async () => {
    const buffer = await generatePDF(CV_WITH_PHOTO);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 15000);
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('should support Letter page size correctly', async () => {
    const letterCV = {
      ...FULL_CV,
      design: { ...FULL_CV.design, pageSize: 'Letter' },
    };
    const buffer = await generatePDF(letterCV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 15000);
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('should strictly generate exactly 1 single page for One-Page CV even with full content', async () => {
    const onePageFullCV = {
      ...FULL_CV,
      templateId: 'onepage-bd-compact',
      isOnePage: true,
    };
    const buffer = await generatePDF(onePageFullCV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    // Verify that the PDF object tree contains exactly 1 page descriptor (/Type /Page)
    const pageMatches = buffer.toString('latin1').match(/\/Type\s*\/Page\b/g);
    assert.ok(pageMatches, 'PDF should have page descriptors');
    assert.strictEqual(pageMatches.length, 1, `One-page CV must strictly contain 1 page (got ${pageMatches.length})`);
  });

  // Verify all canonical + legacy alias template IDs
  for (const templateId of ALL_TEMPLATE_IDS) {
    it(`should render PDF successfully for template: ${templateId}`, async () => {
      const templateCV = { ...FULL_CV, templateId };
      const buffer = await generatePDF(templateCV);
      assert.ok(Buffer.isBuffer(buffer), `Buffer generated for ${templateId}`);
      assert.ok(buffer.length > 10000, `${templateId} PDF must exceed 10KB (got ${buffer.length})`);
      assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });
  }

  it('should handle unhandled/unknown template ID gracefully by falling back safely', async () => {
    const fallbackCV = { ...FULL_CV, templateId: 'non-existent-template' };
    const buffer = await generatePDF(fallbackCV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 10000);
    assert.strictEqual(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });
});

describe('DOCX Export Engine Test Suite', () => {
  it('should generate a valid DOCX for Minimal CV', async () => {
    const buffer = await generateDOCX(MINIMAL_CV);
    assert.ok(Buffer.isBuffer(buffer), 'Result must be a Buffer');
    assert.ok(buffer.length > 5000, `Buffer size (${buffer.length} bytes) must exceed 5KB`);
    // Check OpenXML ZIP magic bytes: PK\x03\x04 (hex: 50 4b 03 04)
    const magic = buffer.subarray(0, 4).toString('hex');
    assert.strictEqual(magic, '504b0304', 'DOCX must have valid OpenXML PK magic bytes');
  });

  it('should generate a valid DOCX for Full CV with all sections and tables', async () => {
    const buffer = await generateDOCX(FULL_CV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 8000, `Full DOCX size (${buffer.length} bytes) must exceed 8KB`);
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
  });

  it('should generate a valid DOCX for Multi-page CV', async () => {
    const buffer = await generateDOCX(MULTI_PAGE_CV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 10000, 'Multi-page DOCX must exceed 10KB');
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
  });

  it('should generate a valid DOCX with embedded photo', async () => {
    const buffer = await generateDOCX(CV_WITH_PHOTO);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 5000);
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
  });

  it('should support Letter page size in DOCX correctly', async () => {
    const letterCV = {
      ...FULL_CV,
      design: { ...FULL_CV.design, pageSize: 'Letter' },
    };
    const buffer = await generateDOCX(letterCV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 5000);
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
  });

  // Verify all canonical + legacy alias template IDs for DOCX
  for (const templateId of ALL_TEMPLATE_IDS) {
    it(`should compile DOCX successfully for template: ${templateId}`, async () => {
      const templateCV = { ...FULL_CV, templateId };
      const buffer = await generateDOCX(templateCV);
      assert.ok(Buffer.isBuffer(buffer), `DOCX Buffer compiled for ${templateId}`);
      assert.ok(buffer.length > 5000, `${templateId} DOCX must exceed 5KB (got ${buffer.length})`);
      assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
    });
  }

  it('should handle missing fields without crashing', async () => {
    const emptyCV = {
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
    };
    const buffer = await generateDOCX(emptyCV);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 2000);
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
  });
});

describe('Export Controller Validation & Auth Guard Test Suite', () => {
  it('should return 401 AUTH_REQUIRED when req.user is missing in exportPDF', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { body: { cvData: MINIMAL_CV } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportPDF(req, res);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.success, false);
    assert.strictEqual(jsonBody.code, 'AUTH_REQUIRED');
  });

  it('should return 401 AUTH_REQUIRED when req.user is missing in exportDOCX', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { body: { cvData: MINIMAL_CV } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportDOCX(req, res);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.success, false);
    assert.strictEqual(jsonBody.code, 'AUTH_REQUIRED');
  });

  it('should return 400 when authenticated and cvData is missing in exportPDF', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { user: { id: '000000000000000000000001', role: 'user' }, body: {} };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportPDF(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody.success, false);
    assert.ok(jsonBody.message.includes('Invalid CV data'));
  });

  it('should return 400 when authenticated and cvData is null in exportDOCX', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { user: { id: '000000000000000000000001', role: 'user' }, body: { cvData: null } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportDOCX(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody.success, false);
  });

  it('should return 401 AUTH_REQUIRED when req.user is missing in exportPDFFallbackRecord', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { body: { cvData: MINIMAL_CV } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportPDFFallbackRecord(req, res);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.code, 'AUTH_REQUIRED');
  });

  it('should return 400 when authenticated and cvData is empty in exportPDFFallbackRecord', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { user: { id: '000000000000000000000001', role: 'user' }, body: { cvData: {} } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    await exportPDFFallbackRecord(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody.success, false);
  });
});

const extractDocxEntryText = (zipBuf, targetName) => {
  let eocdOffset = -1;
  for (let i = zipBuf.length - 22; i >= Math.max(0, zipBuf.length - 65558); i--) {
    if (zipBuf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) return '';
  const cdOffset = zipBuf.readUInt32LE(eocdOffset + 16);
  const cdSize = zipBuf.readUInt32LE(eocdOffset + 12);
  let pos = cdOffset;
  const cdEnd = cdOffset + cdSize;
  while (pos + 46 <= cdEnd) {
    if (zipBuf.readUInt32LE(pos) !== 0x02014b50) break;
    const method = zipBuf.readUInt16LE(pos + 10);
    const compressedSize = zipBuf.readUInt32LE(pos + 20);
    const nameLen = zipBuf.readUInt16LE(pos + 28);
    const extraLen = zipBuf.readUInt16LE(pos + 30);
    const commentLen = zipBuf.readUInt16LE(pos + 32);
    const localHeaderOffset = zipBuf.readUInt32LE(pos + 42);
    const name = zipBuf.toString('utf8', pos + 46, pos + 46 + nameLen);
    pos += 46 + nameLen + extraLen + commentLen;
    if (name !== targetName) continue;
    const lNameLen = zipBuf.readUInt16LE(localHeaderOffset + 26);
    const lExtraLen = zipBuf.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + lNameLen + lExtraLen;
    const slice = zipBuf.subarray(dataStart, dataStart + compressedSize);
    return method === 8 ? zlib.inflateRawSync(slice).toString('utf8') : slice.toString('utf8');
  }
  return '';
};

describe('Export & Persistence Edge-Case Regression Suite', () => {
  it('should normalize CSS colors to strict 6-char OpenXML hex in toDocxHex', () => {
    assert.strictEqual(toDocxHex('rgb(37, 99, 235)'), '2563EB');
    assert.strictEqual(toDocxHex('rgba(16, 185, 129, 0.85)'), '10B981');
    assert.strictEqual(toDocxHex('#f6a'), 'FF66AA');
    assert.strictEqual(toDocxHex('#2563eb'), '2563EB');
    assert.strictEqual(toDocxHex('not-a-color', '1E40AF'), '1E40AF');
  });

  it('should generate valid DOCX with rgb() colors, null entries, string arrays, customSections, and control chars', async () => {
    const dirtyCv = {
      templateId: 'bd-corporate-standard',
      personalInfo: {
        fullName: 'Ariana\x00 Kabir\uFFFF',
        jobTitle: 404,
        summary: 'Summary\x0B with unsafe XML chars',
      },
      design: { primaryColor: 'rgb(37, 99, 235)' },
      experience: [
        null,
        {
          jobTitle: 'Analyst',
          company: 'Dhaka FinTech',
          highlights: 'Built dashboards, Automated ETL',
        },
      ],
      education: [null],
      skills: ['TypeScript', 'PostgreSQL'],
      projects: ['OpenPay Gateway'],
      certifications: null,
      languages: ['Bengali', { name: 'English', proficiency: 'Fluent' }],
      references: [null, 'Dr. Hasan'],
      customSections: [
        {
          title: 'Honors & Awards',
          content: 'Recipient of national Merit Scholarship.',
          items: ['Dean List 2024'],
        },
      ],
    };

    const buffer = await generateDOCX(dirtyCv);
    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 3000, `Dirty DOCX size (${buffer.length}) must be valid`);
    assert.strictEqual(buffer.subarray(0, 4).toString('hex'), '504b0304');
    // Decompress word/document.xml inside DOCX ZIP to verify custom section text & normalized hex color
    const docXml = extractDocxEntryText(buffer, 'word/document.xml');
    assert.ok(docXml.includes('HONORS'), 'Custom section heading rendered in word/document.xml');
    assert.ok(docXml.includes('Merit Scholarship'), 'Custom section content rendered in word/document.xml');
    assert.ok(docXml.includes('2563EB'), 'Normalized 6-digit hex color applied in word/document.xml');
    assert.ok(!docXml.includes('\u0000') && !docXml.includes('\uFFFF'), 'XML-unsafe control chars stripped');
  });

  it('should embed valid PNG photo cleanly and skip unsupported WebP or dead URLs without failing DOCX', async () => {
    const withPng = await generateDOCX({
      ...MINIMAL_CV,
      personalInfo: { ...MINIMAL_CV.personalInfo, photo: CV_WITH_PHOTO.personalInfo.photo },
    });
    assert.strictEqual(withPng.subarray(0, 4).toString('hex'), '504b0304');
    assert.ok(withPng.includes('word/media/'), 'Valid PNG photo should be embedded into word/media/');

    const webpDataUri =
      'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const withWebp = await generateDOCX({
      ...MINIMAL_CV,
      personalInfo: { ...MINIMAL_CV.personalInfo, photo: webpDataUri },
    });
    assert.strictEqual(withWebp.subarray(0, 4).toString('hex'), '504b0304');

    const withDeadUrl = await generateDOCX({
      ...MINIMAL_CV,
      personalInfo: { ...MINIMAL_CV.personalInfo, photo: 'http://127.0.0.1:1/unreachable.jpg' },
    });
    assert.strictEqual(withDeadUrl.subarray(0, 4).toString('hex'), '504b0304');
  });

  it('should sanitize partial updates and mixed arrays cleanly for Mongoose CV schema validation', () => {
    const partial = pickAllowedCVData({ title: 'Renamed Resume' });
    assert.deepStrictEqual(partial, { title: 'Renamed Resume' });

    const dirtyCreate = pickAllowedCVData({
      title: 'Sparse Graduate CV',
      templateId: 'onepage-fresher-clean',
      personalInfo: { fullName: 'Tariqul Islam', photoStyle: 'octagon' },
      design: { primaryColor: 'rgb(5, 150, 105)', fontSize: 'giant', pageSize: 'A4' },
      experience: null,
      skills: ['React', 'Node.js'],
      projects: ['LMS Portal'],
      customSections: [{ title: 'Activities', items: ['Robotics Club President'] }],
    });

    const doc = new CV({
      ...dirtyCreate,
      userId: new mongoose.Types.ObjectId(),
    });
    const validationErr = doc.validateSync();
    assert.strictEqual(validationErr, undefined, `Expected clean validation, got: ${validationErr?.message}`);
    assert.strictEqual(doc.personalInfo.photoStyle, 'circle');
    assert.strictEqual(doc.design.primaryColor, '#059669');
    assert.strictEqual(doc.skills.length, 2);
    assert.strictEqual(doc.customSections[0].items[0].title, 'Robotics Club President');
  });

  it('should accept summary-only, project-only, and customSection-only CVs in validateCvPayload', () => {
    assert.strictEqual(validateCvPayload({}), 'CV data appears empty. Please fill in at least a name, contact, summary, or content section before exporting.');
    assert.strictEqual(validateCvPayload({ personalInfo: { summary: '3+ years backend dev' } }), null);
    assert.strictEqual(validateCvPayload({ projects: [{ name: 'Analytics Engine' }] }), null);
    assert.strictEqual(validateCvPayload({ customSections: [{ title: 'Publications', content: 'IEEE 2025' }] }), null);
    assert.strictEqual(hasExportableCvContent({ certifications: ['AWS SAA'] }), true);
  });

  it('should render SSR HTML without crashing across all templates when section arrays are null or sparse', () => {
    for (const templateId of ALL_TEMPLATE_IDS) {
      const html = generateTemplateHtml({
        templateId,
        personalInfo: { fullName: 'Sparse Test User', jobTitle: 'Engineer' },
        experience: null,
        education: [null],
        skills: ['JavaScript', null],
        projects: null,
        certifications: [null, 'AWS'],
        languages: null,
        references: null,
        customSections: null,
      });
      assert.ok(typeof html === 'string' && html.length > 100, `SSR HTML must render for ${templateId}`);
    }
  });

  it('should strip transient Mongo/entitlement metadata when cloning template cards', () => {
    const cleaned = stripTransientCvMeta({
      _id: '507f1f77bcf86cd799439011',
      isExportUnlocked: true,
      unlockType: 'paid',
      version: 9,
      templateId: 'onepage-fresher-clean',
      personalInfo: { fullName: 'Kept User' },
    });
    assert.strictEqual(cleaned._id, undefined);
    assert.strictEqual(cleaned.isExportUnlocked, undefined);
    assert.strictEqual(cleaned.unlockType, undefined);
    assert.strictEqual(cleaned.version, undefined);
    assert.strictEqual(cleaned.personalInfo.fullName, 'Kept User');
  });
});
