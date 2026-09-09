import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  NomborItem,
  NomborMode,
  NOMBOR_MODE_CONFIGS,
  ASAS_0_10_DATABASE,
  ModernSoccerBall
} from './NomborGame';

export const MAIN_APP_BG = 'transparent';

export const playNavSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) { }
};

export interface NomborActivityProps {
  item: NomborItem;
  mode: NomborMode;
  isMobile: boolean;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  triggerTerbaik: (onComplete: () => void, durationMs?: number) => void;
  dataset?: NomborItem[];
}

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

  export function Activity1PicturePuzzleNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const [openTiles, setOpenTiles] = useState<boolean[]>([
      false, false, false,
      false, false, false,
      false, false, false
    ]);
    const [showPopupReveal, setShowPopupReveal] = useState(false);

    const isAllOpen = openTiles.every(Boolean);

    const handleOpenTile = (idx: number) => {
      playAudioOrSpeak(item.audio, item.name);

      setOpenTiles(prev => {
        const next = [...prev];
        next[idx] = true;
        if (next.every(Boolean)) {
          setTimeout(() => {
            setShowPopupReveal(true);
            playAudioOrSpeak(item.audio, item.name);
          }, 300);

          setTimeout(() => {
            setShowPopupReveal(false);
            onComplete();
            triggerTerbaik(onNext, 1500);
          }, 2600);
        }
        return next;
      });
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={1} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          <div
            style={{
              background: 'white',
              borderRadius: '999px',
              padding: isMobile ? '8px 16px' : '10px 24px',
              border: '3px solid #1e293b',
              boxShadow: '0 2px 0 #1e293b',
              fontWeight: 800,
              fontSize: isMobile ? '0.92rem' : '1.1rem',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: '16px',
              maxWidth: '90%'
            }}
          >
            {isAllOpen
              ? `✨ Gambar rahsia ialah [${item.name.toUpperCase()} = ${item.digit}]!`
              : 'Buka setiap jubin [ ? ] untuk mendedahkan gambar objek nombor rahsia!'}
          </div>

          <div
            style={{
              width: isMobile ? '260px' : '360px',
              height: isMobile ? '260px' : '360px',
              borderRadius: '28px',
              border: '3.5px solid #1e293b',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}
          >
            {item.image && mode !== 'siri_nombor' ? (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  width: isMobile ? '160px' : '220px',
                  height: isMobile ? '160px' : '220px',
                  backgroundColor: '#bae6fd',
                  border: '5px solid #38bdf8',
                  borderRadius: isMobile ? '28px' : '36px',
                  boxShadow: '0 6px 0 #0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? (item.digit.length > 2 ? '3.6rem' : '4.8rem') : (item.digit.length > 2 ? '4.8rem' : '6.5rem'),
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  letterSpacing: item.digit.length >= 3 ? (isMobile ? '-3px' : '-5px') : 'normal',
                  color: '#10182f',
                  userSelect: 'none'
                }}
              >
                {item.digit}
              </div>
            )}

            {!isAllOpen && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: '4px',
                padding: '4px',
                zIndex: 5
              }}>
                {openTiles.map((isOpen, idx) => {
                  if (isOpen) {
                    return <div key={`tile-${idx}`} style={{ pointerEvents: 'none' }} />;
                  }
                  return (
                    <motion.button
                      key={`tile-${idx}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenTile(idx)}
                      style={{
                        background: '#ec4899',
                        border: '2px solid #1e293b',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: isMobile ? '1.8rem' : '2.3rem',
                        fontWeight: 900,
                        fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                        textShadow: '0 2px 0 #1e293b'
                      }}
                    >
                      ?
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {showPopupReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px'
            }}
          >
            <motion.div
              initial={{ scale: 0.6, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              style={{
                background: '#ffffff',
                borderRadius: '32px',
                border: '4px solid #1e293b',
                boxShadow: '0 8px 0 #1e293b, 0 20px 40px rgba(0,0,0,0.35)',
                padding: isMobile ? '20px 16px' : '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '380px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: isMobile ? '180px' : '220px',
                height: isMobile ? '180px' : '220px',
                borderRadius: '24px',
                border: '3px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px'
              }}>
                {item.image && mode !== 'siri_nombor' ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#bae6fd',
                      border: '4px solid #38bdf8',
                      borderRadius: '20px',
                      boxShadow: '0 4px 0 #0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: item.digit.length > 2 ? '3.8rem' : '4.8rem',
                      fontWeight: 900,
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      letterSpacing: item.digit.length >= 3 ? '-4px' : 'normal',
                      color: '#10182f',
                      userSelect: 'none'
                    }}
                  >
                    {item.digit}
                  </div>
                )}
              </div>

              <div style={{
                background: '#ffffff',
                border: '3.5px solid #1e293b',
                boxShadow: '0 3px 0 #1e293b',
                borderRadius: '24px',
                padding: isMobile ? '8px 24px' : '10px 32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.syllables.map((syl, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: isMobile ? '2.2rem' : '3rem',
                      fontWeight: 900,
                      color: i % 2 === 0 ? '#1e293b' : '#ef4444',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                    }}
                  >
                    {syl}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 2: BURUNG NOMBOR (FLAPPY BIRD PATUK MAKANAN NOMBOR)
  // -------------------------------------------------------------
  export function Activity2FlappyBirdNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const isZero = item.count === 0;
    const targetCount = isZero 
      ? 1 
      : mode === 'siri_nombor' 
        ? Math.max(1, Math.min(10, Math.floor(item.count / 10))) 
        : Math.min(10, Math.max(1, item.count));

    const [peckedCount, setPeckedCount] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const completedRef = useRef(false);
    const peckedCountRef = useRef(0);
    peckedCountRef.current = peckedCount;

    const getCountingAudioAndText = (stepNum: number) => {
      if (isZero) {
        return { audio: '/audio/nombor/sifar.mp3', text: 'sifar' };
      }
      if (mode === 'siri_nombor') {
        const val = stepNum * 10;
        const names: Record<number, string> = {
          10: 'sepuluh', 20: 'dua puluh', 30: 'tiga puluh', 40: 'empat puluh', 50: 'lima puluh',
          60: 'enam puluh', 70: 'tujuh puluh', 80: 'lapan puluh', 90: 'sembilan puluh', 100: 'seratus'
        };
        return { audio: `/audio/nombor/${val <= 10 ? 'sepuluh' : val === 100 ? 'seratus' : names[val]?.replace(' ', '-')}.mp3`, text: names[val] || `${val}` };
      }
      const names = ['sifar', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh'];
      const audios = [
        '/audio/nombor/sifar.mp3',
        '/audio/nombor/satu.mp3',
        '/audio/nombor/dua.mp3',
        '/audio/nombor/tiga.mp3',
        '/audio/nombor/empat.mp3',
        '/audio/nombor/lima.mp3',
        '/audio/nombor/enam.mp3',
        '/audio/nombor/tujuh.mp3',
        '/audio/nombor/lapan.mp3',
        '/audio/nombor/sembilan.mp3',
        '/audio/nombor/sepuluh.mp3'
      ];
      return {
        audio: audios[stepNum] || item.audio,
        text: names[stepNum] || item.name
      };
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const C_WIDTH = isMobile ? 360 : 640;
      const C_HEIGHT = isMobile ? 320 : 340;
      const GROUND_Y = isMobile ? 286 : 304;

      let gameState: 'ready' | 'playing' | 'done' = 'ready';

      let bird = {
        x: isMobile ? 75 : 120,
        y: C_HEIGHT / 2 - 15,
        vy: 0,
        r: isMobile ? 15 : 17,
        peckTimer: 0,
        flashRed: 0
      };

      let sparkles: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string; life: number; maxLife: number }> = [];

      let clouds = [
        { x: 30, y: 35, w: 55, s: 0.35 },
        { x: 180, y: 55, w: 50, s: 0.25 },
        { x: 340, y: 30, w: 65, s: 0.4 },
        { x: 500, y: 60, w: 55, s: 0.3 }
      ];

      const pipeDistance = isMobile ? 175 : 235;
      const pipeWidth = isMobile ? 52 : 62;
      let pipes: Array<{
        x: number;
        width: number;
        foodIndex: number;
        foodY: number;
        foodPopped: boolean;
        foodPopScale: number;
        foodPopOpacity: number;
      }> = [];

      for (let i = 1; i <= targetCount; i++) {
        const foodY = (C_HEIGHT / 2 - 20) + ((i % 3) - 1) * 38;
        pipes.push({
          x: C_WIDTH + 50 + (i - 1) * pipeDistance,
          width: pipeWidth,
          foodIndex: i,
          foodY: Math.max(90, Math.min(GROUND_Y - 90, foodY)),
          foodPopped: false,
          foodPopScale: 1,
          foodPopOpacity: 1
        });
      }

      let isRunning = true;
      let gameTime = 0;
      let animId: number;

      const handleUserAction = () => {
        if (gameState === 'ready') {
          gameState = 'playing';
          bird.vy = -3.4;
          playPopSound();
        } else if (gameState === 'playing') {
          bird.vy = -3.4;
          playPopSound();
        }
      };

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        handleUserAction();
      };
      canvas.addEventListener('pointerdown', onPointerDown);

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable) return;
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          handleUserAction();
        }
      };
      window.addEventListener('keydown', onKeyDown);

      function spawnPeckSparkles(x: number, y: number) {
        const colors = ['#fde047', '#f59e0b', '#fbbf24', '#ffffff', '#10b981'];
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.8 + Math.random() * 3.8;
          sparkles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            r: 2.8 + Math.random() * 3.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 25 + Math.random() * 15,
            maxLife: 40
          });
        }
      }

      function drawRoundedRect(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: any, stroke?: string, strokeWidth = 2.5) {
        c.beginPath();
        c.moveTo(x + radius, y);
        c.lineTo(x + width - radius, y);
        c.quadraticCurveTo(x + width, y, x + width, y + radius);
        c.lineTo(x + width, y + height - radius);
        c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        c.lineTo(x + radius, y + height);
        c.quadraticCurveTo(x, y + height, x, y + height - radius);
        c.lineTo(x, y + radius);
        c.quadraticCurveTo(x, y, x + radius, y);
        c.closePath();
        if (fill) {
          c.fillStyle = fill;
          c.fill();
        }
        if (stroke) {
          c.strokeStyle = stroke;
          c.lineWidth = strokeWidth;
          c.stroke();
        }
      }

      function drawBirdFood(c: CanvasRenderingContext2D, x: number, y: number, index: number, isPopped: boolean, popScale: number, popOpacity: number, t: number) {
        if (isPopped && popOpacity <= 0) return;
        c.save();
        c.translate(x, y + Math.sin(t * 3.5 + index) * 5);
        if (isPopped) {
          c.scale(popScale, popScale);
          c.globalAlpha = Math.max(0, popOpacity);
        }

        c.shadowColor = '#f59e0b';
        c.shadowBlur = isPopped ? 24 : 16;

        c.fillStyle = '#22c55e';
        c.beginPath();
        c.ellipse(3, -16, 5.5, 9, Math.PI / 4, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#15803d';
        c.lineWidth = 1.6;
        c.stroke();

        const gGrad = c.createRadialGradient(-3, -3, 2, 0, 0, 16);
        gGrad.addColorStop(0, '#fef08a');
        gGrad.addColorStop(0.4, '#fbbf24');
        gGrad.addColorStop(1, '#d97706');

        c.beginPath();
        c.moveTo(0, -14);
        c.bezierCurveTo(15, -9, 16, 9, 0, 16);
        c.bezierCurveTo(-16, 9, -15, -9, 0, -14);
        c.closePath();
        c.fillStyle = gGrad;
        c.fill();
        c.strokeStyle = '#78350f';
        c.lineWidth = 2.8;
        c.stroke();

        c.beginPath();
        c.ellipse(-4.5, -2, 3.5, 8, -Math.PI / 6, 0, Math.PI * 2);
        c.fillStyle = 'rgba(255, 255, 255, 0.75)';
        c.fill();

        c.shadowBlur = 0;
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(0, 0, 9, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#78350f';
        c.lineWidth = 1.8;
        c.stroke();

        c.fillStyle = '#78350f';
        c.font = '900 12px "AtlantaRoundedBlack", "Poppins", sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(index), 0, 0.5);

        c.restore();
      }

      function gameLoop() {
        if (!isRunning) return;
        gameTime += 0.03;

        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        clouds.forEach(cl => {
          if (gameState === 'playing') cl.x -= cl.s;
          if (cl.x + cl.w < -20) cl.x = C_WIDTH + 20;
          ctx.beginPath();
          ctx.arc(cl.x, cl.y, cl.w * 0.25, 0, Math.PI * 2);
          ctx.arc(cl.x + cl.w * 0.2, cl.y - cl.w * 0.1, cl.w * 0.32, 0, Math.PI * 2);
          ctx.arc(cl.x + cl.w * 0.45, cl.y, cl.w * 0.25, 0, Math.PI * 2);
          ctx.fill();
        });

        const scrollSpeed = 1.7;

        pipes.forEach(pipe => {
          if (gameState === 'playing') {
            pipe.x -= scrollSpeed;
          }

          const topPipeHeight = Math.max(10, pipe.foodY - 54);
          const pGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
          pGrad.addColorStop(0, '#16a34a');
          pGrad.addColorStop(0.25, '#4ade80');
          pGrad.addColorStop(0.7, '#22c55e');
          pGrad.addColorStop(1, '#15803d');

          drawRoundedRect(ctx, pipe.x, 0, pipe.width, topPipeHeight - 10, 4, pGrad, '#14532d', 2.5);
          drawRoundedRect(ctx, pipe.x - 4, topPipeHeight - 10, pipe.width + 8, 12, 5, pGrad, '#14532d', 2.5);

          const botPipeTop = pipe.foodY + 54;
          const botPipeHeight = GROUND_Y - botPipeTop;
          if (botPipeHeight > 0) {
            drawRoundedRect(ctx, pipe.x - 4, botPipeTop, pipe.width + 8, 12, 5, pGrad, '#14532d', 2.5);
            drawRoundedRect(ctx, pipe.x, botPipeTop + 12, pipe.width, botPipeHeight - 12, 4, pGrad, '#14532d', 2.5);
          }

          const foodCenterX = pipe.x + pipe.width / 2;
          drawBirdFood(ctx, foodCenterX, pipe.foodY, pipe.foodIndex, pipe.foodPopped, pipe.foodPopScale, pipe.foodPopOpacity, gameTime);

          if (pipe.foodPopped) {
            pipe.foodPopScale += 0.08;
            pipe.foodPopOpacity -= 0.08;
          }

          if (gameState === 'playing' && !pipe.foodPopped) {
            const dx = bird.x - foodCenterX;
            const dy = bird.y - pipe.foodY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < bird.r + 22) {
              pipe.foodPopped = true;
              bird.peckTimer = 14;
              spawnPeckSparkles(foodCenterX, pipe.foodY);
              playPopSound();

              const nextCount = peckedCountRef.current + 1;
              peckedCountRef.current = nextCount;
              setPeckedCount(nextCount);

              const { audio, text } = getCountingAudioAndText(nextCount);
              playAudioOrSpeak(audio, text);

              if (nextCount >= targetCount && !completedRef.current) {
                completedRef.current = true;
                gameState = 'done';
                setTimeout(() => {
                  onComplete();
                  triggerTerbaik(onNext, 1600);
                }, 800);
              }
            }
          }

          if (gameState === 'playing' && bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + pipe.width) {
            if (bird.y - bird.r < topPipeHeight || bird.y + bird.r > botPipeTop) {
              bird.vy = -2.6;
              bird.flashRed = 8;
            }
          }
        });

        const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, C_HEIGHT);
        groundGrad.addColorStop(0, '#22c55e');
        groundGrad.addColorStop(0.18, '#16a34a');
        groundGrad.addColorStop(0.25, '#d97706');
        groundGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, GROUND_Y, C_WIDTH, C_HEIGHT - GROUND_Y);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, GROUND_Y, C_WIDTH, 4);

        if (gameState === 'playing') {
          bird.vy += 0.13;
          if (bird.vy > 2.8) bird.vy = 2.8;
          bird.y += bird.vy;

          if (bird.y < bird.r + 6) {
            bird.y = bird.r + 6;
            bird.vy = 0;
          }
          if (bird.y > GROUND_Y - bird.r) {
            bird.y = GROUND_Y - bird.r;
            bird.vy = -2.0;
          }
        } else if (gameState === 'ready') {
          bird.y = (C_HEIGHT / 2 - 15) + Math.sin(gameTime * 4) * 6;
          bird.vy = 0;
        }

        ctx.save();
        ctx.translate(bird.x, bird.y);

        const isPecking = bird.peckTimer > 0;
        if (isPecking) bird.peckTimer--;

        const rotation = isPecking ? 0.25 : (gameState === 'playing' ? bird.vy * 0.08 : 0);
        ctx.rotate(rotation);

        if (bird.flashRed > 0) {
          bird.flashRed--;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
        }

        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-20, -5);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-20, 5);
        ctx.closePath();
        ctx.fill();

        const bGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 16);
        bGrad.addColorStop(0, '#fef08a');
        bGrad.addColorStop(0.55, '#facc15');
        bGrad.addColorStop(1, '#eab308');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bird.r - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        const beakReach = isPecking ? 20 : 15;
        ctx.moveTo(8, -4);
        ctx.lineTo(beakReach, 0);
        ctx.lineTo(8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, -4, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(5.5, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4.5, -5, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        const wingFlap = Math.sin(gameTime * 15) * 4;
        ctx.ellipse(-3, 3 + wingFlap, 7, 5, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.restore();

        for (let i = sparkles.length - 1; i >= 0; i--) {
          const sp = sparkles[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.08;
          sp.life--;
          if (sp.life <= 0) {
            sparkles.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = sp.life / sp.maxLife;
            ctx.fillStyle = sp.color;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Ready Start Prompt Banner Overlay on Canvas
        if (gameState === 'ready') {
          const pW = isMobile ? 220 : 270;
          const pH = isMobile ? 46 : 54;
          const pX = C_WIDTH / 2 - pW / 2;
          const pY = C_HEIGHT / 2 - pH / 2 + Math.sin(gameTime * 4) * 4;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;
          drawRoundedRect(ctx, pX, pY, pW, pH, 24, '#ffffff', '#1e293b', 3.5);
          ctx.restore();

          ctx.fillStyle = '#f59e0b';
          ctx.font = isMobile ? '900 17px "AtlantaRoundedBlack", "Poppins", sans-serif' : '900 20px "AtlantaRoundedBlack", "Poppins", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('👆 Tekan Untuk Mula', C_WIDTH / 2, pY + pH / 2);
        }

        animId = requestAnimationFrame(gameLoop);
      }

      animId = requestAnimationFrame(gameLoop);

      return () => {
        isRunning = false;
        cancelAnimationFrame(animId);
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('keydown', onKeyDown);
      };
    }, [item, targetCount, isMobile]);

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={2} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          {/* Top Instruction & Counter Pill (Tightly grouped) */}
          <div
            style={{
              background: 'white',
              borderRadius: '999px',
              padding: isMobile ? '8px 16px' : '10px 24px',
              border: '3px solid #1e293b',
              boxShadow: '0 2.5px 0 #1e293b',
              color: '#1e293b',
              fontSize: isMobile ? '0.92rem' : '1.12rem',
              fontWeight: 900,
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              marginBottom: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxSizing: 'border-box'
            }}
          >
            <span>Patuk makanan bijirin:</span>
            <span style={{
              background: peckedCount >= targetCount ? '#10b981' : currentConfig.topBadgeColor,
              color: 'white',
              borderRadius: '999px',
              padding: '3px 14px',
              fontSize: '0.95rem',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <i className="fa-solid fa-wheat-awn"></i>
              {peckedCount} / {targetCount}
            </span>
          </div>

          {/* Canvas Box (Wider on laptop) */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? '350px' : '720px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <canvas
              ref={canvasRef}
              width={isMobile ? 360 : 640}
              height={isMobile ? 320 : 340}
              style={{
                width: '100%',
                aspectRatio: isMobile ? '360/320' : '640/340',
                borderRadius: isMobile ? '22px' : '26px',
                border: '3.5px solid #0369a1',
                boxShadow: '0 5px 0 #0369a1',
                background: '#7dd3fc',
                display: 'block',
                cursor: 'pointer',
                touchAction: 'none'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 3: KENALI NOMBOR & KIRA BILANGAN (KAD TANDA SOAL '?')
  // -------------------------------------------------------------
  export function Activity3HearNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const isZero = item.count === 0;
    const targetCardsCount = isZero 
      ? 1 
      : mode === 'siri_nombor' 
        ? Math.max(1, Math.min(10, Math.floor(item.count / 10))) 
        : Math.min(10, Math.max(1, item.count));

    const [openedCards, setOpenedCards] = useState<{ [index: number]: number }>({});
    const openedCount = Object.keys(openedCards).length;

    const getCountingAudioAndText = (stepNum: number) => {
      if (isZero) {
        return { audio: '/audio/nombor/sifar.mp3', text: 'sifar' };
      }
      if (mode === 'siri_nombor') {
        const val = stepNum * 10;
        const names: Record<number, string> = {
          10: 'sepuluh', 20: 'dua puluh', 30: 'tiga puluh', 40: 'empat puluh', 50: 'lima puluh',
          60: 'enam puluh', 70: 'tujuh puluh', 80: 'lapan puluh', 90: 'sembilan puluh', 100: 'seratus'
        };
        return { audio: `/audio/nombor/${val <= 10 ? 'sepuluh' : val === 100 ? 'seratus' : names[val]?.replace(' ', '-')}.mp3`, text: names[val] || `${val}` };
      }
      const names = ['sifar', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh'];
      const audios = [
        '/audio/nombor/sifar.mp3',
        '/audio/nombor/satu.mp3',
        '/audio/nombor/dua.mp3',
        '/audio/nombor/tiga.mp3',
        '/audio/nombor/empat.mp3',
        '/audio/nombor/lima.mp3',
        '/audio/nombor/enam.mp3',
        '/audio/nombor/tujuh.mp3',
        '/audio/nombor/lapan.mp3',
        '/audio/nombor/sembilan.mp3',
        '/audio/nombor/sepuluh.mp3'
      ];
      return { audio: audios[stepNum] || audios[1], text: names[stepNum] || `${stepNum}` };
    };

    const handleTapCard = (cardIdx: number) => {
      if (openedCards[cardIdx] !== undefined) {
        const stepNum = openedCards[cardIdx];
        const { audio, text } = getCountingAudioAndText(stepNum);
        playAudioOrSpeak(audio, text);
        return;
      }

      playPopSound();
      const nextStep = openedCount + 1;
      const { audio, text } = getCountingAudioAndText(nextStep);

      playAudioOrSpeak(audio, text);

      const updated = { ...openedCards, [cardIdx]: nextStep };
      setOpenedCards(updated);

      if (nextStep >= targetCardsCount) {
        setTimeout(() => {
          onComplete();
          triggerTerbaik(onNext, 1600);
        }, 700);
      }
    };

    const getGridColumns = () => {
      if (targetCardsCount === 1) return 'repeat(1, minmax(0, 1fr))';
      if (targetCardsCount === 2) return 'repeat(2, minmax(0, 1fr))';
      if (targetCardsCount === 3) return 'repeat(3, minmax(0, 1fr))';
      if (targetCardsCount === 4) return 'repeat(2, minmax(0, 1fr))';
      if (targetCardsCount <= 6) return isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))';
      if (targetCardsCount <= 8) return isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))';
      return isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))';
    };

    const getMaxWidth = () => {
      if (targetCardsCount === 1) return isMobile ? '200px' : '260px';
      if (targetCardsCount === 2) return isMobile ? '300px' : '400px';
      if (targetCardsCount === 3) return isMobile ? '340px' : '520px';
      if (targetCardsCount === 4) return isMobile ? '300px' : '400px';
      if (targetCardsCount <= 6) return isMobile ? '340px' : '560px';
      if (targetCardsCount <= 8) return isMobile ? '340px' : '680px';
      return isMobile ? '340px' : '760px';
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={3} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          {/* Top Instruction Pill */}
          <div
            style={{
              background: 'white',
              borderRadius: '999px',
              padding: isMobile ? '8px 14px' : '10px 24px',
              border: '3px solid #1e293b',
              boxShadow: '0 2px 0 #1e293b',
              fontWeight: 800,
              fontSize: isMobile ? '0.85rem' : '1.05rem',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: isMobile ? '20px' : '28px',
              maxWidth: '92%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <span>Tekan setiap kad <strong>[ ? ]</strong> untuk mengira bilangan:</span>
            <span style={{
              background: currentConfig.topBadgeColor,
              color: 'white',
              borderRadius: '999px',
              padding: '2px 14px',
              fontSize: '1rem',
              fontWeight: 900
            }}>
              {item.digit}
            </span>
          </div>

          {/* Grid of ? Cards */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: isMobile ? '10px' : '16px',
            width: '100%',
            maxWidth: getMaxWidth(),
            alignContent: 'center',
            boxSizing: 'border-box'
          }}>
            {Array.from({ length: targetCardsCount }, (_, i) => {
              const isOpened = openedCards[i] !== undefined;
              const stepNumber = openedCards[i];

              return (
                <motion.button
                  key={`card-item-${i}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleTapCard(i)}
                  style={{
                    width: '100%',
                    height: isMobile ? (targetCardsCount <= 3 ? '105px' : '88px') : (targetCardsCount <= 3 ? '145px' : '115px'),
                    borderRadius: isMobile ? '18px' : '22px',
                    border: isOpened ? '3.5px solid #10b981' : '3.5px solid #1e293b',
                    background: isOpened ? '#d1fae5' : '#ffffff',
                    boxShadow: isOpened ? '0 3px 0 #059669' : '0 3px 0 #1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.25s, border-color 0.25s'
                  }}
                >
                  {!isOpened ? (
                    <div
                      style={{
                        fontSize: isMobile ? (targetCardsCount <= 3 ? '2.4rem' : '2.0rem') : (targetCardsCount <= 3 ? '3.6rem' : '2.8rem'),
                        fontWeight: 900,
                        color: '#f59e0b',
                        fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                        textShadow: '0 2px 0 #1e293b',
                        userSelect: 'none'
                      }}
                    >
                      ?
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <ModernSoccerBall
                        size={isMobile
                          ? (targetCardsCount <= 3 ? 54 : 40)
                          : (targetCardsCount <= 3 ? 78 : 58)
                        }
                      />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 4: LETUP BUIH NOMBOR (BUIH TANDA SOAL '?')
  // -------------------------------------------------------------
  export function Activity4BubblePopNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const isZero = item.count === 0;
    // EXACT count of bubbles according to the number
    const targetCount = isZero 
      ? 1 
      : mode === 'siri_nombor' 
        ? Math.max(1, Math.min(10, Math.floor(item.count / 10))) 
        : item.count;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#a855f7'];
    const spreadX = [12, 65, 25, 48, 8, 72, 38, 80, 52, 30];

    const [bubbles, setBubbles] = useState(() => {
      return Array.from({ length: targetCount }, (_, i) => ({
        id: `bubble-${i}`,
        popped: false,
        color: colors[i % colors.length],
        left: targetCount === 1 ? 42 : (spreadX[i % spreadX.length]),
        speed: 7.0 + (i % 3) * 1.5,
        delay: (i * 0.7) % 3.0
      }));
    });

    const [popEffects, setPopEffects] = useState<{ id: string; x: number; y: number; countNum: number }[]>([]);
    const poppedCount = bubbles.filter(b => b.popped).length;

    const handleBubbleClick = (e: React.MouseEvent, id: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      playPopSound();
      const currentPoppedNext = poppedCount + 1;

      // Count audio
      const names = ['sifar', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh'];
      const audios = [
        '/audio/nombor/sifar.mp3',
        '/audio/nombor/satu.mp3',
        '/audio/nombor/dua.mp3',
        '/audio/nombor/tiga.mp3',
        '/audio/nombor/empat.mp3',
        '/audio/nombor/lima.mp3',
        '/audio/nombor/enam.mp3',
        '/audio/nombor/tujuh.mp3',
        '/audio/nombor/lapan.mp3',
        '/audio/nombor/sembilan.mp3',
        '/audio/nombor/sepuluh.mp3'
      ];
      const audioToPlay = isZero ? audios[0] : (audios[currentPoppedNext] || audios[1]);
      const textToSpeak = isZero ? 'sifar' : (names[currentPoppedNext] || `${currentPoppedNext}`);

      playAudioOrSpeak(audioToPlay, textToSpeak);

      // Pop burst effect with ball emoji
      const effectId = `${id}-${Date.now()}`;
      setPopEffects(prev => [...prev, { id: effectId, x, y, countNum: currentPoppedNext }]);
      setTimeout(() => {
        setPopEffects(prev => prev.filter(p => p.id !== effectId));
      }, 650);

      setBubbles(prev => {
        const next = prev.map(b => b.id === id ? { ...b, popped: true } : b);
        const newPopped = next.filter(b => b.popped).length;
        if (newPopped >= targetCount) {
          setTimeout(() => {
            onComplete();
            triggerTerbaik(onNext, 1600);
          }, 600);
        }
        return next;
      });
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={4} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={{ ...blueCardContainerStyle(isMobile), overflow: 'hidden' }}>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            position: 'relative',
            gap: '8px',
            zIndex: 10
          }}>
            <div style={{ width: isMobile ? '55px' : '85px', flexShrink: 0 }} />

            <div
              style={{
                background: 'white',
                borderRadius: '999px',
                padding: isMobile ? '8px 14px' : '10px 24px',
                border: '3px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                fontWeight: 800,
                fontSize: isMobile ? '0.85rem' : '1.05rem',
                color: '#1e293b',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Pecahkan buih bola</span>
              <ModernSoccerBall size={isMobile ? 20 : 24} />
              <span><strong>[{item.digit}]</strong>!</span>
            </div>

            <div
              style={{
                background: 'white',
                border: '2.5px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                borderRadius: '999px',
                padding: isMobile ? '6px 12px' : '8px 16px',
                fontWeight: 900,
                fontSize: isMobile ? '0.88rem' : '1rem',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-check" style={{ color: '#10b981', fontWeight: 900 }}></i>
              <span style={{ color: '#1e293b' }}>{poppedCount} / {targetCount}</span>
            </div>
          </div>

          <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden', minHeight: '340px' }}>
            {bubbles.map((bubble) => {
              if (bubble.popped) return null;
              return (
                <motion.button
                  key={bubble.id}
                  initial={{ y: '380px', left: `${bubble.left}%`, scale: 0.95 }}
                  animate={{
                    y: ['380px', '-90px'],
                    x: ['0px', '14px', '-14px', '0px']
                  }}
                  transition={{
                    y: { duration: bubble.speed, repeat: Infinity, ease: 'linear', delay: bubble.delay },
                    x: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => handleBubbleClick(e, bubble.id)}
                  style={{
                    position: 'absolute',
                    width: isMobile ? '82px' : '102px',
                    height: isMobile ? '82px' : '102px',
                    borderRadius: '50%',
                    border: '3.5px solid rgba(255, 255, 255, 0.95)',
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, ${bubble.color} 55%, rgba(0,0,0,0.2) 100%)`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.12), inset -2px -2px 6px rgba(0,0,0,0.15), inset 2px 2px 6px rgba(255,255,255,0.8)`,
                    color: 'white',
                    fontSize: isMobile ? '2.2rem' : '2.8rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    willChange: 'transform'
                  }}
                >
                  ?
                </motion.button>
              );
            })}

            {/* Ball Burst & Ripple Popup */}
            {popEffects.map((p) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0.4, opacity: 1, y: 0 }}
                animate={{ scale: [0.4, 1.35, 1.7], opacity: [1, 1, 0], y: -30 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: p.x,
                  top: p.y,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ModernSoccerBall size={isMobile ? 56 : 72} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 5: PASANGAN NOMBOR & PERKATAAN
  // -------------------------------------------------------------
  export function Activity5MatchPartnersNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const [merged1, setMerged1] = useState(false);
    const [merged2, setMerged2] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const merged1Ref = useRef(false);
    const merged2Ref = useRef(false);
    const lastAudioTimeRef = useRef(0);

    const playDebouncedAudio = () => {
      const now = Date.now();
      if (now - lastAudioTimeRef.current < 900) return;
      lastAudioTimeRef.current = now;
      playAudioOrSpeak(item.audio, item.name);
    };

    const handleConnectRow1 = () => {
      if (merged1Ref.current) return;
      merged1Ref.current = true;
      setMerged1(true);
      setHasInteracted(true);
      playDebouncedAudio();
    };

    const handleConnectRow2 = () => {
      if (merged2Ref.current) return;
      merged2Ref.current = true;
      setMerged2(true);
      setHasInteracted(true);
      playDebouncedAudio();
    };

    const completedRef = useRef(false);

    useEffect(() => {
      if (merged1 && merged2 && !completedRef.current) {
        completedRef.current = true;
        onComplete();
        triggerTerbaik(onNext, 1600);
      }
    }, [merged1, merged2, onNext]);

    const handleDragEndRow1 = (_e: any, info: any) => {
      if (merged1Ref.current) return;
      setHasInteracted(true);
      if (info.offset.x < -20 || info.point.x < window.innerWidth / 2) {
        handleConnectRow1();
      }
    };

    const handleDragEndRow2 = (_e: any, info: any) => {
      if (merged2Ref.current) return;
      setHasInteracted(true);
      if (info.offset.x < -20 || info.point.x < window.innerWidth / 2) {
        handleConnectRow2();
      }
    };

    const renderSyllablesColored = () => {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0px', fontWeight: 900, fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>
          {item.syllables.map((syl, i) => (
            <span key={i} style={{ color: i % 2 === 0 ? '#1e293b' : '#ef4444' }}>
              {syl}
            </span>
          ))}
        </span>
      );
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={(item.digit === '0' || mode === 'siri_nombor') ? 3 : 6} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          <div
            style={{
              background: 'white',
              borderRadius: '999px',
              padding: isMobile ? '8px 16px' : '10px 24px',
              border: '3px solid #1e293b',
              boxShadow: '0 2px 0 #1e293b',
              fontWeight: 800,
              fontSize: isMobile ? '0.92rem' : '1.1rem',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: isMobile ? '16px' : '24px',
              maxWidth: '90%'
            }}
          >
            Tarik & cantumkan puzzle nombor [<strong>{item.digit}</strong>] dengan perkataan berwarnanya!
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '20px' : '32px',
            width: '100%',
            maxWidth: '850px',
            position: 'relative'
          }}>
            {!hasInteracted && !merged1 && (
              <motion.div
                animate={{
                  left: isMobile ? ['68%', '32%', '32%', '68%'] : ['65%', '35%', '35%', '65%'],
                  top: ['16%', '16%', '16%', '16%'],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 0.9, 0.9, 1]
                }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: 25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width={isMobile ? "38" : "46"} height={isMobile ? "38" : "46"} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}>
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
            )}

            {/* PUSINGAN 1 */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {merged1 ? (
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    padding: '4px',
                    borderRadius: '26px',
                    border: '4px solid #1e293b',
                    boxShadow: '0 4px 0 #1e293b'
                  }}
                >
                  <div style={{
                    minWidth: isMobile ? '90px' : '150px',
                    height: isMobile ? '90px' : '140px',
                    background: '#facc15',
                    borderRadius: '20px 0 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? (item.digit.length > 3 ? '1.8rem' : '2.8rem') : (item.digit.length > 3 ? '2.6rem' : '4.4rem'),
                    fontWeight: 900,
                    color: '#431407',
                    padding: '0 16px',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {item.digit}
                  </div>
                  <div style={{
                    minWidth: isMobile ? '120px' : '210px',
                    height: isMobile ? '90px' : '140px',
                    background: '#ffffff',
                    borderRadius: '0 20px 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '1.8rem' : '2.8rem',
                    padding: '0 20px'
                  }}>
                    {renderSyllablesColored()}
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: isMobile ? '320px' : '580px',
                  position: 'relative',
                  minHeight: isMobile ? '95px' : '145px'
                }}>
                  <div
                    onClick={handleConnectRow1}
                    style={{
                      width: isMobile ? '100px' : '170px',
                      height: isMobile ? '90px' : '145px',
                      background: '#facc15',
                      borderRadius: '22px 6px 6px 22px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? (item.digit.length > 3 ? '1.8rem' : '2.6rem') : (item.digit.length > 3 ? '2.6rem' : '4.4rem'),
                      fontWeight: 900,
                      color: '#431407',
                      position: 'relative',
                      cursor: 'pointer',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                    }}
                  >
                    {item.digit}
                    <div style={{
                      position: 'absolute',
                      right: isMobile ? '-16px' : '-22px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '20px' : '26px',
                      height: isMobile ? '32px' : '48px',
                      background: '#facc15',
                      borderTop: '4px solid #1e293b',
                      borderRight: '4px solid #1e293b',
                      borderBottom: '4px solid #1e293b',
                      borderRadius: '0 12px 12px 0',
                      zIndex: 2
                    }} />
                  </div>

                  <motion.div
                    drag="x"
                    dragConstraints={{ top: 0, bottom: 0, right: 20, left: -240 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEndRow1}
                    onClick={handleConnectRow1}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      minWidth: isMobile ? '120px' : '210px',
                      height: isMobile ? '90px' : '145px',
                      background: '#ffffff',
                      borderRadius: '6px 22px 22px 6px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '1.5rem' : '2.8rem',
                      position: 'relative',
                      cursor: 'grab',
                      padding: isMobile ? '0 14px' : '0 20px',
                      touchAction: 'none'
                    }}
                  >
                    {renderSyllablesColored()}
                    <div style={{
                      position: 'absolute',
                      left: isMobile ? '-4px' : '-5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '16px' : '22px',
                      height: isMobile ? '32px' : '48px',
                      backgroundColor: '#eff6ff',
                      borderTop: '4px solid #1e293b',
                      borderRight: '4px solid #1e293b',
                      borderBottom: '4px solid #1e293b',
                      borderRadius: '0 12px 12px 0',
                      zIndex: 2
                    }} />
                  </motion.div>
                </div>
              )}
            </div>

            {/* PUSINGAN 2 */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {merged2 ? (
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    padding: '4px',
                    borderRadius: '26px',
                    border: '4px solid #1e293b',
                    boxShadow: '0 4px 0 #1e293b'
                  }}
                >
                  <div style={{
                    minWidth: isMobile ? '120px' : '210px',
                    height: isMobile ? '90px' : '140px',
                    background: '#ffffff',
                    borderRadius: '20px 0 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '1.8rem' : '2.8rem',
                    padding: '0 20px'
                  }}>
                    {renderSyllablesColored()}
                  </div>
                  <div style={{
                    minWidth: isMobile ? '90px' : '150px',
                    height: isMobile ? '90px' : '140px',
                    background: '#facc15',
                    borderRadius: '0 20px 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? (item.digit.length > 3 ? '1.8rem' : '2.8rem') : (item.digit.length > 3 ? '2.6rem' : '4.4rem'),
                    fontWeight: 900,
                    color: '#431407',
                    padding: '0 16px',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {item.digit}
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: isMobile ? '320px' : '580px',
                  position: 'relative',
                  minHeight: isMobile ? '95px' : '145px'
                }}>
                  <div
                    onClick={handleConnectRow2}
                    style={{
                      minWidth: isMobile ? '120px' : '210px',
                      height: isMobile ? '90px' : '145px',
                      background: '#ffffff',
                      borderRadius: '22px 6px 6px 22px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '1.5rem' : '2.8rem',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: isMobile ? '0 14px' : '0 20px'
                    }}
                  >
                    {renderSyllablesColored()}
                    <div style={{
                      position: 'absolute',
                      right: isMobile ? '-16px' : '-22px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '20px' : '26px',
                      height: isMobile ? '32px' : '48px',
                      background: '#ffffff',
                      borderTop: '4px solid #1e293b',
                      borderRight: '4px solid #1e293b',
                      borderBottom: '4px solid #1e293b',
                      borderRadius: '0 12px 12px 0',
                      zIndex: 2
                    }} />
                  </div>

                  <motion.div
                    drag="x"
                    dragConstraints={{ top: 0, bottom: 0, right: 20, left: -240 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEndRow2}
                    onClick={handleConnectRow2}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: isMobile ? '100px' : '170px',
                      height: isMobile ? '90px' : '145px',
                      background: '#facc15',
                      borderRadius: '6px 22px 22px 6px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? (item.digit.length > 3 ? '1.8rem' : '2.6rem') : (item.digit.length > 3 ? '2.6rem' : '4.4rem'),
                      fontWeight: 900,
                      color: '#431407',
                      position: 'relative',
                      cursor: 'grab',
                      touchAction: 'none',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                    }}
                  >
                    {item.digit}
                    <div style={{
                      position: 'absolute',
                      left: isMobile ? '-4px' : '-5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '16px' : '22px',
                      height: isMobile ? '32px' : '48px',
                      backgroundColor: '#eff6ff',
                      borderTop: '4px solid #1e293b',
                      borderRight: '4px solid #1e293b',
                      borderBottom: '4px solid #1e293b',
                      borderRadius: '0 12px 12px 0',
                      zIndex: 2
                    }} />
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 5: SURIH NOMBOR & PERKATAAN
  // -------------------------------------------------------------
  export function Activity6SurihNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const [subTab, setSubTab] = useState<'simbol' | 'perkataan'>('simbol');
    const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
    const [isEraser, setIsEraser] = useState<boolean>(false);
    const [simbolSaved, setSimbolSaved] = useState<boolean>(false);
    const [perkataanSaved, setPerkataanSaved] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ text: string; type: 'warning' | 'success' } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef<boolean>(false);
    const hasDrawnSimbolRef = useRef<boolean>(false);
    const hasDrawnPerkataanRef = useRef<boolean>(false);
    const simbolCanvasDataRef = useRef<string | null>(null);
    const perkataanCanvasDataRef = useRef<string | null>(null);
    const notifTimeoutRef = useRef<any>(null);

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#1e293b'];

    const showNotification = (text: string, type: 'warning' | 'success') => {
      if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
      setNotification({ text, type });
      notifTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 4000);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (subTab === 'simbol') {
        hasDrawnSimbolRef.current = false;
        simbolCanvasDataRef.current = null;
        setSimbolSaved(false);
      } else {
        hasDrawnPerkataanRef.current = false;
        perkataanCanvasDataRef.current = null;
        setPerkataanSaved(false);
      }
    };

    // Reset when item changes
    useEffect(() => {
      setSimbolSaved(false);
      setPerkataanSaved(false);
      hasDrawnSimbolRef.current = false;
      hasDrawnPerkataanRef.current = false;
      simbolCanvasDataRef.current = null;
      perkataanCanvasDataRef.current = null;
      setSubTab('simbol');
      setNotification(null);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, [item.id]);

    const switchTab = (newTab: 'simbol' | 'perkataan') => {
      if (newTab === subTab) return;
      playNavSound();
      const canvas = canvasRef.current;
      if (canvas) {
        const currentData = canvas.toDataURL();
        if (subTab === 'simbol') {
          simbolCanvasDataRef.current = currentData;
        } else {
          perkataanCanvasDataRef.current = currentData;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const targetData = newTab === 'simbol' ? simbolCanvasDataRef.current : perkataanCanvasDataRef.current;
          if (targetData) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
            };
            img.src = targetData;
          }
        }
      }
      setSubTab(newTab);
      setNotification(null);
    };

    const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      if (subTab === 'simbol') {
        hasDrawnSimbolRef.current = true;
      } else {
        hasDrawnPerkataanRef.current = true;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCanvasPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = isMobile ? 22 : 30;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = isMobile ? (subTab === 'simbol' ? 8 : 6) : (subTab === 'simbol' ? 16 : 12);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCanvasPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const handleSave = () => {
      const hasDrawn = subTab === 'simbol' ? hasDrawnSimbolRef.current : hasDrawnPerkataanRef.current;
      if (!hasDrawn) {
        playErrorSound();
        showNotification(`Sila surih dahulu sebelum simpan!`, 'warning');
        return;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        if (subTab === 'simbol') {
          simbolCanvasDataRef.current = dataUrl;
          setSimbolSaved(true);
        } else {
          perkataanCanvasDataRef.current = dataUrl;
          setPerkataanSaved(true);
        }
      }

      playPopSound();
      showNotification("Berjaya disimpan!", 'success');
    };

    const handleHantar = () => {
      if (!simbolSaved && !perkataanSaved) {
        playErrorSound();
        showNotification("Sila selesaikan dan simpan kedua-dua Surih Simbol dan Surih Perkataan dahulu!", 'warning');
        return;
      }
      if (!simbolSaved) {
        playErrorSound();
        showNotification("Surih Simbol belum disimpan! Sila surih simbol nombor dan tekan butang simpan.", 'warning');
        return;
      }
      if (!perkataanSaved) {
        playErrorSound();
        showNotification("Surih Perkataan belum disimpan! Sila surih perkataan nombor dan tekan butang simpan.", 'warning');
        return;
      }

      playSuccessCelebration();
      onComplete();
      triggerTerbaik(onNext, 1600);
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={(item.digit === '0' || mode === 'siri_nombor') ? 2 : 5} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          {/* Top Sub-tabs: Simbol Nombor vs Perkataan Nombor */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '14px',
            marginBottom: '14px',
            width: '100%',
            maxWidth: '520px'
          }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchTab('simbol')}
              style={{
                flex: 1,
                padding: isMobile ? '8px 12px' : '10px 18px',
                borderRadius: '16px',
                border: '3px solid #1e293b',
                boxShadow: '0 2.5px 0 #1e293b',
                background: subTab === 'simbol' ? '#ec4899' : '#ffffff',
                color: subTab === 'simbol' ? '#ffffff' : '#1e293b',
                fontWeight: 900,
                fontSize: isMobile ? '0.88rem' : '1.05rem',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-pen-nib"></i>
              <span>Surih Simbol</span>
              {simbolSaved && (
                <span style={{
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '1px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}>
                  ✓
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchTab('perkataan')}
              style={{
                flex: 1,
                padding: isMobile ? '8px 12px' : '10px 18px',
                borderRadius: '16px',
                border: '3px solid #1e293b',
                boxShadow: '0 2.5px 0 #1e293b',
                background: subTab === 'perkataan' ? '#ec4899' : '#ffffff',
                color: subTab === 'perkataan' ? '#ffffff' : '#1e293b',
                fontWeight: 900,
                fontSize: isMobile ? '0.88rem' : '1.05rem',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-pen-nib"></i>
              <span>Surih Perkataan</span>
              {perkataanSaved && (
                <span style={{
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '1px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}>
                  ✓
                </span>
              )}
            </motion.button>
          </div>

          {/* Dynamic Notification Toast with Modern Icons */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: '12px',
                  padding: isMobile ? '8px 16px' : '10px 24px',
                  borderRadius: '16px',
                  background: notification.type === 'success' ? '#ecfdf5' : '#fffbeb',
                  border: notification.type === 'success' ? '2.5px solid #10b981' : '2.5px solid #f59e0b',
                  boxShadow: '0 2.5px 0 #1e293b',
                  color: notification.type === 'success' ? '#065f46' : '#92400e',
                  fontSize: isMobile ? '0.88rem' : '1.02rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  textAlign: 'center',
                  maxWidth: '92%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {notification.type === 'success' ? (
                  <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
                ) : (
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b', fontSize: '1.15rem' }}></i>
                )}
                <span>{notification.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Tracing Board */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? '340px' : '580px',
            height: isMobile ? '230px' : '270px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '3.5px solid #1e293b',
            boxShadow: '0 4px 0 #1e293b',
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
          }}>
            {/* Guide Outline Text in Background (Extra Large & Clear) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 1,
                fontSize: isMobile 
                  ? (subTab === 'simbol' 
                      ? (item.digit.length > 2 ? '9rem' : (item.digit.length === 2 ? '11rem' : '14rem')) 
                      : (item.name.length > 9 ? '3.5rem' : (item.name.length > 6 ? '4.8rem' : '6.4rem')))
                  : (subTab === 'simbol' 
                      ? (item.digit.length > 2 ? '10rem' : (item.digit.length === 2 ? '12.5rem' : '15.5rem')) 
                      : (item.name.length > 9 ? '4.5rem' : (item.name.length > 5 ? '6.6rem' : '8.5rem'))),
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                color: 'rgba(203, 213, 225, 0.45)',
                letterSpacing: subTab === 'simbol' ? '0px' : '2px',
                textAlign: 'center',
                padding: '10px',
                lineHeight: 1
              }}
            >
              {subTab === 'simbol' ? item.digit : item.name}
            </div>

            {/* Tracing Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={isMobile ? 340 : 580}
              height={isMobile ? 230 : 270}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                cursor: isEraser ? 'cell' : 'crosshair',
                touchAction: 'none'
              }}
            />

            {/* Audio Button on Top Right of Tracing Board */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => playAudioOrSpeak(item.audio, item.name)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '50%',
                background: '#facc15',
                border: '2.5px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Dengar Sebutan"
            >
              <i className="fa-solid fa-volume-high"></i>
            </motion.button>
          </div>

          {/* Color Palette & Tools Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: isMobile ? '340px' : '560px',
            marginTop: '12px',
            gap: '8px'
          }}>
            {/* Palette Circles */}
            <div style={{ display: 'flex', gap: isMobile ? '4px' : '8px', alignItems: 'center' }}>
              {colors.map(col => (
                <motion.button
                  key={col}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsEraser(false);
                    setSelectedColor(col);
                  }}
                  style={{
                    width: isMobile ? '26px' : '34px',
                    height: isMobile ? '26px' : '34px',
                    borderRadius: '50%',
                    background: col,
                    border: selectedColor === col && !isEraser ? '3.5px solid #ffffff' : '2.5px solid #1e293b',
                    boxShadow: selectedColor === col && !isEraser ? '0 0 0 2.5px #1e293b' : '0 2px 0 #1e293b',
                    cursor: 'pointer',
                    padding: 0
                  }}
                />
              ))}
            </div>

            {/* Tools: Clear & Save */}
            <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px', alignItems: 'center' }}>
              {/* Butang Padam Semua (Merah) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={clearCanvas}
                style={{
                  width: isMobile ? '34px' : '38px',
                  height: isMobile ? '34px' : '38px',
                  borderRadius: '12px',
                  background: '#ef4444',
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.95rem' : '1.1rem'
                }}
                title="Padam Semua"
              >
                <i className="fa-solid fa-trash-can"></i>
              </motion.button>

              {/* Butang Save Warna Biru (Icon Sahaja) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleSave}
                style={{
                  width: isMobile ? '34px' : '38px',
                  height: isMobile ? '34px' : '38px',
                  borderRadius: '12px',
                  background: (subTab === 'simbol' ? simbolSaved : perkataanSaved) ? '#10b981' : '#0284c7',
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.95rem' : '1.15rem'
                }}
                title={(subTab === 'simbol' ? simbolSaved : perkataanSaved) ? 'Hasil surih telah disimpan' : 'Simpan hasil surih'}
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </motion.button>
            </div>
          </div>

          {/* Butang Hantar (Hijau Profil Murid) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHantar}
            style={{
              marginTop: '16px',
              background: '#168f81',
              color: '#ffffff',
              border: '3px solid #1e293b',
              boxShadow: '0 3.5px 0 #1e293b',
              borderRadius: '999px',
              padding: isMobile ? '10px 34px' : '12px 46px',
              fontSize: isMobile ? '1.05rem' : '1.25rem',
              fontWeight: 900,
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            title="Hantar Hasil Surih"
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>Hantar</span>
          </motion.button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AKTIVITI 7: SAMBUNG GARISAN NOMBOR
  // -------------------------------------------------------------
  export function Activity7MatchAudioNombor({ item, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik, dataset }: NomborActivityProps) {
    const currentConfig = NOMBOR_MODE_CONFIGS[mode] || NOMBOR_MODE_CONFIGS.bilang_0_10;
    const availableList = (dataset && dataset.length > 2) ? dataset : ASAS_0_10_DATABASE;
    const distractors = availableList.filter(d => d.id !== item.id).slice(0, 2);
    const [audioOptions] = useState(() => {
      const list = [
        { id: 'target', item: item, isTarget: true },
        { id: 'd1', item: distractors[0] || availableList[0], isTarget: false },
        { id: 'd2', item: distractors[1] || availableList[1], isTarget: false }
      ];
      return list.sort(() => Math.random() - 0.5);
    });

    const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
    const [connectedId, setConnectedId] = useState<string | null>(null);
    const [connectedCoordinates, setConnectedCoordinates] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const [dragLine, setDragLine] = useState<{ startX: number; startY: number; currX: number; currY: number } | null>(null);
    const [shakeError, setShakeError] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const stageRef = useRef<HTMLDivElement>(null);
    const speakerKnobRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const targetKnobRef = useRef<HTMLDivElement>(null);

    const getKnobCenter = (el: HTMLElement | null) => {
      if (!el || !stageRef.current) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const sr = stageRef.current.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - sr.left,
        y: r.top + r.height / 2 - sr.top
      };
    };

    const handleStartDrag = (e: React.PointerEvent, opt: typeof audioOptions[0]) => {
      e.stopPropagation();
      setHasInteracted(true);
      setActiveSpeakerId(opt.id);
      playAudioOrSpeak(opt.item.audio, opt.item.name);

      const knobEl = speakerKnobRefs.current[opt.id];
      const startPt = getKnobCenter(knobEl);

      const stageRect = stageRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      setDragLine({
        startX: startPt.x,
        startY: startPt.y,
        currX: e.clientX - stageRect.left,
        currY: e.clientY - stageRect.top
      });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!dragLine || !stageRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      setDragLine(prev => prev ? {
        ...prev,
        currX: e.clientX - stageRect.left,
        currY: e.clientY - stageRect.top
      } : null);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!dragLine) return;

      if (targetKnobRef.current && stageRef.current) {
        const targetRect = targetKnobRef.current.getBoundingClientRect();
        if (
          e.clientX >= targetRect.left - 45 &&
          e.clientX <= targetRect.right + 45 &&
          e.clientY >= targetRect.top - 45 &&
          e.clientY <= targetRect.bottom + 45
        ) {
          checkMatch(activeSpeakerId);
        }
      }
      setDragLine(null);
    };

    const checkMatch = (speakerId: string | null) => {
      const selected = audioOptions.find(a => a.id === speakerId);
      if (selected && selected.isTarget) {
        const startPt = getKnobCenter(speakerKnobRefs.current[selected.id]);
        const endPt = getKnobCenter(targetKnobRef.current);

        setConnectedId(selected.id);
        setConnectedCoordinates({
          startX: startPt.x,
          startY: startPt.y,
          endX: endPt.x,
          endY: endPt.y
        });

        playAudioOrSpeak(item.audio, item.name);
        onComplete();
        triggerTerbaik(onNext);
      } else {
        playErrorSound();
        setShakeError(true);
        setTimeout(() => {
          setShakeError(false);
          setActiveSpeakerId(null);
        }, 600);
      }
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: MAIN_APP_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={(item.digit === '0' || mode === 'siri_nombor') ? 4 : 7} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          <div
            style={{
              background: 'white',
              borderRadius: '999px',
              padding: isMobile ? '8px 16px' : '10px 24px',
              border: '3px solid #1e293b',
              boxShadow: '0 2px 0 #1e293b',
              fontWeight: 800,
              fontSize: isMobile ? '0.92rem' : '1.1rem',
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '90%'
            }}
          >
            <span>Dengar 3 audio di kiri, tarik garisan audio yang sepadan ke nombor <strong>[{item.digit}]</strong>.</span>
          </div>

          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '580px',
              width: '100%',
              position: 'relative',
              touchAction: 'none',
              minHeight: '300px'
            }}
          >
            {/* Animated Hand Cursor like FonikAbcGame */}
            {!hasInteracted && !connectedId && (
              <motion.div
                animate={{
                  left: isMobile ? ['105px', '225px', '225px', '105px'] : ['130px', '435px', '435px', '130px'],
                  top: isMobile ? ['36px', '136px', '136px', '36px'] : ['40px', '136px', '136px', '40px'],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 0.9, 0.9, 1]
                }}
                transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: 25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width={isMobile ? "36" : "44"} height={isMobile ? "36" : "44"} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}>
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
            )}

            {/* SVG Connecting Drag Line & Success Line */}
            <svg style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 4
            }}>
              {dragLine && (
                <line
                  x1={dragLine.startX}
                  y1={dragLine.startY}
                  x2={dragLine.currX}
                  y2={dragLine.currY}
                  stroke="#ff7a00"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />
              )}

              {connectedCoordinates && (
                <line
                  x1={connectedCoordinates.startX}
                  y1={connectedCoordinates.startY}
                  x2={connectedCoordinates.endX}
                  y2={connectedCoordinates.endY}
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 10px #10b981)' }}
                />
              )}
            </svg>

            {/* Left Column: 3 Speaker Buttons with Knob Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px', zIndex: 5 }}>
              {audioOptions.map((opt) => {
                const isSelected = activeSpeakerId === opt.id;
                const isMatch = connectedId === opt.id;

                return (
                  <div
                    key={opt.id}
                    style={{ position: 'relative', display: 'inline-flex' }}
                  >
                    <motion.button
                      onPointerDown={(e) => handleStartDrag(e, opt)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        width: isMobile ? '100px' : '135px',
                        height: isMobile ? '82px' : '100px',
                        borderRadius: '20px',
                        border: '3.5px solid #1e293b',
                        background: isMatch ? '#10b981' : isSelected ? '#ff7a00' : '#ffffff',
                        boxShadow: isSelected ? '0 0 14px #ff7a00' : '0 2.5px 0 #1e293b',
                        color: isSelected || isMatch ? 'white' : '#1e293b',
                        cursor: 'grab',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className="fa-solid fa-volume-high" style={{ fontSize: isMobile ? '1.7rem' : '2.2rem' }}></i>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900 }}>Dengar</span>
                    </motion.button>

                    <div
                      ref={(el) => (speakerKnobRefs.current[opt.id] = el)}
                      onPointerDown={(e) => handleStartDrag(e, opt)}
                      style={{
                        position: 'absolute',
                        right: '-9px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: isMatch ? '#10b981' : isSelected ? '#ff7a00' : '#f59e0b',
                        border: '2.5px solid #1e293b',
                        boxShadow: isMatch || isSelected ? '0 0 10px #ff7a00' : 'none',
                        cursor: 'crosshair',
                        zIndex: 6
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Right Column: 1 Target Number Card with Left Knob Point */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, position: 'relative' }}
            >
              <motion.button
                animate={
                  connectedId
                    ? { scale: [1, 1.15, 1] }
                    : shakeError
                      ? { x: [-10, 10, -10, 10, 0] }
                      : {}
                }
                transition={{ duration: 0.4 }}
                onClick={() => checkMatch(activeSpeakerId)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  width: isMobile ? (item.digit.length > 3 ? '135px' : '110px') : (item.digit.length > 3 ? '175px' : '145px'),
                  height: isMobile ? '110px' : '145px',
                  borderRadius: '24px',
                  border: '3.5px solid #1e293b',
                  background: connectedId ? '#10b981' : '#ffffff',
                  boxShadow: connectedId ? '0 3px 0 #059669, 0 0 20px rgba(16, 185, 129, 0.8)' : '0 2.5px 0 #1e293b',
                  color: connectedId ? 'white' : '#1e293b',
                  fontSize: isMobile ? (item.digit.length > 3 ? '2rem' : '3.5rem') : (item.digit.length > 3 ? '2.6rem' : '4.6rem'),
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {item.digit}
              </motion.button>

              <div
                ref={targetKnobRef}
                onClick={() => checkMatch(activeSpeakerId)}
                style={{
                  position: 'absolute',
                  left: '-11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: connectedId ? '#10b981' : '#f59e0b',
                  border: '3px solid #1e293b',
                  boxShadow: connectedId ? '0 0 10px #10b981' : 'none',
                  cursor: 'pointer',
                  zIndex: 6
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

