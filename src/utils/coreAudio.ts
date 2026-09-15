// ============================================================================
// coreAudio.ts - Enjin audio KONGSI untuk seluruh aplikasi (Web + React)
// ----------------------------------------------------------------------------
// Tujuan: selesaikan masalah pada mobile/tablet:
//   1. AudioContext BANYAK (had ~6 per halaman) -> bunyi senyap / lambat
//   2. AudioContext SUSPENDED sebelum user gesture -> klik pertama tak bunyi,
//      klik kedua baru berbunyi "double"
//   3. Dua enjin audio bertindih (app-logic.js + React) -> bunyi dobel
//
// Semua modul mesti guna getCoreAudioContext() + unlockCoreAudio() di sini,
// BUKAN `new AudioContext()` sendiri-sendiri.
// ============================================================================

let _coreCtx: AudioContext | null = null;
let _unlocked = false;

/** Dapatkan SATU AudioContext kongsi untuk seluruh app. */
export function getCoreAudioContext(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const Ctor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;

    // Guna ctx yang app-logic.js sudah cipta supaya SATU sahaja untuk semua.
    const existing =
      (window as any)._globalAudioCtx || (window as any).globalAudioCtx;
    if (existing) {
      _coreCtx = existing;
    } else if (!_coreCtx) {
      _coreCtx = new Ctor();
      (window as any)._globalAudioCtx = _coreCtx;
    }
    return _coreCtx;
  } catch (e) {
    return null;
  }
}

/** Resume AudioContext (panggil pada SETIAP user gesture). */
export function resumeCoreAudio(): AudioContext | null {
  const ctx = getCoreAudioContext();
  try {
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  } catch (e) {}
  return ctx;
}

/**
 * Buka kunci audio pada mobile (iOS/Android) semasa gesture PERTAMA.
 * Main 1 sampel senyap + resume ctx. Selamat dipanggil berulang kali.
 */
export function unlockCoreAudio(): void {
  try {
    const ctx = resumeCoreAudio();
    if (ctx && !_unlocked) {
      _unlocked = true;
      // Buffer senyap 1 sampel -> buka kunci output audio pada iOS Safari
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      try {
        src.start(0);
      } catch (e) {}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }
  } catch (e) {}
}

/** Pasang listener unlock pada gesture pertama (dipanggil sekali di main/App). */
export function installCoreAudioUnlocker(): void {
  if (typeof document === "undefined") return;
  const handler = () => unlockCoreAudio();
  ["touchstart", "touchend", "pointerdown", "mousedown", "click", "keydown"].forEach(
    (evt) =>
      document.addEventListener(evt, handler, { capture: true, passive: true })
  );
}

export interface ToneOptions {
  type?: OscillatorType;
  /** [masaAwalRelatif, freq] arahan frekuensi */
  freqRamp: Array<[number, number]>;
  /** [masaRelatif, gain] arahan amplitud */
  gainRamp: Array<[number, number]>;
  /** Offset masa mula (detik relatif kepada now) */
  delay?: number;
}

/**
 * Main satu nada ringkas pada AudioContext kongsi. Resume ctx dahulu supaya
 * bunyi TIDAK delay pada klik pertama di mobile.
 */
export function playTone(opts: ToneOptions): void {
  try {
    const ctx = resumeCoreAudio();
    if (!ctx) return;
    const now = ctx.currentTime + (opts.delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type || "sine";
    opts.freqRamp.forEach(([t, f], i) => {
      if (i === 0) osc.frequency.setValueAtTime(f, now + t);
      else osc.frequency.exponentialRampToValueAtTime(Math.max(1, f), now + t);
    });
    opts.gainRamp.forEach(([t, g], i) => {
      if (i === 0) gain.gain.setValueAtTime(g, now + t);
      else gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, g), now + t);
    });
    osc.connect(gain);
    gain.connect(ctx.destination);
    const startAt = now + (opts.freqRamp[0]?.[0] || 0);
    const endAt =
      now +
      Math.max(
        ...opts.freqRamp.map((r) => r[0]),
        ...opts.gainRamp.map((r) => r[0])
      );
    osc.start(startAt);
    osc.stop(endAt + 0.02);
  } catch (e) {}
}

// ─── Bunyi standard (dikongsi seluruh app supaya konsisten & tak double) ───

export function playNavTone(): void {
  playTone({
    type: "sine",
    freqRamp: [
      [0, 440],
      [0.08, 880],
    ],
    gainRamp: [
      [0, 0.2],
      [0.1, 0.001],
    ],
  });
}

export function playPopTone(): void {
  playTone({
    type: "sine",
    freqRamp: [
      [0, 700],
      [0.05, 1400],
    ],
    gainRamp: [
      [0, 0.3],
      [0.08, 0.001],
    ],
  });
}

export function playErrorTone(): void {
  playTone({
    type: "sawtooth",
    freqRamp: [[0, 220]],
    gainRamp: [
      [0, 0.2],
      [0.25, 0.001],
    ],
  });
}
