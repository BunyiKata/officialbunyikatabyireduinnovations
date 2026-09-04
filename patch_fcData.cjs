const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldCheck = `const fcData = window.flashcardData && window.flashcardData[fcKey] ? window.flashcardData[fcKey].flashcards : [];`;
const newCheck = `const fcData = window.moduleContentData && window.moduleContentData[fcKey] ? window.moduleContentData[fcKey].flashcards : [];`;

if (code.includes(oldCheck)) {
    code = code.replace(oldCheck, newCheck);
    fs.writeFileSync('public/app-logic.js', code);
    console.log("Patched fcData in public/app-logic.js");
} else {
    console.log("Could not find oldCheck");
}
