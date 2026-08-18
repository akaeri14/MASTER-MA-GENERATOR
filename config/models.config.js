/**
 * config/models.config.js
 * Definisi konfigurasi Model Pembelajaran, Sintaks, Apersepsi, Metode, Media,
 * dan Pemetaan Slot Mail Merge.
 */

const LEARNING_MODELS = {
  discovery_learning: {
    id: 'discovery_learning',
    name: 'Discovery Learning',
    description: 'Model pembelajaran yang menitikberatkan pada penemuan konsep secara aktif dan mandiri oleh peserta didik.',
    badge: 'Penemuan Mandiri',
    steps: [
      {
        id: 'stimulation',
        name: 'Stimulasi (Stimulation)',
        label: '1. Pemberian Rangsangan (Stimulation)',
        slot: 'LANGKAH_1',
        order: 1,
        header: 'Stimulasi:',
        hint: 'Guru memberikan rangsangan berupa fenomena, contoh, teks, objek, atau pertanyaan pemantik yang relevan.'
      },
      {
        id: 'problem_statement',
        name: 'Identifikasi Masalah (Problem Statement)',
        label: '2. Pernyataan / Identifikasi Masalah (Problem Statement)',
        slot: 'LANGKAH_1',
        order: 2,
        header: 'Identifikasi Masalah:',
        hint: 'Guru membimbing siswa mengidentifikasi masalah, menyusun hipotesis, atau merumuskan skenario kerja.'
      },
      {
        id: 'data_collection',
        name: 'Pengumpulan Data (Data Collection)',
        label: '3. Pengumpulan Data (Data Collection)',
        slot: 'LANGKAH_2',
        order: 3,
        header: 'Pengumpulan Data:',
        hint: 'Penyampaian materi esensial oleh guru dan eksplorasi data/informasi oleh peserta didik.'
      },
      {
        id: 'data_processing',
        name: 'Pengolahan Data (Data Processing)',
        label: '4. Pengolahan Data (Data Processing)',
        slot: 'LANGKAH_2',
        order: 4,
        header: 'Pengolahan Data:',
        hint: 'Peserta didik mengolah bukti atau informasi dan menyelesaikan tugas belajar yang relevan.'
      },
      {
        id: 'verification',
        name: 'Verifikasi (Verification)',
        label: '5. Pembuktian / Verifikasi (Verification)',
        slot: 'LANGKAH_3',
        order: 5,
        header: 'Verifikasi:',
        hint: 'Guru menguji pemahaman / cek asesmen formatif, dan peserta didik mempresentasikan hasilnya.'
      },
      {
        id: 'generalization',
        name: 'Generalisasi (Generalization)',
        label: '6. Menarik Kesimpulan / Generalisasi (Generalization)',
        slot: 'LANGKAH_3',
        order: 6,
        header: 'Generalisasi:',
        hint: 'Guru dan siswa menyimpulkan prinsip umum konsep serta penerapannya pada konteks yang relevan.'
      }
    ]
  },

  problem_based_learning: {
    id: 'problem_based_learning',
    name: 'Problem Based Learning (PBL)',
    description: 'Model pembelajaran yang menantang peserta didik memecahkan masalah nyata/lapangan secara terarah.',
    badge: 'Pemecahan Masalah',
    steps: [
      {
        id: 'orientasi_masalah',
        name: 'Orientasi Peserta Didik pada Masalah',
        label: '1. Orientasi Peserta Didik pada Masalah',
        slot: 'LANGKAH_1',
        order: 1,
        header: 'Orientasi Masalah:',
        hint: 'Guru memaparkan permasalahan nyata yang relevan dan menantang.'
      },
      {
        id: 'organisasi_belajar',
        name: 'Mengorganisasi Peserta Didik untuk Belajar',
        label: '2. Mengorganisasi Peserta Didik',
        slot: 'LANGKAH_1',
        order: 2,
        header: 'Mengorganisasi Peserta Didik:',
        hint: 'Guru membagi kelompok, menetapkan peran, dan mendefinisikan tugas penyelidikan.'
      },
      {
        id: 'bimbingan_penyelidikan',
        name: 'Membimbing Penyelidikan Mandiri dan Kelompok',
        label: '3. Membimbing Penyelidikan Mandiri/Kelompok',
        slot: 'LANGKAH_2',
        order: 3,
        header: 'Membimbing Penyelidikan:',
        hint: 'Guru memfasilitasi pengumpulan bukti, eksplorasi, dan pendampingan saat peserta didik bekerja.'
      },
      {
        id: 'pengembangan_hasil',
        name: 'Mengembangkan dan Menyajikan Hasil Karya',
        label: '4. Mengembangkan & Menyajikan Hasil Karya',
        slot: 'LANGKAH_3',
        order: 4,
        header: 'Mengembangkan & Menyajikan Hasil:',
        hint: 'Peserta didik menyusun hasil kerja/solusi dan mengomunikasikannya.'
      },
      {
        id: 'evaluasi_proses',
        name: 'Menganalisis & Mengevaluasi Proses Pemecahan Masalah',
        label: '5. Menganalisis & Mengevaluasi Proses',
        slot: 'LANGKAH_3',
        order: 5,
        header: 'Evaluasi Proses Pemecahan Masalah:',
        hint: 'Guru dan peserta didik merefleksikan efektivitas solusi dan mengambil kesimpulan esensial.'
      }
    ]
  },

  project_based_learning: {
    id: 'project_based_learning',
    name: 'Project Based Learning (PjBL)',
    description: 'Model pembelajaran yang memandu peserta didik merancang dan menghasilkan produk/karya nyata.',
    badge: 'Berbasis Proyek',
    steps: [
      {
        id: 'pertanyaan_mendasar',
        name: 'Penentuan Pertanyaan Mendasar',
        label: '1. Penentuan Pertanyaan Mendasar',
        slot: 'LANGKAH_1',
        order: 1,
        header: 'Pertanyaan Mendasar:',
        hint: 'Guru mengajukan pertanyaan pemantik mengenai kebutuhan rancangan/produk yang akan dibuat.'
      },
      {
        id: 'desain_proyek',
        name: 'Mendesain Perencanaan Proyek',
        label: '2. Mendesain Perencanaan Proyek',
        slot: 'LANGKAH_1',
        order: 2,
        header: 'Mendesain Perencanaan Proyek:',
        hint: 'Peserta didik merancang skema kerja, memilih alat, bahan, dan menetapkan spesifikasi produk.'
      },
      {
        id: 'jadwal_proyek',
        name: 'Menyusun Jadwal Pembuatan Proyek',
        label: '3. Menyusun Jadwal Pelaksanaan',
        slot: 'LANGKAH_2',
        order: 3,
        header: 'Menyusun Jadwal:',
        hint: 'Peserta didik menyusun timeline kerja per tahap dan menetapkan target milestone.'
      },
      {
        id: 'monitor_proyek',
        name: 'Memonitor Kemajuan dan Keaktifan Peserta Didik',
        label: '4. Memonitor Kemajuan Proyek',
        slot: 'LANGKAH_2',
        order: 4,
        header: 'Memonitor Kemajuan Proyek:',
        hint: 'Guru memantau proses pengerjaan, membimbing kendala teknis, dan mencatat progres proyek.'
      },
      {
        id: 'uji_hasil',
        name: 'Menguji Hasil (Assessment of Outcome)',
        label: '5. Menguji Hasil & Presentasi Produk',
        slot: 'LANGKAH_3',
        order: 5,
        header: 'Menguji Hasil:',
        hint: 'Peserta didik mendemonstrasikan hasil proyek dan diuji fungsionalitasnya oleh guru & rekan.'
      },
      {
        id: 'evaluasi_pengalaman',
        name: 'Evaluasi Pengalaman Belajar',
        label: '6. Evaluasi Pengalaman Belajar',
        slot: 'LANGKAH_3',
        order: 6,
        header: 'Evaluasi Pengalaman:',
        hint: 'Refleksi terhadap seluruh tahapan pembuatan proyek dan peluang pengembangan lebih lanjut.'
      }
    ]
  }
};

