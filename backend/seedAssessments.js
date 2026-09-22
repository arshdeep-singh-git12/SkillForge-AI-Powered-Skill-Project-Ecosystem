require('dotenv').config();
const mongoose = require('mongoose');
const Assessment = require('./src/models/Assessment');

const { connectDB, disconnectDB } = require('./src/config/db');

connectDB().then(() => {
  console.log('MongoDB connected for seeding');
}).catch(err => console.log(err));

const seed = async () => {
  await Assessment.deleteMany({});
  
  await Assessment.create([
    {
      title: '1. Two Sum',
      description: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>\n\n<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>\n\n<p>You can return the answer in any order.</p>\n\n<p>&nbsp;</p>\n<p><strong class="example">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,7,11,15], target = 9\n<strong>Output:</strong> [0,1]\n<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].\n</pre>',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'import sys\nimport json\n\ndef twoSum(nums, target):\n    # Write your logic here\n    pass\n\nif __name__ == "__main__":\n    # Read standard input for test cases\n    input_data = sys.stdin.read().strip().split("\\n")\n    if len(input_data) >= 2:\n        nums = json.loads(input_data[0])\n        target = json.loads(input_data[1])\n        result = twoSum(nums, target)\n        print(json.dumps(result))',
      points: 10,
      testCases: [
        {
          input: '[2, 7, 11, 15]\n9',
          expectedOutput: '[0, 1]'
        },
        {
          input: '[3, 2, 4]\n6',
          expectedOutput: '[1, 2]'
        },
        {
          input: '[3, 3]\n6',
          expectedOutput: '[0, 1]'
        }
      ]
    },
    {
      title: '9. Palindrome Number',
      description: '<p>Given an integer <code>x</code>, return <code>true</code><em> if </em><code>x</code><em> is a </em><span data-keyword="palindrome-integer"><em><strong>palindrome</strong></em></span><em>, and </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class="example">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 121\n<strong>Output:</strong> true\n<strong>Explanation:</strong> 121 reads as 121 from left to right and from right to left.\n</pre>\n\n<p><strong class="example">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = -121\n<strong>Output:</strong> false\n<strong>Explanation:</strong> From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.\n</pre>',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'import sys\nimport json\n\ndef isPalindrome(x):\n    # Write your logic here\n    pass\n\nif __name__ == "__main__":\n    # Read standard input for test cases\n    input_data = sys.stdin.read().strip()\n    if input_data:\n        x = json.loads(input_data)\n        result = isPalindrome(x)\n        print("true" if result else "false")',
      points: 10,
      testCases: [
        {
          input: '121',
          expectedOutput: 'true'
        },
        {
          input: '-121',
          expectedOutput: 'false'
        },
        {
          input: '10',
          expectedOutput: 'false'
        }
      ]
    },
    {
      title: '217. Contains Duplicate',
      description: '<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>\n\n<p>&nbsp;</p>\n<p><strong class="example">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,1]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class="example">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4]\n<strong>Output:</strong> false\n</pre>',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'import sys\nimport json\n\ndef containsDuplicate(nums):\n    # Write your logic here\n    pass\n\nif __name__ == "__main__":\n    # Read standard input for test cases\n    input_data = sys.stdin.read().strip()\n    if input_data:\n        nums = json.loads(input_data)\n        result = containsDuplicate(nums)\n        print("true" if result else "false")',
      points: 10,
      testCases: [
        {
          input: '[1, 2, 3, 1]',
          expectedOutput: 'true'
        },
        {
          input: '[1, 2, 3, 4]',
          expectedOutput: 'false'
        },
        {
          input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]',
          expectedOutput: 'true'
        }
      ]
    }
  ]);
  
  console.log('LeetCode Assessments seeded!');
  await disconnectDB();
  process.exit();
};

seed();
