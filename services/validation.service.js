/**
 * services/validation.service.js
 * Validasi kelengkapan data modul ajar sebelum generate DOCX.
 */

function validateModulData(data) {
  const missingFields = [];

  if (!data.namaGuru || !data.namaGuru.trim()) {
    missingFields.push({ field: 'namaGuru', step: 1, label: 'Nama Guru' });
  }
  if (!data.mataPelajaran || !data.mataPelajaran.trim()) {
    missingFields.push({ field: 'mataPelajaran', step: 1, label: 'Mata Pelajaran' });
  }
  if (!data.tanggal || !data.tanggal.trim()) {
    missingFields.push({ field: 'tanggal', step: 1, label: 'Tanggal KBM' });
  }
  if (!data.fase || !data.fase.trim()) {
    missingFields.push({ field: 'fase', step: 1, label: 'Fase' });
  }
  if (!data.kelas || !data.kelas.trim()) {
    missingFields.push({ field: 'kelas', step: 1, label: 'Kelas' });
  }
  if (!data.jp || !data.jp.toString().trim()) {
    missingFields.push({ field: 'jp', step: 1, label: 'Alokasi Jam Pelajaran (JP)' });
  }
  if (!data.elemenTema || !data.elemenTema.trim()) {
    missingFields.push({ field: 'elemenTema', step: 1, label: 'Elemen / Tema' });
  }
  if (!data.materi || !data.materi.trim()) {
    missingFields.push({ field: 'materi', step: 1, label: 'Materi Utama' });
  }
  if (!data.subMateri || !data.subMateri.trim()) {
    missingFields.push({ field: 'subMateri', step: 1, label: 'Sub Materi' });
  }
  if (!data.cp || !data.cp.trim()) {
    missingFields.push({ field: 'cp', step: 2, label: 'Capaian Pembelajaran (CP)' });
  }
  if (!data.tp || !data.tp.trim()) {
    missingFields.push({ field: 'tp', step: 2, label: 'Tujuan Pembelajaran (TP)' });
  }
  if (!data.modelId || !data.modelId.trim()) {
    missingFields.push({ field: 'modelId', step: 3, label: 'Model Pembelajaran' });
  }
  if (!data.apersepsi || !data.apersepsi.trim()) {
    missingFields.push({ field: 'apersepsi', step: 4, label: 'Narasi Apersepsi' });
  }
  if (!data.langkah1 || !data.langkah1.trim()) {
    missingFields.push({ field: 'langkah1', step: 5, label: 'Kegiatan Inti (Langkah 1)' });
  }
  if (!data.langkah2 || !data.langkah2.trim()) {
    missingFields.push({ field: 'langkah2', step: 5, label: 'Kegiatan Inti (Langkah 2)' });
  }
  if (!data.langkah3 || !data.langkah3.trim()) {
    missingFields.push({ field: 'langkah3', step: 5, label: 'Kegiatan Inti (Langkah 3)' });
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    message: missingFields.length === 0
      ? 'Data lengkap dan siap diekspor ke format DOCX.'
      : `Terdapat ${missingFields.length} data wajib yang belum diisi. Silakan lengkapi terlebih dahulu.`
  };
}

module.exports = {
  validateModulData
};
