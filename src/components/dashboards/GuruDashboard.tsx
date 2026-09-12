// @ts-nocheck
import React from "react";
import { syncTeacherClasses } from "../../services/firebaseService";

export interface GuruDashboardProps {
  getScreenClass: (id: string, extraClasses?: string) => string;
  userAccessLevel: "trial" | "pro";
  isEffectiveTrial: boolean;
  isEffectivePro: boolean;
  getSubscriptionBadgeInfo: (role: "guru" | "ibubapa") => any;
  isReportDialOpen: boolean;
  setIsReportDialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showExportModal: boolean;
  setShowExportModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGuruSijilModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedExportPeta: any;
  setSelectedExportPeta: React.Dispatch<React.SetStateAction<any>>;
  exportSchoolInput: string;
  setExportSchoolInput: React.Dispatch<React.SetStateAction<string>>;
  exportClassInput: string;
  setExportClassInput: React.Dispatch<React.SetStateAction<string>>;
  exportTeacherInput: string;
  setExportTeacherInput: React.Dispatch<React.SetStateAction<string>>;
  setIsProPricingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditModalError: React.Dispatch<React.SetStateAction<string>>;
  setIsMandatorySetup: React.Dispatch<React.SetStateAction<boolean>>;
  setTeacherCanHaveClass2: React.Dispatch<React.SetStateAction<boolean>>;
  setTeacherPlanName: React.Dispatch<React.SetStateAction<string>>;
  setEditKodTemp: React.Dispatch<React.SetStateAction<string>>;
  setEditKelasTemp: React.Dispatch<React.SetStateAction<string>>;
  setEditSekolahTemp: React.Dispatch<React.SetStateAction<string>>;
  setEditAvatarTemp: React.Dispatch<React.SetStateAction<string>>;
  setEditGuruTemp: React.Dispatch<React.SetStateAction<string>>;
  setEditModalMode: React.Dispatch<React.SetStateAction<string>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditKod2Temp: React.Dispatch<React.SetStateAction<string>>;
  setEditKelas2Temp: React.Dispatch<React.SetStateAction<string>>;
  editKodTemp: string;
  editKelasTemp: string;
  editKod2Temp: string;
  editKelas2Temp: string;
  teacherCanHaveClass2: boolean;
  isChangingCode1: boolean;
  setIsChangingCode1: React.Dispatch<React.SetStateAction<boolean>>;
  newCode1Input: string;
  setNewCode1Input: React.Dispatch<React.SetStateAction<string>>;
  isChangingCode2: boolean;
  setIsChangingCode2: React.Dispatch<React.SetStateAction<boolean>>;
  newCode2Input: string;
  setNewCode2Input: React.Dispatch<React.SetStateAction<string>>;
  isChangingClassName1: boolean;
  setIsChangingClassName1: React.Dispatch<React.SetStateAction<boolean>>;
  newClassName1Input: string;
  setNewClassName1Input: React.Dispatch<React.SetStateAction<string>>;
  isChangingClassName2: boolean;
  setIsChangingClassName2: React.Dispatch<React.SetStateAction<boolean>>;
  newClassName2Input: string;
  setNewClassName2Input: React.Dispatch<React.SetStateAction<string>>;
  handleSaveClassName1: (name: string) => Promise<void>;
  handleSaveClassCode1: (code: string) => Promise<void>;
  handleSaveClassName2: (name: string) => Promise<void>;
  handleSaveClassCode2: (code: string) => Promise<void>;
}

