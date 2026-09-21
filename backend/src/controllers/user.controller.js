const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('skills');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      if (req.body.avatar !== undefined) {
        user.avatar = req.body.avatar;
      }
      
      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileCompletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let completionPercentage = 0;
    const missingSteps = [];

    // 1. Avatar & Bio (25%)
    if (user.avatar && user.bio) {
      completionPercentage += 25;
    } else {
      missingSteps.push({ name: 'Complete your profile bio & avatar', link: '/settings' });
    }

    // 2. Skills (25%)
    const skillCount = await Skill.countDocuments({ user: req.user.id });
    if (skillCount > 0) {
      completionPercentage += 25;
    } else {
      missingSteps.push({ name: 'Add your first technical skill', link: '/profile' });
    }

    // 3. Projects (25%)
    const projectCount = await Project.countDocuments({ owner: req.user.id });
    if (projectCount > 0) {
      completionPercentage += 25;
    } else {
      missingSteps.push({ name: 'Upload a portfolio project', link: '/dashboard' }); // Can open modal
    }

    // 4. Certifications (25%)
    const certCount = await Certification.countDocuments({ user: req.user.id });
    if (certCount > 0) {
      completionPercentage += 25;
    } else {
      missingSteps.push({ name: 'Add a certification or course', link: '/certifications' });
    }

    res.json({
      percentage: completionPercentage,
      missingSteps,
      isComplete: completionPercentage === 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserById, updateUser, deleteUser, getProfileCompletion };
