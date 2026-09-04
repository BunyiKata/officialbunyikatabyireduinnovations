const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexIcon = /if \(isNumberModule\) \{\s*let fSize =.*?if \(backContentEl\) backContentEl\.innerHTML = containerHtml;/s;

const newIconLogic = `if (isNumberModule) {
                let fSize = 'clamp(5.5rem, 18vw, 7rem)'; // default for single numbers or short emojis
                let customStyle = "";
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                
                if (isSiriNombor) {
                    fSize = 'clamp(4.5rem, 15vw, 7rem)';
                } else if (item.icon) {
                    let len = item.icon.length;
                    if (len > 25) {
                        fSize = 'clamp(1.8rem, 5vw, 2.8rem)';
                    } else if (len >= 20) { // 10 cookies
                        fSize = 'clamp(2.5rem, 6vw, 3.5rem)';
                        customStyle = "max-width: 6.2em; margin: 0 auto; line-height: 1.2;"; // force wrap 5x2
                    } else if (len >= 18) { // 9 cookies
                        fSize = 'clamp(2.8rem, 7vw, 3.8rem)';
                        customStyle = "max-width: 3.8em; margin: 0 auto; line-height: 1.2;"; // force 3x3 wrap
                    } else if (len >= 16) { // 8 cookies
                        fSize = 'clamp(3rem, 7vw, 4rem)';
                        customStyle = "max-width: 5em; margin: 0 auto; line-height: 1.2;"; // 4x2
                    } else if (len >= 14) { // 7 cookies
                        fSize = 'clamp(3rem, 7vw, 4rem)';
                        customStyle = "max-width: 5em; margin: 0 auto; line-height: 1.2;"; // 4 + 3
                    } else if (len > 9) { // 5, 6 cookies
                        fSize = 'clamp(3.5rem, 9vw, 4.5rem)';
                        customStyle = "max-width: 3.8em; margin: 0 auto; line-height: 1.2;"; // 3x2
                    } else if (len > 5) { // 3, 4 cookies
                        fSize = 'clamp(4rem, 10vw, 5.5rem)'; 
                        customStyle = "max-width: 2.6em; margin: 0 auto; line-height: 1.2;"; // 2x2
                    }
                }
                
                let containerHtml = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; word-break: break-all; overflow-wrap: anywhere; padding: 5px; box-sizing: border-box; letter-spacing: 5px; \${customStyle}">\${item.icon || '❓'}</div>\`;
                
                if (iconEl) iconEl.innerHTML = containerHtml;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = containerHtml;`;

if (code.match(regexIcon)) {
    code = code.replace(regexIcon, newIconLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched icon fonts 6 (adjusted max-widths)');
} else {
    console.log('could not find icon logic to patch 6');
}
