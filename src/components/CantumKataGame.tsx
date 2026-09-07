import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface CantumWordItem {
  word: string;
  syllables: string[];
  image: string;
}

const CANTUM_DATABASE: Record<string, CantumWordItem[]> = {
  'KV + KV': [
    { word: 'beca', syllables: ['be', 'ca'], image: '/images/sukukata/beca.png' },
    { word: 'ciku', syllables: ['ci', 'ku'], image: '/images/sukukata/ciku.png' },
    { word: 'jari', syllables: ['ja', 'ri'], image: '/images/sukukata/jari.png' },
    { word: 'kuku', syllables: ['ku', 'ku'], image: '/images/sukukata/kuku.png' },
    { word: 'labu', syllables: ['la', 'bu'], image: '/images/sukukata/labu.png' },
    { word: 'lidi', syllables: ['li', 'di'], image: '/images/sukukata/lidi.png' },
    { word: 'mata', syllables: ['ma', 'ta'], image: '/images/sukukata/mata.png' },
    { word: 'nasi', syllables: ['na', 'si'], image: '/images/sukukata/nasi.png' },
    { word: 'paku', syllables: ['pa', 'ku'], image: '/images/sukukata/paku.png' },
    { word: 'raga', syllables: ['ra', 'ga'], image: '/images/sukukata/raga.png' },
    { word: 'rusa', syllables: ['ru', 'sa'], image: '/images/sukukata/rusa.png' },
    { word: 'sawi', syllables: ['sa', 'wi'], image: '/images/sukukata/sawi.png' },
    { word: 'sudu', syllables: ['su', 'du'], image: '/images/sukukata/sudu.png' },
    { word: 'tali', syllables: ['ta', 'li'], image: '/images/sukukata/tali.png' },
    { word: 'tebu', syllables: ['te', 'bu'], image: '/images/sukukata/tebu.png' }
  ],
  'V + KV': [
    { word: 'alu', syllables: ['a', 'lu'], image: '/images/sukukata/alu.png' },
    { word: 'api', syllables: ['a', 'pi'], image: '/images/sukukata/api.png' },
    { word: 'ibu', syllables: ['i', 'bu'], image: '/images/sukukata/ibu.png' },
    { word: 'isi', syllables: ['i', 'si'], image: '/images/sukukata/isi.png' },
    { word: 'ubi', syllables: ['u', 'bi'], image: '/images/sukukata/ubi.png' },
    { word: 'ulu', syllables: ['u', 'lu'], image: '/images/sukukata/ulu.png' }
  ],
  'KV + KV + KV': [
    { word: 'berudu', syllables: ['be', 'ru', 'du'], image: '/images/sukukata/berudu.png' },
    { word: 'keladi', syllables: ['ke', 'la', 'di'], image: '/images/sukukata/keladi.png' },
    { word: 'kelapa', syllables: ['ke', 'la', 'pa'], image: '/images/sukukata/kelapa.png' },
    { word: 'kemeja', syllables: ['ke', 'me', 'ja'], image: '/images/sukukata/kemeja.png' },
    { word: 'kereta', syllables: ['ke', 're', 'ta'], image: '/images/sukukata/kereta.png' },
    { word: 'kerusi', syllables: ['ke', 'ru', 'si'], image: '/images/sukukata/kerusi.png' },
    { word: 'pelita', syllables: ['pe', 'li', 'ta'], image: '/images/sukukata/pelita.png' },
    { word: 'perigi', syllables: ['pe', 'ri', 'gi'], image: '/images/sukukata/perigi.png' },
    { word: 'petani', syllables: ['pe', 'ta', 'ni'], image: '/images/sukukata/petani.png' },
    { word: 'petola', syllables: ['pe', 'to', 'la'], image: '/images/sukukata/petola.png' },
    { word: 'semalu', syllables: ['se', 'ma', 'lu'], image: '/images/sukukata/semalu.png' },
    { word: 'sepatu', syllables: ['se', 'pa', 'tu'], image: '/images/sukukata/sepatu.png' },
    { word: 'tomato', syllables: ['to', 'ma', 'to'], image: '/images/sukukata/tomato.png' },
    { word: 'wanita', syllables: ['wa', 'ni', 'ta'], image: '/images/sukukata/wanita.png' }
  ],
  'V + KVK': [
    { word: 'ayam', syllables: ['a', 'yam'], image: '/images/sukukata/ayam.png' },
    { word: 'enam', syllables: ['e', 'nam'], image: '/images/sukukata/enam.png' },
    { word: 'epal', syllables: ['e', 'pal'], image: '/images/sukukata/epal.png' },
    { word: 'ikan', syllables: ['i', 'kan'], image: '/images/sukukata/ikan.png' },
    { word: 'itik', syllables: ['i', 'tik'], image: '/images/sukukata/itik.png' },
    { word: 'obor', syllables: ['o', 'bor'], image: '/images/sukukata/obor.png' },
    { word: 'oren', syllables: ['o', 'ren'], image: '/images/sukukata/oren.png' },
    { word: 'otak', syllables: ['o', 'tak'], image: '/images/sukukata/otak.png' },
    { word: 'ular', syllables: ['u', 'lar'], image: '/images/sukukata/ular.png' },
    { word: 'ulat', syllables: ['u', 'lat'], image: '/images/sukukata/ulat.png' }
  ],
  'KV + KVK': [
    { word: 'bakul', syllables: ['ba', 'kul'], image: '/images/sukukata/bakul.png' },
    { word: 'belon', syllables: ['be', 'lon'], image: '/images/sukukata/belon.png' },
    { word: 'beruk', syllables: ['be', 'ruk'], image: '/images/sukukata/beruk.png' },
    { word: 'betik', syllables: ['be', 'tik'], image: '/images/sukukata/betik.png' },
    { word: 'botol', syllables: ['bo', 'tol'], image: '/images/sukukata/botol.png' },
    { word: 'cawan', syllables: ['ca', 'wan'], image: '/images/sukukata/cawan.png' },
    { word: 'cerek', syllables: ['ce', 'rek'], image: '/images/sukukata/cerek.png' },
    { word: 'gajah', syllables: ['ga', 'jah'], image: '/images/sukukata/gajah.png' },
    { word: 'gelas', syllables: ['ge', 'las'], image: '/images/sukukata/gelas.png' },
    { word: 'gitar', syllables: ['gi', 'tar'], image: '/images/sukukata/gitar.png' },
    { word: 'kapak', syllables: ['ka', 'pak'], image: '/images/sukukata/kapak.png' },
    { word: 'kapal', syllables: ['ka', 'pal'], image: '/images/sukukata/kapal.png' },
    { word: 'kasut', syllables: ['ka', 'sut'], image: '/images/sukukata/kasut.png' },
    { word: 'katil', syllables: ['ka', 'til'], image: '/images/sukukata/katil.png' },
    { word: 'ketam', syllables: ['ke', 'tam'], image: '/images/sukukata/ketam.png' },
    { word: 'kicap', syllables: ['ki', 'cap'], image: '/images/sukukata/kicap.png' },
    { word: 'kilat', syllables: ['ki', 'lat'], image: '/images/sukukata/kilat.png' },
    { word: 'kipas', syllables: ['ki', 'pas'], image: '/images/sukukata/kipas.png' },
    { word: 'lilin', syllables: ['li', 'lin'], image: '/images/sukukata/lilin.png' },
    { word: 'makan', syllables: ['ma', 'kan'], image: '/images/sukukata/makan.png' },
    { word: 'marah', syllables: ['ma', 'rah'], image: '/images/sukukata/marah.png' },
    { word: 'nanas', syllables: ['na', 'nas'], image: '/images/sukukata/nanas.png' },
    { word: 'pagar', syllables: ['pa', 'gar'], image: '/images/sukukata/pagar.png' },
    { word: 'sabun', syllables: ['sa', 'bun'], image: '/images/sukukata/sabun.png' },
    { word: 'sikat', syllables: ['si', 'kat'], image: '/images/sukukata/sikat.png' },
    { word: 'tayar', syllables: ['ta', 'yar'], image: '/images/sukukata/tayar.png' }
  ],
  'KVK + KV': [
    { word: 'baldi', syllables: ['bal', 'di'], image: '/images/sukukata/baldi.png' },
    { word: 'bendi', syllables: ['ben', 'di'], image: '/images/sukukata/bendi.png' },
    { word: 'garpu', syllables: ['gar', 'pu'], image: '/images/sukukata/garpu.png' },
    { word: 'jambu', syllables: ['jam', 'bu'], image: '/images/sukukata/jambu.png' },
    { word: 'kunci', syllables: ['kun', 'ci'], image: '/images/sukukata/kunci.png' },
    { word: 'lampu', syllables: ['lam', 'pu'], image: '/images/sukukata/lampu.png' },
    { word: 'lembu', syllables: ['lem', 'bu'], image: '/images/sukukata/lembu.png' },
    { word: 'pintu', syllables: ['pin', 'tu'], image: '/images/sukukata/pintu.png' }
  ],
  'KVK + KVK': [
    { word: 'biskut', syllables: ['bis', 'kut'], image: '/images/sukukata/biskut.png' },
    { word: 'cermin', syllables: ['cer', 'min'], image: '/images/sukukata/cermin.png' },
    { word: 'cincin', syllables: ['cin', 'cin'], image: '/images/sukukata/cincin.png' },
    { word: 'doktor', syllables: ['dok', 'tor'], image: '/images/sukukata/doktor.png' },
    { word: 'mancis', syllables: ['man', 'cis'], image: '/images/sukukata/mancis.png' },
    { word: 'masjid', syllables: ['mas', 'jid'], image: '/images/sukukata/masjid.png' },
    { word: 'rambut', syllables: ['ram', 'but'], image: '/images/sukukata/rambut.png' },
    { word: 'rumput', syllables: ['rum', 'put'], image: '/images/sukukata/rumput.png' },
    { word: 'sampah', syllables: ['sam', 'pah'], image: '/images/sukukata/sampah.png' },
    { word: 'sampan', syllables: ['sam', 'pan'], image: '/images/sukukata/sampan.png' },
    { word: 'tanduk', syllables: ['tan', 'duk'], image: '/images/sukukata/tanduk.png' },
    { word: 'tombol', syllables: ['tom', 'bol'], image: '/images/sukukata/tombol.png' }
  ],
  'KV + KV + KVK': [
    { word: 'basikal', syllables: ['ba', 'si', 'kal'], image: '/images/sukukata/basikal.png' },
    { word: 'kelawar', syllables: ['ke', 'la', 'war'], image: '/images/sukukata/kelawar.png' },
    { word: 'keledek', syllables: ['ke', 'le', 'dek'], image: '/images/sukukata/keledek.png' },
    { word: 'ketupat', syllables: ['ke', 'tu', 'pat'], image: '/images/sukukata/ketupat.png' },
    { word: 'piramid', syllables: ['pi', 'ra', 'mid'], image: '/images/sukukata/piramid.png' },
    { word: 'pulasan', syllables: ['pu', 'la', 'san'], image: '/images/sukukata/pulasan.png' },
    { word: 'telefon', syllables: ['te', 'le', 'fon'], image: '/images/sukukata/telefon.png' },
    { word: 'tetikus', syllables: ['te', 'ti', 'kus'], image: '/images/sukukata/tetikus.png' },
    { word: 'zirafah', syllables: ['zi', 'ra', 'fah'], image: '/images/sukukata/zirafah.png' }
  ],
  'KVK + KV + KVK': [
    { word: 'cempedak', syllables: ['cem', 'pe', 'dak'], image: '/images/sukukata/cempedak.png' },
    { word: 'cendawan', syllables: ['cen', 'da', 'wan'], image: '/images/sukukata/cendawan.png' },
    { word: 'jambatan', syllables: ['jam', 'ba', 'tan'], image: '/images/sukukata/jambatan.png' },
    { word: 'komputer', syllables: ['kom', 'pu', 'ter'], image: '/images/sukukata/komputer.png' },
    { word: 'pembaris', syllables: ['pem', 'ba', 'ris'], image: '/images/sukukata/pembaris.png' },
    { word: 'tempayan', syllables: ['tem', 'pa', 'yan'], image: '/images/sukukata/tempayan.png' }
  ]
};

