import React from 'react';
import './cvElements.css';

/**
 * Reusable icon-and-text row ensuring consistent vertical centering,
 * non-shrinking icon bounds, and clean line-wrapping across preview and PDF exports.
 */
export const CVIconRow = ({
  icon: Icon,
  iconClassName = 'w-3.5 h-3.5',
  iconStyle,
  className = '',
  as: Tag = 'div',
  children,
}) => (
  <Tag className={`cv-icon-row ${className}`}>
    {Icon && <Icon className={`cv-icon-svg shrink-0 ${iconClassName}`} style={iconStyle} aria-hidden="true" />}
    {children}
  </Tag>
);

/**
 * Reusable badge/pill wrapper guaranteeing centered horizontal & vertical
 * text placement regardless of font size, text length, or PDF renderer.
 */
export const CVBadge = ({ className = '', style, children }) => (
  <span className={`cv-badge ${className}`} style={style}>
    {children}
  </span>
);

const DEFAULT_CIRCLE_SIZES = {
  sm: 'w-24 h-24',
  md: 'w-28 h-28',
  lg: 'w-36 h-36',
  xl: 'w-40 h-40',
};

const DEFAULT_PORTRAIT_SIZES = {
  sm: 'w-24 h-32',
  md: 'w-28 h-36',
  lg: 'w-36 h-48',
  xl: 'w-40 h-52',
};

/**
 * Resolves mutually-exclusive width/height classes for profile photos so
 * circular styles never inherit conflicting portrait height utilities.
 */
export const resolvePhotoBoxClasses = ({
  photoSize = 'md',
  photoStyle = 'portrait',
  circleSizes = DEFAULT_CIRCLE_SIZES,
  portraitSizes = DEFAULT_PORTRAIT_SIZES,
  squareSizes = DEFAULT_CIRCLE_SIZES,
} = {}) => {
  if (photoStyle === 'circle') {
    const dims = circleSizes[photoSize] || circleSizes.md;
    return `${dims} cv-photo-frame cv-photo-circle rounded-full`;
  }
  if (photoStyle === 'square') {
    const dims = squareSizes[photoSize] || squareSizes.md;
    return `${dims} cv-photo-frame rounded-none`;
  }
  if (photoStyle === 'rounded') {
    const dims = portraitSizes[photoSize] || portraitSizes.md;
    return `${dims} cv-photo-frame rounded-xl`;
  }
  const dims = portraitSizes[photoSize] || portraitSizes.md;
  return `${dims} cv-photo-frame rounded-md`;
};

