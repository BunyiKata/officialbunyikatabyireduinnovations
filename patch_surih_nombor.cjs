const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// Replacements
content = content.replace(/bukaSurihHuruf/g, 'bukaSurihNombor');
content = content.replace(/view-surih-huruf/g, 'view-surih-nombor');
content = content.replace(/surihData/g, 'surihNomborData');
content = content.replace(/hurufSemasa/g, 'nomborSemasa');
content = content.replace(/hurufSelesai/g, 'nomborSelesai');
content = content.replace(/hurufAbjad/g, 'nomborAbjad');

// We don't need jenisPaparan in nombor since there's only one case. 
// However, to keep it simple without breaking, we'll keep `drawBesar = true` and `drawKecil = false`.
// But first let's replace the array
content = content.replace(/const nomborAbjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'\.split\(''\);/, `const nomborAbjad = ['0','1','2','3','4','5','6','7','8','9','10'];`);

// SVG definitions
content = content.replace(/const svgBesar = \{[\s\S]*?\};/m, `const svgBesar = {
    '0': ["M 50 10 C 20 10, 20 90, 50 90 C 80 90, 80 10, 50 10"],
    '1': ["M 40 25 L 50 10 L 50 90", "M 30 90 L 70 90"],
    '2': ["M 25 30 C 25 10, 75 10, 75 40 Q 75 65 25 90 L 75 90"],
    '3': ["M 25 25 Q 65 10 65 40 Q 65 50 45 50 Q 70 50 70 75 Q 70 100 25 85"],
    '4': ["M 65 80 L 20 80 L 55 10 L 55 90"],
    '5': ["M 70 15 L 35 15 L 30 50 C 70 40, 80 90, 30 90"],
    '6': ["M 65 20 C 40 10, 20 50, 20 80 C 20 100, 70 100, 70 70 C 70 50, 40 50, 30 65"],
    '7': ["M 20 20 L 80 20 L 40 90"],
    '8': ["M 50 50 C 20 50, 20 10, 50 10 C 80 10, 80 50, 50 50 C 20 50, 20 90, 50 90 C 80 90, 80 50, 50 50"],
    '9': ["M 35 80 C 60 90, 80 50, 80 20 C 80 0, 30 0, 30 30 C 30 50, 60 50, 70 35"],
    '10': ["M 20 25 L 30 10 L 30 90", "M 15 90 L 45 90", "M 70 10 C 40 10, 40 90, 70 90 C 100 90, 100 10, 70 10"]
};`);
content = content.replace(/const svgKecil = \{[\s\S]*?\};/m, `const svgKecil = {};`);

content = content.replace(/surih-canvas/g, 'surih-nombor-canvas');
content = content.replace(/surih-nav-bar/g, 'surih-nombor-nav-bar');
content = content.replace(/surih-nav-btn-/g, 'surih-nombor-nav-btn-');
content = content.replace(/surih-confetti/g, 'surih-nombor-confetti');

// Window function names
content = content.replace(/window\.surihTukarHuruf/g, 'window.surihNomborTukar');
content = content.replace(/window\.surihReset/g, 'window.surihNomborReset');
content = content.replace(/window\.surihTunjukCara/g, 'window.surihNomborTunjukCara');
content = content.replace(/window\.surihStartDraw/g, 'window.surihNomborStartDraw');
content = content.replace(/window\.surihDraw/g, 'window.surihNomborDraw');
content = content.replace(/window\.surihEndDraw/g, 'window.surihNomborEndDraw');
content = content.replace(/window\.updateSurihNavColors/g, 'window.updateSurihNomborNavColors');
content = content.replace(/window\.surihInitialized/g, 'window.surihNomborInitialized');

// Remove kind check
content = content.replace(/let drawBesar = [^;]+;/g, 'let drawBesar = true;');
content = content.replace(/let drawKecil = [^;]+;/g, 'let drawKecil = false;');
content = content.replace(/let offsetBesarX = [^;]+;/g, 'let offsetBesarX = cWidth * 0.25;');
content = content.replace(/let offsetKecilX = [^;]+;/g, 'let offsetKecilX = 0;');

// Also rename internal functions to prevent collision if they share global scope?
// They are inside a module? No, they are global scripts!
content = content.replace(/function initSurih/g, 'function initSurihNombor');
content = content.replace(/initSurih\(\)/g, 'initSurihNombor()');
content = content.replace(/function convertSvgToPoints/g, 'function convertSvgToPointsNombor');
content = content.replace(/convertSvgToPoints\(/g, 'convertSvgToPointsNombor(');
content = content.replace(/function calcCurrentStrokes/g, 'function calcCurrentStrokesNombor');
content = content.replace(/calcCurrentStrokes\(\)/g, 'calcCurrentStrokesNombor()');
content = content.replace(/function renderSurih/g, 'function renderSurihNombor');
content = content.replace(/renderSurih\(\)/g, 'renderSurihNombor()');
content = content.replace(/function drawStrokes/g, 'function drawStrokesNombor');
content = content.replace(/drawStrokes\(/g, 'drawStrokesNombor(');
content = content.replace(/function drawUserLaluan/g, 'function drawUserLaluanNombor');
content = content.replace(/drawUserLaluan\(\)/g, 'drawUserLaluanNombor()');
content = content.replace(/function drawHint/g, 'function drawHintNombor');
content = content.replace(/drawHint\(/g, 'drawHintNombor(');
content = content.replace(/function checkWin/g, 'function checkWinNombor');
content = content.replace(/checkWin\(\)/g, 'checkWinNombor()');
content = content.replace(/function animateWin/g, 'function animateWinNombor');
content = content.replace(/animateWin\(\)/g, 'animateWinNombor()');
content = content.replace(/function resizeCanvas/g, 'function resizeCanvasNombor');
content = content.replace(/resizeCanvas\(\)/g, 'resizeCanvasNombor()');
content = content.replace(/function getEventPos/g, 'function getEventPosNombor');
content = content.replace(/getEventPos\(/g, 'getEventPosNombor(');

// variables
content = content.replace(/const strokBesar/g, 'const strokBesarNombor');
content = content.replace(/const strokKecil/g, 'const strokKecilNombor');
content = content.replace(/strokBesar\[/g, 'strokBesarNombor[');
content = content.replace(/strokKecil\[/g, 'strokKecilNombor[');
content = content.replace(/let ctx;/g, 'let ctxNombor;');
content = content.replace(/ctx\./g, 'ctxNombor.');
content = content.replace(/ctx =/g, 'ctxNombor =');
content = content.replace(/let canvasRect;/g, 'let canvasRectNombor;');
content = content.replace(/canvasRect =/g, 'canvasRectNombor =');
content = content.replace(/canvasRect\./g, 'canvasRectNombor.');
content = content.replace(/let currentStrokesToDraw/g, 'let currentStrokesToDrawNombor');
content = content.replace(/currentStrokesToDraw/g, 'currentStrokesToDrawNombor');

content = content.replace(/Huruf \$\{nomborAbjad\[/g, 'Nombor ${nomborAbjad[');

// Delete window.surihSetJenis from the nombor file to keep it clean.
content = content.replace(/window\.surihSetJenis = function\(jenis\) \{[\s\S]*?\};\n/, '');


fs.writeFileSync('public/surih-nombor-logic.js', content);
