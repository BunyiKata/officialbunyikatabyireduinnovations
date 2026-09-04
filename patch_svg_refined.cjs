const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

const betterSvg = `const svgBesarNombor = {
    '0': ["M 50 10 C 10 10, 10 90, 50 90 C 90 90, 90 10, 50 10"],
    '1': ["M 50 10 L 50 90"],
    '2': ["M 25 35 C 25 5, 85 5, 75 40 Q 75 65 25 90 L 80 90"],
    '3': ["M 25 25 C 40 5, 80 15, 65 45 C 90 55, 75 100, 25 85"],
    '4': ["M 65 10 L 25 65 L 85 65", "M 65 40 L 65 95"],
    '5': ["M 35 15 L 30 50 C 80 40, 85 95, 30 90", "M 35 15 L 75 15"],
    '6': ["M 70 20 C 40 -5, 20 40, 20 70 C 20 100, 75 100, 75 70 C 75 45, 40 45, 25 65"],
    '7': ["M 20 20 L 80 20 L 40 95"],
    '8': ["M 50 50 C 20 50, 15 10, 50 10 C 85 10, 80 50, 50 50 C 15 50, 15 95, 50 95 C 85 95, 85 50, 50 50"],
    '9': ["M 75 45 C 30 60, 10 10, 50 10 C 80 10, 85 45, 75 45 Q 65 100, 35 90"],
    '10': ["M 25 10 L 25 90", "M 65 10 C 35 10, 35 90, 65 90 C 95 90, 95 10, 65 10"]
};`;

content = content.replace(/const svgBesarNombor = \{[\s\S]*?\};/, betterSvg);

fs.writeFileSync('public/surih-nombor-logic.js', content);
