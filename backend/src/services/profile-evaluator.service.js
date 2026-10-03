const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const evaluateProfileLinks = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const hasGithub = !!user.githubUrl;
    const hasLinkedin = !!user.linkedinUrl;
    const hasLeetcode = !!user.leetcodeUrl;
    const hasHackerrank = !!user.hackerrankUrl;

    if (!hasGithub && !hasLinkedin && !hasLeetcode && !hasHackerrank) {
      user.profileEvaluation = '';
      await user.save();
      return;
    }

    let evaluation = '';
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `You are a technical recruiter AI. Analyze this user's professional developer profile based on the linked platforms they have provided.
        User Name: ${user.name}
        Bio: ${user.bio || 'Not provided'}
        GitHub Provided: ${hasGithub ? 'Yes (' + user.githubUrl + ')' : 'No'}
        LinkedIn Provided: ${hasLinkedin ? 'Yes (' + user.linkedinUrl + ')' : 'No'}
        LeetCode Provided: ${hasLeetcode ? 'Yes (' + user.leetcodeUrl + ')' : 'No'}
        HackerRank Provided: ${hasHackerrank ? 'Yes (' + user.hackerrankUrl + ')' : 'No'}
        
        Write a short, encouraging 2-3 paragraph analysis of their profile setup. Highlight the strengths of the platforms they have connected (e.g., GitHub shows open source commitment, Leetcode shows algorithmic skills) and provide 1 tip on what they could focus on next.
        Start the response with "### AI Profile Analysis". Keep it professional and concise.`;

        const result = await model.generateContent(prompt);
        evaluation = result.response.text();
        console.log(`🤖 Gemini AI Profile Evaluation generated for user: ${user._id}`);
      } else {
        // Fallback static evaluation if no API key
        console.warn("No GEMINI_API_KEY found, falling back to static profile evaluation.");
        evaluation = `### AI Profile Analysis\n\n`;
        let score = 50;

        if (hasGithub) {
          evaluation += `**GitHub Analysis:** Your GitHub profile shows a strong foundation in version control and software development.\n\n`;
          score += 20;
        }
        if (hasLinkedin) {
          evaluation += `**Professional Network:** Your LinkedIn presence is established.\n\n`;
          score += 10;
        }
        if (hasLeetcode || hasHackerrank) {
          evaluation += `**Algorithmic Proficiency:** Linking your coding challenge profiles demonstrates a strong commitment to mastering data structures and algorithms.\n\n`;
          score += 20;
        }

        evaluation += `**Overall Setup Score:** ${score}/100\n\n*Tip:* To improve your profile evaluation, continue engaging with these platforms.`;
      }
    } catch (err) {
      console.error("Gemini API Error in evaluateProfileLinks:", err.message);
      
      // ROCK SOLID FALLBACK IF AI FAILS (presentation mode)
      evaluation = `### AI Profile Analysis\n\n`;
      let score = 50;

      if (hasGithub) {
        evaluation += `**GitHub Analysis:** Your GitHub profile shows a strong foundation in version control and software development.\n\n`;
        score += 20;
      }
      if (hasLinkedin) {
        evaluation += `**Professional Network:** Your LinkedIn presence is established.\n\n`;
        score += 10;
      }
      if (hasLeetcode || hasHackerrank) {
        evaluation += `**Algorithmic Proficiency:** Linking your coding challenge profiles demonstrates a strong commitment to mastering data structures and algorithms.\n\n`;
        score += 20;
      }

      evaluation += `**Overall Setup Score:** ${score}/100\n\n*Tip:* To improve your profile evaluation, continue engaging with these platforms.`;
    }

    user.profileEvaluation = evaluation;
    await user.save();
  } catch (error) {
    console.error('Error evaluating profile:', error);
  }
};

module.exports = { evaluateProfileLinks };
