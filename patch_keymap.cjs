const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldMap = `    const flashcardKeyMap = {
        'kv': 'suku_kata_kv',
        'kvkv': 'suku_kata_kv_kv',
        'v_kv': 'suku_kata_v_kv',
        'kvkvkv': 'suku_kata_kv_kv_kv',
        'kvk': 'suku_kata_kvk',
        'v_kvk': 'suku_kata_v_kvk'
    };`;
    
const newMap = `    const flashcardKeyMap = {
        'kv': 'suku_kata_kv',
        'kvkv': 'suku_kata_kv_kv',
        'v_kv': 'suku_kata_v_kv',
        'kvkvkv': 'suku_kata_kv_kv_kv',
        'kvk': 'suku_kata_kvk',
        'v_kvk': 'suku_kata_v_kvk',
        'kv_kvk': 'suku_kata_kv_kvk',
        'kvk_kv': 'suku_kata_kvk_kv',
        'kvk_kvk': 'suku_kata_kvk_kvk',
        'kvkk': 'suku_kata_kvkk',
        'kv_kv_kvk': 'suku_kata_kv_kv_kvk',
        'kvk_kv_kvk': 'suku_kata_kvk_kv_kvk'
    };`;

if (code.includes(oldMap)) {
    code = code.replace(oldMap, newMap);
    fs.writeFileSync('public/app-logic.js', code);
    console.log("Patched flashcardKeyMap");
} else {
    console.log("Could not find flashcardKeyMap");
}
