const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  pointsEarned: { type: Number, required: true },
  tierAtPurchase: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
