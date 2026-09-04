const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

const partial = code.split('\n').slice(0, 256).join('\n');
let depth = 0;
for (let i = 0; i < partial.length; i++) {
    if (partial[i] === '{') depth++;
    if (partial[i] === '}') {
        depth--;
        if (depth === 0) {
            console.log("Reached depth 0 at index", i, partial.substring(i-100, i+20));
        }
    }
}
