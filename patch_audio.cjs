const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {`;
const replacement = `    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {`;

code = code.replace(target, replacement);

fs.writeFileSync('public/app-logic.js', code);
