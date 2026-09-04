const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexIcon = /if \(isNumberModule\) \{\s*let fSize =.*?if \(backContentEl\) backContentEl\.innerHTML = containerHtml;/s;

const newIconLogic = `if (isNumberModule) {
                let fSize = 'clamp(5.5rem, 18vw, 7.5rem)'; // default for single numbers or short emojis
                let customStyle = "";
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                
                if (isSiriNombor) {
                    fSize = 'clamp(5rem, 16vw, 7.5rem)'; // Make symbols bigger
                } else if (item.icon) {
                    let len = item.icon.length;
                    if (len > 25) {
                        fSize = 'clamp(1.8rem, 5vw, 2.8rem)';
                    } else if (len >= 20) { // 10 cookies
                        fSize = 'clamp(2.8rem, 7vw, 4rem)';
                        customStyle = "max-width: 6em; margin: 0 auto; line-height: 1.1;"; // force wrap 5x2
                    } else if (len >= 18) { // 9 cookies
                        fSize = 'clamp(3rem, 8vw, 4.2rem)';
                        customStyle = "max-width: 3.8em; margin: 0 auto; line-height: 1.1;"; // force 3x3 wrap
                    } else if (len >= 16) { // 8 cookies
                        fSize = 'clamp(3.2rem, 8vw, 4.5rem)';
                        customStyle = "max-width: 5em; margin: 0 auto; line-height: 1.1;"; // 4x2
                    } else if (len >= 14) { // 7 cookies
                        fSize = 'clamp(3.2rem, 8vw, 4.5rem)';
                        customStyle = "max-width: 5em; margin: 0 auto; line-height: 1.1;"; // 4 + 3
                    } else if (len > 9) { // 5, 6 cookies
                        fSize = 'clamp(3.8rem, 10vw, 5rem)';
                        customStyle = "max-width: 3.8em; margin: 0 auto; line-height: 1.1;"; // 3x2
                    } else if (len > 5) { // 3, 4 cookies
                        fSize = 'clamp(4.2rem, 12vw, 6rem)'; 
                        customStyle = "max-width: 2.6em; margin: 0 auto; line-height: 1.1;"; // 2x2
                    }
                }
                
                let containerHtml = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; word-break: break-all; overflow-wrap: anywhere; padding: 5px; box-sizing: border-box; letter-spacing: 2px; \${customStyle}">\${item.icon || '❓'}</div>\`;
                
                if (iconEl) iconEl.innerHTML = containerHtml;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = containerHtml;`;

if (code.match(regexIcon)) {
    code = code.replace(regexIcon, newIconLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched icon fonts 7 (adjusted max-widths, letter-spacing 2px, bigger size)');
} else {
    console.log('could not find icon logic to patch 7');
}
