const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  type: { type: String, enum: ['EARN', 'REDEEM', 'EXPIRE'], required: true },
  points: { type: Number, required: true },
  remainingPoints: { type: Number, default: 0 },
  referenceType: { type: String, enum: ['Purchase', 'Redemption', 'Expiry'], required: true },
  referenceId: { type: mongoose.Schema.Types.Mixed }, // Made Mixed because Expiry might not have a specific ID, or could be a job run ID
  balanceAfter: { type: Number, required: true },
}, { timestamps: true });

transactionSchema.index({ memberId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
