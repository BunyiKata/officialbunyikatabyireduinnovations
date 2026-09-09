// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "motion/react";

export interface PricingProModalProps {
  isOpen: boolean;
  initialTab?: "guru" | "ibubapa";
  onClose: () => void;
  onSelectPlanRegister: (category: "guru" | "ibubapa") => void;
}

export function PricingProModal({
  isOpen,
  initialTab = "guru",
  onClose,
  onSelectPlanRegister,
}: PricingProModalProps) {
  const [activePakejCategory, setActivePakejCategory] = React.useState<"guru" | "ibubapa">(initialTab);
  const [activeFaqId, setActiveFaqId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActivePakejCategory(initialTab);
    }
  }, [initialTab]);

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
                    onClick={onClose}
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
                            onClose();
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              onSelectPlanRegister(activePakejCategory);
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
                            onClose();
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              onSelectPlanRegister(activePakejCategory);
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
                            onClose();
                            const isUserLoggedIn = (window as any).currentUser || (window as any).isLoggedIn || ((window as any).userAccessLevel && (window as any).userAccessLevel !== "trial");
                            if (isUserLoggedIn) {
                              window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                            } else {
                              onSelectPlanRegister(activePakejCategory);
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
  );
}
