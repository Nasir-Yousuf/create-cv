import app from '../server/src/app.js';
import { ensureBackendReady } from '../server/src/utils/backendInit.js';

export default async function handler(req, res) {
  await ensureBackendReady();
  return app(req, res);
}
