// @ts-nocheck
import React, { Suspense, lazy } from "react";

const PirateAvatar3DSwiper = lazy(() =>
  import("../PirateAvatar3DSwiper").then((m) => ({ default: m.PirateAvatar3DSwiper }))
);

const selectAvatar = (...args: any[]) => (window as any).selectAvatar?.(...args);
const backToModeSelection = (...args: any[]) => (window as any).backToModeSelection?.(...args);
const masukModMurid = (...args: any[]) => (window as any).masukModMurid?.(...args);
const onStudentSelect = (...args: any[]) => (window as any).onStudentSelect?.(...args);

interface LoginScreenProps {
  getScreenClass: (screenId: string) => string;
  setIsModeChoiceOpen: (open: boolean) => void;
  setIsCodeModalOpen: (open: boolean) => void;
  setIsEntryChoiceModalOpen?: (open: boolean) => void;
}

export default function LoginScreen({
  getScreenClass,
  setIsModeChoiceOpen,
  setIsCodeModalOpen,
  setIsEntryChoiceModalOpen = () => {},
}: LoginScreenProps) {
  return (
    <div
      id="login-screen"
      className={getScreenClass("login-screen")}
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
            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
            // PENTING: Butang bulat ini di sudut kanan atas skrin log masuk ialah
            // "Pilih Mod". Sebelum ini ia memanggil setIsEntryChoiceModalOpen(true)
            // lalu memaparkan popup "Pilih Cara Mula" — itu bug.
            // Kini ia terus membuka modal Pakej Pro. Peranan ibu bapa diberi
            // keutamaan (default), melainkan pengguna jelas seorang guru.
            const role = (
              (typeof localStorage !== "undefined" &&
                localStorage.getItem("bunyiKataUserRole")) ||
              ""
            ).toLowerCase();
            const tab = role === "guru" ? "guru" : "ibubapa";
            if (typeof (window as any).openPakejProModal === "function") {
              (window as any).openPakejProModal(tab);
            } else {
              setIsModeChoiceOpen(true);
            }
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
            <Suspense fallback={null}>
              <PirateAvatar3DSwiper
                onStart={() => {
                  (window as any).bukaModalAppInfo &&
                    (window as any).bukaModalAppInfo("murid");
                }}
                onOpenProPackage={() => {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                }}
              />
            </Suspense>
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
            <div>Â© 2026 Bunyi Kata. Hak Cipta Terpelihara.</div>
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
  );
}
