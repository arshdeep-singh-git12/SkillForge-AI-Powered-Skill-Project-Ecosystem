const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', projectController.getAllProjects);
router.get('/user/:userId', projectController.getUserProjects);
router.post('/', protect, projectController.createProject);
router.get('/:id', projectController.getProjectById);

module.exports = router;
