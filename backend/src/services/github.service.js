const axios = require('axios');
const Project = require('../models/Project');
const { processProject } = require('./assessment-engine.service');

/**
 * Extracts a GitHub username from a GitHub profile URL.
 * @param {string} url - The GitHub URL
 * @returns {string|null} - The username or null
 */
const extractGithubUsername = (url) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
};

/**
 * Syncs the user's latest 5 public GitHub repositories into SkillForge Projects.
 * @param {Object} user - The user document
 */
const syncGithubProjects = async (user) => {
  try {
    const username = extractGithubUsername(user.githubUrl);
    if (!username) return;

    // Fetch the 100 most recently pushed public repositories
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = response.data;

    if (!Array.isArray(repos) || repos.length === 0) return;

    for (const repo of repos) {
      // Check if project already exists to avoid duplicates
      const existingProject = await Project.findOne({ owner: user._id, title: repo.name });
      if (!existingProject) {
        const project = await Project.create({
          owner: user._id,
          title: repo.name,
          description: repo.description || 'GitHub Repository',
          techStack: repo.language ? [repo.language] : [],
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || '',
        });

        // Trigger assessment for the new project
        await processProject(user._id, project._id);
      }
    }
    
    console.log(`✅ GitHub Sync: Synced repositories for ${username}`);
  } catch (error) {
    console.error(`❌ GitHub Sync Error for user ${user._id}:`, error.message);
  }
};

module.exports = {
  extractGithubUsername,
  syncGithubProjects,
};
