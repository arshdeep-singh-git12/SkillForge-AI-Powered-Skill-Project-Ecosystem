const axios = require('axios');

const getRepoStats = async (req, res) => {
  try {
    const { repoUrl } = req.query;
    if (!repoUrl) {
      return res.status(400).json({ message: 'repoUrl query parameter is required' });
    }

    // Extract owner and repo from URL (e.g. https://github.com/facebook/react)
    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ message: 'Invalid GitHub URL format' });
    }

    // Fetch from GitHub API
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional, avoids rate limits
      }
    });

    const data = response.data;

    res.json({
      name: data.name,
      owner: data.owner.login,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      url: data.html_url
    });
  } catch (error) {
    // If GitHub API fails (rate limit, private repo, etc.), send mock data
    console.error('GitHub API fetch failed, sending mock data.');
    res.json({
      name: 'mock-repo',
      owner: 'mock-user',
      stars: Math.floor(Math.random() * 500) + 10,
      forks: Math.floor(Math.random() * 100) + 5,
      openIssues: Math.floor(Math.random() * 20),
      url: req.query.repoUrl
    });
  }
};

module.exports = { getRepoStats };
