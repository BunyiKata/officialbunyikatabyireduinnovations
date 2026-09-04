const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regex = /if\('speechSynthesis' in window\) \{\s*window\.speechSynthesis\.cancel\(\);\s*\}\s*if \(typeof flashcardAttentionTimer !== 'undefined'\) \{\s*clearInterval\(flashcardAttentionTimer\);\s*\}/;

const cleanupLogic = `if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if (typeof flashcardAttentionTimer !== 'undefined') {
                clearInterval(flashcardAttentionTimer);
            }
            if (screenId !== 'view-ar-sukukata') {
                if (window.arCamera) { window.arCamera.stop(); window.arCamera = null; }
                if (window.arFaceMesh) { window.arFaceMesh.close(); window.arFaceMesh = null; }
                if (window.isARPlaying) { 
                    window.isARPlaying = false; 
                    if (window.arRecognition) { window.arRecognition.stop(); window.arRecognition = null; }
                }
                const v = document.getElementById('input_video_ar_sukukata');
                if (v && v.srcObject) { v.srcObject.getTracks().forEach(t => t.stop()); v.srcObject = null; }
            }`;

if (regex.test(code)) {
    code = code.replace(regex, cleanupLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log("Patched paparSkrin for AR cleanup using regex");
} else {
    console.log("Could not find regex match");
}
