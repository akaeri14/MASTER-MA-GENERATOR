/**
 * public/js/api.js
 * API Client untuk komunikasi frontend dengan backend Express
 */

const API = {
  /**
   * Mengambil konfigurasi model, sintaks, apersepsi, metode, dll.
   */
  async getConfig() {
    const res = await fetch('/api/config/models');
    if (!res.ok) throw new Error('Gagal memuat konfigurasi aplikasi');
    return await res.json();
  },

  /**
   * Generate Apersepsi dengan AI
   */
  async generateApersepsi(modulData) {
    const res = await fetch('/api/ai/generate-apersepsi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modulData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan apersepsi');
    return data.data.apersepsi;
  },

  /**
   * Generate Kegiatan Sintaks Tertentu dengan AI
   */
  async generateStep(modulData, stepId) {
    const res = await fetch('/api/ai/generate-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modulData, stepId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan kegiatan sintaks');
    return data.data.content;
  },

  /**
   * Generate Semua Sintaks Sekaligus
   */
  async generateAllSteps(modulData) {
    const res = await fetch('/api/ai/generate-all-steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modulData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan semua sintaks');
    return { steps: data.data, qualityGate: data.qualityGate };
  },

  /**
   * Generate Rekomendasi Asesmen dengan AI
   */
  async generateAssessment(modulData) {
    const res = await fetch('/api/ai/generate-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modulData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan rekomendasi asesmen');
    return data.data.assessment;
  },

  /**
   * Validasi Kelengkapan Data
   */
  async validate(modulData) {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modulData)
    });
    return await res.json();
  },

  /**
   * Download DOCX hasil Mail Merge
   */
  async downloadDocx(modulData) {
    const res = await fetch('/api/export/docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modulData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Gagal mengekspor file DOCX');
    }

    // Ambil filename dari header jika ada
    const disposition = res.headers.get('Content-Disposition');
    let filename = 'Modul_Ajar.docx';
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return filename;
  }
};
