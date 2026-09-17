const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  type: { type: String, enum: ['EARN', 'REDEEM'], required: true },
  points: { type: Number, required: true },
  referenceType: { type: String, enum: ['Purchase', 'Redemption'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  balanceAfter: { type: Number, required: true },
}, { timestamps: true });

transactionSchema.index({ memberId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
