const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// Also notice that for number 2 it has Q 75 65 25 90 which is fine, but maybe Q 75 60 25 90 L 80 90 is a bit tight on the curve.
// We'll leave it as is. It should render appropriately on the canvas.
// Ensure 10 is properly scaled.

const newSvgBesar = `const svgBesarNombor = {
    '0': ["M 50 10 C 20 10, 20 90, 50 90 C 80 90, 80 10, 50 10"],
    '1': ["M 40 25 L 50 10 L 50 90", "M 30 90 L 70 90"],
    '2': ["M 25 30 C 25 5, 75 5, 75 35 Q 75 60 25 90 L 75 90"],
    '3': ["M 25 25 Q 70 5 60 45 C 80 50, 80 90, 45 90 Q 25 90 25 75"],
    '4': ["M 70 70 L 20 70 L 60 10 L 60 90"],
    '5': ["M 70 15 L 35 15 L 30 50 C 70 40, 80 90, 30 90"],
    '6': ["M 70 20 C 45 -5, 20 30, 20 70 C 20 95, 70 95, 70 65 C 70 40, 40 45, 25 65"],
    '7': ["M 20 20 L 80 20 L 40 90"],
    '8': ["M 50 50 C 25 50, 25 10, 50 10 C 75 10, 75 50, 50 50 C 20 50, 20 90, 50 90 C 80 90, 80 50, 50 50"],
    '9': ["M 35 80 C 60 90, 80 55, 80 25 C 80 5, 25 5, 25 35 C 25 55, 60 55, 75 40"],
    '10': ["M 20 25 L 30 10 L 30 90", "M 15 90 L 45 90", "M 70 10 C 45 10, 45 90, 70 90 C 95 90, 95 10, 70 10"]
};`;

content = content.replace(/const svgBesarNombor = \{[\s\S]*?\};/, newSvgBesar);

// Check if any numbers are out of 100x100 grid. They seem to all fit.
fs.writeFileSync('public/surih-nombor-logic.js', content);
