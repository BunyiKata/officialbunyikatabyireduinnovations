const fs = require('fs');

// 1. Patch src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const oldBadge = `<div className="ar-badge-bear">
              <span>✨</span>
              <span>Filter AR Beruang Aktif!</span>
            </div>`;

const newFilterBar = `<div className="ar-filter-selector flex items-center justify-center gap-1.5 bg-slate-900/85 backdrop-blur-md text-white rounded-full px-3 py-1.5 border-2 border-slate-700 shadow-xl z-30">
              <span className="text-xs text-yellow-300 font-bold hidden sm:inline mr-1">Filter:</span>
              <button
                type="button"
                id="btn_filter_bear"
                className="ar-filter-btn active neo-btn bg-yellow text-xs px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter('bear')}
              >
                <span>🐻</span>
                <span>Beruang</span>
              </button>
              <button
                type="button"
                id="btn_filter_cat"
                className="ar-filter-btn neo-btn bg-pink text-xs px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter('cat')}
              >
                <span>🐱</span>
                <span>Kucing</span>
              </button>
              <button
                type="button"
                id="btn_filter_dog"
                className="ar-filter-btn neo-btn bg-cyan text-xs px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter('dog')}
              >
                <span>🐶</span>
                <span>Anjing</span>
              </button>
            </div>`;

if (appTsx.includes(oldBadge)) {
    appTsx = appTsx.replace(oldBadge, newFilterBar);
    fs.writeFileSync('src/App.tsx', appTsx);
    console.log("Updated src/App.tsx with AR Filter selection bar!");
}

// 2. Patch public/styles.css
let css = fs.readFileSync('public/styles.css', 'utf8');

const oldCssBadge = /\.ar-badge-bear\s*\{[^}]*\}/;
const newCssBadge = `.ar-filter-selector {
    position: absolute !important;
    bottom: 12px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background-color: rgba(16, 24, 47, 0.9) !important;
    border: 3px solid #ffffff !important;
    padding: 5px 12px !important;
    border-radius: 50px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    box-shadow: 0 6px 16px rgba(0,0,0,0.5) !important;
    z-index: 30 !important;
    max-width: 95% !important;
    white-space: nowrap !important;
}
.ar-filter-btn {
    border: 2px solid #10182f !important;
    font-weight: 800 !important;
    transition: all 0.2s ease !important;
    cursor: pointer !important;
}`;

css = css.replace(oldCssBadge, newCssBadge);
fs.writeFileSync('public/styles.css', css);
console.log("Updated public/styles.css with ar-filter-selector rules!");

// 3. Patch public/app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Add global filter switcher and helper functions
const filterFunctions = `
window.currentARFilter = 'bear';
window.tukarARFilter = function(filterName) {
    window.currentARFilter = filterName || 'bear';
    const btnBear = document.getElementById('btn_filter_bear');
    const btnCat = document.getElementById('btn_filter_cat');
    const btnDog = document.getElementById('btn_filter_dog');
    
    [btnBear, btnCat, btnDog].forEach(btn => {
        if (btn) {
            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(0.95)';
            btn.classList.remove('ring-4', 'ring-yellow-300', 'shadow-md');
        }
    });

    const activeBtn = document.getElementById('btn_filter_' + filterName);
    if (activeBtn) {
        activeBtn.style.opacity = '1';
        activeBtn.style.transform = 'scale(1.05)';
        activeBtn.classList.add('ring-4', 'ring-yellow-300', 'shadow-md');
    }
};

