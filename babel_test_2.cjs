const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

// I will parse up to line 257
const partial = code.split('\n').slice(0, 256).join('\n');
let depth = 0;
for (let i = 0; i < partial.length; i++) {
    if (partial[i] === '{') depth++;
    if (partial[i] === '}') depth--;
}
console.log("Brace depth before line 257:", depth);
