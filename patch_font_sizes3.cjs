const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexIcon = /if \(isNumberModule\) \{\s*let fSize =.*?if \(backContentEl\) backContentEl\.innerHTML = `.*?`;/s;

const newIconLogic = `if (isNumberModule) {
                let fSize = 'clamp(4.5rem, 15vw, 6rem)'; // default for single numbers or short emojis
                if (item.icon && item.icon.length > 25) fSize = 'clamp(1.8rem, 5vw, 2.5rem)';
                else if (item.icon && item.icon.length > 15) fSize = 'clamp(2.5rem, 7vw, 3.2rem)';
                else if (item.icon && item.icon.length > 9) fSize = 'clamp(3rem, 8vw, 3.8rem)';
                else if (item.icon && item.icon.length > 5) fSize = 'clamp(4rem, 10vw, 5rem)'; // Covers emoji 10-90 (length ~6-7)
                
                if (iconEl) iconEl.innerHTML = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-word; padding: 5px; box-sizing: border-box; letter-spacing: 2px;">\${item.icon || '❓'}</div>\`;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-word; padding: 5px; box-sizing: border-box; letter-spacing: 2px;">\${item.icon || '❓'}</div>\`;`;

if (code.match(regexIcon)) {
    code = code.replace(regexIcon, newIconLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched icon fonts 3');
} else {
    console.log('could not find icon logic to patch 3');
}
