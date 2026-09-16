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
  ambilLaporanPembayaranAffiliate,
  type ProfilAffiliate,
  type RingkasanAffiliate,
  type ReferralAffiliate,
  type RekodPembayaranAffiliate,
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
  switch (String(status || "").toLowerCase()) {
    case "dibayar":
      return { teks: "Dibayar", bg: "#dcfce7", warna: "#15803d" };
    case "batal":
      return { teks: "Batal", bg: "#fee2e2", warna: "#b91c1c" };
    case "pending":
      return { teks: "Belum Dibayar", bg: "#e0e7ff", warna: "#4338ca" };
    default:
      return { teks: "Sah", bg: "#fef3c7", warna: "#b45309" };
  }
}

function labelPeranan(peranan?: string): string {
  const p = String(peranan || "").trim().toLowerCase();
  if (p === "guru") return "Guru";
  if (p === "ibubapa" || p === "ibu bapa" || p === "ibubapa") return "Ibu bapa";
  if (p === "murid") return "Murid";
  if (p === "admin") return "Admin";
  if (p === "affiliate") return "Affiliate";
  // Rekod lama tanpa medan peranan (atau peranan tidak dikenali): paparkan
  // label neutral, bukan sengkang, supaya kolum tidak kelihatan kosong.
  return "Pelanggan";
}

// --- Pagination (10 rekod/halaman) ---
const HAL_PER_HALAMAN = 10;

/**
 * Kira senarai nombor halaman yang dipaparkan (tetingkap maks 7 halaman)
 * supaya butang dot tidak terlalu panjang pada senarai besar.
 */
function nomborHalamanSemasa(asas: number, aktif: number, jumlah: number): (number | "…")[] {
  if (jumlah <= 7) {
    return Array.from({ length: jumlah }, (_, i) => i + 1);
  }
  const keluar: (number | "…")[] = [];
  if (aktif <= 4) {
    for (let i = 1; i <= 5; i++) keluar.push(i);
    keluar.push("…", jumlah);
  } else if (aktif >= jumlah - 3) {
    keluar.push(1, "…");
    for (let i = jumlah - 4; i <= jumlah; i++) keluar.push(i);
  } else {
    keluar.push(1, "…", aktif - 1, aktif, aktif + 1, "…", jumlah);
  }
  return keluar;
}

