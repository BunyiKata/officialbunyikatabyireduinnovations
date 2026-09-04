const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `    }).catch(e => {
        console.error("Failed to initialize FaceMesh:", e);
        if (overlay) {
            overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila pastikan sambungan internet stabil.</p>';
        }
        // processVideo(); // Continue anyway just for video feed without AR
        hideARCameraOverlay(); // Hide overlay so camera shows
    });`;

const replacement = `    }).catch(e => {
        console.error("Failed to initialize FaceMesh:", e);
        if (overlay) {
            overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila pastikan sambungan internet stabil.</p>';
        }
        // processVideo(); // Continue anyway just for video feed without AR
        setTimeout(() => {
             hideARCameraOverlay(); // Hide overlay after a few seconds so they can at least see themselves
        }, 3000);
    });`;

code = code.replace(target, replacement);

const targetCatch2 = `            } catch(e) {
                if (!hasLoadedModel) {
                    console.error("FaceMesh initialization error:", e);
                    if (overlay) {
                        overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila muat semula halaman.</p>';
                    }
                    hasLoadedModel = true; // Stop spamming error
                }
            }`;

const replacementCatch2 = `            } catch(e) {
                if (!hasLoadedModel) {
                    console.error("FaceMesh initialization error:", e);
                    if (overlay) {
                        overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila muat semula halaman.</p>';
                        setTimeout(() => hideARCameraOverlay(), 3000);
                    }
                    hasLoadedModel = true; // Stop spamming error
                }
            }`;

code = code.replace(targetCatch2, replacementCatch2);

fs.writeFileSync('public/app-logic.js', code);
