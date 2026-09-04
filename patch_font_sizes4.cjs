const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexIcon = /if \(isNumberModule\) \{\s*let fSize =.*?if \(backContentEl\) backContentEl\.innerHTML = `.*?`;/s;

const newIconLogic = `if (isNumberModule) {
                let fSize = 'clamp(5.5rem, 18vw, 7rem)'; // default for single numbers or short emojis
                let customStyle = "";
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                
                if (isSiriNombor) {
                    fSize = 'clamp(4rem, 15vw, 6.5rem)';
                } else if (item.icon) {
                    let len = item.icon.length;
                    if (len > 25) {
                        fSize = 'clamp(1.8rem, 5vw, 2.8rem)';
                    } else if (len > 18) { // 10 cookies
                        fSize = 'clamp(2.3rem, 6vw, 3rem)';
                        customStyle = "max-width: 80%; margin: 0 auto;"; // force wrap
                    } else if (len > 15) { // 8, 9 cookies
                        fSize = 'clamp(2.5rem, 7vw, 3.3rem)';
                        if (len === 18) { // 9 cookies
                            customStyle = "max-width: 70%; margin: 0 auto;"; // force 3x3 wrap
                        }
                    } else if (len > 13) { // 7 cookies
                        fSize = 'clamp(2.8rem, 8vw, 3.6rem)';
                    } else if (len > 9) { // 5, 6 cookies
                        fSize = 'clamp(3rem, 9vw, 4rem)';
                    } else if (len > 5) {
                        fSize = 'clamp(3.5rem, 10vw, 4.5rem)'; 
                    }
                }
                
                let containerHtml = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; line-height: 1.15; word-break: break-word; padding: 5px; box-sizing: border-box; letter-spacing: 2px; \${customStyle}">\${item.icon || '❓'}</div>\`;
                
                if (iconEl) iconEl.innerHTML = containerHtml;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = containerHtml;`;

if (code.match(regexIcon)) {
    code = code.replace(regexIcon, newIconLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched icon fonts 4');
} else {
    console.log('could not find icon logic to patch 4');
}
