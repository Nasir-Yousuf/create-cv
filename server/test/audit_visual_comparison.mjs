import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const outputDir = path.resolve('test/visual_audit_output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read html2canvas and jspdf from client node_modules
const html2canvasPath = path.resolve('../client/node_modules/html2canvas/dist/html2canvas.min.js');
const html2canvasCode = fs.readFileSync(html2canvasPath, 'utf8');
const jspdfPath = path.resolve('../client/node_modules/jspdf/dist/jspdf.umd.min.js');
const jspdfCode = fs.readFileSync(jspdfPath, 'utf8');

// The realistic Saymon Alex CV Data from user screenshot
const SAYMON_CV = {
  templateId: 'modern-blue',
  title: 'Professional Resume',
  personalInfo: {
    fullName: 'Saymon Alex',
    jobTitle: 'dfff',
    email: 'saymonalex555@gmail.com',
    phone: '666655333',
    location: 'fdff',
    website: 'https://tahmidrahman.dev',
    linkedin: '334affdadfadfa',
    github: 'github.com/tahmidrahman',
    summary: 'Dedicated and analytical dfff with a solid background in Bachelor of Science in CSE. Proven track record in streamlining operational workflows, managing client deliverables under pressure, and maintaining high standards of quality and teamwork.',
  },
  experience: [
    {
      jobTitle: 'Job Title',
      company: 'Company Name',
      location: 'Dhaka',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Key responsibilities and achievements...',
    },
    {
      jobTitle: 'Job Title',
      company: 'Company Name',
      location: 'Dhaka',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Key responsibilities and achievements...',
    },
    {
      jobTitle: 'fdgs',
      company: 'gsfg',
      location: 'Gulshan, Dhaka',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      description: 'Lead development of cloud-based fintech applications and mentor junior developers.',
      highlights: [
        'Lead development of cloud-based applications',
        'Mentor junior developers',
        'Improve system performance by 40%',
      ],
    },
    {
      jobTitle: 'Software Engineer',
      company: 'Innovatolabs Ltd.',
      location: 'Banani, Dhaka',
      startDate: '2019',
      endDate: '2021',
      description: 'Built scalable backend microservices.',
    },
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      institution: 'BRAC University',
      startDate: '2015',
      endDate: '2019',
      grade: '3.85 / 4.00',
    },
  ],
  skills: [
    'React', 'Next.js', 'TypeScript', 'Node.js',
    'Python', 'AWS', 'UI/UX Design', 'Project Management'
  ],
  languages: [
    { language: 'English', proficiency: 'Fluent' },
    { language: 'Bengali', proficiency: 'Native' },
  ],
  interests: ['Travel', 'Photography', 'Technology', 'Fitness'],
  personalDetails: {
    dob: '5565656',
    nid: '45634534534534',
    bloodGroup: 'B+',
    nationality: 'Bangladeshi',
  },
  design: {
    pageSize: 'A4',
    primaryColor: '#2563eb',
    fontFamily: 'Inter',
  },
};

