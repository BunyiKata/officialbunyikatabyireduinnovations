const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldBuka = `window.bukaARSukuKataKemahiran = function(kemahiran) {
    paparSkrin('view-ar-sukukata');
    document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase();`;

const newBuka = `
window.bukaARSukuKataKemahiranSebenar = function(kemahiran) {
    paparSkrin('view-ar-sukukata');
    document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase();
`;

// Replace `window.bukaARSukuKataKemahiran = function(kemahiran) { ... ` with the new actual logic,
// and create a new `window.bukaARSukuKataKemahiran` that delegates.
// Note: We'll just replace the start of the function and add the new wrapper before it.

const wrapper = `window.bukaARSukuKataKemahiran = function(kemahiran) {
    if (typeof requestSensorPermissionAndStart === 'function') {
        requestSensorPermissionAndStart('ar-sukukata', kemahiran);
    } else {
        window.bukaARSukuKataKemahiranSebenar(kemahiran);
    }
};

window.bukaARSukuKataKemahiranSebenar = function(kemahiran) {
    paparSkrin('view-ar-sukukata');
    document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase();`;

code = code.replace(oldBuka, wrapper);
fs.writeFileSync('public/app-logic.js', code);
console.log("Patched bukaARSukuKataKemahiran");
