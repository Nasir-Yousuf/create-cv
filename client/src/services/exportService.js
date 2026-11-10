import api from './api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RenderCVTemplate } from '../templates';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} from 'docx';

/**
 * Safely triggers file download with mobile and desktop support.
 */
export const triggerDownload = (blob, filename) => {
  try {
    saveAs(blob, filename);
  } catch (err) {
    console.warn('saveAs failed, falling back to anchor trigger:', err);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      window.URL.revokeObjectURL(url);
    }, 15000);
  }
};

/**
 * Notifies progress callback with structured stage and percentage info.
 */
const notifyProgress = (onProgress, stage, progress, message) => {
  if (typeof onProgress === 'function') {
    try {
      onProgress({
        stage,
        progress,
        message,
        toString: () => message,
      });
    } catch (e) {
      // Ignore callback errors
    }
  }
};

/**
 * Resolves an image ArrayBuffer in the browser for DOCX embedding.
 */
const resolveClientImageBuffer = async (photoUri) => {
  if (!photoUri || typeof photoUri !== 'string') return null;

  try {
    let bytes = null;
    if (photoUri.startsWith('data:image')) {
      const commaIndex = photoUri.indexOf(',');
      if (commaIndex !== -1) {
        const base64Data = photoUri.slice(commaIndex + 1);
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      }
    } else if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
      const res = await fetch(photoUri, { mode: 'cors' });
      if (res.ok) {
        const ab = await res.arrayBuffer();
        bytes = new Uint8Array(ab);
      }
    }

    if (bytes && bytes.length >= 8) {
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
      if (isPng || isJpeg || isGif) {
        return bytes.buffer;
      }
    }
  } catch (err) {
    console.warn('Could not resolve photo for client DOCX embed:', err.message);
  }
  return null;
};

/**
 * Checks if a canvas contains non-white pixels (verifies it is not blank).
 */
const isCanvasNotBlank = (canvas) => {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return false;

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Sample 50 points across the canvas
    const sampleWidth = canvas.width;
    const sampleHeight = canvas.height;
    const stepX = Math.floor(sampleWidth / 10);
    const stepY = Math.floor(sampleHeight / 10);

    let nonWhiteCount = 0;

    for (let x = stepX; x < sampleWidth; x += stepX) {
      for (let y = stepY; y < sampleHeight; y += stepY) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        // Check if not pure white (255, 255, 255) and not fully transparent (alpha 0)
        const isNotWhite = pixel[0] < 245 || pixel[1] < 245 || pixel[2] < 245;
        const isNotTransparent = pixel[3] > 10;
        if (isNotWhite && isNotTransparent) {
          nonWhiteCount++;
          if (nonWhiteCount > 3) return true;
        }
      }
    }
    return nonWhiteCount > 0;
  } catch (e) {
    // Canvas tainted or SecurityError, assume not blank
    return true;
  }
};

/**
 * Global Cache for Single-Source PDF Generation & Instant Reusable Downloads
 */
let cachedPdf = {
  blob: null,
  hash: null,
  url: null,
};

/**
 * Computes deterministic fingerprint of CV content and layout settings.
 */
export const computeCvHash = (cvData) => {
  try {
    const raw = JSON.stringify({
      templateId: cvData?.templateId,
      design: cvData?.design,
      personalInfo: cvData?.personalInfo,
      personalDetails: cvData?.personalDetails,
      experience: cvData?.experience,
      education: cvData?.education,
      skills: cvData?.skills,
      projects: cvData?.projects,
      certifications: cvData?.certifications,
      languages: cvData?.languages,
      references: cvData?.references,
      interests: cvData?.interests,
      declaration: cvData?.declaration,
      customSections: cvData?.customSections,
    });
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
    }
    return `${hash}_${raw.length}`;
  } catch (e) {
    return String(Date.now());
  }
};

/**
 * Invalidates the cached PDF binary when CV content changes.
 */
export const invalidatePdfCache = () => {
  if (cachedPdf.url) {
    try {
      window.URL.revokeObjectURL(cachedPdf.url);
    } catch (e) {}
  }
  cachedPdf = {
    blob: null,
    hash: null,
    url: null,
  };
};

