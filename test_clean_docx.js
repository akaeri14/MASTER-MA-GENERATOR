const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatXmlTextWithBreaks(text, rPr = '') {
  if (!text) return `<w:r>${rPr}<w:t></w:t></w:r>`;
  const lines = String(text).split(/\r?\n/);
  const runs = lines.map((line, idx) => {
    const escaped = escapeXml(line);
    const br = idx > 0 ? '<w:br/>' : '';
    return `${br}<w:t xml:space="preserve">${escaped}</w:t>`;
  });
  return `<w:r>${rPr}${runs.join('')}</w:r>`;
}

function convertMailMergeToPlainText(docXml, fieldValues) {
  // Find all field occurrences by instrText
  const instrRegex = /<w:instrText[^>]*>\s*MERGEFIELD\s+([^\s\\"]+)[^<]*<\/w:instrText>/gi;
  
  let match;
  const matches = [];
  while ((match = instrRegex.exec(docXml)) !== null) {
    const fieldName = match[1];
    const instrPos = match.index;
    matches.push({ fieldName, instrPos });
  }

  console.log(`Found ${matches.length} MERGEFIELD occurrences to unlink into plain text.`);

  // Process backwards
  matches.reverse().forEach(({ fieldName, instrPos }) => {
    // 1. Find <w:fldChar w:fldCharType="begin" before instrPos
    const beginIndex = docXml.lastIndexOf('w:fldCharType="begin"', instrPos);
    if (beginIndex === -1) return;
    const beginRunStart = docXml.lastIndexOf('<w:r', beginIndex);
    if (beginRunStart === -1) return;

    // 2. Find <w:fldChar w:fldCharType="separate" after instrPos
    const sepIndex = docXml.indexOf('w:fldCharType="separate"', instrPos);
    if (sepIndex === -1) return;
    const sepRunEnd = docXml.indexOf('</w:r>', sepIndex) + 6;

    // 3. Find <w:fldChar w:fldCharType="end" after sepRunEnd
    const endIndex = docXml.indexOf('w:fldCharType="end"', sepRunEnd);
    if (endIndex === -1) return;
    const endRunEnd = docXml.indexOf('</w:r>', endIndex) + 6;

    // Extract rPr from the begin or separate run to preserve formatting
    const snippet = docXml.substring(beginRunStart, sepRunEnd);
    const rPrMatch = snippet.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
    const rPr = rPrMatch ? rPrMatch[0] : '<w:rPr><w:lang w:val="id-ID"/></w:rPr>';

    // Target value
    const targetValue = fieldValues[fieldName] !== undefined ? fieldValues[fieldName] : '';
    const replacementPlainRuns = formatXmlTextWithBreaks(targetValue, rPr);

    // Replace the ENTIRE field (from beginRunStart to endRunEnd) with plain text runs!
    docXml = docXml.substring(0, beginRunStart) + replacementPlainRuns + docXml.substring(endRunEnd);
  });

  return docXml;
}

const templatePath = path.join(__dirname, 'template.docx');
const zip = new PizZip(fs.readFileSync(templatePath));
let docXml = zip.file('word/document.xml').asText();

const mockData = {
  'TANGGAL': '18 Agustus 2026',
  'FASE': 'Fase F',
  'JP': '18 JP',
  'ELEMENTEMA': 'Network Admin',
  'MATERI': 'Dasar Jaringan',
  'SUB_MATERI': 'Jenis Jaringan, IP Address, Konektivitas Jaringan',
  'METODE_PENYAMPAIAN': 'Ceramah, Diskusi, Praktikum',
  'JENIS_UKRK': 'Tinggi',
  'EVALUASIASSESMENT': 'Teori: Tanya jawab. Praktik: Simulasi.',
  'NARASICP_IKM_atau_KD_K13': 'Peserta didik mampu memahami dasar jaringan dengan benar.',
  'TUJUANPEMBELAJARAN': 'Peserta didik mampu memahami dasar jaringan dan mengonfigurasi IP.',
  'APERSEPSI': 'Bayangkan sebuah kota besar tanpa rambu penunjuk jalan.',
  'LANGKAH_1': 'Stimulasi:\n- Guru menampilkan topologi jaringan.\n- Guru memberikan pertanyaan pemantik.',
  'LANGKAH_2': 'Pengumpulan Data:\n- Guru menyampaikan materi.\n- Siswa berdiskusi.\n\nPengolahan Data:\n- Siswa mengerjakan LKPD.',
  'LANGKAH_3': 'Verifikasi:\n- Siswa mempresentasikan hasil.\n\nGeneralisasi:\n- Menyimpulkan materi.'
};

const resultXml = convertMailMergeToPlainText(docXml, mockData);

// Check if any MERGEFIELD remains
const remaining = resultXml.match(/MERGEFIELD/g);
console.log('Remaining MERGEFIELD count in output:', remaining ? remaining.length : 0);

// Check if any fldChar remains
const remainingFldChar = resultXml.match(/w:fldChar/g);
console.log('Remaining w:fldChar count in output:', remainingFldChar ? remainingFldChar.length : 0);

zip.file('word/document.xml', resultXml);
const buffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(path.join(__dirname, 'clean_editable_output.docx'), buffer);
console.log('Saved clean editable docx successfully! Size:', buffer.length);
