import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  PhonicsItem,
  PhonicsMode,
  MODE_CONFIGS,
  PHONICS_DATABASE,
  isVowelLetter,
  getPhonicsAudio,
  getCleanDisplayLetter
} from './FonikAbcGame';
import {
  playNavTone,
  playPopTone,
  playErrorTone,
  playTone
} from '../utils/coreAudio';
import { playCorrectPeneguhan, playWrongPeneguhan, playPopupBerjaya, playPopupGagal, resetPeneguhanTurn } from '../utils/peneguhanAudio';

export const MAIN_APP_BG = 'transparent';

export const playNavSound = () => {
  // Guna playBubble global (app-logic) supaya KONGSI satu throttle 120ms.
  // Ini halang bunyi "double" bila handler klik global app-logic turut lari.
  if (typeof (window as any).playBubble === "function") {
    (window as any).playBubble();
  } else {
    playNavTone();
  }
};

export interface PhonicsActivityProps {
  phonics: PhonicsItem;
  mode: PhonicsMode;
  isMobile: boolean;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  triggerTerbaik: (onComplete: () => void, durationMs?: number, showStar?: boolean) => void;
}

function ActivityTopBar({
  actNum,
  onBack,
  isMobile,
  badgeText = 'Fonik ABC',
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

  let activeActivityAudio: HTMLAudioElement | null = null;

  const playSound = (src: string, onEnd?: () => void) => {
    try {
      if (activeActivityAudio) {
        try {
          activeActivityAudio.pause();
          activeActivityAudio.currentTime = 0;
        } catch (e) { console.warn('[PhonicsActivities] Gagal hentikan audio sebelumnya:', e); }
        activeActivityAudio = null;
      }
      const audio = new Audio(src);
      activeActivityAudio = audio;
      audio.onended = () => {
        if (activeActivityAudio === audio) activeActivityAudio = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(err => {
        console.warn("Audio notice:", src, err);
        if (activeActivityAudio === audio) activeActivityAudio = null;
        if (onEnd) onEnd();
      });
    } catch (e) {
      if (onEnd) onEnd();
    }
  };

  const playPopSound = () => playPopTone();

  const playErrorSound = () => playErrorTone();

  const playSuccessCelebration = () => {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.55 }
    });
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
  };

  export function Activity1HearSound({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const [phase, setPhase] = useState<'lower' | 'upper'>('lower');
    const [tappedLower, setTappedLower] = useState<boolean[]>([false, false, false, false, false, false]);
    const [tappedUpper, setTappedUpper] = useState<boolean[]>([false, false, false, false, false, false]);

    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    const displayUpper = getCleanDisplayLetter(phonics.letter, true);

    const handleTapLower = (idx: number) => {
      playSound(phonics.soundAudio);
      setTappedLower(prev => {
        const next = [...prev];
        next[idx] = true;
        if (next.every(Boolean)) {
          setTimeout(() => {
            setPhase('upper');
            playSound(phonics.soundAudio);
          }, 500);
        }
        return next;
      });
    };

    const handleTapUpper = (idx: number) => {
      playSound(phonics.soundAudio);
      // Kira penyiapan DI LUAR updater setState supaya kesan sampingan (rekod bintang/popup)
      // tidak tercetus dua kali dalam React StrictMode (updater boleh dipanggil 2x).
      const next = [...tappedUpper];
      next[idx] = true;
      setTappedUpper(next);
      if (next.every(Boolean)) {
        onComplete();
        triggerTerbaik(onNext);
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
              marginBottom: isMobile ? '20px' : '28px',
              maxWidth: '90%'
            }}
          >
            {(() => {
              const isVowel = isVowelLetter(phonics.letter);
              if (mode === 'kenali_huruf') {
                return phase === 'lower'
                  ? `Tekan setiap huruf kecil [${displayLower}]. Kenal bentuk dan sebut namanya.`
                  : `Tekan setiap huruf besar [${displayUpper}]. Kenal bentuk dan sebut namanya.`;
              }
              if (mode === 'vokal_konsonan') {
                return phase === 'lower'
                  ? `Huruf [${displayLower}] ialah huruf ${isVowel ? 'VOKAL 🔴' : 'KONSONAN 🔵'}. Tekan untuk dengar sebutan!`
                  : `Huruf [${displayUpper}] ialah huruf ${isVowel ? 'VOKAL 🔴' : 'KONSONAN 🔵'}. Tekan untuk dengar sebutan!`;
              }
              return phase === 'lower'
                ? `Tekan setiap ${displayLower}. Dengar, kemudian sebut bunyinya.`
                : `Tekan setiap ${displayUpper}. Dengar, kemudian sebut bunyinya.`;
            })()}
          </div>

          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? '10px' : '20px',
            width: '100%',
            maxWidth: '620px',
            alignContent: 'center',
            boxSizing: 'border-box'
          }}>
            {phase === 'lower' ? (
              tappedLower.map((isTapped, i) => (
                <motion.button
                  key={`lower-${i}`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTapLower(i)}
                  style={{
                    width: '100%',
                    height: isMobile ? '95px' : '135px',
                    borderRadius: isMobile ? '20px' : '24px',
                    border: '3.5px solid #1e293b',
                    background: isTapped ? '#34d399' : '#ffffff',
                    boxShadow: isTapped ? '0 2.5px 0 #059669' : '0 2.5px 0 #1e293b',
                    color: isTapped ? 'white' : '#1e293b',
                    fontSize: isMobile ? '3rem' : '4.4rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'background 0.25s'
                  }}
                >
                  {displayLower}
                </motion.button>
              ))
            ) : (
              tappedUpper.map((isTapped, i) => (
                <motion.button
                  key={`upper-${i}`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTapUpper(i)}
                  style={{
                    width: '100%',
                    height: isMobile ? '95px' : '135px',
                    borderRadius: isMobile ? '20px' : '24px',
                    border: '3.5px solid #1e293b',
                    background: isTapped ? '#f59e0b' : '#ffffff',
                    boxShadow: isTapped ? '0 2.5px 0 #b45309' : '0 2.5px 0 #1e293b',
                    color: isTapped ? 'white' : '#1e293b',
                    fontSize: isMobile ? '3rem' : '4.4rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'background 0.25s'
                  }}
                >
                  {displayUpper}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVITY 2: MATCH LETTER PARTNERS
  // Row 1 (Pusingan 1 - Atas): Draggable b -> stationary B -> locks into [ B | b ]
  // Row 2 (Pusingan 2 - Bawah): Draggable B -> stationary b -> locks into [ b | B ]
  // When both rows are merged -> triggers Terbaik! 🌟 & auto-advances to Activity 3!
  // -------------------------------------------------------------
  export function Activity2MatchPartners({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const [merged1, setMerged1] = useState(false);
    const [merged2, setMerged2] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    const displayUpper = getCleanDisplayLetter(phonics.letter, true);

    // Auto advance when both rows are merged
    const handleConnectRow1 = () => {
      if (merged1) return;
      setMerged1(true);
      setHasInteracted(true);
      playSound(phonics.soundAudio);
    };

    const handleConnectRow2 = () => {
      if (merged2) return;
      setMerged2(true);
      setHasInteracted(true);
      playSound(phonics.soundAudio);
    };

    // Watch both merged states and auto advance with celebration
    useEffect(() => {
      if (merged1 && merged2) {
        onComplete();
        triggerTerbaik(onNext, 1500);
      }
    }, [merged1, merged2]);

    const handleDragEndRow1 = (_e: any, info: any) => {
      if (merged1) return;
      setHasInteracted(true);
      if (info.offset.x < -20 || info.point.x < window.innerWidth / 2) {
        handleConnectRow1();
      }
    };

    const handleDragEndRow2 = (_e: any, info: any) => {
      if (merged2) return;
      setHasInteracted(true);
      if (info.offset.x < -20 || info.point.x < window.innerWidth / 2) {
        handleConnectRow2();
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
        <ActivityTopBar actNum={2} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

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
            {mode === 'kenali_huruf'
              ? `Tarik & cantumkan puzzle huruf kecil [${displayLower}] dengan huruf besar [${displayUpper}]!`
              : mode === 'vokal_konsonan'
                ? `Cantumkan puzzle huruf [${displayLower}] (${isVowelLetter(phonics.letter) ? 'VOKAL' : 'KONSONAN'}) dengan [${displayUpper}]!`
                : 'Tarik dan cantumkan kedua-dua pasangan huruf di bawah!'}
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '20px' : '28px',
            width: '100%',
            maxWidth: '650px',
            position: 'relative'
          }}>
            {/* Guide Cursor Hand Pointer Animation on first row if not touched (Sama seperti Kad Imbasan) */}
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

            {/* ================= PUSINGAN 1 (ROW 1: ATAS) ================= */}
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
                    borderRadius: '24px',
                    border: '3.5px solid #1e293b',
                    boxShadow: '0 3.5px 0 #1e293b'
                  }}
                >
                  <div style={{
                    width: isMobile ? '95px' : '120px',
                    height: isMobile ? '95px' : '120px',
                    background: '#facc15',
                    borderRadius: '18px 0 0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '3.2rem' : '4.2rem',
                    fontWeight: 900,
                    color: '#431407',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {displayUpper}
                  </div>
                  <div style={{
                    width: isMobile ? '95px' : '120px',
                    height: isMobile ? '95px' : '120px',
                    background: '#f472b6',
                    borderRadius: '0 18px 18px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '3.2rem' : '4.2rem',
                    fontWeight: 900,
                    color: '#500724',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {displayLower}
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: isMobile ? '300px' : '560px',
                  position: 'relative',
                  minHeight: isMobile ? '105px' : '160px'
                }}>
                  {/* Stationary Piece (B - Yellow) */}
                  <div
                    onClick={handleConnectRow1}
                    style={{
                      width: isMobile ? '95px' : '160px',
                      height: isMobile ? '95px' : '160px',
                      background: '#facc15',
                      borderRadius: '22px 6px 6px 22px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '3rem' : '5.4rem',
                      fontWeight: 900,
                      color: '#431407',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {displayUpper}
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

                  {/* Draggable Piece (b - Pink) */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ top: 0, bottom: 0, right: 20, left: -240 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEndRow1}
                    onClick={handleConnectRow1}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: isMobile ? '95px' : '160px',
                      height: isMobile ? '95px' : '160px',
                      background: '#f472b6',
                      borderRadius: '6px 22px 22px 6px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '3rem' : '5.4rem',
                      fontWeight: 900,
                      color: '#500724',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      position: 'relative',
                      cursor: 'grab',
                      touchAction: 'none'
                    }}
                  >
                    {displayLower}
                    <div style={{
                      position: 'absolute',
                      left: isMobile ? '-4px' : '-5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '16px' : '22px',
                      height: isMobile ? '32px' : '48px',
                      backgroundColor: '#e0f2fe',
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

            {/* ================= PUSINGAN 2 (ROW 2: BAWAH PUSINGAN 1) ================= */}
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
                    width: isMobile ? '95px' : '150px',
                    height: isMobile ? '95px' : '150px',
                    background: '#f472b6',
                    borderRadius: '20px 0 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '3.2rem' : '5.4rem',
                    fontWeight: 900,
                    color: '#500724',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {displayLower}
                  </div>
                  <div style={{
                    width: isMobile ? '95px' : '150px',
                    height: isMobile ? '95px' : '150px',
                    background: '#facc15',
                    borderRadius: '0 20px 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '3.2rem' : '5.4rem',
                    fontWeight: 900,
                    color: '#431407',
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                  }}>
                    {displayUpper}
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: isMobile ? '300px' : '560px',
                  position: 'relative',
                  minHeight: isMobile ? '105px' : '160px'
                }}>
                  {/* Stationary Piece (b - Pink) */}
                  <div
                    onClick={handleConnectRow2}
                    style={{
                      width: isMobile ? '95px' : '160px',
                      height: isMobile ? '95px' : '160px',
                      background: '#f472b6',
                      borderRadius: '22px 6px 6px 22px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '3rem' : '5.4rem',
                      fontWeight: 900,
                      color: '#500724',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {displayLower}
                    <div style={{
                      position: 'absolute',
                      right: isMobile ? '-16px' : '-22px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '20px' : '26px',
                      height: isMobile ? '32px' : '48px',
                      background: '#f472b6',
                      borderTop: '4px solid #1e293b',
                      borderRight: '4px solid #1e293b',
                      borderBottom: '4px solid #1e293b',
                      borderRadius: '0 12px 12px 0',
                      zIndex: 2
                    }} />
                  </div>

                  {/* Draggable Piece (B - Yellow) */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ top: 0, bottom: 0, right: 20, left: -240 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEndRow2}
                    onClick={handleConnectRow2}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: isMobile ? '95px' : '160px',
                      height: isMobile ? '95px' : '160px',
                      background: '#facc15',
                      borderRadius: '6px 22px 22px 6px',
                      border: '4px solid #1e293b',
                      boxShadow: '0 3.5px 0 #1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '3rem' : '5.4rem',
                      fontWeight: 900,
                      color: '#431407',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      position: 'relative',
                      cursor: 'grab',
                      touchAction: 'none'
                    }}
                  >
                    {displayUpper}
                    <div style={{
                      position: 'absolute',
                      left: isMobile ? '-4px' : '-5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? '16px' : '22px',
                      height: isMobile ? '32px' : '48px',
                      backgroundColor: '#e0f2fe',
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
  // ACTIVITY 3: BUBBLE POP
  // Counter pill on TOP-RIGHT aligned horizontally with instruction badge
  // -------------------------------------------------------------
  export function Activity3BubblePop({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const totalCount = 8;
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];
    const spreadX = [6, 68, 22, 50, 12, 60, 36, 75];

    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    const displayUpper = getCleanDisplayLetter(phonics.letter, true);

    const [bubbles, setBubbles] = useState(() => {
      return Array.from({ length: totalCount }, (_, i) => ({
        id: `bubble-${i}`,
        letter: i % 2 === 0 ? displayLower : displayUpper,
        popped: false,
        color: colors[i % colors.length],
        left: spreadX[i % spreadX.length],
        speed: 7.5 + (i % 3) * 1.8,
        delay: (i * 0.9) % 3.6
      }));
    });

    const [popEffects, setPopEffects] = useState<{ id: string; x: number; y: number }[]>([]);
    const poppedCount = bubbles.filter(b => b.popped).length;

    const handleBubbleClick = (e: React.MouseEvent, id: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      playPopSound();
      playSound(phonics.soundAudio);

      setPopEffects(prev => [...prev, { id: `${id}-${Date.now()}`, x, y }]);
      setTimeout(() => {
        setPopEffects(prev => prev.filter(p => p.id !== `${id}-${Date.now()}`));
      }, 450);

      // Kira penyiapan DI LUAR updater setState supaya rekod bintang/popup tidak
      // tercetus dua kali dalam React StrictMode.
      const nextBubbles = bubbles.map(b => b.id === id ? { ...b, popped: true } : b);
      const newPopped = nextBubbles.filter(b => b.popped).length;
      setBubbles(nextBubbles);
      if (newPopped >= totalCount) {
        onComplete();
        triggerTerbaik(onNext);
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
        <ActivityTopBar actNum={3} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={{ ...blueCardContainerStyle(isMobile), overflow: 'hidden' }}>
          {/* Top Bar inside Card: Instruction centered + Counter Pill on Top-Right */}
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
            {/* Empty placeholder on left to balance layout */}
            <div style={{ width: isMobile ? '55px' : '85px', flexShrink: 0 }} />

            {/* Centered Instruction Badge */}
            <div
              style={{
                background: 'white',
                borderRadius: '999px',
                padding: isMobile ? '8px 14px' : '10px 24px',
                border: '3px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                fontWeight: 800,
                fontSize: isMobile ? '0.88rem' : '1.05rem',
                color: '#1e293b',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
            >
              {mode === 'kenali_huruf'
                ? <span>Pecahkan buih huruf kecil <strong>[{displayLower}]</strong> & besar <strong>[{displayUpper}]</strong>!</span>
                : mode === 'vokal_konsonan'
                  ? <span>Pecahkan buih huruf <strong>{isVowelLetter(phonics.letter) ? 'Vokal' : 'Konsonan'} [{displayLower}]</strong>!</span>
                  : <span>Pecahkan setiap buih <strong>[{displayLower}]</strong> & <strong>[{displayUpper}]</strong>!</span>}
            </div>

            {/* Counter Pill on Top-Right with black text */}
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
              <span style={{ color: '#1e293b' }}>{poppedCount} / {totalCount}</span>
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
                    width: isMobile ? '76px' : '96px',
                    height: isMobile ? '76px' : '96px',
                    borderRadius: '50%',
                    border: '3.5px solid rgba(255, 255, 255, 0.95)',
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, ${bubble.color} 55%, rgba(0,0,0,0.2) 100%)`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.12), inset -2px -2px 6px rgba(0,0,0,0.15), inset 2px 2px 6px rgba(255,255,255,0.8)`,
                    color: 'white',
                    fontSize: isMobile ? '2.4rem' : '3.3rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    willChange: 'transform'
                  }}
                >
                  {bubble.letter}
                </motion.button>
              );
            })}

            {popEffects.map((p) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: p.x - 40,
                  top: p.y - 40,
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '4px solid #ffffff',
                  boxShadow: '0 0 20px #ffffff',
                  pointerEvents: 'none',
                  zIndex: 999
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVITY 4: FIND THE SOUND
  // - Desktop: Top-right aligned 0/6 badge
  // - Mobile view: 0/6 badge neatly placed below instruction
  // - Mobile view: 3 buttons per row (repeat(3, minmax(0, 1fr)))
  // - Gentle slow breathing scale animation (besar-kecil perlahan) that stops when solved!
  // -------------------------------------------------------------
  export function Activity4FindSound({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const [phase, setPhase] = useState<1 | 2>(1);

    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    const displayUpper = getCleanDisplayLetter(phonics.letter, true);

    // Bright vibrant colors matching main menu cards
    const brightPalettes = [
      '#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4',
      '#f97316', '#ef4444', '#14b8a6', '#84cc16', '#6366f1', '#eab308'
    ];

    const generateCards = (targetChar: string, isUpper: boolean) => {
      // Exclude opposite e/é to ensure single clean e without confusion
      const distractors = PHONICS_DATABASE
        .filter(p => p.letter !== phonics.letter && p.letter !== 'é' && p.letter !== 'e')
        .map(p => isUpper ? p.uppercase : p.letter.toLowerCase());
      const list = [
        { id: 't-1', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[0] },
        { id: 't-2', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[1] },
        { id: 't-3', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[2] },
        { id: 't-4', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[3] },
        { id: 't-5', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[4] },
        { id: 't-6', letter: targetChar, isTarget: true, status: 'idle', color: brightPalettes[5] },
        { id: 'd-1', letter: distractors[0] || 'B', isTarget: false, status: 'idle', color: brightPalettes[6] },
        { id: 'd-2', letter: distractors[1] || 'C', isTarget: false, status: 'idle', color: brightPalettes[7] },
        { id: 'd-3', letter: distractors[2] || 'D', isTarget: false, status: 'idle', color: brightPalettes[8] },
        { id: 'd-4', letter: distractors[3] || 'M', isTarget: false, status: 'idle', color: brightPalettes[9] },
        { id: 'd-5', letter: distractors[4] || 'F', isTarget: false, status: 'idle', color: brightPalettes[10] },
        { id: 'd-6', letter: distractors[5] || 'K', isTarget: false, status: 'idle', color: brightPalettes[11] }
      ];
      return list.sort(() => Math.random() - 0.5);
    };

    const [cards, setCards] = useState(() => generateCards(displayLower, false));

    const targetTotal = cards.filter(c => c.isTarget).length;
    const poppedTargetCount = cards.filter(c => c.isTarget && c.status === 'correct').length;

    const handleCardClick = (id: string, isTarget: boolean, letter: string) => {
      if (isTarget) {
        playPopSound();
        playSound(phonics.soundAudio);
        // Kira penyiapan DI LUAR updater setState (elak kesan sampingan 2x dalam StrictMode).
        const nextCards = cards.map(c => c.id === id ? { ...c, status: 'correct' } : c);
        const newCount = nextCards.filter(c => c.isTarget && c.status === 'correct').length;
        setCards(nextCards);
        if (newCount >= targetTotal) {
          if (phase === 1) {
            // Pusingan 1 complete -> Switch to Pusingan 2 (Huruf Besar)
            setTimeout(() => {
              setPhase(2);
              setCards(generateCards(displayUpper, true));
              playSound(phonics.soundAudio);
            }, 400);
          } else {
            // Pusingan 2 complete -> Finish Activity 4 and auto advance!
            onComplete();
            triggerTerbaik(onNext);
          }
        }
      } else {
        playErrorSound();
        playWrongPeneguhan();
        playSound(mode === 'fonik_abc' ? getPhonicsAudio(letter) : `/audio/abc/${letter.toLowerCase()}.mp3`);
        setCards(prev => prev.map(c => c.id === id ? { ...c, status: 'wrong' } : c));
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === id ? { ...c, status: 'idle' } : c));
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
        <ActivityTopBar actNum={4} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

        <div style={blueCardContainerStyle(isMobile)}>
          {/* Top Bar inside Card: On mobile stacked vertically, on desktop side-by-side */}
          {isMobile ? (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  border: '3px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  color: '#1e293b',
                  textAlign: 'center',
                  maxWidth: '96%'
                }}
              >
                {(() => {
                  const isVowel = isVowelLetter(phonics.letter);
                  if (mode === 'kenali_huruf') {
                    return phase === 1
                      ? `Tekan setiap huruf kecil [${displayLower}] sahaja!`
                      : `Tekan setiap huruf besar [${displayUpper}] sahaja!`;
                  }
                  if (mode === 'vokal_konsonan') {
                    return phase === 1
                      ? `Tekan huruf kecil [${displayLower}] (${isVowel ? 'Vokal' : 'Konsonan'}) sahaja!`
                      : `Tekan huruf besar [${displayUpper}] (${isVowel ? 'Vokal' : 'Konsonan'}) sahaja!`;
                  }
                  return phase === 1
                    ? `Tekan setiap bunyi huruf kecil [${displayLower}] sahaja!`
                    : `Tekan setiap bunyi huruf besar [${displayUpper}] sahaja!`;
                })()}
              </div>

              {/* Counter Pill placed below instruction on mobile view */}
              <div
                style={{
                  background: 'white',
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa-solid fa-check" style={{ color: '#10b981', fontWeight: 900 }}></i>
                <span style={{ color: '#1e293b' }}>{poppedTargetCount} / {targetTotal}</span>
              </div>
            </div>
          ) : (
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              position: 'relative',
              gap: '8px'
            }}>
              {/* Empty placeholder on left to balance layout */}
              <div style={{ width: '85px', flexShrink: 0 }} />

              {/* Centered Instruction Badge */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  border: '3px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#1e293b',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {(() => {
                  const isVowel = isVowelLetter(phonics.letter);
                  if (mode === 'kenali_huruf') {
                    return phase === 1
                      ? `Tekan setiap huruf kecil [${displayLower}] sahaja!`
                      : `Tekan setiap huruf besar [${displayUpper}] sahaja!`;
                  }
                  if (mode === 'vokal_konsonan') {
                    return phase === 1
                      ? `Tekan huruf kecil [${displayLower}] (${isVowel ? 'Vokal' : 'Konsonan'}) sahaja!`
                      : `Tekan huruf besar [${displayUpper}] (${isVowel ? 'Vokal' : 'Konsonan'}) sahaja!`;
                  }
                  return phase === 1
                    ? `Tekan setiap bunyi huruf kecil [${displayLower}] sahaja!`
                    : `Tekan setiap bunyi huruf besar [${displayUpper}] sahaja!`;
                })()}
              </div>

              {/* Counter Pill on Top-Right with black font */}
              <div
                style={{
                  background: 'white',
                  border: '2.5px solid #1e293b',
                  boxShadow: '0 2px 0 #1e293b',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}
              >
                <i className="fa-solid fa-check" style={{ color: '#10b981', fontWeight: 900 }}></i>
                <span style={{ color: '#1e293b' }}>{poppedTargetCount} / {targetTotal}</span>
              </div>
            </div>
          )}

          {/* Buttons Grid: 3 per row on Mobile, 4 per row on Desktop */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '18px',
            maxWidth: '650px',
            width: '100%',
            alignContent: 'center',
            justifyItems: 'center',
            boxSizing: 'border-box'
          }}>
            {cards.map((card, idx) => {
              const isCorrect = card.status === 'correct';
              const isWrong = card.status === 'wrong';

              return (
                <motion.button
                  key={`${phase}-${card.id}`}
                  animate={
                    isCorrect
                      ? { scale: 0.92, opacity: 0.6, x: 0 }
                      : isWrong
                        ? { scale: 1, opacity: 1, x: [-6, 6, -6, 6, 0] }
                        : { scale: [1, 1.04, 1], opacity: 1, x: 0 }
                  }
                  transition={
                    isCorrect
                      ? { duration: 0.2 }
                      : isWrong
                        ? { duration: 0.35 }
                        : { scale: { repeat: Infinity, duration: 2.0, ease: "easeInOut", delay: (idx % 3) * 0.3 } }
                  }
                  whileHover={isMobile || isCorrect ? undefined : { scale: 1.07 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => !isCorrect && handleCardClick(card.id, card.isTarget, card.letter)}
                  style={{
                    width: isMobile ? '76px' : '92px',
                    height: isMobile ? '76px' : '92px',
                    borderRadius: '50%',
                    border: isCorrect ? '3.5px solid #10b981' : isWrong ? '3.5px solid #ef4444' : `3.5px solid #1e293b`,
                    background: isCorrect ? '#34d399' : isWrong ? '#ef4444' : card.color,
                    boxShadow: isCorrect ? '0 2px 0 #059669' : '0 2.5px 0 #1e293b',
                    color: 'white',
                    fontSize: isMobile ? '2.3rem' : '3rem',
                    fontWeight: 900,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    cursor: isCorrect ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                    touchAction: 'manipulation'
                  }}
                >
                  {card.letter}

                  {isCorrect && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#10b981',
                        color: 'white',
                        width: isMobile ? '24px' : '26px',
                        height: isMobile ? '24px' : '26px',
                        borderRadius: '50%',
                        border: '2.5px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}

                  {isWrong && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: 'white',
                        width: isMobile ? '24px' : '26px',
                        height: isMobile ? '24px' : '26px',
                        borderRadius: '50%',
                        border: '2.5px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
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
  // ACTIVITY 5: MATCH THE SOUND
  // -------------------------------------------------------------
  export function Activity5MatchSound({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    // Exclude opposite e/é so there's never both e-taling and e-pepet in options
    const distractors = PHONICS_DATABASE.filter(p => p.letter !== phonics.letter && p.letter !== 'é' && p.letter !== 'e');

    const [audioOptions] = useState(() => {
      const list = [
        { id: 'aud-1', letter: phonics.letter, isTarget: true },
        { id: 'aud-2', letter: distractors[0]?.letter || 'b', isTarget: false },
        { id: 'aud-3', letter: distractors[1]?.letter || 'c', isTarget: false }
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
    const letterKnobRef = useRef<HTMLDivElement>(null);

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
      playSound(mode === 'fonik_abc' ? getPhonicsAudio(opt.letter) : `/audio/abc/${opt.letter}.mp3`);

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

      if (letterKnobRef.current && stageRef.current) {
        const targetRect = letterKnobRef.current.getBoundingClientRect();
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
        const endPt = getKnobCenter(letterKnobRef.current);

        setConnectedId(selected.id);
        setConnectedCoordinates({
          startX: startPt.x,
          startY: startPt.y,
          endX: endPt.x,
          endY: endPt.y
        });

        playSound(phonics.soundAudio);
        onComplete();
        triggerTerbaik(onNext);
      } else {
        playErrorSound();
        playWrongPeneguhan();
        setShakeError(true);
        setTimeout(() => {
          setShakeError(false);
          setActiveSpeakerId(null);
        }, 600);
      }
    };

    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: MAIN_APP_BG,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '16px 12px 24px 12px' : '20px 16px',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <ActivityTopBar actNum={5} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

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
            {mode === 'kenali_huruf'
              ? <span>Dengar sebutan nama huruf di kiri, tarik garisan ke huruf <strong>[{displayLower}]</strong>.</span>
              : mode === 'vokal_konsonan'
                ? <span>Dengar audio di kiri, tarik garisan sepadan ke huruf <strong>{isVowelLetter(phonics.letter) ? 'Vokal' : 'Konsonan'} [{displayLower}]</strong>.</span>
                : <span>Dengar 3 audio di kiri, tarik garisan audio yang sepadan ke huruf <strong>[{displayLower}]</strong>.</span>}
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

            {/* Left Column: 3 Speaker Buttons */}
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

            {/* Right Column: 1 Target Vowel Letter Card */}
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
                  width: isMobile ? '110px' : '145px',
                  height: isMobile ? '110px' : '145px',
                  borderRadius: '24px',
                  border: '3.5px solid #1e293b',
                  background: connectedId ? '#10b981' : '#ffffff',
                  boxShadow: connectedId ? '0 3px 0 #059669, 0 0 20px rgba(16, 185, 129, 0.8)' : '0 2.5px 0 #1e293b',
                  color: connectedId ? 'white' : '#1e293b',
                  fontSize: isMobile ? '3.5rem' : '4.6rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {displayLower}
              </motion.button>

              <div
                ref={letterKnobRef}
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

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // ACTIVITY 6: PICTURE PUZZLE (ZERO SHADOW ON BOARD & TILES)
  // Shows Picture Reveal Pop-up with word first, then Terbaik!, then returns to main letters overview
  // -------------------------------------------------------------
  export function Activity6PicturePuzzle({ phonics, mode, isMobile, onNext, onBack, onComplete, triggerTerbaik }: PhonicsActivityProps) {
    const currentConfig = MODE_CONFIGS[mode] || MODE_CONFIGS.kenali_huruf;
    const [openTiles, setOpenTiles] = useState<boolean[]>([
      false, false, false,
      false, false, false,
      false, false, false
    ]);
    const [showPopupReveal, setShowPopupReveal] = useState(false);

    const displayLower = getCleanDisplayLetter(phonics.letter, false);
    const displayUpper = getCleanDisplayLetter(phonics.letter, true);

    const isAllOpen = openTiles.every(Boolean);

    const handleOpenTile = (idx: number) => {
      playSound(phonics.soundAudio);
      // Kira penyiapan DI LUAR updater setState (elak timer/popup 2x dalam StrictMode).
      const next = [...openTiles];
      next[idx] = true;
      setOpenTiles(next);
      if (next.every(Boolean)) {
        // 1. Show Picture Reveal Modal with word and play pronunciation audio
        setTimeout(() => {
          setShowPopupReveal(true);
          playSound(phonics.wordAudio);
        }, 300);

        // 2. After 2.4s, close picture popup, show Terbaik! reward animation, and auto redirect to letters menu
        setTimeout(() => {
          setShowPopupReveal(false);
          onComplete();
          triggerTerbaik(() => {
            onNext();
          }, 1500);
        }, 2600);
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
        overflowY: 'auto',
        position: 'relative'
      }}>
        <ActivityTopBar actNum={6} onBack={onBack} isMobile={isMobile} badgeText={currentConfig.topBadge} badgeColor={currentConfig.topBadgeColor} />

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
            {(() => {
              const isVowel = isVowelLetter(phonics.letter);
              if (mode === 'kenali_huruf') {
                return isAllOpen
                  ? `✨ Gambar rahsia ialah [${phonics.word.toUpperCase()}], bermula dengan huruf [${displayUpper}]!`
                  : 'Buka setiap jubin untuk mendedahkan gambar & huruf awalan!';
              }
              if (mode === 'vokal_konsonan') {
                return isAllOpen
                  ? `✨ Gambar [${phonics.word.toUpperCase()}] bermula dengan huruf ${isVowel ? 'VOKAL 🔴' : 'KONSONAN 🔵'} [${displayUpper}]!`
                  : 'Buka setiap jubin untuk kenali gambar & kategori huruf awalan!';
              }
              return isAllOpen
                ? `✨ Gambar rahsia ialah [${phonics.word.toUpperCase()}]!`
                : 'Buka setiap jubin untuk mendedahkan gambar rahsia!';
            })()}
          </div>

          {/* Picture Board with ZERO SHADOW */}
          <div
            style={{
              width: isMobile ? '260px' : '380px',
              height: isMobile ? '260px' : '380px',
              borderRadius: '28px',
              border: '3.5px solid #1e293b',
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}
          >
            <img
              src={phonics.image}
              alt={phonics.word}
              onError={(e) => {
                console.error("Image load error:", phonics.image);
              }}
              style={{
                width: '88%',
                height: '88%',
                objectFit: 'contain'
              }}
            />

            {/* Zero Shadow on Picture Puzzle Tiles */}
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
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleOpenTile(idx)}
                      style={{
                        borderRadius: isMobile ? '12px' : '16px',
                        border: '2.5px solid #1e293b',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        boxShadow: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        fontSize: isMobile ? '1.8rem' : '2.8rem',
                        fontWeight: 900,
                        color: '#451a03',
                        fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                      }}>
                        {displayLower}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {isAllOpen && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                width: '100%'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  border: '3.5px solid #1e293b',
                  boxShadow: '0 2.5px 0 #1e293b',
                  borderRadius: '24px',
                  padding: isMobile ? '8px 22px' : '10px 28px'
                }}
              >
                {phonics.syllables.map((syl, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: isMobile ? '2.2rem' : '2.8rem',
                      fontWeight: 900,
                      color: i % 2 === 0 ? '#1e293b' : '#ef4444',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      lineHeight: 1
                    }}
                  >
                    {syl.toLowerCase()}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* ================= PICTURE REVEAL POPUP MODAL ================= */}
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
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: isMobile ? '200px' : '250px',
                height: isMobile ? '200px' : '250px',
                borderRadius: '24px',
                border: '3px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px'
              }}>
                <img
                  src={phonics.image}
                  alt={phonics.word}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Syllables: Lowercase only, Alternating Black and Red */}
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
                {phonics.syllables.map((syl, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: isMobile ? '2.4rem' : '3.2rem',
                      fontWeight: 900,
                      color: i % 2 === 0 ? '#1e293b' : '#ef4444',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      lineHeight: 1
                    }}
                  >
                    {syl.toLowerCase()}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }
