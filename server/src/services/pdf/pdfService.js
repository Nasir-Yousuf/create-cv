import puppeteer from 'puppeteer';
import fs from 'fs';

const getExecutablePath = () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
};

const generateFallbackHtml = (cvData) => {
  const {
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    references = [],
    declaration = {},
    design = {},
  } = cvData;

  const primary = design?.primaryColor || '#059669';

  return `
    <div class="resume-sheet-a4 p-10 bg-white text-slate-800 text-xs">
      <div class="flex justify-between items-start pb-4 mb-4 border-b-2" style="border-color: ${primary}">
        <div>
          <h1 class="text-3xl font-extrabold uppercase tracking-wide" style="color: ${primary}">
            ${personalInfo.fullName || 'Your Name'}
          </h1>
          <p class="text-sm font-bold text-slate-700 mt-1">${personalInfo.jobTitle || ''}</p>
          <p class="text-xs text-slate-600 mt-1">
            ${[personalInfo.location, personalInfo.phone, personalInfo.email].filter(Boolean).join(' • ')}
          </p>
        </div>
        ${
          personalInfo.photo
            ? `<img src="${personalInfo.photo}" class="w-24 h-32 object-cover border-2 border-slate-300 rounded" />`
            : ''
        }
      </div>

      ${
        personalInfo.summary
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b" style="color: ${primary}">Career Objective</h2>
              <p class="text-slate-700 leading-relaxed">${personalInfo.summary}</p>
             </div>`
          : ''
      }

      ${
        experience.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}">Employment History</h2>
              ${experience
                .map(
                  (exp) => `
                <div class="mb-2">
                  <div class="flex justify-between font-bold text-slate-900">
                    <span>${exp.jobTitle || ''}</span>
                    <span class="text-slate-500 font-normal">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
                  </div>
                  <div class="text-slate-600 italic">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                  ${exp.description ? `<p class="text-slate-700 mt-0.5">${exp.description}</p>` : ''}
                </div>`
                )
                .join('')}
             </div>`
          : ''
      }

      ${
        education.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primary}">Academic Qualifications</h2>
              <table class="w-full border-collapse border border-slate-300 text-xs text-slate-800">
                <thead>
                  <tr class="bg-slate-100 font-bold text-left">
                    <th class="border border-slate-300 p-1.5">Exam / Degree</th>
                    <th class="border border-slate-300 p-1.5">Institute / Board</th>
                    <th class="border border-slate-300 p-1.5">Passing Year</th>
                    <th class="border border-slate-300 p-1.5">Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${education
                    .map(
                      (edu) => `
                    <tr>
                      <td class="border border-slate-300 p-1.5 font-semibold">${edu.degree || ''}</td>
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

      ${
        skills.length > 0
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b" style="color: ${primary}">Skills</h2>
              <p class="text-slate-700">${skills.map((s) => s.name).join(' • ')}</p>
             </div>`
          : ''
      }

      ${
        personalDetails.fatherName
          ? `<div class="mb-4">
              <h2 class="text-xs font-bold uppercase tracking-wider pb-1 mb-1 border-b" style="color: ${primary}">Personal Details</h2>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-700">
                <p><strong>Father's Name:</strong> ${personalDetails.fatherName}</p>
                <p><strong>Mother's Name:</strong> ${personalDetails.motherName || ''}</p>
                <p><strong>DOB:</strong> ${personalDetails.dob || ''}</p>
                <p><strong>Nationality:</strong> ${personalDetails.nationality || 'Bangladeshi'}</p>
                ${personalDetails.nid ? `<p><strong>NID:</strong> ${personalDetails.nid}</p>` : ''}
                ${personalDetails.bloodGroup ? `<p><strong>Blood Group:</strong> ${personalDetails.bloodGroup}</p>` : ''}
              </div>
             </div>`
          : ''
      }
    </div>
  `;
};

export const generatePDF = async (cvData, renderedHtml = '') => {
  const { design = {}, personalInfo = {} } = cvData;
  const pageSize = design?.pageSize === 'Letter' ? 'Letter' : 'A4';
  const fontFamily = design?.fontFamily || 'Inter';

  const bodyContent =
    renderedHtml && renderedHtml.trim().length > 20
      ? renderedHtml
      : generateFallbackHtml(cvData);

  // Construct complete single-source HTML document
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName || 'Resume'}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        @page {
          size: ${pageSize};
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
        }
        .resume-sheet-a4 {
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: none !important;
          border: none !important;
          transform: none !important;
        }
        .resume-sheet-letter {
          width: 8.5in;
          min-height: 11in;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: none !important;
          border: none !important;
          transform: none !important;
        }
        #cv-export-sheet, [id^="preview-sheet-"] {
          transform: none !important;
        }
        /* Ensure no editing selection borders or handles show on print */
        .ring-2, [class*="ring-"] {
          box-shadow: none !important;
        }
        span.pointer-events-none, div.pointer-events-none {
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
      '--font-render-hinting=medium',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport matching standard A4 dimensions at 96 DPI (approx 794x1123px)
    await page.setViewport({
      width: pageSize === 'Letter' ? 816 : 794,
      height: pageSize === 'Letter' ? 1056 : 1123,
      deviceScaleFactor: 2, // High resolution retina output
    });

    await page.setContent(fullHtml, { waitUntil: ['load', 'networkidle0'] });

    // Wait for fonts and all images to be 100% loaded
    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

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

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};

export default generatePDF;
