// @ts-nocheck
import React from "react";

/**
 * Halaman pendaratan awam (public landing page) untuk bunyi-kata.my.
 *
 * v3 — Konten diselaraskan dengan data SEBENAR projek:
 * - Pembelajaran utama: 4 peta (Kenal Huruf, Suku Kata Asas, Suku Kata Hero,
 *   Bacaan Bergred) — sama seperti MAP_CHALLENGES.
 * - Maklumat ikut mod: Guru / Ibu Bapa / Affiliate.
 * - Pakej sebenar: Bulanan Pro RM15, 3 Bulanan Pro RM40, Tahunan Pro RM69
 *   (semua pakej berbayar sama cirinya — beza hanya tempoh).
 * - Seksyen Pakej guna reka bentuk 100% SAMA seperti popup PricingProModal:
 *   tab Guru / Ibu Bapa, kad `.pro-pakej-card`, animasi glow/shine, timer promosi.
 * - Butang "Daftar" hantar TERUS ke WhatsApp admin (mesejDaftarPakej) — tiada popup.
 * - Butang "Log Masuk" buka popup (kod + pilih mod); "Cuba Percuma" ke skrin log masuk.
 * - Top nav hanya scroll dalam halaman ini (anchor) — tiada tukar skrin.
 */

interface LandingScreenProps {
  getScreenClass: (screenId: string, extraClasses?: string) => string;
  onCubaPercuma?: () => void;
  onLogMasuk?: () => void;
  onOpenPakej?: (tab?: "guru" | "ibubapa") => void;
  /** Kad pakej landing: hantar terus ke WhatsApp admin (tiada popup). */
  onDaftarPakej?: (category: "guru" | "ibubapa", namaPakej: string) => void;
  /** Kad pakej Affiliate landing: hantar terus ke WhatsApp admin (tiada popup). */
  onDaftarAffiliate?: () => void;
}

// Logo hero mesti sama animasi seperti skrin log masuk (kelas .glitch-logo).
const LOGO_GLITCH = "/images/sampingan/logo-login-screen.png";
const LOGO = "/images/sampingan/logo-login-screen.png";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconGamepad = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="17.5" cy="10" r="1" fill="currentColor" stroke="none"/>
    <rect x="2" y="6" width="20" height="12" rx="4"/>
  </svg>
);

const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
    <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M6 5v4a6 6 0 0 0 12 0V5H6z"/>
    <path d="M12 15v4"/><path d="M8 19h8"/>
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",width:"1em",height:"1em",verticalAlign:"-0.1em"}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"1.1em",height:"1.1em",flexShrink:0}}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",width:"1em",height:"1em",verticalAlign:"-0.1em"}}>
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",width:"1.1em",height:"1.1em",verticalAlign:"-0.15em"}}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);

const IconCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const IconPuzzle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.569-1.568c-.23-.23-.556-.338-.878-.29-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02.049-.322-.059-.648-.289-.878L4.61 10.86a2.404 2.404 0 0 1 0-3.408l1.568-1.568c.23-.23.338-.556.29-.878-.074-.493-.504-.84-.968-1.02a2.5 2.5 0 0 1 3.237-3.237c.18.464.527.894 1.02.967.322.049.648-.059.878-.289l1.567-1.566a2.404 2.404 0 0 1 3.408 0l1.611 1.611c.221.221.537.338.857.31z"/>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconLetters = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const IconSchool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5z"/>
    <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/>
  </svg>
);

const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.6" y1="10.6" x2="15.4" y2="6.4"/>
    <line x1="8.6" y1="13.4" x2="15.4" y2="17.6"/>
  </svg>
);

/* ── Ikon tab pakej (guru / ibu bapa / affiliate) — inline SVG ──
   Seksyen Pakej landing mesti guna ikon SVG yang SAMA gaya seperti baki
   halaman ini (IconWhatsapp, IconCheck, …) dan BUKAN kelas Font Awesome
   `<i class="fa-solid …">`. Sebab: FA dimuatkan secara non-blocking melalui
   CDN (preload + onload), jadi pada muat pertama ikon fa-* muncul sebagai
   kotak kosong / tidak kelihatan. Inline SVG sentiasa terpapar serta-merta. */
const IconChalkboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.05em", height: "1.05em", flexShrink: 0, display: "inline-block", verticalAlign: "-0.15em" }}>
    <path d="M2 3h20v14H2z" />
    <path d="M12 17v4" />
    <path d="M8 21h8" />
    <path d="M7 7h10" />
    <path d="M7 11h6" />
  </svg>
);

const IconUsersSolid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.05em", height: "1.05em", flexShrink: 0, display: "inline-block", verticalAlign: "-0.15em" }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconHandshake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.05em", height: "1.05em", flexShrink: 0, display: "inline-block", verticalAlign: "-0.15em" }}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
);

const IconHourglass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: "0.72rem", height: "0.72rem", flexShrink: 0, display: "inline-block" }}>
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </svg>
);

const IconCircleCheck = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em", flexShrink: 0, display: "inline-block", ...style }}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/* WhatsApp — inline SVG supaya TIDAK bergantung pada CDN Font Awesome.
   (fa-brands memerlukan fa-brands-400.woff2 yang lambat turun → muncul
   kotak kosong/error pada paparan pertama.) */
const IconWhatsapp = ({ size = "1.05em", style }: { size?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
       style={{ width: size, height: size, flexShrink: 0, display: "inline-block", verticalAlign: "-0.12em", ...style }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/>
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"1.1em",height:"1.1em"}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconTelegram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"1.15em",height:"1.15em"}}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const IconAppStore = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"1.2em",height:"1.2em"}}>
    <path d="M17.05 12.536c-.026-2.61 2.13-3.863 2.227-3.924-1.214-1.776-3.104-2.02-3.777-2.048-1.608-.163-3.138.947-3.955.947-.813 0-2.07-.923-3.402-.898-1.75.026-3.363 1.017-4.264 2.585-1.818 3.15-.464 7.812 1.306 10.368.866 1.25 1.9 2.653 3.257 2.603 1.308-.052 1.802-.845 3.383-.845 1.581 0 2.024.845 3.406.819 1.407-.026 2.297-1.272 3.158-2.528.994-1.453 1.403-2.86 1.428-2.933-.031-.014-2.74-1.052-2.767-4.146zM14.462 4.99c.72-.874 1.206-2.088 1.074-3.297-1.038.042-2.295.692-3.04 1.564-.667.771-1.252 2.006-1.095 3.19 1.157.09 2.34-.588 3.061-1.457z"/>
  </svg>
);

const IconPlayStore = () => (
  <svg viewBox="0 0 24 24" style={{ width: "1.25em", height: "1.25em", display: "block" }}>
    <path d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z" fill="#4285F4"/>
    <path d="m13.544 10.989 3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z" fill="#34A853"/>
    <path d="m13.544 13.056-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" fill="#EA4335"/>
    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z" fill="#FBBC04"/>
  </svg>
);

const IconSparkles = () => (
  <svg viewBox="0 0 24 24" fill="#0f2e29" style={{ width: "24px", height: "24px", display: "block" }} aria-hidden="true">
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2zM19 15l1.2 3.3L23.5 19.5l-3.3 1.2L19 24l-1.2-3.3L14.5 19.5l3.3-1.2L19 15zM4 2l1 2.5L7.5 5.5 5 6.5 4 9 3 6.5 0.5 5.5 3 4.5 4 2z"/>
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px", display: "block", margin: "auto" }} aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.15em", height: "1.15em", display: "inline-block", verticalAlign: "-0.15em" }} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

/* Avatar tersuai yang moden & menarik untuk testimoni — lukisan SVG sendiri,
   tanpa menggunakan aset watak projek. */
