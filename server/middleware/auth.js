const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fail } = require('../utils/respond');

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return fail(res, 401, 'AUTH_REQUIRED', 'Please log in');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return fail(res, 401, 'AUTH_REQUIRED', 'Please log in');
    req.user = user;
    next();
  } catch (err) {
    return fail(res, 401, 'AUTH_REQUIRED', 'Session expired, please log in again');
  }
};

exports.allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return fail(res, 403, 'FORBIDDEN', 'Not allowed for your account type');
  next();
};
