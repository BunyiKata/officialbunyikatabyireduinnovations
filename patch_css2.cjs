const fs = require('fs');
let code = fs.readFileSync('public/styles.css', 'utf8');

const newCSS = `
/* AR Responsive Fixes */
@media (min-width: 1024px) {
    .ar-speech-box {
        margin-bottom: 24px !important;
    }
    .ar-start-btn {
        background-color: #facc15 !important; /* Yellow */
        color: var(--color-dark, #10182f) !important;
        font-size: 2.2rem !important;
        padding: 24px 60px !important;
    }
    .ar-start-btn.bg-red {
        background-color: #ef4444 !important; /* Red for Stop */
        color: white !important;
    }
}
@media (max-width: 1023px) {
    .ar-start-btn {
        background-color: #f97316 !important; /* Orange */
        color: white !important;
    }
    .ar-start-btn.bg-red {
        background-color: #ef4444 !important; /* Red for Stop */
        color: white !important;
    }
}
`;

fs.appendFileSync('public/styles.css', newCSS);
console.log("Appended responsive styles");
