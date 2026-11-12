/**
 * Client-side image compression and CORS-safe canvas preparation helpers.
 * Prevents multi-MB raw camera uploads from hitting Vercel's 4.5MB serverless body limit (413)
 * and prevents tainted-canvas SecurityError during client-side html2canvas PDF fallback.
 */

const loadHtmlImage = (src, { crossOrigin = null, timeoutMs = 4500 } = {}) =>
  new Promise((resolve) => {
    if (!src || typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    let settled = false;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(val);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    img.onload = () => finish(img);
    img.onerror = () => finish(null);
    img.src = src;
  });

const blobToDataUrl = (blob) =>
  new Promise((resolve) => {
    if (!blob || typeof FileReader === 'undefined') {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });

/**
 * Compresses/resizes an image source (data URI or File) using an offscreen canvas.
 * Also converts WebP/AVIF uploads to JPEG/PNG so Word OpenXML (.docx) embeds reliably.
 */
export const compressImageSourceToDataUrl = async (
  source,
  { maxDimension = 720, quality = 0.88, outputMime = 'image/jpeg' } = {}
) => {
  if (typeof document === 'undefined' || !source) return null;

  let dataUrl = typeof source === 'string' ? source : null;
  if (!dataUrl && typeof File !== 'undefined' && source instanceof Blob) {
    dataUrl = await blobToDataUrl(source);
  }
  if (!dataUrl) return null;

  const img = await loadHtmlImage(dataUrl, { timeoutMs: 4000 });
  if (!img || !img.naturalWidth || !img.naturalHeight) return dataUrl;

  const largestSide = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = largestSide > maxDimension ? maxDimension / largestSide : 1;
  const targetW = Math.max(1, Math.round(img.naturalWidth * scale));
  const targetH = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  try {
    return canvas.toDataURL(outputMime, quality);
  } catch {
    return dataUrl;
  }
};

/**
 * Shrinks oversized inline `data:image/...` strings before sending JSON payloads
 * so requests remain comfortably below Vercel's 4.5MB serverless request body limit.
 */
export const optimizeCvPhotoForExport = async (cvData, maxDataUriLength = 750_000) => {
  const photo = cvData?.personalInfo?.photo;
  if (!photo || typeof photo !== 'string' || !photo.startsWith('data:image')) {
    return cvData;
  }

  const isWebpOrUnsupported = /^data:image\/(webp|avif|svg)/i.test(photo);
  if (photo.length <= maxDataUriLength && !isWebpOrUnsupported) {
    return cvData;
  }

  const compressed = await compressImageSourceToDataUrl(photo, {
    maxDimension: 600,
    quality: 0.86,
    outputMime: 'image/jpeg',
  });

  if (!compressed || (!isWebpOrUnsupported && compressed.length >= photo.length)) {
    return cvData;
  }

  return {
    ...cvData,
    personalInfo: {
      ...cvData.personalInfo,
      photo: compressed,
    },
  };
};

/**
 * Fetches or loads a CORS-safe data URL for any `http(s)://` image, retrying with cache-busting
 * in case the visible preview cached an un-CORSed response from the remote CDN.
 */
export const fetchExternalImageAsDataUrl = async (url, { asPng = false, timeoutMs = 4500 } = {}) => {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('data:image')) return url;

  const tryCorsFetch = async (targetUrl) => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetch(targetUrl, {
        mode: 'cors',
        credentials: 'omit',
        signal: controller?.signal,
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      if (!blob || !blob.size) return null;
      return await blobToDataUrl(blob);
    } catch {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  let dataUrl = await tryCorsFetch(url);
  if (!dataUrl && (url.startsWith('http://') || url.startsWith('https://'))) {
    const sep = url.includes('?') ? '&' : '?';
    dataUrl = await tryCorsFetch(`${url}${sep}cv_cors=1`);
  }

  if (!dataUrl && typeof document !== 'undefined') {
    const sep = url.includes('?') ? '&' : '?';
    const corsImg =
      (await loadHtmlImage(url, { crossOrigin: 'anonymous', timeoutMs })) ||
      (await loadHtmlImage(`${url}${sep}cv_cors=1`, { crossOrigin: 'anonymous', timeoutMs }));

    if (corsImg && corsImg.naturalWidth > 0 && corsImg.naturalHeight > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = corsImg.naturalWidth;
        canvas.height = corsImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(corsImg, 0, 0);
          dataUrl = canvas.toDataURL('image/png');
        }
      } catch {
        dataUrl = null;
      }
    }
  }

  if (dataUrl && asPng && !dataUrl.startsWith('data:image/png')) {
    const converted = await compressImageSourceToDataUrl(dataUrl, {
      maxDimension: 600,
      quality: 0.92,
      outputMime: 'image/png',
    });
    return converted || dataUrl;
  }

  return dataUrl;
};
