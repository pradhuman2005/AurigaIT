const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const Transaction = require('../models/Transaction');
const SystemClock = require('../models/SystemClock');

const createRedemption = asyncHandler(async (req, res) => {
  const { memberId, rewardId } = req.body;
  if (!memberId || !rewardId) {
    res.status(400);
    throw new Error('memberId and rewardId are required');
  }

  const reward = await Reward.findById(rewardId);
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }

  const cost = reward.pointsCost;

  // Use an atomic update to safely deduct points and prevent double spending
  const member = await Member.findOneAndUpdate(
    { _id: memberId, currentPoints: { $gte: cost } },
    { $inc: { currentPoints: -cost } },
    { new: true }
  );

  if (!member) {
    res.status(400);
    throw new Error('Insufficient points or member not found');
  }

  const redemption = new Redemption({
    memberId: member._id,
    rewardId: reward._id,
    pointsUsed: cost
  });
  await redemption.save();

  // Twist 2: FIFO deduction from EARN transactions
  let pointsToDeduct = cost;
  
  // Need to get virtual clock for expiry threshold check, though we technically
  // just need to find active EARN transactions with remainingPoints > 0.
  let clock = await SystemClock.findById('clock');
  const virtualClockDate = clock ? clock.currentTime : new Date();
  const expiryThreshold = new Date(virtualClockDate);
  expiryThreshold.setDate(expiryThreshold.getDate() - 90);

  // Find all unexpired EARN transactions that have remaining points
  const activeEarnTx = await Transaction.find({
    memberId: member._id,
    type: 'EARN',
    remainingPoints: { $gt: 0 },
    createdAt: { $gt: expiryThreshold }
  }).sort({ createdAt: 1 }); // ASC order for FIFO

  for (const tx of activeEarnTx) {
    if (pointsToDeduct <= 0) break;
    
    if (tx.remainingPoints <= pointsToDeduct) {
      pointsToDeduct -= tx.remainingPoints;
      tx.remainingPoints = 0;
    } else {
      tx.remainingPoints -= pointsToDeduct;
      pointsToDeduct = 0;
    }
    await tx.save();
  }

  const transaction = new Transaction({
    memberId: member._id,
    type: 'REDEEM',
    points: -cost,
    description: `Redeemed ${reward.name}`,
    remainingPoints: 0,
    referenceType: 'Redemption',
    referenceId: redemption._id,
    balanceAfter: member.currentPoints
  });
  await transaction.save();

  res.status(201).json({
    success: true,
    message: 'Reward redeemed successfully',
    data: {
      member: {
        id: member._id,
        currentPoints: member.currentPoints
      },
      redemption: {
        id: redemption._id,
        rewardName: reward.name,
        pointsUsed: cost
      }
    }
  });
});

module.exports = { createRedemption };
