const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/seed', assessmentController.seedLeetcode);
router.get('/', assessmentController.getAllAssessments);
router.get('/:id', assessmentController.getAssessmentById);
router.post('/:id/submit', protect, assessmentController.submitCode);
router.get('/:id/results', protect, assessmentController.getResults);

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