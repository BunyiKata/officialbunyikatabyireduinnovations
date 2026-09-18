// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Modal Terma Perkhidmatan & Dasar Privasi — Bunyi Kata
 * =====================================================
 *
 * Satu popup dengan DUA tab: "Terma" dan "Privasi".
 * Gaya diselaraskan dengan modal sedia ada (corak titik, tajuk badge,
 * butang X merah petak) supaya kelihatan seragam dengan seluruh app.
 *
 * NOTA UNDANG-UNDANG: Teks di bawah ialah draf dalam Bahasa Melayu yang telah
 * diisi dengan maklumat penyedia. Ia BUKAN nasihat guaman. Sila dapatkan
 * semakan penasihat guaman bertauliah sebelum bergantung sepenuhnya padanya,
 * terutamanya bagi pematuhan penuh PDPA 2010.
 */

export type LegalTab = "terma" | "privasi";

interface TermsPrivacyModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

// ── Nilai boleh-ubah (kemas kini di sini bila maklumat rasmi tersedia) ──────
const PENYEDIA = "IR EduInnovations";
const SSM = "202603165976 (IP0627791-A)";
const EMEL = "ireduinnovations@gmail.com";
const TARIKH_KEMASKINI = "1 Januari 2026"; // TODO: semak tarikh kuat kuasa sebenar

// ── Gaya kongsi ─────────────────────────────────────────────────────────────
const gayaSeksyen: React.CSSProperties = {
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  borderRadius: "14px",
  padding: "12px 14px",
  marginBottom: "10px",
  textAlign: "left",
};

const gayaSeksyenTajuk: React.CSSProperties = {
  fontWeight: 900,
  fontSize: "0.92rem",
  color: "#10182f",
  marginBottom: "4px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const gayaPerenggan: React.CSSProperties = {
  fontSize: "0.84rem",
  lineHeight: 1.55,
  color: "#334155",
  margin: 0,
};

const gayaSenarai: React.CSSProperties = {
  ...gayaPerenggan,
  marginTop: "6px",
  paddingLeft: "18px",
};

// ── Komponen kecil ──────────────────────────────────────────────────────────
function Seksyen({ no, tajuk, children }: { no: string; tajuk: string; children: React.ReactNode }) {
  return (
    <div style={gayaSeksyen}>
      <div style={gayaSeksyenTajuk}>
        <span
          style={{
            background: "#10182f",
            color: "white",
            width: "22px",
            height: "22px",
            minWidth: "22px",
            borderRadius: "7px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.78rem",
          }}
        >
          {no}
        </span>
        {tajuk}
      </div>
      {children}
    </div>
  );
}

