const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// The new CSS block to replace all instances of teacher nav mobile media query
const finalNavCss = `
/* Mod Guru Mobile Nav Bar */
@media (max-width: 720px) {
    .teacher-sticky-nav {
        top: auto !important;
        bottom: 0px !important;
        left: 0 !important;
        transform: none !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 8px 12px 24px 12px !important;
        background: #ffffff !important;
        border: none !important;
        border-top: 3px solid var(--color-dark) !important;
        border-radius: 24px 24px 0 0 !important;
        box-shadow: 0 -4px 10px rgba(0,0,0,0.1) !important;
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 6px !important;
        z-index: 2000 !important;
        box-sizing: border-box !important;
    }
    .teacher-sticky-nav .neo-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        min-height: 52px !important;
        padding: 6px 4px !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        border-radius: 12px !important;
        border: 2px solid var(--color-dark) !important;
        background: #ffffff !important;
        color: var(--color-dark) !important;
        box-shadow: none !important;
    }
    .teacher-sticky-nav .neo-btn i {
        font-size: 1.1rem !important;
        margin: 0 !important;
    }
    body.teacher-mode .screen.active {
        padding-top: 20px !important;
        padding-bottom: 110px !important;
    }
}
body:has(#login-screen.active) .teacher-sticky-nav {
    display: none !important;
}
`;

// Try to clean up previous injections
// First we locate the section starting at /* --- MOBILE NAV & GAME NAV FIXES --- */
const parts = css.split('/* --- MOBILE NAV & GAME NAV FIXES --- */');
if (parts.length > 1) {
    let before = parts[0];
    let fixesSection = '/* --- MOBILE NAV & GAME NAV FIXES --- */\n' +
        '#student-global-nav {\n    display: none !important;\n}\n' +
        'body:not(.teacher-mode):has(#main-menu-screen.active) #student-global-nav,\n' +
        'body:not(.teacher-mode):has(#profile-screen.active) #student-global-nav,\n' +
        'body:not(.teacher-mode):has(#leaderboard-screen.active) #student-global-nav,\n' +
        'body:not(.teacher-mode):has(#lencana-screen.active) #student-global-nav {\n    display: flex !important;\n}\n' +
        'body.teacher-mode #student-global-nav,\n' +
        'body:has(#view-cabaran-suku-kata.active) #student-global-nav,\n' +
        'body:has(#view-tanduk-kata.active) #student-global-nav,\n' +
        'body:has(#view-perpustakaan.active) #student-global-nav,\n' +
        'body:has(#map-screen.active) #student-global-nav,\n' +
        'body:has(.screen[id^="view-latihan-"].active) #student-global-nav,\n' +
        'body:has(.screen[id^="view-learn-"].active) #student-global-nav,\n' +
        'body:has(#view-belajar-huruf.active) #student-global-nav,\n' +
        'body:has(#view-belajar-sukukata.active) #student-global-nav,\n' +
        'body:has(.modal-overlay[style*="display: flex"]) #student-global-nav {\n    display: none !important;\n}\n';
    
    fixesSection += '\n' + finalNavCss;
    css = before + fixesSection;
}

fs.writeFileSync('src/index.css', css);
console.log('Cleaned CSS');
