/**
 * Team Controller
 * 
 * Handles team formation, membership management, and matching.
 * Uses rule-based matching by skills and availability.
 * 
 * @owner Team Member 7 — Teams & Dashboard
 */

const mongoose = require('mongoose');
const Team = require('../models/Team');
const matchingService = require('../services/matching.service');

/**
 * Helper to get authenticated user ID.
 * In development, allows fallback to x-dev-user-id header when auth is stubbed.
 * Strictly forbidden in production.
 * 
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const getAuthUserId = (req) => {
  if (req.user && (req.user.id || req.user._id)) {
    return (req.user.id || req.user._id).toString();
  }
  if (process.env.NODE_ENV === 'development' && req.headers['x-dev-user-id']) {
    return req.headers['x-dev-user-id'].toString().trim();
  }
  return null;
};

/**
 * List all teams with optional filtering and pagination.
 * GET /api/teams
 */
const getAllTeams = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.skill) {
      filter.requiredSkills = {
        $regex: new RegExp(`^${req.query.skill.trim()}$`, 'i'),
      };
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      Team.find(filter)
        .populate('owner', 'name email avatar')
        .populate('members.user', 'name email avatar')
        .populate('project', 'title description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Team.countDocuments(filter),
    ]);

    return res.status(200).json({
      data: teams.map((team) => team.toJSON()),
      total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single team details by ID.
 * GET /api/teams/:id
 */
const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('project', 'title description');

    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    return res.status(200).json({
      data: team.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new team.
 * POST /api/teams
 */
const createTeam = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required to create a team',
      });
    }

    const {
      name,
      description,
      requiredSkills,
      maxMembers,
      status,
      project,
      tags,
      avatar,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Team name is required',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Team description is required',
      });
    }

    // Check for duplicate team name
    const existingTeam = await Team.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingTeam) {
      return res.status(409).json({
        status: 'error',
        message: 'A team with this name already exists',
      });
    }

    // Owner is automatically added as first member with role 'owner'
    const newTeam = new Team({
      name: name.trim(),
      description: description.trim(),
      owner: userId,
      members: [
        {
          user: userId,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      maxMembers: maxMembers ? Number(maxMembers) : 5,
      status: status || 'recruiting',
      project: project && mongoose.Types.ObjectId.isValid(project) ? project : null,
      tags: Array.isArray(tags) ? tags : [],
      avatar: avatar || '',
    });

    await newTeam.save();

    const populatedTeam = await Team.findById(newTeam._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('project', 'title description');

    return res.status(201).json({
      status: 'success',
      data: populatedTeam.toJSON(),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'A team with this name already exists',
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Update team details (owner only).
 * PUT /api/teams/:id
 */
const updateTeam = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required to update a team',
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    const ownerId = team.owner?._id ? team.owner._id.toString() : team.owner.toString();
    if (ownerId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the team owner can update the team',
      });
    }

    const {
      name,
      description,
      requiredSkills,
      maxMembers,
      status,
      project,
      tags,
      avatar,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Team name cannot be empty',
        });
      }
      const duplicate = await Team.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (duplicate) {
        return res.status(409).json({
          status: 'error',
          message: 'A team with this name already exists',
        });
      }
      team.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Description cannot be empty',
        });
      }
      team.description = description.trim();
    }

    if (requiredSkills !== undefined) {
      team.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : [];
    }

    if (maxMembers !== undefined) {
      const parsedMax = Number(maxMembers);
      if (parsedMax < team.members.length) {
        return res.status(400).json({
          status: 'error',
          message: `Max members cannot be less than current member count (${team.members.length})`,
        });
      }
      team.maxMembers = parsedMax;
    }

    if (status !== undefined) {
      team.status = status;
    }

    if (project !== undefined) {
      team.project = project && mongoose.Types.ObjectId.isValid(project) ? project : null;
    }

    if (tags !== undefined) {
      team.tags = Array.isArray(tags) ? tags : [];
    }

    if (avatar !== undefined) {
      team.avatar = avatar;
    }

    await team.save();

    const updatedTeam = await Team.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('project', 'title description');

    return res.status(200).json({
      status: 'success',
      data: updatedTeam.toJSON(),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Delete a team (owner only).
 * DELETE /api/teams/:id
 */
const deleteTeam = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required to delete a team',
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    const ownerId = team.owner?._id ? team.owner._id.toString() : team.owner.toString();
    if (ownerId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the team owner can delete the team',
      });
    }

    await Team.findByIdAndDelete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Find matching teams by skills.
 * POST /api/teams/match
 */
const findMatches = async (req, res, next) => {
  try {
    const skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : typeof req.body.skills === 'string'
        ? req.body.skills.split(',').map((s) => s.trim())
        : [];

    const matches = await matchingService.findMatchingTeams(skills);

    return res.status(200).json({
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Join a team.
 * POST /api/teams/:id/join
 */
const joinTeam = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required to join a team',
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    if (team.status !== 'recruiting') {
      return res.status(400).json({
        status: 'error',
        message: 'Team is not accepting new members',
      });
    }

    if (team.isMember(userId)) {
      return res.status(409).json({
        status: 'error',
        message: 'You are already a member of this team',
      });
    }

    if (team.isFull()) {
      return res.status(400).json({
        status: 'error',
        message: 'Team has reached its maximum capacity',
      });
    }

    team.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date(),
    });

    await team.save();

    const populatedTeam = await Team.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('project', 'title description');

    return res.status(200).json({
      status: 'success',
      message: 'Successfully joined team',
      data: populatedTeam.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a team.
 * POST /api/teams/:id/leave
 */
const leaveTeam = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required to leave a team',
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    if (!team.isMember(userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are not a member of this team',
      });
    }

    const ownerId = team.owner?._id ? team.owner._id.toString() : team.owner.toString();
    if (ownerId === userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Team owners cannot leave the team. Transfer ownership or delete the team.',
      });
    }

    team.members = team.members.filter((member) => {
      const memberUserId = member.user?._id
        ? member.user._id.toString()
        : member.user?.toString();
      return memberUserId !== userId;
    });

    await team.save();

    const populatedTeam = await Team.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('project', 'title description');

    return res.status(200).json({
      status: 'success',
      message: 'Successfully left team',
      data: populatedTeam.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  findMatches,
  joinTeam,
  leaveTeam,
};
