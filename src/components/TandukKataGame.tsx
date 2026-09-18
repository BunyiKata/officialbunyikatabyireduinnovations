import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { getCoreAudioContext } from '../utils/coreAudio';

const WORD_DATABASE: Record<string, { word: string; syllables: string[]; emoji: string }[]> = {
    'KV': [
        { word: 'ba', syllables: ['ba'], emoji: '🔊' },
        { word: 'be', syllables: ['be'], emoji: '🔊' },
        { word: 'bi', syllables: ['bi'], emoji: '🔊' },
        { word: 'bo', syllables: ['bo'], emoji: '🔊' },
        { word: 'bu', syllables: ['bu'], emoji: '🔊' },
        { word: 'ca', syllables: ['ca'], emoji: '🔊' },
        { word: 'ce', syllables: ['ce'], emoji: '🔊' },
        { word: 'ci', syllables: ['ci'], emoji: '🔊' },
        { word: 'co', syllables: ['co'], emoji: '🔊' },
        { word: 'cu', syllables: ['cu'], emoji: '🔊' },
        { word: 'da', syllables: ['da'], emoji: '🔊' },
        { word: 'de', syllables: ['de'], emoji: '🔊' },
        { word: 'di', syllables: ['di'], emoji: '🔊' },
        { word: 'do', syllables: ['do'], emoji: '🔊' },
        { word: 'du', syllables: ['du'], emoji: '🔊' },
        { word: 'fa', syllables: ['fa'], emoji: '🔊' },
        { word: 'fe', syllables: ['fe'], emoji: '🔊' },
        { word: 'fi', syllables: ['fi'], emoji: '🔊' },
        { word: 'fo', syllables: ['fo'], emoji: '🔊' },
        { word: 'fu', syllables: ['fu'], emoji: '🔊' },
        { word: 'ga', syllables: ['ga'], emoji: '🔊' },
        { word: 'ge', syllables: ['ge'], emoji: '🔊' },
        { word: 'gi', syllables: ['gi'], emoji: '🔊' },
        { word: 'go', syllables: ['go'], emoji: '🔊' },
        { word: 'gu', syllables: ['gu'], emoji: '🔊' },
        { word: 'ha', syllables: ['ha'], emoji: '🔊' },
        { word: 'he', syllables: ['he'], emoji: '🔊' },
        { word: 'hi', syllables: ['hi'], emoji: '🔊' },
        { word: 'ho', syllables: ['ho'], emoji: '🔊' },
        { word: 'hu', syllables: ['hu'], emoji: '🔊' },
        { word: 'ja', syllables: ['ja'], emoji: '🔊' },
        { word: 'je', syllables: ['je'], emoji: '🔊' },
        { word: 'ji', syllables: ['ji'], emoji: '🔊' },
        { word: 'jo', syllables: ['jo'], emoji: '🔊' },
        { word: 'ju', syllables: ['ju'], emoji: '🔊' },
        { word: 'ka', syllables: ['ka'], emoji: '🔊' },
        { word: 'ke', syllables: ['ke'], emoji: '🔊' },
        { word: 'ki', syllables: ['ki'], emoji: '🔊' },
        { word: 'ko', syllables: ['ko'], emoji: '🔊' },
        { word: 'ku', syllables: ['ku'], emoji: '🔊' },
        { word: 'la', syllables: ['la'], emoji: '🔊' },
        { word: 'le', syllables: ['le'], emoji: '🔊' },
        { word: 'li', syllables: ['li'], emoji: '🔊' },
        { word: 'lo', syllables: ['lo'], emoji: '🔊' },
        { word: 'lu', syllables: ['lu'], emoji: '🔊' },
        { word: 'ma', syllables: ['ma'], emoji: '🔊' },
        { word: 'me', syllables: ['me'], emoji: '🔊' },
        { word: 'mi', syllables: ['mi'], emoji: '🔊' },
        { word: 'mo', syllables: ['mo'], emoji: '🔊' },
        { word: 'mu', syllables: ['mu'], emoji: '🔊' },
        { word: 'na', syllables: ['na'], emoji: '🔊' },
        { word: 'ne', syllables: ['ne'], emoji: '🔊' },
        { word: 'ni', syllables: ['ni'], emoji: '🔊' },
        { word: 'no', syllables: ['no'], emoji: '🔊' },
        { word: 'nu', syllables: ['nu'], emoji: '🔊' },
        { word: 'pa', syllables: ['pa'], emoji: '🔊' },
        { word: 'pe', syllables: ['pe'], emoji: '🔊' },
        { word: 'pi', syllables: ['pi'], emoji: '🔊' },
        { word: 'po', syllables: ['po'], emoji: '🔊' },
        { word: 'pu', syllables: ['pu'], emoji: '🔊' }
    ],
    'KV + KV': [
        { word: 'beca', syllables: ['be', 'ca'], emoji: '/images/sukukata/beca.png' },
        { word: 'ciku', syllables: ['ci', 'ku'], emoji: '/images/sukukata/ciku.png' },
        { word: 'jari', syllables: ['ja', 'ri'], emoji: '/images/sukukata/jari.png' },
        { word: 'kuku', syllables: ['ku', 'ku'], emoji: '/images/sukukata/kuku.png' },
        { word: 'labu', syllables: ['la', 'bu'], emoji: '/images/sukukata/labu.png' },
        { word: 'lidi', syllables: ['li', 'di'], emoji: '/images/sukukata/lidi.png' },
        { word: 'mata', syllables: ['ma', 'ta'], emoji: '/images/sukukata/mata.png' },
        { word: 'nasi', syllables: ['na', 'si'], emoji: '/images/sukukata/nasi.png' },
        { word: 'paku', syllables: ['pa', 'ku'], emoji: '/images/sukukata/paku.png' },
        { word: 'raga', syllables: ['ra', 'ga'], emoji: '/images/sukukata/raga.png' },
        { word: 'rusa', syllables: ['ru', 'sa'], emoji: '/images/sukukata/rusa.png' },
        { word: 'sawi', syllables: ['sa', 'wi'], emoji: '/images/sukukata/sawi.png' },
        { word: 'sudu', syllables: ['su', 'du'], emoji: '/images/sukukata/sudu.png' },
        { word: 'tali', syllables: ['ta', 'li'], emoji: '/images/sukukata/tali.png' },
        { word: 'tebu', syllables: ['te', 'bu'], emoji: '/images/sukukata/tebu.png' }
    ],
    'V + KV': [
        { word: 'alu', syllables: ['a', 'lu'], emoji: '/images/sukukata/alu.png' },
        { word: 'api', syllables: ['a', 'pi'], emoji: '/images/sukukata/api.png' },
        { word: 'ibu', syllables: ['i', 'bu'], emoji: '/images/sukukata/ibu.png' },
        { word: 'isi', syllables: ['i', 'si'], emoji: '/images/sukukata/isi.png' },
        { word: 'ubi', syllables: ['u', 'bi'], emoji: '/images/sukukata/ubi.png' },
        { word: 'ulu', syllables: ['u', 'lu'], emoji: '/images/sukukata/ulu.png' }
    ],
    'KV + KV + KV': [
        { word: 'berudu', syllables: ['be', 'ru', 'du'], emoji: '/images/sukukata/berudu.png' },
        { word: 'keladi', syllables: ['ke', 'la', 'di'], emoji: '/images/sukukata/keladi.png' },
        { word: 'kelapa', syllables: ['ke', 'la', 'pa'], emoji: '/images/sukukata/kelapa.png' },
        { word: 'kemeja', syllables: ['ke', 'me', 'ja'], emoji: '/images/sukukata/kemeja.png' },
        { word: 'kereta', syllables: ['ke', 're', 'ta'], emoji: '/images/sukukata/kereta.png' },
        { word: 'kerusi', syllables: ['ke', 'ru', 'si'], emoji: '/images/sukukata/kerusi.png' },
        { word: 'pelita', syllables: ['pe', 'li', 'ta'], emoji: '/images/sukukata/pelita.png' },
        { word: 'perigi', syllables: ['pe', 'ri', 'gi'], emoji: '/images/sukukata/perigi.png' },
        { word: 'petani', syllables: ['pe', 'ta', 'ni'], emoji: '/images/sukukata/petani.png' },
        { word: 'petola', syllables: ['pe', 'to', 'la'], emoji: '/images/sukukata/petola.png' },
        { word: 'semalu', syllables: ['se', 'ma', 'lu'], emoji: '/images/sukukata/semalu.png' },
        { word: 'sepatu', syllables: ['se', 'pa', 'tu'], emoji: '/images/sukukata/sepatu.png' },
        { word: 'tomato', syllables: ['to', 'ma', 'to'], emoji: '/images/sukukata/tomato.png' },
        { word: 'wanita', syllables: ['wa', 'ni', 'ta'], emoji: '/images/sukukata/wanita.png' }
    ],
    'KVK': [
        { word: 'bas', syllables: ['bas'], emoji: '/images/sukukata/bas.png' },
        { word: 'beg', syllables: ['beg'], emoji: '/images/sukukata/beg.png' },
        { word: 'bot', syllables: ['bot'], emoji: '/images/sukukata/bot.png' },
        { word: 'cat', syllables: ['cat'], emoji: '/images/sukukata/cat.png' },
        { word: 'jag', syllables: ['jag'], emoji: '/images/sukukata/jag.png' },
        { word: 'jam', syllables: ['jam'], emoji: '/images/sukukata/jam.png' },
        { word: 'jem', syllables: ['jem'], emoji: '/images/sukukata/jem.png' },
        { word: 'jet', syllables: ['jet'], emoji: '/images/sukukata/jet.png' },
        { word: 'kek', syllables: ['kek'], emoji: '/images/sukukata/kek.png' },
        { word: 'kot', syllables: ['kot'], emoji: '/images/sukukata/kot.png' },
        { word: 'pam', syllables: ['pam'], emoji: '/images/sukukata/pam.png' },
        { word: 'pen', syllables: ['pen'], emoji: '/images/sukukata/pen.png' },
        { word: 'pil', syllables: ['pil'], emoji: '/images/sukukata/pil.png' },
        { word: 'pin', syllables: ['pin'], emoji: '/images/sukukata/pin.png' },
        { word: 'rak', syllables: ['rak'], emoji: '/images/sukukata/rak.png' },
        { word: 'rim', syllables: ['rim'], emoji: '/images/sukukata/rim.png' },
        { word: 'ros', syllables: ['ros'], emoji: '/images/sukukata/ros.png' },
        { word: 'sup', syllables: ['sup'], emoji: '/images/sukukata/sup.png' },
        { word: 'tin', syllables: ['tin'], emoji: '/images/sukukata/tin.png' },
        { word: 'van', syllables: ['van'], emoji: '/images/sukukata/van.png' }
    ],
    'V + KVK': [
        { word: 'ayam', syllables: ['a', 'yam'], emoji: '/images/sukukata/ayam.png' },
        { word: 'enam', syllables: ['e', 'nam'], emoji: '/images/sukukata/enam.png' },
        { word: 'epal', syllables: ['e', 'pal'], emoji: '/images/sukukata/epal.png' },
        { word: 'ikan', syllables: ['i', 'kan'], emoji: '/images/sukukata/ikan.png' },
        { word: 'itik', syllables: ['i', 'tik'], emoji: '/images/sukukata/itik.png' },
        { word: 'obor', syllables: ['o', 'bor'], emoji: '/images/sukukata/obor.png' },
        { word: 'oren', syllables: ['o', 'ren'], emoji: '/images/sukukata/oren.png' },
        { word: 'otak', syllables: ['o', 'tak'], emoji: '/images/sukukata/otak.png' },
        { word: 'ular', syllables: ['u', 'lar'], emoji: '/images/sukukata/ular.png' },
        { word: 'ulat', syllables: ['u', 'lat'], emoji: '/images/sukukata/ulat.png' }
    ],
    'KV + KVK': [
        { word: 'bakul', syllables: ['ba', 'kul'], emoji: '/images/sukukata/bakul.png' },
        { word: 'belon', syllables: ['be', 'lon'], emoji: '/images/sukukata/belon.png' },
        { word: 'beruk', syllables: ['be', 'ruk'], emoji: '/images/sukukata/beruk.png' },
        { word: 'betik', syllables: ['be', 'tik'], emoji: '/images/sukukata/betik.png' },
        { word: 'botol', syllables: ['bo', 'tol'], emoji: '/images/sukukata/botol.png' },
        { word: 'cawan', syllables: ['ca', 'wan'], emoji: '/images/sukukata/cawan.png' },
        { word: 'cerek', syllables: ['ce', 'rek'], emoji: '/images/sukukata/cerek.png' },
        { word: 'gajah', syllables: ['ga', 'jah'], emoji: '/images/sukukata/gajah.png' },
        { word: 'gelas', syllables: ['ge', 'las'], emoji: '/images/sukukata/gelas.png' },
        { word: 'gitar', syllables: ['gi', 'tar'], emoji: '/images/sukukata/gitar.png' },
        { word: 'kapak', syllables: ['ka', 'pak'], emoji: '/images/sukukata/kapak.png' },
        { word: 'kapal', syllables: ['ka', 'pal'], emoji: '/images/sukukata/kapal.png' },
        { word: 'kasut', syllables: ['ka', 'sut'], emoji: '/images/sukukata/kasut.png' },
        { word: 'katil', syllables: ['ka', 'til'], emoji: '/images/sukukata/katil.png' },
        { word: 'ketam', syllables: ['ke', 'tam'], emoji: '/images/sukukata/ketam.png' },
        { word: 'kicap', syllables: ['ki', 'cap'], emoji: '/images/sukukata/kicap.png' },
        { word: 'kilat', syllables: ['ki', 'lat'], emoji: '/images/sukukata/kilat.png' },
        { word: 'kipas', syllables: ['ki', 'pas'], emoji: '/images/sukukata/kipas.png' },
        { word: 'lilin', syllables: ['li', 'lin'], emoji: '/images/sukukata/lilin.png' },
        { word: 'makan', syllables: ['ma', 'kan'], emoji: '/images/sukukata/makan.png' },
        { word: 'marah', syllables: ['ma', 'rah'], emoji: '/images/sukukata/marah.png' },
        { word: 'nanas', syllables: ['na', 'nas'], emoji: '/images/sukukata/nanas.png' },
        { word: 'pagar', syllables: ['pa', 'gar'], emoji: '/images/sukukata/pagar.png' },
        { word: 'sabun', syllables: ['sa', 'bun'], emoji: '/images/sukukata/sabun.png' },
        { word: 'sikat', syllables: ['si', 'kat'], emoji: '/images/sukukata/sikat.png' },
        { word: 'tayar', syllables: ['ta', 'yar'], emoji: '/images/sukukata/tayar.png' }
    ],
    'KVK + KV': [
        { word: 'baldi', syllables: ['bal', 'di'], emoji: '/images/sukukata/baldi.png' },
        { word: 'bendi', syllables: ['ben', 'di'], emoji: '/images/sukukata/bendi.png' },
        { word: 'garpu', syllables: ['gar', 'pu'], emoji: '/images/sukukata/garpu.png' },
        { word: 'jambu', syllables: ['jam', 'bu'], emoji: '/images/sukukata/jambu.png' },
        { word: 'kunci', syllables: ['kun', 'ci'], emoji: '/images/sukukata/kunci.png' },
        { word: 'lampu', syllables: ['lam', 'pu'], emoji: '/images/sukukata/lampu.png' },
        { word: 'lembu', syllables: ['lem', 'bu'], emoji: '/images/sukukata/lembu.png' },
        { word: 'pintu', syllables: ['pin', 'tu'], emoji: '/images/sukukata/pintu.png' }
    ],
    'KVK + KVK': [
        { word: 'biskut', syllables: ['bis', 'kut'], emoji: '/images/sukukata/biskut.png' },
        { word: 'cermin', syllables: ['cer', 'min'], emoji: '/images/sukukata/cermin.png' },
        { word: 'cincin', syllables: ['cin', 'cin'], emoji: '/images/sukukata/cincin.png' },
        { word: 'doktor', syllables: ['dok', 'tor'], emoji: '/images/sukukata/doktor.png' },
        { word: 'mancis', syllables: ['man', 'cis'], emoji: '/images/sukukata/mancis.png' },
        { word: 'masjid', syllables: ['mas', 'jid'], emoji: '/images/sukukata/masjid.png' },
        { word: 'rambut', syllables: ['ram', 'but'], emoji: '/images/sukukata/rambut.png' },
        { word: 'rumput', syllables: ['rum', 'put'], emoji: '/images/sukukata/rumput.png' },
        { word: 'sampah', syllables: ['sam', 'pah'], emoji: '/images/sukukata/sampah.png' },
        { word: 'sampan', syllables: ['sam', 'pan'], emoji: '/images/sukukata/sampan.png' },
        { word: 'tanduk', syllables: ['tan', 'duk'], emoji: '/images/sukukata/tanduk.png' },
        { word: 'tombol', syllables: ['tom', 'bol'], emoji: '/images/sukukata/tombol.png' }
    ],
    'KVKK': [
        { word: 'bank', syllables: ['bank'], emoji: '/images/sukukata/bank.png' },
        { word: 'gong', syllables: ['gong'], emoji: '/images/sukukata/gong.png' },
        { word: 'jong', syllables: ['jong'], emoji: '/images/sukukata/jong.png' },
        { word: 'tong', syllables: ['tong'], emoji: '/images/sukukata/tong.png' },
        { word: 'wang', syllables: ['wang'], emoji: '/images/sukukata/wang.png' },
        { word: 'zink', syllables: ['zink'], emoji: '/images/sukukata/zink.png' }
    ],
    'KV + KV + KVK': [
        { word: 'basikal', syllables: ['ba', 'si', 'kal'], emoji: '/images/sukukata/basikal.png' },
        { word: 'kelawar', syllables: ['ke', 'la', 'war'], emoji: '/images/sukukata/kelawar.png' },
        { word: 'keledek', syllables: ['ke', 'le', 'dek'], emoji: '/images/sukukata/keledek.png' },
        { word: 'ketupat', syllables: ['ke', 'tu', 'pat'], emoji: '/images/sukukata/ketupat.png' },
        { word: 'piramid', syllables: ['pi', 'ra', 'mid'], emoji: '/images/sukukata/piramid.png' },
        { word: 'pulasan', syllables: ['pu', 'la', 'san'], emoji: '/images/sukukata/pulasan.png' },
        { word: 'telefon', syllables: ['te', 'le', 'fon'], emoji: '/images/sukukata/telefon.png' },
        { word: 'tetikus', syllables: ['te', 'ti', 'kus'], emoji: '/images/sukukata/tetikus.png' },
        { word: 'zirafah', syllables: ['zi', 'ra', 'fah'], emoji: '/images/sukukata/zirafah.png' }
    ],
    'KVK + KV + KVK': [
        { word: 'cempedak', syllables: ['cem', 'pe', 'dak'], emoji: '/images/sukukata/cempedak.png' },
        { word: 'cendawan', syllables: ['cen', 'da', 'wan'], emoji: '/images/sukukata/cendawan.png' },
        { word: 'jambatan', syllables: ['jam', 'ba', 'tan'], emoji: '/images/sukukata/jambatan.png' },
        { word: 'komputer', syllables: ['kom', 'pu', 'ter'], emoji: '/images/sukukata/komputer.png' },
        { word: 'pembaris', syllables: ['pem', 'ba', 'ris'], emoji: '/images/sukukata/pembaris.png' },
        { word: 'tempayan', syllables: ['tem', 'pa', 'yan'], emoji: '/images/sukukata/tempayan.png' }
    ]
};

