require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API key");
    return;
  }
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log("Fetching", url.replace(apiKey, "HIDDEN"));
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log("Available models:");
      data.models.forEach(m => console.log(m.name));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
