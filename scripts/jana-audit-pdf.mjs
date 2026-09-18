/**
 * Penjana PDF - "Audit Projek Bunyi Kata: Penilaian Menyeluruh"
 *
 * Guna: node scripts/jana-audit-pdf.mjs
 * Hasil: Audit-BunyiKata-PenilaianMenyeluruh.pdf (akar projek)
 */

import { jsPDF } from "jspdf";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

const C = {
  ink: [26, 32, 44],
  muted: [100, 116, 139],
  line: [203, 213, 225],
  brand: [37, 99, 235],
  brandDark: [30, 64, 175],
  red: [220, 38, 38],
  redBg: [254, 226, 226],
  orange: [234, 88, 12],
  orangeBg: [255, 237, 213],
  yellow: [161, 98, 7],
  yellowBg: [254, 249, 195],
  green: [21, 128, 61],
  greenBg: [220, 252, 231],
  purple: [126, 34, 206],
  purpleBg: [243, 232, 255],
  slateBg: [241, 245, 249],
};

const doc = new jsPDF({ unit: "mm", format: "a4" });
let y = 0;

function setFont(size, style = "normal", color = C.ink) {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(color[0], color[1], color[2]);
}

function ensureSpace(needed) {
  if (y + needed > PAGE_H - 18) {
    doc.addPage();
    y = MARGIN;
  }
}

function text(str, opts = {}) {
  const size = opts.size ?? 10;
  const style = opts.style ?? "normal";
  const color = opts.color ?? C.ink;
  const x = MARGIN + (opts.indent ?? 0);
  const w = CONTENT_W - (opts.indent ?? 0);
  setFont(size, style, color);
  const lines = doc.splitTextToSize(String(str), w);
  const lh = size * 0.42 + 1.1;
  for (const line of lines) {
    ensureSpace(lh + 1);
    doc.text(line, x, y);
    y += lh;
  }
  y += opts.gap ?? 1.6;
}

function bullet(str, opts = {}) {
  const x = MARGIN + (opts.indent ?? 0);
  setFont(opts.size ?? 10, "normal", opts.color ?? C.ink);
  const dots = opts.dot ?? "-";
  const w = CONTENT_W - (opts.indent ?? 0) - 5;
  const lines = doc.splitTextToSize(String(str), w);
  const lh = (opts.size ?? 10) * 0.42 + 1.1;
  ensureSpace(lh + 1);
  doc.text(dots, x + 1, y);
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) ensureSpace(lh);
    doc.text(lines[i], x + 5.5, y);
    y += lh;
  }
  y += 1.2;
}

function spacer(n = 3) {
  y += n;
}


const TONES = {
  red: { bar: C.red, bg: C.redBg },
  orange: { bar: C.orange, bg: C.orangeBg },
  yellow: { bar: C.yellow, bg: C.yellowBg },
  green: { bar: C.green, bg: C.greenBg },
  purple: { bar: C.purple, bg: C.purpleBg },
  slate: { bar: C.muted, bg: C.slateBg },
};

function card(title, bodyLines, tone) {
  const t = TONES[tone] ?? TONES.slate;
  setFont(10.5, "bold");
  const titleLines = doc.splitTextToSize(title, CONTENT_W - 10);
  let h = titleLines.length * 5.4 + 4;
  for (const bl of bodyLines) {
    setFont(9, "normal");
    const ls = doc.splitTextToSize(bl, CONTENT_W - 12);
    h += ls.length * 4.4 + 1.2;
  }
  h += 4;
  ensureSpace(h + 3);
  const startY = y;
  doc.setFillColor(t.bg[0], t.bg[1], t.bg[2]);
  doc.roundedRect(MARGIN, startY - 1, CONTENT_W, h, 1.5, 1.5, "F");
  doc.setFillColor(t.bar[0], t.bar[1], t.bar[2]);
  doc.roundedRect(MARGIN, startY - 1, 1.6, h, 0.8, 0.8, "F");
  y = startY + 4;
  setFont(10.5, "bold", t.bar);
  for (const l of titleLines) {
    doc.text(l, MARGIN + 5, y);
    y += 5.4;
  }
  y += 0.5;
  for (const bl of bodyLines) {
    setFont(9, "normal", C.ink);
    const ls = doc.splitTextToSize(bl, CONTENT_W - 12);
    for (const l of ls) {
      doc.text(l, MARGIN + 5, y);
      y += 4.4;
    }
    y += 1.2;
  }
  y = startY + h + 3;
}

function h1(str) {
  if (y > MARGIN + 2) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFillColor(C.brandDark[0], C.brandDark[1], C.brandDark[2]);
  doc.roundedRect(MARGIN, y - 1, CONTENT_W, 10, 1.5, 1.5, "F");
  setFont(13, "bold", [255, 255, 255]);
  doc.text(str, MARGIN + 3.5, y + 5.2);
  y += 14;
}

function h2(str) {
  ensureSpace(12);
  y += 2;
  setFont(11.5, "bold", C.brandDark);
  doc.text(str, MARGIN, y);
  y += 1.6;
  doc.setDrawColor(C.brand[0], C.brand[1], C.brand[2]);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, MARGIN + 42, y);
  y += 4.5;
}


