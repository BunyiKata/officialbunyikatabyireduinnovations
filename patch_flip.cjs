const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldFlip = `        function flipFlashcard(sceneEl) {
            const card = sceneEl.querySelector('.card');
            if(card) {
                card.classList.toggle('is-flipped');
                resetFlashcardAttentionTimer();
                if (window.mainAudioSukuKataSemasa) {
                    window.mainAudioSukuKataSemasa();
                }
            }
        }`;

const newFlip = `        function flipFlashcard(sceneEl) {
            const card = sceneEl.querySelector('.card');
            if(card) {
                const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
                if (!isNumberModule) {
                    card.classList.toggle('is-flipped');
                }
                resetFlashcardAttentionTimer();
                if (window.mainAudioSukuKataSemasa) {
                    window.mainAudioSukuKataSemasa();
                }
            }
        }`;

code = code.replace(oldFlip, newFlip);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched');
