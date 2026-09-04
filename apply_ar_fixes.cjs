const fs = require('fs');

// --- 1. UPDATE styles.css ---
let css = fs.readFileSync('public/styles.css', 'utf8');

// Add ar-star-popup styles if not present
if (!css.includes('.ar-star-popup')) {
    css += `
/* AR STAR POPUP ANIMATION */
.ar-star-popup {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 100;
    font-size: clamp(2.2rem, 9vw, 3.8rem);
    font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
    font-weight: 900;
    color: #fbbf24;
    text-shadow: 0 4px 12px rgba(0,0,0,0.95), 0 0 16px rgba(251,191,36,0.8);
    pointer-events: none;
    opacity: 0;
    white-space: nowrap;
}
.ar-star-popup.animate-star {
    animation: popStarAR 1.8s ease-out forwards;
}
@keyframes popStarAR {
    0% { transform: translate(-50%, -20%) scale(0.5); opacity: 0; }
    20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    70% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -90%) scale(0.8); opacity: 0; }
}
`;
}

// Replace ar-speech-box default rules
css = css.replace(
    /\.ar-speech-box\s*\{[^}]*\}/g,
    `.ar-speech-box {
    background: #10182f !important;
    border: 3px solid #f472b6 !important;
    border-radius: 50px !important;
    padding: 12px 28px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
}`
);

css = css.replace(
    /\.ar-speech-text\s*\{[^}]*\}/g,
    `.ar-speech-text {
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    margin: 0 !important;
    text-align: center !important;
}`
);

// Replace mobile view query for view-ar-sukukata
const oldMediaRegex = /@media\s*\(max-width:\s*768px\)\s*\{\s*body:has\(#view-ar-sukukata\.active\)[\s\S]*?\}\s*\}\s*\}/;

const newMediaCSS = `@media (max-width: 768px) {
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
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 20 !important;
        padding: 10px 10px !important;
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
        padding: 70px 16px 20px !important;
        height: 100dvh !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: space-between !important;
        box-sizing: border-box !important;
    }
    .ar-score-pill {
        display: none !important;
    }
    .ar-header-box {
        display: none !important;
    }
    .ar-word-card {
        padding: 16px 12px !important;
        margin-top: 10px !important;
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
        background: #10182f !important;
        border: 3px solid #f472b6 !important;
        border-radius: 50px !important;
        padding: 10px 24px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        margin-bottom: 10px !important;
        width: 85% !important;
        max-width: 320px !important;
        text-align: center !important;
    }
    .ar-speech-text, #speech_status_ar_sukukata {
        color: #ffffff !important;
        font-weight: 800 !important;
        font-size: 1.2rem !important;
    }
    .ar-start-btn {
        margin-bottom: max(35px, 6vh) !important;
        padding: 18px 56px !important;
        font-size: 2.1rem !important;
        min-height: 64px !important;
        width: 85% !important;
        max-width: 320px !important;
        box-shadow: 0 6px 0 var(--color-dark, #10182f) !important;
    }
}`;

if (oldMediaRegex.test(css)) {
    css = css.replace(oldMediaRegex, newMediaCSS);
} else {
    // replace previous block if matched differently
    const altRegex = /@media\s*\(max-width:\s*768px\)\s*\{\s*body:has\(#view-ar-sukukata\.active\)[\s\S]*?\.ar-start-btn\s*\{[^}]*\}\s*\}/;
    if (altRegex.test(css)) {
        css = css.replace(altRegex, newMediaCSS);
    }
}

fs.writeFileSync('public/styles.css', css);

// --- 2. UPDATE app-logic.js ---
let js = fs.readFileSync('public/app-logic.js', 'utf8');

// Add showStarPopupAR helper if missing
if (!js.includes('function showStarPopupAR')) {
    js += `
window.showStarPopupAR = function() {
    let popup = document.getElementById('ar_star_popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'ar_star_popup';
        popup.className = 'ar-star-popup';
        const view = document.getElementById('view-ar-sukukata');
        if (view) view.appendChild(popup);
    }
    popup.innerHTML = '+1 Bintang! 🌟';
    popup.classList.remove('animate-star');
    void popup.offsetWidth;
    popup.classList.add('animate-star');
};
`;
}

// Call showStarPopupAR in arCorrectAnswer
js = js.replace(
    'window.arSukuKataScore += 1;',
    'window.arSukuKataScore += 1;\n    if (window.showStarPopupAR) window.showStarPopupAR();'
);

// Fix camera overlay hide on stream ready & speech text color styling
js = js.replace(
    `const videoStream = new MediaStream(stream.getVideoTracks());
    videoElement.srcObject = videoStream;
    videoElement.play();`,
    `const videoStream = new MediaStream(stream.getVideoTracks());
    videoElement.srcObject = videoStream;
    videoElement.play().then(() => hideARCameraOverlay()).catch(() => hideARCameraOverlay());
    hideARCameraOverlay();`
);

// Ensure speech status colors are clear white/bright
js = js.replace(
    'statusEl.className = "text-xl md:text-2xl font-semibold text-gray-600 text-center";',
    'statusEl.className = "text-xl md:text-2xl font-semibold text-white text-center"; statusEl.style.color = "#ffffff";'
);
js = js.replace(
    'statusEl.className = "text-xl md:text-2xl font-semibold text-blue-600 text-center";',
    'statusEl.className = "text-xl md:text-2xl font-semibold text-sky-300 text-center"; statusEl.style.color = "#7dd3fc";'
);

fs.writeFileSync('public/app-logic.js', js);

console.log("Applied AR fixes successfully!");
