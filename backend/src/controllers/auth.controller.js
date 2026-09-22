const User = require('../models/User');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const register = async (req, res) => {
  try {
    const { name, email, password, avatar, githubUrl, linkedinUrl, leetcodeUrl, hackerrankUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      avatar,
      githubUrl,
      linkedinUrl,
      leetcodeUrl,
      hackerrankUrl
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        hackerrankUrl: user.hackerrankUrl
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = generateToken(user._id);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        hackerrankUrl: user.hackerrankUrl
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.json({ message: 'Logout successful' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetTestAccount = async (req, res) => {
  try {
    const testEmail = 'test@example.com';
    const user = await User.findOne({ email: testEmail });
    
    if (user) {
      await Project.deleteMany({ owner: user._id });
      await Skill.deleteMany({ user: user._id });
      await Certification.deleteMany({ user: user._id });
      await User.deleteOne({ _id: user._id });
    }

    // Recreate the user
    await User.create({
      name: 'Test User',
      email: testEmail,
      passwordHash: 'password123',
      githubUrl: 'https://github.com/test',
      linkedinUrl: 'https://linkedin.com/in/test'
    });

    res.json({ message: 'Test account and all associated data have been completely reset!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during reset', error: error.message });
  }
};

module.exports = { register, login, logout, getMe, resetTestAccount };
