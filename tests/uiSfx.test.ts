// ============================================================================
// uiSfx.test.ts — Ujian untuk lapisan bunyi semantik (uisfx).
// ----------------------------------------------------------------------------
// Dijalankan dengan Node's built-in test runner melalui tsx:
//   npm test
// Meliputi: pemetaan cue semantik, pemasaan success/error, pembersihan gelung
// pada setiap laluan, keabadian mute, dedup kekunci/pointer, keselamatan SSR,
// dan pembersihan semasa remount.
// ============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

// ── Persekitaran pelayar tiruan (dipasang SEBELUM import uiSfx) ─────────────
class FakeStorage {
  private map = new Map<string, string>();
  getItem(k: string): string | null {
    return this.map.has(k) ? (this.map.get(k) as string) : null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, String(v));
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
  clear(): void {
    this.map.clear();
  }
}

const store = new FakeStorage();
const g = globalThis as any;
g.window = {
  localStorage: store,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
};
g.localStorage = store;
g.document = {
  addEventListener() {},
  removeEventListener() {},
};

// ── Pemain uisfx palsu untuk merekod panggilan ──────────────────────────────
interface Recorded {
  played: Array<{ cue: string; volume?: number }>;
  stops: number;
  stopAll: number;
  destroyed: number;
  volume?: number;
  enabled: boolean;
  pack: string;
}

let rec: Recorded;
const fakeHandles: any[] = [];

function makeFakePlayer(prefs: { enabled: boolean; volume: number }) {
  rec = { played: [], stops: 0, stopAll: 0, destroyed: 0, volume: prefs.volume, enabled: prefs.enabled, pack: "minimal" };
  return {
    unlock: async () => true,
    play: (cue: string, opts?: { volume?: number }) => {
      if (!rec.enabled) return null;
      rec.played.push({ cue, volume: opts?.volume });
      let stopped = false;
      const handle = {
        stop: () => {
          if (!stopped) {
            stopped = true;
            rec.stops++;
          }
        },
        ended: Promise.resolve(),
      };
      fakeHandles.push(handle);
      return handle;
    },
    preload: async () => {},
    setPack: (p: string) => {
      rec.pack = p;
    },
    getPack: () => rec.pack,
    setVolume: (v: number) => {
      rec.volume = v;
    },
    getVolume: () => rec.volume ?? 0.7,
    setEnabled: (v: boolean) => {
      rec.enabled = v;
    },
    isEnabled: () => rec.enabled,
    stopAll: () => {
      rec.stopAll++;
    },
    destroy: async () => {
      rec.destroyed++;
    },
  } as any;
}

// Import SELEPAS globals dipasang.
const ui = await import("../src/utils/uiSfx.ts");

function resetModule() {
  ui.__setPlayerFactoryForTests(makeFakePlayer as any);
  ui.__setPlayerFactoryForTests(makeFakePlayer as any);
  store.clear();
  fakeHandles.length = 0;
}


// ── 1. Pemetaan cue semantik ────────────────────────────────────────────────
test("semantic cue mapping: outcome/reward/milestone/session/navigate", () => {
  resetModule();
  ui.unlockUiSfx(); // buka kunci supaya cue tak segerak dibenarkan

  ui.outcome("success");
  ui.outcome("error");
  ui.outcome("warning");
  ui.reward();
  ui.milestone("level-up");
  ui.session("login");
  ui.session("logout");
  ui.navigate("open");
  ui.toggle(true);

  const cues = rec.played.map((p) => p.cue);
  assert.deepEqual(cues, [
    "success",
    "error",
    "warning",
    "reward",
    "level-up",
    "unlock",
    "lock",
    "open",
    "toggle-on",
  ]);
});

test("typing cue uses a low volume", () => {
  resetModule();
  ui.unlockUiSfx();
  ui.typing();
  const last = rec.played[rec.played.length - 1];
  assert.equal(last.cue, "typing");
  assert.equal(last.volume, 0.065);
});

// ── 2. Pemasaan success/error sebenar ───────────────────────────────────────
test("outcome cues fire only at the resolved/gated moment", () => {
  resetModule();
  ui.unlockUiSfx();
  assert.equal(rec.played.length, 0);
  ui.outcome("success");
  assert.equal(rec.played.length, 1);
  assert.equal(rec.played[0].cue, "success");
});

