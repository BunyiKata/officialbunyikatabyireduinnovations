const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(/playSoundEffect\('correct'\);/g, "");
content = content.replace(/playSoundEffect\('wrong'\);/g, "");

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);