const CATEGORY_TO_MODULE_MAP: Record<string, string> = {
    'KV': 'suku_kata_kv',
    'KV + KV': 'suku_kata_kv_kv',
    'V + KV': 'suku_kata_v_kv',
    'KV + KV + KV': 'suku_kata_kv_kv_kv',
    'KVK': 'suku_kata_kvk',
    'V + KVK': 'suku_kata_v_kvk',
    'KV + KVK': 'suku_kata_kv_kvk',
    'KVK + KV': 'suku_kata_kvk_kv',
    'KVK + KVK': 'suku_kata_kvk_kvk',
    'KVKK': 'suku_kata_kvkk',
    'KV + KV + KVK': 'suku_kata_kv_kv_kvk',
    'KVK + KV + KVK': 'suku_kata_kvk_kv_kvk'
};

function getCategoryWords(category: string) {
    const moduleId = CATEGORY_TO_MODULE_MAP[category];
    let allWords: any[] = [];
    if (moduleId && (window as any).moduleContentData?.[moduleId]?.flashcards) {
        const cards = (window as any).moduleContentData[moduleId].flashcards;
        allWords = cards.map((c: any) => {
            let emojiStr = c.icon || '🔊';
            if (emojiStr.includes('<img')) {
                const matchSrc = emojiStr.match(/src="([^"]+)"/);
                if (matchSrc) emojiStr = matchSrc[1];
            }
            if (c.front.includes('-')) {
                const syllables = c.front.split('-').map((s: string) => s.trim());
                const word = c.back ? c.back.toLowerCase() : syllables.join('');
                return { word, syllables, emoji: emojiStr };
            } else {
                return { word: c.front, syllables: [c.front], emoji: emojiStr };
            }
        });
    } else {
        allWords = WORD_DATABASE[category as keyof typeof WORD_DATABASE] || WORD_DATABASE['KV'];
    }

    if (category && category.toUpperCase() === 'KV') {
        const STORAGE_KEY = 'tanduk_kata_used_kv_words';
        let usedWords: string[] = [];
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) usedWords = JSON.parse(saved);
        } catch (e) {
            console.warn('[TandukKata] Gagal baca senarai perkataan terpakai:', e);
        }

        // Filter pool to pick words not yet learned in the current cycle
        let available = allWords.filter((item: any) => !usedWords.includes(item.word));

        // If remaining pool has fewer than 10 words, reset so all words can be cycled again
        if (available.length < 10) {
            usedWords = [];
            available = [...allWords];
        }

        // Shuffle available words
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, 10);

        // Record newly chosen words in usedWords
        const newUsed = [...usedWords, ...chosen.map((c: any) => c.word)];
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUsed));
        } catch (e) {
            console.warn('[TandukKata] Gagal simpan senarai perkataan terpakai:', e);
        }

        return chosen;
    }

    return allWords;
}

