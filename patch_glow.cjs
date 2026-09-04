const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /className="scene bs-scene"\s*onClick=\{\(e\) => \{\s*window\.flipFlashcard\(e\.currentTarget\);\s*\}\}\s*style=\{\{ position: "relative" \}\}/g;
const replacement = `className="scene bs-scene"
                onClick={(e) => {
                  window.flipFlashcard(e.currentTarget);
                }}
                style={{ position: "relative", animation: "gold-glow 2s infinite alternate", borderRadius: "30px" }}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('patched glow');
