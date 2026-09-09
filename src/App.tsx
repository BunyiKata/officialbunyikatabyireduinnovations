// @ts-nocheck
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { TandukKataGame } from "./components/TandukKataGame";
import { PerpustakaanGame } from "./components/PerpustakaanGame";
import { CabaranSukuKataGame } from "./components/CabaranSukuKataGame";
import { PuzzleSukuKataGame } from "./components/PuzzleSukuKataGame";
import { CantumKataGame } from "./components/CantumKataGame";
import { FonikAbcGame } from "./components/FonikAbcGame";
import { NomborGame } from "./components/NomborGame";
import { KadImbasanNomborGame, KadImbasanNomborMode } from "./components/KadImbasanNomborGame";
import { SukuKataPuzzleBar } from "./components/SukuKataPuzzleBar";
import { BukuCeritaModal } from "./components/BukuCeritaModal";
import { CubaSebutGame } from "./components/CubaSebutGame";
import { AdminSijilManager } from "./components/AdminSijilManager";
import "./utils/sijilGenerator";
import "./index.css";
import { motion, AnimatePresence } from "motion/react";
import {
  loginWithEmail,
  registerWithEmail,
  logout as firebaseLogout,
  getCurrentUserProfile,
  sendPasswordResetEmail,
  updateUserPasswordInFirebase,
} from "./services/authService";
import {
  getClassByCode,
  getFamilyByCode,
  getStudentsByClassId,
  getStudentsByFamilyId,
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
} from "./services/firebaseService";

if (typeof window !== "undefined") {
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
}

