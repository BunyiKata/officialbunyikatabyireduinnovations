const fs = require('fs');
const path = require('path');

const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
let appLogic = fs.readFileSync(appLogicPath, 'utf8');

const targetOld = `            } else {
                if (iconEl) { if (item.icon && item.icon.includes('<img')) { iconEl.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>'; } else { iconEl.innerHTML = '<div style="font-size:8rem;display:flex;align-items:center;justify-content:center;height:100%;">' + (item.icon || '\\u2753') + '</div>'; } } // Show word image
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) {
                    // Show emoji on the back
                    backContentEl.innerHTML = (item.icon && item.icon.includes('<img')) ? '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>' : '<div style="font-size: 8rem;">' + (item.icon || '❓') + '</div>';
                }
            }`;

const targetNew = `            } else {
                // Front of flashcard displays gambar-hadapan-flashcard.png
                if (iconEl) {
                    iconEl.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;"><img src="/images/sampingan/gambar-hadapan-flashcard.png" class="sukukata-flashcard-img" alt="Flashcard Depan" style="width:100%;height:100%;object-fit:contain;border-radius:12px;"/></div>';
                }
                // Back of flashcard (when flipped) displays the word syllable image
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) {
                    backContentEl.innerHTML = (item.icon && item.icon.includes('<img')) 
                        ? '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>' 
                        : '<div style="font-size: 8rem; display:flex; align-items:center; justify-content:center; height:100%;">' + (item.icon || '❓') + '</div>';
                }
            }`;

if (appLogic.includes(targetOld)) {
  appLogic = appLogic.replace(targetOld, targetNew);
  fs.writeFileSync(appLogicPath, appLogic, 'utf8');
  console.log('✅ app-logic.js updated for flashcard front image');
} else {
  console.log('⚠️ Could not match targetOld in app-logic.js');
}
