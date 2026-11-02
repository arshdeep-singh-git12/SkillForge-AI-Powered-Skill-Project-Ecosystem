/**
 * Review Model — PLACEHOLDER
 * 
 * Mongoose schema for peer reviews on projects.
 * 
 * Suggested fields:
 *   - reviewer: Reference to User who wrote the review
 *   - project: Reference to the Project being reviewed
 *   - rating: Numeric rating (1-5)
 *   - title: Review title/summary
 *   - content: Detailed review text
 *   - skillEndorsements: Array of skills endorsed in this review
 *   - helpful: Number of "helpful" votes from other users
 * 
 * @owner Team Member 6 — GitHub & Reviews
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    skillEndorsements: [{ type: String }],
    helpful: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Review', reviewSchema);
