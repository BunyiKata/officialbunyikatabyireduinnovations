const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

const target = `            if(screenId === 'leaderboard-screen') renderLeaderboard();
        }`;

const replace = `            if(screenId === 'leaderboard-screen') renderLeaderboard();
            
            // Stop camera streams if navigating away from VR/AR
            if (screenId !== 'view-vr-abc' && screenId !== 'view-ar-abc') {
                ['vr-camera-bg', 'ar-camera-bg'].forEach(id => {
                    const video = document.getElementById(id);
                    if (video && video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                        video.srcObject = null;
                    }
                });
            }
        }`;

logic = logic.replace(target, replace);
fs.writeFileSync('public/app-logic.js', logic);
console.log('patched paparSkrin');
