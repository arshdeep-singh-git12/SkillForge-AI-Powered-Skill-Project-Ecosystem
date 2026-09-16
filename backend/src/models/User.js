/**
 * User Model
 * 
 * Mongoose schema for user accounts.
 * This is the REFERENCE MODEL — use this pattern for all other models.
 * 
 * Fields:
 *   - name: User's display name
 *   - email: Unique email address (used for login)
 *   - passwordHash: bcrypt-hashed password (never expose in API responses)
 *   - avatar: URL to profile picture
 *   - bio: Short biography
 *   - skills: Array of skill references (or embedded sub-documents)
 *   - githubUsername: Connected GitHub account
 *   - role: User role (user, admin)
 *   - createdAt/updatedAt: Timestamps
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never include in query results by default
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    githubUsername: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
