require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('Testing with API KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const result = await model.generateContent("Say hello!");
    console.log("Success! Response:", result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testGemini();
