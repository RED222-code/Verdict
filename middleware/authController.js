const crypto = require('crypto');
const { AppError, catchAsync } = require('../utils');
const User = require('../models/userModel');

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  const parts = token.split('.');
  if (parts.length !== 3) throw new AppError('Invalid authentication token', 401);

  const [header, payload, signature] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new AppError('Invalid authentication token', 401);
  }

  const decoded = JSON.parse(base64UrlDecode(payload));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new AppError('Expired authentication token', 401);
  }

  return decoded;
}

exports.protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No authentication token', 401));
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(error);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed recently. Please log in again.', 401));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
