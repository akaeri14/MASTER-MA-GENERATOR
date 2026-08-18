const fs = require('fs');
const PizZip = require('pizzip');

const templateBuf = fs.readFileSync('/Users/q/Documents/MA-GENERATOR/template.docx');
const zip = new PizZip(templateBuf);
const docXml = zip.file('word/document.xml').asText();

const regex = /MERGEFIELD\s+([^\s\\"]+)/g;
let match;
let count = 0;

while ((match = regex.exec(docXml)) !== null) {
  count++;
  const fieldName = match[1];
  const instrPos = match.index;

  const beginIndex = docXml.lastIndexOf('w:fldCharType="begin"', instrPos);
  const sepIndex = docXml.indexOf('w:fldCharType="separate"', instrPos);
  const endIndex = docXml.indexOf('w:fldCharType="end"', instrPos);

  const beginRunStart = docXml.lastIndexOf('<w:r', beginIndex);
  const endRunEnd = docXml.indexOf('</w:r>', endIndex) + 6;

  const fullBlock = docXml.substring(beginRunStart, endRunEnd);
  const pCount = (fullBlock.match(/<w:p(?:\s|>)/g) || []).length;
  const pCloseCount = (fullBlock.match(/<\/w:p>/g) || []).length;

  console.log(`[FIELD #${count}] ${fieldName} | Length: ${fullBlock.length} | <w:p>: ${pCount}, </w:p>: ${pCloseCount}`);
}