const SYLLABLE_COLORS = ['#1e293b', '#ef4444'];

const CATEGORIES = Object.keys(WORD_DATABASE);
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// Web Audio Synthesizer for Tanduk Kata sound effects
function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const ctx = getCoreAudioContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }
    return ctx;
}

function playJumpSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.16);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    } catch (e) {
        console.warn('Audio jump error:', e);
    }
}

function playWalkStepSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = 220 + Math.random() * 50;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    } catch (e) {
        console.warn('Audio walk step error:', e);
    }
}

function playPopConfettiSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Balloon/cork pop sound
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(650, now);
        popOsc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

        popGain.gain.setValueAtTime(0.45, now);
        popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        popOsc.connect(popGain);
        popGain.connect(ctx.destination);

        popOsc.start(now);
        popOsc.stop(now + 0.09);

        // Cheerful ascending sparkle chime
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();

            chimeOsc.type = 'triangle';
            chimeOsc.frequency.setValueAtTime(freq, now + 0.04 + idx * 0.06);

            chimeGain.gain.setValueAtTime(0, now + 0.04 + idx * 0.06);
            chimeGain.gain.setValueAtTime(0.25, now + 0.04 + idx * 0.06);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28 + idx * 0.06);

            chimeOsc.connect(chimeGain);
            chimeGain.connect(ctx.destination);

            chimeOsc.start(now + 0.04 + idx * 0.06);
            chimeOsc.stop(now + 0.32 + idx * 0.06);
        });
    } catch (e) {
        console.warn('Audio pop confetti error:', e);
    }
}


// ============================================================================
//  IMAGE 2 TILESET COMPONENTS, DETAILED BARRELS & QUESTION BLOCKS
// ============================================================================

/**
 * Detailed Wooden Barrel SVG Component
 * Features realistic wood grain, 4 heavy metal hoops with sheen & rivets,
 * 3D top lid with bung hole, and a fully visible wooden bottom base ("bontot tong").
 */
const DetailedBarrel = ({ width = 60, height = 78 }: { width?: number; height?: number }) => (
    <div style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.65))',
    }}>
        <svg width={width} height={height} viewBox="0 0 60 78" style={{ display: 'block', overflow: 'visible' }}>
            <defs>
                {/* Wood Cask Gradient */}
                <linearGradient id="barrelWoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2c1406" />
                    <stop offset="7%" stopColor="#4f2b12" />
                    <stop offset="18%" stopColor="#78441d" />
                    <stop offset="35%" stopColor="#a3632e" />
                    <stop offset="50%" stopColor="#bf7a3b" />
                    <stop offset="65%" stopColor="#a3632e" />
                    <stop offset="82%" stopColor="#78441d" />
                    <stop offset="93%" stopColor="#4f2b12" />
                    <stop offset="100%" stopColor="#2c1406" />
                </linearGradient>

                {/* Metal Band Gradient */}
                <linearGradient id="metalBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#323538" />
                    <stop offset="15%" stopColor="#757d84" />
                    <stop offset="38%" stopColor="#c5cbd2" />
                    <stop offset="55%" stopColor="#e8edf2" />
                    <stop offset="82%" stopColor="#757d84" />
                    <stop offset="100%" stopColor="#2b2d30" />
                </linearGradient>

                {/* Wooden Lid Gradient */}
                <linearGradient id="barrelLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c28245" />
                    <stop offset="50%" stopColor="#9a5f2a" />
                    <stop offset="100%" stopColor="#633711" />
                </linearGradient>
            </defs>

            {/* Bulging Barrel Staves Body (extends down to y=74 for visible bottom base) */}
            <path
                d="M 7 9 Q 1 42 7 74 L 53 74 Q 59 42 53 9 Z"
                fill="url(#barrelWoodGrad)"
                stroke="#1f0c03"
                strokeWidth="2.5"
            />

            {/* Vertical Wood Plank Seams */}
            <path d="M 16 9 Q 13 42 16 74" stroke="#1f0c03" strokeWidth="1.2" fill="none" opacity="0.65" />
            <path d="M 26 9 Q 25 42 26 74" stroke="#1f0c03" strokeWidth="1.2" fill="none" opacity="0.5" />
            <path d="M 36 9 Q 37 42 36 74" stroke="#1f0c03" strokeWidth="1.2" fill="none" opacity="0.5" />
            <path d="M 46 9 Q 49 42 46 74" stroke="#1f0c03" strokeWidth="1.2" fill="none" opacity="0.65" />

            {/* Wood Grain Specular Highlights */}
            <path d="M 28 11 Q 27 42 28 72" stroke="#df9b58" strokeWidth="2" fill="none" opacity="0.4" />

            {/* Visible Bottom Wooden Base Rim (Bontot Tong) */}
            <path
                d="M 7 72 Q 30 77 53 72 L 53 75 Q 30 78 7 75 Z"
                fill="#3a1d08"
                stroke="#1a0b02"
                strokeWidth="1"
            />

            {/* 4 Heavy Steel Hoops */}
            {/* Top Hoop */}
            <path d="M 5 15 Q 30 19 55 15 L 55 21 Q 30 25 5 21 Z" fill="url(#metalBandGrad)" stroke="#1a1d20" strokeWidth="0.8" />
            {/* Upper-Mid Hoop */}
            <path d="M 2 30 Q 30 34 58 30 L 58 36 Q 30 40 2 36 Z" fill="url(#metalBandGrad)" stroke="#1a1d20" strokeWidth="0.8" />
            {/* Lower-Mid Hoop */}
            <path d="M 2 46 Q 30 50 58 46 L 58 52 Q 30 56 2 52 Z" fill="url(#metalBandGrad)" stroke="#1a1d20" strokeWidth="0.8" />
            {/* Bottom Hoop (Leaves ~8px of visible wooden staves and base rim below it) */}
            <path d="M 5 60 Q 30 64 55 60 L 55 66 Q 30 70 5 66 Z" fill="url(#metalBandGrad)" stroke="#1a1d20" strokeWidth="0.8" />

            {/* Rivets / Bolts on Metal Bands */}
            <circle cx="12" cy="18" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="48" cy="18" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="9" cy="33" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="51" cy="33" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="9" cy="49" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="51" cy="49" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="12" cy="63" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />
            <circle cx="48" cy="63" r="1.6" fill="#f0f4f8" stroke="#1a1d20" strokeWidth="0.6" />

            {/* 3D Top Wooden Lid */}
            <ellipse cx="30" cy="9" rx="23" ry="7" fill="url(#barrelLidGrad)" stroke="#2c1406" strokeWidth="2.5" />
            <ellipse cx="30" cy="8.5" rx="20" ry="5" fill="none" stroke="#e09e5c" strokeWidth="1" opacity="0.6" />
            {/* Bung / Cork Hole in center of lid */}
            <ellipse cx="30" cy="9" rx="3.5" ry="2" fill="#241105" stroke="#120802" strokeWidth="0.8" />
        </svg>
    </div>
);

/**
 * Mystery Question Block Component
 * Features smooth organic rounded corners, radiant golden 3D gradient,
 * corner rivets, soft ivory inner panel, glass reflection gleam, and bold 3D question mark.
 */
