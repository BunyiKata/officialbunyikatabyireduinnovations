const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Replace any duplicate arFilterList block near end of file
const duplicatedBlockReg = /window\.currentARFilter = 'bear';\r?\nwindow\.currentARFilter = 'bear';[\s\S]*?window\.tukarARFilter = function[\s\S]*?\};/g;

const cleanBlock = `window.currentARFilter = 'bear';
var arFilterList = ['bear', 'cat', 'dog'];

window.tukarARFilter = function(filterName) {
    if (filterName) {
        window.currentARFilter = filterName;
    } else {
        const currentIndex = arFilterList.indexOf(window.currentARFilter);
        const nextIndex = (currentIndex + 1) % arFilterList.length;
        window.currentARFilter = arFilterList[nextIndex];
    }
};`;

logic = logic.replace(duplicatedBlockReg, cleanBlock);
fs.writeFileSync('public/app-logic.js', logic);
console.log("Cleaned public/app-logic.js");