function mapKeyToCategory(key: string): string {
  if (!key) return 'KV + KV';
  const clean = key.toLowerCase().trim();
  if (clean === 'kvkv' || clean === 'kv_kv') return 'KV + KV';
  if (clean === 'v_kv') return 'V + KV';
  if (clean === 'kvkvkv' || clean === 'kv_kv_kv') return 'KV + KV + KV';
  if (clean === 'v_kvk') return 'V + KVK';
  if (clean === 'kv_kvk') return 'KV + KVK';
  if (clean === 'kvk_kv') return 'KVK + KV';
  if (clean === 'kvk_kvk') return 'KVK + KVK';
  if (clean === 'kv_kv_kvk') return 'KV + KV + KVK';
  if (clean === 'kvk_kv_kvk') return 'KVK + KV + KVK';
  return 'KV + KV';
}

const PIECE_COLORS = [
  { bg: '#ffe24a', border: '#10182f', text: '#2d1b00' }, // Kuning Cerah
  { bg: '#ff70a6', border: '#10182f', text: '#3b0720' }, // Merah Jambu
  { bg: '#38bdf8', border: '#10182f', text: '#082f49' }, // Biru Langit
  { bg: '#4ade80', border: '#10182f', text: '#052e16' }, // Hijau Segar
  { bg: '#c084fc', border: '#10182f', text: '#3b0764' }  // Ungu
];

function playPopConfettiSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = (window as any).globalAudioCtx || new AudioContextClass();
    (window as any).globalAudioCtx = ctx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(680, now);
    popOsc.frequency.exponentialRampToValueAtTime(120, now + 0.09);

    popGain.gain.setValueAtTime(0.45, now);
    popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);

    popOsc.start(now);
    popOsc.stop(now + 0.09);

    [523.25, 659.25, 783.99, 1046.5].forEach((freq: number, idx: number) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, now + 0.04 + idx * 0.06);
      chimeGain.gain.setValueAtTime(0.3, now + 0.04 + idx * 0.06);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.06);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.04 + idx * 0.06);
      chimeOsc.stop(now + 0.45 + idx * 0.06);
    });
  } catch (e) {}
}

/**
 * Path SVG untuk Jigsaw Interlocking Puzzle Piece
 */
function getJigsawPath(
  hasLeftHole: boolean,
  hasRightTab: boolean,
  w: number,
  h: number,
  r: number,
  tabR: number
): string {
  const midY = h / 2;

  let d = `M ${r},0 `;
  d += `H ${w - r} `;
  d += `Q ${w},0 ${w},${r} `;

  // Sebelah kanan
  if (hasRightTab) {
    d += `V ${midY - tabR} `;
    d += `A ${tabR} ${tabR} 0 0 1 ${w} ${midY + tabR} `;
    d += `V ${h - r} `;
  } else {
    d += `V ${h - r} `;
  }

  d += `Q ${w},${h} ${w - r},${h} `;
  d += `H ${r} `;
  d += `Q 0,${h} 0,${h - r} `;

  // Sebelah kiri (lekukan ke dalam piece)
  if (hasLeftHole) {
    d += `V ${midY + tabR} `;
    d += `A ${tabR} ${tabR} 0 0 0 0 ${midY - tabR} `;
    d += `V ${r} `;
  } else {
    d += `V ${r} `;
  }

  d += `Q 0,0 ${r},0 `;
  d += 'Z';
  return d;
}

interface PiecePoolItem {
  id: string;
  syllable: string;
  originalIndex: number;
  colorIdx: number;
}

