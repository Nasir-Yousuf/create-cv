import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Strips all confidential fields before returning any user payload over API.
 */
export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const u = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
  return {
    _id: String(u._id),
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role === 'admin' ? 'admin' : 'user',
    status: u.status || 'active',
    freeExportsRemaining: typeof u.freeExportsRemaining === 'number' ? u.freeExportsRemaining : 1,
    paidExportCredits: typeof u.paidExportCredits === 'number' ? u.paidExportCredits : 0,
    totalExports: typeof u.totalExports === 'number' ? u.totalExports : 0,
    plan: u.plan || 'free',
    avatar: u.avatar || null,
    lastLoginAt: u.lastLoginAt || null,
    createdAt: u.createdAt || null,
  };
};

/**
 * Bootstraps or synchronizes the environment-configured Admin account in MongoDB
 * using bcrypt hashing on startup — never compares plaintext env passwords during login requests.
 */
export const bootstrapAdminUser = async () => {
  if (mongoose.connection.readyState !== 1) return null;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env; admin bootstrap skipped.');
    return null;
  }

  let adminUser = await User.findOne({ email: adminEmail }).select('+password');

  if (!adminUser) {
    adminUser = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: adminPassword, // pre('save') hook hashes securely with bcrypt
      role: 'admin',
      status: 'active',
      plan: 'enterprise',
      freeExportsRemaining: 999999,
      paidExportCredits: 999999,
    });
    console.log(`🔐 Bootstrapped dedicated admin account (${adminEmail})`);
    return sanitizeUser(adminUser);
  }

  let modified = false;
  if (adminUser.role !== 'admin') {
    adminUser.role = 'admin';
    modified = true;
  }
  if (adminUser.status !== 'active') {
    adminUser.status = 'active';
    modified = true;
  }
  const passwordMatchesEnv = await adminUser.comparePassword(adminPassword);
  if (!passwordMatchesEnv) {
    adminUser.password = adminPassword; // re-hashes cleanly only when env password changed
    modified = true;
  }
  if (adminUser.freeExportsRemaining < 999) {
    adminUser.freeExportsRemaining = 999999;
    adminUser.paidExportCredits = 999999;
    modified = true;
  }

  if (modified) {
    await adminUser.save();
    console.log(`🔐 Synchronized dedicated admin credentials (${adminEmail})`);
  }

  return sanitizeUser(adminUser);
};

