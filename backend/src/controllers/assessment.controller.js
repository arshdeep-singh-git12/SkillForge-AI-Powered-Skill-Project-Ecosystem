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

    let finalCode = code;
    if (language === 'python' || language === 'py') {
      if (!finalCode.includes('import sys')) {
        finalCode = `import sys, json\n${finalCode}`;
      }
      
      // The DB accidentally got seeded with "if __name__ == __main__:" (no quotes)
      const hasMain = finalCode.includes('if __name__ == "__main__":') || 
                      finalCode.includes("if __name__ == '__main__':") ||
                      finalCode.includes("if __name__ == __main__:");
                      
      if (!hasMain) {
        const starterCode = assessment.starterCode;
        let mainIndex = starterCode.indexOf('if __name__ == "__main__":');
        if (mainIndex === -1) mainIndex = starterCode.indexOf("if __name__ == '__main__':");
        if (mainIndex === -1) mainIndex = starterCode.indexOf("if __name__ == __main__:");
          
        if (mainIndex !== -1) {
          let driverCode = starterCode.substring(mainIndex);
          // Fix the syntax error from the DB seed dynamically!
          driverCode = driverCode.replace("if __name__ == __main__:", 'if __name__ == "__main__":');
          
          // Smart function name inference: Find what the user named their function
          const userFuncMatch = finalCode.match(/def\s+([a-zA-Z_]\w*)\s*\(/);
          if (userFuncMatch) {
            const userFuncName = userFuncMatch[1];
            // Find the original function name in the starter code
            const originalFuncMatch = starterCode.match(/def\s+([a-zA-Z_]\w*)\s*\(/);
            if (originalFuncMatch) {
               const originalFuncName = originalFuncMatch[1];
               if (userFuncName !== originalFuncName) {
                 // Rewrite the driver code to use the user's custom function name!
                 driverCode = driverCode.replace(new RegExp(originalFuncName + '\\(', 'g'), userFuncName + '(');
               }
            }
          }

          finalCode = `${finalCode}\n\n${driverCode}`;
        }
      }
    }

    let allPassed = true;
    let results = [];

    // Run code against each test case sequentially
    for (const testCase of assessment.testCases) {
      const execResult = await pistonService.executeCode(language, version, finalCode, testCase.input);
      
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
      const Skill = require('../models/Skill');
      const User = require('../models/User');

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
          badgeImage: '🏆' 
        });
      }

      // Update Skills Bar
      const skillsToUpdate = [
        { name: language, category: 'Language', points: 5 },
        { name: 'Algorithms', category: 'Computer Science', points: 10 }
      ];

      const user = await User.findById(req.user.id);
      
      for (const st of skillsToUpdate) {
        let skillRecord = await Skill.findOne({ user: req.user.id, name: new RegExp(`^${st.name}$`, 'i') });
        
        if (!skillRecord) {
          skillRecord = await Skill.create({
            user: req.user.id,
            name: st.name,
            category: st.category,
            proficiency: st.points,
            assessmentSources: [assessment._id]
          });
          
          if (user && !user.skills.includes(skillRecord._id)) {
            user.skills.push(skillRecord._id);
            await user.save();
          }
        } else {
          // Check if already awarded for this specific assessment
          if (!skillRecord.assessmentSources.includes(assessment._id)) {
            skillRecord.proficiency += st.points;
            if (skillRecord.proficiency > 100) skillRecord.proficiency = 100;
            skillRecord.assessmentSources.push(assessment._id);
            await skillRecord.save();
          }
        }
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

const seedLeetcode = async (req, res) => {
  res.json({ message: 'Assessments already seeded.' });
};

module.exports = { getAllAssessments, getAssessmentById, submitCode, getResults, seedLeetcode };
