const fs = require('fs');
let js = fs.readFileSync('public/app-logic.js', 'utf8');

// Update window.arCamera check block
js = js.replace(
    `    if (window.arCamera) {
        if (overlay) {
            overlay.classList.remove('hidden', 'opacity-0');
            overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold">Memuatkan model AR...</p>';
        }
        window.arCamera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
        setTimeout(hideARCameraOverlay, 1000);
        return;
    }`,
    `    if (window.arCamera) {
        hideARCameraOverlay();
        return;
    }`
);

// Update getUserMedia callback
js = js.replace(
    `    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';`,
    `    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        hideARCameraOverlay();`
);

fs.writeFileSync('public/app-logic.js', js);
console.log("Updated AR Overlay logic!");
