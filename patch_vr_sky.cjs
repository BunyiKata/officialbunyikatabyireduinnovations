const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

const target = `        container.innerHTML = \`
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
            });`;

const replace = `        container.innerHTML = \`
            <a-scene embedded style="width: 100%; height: 100%;">
                <a-assets>
                    <img id="skyImage" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" crossorigin="anonymous">
                </a-assets>
                <a-sky src="#skyImage"></a-sky>
                
                <a-entity position="0 0 0">
                    \${buttons}
                </a-entity>
                
                <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                    <a-cursor raycaster="objects: .clickable" color="red"></a-cursor>
                </a-entity>
            </a-scene>
        \`;`;

if (logic.includes(target)) {
    logic = logic.replace(target, replace);
    fs.writeFileSync('public/app-logic.js', logic);
    console.log('patched vr sky');
} else {
    console.log('target not found');
}
