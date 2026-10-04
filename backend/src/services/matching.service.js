/**
 * Matching Service
 * 
 * Rule-based team matching algorithm.
 * Matches users to teams based on required skills and team availability.
 * NOTE: This is rule-based matching (v1), independent of the Skill model.
 * 
 * @owner Team Member 7 — Teams & Dashboard
 */

const Team = require('../models/Team');

/**
 * Calculate match score between candidate skills and a team's required skills.
 * 
 * @param {string[]} userSkills - Array of skill names candidate has
 * @param {string[]} requiredSkills - Array of skill names team requires
 * @returns {{ score: number, matchedSkills: string[], missingSkills: string[] }}
 */
const calculateMatchScore = (userSkills = [], requiredSkills = []) => {
  const normalizedUserSkills = new Set(
    (Array.isArray(userSkills) ? userSkills : [])
      .filter((skill) => typeof skill === 'string' && skill.trim().length > 0)
      .map((skill) => skill.trim().toLowerCase()),
  );

  const validRequiredSkills = (Array.isArray(requiredSkills) ? requiredSkills : [])
    .filter((skill) => typeof skill === 'string' && skill.trim().length > 0);

  // If the team has no specific required skills, match score is 100%
  if (validRequiredSkills.length === 0) {
    return {
      score: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  validRequiredSkills.forEach((skill) => {
    const normalized = skill.trim().toLowerCase();
    if (normalizedUserSkills.has(normalized)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const score = Math.round((matchedSkills.length / validRequiredSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

/**
 * Find recruiting teams that match candidate skills, sorted highest score first.
 * Only recruiting teams that are not full are returned.
 * 
 * @param {string[]} userSkills - Array of skill strings
 * @param {object} [options]
 * @param {number} [options.minScore=0] - Minimum matchScore threshold (default 0)
 * @returns {Promise<Array<{ team: object, matchScore: number, matchedSkills: string[], missingSkills: string[] }>>}
 */
const findMatchingTeams = async (userSkills = [], options = {}) => {
  const minScore = typeof options.minScore === 'number' ? options.minScore : 0;

  // Query only teams that are recruiting
  const teams = await Team.find({ status: 'recruiting' })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('project', 'title description');

  // Filter out teams that have reached maximum capacity
  const availableTeams = teams.filter((team) => !team.isFull());

  const results = [];

  for (const team of availableTeams) {
    const { score, matchedSkills, missingSkills } = calculateMatchScore(
      userSkills,
      team.requiredSkills,
    );

    if (score >= minScore) {
      results.push({
        team: team.toJSON(),
        matchScore: score,
        matchedSkills,
        missingSkills,
      });
    }
  }

  // Sort descending: highest matchScore first
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
};

/**
 * Find matching candidate members for a team (stub for future phase when Skill model is ready).
 * 
 * @param {string} _teamId
 * @returns {Promise<Array>}
 */
const findMatchingMembers = async (_teamId) => {
  return [];
};

module.exports = {
  calculateMatchScore,
  findMatchingTeams,
  findMatchingMembers,
};
