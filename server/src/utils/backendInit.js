import connectDB, { isDBConnected } from '../config/db.js';
import { bootstrapAdminUser } from './adminBootstrap.js';
import { seedTemplates } from '../controllers/templateController.js';

let initialized = false;
let initPromise = null;

/**
 * Ensures MongoDB connection, admin bootstrap, and canonical templates are initialized
 * once per server process or warm serverless container. Safe under concurrent calls.
 */
export const ensureBackendReady = async () => {
  await connectDB();

  if (!isDBConnected()) {
    initialized = false;
    return false;
  }

  if (initialized) {
    return true;
  }

  if (!initPromise) {
    initPromise = (async () => {
      await bootstrapAdminUser();
      await seedTemplates();
      initialized = true;
    })()
      .catch((err) => {
        console.error('Backend initialization warning:', err.message);
        initialized = false;
      })
      .finally(() => {
        initPromise = null;
      });
  }

  await initPromise;
  return isDBConnected();
};

export default ensureBackendReady;
