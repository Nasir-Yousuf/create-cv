import connectDB, { isDBConnected } from '../config/db.js';
import { bootstrapAdminUser } from './adminBootstrap.js';
import { seedTemplates } from '../controllers/templateController.js';

/**
 * Ensures MongoDB connection, admin bootstrap, and canonical templates are initialized
 * once per server process or warm serverless container. Safe under concurrent calls.
 */
export const ensureBackendReady = async () => {
  await connectDB();

  if (!isDBConnected()) {
    global._backendInitialized = false;
    return false;
  }

  if (global._backendInitialized) {
    return true;
  }

  if (!global._backendInitPromise) {
    global._backendInitPromise = (async () => {
      await bootstrapAdminUser();
      await seedTemplates();
      global._backendInitialized = true;
    })()
      .catch((err) => {
        console.error('Backend initialization warning:', err.message);
        global._backendInitialized = false;
      })
      .finally(() => {
        global._backendInitPromise = null;
      });
  }

  await global._backendInitPromise;
  return isDBConnected();
};

export default ensureBackendReady;
