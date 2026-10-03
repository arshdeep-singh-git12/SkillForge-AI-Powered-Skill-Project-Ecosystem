const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Project = require('../models/Project');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Predefined mapping of certificates to skills and baseline proficiency
const CERTIFICATE_MAPPINGS = {
  'AWS Certified Developer': { skill: 'AWS', category: 'Cloud Computing', proficiency: 70 },
  'React Professional': { skill: 'React', category: 'Framework', proficiency: 80 },
  'Python Institute Certified Associate': { skill: 'Python', category: 'Language', proficiency: 75 },
};

/**
 * Updates a user's skill based on a new source (challenge, certificate, or project).
 */
const upsertSkillProficiency = async (userId, skillName, category, awardedScore, sourceData) => {
  let skill = await Skill.findOne({ user: userId, name: skillName });

  if (!skill) {
    skill = new Skill({
      user: userId,
      name: skillName,
      category,
      proficiency: 0,
      assessmentSources: []
    });
  }

  // Add the new source
  skill.assessmentSources.push({
    sourceType: sourceData.type,
    sourceId: sourceData.id,
    awardedScore,
    evaluatedAt: new Date()
  });

  // Calculate new proficiency (e.g., take the max score from all sources, or average)
  // Here we take the maximum awarded score among all sources, up to 100.
  const maxScore = Math.max(
    skill.proficiency,
    ...skill.assessmentSources.map(s => s.awardedScore)
  );

  skill.proficiency = Math.min(maxScore, 100);
  await skill.save();

  return skill;
};

/**
 * Process a newly added certification.
 */
const processCertification = async (userId, certificationId) => {
  const cert = await Certification.findById(certificationId);
  if (!cert) return null;

  const mapping = CERTIFICATE_MAPPINGS[cert.title];
  
  if (mapping) {
    return await upsertSkillProficiency(
      userId,
      mapping.skill,
      mapping.category,
      mapping.proficiency,
      { type: 'certificate', id: cert._id }
    );
  }

  // Algorithmic fallback: Scan title for known tech keywords
  const knownSkills = [
    'React', 'Node.js', 'Python', 'AWS', 'Java', 'C++', 'C#', 
    'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'Docker', 
    'Kubernetes', 'Backend', 'Frontend', 'Machine Learning', 
    'Data Science', 'Azure', 'GCP', 'Angular', 'Vue', 'HTML', 'CSS'
  ];
  const results = [];
  
  for (const skill of knownSkills) {
    if (cert.title.toLowerCase().includes(skill.toLowerCase())) {
       const updated = await upsertSkillProficiency(
         userId,
         skill,
         'Technology',
         60, // default score for a matched external certificate
         { type: 'certificate', id: cert._id }
       );
       results.push(updated);
    }
  }

  return results.length > 0 ? results : null;
};

/**
 * Process a newly added project (Mock AI implementation).
 * In a real scenario, this would call an LLM with the GitHub repo contents.
 */
const processProject = async (userId, projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const results = [];
  
  if (project.techStack && project.techStack.length > 0) {
    let score = 30; // Fallback default score
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `Analyze this software project and evaluate the proficiency demonstrated for its tech stack.
        Project Title: ${project.title}
        Description: ${project.description || 'No description provided'}
        Status: ${project.status}
        Technologies Used: ${project.techStack.join(', ')}
        
        Based on the complexity typically associated with these technologies and the project details provided, assign an overall estimated proficiency score from 1 to 100 for this project's implementation.
        Respond ONLY with a single JSON object in this exact format, with no markdown formatting:
        {"score": 85}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        const parsedResponse = JSON.parse(responseText);
        
        if (parsedResponse.score && !isNaN(parsedResponse.score)) {
          score = Number(parsedResponse.score);
          console.log(`🤖 Gemini AI Assessed project "${project.title}": awarded ${score} points.`);
        }
      } else {
        console.warn("No GEMINI_API_KEY found, falling back to basic heuristic scoring.");
        // Basic heuristic fallback if no API key
        score += project.techStack.length * 10;
        if (project.status === 'completed') score += 10;
        score = Math.min(score, 100);
      }
    } catch (err) {
      console.error("Gemini API Error in processProject:", err.message);
      // Fallback
      score = 50 + (project.techStack.length * 5);
      score = Math.min(score, 100);
    }

    for (const tech of project.techStack) {
      const updatedSkill = await upsertSkillProficiency(
        userId,
        tech.trim(),
        'Technology',
        score,
        { type: 'project', id: project._id }
      );
      results.push(updatedSkill);
    }
  }

  return results;
};

module.exports = {
  processCertification,
  processProject
};
