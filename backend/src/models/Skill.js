/**
 * Skill Model — PLACEHOLDER
 * 
 * Mongoose schema for tracking user skills and proficiency levels.
 * 
 * Suggested fields:
 *   - user: Reference to User who owns this skill
 *   - name: Skill name (e.g., "Python", "React", "Docker")
 *   - category: Skill category (e.g., "Language", "Framework", "Tool")
 *   - proficiency: Proficiency level 0-100 (displayed as progress bar)
 *   - endorsements: Number of peer endorsements
 *   - assessmentScore: Score from coding assessments (if applicable)
 * 
 * Example usage:
 *   { user: "userId", name: "Python", category: "Language", proficiency: 82 }
 * 
 * @owner Team Member 2 — Skill Profiles
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General',
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency is required'],
      min: [0, 'Proficiency cannot be less than 0'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Skill', skillSchema);
