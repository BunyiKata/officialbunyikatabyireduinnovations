const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');
const i = 25713;
console.log(code.substring(Math.max(0, i-500), i+500));
