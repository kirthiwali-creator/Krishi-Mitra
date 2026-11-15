const mongoose = require('mongoose');
const { ORDER_STATUSES } = require('../utils/constants');

const orderSchema = new mongoose.Schema(
  {
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    cropName: { type: String, required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quantityKg: { type: Number, required: true, min: 1 },
    pricePerKg: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    deliveryAddress: { type: String, required: true, trim: true, maxlength: 300 },
    contactPhone: { type: String, required: true, trim: true },
    note: { type: String, trim: true, maxlength: 300, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
