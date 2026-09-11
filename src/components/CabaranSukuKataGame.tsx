import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface GameProps {
  onClose: () => void;
}

const CABARAN_DATA: Record<string, any[]> = {

  kenal_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'h', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],
  kenali_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'h', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],
  fonik_abc: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['b', 'p', 'd', 't'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['c', 's', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'd', 'p', 'q'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['e', 'o', 'a', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'e-taling', options: ['e', 'i', 'a', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['f', 'v', 'p', 'h'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['g', 'j', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['h', 'n', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['m', 'n', 'w', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'q', options: ['q', 'p', 'b', 'd'], answer: 'q' },
    { type: 'dengar', audio: 'r', options: ['r', 'l', 'w', 'm'], answer: 'r' },
    { type: 'dengar', audio: 's', options: ['s', 'z', 'c', 'x'], answer: 's' },
    { type: 'dengar', audio: 'x', options: ['x', 's', 'z', 'k'], answer: 'x' },
    { type: 'dengar', audio: 'y', options: ['y', 'j', 'u', 'i'], answer: 'y' }
  ],
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
  vokal_konsonan: [
    { type: 'padan', image: '/images/sukukata/ayam.png', imageText: 'ayam', audio: 'ayam', answer: 'a', options: ['a', 'b', 'c', 'd'] },
    { type: 'padan', image: '/images/sukukata/epal.png', imageText: 'epal', audio: 'epal', answer: 'e', options: ['e', 'i', 'o', 'u'] },
    { type: 'padan', image: '/images/sukukata/ikan.png', imageText: 'ikan', audio: 'ikan', answer: 'i', options: ['i', 'a', 'e', 'o'] },
    { type: 'padan', image: '/images/sukukata/otak.png', imageText: 'otak', audio: 'otak', answer: 'o', options: ['o', 'u', 'e', 'a'] },
    { type: 'padan', image: '/images/sukukata/ular.png', imageText: 'ular', audio: 'ular', answer: 'u', options: ['u', 'a', 'i', 'o'] },
    { type: 'padan', image: '/images/sukukata/beca.png', imageText: 'beca', audio: 'beca', answer: 'b', options: ['b', 'd', 'p', 't'] },
    { type: 'padan', image: '/images/sukukata/cawan.png', imageText: 'cawan', audio: 'cawan', answer: 'c', options: ['c', 's', 'k', 'z'] },
    { type: 'padan', image: '/images/sukukata/gajah.png', imageText: 'gajah', audio: 'gajah', answer: 'g', options: ['g', 'j', 'k', 'q'] },
    { type: 'padan', image: '/images/sukukata/mata.png', imageText: 'mata', audio: 'mata', answer: 'm', options: ['m', 'n', 'w', 'v'] },
    { type: 'padan', image: '/images/sukukata/tali.png', imageText: 'tali', audio: 'tali', answer: 't', options: ['t', 'd', 'b', 'l'] }
  ],
  pengenalan_nombor: [
    { type: 'padan', image: '0', imageText: '', options: ['0', '1', '2', '3'], answer: '0' },
    { type: 'padan', image: '🍪', imageText: '', options: ['1', '2', '3', '4'], answer: '1' },
    { type: 'padan', image: '🍪 🍪', imageText: '', options: ['2', '3', '4', '5'], answer: '2' },
    { type: 'padan', image: '🍪 🍪 🍪', imageText: '', options: ['3', '4', '5', '6'], answer: '3' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪', imageText: '', options: ['4', '5', '6', '7'], answer: '4' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['5', '6', '7', '8'], answer: '5' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['6', '7', '8', '9'], answer: '6' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['7', '8', '9', '10'], answer: '7' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['8', '9', '10', '0'], answer: '8' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['9', '10', '0', '1'], answer: '9' },
    { type: 'padan', image: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', imageText: '', options: ['10', '0', '1', '2'], answer: '10' }
  ],
  bilang_siri_nombor: [
    { type: 'padan', image: '1️⃣0️⃣', imageText: 'sepuluh', options: ['sepuluh', 'dua puluh', 'tiga puluh', 'empat puluh'], answer: 'sepuluh' },
    { type: 'padan', image: '2️⃣0️⃣', imageText: 'dua puluh', options: ['dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh'], answer: 'dua puluh' },
    { type: 'padan', image: '3️⃣0️⃣', imageText: 'tiga puluh', options: ['tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh'], answer: 'tiga puluh' },
    { type: 'padan', image: '4️⃣0️⃣', imageText: 'empat puluh', options: ['empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh'], answer: 'empat puluh' },
    { type: 'padan', image: '5️⃣0️⃣', imageText: 'lima puluh', options: ['lima puluh', 'enam puluh', 'tujuh puluh', 'lapan puluh'], answer: 'lima puluh' },
    { type: 'padan', image: '6️⃣0️⃣', imageText: 'enam puluh', options: ['enam puluh', 'tujuh puluh', 'lapan puluh', 'sembilan puluh'], answer: 'enam puluh' },
    { type: 'padan', image: '7️⃣0️⃣', imageText: 'tujuh puluh', options: ['tujuh puluh', 'lapan puluh', 'sembilan puluh', 'seratus'], answer: 'tujuh puluh' },
    { type: 'padan', image: '8️⃣0️⃣', imageText: 'lapan puluh', options: ['lapan puluh', 'sembilan puluh', 'seratus', 'sepuluh'], answer: 'lapan puluh' },
    { type: 'padan', image: '9️⃣0️⃣', imageText: 'sembilan puluh', options: ['sembilan puluh', 'seratus', 'sepuluh', 'dua puluh'], answer: 'sembilan puluh' },
    { type: 'padan', image: '💯', imageText: 'seratus', options: ['seratus', 'sepuluh', 'dua puluh', 'tiga puluh'], answer: 'seratus' }
  ],
  konsep_tambah: [
    { type: 'padan', image: '1 + 1 = ?', audio: '1 + 1', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '1 + 2 = ?', audio: '1 + 2', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 3 = ?', audio: '1 + 3', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 4 = ?', audio: '1 + 4', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 5 = ?', audio: '1 + 5', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 6 = ?', audio: '1 + 6', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 7 = ?', audio: '1 + 7', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 8 = ?', audio: '1 + 8', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 9 = ?', audio: '1 + 9', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '0 + 0 = ?', audio: '0 + 0', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '0' }
  ],
  konsep_penolakan: [
    { type: 'padan', image: '10 - 1 = ?', audio: '10 - 1', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 2 = ?', audio: '10 - 2', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 3 = ?', audio: '10 - 3', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 4 = ?', audio: '10 - 4', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 5 = ?', audio: '10 - 5', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 6 = ?', audio: '10 - 6', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 7 = ?', audio: '10 - 7', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 8 = ?', audio: '10 - 8', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '10 - 9 = ?', audio: '10 - 9', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪' },
    { type: 'padan', image: '10 - 10 = ?', audio: '10 - 10', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '0' }
  ]
};


function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MODULE_FLASHCARDS: Record<string, Array<{ front: string; back: string; icon: string }>> = {
  suku_kata_kvk: [
    { front: 'bas', back: 'BAS', icon: '<img src="/images/sukukata/bas.png" class="sk-icon-img" alt="bas"/>' },
    { front: 'beg', back: 'BEG', icon: '<img src="/images/sukukata/beg.png" class="sk-icon-img" alt="beg"/>' },
    { front: 'bot', back: 'BOT', icon: '<img src="/images/sukukata/bot.png" class="sk-icon-img" alt="bot"/>' },
    { front: 'cat', back: 'CAT', icon: '<img src="/images/sukukata/cat.png" class="sk-icon-img" alt="cat"/>' },
    { front: 'jag', back: 'JAG', icon: '<img src="/images/sukukata/jag.png" class="sk-icon-img" alt="jag"/>' },
    { front: 'jam', back: 'JAM', icon: '<img src="/images/sukukata/jam.png" class="sk-icon-img" alt="jam"/>' },
    { front: 'jem', back: 'JEM', icon: '<img src="/images/sukukata/jem.png" class="sk-icon-img" alt="jem"/>' },
    { front: 'jet', back: 'JET', icon: '<img src="/images/sukukata/jet.png" class="sk-icon-img" alt="jet"/>' },
    { front: 'kek', back: 'KEK', icon: '<img src="/images/sukukata/kek.png" class="sk-icon-img" alt="kek"/>' },
    { front: 'kot', back: 'KOT', icon: '<img src="/images/sukukata/kot.png" class="sk-icon-img" alt="kot"/>' },
    { front: 'pam', back: 'PAM', icon: '<img src="/images/sukukata/pam.png" class="sk-icon-img" alt="pam"/>' },
    { front: 'pen', back: 'PEN', icon: '<img src="/images/sukukata/pen.png" class="sk-icon-img" alt="pen"/>' },
    { front: 'pil', back: 'PIL', icon: '<img src="/images/sukukata/pil.png" class="sk-icon-img" alt="pil"/>' },
    { front: 'pin', back: 'PIN', icon: '<img src="/images/sukukata/pin.png" class="sk-icon-img" alt="pin"/>' },
    { front: 'rak', back: 'RAK', icon: '<img src="/images/sukukata/rak.png" class="sk-icon-img" alt="rak"/>' },
    { front: 'rim', back: 'RIM', icon: '<img src="/images/sukukata/rim.png" class="sk-icon-img" alt="rim"/>' },
    { front: 'ros', back: 'ROS', icon: '<img src="/images/sukukata/ros.png" class="sk-icon-img" alt="ros"/>' },
    { front: 'sup', back: 'SUP', icon: '<img src="/images/sukukata/sup.png" class="sk-icon-img" alt="sup"/>' },
    { front: 'tin', back: 'TIN', icon: '<img src="/images/sukukata/tin.png" class="sk-icon-img" alt="tin"/>' },
    { front: 'van', back: 'VAN', icon: '<img src="/images/sukukata/van.png" class="sk-icon-img" alt="van"/>' }
  ],
  suku_kata_v_kv: [
    { front: 'a - lu', back: 'ALU', icon: '🔨' }, { front: 'a - pi', back: 'API', icon: '🔥' },
    { front: 'i - bu', back: 'IBU', icon: '👩' }, { front: 'i - si', back: 'ISI', icon: '🥩' },
    { front: 'u - bi', back: 'UBI', icon: '🥔' }, { front: 'u - lu', back: 'ULU', icon: '⛰️' }
  ],
  suku_kata_v_kvk: [
    { front: 'a - yam', back: 'AYAM', icon: '🐔' }, { front: 'a - nak', back: 'ANAK', icon: '👶' },
    { front: 'a - wan', back: 'AWAN', icon: '☁️' }, { front: 'e - nam', back: 'ENAM', icon: '6️⃣' },
    { front: 'e - pal', back: 'EPAL', icon: '🍎' }, { front: 'i - kan', back: 'IKAN', icon: '🐟' },
    { front: 'i - tik', back: 'ITIK', icon: '🦆' }, { front: 'o - bor', back: 'OBOR', icon: '🔦' },
    { front: 'o - tak', back: 'OTAK', icon: '🧠' }, { front: 'u - bat', back: 'UBAT', icon: '💊' }
  ],
  suku_kata_kvk_kvk: [
    { front: 'bis - kut', back: 'BISKUT', icon: '🍪' }, { front: 'cer - min', back: 'CERMIN', icon: '<img src="/images/sukukata/cermin.png" class="sk-icon-img" alt="cermin"/>' },
    { front: 'cin - cin', back: 'CINCIN', icon: '💍' }, { front: 'dok - tor', back: 'DOKTOR', icon: '👨‍⚕️' },
    { front: 'man - cis', back: 'MANCIS', icon: '🔥' }, { front: 'mas - jid', back: 'MASJID', icon: '🕌' },
    { front: 'ram - but', back: 'RAMBUT', icon: '💇' }, { front: 'rum - put', back: 'RUMPUT', icon: '🌿' },
    { front: 'sam - pah', back: 'SAMPAH', icon: '🗑️' }, { front: 'sam - pan', back: 'SAMPAN', icon: '🛶' }
  ],
  suku_kata_kvk_kv: [
    { front: 'bal - di', back: 'BALDI', icon: '🪣' }, { front: 'ben - di', back: 'BENDI', icon: '🥬' },
    { front: 'gar - pu', back: 'GARPU', icon: '<img src="/images/sukukata/garpu.png" class="sk-icon-img" alt="garpu"/>' }, { front: 'jam - bu', back: 'JAMBU', icon: '🍐' },
    { front: 'kun - ci', back: 'KUNCI', icon: '🔑' }, { front: 'lam - pu', back: 'LAMPU', icon: '💡' },
    { front: 'lem - bu', back: 'LEMBU', icon: '🐄' }, { front: 'pin - tu', back: 'PINTU', icon: '🚪' }
  ],
  suku_kata_kvkk: [
    { front: 'bank', back: 'BANK', icon: '🏦' }, { front: 'gong', back: 'GONG', icon: '🪘' },
    { front: 'jong', back: 'JONG', icon: '⛵' }, { front: 'tong', back: 'TONG', icon: '🛢️' },
    { front: 'wang', back: 'WANG', icon: '💵' }, { front: 'zink', back: 'ZINK', icon: '🏗️' }
  ],
  suku_kata_kv_kv_kvk: [
    { front: 'ba - si - kal', back: 'BASIKAL', icon: '🚲' }, { front: 'ke - la - war', back: 'KELAWAR', icon: '🦇' },
    { front: 'ke - le - dek', back: 'KELEDEK', icon: '🍠' }, { front: 'ke - tu - pat', back: 'KETUPAT', icon: '🍙' },
    { front: 'pi - ra - mid', back: 'PIRAMID', icon: '🔺' }, { front: 'pu - la - san', back: 'PULASAN', icon: '🌰' },
    { front: 'te - le - fon', back: 'TELEFON', icon: '☎️' }, { front: 'te - ti - kus', back: 'TETIKUS', icon: '🖱️' },
    { front: 'zi - ra - fah', back: 'ZIRAFAH', icon: '🦒' }
  ],
  suku_kata_kvk_kv_kvk: [
    { front: 'cem - pe - dak', back: 'CEMPEDAK', icon: '🍈' }, { front: 'cen - da - wan', back: 'CENDAWAN', icon: '🍄' },
    { front: 'jam - ba - tan', back: 'JAMBATAN', icon: '🌉' }, { front: 'kom - pu - ter', back: 'KOMPUTER', icon: '💻' },
    { front: 'pem - ba - ris', back: 'PEMBARIS', icon: '📏' }, { front: 'tem - pa - yan', back: 'TEMPAYAN', icon: '🏺' }
  ]
};

const VOKAL_QUESTION_ITEMS: Record<string, Array<{ word: string; letter: string; image: string }>> = {
  a: [
    { word: 'ayam', letter: 'a', image: '/images/sukukata/ayam.png' },
    { word: 'api', letter: 'a', image: '/images/sukukata/api.png' },
    { word: 'alu', letter: 'a', image: '/images/sukukata/alu.png' }
  ],
  e: [
    { word: 'epal', letter: 'e', image: '/images/sukukata/epal.png' },
    { word: 'enam', letter: 'e', image: '/images/sukukata/enam.png' }
  ],
  i: [
    { word: 'ikan', letter: 'i', image: '/images/sukukata/ikan.png' },
    { word: 'itik', letter: 'i', image: '/images/sukukata/itik.png' },
    { word: 'ibu', letter: 'i', image: '/images/sukukata/ibu.png' },
    { word: 'isi', letter: 'i', image: '/images/sukukata/isi.png' }
  ],
  o: [
    { word: 'otak', letter: 'o', image: '/images/sukukata/otak.png' },
    { word: 'obor', letter: 'o', image: '/images/sukukata/obor.png' },
    { word: 'oren', letter: 'o', image: '/images/sukukata/oren.png' }
  ],
  u: [
    { word: 'ular', letter: 'u', image: '/images/sukukata/ular.png' },
    { word: 'ulat', letter: 'u', image: '/images/sukukata/ulat.png' },
    { word: 'ubi', letter: 'u', image: '/images/sukukata/ubi.png' },
    { word: 'ulu', letter: 'u', image: '/images/sukukata/ulu.png' }
  ]
};

const KONSONAN_QUESTION_ITEMS: Record<string, Array<{ word: string; letter: string; image: string }>> = {
  b: [
    { word: 'beca', letter: 'b', image: '/images/sukukata/beca.png' },
    { word: 'botol', letter: 'b', image: '/images/sukukata/botol.png' },
    { word: 'baldi', letter: 'b', image: '/images/sukukata/baldi.png' }
  ],
  c: [
    { word: 'cawan', letter: 'c', image: '/images/sukukata/cawan.png' },
    { word: 'ciku', letter: 'c', image: '/images/sukukata/ciku.png' },
    { word: 'cerek', letter: 'c', image: '/images/sukukata/cerek.png' }
  ],
  g: [
    { word: 'gajah', letter: 'g', image: '/images/sukukata/gajah.png' },
    { word: 'gitar', letter: 'g', image: '/images/sukukata/gitar.png' },
    { word: 'gelas', letter: 'g', image: '/images/sukukata/gelas.png' }
  ],
  h: [
    { word: 'harimau', letter: 'h', image: '/images/sukukata/harimau.png' }
  ],
  j: [
    { word: 'jari', letter: 'j', image: '/images/sukukata/jari.png' },
    { word: 'jam', letter: 'j', image: '/images/sukukata/jam.png' },
    { word: 'jambu', letter: 'j', image: '/images/sukukata/jambu.png' }
  ],
  k: [
    { word: 'kuku', letter: 'k', image: '/images/sukukata/kuku.png' },
    { word: 'katil', letter: 'k', image: '/images/sukukata/katil.png' },
    { word: 'kereta', letter: 'k', image: '/images/sukukata/kereta.png' }
  ],
  l: [
    { word: 'labu', letter: 'l', image: '/images/sukukata/labu.png' },
    { word: 'lampu', letter: 'l', image: '/images/sukukata/lampu.png' },
    { word: 'lilin', letter: 'l', image: '/images/sukukata/lilin.png' }
  ],
  m: [
    { word: 'mata', letter: 'm', image: '/images/sukukata/mata.png' },
    { word: 'mancis', letter: 'm', image: '/images/sukukata/mancis.png' }
  ],
  n: [
    { word: 'nasi', letter: 'n', image: '/images/sukukata/nasi.png' },
    { word: 'nanas', letter: 'n', image: '/images/sukukata/nanas.png' }
  ],
  p: [
    { word: 'paku', letter: 'p', image: '/images/sukukata/paku.png' },
    { word: 'pelita', letter: 'p', image: '/images/sukukata/pelita.png' },
    { word: 'pintu', letter: 'p', image: '/images/sukukata/pintu.png' }
  ],
  r: [
    { word: 'rusa', letter: 'r', image: '/images/sukukata/rusa.png' },
    { word: 'raga', letter: 'r', image: '/images/sukukata/raga.png' }
  ],
  s: [
    { word: 'sudu', letter: 's', image: '/images/sukukata/sudu.png' },
    { word: 'sawi', letter: 's', image: '/images/sukukata/sawi.png' },
    { word: 'sabun', letter: 's', image: '/images/sukukata/sabun.png' }
  ],
  t: [
    { word: 'tali', letter: 't', image: '/images/sukukata/tali.png' },
    { word: 'tebu', letter: 't', image: '/images/sukukata/tebu.png' },
    { word: 'tomato', letter: 't', image: '/images/sukukata/tomato.png' }
  ],
  v: [
    { word: 'van', letter: 'v', image: '/images/sukukata/van.png' }
  ],
  w: [
    { word: 'wang', letter: 'w', image: '/images/sukukata/wang.png' }
  ],
  y: [
    { word: 'yoyo', letter: 'y', image: '/images/sukukata/yoyo.png' }
  ],
  z: [
    { word: 'zirafah', letter: 'z', image: '/images/sukukata/zirafah.png' }
  ]
};

const ALL_DISTRACTOR_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];

function generateVokalKonsonanQuestions(): any[] {
  // 1. Pilih 5 soalan huruf vokal (1 daripada setiap: a, e, i, o, u)
  const vowelLetters = ['a', 'e', 'i', 'o', 'u'];
  const vowelQuestions = vowelLetters.map(letter => {
    const list = VOKAL_QUESTION_ITEMS[letter] || [];
    const picked = list[Math.floor(Math.random() * list.length)];
    const distractors = shuffleArray(ALL_DISTRACTOR_LETTERS.filter(l => l !== picked.letter)).slice(0, 3);
    return {
      type: 'padan',
      image: picked.image,
      imageText: picked.word,
      audio: picked.word,
      answer: picked.letter,
      options: shuffleArray([picked.letter, ...distractors]),
      category: 'vokal'
    };
  });

  // 2. Pilih 5 soalan huruf konsonan (5 huruf konsonan berbeza secara rawak)
  const availableConsonants = shuffleArray(Object.keys(KONSONAN_QUESTION_ITEMS)).slice(0, 5);
  const consonantQuestions = availableConsonants.map(letter => {
    const list = KONSONAN_QUESTION_ITEMS[letter] || [];
    const picked = list[Math.floor(Math.random() * list.length)];
    const distractors = shuffleArray(ALL_DISTRACTOR_LETTERS.filter(l => l !== picked.letter)).slice(0, 3);
    return {
      type: 'padan',
      image: picked.image,
      imageText: picked.word,
      audio: picked.word,
      answer: picked.letter,
      options: shuffleArray([picked.letter, ...distractors]),
      category: 'konsonan'
    };
  });

  // 3. Gabungkan 5 vokal + 5 konsonan = 10 soalan, susunan di-random
  return shuffleArray([...vowelQuestions, ...consonantQuestions]);
}

function buildQuestionsForModule(id: string): any[] {
  // Soalan Vokal & Konsonan: 10 soalan gambar (5 vokal, 5 konsonan secara rawak)
  if (id === 'vokal_konsonan') {
    return generateVokalKonsonanQuestions();
  }

  const windowData = typeof window !== 'undefined' && (window as any).moduleContentData;
  const moduleData = windowData && windowData[id];
  const flashcards = (moduleData && moduleData.flashcards) || MODULE_FLASHCARDS[id] || null;
  const items = moduleData && moduleData.items;

  // Handle Reading / Passages / Sentences (Map 4)
  if (id === 'ayat_pendek') {
    const defaultItems = [
      { text: 'Saya suka makan nasi.', audio: '/audio/bacaan-bergred/audio ayat pendek/saya suka makan nasi.MP3', image: '/images/menu-kad/ayat pendek/saya suka makan nasi.png' },
      { text: 'Ibu memasak di dapur.', audio: '/audio/bacaan-bergred/audio ayat pendek/ibu memasak di dapur.MP3', image: '/images/menu-kad/ayat pendek/ibu memasak di dapur.png' },
      { text: 'Kucing itu sangat comel.', audio: '/audio/bacaan-bergred/audio ayat pendek/kucing itu sangat comel.MP3', image: '/images/menu-kad/ayat pendek/kucing itu sangat comel.png' },
      { text: 'Adik saya suka bermain.', audio: '/audio/bacaan-bergred/audio ayat pendek/adik saya suka bermain.MP3', image: '/images/menu-kad/ayat pendek/adik saya suka bermain.png' },
      { text: 'Bapa pergi ke pejabat.', audio: '/audio/bacaan-bergred/audio ayat pendek/bapa pergi ke pejabat.MP3', image: '/images/menu-kad/ayat pendek/bapa pergi ke pejabat.png' },
      { text: 'Kakak membaca buku cerita.', audio: '/audio/bacaan-bergred/audio ayat pendek/kakak membaca buku cerita.MP3', image: '/images/menu-kad/ayat pendek/kakak membaca buku cerita.png' },
      { text: 'Kami pergi ke sekolah.', audio: '/audio/bacaan-bergred/audio ayat pendek/kami pergi ke sekolah.MP3', image: '/images/menu-kad/ayat pendek/kami pergi ke sekolah.png' },
      { text: 'Burung itu terbang tinggi.', audio: '/audio/bacaan-bergred/audio ayat pendek/burung itu terbang tinggi.MP3', image: '/images/menu-kad/ayat pendek/burung itu terbang tinggi.png' },
      { text: 'Saya minum air kosong.', audio: '/audio/bacaan-bergred/audio ayat pendek/saya minum air kosong.MP3', image: '/images/menu-kad/ayat pendek/saya minum air kosong.png' },
      { text: 'Kami makan bersama.', audio: '/audio/bacaan-bergred/audio ayat pendek/kami makan bersama.MP3', image: '/images/menu-kad/ayat pendek/kami makan bersama.png' }
    ];
    const sourceItems = (items && items.length > 0) ? items : defaultItems;
    const shuffledItems = shuffleArray(sourceItems);
    return shuffledItems.map((item: any) => {
      const words = item.text.trim().split(/\s+/);
      let shuffledOptions = shuffleArray([...words]);
      if (shuffledOptions.join(' ') === words.join(' ') && words.length > 1) {
        shuffledOptions = shuffleArray([...words]);
      }
      return {
        type: 'susun',
        image: item.image || item.icon || '/images/menu/ayat pendek.png',
        imageText: item.text,
        audio: item.audio || (typeof (window as any).getAudioPath === 'function' ? (window as any).getAudioPath(item.text) : undefined),
        syllables: words,
        options: shuffledOptions,
        joinWith: ' '
      };
    });
  }

  if (id === 'ayat_panjang') {
    const defaultItems = [
      { text: 'Ibu memasak nasi lemak untuk sarapan pagi ini.', audio: '/audio/bacaan-bergred/audio ayat panjang/ibu memasak nasi lemak untuk sarapan pagi ini.MP3', image: '/images/menu-kad/ayat panjang/ibu memasak nasi lemak untuk sarapan pagi ini.png' },
      { text: 'Kami pergi ke taman permainan pada hari Sabtu.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami pergi ke taman permainan pada hari sabtu.MP3', image: '/images/menu-kad/ayat panjang/kami pergi ke taman permainan pada hari sabtu.png' },
      { text: 'Bapa membeli buah-buahan segar di pasar tani.', audio: '/audio/bacaan-bergred/audio ayat panjang/bapa membeli buah buahan segar di pasar tani.MP3', image: '/images/menu-kad/ayat panjang/bapa membeli buah-buahan segar di pasar tani.png' },
      { text: 'Kucing kecil itu bermain dengan bola di halaman rumah.', audio: '/audio/bacaan-bergred/audio ayat panjang/kucing kecil itu bermain dengan bola di halam.MP3', image: '/images/menu-kad/ayat panjang/kucing kecil itu bermain dengan bola di halaman rumah.png' },
      { text: 'Adik saya belajar membaca buku cerita setiap malam.', audio: '/audio/bacaan-bergred/audio ayat panjang/adik saya belajar membaca buku cerita setiap .MP3', image: '/images/menu-kad/ayat panjang/adik saya belajar membaca buku cerita setiap malam.png' },
      { text: 'Guru mengajar kami menulis huruf abjad dengan rapi.', audio: '/audio/bacaan-bergred/audio ayat panjang/guru mengajar kami menulis huruf abjad dengan.MP3', image: '/images/menu-kad/ayat panjang/guru mengajar kami menulis huruf abjad dengan rapi.png' },
      { text: 'Kami menyanyi lagu sambil bertepuk tangan dengan gembira.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami menyanyi lagu sambil bertepuk tangan den.MP3', image: '/images/menu-kad/ayat panjang/kami menyanyi lagu sambil bertepuk tangan dengan gembira.png' },
      { text: 'Burung kecil itu terbang tinggi di langit biru.', audio: '/audio/bacaan-bergred/audio ayat panjang/burung kecil itu terbang tinggi di langit bir.MP3', image: '/images/menu-kad/ayat panjang/burung kecil itu terbang tinggi di langit biru.png' },
      { text: 'Kakak membantu ibu membasuh pinggan selepas makan malam.', audio: '/audio/bacaan-bergred/audio ayat panjang/kakak membantu ibu membasuh pinggan selepas m.MP3', image: '/images/menu-kad/ayat panjang/kakak membantu ibu membasuh pinggan selepas makan malam.png' },
      { text: 'Kami berkumpul di padang sekolah untuk beriadah pagi.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami berkumpul di padang sekolah untuk beriad.MP3', image: '/images/menu-kad/ayat panjang/kami berkumpul di padang sekolah untuk beriadah pagi.png' }
    ];
    const sourceItems = (items && items.length > 0) ? items : defaultItems;
    const allImages = sourceItems.map((it: any) => it.image || it.icon).filter(Boolean);
    const shuffledItems = shuffleArray(sourceItems);
    return shuffledItems.map((item: any) => {
      const sentence = item.text || item.title;
      const correctImage = item.image || item.icon;
      const otherImages = allImages.filter((ic: string) => ic !== correctImage);
      const distractors = shuffleArray(otherImages).slice(0, 3);
      const options = shuffleArray([correctImage, ...distractors]);
      return {
        type: 'cari_gambar',
        imageText: sentence,
        displayWord: sentence,
        audio: item.audio || (typeof (window as any).getAudioPath === 'function' ? (window as any).getAudioPath(sentence) : undefined),
        answer: correctImage,
        options: options
      };
    });
  }

  if (id === 'petikan_tahap_1') {
    const Q_LIST = [
      // 1. Kereta
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 kereta.png',
        passage: 'Kereta.\nIni kereta bapa.\nKereta bapa biru.\nBapa bawa kereta laju.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 kereta.MP3',
        question: 'Kereta bapa berwarna apa?',
        answer: 'Biru',
        options: ['Biru', 'Merah', 'Kuning', 'Hijau']
      },
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 kereta.png',
        passage: 'Kereta.\nIni kereta bapa.\nKereta bapa biru.\nBapa bawa kereta laju.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 kereta.MP3',
        question: 'Siapakah yang membawa kereta laju?',
        answer: 'Bapa',
        options: ['Bapa', 'Adik', 'Abang', 'Kakak']
      },
      // 2. Bola
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 bola.png',
        passage: 'Bola.\nIni bola saya.\nBola saya merah.\nSaya baling bola jauh.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 bola.MP3',
        question: 'Bola saya berwarna apa?',
        answer: 'Merah',
        options: ['Merah', 'Biru', 'Putih', 'Hitam']
      },
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 bola.png',
        passage: 'Bola.\nIni bola saya.\nBola saya merah.\nSaya baling bola jauh.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 bola.MP3',
        question: 'Saya baling bola ke mana?',
        answer: 'Jauh',
        options: ['Jauh', 'Dekat', 'Tinggi', 'Rendah']
      },
      // 3. Topi
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 topi.png',
        passage: 'Topi.\nIni topi adik.\nTopi adik kuning.\nAdik pakai topi elok.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 topi.MP3',
        question: 'Topi adik berwarna apa?',
        answer: 'Kuning',
        options: ['Kuning', 'Hijau', 'Coklat', 'Merah']
      },
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 topi.png',
        passage: 'Topi.\nIni topi adik.\nTopi adik kuning.\nAdik pakai topi elok.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 topi.MP3',
        question: 'Bagaimanakah adik memakai topi?',
        answer: 'Elok',
        options: ['Elok', 'Senget', 'Ketat', 'Kotor']
      },
      // 4. Beg
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 beg.png',
        passage: 'Beg.\nIni beg kakak.\nBeg kakak hijau.\nKakak bawa beg berat.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 beg.MP3',
        question: 'Beg kakak berwarna apa?',
        answer: 'Hijau',
        options: ['Hijau', 'Kuning', 'Biru', 'Hitam']
      },
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 beg.png',
        passage: 'Beg.\nIni beg kakak.\nBeg kakak hijau.\nKakak bawa beg berat.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 beg.MP3',
        question: 'Bagaimanakah beg yang kakak bawa?',
        answer: 'Berat',
        options: ['Berat', 'Ringan', 'Kecil', 'Kosong']
      },
      // 5. Basikal
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 basikal.png',
        passage: 'Basikal.\nIni basikal abang.\nBasikal abang hitam.\nAbang kayuh basikal laju.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 basikal.MP3',
        question: 'Basikal abang berwarna apa?',
        answer: 'Hitam',
        options: ['Hitam', 'Biru', 'Merah', 'Kuning']
      },
      {
        image: '/images/menu-kad/petikan tahap 1/petikan tahap 1 basikal.png',
        passage: 'Basikal.\nIni basikal abang.\nBasikal abang hitam.\nAbang kayuh basikal laju.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 basikal.MP3',
        question: 'Bagaimanakah abang mengayuh basikal?',
        answer: 'Laju',
        options: ['Laju', 'Perlahan', 'Lambat', 'Jatuh']
      }
    ];
    return shuffleArray(Q_LIST).map((q: any) => ({
      type: 'bacaan',
      image: q.image,
      imageText: q.passage.replace(/\n/g, ' '),
      audio: q.audio || (typeof (window as any).getAudioPath === 'function' ? (window as any).getAudioPath(q.passage) : undefined),
      passage: q.passage,
      question: q.question,
      answer: q.answer,
      options: shuffleArray(q.options)
    }));
  }

  if (id === 'petikan_tahap_2') {
    const Q_LIST = [
      // 1. Rumah
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 rumah.png',
        passage: 'Rumah.\nIni rumah saya.\nRumah saya besar.\nSaya tinggal di rumah besar bersama keluarga.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 rumah.MP3',
        question: 'Rumah saya bagaimana?',
        answer: 'Besar',
        options: ['Besar', 'Kecil', 'Tinggi', 'Lama']
      },
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 rumah.png',
        passage: 'Rumah.\nIni rumah saya.\nRumah saya besar.\nSaya tinggal di rumah besar bersama keluarga.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 rumah.MP3',
        question: 'Saya tinggal di rumah bersama siapa?',
        answer: 'Keluarga',
        options: ['Keluarga', 'Kawan', 'Jiran', 'Guru']
      },
      // 2. Sekolah
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 sekolah.png',
        passage: 'Sekolah.\nIni sekolah kami.\nSekolah kami ceria.\nKami belajar di sekolah ceria setiap hari.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 sekolah.MP3',
        question: 'Sekolah kami bagaimana?',
        answer: 'Ceria',
        options: ['Ceria', 'Sepi', 'Gelap', 'Kecil']
      },
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 sekolah.png',
        passage: 'Sekolah.\nIni sekolah kami.\nSekolah kami ceria.\nKami belajar di sekolah ceria setiap hari.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 sekolah.MP3',
        question: 'Bilakah kami belajar di sekolah ceria?',
        answer: 'Setiap hari',
        options: ['Setiap hari', 'Setiap malam', 'Hari Ahad', 'Hari Sabtu']
      },
      // 3. Kucing
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 kucing.png',
        passage: 'Kucing.\nIni kucing saya.\nKucing saya comel.\nSaya bermain dengan kucing comel setiap petang.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 kucing.MP3',
        question: 'Kucing saya bagaimana?',
        answer: 'Comel',
        options: ['Comel', 'Galak', 'Besar', 'Hitam']
      },
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 kucing.png',
        passage: 'Kucing.\nIni kucing saya.\nKucing saya comel.\nSaya bermain dengan kucing comel setiap petang.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 kucing.MP3',
        question: 'Bilakah saya bermain dengan kucing comel?',
        answer: 'Setiap petang',
        options: ['Setiap petang', 'Setiap pagi', 'Waktu malam', 'Tengah hari']
      },
      // 4. Taman
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 taman.png',
        passage: 'Taman.\nIni taman kami.\nTaman kami luas.\nKami berlari di taman luas pada waktu pagi.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 taman.MP3',
        question: 'Taman kami bagaimana?',
        answer: 'Luas',
        options: ['Luas', 'Sempit', 'Kecil', 'Gelap']
      },
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 taman.png',
        passage: 'Taman.\nIni taman kami.\nTaman kami luas.\nKami berlari di taman luas pada waktu pagi.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 taman.MP3',
        question: 'Bilakah kami berlari di taman luas?',
        answer: 'Waktu pagi',
        options: ['Waktu pagi', 'Waktu malam', 'Waktu petang', 'Tengah hari']
      },
      // 5. Dapur
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 dapur.png',
        passage: 'Dapur.\nIni dapur ibu.\nDapur ibu bersih.\nIbu memasak di dapur bersih setiap petang.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 dapur.MP3',
        question: 'Dapur ibu bagaimana?',
        answer: 'Bersih',
        options: ['Bersih', 'Kotor', 'Besar', 'Sempit']
      },
      {
        image: '/images/menu-kad/petikan tahap 2/petikan tahap 2 dapur.png',
        passage: 'Dapur.\nIni dapur ibu.\nDapur ibu bersih.\nIbu memasak di dapur bersih setiap petang.',
        audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 dapur.MP3',
        question: 'Ibu memasak di dapur pada waktu apa?',
        answer: 'Setiap petang',
        options: ['Setiap petang', 'Setiap pagi', 'Waktu malam', 'Tengah hari']
      }
    ];
    return shuffleArray(Q_LIST).map((q: any) => ({
      type: 'bacaan',
      image: q.image,
      imageText: q.passage.replace(/\n/g, ' '),
      audio: q.audio || (typeof (window as any).getAudioPath === 'function' ? (window as any).getAudioPath(q.passage) : undefined),
      passage: q.passage,
      question: q.question,
      answer: q.answer,
      options: shuffleArray(q.options)
    }));
  }

  if (id === 'cerita_pendek') {
    const Q_LIST = [
      {
        image: '/images/buku/b1coverpage.jpg',
        passage: 'Comel ialah seekor kucing kecil. Comel tinggal bersama Ali di rumah. Setiap pagi, Comel bermain di halaman rumah. Comel suka makan ikan dan minum susu. Ali sangat sayang akan Comel.',
        question: 'Apakah makanan kegemaran Comel?',
        answer: 'Ikan',
        options: ['Ikan', 'Roti', 'Nasi', 'Ayam']
      },
      {
        image: '/images/buku/b2coverpage.jpg',
        passage: 'Hari ini sekolah mengadakan hari sukan. Murid-murid memakai baju sukan berwarna-warni. Ani berlari pantas dalam pertandingan lari. Ani berjaya memenangi hadiah pertama. Semua murid bertepuk tangan dengan gembira.',
        question: 'Ani memenangi hadiah yang ke berapa?',
        answer: 'Pertama',
        options: ['Pertama', 'Kedua', 'Ketiga', 'Keempat']
      },
      {
        image: '/images/buku/b3coverpage.jpg',
        passage: 'Pada hari Sabtu, ibu pergi ke pasar. Ali turut serta bersama ibu ke pasar. Mereka membeli sayur, buah dan ikan segar. Ali membantu ibu membawa beg barang. Mereka pulang ke rumah dengan gembira.',
        question: 'Siapakah yang pergi ke pasar bersama ibu?',
        answer: 'Ali',
        options: ['Ali', 'Adik', 'Kakak', 'Abang']
      },
      {
        image: '/images/buku/b4coverpage.jpg',
        passage: 'Di halaman rumah Ali, ada sebatang pokok mangga. Setiap tahun, pokok itu berbuah lebat. Ali suka memetik buah mangga yang masak. Ibu memasak jeruk mangga yang sedap. Sekeluarga menikmati mangga bersama-sama.',
        question: 'Pokok apakah yang ada di halaman rumah Ali?',
        answer: 'Mangga',
        options: ['Mangga', 'Rambutan', 'Durian', 'Pisang']
      },
      {
        image: '/images/buku/b5coverpage.jpg',
        passage: 'Cikgu Nur mengajar kelas prasekolah setiap hari. Murid-murid belajar membaca dan menyanyi bersama. Ali dan Ani suka bermain di sudut buku. Cikgu Nur sentiasa sabar mengajar murid-muridnya. Kelas itu sentiasa ceria dan gembira.',
        question: 'Siapakah nama cikgu prasekolah?',
        answer: 'Cikgu Nur',
        options: ['Cikgu Nur', 'Cikgu Ali', 'Cikgu Siti', 'Cikgu Ahmad']
      }
    ];
    return shuffleArray(Q_LIST).map((q: any) => ({
      type: 'bacaan',
      image: q.image,
      imageText: q.passage.replace(/\n/g, ' '),
      passage: q.passage,
      question: q.question,
      answer: q.answer,
      options: shuffleArray(q.options)
    }));
  }

  if (items && items.length > 0) {
    const allTexts = items.map((it: any) => it.text || it.title);
    const shuffledItems = shuffleArray(items);
    return shuffledItems.map((item: any) => {
      const text = item.text || item.title;
      const distractors = shuffleArray(allTexts.filter((t: string) => t !== text)).slice(0, 3);
      return {
        type: 'padan',
        image: item.icon || '📖',
        imageText: text,
        answer: text,
        options: shuffleArray([text, ...distractors])
      };
    });
  }

  if (id === 'fonik_abc' || id === 'kenal_huruf' || id === 'kenali_huruf' || id === 'huruf_vokal' || id === 'pengenalan_nombor' || id === 'bilang_0_10' || id === 'konsep_tambah' || id === 'konsep_penolakan' || id === 'bilang_siri_nombor') {
    const rawQ = CABARAN_DATA[id] || [];
    const count = rawQ.length <= 10 ? rawQ.length : 10;
    const shuffledQ = shuffleArray(rawQ).slice(0, count);
    return shuffledQ.map((q: any) => {
      if (q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });
  }

  if (flashcards && flashcards.length > 0) {
    if (id === 'suku_kata_kv') {
      const shuffledCards = shuffleArray(flashcards).slice(0, 10);
      return shuffledCards.map((card: any) => {
        const answer = card.front;
        const otherKVs = flashcards.map((f: any) => f.front).filter((f: string) => f !== answer);
        const distractors = shuffleArray(otherKVs).slice(0, 3);
        return {
          type: 'dengar',
          audio: answer,
          answer: answer,
          options: shuffleArray([answer, ...distractors])
        };
      });
    }

    if (id === 'suku_kata_v_kv') {
      // Exactly 6 cards: ALU, API, IBU, ISI, UBI, ULU -> 6 questions!
      const shuffledCards = shuffleArray(flashcards);
      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const parts = (card.front || '').split('-').map((s: string) => s.trim());
        const suffix = parts[1] || '';
        const answer = parts[0] || 'a';
        return {
          type: 'lengkap',
          image: card.icon,
          imageText: word,
          prefix: '___',
          suffix: suffix,
          answer: answer,
          options: shuffleArray(['a', 'e', 'i', 'u'])
        };
      });
    }

    if (id === 'suku_kata_kv_kv_kv' || id === 'suku_kata_kv_kv_kvk') {
      const count = flashcards.length <= 10 ? flashcards.length : 10;
      const shuffledCards = shuffleArray(flashcards).slice(0, count);
      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const syllables = (card.front || '').split('-').map((s: string) => s.trim());
        return {
          type: 'susun',
          image: card.icon,
          imageText: word,
          syllables: syllables,
          options: shuffleArray(syllables)
        };
      });
    }

    if (id === 'suku_kata_kvk' || id === 'suku_kata_kvkk') {
      const count = flashcards.length <= 10 ? flashcards.length : 10;
      const shuffledCards = shuffleArray(flashcards).slice(0, count);
      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const vowelMatch = word.match(/[aeiou]/);
        const vowel = vowelMatch ? vowelMatch[0] : 'a';
        const text = word.split('').map((char: string, idx: number) => (idx === word.indexOf(vowel) ? '_' : char)).join(' ');
        const distractors = shuffleArray(['a', 'e', 'i', 'o', 'u'].filter(v => v !== vowel)).slice(0, 3);
        return {
          type: 'teka',
          image: card.icon,
          imageText: word,
          text: text,
          answer: vowel,
          options: shuffleArray([vowel, ...distractors])
        };
      });
    }

    // For suku_kata_kv_kvk and suku_kata_kvkk (and other modules using image-finding concept)
    if (id === 'suku_kata_kvk_kv') {
      const cards = flashcards && flashcards.length > 0 ? flashcards : (MODULE_FLASHCARDS.suku_kata_kvk_kv || []);
      const count = cards.length <= 10 ? cards.length : 10;
      const shuffledCards = shuffleArray(cards).slice(0, count);
      const allWords = cards.map((f: any) => (f.back || f.front || f.text || f.word || '').toLowerCase().replace(/\s*-\s*/g, ''));
      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase().replace(/\s*-\s*/g, '');
        const otherWords = allWords.filter((w: string) => w !== word);
        const distractors = shuffleArray(otherWords).slice(0, 3);
        return {
          type: 'padan',
          image: card.icon,
          imageText: word,
          answer: word,
          options: shuffleArray([word, ...distractors])
        };
      });
    }

    if (id === 'suku_kata_kvk_kv_kvk') {
      const cards = flashcards || MODULE_FLASHCARDS.suku_kata_kvk_kv_kvk || [];
      const wordList = cards.map((c: any) => ({
        word: (c.back || c.text || c.word || '').toLowerCase(),
        icon: c.icon || '✨'
      }));
      return [{
        type: 'crossword_8x8',
        words: wordList
      }];
    }

    if (id === 'suku_kata_v_kvk') {
      const defaultCards = MODULE_FLASHCARDS.suku_kata_v_kvk || [];
      const cards = flashcards && flashcards.length > 0 ? flashcards : defaultCards;
      const count = cards.length <= 10 ? cards.length : 10;
      const shuffledCards = shuffleArray(cards).slice(0, count);

      const allSuffixes = cards.map((c: any) => {
        const parts = (c.front || '').split('-').map((s: string) => s.trim());
        return parts[1] || '';
      }).filter(Boolean);

      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const parts = (card.front || '').split('-').map((s: string) => s.trim());
        const prefix = parts[0] || 'a';
        const suffix = parts[1] || '';

        const distractors = shuffleArray(allSuffixes.filter((s: string) => s !== suffix)).slice(0, 3);

        return {
          type: 'lengkap',
          image: card.icon,
          imageText: word,
          prefix: prefix,
          suffix: '___',
          answer: suffix,
          options: shuffleArray([suffix, ...distractors])
        };
      });
    }

    if (id === 'suku_kata_kvk_kvk') {
      const defaultCards = MODULE_FLASHCARDS.suku_kata_kvk_kvk || [];
      const cards = flashcards && flashcards.length >= 10 ? flashcards : defaultCards;
      const shuffledCards = shuffleArray(cards).slice(0, 10);

      const round1Cards = shuffledCards.slice(0, 5);
      const round2Cards = shuffledCards.slice(5, 10);

      const createRound = (roundCards: any[], roundNum: number) => {
        const pairs = roundCards.map((card: any, idx: number) => {
          const parts = (card.front || '').split('-').map((s: string) => s.trim().toLowerCase());
          const leftSyllable = parts[0] || '';
          const rightSyllable = parts[1] || '';
          const fullWord = (card.back || card.text || card.word || '').toUpperCase();
          return {
            id: `pair_${roundNum}_${idx}`,
            pairId: `pair_${roundNum}_${idx}`,
            left: leftSyllable,
            right: rightSyllable,
            word: fullWord,
            icon: card.icon || '✨'
          };
        });

        const leftList = shuffleArray(pairs.map(p => ({
          id: `left_${p.id}`,
          syllable: p.left,
          pairId: p.pairId
        })));

        const rightList = shuffleArray(pairs.map(p => ({
          id: `right_${p.id}`,
          syllable: p.right,
          pairId: p.pairId
        })));

        return {
          type: 'padan_garisan_kvk',
          roundNum: roundNum,
          totalRounds: 2,
          pairs: pairs,
          leftList: leftList,
          rightList: rightList
        };
      };

      return [createRound(round1Cards, 1), createRound(round2Cards, 2)];
    }

    if (id === 'suku_kata_kv_kvk' || id === 'suku_kata_kvkk' || id === 'suku_kata_kv_kv') {
      const count = flashcards.length <= 10 ? flashcards.length : 10;
      const shuffledCards = shuffleArray(flashcards).slice(0, count);
      const allIcons = flashcards.map((f: any) => f.icon).filter(Boolean);

      return shuffledCards.map((card: any) => {
        const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
        const displayWord = card.back || word.toUpperCase();
        const correctIcon = card.icon;

        const otherIcons = allIcons.filter((ic: string) => ic !== correctIcon);
        const distractors = shuffleArray(otherIcons).slice(0, 3);
        const options = shuffleArray([correctIcon, ...distractors]);

        return {
          type: 'cari_gambar',
          imageText: word,
          displayWord: displayWord,
          answer: correctIcon,
          options: options
        };
      });
    }

    // Default for suku_kata_kv_kv, suku_kata_v_kvk, suku_kata_kv_kvk, suku_kata_kvk_kv, suku_kata_kvk_kvk, etc.
    const count = flashcards.length <= 10 ? flashcards.length : 10;
    const shuffledCards = shuffleArray(flashcards).slice(0, count);
    const allWords = flashcards.map((f: any) => (f.back || f.front || f.text || f.word || '').toLowerCase());

    return shuffledCards.map((card: any) => {
      const word = (card.back || card.front || card.text || card.word || '').toLowerCase();
      const otherWords = allWords.filter((w: string) => w !== word);
      const distractors = shuffleArray(otherWords).slice(0, 3);
      return {
        type: 'padan',
        image: card.icon,
        imageText: word,
        answer: word,
        options: shuffleArray([word, ...distractors])
      };
    });
  }

  // Fallback to CABARAN_DATA
  const rawQ = CABARAN_DATA[id] || CABARAN_DATA['suku_kata_kv'] || [];
  const shuffledQ = shuffleArray(rawQ);
  return shuffledQ.map((q: any) => {
    if (q.type === 'susun' && q.syllables) {
      return { ...q, options: shuffleArray(q.syllables) };
    }
    if (q.options) {
      return { ...q, options: shuffleArray(q.options) };
    }
    return q;
  });
}


