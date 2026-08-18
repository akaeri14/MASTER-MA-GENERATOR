/**
 * public/js/app.js
 * State management, Wizard navigation, dynamic syntax rendering,
 * AI generation handlers, Draft storage, and DOCX Export trigger.
 */

// Application Global State
const state = {
  currentStep: 1,
  namaGuru: '',
  mataPelajaran: '',
  tanggal: '',
  fase: 'Fase F',
  kelas: '',
  jp: 18,
  elemenTema: '',
  materi: '',
  subMateri: '',
  metode: ['Ceramah Interaktif', 'Diskusi Kelompok', 'Tanya Jawab'],
  media: ['Buku / Teks / Bahan Bacaan', 'Proyektor / Smart TV', 'LKPD / Lembar Kerja'],
  tingkatUkrk: 'Tinggi',
  cp: '',
  tp: '',
  modelId: 'discovery_learning',
  apersepsiType: 'analogi',
  konteksTambahan: '',
  materiSebelumnya: '',
  apersepsi: '',
  syntaxValues: {}, // key: stepId, value: text
  jenisAsesmen: ['Teori', 'Praktik / LKPD Interaktif', 'Formatif', 'Sumatif'],
  asesmen: '',
  langkah1: '',
  langkah2: '',
  langkah3: ''
};

let appConfig = {};

// Helper: Show Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span style="flex:1;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Auto-save to LocalStorage
function saveDraftToStorage() {
  try {
    syncStateFromForm();
    localStorage.setItem('AI_MODUL_AJAR_DRAFT', JSON.stringify(state));
  } catch (e) {
    console.warn('Gagal menyimpan draft ke LocalStorage', e);
  }
}

// Load Draft from LocalStorage
function loadDraftFromStorage() {
  try {
    const saved = localStorage.getItem('AI_MODUL_AJAR_DRAFT');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      return true;
    }
  } catch (e) {
    console.warn('Gagal memuat draft dari LocalStorage', e);
  }
  return false;
}

// Sync form inputs to state object
function syncStateFromForm() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  state.namaGuru = getVal('input-nama-guru');
  state.mataPelajaran = getVal('input-mata-pelajaran');
  state.tanggal = getVal('input-tanggal');
  state.fase = getVal('select-fase') || 'Fase F';
  state.kelas = getVal('input-kelas');
  state.jp = getVal('input-jp');
  state.elemenTema = getVal('input-elemen-tema');
  state.materi = getVal('input-materi');
  state.subMateri = getVal('input-sub-materi');
  state.tingkatUkrk = getVal('select-ukrk') || 'Tinggi';
  state.cp = getVal('textarea-cp');
  state.tp = getVal('textarea-tp');
  state.konteksTambahan = getVal('input-konteks-tambahan');
  state.materiSebelumnya = getVal('input-materi-sebelumnya');
  state.apersepsi = getVal('textarea-apersepsi');
  state.asesmen = getVal('textarea-asesmen');

  // Sync dynamic syntax values
  if (appConfig.models && appConfig.models[state.modelId]) {
    appConfig.models[state.modelId].steps.forEach(step => {
      const el = document.getElementById(`syntax-textarea-${step.id}`);
      if (el) {
        state.syntaxValues[step.id] = el.value.trim();
      }
    });
  }

  // Combine syntax values into LANGKAH_1, LANGKAH_2, LANGKAH_3
  combineSyntaxSlots();
}

