const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(
    /startBtn\.className = "neo-btn bg-pink ar-start-btn";/g,
    'startBtn.className = "neo-btn ar-start-btn";'
);
fs.writeFileSync('public/app-logic.js', code);
console.log("Patched start btn class");