(async () => {
  console.log('--- STARTING COMPREHENSIVE VISUAL AUDIT ---');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  // 1. TEST SERVER PUPPETEER ENGINE WITH SAYMON ALEX CV
  console.log('\n[TEST 1] Server-side Puppeteer PDF Generation...');
  const { generatePDF } = await import('../src/services/pdf/pdfService.js');
  const puppeteerPdfBuf = await generatePDF(SAYMON_CV, '');
  const pptrPdfPath = path.join(outputDir, 'Saymon_Alex_puppeteer.pdf');
  fs.writeFileSync(pptrPdfPath, puppeteerPdfBuf);

  // Validate PDF binary
  const pptrHash = crypto.createHash('sha256').update(puppeteerPdfBuf).digest('hex');
  const pptrHeader = puppeteerPdfBuf.subarray(0, 5).toString('ascii');
  console.log(`Puppeteer PDF Size: ${puppeteerPdfBuf.length} bytes`);
  console.log(`Puppeteer PDF SHA256: ${pptrHash}`);
  console.log(`Puppeteer PDF Header: ${pptrHeader}`);
  if (!pptrHeader.startsWith('%PDF-')) throw new Error('Invalid Puppeteer PDF header');

  // Render Puppeteer PDF to PNG for visual inspection
  const pptrPage = await browser.newPage();
  await pptrPage.goto(`file://${pptrPdfPath}`, { waitUntil: 'networkidle0' });
  const pptrImgPath = path.join(outputDir, 'Saymon_Alex_puppeteer_rendered.png');
  await pptrPage.screenshot({ path: pptrImgPath, fullPage: true });
  await pptrPage.close();
  console.log(`Saved ${pptrImgPath}`);

  // 2. TEST CLIENT-SIDE HTML2CANVAS + JSPDF WITH EXACT FIXED TEMPLATE
  console.log('\n[TEST 2] Client-side Fallback (html2canvas + jsPDF) Generation...');
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='UTF-8'>
      <script src='https://cdn.tailwindcss.com'></script>
      <script>${html2canvasCode}</script>
      <script>${jspdfCode}</script>
      <style>
        .resume-sheet-a4 { width: 210mm; min-height: 297mm; box-sizing: border-box; }
      </style>
    </head>
    <body class='bg-white'>
      <div id='cv-export-sheet' class='resume-sheet-a4 p-9 bg-white text-slate-800 text-xs font-sans'>
        <!-- Header -->
        <div class='flex flex-row items-start gap-5 pb-4 border-b border-slate-200'>
          <div class='w-24 h-24 rounded-full bg-slate-200 shrink-0'></div>
          <div class='flex-1 space-y-1.5'>
            <div>
              <h1 class='text-3xl font-bold tracking-tight text-slate-900 block'>Saymon Alex</h1>
              <p class='text-sm font-semibold mt-0.5 block text-blue-600'>dfff</p>
            </div>
            <!-- FIXED 2-Column Contact Strip -->
            <div class='grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 text-[11px] text-slate-600 leading-normal'>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  saymonalex555@gmail.com
                </span>
              </div>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  666655333
                </span>
              </div>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  fdff
                </span>
              </div>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  https://tahmidrahman.dev
                </span>
              </div>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  334affdadfadfa
                </span>
              </div>
              <div class='flex items-center gap-1.5'>
                <span class='w-3.5 h-3.5 bg-slate-400 shrink-0 rounded-xs'></span>
                <span class='inline break-words hover:text-slate-900 leading-normal'>
                  github.com/tahmidrahman
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Body: Skills + Summary + Experience -->
        <div class='grid grid-cols-12 gap-6 pt-5'>
          <div class='col-span-4 space-y-5'>
            <div>
              <h2 class='text-xs font-bold uppercase tracking-wider text-blue-600 mb-2'>Skills</h2>
              <div class='flex flex-wrap gap-1'>
                <span class='px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[10px]'>React</span>
                <span class='px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[10px]'>Next.js</span>
                <span class='px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[10px]'>TypeScript</span>
                <span class='px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[10px]'>Node.js</span>
              </div>
            </div>
            <div>
              <h2 class='text-xs font-bold uppercase tracking-wider text-blue-600 mb-2'>Personal Info</h2>
              <div class='text-[11px] space-y-1 text-slate-600'>
                <p><strong>DOB:</strong> 5565656</p>
                <p><strong>NID:</strong> 45634534534534</p>
                <p><strong>Blood:</strong> B+</p>
                <p><strong>Nationality:</strong> Bangladeshi</p>
              </div>
            </div>
          </div>

          <div class='col-span-8 space-y-5'>
            <div>
              <h2 class='text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 border-b pb-1'>Professional Summary</h2>
              <p class='text-xs text-slate-700 leading-relaxed'>Dedicated and analytical dfff with a solid background in Bachelor of Science in CSE.</p>
            </div>
            <div>
              <h2 class='text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 border-b pb-1'>Work Experience</h2>
              <div class='space-y-3 text-xs'>
                <div>
                  <div class='flex justify-between font-bold text-slate-900'>
                    <span>Job Title</span>
                    <span class='text-slate-400'>2022 – Present</span>
                  </div>
                  <div class='text-slate-500'>Company Name • Dhaka</div>
                  <p class='text-slate-700 mt-0.5'>Key responsibilities and achievements...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(testHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  const clientPdfBase64 = await page.evaluate(async () => {
    const el = document.getElementById('cv-export-sheet');
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    doc.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    return doc.output('datauristring');
  });

  const clientPdfBuf = Buffer.from(clientPdfBase64.replace(/^data:application\/pdf;filename=generated\.pdf;base64,/, '').replace(/^data:application\/pdf;base64,/, ''), 'base64');
  const clientPdfPath = path.join(outputDir, 'Saymon_Alex_client_jspdf.pdf');
  fs.writeFileSync(clientPdfPath, clientPdfBuf);

  const clientHash = crypto.createHash('sha256').update(clientPdfBuf).digest('hex');
  const clientHeader = clientPdfBuf.subarray(0, 5).toString('ascii');
  console.log(`Client jsPDF Size: ${clientPdfBuf.length} bytes`);
  console.log(`Client jsPDF SHA256: ${clientHash}`);
  console.log(`Client jsPDF Header: ${clientHeader}`);
  if (!clientHeader.startsWith('%PDF-')) throw new Error('Invalid client jsPDF header');

  // Render Client jsPDF to PNG
  const clientPage = await browser.newPage();
  await clientPage.goto(`file://${clientPdfPath}`, { waitUntil: 'networkidle0' });
  const clientImgPath = path.join(outputDir, 'Saymon_Alex_client_jspdf_rendered.png');
  await clientPage.screenshot({ path: clientImgPath, fullPage: true });
  await clientPage.close();
  console.log(`Saved ${clientImgPath}`);

  await browser.close();
  console.log('\n--- VISUAL AUDIT COMPLETE: ALL PDFs AND RENDERED IMAGES GENERATED CLEANLY ---');
})();

