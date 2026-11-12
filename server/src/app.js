import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { isDBConnected } from './config/db.js';

const app = express();

// Trust reverse proxies (Vercel / Render / Cloudflare) so IP & protocol headers work reliably
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Dynamic CORS configuration supporting localhost, CLIENT_URL, and Vercel preview/production hosts
const staticAllowedOrigins = new Set(
  [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
  ]
    .filter(Boolean)
    .map((u) => u.trim().replace(/\/+$/, ''))
);

app.use((req, res, next) =>
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (staticAllowedOrigins.has(normalizedOrigin)) {
        return callback(null, true);
      }
      try {
        const originHost = new URL(origin).host;
        const reqHost = req.headers['x-forwarded-host'] || req.headers.host;
        if (reqHost && originHost === reqHost) {
          return callback(null, true);
        }
      } catch (_) {}
      return callback(Object.assign(new Error('Origin not allowed by CORS policy'), { status: 403 }));
    },
    credentials: true,
    exposedHeaders: ['X-CV-Id', 'X-Unlock-Type', 'X-Export-Request-Id'],
  })(req, res, next)
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request parsers with 50mb limit for high-res photo uploads and rich template HTML
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbConnected: isDBConnected(),
    timestamp: new Date().toISOString(),
    service: 'NovaCV Backend API',
  });
});

// Clear 503 response on database-backed endpoints when MongoDB is not connected
const requireDatabase = (req, res, next) => {
  if (isDBConnected()) return next();
  return res.status(503).json({
    success: false,
    code: 'DB_UNAVAILABLE',
    message:
      'Database connection is unavailable on the server. Ensure MONGODB_URI is configured and MongoDB Atlas Network Access permits 0.0.0.0/0.',
  });
};

// Mount Routes
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/cvs', requireDatabase, cvRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/export', requireDatabase, exportRoutes);
app.use('/api/payment', requireDatabase, paymentRoutes);
app.use('/api/admin', requireDatabase, adminRoutes);

// 404 Handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