const AvatarAisyah = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#d1fae5" />
    <path d="M12 60c2-12 10-18 20-18s18 6 20 18" fill="#10b981" />
    {/* Hijab / Tudung moden */}
    <path d="M32 12c-9 0-16 7-16 17 0 11 4 19 16 21 12-2 16-10 16-21 0-10-7-17-16-17z" fill="#047857" />
    {/* Muka */}
    <ellipse cx="32" cy="31" rx="9" ry="11" fill="#fed7aa" />
    <path d="M26 23c2-2 10-2 12 0" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
    {/* Mata senyum */}
    <path d="M27 30c1 1 3 1 4 0" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    <path d="M33 30c1 1 3 1 4 0" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    {/* Pipi kemerahan */}
    <circle cx="26" cy="34" r="2.2" fill="#fca5a5" opacity="0.65" />
    <circle cx="38" cy="34" r="2.2" fill="#fca5a5" opacity="0.65" />
    {/* Senyuman manis */}
    <path d="M29.5 35.5c1.5 1.5 3.5 1.5 5 0" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const AvatarFarah = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#dbeafe" />
    <path d="M12 60c2-12 10-18 20-18s18 6 20 18" fill="#3b82f6" />
    {/* Rambut disanggul kemas */}
    <circle cx="32" cy="15" r="7" fill="#374151" />
    <path d="M20 28c0-8 5-14 12-14s12 6 12 14c0 3-1 6-2 8H22c-1-2-2-5-2-8z" fill="#374151" />
    {/* Muka */}
    <ellipse cx="32" cy="32" rx="9.5" ry="11.5" fill="#fde68a" />
    {/* Cermin mata moden bergaya */}
    <rect x="23" y="27" width="7.5" height="6" rx="2.5" stroke="#1e3a8a" strokeWidth="1.8" fill="#eff6ff" fillOpacity="0.4" />
    <rect x="33.5" y="27" width="7.5" height="6" rx="2.5" stroke="#1e3a8a" strokeWidth="1.8" fill="#eff6ff" fillOpacity="0.4" />
    <line x1="30.5" y1="30" x2="33.5" y2="30" stroke="#1e3a8a" strokeWidth="1.8" />
    {/* Mata ceria */}
    <circle cx="26.8" cy="30" r="1.2" fill="#1e3a8a" />
    <circle cx="37.2" cy="30" r="1.2" fill="#1e3a8a" />
    {/* Senyuman mesra pendidik */}
    <path d="M29 36.5c1.8 2 4.2 2 6 0" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" />
    {/* Pipi */}
    <circle cx="25" cy="35" r="2" fill="#fca5a5" opacity="0.6" />
    <circle cx="39" cy="35" r="2" fill="#fca5a5" opacity="0.6" />
  </svg>
);

const AvatarDanial = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#fef3c7" />
    <path d="M12 60c2-12 10-18 20-18s18 6 20 18" fill="#f59e0b" />
    {/* Kolar kemeja */}
    <path d="M28 42l4 6 4-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Muka */}
    <ellipse cx="32" cy="31" rx="9.5" ry="11.5" fill="#fed7aa" />
    {/* Rambut kemas moden */}
    <path d="M22 25c1-7 5-11 10-11s10 3 11 8c-3-2-7-3-11-2-4 1-8 3-10 5z" fill="#1f2937" />
    <path d="M21 27c0-2 1-4 2-5" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
    {/* Kening & Mata */}
    <path d="M25 25c1.5-1 3.5-1 5 0" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M34 25c1.5-1 3.5-1 5 0" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="27.5" cy="28.5" r="1.4" fill="#1f2937" />
    <circle cx="36.5" cy="28.5" r="1.4" fill="#1f2937" />
    {/* Senyuman bapa prihatin */}
    <path d="M28.5 35.5c2 2.5 5 2.5 7 0" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const ciri = [
  {
    Icon: IconMap,
    warna: "#10b981",
    img: "/images/sampingan/peta-cabaran-huruf.png",
    tajuk: "4 Peta Pembelajaran",
    huraian: "Kenal Huruf, Suku Kata Asas, Suku Kata Hero dan Bacaan Bergred. Bertahap ikut kemampuan anak.",
  },
  {
    Icon: IconGamepad,
    warna: "#f59e0b",
    img: "/images/menu-kad/menu%20asas%20bunyi%20kata/teka%20gambar%20rahsia.png",
    tajuk: "80+ Aktiviti & Permainan",
    huraian: "Kad imbasan, cantum kata, tanduk kata, puzzle suku kata, fonik ABC dan banyak lagi.",
  },
  {
    Icon: IconMic,
    warna: "#3b82f6",
    img: "/images/menu/fonik%20abc.png",
    tajuk: "Sebutan & Audio Betul",
    huraian: "Audio sebutan standard Bahasa Melayu bantu anak sebut suku kata dengan jelas.",
  },
  {
    Icon: IconTrophy,
    warna: "#8b5cf6",
    img: "/images/lencana/lencana-kapten-harta-karun.png",
    tajuk: "Lencana & Ganjaran",
    huraian: "Kumpul bintang, naik peta dan buka 5 lencana rasmi. Anak tak sabar nak belajar lagi.",
  },
];

const stats = [
  { angka: 4, label: "Peta Pembelajaran", suffix: "", Icon: IconMap },
  { angka: 80, label: "Aktiviti & Permainan", suffix: "+", Icon: IconGamepad },
  { angka: 5, label: "Lencana Pencapaian", suffix: "", Icon: IconStar },
];

// Pembelajaran utama — 4 peta SEBENAR projek (MAP_CHALLENGES).
const petaUtama = [
  {
    Icon: IconLetters,
    warna: "#90b562",
    img: "/images/sampingan/peta-misi-huruf.png",
    nama: "Kenal Huruf",
    desc: "Huruf A-Z, vokal dan konsonan, fonik ABC, asas nombor.",
  },
  {
    Icon: IconBook,
    warna: "#c1a472",
    img: "/images/sampingan/peta-misi-suku-kata-asas.png",
    nama: "Suku Kata Asas",
    desc: "KV, KV+KV, V+KV, KVK dan gabungan suku kata asas.",
  },
  {
    Icon: IconTrophy,
    warna: "#ff751f",
    img: "/images/sampingan/peta-misi-suku-kata-hero.png",
    nama: "Suku Kata Hero",
    desc: "KV+KVK, KVK+KV, KVKK. Perkataan lebih mencabar.",
  },
  {
    Icon: IconStar,
    warna: "#ec4899",
    img: "/images/sampingan/peta-misi-bacaan-bergred.png",
    nama: "Bacaan Bergred",
    desc: "Ayat pendek dan panjang, petikan tahap 1-2, cerita pendek.",
  },
];

// Mini permainan & aktiviti SEBENAR projek (gambar sebenar dari folder menu).
const KAD = "/images/menu-kad/menu%20asas%20bunyi%20kata/";
const aktivitiSwip: { nama: string; img: string; warna: string }[] = [
  { nama: "Kenali Huruf", img: "/images/menu/kenali%20huruf.png", warna: "#10b981" },
  { nama: "Fonik ABC", img: "/images/menu/fonik%20abc.png", warna: "#ec4899" },
  { nama: "Vokal & Konsonan", img: "/images/menu/vokal%20%26%20konsonan.png", warna: "#8b5cf6" },
  { nama: "Dengar Bunyi Huruf", img: KAD + "dengar%20bunyi%20huruf.png", warna: "#3b82f6" },
  { nama: "Cari Bunyi", img: KAD + "cari%20bunyi.png", warna: "#0ea5e9" },
  { nama: "Pasangan", img: KAD + "pasangan.png", warna: "#14b8a6" },
  { nama: "Teka Gambar Rahsia", img: KAD + "teka%20gambar%20rahsia.png", warna: "#ef4444" },
  { nama: "Kenali Tambah", img: KAD + "kenali%20tambah.png", warna: "#f59e0b" },
  { nama: "Kenali Tolak", img: KAD + "kenali%20tolak.png", warna: "#ea580c" },
  { nama: "Kira & Jawab", img: KAD + "kira%20dan%20jawab.png", warna: "#22c55e" },
  { nama: "Susun Persamaan Tambah", img: KAD + "susun%20persamaan%20tambah.png", warna: "#a855f7" },
  { nama: "Cabaran Pantas", img: KAD + "cabaran%20pantas.png", warna: "#6366f1" },
];

