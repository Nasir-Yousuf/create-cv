import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { resolveTemplateId, resolveTemplateMeta, TEMPLATE_ALIAS_COLORS } from '../../../../shared/constants/cvDefaults.js';
import { generateOnePageTemplateHtml } from './onePageHtmlRenderers.js';

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
 * Generates faithful server-side HTML for all 9 templates if client didn't supply rendered HTML.
 */
export const generateTemplateHtml = (cvData) => {
  const {
    templateId = 'onepage-fresher-clean',
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

  const canonicalId = resolveTemplateId(templateId);
  const templateMeta = resolveTemplateMeta(canonicalId);
  const aliasColor = TEMPLATE_ALIAS_COLORS[templateId];
  const mergedDesign = aliasColor && !design?.primaryColor ? { ...design, ...aliasColor } : design;

  if (templateMeta?.isOnePage || canonicalId.startsWith('onepage-')) {
    return generateOnePageTemplateHtml(canonicalId, {
      ...cvData,
      templateId: canonicalId,
      design: mergedDesign,
    });
  }

  const effectiveId = canonicalId;
  const isATS = effectiveId === 'ats-classic' || effectiveId.includes('ats') || effectiveId.includes('academic');
  const isApple = effectiveId.includes('apple') || effectiveId === 'zurich-clean' || effectiveId === 'nordic-minimal';
  const isOcean = effectiveId.includes('ocean') || effectiveId.includes('split');
  const isLinear = effectiveId.includes('linear') || effectiveId === 'dark-mode' || effectiveId.includes('tech') || effectiveId.includes('fintech');
  const isCoral = effectiveId.includes('coral') || effectiveId.includes('creative') || effectiveId.includes('sunset') || effectiveId.includes('horizon');
  const isSlate = effectiveId.includes('slate') || effectiveId.includes('executive') || effectiveId.includes('director') || effectiveId.includes('harvard') || effectiveId.includes('corporate-royal');
  const isMinimal = effectiveId.includes('minimal') || effectiveId.includes('breeze') || effectiveId.includes('forest') || effectiveId.includes('sun');
  const isModernBlue = effectiveId === 'modern-blue' || effectiveId.includes('blue') || effectiveId === 'daniel-carter' || effectiveId === 'simple-white' || effectiveId === 'professional' || effectiveId === 'elegant-minimal';

  const primary = design?.primaryColor || (
    isATS ? '#0f172a' :
    isApple ? '#18181b' :
    isLinear ? '#6366f1' :
    isOcean ? '#0d9488' :
    isCoral ? '#f43f5e' :
    isSlate ? '#334155' :
    isMinimal ? '#475569' :
    '#2563eb'
  );

  const fontFamily = design?.fontFamily || (
    isATS ? 'Inter' :
    isApple ? 'Inter' :
    isLinear ? 'JetBrains Mono' :
    isSlate ? 'Merriweather' :
    'Inter'
  );

  const pageSizeClass = design?.pageSize === 'Letter' ? 'resume-sheet-letter' : 'resume-sheet-a4';

  const contactList = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin ? `linkedin.com/in/${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}` : null,
    personalInfo.website ? personalInfo.website.replace(/^https?:\/\//, '') : null,
  ].filter(Boolean);

  const initials = (personalInfo.fullName || 'CV')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  // 1. ATS CLASSIC TEMPLATE RENDERER
  if (isATS) {
    return `
      <div class="${pageSizeClass} p-8 sm:p-10 bg-white text-slate-900 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif;">
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
                    ${edu.grade ? `<span class="text-slate-600"> (${edu.grade})</span>` : ''}
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
        <div class="w-1/3 p-6 text-white shrink-0" style="background-color: ${primary};">
          ${personalInfo.photo && design.showPhoto !== false ? `
            <div class="mb-6 text-center">
              <img src="${personalInfo.photo}" class="w-28 h-28 object-cover rounded-full mx-auto border-2 border-white/60 shadow-lg" />
            </div>
          ` : `
            <div class="mb-6 text-center">
              <div class="w-24 h-24 rounded-full bg-white/20 text-white font-bold text-2xl flex items-center justify-center mx-auto border-2 border-white/40">
                ${initials}
              </div>
            </div>
          `}

          <div class="space-y-5 text-white/90 text-xs">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-white">Contact</h3>
              <div class="space-y-1.5 break-words">
                ${contactList.map((c) => `<div>${c}</div>`).join('')}
              </div>
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

            ${personalDetails && Object.keys(personalDetails).length > 0 ? `
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-white">Personal Details</h3>
                <div class="space-y-1 text-[11px] text-white/80">
                  ${personalDetails.dob ? `<div>DOB: ${personalDetails.dob}</div>` : ''}
                  ${personalDetails.nid ? `<div>NID: ${personalDetails.nid}</div>` : ''}
                  ${personalDetails.bloodGroup ? `<div>Blood: ${personalDetails.bloodGroup}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right Main Body -->
        <div class="w-2/3 p-8 flex-1">
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
                    <div class="text-slate-600 italic text-[11px]">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                    ${exp.description ? `<p class="text-slate-700 text-xs mt-0.5">${exp.description}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `
                      <ul class="list-disc pl-4 text-xs text-slate-700 space-y-0.5 mt-1">
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

          ${projects && projects.length > 0 ? `
            <div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primary}">Key Projects</h2>
              <div class="space-y-2">
                ${projects.map((p) => `
                  <div class="avoid-break text-xs">
                    <div class="font-bold text-slate-900">${p.title || p.name || 'Project'}</div>
                    ${p.description ? `<p class="text-slate-700 mt-0.5">${p.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 3. MODERN BLUE (TWO-COLUMN DESKTOP GRID)
  if (isModernBlue) {
    return `
      <div class="${pageSizeClass} p-8 sm:p-10 bg-white text-slate-800 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif;">
        <!-- Header -->
        <div class="flex items-start gap-6 pb-6 mb-6 border-b border-slate-200">
          ${personalInfo.photo && design.showPhoto !== false ? `
            <img src="${personalInfo.photo}" class="w-24 h-24 rounded-full object-cover shrink-0 border-2" style="border-color: ${primary}" />
          ` : `
            <div class="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl shrink-0" style="background-color: ${primary}15; color: ${primary}">
              ${initials}
            </div>
          `}
          <div class="flex-1 min-w-0 space-y-1">
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">${personalInfo.fullName || 'Your Name'}</h1>
            <p class="text-sm font-semibold mt-0.5" style="color: ${primary}">${personalInfo.jobTitle || ''}</p>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 pt-1.5 text-[11px] text-slate-600 leading-normal">
              ${contactList.map((c) => `<div class="break-words">${c}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- 2-Column Body -->
        <div class="grid grid-cols-12 gap-8">
          <!-- Left Column (4 cols) -->
          <div class="col-span-4 space-y-6">
            ${skills && skills.length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Skills</h2>
                <div class="flex flex-wrap gap-1.5">
                  ${skills.map((s) => `
                    <span class="px-2.5 py-1 rounded text-white text-[10px] font-semibold" style="background-color: ${primary}">
                      ${typeof s === 'string' ? s : s.name}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${languages && languages.length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Languages</h2>
                <div class="space-y-1 text-slate-700 text-xs">
                  ${languages.map((l) => `<div>${typeof l === 'string' ? l : `${l.language || l.name || ''} (${l.proficiency || ''})`}</div>`).join('')}
                </div>
              </div>
            ` : ''}

            ${personalDetails && Object.keys(personalDetails).length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Personal Info</h2>
                <div class="space-y-1 text-slate-600 text-[11px]">
                  ${personalDetails.dob ? `<p><strong>DOB:</strong> ${personalDetails.dob}</p>` : ''}
                  ${personalDetails.nid ? `<p><strong>NID:</strong> ${personalDetails.nid}</p>` : ''}
                  ${personalDetails.bloodGroup ? `<p><strong>Blood:</strong> ${personalDetails.bloodGroup}</p>` : ''}
                  ${personalDetails.nationality ? `<p><strong>Nationality:</strong> ${personalDetails.nationality}</p>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right Column (8 cols) -->
          <div class="col-span-8 space-y-6">
            ${personalInfo.summary ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Professional Summary</h2>
                <p class="text-xs text-slate-700 leading-relaxed">${personalInfo.summary}</p>
              </div>
            ` : ''}

            ${experience && experience.length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Work Experience</h2>
                <div class="space-y-4">
                  ${experience.map((exp) => `
                    <div class="avoid-break space-y-1">
                      <div class="flex justify-between font-bold text-slate-900 text-xs">
                        <span>${exp.jobTitle || 'Role'}</span>
                        <span class="text-slate-500 font-normal">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                      </div>
                      <div class="text-xs font-medium" style="color: ${primary}">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                      ${exp.description ? `<p class="text-xs text-slate-700">${exp.description}</p>` : ''}
                      ${exp.highlights && exp.highlights.length > 0 ? `
                        <ul class="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                          ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${education && education.length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Education</h2>
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

            ${projects && projects.length > 0 ? `
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}; border-color: ${primary}30">Projects</h2>
                <div class="space-y-2">
                  ${projects.map((p) => `
                    <div class="avoid-break text-xs">
                      <div class="font-bold text-slate-900">${p.title || p.name || 'Project'}</div>
                      ${p.description ? `<p class="text-slate-700 text-xs">${p.description}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 4. APPLE CLEAN TEMPLATE
  if (isApple) {
    return `
      <div class="${pageSizeClass} p-10 bg-white text-slate-900 text-xs leading-normal" style="font-family: '${fontFamily}', sans-serif;">
        <!-- Header -->
        <div class="flex justify-between items-start gap-6 pb-6 mb-6 border-b border-slate-200">
          <div class="space-y-1.5 flex-1">
            <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">${personalInfo.fullName || 'Your Name'}</h1>
            <p class="text-base font-normal text-slate-500">${personalInfo.jobTitle || ''}</p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] text-slate-500">
              ${contactList.map((c) => `<span>${c}</span>`).join(' • ')}
            </div>
          </div>
          ${personalInfo.photo && design.showPhoto !== false ? `
            <img src="${personalInfo.photo}" class="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm" />
          ` : ''}
        </div>

        ${personalInfo.summary ? `
          <div class="mb-6">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 mb-2">About</h2>
            <p class="text-slate-700 text-xs leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 mb-3">Experience</h2>
            <div class="space-y-4">
              ${experience.map((exp) => `
                <div class="avoid-break space-y-1">
                  <div class="flex justify-between items-baseline">
                    <span class="text-xs font-bold text-slate-950">${exp.jobTitle || ''}</span>
                    <span class="text-[11px] text-slate-400">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                  ${exp.description ? `<p class="text-xs text-slate-600 mt-1">${exp.description}</p>` : ''}
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc pl-4 text-xs text-slate-600 space-y-0.5 mt-1">
                      ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${education && education.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 mb-3">Education</h2>
            <div class="space-y-3">
              ${education.map((edu) => `
                <div class="avoid-break flex justify-between text-xs">
                  <div>
                    <span class="font-bold text-slate-950">${edu.degree || ''}</span>
                    <span class="text-slate-500"> – ${edu.institution || ''}</span>
                  </div>
                  <span class="text-[11px] text-slate-400">${edu.endDate || edu.startDate || ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 mb-2">Skills</h2>
            <div class="flex flex-wrap gap-1.5">
              ${skills.map((s) => `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                  ${typeof s === 'string' ? s : s.name}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 5. LINEAR DARK TEMPLATE
  if (isLinear) {
    return `
      <div class="${pageSizeClass} p-8 sm:p-10 text-slate-200 text-xs leading-normal" style="font-family: '${fontFamily}', monospace; background-color: #0f172a;">
        <div class="flex justify-between items-start pb-6 mb-6 border-b border-slate-800">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">${personalInfo.fullName || 'Your Name'}</h1>
            <p class="text-sm font-semibold mt-1" style="color: ${primary}">${personalInfo.jobTitle || ''}</p>
            <div class="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-400">
              ${contactList.map((c) => `<span>${c}</span>`).join(' // ')}
            </div>
          </div>
          ${personalInfo.photo && design.showPhoto !== false ? `
            <img src="${personalInfo.photo}" class="w-20 h-20 rounded-xl object-cover border border-slate-700" />
          ` : ''}
        </div>

        ${personalInfo.summary ? `
          <div class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 text-white border-b border-slate-800" style="color: ${primary}">// Summary</h2>
            <p class="text-slate-300 leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-slate-800" style="color: ${primary}">// Work Experience</h2>
            <div class="space-y-3">
              ${experience.map((exp) => `
                <div class="avoid-break space-y-0.5">
                  <div class="flex justify-between text-white font-bold text-xs">
                    <span>${exp.jobTitle || ''} @ ${exp.company || ''}</span>
                    <span class="text-slate-400 font-normal text-[11px]">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                  </div>
                  ${exp.description ? `<p class="text-slate-300 text-xs">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-800" style="color: ${primary}">// Tech Stack</h2>
            <div class="flex flex-wrap gap-1.5">
              ${skills.map((s) => `
                <span class="px-2.5 py-1 rounded bg-slate-800 text-white text-[10px] font-mono border border-slate-700">
                  ${typeof s === 'string' ? s : s.name}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 6. DEFAULT STANDARD & BANGLADESH CORPORATE RENDERER
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
            ? `<img src="${personalInfo.photo}" class="${
                personalInfo.photoStyle === 'circle'
                  ? 'w-24 h-24 aspect-square rounded-full'
                  : personalInfo.photoStyle === 'square'
                  ? 'w-24 h-24 aspect-square rounded-none'
                  : personalInfo.photoStyle === 'rounded'
                  ? 'w-24 h-32 rounded-xl'
                  : 'w-24 h-32 rounded'
              } shrink-0 object-cover object-center border-2 shadow-sm" style="border-color: ${primary}" />`
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
                  <span class="cv-badge px-2.5 py-1 rounded-md text-xs font-medium" style="background-color: ${primary}15; color: ${primary}">
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
 * Main PDF Generation Engine using Puppeteer with strict validation and vector preservation.
 */
export const generatePDF = async (cvData, renderedHtml = '') => {
  const { design = {}, personalInfo = {} } = cvData || {};
  const isLetter = design?.pageSize === 'Letter';
  const pageSize = isLetter ? 'Letter' : 'A4';
  const fontFamily = design?.fontFamily || 'Inter';

  // Determine body content: clean provided HTML or faithful template generator
  const hasRenderedHtml = Boolean(renderedHtml && renderedHtml.trim().length > 30);
  let bodyContent = hasRenderedHtml
    ? renderedHtml
    : generateTemplateHtml(cvData);

  // Strip any lingering editor classes or controls from the HTML string
  bodyContent = bodyContent
    .replace(/<span class="[^"]*cv-editor-pip[^"]*"[^>]*><\/span>/gi, '')
    .replace(/<span class="[^"]*cv-placeholder[^"]*"[^>]*>.*?<\/span>/gi, '')
    .replace(/<div class="[^"]*cv-photo-placeholder[^"]*"[^>]*>.*?<\/div>/gi, '');

  const compiledCss = getCompiledClientStyles();
  const shouldIncludeTailwindCdn = !compiledCss || !hasRenderedHtml;

  // Construct complete HTML document with compiled styles + print CSS (+ CDN fallback if needed)
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName || 'Resume'}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      ${
        shouldIncludeTailwindCdn
          ? `<script src="https://cdn.tailwindcss.com"></script>
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
      </script>`
          : ''
      }

      ${compiledCss ? `<style>${compiledCss}</style>` : ''}

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
          font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .resume-sheet-a4 {
          width: 210mm !important;
          min-height: 295mm !important;
          box-sizing: border-box !important;
          margin: 0 auto !important;
          box-shadow: none !important;
          border: none !important;
          transform: none !important;
          overflow: visible !important;
        }
        .resume-sheet-letter {
          width: 8.5in !important;
          min-height: 10.9in !important;
          box-sizing: border-box !important;
          margin: 0 auto !important;
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
        /* Preserve 2-column and desktop grid in print sheets */
        .resume-sheet-a4 .md\\:grid-cols-12,
        .resume-sheet-letter .md\\:grid-cols-12,
        .grid-cols-12 {
          display: grid !important;
          grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
        }
        .resume-sheet-a4 .md\\:col-span-4,
        .resume-sheet-letter .md\\:col-span-4,
        .col-span-4 {
          grid-column: span 4 / span 4 !important;
        }
        .resume-sheet-a4 .md\\:col-span-8,
        .resume-sheet-letter .md\\:col-span-8,
        .col-span-8 {
          grid-column: span 8 / span 8 !important;
        }
        .resume-sheet-a4 .sm\\:grid-cols-2,
        .resume-sheet-letter .sm\\:grid-cols-2 {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        /* Shared CV icon alignment, badge centering, and photo proportion safeguards */
        .cv-icon-row {
          display: flex !important;
          align-items: center !important;
          min-width: 0;
        }
        .cv-icon-row > svg,
        .cv-icon-svg {
          flex-shrink: 0 !important;
          display: block !important;
          vertical-align: middle !important;
        }
        .cv-badge {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          line-height: 1.25 !important;
          vertical-align: middle !important;
          max-width: 100%;
          box-sizing: border-box;
        }
        .cv-photo-frame {
          overflow: hidden !important;
          flex-shrink: 0 !important;
          position: relative;
        }
        .cv-photo-circle {
          border-radius: 9999px !important;
          aspect-ratio: 1 / 1 !important;
        }
        .cv-photo-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          flex-shrink: 0 !important;
        }
        /* Break management */
        .avoid-break,
        [class*="space-y-"] > div,
        [class*="space-y-"] > section,
        tr,
        li,
        .break-inside-avoid {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
        }
        /* Prevent font descender clipping */
        .truncate, [class*="truncate"] {
          overflow: visible !important;
          text-overflow: clip !important;
          white-space: normal !important;
          word-break: break-word !important;
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
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for fonts and all images to load with individual safety limits
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 2500)),
          ]);
        } catch (e) {}
      }
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 2000); // 2s per-image timeout
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

    // Ensure screen media type so element colors and padding are preserved
    await page.emulateMediaType('screen');

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