/**
 * Returns current cached PDF state.
 */
export const getCachedPdf = () => cachedPdf;

/**
 * Extracts and prepares clean HTML for the target CV template.
 */
const extractCleanTemplateHtml = (cvData, elementId) => {
  let sheetEl = null;

  // 1. If explicit non-generic container ID is provided
  if (elementId && elementId !== 'cv-export-sheet') {
    const el = document.getElementById(elementId);
    if (el) {
      sheetEl = el.querySelector('#cv-export-sheet') || el;
    }
  }

  // 2. Look for specific gallery or wizard preview card for this template
  if (!sheetEl && cvData?.templateId) {
    const cardEl =
      document.getElementById(`gallery-preview-sheet-${cvData.templateId}`) ||
      document.getElementById(`preview-sheet-${cvData.templateId}`);
    if (cardEl) {
      sheetEl = cardEl.querySelector('#cv-export-sheet') || cardEl;
    }
  }

  // 3. Fallback to active editor sheet
  if (!sheetEl) {
    sheetEl = document.getElementById('cv-export-sheet');
  }

  let rawHtml = '';

  if (sheetEl) {
    const clone = sheetEl.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.webkitTransform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    clone.style.overflow = 'visible';
    clone.style.width = cvData?.design?.pageSize === 'Letter' ? '8.5in' : '210mm';
    clone.style.minHeight = cvData?.design?.pageSize === 'Letter' ? '11in' : '297mm';

    // Remove editor UI artifacts
    const pips = clone.querySelectorAll('.cv-editor-pip, .cv-placeholder, [class*="ring-"], .no-print');
    pips.forEach((p) => p.remove());

    // Remove photo placeholder dashed box if no photo
    if (!cvData?.personalInfo?.photo) {
      const cameraBoxes = clone.querySelectorAll('.cv-photo-placeholder');
      cameraBoxes.forEach((b) => b.remove());
    }

    // SANITIZER: Eliminate any truncate or clipping overflow that could squish or cut text
    const truncateEls = clone.querySelectorAll('.truncate, [class*="truncate"]');
    truncateEls.forEach((el) => {
      el.classList.remove('truncate');
      el.style.overflow = 'visible';
      el.style.textOverflow = 'clip';
      el.style.whiteSpace = 'normal';
      el.style.wordBreak = 'break-word';
    });

    const allNodes = clone.querySelectorAll('*');
    allNodes.forEach((node) => {
      if (node.style && node.style.overflow === 'hidden' && !node.classList.contains('rounded-full')) {
        node.style.overflow = 'visible';
      }
    });

    rawHtml = clone.outerHTML;
  }

  return rawHtml;
};

