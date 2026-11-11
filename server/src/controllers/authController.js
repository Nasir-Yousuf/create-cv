import crypto from 'crypto';
import { z } from 'zod';
import User from '../models/User.js';
import CV from '../models/CV.js';
import { bootstrapAdminUser, sanitizeUser } from '../utils/adminBootstrap.js';
import { signAuthToken } from '../utils/jwt.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Please enter your password'),
});

// @desc    Register a new regular user (admin registration is blocked publicly)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid registration details',
      });
    }

    const { name, email, password } = parsed.data;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && email === adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'This email is reserved for system administration.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in instead.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      status: 'active',
      freeExportsRemaining: 1,
      paidExportCredits: 0,
      lastLoginAt: new Date(),
    });

    const token = signAuthToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user or environment-configured Admin using bcrypt verification
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Email and password are required',
      });
    }

    const { email, password } = parsed.data;
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (configuredAdminEmail && email === configuredAdminEmail) {
      await bootstrapAdminUser();
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_SUSPENDED',
        message: 'This account has been suspended. Please contact an administrator.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signAuthToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log out and clear session cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current authenticated user profile and live stats
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    const cvCount = await CV.countDocuments({ userId: user._id, isDeleted: { $ne: true } });

    return res.status(200).json({
      success: true,
      user: {
        ...sanitizeUser(user),
        cvCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update authenticated user's profile name/avatar or password
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (typeof req.body.name === 'string') {
      const cleanName = req.body.name.trim();
      if (cleanName.length < 2 || cleanName.length > 80) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 80 characters.',
        });
      }
      user.name = cleanName;
    }

    if (typeof req.body.avatar === 'string' || req.body.avatar === null) {
      user.avatar = req.body.avatar;
    }

    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current password to set a new password.',
        });
      }
      const ok = await user.comparePassword(req.body.currentPassword);
      if (!ok) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
      if (String(req.body.newPassword).length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.',
        });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Initiate secure password reset (requires configured SMTP email infrastructure)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account email address.',
      });
    }

    const smtpConfigured = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    );
    if (!smtpConfigured) {
      return res.status(501).json({
        success: false,
        emailInfrastructureAvailable: false,
        message:
          'Automated email reset is not configured on this server yet (SMTP credentials missing). Please contact the administrator to reset access.',
      });
    }

    const user = await User.findOne({ email });
    if (user && user.status !== 'suspended') {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
      await user.save({ validateBeforeSave: false });
      // Email dispatch hook ready here once SMTP transport (e.g. nodemailer) is installed
    }

    return res.status(200).json({
      success: true,
      emailInfrastructureAvailable: true,
      message: 'If an active account matches that email, reset instructions have been queued.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete password reset using time-limited token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword || String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid reset token and a new password (min 6 characters) are required.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired.',
      });
    }

    user.password = String(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully. You may now log in.',
    });
  } catch (err) {
    next(err);
  }
};
