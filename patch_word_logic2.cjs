const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldWordUpdate = /const wordEl = document\.getElementById\('sukukata-word'\);\s*if \(wordEl\) \{[\s\S]*?\}\s*\}/g;

const newWordUpdate = `const wordEl = document.getElementById('sukukata-word');
            if (wordEl) {
                wordEl.innerHTML = formatSukuKata(item.front);
                let textLen = item.front.length;
                if (textLen > 15) { // e.g. sembilan puluh (14 chars + " | " or spaces)
                    wordEl.style.fontSize = 'clamp(1.8rem, 6vw, 3rem)';
                    wordEl.style.whiteSpace = 'normal'; // Allow wrapping normally
                    wordEl.style.wordBreak = 'keep-all';
                    wordEl.style.lineHeight = '1.2';
                } else if (textLen > 8) { // e.g. sepuluh
                    wordEl.style.fontSize = 'clamp(2.8rem, 8vw, 4.5rem)';
                    wordEl.style.whiteSpace = 'nowrap';
                    wordEl.style.wordBreak = 'normal';
                    wordEl.style.lineHeight = '1.2';
                } else {
                    wordEl.style.fontSize = 'clamp(4rem, 12vw, 6rem)';
                    wordEl.style.whiteSpace = 'nowrap';
                    wordEl.style.wordBreak = 'normal';
                    wordEl.style.lineHeight = '1';
                }
            }`;

if (code.match(oldWordUpdate)) {
    code = code.replace(oldWordUpdate, newWordUpdate);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched word logic 2');
} else {
    console.log('not found word logic');
}
