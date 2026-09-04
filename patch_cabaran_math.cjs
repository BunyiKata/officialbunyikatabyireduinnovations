const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const oldCabaran = `  konsep_penolakan: [
    { type: 'padan', image: '🍪🍪 - 🍪', imageText: '2 tolak 1', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪 - 🍪🍪', imageText: '3 tolak 2', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪 - 🍪🍪🍪', imageText: '5 tolak 3', options: ['1', '2', '3', '4'], answer: '2' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪', imageText: '7 tolak 2', options: ['4', '5', '6', '7'], answer: '5' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪🍪🍪🍪', imageText: '10 tolak 5', options: ['4', '5', '6', '7'], answer: '5' }
  ]`;

const newCabaran = `  konsep_penolakan: [
    { type: 'padan', image: '🍪🍪 − 🍪', imageText: '2 tolak 1', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪 − 🍪🍪', imageText: '3 tolak 2', options: ['0', '1', '2', '3'], answer: '1' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪 − 🍪🍪🍪', imageText: '5 tolak 3', options: ['1', '2', '3', '4'], answer: '2' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪', imageText: '7 tolak 2', options: ['4', '5', '6', '7'], answer: '5' },
    { type: 'padan', image: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪🍪🍪🍪', imageText: '10 tolak 5', options: ['4', '5', '6', '7'], answer: '5' }
  ]`;

code = code.replace(oldCabaran, newCabaran);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log('patched cabaran math');