const APERSEPSI_TYPES = [
  {
    id: 'analogi',
    name: 'Analogi Konseptual',
    description: 'Menghubungkan konsep materi yang abstrak dengan perumpamaan / analogi kehidupan sehari-hari.',
    badge: 'Analogi'
  },
  {
    id: 'ctl',
    name: 'Contextual Teaching & Learning (CTL)',
    description: 'Menghubungkan materi dengan dunia nyata, lingkungan sekitar, pengalaman, atau situasi kontekstual peserta didik.',
    badge: 'Kontekstual'
  },
  {
    id: 'review',
    name: 'Review Materi Sebelumnya',
    description: 'Mengaitkan materi yang telah dipelajari pada pertemuan sebelumnya sebagai jembatan menuju materi saat ini.',
    badge: 'Prasyarat / Review'
  }
];

const DEFAULT_METODE = [
  'Ceramah Interaktif',
  'Diskusi Kelompok',
  'Tanya Jawab',
  'Demonstrasi',
  'Praktikum / Eksplorasi',
  'Simulasi / Simulator',
  'Presentasi',
  'ClassPoint'
];

const DEFAULT_MEDIA = [
  'Buku / Teks / Bahan Bacaan',
  'Laptop / PC',
  'Proyektor / Smart TV',
  'LKPD / Lembar Kerja',
  'Alat dan Bahan Sesuai Materi',
  'Lingkungan Sekitar / Objek Pengamatan',
  'Video / Audio Pembelajaran',
  'Papan Tulis / Spidol'
];

