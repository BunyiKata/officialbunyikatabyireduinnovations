// @ts-nocheck
import { getCoreAudioContext } from '../../utils/coreAudio';
/**
 * Modal Cipta Akaun (Mod Admin)
 *
 * Aliran baharu: ADMIN mencipta akaun guru / ibu bapa, dan pengguna menerima
 * kata laluan sementara melalui WhatsApp. Pendaftaran sendiri oleh pengguna
 * tidak lagi digunakan untuk pakej berbayar.
 *
 * Selepas akaun dicipta, pelayan memulangkan kata laluan SEKALI sahaja.
 * Modal ini kemudian memaparkan kad hasil dengan butang:
 *   - Salin Mesej WhatsApp
 *   - Buka WhatsApp (wa.me deeplink)
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ciptaAkaunAdmin,
  ciptaAffiliate,
  type PerananPengguna,
  type KunciPakej,
  type HasilCiptaAkaun,
  ambilSenaraiPakej,
  type PakejPenuh,
} from "../../services/adminService";
import { ambilKodRujukan } from "../../config/contactAdmin";

const PAKEJ_LALAI: PakejPenuh[] = [
  { key: "1bulan", name: "1 Bulan (Pro)", days: 30, priceCents: 1500, harga: "RM15" },
  { key: "3bulan", name: "3 Bulan (Pro)", days: 90, priceCents: 4000, harga: "RM40" },
  { key: "1tahun", name: "1 Tahun (Pro)", days: 365, priceCents: 6900, harga: "RM69" },
];

/**
 * Bunyi klik tempatan untuk modal ini.
 *
 * Kita TIDAK bergantung sepenuhnya pada listener global dalam `app-logic.js`
 * kerana modal React ini boleh dipasang sebelum skrip legacy itu bersedia.
 * Helper ini menggunakan `window.playBubble` (yang didaftarkan oleh
 * `app-logic.js`) dan jatuh balik ke Web Audio API sendiri jika tiada.
 */
let _ctxModalCipta: AudioContext | null = null;
function bunyiKlik() {
  try {
    if (typeof window === "undefined") return;
    // Guna SATU AudioContext kongsi + tone nav standard
    _ctxModalCipta = getCoreAudioContext();
    const ctx = _ctxModalCipta;
    if (!ctx) return;
    const mainkan = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch {
        /* abaikan */
      }
    };
    if (ctx.state === "suspended") ctx.resume().then(mainkan).catch(() => {});
    else mainkan();
  } catch {
    /* abaikan */
  }
}

function formatTarikh(iso?: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Membina mesej WhatsApp (Bahasa Melayu) untuk dihantar kepada pengguna. */
function binaMesejWhatsApp(h: HasilCiptaAkaun): string {
  return [
    `Akaun Bunyi Kata anda telah sedia untuk digunakan! 🎊`,
    "",
    "🔗 Pautan Bunyi Kata: https://bunyikata.my",
    "",
    `📧 Emel: ${h.email || "-"}`,
    `🔑 Kata laluan sementara: ${h.password || "-"}`,
    "",
    "📖 Cara menggunakannya:",
    `📦 Pakej: ${h.plan?.name || "-"}`,
    `📅 Sah sehingga: ${formatTarikh(h.tarikh_tamat)}`,
    "",
    "🔑 Sila log masuk dan tukar kata laluan anda di menu Tetapan.",
    "",
    "Terima kasih kerana memilih Bunyi Kata! 🙏",
  ].join("\n");
}

/** Membina mesej WhatsApp untuk affiliate baharu (butiran log masuk + kod). */
function binaMesejWhatsAppAffiliate(nama: string, kod: string, email: string, password: string): string {
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  const pautan = `${origin}/?ref=${kod}`;
  const pautanMasuk = `${origin}/`;
  return [
    `Selamat menyertai program Affiliate Bunyi Kata! 🎉`,
    "",
    `👤 Nama: ${nama || "-"}`,
    `🔑 Kod Affiliate anda: ${kod}`,
    `🔗 Pautan Khas anda: ${pautan}`,
    "",
    "📥 Butiran Log Masuk (simpan & tukar kata laluan):",
    `📧 Emel: ${email || "-"}`,
    `🔒 Kata laluan sementara: ${password || "-"}`,
    `🔗 Pautan log masuk: ${pautanMasuk}`,
    "",
    "📣 Kongsi pautan bunyi kata dengan kod ini, dan anda akan menerima komisen bagi setiap pembelian yang menggunakan kod anda.",
    "",
    "Terima kasih kerana menyertai kami! 🙏",
  ].join("\n");
}

interface CiptaAkaunModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Peranan pratetap — butang "+ Daftar Guru/Ibu Bapa" dalam tab Urus. */
  perananAwal?: PerananPengguna;
}

