const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldTimer = `        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen) {
                    const sceneEl = activeScreen.querySelector('.scene');
                    if (sceneEl) {
                        sceneEl.classList.add('attention-pulse-glow');
                        setTimeout(() => sceneEl.classList.remove('attention-pulse-glow'), 1000);
                    }
                }
            }, 5000);
        }`;

const newTimer = `        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen) {
                    // Move attention pulse to word wrapper if it exists (for suku kata/numbers), else scene
                    const wordWrapper = activeScreen.querySelector('.bs-word-container');
                    const sceneEl = activeScreen.querySelector('.scene');
                    const targetEl = wordWrapper || sceneEl;
                    if (targetEl) {
                        targetEl.classList.add('attention-pulse-glow');
                        setTimeout(() => targetEl.classList.remove('attention-pulse-glow'), 1000);
                    }
                }
            }, 5000);
        }`;

if (code.includes(oldTimer)) {
    code = code.replace(oldTimer, newTimer);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched attention timer');
} else {
    console.log('could not find attention timer');
}
