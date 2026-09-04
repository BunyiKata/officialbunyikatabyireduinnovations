const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

const target = `@media (max-width: 640px) {
    #view-ar-sukukata {
        overflow-y: auto !important;
        height: auto !important;
        max-height: none !important;
    }
    .ar-main-container {
        grid-template-columns: 1fr !important;
        height: auto !important;
    }
    .ar-camera-panel {
        height: 320px !important;
    }
    .ar-content-panel {
        padding: 40px 20px 28px !important;
        height: auto !important;
    }
}`;

const replacement = `@media (max-width: 640px) {
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

css = css.replace(target, replacement);

fs.writeFileSync('public/styles.css', css);
