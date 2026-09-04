const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        stream.getTracks().forEach(t => t.stop()); // We just needed permission
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';
        
        const faceMesh = new FaceMesh({`;

const replacement = `    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        if (overlay) overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Memuatkan model AR...</p>';
        
        const faceMesh = new FaceMesh({`;

const targetEnd = `    window.arFaceMesh = faceMesh;
    
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            if (window.arFaceMesh) {
                await window.arFaceMesh.send({image: videoElement});
            }
        },
        width: 640,
        height: 480
    });
    
    window.arCamera = camera;
    camera.start().then(() => hideARCameraOverlay()).catch(err => console.error("Kamera ralat: ", err));
    }).catch(err => {`;

const replacementEnd = `    window.arFaceMesh = faceMesh;
    
    let isARActive = true;
    window.arCamera = {
        stop: () => {
            isARActive = false;
            stream.getTracks().forEach(t => t.stop());
        },
        start: async () => {} // Dummy start
    };
    
    videoElement.srcObject = stream;
    videoElement.play();
    
    async function processVideo() {
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

code = code.replace(target, replacement);
code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('public/app-logic.js', code);