// ── 3. Pembersihan gelung pada setiap laluan ────────────────────────────────
test("loop start is idempotent and stop clears the retained handle", () => {
  resetModule();
  ui.unlockUiSfx();
  const h1 = ui.startLoop("processing");
  const h2 = ui.startLoop("processing");
  assert.equal(h1, h2, "same cue returns the SAME handle (idempotent)");
  assert.equal(rec.played.filter((p) => p.cue === "processing").length, 1);
  ui.stopLoop("processing");
  assert.equal(rec.stops, 1, "loop stopped once");
  ui.stopLoop("processing");
  assert.equal(rec.stops, 1, "second stop is a no-op");
});

test("stopAllLoops stops every retained loop and clears handles", () => {
  resetModule();
  ui.unlockUiSfx();
  ui.startLoop("loading");
  ui.startLoop("recording");
  ui.stopAllLoops();
  assert.equal(rec.stops, 2);
  ui.startLoop("loading");
  assert.equal(rec.played.filter((p) => p.cue === "loading").length, 2);
});

test("setEnabled(false) stops active loops and calls stopAll (immediate mute)", () => {
  resetModule();
  ui.unlockUiSfx();
  ui.startLoop("scanning");
  ui.startLoop("connecting");
  ui.setEnabled(false);
  assert.equal(rec.stops, 2, "all loops stopped");
  assert.equal(rec.stopAll, 1, "ui.stopAll called on mute");
  assert.equal(rec.enabled, false);
});

// ── 4. Keabadian mute ───────────────────────────────────────────────────────
test("mute preference persists in localStorage and is read back", () => {
  resetModule();
  ui.setEnabled(false);
  const raw = store.getItem(ui.SOUND_PREF_KEY);
  assert.ok(raw, "preference written");
  assert.equal(JSON.parse(raw as string).enabled, false);
  assert.equal(ui.readSoundPrefs().enabled, false);
  assert.equal(ui.isSoundEnabled(), false);
});

test("volume is clamped and persisted", () => {
  resetModule();
  ui.setVolume(1.7);
  assert.equal(ui.readSoundPrefs().volume, 1);
  ui.setVolume(-3);
  assert.equal(ui.readSoundPrefs().volume, 0);
});

// ── 5. Gating kekunci & pointer ─────────────────────────────────────────────
test("playCue suppresses async cues before unlock (no stale feedback)", () => {
  resetModule();
  const r = ui.playCue("success");
  assert.equal(r, null);
  assert.equal(rec.played.length, 0, "no sound before unlock");
});

test("press() is forced synchronously inside a gesture", () => {
  resetModule();
  ui.press();
  assert.equal(rec.played.length, 1);
  assert.equal(rec.played[0].cue, "press");
});

test("disabled player suppresses all cues", () => {
  resetModule();
  ui.unlockUiSfx();
  ui.setEnabled(false);
  assert.equal(ui.playCue("success"), null);
  assert.equal(ui.press(), null);
});

// ── 6. Keselamatan SSR ──────────────────────────────────────────────────────
test("SSR: no player is built when window is undefined", () => {
  const saved = g.window;
  delete g.window;
  try {
    const r = ui.playCue("success", { force: true });
    assert.equal(r, null, "no cue plays during SSR");
  } finally {
    g.window = saved;
  }
});

// ── 7. Teardown/remount ─────────────────────────────────────────────────────
test("destroy stops loops and disposes the player (remount-safe)", async () => {
  resetModule();
  ui.unlockUiSfx();
  ui.startLoop("loading");
  await ui.destroy();
  assert.equal(rec.stops, 1, "loop stopped on teardown");
  assert.equal(rec.destroyed, 1, "player destroyed once");
});

test("no duplicate players across repeated ensurePlayer calls (singleton)", () => {
  resetModule();
  let built = 0;
  ui.__setPlayerFactoryForTests(((prefs: any) => {
    built++;
    return makeFakePlayer(prefs);
  }) as any);
  ui.unlockUiSfx();
  ui.unlockUiSfx();
  ui.playCue("success");
  ui.playCue("reward");
  assert.equal(built, 1, "player created exactly once");
});

// ── 8. Pakej dipilih ────────────────────────────────────────────────────────
test("selected pack is 'minimal'", () => {
  assert.equal(ui.PACK_NAME, "minimal");
});
