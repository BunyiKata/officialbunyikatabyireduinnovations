const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(/setFeedback\('correct'\);/g, "setFeedback('correct');\n            if ((window as any).playBubble) (window as any).playBubble();");
content = content.replace(/setFeedback\('wrong'\);/g, "setFeedback('wrong');\n            if ((window as any).playOops) (window as any).playOops();");

// To prevent double replacement if already replaced:
content = content.replace(/(if \(\(window as any\)\.playBubble\) \(window as any\)\.playBubble\(\);\s*)+/g, "if ((window as any).playBubble) (window as any).playBubble();\n");
content = content.replace(/(if \(\(window as any\)\.playOops\) \(window as any\)\.playOops\(\);\s*)+/g, "if ((window as any).playOops) (window as any).playOops();\n");

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);
