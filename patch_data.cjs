const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const newData = `        var moduleContentData = {
            'bilang_0_10': {
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
                ],
                audioFront: (item) => item.front,
                audioBack: (item) => item.front
            },
            'konsep_tambah': {
                flashcards: [
                    {front: '1 + 1', back: '2', icon: '🍪 + 🍪'},
                    {front: '2 + 1', back: '3', icon: '🍪🍪 + 🍪'},
                    {front: '3 + 2', back: '5', icon: '🍪🍪🍪 + 🍪🍪'},
                    {front: '4 + 2', back: '6', icon: '🍪🍪🍪🍪 + 🍪🍪'},
                    {front: '5 + 3', back: '8', icon: '🍪🍪🍪🍪🍪 + 🍪🍪🍪'},
                    {front: '5 + 5', back: '10', icon: '🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪'}
                ],
                audioFront: (item) => item.front.replace('+', 'tambah'),
                audioBack: (item) => item.back
            },
            'konsep_penolakan': {
                flashcards: [
                    {front: '2 - 1', back: '1', icon: '🍪🍪 - 🍪'},
                    {front: '3 - 2', back: '1', icon: '🍪🍪🍪 - 🍪🍪'},
                    {front: '5 - 3', back: '2', icon: '🍪🍪🍪🍪🍪 - 🍪🍪🍪'},
                    {front: '7 - 2', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪'},
                    {front: '10 - 5', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 - 🍪🍪🍪🍪🍪'}
                ],
                audioFront: (item) => item.front.replace('-', 'tolak'),
                audioBack: (item) => item.back
            },`;

code = code.replace(`        var moduleContentData = {`, newData);
fs.writeFileSync('public/app-logic.js', code);
console.log('Done.');
