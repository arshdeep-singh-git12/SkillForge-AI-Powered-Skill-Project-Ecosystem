require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { evaluateProfileLinks } = require('./src/services/profile-evaluator.service');

mongoose.connect(process.env.MONGODB_URI === 'memory' ? 'mongodb://127.0.0.1:27017/skillforge' : process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const user = await User.findOne({ name: 'ABC Singh' });
    if (user) {
      console.log('Found user, triggering evaluation...');
      await evaluateProfileLinks(user._id);
      
      // wait a bit for it to complete
      setTimeout(async () => {
        const updatedUser = await User.findById(user._id);
        console.log('New evaluation:', updatedUser.profileEvaluation);
        process.exit(0);
      }, 5000);
    } else {
      console.log('User not found');
      process.exit(1);
    }
  })
  .catch(err => console.log(err));