export function CiptaAkaunModal({ isOpen, onClose, perananAwal = "guru" }: CiptaAkaunModalProps) {
  const [peranan, setPeranan] = React.useState<PerananPengguna>(perananAwal);

  // Selaraskan peranan pratetap setiap kali modal dibuka.
  React.useEffect(() => {
    if (isOpen) setPeranan(perananAwal);
  }, [isOpen, perananAwal]);

  // Unlock AudioContext pada interaksi pertama (iOS/Safari mewajibkan gesture).
  React.useEffect(() => {
    if (!isOpen) return;
    const unlock = () => bunyiKlik();
    document.addEventListener("pointerdown", unlock, { once: true, capture: true });
  }, [isOpen]);

  // Muat senarai pakej daripada /api/plans setiap kali modal dibuka.
  React.useEffect(() => {
    if (!isOpen) return;
    let batal = false;
    ambilSenaraiPakej()
      .then((senarai) => {
        if (!batal && Array.isArray(senarai) && senarai.length) setSenaraiPakej(senarai);
      })
      .catch(() => {});
    return () => {
      batal = true;
    };
  }, [isOpen]);
  const [nama, setNama] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [noTelefon, setNoTelefon] = React.useState("");
  const [pakej, setPakej] = React.useState<KunciPakej>("1bulan");
  // Senarai pakej dari pelayan (satu sumber harga). Guna nilai lalai sementara menunggu.
  const [senaraiPakej, setSenaraiPakej] = React.useState<PakejPenuh[]>(PAKEJ_LALAI);

  const [sedangProses, setSedangProses] = React.useState(false);
  const [ralat, setRalat] = React.useState("");
  const [hasil, setHasil] = React.useState<HasilCiptaAkaun | null>(null);
  // Hasil pendaftaran affiliate (kod dijana di pelayan) — aliran berasingan.
  const [hasilAffiliate, setHasilAffiliate] = React.useState<{ nama: string; kod: string; whatsapp: string; email: string; password: string } | null>(null);
  const [disalin, setDisalin] = React.useState(false);
  // Fasa 2: kod affiliate pelanggan ini (dari ?ref=). Boleh dibetulkan admin.
  const [kodRujukan, setKodRujukan] = React.useState("");

  // Pra-isi kod rujukan dari storan setiap kali modal dibuka.
  React.useEffect(() => {
    if (isOpen) setKodRujukan(ambilKodRujukan());
  }, [isOpen]);

  const resetBorang = () => {
    bunyiKlik();
    setNama("");
    setEmail("");
    setNoTelefon("");
    setPakej("1bulan");
    setKodRujukan(ambilKodRujukan());
    setRalat("");
    setHasil(null);
    setHasilAffiliate(null);
    setDisalin(false);
  };

  const tutup = () => {
    if (sedangProses) return;
    bunyiKlik();
    resetBorang();
    onClose();
  };

  const hantar = async () => {
    setRalat("");
    // Aliran AFFILIATE: Nama + Emel + No. WhatsApp diperlukan; kod & kata laluan dijana pelayan.
    if (peranan === "affiliate") {
      if (!nama.trim()) {
        setRalat("Nama affiliate diperlukan.");
        if (typeof (window as any).playOops === "function") (window as any).playOops();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setRalat("Format emel tidak sah (cth. nama@email.com).");
        if (typeof (window as any).playOops === "function") (window as any).playOops();
        return;
      }
      const wa = noTelefon.replace(/[^0-9]/g, "");
      if (wa.length < 9) {
        setRalat("Nombor WhatsApp tidak sah (cth. 60173955657).");
        if (typeof (window as any).playOops === "function") (window as any).playOops();
        return;
      }
      bunyiKlik();
      setSedangProses(true);
      const keputusan = await ciptaAffiliate(nama.trim(), email.trim().toLowerCase(), noTelefon.trim());
      setSedangProses(false);
      if (!keputusan.berjaya) {
        setRalat(keputusan.mesej || "Gagal mendaftar affiliate.");
        return;
      }
      setHasilAffiliate({
        nama: keputusan.affiliate?.nama || nama.trim(),
        kod: keputusan.affiliate?.kod || keputusan.kod || "",
        whatsapp: keputusan.affiliate?.whatsapp || noTelefon.trim(),
        email: keputusan.email || keputusan.affiliate?.email || email.trim().toLowerCase(),
        password: keputusan.password || "",
      });
      // Muat semula jadual affiliate supaya pendaftaran baharu segera muncul.
      if (typeof (window as any).renderAffiliateTable === "function") {
        try {
          (window as any).renderAffiliateTable();
        } catch {
          /* abaikan */
        }
      }
      bunyiKlik();
      return;
    }

    if (!nama.trim() || !email.trim()) {
      setRalat("Nama dan emel diperlukan.");
      if (typeof (window as any).playOops === "function") (window as any).playOops();
      return;
    }
    bunyiKlik();
    setSedangProses(true);
    const keputusan = await ciptaAkaunAdmin({
      nama: nama.trim(),
      email: email.trim(),
      peranan,
      no_telefon: noTelefon.trim(),
      nama_sekolah: "",
      // Nama keluarga tidak lagi diminta semasa cipta akaun — ibu bapa
      // menetapkannya sendiri selepas log masuk pertama. Hantar kosong supaya
      // pelayan tidak menyimpan nilai palsu.
      nama_keluarga: "",
      planKey: pakej,
      kod_rujukan: kodRujukan.trim().toUpperCase(),
    });
    setSedangProses(false);

    if (!keputusan.berjaya) {
      setRalat(keputusan.mesej || "Gagal mencipta akaun.");
      return;
    }
    setHasil(keputusan);
    bunyiKlik();
  };

  const salinMesej = async () => {
    if (!hasil && !hasilAffiliate) return;
    bunyiKlik();
    const mesej = hasilAffiliate
      ? binaMesejWhatsAppAffiliate(hasilAffiliate.nama, hasilAffiliate.kod, hasilAffiliate.email, hasilAffiliate.password)
      : binaMesejWhatsApp(hasil as HasilCiptaAkaun);
    try {
      await navigator.clipboard.writeText(mesej);
      setDisalin(true);
      setTimeout(() => setDisalin(false), 2500);
    } catch {
      // Fallback: textarea sementara untuk pelayar tanpa clipboard API.
      const ta = document.createElement("textarea");
      ta.value = mesej;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setDisalin(true); } catch {}
      document.body.removeChild(ta);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "2px solid #cbd5e1",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    textAlign: "left",
    background: "#ffffff",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#334155",
    marginBottom: "5px",
    textAlign: "left",
  };
  const fieldStyle: React.CSSProperties = {
    marginBottom: "12px",
    textAlign: "left",
  };

  // Warna ikut mod (peranan terpilih): guru = oren, ibu bapa = biru, affiliate = ungu.
  const warnaMod =
    peranan === "guru"
      ? { utama: "#ea580c", gelap: "#c2410c" }
      : peranan === "affiliate"
        ? { utama: "#7c3aed", gelap: "#5b21b6" }
        : { utama: "#0284c7", gelap: "#0369a1" };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={tutup}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "16px",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="neo-box"
            style={{
              backgroundColor: "#fef9ec",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
              backgroundSize: "15px 15px",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "22px",
              textAlign: "center",
            }}
          >
            {!hasil && !hasilAffiliate ? (
              <>
                <div
                  className="neo-btn"
                  style={{
                    backgroundColor: warnaMod.utama,
                    color: "white",
                    fontSize: "clamp(1.02rem, 3.6vw, 1.22rem)",
                    margin: "0 auto 14px auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    pointerEvents: "none",
                    padding: "8px 22px",
                    lineHeight: "1.2",
                    fontWeight: "900",
                    borderRadius: "12px",
                  }}
                >
                  <i className={peranan === "affiliate" ? "fa-solid fa-sitemap" : "fa-solid fa-user-plus"}></i>{" "}
                  {peranan === "affiliate" ? "Cipta Akaun Affiliate" : "Cipta Akaun Pengguna"}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Peranan</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["guru", "ibubapa", "affiliate"] as PerananPengguna[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          bunyiKlik();
                          setPeranan(r);
                        }}
                        className="neo-btn"
                        style={{
                          flex: 1,
                          padding: "9px",
                          borderRadius: "10px",
                          border: "2px solid #0f172a",
                          background: peranan === r ? warnaMod.utama : "#ffffff",
                          color: peranan === r ? "#ffffff" : "#0f172a",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow:
                            peranan === r
                              ? `0 3px 0 ${warnaMod.gelap}`
                              : "0 3px 0 #0f172a",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        <i className={r === "guru" ? "fa-solid fa-chalkboard-user" : r === "affiliate" ? "fa-solid fa-sitemap" : "fa-solid fa-people-roof"}></i>
                        {r === "guru" ? "Guru" : r === "affiliate" ? "Affiliate" : "Ibu Bapa"}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Nama Penuh *</label>
                  <input
                    style={inputStyle}
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="cth. Cikgu Siti Aminah"
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Emel *</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={peranan === "affiliate" ? "cth. ali@gmail.com" : "cth. siti@sekolah.edu.my"}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>No. Telefon (WhatsApp){peranan === "affiliate" ? " *" : ""}</label>
                  <input
                    style={inputStyle}
                    value={noTelefon}
                    onChange={(e) => setNoTelefon(e.target.value)}
                    placeholder={peranan === "affiliate" ? "cth. 60173955657" : "cth. 0123456789"}
                  />
                </div>

                {/* Fasa 2: kod affiliate. Pra-isi dari ?ref= jika pelanggan
                    datang melalui pautan affiliate; admin boleh betulkan. */}
                {peranan !== "affiliate" && (
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Kod Rujukan Affiliate (pilihan)</label>
                    <input
                      style={inputStyle}
                      value={kodRujukan}
                      onChange={(e) => setKodRujukan(e.target.value.toUpperCase())}
                      placeholder="cth. BK7X2K — kosongkan jika tiada"
                      maxLength={6}
                    />
                  </div>
                )}

                {/*
                  Ruangan "Nama Keluarga" sengaja TIADA di sini.
                  Nama keluarga ditetapkan sendiri oleh ibu bapa selepas mereka
                  log masuk pertama kali (lihat EditProfileModal). Admin hanya
                  perlu mencipta akaun; biarkan keluarga itu menyesuaikan nama
                  mereka sendiri supaya tidak berlaku percanggahan.
                */}

                {peranan !== "affiliate" && (
                  <div style={{ ...fieldStyle, marginBottom: "16px" }}>
                    <label style={labelStyle}>Pakej Langganan</label>
                    <select
                      style={inputStyle}
                      value={pakej}
                      onChange={(e) => {
                        bunyiKlik();
                        setPakej(e.target.value as KunciPakej);
                      }}
                    >
                      {senaraiPakej.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.name} — {p.harga}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {ralat && (
                  <div
                    style={{
                      marginBottom: "12px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "#fef2f2",
                      border: "2px solid #fecaca",
                      color: "#b91c1c",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="fa-solid fa-triangle-exclamation"></i> {ralat}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={tutup}
                    disabled={sedangProses}
                    className="neo-btn"
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      border: "2px solid #0f172a",
                      background: "#f1f5f9",
                      fontWeight: "bold",
                      cursor: sedangProses ? "not-allowed" : "pointer",
                      boxShadow: "0 3px 0 #0f172a",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={hantar}
                    disabled={sedangProses}
                    className="neo-btn"
                    style={{
                      flex: 2,
                      padding: "12px",
                      borderRadius: "12px",
                      border: `2px solid ${warnaMod.gelap}`,
                      background: sedangProses ? "#94a3b8" : warnaMod.utama,
                      color: "#ffffff",
                      fontWeight: "bold",
                      cursor: sedangProses ? "wait" : "pointer",
                      boxShadow: `0 3px 0 ${warnaMod.gelap}`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <i className={sedangProses ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-circle-plus"}></i>
                    {sedangProses ? "Mencipta..." : "Cipta Akaun"}
                  </button>
                </div>
              </>
            ) : hasilAffiliate ? (
              <>
                <div
                  className="neo-btn"
                  style={{
                    backgroundColor: "#7c3aed",
                    color: "white",
                    fontSize: "clamp(1rem, 3.5vw, 1.18rem)",
                    margin: "0 auto 14px auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    pointerEvents: "none",
                    padding: "8px 22px",
                    lineHeight: "1.2",
                    fontWeight: "900",
                    borderRadius: "12px",
                  }}
                >
                  <i className="fa-solid fa-circle-check"></i> Affiliate Berjaya Didaftar
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "2px dashed #7c3aed",
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: "14px",
                    fontSize: "0.9rem",
                    lineHeight: "1.9",
                    textAlign: "left",
                    boxShadow: "0 3px 0 #0f172a",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-user" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span><b>Nama:</b> {hasilAffiliate.nama}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-key" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span>
                      <b>Kod Affiliate:</b>{" "}
                      <span style={{ background: "#f5f3ff", padding: "1px 7px", borderRadius: "5px", fontWeight: "bold", border: "1px solid #c4b5fd" }}>
                        {hasilAffiliate.kod}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-link" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span style={{ wordBreak: "break-all" }}>
                      <b>Pautan Khas:</b>{" "}
                      <span style={{ color: "#6d28d9", fontWeight: "600", fontSize: "0.85rem" }}>
                        {typeof window !== "undefined" ? `${window.location.origin}/?ref=${hasilAffiliate.kod}` : `/?ref=${hasilAffiliate.kod}`}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-brands fa-whatsapp" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span><b>WhatsApp:</b> {hasilAffiliate.whatsapp}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-envelope" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span style={{ wordBreak: "break-all" }}><b>Emel:</b> {hasilAffiliate.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-lock" style={{ color: "#7c3aed", width: "16px" }}></i>
                    <span style={{ wordBreak: "break-all" }}>
                      <b>Kata Laluan:</b>{" "}
                      <span style={{ background: "#f5f3ff", padding: "1px 7px", borderRadius: "5px", fontWeight: "bold", border: "1px solid #c4b5fd" }}>
                        {hasilAffiliate.password || "-"}
                      </span>
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "0.8rem", color: "#b45309", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "9px", padding: "9px 12px", margin: "0 0 14px 0", textAlign: "left", lineHeight: "1.5" }}>
                  <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                  Kata laluan ini dipaparkan <b>sekali sahaja</b> — salin & hantar kepada affiliate sekarang.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {hasilAffiliate.whatsapp && (
                    <a
                      href={`https://wa.me/${hasilAffiliate.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(binaMesejWhatsAppAffiliate(hasilAffiliate.nama, hasilAffiliate.kod, hasilAffiliate.email, hasilAffiliate.password))}`}
                      target="_blank"
                      rel="noopener"
                      className="neo-btn"
                      style={{
                        width: "100%",
                        minWidth: "100%",
                        height: "50px",
                        padding: "0 20px",
                        margin: "0 auto",
                        borderRadius: "12px",
                        border: "2px solid #0f172a",
                        background: "#16a34a",
                        color: "#ffffff",
                        fontSize: "1.05rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #0f172a",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "9px",
                        textDecoration: "none",
                      }}
                    >
                      <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.25rem" }}></i>
                      Hantar ke WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={salinMesej}
                    className="neo-btn"
                    title={disalin ? "Mesej Disalin!" : "Salin Mesej WhatsApp"}
                    aria-label="Salin Mesej WhatsApp"
                    style={{
                      width: "100%",
                      minWidth: "100%",
                      height: "52px",
                      padding: "0 20px",
                      margin: "0 auto",
                      borderRadius: "12px",
                      border: "2px solid #0f172a",
                      background: disalin ? "#22c55e" : "#ffffff",
                      color: disalin ? "#ffffff" : "#0f172a",
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 3px 0 #0f172a",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "9px",
                    }}
                  >
                    <i className={disalin ? "fa-solid fa-check" : "fa-solid fa-clipboard"}></i>
                    {disalin ? "Disalin!" : "Copy"}
                  </button>
                  <div style={{ display: "flex", gap: "9px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={resetBorang}
                      className="neo-btn"
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "12px",
                        border: "2px solid #7c3aed",
                        background: "#ffffff",
                        color: "#7c3aed",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #7c3aed",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                      }}
                    >
                      <i className="fa-solid fa-user-plus"></i> Cipta Lagi
                    </button>
                    <button
                      type="button"
                      onClick={tutup}
                      className="neo-btn"
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "12px",
                        border: "2px solid #5b21b6",
                        background: "#7c3aed",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #5b21b6",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                      }}
                    >
                      <i className="fa-solid fa-circle-check"></i> Selesai
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="neo-btn"
                  style={{
                    backgroundColor: "#168f81",
                    color: "white",
                    fontSize: "clamp(1rem, 3.5vw, 1.18rem)",
                    margin: "0 auto 14px auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    pointerEvents: "none",
                    padding: "8px 22px",
                    lineHeight: "1.2",
                    fontWeight: "900",
                    borderRadius: "12px",
                  }}
                >
                  <i className="fa-solid fa-circle-check"></i> Akaun Berjaya Dicipta
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "2px dashed #168f81",
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: "14px",
                    fontSize: "0.9rem",
                    lineHeight: "1.9",
                    textAlign: "left",
                    boxShadow: "0 3px 0 #0f172a",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-user" style={{ color: "#168f81", width: "16px" }}></i>
                    <span><b>Nama:</b> {hasil.nama}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-envelope" style={{ color: "#168f81", width: "16px" }}></i>
                    <span><b>Emel:</b> {hasil.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-key" style={{ color: "#168f81", width: "16px" }}></i>
                    <span>
                      <b>Kata Laluan:</b>{" "}
                      <span style={{ background: "#fef9c3", padding: "1px 7px", borderRadius: "5px", fontWeight: "bold", border: "1px solid #fde047" }}>
                        {hasil.password}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-box-open" style={{ color: "#168f81", width: "16px" }}></i>
                    <span><b>Pakej:</b> {hasil.plan?.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <i className="fa-solid fa-calendar-days" style={{ color: "#168f81", width: "16px" }}></i>
                    <span><b>Sah sehingga:</b> {formatTarikh(hasil.tarikh_tamat)}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  <button
                    type="button"
                    onClick={salinMesej}
                    className="neo-btn"
                    title={disalin ? "Mesej Disalin!" : "Salin Mesej WhatsApp"}
                    aria-label="Salin Mesej WhatsApp"
                    style={{
                      width: "100%",
                      minWidth: "100%",
                      height: "52px",
                      padding: "0 20px",
                      margin: "0 auto",
                      borderRadius: "12px",
                      border: "2px solid #0f172a",
                      background: disalin ? "#22c55e" : "#ffffff",
                      color: disalin ? "#ffffff" : "#0f172a",
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 3px 0 #0f172a",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "9px",
                    }}
                  >
                    <i className={disalin ? "fa-solid fa-check" : "fa-solid fa-clipboard"}></i>
                    {disalin ? "Disalin!" : "Copy"}
                  </button>
                  <div style={{ display: "flex", gap: "9px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={resetBorang}
                      className="neo-btn"
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "12px",
                        border: "2px solid #168f81",
                        background: "#ffffff",
                        color: "#168f81",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #168f81",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                      }}
                    >
                      <i className="fa-solid fa-user-plus"></i> Cipta Lagi
                    </button>
                    <button
                      type="button"
                      onClick={tutup}
                      className="neo-btn"
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "12px",
                        border: "2px solid #0b5c53",
                        background: "#168f81",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #0b5c53",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                      }}
                    >
                      <i className="fa-solid fa-circle-check"></i> Selesai
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
