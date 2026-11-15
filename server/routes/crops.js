const router = require('express').Router();
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const { protect, allow } = require('../middleware/auth');
const { fail } = require('../utils/respond');
const wrap = require('../utils/wrap');
const { str } = require('../utils/validate');
const { CATEGORIES } = require('../utils/constants');

const FIELDS = [
  'name',
  'category',
  'description',
  'pricePerKg',
  'quantityKg',
  'minOrderKg',
  'state',
  'district',
  'harvestDate',
  'organic',
  'imageUrl',
  'isActive'
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readCrop = (body, base) => {
  const v = { ...base };
  FIELDS.forEach((k) => {
    if (body[k] !== undefined) v[k] = body[k];
  });

  const name = str(v.name);
  if (name.length < 2 || name.length > 80) return { field: 'name' };
  if (!CATEGORIES.includes(v.category)) return { field: 'category' };
  const price = Number(v.pricePerKg);
  if (!(price > 0 && price <= 100000)) return { field: 'pricePerKg' };
  const qty = Number(v.quantityKg);
  if (!Number.isInteger(qty) || qty < 0 || qty > 10000000) return { field: 'quantityKg' };
  const min = Number(v.minOrderKg);
  if (!Number.isInteger(min) || min < 1) return { field: 'minOrderKg' };
  const state = str(v.state);
  if (!state) return { field: 'state' };
  const district = str(v.district);
  if (!district) return { field: 'district' };

  let harvestDate = null;
  if (v.harvestDate) {
    harvestDate = new Date(v.harvestDate);
    if (Number.isNaN(harvestDate.getTime())) return { field: 'harvestDate' };
  }
  const imageUrl = str(v.imageUrl);
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) return { field: 'imageUrl' };

  return {
    data: {
      name,
      category: v.category,
      description: str(v.description).slice(0, 600),
      pricePerKg: Math.round(price * 100) / 100,
      quantityKg: qty,
      minOrderKg: min,
      state,
      district,
      harvestDate,
      organic: v.organic === true || v.organic === 'true',
      imageUrl,
      isActive: v.isActive === undefined ? true : v.isActive === true || v.isActive === 'true'
    }
  };
};

router.get(
  '/filters',
  wrap(async (req, res) => {
    const states = await Crop.distinct('state', { isActive: true, quantityKg: { $gt: 0 } });
    res.json({ states: states.sort(), categories: CATEGORIES });
  })
);

router.get(
  '/mine',
  protect,
  allow('farmer'),
  wrap(async (req, res) => {
    const crops = await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ crops });
  })
);

router.get(
  '/',
  wrap(async (req, res) => {
    const { q, category, state, district, organic, minPrice, maxPrice, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 48);

    const filter = { isActive: true, quantityKg: { $gt: 0 } };
    if (typeof q === 'string' && q.trim()) {
      const re = new RegExp(escapeRe(q.trim().slice(0, 60)), 'i');
      filter.$or = [{ name: re }, { description: re }, { district: re }, { state: re }];
    }
    if (CATEGORIES.includes(category)) filter.category = category;
    if (typeof state === 'string' && state.trim()) {
      filter.state = new RegExp('^' + escapeRe(state.trim()) + '$', 'i');
    }
    if (typeof district === 'string' && district.trim()) {
      filter.district = new RegExp('^' + escapeRe(district.trim()) + '$', 'i');
    }
    if (organic === 'true') filter.organic = true;

    const price = {};
    if (minPrice !== undefined && minPrice !== '' && !Number.isNaN(Number(minPrice))) price.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(Number(maxPrice))) price.$lte = Number(maxPrice);
    if (Object.keys(price).length) filter.pricePerKg = price;

    const sorts = {
      newest: { createdAt: -1 },
      priceLow: { pricePerKg: 1 },
      priceHigh: { pricePerKg: -1 },
      quantity: { quantityKg: -1 }
    };

    const [crops, total] = await Promise.all([
      Crop.find(filter)
        .sort(sorts[sort] || sorts.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('farmer', 'name state district'),
      Crop.countDocuments(filter)
    ]);
    res.json({ crops, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  })
);

router.get(
  '/:id',
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name state district');
    if (!crop || !crop.isActive) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    res.json({ crop });
  })
);

router.post(
  '/',
  protect,
  allow('farmer'),
  wrap(async (req, res) => {
    const base = { state: req.user.state, district: req.user.district, minOrderKg: 1, organic: false, isActive: true };
    const result = readCrop(req.body || {}, base);
    if (result.field) return fail(res, 400, 'VALIDATION', 'Invalid value for ' + result.field, result.field);
    const crop = await Crop.create({ ...result.data, farmer: req.user._id });
    res.status(201).json({ crop });
  })
);

router.put(
  '/:id',
  protect,
  allow('farmer'),
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!crop) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    const result = readCrop(req.body || {}, crop.toObject());
    if (result.field) return fail(res, 400, 'VALIDATION', 'Invalid value for ' + result.field, result.field);
    Object.assign(crop, result.data);
    await crop.save();
    res.json({ crop });
  })
);

router.delete(
  '/:id',
  protect,
  allow('farmer'),
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!crop) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    const open = await Order.countDocuments({ crop: crop._id, status: { $in: ['pending', 'accepted', 'shipped'] } });
    if (open > 0) return fail(res, 400, 'HAS_OPEN_ORDERS', 'This crop has open orders');
    await crop.deleteOne();
    res.json({ ok: true });
  })
);

module.exports = router;