function table(headers, rows, widths) {
  const totalW = CONTENT_W;
  const xs = [];
  let acc = 0;
  for (const w of widths) {
    xs.push(MARGIN + acc);
    acc += (w / 100) * totalW;
  }
  const colW = widths.map((w) => (w / 100) * totalW);
  let zebra = true;

  function drawRow(cells, isHeader) {
    setFont(isHeader ? 9 : 8.6, isHeader ? "bold" : "normal", isHeader ? [255, 255, 255] : C.ink);
    const wrapped = cells.map((c, i) => doc.splitTextToSize(String(c ?? ""), colW[i] - 3));
    const rowH = Math.max(...wrapped.map((w) => w.length)) * 4.1 + (isHeader ? 3 : 4.6);
    ensureSpace(rowH + 2);
    if (isHeader) {
      doc.setFillColor(C.brand[0], C.brand[1], C.brand[2]);
      doc.rect(MARGIN, y - 3.6, totalW, rowH, "F");
    } else if (zebra) {
      doc.setFillColor(C.slateBg[0], C.slateBg[1], C.slateBg[2]);
      doc.rect(MARGIN, y - 3.6, totalW, rowH, "F");
    }
    for (let i = 0; i < cells.length; i++) {
      let ty = y;
      for (const l of wrapped[i]) {
        doc.text(l, xs[i] + 1.5, ty);
        ty += 4.1;
      }
    }
    y += rowH - 0.6;
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y - 0.6, MARGIN + totalW, y - 0.6);
  }

  drawRow(headers, true);
  for (const r of rows) {
    drawRow(r, false);
    zebra = !zebra;
  }
  y += 2;
}

function footerHeader() {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    if (i === 1) continue;
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
    setFont(7.6, "normal", C.muted);
    doc.text("Audit Projek Bunyi Kata - Penilaian Menyeluruh", MARGIN, PAGE_H - 7.5);
    doc.text("Halaman " + i + " / " + pages, PAGE_W - MARGIN, PAGE_H - 7.5, { align: "right" });
  }
}

// ---------------------------------------------------------------------------
// KULIT MUKA
// ---------------------------------------------------------------------------
function mukaDepan() {
  doc.setFillColor(C.brandDark[0], C.brandDark[1], C.brandDark[2]);
  doc.rect(0, 0, PAGE_W, 96, "F");
  doc.setFillColor(C.brand[0], C.brand[1], C.brand[2]);
  doc.rect(0, 88, PAGE_W, 8, "F");

  setFont(11, "bold", [191, 219, 254]);
  doc.text("LAPORAN AUDIT TEKNIKAL", MARGIN, 34);

  setFont(26, "bold", [255, 255, 255]);
  doc.text("Audit Projek", MARGIN, 50);
  doc.text("Bunyi Kata", MARGIN, 62);

  setFont(13, "normal", [219, 234, 254]);
  doc.text("Penilaian Menyeluruh", MARGIN, 74);
  setFont(9.5, "normal", [191, 219, 254]);
  doc.text("Keselamatan - Affiliate - Pembelajaran - Kod", MARGIN, 81);

  y = 108;
  doc.setFillColor(C.redBg[0], C.redBg[1], C.redBg[2]);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 2, 2, "F");
  doc.setFillColor(C.red[0], C.red[1], C.red[2]);
  doc.roundedRect(MARGIN, y, 2, 24, 1, 1, "F");
  setFont(12, "bold", C.red);
  doc.text("STATUS: PERLU TINDAKAN", MARGIN + 6, y + 9);
  setFont(9.5, "normal", C.ink);
  doc.text("Fungsi berjalan dengan baik, tetapi terdapat 3 isu keselamatan kritikal", MARGIN + 6, y + 15.5);
  doc.text("yang memerlukan pembaikan segera sebelum aplikasi meluas.", MARGIN + 6, y + 20);

  y = 142;
  const boxes = [
    { n: "3", label: "Kritikal", tone: "red" },
    { n: "5", label: "Serius", tone: "orange" },
    { n: "6", label: "Sederhana", tone: "yellow" },
    { n: "11", label: "Modul sedia ada", tone: "green" },
  ];
  const bw = (CONTENT_W - 3 * 4) / 4;
  boxes.forEach((b, i) => {
    const bx = MARGIN + i * (bw + 4);
    const t = TONES[b.tone];
    doc.setFillColor(t.bg[0], t.bg[1], t.bg[2]);
    doc.roundedRect(bx, y, bw, 22, 2, 2, "F");
    setFont(17, "bold", t.bar);
    doc.text(b.n, bx + bw / 2, y + 10, { align: "center" });
    setFont(8, "normal", C.ink);
    doc.text(b.label, bx + bw / 2, y + 17, { align: "center" });
  });

  y = 178;
  text("Dokumen ini menyenaraikan semua penemuan audit kod projek Bunyi Kata, lengkap dengan cadangan pembaikan yang disusun mengikut keutamaan. Ia juga mengandungi cadangan penambahbaikan kandungan pembelajaran, serta analisis idea menjadikan kod affiliate sebagai promo code pembeli.", { size: 10 });

  spacer(3);
  h2("Maklumat Dokumen");
  table(
    ["Perkara", "Butiran"],
    [
      ["Nama projek", "Bunyi Kata (bunyikata.my)"],
      ["Jenis dokumen", "Audit teknikal + cadangan penambahbaikan"],
      ["Skop", "Keselamatan, sistem affiliate, mod pembelajaran, kualiti kod"],
      ["Sumber audit", "Analisis kod sebenar (server.js, database.rules.json, app-logic.js, komponen React)"],
      ["Status", "Belum ada perubahan kod dibuat - laporan sahaja"],
    ],
    [32, 68],
  );

  spacer(2);
  doc.setFillColor(C.purpleBg[0], C.purpleBg[1], C.purpleBg[2]);
  doc.roundedRect(MARGIN, y, CONTENT_W, 12, 2, 2, "F");
  setFont(8.5, "italic", C.purple);
  doc.text("Nota: angka dalam dokumen ini disemak daripada kod sebenar projek, bukan andaian.", MARGIN + 4, y + 7.5);
  y += 16;
}