function PaginationBar({
  aktif,
  jumlahRekod,
  onTukar,
}: {
  aktif: number;
  jumlahRekod: number;
  onTukar: (h: number) => void;
}) {
  const jumlahHalaman = Math.max(1, Math.ceil(jumlahRekod / HAL_PER_HALAMAN));
  if (jumlahHalaman <= 1) return null;
  const items = nomborHalamanSemasa(1, aktif, jumlahHalaman);
  const btnIkon: React.CSSProperties = {
    width: "30px",
    height: "30px",
    padding: 0,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    cursor: aktif <= 1 ? "not-allowed" : "pointer",
    opacity: aktif <= 1 ? 0.4 : 1,
    border: `2px solid ${UNGU_GELAP}`,
    background: "#ffffff",
    color: UNGU_GELAP,
  };
  const btnIkonNext: React.CSSProperties = {
    ...btnIkon,
    cursor: aktif >= jumlahHalaman ? "not-allowed" : "pointer",
    opacity: aktif >= jumlahHalaman ? 0.4 : 1,
  };
  return (
    <div
      className="pagination-bar"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
        padding: "12px 4px 4px",
      }}
    >
      <button
        className="neo-btn"
        style={btnIkon}
        disabled={aktif <= 1}
        onClick={() => aktif > 1 && onTukar(aktif - 1)}
        title="Sebelum"
        aria-label="Sebelum"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} style={{ fontWeight: 800, color: "#64748b", padding: "0 2px" }}>
            …
          </span>
        ) : (
          <button
            key={it}
            className="neo-btn"
            onClick={() => onTukar(it)}
            title={`Halaman ${it}`}
            aria-label={`Halaman ${it}`}
            style={{
              width: "30px",
              height: "30px",
              padding: 0,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 800,
              cursor: "pointer",
              border: `2px solid ${UNGU_GELAP}`,
              background: it === aktif ? UNGU : "#ffffff",
              color: it === aktif ? "#ffffff" : UNGU_GELAP,
            }}
          >
            {it}
          </button>
        )
      )}
      <button
        className="neo-btn"
        style={btnIkonNext}
        disabled={aktif >= jumlahHalaman}
        onClick={() => aktif < jumlahHalaman && onTukar(aktif + 1)}
        title="Seterusnya"
        aria-label="Seterusnya"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
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
  const [bayaran, setBayaran] = React.useState<RekodPembayaranAffiliate[]>([]);
  const [jumlahDibayarSen, setJumlahDibayarSen] = React.useState(0);
  const [halamanRujukan, setHalamanRujukan] = React.useState(1);
  const [halamanBayaran, setHalamanBayaran] = React.useState(1);

  const muatData = React.useCallback(async () => {
    setMemuat(true);
    setRalat("");
    // BEST-EFFORT: paksa token segar supaya claim `affiliate_kod` (yang mungkin
    // ditetapkan admin selepas pendaftaran) diterima. Kegagalan diabaikan —
    // pelayan masih boleh menyelesaikan kod melalui emel sebagai sandaran.
    try {
      const { auth } = await import("../../lib/firebase");
      if (auth && auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }
    } catch (e) {
      console.warn("[Affiliate] Gagal segarkan token:", e);
    }
    const [hasilProfil, senarai, hasilBayaran] = await Promise.all([
      ambilProfilAffiliate(),
      ambilReferralSendiri(),
      ambilLaporanPembayaranAffiliate(),
    ]);
    setBayaran(hasilBayaran.dibayar_sejarah || []);
    setJumlahDibayarSen(Number(hasilBayaran.jumlah_dibayar_sen) || 0);
    if (!hasilProfil.berjaya || !hasilProfil.affiliate) {
      setRalat(hasilProfil.mesej || "Gagal memuatkan profil affiliate.");
    } else {
      setProfil(hasilProfil.affiliate);
      setRingkasan(hasilProfil.ringkasan || null);
      simpanStatusAffiliate(hasilProfil.affiliate);
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
    setHalamanRujukan(1);
    setHalamanBayaran(1);
    setMemuat(false);
  }, []);

  React.useEffect(() => {
    let batal = false;
    (async () => {
      setMemuat(true);
      setRalat("");
      const [hasilProfil, senarai, hasilBayaran] = await Promise.all([
        ambilProfilAffiliate(),
        ambilReferralSendiri(),
        ambilLaporanPembayaranAffiliate(),
      ]);
      if (batal) return;
      setBayaran(hasilBayaran.dibayar_sejarah || []);
      setJumlahDibayarSen(Number(hasilBayaran.jumlah_dibayar_sen) || 0);
      if (!hasilProfil.berjaya || !hasilProfil.affiliate) {
        setRalat(hasilProfil.mesej || "Gagal memuatkan profil affiliate.");
      } else {
        setProfil(hasilProfil.affiliate);
        setRingkasan(hasilProfil.ringkasan || null);
        simpanStatusAffiliate(hasilProfil.affiliate);
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
      setHalamanRujukan(1);
      setHalamanBayaran(1);
      setMemuat(false);
    })();
    return () => {
      batal = true;
    };
  }, []);

  // Simpan status affiliate (aktif/gantung) supaya app-logic.js boleh menapis
  // akses pembelajaran tanpa perlu memanggil API tambahan.
  const simpanStatusAffiliate = (profilAff: any) => {
    try {
      const status = String(profilAff?.status || "aktif").toLowerCase().trim() || "aktif";
      localStorage.setItem("bunyiKataAffiliateStatus", status);
      (window as any).bunyiKataAffiliateStatus = status;
    } catch {}
  };

  const pautanRujukan =
    profil?.kod && typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${profil.kod}`
      : "";

  // --- Halaman semasa untuk setiap jadual ---
  const jumlahHalamanRujukan = Math.max(1, Math.ceil(referral.length / HAL_PER_HALAMAN));
  const halamanRujukanSelamat = Math.min(halamanRujukan, jumlahHalamanRujukan);
  const rujukanDipapar = referral.slice(
    (halamanRujukanSelamat - 1) * HAL_PER_HALAMAN,
    halamanRujukanSelamat * HAL_PER_HALAMAN
  );
  const jumlahHalamanBayaran = Math.max(1, Math.ceil(bayaran.length / HAL_PER_HALAMAN));
  const halamanBayaranSelamat = Math.min(halamanBayaran, jumlahHalamanBayaran);
  const bayaranDipapar = bayaran.slice(
    (halamanBayaranSelamat - 1) * HAL_PER_HALAMAN,
    halamanBayaranSelamat * HAL_PER_HALAMAN
  );

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
    { label: "Jumlah Jualan", nilai: formatRM(ringkasan?.jumlah_jualan_sen), ikon: "fa-cart-shopping", grad: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", shadow: "rgba(91, 33, 182, 0.4)" },
    { label: "Komisen Keseluruhan", nilai: formatRM(ringkasan?.komisen_keseluruhan_sen), ikon: "fa-coins", grad: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)", shadow: "rgba(67, 56, 202, 0.4)" },
    { label: "Telah Dibayar", nilai: formatRM(ringkasan?.dibayar_sen), ikon: "fa-circle-check", grad: "linear-gradient(135deg, #10b981 0%, #059669 100%)", shadow: "rgba(5, 150, 105, 0.4)" },
    { label: "Baki Belum Dibayar", nilai: formatRM(ringkasan?.baki_sen), ikon: "fa-hourglass-half", grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", shadow: "rgba(217, 119, 6, 0.4)" },
  ];

  return (
    <>
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
              <span>{String(ralat).replace(/sila masuk semula\.?/gi, "Sila log keluar dan log masuk semula, atau hubungi admin.")}</span>
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
              <span>Akaun affiliate anda telah DIGANTUNG oleh admin. Jika admin baru mengaktifkannya semula, tekan "Muat Semula". Hubungi admin jika masalah berterusan.</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="neo-btn"
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                muatData();
              }}
              style={{
                background: "#7c3aed",
                color: "#ffffff",
                padding: "8px 16px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
                border: "2px solid #5b21b6",
              }}
            >
              <i className="fa-solid fa-rotate" style={{ fontSize: "1rem" }}></i>
              Muat Semula
            </button>
            <button
              className="neo-btn"
              onClick={() => {
                if ((window as any).playBubble) (window as any).playBubble();
                const affKod = profil?.kod || localStorage.getItem("bunyiKataAffiliateKod") || "";
                const affEmail = profil?.email || localStorage.getItem("bunyiKataAffiliateEmail") || "";
                const mesej = `Hai admin Bunyi Kata, akaun affiliate saya tidak aktif (Kod: ${affKod || "-"}, Emel: ${affEmail || "-"}).`;
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
              className="affiliate-stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              {kadStat.map((k) => (
                <div
                  key={k.label}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "18px",
                    padding: "16px 18px",
                    background: k.grad,
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "115px",
                    boxShadow: `0 10px 22px -5px ${k.shadow}, 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
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
                    <i className={`fa-solid ${k.ikon}`}></i>
                  </div>
                  <i
                    className={`fa-solid ${k.ikon}`}
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
                      {k.label}
                    </div>
                    <div
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: "900",
                        color: "#ffffff",
                        lineHeight: 1.1,
                        margin: 0,
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      }}
                    >
                      {k.nilai}
                    </div>
                  </div>
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
                backgroundImage:
                  "radial-gradient(circle, rgba(124,58,237,0.16) 1.8px, transparent 1.8px)",
                backgroundSize: "16px 16px",
                borderRadius: "16px",
                border: `2px dashed ${UNGU}`,
                boxShadow: "0 3px 0 #0f172a",
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              <div
                className="neo-btn"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
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
                  margin: "0 0 14px",
                }}
              >
                <i className="fa-solid fa-list-check"></i>
                <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>Rujukan &amp; Komisen</span>
              </div>
              <div
                className="table-responsive"
                style={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  border: "2px solid var(--color-dark)",
                }}
              >
                <table
                  className="teacher-table affiliate-table"
                  style={{ background: "#ffffff" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "45px" }}>Bil.</th>
                      <th style={{ textAlign: "left" }}>Peranan</th>
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
                      rujukanDipapar.map((r, idx) => {
                        const l = lencanaStatus(r.status);
                        return (
                          <tr key={r.id || idx}>
                            <td style={{ fontWeight: "bold" }}>
                              {(halamanRujukanSelamat - 1) * HAL_PER_HALAMAN + idx + 1}
                            </td>
                            <td style={{ textAlign: "left", fontWeight: 700 }}>{labelPeranan(r.peranan)}</td>
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
              <PaginationBar
                aktif={halamanRujukanSelamat}
                jumlahRekod={referral.length}
                onTukar={setHalamanRujukan}
              />
            </div>
          </>
        )}
      </div>
    </div>

    {/* Screen: Laporan Pembayaran Affiliate (page berasingan) */}
    <div id="affiliate-laporan-screen" className={getScreenClass("affiliate-laporan-screen")}>
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        <div
          className="neo-box"
          style={{
            padding: "18px",
            background: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.16) 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
            borderRadius: "16px",
            border: `2px dashed ${UNGU}`,
            boxShadow: "0 3px 0 #0f172a",
            textAlign: "left",
          }}
        >
          {/* Tajuk badge bergaya mod Guru — DI DALAM bingkai titik-titik */}
          <div
            className="neo-btn"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
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
              margin: "0 0 14px",
            }}
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>Laporan Pembayaran</span>
          </div>
          {/* Ringkasan ringkas */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
            <span style={{ background: "#ecfdf5", color: "#15803d", border: "1.5px solid #a7f3d0", borderRadius: "8px", padding: "6px 12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-money-bill-transfer"></i> Jumlah Dibayar: {formatRM(jumlahDibayarSen)}
            </span>
            <span style={{ background: "#f5f3ff", color: "#5b21b6", border: "1.5px solid #ddd6fe", borderRadius: "8px", padding: "6px 12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-receipt"></i> {bayaran.length} Rekod
            </span>
          </div>

          <div
            className="table-responsive"
            style={{ overflowX: "auto", borderRadius: "12px", border: "2px solid var(--color-dark)" }}
          >
            <table
              className="teacher-table affiliate-table"
              style={{ width: "100%", minWidth: "560px", background: "#ffffff" }}
            >
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", color: "white" }}>
                  <th style={{ width: "48px", textAlign: "center" }}>Bil.</th>
                  <th style={{ textAlign: "center" }}>Tarikh</th>
                  <th style={{ textAlign: "center" }}>Jumlah</th>
                  <th style={{ textAlign: "left" }}>Rujukan</th>
                  <th style={{ textAlign: "left" }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {bayaran.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: "26px 16px", textAlign: "center", color: "#64748b", background: "#ffffff", fontWeight: 600 }}
                    >
                      <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "8px", color: UNGU, fontSize: "1.2rem" }}></i>
                      Belum ada rekod pembayaran. Laporan akan muncul di sini selepas admin membayar komisen anda.
                    </td>
                  </tr>
                ) : (
                  bayaranDipapar.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td style={{ fontWeight: "bold", textAlign: "center" }}>
                        {(halamanBayaranSelamat - 1) * HAL_PER_HALAMAN + idx + 1}
                      </td>
                      <td style={{ textAlign: "center" }}>{formatTarikh(p.tarikh)}</td>
                      <td style={{ textAlign: "center", fontWeight: 800, color: UNGU_GELAP }}>{formatRM(p.jumlah_sen)}</td>
                      <td style={{ textAlign: "left" }}>{p.rujukan || "-"}</td>
                      <td style={{ textAlign: "left", color: "#475569", fontSize: "0.85rem" }}>{p.nota || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationBar
            aktif={halamanBayaranSelamat}
            jumlahRekod={bayaran.length}
            onTukar={setHalamanBayaran}
          />
        </div>
      </div>
    </div>
    </>
  );
}

