// ============================================================================
// uiSfx.ts — Lapisan bunyi antara muka SEMANTIK untuk seluruh "Bunyi Kata"
// ----------------------------------------------------------------------------
// Satu pemain (player) kongsi, hanya di klien, dibina dari pakej `uisfx`.
// Semantik cue mengikut MAKNA peristiwa (bukan rupa kawalan): navigation,
// success/error, reward, toggle, dsb.
//
// PAKEJ DIPILIH: "minimal"
//   • Kering, tepat, hampir "tak nampak" — sesuai untuk UI sistem/produktiviti
//     yang tidak mahu bunyi menonjol atau menjejaskan tumpuan.
//   • Dipilih sementara untuk UJIAN (A/B) — asal ialah `organic`.
//
// PERATURAN HAYAT (lifecycle):
//   • TIDAK bina/main audio semasa import atau SSR (lazy pada gesture pertama).
//   • Pemain TUNGGAL (module singleton) — selamat dari StrictMode double-mount.
//   • Guna AudioContext KONGSI app (coreAudio) — tiada konteks kedua.
//   • Keutamaan (enabled/volume/pack) disimpan dalam localStorage.
// ============================================================================

import { createUISFX, type UISFXPlayer, type PackName, type CueName, type PlayingSFX } from "uisfx";

/** Nama pakej bunyi rasmi dari katalog uisfx (dipilih untuk produk ini). */
export const PACK_NAME: PackName = "minimal";

/** Kunci keutamaan dalam localStorage (selaras dengan app: awalan `bunyiKata`). */
export const SOUND_PREF_KEY = "bunyiKata:uisfx";

const DEFAULT_VOLUME = 0.7;

// ── Keadaan singleton (hidup sepanjang hayat app) ───────────────────────────
let _player: UISFXPlayer | null = null;
let _unlocked = false;

/** Setiap gelung (loop) yang aktif disimpan ikut nama cue supaya boleh dihentikan. */
const _loops = new Map<CueName, PlayingSFX>();

// ── Keutamaan: enabled/volume/pack ──────────────────────────────────────────
function _storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

interface SoundPrefs {
  enabled: boolean;
  volume: number;
}

/** Baca keutamaan bunyi dengan selamat (fallback: BUNYI HIDUP, volume 0.7). */
export function readSoundPrefs(): SoundPrefs {
  const store = _storage();
  if (!store) return { enabled: true, volume: DEFAULT_VOLUME };
  try {
    const raw = store.getItem(SOUND_PREF_KEY);
    if (!raw) return { enabled: true, volume: DEFAULT_VOLUME };
    const parsed = JSON.parse(raw) as Partial<SoundPrefs>;
    return {
      enabled: parsed.enabled !== false, // lalai hidup
      volume:
        typeof parsed.volume === "number" && isFinite(parsed.volume)
          ? Math.min(1, Math.max(0, parsed.volume))
          : DEFAULT_VOLUME,
    };
  } catch {
    return { enabled: true, volume: DEFAULT_VOLUME };
  }
}

function writeSoundPrefs(patch: Partial<SoundPrefs>): SoundPrefs {
  const next = { ...readSoundPrefs(), ...patch };
  const store = _storage();
  if (store) {
    try {
      store.setItem(SOUND_PREF_KEY, JSON.stringify(next));
    } catch {
      /* stor penuh / private mode — abaikan */
    }
  }
  return next;
}

/** Adakah audio sudah "dibuka" (unlocked) oleh gesture pengguna? */
export function isUnlocked(): boolean {
  return _unlocked;
}

/** Adakah bunyi aktif pada masa ini? (tanpa membina pemain). */
export function isSoundEnabled(): boolean {
  return readSoundPrefs().enabled;
}

// ── Pembinaan pemain (lazy, hanya di klien) ─────────────────────────────────

// Titik suntikan untuk ujian (elak Web Audio sebenar).
type PlayerFactory = (prefs: SoundPrefs) => UISFXPlayer;
let _playerFactory: PlayerFactory | null = null;

/** Ujian sahaja: ganti pembina pemain dan set semula keadaan. */
export function __setPlayerFactoryForTests(factory: PlayerFactory | null): void {
  _playerFactory = factory;
  _player = null;
  _unlocked = false;
  _loops.clear();
}

/**
 * Cipta pemain uisfx TUNGGAL. Tidak pernah dipanggil semasa SSR/import.
 * Menggunakan AudioContext KONGSI app (coreAudio) supaya tiada konteks kedua —
 * oleh itu `ui.destroy()` TIDAK menutup konteks itu (ia dipunyai app).
 */
