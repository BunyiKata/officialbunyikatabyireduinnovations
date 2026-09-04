const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');
const floorRegex = /\{\/\* Floor \*\/\}([\s\S]*?)\{\/\* Hint Arrow at Start \*\/\}/;
const match = code.match(floorRegex);
if (match) {
    console.log("Matched!");
} else {
    console.log("Not matched!");
}
