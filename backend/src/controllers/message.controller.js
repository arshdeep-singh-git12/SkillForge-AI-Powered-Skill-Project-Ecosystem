const Message = require('../models/Message');
const User = require('../models/User');
const { sendToUser } = require('../socket');

exports.getUnreadCount = async (req, res) => {
  try {
    const unreadSenders = await Message.distinct('sender', {
      receiver: req.user._id,
      isRead: false
    });
    res.json({ count: unreadSenders.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching unread count' });
  }
};

exports.getConnectedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', 'name avatar email');
    
    // For each connection, fetch the latest message and unread count
    const connectionsWithMeta = await Promise.all(user.connections.map(async (connection) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: req.user._id, receiver: connection._id },
          { sender: connection._id, receiver: req.user._id }
        ]
      }).sort('-createdAt');

      const unreadCount = await Message.countDocuments({
        sender: connection._id,
        receiver: req.user._id,
        isRead: false
      });

      return {
        _id: connection._id,
        name: connection.name,
        avatar: connection.avatar,
        email: connection.email,
        lastMessage: lastMessage ? lastMessage.content : null,
        lastMessageAt: lastMessage ? lastMessage.createdAt : null,
        unreadCount
      };
    }));

    // Sort by most recent message
    connectionsWithMeta.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    res.json(connectionsWithMeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching connected users' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort('createdAt');
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: userId,
      content
    });

    // Emit real-time message to receiver
    sendToUser(userId, 'newMessage', message);

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error marking messages as read' });
  }
};
