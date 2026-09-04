const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(
    'statusEl.className = "text-xl md:text-2xl font-semibold text-sky-300 text-center"; statusEl.style.color = "#7dd3fc";',
    'statusEl.className = "ar-speech-text"; statusEl.style.color = "var(--color-dark, #10182f)";'
);

code = code.replace(
    'statusEl.className = "text-xl md:text-2xl font-bold text-red-700 text-center";',
    'statusEl.className = "ar-speech-text text-red-700"; statusEl.style.color = "#dc2626";'
);

// We should also make sure it uses var(--color-dark) when returning to 'Sila sebut perkataan...' in setTimeout.
// I already patched nextARWord() to do: statusEl.style.color = "var(--color-dark)";

fs.writeFileSync('public/app-logic.js', code);
console.log("Patched inline styles");
