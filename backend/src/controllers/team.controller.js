const Team = require('../models/Team');

const getAllTeams = async (req, res) => {
  try {
    // Hide teams that were closed more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const teams = await Team.find({
      $or: [
        { status: { $ne: 'closed' } },
        { status: 'closed', closedAt: { $gt: twentyFourHoursAgo } }
      ]
    }).populate('owner members', 'name avatar');
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, description, requiredSkills, maxMembers } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const team = await Team.create({
      owner: req.user.id,
      name,
      description,
      requiredSkills: requiredSkills || [],
      maxMembers: maxMembers || 4,
      members: [req.user.id] // Owner is automatically a member
    });

    const populatedTeam = await Team.findById(team._id).populate('owner members', 'name avatar');
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('owner members', 'name avatar');
    if (!team) return res.status(404).json({ message: 'Not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const requestJoin = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    const team = await Team.findById(req.params.id);
    
    if (!team) return res.status(404).json({ message: 'Not found' });

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: 'Team is full' });
    }

    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member' });
    }

    // Require the Notification model locally to prevent circular dependency issues
    const Notification = require('../models/Notification');
    
    // Create notification for the team owner
    await Notification.create({
      recipient: team.owner,
      sender: req.user.id,
      type: 'TEAM_JOIN_REQUEST',
      title: 'New Team Join Request',
      message: `${name} has requested to join your team: ${team.name}`,
      data: {
        teamId: team._id,
        teamName: team.name,
        applicantName: name,
        applicantMobile: mobile,
        applicantEmail: email,
      }
    });

    res.json({ message: 'Join request sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const acceptJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const team = await Team.findById(req.params.id);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Ensure the user is the owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team owner can accept requests' });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: 'Team is already full' });
    }

    const Notification = require('../models/Notification');
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const applicantId = notification.sender;

    if (team.members.includes(applicantId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add user to team
    team.members.push(applicantId);
    await team.save();

    // Mark original notification as read and perhaps change its status
    notification.isRead = true;
    notification.data = { ...notification.data, status: 'ACCEPTED' };
    notification.markModified('data');
    await notification.save();

    // Notify the applicant
    await Notification.create({
      recipient: applicantId,
      sender: req.user.id,
      type: 'TEAM_JOIN_ACCEPTED',
      title: 'Team Request Accepted!',
      message: `You are the member of the team now: ${team.name}`,
      data: {
        teamId: team._id,
        teamName: team.name
      }
    });

    res.json({ message: 'Request accepted successfully!', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const closeTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Ensure the user is the owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team owner can close the team' });
    }

    team.status = 'closed';
    team.closedAt = new Date();
    await team.save();

    res.json({ message: 'Team closed successfully!', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllTeams, createTeam, getTeamById, requestJoin, acceptJoinRequest, closeTeam };
