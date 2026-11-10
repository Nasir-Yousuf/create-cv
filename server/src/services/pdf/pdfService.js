import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Resolves the Chromium/Chrome executable path across Windows, Linux, and Cloud environments.
 */
const getExecutablePath = () => {
  // 1. Explicit environment variable
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  // 2. Puppeteer's own downloaded browser (if available)
  try {
    const defaultPath = puppeteer.executablePath();
    if (defaultPath && fs.existsSync(defaultPath)) {
      return defaultPath;
    }
  } catch (err) {
    // Puppeteer default path not resolved, try common system paths
  }

  // 3. Common system installations
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe') : null,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }

  return undefined;
};

/**
 * Retrieves the compiled client stylesheet if available on disk.
 */
const getCompiledClientStyles = () => {
  try {
    const searchDirs = [
      path.resolve(process.cwd(), 'client/dist/assets'),
      path.resolve(process.cwd(), 'dist/assets'),
      path.resolve(process.cwd(), '../client/dist/assets'),
      path.resolve(process.cwd(), '../dist/assets'),
    ];

    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const cssFile = files.find((f) => f.endsWith('.css') && f.startsWith('index'));
        if (cssFile) {
          const content = fs.readFileSync(path.join(dir, cssFile), 'utf8');
          if (content && content.length > 500) {
            return content;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not read compiled client CSS:', err.message);
  }
  return '';
};

/**
 * Generates faithful server-side HTML for any requested template if client didn't supply rendered HTML.
 */
const generateTemplateHtml = (cvData) => {
  const {
    templateId = 'bd-corporate-standard',
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    declaration = {},
    design = {},
  } = cvData || {};

  const isATS = templateId === 'ats-classic';
  const isApple = templateId.includes('apple');
  const isOcean = templateId.includes('ocean');
  const isLinear = templateId.includes('linear');
  const isBD = templateId.includes('bd') || templateId.includes('bangladesh');

  const primary = design?.primaryColor || (
    isATS ? '#0f172a' :
    isApple ? '#18181b' :
    isLinear ? '#6366f1' :
    isOcean ? '#0d9488' :
    templateId.includes('coral') ? '#f43f5e' :
    templateId.includes('blue') ? '#2563eb' :
    '#0f172a'
  );

  const fontFamily = design?.fontFamily || (isATS ? 'Inter' : isApple ? 'Inter' : isLinear ? 'JetBrains Mono' : 'Inter');
  const pageSizeClass = design?.pageSize === 'Letter' ? 'resume-sheet-letter' : 'resume-sheet-a4';

  const contactList = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin ? `linkedin.com/in/${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}` : null,
    personalInfo.website ? personalInfo.website.replace(/^https?:\/\//, '') : null,
  ].filter(Boolean);

  // 1. ATS CLASSIC TEMPLATE RENDERER
  if (isATS) {
    return `
      <div class="${pageSizeClass} p-8 sm:p-10 bg-white text-slate-900 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif;">
        <!-- ATS Center Header (No Photo) -->
        <div class="text-center pb-4 mb-4 border-b border-slate-900">
          <h1 class="text-2xl font-bold uppercase tracking-wider text-slate-900">${personalInfo.fullName || 'Your Name'}</h1>
          ${personalInfo.jobTitle ? `<p class="text-sm font-semibold uppercase tracking-wide text-slate-700 mt-1">${personalInfo.jobTitle}</p>` : ''}
          <p class="text-xs text-slate-600 mt-1">${contactList.join('   |   ')}</p>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b border-slate-900">Professional Summary</h2>
            <p class="text-slate-800 leading-relaxed text-xs">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-0.5 mb-2 border-b border-slate-900">Work Experience</h2>
            <div class="space-y-3">
              ${experience.map((exp) => `
                <div class="avoid-break space-y-0.5">
                  <div class="flex justify-between font-bold text-slate-900 text-xs">
                    <span>${exp.jobTitle || 'Role'} – ${exp.company || ''}</span>
                    <span class="font-normal text-[11px] text-slate-600">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                  </div>
                  ${exp.location ? `<div class="text-slate-600 text-[11px]">${exp.location}</div>` : ''}
                  ${exp.description ? `<p class="text-slate-800 text-xs mt-0.5">${exp.description}</p>` : ''}
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc pl-4 text-xs text-slate-800 space-y-0.5 mt-1">
                      ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${education && education.length > 0 ? `
          <div class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-0.5 mb-2 border-b border-slate-900">Education</h2>
            <div class="space-y-2">
              ${education.map((edu) => `
                <div class="avoid-break flex justify-between text-xs">
                  <div>
                    <span class="font-bold text-slate-900">${edu.degree || 'Degree'}</span>
                    <span class="text-slate-700"> – ${edu.institution || ''}</span>
                    ${edu.grade ? `<span class="text-slate-600"> (GPA: ${edu.grade})</span>` : ''}
                  </div>
                  <span class="text-[11px] text-slate-600 font-normal">${edu.endDate || edu.startDate || ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5 border-b border-slate-900">Skills & Competencies</h2>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">
              ${skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean).join('   •   ')}
            </p>
          </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
          <div class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-0.5 mb-2 border-b border-slate-900">Key Projects</h2>
            <div class="space-y-2">
              ${projects.map((p) => `
                <div class="avoid-break text-xs">
                  <div class="font-bold text-slate-900">${p.title || p.name || 'Project'}</div>
                  ${p.description ? `<p class="text-slate-800 mt-0.5">${p.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 2. OCEAN SPLIT (TWO-COLUMN SIDEBAR)
  if (isOcean) {
    return `
      <div class="${pageSizeClass} flex bg-white text-slate-800 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif; min-height: 297mm;">
        <!-- Left Sidebar -->
        <div class="w-1/3 p-6 text-white" style="background-color: ${primary};">
          ${personalInfo.photo && design.showPhoto !== false ? `
            <div class="mb-6 text-center">
              <img src="${personalInfo.photo}" class="w-28 h-28 object-cover rounded-full mx-auto border-2 border-white/60 shadow-lg" />
            </div>
          ` : ''}

          <div class="space-y-5 text-white/90 text-xs">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-white">Contact</h3>
              <p class="space-y-1">
                ${contactList.map((c) => `<div class="truncate">${c}</div>`).join('')}
              </p>
            </div>

            ${skills && skills.length > 0 ? `
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-white">Skills</h3>
                <div class="flex flex-wrap gap-1">
                  ${skills.map((s) => `<span class="px-2 py-0.5 rounded bg-white/20 text-[10px] font-medium">${typeof s === 'string' ? s : s.name}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${languages && languages.length > 0 ? `
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-white">Languages</h3>
                <div class="space-y-1 text-[11px]">
                  ${languages.map((l) => `<div>${typeof l === 'string' ? l : `${l.language || l.name || ''} (${l.proficiency || ''})`}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right Main Body -->
        <div class="w-2/3 p-8">
          <div class="pb-4 mb-4 border-b border-slate-200">
            <h1 class="text-3xl font-extrabold text-slate-900">${personalInfo.fullName || 'Your Name'}</h1>
            <p class="text-sm font-semibold mt-1" style="color: ${primary}">${personalInfo.jobTitle || ''}</p>
          </div>

          ${personalInfo.summary ? `
            <div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b border-slate-200" style="color: ${primary}">Summary</h2>
              <p class="text-slate-700 leading-relaxed">${personalInfo.summary}</p>
            </div>
          ` : ''}

          ${experience && experience.length > 0 ? `
            <div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primary}">Experience</h2>
              <div class="space-y-3">
                ${experience.map((exp) => `
                  <div class="avoid-break space-y-0.5">
                    <div class="flex justify-between font-bold text-slate-900">
                      <span>${exp.jobTitle || 'Role'}</span>
                      <span class="text-slate-500 font-normal text-[11px]">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                    </div>
                    <div class="text-slate-600 italic text-[11px]">${exp.company || ''}</div>
                    ${exp.description ? `<p class="text-slate-700 text-xs mt-0.5">${exp.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${education && education.length > 0 ? `
            <div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primary}">Education</h2>
              <div class="space-y-2">
                ${education.map((edu) => `
                  <div class="avoid-break text-xs">
                    <div class="font-bold text-slate-900">${edu.degree || ''}</div>
                    <div class="text-slate-600 text-[11px]">${edu.institution || ''} (${edu.endDate || edu.startDate || ''})</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 3. DEFAULT STANDARD & BANGLADESH CORPORATE RENDERER
  return `
    <div class="${pageSizeClass} p-8 sm:p-10 bg-white text-slate-800 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif;">
      <!-- Header -->
      <div class="flex justify-between items-start pb-4 mb-4 border-b-2" style="border-color: ${primary}">
        <div class="flex-1 pr-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide" style="color: ${primary}">
            ${personalInfo.fullName || 'Your Name'}
          </h1>
          <p class="text-sm font-bold text-slate-700 mt-1">${personalInfo.jobTitle || ''}</p>
          <p class="text-xs text-slate-600 mt-1">
            ${contactList.join(' • ')}
          </p>
        </div>
        ${
          personalInfo.photo && design.showPhoto !== false
            ? `<img src="${personalInfo.photo}" class="w-24 h-32 object-cover border-2 rounded shadow-sm" style="border-color: ${primary}" />`
            : ''
        }
      </div>

      <!-- Summary -->
      ${
        personalInfo.summary
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b" style="color: ${primary}; border-color: ${primary}40">Professional Summary</h2>
              <p class="text-slate-700 leading-relaxed">${personalInfo.summary}</p>
             </div>`
          : ''
      }

      <!-- Experience -->
      ${
        experience && experience.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}40">Work Experience</h2>
              <div class="space-y-3">
                ${experience
                  .map(
                    (exp) => `
                  <div class="avoid-break space-y-0.5">
                    <div class="flex justify-between font-bold text-slate-900">
                      <span>${exp.jobTitle || 'Role'}</span>
                      <span class="text-slate-500 font-normal text-[11px]">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                    </div>
                    <div class="text-slate-600 italic text-[11px]">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                    ${exp.description ? `<p class="text-slate-700 mt-0.5 text-xs">${exp.description}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul class="list-disc pl-4 text-xs text-slate-700 space-y-0.5 mt-1">${exp.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}
                  </div>`
                  )
                  .join('')}
              </div>
             </div>`
          : ''
      }

      <!-- Education -->
      ${
        education && education.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}40">Academic Qualifications</h2>
              <table class="w-full border-collapse border border-slate-300 text-xs text-slate-800">
                <thead>
                  <tr class="bg-slate-100 font-bold text-left">
                    <th class="border border-slate-300 p-1.5">Exam / Degree</th>
                    <th class="border border-slate-300 p-1.5">Institute / Board</th>
                    <th class="border border-slate-300 p-1.5 text-center">Passing Year</th>
                    <th class="border border-slate-300 p-1.5 text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${education
                    .map(
                      (edu) => `
                    <tr>
                      <td class="border border-slate-300 p-1.5 font-semibold">${edu.degree || ''} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</td>
                      <td class="border border-slate-300 p-1.5">${edu.institution || ''}</td>
                      <td class="border border-slate-300 p-1.5 text-center">${edu.endDate || edu.startDate || ''}</td>
                      <td class="border border-slate-300 p-1.5 text-center font-bold">${edu.grade || ''}</td>
                    </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
             </div>`
          : ''
      }

      <!-- Skills -->
      ${
        skills && skills.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1.5 border-b" style="color: ${primary}; border-color: ${primary}40">Skills & Competencies</h2>
              <div class="flex flex-wrap gap-1.5">
                ${skills
                  .map(
                    (s) => `
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium" style="background-color: ${primary}15; color: ${primary}">
                    ${typeof s === 'string' ? s : s.name}
                  </span>`
                  )
                  .join('')}
              </div>
             </div>`
          : ''
      }

      <!-- Projects -->
      ${
        projects && projects.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}40">Key Projects</h2>
              <div class="space-y-2">
                ${projects
                  .map(
                    (p) => `
                  <div class="avoid-break space-y-0.5">
                    <div class="flex justify-between font-bold text-slate-900 text-xs">
                      <span>${p.title || p.name || 'Project'}</span>
                      ${p.startDate ? `<span class="text-[11px] text-slate-500 font-normal">${p.startDate} - ${p.endDate || 'Present'}</span>` : ''}
                    </div>
                    ${p.description ? `<p class="text-slate-700 text-xs">${p.description}</p>` : ''}
                    ${p.technologies && p.technologies.length > 0 ? `<p class="text-slate-500 text-[10px] font-mono">Stack: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}</p>` : ''}
                  </div>`
                  )
                  .join('')}
              </div>
             </div>`
          : ''
      }

      <!-- Personal Details (BD Standard) -->
      ${
        personalDetails?.fatherName
          ? `<div class="mb-4 avoid-break">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b" style="color: ${primary}; border-color: ${primary}40">Personal Information</h2>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-700 text-xs">
                <p><strong>Father's Name:</strong> ${personalDetails.fatherName}</p>
                <p><strong>Mother's Name:</strong> ${personalDetails.motherName || ''}</p>
                <p><strong>DOB:</strong> ${personalDetails.dob || personalDetails.dateOfBirth || ''}</p>
                <p><strong>Nationality:</strong> ${personalDetails.nationality || 'Bangladeshi'}</p>
                ${personalDetails.nid ? `<p><strong>NID:</strong> ${personalDetails.nid}</p>` : ''}
                ${personalDetails.bloodGroup ? `<p><strong>Blood Group:</strong> ${personalDetails.bloodGroup}</p>` : ''}
              </div>
             </div>`
          : ''
      }

      <!-- References -->
      ${
        references && references.length > 0
          ? `<div class="mb-4 avoid-break">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1.5 border-b" style="color: ${primary}; border-color: ${primary}40">References</h2>
              <div class="grid grid-cols-2 gap-3 text-xs text-slate-700">
                ${references
                  .map(
                    (r) => `
                  <div class="p-2 bg-slate-50 border border-slate-200 rounded">
                    <p class="font-bold text-slate-900">${r.name}</p>
                    <p class="text-slate-600 text-[11px]">${r.designation || r.title || ''}, ${r.company || r.organization || ''}</p>
                    ${r.phone ? `<p class="text-slate-500 text-[11px]">Phone: ${r.phone}</p>` : ''}
                    ${r.email ? `<p class="text-slate-500 text-[11px]">Email: ${r.email}</p>` : ''}
                  </div>`
                  )
                  .join('')}
              </div>
             </div>`
          : ''
      }

      <!-- Declaration -->
      ${
        declaration?.signedBy || declaration?.text
          ? `<div class="pt-4 border-t border-slate-200 avoid-break">
              <p class="text-[10px] text-slate-600 italic">${declaration.text || 'I hereby declare that all information provided above is true and correct.'}</p>
              <div class="flex justify-between items-end pt-4 text-xs">
                <p class="text-slate-500 text-[11px]">Date: ${declaration.date || new Date().toLocaleDateString('en-GB')}</p>
                <div class="text-right">
                  <div class="w-32 border-b border-slate-400 mb-1"></div>
                  <p class="font-bold text-slate-900">${declaration.signedBy || personalInfo.fullName || 'Authorized Signature'}</p>
                </div>
              </div>
             </div>`
          : ''
      }
    </div>
  `;
};

/**
 * Main PDF Generation Engine using Puppeteer with strict validation.
 */
export const generatePDF = async (cvData, renderedHtml = '') => {
  const { design = {}, personalInfo = {} } = cvData || {};
  const isLetter = design?.pageSize === 'Letter';
  const pageSize = isLetter ? 'Letter' : 'A4';
  const fontFamily = design?.fontFamily || 'Inter';

  // Determine body content: clean provided HTML or faithful template generator
  let bodyContent = renderedHtml && renderedHtml.trim().length > 30
    ? renderedHtml
    : generateTemplateHtml(cvData);

  // Strip any lingering editor classes or controls from the HTML string
  bodyContent = bodyContent
    .replace(/<span class="[^"]*cv-editor-pip[^"]*"[^>]*><\/span>/gi, '')
    .replace(/<span class="[^"]*cv-placeholder[^"]*"[^>]*>.*?<\/span>/gi, '')
    .replace(/<div class="[^"]*cv-photo-placeholder[^"]*"[^>]*>.*?<\/div>/gi, '');

  const compiledCss = getCompiledClientStyles();

  // Construct complete HTML document with local/inlined styles + Tailwind fallback
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName || 'Resume'}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      
      ${compiledCss ? `<style>${compiledCss}</style>` : `
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  brand: {
                    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
                    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
                    800: '#3730a3', 900: '#312e81', 950: '#1e1b4b'
                  }
                },
                fontFamily: {
                  sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                  serif: ['Merriweather', 'Georgia', 'serif'],
                  mono: ['JetBrains Mono', 'monospace']
                }
              }
            }
          }
        </script>
      `}

      <style>
        @page {
          size: ${pageSize === 'Letter' ? 'letter' : 'A4'};
          margin: 0;
        }
        *, *::before, *::after {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: '${fontFamily}', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .resume-sheet-a4 {
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: none !important;
          border: none !important;
          transform: none !important;
          overflow: visible !important;
        }
        .resume-sheet-letter {
          width: 8.5in;
          min-height: 11in;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: none !important;
          border: none !important;
          transform: none !important;
          overflow: visible !important;
        }
        #cv-export-sheet, [id^="preview-sheet-"], [id^="gallery-preview-sheet-"] {
          transform: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          overflow: visible !important;
        }
        /* Break management */
        .avoid-break, [class*="space-y-"] > div, tr, .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid;
          page-break-after: avoid;
        }
        .ring-2, [class*="ring-"], .cv-editor-pip, .cv-placeholder, .cv-photo-placeholder, .no-print {
          display: none !important;
        }
      </style>
    </head>
    <body class="bg-white">
      ${bodyContent}
    </body>
    </html>
  `;

  const executablePath = getExecutablePath();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=medium',
      '--disable-web-security',
      '--allow-running-insecure-content',
    ],
  });

  try {
    const page = await browser.newPage();

    // Standard viewport (A4: 794x1123, Letter: 816x1056) at 2x retina device scale factor
    await page.setViewport({
      width: isLetter ? 816 : 794,
      height: isLetter ? 1056 : 1123,
      deviceScaleFactor: 2,
    });

    await page.setContent(fullHtml, {
      waitUntil: ['domcontentloaded', 'networkidle2'],
      timeout: 25000,
    });

    // Wait for fonts and all images to load with individual safety limits
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000); // 3s per-image timeout
          });
        })
      );
    });

    // VALIDATION STEP: Verify target element contains non-empty content
    const metrics = await page.evaluate(() => {
      const el =
        document.querySelector('.resume-sheet-a4, .resume-sheet-letter, #cv-export-sheet') ||
        document.body;
      const text = (el.innerText || '').trim();
      const rect = el.getBoundingClientRect();
      return {
        textLength: text.length,
        width: rect.width,
        height: rect.height,
      };
    });

    if (metrics.textLength < 10 || metrics.height < 50) {
      throw new Error(
        `PDF Generation failed validation: Document has insufficient content (text length: ${metrics.textLength}, height: ${metrics.height}px)`
      );
    }

    const pdfBuffer = await page.pdf({
      format: pageSize,
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    });

    const buffer = Buffer.from(pdfBuffer);

    // Validate generated binary buffer
    if (!buffer || buffer.length < 5000) {
      throw new Error(`Generated PDF buffer is suspiciously small (${buffer ? buffer.length : 0} bytes).`);
    }

    // Verify PDF header magic bytes "%PDF-"
    const header = buffer.subarray(0, 5).toString('ascii');
    if (!header.startsWith('%PDF-')) {
      throw new Error('Generated file does not have valid PDF magic header.');
    }

    return buffer;
  } finally {
    try {
      await browser.close();
    } catch (e) {
      console.warn('Error closing Puppeteer browser instance:', e.message);
    }
  }
};

export default generatePDF;
