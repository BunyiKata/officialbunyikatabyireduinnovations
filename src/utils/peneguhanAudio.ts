// ============================================================================
// peneguhanAudio.ts — Audio PENEGUHAN (MP3 sebenar) untuk peristiwa jawapan
// ----------------------------------------------------------------------------
// Berbeza daripada uiSfx (synth Web Audio), modul ini memainkan fail MP3
// sebenar dalam /audio/peneguhan/:
//
//   correct-pandainya.mp3     → jawapan BETUL (giliran soalan ganjil: 1,3,5…)
//   correct-hebat.mp3         → jawapan BETUL (giliran soalan genap: 2,4,6…)
//   wrong-cuba-lagi.mp3       → jawapan SALAH
//   popup-tahniah-anda-hebat.mp3 → popup akhir sesi: BERJAYA semua bintang
//   popup-oops-cuba-lagi.mp3  → popup akhir sesi: TIDAK semua bintang
//
// PRINSIP:
//   • Guna instans `new Audio()` SENDIRI — bukan pemain uisfx/coreAudio kongsi.
//     Ini penting supaya peneguhan jawapan TIDAK memotong audio soalan yang
//     sedang dimainkan (hentikanAudioSemasa dsb.).
//   • Menghormati pref bunyi app (uiSfx.isSoundEnabled()).
//   • Autoplay selamat: setiap play() di-`.catch()`.
//   • Tidak pernah dimainkan pada SSR/import (lazy pada panggilan).
// ============================================================================

import { isSoundEnabled } from "./uiSfx";

/** Direktori awam yang menyimpan semua MP3 peneguhan. */
const PENEGUHAN_DIR = "/audio/peneguhan";

// ── Kaunter giliran (modul singleton, hidup sepanjang hayat app) ─────────────
// Dikongsi merentas SEMUA modul (Cabaran Utama/Tambahan + AR) supaya selang
// seli correct-pandainya / correct-hebat konsisten mengikut nombor soalan.
let _correctTurn = 0;

/** Set semula kaunter giliran (panggil bila mula/tetap semula sesi permainan). */
export function resetPeneguhanTurn(): void {
  _correctTurn = 0;
}

// ── Pemain MP3 asas ──────────────────────────────────────────────────────────
function playPeneguhanFile(file: string, volume = 0.9): void {
  if (typeof window === "undefined") return;
  // Hormati tetapan bunyi app — jangan main bila pengguna matikan bunyi.
  try {
    if (!isSoundEnabled()) return;
  } catch {
    /* kalau pref tak boleh dibaca, teruskan main */
  }
  try {
    const audio = new Audio(`${PENEGUHAN_DIR}/${file}`);
    audio.volume = volume;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    /* Audio tak tersedia — abaikan senyap */
  }
}

// ── API awam ─────────────────────────────────────────────────────────────────

/**
 * Peneguhan jawapan BETUL. Selang-seli ikut nombor soalan betul:
 * giliran 1 → pandainya, giliran 2 → hebat, giliran 3 → pandainya …
 */
export function playCorrectPeneguhan(): void {
  const file = _correctTurn % 2 === 0 ? "correct-pandainya.mp3" : "correct-hebat.mp3";
  _correctTurn++;
  playPeneguhanFile(file);
}

/** Peneguhan jawapan SALAH. */
export function playWrongPeneguhan(): void {
  playPeneguhanFile("wrong-cuba-lagi.mp3");
}

/** Popup akhir sesi — BERJAYA mendapat SEMUA bintang. */
export function playPopupBerjaya(): void {
  playPeneguhanFile("popup-tahniah-anda-hebat.mp3");
}

/** Popup akhir sesi — TIDAK mendapat semua bintang. */
export function playPopupGagal(): void {
  playPeneguhanFile("popup-oops-cuba-lagi.mp3");
}

// ── Jambatan global untuk kod JS lama (app-logic.js / AR) ────────────────────
// Panggil `window.playPeneguhanCorrect?.()` dsb. dari skrip bukan-modul.
function installGlobalBridge(): void {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.playPeneguhanCorrect = playCorrectPeneguhan;
  w.playPeneguhanWrong = playWrongPeneguhan;
  w.playPeneguhanPopupBerjaya = playPopupBerjaya;
  w.playPeneguhanPopupGagal = playPopupGagal;
  w.resetPeneguhanTurn = resetPeneguhanTurn;
}

installGlobalBridge();
