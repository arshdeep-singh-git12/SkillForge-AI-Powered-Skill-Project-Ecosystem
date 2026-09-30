const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/unread-count', messageController.getUnreadCount);
router.get('/conversations', messageController.getConnectedUsers);
router.get('/:userId', messageController.getMessages);
router.post('/:userId', messageController.sendMessage);
router.put('/:userId/read', messageController.markAsRead);

module.exports = router;
