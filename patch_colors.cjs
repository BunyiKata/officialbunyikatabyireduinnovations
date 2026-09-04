const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

css = css.replace(
    '    background: #10182f !important;\n    border: 4px solid #ffffff !important;',
    '    background: #ffffff !important;\n    border: 4px solid var(--color-dark, #10182f) !important;'
);

css = css.replace(
    '.ar-word-text {\n    font-size: clamp(4rem, 8vw, 6.5rem) !important;\n    font-weight: 900 !important;\n    color: #ffffff !important;',
    '.ar-word-text {\n    font-size: clamp(4rem, 8vw, 6.5rem) !important;\n    font-weight: 900 !important;\n    color: var(--color-dark, #10182f) !important;'
);

css = css.replace(
    '.ar-sparkle-tl {\n    position: absolute !important;\n    top: 14px !important;\n    left: 18px !important;\n    font-size: 1.8rem !important;\n    color: #ffe24a !important;\n}',
    '.ar-sparkle-tl {\n    position: absolute !important;\n    top: 14px !important;\n    left: 18px !important;\n    font-size: 1.8rem !important;\n    color: #f59e0b !important;\n}'
);

css = css.replace(
    '.ar-sparkle-br {\n    position: absolute !important;\n    bottom: 14px !important;\n    right: 18px !important;\n    font-size: 1.8rem !important;\n    color: #ffe24a !important;\n}',
    '.ar-sparkle-br {\n    position: absolute !important;\n    bottom: 14px !important;\n    right: 18px !important;\n    font-size: 1.8rem !important;\n    color: #f59e0b !important;\n}'
);

fs.writeFileSync('public/styles.css', css);
