const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Persistent): ${mongoose.connection.host}`);
    } else {
      console.log('No MONGODB_URI found. Falling back to in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Memory Server): ${mongoUri}`);
    }
    
    // Auto-seed if specified in env
    if (process.env.SEED_ON_START === 'true') {
      console.log('Seeding database as requested by SEED_ON_START...');
      await require('../utils/seedFunction')();
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
