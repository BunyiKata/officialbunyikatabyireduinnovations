import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

ar_logic = """
// ==========================================
// AR SUKU KATA LOGIC
// ==========================================
window.arSukuKataWords = [];
window.currentARWord = "";
window.arSukuKataScore = 0;
window.isARPlaying = false;
window.arCamera = null;
window.arFaceMesh = null;
window.arRecognition = null;

window.bukaARSukuKataKemahiran = function(kemahiran) {
    paparSkrin('view-ar-sukukata');
    document.getElementById('ar_sukukata_kemahiran_label').innerText = 'Suku Kata ' + kemahiran.toUpperCase();
    
    // Set words based on kemahiran
    const wordsMap = {
        'kv': ["baju", "buku", "bola", "mata", "meja", "pasu", "sudu", "gigi", "jari", "kaki", "paku", "roti", "topi", "susu", "labu", "dadu", "satu", "tiga", "lima", "laci", "guli", "pipi", "dagu", "cuti", "cili"],
        'kvkv': ["baju", "buku", "bola", "mata", "meja", "pasu", "sudu", "gigi", "jari", "kaki", "paku", "roti", "topi", "susu", "labu", "dadu", "satu", "tiga", "lima", "laci", "guli", "pipi", "dagu", "cuti", "cili"],
        'v_kv': ["abu", "api", "ubi", "ibu", "isi", "ikan", "ayam", "ular", "awan", "ulat", "itik", "emak", "ekor", "oren", "otak", "obor", "epal", "emas", "enam"],
        'kvkvkv': ["kamera", "kereta", "menara", "kucing", "burung", "pisang", "jagung", "payung", "loceng", "sotong", "butang", "padang", "kacang", "gunting", "kambing"]
    };
    
    window.arSukuKataWords = wordsMap[kemahiran] || wordsMap['kv'];
    window.arSukuKataScore = 0;
    window.isARPlaying = false;
    document.getElementById('score_display_ar_sukukata').innerText = "0";
    document.getElementById('word_display_ar_sukukata').innerText = "?";
    
    const startBtn = document.getElementById('start_btn_ar_sukukata');
    startBtn.innerText = "MULA MAIN";
    startBtn.className = "neo-btn bg-pink text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";
    document.getElementById('speech_status_ar_sukukata').innerText = 'Tekan "MULA MAIN"';
    document.getElementById('speech_status_ar_sukukata').className = 'text-xl md:text-2xl font-semibold text-gray-600 text-center';
    
    initARCamera();
    initSpeechRecognition();
};

window.tutupARSukuKata = function() {
    if (window.isARPlaying) {
        document.getElementById('start_btn_ar_sukukata').click();
    }
    if (window.arCamera) {
        window.arCamera.stop();
        window.arCamera = null;
    }
    if (window.arFaceMesh) {
        window.arFaceMesh.close();
        window.arFaceMesh = null;
    }
    paparSkrin('murid-menu-belajar');
};

function initARCamera() {
    const videoElement = document.getElementById('input_video_ar_sukukata');
    const canvasElement = document.getElementById('output_canvas_ar_sukukata');
    const canvasCtx = canvasElement.getContext('2d');
    
    if (window.arFaceMesh) return; // already initialized
    
    document.getElementById('camera_status_ar_sukukata').classList.remove('hidden');
    document.getElementById('camera_status_ar_sukukata').classList.remove('opacity-0');
    
    const faceMesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });
    
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });
    
    let cameraReady = false;
    
    faceMesh.onResults((results) => {
        if (!cameraReady) {
            document.getElementById('camera_status_ar_sukukata').classList.add('opacity-0');
            setTimeout(() => document.getElementById('camera_status_ar_sukukata').classList.add('hidden'), 500);
            cameraReady = true;
        }

        if (canvasElement.width !== videoElement.videoWidth) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
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
    camera.start().catch(err => console.error("Kamera ralat: ", err));
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ms-MY';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('mic_icon_ar_sukukata').classList.remove('hidden');
            const statusEl = document.getElementById('speech_status_ar_sukukata');
            statusEl.innerText = "Sila sebut perkataan...";
            statusEl.className = "text-xl md:text-2xl font-semibold text-blue-600 text-center";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            if (transcript.includes(window.currentARWord)) {
                arCorrectAnswer();
            } else {
                const statusEl = document.getElementById('speech_status_ar_sukukata');
                statusEl.innerText = `Awak sebut: "${transcript}". Cuba lagi!`;
                statusEl.className = "text-xl md:text-2xl font-semibold text-red-500 text-center";
                setTimeout(() => {
                    if (window.isARPlaying) {
                        statusEl.innerText = "Sila sebut perkataan...";
                        statusEl.className = "text-xl md:text-2xl font-semibold text-blue-600 text-center";
                    }
                }, 2500);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                const statusEl = document.getElementById('speech_status_ar_sukukata');
                statusEl.innerText = "Sila benarkan akses mikrofon!";
                statusEl.className = "text-xl md:text-2xl font-semibold text-red-500 text-center";
            }
        };

        recognition.onend = () => {
            document.getElementById('mic_icon_ar_sukukata').classList.add('hidden');
            if (window.isARPlaying) {
                try { window.arRecognition.start(); } catch (e) {}
            }
        };
        
        window.arRecognition = recognition;
    } else {
        const statusEl = document.getElementById('speech_status_ar_sukukata');
        statusEl.innerText = "Maaf, pelayar tidak menyokong fungsi suara.";
        statusEl.classList.add('text-red-500');
        const startBtn = document.getElementById('start_btn_ar_sukukata');
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function nextARWord() {
    const randomIndex = Math.floor(Math.random() * window.arSukuKataWords.length);
    window.currentARWord = window.arSukuKataWords[randomIndex];
    
    const wordDisplay = document.getElementById('word_display_ar_sukukata');
    wordDisplay.style.opacity = 0;
    wordDisplay.style.transform = "scale(0.5)";
    
    setTimeout(() => {
        wordDisplay.innerText = window.currentARWord;
        wordDisplay.style.opacity = 1;
        wordDisplay.style.transform = "scale(1)";
    }, 200);
}

function arCorrectAnswer() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
    
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#fb923c', '#fbbf24', '#a78bfa']
    });
    
    window.arSukuKataScore += 10;
    document.getElementById('score_display_ar_sukukata').innerText = window.arSukuKataScore;
    
    const wordCard = document.getElementById('word_card_ar_sukukata');
    wordCard.classList.replace('border-orange-200', 'border-green-400');
    wordCard.classList.add('bg-green-100');
    
    const statusEl = document.getElementById('speech_status_ar_sukukata');
    statusEl.innerText = "Betul! Hebatnya! 🎉";
    statusEl.className = "text-2xl md:text-3xl font-black text-green-600 text-center";
    
    setTimeout(() => {
        wordCard.classList.replace('border-green-400', 'border-orange-200');
        wordCard.classList.remove('bg-green-100');
        if (window.isARPlaying) {
            nextARWord();
            statusEl.innerText = "Sila sebut perkataan...";
            statusEl.className = "text-xl md:text-2xl font-semibold text-blue-600 text-center";
        }
    }, 2000);
}

// Bind event listener when document is ready or during init
setTimeout(() => {
    const startBtn = document.getElementById('start_btn_ar_sukukata');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!window.isARPlaying) {
                window.isARPlaying = true;
                startBtn.innerText = "BERHENTI";
                startBtn.className = "neo-btn bg-red text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";
                
                nextARWord();
                if (window.arRecognition) {
                    try { window.arRecognition.start(); } catch(e) {}
                }
            } else {
                window.isARPlaying = false;
                startBtn.innerText = "MULA MAIN";
                startBtn.className = "neo-btn bg-pink text-white font-black py-4 px-14 rounded-full text-2xl md:text-3xl";
                
                if (window.arRecognition) {
                    window.arRecognition.stop();
                }
                const statusEl = document.getElementById('speech_status_ar_sukukata');
                statusEl.innerText = "Permainan dihentikan.";
                statusEl.className = "text-xl md:text-2xl font-semibold text-gray-500 text-center";
                document.getElementById('word_display_ar_sukukata').innerText = "?";
            }
        });
    }
}, 1000);

"""

content = content + "\n" + ar_logic

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched app-logic.js")
