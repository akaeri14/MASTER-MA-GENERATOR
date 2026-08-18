/**
 * Learning Design Contract, continuity, and alignment checks.
 * This service never writes CP, TP, Pembukaan, Penutup, or DOCX content.
 */

const { LEARNING_MODELS } = require('../config/models.config');
const { MODEL_LIBRARY, SOURCE_REGISTRY } = require('../config/knowledge-base');

const CAPABILITY_PATTERNS = [
  ['menganalisis', /menganalisis|analisis/i],
  ['mengevaluasi', /mengevaluasi|evaluasi|menilai/i],
  ['mencipta', /mencipta|membuat|menghasilkan/i],
  ['merancang', /merancang|desain/i],
  ['menerapkan', /menerapkan|mengaplikasikan|mempraktikkan/i],
  ['menjelaskan', /menjelaskan|menguraikan/i],
  ['mengidentifikasi', /mengidentifikasi|menentukan/i],
  ['memahami', /memahami|mengetahui/i],
  ['mengomunikasikan', /mengomunikasikan|mempresentasikan/i]
];

const IT_ONLY_TERMS = /\b(packet tracer|wireshark|cisco|router|server|linux|konfigurasi jaringan|topologi jaringan)\b/i;
const IT_CONTEXT_TERMS = /\b(tkj|teknik komputer|teknik informatika|informatika|jaringan komputer|keamanan jaringan|firewall|sistem komputer|rekayasa perangkat lunak|rpl|server|router|linux|cisco)\b/i;

function evaluateInstructionClarity(text = '') {
  const normalized = String(text).trim();
  const bullets = normalized.split(/\n+/).filter(line => /^\s*(?:[-•*]|\d+[.)])\s+/.test(line));
  const sentences = normalized.split(/[.!?]+/).map(sentence => sentence.trim()).filter(Boolean);
  const longSentences = sentences.filter(sentence => sentence.split(/\s+/).length > 22).length;
  const longBullets = bullets.filter(bullet => bullet.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, '').split(/\s+/).length > 28).length;
  const hasTeacherRole = /(?:^|\n)\s*(?:[-•*]|\d+[.)])\s*Guru(?:\s|:)/im.test(normalized);
  const hasStudentRole = /(?:^|\n)\s*(?:[-•*]|\d+[.)])\s*Peserta didik(?:\s|:)/im.test(normalized);

  return { longSentences, longBullets, hasTeacherRole, hasStudentRole };
}

function getModel(modelId) {
  return LEARNING_MODELS[modelId] || null;
}

function extractCapabilities(tp = '') {
  return CAPABILITY_PATTERNS.filter(([, pattern]) => pattern.test(tp)).map(([capability]) => capability);
}

function hasSubjectOrMaterialContext(data) {
  return IT_CONTEXT_TERMS.test(`${data.mataPelajaran || ''} ${data.elemenTema || ''} ${data.materi || ''} ${data.subMateri || ''}`);
}

function buildAperceptionOutput(data) {
  const type = data.apersepsiType || 'analogi';
  const artifactByType = {
    analogi: 'konsep familiar dan pertanyaan transfer',
    ctl: 'fenomena kontekstual dan masalah bermakna',
    review: 'pengetahuan prasyarat yang diaktifkan'
  };

  return {
    stage: 'aperception',
    input_state: ['materi', 'TP', type === 'review' ? 'materi sebelumnya' : 'pengalaman peserta didik'],
    activity: [data.apersepsi || 'Apersepsi belum tersedia.'],
    output_state: [artifactByType[type] || artifactByType.analogi],
    tp_refs: ['TP']
  };
}

function buildLearningDesignContract(data) {
  const model = getModel(data.modelId);
  if (!model) return null;

  const aperception = buildAperceptionOutput(data);
  const stages = model.steps.map((step, index) => ({
    knowledge_base: (MODEL_LIBRARY[data.modelId]?.syntax || []).find(item => item.id === step.id) || null,
    stage: `syntax:${step.id}`,
    syntax_id: step.id,
    syntax_name: step.name,
    input_state: index === 0 ? aperception.output_state : [`output:${model.steps[index - 1].id}`],
    target_output_state: [`output:${step.id}`],
    pedagogical_function: step.hint,
    tp_refs: ['TP']
  }));

  return {
    contract_version: '1.0',
    immutable_boundaries: ['opening_template', 'closing_template'],
    subject: data.mataPelajaran || '',
    phase: data.fase || '',
    class: data.kelas || '',
    material: data.materi || '',
    cp: data.cp || '',
    tp: data.tp || '',
    tp_capabilities: extractCapabilities(data.tp),
    model: { id: model.id, name: model.name, syntax_order: model.steps.map(step => step.id) },
    source_reference: SOURCE_REGISTRY[data.modelId] || { status: 'source_required' },
    aperception,
    stages
  };
}