// ---------------------------------------------------------------------------
// BAHAGIAN 1: RINGKASAN EKSEKUTIF
// ---------------------------------------------------------------------------
function ringkasanEksekutif() {
  h1("1. RINGKASAN EKSEKUTIF");
  text("Projek Bunyi Kata adalah aplikasi pembelajaran Bahasa Melayu yang matang dan berfungsi - modul fonik, suku kata, nombor, matematik dan cerita semuanya lengkap, sistem affiliate berjalan, dan dashboard guru/ibu bapa/admin sudah wujud.", { size: 10 });
  text("Namun, audit kod mendedahkan satu kelemahan besar: tetapan keselamatan pangkalan data (database.rules.json) membenarkan sesiapa sahaja membaca data murid tanpa log masuk, dan kata laluan pengguna disimpan secara mentah di dalam pelayar. Ini isu privasi kanak-kanak yang serius dan perlu dibetulkan segera.", { size: 10 });
  spacer(2);
  h2("1.1 Kiraan Penemuan");
  table(
    ["Keutamaan", "Bilangan", "Contoh isu"],
    [
      ["Kritikal", "3", "Data murid terbuka; kata laluan mentah; tiada rate-limit admin"],
      ["Serius", "5", "Claims affiliate ditimpa; gate Pro client-side; nama kunci tidak konsisten"],
      ["Sederhana", "6", "Fail gergasi; catch senyap; SEO; aksesibiliti; backup"],
      ["Kekuatan (baik)", "6", "Harga di server; admin code di server; audit log; affiliate token-based"],
    ],
    [22, 16, 62],
  );
  spacer(2);
  h2("1.2 Tiga Tindakan Wajib Dulu");
  card("1. Kunci database.rules.json", [
    "Sekarang fail classes, families, students, scores, badges, feedbacks dan code_index menggunakan \".read\": true.",
    "Maksudnya: sesiapa di internet boleh baca nama murid, no. MyKid dan PIN keselamatan tanpa log masuk.",
  ], "red");
  card("2. Hapus kata laluan mentah", [
    "Kata laluan sebenar disimpan dalam localStorage (bunyiKataAdminPassword) dan dipaparkan dalam panel admin.",
    "Kata laluan tidak sepatutnya disimpan atau dipaparkan sama sekali.",
  ], "red");
  card("3. Tambah rate-limit + helmet pada pelayan", [
    "Pustaka express-rate-limit sudah ada dalam projek tetapi tidak digunakan; kod admin boleh di-cuba tanpa had.",
    "Tambahan lagi tiada security header (helmet) sama sekali.",
  ], "orange");
}

// ---------------------------------------------------------------------------
// BAHAGIAN 2: KESELAMATAN
// ---------------------------------------------------------------------------
function bahagianKeselamatan() {
  h1("2. KESELAMATAN");
  text("Ini bahagian paling penting dalam laporan. Beberapa penemuan di bawah melibatkan data kanak-kanak bawah umur (nama, MyKid, PIN) dan kata laluan pengguna.", { size: 10 });

  h2("K1 (KRITIKAL) - Data murid boleh dibaca sesiapa");
  card("Kekurangan", [
    "Fail: database.rules.json",
    "Nod berikut menggunakan \".read\": true - maknanya boleh dibaca TANPA log masuk:",
    "  classes, families, students, scores, badges, feedbacks, code_index",
    "Melalui ini, sesiapa sahaja di internet boleh membaca nama murid, no. MyKid (IC kanak-kanak), PIN keselamatan, data kelas, gred dan maklumat keluarga.",
    "Ini pelanggaran privasi serius (isu PDPA) kerana melibatkan kanak-kanak bawah umur.",
  ], "red");
  card("Cadangan pembaikan", [
    "Hadkan bacaan kepada pemilik sahaja - contoh untuk nod students:",
    "  \".read\": \"auth != null && (data.child('guru_id').val() == auth.uid || data.child('parent_id').val() == auth.uid || auth.token.admin == true)\"",
    "Untuk classes/families: benarkan baca hanya jika auth.uid sepadan guru_id atau parent_id.",
    "Amalkan prinsip 'deny by default' - mulakan dengan \".read\": false, kemudian buka hanya yang perlu.",
    "Uji dahulu dalam 'Rules Playground' di Firebase Console sebelum deploy supaya guru/ibu bapa sedia ada tidak hilang akses.",
  ], "green");

  h2("K2 (KRITIKAL) - Kata laluan mentah disimpan & dipaparkan");
  card("Kekurangan", [
    "Fail: src/components/modals/EditProfileModal.tsx (baris ~2321) dan public/app-logic.js (baris ~205)",
    "Kata laluan sebenar disimpan dalam localStorage: bunyiKataAdminPassword / bunyiKataGuruPassword / bunyiKataIbubapaPassword.",
    "Panel admin pula memaparkan kata laluan tersebut secara terus melalui atribut data-real (app-logic.js baris 205).",
    "Risiko: jika berlaku XSS atau skrin admin dilihat orang lain, kata laluan bocor terus. Pelayar yang dikongsi ramai murid juga bahaya.",
  ], "red");
  card("Cadangan pembaikan", [
    "Jangan simpan kata laluan mentah langsung. Jana kata laluan sementara, hantar kepada pemilik (WhatsApp/emel), dan simpan hanya hash jika perlu.",
    "Buang atribut data-real dan paparan kata laluan dalam panel admin.",
    "Untuk set semula kata laluan, gunakan aliran 'reset link' Firebase Auth dan bukannya menyimpan teks kata laluan.",
  ], "green");

  h2("K3 (KRITIKAL) - Tiada rate-limit / helmet pada pelayan");
  card("Kekurangan", [
    "Fail: server.js (baris ~378 hanya app.use(express.json()))",
    "Pustaka express-rate-limit SUDAH ada dalam package-lock.json tetapi TIDAK dipanggil dalam kod.",
    "Tiada helmet - maksudnya tiada CSP, X-Frame-Options, HSTS dan header keselamatan lain.",
    "Endpoint /api/admin/verify boleh di-cuba (brute force) tanpa had - membolehkan cubaan meneka kod admin.",
  ], "orange");
  card("Cadangan pembaikan", [
    "Pasang & gunakan helmet secara global: app.use(helmet());",
    "Tambah rate-limit pada endpoint sensitif, contoh untuk /api/admin/verify:",
    "  const limiter = rateLimit({ windowMs: 15*60*1000, max: 10 });",
    "  app.post('/api/admin/verify', limiter, ...)",
    "Rekod percubaan gagal bagi tujuan audit dan kunci sementara selepas beberapa kegagalan.",
  ], "green");
}

