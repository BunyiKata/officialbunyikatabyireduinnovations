const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// 1. Direct bukaARSukuKataKemahiran without sensor permission modal
logic = logic.replace(
    /window\.bukaARSukuKataKemahiran\s*=\s*function\s*\(kemahiran\)\s*\{[\s\S]*?\};/,
    `window.bukaARSukuKataKemahiran = function(kemahiran) {
    window.bukaARSukuKataKemahiranSebenar(kemahiran);
};`
);

// 2. Hide star popup and camera overlay reset in bukaARSukuKataKemahiranSebenar
const resetCode = `    const starPopup = document.getElementById('ar_star_popup');
    if (starPopup) {
        starPopup.classList.remove('animate-star');
        starPopup.style.opacity = '0';
    }
    const cameraOverlay = document.getElementById('camera_status_ar_sukukata');
    if (cameraOverlay) {
        cameraOverlay.style.display = 'none';
        cameraOverlay.classList.add('hidden');
    }`;

if (!logic.includes("starPopup.style.opacity = '0'")) {
    logic = logic.replace(
        "document.getElementById('speech_status_ar_sukukata').className = 'ar-speech-text';",
        "document.getElementById('speech_status_ar_sukukata').className = 'ar-speech-text';\n" + resetCode
    );
}

// 3. Fix hideARCameraOverlay
logic = logic.replace(
    /function hideARCameraOverlay\(\)\s*\{[\s\S]*?\}/,
    `function hideARCameraOverlay() {
    const overlay = document.getElementById('camera_status_ar_sukukata');
    if (overlay) {
        overlay.classList.add('opacity-0');
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
    }
}`
);

// 4. Add guards to arCorrectAnswer
logic = logic.replace(
    /function arCorrectAnswer\(\)\s*\{/,
    `function arCorrectAnswer() {
    if (!window.isARPlaying || !window.currentARWord || (typeof window.currentARWord === 'string' && window.currentARWord.trim() === '')) return;`
);

// 5. Add guards to recognition.onresult
logic = logic.replace(
    /recognition\.onresult\s*=\s*\(event\)\s*=>\s*\{[\s\S]*?if\s*\(!window\.isARPlaying\)\s*return;/,
    `recognition.onresult = (event) => {
            if (!window.isARPlaying || !window.currentARWord || (typeof window.currentARWord === 'string' && window.currentARWord.trim() === '')) return;`
);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Successfully applied AR permission & star popup fixes to app-logic.js!");
