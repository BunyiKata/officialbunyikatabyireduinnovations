import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  MathActivity1KenaliOperasi,
  MathActivity2KiraJawab,
  MathActivity3PilihJawapan,
  MathActivity4LengkapPersamaan,
  MathActivity5SusunPersamaan,
  MathActivity6CabaranPantas
} from './MathActivities';
import {
  Activity1PicturePuzzleNombor,
  Activity2FlappyBirdNombor,
  Activity3HearNombor,
  Activity4BubblePopNombor,
  Activity5MatchPartnersNombor,
  Activity6SurihNombor,
  Activity7MatchAudioNombor
} from './NomborActivities';

export type NomborMode = 'bilang_0_10' | 'siri_nombor' | 'tambah_nombor' | 'tolak_nombor';

export interface NomborGameProps {
  onClose: () => void;
  initialMode?: NomborMode;
}

export interface NomborModeConfig {
  mode: NomborMode;
  title: string;
  topBadge: string;
  topBadgeColor: string;
  subtitle: string;
  bannerGradient: string;
  bannerProgressColor: string;
  progressKey: string;
  guideTitle: string;
}

export const NOMBOR_MODE_CONFIGS: Record<NomborMode, NomborModeConfig> = {
  bilang_0_10: {
    mode: 'bilang_0_10',
    title: 'Asas Nombor 0-10',
    topBadge: 'ASAS NOMBOR 0 - 10',
    topBadgeColor: '#ec4899',
    subtitle: 'Kira bilangan objek, sebut nama nombor, sambungkan pasangan, pecahkan buih, dan buka gambar rahsia!',
    bannerGradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 50%, #f472b6 100%)',
    bannerProgressColor: '#fbcfe8',
    progressKey: 'bunyikata_nombor_0_10_v5',
    guideTitle: 'Panduan Asas Nombor 0-10'
  },
  siri_nombor: {
    mode: 'siri_nombor',
    title: 'Siri Nombor 10-100',
    topBadge: 'SIRI NOMBOR 10 - 100',
    topBadgeColor: '#db2777',
    subtitle: 'Kira siri nombor puluh sehingga seratus, kenali perkataan bersuku kata, dan terokai aktiviti interaktif!',
    bannerGradient: 'linear-gradient(135deg, #9d174d 0%, #db2777 50%, #f472b6 100%)',
    bannerProgressColor: '#fbcfe8',
    progressKey: 'bunyikata_siri_nombor_v5',
    guideTitle: 'Panduan Siri Nombor 10-100'
  },
  tambah_nombor: {
    mode: 'tambah_nombor',
    title: 'Tambah Nombor',
    topBadge: 'TAMBAH NOMBOR',
    topBadgeColor: '#881337',
    subtitle: 'Latih operasi tambah nombor 0 hingga 10, bina persamaan matematik, dan selesaikan aktiviti interaktif!',
    bannerGradient: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #9f1239 100%)',
    bannerProgressColor: '#fda4af',
    progressKey: 'bunyikata_tambah_nombor_v5',
    guideTitle: 'Panduan Tambah Nombor'
  },
  tolak_nombor: {
    mode: 'tolak_nombor',
    title: 'Tolak Nombor',
    topBadge: 'TOLAK NOMBOR',
    topBadgeColor: '#881337',
    subtitle: 'Latih operasi tolak nombor 10 hingga 0, bina persamaan penolakan, dan selesaikan aktiviti interaktif!',
    bannerGradient: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #9f1239 100%)',
    bannerProgressColor: '#fda4af',
    progressKey: 'bunyikata_tolak_nombor_v5',
    guideTitle: 'Panduan Tolak Nombor'
  }
};

export interface NomborItem {
  id: string;
  digit: string;
  name: string;
  syllables: string[];
  image: string;
  audio: string;
  count: number;
  color: string;
  bgColor: string;
}

