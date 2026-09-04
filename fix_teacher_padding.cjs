const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/body\.teacher-mode \.screen\.active \{\s*padding-top: 20px !important;\s*padding-bottom: 110px !important;\s*\}/, '');

fs.writeFileSync('src/index.css', css);
console.log('Removed old teacher padding');
