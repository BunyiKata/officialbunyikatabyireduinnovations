const fs = require('fs');

const fileContent = `import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface GameProps {
  onClose: () => void;
}

const CABARAN_DATA: Record<string, any[]> = {
  // ==========================================
  // === PETA 1: KENAL HURUF (1 Konsep 1 Cabaran) ===
  // ==========================================
  
  // 1. Cabaran Kenali Huruf: Dengar audio ABC & pilih huruf tepat
  kenali_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'ph', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],
  kenal_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'ph', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],

  // 2. Cabaran Huruf Vokal: Padan gambar mengikut huruf vokal (A, E, I, O, U)
  huruf_vokal: [
    { type: 'padan', image: '🐔', imageText: 'ayam', options: ['a', 'e', 'i', 'u'], answer: 'a' },
    { type: 'padan', image: '🍎', imageText: 'epal', options: ['e', 'a', 'o', 'i'], answer: 'e' },
    { type: 'padan', image: '🐟', imageText: 'ikan', options: ['i', 'u', 'o', 'a'], answer: 'i' },
    { type: 'padan', image: '🧠', imageText: 'otak', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'padan', image: '🐍', imageText: 'ular', options: ['u', 'a', 'e', 'o'], answer: 'u' },
    { type: 'padan', image: '🔥', imageText: 'api', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'padan', image: '6️⃣', imageText: 'enam', options: ['e', 'a', 'o', 'u'], answer: 'e' },
    { type: 'padan', image: '👵', imageText: 'ibu', options: ['i', 'a', 'u', 'e'], answer: 'i' },
    { type: 'padan', image: '🔦', imageText: 'obor', options: ['o', 'u', 'e', 'a'], answer: 'o' },
    { type: 'padan', image: '💊', imageText: 'ubat', options: ['u', 'a', 'i', 'o'], answer: 'u' }
  ],

  // 3. Cabaran Huruf Konsonan: Lengkapkan huruf yang tertinggal
  huruf_konsonan: [
    { type: 'teka', image: '📖', imageText: 'buku', text: 'B _ K U', options: ['U', 'A', 'I', 'E'], answer: 'U' },
    { type: 'teka', image: '🐴', imageText: 'kuda', text: 'K _ D A', options: ['U', 'A', 'I', 'O'], answer: 'U' },
    { type: 'teka', image: '⚽', imageText: 'bola', text: 'B _ L A', options: ['O', 'A', 'I', 'E'], answer: 'O' },
    { type: 'teka', image: '🪑', imageText: 'meja', text: 'M _ J A', options: ['E', 'A', 'I', 'U'], answer: 'E' },
    { type: 'teka', image: '🥄', imageText: 'sudu', text: 'S _ D U', options: ['U', 'A', 'I', 'O'], answer: 'U' },
    { type: 'teka', image: '🪴', imageText: 'pasu', text: 'P _ S U', options: ['A', 'E', 'I', 'U'], answer: 'A' },
    { type: 'teka', image: '🔨', imageText: 'paku', text: 'P _ K U', options: ['A', 'I', 'U', 'E'], answer: 'A' },
    { type: 'teka', image: '👗', imageText: 'baju', text: 'B _ J U', options: ['A', 'E', 'I', 'O'], answer: 'A' },
    { type: 'teka', image: '🪨', imageText: 'batu', text: 'B _ T U', options: ['A', 'U', 'I', 'E'], answer: 'A' },
    { type: 'teka', image: '🦌', imageText: 'rusa', text: 'R _ S A', options: ['U', 'A', 'I', 'E'], answer: 'U' }
  ],

  // 4. Cabaran Fonik ABC: Dengar audio fonik dan pilih huruf tepat
  fonik_abc: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['b', 'p', 'd', 't'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['c', 's', 'k', 'j'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['d', 'b', 't', 'p'], answer: 'd' },
    { type: 'dengar', audio: 'f', options: ['f', 'v', 'p', 's'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['g', 'j', 'k', 'q'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['h', 'k', 'n', 'm'], answer: 'h' },
    { type: 'dengar', audio: 'k', options: ['k', 'c', 'g', 'q'], answer: 'k' },
    { type: 'dengar', audio: 'm', options: ['m', 'n', 'w', 'v'], answer: 'm' },
    { type: 'dengar', audio: 's', options: ['s', 'z', 'c', 'x'], answer: 's' }
  ],

  // ==========================================
  // === PETA 2: SUKU KATA ASAS (1 Konsep 1 Cabaran) ===
  // ==========================================
  suku_kata_kv: [
    { type: 'dengar', audio: 'ba', options: ['ba', 'da', 'ka', 'ma'], answer: 'ba' },
    { type: 'dengar', audio: 'cu', options: ['ca', 'cu', 'ci', 'co'], answer: 'cu' },
    { type: 'dengar', audio: 'di', options: ['bi', 'di', 'fi', 'gi'], answer: 'di' },
    { type: 'dengar', audio: 'fe', options: ['fe', 'fa', 'fo', 'fu'], answer: 'fe' },
    { type: 'dengar', audio: 'gu', options: ['ga', 'ge', 'gu', 'gi'], answer: 'gu' },
    { type: 'dengar', audio: 'hi', options: ['ha', 'he', 'hi', 'ho'], answer: 'hi' },
    { type: 'dengar', audio: 'ja', options: ['ja', 'je', 'ji', 'ju'], answer: 'ja' },
    { type: 'dengar', audio: 'ku', options: ['ka', 'ke', 'ki', 'ku'], answer: 'ku' },
    { type: 'dengar', audio: 'lo', options: ['la', 'li', 'lu', 'lo'], answer: 'lo' },
    { type: 'dengar', audio: 'mi', options: ['ma', 'me', 'mi', 'mo'], answer: 'mi' }
  ],
  suku_kata_kv_kv: [
    { type: 'padan', image: '👗', imageText: 'baju', options: ['baju', 'bola', 'meja', 'kuda'], answer: 'baju' },
    { type: 'padan', image: '⚽', imageText: 'bola', options: ['bola', 'buku', 'batu', 'bata'], answer: 'bola' },
    { type: 'padan', image: '📖', imageText: 'buku', options: ['buku', 'kuku', 'sudu', 'pasu'], answer: 'buku' },
    { type: 'padan', image: '🐴', imageText: 'kuda', options: ['kuda', 'rusa', 'meja', 'baju'], answer: 'kuda' },
    { type: 'padan', image: '🪑', imageText: 'meja', options: ['meja', 'pasu', 'buku', 'bola'], answer: 'meja' },
    { type: 'padan', image: '🥄', imageText: 'sudu', options: ['sudu', 'satu', 'pasu', 'kuku'], answer: 'sudu' },
    { type: 'padan', image: '🪴', imageText: 'pasu', options: ['pasu', 'paku', 'baju', 'batu'], answer: 'pasu' },
    { type: 'padan', image: '🦌', imageText: 'rusa', options: ['rusa', 'rasa', 'meja', 'kuda'], answer: 'rusa' },
    { type: 'padan', image: '🪨', imageText: 'batu', options: ['batu', 'satu', 'bata', 'bola'], answer: 'batu' },
    { type: 'padan', image: '🔨', imageText: 'paku', options: ['paku', 'pasu', 'sudu', 'kuku'], answer: 'paku' }
  ],
  suku_kata_v_kv: [
    { type: 'lengkap', image: '🔥', imageText: 'api', prefix: '___', suffix: 'pi', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'lengkap', image: '💧', imageText: 'air', prefix: 'a', suffix: '___', options: ['ir', 'ur', 'er', 'ar'], answer: 'ir' },
    { type: 'lengkap', image: '🧊', imageText: 'ais', prefix: 'a', suffix: '___', options: ['is', 'us', 'es', 'as'], answer: 'is' },
    { type: 'lengkap', image: '👵', imageText: 'ibu', prefix: '___', suffix: 'bu', options: ['i', 'a', 'u', 'e'], answer: 'i' },
    { type: 'lengkap', image: '🍠', imageText: 'ubi', prefix: '___', suffix: 'bi', options: ['u', 'a', 'i', 'e'], answer: 'u' },
    { type: 'lengkap', image: '🦅', imageText: 'helang', prefix: '___', suffix: 'lang', options: ['he', 'ha', 'hi', 'ho'], answer: 'he' },
    { type: 'lengkap', image: '🐍', imageText: 'ular', prefix: '___', suffix: 'lar', options: ['u', 'a', 'i', 'e'], answer: 'u' },
    { type: 'lengkap', image: '🧠', imageText: 'otak', prefix: '___', suffix: 'tak', options: ['o', 'a', 'i', 'u'], answer: 'o' },
    { type: 'lengkap', image: '🍎', imageText: 'epal', prefix: 'e', suffix: '___', options: ['pal', 'pel', 'pul', 'pol'], answer: 'pal' },
    { type: 'lengkap', image: '☁️', imageText: 'awan', prefix: 'a', suffix: '___', options: ['wan', 'win', 'wun', 'wen'], answer: 'wan' }
  ],
  suku_kata_kv_kv_kv: [
    { type: 'susun', image: '🐸', imageText: 'berudu', syllables: ['be', 'ru', 'du'], options: ['ru', 'be', 'du'] },
    { type: 'susun', image: '🚗', imageText: 'kereta', syllables: ['ke', 're', 'ta'], options: ['ta', 're', 'ke'] },
    { type: 'susun', image: '🍅', imageText: 'tomato', syllables: ['to', 'ma', 'to'], options: ['ma', 'to', 'to'] },
    { type: 'susun', image: '🥔', imageText: 'kentang', syllables: ['ken', 'tang'], options: ['tang', 'ken'] },
    { type: 'susun', image: '📸', imageText: 'kamera', syllables: ['ka', 'me', 'ra'], options: ['ra', 'me', 'ka'] },
    { type: 'susun', image: '👠', imageText: 'sepatu', syllables: ['se', 'pa', 'tu'], options: ['tu', 'pa', 'se'] },
    { type: 'susun', image: '👔', imageText: 'kemeja', syllables: ['ke', 'me', 'ja'], options: ['ja', 'ke', 'me'] },
    { type: 'susun', image: '🦇', imageText: 'kelawar', syllables: ['ke', 'la', 'war'], options: ['war', 'la', 'ke'] },
    { type: 'susun', image: '🐊', imageText: 'buaya', syllables: ['bu', 'a', 'ya'], options: ['ya', 'bu', 'a'] },
    { type: 'susun', image: '🦎', imageText: 'mengkarung', syllables: ['meng', 'ka', 'rung'], options: ['rung', 'meng', 'ka'] }
  ],
  suku_kata_kvk: [
    { type: 'teka', image: '🚌', imageText: 'bas', text: 'b _ s', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'teka', image: '🎒', imageText: 'beg', text: 'b _ g', options: ['e', 'a', 'i', 'u'], answer: 'e' },
    { type: 'teka', image: '🧹', imageText: 'mop', text: 'm _ p', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'teka', image: '🧢', imageText: 'top', text: 't _ p', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'teka', image: '🍯', imageText: 'jem', text: 'j _ m', options: ['e', 'a', 'i', 'u'], answer: 'e' },
    { type: 'teka', image: '📍', imageText: 'pin', text: 'p _ n', options: ['i', 'a', 'e', 'u'], answer: 'i' },
    { type: 'teka', image: '🥫', imageText: 'tin', text: 't _ n', options: ['i', 'a', 'e', 'u'], answer: 'i' },
    { type: 'teka', image: '🖊️', imageText: 'pen', text: 'p _ n', options: ['e', 'a', 'i', 'u'], answer: 'e' },
    { type: 'teka', image: '🚐', imageText: 'van', text: 'v _ n', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'teka', image: '🐈', imageText: 'cat', text: 'c _ t', options: ['a', 'i', 'u', 'e'], answer: 'a' }
  ],
  suku_kata_v_kvk: [
    { type: 'bakul', words: [{ id: 1, text: 'ayam', image: '🐔', category: 'A' }] },
    { type: 'bakul', words: [{ id: 2, text: 'ikan', image: '🐟', category: 'B' }] },
    { type: 'bakul', words: [{ id: 3, text: 'awan', image: '☁️', category: 'A' }] },
    { type: 'bakul', words: [{ id: 4, text: 'epal', image: '🍎', category: 'B' }] },
    { type: 'bakul', words: [{ id: 5, text: 'adik', image: '👦', category: 'A' }] },
    { type: 'bakul', words: [{ id: 6, text: 'ular', image: '🐍', category: 'B' }] },
    { type: 'bakul', words: [{ id: 7, text: 'akar', image: '🌱', category: 'A' }] },
    { type: 'bakul', words: [{ id: 8, text: 'otak', image: '🧠', category: 'B' }] },
    { type: 'bakul', words: [{ id: 9, text: 'ulat', image: '🐛', category: 'B' }] },
    { type: 'bakul', words: [{ id: 10, text: 'atap', image: '🏠', category: 'A' }] }
  ],

  // ==========================================
  // === PETA 3: SUKU KATA HERO (1 Konsep 1 Cabaran) ===
  // ==========================================

  // 1. Cabaran KV + KVK: Konsep DENGAR AUDIO
  suku_kata_kv_kvk: [
    { type: 'dengar', audio: 'kasut', options: ['kasut', 'kaset', 'kasur', 'kasap'], answer: 'kasut' },
    { type: 'dengar', audio: 'cawan', options: ['cawan', 'cawat', 'cawar', 'cawas'], answer: 'cawan' },
    { type: 'dengar', audio: 'gajah', options: ['gajah', 'gajih', 'gajuh', 'gajeh'], answer: 'gajah' },
    { type: 'dengar', audio: 'kapal', options: ['kapal', 'kapil', 'kapul', 'kapel'], answer: 'kapal' },
    { type: 'dengar', audio: 'kolam', options: ['kolam', 'kolim', 'kolum', 'kolem'], answer: 'kolam' },
    { type: 'dengar', audio: 'hutan', options: ['hutan', 'hutin', 'huten', 'hutan'], answer: 'hutan' },
    { type: 'dengar', audio: 'lalat', options: ['lalat', 'lalit', 'lalut', 'lalet'], answer: 'lalat' },
    { type: 'dengar', audio: 'jalan', options: ['jalan', 'jalin', 'jalun', 'jalen'], answer: 'jalan' },
    { type: 'dengar', audio: 'siram', options: ['siram', 'sirim', 'sirum', 'sirem'], answer: 'siram' },
    { type: 'dengar', audio: 'taman', options: ['taman', 'tamin', 'tamun', 'tamen'], answer: 'taman' }
  ],

  // 2. Cabaran KVK + KV: Konsep PADAN GAMBAR
  suku_kata_kvk_kv: [
    { type: 'padan', image: '🐄', imageText: 'lembu', options: ['lembu', 'lampu', 'pintu', 'bomba'], answer: 'lembu' },
    { type: 'padan', image: '💡', imageText: 'lampu', options: ['lampu', 'lembu', 'pintu', 'kunci'], answer: 'lampu' },
    { type: 'padan', image: '🚪', imageText: 'pintu', options: ['pintu', 'panti', 'penti', 'pantu'], answer: 'pintu' },
    { type: 'padan', image: '🚒', imageText: 'bomba', options: ['bomba', 'lembu', 'lampu', 'pintu'], answer: 'bomba' },
    { type: 'padan', image: '🔑', imageText: 'kunci', options: ['kunci', 'kanci', 'kunci', 'kancu'], answer: 'kunci' },
    { type: 'padan', image: '🍴', imageText: 'garfu', options: ['garfu', 'garfa', 'garfi', 'garfo'], answer: 'garfu' },
    { type: 'padan', image: '🚕', imageText: 'teksi', options: ['teksi', 'teksa', 'teksu', 'tekse'], answer: 'teksi' },
    { type: 'padan', image: '🛌', imageText: 'mimpi', options: ['mimpi', 'mampa', 'mampu', 'mampe'], answer: 'mimpi' },
    { type: 'padan', image: '🍝', imageText: 'pasta', options: ['pasta', 'pasti', 'pastu', 'paste'], answer: 'pasta' },
    { type: 'padan', image: '🏷️', imageText: 'tanda', options: ['tanda', 'tandi', 'tandu', 'tande'], answer: 'tanda' }
  ],

  // 3. Cabaran KVK + KVK: Konsep LENGKAPKAN SUKU KATA
  suku_kata_kvk_kvk: [
    { type: 'lengkap', image: '👨‍⚕️', imageText: 'doktor', prefix: 'dok', suffix: '___', options: ['tor', 'tar', 'tur', 'ter'], answer: 'tor' },
    { type: 'lengkap', image: '🍪', imageText: 'biskut', prefix: 'bis', suffix: '___', options: ['kut', 'kat', 'kit', 'kot'], answer: 'kut' },
    { type: 'lengkap', image: '📄', imageText: 'kertas', prefix: 'ker', suffix: '___', options: ['tas', 'tis', 'tus', 'tes'], answer: 'tas' },
    { type: 'lengkap', image: '✉️', imageText: 'sampul', prefix: 'sam', suffix: '___', options: ['pul', 'pal', 'pil', 'pol'], answer: 'pul' },
    { type: 'lengkap', image: '🌱', imageText: 'rumput', prefix: 'rum', suffix: '___', options: ['put', 'pat', 'pit', 'pot'], answer: 'put' },
    { type: 'lengkap', image: '💍', imageText: 'cincin', prefix: 'cin', suffix: '___', options: ['cin', 'can', 'cun', 'cen'], answer: 'cin' },
    { type: 'lengkap', image: '🏃', imageText: 'lompat', prefix: 'lom', suffix: '___', options: ['pat', 'pit', 'put', 'pet'], answer: 'pat' },
    { type: 'lengkap', image: '✂️', imageText: 'potong', prefix: 'po', suffix: '___', options: ['tong', 'tang', 'ting', 'tung'], answer: 'tong' },
    { type: 'lengkap', image: '🧗', imageText: 'panjat', prefix: 'pan', suffix: '___', options: ['jat', 'jit', 'jut', 'jet'], answer: 'jat' },
    { type: 'lengkap', image: '🛁', imageText: 'mandi', prefix: 'man', suffix: '___', options: ['di', 'da', 'du', 'de'], answer: 'di' }
  ],

  // 4. Cabaran KVKK: Konsep TEKA HURUF VOKAL/KONSONAN
  suku_kata_kvkk: [
    { type: 'teka', image: '🏦', imageText: 'bank', text: 'B _ N K', options: ['A', 'E', 'I', 'U'], answer: 'A' },
    { type: 'teka', image: '🧪', imageText: 'zink', text: 'Z _ N K', options: ['I', 'A', 'E', 'U'], answer: 'I' },
    { type: 'teka', image: '📄', imageText: 'teks', text: 'T _ K S', options: ['E', 'A', 'I', 'U'], answer: 'E' },
    { type: 'teka', image: '🔔', imageText: 'gong', text: 'G _ N G', options: ['O', 'A', 'E', 'U'], answer: 'O' },
    { type: 'teka', image: '💰', imageText: 'wang', text: 'W _ N G', options: ['A', 'E', 'I', 'U'], answer: 'A' },
    { type: 'teka', image: '🦁', imageText: 'singa', text: 'S _ N G A', options: ['I', 'A', 'E', 'U'], answer: 'I' },
    { type: 'teka', image: '🦔', imageText: 'tang', text: 'T _ N G', options: ['A', 'E', 'I', 'U'], answer: 'A' },
    { type: 'teka', image: '👑', imageText: 'ring', text: 'R _ N G', options: ['I', 'A', 'E', 'U'], answer: 'I' },
    { type: 'teka', image: '🌊', imageText: 'gelang', text: 'G E L _ N G', options: ['A', 'E', 'I', 'U'], answer: 'A' },
    { type: 'teka', image: '🦐', imageText: 'udang', text: 'U D _ N G', options: ['A', 'E', 'I', 'U'], answer: 'A' }
  ],

  // 5. Cabaran KV + KV + KVK: Konsep SUSUN SUKU KATA
  suku_kata_kv_kv_kvk: [
    { type: 'susun', image: '🚲', imageText: 'basikal', syllables: ['ba', 'si', 'kal'], options: ['kal', 'si', 'ba'] },
    { type: 'susun', image: '🦗', imageText: 'belalang', syllables: ['be', 'la', 'lang'], options: ['lang', 'be', 'la'] },
    { type: 'susun', image: '🏫', imageText: 'sekolah', syllables: ['se', 'ko', 'lah'], options: ['lah', 'se', 'ko'] },
    { type: 'susun', image: '🧹', imageText: 'pemadam', syllables: ['pe', 'ma', 'dam'], options: ['dam', 'pe', 'ma'] },
    { type: 'susun', image: '🍙', imageText: 'ketupat', syllables: ['ke', 'tu', 'pat'], options: ['pat', 'ke', 'tu'] },
    { type: 'susun', image: '📐', imageText: 'pembaris', syllables: ['pem', 'ba', 'ris'], options: ['ris', 'pem', 'ba'] },
    { type: 'susun', image: '👔', imageText: 'kemeja', syllables: ['ke', 'me', 'ja'], options: ['ja', 'ke', 'me'] },
    { type: 'susun', image: '🍅', imageText: 'tomato', syllables: ['to', 'ma', 'to'], options: ['ma', 'to', 'to'] },
    { type: 'susun', image: '🚗', imageText: 'kereta', syllables: ['ke', 're', 'ta'], options: ['ta', 'ke', 're'] },
    { type: 'susun', image: '📸', imageText: 'kamera', syllables: ['ka', 'me', 'ra'], options: ['ra', 'me', 'ka'] }
  ],

  // 6. Cabaran KVK + KV + KVK: Konsep SUSUN SUKU KATA 3 BAHAGIAN
  suku_kata_kvk_kv_kvk: [
    { type: 'susun', image: '🍈', imageText: 'cempedak', syllables: ['cem', 'pe', 'dak'], options: ['dak', 'cem', 'pe'] },
    { type: 'susun', image: '💀', imageText: 'tengkorak', syllables: ['teng', 'ko', 'rak'], options: ['rak', 'teng', 'ko'] },
    { type: 'susun', image: '✨', imageText: 'sempurna', syllables: ['sem', 'pur', 'na'], options: ['na', 'pur', 'sem'] },
    { type: 'susun', image: '🙏', imageText: 'sembayang', syllables: ['sem', 'ba', 'yang'], options: ['yang', 'sem', 'ba'] },
    { type: 'susun', image: '🍉', imageText: 'tembikai', syllables: ['tem', 'bi', 'kai'], options: ['kai', 'tem', 'bi'] },
    { type: 'susun', image: '🧗', imageText: 'penderma', syllables: ['pen', 'der', 'ma'], options: ['ma', 'pen', 'der'] },
    { type: 'susun', image: '🌼', imageText: 'cempaka', syllables: ['cem', 'pa', 'ka'], options: ['ka', 'cem', 'pa'] },
    { type: 'susun', image: '💡', imageText: 'pembakar', syllables: ['pem', 'ba', 'kar'], options: ['kar', 'pem', 'ba'] },
    { type: 'susun', image: '🧺', imageText: 'pembeli', syllables: ['pem', 'be', 'li'], options: ['li', 'pem', 'be'] },
    { type: 'susun', image: '🛠️', imageText: 'pembantu', syllables: ['pem', 'ban', 'tu'], options: ['tu', 'pem', 'ban'] }
  ]
};

export const CabaranSukuKataGame: React.FC<GameProps> = ({ onClose }) => {
  const [cabaranId, setCabaranId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  
  // Specific state for susun
  const [susunSlots, setSusunSlots] = useState<string[]>([]);
  
  // Specific state for bakul
  const [activeBakulWordIndex, setActiveBakulWordIndex] = useState(0);

  useEffect(() => {
    const handleStart = (e: any) => {
      const { id, title: cTitle } = e.detail;
      setCabaranId(id);
      setTitle(cTitle);
      
      const q = CABARAN_DATA[id] || CABARAN_DATA['suku_kata_kv'] || [];
      // If we have less than 10 questions, just repeat them to make 10
      let fullQ = [...q];
      while (fullQ.length > 0 && fullQ.length < 10) {
          fullQ = [...fullQ, ...q];
      }
      setQuestions(fullQ.slice(0, 10));
      
      setCurrentIndex(0);
      setScore(0);
      setLives(3);
      setGameState('playing');
      setFeedback(null);
      setSusunSlots([]);
      setActiveBakulWordIndex(0);
      setSelectedOption(null);
    };

    window.addEventListener('start-cabaran-suku-kata', handleStart);
    return () => window.removeEventListener('start-cabaran-suku-kata', handleStart);
  }, []);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      if (type === 'correct') {
        if (typeof (window as any).playTada === 'function') (window as any).playTada();
      } else {
        if (typeof (window as any).playOops === 'function') (window as any).playOops();
      }
    } catch (e) {
      console.log('Audio error', e);
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    playSoundEffect('correct');
    setScore(prev => prev + 1);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#ffffff', '#ffe24a']
    });

    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 1500);
  };

  const handleWrong = () => {
    setFeedback('wrong');
    playSoundEffect('wrong');
    setShake(true);
    setLives(prev => prev - 1);
    
    setTimeout(() => {
      setFeedback(null);
      setShake(false);
      
      if (lives <= 1) {
        setGameState('result');
      }
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSusunSlots([]);
      setActiveBakulWordIndex(0);
      setSelectedOption(null);
    } else {
      setGameState('result');
      if (score + 1 === 10) {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.3 } });
      }
    }
  };

  const handleOptionClick = (option: string) => {
    if (feedback !== null || gameState !== 'playing') return;
    setSelectedOption(option);
    
    const currentQ = questions[currentIndex];
    
    if (currentQ.type === 'susun') {
        const newSlots = [...susunSlots, option];
        setSusunSlots(newSlots);
        
        if (newSlots.length === currentQ.syllables.length) {
            if (newSlots.join('') === currentQ.syllables.join('')) {
                handleCorrect();
            } else {
                handleWrong();
                setTimeout(() => setSusunSlots([]), 1000);
            }
        }
        return;
    }
    
    if (option === currentQ.answer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleBakulClick = (category: string) => {
     if (feedback !== null || gameState !== 'playing') return;
     setSelectedOption(category);
     
     const currentQ = questions[currentIndex];
     const currentWord = currentQ.words[activeBakulWordIndex];
     
     if (category === currentWord.category) {
         setFeedback('correct');
         if ((window as any).playBubble) (window as any).playBubble();

         setTimeout(() => {
             setFeedback(null);
             if (activeBakulWordIndex < currentQ.words.length - 1) {
                 setActiveBakulWordIndex(prev => prev + 1);
             } else {
                 setScore(prev => prev + 1);
                 nextQuestion();
             }
         }, 800);
     } else {
         handleWrong();
     }
  };

  if (!cabaranId) return null;

  const currentQ = questions[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: 'transparent' }}>
      
      {/* Header */}
      <div className="map-top-bar" style={{ paddingTop: "15px", marginBottom: "0" }}>
        <button className="neo-btn bg-purple back-icon-btn" onClick={onClose} aria-label="Kembali">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="neo-btn bg-purple page-title" style={{ pointerEvents: 'none', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
          {title.toUpperCase()}
        </div>
        <div></div>
      </div>

      {/* Progress Bar & Stats */}
      <div style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ width: '100%', height: '10px', backgroundColor: 'white', borderRadius: '10px', border: '2px solid var(--color-dark)', overflow: 'hidden', marginBottom: '15px' }}>
          <div style={{ height: '100%', backgroundColor: 'var(--color-orange)', width: \`\${((currentIndex) / 10) * 100}%\`, transition: 'width 0.3s ease' }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="neo-box" style={{ padding: '8px 16px', borderRadius: '30px', display: 'flex', gap: '8px' }}>
             {[1, 2, 3].map(i => (
                 <motion.i 
                    key={i} 
                    className="fa-solid fa-heart" 
                    animate={i > lives ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    style={{ color: 'var(--color-red)', fontSize: '1.2rem' }}
                 ></motion.i>
             ))}
          </div>
          
          <div className="neo-box" style={{ padding: '8px 16px', borderRadius: '30px', fontWeight: 'bold' }}>
             <i className="fa-solid fa-star" style={{ color: 'var(--color-yellow)', WebkitTextStroke: '1px var(--color-dark)' }}></i> {score} / 10
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        {gameState === 'playing' && currentQ && (
          <motion.div 
             animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
             transition={{ duration: 0.4 }}
             className="neo-box" 
             style={{ 
                 width: '100%', maxWidth: '700px', backgroundColor: '#148f7d', 
                 backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 2px, transparent 2px)', backgroundSize: '15px 15px',
                 padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px',
                 border: '4px solid var(--color-dark)', borderRadius: '24px'
             }}>
             
             {/* Question Content based on type */}
             {currentQ.type === 'dengar' && (
                 <div style={{ textAlign: 'center' }}>
                     <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>Dengar audio dan pilih jawapan yang betul:</p>
                     <button className="neo-btn bg-orange" onClick={() => playAudio(currentQ.audio)} style={{ fontSize: '3rem', padding: '20px 40px', borderRadius: '24px' }}>
                         <i className="fa-solid fa-volume-high"></i>
                     </button>
                 </div>
             )}

             {(currentQ.type === 'padan' || currentQ.type === 'lengkap' || currentQ.type === 'teka') && (
                 <div className="neo-box" style={{ backgroundColor: '#bae6fd', textAlign: 'center', padding: '20px 40px', width: '100%', maxWidth: '450px' }}>
                     <div style={{ fontSize: '4rem', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))' }}>{currentQ.image}</div>
                     {currentQ.type === 'padan' && (
                         <button className="neo-btn bg-white" onClick={() => playAudio(currentQ.imageText)} style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--color-blue)' }}>
                             <i className="fa-solid fa-volume-high"></i> Sebut Gambar
                         </button>
                     )}
                     {currentQ.type === 'lengkap' && (
                         <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '15px' }}>
                             {currentQ.prefix} + {currentQ.suffix}
                         </div>
                     )}
                     {currentQ.type === 'teka' && (
                         <div style={{ fontSize: '3rem', fontWeight: 'bold', marginTop: '15px', letterSpacing: '6px' }}>
                             {currentQ.text}
                         </div>
                     )}
                 </div>
             )}
             
             {currentQ.type === 'susun' && (
                 <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                     <div className="neo-box" style={{ backgroundColor: '#fef08a', padding: '15px 30px' }}>
                         <div style={{ fontSize: '4rem' }}>{currentQ.image}</div>
                     </div>
                     <p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>Susun suku kata mengikut urutan yang betul:</p>
                     <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                         {currentQ.syllables.map((_: any, i: number) => (
                             <div key={i} className="neo-box" style={{ minWidth: '70px', height: '70px', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', border: '3px dashed white', backgroundColor: 'transparent', color: 'white', boxShadow: 'none' }}>
                                 {susunSlots[i] || ''}
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {currentQ.type === 'bakul' && currentQ.words && currentQ.words[activeBakulWordIndex] && (
                 <div style={{ textAlign: 'center', width: '100%' }}>
                     <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', marginBottom: '20px' }}>Tekan perkataan, kemudian tekan bakul yang betul!</p>
                     
                     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                         <div className="neo-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                             <span>{currentQ.words[activeBakulWordIndex].image}</span>
                             <span>{currentQ.words[activeBakulWordIndex].text}</span>
                         </div>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                         <button className="neo-box" onClick={() => handleBakulClick('A')} style={{ backgroundColor: selectedOption === 'A' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#fef08a') : '#fef08a', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                             <span style={{ fontSize: '3rem' }}>🧺</span>
                             <strong style={{ color: selectedOption === 'A' && feedback ? 'white' : '#854d0e' }}>{currentQ.bakulATitle || 'Bakul A'}</strong>
                             <span style={{ fontSize: '0.9rem', color: selectedOption === 'A' && feedback ? 'white' : '#a16207' }}>{currentQ.bakulADesc || 'Bermula Vokal "A"'}</span>
                         </button>
                         <button className="neo-box" onClick={() => handleBakulClick('B')} style={{ backgroundColor: selectedOption === 'B' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#bae6fd') : '#bae6fd', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                             <span style={{ fontSize: '3rem' }}>🧺</span>
                             <strong style={{ color: selectedOption === 'B' && feedback ? 'white' : '#075985' }}>{currentQ.bakulBTitle || 'Bakul B'}</strong>
                             <span style={{ fontSize: '0.9rem', color: selectedOption === 'B' && feedback ? 'white' : '#0ea5e9' }}>{currentQ.bakulBDesc || 'Bermula Vokal "I/U/E/O"'}</span>
                         </button>
                     </div>
                 </div>
             )}

             {/* Options for non-bakul types */}
             {currentQ.options && (
                 <div style={{ display: 'grid', gridTemplateColumns: currentQ.type === 'susun' ? \`repeat(\${currentQ.options.length}, 1fr)\` : '1fr 1fr', gap: '15px', width: '100%' }}>
                     {currentQ.options.map((opt: string, i: number) => {
                         let btnBg = 'bg-white';
                         let textColor = 'var(--color-dark)';
                         let btnStyle = { padding: '20px', fontSize: '1.8rem', textTransform: 'none' as const, opacity: 1, pointerEvents: 'auto' as const, color: textColor };
                         
                         if (currentQ.type === 'susun') {
                             if (susunSlots.includes(opt)) {
                                 btnStyle.opacity = 0.5;
                                 btnStyle.pointerEvents = 'none';
                             }
                         } else {
                             if (selectedOption === opt) {
                                 btnBg = feedback === 'correct' ? 'bg-green' : feedback === 'wrong' ? 'bg-red' : 'bg-white';
                                 if (feedback) btnStyle.color = 'white';
                             }
                         }

                         return (
                             <button 
                                 key={i} 
                                 className={\`neo-btn \${btnBg}\`} 
                                 style={btnStyle}
                                 onClick={() => handleOptionClick(opt)}
                             >
                                 {opt}
                             </button>
                         );
                     })}
                 </div>
             )}
             
          </motion.div>
        )}

        {/* Result Screen */}
        {gameState === 'result' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neo-box" style={{ textAlign: 'center', maxWidth: '500px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-dark)' }}>
                    {score === 10 ? 'Sempurna!' : score >= 7 ? 'Tahniah!' : score >= 4 ? 'Cuba Lagi!' : 'Jangan Putus Asa!'}
                </h2>
                
                <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
                    {[1, 2, 3].map(star => (
                        <i key={star} className="fa-solid fa-star" style={{ 
                            fontSize: '4rem', 
                            color: score >= (star === 1 ? 4 : star === 2 ? 7 : 10) ? 'var(--color-yellow)' : '#e2e8f0',
                            WebkitTextStroke: '2px var(--color-dark)'
                        }}></i>
                    ))}
                </div>
                
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Anda mendapat {score} daripada 10 markah.</p>
                
                <button className="neo-btn bg-orange" onClick={onClose} style={{ padding: '15px 30px', fontSize: '1.2rem', width: '100%', marginTop: '20px' }}>
                    <i className="fa-solid fa-arrow-right"></i> Teruskan
                </button>
            </motion.div>
        )}

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', fileContent);
console.log('Successfully updated CabaranSukuKataGame.tsx with single-concept datasets.');
