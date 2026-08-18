/**
 * services/prompt.service.js
 * Engine penyusunan prompt AI yang terisolasi dan spesifik per-bagian.
 * Menjamin integritas data master (CP & TP tidak diubah/dibuat AI).
 */

const { LEARNING_MODELS } = require('../config/models.config');

/**
 * Format context umum modul ajar untuk prompt AI
 */
function buildBaseContext(data) {
  const metodeList = Array.isArray(data.metode) ? data.metode.join(', ') : (data.metode || '-');
  const mediaList = Array.isArray(data.media) ? data.media.join(', ') : (data.media || '-');

  return `
DATA IDENTITAS PEMBELAJARAN (MASTER DATA DARI GURU):
- Mata Pelajaran: ${data.mataPelajaran || '-'}
- Fase / Kelas: ${data.fase || '-'} / ${data.kelas || '-'}
- Alokasi Waktu: ${data.jp || '-'} JP
- Elemen / Tema: ${data.elemenTema || '-'}
- Materi Pokok: ${data.materi || '-'}
- Sub-Materi: ${data.subMateri || '-'}
- Capaian Pembelajaran (CP): "${data.cp || '-'}"
- Tujuan Pembelajaran (TP): "${data.tp || '-'}"
- Model Pembelajaran: ${data.modelName || data.modelId || '-'}
- Metode Pembelajaran: ${metodeList}
- Media Pembelajaran: ${mediaList}
`.trim();
}

/**
 * Prompt untuk generate Apersepsi
 */
function buildApersepsiPrompt(data) {
  const baseContext = buildBaseContext(data);
  const type = data.apersepsiType || 'analogi';

  let specificInstruction = '';

  if (type === 'analogi') {
    specificInstruction = `
TUGAS KHUSUS: Buatlah APERSEPSI berbasis ANALOGI KONSEPTUAL.
- Buat analogi/perumpamaan kehidupan sehari-hari yang mudah dibayangkan oleh peserta didik untuk menjelaskan esensi "${data.materi}" / "${data.subMateri}".
- Analogi harus relevan, logis, tidak berbelit-belit, dan langsung menarik perhatian peserta didik.
- Sambungkan analogi tersebut dengan kegiatan pertama yang akan dilakukan peserta didik untuk mempelajari materi.
- Format teks: 1-2 paragraf padat dan ringkas (maksimal 80-100 kata).
`;
  } else if (type === 'ctl') {
    const konteksTambahan = data.konteksTambahan ? `Konteks/kasus tambahan dari guru: "${data.konteksTambahan}"` : '';
    specificInstruction = `
TUGAS KHUSUS: Buatlah APERSEPSI berbasis CONTEXTUAL TEACHING & LEARNING (CTL).
- Hubungkan materi "${data.materi}" / "${data.subMateri}" dengan pengalaman, lingkungan, atau situasi nyata yang relevan bagi peserta didik.
${konteksTambahan}
- Gunakan konteks tersebut sebagai titik awal kegiatan pertama.
- Format teks: 1-2 paragraf padat dan ringkas (maksimal 80-100 kata).
`;
  } else if (type === 'review') {
    const materiSebelumnya = data.materiSebelumnya || 'Materi Prasyarat';
    specificInstruction = `
TUGAS KHUSUS: Buatlah APERSEPSI berbasis REVIEW MATERI SEBELUMNYA.
- Materi Sebelumnya: "${materiSebelumnya}"
- Materi Saat Ini: "${data.materi}" (${data.subMateri})
- Hubungkan materi sebelumnya sebagai jembatan pengetahuan/fondasi untuk memahami materi saat ini.
- Jangan mengarang materi sebelumnya, gunakan tepat topik yang diberikan.
- Format teks: 1-2 paragraf padat dan ringkas (maksimal 80-100 kata).
`;
  }

  return `
${baseContext}

${specificInstruction}

ATURAN OUTPUT:
- Hasilkan narasi langsung siap baca/pakai untuk guru.
- Gaya bahasa profesional, komunikatif, dan memotivasi peserta didik.
- Kalimat terakhir wajib menjadi transisi yang jelas menuju eksplorasi/masalah/pertanyaan pada Sintaks 1.
- Bersifat subject-agnostic: jangan menyebut alat, teknologi, profesi, atau konteks tertentu kecuali diberikan oleh data guru.
- Jangan tambahkan judul atau markdown tambahan selain narasinya.
`.trim();
}

/**
 * Prompt untuk generate kegiatan pada sintaks tertentu
 */