// Maklumat ikut mod — supaya pembeli tahu apa yang diperoleh setiap mod.
// Setiap mod ada gambar background dashboard sebenar dari folder preview.
const mods = [
  {
    Icon: IconSchool,
    warna: "#ea580c",
    img: "/images/preview/preview-dashboard-guru.png",
    tag: "GURU",
    nama: "Mod Guru",
    desc: "Untuk kelas Prasekolah & Pemulihan.",
    senarai: [
      "Kod Kelas unik murid sertai",
      "Sehingga 2 kelas serentak (Pro)",
      "Laporan & statistik murid",
    ],
  },
  {
    Icon: IconUsers,
    warna: "#2563eb",
    img: "/images/preview/preview-dashboard-ibubapa.png",
    tag: "IBU BAPA",
    nama: "Mod Ibu Bapa",
    desc: "Pantau anak belajar di rumah.",
    senarai: [
      "Kod Keluarga khas anak",
      "Sehingga 3 profil anak (Pro)",
      "Laporan & sijil pencapaian",
    ],
  },
  {
    Icon: IconShare,
    warna: "#7c3aed",
    img: "/images/preview/preview-dashboard-affiliate.png",
    tag: "AFFILIATE",
    nama: "Mod Affiliate",
    desc: "Jana komisen promosi Bunyi Kata.",
    senarai: [
      "Pautan rujukan unik anda",
      "Papan pemuka komisen pantas",
      "Pantau jualan sekali pandang",
    ],
  },
];

// Lencana dalam swiper 3D — gambar SAHAJA (tanpa syarat) + teaser hadiah.
const lencanaSwip = [
  { nama: "Lencana Penjelajah Alfabet", img: "/images/lencana/lencana-penjelajah-alfabet.png", warna: "#90b562" },
  { nama: "Lencana Pemburu Suku Kata", img: "/images/lencana/lencana-pemburu-suku-kata.png", warna: "#c1a472" },
  { nama: "Lencana Wira Pulau", img: "/images/lencana/lencana-wira-pulau.png", warna: "#ff751f" },
  { nama: "Lencana Naib Raja Bacaan", img: "/images/lencana/lencana-naib-raja-bacaan.png", warna: "#ec4899" },
  { nama: "Lencana Kapten Harta Karun", img: "/images/lencana/lencana-kapten-harta-karun.png", warna: "#8b5cf6" },
];

// App preview — guna aset SEBENAR dari folder preview/rupa-dalam-aplikasi.
const appPreviews = [
  {
    img: "/images/preview/rupa-dalam-aplikasi/misi-asas-bunyi-kata.png",
    label: "Misi Asas Bunyi Kata",
    desc: "Kenali nombor, huruf, vokal, dan asas bunyi kata",
    warna: "#90b562",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/misi-suku-kata-asas.png",
    label: "Misi Suku Kata Asas",
    desc: "KV, KV+KV, V+KV, KVK",
    warna: "#c1a472",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/misi-suku-kata-hero.png",
    label: "Misi Suku Kata Hero",
    desc: "Galeri 3D Bunyi Kata & persekitaran interaktif",
    warna: "#ff751f",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/misi-bacaan-bergred.png",
    label: "Misi Bacaan Bergred",
    desc: "Petikan tahap 1-2, ayat, dan cerita pendek",
    warna: "#ec4899",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/cuba-sebut.png",
    label: "Cuba Sebut",
    desc: "Pengecaman suara dan sebutan perkataan interaktif",
    warna: "#0ea5e9",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/kad-imbasan.png",
    label: "Kad Imbasan",
    desc: "Kad imbasan cantum perkataan visual & audio",
    warna: "#8b5cf6",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/tanduk-kata.png",
    label: "Tanduk Kata",
    desc: "Permainan aksi arked kembara perkataan",
    warna: "#ea580c",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/puzzle.png",
    label: "Puzzle",
    desc: "Cantuman gambar & susun suku kata",
    warna: "#14b8a6",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/rak-buku.png",
    label: "Rak Buku",
    desc: "Perpustakaan digital cerita kanak-kanak",
    warna: "#3b82f6",
  },
  {
    img: "/images/preview/rupa-dalam-aplikasi/pencapian.png",
    label: "Pencapaian",
    desc: "Ganjaran bintang dan animasi kejayaan",
    warna: "#f59e0b",
  },
];

// Senarai kad sebelah kanan untuk paparan laptop — kekalkan senarai asal seperti permintaan pengguna
const appPreviewFeatures = [
  { label: "Misi Kenal Huruf", warna: "#90b562" },
  { label: "Misi Suku Kata Asas", warna: "#c1a472" },
  { label: "Misi Suku Kata Hero", warna: "#ff751f" },
  { label: "Misi Bacaan Bergred", warna: "#ec4899" },
  { label: "Fonik ABC", warna: "#3b82f6" },
];

const testimoni = [
  {
    nama: "Puan Aisyah",
    peranan: "Ibu kepada Hana, 5 tahun",
    teks: "Anak saya dulu tak kenal huruf. Lepas seminggu main Bunyi Kata, dia dah boleh baca suku kata sendiri!",
    warna: "#10b981",
    avatar: "aisyah",
  },
  {
    nama: "Cikgu Farah",
    peranan: "Guru Prasekolah",
    teks: "Sangat membantu dalam kelas. Murid lebih fokus dan tak sabar tunggu sesi fonik setiap hari.",
    warna: "#3b82f6",
    avatar: "farah",
  },
  {
    nama: "Encik Danial",
    peranan: "Bapa kepada Adam, 6 tahun",
    teks: "Seronok sebab belajar macam main game. Adam tak perasan pun dia sedang belajar membaca.",
    warna: "#f59e0b",
    avatar: "danial",
  },
];

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

// ─── Scroll Reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".landing-reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* Animasi "scale up popup" pada setiap seksyen bila di-scroll (atas atau
   bawah) — sama seperti bila popup dibuka dalam aplikasi. */
function useSectionPopup() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".landing-section-pop");
    if (!els.length) return;
    if (typeof window !== "undefined" && window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
          else entry.target.classList.remove("in-view");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Stat item ────────────────────────────────────────────────────────────────
function StatItem({ angka, label, suffix, Icon }: { angka: number; label: string; suffix: string; Icon: any }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const count = useCountUp(angka, 1800, active);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-stat-item landing-reveal" ref={ref}>
      <div className="landing-stat-icon">
        <Icon />
      </div>
      <div className="landing-stat-angka">
        {count.toLocaleString("ms-MY")}{suffix}
      </div>
      <div className="landing-stat-label">{label}</div>
    </div>
  );
}

// ─── Preview Carousel ─────────────────────────────────────────────────────────
/* ─── Swipe3D — satu enjin 3D swipe boleh guna semula untuk SEMUA carousel
   landing (lencana, aktiviti, peta, pratonton). Kad sisi dimiringkan dengan
   rotateY + translateZ, kad aktif di tengah dengan glow/reflection. ─── */
type Swipe3DProps<T> = {
  items: T[];
  renderCard: (item: T, isActive: boolean) => React.ReactNode;
  keyOf: (item: T, i: number) => string;
  labelOf: (item: T, i: number) => string;
  accentOf?: (item: T) => string;
  variant?: "badge" | "media";
  autoplay?: number;
  hideArrows?: boolean;
};

