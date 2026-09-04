const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will just parse lines and fix the HTML
const lines = code.split('\n');
// Let's find "MULA BERMAIN"
const mulaIndex = lines.findIndex(l => l.includes("MULA BERMAIN"));
// Before MULA BERMAIN, there is a button.
const btnIndex = mulaIndex - 1;
// Before the button, there should be closing tags.
// Let's print out lines around there
console.log(lines.slice(175, 195).join('\n'));
