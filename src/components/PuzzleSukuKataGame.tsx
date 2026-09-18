import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playCorrectPeneguhan, playWrongPeneguhan, playPopupBerjaya, playPopupGagal, resetPeneguhanTurn } from '../utils/peneguhanAudio';

export interface PuzzleWordItem {
  word: string;
  syllables: string[];
  image: string;
}

const PUZZLE_DATABASE: Record<string, PuzzleWordItem[]> = {
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
  'KVK': [
    { word: 'bas', syllables: ['bas'], image: '/images/sukukata/bas.png' },
    { word: 'beg', syllables: ['beg'], image: '/images/sukukata/beg.png' },
    { word: 'bot', syllables: ['bot'], image: '/images/sukukata/bot.png' },
    { word: 'cat', syllables: ['cat'], image: '/images/sukukata/cat.png' },
    { word: 'jag', syllables: ['jag'], image: '/images/sukukata/jag.png' },
    { word: 'jam', syllables: ['jam'], image: '/images/sukukata/jam.png' },
    { word: 'jem', syllables: ['jem'], image: '/images/sukukata/jem.png' },
    { word: 'jet', syllables: ['jet'], image: '/images/sukukata/jet.png' },
    { word: 'kek', syllables: ['kek'], image: '/images/sukukata/kek.png' },
    { word: 'kot', syllables: ['kot'], image: '/images/sukukata/kot.png' },
    { word: 'pam', syllables: ['pam'], image: '/images/sukukata/pam.png' },
    { word: 'pen', syllables: ['pen'], image: '/images/sukukata/pen.png' },
    { word: 'pil', syllables: ['pil'], image: '/images/sukukata/pil.png' },
    { word: 'pin', syllables: ['pin'], image: '/images/sukukata/pin.png' },
    { word: 'rak', syllables: ['rak'], image: '/images/sukukata/rak.png' },
    { word: 'rim', syllables: ['rim'], image: '/images/sukukata/rim.png' },
    { word: 'ros', syllables: ['ros'], image: '/images/sukukata/ros.png' },
    { word: 'sup', syllables: ['sup'], image: '/images/sukukata/sup.png' },
    { word: 'tin', syllables: ['tin'], image: '/images/sukukata/tin.png' },
    { word: 'van', syllables: ['van'], image: '/images/sukukata/van.png' }
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
  'KVKK': [
    { word: 'bank', syllables: ['bank'], image: '/images/sukukata/bank.png' },
    { word: 'gong', syllables: ['gong'], image: '/images/sukukata/gong.png' },
    { word: 'jong', syllables: ['jong'], image: '/images/sukukata/jong.png' },
    { word: 'tong', syllables: ['tong'], image: '/images/sukukata/tong.png' },
    { word: 'wang', syllables: ['wang'], image: '/images/sukukata/wang.png' },
    { word: 'zink', syllables: ['zink'], image: '/images/sukukata/zink.png' }
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
  if (clean === 'kv' || clean === 'kvkv' || clean === 'kv_kv') return 'KV + KV';
  if (clean === 'v_kv') return 'V + KV';
  if (clean === 'kvkvkv' || clean === 'kv_kv_kv') return 'KV + KV + KV';
  if (clean === 'kvk') return 'KVK';
  if (clean === 'v_kvk') return 'V + KVK';
  if (clean === 'kv_kvk') return 'KV + KVK';
  if (clean === 'kvk_kv') return 'KVK + KV';
  if (clean === 'kvk_kvk') return 'KVK + KVK';
  if (clean === 'kvkk') return 'KVKK';
  if (clean === 'kv_kv_kvk') return 'KV + KV + KVK';
  if (clean === 'kvk_kv_kvk') return 'KVK + KV + KVK';
  return 'KV + KV';
}

export const PuzzleSukuKataGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('KV + KV');
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [boardSlots, setBoardSlots] = useState<(number | null)[]>(Array(9).fill(null));
  const [trayPieces, setTrayPieces] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(true);
  const [showListModal, setShowListModal] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);
  const [completedWords, setCompletedWords] = useState<Record<string, boolean>>({});
  const [floatingStarActive, setFloatingStarActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  // Touch dragging state
  const [touchDraggingPiece, setTouchDraggingPiece] = useState<number | null>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  // Drag demo state (demonstrates pulling motion directly into board without solving)
  const [demoPieceId, setDemoPieceId] = useState<number | null>(null);
  const [demoPos, setDemoPos] = useState<{ x: number; y: number } | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const demoTimerRef = useRef<any>(null);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load category on event or global
  useEffect(() => {
    const handleOpen = (e: any) => {
      const catKey = e?.detail?.kemahiran || (window as any).currentPuzzleKemahiran || 'kv_kv';
      const cat = mapKeyToCategory(catKey);
      setCurrentCategory(cat);
      const list = PUZZLE_DATABASE[cat] || PUZZLE_DATABASE['KV + KV'];
      const randIdx = Math.floor(Math.random() * list.length);
      setWordIndex(randIdx);
      setShowGuideModal(true);
    };

    window.addEventListener('buka-puzzle-kemahiran', handleOpen);
    
    if ((window as any).currentPuzzleKemahiran) {
      const cat = mapKeyToCategory((window as any).currentPuzzleKemahiran);
      setCurrentCategory(cat);
      const list = PUZZLE_DATABASE[cat] || PUZZLE_DATABASE['KV + KV'];
      const randIdx = Math.floor(Math.random() * list.length);
      setWordIndex(randIdx);
    } else {
      const list = PUZZLE_DATABASE['KV + KV'];
      const randIdx = Math.floor(Math.random() * list.length);
      setWordIndex(randIdx);
    }

    try {
      localStorage.removeItem('puzzle_sukukata_stars');
    } catch (e) {
      console.warn('[PuzzleSukuKata] Gagal buang kunci bintang lama (puzzle_sukukata_stars):', e);
    }

    return () => {
      window.removeEventListener('buka-puzzle-kemahiran', handleOpen);
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, []);

  // Load completed words and stars for the current category
  useEffect(() => {
    try {
      const studentName = (window as any).currentUser || 'guest';
      const storageKey = `puzzle_completed_${studentName}_${currentCategory.replace(/\s+/g, '_')}`;
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

  const wordList = PUZZLE_DATABASE[currentCategory] || PUZZLE_DATABASE['KV + KV'];
  const currentItem: PuzzleWordItem = wordList[wordIndex] || wordList[0];

  // Reset board on word or category change
  useEffect(() => {
    resetBoard();
  }, [currentCategory, wordIndex]);

  const resetBoard = () => {
    setBoardSlots(Array(9).fill(null));
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTrayPieces(arr);
    setSelectedPiece(null);
    setIsCompleted(false);
    setHoveredSlot(null);
    setWrongSlot(null);
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsDemoRunning(false);
    setDemoPieceId(null);
    setDemoPos(null);
  };

  const cancelDemo = () => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsDemoRunning(false);
    setDemoPieceId(null);
    setDemoPos(null);
  };

  // Pronounce word
  const handlePronounce = () => {
    if (typeof (window as any).sebutAudio === 'function') {
      (window as any).sebutAudio(currentItem.word);
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(currentItem.word);
      u.lang = 'ms-MY';
      window.speechSynthesis.speak(u);
    }
  };

  // Check victory & auto-advance
  const checkVictory = (newSlots: (number | null)[]) => {
    const complete = newSlots.every((val, idx) => val === idx);
    if (complete && !isCompleted) {
      setIsCompleted(true);
      
      setCompletedWords((prev) => {
        const updated = { ...prev, [currentItem.word]: true };
        try {
          const studentName = (window as any).currentUser || 'guest';
          const storageKey = `puzzle_completed_${studentName}_${currentCategory.replace(/\s+/g, '_')}`;
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('[PuzzleSukuKata] Gagal simpan kemajuan perkataan selesai:', e);
        }
        const count = Object.values(updated).filter(Boolean).length;
        setStars(count);
        return updated;
      });

      // Audio kesan confetti dibuang — kekalkan effect confetti visual & peneguhan sahaja.
      playCorrectPeneguhan();
      if (typeof (window as any).playTada === 'function') {
        (window as any).playTada();
      }
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#fb923c', '#fbbf24', '#a78bfa'],
        zIndex: 99999
      });

      setFloatingStarActive(true);
      setTimeout(() => setFloatingStarActive(false), 2000);

      setTimeout(() => {
        handlePronounce();
      }, 400);

      // Auto-update student profile stars immediately
      if (typeof (window as any).tambahBintangGlobal === 'function') {
        (window as any).tambahBintangGlobal('puzzle_' + currentCategory, 1);
      }

      // Automatik pergi ke soalan gambar puzzle rawak seterusnya selepas 1.8 saat
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
        resetBoard();
      }, 1800);
    }
  };

  // Place piece logic
  const handlePlacePiece = (pieceId: number, targetSlot: number) => {
    cancelDemo();
    if (pieceId === targetSlot) {
      const newSlots = [...boardSlots];
      newSlots[targetSlot] = pieceId;
      setBoardSlots(newSlots);

      setTrayPieces((prev) => prev.filter((id) => id !== pieceId));
      setSelectedPiece(null);

      if (typeof (window as any).playBubble === 'function') {
        (window as any).playBubble();
      }

      checkVictory(newSlots);
    } else {
      setWrongSlot(targetSlot);
      setTimeout(() => setWrongSlot(null), 600);
      playWrongPeneguhan();
      if (typeof (window as any).playOops === 'function') {
        (window as any).playOops();
      }
    }
  };

  // HTML5 Drag handlers
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    cancelDemo();
    e.dataTransfer.setData('text/plain', pieceId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setSelectedPiece(pieceId);
  };

  const handleDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoveredSlot !== slotIdx) {
      setHoveredSlot(slotIdx);
    }
  };

  const handleDragLeave = () => {
    setHoveredSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setHoveredSlot(null);
    const pieceIdStr = e.dataTransfer.getData('text/plain');
    if (!pieceIdStr && selectedPiece === null) return;
    const pieceId = pieceIdStr ? parseInt(pieceIdStr, 10) : selectedPiece!;
    handlePlacePiece(pieceId, slotIdx);
  };

  // Touch Handlers for Mobile & Tablets
  const handleTouchStart = (e: React.TouchEvent, pieceId: number) => {
    cancelDemo();
    const touch = e.touches[0];
    setTouchDraggingPiece(pieceId);
    setSelectedPiece(pieceId);
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDraggingPiece === null) return;
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });

    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotElem = elem?.closest('[data-slot-index]');
    if (slotElem) {
      const idx = parseInt(slotElem.getAttribute('data-slot-index') || '-1', 10);
      setHoveredSlot(idx >= 0 ? idx : null);
    } else {
      setHoveredSlot(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchDraggingPiece === null) return;
    const touch = e.changedTouches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotElem = elem?.closest('[data-slot-index]');
    if (slotElem) {
      const idx = parseInt(slotElem.getAttribute('data-slot-index') || '-1', 10);
      if (idx >= 0 && boardSlots[idx] === null) {
        handlePlacePiece(touchDraggingPiece, idx);
      }
    }
    setTouchDraggingPiece(null);
    setTouchPos(null);
    setHoveredSlot(null);
  };

  // Click slot with selected piece
  const handleSlotClick = (slotIdx: number) => {
    cancelDemo();
    if (boardSlots[slotIdx] !== null) return;
    if (selectedPiece !== null) {
      handlePlacePiece(selectedPiece, slotIdx);
    }
  };

  // Calculate CSS background position for 3x3
  const getPieceBgStyle = (id: number) => {
    const row = Math.floor(id / 3);
    const col = id % 3;
    const posX = col === 0 ? 0 : col === 1 ? 50 : 100;
    const posY = row === 0 ? 0 : row === 1 ? 50 : 100;

    return {
      backgroundImage: `url("${currentItem.image}")`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundRepeat: 'no-repeat'
    };
  };

  // Render 3x3 Puzzle Board Canvas & Slots
  const renderPuzzleBoard = (isMobileView: boolean = false) => (
    <div
      className={`puzzle-board-canvas-box neo-box ${isMobileView ? 'mobile-canvas' : ''}`}
      style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '3.5px solid #10182f',
        borderRadius: isMobileView ? '22px' : '26px',
        boxShadow: '0 6px 0 #10182f',
        padding: isMobileView ? '8px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: isMobileView ? 'min(94vw, 340px)' : 'min(92%, 405px)',
        height: isMobileView ? 'min(94vw, 340px)' : 'min(92%, 405px)',
        aspectRatio: '1 / 1'
      }}
    >
      {/* Background Hint / Watermark */}
      {showHint && !isCompleted && (
        <div
          className="puzzle-board-watermark"
          style={{
            position: 'absolute',
            inset: isMobileView ? '8px' : '12px',
            backgroundImage: `url("${currentItem.image}")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.25,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: '16px'
          }}
        />
      )}

      {/* 3x3 Grid Slots */}
      <div
        className={`puzzle-board-grid ${isCompleted ? 'completed-glow' : ''}`}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: isMobileView ? '6px' : '8px',
          backgroundColor: 'transparent',
          padding: 0,
          boxSizing: 'border-box'
        }}
      >
        {Array.from({ length: 9 }).map((_, slotIdx) => {
          const placedPieceId = boardSlots[slotIdx];
          const isHovered = hoveredSlot === slotIdx;
          const isWrong = wrongSlot === slotIdx;

          return (
            <div
              key={slotIdx}
              data-slot-index={slotIdx}
              className={`puzzle-slot ${isHovered ? 'slot-hovered' : ''} ${isWrong ? 'slot-wrong' : ''} ${
                placedPieceId !== null ? 'slot-filled' : 'slot-empty'
              }`}
              onDragOver={(e) => handleDragOver(e, slotIdx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slotIdx)}
              onClick={() => handleSlotClick(slotIdx)}
            >
              {placedPieceId !== null ? (
                <div
                  className="puzzle-piece-in-slot"
                  style={getPieceBgStyle(placedPieceId)}
                />
              ) : (
                <span className="puzzle-slot-number">{slotIdx + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render Perkataan Suku Kata (Flashcard Style: Font Lebih Besar & Background Lebih Tinggi)
  const renderWordDisplay = () => (
    <div
      className="puzzle-word-display-box neo-box hover:scale-101 transition-transform"
      style={{
        backgroundColor: '#ffffff',
        border: '3.5px solid #10182f',
        borderRadius: '22px',
        boxShadow: '0 4px 0 #10182f',
        padding: isMobile ? '8px 14px' : '18px 32px',
        minHeight: isMobile ? '68px' : '112px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Perkataan Suku Kata Tepat Di Tengah */}
      <div
        onClick={handlePronounce}
        className="cursor-pointer"
        title="Klik untuk sebut perkataan"
        style={{
          fontSize: isMobile ? 'clamp(2.6rem, 7.5vw, 3.4rem)' : 'clamp(4.2rem, 8vw, 5.2rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '1px',
          userSelect: 'none'
        }}
      >
        {currentItem.syllables.map((syl, sIdx) => {
          const isBlack = sIdx % 2 === 0;
          return (
            <span
              key={sIdx}
              style={{
                color: isBlack ? '#000000' : '#e11d48',
                display: 'inline-block'
              }}
            >
              {syl.toLowerCase()}
            </span>
          );
        })}
      </div>

      {/* Butang Tutup/Papar Bayang (Hanya Icon Sahaja) Di Sebelah Kanan Hujung Dalam Ruangan Putih (Mobile View Sahaja) */}
      {isMobile && (
        <button
          type="button"
          className="puzzle-hint-toggle neo-btn cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof (window as any).playBubble === 'function') {
              (window as any).playBubble();
            }
            setShowHint(!showHint);
          }}
          title={showHint ? 'Tutup Bayang' : 'Papar Bayang'}
          aria-label={showHint ? 'Tutup Bayang' : 'Papar Bayang'}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '38px',
            height: '38px',
            minWidth: '38px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '2.5px solid #10182f',
            boxShadow: '0 2.5px 0 #10182f',
            color: '#10182f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.05rem',
            padding: 0,
            cursor: 'pointer',
            flexShrink: 0,
            zIndex: 5
          }}
        >
          <i className={`fa-solid ${showHint ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      )}
    </div>
  );

  // Render Tray Kepingan Puzzle untuk Desktop (Besar & 2 Baris: 5 kepingan atas, 4 kepingan bawah)
  const renderDesktopPiecesTray = () => (
    <div className="puzzle-tray-container" style={{ width: '100%', padding: '14px', boxSizing: 'border-box' }}>
      {trayPieces.length <= 5 ? (
        <div className="puzzle-pieces-tray" style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: '100%' }}>
          {trayPieces.map((pieceId) => {
            const isSelected = selectedPiece === pieceId;
            return (
              <div
                key={pieceId}
                data-tray-piece-id={pieceId}
                draggable
                className={`puzzle-piece-item ${isSelected ? 'selected-piece' : ''}`}
                style={getPieceBgStyle(pieceId)}
                onDragStart={(e) => handleDragStart(e, pieceId)}
                onTouchStart={(e) => handleTouchStart(e, pieceId)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setSelectedPiece(selectedPiece === pieceId ? null : pieceId)}
                title="Seret kepingan ini ke papan"
              />
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
          {/* Baris 1: 5 kepingan */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: '100%' }}>
            {trayPieces.slice(0, 5).map((pieceId) => {
              const isSelected = selectedPiece === pieceId;
              return (
                <div
                  key={pieceId}
                  data-tray-piece-id={pieceId}
                  draggable
                  className={`puzzle-piece-item ${isSelected ? 'selected-piece' : ''}`}
                  style={getPieceBgStyle(pieceId)}
                  onDragStart={(e) => handleDragStart(e, pieceId)}
                  onTouchStart={(e) => handleTouchStart(e, pieceId)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setSelectedPiece(selectedPiece === pieceId ? null : pieceId)}
                  title="Seret kepingan ini ke papan"
                />
              );
            })}
          </div>
          {/* Baris 2: 4 kepingan centered */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: '100%' }}>
            {trayPieces.slice(5).map((pieceId) => {
              const isSelected = selectedPiece === pieceId;
              return (
                <div
                  key={pieceId}
                  data-tray-piece-id={pieceId}
                  draggable
                  className={`puzzle-piece-item ${isSelected ? 'selected-piece' : ''}`}
                  style={getPieceBgStyle(pieceId)}
                  onDragStart={(e) => handleDragStart(e, pieceId)}
                  onTouchStart={(e) => handleTouchStart(e, pieceId)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setSelectedPiece(selectedPiece === pieceId ? null : pieceId)}
                  title="Seret kepingan ini ke papan"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Render single mobile piece
  const renderSingleMobilePiece = (pieceId: number) => {
    const isSelected = selectedPiece === pieceId;
    return (
      <div
        key={pieceId}
        data-tray-piece-id={pieceId}
        draggable
        className={`puzzle-piece-item mobile-piece ${isSelected ? 'selected-piece' : ''}`}
        style={getPieceBgStyle(pieceId)}
        onDragStart={(e) => handleDragStart(e, pieceId)}
        onTouchStart={(e) => handleTouchStart(e, pieceId)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setSelectedPiece(selectedPiece === pieceId ? null : pieceId)}
        title="Seret kepingan ini ke papan"
      />
    );
  };

  // Render Tray Kepingan Puzzle untuk Mobile (Baris 1: 5 kepingan, Baris 2: 4 kepingan CENTER)
  const renderMobilePiecesTray = () => (
    <div className="puzzle-tray-container" style={{ width: '100%', padding: '8px 4px', boxSizing: 'border-box' }}>
      {trayPieces.length <= 5 ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', width: '100%', flexWrap: 'wrap' }}>
          {trayPieces.map((pieceId) => renderSingleMobilePiece(pieceId))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', width: '100%' }}>
          {/* Baris 1: 5 kepingan */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', width: '100%' }}>
            {trayPieces.slice(0, 5).map((pieceId) => renderSingleMobilePiece(pieceId))}
          </div>
          {/* Baris 2: 4 kepingan tepat di tengah (CENTER) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', width: '100%' }}>
            {trayPieces.slice(5).map((pieceId) => renderSingleMobilePiece(pieceId))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div id="puzzle-sukukata-container" className="puzzle-container-root" onTouchStart={cancelDemo} onMouseDown={cancelDemo}>
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
          <span style={{ fontWeight: 800 }}>Puzzle Suku Kata</span>
        </div>

        <button
          type="button"
          className="neo-btn bg-orange help-btn info-icon-btn cursor-pointer"
          onClick={() => setShowGuideModal(true)}
          title="Panduan Puzzle"
          aria-label="Panduan Puzzle"
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </div>

      {/* Floating Star Popup (+1 Bintang!) - Same as Tanduk Kata */}
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
              animate={{ y: 0, opacity: 1, scale: 1.18 }}
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

      {/* MAIN CONTENT: Mobile 1-Card View vs Desktop 2-Panel View */}
      {isMobile ? (
        /* MOBILE VIEW: 1 Single Unified Background Card */
        <div style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}>
          <div className="puzzle-mobile-unified-card neo-box">
            {/* Top Bar: List Button (left), Centered Title (middle), Reset Button (right) */}
            <div className="puzzle-mobile-top-bar">
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
                  color: '#10182f',
                  flexShrink: 0
                }}
              >
                <i className="fa-solid fa-list"></i>
              </button>

              {/* Tajuk Center Tepat */}
              <div
                className="neo-btn bg-yellow ar-skill-badge"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  height: '38px',
                  minHeight: '38px',
                  padding: '0 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backgroundColor: '#ffe24a',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, paddingTop: '2px' }}>
                  SUKU KATA {currentCategory}
                </span>
              </div>

              {/* Butang Reset di Kanan (menggantikan butang hide) */}
              <button
                type="button"
                className="neo-btn cursor-pointer"
                onClick={resetBoard}
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
                  color: '#10182f',
                  flexShrink: 0
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>

            {/* 1. Kepingan puzzle DI ATAS papan puzzle (Baris 1: 5 kepingan, Baris 2: 4 kepingan CENTER) */}
            {renderMobilePiecesTray()}

            {/* 2. Papan puzzle 3x3 DI TENGAH (Background putih lebih lebar) */}
            {renderPuzzleBoard(true)}

            {/* 3. Perkataan suku kata DI BAWAH papan puzzle */}
            {renderWordDisplay()}
          </div>
        </div>
      ) : (
        /* DESKTOP / LAPTOP VIEW: 2 Side-by-Side Panels */
        <div className="ar-main-container puzzle-layout-grid">
          {/* Panel Kiri: Latar Belakang Hijau dengan Tengah Papan Puzzle Putih */}
          <div
            className="puzzle-board-card neo-box"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              height: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Butang Reset (Atas) & Butang Tutup Bayang (Bawah) di Sudut Kanan Atas */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 20
              }}
            >
              {/* 1. Butang Reset di Atas */}
              <button
                type="button"
                className="neo-btn cursor-pointer"
                onClick={resetBoard}
                title="Ulang Semula Kepingan"
                aria-label="Ulang Semula"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  border: '2.5px solid #10182f',
                  backgroundColor: '#ffe24a',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f'
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>

              {/* 2. Butang Tutup/Papar Bayang di Bawah Butang Reset */}
              <button
                type="button"
                className="puzzle-hint-toggle neo-btn cursor-pointer"
                onClick={() => {
                  if (typeof (window as any).playBubble === 'function') {
                    (window as any).playBubble();
                  }
                  setShowHint(!showHint);
                }}
                title={showHint ? 'Tutup Bayang' : 'Papar Bayang'}
                aria-label={showHint ? 'Tutup Bayang' : 'Papar Bayang'}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  color: '#10182f',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem'
                }}
              >
                <i className={`fa-solid ${showHint ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            {/* Papan Puzzle 3x3 Betul-betul Middle / Center Pada Background Hijau */}
            <div
              className="puzzle-board-stage"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto'
              }}
            >
              {renderPuzzleBoard(false)}
            </div>
          </div>

          {/* Panel Kanan: Kepingan Puzzle (Besar), Perkataan (Font Besar) & Butang Senarai */}
          <div className="ar-content-panel puzzle-right-panel">
            {/* Top Bar: List Button (left), Perfectly Centered Title (middle), Stars Score (right) (Sebaris & Ketinggian Sama Tepat 44px) */}
            <div
              className="puzzle-right-top-bar"
              style={{
                height: '44px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                width: '100%',
                marginBottom: '12px'
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

              {/* Tajuk Center Tepat pada Background Hijau */}
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
                    lineHeight: 1,
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, paddingTop: '3px' }}>
                    SUKU KATA {currentCategory}
                  </span>
                </div>
              </div>

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

            {/* Tray Kepingan Puzzle (Kepingan Besar untuk Laptop View) */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {renderDesktopPiecesTray()}
            </div>

            {/* Perkataan Suku Kata Gaya Flashcard (Font Besar Sambung Hitam & Merah) */}
            {renderWordDisplay()}
          </div>
        </div>
      )}

      {/* Floating Touch Drag Preview Indicator */}
      {touchDraggingPiece !== null && touchPos && (
        <div
          className="puzzle-touch-preview neo-box"
          style={{
            ...getPieceBgStyle(touchDraggingPiece),
            left: `${touchPos.x - 36}px`,
            top: `${touchPos.y - 36}px`
          }}
        />
      )}

      {/* Animated Drag Demo Pointer (Tunjuk Tarik Betul-betul Masuk ke Dalam Papan) */}
      {isDemoRunning && demoPieceId !== null && demoPos && (
        <div
          className="puzzle-demo-pointer"
          style={{
            left: `${demoPos.x}px`,
            top: `${demoPos.y}px`
          }}
        >
          <div
            className="puzzle-demo-floating-box neo-box"
            style={getPieceBgStyle(demoPieceId)}
          />
          <i className="fa-solid fa-hand-pointer puzzle-demo-hand-icon"></i>
        </div>
      )}

      {/* Modal Senarai Gambar Suku Kata (Hanya Gambar Sahaja Tanpa Perkataan) */}
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
                  textTransform: 'none',
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
                      resetBoard();
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

      {/* Popup Maklumat Permainan (Reka Bentuk Sama Seperti AR & Tanduk Kata) */}
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
          onClick={() => {
            setShowGuideModal(false);
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px 24px',
              textAlign: 'center',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '4px solid #f97316',
              fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
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
                fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
                border: '3px solid #c2410c'
              }}
            >
              Puzzle Suku Kata
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#1e293b',
                margin: '0 0 20px 0',
                lineHeight: 1.6,
                fontWeight: 'bold',
                fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif'
              }}
            >
              Cantumkan 9 kepingan puzzle untuk melengkapkan gambar suku kata dan kumpul bintang ganjaran!
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
                  <i className="fa-solid fa-puzzle-piece" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif'
                  }}
                >
                  Seret Kepingan
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-table-cells" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif'
                  }}
                >
                  Papan 3x3
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-star" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif'
                  }}
                >
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
                fontFamily: '"AtlantaRounded", "Century Gothic", "Apple Gothic", sans-serif',
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
