import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  playNavTone,
  playPopTone,
  playErrorTone,
  playTone
} from '../utils/coreAudio';

// ─── Types ───────────────────────────────────────────────────
export interface MathItem {
  id: string;
  digit: string;        // e.g. "1 + 2" or "10 - 3"
  name: string;         // e.g. "satu tambah dua sama dengan tiga"
  syllables: string[];  // e.g. ['1 + 2', '=', '3']
  audio: string;
  count: number;
  color: string;
  bgColor: string;
}

interface MathActivityProps {
  dataset: MathItem[];
  mode: 'tambah' | 'tolak';
  isMobile: boolean;
  onBack: () => void;
  onComplete: (actIndex: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────
function parseMathExpression(digit: string): { a: number; op: string; b: number; result: number } {
  const parts = digit.split(/\s+/);
  const a = parseInt(parts[0], 10);
  const op = parts[1]; // '+' or '-'
  const b = parseInt(parts[2], 10);
  const result = op === '+' ? a + b : a - b;
  return { a, op, b, result };
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateWrongAnswers(correct: number, count: number, min = 0, max = 20): number[] {
  const wrongs: number[] = [];
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3, correct - 3].filter(
    n => n >= min && n <= max && n !== correct
  );
  const shuffled = shuffleArray(candidates);
  for (let i = 0; i < count && i < shuffled.length; i++) {
    wrongs.push(shuffled[i]);
  }
  while (wrongs.length < count) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (r !== correct && !wrongs.includes(r)) wrongs.push(r);
  }
  return wrongs;
}

function playPopSound() {
  playPopTone();
}

function playSlashSound(pitchStep = 0) {
  const baseFreq = 520 + (pitchStep * 30);
  playTone({
    type: 'triangle',
    freqRamp: [
      [0, baseFreq],
      [0.08, baseFreq * 1.5],
    ],
    gainRamp: [
      [0, 0.35],
      [0.12, 0.001],
    ],
  });
}

function playAddPopSound(step = 0) {
  const baseFreq = 540 + (step * 40);
  playTone({
    type: 'sine',
    freqRamp: [
      [0, baseFreq],
      [0.08, baseFreq * 1.5],
    ],
    gainRamp: [
      [0, 0.3],
      [0.12, 0.001],
    ],
  });
}

function playErrorSound() {
  playErrorTone();
}

function playSuccessSound() {
  confetti({ particleCount: 65, spread: 75, origin: { y: 0.55 } });
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    playTone({
      type: 'triangle',
      delay: i * 0.08,
      freqRamp: [[0, freq]],
      gainRamp: [
        [0, 0.25],
        [0.3, 0.001],
      ],
    });
  });
}

function triggerPopConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#881337']
    });
  } catch (e) { }
}

function playNavSound() {
  // Kongsi sumber & throttle dengan handler klik global app-logic (elak double)
  if (typeof (window as any).playBubble === 'function') {
    (window as any).playBubble();
  } else {
    playNavTone();
  }
}

let activeMathAudio: HTMLAudioElement | null = null;
let lastMathAudioCallTime = 0;
let lastMathAudioText = '';

function fallbackTTS(text: string, onEnd?: () => void) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const clean = String(text).replace(/[-_]/g, ' ');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'ms-MY';
      utter.rate = 0.9;
      let finished = false;
      const safetyTimer = setTimeout(() => {
        done();
      }, 6000);
      const done = () => {
        if (finished) return;
        finished = true;
        clearTimeout(safetyTimer);
        if (onEnd) onEnd();
      };
      utter.onend = done;
      utter.onerror = done;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      if (onEnd) onEnd();
    }
  } else if (onEnd) {
    onEnd();
  }
}

function speakMathAudio(textOrItem: string | any, onEnd?: () => void) {
  const now = Date.now();
  const text = typeof textOrItem === 'string' ? textOrItem : (textOrItem?.name || textOrItem?.digit || '');
  const directSrc = typeof textOrItem === 'object' && textOrItem?.audio ? textOrItem.audio : null;

  // Prevent double audio firing within 600ms for same text, but preserve onEnd callback
  if (now - lastMathAudioCallTime < 600 && lastMathAudioText === text) {
    if (onEnd) {
      if (activeMathAudio) {
        const prevOnEnded = activeMathAudio.onended;
        activeMathAudio.onended = (ev) => {
          if (typeof prevOnEnded === 'function') prevOnEnded.call(activeMathAudio, ev);
          onEnd();
        };
      } else {
        onEnd();
      }
    }
    return;
  }
  lastMathAudioCallTime = now;
  lastMathAudioText = text;

  // Stop any ongoing audio/speech first
  if (activeMathAudio) {
    try {
      activeMathAudio.pause();
      activeMathAudio.currentTime = 0;
      activeMathAudio.onended = null;
      activeMathAudio.onerror = null;
    } catch (e) {}
    activeMathAudio = null;
  }
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  // Resolve audio path
  let audioPath = directSrc;
  if (!audioPath && typeof (window as any).getAudioPath === 'function') {
    audioPath = (window as any).getAudioPath(text);
  }

  if (audioPath) {
    let completed = false;
    let safetyTimer: any = null;
    const finish = () => {
      if (completed) return;
      completed = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      if (onEnd) onEnd();
    };

    try {
      const a = new Audio(encodeURI(audioPath));
      activeMathAudio = a;
      a.onended = finish;
      a.onerror = () => {
        if (safetyTimer) clearTimeout(safetyTimer);
        fallbackTTS(text, finish);
      };
      safetyTimer = setTimeout(finish, 8000);
      const p = a.play();
      if (p !== undefined) {
        p.catch(() => {
          if (safetyTimer) clearTimeout(safetyTimer);
          fallbackTTS(text, finish);
        });
      }
      return;
    } catch (e) {
      if (safetyTimer) clearTimeout(safetyTimer);
      fallbackTTS(text, finish);
      return;
    }
  }

  fallbackTTS(text, onEnd);
}

function speakText(text: string, onEnd?: () => void) {
  speakMathAudio(text, onEnd);
}

// ─── Blue Container Style Matching NomborGame ─────────────────
const blueCardContainerStyle = (isMobile: boolean): React.CSSProperties => ({
  background: '#e0f2fe',
  backgroundImage: 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 2px, transparent 2px)',
  backgroundSize: '24px 24px',
  borderRadius: isMobile ? '28px' : '36px',
  border: '3.5px solid #1e293b',
  boxShadow: '0 3.5px 0 #1e293b',
  padding: isMobile ? '16px 12px 20px 12px' : '32px 24px 24px 24px',
  width: '100%',
  maxWidth: '850px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: isMobile ? '440px' : '500px'
});