function Penanda({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "#fef08a",
        color: "#854d0e",
        padding: "1px 6px",
        borderRadius: "6px",
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

// ── Kandungan: TERMA PERKHIDMATAN ───────────────────────────────────────────
function KandunganTerma() {
  return (
    <>
      <p style={{ ...gayaPerenggan, marginBottom: "12px", fontStyle: "italic" }}>
        Kemas kini terakhir: <Penanda>{TARIKH_KEMASKINI}</Penanda>
      </p>

      <Seksyen no="1" tajuk="Penerimaan Terma">
        <p style={gayaPerenggan}>
          Dengan mengakses atau menggunakan aplikasi <strong>Bunyi Kata</strong>{" "}
          (selepas ini "Aplikasi"), anda bersetuju untuk terikat dengan Terma
          Perkhidmatan ini. Jika anda <strong>tidak bersetuju</strong>, sila
          berhenti menggunakan Aplikasi.
        </p>
      </Seksyen>

      <Seksyen no="2" tajuk="Maklumat Penyedia">
        <p style={gayaPerenggan}>
          Aplikasi ini disediakan dan dikendalikan oleh:
        </p>
        <ul style={gayaSenarai}>
          <li>
            <strong>{PENYEDIA}</strong>
          </li>
          <li>
            No. Pendaftaran: <Penanda>{SSM}</Penanda>
          </li>
          <li>
            Hubungi: <Penanda>{EMEL}</Penanda>
          </li>
        </ul>
      </Seksyen>

      <Seksyen no="3" tajuk="Akaun & Keselamatan">
        <p style={gayaPerenggan}>
          Guru dan ibu bapa perlu mendaftar akaun untuk menggunakan ciri penuh.
          Anda bertanggungjawab menjaga kerahsiaan kata laluan akaun anda dan
          semua aktiviti yang berlaku di bawah akaun tersebut. Sila maklumkan
          kepada kami dengan segera jika anda mengesyaki penggunaan tanpa izin.
        </p>
      </Seksyen>

      <Seksyen no="4" tajuk="Kod Kelas & Kod Keluarga">
        <p style={gayaPerenggan}>
          Aplikasi menggunakan <strong>kod kelas</strong> dan{" "}
          <strong>kod keluarga</strong> untuk membolehkan murid/anak mengakses
          bahan pembelajaran. Kod ini bersifat <strong>sulit</strong>. Anda
          hendaklah tidak berkongsi kod dengan individu di luar kumpulan yang
          sepatutnya.
        </p>
      </Seksyen>

      <Seksyen no="5" tajuk="Bayaran & Langganan">
        <p style={gayaPerenggan}>
          Sebahagian ciri ditawarkan melalui pakej berbayar (Pakej Pro). Harga
          dan ciri dipaparkan dalam Aplikasi dan boleh berubah dari semasa ke
          semasa.
        </p>
        <ul style={gayaSenarai}>
          <li>
            Dasar bayaran balik: Bayaran yang telah dibuat adalah{" "}
            <strong>tidak boleh dikembalikan (non-refundable)</strong> selepas
            akses langganan diaktifkan.
          </li>
          <li>
            Tempoh langganan dan pembaharuan: Langganan ditawarkan secara{" "}
            <strong>bulanan atau tahunan</strong>, dan{" "}
            <strong>diperbaharui secara automatik</strong> melainkan dibatalkan
            sebelum tarikh pembaharuan.
          </li>
        </ul>
      </Seksyen>

      <Seksyen no="6" tajuk="Penggunaan yang Dibenarkan & Dilarang">
        <p style={gayaPerenggan}>Anda bersetuju untuk TIDAK:</p>
        <ul style={gayaSenarai}>
          <li>Menyalin, menjual, atau menyewa semula kandungan Aplikasi;</li>
          <li>Mengubah suai, menggodam, atau menceroboh sistem Aplikasi;</li>
          <li>Menggunakan Aplikasi untuk tujuan menyalahi undang-undang;</li>
          <li>
            Cuba mengakses data pengguna lain atau menyalahgunakan kod akses.
          </li>
        </ul>
      </Seksyen>

      <Seksyen no="7" tajuk="Harta Intelek">
        <p style={gayaPerenggan}>
          Semua kandungan, logo, bahan pembelajaran, dan perisian dalam Aplikasi
          adalah hak milik {PENYEDIA} atau pemberi lesennya, dan dilindungi oleh
          undang-undang harta intelek. Anda tidak diberi hak milik ke atas
          mana-mana kandungan.
        </p>
      </Seksyen>

      <Seksyen no="8" tajuk="Penafian & Had Tanggungjawab">
        <p style={gayaPerenggan}>
          Aplikasi disediakan "seadanya" dan "seperti tersedia". Kami berusaha
          memastikan perkhidmatan berjalan lancar, tetapi kami{" "}
          <strong>tidak menjamin</strong> perkhidmatan bebas sepenuhnya daripada
          gangguan, ralat, atau kehilangan data. Setakat yang dibenarkan
          undang-undang, kami tidak bertanggungjawab atas kerugian tidak langsung
          yang timbul daripada penggunaan Aplikasi.
        </p>
      </Seksyen>

      <Seksyen no="9" tajuk="Perubahan kepada Terma">
        <p style={gayaPerenggan}>
          Kami boleh mengemas kini Terma ini dari semasa ke semasa. Perubahan
          akan dimaklumkan melalui Aplikasi. Penggunaan berterusan selepas
          perubahan bermaksud anda menerima Terma yang dikemas kini.
        </p>
      </Seksyen>

      <Seksyen no="10" tajuk="Undang-undang yang Mentadbir">
        <p style={gayaPerenggan}>
          Terma ini ditadbir oleh undang-undang <strong>Malaysia</strong>.
          Sebarang pertikaian tertakluk kepada bidang kuasa mahkamah Malaysia.
        </p>
      </Seksyen>
    </>
  );
}

// ── Kandungan: DASAR PRIVASI ────────────────────────────────────────────────
function KandunganPrivasi() {
  return (
    <>
      <p style={{ ...gayaPerenggan, marginBottom: "12px", fontStyle: "italic" }}>
        Kemas kini terakhir: <Penanda>{TARIKH_KEMASKINI}</Penanda>
      </p>

      <Seksyen no="1" tajuk="Data yang Kami Kumpul">
        <ul style={gayaSenarai}>
          <li>Nama murid/anak dan avatar pilihan;</li>
          <li>Markah, kemajuan pembelajaran, dan lencana;</li>
          <li>
            Kod kelas/keluarga, dan pautan akaun guru atau ibu bapa yang
            berkaitan;
          </li>
          <li>E-mel dan nama akaun guru/ibu bapa (untuk log masuk);</li>
          <li>Maklumat teknikal asas untuk operasi Aplikasi.</li>
        </ul>
      </Seksyen>

      <Seksyen no="2" tajuk="Data Kanak-Kanak">
        <p style={gayaPerenggan}>
          Aplikasi ini digunakan oleh kanak-kanak{" "}
          <strong>bawah akaun dan pengawasan guru atau ibu bapa</strong>. Kami{" "}
          <strong>tidak mengumpul alamat e-mel kanak-kanak</strong> dan
          kanak-kanak tidak mendaftar akaun sendiri. Murid/anak mengakses
          pembelajaran dengan memasukkan <strong>kod kelas atau kod keluarga</strong>{" "}
          sahaja. Data murid disimpan di bawah tanggungjawab akaun dewasa yang
          berkaitan. Ibu bapa/penjaga yang ingin memadam data anak boleh
          menghubungi kami (lihat Seksyen 6).
        </p>
      </Seksyen>

      <Seksyen no="3" tajuk="Tujuan Penggunaan Data">
        <ul style={gayaSenarai}>
          <li>Menyampaikan aktiviti pembelajaran dan menyimpan kemajuan;</li>
          <li>Memaparkan markah, pencapaian, dan maklum balas;</li>
          <li>Menghubungkan murid dengan kelas/keluarga yang betul;</li>
          <li>Menambah baik dan menyelenggara Aplikasi.</li>
        </ul>
      </Seksyen>

      <Seksyen no="4" tajuk="Penyimpanan Data">
        <p style={gayaPerenggan}>
          Data disimpan dengan selamat menggunakan perkhidmatan awan. Tempoh
          penyimpanan: data disimpan <strong>selagi akaun anda aktif</strong>,
          dan sehingga <strong>12 bulan</strong> selepas akaun dipadam (untuk
          tujuan perakaunan, audit, dan pematuhan undang-undang), selepas itu
          ia dipadamkan secara kekal.
        </p>
      </Seksyen>

      <Seksyen no="5" tajuk="Perkongsian Data">
        <p style={gayaPerenggan}>
          Kami <strong>tidak menjual</strong> data peribadi anda. Data hanya
          dikongsi dengan penyedia perkhidmatan teknologi yang diperlukan untuk
          mengendalikan Aplikasi, dan jika dikehendaki oleh undang-undang.
        </p>
      </Seksyen>

      <Seksyen no="6" tajuk="Hak Anda di bawah PDPA">
        <p style={gayaPerenggan}>
          Tertakluk kepada{" "}
          <strong>Akta Perlindungan Data Peribadi 2010 (PDPA)</strong>, anda
          berhak untuk:
        </p>
        <ul style={gayaSenarai}>
          <li>Mengakses dan menyemak data peribadi anda;</li>
          <li>Membetulkan data yang tidak tepat;</li>
          <li>Meminta pemadaman data;</li>
          <li>Menarik balik persetujuan (tertakluk kepada undang-undang).</li>
        </ul>
        <p style={{ ...gayaPerenggan, marginTop: "8px" }}>
          Untuk melaksanakan hak ini, hubungi: <Penanda>{EMEL}</Penanda>
        </p>
      </Seksyen>

      <Seksyen no="7" tajuk="Keselamatan Data">
        <p style={gayaPerenggan}>
          Kami mengambil langkah keselamatan yang munasabah untuk melindungi
          data anda daripada akses, penggunaan, atau pendedahan tanpa izin.
          Namun, tiada kaedah penghantaran atau penyimpanan elektronik yang 100%
          selamat.
        </p>
      </Seksyen>

      <Seksyen no="8" tajuk="Perubahan kepada Dasar Ini">
        <p style={gayaPerenggan}>
          Dasar Privasi ini boleh dikemas kini dari semasa ke semasa. Versi
          terkini akan dipaparkan dalam Aplikasi.
        </p>
      </Seksyen>

      <Seksyen no="9" tajuk="Hubungi Kami">
        <p style={gayaPerenggan}>
          Untuk sebarang pertanyaan berkaitan privasi: <br />
          <strong>{PENYEDIA}</strong>
          <br />
          E-mel: <Penanda>{EMEL}</Penanda>
        </p>
      </Seksyen>
    </>
  );
}

// ── Modal utama ─────────────────────────────────────────────────────────────
export function TermsPrivacyModal({
  isOpen,
  initialTab = "terma",
  onClose,
}: TermsPrivacyModalProps) {
  const [tab, setTab] = React.useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          style={{
            display: "flex",
            zIndex: 9999999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="modal-content neo-box"
            style={{
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              padding: "24px 18px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "auto",
              position: "relative",
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
              borderRadius: "24px",
              border: "4px solid var(--color-dark, #10182f)",
              boxShadow: "0 8px 0 var(--color-dark, #10182f)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Butang X merah petak */}
            <button
              className="neo-btn bg-red close-btn"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "38px",
                height: "38px",
                minWidth: "38px",
                minHeight: "38px",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                fontSize: "1.15rem",
                color: "white",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 2.5px 0 var(--color-dark, #10182f)",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={onClose}
              title="Tutup"
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Tajuk badge */}
            <div
              className="neo-btn"
              style={{
                backgroundColor: tab === "terma" ? "#168f81" : "#0284c7",
                color: "white",
                fontSize: "clamp(1.05rem, 3.8vw, 1.25rem)",
                fontWeight: 900,
                padding: "8px 24px",
                borderRadius: "16px",
                border: "3px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                margin: "4px auto 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
              }}
            >
              <i
                className={
                  tab === "terma"
                    ? "fa-solid fa-file-contract"
                    : "fa-solid fa-shield-halved"
                }
              ></i>
              {tab === "terma" ? "Terma Perkhidmatan" : "Dasar Privasi"}
            </div>

            {/* Tab penukar */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "14px",
                width: "100%",
              }}
            >
              <button
                className="neo-btn"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: tab === "terma" ? "#168f81" : "#e2e8f0",
                  color: tab === "terma" ? "white" : "#334155",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 2.5px 0 var(--color-dark, #10182f)",
                }}
                onClick={() => setTab("terma")}
              >
                Terma
              </button>
              <button
                className="neo-btn"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: tab === "privasi" ? "#0284c7" : "#e2e8f0",
                  color: tab === "privasi" ? "white" : "#334155",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 2.5px 0 var(--color-dark, #10182f)",
                }}
                onClick={() => setTab("privasi")}
              >
                Privasi
              </button>
            </div>

            {/* Kandungan bergulir */}
            <div
              style={{
                width: "100%",
                overflowY: "auto",
                textAlign: "left",
                paddingRight: "4px",
                flex: 1,
                minHeight: 0,
              }}
            >
              {tab === "terma" ? <KandunganTerma /> : <KandunganPrivasi />}
            </div>

            {/* Butang tutup bawah */}
            <button
              className="neo-btn bg-yellow"
              style={{
                marginTop: "14px",
                width: "100%",
                padding: "11px",
                fontSize: "1rem",
                fontWeight: 900,
                borderRadius: "14px",
                color: "var(--color-dark, #10182f)",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Saya Faham <i className="fa-solid fa-check"></i>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TermsPrivacyModal;