const QuestionBlock = ({ size = 90 }: { size?: number }) => (
    <div style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35))',
    }}>
        {/* Outer Radiant Golden 3D Block */}
        <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #ffd438 0%, #ff9e1b 48%, #e67300 100%)',
            border: '3.5px solid #5c2400',
            boxShadow: '0 8px 0 #943d00, inset 0 3px 0 rgba(255,255,255,0.7)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '8px',
        }}>
            {/* 4 Corner Rivets / Studs */}
            <div style={{ position: 'absolute', top: '7px', left: '7px', width: '5px', height: '5px', borderRadius: '50%', background: '#5c2400', opacity: 0.55 }} />
            <div style={{ position: 'absolute', top: '7px', right: '7px', width: '5px', height: '5px', borderRadius: '50%', background: '#5c2400', opacity: 0.55 }} />
            <div style={{ position: 'absolute', bottom: '7px', left: '7px', width: '5px', height: '5px', borderRadius: '50%', background: '#5c2400', opacity: 0.55 }} />
            <div style={{ position: 'absolute', bottom: '7px', right: '7px', width: '5px', height: '5px', borderRadius: '50%', background: '#5c2400', opacity: 0.55 }} />

            {/* Inner Pearlescent Ivory Panel with Smooth Corners */}
            <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                background: 'linear-gradient(180deg, #ffffff 0%, #fffdf5 45%, #fed7aa 100%)',
                border: '2px solid rgba(217, 119, 6, 0.45)',
                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Top-Left Gloss Reflection Gleam */}
                <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '-18px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Bold 3D Sunset Orange Question Mark */}
                <span style={{
                    fontFamily: '"Century Gothic", "Apple Gothic", "Comic Sans MS", sans-serif',
                    fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: '#ea580c',
                    textShadow: '0 3px 0 #9a3412, 0 5px 10px rgba(154,52,18,0.35)',
                    userSelect: 'none',
                    transform: 'translateY(-1px)',
                }}>
                    ?
                </span>
            </div>
        </div>
    </div>
);

/**
 * Modular Platform Block matching Image 2 Tileset
 * Renders chocolate brown segmented dirt with horizontal strata, dark borders, and scalloped lush grass canopy.
 */
const PlatformBlock = ({ width, height = 48 }: { width: number; height?: number }) => {
    const tileCount = Math.max(2, Math.round(width / 60));
    const actualTileW = width / tileCount;

    return (
        <div style={{
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.55))',
        }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
                {/* Chocolate Dirt Base with rounded bottom corners */}
                <path
                    d={`M 0 10 L ${width} 10 L ${width} ${height - 8} Q ${width} ${height} ${width - 8} ${height} L 8 ${height} Q 0 ${height} 0 ${height - 8} Z`}
                    fill="#462310"
                    stroke="#281206"
                    strokeWidth="3"
                />

                {/* Vertical Tile Seams separating modular blocks */}
                {[...Array(tileCount - 1)].map((_, i) => {
                    const sx = (i + 1) * actualTileW;
                    return (
                        <line
                            key={i}
                            x1={sx}
                            y1={12}
                            x2={sx}
                            y2={height}
                            stroke="#281206"
                            strokeWidth="2.5"
                        />
                    );
                })}

                {/* Dirt Strata 1 (Top Wave) */}
                <path
                    d={`M 0 ${height * 0.44} Q ${width * 0.25} ${height * 0.36} ${width * 0.5} ${height * 0.45} T ${width} ${height * 0.41} L ${width} ${height * 0.57} Q ${width * 0.75} ${height * 0.65} ${width * 0.5} ${height * 0.57} T 0 ${height * 0.61} Z`}
                    fill="#301507"
                />

                {/* Dirt Strata 2 (Bottom Wave) */}
                <path
                    d={`M 0 ${height * 0.74} Q ${width * 0.25} ${height * 0.68} ${width * 0.5} ${height * 0.77} T ${width} ${height * 0.71} L ${width} ${height * 0.88} Q ${width * 0.75} ${height * 0.94} ${width * 0.5} ${height * 0.88} T 0 ${height * 0.91} Z`}
                    fill="#261004"
                />

                {/* Scalloped Green Grass Canopy across Platform Top */}
                <path
                    d={`M -2 10 Q -2 0 8 0 L ${width - 8} 0 Q ${width + 2} 0 ${width + 2} 10 ` +
                        [...Array(tileCount)].map((_, i) => {
                            const x0 = i * actualTileW;
                            const x1 = x0 + actualTileW * 0.33;
                            const x2 = x0 + actualTileW * 0.66;
                            const x3 = (i + 1) * actualTileW;
                            return `L ${x3} 12 Q ${x2} 23 ${x1} 13 Q ${x0} 23 ${x0} 12`;
                        }).reverse().join(' ') +
                        ` Z`
                    }
                    fill="#74ba35"
                    stroke="#274f0c"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />

                {/* Top Grass Vibrant Highlight */}
                <path
                    d={`M 2 3 L ${width - 2} 3 ` +
                        [...Array(tileCount)].map((_, i) => {
                            const x0 = i * actualTileW;
                            const x1 = x0 + actualTileW * 0.5;
                            return `Q ${x1} 8.5 ${x0} 3`;
                        }).reverse().join(' ') +
                        ` Z`
                    }
                    fill="#9de44a"
                    opacity="0.9"
                />
            </svg>
        </div>
    );
};

/**
 * Level Generator with Naik / Turun Platforming Rhythms & Clean Spacing
 */
interface LevelData {
    items: any[];
    platforms: { id: string; x: number; y: number; width: number; height: number }[];
    barrels: { id: string; x: number }[];
    worldWidth: number;
}

const generateLevelLayout = (words: any[]): LevelData => {
    const items: any[] = [];
    const platforms: { id: string; x: number; y: number; width: number; height: number }[] = [];
    const barrels: { id: string; x: number }[] = [];

    let currentX = 550;

    words.forEach((word, idx) => {
        const pattern = idx % 6;

        if (pattern === 0) {
            // Pattern 0: Ground Item + Single Barrel Obstacle (Lompat tong atas tanah)
            items.push({
                ...word,
                id: idx,
                x: currentX,
                y: 45,
                collected: false
            });
            // Solid barrel obstacle placed with plenty of space
            barrels.push({ id: `barrel-${idx}`, x: currentX + 240 });
            currentX += 480;

        } else if (pattern === 1) {
            // Pattern 1: Low Floating Platform (NAIK Platform Rendah)
            const platW = 220;
            const platY = 35; // surface at 35 + 45 = 80px
            platforms.push({
                id: `plat-${idx}`,
                x: currentX,
                y: platY,
                width: platW,
                height: 45
            });
            items.push({
                ...word,
                id: idx,
                x: currentX + platW / 2,
                y: platY + 45 + 45, // sitting on platform
                collected: false
            });
            // Barrel placed AFTER platform with clean clearance (80px away)
            barrels.push({ id: `barrel-${idx}`, x: currentX + platW + 80 });
            currentX += platW + 360;

        } else if (pattern === 2) {
            // Pattern 2: Stepped Ascent (NAIK 2 TINGKAT BERTANGGA)
            // Step 1: Low step
            const step1W = 160;
            const step1Y = 35; // surface 80px
            platforms.push({
                id: `plat-${idx}-s1`,
                x: currentX,
                y: step1Y,
                width: step1W,
                height: 45
            });

            // Step 2: High peak platform
            const step2W = 220;
            const step2Y = 110; // surface 155px
            platforms.push({
                id: `plat-${idx}-s2`,
                x: currentX + step1W + 50,
                y: step2Y,
                width: step2W,
                height: 45
            });

            items.push({
                ...word,
                id: idx,
                x: currentX + step1W + 50 + step2W / 2,
                y: step2Y + 45 + 45, // on top of high platform
                collected: false
            });

            // Barrel on open ground AFTER step 2 with clean space
            barrels.push({ id: `barrel-${idx}`, x: currentX + step1W + 50 + step2W + 90 });

            currentX += step1W + 50 + step2W + 380;

        } else if (pattern === 3) {
            // Pattern 3: High Sky Bridge to Descent (TURUN DARI PLATFORM KE TANAH)
            const bridgeW = 240;
            const bridgeY = 110; // surface 155px
            platforms.push({
                id: `plat-${idx}-b`,
                x: currentX,
                y: bridgeY,
                width: bridgeW,
                height: 45
            });

            // Step down
            const stepDownW = 160;
            const stepDownY = 35; // surface 80px
            platforms.push({
                id: `plat-${idx}-sd`,
                x: currentX + bridgeW + 50,
                y: stepDownY,
                width: stepDownW,
                height: 45
            });

            // Word is on the ground after stepping down!
            const groundX = currentX + bridgeW + 50 + stepDownW + 180;
            items.push({
                ...word,
                id: idx,
                x: groundX,
                y: 45,
                collected: false
            });

            // Barrel on ground under high bridge (bridge is at y=110, barrel is 78px high, ample vertical room!)
            barrels.push({ id: `barrel-${idx}`, x: currentX + bridgeW / 2 });

            currentX = groundX + 380;

        } else if (pattern === 4) {
            // Pattern 4: Overhead Bypass Bridge over Ground Barrels
            const bypassW = 280;
            const bypassY = 85; // surface 130px (barrel is 78px high, ample vertical clearance!)
            platforms.push({
                id: `plat-${idx}-bp`,
                x: currentX,
                y: bypassY,
                width: bypassW,
                height: 45
            });

            items.push({
                ...word,
                id: idx,
                x: currentX + bypassW / 2,
                y: bypassY + 45 + 45,
                collected: false
            });

            // 1 barrel on ground cleanly under the middle of the bridge
            barrels.push({ id: `barrel-${idx}`, x: currentX + bypassW / 2 });

            currentX += bypassW + 380;

        } else {
            // Pattern 5: Mid-Air Island
            const midW = 220;
            const midY = 55; // surface 100px
            platforms.push({
                id: `plat-${idx}-m`,
                x: currentX,
                y: midY,
                width: midW,
                height: 45
            });

            items.push({
                ...word,
                id: idx,
                x: currentX + midW / 2,
                y: midY + 45 + 45,
                collected: false
            });

            barrels.push({ id: `barrel-${idx}`, x: currentX + midW + 80 });
            currentX += midW + 360;
        }
    });

    const worldWidth = Math.max(12000, currentX + 3500);
    return { items, platforms, barrels, worldWidth };
};

