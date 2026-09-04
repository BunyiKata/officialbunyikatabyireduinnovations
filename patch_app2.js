const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/animation: 'popBounce 2s infinite'/g, "animation: 'pulseSlowScale 3s infinite ease-in-out'");
fs.writeFileSync('src/App.tsx', code);
