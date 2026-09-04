const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

let braces = [];
for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') braces.push(i);
    if (code[i] === '}') {
        if (braces.length === 0) {
            console.log("Extra closing brace at index", i, code.substring(Math.max(0, i-50), i+50));
            break;
        }
        braces.pop();
    }
}