function Swipe3D<T>({ items, renderCard, keyOf, labelOf, accentOf, variant = "media", autoplay = 0, hideArrows = false }: Swipe3DProps<T>) {
  const total = items.length;
  const [aktif, setAktif] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef<number | null>(null);
  const [lebar, setLebar] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const onResize = () => setLebar(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    if (!autoplay) return;
    if (typeof window !== "undefined" && window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Auto-swipe berjalan berterusan (macam rupa dalam aplikasi). Berhenti
    // seketika semasa pengguna drag supaya tak bergaduh dengan jari.
    const id = setInterval(() => {
      if (dragStartX.current !== null) return;
      setAktif((p) => (p + 1) % total);
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const isMobile = lebar < 560;
  const isLaptop = lebar >= 1100;
  // Laptop: kad lebih rapat supaya ada 4 kad sisi (2 kiri + 2 kanan).
  const stepX = isMobile ? 74 : isLaptop ? 148 : 118;
  // Bilangan kad sisi yang dirender — laptop 4 bayang, lain 2.
  const maxOff = isLaptop ? 3.4 : 2.4;

  const goto = (i: number) => setAktif(((i % total) + total) % total);
  const handleNext = () => goto(aktif + 1);
  const handlePrev = () => goto(aktif - 1);

  const handlePointerStart = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
  };
  const handlePointerMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    setDragOffset(clientX - dragStartX.current);
  };
  const handlePointerEnd = (clientX?: number) => {
    if (dragStartX.current === null) return;
    const finalOffset =
      clientX !== undefined ? clientX - dragStartX.current : dragOffset;
    if (finalOffset < -35) handleNext();
    else if (finalOffset > 35) handlePrev();
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const offsetOf = (idx: number) => {
    let diff = idx - aktif;
    while (diff < -total / 2) diff += total;
    while (diff > total / 2) diff -= total;
    return diff;
  };

  const dragFraction = isDragging
    ? Math.max(-1.2, Math.min(1.2, dragOffset / stepX))
    : 0;

  // Saiz kad SERAGAM untuk semua carousel (lencana, aktiviti, peta, pratonton)
  // supaya reka bentuk swipe sama di seluruh landing page.
  const stageH = isMobile ? "200px" : isLaptop ? "312px" : "236px";
  const cardW = isMobile ? "150px" : isLaptop ? "280px" : "210px";
  const cardH = isMobile ? "190px" : isLaptop ? "272px" : "224px";
  // Kedudukan anak panah: beri jarak selesa dari tepi kad (bukan rapat).
  // Jarak anak panah dari tepi kad: dinaikkan sedikit supaya anak panah tidak
  // rapat dengan kad (mini permainan & lencana) — tetapi masih dalam julat
  // selesa, bukan terlalu jauh.
  const arrowInset = `max(0px, calc(50% - ${parseInt(cardW, 10) / 2 + (isMobile ? 46 : 68)}px))`;
  return (
    <div style={{ width: "100%", margin: "0 auto", position: "relative", userSelect: "none" }}>
      <div
        className="landing-swipe3d-stage"
        onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
        onTouchMove={(e) => isDragging && handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={(e) => handlePointerEnd(e.changedTouches[0].clientX)}
        onTouchCancel={() => handlePointerEnd()}
        onMouseDown={(e) => handlePointerStart(e.clientX)}
        onMouseMove={(e) => isDragging && handlePointerMove(e.clientX)}
        onMouseUp={(e) => handlePointerEnd(e.clientX)}
        onMouseLeave={() => isDragging && handlePointerEnd()}
        style={{
          position: "relative",
          height: stageH,
          width: "100%",
          perspective: "1000px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "6px 0 14px" : "16px 0 26px",
          // Beri ruang sisi supaya bayang/glow kad swipe tidak terpotong.
          padding: isMobile ? "0 8px" : "0 16px",
          boxSizing: "border-box",
          touchAction: "pan-y",
          overflow: "visible",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {!hideArrows && (
        <button
          type="button"
          aria-label="Sebelum"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="landing-lencana-arrow"
          style={{ left: arrowInset }}
        >
          {"\u2039"}
        </button>
        )}
        <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
          {items.map((it, idx) => {
            const off = offsetOf(idx);
            const absOff = Math.abs(off - dragFraction);
            if (absOff > maxOff) return null;
            const translateX = (off - dragFraction) * stepX;
            const scale = Math.max(0.48, 1 - absOff * 0.18);
            const rotateY = -off * 32 + dragFraction * 10;
            const z = -absOff * 130;
            const opacity = Math.max(0.1, 1 - absOff * 0.34);
            const isActive = idx === aktif;
            const accent = accentOf ? accentOf(it) : "#0e9f6e";
            const halfW = parseInt(cardW, 10) / 2;
            const halfH = parseInt(cardH, 10) / 2;

            return (
              <div
                key={keyOf(it, idx)}
                onClick={() => { if (Math.abs(dragOffset) < 8) goto(idx); }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: cardW,
                  height: cardH,
                  marginLeft: -halfW,
                  marginTop: -halfH,
                  transform: `translateX(${translateX}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transition: isDragging ? "none" : "transform 0.4s cubic-bezier(.22,.61,.36,1), opacity 0.4s ease",
                  opacity,
                  zIndex: 100 - Math.round(absOff * 10),
                  pointerEvents: absOff < 1.6 ? "auto" : "none",
                  cursor: isActive ? "default" : "pointer",
                  transformStyle: "preserve-3d",
                }}
              >
                {isActive && (
                  <span className="landing-swipe3d-glow" style={{ background: accent }} aria-hidden="true" />
                )}
                <div
                  className={`landing-swipe3d-card ${isActive ? "is-active" : ""}`}
                  style={{
                    borderColor: accent,
                    boxShadow: isActive
                      ? `0 8px 0 ${accent}, 0 16px 26px rgba(15,46,41,.28)`
                      : `0 4px 0 rgba(15,46,41,.18)`,
                  }}
                >
                  {renderCard(it, isActive)}
                </div>
              </div>
            );
          })}
        </div>
        {!hideArrows && (
        <button
          type="button"
          aria-label="Seterusnya"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="landing-lencana-arrow"
          style={{ right: arrowInset }}
        >
          {"\u203A"}
        </button>
        )}
      </div>

      <div className="landing-lencana-dots">
        {items.map((it, i) => (
          <button
            key={keyOf(it, i)}
            type="button"
            aria-label={labelOf(it, i)}
            className={`landing-lencana-dot ${i === aktif ? "aktif" : ""}`}
            style={i === aktif && accentOf ? { background: accentOf(it) } : undefined}
            onClick={() => goto(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingScreen({
  getScreenClass,
  onCubaPercuma,
  onLogMasuk,
  onOpenPakej,
  onDaftarPakej,
  onDaftarAffiliate,
}: LandingScreenProps) {
  const [faqBuka, setFaqBuka] = React.useState<number | null>(null);
  const [isShortcutOpen, setIsShortcutOpen] = React.useState(false);
  // Tab jenis pakej pada kad landing (sama seperti popup Pakej Pro).
  const [activePakejCategory, setActivePakejCategory] = React.useState<
    "guru" | "ibubapa" | "affiliate"
  >("guru");
  // Timer promosi (sama seperti popup Pakej Pro).
  const [promoSecondsLeft, setPromoSecondsLeft] = React.useState<number>(() => {
    if (typeof window === "undefined") return 86400;
    const saved = localStorage.getItem("bunyiKataPromoTimerExpiry");
    const now = Date.now();
    if (saved) {
      const remaining = Math.floor((parseInt(saved, 10) - now) / 1000);
      if (remaining > 0 && remaining <= 86400) return remaining;
    }
    const newExpiry = now + 24 * 60 * 60 * 1000;
    localStorage.setItem("bunyiKataPromoTimerExpiry", newExpiry.toString());
    return 86400;
  });
  React.useEffect(() => {
    const timer = setInterval(() => {
      setPromoSecondsLeft((prev) => {
        if (prev <= 1) {
          const newExpiry = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem("bunyiKataPromoTimerExpiry", newExpiry.toString());
          return 86400;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatPromoTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}j ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };
  useScrollReveal();
  useSectionPopup();

  /* Skrol SMOOTH dalam bekas landing SAHAJA (bukan tukar skrin).
     #landing-screen ialah bekas skrol sendiri (position:fixed + overflow:auto),
     jadi kita skrol bekas itu + tolak tinggi nav sticky supaya tajuk tak tersorok. */
  const pageScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const host = document.getElementById("landing-screen");
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector(".landing-nav") as HTMLElement | null;
    const offset = (nav ? nav.offsetHeight : 0) + 12;
    if (host && host.contains(el)) {
      const top = el.getBoundingClientRect().top - host.getBoundingClientRect().top + host.scrollTop - offset;
      host.scrollTo({ top, behavior: "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    try { history.replaceState(null, "", "#" + id); } catch (_) { console.warn("[Landing] Gagal kemas kini hash URL:", _); }
  };

  const handleShortcutClick = (id: string) => (e: React.MouseEvent) => {
    pageScrollTo(id)(e);
    setIsShortcutOpen(false);
  };


  const faq = [
    {
      s: "Adakah Bunyi Kata percuma?",
      j: "Ya. Mod percuma membolehkan anak mula belajar Kenal Huruf dan bermain aktiviti terpilih tanpa bayaran. Untuk membuka semua 4 peta, laporan dan sijil, boleh naik taraf ke pakej Pro (RM15/bulan, RM40/3 bulan atau RM69/tahun).",
    },
    {
      s: "Perlu daftar akaun ke?",
      j: "Tidak perlu untuk mula. Tekan 'Cuba Percuma' dan anak boleh terus bermain. Akaun (Guru atau Ibu Bapa) hanya perlu untuk menyimpan kemajuan, memantau murid/anak dan akses laporan.",
    },
    {
      s: "Apakah peta pembelajaran yang ada?",
      j: "Terdapat 4 peta utama: Kenal Huruf, Suku Kata Asas, Suku Kata Hero dan Bacaan Bergred. Disusun bertahap daripada mengenal huruf sehingga membaca petikan dan cerita pendek.",
    },
    {
      s: "Apakah perbezaan Pakej Guru dan Pakej Ibu Bapa?",
      j: "Pakej Guru sesuai untuk kelas: sehingga 2 kelas serentak dengan 2 Kod Kelas unik, pantauan statistik serta muat turun laporan dan sijil murid. Pakej Ibu Bapa sesuai untuk di rumah: sehingga 3 profil anak dengan satu Kod Keluarga khas, laporan prestasi serta sijil setiap anak.",
    },
    {
      s: "Boleh guna pada telefon, tablet dan komputer?",
      j: "Boleh. Bunyi Kata berfungsi pada telefon, tablet dan komputer melalui penyemak imbas moden. Tiada pemasangan rumit diperlukan — asalkan ada sambungan internet.",
    },
    {
      s: "Adakah ada lencana dan ganjaran?",
      j: "Ada. Anak boleh kumpul bintang, naik peta dan membuka 5 lencana rasmi. Pencapaian ini memberi motivasi supaya anak tak sabar nak belajar lagi.",
    },
  ];

  return (
    <div id="landing-screen" className={getScreenClass("landing-screen")}>
      <div className="landing-root">

        {/* ===== NAV ===== */}
        <header className="landing-nav">
          <div className="landing-nav-inner">
            <div className="landing-brand">
              <img src={LOGO} alt="Bunyi Kata" className="landing-brand-logo" />
            </div>
            <nav className="landing-nav-links">
              <a href="#ciri" onClick={pageScrollTo("ciri")}>Ciri</a>
              <a href="#peta" className="landing-nav-desktop-only" onClick={pageScrollTo("peta")}>Pembelajaran</a>
              <a href="#pakej" onClick={pageScrollTo("pakej")}>Pakej</a>
              <a href="#mod" onClick={pageScrollTo("mod")}>Mod</a>
              <a href="#faq" className="landing-nav-desktop-only" onClick={pageScrollTo("faq")}>FAQ</a>
            </nav>
            <div className="landing-nav-actions">
              <button className="landing-btn landing-btn-primary" onClick={onLogMasuk}>
                Log Masuk
              </button>
            </div>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <div className="landing-hero-text">
              <span className="landing-badge landing-badge-anim">
                <svg viewBox="0 0 20 20" fill="currentColor" style={{width:"1em",height:"1em",display:"inline",marginRight:"6px",verticalAlign:"-0.1em"}}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69z"/>
                </svg>
                Belajar Membaca Jadi Seronok
              </span>
              <h1 className="landing-hero-title">
                <span className="landing-hero-line" style={{ animationDelay: "0.05s" }}>
                  <span className="landing-ht-word">Anak</span>{" "}
                  <span className="landing-ht-word">Pandai</span>{" "}
                  <span className="landing-ht-word landing-hl">Membaca</span>
                </span>
                <span className="landing-hero-line" style={{ animationDelay: "0.35s" }}>
                  <span className="landing-ht-word">Melalui</span>{" "}
                  <span className="landing-ht-word landing-ht-last">Permainan</span>
                </span>
              </h1>
              <p className="landing-hero-sub">
                Aplikasi mengenal huruf dan suku kata yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas. Bunyi Kata terbahagi kepada dua bahagian utama iaitu Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan membawa kepada keseronokan dalam pembelajaran.
              </p>
              <div className="landing-hero-cta">
                <button
                  className="landing-btn landing-btn-primary landing-btn-lg"
                  data-no-bubble="true"
                  onClick={onCubaPercuma}
                >
                  <IconRocket /> Cuba Percuma
                </button>
                <button
                  className="landing-btn landing-btn-outline landing-btn-lg"
                  data-no-bubble="true"
                  onClick={onLogMasuk}
                >
                  Log Masuk
                </button>
              </div>
            </div>

            <div className="landing-hero-art">
              <img
                src={LOGO_GLITCH}
                alt="Bunyi Kata"
                className="glitch-logo landing-hero-logo"
              />
            </div>
          </div>
        </section>

        {/* ===== STATS STRIP ===== */}
        <section className="landing-stats-strip">
          <div className="landing-stats-inner">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </section>

        {/* ===== CIRI ===== */}
        <section className="landing-section landing-section-pop" id="ciri">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Kenapa Bunyi Kata?</span>
            <h2 className="landing-h2">Semua Yang Anak Perlukan Untuk Baca</h2>
            <p className="landing-section-sub">
              Aktiviti yang direka oleh pendidik, disusun dalam permainan yang anak suka.
            </p>
          </div>
          <div className="landing-grid landing-grid-ciri">
            {ciri.map((c, i) => (
              <div
                className="landing-card landing-card-img landing-reveal"
                key={c.tajuk}
                style={{ animationDelay: `${i * 80}ms`, borderColor: c.warna }}
              >
                <img className="landing-card-img-bg" src={c.img} alt={c.tajuk} loading="lazy" />
                <div className="landing-card-img-overlay" />
                <div className="landing-card-img-text">
                  <span className="landing-card-img-pill" style={{ backgroundColor: c.warna }}>
                    <c.Icon />
                  </span>
                  <h3>{c.tajuk}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PEMBELAJARAN UTAMA (4 PETA) ===== */}
        <section className="landing-section landing-section-alt landing-section-pop" id="peta">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Pembelajaran Utama</span>
            <h2 className="landing-h2">4 Peta, 1 Perjalanan Membaca</h2>
            <p className="landing-section-sub">
              Anak belajar ikut tahap, dari mengenal huruf hinggalah membaca cerita pendek.
            </p>
          </div>
          <div className="landing-grid landing-grid-peta">
            {petaUtama.map((p, i) => (
              <div
                className="landing-card landing-card-img landing-reveal"
                key={p.nama}
                style={{ animationDelay: `${i * 80}ms`, borderColor: p.warna }}
              >
                <img className="landing-card-img-bg" src={p.img} alt={p.nama} loading="lazy" />
                <div className="landing-card-img-overlay" />
                <span className="landing-card-img-no" style={{ backgroundColor: p.warna }}>{i + 1}</span>
                <div className="landing-card-img-text">
                  <span className="landing-card-img-pill" style={{ backgroundColor: p.warna }}>
                    <p.Icon />
                  </span>
                  <h3>{p.nama}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== APP PREVIEW ===== */}
        <section className="landing-section landing-section-alt landing-section-pop" id="preview">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Tengok Sendiri</span>
            <h2 className="landing-h2">Rupa Dalam Aplikasi</h2>
            <p className="landing-section-sub">
              Peta, mini permainan sampai lencana — semua ada tempatnya dalam aplikasi.
            </p>
          </div>
          <div className="landing-preview-layout">
            <div className="landing-reveal landing-reveal-left" style={{flex:"1 1 300px"}}>
              <Swipe3D
                items={appPreviews}
                variant="media"
                autoplay={3600}
                hideArrows
                keyOf={(it) => it.label}
                labelOf={(it) => it.label}
                accentOf={(it) => it.warna}
                renderCard={(it) => (
                  <div className="landing-swipe3d-media">
                    <img src={it.img} alt={it.label} loading="lazy" draggable={false} />
                    <div className="landing-swipe3d-media-bar" style={{ backgroundColor: it.warna }}>
                      {it.label}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="landing-preview-feature-list landing-reveal landing-reveal-right" style={{flex:"1 1 300px"}}>
              {appPreviewFeatures.map((item, i) => (
                <div className="landing-preview-feature-item" key={item.label} style={{"--delay": `${i * 60}ms`} as React.CSSProperties}>
                  <div className="landing-preview-feature-dot" style={{ backgroundColor: item.warna }} />
                  <div>
                    <strong>{item.label}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PERMAINAN / AKTIVITI ===== */}
        <section className="landing-section landing-section-pop" id="cabaran">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Mini Permainan</span>
            <h2 className="landing-h2">80+ Aktiviti & Permainan</h2>
            <p className="landing-section-sub">
              Belajar sambil bermain — setiap aktiviti menumpu satu kemahiran membaca yang penting.
            </p>
          </div>
          <Swipe3D
            items={aktivitiSwip}
            variant="media"
            autoplay={3000}
            keyOf={(it) => it.nama}
            labelOf={(it) => `Pergi ke ${it.nama}`}
            accentOf={(it) => it.warna}
            renderCard={(it) => (
              <div className="landing-swipe3d-media">
                <img src={it.img} alt={it.nama} loading="lazy" draggable={false} />
                <span className="landing-swipe3d-chip" style={{ backgroundColor: it.warna }}>
                  <IconGamepad />
                </span>
                <div className="landing-swipe3d-media-bar" style={{ backgroundColor: it.warna }}>
                  {it.nama}
                </div>
              </div>
            )}
          />
        </section>

        {/* ===== LENCANA / HADIAH ===== */}
        <section className="landing-section landing-section-alt landing-section-pop" id="lencana">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Senang Je</span>
            <h2 className="landing-h2">Kumpul Lencana, Raih Hadiah</h2>
            <p className="landing-section-sub">
              Bagi yang berjaya kumpul lencana bakal peroleh hadiah yang menarik.
            </p>
          </div>
          <Swipe3D
            items={lencanaSwip}
            variant="media"
            autoplay={3200}
            keyOf={(it) => it.nama}
            labelOf={(it) => it.nama}
            accentOf={(it) => it.warna}
            renderCard={(it, isActive) => (
              <div className="landing-swipe3d-media">
                <img src={it.img} alt={it.nama} loading="lazy" draggable={false} />
                {isActive && (
                  <span className="landing-swipe3d-chip" style={{ backgroundColor: it.warna }}>
                    <IconTrophy />
                  </span>
                )}
                <div className="landing-swipe3d-media-bar" style={{ backgroundColor: it.warna }}>
                  {it.nama}
                </div>
              </div>
            )}
          />
        </section>

        {/* ===== TESTIMONI ===== */}
        <section className="landing-section landing-section-pop">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Kata Ibu Bapa &amp; Guru</span>
            <h2 className="landing-h2">Mereka Dah Nampak Bezanya</h2>
          </div>
          <div className="landing-testi-wrap">
            <div className="landing-testi-track">
              {[...testimoni, ...testimoni].map((t, i) => (
                <div
                  className="landing-card landing-card-testimoni"
                  key={`${t.nama}-${i}`}
                  style={{ "--testi": t.warna } as React.CSSProperties}
                >
                  <div className="landing-testi-top">
                    <span className="landing-testi-quote" aria-hidden="true">&#8220;</span>
                    <div className="landing-star-row">
                      {[...Array(5)].map((_, si) => (
                        <span key={si} style={{ color: "#f59e0b", fontSize: "1.05rem" }}>
                          <IconStar />
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="landing-testimoni-teks">{t.teks}</p>
                  <div className="landing-testimoni-orang">
                    <span className="landing-testi-avatar" aria-hidden="true">
                      {t.avatar === "farah" ? <AvatarFarah /> : t.avatar === "danial" ? <AvatarDanial /> : <AvatarAisyah />}
                    </span>
                    <div className="landing-testi-ident">
                      <strong>{t.nama}</strong>
                      <span>{t.peranan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MAKLUMAT IKUT MOD ===== */}
        <section className="landing-section landing-section-pop" id="mod">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Maklumat Ikut Mod</span>
            <h2 className="landing-h2">Guru, Ibu Bapa atau Affiliate?</h2>
            <p className="landing-section-sub">
              Setiap mod ada kod akses dan ciri tersendiri. Ini yang anda akan dapat.
            </p>
          </div>
          <div className="landing-grid landing-grid-mod">
            {mods.map((m, i) => (
              <div
                className="landing-card landing-card-img landing-reveal"
                key={m.nama}
                style={{ animationDelay: `${i * 80}ms`, borderColor: m.warna }}
              >
                <img className="landing-card-img-bg" src={m.img} alt={m.nama} loading="lazy" />
                <div className="landing-card-img-overlay landing-mod-overlay" />
                <span className="landing-mod-tag-img" style={{ backgroundColor: m.warna }}>
                  {m.tag}
                </span>
                <div className="landing-card-img-text landing-mod-info">
                  <span className="landing-card-img-pill" style={{ backgroundColor: m.warna }}>
                    <m.Icon />
                  </span>
                  <div className="landing-mod-info-txt">
                    <h3>{m.nama}</h3>
                    <p className="landing-mod-desc">{m.desc}</p>
                  </div>
                </div>
                <ul className="landing-mod-senarai">
                  {m.senarai.map((s, si) => (
                    <li key={si}><IconCheck /> {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PAKEJ (gaya 100% sama seperti popup Pakej Pro) ===== */}
        <section className="landing-section landing-section-alt landing-section-pop" id="pakej">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Pakej</span>
            <h2 className="landing-h2">Pilih Yang Sesuai Untuk Anda</h2>
            <p className="landing-section-sub">
              Pilih pakej mengikut keperluan anda. Semua pakej berbayar sama cirinya — beza hanya tempoh. Tekan “Daftar” untuk terus berhubung dengan admin melalui WhatsApp.
            </p>
          </div>

          <div className="landing-pakej-wrap landing-reveal">
            {/* Tab jenis pakej: Guru / Ibu Bapa / Affiliate — ciri kad bertukar ikut tab */}
            <div className="landing-pakej-tabs">
              <button
                className={`neo-btn pakej-tab-btn ${activePakejCategory === "guru" ? "bg-orange" : "bg-white"}`}
                style={{
                  flex: 1,
                  maxWidth: "200px",
                  padding: "9px 14px",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  color: activePakejCategory === "guru" ? "white" : "var(--color-dark)",
                  border: "2.5px solid var(--color-dark)",
                }}
                onClick={() => setActivePakejCategory("guru")}
              >
                <IconChalkboard /> Pakej Guru
              </button>
              <button
                className={`neo-btn pakej-tab-btn ${activePakejCategory === "ibubapa" ? "bg-blue" : "bg-white"}`}
                style={{
                  flex: 1,
                  maxWidth: "200px",
                  padding: "9px 14px",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  color: activePakejCategory === "ibubapa" ? "white" : "var(--color-dark)",
                  border: "2.5px solid var(--color-dark)",
                }}
                onClick={() => setActivePakejCategory("ibubapa")}
              >
                <IconUsersSolid /> Pakej Ibu Bapa
              </button>
              <button
                className={`neo-btn pakej-tab-btn ${activePakejCategory === "affiliate" ? "bg-purple" : "bg-white"}`}
                style={{
                  flex: 1,
                  maxWidth: "200px",
                  padding: "9px 14px",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  color: activePakejCategory === "affiliate" ? "white" : "var(--color-dark)",
                  border: "2.5px solid var(--color-dark)",
                }}
                onClick={() => setActivePakejCategory("affiliate")}
              >
                <IconHandshake /> Pakej Affiliate
              </button>
            </div>

            {/* Grid kad pakej — guna kelas pro-pakej-card (sama seperti popup) */}
            <div
              className="pakej-grid-container"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
                gap: "14px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              {activePakejCategory !== "affiliate" && (
                <>
              {/* Kad 1: Bulanan Pro */}
              <div className="pro-pakej-card">
                <div className="pro-pakej-card-inner" style={{ padding: "16px 14px" }}>
                  <div className="shine-sweep-overlay"></div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: "#ea580c",
                          color: "#ffffff",
                          fontSize: "0.72rem",
                          fontWeight: "900",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          border: "1.5px solid var(--color-dark)",
                          boxShadow: "1px 1px 0 var(--color-dark)",
                        }}
                      >
                        {activePakejCategory === "guru" ? "2 KELAS" : "3 PROFIL ANAK"}
                      </div>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", margin: "0 0 4px 0", color: "var(--color-dark)", fontWeight: "bold" }}>
                      Bulanan Pro
                    </h3>

                    {/* Harga asal (strike) & lencana diskaun */}
                    <div className="original-price-box" style={{ marginBottom: "4px" }}>
                      <span className="original-price-strike">RM99</span>
                      <span className="discount-tag-badge">-85% OFF</span>
                    </div>

                    {/* Animasi masa sahaja */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
                        border: "1.5px solid #f43f5e",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        margin: "4px 0 8px 0",
                        boxShadow: "0 1.5px 0 var(--color-dark)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "#e11d48",
                          color: "white",
                          fontSize: "0.68rem",
                          animation: "timerIconSpin 3s linear infinite",
                          flexShrink: 0,
                        }}
                      >
                        <IconHourglass />
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: "900", color: "#e11d48", letterSpacing: "0.6px", fontFamily: "monospace" }}>
                        {formatPromoTimer(promoSecondsLeft)}
                      </span>
                    </div>

                    <div className="price-tag" style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f766e", marginBottom: "10px", letterSpacing: "-0.5px" }}>
                      RM15{" "}
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "bold" }}>/ bulan</span>
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                        fontSize: "0.83rem",
                        color: "#334155",
                        lineHeight: "1.35",
                      }}
                    >
                      {activePakejCategory === "guru" ? (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>2 Kelas Serentak</b> (Sehingga 80 murid)</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>2 Kod Kelas</b> Unik</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Muat Turun Laporan &amp; Sijil (2 Kelas)</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Sehingga 3 Profil Anak</b> Serentak</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Kod Keluarga Khas</b> untuk 3 Anak</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Laporan Prestasi &amp; Sijil Setiap Anak</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <button
                    className={`neo-btn ${activePakejCategory === "guru" ? "bg-orange btn-daftar-glow-orange" : "bg-blue btn-daftar-glow-blue"}`}
                    style={{
                      width: "100%",
                      marginTop: "14px",
                      padding: "9px",
                      fontSize: "0.98rem",
                      color: "white",
                      fontWeight: "bold",
                      justifyContent: "center",
                    }}
                    onClick={() => onDaftarPakej && onDaftarPakej(activePakejCategory, "Bulanan Biasa")}
                  >
                    <IconWhatsapp style={{ marginRight: "8px" }} />Daftar
                  </button>
                </div>
              </div>

              {/* Kad 2: 3 Bulanan Pro */}
              <div className="pro-pakej-card">
                <div className="pro-pakej-card-inner" style={{ padding: "16px 14px" }}>
                  <div className="shine-sweep-overlay"></div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: "#0284c7",
                          color: "#ffffff",
                          fontSize: "0.72rem",
                          fontWeight: "900",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          border: "1.5px solid var(--color-dark)",
                          boxShadow: "1px 1px 0 var(--color-dark)",
                        }}
                      >
                        {activePakejCategory === "guru" ? "2 KELAS" : "3 PROFIL ANAK"}
                      </div>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", margin: "0 0 4px 0", color: "var(--color-dark)", fontWeight: "bold" }}>
                      3 Bulanan Pro
                    </h3>

                    <div className="original-price-box" style={{ marginBottom: "4px" }}>
                      <span className="original-price-strike">RM150</span>
                      <span className="discount-tag-badge">-73% OFF</span>
                    </div>

                    <div className="price-tag" style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f766e", marginBottom: "10px", letterSpacing: "-0.5px" }}>
                      RM40{" "}
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "bold" }}>/ 3 bulan</span>
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                        fontSize: "0.83rem",
                        color: "#334155",
                        lineHeight: "1.35",
                      }}
                    >
                      {activePakejCategory === "guru" ? (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>2 Kelas Serentak</b> (Akses 90 Hari)</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>2 Kod Kelas</b> Unik</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Muat Turun Laporan &amp; Sijil (2 Kelas)</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Sehingga 3 Profil Anak</b> (Akses 90 Hari)</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Kod Keluarga Khas</b> untuk 3 Anak</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Laporan Prestasi &amp; Sijil Setiap Anak</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <button
                    className={`neo-btn ${activePakejCategory === "guru" ? "bg-orange btn-daftar-glow-orange" : "bg-blue btn-daftar-glow-blue"}`}
                    style={{
                      width: "100%",
                      marginTop: "14px",
                      padding: "9px",
                      fontSize: "0.98rem",
                      color: "white",
                      fontWeight: "bold",
                      justifyContent: "center",
                    }}
                    onClick={() => onDaftarPakej && onDaftarPakej(activePakejCategory, "3 Bulan")}
                  >
                    <IconWhatsapp style={{ marginRight: "8px" }} />Daftar
                  </button>
                </div>
              </div>
              {/* Kad 3: Tahunan Pro */}
              <div className="pro-pakej-card">
                <div className="pro-pakej-card-inner" style={{ padding: "16px 14px" }}>
                  <div className="shine-sweep-overlay"></div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: "#dc2626",
                          color: "#ffffff",
                          fontSize: "0.72rem",
                          fontWeight: "900",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          border: "1.5px solid var(--color-dark)",
                          boxShadow: "1px 1px 0 var(--color-dark)",
                        }}
                      >
                        PAKEJ TAHUNAN
                      </div>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", margin: "0 0 4px 0", color: "var(--color-dark)", fontWeight: "bold" }}>
                      Tahunan Pro
                    </h3>

                    <div className="original-price-box" style={{ marginBottom: "4px" }}>
                      <span className="original-price-strike">RM199</span>
                      <span className="discount-tag-badge">-65% OFF</span>
                    </div>

                    <div className="price-tag" style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f766e", marginBottom: "10px", letterSpacing: "-0.5px" }}>
                      RM69{" "}
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "bold" }}>/ tahun</span>
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                        fontSize: "0.83rem",
                        color: "#334155",
                        lineHeight: "1.35",
                      }}
                    >
                      {activePakejCategory === "guru" ? (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>2 Kelas</b> Akses 365 Hari</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Laporan &amp; Sijil Tanpa Had</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Sokongan Keutamaan Pentadbir</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Sehingga 3 Profil Anak</b> (365 Hari)</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span>Laporan &amp; Sijil Lengkap Tanpa Had</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                            <IconCircleCheck style={{ color: "#10b981", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                            <span><b>Penjimatan Maksimum</b> (RM5.75/bln)</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <button
                    className={`neo-btn ${activePakejCategory === "guru" ? "bg-orange btn-daftar-glow-orange" : "bg-blue btn-daftar-glow-blue"}`}
                    style={{
                      width: "100%",
                      marginTop: "14px",
                      padding: "9px",
                      fontSize: "0.98rem",
                      color: "white",
                      fontWeight: "bold",
                      justifyContent: "center",
                    }}
                    onClick={() => onDaftarPakej && onDaftarPakej(activePakejCategory, "1 Tahun")}
                  >
                    <IconWhatsapp style={{ marginRight: "8px" }} />Daftar
                  </button>
                </div>
              </div>
                </>
              )}

              {/* Kad Affiliate: RM5 (tema ungu) — tiada bulanan/tahunan, terus ke admin */}
              {activePakejCategory === "affiliate" && (
                <div className="pro-pakej-card kad-affiliate">
                  <div className="pro-pakej-card-inner" style={{ padding: "16px 14px" }}>
                    <div className="shine-sweep-overlay"></div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor: "#7c3aed",
                            color: "#ffffff",
                            fontSize: "0.72rem",
                            fontWeight: "900",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            border: "1.5px solid var(--color-dark)",
                            boxShadow: "1px 1px 0 var(--color-dark)",
                          }}
                        >
                          RM5 SAHAJA
                        </div>
                      </div>
                      <h3 style={{ fontSize: "1.15rem", margin: "0 0 4px 0", color: "var(--color-dark)", fontWeight: "bold" }}>
                        Pakej Affiliate
                      </h3>

                      <div className="price-tag" style={{ fontSize: "1.6rem", fontWeight: "900", color: "#7c3aed", marginBottom: "10px", letterSpacing: "-0.5px" }}>
                        RM5{" "}
                        <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "bold" }}>/ sekali sahaja</span>
                      </div>

                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "7px",
                          fontSize: "0.83rem",
                          color: "#334155",
                          lineHeight: "1.35",
                        }}
                      >
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                          <IconCircleCheck style={{ color: "#7c3aed", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                          <span><b>Kod Rujukan Unik</b> Sendiri</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                          <IconCircleCheck style={{ color: "#7c3aed", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                          <span><b>Komisen</b> Setiap Rujukan Berjaya</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                          <IconCircleCheck style={{ color: "#7c3aed", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                          <span><b>Papan Pemuka</b> Pantau Rujukan &amp; Komisen</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                          <IconCircleCheck style={{ color: "#7c3aed", marginTop: "2px", width: "1.05em", height: "1.05em" }} />
                          <span>Bayaran Komisen <b>Telus &amp; Terus</b></span>
                        </li>
                      </ul>
                    </div>

                    <button
                      className="neo-btn bg-purple btn-daftar-glow-purple"
                      style={{
                        width: "100%",
                        marginTop: "14px",
                        padding: "9px",
                        fontSize: "0.98rem",
                        color: "white",
                        fontWeight: "bold",
                        justifyContent: "center",
                      }}
                      onClick={() => onDaftarAffiliate && onDaftarAffiliate()}
                    >
                      <IconWhatsapp style={{ marginRight: "8px" }} />Daftar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="landing-section landing-section-alt landing-section-pop" id="faq">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Soalan Lazim</span>
            <h2 className="landing-h2">Ada Persoalan?</h2>
            <p className="landing-section-sub">
              Jawapan ringkas kepada soalan yang ibu bapa dan guru selalu tanya.
            </p>
          </div>
          <div className="landing-faq">
            {faq.map((f, i) => (
              <div
                className={`landing-faq-item ${faqBuka === i ? "buka" : ""}`}
                key={f.s}
              >
                <button
                  className="landing-faq-soalan"
                  aria-expanded={faqBuka === i}
                  onClick={() => setFaqBuka(faqBuka === i ? null : i)}
                >
                  <span className="landing-faq-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="landing-faq-q">{f.s}</span>
                  <span className={`landing-faq-arrow ${faqBuka === i ? "buka" : ""}`}>
                    <IconChevron />
                  </span>
                </button>
                <div
                  className={`landing-faq-jawapan${faqBuka === i ? " buka" : ""}`}
                  aria-hidden={faqBuka !== i}
                >
                  <div className="landing-faq-jawapan-inner">{f.j}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA PENUTUP ===== */}
        <section className="landing-cta-banner">
          <div className="landing-cta-inner">
            <div className="landing-cta-card">
              <div className="landing-cta-trust">
                <div className="landing-cta-avatars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <img key={n} src={`/images/avatar/avatar${n}.png`} alt={`Watak ${n}`} className="landing-cta-avatar" />
                  ))}
                </div>
                <span className="landing-cta-trust-text">
                  Disukai oleh ibu bapa &amp; guru di seluruh Malaysia
                </span>
              </div>
              <button
                className="landing-btn landing-btn-cta-gold landing-btn-lg"
                onClick={pageScrollTo("pakej")}
              >
                <IconRocket /> Lihat Pakej
              </button>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <img src={LOGO_GLITCH} alt="Bunyi Kata" className="landing-footer-logo" />
              <p>
                Belajar membaca jadi seronok. <span className="landing-footer-brand-line">Dibina untuk anak Malaysia.</span>
              </p>
            </div>
            <div className="landing-footer-col">
              <h4>Produk</h4>
              <a href="#ciri" onClick={pageScrollTo("ciri")}>Ciri</a>
              <a href="#peta" onClick={pageScrollTo("peta")}>Pembelajaran</a>
              <a href="#preview" onClick={pageScrollTo("preview")}>Pratonton</a>
            </div>
            <div className="landing-footer-col">
              <h4>Pakej</h4>
              <a href="#mod" onClick={pageScrollTo("mod")}>Mod</a>
              <a href="#pakej" onClick={pageScrollTo("pakej")}>Harga Pakej</a>
              <a href="#faq" onClick={pageScrollTo("faq")}>Soalan Lazim</a>
            </div>
            <div className="landing-footer-col">
              <h4>Ikuti Kami</h4>
              <div className="landing-footer-social">
                <button
                  type="button"
                  className="landing-social-btn landing-social-web"
                  title="Laman Web Rasmi"
                  aria-label="Laman Web Rasmi"
                  onClick={() => window.open("https://bunyikata.my", "_blank", "noopener")}
                >
                  <IconGlobe />
                </button>
                <button
                  type="button"
                  className="landing-social-btn landing-social-telegram"
                  title="Telegram"
                  aria-label="Telegram"
                  onClick={() => window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank", "noopener")}
                >
                  <IconTelegram />
                </button>
                <button
                  type="button"
                  className="landing-social-btn landing-social-play"
                  title="Google Play Store"
                  aria-label="Google Play Store"
                  onClick={() => window.open("https://play.google.com/store/apps/details?id=com.bunyikatabacaan", "_blank", "noopener")}
                >
                  <IconPlayStore />
                </button>
                <button
                  type="button"
                  className="landing-social-btn landing-social-apple"
                  title="Apple App Store"
                  aria-label="Apple App Store"
                  onClick={() => window.open("https://apps.apple.com/my/app/bunyi-kata/id6739794132", "_blank", "noopener")}
                >
                  <IconAppStore />
                </button>
              </div>
            </div>
          </div>
          <div className="landing-footer-bottom">
            © {new Date().getFullYear()} Bunyi Kata · bunyikata.my · Hak cipta terpelihara.
          </div>
        </footer>

        {/* ===== BUTANG TOGGLE & KOMPONEN SHORTCUT LANDING (MOBILE VIEW) ===== */}
        <div id="landing-mobile-dial-container" className={isShortcutOpen ? "open" : ""}>
          {isShortcutOpen && (
            <div className="landing-shortcut-backdrop" onClick={() => setIsShortcutOpen(false)} />
          )}
          <div className="landing-shortcut-options" role="menu" aria-label="Navigasi Pantas">
            <div className="landing-shortcut-header">
              <IconCompass />
              <span>Menu Pantas</span>
            </div>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("ciri")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#10b981" }}><IconMap /></span>
              <span>Ciri-ciri</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("peta")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#3b82f6" }}><IconBook /></span>
              <span>4 Peta Belajar</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("preview")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#06b6d4" }}><IconTarget /></span>
              <span>Pratonton App</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("cabaran")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#f59e0b" }}><IconGamepad /></span>
              <span>Permainan</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("lencana")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#8b5cf6" }}><IconTrophy /></span>
              <span>Lencana</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("mod")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#ea580c" }}><IconSchool /></span>
              <span>Pilihan Mod</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("pakej")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#ec4899" }}><IconCard /></span>
              <span>Pakej Harga</span>
            </button>
            <button
              type="button"
              className="neo-btn landing-shortcut-btn"
              onClick={handleShortcutClick("faq")}
            >
              <span className="landing-shortcut-btn-icon" style={{ backgroundColor: "#64748b" }}><IconPuzzle /></span>
              <span>Soalan Lazim</span>
            </button>
          </div>

          <button
            id="landing-mobile-floating-cta"
            className="neo-btn bg-yellow"
            onClick={() => setIsShortcutOpen(!isShortcutOpen)}
            aria-label="Pintas Landing Page"
            title="Menu Navigasi Pantas"
          >
            {isShortcutOpen ? <IconClose /> : <IconSparkles />}
          </button>
        </div>

      </div>
    </div>
  );
}
