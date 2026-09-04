const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const additionalCss = `

@media (max-width: 720px) {
    /* Hide the old bottom teacher nav completely */
    .teacher-sticky-nav {
        display: none !important;
    }
    
    /* Show floating menu button in teacher mode */
    body.teacher-mode:not(:has(#login-screen.active)):not(:has(.modal-overlay[style*="display: flex"])) #guru-mobile-menu-btn {
        display: flex !important;
    }
}
`;

css += additionalCss;
fs.writeFileSync('src/index.css', css);
console.log('Fixed guru nav CSS');
