const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexTambah = /'konsep_tambah': \{[\s\S]*?flashcards: \[[\s\S]*?\],/m;
const newTambah = `'konsep_tambah': {
                flashcards: [
                    {front: '0 + 0', back: '0', icon: '0️⃣'},
                    {front: '0 + 1', back: '1', icon: '🍪'},
                    {front: '1 + 1', back: '2', icon: '🍪🍪'},
                    {front: '1 + 2', back: '3', icon: '🍪🍪🍪'},
                    {front: '1 + 3', back: '4', icon: '🍪🍪🍪🍪'},
                    {front: '1 + 4', back: '5', icon: '🍪🍪🍪🍪🍪'},
                    {front: '1 + 5', back: '6', icon: '🍪🍪🍪🍪🍪🍪'},
                    {front: '1 + 6', back: '7', icon: '🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '1 + 7', back: '8', icon: '🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '1 + 8', back: '9', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '1 + 9', back: '10', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'}
                ],`;

code = code.replace(regexTambah, newTambah);

const regexTolak = /'konsep_penolakan': \{[\s\S]*?flashcards: \[[\s\S]*?\],/m;
const newTolak = `'konsep_penolakan': {
                flashcards: [
                    {front: '10 − 0', back: '10', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '10 − 1', back: '9', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '10 − 2', back: '8', icon: '🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '10 − 3', back: '7', icon: '🍪🍪🍪🍪🍪🍪🍪'},
                    {front: '10 − 4', back: '6', icon: '🍪🍪🍪🍪🍪🍪'},
                    {front: '10 − 5', back: '5', icon: '🍪🍪🍪🍪🍪'},
                    {front: '10 − 6', back: '4', icon: '🍪🍪🍪🍪'},
                    {front: '10 − 7', back: '3', icon: '🍪🍪🍪'},
                    {front: '10 − 8', back: '2', icon: '🍪🍪'},
                    {front: '10 − 9', back: '1', icon: '🍪'},
                    {front: '10 − 10', back: '0', icon: '0️⃣'}
                ],`;
                
code = code.replace(regexTolak, newTolak);

fs.writeFileSync('public/app-logic.js', code);
console.log('patched tambah tolak');
