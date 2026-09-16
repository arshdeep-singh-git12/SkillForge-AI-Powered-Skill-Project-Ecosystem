const Certification = require('../models/Certification');

const getUserCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({ user: req.user.id }).sort({ dateEarned: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addExternalCertification = async (req, res) => {
  try {
    const { title, issuer, dateEarned, credentialUrl, description } = req.body;
    
    if (!title || !issuer || !dateEarned) {
      return res.status(400).json({ message: 'Title, issuer, and dateEarned are required' });
    }

    const certification = await Certification.create({
      user: req.user.id,
      title,
      issuer,
      description,
      dateEarned,
      credentialUrl,
      type: 'external'
    });

    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserCertifications, addExternalCertification };
