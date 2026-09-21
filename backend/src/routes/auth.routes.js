const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

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
    sameSite: 'strict'
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/dashboard`);
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(501).send('<h1>Google Login Not Configured</h1><p>Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your backend .env file.</p>');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

// GitHub OAuth
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) return res.status(501).send('<h1>GitHub Login Not Configured</h1><p>Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your backend .env file.</p>');
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

// LinkedIn OAuth
router.get('/linkedin', (req, res, next) => {
  if (!process.env.LINKEDIN_CLIENT_ID) return res.status(501).send('<h1>LinkedIn Login Not Configured</h1><p>Please add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to your backend .env file.</p>');
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })(req, res, next);
});
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login?error=oauth_failed' }), handleOAuthCallback);

module.exports = router;
