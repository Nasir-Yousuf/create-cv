import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          // Heavy dynamic components & admin page
          if (normalizedId.includes('/src/features/cv-editor/components/PhotoUploadCropModal')) {
            return 'modal-photo-crop';
          }
          if (normalizedId.includes('/src/pages/AdminPaymentsPage')) {
            return 'page-admin-payments';
          }

          // Template Chunks
          if (normalizedId.includes('/src/templates/onepage/')) {
            return 'templates-onepage';
          }
          if (
            normalizedId.includes('/src/templates/') &&
            !normalizedId.includes('/src/templates/index') &&
            !normalizedId.includes('/src/templates/shared/')
          ) {
            return 'templates-multipage';
          }

          // Core Vendor Libraries
          if (normalizedId.includes('/node_modules/')) {
            if (
              normalizedId.includes('/react/') ||
              normalizedId.includes('/react-dom/') ||
              normalizedId.includes('/react-router/') ||
              normalizedId.includes('/react-router-dom/') ||
              normalizedId.includes('/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (
              normalizedId.includes('/@reduxjs/') ||
              normalizedId.includes('/react-redux/')
            ) {
              return 'vendor-redux';
            }
            if (normalizedId.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            if (normalizedId.includes('/@dnd-kit/')) {
              return 'vendor-dnd';
            }
            if (
              normalizedId.includes('/docx/') ||
              normalizedId.includes('/jspdf/') ||
              normalizedId.includes('/html2canvas/') ||
              normalizedId.includes('/html2pdf.js/') ||
              normalizedId.includes('/file-saver/')
            ) {
              return 'vendor-export';
            }
            if (
              normalizedId.includes('/framer-motion/') ||
              normalizedId.includes('/canvas-confetti/')
            ) {
              return 'vendor-animation';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
