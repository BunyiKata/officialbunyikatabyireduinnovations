const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newLogic = `  if (id === 'bilang_0_10' || id === 'konsep_tambah' || id === 'konsep_penolakan' || id === 'bilang_siri_nombor' || id === 'vokal_konsonan') {
    const rawQ = CABARAN_DATA[id] || [];
    const count = rawQ.length <= 10 ? rawQ.length : 10;
    const shuffledQ = shuffleArray(rawQ).slice(0, count);
    return shuffledQ.map((q: any) => {
      if (q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });
  }

  if (flashcards && flashcards.length > 0) {`;

code = code.replace(`  if (flashcards && flashcards.length > 0) {`, newLogic);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('Done.');
