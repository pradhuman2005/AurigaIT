const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const Transaction = require('../models/Transaction');

const createRedemption = asyncHandler(async (req, res) => {
  const { memberId, rewardId } = req.body;
  
  if (!memberId || !rewardId) {
    res.status(400);
    throw new Error('memberId and rewardId are required');
  }

  const reward = await Reward.findById(rewardId);
  if (!reward || !reward.active) {
    res.status(404);
    throw new Error('Reward not found or inactive');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.currentPoints < reward.pointsCost) {
    res.status(409); // Conflict
    throw new Error('Insufficient points for this reward');
  }

  // Atomic update protection without transactions for standalone mongo
  const updatedMember = await Member.findOneAndUpdate(
    { _id: member._id, currentPoints: { $gte: reward.pointsCost } },
    { $inc: { currentPoints: -reward.pointsCost } },
    { new: true }
  );

  if (!updatedMember) {
    res.status(409);
    throw new Error('Insufficient points due to concurrent transaction');
  }

  const redemption = new Redemption({
    memberId: member._id,
    rewardId: reward._id,
    rewardName: reward.name,
    pointsUsed: reward.pointsCost
  });
  await redemption.save();

  const transaction = new Transaction({
    memberId: member._id,
    type: 'REDEEM',
    points: -reward.pointsCost,
    referenceType: 'Redemption',
    referenceId: redemption._id,
    balanceAfter: updatedMember.currentPoints
  });
  await transaction.save();

  res.status(201).json({
    success: true,
    message: 'Reward redeemed successfully',
    data: {
      member: {
        id: updatedMember._id,
        name: updatedMember.name,
        currentPoints: updatedMember.currentPoints,
        lifetimePoints: updatedMember.lifetimePoints,
        tier: updatedMember.tier
      },
      redemption: {
        id: redemption._id,
        rewardName: redemption.rewardName,
        pointsUsed: redemption.pointsUsed
      }
    }
  });
});

module.exports = { createRedemption };
