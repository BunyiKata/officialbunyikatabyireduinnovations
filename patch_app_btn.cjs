const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    'className="neo-btn bg-pink ar-start-btn"',
    'className="neo-btn ar-start-btn"'
);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx start btn");
