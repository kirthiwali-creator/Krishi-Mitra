const router = require('express').Router();
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const wrap = require('../utils/wrap');
const { ORDER_STATUSES } = require('../utils/constants');

const summarize = (rows) => {
  const byStatus = {};
  const amounts = {};
  ORDER_STATUSES.forEach((s) => {
    byStatus[s] = 0;
    amounts[s] = 0;
  });
  rows.forEach((r) => {
    byStatus[r._id] = r.count;
    amounts[r._id] = r.amount;
  });
  const totalOrders = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return { byStatus, amounts, totalOrders };
};

router.get(
  '/stats',
  protect,
  wrap(async (req, res) => {
    const id = req.user._id;
    if (req.user.role === 'farmer') {
      const [crops, activeCrops, stock, rows] = await Promise.all([
        Crop.countDocuments({ farmer: id }),
        Crop.countDocuments({ farmer: id, isActive: true, quantityKg: { $gt: 0 } }),
        Crop.aggregate([
          { $match: { farmer: id, isActive: true } },
          { $group: { _id: null, kg: { $sum: '$quantityKg' } } }
        ]),
        Order.aggregate([
          { $match: { farmer: id } },
          { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$totalPrice' } } }
        ])
      ]);
      const s = summarize(rows);
      return res.json({
        role: 'farmer',
        crops,
        activeCrops,
        stockKg: stock.length ? stock[0].kg : 0,
        totalOrders: s.totalOrders,
        byStatus: s.byStatus,
        revenue: s.amounts.delivered
      });
    }
    const rows = await Order.aggregate([
      { $match: { buyer: id } },
      { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$totalPrice' } } }
    ]);
    const s = summarize(rows);
    res.json({
      role: 'buyer',
      totalOrders: s.totalOrders,
      byStatus: s.byStatus,
      spent: s.amounts.delivered
    });
  })
);

module.exports = router;
