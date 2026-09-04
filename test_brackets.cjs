const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');
let depth = 0;
for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') depth--;
}
console.log("Brace depth:", depth);

depth = 0;
for (let i = 0; i < code.length; i++) {
    if (code[i] === '(') depth++;
    if (code[i] === ')') depth--;
}
console.log("Paren depth:", depth);

