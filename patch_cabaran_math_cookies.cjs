const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const regexTambah = /'([🍪]+) \+ ([🍪]+)'/g;
const regexTolak = /'([🍪]+) − ([🍪]+)'/g;

code = code.replace(regexTambah, "'$1&nbsp;&nbsp;&nbsp;$2'");
code = code.replace(regexTolak, "'$1&nbsp;&nbsp;&nbsp;$2'");

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('patched cabaran cookies');
