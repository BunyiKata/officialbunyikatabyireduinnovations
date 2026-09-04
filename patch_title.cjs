const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    '<div className="bs-title-sukukata neo-btn bg-orange">',
    '<div id="sukukata-left-title" className="bs-title-sukukata neo-btn bg-orange">'
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched');
