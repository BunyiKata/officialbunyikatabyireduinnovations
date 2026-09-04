const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexIcon = /if \(isNumberModule\) \{\s*if \(iconEl\) iconEl\.innerHTML = `.*?`;\s*const backContentEl = document\.getElementById\('sukukata-card-back-content'\);\s*if \(backContentEl\) backContentEl\.innerHTML = `.*?`;/s;

const newIconLogic = `if (isNumberModule) {
                let fSize = 'clamp(3rem, 10vw, 4rem)';
                if (item.icon && item.icon.length > 18) fSize = 'clamp(1.2rem, 4vw, 1.5rem)';
                else if (item.icon && item.icon.length > 12) fSize = 'clamp(1.5rem, 5vw, 1.8rem)';
                else if (item.icon && item.icon.length > 8) fSize = 'clamp(1.8rem, 6vw, 2.2rem)';
                else if (item.icon && item.icon.length > 4) fSize = 'clamp(2rem, 7vw, 2.5rem)';
                else if (item.icon && item.icon.length > 2) fSize = 'clamp(2.5rem, 8vw, 3rem)';
                
                if (iconEl) iconEl.innerHTML = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-all; overflow-wrap: anywhere; padding: 10px; box-sizing: border-box; letter-spacing: 2px;">\${item.icon || '❓'}</div>\`;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = \`<div style="font-size: \${fSize}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-all; overflow-wrap: anywhere; padding: 10px; box-sizing: border-box; letter-spacing: 2px;">\${item.icon || '❓'}</div>\`;`;

code = code.replace(regexIcon, newIconLogic);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched icon fonts');
