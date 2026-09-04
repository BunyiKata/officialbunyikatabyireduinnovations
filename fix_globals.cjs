const fs = require('fs');
let content = fs.readFileSync('public/surih-nombor-logic.js', 'utf-8');

// Global functions that might clash
const globalsToRename = [
    'startTrace',
    'tracing',
    'endTrace',
    'createPathNode',
    'createLine',
    'playSuccessSound',
    'playCompleteSound'
];

globalsToRename.forEach(fn => {
    const regex = new RegExp(fn, 'g');
    content = content.replace(regex, fn + 'Nombor');
});

fs.writeFileSync('public/surih-nombor-logic.js', content);
