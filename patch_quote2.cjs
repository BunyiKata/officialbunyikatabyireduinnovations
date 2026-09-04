const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(/\\'black\\'/g, "'black'");
code = code.replace(/\\'red\\'/g, "'red'");

fs.writeFileSync('public/app-logic.js', code);
console.log('patched quote');
