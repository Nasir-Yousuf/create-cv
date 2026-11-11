import User from '../models/User.js';
import { verifyAuthToken } from '../utils/jwt.js';

export const extractRequestToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const authGuard = async (req, res, next) => {
  const token = extractRequestToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_REQUIRED',
      message: 'Authentication required. Please log in to continue.',
    });
  }

  try {
    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_SESSION',
        message: 'Account not found. Please log in again.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended by an administrator. Contact support for assistance.',
      });
    }

    req.user = {
      id: String(user._id),
      _id: user._id,
      role: user.role === 'admin' ? 'admin' : 'user',
      status: user.status,
      email: user.email,
      name: user.name,
      freeExportsRemaining: user.freeExportsRemaining,
      paidExportCredits: user.paidExportCredits,
      plan: user.plan,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      code: 'SESSION_EXPIRED',
      message: 'Session expired or invalid token. Please log in again.',
    });
  }
};

export const adminGuard = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    code: 'ADMIN_REQUIRED',
    message: 'Access denied. Administrator privileges required.',
  });
};

export default authGuard;
