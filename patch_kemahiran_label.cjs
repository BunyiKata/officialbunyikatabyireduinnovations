const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldLine = `document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase();`;
const newLine = `document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase().replace(/_/g, ' + ');`;

if (code.includes(oldLine)) {
    code = code.replace(oldLine, newLine);
    fs.writeFileSync('public/app-logic.js', code);
    console.log("Patched kemahiran label formatting");
}
