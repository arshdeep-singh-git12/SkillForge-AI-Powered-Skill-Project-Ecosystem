/**
 * Assessment Model — PLACEHOLDER
 * 
 * Mongoose schema for coding assessments/challenges.
 * 
 * Suggested fields:
 *   - title: Assessment title (e.g., "Two Sum", "FizzBuzz")
 *   - description: Problem description (markdown supported)
 *   - difficulty: Difficulty level ("easy", "medium", "hard")
 *   - language: Target programming language(s)
 *   - starterCode: Boilerplate code provided to the user
 *   - testCases: Array of { input, expectedOutput } for validation
 *   - timeLimit: Time limit in minutes
 *   - points: Points awarded for completion
 *   - submissions: Array of { user, code, result, submittedAt }
 * 
 * Note: Code execution is handled by the Piston API (see services/piston.service.js)
 * 
 * @owner Team Member 5 — Coding Assessments
 */

const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    language: { type: String, required: true },
    starterCode: { type: String, default: '' },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    points: { type: Number, default: 10 },
    submissions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        code: { type: String },
        result: { type: String, enum: ['passed', 'failed', 'error'] },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Assessment', assessmentSchema);
