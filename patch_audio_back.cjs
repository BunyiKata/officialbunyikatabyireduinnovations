const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';`;
const replacement = `    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';`;

code = code.replace(target, replacement);

fs.writeFileSync('public/app-logic.js', code);
