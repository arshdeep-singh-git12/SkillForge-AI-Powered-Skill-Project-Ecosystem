require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `You are a technical recruiter AI. Analyze this user's professional developer profile based on the linked platforms they have provided.
        User Name: ABC Singh
        Bio: Not provided
        GitHub Provided: Yes (https://github.com/abc)
        LinkedIn Provided: Yes (https://linkedin.com/in/abc)
        LeetCode Provided: No
        HackerRank Provided: No
        
        Write a short, encouraging 2-3 paragraph analysis of their profile setup. Highlight the strengths of the platforms they have connected (e.g., GitHub shows open source commitment, Leetcode shows algorithmic skills) and provide 1 tip on what they could focus on next.
        Start the response with "### AI Profile Analysis". Keep it professional and concise.`;

    const result = await model.generateContent(prompt);
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}

test();
