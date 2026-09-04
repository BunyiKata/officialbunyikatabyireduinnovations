const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

content = content.replace(/let offsetBesarX = \(cWidth - 100 \* scale\) \/ 2;\n    let offsetKecilX = 0;\n    \n    let scale = Math\.min\(cWidth \* 0\.55, cHeight \* 0\.75\) \/ 100;/, 'let scale = Math.min(cWidth * 0.55, cHeight * 0.75) / 100;\n    let offsetBesarX = (cWidth - 100 * scale) / 2;\n    let offsetKecilX = 0;');

fs.writeFileSync('public/surih-nombor-logic.js', content);
