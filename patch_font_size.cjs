const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// The original logic might have some text sizes or other things?
// The nav bar items for 10 are a bit wide.
content = content.replace(/btn\.style\.padding = '8px 12px';/, 'btn.style.padding = "8px 10px";');

fs.writeFileSync('public/surih-nombor-logic.js', content);
