const asyncHandler = require('express-async-handler');
const NotificationOutbox = require('../models/NotificationOutbox');
const SystemClock = require('../models/SystemClock');

// GET /api/outbox
const getOutbox = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const outbox = await NotificationOutbox.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await NotificationOutbox.countDocuments();

  res.json({
    success: true,
    data: outbox,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// GET /api/members/:id/outbox
const getMemberOutbox = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const outbox = await NotificationOutbox.find({ memberId: id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: outbox
  });
});

// POST /api/outbox/dispatch
const dispatchOutbox = asyncHandler(async (req, res) => {
  // Find all pending
  const pendingEntries = await NotificationOutbox.find({ status: 'PENDING' });
  
  let clock = await SystemClock.findById('clock');
  const virtualTime = clock ? clock.currentTime : new Date();

  let sentCount = 0;
  for (const entry of pendingEntries) {
    // Mock sending notification
    entry.status = 'SENT';
    entry.sentAt = virtualTime;
    await entry.save();
    sentCount++;
  }

  res.json({
    success: true,
    message: `Dispatched ${sentCount} notifications`,
    data: { sentCount }
  });
});

module.exports = {
  getOutbox,
  getMemberOutbox,
  dispatchOutbox
};
