/**
 * Database Configuration
 * 
 * Connects to MongoDB Atlas using Mongoose.
 * Uses the MONGODB_URI from environment variables.
 * 
 * MongoDB Atlas free tier: 512 MB storage, shared cluster.
 * Sign up at: https://cloud.mongodb.com
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://yuvrajcgcu_db_user:0011_Yuvraj@cluster0.dr5devz.mongodb.net/skillforge?retryWrites=true&w=majority", {
      // Mongoose 7+ uses these defaults, but being explicit:
      // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 7+
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