// Populate form inputs from state object
function populateFormFromState() {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('input-nama-guru', state.namaGuru);
  setVal('input-mata-pelajaran', state.mataPelajaran);
  setVal('input-tanggal', state.tanggal);
  setVal('select-fase', state.fase);
  setVal('input-kelas', state.kelas);
  setVal('input-jp', state.jp);
  setVal('input-elemen-tema', state.elemenTema);
  setVal('input-materi', state.materi);
  setVal('input-sub-materi', state.subMateri);
  setVal('select-ukrk', state.tingkatUkrk);
  setVal('textarea-cp', state.cp);
  setVal('textarea-tp', state.tp);
  setVal('input-konteks-tambahan', state.konteksTambahan);
  setVal('input-materi-sebelumnya', state.materiSebelumnya);
  setVal('textarea-apersepsi', state.apersepsi);
  setVal('textarea-asesmen', state.asesmen);

  // Update Model Cards selection
  document.querySelectorAll('.model-selection-card').forEach(card => {
    const mId = card.dataset.modelId;
    if (mId === state.modelId) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Update Apersepsi Cards selection
  document.querySelectorAll('.apersepsi-selection-card').forEach(card => {
    const aType = card.dataset.type;
    if (aType === state.apersepsiType) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Update Apersepsi sub-input visibility
  updateApersepsiSubInputs();

  // Update Metode & Media Tags
  updateTagSelections('metode-tags', state.metode);
  updateTagSelections('media-tags', state.media);
  updateTagSelections('asesmen-tags', state.jenisAsesmen);

  // Render Step 5 Syntax Cards
  renderSyntaxCards();
}

// Combine individual step contents into 3 template slots (LANGKAH_1, LANGKAH_2, LANGKAH_3)
function combineSyntaxSlots() {
  const modelConfig = appConfig.models ? appConfig.models[state.modelId] : null;
  if (!modelConfig) return;

  const slots = {
    'LANGKAH_1': [],
    'LANGKAH_2': [],
    'LANGKAH_3': []
  };

  modelConfig.steps.forEach(step => {
    const text = state.syntaxValues[step.id] || '';
    if (text) {
      const header = step.header ? `${step.header}\n` : '';
      slots[step.slot].push(`${header}${text}`);
    }
  });

  state.langkah1 = slots['LANGKAH_1'].join('\n\n');
  state.langkah2 = slots['LANGKAH_2'].join('\n\n');
  state.langkah3 = slots['LANGKAH_3'].join('\n\n');
}

// Update tag elements active state
function updateTagSelections(containerId, activeList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll('.tag-btn');
  btns.forEach(btn => {
    const val = btn.dataset.value;
    if (activeList.includes(val)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Step Navigation
function goToStep(stepNumber) {
  syncStateFromForm();
  saveDraftToStorage();

  if (stepNumber < 1 || stepNumber > 8) return;

  state.currentStep = stepNumber;

  // Update Stepper Bar
  document.querySelectorAll('.step-item').forEach(item => {
    const s = parseInt(item.dataset.step, 10);
    item.classList.remove('active', 'completed');
    if (s === stepNumber) {
      item.classList.add('active');
    } else if (s < stepNumber) {
      item.classList.add('completed');
    }
  });

  // Update Wizard Card views
  document.querySelectorAll('.wizard-step-panel').forEach(panel => {
    const s = parseInt(panel.dataset.step, 10);
    if (s === stepNumber) {
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  });

  // If on Step 5, render/populate syntax cards
  if (stepNumber === 5) {
    renderSyntaxCards();
  }

  // If on Step 7, render Visual Preview
  if (stepNumber === 7) {
    const previewContainer = document.getElementById('preview-content-area');
    Preview.render(state, appConfig, previewContainer);
  }

  // If on Step 8, run validation check
  if (stepNumber === 8) {
    runExportValidationCheck();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render dynamic syntax cards on Step 5
function renderSyntaxCards() {
  const container = document.getElementById('syntax-cards-container');
  if (!container) return;

  const modelConfig = appConfig.models ? appConfig.models[state.modelId] : null;
  if (!modelConfig) {
    container.innerHTML = '<div class="alert-box warning"><p>Silakan pilih model pembelajaran di Step 3 terlebih dahulu.</p></div>';
    return;
  }

  container.innerHTML = '';

  modelConfig.steps.forEach((step, idx) => {
    const card = document.createElement('div');
    card.className = 'syntax-card';

    const currentValue = state.syntaxValues[step.id] || '';

    card.innerHTML = `
      <div class="syntax-header">
        <div class="syntax-title-area">
          <span class="syntax-order-badge">${idx + 1}</span>
          <div>
            <h4 class="syntax-name">${step.label}</h4>
            <p style="font-size: 0.78rem; color: var(--text-muted);">${step.hint}</p>
          </div>
        </div>
        <div class="syntax-actions">
          <span class="syntax-slot-tag">Slot Template: ${step.slot}</span>
          <button type="button" class="btn btn-ai btn-sm" id="btn-generate-step-${step.id}">
            <span>✨</span> Generate AI
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-step-${step.id}">
            Clear
          </button>
        </div>
      </div>
      <textarea id="syntax-textarea-${step.id}" class="form-textarea" placeholder="Tuliskan atau generate kegiatan guru dan peserta didik untuk ${step.name}...">${currentValue}</textarea>
    `;

    container.appendChild(card);

    // Event listener Generate AI per step
    const genBtn = card.querySelector(`#btn-generate-step-${step.id}`);
    genBtn.addEventListener('click', async () => {
      syncStateFromForm();
      if (!state.materi) {
        showToast('Materi utama pada Step 1 wajib diisi sebelum generate AI.', 'warning');
        return;
      }
      genBtn.classList.add('loading');
      genBtn.disabled = true;

      try {
        const content = await API.generateStep(state, step.id);
        const textarea = document.getElementById(`syntax-textarea-${step.id}`);
        if (textarea) textarea.value = content;
        state.syntaxValues[step.id] = content;
        saveDraftToStorage();
        showToast(`Kegiatan untuk ${step.name} berhasil digenerate!`, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        genBtn.classList.remove('loading');
        genBtn.disabled = false;
      }
    });

    // Event listener Clear
    const clearBtn = card.querySelector(`#btn-clear-step-${step.id}`);
    clearBtn.addEventListener('click', () => {
      const textarea = document.getElementById(`syntax-textarea-${step.id}`);
      if (textarea) textarea.value = '';
      state.syntaxValues[step.id] = '';
      saveDraftToStorage();
    });

    // Event listener change
    const textarea = card.querySelector(`#syntax-textarea-${step.id}`);
    textarea.addEventListener('input', () => {
      state.syntaxValues[step.id] = textarea.value;
      saveDraftToStorage();
    });
  });
}

// Update Apersepsi sub-input visibility
function updateApersepsiSubInputs() {
  const ctlContainer = document.getElementById('apersepsi-ctl-extra');
  const reviewContainer = document.getElementById('apersepsi-review-extra');

  if (ctlContainer) {
    ctlContainer.style.display = state.apersepsiType === 'ctl' ? 'block' : 'none';
  }
  if (reviewContainer) {
    reviewContainer.style.display = state.apersepsiType === 'review' ? 'block' : 'none';
  }
}

// Run Export Validation Check
async function runExportValidationCheck() {
  syncStateFromForm();
  const summaryBox = document.getElementById('export-validation-summary');
  const downloadBtn = document.getElementById('btn-download-docx');
  if (!summaryBox || !downloadBtn) return;

  summaryBox.innerHTML = '<div class="alert-box info"><p>Memeriksa kelengkapan data modul ajar...</p></div>';

  try {
    const result = await API.validate(state);
    if (result.isValid) {
      const qualityNotice = result.qualityGate && result.qualityGate.status !== 'PASS'
        ? `<p style="margin-top: 0.5rem; font-size: 0.85rem;">Catatan kualitas: ${[
            ...(result.qualityGate.criticalIssues || []),
            ...(result.qualityGate.warnings || []),
            ...((result.qualityGate.transitions || []).flatMap(item => item.issues || []))
          ].join(' ') || 'Ada bagian yang dapat ditinjau kembali.'} Keputusan mengunduh tetap milik guru.</p>`
        : '';
      summaryBox.innerHTML = `
        <div class="alert-box success">
          <span class="alert-icon">✅</span>
          <div>
            <strong>Data Lengkap!</strong>
            <p>Seluruh field wajib telah terisi dengan baik. Template DOCX master asli siap digenerate dengan Mail Merge presisi.</p>
            ${qualityNotice}
          </div>
        </div>
      `;
      downloadBtn.disabled = false;
    } else {
      const missingList = (result.missingFields || []).map(f => `<li><strong>Step ${f.step}:</strong> ${f.label}</li>`).join('');
      const qualityIssues = (result.qualityGate?.criticalIssues || []).map(issue => `<li><strong>Quality Gate:</strong> ${issue}</li>`).join('');
      summaryBox.innerHTML = `
        <div class="alert-box danger">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>Terdapat Data yang Belum Lengkap:</strong>
            <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">${missingList}${qualityIssues}</ul>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Silakan kembali ke langkah terkait untuk melengkapi sebelum mengunduh.</p>
          </div>
        </div>
      `;
      downloadBtn.disabled = true;
    }
  } catch (err) {
    summaryBox.innerHTML = `<div class="alert-box danger"><p>${err.message}</p></div>`;
    downloadBtn.disabled = true;
  }
}

// Initialize Application
async function initApp() {
  try {
    // 1. Fetch config from backend
    const res = await API.getConfig();
    appConfig = res.data;

    // 2. Load draft if available
    loadDraftFromStorage();

    // 3. Populate form
    populateFormFromState();

    // 4. Attach Navigation Event Handlers
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.dataset.step, 10);
        goToStep(stepNum);
      });
    });

    document.querySelectorAll('.btn-next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(state.currentStep + 1);
      });
    });

    document.querySelectorAll('.btn-prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(state.currentStep - 1);
      });
    });

    // 5. Model selection cards
    document.querySelectorAll('.model-selection-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.model-selection-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.modelId = card.dataset.modelId;
        saveDraftToStorage();
      });
    });

    // 6. Apersepsi selection cards
    document.querySelectorAll('.apersepsi-selection-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.apersepsi-selection-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.apersepsiType = card.dataset.type;
        updateApersepsiSubInputs();
        saveDraftToStorage();
      });
    });

    // 7. Tag button multi-selectors (Metode, Media, Asesmen)
    const setupTagGroup = (containerId, stateKey) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag-btn');
        if (!btn) return;
        const val = btn.dataset.value;
        const idx = state[stateKey].indexOf(val);
        if (idx > -1) {
          state[stateKey].splice(idx, 1);
          btn.classList.remove('active');
        } else {
          state[stateKey].push(val);
          btn.classList.add('active');
        }
        saveDraftToStorage();
      });
    };

    setupTagGroup('metode-tags', 'metode');
    setupTagGroup('media-tags', 'media');
    setupTagGroup('asesmen-tags', 'jenisAsesmen');

    // 8. Custom tag addition
    const setupCustomTag = (inputId, btnId, containerId, stateKey) => {
      const input = document.getElementById(inputId);
      const btn = document.getElementById(btnId);
      const container = document.getElementById(containerId);
      if (!input || !btn || !container) return;

      btn.addEventListener('click', () => {
        const val = input.value.trim();
        if (val && !state[stateKey].includes(val)) {
          state[stateKey].push(val);
          const tagBtn = document.createElement('button');
          tagBtn.type = 'button';
          tagBtn.className = 'tag-btn active';
          tagBtn.dataset.value = val;
          tagBtn.textContent = `+ ${val}`;
          container.appendChild(tagBtn);
          input.value = '';
          saveDraftToStorage();
        }
      });
    };

    setupCustomTag('input-custom-metode', 'btn-add-custom-metode', 'metode-tags', 'metode');
    setupCustomTag('input-custom-media', 'btn-add-custom-media', 'media-tags', 'media');

    // 9. AI Generate Apersepsi Button
    const btnGenApersepsi = document.getElementById('btn-generate-apersepsi');
    if (btnGenApersepsi) {
      btnGenApersepsi.addEventListener('click', async () => {
        syncStateFromForm();
        if (!state.materi) {
          showToast('Materi pokok pada Step 1 wajib diisi.', 'warning');
          return;
        }
        btnGenApersepsi.classList.add('loading');
        btnGenApersepsi.disabled = true;
        try {
          const result = await API.generateApersepsi(state);
          const textarea = document.getElementById('textarea-apersepsi');
          if (textarea) textarea.value = result;
          state.apersepsi = result;
          saveDraftToStorage();
          showToast('Apersepsi berhasil digenerate oleh AI!', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          btnGenApersepsi.classList.remove('loading');
          btnGenApersepsi.disabled = false;
        }
      });
    }

    // 10. AI Generate All Steps Button (Step 5)
    const btnGenAllSteps = document.getElementById('btn-generate-all-steps');
    if (btnGenAllSteps) {
      btnGenAllSteps.addEventListener('click', async () => {
        syncStateFromForm();
        if (!state.materi) {
          showToast('Materi pokok pada Step 1 wajib diisi.', 'warning');
          return;
        }
        btnGenAllSteps.classList.add('loading');
        btnGenAllSteps.disabled = true;
        showToast('Sedang menghasilkan seluruh sintaks secara berurutan...', 'info');

        try {
          const result = await API.generateAllSteps(state);
          Object.assign(state.syntaxValues, result.steps);
          renderSyntaxCards();
          saveDraftToStorage();
          if (result.qualityGate?.status === 'PASS') {
            showToast('Semua sintaks terhubung dan lolos continuity check!', 'success');
          } else {
            showToast('Sintaks dibuat, tetapi sebagian hubungan perlu ditinjau pada Quality Gate.', 'warning');
          }
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          btnGenAllSteps.classList.remove('loading');
          btnGenAllSteps.disabled = false;
        }
      });
    }

    // 11. AI Generate Assessment Button (Step 6)
    const btnGenAssessment = document.getElementById('btn-generate-assessment');
    if (btnGenAssessment) {
      btnGenAssessment.addEventListener('click', async () => {
        syncStateFromForm();
        btnGenAssessment.classList.add('loading');
        btnGenAssessment.disabled = true;
        try {
          const result = await API.generateAssessment(state);
          const textarea = document.getElementById('textarea-asesmen');
          if (textarea) textarea.value = result;
          state.asesmen = result;
          saveDraftToStorage();
          showToast('Rekomendasi asesmen berhasil dibuat!', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          btnGenAssessment.classList.remove('loading');
          btnGenAssessment.disabled = false;
        }
      });
    }

    // 12. Reset Draft Button
    const btnResetDraft = document.getElementById('btn-reset-draft');
    if (btnResetDraft) {
      btnResetDraft.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan seluruh form dan menghapus draft?')) {
          localStorage.removeItem('AI_MODUL_AJAR_DRAFT');
          window.location.reload();
        }
      });
    }

    // 13. Download DOCX Button
    const btnDownloadDocx = document.getElementById('btn-download-docx');
    if (btnDownloadDocx) {
      btnDownloadDocx.addEventListener('click', async () => {
        syncStateFromForm();
        btnDownloadDocx.classList.add('loading');
        btnDownloadDocx.disabled = true;
        try {
          const filename = await API.downloadDocx(state);
          showToast(`Dokumen ${filename} berhasil diunduh!`, 'success');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          btnDownloadDocx.classList.remove('loading');
          btnDownloadDocx.disabled = false;
        }
      });
    }

    // 14. Real-time input listeners for auto-save
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        syncStateFromForm();
        saveDraftToStorage();
      });
    });

    // Start at Step 1
    goToStep(1);

  } catch (err) {
    console.error('App init error:', err);
    showToast(err.message, 'error');
  }
}

// Run when DOM loaded
document.addEventListener('DOMContentLoaded', initApp);
