const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const NotificationOutbox = require('../models/NotificationOutbox');
const mongoose = require('mongoose');
const { calculatePoints, calculateTier } = require('../services/pointsService');

const createPurchase = asyncHandler(async (req, res) => {
  const { memberId, amount } = req.body;
  if (!memberId || !amount || amount <= 0) {
    res.status(400);
    throw new Error('Valid memberId and amount (> 0) are required');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  // Business Logic
  const tierAtPurchase = member.tier;
  const pointsEarned = calculatePoints(amount, tierAtPurchase);
  
  const newCurrentPoints = member.currentPoints + pointsEarned;
  const newLifetimePoints = member.lifetimePoints + pointsEarned;
  const newTier = calculateTier(newLifetimePoints);

  const purchase = new Purchase({
    memberId: member._id,
    amount,
    pointsEarned,
    tierAtPurchase
  });
  await purchase.save();

  member.currentPoints = newCurrentPoints;
  member.lifetimePoints = newLifetimePoints;
  member.tier = newTier;
  await member.save();

  if (pointsEarned > 0) {
    const transaction = new Transaction({
      memberId: member._id,
      type: 'EARN',
      points: pointsEarned,
      remainingPoints: pointsEarned, // Twist 2 FIFO expiry tracking
      referenceType: 'Purchase',
      referenceId: purchase._id,
      balanceAfter: member.currentPoints
    });
    await transaction.save();
  }

  // Twist 3: Tier Upgrade Notification via Outbox
  if (newTier !== tierAtPurchase) {
    try {
      await NotificationOutbox.create({
        memberId: member._id,
        type: 'TIER_UPGRADE',
        payload: {
          previousTier: tierAtPurchase,
          newTier: newTier,
          lifetimePoints: newLifetimePoints,
          upgradedAt: new Date() // Keeping real date for audit
        },
        status: 'PENDING'
      });
    } catch (outboxError) {
      // Do not block purchase on outbox failure, just log it
      console.error('Failed to create outbox entry for tier upgrade:', outboxError);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Purchase recorded successfully',
    data: {
      member: {
        id: member._id,
        name: member.name,
        currentPoints: member.currentPoints,
        lifetimePoints: member.lifetimePoints,
        tier: member.tier
      },
      purchase: {
        id: purchase._id,
        amount: purchase.amount,
        pointsEarned: purchase.pointsEarned
      }
    }
  });
});

module.exports = { createPurchase };