// ---------------------------------------------------------------------------
// BAHAGIAN 2b: ISU SERIUS & KEKUATAN
// ---------------------------------------------------------------------------
function bahagianSerius() {
  h2("S1 (SERIUS) - Custom claims affiliate menimpa claims lain");
  card("Kekurangan", [
    "Fail: server.js (sekitar create-account, ~baris 687)",
    "Kod memanggil setCustomUserClaims(uid, { affiliate_kod: kod }) - ini MENGGANTIKAN semua claims sedia ada.",
    "Jika kemudian admin ditanda (admin: true) atau claim lain ditambah, claim lama boleh hilang.",
  ], "orange");
  card("Cadangan", [
    "Ambil claims semasa dahulu (getUser), gabungkan, kemudian set semula:",
    "  const u = await getAuth(app).getUser(uid);",
    "  await getAuth(app).setCustomUserClaims(uid, { ...u.customClaims, affiliate_kod: kod });",
  ], "green");

  h2("S2 (SERIUS) - Kawalan akses Pro di pihak pelanggan");
  card("Kekurangan", [
    "Fail: public/app-logic.js (banyak tempat, cth. baris ~7256 dan ~19629)",
    "Akses Pro bergantung pada pemboleh ubah pelayar: localStorage 'bunyiKataAccessLevel', adminClaimDisahkan, isAdminMode.",
    "Sesiapa boleh buka DevTools -> localStorage.setItem('bunyiKataAccessLevel','pro') -> mendapat akses Pro percuma.",
  ], "orange");
  card("Cadangan", [
    "Setiap tindakan Pro mesti disahkan di pelayan melalui /api/subscription/check (endpoint sudah ada).",
    "Guna custom claim (cth. pro: true) dari token, bukan nilai localStorage.",
    "localStorage hanya untuk paparan UI, bukan keputusan akses.",
  ], "green");

  h2("S3 (SERIUS) - Nama kunci kata laluan tidak konsisten");
  card("Kekurangan", [
    "Dijumpai dua gaya penamaan: bunyiKataAdminPass vs bunyiKataAdminPassword, serta bunyiKataGuruPassword dan bunyiKataIbubapaPassword.",
    "Risiko: satu tempat tulis, tempat lain baca nama berbeza -> kata laluan 'hilang' atau tidak segerak.",
  ], "orange");

  h2("S4 (SERIUS) - Ralat ditelan senyap (catch kosong)");
  card("Kekurangan", [
    "Terdapat banyak blok 'catch (e) {}' atau 'catch {}' kosong di seluruh kod.",
    "Apabila berlaku masalah, tiada rekod - sukar tahu bila pengguna mengalami ralat.",
  ], "orange");
  card("Cadangan", [
    "Setiap catch perlu menulis console.error sekurang-kurangnya, dan jika sesuai hantar ke sistem log (cth. Sentry).",
  ], "green");

  h2("S5 (SERIUS) - Carian profil mengikut emel boleh disalah guna");
  card("Kekurangan", [
    "Fail: src/services/authService.ts - jika profil mengikut UID tiada, sistem mencari profil mengikut emel.",
    "Jika dua akaun berkongsi emel, ada risiko mengambil profil yang salah.",
  ], "orange");
  card("Cadangan", [
    "Pastikan emel unik, atau kaitkan profil dengan UID sahaja dan bukan emel.",
  ], "green");

  spacer(2);
  h2("Yang Sudah BAIK (kekalkan)");
  card("Kekuatan keselamatan sedia ada", [
    "Fail .env TIDAK di-track oleh git - bagus, tiada rahsia terdedah dalam repo.",
    "Kod admin disimpan hanya di pelayan (process.env.ADMIN_CODE) - bukan di pelayar.",
    "Harga pakej ditentukan di pelayan (PLAN_CATALOG) - pelanggan tidak boleh menipu harga.",
    "Kod affiliate diambil daripada token, bukan daripada body permintaan - selamat.",
    "Rules untuk profiles, affiliates, orders dan audit_log sudah betul (menggunakan auth.token.admin).",
    "Ada audit log untuk tindakan admin.",
  ], "green");
}




