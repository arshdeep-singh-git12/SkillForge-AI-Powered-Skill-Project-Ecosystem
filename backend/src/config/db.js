/**
 * Database Configuration
 * 
 * Connects to MongoDB Atlas or an In-Memory Database for demo purposes.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let mongoServer = null;

const cleanLockFiles = (dir) => {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.endsWith('.lock')) {
          fs.rmSync(path.join(dir, file), { force: true });
        }
      }
    }
  } catch (e) {
    // ignore lock file clean errors
  }
};

const cleanDirectory = (dir) => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.warn('Could not cleanly recreate directory:', e.message);
  }
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use an in-memory database for flagship demo mode if specified or if local fails
    if (uri === 'memory') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '../../.local_db');

      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      // Clean stale lock files from previous unclean shutdowns
      cleanLockFiles(dbPath);

      try {
        mongoServer = await MongoMemoryServer.create({
          instance: {
            dbPath: dbPath
          }
        });
        console.log('🌟 [DEMO MODE] Started Persistent Local MongoDB Server');
      } catch (memErr) {
        console.warn(`⚠️ Local DB storage failed to start (${memErr.message}). Re-initializing storage...`);
        // If corrupted (fassert / turtle read error / stale lock), clear directory and retry
        cleanDirectory(dbPath);
        try {
          mongoServer = await MongoMemoryServer.create({
            instance: {
              dbPath: dbPath
            }
          });
          console.log('🌟 [DEMO MODE] Recovered Persistent Local MongoDB Server');
        } catch (retryErr) {
          console.warn(`⚠️ Failed persistent recovery (${retryErr.message}). Falling back to pure in-memory MongoDB.`);
          mongoServer = await MongoMemoryServer.create();
        }
      }

      uri = mongoServer.getUri();
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
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    console.log('🔌 MongoDB disconnected cleanly');
  } catch (e) {
    // quiet disconnect
  }
};

// Graceful shutdown hooks
const handleExit = async () => {
  await disconnectDB();
};

process.once('SIGUSR2', async () => {
  await handleExit();
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await handleExit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await handleExit();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
