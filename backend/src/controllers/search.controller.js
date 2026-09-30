const User = require('../models/User');
const Project = require('../models/Project');

const globalSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ users: [], projects: [] });
    }

    const regex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [
        { name: regex },
        { bio: regex }
      ]
    }).select('name avatar bio').limit(5);

    const projects = await Project.find({
      $or: [
        { title: regex },
        { description: regex },
        { techStack: regex }
      ]
    }).populate('owner', 'name avatar').limit(5);

    res.json({ users, projects });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

module.exports = { globalSearch };
