const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// I want to ensure the tracing area is well centered.
content = content.replace(/let scale = Math\.min\(cWidth \* 0\.6, cHeight \* 0\.75\) \/ 100;\n    let offsetBesarX = \(cWidth - 100 \* scale\) \/ 2;\n    let offsetY = cHeight \* 0\.15;/, 'let scale = Math.min(cWidth * 0.5, cHeight * 0.7) / 100;\n    let offsetBesarX = (cWidth - 100 * scale) / 2;\n    let offsetY = (cHeight - 100 * scale) / 2;');

fs.writeFileSync('public/surih-nombor-logic.js', content);
