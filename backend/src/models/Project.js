/**
 * Project Model — PLACEHOLDER
 * 
 * Mongoose schema for user project portfolios.
 * 
 * Suggested fields:
 *   - owner: Reference to User who created the project
 *   - title: Project title
 *   - description: Detailed project description
 *   - techStack: Array of technologies used (e.g., ["React", "Node.js", "MongoDB"])
 *   - githubUrl: Link to GitHub repository
 *   - liveUrl: Link to deployed project
 *   - thumbnail: URL to project screenshot/thumbnail
 *   - status: Project status ("in-progress", "completed", "archived")
 *   - collaborators: Array of User references
 *   - tags: Searchable tags
 * 
 * @owner Team Member 3 — Project Portfolio
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    thumbnail: { type: String },
    status: { type: String, enum: ['in-progress', 'completed', 'archived'], default: 'completed' },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Project', projectSchema);
