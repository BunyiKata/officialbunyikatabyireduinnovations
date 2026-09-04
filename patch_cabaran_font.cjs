const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

code = code.replace(/style=\{\{ fontSize: '4rem', filter: 'drop-shadow\(2px 4px 0 rgba\(0,0,0,0\.2\)\)', cursor: currentQ\.imageText \? 'pointer' : 'default' \}\}/g, "style={{ fontSize: currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 10vw, 4rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', cursor: currentQ.imageText ? 'pointer' : 'default', wordBreak: 'break-word', lineHeight: 1.3 }}");

code = code.replace(/style=\{\{ fontSize: '3rem', filter: 'drop-shadow\(2px 4px 0 rgba\(0,0,0,0\.2\)\)' \}\}/g, "style={{ fontSize: currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 2.5rem)' : 'clamp(2.5rem, 10vw, 3rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', wordBreak: 'break-word', lineHeight: 1.3 }}");

code = code.replace(/style=\{\{ fontSize: '3\.8rem', filter: 'drop-shadow\(2px 4px 0 rgba\(0,0,0,0\.2\)\)', cursor: currentQ\.imageText \? 'pointer' : 'default' \}\}/g, "style={{ fontSize: currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 10vw, 3.8rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', cursor: currentQ.imageText ? 'pointer' : 'default', wordBreak: 'break-word', lineHeight: 1.3 }}");

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('patched cabaran font size');
