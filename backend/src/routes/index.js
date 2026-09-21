/**
 * Route Aggregator
 * 
 * Registers all feature routes under /api.
 * Each feature has its own route file for clean separation.
 */

const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const skillRoutes = require('./skill.routes');
const projectRoutes = require('./project.routes');
const assessmentRoutes = require('./assessment.routes');
const certificationRoutes = require('./certification.routes');
const reviewRoutes = require('./review.routes');
const teamRoutes = require('./team.routes');
const githubRoutes = require('./github.routes');
const linkedinRoutes = require('./linkedin.routes');

// Register routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/certifications', certificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/teams', teamRoutes);
router.use('/github', githubRoutes);
router.use('/linkedin', linkedinRoutes);

module.exports = router;
