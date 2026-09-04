const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

logic = logic.replace(/if \(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'\) \{\s*DeviceOrientationEvent.requestPermission\(\).catch\(e => console.error\(e\)\);\s*\}/g, '');

fs.writeFileSync('public/app-logic.js', logic);
console.log('patched manual permission request');
