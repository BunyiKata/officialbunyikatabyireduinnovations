const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const targetStream = `    videoElement.srcObject = stream;
    videoElement.play();`;

const replacementStream = `    const videoStream = new MediaStream(stream.getVideoTracks());
    videoElement.srcObject = videoStream;
    videoElement.play();`;

code = code.replace(targetStream, replacementStream);

fs.writeFileSync('public/app-logic.js', code);
