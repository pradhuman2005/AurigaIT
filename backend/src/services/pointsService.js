const getTierMultiplier = (tier) => {
  switch (tier) {
    case 'Bronze': return 1.0;
    case 'Silver': return 1.25;
    case 'Gold': return 1.5;
    default: return 1.0;
  }
};

const calculatePoints = (purchaseAmount, tier) => {
  const multiplier = getTierMultiplier(tier);
  return Math.floor((purchaseAmount / 10) * multiplier);
};

const calculateTier = (lifetimePoints) => {
  if (lifetimePoints >= 1000) return 'Gold';
  if (lifetimePoints >= 500) return 'Silver';
  return 'Bronze';
};

module.exports = {
  getTierMultiplier,
  calculatePoints,
  calculateTier,
};
