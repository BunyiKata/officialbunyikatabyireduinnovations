const fs = require('fs');

// --- 1. UPDATE styles.css ---
let css = fs.readFileSync('public/styles.css', 'utf8');

const targetMediaCSS = `@media (max-width: 768px) {
    body:has(#view-ar-sukukata.active) #student-global-nav {
        display: none !important;
    }
    #view-ar-sukukata {
        padding: 0 !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        background: transparent !important;
        position: relative !important;
        overflow: hidden !important;
    }
    #view-ar-sukukata .map-top-bar {
        position: absolute !important;
        top: 14px !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 20 !important;
        padding: 0 16px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        background: transparent !important;
    }
    .ar-main-container {
        grid-template-columns: 1fr !important;
        height: 100dvh !important;
        gap: 0 !important;
        padding-bottom: 0 !important;
        position: relative !important;
    }
    .ar-camera-panel {
        position: fixed !important;
        inset: 0 !important;
        height: 100dvh !important;
        width: 100vw !important;
        border: none !important;
        border-radius: 0 !important;
        z-index: 0 !important;
    }
    .ar-camera-canvas {
        object-fit: cover !important;
        width: 100% !important;
        height: 100% !important;
    }
    .ar-content-panel {
        position: absolute !important;
        inset: 0 !important;
        z-index: 5 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 85px 16px 20px !important;
        height: 100dvh !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        box-sizing: border-box !important;
    }
    .ar-score-pill {
        display: none !important;
    }
    .ar-header-box {
        display: none !important;
    }
    .ar-word-card {
        padding: 18px 14px !important;
        margin-top: 15px !important;
        width: 90% !important;
        max-width: 320px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border: 4px solid var(--color-dark, #10182f) !important;
        border-radius: 20px !important;
        box-shadow: 0 6px 0 var(--color-dark, #10182f) !important;
    }
    .ar-word-text {
        font-size: clamp(3rem, 10vw, 4.5rem) !important;
        color: var(--color-dark, #10182f) !important;
    }
    .ar-speech-box {
        background: rgba(16, 24, 47, 0.92) !important;
        border: 3px solid #f472b6 !important;
        border-radius: 50px !important;
        padding: 12px 24px !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5) !important;
        margin-top: auto !important;
        margin-bottom: 20px !important;
        width: 88% !important;
        max-width: 330px !important;
        text-align: center !important;
        backdrop-filter: blur(4px) !important;
    }
    .ar-speech-text, #speech_status_ar_sukukata {
        color: #ffffff !important;
        font-weight: 800 !important;
        font-size: 1.25rem !important;
    }
    .ar-start-btn {
        margin-bottom: max(45px, 6.5vh) !important;
        padding: 16px 40px !important;
        font-size: 2.1rem !important;
        font-weight: 900 !important;
        min-height: 68px !important;
        width: 88% !important;
        max-width: 330px !important;
        border-radius: 50px !important;
        border: 4px solid var(--color-dark, #10182f) !important;
        box-shadow: 0 6px 0 var(--color-dark, #10182f) !important;
        letter-spacing: 1px !important;
    }
}`;

const mediaRegex = /@media\s*\(max-width:\s*768px\)\s*\{\s*body:has\(#view-ar-sukukata\.active\)[\s\S]*?\.ar-start-btn\s*\{[^}]*\}\s*\}/;

if (mediaRegex.test(css)) {
    css = css.replace(mediaRegex, targetMediaCSS);
} else {
    console.error("Could not find media query block in styles.css");
}

fs.writeFileSync('public/styles.css', css);

// --- 2. UPDATE app-logic.js ---
let js = fs.readFileSync('public/app-logic.js', 'utf8');

// Replace startBtn className in bukaARSukuKataKemahiran
js = js.replace(
    'startBtn.className = "neo-btn bg-pink text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";',
    'startBtn.className = "neo-btn bg-pink ar-start-btn";'
);

js = js.replace(
    `document.getElementById('speech_status_ar_sukukata').className = 'text-xl md:text-2xl font-semibold text-gray-600 text-center';`,
    `document.getElementById('speech_status_ar_sukukata').className = 'ar-speech-text';`
);

// Replace startBtn className in click listener
js = js.replace(
    'startBtn.className = "neo-btn bg-red text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";',
    'startBtn.className = "neo-btn bg-red ar-start-btn";'
);

js = js.replace(
    'startBtn.className = "neo-btn bg-pink text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";',
    'startBtn.className = "neo-btn bg-pink ar-start-btn";'
);

js = js.replace(
    'statusEl.className = "text-xl md:text-2xl font-semibold text-gray-500 text-center";',
    'statusEl.className = "ar-speech-text";'
);

js = js.replace(
    'statusEl.className = "text-xl md:text-2xl font-semibold text-slate-800 text-center";',
    'statusEl.className = "ar-speech-text";'
);

js = js.replace(
    'statusEl.className = "text-2xl md:text-3xl font-black text-emerald-800 text-center";',
    'statusEl.className = "ar-speech-text";'
);

fs.writeFileSync('public/app-logic.js', js);

console.log("Successfully applied all mobile AR layout fixes!");
