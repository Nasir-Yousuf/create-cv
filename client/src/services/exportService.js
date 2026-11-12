import api from './api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
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
import { RenderCVTemplate } from '../templates';
import {
  normalizeCvData,
  toDocxHex,
  stripXmlUnsafeChars,
  detectImageFormatFromBytes,
} from '@shared/utils/cvNormalize.js';
import {
  compressImageSourceToDataUrl,
  optimizeCvPhotoForExport,
  fetchExternalImageAsDataUrl,
} from '../utils/imageOptimize';

const exportStaticStore = {
  getState: () => ({
    ui: { activeSection: null, activeField: null },
  }),
  subscribe: () => () => {},
  dispatch: () => {},
};

const formatFontStack = (rawFontFamily) => {
  const cleaned = String(rawFontFamily || 'Inter').trim();
  if (!cleaned) return "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  if (cleaned.includes(',')) return cleaned;
  return `'${cleaned}', -apple-system, BlinkMacSystemFont, sans-serif`;
};

const extractDocumentCssText = () => {
  try {
    const origin = window.location.origin;
    const chunks = [];
    for (const sheet of Array.from(document.styleSheets || [])) {
      if (sheet.href && !sheet.href.startsWith(origin)) continue;
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (_) {
        continue;
      }
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        chunks.push(rule.cssText);
      }
    }
    const css = chunks.join('\n');
    return css.includes('resume-sheet-a4') ? css : '';
  } catch (_) {
    return '';
  }
};

/**
 * Safely extracts structured JSON errors from axios Blob responses so auth/payment gates propagate properly.
 */
const extractExportError = async (err) => {
  const status = err?.response?.status || err?.status;
  let parsed = null;
  if (err?.response?.data instanceof Blob) {
    try {
      const txt = await err.response.data.text();
      parsed = JSON.parse(txt);
    } catch (_) {}
  } else if (err?.response?.data && typeof err.response.data === 'object') {
    parsed = err.response.data;
  }
  const message = parsed?.message || err?.message || 'Export request failed';
  const wrapped = new Error(message);
  wrapped.status = status;
  wrapped.code = parsed?.code;
  wrapped.entitlements = parsed?.entitlements;
  return wrapped;
};

const isHardPolicyReject = (status, code) =>
  [400, 401, 402, 403, 429].includes(Number(status)) ||
  code === 'CV_NOT_FOUND' ||
  code === 'VERSION_CONFLICT';

/**
 * Safely triggers file download without opening unwanted preview tabs.
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
    a.style.display = 'none';
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

const decodeDataUrlToBytes = (dataUrl) => {
  const commaIndex = typeof dataUrl === 'string' ? dataUrl.indexOf(',') : -1;
  if (commaIndex === -1) return null;
  const base64Data = dataUrl.slice(commaIndex + 1);
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Resolves an image ArrayBuffer + explicit OpenXML image type in the browser for DOCX embedding.
 */
