const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

const vrStart = logic.indexOf('window.bukaVRABC = function() {');
const vrEnd = logic.length;

const replacement = `window.bukaVRABC = function() {
    paparSkrin('view-vr-abc');
    const container = document.getElementById('vr-container');
    if(container.innerHTML === '') {
        let buttons = '';
        for(let i=0; i<26; i++) {
            const letter = String.fromCharCode(65 + i);
            const x = (i % 6) * 1.5 - 3.75;
            const y = -Math.floor(i / 6) * 1.5 + 4;
            const z = -6;
            buttons += \`<a-box position="\${x} \${y} \${z}" depth="0.2" height="1" width="1" color="#f59e0b"
                class="clickable"
                animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                onmouseenter="window.sebutAudio('\${letter.toLowerCase()}')">
                <a-text value="\${letter}" align="center" color="#000" position="0 0 0.11" scale="3 3 3"></a-text>
            </a-box>\`;
        }
        
        container.innerHTML = \`
            <video id="vr-camera-bg" autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; transform: scaleX(-1);"></video>
            <a-scene embedded style="width: 100%; height: 100%;" renderer="alpha: true">
                <a-entity position="0 0 0">
                    \${buttons}
                </a-entity>
                
                <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                    <a-cursor raycaster="objects: .clickable" color="red"></a-cursor>
                </a-entity>
            </a-scene>
        \`;

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                const video = document.getElementById('vr-camera-bg');
                if (video) {
                    video.srcObject = stream;
                    video.style.transform = 'none'; // reset mirror for environment camera
                }
            })
            .catch(err => {
                console.error("Environment camera error, falling back to front:", err);
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        const video = document.getElementById('vr-camera-bg');
                        if (video) video.srcObject = stream;
                    }).catch(e => console.log('No camera found'));
            });
    }
};

window.bukaARABC = function() {
    paparSkrin('view-ar-abc');
    const container = document.getElementById('ar-container');
    if(container.innerHTML === '') {
        let buttons = '';
        for(let i=0; i<26; i++) {
            const letter = String.fromCharCode(65 + i);
            const x = (i % 6) * 1 - 2.5;
            const y = -Math.floor(i / 6) * 1 + 3;
            const z = -4;
            buttons += \`<a-box position="\${x} \${y} \${z}" depth="0.1" height="0.8" width="0.8" color="#3b82f6"
                class="clickable"
                animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                onmouseenter="window.sebutAudio('\${letter.toLowerCase()}')">
                <a-text value="\${letter}" align="center" color="#fff" position="0 0 0.06" scale="2 2 2"></a-text>
            </a-box>\`;
        }
        
        container.innerHTML = \`
            <video id="ar-camera-bg" autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; transform: scaleX(-1);"></video>
            <a-scene embedded style="width: 100%; height: 100%;" renderer="alpha: true">
                <a-entity position="0 0 0">
                    \${buttons}
                </a-entity>
                
                <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                    <a-cursor raycaster="objects: .clickable" color="yellow"></a-cursor>
                </a-entity>
            </a-scene>
        \`;
        
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
};
`;

const updated = logic.substring(0, vrStart) + replacement;
fs.writeFileSync('public/app-logic.js', updated);
console.log('patched VR/AR');
