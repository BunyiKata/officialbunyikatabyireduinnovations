const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `    // Set words based on kemahiran
    const wordsMap = {
        'kv': ["baju", "buku", "bola", "mata", "meja", "pasu", "sudu", "gigi", "jari", "kaki", "paku", "roti", "topi", "susu", "labu", "dadu", "satu", "tiga", "lima", "laci", "guli", "pipi", "dagu", "cuti", "cili"],
        'kvkv': ["baju", "buku", "bola", "mata", "meja", "pasu", "sudu", "gigi", "jari", "kaki", "paku", "roti", "topi", "susu", "labu", "dadu", "satu", "tiga", "lima", "laci", "guli", "pipi", "dagu", "cuti", "cili"],
        'v_kv': ["abu", "api", "ubi", "ibu", "isi", "ikan", "ayam", "ular", "awan", "ulat", "itik", "emak", "ekor", "oren", "otak", "obor", "epal", "emas", "enam"],
        'kvkvkv': ["kamera", "kereta", "menara", "kucing", "burung", "pisang", "jagung", "payung", "loceng", "sotong", "butang", "padang", "kacang", "gunting", "kambing"],
        'kvk': ["beg", "bot", "bas", "cat", "jam", "jus", "kek", "zip", "kad", "mop", "pen", "pin", "tin", "van", "gam", "gol", "jet", "sos"],
        'v_kvk': ["adik", "ekor", "ikan", "ular", "otak", "awan", "emas", "epal", "ubat", "emak", "ulat", "itik", "oren"]
    };
    
    window.arSukuKataWords = wordsMap[kemahiran] || wordsMap['kv'];`;

const replacement = `    // Map kemahiran to flashcard keys
    const flashcardKeyMap = {
        'kv': 'suku_kata_kv',
        'kvkv': 'suku_kata_kv_kv',
        'v_kv': 'suku_kata_v_kv',
        'kvkvkv': 'suku_kata_kv_kv_kv',
        'kvk': 'suku_kata_kvk',
        'v_kvk': 'suku_kata_v_kvk'
    };
    
    const fcKey = flashcardKeyMap[kemahiran] || 'suku_kata_kv';
    const fcData = window.flashcardData && window.flashcardData[fcKey] ? window.flashcardData[fcKey].flashcards : [];
    
    if (fcData && fcData.length > 0) {
        window.arSukuKataWords = fcData.map(item => item.back.toLowerCase()); // Use lowercase for speech rec
    } else {
        window.arSukuKataWords = ["baju", "buku", "bola"]; // Fallback
    }
`;

code = code.replace(target, replacement);

fs.writeFileSync('public/app-logic.js', code);
