const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace('.screen[id^="view-latihan-"] .map-top-bar .back-icon-btn { background-color: var(--color-purple) !important; }', 
  '.screen[id^="view-latihan-"] .map-top-bar .back-icon-btn, #view-cabaran-suku-kata .map-top-bar .back-icon-btn { background-color: var(--color-purple) !important; }'
);

const cabaranCss = `
#view-cabaran-suku-kata .map-top-bar {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    margin-bottom: 10px !important;
    min-height: auto !important;
}
`;
css += cabaranCss;
fs.writeFileSync('src/index.css', css);
console.log('Fixed Cabaran padding and back button color');