const resolveClientImageBuffer = async (photoUri) => {
  if (!photoUri || typeof photoUri !== 'string') return null;

  try {
    let resolvedDataUrl = null;
    if (photoUri.startsWith('data:image')) {
      resolvedDataUrl = photoUri;
    } else if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
      resolvedDataUrl = await fetchExternalImageAsDataUrl(photoUri, { asPng: true, timeoutMs: 4500 });
    }

    if (!resolvedDataUrl) return null;

    let bytes = decodeDataUrlToBytes(resolvedDataUrl);
    let type = detectImageFormatFromBytes(bytes);

    // Convert WebP/AVIF/SVG uploads to PNG so docx@9 embeds reliably without crashing Word
    if (!type) {
      const converted = await compressImageSourceToDataUrl(resolvedDataUrl, {
        maxDimension: 600,
        quality: 0.9,
        outputMime: 'image/png',
      });
      if (converted && converted.startsWith('data:image')) {
        bytes = decodeDataUrlToBytes(converted);
        type = detectImageFormatFromBytes(bytes);
      }
    }

    if (bytes && bytes.length >= 8 && type) {
      return { buffer: bytes.buffer, type };
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

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Prime pixel stride (13px = 52 bytes) avoids missing thin dark text on white backgrounds
    const byteStride = 13 * 4;
    let nonWhiteCount = 0;

    for (let i = 0; i < data.length; i += byteStride) {
      const isNotWhite = data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245;
      const isNotTransparent = data[i + 3] > 10;
      if (isNotWhite && isNotTransparent) {
        nonWhiteCount++;
        if (nonWhiteCount > 3) return true;
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
 * Cleans a cloned CV sheet element without altering template typography or layout classes.
 */
const sanitizeSheetClone = (clone, cvData) => {
  clone.style.transform = 'none';
  clone.style.webkitTransform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.width = cvData?.design?.pageSize === 'Letter' ? '8.5in' : '210mm';
  clone.style.minHeight = cvData?.design?.pageSize === 'Letter' ? '11in' : '297mm';

  // Remove interactive editor chrome only (never delete editable content nodes!)
  const editorChrome = clone.querySelectorAll('.cv-editor-pip, .cv-placeholder, .no-print');
  editorChrome.forEach((el) => el.remove());

  // Strip editor selection rings/hover utility classes while keeping the text elements intact
  const decoratedNodes = clone.querySelectorAll('[class*="ring-"], [title="Click to edit directly"]');
  decoratedNodes.forEach((node) => {
    node.classList.remove(
      'ring-2',
      'ring-indigo-500',
      'ring-offset-1',
      'bg-indigo-50/30',
      'hover:outline-dashed',
      'hover:outline-1',
      'hover:outline-indigo-400/80',
      'hover:bg-indigo-50/10'
    );
  });

  // Remove empty upload-photo button box when user has not uploaded a photo
  if (!cvData?.personalInfo?.photo) {
    const cameraBoxes = clone.querySelectorAll('.cv-photo-placeholder');
    cameraBoxes.forEach((b) => b.remove());
  }

  return clone.outerHTML;
};

/**
 * Extracts and prepares clean HTML for the target CV template when mounted in the DOM.
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

  if (!sheetEl) return '';

  const clone = sheetEl.cloneNode(true);
  return sanitizeSheetClone(clone, cvData);
};

/**
 * Renders the canonical React CV template off-screen at exact desktop dimensions (for Dashboard / mobile viewports).
 */
const renderOffscreenDesktopHtml = async (cvData) => {
  const isLetter = cvData?.design?.pageSize === 'Letter';
  const stageWidth = isLetter ? 816 : 794;
  const stageMinHeight = isLetter ? 1056 : 1123;

  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -15000px;
    top: 0;
    width: ${stageWidth}px;
    min-height: ${stageMinHeight}px;
    pointer-events: none;
    opacity: 0;
  `;
  document.body.appendChild(container);

  let root = null;
  try {
    await new Promise((resolve) => {
      root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(
          Provider,
          { store: exportStaticStore },
          React.createElement(RenderCVTemplate, { cvData, scale: 1 })
        )
      );
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 160)));
    });

    const sheetEl = container.querySelector('#cv-export-sheet');
    if (!sheetEl) return '';
    return sanitizeSheetClone(sheetEl.cloneNode(true), cvData);
  } finally {
    if (root) {
      try {
        root.unmount();
      } catch (_) {}
    }
    if (container.parentNode) {
      container.remove();
    }
  }
};

const ensureCleanExportHtml = async (cvData, customHtml = '', elementId = 'cv-export-sheet') => {
  if (typeof customHtml === 'string' && customHtml.trim().length > 50) {
    return customHtml;
  }
  const extracted = extractCleanTemplateHtml(cvData, elementId);
  if (extracted) {
    return extracted;
  }
  return renderOffscreenDesktopHtml(cvData);
};

/**
 * Pre-renders object-fit: cover / contain images onto matched offscreen canvases so
 * html2canvas (which ignores CSS object-fit) preserves exact aspect ratios without stretching.
 */
const parseObjectPositionFactor = (token) => {
  if (!token) return 0.5;
  if (token === 'left' || token === 'top') return 0;
  if (token === 'right' || token === 'bottom') return 1;
  if (token === 'center') return 0.5;
  if (token.endsWith('%')) {
    const pct = parseFloat(token);
    return Number.isFinite(pct) ? Math.min(1, Math.max(0, pct / 100)) : 0.5;
  }
  return 0.5;
};

const cropImageElementToDataUrl = (sourceImg, targetW, targetH, objectFit, xFactor, yFactor) => {
  const nw = sourceImg.naturalWidth;
  const nh = sourceImg.naturalHeight;
  if (!nw || !nh || targetW <= 0 || targetH <= 0) return null;

  const scale = 2;
  const cw = Math.max(1, Math.round(targetW * scale));
  const ch = Math.max(1, Math.round(targetH * scale));
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const imgRatio = nw / nh;
  const boxRatio = targetW / targetH;

  if (objectFit === 'contain') {
    let dw = cw;
    let dh = ch;
    if (imgRatio > boxRatio) {
      dh = cw / imgRatio;
    } else {
      dw = ch * imgRatio;
    }
    const dx = (cw - dw) * xFactor;
    const dy = (ch - dh) * yFactor;
    ctx.drawImage(sourceImg, 0, 0, nw, nh, dx, dy, dw, dh);
  } else {
    let sx = 0;
    let sy = 0;
    let sw = nw;
    let sh = nh;
    if (imgRatio > boxRatio) {
      sw = nh * boxRatio;
      sx = (nw - sw) * xFactor;
    } else {
      sh = nw / boxRatio;
      sy = (nh - sh) * yFactor;
    }
    ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  return canvas.toDataURL('image/png');
};

/**
 * Converts cross-origin http(s) <img> nodes inside an offscreen capture container to inline
 * data URLs before html2canvas runs so canvas.toDataURL never throws SecurityError.
 */
const inlineExternalImagesForCanvas = async (container) => {
  if (!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src') || img.src || '';
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) return;
      if (src.startsWith('http://') || src.startsWith('https://')) {
        const inlined = await fetchExternalImageAsDataUrl(src, { asPng: true, timeoutMs: 4500 });
        if (inlined) {
          img.removeAttribute('crossorigin');
          img.src = inlined;
          await new Promise((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            const timer = setTimeout(resolve, 1500);
            img.onload = () => {
              clearTimeout(timer);
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve();
            };
          });
        } else {
          // Remove unreadable external image inside offscreen clone so canvas stays untainted
          img.remove();
        }
      }
    })
  );
};

const prepareImagesForCanvas = async (container) => {
  if (!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    imgs.map(async (img) => {
      try {
        if (!img.src || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return;
        const rect = img.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const cs = window.getComputedStyle(img);
        const objectFit = cs.objectFit;
        if (objectFit !== 'cover' && objectFit !== 'contain') return;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boxRatio = rect.width / rect.height;
        if (Math.abs(imgRatio - boxRatio) <= 0.015) return;

        const posParts = (cs.objectPosition || '50% 50%').trim().split(/\s+/);
        const xFactor = parseObjectPositionFactor(posParts[0]);
        const yFactor = parseObjectPositionFactor(posParts[1] || posParts[0]);

        let croppedDataUrl = null;
        try {
          croppedDataUrl = cropImageElementToDataUrl(img, rect.width, rect.height, objectFit, xFactor, yFactor);
        } catch (taintErr) {
          // Retry with explicit CORS request for external hosts supporting Access-Control-Allow-Origin
          croppedDataUrl = await new Promise((resolve) => {
            const corsImg = new Image();
            corsImg.crossOrigin = 'anonymous';
            const timer = setTimeout(() => resolve(null), 2500);
            corsImg.onload = () => {
              clearTimeout(timer);
              try {
                resolve(cropImageElementToDataUrl(corsImg, rect.width, rect.height, objectFit, xFactor, yFactor));
              } catch (e) {
                resolve(null);
              }
            };
            corsImg.onerror = () => {
              clearTimeout(timer);
              resolve(null);
            };
            corsImg.src = img.src;
          });
        }

        if (croppedDataUrl) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            img.src = croppedDataUrl;
            img.style.objectFit = 'fill';
            if (img.complete) resolve();
          });
        } else if (objectFit === 'cover' && img.parentElement) {
          // Pure geometric DOM cover fallback if cross-origin canvas export is blocked
          const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
          const drawW = img.naturalWidth * scale;
          const drawH = img.naturalHeight * scale;
          const offsetX = (rect.width - drawW) * xFactor;
          const offsetY = (rect.height - drawH) * yFactor;

          const wrapper = document.createElement('div');
          wrapper.style.cssText = `
            position: relative;
            overflow: hidden;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border-radius: ${cs.borderRadius};
            border: ${cs.border};
            box-shadow: ${cs.boxShadow};
            flex-shrink: 0;
            box-sizing: border-box;
          `;
          wrapper.className = img.className;
          img.parentNode.insertBefore(wrapper, img);
          img.className = '';
          img.style.cssText = `
            position: absolute;
            width: ${drawW}px;
            height: ${drawH}px;
            max-width: none;
            max-height: none;
            left: ${offsetX}px;
            top: ${offsetY}px;
            object-fit: fill;
            display: block;
          `;
          wrapper.appendChild(img);
        }
      } catch (e) {
        // Ignore unexpected image errors and let capture proceed
      }
    })
  );
};

export const exportService = {
  invalidatePdfCache,
  getCachedPdf,

  /**
   * Generates a validated PDF binary Blob, caching it for identical preview and download.
   */
  async generatePDFBlob(rawCvData, customHtml = '', elementId = 'cv-export-sheet', onProgress = null, options = {}) {
    const cvData = await optimizeCvPhotoForExport(normalizeCvData(rawCvData));
    const cvId = options?.cvId || rawCvData?._id || cvData?._id || null;
    const currentHash = `${cvId || 'draft'}:${computeCvHash(cvData)}`;
    if (!options?.skipCache && options?.previewOnly && cachedPdf.blob && cachedPdf.hash === currentHash && cachedPdf.url) {
      notifyProgress(onProgress, 'ready', 100, 'Reusing verified PDF binary...');
      return { blob: cachedPdf.blob, url: cachedPdf.url, fromCache: true };
    }

    notifyProgress(onProgress, 'preparing', 20, 'Preparing document & layout data...');
    const cleanHtml = await ensureCleanExportHtml(cvData, customHtml, elementId);
    const cssText = extractDocumentCssText();

    let generatedBlob = null;
    let resolvedCvId = cvId;
    let resolvedUnlockType = null;

    const fullPayload = {
      cvData,
      html: cleanHtml,
      css: cssText,
      cvId,
      previewOnly: Boolean(options?.previewOnly),
    };
    let requestBody = fullPayload;
    try {
      // Keep well under Vercel's 4.5MB body cap; backend falls back cleanly to SSR + styles.css
      if (JSON.stringify(fullPayload).length > 1_800_000) {
        requestBody = {
          cvData,
          cvId,
          previewOnly: Boolean(options?.previewOnly),
        };
      }
    } catch {
      requestBody = {
        cvData,
        cvId,
        previewOnly: Boolean(options?.previewOnly),
      };
    }

    // 1. PRIMARY STRATEGY: High-Fidelity Server-Side Puppeteer Engine (enforces auth & entitlements)
    try {
      notifyProgress(onProgress, 'rendering', 45, 'Rendering vector typography & layout...');
      notifyProgress(onProgress, 'generating', 75, 'Generating vector PDF document...');

      const response = await api.post('/export/pdf', requestBody, {
        responseType: 'blob',
        timeout: 58000,
      });

      const headerCvId = response.headers?.['x-cv-id'];
      const headerUnlockType = response.headers?.['x-unlock-type'];
      if (headerCvId) resolvedCvId = headerCvId;
      if (headerUnlockType) resolvedUnlockType = headerUnlockType;

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
      const parsedErr = await extractExportError(serverErr);
      if (isHardPolicyReject(parsedErr.status, parsedErr.code)) {
        throw parsedErr;
      }
      console.warn('Backend PDF export error, attempting client-side fallback:', parsedErr.message);
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

        const isLetterStage = cvData?.design?.pageSize === 'Letter';
        const stageWidth = isLetterStage ? 816 : 794;
        const stageMinHeight = isLetterStage ? 1056 : 1123;

        // Create strictly off-screen staging container so no visual preview panel flashes over the UI
        stageContainer = document.createElement('div');
        stageContainer.id = 'client-pdf-active-stage';
        stageContainer.style.cssText = `
          position: fixed;
          left: -15000px;
          top: 0;
          width: ${stageWidth}px;
          min-height: ${stageMinHeight}px;
          z-index: -1;
          background: #ffffff;
          opacity: 1;
          pointer-events: none;
          overflow: visible;
          margin: 0;
          padding: 0;
          font-family: ${formatFontStack(cvData?.design?.fontFamily)};
        `;
        document.body.appendChild(stageContainer);

        let captureEl = null;

        if (cleanHtml) {
          stageContainer.innerHTML = cleanHtml;
          captureEl = stageContainer.firstElementChild || stageContainer;
        } else {
          // Mount React Template directly inside Redux Provider
          await new Promise((resolve) => {
            tempRoot = ReactDOM.createRoot(stageContainer);
            tempRoot.render(
              React.createElement(
                Provider,
                { store: exportStaticStore },
                React.createElement(RenderCVTemplate, {
                  cvData,
                  scale: 1,
                })
              )
            );
            requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 260)));
          });
          captureEl = stageContainer.querySelector('#cv-export-sheet') || stageContainer;
        }

        // Convert remote images to inline CORS-safe data URIs first so html2canvas never taints
        await inlineExternalImagesForCanvas(captureEl);

        // Ensure images decode
        const images = stageContainer.querySelectorAll('img');
        if (images.length > 0) {
          await Promise.all(
            Array.from(images).map((img) => {
              if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 1500);
              });
            })
          );
        }

        // Pre-crop object-fit: cover/contain images for crisp aspect-ratio fidelity in html2canvas
        await prepareImagesForCanvas(captureEl);
        await new Promise((r) => setTimeout(r, 80));

        // Fix Tailwind Preflight `img { display: block }` breaking html2canvas FontMetrics baseline calculation
        const baselineFixStyle = document.createElement('style');
        baselineFixStyle.id = 'cv-html2canvas-baseline-fix';
        baselineFixStyle.textContent = `
          body > div[style*="visibility"][style*="nowrap"] > img {
            display: inline-block !important;
            vertical-align: baseline !important;
          }
        `;
        document.head.appendChild(baselineFixStyle);

        let canvas;
        try {
          canvas = await html2canvas(captureEl, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            width: stageWidth,
            windowWidth: stageWidth,
            scrollX: 0,
            scrollY: 0,
          });
        } finally {
          if (baselineFixStyle.parentNode) baselineFixStyle.remove();
        }

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

        // Only place on a single page when content genuinely fits A4/Letter without vertical squishing
        if (pdfHeight <= pageHeight + 2) {
          pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pdfHeight, undefined, 'FAST');
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

        // Enforce & record server entitlement/unlock in MongoDB when using client PDF fallback
        try {
          const fallbackRes = await api.post('/export/pdf/record-fallback', {
            cvData,
            cvId,
            previewOnly: Boolean(options?.previewOnly),
          });
          if (fallbackRes?.data?.cvId) resolvedCvId = fallbackRes.data.cvId;
          if (fallbackRes?.data?.unlockType) resolvedUnlockType = fallbackRes.data.unlockType;
        } catch (recordErr) {
          const parsedRecordErr = await extractExportError(recordErr);
          if (isHardPolicyReject(parsedRecordErr.status, parsedRecordErr.code)) {
            throw parsedRecordErr;
          }
          console.warn('Could not sync fallback export log:', parsedRecordErr.message);
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

    if (typeof options?.onServerMeta === 'function' && (resolvedCvId || resolvedUnlockType)) {
      try {
        options.onServerMeta({ cvId: resolvedCvId, unlockType: resolvedUnlockType });
      } catch (_) {}
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
    return {
      blob: generatedBlob,
      url: blobUrl,
      fromCache: false,
      cvId: resolvedCvId,
      unlockType: resolvedUnlockType,
    };
  },

  /**
   * PDF Export Pipeline:
   * 1. Validate data
   * 2. Obtain verified PDF binary (from cache or newly rendered)
   * 3. Download the exact same binary
   */
  async exportPDF(cvData, customHtml = '', elementId = 'cv-export-sheet', onProgress = null, options = {}) {
    const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${cleanName}.pdf`;

    const { blob } = await this.generatePDFBlob(cvData, customHtml, elementId, onProgress, options);
    triggerDownload(blob, filename);
    return blob;
  },

  /**
   * Native High-Fidelity Vector Print & PDF Engine (Browser-Native Save as PDF).
   * Generates 100% genuine vector text, preserving crisp fonts and CSS page breaks.
   */
  async printDocument(cvData, customHtml = '', elementId = 'cv-export-sheet') {
    const cleanHtml = await ensureCleanExportHtml(cvData, customHtml, elementId);
    const cssText = extractDocumentCssText().replace(/<\/style/gi, '<\\/style');
    const isLetter = cvData?.design?.pageSize === 'Letter';
    const pageSize = isLetter ? 'letter' : 'A4';
    const fontStack = formatFontStack(cvData?.design?.fontFamily);

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
        ${cssText ? `<style>${cssText}</style>` : '<script src="https://cdn.tailwindcss.com"></script>'}
        <style>
          @page { size: ${pageSize}; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0; padding: 0; background: #ffffff !important; font-family: ${fontStack}; -webkit-font-smoothing: antialiased; }
          #cv-export-sheet, .resume-sheet-a4, .resume-sheet-letter {
            width: ${isLetter ? '8.5in' : '210mm'} !important;
            min-height: ${isLetter ? '10.95in' : '296.5mm'} !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            transform: none !important;
            overflow: visible !important;
          }
          .avoid-break, .break-inside-avoid, tr { break-inside: avoid; page-break-inside: avoid; }
          .no-print, .cv-editor-pip, .cv-placeholder, .cv-photo-placeholder { display: none !important; }
        </style>
      </head>
      <body class="bg-white">
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
  async exportDOCX(rawCvData, onProgress = null, options = {}) {
    const cvData = await optimizeCvPhotoForExport(normalizeCvData(rawCvData));
    const cvId = options?.cvId || rawCvData?._id || cvData?._id || null;
    const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${cleanName}.docx`;

    notifyProgress(onProgress, 'preparing', 25, 'Preparing Word document structure...');

    // 1. PRIMARY STRATEGY: Backend DOCX Engine
    try {
      notifyProgress(onProgress, 'generating', 75, 'Generating Microsoft Word document...');

      const response = await api.post(
        '/export/docx',
        { cvData, cvId },
        {
          responseType: 'blob',
          timeout: 45000,
        }
      );

      const headerCvId = response.headers?.['x-cv-id'];
      const headerUnlockType = response.headers?.['x-unlock-type'];
      if (typeof options?.onServerMeta === 'function' && (headerCvId || headerUnlockType)) {
        try {
          options.onServerMeta({ cvId: headerCvId || cvId, unlockType: headerUnlockType || null });
        } catch (_) {}
      }

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
      const parsedErr = await extractExportError(serverErr);
      if (isHardPolicyReject(parsedErr.status, parsedErr.code)) {
        throw parsedErr;
      }
      console.warn('Backend DOCX export error, falling back to client-side docx:', parsedErr.message);
    }

    // 2. SECONDARY RESILIENT FALLBACK: Client-side docx library
    try {
      notifyProgress(onProgress, 'rendering', 50, 'Structuring Word sections & tables...');
      notifyProgress(onProgress, 'generating', 80, 'Compiling Word document locally...');

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
        customSections = [],
        design = {},
      } = cvData;

      const isLetter = design?.pageSize === 'Letter';
      const primaryHex = toDocxHex(design?.primaryColor, '1E40AF');
      const darkTextHex = '1E293B';
      const grayHex = '475569';
      const lightGrayHex = '64748B';

      const fontName =
        design?.fontFamily === 'Merriweather'
          ? 'Georgia'
          : design?.fontFamily === 'JetBrains Mono'
          ? 'Consolas'
          : 'Calibri';

      const safeRun = (text, runOptions = {}) =>
        new TextRun({
          font: fontName,
          ...runOptions,
          text: stripXmlUnsafeChars(text),
        });

      const paragraphs = [];

      // Resolve Photo (omitted for pure ATS-Classic)
      let photoResult = null;
      if (templateId !== 'ats-classic' && design?.showPhoto !== false && personalInfo?.photo) {
        photoResult = await resolveClientImageBuffer(personalInfo.photo);
      }

      if (photoResult) {
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
                          safeRun(personalInfo.fullName || 'CURRICULUM VITAE', {
                            bold: true,
                            size: 44,
                            color: primaryHex,
                          }),
                        ],
                      }),
                      ...(personalInfo.jobTitle
                        ? [
                            new Paragraph({
                              spacing: { before: 0, after: 80 },
                              children: [
                                safeRun(String(personalInfo.jobTitle).toUpperCase(), {
                                  bold: true,
                                  size: 22,
                                  color: grayHex,
                                }),
                              ],
                            }),
                          ]
                        : []),
                      new Paragraph({
                        spacing: { before: 0, after: 120 },
                        children: [
                          safeRun(
                            [
                              personalInfo.location,
                              personalInfo.phone,
                              personalInfo.email,
                              personalInfo.linkedin,
                            ]
                              .filter(Boolean)
                              .join('  •  '),
                            { size: 19, color: grayHex }
                          ),
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
                            data: photoResult.buffer,
                            type: photoResult.type,
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
              safeRun(personalInfo.fullName || 'CURRICULUM VITAE', {
                bold: true,
                size: 48,
                color: primaryHex,
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
                safeRun(String(personalInfo.jobTitle).toUpperCase(), {
                  bold: true,
                  size: 24,
                  color: grayHex,
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
                safeRun(contactParts.join('   •   '), { size: 19, color: grayHex }),
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
            safeRun(String(title || '').toUpperCase(), {
              bold: true,
              size: 22,
              color: primaryHex,
            }),
          ],
        });

      if (personalInfo.summary) {
        paragraphs.push(createHeading('Professional Summary'));
        paragraphs.push(
          new Paragraph({
            spacing: { after: 160, line: 260 },
            children: [safeRun(personalInfo.summary, { size: 20, color: darkTextHex })],
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
                safeRun(exp.jobTitle || 'Role', {
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                }),
                ...(dateRange
                  ? [
                      safeRun(`   |   ${dateRange}`, {
                        bold: true,
                        size: 18,
                        color: lightGrayHex,
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
                children: [safeRun(compLoc, { italics: true, size: 19, color: grayHex })],
              })
            );
          }

          if (exp.description) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50, line: 240 },
                children: [safeRun(exp.description, { size: 20, color: darkTextHex })],
              })
            );
          }

          if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
            exp.highlights.forEach((h) => {
              if (typeof h === 'string' && h.trim()) {
                paragraphs.push(
                  new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 30, line: 240 },
                    children: [safeRun(h.replace(/^•\s*/, ''), { size: 19, color: darkTextHex })],
                  })
                );
              }
            });
          }
        });
      }

      if (education && education.length > 0) {
        paragraphs.push(createHeading('Academic Qualifications'));
        education.forEach((edu) => {
          const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
          paragraphs.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                safeRun(edu.degree || 'Degree', {
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                }),
                ...(dateRange
                  ? [
                      safeRun(`   |   ${dateRange}`, {
                        bold: true,
                        size: 18,
                        color: lightGrayHex,
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
                children: [safeRun(eduDetails, { italics: true, size: 19, color: grayHex })],
              })
            );
          }
        });
      }

      if (skills && skills.length > 0) {
        const skillList = skills
          .map((s) => (typeof s === 'string' ? s : s?.name))
          .filter(Boolean);

        if (skillList.length > 0) {
          paragraphs.push(createHeading('Skills & Competencies'));
          paragraphs.push(
            new Paragraph({
              spacing: { after: 140, line: 260 },
              children: [
                safeRun(skillList.join('   •   '), {
                  bold: true,
                  size: 20,
                  color: darkTextHex,
                }),
              ],
            })
          );
        }
      }

      if (projects && projects.length > 0) {
        paragraphs.push(createHeading('Key Projects'));
        projects.forEach((proj) => {
          const hasTech = Array.isArray(proj.technologies) && proj.technologies.length > 0;
          paragraphs.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                safeRun(proj.title || proj.name || 'Project Name', {
                  bold: true,
                  size: 20,
                  color: darkTextHex,
                }),
                ...(hasTech
                  ? [
                      safeRun(`   [${proj.technologies.join(', ')}]`, {
                        italics: true,
                        size: 18,
                        color: lightGrayHex,
                      }),
                    ]
                  : []),
              ],
            })
          );
          if (proj.description) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50, line: 240 },
                children: [safeRun(proj.description, { size: 19, color: darkTextHex })],
              })
            );
          }
        });
      }

      if (certifications && certifications.length > 0) {
        paragraphs.push(createHeading('Certifications & Licenses'));
        certifications.forEach((cert) => {
          const certInfo = [cert.issuer, cert.date || cert.year].filter(Boolean).join(' • ');
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                safeRun(cert.name || 'Certification', {
                  bold: true,
                  size: 19,
                  color: darkTextHex,
                }),
                ...(certInfo
                  ? [safeRun(` (${certInfo})`, { italics: true, size: 18, color: lightGrayHex })]
                  : []),
              ],
            })
          );
        });
      }

      if (languages && languages.length > 0) {
        const langItems = languages
          .map((lang) => {
            if (typeof lang === 'string') return lang;
            return `${lang.language || lang.name || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}`.trim();
          })
          .filter(Boolean);
        if (langItems.length > 0) {
          paragraphs.push(createHeading('Languages'));
          paragraphs.push(
            new Paragraph({
              spacing: { after: 120 },
              children: [safeRun(langItems.join('   •   '), { size: 20, color: darkTextHex })],
            })
          );
        }
      }

      const isBdTemplate = String(templateId).includes('bd') || String(templateId).includes('bangladesh');
      const bdFields = [
        { label: "Father's Name", value: personalDetails.fatherName },
        { label: "Mother's Name", value: personalDetails.motherName },
        { label: 'Date of Birth', value: personalDetails.dob || personalDetails.dateOfBirth },
        { label: 'Gender', value: personalDetails.gender },
        { label: 'Marital Status', value: personalDetails.maritalStatus },
        { label: 'Nationality', value: personalDetails.nationality || (isBdTemplate ? 'Bangladeshi' : '') },
        { label: 'National ID (NID)', value: personalDetails.nid || personalDetails.nationalId },
        { label: 'Blood Group', value: personalDetails.bloodGroup },
        { label: 'Present Address', value: personalDetails.presentAddress },
        { label: 'Permanent Address', value: personalDetails.permanentAddress },
      ].filter((f) => Boolean(f.value));

      if (bdFields.length > 0) {
        paragraphs.push(createHeading('Personal Details'));
        bdFields.forEach((field) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 20, after: 30 },
              children: [
                safeRun(`${field.label}: `, { bold: true, size: 19, color: grayHex }),
                safeRun(field.value, { size: 19, color: darkTextHex }),
              ],
            })
          );
        });
      }

      if (references && references.length > 0) {
        paragraphs.push(createHeading('References'));
        references.forEach((ref) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 60, after: 20 },
              children: [safeRun(ref.name || 'Reference Person', { bold: true, size: 20, color: darkTextHex })],
            })
          );
          const refDetails = [
            ref.designation,
            ref.company,
            ref.phone ? `Phone: ${ref.phone}` : null,
            ref.email ? `Email: ${ref.email}` : null,
          ]
            .filter(Boolean)
            .join('   |   ');
          if (refDetails) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 50 },
                children: [safeRun(refDetails, { size: 18, color: grayHex })],
              })
            );
          }
        });
      }

      if (customSections && customSections.length > 0) {
        customSections.forEach((sec) => {
          if (!sec || (!sec.content && (!Array.isArray(sec.items) || sec.items.length === 0))) {
            return;
          }
          paragraphs.push(createHeading(sec.title || 'Additional Information'));
          if (sec.content) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 80, line: 240 },
                children: [safeRun(sec.content, { size: 19, color: darkTextHex })],
              })
            );
          }
          if (Array.isArray(sec.items) && sec.items.length > 0) {
            sec.items.forEach((item) => {
              const headline = [item.title, item.subtitle, item.date].filter(Boolean).join(' • ');
              if (headline) {
                paragraphs.push(
                  new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 30, line: 240 },
                    children: [safeRun(headline, { bold: true, size: 19, color: darkTextHex })],
                  })
                );
              }
              if (item.description) {
                paragraphs.push(
                  new Paragraph({
                    spacing: { after: 40, line: 240 },
                    children: [safeRun(item.description, { size: 18, color: grayHex })],
                  })
                );
              }
            });
          }
        });
      }

      if (declaration && (declaration.signedBy || declaration.text)) {
        paragraphs.push(createHeading('Declaration'));
        paragraphs.push(
          new Paragraph({
            spacing: { after: 120, line: 240 },
            children: [
              safeRun(
                declaration.text || 'I hereby declare that all information provided above is true and correct.',
                { italics: true, size: 19, color: darkTextHex }
              ),
            ],
          })
        );
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 120, after: 60 },
            children: [
              safeRun(declaration.signedBy || personalInfo.fullName || 'Authorized Signature', {
                bold: true,
                size: 20,
                color: primaryHex,
              }),
            ],
          })
        );
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