function PirateAvatar3DSwiper({
  onStart,
  onOpenProPackage,
  onRequestEntryChoice,
}: {
  onStart?: () => void;
  onOpenProPackage?: () => void;
  onRequestEntryChoice?: () => void;
} = {}) {
  const characters = [
    {
      id: 1,
      name: "Kapten Suku",
      icon: "/images/avatar/avatar1.png",
      unlocked: true,
      tag: "Terbuka",
    },
    {
      id: 2,
      name: "Pahlawan Kata",
      icon: "/images/avatar/avatar2.png",
      unlocked: true,
      tag: "Terbuka",
    },
    {
      id: 3,
      name: "Pendekar ABC",
      icon: "/images/avatar/avatar3.png",
      unlocked: false,
      tag: "Tahap 5",
    },
    {
      id: 4,
      name: "Laksamana Suku",
      icon: "/images/avatar/avatar4.png",
      unlocked: false,
      tag: "Tahap 10",
    },
    {
      id: 5,
      name: "Pengembara Vokal",
      icon: "/images/avatar/avatar5.png",
      unlocked: false,
      tag: "Tahap 15",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedAvatar, setSelectedAvatar] = React.useState(
    characters[0].icon,
  );
  const [lockedNotice, setLockedNotice] = React.useState<string | null>(null);
  const dragStartX = React.useRef<number | null>(null);

  const triggerProNotice = (charName?: string) => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    if (onOpenProPackage) {
      onOpenProPackage();
    } else if (typeof (window as any).openPakejProModal === "function") {
      (window as any).openPakejProModal("guru");
    }
  };

  const handleSelectIndex = (idx: number) => {
    setActiveIndex(idx);
    if (characters[idx].unlocked) {
      setSelectedAvatar(characters[idx].icon);
      setLockedNotice(null);
    } else {
      setLockedNotice(
        `Watak ${characters[idx].name} terkunci (${characters[idx].tag})`,
      );
      triggerProNotice(characters[idx].name);
    }
  };

  const handleNext = () => {
    if (activeIndex < characters.length - 1) {
      handleSelectIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelectIndex(activeIndex - 1);
    }
  };

  const handlePointerStart = (clientX: number) => {
    dragStartX.current = clientX;
  };

  const handlePointerEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - clientX;
    if (diff > 25) {
      handleNext();
    } else if (diff < -25) {
      handlePrev();
    }
    dragStartX.current = null;
  };

  const activeChar = characters[activeIndex];

  const handleStartGame = () => {
    if (!activeChar.unlocked) {
      triggerProNotice(activeChar.name);
      return;
    }

    const finalAvatar = selectedAvatar;
    (window as any).selectedAvatarIcon = finalAvatar;

    const studentName = (window as any).namaMuridAktif || "Murid";
    if (
      typeof (window as any).studentData !== "undefined" &&
      (window as any).studentData[studentName]
    ) {
      (window as any).studentData[studentName].avatar = finalAvatar;
      if (typeof (window as any).saveStudentData === "function") {
        (window as any).saveStudentData();
      }
    }

    if (onRequestEntryChoice) {
      onRequestEntryChoice();
    } else if (onStart) {
      onStart();
    } else if (typeof (window as any).masukModMurid === "function") {
      (window as any).masukModMurid(studentName);
    }
  };

  // Clean chamfered shape: top-right and bottom-left corners cut
  const containerClip = "polygon(0% 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, 30px 100%, 0% calc(100% - 30px))";

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "485px",
        margin: "0 auto 20px auto",
        padding: "5px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, #064e3b, #34d399, #10b981, #064e3b)",
        backgroundSize: "300% 300%",
        animation: "borderGradientShift 4s ease infinite",
        boxShadow: "0 0 15px rgba(52, 211, 153, 0.4), 0 0 30px rgba(16, 185, 129, 0.3), 0 10px 40px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
      }}
    >
      {/* Tape Element at Center Top */}
      <div
        style={{
          position: "absolute",
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "18px",
          backgroundColor: "#fde047",
          border: "2.5px solid var(--color-dark)",
          borderRadius: "4px",
          boxShadow: "0 2px 0 var(--color-dark)",
          zIndex: 30,
        }}
      />

      <div
        className="neo-box"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0e7a6e",
          backgroundImage:
            "linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(rgba(255,255,255,0.18) 2.5px, transparent 2.5px)",
          backgroundSize: "100% 100%, 18px 18px",
          border: "2px solid rgba(52, 211, 153, 0.3)",
          borderRadius: "20px",
          boxShadow: "inset 10px 10px 20px rgba(255,255,255,0.05), inset -10px -10px 20px rgba(0,0,0,0.2)",
          padding: "20px 16px 18px 16px",
          textAlign: "center",
          position: "relative",
          color: "white",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Scanning Line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(to right, transparent, rgba(52, 211, 153, 0.8), transparent)",
          boxShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
          zIndex: 1,
          animation: "gamingScanLine 4s linear infinite",
          opacity: 0.5,
          pointerEvents: "none"
        }} />

        {/* 3D Swiper Stage */}
        <div
          onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handlePointerEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => handlePointerStart(e.clientX)}
          onMouseUp={(e) => handlePointerEnd(e.clientX)}
          style={{
            position: "relative",
            zIndex: 5,
            height: "200px",
            width: "100%",
            perspective: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            userSelect: "none",
            touchAction: "pan-y",
          }}
        >
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            style={{
              position: "absolute",
              left: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 35,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor:
                activeIndex === 0 ? "rgba(255,255,255,0.3)" : "#f59e0b",
              border: "2px solid white",
              color: activeIndex === 0 ? "#cbd5e1" : "#000",
              fontWeight: "900",
              fontSize: "1.2rem",
              cursor: activeIndex === 0 ? "default" : "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === characters.length - 1}
            style={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 35,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor:
                activeIndex === characters.length - 1
                  ? "rgba(255,255,255,0.3)"
                  : "#f59e0b",
              border: "2px solid white",
              color: activeIndex === characters.length - 1 ? "#cbd5e1" : "#000",
              fontWeight: "900",
              fontSize: "1.2rem",
              cursor:
                activeIndex === characters.length - 1 ? "default" : "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Cards */}
          {characters.map((char, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);

            let xPos = offset * 110;
            let rotateY = offset * -28;
            let scale = 1 - absOffset * 0.2;
            let opacity = 1 - absOffset * 0.45;
            let zIndex = 25 - absOffset * 5;

            if (absOffset > 2) {
              opacity = 0;
            }

            const isSelected =
              char.icon === selectedAvatar &&
              char.unlocked &&
              activeIndex === idx;

            return (
              <div
                key={char.id}
                className={isSelected ? "gaming-card-glow" : ""}
                onClick={() => handleSelectIndex(idx)}
                style={{
                  position: "absolute",
                  width: "135px",
                  height: "170px",
                  borderRadius: "18px",
                  backgroundColor: isSelected ? "#fffdf7" : "#f7f4eb",
                  backgroundImage: isSelected
                    ? "radial-gradient(#e5dec9 0.75px, transparent 0.75px), linear-gradient(135deg, #ffffff 0%, #fffdf7 50%, #f5eee0 100%)"
                    : "radial-gradient(#dcd5c0 0.75px, transparent 0.75px), linear-gradient(135deg, #f7f4eb 0%, #ebe4d5 100%)",
                  backgroundSize: "10px 10px, 100% 100%",
                  border: isSelected
                    ? "4px solid #f59e0b"
                    : char.unlocked
                      ? "3px solid #10b981"
                      : "3px solid #64748b",
                  boxShadow: isSelected
                    ? "0 0 16px rgba(245, 158, 11, 0.8), 0 8px 20px rgba(0,0,0,0.25)"
                    : "0 8px 20px rgba(0,0,0,0.2), inset 0 0 10px rgba(180, 160, 120, 0.12)",
                  transform: `translateX(${xPos}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                  opacity: Math.max(0, opacity),
                  zIndex: zIndex,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 6px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* Paper Card Texture & Grain Overlay for Unlocked */}
                {char.unlocked && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "18px",
                      backgroundImage:
                        "linear-gradient(0deg, rgba(160, 140, 100, 0.05) 1px, transparent 1px)",
                      backgroundSize: "100% 3px",
                      pointerEvents: "none",
                      zIndex: 1,
                      border: "1px solid rgba(210, 190, 160, 0.45)",
                    }}
                  />
                )}

                {/* Shine Sweep Glint Loop Animation for Selected Card */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "18px",
                      overflow: "hidden",
                      pointerEvents: "none",
                      zIndex: 12,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-150%",
                        width: "60%",
                        height: "200%",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
                        transform: "rotate(25deg)",
                        animation: "shineSweepLoop 3s infinite ease-in-out",
                      }}
                    />
                  </div>
                )}

                {/* Unlocked Card Image Content */}
                {char.unlocked ? (
                  <div
                    style={{
                      position: "relative",
                      width: "110px",
                      height: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 5,
                    }}
                  >
                    <img
                      src={char.icon}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                      }}
                    />
                  </div>
                ) : (
                  /* Locked Card: Inner Dark Slate Box Framed by White/Cream Border */
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerProNotice(char.name);
                    }}
                    style={{
                      position: "absolute",
                      inset: "4px",
                      borderRadius: "13px",
                      backgroundColor: "rgba(30, 41, 59, 0.45)",
                      backgroundImage: "linear-gradient(150deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.6) 100%)",
                      backdropFilter: "blur(0.8px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 6px",
                      boxSizing: "border-box",
                      zIndex: 5,
                      overflow: "hidden",
                    }}
                  >
                    {/* Silhouette background avatar */}
                    <img
                      src={char.icon}
                      alt="Avatar Locked"
                      style={{
                        position: "absolute",
                        width: "90%",
                        height: "90%",
                        objectFit: "contain",
                        filter: "brightness(75%) opacity(0.75)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Lock Icon */}
                    <i
                      className="fa-solid fa-lock"
                      style={{
                        fontSize: "1.9rem",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                        position: "relative",
                        zIndex: 6,
                        marginBottom: "6px",
                      }}
                    ></i>

                    {/* Red Versi Pro Badge */}
                    <div
                      style={{
                        position: "relative",
                        zIndex: 6,
                        fontSize: "0.78rem",
                        fontWeight: "800",
                        color: "#ffffff",
                        backgroundColor: "#dc2626",
                        border: "1.5px solid #ef4444",
                        borderRadius: "10px",
                        padding: "5px 12px",
                        textAlign: "center",
                        lineHeight: "1.2",
                        boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                        letterSpacing: "0.2px",
                      }}
                    >
                      Versi Pro
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          {characters.map((char, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectIndex(idx)}
              style={{
                width: activeIndex === idx ? "22px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  activeIndex === idx ? "#f59e0b" : "rgba(255,255,255,0.4)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Start Button ("Mula") */}
        <button
          id="btn-mula-login"
          type="button"
          className="neo-btn bg-yellow mula-start-btn"
          style={{
            position: "relative",
            zIndex: 10,
            width: "min(75%, 230px)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            padding: "10px 16px",
            color: "var(--color-dark)",
            border: "3px solid #000",
            textTransform: "uppercase",
            fontWeight: "900",
            letterSpacing: "0.5px",
            animation: "mulaBtnGoldPulse 2.2s infinite ease-in-out !important",
          }}
          onClick={handleStartGame}
        >
          <i className="fa-solid fa-play" style={{ marginRight: "8px" }}></i>
          Mula
        </button>
      </div>
    </div>
  );
}

function Lencana3DSwiper() {
  const FIVE_BADGES = [
    {
      id: "badge_peta_1",
      petaId: 1,
      title: "Penjelajah Alfabet",
      displayTitle: "Penjelajah Alfabet",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Kenal Huruf",
      image: "/images/lencana/lencana-penjelajah-alfabet.png",
      mapName: "Cabaran Kenal Huruf",
    },
    {
      id: "badge_peta_2",
      petaId: 2,
      title: "Pemburu Suku Kata",
      displayTitle: "Pemburu Suku Kata",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Suku Kata Asas",
      image: "/images/lencana/lencana-pemburu-suku-kata.png",
      mapName: "Cabaran Suku Kata Asas",
    },
    {
      id: "badge_peta_3",
      petaId: 3,
      title: "Wira Pulau",
      displayTitle: "Wira Pulau",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Suku Kata Hero",
      image: "/images/lencana/lencana-wira-pulau.png",
      mapName: "Cabaran Suku Kata Hero",
    },
    {
      id: "badge_peta_4",
      petaId: 4,
      title: "Naib Raja Bacaan",
      displayTitle: "Naib Raja Bacaan",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Bacaan Bergred",
      image: "/images/lencana/lencana-naib-raja-bacaan.png",
      mapName: "Cabaran Bacaan Bergred",
    },
    {
      id: "badge_master",
      petaId: "all",
      title: "Kapten Harta Karun",
      displayTitle: "Kapten Harta Karun",
      desc: "Buka kesemua 4 lencana utama untuk memperoleh Sijil Pencapaian",
      image: "/images/lencana/lencana-kapten-harta-karun.png",
      mapName: "Koleksi Semua Cabaran",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [winWidth, setWinWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 800
  );
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef<number | null>(null);
  const [badgeStatus, setBadgeStatus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = winWidth <= 640;
  const isLaptop = winWidth >= 721;

  const checkBadgeStatus = () => {
    const data = typeof (window as any).getCurrentProfileData === 'function' ? (window as any).getCurrentProfileData() : null;
    const status: Record<string, boolean> = {};

    FIVE_BADGES.forEach((b) => {
      let isUnlocked = false;
      if (typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted(b.petaId, data)) {
        isUnlocked = true;
      }
      if (data && data.badges && data.badges.includes(b.id)) {
        isUnlocked = true;
      }
      status[b.id] = isUnlocked;
    });

    setBadgeStatus(status);

    const all4Unlocked = Boolean(
      (typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted('all', data)) ||
      (status['badge_peta_1'] && status['badge_peta_2'] && status['badge_peta_3'] && status['badge_peta_4'])
    );

    const sijilBtn = document.getElementById('sijil-btn') as HTMLButtonElement | null;
    const lockIcon = document.getElementById('sijil-lock-icon');
    const mainIcon = document.getElementById('sijil-main-icon');
    if (sijilBtn) {
      if (all4Unlocked) {
        sijilBtn.classList.remove('is-locked');
        sijilBtn.classList.add('is-unlocked');
        if (lockIcon) lockIcon.style.display = 'none';
        if (mainIcon) mainIcon.style.display = 'inline-block';
      } else {
        sijilBtn.classList.remove('is-unlocked');
        sijilBtn.classList.add('is-locked');
        if (lockIcon) lockIcon.style.display = 'inline-block';
        if (mainIcon) mainIcon.style.display = 'none';
      }
    }
  };

  React.useEffect(() => {
    checkBadgeStatus();
    const handleUpdate = () => checkBadgeStatus();
    window.addEventListener("kemaskini-profil", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Auto popup maklumat lencana setiap kali masuk skrin Lencana Saya
    const timer = setTimeout(() => {
      const screen = document.getElementById("lencana-screen");
      if (screen && screen.classList.contains("active")) {
        if (typeof (window as any).bukaModalInfoLencana === "function") {
          (window as any).bukaModalInfoLencana();
        }
      }
    }, 350);

    return () => {
      window.removeEventListener("kemaskini-profil", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearTimeout(timer);
    };
  }, []);

  const totalBadges = FIVE_BADGES.length;

  const playSwipeSound = () => {
    try {
      if (typeof (window as any).playBubble === "function") {
        (window as any).playBubble();
        return;
      }
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.09);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch (e) { }
  };

  const handleNext = () => {
    playSwipeSound();
    setActiveIndex((prev) => (prev + 1) % totalBadges);
  };

  const handlePrev = () => {
    playSwipeSound();
    setActiveIndex((prev) => (prev - 1 + totalBadges) % totalBadges);
  };

  const handlePointerStart = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handlePointerEnd = (clientX?: number) => {
    if (dragStartX.current === null) return;
    const finalOffset = clientX !== undefined ? clientX - dragStartX.current : dragOffset;
    if (finalOffset < -35) {
      handleNext();
    } else if (finalOffset > 35) {
      handlePrev();
    }
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleBadgeClick = (b: any, isUnlocked: boolean) => {
    if (Math.abs(dragOffset) > 8) return;
    if (isUnlocked) {
      if ((window as any).bukaDetailLencana) {
        (window as any).bukaDetailLencana(b.title, b.desc, b.image, b.mapName, b.petaId === 'all');
      }
    } else {
      const msg =
        b.petaId === 'all'
          ? `Lencana "${b.title}" masih terkunci! Selesaikan sekurang-kurangnya 3 aktiviti (skor 3 bintang penuh) dalam setiap 4 cabaran utama untuk membuka lencana ini dan Sijil Pencapaian.`
          : `Lencana "${b.title}" masih terkunci! Dapatkan 3 bintang (skor penuh) dalam sekurang-kurangnya 3 aktiviti ${b.mapName} untuk membuka lencana ini.`;

      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Lencana Masih Terkunci", msg, "warning");
      } else {
        alert(msg);
      }
    }
  };

  const getCircularOffset = (idx: number, active: number, total: number = 5) => {
    let diff = idx - active;
    while (diff < -total / 2) diff += total;
    while (diff > total / 2) diff -= total;
    return diff;
  };

  const stepX = isMobile ? 88 : (isLaptop ? 205 : 135);
  const dragFraction = isDragging ? Math.max(-1.2, Math.min(1.2, dragOffset / stepX)) : 0;

  return (
    <div style={{ width: "100%", margin: "0 auto", position: "relative", userSelect: "none" }}>
      {/* 3D Swiper Stage */}
      <div
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
          height: isMobile ? "145px" : (isLaptop ? "245px" : "175px"),
          width: "100%",
          perspective: "850px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "4px 0 6px" : (isLaptop ? "12px 0 16px" : "8px 0 10px"),
          touchAction: "pan-y",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Left Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          style={{
            position: "absolute",
            left: isLaptop ? "12px" : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            height: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            borderRadius: "50%",
            backgroundColor: "#f59e0b",
            border: "2.5px solid var(--color-dark, #10182f)",
            color: "#10182f",
            fontWeight: "900",
            fontSize: isLaptop ? "1.3rem" : (isMobile ? "1rem" : "1.1rem"),
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label="Lencana Sebelumnya"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          style={{
            position: "absolute",
            right: isLaptop ? "12px" : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            height: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            borderRadius: "50%",
            backgroundColor: "#f59e0b",
            border: "2.5px solid var(--color-dark, #10182f)",
            color: "#10182f",
            fontWeight: "900",
            fontSize: isLaptop ? "1.3rem" : (isMobile ? "1rem" : "1.1rem"),
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label="Lencana Seterusnya"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* 3D Cards */}
        {FIVE_BADGES.map((badge, idx) => {
          const unlocked = Boolean(badgeStatus[badge.id]);
          const baseOffset = getCircularOffset(idx, activeIndex, totalBadges);
          const centerOffset = baseOffset + dragFraction;
          const absOffset = Math.abs(centerOffset);

          const xPos = centerOffset * stepX;
          const rotateY = Math.max(-20, Math.min(20, centerOffset * (isMobile ? -10 : -8)));
          const scale = isMobile
            ? Math.max(0.72, 1.0 - absOffset * 0.22)
            : Math.max(0.75, 1.02 - absOffset * 0.22);
          const opacity = Math.max(0, 1 - Math.max(0, absOffset - 0.4) * 0.65);
          const zIndex = Math.round(30 - absOffset * 8);

          if (absOffset > 2.2) {
            return null;
          }

          const isPrimaryInView = absOffset < 0.45;

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge, unlocked)}
              className={`badge-card-item ${unlocked ? "is-unlocked" : "is-locked"}`}
              style={{
                position: "absolute",
                width: isMobile ? "105px" : (isLaptop ? "185px" : "135px"),
                height: isMobile ? "135px" : (isLaptop ? "220px" : "160px"),
                borderRadius: isMobile ? "16px" : (isLaptop ? "24px" : "18px"),
                backgroundColor: "#ffffff",
                border: isPrimaryInView
                  ? unlocked
                    ? "3.5px solid #9333ea"
                    : "3.5px solid var(--color-dark, #10182f)"
                  : "2px solid #64748b",
                boxShadow: isPrimaryInView
                  ? unlocked
                    ? "0 8px 18px rgba(147, 51, 234, 0.35), 0 4px 0 var(--color-dark, #10182f)"
                    : "0 8px 18px rgba(0,0,0,0.25), 0 4px 0 var(--color-dark, #10182f)"
                  : "0 3px 8px rgba(0,0,0,0.15)",
                transform: `translateX(${xPos}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.35s ease, box-shadow 0.35s ease",
                opacity: opacity,
                zIndex: zIndex,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: isLaptop ? "10px" : "6px",
                boxSizing: "border-box",
                userSelect: "none",
              }}
            >
              {/* Top Purple Ribbon Tab */}
              <div
                style={{
                  width: isMobile ? "32px" : (isLaptop ? "52px" : "40px"),
                  height: isLaptop ? "8px" : "6px",
                  backgroundColor: "var(--color-purple, #9333ea)",
                  border: "2px solid var(--color-dark, #10182f)",
                  borderRadius: "4px",
                  position: "absolute",
                  top: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 5,
                }}
              />

              {/* Badge Image Frame */}
              <div
                style={{
                  position: "relative",
                  width: isMobile ? "90px" : (isLaptop ? "165px" : "120px"),
                  height: isMobile ? "90px" : (isLaptop ? "165px" : "120px"),
                  backgroundColor: "#f8fafc",
                  border: `2px solid ${unlocked ? "#9333ea" : "#94a3b8"}`,
                  borderRadius: isLaptop ? "18px" : "14px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="shine-sweep-slow"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                />
                <img
                  src={badge.image}
                  alt={badge.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                    filter: unlocked ? "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" : "grayscale(100%) opacity(0.4)",
                  }}
                />

                {!unlocked && (
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      color: "white",
                      fontSize: isMobile ? "1.8rem" : (isLaptop ? "3.2rem" : "2.4rem"),
                      textShadow: "0px 2px 6px rgba(0,0,0,0.85)",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2px" }}>
        {[0, 1, 2, 3, 4].map((pos) => (
          <div
            key={pos}
            onClick={() => {
              if (activeIndex !== pos) {
                playSwipeSound();
                setActiveIndex(pos);
              }
            }}
            style={{
              width: activeIndex === pos ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: activeIndex === pos ? "#f59e0b" : "rgba(255, 255, 255, 0.45)",
              border: "1.5px solid var(--color-dark, #10182f)",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const masukModMurid = (...args) => (window as any).masukModMurid?.(...args);
const masukModGuru = (...args) => (window as any).masukModGuru?.(...args);
const toggleTheme = (...args) => (window as any).toggleTheme?.(...args);
const backToModeSelection = (...args) =>
  (window as any).backToModeSelection?.(...args);
const tutupSidePanel = (...args) => (window as any).tutupSidePanel?.(...args);
const paparSkrin = (...args) => (window as any).paparSkrin?.(...args);
const muatTurunSijil = (...args) => (window as any).muatTurunSijil?.(...args);
const janaMuatTurunSijilPDF = (...args) =>
  (window as any).janaMuatTurunSijilPDF?.(...args);
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

function SplashScreen({ onFinish }: { onFinish: () => void }) {
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
        backgroundColor: "transparent",
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


export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
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

  const [activeStudentName, setActiveStudentName] = React.useState<string>(() => {
    return (
      (typeof window !== "undefined" && (window as any).namaMuridAktif) ||
      localStorage.getItem("muridAktif") ||
      localStorage.getItem("bunyiKataCurrentMurid") ||
      "Murid"
    );
  });
  const [editModalMode, setEditModalMode] = React.useState<"guru" | "ibubapa" | "admin">("guru");

  React.useEffect(() => {
    const syncStudent = (e?: any) => {
      const name =
        (e && e.detail && e.detail.name) ||
        (window as any).namaMuridAktif ||
        localStorage.getItem("muridAktif") ||
        localStorage.getItem("bunyiKataCurrentMurid") ||
        "Murid";
      setActiveStudentName(name);
    };
    window.addEventListener("student-changed", syncStudent);
    window.addEventListener("storage", syncStudent);
    return () => {
      window.removeEventListener("student-changed", syncStudent);
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
        setEditKodTemp(
          (localStorage.getItem("bunyiKataKodAdmin") || "ADMIN#01").toUpperCase(),
        );
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
  const [exportSchoolInput, setExportSchoolInput] = React.useState(() => localStorage.getItem('pdf_sekolah') || 'SK BUKIT BERUANG');
  const [exportClassInput, setExportClassInput] = React.useState(() => localStorage.getItem('bunyiKataNamaKelas') || localStorage.getItem('pdf_kelas') || '');
  const [exportTeacherInput, setExportTeacherInput] = React.useState(() => localStorage.getItem('pdf_guru') || 'MUHAMMAD IZZAT BIN RAZAK');

  React.useEffect(() => {
    (window as any).bukaModalExport = () => {
      setExportSchoolInput(localStorage.getItem('pdf_sekolah') || 'SK BUKIT BERUANG');
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
        "• Pakej Guru: Menyokong pengurusan rekod sehingga 2 kelas murid, pantauan statistik latihan serta muat turun laporan prestasi murid.\n• Pakej Ibu Bapa: Menyokong pendaftaran dan rekod perkembangan sehingga 3 orang anak dalam satu akaun.",
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
      if (
        (window as any).isGuestMode ||
        (window as any).userAccessLevel === "trial" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
        (window as any).namaMuridAktif === "Tetamu"
      ) {
        return false;
      }
      return !!(
        (window as any).modAdminAktif ||
        (window as any).isAdminMode ||
        localStorage.getItem("bunyiKataUserRole") === "admin" ||
        (typeof document !== "undefined" && (
          document.body?.classList?.contains("admin-mode") ||
          document.getElementById("teacher-banner-badge")?.innerText?.toUpperCase().includes("ADMIN")
        )) ||
        (window as any).currentUser?.peranan === "admin"
      );
    } catch (e) {
      return false;
    }
  }, []);

  const [isAdminActive, setIsAdminActive] = React.useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      if (
        (window as any).isGuestMode ||
        (window as any).userAccessLevel === "trial" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
        (window as any).namaMuridAktif === "Tetamu"
      ) {
        return false;
      }
      return !!(
        (window as any).modAdminAktif ||
        (window as any).isAdminMode ||
        localStorage.getItem("bunyiKataUserRole") === "admin" ||
        (typeof document !== "undefined" && (
          document.body?.classList?.contains("admin-mode") ||
          document.getElementById("teacher-banner-badge")?.innerText?.toUpperCase().includes("ADMIN")
        )) ||
        (window as any).currentUser?.peranan === "admin"
      );
    } catch (e) {
      return false;
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const [userAccessLevel, setUserAccessLevel] = React.useState<"trial" | "pro">(() => {
    if (typeof window !== "undefined") {
      if (
        (window as any).isGuestMode ||
        (window as any).namaMuridAktif === "Tetamu" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial"
      ) {
        return "trial";
      }
      if (
        localStorage.getItem("bunyiKataUserRole") === "admin" ||
        (typeof document !== "undefined" && (
          document.body?.classList?.contains("admin-mode") ||
          document.getElementById("teacher-banner-badge")?.innerText?.toUpperCase().includes("ADMIN")
        )) ||
        (window as any).modAdminAktif ||
        (window as any).isAdminMode
      ) {
        return "pro";
      }
      return (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || "trial";
    }
    return "trial";
  });

  React.useEffect(() => {
    const handleAdminSync = () => {
      const isGuest =
        (window as any).isGuestMode ||
        (window as any).userAccessLevel === "trial" ||
        localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
        (window as any).namaMuridAktif === "Tetamu";

      if (isGuest) {
        setIsAdminActive(false);
        setUserAccessLevel("trial");
        (window as any).userAccessLevel = "trial";
        (window as any).isGuestMode = true;
        return;
      }

      const admin = isUserAdmin();
      setIsAdminActive(admin);
      if (admin) {
        setUserAccessLevel("pro");
        (window as any).userAccessLevel = "pro";
        (window as any).modAdminAktif = true;
        (window as any).isAdminMode = true;
        (window as any).isGuestMode = false;
        localStorage.setItem("bunyiKataAccessLevel", "pro");
      }
    };
    handleAdminSync();

    window.addEventListener("admin-mode-change", handleAdminSync);
    window.addEventListener("focus", handleAdminSync);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          handleAdminSync();
        }
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

  const isGuestModeActive = Boolean(
    (window as any).isGuestMode ||
    userAccessLevel === "trial" ||
    localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
    (window as any).namaMuridAktif === "Tetamu"
  );
  const isPlanFree =
    localStorage.getItem("bunyiKataTeacherPlan")?.toLowerCase() === "percuma" ||
    localStorage.getItem("bunyiKataParentPlan")?.toLowerCase() === "percuma";
  const isEffectiveTrial = isGuestModeActive || (isPlanFree && !isUserAdmin() && !isAdminActive);
  const isEffectivePro = !isEffectiveTrial;
  const effectiveAccessLevel: "trial" | "pro" = isEffectivePro ? "pro" : "trial";
  const [isEntryChoiceModalOpen, setIsEntryChoiceModalOpen] = React.useState(false);
  const [isProPricingModalOpen, setIsProPricingModalOpen] = React.useState(false);
  const [proPricingTab, setProPricingTab] = React.useState<"guru" | "ibubapa">("guru");
  const [joinCode, setJoinCode] = React.useState("");
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [pendingLoginMode, setPendingLoginMode] = React.useState("");
  const [authModalTab, setAuthModalTab] = React.useState<"login" | "register">("login");
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
  const [teacherPlanName, setTeacherPlanName] = React.useState(() => localStorage.getItem("bunyiKataTeacherPlan") || "Percuma");
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

    const isFree = accessLvl === "trial" || planName.toLowerCase() === "percuma";
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
      } catch (e) {}
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
      alert("Sila masukkan nama kelas 1!");
      return;
    }
    setEditKelasTemp(clean);
    localStorage.setItem("bunyiKataNamaKelas", clean);

    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem("bunyiKataDaftarKelas") || "[]");
    } catch (e) {}
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
        alert("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#01)!");
      }
      return;
    }
    const oldCode = localStorage.getItem("bunyiKataKodKelas") || "";
    if (clean !== oldCode) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "guru", undefined, "kelas1");
      if (collision.isUsed) {
        const msg = `Kod "${clean}" tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          alert(msg);
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
      (window as any).showAppToast("Berjaya Disimpan", `Kod Kelas 1 berjaya ditetapkan kepada "${clean}".`);
    }
  };

  // Helper segerak Nama Kelas 2 ke Storan & Firebase
  const handleSaveClassName2 = async (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Nama Kelas Diperlukan", "Sila masukkan nama kelas 2!", "warning");
      } else {
        alert("Sila masukkan nama kelas 2!");
      }
      return;
    }
    setEditKelas2Temp(clean);
    localStorage.setItem("bunyiKataNamaKelas2", clean);

    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem("bunyiKataDaftarKelas") || "[]");
    } catch (e) {}
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
      (window as any).showAppToast("Berjaya Disimpan", `Nama Kelas 2 berjaya ditetapkan kepada "${clean}".`);
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
        alert("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: KELAS#02)!");
      }
      return;
    }
    const oldCode2 = localStorage.getItem("bunyiKataKodKelas2") || "";
    if (clean !== oldCode2) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "guru", undefined, "kelas2");
      if (collision.isUsed) {
        const msg = `Kod "${clean}" tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          alert(msg);
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
      (window as any).showAppToast("Berjaya Disimpan", `Kod Kelas 2 berjaya ditetapkan kepada "${clean}".`);
    }
  };

  // Helper segerak Nama Keluarga ke Storan & Firebase
  const handleSaveFamilyName = async (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) {
      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Nama Keluarga Diperlukan", "Sila masukkan nama keluarga!", "warning");
      } else {
        alert("Sila masukkan nama keluarga!");
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
      (window as any).showAppToast("Berjaya Disimpan", `Nama Keluarga berjaya ditetapkan kepada "${clean}".`);
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
        alert("Kod mestilah tepat 8 aksara dan mengandungi sekurang-kurangnya 1 simbol (contoh: FAM@2026)!");
      }
      return;
    }
    const oldCode = localStorage.getItem("bunyiKataKodKeluarga") || "";
    if (clean !== oldCode) {
      const collision = await checkIsCodeAlreadyUsedInFirebase(clean, "ibubapa");
      if (collision.isUsed) {
        const msg = `Kod "${clean}" tidak boleh digunakan kerana telah didaftarkan oleh ${collision.usedBy}! Sila pilih kod lain.`;
        if (typeof (window as any).showAppToast === "function") {
          (window as any).showAppToast("Kod Telah Digunakan", msg, "warning");
        } else {
          alert(msg);
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
      (window as any).showAppToast("Berjaya Disimpan", `Kod Keluarga berjaya ditetapkan kepada "${clean}".`);
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
    const kAdm = (localStorage.getItem("bunyiKataKodAdmin") || "").toUpperCase();

    // Semak sekatan kod sistem / admin
    if (currentRole !== "admin") {
      if (code === "ADMIN" || (kAdm && code === kAdm)) {
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
      } catch (e) {}
    }
  };

  useEffect(() => {
    // Bersihkan sebarang sisa maklum balas dummy lama daripada storan tempatan
    try {
      localStorage.removeItem("bunyi_kata_feedbacks");
    } catch (e) {}

    (window as any).isUserAdmin = isUserAdmin;
    (window as any).userAccessLevel = isEffectivePro ? "pro" : userAccessLevel;
    (window as any).setUserAccessLevel = (lvl: "trial" | "pro") => {
      setUserAccessLevel(lvl);
      localStorage.setItem("bunyiKataAccessLevel", lvl);
      (window as any).userAccessLevel = isUserAdmin() ? "pro" : lvl;
    };
    (window as any).openPakejProModal = (tab?: "guru" | "ibubapa") => {
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
    const loginEl = document.getElementById("login-screen");
    if (loginEl && !document.querySelector(".screen.active")) {
      loginEl.classList.add("active");
    }
  }, []);

  useEffect(() => {
    // Inisialisasi langganan Firebase Realtime dan segerakkan data awal
    try {
      initFirebaseRealtimeSubscriptions();
      fetchAdminDataFromFirebase();

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

    // We will load the logic here or via external file
    if (document.getElementById("app-logic-script")) return;
    const v = new Date().getTime();
    const script = document.createElement("script");
    script.id = "app-logic-script";
    script.src = `/app-logic.js?v=${v}`;
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
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      <div
        id="murid-side-panel-overlay"
        className="modal-overlay"
        style={{
          zIndex: "2000",
          justifyContent: "flex-start",
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) tutupSidePanel();
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
            borderRight: "var(--border-thick)",
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
                "linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
              backgroundSize: "100% 100%, 15px 15px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderBottom: "var(--border-thick)",
              position: "relative",
            }}
          >
            <div
              className="profile-card-avatar-box side-panel-avatar-box"
              style={{
                fontSize: "1.5rem",
                background: "white",
                width: "52px",
                height: "52px",
                borderRadius: "13px",
                border: "3px solid #f59e0b",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: "0",
                position: "relative",
                overflow: "hidden",
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
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "flex-start",
              }}
            >
              <h2
                className="murid-info-name"
                style={{
                  fontSize: "1.2rem",
                  margin: "0",
                  wordBreak: "break-word",
                }}
              >
                {activeStudentName}
              </h2>
              <span
                className="score-pill"
                style={{
                  fontSize: "0.85rem",
                  padding: "4px 10px",
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
                <strong id="side-panel-jumlah-markah">0</strong>
              </span>
            </div>
            <button
              className="neo-btn bg-red"
              style={{
                display: "none",
                marginLeft: "auto",
                padding: "5px 10px",
                minWidth: "auto",
                minHeight: "auto",
              }}
              onClick={(e) => {
                tutupSidePanel();
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
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
              className="neo-btn bg-purple"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.1rem",
                padding: "12px",
              }}
              onClick={(e) => {
                tutupSidePanel();
                paparSkrin("lencana-screen");
              }}
            >
              <i className="fa-solid fa-medal" style={{ width: "30px" }}></i>{" "}
              Lencana
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.1rem",
                padding: "12px",
              }}
              onClick={(e) => {
                tutupSidePanel();
                paparSkrin("leaderboard-screen");
              }}
            >
              <i className="fa-solid fa-trophy" style={{ width: "30px" }}></i>{" "}
              Kedudukan
            </button>
          </div>

          <div
            style={{
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px",
                paddingBottom: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                className="neo-btn"
                style={{
                  backgroundColor: "#168f81",
                  color: "white",
                  justifyContent: "flex-start",
                  fontSize: "1.1rem",
                  padding: "12px",
                }}
                onClick={(e) => {
                  tutupSidePanel();
                  paparSkrin("profile-screen");
                }}
              >
                <i className="fa-solid fa-user" style={{ width: "30px" }}></i>{" "}
                Profil
              </button>
            </div>
            <div
              style={{
                padding: "20px",
                borderTop: "var(--border-thick)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                className="neo-btn bg-red"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
                onClick={(e) => {
                  tutupSidePanel();
                  paparSkrin("login-screen");
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Mod Guru & Ibu Bapa */}
      <div id="teacher-top-banner" className="teacher-top-banner">
        <div className="teacher-banner-left">
          <span id="teacher-banner-badge" className="teacher-banner-badge">
            <i className="fa-solid fa-user-shield"></i> MOD ADMIN
          </span>
        </div>
        <div className="teacher-banner-right">
          <button
            className="teacher-banner-btn"
            onClick={() => {
              if ((window as any).modIbuBapaAktif) {
                (window as any).keluarModIbuBapa &&
                  (window as any).keluarModIbuBapa();
              } else if ((window as any).keluarModGuru) {
                (window as any).keluarModGuru();
              }
            }}
            title="Keluar"
            aria-label="Keluar"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </div>
      </div>

      <nav
        id="teacher-sticky-nav"
        className="teacher-sticky-nav student-nav-curved"
        aria-label="Navigasi mod guru"
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

      {/* Modal Popup Laporan Kemajuan (Mod Ibu Bapa - Mobile Only) */}
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

      <div id="modal-pilih-peta" className="modal-overlay">
        <div className="modal-content">
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              tutupModal();
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            id="modal-pilih-peta-tajuk"
            className="neo-btn bg-orange page-title"
            style={{
              margin: "0 auto 20px",
              fontSize: "1.2rem",
              pointerEvents: "none",
              border: "3px solid var(--color-dark)",
              display: "inline-flex",
            }}
          >
            Pilih Peta Kembara
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(140px, 250px))",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={(e) => {
                (window as any).pilihPeta(1);
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-huruf.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
                alt="Misi Asas Bunyi Kata"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Asas Bunyi Kata
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(2);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-suku-kata-asas.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Suku Kata Asas"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Suku Kata Asas
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(3);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-suku-kata-hero.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Suku Kata Hero"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Suku Kata Hero
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(4);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-bacaan-bergred.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Bacaan Bergred"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Bacaan Bergred
              </button>
            </div>
          </div>
        </div>
      </div>

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
              }}
            ></div>
          </div>
          <span>Profil</span>
        </button>
        <button
          className="nav-item bg-purple desktop-nav-only"
          onClick={(e) => {
            paparSkrin("lencana-screen");
          }}
        >
          <i className="fa-solid fa-medal"></i>
          <span>Lencana</span>
        </button>
        <button
          className="nav-item bg-yellow desktop-nav-only"
          onClick={(e) => {
            paparSkrin("leaderboard-screen");
          }}
        >
          <i className="fa-solid fa-trophy"></i>
          <span>Kedudukan</span>
        </button>
        <button
          className="nav-item bg-red desktop-nav-only student-nav-exit-btn"
          onClick={(e) => {
            paparSkrin("login-screen");
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

      <div
        id="login-screen"
        className="screen active"
        style={{
          visibility: showSplash ? "hidden" : "visible",
          opacity: showSplash ? 0 : 1,
          transition: "opacity 0.4s ease-out",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "15px",
            right: "15px",
            display: "flex",
            gap: "10px",
            zIndex: "100",
          }}
        >
          <button
            className="neo-btn bg-yellow teacher-login-icon"
            style={{
              position: "static",
              color: "var(--color-dark)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "glow-outline 2s infinite",
            }}
            onClick={(e) => {
              setIsModeMenuOpen(true);
            }}
            title="Pilih Mod"
          >
            <i
              className="fa-solid fa-bars"
              style={{ margin: "0", fontSize: "1.2rem" }}
            ></i>
          </button>
        </div>

        <div className="login-hero-wrapper">
          <div
            className="logo-besar"
            id="login-logo-container"
            style={{
              padding: "0",
              background: "transparent",
              boxShadow: "none",
              border: "none",
              transform: "none",
              marginTop: "10px",
              marginBottom: "10px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              referrerPolicy="no-referrer"
              src="/images/sampingan/logo-login-screen.png"
              alt="Bunyi Kata"
              className="glitch-logo"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "190px" }}
            />
          </div>

          <div
            id="mode-buttons-container"
            className="mode-buttons-container"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <PirateAvatar3DSwiper
              onRequestEntryChoice={() => {
                setIsEntryChoiceModalOpen(true);
              }}
              onStart={() => {
                (window as any).bukaModalAppInfo &&
                  (window as any).bukaModalAppInfo("murid");
              }}
              onOpenProPackage={() => {
                if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                (window as any).openPakejProModal?.("guru");
              }}
            />
          </div>
        </div>
        <div
          className="neo-box"
          id="mode-selection-card"
          style={{
            width: "90%",
            maxWidth: "485px",
            textAlign: "center",
            backgroundColor: "#168f81",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "100% 100%, 15px 15px",
            padding: "20px",
            margin: "0 auto 25px auto",
            cursor: "pointer",
          }}
          onClick={(e) => {
            setIsCodeModalOpen(true);
          }}
        >
          <div
            style={{
              fontSize: "clamp(0.85rem, 3vw, 1rem)",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Sudah ada kod kelas atau keluarga? <br className="mobile-only-br" />
            <span
              style={{
                color: "#fef08a",
                textDecoration: "underline",
                display: "inline-block",
                marginTop: "5px",
              }}
            >
              Masukkan di sini
            </span>
          </div>
        </div>

        <div
          className="neo-box"
          id="student-login-card"
          style={{
            display: "none",
            position: "relative",
            width: "100%",
            maxWidth: "340px",
            textAlign: "center",
            background: "#168f81",
            padding: "20px",
            margin: "0 auto 25px auto",
          }}
        >
          <button
            onClick={(e) => {
              backToModeSelection();
            }}
            className="neo-btn bg-white"
            style={{
              position: "absolute",
              top: "-15px",
              left: "-15px",
              padding: "8px 12px",
              fontSize: "1rem",
              minWidth: "auto",
              minHeight: "auto",
              borderRadius: "50%",
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2
            id="login-title"
            style={{
              color: "white",
              marginBottom: "15px",
              fontSize: "1.25rem",
            }}
          >
            <i className="fa-solid fa-hand-wave"></i> Sila Pilih Nama Anda
          </h2>
          <select
            id="student-dropdown"
            className="neo-input"
            defaultValue=""
            onChange={(e) => {
              onStudentSelect(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Senarai Nama Murid --
            </option>
          </select>

          <h3
            id="login-avatar-title"
            style={{
              color: "white",
              marginTop: "15px",
              marginBottom: "10px",
              fontSize: "1.1rem",
            }}
          >
            Pilih Avatar
          </h3>
          <div
            id="avatar-selection"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              justifyItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar1.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid var(--color-orange)",
                transform: "scale(1.1)",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/logo-main-screen.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar3.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/avatar/avatar3.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar4.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/avatar/avatar4.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar2.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/avatar/avatar2.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar5.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/avatar/avatar5.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              className="avatar-option"
              onClick={(e) => {
                selectAvatar(
                  "/images/avatar/avatar6.png",
                  e.currentTarget,
                );
              }}
              style={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid transparent",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/avatar/avatar6.png"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
          <button
            className="neo-btn bg-yellow"
            style={{
              width: "min(75%, 220px)",
              margin: "10px auto 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.1rem",
              padding: "10px 16px",
              animation: "pulse-scale 4s infinite",
            }}
            onClick={(e) => {
              const select = document.getElementById(
                "student-dropdown",
              ) as HTMLSelectElement;
              if (!select || !select.value) {
                alert("Sila pilih nama dalam senarai!");
                return;
              }
              (window as any).namaMuridAktif = select.value;
              localStorage.setItem("muridAktif", select.value);
              localStorage.setItem("bunyiKataCurrentMurid", select.value);
              localStorage.setItem("bunyiKataNamaMurid", select.value);
              (window as any).bukaModalAppInfo &&
                (window as any).bukaModalAppInfo("murid");
            }}
          >
            MULA BERMAIN! <i className="fa-solid fa-rocket"></i>
          </button>
        </div>

        {/* Footer Minimalist (Bawah Screen Login Sahaja) */}
        <footer
          style={{
            width: "100%",
            marginTop: "auto",
            marginBottom: "15px",
            padding: "12px 20px",
            backgroundColor: "transparent",
            color: "#475569",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              fontSize: "0.78rem",
              fontWeight: "bold",
            }}
          >
            <div>© 2026 Bunyi Kata. Hak Cipta Terpelihara.</div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: "normal",
                color: "#64748b",
              }}
            >
              Aplikasi Pembelajaran Suku Kata &amp; Literasi Bahasa Melayu.
            </div>
          </div>
        </footer>
      </div>

      <div id="main-menu-screen" className="screen">
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
              if (typeof (window as any).bukaModalPilihPeta === "function") {
                (window as any).bukaModalPilihPeta("belajar");
              } else if (typeof bukaModalPilihPeta === "function") {
                bukaModalPilihPeta("belajar");
              }
            }}
          >
            <i className="fa-solid fa-book-open"></i> Belajar
          </button>
          <button
            className="neo-btn ticket-btn-red main-menu-btn-anim-2"
            onClick={(e) => {
              if (typeof (window as any).bukaModalPilihPeta === "function") {
                (window as any).bukaModalPilihPeta("latihan");
              } else if (typeof bukaModalPilihPeta === "function") {
                bukaModalPilihPeta("latihan");
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

      <div id="map-screen" className="screen">
        <div className="map-top-bar">
          <button
            id="map-back-btn"
            className="neo-btn back-icon-btn"
            onClick={(e) => {
              kembaliKePilihPeta();
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            id="map-title-bar"
            className="neo-btn page-title"
            style={{
              fontSize: "1.2rem",
              pointerEvents: "none",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Peta Kembara 1
          </div>
          <div></div>
        </div>
        <div className="map-board" id="map-board-area">
          {/*  Dijana oleh JS  */}
        </div>
        <div
          id="cara-belajar-lain-section"
          style={{
            display: "none",
            marginTop: "20px",
            padding: "20px",
            background: "#feedd6",
            borderRadius: "24px",
            border: "3px solid var(--color-dark)",
            boxShadow: "inset 4px 4px 0px rgba(0,0,0,0.03), 0 3px 0 var(--color-dark)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            textAlign: "center",
          }}
        >
          <h2 className="neo-btn bg-yellow cara-belajar-title">
            <i className="fa-solid fa-wand-magic-sparkles"></i> Cara Belajar
          </h2>
          <div className="cara-belajar-btn-container">
            <button
              className="neo-btn bg-purple cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-surih");
                if (modal) modal.style.display = "flex";
              }}
            >
              <i className="fa-solid fa-pen"></i>{" "}
              <span className="cara-belajar-btn-text-full">Surih</span>
              <span className="cara-belajar-btn-text-short">Surih</span>
            </button>
            <button
              className="neo-btn bg-blue cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                (window as any).bukaVR && (window as any).bukaVR();
              }}
            >
              <i className="fa-solid fa-cube"></i>{" "}
              <span className="cara-belajar-btn-text-full">3D Bunyi Kata</span>
              <span className="cara-belajar-btn-text-short">3D</span>
            </button>
            <button
              className="neo-btn bg-green cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-ar");
                if (modal) modal.style.display = "flex";
              }}
            >
              <i className="fa-solid fa-camera"></i>{" "}
              <span className="cara-belajar-btn-text-full">AR</span>
              <span className="cara-belajar-btn-text-short">AR</span>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-huruf"
              style={{ backgroundColor: "#ec4899", color: "white" }}
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-kad-imbasan-nombor");
                if (modal) modal.style.display = "flex";
              }}
            >
              <i className="fa-solid fa-clone"></i>{" "}
              <span className="cara-belajar-btn-text-full">Kad Imbasan</span>
              <span className="cara-belajar-btn-text-short">Kad Imbasan</span>
            </button>
            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <i className="fa-solid fa-gamepad"></i>{" "}
              <span className="cara-belajar-btn-text-full">Tanduk Kata</span>
              <span className="cara-belajar-btn-text-short">Tanduk</span>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata"
              style={{ backgroundColor: "#f59e0b", color: "white" }}
              onClick={(e) => {
                if (window.showPuzzleSukuKataModal) window.showPuzzleSukuKataModal();
                else if (window.bukaPuzzleSukuKata) window.bukaPuzzleSukuKata();
              }}
            >
              <i className="fa-solid fa-puzzle-piece"></i>{" "}
              <span className="cara-belajar-btn-text-full">Puzzle</span>
              <span className="cara-belajar-btn-text-short">Puzzle</span>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata cursor-pointer"
              style={{ backgroundColor: "#8b5cf6", color: "white" }}
              onClick={(e) => {
                if ((window as any).showCantumKataModal) (window as any).showCantumKataModal();
                else if ((window as any).bukaCantumKata) (window as any).bukaCantumKata();
              }}
            >
              <i className="fa-solid fa-puzzle-piece"></i>{" "}
              <span className="cara-belajar-btn-text-full">Cantum Kata</span>
              <span className="cara-belajar-btn-text-short">Cantum</span>
            </button>
            <button
              className="neo-btn bg-cyan cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                window.bukaPerpustakaan && window.bukaPerpustakaan();
              }}
              style={{ backgroundColor: "#06b6d4", color: "white" }}
            >
              <i className="fa-solid fa-book-open-reader"></i>{" "}
              <span className="cara-belajar-btn-text-full">
                Teroka Perpustakaan
              </span>
              <span className="cara-belajar-btn-text-short">Perpustakaan</span>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata cursor-pointer"
              onClick={(e) => {
                if ((window as any).showCubaSebutModal) (window as any).showCubaSebutModal();
                else { const m = document.getElementById("modal-pilih-cuba-sebut-sukukata"); if (m) m.style.display = "flex"; }
              }}
              style={{ backgroundColor: "#ff751f", color: "white" }}
            >
              <i className="fa-solid fa-microphone-lines"></i>{" "}
              <span className="cara-belajar-btn-text-full">Cuba Sebut</span>
              <span className="cara-belajar-btn-text-short">Sebut</span>
            </button>
            <button
              className="neo-btn bg-yellow cara-belajar-btn untuk-bacaan"
              onClick={(e) => {
                setShowBukuCeritaModal(true);
              }}
              style={{ backgroundColor: "#f59e0b", color: "white" }}
            >
              <i className="fa-solid fa-book-open"></i>{" "}
              <span className="cara-belajar-btn-text-full">Rak Buku</span>
              <span className="cara-belajar-btn-text-short">Rak Buku</span>
            </button>
            <button
              className="neo-btn bg-purple cara-belajar-btn untuk-bacaan"
              onClick={(e) => {
                (window as any).bukaVRBacaan && (window as any).bukaVRBacaan();
              }}
              style={{ backgroundColor: "#8b5cf6", color: "white" }}
            >
              <i className="fa-solid fa-cube"></i>{" "}
              <span className="cara-belajar-btn-text-full">3D Bacaan Bergred</span>
              <span className="cara-belajar-btn-text-short">3D</span>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-bacaan cursor-pointer"
              onClick={(e) => {
                if ((window as any).showCubaBacaModal) (window as any).showCubaBacaModal();
                else { const m = document.getElementById("modal-pilih-cuba-baca"); if (m) m.style.display = "flex"; }
              }}
              style={{ backgroundColor: "#10b981", color: "white" }}
            >
              <i className="fa-solid fa-book-open-reader"></i>{" "}
              <span className="cara-belajar-btn-text-full">Cuba Baca</span>
              <span className="cara-belajar-btn-text-short">Baca</span>
            </button>
          </div>
        </div>

        {/* Cabaran Lain Section (Untuk Mod Latihan) */}
        <div
          id="cabaran-lain-section"
          style={{
            display: "none",
            marginTop: "24px",
            padding: "24px 14px 28px 14px",
            backgroundColor: "#feedd6",
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            borderRadius: "24px",
            border: "3px solid var(--color-dark)",
            boxShadow: "inset 4px 4px 0px rgba(0, 0, 0, 0.03), 0 3px 0 var(--color-dark)",
            textAlign: "center",
            position: "relative",
            overflow: "visible"
          }}
        >
          {/* Badge Cabaran Tambahan (Dinamik) */}
          <div
            id="cabaran-tambahan-title-badge"
            className="neo-btn bg-purple cabaran-badge-title"
            style={{
              display: "none",
              fontSize: "1.15rem",
              fontWeight: "900",
              color: "white",
              padding: "6px 24px",
              borderRadius: "20px",
              border: "3px solid #1e293b",
              boxShadow: "0 4px 0 #1e293b",
              margin: "0 auto 12px auto",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              textTransform: "none",
              letterSpacing: "0.5px",
              zIndex: 5,
            }}
          >
            Cabaran Tambahan
          </div>

          {/* 3D Swiper Carousel */}
          <div id="cabaran-lain-stage" className="cabaran-lain-stage-container">
            <button
              className="cabaran-lain-nav-btn prev-btn"
              onClick={() => (window as any).cabaranLainPrev && (window as any).cabaranLainPrev()}
              aria-label="Sebelumnya"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div id="cabaran-lain-viewport" className="cabaran-lain-viewport">
              {/* Dijana secara dinamik oleh JS */}
            </div>

            <button
              className="cabaran-lain-nav-btn next-btn"
              onClick={() => (window as any).cabaranLainNext && (window as any).cabaranLainNext()}
              aria-label="Seterusnya"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Dots Indicator */}
          <div id="cabaran-lain-dots" className="cabaran-lain-dots-container">
            {/* Dijana secara dinamik oleh JS */}
          </div>
        </div>

        {/* Cabaran Tambahan Game View moved to createPortal below map-screen */}

        {/* Modal Pilih Surih */}
        <div id="modal-pilih-surih" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "480px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-surih");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "20px" }}>
              <i className="fa-solid fa-pen"></i> Pilih Mod Surih
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", width: "100%" }}>
              {/* Card Surih Huruf */}
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
                  background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
                  gap: "14px",
                  boxSizing: "border-box"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-surih");
                  if (modal) modal.style.display = "none";
                  (window as any).bukaSurihHuruf && (window as any).bukaSurihHuruf();
                }}
              >
                {/* Animated A, B, C Logo Tiles with Stars */}
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
                        fill="url(#sparkle-grad-surih-huruf-tl)"
                      />
                      <defs>
                        <linearGradient id="sparkle-grad-surih-huruf-tl" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        fill="url(#star-grad-surih-huruf-tr)"
                        stroke="#1e293b"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="star-grad-surih-huruf-tr" x1="0%" y1="0%" x2="100%" y2="100%">
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
                    A
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                    className="popup-tile-2"
                    style={{ width: "36px", height: "36px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    B
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                    className="popup-tile-3"
                    style={{ width: "36px", height: "36px", background: "#fb7185", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #e11d48, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    C
                  </motion.div>
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                  Surih Huruf
                </span>
              </div>

              {/* Card Surih Nombor */}
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
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  gap: "14px",
                  boxSizing: "border-box"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-surih");
                  if (modal) modal.style.display = "none";
                  (window as any).bukaSurihNombor && (window as any).bukaSurihNombor();
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
                        fill="url(#sparkle-grad-surih-nombor-tl)"
                      />
                      <defs>
                        <linearGradient id="sparkle-grad-surih-nombor-tl" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        fill="url(#star-grad-surih-nombor-tr)"
                        stroke="#1e293b"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="star-grad-surih-nombor-tr" x1="0%" y1="0%" x2="100%" y2="100%">
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
                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                  Surih Nombor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Pilih Kad Imbasan Nombor */}
        <div id="modal-pilih-kad-imbasan-nombor" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "480px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-kad-imbasan-nombor");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "20px" }}>
              <i className="fa-solid fa-clone"></i> Kad Imbasan Nombor
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", width: "100%" }}>
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
                  boxSizing: "border-box"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-kad-imbasan-nombor");
                  if (modal) modal.style.display = "none";
                  setKadImbasanNomborMode("bilang_0_10");
                  if ((window as any).paparSkrin) (window as any).paparSkrin("view-kad-imbasan-nombor");
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
                        fill="url(#sparkle-grad-popup-0-10-tl)"
                      />
                      <defs>
                        <linearGradient id="sparkle-grad-popup-0-10-tl" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        fill="url(#star-grad-popup-0-10-tr)"
                        stroke="#1e293b"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="star-grad-popup-0-10-tr" x1="0%" y1="0%" x2="100%" y2="100%">
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
                  boxSizing: "border-box"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-kad-imbasan-nombor");
                  if (modal) modal.style.display = "none";
                  setKadImbasanNomborMode("siri_nombor");
                  if ((window as any).paparSkrin) (window as any).paparSkrin("view-kad-imbasan-nombor");
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
                        fill="url(#sparkle-grad-popup-10-100-tl)"
                      />
                      <defs>
                        <linearGradient id="sparkle-grad-popup-10-100-tl" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        fill="url(#star-grad-popup-10-100-tr)"
                        stroke="#1e293b"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="star-grad-popup-10-100-tr" x1="0%" y1="0%" x2="100%" y2="100%">
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
              </div>
            </div>
          </div>
        </div>

        {/* Modal Pilih AR (Huruf / ABC & Nombor) */}
        <div id="modal-pilih-ar" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "520px", width: "92%", textAlign: "center", padding: "28px 18px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-ar");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "20px" }}>
              <i className="fa-solid fa-camera"></i> Pilih Mod AR
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px", width: "100%" }}>

              {/* Card 2: AR Nombor */}
              <div
                className="neo-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 8px 16px",
                  cursor: "pointer",
                  borderRadius: "22px",
                  border: "3.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                  transition: "all 0.15s ease",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  gap: "12px",
                  boxSizing: "border-box",
                  position: "relative"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-ar");
                  if (modal) modal.style.display = "none";
                  setArKiraJariMode('nombor');
                  if ((window as any).bukaARKiraJari) (window as any).bukaARKiraJari('nombor');
                }}
              >

                {/* Animated 1, 2, 3 Tiles with Sparkles */}
                <div style={{ position: "relative", display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "center", padding: "6px 8px" }}>
                  <motion.div
                    animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, 90, 180, 270, 360], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-12px", left: "-10px", width: "18px", height: "18px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="#fef08a" />
                    </svg>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 270, 180, 90, 0], opacity: [1, 0.65, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-11px", right: "-8px", width: "16px", height: "16px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z" fill="#fde047" stroke="#10182f" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [-3, 2, -3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    style={{ width: "36px", height: "36px", background: "#facc15", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #ca8a04, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    1
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                    style={{ width: "36px", height: "36px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    2
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                    style={{ width: "36px", height: "36px", background: "#fb7185", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #e11d48, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    3
                  </motion.div>
                </div>

                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                  AR Nombor
                </span>
              </div>

              {/* Card 3: AR Tambah */}
              <div
                className="neo-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 8px 16px",
                  cursor: "pointer",
                  borderRadius: "22px",
                  border: "3.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                  transition: "all 0.15s ease",
                  background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                  gap: "12px",
                  boxSizing: "border-box",
                  position: "relative"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-ar");
                  if (modal) modal.style.display = "none";
                  setArKiraJariMode('tambah');
                  if ((window as any).bukaARKiraJari) (window as any).bukaARKiraJari('tambah');
                }}
              >

                {/* Animated 1, +, 1 Tiles with Sparkles */}
                <div style={{ position: "relative", display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "center", padding: "6px 8px" }}>
                  <motion.div
                    animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, 90, 180, 270, 360], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-12px", left: "-10px", width: "18px", height: "18px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="#fef08a" />
                    </svg>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 270, 180, 90, 0], opacity: [1, 0.65, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-11px", right: "-8px", width: "16px", height: "16px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z" fill="#fda4af" stroke="#10182f" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [-3, 2, -3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    style={{ width: "36px", height: "36px", background: "#facc15", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #ca8a04, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    1
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                    style={{ width: "36px", height: "36px", background: "#10b981", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #059669, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 900, color: "#ffffff", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    +
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                    style={{ width: "36px", height: "36px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    1
                  </motion.div>
                </div>

                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                  AR Tambah
                </span>
              </div>

              {/* Card 4: AR Tolak */}
              <div
                className="neo-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 8px 16px",
                  cursor: "pointer",
                  borderRadius: "22px",
                  border: "3.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                  transition: "all 0.15s ease",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  gap: "12px",
                  boxSizing: "border-box",
                  position: "relative"
                }}
                onClick={() => {
                  const modal = document.getElementById("modal-pilih-ar");
                  if (modal) modal.style.display = "none";
                  setArKiraJariMode('tolak');
                  if ((window as any).bukaARKiraJari) (window as any).bukaARKiraJari('tolak');
                }}
              >

                {/* Animated 2, -, 1 Tiles with Sparkles */}
                <div style={{ position: "relative", display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "center", padding: "6px 8px" }}>
                  <motion.div
                    animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, 90, 180, 270, 360], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-12px", left: "-10px", width: "18px", height: "18px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="#fef08a" />
                    </svg>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 270, 180, 90, 0], opacity: [1, 0.65, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-11px", right: "-8px", width: "16px", height: "16px", pointerEvents: "none", zIndex: 2 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                      <path d="M12 1.5L14.9 8.2L22 9.1L16.8 13.9L18.3 21L12 17.4L5.7 21L7.2 13.9L2 9.1L9.1 8.2L12 1.5Z" fill="#93c5fd" stroke="#10182f" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [-3, 2, -3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    style={{ width: "36px", height: "36px", background: "#facc15", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #ca8a04, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    2
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [0, -2.5, 0, 2.5, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
                    style={{ width: "36px", height: "36px", background: "#f43f5e", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #be123c, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 900, color: "#ffffff", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    -
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -4, 0, 1.5, 0], rotate: [3, -2, 3] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.56 }}
                    style={{ width: "36px", height: "36px", background: "#38bdf8", borderRadius: "10px", border: "2.5px solid #10182f", boxShadow: "0 3px 0 #0284c7, 0 3px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#10182f", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif" }}
                  >
                    1
                  </motion.div>
                </div>

                <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "white", textShadow: "0 2px 0 rgba(0,0,0,0.35)", fontFamily: "AtlantaRoundedBlack, AtlantaRounded, sans-serif", textAlign: "center", whiteSpace: "nowrap" }}>
                  AR Tolak
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Pilih AR Suku Kata */}
        <div id="modal-pilih-ar-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "450px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-ar-sukukata");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "12px" }}>
              <i className="fa-solid fa-camera"></i> AR Suku Kata
            </h2>
            <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
              Pilih kemahiran suku kata untuk mula bermain:
            </p>
            <div id="ar-sukukata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
              {/* Populated dynamically via window.showARSukuKataModal() */}
            </div>
          </div>
        </div>

        {/* Modal Pilih Puzzle Suku Kata */}
        <div id="modal-pilih-puzzle-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "450px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn cursor-pointer"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-puzzle-sukukata");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "12px" }}>
              <i className="fa-solid fa-puzzle-piece"></i> Puzzle Suku Kata
            </h2>
            <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
              Pilih kemahiran suku kata untuk mula bermain:
            </p>
            <div id="puzzle-sukukata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
              {/* Populated dynamically via window.showPuzzleSukuKataModal() */}
            </div>
          </div>
        </div>

        {/* Modal Pilih Cantum Kata */}
        <div id="modal-pilih-cantum-kata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "450px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn cursor-pointer"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-cantum-kata");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "12px", background: "#8b5cf6", color: "white" }}>
              <i className="fa-solid fa-puzzle-piece"></i> Cantum Kata
            </h2>
            <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
              Pilih kemahiran suku kata untuk mula bermain:
            </p>
            <div id="cantum-kata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
              {/* Populated dynamically via window.showCantumKataModal() */}
            </div>
          </div>
        </div>

        {/* Modal Pilih Cuba Sebut (Suku Kata Asas & Hero) */}
        <div id="modal-pilih-cuba-sebut-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "460px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn cursor-pointer"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-cuba-sebut-sukukata");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "12px", background: "#ff751f", color: "white" }}>
              <i className="fa-solid fa-microphone-lines"></i> Cuba Sebut
            </h2>
            <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
              Pilih kemahiran suku kata untuk mula belajar:
            </p>
            <div id="cuba-sebut-sukukata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
              {/* Populated dynamically via window.showCubaSebutModal() */}
            </div>
          </div>
        </div>

        {/* Modal Pilih Cuba Baca (Bacaan Bergred) */}
        <div id="modal-pilih-cuba-baca" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="modal-content" style={{ maxWidth: "460px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
            <button
              className="neo-btn bg-red close-btn cursor-pointer"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-cuba-baca");
                if (modal) modal.style.display = "none";
              }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modal-title-orange-badge" style={{ marginBottom: "12px", background: "#10b981", color: "white" }}>
              <i className="fa-solid fa-book-open-reader"></i> Cuba Baca
            </h2>
            <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
              Pilih kategori bacaan untuk mula belajar:
            </p>
            <div id="cuba-baca-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
              {/* Populated dynamically via window.showCubaBacaModal() */}
            </div>
          </div>
        </div>
        {/* VR button now directly calls bukaVR() - no modal needed */}

        <div
          id="mobile-floating-dial-container"
          className={isDialOpen ? "open" : ""}
        >
          <div className="mobile-dial-options">
            <button
              className="neo-btn bg-purple cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                setIsDialOpen(false);
                const modal = document.getElementById("modal-pilih-surih");
                if (modal) modal.style.display = "flex";
              }}
            >
              <span className="cara-belajar-btn-text-short">Surih</span>
              <i className="fa-solid fa-pen"></i>
            </button>
            <button
              className="neo-btn bg-blue cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                setIsDialOpen(false);
                (window as any).bukaVR && (window as any).bukaVR();
              }}
            >
              <span className="cara-belajar-btn-text-short">3D</span>
              <i className="fa-solid fa-cube"></i>
            </button>
            <button
              className="neo-btn bg-green cara-belajar-btn untuk-huruf"
              onClick={(e) => {
                setIsDialOpen(false);
                const modal = document.getElementById("modal-pilih-ar");
                if (modal) modal.style.display = "flex";
              }}
            >
              <span className="cara-belajar-btn-text-short">AR</span>
              <i className="fa-solid fa-camera"></i>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-huruf"
              style={{ backgroundColor: "#ec4899", color: "white" }}
              onClick={(e) => {
                setIsDialOpen(false);
                const modal = document.getElementById("modal-pilih-kad-imbasan-nombor");
                if (modal) modal.style.display = "flex";
              }}
            >
              <span className="cara-belajar-btn-text-short">Kad Imbasan</span>
              <i className="fa-solid fa-clone"></i>
            </button>
            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                setIsDialOpen(false);
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <span className="cara-belajar-btn-text-short">Tanduk Kata</span>
              <i className="fa-solid fa-gamepad"></i>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata"
              style={{ backgroundColor: "#f59e0b", color: "white" }}
              onClick={(e) => {
                setIsDialOpen(false);
                if (window.showPuzzleSukuKataModal) window.showPuzzleSukuKataModal();
                else if (window.bukaPuzzleSukuKata) window.bukaPuzzleSukuKata();
              }}
            >
              <span className="cara-belajar-btn-text-short">Puzzle</span>
              <i className="fa-solid fa-puzzle-piece"></i>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata cursor-pointer"
              style={{ backgroundColor: "#8b5cf6", color: "white" }}
              onClick={(e) => {
                setIsDialOpen(false);
                if ((window as any).showCantumKataModal) (window as any).showCantumKataModal();
                else if ((window as any).bukaCantumKata) (window as any).bukaCantumKata();
              }}
            >
              <span className="cara-belajar-btn-text-short">Cantum Kata</span>
              <i className="fa-solid fa-puzzle-piece"></i>
            </button>
            <button
              className="neo-btn bg-cyan cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                setIsDialOpen(false);
                window.bukaPerpustakaan && window.bukaPerpustakaan();
              }}
              style={{ backgroundColor: "#06b6d4", color: "white" }}
            >
              <span className="cara-belajar-btn-text-short">Perpustakaan</span>
              <i className="fa-solid fa-book-open-reader"></i>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-sukukata cursor-pointer"
              style={{ backgroundColor: "#ff751f", color: "white" }}
              onClick={(e) => {
                setIsDialOpen(false);
                if ((window as any).showCubaSebutModal) (window as any).showCubaSebutModal();
                else { const m = document.getElementById("modal-pilih-cuba-sebut-sukukata"); if (m) m.style.display = "flex"; }
              }}
            >
              <span className="cara-belajar-btn-text-short">Cuba Sebut</span>
              <i className="fa-solid fa-microphone-lines"></i>
            </button>
            <button
              className="neo-btn bg-yellow cara-belajar-btn untuk-bacaan"
              onClick={(e) => {
                setIsDialOpen(false);
                setShowBukuCeritaModal(true);
              }}
              style={{ backgroundColor: "#f59e0b", color: "white" }}
            >
              <span className="cara-belajar-btn-text-short">Rak Buku</span>
              <i className="fa-solid fa-book-open"></i>
            </button>
            <button
              className="neo-btn bg-purple cara-belajar-btn untuk-bacaan"
              onClick={(e) => {
                setIsDialOpen(false);
                (window as any).bukaVRBacaan && (window as any).bukaVRBacaan();
              }}
              style={{ backgroundColor: "#8b5cf6", color: "white" }}
            >
              <span className="cara-belajar-btn-text-short">3D</span>
              <i className="fa-solid fa-cube"></i>
            </button>
            <button
              className="neo-btn cara-belajar-btn untuk-bacaan cursor-pointer"
              style={{ backgroundColor: "#10b981", color: "white" }}
              onClick={(e) => {
                setIsDialOpen(false);
                if ((window as any).showCubaBacaModal) (window as any).showCubaBacaModal();
                else { const m = document.getElementById("modal-pilih-cuba-baca"); if (m) m.style.display = "flex"; }
              }}
            >
              <span className="cara-belajar-btn-text-short">Cuba Baca</span>
              <i className="fa-solid fa-book-open-reader"></i>
            </button>
          </div>

          <button
            id="mobile-floating-cta"
            className="neo-btn bg-yellow"
            onClick={(e) => {
              setIsDialOpen(!isDialOpen);
            }}
            aria-label="Cara Belajar"
          >
            <i
              className={`fa-solid ${isDialOpen ? "fa-xmark" : "fa-wand-magic-sparkles"}`}
            ></i>
          </button>
        </div>
      </div>

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

      <div id="leaderboard-screen" className="screen">
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
              maxWidth: "400px",
              gap: "8px",
              marginBottom: "5px",
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
      <div id="profile-screen" className="screen">
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
              {localStorage.getItem('bunyiKataNamaKelas') ? (
                <div
                  style={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    opacity: "0.9",
                  }}
                >
                  {localStorage.getItem('bunyiKataNamaKelas')}
                </div>
              ) : null}
              {localStorage.getItem('pdf_sekolah') ? (
                <div
                  style={{
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    opacity: "0.9",
                  }}
                >
                  {localStorage.getItem('pdf_sekolah')}
                </div>
              ) : null}
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
                <option value="5">Cabaran Lain</option>
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

      <div id="lencana-screen" className="screen">
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
          <Lencana3DSwiper />

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
                  alert(msg);
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
              marginTop: "16px",
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
      <div id="admin-senarai-perkataan" className="screen">
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
      <div
        id="admin-dashboard"
        className="screen"
      >
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            backgroundColor: "#168f81",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "100% 100%, 15px 15px",
            position: "relative",
            borderRadius: "20px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "15px",
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
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div className="ibubapa-card-avatar-box">
                  <div
                    id="admin-dashboard-avatar-sekolah"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      zIndex: 1,
                      backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`,
                    }}
                  ></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random().toString(36).substring(7)}&backgroundColor=ffffff`;
                    localStorage.setItem("bunyiKataSekolahAvatar", newAvatar);
                    const el = document.getElementById("admin-dashboard-avatar-sekolah");
                    if (el) el.style.backgroundImage = `url('${newAvatar}')`;
                    const guruEl = document.getElementById("guru-dashboard-avatar-sekolah");
                    if (guruEl) guruEl.style.backgroundImage = `url('${newAvatar}')`;
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  }}
                  title="Ubah Avatar Sekolah"
                  aria-label="Ubah Avatar Sekolah"
                  className="neo-btn"
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    right: "-6px",
                    width: "24px",
                    height: "24px",
                    minWidth: "auto",
                    minHeight: "auto",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: "2px solid var(--color-dark)",
                    boxShadow: "0 2px 0 var(--color-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    fontSize: "0.7rem",
                    color: "#1e293b",
                    padding: 0,
                  }}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255,255,255,0.25)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                  }}
                >
                  Statistik Sistem
                </span>
                <h2
                  id="admin-dashboard-nama-kelas-title"
                  style={{
                    fontSize: "1.3rem",
                    margin: "2px 0",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Bunyi Kata App
                </h2>
                <div
                  style={{
                    fontSize: "0.9rem",
                    opacity: "0.95",
                    fontWeight: "500",
                  }}
                >
                  Admin: <span id="admin-dashboard-nama-guru-title">IR EduInnovations</span>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                zIndex: "100",
              }}
            >
              <button
                onClick={() => {
                  if ((window as any).playBubble) (window as any).playBubble();
                  if (typeof (window as any).bukaSetupModal === "function") {
                    (window as any).bukaSetupModal("admin", false);
                  }
                }}
                className="neo-btn"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  border: "2px solid var(--color-dark)",
                  borderRadius: "50%",
                  padding: "0",
                  width: "34px",
                  height: "34px",
                  minWidth: "auto",
                  minHeight: "auto",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 0 var(--color-dark)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
                title="Edit Maklumat Admin"
                aria-label="Edit Maklumat Admin"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
              <button
                onClick={() => {
                  if ((window as any).playBubble) (window as any).playBubble();
                  (window as any).bukaModalAppInfo && (window as any).bukaModalAppInfo();
                }}
                className="neo-btn"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  border: "2px solid var(--color-dark)",
                  borderRadius: "50%",
                  padding: "0",
                  width: "34px",
                  height: "34px",
                  minWidth: "auto",
                  minHeight: "auto",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 0 var(--color-dark)",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
                title="Maklumat Aplikasi"
                aria-label="Maklumat Aplikasi"
              >
                <i className="fa-solid fa-circle-info"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Kad Ringkasan Bil Murid, Guru, Ibu Bapa, Anak (Mod Admin) */}
        <div
          className="ibubapa-stats-grid"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "14px",
          }}
        >
          {/* Card 1: Bilangan Murid (Purple/Violet) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(109, 40, 217, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <i
              className="fa-solid fa-graduation-cap"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Bilangan Murid
              </div>
              <div
                id="admin-jumlah-murid"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 2: Bilangan Guru (Pink/Rose) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(219, 39, 119, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <i
              className="fa-solid fa-chalkboard-user"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Bilangan Guru
              </div>
              <div
                id="admin-jumlah-guru"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 3: Bilangan Ibu Bapa (Sky/Blue) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(2, 132, 199, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-user-group"></i>
            </div>
            <i
              className="fa-solid fa-user-group"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Bilangan Ibu Bapa
              </div>
              <div
                id="admin-jumlah-ibubapa"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 4: Bilangan Anak (Emerald/Green) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(5, 150, 105, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-children"></i>
            </div>
            <i
              className="fa-solid fa-children"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Bilangan Anak
              </div>
              <div
                id="admin-jumlah-anak"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 5: Maklum Balas (Warm Amber/Gold) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(217, 119, 6, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
            }}
            onClick={() => {
              const sel = document.getElementById("admin-table-selector") as HTMLSelectElement;
              if (sel) {
                sel.value = "feedback";
                (window as any).renderAdminTable && (window as any).renderAdminTable("feedback");
              }
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-comments"></i>
            </div>
            <i
              className="fa-solid fa-comments"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Maklum Balas
              </div>
              <div
                id="admin-jumlah-feedback"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>
        </div>

        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            background: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
          }}
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
            <div
              id="admin-table-title"
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Senarai Guru Berdaftar
              </span>
            </div>
            <select
              id="admin-table-selector"
              className="neo-btn filter-select"
              style={{
                padding: "6px 32px 6px 10px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "2px solid var(--color-dark)",
                backgroundColor: "#f1f5f9",
                cursor: "pointer",
              }}
              onChange={(e) => {
                (window as any).renderAdminTable &&
                  (window as any).renderAdminTable(e.target.value);
              }}
            >
              <option value="guru">Senarai Guru Berdaftar</option>
              <option value="ibubapa">Senarai Ibu Bapa Berdaftar</option>
              <option value="feedback">Senarai Maklum Balas</option>
            </select>
          </div>
          <div
            style={{
              overflowX: "auto",
              borderRadius: "12px",
              border: "2px solid var(--color-dark)",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "580px",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead id="admin-table-head">
                <tr style={{ background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", color: "white" }}>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      width: "48px",
                      minWidth: "48px",
                      textTransform: "uppercase",
                    }}
                  >
                    BIL.
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      minWidth: "140px",
                      textTransform: "uppercase",
                    }}
                  >
                    NAMA GURU
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      minWidth: "130px",
                      textTransform: "uppercase",
                    }}
                  >
                    NAMA SEKOLAH
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      minWidth: "110px",
                      textTransform: "uppercase",
                    }}
                  >
                    BILANGAN MURID
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      minWidth: "135px",
                      textTransform: "uppercase",
                    }}
                  >
                    JENIS LANGGANAN
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      minWidth: "150px",
                      textTransform: "uppercase",
                    }}
                  >
                    TEMPOH MASA
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      background: "transparent",
                      color: "white",
                      borderBottom: "2px solid #9a3412",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      width: "60px",
                      minWidth: "50px",
                      textTransform: "uppercase",
                    }}
                  >
                    INFO
                  </th>
                </tr>
              </thead>
              <tbody id="admin-table-body">{/* Rendered by JS */}</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mod Admin - Pengurusan Sistem Admin */}
      <div id="admin-urus" className="screen">
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            className="neo-btn century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              backgroundColor: "#168f81",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
              textTransform: "none",
            }}
          >
            <i className="fa-solid fa-list-check" style={{ marginRight: "8px" }}></i>
            Pengurusan Sistem
          </div>
        </div>

        {/* Tab Switcher: Hanya Guru & Sekolah dan Ibu Bapa sahaja */}
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto 18px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            boxSizing: "border-box",
            padding: "0 4px",
          }}
        >
          <button
            id="admin-urus-tab-btn-guru"
            type="button"
            className="neo-btn admin-tab-switcher-btn"
            style={{
              backgroundColor: "#ea580c",
              color: "white",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("guru");
              }
            }}
          >
            <i className="fa-solid fa-chalkboard-user" style={{ color: "#ffffff" }}></i>
            <span>Guru & Sekolah</span>
          </button>

          <button
            id="admin-urus-tab-btn-ibubapa"
            type="button"
            className="neo-btn bg-white admin-tab-switcher-btn"
            style={{
              color: "#1e293b",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("ibubapa");
              }
            }}
          >
            <i className="fa-solid fa-users" style={{ color: "#0284c7" }}></i>
            <span>Ibu Bapa</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div
          id="admin-urus-tab-content"
          style={{
            width: "100%",
            maxWidth: "1150px",
            minWidth: 0,
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Populated by JS renderAdminUrus */}
        </div>
      </div>

      {/* Mod Admin - Urus Sijil Bunyi Kata */}
      <div id="admin-sijil" className="screen" style={{ paddingBottom: "100px" }}>
        <AdminSijilManager />
      </div>

      {/*  Mod Guru (Dashboard Live Tracking)  */}
      <div
        id="guru-dashboard"
        className="screen"
      >
        {/* Guru Stats Banner */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            backgroundColor: "var(--color-orange)",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "100% 100%, 15px 15px",
            position: "relative",
            borderRadius: "20px",
            color: "white",
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
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="ibubapa-card-avatar-box">
                <div
                  id="guru-dashboard-avatar-sekolah"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    zIndex: 1,
                    backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`,
                  }}
                ></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random().toString(36).substring(7)}&backgroundColor=ffffff`;
                  localStorage.setItem("bunyiKataSekolahAvatar", newAvatar);
                  const el = document.getElementById("guru-dashboard-avatar-sekolah");
                  if (el) el.style.backgroundImage = `url('${newAvatar}')`;
                  const adminEl = document.getElementById("admin-dashboard-avatar-sekolah");
                  if (adminEl) adminEl.style.backgroundImage = `url('${newAvatar}')`;
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                }}
                title="Ubah Avatar Sekolah"
                aria-label="Ubah Avatar Sekolah"
                className="neo-btn"
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  right: "-6px",
                  width: "24px",
                  height: "24px",
                  minWidth: "auto",
                  minHeight: "auto",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "2px solid var(--color-dark)",
                  boxShadow: "0 2px 0 var(--color-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  fontSize: "0.7rem",
                  color: "#1e293b",
                  padding: 0,
                }}
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255,255,255,0.25)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                  }}
                >
                  Statistik Kelas Saya
                </span>
                {/* Lencana Baki Langganan (Responsif) */}
                {(() => {
                  const badge = getSubscriptionBadgeInfo("guru");
                  return (
                    <span
                      onClick={() => setIsProPricingModalOpen(true)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.74rem",
                        fontWeight: "bold",
                        backgroundColor: badge.bg,
                        border: `1.5px solid ${badge.border}`,
                        color: "#ffffff",
                        padding: "2px 9px",
                        borderRadius: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
                      }}
                      title="Klik untuk lihat maklumat status langganan"
                    >
                      <i className={badge.icon} style={{ fontSize: "0.75rem", color: badge.color }}></i>
                      <span>{badge.text}</span>
                    </span>
                  );
                })()}
              </div>
              <h2
                id="guru-dashboard-nama-kelas-title"
                style={{
                  fontSize: "1.3rem",
                  margin: "2px 0",
                  color: "white",
                  fontWeight: "bold",
                  paddingRight: "35px",
                }}
              >
                {localStorage.getItem("bunyiKataNamaKelas") || "(Belum Tetap Kelas)"}
              </h2>
              <div
                className="guru-stat-badges-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "6px",
                }}
              >
                <div
                  className="stat-badge"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    display: "inline-block",
                  }}
                >
                  Sekolah: <span id="guru-dashboard-nama-sekolah-title">{localStorage.getItem("bunyiKataNamaSekolah") || "SK TAMAN MELAWIS"}</span>
                </div>
                <div
                  className="stat-badge"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    display: "inline-block",
                  }}
                >
                  Guru: <span id="guru-dashboard-nama-guru-title">{localStorage.getItem("pdf_guru") || "-"}</span>
                </div>
                {isEffectiveTrial ? (
                  /* LOCKED: Akaun Percuma */
                  <div
                    className="stat-badge"
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      background: "rgba(185,28,28,0.4)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsProPricingModalOpen(true)}
                    title="Langgan PRO untuk aktifkan Kod Kelas"
                  >
                    🔒 Kod Kelas: <span style={{ letterSpacing: "1px" }}>TERKUNCI (PRO)</span>
                  </div>
                ) : (
                  /* UNLOCKED: Akaun PRO — papar + butang salin */
                  <div
                    className="stat-badge"
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      background: "rgba(255,255,255,0.2)",
                      padding: "4px 6px 4px 10px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>
                      Kod Kelas: <span id="guru-dashboard-kod-kelas-title">{localStorage.getItem("bunyiKataKodKelas") || "-"}</span>
                    </span>
                    <button
                      type="button"
                      title="Salin Kod Kelas"
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        border: "1.5px solid rgba(255,255,255,0.6)",
                        borderRadius: "10px",
                        color: "white",
                        padding: "2px 7px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                      onClick={() => {
                        const kod = document.getElementById("guru-dashboard-kod-kelas-title")?.textContent ||
                          localStorage.getItem("bunyiKataKodKelas") || "";
                        if (kod && kod !== "-") {
                          navigator.clipboard.writeText(kod).then(() => {
                            if (typeof (window as any).showAppToast === "function") {
                              (window as any).showAppToast("Kod disalin!", "success");
                            }
                          });
                        }
                      }}
                    >
                      <i className="fa-solid fa-copy" style={{ fontSize: "0.7rem" }}></i> Salin
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: "100",
            }}
          >
            <button
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                (window as any).bukaModalAppInfo && (window as any).bukaModalAppInfo();
              }}
              className="neo-btn"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid var(--color-dark)",
                borderRadius: "50%",
                padding: "0",
                width: "32px",
                height: "32px",
                minWidth: "auto",
                minHeight: "auto",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--color-dark)",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
              title="Maklumat Aplikasi"
            >
              <i className="fa-solid fa-circle-info"></i>
            </button>
            <button
              onClick={(e) => {
                setEditModalError("");
                setIsMandatorySetup(false);
                (window as any).modIbuBapaAktif = false;
                (window as any).modGuruAktif = true;

                const guruId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id;
                const guruEmail = localStorage.getItem("bunyiKataGuruEmail");

                const currentLvl = (localStorage.getItem("bunyiKataAccessLevel") as "trial" | "pro") || userAccessLevel;
                const rawPlan = localStorage.getItem("bunyiKataTeacherPlan") || "";
                const isPaidPro = currentLvl === "pro" && rawPlan.toLowerCase() !== "percuma";
                setTeacherCanHaveClass2(isPaidPro);
                setTeacherPlanName(isPaidPro ? (rawPlan || "Bulanan Pro") : "Percuma");

                const sanitizeDummyClass = (v: string) => {
                  const s = (v || "").trim();
                  if (!s || ["1 cemerlang", "1 pintar"].includes(s.toLowerCase())) return "";
                  return s.toUpperCase();
                };

                const sanitizeDummyCode = (v: string) => {
                  const s = (v || "").trim();
                  if (!s || ["kelas#99", "kelas#01", "kelas123"].includes(s.toLowerCase())) return "";
                  return s.toUpperCase();
                };

                if (isPaidPro && (guruId || guruEmail)) {
                  syncTeacherClasses(guruId || guruEmail).then((classes) => {
                    if (classes && classes.length > 0) {
                      setEditKodTemp(sanitizeDummyCode(classes[0].kod_kelas || ""));
                      setEditKelasTemp(sanitizeDummyClass(classes[0].nama_kelas || ""));
                      setEditSekolahTemp((classes[0].nama_sekolah || "").toUpperCase());
                      if (classes[0].nama_guru) setEditGuruTemp(classes[0].nama_guru.toUpperCase());
                      if (classes[1]) {
                        setEditKod2Temp(sanitizeDummyCode(classes[1].kod_kelas || ""));
                        setEditKelas2Temp(sanitizeDummyClass(classes[1].nama_kelas || ""));
                      }
                    }
                  }).catch(console.warn);
                }

                setEditSekolahTemp(
                  (localStorage.getItem("bunyiKataNamaSekolah") || "").toUpperCase(),
                );
                if ((window as any).playBubble) (window as any).playBubble();
                setEditModalMode("guru");
                (window as any).modAdminAktif = false;
                (window as any).modIbuBapaAktif = false;
                (window as any).modGuruAktif = true;
                setEditAvatarTemp(
                  localStorage.getItem("bunyiKataSekolahAvatar") ||
                  "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff",
                );
                setEditKelasTemp(sanitizeDummyClass(localStorage.getItem("bunyiKataNamaKelas") || ""));
                setEditGuruTemp((localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "").toUpperCase());
                setEditKodTemp(sanitizeDummyCode(localStorage.getItem("bunyiKataKodKelas") || ""));
                setEditKod2Temp(sanitizeDummyCode(localStorage.getItem("bunyiKataKodKelas2") || ""));
                setEditKelas2Temp(sanitizeDummyClass(localStorage.getItem("bunyiKataNamaKelas2") || ""));
                setIsChangingCode1(false);
                setIsChangingCode2(false);
                setIsChangingClassName1(false);
                setIsChangingClassName2(false);
                setIsEditModalOpen(true);
              }}
              className="neo-btn"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid var(--color-dark)",
                borderRadius: "50%",
                padding: "0",
                width: "32px",
                height: "32px",
                minWidth: "auto",
                minHeight: "auto",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--color-dark)",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
              title="Edit Maklumat Kelas"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        {/* Kad Ringkasan Bil Murid & Aktiviti (Mod Guru) */}
        <div
          className="guru-stats-grid ibubapa-stats-grid"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {/* Card 1: Bilangan Murid (Orange/Amber) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(234, 88, 12, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-users"></i>
            </div>
            <i
              className="fa-solid fa-users"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Bilangan Murid
              </div>
              <div
                id="guru-jumlah-murid"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 2: Aktiviti Selesai (Emerald/Teal) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(5, 150, 105, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <i
              className="fa-solid fa-circle-check"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Aktiviti Selesai
              </div>
              <div
                id="guru-aktiviti-selesai"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>
        </div>

        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            background: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div
            className="guru-prestasi-header-bar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              id="guru-table-title"
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Prestasi Murid &amp; Laporan
              </span>
            </div>
            <div className="guru-filter-container guru-prestasi-filter-container">
              {/* Filter Kelas: TIADA SEMUA KELAS */}
              <select
                id="guru-dashboard-kelas-select"
                className="neo-btn filter-select guru-filter-kelas"
                style={{
                  padding: "6px 28px 6px 10px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  fontFamily:
                    "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark)",
                  cursor: "pointer",
                  margin: "0",
                  backgroundColor: "#f1f5f9",
                  color: "var(--color-dark)",
                  boxSizing: "border-box",
                }}
                onChange={(e) => {
                  if (typeof (window as any).tukarKelasAktif === "function") {
                    (window as any).tukarKelasAktif(e.target.value);
                  }
                }}
                title="Pilih Kelas"
              >
                {/* Dijana dinamik tanpa pilihan 'Semua Kelas' */}
              </select>

              <div className="guru-filter-secondary-group">
                <select
                  id="guru-dashboard-tahap-select"
                  className="neo-btn filter-select"
                  style={{
                    padding: "6px 28px 6px 10px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    fontFamily:
                      "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark)",
                    cursor: "pointer",
                    margin: "0",
                    backgroundColor: "#f1f5f9",
                    color: "var(--color-dark)",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => {
                    (window as any).tahapFilter = e.target.value;
                    (window as any).renderTeacherTable &&
                      (window as any).renderTeacherTable();
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
                    Semua Tahap
                  </option>
                  <option
                    value="cemerlang"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Cemerlang (Lencana &gt; 5)
                  </option>
                  <option
                    value="sederhana"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Sederhana (Lencana 2-5)
                  </option>
                  <option
                    value="lemah"
                    style={{
                      color: "var(--color-dark)",
                      background: "white",
                      fontFamily:
                        "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    }}
                  >
                    Perlu Bimbingan (Lencana &lt; 2)
                  </option>
                </select>
                <select
                  id="guru-dashboard-peta-select"
                  className="neo-btn filter-select"
                  style={{
                    padding: "6px 28px 6px 10px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    fontFamily:
                      "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark)",
                    cursor: "pointer",
                    margin: "0",
                    backgroundColor: "#f1f5f9",
                    color: "var(--color-dark)",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => {
                    (window as any).petaFilter = e.target.value;
                    (window as any).renderTeacherTable &&
                      (window as any).renderTeacherTable();
                  }}
                >
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
            </div>
          </div>

          {/* Ayat notis dikemaskini dipindah ke atas jadual prestasi murid */}
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              color: "var(--color-dark)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i className="fa-solid fa-circle-info" style={{ color: "#168f81" }}></i>
            <span>Jadual ini dikemas kini secara automatik apabila murid menyelesaikan aktiviti dalam aplikasi.</span>
          </p>

          <div
            className="table-responsive"
            style={{
              overflowX: "auto",
              borderRadius: "12px",
              border: "2px solid var(--color-dark)",
            }}
          >
            <table className="teacher-table" id="guru-teacher-table">
              <thead id="guru-table-head">
                {/* Data header dijana secara dinamik mengikut Peta Cabaran */}
              </thead>
              <tbody id="guru-table-body">
                {/* Data akan dijana oleh Javascript (renderTeacherTable) */}
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="guru-floating-dial-container"
          className={isReportDialOpen ? "open" : ""}
        >
          <div className="mobile-dial-options">
            <button
              className="neo-btn bg-yellow cara-belajar-btn"
              onClick={() => {
                setIsReportDialOpen(false);
                if (isEffectiveTrial) {
                  // Akaun percuma — tunjuk modal naik taraf PRO
                  setIsProPricingModalOpen(true);
                } else {
                  setShowGuruSijilModal(true);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "900",
                fontSize: "0.85rem",
                backgroundColor: isEffectiveTrial ? "#94a3b8" : "#f59e0b",
                color: "#ffffff",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                border: "2.5px solid var(--color-dark)",
                whiteSpace: "nowrap",
                minWidth: "160px",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
            >
              <span>{isEffectiveTrial ? "🔒 Sijil (PRO)" : "Sijil Pencapaian"}</span>
              <i className={isEffectiveTrial ? "fa-solid fa-lock" : "fa-solid fa-award"}></i>
            </button>

            <button
              className="neo-btn bg-red cara-belajar-btn"
              onClick={() => {
                setIsReportDialOpen(false);
                (window as any).bukaModalExport ? (window as any).bukaModalExport() : setShowExportModal(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "900",
                fontSize: "0.85rem",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                border: "2.5px solid var(--color-dark)",
                whiteSpace: "nowrap",
                minWidth: "160px",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
            >
              <span>Eksport Laporan</span>
              <i className="fa-solid fa-file-export"></i>
            </button>
          </div>

          <button
            id="guru-floating-cta"
            className="neo-btn bg-yellow"
            onClick={() => {
              setIsReportDialOpen((prev) => !prev);
            }}
            aria-label="Tindakan Guru"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              fontSize: "1.45rem",
              backgroundColor: "#facc15",
              color: "var(--color-dark)",
              border: "3px solid var(--color-dark)",
              boxShadow: "2px 4px 0 var(--color-dark)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <i className={`fa-solid ${isReportDialOpen ? 'fa-xmark' : 'fa-layer-group'}`}></i>
          </button>
        </div>
      </div>

      {/* Mod Guru - Pengurusan Murid & Kelas */}
      <div id="guru-urus-murid" className="screen">
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="neo-btn bg-orange century-gothic-font"
            style={{
              color: "white",
              backgroundColor: "var(--color-orange, #ea580c)",
              pointerEvents: "none",
              fontSize: "clamp(0.9rem, 3.8vw, 1.2rem)",
              textAlign: "center",
              padding: "8px 20px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "92vw",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
            Pengurusan Murid &amp; Kelas
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Kad 1: Pengurusan Kod & Nama Kelas (Selaras dengan Pop-up Maklumat Guru) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
              backgroundSize: "16px 16px",
              padding: "16px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                className="neo-btn bg-orange"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "12px",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  pointerEvents: "none",
                }}
              >
                <i className="fa-solid fa-chalkboard-user" style={{ fontSize: "0.9rem" }}></i>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  }}
                >
                  Pengurusan Kod Kelas
                </span>
              </div>

              <span
                style={{
                  background: isEffectivePro ? "#dcfce7" : "#fee2e2",
                  color: isEffectivePro ? "#15803d" : "#b91c1c",
                  border: isEffectivePro ? "1.5px solid #22c55e" : "1.5px solid #ef4444",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  fontWeight: "bold",
                  display: "inline-flex",
                  alignItems: "center",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
                }}
              >
                {isEffectiveTrial ? "Percuma" : "Pro"}
              </span>
            </div>

            {isEffectiveTrial ? (
              /* LOCKED STATE: Pelan Percuma */
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                      <span>Kelas Pertama Terkunci (Versi Pro)</span>
                    </div>
                    <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                      Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="neo-btn"
                    style={{
                      backgroundColor: "#ea580c",
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "0.85rem",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      if (typeof (window as any).openPakejProModal === "function") {
                        (window as any).openPakejProModal("guru");
                      } else {
                        setIsProPricingModalOpen(true);
                      }
                    }}
                  >
                    <i className="fa-solid fa-crown"></i> Pro
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                      <span>Kelas Kedua Terkunci (Versi Pro)</span>
                    </div>
                    <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                      Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="neo-btn"
                    style={{
                      backgroundColor: "#ea580c",
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "0.85rem",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      if (typeof (window as any).openPakejProModal === "function") {
                        (window as any).openPakejProModal("guru");
                      } else {
                        setIsProPricingModalOpen(true);
                      }
                    }}
                  >
                    <i className="fa-solid fa-crown"></i> Pro
                  </button>
                </div>
              </div>
            ) : (
              /* UNLOCKED STATE: KELAS 1 & KELAS 2 */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Kad Kelas 1 */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px solid var(--color-dark)",
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: "0 3px 0 var(--color-dark)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "900", color: "#c2410c", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fa-solid fa-1" style={{ background: "#ea580c", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                      Kelas Pertama
                    </span>
                  </div>

                  {/* Nama Kelas 1 */}
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Nama Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    {!isChangingClassName1 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "2px solid #cbd5e1",
                            backgroundColor: "#f8fafc",
                            color: editKelasTemp ? "#0f172a" : "#94a3b8",
                            fontSize: "0.95rem",
                            fontWeight: "900",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa-solid fa-chalkboard-user" style={{ color: "#ea580c", fontSize: "0.9rem" }}></i>
                          <span>{editKelasTemp || "Nama Belum Ditetapkan"}</span>
                        </div>
                        <button
                          type="button"
                          className="neo-btn"
                          style={{
                            width: "38px",
                            height: "38px",
                            padding: 0,
                            minWidth: "38px",
                            backgroundColor: "#ea580c",
                            color: "#ffffff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => {
                            setIsChangingClassName1(true);
                            setNewClassName1Input(editKelasTemp || "");
                          }}
                          title={editKelasTemp ? "Tukar Nama Kelas 1" : "Tetapkan Nama Kelas 1"}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#fff7ed",
                          border: "2px solid #ea580c",
                          borderRadius: "10px",
                          padding: "10px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="CTH: 1 CEMERLANG"
                            value={newClassName1Input}
                            onChange={(e) => setNewClassName1Input(e.target.value.toUpperCase())}
                            style={{
                              flex: 1,
                              padding: "8px 10px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "0.95rem",
                              fontWeight: "900",
                              fontFamily: "inherit",
                              textTransform: "uppercase",
                            }}
                          />
                          <button
                            type="button"
                            className="neo-btn bg-red"
                            style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => setIsChangingClassName1(false)}
                            title="Batal"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => handleSaveClassName1(newClassName1Input)}
                            title="Sahkan Nama Kelas 1"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Kod Kelas 1 */}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Kod Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    {!isChangingCode1 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "2px solid #cbd5e1",
                            backgroundColor: "#f8fafc",
                            color: editKodTemp ? "#0f172a" : "#94a3b8",
                            fontSize: "1rem",
                            letterSpacing: "2px",
                            fontWeight: "900",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa-solid fa-key" style={{ color: "#ea580c", fontSize: "0.85rem" }}></i>
                          <span>{editKodTemp || "Kod Belum Ditetapkan"}</span>
                        </div>
                        {editKodTemp && (
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              width: "38px",
                              height: "38px",
                              padding: 0,
                              minWidth: "38px",
                              fontSize: "0.88rem",
                              backgroundColor: "#f1f5f9",
                              color: "#334155",
                              border: "2px solid #cbd5e1",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(editKodTemp);
                              if ((window as any).showAppToast) {
                                (window as any).showAppToast("Kod Disalin", "Kod Kelas 1 telah disalin!");
                              } else {
                                alert("Kod Kelas 1 telah disalin!");
                              }
                            }}
                            title="Salin Kod"
                          >
                            <i className="fa-solid fa-copy"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="neo-btn"
                          style={{
                            width: "38px",
                            height: "38px",
                            padding: 0,
                            minWidth: "38px",
                            backgroundColor: "#ea580c",
                            color: "#ffffff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => {
                            setIsChangingCode1(true);
                            setNewCode1Input(editKodTemp || "");
                          }}
                          title={editKodTemp ? "Tukar Kod Kelas 1" : "Tetapkan Kod Kelas 1"}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#fff7ed",
                          border: "2px solid #ea580c",
                          borderRadius: "10px",
                          padding: "10px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            maxLength={8}
                            placeholder="CTH: KELAS#01"
                            value={newCode1Input}
                            onChange={(e) => setNewCode1Input(e.target.value.toUpperCase())}
                            style={{
                              flex: 1,
                              padding: "8px 10px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "1rem",
                              fontWeight: "900",
                              letterSpacing: "1.5px",
                              fontFamily: "inherit",
                              textTransform: "uppercase",
                            }}
                          />
                          <button
                            type="button"
                            className="neo-btn bg-red"
                            style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => setIsChangingCode1(false)}
                            title="Batal"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => handleSaveClassCode1(newCode1Input)}
                            title="Gunakan Kod Ini"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#ea580c", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                          * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kad Kelas 2 */}
                {teacherCanHaveClass2 && (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #0284c7",
                      borderRadius: "12px",
                      padding: "14px",
                      boxShadow: "0 3px 0 var(--color-dark)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "900", color: "#0369a1", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <i className="fa-solid fa-2" style={{ background: "#0284c7", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                        Kelas Kedua
                      </span>
                    </div>

                    {/* Nama Kelas 2 */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                        Nama Kelas 2:
                      </label>
                      {!isChangingClassName2 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f8fafc",
                              color: editKelas2Temp ? "#0f172a" : "#94a3b8",
                              fontSize: "0.95rem",
                              fontWeight: "900",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <i className="fa-solid fa-chalkboard-user" style={{ color: "#0284c7", fontSize: "0.9rem" }}></i>
                            <span>{editKelas2Temp || "Nama Belum Ditetapkan"}</span>
                          </div>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              width: "38px",
                              height: "38px",
                              padding: 0,
                              minWidth: "38px",
                              backgroundColor: "#0284c7",
                              color: "#ffffff",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.95rem",
                            }}
                            onClick={() => {
                              setIsChangingClassName2(true);
                              setNewClassName2Input(editKelas2Temp || "");
                            }}
                            title={editKelas2Temp ? "Tukar Nama Kelas 2" : "Tetapkan Nama Kelas 2"}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#f0f9ff",
                            border: "2px solid #0284c7",
                            borderRadius: "10px",
                            padding: "10px",
                          }}
                        >
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="text"
                              placeholder="CTH: 1 PINTAR"
                              value={newClassName2Input}
                              onChange={(e) => setNewClassName2Input(e.target.value.toUpperCase())}
                              style={{
                                flex: 1,
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "2px solid var(--color-dark)",
                                fontSize: "0.95rem",
                                fontWeight: "900",
                                fontFamily: "inherit",
                                textTransform: "uppercase",
                              }}
                            />
                            <button
                              type="button"
                              className="neo-btn bg-red"
                              style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => setIsChangingClassName2(false)}
                              title="Batal"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => handleSaveClassName2(newClassName2Input)}
                              title="Sahkan Nama Kelas 2"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Kod Kelas 2 */}
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                        Kod Kelas 2:
                      </label>
                      {!isChangingCode2 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f8fafc",
                              color: editKod2Temp ? "#0f172a" : "#94a3b8",
                              fontSize: "1rem",
                              letterSpacing: "2px",
                              fontWeight: "900",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <i className="fa-solid fa-key" style={{ color: "#0284c7", fontSize: "0.85rem" }}></i>
                            <span>{editKod2Temp || "Kod Belum Ditetapkan"}</span>
                          </div>
                          {editKod2Temp && (
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                width: "38px",
                                height: "38px",
                                padding: 0,
                                minWidth: "38px",
                                fontSize: "0.88rem",
                                backgroundColor: "#f1f5f9",
                                color: "#334155",
                                border: "2px solid #cbd5e1",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => {
                                navigator.clipboard.writeText(editKod2Temp);
                                if ((window as any).showAppToast) {
                                  (window as any).showAppToast("Kod Disalin", "Kod Kelas 2 telah disalin!");
                                } else {
                                  alert("Kod Kelas 2 telah disalin!");
                                }
                              }}
                              title="Salin Kod"
                            >
                              <i className="fa-solid fa-copy"></i>
                            </button>
                          )}
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              width: "38px",
                              height: "38px",
                              padding: 0,
                              minWidth: "38px",
                              backgroundColor: "#0284c7",
                              color: "#ffffff",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.95rem",
                            }}
                            onClick={() => {
                              setIsChangingCode2(true);
                              setNewCode2Input(editKod2Temp || "");
                            }}
                            title={editKod2Temp ? "Tukar Kod Kelas 2" : "Tetapkan Kod Kelas 2"}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#f0f9ff",
                            border: "2px solid #0284c7",
                            borderRadius: "10px",
                            padding: "10px",
                          }}
                        >
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="text"
                              maxLength={8}
                              placeholder="CTH: KLS2#01"
                              value={newCode2Input}
                              onChange={(e) => setNewCode2Input(e.target.value.toUpperCase())}
                              style={{
                                flex: 1,
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "2px solid var(--color-dark)",
                                fontSize: "1rem",
                                fontWeight: "900",
                                letterSpacing: "1.5px",
                                fontFamily: "inherit",
                                textTransform: "uppercase",
                              }}
                            />
                            <button
                              type="button"
                              className="neo-btn bg-red"
                              style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => setIsChangingCode2(false)}
                              title="Batal"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => {
                                if (newCode2Input.trim().toUpperCase() === editKodTemp) {
                                  alert("Kod Kelas 2 tidak boleh sama dengan Kod Kelas 1!");
                                  return;
                                }
                                handleSaveClassCode2(newCode2Input);
                              }}
                              title="Gunakan Kod Ini"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                            * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pilihan Kelas Aktif untuk Urus Murid */}
                {teacherCanHaveClass2 && editKelasTemp && editKelas2Temp && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      marginTop: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#334155" }}>
                      Pilih Kelas untuk Senarai Murid:
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="neo-btn"
                        style={{
                          padding: "6px 14px",
                          fontSize: "0.82rem",
                          fontWeight: "bold",
                          backgroundColor: (localStorage.getItem("bunyiKataNamaKelas") || "") === editKelasTemp ? "#ea580c" : "#f1f5f9",
                          color: (localStorage.getItem("bunyiKataNamaKelas") || "") === editKelasTemp ? "#ffffff" : "#475569",
                        }}
                        onClick={() => {
                          if (typeof (window as any).tukarKelasAktif === "function") {
                            (window as any).tukarKelasAktif(editKelasTemp);
                          }
                        }}
                      >
                        {editKelasTemp}
                      </button>
                      <button
                        type="button"
                        className="neo-btn"
                        style={{
                          padding: "6px 14px",
                          fontSize: "0.82rem",
                          fontWeight: "bold",
                          backgroundColor: (localStorage.getItem("bunyiKataNamaKelas") || "") === editKelas2Temp ? "#0284c7" : "#f1f5f9",
                          color: (localStorage.getItem("bunyiKataNamaKelas") || "") === editKelas2Temp ? "#ffffff" : "#475569",
                        }}
                        onClick={() => {
                          if (typeof (window as any).tukarKelasAktif === "function") {
                            (window as any).tukarKelasAktif(editKelas2Temp);
                          }
                        }}
                      >
                        {editKelas2Temp}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Kad 2: Tambah Murid Baharu (Kecil & Padat di sebelah input) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
              backgroundSize: "16px 16px",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            {/* Tajuk Highlight Warna Oren: Sama macam reka bentuk tajuk Pengurusan Murid & Kelas */}
            <div
              className="neo-btn bg-orange"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--color-orange, #ea580c)",
                color: "white",
                padding: "6px 16px",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                marginBottom: "12px",
                pointerEvents: "none",
              }}
            >
              <i className="fa-solid fa-user-plus" style={{ fontSize: "0.9rem" }}></i>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tambah Murid Baharu
              </span>
            </div>

            {/* Input + Butang Icon Tambah Murid Betul-betul Di Sebelah Ruang Input */}
            {isEffectiveTrial ? (
              /* LOCKED STATE: Akaun Percuma — Urus Murid Terkunci */
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                    <span>Pendaftaran Murid Terkunci (Versi Pro)</span>
                  </div>
                  <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                    Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                  </p>
                </div>
                <button
                  type="button"
                  className="neo-btn"
                  style={{
                    backgroundColor: "#ea580c",
                    color: "white",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    if (typeof (window as any).openPakejProModal === "function") {
                      (window as any).openPakejProModal("guru");
                    } else {
                      setIsProPricingModalOpen(true);
                    }
                  }}
                >
                  <i className="fa-solid fa-crown"></i> Pro
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  id="input-nama-murid-baru"
                  className="neo-input"
                  placeholder="cth: SITI AISHAH, MUHAMMAD AMIR, NUR FATIN..."
                  style={{
                    flex: 1,
                    fontSize: "0.9rem",
                    padding: "0 12px",
                    height: "40px",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxSizing: "border-box",
                    margin: 0,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (typeof (window as any).tambahMuridBaru === "function") {
                        (window as any).tambahMuridBaru();
                      }
                    }
                  }}
                />
                {/* Butang Tambah Murid: HANYA ICON SAHAJA */}
                <button
                  type="button"
                  className="neo-btn bg-orange"
                  style={{
                    color: "white",
                    backgroundColor: "var(--color-orange, #ea580c)",
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    minHeight: "40px",
                    padding: 0,
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                  onClick={() => {
                    if (typeof (window as any).tambahMuridBaru === "function") {
                      (window as any).tambahMuridBaru();
                    }
                  }}
                  title="Tambah Murid"
                >
                  <i className="fa-solid fa-user-plus"></i>
                </button>
              </div>
            )}
          </div>

          {/* Kad 3: Senarai Murid Berdaftar */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
              backgroundSize: "16px 16px",
              padding: "16px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                className="neo-btn bg-orange"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "12px",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  pointerEvents: "none",
                  margin: 0,
                }}
              >
                <i className="fa-solid fa-users" style={{ fontSize: "0.9rem" }}></i>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  }}
                >
                  Senarai Murid
                </span>
                <span id="jumlah-murid-count" style={{ display: "none" }}>0</span>
              </div>

              {/* Filter Pilih Kelas (TIADA SEMUA KELAS) + Carian Murid */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  id="filter-kelas-senarai-murid"
                  className="neo-btn filter-select"
                  style={{
                    display: isEffectiveTrial ? "none" : "block",
                    padding: "0 28px 0 10px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark, #10182f)",
                    backgroundColor: "#f8fafc",
                    color: "var(--color-dark, #10182f)",
                    cursor: "pointer",
                    margin: 0,
                    height: "38px",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => {
                    if (typeof (window as any).tukarKelasAktif === "function") {
                      (window as any).tukarKelasAktif(e.target.value);
                    }
                  }}
                  title="Pilih Kelas"
                >
                  {/* Populated dynamically by kemaskiniSemuaDropdownKelas (NO Semua Kelas) */}
                </select>

                {/* Carian Murid */}
                <div
                  style={{
                    position: "relative",
                    minWidth: "160px",
                  }}
                >
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                    }}
                  ></i>
                  <input
                    type="text"
                    id="carian-murid-urus"
                    className="neo-input"
                    placeholder="Cari nama murid..."
                    style={{
                      width: "100%",
                      paddingLeft: "30px",
                      paddingRight: "10px",
                      fontSize: "0.85rem",
                      height: "38px",
                      borderRadius: "10px",
                      border: "2px solid var(--color-dark, #10182f)",
                      boxSizing: "border-box",
                      margin: 0,
                    }}
                    onInput={() => {
                      if (
                        typeof (window as any).renderSenaraiMuridUrus ===
                        "function"
                      ) {
                        (window as any).renderSenaraiMuridUrus();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Container yang dipopulate oleh window.renderSenaraiMuridUrus() */}
            <div
              id="senarai-murid-container"
              style={{
                width: "100%",
                maxHeight: "380px",
                overflowY: "auto",
                borderRadius: "12px",
                border: "2px solid var(--color-dark, #10182f)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Diisi oleh renderSenaraiMuridUrus() */}
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal: Pilihan Eksport Laporan (PDF / CSV & Pilihan Cabaran) */}
      {showExportModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="modal-content neo-box"
            style={{
              maxWidth: "540px",
              width: "100%",
              borderRadius: "20px",
              padding: "24px 22px 20px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 6px 6px 0 var(--color-dark)",
              border: "3px solid var(--color-dark)",
              maxHeight: "92vh",
              overflowY: "auto",
              backgroundImage: "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 248, 236, .95), rgba(255, 248, 236, .95))",
              backgroundSize: "18px 18px, auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Butang X Merah Petak */}
            <button
              className="neo-btn bg-red close-btn"
              onClick={() => setShowExportModal(false)}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Header Modal */}
            <div
              className="modal-header-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                borderBottom: "2px solid var(--color-gray, #e2e8f0)",
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
                <i className="fa-solid fa-file-export" style={{ marginRight: "8px" }}></i>
                Eksport Laporan Prestasi
              </div>
            </div>

            {/* Pilihan Cabaran (Card 2 Kolum Bersebelahan) */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "900",
                  color: "var(--color-dark)",
                  marginBottom: "8px",
                }}
              >
                <i className="fa-solid fa-map-location-dot" style={{ marginRight: "6px", color: "#0284c7" }}></i>
                Pilih Cabaran
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { id: "all", label: "Semua Cabaran", icon: "fa-layer-group", color: "#f59e0b", fullWidth: true },
                  { id: "1", label: "Cabaran Kenal Huruf", icon: "fa-font", color: "#10b981" },
                  { id: "2", label: "Cabaran Suku Kata Asas", icon: "fa-cubes", color: "#0284c7" },
                  { id: "3", label: "Cabaran Suku Kata Hero", icon: "fa-shield-halved", color: "#ff751f" },
                  { id: "4", label: "Cabaran Bacaan Bergred", icon: "fa-book-open-reader", color: "#ec4899" },
                ].map((scope) => {
                  const isSelected = selectedExportPeta === scope.id;
                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setSelectedExportPeta(scope.id as any)}
                      style={{
                        gridColumn: scope.fullWidth ? "span 2" : "span 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: isSelected ? "2.5px solid var(--color-dark)" : "2px solid #cbd5e1",
                        backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
                        boxShadow: isSelected ? "0 3px 0 var(--color-dark)" : "0 2px 0 rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        minHeight: "46px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            backgroundColor: isSelected ? "#dcfce7" : "#f8fafc",
                            border: `1.5px solid ${isSelected ? "#16a34a" : "#cbd5e1"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isSelected ? "#15803d" : scope.color,
                            fontSize: "0.9rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className={`fa-solid ${scope.icon}`}></i>
                        </div>
                        <span
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: isSelected ? "900" : "700",
                            color: isSelected ? "#15803d" : "var(--color-dark)",
                            lineHeight: "1.2",
                          }}
                        >
                          {scope.label}
                        </span>
                      </div>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: isSelected ? "5.5px solid #16a34a" : "2px solid #cbd5e1",
                          backgroundColor: "white",
                          flexShrink: 0,
                          marginLeft: "6px",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Maklumat Sekolah / Kelas / Guru (Editable) */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                padding: "12px",
                border: "2px solid #cbd5e1",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "0.76rem",
                  fontWeight: "bold",
                  color: "#64748b",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span><i className="fa-solid fa-school" style={{ marginRight: "4px" }}></i> Maklumat Laporan:</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "bold", color: "#475569", marginBottom: "2px" }}>Nama Sekolah:</label>
                  <input
                    type="text"
                    value={exportSchoolInput}
                    onChange={(e) => setExportSchoolInput(e.target.value)}
                    placeholder="SK Bukit Beruang"
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "0.78rem",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "bold", color: "#475569", marginBottom: "2px" }}>Nama Kelas:</label>
                  <input
                    type="text"
                    value={exportClassInput}
                    onChange={(e) => setExportClassInput(e.target.value)}
                    placeholder="1 Cemerlang"
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "0.78rem",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "bold", color: "#475569", marginBottom: "2px" }}>Nama Guru Penilai:</label>
                <input
                  type="text"
                  value={exportTeacherInput}
                  onChange={(e) => setExportTeacherInput(e.target.value)}
                  placeholder="Muhammad Izzat Bin Razak"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons (PDF & CSV) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                type="button"
                className="neo-btn bg-red"
                style={{
                  padding: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  borderRadius: "12px",
                  border: "2.5px solid var(--color-dark)",
                  boxShadow: "0 3px 0 var(--color-dark)",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                }}
                onClick={() => {
                  if (exportSchoolInput) localStorage.setItem('pdf_sekolah', exportSchoolInput);
                  if (exportClassInput) {
                    localStorage.setItem('bunyiKataNamaKelas', exportClassInput);
                    localStorage.setItem('pdf_kelas', exportClassInput);
                  }
                  if (exportTeacherInput) localStorage.setItem('pdf_guru', exportTeacherInput);

                  setShowExportModal(false);
                  (window as any).cetakLaporanPDF && (window as any).cetakLaporanPDF(selectedExportPeta);
                }}
              >
                <i className="fa-solid fa-file-pdf" style={{ fontSize: "1.2rem" }}></i>
                <span>PDF</span>
              </button>

              <button
                type="button"
                className="neo-btn bg-green"
                style={{
                  padding: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  borderRadius: "12px",
                  border: "2.5px solid var(--color-dark)",
                  boxShadow: "0 3px 0 var(--color-dark)",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                }}
                onClick={() => {
                  if (exportSchoolInput) localStorage.setItem('pdf_sekolah', exportSchoolInput);
                  if (exportClassInput) {
                    localStorage.setItem('bunyiKataNamaKelas', exportClassInput);
                    localStorage.setItem('pdf_kelas', exportClassInput);
                  }
                  if (exportTeacherInput) localStorage.setItem('pdf_guru', exportTeacherInput);

                  setShowExportModal(false);
                  (window as any).muatTurunCSV && (window as any).muatTurunCSV(selectedExportPeta);
                }}
              >
                <i className="fa-solid fa-file-csv" style={{ fontSize: "1.2rem" }}></i>
                <span>CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            <AdminSijilManager isGuruMode={true} onClose={() => {
              if ((window as any).playBubble) (window as any).playBubble();
              setShowGuruSijilModal(false);
            }} />
          </div>
        </div>
      )}

      {/* Screen: Mod Ibu Bapa (Dashboard Statistik Anak) */}
      <div
        id="ibubapa-dashboard"
        className="screen"
      >
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            backgroundColor: "#0284c7",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, #0284c7 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "100% 100%, 15px 15px",
            position: "relative",
            borderRadius: "20px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "15px",
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
              <div className="ibubapa-card-avatar-box">
                <div
                  id="ibubapa-avatar-icon"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    zIndex: 1,
                  }}
                ></div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "rgba(255,255,255,0.25)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Statistik Anak Saya
                  </span>
                  {/* Lencana Baki Langganan (Responsif) */}
                  {(() => {
                    const badge = getSubscriptionBadgeInfo("ibubapa");
                    return (
                      <span
                        onClick={() => setIsProPricingModalOpen(true)}
                        style={{
                          cursor: "pointer",
                          fontSize: "0.74rem",
                          fontWeight: "bold",
                          backgroundColor: badge.bg,
                          border: `1.5px solid ${badge.border}`,
                          color: "#ffffff",
                          padding: "2px 9px",
                          borderRadius: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
                        }}
                        title="Klik untuk lihat maklumat status langganan"
                      >
                        <i className={badge.icon} style={{ fontSize: "0.75rem", color: badge.color }}></i>
                        <span>{badge.text}</span>
                      </span>
                    );
                  })()}
                </div>
                <h2
                  id="ibubapa-nama-anak-title"
                  style={{
                    fontSize: "1.3rem",
                    margin: "2px 0",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Nama Anak
                </h2>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>Keluarga: <span id="ibubapa-nama-keluarga-title">{localStorage.getItem("bunyiKataNamaKeluarga") || "-"}</span></span>
                  <span>•</span>
                  <span>Kod: <span id="ibubapa-kod-keluarga-title">{localStorage.getItem("bunyiKataKodKeluarga") || "-"}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="ibubapa-top-actions"
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: "100",
            }}
          >
            <button
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                (window as any).bukaModalAppInfo && (window as any).bukaModalAppInfo();
              }}
              className="neo-btn ibubapa-btn-info"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid var(--color-dark)",
                borderRadius: "50%",
                padding: "0",
                width: "32px",
                height: "32px",
                minWidth: "auto",
                minHeight: "auto",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--color-dark)",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
              title="Maklumat Aplikasi"
            >
              <i className="fa-solid fa-circle-info"></i>
            </button>
            <button
              onClick={(e) => {
                setEditModalError("");
                setIsMandatorySetup(false);
                if ((window as any).playBubble) (window as any).playBubble();
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
              }}
              className="neo-btn ibubapa-btn-edit"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid var(--color-dark)",
                borderRadius: "50%",
                padding: "0",
                width: "32px",
                height: "32px",
                minWidth: "auto",
                minHeight: "auto",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--color-dark)",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
              title="Edit Maklumat Keluarga & Anak"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
            <button
              className="neo-btn ibubapa-btn-tukar-anak"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-anak");
                if (modal) {
                  modal.style.display = "flex";
                  if ((window as any).bukaModalPilihAnak)
                    (window as any).bukaModalPilihAnak(true);
                }
              }}
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid var(--color-dark)",
                borderRadius: "50%",
                padding: "0",
                width: "32px",
                height: "32px",
                minWidth: "auto",
                minHeight: "auto",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--color-dark)",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
              title="Tukar Anak"
            >
              <i className="fa-solid fa-users"></i>
            </button>
          </div>
        </div>

        {/* Kad Ringkasan Markah & Lencana (Mod Ibu Bapa) */}
        <div
          className="ibubapa-stats-grid"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {/* Card 1: Jumlah Markah (Warm Amber/Gold) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(217, 119, 6, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-star"></i>
            </div>
            <i
              className="fa-solid fa-star"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Jumlah Markah
              </div>
              <div
                id="ibubapa-jumlah-markah"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 2: Lencana Diberi (Blue/Indigo) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(29, 78, 216, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-award"></i>
            </div>
            <i
              className="fa-solid fa-award"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Lencana Diberi
              </div>
              <div
                id="ibubapa-jumlah-lencana"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Card 3: Aktiviti Selesai (Emerald/Teal) */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "18px",
              padding: "16px 18px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "115px",
              boxShadow: "0 10px 22px -5px rgba(5, 150, 105, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Half dot pattern overlay */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "55%",
                height: "100%",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#ffffff",
                marginBottom: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <i
              className="fa-solid fa-circle-check"
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "2.8rem",
                color: "#ffffff",
                opacity: 0.12,
                pointerEvents: "none",
                lineHeight: 1,
                zIndex: 1,
              }}
            ></i>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                  color: "rgba(255, 255, 255, 0.92)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Aktiviti Selesai
              </div>
              <div
                id="ibubapa-aktiviti-selesai"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                0
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostik AI Ibu Bapa */}
        <div
          id="ibubapa-laporan-card"
          className="neo-box ibubapa-laporan-card-desktop"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
            padding: "18px 20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              gap: "8px",
              width: "100%",
              flexWrap: "nowrap",
            }}
          >
            <span
              style={{
                background: "#0284c7",
                color: "white",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                border: "1.5px solid var(--color-dark)",
                lineHeight: "1.2",
              }}
            >
              <i className="fa-solid fa-brain" style={{ flexShrink: 0 }}></i>{" "}
              Laporan &amp; Cadangan Bimbingan Ibu Bapa
            </span>
            <button
              className="neo-btn bg-white"
              style={{
                padding: "6px 10px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                flexShrink: 0,
              }}
              title="Kemaskini"
              onClick={() => {
                (window as any).renderParentDashboard &&
                  (window as any).renderParentDashboard();
              }}
            >
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>
          <div
            id="ibubapa-ai-content"
            style={{
              fontSize: "0.88rem",
              lineHeight: "1.5",
              color: "var(--color-dark)",
              fontWeight: "600",
            }}
          >
            {/* Populated by JS */}
          </div>
        </div>

        {/* Jadual Perincian Aktiviti Anak */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
            padding: "20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-list-check"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Rekod Kemajuan Cabaran
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "nowrap" }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: "var(--color-dark)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Pilihan Cabaran:
              </label>
              <select
                id="ibubapa-peta-select"
                className="neo-input century-gothic-font"
                style={{
                  padding: "6px 10px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark)",
                  background: "white",
                  color: "var(--color-dark)",
                  fontFamily:
                    "'AtlantaRounded', 'AtlantaRoundedBlack', AtlantaRoundedBlack, AtlantaRounded, sans-serif",
                }}
                onChange={(e) => {
                  (window as any).ibubapaPetaFilter = e.target.value;
                  (window as any).renderParentDashboard &&
                    (window as any).renderParentDashboard();
                }}
              >
                <option value="1">Kenal Huruf</option>
                <option value="2">Suku Kata Asas</option>
                <option value="3">Suku Kata Hero</option>
                <option value="4">Bacaan Bergred</option>
                <option value="5">Cabaran Lain</option>
              </select>
            </div>
          </div>
          <div
            className="table-responsive"
            style={{ minHeight: "auto", marginTop: "10px" }}
          >
            <table className="teacher-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0", borderRadius: "10px" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
                  <th
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      padding: "10px 14px",
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                      borderBottom: "2px solid #042f2e",
                      borderRight: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    MODUL / AKTIVITI CABARAN
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      padding: "10px 14px",
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                      borderBottom: "2px solid #042f2e",
                    }}
                  >
                    STATUS &amp; MARKAH
                  </th>
                </tr>
              </thead>
              <tbody id="ibubapa-aktiviti-tbody">{/* Populated by JS */}</tbody>
            </table>
          </div>
        </div>
      </div>

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
                boxSizing: "border-box"
              }}
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
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
                boxSizing: "border-box"
              }}
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
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
      <div id="view-surih-nombor" className="screen">
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
      <div id="view-surih-huruf" className="screen">
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
        className="screen"
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <TandukKataGame
          onClose={() => {
            const event = new CustomEvent("tukar-skrin", {
              detail: { skrin: "map-screen" },
            });
            window.dispatchEvent(event);
            if (window.paparSkrin) window.paparSkrin("map-screen");
          }}
        />
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
        )}
      </div>

      {/* Puzzle Suku Kata Game */}
      <div
        id="view-puzzle-sukukata"
        className="screen"
        style={{
          padding: "16px",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <PuzzleSukuKataGame
          onClose={() => {
            const event = new CustomEvent("tukar-skrin", {
              detail: { skrin: "map-screen" },
            });
            window.dispatchEvent(event);
            if (window.paparSkrin) window.paparSkrin("map-screen");
          }}
        />
      </div>

      {/* Cantum Kata Game */}
      <div
        id="view-cantum-kata"
        className="screen"
        style={{
          padding: "16px",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <CantumKataGame
          onClose={() => {
            const event = new CustomEvent("tukar-skrin", {
              detail: { skrin: "map-screen" },
            });
            window.dispatchEvent(event);
            if (window.paparSkrin) window.paparSkrin("map-screen");
          }}
        />
      </div>

      {/* Cabaran Suku Kata Game */}
      <div
        id="view-cabaran-suku-kata"
        className="screen"
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <CabaranSukuKataGame
          onClose={() => {
            if ((window as any).currentPeta && (window as any).bukaPeta) {
              (window as any).bukaPeta((window as any).currentPeta, true);
            }
            if ((window as any).paparSkrin)
              (window as any).paparSkrin("map-screen");
          }}
        />
      </div>

      {/* Pembelajaran Fonik ABC Game */}
      <div
        id="view-belajar-fonik"
        className="screen"
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <FonikAbcGame
          onClose={() => {
            if ((window as any).currentPeta && (window as any).bukaPeta) {
              (window as any).bukaPeta((window as any).currentPeta, true);
            }
            if ((window as any).paparSkrin)
              (window as any).paparSkrin("map-screen");
          }}
        />
      </div>

      {/* Pembelajaran Nombor (Asas, Tambah, Tolak) */}
      <div
        id="view-belajar-nombor"
        className="screen"
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <NomborGame
          onClose={() => {
            if ((window as any).currentPeta && (window as any).bukaPeta) {
              (window as any).bukaPeta((window as any).currentPeta, true);
            }
            if ((window as any).paparSkrin)
              (window as any).paparSkrin("map-screen");
          }}
        />
      </div>

      {/* Kad Imbasan Nombor (Asas 0-10 & Siri Nombor) */}
      <div
        id="view-kad-imbasan-nombor"
        className="screen"
        style={{
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <KadImbasanNomborGame
          key={kadImbasanNomborMode}
          initialMode={kadImbasanNomborMode}
          onBack={() => {
            if ((window as any).paparSkrin) (window as any).paparSkrin("map-screen");
          }}
        />
      </div>

      {/* VR ABC */}
      <div id="view-vr-abc" className="screen" style={{ padding: 0, margin: 0, position: "relative", background: "none" }}>
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
            <span>3D BUNYI KATA</span>
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
      <div id="view-belajar-huruf" className="screen">
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
      <div id="view-belajar-sukukata" className="screen">
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
          <SukuKataPuzzleBar />
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
      <div id="view-ar-sukukata" className="screen">
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
      <div id="view-ar-kirajari" className="screen">
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
      <div id="view-belajar-bacaan" className="screen">
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
                  className="neo-btn bg-purple"
                  onClick={(e) => {
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
                  className="neo-btn bg-purple"
                  onClick={(e) => {
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
          {isEditModalOpen && (() => {
            const isAdmin = editModalMode === "admin";
            const isParent = editModalMode === "ibubapa";
            const isGuru = editModalMode === "guru";

            const modalHeaderTitle = isAdmin
              ? "Maklumat Admin"
              : isParent
                ? "Maklumat Keluarga"
                : "Maklumat Guru";

            const headerBgColor = isAdmin
              ? "#168f81"
              : isParent
                ? "var(--color-blue)"
                : "var(--color-orange)";

            const labelHighlightStyle: React.CSSProperties = {
              backgroundColor: headerBgColor,
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "8px",
              border: "2px solid #10182f",
              fontWeight: "900",
              fontSize: "0.88rem",
              letterSpacing: "0.5px",
              boxShadow: "0 3px 0 #10182f",
              display: "inline-block",
            };

            return (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 10000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    borderRadius: "16px",
                    padding: "24px",
                    position: "relative",
                    width: "90%",
                    maxWidth: "500px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    border: "3px solid var(--color-dark)",
                    boxShadow: "0 4px 0 var(--color-dark)",
                  }}
                >
                  <button
                    className="neo-btn bg-red"
                    onClick={() => {
                      if (isMandatorySetup) {
                        setEditModalError("Sila lengkapkan semua maklumat wajib bertanda (*) dan klik butang simpan.");
                        return;
                      }
                      setIsEditModalOpen(false);
                      setEditModalError("");
                    }}
                    title="Tutup"
                    aria-label="Tutup"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div
                      className="neo-btn"
                      style={{
                        backgroundColor: headerBgColor,
                        color: "white",
                        fontSize: "1.2rem",
                        margin: "0 auto",
                        whiteSpace: "normal",
                        display: "inline-block",
                        textAlign: "center",
                        pointerEvents: "none",
                        padding: "10px 20px",
                      }}
                    >
                      {modalHeaderTitle}
                    </div>
                  </div>

                  {/* Error Banner */}
                  {editModalError && (
                    <div
                      style={{
                        backgroundColor: "#fee2e2",
                        border: "2px solid #ef4444",
                        color: "#b91c1c",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                      <span>{editModalError}</span>
                    </div>
                  )}

                  {/* Success Banner (Kata Laluan) */}
                  {passwordToast && (
                    <div
                      style={{
                        backgroundColor: "#dcfce7",
                        border: "2px solid #22c55e",
                        color: "#15803d",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                      <span>{passwordToast}</span>
                    </div>
                  )}

                  {isAdmin ? (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Sistem</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="CTH: BUNYI KATA APP"
                          value={editAdminNamaSistemTemp}
                          onChange={(e) => {
                            setEditAdminNamaSistemTemp(e.target.value.toUpperCase());
                            if (editModalError) setEditModalError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid var(--color-dark)",
                            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Admin</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <input
                          type="text"
                          placeholder="CTH: IR EDUINNOVATIONS"
                          value={editAdminNamaTemp}
                          onChange={(e) => {
                            setEditAdminNamaTemp(e.target.value.toUpperCase());
                            if (editModalError) setEditModalError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid var(--color-dark)",
                            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kod Admin</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <input
                          type="text"
                          maxLength={8}
                          placeholder="CTH: ADMIN#01"
                          value={editKodTemp}
                          onChange={(e) => {
                            setEditKodTemp(e.target.value.toUpperCase());
                            if (editModalError) setEditModalError("");
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid var(--color-dark)",
                            fontSize: "1.1rem",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            letterSpacing: "1px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        />
                        <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", display: "block", textAlign: "left" }}>
                          * Wajib 8 aksara & sekurang-kurangnya 1 simbol (Cth: ADMIN#01)
                        </span>
                      </div>

                      {/* Ruangan Emel Admin (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Admin</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataAdminEmail") || "admin@ireduinnovations.com"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Admin */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Admin</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    alert("Sila masukkan kata laluan baharu!");
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : isParent ? (
                    <>
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Nama Keluarga</span>
                          <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="CTH: KELUARGA RAZAK"
                            value={editNamaKeluargaTemp}
                            onChange={(e) => {
                              setEditNamaKeluargaTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                          <i
                            className="fa-solid fa-house-user"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#0284c7",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Notifikasi & Butang Simpan Automatik apabila mengedit Nama Keluarga */}
                      {editNamaKeluargaTemp.trim() !== (localStorage.getItem("bunyiKataNamaKeluarga") || "") && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#f0f9ff",
                            border: "1.5px solid #0284c7",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            marginBottom: "14px",
                            animation: "pulse 1.5s infinite",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#0369a1", display: "flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-circle-info"></i> Perubahan nama keluarga dikesan
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                padding: "5px 10px",
                                fontSize: "0.78rem",
                                borderRadius: "6px",
                              }}
                              onClick={() => {
                                setEditNamaKeluargaTemp(localStorage.getItem("bunyiKataNamaKeluarga") || "");
                              }}
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#0284c7",
                                color: "white",
                                padding: "5px 12px",
                                fontSize: "0.78rem",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                              onClick={async () => {
                                const finalName = editNamaKeluargaTemp.trim().toUpperCase();
                                if (!finalName) {
                                  if ((window as any).showAppToast) {
                                    (window as any).showAppToast("Amaran", "Nama keluarga tidak boleh dibiarkan kosong!", "warning");
                                  }
                                  return;
                                }
                                localStorage.setItem("bunyiKataNamaKeluarga", finalName);
                                setEditNamaKeluargaTemp(finalName);
                                const parentId = localStorage.getItem("bunyiKataUserId") || (window as any).currentUser?.id || "";
                                const currentKod = localStorage.getItem("bunyiKataKodKeluarga") || "";

                                try {
                                  if (typeof updateParentFamilyAndNameInFirebase === "function") {
                                    await updateParentFamilyAndNameInFirebase({
                                      namaKeluarga: finalName,
                                      parentIdOrEmail: parentId,
                                      kodKeluarga: currentKod,
                                    });
                                  } else if (typeof saveFamilyToFirebase === "function" && currentKod) {
                                    await saveFamilyToFirebase({
                                      kodKeluarga: currentKod,
                                      namaKeluarga: finalName,
                                      parentId: parentId,
                                    });
                                  }
                                } catch (err) {
                                  console.warn("Firebase family update notice:", err);
                                }

                                const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                                if (famTitle) famTitle.textContent = finalName;
                                const famDashTitle = document.getElementById("ibubapa-dashboard-nama-keluarga-title");
                                if (famDashTitle) famDashTitle.textContent = finalName;

                                setIsChangingFamilyName(false);
                                if ((window as any).showAppToast) {
                                  (window as any).showAppToast("Nama Keluarga Dikemas Kini", "Nama keluarga berjaya disimpan ke pangkalan data!");
                                }
                              }}
                            >
                              <i className="fa-solid fa-floppy-disk"></i> Simpan
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bahagian Kod Keluarga */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            className="neo-btn"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "var(--color-blue, #0284c7)",
                              color: "white",
                              padding: "6px 16px",
                              borderRadius: "12px",
                              border: "2.5px solid var(--color-dark, #10182f)",
                              boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                              pointerEvents: "none",
                            }}
                          >
                            <i className="fa-solid fa-people-roof" style={{ fontSize: "0.9rem" }}></i>
                            <span
                              style={{
                                fontWeight: 900,
                                fontSize: "0.92rem",
                                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                              }}
                            >
                              Pengurusan Kod Keluarga
                            </span>
                          </div>
                          <span
                            style={{
                              background: isEffectivePro ? "#dcfce7" : "#fee2e2",
                              color: isEffectivePro ? "#15803d" : "#b91c1c",
                              border: isEffectivePro ? "1.5px solid #22c55e" : "1.5px solid #ef4444",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                              display: "inline-flex",
                              alignItems: "center",
                              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
                            }}
                          >
                            {isEffectiveTrial ? "Percuma" : "Pro"}
                          </span>
                        </div>

                        {isEffectiveTrial ? (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kod Keluarga Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#0284c7",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("ibubapa");
                                } else {
                                  setProPricingTab("ibubapa");
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        ) : (
                        <div style={{ marginBottom: "14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Kod Keluarga</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          {!isChangingFamilyCode ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  flex: 1,
                                  padding: "10px 12px",
                                  borderRadius: "8px",
                                  border: "2px solid #cbd5e1",
                                  backgroundColor: "#f8fafc",
                                  color: editKodTemp ? "#0f172a" : "#94a3b8",
                                  fontSize: "1.05rem",
                                  letterSpacing: "1.5px",
                                  fontWeight: "900",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <i className="fa-solid fa-key" style={{ color: "#0284c7", fontSize: "0.9rem" }}></i>
                                <span>{editKodTemp || "Kod Belum Ditetapkan"}</span>
                              </div>
                              <button
                                type="button"
                                className="neo-btn"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  padding: 0,
                                  minWidth: "38px",
                                  backgroundColor: "#0284c7",
                                  color: "#ffffff",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => {
                                  setIsChangingFamilyCode(true);
                                  setNewFamilyCodeInput(editKodTemp || "");
                                }}
                                title={editKodTemp ? "Tukar Kod Keluarga" : "Tetapkan Kod Keluarga"}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "#f0f9ff",
                                border: "2px solid #0284c7",
                                borderRadius: "10px",
                                padding: "10px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <input
                                  type="text"
                                  maxLength={8}
                                  placeholder="CTH: FAM@2026"
                                  value={newFamilyCodeInput}
                                  onChange={(e) => setNewFamilyCodeInput(e.target.value.toUpperCase())}
                                  style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "1rem",
                                    fontWeight: "900",
                                    fontFamily: "inherit",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.5px",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="neo-btn bg-red"
                                  style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={() => setIsChangingFamilyCode(false)}
                                  title="Batal"
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                                <button
                                  type="button"
                                  className="neo-btn"
                                  style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={() => handleSaveFamilyCode(newFamilyCodeInput)}
                                  title="Sahkan Kod Keluarga"
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      </div>

                      {/* Ruangan Emel Ibu Bapa (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Ibu Bapa</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataIbubapaEmail") || "ibubapa@gmail.com"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Ibu Bapa */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Ibu Bapa</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    alert("Sila masukkan kata laluan baharu!");
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ width: "100%" }}>
                      {/* Nama Sekolah & Nama Guru Side-by-Side */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          marginBottom: "14px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Nama Sekolah</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="CTH: SK BUKIT BERUANG"
                            value={editSekolahTemp}
                            onChange={(e) => {
                              setEditSekolahTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "6px",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={labelHighlightStyle}>Nama Guru</span>
                            <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="CTH: CIKGU SARAH"
                            value={editGuruTemp}
                            onChange={(e) => {
                              setEditGuruTemp(e.target.value.toUpperCase());
                              if (editModalError) setEditModalError("");
                            }}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              border: "2px solid var(--color-dark)",
                              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                      </div>

                      {/* Notifikasi & Butang Simpan Automatik apabila mengedit Nama Sekolah / Guru */}
                      {(editSekolahTemp.trim() !== (localStorage.getItem("bunyiKataNamaSekolah") || "") ||
                        editGuruTemp.trim() !== (localStorage.getItem("bunyiKataNamaGuru") || "")) && (
                        <div
                          style={{
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#ecfdf5",
                            border: "2px solid #10b981",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            boxShadow: "0 2px 0 var(--color-dark)",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#065f46", display: "flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-pen-nib" style={{ color: "#10b981" }}></i>
                            Simpan perubahan Nama Sekolah & Guru?
                          </span>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              backgroundColor: "#16a34a",
                              color: "white",
                              padding: "6px 14px",
                              fontSize: "0.84rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            onClick={async () => {
                              const s = editSekolahTemp.trim().toUpperCase();
                              const g = editGuruTemp.trim().toUpperCase();
                              if (!s || !g) {
                                alert("Sila lengkapkan Nama Sekolah dan Nama Guru!");
                                return;
                              }
                              localStorage.setItem("bunyiKataNamaSekolah", s);
                              localStorage.setItem("bunyiKataNamaGuru", g);
                              localStorage.setItem("pdf_guru", g);
                              const sEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                              if (sEl) sEl.innerText = s;
                              const gEl = document.getElementById("guru-dashboard-nama-guru-title");
                              if (gEl) gEl.innerText = g;

                              await updateTeacherSchoolAndNameInFirebase({
                                namaSekolah: s,
                                namaGuru: g,
                              });

                              if (typeof (window as any).showAppToast === "function") {
                                (window as any).showAppToast("Berjaya Disimpan", "Nama sekolah dan nama guru berjaya dikemas kini ke pangkalan data!");
                              }
                            }}
                          >
                            <i className="fa-solid fa-check"></i> Simpan
                          </button>
                        </div>
                      )}

                      {/* Bahagian Kod Kelas (Kelas 1 & Kelas 2) */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            className="neo-btn"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "var(--color-orange, #ea580c)",
                              color: "white",
                              padding: "6px 16px",
                              borderRadius: "12px",
                              border: "2.5px solid var(--color-dark, #10182f)",
                              boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                              pointerEvents: "none",
                            }}
                          >
                            <i className="fa-solid fa-chalkboard-user" style={{ fontSize: "0.9rem" }}></i>
                            <span
                              style={{
                                fontWeight: 900,
                                fontSize: "0.92rem",
                                fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                              }}
                            >
                              Pengurusan Kod Kelas
                            </span>
                          </div>
                          <span
                            style={{
                              background: isEffectivePro ? "#dcfce7" : "#fee2e2",
                              color: isEffectivePro ? "#15803d" : "#b91c1c",
                              border: isEffectivePro ? "1.5px solid #22c55e" : "1.5px solid #ef4444",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                              display: "inline-flex",
                              alignItems: "center",
                              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
                            }}
                          >
                            {isEffectiveTrial ? "Percuma" : "Pro"}
                          </span>
                        </div>

                        {/* KAD KELAS 1 (Utama) */}
                        {isEffectiveTrial ? (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kelas Pertama Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#ea580c",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("guru");
                                } else {
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#ffffff",
                              border: "2px solid #ea580c",
                              borderRadius: "12px",
                              padding: "14px",
                              marginBottom: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "900", color: "#c2410c", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-1" style={{ background: "#ea580c", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                                Kelas Pertama
                              </span>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Nama Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                              </label>
                              {!isChangingClassName1 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKelasTemp ? "#0f172a" : "#94a3b8",
                                      fontSize: "0.95rem",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-chalkboard-user" style={{ color: "#ea580c", fontSize: "0.9rem" }}></i>
                                    <span>{editKelasTemp || "Nama Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: headerBgColor,
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingClassName1(true);
                                      setNewClassName1Input(editKelasTemp || "");
                                    }}
                                    title={editKelasTemp ? "Tukar Nama Kelas 1" : "Tetapkan Nama Kelas 1"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#fff7ed",
                                    border: "2px solid #ea580c",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      placeholder="CTH: 1 CEMERLANG"
                                      value={newClassName1Input}
                                      onChange={(e) => setNewClassName1Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "0.95rem",
                                        fontWeight: "900",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingClassName1(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassName1(newClassName1Input)}
                                      title="Sahkan Nama Kelas 1"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Kod Kelas 1: <span style={{ color: "#ef4444" }}>*</span>
                              </label>
                              {!isChangingCode1 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: "#0f172a",
                                      fontSize: "1rem",
                                      letterSpacing: "2px",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-key" style={{ color: "#ea580c", fontSize: "0.85rem" }}></i>
                                    <span style={{ color: editKodTemp ? "#0f172a" : "#94a3b8" }}>
                                      {editKodTemp || "Kod Belum Ditetapkan"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: headerBgColor,
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingCode1(true);
                                      setNewCode1Input(editKodTemp || "");
                                    }}
                                    title={editKodTemp ? "Tukar Kod Kelas 1" : "Tetapkan Kod Kelas 1"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#fff7ed",
                                    border: "2px solid #ea580c",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      maxLength={8}
                                      placeholder="CTH: KELAS#01"
                                      value={newCode1Input}
                                      onChange={(e) => setNewCode1Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "1rem",
                                        fontWeight: "900",
                                        letterSpacing: "1.5px",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingCode1(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassCode1(newCode1Input)}
                                      title="Gunakan Kod Ini"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "#ea580c", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                    * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* KAD KELAS 2 (Kelas Kedua) */}
                        {teacherCanHaveClass2 ? (
                          <div
                            style={{
                              backgroundColor: "#ffffff",
                              border: "2px solid #0284c7",
                              borderRadius: "12px",
                              padding: "14px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "900", color: "#0369a1", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-2" style={{ background: "#0284c7", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}></i>
                                Kelas Kedua
                              </span>
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Nama Kelas 2:
                              </label>
                              {!isChangingClassName2 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKelas2Temp ? "#0f172a" : "#94a3b8",
                                      fontSize: "0.95rem",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-chalkboard-user" style={{ color: "#0284c7", fontSize: "0.9rem" }}></i>
                                    <span>{editKelas2Temp || "Nama Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: "#0284c7",
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingClassName2(true);
                                      setNewClassName2Input(editKelas2Temp || "");
                                    }}
                                    title={editKelas2Temp ? "Tukar Nama Kelas 2" : "Tetapkan Nama Kelas 2"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    border: "2px solid #0284c7",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      placeholder="CTH: 1 PINTAR"
                                      value={newClassName2Input}
                                      onChange={(e) => setNewClassName2Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "0.95rem",
                                        fontWeight: "900",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingClassName2(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => handleSaveClassName2(newClassName2Input)}
                                      title="Sahkan Nama Kelas 2"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Kod Kelas 2:
                              </label>
                              {!isChangingCode2 ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "2px solid #cbd5e1",
                                      backgroundColor: "#f8fafc",
                                      color: editKod2Temp ? "#0f172a" : "#94a3b8",
                                      fontSize: "1rem",
                                      letterSpacing: "2px",
                                      fontWeight: "900",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <i className="fa-solid fa-key" style={{ color: "#0284c7", fontSize: "0.85rem" }}></i>
                                    <span>{editKod2Temp || "Kod Belum Ditetapkan"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="neo-btn"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      padding: 0,
                                      minWidth: "38px",
                                      backgroundColor: "#0284c7",
                                      color: "#ffffff",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => {
                                      setIsChangingCode2(true);
                                      setNewCode2Input(editKod2Temp || "");
                                    }}
                                    title={editKod2Temp ? "Tukar Kod Kelas 2" : "Tetapkan Kod Kelas 2"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    border: "2px solid #0284c7",
                                    borderRadius: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      maxLength={8}
                                      placeholder="CTH: KLS2#01"
                                      value={newCode2Input}
                                      onChange={(e) => setNewCode2Input(e.target.value.toUpperCase())}
                                      style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "2px solid var(--color-dark)",
                                        fontSize: "1rem",
                                        fontWeight: "900",
                                        letterSpacing: "1.5px",
                                        fontFamily: "inherit",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="neo-btn bg-red"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => setIsChangingCode2(false)}
                                      title="Batal"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="neo-btn"
                                      style={{ width: "36px", height: "36px", padding: 0, minWidth: "36px", backgroundColor: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => {
                                        if (newCode2Input.trim().toUpperCase() === editKodTemp) {
                                          alert("Kod Kelas 2 tidak boleh sama dengan Kod Kelas 1!");
                                          return;
                                        }
                                        handleSaveClassCode2(newCode2Input);
                                      }}
                                      title="Gunakan Kod Ini"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "bold" }}>
                                    * Wajib 8 aksara & sekurang-kurangnya 1 simbol
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "900", color: "#64748b", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-lock" style={{ color: "#ef4444" }}></i>
                                <span>Kelas Kedua Terkunci (Versi Pro)</span>
                              </div>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>
                                Fungsi ini terhad untuk akaun Pro. Sila langgan pakej Pro untuk akses penuh.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                backgroundColor: "#ea580c",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                if (typeof (window as any).openPakejProModal === "function") {
                                  (window as any).openPakejProModal("guru");
                                } else {
                                  setIsProPricingModalOpen(true);
                                }
                              }}
                            >
                              <i className="fa-solid fa-crown"></i> Pro
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Ruangan Emel Guru (Read-only) */}
                      <div style={{ marginBottom: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Emel Guru</span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold", marginLeft: "4px" }}>
                            (Kekal / Tidak Boleh Diubah)
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            value={localStorage.getItem("bunyiKataGuruEmail") || "guru@moe.edu.my"}
                            disabled
                            readOnly
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "8px",
                              border: "2px solid #cbd5e1",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                              cursor: "not-allowed",
                            }}
                          />
                          <i
                            className="fa-solid fa-envelope"
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#94a3b8",
                            }}
                          ></i>
                        </div>
                      </div>

                      {/* Ruangan Kata Laluan Guru */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "6px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={labelHighlightStyle}>Kata Laluan Guru</span>
                        </div>
                        {!isChangingPassword ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "2px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                fontSize: "1rem",
                                letterSpacing: "3px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <i className="fa-solid fa-lock" style={{ fontSize: "0.85rem", color: "#94a3b8" }}></i>
                              ••••••••••••
                            </div>
                            <button
                              type="button"
                              className="neo-btn"
                              style={{
                                padding: "9px 12px",
                                fontSize: "0.86rem",
                                backgroundColor: headerBgColor,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => {
                                setIsChangingPassword(true);
                                setNewPasswordInput("");
                                setPasswordToast("");
                              }}
                            >
                              <i className="fa-solid fa-key"></i> Tukar Kata Laluan
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "2px solid var(--color-dark)",
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0 3px 0 var(--color-dark)",
                            }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <label style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>
                                Masukkan Kata Laluan Baharu:
                              </label>
                              <div style={{ position: "relative", width: "100%" }}>
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Cipta kata laluan baharu anda"
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "10px 42px 10px 12px",
                                    borderRadius: "8px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword((prev) => !prev)}
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: showNewPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                    padding: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1rem",
                                    zIndex: 2,
                                  }}
                                  title={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                  aria-label={showNewPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                >
                                  <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Batal"
                                aria-label="Batal"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  setNewPasswordInput("");
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <button
                                type="button"
                                className="neo-btn"
                                title="Simpan Kata Laluan"
                                aria-label="Simpan Kata Laluan"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  padding: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: headerBgColor,
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                  borderRadius: "8px",
                                  border: "2px solid var(--color-dark)",
                                  boxShadow: "0 2px 0 var(--color-dark)",
                                }}
                                onClick={() => {
                                  if (!newPasswordInput.trim()) {
                                    if ((window as any).showAppToast) {
                                      (window as any).showAppToast("Amaran", "Sila masukkan kata laluan baharu!", "warning");
                                    } else {
                                      alert("Sila masukkan kata laluan baharu!");
                                    }
                                    return;
                                  }
                                  setShowPasswordConfirmModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pop up Pengesahan Tukar Kata Laluan */}
                  {showPasswordConfirmModal && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.65)",
                        zIndex: 100000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                      }}
                    >
                      <div
                        className="neo-box"
                        style={{
                          backgroundColor: "#fef9ec",
                          maxWidth: "360px",
                          width: "92%",
                          padding: "24px 20px",
                          borderRadius: "20px",
                          textAlign: "center",
                          border: "3px solid var(--color-dark)",
                          boxShadow: "0 6px 0 var(--color-dark)",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: headerBgColor,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px auto",
                            fontSize: "1.3rem",
                            border: "2px solid var(--color-dark)",
                            boxShadow: "0 2px 0 var(--color-dark)",
                          }}
                        >
                          <i className="fa-solid fa-key"></i>
                        </div>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>
                          Sahkan Kata Laluan
                        </h4>
                        <p style={{ margin: "0 0 18px 0", fontSize: "0.88rem", color: "#64748b", lineHeight: "1.4" }}>
                          Adakah anda pasti mahu menyimpan kata laluan baharu ini?
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              flex: 1,
                              padding: "9px 12px",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.9rem",
                              justifyContent: "center",
                            }}
                            onClick={() => setShowPasswordConfirmModal(false)}
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            className="neo-btn"
                            style={{
                              flex: 1,
                              padding: "9px 12px",
                              backgroundColor: headerBgColor,
                              color: "#ffffff",
                              fontSize: "0.9rem",
                              justifyContent: "center",
                            }}
                            onClick={async () => {
                              const passToSave = newPasswordInput.trim();
                              if (isAdmin) {
                                localStorage.setItem("bunyiKataAdminPassword", passToSave);
                              } else if (isParent) {
                                localStorage.setItem("bunyiKataIbubapaPassword", passToSave);
                              } else {
                                localStorage.setItem("bunyiKataGuruPassword", passToSave);
                              }

                              try {
                                await updateUserPasswordInFirebase(passToSave);
                              } catch (err) {
                                console.warn("Firebase password sync:", err);
                              }

                              setShowPasswordConfirmModal(false);
                              setIsChangingPassword(false);
                              setNewPasswordInput("");
                              if ((window as any).showAppToast) {
                                (window as any).showAppToast("Kata Laluan Dikemaskini", "Kata laluan baharu anda telah berjaya disimpan ke pangkalan data!");
                              } else if (typeof setPasswordToast === "function") {
                                setPasswordToast("Kata laluan baharu berjaya disimpan!");
                              }
                            }}
                          >
                            Ya, Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAdmin ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editAdminNamaSistemTemp.trim()) {
                            setEditModalError("Sila lengkapkan ruangan Nama Sistem!");
                            return;
                          }
                          if (!editAdminNamaTemp.trim()) {
                            setEditModalError("Sila lengkapkan ruangan Nama Admin!");
                            return;
                          }

                          const namaSistem = editAdminNamaSistemTemp.trim().toUpperCase();
                          const namaAdmin = editAdminNamaTemp.trim().toUpperCase();
                          const codeTrimmed = editKodTemp.trim().toUpperCase();

                          localStorage.setItem("bunyiKataNamaSistem", namaSistem);
                          localStorage.setItem("bunyiKataNamaAdmin", namaAdmin);
                          localStorage.setItem("bunyiKataKodAdmin", codeTrimmed);
                          registerCodeInRegistry(codeTrimmed, "admin");

                          const kelasTitle = document.getElementById("admin-dashboard-nama-kelas-title");
                          if (kelasTitle) kelasTitle.innerText = namaSistem;
                          const guruTitle = document.getElementById("admin-dashboard-nama-guru-title");
                          if (guruTitle) guruTitle.innerText = namaAdmin;

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Admin telah berjaya disimpan!
                              </p>`
                            );
                          }
                        }}
                        title="Simpan Maklumat Admin"
                        aria-label="Simpan Maklumat Admin"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Admin</span>
                      </button>
                    </div>
                  ) : isGuru ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          const s = editSekolahTemp.trim().toUpperCase();
                          const g = editGuruTemp.trim().toUpperCase();
                          if (!s || !g) {
                            setEditModalError("Sila lengkapkan Nama Sekolah dan Nama Guru!");
                            return;
                          }

                          localStorage.setItem("bunyiKataNamaSekolah", s);
                          localStorage.setItem("bunyiKataNamaGuru", g);
                          localStorage.setItem("pdf_guru", g);
                          const sEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                          if (sEl) sEl.innerText = s;
                          const gEl = document.getElementById("guru-dashboard-nama-guru-title");
                          if (gEl) gEl.innerText = g;

                          try {
                            await updateTeacherSchoolAndNameInFirebase({
                              namaSekolah: s,
                              namaGuru: g,
                            });
                          } catch (err) {
                            console.warn("Firebase teacher update err:", err);
                          }

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Guru & Sekolah telah berjaya disimpan ke pangkalan data!
                              </p>`
                            );
                          } else if (typeof (window as any).showAppToast === "function") {
                            (window as any).showAppToast("Berjaya Disimpan", "Maklumat Guru & Sekolah berjaya disimpan!");
                          }
                        }}
                        title="Simpan Maklumat Guru"
                        aria-label="Simpan Maklumat Guru"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Guru</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          const f = editNamaKeluargaTemp.trim().toUpperCase();
                          if (!f) {
                            setEditModalError("Sila masukkan Nama Keluarga!");
                            return;
                          }

                          localStorage.setItem("bunyiKataNamaKeluarga", f);
                          const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                          if (famTitle) famTitle.innerText = f;

                          try {
                            await updateParentFamilyAndNameInFirebase({
                              namaKeluarga: f,
                            });
                          } catch (err) {
                            console.warn("Firebase parent update err:", err);
                          }

                          setEditModalError("");
                          setIsEditModalOpen(false);

                          if (typeof (window as any).showAppModalAlert === "function") {
                            (window as any).showAppModalAlert(
                              "Berjaya Disimpan",
                              `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                Maklumat Keluarga telah berjaya disimpan ke pangkalan data!
                              </p>`
                            );
                          } else if (typeof (window as any).showAppToast === "function") {
                            (window as any).showAppToast("Berjaya Disimpan", "Maklumat Keluarga berjaya disimpan!");
                          }
                        }}
                        title="Simpan Maklumat Keluarga"
                        aria-label="Simpan Maklumat Keluarga"
                        className="neo-btn"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: headerBgColor,
                          border: "2.5px solid var(--color-dark)",
                          boxShadow: "0 4px 0 var(--color-dark)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Maklumat Keluarga</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Modal Panduan 3D Bunyi Kata */}
          <AnimatePresence>
            {showVRGuideModal && (() => {
              const isBacaan = (window as any).vrCurrentMode === 'bacaan';
              const modalTitle = isBacaan ? '3D BACAAN BERGRED' : '3D BUNYI KATA';
              const modalDesc = isBacaan
                ? 'Terokai Muzium Bacaan Bergred dalam mod 3D! Lawati 5 dewan pameran: Dewan Ayat Pendek, Dewan Ayat Panjang, Galeri Petikan Tahap 1 & 2, dan Pavilion Cerita Pendek. Gunakan joystick atau seret skrin untuk bergerak.'
                : 'Terokai Muzium Bunyi Kata dalam mod 3D! Pusingkan peranti atau seret skrin untuk melihat 4 dinding pameran (Huruf Fonik, Huruf Kecil, Galeri Nombor Asas 0-10, dan Siri Nombor 10-100). Terokai pameran dengan gambar dan sebutan audio interaktif!';
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
          <AnimatePresence>
            {isEntryChoiceModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.65)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px",
                  boxSizing: "border-box",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsEntryChoiceModalOpen(false);
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="neo-box"
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    maxWidth: "430px",
                    width: "100%",
                    padding: "26px 20px",
                    textAlign: "center",
                    position: "relative",
                    borderRadius: "22px",
                    border: "3px solid var(--color-dark, #10182f)",
                    boxShadow: "0 6px 0 var(--color-dark, #10182f)",
                  }}
                >
                  <button
                    type="button"
                    className="neo-btn bg-red"
                    onClick={() => setIsEntryChoiceModalOpen(false)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      borderRadius: "10px",
                    }}
                    aria-label="Tutup"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div
                    className="neo-btn"
                    style={{
                      backgroundColor: "#168f81",
                      color: "white",
                      fontSize: "clamp(1.05rem, 3.8vw, 1.3rem)",
                      margin: "0 auto 12px auto",
                      display: "inline-block",
                      pointerEvents: "none",
                      padding: "8px 20px",
                      lineHeight: "1.2",
                      fontWeight: "900",
                      borderRadius: "12px",
                    }}
                  >
                    PILIH CARA MULA
                  </div>

                  <p
                    style={{
                      marginBottom: "18px",
                      fontSize: "0.92rem",
                      fontWeight: "bold",
                      color: "#334155",
                      lineHeight: "1.4",
                    }}
                  >
                    Pilih cara untuk memulakan pengembaraan membaca anda:
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Pilihan 1: Ada Kod Kelas / Keluarga */}
                    <button
                      type="button"
                      className="neo-box"
                      style={{
                        cursor: "pointer",
                        padding: "14px 16px",
                        backgroundColor: "#ffffff",
                        border: "3px solid var(--color-dark, #10182f)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        textAlign: "left",
                        width: "100%",
                      }}
                      onClick={() => {
                        if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                        setIsEntryChoiceModalOpen(false);
                        setIsCodeModalOpen(true);
                      }}
                    >
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "12px",
                          backgroundColor: "#f59e0b",
                          border: "2px solid var(--color-dark, #10182f)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#10182f",
                          fontSize: "1.3rem",
                          flexShrink: 0,
                        }}
                      >
                        <i className="fa-solid fa-key"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontWeight: "900", fontSize: "1rem", color: "#10182f" }}>
                            Ada Kod Kelas / Keluarga
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: "800",
                              color: "#ffffff",
                              backgroundColor: "#168f81",
                              padding: "2px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            PRO
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                          Masukkan kod kelas atau keluarga untuk akses penuh &amp; rekod markah.
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right" style={{ color: "#94a3b8", fontSize: "1rem" }}></i>
                    </button>

                    {/* Pilihan 2: Cuba Percuma */}
                    <button
                      type="button"
                      className="neo-box"
                      style={{
                        cursor: "pointer",
                        padding: "14px 16px",
                        backgroundColor: "#ffffff",
                        border: "3px solid var(--color-dark, #10182f)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        textAlign: "left",
                        width: "100%",
                      }}
                      onClick={() => {
                        setIsEntryChoiceModalOpen(false);
                        (window as any).isGuestMode = true;
                        (window as any).isAdminMode = false;
                        (window as any).modAdminAktif = false;
                        (window as any).modGuruAktif = false;
                        (window as any).modIbuBapaAktif = false;
                        (window as any).userAccessLevel = "trial";
                        (window as any).namaMuridAktif = "Tetamu";
                        setUserAccessLevel("trial");
                        setIsAdminActive(false);
                        localStorage.setItem("bunyiKataAccessLevel", "trial");
                        localStorage.removeItem("bunyiKataUserRole");
                        localStorage.setItem("muridAktif", "Tetamu");
                        localStorage.setItem("bunyiKataCurrentMurid", "Tetamu");

                        if (typeof (window as any).resetTrialGuestProgress === "function") {
                          (window as any).resetTrialGuestProgress();
                        }

                        if (typeof (window as any).bukaModalAppInfo === "function") {
                          (window as any).bukaModalAppInfo("murid");
                        } else if (typeof (window as any).masukModMurid === "function") {
                          (window as any).masukModMurid("Tetamu");
                        }
                      }}
                    >
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "12px",
                          backgroundColor: "#10b981",
                          border: "2px solid var(--color-dark, #10182f)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "1.3rem",
                          flexShrink: 0,
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontWeight: "900", fontSize: "1rem", color: "#10182f" }}>
                            Cuba Percuma
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: "800",
                              color: "#ffffff",
                              backgroundColor: "#f59e0b",
                              padding: "2px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            PERCUMA
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                          Terus main aktiviti Asas Bunyi Kata tanpa perlukan sebarang kod pendaftaran.
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right" style={{ color: "#94a3b8", fontSize: "1rem" }}></i>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Modal Kod Kelas/Keluarga */}
          <AnimatePresence>
            {isCodeModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="neo-box"
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    maxWidth: "400px",
                    width: "90%",
                    padding: "30px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <button
                    className="neo-btn bg-red"
                    onClick={() => setIsCodeModalOpen(false)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div
                    className="neo-btn"
                    style={{
                      backgroundColor: "#168f81",
                      color: "white",
                      fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                      margin: "0 auto 20px auto",
                      whiteSpace: "normal",
                      display: "inline-block",
                      pointerEvents: "none",
                      padding: "10px 20px",
                      lineHeight: "1.2",
                    }}
                  >
                    Masukkan Kod
                  </div>

                  <p
                    style={{
                      marginBottom: "16px",
                      fontSize: "clamp(1.05rem, 3vw, 1.2rem)",
                      fontWeight: "bold",
                      color: "#1e293b",
                      lineHeight: "1.4",
                    }}
                  >
                    Masukkan kod kelas atau keluarga untuk memuatkan profil.
                  </p>

                  {/* Nota format kod 8 aksara & simbol (Grey style & smaller font) */}
                  <div
                    style={{
                      backgroundColor: "#f1f5f9",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      marginBottom: "16px",
                      fontSize: "0.78rem",
                      color: "#475569",
                      textAlign: "left",
                      lineHeight: "1.35",
                    }}
                  >
                    <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px", color: "#334155" }}>
                      <i className="fa-solid fa-circle-info" style={{ fontSize: "0.85rem" }}></i> Format Kod:
                    </div>
                    <div>• Wajib <strong>8 aksara</strong></div>
                    <div>• Sekurang-kurangnya <strong>1 simbol</strong></div>
                    <div style={{ marginTop: "3px", fontSize: "0.74rem", color: "#64748b" }}>
                      <strong>Contoh Format:</strong> 8 aksara unik (cth: <code style={{ backgroundColor: "#e2e8f0", padding: "1px 4px", borderRadius: "4px" }}>ABCD@123</code>)
                    </div>
                  </div>

                  <input
                    type="text"
                    className="neo-input century-gothic-font"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "20px",
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                    placeholder="Masukkan Kod 8 Aksara"
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <button
                    className="neo-btn"
                    style={{
                      width: "100%",
                      padding: "12px",
                      color: "white",
                      fontSize: "1.1rem",
                      backgroundColor: "#168f81",
                      animation:
                        "outlineGlowGold 2.5s infinite, pulse-scale 2.5s infinite ease-in-out",
                    }}
                    onClick={async () => {
                      if (!joinCode.trim()) {
                        if (typeof (window as any).showAppModalAlert === "function") {
                          (window as any).showAppModalAlert(
                            "Kod Diperlukan",
                            `<p style="text-align:center; font-weight:bold; color:#ef4444; margin:10px 0;">
                              <i class="fa-solid fa-key" style="font-size:2.2rem; color:#ea580c; display:block; margin-bottom:8px;"></i>
                              Sila masukkan kod kelas atau keluarga terlebih dahulu.
                            </p>`
                          );
                        } else {
                          alert("Sila masukkan kod kelas atau keluarga!");
                        }
                        return;
                      }

                      const kodKeluarga =
                        localStorage.getItem("bunyiKataKodKeluarga") || "";
                      const kodKelas =
                        localStorage.getItem("bunyiKataKodKelas") || "";
                      const kodKelas2 =
                        localStorage.getItem("bunyiKataKodKelas2") || "";
                      const kodAdmin =
                        localStorage.getItem("bunyiKataKodAdmin") || "";

                      const entered = joinCode.trim().toUpperCase();
                      if (
                        entered === "ADMIN" ||
                        entered === "ADMIN#01" ||
                        entered === "ADMIN123" ||
                        entered === "ADMIN@123" ||
                        (kodAdmin && entered === kodAdmin.toUpperCase())
                      ) {
                        setIsCodeModalOpen(false);
                        setUserAccessLevel("pro");
                        localStorage.setItem("bunyiKataAccessLevel", "pro");
                        localStorage.setItem("bunyiKataUserRole", "admin");
                        (window as any).userAccessLevel = "pro";
                        (window as any).modAdminAktif = true;
                        (window as any).isAdminMode = true;
                        if (typeof (window as any).masukModAdmin === "function") {
                          (window as any).masukModAdmin();
                        }
                        if (typeof (window as any).showAppModalAlert === "function") {
                          (window as any).showAppModalAlert(
                            "Akses Admin Berjaya",
                            `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                              <i class="fa-solid fa-user-shield" style="font-size:2.2rem; color:#ea580c; display:block; margin-bottom:8px;"></i>
                              Selamat datang ke Panel Kawalan Pentadbir Bunyi Kata!
                            </p>`
                          );
                        }
                      } else if (
                        (kodKelas && entered === kodKelas.toUpperCase()) ||
                        (kodKelas2 && entered === kodKelas2.toUpperCase())
                      ) {
                        setUserAccessLevel("pro");
                        localStorage.setItem("bunyiKataAccessLevel", "pro");
                        (window as any).userAccessLevel = "pro";
                        setIsCodeModalOpen(false);
                        const modal = document.getElementById("modal-pilih-anak");
                        if (modal) {
                          modal.style.display = "flex";
                          if (
                            typeof (window as any).bukaModalPilihAnak ===
                            "function"
                          ) {
                            (window as any).bukaModalPilihAnak(false, true); // isStudentLogin
                          }
                        }
                        if (typeof (window as any).showAppModalAlert === "function") {
                          (window as any).showAppModalAlert(
                            "Kod Berjaya Disahkan",
                            `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                              <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                              Akses Kelas PRO berjaya disahkan! Sila pilih profil murid.
                            </p>`
                          );
                        }
                      } else if (
                        kodKeluarga &&
                        entered === kodKeluarga.toUpperCase()
                      ) {
                        setUserAccessLevel("pro");
                        localStorage.setItem("bunyiKataAccessLevel", "pro");
                        (window as any).userAccessLevel = "pro";
                        setIsCodeModalOpen(false);
                        const modal = document.getElementById("modal-pilih-anak");
                        if (modal) {
                          modal.style.display = "flex";
                          if (
                            typeof (window as any).bukaModalPilihAnak ===
                            "function"
                          ) {
                            (window as any).bukaModalPilihAnak(false, false); // normal mode (Mod Ibu Bapa)
                          }
                        }
                        if (typeof (window as any).showAppModalAlert === "function") {
                          (window as any).showAppModalAlert(
                            "Kod Berjaya Disahkan",
                            `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                              <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                              Akses Keluarga PRO berjaya disahkan! Sila pilih profil anak.
                            </p>`
                          );
                        }
                      } else {
                        // Semakan langsung dengan Firebase Realtime Database
                        try {
                          const cls = await getClassByCode(entered);
                          if (cls) {
                            setUserAccessLevel("pro");
                            localStorage.setItem("bunyiKataAccessLevel", "pro");
                            (window as any).userAccessLevel = "pro";
                            localStorage.setItem("bunyiKataKodKelas", cls.kod_kelas);
                            localStorage.setItem("bunyiKataNamaSekolah", cls.nama_sekolah);
                            if (cls.nama_guru) localStorage.setItem("bunyiKataNamaGuru", cls.nama_guru);
                            if (cls.nama_kelas) localStorage.setItem("bunyiKataNamaKelas", cls.nama_kelas);

                            try {
                              const remoteStudents = await getStudentsByClassId(cls.id);
                              if (remoteStudents && remoteStudents.length > 0) {
                                const names = remoteStudents.map((s: any) => s.nama);
                                localStorage.setItem("bunyiKataStudentNames", JSON.stringify(names));
                                if ((window as any).studentNames) {
                                  (window as any).studentNames = names;
                                }
                                if (typeof (window as any).updateStudentDropdown === "function") {
                                  (window as any).updateStudentDropdown();
                                }
                              }
                            } catch (syncErr) {
                              console.warn("Fetch class students notice:", syncErr);
                            }

                            setIsCodeModalOpen(false);
                            const modal = document.getElementById("modal-pilih-anak");
                            if (modal) {
                              modal.style.display = "flex";
                              if (typeof (window as any).bukaModalPilihAnak === "function") {
                                (window as any).bukaModalPilihAnak(false, true);
                              }
                            }
                            if (typeof (window as any).showAppModalAlert === "function") {
                              (window as any).showAppModalAlert(
                                "Kod Berjaya Disahkan",
                                `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                  <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                  Akses Kelas PRO (${cls.nama_kelas || 'Kelas'}) berjaya disahkan!
                                </p>`
                              );
                            }
                            return;
                          }

                          const fam = await getFamilyByCode(entered);
                          if (fam) {
                            setUserAccessLevel("pro");
                            localStorage.setItem("bunyiKataAccessLevel", "pro");
                            (window as any).userAccessLevel = "pro";
                            localStorage.setItem("bunyiKataKodKeluarga", fam.kod_keluarga);
                            localStorage.setItem("bunyiKataNamaKeluarga", fam.nama_keluarga);

                            try {
                              const remoteChildren = await getStudentsByFamilyId(fam.id);
                              if (remoteChildren && remoteChildren.length > 0) {
                                const names = remoteChildren.map((s: any) => s.nama);
                                localStorage.setItem("bunyiKataParentChildNames", JSON.stringify(names));
                                if ((window as any).parentChildNames) {
                                  (window as any).parentChildNames = names;
                                }
                                if (typeof (window as any).updateStudentDropdown === "function") {
                                  (window as any).updateStudentDropdown();
                                }
                              }
                            } catch (syncErr) {
                              console.warn("Fetch family children notice:", syncErr);
                            }

                            setIsCodeModalOpen(false);
                            const modal = document.getElementById("modal-pilih-anak");
                            if (modal) {
                              modal.style.display = "flex";
                              if (typeof (window as any).bukaModalPilihAnak === "function") {
                                (window as any).bukaModalPilihAnak(false, false);
                              }
                            }
                            if (typeof (window as any).showAppModalAlert === "function") {
                              (window as any).showAppModalAlert(
                                "Kod Berjaya Disahkan",
                                `<p style="text-align:center; font-weight:bold; color:#15803d; margin:10px 0;">
                                  <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; display:block; margin-bottom:8px;"></i>
                                  Akses Keluarga PRO (${fam.nama_keluarga || 'Keluarga'}) berjaya disahkan!
                                </p>`
                              );
                            }
                            return;
                          }
                        } catch (checkErr) {
                          console.warn("Database code validation warning:", checkErr);
                        }

                        if (typeof (window as any).showAppModalAlert === "function") {
                          (window as any).showAppModalAlert(
                            "Kod Tidak Sah",
                            `<p style="text-align:center; font-weight:bold; color:#ef4444; margin:10px 0;">
                              <i class="fa-solid fa-circle-exclamation" style="font-size:2.2rem; color:#ef4444; display:block; margin-bottom:8px;"></i>
                              Kod tidak sah. Sila pastikan kod 8 aksara yang dimasukkan adalah tepat seperti yang didaftarkan oleh Guru atau Ibu Bapa.
                            </p>`
                          );
                        } else {
                          alert("Kod tidak sah. Sila pastikan kod 8 aksara yang dimasukkan adalah tepat seperti yang didaftarkan oleh Guru atau Ibu Bapa.");
                        }
                      }
                    }}
                  >
                    Sahkan Kod
                  </button>

                  {/* Garisan Pemisah */}
                  <div
                    style={{
                      borderTop: "2px dashed #cbd5e1",
                      margin: "20px 0 16px 0",
                    }}
                  ></div>

                  {/* 2 Butang Mod: Guru & Ibubapa Bersebelahan */}
                  <div
                    style={{ display: "flex", gap: "10px", marginBottom: "16px" }}
                  >
                    <button
                      className="neo-btn bg-orange"
                      style={{
                        flex: 1,
                        padding: "10px",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "white",
                      }}
                      onClick={() => {
                        setIsCodeModalOpen(false);
                        setPendingLoginMode("guru");
                        setAuthModalTab("login");
                        setAuthModalError("");
                        setShowLoginModal(true);
                        setLoginEmail("");
                        setLoginPassword("");
                        setRegGuruNama("");
                        setRegGuruSekolah("");
                      }}
                    >
                      <i className="fa-solid fa-person-chalkboard"></i> Guru
                    </button>
                    <button
                      className="neo-btn bg-blue"
                      style={{
                        flex: 1,
                        padding: "10px",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "white",
                      }}
                      onClick={() => {
                        setIsCodeModalOpen(false);
                        setPendingLoginMode("ibubapa");
                        setAuthModalTab("login");
                        setAuthModalError("");
                        setShowLoginModal(true);
                        setLoginEmail("");
                        setLoginPassword("");
                        setRegNamaKeluarga("");
                      }}
                    >
                      <i className="fa-solid fa-users"></i> Ibubapa
                    </button>
                  </div>

                  {/* Teks Belum Ada Versi Pro */}
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#475569",
                      fontWeight: "bold",
                    }}
                  >
                    Belum ada versi Pro?{" "}
                    <span
                      style={{
                        color: "#0284c7",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsCodeModalOpen(false);
                        setIsModeMenuOpen(true);
                      }}
                    >
                      dapatkan di sini
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Log Masuk */}
          <AnimatePresence>
            {showLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  zIndex: 999999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="neo-box"
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    maxWidth: "780px",
                    width: "95%",
                    maxHeight: "92vh",
                    overflowY: "auto",
                    padding: "30px 24px 24px 24px",
                    position: "relative",
                    borderRadius: "24px",
                    textAlign: "left",
                  }}
                >
                  <button
                    className="neo-btn bg-red"
                    onClick={() => {
                      setShowLoginModal(false);
                      setAuthModalError("");
                    }}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div className="auth-split-modal-container">
                    {/* BAHAGIAN KIRI: Logo & Info Selamat Datang */}
                    <div className="auth-modal-left shiny-reveal">
                      <img
                        src="/images/sampingan/logo-login-screen.png"
                        alt="Logo Bunyi Kata"
                        className="auth-modal-left-logo glitch-logo"
                      />
                      <p className="auth-modal-left-desc">
                        {pendingLoginMode === "guru"
                          ? "Platform interaktif literasi awal Bahasa Melayu untuk guru membimbing murid menguasai kemahiran fonik, suku kata dan membaca secara seronok dan berkesan."
                          : pendingLoginMode === "ibubapa"
                            ? "Bimbing anak anda meneroka dunia membaca, fonik dan suku kata di rumah dengan aktiviti yang ceria, interaktif serta pantau kemajuan mereka!"
                            : "Portal pengurusan dan kawalan sistem aplikasi Bunyi Kata bagi pentadbiran modul dan akaun pengguna."}
                      </p>

                      <div className="auth-modal-badges">
                        {pendingLoginMode === "guru" ? (
                          <>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(249, 115, 22, 0.14)", color: "var(--color-orange)" }}>
                                <i className="fa-solid fa-chart-line"></i>
                              </div>
                              <span>Pantau Rekod &amp; Prestasi Murid</span>
                            </div>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(22, 143, 129, 0.14)", color: "#168f81" }}>
                                <i className="fa-solid fa-book-open-reader"></i>
                              </div>
                              <span>Aktiviti Fonik &amp; Bacaan Bergred</span>
                            </div>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(234, 179, 8, 0.18)", color: "#d97706" }}>
                                <i className="fa-solid fa-award"></i>
                              </div>
                              <span>Penjanaan Sijil &amp; Lencana</span>
                            </div>
                          </>
                        ) : pendingLoginMode === "ibubapa" ? (
                          <>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(59, 130, 246, 0.14)", color: "var(--color-blue)" }}>
                                <i className="fa-solid fa-shapes"></i>
                              </div>
                              <span>Aktiviti Interaktif &amp; Permainan Fonik</span>
                            </div>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.14)", color: "#10b981" }}>
                                <i className="fa-solid fa-chart-pie"></i>
                              </div>
                              <span>Pantau Kemajuan Bacaan Anak</span>
                            </div>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.18)", color: "#f59e0b" }}>
                                <i className="fa-solid fa-star"></i>
                              </div>
                              <span>Bintang Ceria &amp; Ganjaran Lencana</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(22, 143, 129, 0.14)", color: "#168f81" }}>
                                <i className="fa-solid fa-gears"></i>
                              </div>
                              <span>Kawalan Tetapan &amp; Modul Sistem</span>
                            </div>
                            <div className="auth-modal-badge-item">
                              <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(59, 130, 246, 0.14)", color: "var(--color-blue)" }}>
                                <i className="fa-solid fa-users-gear"></i>
                              </div>
                              <span>Pengurusan Akaun Guru &amp; Murid</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* GARIS PEMBAHAGI TENGAH */}
                    <div className="auth-modal-divider"></div>

                    {/* BAHAGIAN KANAN: Borang Log Masuk / Daftar */}
                    <div className="auth-modal-right">
                      {/* Header Badge */}
                      <div style={{ textAlign: "center", marginTop: "4px" }}>
                        <div
                          className="neo-btn"
                          style={{
                            backgroundColor:
                              pendingLoginMode === "guru"
                                ? "var(--color-orange)"
                                : pendingLoginMode === "ibubapa"
                                  ? "var(--color-blue)"
                                  : "#168f81",
                            color: "white",
                            fontSize: "clamp(1.05rem, 3.8vw, 1.25rem)",
                            margin: "0 auto 16px auto",
                            whiteSpace: "normal",
                            display: "inline-block",
                            pointerEvents: "none",
                            padding: "8px 20px",
                            lineHeight: "1.2",
                          }}
                        >
                          {authModalTab === "register" && pendingLoginMode !== "admin"
                            ? `Daftar Akaun ${pendingLoginMode === "guru" ? "Guru" : "Ibu Bapa"}`
                            : `Log Masuk ${
                                pendingLoginMode === "guru"
                                  ? "Guru"
                                  : pendingLoginMode === "ibubapa"
                                    ? "Ibu Bapa"
                                    : "Admin"
                              }`}
                        </div>
                      </div>

                      {/* Tab Selector (Log Masuk vs Daftar Akaun) */}
                      {pendingLoginMode !== "admin" && (
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "14px",
                            padding: "4px",
                            marginBottom: "16px",
                            border: "2px solid var(--color-dark)",
                            gap: "4px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalTab("login");
                              setAuthModalError("");
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 6px",
                              borderRadius: "10px",
                              border:
                                authModalTab === "login"
                                  ? "2px solid var(--color-dark)"
                                  : "2px solid transparent",
                              backgroundColor:
                                authModalTab === "login"
                                  ? pendingLoginMode === "guru"
                                    ? "var(--color-orange)"
                                    : "var(--color-blue)"
                                  : "transparent",
                              color: authModalTab === "login" ? "#ffffff" : "#475569",
                              fontWeight: "bold",
                              fontSize: "0.88rem",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                            }}
                          >
                            <i className="fa-solid fa-right-to-bracket"></i>
                            Log Masuk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalTab("register");
                              setAuthModalError("");
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 6px",
                              borderRadius: "10px",
                              border:
                                authModalTab === "register"
                                  ? "2px solid var(--color-dark)"
                                  : "2px solid transparent",
                              backgroundColor:
                                authModalTab === "register"
                                  ? pendingLoginMode === "guru"
                                    ? "var(--color-orange)"
                                    : "var(--color-blue)"
                                  : "transparent",
                              color: authModalTab === "register" ? "#ffffff" : "#475569",
                              fontWeight: "bold",
                              fontSize: "0.88rem",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                            }}
                          >
                            <i className="fa-solid fa-user-plus"></i>
                            Daftar Baru
                          </button>
                        </div>
                      )}

                      {/* Success Notification */}
                      {authSuccessMessage && (
                        <div
                          style={{
                            backgroundColor: "#f0fdf4",
                            border: "2px solid #22c55e",
                            color: "#15803d",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          <i className="fa-solid fa-circle-check" style={{ fontSize: "1.2rem", flexShrink: 0 }}></i>
                          <span>{authSuccessMessage}</span>
                        </div>
                      )}

                      {/* Error Notification */}
                      {authModalError && (
                        <div
                          style={{
                            backgroundColor: "#fef2f2",
                            border: "2px solid #ef4444",
                            color: "#b91c1c",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "1.2rem", flexShrink: 0 }}></i>
                          <span>{authModalError}</span>
                        </div>
                      )}

                      {/* FORM FIELDS */}
                      {authModalTab === "login" || pendingLoginMode === "admin" ? (
                        /* TAB LOG MASUK */
                        <>
                          <div style={{ marginBottom: "15px" }}>
                            <label
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontWeight: "bold",
                                color: "var(--color-dark)",
                                fontSize: "0.95rem",
                              }}
                            >
                              <span>Emel</span>
                              <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                            </label>
                            <input
                              type="email"
                              placeholder="Masukkan emel anda"
                              value={loginEmail}
                              disabled={isAuthLoading}
                              onChange={(e) => {
                                setLoginEmail(e.target.value);
                                if (authModalError) setAuthModalError("");
                              }}
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "10px",
                                border: "2px solid var(--color-dark)",
                                fontSize: "1rem",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>

                          <div style={{ marginBottom: "10px" }}>
                            <label
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontWeight: "bold",
                                color: "var(--color-dark)",
                                fontSize: "0.95rem",
                              }}
                            >
                              <span>Kata Laluan</span>
                              <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.2rem" }}>*</span>
                            </label>
                            <div style={{ position: "relative", width: "100%" }}>
                              <input
                                type={showLoginPassword ? "text" : "password"}
                                placeholder="Masukkan kata laluan"
                                value={loginPassword}
                                disabled={isAuthLoading}
                                onChange={(e) => {
                                  setLoginPassword(e.target.value);
                                  if (authModalError) setAuthModalError("");
                                }}
                                style={{
                                  width: "100%",
                                  padding: "12px 46px 12px 12px",
                                  borderRadius: "10px",
                                  border: "2px solid var(--color-dark)",
                                  fontSize: "1rem",
                                  fontFamily: "inherit",
                                  boxSizing: "border-box",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPassword((prev) => !prev)}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: showLoginPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                  padding: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.1rem",
                                  zIndex: 2,
                                }}
                                title={showLoginPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                aria-label={showLoginPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                              >
                                <i className={`fa-solid ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                          </div>

                          <div style={{ textAlign: "right", marginBottom: "20px" }}>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                color: "#0284c7",
                                fontWeight: "bold",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                padding: "0",
                              }}
                              onClick={async () => {
                                const emailToSend =
                                  loginEmail.trim() ||
                                  window.prompt(
                                    "Sila masukkan alamat emel berdaftar anda untuk menerima pautan penetapan semula kata laluan:"
                                  );
                                if (!emailToSend || !emailToSend.trim()) return;

                                setIsAuthLoading(true);
                                try {
                                  const res = await sendPasswordResetEmail(emailToSend.trim());
                                  if (res.success) {
                                    alert(
                                      `Pautan penetapan semula kata laluan telah dihantar ke: ${emailToSend.trim()}\n\nSila semak peti masuk (Inbox / Spam) emel anda.`
                                    );
                                  } else {
                                    alert(`Ralat: ${res.message}`);
                                  }
                                } catch (err: any) {
                                  alert(
                                    "Gagal menghantar pautan reset kata laluan: " +
                                      (err?.message || "")
                                  );
                                } finally {
                                  setIsAuthLoading(false);
                                }
                              }}
                            >
                              Lupa kata laluan?
                            </button>
                          </div>

                          <button
                            className="neo-btn"
                            disabled={isAuthLoading}
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "1.1rem",
                              padding: "12px",
                              backgroundColor:
                                pendingLoginMode === "guru"
                                  ? "var(--color-orange)"
                                  : pendingLoginMode === "ibubapa"
                                    ? "var(--color-blue)"
                                    : "#168f81",
                              color: "#ffffff",
                              opacity: isAuthLoading ? 0.7 : 1,
                              cursor: isAuthLoading ? "not-allowed" : "pointer",
                            }}
                            onClick={async () => {
                              if (!loginEmail.trim() || !loginPassword.trim()) {
                                setAuthModalError("Sila masukkan emel dan kata laluan!");
                                return;
                              }
                              setIsAuthLoading(true);
                              setAuthModalError("");
                              setAuthSuccessMessage("");

                              try {
                                const res = await loginWithEmail(loginEmail, loginPassword);
                                if (!res.success) {
                                  setAuthModalError(res.message);
                                  setIsAuthLoading(false);
                                  return;
                                }

                                const user = res.user;
                                const role = user?.peranan || pendingLoginMode || "guru";
                                localStorage.setItem("bunyiKataUserRole", role);

                                if (user) {
                                  (window as any).currentUser = user;
                                  if (user.id) localStorage.setItem("bunyiKataUserId", user.id);
                                  if (user.tarikh_tamat) {
                                    localStorage.setItem("bunyiKataTarikhTamat", user.tarikh_tamat);
                                  } else {
                                    localStorage.removeItem("bunyiKataTarikhTamat");
                                  }
                                  const isPaid = !!(user.langganan &&
                                    user.langganan.toLowerCase() !== "percuma" &&
                                    (!user.tarikh_tamat || new Date(user.tarikh_tamat) > new Date()));
                                  const accessLevel: "trial" | "pro" = isPaid ? "pro" : "trial";
                                  setUserAccessLevel(accessLevel);
                                  localStorage.setItem("bunyiKataAccessLevel", accessLevel);
                                  const planName = isPaid ? (user.langganan || "1 Bulan") : "Percuma";
                                  if (role === "ibubapa") {
                                    localStorage.setItem("bunyiKataParentPlan", planName);
                                  } else {
                                    localStorage.setItem("bunyiKataTeacherPlan", planName);
                                    setTeacherPlanName(planName);
                                  }
                                }

                                if (role === "guru") {
                                  const gName = user?.nama || "GURU";
                                  const gSekolah =
                                    user?.nama_sekolah ||
                                    localStorage.getItem("bunyiKataNamaSekolah") ||
                                    "";
                                  const newEmail = user?.email || loginEmail;
                                  const prevTeacher = localStorage.getItem("bunyiKataGuruEmail");
                                  if (!prevTeacher || prevTeacher.toLowerCase() !== newEmail.toLowerCase()) {
                                    localStorage.setItem("bunyiKataStudentNames", "[]");
                                    localStorage.setItem("bunyiKataStudentData", "{}");
                                    localStorage.setItem("bunyiKataDaftarKelas", "[]");
                                    localStorage.removeItem("bunyiKataNamaKelas");
                                    (window as any).studentNames = [];
                                    (window as any).studentData = {};
                                  }

                                  localStorage.setItem("bunyiKataNamaGuru", gName);
                                  localStorage.setItem("pdf_guru", gName);
                                  localStorage.setItem("bunyiKataNamaSekolah", gSekolah);
                                  localStorage.setItem("bunyiKataGuruEmail", newEmail);
                                  localStorage.setItem("bunyiKataGuruSetupDone", "true");

                                  // Bersihkan kunci peranan ibu bapa yang tersisa
                                  localStorage.removeItem("bunyiKataNamaKeluarga");
                                  localStorage.removeItem("bunyiKataKodKeluarga");
                                  localStorage.removeItem("bunyiKataParentChildNames");
                                  localStorage.removeItem("ibubapaAnakTerpilih");
                                  localStorage.removeItem("bunyiKataIbubapaEmail");

                                  try {
                                    const existingTeachers = JSON.parse(localStorage.getItem("bunyiKataAdminTeachers") || "[]");
                                    if (!existingTeachers.some((t: any) => t.id === res.user?.id || (t.email && t.email.toLowerCase() === newEmail))) {
                                      existingTeachers.unshift({
                                        id: res.user?.id || ("g_" + Date.now()),
                                        nama: gName,
                                        sekolah: gSekolah || "-",
                                        nama_kelas: "",
                                        kod_kelas: "",
                                        murid: 0,
                                        bakiHari: isPaid ? 30 : 0,
                                        langganan: isPaid ? (user?.langganan || "1 Bulan (Pro)") : "Percuma",
                                        email: newEmail,
                                        no_telefon: "",
                                        dicipta_pada: new Date().toISOString()
                                      });
                                      localStorage.setItem("bunyiKataAdminTeachers", JSON.stringify(existingTeachers));
                                    }
                                  } catch (e) {}

                                  const guruEl = document.getElementById("guru-dashboard-nama-guru-title");
                                  if (guruEl) guruEl.innerText = gName;
                                  const sekolahEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                                  if (sekolahEl) sekolahEl.innerText = gSekolah;

                                  setShowLoginModal(false);
                                  syncTeacherSessionFromFirebase(res.user?.id || newEmail).catch(console.warn);
                                  (window as any).masukModGuru && (window as any).masukModGuru();
                                } else if (role === "ibubapa") {
                                  const famName = user?.nama || "KELUARGA";
                                  const newEmail = user?.email || loginEmail;

                                  // Bersihkan kunci peranan guru yang tersisa
                                  localStorage.removeItem("bunyiKataNamaGuru");
                                  localStorage.removeItem("pdf_guru");
                                  localStorage.removeItem("bunyiKataNamaSekolah");
                                  localStorage.removeItem("bunyiKataKodKelas");
                                  localStorage.removeItem("bunyiKataKodKelas2");
                                  localStorage.removeItem("bunyiKataNamaKelas");
                                  localStorage.removeItem("bunyiKataNamaKelas2");
                                  localStorage.removeItem("bunyiKataGuruEmail");

                                  const prevParent = localStorage.getItem("bunyiKataIbubapaEmail");
                                  if (!prevParent || prevParent.toLowerCase() !== newEmail.toLowerCase()) {
                                    localStorage.setItem("bunyiKataParentChildNames", "[]");
                                    localStorage.removeItem("ibubapaAnakTerpilih");
                                    (window as any).parentChildNames = [];
                                    (window as any).anakTerpilih = "";
                                  }

                                  localStorage.setItem("bunyiKataNamaKeluarga", famName);
                                  localStorage.setItem("bunyiKataIbubapaEmail", newEmail);

                                  const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                                  if (famTitle) famTitle.innerText = famName;

                                  setShowLoginModal(false);
                                  syncParentSessionFromFirebase(res.user?.id || newEmail).catch(console.warn);
                                  (window as any).bukaModalPilihAnak && (window as any).bukaModalPilihAnak();
                                } else if (role === "admin") {
                                  setUserAccessLevel("pro");
                                  localStorage.setItem("bunyiKataAccessLevel", "pro");
                                  localStorage.setItem("bunyiKataUserRole", "admin");
                                  (window as any).userAccessLevel = "pro";
                                  (window as any).modAdminAktif = true;
                                  (window as any).isAdminMode = true;
                                  setShowLoginModal(false);
                                  (window as any).masukModAdmin && (window as any).masukModAdmin();
                                } else {
                                  setShowLoginModal(false);
                                  (window as any).bukaModalAppInfo &&
                                    (window as any).bukaModalAppInfo(pendingLoginMode);
                                }
                              } catch (err: any) {
                                setAuthModalError(err?.message || "Ralat tidak dijangka semasa log masuk.");
                              } finally {
                                setIsAuthLoading(false);
                              }
                            }}
                          >
                            {isAuthLoading ? (
                              <>
                                <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: "8px" }}></i>
                                Sedang Memproses...
                              </>
                            ) : (
                              <>
                                Log Masuk{" "}
                                <i
                                  className="fa-solid fa-right-to-bracket"
                                  style={{ marginLeft: "8px" }}
                                ></i>
                              </>
                            )}
                          </button>

                          {pendingLoginMode !== "admin" && (
                            <div
                              style={{
                                textAlign: "center",
                                marginTop: "16px",
                                fontSize: "0.88rem",
                                color: "#475569",
                              }}
                            >
                              Belum mempunyai akaun?{" "}
                              <button
                                type="button"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color:
                                    pendingLoginMode === "guru"
                                      ? "var(--color-orange)"
                                      : "var(--color-blue)",
                                  fontWeight: "bold",
                                  fontSize: "0.88rem",
                                  cursor: "pointer",
                                  padding: "0",
                                  textDecoration: "underline",
                                }}
                                onClick={() => {
                                  setAuthModalTab("register");
                                  setAuthModalError("");
                                }}
                              >
                                Daftar Akaun Baru
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        /* TAB DAFTAR AKAUN */
                        <>
                          {pendingLoginMode === "guru" ? (
                            /* REGISTER GURU FIELDS */
                            <>
                              <div style={{ marginBottom: "12px" }}>
                                <label
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                    fontWeight: "bold",
                                    color: "var(--color-dark)",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  <span>Nama Guru</span>
                                  <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.1rem" }}>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Contoh: Cikgu Sarah / En. Razak"
                                  value={regGuruNama}
                                  onChange={(e) => {
                                    setRegGuruNama(e.target.value);
                                    if (authModalError) setAuthModalError("");
                                  }}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>

                              <div style={{ marginBottom: "12px" }}>
                                <label
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                    fontWeight: "bold",
                                    color: "var(--color-dark)",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  <span>Nama Sekolah</span>
                                  <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.1rem" }}>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Contoh: SK Taman Melati"
                                  value={regGuruSekolah}
                                  onChange={(e) => {
                                    setRegGuruSekolah(e.target.value);
                                    if (authModalError) setAuthModalError("");
                                  }}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            /* REGISTER IBU BAPA FIELDS */
                            <div style={{ marginBottom: "12px" }}>
                              <label
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "6px",
                                  fontWeight: "bold",
                                  color: "var(--color-dark)",
                                  fontSize: "0.9rem",
                                }}
                              >
                                  <span>Nama Keluarga</span>
                                  <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.1rem" }}>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Contoh: Keluarga Azman / Pn. Siti"
                                  value={regNamaKeluarga}
                                  onChange={(e) => {
                                    setRegNamaKeluarga(e.target.value);
                                    if (authModalError) setAuthModalError("");
                                  }}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--color-dark)",
                                    fontSize: "0.95rem",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                            )}

                          <div style={{ marginBottom: "12px" }}>
                            <label
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontWeight: "bold",
                                color: "var(--color-dark)",
                                fontSize: "0.9rem",
                              }}
                            >
                              <span>Emel</span>
                              <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.1rem" }}>*</span>
                            </label>
                            <input
                              type="email"
                              placeholder={
                                pendingLoginMode === "guru"
                                  ? "Contoh: guru@moe.edu.my"
                                  : "Contoh: ibubapa@gmail.com"
                              }
                              value={loginEmail}
                              disabled={isAuthLoading}
                              onChange={(e) => {
                                setLoginEmail(e.target.value);
                                if (authModalError) setAuthModalError("");
                              }}
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "10px",
                                border: "2px solid var(--color-dark)",
                                fontSize: "0.95rem",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>

                          <div style={{ marginBottom: "18px" }}>
                            <label
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                                fontWeight: "bold",
                                color: "var(--color-dark)",
                                fontSize: "0.9rem",
                              }}
                            >
                              <span>Kata Laluan</span>
                              <span style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.1rem" }}>*</span>
                            </label>
                            <div style={{ position: "relative", width: "100%" }}>
                              <input
                                type={showRegisterPassword ? "text" : "password"}
                                placeholder="Cipta kata laluan anda (min 6 aksara)"
                                value={loginPassword}
                                disabled={isAuthLoading}
                                onChange={(e) => {
                                  setLoginPassword(e.target.value);
                                  if (authModalError) setAuthModalError("");
                                }}
                                style={{
                                  width: "100%",
                                  padding: "10px 44px 10px 12px",
                                  borderRadius: "10px",
                                  border: "2px solid var(--color-dark)",
                                  fontSize: "0.95rem",
                                  fontFamily: "inherit",
                                  boxSizing: "border-box",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegisterPassword((prev) => !prev)}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: showRegisterPassword ? "var(--color-orange, #ea580c)" : "#64748b",
                                  padding: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.05rem",
                                  zIndex: 2,
                                }}
                                title={showRegisterPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                                aria-label={showRegisterPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"}
                              >
                                <i className={`fa-solid ${showRegisterPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                          </div>

                          <button
                            className="neo-btn"
                            disabled={isAuthLoading}
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "1.05rem",
                              padding: "12px",
                              backgroundColor:
                                pendingLoginMode === "guru"
                                  ? "var(--color-orange)"
                                  : "var(--color-blue)",
                              color: "#ffffff",
                              opacity: isAuthLoading ? 0.7 : 1,
                              cursor: isAuthLoading ? "not-allowed" : "pointer",
                            }}
                            onClick={async () => {
                              if (pendingLoginMode === "guru") {
                                if (!regGuruNama.trim()) {
                                  setAuthModalError("Sila masukkan Nama Guru!");
                                  return;
                                }
                                if (!regGuruSekolah.trim()) {
                                  setAuthModalError("Sila masukkan Nama Sekolah!");
                                  return;
                                }
                                if (!loginEmail.trim() || !loginPassword.trim()) {
                                  setAuthModalError("Sila masukkan Emel dan Kata Laluan!");
                                  return;
                                }
                                if (loginPassword.length < 6) {
                                  setAuthModalError("Kata laluan mestilah sekurang-kurangnya 6 aksara.");
                                  return;
                                }

                                setIsAuthLoading(true);
                                setAuthModalError("");
                                setAuthSuccessMessage("");

                                try {
                                  const cleanCheckEmail = loginEmail.trim().toLowerCase();
                                  try {
                                    const existingParents = JSON.parse(localStorage.getItem("bunyiKataAdminParents") || "[]");
                                    if (existingParents.some((p: any) => p.email && p.email.toLowerCase() === cleanCheckEmail)) {
                                      setAuthModalError(`Emel '${cleanCheckEmail}' telah pun didaftarkan untuk Mod Ibu Bapa. 1 emel hanya untuk 1 akaun sahaja. Sila gunakan 'Log Masuk'.`);
                                      setIsAuthLoading(false);
                                      return;
                                    }
                                  } catch (e) {}

                                  const res = await registerWithEmail({
                                    email: loginEmail,
                                    password: loginPassword,
                                    nama: regGuruNama.trim(),
                                    peranan: "guru",
                                    nama_sekolah: regGuruSekolah.trim(),
                                  });

                                  if (!res.success) {
                                    setAuthModalError(res.message);
                                    setIsAuthLoading(false);
                                    return;
                                  }

                                  if (res.user) {
                                    (window as any).currentUser = res.user;
                                    if (res.user.id) localStorage.setItem("bunyiKataUserId", res.user.id);
                                    setUserAccessLevel("trial");
                                    localStorage.setItem("bunyiKataAccessLevel", "trial");
                                    localStorage.setItem("bunyiKataTeacherPlan", "Percuma");
                                    setTeacherPlanName("Percuma");
                                  }

                                  const gName = regGuruNama.trim().toUpperCase();
                                  const gSekolah = regGuruSekolah.trim().toUpperCase();
                                  const gEmail = loginEmail.trim().toLowerCase();

                                  localStorage.setItem("bunyiKataNamaGuru", gName);
                                  localStorage.setItem("pdf_guru", gName);
                                  localStorage.setItem("bunyiKataNamaSekolah", gSekolah);
                                  localStorage.setItem("bunyiKataGuruEmail", gEmail);
                                  localStorage.setItem("bunyiKataGuruSetupDone", "true");

                                  // Kosongkan sebarang data murid/kelas terdahulu bagi akaun guru baharu
                                  localStorage.setItem("bunyiKataStudentNames", "[]");
                                  localStorage.setItem("bunyiKataStudentData", "{}");
                                  localStorage.setItem("bunyiKataDaftarKelas", "[]");
                                  localStorage.removeItem("bunyiKataNamaKelas");
                                  localStorage.removeItem("bunyiKataNamaKelas2");
                                  localStorage.removeItem("bunyiKataKodKelas");
                                  localStorage.removeItem("bunyiKataKodKelas2");
                                  (window as any).studentNames = [];
                                  (window as any).studentData = {};

                                  try {
                                    const existingTeachers = JSON.parse(localStorage.getItem("bunyiKataAdminTeachers") || "[]");
                                    if (!existingTeachers.some((t: any) => t.id === res.user?.id || (t.email && t.email.toLowerCase() === gEmail))) {
                                      existingTeachers.unshift({
                                        id: res.user?.id || ("g_" + Date.now()),
                                        nama: gName,
                                        sekolah: gSekolah || "-",
                                        nama_kelas: "",
                                        kod_kelas: "",
                                        murid: 0,
                                        bakiHari: 0,
                                        langganan: "Percuma",
                                        email: gEmail,
                                        no_telefon: "",
                                        dicipta_pada: new Date().toISOString()
                                      });
                                      localStorage.setItem("bunyiKataAdminTeachers", JSON.stringify(existingTeachers));
                                    }
                                  } catch (e) {}

                                  const guruEl = document.getElementById("guru-dashboard-nama-guru-title");
                                  if (guruEl) guruEl.innerText = gName;
                                  const sekolahEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                                  if (sekolahEl) sekolahEl.innerText = gSekolah;

                                  if (res.session) {
                                    setShowLoginModal(false);
                                    (window as any).masukModGuru && (window as any).masukModGuru();
                                    setTimeout(() => {
                                      setIsMandatorySetup(true);
                                      setEditModalMode("guru");
                                      if (typeof (window as any).bukaSetupModal === "function") {
                                        (window as any).bukaSetupModal("guru");
                                      } else {
                                        setIsEditModalOpen(true);
                                      }
                                    }, 350);
                                  } else {
                                    setAuthSuccessMessage(
                                      res.message || "Akaun berjaya didaftarkan ke pangkalan data Firebase!"
                                    );
                                    setAuthModalTab("login");
                                  }
                                } catch (err: any) {
                                  setAuthModalError(err?.message || "Ralat tidak dijangka semasa pendaftaran.");
                                } finally {
                                  setIsAuthLoading(false);
                                }
                              } else if (pendingLoginMode === "ibubapa") {
                                if (!regNamaKeluarga.trim()) {
                                  setAuthModalError("Sila masukkan Nama Keluarga!");
                                  return;
                                }
                                if (!loginEmail.trim() || !loginPassword.trim()) {
                                  setAuthModalError("Sila masukkan Emel dan Kata Laluan!");
                                  return;
                                }
                                if (loginPassword.length < 6) {
                                  setAuthModalError("Kata laluan mestilah sekurang-kurangnya 6 aksara.");
                                  return;
                                }

                                setIsAuthLoading(true);
                                setAuthModalError("");
                                setAuthSuccessMessage("");

                                try {
                                  const cleanCheckEmail = loginEmail.trim().toLowerCase();
                                  try {
                                    const existingTeachers = JSON.parse(localStorage.getItem("bunyiKataAdminTeachers") || "[]");
                                    if (existingTeachers.some((t: any) => t.email && t.email.toLowerCase() === cleanCheckEmail)) {
                                      setAuthModalError(`Emel '${cleanCheckEmail}' telah pun didaftarkan untuk Mod Guru. 1 emel hanya untuk 1 akaun sahaja. Sila gunakan 'Log Masuk'.`);
                                      setIsAuthLoading(false);
                                      return;
                                    }
                                  } catch (e) {}

                                  const res = await registerWithEmail({
                                    email: loginEmail,
                                    password: loginPassword,
                                    nama: regNamaKeluarga.trim(),
                                    peranan: "ibubapa",
                                  });

                                  if (!res.success) {
                                    setAuthModalError(res.message);
                                    setIsAuthLoading(false);
                                    return;
                                  }

                                  if (res.user) {
                                    (window as any).currentUser = res.user;
                                    if (res.user.id) localStorage.setItem("bunyiKataUserId", res.user.id);
                                    setUserAccessLevel("trial");
                                    localStorage.setItem("bunyiKataAccessLevel", "trial");
                                  }

                                  const famName = regNamaKeluarga.trim().toUpperCase();
                                  const pEmail = loginEmail.trim().toLowerCase();

                                  localStorage.setItem("bunyiKataNamaKeluarga", famName);
                                  localStorage.setItem("bunyiKataIbubapaEmail", pEmail);

                                  // Kosongkan senarai anak & kod terdahulu bagi akaun ibu bapa baharu
                                  localStorage.setItem("bunyiKataParentChildNames", "[]");
                                  localStorage.removeItem("ibubapaAnakTerpilih");
                                  localStorage.removeItem("bunyiKataKodKeluarga");
                                  (window as any).parentChildNames = [];
                                  (window as any).anakTerpilih = "";

                                  try {
                                    const existingParents = JSON.parse(localStorage.getItem("bunyiKataAdminParents") || "[]");
                                    if (!existingParents.some((p: any) => p.id === res.user?.id || (p.email && p.email.toLowerCase() === pEmail))) {
                                      existingParents.unshift({
                                        id: res.user?.id || ("p_" + Date.now()),
                                        nama: famName,
                                        nama_keluarga: famName,
                                        kod_keluarga: "",
                                        anak: 0,
                                        bakiHari: 0,
                                        langganan: "Percuma",
                                        email: pEmail,
                                        no_telefon: "",
                                        dicipta_pada: new Date().toISOString()
                                      });
                                      localStorage.setItem("bunyiKataAdminParents", JSON.stringify(existingParents));
                                    }
                                  } catch (e) {}

                                  const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                                  if (famTitle) famTitle.innerText = famName;

                                  if (res.session) {
                                    setShowLoginModal(false);
                                    (window as any).masukModIbubapa && (window as any).masukModIbubapa();
                                    setTimeout(() => {
                                      setIsMandatorySetup(true);
                                      setEditModalMode("ibubapa");
                                      if (typeof (window as any).bukaSetupModal === "function") {
                                        (window as any).bukaSetupModal("ibubapa");
                                      } else {
                                        setIsEditModalOpen(true);
                                      }
                                    }, 350);
                                  } else {
                                    setAuthSuccessMessage(
                                      res.message || "Akaun berjaya didaftarkan ke pangkalan data Firebase!"
                                    );
                                    setAuthModalTab("login");
                                  }
                                } catch (err: any) {
                                  setAuthModalError(err?.message || "Ralat tidak dijangka semasa pendaftaran.");
                                } finally {
                                  setIsAuthLoading(false);
                                }
                              }
                            }}
                          >
                            {isAuthLoading ? (
                              <>
                                <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: "8px" }}></i>
                                Sedang Mendaftar...
                              </>
                            ) : (
                              <>
                                Daftar Akaun {pendingLoginMode === "guru" ? "Guru" : "Ibu Bapa"}{" "}
                                <i
                                  className="fa-solid fa-user-check"
                                  style={{ marginLeft: "8px" }}
                                ></i>
                              </>
                            )}
                          </button>

                          <div
                            style={{
                              textAlign: "center",
                              marginTop: "16px",
                              fontSize: "0.88rem",
                              color: "#475569",
                            }}
                          >
                            Sudah mempunyai akaun?{" "}
                            <button
                              type="button"
                              style={{
                                background: "none",
                                border: "none",
                                color:
                                  pendingLoginMode === "guru"
                                    ? "var(--color-orange)"
                                    : "var(--color-blue)",
                                fontWeight: "bold",
                                fontSize: "0.88rem",
                                cursor: "pointer",
                                padding: "0",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                setAuthModalTab("login");
                                setAuthModalError("");
                              }}
                            >
                              Log Masuk di sini
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Pilih Mod -> Pakej Bunyi Kata */}
          <AnimatePresence>
            {(isModeMenuOpen || isProPricingModalOpen) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 999999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px",
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="neo-box"
                  style={{
                    backgroundColor: "#fef9ec",
                    backgroundImage:
                      "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
                    backgroundSize: "15px 15px",
                    maxWidth: "840px",
                    width: "100%",
                    maxHeight: "92vh",
                    overflowY: "auto",
                    padding: "20px 16px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <button
                    className="neo-btn bg-red"
                    onClick={() => {
                      setIsModeMenuOpen(false);
                      setIsProPricingModalOpen(false);
                    }}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div
                    className="neo-btn"
                    style={{
                      backgroundColor: "#168f81",
                      color: "white",
                      fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
                      margin: "0 auto 16px auto",
                      whiteSpace: "normal",
                      display: "inline-block",
                      pointerEvents: "none",
                      padding: "8px 22px",
                      lineHeight: "1.2",
                      fontWeight: "bold",
                    }}
                  >
                    Pakej Pro Bunyi Kata
                  </div>

                  {/* Category Selector Tabs */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
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
                        color:
                          activePakejCategory === "guru"
                            ? "white"
                            : "var(--color-dark)",
                        border: "2.5px solid var(--color-dark)",
                      }}
                      onClick={() => setActivePakejCategory("guru")}
                    >
                      <i className="fa-solid fa-person-chalkboard"></i> Pakej Guru
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
                        color:
                          activePakejCategory === "ibubapa"
                            ? "white"
                            : "var(--color-dark)",
                        border: "2.5px solid var(--color-dark)",
                      }}
                      onClick={() => setActivePakejCategory("ibubapa")}
                    >
                      <i className="fa-solid fa-users"></i> Pakej Ibu Bapa
                    </button>
                  </div>

                  {/* Offer Cards Grid */}
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
                          <h3
                            style={{
                              fontSize: "1.15rem",
                              margin: "0 0 4px 0",
                              color: "var(--color-dark)",
                              fontWeight: "bold",
                            }}
                          >
                            Bulanan Pro
                          </h3>

                          {/* Original price strikethrough animation & discount badge */}
                          <div className="original-price-box" style={{ marginBottom: "4px" }}>
                            <span className="original-price-strike">RM99</span>
                            <span className="discount-tag-badge">-85% OFF</span>
                          </div>

                          {/* Animasi Masa Sahaja */}
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
                              <i className="fa-solid fa-hourglass-half"></i>
                            </span>
                            <span
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "900",
                                color: "#e11d48",
                                letterSpacing: "0.6px",
                                fontFamily: "monospace",
                              }}
                            >
                              {formatPromoTimer(promoSecondsLeft)}
                            </span>
                          </div>

                          <div
                            className="price-tag"
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: "900",
                              color: "#0f766e",
                              marginBottom: "10px",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            RM15{" "}
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#475569",
                                fontWeight: "bold",
                              }}
                            >
                              / bulan
                            </span>
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
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>2 Kelas Serentak</b> (Sehingga 80 murid)</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>2 Kod Kelas</b> Unik</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span>Muat Turun Laporan &amp; Sijil (2 Kelas)</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Sehingga 3 Profil Anak</b> Serentak</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Kod Keluarga Khas</b> untuk 3 Anak</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
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
                          onClick={() => {
                            setIsModeMenuOpen(false);
                            setIsProPricingModalOpen(false);
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              setPendingLoginMode(activePakejCategory);
                              setAuthModalTab("register");
                              setAuthModalError("");
                              setShowLoginModal(true);
                              setLoginEmail("");
                              setLoginPassword("");
                              setRegGuruNama("");
                              setRegGuruSekolah("");
                              setRegNamaKeluarga("");
                            }
                          }}
                        >
                          Daftar
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
                          <h3
                            style={{
                              fontSize: "1.15rem",
                              margin: "0 0 4px 0",
                              color: "var(--color-dark)",
                              fontWeight: "bold",
                            }}
                          >
                            3 Bulanan Pro
                          </h3>

                          {/* Original price strikethrough animation & discount badge */}
                          <div className="original-price-box" style={{ marginBottom: "4px" }}>
                            <span className="original-price-strike">RM150</span>
                            <span className="discount-tag-badge">-73% OFF</span>
                          </div>

                          <div
                            className="price-tag"
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: "900",
                              color: "#0f766e",
                              marginBottom: "10px",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            RM40{" "}
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#475569",
                                fontWeight: "bold",
                              }}
                            >
                              / 3 bulan
                            </span>
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
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>2 Kelas Serentak</b> (Akses 90 Hari)</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>2 Kod Kelas</b> Unik</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span>Muat Turun Laporan &amp; Sijil (2 Kelas)</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Sehingga 3 Profil Anak</b> (Akses 90 Hari)</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Kod Keluarga Khas</b> untuk 3 Anak</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
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
                          onClick={() => {
                            setIsModeMenuOpen(false);
                            setIsProPricingModalOpen(false);
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              setPendingLoginMode(activePakejCategory);
                              setAuthModalTab("register");
                              setAuthModalError("");
                              setShowLoginModal(true);
                              setLoginEmail("");
                              setLoginPassword("");
                              setRegGuruNama("");
                              setRegGuruSekolah("");
                              setRegNamaKeluarga("");
                            }
                          }}
                        >
                          Daftar
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
                          <h3
                            style={{
                              fontSize: "1.15rem",
                              margin: "0 0 4px 0",
                              color: "var(--color-dark)",
                              fontWeight: "bold",
                            }}
                          >
                            Tahunan Pro
                          </h3>

                          {/* Original price strikethrough animation & discount badge */}
                          <div className="original-price-box" style={{ marginBottom: "4px" }}>
                            <span className="original-price-strike">RM199</span>
                            <span className="discount-tag-badge">-65% OFF</span>
                          </div>

                          <div
                            className="price-tag"
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: "900",
                              color: "#0f766e",
                              marginBottom: "10px",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            RM69{" "}
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#475569",
                                fontWeight: "bold",
                              }}
                            >
                              / tahun
                            </span>
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
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>2 Kelas</b> Akses 365 Hari</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Aktiviti</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span>Laporan &amp; Sijil Tanpa Had</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span>Sokongan Keutamaan Pentadbir</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Sehingga 3 Profil Anak</b> (365 Hari)</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span><b>Semua 4 Peta &amp; Latihan</b> Terbuka</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
                                  <span>Laporan &amp; Sijil Lengkap Tanpa Had</span>
                                </li>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                  <i className="fa-solid fa-circle-check" style={{ color: "#10b981", marginTop: "2px" }}></i>
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
                          onClick={() => {
                            setIsModeMenuOpen(false);
                            setIsProPricingModalOpen(false);
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              setPendingLoginMode(activePakejCategory);
                              setAuthModalTab("register");
                              setAuthModalError("");
                              setShowLoginModal(true);
                              setLoginEmail("");
                              setLoginPassword("");
                              setRegGuruNama("");
                              setRegGuruSekolah("");
                              setRegNamaKeluarga("");
                            }
                          }}
                        >
                          Daftar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Accordion Section */}
                  <div
                    style={{
                      marginTop: "22px",
                      paddingTop: "16px",
                      borderTop: "2.5px dashed #cbd5e1",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "#168f81",
                          color: "white",
                          border: "1.5px solid var(--color-dark)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "900",
                          fontSize: "0.85rem",
                        }}
                      >
                        ?
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "1.05rem",
                          fontWeight: "bold",
                          color: "var(--color-dark)",
                        }}
                      >
                        Soalan Lazim (FAQ)
                      </h4>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {faqData.map((faq) => {
                        const isOpen = activeFaqId === faq.id;
                        return (
                          <div
                            key={faq.id}
                            style={{
                              backgroundColor: "#168f81",
                              borderRadius: "14px",
                              border: "2.5px solid var(--color-dark)",
                              boxShadow: isOpen
                                ? "0 3px 0 var(--color-dark)"
                                : "0 2px 0 var(--color-dark)",
                              overflow: "hidden",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px",
                                fontWeight: "bold",
                                fontSize: "0.92rem",
                                color: "#ffffff",
                                padding: "12px 14px",
                                cursor: "pointer",
                                userSelect: "none",
                              }}
                              onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                            >
                              <span>{faq.question}</span>
                              <i
                                className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
                                style={{
                                  color: "#ffffff",
                                  fontSize: "0.85rem",
                                }}
                              ></i>
                            </div>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.88rem",
                                      color: "#1e293b",
                                      lineHeight: "1.55",
                                      whiteSpace: "pre-line",
                                      borderTop: "2.5px solid var(--color-dark)",
                                      backgroundColor: "#ffffff",
                                      padding: "12px 14px",
                                    }}
                                  >
                                    {faq.id === 2 ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "8px",
                                          paddingTop: "2px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            flexWrap: "wrap",
                                            gap: "4px",
                                          }}
                                        >
                                          <span className="faq-highlight-guru">
                                            • Pakej Guru:
                                          </span>
                                          <span style={{ flex: "1 1 200px" }}>
                                            Menyokong pengurusan rekod 1 kelas
                                            murid, pantauan statistik latihan serta
                                            muat turun laporan prestasi murid.
                                          </span>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            flexWrap: "wrap",
                                            gap: "4px",
                                            marginTop: "4px",
                                          }}
                                        >
                                          <span className="faq-highlight-ibubapa">
                                            • Pakej Ibu Bapa:
                                          </span>
                                          <span style={{ flex: "1 1 200px" }}>
                                            Menyokong pendaftaran dan rekod
                                            perkembangan sehingga 3 orang anak dalam
                                            satu akaun.
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      faq.answer
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>


                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Maklumat Koleksi Lencana Utama & Sijil */}
          <div
            id="modal-info-lencana"
            className="modal-overlay"
            style={{
              display: "none",
              zIndex: 999999,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(4px)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                (window as any).tutupModalInfoLencana &&
                  (window as any).tutupModalInfoLencana();
              }
            }}
          >
            <div
              className="modal-content neo-box"
              style={{
                maxWidth: "540px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                textAlign: "center",
                padding: "24px 18px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
                position: "relative",
                backgroundColor: "#ffffff",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
                backgroundSize: "18px 18px",
                borderRadius: "24px",
                border: "4px solid var(--color-dark, #10182f)",
                boxShadow: "0 8px 0 var(--color-dark, #10182f)",
              }}
            >
              {/* Square Red Close Button */}
              <button
                className="neo-btn bg-red close-btn"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  fontSize: "1.15rem",
                  color: "white",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 2.5px 0 var(--color-dark, #10182f)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => {
                  (window as any).tutupModalInfoLencana &&
                    (window as any).tutupModalInfoLencana();
                }}
                title="Tutup"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* Purple Title Badge */}
              <div
                className="neo-btn bg-purple"
                style={{
                  fontSize: "clamp(1.15rem, 3.8vw, 1.35rem)",
                  fontWeight: "900",
                  color: "white",
                  padding: "8px 28px",
                  borderRadius: "20px",
                  border: "3px solid var(--color-dark, #10182f)",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  margin: "4px auto 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  letterSpacing: "0.5px",
                }}
              >
                Panduan Koleksi Lencana
              </div>

              {/* Card 1: Syarat Buka 4 Lencana Utama */}
              <div
                style={{
                  width: "100%",
                  background: "#f0fdf4",
                  border: "2.5px solid #16a34a",
                  borderRadius: "18px",
                  padding: "12px 12px 10px",
                  marginBottom: "12px",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                {/* Green Header Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#16a34a",
                    color: "white",
                    padding: "5px 14px",
                    borderRadius: "14px",
                    fontWeight: "900",
                    fontSize: "0.88rem",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                    marginBottom: "8px",
                  }}
                >
                  <i className="fa-solid fa-trophy" style={{ color: "#fef08a" }}></i>
                  <span>Syarat Buka 4 Lencana Utama</span>
                </div>

                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#1e293b",
                    lineHeight: "1.4",
                    fontWeight: "700",
                  }}
                >
                  Dapatkan <span style={{ background: "#fef08a", color: "#854d0e", padding: "1px 6px", borderRadius: "6px", fontWeight: "800" }}>3 Bintang Penuh</span> dalam sekurang-kurangnya <span style={{ textDecoration: "underline", fontWeight: "800" }}>3 aktiviti</span> bagi setiap cabaran:
                </div>

                {/* Visual 4 Badges Cards Grid */}
                <div
                  style={{
                    marginTop: "8px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                  }}
                >
                  {/* Badge 1 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-penjelajah-alfabet.png"
                      alt="Kenal Huruf"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Kenal Huruf
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-pemburu-suku-kata.png"
                      alt="Suku Kata Asas"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Suku Kata Asas
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-wira-pulau.png"
                      alt="Suku Kata Hero"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Suku Kata Hero
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-naib-raja-bacaan.png"
                      alt="Bacaan Bergred"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Bacaan Bergred
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Syarat Buka Sijil & Lencana Master */}
              <div
                style={{
                  width: "100%",
                  background: "#fefce8",
                  border: "2.5px solid #ca8a04",
                  borderRadius: "18px",
                  padding: "12px 12px 12px",
                  marginBottom: "14px",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                {/* Gold/Brown Header Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#ca8a04",
                    color: "white",
                    padding: "5px 14px",
                    borderRadius: "14px",
                    fontWeight: "900",
                    fontSize: "0.88rem",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                    marginBottom: "10px",
                  }}
                >
                  <i className="fa-solid fa-certificate" style={{ color: "#fef08a" }}></i>
                  <span>Syarat Buka Sijil & Lencana Master</span>
                </div>

                {/* Visual Workflow: 4 Badges -> Arrow -> Master Badge + Sijil (Centered & Prominent) */}
                <div
                  style={{
                    background: "white",
                    border: "2px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(8px, 2.5vw, 16px)",
                    boxShadow: "0 2px 0 #e2e8f0",
                  }}
                >
                  {/* 4 Mini Badges (Larger & Rapat) */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <img src="/images/lencana/lencana-penjelajah-alfabet.png" alt="Kenal Huruf" title="Kenal Huruf" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-pemburu-suku-kata.png" alt="Suku Kata Asas" title="Suku Kata Asas" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-wira-pulau.png" alt="Suku Kata Hero" title="Suku Kata Hero" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-naib-raja-bacaan.png" alt="Bacaan Bergred" title="Bacaan Bergred" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                  </div>

                  <i className="fa-solid fa-arrow-right" style={{ color: "#ca8a04", fontSize: "1.25rem", margin: "0 2px" }}></i>

                  {/* Master Badge & Certificate (No KAPTEN label) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src="/images/lencana/lencana-kapten-harta-karun.png"
                      alt="Master Badge"
                      title="Kapten Harta Karun"
                      style={{ width: "46px", height: "46px", objectFit: "contain" }}
                    />
                    <div style={{ height: "36px", width: "2px", background: "#cbd5e1" }}></div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#fef3c7", border: "2px solid #d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-file-pdf" style={{ color: "#dc2626", fontSize: "1.25rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.68rem", fontWeight: "900", color: "#b45309", marginTop: "2px" }}>SIJIL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Close Button */}
              <button
                className="neo-btn bg-purple"
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  fontSize: "1.05rem",
                  fontWeight: "900",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderRadius: "16px",
                  border: "3px solid var(--color-dark, #10182f)",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  (window as any).tutupModalInfoLencana &&
                    (window as any).tutupModalInfoLencana();
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ fontSize: "1.2rem" }}></i>
                <span>Faham & Mula Kumpul Lencana!</span>
              </button>
            </div>
          </div>

          <div
            id="app-info-modal"
            className="modal-overlay"
            style={{
              display: "none",
              zIndex: 999999,
              backgroundColor: "rgba(0,0,0,0.85)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                (window as any).tutupModalAppInfo &&
                  (window as any).tutupModalAppInfo();
              }
            }}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: "500px",
                width: "90%",
                textAlign: "center",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
                position: "relative",
                backgroundColor: "#ffffff",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.11) 1.5px, transparent 1.5px), linear-gradient(#ffffff, #ffffff)",
                backgroundSize: "18px 18px, auto",
              }}
            >
              <button
                className="neo-btn bg-red"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  minHeight: "36px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  zIndex: 10,
                }}
                onClick={() => {
                  (window as any).tutupModalAppInfo &&
                    (window as any).tutupModalAppInfo();
                }}
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div
                className="app-info-logo-wrapper"
                style={{
                  padding: "0",
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  margin: "0 auto 15px auto",
                }}
              >
                <img
                  referrerPolicy="no-referrer"
                  src="/images/sampingan/logo-login-screen.png"
                  alt="Bunyi Kata"
                  className="glitch-logo"
                  style={{
                    maxWidth: "180px",
                    width: "45vw",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "clamp(0.7rem, 3.5vw, 0.95rem)",
                  lineHeight: "1.6",
                  color: "var(--color-dark)",
                  marginBottom: "15px",
                  textAlign: "justify",
                  width: "100%",
                }}
              >
                Aplikasi ini adalah satu aplikasi mengenal huruf dan suku kata
                yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas.
                Aplikasi ini terbahagi kepada dua bahagian utama iaitu
                Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan
                membawa kepada keseronokan dalam pembelajaran. Di akhir
                pembelajaran dan latihan, murid akan memperoleh hadiah yang
                menarik!
              </p>
              <p
                style={{
                  fontSize: "clamp(0.65rem, 3vw, 0.9rem)",
                  color: "var(--color-dark)",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Aplikasi ini dibangunkan sepenuhnya oleh
                <br />
                IR EduInnovations.
              </p>

              {/* Butang Ikon Media Sosial (Website, Telegram, Google Play Store, Apple App Store) */}
              <div
                id="app-info-social-buttons-container"
                className="app-info-social-row"
                style={{
                  margin: "6px auto 14px auto",
                }}
              >
                {/* Website */}
                <button
                  type="button"
                  className="app-info-social-btn btn-web"
                  title="Laman Web Rasmi (bunyikata.my)"
                  aria-label="Laman Web Rasmi"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://bunyikata.my", "_blank");
                  }}
                >
                  <i className="fa-solid fa-globe"></i>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  className="app-info-social-btn btn-telegram"
                  title="Saluran Telegram"
                  aria-label="Saluran Telegram"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                  }}
                >
                  <i className="fa-brands fa-telegram"></i>
                </button>

                {/* Google Play Store */}
                <button
                  type="button"
                  className="app-info-social-btn btn-playstore"
                  title="Google Play Store"
                  aria-label="Google Play Store"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://play.google.com/store/apps/details?id=com.bunyikatabacaan", "_blank");
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z" fill="#4285F4"/>
                    <path d="m13.544 10.989 3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z" fill="#34A853"/>
                    <path d="m13.544 13.056-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" fill="#EA4335"/>
                    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z" fill="#FBBC04"/>
                  </svg>
                </button>

                {/* Apple App Store */}
                <button
                  type="button"
                  className="app-info-social-btn btn-appstore"
                  title="Apple App Store"
                  aria-label="Apple App Store"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://apps.apple.com/my/app/bunyi-kata/id6739794132", "_blank");
                  }}
                >
                  <i className="fa-brands fa-app-store-ios" style={{ fontSize: "1.45rem", color: "#ffffff" }}></i>
                </button>
              </div>

              {/* Hak Cipta Terpelihara hanya untuk Onboarding (Mula Bermain) */}
              <div
                id="app-info-copyright"
                style={{
                  display: "none",
                  fontSize: "clamp(0.6rem, 2.5vw, 0.78rem)",
                  color: "#475569",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  width: "100%",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                <div>&copy; 2026 Bunyi Kata &bull; Hak Cipta Terpelihara &bull; CRDV2025M00849</div>
              </div>

              {/* Ruangan Feedback (Hanya dipaparkan untuk Popup Info) */}
              <div
                id="app-info-feedback-section"
                className="feedback-section-box"
                style={{
                  display: "none",
                  width: "100%",
                  backgroundColor: "#168f81",
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 45%, #168f81 100%), radial-gradient(rgba(255, 255, 255, 0.22) 2px, transparent 2px)",
                  backgroundSize: "100% 100%, 15px 15px",
                  border: "3px solid var(--color-dark, #10182f)",
                  borderRadius: "18px",
                  padding: "14px",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  textAlign: "left",
                  boxSizing: "border-box",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: "900",
                    color: "#ffffff",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                  }}
                >
                  <i
                    className="fa-solid fa-comment-dots"
                    style={{ color: "#fef08a", fontSize: "1.15rem" }}
                  ></i>
                  <span>Maklum Balas &amp; Cadangan Penambahbaikan</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nama anda"
                    value={feedbackNama}
                    onChange={(e) => setFeedbackNama(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "2px solid var(--color-dark, #10182f)",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      backgroundColor: "#ffffff",
                      color: "var(--color-dark, #10182f)",
                      fontWeight: "600",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "stretch",
                      width: "100%",
                    }}
                  >
                    <textarea
                      placeholder="Tulis apa-apa cadangan atau penambahbaikan..."
                      value={feedbackMesej}
                      onChange={(e) => setFeedbackMesej(e.target.value)}
                      rows={2}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "2px solid var(--color-dark, #10182f)",
                        fontSize: "0.85rem",
                        resize: "none",
                        boxSizing: "border-box",
                        backgroundColor: "#ffffff",
                        color: "var(--color-dark, #10182f)",
                        fontWeight: "600",
                      }}
                    ></textarea>
                    <button
                      type="button"
                      className="neo-btn bg-blue"
                      onClick={() => hantarFeedback()}
                      title="Hantar Maklum Balas"
                      style={{
                        width: "48px",
                        minWidth: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        padding: "0",
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "2.5px solid var(--color-dark, #10182f)",
                        cursor: "pointer",
                        boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="fa-solid fa-paper-plane"
                        style={{ fontSize: "1.1rem", color: "#ffffff" }}
                      ></i>
                    </button>
                  </div>
                  {feedbackStatus === "success" && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#064e3b",
                        backgroundColor: "#ecfdf5",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "2px solid #059669",
                        textAlign: "center",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ color: "#059669" }}></i>
                      <span>Maklum balas berjaya dihantar! Terima kasih.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Butang Teruskan (Hanya dipaparkan untuk Onboarding / Mula Bermain) */}
              <button
                id="app-info-teruskan-btn"
                className="neo-btn"
                style={{
                  display: "none",
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  padding: "12px",
                  backgroundColor: "#168f81",
                  color: "#ffffff",
                }}
                onClick={() => {
                  try {
                    const modal = document.getElementById("app-info-modal");
                    if (modal) modal.style.display = "none";
                    const mode = (window as any).pendingAppInfoMode || "murid";
                    (window as any).pendingAppInfoMode = "";
                    if (mode === "murid") {
                      const isTrial = (window as any).isGuestMode || (window as any).userAccessLevel === "trial" || userAccessLevel === "trial" || localStorage.getItem("bunyiKataAccessLevel") === "trial";
                      if (isTrial) {
                        (window as any).isGuestMode = true;
                        (window as any).isAdminMode = false;
                        (window as any).modAdminAktif = false;
                        (window as any).userAccessLevel = "trial";
                        (window as any).namaMuridAktif = "Tetamu";
                        setUserAccessLevel("trial");
                        setIsAdminActive(false);
                        localStorage.setItem("bunyiKataAccessLevel", "trial");
                        localStorage.removeItem("bunyiKataUserRole");
                      }
                      if (typeof (window as any).masukModMurid === "function") {
                        try {
                          (window as any).masukModMurid(
                            isTrial ? "Tetamu" : ((window as any).namaMuridAktif || "Murid"),
                          );
                        } catch (e) {
                          console.warn("masukModMurid notice:", e);
                        }
                      }
                      if (typeof (window as any).paparSkrin === "function") {
                        try {
                          (window as any).paparSkrin("main-menu-screen");
                        } catch (e) {
                          console.warn("paparSkrin notice:", e);
                        }
                      }
                      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
                      document.getElementById("main-menu-screen")?.classList.add("active");
                      document.body.classList.remove("teacher-mode", "admin-mode", "parent-mode");
                      const topBanner = document.getElementById("teacher-top-banner");
                      if (topBanner) topBanner.style.display = "none";
                      const tNav = document.getElementById("teacher-sticky-nav");
                      if (tNav) tNav.style.display = "none";
                      const aNav = document.getElementById("admin-sticky-nav");
                      if (aNav) aNav.style.display = "none";
                      const pNav = document.getElementById("parent-sticky-nav");
                      if (pNav) pNav.style.display = "none";
                      if (typeof (window as any).updateProfilUI === "function") {
                        try {
                          (window as any).updateProfilUI();
                        } catch (e) {
                          console.warn("updateProfilUI notice:", e);
                        }
                      }
                    } else if (mode === "guru") {
                      masukModGuru();
                    } else if (mode === "ibubapa") {
                      (window as any).bukaModalPilihAnak &&
                        (window as any).bukaModalPilihAnak();
                    } else if (mode === "admin") {
                      (window as any).masukModAdmin &&
                        (window as any).masukModAdmin();
                    }
                  } catch (err) {
                    console.error("Teruskan click error:", err);
                    const modal = document.getElementById("app-info-modal");
                    if (modal) modal.style.display = "none";
                    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
                    document.getElementById("main-menu-screen")?.classList.add("active");
                  }
                }}
              >
                Teruskan{" "}
                <i
                  className="fa-solid fa-arrow-right"
                  style={{ marginLeft: "8px" }}
                ></i>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Koleksi Siri Buku Cerita Bunyi Kata Modal */}
      <AnimatePresence>
        {showBukuCeritaModal && (
          <BukuCeritaModal
            initialBookId={initialBukuCeritaId}
            onClose={() => {
              setShowBukuCeritaModal(false);
              setInitialBukuCeritaId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Cuba Sebut / Cuba Baca Interactive Game Modal */}
      <AnimatePresence>
        {showCubaSebut && (
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
        )}
      </AnimatePresence>
    </div>
  );
}