function buildSyntaxStepPrompt(data, stepConfig, previousOutputState = '') {
  const baseContext = buildBaseContext(data);

  return `
${baseContext}

SINTAKS YANG HARUS DIKERJAKAN:
- Model Pembelajaran: ${data.modelName || data.modelId}
- Nama Sintaks: ${stepConfig.name} (${stepConfig.header})
- Penjelasan Sintaks: ${stepConfig.hint}
${previousOutputState ? `- Output tahap sebelumnya yang WAJIB dipakai sebagai input: ${previousOutputState}` : '- Tahap ini menggunakan output apersepsi sebagai pengetahuan awal/konteks.'}

ATURAN KETAT UNTUK KONTEN KEGIATAN:
1. HANYA buat kegiatan untuk sintaks "${stepConfig.name}". DILARANG memasukkan atau mencampurkan sintaks model lain.
2. Pisahkan dan perjelas peran Guru dan Peserta Didik secara seimbang.
3. Kegiatan harus realistis untuk dilaksanakan sesuai alokasi JP (${data.jp || '2-4'} JP), fase (${data.fase || 'Fase F'}), metode (${Array.isArray(data.metode) ? data.metode.join(', ') : data.metode}), dan media (${Array.isArray(data.media) ? data.media.join(', ') : data.media}).
4. Kegiatan harus selaras dengan Tujuan Pembelajaran (TP).
5. Gunakan hasil tahap sebelumnya secara eksplisit sebagai bahan/pertanyaan/bukti/tugas pada tahap ini, lalu hasilkan output yang dapat dipakai sintaks berikutnya.
6. Bersifat subject-agnostic: jangan mengasumsikan komputer, jaringan, lab, industri, atau alat tertentu kecuali tertulis pada data guru.
7. Tulis sebagai instruksi operasional yang dapat diikuti guru lain tanpa penjelasan tambahan.
8. Gunakan 4-6 poin berurutan. Setiap poin hanya satu tindakan utama, maksimal 22 kata, dan gunakan kalimat aktif.
9. Gunakan sudut pandang orang ketiga. Awali kalimat dengan "Guru ..." atau "Peserta didik ..."; jangan gunakan bentuk perintah seperti "Sajikan" atau "Lakukan".
10. Sertakan secara berurutan: pemantik/tugas, tindakan guru, tindakan peserta didik, lalu hasil kerja atau bukti belajar yang dibawa ke sintaks berikutnya.

CONTOH FORMAT OUTPUT:
- Guru menunjukkan [fenomena/teks/objek] yang relevan dengan materi.
- Guru mengajukan pertanyaan pemantik: "...".
- Peserta didik mengamati dan mencatat [informasi/bukti] yang diperlukan.
- Peserta didik menyusun [pertanyaan/jawaban/hasil kerja] sebagai bekal sintaks berikutnya.

Hasilkan HANYA poin-poin kegiatan di atas, tanpa pengantar atau penutup tambahan.
`.trim();
}

/**
 * Prompt untuk generate Asesmen
 */
function buildAssessmentPrompt(data) {
  const baseContext = buildBaseContext(data);
  const jenisAsesmen = Array.isArray(data.jenisAsesmen) ? data.jenisAsesmen.join(', ') : (data.jenisAsesmen || 'Teori, Praktik / LKPD Interaktif');

  return `
${baseContext}

JENIS ASESMEN YANG DIPILIH GURU:
${jenisAsesmen}

TUGAS:
Buatlah formulasi deskripsi rencana asesmen pembelajaran yang selaras dengan Tujuan Pembelajaran (TP) dan kegiatan pembelajaran.

ATURAN FORMAT OUTPUT:
Hasilkan teks ringkas dan terstruktur (maksimal 2-3 kalimat atau poin terpadu) yang siap ditempatkan pada baris 'Assesment' tabel modul ajar.
Contoh:
"Teori: Tanya jawab pemahaman konsep dasar dan analisis kasus. Praktik/LKPD Interaktif: Simulasi konfigurasi dan pengujian konektivitas pada simulator."

Hasilkan HANYA narasinya.
`.trim();
}

/**
 * Prompt untuk generate pembukaan SOP
 */
function buildPembukaanPrompt(data) {
  const baseContext = buildBaseContext(data);
  return `
${baseContext}

TUGAS:
Buatlah 4-5 poin langkah Pembelajaran (Kegiatan Pembuka) yang runtut mencakup:
1. Salam & menyapa peserta didik
2. Doa & pengecekan kehadiran/kesiapan (misal ClassPoint / presensi)
3. Penyampaian Tujuan Pembelajaran, alur kegiatan, dan manfaatnya.
Format: Daftar bernomor 1-4 ringkas dan jelas.
`.trim();
}

/**
 * Prompt untuk generate penutupan SOP
 */
function buildPenutupanPrompt(data) {
  const baseContext = buildBaseContext(data);
  return `
${baseContext}

TUGAS:
Buatlah 4-5 poin langkah Kegiatan Penutup yang runtut mencakup:
1. Refleksi & evaluasi pembelajaran bersama peserta didik
2. Pengecekan ketercapaian tujuan pembelajaran & kesimpulan
3. Penyampaian materi / rencana pertemuan berikutnya
4. Doa dan salam penutup.
Format: Daftar bernomor 1-4 ringkas dan jelas.
`.trim();
}

module.exports = {
  buildApersepsiPrompt,
  buildSyntaxStepPrompt,
  buildAssessmentPrompt,
  buildPembukaanPrompt,
  buildPenutupanPrompt
};
