const Transaction = require('../models/Transaction');
const Member = require('../models/Member');

const expirePointsJob = async (virtualClockDate) => {
  const expiryThreshold = new Date(virtualClockDate);
  expiryThreshold.setDate(expiryThreshold.getDate() - 90);

  // Find all unexpired EARN transactions older than 90 days with remaining points > 0
  const expiredTransactions = await Transaction.find({
    type: 'EARN',
    remainingPoints: { $gt: 0 },
    createdAt: { $lte: expiryThreshold }
  });

  let totalMembersAffected = 0;
  let totalPointsExpired = 0;

  // Group by member to perform bulk operations efficiently
  const memberExpiryMap = {};

  for (const tx of expiredTransactions) {
    if (!memberExpiryMap[tx.memberId]) {
      memberExpiryMap[tx.memberId] = {
        totalExpired: 0,
        transactions: []
      };
    }
    memberExpiryMap[tx.memberId].totalExpired += tx.remainingPoints;
    memberExpiryMap[tx.memberId].transactions.push(tx);
  }

  for (const [memberId, data] of Object.entries(memberExpiryMap)) {
    const { totalExpired, transactions } = data;
    
    // Safely decrement member points
    const member = await Member.findOneAndUpdate(
      { _id: memberId, currentPoints: { $gte: totalExpired } },
      { $inc: { currentPoints: -totalExpired } },
      { new: true }
    );

    if (member) {
      // Mark transactions as fully expired
      for (const tx of transactions) {
        tx.remainingPoints = 0;
        await tx.save();
      }

      // Create ledger entry
      await Transaction.create({
        memberId: member._id,
        type: 'EXPIRE',
        points: -totalExpired, // Negative to show deduction
        remainingPoints: 0,
        referenceType: 'Expiry',
        referenceId: member._id, // Just using member ID as reference
        balanceAfter: member.currentPoints
      });

      totalMembersAffected++;
      totalPointsExpired += totalExpired;
    } else {
      // Edge case: Member didn't have enough points. 
      // In a real system we'd expire up to their balance.
      // The prompt says "never expire more points than currently exist in remainingPoints".
      // Since redemption deducts remainingPoints, this should mathematically be guaranteed.
      // But just in case, we log it.
      console.error(`Mismatch: member ${memberId} has less balance than expired points.`);
    }
  }

  return { totalMembersAffected, totalPointsExpired };
};

module.exports = { expirePointsJob };
