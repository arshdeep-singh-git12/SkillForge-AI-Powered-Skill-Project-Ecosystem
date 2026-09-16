/**
 * Team Model — PLACEHOLDER
 * 
 * Mongoose schema for team formation and management.
 * 
 * Suggested fields:
 *   - name: Team name
 *   - description: Team description/goals
 *   - owner: Reference to User who created the team
 *   - members: Array of { user: UserRef, role: String, joinedAt: Date }
 *   - requiredSkills: Array of skills the team is looking for
 *   - maxMembers: Maximum team size
 *   - status: Team status ("recruiting", "active", "completed")
 *   - project: Reference to associated Project (if any)
 *   - availability: Team's availability schedule
 * 
 * Note: Team matching logic lives in services/matching.service.js
 * 
 * @owner Team Member 7 — Teams & Dashboard
 */

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    requiredSkills: [{ type: String }],
    maxMembers: { type: Number, default: 4 },
    status: { type: String, enum: ['recruiting', 'active', 'completed'], default: 'recruiting' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Team', teamSchema);
