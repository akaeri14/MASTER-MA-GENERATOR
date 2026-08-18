const { MODEL_LIBRARY } = require('../config/knowledge-base');

const VOCABULARY = {
  learningVerbs: [
    'memahami', 'menjelaskan', 'mengidentifikasi', 'menerapkan', 'menganalisis',
    'mengevaluasi', 'mencipta', 'merancang', 'mempraktikkan', 'menyelesaikan',
    'mengomunikasikan', 'menginterpretasi', 'mengorganisasi', 'menyimpulkan'
  ],
  highSignalWords: ['materi', 'tp', 'cp', 'tujuan', 'masalah', 'konsep', 'data', 'analisis', 'produk', 'hasil', 'proses', 'refleksi']
};

function normalizeText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(value = '') {
  return new Set(normalizeText(value).split(' ').filter(Boolean));
}

function overlapScore(listA = [], listB = []) {
  const a = tokenSet(listA.join(' '));
  const b = tokenSet(listB.join(' '));
  let common = 0;
  for (const token of a) {
    if (b.has(token)) common += 1;
  }
  return common;
}

function extractVerbSignals(value = '') {
  const text = normalizeText(value);
  return VOCABULARY.learningVerbs.filter(v => text.includes(v));
}

function getModelDefinition(modelId) {
  const normalizedId = modelId || 'problem_based_learning';
  const model = MODEL_LIBRARY[normalizedId];
  if (!model) {
    throw new Error(`Model pembelajaran '${modelId}' tidak ditemukan di knowledge base.`);
  }
  return model;
}

function buildLearningDesignContract(data = {}) {
  const modelId = data.modelId || data.model || 'problem_based_learning';
  const model = getModelDefinition(modelId);
  const syntax = model.syntax || [];

  return {
    subject: data.mataPelajaran || data.subject || 'Umum',
    phase: data.fase || 'Umum',
    className: data.kelas || data.className || 'Umum',
    material: data.materi || data.material || '-',
    cp: data.cp || '-',
    tp: data.tp || '-',
    modelId,
    modelName: model.name,
    aperceptionType: data.apersepsiType || data.aperceptionType || 'analogi',
    aperception: data.apersepsi || data.aperception || '-',
    syntaxPlan: syntax.map((step, index) => ({
      order: step.order || index + 1,
      id: step.id,
      name: step.name,
      purpose: step.purpose,
      input: step.input || [],
      expected_output: step.expected_output || [],
      teacher_activity_guidance: step.teacher_activity_guidance || [],
      student_activity_guidance: step.student_activity_guidance || [],
      assessment_link: step.assessment_link || []
    }))
  };
}

function scoreTransition({ fromStage, toStage, previousOutput, currentSyntax, tp, material, subject }) {
  const previousText = previousOutput || '';
  const currentText = currentSyntax ? [currentSyntax.name, currentSyntax.description, currentSyntax.purpose, ...(currentSyntax.input || []), ...(currentSyntax.expected_output || [])].join(' ') : '';
  const tpText = tp || '';
  const materialText = material || '';
  const subjectText = subject || '';

  const relevance = (() => {
    const score = overlapScore([previousText, materialText, subjectText], [currentText, tpText]);
    return score > 0 ? 2 : 1;
  })();

  const dependency = (() => {
    const previousTokens = tokenSet(previousText);
    const nextTokens = tokenSet(currentText);
    let hits = 0;
    for (const token of previousTokens) {
      if (nextTokens.has(token)) hits += 1;
    }
    if (hits >= 2) return 2;
    if (hits >= 1) return 1;
    return 0;
  })();

  const progression = (() => {
    const verbs = extractVerbSignals(tpText);
    const currentVerbs = extractVerbSignals(currentText);
    if (currentVerbs.length > 0 || verbs.length > 0) return 2;
    return 1;
  })();

  const logicalTransition = (() => {
    const prev = normalizeText(previousText);
    const next = normalizeText(currentText);
    if (!prev || !next) return 1;
    if (prev.includes('apersepsi') || prev.includes('pengalaman') || prev.includes('konteks')) {
      if (next.includes('masalah') || next.includes('analisis') || next.includes('eksplorasi') || next.includes('rencana')) return 2;
    }
    if (prev.includes('data') || prev.includes('hasil') || prev.includes('solusi')) {
      if (next.includes('analisis') || next.includes('evaluasi') || next.includes('refleksi') || next.includes('presentasi')) return 2;
    }
    return 1;
  })();

  const tpAlignment = (() => {
    const tpSignal = extractVerbSignals(tpText);
    const currentSignal = extractVerbSignals(currentText);
    const overlap = tpSignal.filter(v => currentSignal.includes(v));
    if (overlap.length > 0) return 2;
    if (tpSignal.length > 0 || currentSignal.length > 0) return 1;
    return 0;
  })();

  const total = relevance + dependency + progression + logicalTransition + tpAlignment;
  const status = total >= 8 ? 'PASS' : total >= 6 ? 'REVIEW' : 'FAIL';

  const issues = [];
  if (relevance < 2) issues.push('Tahap berikutnya kurang relevan dengan tahap sebelumnya.');
  if (dependency < 2) issues.push('Tidak terlihat penggunaan output tahap sebelumnya sebagai input utama tahap berikutnya.');
  if (progression < 2) issues.push('Tidak ada perkembangan kemampuan atau hasil yang jelas dari satu tahap ke tahap berikutnya.');
  if (logicalTransition < 2) issues.push('Transisi antartahap belum logis secara pedagogis.');
  if (tpAlignment < 2) issues.push('Transisi belum cukup mendukung pencapaian TP.');

  const recommendations = [];
  if (issues.length) {
    recommendations.push('Perjelas hubungan logis antara output tahap sebelumnya dan kebutuhan tahap berikutnya.');
    recommendations.push('Pastikan tiap sintaks menghasilkan produk, keputusan, atau pengetahuan yang menjadi input tahap berikutnya.');
    recommendations.push('Hubungkan aktivitas dengan indikator kemampuan yang tertuang dalam TP.');
  }

  return {
    from_stage: fromStage,
    to_stage: toStage,
    status,
    score: total,
    criteria: {
      relevance,
      dependency,
      progression,
      logical_transition: logicalTransition,
      tp_alignment: tpAlignment
    },
    issues,
    recommendations
  };
}

