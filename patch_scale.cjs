const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// Replace offset and scale for numbers to make them bigger and centered
content = content.replace(/let offsetBesarX = cWidth \* 0\.25;/, 'let offsetBesarX = cWidth * 0.25;'); // We will calculate dynamically
content = content.replace(/let scale = Math\.min\(cWidth \* 0\.4, cHeight \* 0\.7\) \/ 100;/, 'let scale = Math.min(cWidth * 0.55, cHeight * 0.75) / 100;');
content = content.replace(/let offsetBesarX = cWidth \* 0\.25;/, 'let offsetBesarX = (cWidth - 100 * scale) / 2;');

fs.writeFileSync('public/surih-nombor-logic.js', content);
