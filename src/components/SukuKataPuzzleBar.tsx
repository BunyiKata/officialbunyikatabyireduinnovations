import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

// -------------------------------------------------------------------
// SUKU KATA PUZZLE BAR
// Galeri puzzle cantuman suku kata berlatar belakang biru
// Diletakkan di bawah kad imbasan untuk Misi Suku Kata Asas & Hero
// -------------------------------------------------------------------

interface SukuKataPuzzleBarProps {}

interface PuzzleData {
  syllables: string[];
  word: string;
  moduleId: string;
  isSingleSyllable?: boolean;
}

// Helper: parse "be - ca" -> ["be", "ca"], "be - ru - du" -> ["be", "ru", "du"]
function parseSyllables(front: string): string[] {
  if (!front) return [];
  // Clean optional pipe separator (e.g. compound words or phrases)
  const cleaned = front.replace(/\s*\|\s*/g, ' - ');
  const parts = cleaned.split(/\s*-\s*/).map(s => s.trim()).filter(Boolean);
  if (parts.length >= 2) return parts;
  // Single syllable like "bas", "kek", "ba" — split consonant onset + remainder
  const word = front.trim();
  if (word.length <= 1) return [word];
  const vowels = 'aeiouAEIOU';
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i]) && i > 0) {
      return [word.slice(0, i), word.slice(i)];
    }
  }
  const mid = Math.ceil(word.length / 2);
  return [word.slice(0, mid), word.slice(mid)];
}

// Puzzle piece colors
const PIECE_COLORS = [
  { bg: '#facc15', text: '#431407' },   // Yellow
  { bg: '#f472b6', text: '#500724' },   // Pink
  { bg: '#60a5fa', text: '#1e3a5f' },   // Blue
  { bg: '#4ade80', text: '#14532d' },   // Green
  { bg: '#c084fc', text: '#3b0764' },   // Purple
];

// Helper to extract puzzle data from an item
function extractPuzzleFromItem(item: any, modId: string): PuzzleData | null {
  if (!item || !item.front) return null;
  const isKV = modId === 'suku_kata_kv' || !item.front.includes('-');
  const syllables = parseSyllables(item.front);
  if (syllables.length < 2) return null;
  return {
    syllables,
    word: item.back || item.front.replace(/[-| ]/g, ''),
    moduleId: modId || '',
    isSingleSyllable: isKV
  };
}

function getActivePuzzleData(): PuzzleData | null {
  try {
    if (typeof window === 'undefined') return null;
    // 1. Check window.__currentSukuKataPuzzle
    const current = (window as any).__currentSukuKataPuzzle;
    if (current) {
      const p = extractPuzzleFromItem(current, current.moduleId || '');
      if (p) return p;
    }
    // 2. Check window.activeFlashcards and window.currentFlashcardIndex
    const cards = (window as any).activeFlashcards;
    const idx = (window as any).currentFlashcardIndex ?? 0;
    const modId = (window as any).currentModuleId || '';
    if (Array.isArray(cards) && cards[idx]) {
      const p = extractPuzzleFromItem(cards[idx], modId);
      if (p) return p;
    }
    // 3. Check moduleContentData
    if (modId && (window as any).moduleContentData?.[modId]?.flashcards) {
      const p = extractPuzzleFromItem((window as any).moduleContentData[modId].flashcards[idx || 0], modId);
      if (p) return p;
    }
    // 4. Check DOM for #sukukata-word
    const wordEl = document.getElementById('sukukata-word');
    if (wordEl) {
      const spans = wordEl.querySelectorAll('span');
      if (spans.length >= 2) {
        const syllables = Array.from(spans).map(s => s.innerText.trim()).filter(Boolean);
        if (syllables.length >= 2) {
          return {
            syllables,
            word: syllables.join(''),
            moduleId: modId
          };
        }
      }
      const raw = wordEl.innerText.trim();
      if (raw && raw !== 'bot' && raw !== '...') {
        const syllables = parseSyllables(raw);
        if (syllables.length >= 2) {
          return {
            syllables,
            word: raw.replace(/[-| ]/g, ''),
            moduleId: modId
          };
        }
      }
    }
  } catch (_) {}
  return null;
}

