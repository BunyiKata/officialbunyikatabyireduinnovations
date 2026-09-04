const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

code = code.replace(/&nbsp;&nbsp;&nbsp;/g, '   ');

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('patched cabaran cookies space');
