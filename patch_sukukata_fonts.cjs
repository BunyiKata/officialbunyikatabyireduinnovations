const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// Fix concepts spaces
code = code.replace(/🍪&nbsp;&nbsp;&nbsp;🍪/g, '🍪🍪');
code = code.replace(/🍪🍪&nbsp;&nbsp;&nbsp;🍪/g, '🍪🍪🍪');
code = code.replace(/🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪/g, '🍪🍪🍪🍪🍪');
code = code.replace(/🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪/g, '🍪🍪🍪🍪🍪🍪');
code = code.replace(/🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪/g, '🍪🍪🍪🍪🍪🍪🍪🍪');
code = code.replace(/🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪🍪🍪/g, '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪');
code = code.replace(/🍪🍪🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪/g, '🍪🍪🍪🍪🍪🍪🍪🍪🍪');
code = code.replace(/🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪🍪🍪/g, '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪');


// Fix font sizes for number module (lines ~3611-3613)
const oldHtml1 = "iconEl.innerHTML = `<div style=\"font-size: ${item.icon && item.icon.length > 25 ? 'clamp(1.2rem, 4vw, 2rem)' : item.icon && item.icon.length > 14 ? 'clamp(1.5rem, 5vw, 2.5rem)' : item.icon && item.icon.length > 6 ? 'clamp(2.5rem, 8vw, 3.5rem)' : 'clamp(3rem, 12vw, 6rem)'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%; line-height: 1.3; word-break: break-word; padding: 10px; box-sizing: border-box;\">${item.icon || '❓'}</div>`;";
const newHtml1 = "iconEl.innerHTML = `<div style=\"font-size: ${item.icon && item.icon.length > 20 ? 'clamp(1rem, 4vw, 1.8rem)' : item.icon && item.icon.length > 10 ? 'clamp(1.5rem, 6vw, 2.2rem)' : item.icon && item.icon.length > 5 ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.5rem, 10vw, 3.5rem)'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-word; padding: 10px; box-sizing: border-box; letter-spacing: 2px;\">${item.icon || '❓'}</div>`;";

const oldHtml2 = "backContentEl.innerHTML = `<div style=\"font-size: ${item.icon && item.icon.length > 25 ? 'clamp(1.2rem, 4vw, 2rem)' : item.icon && item.icon.length > 14 ? 'clamp(1.5rem, 5vw, 2.5rem)' : item.icon && item.icon.length > 6 ? 'clamp(2.5rem, 8vw, 3.5rem)' : 'clamp(3rem, 12vw, 6rem)'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%; line-height: 1.3; word-break: break-word; padding: 10px; box-sizing: border-box;\">${item.icon || '❓'}</div>`;";
const newHtml2 = "backContentEl.innerHTML = `<div style=\"font-size: ${item.icon && item.icon.length > 20 ? 'clamp(1rem, 4vw, 1.8rem)' : item.icon && item.icon.length > 10 ? 'clamp(1.5rem, 6vw, 2.2rem)' : item.icon && item.icon.length > 5 ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.5rem, 10vw, 3.5rem)'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%; line-height: 1.1; word-break: break-word; padding: 10px; box-sizing: border-box; letter-spacing: 2px;\">${item.icon || '❓'}</div>`;";

code = code.replace(oldHtml1, newHtml1);
code = code.replace(oldHtml2, newHtml2);

// Fix title logic (lines ~3506-3520)
// typeText = "NOMBOR" => for tambah/penolakan
// leftTitleEl.innerText = "HASIL TAMBAH"

const titleLogicRegex = /const isNumberModule = \['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'\].includes\(currentModuleId\);\s+if \(isNumberModule\) \{\s+typeText = "NOMBOR";\s+\}\s+typeEl\.innerText = typeText;\s+\}\s+const leftTitleEl = document\.getElementById\('sukukata-left-title'\);\s+if \(leftTitleEl\) \{\s+const isNumberModule = \['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'\].includes\(currentModuleId\);\s+leftTitleEl\.innerText = isNumberModule \? "BILANGAN" : "Suku Kata";\s+\}/g;

const newTitleLogic = `const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
                if (isNumberModule) {
                    typeText = "NOMBOR";
                }
                if (currentModuleId === 'konsep_tambah') {
                    typeText = "PENAMBAHAN";
                } else if (currentModuleId === 'konsep_penolakan') {
                    typeText = "PENOLAKAN";
                }
                typeEl.innerText = typeText;
            }
            
            const leftTitleEl = document.getElementById('sukukata-left-title');
            if (leftTitleEl) {
                const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
                leftTitleEl.innerText = isNumberModule ? "BILANGAN" : "Suku Kata";
                if (currentModuleId === 'konsep_tambah') {
                    leftTitleEl.innerText = "HASIL TAMBAH";
                } else if (currentModuleId === 'konsep_penolakan') {
                    leftTitleEl.innerText = "HASIL TOLAK";
                }
            }`;

code = code.replace(titleLogicRegex, newTitleLogic);

fs.writeFileSync('public/app-logic.js', code);
console.log('patched fonts and logic');
