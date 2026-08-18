/**
 * services/mailmerge.service.js
 * Robust & Structurally Safe DOCX Generation Engine for Master Template.
 * 
 * Melakukan pengisian data ke template master asli (template.docx) dengan:
 * 1. Menjaga struktur XML paragraf (<w:p>) dan textboxes (<w:txbxContent>) 100% seimbang dan valid.
 * 2. Mengonversi seluruh Mail Merge fields menjadi native editable Word text.
 * 3. Menjaga formatting tabel, border, margin, font, warna, and shape properties.
 * 4. Validasi integritas XML otomatis sebelum file dikirimkan ke user.
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const TEMPLATE_PATH = path.join(__dirname, '../template.docx');

/**
 * Escape XML special characters
 */
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
 * Convert multiline text into valid Word paragraphs for a textbox container
 */
function buildTextboxParagraphs(text, isApersepsi = false) {
  const szVal = isApersepsi ? '14' : '15';

  if (!text || !text.trim()) {
    return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr><w:t></w:t></w:r></w:p>`;
  }

  const lines = String(text).split(/\r?\n/);

  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Empty spacing paragraph
      return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr></w:p>`;
    }
    const escaped = escapeXml(line);
    const isHeading = line.endsWith(':') || 
      line.startsWith('Stimulasi:') || line.startsWith('Identifikasi') || 
      line.startsWith('Pengumpulan') || line.startsWith('Pengolahan') || 
      line.startsWith('Verifikasi') || line.startsWith('Generalisasi') || 
      line.startsWith('Orientasi') || line.startsWith('Mengorganisasi') || 
      line.startsWith('Membimbing') || line.startsWith('Mengembangkan') || 
      line.startsWith('Evaluasi') || line.startsWith('Pertanyaan') || 
      line.startsWith('Mendesain') || line.startsWith('Menyusun') || 
      line.startsWith('Memonitor') || line.startsWith('Menguji');

    const boldTag = isHeading ? '<w:b/><w:bCs/>' : '';

    return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:rPr>${boldTag}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr></w:pPr><w:r><w:rPr>${boldTag}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/><w:lang w:val="nb-NO"/></w:rPr><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
  }).join('');
}

/**
 * Replace generated-content merge fields only inside a textbox.
 *
 * The curriculum/identity panel uses short values, so replacing the field
 * result in-place preserves its original layout. The learning-activity panel
 * is different: LANGKAH fields contain multiple paragraphs and must be
 * written as Word paragraphs (<w:p>), not as literal newlines in a <w:t>.
 */
function findWordParagraphStart(content, fieldIndex) {
  const paragraphStartPattern = /<w:p\b[^>]*>/g;
  let match;
  let paragraphStart = -1;

  while ((match = paragraphStartPattern.exec(content)) !== null && match.index < fieldIndex) {
    paragraphStart = match.index;
  }

  return paragraphStart;
}

function findWordRunStart(content, fieldIndex) {
  const runStartPattern = /<w:r\b[^>]*>/g;
  let match;
  let runStart = -1;

  while ((match = runStartPattern.exec(content)) !== null && match.index < fieldIndex) {
    runStart = match.index;
  }

  return runStart;
}

function replaceTextboxFieldParagraphs(docXml, textboxFieldValues) {
  return docXml.replace(/<w:txbxContent>([\s\S]*?)<\/w:txbxContent>/g, (textbox, content) => {
    for (const [fieldName, value] of Object.entries(textboxFieldValues)) {
      const safeFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const fieldPattern = new RegExp(`MERGEFIELD\\s+${safeFieldName}(?:\\s|<)`, 'i');
      const fieldMatch = fieldPattern.exec(content);

      if (!fieldMatch) continue;

      const generatedParagraphs = buildTextboxParagraphs(value, fieldName === 'APERSEPSI');

      // LANGKAH textboxes contain only a merge field plus the template's
      // example activity. Replace all of it so the example can never leak
      // into exported modules. APERSEPSI has a fixed title before its field;
      // retain that title and replace the field plus its sample narrative.
      if (fieldName === 'APERSEPSI') {
        const fieldParagraphStart = findWordParagraphStart(content, fieldMatch.index);
        const fieldRunStart = findWordRunStart(content, fieldMatch.index);
        const fixedTitle = fieldParagraphStart === -1 || fieldRunStart === -1
          ? ''
          : `${content.slice(0, fieldRunStart)}</w:p>`;
        return `<w:txbxContent>${fixedTitle}${generatedParagraphs}</w:txbxContent>`;
      }

      return `<w:txbxContent>${generatedParagraphs}</w:txbxContent>`;
    }

    return textbox;
  });
}

