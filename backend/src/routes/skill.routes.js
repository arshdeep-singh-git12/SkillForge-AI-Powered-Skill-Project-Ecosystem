/**
 * Skill Routes
 * 
 * Manages user skills and proficiency tracking.
 * Skills have a name, category, and proficiency level (0-100).
 * 
 * Planned endpoints:
 *   GET    /api/skills/user/:userId — Get all skills for a user
 *   POST   /api/skills              — Add a new skill
 *   PUT    /api/skills/:id          — Update skill proficiency
 *   DELETE /api/skills/:id          — Remove a skill
 * 
 * @owner Team Member 2 — Skill Profiles
 */

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/user/:userId', skillController.getUserSkills);
router.post('/', protect, skillController.addSkill);
router.put('/:id', protect, skillController.updateSkill);
router.delete('/:id', protect, skillController.deleteSkill);

module.exports = router;
