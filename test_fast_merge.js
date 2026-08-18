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

function formatXmlTextWithBreaks(text) {
  if (!text) return '';
  const lines = String(text).split(/\r?\n/);
  return lines.map((line, idx) => {
    const escaped = escapeXml(line);
    const br = idx > 0 ? '<w:br/>' : '';
    return `${br}<w:t xml:space="preserve">${escaped}</w:t>`;
  }).join('');
}

function fastLinearMailMerge(docXml, fieldValues) {
  // Find all field occurrences by instrText
  // Pattern: <w:instrText xml:space="preserve"> MERGEFIELD FieldName ... </w:instrText>
  const instrRegex = /<w:instrText[^>]*>\s*MERGEFIELD\s+([^\s\\"]+)[^<]*<\/w:instrText>/gi;
  
  // We will collect replacement intervals
  // Each field in docx has:
  // [beginRun] ... [instrRun] ... [separateRun] ... [resultRuns...] ... [endRun]
  
  let match;
  // Let's do replacements from end to start to keep indices valid
  const matches = [];
  while ((match = instrRegex.exec(docXml)) !== null) {
    const fieldName = match[1];
    const instrPos = match.index;
    matches.push({ fieldName, instrPos });
  }

  console.log(`Found ${matches.length} MERGEFIELD occurrences.`);

  // Process backwards
  matches.reverse().forEach(({ fieldName, instrPos }) => {
    // Find <w:fldChar w:fldCharType="separate" after instrPos
    const sepIndex = docXml.indexOf('w:fldCharType="separate"', instrPos);
    if (sepIndex === -1) return;

    // Find the end of the separate run: </w:r>
    const sepRunEnd = docXml.indexOf('</w:r>', sepIndex) + 6;

    // Find <w:fldChar w:fldCharType="end" after sepRunEnd
    const endIndex = docXml.indexOf('w:fldCharType="end"', sepRunEnd);
    if (endIndex === -1) return;

    // Find the start of the end run: the <w:r that precedes endIndex
    const endRunStart = docXml.lastIndexOf('<w:r', endIndex);
    if (endRunStart === -1 || endRunStart < sepRunEnd) return;

    // Everything between sepRunEnd and endRunStart is the old result runs!
    const targetValue = fieldValues[fieldName] !== undefined ? fieldValues[fieldName] : null;
    if (targetValue !== null) {
      const formattedRuns = formatXmlTextWithBreaks(targetValue);
      const newResultRun = `<w:r><w:rPr><w:lang w:val="id-ID"/></w:rPr>${formattedRuns}</w:r>`;

      docXml = docXml.substring(0, sepRunEnd) + newResultRun + docXml.substring(endRunStart);
    }
  });

  return docXml;
}

const templatePath = path.join(__dirname, 'template.docx');
const zip = new PizZip(fs.readFileSync(templatePath));
let docXml = zip.file('word/document.xml').asText();

const start = Date.now();
const res = fastLinearMailMerge(docXml, {
  'TANGGAL': '18 Agustus 2026',
  'FASE': 'Fase F',
  'JP': '18 JP',
  'ELEMENTEMA': 'Network Admin',
  'MATERI': 'Dasar Jaringan',
  'SUB_MATERI': 'IP Address, Topologi',
  'METODE_PENYAMPAIAN': 'Ceramah, Diskusi',
  'JENIS_UKRK': 'Tinggi',
  'EVALUASIASSESMENT': 'Teori dan Praktik',
  'NARASICP_IKM_atau_KD_K13': 'CP Test',
  'TUJUANPEMBELAJARAN': 'TP Test',
  'APERSEPSI': 'Apersepsi Test',
  'LANGKAH_1': 'Langkah 1 Test',
  'LANGKAH_2': 'Langkah 2 Test',
  'LANGKAH_3': 'Langkah 3 Test'
});
console.log(`Execution time: ${Date.now() - start} ms`);
console.log('Result includes "Dasar Jaringan":', res.includes('Dasar Jaringan'));
