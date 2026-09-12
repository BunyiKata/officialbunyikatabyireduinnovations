import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Activity1HearSound,
  Activity2MatchPartners,
  Activity3BubblePop,
  Activity4FindSound,
  Activity5MatchSound,
  Activity6PicturePuzzle
} from './PhonicsActivities';

export type PhonicsMode = 'kenali_huruf' | 'vokal_konsonan' | 'fonik_abc';

export interface FonikAbcGameProps {
  onClose: () => void;
  initialMode?: PhonicsMode;
}

export const VOWELS_SET = new Set(['a', 'e', 'i', 'o', 'u']);
export const isVowelLetter = (letter: string) => VOWELS_SET.has(letter.toLowerCase());

export const getCleanDisplayLetter = (letter: string, isUpper: boolean = false): string => {
  const l = (letter || '').trim();
  if (l === 'é' || l === 'e taling' || l === 'e tailing' || l === 'e-taling') {
    return isUpper ? 'E' : 'e';
  }
  if (l === 'É') {
    return 'E';
  }
  return isUpper ? l.toUpperCase() : l;
};

export interface ModeConfig {
  mode: PhonicsMode;
  title: string;
  topBadge: string;
  topBadgeColor: string;
  subtitle: string;
  bannerGradient: string;
  bannerProgressColor: string;
  progressKey: string;
  guideTitle: string;
}

export const MODE_CONFIGS: Record<PhonicsMode, ModeConfig> = {
  kenali_huruf: {
    mode: 'kenali_huruf',
    title: 'Kenali Huruf ABC',
    topBadge: 'KENALI HURUF ABC',
    topBadgeColor: '#ea580c',
    subtitle: 'Kenali bentuk huruf kecil & huruf besar, sambungkan pasangan, pecahkan buih, dan buka gambar rahsia!',
    bannerGradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
    bannerProgressColor: '#fdba74',
    progressKey: 'bunyikata_huruf_progress_v2',
    guideTitle: 'Panduan Kenali Huruf ABC'
  },
  vokal_konsonan: {
    mode: 'vokal_konsonan',
    title: 'Kenali Huruf Vokal & Konsonan',
    topBadge: 'VOKAL & KONSONAN',
    topBadgeColor: '#0f766e',
    subtitle: 'Kenali perbezaan huruf Vokal (a, e, i, o, u) dan huruf Konsonan dengan aktiviti interaktif!',
    bannerGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0e7490 100%)',
    bannerProgressColor: '#2dd4bf',
    progressKey: 'bunyikata_vokal_progress_v2',
    guideTitle: 'Panduan Vokal & Konsonan'
  },
  fonik_abc: {
    mode: 'fonik_abc',
    title: 'Kenali Huruf Fonik ABC',
    topBadge: 'FONIK ABC',
    topBadgeColor: '#7c3aed',
    subtitle: 'Dengar bunyi fonik setiap huruf, sambungkan pasangan, pecahkan buih, dan buka gambar rahsia!',
    bannerGradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6366f1 100%)',
    bannerProgressColor: '#34d399',
    progressKey: 'bunyikata_phonics_progress_v2',
    guideTitle: 'Panduan Fonik ABC'
  }
};

export interface PhonicsItem {
  letter: string;
  uppercase: string;
  soundAudio: string;
  word: string;
  syllables: string[];
  image: string;
  wordAudio: string;
  sampleWords: string[];
  color: string;
  bgColor: string;
}

export const getPhonicsAudio = (letter: string): string => {
  const l = (letter || '').toLowerCase().trim();
  if (l === 'é' || l === 'e taling' || l === 'e tailing') {
    return '/audio/fonik/fonik e tailing.mp3';
  }
  if (l === 'e' || l === 'e pepet') {
    return '/audio/fonik/fonik e.mp3';
  }
  // Huruf W juga mempunyai audio fonik tersendiri (fonik w.mp3).
  return `/audio/fonik/fonik ${l}.mp3`;
};

