const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  currentPoints: { type: Number, required: true, default: 0, min: 0 },
  lifetimePoints: { type: Number, required: true, default: 0, min: 0 },
  tier: {
    type: String,
    required: true,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
}, { timestamps: true });

// Create index on phone
memberSchema.index({ phone: 1 });

module.exports = mongoose.model('Member', memberSchema);
