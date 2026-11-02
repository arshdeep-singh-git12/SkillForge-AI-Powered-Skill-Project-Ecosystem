const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', teamController.getAllTeams);
router.post('/', protect, teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.post('/:id/join', protect, teamController.requestJoin);
router.post('/:id/accept-request', protect, teamController.acceptJoinRequest);
router.post('/:id/close', protect, teamController.closeTeam);

module.exports = router;
