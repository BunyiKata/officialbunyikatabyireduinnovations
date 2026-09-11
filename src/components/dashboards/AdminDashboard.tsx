// @ts-nocheck
import React from "react";

interface AdminDashboardProps {
  getScreenClass: (id: string, extraClasses?: string) => string;
}

export function AdminDashboard({ getScreenClass }: AdminDashboardProps) {
  React.useEffect(() => {
    if (typeof (window as any).renderAdminTable === "function") {
      try {
        const sel = document.getElementById("admin-table-selector") as HTMLSelectElement | null;
        (window as any).renderAdminTable(sel ? sel.value : "guru");
      } catch (e) {
        console.warn("renderAdminTable error in useEffect:", e);
      }
    }

    const fetchFn = (window as any).fetchAdminDataFromFirebase;
    if (typeof fetchFn === "function") {
      fetchFn()
        .then(() => {
          if (typeof (window as any).renderAdminTable === "function") {
            const sel = document.getElementById("admin-table-selector") as HTMLSelectElement | null;
            (window as any).renderAdminTable(sel ? sel.value : "guru");
          }
        })
        .catch((err: any) => console.warn("Fetch admin data notice:", err));
    }
  }, []);

  return (
    <>
      <div
        id="admin-dashboard"
        className={getScreenClass("admin-dashboard")}
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
      <div id="admin-urus" className={getScreenClass("admin-urus")}>
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

    </>
  );
}
