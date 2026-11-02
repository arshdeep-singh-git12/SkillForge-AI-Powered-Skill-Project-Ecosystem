const Certification = require('../models/Certification');
const { processCertification } = require('./assessment-engine.service');

/**
 * MOCK LinkedIn Sync Service
 * Since LinkedIn blocks unauthenticated scraping and lacks a public API for certificates,
 * this function generates dummy certificates to demonstrate the platform's capabilities.
 * @param {Object} user - The user document
 */
const syncLinkedinCertificates = async (user) => {
  try {
    if (!user.linkedinUrl) return;

    // Check if we've already synced mock certificates to avoid duplicates
    const existingCert = await Certification.findOne({ user: user._id, title: 'LinkedIn Learning: React Patterns' });
    if (existingCert) return;

    const mockCertificates = [
      {
        user: user._id,
        title: 'LinkedIn Learning: React Patterns',
        issuer: 'LinkedIn',
        dateEarned: new Date(new Date().setMonth(new Date().getMonth() - 2)), // 2 months ago
        url: user.linkedinUrl,
        skills: ['React'],
      },
      {
        user: user._id,
        title: 'LinkedIn Learning: Backend API Design',
        issuer: 'LinkedIn',
        dateEarned: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
        url: user.linkedinUrl,
        skills: ['Node.js', 'Express'],
      }
    ];

    for (const certData of mockCertificates) {
      const cert = await Certification.create(certData);
      
      // Trigger assessment for the new certification
      await processCertification(user._id, cert._id);
    }

    console.log(`✅ LinkedIn Mock Sync: Created dummy certificates for user ${user._id}`);
  } catch (error) {
    console.error(`❌ LinkedIn Sync Error for user ${user._id}:`, error.message);
  }
};

module.exports = {
  syncLinkedinCertificates,
};
