const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

css = css.replace('background-color: rgba(255, 248, 236, 0.95) !important;', 'background: transparent !important;');
css = css.replace('background-image: radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 248, 236, 0.88), rgba(255, 248, 236, 0.88)) !important;', '');
css = css.replace('background-size: 18px 18px, auto !important;', '');

fs.writeFileSync('public/styles.css', css);
