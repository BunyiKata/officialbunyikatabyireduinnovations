const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `function initARCamera() {
    const videoElement = document.getElementById('input_video_ar_sukukata');
    const canvasElement = document.getElementById('output_canvas_ar_sukukata');
    const canvasCtx = canvasElement.getContext('2d');
    
    if (window.arCamera) {
        window.arCamera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
        setTimeout(hideARCameraOverlay, 1000);
        return;
    }
    
    const overlay = document.getElementById('camera_status_ar_sukukata');
    if (overlay) {
        overlay.classList.remove('hidden', 'opacity-0');
    }
    
    const faceMesh = new FaceMesh({`;

const replacement = `function initARCamera() {
    const videoElement = document.getElementById('input_video_ar_sukukata');
    const canvasElement = document.getElementById('output_canvas_ar_sukukata');
    const canvasCtx = canvasElement.getContext('2d');
    
    const overlay = document.getElementById('camera_status_ar_sukukata');
    
    if (window.arCamera) {
        if (overlay) {
            overlay.classList.remove('hidden', 'opacity-0');
            overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold">Memuatkan model AR...</p>';
        }
        window.arCamera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
        setTimeout(hideARCameraOverlay, 1000);
        return;
    }
    
    if (overlay) {
        overlay.classList.remove('hidden', 'opacity-0');
        overlay.innerHTML = '<i class="fa-solid fa-camera fa-2x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Meminta akses kamera...</p>';
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        stream.getTracks().forEach(t => t.stop()); // We just needed permission
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';
        
        const faceMesh = new FaceMesh({`;

code = code.replace(target, replacement);

const targetEnd = `    window.arCamera = camera;
    camera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
}`;

const replacementEnd = `    window.arCamera = camera;
    camera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
    }).catch(err => {
        console.error("Camera access denied: ", err);
        if (overlay) {
            overlay.innerHTML = '<i class="fa-solid fa-triangle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-red-500 text-center">Kamera diperlukan.</p><p class="text-sm text-center">Sila benarkan akses kamera untuk AR.</p>';
        }
    });
}`;

code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('public/app-logic.js', code);
