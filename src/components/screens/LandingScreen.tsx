// @ts-nocheck
import React from "react";

/**
 * Halaman pendaratan awam (public landing page) untuk bunyi-kata.my.
 *
 * Penting:
 * - Skrin ini ialah skrin AWAM. Ia tidak bergantung pada font "Atlanta Rounded"
 *   yang digunakan oleh aplikasi dalaman — kita guna font pameran berbeza
 *   (lihat kelas `.landing-*` dalam index.css) supaya hero kelihatan menarik,
 *   sambil KEKAL mengekalkan identiti visual aplikasi: neo-brutalism
 *   (sempadan tebal + bayang keras), warna hijau & emas.
 * - Ia satu `.screen` biasa (guna corak `.screen` + `.screen.active` sedia ada),
 *   jadi ia serasi dengan enjin navigasi app-logic.js tanpa mengubah apa-apa.
 */

interface LandingScreenProps {
  getScreenClass: (screenId: string, extraClasses?: string) => string;
  onCubaPercuma?: () => void;
  onLogMasuk?: () => void;
  onOpenPakej?: (tab?: "guru" | "ibubapa") => void;
}

const PROMO_IMG = "/images/sampingan/logo-login-screen.png";

const ciri = [
  {
    icon: "fa-solid fa-book-open-reader",
    warna: "#10b981",
    tajuk: "Belajar Fonik Step-by-Step",
    huraian:
      "Huruf vokal, konsonan, suku kata KV hingga bacaan penuh — disusun mengikut tahap usia anak.",
  },
  {
    icon: "fa-solid fa-gamepad",
    warna: "#f59e0b",
    tajuk: "12+ Mini Permainan",
    huraian:
      "Tanduk Kata, Cantum Kata, Suku Kata Puzzle dan banyak lagi — belajar jadi seronok.",
  },
  {
    icon: "fa-solid fa-microphone-lines",
    warna: "#3b82f6",
    tajuk: "Sebutan & Suara",
    huraian:
      "Kad imbasan bersuara membantu anak sebut perkataan dengan jelas dan yakin.",
  },
  {
    icon: "fa-solid fa-trophy",
    warna: "#8b5cf6",
    tajuk: "Lencana & Ganjaran",
    huraian:
      "Kumpul bintang, naik peta dan buka lencana baru — anak tak sabar nak belajar lagi.",
  },
];

const cabaran = [
  { nama: "Kad Imbasan", emoji: "🃏" },
  { nama: "Cantum Kata", emoji: "🧩" },
  { nama: "Tanduk Kata", emoji: "🎯" },
  { nama: "Suku Kata Puzzle", emoji: "🧱" },
  { nama: "Cuba Sebut", emoji: "🎤" },
  { nama: "Fonik ABC", emoji: "🔤" },
];

const langkah = [
  {
    no: "1",
    tajuk: "Tekan Cuba Percuma",
    huraian: "Tak perlu daftar. Terus mula belajar dalam beberapa saat.",
  },
  {
    no: "2",
    tajuk: "Pilih Watak Kesukaan",
    huraian: "Anak pilih watak pengembara dan mula jelajah peta belajar.",
  },
  {
    no: "3",
    tajuk: "Kumpul Bintang",
    huraian: "Selesaikan aktiviti, kumpul bintang dan buka lencana.",
  },
];

const testimoni = [
  {
    nama: "Puan Aisyah",
    peranan: "Ibu kepada Hana, 5 tahun",
    teks: "Anak saya dulu tak kenal huruf. Lepas seminggu main Bunyi Kata, dia dah boleh baca suku kata sendiri!",
  },
  {
    nama: "Cikgu Farah",
    peranan: "Guru Prasekolah",
    teks: "Sangat membantu dalam kelas. Murid lebih fokus dan tak sabar tunggu sesi fonik setiap hari.",
  },
  {
    nama: "Encik Danial",
    peranan: "Bapa kepada Adam, 6 tahun",
    teks: "Seronok sebab belajar macam main game. Adam tak perasan pun dia sedang belajar membaca.",
  },
];

