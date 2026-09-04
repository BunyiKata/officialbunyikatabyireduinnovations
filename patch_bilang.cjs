const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldBilang = `            'bilang_0_10': {
                flashcards: [
                    {front: 'sifar', back: '0', icon: '0️⃣'},
                    {front: 'satu', back: '1', icon: '🍪'},
                    {front: 'dua', back: '2', icon: '🍪🍪'},
                    {front: 'tiga', back: '3', icon: '🍪🍪🍪'},
                    {front: 'empat', back: '4', icon: '🍪🍪🍪🍪'},
                    {front: 'lima', back: '5', icon: '🍪🍪🍪🍪🍪'},
                    {front: 'enam', back: '6', icon: '🍪🍪🍪🍪🍪🍪'},
                    {front: 'tujuh', back: '7', icon: '🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'lapan', back: '8', icon: '🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'sembilan', back: '9', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'sepuluh', back: '10', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'}
                ],
                audioFront: (item) => item.front,
                audioBack: (item) => item.front
            },
            'bilang_siri_nombor': {
                flashcards: [
                    {front: 'sepuluh', back: '10', icon: '1️⃣0️⃣'},
                    {front: 'dua puluh', back: '20', icon: '2️⃣0️⃣'},
                    {front: 'tiga puluh', back: '30', icon: '3️⃣0️⃣'},
                    {front: 'empat puluh', back: '40', icon: '4️⃣0️⃣'},
                    {front: 'lima puluh', back: '50', icon: '5️⃣0️⃣'},
                    {front: 'enam puluh', back: '60', icon: '6️⃣0️⃣'},
                    {front: 'tujuh puluh', back: '70', icon: '7️⃣0️⃣'},
                    {front: 'lapan puluh', back: '80', icon: '8️⃣0️⃣'},
                    {front: 'sembilan puluh', back: '90', icon: '9️⃣0️⃣'},
                    {front: 'seratus', back: '100', icon: '💯'}
                ],`;

const newBilang = `            'bilang_0_10': {
                flashcards: [
                    {front: 'si - far', back: '0', icon: '0️⃣'},
                    {front: 'sa - tu', back: '1', icon: '🍪'},
                    {front: 'du - a', back: '2', icon: '🍪🍪'},
                    {front: 'ti - ga', back: '3', icon: '🍪🍪🍪'},
                    {front: 'em - pat', back: '4', icon: '🍪🍪🍪🍪'},
                    {front: 'li - ma', back: '5', icon: '🍪🍪🍪🍪🍪'},
                    {front: 'e - nam', back: '6', icon: '🍪🍪🍪🍪🍪🍪'},
                    {front: 'tu - juh', back: '7', icon: '🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'la - pan', back: '8', icon: '🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'sem - bi - lan', back: '9', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪'},
                    {front: 'se - pu - luh', back: '10', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'}
                ],
                audioFront: (item) => item.front.replace(/-/g, ''),
                audioBack: (item) => item.front.replace(/-/g, '')
            },
            'bilang_siri_nombor': {
                flashcards: [
                    {front: 'se - pu - luh', back: '10', icon: '1️⃣0️⃣'},
                    {front: 'du - a | pu - luh', back: '20', icon: '2️⃣0️⃣'},
                    {front: 'ti - ga | pu - luh', back: '30', icon: '3️⃣0️⃣'},
                    {front: 'em - pat | pu - luh', back: '40', icon: '4️⃣0️⃣'},
                    {front: 'li - ma | pu - luh', back: '50', icon: '5️⃣0️⃣'},
                    {front: 'e - nam | pu - luh', back: '60', icon: '6️⃣0️⃣'},
                    {front: 'tu - juh | pu - luh', back: '70', icon: '7️⃣0️⃣'},
                    {front: 'la - pan | pu - luh', back: '80', icon: '8️⃣0️⃣'},
                    {front: 'sem - bi - lan | pu - luh', back: '90', icon: '9️⃣0️⃣'},
                    {front: 'se - ra - tus', back: '100', icon: '💯'}
                ],`;

code = code.replace(oldBilang, newBilang);

// Need to also replace `audioFront` and `audioBack` for `bilang_siri_nombor` 
const oldBilangSiriEnd = `                audioFront: (item) => item.front,
                audioBack: (item) => item.front
            },
            'konsep_tambah': {`;

const newBilangSiriEnd = `                audioFront: (item) => item.front.replace(/[-|]/g, ''),
                audioBack: (item) => item.front.replace(/[-|]/g, '')
            },
            'konsep_tambah': {`;
code = code.replace(oldBilangSiriEnd, newBilangSiriEnd);

fs.writeFileSync('public/app-logic.js', code);
console.log('patched bilang data');
