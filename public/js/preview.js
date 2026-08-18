/**
 * public/js/preview.js
 * Modul untuk merender tampilan Visual Preview Modul Ajar (Step 7)
 */

const Preview = {
  render(state, config, container) {
    if (!container) return;

    const metodeStr = Array.isArray(state.metode) ? state.metode.join(', ') : (state.metode || '-');
    const mediaStr = Array.isArray(state.media) ? state.media.join(', ') : (state.media || '-');
    const modelConfig = config.models ? config.models[state.modelId] : null;
    const modelName = modelConfig ? modelConfig.name : (state.modelId || '-');

    // Build syntax steps preview
    let syntaxHtml = '';
    if (modelConfig && modelConfig.steps) {
      syntaxHtml = modelConfig.steps.map((step, idx) => {
        const content = state.syntaxValues && state.syntaxValues[step.id] ? state.syntaxValues[step.id] : '<em style="color: #94a3b8;">(Belum diisi)</em>';
        return `
          <div class="preview-block" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <h4 style="font-size: 0.95rem; color: #a5b4fc; margin: 0;">${step.label}</h4>
              <span class="syntax-slot-tag">${step.slot}</span>
            </div>
            <div style="font-size: 0.88rem; white-space: pre-wrap; color: #f1f5f9; line-height: 1.6;">${content}</div>
          </div>
        `;
      }).join('');
    } else {
      syntaxHtml = '<p style="color: #94a3b8;">Belum ada sintaks model yang dipilih.</p>';
    }

    container.innerHTML = `
      <div class="preview-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">MODUL AJAR: ${state.materi || 'Materi Utama'}</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Format visual ringkasan sebelum digenerate ke DOCX Master Template</p>
          </div>
          <span class="card-badge" style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7;">Siap Export</span>
        </div>

        <table class="preview-table">
          <tbody>
            <tr>
              <th>Nama Guru</th>
              <td><strong>${state.namaGuru || '-'}</strong></td>
              <th>Tanggal KBM</th>
              <td>${state.tanggal || '-'}</td>
            </tr>
            <tr>
              <th>Mata Pelajaran</th>
              <td>${state.mataPelajaran || '-'}</td>
              <th>Fase / Kelas</th>
              <td>${state.fase || '-'} / ${state.kelas || '-'} (${state.jp || '-'} JP)</td>
            </tr>
            <tr>
              <th>Elemen / Tema</th>
              <td colspan="3">${state.elemenTema || '-'}</td>
            </tr>
            <tr>
              <th>Materi Pokok</th>
              <td>${state.materi || '-'}</td>
              <th>Sub Materi</th>
              <td>${state.subMateri || '-'}</td>
            </tr>
            <tr>
              <th>Metode</th>
              <td>${metodeStr}</td>
              <th>Tingkat UKRK</th>
              <td>${state.tingkatUkrk || '-'}</td>
            </tr>
            <tr>
              <th>Media</th>
              <td colspan="3">${mediaStr}</td>
            </tr>
            <tr>
              <th>Capaian Pembelajaran (CP)</th>
              <td colspan="3" style="background: rgba(245, 158, 11, 0.05); border-left: 3px solid var(--warning);">
                <strong>[Manual Guru]</strong> ${state.cp || '<em style="color:#f87171;">Wajib diisi</em>'}
              </td>
            </tr>
            <tr>
              <th>Tujuan Pembelajaran (TP)</th>
              <td colspan="3" style="background: rgba(245, 158, 11, 0.05); border-left: 3px solid var(--warning);">
                <strong>[Manual Guru]</strong> ${state.tp || '<em style="color:#f87171;">Wajib diisi</em>'}
              </td>
            </tr>
            <tr>
              <th>Assesment</th>
              <td colspan="3">${state.asesmen || '<em style="color:#94a3b8;">(Belum diisi)</em>'}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 2rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1rem; color: #67e8f9; display: flex; align-items: center; gap: 0.5rem;">
            <span>✨</span> Apersepsi Pembelajaran
          </h3>
          <div class="preview-block" style="border-left-color: #67e8f9;">
            <div style="font-size: 0.88rem; white-space: pre-wrap; line-height: 1.6;">${state.apersepsi || '<em style="color:#94a3b8;">(Belum diisi)</em>'}</div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; color: #a5b4fc; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Kegiatan Inti: Model ${modelName}
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Dipetakan ke slot: LANGKAH_1, LANGKAH_2, LANGKAH_3</span>
          </div>
          ${syntaxHtml}
        </div>
      </div>
    `;
  }
};
