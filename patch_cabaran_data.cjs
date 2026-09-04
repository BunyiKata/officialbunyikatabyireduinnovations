const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newData = `    { type: 'padan', image: '🔦', imageText: 'obor', options: ['o', 'u', 'e', 'a'], answer: 'o' },
    { type: 'padan', image: '💊', imageText: 'ubat', options: ['u', 'a', 'i', 'o'], answer: 'u' }
  ],
  vokal_konsonan: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'i', options: ['e', 'i', 'a', 'o'], answer: 'i' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' }
  ],
  pengenalan_nombor: [
    { type: 'padan', image: '0️⃣', imageText: 'sifar', options: ['sifar', 'satu', 'dua', 'tiga'], answer: 'sifar' },
    { type: 'padan', image: '1️⃣', imageText: 'satu', options: ['satu', 'dua', 'tiga', 'empat'], answer: 'satu' },
    { type: 'padan', image: '2️⃣', imageText: 'dua', options: ['dua', 'tiga', 'empat', 'lima'], answer: 'dua' },
    { type: 'padan', image: '3️⃣', imageText: 'tiga', options: ['tiga', 'empat', 'lima', 'enam'], answer: 'tiga' },
    { type: 'padan', image: '4️⃣', imageText: 'empat', options: ['empat', 'lima', 'enam', 'tujuh'], answer: 'empat' },
    { type: 'padan', image: '5️⃣', imageText: 'lima', options: ['lima', 'enam', 'tujuh', 'lapan'], answer: 'lima' },
    { type: 'padan', image: '6️⃣', imageText: 'enam', options: ['enam', 'tujuh', 'lapan', 'sembilan'], answer: 'enam' },
    { type: 'padan', image: '7️⃣', imageText: 'tujuh', options: ['tujuh', 'lapan', 'sembilan', 'sepuluh'], answer: 'tujuh' },
    { type: 'padan', image: '8️⃣', imageText: 'lapan', options: ['lapan', 'sembilan', 'sepuluh', 'sifar'], answer: 'lapan' },
    { type: 'padan', image: '9️⃣', imageText: 'sembilan', options: ['sembilan', 'sepuluh', 'sifar', 'satu'], answer: 'sembilan' },
    { type: 'padan', image: '🔟', imageText: 'sepuluh', options: ['sepuluh', 'sifar', 'satu', 'dua'], answer: 'sepuluh' }
  ],
  konsep_tambah: [
    { type: 'padan', image: '🍪 + 🍪', imageText: '1 tambah 1', options: ['1', '2', '3', '4'], answer: '2' },
    { type: 'padan', image: '🍪🍪 + 🍪', imageText: '2 tambah 1', options: ['2', '3', '4', '5'], answer: '3' },
    { type: 'padan', image: '🍪🍪🍪 + 🍪🍪', imageText: '3 tambah 2', options: ['4', '5', '6', '7'], answer: '5' },
    { type: 'padan', image: '🍪🍪🍪🍪 + 🍪🍪', imageText: '4 tambah 2', options: ['5', '6', '7', '8'], answer: '6' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪 + 🍪🍪🍪', imageText: '5 tambah 3', options: ['7', '8', '9', '10'], answer: '8' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪', imageText: '5 tambah 5', options: ['8', '9', '10', '11'], answer: '10' }
  ],
  konsep_penolakan: [
    { type: 'padan', image: '🍪🍪 - 🍪', imageText: '2 tolak 1', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪 - 🍪🍪', imageText: '3 tolak 2', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪 - 🍪🍪🍪', imageText: '5 tolak 3', options: ['1', '2', '3', '4'], answer: '2' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪', imageText: '7 tolak 2', options: ['4', '5', '6', '7'], answer: '5' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪🍪🍪🍪', imageText: '10 tolak 5', options: ['4', '5', '6', '7'], answer: '5' }
  ]
};`;

code = code.replace(/    \{ type: 'padan', image: '🔦'[\s\S]*?\};\n/, newData + '\n');
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('Done.');
