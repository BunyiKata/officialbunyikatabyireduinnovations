const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldRender = `            const iconEl = document.getElementById('sukukata-card-front-content');
            if (iconEl) iconEl.innerHTML = '<img referrerpolicy="no-referrer" src="https://i.postimg.cc/TPbGvTHW/Copy-of-BUNYI-KATA-APPS.png" class="sukukata-flashcard-img" alt="Flashcard"/>'; // Show provided image
            
            const backContentEl = document.getElementById('sukukata-card-back-content');
            if (backContentEl) {
                // Show emoji on the back
                backContentEl.innerHTML = \`<div style="font-size: 8rem;">\${item.icon || '❓'}</div>\`;
            }`;

const newRender = `            const iconEl = document.getElementById('sukukata-card-front-content');
            const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
            
            if (isNumberModule) {
                if (iconEl) iconEl.innerHTML = \`<div style="font-size: \${item.icon && item.icon.length > 5 ? '4rem' : '8rem'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%;">\${item.icon || '❓'}</div>\`;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = \`<div style="font-size: \${item.icon && item.icon.length > 5 ? '4rem' : '8rem'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%;">\${item.icon || '❓'}</div>\`;
            } else {
                if (iconEl) iconEl.innerHTML = '<img referrerpolicy="no-referrer" src="https://i.postimg.cc/TPbGvTHW/Copy-of-BUNYI-KATA-APPS.png" class="sukukata-flashcard-img" alt="Flashcard"/>'; // Show provided image
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) {
                    // Show emoji on the back
                    backContentEl.innerHTML = \`<div style="font-size: 8rem;">\${item.icon || '❓'}</div>\`;
                }
            }`;

code = code.replace(oldRender, newRender);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched');
