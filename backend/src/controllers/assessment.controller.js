const Assessment = require('../models/Assessment');
const pistonService = require('../services/piston.service');

const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().select('-testCases');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).select('-testCases');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Determine version (hardcoded for simplicity, usually fetched from /runtimes)
    let version = '*';
    if (language === 'python') version = '3.10.0';
    if (language === 'cpp' || language === 'c++') version = '10.2.0';

    let allPassed = true;
    let results = [];

    // Run code against each test case sequentially
    for (const testCase of assessment.testCases) {
      const execResult = await pistonService.executeCode(language, version, code, testCase.input);
      
      const output = execResult.run.stdout.trim();
      const expected = testCase.expectedOutput.trim();
      
      const passed = output === expected && execResult.run.code === 0;
      if (!passed) allPassed = false;

      results.push({
        input: testCase.input,
        expectedOutput: expected,
        actualOutput: output,
        stderr: execResult.run.stderr,
        passed
      });

      // Stop testing if one fails to save resources (optional)
      if (!passed) break;
    }

    const finalResult = allPassed ? 'passed' : 'failed';

    // Save submission
    assessment.submissions.push({
      user: req.user.id,
      code,
      result: finalResult
    });
    
    await assessment.save();

    // Automatically award a trophy certification if passed
    if (allPassed) {
      const Certification = require('../models/Certification');
      // Check if user already has this trophy
      const existingTrophy = await Certification.findOne({ 
        user: req.user.id, 
        title: assessment.title,
        type: 'assessment'
      });

      if (!existingTrophy) {
        await Certification.create({
          user: req.user.id,
          title: assessment.title,
          issuer: 'SkillForge',
          description: `Awarded for successfully solving the coding challenge: ${assessment.title}`,
          dateEarned: new Date(),
          type: 'assessment',
          badgeImage: '🏆' // UI can render this emoji or map it to an actual image
        });
      }
    }

    res.json({
      success: allPassed,
      message: allPassed ? `Passed! Earned ${assessment.points} points.` : 'Failed. Check your output.',
      results,
      pointsAwarded: allPassed ? assessment.points : 0
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getResults = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Not found' });
    
    const userSubmissions = assessment.submissions.filter(sub => sub.user.toString() === req.user.id);
    res.json(userSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllAssessments, getAssessmentById, submitCode, getResults };
