const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

content = content.replace(/ctxNombor\.lineWidth = 15;/g, 'ctxNombor.lineWidth = 25;'); // Fix the hint lines
content = content.replace(/ctxNombor\.lineWidth = 12;/g, 'ctxNombor.lineWidth = 20;'); // Fix the user drawing lines

fs.writeFileSync('public/surih-nombor-logic.js', content);
