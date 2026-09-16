const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:id', userController.getUserById);
router.put('/profile', protect, userController.updateUser); // Changed to /profile to update own profile
router.delete('/profile', protect, userController.deleteUser);

module.exports = router;
