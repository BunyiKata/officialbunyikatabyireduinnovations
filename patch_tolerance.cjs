const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// I also notice the hit tolerance is checked via distToSegment.
// If the lines are thicker (20-25px), 45 tolerance might be too big or small depending on the scaling.
// It's scaled. If scale is 3, 45 is 15px in the original SVG.
content = content.replace(/if \(minD > 45\)/, 'if (minD > 60)');

fs.writeFileSync('public/surih-nombor-logic.js', content);
