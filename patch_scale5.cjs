const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// The offset is currently calculated dynamically, but there is an issue with how the numbers are drawn on the canvas, they are drawn slightly squished. Let's fix that.
// First, we fix the offset and scaling logic in calcCurrentStrokesNombor
const newScalingLogic = `
    let scale = Math.min(cWidth * 0.5, cHeight * 0.7) / 100;
    let offsetBesarX = (cWidth - 100 * scale) / 2;
    let offsetY = cHeight * 0.15;
`;

content = content.replace(/let scale = Math\.min\(cWidth \* 0\.8, cHeight \* 0\.8\) \/ 100;\n    let offsetBesarX = \(cWidth - 100 \* scale\) \/ 2;\n    let offsetKecilX = 0;\n    let offsetY = cHeight \* 0\.10;/g, newScalingLogic);

fs.writeFileSync('public/surih-nombor-logic.js', content);
