const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

const targetMobile = `@media (max-width: 768px) {
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

const replacementMobile = `@media (max-width: 768px) {
    body:has(#view-ar-sukukata.active) #student-global-nav {
        display: none !important;
    }
    #view-ar-sukukata {
        padding: 0 !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        background: transparent !important;
    }
    .ar-top-nav {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 10 !important;
        padding: 16px !important;
    }
    .ar-main-container {
        grid-template-columns: 1fr !important;
        height: 100% !important;
        gap: 0 !important;
        padding-bottom: 0 !important;
        position: static !important;
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
    }
    .ar-content-panel {
        position: absolute !important;
        inset: 0 !important;
        z-index: 2 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 80px 20px 40px !important;
        height: 100dvh !important;
        justify-content: flex-start !important;
    }
    .ar-score-pill {
        position: absolute !important;
        top: 80px !important;
        right: 20px !important;
    }
    .ar-header-box {
        display: none !important;
    }
    .ar-word-card {
        padding: 20px 10px !important;
        margin-top: 70px !important;
        margin-bottom: auto !important;
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
        margin-bottom: 20px !important;
    }
    .ar-start-btn {
        margin-bottom: 30px !important;
        padding: 18px 48px !important;
        font-size: 1.8rem !important;
        width: 80% !important;
        max-width: 300px !important;
    }
}`;

css = css.replace(targetMobile, replacementMobile);

fs.writeFileSync('public/styles.css', css);
