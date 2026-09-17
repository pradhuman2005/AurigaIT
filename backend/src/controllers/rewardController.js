const asyncHandler = require('express-async-handler');
const Reward = require('../models/Reward');

const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({ active: true });
  res.json(rewards);
});

module.exports = { getRewards };
