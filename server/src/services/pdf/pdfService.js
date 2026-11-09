import puppeteer from 'puppeteer';
import fs from 'fs';

const getExecutablePath = () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
};

export const generatePDF = async (cvData, renderedHtml = '') => {
  const { design = {}, personalInfo = {} } = cvData;
  const pageSize = design?.pageSize === 'Letter' ? 'Letter' : 'A4';
  const fontFamily = design?.fontFamily || 'Inter';

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
        }
        .resume-sheet-letter {
          width: 8.5in;
          min-height: 11in;
          box-sizing: border-box;
          margin: 0 auto;
          box-shadow: none !important;
          border: none !important;
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
      ${renderedHtml}
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
      const images = Array.from(document.images);
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
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

export default generatePDF;
