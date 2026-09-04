const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// The convertSvgToPoints logic uses getPointAtLength which might produce weird artifacts if the paths are jagged.
// The SVG strings look fine, but sometimes rendering issues are caused by how the points are generated.
// Also the path parsing might have issues.

// The scaling:
//     let scale = Math.min(cWidth * 0.5, cHeight * 0.7) / 100;
// Is fine, but let's make it bigger.
content = content.replace(/let scale = Math\.min\(cWidth \* 0\.5, cHeight \* 0\.7\) \/ 100;/, 'let scale = Math.min(cWidth * 0.6, cHeight * 0.75) / 100;');

fs.writeFileSync('public/surih-nombor-logic.js', content);
