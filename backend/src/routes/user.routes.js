const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/profile/completion', protect, userController.getProfileCompletion);
router.get('/public/:id', userController.getPublicProfile);
router.post('/:id/connect', protect, userController.sendConnectionRequest);
router.post('/:id/respond', protect, userController.handleConnectionRequest);
router.get('/:id', userController.getUserById);
router.put('/profile', protect, userController.updateUser); // Changed to /profile to update own profile
router.delete('/profile', protect, userController.deleteUser);

module.exports = router;
