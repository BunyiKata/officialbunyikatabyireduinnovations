const fs = require('fs');

// 1. Fix public/styles.css
let css = fs.readFileSync('public/styles.css', 'utf8');

const cssRule = `
/* Hide AR camera overlay properly */
.ar-camera-overlay.hidden,
.ar-camera-overlay.opacity-0 {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}
`;

if (!css.includes('.ar-camera-overlay.hidden')) {
    css += cssRule;
    fs.writeFileSync('public/styles.css', css);
    console.log("Updated public/styles.css with hidden overlay rules");
}

// 2. Fix public/app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Restore bukaARSukuKataKemahiran to use requestSensorPermissionAndStart
const oldBukaFunc = `window.bukaARSukuKataKemahiran = function(kemahiran) {
    window.bukaARSukuKataKemahiranSebenar(kemahiran);
};`;

const newBukaFunc = `window.bukaARSukuKataKemahiran = function(kemahiran) {
    if (typeof requestSensorPermissionAndStart === 'function') {
        requestSensorPermissionAndStart('ar-sukukata', kemahiran);
    } else {
        window.bukaARSukuKataKemahiranSebenar(kemahiran);
    }
};`;

logic = logic.replace(oldBukaFunc, newBukaFunc);

// Update initARCamera text to 'Menyediakan Kamera AR...'
logic = logic.replace(
    '<p class="text-xl font-bold text-white text-center">Meminta akses kamera...</p>',
    '<p class="text-xl font-bold text-white text-center">Menyediakan Kamera AR...</p>'
);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Updated public/app-logic.js with permission popup and camera text!");