const UKRK_LEVELS = ['Tinggi', 'Sedang', 'Rendah'];

const FASE_OPTIONS = [
  { value: 'Fase E', label: 'Fase E (Kelas X SMA/SMK)' },
  { value: 'Fase F', label: 'Fase F (Kelas XI - XII SMA/SMK)' },
  { value: 'Fase D', label: 'Fase D (Kelas VII - IX SMP)' },
  { value: 'Fase A', label: 'Fase A (Kelas I - II SD)' },
  { value: 'Fase B', label: 'Fase B (Kelas III - IV SD)' },
  { value: 'Fase C', label: 'Fase C (Kelas V - VI SD)' }
];

// Expose every model that has a Knowledge Base definition in the web wizard.
// The DOCX still has three activity slots; additional syntax stages are
// grouped into those slots without changing the template structure.
const { MODEL_LIBRARY } = require('./knowledge-base');

function knowledgeModelToUiModel(model) {
  const steps = model.syntax.map((syntax, index) => ({
    id: syntax.id,
    name: syntax.name,
    label: `${index + 1}. ${syntax.name}`,
    slot: index < 2 ? 'LANGKAH_1' : index < 4 ? 'LANGKAH_2' : 'LANGKAH_3',
    order: syntax.order || index + 1,
    header: `${syntax.name}:`,
    hint: syntax.description
  }));

  return {
    id: model.id,
    name: model.name,
    description: model.description,
    badge: 'Knowledge Base',
    steps
  };
}

for (const [modelId, model] of Object.entries(MODEL_LIBRARY)) {
  if (!LEARNING_MODELS[modelId]) {
    LEARNING_MODELS[modelId] = knowledgeModelToUiModel(model);
  }
}

module.exports = {
  LEARNING_MODELS,
  APERSEPSI_TYPES,
  DEFAULT_METODE,
  DEFAULT_MEDIA,
  UKRK_LEVELS,
  FASE_OPTIONS
};
