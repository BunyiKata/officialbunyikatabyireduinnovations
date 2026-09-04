const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "{/* Modal Akses Peranti */}";
const endStr = "      {/* Modal Pilih AR Suku Kata */}";
if (code.includes(startStr) && code.includes(endStr)) {
    const startIndex = code.indexOf(startStr);
    const endIndex = code.indexOf(endStr);
    code = code.substring(0, startIndex) + code.substring(endIndex);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Reverted modal-akses-peranti from App.tsx");
} else {
    console.log("Could not find boundaries to revert");
}
