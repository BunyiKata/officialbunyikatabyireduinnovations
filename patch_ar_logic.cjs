const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// Add arSukuKataWordsRemaining to global
code = code.replace(
    'window.arSukuKataWords = [];',
    'window.arSukuKataWords = [];\nwindow.arSukuKataWordsRemaining = [];'
);

// Populate arSukuKataWordsRemaining
code = code.replace(
    'window.arSukuKataScore = 0;\n    window.isARPlaying = false;',
    'window.arSukuKataWordsRemaining = [...window.arSukuKataWords];\n    window.currentARWord = "";\n    window.arSukuKataScore = 0;\n    window.isARPlaying = false;'
);

// Fix speech recognition matching
const oldMatch = 'if (transcript.includes(window.currentARWord)) {';
const newMatch = 'if (window.currentARWord && transcript.includes(window.currentARWord)) {';
code = code.replace(oldMatch, newMatch);

// Fix nextARWord to pick from remaining
const oldNext = `function nextARWord() {
    const randomIndex = Math.floor(Math.random() * window.arSukuKataWords.length);
    window.currentARWord = window.arSukuKataWords[randomIndex];`;
const newNext = `function nextARWord() {
    if (window.arSukuKataWordsRemaining.length === 0) {
        window.isARPlaying = false;
        document.getElementById('start_btn_ar_sukukata').innerText = "MULA";
        document.getElementById('start_btn_ar_sukukata').className = "neo-btn bg-pink ar-start-btn";
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
    window.currentARWord = window.arSukuKataWordsRemaining[randomIndex];`;
code = code.replace(oldNext, newNext);

// Remove correctly answered word
const oldCorrectEnd = `        if (window.isARPlaying) {
            nextARWord();
            statusEl.innerText = "Sila sebut perkataan...";
            statusEl.className = "ar-speech-text";
        }
    }, 2000);
}`;
const newCorrectEnd = `        if (window.isARPlaying) {
            // Remove the correctly answered word
            const index = window.arSukuKataWordsRemaining.indexOf(window.currentARWord);
            if (index > -1) {
                window.arSukuKataWordsRemaining.splice(index, 1);
            }
            nextARWord();
            if (window.isARPlaying) {
                statusEl.innerText = "Sila sebut perkataan...";
                statusEl.className = "ar-speech-text";
                statusEl.style.color = "var(--color-dark)";
            }
        }
    }, 2000);
}`;
code = code.replace(oldCorrectEnd, newCorrectEnd);

fs.writeFileSync('public/app-logic.js', code);
console.log("Patched AR Suku Kata logic");
