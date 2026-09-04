const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf8');

const oldFuncReg = /window\.checkMalayWordMatch\s*=\s*function[\s\S]*?\};/;

const newFunc = `window.checkMalayWordMatch = function(candidateTranscripts, target) {
    if (!target || !candidateTranscripts || candidateTranscripts.length === 0) return false;

    const targetStr = typeof target === 'object' ? (target.word || target.front || '') : target;
    const cleanTarget = targetStr.toString().toLowerCase().replace(/[\s\-_.,!?'`’]+/g, '').trim();
    if (!cleanTarget) return false;

    function normalizeSTTPhonetic(str) {
        if (!str) return '';
        let s = str.toLowerCase().trim();
        s = s.replace(/[\s\-_.,!?'`’]+/g, '');
        // STT phonetic mapping for Malay speech recognition without altering core vowels
        s = s.replace(/oo/g, 'u').replace(/uu/g, 'u');
        s = s.replace(/ee/g, 'i').replace(/ii/g, 'i');
        s = s.replace(/aa/g, 'a');
        s = s.replace(/ow/g, 'o');
        s = s.replace(/ch/g, 'c');
        if (s.length > 3 && s.endsWith('h')) {
            s = s.slice(0, -1);
        }
        return s;
    }

    const normTarget = normalizeSTTPhonetic(cleanTarget);
    if (!normTarget) return false;

    for (const rawCandidate of candidateTranscripts) {
        if (!rawCandidate) continue;

        // 1. Direct full candidate normalized check
        const normCand = normalizeSTTPhonetic(rawCandidate);
        if (normCand === normTarget) {
            return true;
        }

        // 2. Tokenize into individual words
        const rawWords = rawCandidate.toLowerCase().replace(/[\-_.,!?'`’]+/g, ' ').split(/\s+/).filter(w => w.length > 0);

        for (const w of rawWords) {
            const normW = normalizeSTTPhonetic(w);
            if (normW === normTarget) {
                return true;
            }
        }

        // 3. Check all words joined together (e.g. "pa ku" -> "paku", "bo la" -> "bola")
        const joinedNorm = rawWords.map(normalizeSTTPhonetic).join('');
        if (joinedNorm === normTarget) {
            return true;
        }

        // 4. Check sub-phrases of adjacent words (e.g. "sebut pa ku" -> "paku")
        if (rawWords.length > 1) {
            for (let i = 0; i < rawWords.length - 1; i++) {
                const subJoined = normalizeSTTPhonetic(rawWords[i] + rawWords[i + 1]);
                if (subJoined === normTarget) {
                    return true;
                }
            }
        }
    }

    return false;
};`;

logic = logic.replace(oldFuncReg, newFunc);
fs.writeFileSync('public/app-logic.js', logic);
console.log("Replaced checkMalayWordMatch successfully!");
