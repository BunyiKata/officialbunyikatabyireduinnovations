// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getStudentsByCode,
  getClassByCode,
  getStudentsByClassId,
  getFamilyByCode,
  getStudentsByFamilyId,
} from "../../services/firebaseService";
import { cubaAksesAdmin, tetapkanSesiAdminTempatan } from "../../services/adminService";

export interface EntryChoiceModalProps {
  isEntryChoiceModalOpen: boolean;
  setIsEntryChoiceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCodeModalOpen: boolean;
  setIsCodeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  joinCode: string;
  setJoinCode: React.Dispatch<React.SetStateAction<string>>;
  setIsModeMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModeChoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdminActive: React.Dispatch<React.SetStateAction<boolean>>;
  setUserAccessLevel: React.Dispatch<React.SetStateAction<"trial" | "pro">>;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingLoginMode: React.Dispatch<React.SetStateAction<string>>;
  setAuthModalTab: React.Dispatch<React.SetStateAction<string>>;
  setLoginEmail: React.Dispatch<React.SetStateAction<string>>;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;
  setRegGuruNama: React.Dispatch<React.SetStateAction<string>>;
  setRegGuruSekolah: React.Dispatch<React.SetStateAction<string>>;
  setRegNamaKeluarga: React.Dispatch<React.SetStateAction<string>>;
  setAuthModalError: React.Dispatch<React.SetStateAction<string>>;
}

function syncRemoteStudentsToLocal(remoteList: any[], isParent: boolean = false) {
  if (!remoteList || !Array.isArray(remoteList) || remoteList.length === 0) return;
  const names = remoteList.map((s: any) => s.nama).filter(Boolean);
  if (isParent) {
    localStorage.setItem("bunyiKataParentChildNames", JSON.stringify(names));
    (window as any).parentChildNames = names;
  } else {
    localStorage.setItem("bunyiKataStudentNames", JSON.stringify(names));
    (window as any).studentNames = names;
  }

  let sData = (window as any).studentData || {};
  try {
    const raw = localStorage.getItem("bunyiKataStudentData");
    if (raw) sData = { ...JSON.parse(raw), ...sData };
  } catch (e) {}

  let idMap: Record<string, string> = {};
  try {
    const rawMap = localStorage.getItem("bunyiKataStudentFirebaseIds");
    if (rawMap) idMap = JSON.parse(rawMap);
  } catch (e) {}
  if ((window as any).studentFirebaseIds) {
    idMap = { ...(window as any).studentFirebaseIds, ...idMap };
  }

  remoteList.forEach((s: any) => {
    if (!s.nama) return;
    const prev = sData[s.nama] || {};
    const totalBintang = s.total_bintang !== undefined ? s.total_bintang : (s.total_markah !== undefined ? s.total_markah : (prev.coins || 0));
    sData[s.nama] = {
      ...prev,
      id: s.id || prev.id,
      coins: totalBintang,
      totalBintang: totalBintang,
      badges: Array.from(new Set([...(prev.badges || []), ...(s.badges || [])])),
      mapsUnlocked: s.mapsUnlocked || prev.mapsUnlocked || 4,
      avatar: s.avatar_url || s.avatar || prev.avatar || "/images/avatar/avatar1.png",
      spentStars: s.spent_stars !== undefined ? s.spent_stars : (prev.spentStars || 0),
      claimedAvatars: (s.claimed_avatars && Array.isArray(s.claimed_avatars))
        ? Array.from(new Set([...(s.claimed_avatars || []), ...(prev.claimedAvatars || [])]))
        : (prev.claimedAvatars || ["/images/avatar/avatar1.png", "/images/avatar/avatar2.png"]),
      scores: { ...(prev.scores || {}), ...(s.scores || {}) },
      stars: { ...(prev.stars || {}), ...(s.stars || {}) },
      latihan: { ...(prev.latihan || {}), ...(s.latihan || {}) },
      kelas: s.nama_kelas || prev.kelas || "",
      kod_kelas: s.kod_kelas || prev.kod_kelas || "",
      nama_keluarga: s.nama_keluarga || prev.nama_keluarga || "",
      kod_keluarga: s.kod_keluarga || prev.kod_keluarga || "",
      kelas_id: s.kelas_id || prev.kelas_id || "",
      keluarga_id: s.keluarga_id || prev.keluarga_id || "",
    };
    if (s.id) {
      idMap[s.nama] = s.id;
    }
  });

  (window as any).studentData = sData;
  (window as any).studentFirebaseIds = idMap;
  localStorage.setItem("bunyiKataStudentData", JSON.stringify(sData));
  localStorage.setItem("bunyiKataStudentFirebaseIds", JSON.stringify(idMap));

  if (typeof (window as any).updateStudentDropdown === "function") {
    (window as any).updateStudentDropdown();
  }
}

