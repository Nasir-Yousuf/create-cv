import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RenderCVTemplate, TEMPLATE_COMPONENTS } from './index.jsx';

export const TEMPLATE_MAP = TEMPLATE_COMPONENTS;

const staticStore = {
  getState: () => ({
    ui: {
      activeSection: null,
      activeField: null,
    },
  }),
  subscribe: () => () => {},
  dispatch: () => {},
};

/**
 * Renders any canonical CV template via React SSR using the exact same React
 * components rendered in the live preview, guaranteeing single-source parity.
 */
export const renderCVToStaticHtml = (cvData) => {
  return renderToStaticMarkup(
    React.createElement(
      Provider,
      { store: staticStore },
      React.createElement(RenderCVTemplate, { cvData, scale: 1 })
    )
  );
};

export { TEMPLATE_COMPONENTS };
export { getGoogleFontsUrl, formatFontStack, containsBanglaText } from '@shared/utils/cvNormalize.js';

export default renderCVToStaticHtml;

