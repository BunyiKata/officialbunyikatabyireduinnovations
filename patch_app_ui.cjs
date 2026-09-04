const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove sparkles
code = code.replace('<div className="ar-sparkle-tl">✨</div>', '');
code = code.replace('<div className="ar-sparkle-br">✨</div>', '');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx sparkles");
