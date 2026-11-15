const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Crop = require('../models/Crop');
const { protect, allow } = require('../middleware/auth');
const { fail } = require('../utils/respond');
const wrap = require('../utils/wrap');
const { str, isPhone } = require('../utils/validate');
const { ORDER_STATUSES } = require('../utils/constants');

const FARMER_FLOW = { pending: ['accepted', 'rejected'], accepted: ['shipped'], shipped: ['delivered'] };
const BUYER_FLOW = { pending: ['cancelled'] };

router.use(protect);

router.post(
  '/',
  allow('buyer'),
  wrap(async (req, res) => {
    const b = req.body || {};
    if (!mongoose.isValidObjectId(b.cropId)) return fail(res, 400, 'VALIDATION', 'Crop is required', 'cropId');
    const qty = Number(b.quantityKg);
    if (!Number.isInteger(qty) || qty < 1) return fail(res, 400, 'VALIDATION', 'Enter a whole number of kg', 'quantityKg');
    const deliveryAddress = str(b.deliveryAddress);
    if (deliveryAddress.length < 5 || deliveryAddress.length > 300) {
      return fail(res, 400, 'VALIDATION', 'Enter a delivery address', 'deliveryAddress');
    }
    const contactPhone = str(b.contactPhone);
    if (!isPhone(contactPhone)) return fail(res, 400, 'VALIDATION', 'Enter a valid 10 digit mobile number', 'contactPhone');
    const note = str(b.note).slice(0, 300);

    const crop = await Crop.findById(b.cropId);
    if (!crop || !crop.isActive) return fail(res, 404, 'NOT_FOUND', 'Crop not found');
    if (qty < crop.minOrderKg) return fail(res, 400, 'MIN_ORDER', 'Below minimum order quantity', 'quantityKg');

    const updated = await Crop.findOneAndUpdate(
      { _id: crop._id, isActive: true, quantityKg: { $gte: qty } },
      { $inc: { quantityKg: -qty } },
      { new: true }
    );
    if (!updated) return fail(res, 400, 'INSUFFICIENT_STOCK', 'Not enough stock available', 'quantityKg');

    try {
      const order = await Order.create({
        crop: updated._id,
        cropName: updated.name,
        buyer: req.user._id,
        farmer: updated.farmer,
        quantityKg: qty,
        pricePerKg: updated.pricePerKg,
        totalPrice: Math.round(qty * updated.pricePerKg * 100) / 100,
        deliveryAddress,
        contactPhone,
        note
      });
      res.status(201).json({ order });
    } catch (err) {
      await Crop.updateOne({ _id: updated._id }, { $inc: { quantityKg: qty } });
      throw err;
    }
  })
);

router.get(
  '/mine',
  wrap(async (req, res) => {
    const isFarmer = req.user.role === 'farmer';
    const filter = isFarmer ? { farmer: req.user._id } : { buyer: req.user._id };
    if (ORDER_STATUSES.includes(req.query.status)) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate(isFarmer ? 'buyer' : 'farmer', 'name phone state district')
      .populate('crop', 'name category imageUrl');
    res.json({ orders });
  })
);

router.patch(
  '/:id/status',
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 404, 'NOT_FOUND', 'Order not found');
    const order = await Order.findById(req.params.id);
    if (!order) return fail(res, 404, 'NOT_FOUND', 'Order not found');

    const me = String(req.user._id);
    const isFarmer = req.user.role === 'farmer' && String(order.farmer) === me;
    const isBuyer = req.user.role === 'buyer' && String(order.buyer) === me;
    if (!isFarmer && !isBuyer) return fail(res, 403, 'FORBIDDEN', 'Not allowed for this order');

    const next = (req.body || {}).status;
    const flow = isFarmer ? FARMER_FLOW : BUYER_FLOW;
    if (!(flow[order.status] || []).includes(next)) {
      return fail(res, 400, 'INVALID_TRANSITION', 'This status change is not allowed');
    }

    const updated = await Order.findOneAndUpdate({ _id: order._id, status: order.status }, { status: next }, { new: true });
    if (!updated) return fail(res, 409, 'INVALID_TRANSITION', 'Order was already updated');

    if (next === 'rejected' || next === 'cancelled') {
      await Crop.updateOne({ _id: order.crop }, { $inc: { quantityKg: order.quantityKg } });
    }
    res.json({ order: updated });
  })
);

module.exports = router;
