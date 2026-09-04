const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const newInitAR = `function initARCamera() {
    const videoElement = document.getElementById('input_video_ar_sukukata');
    const canvasElement = document.getElementById('output_canvas_ar_sukukata');
    const canvasCtx = canvasElement.getContext('2d');
    const overlay = document.getElementById('camera_status_ar_sukukata');
    
    if (window.arCamera) {
        if (overlay) {
            overlay.classList.add('hidden');
        }
        return;
    }
    
    let isCameraPlaying = false;
    let isModelReady = false;
    let isOverlayHidden = false;
    
    function checkAndHideOverlay(stage) {
        console.log(\`[AR Setup] \${stage} - Camera: \${isCameraPlaying}, Model: \${isModelReady}\`);
        if (isOverlayHidden) return;
        if (isCameraPlaying && isModelReady) {
            isOverlayHidden = true;
            console.log("[AR Setup] Hiding overlay now!");
            if (overlay) {
                overlay.style.display = 'none'; // Paksa display none
                overlay.classList.add('hidden', 'opacity-0');
            } else {
                console.error("[AR Setup] Cannot read properties of null (overlay element not found)");
            }
        }
    }

    if (overlay) {
        overlay.classList.remove('hidden', 'opacity-0');
        overlay.style.display = 'flex';
        overlay.innerHTML = '<i class="fa-solid fa-camera fa-2x mb-3 text-pink-400"></i><p class="text-xl font-bold text-white text-center">Meminta akses kamera...</p>';
    }

    console.log("[AR Setup] Permission requested");
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        console.log("[AR Setup] Permission granted, stream received");
        
        const faceMesh = new FaceMesh({
        locateFile: (file) => {
            return \`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/\${file}\`;
        }
    });
    
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });
    
    faceMesh.onResults((results) => {
        isModelReady = true;
        checkAndHideOverlay("faceMesh.onResults");
        
        if (canvasElement.width !== (videoElement.videoWidth || 640)) {
            canvasElement.width = videoElement.videoWidth || 640;
            canvasElement.height = videoElement.videoHeight || 480;
        }
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            for (const landmarks of results.multiFaceLandmarks) {
                const getPt = (idx) => ({
                    x: landmarks[idx].x * canvasElement.width,
                    y: landmarks[idx].y * canvasElement.height
                });
                const nose = getPt(1);
                const leftFH = getPt(54);
                const rightFH = getPt(284);
                // Telinga Luar
                canvasCtx.fillStyle = '#f472b6';
                canvasCtx.beginPath();
                canvasCtx.arc(leftFH.x - 10, leftFH.y - 30, 35, 0, 2 * Math.PI);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.arc(rightFH.x + 10, rightFH.y - 30, 35, 0, 2 * Math.PI);
                canvasCtx.fill();
                // Telinga Dalam
                canvasCtx.fillStyle = '#fdf2f8';
                canvasCtx.beginPath();
                canvasCtx.arc(leftFH.x - 10, leftFH.y - 30, 18, 0, 2 * Math.PI);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.arc(rightFH.x + 10, rightFH.y - 30, 18, 0, 2 * Math.PI);
                canvasCtx.fill();
                // Hidung
                canvasCtx.fillStyle = '#1f2937';
                canvasCtx.beginPath();
                canvasCtx.ellipse(nose.x, nose.y, 15, 10, 0, 0, 2 * Math.PI);
                canvasCtx.fill();
                
                canvasCtx.fillStyle = '#ffffff';
                canvasCtx.beginPath();
                canvasCtx.ellipse(nose.x - 4, nose.y - 3, 4, 2, 0, 0, 2 * Math.PI);
                canvasCtx.fill();
                
                // Blush Pipi
                const leftCheek = getPt(205);
                const rightCheek = getPt(425);
                canvasCtx.fillStyle = 'rgba(251, 113, 133, 0.5)';
                canvasCtx.beginPath();
                canvasCtx.ellipse(leftCheek.x - 10, leftCheek.y, 25, 15, 0, 0, 2 * Math.PI);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.ellipse(rightCheek.x + 10, rightCheek.y, 25, 15, 0, 0, 2 * Math.PI);
                canvasCtx.fill();
            }
        }
        canvasCtx.restore();
    });
    
    window.arFaceMesh = faceMesh;
    
    let isARActive = true;
    window.arCamera = {
        stop: () => {
            isARActive = false;
            stream.getTracks().forEach(t => t.stop());
        },
        start: async () => {} // Dummy start
    };
    
    const videoStream = new MediaStream(stream.getVideoTracks());
    videoElement.srcObject = videoStream;
    videoElement.play().then(() => {
        console.log("[AR Setup] Stream playing");
        isCameraPlaying = true;
        checkAndHideOverlay("videoElement.play()");
    }).catch((e) => {
        console.error("[AR Setup] Stream play error", e);
    });
    
    let hasLoadedModel = false;
    async function processVideo() {
        if (!isARActive) return;
        if (videoElement.readyState >= 2) {
            try {
                await faceMesh.send({image: videoElement});
                if (!hasLoadedModel) {
                    hasLoadedModel = true;
                    console.log("[AR Suku Kata] Frame berjaya diproses oleh FaceMesh!");
                }
            } catch(e) {
                if (!hasLoadedModel) {
                    console.error("[AR Suku Kata] FaceMesh ralat semasa memproses frame:", e);
                    if (overlay) {
                        overlay.style.display = 'flex';
                        overlay.classList.remove('hidden', 'opacity-0');
                        overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Ralat pemprosesan AR.</p><p class="text-sm text-center text-white">Sila muat semula halaman.</p>';
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
        isModelReady = true;
        checkAndHideOverlay("faceMesh.initialize");
        processVideo();
    }).catch(e => {
        console.error("[AR Suku Kata] Gagal memuatkan FaceMesh:", e);
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('hidden', 'opacity-0');
            overlay.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-3x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Gagal memuatkan model AR.</p><p class="text-sm text-center text-white">Sila pastikan sambungan internet stabil.</p>';
        }
    });
    }).catch(err => {
        console.error("[AR Setup] Error getting user media:", err);
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('hidden', 'opacity-0');
            overlay.innerHTML = '<i class="fa-solid fa-video-slash fa-2x mb-3 text-red-500"></i><p class="text-xl font-bold text-white text-center">Akses Kamera Ditolak</p>';
        }
    });
}`;

// replace from `function initARCamera() {` up to `    });\n}` before `window.semakJawapanARSukuKata = function(teks) {`
const regex = /function initARCamera\(\)\s*\{[\s\S]*?(?=\nwindow\.semakJawapanARSukuKata)/;
code = code.replace(regex, newInitAR + "\n");

fs.writeFileSync('public/app-logic.js', code);
console.log("Patched public/app-logic.js");
