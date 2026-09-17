jest.setTimeout(60000);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Member = require('../src/models/Member');
const Purchase = require('../src/models/Purchase');
const Transaction = require('../src/models/Transaction');
const NotificationOutbox = require('../src/models/NotificationOutbox');
const { createPurchase } = require('../src/controllers/purchaseController');

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
  await Purchase.deleteMany();
  await Transaction.deleteMany();
  await NotificationOutbox.deleteMany();
});

describe('Tier Upgrade Outbox (Twist 3)', () => {
  it('should create an outbox entry when a boundary is crossed (Bronze -> Silver)', async () => {
    // Member starts at 450 points (Bronze)
    const member = await Member.create({
      name: 'Test Member',
      phone: '1234567890',
      currentPoints: 450,
      lifetimePoints: 450,
      tier: 'Bronze'
    });

    // Make purchase of 500 Rs -> 50 points -> 500 lifetime -> Silver
    const req = { body: { memberId: member._id, amount: 500 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await createPurchase(req, res);

    const updatedMember = await Member.findById(member._id);
    expect(updatedMember.tier).toBe('Silver');

    // Verify exactly ONE outbox entry
    const outboxEntries = await NotificationOutbox.find();
    expect(outboxEntries.length).toBe(1);
    
    const entry = outboxEntries[0];
    expect(entry.memberId.toString()).toBe(member._id.toString());
    expect(entry.type).toBe('TIER_UPGRADE');
    expect(entry.payload.previousTier).toBe('Bronze');
    expect(entry.payload.newTier).toBe('Silver');
    expect(entry.status).toBe('PENDING');
  });

  it('should NOT create an outbox entry when no boundary is crossed', async () => {
    const member = await Member.create({
      name: 'Test Member',
      phone: '1234567890',
      currentPoints: 100,
      lifetimePoints: 100,
      tier: 'Bronze'
    });

    // Make purchase of 100 Rs -> 10 points -> 110 lifetime -> still Bronze
    const req = { body: { memberId: member._id, amount: 100 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await createPurchase(req, res);

    const outboxEntries = await NotificationOutbox.find();
    expect(outboxEntries.length).toBe(0);
  });

  it('should create exactly ONE outbox entry when skipping a tier (Bronze -> Gold)', async () => {
    const member = await Member.create({
      name: 'Test Member',
      phone: '1234567890',
      currentPoints: 100,
      lifetimePoints: 100,
      tier: 'Bronze'
    });

    // Purchase of 10000 Rs -> 1000 points -> 1100 lifetime -> Gold (skips Silver)
    const req = { body: { memberId: member._id, amount: 10000 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await createPurchase(req, res);

    const updatedMember = await Member.findById(member._id);
    expect(updatedMember.tier).toBe('Gold');

    const outboxEntries = await NotificationOutbox.find();
    expect(outboxEntries.length).toBe(1);
    
    const entry = outboxEntries[0];
    expect(entry.payload.previousTier).toBe('Bronze');
    expect(entry.payload.newTier).toBe('Gold');
  });
});
