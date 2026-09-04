const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

logic = logic.replace(/device-orientation-permission-ui="enabled: false"/g, 'device-orientation-permission-ui="enabled: true"');

fs.writeFileSync('public/app-logic.js', logic);
console.log('patched permission ui');