window.checkMalayWordMatch = function(candidateTranscripts, target) {
    if (!target) return false;
    const targetStr = typeof target === 'object' ? (target.word || target.front || '') : target;
    const cleanTarget = targetStr.toString().toLowerCase().replace(/[\\s\\-_.,!?]+/g, '').trim();
    if (!cleanTarget) return false;

    const phoneticMap = {
        'du': ['du', 'do', 'dua', 'tu', 'dew', 'too', 'dok', 'dong', 'duk', 'dul'],
        'ba': ['ba', 'bar', 'ber', 'bah', 'bang'],
        'bu': ['bu', 'boo', 'boh', 'book', 'bus'],
        'bo': ['bo', 'bow', 'boh', 'bola', 'bon'],
        'bi': ['bi', 'bee', 'be', 'bila'],
        'ca': ['ca', 'cha', 'char', 'cap'],
        'ci': ['ci', 'chi'],
        'cu': ['cu', 'chu', 'coo'],
        'da': ['da', 'dar', 'dan'],
        'di': ['di', 'dee', 'day', 'dia'],
        'ga': ['ga', 'gar'],
        'gi': ['gi', 'gigi'],
        'gu': ['gu', 'goo'],
        'ja': ['ja', 'jah'],
        'ji': ['ji', 'gee'],
        'ju': ['ju', 'joo'],
        'ka': ['ka', 'kah', 'kat'],
        'ki': ['ki', 'key'],
        'ku': ['ku', 'koo'],
        'la': ['la', 'lah'],
        'li': ['li', 'lee'],
        'lu': ['lu', 'loo'],
        'ma': ['ma', 'mah'],
        'mi': ['mi', 'mee', 'mie'],
        'mu': ['mu', 'moo'],
        'na': ['na', 'nah'],
        'ni': ['ni', 'nee'],
        'nu': ['nu', 'noo'],
        'pa': ['pa', 'pah'],
        'pi': ['pi', 'pee'],
        'pu': ['pu', 'poo'],
        'ra': ['ra', 'rah'],
        'ri': ['ri', 'ree'],
        'ru': ['ru', 'roo'],
        'sa': ['sa', 'sah'],
        'si': ['si', 'see'],
        'su': ['su', 'soo'],
        'ta': ['ta', 'tah'],
        'ti': ['ti', 'tee', 'tea'],
        'tu': ['tu', 'too', 'two', 'to'],
        'ya': ['ya', 'yah'],
        'za': ['za']
    };

    const targetEquivalents = phoneticMap[cleanTarget] ? [cleanTarget, ...phoneticMap[cleanTarget]] : [cleanTarget];

    for (const rawCandidate of candidateTranscripts) {
        if (!rawCandidate) continue;
        const cleanCand = rawCandidate.toLowerCase().replace(/[\\s\\-_.,!?]+/g, '').trim();
        if (!cleanCand) continue;

        for (const eq of targetEquivalents) {
            if (cleanCand.includes(eq) || eq.includes(cleanCand)) {
                return true;
            }
        }

        const wordsInCand = rawCandidate.toLowerCase().replace(/[\\-_.,!?]+/g, ' ').split(/\\s+/).filter(w => w.length > 0);
        for (const w of wordsInCand) {
            const cleanW = w.replace(/[\\s\\-_.,!?]+/g, '');
            for (const eq of targetEquivalents) {
                if (cleanW === eq || cleanW.includes(eq) || eq.includes(cleanW)) {
                    return true;
                }
                if (cleanW.length >= 2 && eq.length >= 2) {
                    let diffCount = 0;
                    const maxLen = Math.max(cleanW.length, eq.length);
                    const minLen = Math.min(cleanW.length, eq.length);
                    if (Math.abs(cleanW.length - eq.length) <= 1) {
                        for (let k = 0; k < minLen; k++) {
                            if (cleanW[k] !== eq[k]) diffCount++;
                        }
                        diffCount += (maxLen - minLen);
                        if (diffCount <= 1) return true;
                    }
                }
            }
        }
    }
    return false;
};
`;

if (!logic.includes('window.tukarARFilter')) {
    logic += "\n" + filterFunctions + "\n";
}

// Replace faceMesh drawing block with support for bear, cat, dog filters
const oldFaceMeshDrawBlock = /if \(results\.multiFaceLandmarks && results\.multiFaceLandmarks\.length > 0\) \{[\s\S]*?canvasCtx\.restore\(\);/;

const newFaceMeshDrawBlock = `if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            for (const landmarks of results.multiFaceLandmarks) {
                const getPt = (idx) => ({
                    x: landmarks[idx].x * canvasElement.width,
                    y: landmarks[idx].y * canvasElement.height
                });

                const nose = getPt(1);
                const leftFH = getPt(54);
                const rightFH = getPt(284);
                const leftCheek = getPt(205);
                const rightCheek = getPt(425);

                const filterMode = window.currentARFilter || 'bear';

                if (filterMode === 'bear') {
                    // 🐻 BEAR FILTER
                    // Telinga Luar
                    canvasCtx.fillStyle = '#f472b6';
                    canvasCtx.beginPath();
                    canvasCtx.arc(leftFH.x - 10, leftFH.y - 30, 35, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    canvasCtx.beginPath();
                    canvasCtx.arc(rightFH.x + 10, rightFH.y - 30, 35, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    // Telinga Dalam
                    canvasCtx.fillStyle = '#fdf2f8';
                    canvasCtx.beginPath();
                    canvasCtx.arc(leftFH.x - 10, leftFH.y - 30, 18, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    canvasCtx.beginPath();
                    canvasCtx.arc(rightFH.x + 10, rightFH.y - 30, 18, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    // Hidung
                    canvasCtx.fillStyle = '#1f2937';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(nose.x, nose.y, 15, 10, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    
                    canvasCtx.fillStyle = '#ffffff';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(nose.x - 4, nose.y - 3, 4, 2, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    
                    // Blush Pipi
                    canvasCtx.fillStyle = 'rgba(251, 113, 133, 0.5)';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(leftCheek.x - 10, leftCheek.y, 25, 15, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(rightCheek.x + 10, rightCheek.y, 25, 15, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                } else if (filterMode === 'cat') {
                    // 🐱 CAT FILTER
                    // Left Ear
                    canvasCtx.fillStyle = '#fb923c';
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(leftFH.x - 35, leftFH.y);
                    canvasCtx.lineTo(leftFH.x - 20, leftFH.y - 75);
                    canvasCtx.lineTo(leftFH.x + 10, leftFH.y - 15);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Left Inner Ear
                    canvasCtx.fillStyle = '#fef08a';
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(leftFH.x - 27, leftFH.y - 5);
                    canvasCtx.lineTo(leftFH.x - 20, leftFH.y - 55);
                    canvasCtx.lineTo(leftFH.x + 2, leftFH.y - 15);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Right Ear
                    canvasCtx.fillStyle = '#fb923c';
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(rightFH.x - 10, rightFH.y - 15);
                    canvasCtx.lineTo(rightFH.x + 20, rightFH.y - 75);
                    canvasCtx.lineTo(rightFH.x + 35, rightFH.y);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Right Inner Ear
                    canvasCtx.fillStyle = '#fef08a';
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(rightFH.x - 2, rightFH.y - 15);
                    canvasCtx.lineTo(rightFH.x + 20, rightFH.y - 55);
                    canvasCtx.lineTo(rightFH.x + 27, rightFH.y - 5);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Cat Nose
                    canvasCtx.fillStyle = '#f43f5e';
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(nose.x - 12, nose.y - 6);
                    canvasCtx.lineTo(nose.x + 12, nose.y - 6);
                    canvasCtx.lineTo(nose.x, nose.y + 10);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Cat Whiskers
                    canvasCtx.strokeStyle = '#1e293b';
                    canvasCtx.lineWidth = 3;
                    canvasCtx.lineCap = 'round';

                    canvasCtx.beginPath();
                    canvasCtx.moveTo(leftCheek.x, leftCheek.y - 8);
                    canvasCtx.lineTo(leftCheek.x - 45, leftCheek.y - 18);
                    canvasCtx.moveTo(leftCheek.x, leftCheek.y);
                    canvasCtx.lineTo(leftCheek.x - 50, leftCheek.y);
                    canvasCtx.moveTo(leftCheek.x, leftCheek.y + 8);
                    canvasCtx.lineTo(leftCheek.x - 45, leftCheek.y + 18);
                    canvasCtx.stroke();

                    canvasCtx.beginPath();
                    canvasCtx.moveTo(rightCheek.x, rightCheek.y - 8);
                    canvasCtx.lineTo(rightCheek.x + 45, rightCheek.y - 18);
                    canvasCtx.moveTo(rightCheek.x, rightCheek.y);
                    canvasCtx.lineTo(rightCheek.x + 50, rightCheek.y);
                    canvasCtx.moveTo(rightCheek.x, rightCheek.y + 8);
                    canvasCtx.lineTo(rightCheek.x + 45, rightCheek.y + 18);
                    canvasCtx.stroke();

                    // Blush
                    canvasCtx.fillStyle = 'rgba(251, 113, 133, 0.4)';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(leftCheek.x, leftCheek.y, 20, 12, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(rightCheek.x, rightCheek.y, 20, 12, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                } else if (filterMode === 'dog') {
                    // 🐶 DOG FILTER
                    // Floppy Dog Ears
                    canvasCtx.fillStyle = '#b45309';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(leftFH.x - 30, leftFH.y + 20, 22, 50, -0.2, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.fillStyle = '#fde68a';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(leftFH.x - 30, leftFH.y + 20, 12, 35, -0.2, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.fillStyle = '#b45309';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(rightFH.x + 30, rightFH.y + 20, 22, 50, 0.2, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.fillStyle = '#fde68a';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(rightFH.x + 30, rightFH.y + 20, 12, 35, 0.2, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    // Dog Snout & Nose
                    canvasCtx.fillStyle = '#78350f';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(nose.x, nose.y + 2, 18, 14, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.fillStyle = '#1e293b';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(nose.x, nose.y - 2, 12, 9, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.fillStyle = '#ffffff';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(nose.x - 3, nose.y - 4, 3, 2, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    // Dog Tongue
                    const lipBottom = getPt(14);
                    canvasCtx.fillStyle = '#f43f5e';
                    canvasCtx.beginPath();
                    canvasCtx.ellipse(lipBottom.x, lipBottom.y + 12, 10, 16, 0, 0, 2 * Math.PI);
                    canvasCtx.fill();

                    canvasCtx.strokeStyle = '#be123c';
                    canvasCtx.lineWidth = 2;
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(lipBottom.x, lipBottom.y + 2);
                    canvasCtx.lineTo(lipBottom.x, lipBottom.y + 18);
                    canvasCtx.stroke();
                }
            }
        }
        canvasCtx.restore();`;

logic = logic.replace(oldFaceMeshDrawBlock, newFaceMeshDrawBlock);

// Replace speech recognition result handling
const oldOnResultReg = /recognition\.onresult\s*=\s*\(event\)\s*=>\s*\{[\s\S]*?\n\s*\};/;

const newOnResultBlock = `recognition.onresult = (event) => {
            if (!window.isARPlaying || !window.currentARWord || (typeof window.currentARWord === 'string' && window.currentARWord.trim() === '')) return;
            
            const candidates = [];
            if (event.results && event.results[0]) {
                for (let i = 0; i < event.results[0].length; i++) {
                    if (event.results[0][i] && event.results[0][i].transcript) {
                        candidates.push(event.results[0][i].transcript);
                    }
                }
            }

            if (candidates.length === 0) return;

            const isMatch = window.checkMalayWordMatch(candidates, window.currentARWord);
            if (isMatch) {
                arCorrectAnswer();
            } else {
                const primaryTranscript = candidates[0].trim();
                const statusEl = document.getElementById('speech_status_ar_sukukata');
                const speechBox = document.querySelector('.ar-speech-box');
                if (statusEl) {
                    statusEl.innerText = \`Awak sebut: "\${primaryTranscript}". Cuba lagi!\`;
                    statusEl.className = "ar-speech-text text-red-700";
                    statusEl.style.color = "#dc2626";
                }
                if(speechBox) {
                    speechBox.style.backgroundColor = "#fee2e2";
                    speechBox.style.borderColor = "#ef4444";
                }
                setTimeout(() => {
                    if(speechBox) {
                        speechBox.style.backgroundColor = "#ffffff";
                        speechBox.style.borderColor = "#10182f";
                    }
                
                    if (window.isARPlaying) {
                        if (statusEl) {
                            statusEl.innerText = "Sila sebut perkataan...";
                            statusEl.className = "ar-speech-text";
                            statusEl.style.color = "var(--color-dark, #10182f)";
                        }
                    }
                }, 2200);
            }
        };`;

logic = logic.replace(oldOnResultReg, newOnResultBlock);

// Also set recognition.maxAlternatives = 5
logic = logic.replace(
    'recognition.interimResults = false;',
    'recognition.interimResults = false;\n        recognition.maxAlternatives = 5;'
);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Patched public/app-logic.js with AR filters and enhanced Malay speech recognition!");
