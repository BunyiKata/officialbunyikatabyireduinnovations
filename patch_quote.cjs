const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(/<span style="color: \$\{i % 2 === 0 \? 'black' : 'red'\};'>/g, '<span style="color: ${i % 2 === 0 ? \\\'black\\\' : \\\'red\\\'};">');

fs.writeFileSync('public/app-logic.js', code);
console.log('patched quote');
