const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const additionalCss = `

/* OVERRIDE STUDENT GLOBAL NAV FOR MOBILE (LIKE TEACHER NAV) */
@media (max-width: 720px) {
    #student-global-nav {
        position: fixed !important;
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
        margin: 0 !important;
        justify-content: unset !important;
    }
    
    #student-global-nav .nav-item {
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
        flex: unset !important;
        text-align: center !important;
        width: auto !important;
    }
    
    #student-global-nav .nav-item.desktop-nav-only {
        display: none !important;
    }

    body:not(.teacher-mode) .screen.active {
        padding-bottom: 110px !important;
    }
}
`;

css += additionalCss;
fs.writeFileSync('src/index.css', css);
console.log('Patched student nav CSS');
