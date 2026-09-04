const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldGapRegex = /formatted = text\.split\(' \| '\)\.map\(formatWord\)\.join\('&nbsp;'\);/g;
code = code.replace(oldGapRegex, "formatted = text.split(' | ').map(formatWord).join('&nbsp;&nbsp;');");

fs.writeFileSync('public/app-logic.js', code);
console.log('patched word update logic 3');
