// @ts-nocheck
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
  type PerananPengguna,
  type KunciPakej,
  type HasilCiptaAkaun,
} from "../../services/adminService";

const PAKEJ_PILIHAN: { key: KunciPakej; label: string; harga: string }[] = [
  { key: "1bulan", label: "1 Bulan (Pro)", harga: "RM15" },
  { key: "3bulan", label: "3 Bulan (Pro)", harga: "RM40" },
  { key: "1tahun", label: "1 Tahun (Pro)", harga: "RM69" },
];

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
    `Salam ${h.nama || ""},`,
    "",
    "Akaun Bunyi Kata anda telah sedia untuk digunakan!",
    "",
    "Pautan: https://bunyikata--bunyi-kata-official.asia-southeast1.hosted.app",
    `Emel: ${h.email || ""}`,
    `Kata laluan sementara: ${h.password || ""}`,
    "",
    `Pakej: ${h.plan?.name || "-"}`,
    `Sah sehingga: ${formatTarikh(h.tarikh_tamat)}`,
    "",
    "Sila log masuk dan tukar kata laluan anda di menu Tetapan.",
    "",
    "Terima kasih kerana memilih Bunyi Kata!",
  ].join("\n");
}

interface CiptaAkaunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CiptaAkaunModal({ isOpen, onClose }: CiptaAkaunModalProps) {
  const [peranan, setPeranan] = React.useState<PerananPengguna>("guru");
  const [nama, setNama] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [noTelefon, setNoTelefon] = React.useState("");
  const [namaKeluarga, setNamaKeluarga] = React.useState("");
  const [pakej, setPakej] = React.useState<KunciPakej>("1bulan");

  const [sedangProses, setSedangProses] = React.useState(false);
  const [ralat, setRalat] = React.useState("");
  const [hasil, setHasil] = React.useState<HasilCiptaAkaun | null>(null);
  const [disalin, setDisalin] = React.useState(false);

  const resetBorang = () => {
    setNama("");
    setEmail("");
    setNoTelefon("");
    setNamaKeluarga("");
    setPakej("1bulan");
    setRalat("");
    setHasil(null);
    setDisalin(false);
  };

  const tutup = () => {
    if (sedangProses) return;
    resetBorang();
    onClose();
  };

  const hantar = async () => {
    setRalat("");
    if (!nama.trim() || !email.trim()) {
      setRalat("Nama dan emel diperlukan.");
      return;
    }
    setSedangProses(true);
    const keputusan = await ciptaAkaunAdmin({
      nama: nama.trim(),
      email: email.trim(),
      peranan,
      no_telefon: noTelefon.trim(),
      nama_sekolah: "",
      nama_keluarga: peranan === "ibubapa" ? namaKeluarga.trim() : "",
      planKey: pakej,
    });
    setSedangProses(false);

    if (!keputusan.berjaya) {
      setRalat(keputusan.mesej || "Gagal mencipta akaun.");
      return;
    }
    setHasil(keputusan);
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
  };

  const salinMesej = async () => {
    if (!hasil) return;
    const mesej = binaMesejWhatsApp(hasil);
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

  const bukaWhatsApp = () => {
    if (!hasil) return;
    const mesej = encodeURIComponent(binaMesejWhatsApp(hasil));
    const noBersih = noTelefon.replace(/[^0-9]/g, "").replace(/^0/, "60");
    const url = noBersih
      ? `https://wa.me/${noBersih}?text=${mesej}`
      : `https://wa.me/?text=${mesej}`;
    window.open(url, "_blank");
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

  // Warna ikut mod (peranan terpilih): guru = oren, ibu bapa = biru.
  const warnaMod =
    peranan === "guru"
      ? { utama: "#ea580c", gelap: "#c2410c" }
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
            {!hasil ? (
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
                  <i className="fa-solid fa-user-plus"></i> Cipta Akaun Pengguna
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Peranan</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["guru", "ibubapa"] as PerananPengguna[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setPeranan(r)}
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
                        <i className={r === "guru" ? "fa-solid fa-chalkboard-user" : "fa-solid fa-people-roof"}></i>
                        {r === "guru" ? "Guru" : "Ibu Bapa"}
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
                    placeholder="cth. siti@sekolah.edu.my"
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>No. Telefon (WhatsApp)</label>
                  <input
                    style={inputStyle}
                    value={noTelefon}
                    onChange={(e) => setNoTelefon(e.target.value)}
                    placeholder="cth. 0123456789"
                  />
                </div>

                {peranan === "ibubapa" && (
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Nama Keluarga</label>
                    <input
                      style={inputStyle}
                      value={namaKeluarga}
                      onChange={(e) => setNamaKeluarga(e.target.value)}
                      placeholder="cth. Keluarga Ahmad"
                    />
                  </div>
                )}

                <div style={{ ...fieldStyle, marginBottom: "16px" }}>
                  <label style={labelStyle}>Pakej Langganan</label>
                  <select
                    style={inputStyle}
                    value={pakej}
                    onChange={(e) => setPakej(e.target.value as KunciPakej)}
                  >
                    {PAKEJ_PILIHAN.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label} — {p.harga}
                      </option>
                    ))}
                  </select>
                </div>

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
                <p style={{ margin: "0 0 16px", fontSize: "0.84rem", color: "#475569", fontWeight: "bold" }}>
                  Salin mesej di bawah dan hantar kepada pengguna melalui WhatsApp.
                </p>

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
                    style={{
                      padding: "13px",
                      borderRadius: "12px",
                      border: "2px solid #0f172a",
                      background: disalin ? "#22c55e" : "#ffffff",
                      color: disalin ? "#ffffff" : "#0f172a",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 3px 0 #0f172a",
                    }}
                  >
                    <i className={disalin ? "fa-solid fa-check" : "fa-solid fa-clipboard"}></i>
                    {disalin ? "Mesej Disalin!" : "Salin Mesej WhatsApp"}
                  </button>
                  <button
                    type="button"
                    onClick={bukaWhatsApp}
                    className="neo-btn"
                    style={{
                      padding: "13px",
                      borderRadius: "12px",
                      border: "2px solid #15803d",
                      background: "#25D366",
                      color: "#ffffff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 3px 0 #15803d",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "9px",
                    }}
                  >
                    <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.15rem" }}></i> Buka WhatsApp
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
                        border: "2px solid #0f172a",
                        background: "#f1f5f9",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #0f172a",
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
                        border: "2px solid #0f172a",
                        background: "#0f172a",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 3px 0 #000000",
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

                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "0.74rem",
                    color: "#92400e",
                    textAlign: "center",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                  }}
                >
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Kata laluan hanya dipaparkan sekali sahaja. Salin dahulu sebelum tutup.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
