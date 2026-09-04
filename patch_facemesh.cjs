const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const targetProcessVideo = `    async function processVideo() {
        if (!isARActive) return;
        if (videoElement.readyState >= 2) {
            try {
                await faceMesh.send({image: videoElement});
            } catch(e) {}
        }
        requestAnimationFrame(processVideo);
    }
    processVideo();
    
    }).catch(err => {`;

const replacementProcessVideo = `    let hasLoadedModel = false;
    async function processVideo() {
        if (!isARActive) return;
        if (videoElement.readyState >= 2) {
            try {
                await faceMesh.send({image: videoElement});
                if (!hasLoadedModel) {
                    hasLoadedModel = true;
                    hideARCameraOverlay();
                }
            } catch(e) {
                if (!hasLoadedModel) {
                    console.error("FaceMesh initialization error:", e);
                    if (overlay) {
                        overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila muat semula halaman.</p>';
                    }
                    hasLoadedModel = true; // Stop spamming error
                }
            }
        }
        requestAnimationFrame(processVideo);
    }
    
    faceMesh.initialize().then(() => {
        console.log("FaceMesh loaded successfully");
        processVideo();
    }).catch(e => {
        console.error("Failed to initialize FaceMesh:", e);
        if (overlay) {
            overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila pastikan sambungan internet stabil.</p>';
        }
        // processVideo(); // Continue anyway just for video feed without AR
        hideARCameraOverlay(); // Hide overlay so camera shows
    });
    
    }).catch(err => {`;

code = code.replace(targetProcessVideo, replacementProcessVideo);
fs.writeFileSync('public/app-logic.js', code);
