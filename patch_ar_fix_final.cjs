const fs = require('fs');

// 1. Fix app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Fix bukaARSukuKataKemahiranSebenar mapping
const oldMapping = `    if (fcData && fcData.length > 0) {
        window.arSukuKataWords = fcData.map(item => ({ word: item.back.toLowerCase(), front: item.front }));
    } else {
        window.arSukuKataWords = [{word: "baju", front: "ba ju"}, {word: "buku", front: "bu ku"}, {word: "bola", front: "bo la"}];
    }`;

const newMapping = `    if (fcData && fcData.length > 0) {
        window.arSukuKataWords = fcData.map(item => {
            const rawFront = item.front || item.back || '';
            const rawBack = item.back || item.front || '';
            const wordStr = rawBack.toString().replace(/[\\s-]+/g, '').toLowerCase().trim();
            return {
                word: wordStr,
                front: rawFront
            };
        }).filter(item => item.word.length > 0);
    } else {
        window.arSukuKataWords = [
            {word: "baju", front: "ba - ju"},
            {word: "buku", front: "bu - ku"},
            {word: "bola", front: "bo - la"}
        ];
    }`;

if (logic.includes(oldMapping)) {
    logic = logic.replace(oldMapping, newMapping);
} else {
    // try replacing more flexibly
    logic = logic.replace(
        /if \(fcData && fcData\.length > 0\) \{[\s\S]*?\} else \{[\s\S]*?\}/,
        newMapping
    );
}

// Fix nextARWord implementation
const oldNextFunctionReg = /function nextARWord\(\)\s*\{[\s\S]*?\n\}/;

const newNextFunction = `function nextARWord() {
    if (!window.arSukuKataWordsRemaining || window.arSukuKataWordsRemaining.length === 0) {
        window.isARPlaying = false;
        const startBtn = document.getElementById('start_btn_ar_sukukata');
        if (startBtn) {
            startBtn.innerText = "MULA";
            startBtn.className = "neo-btn ar-start-btn";
        }
        window.currentARWord = "";
        triggerSuccessAnimation("Tahniah! Anda berjaya menyebut semua perkataan dengan tepat.", () => {
            if (window.showARSukuKataModal) {
                window.showARSukuKataModal();
            } else {
                const m = document.getElementById('modal-pilih-ar-sukukata');
                if (m) m.style.display = 'flex';
            }
        });
        return;
    }
    const randomIndex = Math.floor(Math.random() * window.arSukuKataWordsRemaining.length);
    const selected = window.arSukuKataWordsRemaining[randomIndex];
    window.currentARWord = typeof selected === 'object' ? selected.word : selected;
    window.currentARWordObj = selected;

    let syllables = [];
    const frontText = typeof selected === 'object' ? (selected.front || selected.word) : selected;
    if (frontText && typeof frontText === 'string') {
        syllables = frontText.split(/[\\s-|]+/).filter(s => s.trim() !== '');
    }
    if (syllables.length === 0) {
        syllables = [window.currentARWord];
    }

    let html = syllables.map((s, i) => \`<span style="color: \${i % 2 === 0 ? 'var(--color-dark, #10182f)' : '#dc2626'};">\${s.toLowerCase()}</span>\`).join('');

    const wordDisplay = document.getElementById('word_display_ar_sukukata');
    if (wordDisplay) {
        wordDisplay.style.opacity = '0';
        wordDisplay.style.transform = "scale(0.4)";
        wordDisplay.style.transition = "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        setTimeout(() => {
            wordDisplay.innerHTML = html;
            wordDisplay.style.opacity = '1';
            wordDisplay.style.transform = "scale(1)";
        }, 180);
    }
}`;

logic = logic.replace(oldNextFunctionReg, newNextFunction);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Patched app-logic.js successfully!");

// 2. Fix styles.css
let css = fs.readFileSync('public/styles.css', 'utf8');

// Replace .ar-word-card definition in main css
const mainCardOld = /\.ar-word-card\s*\{[^}]*\}/;
const mainCardNew = `.ar-word-card {
    width: 100% !important;
    max-width: 440px !important;
    height: 200px !important;
    min-height: 200px !important;
    max-height: 200px !important;
    background: #ffffff !important;
    border: 4px solid var(--color-dark, #10182f) !important;
    box-shadow: var(--shadow-hard, 4px 5px 0px 0px #10182f) !important;
    border-radius: 32px !important;
    padding: 16px 24px !important;
    text-align: center !important;
    margin-bottom: 24px !important;
    position: relative !important;
    transition: transform 0.2s, background-color 0.3s, border-color 0.3s !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}`;

css = css.replace(mainCardOld, mainCardNew);

// Replace .ar-word-text definition in main css
const mainTextOld = /\.ar-word-text\s*\{[^}]*\}/;
const mainTextNew = `.ar-word-text {
    font-size: clamp(3rem, 6vw, 4.8rem) !important;
    font-weight: 900 !important;
    color: var(--color-dark, #10182f) !important;
    letter-spacing: 2px !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    display: inline-block !important;
}`;

css = css.replace(mainTextOld, mainTextNew);

// Also append override at the end of styles.css to ensure media queries keep card size fixed
const cssOverride = `
/* Fixed Card Dimensions for AR Suku Kata */
.ar-word-card {
    height: 200px !important;
    min-height: 200px !important;
    max-height: 200px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}
.ar-word-text {
    font-size: clamp(2.8rem, 6vw, 4.5rem) !important;
    font-weight: 900 !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    display: inline-block !important;
}
@media (max-width: 1023px) {
    .ar-word-card {
        height: 140px !important;
        min-height: 140px !important;
        max-height: 140px !important;
        padding: 12px 14px !important;
        margin-top: 15px !important;
        margin-bottom: 15px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }
    .ar-word-text {
        font-size: clamp(2.2rem, 8vw, 3.5rem) !important;
    }
}
`;

css += cssOverride;
fs.writeFileSync('public/styles.css', css);
console.log("Patched styles.css successfully!");
