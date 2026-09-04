const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace('.murid-side-panel {', '.murid-side-panel { box-sizing: border-box !important; ');

fs.writeFileSync('src/index.css', css);
console.log('Fixed side panel box sizing');
