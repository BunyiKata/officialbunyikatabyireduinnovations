// @ts-nocheck
import React from "react";
import { motion } from "motion/react";

// Fallbacks for window/global functions
const kembaliKePilihPeta = (...args: any[]) => (window as any).kembaliKePilihPeta?.(...args);
const bukaVR = (...args: any[]) => (window as any).bukaVR?.(...args);
const bukaTandukKata = (...args: any[]) => (window as any).bukaTandukKata?.(...args);
const showPuzzleSukuKataModal = (...args: any[]) => (window as any).showPuzzleSukuKataModal?.(...args);
const bukaPuzzleSukuKata = (...args: any[]) => (window as any).bukaPuzzleSukuKata?.(...args);
const showCantumKataModal = (...args: any[]) => (window as any).showCantumKataModal?.(...args);
const bukaCantumKata = (...args: any[]) => (window as any).bukaCantumKata?.(...args);
const bukaPerpustakaan = (...args: any[]) => (window as any).bukaPerpustakaan?.(...args);
const showCubaSebutModal = (...args: any[]) => (window as any).showCubaSebutModal?.(...args);
const bukaVRBacaan = (...args: any[]) => (window as any).bukaVRBacaan?.(...args);
const showCubaBacaModal = (...args: any[]) => (window as any).showCubaBacaModal?.(...args);
const cabaranLainPrev = (...args: any[]) => (window as any).cabaranLainPrev?.(...args);
const cabaranLainNext = (...args: any[]) => (window as any).cabaranLainNext?.(...args);
const bukaSurihHuruf = (...args: any[]) => (window as any).bukaSurihHuruf?.(...args);
const bukaSurihNombor = (...args: any[]) => (window as any).bukaSurihNombor?.(...args);
const paparSkrin = (...args: any[]) => (window as any).paparSkrin?.(...args);
const bukaARKiraJari = (...args: any[]) => (window as any).bukaARKiraJari?.(...args);
const showARSukuKataModal = (...args: any[]) => (window as any).showARSukuKataModal?.(...args);

interface MapScreenProps {
  getScreenClass: (screenId: string) => string;
  setShowBukuCeritaModal?: (show: boolean) => void;
  setKadImbasanNomborMode?: (mode: any) => void;
  setArKiraJariMode?: (mode: any) => void;
  isDialOpen?: boolean;
  setIsDialOpen?: (open: boolean) => void;
}

export default function MapScreen({
  getScreenClass,
  setShowBukuCeritaModal = () => {},
  setKadImbasanNomborMode = () => {},
  setArKiraJariMode = () => {},
  isDialOpen = false,
  setIsDialOpen = () => {},
}: MapScreenProps) {
  return (
      <div id="map-screen" className={getScreenClass("map-screen")}>
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
  );
}
