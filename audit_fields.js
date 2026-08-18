const fs = require('fs');
const PizZip = require('pizzip');

const templateBuf = fs.readFileSync('/Users/q/Documents/MA-GENERATOR/template.docx');
const zip = new PizZip(templateBuf);
const docXml = zip.file('word/document.xml').asText();

// Let's find all occurrences of MERGEFIELD and inspect the enclosing paragraph and its siblings
const regex = /MERGEFIELD\s+([^\s\\"]+)/g;
let match;
let count = 0;

while ((match = regex.exec(docXml)) !== null) {
  count++;
  const fieldName = match[1];
  const instrPos = match.index;

  // find surrounding paragraph
  const pStart = docXml.lastIndexOf('<w:p', instrPos);
  const pEnd = docXml.indexOf('</w:p>', instrPos) + 6;
  const pXml = docXml.substring(pStart, pEnd);

  // find begin, separate, end
  const beginIndex = docXml.lastIndexOf('w:fldCharType="begin"', instrPos);
  const sepIndex = docXml.indexOf('w:fldCharType="separate"', instrPos);
  const endIndex = docXml.indexOf('w:fldCharType="end"', instrPos);

  console.log(`\n================== [FIELD #${count}] ${fieldName} ==================`);
  console.log(`instrPos: ${instrPos}, pStart: ${pStart}, pEnd: ${pEnd}`);
  console.log(`beginIndex: ${beginIndex}, sepIndex: ${sepIndex}, endIndex: ${endIndex}`);
  console.log(`Is begin inside current paragraph? ${beginIndex >= pStart && beginIndex <= pEnd}`);
  console.log(`Is separate inside current paragraph? ${sepIndex >= pStart && sepIndex <= pEnd}`);
  console.log(`Is end inside current paragraph? ${endIndex >= pStart && endIndex <= pEnd}`);
  console.log(`Enclosing Paragraph XML snippet:\n${pXml.substring(0, 300)}...`);
}
