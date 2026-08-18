const fs = require('fs');
const path = require('path');
const { generateMergedDocx } = require('./services/mailmerge.service');

const mockData = {
  namaGuru: 'Ahmad Fauzi, M.Kom',
  mataPelajaran: 'Dasar-Dasar TKJ',
  tanggal: '18 Agustus 2026',
  fase: 'Fase F',
  kelas: 'XI TKJ 1',
  jp: 12,
  elemenTema: 'Jaringan Komputer',
  materi: 'Routing Statis',
  subMateri: 'Konfigurasi IP, Tabel Routing, Pengujian Hop',
  metode: ['Ceramah Interaktif', 'Praktikum / Eksplorasi', 'Tanya Jawab'],
  tingkatUkrk: 'Tinggi',
  cp: 'Peserta didik mampu merancang dan mengonfigurasi routing statis pada jaringan komputer.',
  tp: 'Peserta didik dapat menganalisis jalur routing, mengonfigurasi static route pada router, dan memverifikasi koneksi end-to-end.',
  modelId: 'discovery_learning',
  modelName: 'Discovery Learning',
  apersepsi: 'Bayangkan jalan tol antar kota dengan rambu penunjuk jalur khusus agar kendaraan tidak tersesat.',
  langkah1: 'Stimulasi:\n- Guru menampilkan topologi 2 router di simulator.\n- Pertanyaan: "Mengapa PC A belum bisa ping PC B?"\n\nIdentifikasi Masalah:\n- Peserta didik mengidentifikasi ketiadaan tabel routing.',
  langkah2: 'Pengumpulan Data:\n- Guru mendemonstrasikan sintaks ip route.\n- Peserta didik mencatat aturan next-hop.\n\nPengolahan Data:\n- Peserta didik mengisi LKPD simulasi konfigurasi static routing.',
  langkah3: 'Verifikasi:\n- Guru menguji ping dan traceroute pada simulator siswa.\n- Peserta didik mempresentasikan hasil.\n\nGeneralisasi:\n- Siswa menyimpulkan cara kerja static routing.',
  asesmen: 'Teori: Kuis pilihan ganda konsep routing. Praktik/LKPD: Uji konektivitas router di Cisco Packet Tracer.'
};

try {
  const result = generateMergedDocx(mockData);
  console.log('Success! Output filename:', result.fileName);
  console.log('Output buffer size:', result.buffer.length);

  const outPath = path.join(__dirname, 'output_test.docx');
  fs.writeFileSync(outPath, result.buffer);
  console.log('Saved output to:', outPath);

  // Now let's inspect the output docx XML to verify that values were injected properly
  const PizZip = require('pizzip');
  const zip = new PizZip(result.buffer);
  const docXml = zip.file('word/document.xml').asText();
  
  console.log('\n--- Checking presence of mock values in output XML ---');
  const checkFields = [
    'Ahmad Fauzi, M.Kom',
    '18 Agustus 2026',
    'Fase F',
    '12 JP',
    'Jaringan Komputer',
    'Routing Statis',
    'Konfigurasi IP, Tabel Routing, Pengujian Hop',
    'Ceramah Interaktif, Praktikum / Eksplorasi, Tanya Jawab',
    'Peserta didik mampu merancang dan mengonfigurasi routing statis',
    'Bayangkan jalan tol antar kota',
    'Stimulasi:',
    'Kuis pilihan ganda'
  ];

  checkFields.forEach(f => {
    const found = docXml.includes(f);
    console.log(`Presence of "${f.substring(0, 30)}...": ${found ? 'PASSED ✅' : 'FAILED ❌'}`);
  });

} catch (err) {
  console.error('Error during test:', err);
}
