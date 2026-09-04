const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

content = content.replace(/let scale = Math\.min\(cWidth \* 0\.7, cHeight \* 0\.75\) \/ 100;/g, 'let scale = Math.min(cWidth * 0.8, cHeight * 0.8) / 100;');
content = content.replace(/let offsetY = cHeight \* 0\.15;/g, 'let offsetY = cHeight * 0.10;');

fs.writeFileSync('public/surih-nombor-logic.js', content);
