const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(
    /startBtn.innerText = "MULA MAIN";/g,
    'startBtn.innerText = "MULA";'
);
code = code.replace(
    /Tekan "MULA MAIN"/g,
    'Tekan "MULA"'
);

fs.writeFileSync('public/app-logic.js', code);
