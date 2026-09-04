const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

const betterSvg = `const svgBesarNombor = {
    '0': ["M 50 10 C 10 10, 10 90, 50 90 C 90 90, 90 10, 50 10"],
    '1': ["M 40 25 L 55 10 L 55 90", "M 30 90 L 80 90"],
    '2': ["M 25 35 C 25 5, 85 5, 75 40 Q 75 65 25 90 L 80 90"],
    '3': ["M 25 25 C 40 5, 80 15, 65 45 C 90 55, 75 100, 25 85"],
    '4': ["M 70 70 L 20 70 L 60 10 L 60 90"],
    '5': ["M 75 15 L 35 15 L 30 50 C 80 40, 85 95, 30 90"],
    '6': ["M 70 20 C 40 -5, 20 40, 20 70 C 20 100, 75 100, 75 70 C 75 45, 40 45, 25 65"],
    '7': ["M 20 20 L 80 20 L 40 90"],
    '8': ["M 50 50 C 20 50, 15 10, 50 10 C 85 10, 80 50, 50 50 C 15 50, 15 95, 50 95 C 85 95, 85 50, 50 50"],
    '9': ["M 35 80 C 60 105, 80 60, 80 30 C 80 0, 25 0, 25 30 C 25 55, 60 55, 75 35"],
    '10': ["M 20 25 L 30 10 L 30 90", "M 15 90 L 45 90", "M 70 10 C 40 10, 40 90, 70 90 C 100 90, 100 10, 70 10"]
};`;

content = content.replace(/const svgBesarNombor = \{[\s\S]*?\};/, betterSvg);

fs.writeFileSync('public/surih-nombor-logic.js', content);