function validateContinuity(data = {}) {
  const contract = buildLearningDesignContract(data);
  const syntaxPlan = contract.syntaxPlan;
  const transitions = [];

  const previousStageLabel = 'apersepsi';
  const firstSyntax = syntaxPlan[0];
  if (firstSyntax) {
    transitions.push(scoreTransition({
      fromStage: previousStageLabel,
      toStage: firstSyntax.name,
      previousOutput: contract.aperception,
      currentSyntax: firstSyntax,
      tp: contract.tp,
      material: contract.material,
      subject: contract.subject
    }));
  }

  for (let index = 1; index < syntaxPlan.length; index += 1) {
    const previousSyntax = syntaxPlan[index - 1];
    const currentSyntax = syntaxPlan[index];
    const previousOutput = (previousSyntax.expected_output || []).join(' ');
    transitions.push(scoreTransition({
      fromStage: previousSyntax.name,
      toStage: currentSyntax.name,
      previousOutput,
      currentSyntax,
      tp: contract.tp,
      material: contract.material,
      subject: contract.subject
    }));
  }

  const allScores = transitions.map(item => item.score);
  const aggregate = allScores.length ? allScores.reduce((sum, value) => sum + value, 0) / allScores.length : 0;

  const finalStatus = aggregate >= 8 ? 'PASS' : aggregate >= 6 ? 'REVIEW' : 'FAIL';

  return {
    status: finalStatus,
    average_score: Number(aggregate.toFixed(1)),
    transitions,
    model: contract.modelName,
    subject: contract.subject,
    material: contract.material,
    tp: contract.tp
  };
}

