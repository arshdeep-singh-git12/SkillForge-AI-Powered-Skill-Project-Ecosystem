const Team = require('../models/Team');

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('owner members', 'name avatar');
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
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Not found' });

    // Mock logic: simply add them if not full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: 'Team is full' });
    }

    if (!team.members.includes(req.user.id)) {
      team.members.push(req.user.id);
      await team.save();
    }

    res.json({ message: 'Successfully joined team!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllTeams, createTeam, getTeamById, requestJoin };
