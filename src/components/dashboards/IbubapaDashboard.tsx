// @ts-nocheck
import React from "react";

interface IbubapaDashboardProps {
  getScreenClass: (id: string, extraClasses?: string) => string;
  getSubscriptionBadgeInfo: (role: "guru" | "ibubapa") => any;
  onOpenProPricing: () => void;
  onEditProfile: () => void;
}

export function IbubapaDashboard({
  getScreenClass,
  getSubscriptionBadgeInfo,
  onOpenProPricing,
  onEditProfile,
}: IbubapaDashboardProps) {
  React.useEffect(() => {
    // Jadual Sejarah Langganan (hanya rekod ibu bapa ini)
    const muat = () => {
      if (typeof (window as any).muatSejarahLangganan === "function") {
        (window as any).muatSejarahLangganan("ibubapa");
      } else if (typeof (window as any).renderSejarahLangganan === "function") {
        (window as any).renderSejarahLangganan("ibubapa");
      }
    };
    muat();
    const t = setTimeout(muat, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
      <div
        id="ibubapa-dashboard"
        className={getScreenClass("ibubapa-dashboard")}
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
                        onClick={() => { (window as any).bkSfx?.press?.(); onOpenProPricing(); }}
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
                (window as any).bkSfx?.press?.();
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
              onClick={() => { (window as any).bkSfx?.press?.(); onEditProfile(); }}
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
                (window as any).bkSfx?.press?.();
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
                (window as any).bkSfx?.press?.();
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

        {/* Jadual Sejarah Langganan (Ibu Bapa — hanya rekod sendiri) */}
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
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              id="ibubapa-sejarah-langganan-title"
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
            <table className="teacher-table" style={{ width: "100%", minWidth: "580px" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
                  <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 8px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)", width: "48px", minWidth: "48px" }}>
                    BIL.
                  </th>
                  <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: "140px" }}>
                    NAMA
                  </th>
                  <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: "125px" }}>
                    TARIKH LANGGANAN
                  </th>
                  <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: "140px" }}>
                    TARIKH TAMAT LANGGANAN
                  </th>
                  <th style={{ textAlign: "center", textTransform: "uppercase", padding: "10px 12px", fontSize: "0.82rem", fontWeight: "bold", borderBottom: "2px solid #042f2e", minWidth: "127px" }}>
                    JENIS LANGGANAN
                  </th>
                </tr>
              </thead>
              <tbody id="ibubapa-sejarah-langganan-body">
                {/* Populated by window.renderSejarahLangganan('ibubapa') */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