export default function LandingScreen({
  getScreenClass,
  onCubaPercuma,
  onLogMasuk,
  onOpenPakej,
}: LandingScreenProps) {
  const [faqBuka, setFaqBuka] = React.useState<number | null>(0);

  const faq = [
    {
      s: "Adakah Bunyi Kata percuma?",
      j: "Ya! Versi percuma membolehkan anak mula belajar fonik dan bermain permainan terpilih tanpa sebarang bayaran. Untuk ciri penuh seperti semua peta, watak dan laporan kemajuan, boleh naik taraf ke Versi Pro bila-bila masa.",
    },
    {
      s: "Berapa umur yang sesuai?",
      j: "Sesuai untuk kanak-kanak 3 hingga 8 tahun — dari mula mengenal huruf sehingga boleh membaca perkataan penuh.",
    },
    {
      s: "Perlu daftar akaun ke?",
      j: "Tidak perlu. Tekan 'Cuba Percuma' dan anak boleh terus bermain. Akaun hanya perlu jika anda guru atau ibu bapa yang mahu menyimpan kemajuan berbilang anak.",
    },
    {
      s: "Boleh guna di telefon?",
      j: "Boleh. Bunyi Kata berfungsi pada telefon, tablet dan komputer — sesuai untuk belajar di mana-mana sahaja.",
    },
  ];

  return (
    <div id="landing-screen" className={getScreenClass("landing-screen")}>
      <div className="landing-root">
        {/* ===== TOP NAV ===== */}
        <header className="landing-nav">
          <div className="landing-nav-inner">
            <div className="landing-brand">
              <img src={PROMO_IMG} alt="Bunyi Kata" className="landing-brand-logo" />
            </div>
            <nav className="landing-nav-links">
              <a href="#ciri">Ciri</a>
              <a href="#cabaran">Permainan</a>
              <a href="#pakej">Pakej</a>
              <a href="#faq">FAQ</a>
            </nav>
            <div className="landing-nav-actions">
              <button className="landing-btn landing-btn-ghost" onClick={onLogMasuk}>
                Log Masuk
              </button>
              <button className="landing-btn landing-btn-primary" onClick={onCubaPercuma}>
                Cuba Percuma
              </button>
            </div>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <div className="landing-hero-text">
              <span className="landing-badge">✨ Belajar Membaca Jadi Seronok</span>
              <h1 className="landing-hero-title">
                Anak Pandai <span className="landing-hl">Membaca</span> Melalui
                Permainan
              </h1>
              <p className="landing-hero-sub">
                Bunyi Kata menggabungkan fonik bersuara, mini permainan dan
                ganjaran lencana untuk membantu anak anda mengenal huruf dan
                membaca — tanpa rasa tertekan.
              </p>
              <div className="landing-hero-cta">
                <button
                  className="landing-btn landing-btn-primary landing-btn-lg"
                  onClick={onCubaPercuma}
                >
                  <i className="fa-solid fa-rocket"></i> Cuba Percuma Sekarang
                </button>
                <button
                  className="landing-btn landing-btn-outline landing-btn-lg"
                  onClick={onLogMasuk}
                >
                  Log Masuk
                </button>
              </div>
              <p className="landing-hero-note">
                <i className="fa-solid fa-check"></i> Tak perlu daftar &nbsp;•&nbsp;
                <i className="fa-solid fa-check"></i> Guna di telefon & tablet
              </p>
            </div>

            <div className="landing-hero-art">
              <div className="landing-hero-card">
                <img src={PROMO_IMG} alt="Bunyi Kata" className="landing-hero-art-logo" />
                <div className="landing-hero-floats">
                  <span className="landing-float landing-float-1">🅰️</span>
                  <span className="landing-float landing-float-2">⭐</span>
                  <span className="landing-float landing-float-3">🏆</span>
                  <span className="landing-float landing-float-4">📚</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CIRI ===== */}
        <section className="landing-section" id="ciri">
          <div className="landing-section-head">
            <span className="landing-kicker">Kenapa Bunyi Kata?</span>
            <h2 className="landing-h2">Semua Yang Anak Perlukan Untuk Baca</h2>
            <p className="landing-section-sub">
              Aktiviti yang direka oleh pendidik, dibungkus dalam permainan yang
              anak suka.
            </p>
          </div>
          <div className="landing-grid landing-grid-ciri">
            {ciri.map((c) => (
              <div className="landing-card landing-card-ciri" key={c.tajuk}>
                <div className="landing-card-icon" style={{ backgroundColor: c.warna }}>
                  <i className={c.icon}></i>
                </div>
                <h3>{c.tajuk}</h3>
                <p>{c.huraian}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CABARAN / PERMAINAN ===== */}
        <section className="landing-section landing-section-alt" id="cabaran">
          <div className="landing-section-head">
            <span className="landing-kicker">Mini Permainan</span>
            <h2 className="landing-h2">Belajar Sambil Bermain</h2>
            <p className="landing-section-sub">
              Setiap permainan menumpu satu kemahiran membaca yang penting.
            </p>
          </div>
          <div className="landing-grid landing-grid-cabaran">
            {cabaran.map((c) => (
              <div className="landing-card landing-card-cabaran" key={c.nama}>
                <span className="landing-card-emoji">{c.emoji}</span>
                <span className="landing-card-nama">{c.nama}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LANGKAH ===== */}
        <section className="landing-section" id="mula">
          <div className="landing-section-head">
            <span className="landing-kicker">Senang Je</span>
            <h2 className="landing-h2">Mula Dalam 3 Langkah</h2>
          </div>
          <div className="landing-grid landing-grid-langkah">
            {langkah.map((l) => (
              <div className="landing-card landing-card-langkah" key={l.no}>
                <span className="landing-langkah-no">{l.no}</span>
                <h3>{l.tajuk}</h3>
                <p>{l.huraian}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONI ===== */}
        <section className="landing-section landing-section-alt">
          <div className="landing-section-head">
            <span className="landing-kicker">Kata Ibu Bapa & Guru</span>
            <h2 className="landing-h2">Mereka Dah Nampak Bezanya</h2>
          </div>
          <div className="landing-grid landing-grid-testimoni">
            {testimoni.map((t) => (
              <div className="landing-card landing-card-testimoni" key={t.nama}>
                <div className="landing-star-row">⭐⭐⭐⭐⭐</div>
                <p className="landing-testimoni-teks">"{t.teks}"</p>
                <div className="landing-testimoni-orang">
                  <strong>{t.nama}</strong>
                  <span>{t.peranan}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PAKEJ ===== */}
        <section className="landing-section" id="pakej">
          <div className="landing-section-head">
            <span className="landing-kicker">Pakej</span>
            <h2 className="landing-h2">Pilih Yang Sesuai Untuk Anda</h2>
            <p className="landing-section-sub">
              Mula percuma, naik taraf bila dah bersedia untuk ciri penuh.
            </p>
          </div>
          <div className="landing-grid landing-grid-pakej">
            <div className="landing-card landing-pakej">
              <span className="landing-pakej-tag landing-tag-gratis">Percuma</span>
              <div className="landing-pakej-harga">
                <span className="landing-pakej-rm">RM</span>0
              </div>
              <p className="landing-pakej-note">Selamanya. Untuk mula kenal huruf.</p>
              <ul className="landing-pakej-senarai">
                <li>✓ Fonik asas (vokal & konsonan)</li>
                <li>✓ Permainan terpilih</li>
                <li>✓ 1 profil anak</li>
              </ul>
              <button
                className="landing-btn landing-btn-outline landing-btn-block"
                onClick={onCubaPercuma}
              >
                Cuba Sekarang
              </button>
            </div>

            <div className="landing-card landing-pakej landing-pakej-pro">
              <span className="landing-pakej-tag landing-tag-pro">⭐ Pro</span>
              <div className="landing-pakej-harga">
                <span className="landing-pakej-rm">RM</span>29
                <span className="landing-pakej-bulan">/bulan</span>
              </div>
              <p className="landing-pakej-note">Buka semua ciri & laporan kemajuan.</p>
              <ul className="landing-pakej-senarai">
                <li>✓ Semua peta pembelajaran</li>
                <li>✓ Semua mini permainan</li>
                <li>✓ Semua watak & lencana</li>
                <li>✓ Laporan kemajuan anak</li>
              </ul>
              <button
                className="landing-btn landing-btn-primary landing-btn-block"
                onClick={() => onOpenPakej && onOpenPakej("guru")}
              >
                Dapatkan Versi Pro
              </button>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="landing-section landing-section-alt" id="faq">
          <div className="landing-section-head">
            <span className="landing-kicker">Soalan Lazim</span>
            <h2 className="landing-h2">Ada Persoalan?</h2>
          </div>
          <div className="landing-faq">
            {faq.map((f, i) => (
              <div className={`landing-faq-item ${faqBuka === i ? "buka" : ""}`} key={f.s}>
                <button
                  className="landing-faq-soalan"
                  onClick={() => setFaqBuka(faqBuka === i ? null : i)}
                >
                  <span>{f.s}</span>
                  <i
                    className={`fa-solid fa-chevron-down landing-faq-arrow ${
                      faqBuka === i ? "buka" : ""
                    }`}
                  ></i>
                </button>
                {faqBuka === i && <div className="landing-faq-jawapan">{f.j}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA PENUTUP ===== */}
        <section className="landing-cta-banner">
          <h2>Sedia Bantu Anak Anda Membaca?</h2>
          <p>Mulakan perjalanan bacaan mereka hari ini — percuma.</p>
          <button
            className="landing-btn landing-btn-primary landing-btn-lg"
            onClick={onCubaPercuma}
          >
            <i className="fa-solid fa-rocket"></i> Cuba Percuma Sekarang
          </button>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <img src={PROMO_IMG} alt="Bunyi Kata" className="landing-footer-logo" />
              <p>Belajar membaca jadi seronok. Dibina untuk anak Malaysia.</p>
            </div>
            <div className="landing-footer-col">
              <h4>Produk</h4>
              <a href="#ciri">Ciri</a>
              <a href="#cabaran">Permainan</a>
              <a href="#pakej">Pakej</a>
            </div>
            <div className="landing-footer-col">
              <h4>Akaun</h4>
              <a href="#faq">FAQ</a>
              <button className="landing-footer-link" onClick={onLogMasuk}>
                Log Masuk
              </button>
            </div>
          </div>
          <div className="landing-footer-bottom">
            © {new Date().getFullYear()} Bunyi Kata · bunyi-kata.my · Hak cipta terpelihara.
          </div>
        </footer>
      </div>
    </div>
  );
}