export const SukuKataPuzzleBar: React.FC<SukuKataPuzzleBarProps> = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(() => getActivePuzzleData());
  const [completed, setCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Track how many pieces are connected from the left (piece 0 is initially placed)
  const [connectedCount, setConnectedCount] = useState(1);
  // Track whether the user interacted with each specific piece index
  const [interactedPieces, setInteractedPieces] = useState<{ [pieceIdx: number]: boolean }>({});

  const puzzleBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const lastConnectTimeRef = useRef(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for puzzle data updates from app-logic.js and check on mount
  useEffect(() => {
    const handlePuzzleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const { front, back, moduleId } = detail;
      if (!front) return;
      const isKV = moduleId === 'suku_kata_kv' || !front.includes('-');
      const syllables = parseSyllables(front);
      if (syllables.length < 2) return;
      setPuzzleData({
        syllables,
        word: back || front.replace(/[-| ]/g, ''),
        moduleId: moduleId || '',
        isSingleSyllable: isKV
      });
      setConnectedCount(1); // reset: only piece 0 placed
      setCompleted(false);
      setInteractedPieces({});
    };

    // 1. Unconditionally register event listener
    window.addEventListener('update-sukukata-puzzle', handlePuzzleUpdate);

    // 2. Initial sync on mount
    const initial = getActivePuzzleData();
    if (initial) {
      setPuzzleData(initial);
    }

    // 3. Fallback checks shortly after mount if app-logic was still populating
    const timer1 = setTimeout(() => {
      setPuzzleData(prev => prev || getActivePuzzleData());
    }, 150);
    const timer2 = setTimeout(() => {
      setPuzzleData(prev => prev || getActivePuzzleData());
    }, 500);

    // 4. MutationObserver on #sukukata-word to catch word switches immediately
    let observer: MutationObserver | null = null;
    const wordEl = document.getElementById('sukukata-word');
    if (wordEl) {
      observer = new MutationObserver(() => {
        const latest = getActivePuzzleData();
        if (latest) {
          setPuzzleData(prev => {
            if (!prev || prev.word.toLowerCase() !== latest.word.toLowerCase()) {
              setConnectedCount(1);
              setCompleted(false);
              setInteractedPieces({});
              return latest;
            }
            return prev;
          });
        }
      });
      observer.observe(wordEl, { childList: true, subtree: true, characterData: true });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (observer) observer.disconnect();
      window.removeEventListener('update-sukukata-puzzle', handlePuzzleUpdate);
    };
  }, []);

  // Detect completion when all pieces are connected
  useEffect(() => {
    if (!puzzleData) return;
    if (connectedCount >= puzzleData.syllables.length && !completed) {
      setCompleted(true);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#facc15', '#f472b6', '#60a5fa', '#4ade80', '#c084fc']
      });
      setTimeout(() => {
        if ((window as any).sebutAudio) {
          (window as any).sebutAudio(puzzleData.word);
        }
      }, 300);
    }
  }, [connectedCount, puzzleData, completed]);

  // Connect the next piece step-by-step
  const connectNextPiece = () => {
    const now = Date.now();
    // 500ms cooldown to strictly prevent any double triggers
    if (now - lastConnectTimeRef.current < 500) return;
    lastConnectTimeRef.current = now;

    setConnectedCount(prev => {
      if (!puzzleData || prev >= puzzleData.syllables.length) return prev;
      return prev + 1;
    });

    playPuzzleChime();
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
  };

  const handleDrag = (_e: any, info: any) => {
    dragDistanceRef.current = Math.abs(info.offset.x);
  };

  const handleDragEnd = (pieceIdx: number, _e: any, info: any) => {
    const draggedLeft = info.offset.x < -20;
    // Delay clearing isDraggingRef so subsequent synthetic click is completely ignored
    setTimeout(() => {
      isDraggingRef.current = false;
      dragDistanceRef.current = 0;
    }, 180);

    setInteractedPieces(prev => ({ ...prev, [pieceIdx]: true }));

    if (draggedLeft) {
      connectNextPiece();
    }
  };

  const handleClickPiece = (pieceIdx: number) => {
    // If user was dragging, completely ignore click
    if (isDraggingRef.current || dragDistanceRef.current > 6) return;
    setInteractedPieces(prev => ({ ...prev, [pieceIdx]: true }));
    connectNextPiece();
  };

  // Reset puzzle
  const handleReset = () => {
    setConnectedCount(1);
    setCompleted(false);
    setInteractedPieces({});
  };

  // Replay audio
  const handleReplayAudio = () => {
    if (puzzleData && (window as any).sebutAudio) {
      (window as any).sebutAudio(puzzleData.word);
    }
  };

  if (!puzzleData || puzzleData.syllables.length < 2) return null;

  const { syllables } = puzzleData;
  const numPieces = syllables.length;
  const allConnected = connectedCount >= numPieces;

  // Enhanced piece sizes: widened on laptop view so 3-letter syllables like 'yam' fit comfortably
  const pieceW = isMobile
    ? (numPieces <= 2 ? 96 : numPieces === 3 ? 84 : 70)
    : (numPieces <= 2 ? 160 : numPieces === 3 ? 128 : 105);
  const pieceH = isMobile
    ? (numPieces <= 2 ? 96 : numPieces === 3 ? 84 : 70)
    : (numPieces <= 2 ? 130 : numPieces === 3 ? 108 : 90);

  const getPieceFontSize = (syl: string) => {
    if (isMobile) {
      if (syl.length >= 4) return '1.5rem';
      if (syl.length >= 3) return numPieces <= 2 ? '2.4rem' : '1.9rem';
      return numPieces <= 2 ? '2.8rem' : numPieces === 3 ? '2.2rem' : '1.75rem';
    } else {
      if (syl.length >= 4) return '2.6rem';
      if (syl.length >= 3) return numPieces <= 2 ? '3.2rem' : '2.6rem';
      return numPieces <= 2 ? '3.6rem' : numPieces === 3 ? '2.8rem' : '2.2rem';
    }
  };

  const pegW = isMobile ? (numPieces <= 2 ? 14 : 12) : 20;
  const pegH = isMobile ? (numPieces <= 2 ? 28 : 24) : 34;

  // The next piece index that needs to be dragged/clicked (starts at 1)
  const nextPieceIdx = connectedCount;

  return (
    <div
      ref={puzzleBarRef}
      style={{
        width: '100%',
        maxWidth: isMobile ? '360px' : '820px',
        marginTop: isMobile ? '14px' : '20px',
        background: '#e0f2fe',
        backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.08) 2px, transparent 2px)',
        backgroundSize: '20px 20px',
        borderRadius: '20px',
        border: '4px solid #10182f',
        boxShadow: '0 4px 0 #10182f',
        padding: isMobile ? '12px 8px 14px 8px' : '14px 16px 16px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Reset button positioned at top-right corner */}
      {(connectedCount > 1 || allConnected) && (
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          style={{
            position: 'absolute',
            top: isMobile ? '10px' : '14px',
            right: isMobile ? '10px' : '14px',
            background: '#ffe24a',
            border: '2px solid #10182f',
            boxShadow: '0 2px 0 #10182f',
            borderRadius: '50%',
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#10182f',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            zIndex: 30
          }}
          title="Reset Puzzle"
        >
          <i className="fa-solid fa-rotate-right"></i>
        </motion.button>
      )}

      {/* Puzzle area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: isMobile ? (pieceH + 16) + 'px' : (pieceH + 26) + 'px',
        padding: '6px 2px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {allConnected ? (
          /* ALL CONNECTED — complete united word with ultra-smooth outline glow animation */
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="puzzle-completed-glow-card"
            onClick={handleReplayAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              padding: isMobile ? '16px 36px' : '22px 58px',
              borderRadius: isMobile ? '24px' : '30px',
              border: '4.5px solid #1e293b',
              cursor: 'pointer',
              position: 'relative',
              minHeight: isMobile ? '88px' : '118px',
              minWidth: isMobile ? '190px' : '280px'
            }}
          >
            <span
              style={{
                fontSize: isMobile ? '3.5rem' : '4.6rem',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                letterSpacing: '1px',
                textAlign: 'center',
                lineHeight: 1,
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {syllables.map((syl, i) => (
                <span
                  key={i}
                  style={{
                    color: puzzleData.isSingleSyllable ? '#10182f' : (i % 2 === 0 ? '#10182f' : '#ef4444'),
                    display: 'inline'
                  }}
                >
                  {syl}
                </span>
              ))}
            </span>

            {/* Speaker icon at top right (clean, static button without size pulsation) */}
            <div
              style={{
                position: 'absolute',
                top: isMobile ? '-14px' : '-18px',
                right: isMobile ? '-14px' : '-18px',
                background: '#ffe24a',
                border: '3px solid #10182f',
                borderRadius: '50%',
                width: isMobile ? '38px' : '46px',
                height: isMobile ? '38px' : '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '1rem' : '1.3rem',
                color: '#10182f',
                boxShadow: '0 3px 0 #10182f',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Dengar Semula"
            >
              <i className="fa-solid fa-volume-high"></i>
            </div>
          </motion.div>
        ) : (
          /* STEP-BY-STEP PUZZLE: Connected cluster on left + Active piece in middle + Waiting pieces on right */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '0px',
            position: 'relative'
          }}>
            {/* 1. Already-connected cluster (stationary on left) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: isMobile ? (numPieces <= 2 ? '22px' : '18px') : '28px'
            }}>
              {syllables.slice(0, connectedCount).map((syl, i) => {
                const color = PIECE_COLORS[i % PIECE_COLORS.length];
                const isFirst = i === 0;
                const isLast = i === connectedCount - 1;
                return (
                  <div
                    key={`connected-${i}`}
                    style={{
                      width: pieceW + 'px',
                      height: pieceH + 'px',
                      background: color.bg,
                      borderRadius: isFirst
                        ? (isLast ? '22px 6px 6px 22px' : '22px 0 0 22px')
                        : (isLast ? '0 8px 8px 0' : '0'),
                      border: '4px solid #1e293b',
                      borderRight: isLast ? '4px solid #1e293b' : '2px solid #1e293b',
                      borderLeft: isFirst ? '4px solid #1e293b' : '2px solid #1e293b',
                      boxShadow: isFirst ? '0 3.5px 0 #1e293b' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: getPieceFontSize(syl),
                      fontWeight: 900,
                      color: color.text,
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                      position: 'relative'
                    }}
                  >
                    {syl}
                    {/* Peg on right of the last connected piece for next piece to connect to */}
                    {isLast && (
                      <div style={{
                        position: 'absolute',
                        right: isMobile ? `-${pegW - 2}px` : `-${pegW - 4}px`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: pegW + 'px',
                        height: pegH + 'px',
                        background: color.bg,
                        borderTop: '4px solid #1e293b',
                        borderRight: '4px solid #1e293b',
                        borderBottom: '4px solid #1e293b',
                        borderRadius: '0 12px 12px 0',
                        zIndex: 2
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. Draggable ACTIVE next piece (must be dragged/clicked to connect) */}
            {nextPieceIdx < numPieces && (
              <motion.div
                key={`drag-piece-${nextPieceIdx}-${connectedCount}`}
                drag="x"
                dragConstraints={{ left: -250, right: 10 }}
                dragElastic={0.15}
                dragSnapToOrigin
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={(_e, info) => handleDragEnd(nextPieceIdx, _e, info)}
                onClick={() => handleClickPiece(nextPieceIdx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: pieceW + 'px',
                  height: pieceH + 'px',
                  background: PIECE_COLORS[nextPieceIdx % PIECE_COLORS.length].bg,
                  borderRadius: nextPieceIdx === numPieces - 1
                    ? '6px 22px 22px 6px'
                    : '6px',
                  border: '4px solid #1e293b',
                  boxShadow: '0 3.5px 0 #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: isMobile ? '4px' : '10px',
                  boxSizing: 'border-box',
                  fontSize: getPieceFontSize(syllables[nextPieceIdx]),
                  fontWeight: 900,
                  color: PIECE_COLORS[nextPieceIdx % PIECE_COLORS.length].text,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  position: 'relative',
                  cursor: 'grab',
                  touchAction: 'none',
                  zIndex: 10
                }}
              >
                {syllables[nextPieceIdx]}

                {/* Notch on left side to receive peg */}
                <div style={{
                  position: 'absolute',
                  left: isMobile ? '-4px' : '-5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: (pegW - 4) + 'px',
                  height: pegH + 'px',
                  backgroundColor: '#e0f2fe',
                  borderTop: '4px solid #1e293b',
                  borderRight: '4px solid #1e293b',
                  borderBottom: '4px solid #1e293b',
                  borderRadius: '0 12px 12px 0',
                  zIndex: 2
                }} />

                {/* Peg on right side if not the last piece */}
                {nextPieceIdx < numPieces - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: isMobile ? `-${pegW - 2}px` : `-${pegW - 4}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: pegW + 'px',
                    height: pegH + 'px',
                    background: PIECE_COLORS[nextPieceIdx % PIECE_COLORS.length].bg,
                    borderTop: '4px solid #1e293b',
                    borderRight: '4px solid #1e293b',
                    borderBottom: '4px solid #1e293b',
                    borderRadius: '0 12px 12px 0',
                    zIndex: 2
                  }} />
                )}

                {/* Guide hand pointer anchored directly on this active piece */}
                {!interactedPieces[nextPieceIdx] && (
                  <motion.div
                    key={`guide-cursor-${nextPieceIdx}`}
                    animate={{
                      x: isMobile ? [24, -20, -20, 24] : [36, -30, -30, 36],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      pointerEvents: 'none',
                      zIndex: 25,
                      filter: 'drop-shadow(0 3px 5px rgba(16, 24, 47, 0.25))',
                      top: '55%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg
                      width={isMobile ? "32" : "40"}
                      height={isMobile ? "32" : "40"}
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ display: 'block' }}
                    >
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
                )}
              </motion.div>
            )}

            {/* 3. Remaining waiting pieces (faded until their turn) */}
            {syllables.slice(nextPieceIdx + 1).map((syl, offset) => {
              const idx = nextPieceIdx + 1 + offset;
              const color = PIECE_COLORS[idx % PIECE_COLORS.length];
              return (
                <div
                  key={`wait-${idx}`}
                  style={{
                    width: pieceW + 'px',
                    height: pieceH + 'px',
                    background: color.bg,
                    borderRadius: idx === numPieces - 1 ? '6px 22px 22px 6px' : '6px',
                    border: '4px solid #1e293b',
                    boxShadow: '0 3.5px 0 #1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: isMobile ? '4px' : '10px',
                    boxSizing: 'border-box',
                    fontSize: getPieceFontSize(syl),
                    fontWeight: 900,
                    color: color.text,
                    fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                    opacity: 0.45,
                    marginLeft: isMobile ? '14px' : '20px',
                    position: 'relative',
                    userSelect: 'none'
                  }}
                >
                  {syl}
                  {/* Notch on left */}
                  <div style={{
                    position: 'absolute',
                    left: isMobile ? '-4px' : '-5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: (pegW - 4) + 'px',
                    height: pegH + 'px',
                    backgroundColor: '#e0f2fe',
                    borderTop: '4px solid #1e293b',
                    borderRight: '4px solid #1e293b',
                    borderBottom: '4px solid #1e293b',
                    borderRadius: '0 12px 12px 0',
                    zIndex: 2
                  }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple pleasant chime sound using Web Audio API
function playPuzzleChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (_) {}
}

export default SukuKataPuzzleBar;
