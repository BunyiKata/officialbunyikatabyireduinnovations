const fs = require('fs');
const file = 'src/components/CabaranSukuKataGame.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /if \(id === 'suku_kata_v_kvk'\) \{[\s\S]*?return \[createRoundVKVK\(round1Cards, 1\), createRoundVKVK\(round2Cards, 2\)\];\n    \}/;

const replacement = `if (id === 'suku_kata_v_kvk') {
      const defaultCards = MODULE_FLASHCARDS.suku_kata_v_kvk || [];
      const cards = flashcards && flashcards.length > 0 ? flashcards : defaultCards;
      const count = cards.length <= 10 ? cards.length : 10;
      const shuffledCards = shuffleArray(cards).slice(0, count);
      
      const allSuffixes = cards.map((c: any) => {
        const parts = (c.front || '').split('-').map((s: string) => s.trim());
        return parts[1] || '';
      }).filter(Boolean);

      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const parts = (card.front || '').split('-').map((s: string) => s.trim());
        const prefix = parts[0] || 'a';
        const suffix = parts[1] || '';
        
        const distractors = shuffleArray(allSuffixes.filter((s: string) => s !== suffix)).slice(0, 3);
        
        return {
          type: 'lengkap',
          image: card.icon,
          imageText: word,
          prefix: prefix,
          suffix: '___',
          answer: suffix,
          options: shuffleArray([suffix, ...distractors])
        };
      });
    }`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code, 'utf8');
  console.log("Successfully replaced suku_kata_v_kvk block.");
} else {
  console.log("Could not find suku_kata_v_kvk block.");
}
