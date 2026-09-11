import React from "react";
import { motion } from "motion/react";

export interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = React.useState(0);
  const audioPlayedRef = React.useRef(false);
  const isMountedRef = React.useRef(true);
  const masterGainRef = React.useRef<GainNode | null>(null);
  const activeOscsRef = React.useRef<OscillatorNode[]>([]);

  const stopAndCleanupAudio = React.useCallback(() => {
    isMountedRef.current = false;
    if (masterGainRef.current) {
      try {
        masterGainRef.current.gain.setValueAtTime(0, 0);
        masterGainRef.current.disconnect();
      } catch (e) {}
      masterGainRef.current = null;
    }
    activeOscsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    activeOscsRef.current = [];
  }, []);

  const playSplashSound = React.useCallback(() => {
    if (audioPlayedRef.current || !isMountedRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      // Share the same AudioContext with app-logic.js via window._globalAudioCtx
      let ctx = (window as any)._globalAudioCtx;
      if (!ctx) {
        ctx = new AudioCtx();
        (window as any)._globalAudioCtx = ctx;
      }

      const startSynthesis = () => {
        if (audioPlayedRef.current || !isMountedRef.current) return;
        if (ctx.state !== "running") return;

        audioPlayedRef.current = true;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(1, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // 1. Initial sci-fi rising chord shimmer
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq: number, idx: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.7);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.75);
          activeOscsRef.current.push(osc);
        });

        // 2. High-tech scanner radar pulse sweeps
        for (let i = 1; i <= 3; i++) {
          const sweepTime = ctx.currentTime + i * 0.85;
          const sweepOsc = ctx.createOscillator();
          const sweepGain = ctx.createGain();
          sweepOsc.type = "triangle";
          sweepOsc.frequency.setValueAtTime(320 + i * 60, sweepTime);
          sweepOsc.frequency.exponentialRampToValueAtTime(700 + i * 100, sweepTime + 0.15);
          sweepGain.gain.setValueAtTime(0.001, sweepTime);
          sweepGain.gain.exponentialRampToValueAtTime(0.07, sweepTime + 0.05);
          sweepGain.gain.exponentialRampToValueAtTime(0.0001, sweepTime + 0.2);
          sweepOsc.connect(sweepGain);
          sweepGain.connect(masterGain);
          sweepOsc.start(sweepTime);
          sweepOsc.stop(sweepTime + 0.22);
          activeOscsRef.current.push(sweepOsc);
        }

        // 3. Completion sparkle chime at ~3.05s
        const compTime = ctx.currentTime + 3.05;
        const compNotes = [659.25, 783.99, 1046.50, 1318.51];
        compNotes.forEach((freq: number, idx: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, compTime + idx * 0.06);
          gain.gain.setValueAtTime(0.0001, compTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.16, compTime + idx * 0.06 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, compTime + idx * 0.06 + 0.6);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(compTime + idx * 0.06);
          osc.stop(compTime + idx * 0.06 + 0.65);
          activeOscsRef.current.push(osc);
        });
      };

      const tryResumeAndPlay = () => {
        if (audioPlayedRef.current || !isMountedRef.current) return;
        // Refresh ctx reference in case app-logic.js updated it
        const latestCtx = (window as any)._globalAudioCtx || ctx;
        if (latestCtx.state === "running") {
          startSynthesis();
        } else if (latestCtx.state === "suspended") {
          latestCtx.resume()
            .then(() => { if (isMountedRef.current) startSynthesis(); })
            .catch(() => {});
        }
      };

      // First attempt
      tryResumeAndPlay();

      // Retry after short delay (in case AudioContext was just created and still initializing)
      if (!audioPlayedRef.current) {
        setTimeout(() => { if (isMountedRef.current) tryResumeAndPlay(); }, 200);
        setTimeout(() => { if (isMountedRef.current) tryResumeAndPlay(); }, 600);
      }
    } catch (e) {
      // Audio context error handled
    }
  }, []);

  React.useEffect(() => {
    isMountedRef.current = true;

    // Attempt auto-play sound immediately
    playSplashSound();

    // Mobile/Desktop fallback: If audio was suspended by browser autoplay policy,
    // unlock & play immediately upon user interaction during splash screen
    const handleFirstGesture = () => {
      // Resume AudioContext directly (works even before app-logic.js loads)
      const ctx = (window as any)._globalAudioCtx;
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      // Also call app-logic.js unlocker if available
      if (typeof (window as any).unlockMobileAudioSubsystem === "function") {
        (window as any).unlockMobileAudioSubsystem();
      }
      playSplashSound();
    };

    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });

    // Poll to play audio as soon as AudioContext becomes "running"
    // (catches the case where browser unblocks it shortly after load)
    let pollCount = 0;
    const pollInterval = setInterval(() => {
      pollCount++;
      if (pollCount > 10) { clearInterval(pollInterval); return; } // Stop after ~3s
      if (!audioPlayedRef.current && isMountedRef.current) {
        playSplashSound();
      } else {
        clearInterval(pollInterval);
      }
    }, 300);

    const intervalMs = 34; // 100 steps * 34ms = 3400ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            stopAndCleanupAudio();
            onFinish();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
      stopAndCleanupAudio();
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, [onFinish, playSplashSound, stopAndCleanupAudio]);

  const radius = 98;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      onClick={playSplashSound}
      onTouchStart={playSplashSound}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "var(--bg-cream, #fef9ec)",
        backgroundImage: "url('/images/sampingan/background-utama.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "hidden",
        userSelect: "none",
        pointerEvents: "auto",
        cursor: "pointer",
      }}
    >
      {/* Soft Ambient Light Behind Circle */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.28) 0%, rgba(16, 185, 129, 0) 70%)",
          animation: "pulseSlowScale 2.5s infinite ease-in-out",
          pointerEvents: "none",
        }}
      />

      {/* Main Center Green Scanner Circle Container */}
      <div
        style={{
          position: "relative",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          backgroundColor: "#064e3b",
          backgroundImage:
            "radial-gradient(rgba(52, 211, 153, 0.18) 2px, transparent 2px), radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px), linear-gradient(145deg, #064e3b 0%, #0d6b5e 50%, #04362b 100%)",
          backgroundSize: "18px 18px, 9px 9px, 100% 100%",
          border: "3px solid #34d399",
          boxShadow:
            "0 0 35px rgba(52, 211, 153, 0.5), inset 0 0 25px rgba(52, 211, 153, 0.2)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* Holographic Laser Scan Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(to right, transparent, rgba(52, 211, 153, 1), rgba(251, 191, 36, 1), rgba(52, 211, 153, 1), transparent)",
            boxShadow:
              "0 0 14px rgba(52, 211, 153, 0.95), 0 0 6px rgba(251, 191, 36, 0.9)",
            animation: "gamingScanLine 1.8s linear infinite",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Outer dashed spinning ring */}
        <div
          style={{
            position: "absolute",
            width: "216px",
            height: "216px",
            borderRadius: "50%",
            border: "2px dashed rgba(52, 211, 153, 0.45)",
            animation: "spin 12s linear infinite",
          }}
        />

        {/* SVG Circular Loading Progress Ring */}
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotate(-90deg)",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {/* Background track circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="5"
          />
          {/* Animated progress circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="url(#splashProgressGradient)"
            strokeWidth="5.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 8px rgba(52, 211, 153, 0.9))",
            }}
          />
          <defs>
            <linearGradient id="splashProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Logo Image */}
        <img
          src="/images/sampingan/logo-login-screen.png"
          alt="Bunyi Kata Logo"
          className="glitch-logo"
          style={{
            width: "135px",
            height: "auto",
            maxHeight: "135px",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
            position: "relative",
            zIndex: 5,
          }}
        />
      </div>
    </motion.div>
  );
}

export default SplashScreen;
