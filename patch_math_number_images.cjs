const fs = require('fs');
const path = require('path');

const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
let appLogic = fs.readFileSync(appLogicPath, 'utf8');

const mathOld = `            'konsep_tambah': {
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
                ],
                audioFront: (item) => item.front.replace('+', 'tambah'),
                audioBack: (item) => item.back
            },
            'konsep_penolakan': {
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
                ],
                audioFront: (item) => item.front.replace('−', 'tolak'),
                audioBack: (item) => item.back
            },`;

const mathNew = `            'konsep_tambah': {
                flashcards: [
                    {front: '0 + 0', back: '0', icon: '0️⃣'},
                    {front: '0 + 1', back: '1', icon: '<img src="/images/nombor/satu.png" class="sk-icon-img nombor-img" alt="1"/>'},
                    {front: '1 + 1', back: '2', icon: '<img src="/images/nombor/dua.png" class="sk-icon-img nombor-img" alt="2"/>'},
                    {front: '1 + 2', back: '3', icon: '<img src="/images/nombor/tiga.png" class="sk-icon-img nombor-img" alt="3"/>'},
                    {front: '1 + 3', back: '4', icon: '<img src="/images/nombor/empat.png" class="sk-icon-img nombor-img" alt="4"/>'},
                    {front: '1 + 4', back: '5', icon: '<img src="/images/nombor/lima.png" class="sk-icon-img nombor-img" alt="5"/>'},
                    {front: '1 + 5', back: '6', icon: '<img src="/images/nombor/enam.png" class="sk-icon-img nombor-img" alt="6"/>'},
                    {front: '1 + 6', back: '7', icon: '<img src="/images/nombor/tujuh.png" class="sk-icon-img nombor-img" alt="7"/>'},
                    {front: '1 + 7', back: '8', icon: '<img src="/images/nombor/lapan.png" class="sk-icon-img nombor-img" alt="8"/>'},
                    {front: '1 + 8', back: '9', icon: '<img src="/images/nombor/sembilan.png" class="sk-icon-img nombor-img" alt="9"/>'},
                    {front: '1 + 9', back: '10', icon: '<img src="/images/nombor/sepuluh.png" class="sk-icon-img nombor-img" alt="10"/>'}
                ],
                audioFront: (item) => item.front.replace('+', 'tambah'),
                audioBack: (item) => item.back
            },
            'konsep_penolakan': {
                flashcards: [
                    {front: '10 − 0', back: '10', icon: '<img src="/images/nombor/sepuluh.png" class="sk-icon-img nombor-img" alt="10"/>'},
                    {front: '10 − 1', back: '9', icon: '<img src="/images/nombor/sembilan.png" class="sk-icon-img nombor-img" alt="9"/>'},
                    {front: '10 − 2', back: '8', icon: '<img src="/images/nombor/lapan.png" class="sk-icon-img nombor-img" alt="8"/>'},
                    {front: '10 − 3', back: '7', icon: '<img src="/images/nombor/tujuh.png" class="sk-icon-img nombor-img" alt="7"/>'},
                    {front: '10 − 4', back: '6', icon: '<img src="/images/nombor/enam.png" class="sk-icon-img nombor-img" alt="6"/>'},
                    {front: '10 − 5', back: '5', icon: '<img src="/images/nombor/lima.png" class="sk-icon-img nombor-img" alt="5"/>'},
                    {front: '10 − 6', back: '4', icon: '<img src="/images/nombor/empat.png" class="sk-icon-img nombor-img" alt="4"/>'},
                    {front: '10 − 7', back: '3', icon: '<img src="/images/nombor/tiga.png" class="sk-icon-img nombor-img" alt="3"/>'},
                    {front: '10 − 8', back: '2', icon: '<img src="/images/nombor/dua.png" class="sk-icon-img nombor-img" alt="2"/>'},
                    {front: '10 − 9', back: '1', icon: '<img src="/images/nombor/satu.png" class="sk-icon-img nombor-img" alt="1"/>'},
                    {front: '10 − 10', back: '0', icon: '0️⃣'}
                ],
                audioFront: (item) => item.front.replace('−', 'tolak'),
                audioBack: (item) => item.back
            },`;

if (appLogic.includes(mathOld)) {
  appLogic = appLogic.replace(mathOld, mathNew);
  fs.writeFileSync(appLogicPath, appLogic, 'utf8');
  console.log('✅ konsep_tambah and konsep_penolakan flashcard images updated to number images!');
} else {
  console.log('⚠️ Could not match mathOld pattern in app-logic.js');
}
