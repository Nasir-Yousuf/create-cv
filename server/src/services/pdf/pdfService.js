import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { resolveTemplateId, resolveTemplateMeta } from '../../../../shared/constants/cvDefaults.js';
import { normalizeCvData } from '../../../../shared/utils/cvNormalize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Match the Sparticuz chromium-min major version installed in server/package.json (v153.0.0)
const SPARTICUZ_PACK_VERSION = 'v153.0.0';
const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

let cachedSSRModule = null;
let cachedCompiledCss = null;
let cachedChromiumPath = null;
let pendingChromiumPathPromise = null;

/**
 * Loads the Vite-compiled React SSR template renderer so Preview and PDF use
 * the exact same React template components with zero server-side template drift.
 */
const loadSSRTemplateModule = () => {
  if (cachedSSRModule) return cachedSSRModule;

  const ssrPath = path.resolve(__dirname, '../../generated/renderTemplateSSR.cjs');
  if (!fs.existsSync(ssrPath)) {
    throw new Error(
      `Compiled SSR template bundle not found at ${ssrPath}. Run "npm --prefix client run build" first.`
    );
  }

  cachedSSRModule = require(ssrPath);
  return cachedSSRModule;
};

/**
 * Loads the compiled client Tailwind stylesheet synchronously from the server bundle
 * (or client/dist fallback) so every utility class renders identically without Tailwind CDN drift.
 */
const getCompiledClientStyles = () => {
  if (cachedCompiledCss !== null && process.env.NODE_ENV === 'production') {
    return cachedCompiledCss;
  }

  try {
    const generatedCssPath = path.resolve(__dirname, '../../generated/styles.css');
    if (fs.existsSync(generatedCssPath)) {
      cachedCompiledCss = fs.readFileSync(generatedCssPath, 'utf8');
      return cachedCompiledCss;
    }

    const clientDistAssets = path.resolve(__dirname, '../../../../client/dist/assets');
    if (fs.existsSync(clientDistAssets)) {
      const cssFiles = fs
        .readdirSync(clientDistAssets)
        .filter((file) => file.endsWith('.css'))
        .sort();
      if (cssFiles.length > 0) {
        cachedCompiledCss = cssFiles
          .map((file) => fs.readFileSync(path.join(clientDistAssets, file), 'utf8'))
          .join('\n');
        return cachedCompiledCss;
      }
    }
  } catch (err) {
    console.warn('Unable to read compiled client styles:', err.message);
  }

  cachedCompiledCss = '';
  return '';
};

/**
 * Finds a locally installed Chromium/Chrome/Edge executable on Windows/macOS/Linux.
 */
const findLocalBrowserExecutable = () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe')
      : null,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ].filter(Boolean);

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }

  // Also scan Puppeteer's user cache (~/.cache/puppeteer) if present
  try {
    const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
    if (fs.existsSync(cacheDir)) {
      const builds = fs.readdirSync(cacheDir);
      for (const buildName of builds) {
        const subPaths = [
          path.join(cacheDir, buildName, 'chrome-win64', 'chrome.exe'),
          path.join(cacheDir, buildName, 'chrome-win32', 'chrome.exe'),
          path.join(cacheDir, buildName, 'chrome-linux64', 'chrome'),
        ];
        for (const subPath of subPaths) {
          if (fs.existsSync(subPath)) return subPath;
        }
      }
    }
  } catch (err) {
    // Ignore cache lookup issues
  }

  return null;
};

/**
 * Singleton resolver for Sparticuz Chromium binary extraction/download so concurrent
 * serverless invocations never race or corrupt the shared `/tmp/chromium` extraction.
 */
export const resolveServerlessChromiumExecutablePath = async () => {
  if (cachedChromiumPath && fs.existsSync(cachedChromiumPath)) {
    return cachedChromiumPath;
  }
  if (!pendingChromiumPathPromise) {
    chromium.setGraphicsMode = false;
    const archTag = process.arch === 'arm64' ? 'arm64' : 'x64';
    const remotePackUrl =
      process.env.CHROMIUM_PACK_URL ||
      `https://github.com/Sparticuz/chromium/releases/download/${SPARTICUZ_PACK_VERSION}/chromium-${SPARTICUZ_PACK_VERSION}-pack.${archTag}.tar`;

    pendingChromiumPathPromise = chromium
      .executablePath(remotePackUrl)
      .then((resolvedPath) => {
        cachedChromiumPath = resolvedPath;
        return resolvedPath;
      })
      .catch((err) => {
        pendingChromiumPathPromise = null;
        throw err;
      });
  }
  return pendingChromiumPathPromise;
};

