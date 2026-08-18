require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName} ...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Halo, jawab 1 kalimat pendek: siapa kamu?');
      const text = (await result.response).text();
      console.log(`✅ Success with ${modelName}:`, text.trim());
      return modelName;
    } catch (e) {
      console.log(`❌ Failed with ${modelName}:`, e.message);
    }
  }
}

testModels();
