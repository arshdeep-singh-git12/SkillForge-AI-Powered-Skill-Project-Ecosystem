/**
 * Database Configuration
 * 
 * Connects to MongoDB Atlas or an In-Memory Database for demo purposes.
 */

const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use an in-memory database for flagship demo mode if specified or if local fails
    if (uri === 'memory') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('🌟 [DEMO MODE] Started In-Memory MongoDB Server');
    }

    const conn = await mongoose.connect(uri, {
      // Mongoose 7+ defaults
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('🔌 MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
