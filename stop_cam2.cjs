const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

const target = `            if (screenId !== 'view-vr-abc' && screenId !== 'view-ar-abc') {
                ['vr-camera-bg', 'ar-camera-bg'].forEach(id => {
                    const video = document.getElementById(id);
                    if (video && video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                        video.srcObject = null;
                    }
                });
            }`;

const replace = `            if (screenId !== 'view-vr-abc' && screenId !== 'view-ar-abc') {
                ['vr-camera-bg', 'ar-camera-bg'].forEach(id => {
                    const video = document.getElementById(id);
                    if (video && video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                        video.srcObject = null;
                    }
                });
                const vrContainer = document.getElementById('vr-container');
                if (vrContainer) vrContainer.innerHTML = '';
                const arContainer = document.getElementById('ar-container');
                if (arContainer) arContainer.innerHTML = '';
            }`;

logic = logic.replace(target, replace);
fs.writeFileSync('public/app-logic.js', logic);
console.log('patched paparSkrin 2');
