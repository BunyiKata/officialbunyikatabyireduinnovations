// @ts-nocheck
/**
 * Panel Affiliate (Fasa 3 — Affiliate Login).
 *
 * Affiliate log masuk dengan emel + kata laluan (Firebase Auth). Kod affiliate
 * mereka TIDAK dihantar dari klien: pelayan membacanya daripada claim
 * `affiliate_kod` dalam ID token. Komponen ini hanya memanggil
 * /api/affiliate/me + /api/affiliate/referrals dan memaparkan hasilnya.
 */
import React from "react";
import {
  ambilProfilAffiliate,
  ambilReferralSendiri,
  type ProfilAffiliate,
  type RingkasanAffiliate,
  type ReferralAffiliate,
} from "../../services/adminService";

interface AffiliateDashboardProps {
  getScreenClass: (id: string, extraClasses?: string) => string;
  onLogout: () => void;
}

const UNGU = "#7c3aed";
const UNGU_GELAP = "#5b21b6";

function formatRM(sen?: number): string {
  const nilai = (Number(sen) || 0) / 100;
  return `RM ${nilai.toFixed(2)}`;
}

function formatTarikh(iso?: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function lencanaStatus(status: string): { teks: string; bg: string; warna: string } {
  switch (status) {
    case "dibayar":
      return { teks: "Dibayar", bg: "#dcfce7", warna: "#15803d" };
    case "batal":
      return { teks: "Batal", bg: "#fee2e2", warna: "#b91c1c" };
    default:
      return { teks: "Sah", bg: "#fef3c7", warna: "#b45309" };
  }
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "9px 10px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "9px 10px",
  whiteSpace: "nowrap",
};


export function AffiliateDashboard({ getScreenClass, onLogout }: AffiliateDashboardProps) {
  const [profil, setProfil] = React.useState<ProfilAffiliate | null>(null);
  const [ringkasan, setRingkasan] = React.useState<RingkasanAffiliate | null>(null);
  const [referral, setReferral] = React.useState<ReferralAffiliate[]>([]);
  const [memuat, setMemuat] = React.useState(true);
  const [ralat, setRalat] = React.useState("");
  const [salin, setSalin] = React.useState("");

  React.useEffect(() => {
    let batal = false;
    (async () => {
      setMemuat(true);
      setRalat("");
      const [hasilProfil, senarai] = await Promise.all([
        ambilProfilAffiliate(),
        ambilReferralSendiri(),
      ]);
      if (batal) return;
      if (!hasilProfil.berjaya || !hasilProfil.affiliate) {
        setRalat(hasilProfil.mesej || "Gagal memuatkan profil affiliate.");
      } else {
        setProfil(hasilProfil.affiliate);
        setRingkasan(hasilProfil.ringkasan || null);
      }
      setReferral(senarai);
      setMemuat(false);
    })();
    return () => {
      batal = true;
    };
  }, []);

  const pautanRujukan =
    profil?.kod && typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${profil.kod}`
      : "";

  const salinTeks = async (teks: string, label: string) => {
    if (!teks) return;
    try {
      await navigator.clipboard.writeText(teks);
      setSalin(label);
      setTimeout(() => setSalin(""), 2000);
    } catch {
      // Fallback untuk pelayar tanpa clipboard API.
      const ta = document.createElement("textarea");
      ta.value = teks;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setSalin(label);
        setTimeout(() => setSalin(""), 2000);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  const kadStat = [
    { label: "Jumlah Jualan", nilai: formatRM(ringkasan?.jumlah_jualan_sen), ikon: "fa-cart-shopping" },
    { label: "Komisen Keseluruhan", nilai: formatRM(ringkasan?.komisen_keseluruhan_sen), ikon: "fa-coins" },
    { label: "Telah Dibayar", nilai: formatRM(ringkasan?.dibayar_sen), ikon: "fa-circle-check" },
    { label: "Baki Belum Dibayar", nilai: formatRM(ringkasan?.baki_sen), ikon: "fa-hourglass-half" },
  ];

  return (
    <div id="affiliate-dashboard" className={getScreenClass("affiliate-dashboard")}>
      {/* Kepala ungu */}
      <div
        className="neo-box"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto 20px",
          padding: "20px",
          backgroundColor: UNGU,
          backgroundImage:
            "linear-gradient(to bottom, transparent 50%, " + UNGU + " 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
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
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-sitemap" style={{ fontSize: "1.5rem" }}></i>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: "clamp(1.3rem, 4vw, 1.9rem)" }}>
                Panel Affiliate
              </h2>
            </div>
            <p style={{ margin: "8px 0 0", opacity: 0.95 }}>
              {profil ? (
                <>
                  Selamat datang, <b>{profil.nama}</b>
                  {profil.status && profil.status !== "aktif" ? ` (${profil.status})` : ""}
                </>
              ) : (
                "Selamat datang!"
              )}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="neo-btn"
            style={{
              background: "#ffffff",
              color: UNGU_GELAP,
              border: "2px solid #0f172a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 3px 0 #0f172a",
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Log Keluar
          </button>
        </div>
      </div>


      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        {memuat && (
          <div className="neo-box" style={{ padding: "24px", textAlign: "center", marginBottom: "18px" }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Memuatkan data affiliate…
          </div>
        )}

        {!memuat && ralat && (
          <div
            className="neo-box"
            style={{
              padding: "18px",
              marginBottom: "18px",
              background: "#fee2e2",
              color: "#b91c1c",
              border: "2px solid #b91c1c",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> {ralat}
          </div>
        )}

        {!memuat && profil && (
          <>
            {/* Kad kod + pautan rujukan */}
            <div
              className="neo-box"
              style={{
                padding: "18px",
                marginBottom: "18px",
                background: "#ffffff",
                border: `2px dashed ${UNGU}`,
                borderRadius: "16px",
                boxShadow: "0 3px 0 #0f172a",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px", flexWrap: "wrap" }}>
                <i className="fa-solid fa-key" style={{ color: UNGU }}></i>
                <b>Kod Affiliate:</b>
                <span
                  style={{
                    background: "#f5f3ff",
                    padding: "2px 10px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    border: "1px solid #c4b5fd",
                    letterSpacing: "1px",
                  }}
                >
                  {profil.kod}
                </span>
                <button
                  onClick={() => salinTeks(profil.kod, "kod")}
                  className="neo-btn"
                  style={{ padding: "3px 10px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  {salin === "kod" ? "✓ Disalin" : "Salin"}
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
                <i className="fa-solid fa-link" style={{ color: UNGU }}></i>
                <b>Pautan Khas:</b>
                <span style={{ color: UNGU_GELAP, fontWeight: 600, fontSize: "0.85rem", wordBreak: "break-all" }}>
                  {pautanRujukan}
                </span>
                <button
                  onClick={() => salinTeks(pautanRujukan, "pautan")}
                  className="neo-btn"
                  style={{ padding: "3px 10px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  {salin === "pautan" ? "✓ Disalin" : "Salin"}
                </button>
              </div>
            </div>


            {/* Statistik */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              {kadStat.map((k) => (
                <div
                  key={k.label}
                  className="neo-box"
                  style={{
                    padding: "16px",
                    background: "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0 3px 0 #0f172a",
                    textAlign: "left",
                  }}
                >
                  <div style={{ color: UNGU, fontSize: "1.2rem", marginBottom: "6px" }}>
                    <i className={`fa-solid ${k.ikon}`}></i>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "4px" }}>{k.label}</div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 900 }}>{k.nilai}</div>
                </div>
              ))}
            </div>


            {/* Jadual rujukan */}
            <div
              className="neo-box"
              style={{
                padding: "18px",
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 3px 0 #0f172a",
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 14px", fontWeight: 900 }}>
                <i className="fa-solid fa-list-check" style={{ color: UNGU }}></i> Rujukan &amp; Komisen
              </h3>
              {referral.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>
                  Belum ada rujukan. Kongsi pautan khas anda untuk mula mengumpul komisen.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ background: "#f5f3ff", color: UNGU_GELAP }}>
                        <th style={thStyle}>Pelanggan</th>
                        <th style={thStyle}>Pakej</th>
                        <th style={thStyle}>Harga</th>
                        <th style={thStyle}>Komisen</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Tarikh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referral.map((r) => {
                        const l = lencanaStatus(r.status);
                        return (
                          <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={tdStyle}>{r.pelanggan_nama || "-"}</td>
                            <td style={tdStyle}>{r.nama_pakej || "-"}</td>
                            <td style={tdStyle}>{formatRM(r.harga_sen)}</td>
                            <td style={{ ...tdStyle, fontWeight: 700, color: UNGU_GELAP }}>
                              {formatRM(r.komisen_sen)}
                            </td>
                            <td style={tdStyle}>
                              <span
                                style={{
                                  background: l.bg,
                                  color: l.warna,
                                  padding: "2px 9px",
                                  borderRadius: "20px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                }}
                              >
                                {l.teks}
                              </span>
                            </td>
                            <td style={tdStyle}>{formatTarikh(r.tarikh_beli)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

