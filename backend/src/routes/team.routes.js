/**
 * Team Routes
 * 
 * Manages team formation, matching, and membership.
 * 
 * Endpoints:
 *   GET    /api/teams          — List all teams (filtered & paginated)
 *   POST   /api/teams/match    — Find matching teams by skills
 *   GET    /api/teams/:id      — Get team details
 *   POST   /api/teams          — Create a new team
 *   PUT    /api/teams/:id      — Update team details (owner only)
 *   DELETE /api/teams/:id      — Delete team (owner only)
 *   POST   /api/teams/:id/join — Request to join a team
 *   POST   /api/teams/:id/leave— Leave a team
 *   GET    /api/teams/:id/requests — Get join requests (owner only)
 *   POST   /api/teams/:id/requests/:userId/approve — Approve request (owner only)
 *   POST   /api/teams/:id/requests/:userId/reject  — Reject request (owner only)
 * 
 * @owner Team Member 7 — Teams & Dashboard
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const teamController = require('../controllers/team.controller');

// Public read routes
router.get('/', teamController.getAllTeams);
router.post('/match', protect, teamController.findMatches);
router.get('/:id', teamController.getTeamById);

// Protected mutating routes
router.post('/', protect, teamController.createTeam);
router.put('/:id', protect, teamController.updateTeam);
router.delete('/:id', protect, teamController.deleteTeam);
router.post('/:id/join', protect, teamController.joinTeam);
router.post('/:id/leave', protect, teamController.leaveTeam);

// Request management routes (owner only logic enforced in controller)
router.get('/:id/requests', protect, teamController.getJoinRequests);
router.post('/:id/requests/:userId/approve', protect, teamController.approveJoinRequest);
router.post('/:id/requests/:userId/reject', protect, teamController.rejectJoinRequest);

module.exports = router;