interface PadanGarisanProps {
  question: any;
  onRoundComplete: () => void;
  playAudio: (text: string) => void;
  playSoundEffect: (type: "correct" | "wrong") => void;
  onCorrectMatch: () => void;
  onWrongMatch?: () => void;
}

const PadanGarisanKVK: React.FC<PadanGarisanProps> = ({
  question,
  onRoundComplete,
  playAudio,
  playSoundEffect,
  onCorrectMatch,
  onWrongMatch
}) => {
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<{ id: string; syllable: string; pairId: string } | null>(null);
  const [selectedRight, setSelectedRight] = useState<{ id: string; syllable: string; pairId: string } | null>(null);
  const [activePopup, setActivePopup] = useState<{ left: string; right: string; word: string; icon: string } | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Array<{ pairId: string; x1: number; y1: number; x2: number; y2: number }>>([]);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [draggingLeft, setDraggingLeft] = useState<{ id: string; syllable: string; pairId: string } | null>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getElementLocalOffset = (el: HTMLElement, container: HTMLElement) => {
    let left = 0;
    let top = 0;
    let curr: HTMLElement | null = el;
    while (curr && curr !== container) {
      left += curr.offsetLeft;
      top += curr.offsetTop;
      curr = curr.offsetParent as HTMLElement | null;
    }
    return {
      left,
      top,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  };

  const updateLines = () => {
    if (!containerRef.current) return;
    const newLines: Array<{ pairId: string; x1: number; y1: number; x2: number; y2: number }> = [];

    matchedPairIds.forEach(pairId => {
      const leftEl = containerRef.current?.querySelector(`[data-left-pair="${pairId}"]`) as HTMLElement | null;
      const rightEl = containerRef.current?.querySelector(`[data-right-pair="${pairId}"]`) as HTMLElement | null;
      if (leftEl && rightEl) {
        const leftPos = getElementLocalOffset(leftEl, containerRef.current!);
        const rightPos = getElementLocalOffset(rightEl, containerRef.current!);

        newLines.push({
          pairId,
          x1: leftPos.left + leftPos.width,
          y1: leftPos.top + leftPos.height / 2,
          x2: rightPos.left,
          y2: rightPos.top + rightPos.height / 2
        });
      }
    });
    setLines(newLines);
  };

  useEffect(() => {
    updateLines();
    const timer = setTimeout(updateLines, 50);
    const observer = new ResizeObserver(() => {
      updateLines();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateLines);
      observer.disconnect();
    };
  }, [matchedPairIds, question]);

  const handlePairSuccess = (pairId: string) => {
    const pairObj = question.pairs.find((p: any) => p.pairId === pairId);
    if (!pairObj) return;

    const nextMatched = [...matchedPairIds, pairId];
    setMatchedPairIds(nextMatched);
    setSelectedLeft(null);
    setSelectedRight(null);
    setDraggingLeft(null);
    setDragLine(null);

    onCorrectMatch();
    playSoundEffect("correct");

    setActivePopup({
      left: pairObj.left,
      right: pairObj.right,
      word: pairObj.word,
      icon: pairObj.icon
    });
    playAudio(pairObj.word);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      zIndex: 99999
    });

    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => {
      setActivePopup(null);
      if (nextMatched.length >= question.pairs.length) {
        setTimeout(() => {
          onRoundComplete();
        }, 300);
      }
    }, 1200);
  };

  const handleLeftClick = (item: any) => {
    if (activePopup) setActivePopup(null);
    if (matchedPairIds.includes(item.pairId)) return;
    if (selectedRight) {
      if (item.pairId === selectedRight.pairId) {
        handlePairSuccess(item.pairId);
      } else {
        playSoundEffect("wrong");
        if (onWrongMatch) onWrongMatch();
        setShakeId(item.id);
        setTimeout(() => setShakeId(null), 500);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    } else {
      setSelectedLeft(item);
    }
  };

  const handleRightClick = (item: any) => {
    if (activePopup) setActivePopup(null);
    if (matchedPairIds.includes(item.pairId)) return;
    if (selectedLeft) {
      if (item.pairId === selectedLeft.pairId) {
        handlePairSuccess(item.pairId);
      } else {
        playSoundEffect("wrong");
        if (onWrongMatch) onWrongMatch();
        setShakeId(item.id);
        setTimeout(() => setShakeId(null), 500);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    } else {
      setSelectedRight(item);
    }
  };

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent, leftItem: any) => {
    if (activePopup) setActivePopup(null);
    if (matchedPairIds.includes(leftItem.pairId)) return;
    if (!containerRef.current) return;

    setSelectedLeft(leftItem);
    setDraggingLeft(leftItem);

    const leftEl = e.currentTarget as HTMLElement;
    const leftPos = getElementLocalOffset(leftEl, containerRef.current);

    const x1 = leftPos.left + leftPos.width;
    const y1 = leftPos.top + leftPos.height / 2;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = containerRect.width > 0 ? (containerRef.current.clientWidth / containerRect.width) : 1;
    const scaleY = containerRect.height > 0 ? (containerRef.current.clientHeight / containerRect.height) : 1;

    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x2 = (clientX - containerRect.left) * scaleX;
    const y2 = (clientY - containerRect.top) * scaleY;

    setDragLine({ x1, y1, x2, y2 });
  };

  const handleMoveDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingLeft || !containerRef.current || !dragLine) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = containerRect.width > 0 ? (containerRef.current.clientWidth / containerRect.width) : 1;
    const scaleY = containerRect.height > 0 ? (containerRef.current.clientHeight / containerRect.height) : 1;

    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setDragLine({
      ...dragLine,
      x2: (clientX - containerRect.left) * scaleX,
      y2: (clientY - containerRect.top) * scaleY
    });
  };

  const handleEndDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingLeft) return;

    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;

    const dropEl = document.elementFromPoint(clientX, clientY);
    const rightBtn = dropEl?.closest("[data-right-pair]") as HTMLElement | null;

    if (rightBtn) {
      const rightPairId = rightBtn.getAttribute("data-right-pair");
      if (rightPairId === draggingLeft.pairId) {
        handlePairSuccess(draggingLeft.pairId);
        return;
      } else {
        playSoundEffect("wrong");
        if (onWrongMatch) onWrongMatch();
      }
    }

    setDraggingLeft(null);
    setDragLine(null);
  };

  return (
    <div
      className="neo-box cabaran-game-card"
      style={{
        width: "100%",
        maxWidth: "540px",
        backgroundColor: "#ffffff",
        backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '16px 16px',
        padding: "20px 16px",
        borderRadius: "24px",
        position: "relative",
        userSelect: "none"
      }}
      onMouseMove={handleMoveDrag}
      onTouchMove={handleMoveDrag}
      onMouseUp={handleEndDrag}
      onTouchEnd={handleEndDrag}
    >
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "var(--color-purple)",
          color: "white",
          padding: "4px 14px",
          borderRadius: "9999px",
          fontWeight: "800",
          fontSize: "0.88rem",
          letterSpacing: "0.5px"
        }}>
          Pusingan {question.roundNum}/{question.totalRounds}
        </div>
        <div style={{ fontSize: "0.98rem", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
          {question.type === 'padan_garisan_v_kvk'
            ? "Tarik gambar dan padankan perkataan V+KVK:"
            : "Padankan suku kata KVK untuk membentuk perkataan:"}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          padding: "10px 12px",
          minHeight: "320px"
        }}
      >
        <svg style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5
        }}>
          {lines.map((l, idx) => (
            <line
              key={idx}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
          {dragLine && (
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: question.type === 'padan_garisan_v_kvk' ? "120px" : "115px", zIndex: 10 }}>
          {question.leftList.map((item: any) => {
            const isMatched = matchedPairIds.includes(item.pairId);
            const isSelected = selectedLeft?.id === item.id;
            const isShaking = shakeId === item.id;

            let btnBg = "bg-white";
            if (isMatched) btnBg = "bg-green text-white";
            else if (isSelected) btnBg = "bg-yellow";

            const isPic = item.isPicture || question.type === 'padan_garisan_v_kvk';

            return (
              <button
                key={item.id}
                data-left-pair={item.pairId}
                className={`neo-btn ${btnBg} cabaran-opt-btn`}
                style={{
                  width: "100%",
                  padding: isPic ? "8px 4px" : "12px 6px",
                  fontSize: isPic ? "2.5rem" : "1.3rem",
                  fontWeight: "800",
                  borderRadius: "14px",
                  cursor: isMatched ? "default" : "pointer",
                  opacity: isMatched ? 0.7 : 1,
                  transform: isShaking ? "translateX(-5px)" : "none",
                  transition: "transform 0.1s, background-color 0.2s",
                  touchAction: "none"
                }}
                onClick={() => handleLeftClick(item)}
                onMouseDown={(e) => handleStartDrag(e, item)}
                onTouchStart={(e) => handleStartDrag(e, item)}
              >
                {isPic ? (item.icon || item.syllable) : item.syllable}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: question.type === 'padan_garisan_v_kvk' ? "130px" : "115px", zIndex: 10 }}>
          {question.rightList.map((item: any) => {
            const isMatched = matchedPairIds.includes(item.pairId);
            const isSelected = selectedRight?.id === item.id;
            const isShaking = shakeId === item.id;

            let btnBg = "bg-white";
            if (isMatched) btnBg = "bg-green text-white";
            else if (isSelected) btnBg = "bg-yellow";

            const hasWord = !!item.word || question.type === 'padan_garisan_v_kvk';

            return (
              <button
                key={item.id}
                data-right-pair={item.pairId}
                data-syllable={item.syllable}
                className={`neo-btn ${btnBg} cabaran-opt-btn`}
                style={{
                  width: "100%",
                  padding: hasWord ? "12px 6px" : "12px 6px",
                  fontSize: hasWord ? "1.15rem" : "1.3rem",
                  fontWeight: "800",
                  borderRadius: "14px",
                  cursor: isMatched ? "default" : "pointer",
                  opacity: isMatched ? 0.7 : 1,
                  transform: isShaking ? "translateX(5px)" : "none",
                  transition: "transform 0.1s, background-color 0.2s"
                }}
                onClick={() => handleRightClick(item)}
              >
                {item.word || item.syllable}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.3)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px"
            }}
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                width: "100%",
                maxWidth: "clamp(340px, 88vw, 440px)",
                backgroundColor: "#ffffff",
                backgroundImage: "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
                border: "4px solid #0f172a",
                boxShadow: "0 8px 0 #0f172a",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "26px 20px 22px",
                textAlign: "center"
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '110px', width: '100%', marginBottom: '8px' }}>
                {activePopup.icon && activePopup.icon.includes('<img') ? (
                  <div dangerouslySetInnerHTML={{ __html: activePopup.icon }} style={{ width: '100%', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                ) : activePopup.icon && (activePopup.icon.startsWith('/') || activePopup.icon.includes('.png')) ? (
                  <img src={activePopup.icon} alt={activePopup.word} style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>{activePopup.icon}</div>
                )}
              </div>
              <div className="font-black text-green-600 tracking-wide lowercase" style={{ fontSize: "clamp(1.9rem, 6vw, 2.5rem)", lineHeight: 1.2 }}>
                {activePopup.word.toLowerCase()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


interface CrosswordProps {
  question: any;
  onRoundComplete: () => void;
  playAudio: (text: string) => void;
  playSoundEffect: (type: 'correct' | 'wrong' | 'win') => void;
  onWordFound: () => void;
}

const Crossword8x8: React.FC<CrosswordProps> = ({
  question,
  onRoundComplete,
  playAudio,
  playSoundEffect,
  onWordFound
}) => {
  const targetWordsList = question.words || [
    { word: 'cempedak', icon: '🍈' },
    { word: 'cendawan', icon: '🍄' },
    { word: 'jambatan', icon: '🌉' },
    { word: 'komputer', icon: '💻' },
    { word: 'pembaris', icon: '📏' },
    { word: 'tempayan', icon: '🏺' }
  ];

  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCellsMap, setFoundCellsMap] = useState<Record<string, boolean>>({});

  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const [activePopup, setActivePopup] = useState<{ word: string; icon: string } | null>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const GRID_SIZE = 10;
    const newGrid: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
    const MALAY_LETTERS = ['a', 'b', 'c', 'd', 'e', 'g', 'i', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w', 'y'];

    const wordsToPlace = targetWordsList.map((item: any) => ({
      word: item.word.toLowerCase(),
      icon: item.icon
    }));

    wordsToPlace.forEach(({ word }) => {
      let placed = false;
      const wordLen = word.length;

      for (let attempt = 0; attempt < 150; attempt++) {
        const dir = Math.floor(Math.random() * 4); // 0: H, 1: V, 2: D1, 3: D2
        let r = 0, c = 0;
        let dr = 0, dc = 0;

        if (dir === 0) { // H
          r = Math.floor(Math.random() * GRID_SIZE);
          c = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1));
          dr = 0; dc = 1;
        } else if (dir === 1) { // V
          r = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1));
          c = Math.floor(Math.random() * GRID_SIZE);
          dr = 1; dc = 0;
        } else if (dir === 2) { // D1 (down-right)
          r = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1));
          c = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1));
          dr = 1; dc = 1;
        } else { // D2 (down-left)
          r = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1));
          c = Math.floor(Math.random() * (GRID_SIZE - wordLen + 1)) + wordLen - 1;
          dr = 1; dc = -1;
        }

        let canPlace = true;
        for (let i = 0; i < wordLen; i++) {
          const currR = r + i * dr;
          const currC = c + i * dc;
          if (newGrid[currR][currC] !== '' && newGrid[currR][currC] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < wordLen; i++) {
            newGrid[r + i * dr][c + i * dc] = word[i];
          }
          placed = true;
          break;
        }
      }

      if (!placed) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c <= GRID_SIZE - wordLen; c++) {
            let canPlace = true;
            for (let i = 0; i < wordLen; i++) {
              if (newGrid[r][c + i] !== '' && newGrid[r][c + i] !== word[i]) {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < wordLen; i++) newGrid[r][c + i] = word[i];
              placed = true;
              break;
            }
          }
          if (placed) break;
        }
      }
    });

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = MALAY_LETTERS[Math.floor(Math.random() * MALAY_LETTERS.length)];
        }
      }
    }

    setGrid(newGrid);
  }, []);

  const getSelectedCells = () => {
    if (!startCell || !currentCell) return [];
    const { r: r1, c: c1 } = startCell;
    const { r: r2, c: c2 } = currentCell;

    const dr = r2 - r1;
    const dc = c2 - c1;

    if (dr === 0) {
      const step = dc >= 0 ? 1 : -1;
      const count = Math.abs(dc) + 1;
      return Array.from({ length: count }, (_, i) => ({ r: r1, c: c1 + i * step }));
    }

    if (dc === 0) {
      const step = dr >= 0 ? 1 : -1;
      const count = Math.abs(dr) + 1;
      return Array.from({ length: count }, (_, i) => ({ r: r1 + i * step, c: c1 }));
    }

    if (Math.abs(dr) === Math.abs(dc)) {
      const stepR = dr >= 0 ? 1 : -1;
      const stepC = dc >= 0 ? 1 : -1;
      const count = Math.abs(dr) + 1;
      return Array.from({ length: count }, (_, i) => ({ r: r1 + i * stepR, c: c1 + i * stepC }));
    }

    return [startCell];
  };

  const getCellFromPoint = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const cellEl = el.closest('[data-grid-cell]');
    if (!cellEl) return null;
    const r = parseInt(cellEl.getAttribute('data-row') || '-1', 10);
    const c = parseInt(cellEl.getAttribute('data-col') || '-1', 10);
    if (r >= 0 && c >= 0) return { r, c };
    return null;
  };

  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (activePopup) setActivePopup(null);
    setIsPointerDown(true);
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || !startCell) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (cell) {
      setCurrentCell(cell);
    }
  };

  const checkSelectedWord = (selectedCells: Array<{ r: number; c: number }>) => {
    if (selectedCells.length < 2) return;
    const formedStr = selectedCells.map(cell => grid[cell.r]?.[cell.c] || '').join('').toLowerCase();
    const reversedStr = formedStr.split('').reverse().join('');

    const matchedItem = targetWordsList.find((item: any) => {
      const w = item.word.toLowerCase();
      return (w === formedStr || w === reversedStr) && !foundWords.includes(w);
    });

    if (matchedItem) {
      const matchedWord = matchedItem.word.toLowerCase();
      const newFound = [...foundWords, matchedWord];
      setFoundWords(newFound);

      const newCellsMap = { ...foundCellsMap };
      selectedCells.forEach(cell => {
        newCellsMap[`${cell.r}_${cell.c}`] = true;
      });
      setFoundCellsMap(newCellsMap);

      playSoundEffect('correct');
      onWordFound();

      setActivePopup({ word: matchedWord, icon: matchedItem.icon });

      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => {
        setActivePopup(null);
        if (newFound.length >= targetWordsList.length) {
          setTimeout(() => {
            onRoundComplete();
          }, 400);
        }
      }, 1200);
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    const selectedCells = getSelectedCells();
    checkSelectedWord(selectedCells);
    setStartCell(null);
    setCurrentCell(null);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isPointerDown) return;
    if (activePopup) setActivePopup(null);

    if (!startCell) {
      setStartCell({ r, c });
      setCurrentCell({ r, c });
    } else {
      const selectedCells = getSelectedCells();
      checkSelectedWord(selectedCells);
      setStartCell(null);
      setCurrentCell(null);
    }
  };

  const selectedCells = getSelectedCells();
  const selectedCellsMap: Record<string, boolean> = {};
  selectedCells.forEach(cell => {
    selectedCellsMap[`${cell.r}_${cell.c}`] = true;
  });

  return (
    <div
      className="crossword-container"
      style={{
        width: "100%",
        maxWidth: "680px",
        position: "relative",
        userSelect: "none",
        touchAction: "none"
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* WordList (Top on mobile, Right on desktop) */}
      <div className="neo-box" style={{
        flex: "1 1 auto",
        width: "100%",
        maxWidth: "340px",
        backgroundColor: "#ffffff",
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)',
        backgroundSize: '15px 15px',
        padding: "16px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 10
      }}>
        <div style={{
          fontSize: "1rem",
          fontWeight: "900",
          color: "#0f172a",
          textAlign: "center"
        }}>
          Senarai Perkataan
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 8px"
        }}>
          {targetWordsList.map((item: any, idx: number) => {
            const w = item.word.toLowerCase();
            const isFound = foundWords.includes(w);

            return (
              <div
                key={idx}
                className={!isFound ? "word-not-found-glow" : ""}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: "9999px",
                  fontWeight: "500",
                  fontSize: "0.85rem",
                  border: "2px solid #0f172a",
                  backgroundColor: isFound ? "#e2e8f0" : "#ffffff",
                  color: isFound ? "#64748b" : "#0f172a",
                  textDecoration: isFound ? "line-through" : "none",
                  boxShadow: isFound ? "none" : "0 2px 0 #0f172a",
                  transition: "all 0.2s"
                }}
              >
                <span style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {w}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WordSearchGrid (Bottom on mobile, Left on desktop) */}
      <div
        className="neo-box"
        style={{
          flex: "0 0 auto",
          width: "100%",
          maxWidth: "340px",
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "2px",
          padding: "8px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          touchAction: "none"
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const cellKey = `${r}_${c}`;
            const isFound = !!foundCellsMap[cellKey];
            const isSelected = !!selectedCellsMap[cellKey];

            let bg = "#ffffff";
            let textColor = "#0f172a";
            let borderColor = "#cbd5e1";

            if (isFound) {
              bg = "#4ade80";
              textColor = "#0f172a";
              borderColor = "#16a34a";
            } else if (isSelected) {
              bg = "#ffffff";
              textColor = "#0f172a";
              borderColor = "#ca8a04";
            }

            return (
              <div
                key={cellKey}
                data-grid-cell="true"
                data-row={r}
                data-col={c}
                className="text-[0.75rem] sm:text-[0.9rem] md:text-[1rem]"
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  backgroundColor: bg,
                  color: textColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  cursor: "pointer",
                  userSelect: "none",
                  boxShadow: isSelected ? "inset 0 0 0 2px #eab308" : "none"
                }}
                onPointerDown={(e) => handlePointerDown(r, c, e)}
                onClick={() => handleCellClick(r, c)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      {/* Popup Card */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.3)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px"
            }}
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                width: "100%",
                maxWidth: "280px",
                backgroundColor: "#ffffff",
                border: "3px solid #0f172a",
                boxShadow: "0 4px 0 #0f172a",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 16px",
                textAlign: "center"
              }}
            >
              <div className="text-[3rem] md:text-[3.5rem] leading-none mb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85px' }}>
                {activePopup.icon && activePopup.icon.includes('<img') ? (
                  <div dangerouslySetInnerHTML={{ __html: activePopup.icon }} style={{ width: '100%', height: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                ) : activePopup.icon && (activePopup.icon.startsWith('/') || activePopup.icon.includes('.png')) ? (
                  <img src={activePopup.icon} alt={activePopup.word} style={{ maxHeight: '85px', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  activePopup.icon
                )}
              </div>
              <div className="font-black text-green-600 tracking-wide lowercase text-2xl md:text-[1.75rem]">
                {activePopup.word.toLowerCase()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const BADGES_BY_PETA: Record<number, { id: string; title: string; desc: string; image: string }> = {
  1: {
    id: "badge_peta_1",
    title: "Penjelajah Alfabet",
    desc: "Cabaran Kenal Huruf",
    image: "/images/lencana/lencana-penjelajah-alfabet.png"
  },
  2: {
    id: "badge_peta_2",
    title: "Pemburu Suku Kata",
    desc: "Cabaran Suku Kata Asas",
    image: "/images/lencana/lencana-pemburu-suku-kata.png"
  },
  3: {
    id: "badge_peta_3",
    title: "Wira Pulau",
    desc: "Cabaran Suku Kata Hero",
    image: "/images/lencana/lencana-wira-pulau.png"
  },
  4: {
    id: "badge_peta_4",
    title: "Naib Raja Bacaan",
    desc: "Cabaran Bacaan Bergred",
    image: "/images/lencana/lencana-naib-raja-bacaan.png"
  }
};

const getPetaId = (cId: string | null): number => {
  if (typeof window !== 'undefined' && (window as any).currentPeta) {
    const cp = Number((window as any).currentPeta);
    if (cp >= 1 && cp <= 4) return cp;
  }
  if (!cId) return 1;
  if (['kenal_huruf', 'kenali_huruf', 'fonik_abc', 'huruf_vokal', 'vokal_konsonan', 'pengenalan_nombor', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(cId)) return 1;
  if (['suku_kata_kv', 'suku_kata_v_kv', 'suku_kata_kv_kv', 'suku_kata_kv_kv_kv', 'suku_kata_kvk', 'suku_kata_v_kvk'].includes(cId)) return 2;
  if (['suku_kata_kv_kvk', 'suku_kata_kvk_kv', 'suku_kata_kvk_kvk', 'suku_kata_kvkk', 'suku_kata_kv_kv_kvk', 'suku_kata_kvk_kv_kvk'].includes(cId)) return 3;
  if (['ayat_pendek', 'ayat_panjang', 'perenggan_pendek', 'petikan_tahap_1', 'petikan_tahap_2', 'cerita_pendek'].includes(cId)) return 4;
  return 1;
};

export const CabaranSukuKataGame: React.FC<GameProps> = ({ onClose }) => {
  const [cabaranId, setCabaranId] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const [gameState, setGameState] = useState<'playing' | 'result' | 'lose'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Specific state for susun
  const [susunSlots, setSusunSlots] = useState<(number | null)[]>([]);
  const [touchDragInfo, setTouchDragInfo] = useState<{
    optIndex: number;
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Tunjuk cursor tunjuk cara audio sekejap sahaja di awal setiap soalan
  const [showAudioDemoCursor, setShowAudioDemoCursor] = useState(true);
  const [questionCycle, setQuestionCycle] = useState(0);

  useEffect(() => {
    if (gameState !== 'playing' || questions.length === 0) return;
    setShowAudioDemoCursor(true);
    const timer = setTimeout(() => {
      setShowAudioDemoCursor(false);
    }, 4500); // 4.5 saat di awal setiap soalan
    return () => clearTimeout(timer);
  }, [currentIndex, questionCycle, gameState, questions.length]);

  useEffect(() => {
    const currentQ = questions[currentIndex];
    if (currentQ?.type === 'susun') {
      setSusunSlots(new Array(currentQ.syllables.length).fill(null));
    } else {
      setSusunSlots([]);
    }
  }, [currentIndex, questions]);

  // Specific state for bakul
  const [activeBakulWordIndex, setActiveBakulWordIndex] = useState(0);

  const playCelebrationResult = () => {
    try {
      if (typeof (window as any).playTada === 'function') {
        (window as any).playTada();
      } else {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        [400, 500, 600].forEach(f => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          g.gain.setValueAtTime(0.5, now);
          g.gain.linearRampToValueAtTime(0, now + 0.2);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now); osc.stop(now + 0.2);
        });
        [500, 600, 800].forEach(f => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + 0.2);
          g.gain.setValueAtTime(0.55, now + 0.2);
          g.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now + 0.2); osc.stop(now + 1.2);
        });
      }
    } catch (e) {
      console.warn("Audio celebration error:", e);
    }
  };

  const playCubaLagiResult = () => {
    try {
      if (typeof (window as any).playCubaLagi === 'function') {
        (window as any).playCubaLagi();
      } else if (typeof (window as any).playOops === 'function') {
        (window as any).playOops();
      } else {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        [293.66, 261.63, 220.00, 174.61].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          const start = now + (i * 0.15);
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.55, start);
          g.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(start); osc.stop(start + 0.25);
        });
      }
    } catch (e) {
      console.warn("Audio cuba lagi error:", e);
    }
  };

  useEffect(() => {
    if (gameState === 'result' || gameState === 'lose') {
      const isLose = gameState === 'lose' || lives <= 0;
      const firstQType = questions[0]?.type;
      const total = (firstQType === 'padan_garisan_kvk' || firstQType === 'padan_garisan_v_kvk')
        ? 10
        : firstQType === 'crossword_8x8'
          ? (questions[0]?.words?.length || 6)
          : (questions.length || 10);

      const star1 = Math.ceil(total * 0.4);
      const star2 = Math.ceil(total * 0.7);
      const star3 = total;
      const isStarActive = (starNum: number) => {
        if (isLose) return false;
        const threshold = starNum === 1 ? star1 : starNum === 2 ? star2 : star3;
        return score >= threshold;
      };

      const activeStarCount = [1, 2, 3].filter(s => isStarActive(s)).length;
      const isFull = (activeStarCount === 3 || score === total) && !isLose;

      if (isFull) {
        playCelebrationResult();
        // Multi-burst confetti celebration
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.45 },
          zIndex: 99999
        });
        setTimeout(() => {
          confetti({
            particleCount: 75,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            zIndex: 99999
          });
          confetti({
            particleCount: 75,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            zIndex: 99999
          });
        }, 300);

      } else {
        // Play Cuba Lagi audio
        playCubaLagiResult();
      }

      if (cabaranId) {
        const pct = total > 0 ? score / total : 0;
        const calculatedStars = isLose ? 0 : (activeStarCount > 0 ? activeStarCount : (pct >= 0.85 ? 3 : (pct >= 0.6 ? 2 : (pct >= 0.35 ? 1 : 0))));
        const stars = isFull ? 3 : calculatedStars;

        const key = `stars_${cabaranId}`;
        const existing = Number(localStorage.getItem(key) || 0);
        if (stars > existing) {
          localStorage.setItem(key, stars.toString());
          localStorage.setItem(`extra_${key}`, stars.toString());
        }

        if (typeof window !== 'undefined' && (window as any).logProgress) {
          (window as any).logProgress(cabaranId, 'latihan', score, cabaranId, stars);
        }

        // Award badge only if at least 3 activities in this map have 3 stars
        try {
          const petaId = getPetaId(cabaranId);
          const badgeObj = BADGES_BY_PETA[petaId];
          const studentName = (window as any).namaMuridAktif || localStorage.getItem('muridAktif') || localStorage.getItem('bunyiKataCurrentMurid') || localStorage.getItem('bunyiKataNamaMurid') || 'Murid';
          if ((window as any).studentData) {
            if (!(window as any).studentData[studentName]) {
              (window as any).studentData[studentName] = typeof (window as any).studentRecord === 'function' ? (window as any).studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: '/images/avatar/avatar1.png' };
            }
            const s = (window as any).studentData[studentName];
            if (!s.badges) s.badges = [];
            if (!s.stars) s.stars = {};
            if (!s.scores) s.scores = {};

            s.stars[cabaranId] = Math.min(3, Math.max(s.stars[cabaranId] && s.stars[cabaranId] <= 3 ? s.stars[cabaranId] : 0, stars));
            s.scores[cabaranId] = Math.max(s.scores[cabaranId] || 0, score);

            let changed = false;
            const isCompleted = typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted(petaId, s);
            if (isCompleted && badgeObj && !s.badges.includes(badgeObj.id)) {
              s.badges.push(badgeObj.id);
              changed = true;
            }

            const allCompleted = typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted('all', s);
            if (allCompleted && !s.badges.includes('badge_master')) {
              s.badges.push('badge_master');
              changed = true;
            }

            if (typeof (window as any).kiraLencanaMurid === 'function') {
              const earnedBadges = (window as any).kiraLencanaMurid(s);
              if (Array.isArray(earnedBadges)) {
                earnedBadges.forEach((bKey: string) => {
                  if (!s.badges.includes(bKey)) {
                    s.badges.push(bKey);
                    changed = true;
                  }
                });
              }
            }

            if (changed || stars > 0) {
              if (typeof (window as any).saveStudentData === 'function') {
                (window as any).saveStudentData();
              }
              window.dispatchEvent(new CustomEvent('kemaskini-profil'));
            }
          }
        } catch (e) {
          console.warn('Cabaran badge check notice:', e);
        }
      }
    }
  }, [gameState]);

  useEffect(() => {
    const handleStart = (e: any) => {
      const { id, title: cTitle } = e.detail;
      setCabaranId(id);
      setTitle(cTitle);

      const fullQ = buildQuestionsForModule(id);
      setQuestions(fullQ);

      setCurrentIndex(0);
      setQuestionCycle(c => c + 1);
      setShowAudioDemoCursor(true);
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

  const handleRestart = () => {
    if (cabaranId) {
      const freshQ = buildQuestionsForModule(cabaranId);
      setQuestions(freshQ);
    }
    setCurrentIndex(0);
    setQuestionCycle(c => c + 1);
    setShowAudioDemoCursor(true);
    setScore(0);
    setLives(3);
    setGameState('playing');
    setFeedback(null);
    setSusunSlots([]);
    setActiveBakulWordIndex(0);
    setSelectedOption(null);
  };

  const cabaranActiveAudioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (text: string) => {
    if (!text) return;

    // Stop any existing audio instance to prevent double playback
    if (cabaranActiveAudioRef.current) {
      try {
        cabaranActiveAudioRef.current.pause();
        cabaranActiveAudioRef.current.currentTime = 0;
      } catch (e) {}
      cabaranActiveAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    if (cabaranId === 'fonik_abc' || cabaranId === 'fonik') {
      const clean = String(text).toLowerCase().trim();
      let soundPath = `/audio/fonik/fonik ${clean}.MP3`;
      if (clean === 'é' || clean === 'e taling' || clean === 'e tailing' || clean === 'e-taling') {
        soundPath = '/audio/fonik/fonik e tailing.MP3';
      } else if (clean === 'e' || clean === 'e pepet' || clean === 'e-pepet') {
        soundPath = '/audio/fonik/fonik e.MP3';
      } else if (clean === 'w') {
        soundPath = '/audio/abc/w.mp3';
      }
      try {
        const audio = new Audio(soundPath);
        cabaranActiveAudioRef.current = audio;
        audio.onended = () => {
          if (cabaranActiveAudioRef.current === audio) cabaranActiveAudioRef.current = null;
        };
        audio.play().catch(err => {
          console.warn("Cabaran phonics audio notice:", soundPath, err);
          if (cabaranActiveAudioRef.current === audio) cabaranActiveAudioRef.current = null;
        });
      } catch (e) {}
      return;
    }

    if (cabaranId === 'vokal_konsonan') {
      const clean = String(text).toLowerCase().trim();
      const soundPath = `/audio/sukukata/${clean}.mp3`;
      try {
        const audio = new Audio(soundPath);
        cabaranActiveAudioRef.current = audio;
        audio.onended = () => {
          if (cabaranActiveAudioRef.current === audio) cabaranActiveAudioRef.current = null;
        };
        audio.play().catch(err => {
          console.warn("Sukukata audio play notice:", soundPath, err);
          if (typeof (window as any).sebutAudio === 'function') {
            (window as any).sebutAudio(clean);
          }
        });
        return;
      } catch (e) {}
    }

    if (text.startsWith('/audio/') || text.endsWith('.mp3') || text.endsWith('.MP3')) {
      try {
        const audio = new Audio(text);
        cabaranActiveAudioRef.current = audio;
        audio.onended = () => {
          if (cabaranActiveAudioRef.current === audio) cabaranActiveAudioRef.current = null;
        };
        audio.play().catch(() => {});
      } catch (e) {}
      return;
    }

    if (typeof (window as any).sebutAudio === 'function') {
      (window as any).sebutAudio(text);
    } else if ('speechSynthesis' in window) {
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
        if (typeof (window as any).playOops === 'function') {
          (window as any).playOops();
        } else {
          // Direct fallback
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(280, now);
            osc1.frequency.exponentialRampToValueAtTime(190, now + 0.15);
            g1.gain.setValueAtTime(0.65, now);
            g1.gain.exponentialRampToValueAtTime(0.05, now + 0.16);
            osc1.connect(g1); g1.connect(ctx.destination);
            osc1.start(now); osc1.stop(now + 0.16);

            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(200, now + 0.16);
            osc2.frequency.exponentialRampToValueAtTime(120, now + 0.38);
            g2.gain.setValueAtTime(0.6, now + 0.16);
            g2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc2.connect(g2); g2.connect(ctx.destination);
            osc2.start(now + 0.16); osc2.stop(now + 0.4);
          }
        }
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
      colors: ['#22c55e', '#ffffff', '#ffe24a'],
      zIndex: 99999
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
        setGameState('lose');
      }
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuestionCycle(c => c + 1);
      setShowAudioDemoCursor(true);
      setActiveBakulWordIndex(0);
      setSelectedOption(null);
    } else {
      setGameState('result');
    }
  };

  const handleSlotDrop = (slotIndex: number, optionIndex: number) => {
    if (feedback !== null || gameState !== 'playing') return;
    if (susunSlots[slotIndex] !== null) return;
    if (susunSlots.includes(optionIndex)) return;

    const newSlots = [...susunSlots];
    newSlots[slotIndex] = optionIndex;
    setSusunSlots(newSlots);

    const currentQ = questions[currentIndex];
    if (newSlots.every(s => s !== null) && newSlots.length === currentQ.syllables.length) {
      const arrangedStr = newSlots.map(optIdx => currentQ.options[optIdx!]).join('');
      if (arrangedStr === currentQ.syllables.join('')) {
        handleCorrect();
      } else {
        handleWrong();
        setTimeout(() => {
          setSusunSlots(new Array(currentQ.syllables.length).fill(null));
        }, 1000);
      }
    }
  };

  const handleOptionClick = (option: string, i?: number) => {
    if (feedback !== null || gameState !== 'playing') return;

    const currentQ = questions[currentIndex];

    if (currentQ.type === 'susun' && i !== undefined) {
      if (susunSlots.includes(i)) return;
      const emptySlotIndex = susunSlots.findIndex(s => s === null);
      if (emptySlotIndex !== -1) {
        handleSlotDrop(emptySlotIndex, i);
      }
      return;
    }

    setSelectedOption(option);
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
  const isAyatPrompt = currentQ?.joinWith === ' ' || cabaranId === 'ayat_pendek' || cabaranId === 'ayat_panjang' || (typeof title === 'string' && title.toLowerCase().includes('ayat'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: 'transparent', overflowY: 'auto' }}>

      {/* Header */}
      <div className="map-top-bar" style={{ paddingTop: "20px", marginBottom: "15px" }}>
        <button className="neo-btn bg-purple back-icon-btn" onClick={onClose} aria-label="Kembali">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="neo-btn bg-purple page-title" style={{ pointerEvents: 'none', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
          {(() => {
            const clean = title.replace(/^Cabaran\s+/i, '').trim();
            if (clean.toLowerCase() === 'ayat pendek') return 'Ayat Pendek';
            if (clean.toLowerCase() === 'ayat panjang') return 'Ayat Panjang';
            if (clean.toLowerCase() === 'petikan tahap 1') return 'Petikan Tahap 1';
            if (clean.toLowerCase() === 'petikan tahap 2') return 'Petikan Tahap 2';
            if (clean.toLowerCase() === 'cerita pendek') return 'Cerita Pendek';
            return clean || title;
          })()}
        </div>
        <div></div>
      </div>

      {/* Progress Bar & Stats */}
      <div style={{ padding: '0 20px', maxWidth: isAyatPrompt ? '940px' : '800px', margin: '0 auto', width: '100%', transition: 'max-width 0.2s ease' }}>
        <div style={{ width: '100%', height: '10px', backgroundColor: 'white', borderRadius: '10px', border: '2px solid var(--color-dark)', overflow: 'hidden', marginBottom: '8px' }}>
          {(() => {
            const maxMark = (currentQ?.type === 'padan_garisan_kvk' || currentQ?.type === 'padan_garisan_v_kvk')
              ? 10
              : currentQ?.type === 'crossword_8x8'
                ? (currentQ.words?.length || 6)
                : (questions.length || 10);
            const progressPct = Math.min(100, Math.max(0, (score / maxMark) * 100));
            return (
              <div style={{ height: '100%', backgroundColor: 'var(--color-orange)', width: `${progressPct}%`, transition: 'width 0.3s ease' }}></div>
            );
          })()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
            {(() => {
              const maxMark = (currentQ?.type === 'padan_garisan_kvk' || currentQ?.type === 'padan_garisan_v_kvk')
                ? 10
                : currentQ?.type === 'crossword_8x8'
                  ? (currentQ.words?.length || 6)
                  : (questions.length || 10);
              return (
                <>
                  <i className="fa-solid fa-star" style={{ color: 'var(--color-yellow)', WebkitTextStroke: '1px var(--color-dark)' }}></i> {score} / {maxMark}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '15px 15px 40px', width: '100%', overflowY: 'auto' }}>

        {gameState === 'playing' && currentQ && (
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="neo-box cabaran-game-card"
            style={{
              width: '100%',
              maxWidth: currentQ.type === 'crossword_8x8' ? '750px' : isAyatPrompt ? '940px' : '760px',
              backgroundColor: '#148f7d',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 2px, transparent 2px)', backgroundSize: '15px 15px',
              padding: currentQ.type === 'crossword_8x8' ? '16px' : 'clamp(16px, 3vw, 28px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: currentQ.type === 'crossword_8x8' ? '12px' : '20px',
              border: '4px solid var(--color-dark)', borderRadius: '24px',
              transition: 'max-width 0.2s ease'
            }}>

            {/* Question Content based on type */}
            {currentQ.type === 'crossword_8x8' && (
              <Crossword8x8
                key={currentIndex}
                question={currentQ}
                onRoundComplete={nextQuestion}
                playAudio={playAudio}
                playSoundEffect={playSoundEffect}
                onWordFound={() => {
                  setScore(s => s + 1);
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#22c55e', '#ffffff', '#ffe24a'],
                    zIndex: 99999
                  });
                }}
              />
            )}

            {(currentQ.type === 'padan_garisan_kvk' || currentQ.type === 'padan_garisan_v_kvk') && (
              <PadanGarisanKVK
                key={currentIndex}
                question={currentQ}
                onRoundComplete={nextQuestion}
                playAudio={playAudio}
                playSoundEffect={playSoundEffect}
                onCorrectMatch={() => setScore(s => s + 1)}
                onWrongMatch={() => {
                  setLives(l => {
                    const newLives = l - 1;
                    if (newLives <= 0) {
                      setTimeout(() => setGameState('lose'), 400);
                    }
                    return Math.max(0, newLives);
                  });
                  setShake(true);
                  setTimeout(() => setShake(false), 500);
                }}
              />
            )}

            {currentQ.type === 'dengar' && (
              <div style={{ textAlign: 'center', margin: '8px 0 12px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', overflow: 'visible' }}>
                  <button
                    className="neo-btn bg-orange cabaran-orange-audio-glow"
                    onClick={() => {
                      setShowAudioDemoCursor(false);
                      playAudio(currentQ.audio);
                    }}
                    title="Tekan untuk dengar audio"
                    aria-label="Tekan untuk dengar audio"
                    style={{
                      fontSize: '3rem',
                      padding: '20px 48px',
                      borderRadius: '26px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fa-solid fa-volume-high"></i>
                  </button>

                  {/* Cursor Tunjuk Cara Tekan Butang Audio (Hanya Tunjuk Sekejap di Awal Setiap Soalan) */}
                  <AnimatePresence>
                    {showAudioDemoCursor && (
                      <motion.div
                        key={`audio-demo-cursor-${currentIndex}-${questionCycle}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.25 }}
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '10px',
                          pointerEvents: 'none',
                          zIndex: 35,
                          filter: 'drop-shadow(0 4px 8px rgba(16, 24, 47, 0.35))'
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 0.86, 1],
                            rotate: [-10, -22, -10],
                            y: [0, -4, 0]
                          }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg
                            width="44"
                            height="44"
                            viewBox="-3 -3 30 30"
                            fill="none"
                            style={{ overflow: 'visible', display: 'block' }}
                          >
                            <circle cx="8" cy="5" r="5.6" fill="rgba(255, 226, 74, 0.45)" stroke="#ffe24a" strokeWidth="1.5" />
                            <circle cx="8" cy="5" r="3.5" fill="#ff7a00" stroke="#ff7a00" strokeWidth="1" />
                            <path
                              d="M9 11V4.5C9 3.67 8.33 3 7.5 3C6.67 3 6 3.67 6 4.5V12.5L4.85 11.27C4.33 10.74 3.49 10.74 2.97 11.27C2.45 11.8 2.45 12.64 2.97 13.17L7.6 17.8C8.5 18.7 9.7 19.2 11 19.2H14.5C16.99 19.2 19 17.19 19 14.7V10.5C19 9.67 18.33 9 17.5 9C17.3 9 17.1 9.04 16.92 9.12C16.66 8.46 16.03 8 15.28 8C15.05 8 14.83 8.05 14.63 8.15C14.33 7.46 13.65 7 12.85 7C12.65 7 12.45 7.04 12.27 7.12C12.01 6.46 11.38 6 10.63 6C9.73 6 9 6.73 9 7.63V11Z"
                              fill="#ffffff"
                              stroke="#10182f"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {(currentQ.type === 'padan' || currentQ.type === 'lengkap' || currentQ.type === 'teka') && (() => {
              const targetAudio = currentQ.imageText || currentQ.word || currentQ.audio || currentQ.text || currentQ.answer;
              return (
                <div
                  className={`neo-box cabaran-bacaan-box ${currentQ.type === 'padan' && !currentQ.image.includes('+') && !currentQ.image.includes('-') ? 'cabaran-padan-box' : ''}`}
                  style={{
                    backgroundColor: '#ffffff',
                    backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.05) 1.5px, transparent 1.5px)',
                    backgroundSize: '15px 15px',
                    textAlign: 'center',
                    padding: (currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? '10px 14px' : '20px 40px',
                    width: '100%',
                    maxWidth: (currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? 'clamp(220px, 75vw, 300px)' : '450px',
                    position: 'relative',
                    cursor: targetAudio ? 'pointer' : 'default',
                    overflow: 'visible'
                  }}
                  onClick={() => {
                    if (targetAudio) playAudio(targetAudio);
                  }}
                  title={targetAudio ? "Tekan untuk dengar audio" : undefined}
                >
                  {currentQ.type !== 'teka' && (
                    <div
                      className={`cabaran-bacaan-image ${currentQ.type === 'padan' && !currentQ.image.includes('🍪') && !currentQ.image.includes('+') && !currentQ.image.includes('-') ? 'cabaran-padan-image' : ''} ${(currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? 'cabaran-math-image' : ''}`}
                      style={{
                        fontSize: (currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? 'clamp(1.8rem, 6.5vw, 2.8rem)' : (currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 10vw, 4rem)'),
                        filter: (currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? 'none' : 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))',
                        cursor: targetAudio ? 'pointer' : 'default',
                        wordBreak: 'break-word',
                        whiteSpace: (currentQ.image.includes('+') || currentQ.image.includes('-')) && currentQ.image.includes('=') ? 'nowrap' : 'normal',
                        lineHeight: 1.3
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (targetAudio) playAudio(targetAudio);
                      }}
                    >
                      {currentQ.image.includes('🍪') ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                          {currentQ.image.split(' ').map((char: string, i: number) => (
                            char === '🍪' ? <span key={i} style={{ display: 'inline-block' }}>🍪</span> : (char === '\n' ? <div key={i} style={{ width: '100%', height: 0 }}></div> : <span key={i}>{char}</span>)
                          ))}
                        </div>
                      ) : currentQ.image && currentQ.image.includes('<img') ? (
                        <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                      ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png')) ? (
                        <img
                          src={currentQ.image}
                          alt={currentQ.imageText || "Soalan"}
                          style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain', cursor: targetAudio ? 'pointer' : 'default' }}
                        />
                      ) : (
                        currentQ.image
                      )}
                    </div>
                  )}
                  {targetAudio && (
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      className="neo-btn bg-yellow cabaran-dengar-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(targetAudio);
                      }}
                      title="Dengar Sebutan Audio"
                      aria-label="Dengar Sebutan Audio"
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      aspectRatio: '1/1',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: '3px solid var(--color-dark, #10182f)',
                      boxShadow: '0 3px 0 var(--color-dark, #10182f)',
                      backgroundColor: '#facc15'
                    }}
                  >
                    <i className="fa-solid fa-volume-high" style={{ color: 'var(--color-dark, #10182f)', fontSize: '1.15rem' }}></i>
                  </motion.button>
                )}
                {currentQ.type === 'lengkap' && (
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '15px' }}>
                    {currentQ.prefix} + {currentQ.suffix}
                  </div>
                )}
                {currentQ.type === 'teka' && (
                  <div
                    style={{
                      fontSize: 'clamp(2.2rem, 6.5vw, 3.2rem)',
                      fontWeight: '900',
                      marginTop: '10px',
                      marginBottom: '10px',
                      letterSpacing: '8px',
                      cursor: (currentQ.imageText || currentQ.word) ? 'pointer' : 'default',
                      color: 'var(--color-dark, #10182f)'
                    }}
                    onClick={() => (currentQ.imageText || currentQ.word) && playAudio(currentQ.imageText || currentQ.word)}
                  >
                    {currentQ.text}
                  </div>
                )}
              </div>
            );
          })()}

            {currentQ.type === 'cari_gambar' && (
              <div
                className={`neo-box cabaran-bacaan-box ${currentQ.type === 'padan' ? 'cabaran-padan-box' : ''}`}
                style={{
                  backgroundColor: '#ffffff',
                  backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.05) 1.5px, transparent 1.5px)',
                  backgroundSize: '15px 15px',
                  textAlign: 'center',
                  padding: '24px 30px',
                  width: '100%',
                  maxWidth: '450px',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '20px'
                }}
                onClick={() => playAudio(currentQ.imageText || currentQ.displayWord)}
              >
                <button
                  className="neo-btn bg-yellow cabaran-dengar-btn"
                  onClick={(e) => { e.stopPropagation(); playAudio(currentQ.imageText || currentQ.displayWord); }}
                  title="Dengar Audio"
                  aria-label="Dengar Audio"
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    maxWidth: '44px',
                    maxHeight: '44px',
                    borderRadius: '50%',
                    padding: '0',
                    margin: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    aspectRatio: '1/1',
                    flexShrink: 0,
                    boxSizing: 'border-box'
                  }}
                >
                  <i className="fa-solid fa-volume-high" style={{ color: 'var(--color-dark)', fontSize: '1.1rem' }}></i>
                </button>

                <div style={{
                  fontSize: (currentQ.displayWord || currentQ.imageText || '').length > 25 ? '1.35rem' : '2.8rem',
                  fontWeight: (currentQ.displayWord || currentQ.imageText || '').length > 25 ? '800' : '900',
                  color: '#0f172a',
                  letterSpacing: (currentQ.displayWord || currentQ.imageText || '').length > 25 ? '0px' : '1px',
                  textTransform: (currentQ.displayWord || currentQ.imageText || '').length > 25 ? 'none' : 'lowercase',
                  lineHeight: '1.3'
                }}>
                  {currentQ.displayWord || currentQ.imageText}
                </div>
              </div>
            )}

            {currentQ.type === 'bacaan' && (
              <div className={`neo-box cabaran-bacaan-box ${currentQ.type === 'padan' ? 'cabaran-padan-box' : ''}`} style={{ backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.05) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', textAlign: 'center', padding: '16px 20px', width: '100%', maxWidth: '550px', position: 'relative' }}>
                <div className="cabaran-bacaan-image" style={{ fontSize: currentQ.image && currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2rem)' : 'clamp(2.5rem, 10vw, 3rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', wordBreak: 'break-word', lineHeight: 1.3 }}>
                  {currentQ.image && currentQ.image.includes('<img') ? (
                    <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png') || currentQ.image.includes('.jpg')) ? (
                    <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '135px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }} />
                  ) : (
                    currentQ.image
                  )}
                </div>
                {currentQ.imageText && (
                  <button
                    className="neo-btn bg-yellow cabaran-dengar-btn"
                    onClick={(e) => { e.stopPropagation(); playAudio(currentQ.imageText); }}
                    title="Dengar Audio"
                    aria-label="Dengar Audio"
                    style={{ position: 'absolute', top: '-12px', right: '-12px', width: '38px', height: '38px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, aspectRatio: '1/1', flexShrink: 0 }}
                  >
                    <i className="fa-solid fa-volume-high" style={{ color: 'var(--color-dark)', fontSize: '1rem' }}></i>
                  </button>
                )}
                <div
                  className="cabaran-bacaan-passage"
                  onClick={() => currentQ.imageText && playAudio(currentQ.imageText)}
                  title="Tekan teks untuk dengar audio"
                  style={{
                    fontSize: currentQ.passage && currentQ.passage.length > 120 ? '0.92rem' : '1.05rem',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.5',
                    margin: '12px 0',
                    backgroundColor: 'rgba(255,255,255,0.88)',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '2px solid rgba(0,0,0,0.1)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {currentQ.passage}
                </div>
                <div className="cabaran-bacaan-question" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#168f81', marginTop: '8px' }}>
                  {currentQ.question}
                </div>
              </div>
            )}

            {currentQ.type === 'susun' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                <div className="neo-box cabaran-bacaan-box cabaran-susun-box" style={{ backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.05) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', padding: '16px 40px', width: '100%', maxWidth: '420px', position: 'relative', borderRadius: '20px' }}>
                  <div className="cabaran-bacaan-image cabaran-susun-image" style={{ fontSize: currentQ.image && currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(2.5rem, 10vw, 3.8rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', cursor: currentQ.imageText ? 'pointer' : 'default', wordBreak: 'break-word', lineHeight: 1.3 }} onClick={() => currentQ.imageText && playAudio(currentQ.imageText)}>
                    {currentQ.image && currentQ.image.includes('<img') ? (
                      <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png') || currentQ.image.includes('.jpg')) ? (
                      <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '135px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }} />
                    ) : (
                      currentQ.image
                    )}
                  </div>
                  {currentQ.imageText && (
                    <button className="neo-btn bg-yellow cabaran-dengar-btn" onClick={(e) => { e.stopPropagation(); playAudio(currentQ.imageText); }} style={{ position: 'absolute', top: '-12px', right: '-12px', width: '38px', height: '38px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, aspectRatio: '1/1', flexShrink: 0 }}>
                      <i className="fa-solid fa-volume-high" style={{ color: 'var(--color-dark)', fontSize: '1rem' }}></i>
                    </button>
                  )}
                </div>

                {(() => {
                  const promptText = isAyatPrompt
                    ? "Susun perkataan menjadi ayat lengkap:"
                    : "Susun suku kata menjadi perkataan lengkap:";
                  return (
                    <>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: 'clamp(0.95rem, 3.2vw, 1.15rem)', textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
                        {promptText}
                      </div>

                      <div className={`cabaran-susun-slots-container ${isAyatPrompt ? 'is-ayat' : ''}`}>
                        {currentQ.syllables.map((_: any, i: number) => {
                          const filledOptIdx = susunSlots[i];
                          const filledText = filledOptIdx !== null && filledOptIdx !== undefined ? currentQ.options[filledOptIdx] : '';
                          return (
                            <div
                              key={i}
                              data-slot-index={i}
                              className={`neo-box cabaran-susun-slot ${isAyatPrompt ? 'is-ayat' : ''}`}
                              style={{
                                border: filledText ? '3.5px solid var(--color-dark)' : '3.5px dashed rgba(255,255,255,0.9)',
                                backgroundColor: filledText ? '#ffffff' : 'rgba(255, 255, 255, 0.28)',
                                color: filledText ? 'var(--color-dark)' : 'white',
                                boxShadow: filledText ? '0 3px 0 var(--color-dark)' : 'none',
                                cursor: filledText ? 'pointer' : 'default',
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const optionIndexStr = e.dataTransfer.getData('text/plain');
                                if (!optionIndexStr) return;
                                handleSlotDrop(i, parseInt(optionIndexStr, 10));
                              }}
                              onClick={() => {
                                if (susunSlots[i] !== null && feedback === null) {
                                  const newSlots = [...susunSlots];
                                  newSlots[i] = null;
                                  setSusunSlots(newSlots);
                                }
                              }}
                            >
                              {filledText}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {currentQ.type === 'bakul' && currentQ.words && currentQ.words[activeBakulWordIndex] && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                  <div className="neo-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <span>{currentQ.words[activeBakulWordIndex].image}</span>
                    <span>{currentQ.words[activeBakulWordIndex].text}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="neo-box" onClick={() => handleBakulClick('a')} style={{ backgroundColor: selectedOption === 'a' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#ffffff') : '#ffffff', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <span style={{ fontSize: '3rem' }}>🧺</span>
                    <strong style={{ color: selectedOption === 'a' && feedback ? 'white' : '#854d0e', textTransform: 'lowercase' }}>{currentQ.bakulATitle || 'bakul a'}</strong>
                    <span style={{ fontSize: '0.9rem', color: selectedOption === 'a' && feedback ? 'white' : '#a16207', textTransform: 'lowercase' }}>{currentQ.bakulADesc || 'bermula vokal "a"'}</span>
                  </button>
                  <button className="neo-box" onClick={() => handleBakulClick('b')} style={{ backgroundColor: selectedOption === 'b' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#ffffff') : '#ffffff', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <span style={{ fontSize: '3rem' }}>🧺</span>
                    <strong style={{ color: selectedOption === 'b' && feedback ? 'white' : '#075985', textTransform: 'lowercase' }}>{currentQ.bakulBTitle || 'bakul b'}</strong>
                    <span style={{ fontSize: '0.9rem', color: selectedOption === 'b' && feedback ? 'white' : '#0ea5e9', textTransform: 'lowercase' }}>{currentQ.bakulBDesc || 'bermula vokal "i/u/e/o"'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Options for non-bakul types */}
            {currentQ.options && (() => {
              if (currentQ.type === 'susun') {
                return (
                  <div className={`cabaran-susun-options-container ${isAyatPrompt ? 'is-ayat' : ''}`}>
                    {currentQ.options.map((opt: string, i: number) => {
                      const isUsed = susunSlots.includes(i);
                      return (
                        <button
                          key={i}
                          className={`neo-btn bg-white cabaran-susun-opt-btn ${isAyatPrompt ? 'is-ayat' : ''}`}
                          style={{
                            opacity: isUsed ? 0.25 : 1,
                            pointerEvents: isUsed ? 'none' : 'auto',
                            color: 'var(--color-dark)',
                            cursor: isUsed ? 'default' : 'grab',
                          }}
                          draggable={!isUsed}
                          onDragStart={(e) => { e.dataTransfer.setData('text/plain', i.toString()); }}
                          onTouchStart={(e) => {
                            if (isUsed || feedback !== null) return;
                            const t = e.touches[0];
                            touchStartPosRef.current = { x: t.clientX, y: t.clientY };
                            setTouchDragInfo({ optIndex: i, text: opt, x: t.clientX, y: t.clientY });
                          }}
                          onTouchMove={(e) => {
                            if (!touchStartPosRef.current) return;
                            const t = e.touches[0];
                            setTouchDragInfo(prev => prev ? { ...prev, x: t.clientX, y: t.clientY } : null);
                          }}
                          onTouchEnd={(e) => {
                            if (!touchStartPosRef.current) return;
                            const t = e.changedTouches[0];
                            const start = touchStartPosRef.current;
                            const dist = Math.hypot(t.clientX - start.x, t.clientY - start.y);
                            const elUnder = document.elementFromPoint(t.clientX, t.clientY);
                            const slotEl = elUnder?.closest('[data-slot-index]');

                            if (slotEl) {
                              const slotIdx = parseInt(slotEl.getAttribute('data-slot-index') || '-1', 10);
                              if (slotIdx >= 0) {
                                handleSlotDrop(slotIdx, i);
                              }
                            } else if (dist < 14) {
                              handleOptionClick(opt, i);
                            }
                            setTouchDragInfo(null);
                            touchStartPosRef.current = null;
                          }}
                          onClick={() => handleOptionClick(opt, i)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                );
              }

              if (currentQ.type === 'cari_gambar') {
                return (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    width: '100%',
                    maxWidth: '540px'
                  }}>
                    {currentQ.options.map((optIcon: string, i: number) => {
                      let btnBg = 'bg-white';
                      let textColor = 'var(--color-dark)';

                      if (selectedOption === optIcon) {
                        btnBg = feedback === 'correct' ? 'bg-green' : feedback === 'wrong' ? 'bg-red' : 'bg-white';
                        if (feedback) textColor = 'white';
                      }

                      return (
                        <button
                          key={i}
                          className={'neo-btn ' + btnBg + ' cabaran-opt-img-btn'}
                          style={{
                            padding: '8px',
                            height: '115px',
                            maxHeight: '115px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            color: textColor,
                            overflow: 'hidden'
                          }}
                          onClick={() => handleOptionClick(optIcon, i)}
                        >
                          {optIcon && optIcon.includes('<img') ? (
                            <div dangerouslySetInnerHTML={{ __html: optIcon }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                          ) : optIcon && (optIcon.startsWith('/') || optIcon.includes('.png')) ? (
                            <img src={optIcon} alt="Pilihan" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                          ) : (
                            optIcon
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              }

              const isCookieOption = currentQ.options.some((o: string) => o.includes('🍪') || o === '➖');
              const maxOptLen = Math.max(...currentQ.options.map((o: string) => (o || '').length));
              const isAsasBunyiKata = [
                'kenal_huruf',
                'kenali_huruf',
                'vokal_konsonan',
                'fonik_abc',
                'huruf_vokal',
                'huruf_konsonan',
                'pengenalan_nombor',
                'bilang_siri_nombor',
                'konsep_tambah',
                'konsep_penolakan'
              ].includes(cabaranId || '');
              const isShortText = !isCookieOption && maxOptLen <= 4;

              let fontSz = '1.8rem';
              let pad = '18px';
              let minH = '64px';

              if (isCookieOption) {
                fontSz = 'clamp(1.45rem, 5.5vw, 2.2rem)';
                pad = '12px 10px';
                minH = '70px';
              } else if (isShortText) {
                fontSz = 'clamp(2.2rem, 7.5vw, 2.9rem)';
                pad = '14px 16px';
                minH = '76px';
              } else if (maxOptLen > 40) {
                fontSz = '0.95rem';
                pad = '12px 16px';
                minH = '54px';
              } else if (maxOptLen > 25) {
                fontSz = '1.05rem';
                pad = '12px 16px';
                minH = '56px';
              } else if (maxOptLen > 12) {
                fontSz = '1.15rem';
                pad = '14px 18px';
                minH = '58px';
              } else if (maxOptLen > 6) {
                fontSz = '1.4rem';
                pad = '16px';
                minH = '62px';
              }

              const isSingleCol = currentQ.options.some((o: string) => o && o.length > 20 && !o.includes('🍪'));

              return (
                <div
                  className={`cabaran-options-grid ${isAsasBunyiKata ? 'cabaran-grid-asas' : ''}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isSingleCol ? '1fr' : (isCookieOption ? '1fr' : '1fr 1fr'),
                    gap: isShortText ? '14px' : '12px',
                    width: '100%'
                  }}
                >
                  {currentQ.options.map((opt: string, i: number) => {
                    let btnBg = 'bg-white';
                    let textColor = 'var(--color-dark)';

                    let btnStyle = {
                      padding: pad,
                      fontSize: fontSz,
                      minHeight: minH,
                      textTransform: 'none' as const,
                      opacity: 1,
                      pointerEvents: 'auto' as 'auto' | 'none',
                      color: textColor,
                      lineHeight: '1.3',
                      fontWeight: isShortText ? '900' : '700'
                    };

                    if (selectedOption === opt) {
                      btnBg = feedback === 'correct' ? 'bg-green' : feedback === 'wrong' ? 'bg-red' : 'bg-white';
                      if (feedback) btnStyle.color = 'white';
                    }

                    return (
                      <button
                        key={i}
                        className={`neo-btn ${btnBg} cabaran-opt-btn ${isShortText ? 'cabaran-opt-short' : ''} ${isCookieOption ? 'cabaran-opt-cookie' : ''}`}
                        style={btnStyle}
                        onClick={() => handleOptionClick(opt, i)}
                      >
                        {isCookieOption ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: fontSz, lineHeight: 1 }}>
                            {opt.split(' ').map((char: string, j: number) => (
                              char === '🍪' ? <span key={j} style={{ display: 'inline-block', fontSize: 'inherit' }}>🍪</span> : (char === '\n' ? <div key={j} style={{ width: '100%', height: 0 }}></div> : <span key={j} style={{ fontSize: 'inherit' }}>{char}</span>)
                            ))}
                          </div>
                        ) : (
                          opt
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}

          </motion.div>
        )}

        {/* Result Screen */}
        {(gameState === 'result' || gameState === 'lose') && (() => {
          const isLose = gameState === 'lose' || lives <= 0;
          const firstQType = questions[0]?.type;
          const total = (firstQType === 'padan_garisan_kvk' || firstQType === 'padan_garisan_v_kvk')
            ? 10
            : firstQType === 'crossword_8x8'
              ? (questions[0]?.words?.length || 6)
              : (questions.length || 10);
          const pct = total > 0 ? score / total : 0;
          const star1 = Math.ceil(total * 0.4);
          const star2 = Math.ceil(total * 0.7);
          const star3 = total;

          const isStarActive = (starNum: number) => {
            if (isLose) return false;
            const threshold = starNum === 1 ? star1 : starNum === 2 ? star2 : star3;
            return score >= threshold;
          };

          const activeStarCount = [1, 2, 3].filter(s => isStarActive(s)).length;
          const headerText = (activeStarCount === 3 || score === total) && !isLose
            ? 'Tahniah Anda Hebat!'
            : 'Cuba Lagi!';

          return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={{
                  backgroundColor: '#ffffff',
                  backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.07) 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                  textAlign: 'center',
                  maxWidth: '495px',
                  width: '92%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '26px 24px',
                  borderRadius: '26px',
                  border: '4px solid var(--color-dark, #10182f)',
                  boxShadow: '0 10px 0 var(--color-dark, #10182f), 0 20px 30px rgba(0,0,0,0.25)',
                  boxSizing: 'border-box'
                }}
              >
                {/* Header Title Banner with Refined Clean Corners */}
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
                        fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
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

                {/* 3 Tiered Stars: Left & Right Smaller/Angled, Center Bigger & Raised */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  margin: '2px 0 0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  width: '100%',
                  minHeight: '100px'
                }}>
                  {[1, 2, 3].map((starNum, index) => {
                    const active = isStarActive(starNum);
                    const isCenter = starNum === 2;
                    const size = isCenter ? 94 : 70;
                    const rotation = starNum === 1 ? -8 : starNum === 3 ? 8 : 0;
                    const translateY = isCenter ? -6 : 8;

                    return (
                      <motion.div
                        key={starNum}
                        initial={{ y: -70, opacity: 0, scale: 0.2, rotate: rotation - 20 }}
                        animate={{ y: translateY, opacity: 1, scale: 1, rotate: rotation }}
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 18,
                          delay: index * 0.14 + 0.1
                        }}
                        style={{
                          position: 'relative',
                          filter: active
                            ? 'drop-shadow(0px 7px 0px #b45309) drop-shadow(0px 10px 16px rgba(245, 158, 11, 0.45))'
                            : 'drop-shadow(0px 5px 0px #334155) drop-shadow(0px 6px 10px rgba(0,0,0,0.18))',
                          zIndex: isCenter ? 3 : 2
                        }}
                      >
                        <div className="shiny-reveal" style={{ borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                            <defs>
                              <linearGradient id={`starGold_cs_${starNum}`} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="35%" stopColor="#fbbf24" />
                                <stop offset="75%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#d97706" />
                              </linearGradient>
                              <linearGradient id={`starGray_cs_${starNum}`} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="40%" stopColor="#e2e8f0" />
                                <stop offset="80%" stopColor="#cbd5e1" />
                                <stop offset="100%" stopColor="#94a3b8" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z"
                              fill={active ? `url(#starGold_cs_${starNum})` : `url(#starGray_cs_${starNum})`}
                              stroke="#10182f"
                              strokeWidth="4.5"
                              strokeLinejoin="round"
                            />
                            {active && (
                              <path
                                d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z"
                                fill="rgba(255, 255, 255, 0.35)"
                              />
                            )}
                          </svg>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Dashed Border Card: Badge (Left) & Score (Right) */}
                {(() => {
                  const currentPetaId = getPetaId(cabaranId);
                  const currentBadge = BADGES_BY_PETA[currentPetaId] || BADGES_BY_PETA[1];
                  const isFullStars = (activeStarCount === 3 || score === total) && !isLose;

                  return (
                    <div style={{
                      width: '100%',
                      border: '2.5px dashed #94a3b8',
                      borderRadius: '20px',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxSizing: 'border-box'
                    }}>
                      {/* Left: Badge Display with Pulsing Outline Glow */}
                      <div style={{
                        flex: '0 0 110px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div
                          className={isFullStars ? 'badge-gold-glow-pulse' : 'badge-glow-pulse'}
                          style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* Golden shine loop when badge unlocked */}
                          {isFullStars && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              pointerEvents: 'none',
                              zIndex: 12
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-150%',
                                width: '60%',
                                height: '200%',
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
                                transform: 'rotate(25deg)',
                                animation: 'shineSweepLoop 3s infinite ease-in-out'
                              }} />
                            </div>
                          )}

                          <img
                            src={currentBadge.image}
                            alt={currentBadge.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              filter: isFullStars
                                ? 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.4))'
                                : 'grayscale(100%) opacity(0.55)'
                            }}
                          />

                          {!isFullStars && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 15,
                              pointerEvents: 'none'
                            }}>
                              <i className="fa-solid fa-lock" style={{
                                fontSize: '2.5rem',
                                color: '#ffffff',
                                filter: 'drop-shadow(0 3px 0 #0f172a) drop-shadow(0 4px 10px rgba(0,0,0,0.8))'
                              }}></i>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: ANDA MENDAPAT + [ activeStarCount ] (With Outline Glow Pulse) + BINTANG */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: '900',
                          color: '#0f172a',
                          letterSpacing: '0.5px',
                          fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                        }}>
                          ANDA MENDAPAT
                        </div>

                        <div
                          className="score-box-glow-pulse"
                          style={{
                            backgroundColor: '#ffffff',
                            border: '3px solid #0f172a',
                            borderRadius: '16px',
                            padding: '4px 28px',
                            margin: '6px 0',
                            width: '100%',
                            maxWidth: '170px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ color: "#0f172a", fontSize: "2.4rem", fontWeight: "900", fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif", lineHeight: 1 }}>{activeStarCount}</span>
                        </div>

                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: '900',
                          color: '#0f172a',
                          letterSpacing: '1px',
                          fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                        }}>
                          <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                          BINTANG
                          <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Motivation / Tip Box (White Background with Modern Bulb Icon) */}
                {(() => {
                  const isFullStars = (activeStarCount === 3 || score === total) && !isLose;
                  return (
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2.5px solid #0f172a',
                      borderRadius: '16px',
                      boxShadow: '0 4px 0 #0f172a',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
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
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: '900',
                          color: '#0f172a',
                          lineHeight: '1.2',
                          fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                        }}>
                          {isFullStars ? 'Tahniah, Anda Hebat!' : 'Teruskan usaha anda!'}
                        </div>
                        <div style={{
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          color: '#475569',
                          lineHeight: '1.2',
                          marginTop: '2px'
                        }}>
                          {isFullStars ? 'Kumpul lencana sehingga peroleh sijil pencapaian!' : 'Latihan akan menjadikan anda lebih baik.'}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Bottom 3 Action Buttons (No dots, Menu icon for 3rd button) */}
                <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
                  <button
                    className="neo-btn bg-purple"
                    onClick={() => {
                      if (typeof (window as any).paparSkrin === 'function') {
                        (window as any).paparSkrin('lencana-screen');
                      }
                    }}
                    title="Koleksi Lencana"
                    style={{
                      padding: '12px 14px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      border: '3px solid #0f172a',
                      boxShadow: '0 4px 0 #0f172a'
                    }}
                  >
                    <i className="fa-solid fa-medal" style={{ fontSize: '1.6rem', color: '#ffffff' }}></i>
                  </button>

                  <button
                    className="neo-btn bg-red"
                    onClick={handleRestart}
                    title="Ulang Semula"
                    style={{
                      padding: '12px 14px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      border: '3px solid #0f172a',
                      boxShadow: '0 4px 0 #0f172a'
                    }}
                  >
                    <i className="fa-solid fa-rotate-right" style={{ fontSize: '1.6rem', color: '#ffffff' }}></i>
                  </button>

                  <button
                    className="neo-btn bg-orange"
                    onClick={onClose}
                    title="Menu Latihan"
                    style={{
                      padding: '12px 14px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      border: '3px solid #0f172a',
                      boxShadow: '0 4px 0 #0f172a'
                    }}
                  >
                    <i className="fa-solid fa-bars" style={{ fontSize: '1.6rem', color: '#ffffff' }}></i>
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

      </div>

      {touchDragInfo && (
        <div
          style={{
            position: 'fixed',
            left: touchDragInfo.x,
            top: touchDragInfo.y,
            transform: 'translate(-50%, -50%) scale(1.06)',
            pointerEvents: 'none',
            zIndex: 99999,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            backgroundColor: '#ffffff',
            color: 'var(--color-dark)',
            padding: isAyatPrompt ? '0 10px' : '0 14px',
            minWidth: isAyatPrompt ? 'clamp(62px, 20vw, 165px)' : 'clamp(74px, 22vw, 105px)',
            height: isAyatPrompt ? 'clamp(46px, 11vw, 58px)' : 'clamp(56px, 14vw, 75px)',
            borderRadius: isAyatPrompt ? '14px' : '18px',
            border: '3.5px solid var(--color-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isAyatPrompt ? 'clamp(0.85rem, 2.7vw, 1.3rem)' : 'clamp(1.65rem, 5.2vw, 2.35rem)',
            fontWeight: '900',
            fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
            userSelect: 'none'
          }}
        >
          {touchDragInfo.text}
        </div>
      )}
    </div>
  );
};
