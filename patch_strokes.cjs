const fs = require('fs');
let code = fs.readFileSync('public/surih-logic.js', 'utf-8');

const regex = /const strokBesar = \{[\s\S]*?\};\n\n\/\/ Auto generate lowercase if missing \(fallback\)\nfor \(let h of hurufAbjad\) \{\n    if \(!strokKecil\[h\]\) strokKecil\[h\] = strokBesar\[h\]; \/\/ Fallback to uppercase\n\}/;

const newCode = `const svgBesar = {
    A: ["M 50 15 L 25 85", "M 50 15 L 75 85", "M 35 60 L 65 60"],
    B: ["M 30 10 L 30 90", "M 30 10 Q 70 10 70 30 Q 70 50 30 50", "M 30 50 Q 80 50 80 70 Q 80 90 30 90"],
    C: ["M 75 25 Q 70 10 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 70 90 75 75"],
    D: ["M 30 10 L 30 90", "M 30 10 Q 80 10 80 50 Q 80 90 30 90"],
    E: ["M 30 10 L 30 90", "M 30 10 L 70 10", "M 30 50 L 60 50", "M 30 90 L 70 90"],
    F: ["M 35 10 L 35 90", "M 35 10 L 70 10", "M 35 50 L 60 50"],
    G: ["M 80 25 Q 70 10 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 75 90 80 70 L 60 70"],
    H: ["M 30 10 L 30 90", "M 70 10 L 70 90", "M 30 50 L 70 50"],
    I: ["M 50 10 L 50 90", "M 30 10 L 70 10", "M 30 90 L 70 90"],
    J: ["M 30 10 L 70 10", "M 50 10 L 50 70 Q 50 90 30 90 Q 20 90 20 80"],
    K: ["M 30 10 L 30 90", "M 70 10 L 30 50", "M 30 50 L 70 90"],
    L: ["M 35 10 L 35 90", "M 35 90 L 75 90"],
    M: ["M 20 90 L 20 10", "M 20 10 L 50 50", "M 50 50 L 80 10", "M 80 10 L 80 90"],
    N: ["M 25 90 L 25 10", "M 25 10 L 75 90", "M 75 90 L 75 10"],
    O: ["M 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 50 Q 80 10 50 10"],
    P: ["M 30 10 L 30 90", "M 30 10 Q 75 10 75 30 Q 75 50 30 50"],
    Q: ["M 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 50 Q 80 10 50 10", "M 60 65 L 85 90"],
    R: ["M 30 10 L 30 90", "M 30 10 Q 75 10 75 30 Q 75 50 30 50", "M 45 50 L 75 90"],
    S: ["M 75 25 Q 70 10 50 10 Q 30 10 30 25 Q 30 45 50 50 Q 75 55 75 75 Q 75 90 50 90 Q 25 90 20 75"],
    T: ["M 20 10 L 80 10", "M 50 10 L 50 90"],
    U: ["M 25 10 L 25 60 Q 25 90 50 90 Q 75 90 75 60 L 75 10"],
    V: ["M 25 10 L 50 90", "M 50 90 L 75 10"],
    W: ["M 15 10 L 30 90", "M 30 90 L 50 50", "M 50 50 L 70 90", "M 70 90 L 85 10"],
    X: ["M 25 10 L 75 90", "M 75 10 L 25 90"],
    Y: ["M 25 10 L 50 50", "M 75 10 L 50 50", "M 50 50 L 50 90"],
    Z: ["M 25 10 L 75 10", "M 75 10 L 25 90", "M 25 90 L 75 90"]
};

const svgKecil = {
    A: ["M 70 45 Q 55 30 40 40 Q 25 55 35 75 Q 45 95 70 80", "M 70 35 L 70 85"],
    B: ["M 30 10 L 30 90", "M 30 50 Q 75 45 75 70 Q 75 95 30 90"],
    C: ["M 75 45 Q 60 30 40 40 Q 20 60 40 80 Q 60 90 75 75"],
    D: ["M 75 45 Q 50 30 35 45 Q 20 65 35 80 Q 50 95 75 80", "M 75 10 L 75 90"],
    E: ["M 30 60 L 75 60 Q 75 35 50 35 Q 25 35 25 65 Q 25 90 50 90 Q 70 90 75 75"],
    F: ["M 65 15 Q 50 10 50 30 L 50 90", "M 35 45 L 65 45"],
    G: ["M 75 45 Q 50 30 35 45 Q 20 65 35 80 Q 50 95 75 80", "M 75 45 L 75 90 Q 75 110 55 115 Q 40 115 35 105"],
    H: ["M 30 10 L 30 90", "M 30 50 Q 70 40 70 70 L 70 90"],
    I: ["M 50 40 L 50 90", "M 50 20 L 51 20"],
    J: ["M 50 40 L 50 90 Q 50 110 30 110", "M 50 20 L 51 20"],
    K: ["M 30 10 L 30 90", "M 65 40 L 30 65", "M 35 60 L 70 90"],
    L: ["M 50 10 L 50 90"],
    M: ["M 20 40 L 20 90", "M 20 50 Q 50 40 50 70 L 50 90", "M 50 50 Q 80 40 80 70 L 80 90"],
    N: ["M 30 40 L 30 90", "M 30 50 Q 70 40 70 70 L 70 90"],
    O: ["M 50 40 Q 25 40 25 65 Q 25 90 50 90 Q 75 90 75 65 Q 75 40 50 40"],
    P: ["M 30 40 L 30 110", "M 30 50 Q 75 45 75 70 Q 75 95 30 90"],
    Q: ["M 70 45 Q 50 30 35 45 Q 20 65 35 80 Q 50 95 70 80", "M 70 40 L 70 110"],
    R: ["M 35 40 L 35 90", "M 35 55 Q 65 40 70 60"],
    S: ["M 70 45 Q 60 35 50 35 Q 35 35 35 50 Q 35 60 50 65 Q 70 70 70 80 Q 70 95 50 95 Q 35 95 30 85"],
    T: ["M 50 20 L 50 85 Q 50 90 60 90", "M 30 40 L 70 40"],
    U: ["M 30 40 L 30 75 Q 30 90 50 90 Q 70 90 70 75", "M 70 40 L 70 90"],
    V: ["M 30 40 L 50 90", "M 50 90 L 70 40"],
    W: ["M 20 40 L 35 90", "M 35 90 L 50 60", "M 50 60 L 65 90", "M 65 90 L 80 40"],
    X: ["M 30 40 L 70 90", "M 70 40 L 30 90"],
    Y: ["M 30 40 L 50 70", "M 70 40 L 50 70 L 40 100 Q 35 110 25 110"],
    Z: ["M 30 40 L 70 40", "M 70 40 L 30 90", "M 30 90 L 70 90"]
};

const strokBesar = {};
const strokKecil = {};

function convertSvgToPoints(pathString) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    const len = path.getTotalLength();
    const points = [];
    const numPoints = Math.max(2, Math.floor(len / 5)); // sample every 5 grid units
    for (let i = 0; i <= numPoints; i++) {
        const pt = path.getPointAtLength((i / numPoints) * len);
        points.push({ x: pt.x, y: pt.y });
    }
    return points;
}

// Generate coordinate arrays from SVG paths
for (let h of hurufAbjad) {
    if (svgBesar[h]) {
        strokBesar[h] = svgBesar[h].map(convertSvgToPoints);
    }
    if (svgKecil[h]) {
        strokKecil[h] = svgKecil[h].map(convertSvgToPoints);
    } else {
        strokKecil[h] = strokBesar[h]; // Fallback to uppercase
    }
}`;

if (!regex.test(code)) {
    console.error("Regex did not match!");
}

code = code.replace(regex, newCode);
fs.writeFileSync('public/surih-logic.js', code);