export const CantumKataGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('KV + KV');
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState<boolean>(false);
  const [floatingStarActive, setFloatingStarActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  // Puzzle slots state
  const [placedSlots, setPlacedSlots] = useState<(PiecePoolItem | null)[]>([]);
  // Syllable pieces available in tray
  const [trayPieces, setTrayPieces] = useState<PiecePoolItem[]>([]);
  // Hovered target slot for visual feedback
  const [hoveredSlotIdx, setHoveredSlotIdx] = useState<number | null>(null);
  const [wrongSlotIdx, setWrongSlotIdx] = useState<number | null>(null);
  const [completedWords, setCompletedWords] = useState<Record<string, boolean>>({});

  // Touch drag state
  const [touchDraggingPiece, setTouchDraggingPiece] = useState<PiecePoolItem | null>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  // Guide Demo Drag Cursor state
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [demoOffset, setDemoOffset] = useState<{ dx: number; dy: number } | null>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Category listener
  useEffect(() => {
    const handleOpen = (e: any) => {
      const catKey = e?.detail?.kemahiran || (window as any).currentCantumKataKemahiran || 'kvkv';
      const cat = mapKeyToCategory(catKey);
      setCurrentCategory(cat);
      const list = CANTUM_DATABASE[cat] || CANTUM_DATABASE['KV + KV'];
      setWordIndex(Math.floor(Math.random() * list.length));
    };

    window.addEventListener('buka-cantum-kemahiran', handleOpen);

    if ((window as any).currentCantumKataKemahiran) {
      const cat = mapKeyToCategory((window as any).currentCantumKataKemahiran);
      setCurrentCategory(cat);
      const list = CANTUM_DATABASE[cat] || CANTUM_DATABASE['KV + KV'];
      setWordIndex(Math.floor(Math.random() * list.length));
    } else {
      const list = CANTUM_DATABASE['KV + KV'];
      setWordIndex(Math.floor(Math.random() * list.length));
    }

    return () => window.removeEventListener('buka-cantum-kemahiran', handleOpen);
  }, []);

  // Stars & progress
  useEffect(() => {
    try {
      const studentName = (window as any).namaMuridAktif || 'guest';
      const storageKey = `cantum_completed_${studentName}_${currentCategory.replace(/\s+/g, '_')}`;
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      setCompletedWords(parsed);
      const count = Object.values(parsed).filter(Boolean).length;
      setStars(count);
    } catch (e) {
      setCompletedWords({});
      setStars(0);
    }
  }, [currentCategory]);

  const wordList = CANTUM_DATABASE[currentCategory] || CANTUM_DATABASE['KV + KV'];
  const currentItem: CantumWordItem = wordList[wordIndex] || wordList[0];

  // First empty slot and matching piece in tray for demo cursor guide
  const firstEmptySlotIdx = placedSlots.findIndex((s) => s === null);
  const demoTargetPiece = firstEmptySlotIdx !== -1 && trayPieces.length > 0
    ? (trayPieces.find((p) => p.originalIndex === firstEmptySlotIdx) || trayPieces[0])
    : null;

  // Measure delta between demoTargetPiece in tray and its target slot
  useEffect(() => {
    if (hasInteracted || isCompleted || !demoTargetPiece) {
      setDemoOffset(null);
      return;
    }

    const updateOffset = () => {
      const pieceEl = document.querySelector('[data-demo-piece="true"]');
      const slotIdx = demoTargetPiece.originalIndex;
      const slotEl = document.querySelector(`[data-cantum-slot-idx="${slotIdx}"]`);
      if (pieceEl && slotEl) {
        const pRect = pieceEl.getBoundingClientRect();
        const sRect = slotEl.getBoundingClientRect();
        const dx = (sRect.left + sRect.width / 2) - (pRect.left + pRect.width / 2);
        const dy = (sRect.top + sRect.height / 2) - (pRect.top + pRect.height / 2);
        setDemoOffset({ dx, dy });
      }
    };

    const t1 = setTimeout(updateOffset, 120);
    const t2 = setTimeout(updateOffset, 400);

    window.addEventListener('resize', updateOffset);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateOffset);
    };
  }, [wordIndex, currentCategory, placedSlots, trayPieces, hasInteracted, isCompleted, isMobile, demoTargetPiece?.id]);

  // Initialize board whenever word or category changes
  useEffect(() => {
    initRound();
  }, [currentCategory, wordIndex]);

  const initRound = () => {
    setHasInteracted(false);
    const syllables = currentItem.syllables || [];
    setPlacedSlots(Array(syllables.length).fill(null));
    setIsCompleted(false);
    setWrongSlotIdx(null);
    setHoveredSlotIdx(null);

    const pieces: PiecePoolItem[] = syllables.map((syl, idx) => ({
      id: `p-${idx}-${syl}-${Math.random()}`,
      syllable: syl,
      originalIndex: idx,
      colorIdx: idx % PIECE_COLORS.length
    }));

    // Shuffle pieces so they are rawak
    const shuffled = [...pieces];
    if (shuffled.length > 1) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const isOriginalOrder = shuffled.every((p, idx) => p.originalIndex === idx);
      if (isOriginalOrder && shuffled.length >= 2) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
    }
    setTrayPieces(shuffled);
  };

  // Pronounce audio
  const handlePronounce = () => {
    const audioPath = `/audio/sukukata/${currentItem.word}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      if (typeof (window as any).sebutAudio === 'function') {
        (window as any).sebutAudio(currentItem.word);
      } else if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(currentItem.word);
        u.lang = 'ms-MY';
        window.speechSynthesis.speak(u);
      }
    });
  };

  // Check victory condition
  const checkCompletion = (newSlots: (PiecePoolItem | null)[]) => {
    const isAllFilled = newSlots.every((item) => item !== null);
    if (!isAllFilled) return;

    const isCorrectOrder = newSlots.every((item, idx) => item?.originalIndex === idx);
    if (isCorrectOrder && !isCompleted) {
      setIsCompleted(true);

      // Save progress
      setCompletedWords((prev) => {
        const updated = { ...prev, [currentItem.word]: true };
        try {
          const studentName = (window as any).namaMuridAktif || 'guest';
          const storageKey = `cantum_completed_${studentName}_${currentCategory.replace(/\s+/g, '_')}`;
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (e) {}
        const count = Object.values(updated).filter(Boolean).length;
        setStars(count);
        return updated;
      });

      playPopConfettiSound();
      if (typeof (window as any).playTada === 'function') {
        (window as any).playTada();
      }
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#ffe24a', '#ff70a6', '#38bdf8', '#4ade80', '#c084fc'],
        zIndex: 99999
      });

      setFloatingStarActive(true);
      setTimeout(() => setFloatingStarActive(false), 2000);

      setTimeout(() => {
        handlePronounce();
      }, 400);

      // Auto-update student profile stars immediately (+1 Bintang)
      if (typeof (window as any).tambahBintangGlobal === 'function') {
        (window as any).tambahBintangGlobal('cantumKata_' + currentCategory, 1);
      }

      setTimeout(() => {
        setWordIndex((prev) => {
          if (wordList.length <= 1) return 0;
          let nextIdx = prev;
          let attempts = 0;
          while (nextIdx === prev && attempts < 20) {
            nextIdx = Math.floor(Math.random() * wordList.length);
            attempts++;
          }
          return nextIdx;
        });
      }, 2400);
    }
  };

  // Place piece into slot (Wajib seret ke slot yang betul)
  const placePieceIntoSlot = (piece: PiecePoolItem, targetSlotIdx: number) => {
    setHasInteracted(true);
    if (piece.originalIndex === targetSlotIdx) {
      const newSlots = [...placedSlots];
      newSlots[targetSlotIdx] = piece;
      setPlacedSlots(newSlots);

      setTrayPieces((prev) => prev.filter((p) => p.id !== piece.id));
      setWrongSlotIdx(null);

      if (typeof (window as any).playBubble === 'function') {
        (window as any).playBubble();
      }

      checkCompletion(newSlots);
    } else {
      setWrongSlotIdx(targetSlotIdx);
      setTimeout(() => setWrongSlotIdx(null), 600);
      if (typeof (window as any).playOops === 'function') {
        (window as any).playOops();
      }
    }
  };

  // Return placed piece to tray on tap/click
  const handlePlacedPieceClick = (slotIdx: number) => {
    setHasInteracted(true);
    if (isCompleted) return;
    const piece = placedSlots[slotIdx];
    if (!piece) return;

    const newSlots = [...placedSlots];
    newSlots[slotIdx] = null;
    setPlacedSlots(newSlots);
    setTrayPieces((prev) => [...prev, piece]);

    if (typeof (window as any).playBubble === 'function') {
      (window as any).playBubble();
    }
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, piece: PiecePoolItem) => {
    setHasInteracted(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(piece));
  };

  const handleDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setHoveredSlotIdx(slotIdx);
  };

  const handleDragLeave = () => {
    setHoveredSlotIdx(null);
  };

  const handleDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setHoveredSlotIdx(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const piece: PiecePoolItem = JSON.parse(dataStr);
      placePieceIntoSlot(piece, slotIdx);
    } catch (err) {}
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent, piece: PiecePoolItem) => {
    setHasInteracted(true);
    const touch = e.touches[0];
    setTouchDraggingPiece(piece);
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDraggingPiece) return;
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotEl = el?.closest('[data-cantum-slot-idx]');
    if (slotEl) {
      const idx = Number(slotEl.getAttribute('data-cantum-slot-idx'));
      if (!isNaN(idx)) setHoveredSlotIdx(idx);
    } else {
      setHoveredSlotIdx(null);
    }
  };

  const handleTouchEnd = () => {
    if (!touchDraggingPiece) return;
    if (hoveredSlotIdx !== null) {
      placePieceIntoSlot(touchDraggingPiece, hoveredSlotIdx);
    }
    setTouchDraggingPiece(null);
    setTouchPos(null);
    setHoveredSlotIdx(null);
  };

  // Dimensions of puzzle pieces & slots (Besar, Seimbang & Sama Saiz Tepat)
  const totalSyllables = currentItem.syllables?.length || 2;

  const pieceW = isMobile
    ? (totalSyllables === 2 ? 134 : 106)
    : (totalSyllables === 2 ? 180 : 148);

  const pieceH = isMobile
    ? (totalSyllables === 2 ? 104 : 86)
    : (totalSyllables === 2 ? 130 : 116);

  const tabRadius = isMobile
    ? (totalSyllables === 2 ? 17 : 14)
    : (totalSyllables === 2 ? 22 : 18);

  const cornerR = isMobile
    ? (totalSyllables === 2 ? 14 : 12)
    : (totalSyllables === 2 ? 18 : 16);

  // Saiz fon lebih besar untuk mobile view
  const fontSize = isMobile
    ? (totalSyllables === 2 ? '3.1rem' : '2.4rem')
    : (totalSyllables === 2 ? '3.6rem' : '2.9rem');

  const slotFontSize = isMobile
    ? (totalSyllables === 2 ? '2.1rem' : '1.7rem')
    : (totalSyllables === 2 ? '2.4rem' : '2.0rem');

  /**
   * Render single jigsaw syllable piece (Hanya boleh ditarik/seret)
   */
  const renderJigsawPiece = (
    piece: PiecePoolItem,
    slotIdx: number,
    isPlaced: boolean,
    interactive: boolean = true
  ) => {
    const hasLeftHole = slotIdx > 0;
    const hasRightTab = slotIdx < totalSyllables - 1;
    const color = PIECE_COLORS[piece.colorIdx] || PIECE_COLORS[0];
    const pathD = getJigsawPath(hasLeftHole, hasRightTab, pieceW, pieceH, cornerR, tabRadius);

    const isDemoPiece = !isPlaced && demoTargetPiece?.id === piece.id;
    const showDemoCursor = isDemoPiece && !hasInteracted && !isCompleted && placedSlots.every((s) => s === null) && demoOffset !== null;

    return (
      <div
        key={piece.id}
        data-demo-piece={isDemoPiece ? 'true' : undefined}
        draggable={interactive && !isPlaced}
        onDragStart={(e) => handleDragStart(e, piece)}
        onTouchStart={(e) => interactive && !isPlaced && handleTouchStart(e, piece)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (!interactive) return;
          if (isPlaced) {
            handlePlacedPieceClick(slotIdx);
          }
        }}
        className={`jigsaw-syllable-piece ${!isPlaced ? 'cursor-grab' : 'cursor-pointer'}`}
        style={{
          width: `${pieceW + (hasRightTab ? tabRadius : 0)}px`,
          height: `${pieceH}px`,
          position: 'relative',
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          filter: 'drop-shadow(0 5px 0 #10182f)',
          transition: 'transform 0.15s ease, filter 0.15s ease',
          marginRight: isPlaced ? (slotIdx < totalSyllables - 1 ? `-${tabRadius}px` : '0px') : (isMobile ? '6px' : '10px'),
          marginLeft: isPlaced ? '0px' : (isMobile ? '6px' : '10px'),
          zIndex: isPlaced ? slotIdx + 1 : (showDemoCursor ? 50 : 1)
        }}
        title={isPlaced ? 'Tekan untuk pulangkan kepingan' : 'Tarik kepingan ini ke ruangan cantuman di bawah'}
      >
        <svg
          width={pieceW + (hasRightTab ? tabRadius : 0) + 4}
          height={pieceH + 4}
          viewBox={`-2 -2 ${pieceW + (hasRightTab ? tabRadius : 0) + 4} ${pieceH + 4}`}
          style={{ overflow: 'visible' }}
        >
          <path
            d={pathD}
            fill={color.bg}
            stroke={color.border}
            strokeWidth="3.8"
            strokeLinejoin="round"
          />
          <text
            x={pieceW / 2 + (hasLeftHole ? tabRadius * 0.35 : 0) - (hasRightTab ? tabRadius * 0.15 : 0)}
            y={pieceH / 2 + 3}
            dominantBaseline="middle"
            textAnchor="middle"
            fill={color.text}
            style={{
              fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
              fontSize: fontSize,
              fontWeight: 900,
              pointerEvents: 'none'
            }}
          >
            {piece.syllable}
          </text>
        </svg>

        {/* Guide Hand Pointer Demo Animation (Tunjuk cara tarik kepingan ke slot sasaran) */}
        {showDemoCursor && demoOffset && (
          <motion.div
            key={`cantum-guide-cursor-${piece.id}-${demoTargetPiece.originalIndex}`}
            animate={{
              x: [0, 0, demoOffset.dx, demoOffset.dx, 0],
              y: [0, 0, demoOffset.dy, demoOffset.dy, 0],
              scale: [1, 0.86, 0.95, 1, 1],
              opacity: [0, 1, 1, 0, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.16, 0.72, 0.88, 1]
            }}
            style={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              width={isMobile ? "44" : "52"}
              height={isMobile ? "44" : "52"}
              viewBox="-3 -3 30 30"
              fill="none"
              style={{
                overflow: 'visible',
                filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))',
                display: 'block'
              }}
            >
              <circle
                cx="8"
                cy="5"
                r="5.6"
                fill="rgba(255, 226, 74, 0.45)"
                stroke="#ffe24a"
                strokeWidth="1.5"
              />
              <circle
                cx="8"
                cy="5"
                r="3.5"
                fill="#ff7a00"
                stroke="#ff7a00"
                strokeWidth="1"
              />
              <path
                d="M9 11V4.5C9 3.67 8.33 3 7.5 3C6.67 3 6 3.67 6 4.5V12.5L4.85 11.27C4.33 10.74 3.49 10.74 2.97 11.27C2.45 11.8 2.45 12.64 2.97 13.17L7.6 17.8C8.5 18.7 9.7 19.2 11 19.2H14.5C16.99 19.2 19 17.19 19 14.7V10.5C19 9.67 18.33 9 17.5 9C17.3 9 17.1 9.04 16.92 9.12C16.66 8.46 16.03 8 15.28 8C15.05 8 14.83 8.05 14.63 8.15C14.33 7.46 13.65 7 12.85 7C12.65 7 12.45 7.04 12.27 7.12C12.01 6.46 11.38 6 10.63 6C9.73 6 9 6.73 9 7.63V11Z"
                fill="#ffffff"
                stroke="#10182f"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>
    );
  };

  /**
   * Render target slot in drop area (Sama saiz 100% dengan kepingan puzzle)
   */
  const renderTargetSlot = (slotIdx: number) => {
    const hasLeftHole = slotIdx > 0;
    const hasRightTab = slotIdx < totalSyllables - 1;
    const placedPiece = placedSlots[slotIdx];
    const isHovered = hoveredSlotIdx === slotIdx;
    const isWrong = wrongSlotIdx === slotIdx;
    const pathD = getJigsawPath(hasLeftHole, hasRightTab, pieceW, pieceH, cornerR, tabRadius);

    if (placedPiece) {
      return renderJigsawPiece(placedPiece, slotIdx, true);
    }

    return (
      <div
        key={`slot-${slotIdx}`}
        data-cantum-slot-idx={slotIdx}
        onDragOver={(e) => handleDragOver(e, slotIdx)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, slotIdx)}
        style={{
          width: `${pieceW + (hasRightTab ? tabRadius : 0)}px`,
          height: `${pieceH}px`,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: slotIdx < totalSyllables - 1 ? `-${tabRadius}px` : '0px',
          zIndex: slotIdx,
          transition: 'transform 0.15s ease',
          transform: isWrong ? 'translateX(4px)' : isHovered ? 'scale(1.04)' : 'none'
        }}
      >
        <svg
          width={pieceW + (hasRightTab ? tabRadius : 0) + 4}
          height={pieceH + 4}
          viewBox={`-2 -2 ${pieceW + (hasRightTab ? tabRadius : 0) + 4} ${pieceH + 4}`}
          style={{ overflow: 'visible' }}
        >
          <path
            d={pathD}
            fill={isWrong ? 'rgba(239, 68, 68, 0.28)' : isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)'}
            stroke={isWrong ? '#ef4444' : isHovered ? '#f59e0b' : '#334155'}
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinejoin="round"
          />
          <text
            x={pieceW / 2 + (hasLeftHole ? tabRadius * 0.35 : 0) - (hasRightTab ? tabRadius * 0.15 : 0)}
            y={pieceH / 2 + 2}
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#64748b"
            style={{
              fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
              fontSize: slotFontSize,
              fontWeight: 800,
              pointerEvents: 'none'
            }}
          >
            {slotIdx + 1}
          </text>
        </svg>
      </div>
    );
  };

  /**
   * Render completed word card
   */
  const renderCompletedWordCard = () => {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="cantum-completed-card neo-box cursor-pointer"
        onClick={handlePronounce}
        style={{
          backgroundColor: '#ffffff',
          border: '3.5px solid #10182f',
          boxShadow: '0 0 28px rgba(251, 191, 36, 0.85), 0 5px 0 #10182f',
          borderRadius: '24px',
          padding: isMobile ? '12px 28px' : '18px 42px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minWidth: isMobile ? '240px' : '340px',
          margin: 'auto'
        }}
        title="Tekan untuk dengar sebutan semula"
      >
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ffe24a',
            border: '2.5px solid #10182f',
            boxShadow: '0 2.5px 0 #10182f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10182f',
            fontSize: '1.15rem',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-volume-high"></i>
        </div>

        <div
          style={{
            fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
            fontSize: isMobile ? '2.8rem' : '3.8rem',
            fontWeight: 900,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {currentItem.syllables.map((syl, idx) => {
            const isRed = idx % 2 === 1;
            return (
              <span key={idx} style={{ color: isRed ? '#ef4444' : '#10182f' }}>
                {syl}
              </span>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div id="cantum-kata-container" className="puzzle-container-root">
      {/* Top Header Bar */}
      <div className="map-top-bar" style={{ position: 'relative', zIndex: 10 }}>
        <button
          type="button"
          className="neo-btn bg-orange back-icon-btn cursor-pointer"
          onClick={onClose}
          aria-label="Kembali"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <div
          className="neo-btn bg-orange page-title"
          style={{
            pointerEvents: 'none',
            fontSize: '1.2rem',
            zIndex: 1,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <i className="fa-solid fa-puzzle-piece" style={{ color: '#fff' }}></i>
          <span style={{ fontWeight: 800 }}>CANTUM KATA</span>
        </div>

        <button
          type="button"
          className="neo-btn bg-orange help-btn info-icon-btn cursor-pointer"
          onClick={() => setShowGuideModal(true)}
          title="Panduan Cantum Kata"
          aria-label="Panduan Cantum Kata"
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </div>

      {/* Floating Star Popup (+1 Bintang! 🌟) */}
      <AnimatePresence>
        {floatingStarActive && (
          <div
            style={{
              position: 'fixed',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999999,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <motion.div
              initial={{ y: 25, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1.2 }}
              exit={{ y: -35, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(2.2rem, 7.5vw, 4rem)',
                fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
                fontWeight: 900,
                color: '#fbbf24',
                textShadow: '0 4px 14px rgba(0, 0, 0, 0.95), 0 0 24px rgba(251, 191, 36, 0.9)',
                whiteSpace: 'nowrap'
              }}
            >
              +1 Bintang! 🌟
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      {isMobile ? (
        /* MOBILE VIEW: Single Unified Card Layout */
        <div style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}>
          <div className="puzzle-mobile-unified-card neo-box" style={{ padding: '14px 10px' }}>
            {/* Top Bar: List Button, Centered Title, Reset Button */}
            <div className="puzzle-mobile-top-bar" style={{ marginBottom: '14px' }}>
              <button
                type="button"
                className="puzzle-list-btn neo-btn cursor-pointer"
                onClick={() => setShowListModal(true)}
                title="Senarai Gambar Suku Kata"
                aria-label="Senarai Gambar"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                  border: '2.5px solid #10182f',
                  backgroundColor: '#ffe24a',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f'
                }}
              >
                <i className="fa-solid fa-list"></i>
              </button>

              <div
                className="neo-btn bg-yellow ar-skill-badge"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  padding: '6px 14px',
                  borderRadius: '12px',
                  color: '#10182f',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  backgroundColor: '#ffe24a'
                }}
              >
                SUKU KATA {currentCategory}
              </div>

              <button
                type="button"
                className="neo-btn cursor-pointer"
                onClick={initRound}
                title="Ulang Semula"
                aria-label="Ulang Semula"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                  border: '2.5px solid #10182f',
                  backgroundColor: '#ffe24a',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f'
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>

            {/* Gambar Panduan Penuh */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  width: '210px',
                  height: '190px',
                  backgroundColor: '#ffffff',
                  borderRadius: '22px',
                  border: '3.5px solid #10182f',
                  boxShadow: '0 5px 0 #10182f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.word}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                />
              </div>
            </div>

            {/* Ruang Tray Kepingan Puzzle (Center Tepat) */}
            <div
              style={{
                minHeight: `${pieceH + 16}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px',
                padding: '12px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                borderRadius: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {trayPieces.length > 0 ? (
                trayPieces.map((piece) => renderJigsawPiece(piece, piece.originalIndex, false))
              ) : (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    borderRadius: '16px',
                    border: '3px solid #10182f',
                    boxShadow: '0 4px 0 #10182f',
                    color: '#10182f',
                    fontWeight: 900,
                    fontSize: '0.96rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <span
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '9px',
                      backgroundColor: '#ffe24a',
                      border: '2px solid #10182f',
                      boxShadow: '0 2px 0 #10182f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                      fontSize: '1.05rem',
                      flexShrink: 0
                    }}
                  >
                    <i className="fa-solid fa-trophy"></i>
                  </span>
                  <span>Tahniah! Suku kata telah lengkap dicantum!</span>
                </motion.div>
              )}
            </div>

            {/* Ruang Cantuman / Perkataan Selesai (Sama Saiz & Center Tepat) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: `${pieceH + 10}px`, margin: '0 auto' }}>
              {isCompleted ? (
                renderCompletedWordCard()
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                  {currentItem.syllables.map((_, idx) => renderTargetSlot(idx))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP / LAPTOP VIEW: 2 Side-by-Side Panels */
        <div className="ar-main-container puzzle-layout-grid">
          {/* Panel Kiri: Gambar Panduan Sahaja (Kemaskan saiz agar tidak terkena butang reset) */}
          <div
            className="puzzle-board-card neo-box"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              height: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Butang Reset di Sudut Kanan Atas */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 20
              }}
            >
              <button
                type="button"
                className="neo-btn cursor-pointer"
                onClick={initRound}
                title="Ulang Semula Cantuman"
                aria-label="Ulang Semula"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '2.5px solid #10182f',
                  backgroundColor: '#ffe24a',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f'
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>

            {/* Gambar Panduan Suku Kata (Saiz Kemas, Tidak Menyentuh Butang Reset) */}
            <div
              style={{
                width: '84%',
                height: '84%',
                maxHeight: '62vh',
                backgroundColor: '#ffffff',
                borderRadius: '28px',
                border: '4px solid #10182f',
                boxShadow: '0 8px 0 #10182f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '22px',
                boxSizing: 'border-box',
                margin: 'auto'
              }}
            >
              <img
                src={currentItem.image}
                alt={currentItem.word}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          {/* Panel Kanan: Kepingan Puzzle Rawak (Atas) & Ruangan Cantuman di Bawah (Center Tepat) */}
          <div
            className="ar-content-panel puzzle-right-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              padding: '18px 20px',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Bar: List Button (left), Centered Title (middle), Stars Score (right) */}
            <div
              className="puzzle-right-top-bar"
              style={{
                height: '44px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                width: '100%',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <button
                  type="button"
                  className="puzzle-list-btn neo-btn cursor-pointer"
                  onClick={() => setShowListModal(true)}
                  title="Senarai Gambar Suku Kata"
                  aria-label="Senarai Gambar"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '2.5px solid #10182f',
                    backgroundColor: '#ffe24a',
                    boxShadow: '0 3px 0 #10182f',
                    color: '#10182f'
                  }}
                >
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>

              {/* Tajuk Kemahiran Center */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  className="neo-btn bg-yellow ar-skill-badge"
                  style={{
                    height: '44px',
                    minHeight: '44px',
                    borderRadius: '14px',
                    border: '2.5px solid #10182f',
                    boxShadow: '0 3px 0 #10182f',
                    backgroundColor: '#ffe24a',
                    fontSize: '1.02rem',
                    fontWeight: 900,
                    padding: '0 20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#10182f',
                    whiteSpace: 'nowrap',
                    lineHeight: 1
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingTop: '3px' }}>
                    SUKU KATA {currentCategory}
                  </span>
                </div>
              </div>

              {/* Bintang Skor */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div
                  className="ar-score-pill neo-box"
                  style={{
                    position: 'relative',
                    top: 'auto',
                    right: 'auto',
                    margin: 0,
                    height: '44px',
                    borderRadius: '22px',
                    border: '2.5px solid #10182f',
                    boxShadow: '0 3px 0 #10182f',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px'
                  }}
                  title="Bintang Anda"
                >
                  <i className="fa-solid fa-star text-2xl" style={{ color: '#ffc107' }}></i>
                  <span className="ar-score-text">{stars}</span>
                </div>
              </div>
            </div>

            {/* Ruangan Pilihan Kepingan Puzzle (Tray) di Bahagian Atas Panel Kanan (Center Tepat) */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '24px 16px',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                borderRadius: '24px',
                marginBottom: '20px',
                minHeight: `${pieceH + 40}px`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                {trayPieces.length > 0 ? (
                  trayPieces.map((piece) => renderJigsawPiece(piece, piece.originalIndex, false))
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      padding: '14px 26px',
                      backgroundColor: 'rgba(255, 255, 255, 0.96)',
                      borderRadius: '20px',
                      border: '3.5px solid #10182f',
                      boxShadow: '0 5px 0 #10182f',
                      color: '#10182f',
                      fontWeight: 900,
                      fontSize: '1.18rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}
                  >
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '11px',
                        backgroundColor: '#ffe24a',
                        border: '2.5px solid #10182f',
                        boxShadow: '0 2.5px 0 #10182f',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d97706',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}
                    >
                      <i className="fa-solid fa-trophy"></i>
                    </span>
                    <span>Tahniah! Suku kata telah lengkap dicantum!</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Ruangan Cantuman di Bahagian Bawah Kepingan Suku Kata (Center Tepat) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: `${pieceH + 30}px`,
                padding: '10px',
                boxSizing: 'border-box',
                margin: '0 auto'
              }}
            >
              {isCompleted ? (
                renderCompletedWordCard()
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                  {currentItem.syllables.map((_, idx) => renderTargetSlot(idx))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Touch Drag Preview Indicator */}
      {touchDraggingPiece !== null && touchPos && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 999999,
            left: `${touchPos.x - pieceW / 2}px`,
            top: `${touchPos.y - pieceH / 2}px`,
            opacity: 0.95,
            filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.45))'
          }}
        >
          {renderJigsawPiece(touchDraggingPiece, touchDraggingPiece.originalIndex, false, false)}
        </div>
      )}

      {/* Modal Senarai Gambar Suku Kata (fa-list) */}
      {showListModal && (
        <div
          className="modal-overlay"
          style={{ display: 'flex', zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowListModal(false)}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="modal-content neo-box"
            style={{
              maxWidth: '560px',
              width: '92%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 18px 20px',
              position: 'relative',
              backgroundColor: '#ffffff',
              backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.11) 2px, transparent 2px)',
              backgroundSize: '16px 16px',
              borderRadius: '24px',
              border: '4px solid #10182f',
              boxShadow: '0 8px 0 #10182f'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="neo-btn bg-red close-btn cursor-pointer"
              onClick={() => setShowListModal(false)}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '18px' }}>
              <div
                className="neo-btn bg-yellow"
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#10182f',
                  backgroundColor: '#ffe24a',
                  padding: '8px 24px',
                  borderRadius: '16px',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: 0,
                  lineHeight: 1
                }}
              >
                <i className="fa-solid fa-images" style={{ color: '#10182f' }}></i>
                <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1, paddingTop: '2px' }}>
                  Senarai Gambar ({currentCategory})
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '12px',
                overflowY: 'auto',
                padding: '8px 4px 12px',
                flex: 1,
                maxHeight: '65vh'
              }}
            >
              {wordList.map((item, idx) => {
                const isSelected = idx === wordIndex;
                const isDone = !!completedWords[item.word];

                return (
                  <button
                    key={item.word + idx}
                    type="button"
                    className={`puzzle-list-card-item neo-btn cursor-pointer ${isSelected ? 'selected-card' : ''}`}
                    style={{
                      backgroundColor: isDone ? '#10b981' : isSelected ? '#fef9c3' : '#ffffff',
                      borderColor: isDone ? '#047857' : isSelected ? '#facc15' : '#10182f',
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderRadius: '18px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      boxShadow: isDone ? '0 4px 0 #047857' : isSelected ? '0 4px 0 #ca8a04' : '0 4px 0 #10182f',
                      cursor: 'pointer',
                      outline: 'none',
                      userSelect: 'none'
                    }}
                    onClick={() => {
                      if (typeof (window as any).playBubble === 'function') {
                        (window as any).playBubble();
                      }
                      setWordIndex(idx);
                      setShowListModal(false);
                    }}
                    title={item.word.toUpperCase()}
                  >
                    <img
                      src={item.image}
                      alt={item.word}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    />
                    {isDone && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          backgroundColor: '#ffe24a',
                          color: '#10182f',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          border: '2px solid #10182f',
                          boxShadow: '0 2px 0 #10182f',
                          pointerEvents: 'none'
                        }}
                      >
                        <i className="fa-solid fa-star"></i>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Panduan Cantum Kata */}
      {showGuideModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            padding: '16px',
            fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif'
          }}
          onClick={() => setShowGuideModal(false)}
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px 24px',
              textAlign: 'center',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '4px solid #f97316',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.6rem',
                color: '#ffffff',
                backgroundColor: '#ea580c',
                padding: '6px 28px',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '0 0 15px 0',
                fontWeight: 'bold',
                border: '3px solid #c2410c'
              }}
            >
              Cantum Kata
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#1e293b',
                margin: '0 0 20px 0',
                lineHeight: 1.6,
                fontWeight: 'bold'
              }}
            >
              Tarik kepingan puzzle suku kata ke dalam slot cantuman untuk membentuk perkataan lengkap mengikut gambar panduan!
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px',
                padding: '14px 10px',
                backgroundColor: 'rgba(248, 250, 252, 0.9)',
                borderRadius: '16px',
                border: '2px solid #cbd5e1'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-image" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1e293b' }}>
                  Lihat Gambar
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-hand-pointer" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1e293b' }}>
                  Tarik Kepingan
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-star" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1e293b' }}>
                  Kumpul Bintang
                </div>
              </div>
            </div>

            <button
              type="button"
              className="neo-btn cursor-pointer"
              style={{
                backgroundColor: '#168f81',
                color: '#ffffff',
                fontSize: '1.1rem',
                padding: '12px 32px',
                width: '100%',
                fontWeight: 'bold',
                justifyContent: 'center',
                textTransform: 'none',
                borderRadius: '16px'
              }}
              onClick={() => {
                if (typeof (window as any).playBubble === 'function') {
                  (window as any).playBubble();
                }
                setShowGuideModal(false);
              }}
            >
              Mula Belajar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