// ─── Shared TopBar Matching NomborGame ActivityTopBar ───────────
function MathTopBar({
  actNum,
  mode,
  isMobile,
  onBack,
  progress,
  total
}: {
  actNum: number;
  mode: 'tambah' | 'tolak';
  isMobile: boolean;
  onBack: () => void;
  progress?: number;
  total?: number;
}) {
  const badgeColor = '#881337';
  const badgeText = mode === 'tambah' ? 'Tambah Nombor' : 'Tolak Nombor';

  return (
    <div style={{
      width: '100%',
      maxWidth: '850px',
      margin: '0 auto 16px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 20,
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isMobile ? '44px 1fr auto' : '48px 1fr auto',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Butang Back */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playNavSound();
            onBack();
          }}
          style={{
            width: isMobile ? '44px' : '46px',
            height: isMobile ? '44px' : '46px',
            borderRadius: '50%',
            padding: 0,
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

        {/* Tajuk Tengah */}
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

        {/* Butang Aktiviti: A1, A2, etc */}
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

      {/* Bar Progress Nipis Di Bawah TopBar */}
      {progress !== undefined && total !== undefined && (
        <div style={{
          width: '100%',
          height: isMobile ? '10px' : '12px',
          backgroundColor: '#e2e8f0',
          borderRadius: '20px',
          border: '2px solid #1e293b',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              borderRadius: '20px'
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Visual Object Dots (Sama Warna Seragam) ─────────────────
function ObjectDots({ count, color = '#3b82f6', isMobile, animate: doAnimate }: { count: number; color?: string; isMobile: boolean; animate?: boolean }) {
  const size = isMobile ? 30 : 40;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px' : '8px', justifyContent: 'center', alignItems: 'center', maxWidth: isMobile ? '180px' : '240px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={doAnimate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: doAnimate ? i * 0.05 : 0, type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            border: '2.5px solid #1e293b',
            boxShadow: '0 2px 0 #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            fontWeight: 900,
            color: 'white',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
          }}
        >
          ●
        </motion.div>
      ))}
    </div>
  );
}

// ─── Number Keypad (Pilihan Oren #f59e0b dengan Teks Putih - Saiz Lebih Besar) ─────────
function NumberKeypad({ onPress, isMobile, disabled }: { onPress: (n: number) => void; isMobile: boolean; disabled?: boolean }) {
  const nums = Array.from({ length: 11 }, (_, i) => i);
  const btnSize = isMobile ? 54 : 76;
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '6px' : '12px',
      justifyContent: 'center',
      maxWidth: isMobile ? '370px' : '560px',
      margin: '0 auto'
    }}>
      {nums.map(n => (
        <motion.button
          key={n}
          whileHover={disabled ? undefined : { scale: 1.12, y: -3 }}
          whileTap={disabled ? undefined : { scale: 0.9 }}
          onClick={() => { if (!disabled) { playPopSound(); onPress(n); } }}
          disabled={disabled}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            background: '#f59e0b', // Warna oren seperti mana warna oren ayat matematik
            border: isMobile ? '3px solid #1e293b' : '3.5px solid #1e293b',
            boxShadow: '0 3.5px 0 #1e293b',
            color: '#ffffff',
            fontSize: isMobile ? '1.55rem' : '2.2rem',
            fontWeight: 900,
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
}

// ─── Equation Display (Nombor Oren #f59e0b, Tanda Soal Putih #ffffff) ───
function EquationDisplay({ a, op, b, result, showResult, isMobile, highlight, large }: {
  a: number | string; op: string; b: number | string; result: number | string;
  showResult: boolean; isMobile: boolean; highlight?: 'a' | 'b' | 'result';
  large?: boolean;
}) {
  const boxSize = large ? (isMobile ? 80 : 126) : (isMobile ? 50 : 68);
  const fontSize = large ? (isMobile ? '2.6rem' : '4.2rem') : (isMobile ? '1.5rem' : '2.2rem');
  const opSize = large ? (isMobile ? '2.1rem' : '3.3rem') : (isMobile ? '1.3rem' : '1.8rem');
  const borderRadius = large ? (isMobile ? '18px' : '26px') : (isMobile ? '12px' : '16px');
  const gapSize = large ? (isMobile ? '10px' : '22px') : (isMobile ? '8px' : '12px');

  const renderBox = (val: number | string, type: 'a' | 'b' | 'result') => {
    // Kotak hanya dianggap tanda soal jika highlight aktif untuk kotak ini dan belum showResult,
    // atau jika tiada highlight dinyatakan, hanya result yang disembunyikan jika !showResult (Aktiviti 1).
    const isBlank = (highlight ? highlight === type : type === 'result') && !showResult;
    const isQuestionMark = isBlank || val === '?';

    return (
      <motion.div
        key={type}
        animate={isBlank ? { boxShadow: ['0 3.5px 0 #1e293b, 0 0 0px #fbbf24', '0 3.5px 0 #1e293b, 0 0 16px #fbbf24', '0 3.5px 0 #1e293b, 0 0 0px #fbbf24'] } : {}}
        transition={isBlank ? { duration: 1.5, repeat: Infinity } : {}}
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius,
          background: isQuestionMark ? '#ffffff' : '#f59e0b', // Tanda soal putih, nombor oren
          border: '3.5px solid #1e293b',
          boxShadow: '0 3.5px 0 #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize,
          fontWeight: 900,
          color: isQuestionMark ? '#1e293b' : '#ffffff',
          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
        }}
      >
        {isQuestionMark ? '?' : val}
      </motion.div>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gapSize, justifyContent: 'center' }}>
      {renderBox(a, 'a')}
      <span style={{ fontSize: opSize, fontWeight: 900, color: '#1e293b', fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>{op}</span>
      {renderBox(b, 'b')}
      <span style={{ fontSize: opSize, fontWeight: 900, color: '#1e293b', fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>=</span>
      {renderBox(result, 'result')}
    </div>
  );
}

// ─── Sub-Component: Badge Penunjuk Soalan 1 / 11 (Center di Mobile, Kanan di Desktop) ───
function QuestionCounterBadge({ current, total, isMobile }: { current: number; total: number; isMobile: boolean }) {
  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '12px',
        zIndex: 10
      }}>
        <div style={{
          background: '#ffffff',
          border: '2px solid #1e293b',
          borderRadius: '12px',
          boxShadow: '0 1.5px 0 #1e293b',
          padding: '4px 14px',
          color: '#1e293b',
          fontSize: '0.88rem',
          fontWeight: 900,
          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
        }}>
          {current} / {total}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '18px',
      right: '18px',
      background: '#ffffff',
      border: '2px solid #1e293b',
      borderRadius: '12px',
      boxShadow: '0 1.5px 0 #1e293b',
      padding: '5px 14px',
      color: '#1e293b',
      fontSize: '0.95rem',
      fontWeight: 900,
      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
      zIndex: 10
    }}>
      {current} / {total}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// SIMULASI TOLAK KAEDAH POTONG (POPUP MODAL)
// ═══════════════════════════════════════════════════════════════
interface SimulasiTolakPotongModalProps {
  a: number;
  b: number;
  result: number;
  isMobile: boolean;
  onClose: () => void;
}

function SimulasiTolakPotongModal({ a, b, result, isMobile, onClose }: SimulasiTolakPotongModalProps) {
  const [cutCount, setCutCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play animation timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (cutCount >= b) {
      setIsAutoPlaying(false);
      playSuccessSound();
      return;
    }

    const timer = setTimeout(() => {
      setCutCount(prev => {
        const next = prev + 1;
        playSlashSound(next);
        return next;
      });
    }, 650);

    return () => clearTimeout(timer);
  }, [cutCount, isAutoPlaying, b]);

  const handleRestart = () => {
    setCutCount(0);
    setIsAutoPlaying(true);
    playNavSound();
  };

  const isComplete = cutCount >= b;
  const remainingCount = a - cutCount;
  const dotSize = isMobile ? 36 : 46;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '20px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 25 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
          borderRadius: isMobile ? '24px' : '28px',
          border: '3.5px solid #1e293b',
          boxShadow: '0 8px 0 #1e293b',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '26px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '16px' : '20px',
          position: 'relative'
        }}
      >
        {/* Header Row: Centered Title Badge & Red Square Close Button (3-column balanced flex) */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Spacer kiri untuk seimbangkan tajuk di tengah */}
          <div style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px', flexShrink: 0 }} />

          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: '2.5px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              borderRadius: '16px',
              color: 'white',
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              fontWeight: 900,
              padding: isMobile ? '6px 18px' : '8px 24px',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center'
            }}
          >
            <i className="fa-solid fa-scissors" style={{ transform: 'rotate(-25deg)' }}></i>
            Kaedah Potong
          </div>

          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            aria-label="Tutup"
            style={{
              width: isMobile ? '38px' : '42px',
              height: isMobile ? '38px' : '42px',
              flexShrink: 0,
              borderRadius: '12px',
              background: '#ef4444',
              border: '2.5px solid #1e293b',
              boxShadow: '0 3px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.15rem' : '1.3rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </motion.button>
        </div>

        {/* Persamaan Matematik (Kotak Bersih Tanpa Ayat Subtitle) */}
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: '2.5px solid #1e293b',
            boxShadow: '0 2.5px 0 #1e293b',
            borderRadius: '18px',
            padding: isMobile ? '12px 14px' : '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '1.8rem' : '2.3rem',
              fontWeight: 900,
              color: '#1e293b',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center'
            }}
          >
            {a} - {b} = {isComplete ? <span style={{ color: '#16a34a' }}>{result}</span> : '?'}
          </div>
        </div>

        {/* Visual Objek Persis Seperti di Atas Persamaan (ObjectDots dengan Titik Putih di Tengah) */}
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: '2.5px solid #1e293b',
            boxShadow: '0 2px 0 #1e293b',
            borderRadius: '20px',
            padding: isMobile ? '16px 10px' : '22px 16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '10px' : '12px',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: isMobile ? '110px' : '135px'
          }}
        >
          {Array.from({ length: a }).map((_, i) => {
            const isCut = i < cutCount;
            const isRemaining = isComplete && i >= b;

            return (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isRemaining ? [1, 1.12, 1] : isCut ? 0.95 : 1,
                  opacity: isCut ? 0.42 : 1
                }}
                transition={{
                  scale: isRemaining ? { repeat: Infinity, duration: 1.5 } : { type: 'spring', stiffness: 350, damping: 15 }
                }}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  background: isRemaining ? '#22c55e' : '#3b82f6',
                  border: isRemaining ? '2.5px solid #15803d' : '2.5px solid #1e293b',
                  boxShadow: isRemaining ? '0 0 12px rgba(34, 197, 94, 0.7)' : '0 2px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  userSelect: 'none',
                  fontSize: isMobile ? '0.95rem' : '1.15rem',
                  fontWeight: 900,
                  color: 'white',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                {/* Titik Putih Di Tengah (Persis Seperti ObjectDots, Tiada Nombor/Simbol Lain) */}
                <span style={{ color: 'white', pointerEvents: 'none' }}>●</span>

                {/* Palang Merah Potong Pertama (Slash \) */}
                <AnimatePresence>
                  {isCut && (
                    <motion.div
                      key={`slash_${i}`}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: -45 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      style={{
                        position: 'absolute',
                        width: '135%',
                        height: isMobile ? '5px' : '6px',
                        background: '#dc2626',
                        border: '1px solid #7f1d1d',
                        borderRadius: '4px',
                        boxShadow: '0 0 4px rgba(220, 38, 38, 0.8)',
                        zIndex: 10
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Palang Merah Potong Kedua (Bentuk X Pangkah Sempurna) */}
                <AnimatePresence>
                  {isCut && (
                    <motion.div
                      key={`slash_cross_${i}`}
                      initial={{ scale: 0, rotate: 45 }}
                      animate={{ scale: 1, rotate: 45 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.04 }}
                      style={{
                        position: 'absolute',
                        width: '135%',
                        height: isMobile ? '5px' : '6px',
                        background: '#dc2626',
                        border: '1px solid #7f1d1d',
                        borderRadius: '4px',
                        boxShadow: '0 0 4px rgba(220, 38, 38, 0.8)',
                        zIndex: 10
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Kaunter & Status Pemotongan Menggunakan Icon Moden (Bukan Emoji) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isComplete ? '#dcfce7' : '#eff6ff',
            border: `2.5px solid ${isComplete ? '#16a34a' : '#3b82f6'}`,
            borderRadius: '16px',
            padding: isMobile ? '10px 14px' : '12px 18px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isComplete ? (
              <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: isMobile ? '1.25rem' : '1.45rem' }}></i>
            ) : (
              <i className="fa-solid fa-scissors" style={{ color: '#2563eb', fontSize: isMobile ? '1.25rem' : '1.45rem', transform: 'rotate(-25deg)' }}></i>
            )}
            <div style={{ fontSize: isMobile ? '0.95rem' : '1.08rem', fontWeight: 800, color: isComplete ? '#15803d' : '#1e40af', fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>
              {isComplete ? (
                <span>Baki yang tinggal = <strong>{result}</strong></span>
              ) : (
                <span>Dipotong: <strong>{cutCount}</strong> / {b}</span>
              )}
            </div>
          </div>

          <div
            style={{
              fontSize: isMobile ? '0.88rem' : '0.95rem',
              fontWeight: 800,
              color: isComplete ? '#166534' : '#64748b',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
            }}
          >
            {isComplete ? (
              <span style={{ background: '#22c55e', border: '2px solid #15803d', color: 'white', padding: '4px 12px', borderRadius: '10px' }}>
                Baki {result}
              </span>
            ) : (
              <span>Tinggal {remainingCount}</span>
            )}
          </div>
        </div>

        {/* Butang Kawalan: Icon Sahaja (Saiz Sama Persis, Ulang Semula & Faham/Tutup Warna Hijau Profil) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: isMobile ? '16px' : '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '4px'
          }}
        >
          {/* Butang Ulang Semula (Icon Sahaja) */}
          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={handleRestart}
            style={{
              width: isMobile ? '54px' : '60px',
              height: isMobile ? '54px' : '60px',
              minWidth: isMobile ? '54px' : '60px',
              maxWidth: isMobile ? '54px' : '60px',
              minHeight: isMobile ? '54px' : '60px',
              maxHeight: isMobile ? '54px' : '60px',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '16px',
              background: '#f59e0b',
              border: '3px solid #1e293b',
              boxShadow: '0 3.5px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.4rem' : '1.55rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Ulang Semula"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </motion.button>

          {/* Butang Faham & Tutup (Icon Sahaja - Warna Hijau Profil Murid #22c55e) */}
          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            style={{
              width: isMobile ? '54px' : '60px',
              height: isMobile ? '54px' : '60px',
              minWidth: isMobile ? '54px' : '60px',
              maxWidth: isMobile ? '54px' : '60px',
              minHeight: isMobile ? '54px' : '60px',
              maxHeight: isMobile ? '54px' : '60px',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '16px',
              background: '#22c55e',
              border: '3px solid #1e293b',
              boxShadow: '0 3.5px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.4rem' : '1.55rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Faham & Tutup"
          >
            <i className="fa-solid fa-check"></i>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIMULASI TAMBAH KAEDAH TAMBAH (POPUP MODAL)
// ═══════════════════════════════════════════════════════════════
interface SimulasiTambahModalProps {
  a: number;
  b: number;
  result: number;
  isMobile: boolean;
  onClose: () => void;
}

function SimulasiTambahModal({ a, b, result, isMobile, onClose }: SimulasiTambahModalProps) {
  const [addedCount, setAddedCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play animation timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (addedCount >= b) {
      setIsAutoPlaying(false);
      playSuccessSound();
      return;
    }

    const timer = setTimeout(() => {
      setAddedCount(prev => {
        const next = prev + 1;
        playAddPopSound(next);
        return next;
      });
    }, 650);

    return () => clearTimeout(timer);
  }, [addedCount, isAutoPlaying, b]);

  const handleRestart = () => {
    setAddedCount(0);
    setIsAutoPlaying(true);
    playNavSound();
  };

  const isComplete = addedCount >= b;
  const dotSize = isMobile ? 36 : 46;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
          borderRadius: isMobile ? '24px' : '28px',
          border: '3.5px solid #1e293b',
          boxShadow: '0 8px 0 #1e293b',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '26px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '16px' : '20px',
          position: 'relative'
        }}
      >
        {/* Header Row: Centered Title Badge & Red Square Close Button (3-column balanced flex) */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Spacer kiri untuk seimbangkan tajuk di tengah */}
          <div style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px', flexShrink: 0 }} />

          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: '2.5px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              borderRadius: '16px',
              color: 'white',
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              fontWeight: 900,
              padding: isMobile ? '6px 18px' : '8px 24px',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center'
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Kaedah Tambah
          </div>

          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            aria-label="Tutup"
            style={{
              width: isMobile ? '38px' : '42px',
              height: isMobile ? '38px' : '42px',
              flexShrink: 0,
              borderRadius: '12px',
              background: '#ef4444',
              border: '2.5px solid #1e293b',
              boxShadow: '0 3px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.15rem' : '1.3rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </motion.button>
        </div>

        {/* Persamaan Matematik (Kotak Bersih) */}
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: '2.5px solid #1e293b',
            boxShadow: '0 2.5px 0 #1e293b',
            borderRadius: '18px',
            padding: isMobile ? '12px 14px' : '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '1.8rem' : '2.3rem',
              fontWeight: 900,
              color: '#1e293b',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center'
            }}
          >
            {a} + {b} = {isComplete ? <span style={{ color: '#16a34a' }}>{result}</span> : '?'}
          </div>
        </div>

        {/* Visual Objek Persis ObjectDots */}
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: '2.5px solid #1e293b',
            boxShadow: '0 2px 0 #1e293b',
            borderRadius: '20px',
            padding: isMobile ? '16px 10px' : '22px 16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '10px' : '12px',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: isMobile ? '110px' : '135px'
          }}
        >
          {/* Objek Asal (a) - Sentiasa warna Biru #3b82f6 */}
          {Array.from({ length: a }).map((_, i) => (
            <motion.div
              key={`base-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isComplete ? [1, 1.08, 1] : 1,
                opacity: 1
              }}
              transition={{
                scale: isComplete ? { duration: 0.6 } : { type: 'spring', stiffness: 350, damping: 15 }
              }}
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                borderRadius: '50%',
                background: '#3b82f6',
                border: '3px solid #1d4ed8',
                boxShadow: isComplete ? '0 0 12px rgba(59, 130, 246, 0.5), 0 3px 0 #1e293b' : '0 3px 0 #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: isMobile ? '8px' : '10px',
                  height: isMobile ? '8px' : '10px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              />
            </motion.div>
          ))}

          {/* Objek Tambahan (b) - Mula dengan warna berbeza (#f59e0b), apabila sudah berjaya ditambah bertukar jadi warna sama (#3b82f6) */}
          {Array.from({ length: b }).map((_, i) => {
            const isAdded = i < addedCount;
            if (!isAdded) return null;

            // Jika sudah berjaya ditambah semua (isComplete), tukar jadi warna sama iaitu #3b82f6
            const isSameColor = isComplete;
            const dotBg = isSameColor ? '#3b82f6' : '#f59e0b';
            const dotBorder = isSameColor ? '#1d4ed8' : '#b45309';
            const dotShadow = isSameColor
              ? '0 0 12px rgba(59, 130, 246, 0.5), 0 3px 0 #1e293b'
              : '0 0 12px rgba(245, 158, 11, 0.6), 0 3px 0 #1e293b';

            return (
              <motion.div
                key={`added-${i}`}
                initial={{ scale: 0, opacity: 0, y: -16 }}
                animate={{
                  scale: isComplete ? [1, 1.15, 1] : 1,
                  opacity: 1,
                  y: 0,
                  backgroundColor: dotBg,
                  borderColor: dotBorder
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 18,
                  backgroundColor: { duration: 0.5 },
                  borderColor: { duration: 0.5 }
                }}
                style={{
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  borderRadius: '50%',
                  background: dotBg,
                  border: `3px solid ${dotBorder}`,
                  boxShadow: dotShadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: isMobile ? '8px' : '10px',
                    height: isMobile ? '8px' : '10px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bar Status Kemajuan (Icon Moden, Tiada Emoji) */}
        <div
          style={{
            width: '100%',
            background: isComplete ? '#dcfce7' : '#fef3c7',
            border: `2.5px solid ${isComplete ? '#22c55e' : '#f59e0b'}`,
            borderRadius: '16px',
            padding: isMobile ? '10px 14px' : '12px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i
              className={isComplete ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-plus'}
              style={{
                color: isComplete ? '#16a34a' : '#d97706',
                fontSize: isMobile ? '1.2rem' : '1.35rem'
              }}
            ></i>
            <span
              style={{
                fontSize: isMobile ? '0.95rem' : '1.05rem',
                fontWeight: 800,
                color: isComplete ? '#14532d' : '#92400e',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}
            >
              {isComplete ? `Jumlah keseluruhan = ${result}` : `Menambah ${addedCount} daripada ${b}`}
            </span>
          </div>

          <div
            style={{
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              fontWeight: 800,
              color: isComplete ? '#166534' : '#b45309',
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
            }}
          >
            {isComplete ? (
              <span style={{ background: '#22c55e', border: '2px solid #15803d', color: 'white', padding: '4px 12px', borderRadius: '10px' }}>
                Jumlah {result}
              </span>
            ) : (
              <span style={{ background: '#f59e0b', border: '2px solid #b45309', color: 'white', padding: '4px 12px', borderRadius: '10px' }}>
                + {addedCount}
              </span>
            )}
          </div>
        </div>

        {/* Butang Kawalan: Icon Sahaja (Saiz Sama Persis, Ulang Semula & Faham/Tutup Warna Hijau Profil) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: isMobile ? '16px' : '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '4px'
          }}
        >
          {/* Butang Ulang Semula (Icon Sahaja) */}
          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={handleRestart}
            style={{
              width: isMobile ? '54px' : '60px',
              height: isMobile ? '54px' : '60px',
              minWidth: isMobile ? '54px' : '60px',
              maxWidth: isMobile ? '54px' : '60px',
              minHeight: isMobile ? '54px' : '60px',
              maxHeight: isMobile ? '54px' : '60px',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '16px',
              background: '#f59e0b',
              border: '3px solid #1e293b',
              boxShadow: '0 3.5px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.4rem' : '1.55rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Ulang Semula"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </motion.button>

          {/* Butang Faham & Tutup (Icon Sahaja - Warna Hijau Profil Murid #22c55e) */}
          <motion.button
            whileHover={!isMobile ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            style={{
              width: isMobile ? '54px' : '60px',
              height: isMobile ? '54px' : '60px',
              minWidth: isMobile ? '54px' : '60px',
              maxWidth: isMobile ? '54px' : '60px',
              minHeight: isMobile ? '54px' : '60px',
              maxHeight: isMobile ? '54px' : '60px',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '16px',
              background: '#22c55e',
              border: '3px solid #1e293b',
              boxShadow: '0 3.5px 0 #1e293b',
              color: 'white',
              fontSize: isMobile ? '1.4rem' : '1.55rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box'
            }}
            title="Faham & Tutup"
          >
            <i className="fa-solid fa-check"></i>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AKTIVITI 1: KENALI OPERASI
// ═══════════════════════════════════════════════════════════════
export function MathActivity1KenaliOperasi({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showCaraModal, setShowCaraModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const showCaraModalRef = useRef(false);
  const currentIdxRef = useRef(0);
  currentIdxRef.current = currentIdx;

  useEffect(() => {
    showCaraModalRef.current = showCaraModal;
  }, [showCaraModal]);

  const handleCloseCaraModal = () => {
    setShowCaraModal(false);
    if (revealed && !isAudioPlaying) {
      setTimeout(() => {
        if (currentIdxRef.current < itemsRef.current.length - 1) {
          setRevealed(false);
          setCurrentIdx(prev => prev + 1);
          playNavSound();
        } else {
          playSuccessSound();
          onComplete(0);
        }
      }, 500);
    }
  };

  // Tapis keluar sebarang penambahan atau penolakan yang melibatkan sifar
  const [items] = useState(() => {
    const filtered = dataset.filter(item => {
      const { a, b, result } = parseMathExpression(item.digit);
      return a > 0 && b > 0 && result > 0;
    });
    return (filtered.length > 0 ? filtered : dataset).slice(0, 11);
  });
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const item = items[currentIdx];
  const { a, op, b, result } = parseMathExpression(item.digit);

  const handleReveal = () => {
    if (revealed || isAudioPlaying) return;
    setRevealed(true);
    playPopSound();
    triggerPopConfetti();
    setIsAudioPlaying(true);
    speakMathAudio(item, () => {
      setIsAudioPlaying(false);
      // Wait a short moment after audio finishes so the child sees the result clearly, then advance!
      setTimeout(() => {
        if (!showCaraModalRef.current) {
          if (currentIdxRef.current < itemsRef.current.length - 1) {
            setRevealed(false);
            setCurrentIdx(prev => prev + 1);
            playNavSound();
          } else {
            playSuccessSound();
            onComplete(0);
          }
        }
      }, 700);
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar
        actNum={1}
        mode={mode}
        isMobile={isMobile}
        onBack={onBack}
        progress={currentIdx}
        total={items.length}
      />

      <div style={blueCardContainerStyle(isMobile)}>
        {/* Penunjuk 1 / 11 di Sudut Kanan / Center di Mobile */}
        <QuestionCounterBadge current={currentIdx + 1} total={items.length} isMobile={isMobile} />

        <motion.div
          key={currentIdx}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '16px' : '28px',
            marginTop: isMobile ? '4px' : '48px'
          }}
        >
          {/* Kotak Putih Background untuk Persamaan Visual */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '28px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '18px 12px' : '26px 24px',
            width: '100%',
            maxWidth: '680px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '18px' : '24px',
            boxSizing: 'border-box'
          }}>
            {/* Objek Visual Dots (Warna Biru #3b82f6 seperti sebelum ini - Saiz Dikekalkan) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <ObjectDots count={a} color="#3b82f6" isMobile={isMobile} animate />
              <div style={{
                fontSize: isMobile ? '2rem' : '2.8rem',
                fontWeight: 900,
                color: '#1e293b',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>
                {op}
              </div>
              <ObjectDots count={b} color="#3b82f6" isMobile={isMobile} animate />
            </div>

            {/* Paparan Persamaan (Dibesarkan di Laptop dan Mobile View) */}
            <EquationDisplay a={a} op={op} b={b} result={result} showResult={revealed} isMobile={isMobile} large />
          </div>

          {/* Butang Lihat Jawapan & Lihat Cara */}
          {!revealed ? (
            <div style={{ display: 'flex', gap: isMobile ? '10px' : '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleReveal}
                style={{
                  padding: isMobile ? '12px 22px' : '14px 34px',
                  borderRadius: '18px',
                  background: '#f59e0b',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3.5px 0 #1e293b',
                  color: 'white',
                  fontSize: isMobile ? '1.05rem' : '1.25rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                <i className="fa-solid fa-eye" style={{ marginRight: '8px' }}></i>
                Lihat Jawapan
              </motion.button>

              {/* Butang Lihat Cara untuk Tolak atau Tambah */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowCaraModal(true)}
                style={{
                  padding: isMobile ? '12px 22px' : '14px 34px',
                  borderRadius: '18px',
                  background: '#6366f1',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3.5px 0 #1e293b',
                  color: 'white',
                  fontSize: isMobile ? '1.05rem' : '1.25rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i
                  className={`fa-solid ${op === '-' || mode === 'tolak' ? 'fa-scissors' : 'fa-plus'}`}
                  style={op === '-' || mode === 'tolak' ? { transform: 'rotate(-25deg)' } : undefined}
                ></i>
                Lihat Cara
              </motion.button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: isMobile ? '10px' : '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Butang Lihat Cara */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowCaraModal(true)}
                style={{
                  padding: isMobile ? '12px 22px' : '14px 30px',
                  borderRadius: '18px',
                  background: '#6366f1',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3.5px 0 #1e293b',
                  color: 'white',
                  fontSize: isMobile ? '1.02rem' : '1.18rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i
                  className={`fa-solid ${op === '-' || mode === 'tolak' ? 'fa-scissors' : 'fa-plus'}`}
                  style={op === '-' || mode === 'tolak' ? { transform: 'rotate(-25deg)' } : undefined}
                ></i>
                Lihat Cara
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Popup Simulasi Kaedah Potong atau Kaedah Tambah */}
      <AnimatePresence>
        {showCaraModal && (
          (op === '-' || mode === 'tolak') ? (
            <SimulasiTolakPotongModal
              a={a}
              b={b}
              result={result}
              isMobile={isMobile}
              onClose={() => setShowCaraModal(false)}
            />
          ) : (
            <SimulasiTambahModal
              a={a}
              b={b}
              result={result}
              isMobile={isMobile}
              onClose={() => setShowCaraModal(false)}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AKTIVITI 2: KIRA & JAWAB
// ═══════════════════════════════════════════════════════════════
export function MathActivity2KiraJawab({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  // Tapis keluar sebarang penambahan atau penolakan yang melibatkan sifar
  const [questions] = useState(() => {
    const filtered = dataset.filter(item => {
      const { a, b, result } = parseMathExpression(item.digit);
      return a > 0 && b > 0 && result > 0;
    });
    return shuffleArray(filtered.length > 0 ? filtered : dataset).slice(0, 10);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shaking, setShaking] = useState(false);
  const answeringRef = useRef(false);

  const item = questions[currentIdx];
  const { a, op, b, result } = parseMathExpression(item.digit);

  const handleAnswer = (n: number) => {
    if (answeringRef.current || feedback) return;
    if (n === result) {
      answeringRef.current = true;
      setFeedback('correct');
      playPopSound();
      triggerPopConfetti();
      speakMathAudio(item, () => {
        setTimeout(() => {
          answeringRef.current = false;
          if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setFeedback(null);
          } else {
            playSuccessSound();
            onComplete(1);
          }
        }, 500);
      });
    } else {
      setFeedback('wrong');
      setShaking(true);
      playErrorSound();
      setTimeout(() => {
        setFeedback(null);
        setShaking(false);
      }, 800);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar
        actNum={2}
        mode={mode}
        isMobile={isMobile}
        onBack={onBack}
        progress={currentIdx}
        total={questions.length}
      />

      <div style={blueCardContainerStyle(isMobile)}>
        {/* Penunjuk Soalan 1 / 10 (Center di Mobile, Kanan di Desktop) */}
        <QuestionCounterBadge current={currentIdx + 1} total={questions.length} isMobile={isMobile} />

        <motion.div
          key={currentIdx}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            width: '100%',
            maxWidth: '660px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '16px' : '22px',
            marginTop: isMobile ? '4px' : '15px'
          }}
        >
          {/* Objek Visual Sama Warna di dalam Kotak Putih */}
          <motion.div
            animate={shaking ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              background: '#ffffff',
              borderRadius: isMobile ? '20px' : '26px',
              border: '3px solid #1e293b',
              boxShadow: '0 3px 0 #1e293b',
              padding: isMobile ? '20px 14px' : '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '14px' : '18px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Objek visual kedua-duanya guna warna biru #3b82f6 */}
              <ObjectDots count={a} color="#3b82f6" isMobile={isMobile} animate />
              <span style={{
                fontSize: isMobile ? '1.8rem' : '2.4rem',
                fontWeight: 900,
                color: '#1e293b',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>
                {op}
              </span>
              <ObjectDots count={b} color="#3b82f6" isMobile={isMobile} animate />
              <span style={{
                fontSize: isMobile ? '1.8rem' : '2.4rem',
                fontWeight: 900,
                color: '#1e293b',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>
                =
              </span>
              {/* Kotak Jawapan: Tanda Soal Putih #ffffff dengan Glow Animation, Bila Betul Tukar Oren #f59e0b */}
              <motion.div
                animate={
                  feedback === 'correct'
                    ? { scale: [1, 1.2, 1], boxShadow: '0 3.5px 0 #1e293b' }
                    : { boxShadow: ['0 3.5px 0 #1e293b, 0 0 0px #fbbf24', '0 3.5px 0 #1e293b, 0 0 16px #fbbf24', '0 3.5px 0 #1e293b, 0 0 0px #fbbf24'] }
                }
                transition={
                  feedback === 'correct'
                    ? { duration: 0.5 }
                    : { duration: 1.5, repeat: Infinity }
                }
                style={{
                  width: isMobile ? 50 : 64,
                  height: isMobile ? 50 : 64,
                  borderRadius: '16px',
                  background: feedback === 'correct' ? '#f59e0b' : '#ffffff',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3.5px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '1.6rem' : '2rem',
                  fontWeight: 900,
                  color: feedback === 'correct' ? '#ffffff' : '#1e293b',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                {feedback === 'correct' ? result : '?'}
              </motion.div>
            </div>
          </motion.div>

          {/* Kotak Keypad Putih (Semua Butang Pilihan Warna Putih) */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '26px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '16px 12px' : '20px 18px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <p style={{
              textAlign: 'center',
              fontWeight: 800,
              fontSize: isMobile ? '0.88rem' : '1rem',
              margin: '0 0 10px 0',
              color: '#475569',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Tekan nombor jawapan:
            </p>
            <NumberKeypad onPress={handleAnswer} isMobile={isMobile} disabled={feedback === 'correct'} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AKTIVITI 3: PILIH JAWAPAN BETUL
// ═══════════════════════════════════════════════════════════════
export function MathActivity3PilihJawapan({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  const [questions] = useState(() => shuffleArray(dataset).slice(0, 10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const answeringRef = useRef(false);

  const item = questions[currentIdx];
  const { a, op, b, result } = parseMathExpression(item.digit);

  useEffect(() => {
    answeringRef.current = false;
    const wrongs = generateWrongAnswers(result, 3);
    setOptions(shuffleArray([result, ...wrongs]));
    setSelected(null);
    setIsCorrect(null);
    setAttempts(0);
  }, [currentIdx]);

  const handleSelect = (n: number) => {
    if (answeringRef.current || isCorrect) return;
    setSelected(n);
    if (n === result) {
      answeringRef.current = true;
      setIsCorrect(true);
      playPopSound();
      triggerPopConfetti();
      speakMathAudio(item, () => {
        setTimeout(() => {
          answeringRef.current = false;
          if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
          } else {
            playSuccessSound();
            onComplete(2);
          }
        }, 500);
      });
    } else {
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      playErrorSound();
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
        if (attempts >= 1) {
          setSelected(result);
          setIsCorrect(true);
          triggerPopConfetti();
          speakMathAudio(item, () => {
            setTimeout(() => {
              answeringRef.current = false;
              if (currentIdx < questions.length - 1) {
                setCurrentIdx(prev => prev + 1);
              } else {
                playSuccessSound();
                onComplete(2);
              }
            }, 500);
          });
        }
      }, 800);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar
        actNum={3}
        mode={mode}
        isMobile={isMobile}
        onBack={onBack}
        progress={currentIdx}
        total={questions.length}
      />

      <div style={blueCardContainerStyle(isMobile)}>
        <QuestionCounterBadge current={currentIdx + 1} total={questions.length} isMobile={isMobile} />

        <motion.div
          key={currentIdx}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          style={{
            width: '100%',
            maxWidth: '550px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '18px' : '24px',
            marginTop: isMobile ? '4px' : '15px'
          }}
        >
          {/* Kotak Soalan Putih (Apabila betul, jawapan terus muncul menggantikan tanda soal!) */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '26px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '26px 16px' : '36px 28px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <EquationDisplay
              a={a}
              op={op}
              b={b}
              result={result}
              showResult={isCorrect === true}
              isMobile={isMobile}
              highlight={isCorrect ? undefined : "result"}
            />
          </div>

          {/* 4 Pilihan Kad Jawapan Warna Oren (#f59e0b) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isMobile ? '10px' : '14px',
            width: '100%'
          }}>
            {options.map((opt, idx) => {
              const isThis = selected === opt;
              const isRight = opt === result;
              // Pilihan jawapan warna oren (#f59e0b) seperti mana warna oren ayat matematik
              const bgColor = isThis ? (isCorrect ? '#10b981' : '#ef4444') : '#f59e0b';
              const textColor = '#ffffff';

              return (
                <motion.button
                  key={`${currentIdx}-${idx}`}
                  whileHover={isCorrect ? undefined : { scale: 1.05 }}
                  whileTap={isCorrect ? undefined : { scale: 0.92 }}
                  animate={isThis && !isCorrect ? { x: [-6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  onClick={() => handleSelect(opt)}
                  disabled={isCorrect === true}
                  style={{
                    padding: isMobile ? '16px 10px' : '22px 14px',
                    borderRadius: isMobile ? '18px' : '22px',
                    background: bgColor,
                    border: '3px solid #1e293b',
                    boxShadow: '0 3.5px 0 #1e293b',
                    color: textColor,
                    fontSize: isMobile ? '1.8rem' : '2.4rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: isCorrect ? 'default' : 'pointer',
                    opacity: isCorrect && !isRight ? 0.35 : 1
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AKTIVITI 4: LENGKAPKAN PERSAMAAN
// ═══════════════════════════════════════════════════════════════
export function MathActivity4LengkapPersamaan({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  type BlankType = 'a' | 'b' | 'result';
  const generateQuestions = useCallback(() => {
    const shuffled = shuffleArray(dataset).slice(0, 10);
    return shuffled.map((item, i) => {
      const blankTypes: BlankType[] = ['a', 'b', 'result'];
      return { item, blank: blankTypes[i % 3] };
    });
  }, [dataset]);

  const [questions] = useState(generateQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const q = questions[currentIdx];
  const { a, op, b, result } = parseMathExpression(q.item.digit);
  const correctAnswer = q.blank === 'a' ? a : q.blank === 'b' ? b : result;

  useEffect(() => {
    const wrongs = generateWrongAnswers(correctAnswer, 3);
    setOptions(shuffleArray([correctAnswer, ...wrongs]));
    setSelected(null);
    setIsCorrect(null);
  }, [currentIdx]);

  const answeringRef = useRef(false);

  const handleSelect = (n: number) => {
    if (answeringRef.current || isCorrect) return;
    setSelected(n);
    if (n === correctAnswer) {
      answeringRef.current = true;
      setIsCorrect(true);
      playPopSound();
      triggerPopConfetti();
      speakMathAudio(q.item, () => {
        setTimeout(() => {
          answeringRef.current = false;
          if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
          } else {
            playSuccessSound();
            onComplete(3);
          }
        }, 500);
      });
    } else {
      setIsCorrect(false);
      playErrorSound();
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 700);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar
        actNum={4}
        mode={mode}
        isMobile={isMobile}
        onBack={onBack}
        progress={currentIdx}
        total={questions.length}
      />

      <div style={blueCardContainerStyle(isMobile)}>
        <QuestionCounterBadge current={currentIdx + 1} total={questions.length} isMobile={isMobile} />

        <motion.div
          key={currentIdx}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            width: '100%',
            maxWidth: '550px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '18px' : '24px',
            marginTop: isMobile ? '4px' : '15px'
          }}
        >
          {/* Kotak Soalan Putih (Apabila betul, jawapan terus muncul menggantikan tanda soal!) */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '26px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '24px 16px' : '34px 26px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <p style={{
              margin: 0,
              fontWeight: 800,
              fontSize: isMobile ? '0.88rem' : '1rem',
              color: '#475569',
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center'
            }}>
              Cari nombor yang hilang:
            </p>
            <EquationDisplay
              a={a}
              op={op}
              b={b}
              result={result}
              showResult={isCorrect === true}
              isMobile={isMobile}
              highlight={isCorrect ? undefined : q.blank}
            />
          </div>

          {/* 4 Pilihan Jawapan Warna Oren (#f59e0b) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isMobile ? '10px' : '14px',
            width: '100%'
          }}>
            {options.map((opt, idx) => {
              const isThis = selected === opt;
              // Pilihan jawapan warna oren (#f59e0b) seperti mana warna oren ayat matematik
              const bgColor = isThis ? (isCorrect ? '#10b981' : '#ef4444') : '#f59e0b';
              const textColor = '#ffffff';

              return (
                <motion.button
                  key={`${currentIdx}-${idx}`}
                  whileHover={isCorrect ? undefined : { scale: 1.05 }}
                  whileTap={isCorrect ? undefined : { scale: 0.92 }}
                  animate={isThis && isCorrect === false ? { x: [-6, 6, -6, 6, 0] } : {}}
                  onClick={() => handleSelect(opt)}
                  disabled={isCorrect === true}
                  style={{
                    padding: isMobile ? '16px 10px' : '22px 14px',
                    borderRadius: isMobile ? '18px' : '22px',
                    background: bgColor,
                    border: '3px solid #1e293b',
                    boxShadow: '0 3.5px 0 #1e293b',
                    color: textColor,
                    fontSize: isMobile ? '1.8rem' : '2.4rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: isCorrect ? 'default' : 'pointer',
                    opacity: isCorrect && opt !== correctAnswer ? 0.35 : 1
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AKTIVITI 5: SUSUN PERSAMAAN
// ═══════════════════════════════════════════════════════════════
export function MathActivity5SusunPersamaan({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  const [questions] = useState(() => shuffleArray(dataset).slice(0, 8));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [availablePieces, setAvailablePieces] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const item = questions[currentIdx];
  const { a, op, b, result } = parseMathExpression(item.digit);
  const correctOrder = [String(a), op, String(b), '=', String(result)];

  useEffect(() => {
    setSlots([null, null, null, null, null]);
    setAvailablePieces(shuffleArray([...correctOrder]));
    setIsComplete(false);
  }, [currentIdx]);

  // Peraturan Warna Pengguna di Aktiviti 5:
  // 1. Nombor: SEMUA NOMBOR SAMA WARNA (#38bdf8 / biru cerah)
  // 2. Simbol: WARNA LAIN, TAPI SAMA SESAMA SIMBOL (#f59e0b / jingga keemasan)
  const NUMBER_BG = '#38bdf8';
  const SYMBOL_BG = '#f59e0b';

  const getPieceColor = (piece: string) => {
    if (piece === '+' || piece === '-' || piece === '=') {
      return SYMBOL_BG;
    }
    return NUMBER_BG;
  };

  const handlePieceClick = (piece: string, pieceIdx: number) => {
    if (isComplete) return;
    const emptySlotIdx = slots.findIndex(s => s === null);
    if (emptySlotIdx === -1) return;
    if (piece === correctOrder[emptySlotIdx]) {
      playPopSound();
      triggerPopConfetti();
      const newSlots = [...slots];
      newSlots[emptySlotIdx] = piece;
      const newPieces = [...availablePieces];
      newPieces.splice(pieceIdx, 1);
      setSlots(newSlots);
      setAvailablePieces(newPieces);
      if (newSlots.every(s => s !== null)) {
        setIsComplete(true);
        triggerPopConfetti();
        speakMathAudio(item, () => {
          setTimeout(() => {
            if (currentIdx < questions.length - 1) {
              setCurrentIdx(prev => prev + 1);
            } else {
              playSuccessSound();
              onComplete(4);
            }
          }, 500);
        });
      }
    } else {
      playErrorSound();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar
        actNum={5}
        mode={mode}
        isMobile={isMobile}
        onBack={onBack}
        progress={currentIdx}
        total={questions.length}
      />

      <div style={blueCardContainerStyle(isMobile)}>
        <QuestionCounterBadge current={currentIdx + 1} total={questions.length} isMobile={isMobile} />

        <motion.div
          key={currentIdx}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          style={{
            width: '100%',
            maxWidth: '620px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '16px' : '22px',
            marginTop: isMobile ? '4px' : '15px'
          }}
        >
          {/* CONTOH PERSAMAAN DI ATAS RUANGAN KOSONG (Background Putih, Murid Hanya Ikut) */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '18px' : '22px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '14px 16px' : '18px 26px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '10px',
              justifyContent: 'center'
            }}>
              <span style={{
                background: NUMBER_BG,
                color: 'white',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: isMobile ? '4px 10px' : '6px 14px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>{a}</span>
              <span style={{
                background: SYMBOL_BG,
                color: 'white',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: isMobile ? '4px 10px' : '6px 14px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>{op}</span>
              <span style={{
                background: NUMBER_BG,
                color: 'white',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: isMobile ? '4px 10px' : '6px 14px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>{b}</span>
              <span style={{
                background: SYMBOL_BG,
                color: 'white',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: isMobile ? '4px 10px' : '6px 14px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>=</span>
              <span style={{
                background: NUMBER_BG,
                color: 'white',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: isMobile ? '4px 10px' : '6px 14px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}>{result}</span>
            </div>
          </div>

          {/* 5 Ruangan Kosong Slot */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '6px' : '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {slots.map((slot, idx) => (
              <motion.div
                key={idx}
                animate={
                  slot
                    ? { scale: [0.8, 1.1, 1] }
                    : idx === slots.findIndex(s => s === null)
                      ? { boxShadow: ['0 3px 0 #1e293b, 0 0 0px #fbbf24', '0 3px 0 #1e293b, 0 0 14px #fbbf24', '0 3px 0 #1e293b, 0 0 0px #fbbf24'] }
                      : {}
                }
                transition={slot ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity }}
                style={{
                  width: isMobile ? 52 : 68,
                  height: isMobile ? 52 : 68,
                  borderRadius: isMobile ? '14px' : '18px',
                  background: slot ? getPieceColor(slot) : '#ffffff',
                  border: `3px solid ${slot ? '#1e293b' : '#cbd5e1'}`,
                  boxShadow: slot ? '0 3px 0 #1e293b' : '0 2px 0 #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '1.4rem' : '1.9rem',
                  fontWeight: 900,
                  color: slot ? 'white' : '#94a3b8',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                {slot || (idx === slots.findIndex(s => s === null) ? '▼' : '')}
              </motion.div>
            ))}
          </div>

          {/* Kotak Pilihan Jubin Di Bawah */}
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '26px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '16px 12px' : '22px 18px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <p style={{
              textAlign: 'center',
              fontWeight: 800,
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              margin: '0 0 10px 0',
              color: '#475569',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Tekan nombor & simbol mengikut susunan:
            </p>
            <div style={{
              display: 'flex',
              gap: isMobile ? '8px' : '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {availablePieces.map((piece, idx) => (
                <motion.button
                  key={`${piece}-${idx}`}
                  whileHover={{ scale: 1.12, y: -4 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handlePieceClick(piece, idx)}
                  disabled={isComplete}
                  style={{
                    width: isMobile ? 54 : 70,
                    height: isMobile ? 54 : 70,
                    borderRadius: isMobile ? '14px' : '18px',
                    background: getPieceColor(piece),
                    border: '3px solid #1e293b',
                    boxShadow: '0 3.5px 0 #1e293b',
                    color: 'white',
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: isComplete ? 'default' : 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {piece}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AKTIVITI 6: CABARAN PANTAS (Icon Bintang & Trofi Modern)
// ═══════════════════════════════════════════════════════════════
export function MathActivity6CabaranPantas({ dataset, mode, isMobile, onBack, onComplete }: MathActivityProps) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [questions] = useState(() => {
    const b = shuffleArray(dataset);
    return [...b, ...shuffleArray(dataset), ...shuffleArray(dataset)].slice(0, 30);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [total, setTotal] = useState(0);
  const timerRef = useRef<any>(null);

  const item = questions[currentIdx] || questions[0];
  const { a, op, b, result } = parseMathExpression(item.digit);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPhase('done');
            playSuccessSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleStart = () => {
    setPhase('playing');
    setScore(0);
    setTotal(0);
    setTimeLeft(60);
    setCurrentIdx(0);
    setFeedback(null);
  };

  const handleAnswer = (n: number) => {
    if (phase !== 'playing' || feedback) return;
    setTotal(prev => prev + 1);
    if (n === result) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      playPopSound();
      triggerPopConfetti();
    } else {
      setFeedback('wrong');
      playErrorSound();
    }
    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        clearInterval(timerRef.current);
        setPhase('done');
        playSuccessSound();
      }
    }, 400);
  };

  const getBadge = () => {
    if (score >= 15) return { icon: 'fa-trophy', color: '#f59e0b', label: 'Juara!' };
    if (score >= 12) return { icon: 'fa-medal', color: '#f59e0b', label: 'Emas' };
    if (score >= 8) return { icon: 'fa-medal', color: '#94a3b8', label: 'Perak' };
    if (score >= 5) return { icon: 'fa-medal', color: '#cd7f32', label: 'Gangsa' };
    return { icon: 'fa-star', color: '#fbbf24', label: 'Bagus!' };
  };

  if (phase === 'ready') {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box'
      }}>
        <MathTopBar actNum={6} mode={mode} isMobile={isMobile} onBack={onBack} />
        <div style={blueCardContainerStyle(isMobile)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              marginTop: isMobile ? '20px' : '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '18px' : '24px'
            }}
          >
            {/* Icon Jam Randik Modern Beranimasi Menarik (Ringing / Ticking Animation) */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1.04, 1.1, 1, 1.04, 1],
                rotate: [0, -10, 10, -8, 8, -3, 3, 0],
                boxShadow: [
                  '0 3.5px 0 #1e293b, 0 0 0px rgba(136, 19, 55, 0)',
                  '0 3.5px 0 #1e293b, 0 0 24px rgba(225, 29, 72, 0.45)',
                  '0 3.5px 0 #1e293b, 0 0 0px rgba(136, 19, 55, 0)'
                ]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                width: isMobile ? '82px' : '104px',
                height: isMobile ? '82px' : '104px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '3.5px solid #1e293b',
                boxShadow: '0 3.5px 0 #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '2.6rem' : '3.4rem',
                color: '#881337'
              }}
            >
              <motion.i
                className="fa-solid fa-stopwatch"
                animate={{
                  rotate: [0, 8, -8, 6, -6, 0]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            {/* Arahan Berlatar Belakang Putih dengan Highlight Beranimasi pada 60 Saat */}
            <div style={{
              background: '#ffffff',
              border: '3px solid #1e293b',
              borderRadius: isMobile ? '16px' : '22px',
              boxShadow: '0 3.5px 0 #1e293b',
              padding: isMobile ? '16px 18px' : '20px 32px',
              maxWidth: '540px',
              width: '90%',
              boxSizing: 'border-box'
            }}>
              <h2 style={{
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                fontSize: isMobile ? '1.15rem' : '1.55rem',
                color: '#1e293b',
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>Jawab sebanyak mungkin dalam</span>
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#ffffff',
                    border: '2.5px solid #1e293b',
                    borderRadius: '12px',
                    boxShadow: '0 2.5px 0 #b45309',
                    padding: isMobile ? '2px 10px' : '4px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: isMobile ? '1.25rem' : '1.7rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  <i className="fa-solid fa-bolt" style={{ fontSize: '0.85em', color: '#fef08a' }}></i>
                  60 saat!
                </span>
              </h2>
            </div>
            {/* Butang Mula Berwarna Oren dengan Animasi Denyutan Glow Sama seperti 60 Saat */}
            <motion.button
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 4px 0 #1e293b, 0 0 0px #fbbf24',
                  '0 4px 0 #1e293b, 0 0 22px #f59e0b',
                  '0 4px 0 #1e293b, 0 0 0px #fbbf24'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleStart}
              style={{
                padding: isMobile ? '14px 38px' : '16px 52px',
                borderRadius: '20px',
                background: '#f59e0b',
                border: '3.5px solid #1e293b',
                boxShadow: '0 4px 0 #1e293b',
                color: 'white',
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: 900,
                cursor: 'pointer',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fa-solid fa-play" style={{ marginRight: '10px' }}></i>
              Mula!
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const badge = getBadge();
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box'
      }}>
        <MathTopBar actNum={6} mode={mode} isMobile={isMobile} onBack={() => onComplete(5)} />
        <div style={blueCardContainerStyle(isMobile)}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              marginTop: '10px',
              background: '#ffffff',
              borderRadius: isMobile ? '24px' : '30px',
              border: '3.5px solid #1e293b',
              boxShadow: '0 5px 0 #1e293b',
              padding: isMobile ? '26px 18px' : '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              maxWidth: '480px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Lencana / Bintang Modern Icon (Bukan Emoji) */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: isMobile ? '76px' : '96px',
                height: isMobile ? '76px' : '96px',
                borderRadius: '50%',
                background: '#fef3c7',
                border: '3px solid #1e293b',
                boxShadow: '0 3px 0 #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '2.5rem' : '3.4rem',
                color: badge.color
              }}
            >
              <i className={`fa-solid ${badge.icon}`}></i>
            </motion.div>
            <h2 style={{
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              fontSize: isMobile ? '1.5rem' : '2rem',
              color: '#1e293b',
              margin: 0,
              textAlign: 'center'
            }}>
              {badge.label}
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                textAlign: 'center',
                background: '#10b981',
                borderRadius: '16px',
                border: '3px solid #1e293b',
                boxShadow: '0 2.5px 0 #1e293b',
                padding: isMobile ? '10px 18px' : '14px 24px',
                color: 'white'
              }}>
                <div style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: 900, fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>{score}</div>
                <div style={{ fontSize: isMobile ? '0.75rem' : '0.88rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Betul</div>
              </div>
              <div style={{
                textAlign: 'center',
                background: '#64748b',
                borderRadius: '16px',
                border: '3px solid #1e293b',
                boxShadow: '0 2.5px 0 #1e293b',
                padding: isMobile ? '10px 18px' : '14px 24px',
                color: 'white'
              }}>
                <div style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: 900, fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>{total}</div>
                <div style={{ fontSize: isMobile ? '0.75rem' : '0.88rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Jumlah</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleStart}
                style={{
                  padding: isMobile ? '10px 20px' : '12px 28px',
                  borderRadius: '16px',
                  background: '#f59e0b',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3px 0 #1e293b',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                <i className="fa-solid fa-rotate-right" style={{ marginRight: '8px' }}></i>
                Cuba Lagi
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onComplete(5)}
                style={{
                  padding: isMobile ? '10px 20px' : '12px 28px',
                  borderRadius: '16px',
                  background: '#881337',
                  border: '3px solid #1e293b',
                  boxShadow: '0 3px 0 #1e293b',
                  color: 'white',
                  fontSize: isMobile ? '0.95rem' : '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                Selesai ✓
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <MathTopBar actNum={6} mode={mode} isMobile={isMobile} onBack={onBack} />

      <div style={blueCardContainerStyle(isMobile)}>
        {/* Pemasa & Skor di Atas */}
        <div style={{
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: isMobile ? '14px' : '20px'
        }}>
          <div style={{
            background: '#ef4444',
            border: '2.5px solid #1e293b',
            borderRadius: '12px',
            padding: isMobile ? '5px 12px' : '7px 16px',
            color: 'white',
            fontWeight: 900,
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            minWidth: '54px',
            textAlign: 'center',
            boxShadow: '0 2px 0 #1e293b'
          }}>
            {timeLeft}s
          </div>
          <div style={{
            flex: 1,
            height: isMobile ? '12px' : '14px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #1e293b',
            overflow: 'hidden'
          }}>
            <motion.div
              animate={{ width: `${(timeLeft / 60) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                background: timeLeft > 20 ? 'linear-gradient(90deg, #10b981, #34d399)' : timeLeft > 10 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                borderRadius: '20px'
              }}
            />
          </div>

          {/* Icon Bintang Modern untuk Kaunter Skor (Bukan Emoji) */}
          <div style={{
            background: '#10b981',
            border: '2.5px solid #1e293b',
            borderRadius: '12px',
            padding: isMobile ? '5px 12px' : '7px 16px',
            color: 'white',
            fontWeight: 900,
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            minWidth: '58px',
            textAlign: 'center',
            boxShadow: '0 2px 0 #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <i className="fa-solid fa-star" style={{ color: '#fbbf24', fontSize: '1.05rem' }}></i>
            <span>{score}</span>
          </div>
        </div>

        {/* Kotak Soalan Putih (Semua Kotak Nombor Berwarna Sama) */}
        <motion.div
          key={currentIdx}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{
            background: '#ffffff',
            borderRadius: isMobile ? '20px' : '26px',
            border: '3px solid #1e293b',
            boxShadow: '0 3px 0 #1e293b',
            padding: isMobile ? '22px 14px' : '32px 24px',
            width: '100%',
            maxWidth: '560px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: isMobile ? '16px' : '22px'
          }}
        >
          <EquationDisplay
            a={a}
            op={op}
            b={b}
            result={feedback === 'correct' ? result : '?'}
            showResult={feedback === 'correct'}
            isMobile={isMobile}
            highlight="result"
          />
        </motion.div>

        {/* Keypad Putih Bersih */}
        <div style={{
          background: '#ffffff',
          borderRadius: isMobile ? '20px' : '26px',
          border: '3px solid #1e293b',
          boxShadow: '0 3px 0 #1e293b',
          padding: isMobile ? '16px 12px' : '20px 18px',
          width: '100%',
          maxWidth: '560px',
          boxSizing: 'border-box'
        }}>
          <NumberKeypad onPress={handleAnswer} isMobile={isMobile} disabled={!!feedback} />
        </div>
      </div>
    </div>
  );
}