function ensurePlayer(): UISFXPlayer | null {
  if (_player) return _player;
  if (typeof window === "undefined") return null; // SSR: jangan bina
  try {
    const prefs = readSoundPrefs();
    // Titik suntikan untuk ujian (elak Web Audio sebenar).
    if (_playerFactory) {
      _player = _playerFactory(prefs) as UISFXPlayer;
      return _player;
    }
    // Guna konteks audio kongsi app jika ada (elak had ~6 AudioContext).
    let ctx: AudioContext | undefined;
    try {
      const getCtx =
        (window as any).getGlobalAudioContext ||
        (window as any).coreAudio?.getCoreAudioContext;
      if (typeof getCtx === "function") {
        const shared = getCtx();
        if (shared) ctx = shared as AudioContext;
      }
    } catch {
      /* fallback: uisfx cipta sendiri */
    }

    _player = createUISFX({
      pack: PACK_NAME,
      volume: prefs.volume,
      enabled: prefs.enabled,
      preferences: { key: SOUND_PREF_KEY },
      ...(ctx ? { context: ctx } : {}),
    });
    return _player;
  } catch {
    return null;
  }
}

/**
 * Buka kunci audio dari gesture PERTAMA pengguna (pointer/keyboard).
 * Selamat dipanggil berulang; idempotent. TIDAK memainkan bunyi apa-apa —
 * jadi tiada autoplay. Panggil ini secara SEGERA dalam handler gesture.
 */
export function unlockUiSfx(): boolean {
  if (_unlocked) return true;
  const ui = ensurePlayer();
  if (!ui) return false;
  // Resume konteks Kongsi app juga (iOS/Android Safari).
  try {
    const resume =
      (window as any).resumeCoreAudio || (window as any).coreAudio?.resumeCoreAudio;
    if (typeof resume === "function") resume();
  } catch {
    /* abaikan */
  }
  try {
    void ui.unlock();
  } catch {
    /* abaikan */
  }
  _unlocked = true;
  return true;
}

/**
 * Sediakan pembukaan kunci pada gesture pertama (sekali sahaja, capture phase).
 * Selamat dipanggil berulang (idempotent).
 */
let _unlockerInstalled = false;
export function installUiSfxUnlocker(): void {
  if (typeof document === "undefined" || _unlockerInstalled) return;
  _unlockerInstalled = true;
  const handler = () => {
    unlockUiSfx();
    // Selepas gesture pertama, cabut pendengar — tidak perlu lagi.
    if (_unlocked) {
      ["touchstart", "pointerdown", "mousedown", "keydown"].forEach((evt) =>
        document.removeEventListener(evt, handler, { capture: true } as any)
      );
    }
  };
  ["touchstart", "pointerdown", "mousedown", "keydown"].forEach((evt) =>
    document.addEventListener(evt, handler, { capture: true, passive: true } as any)
  );
}

// ── API semantik (MAKNA peristiwa, bukan rupa kawalan) ──────────────────────

export interface PlayCueOptions {
  /** Paksa main walaupun belum unlocked (untuk cue segerak dalam gesture). */
  force?: boolean;
  volume?: number;
}

/**
 * Main satu cue. Mengembalikan `PlayingSFX | null`.
 * - Menghormati keutamaan `enabled`.
 * - Untuk cue tak segerak SEBELUM unlock: pulangkan null (elak bunyi basi),
 *   KECUALI `force` (dipanggil segerak dalam handler gesture).
 */
export function playCue(
  cue: CueName,
  opts: PlayCueOptions = {}
): PlayingSFX | null {
  const ui = ensurePlayer();
  if (!ui) return null;
  if (!ui.isEnabled()) return null;
  // Elak cue tak segerak "basi" sebelum audio dibuka.
  if (!_unlocked && !opts.force) return null;
  try {
    return ui.play(cue, opts.volume != null ? { volume: opts.volume } : undefined);
  } catch {
    return null;
  }
}

// ── Cue peristiwa bernama (mudah dibaca oleh pemanggil) ─────────────────────

/** Sentuhan/tap pada kawalan. Dipanggil SEGERAK dalam handler gesture. */
export function press(): PlayingSFX | null {
  return playCue("press", { force: true });
}

/** Perpindahan skrin/pandangan. */
export function navigate(mode: "open" | "back" | "forward" = "open"): PlayingSFX | null {
  return playCue(mode);
}

/** Pilihan (tab/menu/kad) — dari keadaan HASIL, bukan teka-teki. */
export function select(): PlayingSFX | null {
  return playCue("select");
}

