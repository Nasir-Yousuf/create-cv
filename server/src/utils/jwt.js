import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable must be set in production.');
  }
  return 'dev_only_fallback_secret_change_in_env';
};

export const signAuthToken = (user) =>
  jwt.sign(
    {
      id: user._id ? String(user._id) : String(user.id),
      role: user.role || 'user',
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