function validateAlignment(data = {}) {
  const contract = buildLearningDesignContract(data);
  const tpText = normalizeText(contract.tp);
  const materialText = normalizeText(contract.material);
  const cpText = normalizeText(contract.cp);
  const aperceptionText = normalizeText(contract.aperception);

  const issues = [];
  const recommendations = [];

  if (!tpText) {
    issues.push('TP belum diisi oleh guru.');
  }
  if (!materialText) {
    issues.push('Materi belum diisi.');
  }
  if (!cpText) {
    issues.push('CP belum diisi.');
  }
  if (!aperceptionText || aperceptionText === '-') {
    issues.push('Apersepsi belum diisi.');
  }

  const syntaxPlan = contract.syntaxPlan;
  let coverageScore = 0;
  if (syntaxPlan.length > 0) coverageScore += 2;
  if (tpText) coverageScore += 2;
  if (materialText) coverageScore += 2;
  if (cpText) coverageScore += 2;
  if (aperceptionText && aperceptionText !== '-') coverageScore += 2;

  const syntaxCoverage = syntaxPlan.some(step => {
    const signal = [step.name, ...(step.input || []), ...(step.expected_output || [])].join(' ');
    const matches = extractVerbSignals(tpText).filter(v => normalizeText(signal).includes(v));
    return matches.length > 0;
  });

  if (!syntaxCoverage) {
    issues.push('Sintaks yang dipilih belum terlihat mendukung kemampuan yang ditargetkan dalam TP.');
    recommendations.push('Pastikan aktivitas sintaks mencerminkan indikator kemampuan pada TP, bukan sekadar kegiatan umum.');
  }

  const assessmentLink = syntaxPlan.some(step => (step.assessment_link || []).length > 0);
  if (!assessmentLink) {
    issues.push('Belum ada hubungan yang jelas antara sintaks dan asesmen.');
    recommendations.push('Tambahkan koneksi asesmen pada setiap sintaks atau pada tahap evaluasi akhir.');
  }

  const subjectCheck = validateSubjectAgnostic(data);
  if (subjectCheck.status !== 'PASS') {
    issues.push(...subjectCheck.issues);
    recommendations.push(...subjectCheck.recommendations);
  }

  const total = Math.max(0, Math.min(10, coverageScore + (syntaxCoverage ? 2 : 0) + (assessmentLink ? 2 : 0) + (subjectCheck.status === 'PASS' ? 2 : 0)));
  const status = total >= 8 ? 'PASS' : total >= 6 ? 'REVIEW' : 'FAIL';

  return {
    status,
    score: total,
    cp: contract.cp,
    tp: contract.tp,
    material: contract.material,
    apersepsi: contract.aperception,
    model: contract.modelName,
    issues,
    recommendations,
    subject_check: subjectCheck,
    syntax_coverage: syntaxCoverage,
    assessment_link: assessmentLink
  };
}

function validateSubjectAgnostic(data = {}) {
  const subject = normalizeText(data.mataPelajaran || data.subject || '');
  const material = normalizeText(data.materi || data.material || '');
  const tp = normalizeText(data.tp || '');
  const blockedTerms = [
    'packet tracer', 'wireshark', 'cisco', 'linux', 'router', 'switch', 'server', 'network', 'jaringan', 'it', 'informatika'
  ];

  const matches = blockedTerms.filter(term => material.includes(term) || tp.includes(term) || subject.includes(term));

  if (!subject || !material || !tp) {
    return {
      status: 'PASS',
      issues: [],
      recommendations: []
    };
  }

  if (matches.length > 0 && !subject.includes('teknik komputer') && !subject.includes('tkj') && !subject.includes('rpl') && !subject.includes('informatika')) {
    return {
      status: 'REVIEW',
      issues: [
        'Terdapat istilah yang mengarah ke domain IT, tetapi mata pelajaran tidak menunjukkan konteks teknologi/IT.'
      ],
      recommendations: [
        'Pastikan aktivitas sesuai dengan subject, materi, dan TP yang benar, bukan dominan asumsi teknologi.'
      ]
    };
  }

  return {
    status: 'PASS',
    issues: [],
    recommendations: []
  };
}

function validateQualityGate(data = {}) {
  const alignment = validateAlignment(data);
  const continuity = validateContinuity(data);
  const subjectCheck = validateSubjectAgnostic(data);

  const checks = {
    input_validation: (!(!data.mataPelajaran && !data.subject) && !!(data.materi || data.material) && !!(data.tp || data.cp)) ? 'PASS' : 'FAIL',
    model_validation: !!(data.modelId || data.model) ? 'PASS' : 'FAIL',
    syntax_validation: !!(MODEL_LIBRARY[data.modelId || data.model || 'problem_based_learning']) ? 'PASS' : 'FAIL',
    continuity_validation: continuity.status,
    tp_alignment_validation: alignment.status,
    material_alignment_validation: alignment.status,
    subject_agnostic_validation: subjectCheck.status,
    activity_quality_validation: alignment.status
  };

  const criticalFails = Object.entries(checks).filter(([key, value]) => {
    if (['continuity_validation', 'tp_alignment_validation', 'material_alignment_validation', 'subject_agnostic_validation'].includes(key)) {
      return value === 'FAIL';
    }
    return value === 'FAIL';
  });

  return {
    status: criticalFails.length === 0 ? 'PASS' : 'REVIEW',
    checks,
    continuity,
    alignment,
    subject_check: subjectCheck
  };
}

module.exports = {
  normalizeText,
  buildLearningDesignContract,
  validateTransition: scoreTransition,
  validateContinuity,
  validateAlignment,
  validateSubjectAgnostic,
  validateQualityGate,
  getModelDefinition
};
