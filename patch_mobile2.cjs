const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

const target = `@media (max-width: 640px) {
    body:has(#view-ar-sukukata.active) #student-global-nav {
        display: none !important;
    }
    #view-ar-sukukata {
        overflow-y: auto !important;
        height: 100vh !important;
        max-height: 100vh !important;
        padding: 10px !important;
    }
    .ar-main-container {
        grid-template-columns: 1fr !important;
        height: auto !important;
        gap: 10px !important;
    }
    .ar-camera-panel {
        height: 50vh !important;
    }
    .ar-content-panel {
        padding: 10px 0 !important;
        height: auto !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
    .ar-score-pill {
        position: relative !important;
        top: 0 !important;
        right: 0 !important;
        margin-bottom: 10px !important;
    }
    .ar-header-box {
        display: none !important;
    }
    .ar-word-card {
        padding: 20px 10px !important;
    }
    .ar-word-text {
        font-size: clamp(3rem, 10vw, 4rem) !important;
    }
}`;

const replacement = `@media (max-width: 768px) {
    body:has(#view-ar-sukukata.active) #student-global-nav {
        display: none !important;
    }
    #view-ar-sukukata {
        padding: 0 !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        background: #10182f !important;
    }
    .ar-main-container {
        grid-template-columns: 1fr !important;
        height: 100% !important;
        gap: 0 !important;
        padding-bottom: 0 !important;
    }
    .ar-camera-panel {
        position: absolute !important;
        inset: 0 !important;
        height: 100% !important;
        width: 100% !important;
        border: none !important;
        border-radius: 0 !important;
        z-index: 1 !important;
    }
    .ar-camera-canvas {
        object-fit: cover !important;
    }
    .ar-content-panel {
        position: absolute !important;
        inset: 0 !important;
        z-index: 2 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 20px !important;
        height: 100% !important;
        justify-content: space-between !important;
    }
    .ar-score-pill {
        position: relative !important;
        top: 0 !important;
        right: 0 !important;
        align-self: flex-end !important;
    }
    .ar-header-box {
        display: none !important;
    }
    .ar-word-card {
        padding: 20px 10px !important;
        margin-top: 10px !important;
        max-width: 90% !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: var(--color-dark, #10182f) !important;
    }
    .ar-word-text {
        font-size: clamp(3.5rem, 12vw, 5rem) !important;
        color: var(--color-dark, #10182f) !important;
    }
    .ar-speech-box {
        background: rgba(255, 255, 255, 0.9) !important;
    }
    .ar-start-btn {
        margin-bottom: 20px !important;
    }
}`;

css = css.replace(target, replacement);

fs.writeFileSync('public/styles.css', css);
