const mongoose = require('mongoose');

const notificationOutboxSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  type: { type: String, enum: ['TIER_UPGRADE'], required: true },
  payload: {
    previousTier: String,
    newTier: String,
    lifetimePoints: Number,
    upgradedAt: Date
  },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  sentAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('NotificationOutbox', notificationOutboxSchema);
