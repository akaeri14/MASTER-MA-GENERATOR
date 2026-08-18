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

/**
 * Convert multiline text into valid Word paragraphs for a textbox
 */
function buildTextboxParagraphs(text, isApersepsi = false) {
  if (!text) return '<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr><w:sz w:val="15"/><w:szCs w:val="15"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="15"/><w:szCs w:val="15"/><w:lang w:val="nb-NO"/></w:rPr><w:t></w:t></w:r></w:p>';

  const lines = String(text).split(/\r?\n/);
  const szVal = isApersepsi ? '14' : '15';

  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Empty spacing paragraph
      return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr></w:p>`;
    }
    const escaped = escapeXml(line);
    // If heading (ends with : or is a section title), apply bold if desired
    const isHeading = line.endsWith(':') || line.startsWith('Stimulasi:') || line.startsWith('Identifikasi') || line.startsWith('Pengumpulan') || line.startsWith('Pengolahan') || line.startsWith('Verifikasi') || line.startsWith('Generalisasi') || line.startsWith('Orientasi') || line.startsWith('Mengorganisasi') || line.startsWith('Membimbing') || line.startsWith('Mengembangkan') || line.startsWith('Evaluasi') || line.startsWith('Pertanyaan') || line.startsWith('Mendesain') || line.startsWith('Menyusun') || line.startsWith('Memonitor') || line.startsWith('Menguji');
    const boldTag = isHeading ? '<w:b/><w:bCs/>' : '';

    return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr>${boldTag}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr><w:r><w:rPr>${boldTag}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
  }).join('');
}

function safeMergeDocx(templateBuffer, data) {
  const zip = new PizZip(templateBuffer);
  let docXml = zip.file('word/document.xml').asText();

  const metodeStr = Array.isArray(data.metode) ? data.metode.join(', ') : (data.metode || '');
  const jpStr = data.jp ? (String(data.jp).includes('JP') ? String(data.jp) : `${data.jp} JP`) : '';
  const faseStr = data.fase || '';

  const fieldValues = {
    'TANGGAL': data.tanggal || '[Sesuai Jadwal]',
    'FASE': faseStr,
    'JP': jpStr,
    'ELEMENTEMA': data.elemenTema || '',
    'MATERI': data.materi || '',
    'SUB_MATERI': data.subMateri || '',
    'METODE_PENYAMPAIAN': metodeStr,
    'JENIS_UKRK': data.tingkatUkrk || 'Tinggi',
    'EVALUASIASSESMENT': data.asesmen || '',
    'NARASICP_IKM_atau_KD_K13': data.cp || '',
    'TUJUANPEMBELAJARAN': data.tp || '',
    'APERSEPSI': data.apersepsi || '',
    'LANGKAH_1': data.langkah1 || '',
    'LANGKAH_2': data.langkah2 || '',
    'LANGKAH_3': data.langkah3 || ''
  };

  // 1. Process all Textboxes (<w:txbxContent>...</w:txbxContent>)
  docXml = docXml.replace(/<w:txbxContent>([\s\S]*?)<\/w:txbxContent>/g, (match, innerContent) => {
    // Check if this textbox contains LANGKAH_1, LANGKAH_2, LANGKAH_3, APERSEPSI, or TANGGAL
    if (innerContent.includes('MERGEFIELD LANGKAH_1')) {
      return `<w:txbxContent>${buildTextboxParagraphs(fieldValues['LANGKAH_1'], false)}</w:txbxContent>`;
    }
    if (innerContent.includes('MERGEFIELD LANGKAH_2')) {
      return `<w:txbxContent>${buildTextboxParagraphs(fieldValues['LANGKAH_2'], false)}</w:txbxContent>`;
    }
    if (innerContent.includes('MERGEFIELD LANGKAH_3')) {
      return `<w:txbxContent>${buildTextboxParagraphs(fieldValues['LANGKAH_3'], false)}</w:txbxContent>`;
    }
    if (innerContent.includes('MERGEFIELD APERSEPSI')) {
      return `<w:txbxContent>${buildTextboxParagraphs(fieldValues['APERSEPSI'], true)}</w:txbxContent>`;
    }
    if (innerContent.includes('MERGEFIELD TANGGAL')) {
      // Signature date textbox: Bogor, [Tanggal] \n Guru Mata Pelajaran \n\n\n\n Erian Sukarna Putera, S.Kom
      const guruName = data.namaGuru || 'Erian Sukarna Putera, S.Kom';
      const tgl = fieldValues['TANGGAL'];
      return `<w:txbxContent><w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:lang w:val="nb-NO"/></w:rPr></w:pPr><w:r><w:rPr><w:lang w:val="nb-NO"/></w:rPr><w:t xml:space="preserve">Bogor, ${escapeXml(tgl)}</w:t><w:br/><w:t xml:space="preserve">Guru Mata Pelajaran</w:t><w:br/><w:br/><w:br/><w:br/><w:t xml:space="preserve">${escapeXml(guruName)}</w:t></w:r></w:p></w:txbxContent>`;
    }
    return match;
  });

  // 2. Process all Table Cells (<w:tc>...</w:tc>) for table fields
  // Table fields: TANGGAL, FASE, JP, ELEMENTEMA, MATERI, SUB_MATERI, METODE_PENYAMPAIAN, JENIS_UKRK, EVALUASIASSESMENT, NARASICP_IKM_atau_KD_K13, TUJUANPEMBELAJARAN
  const tableFields = [
    'TANGGAL', 'FASE', 'JP', 'ELEMENTEMA', 'MATERI', 'SUB_MATERI',
    'METODE_PENYAMPAIAN', 'JENIS_UKRK', 'EVALUASIASSESMENT',
    'NARASICP_IKM_atau_KD_K13', 'TUJUANPEMBELAJARAN'
  ];

  for (const fieldName of tableFields) {
    const val = fieldValues[fieldName];
    const escapedVal = escapeXml(val);

    // Look for <w:tc> containing this field
    // In template: <w:tc> ... <w:p> ... MERGEFIELD fieldName ... </w:p> </w:tc>
    const tcRegex = new RegExp(`(<w:tc[\\s\\S]*?MERGEFIELD\\s+${fieldName}[\\s\\S]*?<\\/w:tc>)`, 'g');
    docXml = docXml.replace(tcRegex, (tcMatch) => {
      // Find paragraph properties <w:pPr> if any
      const pPrMatch = tcMatch.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
      const pPr = pPrMatch ? pPrMatch[0] : '<w:pPr><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:pPr>';

      // Find run properties <w:rPr>
      const rPrMatch = tcMatch.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
      const rPr = rPrMatch ? rPrMatch[0] : '<w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>';

      // Find cell properties <w:tcPr>...</w:tcPr>
      const tcPrMatch = tcMatch.match(/<w:tcPr>[\s\S]*?<\/w:tcPr>/);
      const tcPr = tcPrMatch ? tcPrMatch[0] : '';

      return `<w:tc>${tcPr}<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapedVal}</w:t></w:r></w:p></w:tc>`;
    });
  }

  // 3. Update Static Teacher Name if needed
  if (data.namaGuru && data.namaGuru.trim()) {
    const escapedGuru = escapeXml(data.namaGuru.trim());
    docXml = docXml.replace(/Erian Sukarna Putera, S\.Kom/g, escapedGuru);
    docXml = docXml.replace(/Erian Sukarna Putera/g, escapedGuru);
  }

  // 4. Update document.xml
  zip.file('word/document.xml', docXml);

  // 5. Clean settings.xml mailMerge to avoid external link warnings
  if (zip.file('word/settings.xml')) {
    let settingsXml = zip.file('word/settings.xml').asText();
    settingsXml = settingsXml.replace(/<w:mailMerge[\s\S]*?<\/w:mailMerge>/gi, '');
    zip.file('word/settings.xml', settingsXml);
  }

  return zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
}

module.exports = {
  safeMergeDocx
};