/**
 * Launches Puppeteer using @sparticuz/chromium-min in serverless runtimes (Vercel/AWS Lambda)
 * or local Chromium/Chrome/Edge on desktop/Docker environments.
 */
const launchPdfBrowser = async (viewport) => {
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const explicitPath =
      (process.env.PUPPETEER_EXECUTABLE_PATH &&
        fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH) &&
        process.env.PUPPETEER_EXECUTABLE_PATH) ||
      (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN) && process.env.CHROME_BIN);

    if (explicitPath) {
      return puppeteer.launch({
        headless: true,
        executablePath: explicitPath,
        defaultViewport: viewport,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }

    const executablePath = await resolveServerlessChromiumExecutablePath();
    const serverlessArgs = await puppeteer.defaultArgs({
      args: chromium.args,
      headless: 'shell',
    });

    return puppeteer.launch({
      args: serverlessArgs,
      defaultViewport: viewport,
      executablePath,
      headless: 'shell',
    });
  }

  const executablePath = findLocalBrowserExecutable();
  if (!executablePath) {
    const err = new Error(
      'Chromium executable is not available in this runtime. Set PUPPETEER_EXECUTABLE_PATH or run with Google Chrome installed.'
    );
    err.statusCode = 503;
    err.code = 'PDF_ENGINE_UNAVAILABLE';
    throw err;
  }

  return puppeteer.launch({
    headless: true,
    executablePath,
    defaultViewport: viewport,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });
};

/**
 * Formats CSS font-family safely without quoting multi-font fallback stacks.
 */
const formatFontStack = (rawFontFamily) => {
  const cleaned = String(rawFontFamily || 'Inter').trim();
  if (!cleaned) {
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  }
  if (cleaned.includes(',')) {
    return cleaned;
  }
  return `'${cleaned}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
};

/**
 * Sanitizes CSS passed into <style> tags so closing style sequences cannot escape.
 */
const sanitizeCssForStyleTag = (css) => {
  if (typeof css !== 'string') return '';
  return css.replace(/<\/style/gi, '<\\/style');
};

/**
 * Single source of truth HTML generator using the compiled React template components.
 */
export const generateTemplateHtml = (rawCvData) => {
  const { renderCVToStaticHtml } = loadSSRTemplateModule();
  const normalizedData = normalizeCvData({
    ...(rawCvData && typeof rawCvData === 'object' ? rawCvData : {}),
    templateId: resolveTemplateId(rawCvData?.templateId || 'onepage-fresher-clean'),
  });
  return renderCVToStaticHtml(normalizedData);
};

/**
 * Builds the complete self-contained HTML document for Chromium PDF rendering.
 */
const buildPrintableDocument = ({ cvData, renderedHtml = '', customCss = '' }) => {
  const { design = {}, personalInfo = {} } = cvData || {};
  const templateMeta = resolveTemplateMeta(cvData?.templateId);
  const isOnePage =
    cvData?.isOnePage !== undefined
      ? Boolean(cvData.isOnePage)
      : Boolean(
          templateMeta?.isOnePage ||
            cvData?.category === 'One-Page CVs' ||
            templateMeta?.categories?.includes('One-Page CVs')
        );
  const isLetter = design?.pageSize === 'Letter';
  const pageSize = isLetter ? 'Letter' : 'A4';
  const fontStack = formatFontStack(design?.fontFamily);
  const safeName = (personalInfo?.fullName || cvData?.title || 'CV').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const bodyContent =
    typeof renderedHtml === 'string' && renderedHtml.trim().length > 50
      ? renderedHtml
      : generateTemplateHtml(cvData);

  const clientProvidedCss =
    typeof customCss === 'string' && customCss.includes('resume-sheet-a4')
      ? sanitizeCssForStyleTag(customCss)
      : '';
  const compiledCss = clientProvidedCss || sanitizeCssForStyleTag(getCompiledClientStyles());
  const shouldIncludeTailwindCdn = !compiledCss;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${safeName} - Resume</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      ${shouldIncludeTailwindCdn ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
      ${compiledCss ? `<style>${compiledCss}</style>` : ''}
      <style>
        @page {
          size: ${pageSize};
          margin: 0;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          font-family: ${fontStack};
          -webkit-font-smoothing: antialiased;
        }
        .resume-preview-wrapper {
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: ${isLetter ? '8.5in' : '210mm'} !important;
        }
        #cv-export-sheet,
        .resume-sheet-a4,
        .resume-sheet-letter {
          width: ${isLetter ? '8.5in' : '210mm'} !important;
          ${
            isOnePage
              ? `height: ${isLetter ? '11in' : '297mm'} !important; max-height: ${isLetter ? '11in' : '297mm'} !important; overflow: hidden !important;`
              : `min-height: ${isLetter ? '10.95in' : '296.5mm'} !important; overflow: visible !important;`
          }
          box-shadow: none !important;
          border-radius: 0 !important;
          border: none !important;
          margin: 0 !important;
          transform: none !important;
        }
        .avoid-break,
        .break-inside-avoid,
        tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .cv-editor-pip,
        .cv-placeholder,
        .cv-photo-placeholder,
        .no-print {
          display: none !important;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
      </style>
    </head>
    <body class="bg-white">
      ${bodyContent}
    </body>
    </html>
  `;
};