export function EntryChoiceModal(props: EntryChoiceModalProps) {
  const {
    isEntryChoiceModalOpen,
    setIsEntryChoiceModalOpen,
    isCodeModalOpen,
    setIsCodeModalOpen,
    joinCode,
    setJoinCode,
    setIsModeMenuOpen,
    setIsModeChoiceOpen,
    setIsAdminActive,
    setUserAccessLevel,
    setShowLoginModal,
    setPendingLoginMode,
    setAuthModalTab,
    setLoginEmail,
    setLoginPassword,
    setRegGuruNama,
    setRegGuruSekolah,
    setRegNamaKeluarga,
    setAuthModalError,
  } = props;

  return (
    <>
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
                      margin: "0 auto 16px auto",
                      display: "inline-block",
                      pointerEvents: "none",
                      padding: "8px 24px",
                      lineHeight: "1.2",
                      fontWeight: "900",
                      borderRadius: "12px",
                    }}
                  >
                    Pilih Cara Mula
                  </div>

                  {/* 1. Butang Cuba Percuma di ATAS (Reka bentuk menarik & menonjol tanpa teks panjang) */}
                  <button
                    type="button"
                    className="neo-box"
                    style={{
                      cursor: "pointer",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                      border: "3px solid var(--color-dark, #10182f)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      transition: "transform 0.1s ease",
                      marginBottom: "16px",
                      animation:
                        "outlineGlowGold 2.5s infinite, pulse-scale 2.5s infinite ease-in-out",
                    }}
                    onClick={() => {
                      if (typeof (window as any).playBubble === "function") (window as any).playBubble();
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          backgroundColor: "#10b981",
                          border: "2.5px solid var(--color-dark, #10182f)",
                          boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "1.25rem",
                          flexShrink: 0,
                        }}
                      >
                        <i className="fa-solid fa-play"></i>
                      </div>
                      <span
                        style={{
                          fontWeight: "900",
                          fontSize: "1.15rem",
                          color: "#10182f",
                        }}
                      >
                        Cuba Percuma
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "900",
                          color: "#ffffff",
                          backgroundColor: "#f59e0b",
                          border: "1.5px solid var(--color-dark, #10182f)",
                          boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                          padding: "3px 8px",
                          borderRadius: "8px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        PERCUMA
                      </span>
                      <i className="fa-solid fa-chevron-right" style={{ color: "var(--color-dark, #10182f)", fontSize: "1.1rem" }}></i>
                    </div>
                  </button>

                  {/* Garis Pemisah dengan Teks Halus */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      margin: "0 0 14px 0",
                    }}
                  >
                    <div style={{ flex: 1, borderTop: "2px dashed #cbd5e1" }}></div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "800",
                        color: "#64748b",
                        letterSpacing: "0.5px",
                      }}
                    >
                      atau akses penuh
                    </span>
                    <div style={{ flex: 1, borderTop: "2px dashed #cbd5e1" }}></div>
                  </div>

                  {/* 2. Ruangan Masukkan Kod 8 Aksara */}
                  <input
                    type="text"
                    className="neo-input century-gothic-font"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      textAlign: "center",
                      fontSize: "1.15rem",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                    placeholder="Masukkan Kod 8 Aksara"
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />

                  {/* Butang Sahkan Kod */}
                  <button
                    className="neo-btn"
                    style={{
                      width: "100%",
                      padding: "11px",
                      color: "white",
                      fontSize: "1.08rem",
                      backgroundColor: "#168f81",
                      fontWeight: "900",
                      borderRadius: "12px",
                      boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                      cursor: "pointer",
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

                      // Mod admin: kod TIDAK disemak di sini. Ia dihantar ke
                      // pelayan (/api/admin/verify) yang memegang ADMIN_CODE.
                      // Ini mengelakkan kod admin daripada terbenam dalam
                      // bundle JavaScript yang boleh dibaca sesiapa.
                      const hasilAdmin = await cubaAksesAdmin(entered);
                      if (hasilAdmin.berjaya) {
                        setIsEntryChoiceModalOpen(false);
                        setIsCodeModalOpen(false);
                        setUserAccessLevel("pro");
                        tetapkanSesiAdminTempatan();
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
                        (window as any).isGuestMode = false;

                        try {
                          let remoteStudents = await getStudentsByCode(entered);
                          if (remoteStudents && remoteStudents.length > 0) {
                            syncRemoteStudentsToLocal(remoteStudents, false);
                          }
                        } catch (syncErr) {
                          console.warn("Fetch class students error:", syncErr);
                        }

                        setIsEntryChoiceModalOpen(false);
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
                        (window as any).isGuestMode = false;

                        try {
                          let remoteChildren = await getStudentsByCode(entered);
                          if (remoteChildren && remoteChildren.length > 0) {
                            syncRemoteStudentsToLocal(remoteChildren, true);
                          }
                        } catch (syncErr) {
                          console.warn("Fetch family children error:", syncErr);
                        }

                        setIsEntryChoiceModalOpen(false);
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
                            (window as any).isGuestMode = false;
                            localStorage.setItem("bunyiKataKodKelas", cls.kod_kelas);
                            localStorage.setItem("bunyiKataNamaSekolah", cls.nama_sekolah);
                            localStorage.setItem("pdf_sekolah", cls.nama_sekolah);
                            if (cls.nama_guru) localStorage.setItem("bunyiKataNamaGuru", cls.nama_guru);
                            if (cls.nama_kelas) localStorage.setItem("bunyiKataNamaKelas", cls.nama_kelas);

                            try {
                              let remoteStudents = await getStudentsByCode(entered);
                              if ((!remoteStudents || remoteStudents.length === 0) && cls.id) {
                                remoteStudents = await getStudentsByClassId(cls.id);
                              }
                              if (remoteStudents && remoteStudents.length > 0) {
                                syncRemoteStudentsToLocal(remoteStudents, false);
                              }
                            } catch (syncErr) {
                              console.warn("Fetch class students notice:", syncErr);
                            }

                            setIsEntryChoiceModalOpen(false);
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
                                  Akses Kelas PRO (${cls.nama_kelas || 'Kelas'}) berjaya disahkan! Sila pilih profil murid.
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
                            (window as any).isGuestMode = false;
                            localStorage.setItem("bunyiKataKodKeluarga", fam.kod_keluarga);
                            localStorage.setItem("bunyiKataNamaKeluarga", fam.nama_keluarga);

                            try {
                              let remoteChildren = await getStudentsByCode(entered);
                              if ((!remoteChildren || remoteChildren.length === 0) && fam.id) {
                                remoteChildren = await getStudentsByFamilyId(fam.id);
                              }
                              if (remoteChildren && remoteChildren.length > 0) {
                                syncRemoteStudentsToLocal(remoteChildren, true);
                              }
                            } catch (syncErr) {
                              console.warn("Fetch family children notice:", syncErr);
                            }

                            setIsEntryChoiceModalOpen(false);
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
                                  Akses Keluarga PRO (${fam.nama_keluarga || 'Keluarga'}) berjaya disahkan! Sila pilih profil anak.
                                </p>`
                              );
                            }
                            return;
                          }

                          // Semakan langsung jika kod didaftarkan pada profil murid itu sendiri
                          const directStudents = await getStudentsByCode(entered);
                          if (directStudents && directStudents.length > 0) {
                            setUserAccessLevel("pro");
                            localStorage.setItem("bunyiKataAccessLevel", "pro");
                            (window as any).userAccessLevel = "pro";
                            (window as any).isGuestMode = false;
                            syncRemoteStudentsToLocal(directStudents, false);

                            setIsEntryChoiceModalOpen(false);
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
                                  Akses PRO berjaya disahkan! Sila pilih profil murid.
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

                  {/* Nota ringkas di bawah ruangan kod */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginTop: "7px",
                      textAlign: "center",
                    }}
                  >
                    * Kod 8 aksara unik (cth: <strong style={{ color: "#334155" }}>ABCD@123</strong>)
                  </div>

                  {/* Garis Pemisah Putus-putus */}
                  <div
                    style={{
                      borderTop: "2px dashed #cbd5e1",
                      margin: "16px 0 14px 0",
                    }}
                  ></div>

                  {/* 2 Butang Mod: Guru & Ibubapa Bersebelahan */}
                  <div
                    style={{ display: "flex", gap: "10px", marginBottom: "14px" }}
                  >
                    <button
                      className="neo-btn bg-orange"
                      style={{
                        flex: 1,
                        padding: "10px",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        setIsEntryChoiceModalOpen(false);
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
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        setIsEntryChoiceModalOpen(false);
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
                      fontSize: "0.84rem",
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
                        setIsEntryChoiceModalOpen(false);
                        setIsModeChoiceOpen(true);
                      }}
                    >
                      dapatkan di sini
                    </span>
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

                      // Lihat komen pada laluan admin di atas: pengesahan kod
                      // admin dibuat di pelayan, bukan di dalam bundle klien.
                      const hasilAdmin2 = await cubaAksesAdmin(entered);
                      if (hasilAdmin2.berjaya) {
                        setIsCodeModalOpen(false);
                        setUserAccessLevel("pro");
                        tetapkanSesiAdminTempatan();
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
                        (window as any).isGuestMode = false;

                        try {
                          let remoteStudents = await getStudentsByCode(entered);
                          if (remoteStudents && remoteStudents.length > 0) {
                            syncRemoteStudentsToLocal(remoteStudents, false);
                          }
                        } catch (syncErr) {
                          console.warn("Fetch class students error:", syncErr);
                        }

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
                        (window as any).isGuestMode = false;

                        try {
                          let remoteChildren = await getStudentsByCode(entered);
                          if (remoteChildren && remoteChildren.length > 0) {
                            syncRemoteStudentsToLocal(remoteChildren, true);
                          }
                        } catch (syncErr) {
                          console.warn("Fetch family children error:", syncErr);
                        }

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
                            (window as any).isGuestMode = false;
                            localStorage.setItem("bunyiKataKodKelas", cls.kod_kelas);
                            localStorage.setItem("bunyiKataNamaSekolah", cls.nama_sekolah);
                            localStorage.setItem("pdf_sekolah", cls.nama_sekolah);
                            if (cls.nama_guru) localStorage.setItem("bunyiKataNamaGuru", cls.nama_guru);
                            if (cls.nama_kelas) localStorage.setItem("bunyiKataNamaKelas", cls.nama_kelas);

                            try {
                              let remoteStudents = await getStudentsByCode(entered);
                              if ((!remoteStudents || remoteStudents.length === 0) && cls.id) {
                                remoteStudents = await getStudentsByClassId(cls.id);
                              }
                              if (remoteStudents && remoteStudents.length > 0) {
                                syncRemoteStudentsToLocal(remoteStudents, false);
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
                                  Akses Kelas PRO (${cls.nama_kelas || 'Kelas'}) berjaya disahkan! Sila pilih profil murid.
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
                            (window as any).isGuestMode = false;
                            localStorage.setItem("bunyiKataKodKeluarga", fam.kod_keluarga);
                            localStorage.setItem("bunyiKataNamaKeluarga", fam.nama_keluarga);

                            try {
                              let remoteChildren = await getStudentsByCode(entered);
                              if ((!remoteChildren || remoteChildren.length === 0) && fam.id) {
                                remoteChildren = await getStudentsByFamilyId(fam.id);
                              }
                              if (remoteChildren && remoteChildren.length > 0) {
                                syncRemoteStudentsToLocal(remoteChildren, true);
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
                                  Akses Keluarga PRO (${fam.nama_keluarga || 'Keluarga'}) berjaya disahkan! Sila pilih profil anak.
                                </p>`
                              );
                            }
                            return;
                          }

                          // Semakan langsung jika kod didaftarkan pada profil murid itu sendiri
                          const directStudents = await getStudentsByCode(entered);
                          if (directStudents && directStudents.length > 0) {
                            setUserAccessLevel("pro");
                            localStorage.setItem("bunyiKataAccessLevel", "pro");
                            (window as any).userAccessLevel = "pro";
                            (window as any).isGuestMode = false;
                            syncRemoteStudentsToLocal(directStudents, false);

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
                                  Akses PRO berjaya disahkan! Sila pilih profil murid.
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

                  {/* Nota ringkas di bawah ruangan kod */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginTop: "7px",
                      textAlign: "center",
                    }}
                  >
                    * Kod 8 aksara unik (cth: <strong style={{ color: "#334155" }}>ABCD@123</strong>)
                  </div>

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
                        setIsModeChoiceOpen(true);
                      }}
                    >
                      dapatkan di sini
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          
    </>
  );
}