// ---------------------------------------------------------------------------
// BAHAGIAN 3: SISTEM AFFILIATE
// ---------------------------------------------------------------------------
function bahagianAffiliate() {
  h1("3. SISTEM AFFILIATE");
  text("Sistem affiliate dibina dengan kukuh. Kod rujukan, pengiraan komisen dan jejak audit semuanya ada. Berikut penilaian lengkap:", { size: 10 });

  h2("3.1 Kekuatan sedia ada");
  card("Sudah betul & selamat", [
    "Komisen 30% setiap pembelian berbayar (server.js: KOMISEN_PERSEN = 30).",
    "Pembayaran komisen dikendalikan secara MANUAL oleh admin — tiada tempoh tahan automatik.",
    "Kod affiliate diambil daripada token pengesahan, bukan daripada input pengguna.",
    "Ada endpoint berasingan untuk admin (list, create, status, delete, mark-paid, payments).",
    "Rules affiliates & referrals sudah mengunci bacaan kepada admin atau pemilik kod sahaja.",
  ], "green");

  h2("3.2 Penambahbaikan dicadangkan");
  table(
    ["#", "Kekurangan", "Cadangan penambahbaikan"],
    [
      ["A1", "Tiada dashboard affiliate kendiri secara masa nyata - status 'pending' ke 'paid' dikemas kini secara manual oleh admin.", "Tambah halaman affiliate kendiri; kemas kini status secara automatik bila pembayaran disahkan."],
      ["A2", "Tiada penjejakan klik - tidak dapat tahu berapa klik berbanding berapa pembelian (kadar penukaran).", "Rekod klik pautan rujukan (?ref=KOD) dan kira kadar penukaran affiliate."],
      ["A3", "Tiada perlindungan anti-penyalahgunaan - affiliate boleh merujuk diri sendiri.", "Halang rujukan diri sendiri (emel sama) dan kekalkan had komisen munasabah."],
      ["A4", "Tiada had pembayaran minimum - komisen kecil boleh dituntut.", "Tetapkan minimum pembayaran (cth. RM50) dan terma yang jelas."],
    ],
    [7, 45, 48],
  );
}

// ---------------------------------------------------------------------------
// BAHAGIAN 4: PEMBELAJARAN & CABARAN
// ---------------------------------------------------------------------------
function bahagianPembelajaran() {
  h1("4. PEMBELAJARAN & CABARAN");
  text("Kandungan pembelajaran sedia ada sudah banyak dan menarik. Bahagian ini menyenaraikan apa yang ada, kemudian cadangan untuk menambah baik.", { size: 10 });

  h2("4.1 Modul sedia ada (11 modul)");
  table(
    ["Modul", "Komponen", "Fokus"],
    [
      ["Fonik ABC", "FonikAbcGame", "Bunyi huruf asas"],
      ["Cuba Sebut", "CubaSebutGame", "Sebutan perkataan"],
      ["Phonics", "PhonicsActivities", "Latihan fonik"],
      ["Nombor", "NomborGame / NomborActivities", "Kenal & kira nombor"],
      ["Kad Imbasan Nombor", "KadImbasanNomborGame", "Imbasan pantas nombor"],
      ["Matematik", "MathActivities", "Operasi asas"],
      ["Cabaran Suku Kata", "CabaranSukuKataGame", "Bina suku kata"],
      ["Puzzle Suku Kata", "PuzzleSukuKataGame", "Susun suku kata"],
      ["Cantum Kata", "CantumKataGame", "Gabung perkataan"],
      ["Tanduk Kata", "TandukKataGame", "Ejaan perkataan"],
      ["Buku Cerita / Perpustakaan", "BukuCeritaModal / PerpustakaanGame", "Bacaan & kefahaman"],
    ],
    [30, 34, 36],
  );

  h2("4.2 Cadangan penambahbaikan kandungan");
  card("C1 - Kemajuan untuk pengguna percuma", [
    "Sekarang pengguna percuma tidak menyimpan kemajuan, jadi mereka tidak nampak nilai untuk naik taraf.",
    "Cadangan: simpan progres asas untuk percuma, dan tunjuk 'anda telah selesaikan X/Y' bagi galak pembelian Pro.",
  ], "yellow");
  card("C2 - Pratonton Pro (contoh 3 aktiviti)", [
    "Benarkan pengguna percuma mencuba 3 aktiviti Pro sebagai pratonton sebelum minta naik taraf.",
    "Ini meningkatkan kadar penukaran ke Pro secara ketara.",
  ], "yellow");
  card("C3 - Analitik untuk guru", [
    "Guru tidak dapat melihat murid mana lemah dalam modul mana.",
    "Cadangan: dashboard analitik yang tunjuk kemajuan setiap murid mengikut modul, serta eksport CSV/PDF laporan kelas.",
  ], "orange");
  card("C4 - Mod ibu bapa lebih kaya", [
    "Sekarang dashboard ibu bapa hanya memaparkan data.",
    "Cadangan: notifikasi mingguan, cadangan aktiviti rumah mengikut kelemahan anak, dan had masa skrin.",
  ], "yellow");
  card("C5 - Perpustakaan & cerita berjenjang", [
    "Tambah cerita mengikut aras kesukaran (mudah, sederhana, susah) supaya sesuai untuk pelbagai umur.",
    "Tambah kuiz kefahaman ringkas selepas setiap cerita.",
  ], "purple");
  card("C6 - Cabaran interaktif", [
    "Tambah cabaran harian (streak) dan papan pendahulu kelas untuk meningkatkan penglibatan.",
    "Tambah mod 'ujian' yang menggabungkan beberapa modul.",
  ], "purple");
}


