/**
 * services/gemini.service.js
 * Layanan komunikasi ke Google Gemini API dengan retry & model rotation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY tidak ditemukan di environment variables.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate teks menggunakan Gemini dengan automatic retry & fallback
 */
async function generateText(prompt, systemInstruction = '', maxRetries = 2) {
  const ai = getGenAI();
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = ai.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction || 'Anda adalah asisten pedagogik ahli kurikulum dan perancangan Modul Ajar SMK/SMA di Indonesia.'
        });

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        });

        const response = await result.response;
        const text = response.text();
        return text.trim();
      } catch (error) {
        lastError = error;
        // Jika kena 429 Too Many Requests (Rate limit), tunggu sebentar
        if (error.message && error.message.includes('429')) {
          console.warn(`[Rate Limit 429] pada model ${modelName}, menunggu 2.5 detik sebelum coba lagi...`);
          await sleep(2500);
        } else {
          // Jika error 404 / 503, langsung ganti model
          break;
        }
      }
    }
  }

  throw new Error(`Gagal menghasilkan konten dari AI: ${lastError ? lastError.message : 'Semua model sedang sibuk'}`);
}

module.exports = {
  generateText
};