function scoreTransition({ fromText, toText, transition, isFinal = false }) {
  const issues = [];
  let score = 10;

  if (!fromText || !String(fromText).trim()) {
    score -= 5;
    issues.push('Tahap sebelumnya belum memiliki konten atau output belajar.');
  }
  if (!toText || !String(toText).trim()) {
    score -= 5;
    issues.push('Tahap berikutnya belum memiliki kegiatan.');
  }
  if (String(toText || '').trim().length < 35) {
    score -= 2;
    issues.push('Kegiatan terlalu singkat untuk menunjukkan proses dan output belajar.');
  }
  const clarity = evaluateInstructionClarity(toText);
  if (clarity.longSentences || clarity.longBullets) {
    score -= 2;
    issues.push('Ada kalimat atau poin yang terlalu panjang; pecah menjadi instruksi operasional singkat.');
  }
  if (!clarity.hasTeacherRole || !clarity.hasStudentRole) {
    score -= 1;
    issues.push('Peran Guru dan Peserta Didik belum sama-sama dinyatakan secara eksplisit.');
  }
  if (isFinal && !/(simpul|reflek|hasil|produk|bukti|present|evaluasi|jawab)/i.test(toText || '')) {
    score -= 2;
    issues.push('Sintaks terakhir belum menyatakan evidence yang dapat direfleksikan pada Penutup template.');
  }

  score = Math.max(0, score);
  return {
    transition,
    score,
    status: score >= 8 ? 'PASS' : score >= 6 ? 'REVIEW' : 'FAIL',
    issues,
    recommendations: issues.length ? ['Revisi hanya tahap yang gagal; gunakan output tahap sebelumnya sebagai input kegiatan berikutnya.'] : []
  };
}

function validateLearningDesign(data, options = {}) {
  const requireActivities = Boolean(options.requireActivities);
  const criticalIssues = [];
  const warnings = [];
  const model = getModel(data.modelId);

  for (const [key, label] of [['mataPelajaran', 'Mata Pelajaran'], ['materi', 'Materi'], ['cp', 'CP'], ['tp', 'TP']]) {
    if (!String(data[key] || '').trim()) criticalIssues.push(`${label} wajib tersedia untuk Learning Design Contract.`);
  }
  if (!model) criticalIssues.push('Model pembelajaran tidak ditemukan.');

  const contract = model ? buildLearningDesignContract(data) : null;
  const syntaxValues = data.syntaxValues || {};
  const transitions = [];

  if (model && requireActivities) {
    let previousText = data.apersepsi || '';
    model.steps.forEach((step, index) => {
      const currentText = syntaxValues[step.id] || '';
      const result = scoreTransition({
        fromText: previousText,
        toText: currentText,
        transition: index === 0 ? `apersepsi → ${step.name}` : `${model.steps[index - 1].name} → ${step.name}`,
        isFinal: index === model.steps.length - 1
      });
      transitions.push(result);
      previousText = currentText;
    });
  }

  const fullText = [data.apersepsi, ...Object.values(syntaxValues)].join(' ');
  if (IT_ONLY_TERMS.test(fullText) && !hasSubjectOrMaterialContext(data)) {
    criticalIssues.push('Ditemukan konteks IT/jaringan yang tidak didukung oleh mata pelajaran atau materi guru.');
  }
  if (!extractCapabilities(data.tp).length && String(data.tp || '').trim()) {
    warnings.push('Kemampuan target TP belum dikenali otomatis; guru tetap perlu meninjau coverage aktivitas.');
  }
  const sourceStatus = SOURCE_REGISTRY[data.modelId]?.status || 'source_required';
  if (sourceStatus !== 'approved') {
    warnings.push('Sumber sintaks model belum berstatus approved; gunakan sebagai draft sampai sumber/variant disetujui.');
  }
  if (requireActivities && transitions.some(result => result.status === 'FAIL')) {
    criticalIssues.push('Continuity kegiatan inti belum memenuhi quality gate.');
  }

  const overallScore = transitions.length
    ? Math.round(transitions.reduce((sum, item) => sum + item.score, 0) / transitions.length)
    : null;

  return {
    status: criticalIssues.length ? 'FAIL' : transitions.some(result => result.status === 'REVIEW') ? 'REVIEW' : 'PASS',
    isValid: criticalIssues.length === 0,
    score: overallScore,
    criticalIssues,
    warnings,
    contract,
    transitions,
    alignment: {
      tp_capabilities: extractCapabilities(data.tp),
      subject_agnostic_status: criticalIssues.some(issue => issue.includes('IT/jaringan')) ? 'FAIL' : 'PASS',
      immutable_boundaries: ['opening_template', 'closing_template']
    }
  };
}

module.exports = {
  buildLearningDesignContract,
  extractCapabilities,
  evaluateInstructionClarity,
  getModel,
  validateLearningDesign
};
