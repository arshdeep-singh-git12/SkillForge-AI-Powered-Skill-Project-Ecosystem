require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Team = require('./src/models/Team');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillforge')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seed = async () => {
  await Project.deleteMany({});
  await Team.deleteMany({});
  
  // Need at least one user
  const user = await User.findOne();
  if (!user) {
    console.log('Please create a user first via the signup page.');
    process.exit();
  }

  await Project.create([
    {
      owner: user._id,
      title: 'AI Code Assistant',
      description: 'A deep learning model that helps developers write code faster using Next.js and Python.',
      techStack: ['Python', 'Next.js', 'PyTorch'],
      status: 'in-progress'
    },
    {
      owner: user._id,
      title: 'E-commerce Microservices',
      description: 'A robust backend for an online store using Node.js and Docker.',
      techStack: ['Node.js', 'Docker', 'MongoDB'],
      status: 'completed'
    }
  ]);

  await Team.create([
    {
      owner: user._id,
      name: 'Frontend Wizards',
      description: 'We are building a highly animated portfolio builder and need a React expert.',
      requiredSkills: ['React', 'Framer Motion', 'Tailwind'],
      maxMembers: 3,
      members: [user._id]
    },
    {
      owner: user._id,
      name: 'Data Crusaders',
      description: 'Looking for Python developers to help clean a massive dataset for a hackathon.',
      requiredSkills: ['Python', 'Pandas', 'SQL'],
      maxMembers: 5,
      members: [user._id]
    }
  ]);
  
  console.log('Projects and Teams seeded!');
  process.exit();
};

seed();
