// @ts-nocheck
// ============================================================================
// SoundToggle.tsx — Kawalan keutamaan bunyi yang boleh diakses.
// ----------------------------------------------------------------------------
// Label jelas + role="switch" + aria-checked. Bunyi HANYA mengukuhkan maksud:
// paparan teks/ikon & ARIA kekal sebagai isyarat utama. Keutamaan disimpan
// dalam sistem keutamaan produk (localStorage, kunci `bunyiKata:uisfx`) melalui
// uiSfx. Mematikan serta-merta menghentikan gelung & semua bunyi.
// ============================================================================
import React from "react";
import { readSoundPrefs, setEnabled, toggle as playToggle } from "../utils/uiSfx";

interface SoundToggleProps {
  /** Gaya tambahan untuk butang (pilihan). */
  className?: string;
  style?: React.CSSProperties;
}

export default function SoundToggle({ className = "", style }: SoundToggleProps) {
  const [enabled, setLocalEnabled] = React.useState<boolean>(() => readSoundPrefs().enabled);

  // Selaraskan jika keutamaan berubah di tempat lain (cth. tab lain).
  React.useEffect(() => {
    const sync = () => setLocalEnabled(readSoundPrefs().enabled);
    window.addEventListener("storage", sync);
    window.addEventListener("bk-sound-pref-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bk-sound-pref-change", sync);
    };
  }, []);

  const flip = () => {
    const next = !enabled;
    setLocalEnabled(next);
    setEnabled(next); // ui.setEnabled + simpan + stopAll bila dimatikan
    window.dispatchEvent(new CustomEvent("bk-sound-pref-change", { detail: { enabled: next } }));
    // Cue dari keadaan BAHARU (bukan teka-teki).
    playToggle(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={"Bunyi antara muka: " + (enabled ? "hidup" : "mati")}
      title={enabled ? "Matikan bunyi" : "Hidupkan bunyi"}
      className={"neo-btn " + className}
      style={{
        justifyContent: "flex-start",
        fontSize: "1.1rem",
        padding: "12px",
        gap: "10px",
        backgroundColor: enabled ? "#168f81" : "#94a3b8",
        color: "white",
        ...style,
      }}
      onClick={flip}
    >
      <i
        className={"fa-solid " + (enabled ? "fa-volume-high" : "fa-volume-xmark")}
        style={{ width: "30px" }}
        aria-hidden="true"
      ></i>
      <span style={{ flex: 1, textAlign: "left" }}>Bunyi {enabled ? "HIDUP" : "MATI"}</span>
      <i
        className={"fa-solid " + (enabled ? "fa-toggle-on" : "fa-toggle-off")}
        style={{ fontSize: "1.25rem" }}
        aria-hidden="true"
      ></i>
    </button>
  );
}
