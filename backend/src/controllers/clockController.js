const asyncHandler = require('express-async-handler');
const SystemClock = require('../models/SystemClock');
const { expirePointsJob } = require('../jobs/expirePointsJob');

// GET /api/clock
const getClock = asyncHandler(async (req, res) => {
  let clock = await SystemClock.findById('clock');
  if (!clock) {
    clock = await SystemClock.create({ _id: 'clock', currentTime: new Date() });
  }
  res.json({
    success: true,
    data: {
      currentVirtualTime: clock.currentTime
    }
  });
});

// POST /api/clock
const advanceClock = asyncHandler(async (req, res) => {
  const { date } = req.body;
  if (!date) {
    res.status(400);
    throw new Error('date is required');
  }

  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) {
    res.status(400);
    throw new Error('Invalid date format');
  }

  let clock = await SystemClock.findById('clock');
  if (!clock) {
    clock = await SystemClock.create({ _id: 'clock', currentTime: new Date() });
  }

  if (newDate < clock.currentTime) {
    res.status(400);
    throw new Error('Cannot move virtual clock backwards');
  }

  clock.currentTime = newDate;
  await clock.save();

  // Run the expiry job synchronously for deterministic grading
  const expiryResults = await expirePointsJob(clock.currentTime);

  res.json({
    success: true,
    data: {
      currentVirtualTime: clock.currentTime,
      expiryResults
    }
  });
});

module.exports = { getClock, advanceClock };
