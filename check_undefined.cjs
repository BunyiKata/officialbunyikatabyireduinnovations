const fs = require('fs');
const content = fs.readFileSync('public/app-logic.js', 'utf8');

const regex = /window\.([a-zA-Z0-9_]+) = ([a-zA-Z0-9_]+);/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const name = match[2];
    if (name === 'function' || name === 'window' || name === 'document') continue;
    if (!content.includes(`function ${name}`) && !content.includes(`var ${name}`) && !content.includes(`const ${name}`) && !content.includes(`let ${name}`)) {
        console.log(`Undefined: ${name}`);
    }
}
