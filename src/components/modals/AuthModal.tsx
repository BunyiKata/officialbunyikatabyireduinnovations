// @ts-nocheck
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loginWithEmail, sendPasswordResetEmail, logout } from "../../services/authService";
import { hubungiAdminWhatsapp, mesejDaftarAffiliate } from "../../config/contactAdmin";
import {
  syncTeacherSessionFromFirebase,
  syncParentSessionFromFirebase,
} from "../../services/firebaseService";

export interface PlanInfo {
  id: string;
  name: string;
  price: number;
  period: string;
  category: "guru" | "ibubapa";
}

export interface AuthModalProps {
  isOpen: boolean;
  initialTab?: "masuk" | "login";
  pendingLoginMode: "guru" | "ibubapa" | "admin" | "affiliate";
  pendingSelectedPlan?: PlanInfo | null;
  onClose: () => void;
  setUserAccessLevel: (lvl: "trial" | "pro") => void;
  setIsMandatorySetup: (val: boolean) => void;
  setEditModalMode: (mode: string) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setTeacherPlanName?: (plan: string) => void;
}

export function AuthModal({
  isOpen,
  initialTab = "masuk",
  pendingLoginMode,
  pendingSelectedPlan,
  onClose,
  setUserAccessLevel,
  setIsMandatorySetup,
  setEditModalMode,
  setIsEditModalOpen,
  setTeacherPlanName,
}: AuthModalProps) {
  const [authModalTab, setAuthModalTab] = useState<"masuk" | "login">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authModalError, setAuthModalError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState("");

  // Gelung "loading" (uisfx) terikat pada keadaan pemuatan pengesahan yang
  // KELIHATAN. Dihentikan apabila selesai, gagal, ditutup, atau unmount.
  React.useEffect(() => {
    const sfx = (window as any).bkSfx;
    if (!sfx) return;
    if (isAuthLoading) {
      sfx.startLoop?.("loading");
    } else {
      sfx.stopLoop?.("loading");
    }
    return () => {
      sfx.stopLoop?.("loading");
    };
  }, [isAuthLoading]);


  React.useEffect(() => {
    if (initialTab) {
      setAuthModalTab(initialTab === "masuk" ? "masuk" : "login");
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (isOpen) {
      if (pendingSelectedPlan) {
        // PENGGUNA LANGGAN PAKEJ:
        // Kosongkan medan log masuk supaya tidak mencampur data sesi lama!
        setLoginEmail("");
        setLoginPassword("");
        setAuthModalError("");
        setAuthSuccessMessage("");
      } else if (authModalTab === "login" || authModalTab === "masuk") {
        // Tab log masuk biasa tanpa pending plan
        if (pendingLoginMode === "guru") {
          const savedEmail = localStorage.getItem("bunyiKataGuruEmail") || "";
          if (savedEmail && !loginEmail) setLoginEmail(savedEmail);
        } else if (pendingLoginMode === "ibubapa") {
          const savedEmail = localStorage.getItem("bunyiKataIbubapaEmail") || "";
          if (savedEmail && !loginEmail) setLoginEmail(savedEmail);
        }
      }
    } else {
      setAuthModalError("");
      setAuthSuccessMessage("");
    }
  }, [isOpen, pendingLoginMode, pendingSelectedPlan, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
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
                onClose();
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
                      : pendingLoginMode === "affiliate"
                        ? "Jana pendapatan dengan memperkenalkan Bunyi Kata! Pantau kod rujukan, senarai rujukan dan komisen anda di dalam satu papan pemuka."
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
                  ) : pendingLoginMode === "affiliate" ? (
                    <>
                      <div className="auth-modal-badge-item">
                        <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(124, 58, 237, 0.14)", color: "#7c3aed" }}>
                          <i className="fa-solid fa-link"></i>
                        </div>
                        <span>Kod Rujukan &amp; Pautan Unik</span>
                      </div>
                      <div className="auth-modal-badge-item">
                        <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(22, 143, 129, 0.14)", color: "#168f81" }}>
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <span>Pantau Rujukan &amp; Jualan</span>
                      </div>
                      <div className="auth-modal-badge-item">
                        <div className="auth-modal-badge-icon" style={{ backgroundColor: "rgba(234, 179, 8, 0.18)", color: "#d97706" }}>
                          <i className="fa-solid fa-coins"></i>
                        </div>
                        <span>Komisen &amp; Bayaran</span>
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

              {/* BAHAGIAN KANAN: Borang Log Masuk */}
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
                            : pendingLoginMode === "affiliate"
                              ? "#7c3aed"
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
                    {`Log Masuk ${
                      pendingLoginMode === "guru"
                        ? "Guru"
                        : pendingLoginMode === "ibubapa"
                          ? "Ibu Bapa"
                          : pendingLoginMode === "affiliate"
                            ? "Affiliate"
                            : "Admin"
                    }`}
                  </div>
                </div>

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
                {(authModalTab === "login" || authModalTab === "masuk" || pendingLoginMode === "admin") && (
                  /* TAB LOG MASUK */
                  <>
                    {pendingSelectedPlan && (
                      <div
                        style={{
                          background:
                            pendingLoginMode === "guru"
                              ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
                              : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                          border: `2.5px solid ${pendingLoginMode === "guru" ? "var(--color-orange, #ea580c)" : "var(--color-blue, #2563eb)"}`,
                          borderRadius: "14px",
                          padding: "12px 14px",
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "10px",
                            backgroundColor: pendingLoginMode === "guru" ? "var(--color-orange, #ea580c)" : "var(--color-blue, #2563eb)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                            flexShrink: 0,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                          }}
                        >
                          <i className="fa-solid fa-crown"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.74rem",
                              fontWeight: "800",
                              textTransform: "uppercase",
                              color: pendingLoginMode === "guru" ? "#c2410c" : "#1d4ed8",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Pakej Pilihan: {pendingSelectedPlan.name}
                          </div>
                          <div
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: "900",
                              color: "var(--color-dark)",
                              lineHeight: "1.2",
                            }}
                          >
                            RM{pendingSelectedPlan.price}{" "}
                            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "bold" }}>
                              / {pendingSelectedPlan.period}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "3px" }}>
                            Sila log masuk ke akaun anda untuk meneruskan langganan pakej ini. Langganan diuruskan oleh admin.
                          </div>
                        </div>
                      </div>
                    )}

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
                              (window as any).notify(
                                `Pautan penetapan semula kata laluan telah dihantar ke: ${emailToSend.trim()}. Sila semak peti masuk (Inbox / Spam) emel anda.`
                              );
                            } else {
                              (window as any).notify(`Ralat: ${res.message}`, undefined, "error");
                            }
                          } catch (err: any) {
                            (window as any).notify(
                              "Gagal menghantar pautan reset kata laluan: " + (err?.message || ""),
                              undefined,
                              "error"
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
                              : pendingLoginMode === "affiliate"
                                ? "#7c3aed"
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

                          // Semakan peranan: Halang Guru log masuk melalui modal Ibu Bapa & sebaliknya
                          if (pendingLoginMode === "guru" && role !== "guru" && role !== "admin") {
                            await logout();
                            setAuthModalError("Emel ini didaftarkan sebagai akaun Ibu Bapa. Sila log masuk melalui bahagian Ibu Bapa.");
                            setIsAuthLoading(false);
                            return;
                          }
                          if (pendingLoginMode === "ibubapa" && role !== "ibubapa" && role !== "admin") {
                            await logout();
                            setAuthModalError("Emel ini didaftarkan sebagai akaun Guru. Sila log masuk melalui bahagian Guru.");
                            setIsAuthLoading(false);
                            return;
                          }
                          if (pendingLoginMode === "admin" && role !== "admin") {
                            await logout();
                            setAuthModalError("Akaun ini tidak mempunyai akses sebagai Pentadbir (Admin).");
                            setIsAuthLoading(false);
                            return;
                          }
                          if (pendingLoginMode === "affiliate" && role !== "affiliate") {
                            await logout();
                            setAuthModalError("Emel ini tidak didaftarkan sebagai akaun Affiliate.");
                            setIsAuthLoading(false);
                            return;
                          }

                          localStorage.setItem("bunyiKataUserRole", role);
                          (window as any).isGuestMode = false;
                          (window as any).namaMuridAktif = "";
                          localStorage.removeItem("muridAktif");
                          localStorage.removeItem("bunyiKataCurrentMurid");

                          if (user) {
                            (window as any).currentUser = user;
                            if (user.id) localStorage.setItem("bunyiKataUserId", user.id);
                            if (user.tarikh_tamat) {
                              localStorage.setItem("bunyiKataTarikhTamat", user.tarikh_tamat);
                            } else {
                              localStorage.removeItem("bunyiKataTarikhTamat");
                            }
                            const isPaid = (role === "admin") || !!(user.langganan &&
                              user.langganan.toLowerCase() !== "percuma" &&
                              (!user.tarikh_tamat || new Date(user.tarikh_tamat) > new Date()));
                            const accessLevel: "trial" | "pro" = isPaid ? "pro" : "trial";
                            setUserAccessLevel(accessLevel);
                            localStorage.setItem("bunyiKataAccessLevel", accessLevel);
                            (window as any).userAccessLevel = accessLevel;

                            let planName = isPaid ? (user.langganan || "1 Bulan (Pro)") : "Percuma";
                            if (planName === "Bulanan Pro" || planName === "1 Bulan" || planName === "Pro") planName = "1 Bulan (Pro)";
                            else if (planName === "3 Bulanan Pro" || planName === "3 Bulan") planName = "3 Bulan (Pro)";
                            else if (planName === "Tahunan Pro" || planName === "1 Tahun") planName = "1 Tahun (Pro)";

                            if (role === "ibubapa") {
                              localStorage.setItem("bunyiKataParentPlan", planName);
                              localStorage.removeItem("bunyiKataTeacherPlan");
                            } else {
                              localStorage.setItem("bunyiKataTeacherPlan", planName);
                              localStorage.removeItem("bunyiKataParentPlan");
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

                            localStorage.setItem("bunyiKataNamaGuru", gName);
                            localStorage.setItem("pdf_guru", gName);
                            localStorage.setItem("bunyiKataNamaSekolah", gSekolah);
                            if (gSekolah) localStorage.setItem("pdf_sekolah", gSekolah);
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
                            } catch (e) {
                              console.warn("[Auth] Gagal kemas kini cache guru admin:", e);
                            }

                            const guruEl = document.getElementById("guru-dashboard-nama-guru-title");
                            if (guruEl) guruEl.innerText = gName;
                            const sekolahEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                            if (sekolahEl) sekolahEl.innerText = gSekolah;

                            try {
                              await syncTeacherSessionFromFirebase(res.user?.id || newEmail);
                            } catch (syncErr) {
                              console.warn("[AuthModal] syncTeacherSessionFromFirebase error:", syncErr);
                            }

                            onClose();
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

                            localStorage.setItem("bunyiKataNamaKeluarga", famName);
                            localStorage.setItem("bunyiKataIbubapaEmail", newEmail);

                            const famTitle = document.getElementById("ibubapa-nama-keluarga-title");
                            if (famTitle) famTitle.innerText = famName;

                            try {
                              await syncParentSessionFromFirebase(res.user?.id || newEmail);
                            } catch (syncErr) {
                              console.warn("[AuthModal] syncParentSessionFromFirebase error:", syncErr);
                            }

                            onClose();
                            (window as any).bukaModalPilihAnak && (window as any).bukaModalPilihAnak();
                          } else if (role === "affiliate") {
                            // Fasa 3: bersihkan sesi peranan lain, kemudian
                            // paparkan panel affiliate (kod/rujukan/komisen).
                            localStorage.removeItem("bunyiKataNamaGuru");
                            localStorage.removeItem("bunyiKataNamaSekolah");
                            localStorage.removeItem("bunyiKataNamaKeluarga");
                            localStorage.setItem("bunyiKataUserRole", "affiliate");

                            const affName = user?.nama || "Affiliate";
                            localStorage.setItem("bunyiKataNamaAffiliate", affName);
                            const affKod = user?.kod || user?.affiliate_kod || localStorage.getItem("bunyiKataAffiliateKod") || "";
                            if (affKod) localStorage.setItem("bunyiKataAffiliateKod", affKod);
                            const affEmail = user?.email || localStorage.getItem("bunyiKataAffiliateEmail") || "";
                            if (affEmail) localStorage.setItem("bunyiKataAffiliateEmail", affEmail);

                            onClose();
                            (window as any).masukModAffiliate && (window as any).masukModAffiliate();
                          } else if (role === "admin") {
                            const adminName = user?.nama || "Admin Bunyi Kata";
                            localStorage.setItem("bunyiKataNamaAdmin", adminName);
                            setUserAccessLevel("pro");
                            localStorage.setItem("bunyiKataAccessLevel", "pro");
                            localStorage.setItem("bunyiKataUserRole", "admin");
                            (window as any).userAccessLevel = "pro";
                            (window as any).modAdminAktif = true;
                            (window as any).isAdminMode = true;
                            (window as any).isGuestMode = false;
                            onClose();
                            (window as any).masukModAdmin && (window as any).masukModAdmin();
                          } else {
                            onClose();
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
                          {pendingSelectedPlan ? "Log Masuk & Teruskan" : "Log Masuk"}{" "}
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
                          fontSize: "0.85rem",
                          color: "#475569",
                          lineHeight: "1.5",
                        }}
                      >
                        Belum mempunyai akaun?{" "}
                        {pendingLoginMode === "affiliate"
                          ? "Daftar Pakej Affiliate"
                          : "Daftar Pakej Pro"}
                        <br />
                        <button
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            color:
                              pendingLoginMode === "affiliate"
                                ? "#7c3aed"
                                : pendingLoginMode === "guru"
                                  ? "var(--color-orange)"
                                  : "var(--color-blue)",
                            fontWeight: "bold",
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            padding: "0",
                            textDecoration: "underline",
                            marginTop: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                          onClick={() => {
                            if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                            // PENTING: Bagi mod Affiliate, butang ini TERUS ke WhatsApp
                            // admin dengan template khas affiliate (tiada popup pakej,
                            // kerana affiliate tiada pilihan bulanan/tahunan).
                            if (pendingLoginMode === "affiliate") {
                              onClose();
                              hubungiAdminWhatsapp(mesejDaftarAffiliate());
                              return;
                            }
                            // Guru / Ibu Bapa: tutup modal log masuk, kemudian buka
                            // modal Pilih Pakej Pro (senarai harga) untuk memilih pakej.
                            onClose();
                            const tab = pendingLoginMode === "guru" ? "guru" : "ibubapa";
                            if (typeof (window as any).openPakejProModal === "function") {
                              (window as any).openPakejProModal(tab);
                            } else {
                              hubungiAdminWhatsapp();
                            }
                          }}
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                          dapatkan di sini
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
