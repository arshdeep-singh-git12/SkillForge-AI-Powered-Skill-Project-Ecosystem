const Project = require('../models/Project');
const { processProject } = require('../services/assessment-engine.service');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('owner', 'name avatar').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId }).populate('owner', 'name avatar').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, thumbnail } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const project = await Project.create({
      owner: req.user.id,
      title,
      description,
      techStack: techStack || [],
      githubUrl,
      liveUrl,
      thumbnail
    });

    const populatedProject = await Project.findById(project._id).populate('owner', 'name avatar');
    
    // Automatically assess skills based on the new project's tech stack
    await processProject(req.user.id, project._id);

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name avatar');
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleLikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userId = req.user.id;
    const hasLiked = project.likes && project.likes.includes(userId);

    if (hasLiked) {
      project.likes = project.likes.filter(id => id.toString() !== userId.toString());
      
      // Decrement owner total likes
      const User = require('../models/User');
      await User.findByIdAndUpdate(project.owner, { $inc: { totalLikes: -1 } });
    } else {
      project.likes = project.likes || [];
      project.likes.push(userId);
      
      // Increment owner total likes
      const User = require('../models/User');
      await User.findByIdAndUpdate(project.owner, { $inc: { totalLikes: 1 } });
      
      if (project.owner.toString() !== userId.toString()) {
        const Notification = require('../models/Notification');
        await Notification.create({
          recipient: project.owner,
          sender: userId,
          type: 'PROJECT_LIKE',
          title: 'New Like on Project!',
          message: `liked your project "${project.title}".`,
        });
      }
    }
    
    await project.save();
    res.json({ message: hasLiked ? 'Unliked' : 'Liked', likes: project.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllProjects, getUserProjects, createProject, getProjectById, toggleLikeProject };
