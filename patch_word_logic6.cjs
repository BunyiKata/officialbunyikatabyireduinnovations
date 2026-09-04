const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const wordUpdateRegex = /const wordEl = document\.getElementById\('sukukata-word'\);\s*if \(wordEl\) \{[\s\S]*?\}\s*\}/g;

const newWordUpdate = `const wordEl = document.getElementById('sukukata-word');
            if (wordEl) {
                wordEl.innerHTML = formatSukuKata(item.front);
                let cleanLen = item.front.replace(/[-| ]/g, '').length;
                if (cleanLen > 10) { // e.g. sembilan puluh
                    wordEl.style.fontSize = 'clamp(2.8rem, 8vw, 4rem)';
                    wordEl.style.whiteSpace = 'normal'; // Allow wrapping normally
                    wordEl.style.wordBreak = 'keep-all';
                    wordEl.style.lineHeight = '1.2';
                } else if (cleanLen > 7) { // e.g. lapan puluh, dua puluh
                    wordEl.style.fontSize = 'clamp(3.5rem, 10vw, 5rem)';
                    wordEl.style.whiteSpace = 'normal';
                    wordEl.style.wordBreak = 'keep-all';
                    wordEl.style.lineHeight = '1.2';
                } else { // short words (sepuluh, tujuh, tiga, satu)
                    wordEl.style.fontSize = 'clamp(4.5rem, 12vw, 6.5rem)';
                    wordEl.style.whiteSpace = 'nowrap';
                    wordEl.style.wordBreak = 'normal';
                    wordEl.style.lineHeight = '1';
                }
            }`;

if (code.match(wordUpdateRegex)) {
    code = code.replace(wordUpdateRegex, newWordUpdate);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched word update logic 6 (cleanLen)');
} else {
    console.log('could not find word update regex');
}
