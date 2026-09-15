// @ts-nocheck
import React from "react";

/**
 * Halaman pendaratan awam (public landing page) untuk bunyi-kata.my.
 *
 * v2 Ã¢â‚¬â€ Redesign penuh:
 * - SVG inline icons (tiada emoji, tiada Font Awesome)
 * - Scroll-reveal animation (IntersectionObserver)
 * - Stats strip dengan count-up
 * - App Preview gallery guna aset sebenar dari projek
 * - Identiti neo-brutalism (hijau/emas, sempadan tebal, bayang keras) dikekalkan
 */

interface LandingScreenProps {
  getScreenClass: (screenId: string, extraClasses?: string) => string;
  onCubaPercuma?: () => void;
  onLogMasuk?: () => void;
  onOpenPakej?: (tab?: "guru" | "ibubapa") => void;
}

const LOGO = "/images/sampingan/logo-login-screen.png";

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ SVG Icons Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Data Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const ciri = [
  {
    Icon: IconBook,
    warna: "#10b981",
    tajuk: "Belajar Fonik Step-by-Step",
    huraian: "Huruf vokal, konsonan, suku kata KV hingga bacaan penuh Ã¢â‚¬â€ disusun mengikut tahap usia anak.",
  },
  {
    Icon: IconGamepad,
    warna: "#f59e0b",
    tajuk: "12+ Mini Permainan",
    huraian: "Tanduk Kata, Cantum Kata, Suku Kata Puzzle dan banyak lagi Ã¢â‚¬â€ belajar jadi seronok.",
  },
  {
    Icon: IconMic,
    warna: "#3b82f6",
    tajuk: "Sebutan & Suara",
    huraian: "Kad imbasan bersuara membantu anak sebut perkataan dengan jelas dan yakin.",
  },
  {
    Icon: IconTrophy,
    warna: "#8b5cf6",
    tajuk: "Lencana & Ganjaran",
    huraian: "Kumpul bintang, naik peta dan buka lencana baru Ã¢â‚¬â€ anak tak sabar nak belajar lagi.",
  },
];

const stats = [
  { angka: 5000, label: "Murid Aktif", suffix: "+", Icon: IconUsers },
  { angka: 12, label: "Mini Permainan", suffix: "+", Icon: IconGamepad },
  { angka: 50000, label: "Bintang Dikumpul", suffix: "+", Icon: IconStar },
];

const cabaran = [
  { Icon: IconCard, nama: "Kad Imbasan", warna: "#10b981" },
  { Icon: IconPuzzle, nama: "Cantum Kata", warna: "#f59e0b" },
  { Icon: IconTarget, nama: "Tanduk Kata", warna: "#ef4444" },
  { Icon: IconBook, nama: "Suku Kata Puzzle", warna: "#8b5cf6" },
  { Icon: IconMic, nama: "Cuba Sebut", warna: "#3b82f6" },
  { Icon: IconLetters, nama: "Fonik ABC", warna: "#ec4899" },
];

const langkah = [
  {
    no: "1",
    tajuk: "Tekan Cuba Percuma",
    huraian: "Tak perlu daftar. Terus mula belajar dalam beberapa saat.",
  },
  {
    no: "2",
    tajuk: "Pilih Watak Kesukaan",
    huraian: "Anak pilih watak pengembara dan mula jelajah peta belajar.",
  },
  {
    no: "3",
    tajuk: "Kumpul Bintang",
    huraian: "Selesaikan aktiviti, kumpul bintang dan buka lencana.",
  },
];

// App preview Ã¢â‚¬â€ guna aset sebenar dari projek
const appPreviews = [
  {
    img: "/images/sampingan/peta-cabaran-suku-kata-asas.png",
    label: "Peta Cabaran",
    desc: "Jelajah pulau pembelajaran bertahap",
    warna: "#10b981",
  },
  {
    img: "/images/menu/kv+kv.png",
    label: "Belajar Suku Kata",
    desc: "Kad interaktif dengan panduan visual",
    warna: "#f59e0b",
  },
  {
    img: "/images/menu/fonik abc.png",
    label: "Fonik ABC",
    desc: "Sebutan huruf dengan bunyi sebenar",
    warna: "#3b82f6",
  },
  {
    img: "/images/lencana/lencana-naib-raja-bacaan.png",
    label: "Lencana Pencapaian",
    desc: "Koleksi ganjaran untuk motivasi anak",
    warna: "#8b5cf6",
  },
  {
    img: "/images/sampingan/peta-cabaran-bacaan-bergred.png",
    label: "Peta Bacaan Bergred",
    desc: "Ayat pendek hingga petikan penuh",
    warna: "#ef4444",
  },
];

