const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

const compStart = code.indexOf('export const TandukKataGame');
console.log("Component starts at:", compStart);

let depth = 0;
for (let i = compStart; i < code.length; i++) {
    if (code[i] === '{') {
        depth++;
    }
    if (code[i] === '}') {
        depth--;
        if (depth === 0) {
            console.log("Component closed at index", i, code.substring(i-50, i+100));
            break;
        }
    }
}
