const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// Replace the broken hideARCameraOverlay
code = code.replace(
    /function hideARCameraOverlay\(\)\s*\{[\s\S]*?\}\s*\}\s*\}\s*function initARCamera\(\)/,
    `function hideARCameraOverlay() {
    const overlay = document.getElementById('camera_status_ar_sukukata');
    if (overlay) {
        overlay.classList.add('opacity-0');
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
    }
}

function initARCamera()`
);

fs.writeFileSync('public/app-logic.js', code);
console.log("Fixed syntax in app-logic.js");