export const PHONICS_DATABASE: PhonicsItem[] = [
  {
    letter: 'a',
    uppercase: 'A',
    soundAudio: '/audio/abc/a.mp3',
    word: 'ayam',
    syllables: ['a', 'yam'],
    image: '/images/sukukata/ayam.png',
    wordAudio: '/audio/sukukata/ayam.mp3',
    sampleWords: ['ayam', 'api', 'alu'],
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    letter: 'b',
    uppercase: 'B',
    soundAudio: '/audio/abc/b.mp3',
    word: 'beca',
    syllables: ['be', 'ca'],
    image: '/images/sukukata/beca.png',
    wordAudio: '/audio/sukukata/beca.mp3',
    sampleWords: ['beca', 'bas', 'bola'],
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    letter: 'c',
    uppercase: 'C',
    soundAudio: '/audio/abc/c.mp3',
    word: 'ciku',
    syllables: ['ci', 'ku'],
    image: '/images/sukukata/ciku.png',
    wordAudio: '/audio/sukukata/ciku.mp3',
    sampleWords: ['ciku', 'cawan', 'cerek'],
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    letter: 'd',
    uppercase: 'D',
    soundAudio: '/audio/abc/d.mp3',
    word: 'doktor',
    syllables: ['dok', 'tor'],
    image: '/images/sukukata/doktor.png',
    wordAudio: '/audio/sukukata/doktor.mp3',
    sampleWords: ['doktor', 'dadu', 'daun'],
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    letter: 'e',
    uppercase: 'E',
    soundAudio: '/audio/abc/e.mp3',
    word: 'enam',
    syllables: ['e', 'nam'],
    image: '/images/sukukata/enam.png',
    wordAudio: '/audio/sukukata/enam.mp3',
    sampleWords: ['enam', 'emak', 'emas'],
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    letter: 'é',
    uppercase: 'É',
    soundAudio: '/audio/fonik/fonik e tailing.mp3',
    word: 'epal',
    syllables: ['e', 'pal'],
    image: '/images/sukukata/epal.png',
    wordAudio: '/audio/sukukata/epal.mp3',
    sampleWords: ['epal', 'ekor', 'elok'],
    color: '#059669',
    bgColor: '#d1fae5'
  },
  {
    letter: 'f',
    uppercase: 'F',
    soundAudio: '/audio/abc/f.mp3',
    word: 'feri',
    syllables: ['fe', 'ri'],
    image: '/images/gambar-feri-fonik/feri.png',
    wordAudio: '/audio/fonik/feri.mp3',
    sampleWords: ['feri', 'foto', 'filem'],
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    letter: 'g',
    uppercase: 'G',
    soundAudio: '/audio/abc/g.mp3',
    word: 'gitar',
    syllables: ['gi', 'tar'],
    image: '/images/sukukata/gitar.png',
    wordAudio: '/audio/sukukata/gitar.mp3',
    sampleWords: ['gitar', 'gajah', 'garpu'],
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    letter: 'h',
    uppercase: 'H',
    soundAudio: '/audio/abc/h.mp3',
    word: 'harimau',
    syllables: ['ha', 'ri', 'mau'],
    image: '/images/sukukata/harimau.png',
    wordAudio: '/audio/sukukata/harimau.mp3',
    sampleWords: ['harimau', 'helang', 'hujan'],
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    letter: 'i',
    uppercase: 'I',
    soundAudio: '/audio/abc/i.mp3',
    word: 'ikan',
    syllables: ['i', 'kan'],
    image: '/images/sukukata/ikan.png',
    wordAudio: '/audio/sukukata/ikan.mp3',
    sampleWords: ['ikan', 'itik', 'ibu'],
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    letter: 'j',
    uppercase: 'J',
    soundAudio: '/audio/abc/j.mp3',
    word: 'jari',
    syllables: ['ja', 'ri'],
    image: '/images/sukukata/jari.png',
    wordAudio: '/audio/sukukata/jari.mp3',
    sampleWords: ['jari', 'jam', 'jambu'],
    color: '#a855f7',
    bgColor: '#f3e8ff'
  },
  {
    letter: 'k',
    uppercase: 'K',
    soundAudio: '/audio/abc/k.mp3',
    word: 'kasut',
    syllables: ['ka', 'sut'],
    image: '/images/sukukata/kasut.png',
    wordAudio: '/audio/sukukata/kasut.mp3',
    sampleWords: ['kasut', 'katil', 'kuku'],
    color: '#eab308',
    bgColor: '#fef9c3'
  },
  {
    letter: 'l',
    uppercase: 'L',
    soundAudio: '/audio/abc/l.mp3',
    word: 'labu',
    syllables: ['la', 'bu'],
    image: '/images/sukukata/labu.png',
    wordAudio: '/audio/sukukata/labu.mp3',
    sampleWords: ['labu', 'lidi', 'lampu'],
    color: '#14b8a6',
    bgColor: '#ccfbf1'
  },
  {
    letter: 'm',
    uppercase: 'M',
    soundAudio: '/audio/abc/m.mp3',
    word: 'mata',
    syllables: ['ma', 'ta'],
    image: '/images/sukukata/mata.png',
    wordAudio: '/audio/sukukata/mata.mp3',
    sampleWords: ['mata', 'makan', 'masjid'],
    color: '#f43f5e',
    bgColor: '#ffe4e6'
  },
  {
    letter: 'n',
    uppercase: 'N',
    soundAudio: '/audio/abc/n.mp3',
    word: 'nasi',
    syllables: ['na', 'si'],
    image: '/images/sukukata/nasi.png',
    wordAudio: '/audio/sukukata/nasi.mp3',
    sampleWords: ['nasi', 'nanas', 'nyamuk'],
    color: '#84cc16',
    bgColor: '#ecfccb'
  },
  {
    letter: 'o',
    uppercase: 'O',
    soundAudio: '/audio/abc/o.mp3',
    word: 'oren',
    syllables: ['o', 'ren'],
    image: '/images/sukukata/oren.png',
    wordAudio: '/audio/sukukata/oren.mp3',
    sampleWords: ['oren', 'otak', 'obor'],
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    letter: 'p',
    uppercase: 'P',
    soundAudio: '/audio/abc/p.mp3',
    word: 'paku',
    syllables: ['pa', 'ku'],
    image: '/images/sukukata/paku.png',
    wordAudio: '/audio/sukukata/paku.mp3',
    sampleWords: ['paku', 'pintu', 'pelita'],
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    letter: 'q',
    uppercase: 'Q',
    soundAudio: '/audio/abc/q.mp3',
    word: 'qari',
    syllables: ['qa', 'ri'],
    image: '/images/sukukata/qari.png',
    wordAudio: '/audio/sukukata/qari.mp3',
    sampleWords: ['qari', 'quran', 'qasidah'],
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    letter: 'r',
    uppercase: 'R',
    soundAudio: '/audio/abc/r.mp3',
    word: 'rusa',
    syllables: ['ru', 'sa'],
    image: '/images/sukukata/rusa.png',
    wordAudio: '/audio/sukukata/rusa.mp3',
    sampleWords: ['rusa', 'raga', 'rambut'],
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    letter: 's',
    uppercase: 'S',
    soundAudio: '/audio/abc/s.mp3',
    word: 'sawi',
    syllables: ['sa', 'wi'],
    image: '/images/sukukata/sawi.png',
    wordAudio: '/audio/sukukata/sawi.mp3',
    sampleWords: ['sawi', 'sudu', 'sabun'],
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    letter: 't',
    uppercase: 'T',
    soundAudio: '/audio/abc/t.mp3',
    word: 'tali',
    syllables: ['ta', 'li'],
    image: '/images/sukukata/tali.png',
    wordAudio: '/audio/sukukata/tali.mp3',
    sampleWords: ['tali', 'tomato', 'tebu'],
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    letter: 'u',
    uppercase: 'U',
    soundAudio: '/audio/abc/u.mp3',
    word: 'ular',
    syllables: ['u', 'lar'],
    image: '/images/sukukata/ular.png',
    wordAudio: '/audio/sukukata/ular.mp3',
    sampleWords: ['ular', 'ubi', 'ulat'],
    color: '#6366f1',
    bgColor: '#e0e7ff'
  },
  {
    letter: 'v',
    uppercase: 'V',
    soundAudio: '/audio/abc/v.mp3',
    word: 'van',
    syllables: ['van'],
    image: '/images/sukukata/van.png',
    wordAudio: '/audio/sukukata/van.mp3',
    sampleWords: ['van', 'vaksin', 'vas'],
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    letter: 'w',
    uppercase: 'W',
    // Mod "Kenali Huruf" memainkan NAMA huruf, jadi kekalkan /audio/abc/w.mp3.
    // Mod "Fonik ABC" memainkan BUNYI fonik melalui getPhonicsAudio() di atas.
    soundAudio: '/audio/abc/w.mp3',
    word: 'wang',
    syllables: ['wang'],
    image: '/images/sukukata/wang.png',
    wordAudio: '/audio/sukukata/wang.mp3',
    sampleWords: ['wang', 'wanita', 'wau'],
    color: '#eab308',
    bgColor: '#fef9c3'
  },
  {
    letter: 'x',
    uppercase: 'X',
    soundAudio: '/audio/abc/x.mp3',
    word: 'xray',
    syllables: ['x', 'ray'],
    image: '/images/sukukata/xray.png',
    wordAudio: '/audio/sukukata/xray.mp3',
    sampleWords: ['xray', 'xilofon'],
    color: '#14b8a6',
    bgColor: '#ccfbf1'
  },
  {
    letter: 'y',
    uppercase: 'Y',
    soundAudio: '/audio/abc/y.mp3',
    word: 'yoyo',
    syllables: ['yo', 'yo'],
    image: '/images/sukukata/yoyo.png',
    wordAudio: '/audio/sukukata/yoyo.mp3',
    sampleWords: ['yoyo', 'yogurt', 'yis'],
    color: '#f43f5e',
    bgColor: '#ffe4e6'
  },
  {
    letter: 'z',
    uppercase: 'Z',
    soundAudio: '/audio/abc/z.mp3',
    word: 'zirafah',
    syllables: ['zi', 'ra', 'fah'],
    image: '/images/sukukata/zirafah.png',
    wordAudio: '/audio/sukukata/zirafah.mp3',
    sampleWords: ['zirafah', 'zink', 'zebra'],
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  }
];

type ProgressRecord = Record<string, boolean[]>;

const MAIN_APP_BG = "transparent";

let lastNavSoundTime = 0;
const playNavSound = () => {
  const now = Date.now();
  if (now - lastNavSoundTime < 350) return;
  lastNavSoundTime = now;
  if (typeof (window as any).playBubble === 'function') {
    (window as any).playBubble();
  } else {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Audio fallback silent
    }
  }
};

// Robust Top Navigation Bar with subtle, modern 2.5px shadows
function ActivityTopBar({
  actNum,
  onBack,
  isMobile,
  badgeText = 'FONIK ABC',
  badgeColor = '#ff7a00'
}: {
  actNum: number;
  onBack: () => void;
  isMobile: boolean;
  badgeText?: string;
  badgeColor?: string;
}) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '850px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '44px 1fr auto' : '48px 1fr auto',
      alignItems: 'center',
      marginBottom: '16px',
      gap: '8px',
      zIndex: 20,
      position: 'relative'
    }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          playNavSound();
          onBack();
        }}
        style={{
          width: isMobile ? '44px' : '46px',
          height: isMobile ? '44px' : '46px',
          borderRadius: '50%',
          padding: 0,
          touchAction: 'manipulation',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          background: badgeColor,
          border: '3px solid #1e293b',
          boxShadow: '0 2.5px 0 #1e293b',
          color: 'white',
          fontSize: isMobile ? '1.15rem' : '1.25rem',
          zIndex: 25
        }}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </motion.button>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div
          style={{
            background: badgeColor,
            border: '3px solid #1e293b',
            boxShadow: '0 2.5px 0 #1e293b',
            borderRadius: isMobile ? '18px' : '20px',
            color: 'white',
            fontSize: isMobile ? '1.15rem' : '1.35rem',
            fontWeight: 900,
            padding: isMobile ? '8px 22px' : '10px 32px',
            letterSpacing: '0.5px',
            userSelect: 'none',
            textAlign: 'center',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            whiteSpace: 'nowrap'
          }}
        >
          {badgeText}
        </div>
      </div>

      <div
        style={{
          background: badgeColor,
          border: '3px solid #1e293b',
          boxShadow: '0 2.5px 0 #1e293b',
          borderRadius: '18px',
          color: 'white',
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          fontWeight: 900,
          padding: isMobile ? '8px 14px' : '8px 20px',
          userSelect: 'none',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: isMobile ? '46px' : '54px'
        }}
      >
        A{actNum}
      </div>
    </div>
  );
}

