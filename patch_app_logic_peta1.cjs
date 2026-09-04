const fs = require('fs');

let content = fs.readFileSync('public/app-logic.js', 'utf8');

content = content.replace(
  "if (window.currentPeta === 2 || window.currentPeta === 3)",
  "if (window.currentPeta === 1 || window.currentPeta === 2 || window.currentPeta === 3)"
);

fs.writeFileSync('public/app-logic.js', content);
console.log('Successfully patched public/app-logic.js');
