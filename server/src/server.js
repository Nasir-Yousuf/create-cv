import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from './app.js';
import { ensureBackendReady } from './utils/backendInit.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await ensureBackendReady();

  const server = app.listen(PORT, () => {
    console.log(`🚀 NovaCV Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 API Health Check available at http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
  });
};

startServer();