const testimoni = [
  {
    nama: "Puan Aisyah",
    peranan: "Ibu kepada Hana, 5 tahun",
    teks: "Anak saya dulu tak kenal huruf. Lepas seminggu main Bunyi Kata, dia dah boleh baca suku kata sendiri!",
  },
  {
    nama: "Cikgu Farah",
    peranan: "Guru Prasekolah",
    teks: "Sangat membantu dalam kelas. Murid lebih fokus dan tak sabar tunggu sesi fonik setiap hari.",
  },
  {
    nama: "Encik Danial",
    peranan: "Bapa kepada Adam, 6 tahun",
    teks: "Seronok sebab belajar macam main game. Adam tak perasan pun dia sedang belajar membaca.",
  },
];

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Count-up hook Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Scroll Reveal hook Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Stat item Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Preview Carousel Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function AppPreviewCarousel({ items }: { items: typeof appPreviews }) {
  const [aktif, setAktif] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setAktif((p) => (p + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="landing-preview-carousel">
      <div className="landing-preview-main">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`landing-preview-slide ${i === aktif ? "aktif" : ""}`}
          >
            <div className="landing-preview-frame" style={{ borderColor: item.warna, boxShadow: `8px 8px 0 ${item.warna}` }}>
              <div className="landing-preview-label-top" style={{ backgroundColor: item.warna }}>
                {item.label}
              </div>
              <img src={item.img} alt={item.label} className="landing-preview-img" />
              <div className="landing-preview-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="landing-preview-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`landing-preview-dot ${i === aktif ? "aktif" : ""}`}
            onClick={() => setAktif(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main Component Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function LandingScreen({
  getScreenClass,
  onCubaPercuma,
  onLogMasuk,
  onOpenPakej,
}: LandingScreenProps) {
  const [faqBuka, setFaqBuka] = React.useState<number | null>(null);
  useScrollReveal();

  const faq = [
    {
      s: "Adakah Bunyi Kata percuma?",
      j: "Ya! Versi percuma membolehkan anak mula belajar fonik dan bermain permainan terpilih tanpa sebarang bayaran. Untuk ciri penuh seperti semua peta, watak dan laporan kemajuan, boleh naik taraf ke Versi Pro bila-bila masa.",
    },
    {
      s: "Berapa umur yang sesuai?",
      j: "Sesuai untuk kanak-kanak 3 hingga 8 tahun Ã¢â‚¬â€ dari mula mengenal huruf sehingga boleh membaca perkataan penuh.",
    },
    {
      s: "Perlu daftar akaun ke?",
      j: "Tidak perlu. Tekan 'Cuba Percuma' dan anak boleh terus bermain. Akaun hanya perlu jika anda guru atau ibu bapa yang mahu menyimpan kemajuan berbilang anak.",
    },
    {
      s: "Boleh guna di telefon?",
      j: "Boleh. Bunyi Kata berfungsi pada telefon, tablet dan komputer Ã¢â‚¬â€ sesuai untuk belajar di mana-mana sahaja.",
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
              <a href="#ciri">Ciri</a>
              <a href="#preview">Pratonton</a>
              <a href="#pakej">Pakej</a>
              <a href="#faq">FAQ</a>
            </nav>
            <div className="landing-nav-actions">
              <button className="landing-btn landing-btn-ghost" onClick={onLogMasuk}>
                Log Masuk
              </button>
              <button className="landing-btn landing-btn-primary" onClick={onCubaPercuma}>
                Cuba Percuma
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
                Anak Pandai <span className="landing-hl">Membaca</span><br/>Melalui Permainan
              </h1>
              <p className="landing-hero-sub">
                Bunyi Kata menggabungkan fonik bersuara, mini permainan dan ganjaran lencana untuk membantu anak anda mengenal huruf dan membaca Ã¢â‚¬â€ tanpa rasa tertekan.
              </p>
              <div className="landing-hero-cta">
                <button
                  className="landing-btn landing-btn-primary landing-btn-lg"
                  onClick={onCubaPercuma}
                >
                  <IconRocket /> Cuba Percuma Sekarang
                </button>
                <button
                  className="landing-btn landing-btn-outline landing-btn-lg"
                  onClick={onLogMasuk}
                >
                  Log Masuk
                </button>
              </div>
              <p className="landing-hero-note">
                <IconCheck /> Tak perlu daftar &nbsp;Ã¢â‚¬Â¢&nbsp;
                <IconPhone /> Guna di telefon &amp; tablet
              </p>
            </div>

            <div className="landing-hero-art">
              <div className="landing-hero-card">
                <img src={LOGO} alt="Bunyi Kata" className="landing-hero-art-logo" />
                <div className="landing-hero-floats">
                  {/* Float 1: Huruf A */}
                  <span className="landing-float landing-float-1">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <rect width="40" height="40" rx="10" fill="#ffd93d" stroke="#0f2e29" strokeWidth="3"/>
                      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="900" fill="#0f2e29" fontFamily="Poppins,sans-serif">A</text>
                    </svg>
                  </span>
                  {/* Float 2: Bintang */}
                  <span className="landing-float landing-float-2">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <rect width="40" height="40" rx="10" fill="#10b981" stroke="#0f2e29" strokeWidth="3"/>
                      <path d="M20 8l3.09 6.26L30 15.27l-5 4.87 1.18 6.88L20 23.77l-6.18 3.25L15 20.14 10 15.27l6.91-1.01z" fill="#ffd93d"/>
                    </svg>
                  </span>
                  {/* Float 3: Trofi */}
                  <span className="landing-float landing-float-3">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <rect width="40" height="40" rx="10" fill="#8b5cf6" stroke="#0f2e29" strokeWidth="3"/>
                      <path d="M13 9h14v8a7 7 0 0 1-14 0V9z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M9 11h4M27 11h4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M20 24v4M15 28h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  {/* Float 4: Buku */}
                  <span className="landing-float landing-float-4">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <rect width="40" height="40" rx="10" fill="#3b82f6" stroke="#0f2e29" strokeWidth="3"/>
                      <path d="M8 10h8a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H8z" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M32 10h-8a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h9z" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>
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
        <section className="landing-section" id="ciri">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Kenapa Bunyi Kata?</span>
            <h2 className="landing-h2">Semua Yang Anak Perlukan Untuk Baca</h2>
            <p className="landing-section-sub">
              Aktiviti yang direka oleh pendidik, dibungkus dalam permainan yang anak suka.
            </p>
          </div>
          <div className="landing-grid landing-grid-ciri">
            {ciri.map((c, i) => (
              <div
                className="landing-card landing-card-ciri landing-reveal"
                key={c.tajuk}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="landing-card-icon" style={{ backgroundColor: c.warna }}>
                  <c.Icon />
                </div>
                <h3>{c.tajuk}</h3>
                <p>{c.huraian}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== APP PREVIEW ===== */}
        <section className="landing-section landing-section-alt" id="preview">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Tengok Sendiri</span>
            <h2 className="landing-h2">Rupa Dalam Aplikasi</h2>
            <p className="landing-section-sub">
              Kandungan sebenar Ã¢â‚¬â€ bukan sekadar gambar stok. Ini yang anak awak akan gunakan setiap hari.
            </p>
          </div>
          <div className="landing-preview-layout">
            <div className="landing-reveal landing-reveal-left" style={{flex:"1 1 300px"}}>
              <AppPreviewCarousel items={appPreviews} />
            </div>
            <div className="landing-preview-feature-list landing-reveal landing-reveal-right" style={{flex:"1 1 300px"}}>
              {appPreviews.map((item, i) => (
                <div className="landing-preview-feature-item" key={item.label} style={{"--delay": `${i * 60}ms`} as React.CSSProperties}>
                  <div className="landing-preview-feature-dot" style={{ backgroundColor: item.warna }} />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PERMAINAN ===== */}
        <section className="landing-section" id="cabaran">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Mini Permainan</span>
            <h2 className="landing-h2">Belajar Sambil Bermain</h2>
            <p className="landing-section-sub">
              Setiap permainan menumpu satu kemahiran membaca yang penting.
            </p>
          </div>
          <div className="landing-grid landing-grid-cabaran">
            {cabaran.map((c, i) => (
              <div
                className="landing-card landing-card-cabaran landing-reveal"
                key={c.nama}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="landing-card-game-icon" style={{ color: c.warna, borderColor: c.warna }}>
                  <c.Icon />
                </div>
                <span className="landing-card-nama">{c.nama}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LANGKAH ===== */}
        <section className="landing-section landing-section-alt" id="mula">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Senang Je</span>
            <h2 className="landing-h2">Mula Dalam 3 Langkah</h2>
          </div>
          <div className="landing-grid landing-grid-langkah">
            {langkah.map((l, i) => (
              <div
                className="landing-card landing-card-langkah landing-reveal"
                key={l.no}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="landing-langkah-no">{l.no}</span>
                <h3>{l.tajuk}</h3>
                <p>{l.huraian}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONI ===== */}
        <section className="landing-section">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Kata Ibu Bapa &amp; Guru</span>
            <h2 className="landing-h2">Mereka Dah Nampak Bezanya</h2>
          </div>
          <div className="landing-grid landing-grid-testimoni">
            {testimoni.map((t, i) => (
              <div
                className="landing-card landing-card-testimoni landing-reveal"
                key={t.nama}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="landing-star-row">
                  {[...Array(5)].map((_, si) => (
                    <span key={si} style={{ color: "#f59e0b", fontSize: "1.1rem" }}>
                      <IconStar />
                    </span>
                  ))}
                </div>
                <p className="landing-testimoni-teks">"{t.teks}"</p>
                <div className="landing-testimoni-orang">
                  <strong>{t.nama}</strong>
                  <span>{t.peranan}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PAKEJ ===== */}
        <section className="landing-section landing-section-alt" id="pakej">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Pakej</span>
            <h2 className="landing-h2">Pilih Yang Sesuai Untuk Anda</h2>
            <p className="landing-section-sub">
              Mula percuma, naik taraf bila dah bersedia untuk ciri penuh.
            </p>
          </div>
          <div className="landing-grid landing-grid-pakej">
            <div className="landing-card landing-pakej landing-reveal">
              <div className="landing-pakej-head">
                <span className="landing-pakej-tag landing-tag-gratis">Percuma</span>
              </div>
              <h3 className="landing-pakej-nama">Cuba Percuma</h3>
              <div className="landing-pakej-harga">
                <span className="landing-pakej-rm">RM</span>0
              </div>
              <p className="landing-pakej-note">Selamanya. Untuk mula kenal huruf.</p>
              <ul className="landing-pakej-senarai">
                <li><IconCheck /> Fonik asas (vokal &amp; konsonan)</li>
                <li><IconCheck /> Permainan terpilih</li>
                <li><IconCheck /> 1 profil anak</li>
              </ul>
              <button
                className="landing-btn landing-btn-outline landing-btn-block"
                onClick={onCubaPercuma}
              >
                Cuba Sekarang
              </button>
            </div>

            <div className="landing-pakej-card landing-reveal">
              <div className="landing-pakej-card-inner">
                <div className="landing-shine-sweep" aria-hidden="true"></div>
                <div>
                  <div className="landing-pakej-head">
                    <span className="landing-pakej-tag landing-tag-biasa">1 BULAN</span>
                  </div>
                  <h3 className="landing-pakej-nama">Bulanan Biasa</h3>
                  <div className="landing-pakej-harga">
                    <span className="landing-pakej-rm">RM</span>15
                    <span className="landing-pakej-bulan">/bulan</span>
                  </div>
                  <p className="landing-pakej-note">Untuk mula memantau kemajuan anak.</p>
                  <ul className="landing-pakej-senarai">
                    <li><IconCheck /> 1 profil anak</li>
                    <li><IconCheck /> Semua 4 peta &amp; aktiviti</li>
                    <li><IconCheck /> Laporan prestasi asas</li>
                  </ul>
                </div>
                <button
                  className="landing-btn landing-btn-pro landing-btn-block"
                  onClick={() => onOpenPakej && onOpenPakej("ibubapa")}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>

            <div className="landing-pakej-card landing-pakej-card-unggul landing-reveal">
              <div className="landing-pakej-card-inner">
                <div className="landing-shine-sweep" aria-hidden="true"></div>
                <div className="landing-pakej-head">
                  <span className="landing-pakej-tag landing-tag-biasa">3 BULAN</span>
                </div>
                <h3 className="landing-pakej-nama">Bulanan Pro</h3>
                <div className="landing-pakej-harga">
                  <span className="landing-pakej-rm">RM</span>40
                  <span className="landing-pakej-bulan">/3 bulan</span>
                </div>
                <p className="landing-pakej-note">Buka semua ciri &amp; laporan penuh.</p>
                <ul className="landing-pakej-senarai">
                  <li><IconCheck /> 1 kelas / sehingga 3 profil anak</li>
                  <li><IconCheck /> Semua 4 peta &amp; aktiviti</li>
                  <li><IconCheck /> Kod Kelas / Kod Keluarga</li>
                </ul>
                <button
                  className="landing-btn landing-btn-primary landing-btn-block"
                  onClick={() => onOpenPakej && onOpenPakej("guru")}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>

            <div className="landing-pakej-card landing-reveal">
              <div className="landing-pakej-card-inner">
                <div className="landing-shine-sweep" aria-hidden="true"></div>
                <div>
                  <div className="landing-pakej-head">
                    <span className="landing-pakej-tag landing-tag-jimat">1 TAHUN</span>
                  </div>
                  <h3 className="landing-pakej-nama">Tahunan Pro</h3>
                  <div className="landing-pakej-harga">
                    <span className="landing-pakej-rm">RM</span>69
                    <span className="landing-pakej-bulan">/tahun</span>
                  </div>
                  <p className="landing-pakej-note">Akses penuh 365 hari — paling jimat.</p>
                  <ul className="landing-pakej-senarai">
                    <li><IconCheck /> Semua ciri Pro selama 1 tahun</li>
                    <li><IconCheck /> 2 kelas / sehingga 3 profil anak</li>
                    <li><IconCheck /> Laporan &amp; sijil setiap anak</li>
                  </ul>
                </div>
                <button
                  className="landing-btn landing-btn-outline landing-btn-block"
                  onClick={() => onOpenPakej && onOpenPakej("guru")}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="landing-section" id="faq">
          <div className="landing-section-head landing-reveal">
            <span className="landing-kicker">Soalan Lazim</span>
            <h2 className="landing-h2">Ada Persoalan?</h2>
          </div>
          <div className="landing-faq">
            {faq.map((f, i) => (
              <div
                className={`landing-faq-item landing-reveal ${faqBuka === i ? "buka" : ""}`}
                key={f.s}
              >
                <button
                  className="landing-faq-soalan"
                  onClick={() => setFaqBuka(faqBuka === i ? null : i)}
                >
                  <span>{f.s}</span>
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
            <div className="landing-cta-avatars">
              {[1,2,3,4].map(n => (
                <img key={n} src={`/images/avatar/avatar${n}.png`} alt={`Watak ${n}`} className="landing-cta-avatar" />
              ))}
            </div>
            <h2>Sedia Bantu Anak Anda Membaca?</h2>
            <p>Mulakan perjalanan bacaan mereka hari ini Ã¢â‚¬â€ percuma, tanpa daftar.</p>
            <button
              className="landing-btn landing-btn-cta-gold landing-btn-lg"
              onClick={onCubaPercuma}
            >
              <IconRocket /> Cuba Percuma Sekarang
            </button>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <img src={LOGO} alt="Bunyi Kata" className="landing-footer-logo" />
              <p>Belajar membaca jadi seronok. Dibina untuk anak Malaysia.</p>
            </div>
            <div className="landing-footer-col">
              <h4>Produk</h4>
              <a href="#ciri">Ciri</a>
              <a href="#preview">Pratonton</a>
              <a href="#pakej">Pakej</a>
            </div>
            <div className="landing-footer-col">
              <h4>Akaun</h4>
              <a href="#faq">FAQ</a>
              <button className="landing-footer-link" onClick={onLogMasuk}>
                Log Masuk
              </button>
            </div>
          </div>
          <div className="landing-footer-bottom">
            Ã‚Â© {new Date().getFullYear()} Bunyi Kata Ã‚Â· bunyi-kata.my Ã‚Â· Hak cipta terpelihara.
          </div>
        </footer>

      </div>
    </div>
  );
}
