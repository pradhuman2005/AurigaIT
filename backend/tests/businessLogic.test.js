const { getTierMultiplier, calculatePoints, calculateTier } = require('../src/services/pointsService');

describe('Points and Tier Business Logic', () => {
  describe('Tiers Multipliers', () => {
    it('Bronze should have 1.0 multiplier', () => {
      expect(getTierMultiplier('Bronze')).toBe(1.0);
    });
    it('Silver should have 1.25 multiplier', () => {
      expect(getTierMultiplier('Silver')).toBe(1.25);
    });
    it('Gold should have 1.5 multiplier', () => {
      expect(getTierMultiplier('Gold')).toBe(1.5);
    });
  });

  describe('Tier Calculation (Based on Lifetime Points)', () => {
    it('0 to 499 is Bronze', () => {
      expect(calculateTier(0)).toBe('Bronze');
      expect(calculateTier(499)).toBe('Bronze');
    });
    it('500 to 999 is Silver', () => {
      expect(calculateTier(500)).toBe('Silver');
      expect(calculateTier(999)).toBe('Silver');
    });
    it('1000 and above is Gold', () => {
      expect(calculateTier(1000)).toBe('Gold');
      expect(calculateTier(2500)).toBe('Gold');
    });
  });

  describe('Points Calculation', () => {
    it('Bronze earning (₹500 -> 50 pts)', () => {
      expect(calculatePoints(500, 'Bronze')).toBe(50);
    });
    it('Silver earning (₹500 -> 62 pts)', () => {
      // 500 / 10 * 1.25 = 62.5 -> floor -> 62
      expect(calculatePoints(500, 'Silver')).toBe(62);
    });
    it('Gold earning (₹500 -> 75 pts)', () => {
      // 500 / 10 * 1.5 = 75
      expect(calculatePoints(500, 'Gold')).toBe(75);
    });
    it('Points are always integers', () => {
      expect(calculatePoints(199, 'Silver')).toBe(24); // 19.9 * 1.25 = 24.875 -> 24
    });
  });
});