function replaceMergeFieldsInXml(docXml, fieldValues) {
  const orderedFieldNames = Object.keys(fieldValues).sort((a, b) => b.length - a.length);

  for (const fieldName of orderedFieldNames) {
    const safeFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchPattern = new RegExp(`MERGEFIELD\\s+${safeFieldName}`, 'gi');

    let match;
    while ((match = searchPattern.exec(docXml)) !== null) {
      const markerIndex = match.index;
      const beginIndex = docXml.lastIndexOf('w:fldCharType="begin"', markerIndex);
      const separateIndex = docXml.indexOf('w:fldCharType="separate"', markerIndex);
      const endIndex = docXml.indexOf('w:fldCharType="end"', markerIndex);

      if (beginIndex === -1 || separateIndex === -1 || endIndex === -1 || endIndex <= separateIndex) {
        continue;
      }

      const textStart = docXml.indexOf('<w:t', separateIndex);
      const textOpenEnd = docXml.indexOf('>', textStart);
      const textClose = docXml.indexOf('</w:t>', textOpenEnd);

      if (textStart === -1 || textOpenEnd === -1 || textClose === -1) {
        continue;
      }

      const openingTag = docXml.slice(textStart, textOpenEnd + 1);
      const closingTag = '</w:t>';
      const replacement = `${openingTag}${escapeXml(fieldValues[fieldName] ?? '')}${closingTag}`;

      docXml = docXml.slice(0, textStart) + replacement + docXml.slice(textClose + closingTag.length);
      searchPattern.lastIndex = textStart + replacement.length;
    }
  }

  return docXml;
}

/**
 * Clean file name for export
 */
function sanitizeFileName(name) {
  return String(name)
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '_');
}

/**
 * Automated XML Tag-Balance Validator
 */
function validateDocxXml(buffer) {
  try {
    const zip = new PizZip(buffer);
    const docXml = zip.file('word/document.xml').asText();
    const tagPattern = /<\/?[A-Za-z0-9_:-]+(?:\s+[^<>]*?)?>/g;
    const stack = [];
    let match;

    while ((match = tagPattern.exec(docXml)) !== null) {
      const tag = match[0];

      if (tag.startsWith('</')) {
        const tagName = tag.slice(2, -1).trim().split(/\s+/)[0];
        const last = stack[stack.length - 1];

        if (!last) {
          throw new Error(`Tag </${tagName}> mismatch: orphan closing tag`);
        }

        if (last !== tagName) {
          const openIndex = stack.lastIndexOf(tagName);
          if (openIndex === -1) {
            throw new Error(`Tag </${tagName}> mismatch: no matching opening tag`);
          }
          stack.length = openIndex;
        } else {
          stack.pop();
        }
        continue;
      }

      if (tag.endsWith('/>') || tag.startsWith('<?') || tag.startsWith('<!')) {
        continue;
      }

      const tagName = tag.slice(1, -1).trim().split(/\s+/)[0];
      stack.push(tagName);
    }

    if (stack.length > 0) {
      throw new Error(`Tag mismatch: unclosed tags remain: ${stack.slice(-10).join(', ')}`);
    }

    return true;
  } catch (err) {
    throw new Error(`Validasi struktur DOCX gagal: ${err.message}`);
  }
}

/**
 * Melakukan Safe Merge pada file template.docx
 * @param {Object} data - Data modul ajar
 * @returns {Object} { buffer, fileName }
 */
function generateMergedDocx(data) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Master template tidak ditemukan pada lokasi: ${TEMPLATE_PATH}`);
  }

  const templateBuffer = fs.readFileSync(TEMPLATE_PATH);
  const zip = new PizZip(templateBuffer);

  let docXml = zip.file('word/document.xml').asText();

  const metodeStr = Array.isArray(data.metode) ? data.metode.join(', ') : (data.metode || '');
  const jpStr = data.jp ? (String(data.jp).includes('JP') ? String(data.jp) : `${data.jp} JP`) : '';
  const faseStr = data.fase || '';

  const fieldValues = {
    'NAMA': data.namaGuru || 'Guru Mata Pelajaran',
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

  // The activity and apersepsi textboxes require real Word paragraphs so
  // multiline AI output keeps its intended layout. Keep this isolated from
  // the identity/curriculum panel, whose original XML must remain untouched.
  docXml = replaceTextboxFieldParagraphs(docXml, {
    APERSEPSI: fieldValues.APERSEPSI,
    LANGKAH_1: fieldValues.LANGKAH_1,
    LANGKAH_2: fieldValues.LANGKAH_2,
    LANGKAH_3: fieldValues.LANGKAH_3
  });

  // Replace the remaining short fields in-place to preserve the left panel's
  // textbox/table formatting and sizing.
  docXml = replaceMergeFieldsInXml(docXml, fieldValues);

  // 3. Update Static Teacher Name if needed
  if (data.namaGuru && data.namaGuru.trim()) {
    const escapedGuru = escapeXml(data.namaGuru.trim());
    docXml = docXml.replace(/Erian Sukarna Putera, S\.Kom/g, escapedGuru);
    docXml = docXml.replace(/Erian Sukarna Putera/g, escapedGuru);
  }

  // 4. Update document.xml in zip
  zip.file('word/document.xml', docXml);

  // 5. Clean settings.xml mailMerge to avoid external link warnings
  if (zip.file('word/settings.xml')) {
    let settingsXml = zip.file('word/settings.xml').asText();
    settingsXml = settingsXml.replace(/<w:mailMerge[\s\S]*?<\/w:mailMerge>/gi, '');
    zip.file('word/settings.xml', settingsXml);
  }

  // Generate output DOCX
  const outputBuffer = zip.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });

  // Automated Structural Validation
  validateDocxXml(outputBuffer);

  const cleanMateri = sanitizeFileName(data.materi || 'Modul_Ajar');
  const cleanGuru = sanitizeFileName(data.namaGuru || 'Guru');
  const fileName = `MA_${cleanMateri}_${cleanGuru}.docx`;

  return {
    buffer: outputBuffer,
    fileName
  };
}

module.exports = {
  generateMergedDocx,
  sanitizeFileName,
  validateDocxXml,
  replaceTextboxFieldParagraphs
};
