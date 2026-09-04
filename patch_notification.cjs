const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const targetWrong = `                const statusEl = document.getElementById('speech_status_ar_sukukata');
                statusEl.innerText = \`Awak sebut: "\${transcript}". Cuba lagi!\`;
                statusEl.className = "text-xl md:text-2xl font-semibold text-red-500 text-center";
                setTimeout(() => {`;

const replacementWrong = `                const statusEl = document.getElementById('speech_status_ar_sukukata');
                const speechBox = document.querySelector('.ar-speech-box');
                statusEl.innerText = \`Awak sebut: "\${transcript}". Cuba lagi!\`;
                statusEl.className = "text-xl md:text-2xl font-bold text-red-700 text-center";
                if(speechBox) {
                    speechBox.style.backgroundColor = "#fee2e2";
                    speechBox.style.borderColor = "#ef4444";
                }
                setTimeout(() => {
                    if(speechBox) {
                        speechBox.style.backgroundColor = "#ffffff";
                        speechBox.style.borderColor = "#10182f";
                    }
                `;

code = code.replace(targetWrong, replacementWrong);

const targetRight = `    const wordCard = document.getElementById('word_card_ar_sukukata');
    wordCard.style.borderColor = "#ffe24a";
    wordCard.style.backgroundColor = "#065f46";
    
    const statusEl = document.getElementById('speech_status_ar_sukukata');
    statusEl.innerText = "Betul! Hebatnya! 🎉";
    statusEl.className = "text-2xl md:text-3xl font-black text-emerald-700 text-center";
    
    setTimeout(() => {
        wordCard.style.borderColor = "#ffffff";
        wordCard.style.backgroundColor = "#10182f";
        if (window.isARPlaying) {
            nextARWord();
            statusEl.innerText = "Sila sebut perkataan...";
            statusEl.className = "text-xl md:text-2xl font-semibold text-slate-800 text-center";
        }
    }, 2000);`;

const replacementRight = `    const wordCard = document.getElementById('word_card_ar_sukukata');
    const speechBox = document.querySelector('.ar-speech-box');
    wordCard.style.borderColor = "#22c55e";
    wordCard.style.backgroundColor = "#dcfce7";
    
    const statusEl = document.getElementById('speech_status_ar_sukukata');
    statusEl.innerText = "Betul! Hebatnya! 🎉";
    statusEl.className = "text-2xl md:text-3xl font-black text-emerald-800 text-center";
    
    if(speechBox) {
        speechBox.style.backgroundColor = "#dcfce7";
        speechBox.style.borderColor = "#22c55e";
    }
    
    setTimeout(() => {
        wordCard.style.borderColor = "#10182f";
        wordCard.style.backgroundColor = "#ffffff";
        if(speechBox) {
            speechBox.style.backgroundColor = "#ffffff";
            speechBox.style.borderColor = "#10182f";
        }
        if (window.isARPlaying) {
            nextARWord();
            statusEl.innerText = "Sila sebut perkataan...";
            statusEl.className = "text-xl md:text-2xl font-semibold text-slate-800 text-center";
        }
    }, 2000);`;

code = code.replace(targetRight, replacementRight);
fs.writeFileSync('public/app-logic.js', code);
