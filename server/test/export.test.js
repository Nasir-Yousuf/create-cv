import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generatePDF } from '../src/services/pdf/pdfService.js';
import { generateDOCX } from '../src/services/docx/docxService.js';
import { exportPDF, exportDOCX } from '../src/controllers/exportController.js';

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

// All 9 Template IDs
const ALL_TEMPLATE_IDS = [
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

  // Verify all 9 template IDs
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

  // Verify all 9 template IDs for DOCX
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

describe('Export Controller Validation & Failure Handling Test Suite', () => {
  it('should return 400 when cvData is missing or invalid in exportPDF', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { body: {} };
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

  it('should return 400 when cvData is null in exportDOCX', async () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { body: { cvData: null } };
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

  it('should return 200 with application/pdf headers when exportPDF succeeds', async () => {
    let headers = {};
    let endedBuffer = null;
    const req = { body: { cvData: MINIMAL_CV } };
    const res = {
      set(h) {
        headers = { ...headers, ...h };
        return this;
      },
      status(code) {
        return this;
      },
      end(buf) {
        endedBuffer = buf;
        return this;
      },
    };
    await exportPDF(req, res);
    assert.strictEqual(headers['Content-Type'], 'application/pdf');
    assert.ok(headers['Content-Disposition'].includes('attachment'));
    assert.ok(Buffer.isBuffer(endedBuffer));
    assert.strictEqual(endedBuffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('should return 200 with openxmlheaders when exportDOCX succeeds', async () => {
    let headers = {};
    let endedBuffer = null;
    const req = { body: { cvData: MINIMAL_CV } };
    const res = {
      set(h) {
        headers = { ...headers, ...h };
        return this;
      },
      status(code) {
        return this;
      },
      end(buf) {
        endedBuffer = buf;
        return this;
      },
    };
    await exportDOCX(req, res);
    assert.strictEqual(
      headers['Content-Type'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    assert.ok(headers['Content-Disposition'].includes('.docx'));
    assert.ok(Buffer.isBuffer(endedBuffer));
    assert.strictEqual(endedBuffer.subarray(0, 4).toString('hex'), '504b0304');
  });
});
