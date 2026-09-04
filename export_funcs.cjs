const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /onClick={\(e\) => { ([a-zA-Z0-9_]+)\(/g;
const matches = [...appTsx.matchAll(regex)];

const funcNames = new Set(matches.map(m => m[1]));
funcNames.delete('window');
funcNames.delete('document');
funcNames.delete('e');
funcNames.delete('if');

let appLogic = fs.readFileSync('public/app-logic.js', 'utf8');
let exportsAdded = 0;

for (const name of funcNames) {
    if (!appLogic.includes(`window.${name} = ${name}`)) {
        appLogic += `\nwindow.${name} = ${name};`;
        exportsAdded++;
    }
}

// Also check for onDragOver, onDragLeave, onDrop, onPointerDown, onPointerUp
const regex2 = /(?:onDragOver|onDragLeave|onDrop|onPointerDown|onPointerUp)={\(e\) => { ([a-zA-Z0-9_]+)\(/g;
const matches2 = [...appTsx.matchAll(regex2)];
for (const m of matches2) {
    const name = m[1];
    if (name !== 'window' && name !== 'document' && name !== 'e' && !appLogic.includes(`window.${name} = ${name}`)) {
        appLogic += `\nwindow.${name} = ${name};`;
        exportsAdded++;
    }
}


fs.writeFileSync('public/app-logic.js', appLogic);
console.log(`Added ${exportsAdded} exports to window.`);
