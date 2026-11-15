const mongoose = require('mongoose');
const { CATEGORIES } = require('../utils/constants');

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    pricePerKg: { type: Number, required: true, min: 0.01 },
    quantityKg: { type: Number, required: true, min: 0 },
    minOrderKg: { type: Number, default: 1, min: 1 },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    harvestDate: { type: Date, default: null },
    organic: { type: Boolean, default: false },
    imageUrl: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

cropSchema.index({ isActive: 1, quantityKg: 1, createdAt: -1 });

module.exports = mongoose.model('Crop', cropSchema);
