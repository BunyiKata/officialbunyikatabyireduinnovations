const fs = require('fs');
let code = fs.readFileSync('public/surih-logic.js', 'utf-8');

const targetResize = `    canvas.width = container.clientWidth;
    // Set a good aspect ratio
    canvas.height = Math.min(400, window.innerHeight * 0.5);`;
const newResize = `    canvas.width = container.clientWidth;
    // Maintain 3/2 aspect ratio
    canvas.height = canvas.width * 2 / 3;`;
code = code.replace(targetResize, newResize);

fs.writeFileSync('public/surih-logic.js', code);
