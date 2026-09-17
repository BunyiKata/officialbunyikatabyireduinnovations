// ============================================================================
// uiSfxBridge.ts — Jambatan global untuk kod JS lama (app-logic.js dll.)
// ----------------------------------------------------------------------------
// app-logic.js / surih-*.js ialah skrip JS biasa (bukan modul), jadi ia tidak
// boleh `import` uiSfx.ts. Modul ini mendedahkan API semantik pada `window`
// dengan nama berawalan `bkSfx` supaya kedua-dua enjin berkongsi SATU pemain.
// ============================================================================

import * as uiSfx from "./uiSfx";

// ============================================================================
// MOD "SATU CUE" (CUMA_SELECT)
// ----------------------------------------------------------------------------
// Atas permintaan: SETIAP bunyi UI (press, reward, success/error, toggle,
// dialog, session, navigate) main cue `select` yang SAMA. Ini bermakna app
// hanya ada SATU bunyi untuk semua tindakan.
//
// Kesannya: murid TIDAK lagi boleh beza "betul" vs "salah" melalui bunyi,
// kerana reward/success/error semuanya sama. Tetapkan CUMA_SELECT = false
// untuk pulihkan bunyi semantik penuh (reward ≠ error, dll.).
// ============================================================================
export const CUMA_SELECT = true;

export function installUiSfxBridge(): void {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.bkSfx) return; // idempotent

  // Keyboard sonification (OPT-IN, lalai MATI). Bila dihidupkan, main cue
  // `typing` yang pendek SEKALI untuk setiap peristiwa `input` tempatan
  // (bukan gelung taip yang panjang). Tidak pernah untuk sentuh/hover.
  const TYPING_KEY = "bunyiKata:uisfx:typing";
  const typingEnabled = () => {
    try {
      return localStorage.getItem(TYPING_KEY) === "1";
    } catch {
      return false;
    }
  };
  let typingListenerAttached = false;
  const ensureTypingListener = () => {
    if (typingListenerAttached || typeof document === "undefined") return;
    typingListenerAttached = true;
    document.addEventListener(
      "input",
      (e: any) => {
        if (!typingEnabled()) return;
        const el = e?.target;
        if (!el || el.isContentEditable) return;
        const tag = (el.tagName || "").toLowerCase();
        const isTextEntry =
          tag === "textarea" ||
          (tag === "input" &&
            /^(text|search|email|url|tel|password|number|)$/.test((el.type || "text").toLowerCase()));
        if (!isTextEntry) return;
        uiSfx.typing();
      },
      { capture: true, passive: true }
    );
  };

  // Helper: pulangkan cue `select` bila CUMA_SELECT, jika tidak kekal semantic.
  const cue = (semantic: () => any) => (CUMA_SELECT ? uiSfx.select() : semantic());

  w.bkSfx = {
    /** Tap/press segerak (untuk gesture handler). */
    press: () =>
      CUMA_SELECT ? uiSfx.playCue("select", { force: true }) : uiSfx.press(),
    navigate: (mode?: "open" | "back" | "forward") =>
      cue(() => uiSfx.navigate(mode)),
    select: () => uiSfx.select(),
    toggle: (on: boolean) => cue(() => uiSfx.toggle(on)),
    dialog: (open: boolean) => cue(() => uiSfx.dialog(open)),
    outcome: (kind: "success" | "error" | "warning" | "info") =>
      cue(() => uiSfx.outcome(kind)),
    reward: () => cue(() => uiSfx.reward()),
    milestone: (kind?: "level-up" | "badge" | "achievement") =>
      cue(() => uiSfx.milestone(kind)),
    session: (kind: "login" | "logout") => cue(() => uiSfx.session(kind)),
    typing: () => uiSfx.select(),
    play: (c: string) => (CUMA_SELECT ? uiSfx.select() : uiSfx.playCue(c as any)),
    // Gelung juga guna cue `select` (berulang) bila CUMA_SELECT.
    startLoop: (c: string) =>
      uiSfx.startLoop((CUMA_SELECT ? "select" : c) as any),
    stopLoop: (c: string) =>
      uiSfx.stopLoop((CUMA_SELECT ? "select" : c) as any),
    stopAllLoops: () => uiSfx.stopAllLoops(),
    stopAll: () => uiSfx.stopAll(),
    isEnabled: () => uiSfx.isSoundEnabled(),
    setEnabled: (v: boolean) => uiSfx.setEnabled(v),
    setVolume: (v: number) => uiSfx.setVolume(v),
    unlock: () => uiSfx.unlockUiSfx(),
    // Keyboard sonification opt-in.
    isTypingEnabled: () => typingEnabled(),
    setTypingEnabled: (v: boolean) => {
      try {
        localStorage.setItem(TYPING_KEY, v ? "1" : "0");
      } catch {
        /* abaikan */
      }
      if (v) ensureTypingListener();
    },
    pack: uiSfx.PACK_NAME,
    cumaSelect: CUMA_SELECT,
  };

  // Pasang pendengar taip sekali (aktif hanya bila pref dihidupkan).
  ensureTypingListener();
}
