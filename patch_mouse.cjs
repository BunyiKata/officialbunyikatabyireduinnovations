const fs = require('fs');
let code = fs.readFileSync('public/surih-logic.js', 'utf-8');

const targetMouse = `function getMousePos(e) {
    return {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
    };
}`;
const newMouse = `function getMousePos(e) {
    const canvas = document.getElementById('surih-canvas');
    canvasRect = canvas.getBoundingClientRect(); // Always fresh to prevent scrolling bugs
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    return {
        x: (e.clientX - canvasRect.left) * scaleX,
        y: (e.clientY - canvasRect.top) * scaleY
    };
}`;
code = code.replace(targetMouse, newMouse);

const targetTouch = `function getTouchPos(e) {
    if (!e.touches || e.touches.length === 0) return {x:0, y:0};
    return {
        x: e.touches[0].clientX - canvasRect.left,
        y: e.touches[0].clientY - canvasRect.top
    };
}`;
const newTouch = `function getTouchPos(e) {
    if (!e.touches || e.touches.length === 0) return {x:0, y:0};
    const canvas = document.getElementById('surih-canvas');
    canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    return {
        x: (e.touches[0].clientX - canvasRect.left) * scaleX,
        y: (e.touches[0].clientY - canvasRect.top) * scaleY
    };
}`;
code = code.replace(targetTouch, newTouch);

fs.writeFileSync('public/surih-logic.js', code);
