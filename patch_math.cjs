const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldMath = `            'konsep_penolakan': {
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

const newMath = `            'konsep_penolakan': {
                flashcards: [
                    {front: '2 − 1', back: '1', icon: '🍪🍪 − 🍪'},
                    {front: '3 − 2', back: '1', icon: '🍪🍪🍪 − 🍪🍪'},
                    {front: '5 − 3', back: '2', icon: '🍪🍪🍪🍪🍪 − 🍪🍪🍪'},
                    {front: '7 − 2', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪'},
                    {front: '10 − 5', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪🍪🍪🍪'}
                ],
                audioFront: (item) => item.front.replace('−', 'tolak'),
                audioBack: (item) => item.back
            },`;

code = code.replace(oldMath, newMath);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched math');
