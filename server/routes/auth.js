const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { fail } = require('../utils/respond');
const wrap = require('../utils/wrap');
const { str, isEmail, isPhone } = require('../utils/validate');
const { ROLES } = require('../utils/constants');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post(
  '/register',
  wrap(async (req, res) => {
    const b = req.body || {};
    const name = str(b.name);
    const email = str(b.email).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    const phone = str(b.phone);
    const state = str(b.state);
    const district = str(b.district);
    const address = str(b.address).slice(0, 300);

    if (name.length < 2 || name.length > 80) return fail(res, 400, 'VALIDATION', 'Enter your name', 'name');
    if (!isEmail(email)) return fail(res, 400, 'VALIDATION', 'Enter a valid email', 'email');
    if (password.length < 6) return fail(res, 400, 'VALIDATION', 'Password must be at least 6 characters', 'password');
    if (!ROLES.includes(b.role)) return fail(res, 400, 'VALIDATION', 'Choose an account type', 'role');
    if (!isPhone(phone)) return fail(res, 400, 'VALIDATION', 'Enter a valid 10 digit mobile number', 'phone');
    if (b.role === 'farmer' && !state) return fail(res, 400, 'VALIDATION', 'State is required', 'state');
    if (b.role === 'farmer' && !district) return fail(res, 400, 'VALIDATION', 'District is required', 'district');

    if (await User.exists({ email })) return fail(res, 409, 'EMAIL_EXISTS', 'Email is already registered', 'email');

    const user = await User.create({ name, email, password, role: b.role, phone, state, district, address });
    res.status(201).json({ token: sign(user._id), user });
  })
);

router.post(
  '/login',
  wrap(async (req, res) => {
    const b = req.body || {};
    const email = str(b.email).toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    if (!email || !password) return fail(res, 400, 'INVALID_CREDENTIALS', 'Invalid email or password');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    res.json({ token: sign(user._id), user });
  })
);

router.get(
  '/me',
  protect,
  wrap(async (req, res) => {
    res.json({ user: req.user });
  })
);

router.put(
  '/profile',
  protect,
  wrap(async (req, res) => {
    const b = req.body || {};
    const phone = b.phone === undefined ? req.user.phone : str(b.phone);
    if (!isPhone(phone)) return fail(res, 400, 'VALIDATION', 'Enter a valid 10 digit mobile number', 'phone');
    const name = b.name === undefined ? req.user.name : str(b.name);
    if (name.length < 2) return fail(res, 400, 'VALIDATION', 'Enter your name', 'name');
    req.user.name = name;
    req.user.phone = phone;
    if (b.state !== undefined) req.user.state = str(b.state);
    if (b.district !== undefined) req.user.district = str(b.district);
    if (b.address !== undefined) req.user.address = str(b.address).slice(0, 300);
    await req.user.save();
    res.json({ user: req.user });
  })
);

module.exports = router;
