const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(/word-break: break-word/g, 'word-break: break-all; overflow-wrap: anywhere; line-break: anywhere;');

fs.writeFileSync('public/app-logic.js', code);
console.log('patched word-break');
