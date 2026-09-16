/**
 * SkillForge API Server
 * 
 * Entry point for the Express application.
 * Loads environment variables, connects to MongoDB,
 * and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------- Routes ---------------
app.use('/api', routes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

// --------------- Start Server ---------------
const startServer = async () => {
  try {
    // Connect to MongoDB (skip in test environment if no URI)
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.log('⚠️  No MONGODB_URI found — running without database');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 SkillForge API running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${NODE_ENV}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
