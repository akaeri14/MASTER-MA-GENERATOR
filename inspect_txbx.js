const fs = require('fs');
const PizZip = require('pizzip');

const templateBuf = fs.readFileSync('/Users/q/Documents/MA-GENERATOR/template.docx');
const zip = new PizZip(templateBuf);
const docXml = zip.file('word/document.xml').asText();

const txbxRegex = /<w:txbxContent>([\s\S]*?)<\/w:txbxContent>/g;
let match;
let txbxIndex = 0;

while ((match = txbxRegex.exec(docXml)) !== null) {
  txbxIndex++;
  const content = match[1];
  if (content.includes('MERGEFIELD')) {
    const fieldMatch = content.match(/MERGEFIELD\s+([^\s\\"]+)/);
    console.log(`\n================== [TXBX #${txbxIndex}] MERGEFIELD: ${fieldMatch ? fieldMatch[1] : 'unknown'} ==================`);
    console.log(content);
  }
}
