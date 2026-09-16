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
import { hubungiAdminWhatsapp } from "../../config/contactAdmin";

interface AffiliateDashboardProps {
  getScreenClass: (id: string, extraClasses?: string) => string;
  onLogout: () => void;
  onEditProfile?: () => void;
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


export function AffiliateDashboard({ getScreenClass, onLogout, onEditProfile }: AffiliateDashboardProps) {
  const [profil, setProfil] = React.useState<ProfilAffiliate | null>(null);
  const [ringkasan, setRingkasan] = React.useState<RingkasanAffiliate | null>(null);
  const [referral, setReferral] = React.useState<ReferralAffiliate[]>([]);
  const [memuat, setMemuat] = React.useState(true);
  const [ralat, setRalat] = React.useState("");
  const [salin, setSalin] = React.useState("");

  const muatData = React.useCallback(async () => {
    setMemuat(true);
    setRalat("");
    const [hasilProfil, senarai] = await Promise.all([
      ambilProfilAffiliate(),
      ambilReferralSendiri(),
    ]);
    if (!hasilProfil.berjaya || !hasilProfil.affiliate) {
      setRalat(hasilProfil.mesej || "Gagal memuatkan profil affiliate.");
    } else {
      setProfil(hasilProfil.affiliate);
      setRingkasan(hasilProfil.ringkasan || null);
      if (hasilProfil.affiliate.kod) {
        localStorage.setItem("bunyiKataAffiliateKod", hasilProfil.affiliate.kod);
        (window as any).bunyiKataAffiliateKod = hasilProfil.affiliate.kod;
      }
      if (hasilProfil.affiliate.email) {
        localStorage.setItem("bunyiKataAffiliateEmail", hasilProfil.affiliate.email);
        (window as any).bunyiKataAffiliateEmail = hasilProfil.affiliate.email;
      }
      if (hasilProfil.affiliate.nama) {
        localStorage.setItem("bunyiKataNamaAffiliate", hasilProfil.affiliate.nama);
        (window as any).bunyiKataNamaAffiliate = hasilProfil.affiliate.nama;
      }
    }
    setReferral(senarai);
    setMemuat(false);
  }, []);

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
        if (hasilProfil.affiliate.kod) {
          localStorage.setItem("bunyiKataAffiliateKod", hasilProfil.affiliate.kod);
          (window as any).bunyiKataAffiliateKod = hasilProfil.affiliate.kod;
        }
        if (hasilProfil.affiliate.email) {
          localStorage.setItem("bunyiKataAffiliateEmail", hasilProfil.affiliate.email);
          (window as any).bunyiKataAffiliateEmail = hasilProfil.affiliate.email;
        }
        if (hasilProfil.affiliate.nama) {
          localStorage.setItem("bunyiKataNamaAffiliate", hasilProfil.affiliate.nama);
          (window as any).bunyiKataNamaAffiliate = hasilProfil.affiliate.nama;
        }
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
      {/* Kepala banner bergaya Guru/Ibu Bapa */}
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
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar kotak (selaras kelas avatar Guru/Ibu Bapa) */}
          <div
            className="ibubapa-card-avatar-box"
            style={{
              background: "#ffffff",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              id="affiliate-avatar-icon"
              className="fa-solid fa-sitemap"
              style={{ color: UNGU, fontSize: "1.7rem" }}
            ></i>
          </div>

          <div style={{ flex: 1, minWidth: "180px", textAlign: "left" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.22)",
                border: "1.5px solid rgba(255,255,255,0.55)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.7rem",
                letterSpacing: "0.6px",
                padding: "2px 10px",
                borderRadius: "20px",
                marginBottom: "6px",
              }}
            >
              <i className="fa-solid fa-chart-simple"></i> STATISTIK AFFILIATE SAYA
            </span>
            <h2
              id="affiliate-nama-title"
              style={{ margin: 0, fontWeight: 900, fontSize: "clamp(1.3rem, 4vw, 1.9rem)" }}
            >
              {profil?.nama || "Panel Affiliate"}
            </h2>
            <p style={{ margin: "6px 0 0", opacity: 0.95, fontSize: "0.85rem" }}>
              {profil ? (
                <>
                  Kod: <b>{profil.kod || "-"}</b>
                  {" \u2022 "}
                  Status:{" "}
                  <b style={{ textTransform: "capitalize", color: String(profil.status).toLowerCase() === "aktif" ? "#86efac" : "#fca5a5" }}>
                    {profil.status || "aktif"}
                  </b>
                </>
              ) : (
                "Selamat datang!"
              )}
            </p>
          </div>

          {/* Butang Edit Maklumat Affiliate */}
          {onEditProfile && (
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  if ((window as any).playBubble) (window as any).playBubble();
                  if (profil?.kod) {
                    localStorage.setItem("bunyiKataAffiliateKod", profil.kod);
                    (window as any).bunyiKataAffiliateKod = profil.kod;
                  }
                  if (profil?.email) {
                    localStorage.setItem("bunyiKataAffiliateEmail", profil.email);
                    (window as any).bunyiKataAffiliateEmail = profil.email;
                  }
                  if (profil?.nama) {
                    localStorage.setItem("bunyiKataNamaAffiliate", profil.nama);
                    (window as any).bunyiKataNamaAffiliate = profil.nama;
                  }
                  onEditProfile();
                }}
                className="neo-btn"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  border: "2px solid var(--color-dark)",
                  borderRadius: "50%",
                  padding: "0",
                  width: "36px",
                  height: "36px",
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
                title="Edit Maklumat Affiliate"
                aria-label="Edit Maklumat Affiliate"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
          )}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "1.3rem" }}></i>
              <span>{ralat.replace(/sila masuk semula\.?/gi, "Sila berhubung dengan admin.")}</span>
            </div>
            <button
              className="neo-btn"
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                const affKod = profil?.kod || localStorage.getItem("bunyiKataAffiliateKod") || "";
                const affEmail = profil?.email || localStorage.getItem("bunyiKataAffiliateEmail") || "";
                const mesej = `Hai admin Bunyi Kata, saya ingin berhubung berkenaan akaun/sesi affiliate saya (Kod: ${affKod || "-"}, Emel: ${affEmail || "-"}).`;
                hubungiAdminWhatsapp(mesej);
              }}
              style={{
                background: "#25D366",
                color: "#ffffff",
                padding: "8px 16px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
                border: "2px solid #16a34a",
              }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }}></i>
              Hubungi Admin
            </button>
          </div>
        )}

        {!memuat && profil && String(profil.status).toLowerCase() === "gantung" && (
          <div
            className="neo-box"
            style={{
              padding: "16px 18px",
              marginBottom: "18px",
              background: "#fef3c7",
              color: "#b45309",
              border: "2px solid #b45309",
              borderRadius: "14px",
              textAlign: "left",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontWeight: "bold",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fa-solid fa-circle-pause" style={{ fontSize: "1.4rem" }}></i>
              <span>Akaun affiliate anda tidak aktif / digantung. Sila berhubung dengan admin.</span>
            </div>
            <button
              className="neo-btn"
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                const affKod = profil?.kod || localStorage.getItem("bunyiKataAffiliateKod") || "";
                const affEmail = profil?.email || localStorage.getItem("bunyiKataAffiliateEmail") || "";
                const mesej = `Hai admin Bunyi Kata, akaun affiliate saya tidak aktif / digantung (Kod: ${affKod || "-"}, Emel: ${affEmail || "-"}).`;
                hubungiAdminWhatsapp(mesej);
              }}
              style={{
                background: "#25D366",
                color: "#ffffff",
                padding: "8px 16px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
                border: "2px solid #16a34a",
              }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }}></i>
              Hubungi Admin
            </button>
          </div>
        )}

        {!memuat && profil && (
          <>
            {/* Kad kod + pautan rujukan */}
            <div
              id="affiliate-kod"
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
                  title={salin === "kod" ? "Disalin!" : "Salin Kod"}
                  aria-label="Salin Kod"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "34px",
                    height: "30px",
                  }}
                >
                  <i
                    className={salin === "kod" ? "fa-solid fa-check" : "fa-regular fa-copy"}
                    style={{ color: salin === "kod" ? "#16a34a" : "inherit" }}
                  ></i>
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
                  title={salin === "pautan" ? "Disalin!" : "Salin Pautan"}
                  aria-label="Salin Pautan"
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "34px",
                    height: "30px",
                  }}
                >
                  <i
                    className={salin === "pautan" ? "fa-solid fa-check" : "fa-regular fa-copy"}
                    style={{ color: salin === "pautan" ? "#16a34a" : "inherit" }}
                  ></i>
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
              id="affiliate-rujukan"
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
              <div
                className="table-responsive"
                style={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  border: "2px solid var(--color-dark)",
                }}
              >
                <table className="teacher-table affiliate-table">
                  <thead>
                    <tr>
                      <th style={{ width: "45px" }}>Bil.</th>
                      <th style={{ textAlign: "left" }}>Pelanggan</th>
                      <th>Pakej</th>
                      <th>Harga</th>
                      <th>Komisen</th>
                      <th>Status</th>
                      <th>Tarikh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referral.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            padding: "26px 16px",
                            textAlign: "center",
                            color: "#64748b",
                            background: "#ffffff",
                            fontWeight: 600,
                          }}
                        >
                          <i className="fa-solid fa-inbox" style={{ marginRight: "8px", color: UNGU, fontSize: "1.2rem" }}></i>
                          Belum ada rujukan. Kongsi pautan khas anda untuk mula mengumpul komisen.
                        </td>
                      </tr>
                    ) : (
                      referral.map((r, idx) => {
                        const l = lencanaStatus(r.status);
                        return (
                          <tr key={r.id || idx}>
                            <td style={{ fontWeight: "bold" }}>{idx + 1}</td>
                            <td style={{ textAlign: "left", fontWeight: 700 }}>{r.pelanggan_nama || "-"}</td>
                            <td>{r.nama_pakej || "-"}</td>
                            <td>{formatRM(r.harga_sen)}</td>
                            <td style={{ fontWeight: 800, color: UNGU_GELAP }}>
                              {formatRM(r.komisen_sen)}
                            </td>
                            <td>
                              <span
                                style={{
                                  background: l.bg,
                                  color: l.warna,
                                  padding: "3px 10px",
                                  borderRadius: "20px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  display: "inline-block",
                                }}
                              >
                                {l.teks}
                              </span>
                            </td>
                            <td>{formatTarikh(r.tarikh_beli)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

