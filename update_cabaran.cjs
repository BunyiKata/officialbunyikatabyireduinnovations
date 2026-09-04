const fs = require('fs');

const fileContent = `import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface GameProps {
  onClose: () => void;
}

const CABARAN_DATA: Record<string, any[]> = {
  // === PETA 1: KENAL HURUF ===
  kenali_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'padan', image: '🍎', imageText: 'Ayam / Epal (A)', options: ['A', 'B', 'C', 'D'], answer: 'A' },
    { type: 'lengkap', image: '🐟', imageText: 'ikan', prefix: '___', suffix: 'kan', options: ['i', 'a', 'u', 'e'], answer: 'i' },
    { type: 'susun', image: '🔤', imageText: 'A B C', syllables: ['A', 'B', 'C'], options: ['C', 'A', 'B'] },
    { type: 'teka', image: '🐱', imageText: 'kucing', text: 'K _ C I N G', options: ['U', 'A', 'I', 'E'], answer: 'U' },
    { type: 'dengar', audio: 'm', options: ['m', 'n', 'w', 'v'], answer: 'm' },
    { type: 'padan', image: '🚗', imageText: 'Kereta (K)', options: ['K', 'G', 'C', 'P'], answer: 'K' },
    { type: 'teka', image: '🎈', imageText: 'belon', text: 'B _ L O N', options: ['E', 'A', 'I', 'O'], answer: 'E' },
    { type: 'bakul', words: [{ id: 1, text: 'A', image: '🔤', category: 'A' }, { id: 2, text: 'b', image: '🔡', category: 'B' }, { id: 3, text: 'M', image: '🔤', category: 'A' }, { id: 4, text: 'k', image: '🔡', category: 'B' }], bakulATitle: 'Huruf Besar', bakulADesc: 'Contoh: A, M, K', bakulBTitle: 'Huruf Kecil', bakulBDesc: 'Contoh: a, b, k' },
    { type: 'susun', image: '🔡', imageText: 'x y z', syllables: ['x', 'y', 'z'], options: ['z', 'x', 'y'] }
  ],
  kenal_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'padan', image: '🍎', imageText: 'Ayam / Epal (A)', options: ['A', 'B', 'C', 'D'], answer: 'A' },
    { type: 'lengkap', image: '🐟', imageText: 'ikan', prefix: '___', suffix: 'kan', options: ['i', 'a', 'u', 'e'], answer: 'i' },
    { type: 'susun', image: '🔤', imageText: 'A B C', syllables: ['A', 'B', 'C'], options: ['C', 'A', 'B'] },
    { type: 'teka', image: '🐱', imageText: 'kucing', text: 'K _ C I N G', options: ['U', 'A', 'I', 'E'], answer: 'U' },
    { type: 'dengar', audio: 'm', options: ['m', 'n', 'w', 'v'], answer: 'm' },
    { type: 'padan', image: '🚗', imageText: 'Kereta (K)', options: ['K', 'G', 'C', 'P'], answer: 'K' },
    { type: 'teka', image: '🎈', imageText: 'belon', text: 'B _ L O N', options: ['E', 'A', 'I', 'O'], answer: 'E' },
    { type: 'bakul', words: [{ id: 1, text: 'A', image: '🔤', category: 'A' }, { id: 2, text: 'b', image: '🔡', category: 'B' }, { id: 3, text: 'M', image: '🔤', category: 'A' }, { id: 4, text: 'k', image: '🔡', category: 'B' }], bakulATitle: 'Huruf Besar', bakulADesc: 'Contoh: A, M, K', bakulBTitle: 'Huruf Kecil', bakulBDesc: 'Contoh: a, b, k' },
    { type: 'susun', image: '🔡', imageText: 'x y z', syllables: ['x', 'y', 'z'], options: ['z', 'x', 'y'] }
  ],
  huruf_vokal: [
    { type: 'dengar', audio: 'a', options: ['a', 'i', 'u', 'o'], answer: 'a' },
    { type: 'padan', image: '🐔', imageText: 'ayam', options: ['a', 'e', 'i', 'u'], answer: 'a' },
    { type: 'padan', image: '🐟', imageText: 'ikan', options: ['i', 'u', 'o', 'a'], answer: 'i' },
    { type: 'padan', image: '🐍', imageText: 'ular', options: ['u', 'a', 'e', 'o'], answer: 'u' },
    { type: 'lengkap', image: '🧠', imageText: 'otak', prefix: '___', suffix: 'tak', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'teka', image: '🍎', imageText: 'epal', text: 'E P _ L', options: ['A', 'E', 'I', 'O'], answer: 'A' },
    { type: 'dengar', audio: 'u', options: ['u', 'o', 'a', 'i'], answer: 'u' },
    { type: 'bakul', words: [{ id: 1, text: 'ayam', image: '🐔', category: 'A' }, { id: 2, text: 'ikan', image: '🐟', category: 'A' }, { id: 3, text: 'bola', image: '⚽', category: 'B' }, { id: 4, text: 'kuda', image: '🐴', category: 'B' }], bakulATitle: 'Mula Vokal', bakulADesc: 'A, E, I, O, U', bakulBTitle: 'Mula Konsonan', bakulBDesc: 'B, C, D, K, ...' },
    { type: 'susun', image: '🗣️', imageText: 'a e i', syllables: ['a', 'e', 'i'], options: ['e', 'a', 'i'] },
    { type: 'teka', image: '👵', imageText: 'ibu', text: 'I B _', options: ['U', 'A', 'E', 'O'], answer: 'U' }
  ],
  huruf_konsonan: [
    { type: 'dengar', audio: 'ba', options: ['b', 'd', 'p', 't'], answer: 'b' },
    { type: 'padan', image: '⚽', imageText: 'bola', options: ['b', 'p', 'd', 't'], answer: 'b' },
    { type: 'padan', image: '📖', imageText: 'buku', options: ['b', 'k', 's', 'm'], answer: 'b' },
    { type: 'padan', image: '☕', imageText: 'cawan', options: ['c', 's', 'k', 'j'], answer: 'c' },
    { type: 'lengkap', image: '🪑', imageText: 'meja', prefix: 'me', suffix: '___', options: ['ja', 'ba', 'ka', 'ta'], answer: 'ja' },
    { type: 'teka', image: '🐴', imageText: 'kuda', text: 'K _ D A', options: ['U', 'A', 'I', 'O'], answer: 'U' },
    { type: 'dengar', audio: 'ka', options: ['k', 'c', 'g', 'q'], answer: 'k' },
    { type: 'susun', image: '🚗', imageText: 'keta', syllables: ['ke', 'ta'], options: ['ta', 'ke'] },
    { type: 'bakul', words: [{ id: 1, text: 'b', image: '🅱️', category: 'A' }, { id: 2, text: 'a', image: '🅰️', category: 'B' }, { id: 3, text: 'k', image: '🔤', category: 'A' }, { id: 4, text: 'i', image: 'ℹ️', category: 'B' }], bakulATitle: 'Konsonan', bakulADesc: 'B, K, C, D', bakulBTitle: 'Vokal', bakulBDesc: 'A, I, U, E, O' },
    { type: 'padan', image: '🪴', imageText: 'pasu', options: ['p', 'b', 'f', 'v'], answer: 'p' }
  ],
  fonik_abc: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'padan', image: '🦆', imageText: 'Bebek (b)', options: ['b', 'd', 'p', 't'], answer: 'b' },
    { type: 'lengkap', image: '🐱', imageText: 'cat', prefix: 'c', suffix: '___', options: ['at', 'ut', 'it', 'et'], answer: 'at' },
    { type: 'teka', image: '🐕', imageText: 'dog', text: 'd _ g', options: ['o', 'a', 'e', 'u'], answer: 'o' },
    { type: 'susun', image: '🎵', imageText: 'a b c', syllables: ['a', 'b', 'c'], options: ['b', 'a', 'c'] },
    { type: 'dengar', audio: 'f', options: ['f', 'v', 's', 'z'], answer: 'f' },
    { type: 'padan', image: '☀️', imageText: 'Sun (s)', options: ['s', 'z', 'c', 'k'], answer: 's' },
    { type: 'lengkap', image: '📦', imageText: 'box', prefix: 'b', suffix: '___', options: ['ox', 'ax', 'ix', 'ex'], answer: 'ox' },
    { type: 'bakul', words: [{ id: 1, text: 'ba', image: '🐑', category: 'A' }, { id: 2, text: 'ca', image: '☕', category: 'B' }, { id: 3, text: 'bi', image: '🐝', category: 'A' }, { id: 4, text: 'cu', image: '🥄', category: 'B' }], bakulATitle: 'Bunyi "B"', bakulADesc: 'ba, bi, bu', bakulBTitle: 'Bunyi "C"', bakulBDesc: 'ca, ci, cu' },
    { type: 'teka', image: '🐸', imageText: 'frog', text: 'f _ o g', options: ['r', 'l', 'm', 'n'], answer: 'r' }
  ],

  // === PETA 2: SUKU KATA ASAS ===
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

  // === PETA 3: SUKU KATA HERO ===
  suku_kata_kv_kvk: [
    { type: 'padan', image: '👟', imageText: 'kasut', options: ['kasut', 'kaset', 'kasur', 'kasap'], answer: 'kasut' },
    { type: 'padan', image: '☕', imageText: 'cawan', options: ['cawan', 'cawat', 'cawar', 'cawas'], answer: 'cawan' },
    { type: 'lengkap', image: '🐘', imageText: 'gajah', prefix: 'ga', suffix: '___', options: ['jah', 'juh', 'jih', 'joh'], answer: 'jah' },
    { type: 'susun', image: '🚢', imageText: 'kapal', syllables: ['ka', 'pal'], options: ['pal', 'ka'] },
    { type: 'teka', image: '🏊', imageText: 'kolam', text: 'k o _ a m', options: ['l', 'm', 'r', 's'], answer: 'l' },
    { type: 'dengar', audio: 'kasut', options: ['kasut', 'kapus', 'kasap', 'kasur'], answer: 'kasut' },
    { type: 'lengkap', image: '🌲', imageText: 'hutan', prefix: 'hu', suffix: '___', options: ['tan', 'tin', 'tun', 'ten'], answer: 'tan' },
    { type: 'susun', image: '🪰', imageText: 'lalat', syllables: ['la', 'lat'], options: ['lat', 'la'] },
    { type: 'teka', image: '🛣️', imageText: 'jalan', text: 'j a _ a n', options: ['l', 'm', 'r', 'n'], answer: 'l' },
    { type: 'bakul', words: [{ id: 1, text: 'kasut', image: '👟', category: 'A' }, { id: 2, text: 'cawan', image: '☕', category: 'A' }, { id: 3, text: 'gajah', image: '🐘', category: 'B' }, { id: 4, text: 'kapal', image: '🚢', category: 'B' }], bakulATitle: 'Mula "KA/CA"', bakulADesc: 'kasut, cawan', bakulBTitle: 'Mula "GA/KA"', bakulBDesc: 'gajah, kapal' }
  ],
  suku_kata_kvk_kv: [
    { type: 'padan', image: '🐄', imageText: 'lembu', options: ['lembu', 'lampu', 'pintu', 'bomba'], answer: 'lembu' },
    { type: 'padan', image: '💡', imageText: 'lampu', options: ['lampu', 'lembu', 'pintu', 'kunci'], answer: 'lampu' },
    { type: 'padan', image: '🚪', imageText: 'pintu', options: ['pintu', 'panti', 'penti', 'pantu'], answer: 'pintu' },
    { type: 'lengkap', image: '🚒', imageText: 'bomba', prefix: 'bom', suffix: '___', options: ['ba', 'bi', 'bu', 'bo'], answer: 'ba' },
    { type: 'susun', image: '🔑', imageText: 'kunci', syllables: ['kun', 'ci'], options: ['ci', 'kun'] },
    { type: 'teka', image: '🍴', imageText: 'garfu', text: 'g a r _ u', options: ['f', 'v', 'p', 'b'], answer: 'f' },
    { type: 'dengar', audio: 'lembu', options: ['lembu', 'lambu', 'limbu', 'lumbu'], answer: 'lembu' },
    { type: 'susun', image: '🚕', imageText: 'teksi', syllables: ['tek', 'si'], options: ['si', 'tek'] },
    { type: 'lengkap', image: '🛌', imageText: 'mimpi', prefix: 'mim', suffix: '___', options: ['pi', 'pa', 'pu', 'pe'], answer: 'pi' },
    { type: 'bakul', words: [{ id: 1, text: 'lembu', image: '🐄', category: 'A' }, { id: 2, text: 'lampu', image: '💡', category: 'A' }, { id: 3, text: 'pintu', image: '🚪', category: 'B' }, { id: 4, text: 'bomba', image: '🚒', category: 'B' }], bakulATitle: 'Mula "L"', bakulADesc: 'lembu, lampu', bakulBTitle: 'Mula "P/B"', bakulBDesc: 'pintu, bomba' }
  ],
  suku_kata_kvk_kvk: [
    { type: 'padan', image: '👨‍⚕️', imageText: 'doktor', options: ['doktor', 'biskut', 'kertas', 'sampul'], answer: 'doktor' },
    { type: 'padan', image: '🍪', imageText: 'biskut', options: ['biskut', 'baskit', 'beskut', 'buskut'], answer: 'biskut' },
    { type: 'lengkap', image: '📄', imageText: 'kertas', prefix: 'ker', suffix: '___', options: ['tas', 'tis', 'tus', 'tes'], answer: 'tas' },
    { type: 'susun', image: '✉️', imageText: 'sampul', syllables: ['sam', 'pul'], options: ['pul', 'sam'] },
    { type: 'teka', image: '🏃', imageText: 'lompat', text: 'l o m _ a t', options: ['p', 'b', 't', 'k'], answer: 'p' },
    { type: 'dengar', audio: 'doktor', options: ['doktor', 'dakbar', 'dikter', 'doktur'], answer: 'doktor' },
    { type: 'lengkap', image: '🌱', imageText: 'rumput', prefix: 'rum', suffix: '___', options: ['put', 'pat', 'pit', 'pot'], answer: 'put' },
    { type: 'susun', image: '💍', imageText: 'cincin', syllables: ['cin', 'cin'], options: ['cin', 'cin'] },
    { type: 'teka', image: '✂️', imageText: 'potong', text: 'p o _ o n g', options: ['t', 'k', 'p', 's'], answer: 't' },
    { type: 'bakul', words: [{ id: 1, text: 'doktor', image: '👨‍⚕️', category: 'A' }, { id: 2, text: 'biskut', image: '🍪', category: 'A' }, { id: 3, text: 'kertas', image: '📄', category: 'B' }, { id: 4, text: 'sampul', image: '✉️', category: 'B' }], bakulATitle: 'KVK-KVK A', bakulADesc: 'doktor, biskut', bakulBTitle: 'KVK-KVK B', bakulBDesc: 'kertas, sampul' }
  ],
  suku_kata_kvkk: [
    { type: 'padan', image: '🏦', imageText: 'bank', options: ['bank', 'zink', 'teks', 'gong'], answer: 'bank' },
    { type: 'padan', image: '🧪', imageText: 'zink', options: ['zink', 'bank', 'teks', 'gong'], answer: 'zink' },
    { type: 'padan', image: '📄', imageText: 'teks', options: ['teks', 'taks', 'toks', 'tuks'], answer: 'teks' },
    { type: 'lengkap', image: '🔔', imageText: 'gong', prefix: 'g', suffix: '___', options: ['ong', 'ang', 'ing', 'ung'], answer: 'ong' },
    { type: 'teka', image: '🏦', imageText: 'bank', text: 'b _ n k', options: ['a', 'e', 'i', 'u'], answer: 'a' },
    { type: 'susun', image: '🚐', imageText: 'van', syllables: ['v', 'a', 'n'], options: ['a', 'v', 'n'] },
    { type: 'dengar', audio: 'bank', options: ['bank', 'bunk', 'benk', 'bink'], answer: 'bank' },
    { type: 'lengkap', image: '🧁', imageText: 'kek', prefix: 'k', suffix: '___', options: ['ek', 'ak', 'ik', 'ok'], answer: 'ek' },
    { type: 'teka', image: '🧪', imageText: 'zink', text: 'z _ n k', options: ['i', 'a', 'e', 'u'], answer: 'i' },
    { type: 'bakul', words: [{ id: 1, text: 'bank', image: '🏦', category: 'A' }, { id: 2, text: 'zink', image: '🧪', category: 'A' }, { id: 3, text: 'teks', image: '📄', category: 'B' }, { id: 4, text: 'gong', image: '🔔', category: 'B' }], bakulATitle: 'Hujung "nk"', bakulADesc: 'bank, zink', bakulBTitle: 'Hujung Lain', bakulBDesc: 'teks, gong' }
  ],
  suku_kata_kv_kv_kvk: [
    { type: 'susun', image: '🚲', imageText: 'basikal', syllables: ['ba', 'si', 'kal'], options: ['kal', 'si', 'ba'] },
    { type: 'susun', image: '🦗', imageText: 'belalang', syllables: ['be', 'la', 'lang'], options: ['lang', 'be', 'la'] },
    { type: 'padan', image: '🏫', imageText: 'sekolah', options: ['sekolah', 'basikal', 'belalang', 'ketupat'], answer: 'sekolah' },
    { type: 'lengkap', image: '🧹', imageText: 'pemadam', prefix: 'pe + ma', suffix: '___', options: ['dam', 'dim', 'dum', 'dem'], answer: 'dam' },
    { type: 'susun', image: '🍙', imageText: 'ketupat', syllables: ['ke', 'tu', 'pat'], options: ['pat', 'tu', 'ke'] },
    { type: 'padan', image: '📐', imageText: 'pembaris', options: ['pembaris', 'pemadam', 'sekolah', 'ketupat'], answer: 'pembaris' },
    { type: 'dengar', audio: 'basikal', options: ['basikal', 'besekel', 'busikul', 'bosokol'], answer: 'basikal' },
    { type: 'teka', image: '🚲', imageText: 'basikal', text: 'b a _ i k a l', options: ['s', 'z', 'c', 'k'], answer: 's' },
    { type: 'lengkap', image: '🏫', imageText: 'sekolah', prefix: 'se + ko', suffix: '___', options: ['lah', 'lih', 'luh', 'leh'], answer: 'lah' },
    { type: 'bakul', words: [{ id: 1, text: 'basikal', image: '🚲', category: 'A' }, { id: 2, text: 'belalang', image: '🦗', category: 'A' }, { id: 3, text: 'sekolah', image: '🏫', category: 'B' }, { id: 4, text: 'ketupat', image: '🍙', category: 'B' }], bakulATitle: 'Mula "BA/BE"', bakulADesc: 'basikal, belalang', bakulBTitle: 'Mula "SE/KE"', bakulBDesc: 'sekolah, ketupat' }
  ],
  suku_kata_kvk_kv_kvk: [
    { type: 'susun', image: '🍈', imageText: 'cempedak', syllables: ['cem', 'pe', 'dak'], options: ['dak', 'cem', 'pe'] },
    { type: 'susun', image: '💀', imageText: 'tengkorak', syllables: ['teng', 'ko', 'rak'], options: ['rak', 'teng', 'ko'] },
    { type: 'padan', image: '🍈', imageText: 'cempedak', options: ['cempedak', 'tengkorak', 'sempurna', 'sembayang'], answer: 'cempedak' },
    { type: 'lengkap', image: '💀', imageText: 'tengkorak', prefix: 'teng + ko', suffix: '___', options: ['rak', 'rik', 'ruk', 'rek'], answer: 'rak' },
    { type: 'dengar', audio: 'cempedak', options: ['cempedak', 'campadak', 'cimpedik', 'cumpeduk'], answer: 'cempedak' },
    { type: 'teka', image: '✨', imageText: 'sempurna', text: 's e m _ u r n a', options: ['p', 'b', 't', 'k'], answer: 'p' },
    { type: 'susun', image: '🙏', imageText: 'sembayang', syllables: ['sem', 'ba', 'yang'], options: ['yang', 'ba', 'sem'] },
    { type: 'padan', image: '💀', imageText: 'tengkorak', options: ['tengkorak', 'tangkarak', 'tingkirik', 'tungkuruk'], answer: 'tengkorak' },
    { type: 'lengkap', image: '🍈', imageText: 'cempedak', prefix: 'cem + pe', suffix: '___', options: ['dak', 'dik', 'duk', 'dek'], answer: 'dak' },
    { type: 'bakul', words: [{ id: 1, text: 'cempedak', image: '🍈', category: 'A' }, { id: 2, text: 'tengkorak', image: '💀', category: 'B' }, { id: 3, text: 'sempurna', image: '✨', category: 'A' }, { id: 4, text: 'sembayang', image: '🙏', category: 'B' }], bakulATitle: 'Cempedak/Sempurna', bakulADesc: '3 Suku Kata', bakulBTitle: 'Tengkorak/Sembayang', bakulBDesc: '3 Suku Kata' }
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
                     <button className="neo-btn bg-orange" onClick={() => playAudio(currentQ.audio)} style={{ fontSize: '3rem', padding: '20px 40px', borderRadius: '24px' }}>
                         <i className="fa-solid fa-volume-high"></i>
                     </button>
                 </div>
             )}

             {(currentQ.type === 'padan' || currentQ.type === 'lengkap' || currentQ.type === 'teka') && (
                 <div className="neo-box" style={{ backgroundColor: '#bae6fd', textAlign: 'center', padding: '20px 40px' }}>
                     <div style={{ fontSize: '4rem', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))' }}>{currentQ.image}</div>
                     {currentQ.type === 'padan' && (
                         <button className="neo-btn bg-white" onClick={() => playAudio(currentQ.imageText)} style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--color-blue)' }}>
                             <i className="fa-solid fa-volume-high"></i> Tekan Gambar
                         </button>
                     )}
                     {currentQ.type === 'lengkap' && (
                         <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '15px' }}>
                             {currentQ.prefix} + {currentQ.suffix}
                         </div>
                     )}
                     {currentQ.type === 'teka' && (
                         <div style={{ fontSize: '3rem', fontWeight: 'bold', marginTop: '15px', letterSpacing: '8px' }}>
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
                     <div style={{ display: 'flex', gap: '10px' }}>
                         {currentQ.syllables.map((_: any, i: number) => (
                             <div key={i} className="neo-box" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', border: '3px dashed white', backgroundColor: 'transparent', color: 'white', boxShadow: 'none' }}>
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
console.log('Successfully updated CabaranSukuKataGame.tsx');
