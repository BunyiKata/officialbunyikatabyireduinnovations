// @ts-nocheck
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loginWithEmail, registerWithEmail } from "../../services/authService";
import {
  syncTeacherSessionFromFirebase,
  syncParentSessionFromFirebase,
} from "../../services/firebaseService";

export interface AuthModalProps {
  isOpen: boolean;
  initialTab?: "masuk" | "daftar" | "login" | "register";
  pendingLoginMode: "guru" | "ibubapa" | "admin";
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
  onClose,
  setUserAccessLevel,
  setIsMandatorySetup,
  setEditModalMode,
  setIsEditModalOpen,
  setTeacherPlanName,
}: AuthModalProps) {
  const [authModalTab, setAuthModalTab] = useState<"masuk" | "daftar" | "login" | "register">(initialTab);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [regGuruNama, setRegGuruNama] = useState("");
  const [regGuruSekolah, setRegGuruSekolah] = useState("");
  const [regNamaKeluarga, setRegNamaKeluarga] = useState("");
  const [authModalError, setAuthModalError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState("");

  React.useEffect(() => {
    if (initialTab) {
      setAuthModalTab(initialTab);
    }
  }, [initialTab]);

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
                              if (typeof (window as any).playBubble === "function") (window as any).playBubble();
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
                              if (typeof (window as any).playBubble === "function") (window as any).playBubble();
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
                                  } catch (e) {}

                                  const guruEl = document.getElementById("guru-dashboard-nama-guru-title");
                                  if (guruEl) guruEl.innerText = gName;
                                  const sekolahEl = document.getElementById("guru-dashboard-nama-sekolah-title");
                                  if (sekolahEl) sekolahEl.innerText = gSekolah;

                                  onClose();
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

                                  onClose();
                                  syncParentSessionFromFirebase(res.user?.id || newEmail).catch(console.warn);
                                  (window as any).bukaModalPilihAnak && (window as any).bukaModalPilihAnak();
                                } else if (role === "admin") {
                                  setUserAccessLevel("pro");
                                  localStorage.setItem("bunyiKataAccessLevel", "pro");
                                  localStorage.setItem("bunyiKataUserRole", "admin");
                                  (window as any).userAccessLevel = "pro";
                                  (window as any).modAdminAktif = true;
                                  (window as any).isAdminMode = true;
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
                                    localStorage.setItem("bunyiKataUserRole", "guru");
                                    if (typeof setTeacherPlanName === "function") {
                                      setTeacherPlanName("Percuma");
                                    }
                                  }

                                  const gName = regGuruNama.trim().toUpperCase();
                                  const gSekolah = regGuruSekolah.trim().toUpperCase();
                                  const gEmail = loginEmail.trim().toLowerCase();

                                  localStorage.setItem("bunyiKataNamaGuru", gName);
                                  localStorage.setItem("pdf_guru", gName);
                                  localStorage.setItem("bunyiKataNamaSekolah", gSekolah);
                                  if (gSekolah) localStorage.setItem("pdf_sekolah", gSekolah);
                                  localStorage.setItem("bunyiKataGuruEmail", gEmail);
                                  localStorage.setItem("bunyiKataGuruSetupDone", "true");
                                  localStorage.setItem("bunyiKataUserRole", "guru");

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
                                  localStorage.removeItem("bunyiKataNamaKeluarga");
                                  localStorage.removeItem("bunyiKataKodKeluarga");
                                  localStorage.removeItem("bunyiKataParentChildNames");
                                  localStorage.removeItem("ibubapaAnakTerpilih");
                                  localStorage.removeItem("bunyiKataIbubapaEmail");
                                  localStorage.setItem("bunyiKataIsParentChild", "false");
                                  (window as any).parentChildNames = [];
                                  (window as any).anakTerpilih = "";

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
                                    onClose();
                                    syncTeacherSessionFromFirebase(res.user?.id || gEmail).catch(console.warn);
                                    if (typeof (window as any).masukModGuru === "function") {
                                      (window as any).masukModGuru();
                                    }
                                    if (typeof (window as any).paparSkrin === "function") {
                                      (window as any).paparSkrin("guru-dashboard");
                                    }
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
                                    localStorage.setItem("bunyiKataParentPlan", "Percuma");
                                    localStorage.setItem("bunyiKataUserRole", "ibubapa");
                                  }

                                  const famName = regNamaKeluarga.trim().toUpperCase();
                                  const pEmail = loginEmail.trim().toLowerCase();

                                  localStorage.setItem("bunyiKataNamaKeluarga", famName);
                                  localStorage.setItem("bunyiKataIbubapaEmail", pEmail);
                                  localStorage.setItem("bunyiKataIbubapaSetupDone", "true");
                                  localStorage.setItem("bunyiKataUserRole", "ibubapa");

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
                                    onClose();
                                    syncParentSessionFromFirebase(res.user?.id || pEmail).catch(console.warn);
                                    if (typeof (window as any).masukModIbubapa === "function") {
                                      (window as any).masukModIbubapa();
                                    } else if (typeof (window as any).masukModIbuBapa === "function") {
                                      (window as any).masukModIbuBapa();
                                    }
                                    if (typeof (window as any).paparSkrin === "function") {
                                      (window as any).paparSkrin("ibubapa-dashboard");
                                    }
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
  );
}