// Light Pastel Blue Flashcard Container with softer shadow
const blueCardContainerStyle = (isMobile: boolean): React.CSSProperties => ({
  background: '#e0f2fe',
  backgroundImage: 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 2px, transparent 2px)',
  backgroundSize: '24px 24px',
  borderRadius: isMobile ? '28px' : '36px',
  border: '3.5px solid #1e293b',
  boxShadow: '0 3.5px 0 #1e293b',
  padding: isMobile ? '16px 12px' : '24px 20px',
  width: '100%',
  maxWidth: '850px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: isMobile ? '460px' : '520px'
});

// Floating Star Popup "Terbaik! 🌟" Animation (Matching +1 Bintang)
function GlobalTerbaikPopup({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
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
              fontSize: 'clamp(2.4rem, 7.5vw, 4.2rem)',
              fontFamily: 'AtlantaRoundedBlack, "Century Gothic", Poppins, sans-serif',
              fontWeight: 900,
              color: '#fbbf24',
              textShadow: '0 4px 14px rgba(0, 0, 0, 0.95), 0 0 24px rgba(251, 191, 36, 0.9)',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
          >
            +1 Bintang! 🌟
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function FonikAbcGame({ onClose, initialMode }: FonikAbcGameProps) {
  const [mode, setMode] = useState<PhonicsMode>(() => {
    return initialMode || (window as any).phonicsMode || 'kenali_huruf';
  });
  const [filterCategory, setFilterCategory] = useState<'vokal' | 'konsonan'>('vokal');
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number>(0);
  const [currentView, setCurrentView] = useState<'lessons' | 'hub' | 'act1' | 'act2' | 'act3' | 'act4' | 'act5' | 'act6'>('lessons');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [screenMountKey, setScreenMountKey] = useState<number>(1);
  const [globalTerbaik, setGlobalTerbaik] = useState<boolean>(false);

  const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to set-phonics-mode custom event
  useEffect(() => {
    const handleSetMode = (e: any) => {
      const targetMode = (e.detail?.mode || (window as any).phonicsMode) as PhonicsMode;
      if (targetMode && ['kenali_huruf', 'vokal_konsonan', 'fonik_abc'].includes(targetMode)) {
        setMode(targetMode);
        setCurrentView('lessons');
      }
      if (e.detail?.filter) {
        setFilterCategory(e.detail.filter === 'konsonan' ? 'konsonan' : 'vokal');
      } else if (targetMode === 'vokal_konsonan') {
        setFilterCategory('vokal');
      }
    };

    window.addEventListener('set-phonics-mode', handleSetMode);
    return () => window.removeEventListener('set-phonics-mode', handleSetMode);
  }, []);

  const wasVisibleRef = useRef<boolean>(false);

  // Detect when Fonik ABC screen becomes visible from Misi Huruf
  useEffect(() => {
    const el = document.getElementById('view-belajar-fonik');
    if (!el) return;

    const checkVisibility = () => {
      const isVisible = el.classList.contains('active');
      if (isVisible && !wasVisibleRef.current) {
        wasVisibleRef.current = true;
        const targetMode = (window as any).phonicsMode as PhonicsMode;
        if (targetMode && ['kenali_huruf', 'vokal_konsonan', 'fonik_abc'].includes(targetMode)) {
          setMode(targetMode);
        }
        if ((window as any).phonicsFilter) {
          setFilterCategory((window as any).phonicsFilter === 'konsonan' ? 'konsonan' : 'vokal');
        } else if (targetMode === 'vokal_konsonan') {
          setFilterCategory('vokal');
        }
        const isUserAdminCheck = () => {
          if (typeof window === 'undefined') return false;
          // JANGAN percaya localStorage semata-mata — sisa 'admin' daripada
          // sesi lama akan membuka akses Pro kepada pelawat awam.
          return !!(
            (window as any).modAdminAktif ||
            (window as any).isAdminMode ||
            (window as any).adminClaimDisahkan === true ||
            (typeof document !== 'undefined' && document.body?.classList?.contains('admin-mode'))
          );
        };
        const isTrialNow = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
        if (isTrialNow) {
          const initial: ProgressRecord = {};
          PHONICS_DATABASE.forEach(item => {
            initial[item.letter] = [false, false, false, false, false, false];
          });
          setProgress(initial);
        }
        setCurrentView('lessons');
      } else if (!isVisible) {
        wasVisibleRef.current = false;
      }
    };

    checkVisibility();

    const observer = new MutationObserver(() => {
      checkVisibility();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isUserAdminCheck = () => {
    if (typeof window === 'undefined') return false;
    // JANGAN percaya localStorage semata-mata — sisa 'admin' daripada
    // sesi lama akan membuka akses Pro kepada pelawat awam.
    return !!(
      (window as any).modAdminAktif ||
      (window as any).isAdminMode ||
      (window as any).adminClaimDisahkan === true ||
      (typeof document !== 'undefined' && document.body?.classList?.contains('admin-mode'))
    );
  };

  const getPhonicsStorageKey = () => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      return `${currentConfig.progressKey}_trial_session`;
    }
    const studentName = typeof window !== 'undefined'
      ? ((window as any).namaMuridAktif || localStorage.getItem('muridAktif') || 'Murid')
      : 'Murid';
    return `${currentConfig.progressKey}_${studentName.toLowerCase().replace(/\s+/g, '_')}`;
  };

  const [progress, setProgress] = useState<ProgressRecord>(() => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      // Mod percuma sentiasa bersih bermula dari kosong (0 aktiviti selesai)
      const initial: ProgressRecord = {};
      PHONICS_DATABASE.forEach(item => {
        initial[item.letter] = [false, false, false, false, false, false];
      });
      return initial;
    }
    try {
      const storageKey = getPhonicsStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    const initial: ProgressRecord = {};
    PHONICS_DATABASE.forEach(item => {
      initial[item.letter] = [false, false, false, false, false, false];
    });
    return initial;
  });

  // Reload progress when mode changes
  useEffect(() => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      const initial: ProgressRecord = {};
      PHONICS_DATABASE.forEach(item => {
        initial[item.letter] = [false, false, false, false, false, false];
      });
      setProgress(initial);
      return;
    }
    try {
      const storageKey = getPhonicsStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgress(JSON.parse(saved));
        return;
      }
    } catch (e) { }
    const initial: ProgressRecord = {};
    PHONICS_DATABASE.forEach(item => {
      initial[item.letter] = [false, false, false, false, false, false];
    });
    setProgress(initial);
  }, [mode]);

  const saveActivityDone = (letter: string, actIndex: number) => {
    setProgress(prev => {
      const curr = prev[letter] ? [...prev[letter]] : [false, false, false, false, false, false];
      curr[actIndex] = true;
      const updated = { ...prev, [letter]: curr };
      try {
        const storageKey = getPhonicsStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    // Auto-update student profile stars immediately (+1 Bintang) - HANYA jika bukan trial
    if (!isTrial && typeof (window as any).tambahBintangGlobal === 'function') {
      (window as any).tambahBintangGlobal(`fonik_${mode}_${letter}_act${actIndex + 1}`, 1);
    }
  };

  const rawPhonics = PHONICS_DATABASE[selectedLetterIndex] || PHONICS_DATABASE[0];
  const currentPhonics = React.useMemo(() => {
    if (mode === 'fonik_abc') {
      return {
        ...rawPhonics,
        soundAudio: getPhonicsAudio(rawPhonics.letter)
      };
    }
    return rawPhonics;
  }, [rawPhonics, mode]);

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Find the first letter index that is NOT yet fully completed
  const nextTargetIndex = PHONICS_DATABASE.findIndex(p => {
    const status = progress[p.letter];
    return !status || !status.every(Boolean);
  });
  const activeFocusIndex = nextTargetIndex === -1 ? 0 : nextTargetIndex;

  const playSound = (src: string, onEnd?: () => void) => {
    try {
      if (activeAudioRef.current) {
        try {
          activeAudioRef.current.pause();
          activeAudioRef.current.currentTime = 0;
        } catch (e) { }
        activeAudioRef.current = null;
      }
      const audio = new Audio(src);
      activeAudioRef.current = audio;
      audio.onended = () => {
        if (activeAudioRef.current === audio) activeAudioRef.current = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(err => {
        console.warn("Audio notice:", src, err);
        if (activeAudioRef.current === audio) activeAudioRef.current = null;
        if (onEnd) onEnd();
      });
    } catch (e) {
      if (onEnd) onEnd();
    }
  };

  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) { }
  };

  const playErrorSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) { }
  };

  const playSuccessCelebration = () => {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.55 }
    });
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch (e) { }
  };

  // Helper to trigger floating "Terbaik! 🌟" animation before advancing to next screen
  const triggerTerbaik = (onComplete: () => void, durationMs = 1500) => {
    playSuccessCelebration();
    setGlobalTerbaik(true);
    setTimeout(() => {
      setGlobalTerbaik(false);
      onComplete();
    }, durationMs);
  };

  // -------------------------------------------------------------
  // ACTIVITIES ROUTER
  // -------------------------------------------------------------
  if (currentView === 'act1') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity1HearSound
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 0)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act2')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act2') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity2MatchPartners
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 1)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act3')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act3') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity3BubblePop
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 2)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act4')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act4') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity4FindSound
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 3)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act5')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act5') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity5MatchSound
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 4)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act6')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act6') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity6PicturePuzzle
          phonics={currentPhonics}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentPhonics.letter, 5)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('lessons')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }

  if (currentView === 'hub') {
    const actStatus = progress[currentPhonics.letter] || [false, false, false, false, false, false];
    const completedCount = actStatus.filter(Boolean).length;

    const isCurrentVowel = isVowelLetter(currentPhonics.letter);

    const activitiesList = (mode === 'kenali_huruf' ? [
      {
        num: 1,
        title: `Kenali Huruf ${currentPhonics.letter}`,
        desc: `Tekan setiap huruf kecil [${currentPhonics.letter}] & besar [${currentPhonics.uppercase}]. Sebut namanya.`,
        action: () => setCurrentView('act1'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/dengar bunyi huruf.png'
      },
      {
        num: 2,
        title: 'Pasangan Huruf',
        desc: `Tarik & cantumkan puzzle huruf kecil [${currentPhonics.letter}] dengan huruf besar [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act2'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pasangan.png'
      },
      {
        num: 3,
        title: 'Letup Buih Huruf',
        desc: `Pecahkan buih terapung huruf kecil & besar [${currentPhonics.letter}] & [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act3'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/buih.png'
      },
      {
        num: 4,
        title: 'Cari Huruf',
        desc: `Cari & tekan semua kad huruf [${currentPhonics.letter}] & [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act4'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/cari bunyi.png'
      },
      {
        num: 5,
        title: 'Sambung Garisan',
        desc: `Dengar sebutan nama huruf & sambungkan garisan ke huruf [${currentPhonics.letter}].`,
        action: () => setCurrentView('act5'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pilih jawapan betul.png'
      },
      {
        num: 6,
        title: 'Teka Gambar & Huruf',
        desc: `Buka 9 jubin untuk kenali gambar [${currentPhonics.word}] dan huruf awalan!`,
        action: () => setCurrentView('act6'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/teka gambar rahsia.png'
      }
    ] : mode === 'vokal_konsonan' ? [
      {
        num: 1,
        title: `Kategori ${isCurrentVowel ? 'Vokal' : 'Konsonan'}`,
        desc: `Huruf [${currentPhonics.letter}] ialah huruf ${isCurrentVowel ? 'VOKAL (a,e,i,o,u)' : 'KONSONAN'}. Dengar sebutannya.`,
        action: () => setCurrentView('act1'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/dengar bunyi huruf.png'
      },
      {
        num: 2,
        title: 'Pasangan Huruf',
        desc: `Cantumkan puzzle huruf [${currentPhonics.letter}] (${isCurrentVowel ? 'VOKAL' : 'KONSONAN'}) dengan [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act2'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pasangan.png'
      },
      {
        num: 3,
        title: `Buih ${isCurrentVowel ? 'Vokal' : 'Konsonan'}`,
        desc: `Pecahkan buih terapung huruf ${isCurrentVowel ? 'Vokal' : 'Konsonan'} [${currentPhonics.letter}] & [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act3'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/buih.png'
      },
      {
        num: 4,
        title: 'Cari & Kelaskan',
        desc: `Cari & tekan semua kad kumpulan ${isCurrentVowel ? 'Vokal' : 'Konsonan'} [${currentPhonics.letter}].`,
        action: () => setCurrentView('act4'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/cari bunyi.png'
      },
      {
        num: 5,
        title: 'Sambung Kategori',
        desc: `Dengar sebutan audio & sambungkan garisan ke huruf [${currentPhonics.letter}].`,
        action: () => setCurrentView('act5'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pilih jawapan betul.png'
      },
      {
        num: 6,
        title: 'Teka Gambar & Kategori',
        desc: `Buka 9 jubin & kenal pasti kategori huruf awalan bagi [${currentPhonics.word}]!`,
        action: () => setCurrentView('act6'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/teka gambar rahsia.png'
      }
    ] : [
      {
        num: 1,
        title: `Dengar Bunyi ${currentPhonics.letter}`,
        desc: `Tekan setiap huruf ${currentPhonics.letter} & ${currentPhonics.uppercase}. Dengar bunyinya.`,
        action: () => setCurrentView('act1'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/dengar bunyi huruf.png'
      },
      {
        num: 2,
        title: 'Pasangan Huruf',
        desc: `Tarik & cantumkan puzzle huruf [${currentPhonics.letter}] dengan huruf besar [${currentPhonics.uppercase}].`,
        action: () => setCurrentView('act2'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pasangan.png'
      },
      {
        num: 3,
        title: 'Buih Fonik',
        desc: `Pecahkan buih terapung ${currentPhonics.letter} & ${currentPhonics.uppercase}. Dengar sebutannya.`,
        action: () => setCurrentView('act3'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/buih.png'
      },
      {
        num: 4,
        title: 'Cari Bunyi',
        desc: `Cari & tekan semua kad bunyi ${currentPhonics.letter}.`,
        action: () => setCurrentView('act4'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/cari bunyi.png'
      },
      {
        num: 5,
        title: 'Padankan Bunyi',
        desc: `Dengar audio & sambungkan garisan ke huruf ${currentPhonics.letter}.`,
        action: () => setCurrentView('act5'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/pilih jawapan betul.png'
      },
      {
        num: 6,
        title: 'Teka Gambar Rahsia',
        desc: `Buka 9 jubin untuk mendedahkan gambar & perkataan ${currentPhonics.word}!`,
        action: () => setCurrentView('act6'),
        bgImage: '/images/menu-kad/menu asas bunyi kata/teka gambar rahsia.png'
      }
    ]);

    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: MAIN_APP_BG,
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '16px 12px 24px 12px' : '24px 20px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <GlobalTerbaikPopup show={globalTerbaik} />
        {/* Top Navbar */}
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto 16px auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '44px 1fr auto' : '48px 1fr auto',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playNavSound();
              setCurrentView('lessons');
            }}
            style={{
              width: isMobile ? '44px' : '46px',
              height: isMobile ? '44px' : '46px',
              borderRadius: '50%',
              padding: 0,
              touchAction: 'manipulation',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              background: currentConfig.topBadgeColor,
              border: '3px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.15rem' : '1.25rem',
              zIndex: 25
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </motion.button>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div
              style={{
                background: currentConfig.topBadgeColor,
                border: '3px solid #1e293b',
                boxShadow: '0 2.5px 0 #1e293b',
                borderRadius: isMobile ? '18px' : '20px',
                color: 'white',
                fontSize: isMobile ? '1.15rem' : '1.35rem',
                fontWeight: 900,
                padding: isMobile ? '8px 22px' : '10px 32px',
                letterSpacing: '0.5px',
                userSelect: 'none',
                textAlign: 'center',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                whiteSpace: 'nowrap'
              }}
            >
              {currentConfig.topBadge}
            </div>
          </div>

          {/* Lightbulb Guide Icon Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playNavSound();
              setShowGuideModal(true);
            }}
            style={{
              width: isMobile ? '44px' : '46px',
              height: isMobile ? '44px' : '46px',
              borderRadius: '50%',
              padding: 0,
              background: currentConfig.topBadgeColor,
              border: '3px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              color: 'white',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.15rem' : '1.25rem',
              zIndex: 25
            }}
            title="Panduan Belajar Fonik"
          >
            <i className="fa-solid fa-lightbulb"></i>
          </motion.button>
        </div>

        {/* Top Header Card with Scale-Up & Shine Loop */}
        <motion.div
          key={`hub-header-${mode}-${currentPhonics.letter}-${screenMountKey}`}
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
            borderRadius: '24px',
            border: '3.5px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '16px 14px' : '20px 24px',
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto 20px auto',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            minHeight: 'fit-content'
          }}
        >
          {/* Shine Sweep Loop Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 3
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-150%',
                width: '45%',
                height: '200%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                transform: 'rotate(25deg)',
                animation: 'shineSweepLoop 3.5s infinite ease-in-out'
              }}
            />
          </div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div
                style={{
                  width: isMobile ? '46px' : '54px',
                  height: isMobile ? '46px' : '54px',
                  borderRadius: '14px',
                  backgroundColor: currentConfig.topBadgeColor,
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: isMobile ? '1.7rem' : '2rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  flexShrink: 0
                }}
              >
                {currentPhonics.letter}
              </div>

              <div>
                <h1 style={{
                  fontSize: isMobile ? '1.3rem' : '1.8rem',
                  fontWeight: 900,
                  color: '#1e293b',
                  margin: 0,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}>
                  {mode === 'kenali_huruf'
                    ? `Huruf ${currentPhonics.uppercase}${currentPhonics.letter}`
                    : mode === 'vokal_konsonan'
                      ? `Huruf ${currentPhonics.uppercase}${currentPhonics.letter} (${isCurrentVowel ? 'Vokal' : 'Konsonan'})`
                      : `Fonik Huruf ${currentPhonics.letter}`}
                </h1>
                <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: isMobile ? '0.8rem' : '0.95rem', fontWeight: 600 }}>
                  {mode === 'kenali_huruf'
                    ? <>Kenali bentuk huruf kecil <strong>[{currentPhonics.letter}]</strong>, huruf besar <strong>[{currentPhonics.uppercase}]</strong> serta contoh perkataan <strong>{currentPhonics.sampleWords.join(', ')}</strong>.</>
                    : mode === 'vokal_konsonan'
                      ? <>Huruf <strong>[{currentPhonics.letter}]</strong> tergolong dalam kumpulan huruf <strong>{isCurrentVowel ? 'vokal 🔴' : 'konsonan 🔵'}</strong>.</>
                      : <>Dengar dan latih bunyi fonik huruf permulaan bagi <strong>{currentPhonics.sampleWords.join(', ')}</strong>.</>}
                </p>
              </div>
            </div>

            {/* Icon-Only Audio Button */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                playNavSound();
                playSound(currentPhonics.soundAudio);
              }}
              style={{
                width: isMobile ? '42px' : '48px',
                height: isMobile ? '42px' : '48px',
                borderRadius: '50%',
                backgroundColor: currentConfig.topBadgeColor,
                border: '2.5px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: isMobile ? '1.2rem' : '1.4rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Dengar Bunyi Fonik"
            >
              <i className="fa-solid fa-volume-high"></i>
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              flex: 1,
              height: '12px',
              backgroundColor: '#e2e8f0',
              borderRadius: '999px',
              border: '2px solid #1e293b',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(completedCount / 6) * 100}%`,
                backgroundColor: '#10b981',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{
              background: '#f8fafc',
              border: '2px solid #1e293b',
              borderRadius: '999px',
              padding: '3px 12px',
              fontWeight: 900,
              fontSize: '0.85rem',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fa-solid fa-check" style={{ color: '#10b981', fontWeight: 900 }}></i>
              <span>{completedCount} / 6</span>
            </div>
          </div>
        </motion.div>

        {/* 6 Activity Cards Grid with Scale-Up Popup Animation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, 1fr)',
          gap: isMobile ? '10px' : '20px',
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          paddingBottom: isMobile ? '20px' : '40px',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          {activitiesList.map((act, index) => {
            const isDone = actStatus[index];
            const isTopThree = index < 3;
            const cardBg = isTopThree ? '#e0f2fe' : '#ede9fe';
            const numberBg = isTopThree ? '#38bdf8' : '#a855f7';
            const numberTextColor = isTopThree ? '#0c4a6e' : '#ffffff';

            const nextActIndex = actStatus.findIndex(d => !d);
            const isNextActiveAct = index === (nextActIndex === -1 ? 0 : nextActIndex) && !isDone;

            return (
              <motion.div
                key={act.num}
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={
                  isNextActiveAct
                    ? {
                      opacity: 1,
                      y: 0,
                      scale: [1, 1.04, 1],
                      boxShadow: [
                        '0 3px 0 #1e293b, 0 0 0px rgba(245, 158, 11, 0)',
                        '0 3px 0 #1e293b, 0 0 16px rgba(245, 158, 11, 0.95)',
                        '0 3px 0 #1e293b, 0 0 0px rgba(245, 158, 11, 0)'
                      ]
                    }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                transition={
                  isNextActiveAct
                    ? {
                      scale: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
                      boxShadow: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
                      opacity: { duration: 0.25 },
                      y: { duration: 0.25 }
                    }
                    : { type: 'spring', stiffness: 350, damping: 22, delay: index * 0.05 }
                }
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playNavSound();
                  act.action();
                }}
                style={{
                  background: cardBg,
                  borderRadius: isMobile ? '20px' : '24px',
                  border: isNextActiveAct ? '3.5px solid #f59e0b' : '3px solid #1e293b',
                  boxShadow: isMobile ? '0 2.5px 0 #1e293b' : '0 3px 0 #1e293b',
                  padding: isMobile ? '12px 10px' : '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: isMobile ? '160px' : '210px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Background Image & Dark Contrast Overlay clipped neatly to card radius */}
                {act.bgImage && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: isMobile ? '16px' : '20px',
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("${encodeURI(act.bgImage)}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.88) 100%)'
                      }}
                    />
                  </div>
                )}

                {/* Round Star Badge for Next Active Activity - unclipped */}
                {isNextActiveAct && (
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: isMobile ? '-8px' : '-10px',
                      right: isMobile ? '-6px' : '-8px',
                      background: '#f59e0b',
                      color: '#ffffff',
                      border: '2px solid #1e293b',
                      borderRadius: '50%',
                      width: isMobile ? '24px' : '28px',
                      height: isMobile ? '24px' : '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1.5px 0 #1e293b',
                      zIndex: 10,
                      fontSize: isMobile ? '0.75rem' : '0.85rem'
                    }}
                  >
                    <i className="fa-solid fa-star" style={{ color: '#fef08a' }}></i>
                  </motion.div>
                )}

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '12px' : '16px' }}>
                    <div style={{
                      width: isMobile ? '26px' : '32px',
                      height: isMobile ? '26px' : '32px',
                      borderRadius: '50%',
                      border: '2px solid #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      background: numberBg,
                      color: numberTextColor,
                      boxShadow: '0 1.5px 0 #1e293b'
                    }}>
                      {act.num}
                    </div>

                    {isDone && (
                      <div
                        style={{
                          width: isMobile ? '26px' : '30px',
                          height: isMobile ? '26px' : '30px',
                          borderRadius: '50%',
                          border: '2px solid #1e293b',
                          background: '#10b981',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '0.85rem' : '0.95rem',
                          boxShadow: '0 1.5px 0 #1e293b'
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </div>
                    )}
                  </div>

                  {/* Title as Pill Badge & shifted downward slightly */}
                  <div style={{ marginTop: isMobile ? '6px' : '10px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '2px solid rgba(255, 255, 255, 0.45)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.35)',
                        borderRadius: '999px',
                        padding: isMobile ? '3px 10px' : '4px 14px',
                        marginBottom: isMobile ? '6px' : '8px',
                        maxWidth: '100%'
                      }}
                    >
                      <span
                        style={{
                          fontSize: isMobile ? '0.88rem' : '1.05rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                          letterSpacing: '0.2px',
                          lineHeight: '1.2'
                        }}
                      >
                        {act.title}
                      </span>
                    </div>

                    <p style={{
                      color: '#e2e8f0',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      fontSize: isMobile ? '0.78rem' : '0.88rem',
                      fontWeight: 600,
                      lineHeight: '1.3',
                      margin: 0
                    }}>
                      {act.desc}
                    </p>
                  </div>
                </div>

                <div style={{
                  marginTop: isMobile ? '8px' : '12px',
                  paddingTop: isMobile ? '6px' : '8px',
                  borderTop: '2px solid rgba(255, 255, 255, 0.22)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: isDone ? '#ffffff' : '#fbbf24',
                      fontWeight: 900,
                      fontSize: isMobile ? '0.85rem' : '0.95rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    <span>{isDone ? 'Belajar' : 'Mula'}</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* VR Bunyi Kata-Style Guide Modal */}
        <AnimatePresence>
          {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} isMobile={isMobile} mode={mode} />}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LESSONS OVERVIEW SCREEN: 26 LETTERS LIST (SCREEN 1)
  // -------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '16px 12px 24px 12px' : '24px 20px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <GlobalTerbaikPopup show={globalTerbaik} />
      {/* Top Navbar with Scale-Up Popup Animation */}
      <motion.div
        key={`topbar-${mode}-${screenMountKey}`}
        initial={{ scale: 0.85, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20 }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 12px auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '44px 1fr auto' : '48px 1fr auto',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20,
          flexShrink: 0
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playNavSound();
            onClose();
          }}
          style={{
            width: isMobile ? '44px' : '46px',
            height: isMobile ? '44px' : '46px',
            borderRadius: '50%',
            padding: 0,
            touchAction: 'manipulation',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            background: currentConfig.topBadgeColor,
            border: '3px solid #1e293b',
            boxShadow: '0 2.5px 0 #1e293b',
            color: 'white',
            fontSize: isMobile ? '1.15rem' : '1.25rem',
            zIndex: 25
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </motion.button>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div
            style={{
              background: currentConfig.topBadgeColor,
              border: '3px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              borderRadius: isMobile ? '18px' : '20px',
              color: 'white',
              fontSize: isMobile ? '1.15rem' : '1.35rem',
              fontWeight: 900,
              padding: isMobile ? '8px 22px' : '10px 32px',
              letterSpacing: '0.5px',
              userSelect: 'none',
              textAlign: 'center',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              whiteSpace: 'nowrap'
            }}
          >
            {currentConfig.topBadge}
          </div>
        </div>

        {/* Lightbulb Guide Icon Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playNavSound();
            setShowGuideModal(true);
          }}
          style={{
            width: isMobile ? '44px' : '46px',
            height: isMobile ? '44px' : '46px',
            borderRadius: '50%',
            padding: 0,
            background: currentConfig.topBadgeColor,
            border: '3px solid #1e293b',
            boxShadow: '0 2.5px 0 #1e293b',
            color: 'white',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.15rem' : '1.25rem',
            zIndex: 25
          }}
          title={currentConfig.guideTitle}
        >
          <i className="fa-solid fa-lightbulb"></i>
        </motion.button>
      </motion.div>

      {/* 3-Way Mode Switcher Pill Tabs with Scale-Up Animation */}
      <motion.div
        key={`modeswitcher-${mode}-${screenMountKey}`}
        initial={{ scale: 0.85, opacity: 0, y: -8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.04 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '6px' : '12px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto 16px auto',
          flexWrap: 'wrap',
          flexShrink: 0
        }}
      >
        {[
          { id: 'kenali_huruf' as PhonicsMode, label: 'Kenali Huruf ABC', color: '#ea580c', icon: 'fa-font' },
          { id: 'vokal_konsonan' as PhonicsMode, label: 'Vokal & Konsonan', color: '#0f766e', icon: 'fa-cubes-stacked' },
          { id: 'fonik_abc' as PhonicsMode, label: 'Fonik ABC', color: '#7c3aed', icon: 'fa-volume-high' }
        ].map((tab) => {
          const isActive = mode === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playNavSound();
                setMode(tab.id);
                setScreenMountKey(prev => prev + 1);
                (window as any).phonicsMode = tab.id;
              }}
              style={{
                background: isActive ? tab.color : '#ffffff',
                color: isActive ? '#ffffff' : '#1e293b',
                border: '3px solid #1e293b',
                boxShadow: isActive ? `0 3px 0 #1e293b, 0 4px 12px ${tab.color}40` : '0 2px 0 #1e293b',
                borderRadius: '999px',
                padding: isMobile ? '6px 12px' : '8px 18px',
                fontSize: isMobile ? '0.82rem' : '0.98rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ color: isActive ? '#ffffff' : tab.color }}></i>
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Banner with Scale-Up and Shine Sweep Loop */}
      <motion.div
        key={`banner-${mode}-${screenMountKey}`}
        initial={{ scale: 0.85, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.08 }}
        style={{
          background: currentConfig.topBadgeColor,
          backgroundImage: currentConfig.bannerGradient,
          borderRadius: isMobile ? '20px' : '32px',
          border: '3.5px solid #1e293b',
          boxShadow: '0 3px 0 #1e293b',
          padding: isMobile ? '14px 14px 16px 14px' : '26px 24px',
          maxWidth: '1200px',
          width: '100%',
          margin: isMobile ? '0 auto 14px auto' : '0 auto 20px auto',
          color: 'white',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          minHeight: 'fit-content'
        }}
      >
        {/* Shine Sweep Glint Loop Animation for Main Banner */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: isMobile ? '20px' : '32px',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-150%',
              width: '45%',
              height: '200%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
              transform: 'rotate(25deg)',
              animation: 'shineSweepLoop 3.5s infinite ease-in-out'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: isMobile ? '5px' : '7px', position: 'relative', alignItems: 'center', padding: isMobile ? '4px 2px' : '6px 4px', flexShrink: 0 }}>
            {/* Modern Sparkle Star 1 (Top-Left) */}
            <motion.div
              animate={{
                scale: [0.85, 1.2, 0.85],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.75, 1, 0.75]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: isMobile ? '16px' : '20px',
                height: isMobile ? '16px' : '20px',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 2,
                filter: 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.7))'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
                <path
                  d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
                  fill="url(#sparkle-grad-tl)"
                />
                <defs>
                  <linearGradient id="sparkle-grad-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="50%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Modern Sparkle Star 2 (Top-Right) */}
            <motion.div
              animate={{
                scale: [1.15, 0.8, 1.15],
                rotate: [360, 270, 180, 90, 0],
                opacity: [1, 0.6, 1]
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: isMobile ? '15px' : '18px',
                height: isMobile ? '15px' : '18px',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 2,
                filter: 'drop-shadow(0 2px 4px rgba(251, 113, 133, 0.7))'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
                <path
                  d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z"
                  fill="url(#star-grad-tr)"
                  stroke="#1e293b"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="star-grad-tr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff1f2" />
                    <stop offset="40%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {['A', 'B', 'C'].map((ch, idx) => {
              const bgColors = ['#facc15', '#38bdf8', '#fb7185'];
              const borderShadowColors = ['#ca8a04', '#0284c7', '#e11d48'];
              const glowColors = [
                'rgba(250, 204, 21, 0.45)',
                'rgba(56, 189, 248, 0.45)',
                'rgba(251, 113, 133, 0.45)'
              ];

              return (
                <motion.div
                  key={ch}
                  animate={{
                    y: [0, -6, 0, 2, 0],
                    rotate: idx === 0 ? [-3.5, 2.5, -3.5] : idx === 1 ? [0, -3, 0, 3, 0] : [3.5, -2.5, 3.5],
                    scale: [1, 1.04, 0.98, 1.01, 1]
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.32
                  }}
                  whileHover={{
                    scale: 1.18,
                    y: -10,
                    rotate: idx === 0 ? -10 : idx === 1 ? 4 : 10,
                    boxShadow: `0 7px 0 ${borderShadowColors[idx]}, 0 10px 18px ${glowColors[idx]}`,
                    transition: { type: 'spring', stiffness: 350, damping: 14 }
                  }}
                  whileTap={{
                    scale: 0.9,
                    y: 2,
                    boxShadow: `0 1px 0 ${borderShadowColors[idx]}`
                  }}
                  style={{
                    position: 'relative',
                    width: isMobile ? '36px' : '46px',
                    height: isMobile ? '36px' : '46px',
                    borderRadius: isMobile ? '10px' : '13px',
                    backgroundColor: bgColors[idx],
                    border: '2.5px solid #1e293b',
                    boxShadow: `0 4px 0 ${borderShadowColors[idx]}, 0 4px 8px rgba(0,0,0,0.22)`,
                    color: '#1e293b',
                    fontSize: isMobile ? '1.3rem' : '1.8rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: 'pointer',
                    userSelect: 'none',
                    overflow: 'hidden'
                  }}
                >
                  {/* Glossy top-highlight reflection */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '42%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 100%)',
                      borderTopLeftRadius: isMobile ? '7px' : '10px',
                      borderTopRightRadius: isMobile ? '7px' : '10px',
                      pointerEvents: 'none'
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>
                    {ch}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <h1 style={{
            fontSize: isMobile ? '1.2rem' : '2.1rem',
            fontWeight: 900,
            margin: 0,
            textShadow: '0 2px 0 #1e293b',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            lineHeight: 1.2
          }}>
            {currentConfig.title}
          </h1>
        </div>

        <p style={{
          fontSize: isMobile ? '0.82rem' : '1.1rem',
          fontWeight: 600,
          margin: isMobile ? '0 0 10px 0' : '0 0 16px 0',
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1.3
        }}>
          {currentConfig.subtitle}
        </p>

        {mode === 'vokal_konsonan' ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.22)',
            padding: isMobile ? '5px 14px' : '6px 18px',
            borderRadius: '999px',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            fontSize: isMobile ? '0.82rem' : '0.94rem',
            fontWeight: 800,
            marginTop: '4px'
          }}>
            <i className="fa-solid fa-circle-info"></i>
            <span>5 Huruf Vokal &bull; 21 Huruf Konsonan</span>
          </div>
        ) : (
          <div style={{
            height: isMobile ? '10px' : '14px',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '999px',
            border: '2px solid #1e293b',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <div style={{
              height: '100%',
              width: `${(PHONICS_DATABASE.filter(p => (mode === 'fonik_abc' || p.letter !== 'é') && progress[p.letter]?.every(Boolean)).length / (mode === 'fonik_abc' ? PHONICS_DATABASE.length : 26)) * 100}%`,
              backgroundColor: currentConfig.bannerProgressColor,
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        )}
      </motion.div>

      {/* Vokal / Konsonan Filter Tabs with Scale-Up Animation */}
      {mode === 'vokal_konsonan' && (
        <motion.div
          key={`filtertabs-${mode}-${screenMountKey}`}
          initial={{ scale: 0.85, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '8px' : '14px',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto 16px auto',
            flexWrap: 'wrap'
          }}
        >
          {[
            { id: 'vokal' as const, label: 'Huruf Vokal', dotColor: '#ef4444' },
            { id: 'konsonan' as const, label: 'Huruf Konsonan', dotColor: '#0284c7' }
          ].map((cat) => {
            const isSelected = filterCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playNavSound();
                  setFilterCategory(cat.id);
                }}
                style={{
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                  color: '#1e293b',
                  border: isSelected ? '3.5px solid #1e293b' : '2.5px solid #1e293b',
                  boxShadow: isSelected ? '0 3.5px 0 #1e293b' : '0 2px 0 #1e293b',
                  borderRadius: '999px',
                  padding: isMobile ? '6px 16px' : '8px 22px',
                  fontSize: isMobile ? '0.85rem' : '0.98rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: isMobile ? '9px' : '11px',
                    height: isMobile ? '9px' : '11px',
                    borderRadius: '50%',
                    backgroundColor: cat.dotColor,
                    display: 'inline-block',
                    border: '1.5px solid #1e293b',
                    flexShrink: 0
                  }}
                />
                <span style={{ color: '#1e293b' }}>{cat.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* 26 Letters Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: isMobile ? '10px' : '20px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        paddingBottom: '20px',
        boxSizing: 'border-box'
      }}>
        {PHONICS_DATABASE.filter(item => {
          if (mode === 'kenali_huruf' && item.letter === 'é') return false;
          if (mode === 'vokal_konsonan' && item.letter === 'é') return false;
          if (mode !== 'vokal_konsonan') return true;
          const isV = isVowelLetter(item.letter);
          return filterCategory === 'vokal' ? isV : !isV;
        }).map((item, index) => {
          const actStatus = progress[item.letter] || [false, false, false, false, false, false];
          const isCompleted = actStatus.every(Boolean);
          const isNextTarget = mode !== 'vokal_konsonan' && index === activeFocusIndex && !isCompleted;
          const isVowel = isVowelLetter(item.letter);

          return (
            <motion.div
              key={`${item.letter}-${mode}-${filterCategory}-${screenMountKey}`}
              initial={{ scale: 0.7, opacity: 0, y: 25 }}
              animate={
                isNextTarget
                  ? {
                    scale: [1, isMobile ? 1.03 : 1.045, 1],
                    opacity: 1,
                    y: 0
                  }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={
                isNextTarget
                  ? {
                    scale: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
                    opacity: { duration: 0.3 },
                    y: { duration: 0.3 }
                  }
                  : { type: 'spring', stiffness: 420, damping: 22, delay: 0.1 + Math.min(index * 0.022, 0.4) }
              }
              whileHover={isMobile ? undefined : (isNextTarget ? { y: -4 } : { scale: 1.05, y: -4 })}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                playNavSound();
                const realIndex = PHONICS_DATABASE.findIndex(p => p.letter === item.letter);
                setSelectedLetterIndex(realIndex !== -1 ? realIndex : 0);
                setCurrentView('hub');
              }}
              style={{
                background: item.bgColor,
                borderRadius: isMobile ? '18px' : '24px',
                border: isNextTarget ? '4px solid #f59e0b' : isMobile ? '3px solid #1e293b' : '3.5px solid #1e293b',
                boxShadow: isNextTarget
                  ? (isMobile ? '0 2.5px 0 #1e293b, 0 0 12px rgba(245, 158, 11, 0.65)' : '0 3px 0 #1e293b, 0 0 16px rgba(245, 158, 11, 0.75)')
                  : (isMobile ? '0 2.5px 0 #1e293b' : '0 3px 0 #1e293b'),
                padding: isMobile ? '12px 6px' : '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxSizing: 'border-box',
                position: 'relative',
                transformOrigin: 'center center'
              }}
            >
              {/* Looping Reveal Shine Sweep Overlay on Each Card */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: isMobile ? '18px' : '24px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 4
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-150%',
                    width: '50%',
                    height: '200%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                    transform: 'rotate(25deg)',
                    animation: `shineSweepLoop ${3.2 + (index % 4) * 0.4}s infinite ease-in-out ${(index % 5) * 0.3}s`
                  }}
                />
              </div>
              {/* Checkmark Badge for Completed Letters */}
              {mode !== 'vokal_konsonan' && isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    top: isMobile ? '6px' : '10px',
                    right: isMobile ? '6px' : '10px',
                    width: isMobile ? '22px' : '28px',
                    height: isMobile ? '22px' : '28px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #1e293b',
                    boxShadow: '0 1.5px 0 #1e293b',
                    fontSize: isMobile ? '0.75rem' : '0.9rem',
                    zIndex: 5
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                </div>
              )}

              {/* Round Gold Star Badge for Next Target to Learn */}
              {mode !== 'vokal_konsonan' && isNextTarget && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: isMobile ? '-8px' : '-10px',
                    right: isMobile ? '-6px' : '-8px',
                    background: '#f59e0b',
                    color: '#ffffff',
                    border: '2px solid #1e293b',
                    borderRadius: '50%',
                    width: isMobile ? '24px' : '28px',
                    height: isMobile ? '24px' : '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 0 #1e293b, 0 0 10px rgba(245, 158, 11, 0.9)',
                    zIndex: 30,
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    pointerEvents: 'none'
                  }}
                >
                  <i className="fa-solid fa-star" style={{ color: '#fef08a' }}></i>
                </motion.div>
              )}

              <div
                style={{
                  width: isMobile ? '65px' : '90px',
                  height: isMobile ? '65px' : '90px',
                  borderRadius: isMobile ? '18px' : '22px',
                  backgroundColor: item.color,
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  marginTop: '2px',
                  marginBottom: mode === 'kenali_huruf' ? (isMobile ? '8px' : '10px') : '6px'
                }}
              >
                {(mode === 'kenali_huruf' || mode === 'vokal_konsonan') ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span style={{ fontSize: isMobile ? '2.0rem' : '2.8rem' }}>{item.uppercase}</span>
                    <span style={{ fontSize: isMobile ? '1.6rem' : '2.2rem' }}>{item.letter}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: isMobile ? '2.4rem' : '3.4rem' }}>{item.letter}</span>
                )}
              </div>

              {/* Category Pill Tag for Vokal / Konsonan */}
              {mode === 'vokal_konsonan' && (
                <div style={{
                  background: isVowel ? '#ef4444' : '#0284c7',
                  color: 'white',
                  borderRadius: '999px',
                  padding: isMobile ? '2px 8px' : '3px 10px',
                  fontSize: isMobile ? '0.68rem' : '0.76rem',
                  fontWeight: 900,
                  marginBottom: '6px',
                  border: '1.5px solid #1e293b',
                  letterSpacing: '0.3px',
                  boxShadow: '0 1px 0 #1e293b'
                }}>
                  {isVowel ? 'Huruf Vokal' : 'Huruf Konsonan'}
                </div>
              )}

              {/* Category Pill Tag for Fonik ABC */}
              {mode === 'fonik_abc' && (
                <div style={{
                  background: '#7c3aed',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: isMobile ? '0.65rem' : '0.72rem',
                  fontWeight: 900,
                  marginBottom: '8px',
                  border: '1.5px solid #1e293b',
                  letterSpacing: '0.3px',
                  boxShadow: '0 1px 0 #1e293b'
                }}>
                  fonik
                </div>
              )}

              {/* Audio Icon-Only Button on Card for Vokal / Konsonan */}
              {mode === 'vokal_konsonan' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fef08a',
                    border: '1.5px solid #1e293b',
                    borderRadius: '50%',
                    width: isMobile ? '28px' : '32px',
                    height: isMobile ? '28px' : '32px',
                    fontSize: isMobile ? '0.8rem' : '0.92rem',
                    color: '#854d0e',
                    boxShadow: '0 1.5px 0 #1e293b',
                    marginTop: '2px'
                  }}
                  title="Dengar"
                >
                  <i className="fa-solid fa-volume-high"></i>
                </div>
              )}

              {/* Mini activity indicator bars only for kenali_huruf and fonik_abc */}
              {mode !== 'vokal_konsonan' && (
                <div style={{ display: 'flex', gap: isMobile ? '3px' : '5px', marginTop: mode === 'kenali_huruf' ? (isMobile ? '2px' : '4px') : '2px', marginBottom: '2px' }}>
                  {actStatus.map((done, i) => (
                    <div
                      key={i}
                      style={{
                        width: isMobile ? '10px' : '14px',
                        height: isMobile ? '5px' : '7px',
                        borderRadius: '3px',
                        backgroundColor: done ? '#10b981' : 'rgba(30, 41, 59, 0.18)',
                        border: '1px solid #1e293b'
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* VR Bunyi Kata-Style Guide Modal */}
      <AnimatePresence>
        {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} isMobile={isMobile} mode={mode} />}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// VR BUNYI KATA-STYLE GUIDE MODAL COMPONENT
// -------------------------------------------------------------
function GuideModal({ onClose, isMobile, mode }: { onClose: () => void; isMobile: boolean; mode: PhonicsMode }) {
  const config = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;

  const steps = mode === 'kenali_huruf' ? [
    { icon: 'fa-font', color: '#ea580c', title: '1. Kenali Huruf', desc: 'Kenal huruf kecil & besar' },
    { icon: 'fa-puzzle-piece', color: '#fb7185', title: '2. Pasangan Huruf', desc: 'Cantumkan huruf kecil & besar' },
    { icon: 'fa-soap', color: '#a855f7', title: '3. Letup Buih', desc: 'Pecahkan buih huruf' },
    { icon: 'fa-magnifying-glass', color: '#34d399', title: '4. Cari Huruf', desc: 'Tekan kad huruf sasaran' },
    { icon: 'fa-bezier-curve', color: '#f59e0b', title: '5. Sambung Garisan', desc: 'Tarik garisan ke huruf' },
    { icon: 'fa-image', color: '#f97316', title: '6. Gambar & Huruf', desc: 'Kenal huruf awalan gambar' }
  ] : mode === 'vokal_konsonan' ? [
    { icon: 'fa-circle-dot', color: '#ef4444', title: '1. Huruf Vokal (5)', desc: 'Kenali huruf a, e, i, o, u (kumpulan vokal)' },
    { icon: 'fa-circle-dot', color: '#0284c7', title: '2. Huruf Konsonan (21)', desc: 'Kenali huruf b, c, d, f... (kumpulan konsonan)' },
    { icon: 'fa-volume-high', color: '#f59e0b', title: '3. Dengar Sebutan', desc: 'Tekan kad huruf untuk mendengar sebutan audio' }
  ] : [
    { icon: 'fa-volume-high', color: '#38bdf8', title: '1. Dengar Bunyi', desc: 'Sebut huruf kecil & besar' },
    { icon: 'fa-puzzle-piece', color: '#fb7185', title: '2. Pasangan Huruf', desc: 'Cantumkan kepingan' },
    { icon: 'fa-soap', color: '#a855f7', title: '3. Buih Fonik', desc: 'Pecahkan buih terapung' },
    { icon: 'fa-magnifying-glass', color: '#34d399', title: '4. Cari Bunyi', desc: 'Tekan kad huruf sasaran' },
    { icon: 'fa-bezier-curve', color: '#f59e0b', title: '5. Padankan Bunyi', desc: 'Sambungkan garisan' },
    { icon: 'fa-image', color: '#f97316', title: '6. Gambar Rahsia', desc: 'Buka 9 jubin rahsia' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 999
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 25 }}
        transition={{ type: 'spring', stiffness: 350, damping: 24 }}
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(circle, rgba(147, 197, 253, 0.24) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          borderRadius: isMobile ? '28px' : '36px',
          border: '4px solid #1e293b',
          boxShadow: '0 6px 0 #1e293b',
          padding: isMobile ? '24px 16px 20px 16px' : '32px 28px 24px 28px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Top Centered Title Badge */}
        <div style={{
          background: config.topBadgeColor,
          border: '3.5px solid #1e293b',
          boxShadow: '0 2.5px 0 #1e293b',
          borderRadius: '20px',
          color: 'white',
          fontSize: isMobile ? '1.25rem' : '1.55rem',
          fontWeight: 900,
          padding: isMobile ? '8px 24px' : '10px 36px',
          letterSpacing: '0.5px',
          userSelect: 'none',
          textAlign: 'center',
          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
          marginBottom: '16px'
        }}>
          {config.topBadge}
        </div>

        {/* Intro Paragraph */}
        <p style={{
          fontSize: isMobile ? '0.9rem' : '1.02rem',
          fontWeight: 800,
          color: '#1e293b',
          textAlign: 'center',
          lineHeight: '1.45',
          margin: '0 0 16px 0',
          padding: '0 8px'
        }}>
          {config.subtitle}
        </p>

        {/* 6 Step-by-Step Overview Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '3px solid #1e293b',
          padding: isMobile ? '12px 10px' : '16px 14px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '8px' : '12px',
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}>
          {steps.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                border: '2px solid #1e293b',
                padding: '8px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: item.color,
                color: '#ffffff',
                border: '2px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                marginBottom: '4px'
              }}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', fontWeight: 900, color: '#1e293b', lineHeight: '1.2' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Green "Mula Belajar" Action Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            onClose();
          }}
          style={{
            width: '100%',
            padding: isMobile ? '12px' : '14px',
            background: '#0d9488',
            border: '3.5px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            borderRadius: '20px',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            cursor: 'pointer',
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
          }}
        >
          Mula Belajar
        </motion.button>
      </motion.div>
    </div>
  );
}
