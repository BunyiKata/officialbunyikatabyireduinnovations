const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(
    'window.arSukuKataWords = fcData.map(item => item.back.toLowerCase()); // Use lowercase for speech rec',
    'window.arSukuKataWords = fcData.map(item => ({ word: item.back.toLowerCase(), front: item.front }));'
);
code = code.replace(
    'window.arSukuKataWords = ["baju", "buku", "bola"]; // Fallback',
    'window.arSukuKataWords = [{word: "baju", front: "ba ju"}, {word: "buku", front: "bu ku"}, {word: "bola", front: "bo la"}];'
);

const oldNext = `    const randomIndex = Math.floor(Math.random() * window.arSukuKataWordsRemaining.length);
    window.currentARWord = window.arSukuKataWordsRemaining[randomIndex];
    
    const wordDisplay = document.getElementById('word_display_ar_sukukata');
    wordDisplay.style.opacity = 0;
    wordDisplay.style.transform = "scale(0.5)";
        
    setTimeout(() => {
        wordDisplay.innerText = window.currentARWord;
        wordDisplay.style.opacity = 1;
        wordDisplay.style.transform = "scale(1)";
    }, 200);`;
    
const newNext = `    const randomIndex = Math.floor(Math.random() * window.arSukuKataWordsRemaining.length);
    const selected = window.arSukuKataWordsRemaining[randomIndex];
    window.currentARWord = selected.word;
    window.currentARWordObj = selected;
    
    let syllables = selected.front.split(/[\\s-|]+/).filter(s => s.trim() !== '');
    let html = syllables.map((s, i) => \`<span style="color: \${i % 2 === 0 ? 'var(--color-dark, #10182f)' : '#dc2626'};">\${s.toLowerCase()}</span>\`).join('');

    const wordDisplay = document.getElementById('word_display_ar_sukukata');
    wordDisplay.style.opacity = 0;
    wordDisplay.style.transform = "scale(0.3)";
    wordDisplay.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
    setTimeout(() => {
        wordDisplay.innerHTML = html;
        wordDisplay.style.opacity = 1;
        wordDisplay.style.transform = "scale(1)";
    }, 200);`;

code = code.replace(oldNext, newNext);

const oldRemove = `            const index = window.arSukuKataWordsRemaining.indexOf(window.currentARWord);`;
const newRemove = `            const index = window.arSukuKataWordsRemaining.findIndex(item => item.word === window.currentARWord);`;
code = code.replace(oldRemove, newRemove);

const oldOnResult = `        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();`;
const newOnResult = `        recognition.onresult = (event) => {
            if (!window.isARPlaying) return;
            const transcript = event.results[0][0].transcript.toLowerCase();`;
code = code.replace(oldOnResult, newOnResult);

fs.writeFileSync('public/app-logic.js', code);
console.log("Patched AR features");
