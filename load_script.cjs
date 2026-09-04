const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = "surihScript.src = `/surih-logic.js?v=${v}`;";
const newStr = `
    surihScript.src = \`/surih-logic.js?v=\${v}\`;
    
    // Load surih-nombor-logic.js
    const surihNomborScript = document.createElement("script");
    surihNomborScript.src = \`/surih-nombor-logic.js?v=\${v}\`;
    surihNomborScript.async = true;
    document.body.appendChild(surihNomborScript);
`;
if (content.includes(targetStr) && !content.includes('surih-nombor-logic.js')) {
    content = content.replace(targetStr, newStr.trim());
    fs.writeFileSync('src/App.tsx', content);
}
