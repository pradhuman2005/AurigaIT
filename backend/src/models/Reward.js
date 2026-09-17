const mongoose = require('mongoose');

const rewardSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pointsCost: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