/**
 * Main PDF generation engine rendering vector PDFs with Chromium from the exact React templates.
 */
export const generatePDF = async (rawCvData, renderedHtml = '', customCss = '') => {
  const cvData = normalizeCvData(rawCvData);
  const templateMeta = resolveTemplateMeta(cvData?.templateId);
  const isOnePage =
    cvData?.isOnePage !== undefined
      ? Boolean(cvData.isOnePage)
      : Boolean(
          templateMeta?.isOnePage ||
            cvData?.category === 'One-Page CVs' ||
            templateMeta?.categories?.includes('One-Page CVs')
        );
  const { design = {} } = cvData;
  const isLetter = design?.pageSize === 'Letter';
  const pageSize = isLetter ? 'Letter' : 'A4';
  const viewport = {
    width: isLetter ? 816 : 794,
    height: isLetter ? 1056 : 1123,
    deviceScaleFactor: 2,
  };

  const fullHtml = buildPrintableDocument({ cvData, renderedHtml, customCss });

  let browser;
  try {
    browser = await launchPdfBrowser(viewport);
    const page = await browser.newPage();

    // Evaluate CSS and media layout in screen mode (matching 794px desktop preview widths for sm:/md: classes)
    // while Chromium still honors @page size when printing PDF.
    await page.emulateMediaType('screen');

    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Load Google Fonts non-blockingly so slow/offline networks never hang setContent()
    await page.evaluate(
      async ({ fontsUrl, isOnePage, isLetter }) => {
        try {
          await new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontsUrl;
            const timer = setTimeout(resolve, 2500);
            link.addEventListener(
              'load',
              () => {
                clearTimeout(timer);
                resolve();
              },
              { once: true }
            );
            link.addEventListener(
              'error',
              () => {
                clearTimeout(timer);
                resolve();
              },
              { once: true }
            );
            document.head.appendChild(link);
          });
          if (document.fonts && document.fonts.ready) {
            await Promise.race([
              document.fonts.ready,
              new Promise((resolve) => setTimeout(resolve, 2500)),
            ]);
          }
        } catch (e) {}

        const imgs = Array.from(document.querySelectorAll('img'));
        if (imgs.length > 0) {
          await Promise.race([
            Promise.all(
              imgs.map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                  img.addEventListener('load', resolve, { once: true });
                  img.addEventListener('error', resolve, { once: true });
                  img.addEventListener('abort', resolve, { once: true });
                  setTimeout(resolve, 2500);
                });
              })
            ),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]);
        }

        // For One-Page CVs, measure if content overflows single-page boundary and auto-fit zoom
        if (isOnePage) {
          const sheet =
            document.getElementById('cv-export-sheet') ||
            document.querySelector('.resume-sheet-a4, .resume-sheet-letter') ||
            document.body.firstElementChild;
          if (sheet) {
            const targetPx = isLetter ? 1056 : 1122; // A4 297mm at 96 DPI = 1122.5px
            sheet.style.maxHeight = 'none';
            sheet.style.overflow = 'visible';
            const actualHeight = sheet.scrollHeight || sheet.offsetHeight;
            if (actualHeight > targetPx + 4) {
              const fitScale = Math.max(0.70, (targetPx - 2) / actualHeight);
              sheet.style.zoom = String(fitScale);
            }
            sheet.style.maxHeight = targetPx + 'px';
            sheet.style.overflow = 'hidden';
          }
        }
      },
      { fontsUrl: GOOGLE_FONTS_CSS_URL, isOnePage, isLetter }
    );

    const pdfOptions = {
      format: pageSize,
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    };
    if (isOnePage) {
      pdfOptions.pageRanges = '1';
    }

    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error('Puppeteer PDF Rendering Error:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

export default generatePDF;
