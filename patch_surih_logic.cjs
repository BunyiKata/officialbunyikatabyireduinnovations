const fs = require('fs');
let code = fs.readFileSync('public/surih-logic.js', 'utf-8');

const oldUpdateNav = `    // Update nav colors
    document.getElementById(\`surih-nav-btn-\${surihData.hurufSemasa}\`).classList.replace('bg-orange', 'bg-white');
    document.getElementById(\`surih-nav-btn-\${newIdx}\`).classList.replace('bg-white', 'bg-orange');`;

const newUpdateNav = `    surihData.hurufSemasa = newIdx;
    window.updateSurihNavColors();`;

code = code.replace(oldUpdateNav, '');
code = code.replace(`surihData.hurufSemasa = newIdx;`, newUpdateNav);

const tickCode = `document.getElementById(\`surih-nav-btn-\${surihData.hurufSemasa}\`).innerHTML = \`\${hurufAbjad[surihData.hurufSemasa]} <i class="fa-solid fa-check" style="color:#22c55e"></i>\`;`;
code = code.replace(tickCode, `surihData.hurufSelesai.add(surihData.hurufSemasa);\n                    window.updateSurihNavColors();`);

code += `\nwindow.updateSurihNavColors = function() {
    hurufAbjad.forEach((h, i) => {
        const btn = document.getElementById(\`surih-nav-btn-\${i}\`);
        if (!btn) return;
        btn.classList.remove('bg-orange', 'bg-white', 'bg-green');
        if (i === surihData.hurufSemasa) {
            btn.classList.add('bg-orange');
        } else if (surihData.hurufSelesai && surihData.hurufSelesai.has(i)) {
            btn.classList.add('bg-green');
        } else {
            btn.classList.add('bg-white');
        }
    });
};
`;

fs.writeFileSync('public/surih-logic.js', code);
