const fs = require('fs');
let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

const vrStart = logic.indexOf('window.bukaVRABC = function() {');
const endOfScript = logic.length;

const newFunctions = `
function requestSensorPermissionAndStart(type) {
    const existingModal = document.getElementById('sensor-permission-modal');
    if (existingModal) existingModal.remove();

    const modalHtml = \`
        <div id="sensor-permission-modal" class="modal-overlay" style="z-index: 10000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;">
            <div class="neo-box" style="text-align: center; max-width: 400px; padding: 30px; background: white; border-radius: 12px;">
                <h3 style="margin-bottom: 20px; font-size: 1.5rem; color: #333;">Akses Pergerakan Peranti</h3>
                <p style="margin-bottom: 20px; color: #555;">Kami memerlukan kebenaran anda untuk mengakses penderia pergerakan dan orientasi (motion and orientation) bagi menggerakkan pandangan VR/AR mengikut pergerakan peranti anda.</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="btn-allow-sensor" class="neo-btn bg-green">Benarkan</button>
                    <button id="btn-deny-sensor" class="neo-btn bg-red">Batal</button>
                </div>
            </div>
        </div>
    \`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('btn-deny-sensor').onclick = () => {
        document.getElementById('sensor-permission-modal').remove();
    };
    
    document.getElementById('btn-allow-sensor').onclick = () => {
        document.getElementById('sensor-permission-modal').remove();
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        if (type === 'vr') startVRScene();
                        else startARScene();
                    } else {
                        alert('Akses penderia ditolak.');
                    }
                })
                .catch(console.error);
        } else {
            if (type === 'vr') startVRScene();
            else startARScene();
        }
    };
}

window.bukaVRABC = function() {
    requestSensorPermissionAndStart('vr');
};

function startVRScene() {
    paparSkrin('view-vr-abc');
    
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['play-on-hover']) {
        AFRAME.registerComponent('play-on-hover', {
            schema: {type: 'string'},
            init: function () {
                this.el.addEventListener('mouseenter', () => {
                    if (window.sebutAudio) window.sebutAudio(this.data);
                });
            }
        });
    }

    const container = document.getElementById('vr-container');
    if(container.innerHTML === '') {
        let buttons = '';
        for(let i=0; i<26; i++) {
            const letter = String.fromCharCode(65 + i);
            const x = (i % 6) * 1.5 - 3.75;
            const y = -Math.floor(i / 6) * 1.5 + 4;
            const z = -6;
            buttons += \\\`<a-box position="\\\${x} \\\${y} \\\${z}" depth="0.2" height="1" width="1" color="#f59e0b"
                class="clickable"
                animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                play-on-hover="\\\${letter.toLowerCase()}">
                <a-text value="\\\${letter}" align="center" color="#000" position="0 0 0.11" scale="3 3 3"></a-text>
            </a-box>\\\`;
        }
        
        container.innerHTML = \\\`
            <a-scene embedded style="width: 100%; height: 100%;" device-orientation-permission-ui="enabled: false">
                <a-assets>
                    <img id="skyImage" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" crossorigin="anonymous">
                </a-assets>
                <a-sky src="#skyImage"></a-sky>
                
                <a-entity position="0 0 0">
                    \\\${buttons}
                </a-entity>
                
                <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                    <a-cursor raycaster="objects: .clickable" color="red"></a-cursor>
                </a-entity>
            </a-scene>
        \\\`;
    }
}

window.bukaARABC = function() {
    requestSensorPermissionAndStart('ar');
};

function startARScene() {
    paparSkrin('view-ar-abc');
    
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['play-on-hover']) {
        AFRAME.registerComponent('play-on-hover', {
            schema: {type: 'string'},
            init: function () {
                this.el.addEventListener('mouseenter', () => {
                    if (window.sebutAudio) window.sebutAudio(this.data);
                });
            }
        });
    }

    const container = document.getElementById('ar-container');
    if(container.innerHTML === '') {
        let buttons = '';
        for(let i=0; i<26; i++) {
            const letter = String.fromCharCode(65 + i);
            const x = (i % 6) * 1 - 2.5;
            const y = -Math.floor(i / 6) * 1 + 3;
            const z = -4;
            buttons += \\\`<a-box position="\\\${x} \\\${y} \\\${z}" depth="0.1" height="0.8" width="0.8" color="#3b82f6"
                class="clickable"
                animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                play-on-hover="\\\${letter.toLowerCase()}">
                <a-text value="\\\${letter}" align="center" color="#fff" position="0 0 0.06" scale="2 2 2"></a-text>
            </a-box>\\\`;
        }
        
        container.innerHTML = \\\`
            <video id="ar-camera-bg" autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; transform: scaleX(-1);"></video>
            <a-scene embedded style="width: 100%; height: 100%;" renderer="alpha: true" device-orientation-permission-ui="enabled: false">
                <a-entity position="0 0 0">
                    \\\${buttons}
                </a-entity>
                
                <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                    <a-cursor raycaster="objects: .clickable" color="yellow"></a-cursor>
                </a-entity>
            </a-scene>
        \\\`;
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                const video = document.getElementById('ar-camera-bg');
                if (video) {
                    video.srcObject = stream;
                    video.style.transform = 'none'; // reset mirror for environment camera
                }
            })
            .catch(err => {
                console.error("Environment camera error, falling back to front:", err);
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        const video = document.getElementById('ar-camera-bg');
                        if (video) video.srcObject = stream;
                    }).catch(e => console.log('No camera found'));
            });
    }
}
`;

const updated = logic.substring(0, vrStart) + newFunctions;
fs.writeFileSync('public/app-logic.js', updated);
console.log('patched permission modal');
