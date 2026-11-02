const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn("Google OAuth credentials missing. Google login will not work.");
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
      let user = await User.findOne({ email });
      
      if (user) {
        if (!user.githubId) {
          user.githubId = profile.id;
          user.githubUsername = profile.username;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName || profile.username,
        email: email,
        githubId: profile.id,
        githubUsername: profile.username
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn("GitHub OAuth credentials missing. GitHub login will not work.");
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "/api/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (!email) {
        return done(new Error("No email found from LinkedIn"), null);
      }
      
      let user = await User.findOne({ email });
      
      if (user) {
        if (!user.linkedinId) {
          user.linkedinId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName,
        email: email,
        linkedinId: profile.id,
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.warn("LinkedIn OAuth credentials missing. LinkedIn login will not work.");
}

module.exports = passport;
