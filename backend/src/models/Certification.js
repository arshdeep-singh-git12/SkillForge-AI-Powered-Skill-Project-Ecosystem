/**
 * Certification Model — PLACEHOLDER
 * 
 * Mongoose schema for user certifications and badges.
 * 
 * Suggested fields:
 *   - user: Reference to User who earned this certification
 *   - title: Certification name (e.g., "Python Fundamentals")
 *   - issuer: Who issued the cert (e.g., "SkillForge", "External")
 *   - description: Brief description of the certification
 *   - dateEarned: When the certification was earned
 *   - expiryDate: Expiration date (if applicable)
 *   - credentialUrl: Link to verify the certification
 *   - badgeImage: URL to badge/icon image
 *   - type: Type of certification ("assessment", "course", "external")
 * 
 * @owner Team Member 4 — Certifications
 */

const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    description: { type: String },
    dateEarned: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialUrl: { type: String },
    badgeImage: { type: String },
    type: { type: String, enum: ['assessment', 'course', 'external'], default: 'external' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Certification', certificationSchema);
