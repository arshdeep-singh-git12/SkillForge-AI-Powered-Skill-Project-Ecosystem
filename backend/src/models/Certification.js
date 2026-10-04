const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: {
    type: String, // Coursera, AWS, Udemy, etc.
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  verificationLink: {
    type: String,
    required: false
  },
  isChallengeBadge: {
    type: Boolean,
    default: false // Agar coding challenge clear karke trophy mili hai toh true hoga
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);/**
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
 */
