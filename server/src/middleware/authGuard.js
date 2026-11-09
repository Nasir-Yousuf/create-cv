import jwt from 'jsonwebtoken';

export const authGuard = async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'cv_builder_secure_jwt_secret_token_key_2026_xyz'
    );
    req.user = decoded; // { id, role, plan }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or token invalid. Please log in again.',
    });
  }
};

export const adminGuard = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
  }
};

export default authGuard;

