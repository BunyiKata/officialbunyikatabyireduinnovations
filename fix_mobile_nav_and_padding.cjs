const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const fixes = `
@media (max-width: 720px) {
    body:not(.teacher-mode) .teacher-sticky-nav {
        display: none !important;
    }
    
    .murid-side-panel {
        padding-bottom: 95px !important;
    }
    
    body:has(.modal-overlay[style*="display: flex"]) #student-global-nav {
        display: none !important;
    }
}
`;

css += fixes;
fs.writeFileSync('src/index.css', css);
console.log('Fixed mobile nav logic and side panel padding');
