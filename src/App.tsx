// @ts-nocheck
import React, { useEffect, useState, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import MuridSidePanel from "./components/panels/MuridSidePanel";
import PilihPetaModal from "./components/modals/PilihPetaModal";
import LoginScreen from "./components/screens/LoginScreen";
import LandingScreen from "./components/screens/LandingScreen";
import MapScreen from "./components/screens/MapScreen";
import AppInfoModals from "./components/modals/AppInfoModals";
// Lazy-load canvas-confetti: besar (~20KB) dan cuma dipakai selepas game tamat.
// Defer supaya initial bundle kekal kecil dan tidak block render shell login.
// Pelindung dwi-klik (double-fire): React onClick boleh tercetus dua kali
// (klik pantas / sentuh), dan app-logic.js lama juga mempunyai pendengar klik
// global. Pelindung ini memastikan satu tindakan (audio/nav/buka modal) hanya
// berlaku SEKALI dalam tempoh singkat, jadi tiada audio/nav berganda.
const _kunciKlik: Record<string, number> = {};
function sekaliKlik(kunci: string, tempohMs: number = 450): boolean {
  const now = Date.now();
  if (_kunciKlik[kunci] && now - _kunciKlik[kunci] < tempohMs) return false;
  _kunciKlik[kunci] = now;
  return true;
}

const confettiPromise = import("canvas-confetti").then((m) => m.default);
let _confetti: any = null;
const confetti = (...args: any[]) => {
  if (!_confetti) {
    // Fallback no-op sehingga chunk dimuat turun; canvas-confetti
    // dimuat secara lazy oleh pengguna pada kali pertama ia dipanggil.
    confettiPromise.then((m) => { _confetti = m; }).catch(() => {});
    return undefined;
  }
  return _confetti(...args);
};

// Komponen berat — setiap satu cuma dipaparkan secara bersyarat
// (di sebalik state flag / class skrin). Lazy-load supaya App.tsx tidak
// perlu mem-parse semuanya sebelum shell login dapat dilukis.
// Saiz awal App.tsx turun daripada ~476KB kepada ~50KB (hanya shell).
const TandukKataGame = lazy(() => import("./components/TandukKataGame").then(m => ({ default: m.TandukKataGame })));
const PerpustakaanGame = lazy(() => import("./components/PerpustakaanGame").then(m => ({ default: m.PerpustakaanGame })));
const CabaranSukuKataGame = lazy(() => import("./components/CabaranSukuKataGame").then(m => ({ default: m.CabaranSukuKataGame })));
const PuzzleSukuKataGame = lazy(() => import("./components/PuzzleSukuKataGame").then(m => ({ default: m.PuzzleSukuKataGame })));
const CantumKataGame = lazy(() => import("./components/CantumKataGame").then(m => ({ default: m.CantumKataGame })));
const FonikAbcGame = lazy(() => import("./components/FonikAbcGame").then(m => ({ default: m.FonikAbcGame })));
const NomborGame = lazy(() => import("./components/NomborGame").then(m => ({ default: m.NomborGame })));
const KadImbasanNomborGame = lazy(() => import("./components/KadImbasanNomborGame").then(m => ({ default: m.KadImbasanNomborGame })));
import type { KadImbasanNomborMode } from "./components/KadImbasanNomborGame";
const SukuKataPuzzleBar = lazy(() => import("./components/SukuKataPuzzleBar").then(m => ({ default: m.SukuKataPuzzleBar })));
const BukuCeritaModal = lazy(() => import("./components/BukuCeritaModal").then(m => ({ default: m.BukuCeritaModal })));
const CubaSebutGame = lazy(() => import("./components/CubaSebutGame").then(m => ({ default: m.CubaSebutGame })));
const AdminSijilManager = lazy(() => import("./components/AdminSijilManager").then(m => ({ default: m.AdminSijilManager })));
const PirateAvatar3DSwiper = lazy(() => import("./components/PirateAvatar3DSwiper").then(m => ({ default: m.PirateAvatar3DSwiper })));
const Lencana3DSwiper = lazy(() => import("./components/Lencana3DSwiper").then(m => ({ default: m.Lencana3DSwiper })));
const AdminDashboard = lazy(() => import("./components/dashboards/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const IbubapaDashboard = lazy(() => import("./components/dashboards/IbubapaDashboard").then(m => ({ default: m.IbubapaDashboard })));
const GuruDashboard = lazy(() => import("./components/dashboards/GuruDashboard").then(m => ({ default: m.GuruDashboard })));
const AffiliateDashboard = lazy(() => import("./components/dashboards/AffiliateDashboard").then(m => ({ default: m.AffiliateDashboard })));
const AuthModal = lazy(() => import("./components/modals/AuthModal").then(m => ({ default: m.AuthModal })));
const PricingProModal = lazy(() => import("./components/modals/PricingProModal").then(m => ({ default: m.PricingProModal })));
const EditProfileModal = lazy(() => import("./components/modals/EditProfileModal").then(m => ({ default: m.EditProfileModal })));
const EntryChoiceModal = lazy(() => import("./components/modals/EntryChoiceModal").then(m => ({ default: m.EntryChoiceModal })));
const ModeChoiceModal = lazy(() => import("./components/modals/ModeChoiceModal").then(m => ({ default: m.ModeChoiceModal })));
const TermsPrivacyModal = lazy(() => import("./components/modals/TermsPrivacyModal").then(m => ({ default: m.TermsPrivacyModal })));
import { hubungiAdminWhatsapp, mesejDaftarPakej, mesejDaftarAffiliate } from "./config/contactAdmin";
import "./utils/sijilGenerator";
import "./index.css";
import { motion, AnimatePresence } from "motion/react";
import {
  loginWithEmail,
  logout as firebaseLogout,
  getCurrentUserProfile,
  sendPasswordResetEmail,
  updateUserPasswordInFirebase,
} from "./services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "./lib/firebase";
import {
  getClassByCode,
  getFamilyByCode,
  getStudentsByClassId,
  getStudentsByFamilyId,
  getStudentsByCode,
  saveClassToFirebase,
  saveFamilyToFirebase,
  syncStudentToFirebase,
  fetchAdminDataFromFirebase,
  getRegisteredTeachers,
  getRegisteredParents,
  getFeedbacksFromFirebase,
  deleteFeedbackInFirebase,
  updateProfileSubscription,
  deleteProfileInFirebase,
  initFirebaseRealtimeSubscriptions,
  submitUserFeedback,
  checkSubscriptionCodeLimit,
  adminCreateProfile,
  getClassCountByGuruId,
  getTeacherClasses,
  updateClassInFirebase,
  syncTeacherClasses,
  updateProfileSubscriptionPlan,
  recordStudentActivity,
  recordStudentBadge,
  saveCertificate,
  fetchStudentProgressFromFirebase,
  updateTeacherSchoolAndNameInFirebase,
  updateParentFamilyAndNameInFirebase,
  saveParentChildToFirebase,
  deleteParentChildFromFirebase,
  syncParentSessionFromFirebase,
  deleteStudentFromFirebase,
  testFirebaseConnection,
  cleanupOrphanedStudentsInFirebase,
  getStudentsForTeacher,
  syncTeacherSessionFromFirebase,
  deleteStudentByNameFromFirebase,
  checkIsCodeAlreadyUsedInFirebase,
  SISTEM_KOD_TERLARANG,
  naikTarafLanggananFirebase,
  semakLuputLanggananFirebase,
} from "./services/firebaseService";

if (typeof window !== "undefined") {
  (window as any).getStudentsByCode = getStudentsByCode;
  (window as any).getStudentsForTeacher = getStudentsForTeacher;
  (window as any).syncTeacherSessionFromFirebase = syncTeacherSessionFromFirebase;
  (window as any).deleteStudentByNameFromFirebase = deleteStudentByNameFromFirebase;
  (window as any).deleteParentChildFromFirebase = deleteParentChildFromFirebase;
  (window as any).checkIsCodeAlreadyUsedInFirebase = checkIsCodeAlreadyUsedInFirebase;
  (window as any).checkIsCodeAlreadyUsed = checkIsCodeAlreadyUsedInFirebase;
  (window as any).confetti = confetti;
  (window as any).firebaseLogout = firebaseLogout;
  (window as any).testFirebaseConnection = testFirebaseConnection;
  (window as any).fetchAdminDataFromFirebase = fetchAdminDataFromFirebase;
  (window as any).getRegisteredTeachers = getRegisteredTeachers;
  (window as any).getRegisteredParents = getRegisteredParents;
  (window as any).getFeedbacksFromFirebase = getFeedbacksFromFirebase;
  (window as any).deleteFeedbackInFirebase = deleteFeedbackInFirebase;
  (window as any).updateProfileSubscription = updateProfileSubscription;
  (window as any).deleteProfileInFirebase = deleteProfileInFirebase;
  (window as any).cleanupOrphanedStudentsInFirebase = cleanupOrphanedStudentsInFirebase;
  (window as any).initFirebaseRealtimeSubscriptions = initFirebaseRealtimeSubscriptions;
  (window as any).submitUserFeedback = submitUserFeedback;
  (window as any).saveClassToFirebase = saveClassToFirebase;
  (window as any).saveFamilyToFirebase = saveFamilyToFirebase;
  (window as any).syncStudentToFirebase = syncStudentToFirebase;
  (window as any).getClassByCode = getClassByCode;
  (window as any).getFamilyByCode = getFamilyByCode;
  (window as any).getStudentsByClassId = getStudentsByClassId;
  (window as any).getStudentsByFamilyId = getStudentsByFamilyId;
  (window as any).getStudentsByCode = getStudentsByCode;
  (window as any).updateClassInFirebase = updateClassInFirebase;
  (window as any).syncTeacherClasses = syncTeacherClasses;
  (window as any).updateProfileSubscriptionPlan = updateProfileSubscriptionPlan;
  (window as any).checkSubscriptionCodeLimit = checkSubscriptionCodeLimit;
  (window as any).getClassCountByGuruId = getClassCountByGuruId;
  (window as any).getTeacherClasses = getTeacherClasses;
  (window as any).recordStudentActivity = recordStudentActivity;
  (window as any).recordStudentBadge = recordStudentBadge;
  (window as any).saveCertificate = saveCertificate;
  (window as any).fetchStudentProgressFromFirebase = fetchStudentProgressFromFirebase;
  (window as any).updateParentFamilyAndNameInFirebase = updateParentFamilyAndNameInFirebase;
  (window as any).saveParentChildToFirebase = saveParentChildToFirebase;
  (window as any).syncParentSessionFromFirebase = syncParentSessionFromFirebase;
  (window as any).deleteStudentFromFirebase = deleteStudentFromFirebase;

  if (!(window as any).getCurrentProfileData) {
    (window as any).getCurrentProfileData = () => {
      const studentName = (window as any).namaMuridAktif || localStorage.getItem('muridAktif') || localStorage.getItem('bunyiKataCurrentMurid') || localStorage.getItem('bunyiKataNamaMurid') || '';
      if (!studentName) return null;
      let data = ((window as any).studentData && (window as any).studentData[studentName]) ? (window as any).studentData[studentName] : null;
      if (!data) {
        try {
          const raw = localStorage.getItem('bunyiKataStudentData');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed[studentName]) {
              data = parsed[studentName];
              if ((window as any).studentData) (window as any).studentData[studentName] = data;
            }
          }
        } catch (e) {
          console.warn("[App] Gagal parse bunyiKataStudentData:", e);
        }
      }
      if (data && (!data.badges || data.badges.length === 0) && typeof (window as any).kiraLencanaMurid === 'function') {
        const earned = (window as any).kiraLencanaMurid(data);
        if (Array.isArray(earned) && earned.length > 0) {
          data.badges = earned;
        }
      }
      return data;
    };
  }

  if (!(window as any).isPetaCompleted) {
    (window as any).isPetaCompleted = (petaId: any, data: any) => {
      const s = data || (window as any).getCurrentProfileData?.();
      if (!s) return false;
      const existingBadges = (s && Array.isArray(s.badges)) ? s.badges : [];
      if (petaId === 'all' || petaId === 'master' || petaId === 5) {
        if (existingBadges.includes('badge_master')) return true;
      } else {
        const numId = Number(petaId);
        if (numId >= 1 && numId <= 4 && existingBadges.includes(`badge_peta_${numId}`)) return true;
      }
      if (typeof (window as any).kiraLencanaMurid === 'function') {
        const earned = (window as any).kiraLencanaMurid(s);
        if (petaId === 'all' || petaId === 'master' || petaId === 5) {
          return earned.includes('badge_master');
        }
        const numId = Number(petaId);
        if (numId >= 1 && numId <= 4) {
          return earned.includes(`badge_peta_${numId}`);
        }
      }
      return false;
    };
  }
}

const masukModMurid = (...args: any[]) => (window as any).masukModMurid?.(...args);
const masukModGuru = (...args: any[]) => (window as any).masukModGuru?.(...args);
const toggleTheme = (...args: any[]) => (window as any).toggleTheme?.(...args);
const backToModeSelection = (...args: any[]) =>
  (window as any).backToModeSelection?.(...args);
const tutupSidePanel = (...args: any[]) => (window as any).tutupSidePanel?.(...args);
const paparSkrin = (...args: any[]) => (window as any).paparSkrin?.(...args);
const muatTurunSijil = (...args: any[]) => {
  if (typeof (window as any).bukaModalSijilMurid === 'function') {
    return (window as any).bukaModalSijilMurid(...args);
  }
  return (window as any).muatTurunSijil?.(...args);
};
const janaMuatTurunSijilPDF = (...args: any[]) => {
  if (typeof (window as any).downloadCertificatePDF === 'function') {
    return (window as any).downloadCertificatePDF(...args);
  }
  return (window as any).janaMuatTurunSijilPDF?.(...args);
};
const tutupBantuan = (...args) => (window as any).tutupBantuan?.(...args);
const simpanProfilEdit = (...args) =>
  (window as any).simpanProfilEdit?.(...args);
const bukaSenaraiHuruf = (jenis?: string) => {
  (window as any).phonicsMode = 'kenali_huruf';
  (window as any).paparSkrin?.("view-belajar-fonik");
};
(window as any).bukaKenaliHuruf = () => {
  (window as any).phonicsMode = 'kenali_huruf';
  (window as any).paparSkrin?.("view-belajar-fonik");
};
(window as any).bukaVokalKonsonan = () => {
  (window as any).phonicsMode = 'vokal_konsonan';
  (window as any).paparSkrin?.("view-belajar-fonik");
};
(window as any).bukaFonikAbc = () => {
  (window as any).phonicsMode = 'fonik_abc';
  (window as any).paparSkrin?.("view-belajar-fonik");
};
const prevBelajarSukuKata = (...args) =>
  (window as any).prevBelajarSukuKata?.(...args);
const nextBelajarSukuKata = (...args) =>
  (window as any).nextBelajarSukuKata?.(...args);
const mainAudioSukuKataSemasa = (...args) =>
  (window as any).mainAudioSukuKataSemasa?.(...args);
const bukaModalSenaraiSukuKata = (...args) =>
  (window as any).bukaModalSenaraiSukuKata?.(...args);
const tutupModalSenaraiSukuKata = (...args) =>
  (window as any).tutupModalSenaraiSukuKata?.(...args);
const onStudentSelect = (...args) => (window as any).onStudentSelect?.(...args);

const toggleExerciseTooltip = (e: React.MouseEvent) => {
  e.stopPropagation();
  const btn = e.currentTarget as HTMLElement;
  const card = btn.closest(".exercise-card");
  if (!card) return;
  const popover = card.querySelector(".exercise-tooltip-box");
  if (!popover) return;

  const isActive = popover.classList.contains("is-active");

  document.querySelectorAll(".exercise-tooltip-box.is-active").forEach((el) => {
    el.classList.remove("is-active");
  });

  if (!isActive) {
    popover.classList.add("is-active");
  }
};

export default function App() {
  const handleEditIbubapaProfile = () => {
    if ((window as any).playBubble) (window as any).playBubble();
    if (typeof (window as any).bukaSetupModal === "function") {
      (window as any).bukaSetupModal("ibubapa", false);
    } else {
      setEditModalError("");
      setIsMandatorySetup(false);
      setEditModalMode("ibubapa");
      (window as any).modAdminAktif = false;
      (window as any).modGuruAktif = false;
      (window as any).modIbuBapaAktif = true;
      setEditNamaKeluargaTemp(
        localStorage.getItem("bunyiKataNamaKeluarga") || "",
      );
      setEditNamaAnakTemp(
        (window as any).anakTerpilih ||
        localStorage.getItem("ibubapaAnakTerpilih") ||
        "",
      );
      setEditKodTemp(
        localStorage.getItem("bunyiKataKodKeluarga") || "",
      );
      setIsEditModalOpen(true);
    }
  };

  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".exercise-card")) {
        document.querySelectorAll(".exercise-tooltip-box.is-active").forEach((el) => {
          el.classList.remove("is-active");
        });
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const [activeScreen, setActiveScreen] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\/+/, "");
      if (path) return path;
      if (window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        if (hash) return hash;
      }
    }
    return "landing-screen";
  });

  const getScreenClass = (id: string, extraClasses: string = "") => {
    const isActive = activeScreen === id;
    return `screen ${isActive ? "active" : ""} ${extraClasses}`.trim();
  };

  const [activeStudentName, setActiveStudentName] = React.useState<string>(() => {
    return (
      (typeof window !== "undefined" && (window as any).namaMuridAktif) ||
      localStorage.getItem("muridAktif") ||
      localStorage.getItem("bunyiKataCurrentMurid") ||
      "Murid"
    );
  });
  const [activeStudentAvatar, setActiveStudentAvatar] = React.useState<string>(() => {
    if (typeof window !== "undefined" && (window as any).selectedAvatarIcon) {
      return (window as any).selectedAvatarIcon;
    }
    return localStorage.getItem("selectedAvatarIcon") || "/images/avatar/avatar1.png";
  });
  const [editModalMode, setEditModalMode] = React.useState<"guru" | "ibubapa" | "admin">("guru");
  const [pendingSelectedPlan, setPendingSelectedPlan] = React.useState<any>(null);

  React.useEffect(() => {
    const handleScreenChange = (e?: any) => {
      const scr = e?.detail?.screenId || (window as any).currentActiveScreen;
      if (scr) {
        setActiveScreen(scr);
      }
    };
    window.addEventListener("screen-changed", handleScreenChange);

    const handleUrlNav = () => {
      const rawPath = window.location.pathname.replace(/^\/+/, "");
      let path = rawPath || (window.location.hash ? window.location.hash.replace("#", "") : "");
      if (!path || path === "index.html") {
        path = "landing-screen";
      }

      // Gunakan penjaga laluan BERKONGSI (window.bolehAksesSkrin) supaya
      // App.tsx dan app-logic.js sentiasa sependapat. Ini juga menutup
      // celah pautan yang ditampal terus (cth /main-menu-screen).
      if (typeof (window as any).bolehAksesSkrin === "function") {
        if (path !== "login-screen" && path !== "landing-screen" && !(window as any).bolehAksesSkrin(path)) {
          path = "login-screen";
        }
      } else {
        // Rizab: jika app-logic.js belum dimuatkan lagi.
        if (path === "admin-dashboard" || path.startsWith("admin-")) {
          const isAdmin = !!(
            (window as any).modAdminAktif ||
            (window as any).isAdminMode ||
            (window as any).adminClaimDisahkan === true
          );
          if (!isAdmin) path = "login-screen";
        } else if (path === "guru-dashboard" || path.startsWith("guru-")) {
          const isGuru = localStorage.getItem("bunyiKataUserRole") === "guru" || (window as any).modGuruAktif;
          if (!isGuru) path = "login-screen";
        } else if (path === "ibubapa-dashboard" || path.startsWith("ibubapa-")) {
          const isParent = localStorage.getItem("bunyiKataUserRole") === "ibubapa" || (window as any).modIbuBapaAktif;
          if (!isParent) path = "login-screen";
        }
      }

      if (path) {
        setActiveScreen(path);
        if (typeof (window as any).paparSkrin === "function") {
          (window as any).paparSkrin(path, true);
        }
      }
    };
    window.addEventListener("popstate", handleUrlNav);
    window.addEventListener("hashchange", handleUrlNav);

    // Initial check on mount
    if (typeof window !== "undefined") {
      let currentPath =
        window.location.pathname.replace(/^\/+/, "") ||
        (window.location.hash ? window.location.hash.replace("#", "") : "");

      // Penjaga laluan BERKONGSI — pautan yang ditampal terus (cth
      // /main-menu-screen atau /admin-dashboard) oleh pelawat awam mesti
      // kembali ke skrin log masuk. Jika tidak, mereka boleh masuk ke
      // dalam mod Pro/Admin tanpa melalui aliran masuk yang sah.
      if (currentPath && currentPath !== "login-screen" && currentPath !== "landing-screen" && typeof (window as any).bolehAksesSkrin === "function") {
        if (!(window as any).bolehAksesSkrin(currentPath)) {
          console.warn("[Navigasi] Laluan awal ditolak:", currentPath, "— kembali ke skrin log masuk.");
          currentPath = "login-screen";
          try {
            window.history.replaceState({ screenId: "login-screen" }, document.title, "/login-screen");
          } catch (e) {
            console.warn("[Navigasi] Gagal replaceState ke login-screen:", e);
          }
        }
      }

      if (currentPath && currentPath !== "login-screen" && currentPath !== "landing-screen") {
        setActiveScreen(currentPath);
        if (currentPath === "ibubapa-dashboard" || currentPath.startsWith("ibubapa-")) {
          document.body.classList.add("parent-mode");
          document.body.classList.remove("teacher-mode", "admin-mode");
          const pNav = document.getElementById("parent-sticky-nav");
          if (pNav) pNav.style.display = "flex";
        } else if (currentPath === "guru-dashboard" || currentPath.startsWith("guru-")) {
          document.body.classList.add("teacher-mode");
          document.body.classList.remove("parent-mode", "admin-mode");
          const tNav = document.getElementById("teacher-sticky-nav");
          if (tNav) tNav.style.display = "flex";
        } else if (currentPath === "admin-dashboard" || currentPath.startsWith("admin-")) {
          document.body.classList.add("teacher-mode", "admin-mode");
          document.body.classList.remove("parent-mode");
          const aNav = document.getElementById("admin-sticky-nav");
          if (aNav) aNav.style.display = "flex";
        }
        if (typeof (window as any).paparSkrin === "function") {
          (window as any).paparSkrin(currentPath, true);
        }
      }
    }

    const originalPaparSkrin = (window as any).paparSkrin;
    (window as any).paparSkrin = (screenId: string, skipHash?: boolean) => {
      if (screenId) {
        (window as any).currentActiveScreen = screenId;
        setActiveScreen(screenId);
      }
      if (typeof originalPaparSkrin === "function") {
        return originalPaparSkrin(screenId, skipHash);
      }
    };

    const syncStudent = (e?: any) => {
      const name =
        (e && e.detail && e.detail.name) ||
        (window as any).namaMuridAktif ||
        localStorage.getItem("muridAktif") ||
        localStorage.getItem("bunyiKataCurrentMurid") ||
        "Murid";
      setActiveStudentName(name);

      const av =
        (typeof window !== "undefined" && (window as any).selectedAvatarIcon) ||
        localStorage.getItem("selectedAvatarIcon") ||
        "/images/avatar/avatar1.png";
      setActiveStudentAvatar(av);
    };

    const syncAvatar = (e?: any) => {
      const av =
        (e && e.detail && e.detail.avatar) ||
        (typeof window !== "undefined" && (window as any).selectedAvatarIcon) ||
        localStorage.getItem("selectedAvatarIcon") ||
        "/images/avatar/avatar1.png";
      setActiveStudentAvatar(av);
    };

    window.addEventListener("student-changed", syncStudent);
    window.addEventListener("avatar-changed", syncAvatar);
    window.addEventListener("storage", syncStudent);
    return () => {
      window.removeEventListener("screen-changed", handleScreenChange);
      window.removeEventListener("popstate", handleUrlNav);
      window.removeEventListener("hashchange", handleUrlNav);
      if (originalPaparSkrin) {
        (window as any).paparSkrin = originalPaparSkrin;
      }
      window.removeEventListener("student-changed", syncStudent);
      window.removeEventListener("avatar-changed", syncAvatar);
      window.removeEventListener("storage", syncStudent);
    };
  }, []);

  const [isDialOpen, setIsDialOpen] = React.useState(false);
  const [showARGuideModal, setShowARGuideModal] = React.useState(false);
  const [showARKiraJariGuideModal, setShowARKiraJariGuideModal] = React.useState(false);
  const [arKiraJariMode, setArKiraJariMode] = React.useState<'nombor' | 'tambah' | 'tolak'>('nombor');
  const [showVRGuideModal, setShowVRGuideModal] = React.useState(false);
  const [kadImbasanNomborMode, setKadImbasanNomborMode] = React.useState<KadImbasanNomborMode>('bilang_0_10');

  const [showBukuCeritaModal, setShowBukuCeritaModal] = React.useState(false);
  const [initialBukuCeritaId, setInitialBukuCeritaId] = React.useState<string | null>(null);
  const [isPerpustakaanOpen, setIsPerpustakaanOpen] = React.useState(false);
  const [isPerpustakaanHeroMode, setIsPerpustakaanHeroMode] = React.useState(false);
  const [showCubaSebut, setShowCubaSebut] = React.useState(false);
  const [cubaSebutConfig, setCubaSebutConfig] = React.useState<{
    key: string;
    label: string;
    mode: 'sebut' | 'baca';
  }>({
    key: 'kvkv',
    label: 'KV + KV',
    mode: 'sebut'
  });

  React.useEffect(() => {
    (window as any).showARGuideModal = () => setShowARGuideModal(true);
    (window as any).showARKiraJariGuideModal = () => setShowARKiraJariGuideModal(true);
    (window as any).setARKiraJariModeReact = (m: 'nombor' | 'tambah' | 'tolak') => setArKiraJariMode(m);
    (window as any).showVRGuideModal = () => setShowVRGuideModal(true);

    const openPerpustakaan = (isHero?: boolean) => {
      const hero = (typeof isHero === 'boolean')
        ? isHero
        : ((window as any).currentPeta === 3);
      setIsPerpustakaanHeroMode(hero);
      setIsPerpustakaanOpen(true);
      if ((window as any).paparSkrin) (window as any).paparSkrin('view-perpustakaan');
    };
    (window as any).bukaPerpustakaan = openPerpustakaan;
    (window as any).openPerpustakaanReact = openPerpustakaan;
    (window as any).closePerpustakaanReact = () => {
      setIsPerpustakaanOpen(false);
    };
    (window as any).setPerpustakaanHeroMode = (isHero: boolean) => {
      setIsPerpustakaanHeroMode(isHero);
    };

    // Check direct URL path on load
    const currentUrlPath = window.location.pathname.replace(/^\/+/, '');
    if (currentUrlPath === 'view-perpustakaan') {
      openPerpustakaan();
    }

    // Pantau perubahan kelas pada #view-perpustakaan (contohnya daripada paparSkrin)
    const el = document.getElementById('view-perpustakaan');
    let observer: MutationObserver | null = null;
    if (el) {
      if (el.classList.contains('active')) {
        setIsPerpustakaanHeroMode((window as any).currentPeta === 3);
        setIsPerpustakaanOpen(true);
      }
      observer = new MutationObserver(() => {
        const active = el.classList.contains('active');
        if (active) {
          setIsPerpustakaanHeroMode((window as any).currentPeta === 3);
          setIsPerpustakaanOpen(true);
        } else {
          setIsPerpustakaanOpen(false);
        }
      });
      observer.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    const handleBukaCubaSebutEvent = (e: any) => {
      if (e?.detail) {
        setCubaSebutConfig({
          key: e.detail.key || 'kvkv',
          label: e.detail.label || 'KV + KV',
          mode: e.detail.mode || 'sebut'
        });
        setShowCubaSebut(true);
      }
    };
    window.addEventListener('buka-cuba-sebut', handleBukaCubaSebutEvent);

    (window as any).bukaBukuCeritaModal = (bookId?: string) => {
      setInitialBukuCeritaId(bookId || null);
      setShowBukuCeritaModal(true);
    };

    (window as any).showCantumKataModal = () => {
      const container = document.getElementById('cantum-kata-buttons-container');
      const modal = document.getElementById('modal-pilih-cantum-kata');
      if (!container || !modal) return;
      const isHero = ((window as any).currentPeta === 3);
      let buttonsHTML = '';
      if (isHero) {
        const heroSkills = [
          { key: 'kv_kvk', label: 'KV + KVK' },
          { key: 'kvk_kv', label: 'KVK + KV' },
          { key: 'kvk_kvk', label: 'KVK + KVK' },
          { key: 'kv_kv_kvk', label: 'KV + KV + KVK' },
          { key: 'kvk_kv_kvk', label: 'KVK + KV + KVK' }
        ];
        buttonsHTML = heroSkills.map(s => `
          <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #8b5cf6; color: #ffffff;" onclick="document.getElementById('modal-pilih-cantum-kata').style.display = 'none'; if(window.bukaCantumKata) window.bukaCantumKata('${s.key}');">
            ${s.label}
          </button>
        `).join('');
      } else {
        const asasSkills = [
          { key: 'kvkv', label: 'KV + KV' },
          { key: 'v_kv', label: 'V + KV' },
          { key: 'kvkvkv', label: 'KV + KV + KV' },
          { key: 'v_kvk', label: 'V + KVK' }
        ];
        buttonsHTML = asasSkills.map(s => `
          <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #8b5cf6; color: #ffffff;" onclick="document.getElementById('modal-pilih-cantum-kata').style.display = 'none'; if(window.bukaCantumKata) window.bukaCantumKata('${s.key}');">
            ${s.label}
          </button>
        `).join('');
      }
      container.innerHTML = buttonsHTML;
      modal.style.display = 'flex';
    };

    (window as any).bukaCantumKata = (kemahiran?: string) => {
      const selected = kemahiran || 'kvkv';
      (window as any).currentCantumKataKemahiran = selected;
      window.dispatchEvent(new CustomEvent('buka-cantum-kemahiran', { detail: { kemahiran: selected } }));
      if ((window as any).paparSkrin) (window as any).paparSkrin('view-cantum-kata');
    };

    (window as any).showCubaSebutModal = () => {
      const container = document.getElementById('cuba-sebut-sukukata-buttons-container');
      const modal = document.getElementById('modal-pilih-cuba-sebut-sukukata');
      if (!container || !modal) return;
      const isHero = ((window as any).currentPeta === 3);
      let buttonsHTML = '';
      if (isHero) {
        const heroSkills = [
          { key: 'kv_kvk', label: 'KV + KVK' },
          { key: 'kvk_kv', label: 'KVK + KV' },
          { key: 'kvk_kvk', label: 'KVK + KVK' },
          { key: 'kv_kv_kvk', label: 'KV + KV + KVK' },
          { key: 'kvk_kv_kvk', label: 'KVK + KV + KVK' }
        ];
        buttonsHTML = heroSkills.map(s => `
          <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #ff751f; color: #ffffff;" onclick="document.getElementById('modal-pilih-cuba-sebut-sukukata').style.display = 'none'; if(window.bukaCubaSebut) window.bukaCubaSebut('${s.key}', '${s.label}');">
            ${s.label}
          </button>
        `).join('');
      } else {
        const asasSkills = [
          { key: 'kv', label: 'KV' },
          { key: 'kvkv', label: 'KV + KV' },
          { key: 'v_kv', label: 'V + KV' },
          { key: 'kvkvkv', label: 'KV + KV + KV' },
          { key: 'kvk', label: 'KVK' },
          { key: 'v_kvk', label: 'V + KVK' }
        ];
        buttonsHTML = asasSkills.map(s => `
          <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #ff751f; color: #ffffff;" onclick="document.getElementById('modal-pilih-cuba-sebut-sukukata').style.display = 'none'; if(window.bukaCubaSebut) window.bukaCubaSebut('${s.key}', '${s.label}');">
            ${s.label}
          </button>
        `).join('');
      }
      container.innerHTML = buttonsHTML;
      modal.style.display = 'flex';
    };

    (window as any).bukaCubaSebut = (key?: string, label?: string) => {
      setCubaSebutConfig({
        key: key || 'kvkv',
        label: label || 'KV + KV',
        mode: 'sebut'
      });
      setShowCubaSebut(true);
    };

    (window as any).showCubaBacaModal = () => {
      const container = document.getElementById('cuba-baca-buttons-container');
      const modal = document.getElementById('modal-pilih-cuba-baca');
      if (!container || !modal) return;
      const bacaSkills = [
        { key: 'ayat_pendek', label: 'Ayat Pendek' },
        { key: 'ayat_panjang', label: 'Ayat Panjang' },
        { key: 'petikan_1', label: 'Petikan Tahap 1' },
        { key: 'petikan_2', label: 'Petikan Tahap 2' }
      ];
      const buttonsHTML = bacaSkills.map(s => `
        <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #10b981; color: #ffffff;" onclick="document.getElementById('modal-pilih-cuba-baca').style.display = 'none'; if(window.bukaCubaBaca) window.bukaCubaBaca('${s.key}', '${s.label}');">
          ${s.label}
        </button>
      `).join('');
      container.innerHTML = buttonsHTML;
      modal.style.display = 'flex';
    };

    (window as any).bukaCubaBaca = (key?: string, label?: string) => {
      setCubaSebutConfig({
        key: key || 'ayat_pendek',
        label: label || 'Ayat Pendek',
        mode: 'baca'
      });
      setShowCubaSebut(true);
    };
    return () => {
      if (observer) observer.disconnect();
      delete (window as any).showARGuideModal;
      delete (window as any).showARKiraJariGuideModal;
      delete (window as any).setARKiraJariModeReact;
      delete (window as any).showVRGuideModal;
      delete (window as any).bukaBukuCeritaModal;
      window.removeEventListener('buka-cuba-sebut', handleBukaCubaSebutEvent);
    };
  }, []);

  React.useEffect(() => {
    (window as any).bukaSetupModal = (
      mode: "guru" | "ibubapa" | "admin",
      mandatory = false,
    ) => {
      setEditModalError("");
      setIsMandatorySetup(mandatory);
      setEditModalMode(mode);
      if (mode === "admin") {
        (window as any).modAdminAktif = true;
        (window as any).modIbuBapaAktif = false;
        (window as any).modGuruAktif = false;
        setEditAdminNamaSistemTemp(
          (localStorage.getItem("bunyiKataNamaSistem") || "BUNYI KATA APP").toUpperCase(),
        );
        setEditAdminNamaTemp(
          (localStorage.getItem("bunyiKataNamaAdmin") || "IR EDUINNOVATIONS").toUpperCase(),
        );
        setEditAvatarTemp(
          localStorage.getItem("bunyiKataSekolahAvatar") ||
          "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff",
        );
        // Kod admin dipegang pelayan (ADMIN_CODE); jangan prefill dari nilai
        // localStorage basi (cth. "ADMIN#02") yang mengelirukan.
        localStorage.removeItem("bunyiKataKodAdmin");
        setEditKodTemp("");
        setIsEditModalOpen(true);
      } else if (mode === "guru") {
        setEditModalMode("guru");
        (window as any).modAdminAktif = false;
        (window as any).modIbuBapaAktif = false;
        (window as any).modGuruAktif = true;

        const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id;
        const guruEmail = localStorage.getItem("bunyiKataGuruEmail");

        const currentLvl = (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || userAccessLevel;
        const rawPlan = localStorage.getItem("bunyiKataTeacherPlan") || "";
        const isPaidPro = currentLvl === "pro" && rawPlan.toLowerCase() !== "percuma";
        setTeacherCanHaveClass2(isPaidPro);
        setTeacherPlanName(isPaidPro ? (rawPlan || "Bulanan Pro") : "Percuma");

        const sanitizeClassVal = (v: string) => (v || "").trim().toUpperCase();
        const sanitizeCodeVal = (v: string) => (v || "").trim().toUpperCase();

        // Segerakkan data kelas dari pangkalan data jika pro
        if (isPaidPro && (guruId || guruEmail)) {
          syncTeacherClasses(guruId || guruEmail).then((classes) => {
            if (classes && classes.length > 0) {
              const c1 = sanitizeCodeVal(classes[0].kod_kelas || "");
              const k1 = sanitizeClassVal(classes[0].nama_kelas || "");
              const sch = (classes[0].nama_sekolah || "").toUpperCase();
              const gName = (classes[0].nama_guru || "").toUpperCase();
              if (c1) { setEditKodTemp(c1); localStorage.setItem("bunyiKataKodKelas", c1); }
              if (k1) { setEditKelasTemp(k1); localStorage.setItem("bunyiKataNamaKelas", k1); }
              if (sch) { setEditSekolahTemp(sch); localStorage.setItem("bunyiKataNamaSekolah", sch); }
              if (gName) { setEditGuruTemp(gName); localStorage.setItem("pdf_guru", gName); }

              if (classes[1]) {
                const c2 = sanitizeCodeVal(classes[1].kod_kelas || "");
                const k2 = sanitizeClassVal(classes[1].nama_kelas || "");
                if (c2) { setEditKod2Temp(c2); localStorage.setItem("bunyiKataKodKelas2", c2); }
                if (k2) { setEditKelas2Temp(k2); localStorage.setItem("bunyiKataNamaKelas2", k2); }
              }
            }
          }).catch(console.warn);
        }

        setEditSekolahTemp((localStorage.getItem("bunyiKataNamaSekolah") || "").toUpperCase());
        setEditAvatarTemp(
          localStorage.getItem("bunyiKataSekolahAvatar") ||
          "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff",
        );
        setEditKelasTemp(sanitizeClassVal(localStorage.getItem("bunyiKataNamaKelas") || ""));
        setEditGuruTemp((localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "").toUpperCase());
        setEditKodTemp(sanitizeCodeVal(localStorage.getItem("bunyiKataKodKelas") || ""));
        setEditKod2Temp(sanitizeCodeVal(localStorage.getItem("bunyiKataKodKelas2") || ""));
        setEditKelas2Temp(sanitizeClassVal(localStorage.getItem("bunyiKataNamaKelas2") || ""));
        setIsChangingCode1(false);
        setIsChangingCode2(false);
        setIsChangingClassName1(false);
        setIsChangingClassName2(false);
        setIsEditModalOpen(true);
      } else {
        setEditModalMode("ibubapa");
        (window as any).modAdminAktif = false;
        (window as any).modIbuBapaAktif = true;
        (window as any).modGuruAktif = false;

        const parentId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
        if (parentId && typeof syncParentSessionFromFirebase === "function") {
          syncParentSessionFromFirebase(parentId).then((res) => {
            if (res && res.namaKeluarga) {
              setEditNamaKeluargaTemp(res.namaKeluarga.toUpperCase());
            }
          }).catch(console.warn);
        }

        setEditNamaKeluargaTemp(
          (localStorage.getItem("bunyiKataNamaKeluarga") || "").toUpperCase(),
        );
        setEditNamaAnakTemp(
          (
            (window as any).anakTerpilih ||
            localStorage.getItem("ibubapaAnakTerpilih") ||
            ""
          ).toUpperCase(),
        );
        setEditKodTemp(
          (localStorage.getItem("bunyiKataKodKeluarga") || "").toUpperCase(),
        );
        setIsChangingFamilyName(false);
        setIsChangingFamilyCode(false);
        setIsEditModalOpen(true);
      }
    };
    return () => {
      delete (window as any).bukaSetupModal;
    };
  }, []);

  const [isReportDialOpen, setIsReportDialOpen] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showGuruSijilModal, setShowGuruSijilModal] = React.useState(false);
  const [selectedExportPeta, setSelectedExportPeta] = React.useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [exportSchoolInput, setExportSchoolInput] = React.useState(() => localStorage.getItem('bunyiKataNamaSekolah') || localStorage.getItem('pdf_sekolah') || '');
  const [exportClassInput, setExportClassInput] = React.useState(() => localStorage.getItem('bunyiKataNamaKelas') || localStorage.getItem('pdf_kelas') || '');
  const [exportTeacherInput, setExportTeacherInput] = React.useState(() => localStorage.getItem('pdf_guru') || 'MUHAMMAD IZZAT BIN RAZAK');

  React.useEffect(() => {
    (window as any).bukaModalExport = () => {
      setExportSchoolInput(localStorage.getItem('bunyiKataNamaSekolah') || localStorage.getItem('pdf_sekolah') || '');
      setExportClassInput(localStorage.getItem('bunyiKataNamaKelas') || localStorage.getItem('pdf_kelas') || '');
      setExportTeacherInput(localStorage.getItem('pdf_guru') || 'MUHAMMAD IZZAT BIN RAZAK');
      setShowExportModal(true);
    };
    (window as any).bukaModalSijilGuru = () => {
      setShowGuruSijilModal(true);
    };
    return () => {
      delete (window as any).bukaModalExport;
      delete (window as any).bukaModalSijilGuru;
    };
  }, []);
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false);
  const [isModeChoiceOpen, setIsModeChoiceOpen] = React.useState(false);
  const [activePakejCategory, setActivePakejCategory] = React.useState<
    "guru" | "ibubapa"
  >("guru");
  const [activeFaqId, setActiveFaqId] = React.useState<number | null>(null);

  const [promoSecondsLeft, setPromoSecondsLeft] = React.useState<number>(() => {
    if (typeof window === "undefined") return 86400;
    const saved = localStorage.getItem("bunyiKataPromoTimerExpiry");
    const now = Date.now();
    if (saved) {
      const remaining = Math.floor((parseInt(saved, 10) - now) / 1000);
      if (remaining > 0 && remaining <= 86400) {
        return remaining;
      }
    }
    const newExpiry = now + 24 * 60 * 60 * 1000;
    localStorage.setItem("bunyiKataPromoTimerExpiry", newExpiry.toString());
    return 86400;
  });

  React.useEffect(() => {
    // Hanya jalankan timer apabila berada di login-screen supaya App tidak
    // di-render semula setiap saat ketika pengguna sedang dalam permainan.
    if (activeScreen !== "login-screen") return;
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
  }, [activeScreen]);

  const formatPromoTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}j ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const faqData = [
    {
      id: 1,
      question: "Apa itu Aplikasi Bunyi Kata & bagaimana ia berfungsi?",
      answer:
        "Bunyi Kata ialah aplikasi pembelajaran interaktif mengeja dan menyebut suku kata khas untuk murid Prasekolah dan Pemulihan Khas. Ia menggabungkan audio sebutan standard Bahasa Melayu, modul visual gamifikasi, dan laporan prestasi terkini.",
    },
    {
      id: 2,
      question: "Apakah perbezaan Pakej Guru dan Pakej Ibu Bapa?",
      answer:
        "• Pakej Guru: Bulanan Biasa (RM15/bln) = 1 kelas; 3 Bulanan Pro (RM40/3 bulan) & Tahunan Pro (RM69/tahun) = sehingga 2 kelas serentak dengan 2 kod kelas unik, pantauan statistik latihan serta muat turun laporan & sijil prestasi murid.\n• Pakej Ibu Bapa: Bulanan Biasa (RM15/bln) = 1 profil anak; 3 Bulanan Pro (RM40/3 bulan) & Tahunan Pro (RM69/tahun) = sehingga 3 profil anak dengan satu Kod Keluarga Khas, laporan prestasi serta sijil setiap anak.",
    },
    {
      id: 3,
      question: "Bagaimana cara mendaftar dan memulakan akaun?",
      answer:
        "Tekan butang 'Daftar' pada mana-mana pakej. Selepas akaun didaftarkan dan log masuk, anda boleh mendaftar rekod murid/anak serta merta!",
    },
  ];

  const isUserAdmin = React.useCallback(() => {
    try {
      if (typeof window === "undefined") return false;
      // PENTING: 'bunyiKataUserRole' di dalam localStorage TIDAK boleh
      // dijadikan bukti tunggal. Sisa nilai 'admin' daripada sesi lama
      // menyebabkan pelawat awam terperangkap dalam Mod Admin selepas
      // hard refresh. Identiti admin hanya sah jika:
      //   1. bendera sesi RUNTIME masih aktif dalam tab ini, ATAU
      //   2. sesi Firebase Auth semasa benar-benar membawa claim admin
      //      (disemak secara tak segerak oleh semakSesiAdminFirebase()).
      return !!(
        (window as any).modAdminAktif ||
        (window as any).isAdminMode ||
        (window as any).adminClaimDisahkan === true ||
        (typeof document !== "undefined" &&
          document.body?.classList?.contains("admin-mode"))
      );
    } catch (e) {
      return false;
    }
  }, []);

  const [isAdminActive, setIsAdminActive] = React.useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return !!(
        (window as any).modAdminAktif ||
        (window as any).isAdminMode ||
        (window as any).adminClaimDisahkan === true
      );
    } catch (e) {
      return false;
    }
  });

  // Fasa 3: panel affiliate log masuk sendiri (role 'affiliate' dalam token).
  const [isAffiliateActive, setIsAffiliateActive] = React.useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      // Sesi affiliate: role tersimpan ATAU kod affiliate masih ada
      // (menangani muat semula halaman sebelum role ditulis semula).
      return (
        localStorage.getItem("bunyiKataUserRole") === "affiliate" ||
        !!localStorage.getItem("bunyiKataAffiliateKod")
      );
    } catch (e) {
      return false;
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const [userAccessLevel, setUserAccessLevel] = React.useState<"trial" | "pro">(() => {
    if (typeof window !== "undefined") {
      // Hanya sesi admin RUNTIME yang menjamin akses Pro.
      if (
        (window as any).modAdminAktif ||
        (window as any).isAdminMode ||
        (window as any).adminClaimDisahkan === true
      ) {
        return "pro";
      }
      // 'bunyiKataAccessLevel === "pro"' sahaja TIDAK cukup — ia boleh
      // menjadi sisa sesi admin lama. Akses Pro hanya dikekalkan jika ada
      // peranan sebenar yang menyokongnya.
      const roleSemasa = (localStorage.getItem("bunyiKataUserRole") || "").toLowerCase().trim();
      const adaPerananSah =
        roleSemasa === "guru" ||
        roleSemasa === "ibubapa" ||
        roleSemasa === "murid";
      if (
        (window as any).isGuestMode ||
        (window as any).namaMuridAktif === "Tetamu" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial"
      ) {
        return "trial";
      }
      if (!adaPerananSah) {
        return "trial";
      }
      return (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || "trial";
    }
    return "trial";
  });

  // Keadaan mod Percuma untuk paparan lencana "Versi Pro" pada pilihan kad
  // nombor (segerak dengan window.isPercumaMode, termasuk mod affiliate/admin).
  const [isPercumaUI, setIsPercumaUI] = React.useState<boolean>(() =>
    typeof (window as any).isPercumaMode === "function"
      ? !!(window as any).isPercumaMode()
      : false,
  );
  React.useEffect(() => {
    const sync = () => {
      const v =
        typeof (window as any).isPercumaMode === "function"
          ? !!(window as any).isPercumaMode()
          : false;
      setIsPercumaUI(v);
    };
    sync();
    const events = [
      "bunyiKataAccessChanged",
      "admin-mode-change",
      "affiliate-mode-change",
      "guru-mode-change",
      "screen-change",
      "storage",
    ];
    events.forEach((ev) => window.addEventListener(ev, sync));
    const iv = window.setInterval(sync, 1500);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, sync));
      window.clearInterval(iv);
    };
  }, []);

  // Lencana "Versi Pro" (gaya sama seperti avatar Pro) untuk kad nombor mod percuma.
  const proBadge = (
    <div className="versi-pro-overlay">
      <i className="fa-solid fa-lock"></i>
      <span className="versi-pro-chip">Versi Pro</span>
    </div>
  );

  // Semak sama ada kita sedang berada di SKRIN LOG MASUK.
  // Ini penting: sesi Firebase Auth admin yang tersimpan (custom token) di
  // IndexedDB akan dipulihkan oleh onAuthStateChanged pada SETIAP muat semula.
  // Jika kita tidak menyemak skrin, pelawat yang berada di skrin log masuk
  // akan tiba-tiba melihat "MOD ADMIN" + avatar Versi Pro TERBUKA (kerana
  // isEffectiveTrial() -> false apabila isAdminMode/adminClaimDisahkan aktif).
  const sedangDiSkrinLogin = React.useCallback(() => {
    try {
      if (typeof document === "undefined") return false;
      const ls = document.getElementById("login-screen");
      if (ls && ls.classList.contains("active")) return true;
      // Skrin pendaratan awam juga dikira "belum masuk app".
      const landing = document.getElementById("landing-screen");
      if (landing && landing.classList.contains("active")) return true;
      // Jika TIADA skrin aktif (cth. semasa peralihan landing <-> login),
      // anggap kita masih di luar app. Ini menghalang Mod Admin dihidupkan
      // secara tiba-tiba semasa pengguna berpindah dari landing ke log masuk.
      if (!document.querySelector(".screen.active")) return true;
      // Simpanan: lastik URL semasa.
      const path = window.location.pathname.replace(/^\/+/, "");
      return (
        !path ||
        path === "index.html" ||
        path === "login-screen" ||
        path === "landing-screen"
      );
    } catch (e) {
      return false;
    }
  }, []);

  // Buang SEMUA sisa sesi mod admin sementara pengguna berada di skrin log
  // masuk. Ini mencegah: banner "MOD ADMIN", kelas body.admin-mode, dan
  // avatar Versi Pro terbuka akibat token admin yang dipulihkan.
  const bersihkanModAdminDiSkrinLogin = React.useCallback(() => {
    try {
      (window as any).adminClaimDisahkan = false;
      (window as any).isAdminMode = false;
      (window as any).modAdminAktif = false;
      if (typeof document !== "undefined" && document.body) {
        document.body.classList.remove("admin-mode");
      }
      const aNavReset = document.getElementById("admin-sticky-nav");
      if (aNavReset) aNavReset.style.display = "none";
      const tbReset = document.getElementById("teacher-top-banner");
      if (tbReset) tbReset.style.display = "none";
      // Buang sisa localStorage yang boleh menghidupkan semula akses Pro
      // (avatar terbuka) untuk pelawat di skrin log masuk.
      if (localStorage.getItem("bunyiKataUserRole") === "admin") {
        localStorage.removeItem("bunyiKataUserRole");
      }
      const roleMasihSah = ["guru", "ibubapa", "murid", "affiliate"].includes(
        (localStorage.getItem("bunyiKataUserRole") || "").toLowerCase(),
      );
      if (!roleMasihSah && localStorage.getItem("bunyiKataAccessLevel") === "pro") {
        localStorage.removeItem("bunyiKataAccessLevel");
      }
      // Beritahu komponen (cth. PirateAvatar3DSwiper) supaya mengira semula
      // keadaan kunci. Tanpa ini, avatar kekal "Terbuka" sehingga muat semula.
      // PENTING: gunakan 'akses-level-change' sahaja — JANGAN siarkan
      // 'admin-mode-change' di sini kerana pengendalinya (handleAdminSync)
      // memanggil fungsi ini semula -> gelung tak terhingga.
      window.dispatchEvent(new CustomEvent("akses-level-change"));
    } catch (e) {
      console.warn("[App] Gagal segerakkan keadaan akses (akses-level-change):", e);
    }
  }, []);

  React.useEffect(() => {
    // PENTING: Pulihkan identiti admin daripada SESI FIREBASE AUTH sebenar,
    // bukan daripada localStorage. Token admin (claim { admin: true }) hanya
    // dikeluarkan oleh pelayan selepas kod admin yang betul dimasukkan.
    // Jika tiada claim admin, semua sisa sesi admin dalam localStorage
    // dibersihkan supaya pelawat awam tidak terperangkap dalam Mod Admin.
    const bersihkanSisaSesiAdmin = () => {
      try {
        if ((window as any).modAdminAktif || (window as any).isAdminMode) return;
        if (localStorage.getItem("bunyiKataUserRole") === "admin") {
          localStorage.removeItem("bunyiKataUserRole");
        }
        (window as any).adminClaimDisahkan = false;
        (window as any).isAdminMode = false;
        (window as any).modAdminAktif = false;
        if (typeof document !== "undefined" && document.body) {
          document.body.classList.remove("admin-mode");
        }
        const aNav = document.getElementById("admin-sticky-nav");
        if (aNav) aNav.style.display = "none";
        setIsAdminActive(false);
      } catch (e) {
        console.warn("[App] Gagal bersihkan mod admin selepas log keluar:", e);
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        bersihkanSisaSesiAdmin();
        return;
      }
      try {
        const tokenResult = await user.getIdTokenResult();
        const isAdminClaim = tokenResult?.claims?.admin === true;
        if (isAdminClaim) {
          // PENTING: Jangan hidupkan semula Mod Admin secara senyap apabila
          // pengguna sedang berada di SKRIN LOG MASUK. Token admin yang
          // tersimpan akan dipulihkan pada setiap muat semula, dan tanpa
          // semakan ini pelawat melihat banner "MOD ADMIN" serta avatar
          // Versi Pro terbuka di skrin log masuk. Mod admin hanya
          // diaktifkan semula apabila pengguna benar-benar berada dalam
          // aliran selepas log masuk (bukan skrin login), ATAU selepas
          // mereka menaip kod admin semula (-> tetapkanSesiAdminTempatan()).
          if (sedangDiSkrinLogin()) {
            bersihkanModAdminDiSkrinLogin();
            setIsAdminActive(false);
            return;
          }
          (window as any).adminClaimDisahkan = true;
          (window as any).isAdminMode = true;
          (window as any).modAdminAktif = true;
          (window as any).isGuestMode = false;
          (window as any).userAccessLevel = "pro";
          localStorage.setItem("bunyiKataUserRole", "admin");
          localStorage.setItem("bunyiKataAccessLevel", "pro");
          setIsAdminActive(true);
          setUserAccessLevel("pro");
        } else {
          bersihkanSisaSesiAdmin();

          // PEMBETULAN "tidak aktif" palsu pada muat halaman segar:
          // Firebase Auth memulihkan sesi affiliate pada setiap muat semula,
          // tetapi `modAffiliateAktif` / kelas `affiliate-mode` adalah keadaan
          // RUNTIME yang direset. Tanpa pemulihan ini, app menganggap pengguna
          // sebagai TRIAL sehingga mereka log keluar & masuk semula - lalu UI
          // memaparkan keadaan "tidak aktif"/terkunci walaupun admin melihat
          // status "Aktif".
          //
          // Kita hanya memulihkan KONTEKS sesi (role + kelas). Status
          // aktif/gantung SEBENAR disahkan oleh AffiliateDashboard melalui
          // /api/affiliate/me (sumber kebenaran) - bukan daripada cache di sini.
          try {
            const claimKod = String(
              (tokenResult?.claims as any)?.affiliate_kod || "",
            )
              .trim()
              .toUpperCase();
            const roleTersimpan = (
              localStorage.getItem("bunyiKataUserRole") || ""
            ).toLowerCase();
            const adaKodTempatan = !!localStorage.getItem(
              "bunyiKataAffiliateKod",
            );
            const isAffiliateSesi =
              !!claimKod || roleTersimpan === "affiliate" || adaKodTempatan;

            if (isAffiliateSesi && !sedangDiSkrinLogin()) {
              // Tegakkan KONTEKS sesi mod affiliate sahaja (role + kelas +
              // bendera runtime) supaya isEffectiveTrial() tidak tersalah
              // anggap Trial. Kita TIDAK memaksa paparSkrin di sini -
              // navigasi/panel dikendalikan oleh skrin semasa atau oleh
              // AffiliateDashboard itu sendiri. Status aktif/gantung sebenar
              // tetap disahkan melalui /api/affiliate/me.
              localStorage.setItem("bunyiKataUserRole", "affiliate");
              localStorage.setItem("bunyiKataAccessLevel", "pro");
              (window as any).modAffiliateAktif = true;
              (window as any).modGuruAktif = false;
              (window as any).modIbuBapaAktif = false;
              (window as any).modAdminAktif = false;
              (window as any).isAdminMode = false;
              (window as any).isGuestMode = false;
              (window as any).userAccessLevel = "pro";
              if (typeof document !== "undefined" && document.body) {
                document.body.classList.add("affiliate-mode");
                document.body.classList.remove(
                  "teacher-mode",
                  "admin-mode",
                  "parent-mode",
                );
              }
              setIsAffiliateActive(true);
            }
          } catch (affErr) {
            console.warn("[Affiliate] Pemulihan sesi gagal:", affErr);
          }
        }
      } catch (err) {
        console.warn("[Admin] Semakan claim admin gagal:", err);
        bersihkanSisaSesiAdmin();
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const handleAdminSync = (ev?: any) => {
      // Jika peristiwa "admin-mode-change" secara EKSPLISIT mengumumkan
      // isAdmin: true (cth. selepas kod admin yang betul disahkan di skrin
      // log masuk), JANGAN teardown — paparSkrin() belum sempat menukar
      // kelas 'active' pada #login-screen lagi.
      const niatAdminEksplisit = ev?.detail?.isAdmin === true;

      // Langkau apabila berada di SKRIN LOG MASUK: jangan hidupkan semula
      // banner "MOD ADMIN", kelas admin-mode, atau akses Pro. Sebaliknya,
      // pastikan ia dibersihkan supaya avatar Versi Pro kekal TERKUNCI.
      if (!niatAdminEksplisit && sedangDiSkrinLogin()) {
        bersihkanModAdminDiSkrinLogin();
        setIsAdminActive(false);
        return;
      }

      const admin = isUserAdmin();
      if (admin) {
        setIsAdminActive(true);
        setUserAccessLevel("pro");
        (window as any).userAccessLevel = "pro";
        (window as any).modAdminAktif = true;
        (window as any).isAdminMode = true;
        (window as any).isGuestMode = false;
        localStorage.setItem("bunyiKataAccessLevel", "pro");
        localStorage.setItem("bunyiKataUserRole", "admin");
        if (typeof document !== "undefined" && document.body) {
          const bodyClasses = document.body.classList;
          const needsAdminClasses =
            !bodyClasses.contains("admin-mode") ||
            !bodyClasses.contains("teacher-mode") ||
            bodyClasses.contains("parent-mode");

          // Elakkan gelung MutationObserver: jangan tulis atribut class jika
          // body sudah berada dalam keadaan mod admin yang betul.
          if (needsAdminClasses) {
            bodyClasses.add("admin-mode", "teacher-mode");
            bodyClasses.remove("parent-mode");
          }
        }
        const aNav = document.getElementById("admin-sticky-nav");
        if (aNav) aNav.style.display = "flex";
        const tNav = document.getElementById("teacher-sticky-nav");
        if (tNav) tNav.style.display = "none";
        const pNav = document.getElementById("parent-sticky-nav");
        if (pNav) pNav.style.display = "none";
        const topBanner = document.getElementById("teacher-top-banner");
        if (topBanner) topBanner.style.display = "flex";
        return;
      }

      setIsAdminActive(false);

      const isGuest =
        (window as any).isGuestMode ||
        (window as any).userAccessLevel === "trial" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
        (window as any).namaMuridAktif === "Tetamu";

      if (isGuest) {
        setUserAccessLevel("trial");
        (window as any).userAccessLevel = "trial";
        (window as any).isGuestMode = true;
      }
    };
    handleAdminSync();

    window.addEventListener("admin-mode-change", handleAdminSync);
    window.addEventListener("focus", handleAdminSync);

    // PENTING: Gunakan guard 'isHandling' supaya MutationObserver tidak
    // mencetuskan handleAdminSync secara berulang apabila handleAdminSync
    // sendiri mengubah classList body (cth. tambah/buang "admin-mode").
    // Tanpa guard ini, setiap pemanggilan handleAdminSync → tukar class →
    // observer mencetuskan → handleAdminSync lagi → gelung tak terhingga
    // yang membekukan tab (Page Unresponsive).
    let isHandling = false;
    const observer = new MutationObserver((mutations) => {
      if (isHandling) return; // elak re-entrancy
      const bodyClassChanged = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "class",
      );
      if (bodyClassChanged) {
        isHandling = true;
        handleAdminSync();
        // Reset pada frame seterusnya supaya observer tetap aktif
        // untuk perubahan class yang datang dari luar (cth. app-logic.js)
        requestAnimationFrame(() => { isHandling = false; });
      }
    });
    if (typeof document !== "undefined" && document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      window.removeEventListener("admin-mode-change", handleAdminSync);
      window.removeEventListener("focus", handleAdminSync);
      observer.disconnect();
    };
  }, [isUserAdmin]);

  // Fasa 3: sync status panel affiliate daripada peristiwa/log_setempat.
  React.useEffect(() => {
    const syncAffiliate = () => {
      let aktif = false;
      try {
        const role = localStorage.getItem("bunyiKataUserRole");
        const skrinAff = document.getElementById("affiliate-dashboard");
        const adaKod = !!localStorage.getItem("bunyiKataAffiliateKod");
        aktif =
          role === "affiliate" ||
          adaKod ||
          (window as any).modAffiliateAktif === true ||
          (!!skrinAff && skrinAff.classList.contains("active"));
      } catch (e) {
        aktif = false;
      }
      setIsAffiliateActive(aktif);
    };

    const onAffiliateChange = (ev?: any) => {
      if (ev?.detail?.isAffiliate === true) {
        setIsAffiliateActive(true);
        return;
      }
      syncAffiliate();
    };

    syncAffiliate();
    window.addEventListener("affiliate-mode-change", onAffiliateChange);
    window.addEventListener("screen-changed", syncAffiliate);
    window.addEventListener("focus", syncAffiliate);
    window.addEventListener("storage", syncAffiliate);
    return () => {
      window.removeEventListener("affiliate-mode-change", onAffiliateChange);
      window.removeEventListener("screen-changed", syncAffiliate);
      window.removeEventListener("focus", syncAffiliate);
      window.removeEventListener("storage", syncAffiliate);
    };
  }, []);

  // NOTA: state ini mesti diisytihar SEBELUM `rawActivePlan` di bawah,
  // jika tidak akan berlaku ReferenceError (Temporal Dead Zone) & App gagal render.
  const [teacherPlanName, setTeacherPlanName] = React.useState(() => localStorage.getItem("bunyiKataTeacherPlan") || "Percuma");

  const currentRole = localStorage.getItem("bunyiKataUserRole") || "";
  const isAffiliateRole = currentRole === "affiliate" || !!localStorage.getItem("bunyiKataAffiliateKod") || (window as any).modAffiliateAktif || (typeof document !== 'undefined' && document.body?.classList.contains('affiliate-mode'));
  const isStudentRole = currentRole === "murid" || Boolean((window as any).namaMuridAktif && (window as any).namaMuridAktif !== "Tetamu");
  const isParent = currentRole === "ibubapa" || (!currentRole && !!localStorage.getItem("bunyiKataIbubapaEmail"));
  
  const rawActivePlan = isParent
    ? (localStorage.getItem("bunyiKataParentPlan") || "Percuma")
    : (localStorage.getItem("bunyiKataTeacherPlan") || teacherPlanName || "Percuma");

  const isPaidPlan = isAffiliateRole || Boolean(
    rawActivePlan &&
    rawActivePlan.toLowerCase() !== "percuma" &&
    rawActivePlan.toLowerCase() !== "trial" &&
    rawActivePlan.toLowerCase() !== "free" &&
    rawActivePlan.toLowerCase() !== "guest" &&
    rawActivePlan.toLowerCase() !== ""
  );

  const isGuestModeActive = Boolean(
    !isPaidPlan && (
      (window as any).isGuestMode ||
      userAccessLevel === "trial" ||
      localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
      (window as any).namaMuridAktif === "Tetamu"
    )
  );

  const isPlanFree = !isStudentRole && !isPaidPlan && !isAffiliateRole;
  // SUMBER KEBENARAN TUNGGAL: `checkIsTrial()` (fail-closed) dalam app-logic.js
  // menyemak peranan + pelan + sesi admin RUNTIME. React jangan kira semula
  // dari localStorage sendiri — ia akan bercanggah (cth. sisa pelan berbayar
  // atau sisa nama 'Admin' membuat React fikir Pro sedangkan runtime kata
  // Trial → peta 2/3/4 nampak terbuka tetapi tekan keluar modal pakej).
  // Gunakan versi kanonik bila tersedia; fallback kepada pengiraan tempatan
  // (fail-closed = trial) hanya sebelum app-logic.js dimuatkan.
  const [efektifTrialState, setEfektifTrialState] = React.useState<boolean>(() => {
    if (isAffiliateRole) return false;
    if (typeof (window as any).checkIsTrial === "function") {
      try { return (window as any).checkIsTrial(); } catch (e) {
        console.warn("[App] checkIsTrial gagal, guna fallback tempatan:", e);
      }
    }
    return isGuestModeActive || (isPlanFree && !isUserAdmin() && !isAdminActive);
  });

  const isEffectiveTrial = efektifTrialState;
  const isEffectivePro = !isEffectiveTrial;

  // Fasa 1.5: papar banner luput langganan apabila app-logic.js sudah sedia.
  // Dipanggil selepas semakan pelayan & selepas app-logic.js dimuatkan, kerana
  // fungsi paparBannerLuput wujud dalam app-logic.js (bukan bundle React).
  const cubaPaparBannerLuput = React.useCallback(() => {
    const hasil = (window as any).__hasilLuputTerakhir;
    if (!hasil) return;
    const papar = (window as any).paparBannerLuput;
    if (typeof papar === "function") {
      try { papar(hasil); } catch (e) {
        console.warn("[App] Gagal papar banner luput:", e);
      }
    }
  }, []);

  // Segerakkan semula bila sesi/akses bertukar (admin-mode-change, fokus,
  // userAccessLevel berubah, atau sebarang event akses-level-change).
  React.useEffect(() => {
    const sync = () => {
      let trialNow = false;
      const affNow = (localStorage.getItem("bunyiKataUserRole") || "").toLowerCase().trim() === "affiliate" ||
        (window as any).modAffiliateAktif ||
        (typeof document !== "undefined" && document.body?.classList.contains("affiliate-mode"));
      if (affNow) {
        setEfektifTrialState(false);
        return;
      }
      if (typeof (window as any).checkIsTrial === "function") {
        try { trialNow = Boolean((window as any).checkIsTrial()); } catch (e) { trialNow = false; }
      } else {
        trialNow = isGuestModeActive || (isPlanFree && !isUserAdmin() && !isAdminActive);
      }
      setEfektifTrialState(trialNow);
    };
    sync();
    window.addEventListener("admin-mode-change", sync);
    window.addEventListener("affiliate-mode-change", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("akses-level-change", sync);
    // 'storage' — perubahan localStorage dari tab lain
    window.addEventListener("storage", sync);
    // Apabila userAccessLevel berubah (setUserAccessLevel), refresh juga
    return () => {
      window.removeEventListener("admin-mode-change", sync);
      window.removeEventListener("affiliate-mode-change", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("akses-level-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [isGuestModeActive, isPlanFree, isAdminActive, userAccessLevel, isUserAdmin, isAffiliateRole]);

  React.useEffect(() => {
    // PENTING: app-logic.js mentakrifkan versi kanonikal `isEffectiveTrial`
    // yang menyemak peranan + pelan sebenar. Jika kita tindih ia di sini,
    // dua sumber kebenaran akan bertelagah dan avatar Versi Pro boleh
    // terbuka secara tidak menentu. Jadi kita hanya tetapkan versi rizab
    // SEBELUM app-logic.js selesai dimuatkan.
    if (typeof (window as any).bolehAksesSkrin === "function") {
      // app-logic.js sudah sedia — jangan tindih.
      return;
    }
    (window as any).isEffectiveTrial = () => isEffectiveTrial;
    (window as any).isEffectivePro = () => isEffectivePro;
  }, [isEffectiveTrial, isEffectivePro]);

  const effectiveAccessLevel: "trial" | "pro" = isEffectivePro ? "pro" : "trial";
  const [isEntryChoiceModalOpen, setIsEntryChoiceModalOpen] = React.useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = React.useState(false);
  const [legalModalTab, setLegalModalTab] = React.useState<"terma" | "privasi">("terma");
  const [isProPricingModalOpen, setIsProPricingModalOpen] = React.useState(false);
  const [proPricingTab, setProPricingTab] = React.useState<"guru" | "ibubapa">("guru");
  const [joinCode, setJoinCode] = React.useState("");
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [pendingLoginMode, setPendingLoginMode] = React.useState("");
  const [authModalTab, setAuthModalTab] = React.useState<"masuk" | "login">("login");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = React.useState(false);
  const [regGuruNama, setRegGuruNama] = React.useState("");
  const [regGuruSekolah, setRegGuruSekolah] = React.useState("");
  const [regNamaKeluarga, setRegNamaKeluarga] = React.useState("");
  const [authModalError, setAuthModalError] = React.useState("");
  const [isAuthLoading, setIsAuthLoading] = React.useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = React.useState("");
  const [editKodTemp, setEditKodTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataKodKelas") || "").trim().toUpperCase()
  );
  const [editKelasTemp, setEditKelasTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaKelas") || "").trim().toUpperCase()
  );
  const [editSekolahTemp, setEditSekolahTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaSekolah") || "").trim().toUpperCase()
  );
  const [editAvatarTemp, setEditAvatarTemp] = React.useState(
    () => localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"
  );
  const [editGuruTemp, setEditGuruTemp] = React.useState(
    () => (localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "").trim().toUpperCase()
  );
  const [editNamaKeluargaTemp, setEditNamaKeluargaTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaKeluarga") || "").trim().toUpperCase(),
  );
  const [editNamaAnakTemp, setEditNamaAnakTemp] = React.useState("");
  const [editAdminNamaSistemTemp, setEditAdminNamaSistemTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaSistem") || "BUNYI KATA APP").toUpperCase(),
  );
  const [editAdminNamaTemp, setEditAdminNamaTemp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaAdmin") || "IR EDUINNOVATIONS").toUpperCase(),
  );
  const [isMandatorySetup, setIsMandatorySetup] = React.useState(false);
  const [editModalError, setEditModalError] = React.useState("");
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [newPasswordInput, setNewPasswordInput] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = React.useState(false);
  const [passwordToast, setPasswordToast] = React.useState("");
  const [editKod2Temp, setEditKod2Temp] = React.useState(
    () => (localStorage.getItem("bunyiKataKodKelas2") || "").trim().toUpperCase()
  );
  const [editKelas2Temp, setEditKelas2Temp] = React.useState(
    () => (localStorage.getItem("bunyiKataNamaKelas2") || "").trim().toUpperCase()
  );
  const [isChangingCode1, setIsChangingCode1] = React.useState(false);
  const [newCode1Input, setNewCode1Input] = React.useState("");
  const [isChangingCode2, setIsChangingCode2] = React.useState(false);
  const [newCode2Input, setNewCode2Input] = React.useState("");
  const [teacherCanHaveClass2, setTeacherCanHaveClass2] = React.useState(() => {
    const accessLvl = (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || "trial";
    const rawPlan = localStorage.getItem("bunyiKataTeacherPlan") || "";
    return accessLvl === "pro" && rawPlan.toLowerCase() !== "percuma";
  });
  const [activeUrusKodKelas, setActiveUrusKodKelas] = React.useState(() => localStorage.getItem("bunyiKataKodKelas") || "");
  const [isEditingUrusKod, setIsEditingUrusKod] = React.useState(false);
  const [isChangingFamilyCode, setIsChangingFamilyCode] = React.useState(false);
  const [newFamilyCodeInput, setNewFamilyCodeInput] = React.useState("");
  const [isChangingAdminCode, setIsChangingAdminCode] = React.useState(false);
  const [newAdminCodeInput, setNewAdminCodeInput] = React.useState("");
  const [isChangingClassName1, setIsChangingClassName1] = React.useState(false);
  const [newClassName1Input, setNewClassName1Input] = React.useState("");
  const [isChangingClassName2, setIsChangingClassName2] = React.useState(false);
  const [newClassName2Input, setNewClassName2Input] = React.useState("");
  const [isChangingFamilyName, setIsChangingFamilyName] = React.useState(false);
  const [newFamilyNameInput, setNewFamilyNameInput] = React.useState("");

  React.useEffect(() => {
    const accessLvl = (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || userAccessLevel;
    const rawPlan = localStorage.getItem("bunyiKataTeacherPlan") || "";
    const isPro = accessLvl === "pro" && rawPlan.toLowerCase() !== "percuma";
    setTeacherCanHaveClass2(isPro);

    const k1 = (localStorage.getItem("bunyiKataNamaKelas") || "").trim().toUpperCase();
    const c1 = (localStorage.getItem("bunyiKataKodKelas") || "").trim().toUpperCase();
    const k2 = (localStorage.getItem("bunyiKataNamaKelas2") || "").trim().toUpperCase();
    const c2 = (localStorage.getItem("bunyiKataKodKelas2") || "").trim().toUpperCase();
    const fam = (localStorage.getItem("bunyiKataNamaKeluarga") || "").trim().toUpperCase();
    const gName = (localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "").trim().toUpperCase();
    const sch = (localStorage.getItem("bunyiKataNamaSekolah") || "").trim().toUpperCase();

    if (k1) setEditKelasTemp(k1);
    if (c1) setEditKodTemp(c1);
    if (k2) setEditKelas2Temp(k2);
    if (c2) setEditKod2Temp(c2);
    if (fam) setEditNamaKeluargaTemp(fam);
    if (gName) setEditGuruTemp(gName);
    if (sch) setEditSekolahTemp(sch);
  }, [userAccessLevel]);

  // Helper mendapatkan maklumat lencana baki langganan (Guru & Ibu Bapa)
  const getSubscriptionBadgeInfo = (role: "guru" | "ibubapa") => {
    const accessLvl = isEffectiveTrial ? "trial" : "pro";
    const planName = role === "guru"
      ? (localStorage.getItem("bunyiKataTeacherPlan") || teacherPlanName || "Percuma")
      : (localStorage.getItem("bunyiKataParentPlan") || "Percuma");
    const tarikhTamatStr = localStorage.getItem("bunyiKataTarikhTamat") || (window as any).currentUser?.tarikh_tamat;

    const isPlanPaid = Boolean(
      planName &&
      planName.toLowerCase() !== "percuma" &&
      planName.toLowerCase() !== "trial" &&
      planName.toLowerCase() !== "free" &&
      (!tarikhTamatStr || new Date(tarikhTamatStr) > new Date())
    );

    const isFree = (!isPlanPaid && accessLvl === "trial") || planName.toLowerCase() === "percuma";
    if (isFree) {
      return {
        text: "Percuma",
        color: "#fbbf24",
        bg: "rgba(251, 191, 36, 0.25)",
        border: "rgba(251, 191, 36, 0.65)",
        icon: "fa-solid fa-gift",
        isFree: true,
      };
    }

    let days: number | null = null;
    if (tarikhTamatStr) {
      const diffMs = new Date(tarikhTamatStr).getTime() - Date.now();
      days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    if (days === null || isNaN(days)) {
      const uId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id;
      const uEmail = (role === "guru"
        ? (localStorage.getItem("bunyiKataGuruEmail") || (window as any).currentUser?.email)
        : (localStorage.getItem("bunyiKataIbubapaEmail") || localStorage.getItem("bunyiKataParentEmail") || (window as any).currentUser?.email)
      )?.toLowerCase();

      const storageKey = role === "guru" ? "bunyiKataAdminTeachers" : "bunyiKataAdminParents";
      try {
        const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const found = list.find((item: any) =>
          (uId && item.id === uId) ||
          (uEmail && item.email && item.email.toLowerCase() === uEmail)
        );
        if (found && typeof found.bakiHari === "number") {
          days = found.bakiHari;
        }
      } catch (e) {
        console.warn("[App] Gagal baca baki hari daripada cache admin:", e);
      }
    }

    if (days === null || isNaN(days)) {
      const currentU = (window as any).currentUser;
      if (currentU && typeof currentU.bakiHari === "number") {
        days = currentU.bakiHari;
      }
    }

    if (days === null || isNaN(days)) {
      if (planName.includes("1 Tahun")) days = 365;
      else if (planName.includes("6 Bulan")) days = 180;
      else if (planName.includes("3 Bulan")) days = 90;
      else days = 30;
    }

    if (days <= 0) {
      return {
        text: "Tamat Tempoh",
        color: "#f87171",
        bg: "rgba(239, 68, 68, 0.25)",
        border: "rgba(239, 68, 68, 0.65)",
        icon: "fa-solid fa-clock-rotate-left",
        isFree: false,
      };
    }

    let displayText = `${days} Hari Lagi`;
    if (days >= 365) {
      const yrs = Math.floor(days / 365);
      displayText = `${yrs} Tahun Lagi`;
    } else if (days >= 60) {
      const mths = Math.floor(days / 30);
      displayText = `${mths} Bulan Lagi`;
    }

    return {
      text: displayText,
      color: "#34d399",
      bg: "rgba(16, 185, 129, 0.25)",
      border: "rgba(52, 211, 153, 0.65)",
      icon: "fa-solid fa-crown",
      isFree: false,
    };
  };

  // Helper segerak Nama Kelas 1 ke Storan & Firebase
  const handleSaveClassName1 = async (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) {
      window.notify("Sila masukkan nama kelas 1!");
      return;
    }
    setEditKelasTemp(clean);
    localStorage.setItem("bunyiKataNamaKelas", clean);

    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem("bunyiKataDaftarKelas") || "[]");
    } catch (e) {
      console.warn("[App] Gagal parse bunyiKataDaftarKelas (kelas 1):", e);
    }
    if (!list.includes(clean)) {
      if (list.length > 0) list[0] = clean;
      else list.push(clean);
      localStorage.setItem("bunyiKataDaftarKelas", JSON.stringify(list));
    }

    const kod = editKodTemp || localStorage.getItem("bunyiKataKodKelas") || "";
    const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    const namaGuru = editGuruTemp || localStorage.getItem("pdf_guru") || "";
    const namaSekolah = editSekolahTemp || localStorage.getItem("bunyiKataNamaSekolah") || "";
    if (kod) {
      try {
        await saveClassToFirebase({
          kodKelas: kod,
          namaKelas: clean,
          namaSekolah,
          namaGuru,
          guruId,
        });
      } catch (e) {
        console.warn("Ralat simpan kelas 1 ke Firebase:", e);
      }
    }

    const el = document.getElementById("guru-dashboard-nama-kelas-title");
    if (el) el.innerText = clean;
    if (typeof (window as any).kemaskiniSemuaDropdownKelas === "function") {
      (window as any).kemaskiniSemuaDropdownKelas();
    }
    if (typeof (window as any).renderSenaraiMuridUrus === "function") {
      (window as any).renderSenaraiMuridUrus();
    }
    setIsChangingClassName1(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Nama Kelas 1 berjaya ditetapkan kepada "${clean}".`);
    }
  };

  // Helper segerak Kod Kelas 1 ke Storan & Firebase
  const handleSaveClassCode1 = async (code: string) => {
    const clean = code.trim().toUpperCase();
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(clean);
    if (clean.length !== 8 || !hasSymbol) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast(
          "Format Kod Tidak Sah",
          "Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#01)!",
          "warning"
        );
      } else {
        window.notify("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#01)!");
      }
      return;
    }
    const oldCode = localStorage.getItem("bunyiKataKodKelas") || "";
    if (clean !== oldCode) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "guru", undefined, "kelas1");
      if (collision.isUsed) {
        const msg = `Kod “${clean}” tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          window.notify(msg);
        }
        return;
      }
    }

    setEditKodTemp(clean);
    localStorage.setItem("bunyiKataKodKelas", clean);
    registerCodeInRegistry(clean, "guru");

    const namaKelas = editKelasTemp || localStorage.getItem("bunyiKataNamaKelas") || "";
    const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    const namaGuru = editGuruTemp || localStorage.getItem("pdf_guru") || "";
    const namaSekolah = editSekolahTemp || localStorage.getItem("bunyiKataNamaSekolah") || "";
    try {
      if (oldCode && oldCode !== clean) {
        await updateClassInFirebase({
          oldKodKelas: oldCode,
          newKodKelas: clean,
          namaKelas,
          namaSekolah,
          namaGuru,
          guruId,
        });
      } else {
        await saveClassToFirebase({
          kodKelas: clean,
          namaKelas,
          namaSekolah,
          namaGuru,
          guruId,
        });
      }
    } catch (e) {
      console.warn("Ralat simpan kod kelas 1 ke Firebase:", e);
    }

    const kodGuru = document.getElementById("guru-dashboard-kod-kelas-title");
    if (kodGuru) kodGuru.innerText = clean;
    setIsChangingCode1(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Kod Kelas 1 berjaya ditetapkan kepada “${clean}”.`);
    }
  };

  // Helper segerak Nama Kelas 2 ke Storan & Firebase
  const handleSaveClassName2 = async (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Nama Kelas Diperlukan", "Sila masukkan nama kelas 2!", "warning");
      } else {
        window.notify("Sila masukkan nama kelas 2!");
      }
      return;
    }
    setEditKelas2Temp(clean);
    localStorage.setItem("bunyiKataNamaKelas2", clean);

    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem("bunyiKataDaftarKelas") || "[]");
    } catch (e) {
      console.warn("[App] Gagal parse bunyiKataDaftarKelas (kelas 2):", e);
    }
    if (!list.includes(clean)) {
      if (list.length >= 2) list[1] = clean;
      else list.push(clean);
      localStorage.setItem("bunyiKataDaftarKelas", JSON.stringify(list));
    }

    const kod2 = editKod2Temp || localStorage.getItem("bunyiKataKodKelas2") || "";
    const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    const namaGuru = editGuruTemp || localStorage.getItem("pdf_guru") || "";
    const namaSekolah = editSekolahTemp || localStorage.getItem("bunyiKataNamaSekolah") || "";
    if (kod2) {
      try {
        await saveClassToFirebase({
          kodKelas: kod2,
          namaKelas: clean,
          namaSekolah,
          namaGuru,
          guruId,
        });
      } catch (e) {
        console.warn("Ralat simpan kelas 2 ke Firebase:", e);
      }
    }

    if (typeof (window as any).kemaskiniSemuaDropdownKelas === "function") {
      (window as any).kemaskiniSemuaDropdownKelas();
    }
    if (typeof (window as any).renderSenaraiMuridUrus === "function") {
      (window as any).renderSenaraiMuridUrus();
    }
    setIsChangingClassName2(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Nama Kelas 2 berjaya ditetapkan kepada “${clean}”.`);
    }
  };

  // Helper segerak Kod Kelas 2 ke Storan & Firebase
  const handleSaveClassCode2 = async (code: string) => {
    const clean = code.trim().toUpperCase();
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(clean);
    if (clean.length !== 8 || !hasSymbol) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast(
          "Format Kod Tidak Sah",
          "Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#02)!",
          "warning"
        );
      } else {
        window.notify("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#02)!");
      }
      return;
    }
    const oldCode2 = localStorage.getItem("bunyiKataKodKelas2") || "";
    if (clean !== oldCode2) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "guru", undefined, "kelas2");
      if (collision.isUsed) {
        const msg = `Kod “${clean}” tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          window.notify(msg);
        }
        return;
      }
    }

    setEditKod2Temp(clean);
    localStorage.setItem("bunyiKataKodKelas2", clean);
    registerCodeInRegistry(clean, "guru");

    const namaKelas2 = editKelas2Temp || localStorage.getItem("bunyiKataNamaKelas2") || "";
    const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    const namaGuru = editGuruTemp || localStorage.getItem("pdf_guru") || "";
    const namaSekolah = editSekolahTemp || localStorage.getItem("bunyiKataNamaSekolah") || "";
    try {
      if (oldCode2 && oldCode2 !== clean) {
        await updateClassInFirebase({
          oldKodKelas: oldCode2,
          newKodKelas: clean,
          namaKelas: namaKelas2,
          namaSekolah,
          namaGuru,
          guruId,
        });
      } else {
        await saveClassToFirebase({
          kodKelas: clean,
          namaKelas: namaKelas2,
          namaSekolah,
          namaGuru,
          guruId,
        });
      }
    } catch (e) {
      console.warn("Ralat simpan kod kelas 2 ke Firebase:", e);
    }

    setIsChangingCode2(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Kod Kelas 2 berjaya ditetapkan kepada “${clean}”.`);
    }
  };

  // Helper segerak Nama Keluarga ke Storan & Firebase
  const handleSaveFamilyName = async (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Nama Keluarga Diperlukan", "Sila masukkan nama keluarga!", "warning");
      } else {
        window.notify("Sila masukkan nama keluarga!");
      }
      return;
    }
    setEditNamaKeluargaTemp(clean);
    localStorage.setItem("bunyiKataNamaKeluarga", clean);

    const kod = editKodTemp || localStorage.getItem("bunyiKataKodKeluarga") || "";
    const parentId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    try {
      if (typeof updateParentFamilyAndNameInFirebase === "function") {
        await updateParentFamilyAndNameInFirebase({
          namaKeluarga: clean,
          parentIdOrEmail: parentId,
          kodKeluarga: kod,
        });
      } else if (kod && typeof saveFamilyToFirebase === "function") {
        await saveFamilyToFirebase({
          kodKeluarga: kod,
          namaKeluarga: clean,
          parentId,
        });
      }
    } catch (e) {
      console.warn("Ralat simpan keluarga ke Firebase:", e);
    }

    const el = document.getElementById("ibubapa-dashboard-nama-keluarga-title");
    if (el) el.innerText = clean;
    const el2 = document.getElementById("ibubapa-nama-keluarga-title");
    if (el2) el2.innerText = clean;
    setIsChangingFamilyName(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Nama Keluarga berjaya ditetapkan kepada “${clean}”.`);
    }
  };

  // Helper segerak Kod Keluarga ke Storan & Firebase
  const handleSaveFamilyCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(clean);
    if (clean.length !== 8 || !hasSymbol) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast(
          "Format Kod Tidak Sah",
          "Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: FAM@2026)!",
          "warning"
        );
      } else {
        window.notify("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: FAM@2026)!");
      }
      return;
    }
    const oldCode = localStorage.getItem("bunyiKataKodKeluarga") || "";
    if (clean !== oldCode) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "ibubapa");
      if (collision.isUsed) {
        const msg = `Kod “${clean}” tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          window.notify(msg);
        }
        return;
      }
    }

    setEditKodTemp(clean);
    localStorage.setItem("bunyiKataKodKeluarga", clean);
    registerCodeInRegistry(clean, "ibubapa");

    const namaKeluarga = editNamaKeluargaTemp || localStorage.getItem("bunyiKataNamaKeluarga") || "";
    const parentId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
    try {
      await saveFamilyToFirebase({
        kodKeluarga: clean,
        namaKeluarga,
        parentId,
        oldKodKeluarga: oldCode,
      });
    } catch (e) {
      console.warn("Ralat simpan kod keluarga ke Firebase:", e);
    }

    setIsChangingFamilyCode(false);
    if (typeof (window as any).showAppToast === "function") {
      (window as any).showAppToast("Berjaya Disimpan", `Kod Keluarga berjaya ditetapkan kepada “${clean}”.`);
    }
  };

  // Helper untuk elakkan pertindihan kod antara Mod Guru, Ibu Bapa & Admin
  const checkIsCodeAlreadyUsed = (
    newCode: string,
    currentRole: "guru" | "ibubapa" | "admin",
  ): { isUsed: boolean; usedBy?: string } => {
    const code = (newCode || "").trim().toUpperCase();
    if (!code) return { isUsed: false };

    const kGuru = (localStorage.getItem("bunyiKataKodKelas") || "").toUpperCase();
    const kGuru2 = (localStorage.getItem("bunyiKataKodKelas2") || "").toUpperCase();
    const kFam = (localStorage.getItem("bunyiKataKodKeluarga") || "").toUpperCase();

    // Semak sekatan kod sistem / admin.
    // Kod admin sebenar kekal RAHSIA di pelayan (ADMIN_CODE) dan tidak pernah
    // disimpan di pelayar — kita hanya tolak kod yang menyerupai kod sistem.
    if (currentRole !== "admin") {
      if (SISTEM_KOD_TERLARANG.has(code)) {
        return { isUsed: true, usedBy: "Akaun Admin" };
      }
    }

    // Semak pertembungan dengan Kod Kelas Guru yang sedia ada
    if (currentRole !== "guru") {
      if ((kGuru && code === kGuru) || (kGuru2 && code === kGuru2)) {
        return { isUsed: true, usedBy: "Mod Guru (Kod Kelas)" };
      }
    } else {
      if (kFam && code === kFam) {
        return { isUsed: true, usedBy: "Mod Ibu Bapa (Kod Keluarga)" };
      }
    }

    // Semak pertembungan dengan Kod Keluarga Ibu Bapa yang sedia ada
    if (currentRole !== "ibubapa") {
      if (kFam && code === kFam) {
        return { isUsed: true, usedBy: "Mod Ibu Bapa (Kod Keluarga)" };
      }
    } else {
      if ((kGuru && code === kGuru) || (kGuru2 && code === kGuru2)) {
        return { isUsed: true, usedBy: "Mod Guru (Kod Kelas)" };
      }
    }

    // Semak pendaftaran rekod tersimpan
    try {
      const reg = JSON.parse(localStorage.getItem("bunyiKataUsedCodesRegistry") || "{}");
      if (reg[code] && reg[code] !== currentRole) {
        const roleLabel =
          reg[code] === "guru"
            ? "Mod Guru (Kod Kelas)"
            : reg[code] === "ibubapa"
              ? "Mod Ibu Bapa (Kod Keluarga)"
              : "Akaun Admin";
        return { isUsed: true, usedBy: roleLabel };
      }
    } catch (e) {
      console.warn("Registry parse error", e);
    }

    return { isUsed: false };
  };

  const registerCodeInRegistry = (code: string, role: "guru" | "ibubapa" | "admin") => {
    try {
      const reg = JSON.parse(localStorage.getItem("bunyiKataUsedCodesRegistry") || "{}");
      // Buang kod lama milik role ini jika ada
      Object.keys(reg).forEach((k) => {
        if (reg[k] === role) delete reg[k];
      });
      reg[code.trim().toUpperCase()] = role;
      localStorage.setItem("bunyiKataUsedCodesRegistry", JSON.stringify(reg));
    } catch (e) {
      console.warn("Failed to register code", e);
    }
  };

  const validateKodFormat = (code: string) => {
    const trimmed = (code || "").trim();
    if (trimmed.length !== 8) {
      return "Kod mestilah mengandungi tepat 8 aksara.";
    }
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(trimmed);
    if (!hasSymbol) {
      return "Kod mestilah mengandungi sekurang-kurangnya satu simbol (contoh: #, @, -, _).";
    }
    return null;
  };
  const [showOnboardingAvatar, setShowOnboardingAvatar] = React.useState(false);
  const [onboardingSelectedAvatar, setOnboardingSelectedAvatar] =
    React.useState(
      "/images/avatar/avatar1.png",
    );
  const [feedbackNama, setFeedbackNama] = React.useState("");
  const [feedbackMesej, setFeedbackMesej] = React.useState("");
  const [feedbackStatus, setFeedbackStatus] = React.useState("");

  const hantarFeedback = async () => {
    const rawNama = (
      feedbackNama ||
      (window as any).namaMuridAktif ||
      localStorage.getItem("bunyiKataCurrentMurid") ||
      "Pengguna"
    ).trim();
    const mesej = feedbackMesej.trim();
    if (!mesej) return;

    try {
      if (typeof submitUserFeedback === "function") {
        await submitUserFeedback({
          namaPengguna: rawNama,
          peranan: "Pengguna",
          rating: 5,
          komen: mesej,
        });
      }
    } catch (err) {
      console.warn("Feedback submit notice:", err);
    }

    setFeedbackMesej("");
    setFeedbackStatus("success");
    setTimeout(() => setFeedbackStatus(""), 4000);

    // Kemas kini paparan admin jika dibuka
    if (typeof (window as any).renderAdminTable === "function") {
      try {
        (window as any).renderAdminTable("feedback");
      } catch (e) {
        console.warn("[App] renderAdminTable(feedback) gagal:", e);
      }
    }
  };

  useEffect(() => {
    // Bersihkan sebarang sisa maklum balas dummy lama daripada storan tempatan
    try {
      localStorage.removeItem("bunyi_kata_feedbacks");
    } catch (e) {
      console.warn("[App] Gagal buang bunyi_kata_feedbacks lama:", e);
    }

    (window as any).isUserAdmin = isUserAdmin;
    (window as any).userAccessLevel = isEffectivePro ? "pro" : userAccessLevel;
    (window as any).setUserAccessLevel = (lvl: "trial" | "pro") => {
      setUserAccessLevel(lvl);
      localStorage.setItem("bunyiKataAccessLevel", lvl);
      (window as any).userAccessLevel = isUserAdmin() ? "pro" : lvl;
    };
    (window as any).openPakejProModal = (tab?: "guru" | "ibubapa" | "affiliate") => {
      const activeTab = tab || ((window as any).modIbuBapaAktif ? "ibubapa" : "guru");
      setProPricingTab(activeTab);
      setIsProPricingModalOpen(true);
    };
    (window as any).bukaModalAppInfo = (mode?: string) => {
      const modal = document.getElementById("app-info-modal");
      if (modal) modal.style.display = "flex";
      (window as any).pendingAppInfoMode = mode || "";
      const teruskanBtn = document.getElementById("app-info-teruskan-btn");
      const copyrightEl = document.getElementById("app-info-copyright");
      const feedbackSec = document.getElementById("app-info-feedback-section");
      if (mode) {
        if (teruskanBtn) teruskanBtn.style.display = "flex";
        if (copyrightEl) copyrightEl.style.display = "block";
        if (feedbackSec) feedbackSec.style.display = "none";
      } else {
        if (teruskanBtn) teruskanBtn.style.display = "none";
        if (copyrightEl) copyrightEl.style.display = "none";
        if (feedbackSec) feedbackSec.style.display = "block";
      }
    };
    (window as any).tutupModalAppInfo = () => {
      const modal = document.getElementById("app-info-modal");
      if (modal) modal.style.display = "none";
      (window as any).pendingAppInfoMode = "";
    };
    (window as any).bukaModalInfoLencana = () => {
      const modal = document.getElementById("modal-info-lencana");
      if (modal) {
        modal.style.display = "flex";
        if (typeof (window as any).playBubble === "function") {
          (window as any).playBubble();
        }
      }
    };
    (window as any).tutupModalInfoLencana = () => {
      const modal = document.getElementById("modal-info-lencana");
      if (modal) {
        modal.style.display = "none";
        if (typeof (window as any).playBubble === "function") {
          (window as any).playBubble();
        }
      }
    };
    // Initial active screen on startup if none is active
    const landingEl = document.getElementById("landing-screen") || document.getElementById("login-screen");
    if (landingEl && !document.querySelector(".screen.active")) {
      landingEl.classList.add("active");
    }
  }, []);

  useEffect(() => {
    // Inisialisasi langganan Firebase Realtime dan segerakkan data awal
    try {
      initFirebaseRealtimeSubscriptions();
      fetchAdminDataFromFirebase();

      // Muatkan sejarah langganan (nod `orders` + profil berbayar)
      if (typeof (window as any).getSubscriptionHistory === "function") {
        (window as any).getSubscriptionHistory().catch((e: any) =>
          console.warn("Sejarah langganan notice:", e)
        );
      }

      const uid = localStorage.getItem("bunyiKataUserId");
      const role = localStorage.getItem("bunyiKataUserRole");
      const pEmail = localStorage.getItem("bunyiKataIbubapaEmail") || localStorage.getItem("bunyiKataParentEmail");
      const gEmail = localStorage.getItem("bunyiKataGuruEmail");

      if (role === "guru" || gEmail) {
        syncTeacherSessionFromFirebase(uid || gEmail).catch(console.warn);
      }
      if (role === "ibubapa" || pEmail) {
        syncParentSessionFromFirebase(uid || pEmail).then((res) => {
          if (res && res.namaKeluarga) {
            setEditNamaKeluargaTemp(res.namaKeluarga.toUpperCase());
          }
        }).catch(console.warn);
      }
    } catch (e) {
      console.warn('Realtime init notice:', e);
    }

    // Fasa 1.2: semak luput langganan melalui pelayan (auto-expiry).
    const uidSemak = localStorage.getItem("bunyiKataUserId");
    const adaSesi = Boolean(uidSemak) && !isUserAdmin();
    if (adaSesi) {
      semakLuputLanggananFirebase()
        .then((hasil) => {
          if (!hasil.sah) return; // pelayan tak dapat dihubungi - jangan sentuh
          if (hasil.luput) {
            // Pelayan sudah menurunkan profil ke Percuma. Selaraskan UI.
            try {
              localStorage.removeItem("bunyiKataTarikhTamat");
              localStorage.setItem("bunyiKataTeacherPlan", "Percuma");
              localStorage.setItem("bunyiKataParentPlan", "Percuma");
              localStorage.setItem("bunyiKataAccessLevel", "trial");
            } catch (e) {
              console.warn("[App] Gagal set semula storan langganan ke trial:", e);
            }
            setUserAccessLevel("trial");
            try { window.dispatchEvent(new CustomEvent("akses-level-change")); } catch (e) {
              console.warn("[App] Gagal sebar akses-level-change selepas luput:", e);
            }
          }
          // Fasa 1.5: papar banner amaran (luput atau hampir luput).
          // app-logic.js mungkin belum selesai dimuatkan, jadi kita cuba semula
          // selepas ia dimuatkan (lihat script.onload di bawah).
          (window as any).__hasilLuputTerakhir = hasil;
          cubaPaparBannerLuput();
        })
        .catch(() => {});
    }

    // We will load the logic here or via external file
    if (document.getElementById("app-logic-script")) return;
    // PENTING: Gunakan versi build yang stabil (bukan Date.now()) supaya
    // pelayar boleh menggunakan cache HTTP dengan betul. Nilai sentiasa
    // berubah memaksa muat turun penuh pada setiap navigasi.
    const v = (import.meta as any).env?.VITE_BUILD_ID || "dev";
    const script = document.createElement("script");
    script.id = "app-logic-script";
    script.src = `/app-logic.js?v=${v}`;
    // PENTING: selepas app-logic.js selesai dimuat (checkIsTrial & co wujud),
    // beritahu React supaya menyegerakkan status trial/pro. Tanpa ini, React
    // terperangkap dengan nilai fallback kiraan awal (belum tahu app-logic.js)
    // dan tidak akan resync kerana tiada event ketibaannya.
    script.onload = () => {
      try {
        window.dispatchEvent(new CustomEvent("akses-level-change"));
      } catch (e) {
        console.warn("[App] Gagal sebar akses-level-change selepas app-logic.js dimuat:", e);
      }
      // Fasa 1.5: app-logic.js kini sedia - papar banner jika hasil semakan
      // luput sudah tiba sebelum skrip ini dimuatkan.
      cubaPaparBannerLuput();
    };
    document.body.appendChild(script);

    const surihScript = document.createElement("script");
    surihScript.src = `/surih-logic.js?v=${v}`;

    // Load surih-nombor-logic.js
    const surihNomborScript = document.createElement("script");
    surihNomborScript.src = `/surih-nombor-logic.js?v=${v}`;
    surihNomborScript.async = true;
    document.body.appendChild(surihNomborScript);
    document.body.appendChild(surihScript);
    // return () => document.body.removeChild(script);
  }, []);

  return (
    <div id="app-root">
      <MuridSidePanel activeStudentName={activeStudentName} />

      {/* Banner Mod Guru & Ibu Bapa */}
      <div id="teacher-top-banner" className="teacher-top-banner">
        <div className="teacher-banner-left">
          <span id="teacher-banner-badge" className="teacher-banner-badge">
            {isAdminActive || (typeof document !== "undefined" && document.body.classList.contains("admin-mode")) ? (
              <>
                <i className="fa-solid fa-user-shield"></i> MOD ADMIN
              </>
            ) : isAffiliateActive || (typeof document !== "undefined" && document.body.classList.contains("affiliate-mode")) || (typeof localStorage !== "undefined" && localStorage.getItem("bunyiKataUserRole") === "affiliate") ? (
              <>
                <i className="fa-solid fa-sitemap"></i> MOD AFFILIATE
              </>
            ) : (typeof window !== "undefined" && (window as any).modIbuBapaAktif) ||
              (typeof document !== "undefined" && document.body.classList.contains("parent-mode")) ||
              (typeof localStorage !== "undefined" && localStorage.getItem("bunyiKataUserRole") === "ibubapa") ? (
              <>
                <i className="fa-solid fa-user-group"></i> MOD IBU BAPA
              </>
            ) : (
              <>
                <i className="fa-solid fa-chalkboard-user"></i> MOD GURU
              </>
            )}
          </span>
        </div>
        <div className="teacher-banner-right">
          <button
            className="teacher-banner-btn"
            onClick={() => {
              if (
                isAdminActive ||
                (window as any).modAdminAktif ||
                (window as any).isAdminMode ||
                (typeof document !== "undefined" && document.body.classList.contains("admin-mode"))
              ) {
                if (typeof (window as any).keluarModGuru === "function") {
                  (window as any).keluarModGuru();
                } else {
                  paparSkrin("login-screen");
                }
              } else if (
                isAffiliateActive ||
                (window as any).modAffiliateAktif ||
                (typeof document !== "undefined" && document.body.classList.contains("affiliate-mode")) ||
                (typeof localStorage !== "undefined" && localStorage.getItem("bunyiKataUserRole") === "affiliate")
              ) {
                if (typeof (window as any).keluarModAffiliate === "function") {
                  (window as any).keluarModAffiliate();
                } else {
                  paparSkrin("login-screen");
                }
              } else if (
                (window as any).modIbuBapaAktif ||
                (typeof document !== "undefined" && document.body.classList.contains("parent-mode")) ||
                (typeof localStorage !== "undefined" && localStorage.getItem("bunyiKataUserRole") === "ibubapa")
              ) {
                if (typeof (window as any).keluarModIbuBapa === "function") {
                  (window as any).keluarModIbuBapa();
                } else {
                  paparSkrin("login-screen");
                }
              } else if (typeof (window as any).keluarModGuru === "function") {
                (window as any).keluarModGuru();
              } else {
                paparSkrin("login-screen");
              }
            }}
            title="Keluar"
            aria-label="Keluar"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </div>
      </div>

      {/* Fasa 1.5: Banner amaran apabila langganan hampir/sudah luput.
          Dipaparkan oleh JS (window.paparBannerLuput) selepas semakan pelayan. */}
      <div id="banner-luput-langganan" style={{ display: "none" }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "1.05rem" }}></i>
        <span id="banner-luput-teks" style={{ flex: 1 }}></span>
        <button
          type="button"
          id="banner-luput-tutup"
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "2px 6px",
            opacity: 0.85,
          }}
          aria-label="Tutup"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav
        id="teacher-sticky-nav"
        className="teacher-sticky-nav student-nav-curved"
        aria-label="Navigasi mod guru"
        style={{ display: isAdminActive ? "none" : undefined }}
      >
        <div className="student-nav-curved-backdrop mobile-nav-only" aria-hidden="true">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="student-nav-curved-svg">
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0 L 405 80 L -5 80 Z"
              fill="#ffffff"
              stroke="none"
            />
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0"
              fill="none"
              stroke="var(--color-dark, #10182f)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <button
          className="neo-btn bg-white nav-btn-dashboard"
          onClick={(e) => {
            paparSkrin("guru-dashboard");
          }}
          title="Dashboard Guru"
        >
          <i className="fa-solid fa-table-list"></i> <span>Dashboard</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-statistik"
          onClick={(e) => {
            (window as any).bukaModalStatistik &&
              (window as any).bukaModalStatistik();
          }}
          title="Statistik"
        >
          <i className="fa-solid fa-chart-pie"></i> <span>Statistik</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-murid"
          onClick={(e) => {
            paparSkrin("guru-urus-murid");
          }}
          title="Urus Murid"
        >
          <i className="fa-solid fa-users-gear"></i> <span>Urus Murid</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-perkataan"
          onClick={(e) => {
            paparSkrin("guru-senarai-perkataan");
          }}
          title="Senarai Perkataan"
        >
          <i className="fa-solid fa-book"></i> <span>Perkataan</span>
        </button>
        <button
          className="neo-btn bg-white nav-item-center-circle nav-btn-akses"
          onClick={(e) => {
            bukaModalAksesGuru();
          }}
          title="Akses"
        >
          <i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span>
        </button>
      </nav>

      <nav
        id="admin-sticky-nav"
        className="teacher-sticky-nav student-nav-curved"
        aria-label="Navigasi mod admin"
        style={{ display: isAdminActive ? "flex" : "none" }}
      >
        <div className="student-nav-curved-backdrop mobile-nav-only" aria-hidden="true">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="student-nav-curved-svg">
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0 L 405 80 L -5 80 Z"
              fill="#ffffff"
              stroke="none"
            />
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0"
              fill="none"
              stroke="var(--color-dark, #10182f)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <button
          className="neo-btn bg-white nav-btn-dashboard"
          onClick={(e) => {
            paparSkrin("admin-dashboard");
          }}
          title="Dashboard Admin"
        >
          <i className="fa-solid fa-table-list"></i> <span>Dashboard</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-statistik nav-btn-sijil"
          onClick={(e) => {
            paparSkrin("admin-sijil");
          }}
          title="Urus Sijil"
        >
          <i className="fa-solid fa-certificate"></i> <span>Sijil</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-urus"
          onClick={(e) => {
            paparSkrin("admin-urus");
          }}
          title="Urus"
        >
          <i className="fa-solid fa-list-check"></i> <span>Urus</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-perkataan"
          onClick={(e) => {
            paparSkrin("admin-senarai-perkataan");
          }}
          title="Senarai Perkataan"
        >
          <i className="fa-solid fa-book"></i> <span>Perkataan</span>
        </button>
        <button
          className="neo-btn bg-white nav-item-center-circle nav-btn-akses"
          onClick={(e) => {
            bukaModalAksesGuru();
          }}
          title="Akses"
        >
          <i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span>
        </button>
      </nav>

      {/* Navigasi Sticky Mod Ibu Bapa */}
      <nav
        id="parent-sticky-nav"
        className="teacher-sticky-nav parent-sticky-nav student-nav-curved"
        aria-label="Navigasi mod ibu bapa"
        style={{ display: "none" }}
      >
        <div className="student-nav-curved-backdrop mobile-nav-only" aria-hidden="true">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="student-nav-curved-svg">
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0 L 405 80 L -5 80 Z"
              fill="#ffffff"
              stroke="none"
            />
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0"
              fill="none"
              stroke="var(--color-dark, #10182f)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <button
          className="neo-btn bg-white nav-btn-dashboard"
          onClick={(e) => {
            paparSkrin("ibubapa-dashboard");
          }}
          title="Dashboard Ibu Bapa"
        >
          <i className="fa-solid fa-chart-line"></i> <span>Dashboard</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-perkataan"
          onClick={(e) => {
            paparSkrin("ibubapa-senarai-perkataan");
          }}
          title="Senarai Perkataan"
        >
          <i className="fa-solid fa-book"></i> <span>Perkataan</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-laporan mobile-nav-only"
          onClick={(e) => {
            const modal = document.getElementById("modal-laporan-kemajuan");
            if (modal) modal.style.display = "flex";
          }}
          title="Laporan Kemajuan"
        >
          <i className="fa-solid fa-brain"></i> <span>Laporan</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-profil"
          onClick={(e) => {
            const modal = document.getElementById("modal-pilih-anak");
            if (modal) {
              modal.style.display = "flex";
              if ((window as any).bukaModalPilihAnak)
                (window as any).bukaModalPilihAnak();
            }
          }}
          title="Pilih Anak"
        >
          <i className="fa-regular fa-id-badge"></i> <span>Profil</span>
        </button>
        <button
          className="neo-btn bg-white nav-item-center-circle nav-btn-akses"
          onClick={(e) => {
            bukaModalAksesGuru();
          }}
          title="Akses"
        >
          <i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span>
        </button>
      </nav>

      {/* Navigasi Sticky Mod Affiliate (4 butang: Affiliate • Rujukan • Kod • Keluar) */}
      <nav
        id="affiliate-sticky-nav"
        className="teacher-sticky-nav affiliate-sticky-nav student-nav-curved"
        aria-label="Navigasi mod affiliate"
        style={{ display: "none" }}
      >
        <div className="student-nav-curved-backdrop mobile-nav-only" aria-hidden="true">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="student-nav-curved-svg">
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0 L 405 80 L -5 80 Z"
              fill="#ffffff"
              stroke="none"
            />
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0"
              fill="none"
              stroke="var(--color-dark, #10182f)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <button
          className="neo-btn bg-white nav-btn-dashboard"
          onClick={() => {
            paparSkrin("affiliate-dashboard");
          }}
          title="Dashboard Affiliate"
        >
          <i className="fa-solid fa-sitemap"></i> <span>Affiliate</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-rujukan"
          onClick={() => {
            paparSkrin("affiliate-dashboard");
            setTimeout(() => {
              const t = document.getElementById("affiliate-rujukan");
              if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
          }}
          title="Rujukan"
        >
          <i className="fa-solid fa-table-list"></i> <span>Rujukan</span>
        </button>
        <button
          className="neo-btn bg-white nav-item-center-circle nav-btn-akses"
          onClick={() => {
            bukaModalAksesGuru();
          }}
          title="Akses"
        >
          <i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-laporan"
          onClick={() => {
            paparSkrin("affiliate-laporan-screen");
          }}
          title="Laporan"
        >
          <i className="fa-solid fa-file-invoice-dollar"></i> <span>Laporan</span>
        </button>
        <button
          className="neo-btn bg-white nav-btn-keluar mobile-nav-only"
          onClick={() => {
            if (typeof (window as any).keluarModAffiliate === "function") {
              (window as any).keluarModAffiliate();
            } else {
              paparSkrin("login-screen");
            }
          }}
          title="Keluar"
        >
          <i className="fa-solid fa-right-from-bracket"></i> <span>Keluar</span>
        </button>
      </nav>

      <div
        id="modal-laporan-kemajuan"
        className="modal-overlay"
        style={{ display: "none" }}
      >
        <div
          className="modal-content"
          style={{
            maxWidth: "460px",
            width: "92%",
            padding: "20px 20px 22px 20px",
            borderRadius: "24px",
            textAlign: "left",
            background: "#ffffff",
            backgroundImage: "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.8px, transparent 1.8px)",
            backgroundSize: "22px 22px",
            border: "3.5px solid var(--color-dark)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25), 0 4px 0 var(--color-dark)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2.5px solid var(--color-dark)",
              gap: "8px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#0284c7",
                flex: "1",
                minWidth: 0,
                overflow: "hidden",
                marginRight: "8px",
              }}
            >
              <i className="fa-solid fa-brain" style={{ fontSize: "1.2rem", flexShrink: 0 }}></i>
              <span
                style={{
                  fontSize: "clamp(0.78rem, 3.4vw, 0.95rem)",
                  fontWeight: "bold",
                  whiteSpace: "normal",
                  lineHeight: "1.25",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Laporan &amp; Cadangan Bimbingan
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" }}>
              <button
                className="neo-btn bg-white"
                onClick={() => {
                  if ((window as any).playBubble) (window as any).playBubble();
                  if ((window as any).renderParentDashboard) {
                    (window as any).renderParentDashboard();
                  }
                }}
                style={{
                  width: "38px",
                  height: "38px",
                  padding: 0,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  border: "2.5px solid var(--color-dark)",
                  boxShadow: "0 3px 0 var(--color-dark)",
                  cursor: "pointer",
                }}
                title="Refresh Laporan"
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
              <button
                className="neo-btn bg-red"
                onClick={() => {
                  const modal = document.getElementById("modal-laporan-kemajuan");
                  if (modal) modal.style.display = "none";
                }}
                style={{
                  width: "38px",
                  height: "38px",
                  padding: 0,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  color: "white",
                  backgroundColor: "#ef4444",
                  border: "2.5px solid var(--color-dark)",
                  boxShadow: "0 3px 0 var(--color-dark)",
                  cursor: "pointer",
                }}
                title="Tutup"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div
            id="ibubapa-ai-content-modal"
            style={{
              fontSize: "0.92rem",
              lineHeight: "1.6",
              color: "var(--color-dark)",
              fontWeight: "600",
              background: "#ffffff",
              padding: "18px",
              borderRadius: "16px",
              border: "2.5px solid var(--color-dark)",
              boxShadow: "0 2px 0 var(--color-dark)",
            }}
          >
            {/* Populated by JS */}
          </div>
        </div>
      </div>

      {/* Modal Pilih Anak (Mod Ibu Bapa) */}
      <div
        id="modal-pilih-anak"
        className="modal-overlay"
        style={{ display: "none" }}
      >
        <div
          className="modal-content"
          style={{
            maxWidth: "460px",
            width: "90%",
            padding: "24px 20px 20px",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={() => {
              (window as any).tutupModalPilihAnak &&
                (window as any).tutupModalPilihAnak();
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div
            className="modal-header-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              paddingBottom: "4px",
            }}
          >
            <div
              style={{
                backgroundColor: "#0284c7",
                color: "white",
                fontSize: "1.15rem",
                fontWeight: "800",
                padding: "8px 24px",
                borderRadius: "999px",
                margin: "0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "2.5px solid var(--color-dark)",
                boxShadow: "0 3.5px 0 var(--color-dark)",
                pointerEvents: "none",
              }}
            >
              <i className="fa-solid fa-users"></i>
              <span className="modal-title-main">Pilih Profil Murid</span>
            </div>
            <p style={{ display: "none" }}></p>
          </div>

          <div
            id="ibubapa-profiles-container"
            className="student-profiles-list"
          >
            {/* Populated by JS */}
          </div>
        </div>
      </div>



      {/* Modal Statistik & Diagnostik AI Kelas */}
      <div
        id="modal-statistik"
        className="modal-overlay"
        style={{ display: "none" }}
      >
        <div
          className="modal-content"
          style={{
            maxWidth: "850px",
            width: "94%",
            padding: "20px 24px",
            maxHeight: "88vh",
            overflowY: "auto",
            borderRadius: "20px",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={() => {
              (window as any).tutupModalStatistik &&
                (window as any).tutupModalStatistik();
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div
            className="modal-header-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              borderBottom: "2px solid var(--color-gray)",
              paddingBottom: "12px",
            }}
          >
            <div
              className="neo-btn bg-orange century-gothic-font"
              style={{
                color: "white",
                backgroundColor: "var(--color-orange, #ea580c)",
                pointerEvents: "none",
                fontSize: "clamp(0.95rem, 3.8vw, 1.2rem)",
                fontWeight: "900",
                textAlign: "center",
                padding: "8px 24px",
                borderRadius: "14px",
                border: "3px solid var(--color-dark, #10182f)",
                boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
              }}
            >
              <i className="fa-solid fa-chart-pie" style={{ marginRight: "8px" }}></i>
              Statistik Kelas
            </div>
          </div>

          {/* Kad Diagnostik AI */}
          <div
            className="neo-box"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
              padding: "16px 18px",
              marginBottom: "18px",
              borderRadius: "16px",
              border: "2px solid var(--color-dark)",
              textAlign: "left",
              boxShadow: "0 2px 0 var(--color-dark)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    border: "1.5px solid var(--color-dark)",
                  }}
                >
                  <i className="fa-solid fa-brain"></i> Diagnostik AI
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "#334155",
                  }}
                >
                  Kelas: <span id="ai-nama-kelas-txt">-</span>
                </span>
              </div>
              <button
                className="neo-btn bg-white"
                style={{
                  padding: "6px 10px",
                  fontSize: "0.85rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title="Kemaskini AI"
                onClick={() => {
                  (window as any).janaDiagnostikAI &&
                    (window as any).janaDiagnostikAI();
                }}
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
            </div>

            <div
              id="ai-diagnostic-content"
              style={{
                fontSize: "0.84rem",
                lineHeight: "1.5",
                color: "var(--color-dark)",
                fontWeight: "600",
              }}
            >
              {/* Dijana oleh JS */}
            </div>
          </div>

          {/* Carta Pie & Bar Chart Sebelah-menyebelah */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              textAlign: "left",
            }}
          >
            {/* Pie Chart Card */}
            <div
              className="neo-box"
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "16px",
                border: "2px solid var(--color-dark)",
                boxShadow: "0 2px 0 var(--color-dark)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3
                className="statistik-card-title"
                style={{
                  fontSize: "0.88rem",
                  fontWeight: "bold",
                  margin: "0 0 12px 0",
                  color: "var(--color-dark)",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <i
                  className="fa-solid fa-chart-pie"
                  style={{ color: "#8b5cf6", marginRight: "6px" }}
                ></i>{" "}
                Kemajuan Keseluruhan
              </h3>
              <div
                id="pie-chart-container"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                {/* Dijana oleh JS */}
              </div>
            </div>

            {/* Bar Chart Card */}
            <div
              className="neo-box"
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "16px",
                border: "2px solid var(--color-dark)",
                boxShadow: "0 2px 0 var(--color-dark)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <h3
                  className="statistik-card-title"
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: "bold",
                    margin: "0",
                    color: "var(--color-dark)",
                  }}
                >
                  <i
                    className="fa-solid fa-chart-column"
                    style={{ color: "#0284c7", marginRight: "6px" }}
                  ></i>{" "}
                  Analisis Cabaran
                </h3>
                {/* Filter Dropdown using AtlantaRoundedBlack */}
                <select
                  id="statistik-bar-filter"
                  className="bar-chart-filter-select neo-btn bg-orange"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    padding: "4px 28px 4px 8px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    fontFamily:
                      "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    borderRadius: "8px",
                    border: "1.5px solid var(--color-dark)",
                    color: "white",
                    backgroundColor: "var(--color-orange)",
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "14px",
                    cursor: "pointer",
                  }}
                  onChange={() => {
                    (window as any).renderStatistikBarChart &&
                      (window as any).renderStatistikBarChart();
                  }}
                >
                  <option
                    value="all"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Semua Cabaran
                  </option>
                  <option
                    value="1"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Cabaran Kenal Huruf
                  </option>
                  <option
                    value="2"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Cabaran Suku Kata Asas
                  </option>
                  <option
                    value="3"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Cabaran Suku Kata Hero
                  </option>
                  <option
                    value="4"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Cabaran Bacaan Bergred
                  </option>
                </select>
              </div>
              <div
                id="bar-chart-container"
                style={{ width: "100%", minHeight: "200px" }}
              >
                {/* Dijana oleh JS */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PilihPetaModal isEffectiveTrial={isEffectiveTrial} />

      <nav id="student-global-nav" className="student-nav-bar student-nav-curved">
        <div className="student-nav-curved-backdrop mobile-nav-only" aria-hidden="true">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="student-nav-curved-svg">
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0 L 405 80 L -5 80 Z"
              fill="#ffffff"
              stroke="none"
            />
            <path
              d="M -5 0 L 160 0 C 176 0, 183 30, 200 30 C 217 30, 224 0, 240 0 L 405 0"
              fill="none"
              stroke="var(--color-dark, #10182f)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <button
          className="nav-item nav-modern desktop-nav-only student-nav-info-btn"
          onClick={(e) => {
            if ((window as any).playBubble) (window as any).playBubble();
            (window as any).bukaModalAppInfo && (window as any).bukaModalAppInfo();
          }}
          title="Maklumat Aplikasi"
          style={{ width: "44px", height: "44px", minWidth: "44px", maxWidth: "44px", padding: "0", justifyContent: "center", borderRadius: "50%", aspectRatio: "1/1", flexShrink: 0 }}
        >
          <i className="fa-solid fa-circle-info" style={{ fontSize: "1.25rem", margin: "0" }}></i>
        </button>
        <button
          className="nav-item nav-modern desktop-nav-only"
          onClick={(e) => {
            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
            paparSkrin("profile-screen");
          }}
          style={{ gap: "8px" }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              background: "#e2e8f0",
              borderRadius: "50%",
              border: "1.5px solid var(--color-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              id="nav-avatar-icon"
              className="murid-info-avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundImage: `url('${activeStudentAvatar || "/images/avatar/avatar1.png"}')`,
              }}
            ></div>
          </div>
          <span>Profil</span>
        </button>
        <button
          className="nav-item bg-purple desktop-nav-only"
          onClick={(e) => {
            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
            paparSkrin("lencana-screen");
          }}
        >
          <i className="fa-solid fa-medal"></i>
          <span>Lencana</span>
        </button>
        <button
          className="nav-item bg-yellow desktop-nav-only"
          onClick={(e) => {
            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
            paparSkrin("leaderboard-screen");
          }}
        >
          <i className="fa-solid fa-trophy"></i>
          <span>Kedudukan</span>
        </button>
        <button
          className="nav-item bg-red desktop-nav-only student-nav-exit-btn"
          onClick={(e) => {
            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
            if (typeof (window as any).paparSkrin === "function") {
              (window as any).paparSkrin("login-screen");
            }
            document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
            const ls = document.getElementById("login-screen");
            if (ls) ls.classList.add("active");
            const pm = document.getElementById("modal-pilih-peta");
            if (pm) pm.style.display = "none";
          }}
          title="Keluar"
          style={{ width: "44px", height: "44px", minWidth: "44px", maxWidth: "44px", padding: "0", justifyContent: "center", borderRadius: "50%", aspectRatio: "1/1", flexShrink: 0 }}
        >
          <i
            className="fa-solid fa-right-from-bracket"
            style={{ fontSize: "1.15rem", margin: "0" }}
          ></i>
        </button>

        {/* Mobile Nav Items */}
        <button
          className="neo-btn bg-white mobile-nav-only"
          onClick={(e) => {
            paparSkrin("profile-screen");
          }}
          title="Profil Murid"
        >
          <i className="fa-solid fa-user"></i>
          <span>Profil</span>
        </button>
        <button
          className="neo-btn bg-white mobile-nav-only"
          onClick={(e) => {
            paparSkrin("lencana-screen");
          }}
          title="Lencana"
        >
          <i className="fa-solid fa-medal"></i>
          <span>Lencana</span>
        </button>
        <button
          className="neo-btn bg-white mobile-nav-only nav-item-center-circle"
          onClick={(e) => {
            paparSkrin("main-menu-screen");
          }}
          title="Menu Utama"
        >
          <i className="fa-solid fa-house"></i>
          <span>Utama</span>
        </button>
        <button
          className="neo-btn bg-white mobile-nav-only"
          onClick={(e) => {
            paparSkrin("leaderboard-screen");
          }}
          title="Kedudukan"
        >
          <i className="fa-solid fa-trophy"></i>
          <span>Kedudukan</span>
        </button>
        <button
          className="neo-btn bg-white mobile-nav-only"
          onClick={(e) => {
            if ((window as any).playBubble) (window as any).playBubble();
            (window as any).bukaModalAppInfo && (window as any).bukaModalAppInfo();
          }}
          title="Info"
        >
          <i className="fa-solid fa-circle-info"></i>
          <span>Info</span>
        </button>
      </nav>

      <div
        id="admin-side-panel-overlay"
        className="modal-overlay"
        style={{
          zIndex: "2000",
          justifyContent: "flex-start",
          background: "rgba(0,0,0,0.5)",
          display: "none",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget)
            document.getElementById("admin-side-panel-overlay")!.style.display =
              "none";
        }}
      >
        <div
          className="murid-side-panel"
          style={{
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            width: "280px",
            height: "100%",
            border: "var(--border-thick)",
            borderLeft: "none",
            borderRadius: "0 24px 24px 0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "slideInLeft 0.3s forwards",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#168f81",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
              backgroundSize: "15px 15px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderBottom: "var(--border-thick)",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                background: "white",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "var(--border-thick)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#168f81",
                boxShadow: "none !important",
                flexShrink: "0",
              }}
            >
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                alignItems: "flex-start",
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  margin: "0",
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                Mod Admin
              </h2>
              <span style={{ fontSize: "0.7rem", opacity: "0.9" }}>
                Panel Kawalan Admin
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflowY: "auto",
              flex: "1",
            }}
          >
            <button
              className="neo-btn"
              style={{
                backgroundColor: "#168f81",
                color: "white",
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "admin-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("admin-dashboard");
              }}
            >
              <i
                className="fa-solid fa-chart-line"
                style={{ width: "30px" }}
              ></i>{" "}
              Statistik
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "admin-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("admin-urus");
              }}
            >
              <i className="fa-solid fa-list-check" style={{ width: "30px" }}></i>{" "}
              Urus
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "admin-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("admin-senarai-perkataan");
              }}
            >
              <i className="fa-solid fa-book" style={{ width: "30px" }}></i>{" "}
              Senarai Perkataan
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "admin-side-panel-overlay",
                )!.style.display = "none";
                bukaModalAksesGuru();
              }}
            >
              <i
                className="fa-solid fa-unlock-keyhole"
                style={{ width: "30px" }}
              ></i>{" "}
              Akses Admin
            </button>
          </div>

          <div
            style={{
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderTop: "var(--border-thick)",
            }}
          >
            <button
              className="neo-btn bg-red"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "admin-side-panel-overlay",
                )!.style.display = "none";
                keluarModGuru();
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Keluar Mod
              Admin
            </button>
          </div>
        </div>
      </div>

      <div
        id="guru-side-panel-overlay"
        className="modal-overlay"
        style={{
          zIndex: "2000",
          justifyContent: "flex-start",
          background: "rgba(0,0,0,0.5)",
          display: "none",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget)
            document.getElementById("guru-side-panel-overlay")!.style.display =
              "none";
        }}
      >
        <div
          className="murid-side-panel"
          style={{
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            width: "280px",
            height: "100%",
            border: "var(--border-thick)",
            borderLeft: "none",
            borderRadius: "0 24px 24px 0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "slideInLeft 0.3s forwards",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--color-orange)",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
              backgroundSize: "15px 15px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderBottom: "var(--border-thick)",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                background: "white",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "var(--border-thick)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-orange)",
                boxShadow: "none !important",
                flexShrink: "0",
              }}
            >
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                alignItems: "flex-start",
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  margin: "0",
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                Mod Guru
              </h2>
              <span style={{ fontSize: "0.7rem", opacity: "0.9" }}>
                Panel Kawalan Guru
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflowY: "auto",
              flex: "1",
            }}
          >
            <button
              className="neo-btn bg-orange"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("guru-dashboard");
              }}
            >
              <i
                className="fa-solid fa-table-list"
                style={{ width: "30px" }}
              ></i>{" "}
              Dashboard
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                (window as any).bukaModalStatistik &&
                  (window as any).bukaModalStatistik();
              }}
            >
              <i
                className="fa-solid fa-chart-pie"
                style={{ width: "30px" }}
              ></i>{" "}
              Statistik
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("guru-urus-murid");
              }}
            >
              <i
                className="fa-solid fa-users-gear"
                style={{ width: "30px" }}
              ></i>{" "}
              Urus Murid
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                paparSkrin("guru-senarai-perkataan");
              }}
            >
              <i className="fa-solid fa-book" style={{ width: "30px" }}></i>{" "}
              Senarai Perkataan
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                bukaModalAksesGuru();
              }}
            >
              <i
                className="fa-solid fa-unlock-keyhole"
                style={{ width: "30px" }}
              ></i>{" "}
              Akses
            </button>
          </div>

          <div
            style={{
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderTop: "var(--border-thick)",
            }}
          >
            <button
              className="neo-btn bg-red"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1.05rem",
                padding: "12px",
              }}
              onClick={(e) => {
                document.getElementById(
                  "guru-side-panel-overlay",
                )!.style.display = "none";
                keluarModGuru();
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Keluar Mod Guru
            </button>
          </div>
        </div>
      </div>

      <button
        id="guru-mobile-menu-btn"
        className="neo-btn bg-yellow"
        style={{
          display: "none",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          zIndex: "1999",
          fontSize: "1.5rem",
          padding: "0",
          justifyContent: "center",
          alignItems: "center",
          animation: "gold-glow 2s infinite alternate",
          color: "var(--color-dark)",
        }}
        onClick={() => {
          if (
            document.getElementById("admin-sticky-nav")?.style.display ===
            "flex"
          ) {
            document.getElementById("admin-side-panel-overlay")!.style.display =
              "flex";
          } else {
            document.getElementById("guru-side-panel-overlay")!.style.display =
              "flex";
          }
        }}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <LandingScreen
        getScreenClass={getScreenClass}
        onCubaPercuma={() => {
          if (!sekaliKlik("landing-cuba-percuma")) return;
          if (typeof (window as any).playBubble === "function") (window as any).playBubble();
          if (typeof (window as any).paparSkrin === "function") {
            (window as any).paparSkrin("login-screen");
          }
        }}
        onLogMasuk={() => {
          if (!sekaliKlik("landing-log-masuk")) return;
          if (typeof (window as any).playBubble === "function") (window as any).playBubble();
          // Butang "Log Masuk" membuka popup "Masukkan Kod" (yang turut mengandungi pilihan Guru, Ibubapa & Affiliate)
          setIsCodeModalOpen(true);
        }}
        onOpenPakej={(tab) => {
          if (!sekaliKlik("landing-pakej")) return;
          if (typeof (window as any).playBubble === "function") (window as any).playBubble();
          (window as any).openPakejProModal?.(tab || "guru");
        }}
        onDaftarPakej={(category, namaPakej) => {
          // Butang "Daftar" pada kad pakej landing: hantar TERUS ke WhatsApp admin
          // (TIADA popup) — sama seperti onSelectPlanRegister, tetapi tanpa buka modal.
          if (!sekaliKlik("landing-daftar-pakej")) return;
          if (typeof (window as any).playBubble === "function") (window as any).playBubble();

          // Nama pakej rasmi (sebutan sama seperti popup Pakej Pro).
          // `namaPakej` dari landing: "Bulanan Biasa" | "3 Bulan" | "1 Tahun".
          const namaRasmi = /bulanan/i.test(namaPakej)
            ? "Bulanan (Biasa)"
            : /1 tahun|tahun/i.test(namaPakej)
              ? "1 Tahun (Pro)"
              : "3 Bulan (Pro)";

          // `mesejDaftarPakej` auto-cantum kod affiliate (jika ada) dari storan,
          // jadi kod rujukan affiliate tetap dikesan walaupun tiada popup.
          const mesej = mesejDaftarPakej(namaRasmi);
          const berjaya = hubungiAdminWhatsapp(mesej);

          if (typeof (window as any).paparNotifikasiUmum === "function") {
            (window as any).paparNotifikasiUmum(
              berjaya
                ? `Pendaftaran akaun diuruskan oleh admin. Sila teruskan perbualan di WhatsApp untuk melanggan pakej ${namaRasmi}.`
                : "Pendaftaran akaun diuruskan oleh admin. Sila hubungi admin untuk melanggan pakej.",
            );
          }
        }}
        onDaftarAffiliate={() => {
          // Butang "Daftar" pada kad Pakej Affiliate landing: hantar TERUS ke
          // WhatsApp admin dengan template khas affiliate (auto-cantum kod rujukan).
          if (!sekaliKlik("landing-daftar-affiliate")) return;
          if (typeof (window as any).playBubble === "function") (window as any).playBubble();

          const mesej = mesejDaftarAffiliate();
          const berjaya = hubungiAdminWhatsapp(mesej);

          if (typeof (window as any).paparNotifikasiUmum === "function") {
            (window as any).paparNotifikasiUmum(
              berjaya
                ? "Pendaftaran akaun diuruskan oleh admin. Sila teruskan perbualan di WhatsApp untuk menyertai Pakej Affiliate."
                : "Pendaftaran akaun diuruskan oleh admin. Sila hubungi admin untuk menyertai Pakej Affiliate.",
            );
          }
        }}
      />



      <LoginScreen
        getScreenClass={getScreenClass}
        setIsModeChoiceOpen={setIsModeChoiceOpen}
        setIsCodeModalOpen={setIsCodeModalOpen}
        setIsEntryChoiceModalOpen={setIsEntryChoiceModalOpen}
        onOpenTerms={() => {
          setLegalModalTab("terma");
          setIsLegalModalOpen(true);
        }}
        onOpenPrivacy={() => {
          setLegalModalTab("privasi");
          setIsLegalModalOpen(true);
        }}
      />

      <div id="main-menu-screen" className={getScreenClass("main-menu-screen")}>
        {/* Mobile Top Header: Avatar, Nama, Bintang Murid & Butang Keluar */}
        <div
          id="main-menu-mobile-header"
          className="main-menu-mobile-header"
        >
          <div
            className="profile-card-avatar-box mobile-header-avatar-box"
            onClick={() => {
              if (typeof (window as any).paparSkrin === "function") {
                (window as any).paparSkrin("profile-screen");
              }
            }}
            style={{
              fontSize: "1.5rem",
              background: "white",
              width: "48px",
              height: "48px",
              borderRadius: "13px",
              border: "3px solid #f59e0b",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: "0",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <div
              className="murid-info-avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "9px",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                zIndex: 1,
              }}
            ></div>
          </div>
          <div
            className="mobile-header-info"
            onClick={() => {
              if (typeof (window as any).paparSkrin === "function") {
                (window as any).paparSkrin("profile-screen");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <h2 className="murid-info-name">
              {activeStudentName}
            </h2>
            <span className="score-pill">
              <i
                className="fa-solid fa-star"
                style={{
                  color: "#ffc107",
                  WebkitTextStroke: "1px var(--color-dark)",
                }}
              ></i>{" "}
              <strong id="mobile-menu-jumlah-markah" className="murid-info-bintang">0</strong>
            </span>
          </div>
          <button
            id="mobile-header-exit-btn"
            className="mobile-header-exit-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof (window as any).paparSkrin === "function") {
                (window as any).paparSkrin("login-screen");
              }
            }}
            title="Keluar ke Skrin Utama"
            aria-label="Keluar"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>

        <div
          className="logo-besar shine-pulse-container"
          style={{
            transform: "rotate(0deg)",
            padding: "0",
            background: "transparent",
            boxShadow: "none",
            border: "none",
          }}
        >
          <img
            referrerPolicy="no-referrer"
            src="/images/sampingan/logo-main-screen.png"
            alt="Bunyi Kata"
            className="glitch-logo"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "250px" }}
          />
        </div>

        <div
          className="main-action-buttons"
          style={{ marginTop: "60px", gap: "30px" }}
        >
          <button
            className="neo-btn ticket-btn-red main-menu-btn-anim-1"
            onClick={(e) => {
              if (typeof (window as any).playBubble === "function") (window as any).playBubble();
              if (typeof (window as any).bukaModalPilihPeta === "function") {
                (window as any).bukaModalPilihPeta("belajar");
              } else {
                const m = document.getElementById("modal-pilih-peta");
                if (m) m.style.display = "flex";
                const tajuk = document.getElementById("modal-pilih-peta-tajuk");
                if (tajuk) {
                  tajuk.innerText = "Pilih Peta Kembara";
                  tajuk.classList.remove("bg-purple");
                  tajuk.classList.add("bg-orange");
                }
              }
            }}
          >
            <i className="fa-solid fa-book-open"></i> Belajar
          </button>
          <button
            className="neo-btn ticket-btn-red main-menu-btn-anim-2"
            onClick={(e) => {
              if (typeof (window as any).playBubble === "function") (window as any).playBubble();
              if (typeof (window as any).bukaModalPilihPeta === "function") {
                (window as any).bukaModalPilihPeta("latihan");
              } else {
                const m = document.getElementById("modal-pilih-peta");
                if (m) m.style.display = "flex";
                const tajuk = document.getElementById("modal-pilih-peta-tajuk");
                if (tajuk) {
                  tajuk.innerText = "Pilih Peta Latihan";
                  tajuk.classList.remove("bg-orange");
                  tajuk.classList.add("bg-purple");
                }
              }
            }}
          >
            <i className="fa-solid fa-gamepad"></i> Latihan
          </button>
        </div>

        {/*  Kad Ganjaran Harian  */}
        <div
          id="daily-reward-card"
          className="neo-box bg-purple"
          style={{
            display: "none",
            marginTop: "20px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
            borderRadius: "20px",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <i
              className="fa-solid fa-gift"
              style={{
                fontSize: "2.5rem",
                color: "gold",
                animation: "bounce 2s infinite",
              }}
            ></i>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ color: "white", marginBottom: "5px" }}>
                Ganjaran Harian!
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#f0f0f0" }}>
                Log masuk <span id="streak-display">3</span> hari berturut-turut
              </p>
            </div>
          </div>
          <button
            className="neo-btn bg-yellow"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
            onClick={(e) => {
              tuntutGanjaranHarian();
            }}
          >
            Tuntut
          </button>
        </div>
      </div>

      <MapScreen
        getScreenClass={getScreenClass}
        setShowBukuCeritaModal={setShowBukuCeritaModal}
        setKadImbasanNomborMode={setKadImbasanNomborMode}
        setArKiraJariMode={setArKiraJariMode}
        isDialOpen={isDialOpen}
        setIsDialOpen={setIsDialOpen}
      />

      {/* Cabaran Tambahan Game View — rendered via portal to body so position:fixed works correctly outside .screen transform stacking context */}
      {createPortal(
        <div id="modal-cabaran-lain-game" className="cabaran-tambahan-fullscreen-screen">
          {/* Top Bar matching Cabaran Utama */}
          <div className="cabaran-tambahan-top-bar">
            <button
              className="neo-btn bg-purple back-icon-btn"
              onClick={() => (window as any).closeCabaranLainGame && (window as any).closeCabaranLainGame()}
              aria-label="Kembali"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div id="cabaran-lain-game-title" className="neo-btn bg-purple page-title" style={{ pointerEvents: "none", fontSize: "1.2rem", whiteSpace: "nowrap" }}>
              <i className="fa-solid fa-gamepad"></i> Cabaran
            </div>
            <div className="top-bar-spacer" style={{ width: "48px", height: "48px", visibility: "hidden" }}></div>
          </div>

          <div className="cabaran-tambahan-content-wrapper">
            <div id="cabaran-lain-game-area" style={{ width: "100%", boxSizing: "border-box" }}>
              {/* Dynamic game content injected by JS */}
            </div>
          </div>
        </div>,
        document.body
      )}

      <div id="leaderboard-screen" className={getScreenClass("leaderboard-screen")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-yellow back-icon-btn"
            onClick={(e) => {
              paparSkrin("main-menu-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-yellow page-title"
            style={{ pointerEvents: "none" }}
          >
            Carta Kedudukan
          </div>
          <div></div>
        </div>
        <div className="leaderboard-container">
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "460px",
              gap: "6px",
              marginBottom: "8px",
              justifyContent: "center",
            }}
          >
            <button
              id="btn-leaderboard-harian"
              className="neo-btn bg-yellow"
              style={{ flex: 1, padding: "8px 5px", fontSize: "0.85rem" }}
              onClick={(e) => {
                (window as any).tukarCarta("harian");
              }}
            >
              Harian
            </button>
            <button
              id="btn-leaderboard-mingguan"
              className="neo-btn bg-white"
              style={{ flex: 1, padding: "8px 5px", fontSize: "0.85rem" }}
              onClick={(e) => {
                (window as any).tukarCarta("mingguan");
              }}
            >
              Mingguan
            </button>
            <button
              id="btn-leaderboard-bulanan"
              className="neo-btn bg-white"
              style={{ flex: 1, padding: "8px 5px", fontSize: "0.85rem" }}
              onClick={(e) => {
                (window as any).tukarCarta("bulanan");
              }}
            >
              Bulanan
            </button>
            <button
              id="btn-leaderboard-global"
              className="neo-btn bg-white"
              style={{ flex: 1, padding: "8px 5px", fontSize: "0.85rem" }}
              onClick={(e) => {
                (window as any).tukarCarta("global");
              }}
            >
              Global
            </button>
          </div>
          <div className="grandstand" id="leaderboard-grandstand">
            {/*  Top 3 dijana oleh JS  */}
          </div>
          <div className="leaderboard-list" id="leaderboard-list">
            {/*  Selain Top 3 dijana oleh JS  */}
          </div>
        </div>
      </div>

      {/*  Profil Murid Lencana  */}

      {/*  Prestasi Screen  */}
      <div id="profile-screen" className={getScreenClass("profile-screen")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-purple back-icon-btn"
            onClick={(e) => {
              paparSkrin("main-menu-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              whiteSpace: "nowrap",
            }}
          >
            Profil Murid
          </div>
          <div></div>
        </div>

        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 25px",
            gap: "10px",
            backgroundColor: "#168f81",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "100% 100%, 15px 15px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              textAlign: "left",
            }}
          >
            <div className="profile-card-avatar-box">
              <div id="profil-avatar-icon"></div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <h2
                id="profil-nama-besar"
                style={{ color: "white", fontSize: "1.2rem", margin: "0" }}
              >
                {activeStudentName}
              </h2>
              {(() => {
                const profileData = typeof (window as any).getCurrentProfileData === 'function'
                  ? (window as any).getCurrentProfileData()
                  : null;
                const studentKelas = profileData?.kelas
                  || localStorage.getItem('bunyiKataNamaKelas')
                  || '';
                const studentKeluarga = profileData?.nama_keluarga || '';
                const studentSekolah = localStorage.getItem('bunyiKataNamaSekolah')
                  || '';
                const isParentMode = localStorage.getItem('bunyiKataUserRole') === 'ibubapa'
                  || Boolean(localStorage.getItem('bunyiKataKodKeluarga'));
                return (
                  <>
                    {studentKelas ? (
                      <div
                        style={{
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          opacity: "0.9",
                        }}
                      >
                        {studentKelas}
                      </div>
                    ) : null}
                    {isParentMode && studentKeluarga ? (
                      <div
                        style={{
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          opacity: "0.9",
                        }}
                      >
                        {studentKeluarga}
                      </div>
                    ) : studentSekolah ? (
                      <div
                        style={{
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          opacity: "0.9",
                        }}
                      >
                        {studentSekolah}
                      </div>
                    ) : null}
                  </>
                );
              })()}
            </div>
          </div>
          <div
            className="badge-summary"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            <button
              id="btn-edit-profil"
              className="neo-btn bg-white"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "0",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                minWidth: "auto",
                minHeight: "auto",
                fontSize: "0.9rem",
                color: "var(--color-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "100",
                cursor: "pointer",
              }}
              aria-label="Edit Profil"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof (window as any).bukaModalAvatar === "function") {
                  (window as any).bukaModalAvatar();
                }
              }}
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
            <span
              className="score-pill"
              style={{
                fontSize: "0.85rem",
                padding: "6px 12px",
                background: "white",
                border: "1.5px solid var(--color-dark)",
                borderRadius: "20px",
                color: "var(--color-dark)",
                fontWeight: "bold",
                boxShadow: "0 2px 0 var(--color-dark)",
              }}
            >
              <i
                className="fa-solid fa-star"
                style={{
                  color: "#ffc107",
                  WebkitTextStroke: "1px var(--color-dark)",
                }}
              ></i>{" "}
              <strong id="profil-jumlah-markah">0</strong>
            </span>
          </div>
        </div>

        <div
          className="neo-box"
          style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ margin: "0", fontSize: "1.2rem" }}>
                Senarai Cabaran
              </h3>
              <span
                id="map-progress-count"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  border: "1.5px solid var(--color-dark)",
                }}
              >
                0 Disiapkan
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label
                htmlFor="profile-peta-filter"
                style={{
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  fontFamily:
                    "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                }}
              >
                Filter Peta:
              </label>
              <select
                id="profile-peta-filter"
                className="neo-btn bg-white"
                style={{
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  fontFamily:
                    "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                  borderRadius: "12px",
                  border: "2px solid var(--color-dark)",
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  if ((window as any).filterProfileChallenges)
                    (window as any).filterProfileChallenges(e.target.value);
                }}
              >
                <option value="1">Cabaran Kenal Huruf</option>
                <option value="2">Cabaran Suku Kata Asas</option>
                <option value="3">Cabaran Suku Kata Hero</option>
                <option value="4">Cabaran Bacaan Bergred</option>
              </select>
            </div>
          </div>
          <div
            id="incomplete-modules-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "10px",
            }}
          >
            {/* Auto populated */}
          </div>
        </div>
      </div>

      <div id="lencana-screen" className={getScreenClass("lencana-screen")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-purple back-icon-btn"
            onClick={(e) => {
              paparSkrin("main-menu-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-purple page-title century-gothic-font"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              whiteSpace: "nowrap",
              color: "white",
            }}
          >
            Lencana Saya
          </div>
          <button
            className="neo-btn bg-purple help-btn info-icon-btn"
            id="btn-info-lencana"
            onClick={() => {
              if ((window as any).playBubble) (window as any).playBubble();
              if (typeof (window as any).bukaModalInfoLencana === "function") {
                (window as any).bukaModalInfoLencana();
              }
            }}
            title="Panduan Lencana & Sijil"
            aria-label="Panduan Lencana & Sijil"
            style={{
              position: "absolute",
              right: "clamp(12px, 2.5vw, 24px)",
              top: "50%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "46px",
              minWidth: "46px",
              minHeight: "46px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              color: "white",
              borderRadius: "50%",
              backgroundColor: "var(--color-purple)",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 3.5px 0 var(--color-dark, #10182f)",
              zIndex: 30,
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-lightbulb"></i>
          </button>
        </div>

        <div
          className="lencana-container-box neo-box"
          style={{
            width: "100%",
            maxWidth: "540px",
            margin: "0 auto",
            marginTop: "14px",
            marginBottom: "16px",
            padding: "18px 14px 28px",
            background: "#168f81",
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
            borderRadius: "24px",
            border: "4px solid var(--color-dark)",
            boxShadow: "0 8px 0 var(--color-dark)",
            overflow: "visible",
          }}
        >
          <div
            className="lencana-header-info"
            style={{ textAlign: "center", marginBottom: "8px", display: "flex", justifyContent: "center" }}
          >
            <div
              className="lencana-title-text century-gothic-font neo-badge"
              style={{
                fontSize: "clamp(1.1rem, 3.2vw, 1.45rem)",
                fontWeight: "900",
                color: "white",
                backgroundColor: "var(--color-purple, #9333ea)",
                padding: "8px 24px",
                borderRadius: "18px",
                border: "3px solid var(--color-dark, #10182f)",
                boxShadow: "0 5px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textShadow: "0 2px 4px rgba(0,0,0,0.25)"
              }}
            >
              <i className="fa-solid fa-award" style={{ color: "#fde047", fontSize: "1.3rem" }}></i> Koleksi Lencana Utama
            </div>
          </div>

          {/* 3D Swipe Carousel for 5 Badges displaying 2 in main view */}
          <Suspense fallback={null}>
            <Lencana3DSwiper />
          </Suspense>

          {/* Hidden legacy grid for background script compatibility */}
          <div className="badge-grid" id="badge-grid" style={{ display: "none" }}></div>

          <button
            id="sijil-btn"
            className="neo-btn sijil-download-btn is-locked"
            style={{
              width: "100%",
              marginTop: "16px",
              fontSize: "1.2rem",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #d97706 100%)",
              color: "#10182f",
              fontWeight: "900",
              letterSpacing: "0.5px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              const d = typeof (window as any).getCurrentProfileData === 'function' ? (window as any).getCurrentProfileData() : null;
              const allDone = typeof (window as any).isPetaCompleted === 'function' ? (window as any).isPetaCompleted('all', d) : false;
              const hasMaster = d && d.badges && d.badges.includes('badge_master');
              if (!allDone && !hasMaster) {
                const msg = "Sijil Pencapaian masih terkunci! Dapatkan sekurang-kurangnya 3 bintang (skor penuh) dalam 3 aktiviti untuk setiap 4 cabaran utama (Kenal Huruf, Suku Kata Asas, Suku Kata Hero, dan Bacaan Bergred) untuk membuka sijil ini.";
                if (typeof (window as any).showAppToast === "function") {
                  (window as any).showAppToast("Sijil Masih Terkunci", msg, "warning");
                } else {
                  (window as any).notify(msg);
                }
                return;
              }
              muatTurunSijil();
            }}
          >
            <i
              className="fa-solid fa-lock"
              id="sijil-lock-icon"
              style={{
                fontSize: "1.3rem",
                color: "#10182f",
              }}
            ></i>
            <i
              className="fa-solid fa-certificate"
              id="sijil-main-icon"
              style={{ fontSize: "1.35rem", color: "#10182f", display: "none" }}
            ></i>
            <span className="century-gothic-font" style={{ fontWeight: "900" }}>
              Sijil Pencapaian
            </span>
          </button>

          <div
            className="lencana-sub-info-text century-gothic-font"
            style={{
              marginTop: "26px",
              textAlign: "center",
              color: "#ffffff",
              fontSize: "clamp(0.85rem, 2.2vw, 1.02rem)",
              fontWeight: "700",
              lineHeight: "1.45",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
              padding: "0 10px",
            }}
          >
            Jawab setiap latihan dengan betul untuk memperoleh lencana. Kumpul setiap lencana untuk berpeluang memenangi hadiah menarik.
          </div>
        </div>
      </div>

      {/* Senarai Perkataan Guru */}
      <div id="guru-senarai-perkataan" className="screen">
        <div className="map-top-bar">
          <div
            className="neo-btn bg-orange page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "1.2rem",
            }}
          >
            Senarai Perkataan Suku Kata
          </div>
        </div>
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            marginTop: "20px",
            padding: "20px",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            backgroundColor: "#ea580c",
          }}
        >
          <div
            className="guru-filter-container"
            style={{ marginBottom: "20px" }}
          >
            <label
              htmlFor="guru-modul-select"
              className="century-gothic-font filter-label"
              style={{
                color: "white",
                fontWeight: "bold",
                marginRight: "10px",
                fontSize: "1.1rem",
                whiteSpace: "nowrap",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
            >
              Pilih Kategori:
            </label>
            <select
              id="guru-modul-select"
              className="neo-input century-gothic-font filter-select"
              style={{
                fontSize: "1.1rem",
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                fontWeight: "bold",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
              onChange={(e) => {
                if ((window as any).renderGuruSenaraiPerkataan) {
                  (window as any).renderGuruSenaraiPerkataan(e.target.value, "guru");
                }
              }}
            >
              <option value="suku_kata_kv">KV</option>
              <option value="suku_kata_kv_kv">KV + KV</option>
              <option value="suku_kata_v_kv">V + KV</option>
              <option value="suku_kata_kv_kv_kv">KV + KV + KV</option>
              <option value="suku_kata_kvk">KVK</option>
              <option value="suku_kata_v_kvk">V + KVK</option>
              <option value="suku_kata_kv_kvk">KV + KVK</option>
              <option value="suku_kata_kvk_kv">KVK + KV</option>
              <option value="suku_kata_kvk_kvk">KVK + KVK</option>
              <option value="suku_kata_kvkk">KVKK</option>
              <option value="suku_kata_kv_kv_kvk">KV + KV + KVK</option>
              <option value="suku_kata_kvk_kv_kvk">KVK + KV + KVK</option>
            </select>
          </div>
          <div
            id="guru-perkataan-list"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Generated by JS */}
          </div>
        </div>
      </div>

      {/* Senarai Perkataan Admin */}
      <div id="admin-senarai-perkataan" className={getScreenClass("admin-senarai-perkataan")}>
        <div className="map-top-bar">
          <div
            className="neo-btn page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "1.2rem",
              backgroundColor: "#168f81",
            }}
          >
            Senarai Perkataan Suku Kata
          </div>
        </div>
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            marginTop: "20px",
            padding: "20px",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            backgroundColor: "#168f81",
          }}
        >
          <div
            className="guru-filter-container"
            style={{ marginBottom: "20px" }}
          >
            <label
              htmlFor="admin-modul-select"
              className="century-gothic-font filter-label"
              style={{
                color: "white",
                fontWeight: "bold",
                marginRight: "10px",
                fontSize: "1.1rem",
                whiteSpace: "nowrap",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
            >
              Pilih Kategori:
            </label>
            <select
              id="admin-modul-select"
              className="neo-input century-gothic-font filter-select"
              style={{
                fontSize: "1.1rem",
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                fontWeight: "bold",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
              onChange={(e) => {
                if ((window as any).renderGuruSenaraiPerkataan) {
                  (window as any).renderGuruSenaraiPerkataan(e.target.value, "admin");
                }
              }}
            >
              <option value="suku_kata_kv">KV</option>
              <option value="suku_kata_kv_kv">KV + KV</option>
              <option value="suku_kata_v_kv">V + KV</option>
              <option value="suku_kata_kv_kv_kv">KV + KV + KV</option>
              <option value="suku_kata_kvk">KVK</option>
              <option value="suku_kata_v_kvk">V + KVK</option>
              <option value="suku_kata_kv_kvk">KV + KVK</option>
              <option value="suku_kata_kvk_kv">KVK + KV</option>
              <option value="suku_kata_kvk_kvk">KVK + KVK</option>
              <option value="suku_kata_kvkk">KVKK</option>
              <option value="suku_kata_kv_kv_kvk">KV + KV + KVK</option>
              <option value="suku_kata_kvk_kv_kvk">KVK + KV + KVK</option>
            </select>
          </div>
          <div
            id="admin-perkataan-list"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Generated by JS */}
          </div>
        </div>
      </div>

      {/* Senarai Perkataan Ibu Bapa */}
      <div id="ibubapa-senarai-perkataan" className="screen">
        <div className="map-top-bar">
          <div
            className="neo-btn page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "1.2rem",
              backgroundColor: "#0284c7",
            }}
          >
            Senarai Perkataan Suku Kata
          </div>
        </div>
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            marginTop: "20px",
            padding: "20px",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            backgroundColor: "#0284c7",
          }}
        >
          <div
            className="guru-filter-container"
            style={{ marginBottom: "20px" }}
          >
            <label
              htmlFor="ibubapa-modul-select"
              className="century-gothic-font filter-label"
              style={{
                color: "white",
                fontWeight: "bold",
                marginRight: "10px",
                fontSize: "1.1rem",
                whiteSpace: "nowrap",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
            >
              Pilih Kategori:
            </label>
            <select
              id="ibubapa-modul-select"
              className="neo-input century-gothic-font filter-select"
              style={{
                fontSize: "1.1rem",
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                fontWeight: "bold",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
              }}
              onChange={(e) => {
                if ((window as any).renderGuruSenaraiPerkataan) {
                  (window as any).renderGuruSenaraiPerkataan(e.target.value, "ibubapa");
                }
              }}
            >
              <option value="suku_kata_kv">KV</option>
              <option value="suku_kata_kv_kv">KV + KV</option>
              <option value="suku_kata_v_kv">V + KV</option>
              <option value="suku_kata_kv_kv_kv">KV + KV + KV</option>
              <option value="suku_kata_kvk">KVK</option>
              <option value="suku_kata_v_kvk">V + KVK</option>
              <option value="suku_kata_kv_kvk">KV + KVK</option>
              <option value="suku_kata_kvk_kv">KVK + KV</option>
              <option value="suku_kata_kvk_kvk">KVK + KVK</option>
              <option value="suku_kata_kvkk">KVKK</option>
              <option value="suku_kata_kv_kv_kvk">KV + KV + KVK</option>
              <option value="suku_kata_kvk_kv_kvk">KVK + KV + KVK</option>
            </select>
          </div>
          <div
            id="ibubapa-perkataan-list"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Generated by JS */}
          </div>
        </div>
      </div>

      {/*  Mod Admin (Dashboard Sistem)  */}
      <Suspense fallback={null}>
        <AdminDashboard getScreenClass={getScreenClass} />
      </Suspense>

      {/* Mod Admin - Urus Sijil Bunyi Kata */}
      <div id="admin-sijil" className={getScreenClass("admin-sijil")} style={{ paddingBottom: "100px" }}>
        <Suspense fallback={null}>
          <AdminSijilManager />
        </Suspense>
      </div>

      {/*  Mod Guru (Dashboard Live Tracking)  */}
      <Suspense fallback={null}>
        <GuruDashboard
        getScreenClass={getScreenClass}
        userAccessLevel={userAccessLevel}
        isEffectiveTrial={isEffectiveTrial}
        isEffectivePro={isEffectivePro}
        getSubscriptionBadgeInfo={getSubscriptionBadgeInfo}
        isReportDialOpen={isReportDialOpen}
        setIsReportDialOpen={setIsReportDialOpen}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        setShowGuruSijilModal={setShowGuruSijilModal}
        selectedExportPeta={selectedExportPeta}
        setSelectedExportPeta={setSelectedExportPeta}
        exportSchoolInput={exportSchoolInput}
        setExportSchoolInput={setExportSchoolInput}
        exportClassInput={exportClassInput}
        setExportClassInput={setExportClassInput}
        exportTeacherInput={exportTeacherInput}
        setExportTeacherInput={setExportTeacherInput}
        setIsProPricingModalOpen={setIsProPricingModalOpen}
        setEditModalError={setEditModalError}
        setIsMandatorySetup={setIsMandatorySetup}
        setTeacherCanHaveClass2={setTeacherCanHaveClass2}
        setTeacherPlanName={setTeacherPlanName}
        setEditKodTemp={setEditKodTemp}
        setEditKelasTemp={setEditKelasTemp}
        setEditSekolahTemp={setEditSekolahTemp}
        setEditAvatarTemp={setEditAvatarTemp}
        setEditGuruTemp={setEditGuruTemp}
        setEditModalMode={setEditModalMode}
        setIsEditModalOpen={setIsEditModalOpen}
        setEditKod2Temp={setEditKod2Temp}
        setEditKelas2Temp={setEditKelas2Temp}
        editKodTemp={editKodTemp}
        editKelasTemp={editKelasTemp}
        editKod2Temp={editKod2Temp}
        editKelas2Temp={editKelas2Temp}
        teacherCanHaveClass2={teacherCanHaveClass2}
        isChangingCode1={isChangingCode1}
        setIsChangingCode1={setIsChangingCode1}
        newCode1Input={newCode1Input}
        setNewCode1Input={setNewCode1Input}
        isChangingCode2={isChangingCode2}
        setIsChangingCode2={setIsChangingCode2}
        newCode2Input={newCode2Input}
        setNewCode2Input={setNewCode2Input}
        isChangingClassName1={isChangingClassName1}
        setIsChangingClassName1={setIsChangingClassName1}
        newClassName1Input={newClassName1Input}
        setNewClassName1Input={setNewClassName1Input}
        isChangingClassName2={isChangingClassName2}
        setIsChangingClassName2={setIsChangingClassName2}
        newClassName2Input={newClassName2Input}
        setNewClassName2Input={setNewClassName2Input}
        handleSaveClassName1={handleSaveClassName1}
        handleSaveClassCode1={handleSaveClassCode1}
        handleSaveClassName2={handleSaveClassName2}
        handleSaveClassCode2={handleSaveClassCode2}
      />
      </Suspense>

      {/* Modal: Sijil Pencapaian (Mod Guru) */}
      {showGuruSijilModal && (
        <div
          id="modal-guru-sijil"
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(5px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 8px",
          }}
          onClick={() => {
            if ((window as any).playBubble) (window as any).playBubble();
            setShowGuruSijilModal(false);
          }}
        >
          <div
            className="modal-content neo-box"
            style={{
              maxWidth: "1240px",
              width: "100%",
              maxHeight: "96vh",
              overflowY: "auto",
              borderRadius: "24px",
              padding: "12px 8px",
              position: "relative",
              backgroundColor: "#fffdf8",
              border: "3.5px solid var(--color-dark)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 8px 8px 0 var(--color-dark)",
              backgroundImage: "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={null}>
              <AdminSijilManager isGuruMode={true} onClose={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                setShowGuruSijilModal(false);
              }} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Screen: Mod Ibu Bapa (Dashboard Statistik Anak) */}
      <Suspense fallback={null}>
        <IbubapaDashboard
          getScreenClass={getScreenClass}
          getSubscriptionBadgeInfo={getSubscriptionBadgeInfo}
          onOpenProPricing={() => setIsProPricingModalOpen(true)}
          onEditProfile={handleEditIbubapaProfile}
        />
      </Suspense>

      {/* Screen: Mod Affiliate (Fasa 3 — panel kendiri affiliate) */}
      <Suspense fallback={null}>
        <AffiliateDashboard
          getScreenClass={getScreenClass}
          onLogout={async () => {
            try {
              const { logout } = await import("./services/authService");
              await logout();
            } catch (e) {
              /* abaikan */
            }
            localStorage.removeItem("bunyiKataUserRole");
            localStorage.removeItem("bunyiKataNamaAffiliate");
            (window as any).modAffiliateAktif = false;
            setIsAffiliateActive(false);
            if (typeof (window as any).keluarModAffiliate === "function") {
              (window as any).keluarModAffiliate();
            } else if (typeof (window as any).keluarKeSkrinLogin === "function") {
              (window as any).keluarKeSkrinLogin();
            } else if (typeof (window as any).paparSkrin === "function") {
              (window as any).paparSkrin("login-screen");
            } else {
              window.location.reload();
            }
          }}
          onEditProfile={() => {
            setEditModalError("");
            setIsMandatorySetup(false);
            setEditModalMode("affiliate");
            setIsChangingPassword(false);
            setNewPasswordInput("");
            setIsEditModalOpen(true);
          }}
        />
      </Suspense>

      {/*  Modal Bantuan  */}
      <div
        id="modal-bantuan"
        className="modal-overlay"
        onClick={(e) => {
          tutupBantuan();
        }}
      >
        <div
          className="modal-content bantuan-content"
          style={{ maxWidth: "450px" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              tutupBantuan();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            style={{
              fontSize: "4rem",
              color: "var(--color-orange)",
              marginBottom: "10px",
              animation: "float 2s ease-in-out infinite",
            }}
          >
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              marginBottom: "15px",
              color: "var(--color-dark)",
            }}
          >
            Cara Bermain
          </h2>
          <p
            id="teks-bantuan"
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              lineHeight: "1.6",
              color: "var(--color-dark)",
              marginBottom: "20px",
            }}
          ></p>
          <button
            className="neo-btn bg-green"
            style={{ width: "100%", fontSize: "1.2rem" }}
            onClick={(e) => {
              tutupBantuan();
            }}
          >
            <i className="fa-solid fa-thumbs-up"></i> Faham!
          </button>
        </div>
      </div>

      {/*  Ganjaran Celebration  */}
      <div
        id="ganjaran-celebration"
        style={{
          display: "none",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.65)",
          zIndex: "9999",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="modal-content neo-box"
          style={{
            maxWidth: "430px",
            width: "92%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            padding: "28px 20px 22px",
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.06) 1.5px, transparent 1.5px)",
            backgroundSize: "15px 15px",
            border: "4px solid var(--color-dark, #10182f)",
            boxShadow: "0 12px 0 var(--color-dark, #10182f), 0 20px 30px rgba(0,0,0,0.25)",
            fontFamily: "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif"
          }}
        >
          {/* Top Title Banner matching Cabaran Utama */}
          <div style={{ position: "relative", marginTop: "-4px", display: "inline-block" }}>
            <div
              style={{
                backgroundColor: "#a855f7",
                backgroundImage: "linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)",
                border: "3.5px solid #0f172a",
                borderRadius: "18px",
                boxShadow: "0 5px 0 #0f172a",
                padding: "3px",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  border: "2.5px solid #4c1d95",
                  borderRadius: "12px",
                  backgroundColor: "#a855f7",
                  backgroundImage: "linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)",
                  padding: "8px 28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2
                  id="ganjaran-celebration-title"
                  style={{
                    fontSize: "clamp(1.45rem, 5vw, 2rem)",
                    whiteSpace: "nowrap",
                    color: "#ffffff",
                    fontWeight: "900",
                    margin: 0,
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    textShadow: "0 2px 4px rgba(0,0,0,0.35)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Tahniah Anda Hebat!
                </h2>
              </div>
            </div>
          </div>

          {/* 3 Stars (Top) */}
          <div
            id="ganjaran-stars-3-box"
            style={{
              display: "flex",
              gap: "8px",
              margin: "4px 0 0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Left Star */}
            <div id="ganjaran_star_left" style={{ transform: "rotate(-15deg)", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))" }}>
              <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="starGold_gc_1" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="75%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path id="ganjaran_star_left_path" d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_gc_1)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>

            {/* Center Star (Bigger) */}
            <div id="ganjaran_star_center" style={{ transform: "scale(1.15)", filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))", zIndex: 2 }}>
              <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="starGold_gc_2" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="75%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path id="ganjaran_star_center_path" d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_gc_2)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>

            {/* Right Star */}
            <div id="ganjaran_star_right" style={{ transform: "rotate(15deg)", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))" }}>
              <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="starGold_gc_3" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="75%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path id="ganjaran_star_right_path" d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_gc_3)" stroke="#10182f" strokeWidth="4.5" strokeLinejoin="round" />
                <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>
          </div>

          {/* Dashed Score Box with Outline Glow Loop */}
          <div
            style={{
              width: "100%",
              border: "2.5px dashed #94a3b8",
              borderRadius: "18px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "0.88rem",
                fontWeight: "900",
                color: "#0f172a",
                letterSpacing: "0.5px",
                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                marginBottom: "6px",
              }}
            >
              ANDA MENDAPAT
            </div>
            <div
              id="ganjaran-score-pill-box"
              className="score-box-glow-pulse"
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid #0f172a",
                borderRadius: "16px",
                padding: "4px 34px",
                margin: "6px 0",
                width: "100%",
                maxWidth: "170px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <span
                id="ganjaran-celebration-star-count"
                style={{
                  fontSize: "2.4rem",
                  fontWeight: "900",
                  color: "#0f172a",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  lineHeight: 1,
                }}
              >
                3
              </span>
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: "900",
                color: "#0f172a",
                letterSpacing: "1px",
                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
              }}
            >
              <span style={{ color: "#f59e0b", margin: "0 4px" }}>•••••</span>
              BINTANG
              <span style={{ color: "#f59e0b", margin: "0 4px" }}>•••••</span>
            </div>
          </div>

          {/* Motivation Info Card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              border: "2.5px solid #0f172a",
              borderRadius: "16px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
              boxShadow: "0 4px 0 #0f172a",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                backgroundColor: "#fef9c3",
                border: "2px solid #0f172a",
                boxShadow: "0 2px 0 #0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill="#facc15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 21H15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 9L12 7L14 9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                id="ganjaran-celebration-subhead"
                style={{
                  fontWeight: "900",
                  fontSize: "0.88rem",
                  color: "#0f172a",
                  lineHeight: 1.2,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tahniah, Anda Hebat!
              </div>
              <div
                id="ganjaran-celebration-text"
                style={{
                  fontSize: "0.78rem",
                  color: "#475569",
                  fontWeight: "600",
                  marginTop: "2px",
                  lineHeight: 1.2,
                }}
              >
                Pembelajaran akan menjadikan anda lebih baik.
              </div>
            </div>
          </div>

          {/* Bottom 3 Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "100%",
              marginTop: "4px",
            }}
          >
            <button
              id="ganjaran-lencana-btn"
              className="neo-btn bg-purple"
              title="Koleksi Lencana"
              aria-label="Koleksi Lencana"
              style={{
                padding: "12px 16px",
                fontSize: "1.35rem",
                flex: "1",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#9333ea",
                color: "#ffffff",
              }}
              onClick={() => {
                const celebration = document.getElementById("ganjaran-celebration");
                if (celebration) celebration.style.display = "none";
                if (typeof (window as any).tutupARSukuKata === "function") {
                  (window as any).tutupARSukuKata();
                }
                if (typeof (window as any).paparSkrin === "function") {
                  (window as any).paparSkrin("lencana-screen");
                }
              }}
            >
              <i className="fa-solid fa-award"></i>
            </button>
            <button
              id="ganjaran-retry-btn"
              className="neo-btn bg-red"
              title="Main Semula"
              aria-label="Main Semula"
              style={{
                padding: "12px 16px",
                fontSize: "1.35rem",
                flex: "1",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
            <button
              id="ganjaran-continue-btn"
              className="neo-btn bg-orange"
              title="Menu Seterusnya"
              aria-label="Menu Seterusnya"
              style={{
                padding: "12px 16px",
                fontSize: "1.35rem",
                flex: "1",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/*  Modal Pilih Avatar  */}
      <div id="modal-pilih-avatar" className="modal-overlay">
        <div
          className="modal-content"
          style={{ maxWidth: "500px", textAlign: "center" }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-avatar").style.display =
                "none";
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            className="modal-title-green-badge"
            style={{
              backgroundColor: "#168f81",
              color: "#ffffff",
              marginBottom: "14px",
            }}
          >
            Edit Profil &amp; Avatar
          </h2>
          <div
            id="avatar-modal-stars-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              background: "#fef3c7",
              border: "1.5px solid #d97706",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "0.85rem",
              color: "#92400e",
              marginBottom: "15px",
            }}
          >
            <i className="fa-solid fa-star" style={{ color: "#ffc107" }}></i> 0
            Bintang Diperoleh
          </div>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "var(--color-dark)",
              }}
            >
              Nama Anda
            </label>
            <input
              type="text"
              id="edit-nama-input"
              className="neo-input"
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid var(--color-dark)",
                borderRadius: "8px",
                fontSize: "1.1rem",
                marginBottom: "15px",
              }}
              placeholder="Nama Anda"
              onKeyDown={(e) => e.stopPropagation()}
            />
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "var(--color-dark)",
              }}
            >
              Pilih Avatar
            </label>
            <div
              id="avatar-options"
              style={{
                width: "100%",
                position: "relative",
                marginBottom: "15px",
              }}
            >
              {/*  Dijana oleh JS 3D Swiper  */}
            </div>
          </div>
          <button
            className="neo-btn"
            style={{
              width: "100%",
              backgroundColor: "#168f81",
              color: "white",
              fontSize: "1.1rem",
              padding: "12px",
              fontWeight: "bold",
            }}
            onClick={(e) => {
              simpanProfilEdit();
            }}
          >
            Simpan Profil
          </button>
        </div>
      </div>

      <div id="modal-pilih-jenis-huruf" className="modal-overlay">
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) !important",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-jenis-huruf").style.display =
                "none";
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            id="modal-pilih-jenis-huruf-title"
            className="modal-title-orange-badge"
          >
            Kenali Huruf
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              className="neo-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-jenis-huruf");
                if (modal) modal.style.display = "none";
                (window as any).phonicsMode = 'kenali_huruf';
                (window as any).paparSkrin?.("view-belajar-fonik");
              }}
              style={{
                fontSize: "1.15rem",
                fontWeight: "bold",
                padding: "16px 20px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Huruf Kecil (a-z)
            </button>
            <button
              className="neo-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-jenis-huruf");
                if (modal) modal.style.display = "none";
                (window as any).phonicsMode = 'kenali_huruf';
                (window as any).paparSkrin?.("view-belajar-fonik");
              }}
              style={{
                fontSize: "1.15rem",
                fontWeight: "bold",
                padding: "16px 20px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Huruf Besar (A-Z)
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih Vokal / Konsonan */}
      <div id="modal-pilih-vokal-konsonan" className="modal-overlay" style={{ display: "none", zIndex: 3000 }}>
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) !important",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-vokal-konsonan").style.display = "none";
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            id="modal-pilih-vokal-konsonan-title"
            className="modal-title-orange-badge"
          >
            Vokal dan Konsonan
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              className="neo-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-vokal-konsonan");
                if (modal) modal.style.display = "none";
                (window as any).phonicsMode = 'vokal_konsonan';
                (window as any).phonicsFilter = 'vokal';
                (window as any).paparSkrin?.("view-belajar-fonik");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Huruf Vokal
            </button>
            <button
              className="neo-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-vokal-konsonan");
                if (modal) modal.style.display = "none";
                (window as any).phonicsMode = 'vokal_konsonan';
                (window as any).phonicsFilter = 'konsonan';
                (window as any).paparSkrin?.("view-belajar-fonik");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Huruf Konsonan
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih Jenis Nombor */}
      <div id="modal-pilih-jenis-nombor" className="modal-overlay" style={{ display: "none", zIndex: 3000, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <div
          className="modal-content"
          style={{
            maxWidth: "480px",
            width: "90%",
            textAlign: "center",
            padding: "28px 20px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            position: "relative",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            id="modal-pilih-jenis-nombor-title"
            className="modal-title-orange-badge"
          >
            Asas Nombor
          </h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", width: "100%" }}
          >
            {/* Square Card Nombor 0-10 */}
            <div
              className="neo-btn"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 10px 16px",
                cursor: "pointer",
                borderRadius: "22px",
                border: "3.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                transition: "all 0.15s ease",
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                gap: "14px",
                boxSizing: "border-box",
                position: "relative"
              }}
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
                if ((window as any).isPercumaMode && (window as any).isPercumaMode()) {
                  if (typeof (window as any).kunciPro === "function") (window as any).kunciPro();
                  return;
                }
                (window as any).nomborMode = "asas_nombor";
                (window as any).nomborFilter = "0_10";
                window.dispatchEvent(new CustomEvent("set-nombor-mode", { detail: { mode: "asas_nombor", filter: "0_10" } }));
                if ((window as any).paparSkrin) (window as any).paparSkrin("view-belajar-nombor");
              }}
            >
              {/* Animated 1, 2, 3 Logo Tiles with Stars */}
              <div style={{ position: "relative", display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "center", padding: "6px 8px" }}>
                {/* Sparkle Star 1 (Top-Left) */}
                <motion.div
                  animate={{
                    scale: [0.85, 1.25, 0.85],
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.75, 1, 0.75]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "-10px",
                    width: "19px",
                    height: "19px",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 2,
                    filter: "drop-shadow(0 2px 4px rgba(250, 204, 21, 0.8))"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
                    <path
                      d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
                      fill="url(#sparkle-grad-popup-asas-0-10-tl)"
                    />
                    <defs>
                      <linearGradient id="sparkle-grad-popup-asas-0-10-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fffbeb" />
                        <stop offset="50%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Sparkle Star 2 (Top-Right) */}
                <motion.div
                  animate={{
                    scale: [1.2, 0.8, 1.2],
                    rotate: [360, 270, 180, 90, 0],
                    opacity: [1, 0.65, 1]
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: "absolute",
                    top: "-11px",
                    right: "-8px",
                    width: "17px",
                    height: "17px",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 2,
                    filter: "drop-shadow(0 2px 4px rgba(251, 113, 133, 0.8))"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
                    <path
                      d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z"
                      fill="url(#star-grad-popup-asas-0-10-tr)"
                      stroke="#1e293b"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="star-grad-popup-asas-0-10-tr" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff1f2" />
                        <stop offset="40%" stopColor="#fda4af" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [-3, 2, -3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                  className="popup-tile-1"
                  style={{ width: "36px", height: "36px", background: "#facc15", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #ca8a04, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  1
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                  className="popup-tile-2"
                  style={{ width: "36px", height: "36px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  2
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                  className="popup-tile-3"
                  style={{ width: "36px", height: "36px", background: "#fb7185", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #e11d48, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  3
                </motion.div>
              </div>
              {/* Ayat Nombor 0-10 di baris bawah */}
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                Nombor 0-10
              </span>
              {isPercumaUI && proBadge}
            </div>

            {/* Square Card Siri Nombor 10-100 */}
            <div
              className="neo-btn"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 10px 16px",
                cursor: "pointer",
                borderRadius: "22px",
                border: "3.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                transition: "all 0.15s ease",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                gap: "14px",
                boxSizing: "border-box",
                position: "relative"
              }}
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
                if ((window as any).isPercumaMode && (window as any).isPercumaMode()) {
                  if (typeof (window as any).kunciPro === "function") (window as any).kunciPro();
                  return;
                }
                (window as any).nomborMode = "asas_nombor";
                (window as any).nomborFilter = "siri_nombor";
                window.dispatchEvent(new CustomEvent("set-nombor-mode", { detail: { mode: "asas_nombor", filter: "siri_nombor" } }));
                if ((window as any).paparSkrin) (window as any).paparSkrin("view-belajar-nombor");
              }}
            >
              {/* Animated 10, 20, 30 Logo Tiles with Stars */}
              <div style={{ position: "relative", display: "inline-flex", gap: "5px", alignItems: "center", justifyContent: "center", padding: "6px 8px" }}>
                {/* Sparkle Star 1 (Top-Left) */}
                <motion.div
                  animate={{
                    scale: [0.85, 1.25, 0.85],
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.75, 1, 0.75]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "-10px",
                    width: "19px",
                    height: "19px",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 2,
                    filter: "drop-shadow(0 2px 4px rgba(250, 204, 21, 0.8))"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
                    <path
                      d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
                      fill="url(#sparkle-grad-popup-asas-10-100-tl)"
                    />
                    <defs>
                      <linearGradient id="sparkle-grad-popup-asas-10-100-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fffbeb" />
                        <stop offset="50%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Sparkle Star 2 (Top-Right) */}
                <motion.div
                  animate={{
                    scale: [1.2, 0.8, 1.2],
                    rotate: [360, 270, 180, 90, 0],
                    opacity: [1, 0.65, 1]
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: "absolute",
                    top: "-11px",
                    right: "-8px",
                    width: "17px",
                    height: "17px",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 2,
                    filter: "drop-shadow(0 2px 4px rgba(251, 113, 133, 0.8))"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
                    <path
                      d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z"
                      fill="url(#star-grad-popup-asas-10-100-tr)"
                      stroke="#1e293b"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="star-grad-popup-asas-10-100-tr" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff1f2" />
                        <stop offset="40%" stopColor="#fda4af" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [-3, 2, -3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                  className="popup-tile-1"
                  style={{ minWidth: "38px", height: "36px", padding: "0 4px", background: "#facc15", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #ca8a04, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.0rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  10
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                  className="popup-tile-2"
                  style={{ minWidth: "38px", height: "36px", padding: "0 4px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.0rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  20
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                  className="popup-tile-3"
                  style={{ minWidth: "38px", height: "36px", padding: "0 4px", background: "#fb7185", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #e11d48, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.0rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                >
                  30
                </motion.div>
              </div>
              {/* Ayat Siri Nombor 10-100 di baris bawah */}
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                Siri Nombor 10-100
              </span>
              {isPercumaUI && proBadge}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pilih Tanduk Kata */}
      <div
        id="modal-pilih-tanduk-kata"
        className="modal-overlay"
        style={{ display: "none", zIndex: 3000 }}
      >
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={() =>
            (document.getElementById(
              "modal-pilih-tanduk-kata",
            ).style.display = "none")
            }
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            className="modal-title-orange-badge"
          >
            <i className="fa-solid fa-gamepad"></i> Misi Tanduk Kata
          </h2>
          <p
            style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}
          >
            Pilih kemahiran suku kata untuk mula bermain:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {["KV", "KV + KV", "V + KV", "KV + KV + KV", "KVK", "V + KVK"].map(
              (cat, idx) => (
                <button
                  key={cat}
                  className="neo-btn"
                  style={{
                    width: "100%",
                    fontSize: "0.95rem",
                    padding: "12px",
                    backgroundColor: "#c1a472",
                    color: "#ffffff",
                  }}
                  onClick={() => {
                    document.getElementById(
                      "modal-pilih-tanduk-kata",
                    ).style.display = "none";
                    (window as any).mulaTandukKata &&
                      (window as any).mulaTandukKata(cat);
                  }}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div
        id="modal-pilih-suku-kata-hero"
        className="modal-overlay"
        style={{ display: "none", zIndex: 3000 }}
      >
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={() =>
            (document.getElementById(
              "modal-pilih-suku-kata-hero",
            ).style.display = "none")
            }
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            className="modal-title-orange-badge"
          >
            <i className="fa-solid fa-gamepad"></i> Misi Tanduk Kata
          </h2>
          <p
            style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}
          >
            Pilih kemahiran suku kata untuk mula bermain:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {[
              "KV + KVK",
              "KVK + KV",
              "KVK + KVK",
              "KVKK",
              "KV + KV + KVK",
              "KVK + KV + KVK",
            ].map((cat, idx) => (
              <button
                key={cat}
                className="neo-btn"
                style={{
                  width: "100%",
                  fontSize: "0.95rem",
                  padding: "12px",
                  backgroundColor: "#ff751f",
                  color: "#ffffff",
                }}
                onClick={() => {
                  document.getElementById(
                    "modal-pilih-suku-kata-hero",
                  ).style.display = "none";
                  (window as any).mulaTandukKata &&
                    (window as any).mulaTandukKata(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Surih Nombor */}
      <div id="view-surih-nombor" className={getScreenClass("view-surih-nombor")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Surih Nombor
          </div>
          <div></div>
        </div>

        <div
          id="surih-nombor-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
            padding: "clamp(12px, 4vw, 25px)",
            backgroundColor: "#168f81",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "20px 20px",
            borderRadius: "24px",
            border: "4px solid var(--color-dark)",
            boxShadow: "var(--shadow-hard)",
          }}
        >
          {/* Navigasi Nombor */}
          <div
            id="surih-nombor-nav-bar"
            style={{
              display: "flex",
              gap: "5px",
              overflowX: "auto",
              width: "100%",
              padding: "10px",
              background: "#ffffff",
              borderRadius: "12px",
              border: "2px solid var(--color-dark)",
              fontFamily: "var(--font-main)",
            }}
          >
            {/* Dijana oleh JS */}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              id="surih-nombor-prev-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihNomborTukar && window.surihNomborTukar(-1);
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            <select
              id="surih-nombor-kategori"
              className="neo-input"
              style={{
                margin: "0",
                flex: "1",
                maxWidth: "250px",
                padding: "8px 12px",
                fontSize: "0.95rem",
                textAlign: "center",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, 'AtlantaRounded', sans-serif",
              }}
              onChange={(e) => {
                window.surihNomborSetKategori && window.surihNomborSetKategori(e.target.value);
              }}
            >
              <option value="0-10">0 hingga 10</option>
              <option value="siri">Siri Nombor</option>
            </select>

            <button
              id="surih-nombor-next-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihNomborTukar && window.surihNomborTukar(1);
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* Canvas Area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              maxWidth: "600px",
            }}
          >
            <canvas
              id="surih-nombor-canvas"
              width="600"
              height="400"
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "4px solid #8b5a2b",
                boxShadow: "inset 0 4px 0px rgba(0,0,0,0.1)",
                cursor: "crosshair",
                width: "100%",
                height: "auto",
                aspectRatio: "3/2",
                touchAction: "none",
              }}
            ></canvas>
            <div
              id="surih-nombor-confetti"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            ></div>
          </div>

          {/* Status & Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="neo-btn bg-orange"
              style={{ flex: "1", minWidth: "140px" }}
              onClick={(e) => {
                window.surihNomborTunjukCara && window.surihNomborTunjukCara();
              }}
            >
              <i className="fa-solid fa-play"></i> Tunjuk Cara
            </button>
            <button
              className="neo-btn bg-green"
              style={{ flex: "1", minWidth: "140px" }}
              onClick={(e) => {
                window.surihNomborReset && window.surihNomborReset();
              }}
            >
              <i className="fa-solid fa-rotate-right"></i> Cuba Lagi
            </button>
            <div id="surih-nombor-score" style={{ display: "none" }}>
              <span id="surih-nombor-stars"></span>
            </div>
          </div>
        </div>
      </div>


      {/* Surih Huruf */}
      <div id="view-surih-huruf" className={getScreenClass("view-surih-huruf")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Surih Huruf
          </div>
          <div></div>
        </div>

        <div
          id="surih-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
            padding: "clamp(12px, 4vw, 25px)",
            backgroundColor: "#168f81",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "20px 20px",
            borderRadius: "24px",
            border: "4px solid var(--color-dark)",
            boxShadow: "var(--shadow-hard)",
          }}
        >
          {/* Navigasi Huruf */}
          <div
            id="surih-nav-bar"
            style={{
              display: "flex",
              gap: "5px",
              overflowX: "auto",
              width: "100%",
              padding: "10px",
              background: "#ffffff",
              borderRadius: "12px",
              border: "2px solid var(--color-dark)",
              fontFamily: "var(--font-main)",
            }}
          >
            {/* Dijana oleh JS */}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              id="surih-prev-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihTukarHuruf && window.surihTukarHuruf(-1);
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <select
              id="surih-jenis-huruf"
              className="neo-input"
              style={{
                margin: "0",
                flex: "1",
                maxWidth: "250px",
                padding: "8px 12px",
                fontSize: "0.95rem",
                fontFamily:
                  "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, 'AtlantaRounded', sans-serif",
              }}
              onChange={(e) => {
                window.surihSetJenis && window.surihSetJenis(e.target.value);
              }}
            >
              <option value="both">Besar & Kecil</option>
              <option value="uppercase">Besar Sahaja</option>
              <option value="lowercase">Kecil Sahaja</option>
            </select>
            <button
              id="surih-next-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihTukarHuruf && window.surihTukarHuruf(1);
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* Canvas Area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              maxWidth: "600px",
            }}
          >
            <canvas
              id="surih-canvas"
              width="600"
              height="400"
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "4px solid #8b5a2b",
                boxShadow: "inset 0 4px 0px rgba(0,0,0,0.1)",
                cursor: "crosshair",
                width: "100%",
                height: "auto",
                aspectRatio: "3/2",
                touchAction: "none",
              }}
            ></canvas>
            <div
              id="surih-confetti"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            ></div>
          </div>

          {/* Status & Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="neo-btn bg-orange"
              style={{ flex: "1", minWidth: "140px" }}
              onClick={(e) => {
                window.surihTunjukCara && window.surihTunjukCara();
              }}
            >
              <i className="fa-solid fa-play"></i> Tunjuk Cara
            </button>
            <button
              className="neo-btn bg-green"
              style={{ flex: "1", minWidth: "140px" }}
              onClick={(e) => {
                window.surihReset && window.surihReset();
              }}
            >
              <i className="fa-solid fa-rotate-right"></i> Cuba Lagi
            </button>
            <div id="surih-score" style={{ display: "none" }}>
              <span id="surih-stars"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tanduk Kata Game */}
      <div
        id="view-tanduk-kata"
        className={getScreenClass("view-tanduk-kata")}
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <TandukKataGame
            onClose={() => {
              const event = new CustomEvent("tukar-skrin", {
                detail: { skrin: "map-screen" },
              });
              window.dispatchEvent(event);
              if (window.paparSkrin) window.paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Perpustakaan Game */}
      <div
        id="view-perpustakaan"
        className={`screen ${isPerpustakaanOpen ? "active" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          zIndex: 9999,
          display: isPerpustakaanOpen ? "block" : "none",
        }}
      >
        {isPerpustakaanOpen && (
          <Suspense fallback={null}>
            <PerpustakaanGame
              isHeroMode={isPerpustakaanHeroMode}
              onClose={() => {
                setIsPerpustakaanOpen(false);
                const event = new CustomEvent("tukar-skrin", {
                  detail: { skrin: "map-screen" },
                });
                window.dispatchEvent(event);
                if (window.paparSkrin) window.paparSkrin("map-screen");
              }}
            />
          </Suspense>
        )}
      </div>

      {/* Puzzle Suku Kata Game */}
      <div
        id="view-puzzle-sukukata"
        className={getScreenClass("view-puzzle-sukukata")}
        style={{
          padding: "16px",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <PuzzleSukuKataGame
            onClose={() => {
              const event = new CustomEvent("tukar-skrin", {
                detail: { skrin: "map-screen" },
              });
              window.dispatchEvent(event);
              if (window.paparSkrin) window.paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Cantum Kata Game */}
      <div
        id="view-cantum-kata"
        className={getScreenClass("view-cantum-kata")}
        style={{
          padding: "16px",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <CantumKataGame
            onClose={() => {
              const event = new CustomEvent("tukar-skrin", {
                detail: { skrin: "map-screen" },
              });
              window.dispatchEvent(event);
              if (window.paparSkrin) window.paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Cabaran Suku Kata Game */}
      <div
        id="view-cabaran-suku-kata"
        className={getScreenClass("view-cabaran-suku-kata")}
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <CabaranSukuKataGame
            onClose={() => {
              if ((window as any).currentPeta && (window as any).bukaPeta) {
                (window as any).bukaPeta((window as any).currentPeta, true);
              }
              if ((window as any).paparSkrin)
                (window as any).paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Pembelajaran Fonik ABC Game */}
      <div
        id="view-belajar-fonik"
        className={getScreenClass("view-belajar-fonik")}
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <FonikAbcGame
            onClose={() => {
              if ((window as any).currentPeta && (window as any).bukaPeta) {
                (window as any).bukaPeta((window as any).currentPeta, true);
              }
              if ((window as any).paparSkrin)
                (window as any).paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Pembelajaran Nombor (Asas, Tambah, Tolak) */}
      <div
        id="view-belajar-nombor"
        className={getScreenClass("view-belajar-nombor")}
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <NomborGame
            onClose={() => {
              if ((window as any).currentPeta && (window as any).bukaPeta) {
                (window as any).bukaPeta((window as any).currentPeta, true);
              }
              if ((window as any).paparSkrin)
                (window as any).paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* Kad Imbasan Nombor (Asas 0-10 & Siri Nombor) */}
      <div
        id="view-kad-imbasan-nombor"
        className={getScreenClass("view-kad-imbasan-nombor")}
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Suspense fallback={null}>
          <KadImbasanNomborGame
            key={kadImbasanNomborMode}
            initialMode={kadImbasanNomborMode}
            onBack={() => {
              if ((window as any).paparSkrin) (window as any).paparSkrin("map-screen");
            }}
          />
        </Suspense>
      </div>

      {/* VR ABC */}
      <div id="view-vr-abc" className={getScreenClass("view-vr-abc")} style={{ padding: 0, margin: 0, position: "relative", background: "none" }}>
        <div
          className="map-top-bar"
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            width: "calc(100% - 40px)",
            zIndex: 9999,
            pointerEvents: "none",
            background: "transparent",
            border: "none",
            boxShadow: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
            margin: 0
          }}
        >
          <button
            className="neo-btn bg-orange back-icon-btn"
            style={{
              pointerEvents: "auto",
              position: "relative",
              top: "auto",
              left: "auto",
              right: "auto",
              transform: "none",
              margin: 0,
              zIndex: 10000,
              flexShrink: 0
            }}
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div
            id="vr-header-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "auto",
              fontSize: "1.2rem",
              zIndex: 10000,
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              margin: "0 auto",
              position: "relative",
              top: "auto",
              left: "auto",
              transform: "none"
            }}
          >
            <i className="fa-solid fa-cube" style={{ marginRight: "4px" }}></i>
            <span>3D Bunyi Kata</span>
          </div>

          <button
            className="neo-btn bg-orange help-btn info-icon-btn"
            style={{
              pointerEvents: "auto",
              position: "relative",
              top: "auto",
              right: "auto",
              left: "auto",
              transform: "none",
              margin: 0,
              zIndex: 10000,
              flexShrink: 0
            }}
            onClick={() => {
              console.log("3D guide modal opened from button");
              setShowVRGuideModal(true);
            }}
            title="Panduan 3D Bunyi Kata"
            aria-label="Panduan 3D Bunyi Kata"
          >
            <i className="fa-solid fa-circle-info"></i>
          </button>
        </div>
        <div id="vr-container" style={{ width: "100%", height: "100dvh", overflow: "hidden", position: "absolute", inset: 0, zIndex: 1 }}></div>

        {/* 3D Virtual Joystick Overlay for Mobile / Pointer */}
        <div
          id="vr-joystick-container"
          className="vr-joystick-container"
          onTouchStart={(e) => {
            e.stopPropagation();
            const touch = e.changedTouches[0];
            if (!touch) return;
            (window as any).vrJoystickTouchId = touch.identifier;
            const base = e.currentTarget.querySelector('.vr-joystick-base') as HTMLElement;
            const knob = e.currentTarget.querySelector('.vr-joystick-knob') as HTMLElement;
            if (!base || !knob) return;
            const rect = base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const maxDist = rect.width / 2 - 15;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) {
              dx = (dx / dist) * maxDist;
              dy = (dy / dist) * maxDist;
            }
            knob.style.transform = `translate(${dx}px, ${dy}px)`;
            (window as any).vrJoystickInput = { x: dx / maxDist, y: dy / maxDist };
            (window as any).vrIsJoystickDragging = true;
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            const targetId = (window as any).vrJoystickTouchId;
            let touch: React.Touch | undefined;
            for (let i = 0; i < e.touches.length; i++) {
              if (e.touches[i].identifier === targetId) {
                touch = e.touches[i];
                break;
              }
            }
            if (!touch) touch = e.touches[0];
            if (!touch) return;
            const base = e.currentTarget.querySelector('.vr-joystick-base') as HTMLElement;
            const knob = e.currentTarget.querySelector('.vr-joystick-knob') as HTMLElement;
            if (!base || !knob) return;
            const rect = base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const maxDist = rect.width / 2 - 15;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) {
              dx = (dx / dist) * maxDist;
              dy = (dy / dist) * maxDist;
            }
            knob.style.transform = `translate(${dx}px, ${dy}px)`;
            (window as any).vrJoystickInput = { x: dx / maxDist, y: dy / maxDist };
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            const targetId = (window as any).vrJoystickTouchId;
            let touchEnded = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
              if (e.changedTouches[i].identifier === targetId) {
                touchEnded = true;
                break;
              }
            }
            if (touchEnded || e.touches.length === 0) {
              if (typeof (window as any).vrResetInputs === 'function') {
                (window as any).vrResetInputs();
              } else {
                const knob = document.querySelector('.vr-joystick-knob') as HTMLElement;
                if (knob) knob.style.transform = 'translate(0px, 0px)';
                (window as any).vrJoystickInput = { x: 0, y: 0 };
                (window as any).vrIsJoystickDragging = false;
              }
              (window as any).vrJoystickTouchId = null;
            }
          }}
          onTouchCancel={(e) => {
            e.stopPropagation();
            if (typeof (window as any).vrResetInputs === 'function') {
              (window as any).vrResetInputs();
            } else {
              const knob = document.querySelector('.vr-joystick-knob') as HTMLElement;
              if (knob) knob.style.transform = 'translate(0px, 0px)';
              (window as any).vrJoystickInput = { x: 0, y: 0 };
              (window as any).vrIsJoystickDragging = false;
            }
            (window as any).vrJoystickTouchId = null;
          }}
          onMouseDown={(e) => {
            const base = e.currentTarget.querySelector('.vr-joystick-base') as HTMLElement;
            const knob = e.currentTarget.querySelector('.vr-joystick-knob') as HTMLElement;
            if (!base || !knob) return;
            const rect = base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = e.clientX - centerX;
            let dy = e.clientY - centerY;
            const maxDist = rect.width / 2 - 15;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) {
              dx = (dx / dist) * maxDist;
              dy = (dy / dist) * maxDist;
            }
            knob.style.transform = `translate(${dx}px, ${dy}px)`;
            (window as any).vrJoystickInput = { x: dx / maxDist, y: dy / maxDist };
            (window as any).vrIsJoystickDragging = true;

            const onMouseMove = (moveEvt: MouseEvent) => {
              let mx = moveEvt.clientX - centerX;
              let my = moveEvt.clientY - centerY;
              const mDist = Math.sqrt(mx * mx + my * my);
              if (mDist > maxDist) {
                mx = (mx / mDist) * maxDist;
                my = (my / mDist) * maxDist;
              }
              knob.style.transform = `translate(${mx}px, ${my}px)`;
              (window as any).vrJoystickInput = { x: mx / maxDist, y: my / maxDist };
            };

            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
              knob.style.transform = 'translate(0px, 0px)';
              (window as any).vrJoystickInput = { x: 0, y: 0 };
              (window as any).vrIsJoystickDragging = false;
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          <div className="vr-joystick-base">
            <div className="vr-joystick-knob">
              <i className="fa-solid fa-arrows-up-down-left-right"></i>
            </div>
          </div>
        </div>

        {/* 3D Station Learning Popup Modal (Single-Card Showcase with Icon Arrows & Page-by-Page Auto Sound) */}
        <div id="vr-station-popup" className="vr-station-popup" style={{ maxWidth: "520px" }}>
          <div
            id="vr-station-header"
            style={{
              backgroundColor: "#f59e0b",
              backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 2px, transparent 2px)",
              backgroundSize: "14px 14px",
              padding: "14px 16px",
              color: "white",
              textAlign: "center",
              position: "relative",
              borderBottom: "3px solid #1e293b"
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold" }}>Galeri Pembelajaran</h2>
            <button
              type="button"
              className="neo-btn bg-red"
              onClick={() => {
                if ((window as any).closeVRStationPopup) {
                  (window as any).closeVRStationPopup();
                }
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                width: "34px",
                height: "34px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                zIndex: 10,
                color: "white"
              }}
              title="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Single Showcase Flashcard Container */}
          <div
            id="vr-station-items-grid"
            style={{
              padding: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              backgroundColor: "#ffffff",
              backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.15) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px"
            }}
          >
            {/* Populated dynamically via triggerVRStationPopup & renderVRStationShowcaseCard */}
          </div>

          {/* Footer Controls: Auto-Play & Continue */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "2px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <button
              id="vr-auto-btn"
              type="button"
              className="neo-btn cursor-pointer"
              style={{
                padding: "8px 18px",
                fontSize: "0.92rem",
                backgroundColor: "#168f81",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
              onClick={() => {
                if ((window as any).playVRAutoAll) {
                  (window as any).playVRAutoAll();
                }
              }}
            >
              <i className="fa-solid fa-volume-high"></i>
              <span>Dengar Semua</span>
            </button>
            <button
              type="button"
              className="neo-btn bg-orange cursor-pointer"
              style={{
                padding: "8px 18px",
                fontSize: "0.92rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#f97316",
                color: "white"
              }}
              onClick={() => {
                if ((window as any).closeVRStationPopup) {
                  (window as any).closeVRStationPopup();
                }
              }}
            >
              <i className="fa-solid fa-person-walking"></i>
              <span>Teruskan Teroka</span>
            </button>
          </div>
        </div>
      </div>

      {/* VR Nombor view removed - now unified into view-vr-abc */}
      <div id="view-belajar-huruf" className={getScreenClass("view-belajar-huruf")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="view-belajar-huruf-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Belajar Huruf
          </div>
          <div></div>
        </div>
        <div id="grid-huruf-container">
          {/*  Huruf buttons will be injected here  */}
        </div>
      </div>

      {/*  Belajar Suku Kata  */}
      <div id="view-belajar-sukukata" className={getScreenClass("view-belajar-sukukata")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="belajar-sukukata-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Belajar Suku Kata
          </div>
          <div></div>
        </div>

        <div className="bs-wrapper">
          <div className="bs-container">
            {/*  LEFT CARD  */}
            <div className="bs-card-left">
              <div id="sukukata-left-title" className="bs-title-sukukata neo-btn bg-orange">
                Suku Kata
              </div>

              <button
                className="bs-arrow prev neo-btn bg-purple"
                style={{ borderRadius: "12px", color: "white" }}
                onClick={(e) => {
                  prevBelajarSukuKata();
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div
                className="scene bs-scene"
                onClick={(e) => {
                  window.flipFlashcard(e.currentTarget);
                }}
                style={{ position: "relative", borderRadius: "30px" }}
              >
                {/* Butang audio kuning pada kad 3D (flashcard) */}
                <button
                  className="neo-btn bg-yellow"
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "10",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if ((window as any).mainAudioSukuKataSemasa) {
                      (window as any).mainAudioSukuKataSemasa();
                    }
                  }}
                  aria-label="Sebut Audio"
                  title="Sebut Audio"
                >
                  <i
                    className="fa-solid fa-volume-high"
                    style={{ color: "var(--color-dark)", fontSize: "1.2rem" }}
                  ></i>
                </button>
                <div className="card" id="sukukata-k3d-card">
                  <div className="card__face" style={{ background: "white" }}>
                    <div
                      id="sukukata-card-front-content"
                      className="bs-card-content-front"
                    >
                      <i
                        className="fa-solid fa-image"
                        style={{ color: "#cbd5e1" }}
                      ></i>
                    </div>
                    {/* Modern Tap Cursor Hint for Suku Kata (stays on front face) */}
                    <div id="sukukata-tap-cursor-hint" className="modern-flashcard-tap-cursor">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                        <circle cx="8" cy="5" r="3.5" stroke="#ff7a00" strokeWidth="2" opacity="0.85" />
                        <circle cx="8" cy="5" r="5.5" stroke="#ffe24a" strokeWidth="1.5" opacity="0.55" />
                        <path
                          d="M9 11V4.5C9 3.67 8.33 3 7.5 3C6.67 3 6 3.67 6 4.5V12.5L4.85 11.27C4.33 10.74 3.49 10.74 2.97 11.27C2.45 11.8 2.45 12.64 2.97 13.17L7.6 17.8C8.5 18.7 9.7 19.2 11 19.2H14.5C16.99 19.2 19 17.19 19 14.7V10.5C19 9.67 18.33 9 17.5 9C17.3 9 17.1 9.04 16.92 9.12C16.66 8.46 16.03 8 15.28 8C15.05 8 14.83 8.05 14.63 8.15C14.33 7.46 13.65 7 12.85 7C12.65 7 12.45 7.04 12.27 7.12C12.01 6.46 11.38 6 10.63 6C9.73 6 9 6.73 9 7.63V11Z"
                          fill="#ffffff"
                          stroke="#10182f"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="card__face card__face--back"
                    style={{ background: "white" }}
                  >
                    <div
                      id="sukukata-card-back-content"
                      className="bs-card-content-back"
                    ></div>
                  </div>
                </div>
              </div>
              <button
                className="bs-arrow next neo-btn bg-purple"
                style={{ borderRadius: "12px", color: "white" }}
                onClick={(e) => {
                  nextBelajarSukuKata();
                }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            {/*  RIGHT CARD  */}
            <div className="bs-card-right">
              <div
                id="sukukata-type-title"
                className="bs-type-title neo-btn bg-purple"
              >
                KVK
              </div>

              <button
                className="bs-list-btn neo-btn bg-yellow"
                onClick={(e) => {
                  bukaModalSenaraiSukuKata();
                }}
                aria-label="Senarai Perkataan"
              >
                <i className="fa-solid fa-list"></i>
              </button>

              <div
                id="sukukata-word-wrapper"
                className="bs-word-container neo-btn"
                style={{
                  background: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  width: "100%",
                  borderRadius: "20px",
                  cursor: "pointer",
                  textTransform: "none",
                  position: "relative",
                  animation: "gold-glow 2s infinite alternate",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
                onClick={(e) => {
                  mainAudioSukuKataSemasa();
                }}
              >
                <span
                  id="sukukata-word"
                  className="bs-word-text"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  bot
                </span>
              </div>

              <div className="bs-nav-desktop">
                <button
                  className="neo-btn bg-purple"
                  style={{ borderRadius: "10px", color: "white" }}
                  onClick={(e) => {
                    prevBelajarSukuKata();
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  className="neo-btn bg-purple"
                  style={{ borderRadius: "10px", color: "white" }}
                  onClick={(e) => {
                    nextBelajarSukuKata();
                  }}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          {/* Galeri Puzzle Cantuman Suku Kata (di bawah kad imbasan) */}
          <Suspense fallback={null}>
            <SukuKataPuzzleBar />
          </Suspense>
        </div>
      </div>
      {/*  Modal Senarai Suku Kata  */}
      <div
        id="modal-senarai-sukukata"
        className="modal"
        style={{
          display: "none",
          position: "fixed",
          inset: "0",
          zIndex: "1000",
          background: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="modal-content neo-box"
          style={{
            background: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.11) 2px, transparent 2px)",
            backgroundSize: "16px 16px",
            border: "4px solid #1e293b",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "30px 20px 20px",
            borderRadius: "24px",
            boxShadow: "0 8px 0 #1e293b",
          }}
        >
          <button
            className="neo-btn bg-red"
            onClick={(e) => {
              tutupModalSenaraiSukuKata();
            }}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "10",
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            id="senarai-sukukata-title"
            className="neo-btn bg-purple page-title"
            style={{
              marginBottom: "20px",
              pointerEvents: "none",
              alignSelf: "center",
              fontSize: "1.2rem",
              padding: "10px 30px",
            }}
          >
            Senarai Perkataan
          </div>

          <div
            id="senarai-sukukata-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "15px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {/*  list injected by JS  */}
          </div>
        </div>
      </div>

      {/*  Belajar AR Suku Kata  */}
      <div id="view-ar-sukukata" className={getScreenClass("view-ar-sukukata")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              (window as any).tutupARSukuKata && (window as any).tutupARSukuKata();
            }}
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="ar-sukukata-header-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span className="ar-title-desktop-only" style={{ alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-camera" style={{ marginRight: "8px" }}></i>
              <span id="ar_desktop_title_label">AR Suku Kata</span>
            </span>
            <span
              id="ar_header_title_mobile_skill"
              className="ar-title-mobile-only"
              style={{ color: "white", fontWeight: "bold" }}
            >
              AR Suku Kata
            </span>
            <span
              id="ar_header_mobile_stars"
              className="ar-title-mobile-only"
              style={{ alignItems: "center", gap: "4px" }}
            >
              <i
                className="fa-solid fa-star"
                style={{ color: "#fbbf24", WebkitTextStroke: "1px var(--color-dark)" }}
              ></i>
              <span id="ar_header_stars_count">0</span>
            </span>
          </div>
          <button
            className="neo-btn bg-orange help-btn info-icon-btn"
            onClick={() => setShowARGuideModal(true)}
            title="Panduan AR Suku Kata"
            aria-label="Panduan AR Suku Kata"
          >
            <i className="fa-solid fa-circle-info"></i>
          </button>
        </div>

        {/* Floating Star Animation Popup (Same as Tanduk Kata) */}
        <div id="ar_star_popup" className="ar-star-popup" style={{ display: "none" }}></div>

        <div className="ar-main-container">
          {/* Panel Kiri: Kamera AR */}
          <div className="ar-camera-panel">
            <video id="input_video_ar_sukukata" className="hidden" style={{ display: "none" }} autoPlay playsInline muted></video>
            <canvas id="output_canvas_ar_sukukata" className="ar-camera-canvas"></canvas>

            <div id="camera_status_ar_sukukata" className="ar-camera-overlay">
              <i className="fa-solid fa-spinner fa-spin fa-3x mb-3 text-pink-400"></i>
              <p className="text-xl font-bold">Memuatkan Kamera AR...</p>
              <p className="text-xs text-gray-300 mt-1">Sila benarkan akses kamera</p>
            </div>

            {/* Button Tukar Filter AR di atas kamera (Desktop/Laptop) */}
            <button
              type="button"
              id="btn_tukar_filter_camera"
              className="ar-camera-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
              onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
              title="Tukar Filter AR"
              aria-label="Tukar Filter AR"
            >
              <i className="fa-solid fa-rotate text-lg"></i>
            </button>
          </div>

          {/* Panel Kanan: Paparan Perkataan Suku Kata */}
          <div className="ar-content-panel">
            <div
              className="ar-score-pill neo-box cursor-pointer hover:scale-105 transition-transform"
              onClick={() => (window as any).showARResultModal && (window as any).showARResultModal()}
              title="Paparan Bintang & Keputusan"
            >
              <i className="fa-solid fa-star text-2xl" style={{ color: "#ffc107" }}></i>
              <span id="score_display_ar_sukukata" className="ar-score-text">0</span>
            </div>

            <div className="ar-header-box">
              <div id="ar_sukukata_kemahiran_label" className="neo-btn bg-yellow ar-skill-badge">
                Suku Kata
              </div>
            </div>

            <div
              id="word_card_ar_sukukata"
              className="ar-word-card neo-box border-orange-200 cursor-pointer"
              onClick={() => (window as any).sebutAudio && (window as any).currentARWord && (window as any).sebutAudio((window as any).currentARWord)}
              title="Klik untuk dengar sebutan"
            >
              <p id="word_display_ar_sukukata" className="ar-word-text">?</p>
            </div>

            <div
              id="ar_speech_box_container"
              className="ar-speech-box neo-box"
              style={{
                opacity: 0,
                visibility: "hidden",
                transition: "opacity 0.3s",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "10px 18px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                borderColor: "var(--color-dark, #10182f)",
              }}
            >
              <div
                id="mic_icon_ar_sukukata"
                className="ar-mic-indicator hidden"
                style={{
                  display: "none",
                  width: "12px",
                  height: "12px",
                  minWidth: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  flexShrink: 0,
                  margin: 0,
                }}
              ></div>
              <p
                id="speech_status_ar_sukukata"
                className="ar-speech-text"
                style={{
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  lineHeight: "1.3",
                }}
              >
                Tekan "MULA"
              </p>
            </div>

            <div className="ar-actions-row">
              <button
                id="start_btn_ar_sukukata"
                className="neo-btn ar-start-btn"
                onClick={() => (window as any).toggleARPlay && (window as any).toggleARPlay()}
              >
                MULA
              </button>
              <button
                type="button"
                id="btn_tukar_filter"
                className="ar-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
                title="Tukar Filter AR"
                aria-label="Tukar Filter AR"
              >
                <i className="fa-solid fa-rotate text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Panduan AR Suku Kata */}
        <AnimatePresence>
          {showARGuideModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.75)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
                padding: "16px",
                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
              }}
              onClick={() => setShowARGuideModal(false)}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="neo-box"
                style={{
                  backgroundColor: "#ffffff",
                  backgroundImage:
                    "radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)",
                  backgroundSize: "16px 16px",
                  maxWidth: "520px",
                  width: "100%",
                  padding: "28px 24px",
                  textAlign: "center",
                  borderRadius: "24px",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
                  border: "4px solid #f97316",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  style={{
                    fontSize: "1.6rem",
                    color: "#ffffff",
                    backgroundColor: "#ea580c",
                    padding: "6px 24px",
                    borderRadius: "16px",
                    display: "inline-block",
                    margin: "0 0 15px 0",
                    fontWeight: "bold",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    border: "3px solid #c2410c",
                  }}
                >
                  {(window as any).currentARKemahiran === 'abc' ? "AR ABC" : "AR Suku Kata"}
                </h2>

                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#1e293b",
                    margin: "0 0 20px 0",
                    lineHeight: 1.6,
                    fontWeight: "bold",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  }}
                >
                  {(window as any).currentARKemahiran === 'abc'
                    ? "Tunjukkan kad huruf ABC ke arah kamera untuk melihat model 3D timbul secara langsung!"
                    : "Tunjukkan kad suku kata ke arah kamera untuk melihat model 3D dan animasi suku kata timbul secara langsung!"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "24px",
                    padding: "14px 10px",
                    backgroundColor: "rgba(248, 250, 252, 0.9)",
                    borderRadius: "16px",
                    border: "2px solid #cbd5e1",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <i
                        className="fa-solid fa-camera"
                        style={{ fontSize: "1.6rem", color: "#ea580c" }}
                      ></i>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#1e293b",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      }}
                    >
                      Imbas Kad
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <i
                        className="fa-solid fa-microphone"
                        style={{ fontSize: "1.6rem", color: "#ea580c" }}
                      ></i>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#1e293b",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      }}
                    >
                      {(window as any).currentARKemahiran === 'abc' ? "Sebut Huruf" : "Sebut Suku Kata"}
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <i
                        className="fa-solid fa-rotate"
                        style={{ fontSize: "1.6rem", color: "#ea580c" }}
                      ></i>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#1e293b",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      }}
                    >
                      Tukar Filter AR
                    </div>
                  </div>
                </div>

                <button
                  className="neo-btn cursor-pointer"
                  style={{
                    backgroundColor: "#168f81",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    padding: "12px 32px",
                    width: "100%",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    fontWeight: "bold",
                    justifyContent: "center",
                    textTransform: "none",
                    borderRadius: "16px",
                  }}
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") {
                      (window as any).playBubble();
                    }
                    setShowARGuideModal(false);
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(stream => {
                          if (stream && stream.getTracks) {
                            stream.getTracks().forEach(t => t.stop());
                          }
                        })
                        .catch(() => { });
                    }
                    const startBtn = document.getElementById("start_btn_ar_sukukata");
                    if (startBtn && !(window as any).isARPlaying) {
                      startBtn.click();
                    }
                  }}
                >
                  Mula Belajar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Belajar AR Nombor (Kira Jari) */}
      <div id="view-ar-kirajari" className={getScreenClass("view-ar-kirajari")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              (window as any).tutupARKiraJari && (window as any).tutupARKiraJari();
            }}
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="ar-kirajari-header-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span className="ar-title-desktop-only" style={{ alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-hand" style={{ marginRight: "8px", color: "#f59e0b" }}></i>
              <span id="ar_kirajari_desktop_title_label">AR Nombor</span>
            </span>
            <span
              id="ar_kirajari_header_title_mobile_skill"
              className="ar-title-mobile-only"
              style={{ color: "white", fontWeight: "bold" }}
            >
              AR Nombor
            </span>
            <span
              id="ar_kirajari_header_mobile_stars"
              className="ar-title-mobile-only"
              style={{ alignItems: "center", gap: "4px" }}
            >
              <i
                className="fa-solid fa-star"
                style={{ color: "#fbbf24", WebkitTextStroke: "1px var(--color-dark)" }}
              ></i>
              <span id="ar_kirajari_header_stars_count">0</span>
            </span>
          </div>
          <button
            className="neo-btn bg-orange help-btn info-icon-btn"
            onClick={() => setShowARKiraJariGuideModal(true)}
            title="Panduan AR Nombor"
            aria-label="Panduan AR Nombor"
          >
            <i className="fa-solid fa-circle-info"></i>
          </button>
        </div>

        {/* Floating Star Animation Popup (Hidden by default) */}
        <div id="ar_star_popup_kirajari" className="ar-star-popup" style={{ display: "none" }}></div>

        <div className="ar-main-container">
          {/* Panel Kiri: Kamera AR Pengesanan Jari */}
          <div className="ar-camera-panel" style={{ position: "relative" }}>
            <video id="input_video_ar_kirajari" className="hidden" style={{ display: "none" }} autoPlay playsInline muted></video>
            <canvas id="output_canvas_ar_kirajari" className="ar-camera-canvas"></canvas>

            <div id="camera_status_ar_kirajari" className="ar-camera-overlay">
              <i className="fa-solid fa-spinner fa-spin fa-3x mb-3 text-amber-400"></i>
              <p className="text-xl font-bold">Memuatkan Sensor AR MediaPipe Hands...</p>
              <p className="text-xs text-gray-300 mt-1">Sila benarkan akses kamera peranti</p>
            </div>

            {/* Button Tukar Filter AR di atas kamera sudut kanan atas (Laptop/Desktop) */}
            <button
              type="button"
              id="btn_tukar_filter_camera_kirajari"
              className="ar-camera-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                bottom: "auto",
                left: "auto",
                transform: "none",
                width: "44px",
                height: "44px",
                minWidth: "44px",
                minHeight: "44px",
                borderRadius: "50%",
                border: "3px solid #10182f",
                boxShadow: "0 3px 0px #10182f",
                backgroundColor: "#facc15",
                color: "#10182f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 30,
                padding: 0,
              }}
              onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
              title="Tukar Filter AR"
              aria-label="Tukar Filter AR"
            >
              <i className="fa-solid fa-rotate text-lg"></i>
            </button>
            {/* Live Detected Fingers Badge (Neo-brutalist theme matching web app) */}
            <div
              id="ar_kirajari_live_badge"
              className="neo-btn bg-yellow"
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                backgroundColor: "#fcd34d",
                color: "#10182f",
                padding: "6px 14px",
                borderRadius: "16px",
                border: "3px solid #10182f",
                boxShadow: "0 3px 0px #10182f",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                zIndex: 10,
                pointerEvents: "none"
              }}
            >
              <i className="fa-solid fa-hand" style={{ color: "#10182f", fontSize: "1.3rem" }}></i>
              <strong id="ar_kirajari_live_count" style={{ color: "#10182f", fontSize: "1.4rem", fontWeight: "900" }}>0</strong>
            </div>

            {/* Radial Hold Confirmation Progress Overlay (Neo-brutalist styled) */}
            <div
              id="ar_kirajari_hold_ring_container"
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "none",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 15,
                pointerEvents: "none"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "76px",
                  height: "76px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  border: "3px solid #10182f",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)"
                }}
              >
                <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: "absolute", top: "-3px", left: "-3px" }}>
                  <circle cx="38" cy="38" r="32" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle
                    id="ar_kirajari_progress_circle"
                    cx="38"
                    cy="38"
                    r="32"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="6"
                    strokeDasharray="201.06"
                    strokeDashoffset="201.06"
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.05s linear", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                  />
                </svg>
                <i id="ar_kirajari_hold_icon" className="fa-solid fa-hand-peace" style={{ color: "#22c55e", fontSize: "1.6rem", zIndex: 2 }}></i>
              </div>
            </div>
          </div>

          {/* Panel Kanan: Paparan Soalan & Objek Mengira */}
          <div className="ar-content-panel">
            <div
              className="ar-score-pill neo-box cursor-pointer hover:scale-105 transition-transform"
              onClick={() => (window as any).showARKiraJariResultModal && (window as any).showARKiraJariResultModal()}
              title="Paparan Bintang & Keputusan"
            >
              <i className="fa-solid fa-star text-2xl" style={{ color: "#ffc107" }}></i>
              <span id="score_display_ar_kirajari" className="ar-score-text">0</span>
            </div>

            <div className="ar-header-box">
              <div id="ar_kirajari_kemahiran_label" className="neo-btn bg-yellow ar-skill-badge" style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>
                <i className="fa-solid fa-hand"></i> AR Nombor
              </div>
            </div>

            <div id="word_card_ar_kirajari" className="ar-word-card neo-box border-amber-300" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px 14px", overflow: "hidden" }}>
              <div id="ar_kirajari_objects_container" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", overflow: "hidden" }}>
                <img src="/images/nombor/empat.png" alt="4" className="ar-kirajari-obj-img" />
              </div>
            </div>

            <div id="ar_kirajari_status_box" className="ar-speech-box neo-box" style={{ backgroundColor: "#ffffff", borderColor: "var(--color-dark)", padding: "10px 18px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
              <p id="ar_kirajari_status_text" className="ar-speech-text" style={{ fontSize: "clamp(0.78rem, 2vw, 0.95rem)", fontWeight: "700", whiteSpace: "nowrap", margin: 0 }}>
                Tekan "MULA" dan tunjukkan jari anda ke arah kamera!
              </p>
            </div>

            <div className="ar-actions-row">
              <button
                id="start_btn_ar_kirajari"
                className="neo-btn ar-start-btn"
                style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
              >
                MULA
              </button>
              <button
                type="button"
                id="btn_tukar_filter_kirajari"
                className="ar-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
                title="Tukar Filter AR"
                aria-label="Tukar Filter AR"
              >
                <i className="fa-solid fa-rotate text-lg"></i>
              </button>
              <button
                type="button"
                id="btn_refresh_kirajari"
                className="ar-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
                onClick={() => (window as any).nextARKiraJariQuestion && (window as any).nextARKiraJariQuestion()}
                title="Soalan Seterusnya"
                aria-label="Soalan Seterusnya"
              >
                <i className="fa-solid fa-forward text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Panduan AR Nombor */}
        {showARKiraJariGuideModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.75)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999,
              padding: "16px",
              fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
            }}
            onClick={() => setShowARKiraJariGuideModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 25 }}
              className="neo-box"
              style={{
                backgroundColor: "#ffffff",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
                maxWidth: "520px",
                width: "100%",
                padding: "28px 24px",
                textAlign: "center",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
                border: "4px solid #f97316",
                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: "1.6rem",
                  color: "#ffffff",
                  backgroundColor: arKiraJariMode === 'tambah' ? '#ec4899' : arKiraJariMode === 'tolak' ? '#3b82f6' : '#ea580c',
                  padding: "6px 28px",
                  borderRadius: "16px",
                  display: "inline-block",
                  margin: "0 0 15px 0",
                  fontWeight: "bold",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  border: `3px solid ${arKiraJariMode === 'tambah' ? '#be185d' : arKiraJariMode === 'tolak' ? '#1d4ed8' : '#c2410c'}`,
                }}
              >
                {arKiraJariMode === 'tambah' ? 'AR Tambah' : arKiraJariMode === 'tolak' ? 'AR Tolak' : 'AR Nombor'}
              </h2>

              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  margin: "0 0 20px 0",
                  lineHeight: 1.6,
                  fontWeight: "bold",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                {arKiraJariMode === 'tambah'
                  ? 'Kira ayat matematik tambah (1–10) dan tunjukkan bilangan jari jawapan ke arah kamera untuk mengumpul bintang ganjaran!'
                  : arKiraJariMode === 'tolak'
                    ? 'Kira ayat matematik tolak (1–10) dan tunjukkan bilangan jari jawapan ke arah kamera untuk mengumpul bintang ganjaran!'
                    : 'Kira objek yang dipaparkan (1–10) dan tunjukkan bilangan jari yang sama ke arah kamera untuk mengumpul bintang ganjaran!'}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  marginBottom: "24px",
                  padding: "14px 10px",
                  backgroundColor: "rgba(248, 250, 252, 0.9)",
                  borderRadius: "16px",
                  border: "2px solid #cbd5e1",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <i
                      className="fa-solid fa-eye"
                      style={{ fontSize: "1.6rem", color: "#ea580c" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    }}
                  >
                    {arKiraJariMode === 'tambah' ? '1. Kira Tambah' : arKiraJariMode === 'tolak' ? '1. Kira Tolak' : '1. Kira Objek'}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <i
                      className="fa-solid fa-hand"
                      style={{ fontSize: "1.6rem", color: "#ea580c" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    }}
                  >
                    2. Angkat Jari
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <i
                      className="fa-solid fa-star"
                      style={{ fontSize: "1.6rem", color: "#ea580c" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    }}
                  >
                    3. Kumpul Bintang
                  </div>
                </div>
              </div>

              <button
                className="neo-btn cursor-pointer"
                style={{
                  backgroundColor: "#168f81",
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  padding: "12px 32px",
                  width: "100%",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  fontWeight: "bold",
                  justifyContent: "center",
                  textTransform: "none",
                  borderRadius: "16px",
                }}
                onClick={() => {
                  if (typeof (window as any).playBubble === "function") {
                    (window as any).playBubble();
                  }
                  setShowARKiraJariGuideModal(false);
                  const startBtn = document.getElementById("start_btn_ar_kirajari");
                  if (startBtn && !(window as any).isARKiraJariPlaying) {
                    startBtn.click();
                  }
                }}
              >
                Mula Belajar
              </button>
            </motion.div>
          </div>
        )}
      </div>
      <div id="view-belajar-bacaan" className={getScreenClass("view-belajar-bacaan")}>
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              if ((window as any).hentikanAudioSemasa) (window as any).hentikanAudioSemasa();
              (window as any).paparSkrin("map-screen");
            }}
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="belajar-bacaan-title"
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Misi Bacaan Bergred
          </div>
          <div></div>
        </div>

        <div
          className="bs-wrapper"
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="bacaan-card-wrapper">
            {/* Outer Card Container */}
            <div
              style={{
                background: "#e0f2fe",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.11) 2px, transparent 2px)",
                backgroundSize: "20px 20px",
                border: "4px solid #1e293b",
                borderRadius: "32px",
                padding: "40px 24px 28px 24px",
                position: "relative",
                boxShadow: "0 8px 0px #1e293b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* Top Center Badge Tab - Hidden for Bacaan Bergred per request */}
              <div
                id="bacaan-level-badge"
                className="neo-btn bg-purple"
                style={{
                  position: "absolute",
                  top: "-22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  color: "white",
                  padding: "8px 28px",
                  borderRadius: "24px",
                  border: "3px solid #1e293b",
                  boxShadow: "0 4px 0 #1e293b",
                  pointerEvents: "none",
                  zIndex: 5,
                  whiteSpace: "nowrap",
                  display: "none",
                }}
              >
                Bacaan
              </div>

              {/* Top Right List Button */}
              <button
                className="neo-btn bg-yellow"
                onClick={(e) => {
                  if (typeof (window as any).hentikanAudioSemasa === "function") {
                    (window as any).hentikanAudioSemasa();
                  }
                  (window as any).bukaModalSenaraiBacaan &&
                    (window as any).bukaModalSenaraiBacaan();
                }}
                aria-label="Senarai Bacaan"
                style={{
                  position: "absolute",
                  top: "-15px",
                  right: "-15px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "3px solid #1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <i
                  className="fa-solid fa-list-ul"
                  style={{ fontSize: "1.3rem", color: "#1e293b" }}
                ></i>
              </button>

              {/* Counter Pill Top Center */}
              <div
                id="bacaan-counter-pill"
                className="bacaan-counter-pill"
              >
                <span className="pill-curr">1</span>
                <span className="pill-sep">/</span>
                <span className="pill-total">5</span>
              </div>

              {/* Inner Reading Box (Main Display Area) */}
              <div
                id="bacaan-text-container"
                onClick={(e) => {
                  (window as any).mainAudioBacaanSemasa &&
                    (window as any).mainAudioBacaanSemasa();
                }}
                style={{
                  background: "white",
                  border: "4px solid #1e293b",
                  borderRadius: "24px",
                  width: "100%",
                  minHeight: "230px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "0 4px 0 #1e293b",
                  transition: "transform 0.1s ease",
                  userSelect: "none",
                }}
              >
                {/* Title / Icon optional header inside card - Hidden per request */}
                <div
                  style={{
                    display: "none",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    id="bacaan-item-icon"
                    style={{ fontSize: "2.2rem", lineHeight: "1" }}
                  >
                    📖
                  </span>
                  <span
                    id="bacaan-item-title"
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: "bold",
                      color: "#64748b",
                    }}
                  >
                    Tajuk Bacaan
                  </span>
                </div>

                {/* Text Display */}
                <div
                  id="bacaan-text-display"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#0f172a",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                    width: "100%",
                  }}
                >
                  Text bacaan
                </div>

                {/* Speaker Audio Hint Icon */}
                <div
                  className="bacaan-audio-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    (window as any).mainAudioBacaanSemasa &&
                      (window as any).mainAudioBacaanSemasa();
                  }}
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "16px",
                    background: "#fef08a",
                    border: "2px solid #1e293b",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1e293b",
                    cursor: "pointer",
                    boxShadow: "0 2px 0 #1e293b",
                    zIndex: 10,
                  }}
                  title="Tekan untuk dengar audio"
                >
                  <i
                    className="fa-solid fa-volume-high"
                    style={{ fontSize: "1rem" }}
                  ></i>
                </div>
              </div>

              {/* Bottom Navigation Buttons (Arrows) */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <button
                  id="btn-prev-bacaan"
                  className="neo-btn bg-purple"
                  onClick={(e) => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    if (typeof (window as any).hentikanAudioSemasa === "function") {
                      (window as any).hentikanAudioSemasa();
                    }
                    (window as any).prevBelajarBacaan &&
                      (window as any).prevBelajarBacaan();
                  }}
                  aria-label="Sebelumnya"
                  style={{
                    width: "75px",
                    height: "56px",
                    borderRadius: "18px",
                    border: "3px solid #1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    padding: 0,
                  }}
                >
                  <i
                    className="fa-solid fa-arrow-left"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </button>

                <button
                  id="btn-next-bacaan"
                  className="neo-btn bg-purple"
                  onClick={(e) => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    if (typeof (window as any).hentikanAudioSemasa === "function") {
                      (window as any).hentikanAudioSemasa();
                    }
                    (window as any).nextBelajarBacaan &&
                      (window as any).nextBelajarBacaan();
                  }}
                  aria-label="Seterusnya"
                  style={{
                    width: "75px",
                    height: "56px",
                    borderRadius: "18px",
                    border: "3px solid #1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    padding: 0,
                  }}
                >
                  <i
                    className="fa-solid fa-arrow-right"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Senarai Bacaan */}
      <div
        id="modal-senarai-bacaan"
        className="modal"
        style={{
          display: "none",
          position: "fixed",
          inset: "0",
          zIndex: "1000",
          background: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="modal-content neo-box"
          style={{
            background: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.11) 2px, transparent 2px)",
            backgroundSize: "16px 16px",
            border: "4px solid #1e293b",
            width: "100%",
            maxWidth: "620px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "30px 20px 20px",
            borderRadius: "28px",
            boxShadow: "0 8px 0 #1e293b",
          }}
        >
          <button
            className="neo-btn bg-red"
            onClick={(e) => {
              (window as any).tutupModalSenaraiBacaan &&
                (window as any).tutupModalSenaraiBacaan();
            }}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "10",
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            id="senarai-bacaan-title"
            className="neo-btn bg-orange page-title"
            style={{
              marginBottom: "20px",
              pointerEvents: "none",
              alignSelf: "center",
              fontSize: "1.2rem",
              padding: "10px 30px",
            }}
          >
            Senarai Bacaan
          </div>

          <div
            id="senarai-bacaan-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "15px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {/* list injected by JS */}
          </div>
        </div>
      </div>

      {/* Modal Edit Maklumat Kelas */}
      {typeof document !== 'undefined' && createPortal(
        <>
          <Suspense fallback={null}>
            <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            editModalMode={editModalMode}
            isMandatorySetup={isMandatorySetup}
            setIsMandatorySetup={setIsMandatorySetup}
            editModalError={editModalError}
            setEditModalError={setEditModalError}
            editKodTemp={editKodTemp}
            setEditKodTemp={setEditKodTemp}
            editKelasTemp={editKelasTemp}
            setEditKelasTemp={setEditKelasTemp}
            editSekolahTemp={editSekolahTemp}
            setEditSekolahTemp={setEditSekolahTemp}
            editGuruTemp={editGuruTemp}
            setEditGuruTemp={setEditGuruTemp}
            editNamaKeluargaTemp={editNamaKeluargaTemp}
            setEditNamaKeluargaTemp={setEditNamaKeluargaTemp}
            editAdminNamaSistemTemp={editAdminNamaSistemTemp}
            setEditAdminNamaSistemTemp={setEditAdminNamaSistemTemp}
            editAdminNamaTemp={editAdminNamaTemp}
            setEditAdminNamaTemp={setEditAdminNamaTemp}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            newPasswordInput={newPasswordInput}
            setNewPasswordInput={setNewPasswordInput}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showPasswordConfirmModal={showPasswordConfirmModal}
            setShowPasswordConfirmModal={setShowPasswordConfirmModal}
            passwordToast={passwordToast}
            setPasswordToast={setPasswordToast}
            editKod2Temp={editKod2Temp}
            setEditKod2Temp={setEditKod2Temp}
            editKelas2Temp={editKelas2Temp}
            setEditKelas2Temp={setEditKelas2Temp}
            isChangingCode1={isChangingCode1}
            setIsChangingCode1={setIsChangingCode1}
            newCode1Input={newCode1Input}
            setNewCode1Input={setNewCode1Input}
            isChangingCode2={isChangingCode2}
            setIsChangingCode2={setIsChangingCode2}
            newCode2Input={newCode2Input}
            setNewCode2Input={setNewCode2Input}
            teacherCanHaveClass2={teacherCanHaveClass2}
            isChangingFamilyCode={isChangingFamilyCode}
            setIsChangingFamilyCode={setIsChangingFamilyCode}
            newFamilyCodeInput={newFamilyCodeInput}
            setNewFamilyCodeInput={setNewFamilyCodeInput}
            isChangingClassName1={isChangingClassName1}
            setIsChangingClassName1={setIsChangingClassName1}
            newClassName1Input={newClassName1Input}
            setNewClassName1Input={setNewClassName1Input}
            isChangingClassName2={isChangingClassName2}
            setIsChangingClassName2={setIsChangingClassName2}
            newClassName2Input={newClassName2Input}
            setNewClassName2Input={setNewClassName2Input}
            setIsChangingFamilyName={setIsChangingFamilyName}
            setIsProPricingModalOpen={setIsProPricingModalOpen}
            setProPricingTab={setProPricingTab}
            handleSaveClassName1={handleSaveClassName1}
            handleSaveClassCode1={handleSaveClassCode1}
            handleSaveClassName2={handleSaveClassName2}
            handleSaveClassCode2={handleSaveClassCode2}
            handleSaveFamilyCode={handleSaveFamilyCode}
            registerCodeInRegistry={registerCodeInRegistry}
            setIsEditModalOpen={setIsEditModalOpen}
            isEffectiveTrial={isEffectiveTrial}
            isEffectivePro={isEffectivePro}
          />
          </Suspense>

          {/* Modal Panduan 3D Bunyi Kata */}
          <AnimatePresence>
            {showVRGuideModal && (() => {
              const isBacaan = (window as any).vrCurrentMode === 'bacaan';
              const modalTitle = isBacaan ? '3D Bacaan Bergred' : '3D Bunyi Kata';
              const modalDesc = isBacaan
                ? 'Terokai Muzium Bacaan Bergred dalam mod 3D! Lawati 5 dewan pameran: Dewan Ayat Pendek, Dewan Ayat Panjang, Galeri Petikan Tahap 1 & 2, dan Pavilion Cerita Pendek. Gunakan joystick atau seret skrin untuk bergerak.'
                : 'Terokai Muzium Bunyi Kata dalam mod 3D! Pusingkan peranti atau seret skrin untuk melihat 4 dinding pameran (Huruf Fonik, Huruf Kecil, Galeri Asas Nombor 0-10, dan Siri Nombor 10-100). Terokai pameran dengan gambar dan sebutan audio interaktif!';
              const features = isBacaan
                ? [
                  { icon: 'fa-solid fa-book-open-reader', label: '5 Galeri Pameran' },
                  { icon: 'fa-solid fa-gamepad', label: 'Joystick / Seret' },
                  { icon: 'fa-solid fa-arrows-spin', label: 'Pusing 360\u00B0' },
                ]
                : [
                  { icon: 'fa-solid fa-cube', label: 'Dunia 3D' },
                  { icon: 'fa-solid fa-volume-high', label: 'Sebut Audio' },
                  { icon: 'fa-solid fa-arrows-spin', label: 'Pusing 360\u00B0' },
                ];
              const accentColor = isBacaan ? '#7c3aed' : '#ea580c';
              const borderColor = isBacaan ? '#6d28d9' : '#c2410c';
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.75)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "16px",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  }}
                  onClick={() => setShowVRGuideModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="neo-box"
                    style={{
                      backgroundColor: "#ffffff",
                      backgroundImage:
                        "radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)",
                      backgroundSize: "16px 16px",
                      maxWidth: "520px",
                      width: "100%",
                      padding: "28px 24px",
                      textAlign: "center",
                      borderRadius: "24px",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
                      border: `4px solid ${accentColor}`,
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      position: "relative",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2
                      style={{
                        fontSize: "1.6rem",
                        color: "#ffffff",
                        backgroundColor: accentColor,
                        padding: "6px 24px",
                        borderRadius: "16px",
                        display: "inline-block",
                        margin: "0 0 15px 0",
                        fontWeight: "bold",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                        border: `3px solid ${borderColor}`,
                      }}
                    >
                      {modalTitle}
                    </h2>

                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#1e293b",
                        margin: "0 0 20px 0",
                        lineHeight: 1.6,
                        fontWeight: "bold",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      }}
                    >
                      {modalDesc}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "12px",
                        marginBottom: "24px",
                        padding: "14px 10px",
                        backgroundColor: "rgba(248, 250, 252, 0.9)",
                        borderRadius: "16px",
                        border: "2px solid #cbd5e1",
                      }}
                    >
                      {features.map((f, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ marginBottom: "6px" }}>
                            <i
                              className={f.icon}
                              style={{ fontSize: "1.6rem", color: accentColor }}
                            ></i>
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              color: "#1e293b",
                              fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                            }}
                          >
                            {f.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="neo-btn"
                      style={{
                        backgroundColor: "#168f81",
                        color: "#ffffff",
                        fontSize: "1.1rem",
                        padding: "12px 32px",
                        width: "100%",
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                        fontWeight: "bold",
                        justifyContent: "center",
                        textTransform: "none",
                      }}
                      onClick={() => setShowVRGuideModal(false)}
                    >
                      Mula Belajar
                    </button>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>


          {/* Modal Pilihan Cara Mula */}
          <Suspense fallback={null}>
            <EntryChoiceModal
            isEntryChoiceModalOpen={isEntryChoiceModalOpen}
            setIsEntryChoiceModalOpen={setIsEntryChoiceModalOpen}
            isCodeModalOpen={isCodeModalOpen}
            setIsCodeModalOpen={setIsCodeModalOpen}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            setIsModeMenuOpen={setIsModeMenuOpen}
            setIsModeChoiceOpen={setIsModeChoiceOpen}
            setIsAdminActive={setIsAdminActive}
            setUserAccessLevel={setUserAccessLevel}
            setShowLoginModal={setShowLoginModal}
            setPendingLoginMode={setPendingLoginMode}
            setAuthModalTab={setAuthModalTab}
            setLoginEmail={setLoginEmail}
            setLoginPassword={setLoginPassword}
            setRegGuruNama={setRegGuruNama}
            setRegGuruSekolah={setRegGuruSekolah}
            setRegNamaKeluarga={setRegNamaKeluarga}
            setAuthModalError={setAuthModalError}
          />
          </Suspense>

          {/* Modal Pilih Mod bagi Tujuan Langganan Pakej */}
          <Suspense fallback={null}>
            <ModeChoiceModal
            isOpen={isModeChoiceOpen}
            onClose={() => setIsModeChoiceOpen(false)}
            onSelectMode={(mode) => {
              setProPricingTab(mode);
              setIsModeChoiceOpen(false);
              setIsProPricingModalOpen(true);
            }}
          />
          </Suspense>

          {/* Modal Log Masuk */}
          <Suspense fallback={null}>
            <AuthModal
            isOpen={showLoginModal}
            initialTab={authModalTab}
            pendingLoginMode={pendingLoginMode}
            pendingSelectedPlan={pendingSelectedPlan}
            onClose={() => {
              setShowLoginModal(false);
              setPendingSelectedPlan(null);
            }}
            setUserAccessLevel={setUserAccessLevel}
            setIsMandatorySetup={setIsMandatorySetup}
            setEditModalMode={setEditModalMode}
            setIsEditModalOpen={setIsEditModalOpen}
            setTeacherPlanName={setTeacherPlanName}
          />
          </Suspense>

          {/* Modal Terma Perkhidmatan & Dasar Privasi */}
          <Suspense fallback={null}>
            <TermsPrivacyModal
              isOpen={isLegalModalOpen}
              initialTab={legalModalTab}
              onClose={() => setIsLegalModalOpen(false)}
            />
          </Suspense>

          {/* Modal Pilih Mod -> Pakej Bunyi Kata */}
          <Suspense fallback={null}>
            <PricingProModal
            isOpen={isModeMenuOpen || isProPricingModalOpen}
            initialTab={proPricingTab || "guru"}
            onClose={() => {
              setIsModeMenuOpen(false);
              setIsProPricingModalOpen(false);
            }}
            onSelectPlanRegister={(category, planInfo) => {
              // PENDAFTARAN SENDIRI DITUTUP.
              // Semua permintaan langganan dihalakan ke WhatsApp admin. Akaun
              // hanya dicipta oleh admin (lihat adminService / panel admin).
              setIsModeMenuOpen(false);
              setIsProPricingModalOpen(false);

              // Fasa 2: nama pakej mengikut sebutan rasmi (cth. "3 Bulan (Pro)").
              // `period` ialah label ringkas ("3 Bulan"); kita cantum nama Pro.
              const namaPakej =
                planInfo?.name && /pro/i.test(planInfo.name)
                  ? planInfo.name
                  : `${planInfo?.period || planInfo?.name || ""}${
                      planInfo?.period ? " (Pro)" : ""
                    }`;
              // Mesej rasmi + kod affiliate (jika ada) dari storan.
              const mesej = mesejDaftarPakej(namaPakej.trim());

              const berjaya = hubungiAdminWhatsapp(mesej);

              if (typeof (window as any).paparNotifikasiUmum === "function") {
                (window as any).paparNotifikasiUmum(
                  berjaya
                    ? "Pendaftaran akaun diuruskan oleh admin. Sila teruskan perbualan di WhatsApp untuk melanggan pakej."
                    : "Pendaftaran akaun diuruskan oleh admin. Sila hubungi admin untuk melanggan pakej.",
                );
              }
            }}
            onSelectAffiliateRegister={() => {
              // Butang "Daftar" pada kad Pakej Affiliate dalam popup Pakej Pro:
              // hantar TERUS ke WhatsApp admin dengan template khas affiliate.
              setIsModeMenuOpen(false);
              setIsProPricingModalOpen(false);

              const mesej = mesejDaftarAffiliate();
              const berjaya = hubungiAdminWhatsapp(mesej);

              if (typeof (window as any).paparNotifikasiUmum === "function") {
                (window as any).paparNotifikasiUmum(
                  berjaya
                    ? "Pendaftaran akaun diuruskan oleh admin. Sila teruskan perbualan di WhatsApp untuk menyertai Pakej Affiliate."
                    : "Pendaftaran akaun diuruskan oleh admin. Sila hubungi admin untuk menyertai Pakej Affiliate.",
                );
              }
            }}
          />
          </Suspense>

          {/* Modal Maklumat Koleksi Lencana Utama & Sijil */}
          <AppInfoModals
            feedbackNama={feedbackNama}
            setFeedbackNama={setFeedbackNama}
            feedbackMesej={feedbackMesej}
            setFeedbackMesej={setFeedbackMesej}
            feedbackStatus={feedbackStatus}
            hantarFeedback={hantarFeedback}
            setUserAccessLevel={setUserAccessLevel}
            setIsAdminActive={setIsAdminActive}
          />
        </>,
        document.body
      )}

      {/* Koleksi Siri Buku Cerita Bunyi Kata Modal */}
      <AnimatePresence>
        {showBukuCeritaModal && (
          <Suspense fallback={null}>
            <BukuCeritaModal
              initialBookId={initialBukuCeritaId}
              onClose={() => {
                setShowBukuCeritaModal(false);
                setInitialBukuCeritaId(null);
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Cuba Sebut / Cuba Baca Interactive Game Modal */}
      <AnimatePresence>
        {showCubaSebut && (
          <Suspense fallback={null}>
            <CubaSebutGame
            mode={cubaSebutConfig.mode}
            categoryKey={cubaSebutConfig.key}
            categoryLabel={cubaSebutConfig.label}
            onClose={() => {
              setShowCubaSebut(false);
              if ((window as any).paparSkrin) (window as any).paparSkrin("map-screen");
            }}
            onChooseOtherSkill={() => {
              setShowCubaSebut(false);
              if (cubaSebutConfig.mode === 'baca') {
                if ((window as any).showCubaBacaModal) (window as any).showCubaBacaModal();
              } else {
                if ((window as any).showCubaSebutModal) (window as any).showCubaSebutModal();
              }
            }}
          />
          </Suspense>
        )}
      </AnimatePresence>

    </div>
  );
}
