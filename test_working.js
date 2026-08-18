require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ['gemini-2.5-flash-lite', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
  for (const m of models) {
    try {
      console.log(`Trying ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Halo, jawab: "OK"');
      const text = (await res.response).text();
      console.log(`✅ Success with ${m}:`, text.trim());
      return m;
    } catch (e) {
      console.log(`❌ Failed ${m}:`, e.message);
    }
  }
}

testWorkingModel();
