require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Member = require('../models/Member');
const Reward = require('../models/Reward');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const Redemption = require('../models/Redemption');

const seedData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Member.deleteMany();
    await Reward.deleteMany();
    await Purchase.deleteMany();
    await Transaction.deleteMany();
    await Redemption.deleteMany();

    const staffUser = await User.create({
      name: 'Demo Staff',
      email: 'demo@caferewards.local',
      passwordHash: 'Demo@12345', // pre-save hook will hash it
      role: 'staff'
    });

    const rewards = await Reward.insertMany([
      { name: 'Coffee', pointsCost: 100, active: true },
      { name: 'Cold Coffee', pointsCost: 150, active: true },
      { name: 'Sandwich', pointsCost: 200, active: true },
      { name: 'Cake', pointsCost: 300, active: true },
    ]);

    const members = await Member.insertMany([
      { name: 'Amit Kumar', phone: '9876543210', currentPoints: 50, lifetimePoints: 50, tier: 'Bronze' },
      { name: 'Priya Sharma', phone: '9876543211', currentPoints: 499, lifetimePoints: 499, tier: 'Bronze' },
      { name: 'Rahul Singh', phone: '9876543212', currentPoints: 500, lifetimePoints: 500, tier: 'Silver' },
      { name: 'Neha Gupta', phone: '9876543213', currentPoints: 800, lifetimePoints: 800, tier: 'Silver' },
      { name: 'Vikram Patel', phone: '9876543214', currentPoints: 999, lifetimePoints: 999, tier: 'Silver' },
      { name: 'Anjali Desai', phone: '9876543215', currentPoints: 1000, lifetimePoints: 1000, tier: 'Gold' },
      { name: 'Rohan Mehta', phone: '9876543216', currentPoints: 1500, lifetimePoints: 2000, tier: 'Gold' },
      // add a few more random members
      { name: 'Sanjay Dutt', phone: '9998887776', currentPoints: 120, lifetimePoints: 120, tier: 'Bronze' },
      { name: 'Kiran Rao', phone: '9998887775', currentPoints: 340, lifetimePoints: 340, tier: 'Bronze' },
      { name: 'Pooja Hegde', phone: '9998887774', currentPoints: 600, lifetimePoints: 600, tier: 'Silver' },
      { name: 'Vijay Kumar', phone: '9998887773', currentPoints: 1100, lifetimePoints: 1100, tier: 'Gold' },
      { name: 'Deepika P', phone: '9998887772', currentPoints: 20, lifetimePoints: 20, tier: 'Bronze' },
      { name: 'Ranveer S', phone: '9998887771', currentPoints: 750, lifetimePoints: 750, tier: 'Silver' },
      { name: 'Alia B', phone: '9998887770', currentPoints: 10, lifetimePoints: 10, tier: 'Bronze' },
      { name: 'Shahrukh K', phone: '9998887769', currentPoints: 2500, lifetimePoints: 3000, tier: 'Gold' },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
