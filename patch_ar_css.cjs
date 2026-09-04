const fs = require('fs');
let code = fs.readFileSync('public/styles.css', 'utf8');

// Update .ar-speech-box
code = code.replace(
    /(\.ar-speech-box\s*\{[^}]*?background:\s*)#[0-9a-fA-F]+(\s*!important;)/g,
    '$1#ffffff$2'
);
code = code.replace(
    /(\.ar-speech-box\s*\{[^}]*?background:\s*)rgba\([^)]+\)(\s*!important;)/g,
    '$1#ffffff$2'
);

code = code.replace(
    /(\.ar-speech-box\s*\{[^}]*?border:\s*3px solid\s*)#[0-9a-fA-F]+(\s*!important;)/g,
    '$1#10182f$2'
);

// Update .ar-speech-text
code = code.replace(
    /(\.ar-speech-text\s*\{[^}]*?color:\s*)#[0-9a-fA-F]+(\s*!important;)/g,
    '$1var(--color-dark, #10182f)$2'
);
code = code.replace(
    /(\.ar-speech-text,\s*#speech_status_ar_sukukata\s*\{[^}]*?color:\s*)#[0-9a-fA-F]+(\s*!important;)/g,
    '$1var(--color-dark, #10182f)$2'
);

// Add margin to .ar-start-btn
// The first one is for laptop, the second is inside media query.
const laptopStartBtn = `.ar-start-btn {
    padding: 18px 56px !important;
    font-size: 1.65rem !important;
    border-radius: 50px !important;
    border: 4px solid var(--color-dark) !important;
    box-shadow: var(--shadow-hard) !important;
    text-transform: uppercase !important;
    font-weight: 900 !important;
    min-height: 72px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;`;
    
const laptopStartBtnNew = `.ar-start-btn {
    margin-top: 30px !important;
    padding: 18px 56px !important;
    font-size: 1.65rem !important;
    border-radius: 50px !important;
    border: 4px solid var(--color-dark) !important;
    box-shadow: var(--shadow-hard) !important;
    text-transform: uppercase !important;
    font-weight: 900 !important;
    min-height: 72px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;`;

if (code.includes(laptopStartBtn)) {
    code = code.replace(laptopStartBtn, laptopStartBtnNew);
} else {
    // try a more generic replace if it doesn't match perfectly
    code = code.replace(
        /(\.ar-start-btn\s*\{\s*padding:)/,
        'margin-top: 30px !important;\n    $1'
    );
}

// Ensure speech recognition also sets correct colors
// In app-logic.js we have some inline styles! Let's check them.

fs.writeFileSync('public/styles.css', code);
console.log("Patched CSS in styles.css");
