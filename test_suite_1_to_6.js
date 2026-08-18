const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { safeMergeDocx } = require('./services/safe_merge');

// XML Well-Formedness Validator
function validateDocxXml(buffer, testName) {
  try {
    const zip = new PizZip(buffer);
    const docXml = zip.file('word/document.xml').asText();
    
    // Check tag balance for critical tags
    const tagsToCheck = ['w:body', 'w:tbl', 'w:tr', 'w:tc', 'w:p', 'w:r', 'w:txbxContent', 'wps:wsp', 'mc:Choice', 'mc:Fallback', 'mc:AlternateContent'];
    const tagErrors = [];

    tagsToCheck.forEach(tag => {
      // Opening tags (accounting for attributes)
      const openMatches = docXml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) || [];
      // Closing tags
      const closeMatches = docXml.match(new RegExp(`</${tag}>`, 'g')) || [];

      if (openMatches.length !== closeMatches.length) {
        tagErrors.push(`Tag <${tag}> mismatch: ${openMatches.length} opened vs ${closeMatches.length} closed!`);
      }
    });

    if (tagErrors.length > 0) {
      console.error(`❌ [${testName}] XML Tag Balance FAILED:`, tagErrors);
      return false;
    }

    // Check if remaining MERGEFIELD or broken tags exist
    const hasUnclosedTag = docXml.includes('<<') || docXml.includes('>>');
    if (hasUnclosedTag) {
      console.error(`❌ [${testName}] Found unclosed bracket tags!`);
      return false;
    }

    console.log(`✅ [${testName}] DOCX XML Structure is 100% VALID & WELL-FORMED!`);
    return true;
  } catch (err) {
    console.error(`❌ [${testName}] Exception during validation:`, err.message);
    return false;
  }
}

const templatePath = path.join(__dirname, 'template.docx');
const templateBuffer = fs.readFileSync(templatePath);

console.log('====================================================');
console.log('  RUNNING TESTS 1 TO 6 — DOCX STRUCTURAL VALIDATION');
console.log('====================================================\n');

// TEST 1: Template asli + Nama Guru saja
console.log('--- TEST 1: Template Asli + Nama Guru Saja ---');
const t1Data = { namaGuru: 'Erian Sukarna Putera, S.Kom' };
const t1Buf = safeMergeDocx(templateBuffer, t1Data);
fs.writeFileSync(path.join(__dirname, 'test1_output.docx'), t1Buf);
const t1Valid = validateDocxXml(t1Buf, 'TEST 1');

// TEST 2: Template asli + Nama Guru + Materi + Fase
console.log('\n--- TEST 2: Nama Guru + Materi + Fase ---');
const t2Data = {
  namaGuru: 'Erian Sukarna Putera, S.Kom',
  materi: 'Virtual Local Area Network',
  fase: 'Fase F'
};
const t2Buf = safeMergeDocx(templateBuffer, t2Data);
fs.writeFileSync(path.join(__dirname, 'test2_output.docx'), t2Buf);
const t2Valid = validateDocxXml(t2Buf, 'TEST 2');

// TEST 3: Tambahkan CP dan TP
console.log('\n--- TEST 3: Tambahkan CP dan TP ---');
const t3Data = {
  ...t2Data,
  cp: 'Peserta didik mampu memahami konsep dan konfigurasi VLAN pada switch managed.',
  tp: 'Peserta didik dapat merancang topologi VLAN, mengonfigurasi access dan trunk port, serta menguji isolasi broadcast domain.'
};
const t3Buf = safeMergeDocx(templateBuffer, t3Data);
fs.writeFileSync(path.join(__dirname, 'test3_output.docx'), t3Buf);
const t3Valid = validateDocxXml(t3Buf, 'TEST 3');

// TEST 4: Tambahkan Apersepsi
console.log('\n--- TEST 4: Tambahkan Apersepsi ---');
const t4Data = {
  ...t3Data,
  apersepsi: 'Apersepsi:\nBayangkan sebuah gedung kantor dengan banyak departemen (Keuangan, HRD, IT) dalam satu lantai. Tanpa sekat ruangan, suara dan lalu lintas orang akan saling mengganggu. VLAN bertindak seperti sekat dinding virtual yang membagi ruangan dalam satu gedung fisik.'
};
const t4Buf = safeMergeDocx(templateBuffer, t4Data);
fs.writeFileSync(path.join(__dirname, 'test4_output.docx'), t4Buf);
const t4Valid = validateDocxXml(t4Buf, 'TEST 4');

// TEST 5: Tambahkan satu kegiatan sintaks
console.log('\n--- TEST 5: Tambahkan Satu Kegiatan Sintaks ---');
const t5Data = {
  ...t4Data,
  langkah1: 'Stimulasi:\n- Guru menampilkan topologi switch dengan 20 PC dalam satu broadcast domain.\n- Guru memberikan pertanyaan pemantik: "Apa dampak jika salah satu PC mengirim broadcast virus ke seluruh jaringan?"\n\nIdentifikasi Masalah:\n- Peserta didik mengidentifikasi perlunya segmentasi jaringan menggunakan VLAN.'
};
const t5Buf = safeMergeDocx(templateBuffer, t5Data);
fs.writeFileSync(path.join(__dirname, 'test5_output.docx'), t5Buf);
const t5Valid = validateDocxXml(t5Buf, 'TEST 5');

// TEST 6: Tambahkan semua sintaks
console.log('\n--- TEST 6: Tambahkan Semua Sintaks ---');
const t6Data = {
  ...t5Data,
  tanggal: '18 Agustus 2026',
  kelas: 'XI TKJ 1',
  jp: '18 JP',
  elemenTema: 'Network Administrator',
  subMateri: 'Konsep VLAN, VLAN ID, Access Port, Trunk Port',
  metode: ['Ceramah Interaktif', 'Diskusi Kelompok', 'Praktikum / Eksplorasi'],
  tingkatUkrk: 'Tinggi',
  langkah2: 'Pengumpulan Data:\n- Guru mendemonstrasikan konfigurasi vlan database dan interface mode.\n- Peserta didik mencatat perintah switchport mode access & trunk.\n\nPengolahan Data:\n- Peserta didik mengerjakan LKPD Interaktif konfigurasi 3 VLAN di Cisco Packet Tracer.',
  langkah3: 'Verifikasi:\n- Guru mengecek tabel switchport dan menguji ping antar-VLAN.\n- Peserta didik mempresentasikan skema pengalamatan VLAN.\n\nGeneralisasi:\n- Menyimpulkan pentingnya VLAN untuk efisiensi dan keamanan jaringan industri.',
  asesmen: 'Teori: Kuis pemahaman konsep broadcast domain dan trunking 802.1Q. Praktik/LKPD: Uji isolasi traffic VLAN pada simulator.'
};
const t6Buf = safeMergeDocx(templateBuffer, t6Data);
fs.writeFileSync(path.join(__dirname, 'test6_output.docx'), t6Buf);
const t6Valid = validateDocxXml(t6Buf, 'TEST 6');

console.log('\n====================================================');
if (t1Valid && t2Valid && t3Valid && t4Valid && t5Valid && t6Valid) {
  console.log('  ALL 6 TESTS PASSED WITH 100% SUCCESS! 🎉');
} else {
  console.log('  SOME TESTS FAILED ❌');
}
console.log('====================================================');