// ---------------------------------------------------------------------------
// BAHAGIAN 5: IDEA PROMO CODE & HARGA
// ---------------------------------------------------------------------------
function bahagianPromo() {
  h1("5. IDEA: KOD AFFILIATE SEBAGAI PROMO CODE");
  text("Idea asal: jadikan kod affiliate boleh digunakan terus oleh pembeli sebagai 'promo code', di mana kod itu juga menentukan komisen affiliate - dan harga asas dinaikkan sedikit untuk menampung kos tersebut.", { size: 10 });
  text("Berikut analisis 3 variasi idea ini, lengkap dengan pro dan kontra. Semua harga menggunakan harga semasa: RM15 (1 bulan), RM40 (3 bulan), RM69 (1 tahun).", { size: 10 });
  spacer(2);

  card("Pilihan A - Pembeli dapat DISKAUN + affiliate dapat komisen", [
    "Cara kerja: pembeli taip kod affiliate -> dapat diskaun (cth. RM2). Affiliate masih dapat komisen tetap (cth. RM3).",
    "Contoh RM15: harga asas dinaikkan kepada RM17 -> pembeli bayar RM15 selepas diskaun RM2; anda bayar komisen RM3; baki bersih anda RM12.",
    "PRO: paling menarik untuk pembeli (ada insentif guna kod), jadi kadar penukaran tinggi.",
    "PRO: affiliate lebih bersemangat promosi kerana pembeli dapat manfaat.",
    "KONTRA: kos anda paling tinggi - diskaun + komisen sekali.",
    "KONTRA: jika harga tidak dinaikkan secukupnya, margin boleh terhakis.",
  ], "orange");

  card("Pilihan B - Kod affiliate hanya alat penjejakan (tiada diskaun pembeli)", [
    "Cara kerja: pembeli tiada diskaun; komisen standard 30% kekal; harga dinaikkan sedikit untuk naikkan margin anda.",
    "Contoh RM15 -> RM18: komisen 30% = RM5.40; baki bersih anda RM12.60.",
    "PRO: paling mudah & margin paling sihat; struktur komisen sedia ada tidak berubah.",
    "PRO: tiada kekeliruan harga - satu harga tetap untuk semua.",
    "KONTRA: pembeli tiada insentif guna kod, jadi depend sepenuhnya pada usaha affiliate.",
    "KONTRA: kadar penukaran lebih rendah berbanding ada diskaun.",
  ], "purple");

  card("Pilihan C - Diskaun pembeli DIAMBIL daripada komisen affiliate", [
    "Cara kerja: pembeli dapat diskaun menggunakan kod; kos diskaun itu ditolak daripada komisen affiliate (bukan tambahan).",
    "Contoh RM15: pembeli dapat diskaun RM2; komisen affiliate RM4.50 - RM2 = RM2.50; kos anda kekal sama.",
    "PRO: kos anda tetap dan terkawal, sementara pembeli tetap dapat insentif.",
    "PRO: tidak perlu naikkan harga asas.",
    "KONTRA: affiliate kurang puas hati kerana 'komisen mereka' dikongsi dengan diskaun pembeli.",
    "KONTRA: perlu komunikasi jelas supaya affiliate faham cara kiraan.",
  ], "yellow");

  spacer(2);
  h2("5.1 Cadangan harga baru (jika mahu naikkan margin)");
  table(
    ["Pakej", "Harga sekarang", "Cadangan harga", "Naik", "Komisen 30%"],
    [
      ["1 bulan", "RM15", "RM25", "+RM10", "RM7.50"],
      ["3 bulan", "RM40", "RM60", "+RM20", "RM18.00"],
      ["1 tahun", "RM69", "RM99", "+RM30", "RM29.70"],
    ],
    [22, 22, 22, 14, 20],
  );
  text("Nota: kenaikan harga perlu diuji. Cadangan mula dengan menaikkan pakej 1 tahun secara berperingkat, sambil kekalkan pakej 1 bulan sebagai pintu masuk murah.", { size: 9, style: "italic", color: C.muted });
  spacer(1.5);
  text("Untuk melindungi margin, anda boleh gunakan gabungan Pilihan B untuk pelanggan biasa, dan tawarkan Pilihan A hanya sebagai kempen masa terhad (bukan sepanjang masa).", { size: 9.5 });
}


