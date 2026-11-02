const express = require('express');
const router = express.Router();
const githubController = require('../controllers/github.controller');

router.get('/stats', githubController.getRepoStats);

module.exports = router;
