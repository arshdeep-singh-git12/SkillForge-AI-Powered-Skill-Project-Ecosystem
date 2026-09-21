const Assessment = require('../models/Assessment');
const User = require('../models/User');

const seedAssessments = async () => {
  try {
    const count = await Assessment.countDocuments();
    if (count > 0) {
      console.log('✅ Assessments already seeded.');
      return;
    }

    console.log('🌱 Seeding default coding challenges...');

    const defaultAssessments = [
      {
        title: 'Data Filtering Logic',
        description: 'Write a function that takes a list of numbers and returns a new list containing only the even numbers. Ensure your function is named "filter_evens" and takes one argument.',
        difficulty: 'easy',
        language: 'python',
        points: 10,
        starterCode: 'def filter_evens(numbers):\n    # Your code here\n    pass\n\n# Do not modify below this line\nprint(filter_evens([1, 2, 3, 4, 5, 6]))',
        testCases: [
          {
            input: '[1, 2, 3, 4, 5, 6]',
            expectedOutput: '[2, 4, 6]',
          }
        ]
      },
      {
        title: 'Algorithmic Array Reversal',
        description: 'Write a JavaScript function named "reverseArray" that takes an array and returns a new array with the elements in reverse order without using the built-in .reverse() method.',
        difficulty: 'medium',
        language: 'javascript',
        points: 20,
        starterCode: 'function reverseArray(arr) {\n  // Your code here\n  return arr;\n}\n\n// Test output\nconsole.log(reverseArray([10, 20, 30]));',
        testCases: [
          {
            input: '[10, 20, 30]',
            expectedOutput: '[ 30, 20, 10 ]',
          }
        ]
      },
      {
        title: 'Optimized Two-Sum',
        description: 'Given an array of integers and an integer target, write a C++ program that prints the indices of the two numbers such that they add up to target. The starter code handles input reading.',
        difficulty: 'hard',
        language: 'c++',
        points: 40,
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid twoSum(vector<int>& nums, int target) {\n    // Your code here. Print the two indices separated by a space.\n    \n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    twoSum(nums, 9);\n    return 0;\n}',
        testCases: [
          {
            input: 'nums = [2, 7, 11, 15], target = 9',
            expectedOutput: '0 1',
          }
        ]
      }
    ];

    await Assessment.insertMany(defaultAssessments);
    console.log('✅ Successfully seeded 3 coding challenges!');
  } catch (error) {
    console.error('❌ Failed to seed assessments:', error.message);
  }
};

const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log('✅ Users already seeded.');
      return;
    }

    console.log('🌱 Seeding default test user...');
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'password123'
    });
    console.log('✅ Successfully seeded default test user (test@example.com / password123)');
  } catch (error) {
    console.error('❌ Failed to seed users:', error.message);
  }
};

module.exports = { seedAssessments, seedUsers };