// ---------------------------------------------------------------------------
// BAHAGIAN 6: LAIN-LAIN
// ---------------------------------------------------------------------------
function bahagianLain() {
  h1("6. LAIN-LAIN (KUALITI KOD & OPERASI)");
  table(
    ["#", "Isu", "Cadangan"],
    [
      ["L1", "Fail public/app-logic.js bersaiz ~1.47 MB dalam satu fail - sukar dibaca, dinyahpepijat dan diselenggara.", "Pecahkan kepada modul kecil mengikut fungsi; guna import."],
      ["L2", "Blok catch kosong di seluruh kod - ralat hilang tanpa jejak.", "Tambah log; hantar ralat penting ke sistem pemantauan."],
      ["L3", "Tiada ujian automatik yang jelas - perubahan boleh rosakkan fungsi sedia ada.", "Tambah ujian asas untuk aliran bayaran, affiliate & log masuk."],
      ["L4", "Tiada pemantauan ralat masa nyata (error monitoring).", "Pasang Sentry atau serupa untuk rakam ralat pengguna sebenar."],
      ["L5", "Backup pangkalan data tidak didokumenkan.", "Tetapkan backup automatik harian dan simpan salinan di luar pelayan."],
      ["L6", "SEO & metadata (title, description, Open Graph) boleh dipertingkat.", "Tambah meta tag lengkap untuk setiap halaman utama."],
      ["L7", "Aksesibiliti - warna teks kecil & kontras boleh ditambah baik.", "Uji dengan pembaca skrin; pastikan kontras sekurang-kurangnya WCAG AA."],
      ["L8", "Kata laluan & kunci API tidak didokumenkan di satu tempat.", "Ada senarai kredensial yang jelas (jangan simpan dalam repo)."],
    ],
    [7, 47, 46],
  );
}

// ---------------------------------------------------------------------------
// BAHAGIAN 7: ROADMAP
// ---------------------------------------------------------------------------
function bahagianRoadmap() {
  h1("7. ROADMAP PEMBAIKAN (MENGIKUT KEUTAMAAN)");
  table(
    ["Fasa", "Tindakan", "Masa", "Impak"],
    [
      ["Fasa 1 (SEGERA)", "Kunci rules: students, classes, families, scores, badges, feedbacks, code_index", "2-3 jam", "Sangat tinggi"],
      ["Fasa 1 (SEGERA)", "Buang simpanan & paparan kata laluan mentah", "1-2 jam", "Sangat tinggi"],
      ["Fasa 1 (SEGERA)", "Tambah rate-limit + helmet pada /api/admin/verify", "1-2 jam", "Tinggi"],
      ["Fasa 2 (PENTING)", "Betulkan claims affiliate (gabung, jangan timpa)", "1 jam", "Tinggi"],
      ["Fasa 2 (PENTING)", "Sahkan akses Pro di pelayan sahaja", "3-4 jam", "Tinggi"],
      ["Fasa 2 (PENTING)", "Satukan nama kunci; tambah log pada catch kosong", "2 jam", "Sederhana"],
      ["Fasa 3 (SEGERA)", "Kemas kini rules LIVE di Firebase Console (rujuk Bahagian 8)", "1-2 jam", "Tinggi"],
      ["Fasa 3 (PENTING)", "Dashboard affiliate + penjejakan klik + anti rujukan diri", "1-2 hari", "Sederhana"],
      ["Fasa 4 (PENAMBAHBAIKAN)", "Analitik guru + eksport laporan + progres percuma", "2-4 hari", "Sederhana"],
      ["Fasa 4 (PENAMBAHBAIKAN)", "Kempen promo code + semakan harga", "1-2 hari", "Sederhana"],
    ],
    [24, 44, 16, 16],
  );
}


// ---------------------------------------------------------------------------
// BAHAGIAN 8: CARA SEMAK RULES LIVE
// ---------------------------------------------------------------------------
function bahagianSemakRules() {
  h1("8. CARA SEMAK RULES LIVE (FIREBASE)");
  text("Penting: fail database.rules.json dalam folder projek hanyalah salinan. Sumber sebenar (yang digunakan oleh aplikasi) ialah tetapan dalam Firebase Console. Kedua-duanya perlu sepadan.", { size: 10 });
  spacer(2);
  h2("8.1 Cara biasa (melalui Console)");
  bullet("Buka console.firebase.google.com dan pilih projek Bunyi Kata.");
  bullet("Pergi ke Realtime Database -> tab 'Rules'.");
  bullet("Bandingkan tetapan di situ dengan fail database.rules.json dalam folder projek.");
  bullet("Jika berbeza, salin versi terkini Console ke dalam folder (atau sebaliknya) supaya kedua-duanya sepadan.");
  spacer(2);
  h2("8.2 Cara alternatif (melalui CLI)");
  bullet("Pastikan Firebase CLI dipasang: npm install -g firebase-tools");
  bullet("Log masuk: firebase login");
  bullet("Semak rules yang sedang aktif: firebase database:rules:get");
  bullet("Untuk deploy rules dari folder projek: firebase deploy --only database");
  spacer(2);
  card("Peringatan penting", [
    "Sentiasa uji rules baru dalam 'Rules Playground' (Console) sebelum deploy ke produksi.",
    "Rules yang salah boleh mematikan akses guru & ibu bapa sepenuhnya - uji dengan dua jenis akaun.",
    "Simpan salinan rules yang berfungsi sebagai sandaran sebelum mengubah.",
  ], "orange");
}

