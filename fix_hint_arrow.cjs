const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

code = code.replace(
    /style=\{\{ position: 'absolute', bottom: \`\$\{FLOOR_Y \+ 50\}px\`, left: '250px', fontSize: '4rem', zIndex: 1, opacity: 0\.8 \}\}/,
    `style={{ position: 'absolute', bottom: \`\${FLOOR_Y + 50}px\`, left: \`\${characterPos.x < 200 ? 250 : characterPos.x + 100}px\`, fontSize: '4rem', zIndex: 1, opacity: 0.8 }}`
);

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
