const Certification = require('../models/Certification');
const { processCertification } = require('../services/assessment-engine.service');

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

    // Automatically assess skills based on this new certification
    await processCertification(req.user.id, certification._id);

    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleLikeCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });

    const userId = req.user.id;
    const hasLiked = certification.likes && certification.likes.includes(userId);

    if (hasLiked) {
      certification.likes = certification.likes.filter(id => id.toString() !== userId.toString());
      
      // Decrement user total likes
      const User = require('../models/User');
      await User.findByIdAndUpdate(certification.user, { $inc: { totalLikes: -1 } });
    } else {
      certification.likes = certification.likes || [];
      certification.likes.push(userId);
      
      // Increment user total likes
      const User = require('../models/User');
      await User.findByIdAndUpdate(certification.user, { $inc: { totalLikes: 1 } });
      
      if (certification.user.toString() !== userId.toString()) {
        const Notification = require('../models/Notification');
        await Notification.create({
          recipient: certification.user,
          sender: userId,
          type: 'CERTIFICATE_LIKE',
          title: 'New Like on Certification!',
          message: `liked your certification "${certification.title}".`,
        });
      }
    }
    
    await certification.save();
    res.json({ message: hasLiked ? 'Unliked' : 'Liked', likes: certification.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserCertifications, addExternalCertification, toggleLikeCertification };