export const ASAS_0_10_DATABASE: NomborItem[] = [
  {
    id: 'num_0',
    digit: '0',
    name: 'sifar',
    syllables: ['si', 'far'],
    image: '/images/nombor/sifar.png',
    audio: '/audio/nombor/sifar.mp3',
    count: 0,
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'num_1',
    digit: '1',
    name: 'satu',
    syllables: ['sa', 'tu'],
    image: '/images/nombor/satu.png',
    audio: '/audio/nombor/satu.mp3',
    count: 1,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'num_2',
    digit: '2',
    name: 'dua',
    syllables: ['du', 'a'],
    image: '/images/nombor/dua.png',
    audio: '/audio/nombor/dua.mp3',
    count: 2,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'num_3',
    digit: '3',
    name: 'tiga',
    syllables: ['ti', 'ga'],
    image: '/images/nombor/tiga.png',
    audio: '/audio/nombor/tiga.mp3',
    count: 3,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'num_4',
    digit: '4',
    name: 'empat',
    syllables: ['em', 'pat'],
    image: '/images/nombor/empat.png',
    audio: '/audio/nombor/empat.mp3',
    count: 4,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'num_5',
    digit: '5',
    name: 'lima',
    syllables: ['li', 'ma'],
    image: '/images/nombor/lima.png',
    audio: '/audio/nombor/lima.mp3',
    count: 5,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'num_6',
    digit: '6',
    name: 'enam',
    syllables: ['e', 'nam'],
    image: '/images/nombor/enam.png',
    audio: '/audio/nombor/enam.mp3',
    count: 6,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'num_7',
    digit: '7',
    name: 'tujuh',
    syllables: ['tu', 'juh'],
    image: '/images/nombor/tujuh.png',
    audio: '/audio/nombor/tujuh.mp3',
    count: 7,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'num_8',
    digit: '8',
    name: 'lapan',
    syllables: ['la', 'pan'],
    image: '/images/nombor/lapan.png',
    audio: '/audio/nombor/lapan.mp3',
    count: 8,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'num_9',
    digit: '9',
    name: 'sembilan',
    syllables: ['sem', 'bi', 'lan'],
    image: '/images/nombor/sembilan.png',
    audio: '/audio/nombor/sembilan.mp3',
    count: 9,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'num_10',
    digit: '10',
    name: 'sepuluh',
    syllables: ['se', 'pu', 'luh'],
    image: '/images/nombor/sepuluh.png',
    audio: '/audio/nombor/sepuluh.mp3',
    count: 10,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];

export const SIRI_NOMBOR_DATABASE: NomborItem[] = [
  {
    id: 'siri_10',
    digit: '10',
    name: 'sepuluh',
    syllables: ['se', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/sepuluh.mp3',
    count: 10,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'siri_20',
    digit: '20',
    name: 'dua puluh',
    syllables: ['du', 'a', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/dua-puluh.mp3',
    count: 20,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'siri_30',
    digit: '30',
    name: 'tiga puluh',
    syllables: ['ti', 'ga', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/tiga-puluh.mp3',
    count: 30,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'siri_40',
    digit: '40',
    name: 'empat puluh',
    syllables: ['em', 'pat', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/empat-puluh.mp3',
    count: 40,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'siri_50',
    digit: '50',
    name: 'lima puluh',
    syllables: ['li', 'ma', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/lima-puluh.mp3',
    count: 50,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'siri_60',
    digit: '60',
    name: 'enam puluh',
    syllables: ['e', 'nam', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/enam-puluh.mp3',
    count: 60,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'siri_70',
    digit: '70',
    name: 'tujuh puluh',
    syllables: ['tu', 'juh', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/tujuh-puluh.mp3',
    count: 70,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'siri_80',
    digit: '80',
    name: 'lapan puluh',
    syllables: ['la', 'pan', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/lapan-puluh.mp3',
    count: 80,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'siri_90',
    digit: '90',
    name: 'sembilan puluh',
    syllables: ['sem', 'bi', 'lan', 'pu', 'luh'],
    image: '',
    audio: '/audio/nombor/sembilan-puluh.mp3',
    count: 90,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'siri_100',
    digit: '100',
    name: 'seratus',
    syllables: ['se', 'ra', 'tus'],
    image: '',
    audio: '/audio/nombor/seratus.mp3',
    count: 100,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];

export const TAMBAH_NOMBOR_DATABASE: NomborItem[] = [
  {
    id: 'add_0',
    digit: '0 + 0',
    name: 'sifar tambah sifar sama dengan sifar',
    syllables: ['0 + 0', '=', '0'],
    image: '/images/nombor/sifar.png',
    audio: '/audio/tambah/sifar tambah sifar sama dengan sifar.MP3',
    count: 0,
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'add_1',
    digit: '1 + 0',
    name: 'satu tambah sifar sama dengan satu',
    syllables: ['1 + 0', '=', '1'],
    image: '/images/nombor/satu.png',
    audio: '/audio/tambah/satu tambah sifar sama dengan satu.MP3',
    count: 1,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'add_2',
    digit: '1 + 1',
    name: 'satu tambah satu sama dengan dua',
    syllables: ['1 + 1', '=', '2'],
    image: '/images/nombor/dua.png',
    audio: '/audio/tambah/satu tambah satu sama dengan dua.MP3',
    count: 2,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'add_3',
    digit: '1 + 2',
    name: 'satu tambah dua sama dengan tiga',
    syllables: ['1 + 2', '=', '3'],
    image: '/images/nombor/tiga.png',
    audio: '/audio/tambah/satu tambah dua sama dengan tiga.MP3',
    count: 3,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'add_4',
    digit: '1 + 3',
    name: 'satu tambah tiga sama dengan empat',
    syllables: ['1 + 3', '=', '4'],
    image: '/images/nombor/empat.png',
    audio: '/audio/tambah/satu tambah tiga sama dengan empat.MP3',
    count: 4,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'add_5',
    digit: '1 + 4',
    name: 'satu tambah empat sama dengan lima',
    syllables: ['1 + 4', '=', '5'],
    image: '/images/nombor/lima.png',
    audio: '/audio/tambah/satu tambah empat sama dengan lima.MP3',
    count: 5,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'add_6',
    digit: '1 + 5',
    name: 'satu tambah lima sama dengan enam',
    syllables: ['1 + 5', '=', '6'],
    image: '/images/nombor/enam.png',
    audio: '/audio/tambah/satu tambah lima sama dengan enam.MP3',
    count: 6,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'add_7',
    digit: '1 + 6',
    name: 'satu tambah enam sama dengan tujuh',
    syllables: ['1 + 6', '=', '7'],
    image: '/images/nombor/tujuh.png',
    audio: '/audio/tambah/satu tambah enam sama dengan tujuh.MP3',
    count: 7,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'add_8',
    digit: '1 + 7',
    name: 'satu tambah tujuh sama dengan lapan',
    syllables: ['1 + 7', '=', '8'],
    image: '/images/nombor/lapan.png',
    audio: '/audio/tambah/satu tambah tujuh sama dengan lapan.MP3',
    count: 8,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'add_9',
    digit: '1 + 8',
    name: 'satu tambah lapan sama dengan sembilan',
    syllables: ['1 + 8', '=', '9'],
    image: '/images/nombor/sembilan.png',
    audio: '/audio/tambah/satu tambah lapan sama dengan sembilan.MP3',
    count: 9,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'add_10',
    digit: '1 + 9',
    name: 'satu tambah sembilan sama dengan sepuluh',
    syllables: ['1 + 9', '=', '10'],
    image: '/images/nombor/sepuluh.png',
    audio: '/audio/tambah/satu tambah sembilan sama dengan sepuluh.MP3',
    count: 10,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];

export const TOLAK_NOMBOR_DATABASE: NomborItem[] = [
  {
    id: 'sub_0',
    digit: '10 - 10',
    name: 'sepuluh tolak sepuluh sama dengan sifar',
    syllables: ['10 - 10', '=', '0'],
    image: '/images/nombor/sifar.png',
    audio: '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.MP3',
    count: 0,
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'sub_1',
    digit: '10 - 9',
    name: 'sepuluh tolak sembilan sama dengan satu',
    syllables: ['10 - 9', '=', '1'],
    image: '/images/nombor/satu.png',
    audio: '/audio/tolak/sepuluh tolak sembilan sama dengan satu.MP3',
    count: 1,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'sub_2',
    digit: '10 - 8',
    name: 'sepuluh tolak lapan sama dengan dua',
    syllables: ['10 - 8', '=', '2'],
    image: '/images/nombor/dua.png',
    audio: '/audio/tolak/sepuluh tolak lapan sama dengan dua.MP3',
    count: 2,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'sub_3',
    digit: '10 - 7',
    name: 'sepuluh tolak tujuh sama dengan tiga',
    syllables: ['10 - 7', '=', '3'],
    image: '/images/nombor/tiga.png',
    audio: '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.MP3',
    count: 3,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'sub_4',
    digit: '10 - 6',
    name: 'sepuluh tolak enam sama dengan empat',
    syllables: ['10 - 6', '=', '4'],
    image: '/images/nombor/empat.png',
    audio: '/audio/tolak/sepuluh tolak enam sama dengan empat.MP3',
    count: 4,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'sub_5',
    digit: '10 - 5',
    name: 'sepuluh tolak lima sama dengan lima',
    syllables: ['10 - 5', '=', '5'],
    image: '/images/nombor/lima.png',
    audio: '/audio/tolak/sepuluh tolak lima sama dengan lima.MP3',
    count: 5,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'sub_6',
    digit: '10 - 4',
    name: 'sepuluh tolak empat sama dengan enam',
    syllables: ['10 - 4', '=', '6'],
    image: '/images/nombor/enam.png',
    audio: '/audio/tolak/sepuluh tolak empat sama dengan enam.MP3',
    count: 6,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'sub_7',
    digit: '10 - 3',
    name: 'sepuluh tolak tiga sama dengan tujuh',
    syllables: ['10 - 3', '=', '7'],
    image: '/images/nombor/tujuh.png',
    audio: '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.MP3',
    count: 7,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'sub_8',
    digit: '10 - 2',
    name: 'sepuluh tolak dua sama dengan lapan',
    syllables: ['10 - 2', '=', '8'],
    image: '/images/nombor/lapan.png',
    audio: '/audio/tolak/sepuluh tolak dua sama dengan lapan.MP3',
    count: 8,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'sub_9',
    digit: '10 - 1',
    name: 'sepuluh tolak satu sama dengan sembilan',
    syllables: ['10 - 1', '=', '9'],
    image: '/images/nombor/sembilan.png',
    audio: '/audio/tolak/sepuluh tolak satu sama dengan sembilan.MP3',
    count: 9,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'sub_10',
    digit: '10 - 0',
    name: 'sepuluh tolak sifar sama dengan sepuluh',
    syllables: ['10 - 0', '=', '10'],
    image: '/images/nombor/sepuluh.png',
    audio: '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.MP3',
    count: 10,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];

export const ModernSoccerBall = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.22))', flexShrink: 0 }}>
    <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#10182f" strokeWidth="5.5" />
    <polygon points="50,32 65,43 59,61 41,61 35,43" fill="#10182f" />
    <polygon points="50,4 38,16 62,16" fill="#10182f" />
    <polygon points="94,36 80,30 85,48" fill="#10182f" />
    <polygon points="6,36 20,30 15,48" fill="#10182f" />
    <polygon points="76,88 84,72 68,75" fill="#10182f" />
    <polygon points="24,88 16,72 32,75" fill="#10182f" />
    <line x1="50" y1="32" x2="50" y2="16" stroke="#10182f" strokeWidth="4" strokeLinecap="round" />
    <line x1="65" y1="43" x2="80" y2="30" stroke="#10182f" strokeWidth="4" strokeLinecap="round" />
    <line x1="35" y1="43" x2="20" y2="30" stroke="#10182f" strokeWidth="4" strokeLinecap="round" />
    <line x1="59" y1="61" x2="68" y2="75" stroke="#10182f" strokeWidth="4" strokeLinecap="round" />
    <line x1="41" y1="61" x2="32" y2="75" stroke="#10182f" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="38" cy="24" rx="12" ry="7" fill="rgba(255,255,255,0.4)" transform="rotate(-30 38 24)" />
  </svg>
);

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

// Activity Top Navigation Bar matching FonikAbcGame
function ActivityTopBar({
  actNum,
  onBack,
  isMobile,
  badgeText = 'ASAS NOMBOR',
  badgeColor = '#ea580c'
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

// Light Pastel Blue Card Container matching FonikAbcGame
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

// Floating Star Popup "+1 Bintang! 🌟" Animation
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

export function NomborGame({ onClose, initialMode = 'bilang_0_10' }: NomborGameProps) {
  const [mode, setMode] = useState<NomborMode>(() => {
    return initialMode || (window as any).nomborMode || 'bilang_0_10';
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [currentView, setCurrentView] = useState<'lessons' | 'hub' | 'act1' | 'act2' | 'act3' | 'act4' | 'act5' | 'act6' | 'act7' | 'math_act1' | 'math_act2' | 'math_act3' | 'math_act4' | 'math_act5' | 'math_act6'>('lessons');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [screenMountKey, setScreenMountKey] = useState<number>(1);
  const [globalTerbaik, setGlobalTerbaik] = useState<boolean>(false);
  const [mathProgressTrigger, setMathProgressTrigger] = useState<number>(0);

  const isMathMode = mode === 'tambah_nombor' || mode === 'tolak_nombor';
  const mathMode = mode === 'tambah_nombor' ? ('tambah' as const) : ('tolak' as const);
  const baseMathProgressKey = mode === 'tambah_nombor' ? 'bunyikata_math_tambah_v1' : 'bunyikata_math_tolak_v1';
  
  const isUserAdminCheck = () => {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).modAdminAktif ||
      (window as any).isAdminMode ||
      localStorage.getItem('bunyiKataUserRole') === 'admin' ||
      (typeof document !== 'undefined' && (
        document.body?.classList?.contains('admin-mode') ||
        document.getElementById('teacher-banner-badge')?.innerText?.toUpperCase().includes('ADMIN')
      )) ||
      (window as any).currentUser?.peranan === 'admin'
    );
  };

  const getNomborStorageKey = (baseKey: string) => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      return `${baseKey}_trial_session`;
    }
    const studentName = typeof window !== 'undefined'
      ? ((window as any).namaMuridAktif || localStorage.getItem('muridAktif') || 'Murid')
      : 'Murid';
    return `${baseKey}_${studentName.toLowerCase().replace(/\s+/g, '_')}`;
  };

  const isTrialUser = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
  const mathStatus: boolean[] = (() => {
    if (isTrialUser) return [false, false, false, false, false, false];
    try {
      const saved = localStorage.getItem(getNomborStorageKey(baseMathProgressKey));
      return saved ? JSON.parse(saved) : [false, false, false, false, false, false];
    } catch (e) {
      return [false, false, false, false, false, false];
    }
  })();

  const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
  const currentDataset: NomborItem[] = 
    mode === 'tambah_nombor' 
      ? TAMBAH_NOMBOR_DATABASE 
      : mode === 'tolak_nombor' 
        ? TOLAK_NOMBOR_DATABASE 
        : mode === 'siri_nombor' 
          ? SIRI_NOMBOR_DATABASE 
          : ASAS_0_10_DATABASE;

  const currentItem = currentDataset[selectedItemIndex] || currentDataset[0];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to set-nombor-mode custom event
  useEffect(() => {
    const handleSetMode = (e: any) => {
      const targetMode = (e.detail?.mode || (window as any).nomborMode) as string;
      const targetFilter = e.detail?.filter || (window as any).nomborFilter;
      
      if (targetMode === 'tambah_nombor') {
        setMode('tambah_nombor');
      } else if (targetMode === 'tolak_nombor') {
        setMode('tolak_nombor');
      } else if (targetMode === 'siri_nombor' || targetFilter === 'siri_nombor') {
        setMode('siri_nombor');
      } else {
        setMode('bilang_0_10');
      }
      setSelectedItemIndex(0);
      setScreenMountKey(prev => prev + 1);
      setCurrentView('lessons');
    };

    window.addEventListener('set-nombor-mode', handleSetMode);
    return () => window.removeEventListener('set-nombor-mode', handleSetMode);
  }, []);

  const wasVisibleRef = useRef<boolean>(false);

  // Listen to set-nombor-mode custom event
  useEffect(() => {
    const handleSetNomborMode = (e: any) => {
      const targetMode = (e.detail?.mode || (window as any).nomborMode) as string;
      const targetFilter = (e.detail?.filter || (window as any).nomborFilter) as string;
      if (targetMode === 'tambah_nombor') {
        setMode('tambah_nombor');
      } else if (targetMode === 'tolak_nombor') {
        setMode('tolak_nombor');
      } else if (targetMode === 'siri_nombor' || targetFilter === 'siri_nombor') {
        setMode('siri_nombor');
      } else {
        setMode('bilang_0_10');
      }
      setSelectedItemIndex(0);
      setScreenMountKey(prev => prev + 1);
      setCurrentView('lessons');
    };

    window.addEventListener('set-nombor-mode', handleSetNomborMode);
    return () => window.removeEventListener('set-nombor-mode', handleSetNomborMode);
  }, []);

  // Detect when Nombor screen becomes visible from outside
  useEffect(() => {
    const el = document.getElementById('view-belajar-nombor');
    if (!el) return;

    const checkVisibility = () => {
      const isVisible = el.classList.contains('active');
      if (isVisible && !wasVisibleRef.current) {
        wasVisibleRef.current = true;
        const targetMode = (window as any).nomborMode as string;
        const targetFilter = (window as any).nomborFilter as string;
        if (targetMode === 'tambah_nombor') {
          setMode('tambah_nombor');
        } else if (targetMode === 'tolak_nombor') {
          setMode('tolak_nombor');
        } else if (targetMode === 'siri_nombor' || targetFilter === 'siri_nombor') {
          setMode('siri_nombor');
        } else {
          setMode('bilang_0_10');
        }
        setSelectedItemIndex(0);
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

  const [progress, setProgress] = useState<ProgressRecord>(() => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      const initial: ProgressRecord = {};
      currentDataset.forEach(item => {
        initial[item.id] = [false, false, false, false, false, false, false];
      });
      return initial;
    }
    try {
      const storageKey = getNomborStorageKey(currentConfig.progressKey);
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    const initial: ProgressRecord = {};
    currentDataset.forEach(item => {
      initial[item.id] = [false, false, false, false, false, false, false];
    });
    return initial;
  });

  // Reload progress when mode changes
  useEffect(() => {
    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    if (isTrial) {
      const initial: ProgressRecord = {};
      currentDataset.forEach(item => {
        initial[item.id] = [false, false, false, false, false, false, false];
      });
      setProgress(initial);
      return;
    }
    try {
      const storageKey = getNomborStorageKey(currentConfig.progressKey);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgress(JSON.parse(saved));
        return;
      }
    } catch (e) { }
    const initial: ProgressRecord = {};
    currentDataset.forEach(item => {
      initial[item.id] = [false, false, false, false, false, false, false];
    });
    setProgress(initial);
  }, [mode]);

  const saveActivityDone = (itemId: string, actIndex: number) => {
    setProgress(prev => {
      const curr = prev[itemId] ? [...prev[itemId]] : [false, false, false, false, false, false, false];
      curr[actIndex] = true;
      const updated = { ...prev, [itemId]: curr };
      try {
        const storageKey = getNomborStorageKey(currentConfig.progressKey);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    // Auto-update student profile stars immediately (+1 Bintang) - HANYA jika bukan trial
    if (!isTrial && typeof (window as any).tambahBintangGlobal === 'function') {
      (window as any).tambahBintangGlobal(`nombor_${mode}_${itemId}_act${actIndex + 1}`, 1);
    }
  };

  const nextTargetIndex = currentDataset.findIndex(p => {
    const status = progress[p.id];
    return !status || !status.every(Boolean);
  });
  const activeFocusIndex = nextTargetIndex === -1 ? 0 : nextTargetIndex;

  const speakText = (text: string, onEnd?: () => void) => {
    if ((window as any).sebutAudio) {
      (window as any).sebutAudio(text, onEnd);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ms-MY';
      utter.rate = 0.9;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
    } else if (onEnd) onEnd();
  };

  const playAudioOrSpeak = (src?: string, fallbackText?: string, onEnd?: () => void) => {
    if (src) {
      try {
        const audio = new Audio(src);
        if (onEnd) audio.onended = onEnd;
        audio.play().catch(err => {
          console.warn("Audio fallback to speech:", src, err);
          if (fallbackText) speakText(fallbackText, onEnd);
          else if (onEnd) onEnd();
        });
        return;
      } catch (e) {
        if (fallbackText) speakText(fallbackText, onEnd);
        else if (onEnd) onEnd();
        return;
      }
    }
    if (fallbackText) {
      speakText(fallbackText, onEnd);
    } else if (onEnd) {
      onEnd();
    }
  };

  const playSound = (src: string, onEnd?: () => void) => {
    playAudioOrSpeak(src, undefined, onEnd);
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

  const triggerTerbaik = (onComplete: () => void, durationMs = 1500) => {
    playSuccessCelebration();
    setGlobalTerbaik(true);
    setTimeout(() => {
      setGlobalTerbaik(false);
      onComplete();
    }, durationMs);
  };

  // -------------------------------------------------------------
  // ROUTER FOR MATH ACTIVITIES (Tambah / Tolak)
  // -------------------------------------------------------------
  const mathDataset = currentDataset as any[];

  const saveMathActivityDone = (actIndex: number) => {
    try {
      const storageKey = getNomborStorageKey(baseMathProgressKey);
      const saved = localStorage.getItem(storageKey);
      const arr: boolean[] = saved ? JSON.parse(saved) : [false, false, false, false, false, false];
      arr[actIndex] = true;
      localStorage.setItem(storageKey, JSON.stringify(arr));
    } catch (e) { }
    setMathProgressTrigger(prev => prev + 1);

    const isTrial = !isUserAdminCheck() && typeof window !== 'undefined' && ((window as any).userAccessLevel === 'trial' || (window as any).isGuestMode);
    // Auto-update student profile stars immediately (+1 Bintang) - HANYA jika bukan trial
    if (!isTrial && typeof (window as any).tambahBintangGlobal === 'function') {
      (window as any).tambahBintangGlobal(`math_${mathMode}_act${actIndex + 1}`, 1);
    }

    triggerTerbaik(() => { setCurrentView('lessons'); });
  };

  if (currentView === 'math_act1') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity1KenaliOperasi dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }
  if (currentView === 'math_act2') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity2KiraJawab dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }
  if (currentView === 'math_act3') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity3PilihJawapan dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }
  if (currentView === 'math_act4') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity4LengkapPersamaan dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }
  if (currentView === 'math_act5') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity5SusunPersamaan dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }
  if (currentView === 'math_act6') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <MathActivity6CabaranPantas dataset={mathDataset} mode={mathMode} isMobile={isMobile} onBack={() => setCurrentView('lessons')} onComplete={saveMathActivityDone} />
      </>
    );
  }

  // -------------------------------------------------------------
  // ROUTER FOR VIEWS
  // -------------------------------------------------------------
  if (currentView === 'act1') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity1PicturePuzzleNombor 
          item={currentItem} 
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 0)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => {
            if (currentItem.digit === '0' || mode === 'siri_nombor') {
              setCurrentView('act5');
            } else {
              setCurrentView('act2');
            }
          }} 
          onBack={() => setCurrentView('hub')} 
        />
      </>
    );
  }
  if (currentView === 'act2') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity2FlappyBirdNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 1)}
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
        <Activity3HearNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 2)}
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
        <Activity4BubblePopNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 3)}
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
        <Activity6SurihNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 4)}
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
        <Activity5MatchPartnersNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          onComplete={() => saveActivityDone(currentItem.id, 5)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('act7')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }
  if (currentView === 'act7') {
    return (
      <>
        <GlobalTerbaikPopup show={globalTerbaik} />
        <Activity7MatchAudioNombor
          item={currentItem}
          mode={mode}
          isMobile={isMobile}
          dataset={currentDataset}
          onComplete={() => saveActivityDone(currentItem.id, 6)}
          triggerTerbaik={triggerTerbaik}
          onNext={() => setCurrentView('lessons')}
          onBack={() => setCurrentView('hub')}
        />
      </>
    );
  }

  if (currentView === 'hub') {
    const isFourActsMode = currentItem.digit === '0' || mode === 'siri_nombor';
    const totalActs = isFourActsMode ? 4 : 7;
    const actStatus = progress[currentItem.id] || [false, false, false, false, false, false, false];

    const allActivities = [
      {
        id: 'act1',
        title: 'Teka Gambar Rahsia',
        desc: `Buka 9 jubin untuk mendedahkan gambar & perkataan ${currentItem.name}!`,
        action: () => setCurrentView('act1'),
        slotIndex: 0,
        bgImage: '/images/menu-kad/menu asas bunyi kata/teka gambar rahsia.png'
      },
      {
        id: 'act2',
        title: 'Burung Nombor',
        desc: `Terbangkan burung & patuk makanan bijirin ikut bilangan [${currentItem.digit}]!`,
        action: () => setCurrentView('act2'),
        slotIndex: 1,
        bgImage: '/images/menu-kad/menu asas bunyi kata/cabaran pantas.png'
      },
      {
        id: 'act3',
        title: `Kenali ${currentItem.digit}`,
        desc: `Tekan kad [?]. Dengar sebutan dan kenali bilangannya.`,
        action: () => setCurrentView('act3'),
        slotIndex: 2,
        bgImage: '/images/menu-kad/menu asas bunyi kata/dengar buyi nombor.png'
      },
      {
        id: 'act4',
        title: 'Letup Buih Nombor',
        desc: `Pecahkan buih terapung [?]. Dengar sebutannya.`,
        action: () => setCurrentView('act4'),
        slotIndex: 3,
        bgImage: '/images/menu-kad/menu asas bunyi kata/buih.png'
      },
      {
        id: 'act5',
        title: 'Surih Nombor & Perkataan',
        desc: `Surih simbol nombor [${currentItem.digit}] dan ejaan perkataan [${currentItem.name}].`,
        action: () => setCurrentView('act5'),
        slotIndex: 4,
        bgImage: '/images/menu-kad/menu asas bunyi kata/surih.png'
      },
      {
        id: 'act6',
        title: 'Pasangan Nombor',
        desc: `Tarik & cantumkan puzzle [${currentItem.digit}] dengan perkataan [${currentItem.name}].`,
        action: () => setCurrentView('act6'),
        slotIndex: 5,
        bgImage: '/images/menu-kad/menu asas bunyi kata/pasangan.png'
      },
      {
        id: 'act7',
        title: 'Padankan Nombor',
        desc: `Dengar sebutan audio & sambungkan garisan ke [${currentItem.digit}].`,
        action: () => setCurrentView('act7'),
        slotIndex: 6,
        bgImage: '/images/menu-kad/menu asas bunyi kata/pilih jawapan betul.png'
      }
    ];

    const activitiesList = (isFourActsMode
      ? allActivities.filter(a => a.id !== 'act2' && a.id !== 'act3' && a.id !== 'act4')
      : allActivities
    ).map((act, idx) => ({
      ...act,
      num: idx + 1
    }));

    const completedCount = isFourActsMode
      ? [actStatus[0], actStatus[4], actStatus[5], actStatus[6]].filter(Boolean).length
      : actStatus.filter(Boolean).length;

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
                textAlign: 'center',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                whiteSpace: 'nowrap'
              }}
            >
              {currentConfig.topBadge}
            </div>
          </div>

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
          >
            <i className="fa-solid fa-lightbulb"></i>
          </motion.button>
        </div>

        {/* White Hero Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
            borderRadius: isMobile ? '20px' : '28px',
            border: '3.5px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '16px 14px' : '20px 24px',
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto 20px auto',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
              <div
                style={{
                  minWidth: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  borderRadius: '14px',
                  background: currentConfig.topBadgeColor,
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2.5px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: isMobile ? (currentItem.digit.length > 3 ? '1.2rem' : '1.7rem') : (currentItem.digit.length > 3 ? '1.5rem' : '2.1rem'),
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  padding: '0 8px',
                  flexShrink: 0
                }}
              >
                {currentItem.digit}
              </div>

              <div>
                <h1 style={{
                  fontSize: isMobile ? '1.3rem' : '1.8rem',
                  fontWeight: 900,
                  color: '#1e293b',
                  margin: 0,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}>
                  {(mode === 'bilang_0_10' || mode === 'siri_nombor') ? `Nombor ${currentItem.digit}` : currentItem.digit}
                </h1>
                <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: isMobile ? '0.8rem' : '0.95rem', fontWeight: 600 }}>
                  Dengar dan latih sebutan bagi <strong>{currentItem.name}</strong>.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                playNavSound();
                if (currentItem.audio) playSound(currentItem.audio);
                else speakText(currentItem.name);
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
              title="Dengar Sebutan"
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
                width: `${(completedCount / totalActs) * 100}%`,
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
              <span>{completedCount} / {totalActs}</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Cards Grid */}
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
            const isDone = actStatus[act.slotIndex];
            const isTopFour = isFourActsMode ? index < 2 : index < 4;
            const cardBg = isTopFour ? '#e0f2fe' : '#ede9fe';
            const numberBg = isTopFour ? '#38bdf8' : '#a855f7';
            const numberTextColor = isTopFour ? '#0c4a6e' : '#ffffff';

            const nextIncomplete = activitiesList.find(a => !actStatus[a.slotIndex]);
            const isNextActiveAct = nextIncomplete ? nextIncomplete.num === act.num : false;

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

        {/* Guide Modal */}
        <AnimatePresence>
          {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} isMobile={isMobile} mode={mode} />}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LESSONS OVERVIEW SCREEN
  // -------------------------------------------------------------
  const isAsasMode = mode === 'bilang_0_10' || mode === 'siri_nombor';

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

      {/* Pill Tabs for Asas Nombor (ONLY Bilang 0-10 & Siri Nombor) */}
      {isAsasMode && (
        <motion.div
          key={`modeswitcher-${mode}-${screenMountKey}`}
          initial={{ scale: 0.85, opacity: 0, y: -8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.04 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '8px' : '14px',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto 16px auto',
            flexWrap: 'wrap',
            flexShrink: 0
          }}
        >
          {[
            { id: 'bilang_0_10' as NomborMode, label: 'Bilang 0 - 10', color: '#ec4899', icon: 'fa-layer-group' },
            { id: 'siri_nombor' as NomborMode, label: 'Siri Nombor 10 - 100', color: '#db2777', icon: 'fa-layer-group' }
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
                  setSelectedItemIndex(0);
                  setScreenMountKey(prev => prev + 1);
                  (window as any).nomborMode = tab.id;
                }}
                style={{
                  background: isActive ? tab.color : '#ffffff',
                  color: isActive ? '#ffffff' : '#1e293b',
                  border: '3px solid #1e293b',
                  boxShadow: isActive ? `0 3px 0 #1e293b, 0 4px 12px ${tab.color}40` : '0 2px 0 #1e293b',
                  borderRadius: '999px',
                  padding: isMobile ? '6px 14px' : '8px 20px',
                  fontSize: isMobile ? '0.85rem' : '0.98rem',
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
      )}

      {/* Main Banner */}
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
                  fill="url(#sparkle-grad-tl-nombor)"
                />
                <defs>
                  <linearGradient id="sparkle-grad-tl-nombor" x1="0%" y1="0%" x2="100%" y2="100%">
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
                  fill="url(#star-grad-tr-nombor)"
                  stroke="#1e293b"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="star-grad-tr-nombor" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff1f2" />
                    <stop offset="40%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {['1', '2', '3'].map((num, idx) => {
              const bgColors = ['#facc15', '#38bdf8', '#fb7185'];
              const borderShadowColors = ['#ca8a04', '#0284c7', '#e11d48'];
              const glowColors = [
                'rgba(250, 204, 21, 0.45)',
                'rgba(56, 189, 248, 0.45)',
                'rgba(251, 113, 133, 0.45)'
              ];

              return (
                <motion.div
                  key={num}
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
                    {num}
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

        {/* Progress Bar */}
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
            width: isMathMode
              ? `${(mathStatus.filter(Boolean).length / 6) * 100}%`
              : `${(currentDataset.filter(p => progress[p.id]?.every(Boolean)).length / currentDataset.length) * 100}%`,
            backgroundColor: currentConfig.bannerProgressColor,
            borderRadius: '999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </motion.div>

      {/* If Math Mode (Tambah / Tolak): Direct 6 Activities Grid */}
      {isMathMode ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, 1fr)',
          gap: isMobile ? '12px' : '20px',
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          paddingBottom: isMobile ? '20px' : '40px',
          boxSizing: 'border-box'
        }}>
          {[
            {
              num: 1,
              title: mode === 'tambah_nombor' ? 'Kenali Tambah' : 'Kenali Tolak',
              desc: `Pengenalan konsep ${mode === 'tambah_nombor' ? 'penambahan' : 'penolakan'} & sebutan audio persamaan.`,
              view: 'math_act1' as const,
              color: '#ec4899',
              bg: '#fdf2f8',
              bgImage: mode === 'tambah_nombor' ? '/images/menu-kad/menu asas bunyi kata/kenali tambah.png' : '/images/menu-kad/menu asas bunyi kata/kenali tolak.png'
            },
            {
              num: 2,
              title: 'Kira & Jawab',
              desc: 'Kira bilangan objek berwarna-warni dan tekan jawapan pada keypad.',
              view: 'math_act2' as const,
              color: '#10b981',
              bg: '#f0fdf4',
              bgImage: '/images/menu-kad/menu asas bunyi kata/kira dan jawab.png'
            },
            {
              num: 3,
              title: 'Pilih Jawapan Betul',
              desc: 'Pilih satu jawapan yang betul daripada 4 pilihan kad jawapan.',
              view: 'math_act3' as const,
              color: '#3b82f6',
              bg: '#eff6ff',
              bgImage: '/images/menu-kad/menu asas bunyi kata/pilih jawapan betul.png'
            },
            {
              num: 4,
              title: 'Lengkapkan Persamaan',
              desc: 'Cari nombor yang hilang dalam persamaan matematik.',
              view: 'math_act4' as const,
              color: '#f59e0b',
              bg: '#fefce8',
              bgImage: '/images/menu-kad/menu asas bunyi kata/dengar buyi nombor.png'
            },
            {
              num: 5,
              title: 'Susun Persamaan',
              desc: 'Tekan nombor dan simbol mengikut susunan persamaan yang lengkap.',
              view: 'math_act5' as const,
              color: '#8b5cf6',
              bg: '#f5f3ff',
              bgImage: mode === 'tambah_nombor' ? '/images/menu-kad/menu asas bunyi kata/susun persamaan tambah.png' : '/images/menu-kad/menu asas bunyi kata/susun persamaan tolak.png'
            },
            {
              num: 6,
              title: 'Cabaran Pantas',
              desc: 'Jawab soalan matematik sebanyak mungkin dalam masa 60 saat!',
              view: 'math_act6' as const,
              color: '#ef4444',
              bg: '#fef2f2',
              bgImage: '/images/menu-kad/menu asas bunyi kata/cabaran pantas.png'
            }
          ].map((act, index) => {
            const isDone = mathStatus[index];
            const nextIncompleteIdx = [0, 1, 2, 3, 4, 5].find(i => !mathStatus[i]);
            const isNextActiveAct = nextIncompleteIdx === index;

            return (
              <motion.div
                key={act.num}
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={
                  isNextActiveAct
                    ? {
                      opacity: 1,
                      y: 0,
                      scale: [1, 1.035, 1],
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
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playNavSound();
                  setCurrentView(act.view);
                }}
                style={{
                  background: act.bg,
                  borderRadius: isMobile ? '20px' : '24px',
                  border: isNextActiveAct ? '3.5px solid #f59e0b' : '3px solid #1e293b',
                  boxShadow: isMobile ? '0 2.5px 0 #1e293b' : '0 3px 0 #1e293b',
                  padding: isMobile ? '14px 12px' : '20px 18px',
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
                      width: isMobile ? '28px' : '34px',
                      height: isMobile ? '28px' : '34px',
                      borderRadius: '50%',
                      border: '2px solid #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      background: act.color,
                      color: '#ffffff',
                      boxShadow: '0 1.5px 0 #1e293b',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
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
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                    }}
                  >
                    <span>{isDone ? 'Belajar' : 'Mula'}</span>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Grid of Cards for Bilang 0-10 & Siri Nombor */
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
          {currentDataset.map((item, index) => {
            const actStatus = progress[item.id] || [false, false, false, false, false, false];
            const isCompleted = actStatus.every(Boolean);
            const isNextTarget = index === activeFocusIndex && !isCompleted;

            return (
              <motion.div
                key={`${item.id}-${mode}-${screenMountKey}`}
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
                  setSelectedItemIndex(index);
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
                {/* Shine Sweep Overlay */}
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

                {/* Checkmark Badge */}
                {isCompleted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: isMobile ? '6px' : '10px',
                      left: isMobile ? '6px' : '10px',
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

                {/* Gold Star Badge for Next Target */}
                {isNextTarget && (
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

                {/* Center Inner Colored Tile */}
                <div
                  style={{
                    width: item.digit.length >= 3 ? (isMobile ? '86px' : '122px') : (isMobile ? '65px' : '90px'),
                    height: isMobile ? '65px' : '90px',
                    borderRadius: isMobile ? '18px' : '22px',
                    backgroundColor: item.color,
                    border: '2.5px solid #1e293b',
                    boxShadow: '0 2px 0 #1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: isMobile 
                      ? (item.digit.length >= 3 ? '1.95rem' : '2.4rem') 
                      : (item.digit.length >= 3 ? '2.85rem' : '3.4rem'),
                    letterSpacing: item.digit.length >= 3 ? (isMobile ? '-2px' : '-4px') : 'normal',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    marginTop: '2px',
                    marginBottom: isMobile ? '8px' : '10px',
                    padding: item.digit.length >= 3 ? '0 8px' : '0 4px',
                    textAlign: 'center',
                    maxWidth: '96%',
                    boxSizing: 'border-box'
                  }}
                >
                  {item.digit}
                </div>

                {/* Category Pill Tag */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: isMobile ? '2px solid #1e293b' : '2px solid #1e293b',
                  boxShadow: '0 1.5px 0 #1e293b',
                  padding: isMobile ? '3px 6px' : '4px 10px',
                  marginBottom: isMobile ? '6px' : '10px',
                  fontSize: isMobile ? '0.75rem' : '0.9rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  letterSpacing: '0.2px',
                  display: 'flex',
                  gap: '2px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '94%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {(() => {
                    if (mode === 'siri_nombor') {
                      const words = item.name.split(' ');
                      return (
                        <>
                          <span style={{ color: '#1e293b' }}>{words[0]}</span>
                          {words.length > 1 && (
                            <span style={{ color: '#ef4444', marginLeft: '3px' }}>{words.slice(1).join(' ')}</span>
                          )}
                        </>
                      );
                    }

                    if (item.id === 'num_0' || item.name === 'sifar') {
                      return (
                        <>
                          <span style={{ color: '#1e293b' }}>si</span>
                          <span style={{ color: '#ef4444' }}>far</span>
                        </>
                      );
                    }

                    if (item.syllables && item.syllables.length > 0) {
                      return (
                        <>
                          {item.syllables.map((syl, sIdx) => (
                            <span key={sIdx} style={{ color: sIdx % 2 === 0 ? '#1e293b' : '#ef4444' }}>
                              {syl}
                            </span>
                          ))}
                        </>
                      );
                    }

                    return <span style={{ color: '#1e293b' }}>{item.name}</span>;
                  })()}
                </div>

                {/* 6 Activity Progress Dots */}
                <div style={{
                  display: 'flex',
                  gap: '3.5px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 'auto'
                }}>
                  {actStatus.map((done, dIdx) => (
                    <div
                      key={dIdx}
                      style={{
                        width: isMobile ? '7px' : '9px',
                        height: '5px',
                        borderRadius: '3px',
                        background: done ? '#10b981' : '#cbd5e1',
                        border: '1px solid #1e293b'
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} isMobile={isMobile} mode={mode} />}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// GUIDE MODAL COMPONENT
// -------------------------------------------------------------
function GuideModal({ onClose, isMobile, mode }: { onClose: () => void; isMobile: boolean; mode: NomborMode }) {
  const config = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
  const isMath = mode === 'tambah_nombor' || mode === 'tolak_nombor';

  const steps = isMath
    ? [
      { icon: 'fa-eye', color: '#ec4899', title: mode === 'tambah_nombor' ? '1. Kenali Tambah' : '1. Kenali Tolak', desc: 'Pengenalan konsep visual & audio persamaan' },
      { icon: 'fa-calculator', color: '#10b981', title: '2. Kira & Jawab', desc: 'Kira bilangan objek & tekan nombor jawapan' },
      { icon: 'fa-circle-check', color: '#3b82f6', title: '3. Pilih Jawapan', desc: 'Pilih satu jawapan tepat daripada 4 pilihan' },
      { icon: 'fa-square-check', color: '#f59e0b', title: '4. Lengkap Persamaan', desc: 'Cari nombor yang hilang dalam persamaan' },
      { icon: 'fa-arrow-down-1-9', color: '#8b5cf6', title: '5. Susun Persamaan', desc: 'Susun nombor & simbol ikut urutan betul' },
      { icon: 'fa-bolt', color: '#ef4444', title: '6. Cabaran Pantas', desc: 'Jawab soalan sebanyak mungkin dalam 60 saat' }
    ]
    : [
      { icon: 'fa-image', color: '#ec4899', title: '1. Teka Gambar', desc: 'Buka 9 jubin rahsia ilustrasi' },
      { icon: 'fa-dove', color: '#0ea5e9', title: '2. Burung Nombor', desc: 'Patuk makanan bijirin nombor' },
      { icon: 'fa-1', color: config.topBadgeColor, title: '3. Kenali Nombor', desc: 'Tekan kad [?] dan kira bilangan bola' },
      { icon: 'fa-soap', color: '#a855f7', title: '4. Letup Buih', desc: 'Pecahkan buih nombor mengikut bilangan' },
      { icon: 'fa-puzzle-piece', color: '#fb7185', title: '5. Pasangan Nombor', desc: 'Cantumkan puzzle nombor & perkataan' },
      { icon: 'fa-pen-nib', color: '#34d399', title: '6. Surih Nombor', desc: 'Surih simbol nombor & ejaan perkataan' },
      { icon: 'fa-bezier-curve', color: '#f59e0b', title: '7. Padankan Nombor', desc: 'Padankan audio sebutan ke kad sasaran' }
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

        <p style={{
          fontSize: isMobile ? '0.9rem' : '1.02rem',
          fontWeight: 800,
          color: '#1e293b',
          textAlign: 'center',
          lineHeight: '1.45',
          margin: '0 0 16px 0'
        }}>
          {config.subtitle}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: isMobile ? '8px' : '12px',
          width: '100%',
          marginBottom: '20px'
        }}>
          {steps.map((st, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '2.5px solid #1e293b',
                borderRadius: '16px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 2px 0 #1e293b'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: st.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                <i className={`fa-solid ${st.icon}`}></i>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1e293b' }}>{st.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{st.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            background: config.topBadgeColor,
            color: 'white',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            borderRadius: '999px',
            padding: '10px 32px',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
          }}
        >
          Faham & Mula Belajar!
        </motion.button>
      </motion.div>
    </div>
  );
}
