const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(
  "setFeedback('correct');",
  "setFeedback('correct');\n            if ((window as any).playBubble) (window as any).playBubble();"
);

content = content.replace(
  "setFeedback('correct');",
  "setFeedback('correct');\n            if ((window as any).playBubble) (window as any).playBubble();"
);

content = content.replace(
  "setFeedback('wrong');",
  "setFeedback('wrong');\n            if ((window as any).playOops) (window as any).playOops();"
);

content = content.replace(
  "setFeedback('wrong');",
  "setFeedback('wrong');\n            if ((window as any).playOops) (window as any).playOops();"
);

// We should replace all occurrences, so we can use a regex loop or just multiple replace.
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);
