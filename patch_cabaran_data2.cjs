const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newData = `    { type: 'padan', image: '🔟', imageText: 'sepuluh', options: ['sepuluh', 'sifar', 'satu', 'dua'], answer: 'sepuluh' }
  ],
  bilang_siri_nombor: [
    { type: 'padan', image: '1️⃣0️⃣', imageText: 'sepuluh', options: ['sepuluh', 'dua puluh', 'tiga puluh', 'empat puluh'], answer: 'sepuluh' },
    { type: 'padan', image: '2️⃣0️⃣', imageText: 'dua puluh', options: ['dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh'], answer: 'dua puluh' },
    { type: 'padan', image: '3️⃣0️⃣', imageText: 'tiga puluh', options: ['tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh'], answer: 'tiga puluh' },
    { type: 'padan', image: '4️⃣0️⃣', imageText: 'empat puluh', options: ['empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh'], answer: 'empat puluh' },
    { type: 'padan', image: '5️⃣0️⃣', imageText: 'lima puluh', options: ['lima puluh', 'enam puluh', 'tujuh puluh', 'lapan puluh'], answer: 'lima puluh' },
    { type: 'padan', image: '6️⃣0️⃣', imageText: 'enam puluh', options: ['enam puluh', 'tujuh puluh', 'lapan puluh', 'sembilan puluh'], answer: 'enam puluh' },
    { type: 'padan', image: '7️⃣0️⃣', imageText: 'tujuh puluh', options: ['tujuh puluh', 'lapan puluh', 'sembilan puluh', 'seratus'], answer: 'tujuh puluh' },
    { type: 'padan', image: '8️⃣0️⃣', imageText: 'lapan puluh', options: ['lapan puluh', 'sembilan puluh', 'seratus', 'sepuluh'], answer: 'lapan puluh' },
    { type: 'padan', image: '9️⃣0️⃣', imageText: 'sembilan puluh', options: ['sembilan puluh', 'seratus', 'sepuluh', 'dua puluh'], answer: 'sembilan puluh' },
    { type: 'padan', image: '💯', imageText: 'seratus', options: ['seratus', 'sepuluh', 'dua puluh', 'tiga puluh'], answer: 'seratus' }
  ],`;

code = code.replace(`    { type: 'padan', image: '🔟', imageText: 'sepuluh', options: ['sepuluh', 'sifar', 'satu', 'dua'], answer: 'sepuluh' }
  ],`, newData);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('Done.');