// ---------------------------------------------------------------------------
// BAHAGIAN 9: JADUAL RINGKASAN SEMUA PENEMUAN
// ---------------------------------------------------------------------------
function bahagianRingkasanJadual() {
  h1("9. JADUAL RINGKASAN SEMUA PENEMUAN");
  table(
    ["ID", "Tahap", "Isu", "Fail terlibat"],
    [
      ["K1", "Kritikal", "Data murid/kelas/keluarga boleh dibaca sesiapa", "database.rules.json"],
      ["K2", "Kritikal", "Kata laluan mentah disimpan & dipaparkan", "EditProfileModal.tsx, app-logic.js"],
      ["K3", "Kritikal", "Tiada rate-limit & helmet pada pelayan", "server.js"],
      ["S1", "Serius", "Claims affiliate menimpa claims lain", "server.js"],
      ["S2", "Serius", "Akses Pro hanya dikawal di pelayar", "app-logic.js"],
      ["S3", "Serius", "Nama kunci kata laluan tidak konsisten", "app-logic.js, komponen"],
      ["S4", "Serius", "Blok catch kosong menelan ralat", "Banyak fail"],
      ["S5", "Serius", "Carian profil ikut emel boleh salah orang", "authService.ts"],
      ["M1", "Sederhana", "Fail app-logic.js terlalu besar (1.47 MB)", "app-logic.js"],
      ["M2", "Sederhana", "Tiada penjejakan klik affiliate", "server.js, affiliate"],
      ["M3", "Sederhana", "Tiada anti rujukan diri", "server.js"],
      ["M4", "Sederhana", "Tiada had pembayaran minimum", "server.js"],
      ["M5", "Sederhana", "Tiada ujian automatik", "Projek keseluruhan"],
      ["M6", "Sederhana", "Tiada pemantauan ralat", "Projek keseluruhan"],
      ["B1", "Baik", "Harga ditentukan di pelayan", "server.js"],
      ["B2", "Baik", "Kod admin di pelayan sahaja", "server.js"],
      ["B3", "Baik", "Rules profiles/affiliates/orders sudah betul", "database.rules.json"],
      ["B4", "Baik", "Kod affiliate dari token", "server.js"],
      ["B5", "Baik", "Ada audit log admin", "server.js"],
      ["B6", "Baik", ".env tidak di-track git", ".gitignore"],
    ],
    [8, 16, 46, 30],
  );
}

// ---------------------------------------------------------------------------
// BAHAGIAN 10: PENUTUP
// ---------------------------------------------------------------------------
function bahagianPenutup() {
  h1("10. PENUTUP & LANGKAH SETERUSNYA");
  text("Bunyi Kata adalah projek yang kukuh dari segi fungsi dan kandungan pembelajaran. Sistem affiliate, modul permainan, dashboard dan logik bayaran semuanya berjalan. Yang perlu diberi perhatian utama ialah keselamatan data.", { size: 10 });
  text("Tumpuan segera: kunci rules pangkalan data, buang kata laluan mentah, dan tambah perlindungan pada endpoint admin. Ini akan menutup risiko terbesar dalam masa beberapa jam kerja.", { size: 10 });
  spacer(2);
  h2("Langkah seterusnya yang dicadangkan");
  bullet("Sediakan salinan sandaran rules semasa sebelum mengubah apa-apa.");
  bullet("Laksanakan Fasa 1 (rujuk Bahagian 7) terlebih dahulu.");
  bullet("Uji dengan akaun guru, ibu bapa dan pelajar selepas kunci rules.");
  bullet("Selepas Fasa 1 & 2 selesai, teruskan dengan penambahbaikan affiliate & kandungan.");
  spacer(3);
  doc.setFillColor(C.greenBg[0], C.greenBg[1], C.greenBg[2]);
  doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, "F");
  setFont(9.5, "bold", C.green);
  doc.text("Dokumen ini adalah laporan sahaja - tiada perubahan kod telah dibuat.", MARGIN + 5, y + 6);
  setFont(8.5, "normal", C.ink);
  doc.text("Semua pembaikan akan dilaksanakan hanya selepas kelulusan anda.", MARGIN + 5, y + 11);
  y += 20;
}


// ---------------------------------------------------------------------------
// PEMACU UTAMA
// ---------------------------------------------------------------------------
function main() {
  y = MARGIN;
  mukaDepan();

  doc.addPage();
  y = MARGIN;
  ringkasanEksekutif();
  bahagianKeselamatan();
  bahagianSerius();

  doc.addPage();
  y = MARGIN;
  bahagianAffiliate();

  doc.addPage();
  y = MARGIN;
  bahagianPembelajaran();

  doc.addPage();
  y = MARGIN;
  bahagianPromo();

  doc.addPage();
  y = MARGIN;
  bahagianLain();

  doc.addPage();
  y = MARGIN;
  bahagianRoadmap();

  doc.addPage();
  y = MARGIN;
  bahagianSemakRules();

  doc.addPage();
  y = MARGIN;
  bahagianRingkasanJadual();
  bahagianPenutup();

  footerHeader();

  const outPath = path.join(ROOT, "Audit-BunyiKata-PenilaianMenyeluruh.pdf");
  const buf = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(outPath, buf);
  const kb = (buf.length / 1024).toFixed(0);
  console.log("PDF berjaya dijana:");
  console.log("  " + outPath);
  console.log("  Saiz: " + kb + " KB, Halaman: " + doc.getNumberOfPages());
}

main();
