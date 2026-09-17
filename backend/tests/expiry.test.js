jest.setTimeout(60000);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Member = require('../src/models/Member');
const Transaction = require('../src/models/Transaction');
const SystemClock = require('../src/models/SystemClock');
const { expirePointsJob } = require('../src/jobs/expirePointsJob');
const { createPurchase } = require('../src/controllers/purchaseController');
const { createRedemption } = require('../src/controllers/redemptionController');
const Reward = require('../src/models/Reward');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Member.deleteMany();
  await Transaction.deleteMany();
  await SystemClock.deleteMany();
  await Reward.deleteMany();
});

describe('Points Expiry (Twist 2)', () => {
  it('should expire exactly 100 points after 91 days without changing lifetime or tier', async () => {
    // 1. Setup member
    const member = await Member.create({
      name: 'Test Member',
      phone: '1234567890',
      currentPoints: 100,
      lifetimePoints: 100,
      tier: 'Bronze'
    });

    const earnDate = new Date('2024-01-01T10:00:00Z');
    
    // Create EARN transaction
    await Transaction.create({
      memberId: member._id,
      type: 'EARN',
      points: 100,
      remainingPoints: 100,
      referenceType: 'Purchase',
      referenceId: new mongoose.Types.ObjectId(),
      balanceAfter: 100,
      createdAt: earnDate
    });

    // 2. Advance clock to day 89 (no expiry)
    let virtualClock = new Date('2024-03-30T10:00:00Z'); // 89 days later
    let result = await expirePointsJob(virtualClock);
    expect(result.totalPointsExpired).toBe(0);

    let m = await Member.findById(member._id);
    expect(m.currentPoints).toBe(100);

    // 3. Advance to day 91
    virtualClock = new Date('2024-04-01T10:00:01Z'); // 91 days later
    result = await expirePointsJob(virtualClock);
    expect(result.totalPointsExpired).toBe(100);

    m = await Member.findById(member._id);
    expect(m.currentPoints).toBe(0);
    expect(m.lifetimePoints).toBe(100); // Unchanged
    expect(m.tier).toBe('Bronze'); // Unchanged

    // Verify EXPIRE transaction
    const expireTx = await Transaction.findOne({ type: 'EXPIRE' });
    expect(expireTx).toBeTruthy();
    expect(expireTx.points).toBe(-100);
  });

  it('should only expire remaining points if some were redeemed (FIFO)', async () => {
    // Setup member
    const member = await Member.create({
      name: 'Test Member 2',
      phone: '1234567891',
      currentPoints: 100,
      lifetimePoints: 100,
      tier: 'Bronze'
    });

    const reward = await Reward.create({
      name: 'Test Reward',
      pointsCost: 60
    });

    const earnDate = new Date('2024-01-01T10:00:00Z');
    
    // Create EARN transaction
    await Transaction.create({
      memberId: member._id,
      type: 'EARN',
      points: 100,
      remainingPoints: 100,
      referenceType: 'Purchase',
      referenceId: new mongoose.Types.ObjectId(),
      balanceAfter: 100,
      createdAt: earnDate // manually setting old date
    });

    // Mock clock for redemption
    await SystemClock.create({ _id: 'clock', currentTime: new Date('2024-02-01T10:00:00Z') });

    // Redeem 60 points using controller logic
    const req = { body: { memberId: member._id, rewardId: reward._id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await createRedemption(req, res);

    let m = await Member.findById(member._id);
    expect(m.currentPoints).toBe(40); // 100 - 60

    // Advance clock past 90 days from earnDate
    const virtualClock = new Date('2024-04-02T10:00:00Z');
    const result = await expirePointsJob(virtualClock);
    
    expect(result.totalPointsExpired).toBe(40);

    m = await Member.findById(member._id);
    expect(m.currentPoints).toBe(0);
    expect(m.lifetimePoints).toBe(100); // Still 100
  });
});
