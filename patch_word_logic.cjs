const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldGapRegex = /formatted = text\.split\(' \| '\)\.map\(formatWord\)\.join\('&nbsp;&nbsp;'\);/g;
code = code.replace(oldGapRegex, "formatted = text.split(' | ').map(formatWord).join('&nbsp;');");

const oldWordUpdate = /const wordEl = document\.getElementById\('sukukata-word'\);\s*if \(wordEl\) wordEl\.innerHTML = formatSukuKata\(item\.front\);/g;

const newWordUpdate = `const wordEl = document.getElementById('sukukata-word');
            if (wordEl) {
                wordEl.innerHTML = formatSukuKata(item.front);
                let textLen = item.front.length;
                if (textLen > 15) {
                    wordEl.style.fontSize = 'clamp(1.5rem, 5vw, 2.8rem)';
                    wordEl.style.whiteSpace = 'pre-wrap';
                    wordEl.style.wordBreak = 'break-word';
                    wordEl.style.lineHeight = '1.2';
                } else if (textLen > 8) {
                    wordEl.style.fontSize = 'clamp(2.5rem, 7vw, 4rem)';
                    wordEl.style.whiteSpace = 'pre-wrap';
                    wordEl.style.wordBreak = 'break-word';
                    wordEl.style.lineHeight = '1.2';
                } else {
                    wordEl.style.fontSize = 'clamp(4rem, 12vw, 6rem)';
                    wordEl.style.whiteSpace = 'nowrap';
                    wordEl.style.wordBreak = 'normal';
                    wordEl.style.lineHeight = '1';
                }
            }`;

code = code.replace(oldWordUpdate, newWordUpdate);

fs.writeFileSync('public/app-logic.js', code);
console.log('patched word update logic');
