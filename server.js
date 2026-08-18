/**
 * server.js
 * Backend Express Server untuk AI Modul Ajar Generator
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const {
  LEARNING_MODELS,
  APERSEPSI_TYPES,
  DEFAULT_METODE,
  DEFAULT_MEDIA,
  UKRK_LEVELS,
  FASE_OPTIONS
} = require('./config/models.config');

const { generateText } = require('./services/gemini.service');
const {
  buildApersepsiPrompt,
  buildSyntaxStepPrompt,
  buildAssessmentPrompt,
  buildPembukaanPrompt,
  buildPenutupanPrompt
} = require('./services/prompt.service');

const { generateMergedDocx } = require('./services/mailmerge.service');
const { validateModulData } = require('./services/validation.service');
const { buildLearningDesignContract, validateLearningDesign } = require('./services/learning-design.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- API ENDPOINTS ---

/**
 * 1. Ambil Konfigurasi Model Pembelajaran, Sintaks, Apersepsi, dll.
 */
app.get('/api/config/models', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        models: LEARNING_MODELS,
        apersepsiTypes: APERSEPSI_TYPES,
        defaultMetode: DEFAULT_METODE,
        defaultMedia: DEFAULT_MEDIA,
        ukrkLevels: UKRK_LEVELS,
        faseOptions: FASE_OPTIONS
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. Generate Apersepsi dengan AI
 */
app.post('/api/ai/generate-apersepsi', async (req, res) => {
  try {
    const data = req.body;
    if (!data.materi) {
      return res.status(400).json({ success: false, error: 'Materi pokok wajib diisi terlebih dahulu.' });
    }

    const prompt = buildApersepsiPrompt(data);
    const result = await generateText(prompt, 'Anda adalah perancang pembelajaran profesional yang ahli membuat apersepsi menarik dan kontekstual.');

    res.json({
      success: true,
      data: {
        apersepsi: result
      }
    });
  } catch (error) {
    console.error('Error generate apersepsi:', error);
    res.status(500).json({ success: false, error: error.message || 'AI gagal menghasilkan konten. Silakan coba lagi.' });
  }
});

/**
 * 3. Generate Kegiatan Sintaks Spesifik dengan AI
 */
app.post('/api/ai/generate-step', async (req, res) => {
  try {
    const { modulData, stepId } = req.body;
    if (!modulData || !modulData.modelId) {
      return res.status(400).json({ success: false, error: 'Data modul dan model pembelajaran harus dipilih.' });
    }

    const modelConfig = LEARNING_MODELS[modulData.modelId];
    if (!modelConfig) {
      return res.status(400).json({ success: false, error: `Model pembelajaran '${modulData.modelId}' tidak ditemukan.` });
    }

    const stepConfig = modelConfig.steps.find(s => s.id === stepId);
    if (!stepConfig) {
      return res.status(400).json({ success: false, error: `Sintaks '${stepId}' tidak ditemukan pada model ${modelConfig.name}.` });
    }

    const stepIndex = modelConfig.steps.findIndex(step => step.id === stepId);
    const previousStep = stepIndex > 0 ? modelConfig.steps[stepIndex - 1] : null;
    const previousOutput = previousStep
      ? modulData.syntaxValues?.[previousStep.id]
      : modulData.apersepsi;
    const prompt = buildSyntaxStepPrompt(modulData, stepConfig, previousOutput);
    const result = await generateText(prompt, `Anda adalah learning designer subject-agnostic untuk Kurikulum Merdeka. Rancang kegiatan terhubung untuk sintaks ${stepConfig.name}; jangan mengubah CP atau TP guru.`);

    res.json({
      success: true,
      data: {
        stepId,
        content: result
      }
    });
  } catch (error) {
    console.error('Error generate step:', error);
    res.status(500).json({ success: false, error: error.message || 'AI gagal menghasilkan kegiatan. Silakan coba lagi.' });
  }
});

/**
 * 4. Generate Semua Sintaks Sekaligus
 */
app.post('/api/ai/generate-all-steps', async (req, res) => {
  try {
    const { modulData } = req.body;
    if (!modulData || !modulData.modelId) {
      return res.status(400).json({ success: false, error: 'Data modul dan model pembelajaran harus dipilih.' });
    }

    const modelConfig = LEARNING_MODELS[modulData.modelId];
    if (!modelConfig) {
      return res.status(400).json({ success: false, error: `Model pembelajaran '${modulData.modelId}' tidak ditemukan.` });
    }

    const results = {};
    let previousOutput = modulData.apersepsi || '';

    // Generate secara berurutan untuk menjaga reliabilitas kuota/rate limit
    for (const step of modelConfig.steps) {
      const prompt = buildSyntaxStepPrompt(modulData, step, previousOutput);
      const content = await generateText(prompt, `Anda adalah learning designer subject-agnostic untuk Kurikulum Merdeka. Pastikan output tahap sebelumnya menjadi input tahap ${step.name}; jangan mengubah CP atau TP guru.`);
      results[step.id] = content;
      previousOutput = content;
    }

    const qualityGate = validateLearningDesign({ ...modulData, syntaxValues: results }, { requireActivities: true });

    res.json({
      success: true,
      data: results,
      qualityGate
    });
  } catch (error) {
    console.error('Error generate all steps:', error);
    res.status(500).json({ success: false, error: error.message || 'AI gagal menghasilkan kegiatan semua sintaks.' });
  }
});

/**
 * 5. Generate Rekomendasi Asesmen
 */
app.post('/api/ai/generate-assessment', async (req, res) => {
  try {
    const data = req.body;
    const prompt = buildAssessmentPrompt(data);
    const result = await generateText(prompt, 'Anda adalah ahli asesmen pembelajaran Kurikulum Merdeka.');

    res.json({
      success: true,
      data: {
        assessment: result
      }
    });
  } catch (error) {
    console.error('Error generate assessment:', error);
    res.status(500).json({ success: false, error: error.message || 'AI gagal menghasilkan rekomendasi asesmen.' });
  }
});

/**
 * 6. Validasi Kelengkapan Data
 */
app.post('/api/validate', (req, res) => {
  try {
    const validation = validateModulData(req.body);
    const qualityGate = validateLearningDesign(req.body, { requireActivities: validation.isValid });
    res.json({
      success: true,
      ...validation,
      qualityGate,
      // Quality Gate is advisory. The teacher decides whether to download;
      // only missing mandatory form fields may block the DOCX export.
      isValid: validation.isValid
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/** Learning Design Contract and continuity checker. It never generates DOCX text. */
app.post('/api/learning-design/validate', (req, res) => {
  try {
    const requireActivities = Boolean(req.body?.requireActivities);
    res.json({
      success: true,
      qualityGate: validateLearningDesign(req.body, { requireActivities }),
      contract: buildLearningDesignContract(req.body)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 7. Ekspor File DOCX (Mail Merge Engine)
 */
app.post('/api/export/docx', (req, res) => {
  try {
    const data = req.body;

    // Validasi data wajib
    const validation = validateModulData(data);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
        missingFields: validation.missingFields
      });
    }

    const qualityGate = validateLearningDesign(data, { requireActivities: true });

    // Lakukan Mail Merge langsung ke template asli
    const { buffer, fileName } = generateMergedDocx(data);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('X-Learning-Quality', qualityGate.status);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Error export DOCX:', error);
    res.status(500).json({
      success: false,
      error: `Gagal membuat dokumen. Periksa template Mail Merge dan mapping field: ${error.message}`
    });
  }
});

// Fallback route for SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` AI MODUL AJAR GENERATOR SERVER RUNNING ON PORT ${PORT}`);
  console.log(` Open URL: http://localhost:${PORT}`);
  console.log(` Master Template: template.docx (Preserved & Ready)`);
  console.log(`=======================================================`);
});
