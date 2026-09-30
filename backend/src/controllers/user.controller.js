const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const { syncGithubProjects } = require('../services/github.service');
const { syncLinkedinCertificates } = require('../services/linkedin.service');

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
    console.log('PUT /api/users/profile - user ID:', req.user?.id);
    console.log('PUT /api/users/profile - body:', req.body);
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      if (req.body.avatar !== undefined) {
        user.avatar = req.body.avatar;
      }
      if (req.body.githubUrl !== undefined) {
        user.githubUrl = req.body.githubUrl;
      }
      if (req.body.linkedinUrl !== undefined) {
        user.linkedinUrl = req.body.linkedinUrl;
      }
      if (req.body.leetcodeUrl !== undefined) {
        user.leetcodeUrl = req.body.leetcodeUrl;
      }
      if (req.body.hackerrankUrl !== undefined) {
        user.hackerrankUrl = req.body.hackerrankUrl;
      }
      
      const updatedUser = await user.save();
      console.log('Profile updated successfully for user:', updatedUser._id);
      
      // Fire and forget background syncs
      syncGithubProjects(updatedUser).catch(e => console.error(e));
      syncLinkedinCertificates(updatedUser).catch(e => console.error(e));

      res.json(updatedUser);
    } else {
      console.log('User not found in DB:', req.user.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in updateUser:', error);
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

const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('skills');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch user's public projects
    const projects = await Project.find({ owner: user._id });

    res.json({
      user,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const senderId = req.user.id;

    if (targetUserId === senderId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (targetUser.connections && targetUser.connections.includes(senderId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    if (targetUser.connectionRequests && targetUser.connectionRequests.includes(senderId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    if (!targetUser.connectionRequests) targetUser.connectionRequests = [];
    targetUser.connectionRequests.push(senderId);
    await targetUser.save();

    // Create Notification
    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: targetUserId,
      sender: senderId,
      type: 'CONNECTION_REQUEST', // Ensure this is in the enum in Notification.js! Wait, we will need to update the enum.
      title: 'New Forge Request',
      message: 'wants to forge with you.',
      data: { status: 'PENDING' }
    });

    res.json({ message: 'Forge request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const handleConnectionRequest = async (req, res) => {
  try {
    const { action, notificationId } = req.body; // action: 'ACCEPT' or 'REJECT'
    const requesterId = req.params.id;
    const myUserId = req.user.id;

    const me = await User.findById(myUserId);
    const requester = await User.findById(requesterId);

    if (!me || !requester) return res.status(404).json({ message: 'User not found' });

    // Remove from my requests
    me.connectionRequests = me.connectionRequests || [];
    me.connectionRequests = me.connectionRequests.filter(id => id.toString() !== requesterId);

    if (action === 'ACCEPT') {
      me.connections = me.connections || [];
      if (!me.connections.includes(requesterId)) me.connections.push(requesterId);
      
      requester.connections = requester.connections || [];
      if (!requester.connections.includes(myUserId)) requester.connections.push(myUserId);
      
      await requester.save();

      // Notify requester that it was accepted
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: requesterId,
        sender: myUserId,
        type: 'GENERAL',
        title: 'Forge Accepted',
        message: 'has accepted your forge request!',
      });
    }

    await me.save();

    // Mark notification as resolved
    if (notificationId) {
      const Notification = require('../models/Notification');
      const notif = await Notification.findById(notificationId);
      if (notif) {
        notif.isRead = true;
        notif.data = { ...notif.data, status: action };
        notif.markModified('data');
        await notif.save();
      }
    }

    res.json({ message: `Forge request ${action.toLowerCase()}ed` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserById, updateUser, deleteUser, getProfileCompletion, getPublicProfile, sendConnectionRequest, handleConnectionRequest };
