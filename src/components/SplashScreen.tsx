import React from "react";
import { motion } from "motion/react";

export interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = React.useState(0);
  const audioPlayedRef = React.useRef(false);

  const playSplashSound = React.useCallback(() => {
    if (audioPlayedRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        let ctx = (window as any)._globalAudioCtx;
        if (!ctx) {
          ctx = new AudioCtx();
          (window as any)._globalAudioCtx = ctx;
        }
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => { });
        }

        audioPlayedRef.current = true;

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
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.75);
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
          sweepGain.connect(ctx.destination);
          sweepOsc.start(sweepTime);
          sweepOsc.stop(sweepTime + 0.22);
        }

        // 3. Completion sparkle chime at ~3.1s
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
          gain.connect(ctx.destination);
          osc.start(compTime + idx * 0.06);
          osc.stop(compTime + idx * 0.06 + 0.65);
        });
      }
    } catch (e) {
      // Audio context error handled
    }
  }, []);

  React.useEffect(() => {
    // Attempt auto-play sound immediately
    playSplashSound();

    // Mobile fallback: If audio was suspended, unlock & play on first touch anywhere
    const handleFirstGesture = () => {
      playSplashSound();
      if (typeof (window as any).unlockMobileAudioSubsystem === "function") {
        (window as any).unlockMobileAudioSubsystem();
      }
    };
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });

    const totalDuration = 3400; // 3.4 seconds
    const intervalMs = 34; // 100 steps * 34ms = 3400ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, [onFinish, playSplashSound]);

  const radius = 98;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
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
        pointerEvents: "none",
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
