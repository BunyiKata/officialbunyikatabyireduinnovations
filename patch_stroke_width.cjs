const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

content = content.replace(/ctxNombor\.lineWidth = 20;/g, 'ctxNombor.lineWidth = 25;'); // slightly thicker tracing line

fs.writeFileSync('public/surih-nombor-logic.js', content);
