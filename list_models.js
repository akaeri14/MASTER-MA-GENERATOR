require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  console.log('Available models:');
  if (data.models) {
    data.models.forEach(m => {
      if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
        console.log(` - ${m.name} (${m.displayName})`);
      }
    });
  } else {
    console.log(data);
  }
}

listModels();
