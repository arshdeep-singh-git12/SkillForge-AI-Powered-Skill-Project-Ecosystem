const express = require('express');
const router = express.Router();
const axios = require('axios');

// Sample Coding Problems
const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum / Add Numbers',
    description: 'Write a program that reads two numbers from input and prints their sum.',
    initialCode: {
      python: '# Read input and print sum\nimport sys\nlines = sys.stdin.read().split()\nif lines:\n    print(int(lines[0]) + int(lines[1]))\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    if(cin >> a >> b) cout << (a + b);\n    return 0;\n}\n',
      c: '#include <stdio.h>\nint main() {\n    int a, b;\n    if(scanf("%d %d", &a, &b) == 2) printf("%d", a + b);\n    return 0;\n}\n'
    },
    testCases: [
      { input: '5 7', expectedOutput: '12' },
      { input: '10 -3', expectedOutput: '7' }
    ],
    points: 50
  },
  {
    id: 'reverse-string',
    title: 'Reverse Output',
    description: 'Read a word from input and print it reversed.',
    initialCode: {
      python: 'import sys\nword = sys.stdin.read().strip()\nprint(word[::-1])\n',
      cpp: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    if(cin >> s) {\n        reverse(s.begin(), s.end());\n        cout << s;\n    }\n    return 0;\n}\n',
      c: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[100];\n    if(scanf("%s", s) == 1) {\n        int len = strlen(s);\n        for(int i = len - 1; i >= 0; i--) putchar(s[i]);\n    }\n    return 0;\n}\n'
    },
    testCases: [
      { input: 'skillforge', expectedOutput: 'egroflliks' },
      { input: 'hello', expectedOutput: 'olleh' }
    ],
    points: 50
  }
];

// Get list of available problems
router.get('/problems', (req, res) => {
  res.json({ success: true, problems: PROBLEMS });
});

// Submit code execution via Piston API with test case validation
router.post('/submit', async (req, res) => {
  const { language, code, problemId } = req.body;

  const problem = PROBLEMS.find(p => p.id === problemId) || PROBLEMS[0];
  const langMap = { python: 'python', c: 'c', cpp: 'c++' };
  const pistonLang = langMap[language] || 'python';

  let passedCases = 0;
  const testResults = [];

  try {
    for (const test of problem.testCases) {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: pistonLang,
        version: '*',
        files: [{ content: code }],
        stdin: test.input
      });

      const actualOutput = (response.data.run.output || '').trim();
      const passed = actualOutput === test.expectedOutput.trim();
      if (passed) passedCases++;

      testResults.push({
        input: test.input,
        expected: test.expectedOutput,
        actual: actualOutput,
        passed,
        stderr: response.data.run.stderr
      });
    }

    const allPassed = passedCases === problem.testCases.length;
    const earnedPoints = allPassed ? problem.points : Math.floor((passedCases / problem.testCases.length) * problem.points);

    res.json({
      success: true,
      allPassed,
      passedCases,
      totalCases: problem.testCases.length,
      earnedPoints,
      maxPoints: problem.points,
      results: testResults
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;