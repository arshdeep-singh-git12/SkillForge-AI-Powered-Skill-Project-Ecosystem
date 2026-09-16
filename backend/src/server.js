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
const { seedAssessments } = require('./utils/seed');
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

// --------------- Status Middleware ---------------
app.use((req, res, next) => {
  if (!global.isDbReady && process.env.MONGODB_URI === 'memory' && req.path !== '/api/health') {
    return res.status(503).json({ 
      message: "SkillForge Database is currently downloading the MongoDB engine for the first time. Please check the backend terminal for progress and try again in a minute!" 
    });
  }
  next();
});

// --------------- Routes ---------------
app.use('/api', routes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

// --------------- Start Server ---------------
const startServer = async () => {
  try {
    // Start listening immediately so frontend doesn't get Connection Refused
    app.listen(PORT, () => {
      console.log(`\n🚀 SkillForge API running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${NODE_ENV}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
    });

    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        await seedAssessments();
        global.isDbReady = true;
      } catch (err) {
        console.error('⚠️  Failed to connect to MongoDB. API will run, but database features will fail.');
      }
    } else {
      console.log('⚠️  No MONGODB_URI found — running without database');
      global.isDbReady = true;
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
