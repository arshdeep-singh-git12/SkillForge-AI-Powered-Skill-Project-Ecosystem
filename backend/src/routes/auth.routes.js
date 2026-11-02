const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User');

const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to generate token and set cookie after successful OAuth
const handleOAuthCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  let frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl || frontendUrl === '*' || !frontendUrl.startsWith('http')) {
    if (req.headers.referer) {
      try {
        const refUrl = new URL(req.headers.referer);
        frontendUrl = refUrl.origin;
      } catch (e) {
        frontendUrl = 'https://skill-forge-ai-powered-skill-projec-two.vercel.app';
      }
    } else {
      frontendUrl = 'https://skill-forge-ai-powered-skill-projec-two.vercel.app';
    }
  }
  frontendUrl = frontendUrl.replace(/\/+$/, '');
  
  // If user hasn't completed bio, send to onboarding
  const targetPath = (req.user && !req.user.bio) ? '/onboarding' : '/dashboard';
  res.redirect(`${frontendUrl}${targetPath}?token=${token}`);
};

const handleDemoOAuthLogin = async (name, email, avatar, req, res) => {
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        passwordHash: 'oauth_user',
        avatar,
        bio: '', // Empty bio so onboarding is required
      });
    }
    req.user = user;
    return handleOAuthCallback(req, res);
  } catch (err) {
    console.error('OAuth login error:', err);
    let frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl || frontendUrl === '*' || !frontendUrl.startsWith('http')) {
      frontendUrl = 'https://skill-forge-ai-powered-skill-projec-two.vercel.app';
    }
    frontendUrl = frontendUrl.replace(/\/+$/, '');
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-test-account', authController.resetTestAccount);
router.get('/me', protect, authController.getMe);

// Google OAuth
router.get('/google', async (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return handleDemoOAuthLogin('Google User', 'google.user@skillforge.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser', req, res);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

// GitHub OAuth
router.get('/github', async (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return handleDemoOAuthLogin('GitHub User', 'github.user@skillforge.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GitHubUser', req, res);
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

// LinkedIn OAuth
router.get('/linkedin', async (req, res, next) => {
  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
    return handleDemoOAuthLogin('LinkedIn User', 'linkedin.user@skillforge.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LinkedInUser', req, res);
  }
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })(req, res, next);
});
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

module.exports = router;
