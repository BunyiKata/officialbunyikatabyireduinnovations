const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regex = /<div style="font-size: \$\{item\.icon && item\.icon\.length > 14 \? '2\.5rem' : item\.icon && item\.icon\.length > 6 \? '3\.5rem' : '6rem'\}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%;">\$\{item\.icon \|\| '❓'\}<\/div>/g;
const replacement = `<div style="font-size: \${item.icon && item.icon.length > 25 ? 'clamp(1.2rem, 4vw, 2rem)' : item.icon && item.icon.length > 14 ? 'clamp(1.5rem, 5vw, 2.5rem)' : item.icon && item.icon.length > 6 ? 'clamp(2.5rem, 8vw, 3.5rem)' : 'clamp(3rem, 12vw, 6rem)'}; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; height: 100%; line-height: 1.3; word-break: break-word; padding: 10px; box-sizing: border-box;">\${item.icon || '❓'}</div>`;

let count = 0;
code = code.replace(regex, () => {
    count++;
    return replacement;
});

fs.writeFileSync('public/app-logic.js', code);
console.log('patched icon styles, count:', count);
