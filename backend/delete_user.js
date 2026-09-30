const mongoose = require('mongoose');
const User = require('./src/models/User');

const run = async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const path = require('path');
    const fs = require('fs');
    
    const dbPath = path.join(__dirname, '.local_db');
    
    console.log('Starting MongoDB memory server to delete user...');
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath
      }
    });
    
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const email = 'arshdeepbansal69@gmail.com';
    const result = await User.deleteOne({ email });
    console.log(`Deleted ${result.deletedCount} user(s) with email ${email}`);
    
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
