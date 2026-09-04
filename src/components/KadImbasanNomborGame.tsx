import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASAS_0_10_DATABASE, SIRI_NOMBOR_DATABASE, NomborItem } from './NomborGame';

export type KadImbasanNomborMode = 'bilang_0_10' | 'siri_nombor';

interface KadImbasanNomborGameProps {
  initialMode?: KadImbasanNomborMode;
  onBack: () => void;
}

const ModernSoccerBall = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.22))' }}>
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

const ModernTapCursor = ({ isMobile }: { isMobile: boolean }) => (
  <motion.div
    initial={{ opacity: 0.9, scale: 1 }}
    animate={{
      scale: [1, 0.86, 1],
      rotate: [-12, -22, -12],
      y: [0, -4, 0]
    }}
    transition={{
      duration: 1.4,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    style={{
      position: 'absolute',
      bottom: isMobile ? '8px' : '12px',
      right: isMobile ? '8px' : '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 15,
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))'
    }}
  >
    <svg width={isMobile ? "30" : "36"} height={isMobile ? "30" : "36"} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="5" r="3.5" stroke="#ff7a00" strokeWidth="2" opacity="0.85" />
      <circle cx="8" cy="5" r="5.5" stroke="#ffe24a" strokeWidth="1.5" opacity="0.55" />
      <path
        d="M9 11V4.5C9 3.67 8.33 3 7.5 3C6.67 3 6 3.67 6 4.5V12.5L4.85 11.27C4.33 10.74 3.49 10.74 2.97 11.27C2.45 11.8 2.45 12.64 2.97 13.17L7.6 17.8C8.5 18.7 9.7 19.2 11 19.2H14.5C16.99 19.2 19 17.19 19 14.7V10.5C19 9.67 18.33 9 17.5 9C17.3 9 17.1 9.04 16.92 9.12C16.66 8.46 16.03 8 15.28 8C15.05 8 14.83 8.05 14.63 8.15C14.33 7.46 13.65 7 12.85 7C12.65 7 12.45 7.04 12.27 7.12C12.01 6.46 11.38 6 10.63 6C9.73 6 9 6.73 9 7.63V11Z"
        fill="#ffffff"
        stroke="#10182f"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

export function KadImbasanNomborGame({ initialMode = 'bilang_0_10', onBack }: KadImbasanNomborGameProps) {
  const [mode, setMode] = useState<KadImbasanNomborMode>(initialMode);
  const [index, setIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  const currentDataset: NomborItem[] = mode === 'bilang_0_10' ? ASAS_0_10_DATABASE : SIRI_NOMBOR_DATABASE;
  const currentItem: NomborItem = currentDataset[index] || currentDataset[0];

  // Number of bubbles for the current active item
  const totalBubbles = mode === 'bilang_0_10'
    ? currentItem.count
    : Math.max(1, Math.floor(currentItem.count / 10));

  const [poppedBubbles, setPoppedBubbles] = useState<boolean[]>(() => Array(totalBubbles).fill(false));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync with initialMode when prop changes
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setIndex(0);
      setIsFlipped(false);
    }
  }, [initialMode]);

  // Reset flipped card and bubbles when changing number or mode
  useEffect(() => {
    setIsFlipped(false);
    setPoppedBubbles(Array(totalBubbles).fill(false));
  }, [index, mode, totalBubbles]);

  const handleNext = () => {
    setIsFlipped(false);
    if (index < currentDataset.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(currentDataset.length - 1);
    }
  };

  const playAudio = () => {
    if (!currentItem) return;
    try {
      if (currentItem.audio) {
        const audio = new Audio(currentItem.audio);
        audio.play().catch(() => {
          speakFallback(currentItem.name);
        });
      } else {
        speakFallback(currentItem.name);
      }
    } catch {
      speakFallback(currentItem.name);
    }
  };

  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const speakFallback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ms-MY';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handlePopBubble = (bIdx: number) => {
    playPopSound();

    const isCurrentlyPopped = !!poppedBubbles[bIdx];
    const currentPoppedCount = poppedBubbles.filter(Boolean).length;
    const newPoppedCount = isCurrentlyPopped
      ? Math.max(0, currentPoppedCount - 1)
      : currentPoppedCount + 1;

    setPoppedBubbles((prev) => {
      const next = [...prev];
      next[bIdx] = !next[bIdx];
      return next;
    });

    // Mainkan audio mengikut bilangan buih yang ditekan waktu itu (bukan mengikut posisi buih)
    if (!isCurrentlyPopped && newPoppedCount > 0) {
      const asasAudioFiles = [
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

      const siriAudioFiles = [
        '/audio/nombor/sepuluh.mp3',
        '/audio/nombor/dua-puluh.mp3',
        '/audio/nombor/tiga-puluh.mp3',
        '/audio/nombor/empat-puluh.mp3',
        '/audio/nombor/lima-puluh.mp3',
        '/audio/nombor/enam-puluh.mp3',
        '/audio/nombor/tujuh-puluh.mp3',
        '/audio/nombor/lapan-puluh.mp3',
        '/audio/nombor/sembilan-puluh.mp3',
        '/audio/nombor/seratus.mp3'
      ];

      const countIndex = newPoppedCount - 1;
      const targetAudioSrc = mode === 'bilang_0_10' ? asasAudioFiles[countIndex] : siriAudioFiles[countIndex];
      const countNames = mode === 'bilang_0_10'
        ? ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh']
        : ['sepuluh', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'lapan puluh', 'sembilan puluh', 'seratus'];
      const speakText = countNames[countIndex] || `${newPoppedCount}`;

      if (targetAudioSrc) {
        const audio = new Audio(targetAudioSrc);
        audio.play().catch(() => {
          speakFallback(speakText);
        });
      } else {
        speakFallback(speakText);
      }
    }
  };

  const renderSyllablesColored = (syls: string[], name?: string) => {
    // Jika perkataan mengandungi jarak (cth: "dua puluh", "lapan puluh")
    if (name && name.includes(' ')) {
      // 2 suku kata terakhir adalah perkataan kedua ("pu", "luh")
      const firstWordSyls = syls.slice(0, Math.max(1, syls.length - 2));
      const lastWordSyls = syls.slice(Math.max(1, syls.length - 2));

      return (
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: isMobile ? '12px' : '18px',
            rowGap: '6px',
            fontWeight: 900,
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
            textAlign: 'center',
            maxWidth: '100%'
          }}
        >
          {/* Perkataan Pertama (cth: "dua", "lapan", "sembilan") */}
          <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {firstWordSyls.map((syl, i) => (
              <span key={i} style={{ color: i % 2 === 0 ? '#10182f' : '#ff3f46' }}>
                {syl}
              </span>
            ))}
          </span>

          {/* Perkataan Kedua (cth: "puluh") */}
          <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {lastWordSyls.map((syl, i) => (
              <span key={i} style={{ color: i % 2 === 0 ? '#10182f' : '#ff3f46' }}>
                {syl}
              </span>
            ))}
          </span>
        </div>
      );
    }

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0px', fontWeight: 900, fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>
        {syls.map((syl, i) => (
          <span key={i} style={{ color: i % 2 === 0 ? '#10182f' : '#ff3f46' }}>
            {syl}
          </span>
        ))}
      </span>
    );
  };

  const renderFrontVisual = () => {
    // Number Box for Siri Nombor & 0-10 (Termasuk Sifar Kotak Biru)
    const cardBg = mode === 'siri_nombor' ? '#bae6fd' : '#e0f2fe';
    const borderColor = mode === 'siri_nombor' ? '#38bdf8' : '#7dd3fc';
    const shadowColor = mode === 'siri_nombor' ? '#0284c7' : '#0369a1';

    return (
      <div
        style={{
          width: isMobile ? '110px' : '140px',
          height: isMobile ? '110px' : '140px',
          backgroundColor: cardBg,
          border: `4px solid ${borderColor}`,
          borderRadius: isMobile ? '22px' : '26px',
          boxShadow: `0 4px 0 ${shadowColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? (currentItem.digit.length > 2 ? '3rem' : '4rem') : (currentItem.digit.length > 2 ? '3.8rem' : '5rem'),
          fontWeight: 900,
          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
          color: '#10182f',
          userSelect: 'none'
        }}
      >
        {currentItem.digit}
      </div>
    );
  };

  const poppedCount = poppedBubbles.filter(Boolean).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '16px 12px 32px 12px' : '24px 20px 40px 20px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          width: '100%',
          maxWidth: '850px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isMobile ? '36px' : '46px',
          zIndex: 20,
          position: 'relative'
        }}
      >
        <button
          className="neo-btn bg-orange"
          onClick={onBack}
          style={{
            cursor: 'pointer',
            flexShrink: 0,
            width: isMobile ? '42px' : '48px',
            height: isMobile ? '42px' : '48px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.15rem' : '1.3rem',
            padding: 0,
            color: 'white'
          }}
          aria-label="Kembali"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        {/* Center Mode Switcher Button */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: 'calc(100% - 100px)' }}>
          <button
            className="neo-btn bg-orange"
            onClick={() => {
              const newMode: KadImbasanNomborMode = mode === 'bilang_0_10' ? 'siri_nombor' : 'bilang_0_10';
              setMode(newMode);
              setIndex(0);
              setIsFlipped(false);
            }}
            style={{
              fontSize: isMobile ? '0.95rem' : '1.3rem',
              fontWeight: 900,
              padding: isMobile ? '8px 18px' : '10px 36px',
              borderRadius: isMobile ? '16px' : '22px',
              letterSpacing: '0.5px',
              userSelect: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            {mode === 'bilang_0_10' ? 'Bilang 0 - 10' : 'Bilang Siri Nombor'}
          </button>
        </div>

        <div style={{ width: isMobile ? '42px' : '48px' }} />
      </div>

      {/* Main Flashcard Container */}
      {!isMobile ? (
        /* LAPTOP VIEW: Dual Side-by-Side Cards matching Fonik Suku Kata */
        <div
          style={{
            width: '100%',
            maxWidth: '820px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {/* LEFT CARD: BILANGAN */}
          <div
            style={{
              background: '#e0f2fe',
              backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
              backgroundSize: '20px 20px',
              borderRadius: '20px',
              border: '4px solid #10182f',
              boxShadow: '0 4px 0 #10182f',
              padding: '40px 20px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: '290px',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Pill: Bilangan */}
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                background: '#ff7a00',
                border: '3.5px solid #10182f',
                boxShadow: '0 2.5px 0 #10182f',
                borderRadius: '18px',
                padding: '8px 36px',
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                userSelect: 'none',
                zIndex: 5
              }}
            >
              Bilangan
            </div>

            {/* 3D FLIP CARD CONTAINER */}
            <div style={{ position: 'relative' }}>
              {/* Speaker Icon Button on top-right of inner card */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-14px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#ffe24a',
                  border: '3px solid #10182f',
                  boxShadow: '0 2px 0 #10182f',
                  color: '#10182f',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
                title="Dengar Sebutan"
              >
                <i className="fa-solid fa-volume-high"></i>
              </motion.button>

              {/* 3D Flip Card */}
              <div
                style={{
                  perspective: 1000,
                  width: '240px',
                  height: '230px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (mode !== 'siri_nombor') {
                    setIsFlipped(!isFlipped);
                  }
                  playAudio();
                }}
                title={mode === 'siri_nombor' ? "Tekan untuk dengar sebutan" : "Tekan untuk flip kad"}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: (mode !== 'siri_nombor' && isFlipped) ? 180 : 0 }}
                  transition={{ duration: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96, y: 1 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* FRONT FACE (Digit / Number Representation with neat continuous outline glow and staying tap cursor) */}
                  <div
                    className={(!isFlipped || mode === 'siri_nombor') ? "kad-nombor-front-glow" : ""}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      background: '#ffffff',
                      border: '3.5px solid #10182f',
                      borderRadius: '24px',
                      boxShadow: '0 4px 0 #10182f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {renderFrontVisual()}
                    <ModernTapCursor isMobile={false} />
                  </div>

                  {/* BACK FACE (Picture Image from /images/nombor/ - Hanya untuk nombor 0-10) */}
                  {mode !== 'siri_nombor' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: '#ffffff',
                        border: '3.5px solid #10182f',
                        borderRadius: '24px',
                        boxShadow: '0 4px 0 #10182f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {currentItem.image ? (
                        <img
                          src={currentItem.image}
                          alt={currentItem.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            userSelect: 'none'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10182f' }}>
                          {currentItem.name}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: NOMBOR */}
          <div
            style={{
              background: '#e0f2fe',
              backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
              backgroundSize: '20px 20px',
              borderRadius: '20px',
              border: '4px solid #10182f',
              boxShadow: '0 4px 0 #10182f',
              padding: '40px 20px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              minHeight: '290px',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Pill: Nombor */}
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                background: '#a855f7',
                border: '3.5px solid #10182f',
                boxShadow: '0 2.5px 0 #10182f',
                borderRadius: '18px',
                padding: '8px 36px',
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                userSelect: 'none',
                zIndex: 5
              }}
            >
              Nombor
            </div>

            {/* List Button on top-right */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowListModal(true)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-10px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#ffe24a',
                border: '3px solid #10182f',
                boxShadow: '0 2px 0 #10182f',
                color: '#10182f',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Senarai Nombor"
            >
              <i className="fa-solid fa-list"></i>
            </motion.button>

            {/* Syllables Box (Interactive & Clickable for Audio) */}
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03, y: -2, boxShadow: '0 6px 0 #10182f, 0 8px 16px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.96, y: 1, boxShadow: '0 2px 0 #10182f' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={playAudio}
              style={{
                background: '#ffffff',
                border: '3.5px solid #10182f',
                borderRadius: '20px',
                boxShadow: '0 4px 0 #10182f',
                width: '100%',
                minHeight: '135px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                marginTop: '10px',
                userSelect: 'none'
              }}
              title="Tekan untuk dengar sebutan perkataan"
            >
              <div
                style={{
                  fontSize: currentItem.name.length > 9 ? '2.8rem' : '3.4rem',
                  textAlign: 'center',
                  lineHeight: 1.15,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {renderSyllablesColored(currentItem.syllables, currentItem.name)}
              </div>
            </motion.div>

            {/* Nav Arrows */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                style={{
                  background: '#a855f7',
                  color: 'white',
                  border: '3px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  borderRadius: '14px',
                  padding: '12px 28px',
                  fontSize: '1.6rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                style={{
                  background: '#a855f7',
                  color: 'white',
                  border: '3px solid #10182f',
                  boxShadow: '0 3px 0 #10182f',
                  borderRadius: '14px',
                  padding: '12px 28px',
                  fontSize: '1.6rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        /* MOBILE VIEW: Stacked Unified Card matching Suku Kata mobile */
        <div
          style={{
            width: '100%',
            maxWidth: '350px',
            background: '#e0f2fe',
            backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
            backgroundSize: '20px 20px',
            borderRadius: '20px',
            border: '4px solid #10182f',
            boxShadow: '0 4px 0 #10182f',
            padding: '36px 14px 20px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            gap: '16px'
          }}
        >
          {/* Top Pill: Bilangan */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              background: '#ff7a00',
              border: '3px solid #10182f',
              boxShadow: '0 2px 0 #10182f',
              borderRadius: '16px',
              padding: '6px 28px',
              color: 'white',
              fontSize: '1.15rem',
              fontWeight: 900,
              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
              userSelect: 'none',
              zIndex: 5
            }}
          >
            Bilangan
          </div>

          {/* List Button on top-right */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => setShowListModal(true)}
            style={{
              position: 'absolute',
              top: '-14px',
              right: '-10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffe24a',
              border: '3px solid #10182f',
              boxShadow: '0 2px 0 #10182f',
              color: '#10182f',
              fontSize: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <i className="fa-solid fa-list"></i>
          </motion.button>

          {/* Center Card Row flanked by Prev & Next Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', marginTop: '6px' }}>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handlePrev}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#a855f7',
                color: 'white',
                border: '2.5px solid #10182f',
                boxShadow: '0 2px 0 #10182f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </motion.button>

            {/* 3D Flip Card Container on Mobile */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffe24a',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 2px 0 #10182f',
                  color: '#10182f',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                <i className="fa-solid fa-volume-high"></i>
              </motion.button>

              <div
                style={{
                  perspective: 1000,
                  width: '175px',
                  height: '165px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (mode !== 'siri_nombor') {
                    setIsFlipped(!isFlipped);
                  }
                  playAudio();
                }}
                title={mode === 'siri_nombor' ? "Tekan untuk dengar sebutan" : "Tekan untuk flip kad"}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: (mode !== 'siri_nombor' && isFlipped) ? 180 : 0 }}
                  transition={{ duration: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* FRONT FACE (Mobile with neat continuous outline glow and staying tap cursor) */}
                  <div
                    className={(!isFlipped || mode === 'siri_nombor') ? "kad-nombor-front-glow" : ""}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      background: '#ffffff',
                      border: '3px solid #10182f',
                      borderRadius: '22px',
                      boxShadow: '0 3px 0 #10182f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {renderFrontVisual()}
                    <ModernTapCursor isMobile={true} />
                  </div>

                  {/* BACK FACE (Mobile - Hanya untuk nombor 0-10) */}
                  {mode !== 'siri_nombor' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: '#ffffff',
                        border: '3px solid #10182f',
                        borderRadius: '22px',
                        boxShadow: '0 3px 0 #10182f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {currentItem.image ? (
                        <img
                          src={currentItem.image}
                          alt={currentItem.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            userSelect: 'none'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10182f' }}>
                          {currentItem.name}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleNext}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#a855f7',
                color: 'white',
                border: '2.5px solid #10182f',
                boxShadow: '0 2px 0 #10182f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </motion.button>
          </div>

          {/* Bottom Syllables Box (Interactive & Clickable for Audio) */}
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={playAudio}
            style={{
              background: '#ffffff',
              border: '3px solid #10182f',
              borderRadius: '18px',
              boxShadow: '0 3px 0 #10182f',
              width: '100%',
              minHeight: '88px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 14px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Tekan untuk dengar sebutan perkataan"
          >
            <div
              style={{
                fontSize: currentItem.name.length > 9 ? '2.1rem' : '2.7rem',
                textAlign: 'center',
                lineHeight: 1.15,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {renderSyllablesColored(currentItem.syllables, currentItem.name)}
            </div>
          </motion.div>
        </div>
      )}

      {/* BOTTOM BLUE STRIP: BUIH BILANGAN IKUT NOMBOR (Hanya untuk Asas Nombor 0-10) */}
      {mode === 'bilang_0_10' && (
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          marginTop: isMobile ? '20px' : '26px',
          background: '#e0f2fe',
          backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          borderRadius: '20px',
          border: '4px solid #10182f',
          boxShadow: '0 4px 0 #10182f',
          padding: isMobile ? '12px 10px 14px 10px' : '14px 16px 16px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {/* Strip Header with count badge centered & clean (no icon, font hitam) */}
        {totalBubbles > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              position: 'relative',
              minHeight: '32px'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '2.5px solid #10182f',
                boxShadow: '0 2px 0 #10182f',
                borderRadius: '999px',
                padding: isMobile ? '4px 18px' : '5px 22px',
                fontSize: isMobile ? '0.92rem' : '1.05rem',
                fontWeight: 900,
                color: '#10182f',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}
            >
              <span>{poppedCount} / {totalBubbles}</span>
            </div>

            {poppedCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPoppedBubbles(Array(totalBubbles).fill(false))}
                style={{
                  position: 'absolute',
                  right: '4px',
                  background: '#ffe24a',
                  border: '2px solid #10182f',
                  boxShadow: '0 2px 0 #10182f',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#10182f',
                  fontSize: '0.9rem'
                }}
                title="Reset Buih"
              >
                <i className="fa-solid fa-rotate-right"></i>
              </motion.button>
            )}
          </div>
        )}

        {/* Bubbles Area (Enlarged & Prominent) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '12px' : '16px',
            width: '100%',
            padding: '8px 4px',
            boxSizing: 'border-box',
            minHeight: isMobile ? '68px' : '78px'
          }}
        >
          {totalBubbles === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '2px dashed #94a3b8',
                borderRadius: '16px',
                padding: '8px 20px',
                fontSize: isMobile ? '0.88rem' : '0.95rem',
                fontWeight: 900,
                color: '#64748b',
                textAlign: 'center'
              }}
            >
              Sifar - Tiada Buih
            </div>
          ) : (
            Array.from({ length: totalBubbles }).map((_, bIdx) => {
              const isPopped = !!poppedBubbles[bIdx];

              return (
                <motion.button
                  key={bIdx}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handlePopBubble(bIdx)}
                  style={{
                    width: isMobile ? '58px' : '72px',
                    height: isMobile ? '58px' : '72px',
                    borderRadius: '50%',
                    border: '3px solid #10182f',
                    boxShadow: isPopped ? '0 2.5px 0 #10182f' : '0 4px 0 #10182f, inset -3px -3px 10px rgba(30, 64, 175, 0.35)',
                    background: isPopped
                      ? '#ffffff'
                      : 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(147, 197, 253, 0.6) 30%, rgba(59, 130, 246, 0.75) 75%, rgba(30, 64, 175, 0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: 0,
                    userSelect: 'none',
                    transition: 'background 0.2s ease, box-shadow 0.2s ease'
                  }}
                  title={isPopped ? "Bola" : "Buih Tanda Soal"}
                >
                  {isPopped ? (
                    <motion.div
                      initial={{ scale: 0.2, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <ModernSoccerBall size={isMobile ? 38 : 48} />
                    </motion.div>
                  ) : (
                    <span
                      style={{
                        fontSize: isMobile ? '1.8rem' : '2.3rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.55)',
                        fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                      }}
                    >
                      ?
                    </span>
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* Grid Modal for jumping to any number */}
      <AnimatePresence>
        {showListModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 9999
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={{
                background: '#ffffff',
                backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
                backgroundSize: '16px 16px',
                borderRadius: '28px',
                border: '4px solid #10182f',
                boxShadow: '0 8px 0 #10182f',
                padding: '28px 20px 20px 20px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowListModal(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#ff3f46',
                  border: '2.5px solid #10182f',
                  boxShadow: '0 2px 0 #10182f',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div
                style={{
                  background: '#a855f7',
                  color: 'white',
                  borderRadius: '18px',
                  border: '3px solid #10182f',
                  boxShadow: '0 2.5px 0 #10182f',
                  padding: '6px 24px',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  marginBottom: '20px'
                }}
              >
                Senarai Nombor
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '12px',
                  width: '100%'
                }}
              >
                {currentDataset.map((item, i) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      setIndex(i);
                      setIsFlipped(false);
                      setShowListModal(false);
                    }}
                    style={{
                      background: i === index ? '#ffe24a' : '#f8fafc',
                      border: i === index ? '3px solid #ff7a00' : '2.5px solid #10182f',
                      borderRadius: '18px',
                      boxShadow: '0 3px 0 #10182f',
                      height: '76px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: item.digit.length > 2 ? '1.7rem' : '2.2rem', fontWeight: 900, color: '#10182f', fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif' }}>
                      {item.digit}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
