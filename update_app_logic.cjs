const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(
    'startBtn.innerText = "MULA MAIN";',
    'startBtn.innerText = "MULA";'
);

const targetProcessVideo = `    let hasLoadedModel = false;
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
                        setTimeout(() => hideARCameraOverlay(), 3000);
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
        setTimeout(() => {
             hideARCameraOverlay(); // Hide overlay after a few seconds so they can at least see themselves
        }, 3000);
    });`;

const replacementProcessVideo = `    let hasLoadedModel = false;
    async function processVideo() {
        if (!isARActive) return;
        if (videoElement.readyState >= 2) {
            try {
                // console.log("[AR Suku Kata] Menghantar frame ke FaceMesh...");
                await faceMesh.send({image: videoElement});
                if (!hasLoadedModel) {
                    hasLoadedModel = true;
                    console.log("[AR Suku Kata] Frame berjaya diproses oleh FaceMesh!");
                    hideARCameraOverlay();
                }
            } catch(e) {
                if (!hasLoadedModel) {
                    console.error("[AR Suku Kata] FaceMesh ralat semasa memproses frame:", e);
                    if (overlay) {
                        overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Ralat pemprosesan AR.</p><p class="text-sm text-center text-white">Sila muat semula halaman.</p>';
                        setTimeout(() => hideARCameraOverlay(), 3000);
                    }
                    hasLoadedModel = true; // Stop spamming error
                }
            }
        }
        requestAnimationFrame(processVideo);
    }
    
    console.log("[AR Suku Kata] Mula memuatkan FaceMesh (initialize)...");
    faceMesh.initialize().then(() => {
        console.log("[AR Suku Kata] FaceMesh berjaya dimuatkan!");
        processVideo();
    }).catch(e => {
        console.error("[AR Suku Kata] Gagal memuatkan FaceMesh:", e);
        if (overlay) {
            overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila pastikan sambungan internet stabil.</p>';
        }
        setTimeout(() => {
             hideARCameraOverlay(); 
        }, 3000);
    });`;

code = code.replace(targetProcessVideo, replacementProcessVideo);

fs.writeFileSync('public/app-logic.js', code);
