const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

css += `\n
#view-vr-abc, #view-ar-abc {
    padding: 0 !important;
    margin: 0 !important;
    width: 100vw !important;
    height: 100dvh !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    z-index: 9999 !important;
}

#view-vr-abc button, #view-ar-abc button {
    position: absolute !important;
    top: 20px !important;
    left: 20px !important;
    z-index: 10000 !important;
}
`;

fs.writeFileSync('src/index.css', css);
console.log('patched vr/ar css for full screen');
