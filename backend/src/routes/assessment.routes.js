/**
 * Assessment Routes
 * 
 * Manages coding assessments and code execution.
 * Uses the Piston API for safe, sandboxed code execution.
 * 
 * Planned endpoints:
 *   GET  /api/assessments              — List available assessments
 *   GET  /api/assessments/:id          — Get assessment details
 *   POST /api/assessments/submit       — Submit code for execution
 *   GET  /api/assessments/results/:id  — Get submission results
 * 
 * @owner Team Member 5 — Coding Assessments
 */

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', assessmentController.getAllAssessments);
router.get('/:id', assessmentController.getAssessmentById);
router.post('/:id/submit', protect, assessmentController.submitCode);
router.get('/:id/results', protect, assessmentController.getResults);

module.exports = router;
