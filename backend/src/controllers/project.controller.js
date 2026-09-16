const Project = require('../models/Project');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('owner', 'name avatar').sort({ createdAt: -1 });
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

module.exports = { getAllProjects, createProject, getProjectById };