interface DustParticle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
}

export const TandukKataGame = ({ onClose }: { onClose: () => void }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing'>('idle');
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const selectedCategoryRef = useRef<string>('');
    
    const [characterPos, setCharacterPos] = useState({ x: 100, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [facingRight, setFacingRight] = useState(true);
    const [cameraX, setCameraX] = useState(0);
    const [gameItems, setGameItems] = useState<any[]>([]);
    const [showHint, setShowHint] = useState(false);
    const idleTimerRef = useRef(0);
    const [gamePlatforms, setGamePlatforms] = useState<any[]>([]);
    const [gameBarrels, setGameBarrels] = useState<{ id: string; x: number }[]>([]);
    const [stars, setStars] = useState(0);
    const [worldWidth, setWorldWidth] = useState(12000);
    const worldWidthRef = useRef(12000);
    const [activeWord, setActiveWord] = useState<any | null>(null);
    const [showReward, setShowReward] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);

    const keys = useRef<{ [key: string]: boolean }>({});
    const charStateRef = useRef({ x: 100, y: 0, vx: 0, vy: 0, facingRight: true, isJumping: false });
    const gameItemsRef = useRef<any[]>([]);
    const platformsRef = useRef<any[]>([]);
    const barrelsRef = useRef<{ id: string; x: number }[]>([]);
    const activeWordRef = useRef<any | null>(null);
    const dustParticlesRef = useRef<DustParticle[]>([]);
    const worldContainerRef = useRef<HTMLDivElement | null>(null);
    const charContainerRef = useRef<HTMLDivElement | null>(null);
    const cameraXRef = useRef<number>(0);
    
    const gameLoopRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const GRAVITY = 2400;
    const JUMP_VELOCITY = 880;
    const MOVE_SPEED = 400;
    // On mobile view: add 1 more tile tier (60px) -> FLOOR_Y = 210px (higher platformer ground)
    const FLOOR_Y = isMobile ? 210 : 150; 
    const CARD_WIDTH = 90;
    const CARD_HEIGHT = 90;

    useEffect(() => {
        (window as any).mulaTandukKata = (category: string) => {
            if ((window as any).paparSkrin) (window as any).paparSkrin('view-tanduk-kata');
            startGame(category);
        };
        return () => {
            delete (window as any).mulaTandukKata;
        };
    }, []);

    useEffect(() => {
        const nav = document.getElementById('student-global-nav');
        if (gameState === 'playing') {
            document.body.classList.add('hide-bottom-nav');
            if (nav) nav.style.setProperty('display', 'none', 'important');
            return () => {
                document.body.classList.remove('hide-bottom-nav');
                if (nav) nav.style.removeProperty('display');
            };
        }
    }, [gameState]);

    const startGame = (category: string) => {
        setSelectedCategory(category);
        selectedCategoryRef.current = category;
        const words = getCategoryWords(category);
        const layout = generateLevelLayout(words);

        setWorldWidth(layout.worldWidth);
        worldWidthRef.current = layout.worldWidth;
        setGameItems(layout.items);
        gameItemsRef.current = layout.items;
        setGamePlatforms(layout.platforms);
        platformsRef.current = layout.platforms;
        setGameBarrels(layout.barrels);
        barrelsRef.current = layout.barrels;

        charStateRef.current = { x: 100, y: 0, vx: 0, vy: 0, facingRight: true, isJumping: false };
        cameraXRef.current = 0;
        if (worldContainerRef.current) {
            worldContainerRef.current.style.transform = 'translate3d(0px, 0, 0)';
        }
        if (charContainerRef.current) {
            charContainerRef.current.style.transform = 'translate3d(100px, 0px, 0) scaleX(1) translateX(-50%)';
        }

        setStars(0);
        setActiveWord(null);
        activeWordRef.current = null;
        setShowGameOver(false);
        setGameState('playing');
        idleTimerRef.current = 0;
        setShowHint(false);
        dustParticlesRef.current = [];
        setDustParticles([]);
        setShowGuide(true);
    };

    const walkSmokeTimerRef = useRef(0);
    const walkSoundTimerRef = useRef(0);

    const spawnDust = (x: number, y: number) => {
        const count = 4;
        const newParticles: DustParticle[] = [];
        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Date.now() + Math.random(),
                x: x + (Math.random() - 0.5) * 40,
                y: y + Math.random() * 8,
                vx: (Math.random() - 0.5) * 90,
                vy: Math.random() * 55 + 15,
                size: Math.random() * 10 + 9,
                life: 0.35,
                maxLife: 0.35
            });
        }
        dustParticlesRef.current = [...dustParticlesRef.current.slice(-12), ...newParticles];
        setDustParticles(dustParticlesRef.current);
    };

    const spawnWalkSmoke = (x: number, y: number, facingRight: boolean) => {
        const smokeOffsetX = facingRight ? -18 : 18;
        const newParticle: DustParticle = {
            id: Date.now() + Math.random(),
            x: x + smokeOffsetX + (Math.random() - 0.5) * 8,
            y: y + 4 + Math.random() * 6,
            vx: (facingRight ? -1 : 1) * (Math.random() * 45 + 15),
            vy: Math.random() * 35 + 10,
            size: Math.random() * 8 + 7,
            life: 0.28,
            maxLife: 0.28
        };
        dustParticlesRef.current = [...dustParticlesRef.current.slice(-12), newParticle];
        setDustParticles(dustParticlesRef.current);
    };

    const getAvatarSrc = () => {
        const studentName = (window as any).namaMuridAktif || 'Murid';
        return (window as any).studentData?.[studentName]?.avatar || (window as any).selectedAvatarIcon || '/images/avatar/avatar1.png';
    };
    const [currentAvatar, setCurrentAvatar] = useState(getAvatarSrc);

    useEffect(() => {
        const handleAvatarChange = (e?: any) => {
            if (e && e.detail && e.detail.avatar) {
                setCurrentAvatar(e.detail.avatar);
            } else {
                setCurrentAvatar(getAvatarSrc());
            }
        };
        handleAvatarChange();
        window.addEventListener('avatar-changed', handleAvatarChange);
        window.addEventListener('focus', handleAvatarChange);
        const timer = setInterval(handleAvatarChange, 800);
        return () => {
            window.removeEventListener('avatar-changed', handleAvatarChange);
            window.removeEventListener('focus', handleAvatarChange);
            clearInterval(timer);
        };
    }, []);

    const renderAvatar = () => {
        const avatarStr = currentAvatar || '/images/avatar/avatar1.png';
        if (typeof avatarStr === 'string' && (avatarStr.startsWith('http') || avatarStr.startsWith('/') || avatarStr.includes('.png'))) {
            return <img src={avatarStr} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
        } else {
            return <i className={`fa-solid ${avatarStr}`} style={{ fontSize: '100%', color: '#333' }}></i>;
        }
    };

    const jump = () => {
        if (!charStateRef.current.isJumping && activeWordRef.current === null && gameState === 'playing') {
            charStateRef.current.vy = JUMP_VELOCITY;
            charStateRef.current.isJumping = true;
            playJumpSound();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable) return;
            keys.current[e.code] = true;
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                jump();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
        
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'playing' || showGuide) return;

        const update = (time: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
            lastTimeRef.current = time;

            const state = charStateRef.current;
            const isPaused = activeWordRef.current !== null;

            if (!isPaused) {
                if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
                    state.vx = -MOVE_SPEED;
                    state.facingRight = false;
                    idleTimerRef.current += dt;
                } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
                    state.vx = MOVE_SPEED;
                    state.facingRight = true;
                    idleTimerRef.current = 0;
                } else {
                    state.vx = 0;
                    idleTimerRef.current += dt;
                }
                if (idleTimerRef.current > 5) {
                    setShowHint(true);
                } else {
                    setShowHint(false);
                }
            } else {
                state.vx = 0;
                idleTimerRef.current = 0;
            }

            const wasInAir = state.isJumping;

            if (!isPaused || state.y > 0) {
                state.vy -= GRAVITY * dt;
                let nextX = state.x + state.vx * dt;
                let nextY = state.y + state.vy * dt;
                let onGround = false;

                // Ground Floor Collision
                if (nextY <= 0) {
                    nextY = 0;
                    state.vy = 0;
                    onGround = true;
                }

                // ============================================================
                // 100% SOLID FLOATING PLATFORMS (Left, Right, Ceiling, Floor)
                // Cannot pass through from sides or underneath! Must jump onto it.
                // ============================================================
                if (platformsRef.current) {
                    const CHAR_HALF_W = 24;
                    const CHAR_HEIGHT = 70;

                    for (const plat of platformsRef.current) {
                        const platL = plat.x;
                        const platR = plat.x + plat.width;
                        const platBottom = plat.y;
                        const platTop = plat.y + (plat.height || 45);

                        // 1. TOP COLLISION (Landing on top of platform)
                        if (state.vy <= 0) {
                            if (state.y >= platTop - 8 && nextY <= platTop) {
                                if (nextX + CHAR_HALF_W > platL && nextX - CHAR_HALF_W < platR) {
                                    nextY = platTop;
                                    state.vy = 0;
                                    onGround = true;
                                }
                            }
                        }

                        // 2. BOTTOM / CEILING COLLISION (Head hits bottom of platform when jumping up)
                        if (state.vy > 0) {
                            const nextHeadY = nextY + CHAR_HEIGHT;
                            const prevHeadY = state.y + CHAR_HEIGHT;
                            if (prevHeadY <= platBottom + 8 && nextHeadY >= platBottom) {
                                if (nextX + CHAR_HALF_W - 4 > platL && nextX - CHAR_HALF_W + 4 < platR) {
                                    nextY = platBottom - CHAR_HEIGHT;
                                    state.vy = -100; // Bump head and fall down
                                }
                            }
                        }

                        // 3. HORIZONTAL SIDE BLOCKING (Cannot walk through platform walls)
                        // Active when character is vertically between the platform's top and bottom
                        const charFeet = nextY;
                        const charHead = nextY + CHAR_HEIGHT;
                        const isVerticallyOverlapping = charFeet < platTop - 4 && charHead > platBottom + 4;

                        if (isVerticallyOverlapping) {
                            // Moving Right into Left Wall of Platform
                            if (nextX + CHAR_HALF_W > platL && state.x + CHAR_HALF_W <= platL + 12) {
                                nextX = platL - CHAR_HALF_W;
                            }
                            // Moving Left into Right Wall of Platform
                            else if (nextX - CHAR_HALF_W < platR && state.x - CHAR_HALF_W >= platR - 12) {
                                nextX = platR + CHAR_HALF_W;
                            }
                            // Static / internal overlap safety push-out
                            else if (nextX + CHAR_HALF_W > platL && nextX - CHAR_HALF_W < platR) {
                                const distToLeft = Math.abs((nextX + CHAR_HALF_W) - platL);
                                const distToRight = Math.abs((nextX - CHAR_HALF_W) - platR);
                                if (distToLeft < distToRight) {
                                    nextX = platL - CHAR_HALF_W;
                                } else {
                                    nextX = platR + CHAR_HALF_W;
                                }
                            }
                        }
                    }
                }

                // ============================================================
                // 100% SOLID WOODEN BARRELS (Solid Sides + Stand-on-top Floor)
                // Cannot pass through! Must jump over it.
                // ============================================================
                if (barrelsRef.current) {
                    const BARREL_W = 60;
                    const BARREL_H = 78;
                    const CHAR_HALF_W = 24;

                    for (const barrel of barrelsRef.current) {
                        const barrelL = barrel.x - BARREL_W / 2;
                        const barrelR = barrel.x + BARREL_W / 2;
                        const barrelTop = BARREL_H;

                        // Landing on top of barrel
                        if (state.vy <= 0) {
                            if (state.y >= barrelTop - 8 && nextY <= barrelTop) {
                                if (nextX + CHAR_HALF_W - 4 > barrelL && nextX - CHAR_HALF_W + 4 < barrelR) {
                                    nextY = barrelTop;
                                    state.vy = 0;
                                    onGround = true;
                                }
                            }
                        }

                        // Horizontal side blocking: CANNOT pass through barrel!
                        if (nextY < barrelTop - 4) {
                            if (nextX + CHAR_HALF_W > barrelL && nextX - CHAR_HALF_W < barrelR) {
                                if (state.vx > 0) {
                                    nextX = barrelL - CHAR_HALF_W;
                                } else if (state.vx < 0) {
                                    nextX = barrelR + CHAR_HALF_W;
                                } else {
                                    const mid = (barrelL + barrelR) / 2;
                                    nextX = nextX < mid ? barrelL - CHAR_HALF_W : barrelR + CHAR_HALF_W;
                                }
                            }
                        }
                    }
                }

                if (wasInAir && onGround) {
                    spawnDust(nextX, nextY);
                }

                state.x = Math.min(worldWidthRef.current - 150, Math.max(50, nextX));
                state.y = nextY;
                state.isJumping = !onGround;

                // Spawn smoke particles & footstep audio when walking on ground
                if (!onGround) {
                    walkSmokeTimerRef.current = 0;
                    walkSoundTimerRef.current = 0;
                } else if (state.vx !== 0) {
                    walkSmokeTimerRef.current += dt;
                    if (walkSmokeTimerRef.current >= 0.08) {
                        walkSmokeTimerRef.current = 0;
                        spawnWalkSmoke(state.x, state.y, state.facingRight);
                    }
                    walkSoundTimerRef.current += dt;
                    if (walkSoundTimerRef.current >= 0.18) {
                        walkSoundTimerRef.current = 0;
                        playWalkStepSound();
                    }
                } else {
                    walkSmokeTimerRef.current = 0;
                    walkSoundTimerRef.current = 0;
                }
            }

            // Update dust particles
            if (dustParticlesRef.current.length > 0) {
                const updatedDust = dustParticlesRef.current
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx * dt,
                        y: p.y + p.vy * dt,
                        life: p.life - dt,
                        size: p.size + 14 * dt
                    }))
                    .filter(p => p.life > 0);
                dustParticlesRef.current = updatedDust;
                setDustParticles(updatedDust);
            }

            // GPU Accelerated Smooth Camera & Character Positioning (Zero CPU Re-render bottleneck!)
            const screenWidth = window.innerWidth || 800;
            let targetCameraX = state.x - screenWidth / 2;
            if (targetCameraX < 0) targetCameraX = 0;
            cameraXRef.current += (targetCameraX - cameraXRef.current) * 10 * dt;

            if (worldContainerRef.current) {
                worldContainerRef.current.style.transform = `translate3d(${-cameraXRef.current}px, 0, 0)`;
            }

            if (charContainerRef.current) {
                charContainerRef.current.style.transform = `translate3d(${state.x}px, ${-state.y}px, 0) scaleX(${state.facingRight ? 1 : -1}) translateX(-50%)`;
            }

            if (!isPaused) {
                let hitItem = null;
                const charRect = { left: state.x - 30, right: state.x + 30, bottom: state.y, top: state.y + 80 };
                
                for (const item of gameItemsRef.current) {
                    if (!item.collected) {
                        const itemRect = { left: item.x - 45, right: item.x + 45, bottom: item.y - 45, top: item.y + 45 };
                        
                        if (charRect.left < itemRect.right && charRect.right > itemRect.left &&
                            charRect.bottom < itemRect.top && charRect.top > itemRect.bottom) {
                            hitItem = item;
                            break;
                        }
                    }
                }

                if (hitItem) {
                    gameItemsRef.current = gameItemsRef.current.map(i => i.id === hitItem.id ? { ...i, collected: true } : i);
                    activeWordRef.current = hitItem;
                    
                    if (state.vy > 0) {
                        state.vy = -200;
                    }
                    
                    setGameItems(gameItemsRef.current);
                    handleItemCollect(hitItem);
                }
            }

            gameLoopRef.current = requestAnimationFrame(update);
        };
        
        lastTimeRef.current = performance.now();
        gameLoopRef.current = requestAnimationFrame(update);

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, showGuide]);

    const handleItemCollect = (item: any) => {
        if ((window as any).sebutAudio) {
            (window as any).sebutAudio(item.word);
        }
        
        setActiveWord(item);
        
        setTimeout(() => {
            setStars(s => {
                const nextStars = s + 1;
                const cat = selectedCategoryRef.current || selectedCategory || 'KV';
                if (typeof (window as any).tambahBintangGlobal === 'function') {
                    (window as any).tambahBintangGlobal('tandukKata_' + cat, 1);
                } else if ((window as any).logProgress) {
                    (window as any).logProgress('tandukKata_' + cat, 'latihan', nextStars, 'tandukKata');
                }
                if (typeof (window as any).updateProfilUI === 'function') {
                    (window as any).updateProfilUI();
                }
                return nextStars;
            });
            setShowReward(true);
            playPopConfettiSound();
            
            setTimeout(() => {
                setShowReward(false);
                setActiveWord(null);
                activeWordRef.current = null;
                
                if (gameItemsRef.current.every(i => i.collected)) {
                    setTimeout(() => {
                        playPopConfettiSound();
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            zIndex: 99999
                        });
                        if (typeof (window as any).playTada === 'function') { (window as any).playTada(); }
                        setShowGameOver(true);
                    }, 500);
                }
            }, 1500);
        }, 2000);
    };

    const handleMobileInput = (action: string, isDown: boolean) => {
        if (action === 'left') keys.current['ArrowLeft'] = isDown;
        if (action === 'right') keys.current['ArrowRight'] = isDown;
    };

    if (gameState === 'idle') return null;

    return (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'transparent', touchAction: 'none' }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '4rem', opacity: 0.8 }}>☁️</div>
                <div style={{ position: 'absolute', top: '15%', right: '20%', fontSize: '5rem', opacity: 0.8 }}>☁️</div>
                <div style={{ position: 'absolute', top: '5%', left: '50%', fontSize: 'clamp(1.2rem, 5vw, 2.5rem)', opacity: 0.6 }}>☁️</div>
            </div>

            {/* Game World - GPU Accelerated translate3d */}
            <div 
                ref={worldContainerRef}
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: `${worldWidth}px`, 
                    height: '100%', 
                    zIndex: 1,
                    willChange: 'transform',
                    transform: 'translate3d(0px, 0, 0)'
                }}
            >
                
                {/* SVG Definitions for Image 2 Tileset Ground Patterns */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        {/* Top Grass Tile Pattern */}
                        <pattern id="tileTopGrassPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            {/* Dirt Base */}
                            <rect x="0" y="0" width="60" height="60" fill="#462310" stroke="#281206" strokeWidth="2.5" />
                            {/* Curved Sediment Strata */}
                            <path d="M 0 22 C 15 17, 35 25, 60 21 C 60 28, 40 34, 0 30 Z" fill="#301507" />
                            <path d="M 0 42 C 20 38, 42 46, 60 41 C 60 48, 38 53, 0 48 Z" fill="#261004" />
                            {/* Scalloped Lush Grass Canopy */}
                            <path
                                d="M 0 0 L 60 0 L 60 14 Q 50 24 40 15 Q 28 25 16 15 Q 6 23 0 13 Z"
                                fill="#74ba35"
                                stroke="#274f0c"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            {/* Grass Top Highlight */}
                            <path
                                d="M 0 2.5 L 60 2.5 Q 50 8 40 4.5 Q 28 12 16 5.5 Q 6 9 0 4.5 Z"
                                fill="#98e046"
                                opacity="0.9"
                            />
                        </pattern>

                        {/* Underground Dirt Tile Pattern */}
                        <pattern id="tileDirtPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="60" height="60" fill="#462310" stroke="#281206" strokeWidth="2.5" />
                            <path d="M 0 18 C 18 13, 38 22, 60 17 C 60 24, 40 30, 0 26 Z" fill="#301507" />
                            <path d="M 0 40 C 20 36, 44 44, 60 39 C 60 46, 36 51, 0 46 Z" fill="#261004" />
                        </pattern>
                    </defs>
                </svg>

                {/* === Ground: Image 2 Tileset Modular Earth with Grass Canopy === */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: `${worldWidth}px`,
                    height: `${FLOOR_Y}px`,
                    zIndex: 2,
                    overflow: 'hidden'
                }}>
                    <svg width={worldWidth} height={FLOOR_Y} style={{ display: 'block' }}>
                        {/* Top 60px row of Top-Grass Tiles */}
                        <rect x="0" y="0" width={worldWidth} height="60" fill="url(#tileTopGrassPattern)" />
                        {/* Lower rows of Underground Dirt Tiles */}
                        <rect x="0" y="60" width={worldWidth} height={FLOOR_Y - 60} fill="url(#tileDirtPattern)" />
                    </svg>
                </div>

                {/* Deep Below-Screen Fill */}
                <div style={{ position: 'absolute', bottom: '-100vh', left: 0, width: `${worldWidth}px`, height: '100vh', backgroundColor: '#261004' }} />

                {/* === Floating Platforms: Image 2 Tileset Blocks === */}
                {gamePlatforms && gamePlatforms.map(plat => (
                    <div
                        key={plat.id}
                        style={{
                            position: 'absolute',
                            bottom: `${FLOOR_Y + plat.y}px`,
                            left: `${plat.x}px`,
                            width: `${plat.width}px`,
                            height: `${plat.height || 48}px`,
                            zIndex: 3,
                        }}
                    >
                        <PlatformBlock width={plat.width} height={plat.height || 48} />
                    </div>
                ))}

                {/* === Detailed Solid Wooden Barrels === */}
                {gameBarrels && gameBarrels.map(barrel => (
                    <div 
                        key={barrel.id} 
                        style={{ 
                            position: 'absolute', 
                            bottom: `${FLOOR_Y}px`, 
                            left: `${barrel.x}px`,
                            transform: 'translateX(-50%)',
                            width: '60px',
                            height: '78px',
                            zIndex: 3,
                        }}
                    >
                        <DetailedBarrel width={60} height={78} />
                    </div>
                ))}

                {/* Hint Arrow */}
                {(charStateRef.current.x < 500 || showHint) && (
                    <motion.div 
                        animate={{ x: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ position: 'absolute', bottom: `${FLOOR_Y + 50}px`, left: '300px', fontSize: '4rem', zIndex: 1, opacity: 0.8 }}
                    >
                        <div style={{ width: "60px", height: "60px", backgroundColor: "var(--color-blue)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 0 var(--color-dark)", border: "3px solid var(--color-dark)" }}><i className="fa-solid fa-arrow-right" style={{ color: "white", fontSize: "2rem" }}></i></div>
                    </motion.div>
                )}

                {/* Items */}
                {gameItems.map((item) => (
                    <AnimatePresence key={item.id}>
                        {!item.collected && (
                            <motion.div 
                                initial={{ y: 0, scale: 0.92 }}
                                animate={{ 
                                    y: [-6, 6, -6],
                                    scale: [1, 1.03, 1],
                                }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                style={{ 
                                    position: 'absolute', 
                                    bottom: `${FLOOR_Y + item.y}px`, 
                                    left: `${item.x}px`, 
                                    width: `${CARD_WIDTH}px`, 
                                    height: `${CARD_HEIGHT}px`, 
                                    transform: 'translate(-50%, 50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                <QuestionBlock size={CARD_WIDTH} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ))}

                {/* Smoke & Dust Particles */}
                {dustParticles.map(p => {
                    const progress = p.life / p.maxLife;
                    const alpha = Math.sin(progress * Math.PI) * 0.85;
                    const scale = 0.8 + (1 - progress) * 1.3;
                    return (
                        <div
                            key={p.id}
                            style={{
                                position: 'absolute',
                                bottom: `${FLOOR_Y + p.y}px`,
                                left: `${p.x}px`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                backgroundColor: 'rgba(240, 240, 245, 0.9)',
                                borderRadius: '50%',
                                opacity: alpha,
                                transform: `translate(-50%, 50%) scale(${scale})`,
                                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), inset 0 0 4px rgba(200, 200, 220, 0.5)',
                                filter: 'blur(1.5px)',
                                pointerEvents: 'none',
                                zIndex: 9
                            }}
                        />
                    );
                })}

                {/* Character — GPU Accelerated translate3d positioning */}
                <div 
                    ref={charContainerRef}
                    style={{ 
                        position: 'absolute', 
                        bottom: `${FLOOR_Y}px`, 
                        left: 0, 
                        transform: 'translate3d(100px, 0px, 0) scaleX(1) translateX(-50%)',
                        width: isMobile ? 'clamp(100px, 20vw, 135px)' : 'clamp(80px, 10vw, 120px)',
                        height: isMobile ? 'clamp(100px, 20vw, 135px)' : 'clamp(80px, 10vw, 120px)',
                        zIndex: 10,
                        willChange: 'transform',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontSize: isMobile ? '6.5rem' : '5rem', lineHeight: 1, filter: 'drop-shadow(0px 8px 0px rgba(0,0,0,0.35))' }}>
                        {renderAvatar()}
                    </div>
                </div>
            </div>

            {/* In-Game UI Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 20 }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '15px' }}>
                    <div className="map-top-bar" style={{ margin: 0 }}>
                <button className="neo-btn bg-orange back-icon-btn" onClick={() => {
                    setGameState('idle');
                    onClose();
                }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="neo-btn bg-orange page-title" style={{ pointerEvents: "none", fontSize: "1.2rem", zIndex: 1, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedCategory}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="fa-solid fa-star" style={{ color: '#fbbf24', WebkitTextStroke: '1px var(--color-dark)' }}></i> {stars}</span>
                        </div>
                        <button
                            className="neo-btn bg-orange help-btn info-icon-btn"
                            onClick={() => setShowGuide(true)}
                            title="Panduan Tanduk Kata"
                            aria-label="Panduan Tanduk Kata"
                        >
                            <i className="fa-solid fa-circle-info"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Word Popup Display */}
            <AnimatePresence>
                {activeWord && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}
                    >
                        <motion.div 
                            initial={{ y: -50 }} animate={{ y: 0 }}
                            style={{
                                position: 'relative',
                                backgroundColor: 'white',
                                padding: '30px',
                                borderRadius: '24px',
                                border: '6px solid var(--color-dark)',
                                boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
                                textAlign: 'center',
                                maxWidth: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px'
                            }}
                        >
                            {showReward && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 'calc(100% + 16px)',
                                    left: 0,
                                    right: 0,
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    pointerEvents: 'none',
                                    zIndex: 120
                                }}>
                                    <motion.div
                                        initial={{ y: -15, opacity: 0, scale: 0.8 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        style={{
                                            fontSize: 'clamp(1.6rem, 7vw, 3rem)',
                                            fontFamily: '"Century Gothic", "Apple Gothic", sans-serif',
                                            fontWeight: '900',
                                            color: '#fbbf24',
                                            textShadow: '0 4px 12px rgba(0,0,0,0.95), 0 0 16px rgba(251,191,36,0.8)',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        +1 Bintang! 🌟
                                    </motion.div>
                                </div>
                            )}

                            {activeWord.emoji && selectedCategory !== 'KV' && (
                                <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
                                    {activeWord.emoji.includes('<img') ? (
                                        <div dangerouslySetInnerHTML={{ __html: activeWord.emoji }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                    ) : activeWord.emoji.includes('/') || activeWord.emoji.includes('.png') ? (
                                        <img src={activeWord.emoji} alt={activeWord.word} style={{ maxHeight: '130px', maxWidth: '180px', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '6rem', lineHeight: 1 }}>{activeWord.emoji}</span>
                                    )}
                                </div>
                            )}
                            
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap', justifyContent: 'center', width: '100%', padding: '6px 10px 16px 10px', boxSizing: 'border-box', overflow: 'visible' }}>
                                {activeWord.syllables.map((syl: string, idx: number) => {
                                    const sylColor = SYLLABLE_COLORS[idx % SYLLABLE_COLORS.length];
                                    return (
                                        <motion.div 
                                            key={idx}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 + idx * 0.3, type: 'spring' }}
                                            style={{
                                                backgroundColor: '#f8fafc',
                                                border: `4px solid ${sylColor}`,
                                                borderRadius: '14px',
                                                padding: 'clamp(8px, 1.5vw, 15px) clamp(12px, 2.5vw, 24px)',
                                                boxShadow: `0 5px 0 ${sylColor}`,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span style={{
                                                fontSize: 'clamp(1.4rem, 5vw, 2.6rem)',
                                                fontWeight: '900',
                                                color: 'var(--color-dark)',
                                                textTransform: 'lowercase',
                                                lineHeight: 1.1
                                            }}>
                                                {syl}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

                        {/* Mobile Controls — on-screen touch controls */}
            <div className="tanduk-mobile-controls" style={{ position: 'absolute', bottom: isMobile ? '55px' : '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 50, pointerEvents: 'auto' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="neo-btn bg-yellow" style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.2rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
                        onPointerDown={(e) => { e.preventDefault(); handleMobileInput('left', true); }}
                        onPointerUp={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                        onPointerLeave={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                    > <i className="fa-solid fa-arrow-left"></i> </button>
                    <button 
                        className="neo-btn bg-yellow" style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.2rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
                        onPointerDown={(e) => { e.preventDefault(); handleMobileInput('right', true); }}
                        onPointerUp={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                        onPointerLeave={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                    > <i className="fa-solid fa-arrow-right"></i> </button>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="neo-btn bg-yellow" 
                        style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.2rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
                        onPointerDown={(e) => { e.preventDefault(); jump(); }}
                        title="Lompat"
                    > <i className="fa-solid fa-arrow-up"></i> </button>
                </div>
            </div>
            
            {/* Tanduk Kata Guide Screen Modal */}
            {showGuide && (
                <div 
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, padding: '16px',
                        fontFamily: '"Century Gothic", "Apple Gothic", sans-serif'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="neo-box"
                        style={{ 
                            backgroundColor: '#ffffff', 
                            backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)', 
                            backgroundSize: '16px 16px',
                            maxWidth: '520px', width: '100%', padding: '28px 24px', textAlign: 'center', borderRadius: '24px', 
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', border: '4px solid #f97316',
                            fontFamily: '"Century Gothic", "Apple Gothic", sans-serif',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', backgroundColor: '#ea580c', padding: '6px 24px', borderRadius: '16px', display: 'inline-block', margin: '0 0 15px 0', fontWeight: 'bold', fontFamily: '"Century Gothic", "Apple Gothic", sans-serif', border: '3px solid #c2410c' }}>
                                Misi Tanduk Kata
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: '#1e293b', margin: '0 0 20px 0', lineHeight: 1.6, fontWeight: 'bold', fontFamily: '"Century Gothic", "Apple Gothic", sans-serif' }}>
                                Gerakkan watak anda untuk mencari dan kumpul blok suku kata. Lompat dan tanduk kad suku kata untuk melengkapkan perkataan!
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', padding: '14px', backgroundColor: 'rgba(248, 250, 252, 0.9)', borderRadius: '16px', border: '2px solid #cbd5e1' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '6px' }}><i className="fa-solid fa-keyboard" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i></div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1e293b', fontFamily: '"Century Gothic", "Apple Gothic", sans-serif' }}>W A S D / Kekunci Anak Panah</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '6px' }}><i className="fa-solid fa-mobile-screen-button" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i></div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1e293b', fontFamily: '"Century Gothic", "Apple Gothic", sans-serif' }}>Butang Kiri, Kanan & Lompat</div>
                                </div>
                            </div>
                            
                            <button 
                                className="neo-btn cursor-pointer" 
                                style={{ backgroundColor: '#168f81', color: '#ffffff', fontSize: '1.1rem', padding: '12px 32px', width: '100%', fontFamily: '"Century Gothic", "Apple Gothic", sans-serif', fontWeight: 'bold', textTransform: 'none', borderRadius: '16px' }} 
                                onClick={() => {
                                    if (typeof (window as any).playBubble === 'function') {
                                        (window as any).playBubble();
                                    }
                                    setShowGuide(false);
                                }}
                            >
                                Mula Belajar
                            </button>
                        </motion.div>
                </div>
            )}
            

            {/* Game Over Modal */}
            <AnimatePresence>
                {showGameOver && (() => {
                    const activeStars = stars;
                    const isFullStars = activeStars >= 3;
                    const headerText = isFullStars ? 'Tahniah Anda Hebat!' : 'Cuba Lagi!';
                    
                    const star1Gold = activeStars >= 1;
                    const star2Gold = activeStars >= 2;
                    const star3Gold = activeStars >= 3;

                    return (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 30, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                style={{
                                    backgroundColor: '#ffffff',
                                    backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.06) 1.5px, transparent 1.5px)',
                                    backgroundSize: '15px 15px',
                                    padding: '28px 20px 22px',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    border: '4px solid var(--color-dark, #10182f)',
                                    boxShadow: '0 12px 0 var(--color-dark, #10182f), 0 20px 30px rgba(0,0,0,0.25)',
                                    maxWidth: '430px',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '14px',
                                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                                }}
                            >
                                {/* Header Badge (Matching Cabaran Utama) */}
                                <motion.div 
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    style={{
                                        position: 'relative',
                                        marginTop: '-4px',
                                        display: 'inline-block'
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: '#a855f7',
                                        backgroundImage: 'linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)',
                                        border: '3.5px solid #0f172a',
                                        borderRadius: '18px',
                                        boxShadow: '0 5px 0 #0f172a',
                                        padding: '3px',
                                        display: 'inline-block'
                                    }}>
                                        <div style={{
                                            border: '2.5px solid #4c1d95',
                                            borderRadius: '12px',
                                            backgroundColor: '#a855f7',
                                            backgroundImage: 'linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)',
                                            padding: '8px 28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <h2 style={{
                                                fontSize: 'clamp(1.45rem, 5vw, 2rem)',
                                                whiteSpace: 'nowrap',
                                                color: '#ffffff',
                                                fontWeight: '900',
                                                margin: 0,
                                                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                                                textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {headerText}
                                            </h2>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* 3 Stars (Top) */}
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', margin: '4px 0 0' }}>
                                    {/* Left Star */}
                                    <motion.div
                                        initial={{ y: -30, opacity: 0, rotate: -25 }}
                                        animate={{ y: 0, opacity: 1, rotate: -15 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
                                        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                                    >
                                        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                                            <defs>
                                                <linearGradient id="starGold_tk_1" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                                    {star1Gold ? (
                                                        <>
                                                            <stop offset="0%" stopColor="#fef08a" />
                                                            <stop offset="35%" stopColor="#fbbf24" />
                                                            <stop offset="75%" stopColor="#f59e0b" />
                                                            <stop offset="100%" stopColor="#d97706" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <stop offset="0%" stopColor="#f8fafc" />
                                                            <stop offset="50%" stopColor="#e2e8f0" />
                                                            <stop offset="100%" stopColor="#cbd5e1" />
                                                        </>
                                                    )}
                                                </linearGradient>
                                            </defs>
                                            <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_tk_1)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                                            <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                                        </svg>
                                    </motion.div>

                                    {/* Center Star (Bigger) */}
                                    <motion.div
                                        initial={{ y: -40, opacity: 0, scale: 0.5 }}
                                        animate={{ y: 0, opacity: 1, scale: 1.15 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.18 }}
                                        style={{ filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.25))', zIndex: 2 }}
                                    >
                                        <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                                            <defs>
                                                <linearGradient id="starGold_tk_2" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                                    {star2Gold ? (
                                                        <>
                                                            <stop offset="0%" stopColor="#fef08a" />
                                                            <stop offset="35%" stopColor="#fbbf24" />
                                                            <stop offset="75%" stopColor="#f59e0b" />
                                                            <stop offset="100%" stopColor="#d97706" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <stop offset="0%" stopColor="#f8fafc" />
                                                            <stop offset="50%" stopColor="#e2e8f0" />
                                                            <stop offset="100%" stopColor="#cbd5e1" />
                                                        </>
                                                    )}
                                                </linearGradient>
                                            </defs>
                                            <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_tk_2)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                                            <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                                        </svg>
                                    </motion.div>

                                    {/* Right Star */}
                                    <motion.div
                                        initial={{ y: -30, opacity: 0, rotate: 25 }}
                                        animate={{ y: 0, opacity: 1, rotate: 15 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.26 }}
                                        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                                    >
                                        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                                            <defs>
                                                <linearGradient id="starGold_tk_3" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                                    {star3Gold ? (
                                                        <>
                                                            <stop offset="0%" stopColor="#fef08a" />
                                                            <stop offset="35%" stopColor="#fbbf24" />
                                                            <stop offset="75%" stopColor="#f59e0b" />
                                                            <stop offset="100%" stopColor="#d97706" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <stop offset="0%" stopColor="#f8fafc" />
                                                            <stop offset="50%" stopColor="#e2e8f0" />
                                                            <stop offset="100%" stopColor="#cbd5e1" />
                                                        </>
                                                    )}
                                                </linearGradient>
                                            </defs>
                                            <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_tk_3)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                                            <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* Dashed Score Box */}
                                {/* Dashed Score Box with Outline Glow Loop */}
                                <div style={{
                                    width: '100%',
                                    border: '2.5px dashed #94a3b8',
                                    borderRadius: '18px',
                                    padding: '14px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', letterSpacing: '0.5px', fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif", marginBottom: '6px' }}>
                                        Anda Mendapat
                                    </div>
                                    <div 
                                        className="score-box-glow-pulse"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: '3px solid #0f172a',
                                            borderRadius: '16px',
                                            padding: '4px 34px',
                                            margin: '6px 0',
                                            width: '100%',
                                            maxWidth: '170px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <span style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif", lineHeight: 1 }}>
                                            {activeStars}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0f172a', letterSpacing: '1px', fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif" }}>
                                        <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                                        Bintang
                                        <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                                    </div>
                                </div>

                                {/* Motivation Info Card */}
                                <div style={{
                                    width: '100%',
                                    backgroundColor: '#ffffff',
                                    border: '2.5px solid #0f172a',
                                    borderRadius: '16px',
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    textAlign: 'left',
                                    boxShadow: '0 4px 0 #0f172a',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        backgroundColor: '#fef9c3',
                                        border: '2px solid #0f172a',
                                        boxShadow: '0 2px 0 #0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill="#facc15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 21H15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 9L12 7L14 9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontWeight: '900', fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.2, fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif" }}>
                                            {isFullStars ? 'Tahniah, Anda Hebat!' : 'Teruskan usaha anda!'}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600', marginTop: '2px', lineHeight: 1.2 }}>
                                            Pembelajaran akan menjadikan anda lebih baik.
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom 2 Buttons */}
                                <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '4px' }}>
                                    <button
                                        className="neo-btn bg-red cursor-pointer"
                                        title="Main Semula"
                                        aria-label="Main Semula"
                                        onClick={() => {
                                            setShowGameOver(false);
                                            startGame(selectedCategory || 'KV');
                                        }}
                                        style={{ padding: '14px 20px', fontSize: '1.4rem', flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <i className="fa-solid fa-rotate-right"></i>
                                    </button>
                                    <button
                                        className="neo-btn bg-orange cursor-pointer"
                                        title="Menu Utama"
                                        aria-label="Menu Utama"
                                        onClick={() => {
                                            setShowGameOver(false);
                                            setGameState('idle');
                                            onClose();
                                        }}
                                        style={{ padding: '14px 20px', fontSize: '1.4rem', flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <i className="fa-solid fa-house"></i>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}
