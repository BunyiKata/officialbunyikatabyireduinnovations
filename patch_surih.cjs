const fs = require('fs');
let code = fs.readFileSync('public/surih-logic.js', 'utf-8');

// Patch 1: Center coordinates
const targetCoord = `let offsetBesarX = drawKecil && drawBesar ? cWidth * 0.1 : (drawBesar ? cWidth * 0.25 : 0);
    let offsetKecilX = drawBesar && drawKecil ? cWidth * 0.55 : (drawKecil ? cWidth * 0.25 : 0);`;
const newCoord = `let offsetBesarX = drawKecil && drawBesar ? cWidth * 0.15 : (drawBesar ? cWidth * 0.3 : 0);
    let offsetKecilX = drawBesar && drawKecil ? cWidth * 0.55 : (drawKecil ? cWidth * 0.3 : 0);`;
code = code.replace(targetCoord, newCoord);

// Patch 2: Success Message and auto next
const targetMsg = `function tunjukMesejKejayaan() {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.background = 'var(--color-yellow)';
    el.style.padding = '20px 40px';
    el.style.borderRadius = '24px';
    el.style.border = '4px solid var(--color-dark)';
    el.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.2)';
    el.style.fontSize = '2rem';
    el.style.fontWeight = 'bold';
    el.style.zIndex = '20';
    el.style.textAlign = 'center';
    el.innerText = \`Bagus! Huruf \${hurufAbjad[surihData.hurufSemasa]} berjaya ditulis!\`;
    document.getElementById('surih-confetti').appendChild(el);
}`;
const newMsg = `function tunjukMesejKejayaan() {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.background = 'var(--color-yellow)';
    el.style.padding = '15px 30px';
    el.style.borderRadius = '20px';
    el.style.border = '4px solid var(--color-dark)';
    el.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.2)';
    el.style.fontSize = '1.3rem';
    el.style.fontWeight = 'bold';
    el.style.zIndex = '20';
    el.style.textAlign = 'center';
    el.style.lineHeight = '1.4';
    el.innerHTML = \`Bagus!<br>Huruf \${hurufAbjad[surihData.hurufSemasa]} berjaya ditulis!\`;
    document.getElementById('surih-confetti').appendChild(el);
    
    // Auto next after 1.5 seconds
    setTimeout(() => {
        if (window.surihTukarHuruf) {
            window.surihTukarHuruf(1);
        }
    }, 1500);
}`;
code = code.replace(targetMsg, newMsg);

fs.writeFileSync('public/surih-logic.js', code);
