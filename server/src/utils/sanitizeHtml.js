/**
 * HTML, CSS, and String Sanitization Utilities
 * Prevents XSS, script execution, and protocol injection inside Headless Chromium (Puppeteer)
 * and exported documents.
 */

/**
 * Sanitizes an HTML string to ensure safe injection into the Puppeteer DOM.
 * Strips script tags, frames, embeds, event handler attributes, and dangerous protocols.
 */
export function sanitizeHtml(rawHtml) {
  if (typeof rawHtml !== 'string') return '';

  let sanitized = rawHtml
    // 1. Strip all <script> tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '')
    // 2. Strip all <noscript> tags and their contents
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript\s*>/gi, '')
    // 3. Strip dangerous framing & embedding tags
    .replace(/<\/?(iframe|frame|object|embed|applet|form|base|meta)\b[^>]*>/gi, '')
    // 4. Strip all inline DOM event handler attributes (onload, onerror, onclick, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    // 5. Neutralize javascript: pseudo-protocol in attributes
    .replace(/(href|src|action|data)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, '$1=""')
    // 6. Neutralize data:text/html and data:application/javascript
    .replace(/(href|src|action|data)\s*=\s*(?:'data:(?:text\/html|application\/javascript)[^']*'|"data:(?:text\/html|application\/javascript)[^"]*"|data:(?:text\/html|application\/javascript)[^\s>]+)/gi, '$1=""');

  return sanitized;
}

/**
 * Sanitizes CSS to prevent escaping out of <style> blocks or executing legacy CSS expressions.
 */
export function sanitizeCss(rawCss) {
  if (typeof rawCss !== 'string') return '';

  return rawCss
    // Prevent style tag breakout
    .replace(/<\/style/gi, '<\\/style')
    // Remove IE dynamic expressions
    .replace(/expression\s*\(.*?\)/gi, '')
    // Remove behaviors and bindings
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding\s*:/gi, '')
    // Remove javascript: in url()
    .replace(/url\s*\(\s*(['"]?)\s*javascript:[^)]*\1\s*\)/gi, 'none');
}

/**
 * Validates photo data URLs to ensure only legitimate image MIME types (JPEG, PNG, WebP)
 * are permitted and limits raw payload length.
 */
export function validateAndSanitizePhoto(photo) {
  if (!photo || typeof photo !== 'string') return null;

  const trimmed = photo.trim();
  if (trimmed.length === 0) return null;

  // If base64 data URL
  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:(image\/(?:jpeg|png|webp|jpg));base64,/i);
    if (!match) {
      // Disallow SVGs, text/html, or unknown data types
      return null;
    }
    // Limit to ~7MB base64 characters (~5MB raw image)
    if (trimmed.length > 7 * 1024 * 1024) {
      return null;
    }
    return trimmed;
  }

  // If HTTP/HTTPS URL
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch (_) {
    return null;
  }

  return null;
}

export default {
  sanitizeHtml,
  sanitizeCss,
  validateAndSanitizePhoto,
};