/** Toggle hidup/mati — cue dari keadaan BAHARU. */
export function toggle(on: boolean): PlayingSFX | null {
  return playCue(on ? "toggle-on" : "toggle-off");
}

/** Dialog/modal dibuka atau ditutup. */
export function dialog(open: boolean): PlayingSFX | null {
  return playCue(open ? "open" : "close");
}

/** Keputusan operasi tak segerak — hanya selepas ia benar-benar selesai. */
export function outcome(kind: "success" | "error" | "warning" | "info"): PlayingSFX | null {
  return playCue(kind);
}

/** Bintang/bonus kecil diperoleh (ganjaran unit nilai). */
export function reward(): PlayingSFX | null {
  return playCue("reward");
}

/** Milestone: naik tahap / lencana baharu. */
export function milestone(
  kind: "level-up" | "badge" | "achievement" = "level-up"
): PlayingSFX | null {
  return playCue(kind);
}

/** Sesi masuk/keluar (kunci/buka). */
export function session(kind: "login" | "logout"): PlayingSFX | null {
  return playCue(kind === "login" ? "unlock" : "lock");
}

/** Input teks (keyboard sonification) — volume rendah. */
export function typing(): PlayingSFX | null {
  return playCue("typing", { volume: 0.065 });
}

// ── Gelung (loops) ───────────────────────────────────────────────────────────

export type LoopCue =
  | "loading"
  | "processing"
  | "recording"
  | "connecting"
  | "scanning"
  | "streaming";

/**
 * Mulakan gelung untuk proses yang SEDANG kelihatan. Idempotent: memanggil
 * semula cue yang sama tidak menimbulkan gelung bertindih.
 */
export function startLoop(cue: LoopCue): PlayingSFX | null {
  const existing = _loops.get(cue);
  if (existing) return existing;
  const handle = playCue(cue);
  if (handle) _loops.set(cue, handle);
  return handle;
}

/** Hentikan satu gelung (jika ada) dan buang pemegangnya. */
export function stopLoop(cue: LoopCue): void {
  const handle = _loops.get(cue);
  if (!handle) return;
  try {
    handle.stop();
  } catch {
    /* abaikan */
  }
  _loops.delete(cue);
}

/** Hentikan SEMUA gelung berdaftar dan buang semua pemegang. */
export function stopAllLoops(): void {
  _loops.forEach((handle) => {
    try {
      handle.stop();
    } catch {
      /* abaikan */
    }
  });
  _loops.clear();
}

// ── Keutamaan runtime (dipanggil oleh UI tetapan bunyi) ─────────────────────

/** Hidup/matikan bunyi. Mematikan = hentikan gelung + stopAll serta-merta. */
export function setEnabled(enabled: boolean): void {
  writeSoundPrefs({ enabled });
  const ui = ensurePlayer();
  if (!ui) return;
  if (!enabled) {
    // Hentikan gelung dahulu, kosongkan pemegang, kemudian mute.
    stopAllLoops();
    try {
      ui.stopAll();
    } catch {
      /* abaikan */
    }
  }
  try {
    ui.setEnabled(enabled);
  } catch {
    /* abaikan */
  }
}

/** Set volume (0..1) dan simpan. */
export function setVolume(volume: number): void {
  const v = Math.min(1, Math.max(0, volume));
  writeSoundPrefs({ volume: v });
  const ui = ensurePlayer();
  try {
    ui?.setVolume(v);
  } catch {
    /* abaikan */
  }
}

/** Tukar pakej bunyi (masa hadapan) dan simpan. */
export function setPack(pack: PackName): void {
  const ui = ensurePlayer();
  try {
    ui?.setPack(pack);
  } catch {
    /* abaikan */
  }
}

// ── Transisi global & teardown ──────────────────────────────────────────────

/** Untuk transisi global (cth. log keluar): hentikan semua gelung + semua bunyi. */
export function stopAll(): void {
  stopAllLoops();
  try {
    _player?.stopAll();
  } catch {
    /* abaikan */
  }
}

/**
 * Lupuskan pemain (hanya semasa pelupusan perkhidmatan app). Konteks audio
 * KONGSI app TIDAK ditutup di sini kerana ia dipunyai coreAudio.
 */
export async function destroy(): Promise<void> {
  stopAllLoops();
  const ui = _player;
  _player = null;
  _unlocked = false;
  if (ui) {
    try {
      await ui.destroy();
    } catch {
      /* abaikan */
    }
  }
}

