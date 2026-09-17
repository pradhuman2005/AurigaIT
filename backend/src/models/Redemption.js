const mongoose = require('mongoose');

const redemptionSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  rewardName: { type: String, required: true },
  pointsUsed: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Redemption', redemptionSchema);
