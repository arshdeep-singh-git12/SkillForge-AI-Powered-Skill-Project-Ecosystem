require('dotenv').config();
const mongoose = require('mongoose');
const Assessment = require('./src/models/Assessment');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillforge')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seed = async () => {
  await Assessment.deleteMany({});
  
  await Assessment.create([
    {
      title: 'Hello World in Python',
      description: 'Write a python program that prints "Hello, World!" to the standard output.',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'def main():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    main()',
      points: 10,
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, World!'
        }
      ]
    },
    {
      title: 'Add Two Numbers in C++',
      description: 'Write a C++ program that reads two space-separated integers from the standard input and prints their sum.',
      difficulty: 'easy',
      language: 'c++',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
      points: 20,
      testCases: [
        {
          input: '5 7',
          expectedOutput: '12'
        },
        {
          input: '100 -50',
          expectedOutput: '50'
        }
      ]
    }
  ]);
  
  console.log('Assessments seeded!');
  process.exit();
};

seed();
