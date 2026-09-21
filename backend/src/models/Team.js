/**
 * Team Model
 * 
 * Mongoose schema for team formation and management.
 * Follows the User.js reference pattern for validation, indexes, and methods.
 * 
 * Fields:
 *   - name: Team name (unique, required)
 *   - description: Team goals and purpose (required)
 *   - owner: Reference to User who created the team
 *   - members: Array of { user: UserRef, role: String, joinedAt: Date }
 *   - requiredSkills: Array of skill names the team is looking for
 *   - maxMembers: Maximum team size (2-20, default 5)
 *   - status: Team status ('recruiting', 'active', 'completed', 'archived')
 *   - project: Reference to associated Project (optional)
 *   - tags: Categorization tags
 *   - avatar: Team logo or icon URL
 *   - createdAt/updatedAt: Timestamps
 * 
 * @owner Team Member 7 — Teams & Dashboard
 */

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member user reference is required'],
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'lead', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Team description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team must have an owner'],
    },
    members: [memberSchema],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    maxMembers: {
      type: Number,
      default: 5,
      min: [2, 'Team must allow at least 2 members'],
      max: [20, 'Team cannot exceed 20 members'],
    },
    status: {
      type: String,
      enum: ['recruiting', 'active', 'completed', 'archived'],
      default: 'recruiting',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
teamSchema.index({ owner: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ requiredSkills: 1 });
teamSchema.index({ 'members.user': 1 });

/**
 * Clean up object when converting to JSON:
 * Removes __v and ensures id property is available.
 */
teamSchema.methods.toJSON = function () {
  const team = this.toObject();
  if (team._id) {
    team.id = team._id.toString();
  }
  delete team.__v;
  return team;
};

/**
 * Checks if a given userId is already a member of the team.
 * 
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {boolean}
 */
teamSchema.methods.isMember = function (userId) {
  if (!userId) return false;
  const uid = userId.toString();
  return (this.members || []).some((member) => {
    if (!member.user) return false;
    const memberUserId = member.user._id
      ? member.user._id.toString()
      : member.user.toString();
    return memberUserId === uid;
  });
};

/**
 * Checks if the team has reached its member limit.
 * 
 * @returns {boolean}
 */
teamSchema.methods.isFull = function () {
  return (this.members || []).length >= this.maxMembers;
};

module.exports = mongoose.model('Team', teamSchema);