export function GuruDashboard(props: GuruDashboardProps) {
  const {
    getScreenClass,
    userAccessLevel,
    isEffectiveTrial,
    isEffectivePro,
    getSubscriptionBadgeInfo,
    isReportDialOpen,
    setIsReportDialOpen,
    showExportModal,
    setShowExportModal,
    setShowGuruSijilModal,
    selectedExportPeta,
    setSelectedExportPeta,
    exportSchoolInput,
    setExportSchoolInput,
    exportClassInput,
    setExportClassInput,
    exportTeacherInput,
    setExportTeacherInput,
    setIsProPricingModalOpen,
    setEditModalError,
    setIsMandatorySetup,
    setTeacherCanHaveClass2,
    setTeacherPlanName,
    setEditKodTemp,
    setEditKelasTemp,
    setEditSekolahTemp,
    setEditAvatarTemp,
    setEditGuruTemp,
    setEditModalMode,
    setIsEditModalOpen,
    setEditKod2Temp,
    setEditKelas2Temp,
    editKodTemp,
    editKelasTemp,
    editKod2Temp,
    editKelas2Temp,
    teacherCanHaveClass2,
    isChangingCode1,
    setIsChangingCode1,
    newCode1Input,
    setNewCode1Input,
    isChangingCode2,
    setIsChangingCode2,
    newCode2Input,
    setNewCode2Input,
    isChangingClassName1,
    setIsChangingClassName1,
    newClassName1Input,
    setNewClassName1Input,
    isChangingClassName2,
    setIsChangingClassName2,
    newClassName2Input,
    setNewClassName2Input,
    handleSaveClassName1,
    handleSaveClassCode1,
    handleSaveClassName2,
    handleSaveClassCode2,
  } = props;

  const [syncedVersion, setSyncedVersion] = React.useState(0);
  const [activeClassName, setActiveClassName] = React.useState(() => localStorage.getItem("bunyiKataNamaKelas") || "");
  const [activeClassCode, setActiveClassCode] = React.useState(() => localStorage.getItem("bunyiKataKodKelas") || "");
  const [activeSchoolName, setActiveSchoolName] = React.useState(() => localStorage.getItem("bunyiKataNamaSekolah") || "");
  const [activeTeacherName, setActiveTeacherName] = React.useState(() => localStorage.getItem("bunyiKataNamaGuru") || localStorage.getItem("pdf_guru") || "");

  React.useEffect(() => {
    const handleSync = () => {
      setSyncedVersion((v) => v + 1);
      setActiveClassName(localStorage.getItem("bunyiKataNamaKelas") || "");
      setActiveClassCode(localStorage.getItem("bunyiKataKodKelas") || "");
      setActiveSchoolName(localStorage.getItem("bunyiKataNamaSekolah") || "");
      setActiveTeacherName(localStorage.getItem("bunyiKataNamaGuru") || localStorage.getItem("pdf_guru") || "");
    };
    window.addEventListener("teacher-classes-synced", handleSync);
    window.addEventListener("focus", handleSync);
    handleSync();

    // Jadual Sejarah Langganan (hanya rekod guru ini)
    const muatSejarah = () => {
      if (typeof (window as any).muatSejarahLangganan === "function") {
        (window as any).muatSejarahLangganan("guru");
      } else if (typeof (window as any).renderSejarahLangganan === "function") {
        (window as any).renderSejarahLangganan("guru");
      }
    };
    muatSejarah();
    const sejarahTimer = setTimeout(muatSejarah, 1200);

    return () => {
      clearTimeout(sejarahTimer);
      window.removeEventListener("teacher-classes-synced", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  const currentStudentCount = React.useMemo(() => {
    try {
      const sData = JSON.parse(localStorage.getItem("bunyiKataStudentData") || "{}");
      const sNames = JSON.parse(localStorage.getItem("bunyiKataStudentNames") || "[]");
      const activeClass = (localStorage.getItem("bunyiKataNamaKelas") || "").trim().toLowerCase();
      const GHOST_NAMES = ["tetamu", "murid", "guest", "student"];
      const teacherName = (localStorage.getItem("bunyiKataNamaGuru") || localStorage.getItem("pdf_guru") || "").trim().toLowerCase();

      let count = 0;
      const list = Array.isArray(sNames) && sNames.length > 0 ? sNames : Object.keys(sData);
      list.forEach((n: string) => {
        const lower = (n || "").trim().toLowerCase();
        if (!lower || GHOST_NAMES.includes(lower) || lower === teacherName) return;
        const data = sData[n] || {};
        const sKelas = (data.kelas || "").trim().toLowerCase();
        if (!activeClass || !sKelas || sKelas === activeClass) {
          count++;
        }
      });
      return count;
    } catch (e) {
      return 0;
    }
  }, [syncedVersion, activeClassName]);

  const currentAktivitiCount = React.useMemo(() => {
    try {
      const sData = JSON.parse(localStorage.getItem("bunyiKataStudentData") || "{}");
      let total = 0;
      Object.values(sData).forEach((data: any) => {
        if (data && data.latihan) {
          Object.values(data.latihan).forEach((done) => {
            if (done) total++;
          });
        }
      });
      return total;
    } catch (e) {
      return 0;
    }
  }, [syncedVersion]);

  return (
    <>
      <div
        id="guru-dashboard"
        className={getScreenClass("guru-dashboard")}
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
                {activeClassName || localStorage.getItem("bunyiKataNamaKelas") || "(Belum Tetap Kelas)"}
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
                  Sekolah: <span id="guru-dashboard-nama-sekolah-title">{activeSchoolName || localStorage.getItem("bunyiKataNamaSekolah") || "SK TAMAN MELAWIS"}</span>
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
                  Guru: <span id="guru-dashboard-nama-guru-title">{activeTeacherName || localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "-"}</span>
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
                      Kod Kelas: <span id="guru-dashboard-kod-kelas-title">{activeClassCode || localStorage.getItem("bunyiKataKodKelas") || "-"}</span>
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
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                if (typeof (window as any).bukaSetupModal === "function") {
                  (window as any).bukaSetupModal("guru", false);
                } else {
                  setEditModalError("");
                  setIsMandatorySetup(false);
                  setEditModalMode("guru");
                  (window as any).modAdminAktif = false;
                  (window as any).modIbuBapaAktif = false;
                  (window as any).modGuruAktif = true;
                  setEditSekolahTemp((localStorage.getItem("bunyiKataNamaSekolah") || "").toUpperCase());
                  setEditGuruTemp((localStorage.getItem("pdf_guru") || localStorage.getItem("bunyiKataNamaGuru") || "").toUpperCase());
                  setEditKelasTemp((localStorage.getItem("bunyiKataNamaKelas") || "").toUpperCase());
                  setEditKodTemp((localStorage.getItem("bunyiKataKodKelas") || "").toUpperCase());
                  setEditKod2Temp((localStorage.getItem("bunyiKataKodKelas2") || "").toUpperCase());
                  setEditKelas2Temp((localStorage.getItem("bunyiKataNamaKelas2") || "").toUpperCase());
                  setIsChangingCode1(false);
                  setIsChangingCode2(false);
                  setIsChangingClassName1(false);
                  setIsChangingClassName2(false);
                  setIsEditModalOpen(true);
                }
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
                {currentStudentCount}
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
                {currentAktivitiCount}
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

        {/* Jadual Sejarah Langganan (Guru — hanya rekod sendiri) */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
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
                id="guru-sejarah-langganan-title"
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
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                  Sejarah Langganan
                </span>
              </div>
            </div>
            <div
              className="table-responsive sejarah-langganan-wrapper"
              style={{
                overflowX: "auto",
                borderRadius: "12px",
                border: "2px solid var(--color-dark)",
                minHeight: "auto",
                marginTop: 0,
              }}
            >
              <table className="teacher-table" style={{ width: "100%", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
                    <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 8px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)", width: "50px" }}>
                      BIL
                    </th>
                    <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
                      NAMA
                    </th>
                    <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
                      TARIKH LANGGANAN
                    </th>
                    <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
                      TARIKH TAMAT LANGGANAN
                    </th>
                    <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e" }}>
                      JENIS LANGGANAN
                    </th>
                  </tr>
                </thead>
                <tbody id="guru-sejarah-langganan-body">
                  {/* Populated by window.renderSejarahLangganan('guru') */}
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

    </>
  );
}
