/**
 * Layanan komunikasi ke Google Gemini.
 * Nama file dan kontrak generateText dipertahankan agar seluruh endpoint lama kompatibel.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest'
].filter(Boolean);
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 45000);
const DEFAULT_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 1);
let genAI;

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak ditemukan di environment variables.');
  }
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout Gemini setelah ${timeoutMs} ms.`)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function isRetryable(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('429') || message.includes('503') || message.includes('500') ||
    message.includes('timeout') || message.includes('fetch failed') || message.includes('temporarily');
}

async function generateText(prompt, systemInstruction = '', maxRetries = 2) {
  const ai = getGenAI();
  const retries = Math.max(0, Math.min(Number(maxRetries) || DEFAULT_MAX_RETRIES, DEFAULT_MAX_RETRIES));
  let lastError = null;

  for (const modelName of [...new Set(CANDIDATE_MODELS)]) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const model = ai.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction || 'Anda adalah perancang pembelajaran profesional yang subject-agnostic.'
        });
        const result = await withTimeout(model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          // 1024 token terlalu mudah memotong keluaran kegiatan/asesmen.
          // Beri ruang cukup agar kalimat selesai, sementara prompt tetap membatasi panjangnya.
          generationConfig: { temperature: 0.55, maxOutputTokens: 4096 }
        }), REQUEST_TIMEOUT_MS);
        const text = (await result.response).text();
        if (!text?.trim()) throw new Error('Gemini mengembalikan respons kosong.');
        return text.trim();
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt >= retries) break;
        console.warn(`[Gemini] ${modelName} gagal; retry ${attempt + 1}/${retries}.`);
        await sleep(1000);
      }
    }
  }

  throw new Error(`Gagal menghasilkan konten dari Gemini: ${lastError?.message || 'Semua model tidak tersedia.'}`);
}

module.exports = { generateText };