export const exportService = {
  invalidatePdfCache,
  getCachedPdf,

  /**
   * Generates a validated PDF binary Blob, caching it for identical preview and download.
   */
  async generatePDFBlob(cvData, customHtml = '', elementId = 'cv-export-sheet', onProgress = null) {
    const currentHash = computeCvHash(cvData);
    if (cachedPdf.blob && cachedPdf.hash === currentHash && cachedPdf.url) {
      notifyProgress(onProgress, 'ready', 100, 'Reusing verified PDF binary...');
      return { blob: cachedPdf.blob, url: cachedPdf.url, fromCache: true };
    }

    notifyProgress(onProgress, 'preparing', 20, 'Preparing document & layout data...');
    const cleanHtml = customHtml || extractCleanTemplateHtml(cvData, elementId);

    let generatedBlob = null;

    // 1. PRIMARY STRATEGY: High-Fidelity Server-Side Puppeteer Engine
    try {
      notifyProgress(onProgress, 'rendering', 45, 'Rendering vector typography & layout...');
      notifyProgress(onProgress, 'generating', 75, 'Generating vector PDF document...');

      const response = await api.post(
        '/export/pdf',
        { cvData, html: cleanHtml },
        {
          responseType: 'blob',
          timeout: 45000,
        }
      );

      // Verify response is true binary PDF and not a JSON error
      if (response.data) {
        if (response.data.type === 'application/json' || response.data.type === 'text/html') {
          const text = await response.data.text();
          let msg = 'Server returned invalid PDF response';
          try {
            const parsed = JSON.parse(text);
            msg = parsed.message || msg;
          } catch (e) {}
          throw new Error(msg);
        }

        if (response.data.size > 5000) {
          const head = await response.data.slice(0, 5).text();
          if (head.startsWith('%PDF-')) {
            generatedBlob = response.data;
          }
        }
      }
    } catch (serverErr) {
      console.warn('Backend PDF export error, attempting client-side fallback:', serverErr.message);
    }

    // 2. SECONDARY RESILIENT FALLBACK: Client-Side Crisp jsPDF Engine
    if (!generatedBlob) {
      let stageContainer = null;
      let tempRoot = null;

      try {
        notifyProgress(onProgress, 'rendering', 55, 'Rendering high-resolution document...');

        // Wait for fonts to be ready
        if (document.fonts && document.fonts.ready) {
          try {
            await document.fonts.ready;
          } catch (e) {}
        }

        // Create an off-screen staging container at (0,0) with high z-index
        stageContainer = document.createElement('div');
        stageContainer.id = 'client-pdf-active-stage';
        stageContainer.style.cssText = `
          position: fixed;
          left: 0;
          top: 0;
          width: 794px;
          min-height: 1123px;
          z-index: 99999;
          background: #ffffff;
          opacity: 0.99;
          pointer-events: none;
          overflow: visible;
          margin: 0;
          padding: 0;
          font-family: ${cvData?.design?.fontFamily || 'Inter, -apple-system, sans-serif'};
        `;
        document.body.appendChild(stageContainer);

        let captureEl = null;

        if (cleanHtml) {
          stageContainer.innerHTML = cleanHtml;
          captureEl = stageContainer.firstElementChild || stageContainer;
        } else {
          // Mount React Template directly
          await new Promise((resolve) => {
            tempRoot = ReactDOM.createRoot(stageContainer);
            tempRoot.render(
              React.createElement(RenderCVTemplate, {
                cvData,
                scale: 1,
              })
            );
            setTimeout(resolve, 350);
          });
          captureEl = stageContainer.querySelector('#cv-export-sheet') || stageContainer;
        }

        // Ensure images decode
        const images = stageContainer.querySelectorAll('img');
        if (images.length > 0) {
          await Promise.all(
            Array.from(images).map((img) => {
              img.crossOrigin = 'anonymous';
              if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 1500);
              });
            })
          );
        }

        await new Promise((r) => setTimeout(r, 100));

        const canvas = await html2canvas(captureEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0,
        });

        // VALIDATE CANVAS IS NOT BLANK
        if (!isCanvasNotBlank(canvas)) {
          throw new Error('Client PDF rendering resulted in blank canvas.');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const isLetter = cvData?.design?.pageSize === 'Letter';
        const pageWidth = isLetter ? 215.9 : 210;
        const pageHeight = isLetter ? 279.4 : 297;
        const format = isLetter ? 'letter' : 'a4';

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format,
          compress: true,
        });

        const pdfHeight = (canvas.height * pageWidth) / canvas.width;
        const singlePageThreshold = pageHeight * 1.15;

        if (pdfHeight <= singlePageThreshold) {
          pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, Math.min(pageHeight, pdfHeight), undefined, 'FAST');
        } else {
          let heightLeft = pdfHeight;
          let position = 0;

          pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, pdfHeight, undefined, 'FAST');
          heightLeft -= pageHeight;

          while (heightLeft > 15) {
            position = position - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
          }
        }

        const pdfBlob = pdf.output('blob');
        if (!pdfBlob || pdfBlob.size < 5000) {
          throw new Error('Generated PDF blob is empty.');
        }

        generatedBlob = pdfBlob;
      } catch (clientErr) {
        console.error('All automated PDF export strategies failed:', clientErr);
        throw clientErr;
      } finally {
        if (tempRoot) {
          try {
            tempRoot.unmount();
          } catch (e) {}
        }
        if (stageContainer && stageContainer.parentNode) {
          stageContainer.remove();
        }
      }
    }

    // Cache the verified blob for instant preview & download reuse
    if (cachedPdf.url) {
      try {
        window.URL.revokeObjectURL(cachedPdf.url);
      } catch (e) {}
    }
    const blobUrl = window.URL.createObjectURL(generatedBlob);
    cachedPdf = {
      blob: generatedBlob,
      hash: currentHash,
      url: blobUrl,
    };

    notifyProgress(onProgress, 'ready', 100, 'PDF binary verified and ready!');
    return { blob: generatedBlob, url: blobUrl, fromCache: false };
  },

  /**
   * PDF Export Pipeline:
   * 1. Validate data
   * 2. Obtain verified PDF binary (from cache or newly rendered)
   * 3. Download the exact same binary
   */
  async exportPDF(cvData, customHtml = '', elementId = 'cv-export-sheet', onProgress = null) {
    const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${cleanName}.pdf`;

    const { blob } = await this.generatePDFBlob(cvData, customHtml, elementId, onProgress);
    triggerDownload(blob, filename);
    return blob;
  },

  /**
   * Native High-Fidelity Vector Print & PDF Engine (Browser-Native Save as PDF).
   * Generates 100% genuine vector text, preserving crisp fonts and CSS page breaks.
   */
  async printDocument(cvData, customHtml = '', elementId = 'cv-export-sheet') {
    const cleanHtml = customHtml || extractCleanTemplateHtml(cvData, elementId);
    const isLetter = cvData?.design?.pageSize === 'Letter';
    const pageSize = isLetter ? 'letter' : 'A4';
    const fontFamily = cvData?.design?.fontFamily || 'Inter';

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    printIframe.id = 'cv-native-print-frame';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${cvData?.personalInfo?.fullName || 'Resume'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: ${pageSize}; margin: 0; }
          *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0; padding: 0; background: #ffffff; font-family: '${fontFamily}', sans-serif; -webkit-font-smoothing: antialiased; }
          .resume-sheet-a4 { width: 210mm !important; min-height: 297mm !important; box-sizing: border-box !important; margin: 0 auto !important; box-shadow: none !important; border: none !important; }
          .resume-sheet-letter { width: 8.5in !important; min-height: 11in !important; box-sizing: border-box !important; margin: 0 auto !important; box-shadow: none !important; border: none !important; }
          .resume-sheet-a4 .md\\:grid-cols-12, .resume-sheet-letter .md\\:grid-cols-12, .grid-cols-12 { display: grid !important; grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
          .resume-sheet-a4 .md\\:col-span-4, .resume-sheet-letter .md\\:col-span-4, .col-span-4 { grid-column: span 4 / span 4 !important; }
          .resume-sheet-a4 .md\\:col-span-8, .resume-sheet-letter .md\\:col-span-8, .col-span-8 { grid-column: span 8 / span 8 !important; }
          .resume-sheet-a4 .sm\\:grid-cols-2, .resume-sheet-letter .sm\\:grid-cols-2 { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .avoid-break, [class*="space-y-"] > div, [class*="space-y-"] > section, tr, li, .break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
          h1, h2, h3, h4, h5, h6 { break-after: avoid !important; page-break-after: avoid !important; }
          .truncate, [class*="truncate"] { overflow: visible !important; text-overflow: clip !important; white-space: normal !important; word-break: break-word !important; }
          .no-print, .ring-2, [class*="ring-"], .cv-editor-pip, .cv-placeholder, .cv-photo-placeholder { display: none !important; }
        </style>
      </head>
      <body>
        ${cleanHtml}
      </body>
      </html>
    `);
    doc.close();

    await new Promise((r) => setTimeout(r, 600));
    try {
      if (printIframe.contentWindow.document.fonts) {
        await printIframe.contentWindow.document.fonts.ready;
      }
    } catch (e) {}

    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();
    setTimeout(() => {
      if (printIframe.parentNode) printIframe.remove();
    }, 15000);
  },

  /**
   * DOCX Export Pipeline:
   * 1. Validate data
   * 2. Call backend DOCX service
   * 3. Fallback to client-side docx library
   * 4. Verify binary document and download
   */
  async exportDOCX(cvData, onProgress = null) {
    const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${cleanName}.docx`;

    notifyProgress(onProgress, 'preparing', 25, 'Preparing Word document structure...');

    // 1. PRIMARY STRATEGY: Backend DOCX Engine
    try {
      notifyProgress(onProgress, 'generating', 75, 'Generating Microsoft Word document...');

      const response = await api.post(
        '/export/docx',
        { cvData },
        {
          responseType: 'blob',
          timeout: 30000,
        }
      );

      if (response.data) {
        if (response.data.type === 'application/json' || response.data.type === 'text/html') {
          const text = await response.data.text();
          let msg = 'Server returned invalid DOCX response';
          try {
            const parsed = JSON.parse(text);
            msg = parsed.message || msg;
          } catch (e) {}
          throw new Error(msg);
        }

        if (response.data.size > 2000) {
          notifyProgress(onProgress, 'ready', 100, 'Ready for download!');
          triggerDownload(response.data, filename);
          return response.data;
        }
      }
    } catch (serverErr) {
      console.warn('Backend DOCX export error, falling back to client-side docx:', serverErr.message);
    }

    // 2. SECONDARY RESILIENT FALLBACK: Client-side docx library
    try {
      notifyProgress(onProgress, 'rendering', 50, 'Structuring Word sections & tables...');
      notifyProgress(onProgress, 'generating', 80, 'Compiling Word document locally...');

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

      const isLetter = design?.pageSize === 'Letter';
      const primaryHex = (design?.primaryColor || '#1E40AF').replace('#', '');
      const darkTextHex = '1E293B';
      const grayHex = '475569';
      const lightGrayHex = '64748B';

      const fontName =
        design?.fontFamily === 'Merriweather'
          ? 'Georgia'
          : design?.fontFamily === 'JetBrains Mono'
          ? 'Consolas'
          : 'Calibri';

      const paragraphs = [];

      // Resolve Photo (omitted for pure ATS-Classic)
      let photoBuffer = null;
      if (templateId !== 'ats-classic' && design?.showPhoto !== false && personalInfo?.photo) {
        photoBuffer = await resolveClientImageBuffer(personalInfo.photo);
      }

      if (photoBuffer) {
        paragraphs.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryHex },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 0, after: 60 },
                        children: [
                          new TextRun({
                            text: personalInfo.fullName || 'CURRICULUM VITAE',
                            bold: true,
                            size: 44,
                            color: primaryHex,
                            font: fontName,
                          }),
                        ],
                      }),
                      ...(personalInfo.jobTitle
                        ? [
                            new Paragraph({
                              spacing: { before: 0, after: 80 },
                              children: [
                                new TextRun({
                                  text: personalInfo.jobTitle.toUpperCase(),
                                  bold: true,
                                  size: 22,
                                  color: grayHex,
                                  font: fontName,
                                }),
                              ],
                            }),
                          ]
                        : []),
                      new Paragraph({
                        spacing: { before: 0, after: 120 },
                        children: [
                          new TextRun({
                            text: [
                              personalInfo.location,
                              personalInfo.phone,
                              personalInfo.email,
                              personalInfo.linkedin,
                            ]
                              .filter(Boolean)
                              .join('  •  '),
                            size: 19,
                            color: grayHex,
                            font: fontName,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 0, after: 120 },
                        children: [
                          new ImageRun({
                            data: photoBuffer,
                            transformation: { width: 95, height: 120 },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: personalInfo.fullName || 'CURRICULUM VITAE',
                bold: true,
                size: 48,
                color: primaryHex,
                font: fontName,
              }),
            ],
          })
        );

        if (personalInfo.jobTitle) {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 80 },
              children: [
                new TextRun({
                  text: personalInfo.jobTitle.toUpperCase(),
                  bold: true,
                  size: 24,
                  color: grayHex,
                  font: fontName,
                }),
              ],
            })
          );
        }

        const contactParts = [
          personalInfo.phone,
          personalInfo.email,
          personalInfo.location,
          personalInfo.linkedin,
        ].filter(Boolean);

        if (contactParts.length > 0) {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: contactParts.join('   •   '),
                  size: 19,
                  color: grayHex,
                  font: fontName,
                }),
              ],
            })
          );
        }
      }

      const createHeading = (title) =>
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          border: {
            bottom: {
              color: primaryHex,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12,
            },
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 22,
              color: primaryHex,
              font: fontName,
            }),
          ],
        });

      if (personalInfo.summary) {
        paragraphs.push(createHeading('Professional Summary'));
        paragraphs.push(
          new Paragraph({
            spacing: { after: 160, line: 260 },
            children: [
              new TextRun({
                text: personalInfo.summary,
                size: 20,
                color: darkTextHex,
                font: fontName,
              }),
            ],
          })
        );
      }

      if (experience && experience.length > 0) {
        paragraphs.push(createHeading('Work Experience'));
        experience.forEach((exp) => {
          const dateRange = [exp.startDate, exp.current ? 'Present' : exp.endDate]
            .filter(Boolean)
            .join(' – ');

          paragraphs.push(
            new Paragraph({
              spacing: { before: 100, after: 30 },
              children: [
                new TextRun({
                  text: exp.jobTitle || 'Role',
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                  font: fontName,
                }),
                ...(dateRange
                  ? [
                      new TextRun({
                        text: `   |   ${dateRange}`,
                        bold: true,
                        size: 18,
                        color: lightGrayHex,
                        font: fontName,
                      }),
                    ]
                  : []),
              ],
            })
          );

          const compLoc = [exp.company, exp.location].filter(Boolean).join(' • ');
          if (compLoc) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50 },
                children: [
                  new TextRun({
                    text: compLoc,
                    italics: true,
                    size: 19,
                    color: grayHex,
                    font: fontName,
                  }),
                ],
              })
            );
          }

          if (exp.description) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50, line: 240 },
                children: [
                  new TextRun({
                    text: exp.description,
                    size: 20,
                    color: darkTextHex,
                    font: fontName,
                  }),
                ],
              })
            );
          }
        });
      }

      if (education && education.length > 0) {
        paragraphs.push(createHeading('Academic Qualifications'));
        education.forEach((edu) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                new TextRun({
                  text: edu.degree || 'Degree',
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                  font: fontName,
                }),
                ...(edu.endDate
                  ? [
                      new TextRun({
                        text: `   |   ${edu.startDate || ''} – ${edu.endDate}`,
                        bold: true,
                        size: 18,
                        color: lightGrayHex,
                        font: fontName,
                      }),
                    ]
                  : []),
              ],
            })
          );

          const eduDetails = [edu.institution, edu.fieldOfStudy, edu.grade ? `Result: ${edu.grade}` : null]
            .filter(Boolean)
            .join(' • ');

          if (eduDetails) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50 },
                children: [
                  new TextRun({
                    text: eduDetails,
                    italics: true,
                    size: 19,
                    color: grayHex,
                    font: fontName,
                  }),
                ],
              })
            );
          }
        });
      }

      if (skills && skills.length > 0) {
        paragraphs.push(createHeading('Skills & Competencies'));
        const skillList = skills
          .map((s) => (typeof s === 'string' ? s : s.name))
          .filter(Boolean);

        if (skillList.length > 0) {
          paragraphs.push(
            new Paragraph({
              spacing: { after: 140, line: 260 },
              children: [
                new TextRun({
                  text: skillList.join('   •   '),
                  bold: true,
                  size: 20,
                  color: darkTextHex,
                  font: fontName,
                }),
              ],
            })
          );
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: isLetter ? 12240 : 11906,
                  height: isLetter ? 15840 : 16838,
                },
                margin: {
                  top: 864,
                  bottom: 864,
                  left: 864,
                  right: 864,
                },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const docxBlob = await Packer.toBlob(doc);
      if (!docxBlob || docxBlob.size < 2000) {
        throw new Error('Generated DOCX blob is empty.');
      }

      notifyProgress(onProgress, 'ready', 100, 'Ready for download!');
      triggerDownload(docxBlob, filename);
      return docxBlob;
    } catch (clientErr) {
      console.error('All DOCX generation strategies failed:', clientErr);
      throw clientErr;
    }
  },
};

export default exportService;
