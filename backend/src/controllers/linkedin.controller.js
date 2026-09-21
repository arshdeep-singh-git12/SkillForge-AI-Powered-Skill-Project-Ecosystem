const pdf = require('pdf-parse');
const Certification = require('../models/Certification');
const { processCertification } = require('../services/assessment-engine.service');

const parseLinkedinPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const dataBuffer = req.file.buffer;
    const data = await pdf(dataBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // 100% FREE LOCAL REGEX PARSER
    let certificates = [];
    
    // Find the section (case insensitive)
    const certIndex = text.toLowerCase().indexOf('licenses & certifications');
    if (certIndex !== -1) {
      // Get text after this section
      const afterCerts = text.substring(certIndex + 25);
      
      // Stop at the next major section (usually capitalized or specific words)
      const nextSectionRegex = /\n(Skills|Education|Languages|Experience|Honors & Awards)\n/i;
      const nextSectionMatch = afterCerts.match(nextSectionRegex);
      
      const certsText = nextSectionMatch 
        ? afterCerts.substring(0, nextSectionMatch.index)
        : afterCerts;

      // Split by newlines and clean up
      const lines = certsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Heuristic: Certificate titles are usually followed by the issuer
      for (let i = 0; i < lines.length - 1; i++) {
        // Skip dates, IDs, or short lines
        if (lines[i].includes('Issued') || lines[i].includes('Credential') || lines[i].length < 5) continue;
        
        // If the next line doesn't look like a date, it might be the issuer
        if (!lines[i+1].includes('Issued') && !lines[i+1].match(/\d{4}/)) {
           certificates.push({
             title: lines[i],
             issuer: lines[i+1],
             skills: ['General'] // Hard to extract specific skills via regex, default to General
           });
           i++; // Skip the issuer line
        }
      }
    }

    if (certificates.length === 0) {
      return res.status(400).json({ message: 'No certificates found in the PDF. Make sure your profile has a "Licenses & certifications" section.' });
    }

    const createdCerts = [];
    for (const certData of certificates) {
      const existingCert = await Certification.findOne({ user: req.user.id, title: certData.title });
      if (!existingCert) {
        const cert = await Certification.create({
          user: req.user.id,
          title: certData.title,
          issuer: certData.issuer || 'LinkedIn',
          dateEarned: new Date(),
          type: 'external',
          skills: certData.skills || [],
        });
        
        await processCertification(req.user.id, cert._id);
        createdCerts.push(cert);
      }
    }

    res.json({ message: `Successfully synced ${createdCerts.length} certificates`, certificates: createdCerts });

  } catch (error) {
    console.error('LinkedIn PDF Parse Error:', error);
    res.status(500).json({ message: 'Server error processing PDF', error: error.message });
  }
};

module.exports = {
  parseLinkedinPdf
};
