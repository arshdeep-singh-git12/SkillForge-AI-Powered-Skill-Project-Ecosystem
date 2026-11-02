/**
 * Skill Routes
 * 
 * Manages user skills, proficiency tracking, and AI skill analytics.
 */

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/analysis/:userId', skillController.getSkillAnalysis);
router.get('/user/:userId', skillController.getUserSkills);
router.post('/', protect, skillController.addSkill);
router.put('/:id', protect, skillController.updateSkill);
router.delete('/:id', protect, skillController.deleteSkill);

module.exports = router;
