const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldGapRegex = /formatted = text\.split\(' \| '\)\.map\(formatWord\)\.join\('&nbsp;&nbsp;'\);/g;
code = code.replace(oldGapRegex, "formatted = text.split(' | ').map(formatWord).join('&nbsp;');");

// Make sure font size for long text is adjusted to fit without overflowing
const wordLogicRegex = /if \(textLen > 15\) \{[\s\S]*?else if/m;
const updatedLogic = `if (textLen > 15) { // e.g. sembilan puluh (14 chars + " | " or spaces)
                    wordEl.style.fontSize = 'clamp(1.8rem, 6vw, 3rem)';
                    wordEl.style.whiteSpace = 'normal'; // Allow wrapping normally
                    wordEl.style.wordBreak = 'keep-all';
                    wordEl.style.lineHeight = '1.2';
                } else if`;

if (code.match(wordLogicRegex)) {
    code = code.replace(wordLogicRegex, updatedLogic);
}

fs.writeFileSync('public/app-logic.js', code);
console.log('patched word update logic 4 (reduced gap, normal white-space)');
