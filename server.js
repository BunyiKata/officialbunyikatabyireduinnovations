import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import crypto from "crypto";
// firebase-admin v14 hanya menyediakan API modular. Import lalai `admin`
// tidak lagi mendedahkan .apps/.auth/.credential, jadi kita import terus.
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

dotenv.config();

/**
 * Firebase Admin SDK — dimulakan secara "lazy" supaya pelayan masih boleh
 * berjalan walaupun kredensial admin belum ditetapkan (cth. semasa pembangunan
 * bahagian hadapan sahaja). Fungsi admin sahaja yang akan gagal, bukan
 * keseluruhan pelayan.
 */
let adminApp = null;
let adminInitError = null;

function getAdminApp() {
  if (adminApp) return adminApp;
  if (adminInitError) return null;

  try {
    // firebase-admin v14 MEMBUANG `admin.apps` (ia hanya ada dalam v11 dan ke
    // bawah). Menyentuh `.length` padanya melemparkan TypeError, ditangkap oleh
    // blok catch di bawah, yang menetapkan adminInitError SECARA KEKAL — jadi
    // /api/admin/verify sentiasa memulangkan 500. Guna getApps() moden.
    const existing = getApps();
    if (existing.length > 0) {
      adminApp = existing[0];
      return adminApp;
    }

    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    const databaseURL = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;

    if (rawServiceAccount) {
      // Menyokong JSON mentah ATAU JSON yang dikodkan base64.
      let parsed;
      const trimmed = rawServiceAccount.trim();

      // Kesan nilai placeholder daripada .env.example — beri mesej jelas
      // daripada SyntaxError JSON yang mengelirukan.
      if (
        trimmed.includes("ISI_BASE64") ||
        trimmed.includes("GANTIKAN_DENGAN") ||
        trimmed.startsWith("ISI_")
      ) {
        console.error(
          "[Firebase Admin] FIREBASE_SERVICE_ACCOUNT masih placeholder. " +
            "Isi dengan service account sebenar (base64 atau JSON mentah).",
        );
        adminInitError = new Error("FIREBASE_SERVICE_ACCOUNT belum diisi.");
        return null;
      }

      if (trimmed.startsWith("{")) {
        parsed = JSON.parse(trimmed);
      } else {
        parsed = JSON.parse(Buffer.from(trimmed, "base64").toString("utf8"));
      }
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      adminApp = initializeApp({
        credential: cert(parsed),
        databaseURL,
      });
    } else {
      // Bergantung pada Application Default Credentials (App Hosting / Cloud Run).
      adminApp = initializeApp({
        credential: applicationDefault(),
        projectId,
        databaseURL,
      });
    }

    return adminApp;
  } catch (err) {
    adminInitError = err;
    // Log jejak penuh: mesej sahaja menyembunyikan punca sebenar
    // (cth. TypeError daripada API SDK yang berubah).
    console.error("[Firebase Admin] Gagal dimulakan:", err);
    return null;
  }
}

/**
 * Perbandingan rentetan masa-tetap untuk mengelakkan timing attack
 * semasa menyemak kod admin.
 */
function selamatSamaDengan(a, b) {
  const bufA = Buffer.from(String(a || ""), "utf8");
  const bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Menjana kata laluan sementara yang munasabah untuk dihantar melalui WhatsApp.
 * Format: BunyiKata#<4 digit> — mudah dibaca melalui telefon, masih ada
 * ~9000 kemungkinan jadi tidak boleh diteka secara pukal.
 */
function janaKataLaluan() {
  return `BunyiKata#${crypto.randomInt(1000, 9999)}`;
}

/**
 * Mengira tarikh tamat langganan.
 * @param {number} days   bilangan hari pakej
 * @param {string} [dariISO] tarikh mula (ISO). Jika tiada, guna sekarang.
 */
function kiraTarikhTamat(days, dariISO) {
  const asas = dariISO ? new Date(dariISO) : new Date();
  // Jika tarikh asas tidak sah, jatuh balik ke sekarang supaya tidak menghasilkan
  // "Invalid Date" yang akan merosakkan rekod profil.
  const masaAsas = Number.isNaN(asas.getTime()) ? new Date() : asas;
  masaAsas.setDate(masaAsas.getDate() + days);
  return masaAsas.toISOString();
}

/**
 * Middleware pengesahan admin.
 *
 * Menerima ID token Firebase (bukan custom token) melalui header
 * `Authorization: Bearer <idToken>`. Token ini diperoleh oleh klien selepas
 * `signInWithCustomToken()` berjaya dalam /api/admin/verify.
 *
 * Kita HANYA mempercayai token yang ditandatangani Firebase dan mengandungi
 * claim { admin: true }. Tiada nilai yang datang dari body permintaan
 * dipercayai untuk tujuan kebenaran.
 */
async function requireAdmin(req, res, next) {
  const header = String(req.headers.authorization || "");
  const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!idToken) {
    return res.status(401).json({ success: false, message: "Sesi admin diperlukan." });
  }

  const appInstance = getAdminApp();
  if (!appInstance) {
    return res.status(500).json({
      success: false,
      message: "Firebase Admin SDK belum dikonfigurasikan di pelayan.",
    });
  }

  try {
    const decoded = await getAuth(appInstance).verifyIdToken(idToken);
    if (decoded.admin !== true) {
      // Mesej generik: jangan dedahkan sebab sebenar penolakan.
      return res.status(403).json({ success: false, message: "Akses ditolak." });
    }
    req.adminUid = decoded.uid;
    return next();
  } catch (err) {
    console.warn("[Admin Auth] Token tidak sah:", err?.message || err);
    return res.status(401).json({ success: false, message: "Token tidak sah atau tamat tempoh." });
  }
}

/**
 * Fasa 3 (Affiliate Login): kebenaran untuk endpoint sisi-affiliate.
 *
 * Sama seperti requireAdmin, tetapi menerima token yang mengandungi claim
 * { affiliate_kod: "XXXXXX" } yang ditetapkan oleh pelayan semasa akaun
 * affiliate dicipta. Kod affiliate diambil DARIPADA token (bukan body) supaya
 * affiliate tidak boleh menipu dan membaca komisen affiliate lain.
 */
async function requireAffiliate(req, res, next) {
  const header = String(req.headers.authorization || "");
  const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!idToken) {
    return res.status(401).json({ success: false, message: "Sesi affiliate diperlukan." });
  }

  const appInstance = getAdminApp();
  if (!appInstance) {
    return res.status(500).json({
      success: false,
      message: "Firebase Admin SDK belum dikonfigurasikan di pelayan.",
    });
  }

  try {
    const decoded = await getAuth(appInstance).verifyIdToken(idToken);
    const db = getDatabase(appInstance);
    let kod = String(decoded.affiliate_kod || "").trim().toUpperCase();

    // Fallback 1: admin boleh menyamar sebagai affiliate melalui ?kod / header.
    if (!kod && decoded.admin === true) {
      const reqKod = String(req.query?.kod || req.headers["x-affiliate-kod"] || "").trim().toUpperCase();
      if (reqKod) {
        kod = reqKod;
      } else {
        const affSnap = await db.ref("affiliates").limitToFirst(1).get();
        if (affSnap.exists()) {
          affSnap.forEach((c) => {
            kod = c.key;
            return true;
          });
        }
      }
    }

    // Fallback 2 (PEMBETULAN "tidak aktif" salah): akaun affiliate yang
    // dicipta SEBELUM claim `affiliate_kod` ditetapkan (atau claim yang
    // hilang/kosong) tidak akan ditemui melalui token. Cari rekod affiliate
    // melalui EMAIL token supaya sesi lama tidak disalahertikan sebagai
    // "Akses ditolak" sedangkan admin melihat status "Aktif" di jadual.
    if (!kod && decoded.email) {
      try {
        const qEmel = db.ref("affiliates").orderByChild("email").equalTo(String(decoded.email));
        const emelSnap = await qEmel.get();
        if (emelSnap.exists()) {
          emelSnap.forEach((c) => {
            if (!kod) {
              kod = c.key;
            }
            return true;
          });
        }
      } catch (e) {
        console.warn("[Affiliate Auth] Carian email gagal:", e?.message || e);
      }
    }

    if (!kod) {
      return res.status(403).json({
        success: false,
        message:
          "Sesi affiliate tidak sah (claim affiliate_kod tiada). Sila log keluar dan log masuk semula.",
      });
    }

    // PEMBETULAN: tegakkan status SEBENAR di pelayan. Sebelum ini token sahaja
    // dipercayai, jadi affiliate yang digantung masih boleh mengakses API.
    // Sebaliknya, jika admin baru aktifkan semula, status dalam DB mesti
    // mengatasi apa-apa paparan basi di klien.
    const snapStatus = await db.ref(`affiliates/${kod}`).get();
    if (!snapStatus.exists()) {
      return res.status(404).json({ success: false, message: "Rekod affiliate tidak dijumpai." });
    }
    // Rekod lama yang tiada medan status dianggap aktif (selaras dengan
    // logik paparan: profil.status || "aktif"). Normalize kes + ruang supaya
    // "Aktif" / " aktif " tidak disalahtafsir sebagai digantung.
    const statusAff = String((snapStatus.val() || {}).status || "aktif").trim().toLowerCase();
    if (statusAff !== "aktif") {
      return res.status(403).json({ success: false, message: "Akaun affiliate digantung." });
    }

    req.affiliateUid = decoded.uid;
    req.affiliateKod = kod;
    return next();
  } catch (err) {
    console.warn("[Affiliate Auth] Token tidak sah:", err?.message || err);
    return res.status(401).json({ success: false, message: "Token tidak sah atau tamat tempoh." });
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Harga rasmi setiap pakej dalam sen. Harga MESTI ditentukan di pelayan;
// jangan sesekali percaya harga yang dihantar dari pelayar.
const PLAN_CATALOG = {
  "1bulan": { name: "1 Bulan (Pro)", priceCents: 1500, days: 30 },
  "3bulan": { name: "3 Bulan (Pro)", priceCents: 4000, days: 90 },
  "1tahun": { name: "1 Tahun (Pro)", priceCents: 6900, days: 365 },
};

/** Susunan paparan pakej (bulan -> tahun), dihantar oleh /api/plans. */
const SUSUNAN_PLAN = ["1bulan", "3bulan", "1tahun"];

/**
 * Bina senarai pakej untuk klien daripada PLAN_CATALOG.
 *
 * Ini SATU-SATUNYA sumber harga. Klien (React & app-logic.js) TIDAK boleh
 * menyimpan harga sendiri-sendiri lagi - mereka mesti ambil dari endpoint ini.
 * Jika tidak, harga di modal cipta akaun, modal lanjut tempoh dan pelayan boleh
 * bercanggah (cth. admin nampak RM15 sedangkan pelayan merekod RM20).
 */
function senaraiPakej() {
  return SUSUNAN_PLAN.filter((k) => PLAN_CATALOG[k]).map((k) => ({
    key: k,
    name: PLAN_CATALOG[k].name,
    days: PLAN_CATALOG[k].days,
    priceCents: PLAN_CATALOG[k].priceCents,
    harga: "RM" + PLAN_CATALOG[k].priceCents / 100,
  }));
}

/** Tempoh tangguh hari selepas tarikh_tamat sebelum akses Pro diturunkan. */
const GRACE_HARI = 3;

// ---------------------------------------------------------------------------
// Fasa 2: sistem affiliate (kod rujukan).
// ---------------------------------------------------------------------------

/** Peratus komisen untuk setiap pembelian berbayar yang dirujuk. */
const KOMISEN_PERSEN = 30;

/** Huruf yang digunakan untuk menjana kod affiliate (huruf + nombor). */
const AKSARA_KOD = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // buang I,O,0,1 (mudah keliru)

/**
 * Jana kod affiliate 6 aksara yang belum digunakan.
 *
 * Kod mesti unik kerana ia menjadi kunci nod `affiliates/{kod}` dan muncul
 * dalam link kongsi. Kami cuba sehingga 12 kali; jika masih bertembung
 * (sangat tidak mungkin dengan 32^6 ~ 1 bilion kombinasi), pulangkan null.
 */
async function janaKodAffiliate(db) {
  for (let cuba = 0; cuba < 12; cuba++) {
    let kod = "";
    for (let i = 0; i < 6; i++) {
      kod += AKSARA_KOD.charAt(Math.floor(Math.random() * AKSARA_KOD.length));
    }
    const snap = await db.ref(`affiliates/${kod}`).get();
    if (!snap.exists()) return kod;
  }
  return null;
}

/** Normalisasi nombor WhatsApp: buang bukan-digit, tukar awalan 0 -> 60. */
function bersihkanWhatsapp(input) {
  let nombor = String(input || "").replace(/[^0-9]/g, "");
  if (nombor.startsWith("0")) nombor = "6" + nombor; // 012xxx -> 6012xxx
  return nombor;
}

/** Kira komisen (dalam sen) daripada harga pakej dalam sen. */
function kiraKomisenSen(hargaSen) {
  return Math.round((Number(hargaSen) || 0) * KOMISEN_PERSEN / 100);
}

/**
 * Selaraskan status baris rujukan dengan rekod pembayaran sebenar.
 *
 * MASALAH YANG DIBETULKAN:
 *   Sistem menyimpan DUA sumber berasingan:
 *     1) `referrals/{kod}/{id}.status`  -> "pending" / "dibayar" / "batal"
 *     2) `affiliate_payments/{id}`      -> rekod transaksi bayaran oleh admin
 *   Rekod pembayaran boleh wujud (admin sudah bayar) manakala baris rujukan
 *   masih "pending" (cth. rekod lama dicipta sebelum `tanda_komisen`, atau
 *   admin tidak tandakan baris). Ini menyebabkan Jadual Rujukan & Komisen
 *   menunjukkan "Belum Dibayar" walaupun Jadual Laporan Pembayaran sudah
 *   menunjukkan bayaran, dan kad "Telah Dibayar" kekal RM0.00.
 *
 * PENYELESAIAN (Pilihan 1 — betulkan & simpan):
 *   Baca semua rekod `affiliate_payments` bagi kod ini, jumlahkan `jumlah_sen`
 *   sebagai "wang sebenar yang telah dibayar". Kemudian tanda baris komisen
 *   (batal dikecualikan, tertua dahulu) sebagai "dibayar" sehingga jumlah
 *   pembayaran dipenuhi. Tanda ditulis KE DALAM Firebase supaya semua
 *   paparan (admin + affiliate) kekal konsisten selepas ini.
 *
 * @param {object} db        Instance Realtime Database.
 * @param {string} kod       Kod affiliate (huruf besar).
 * @param {object} [pilihan] { rekodBayar } untuk elak baca semula.
 * @returns {Promise<{ ditanda: number, jumlahPembayaranSen: number }>}
 */
async function selarasStatusKomisen(db, kod, pilihan = {}) {
  const kodBersih = String(kod || "").trim().toUpperCase();
  if (!kodBersih) return { ditanda: 0, jumlahPembayaranSen: 0 };

  // 1) Jumlah wang sebenar yang telah dibayar (semua rekod untuk kod ini).
  let rekodBayar = pilihan.rekodBayar;
  if (!rekodBayar) {
    try {
      const snapBayar = await db.ref("affiliate_payments").get();
      rekodBayar = [];
      if (snapBayar.exists()) {
        snapBayar.forEach((r) => {
          const p = r.val() || {};
          if (String(p.kod || "").trim().toUpperCase() === kodBersih) rekodBayar.push(p);
          return false;
        });
      }
    } catch (err) {
      console.warn("[Selaras Komisen] Gagal baca affiliate_payments:", err?.message || err);
      rekodBayar = [];
    }
  }
  const jumlahPembayaranSen = rekodBayar.reduce(
    (s, p) => s + (Number(p.jumlah_sen) || 0),
    0,
  );
  if (jumlahPembayaranSen <= 0) return { ditanda: 0, jumlahPembayaranSen: 0 };

  // 2) Kira baris komisen belum dibayar (tertua dahulu).
  const snapRef = await db.ref(`referrals/${kodBersih}`).get();
  if (!snapRef.exists()) return { ditanda: 0, jumlahPembayaranSen };

  const calon = [];
  let jumlahSudahDibayar = 0;
  snapRef.forEach((rekod) => {
    const r = rekod.val() || {};
    if (r.status === "batal") return false; // batal tidak dikira langsung.
    const komisen = Number(r.komisen_sen) || 0;
    if (r.status === "dibayar") {
      jumlahSudahDibayar += komisen;
    } else {
      calon.push({ id: rekod.key, komisen_sen: komisen, tarikh_beli: r.tarikh_beli || "" });
    }
    return false;
  });
  calon.sort((a, b) => String(a.tarikh_beli || "").localeCompare(String(b.tarikh_beli || "")));

  // 3) Tanda baris sehingga jumlah pembayaran dipenuhi. Baki yang belum
  //    diliputi pembayaran kekal "pending" (belum dibayar).
  const tarikh = new Date().toISOString();
  const kemasKini = {};
  let jumlahDitanda = jumlahSudahDibayar;
  let ditanda = 0;
  for (const c of calon) {
    if (jumlahDitanda + c.komisen_sen > jumlahPembayaranSen) break;
    kemasKini[`referrals/${kodBersih}/${c.id}/status`] = "dibayar";
    kemasKini[`referrals/${kodBersih}/${c.id}/tarikh_bayar`] = tarikh;
    jumlahDitanda += c.komisen_sen;
    ditanda += 1;
  }
  if (ditanda > 0) {
    try {
      await db.ref().update(kemasKini);
    } catch (err) {
      console.warn("[Selaras Komisen] Gagal tulis status:", err?.message || err);
      return { ditanda: 0, jumlahPembayaranSen };
    }
  }
  return { ditanda, jumlahPembayaranSen };
}

/**
 * Tentukan sama ada langganan profil sudah luput secara kekal.
 *
 * Peraturan (pelayan ialah sumber kebenaran):
 *   - Tiada tarikh_tamat -> TIDAK pernah luput.
 *   - tarikh_tamat + GRACE_HARI belum berlalu -> masih aktif (grace).
 *   - Melebihi grace -> luput: akses Pro patut diturunkan.
 *
 * PENTING: kita TIDAK memadam tarikh_tamat - ia kekal sebagai rekod
 * sejarah supaya baki & jejak masih ada bila pengguna bayar semula.
 */
function langgananLuput(profil, sekarangMs) {
  const tarikh = profil && profil.tarikh_tamat;
  if (!tarikh) return false;
  const masaTamat = new Date(tarikh).getTime();
  if (!Number.isFinite(masaTamat)) return false;
  return sekarangMs > masaTamat + GRACE_HARI * 24 * 60 * 60 * 1000;
}

/**
 * Turunkan profil yang sudah luput ke Percuma (jika belum).
 * Memulangkan { berubah, profil } supaya pemanggil tahu keadaan terkini.
 */
async function turunkanJikaLuput(db, kunci, profil) {
  const sekarang = Date.now();
  if (!langgananLuput(profil, sekarang)) return { berubah: false, profil };
  const namaSedia = String((profil && profil.langganan) || "").toLowerCase();
  if (namaSedia.indexOf("percuma") !== -1) return { berubah: false, profil };
  const kemaskini = {
    langganan: "Percuma",
    pakej: "percuma",
    dikemaskini_pada: new Date().toISOString(),
  };
  await db.ref("profiles/" + kunci).update(kemaskini);
  console.log("[Langganan Luput] " + kunci + " diturunkan ke Percuma.");
  return { berubah: true, profil: Object.assign({}, profil, kemaskini) };
}




function resolvePlanKey(planInfo) {
  const raw = `${planInfo?.id || ""} ${planInfo?.name || ""} ${planInfo?.period || ""}`.toLowerCase();
  if (raw.includes("tahun") || raw.includes("year")) return "1tahun";
  if (raw.includes("3 bulan") || raw.includes("3bulan")) return "3bulan";
  return "1bulan";
}

/**
 * Normalkan nama pelan sedia ada pengguna (untuk mod "tambah N hari").
 *
 * Apabila admin hanya menambah bilangan hari (bukan menukar pakej), jenis
 * langganan pengguna TIDAK berubah. Fungsi ini hanya memastikan nama yang
 * disimpan konsisten (cth. "1 Bulan (Pro)", "Percuma").
 */
function namaPelanSediaAda(rawPlan) {
  const str = String(rawPlan || "").trim().toLowerCase();
  if (str.includes("percuma") || str.includes("trial") || str === "free") return "Percuma";
  if (str.includes("tahun") || str.includes("tahunan")) return "1 Tahun (Pro)";
  if (str.includes("3 bulan") || str.includes("3bulan")) return "3 Bulan (Pro)";
  if (str.includes("bulan") || str.includes("bulanan") || str.includes("pro")) return "1 Bulan (Pro)";
  return rawPlan || "1 Bulan (Pro)";
}

/**
 * Fasa 1.6: rekod jejak audit tindakan admin.
 *
 * Setiap tindakan penting admin (cipta akaun, reset kata laluan, lanjut
 * tempoh) direkodkan supaya ada jejak siapa-buat-apa-bila. Tanpa ini, jika
 * ada masalah langganan, tiada cara untuk menyiasat.
 *
 * Penulisan log SENGAJA tidak menghalang tindakan utama: jika log gagal,
 * tindakan tetap berjaya (fail-safe, log sahaja yang hilang).
 */
async function rekodAudit(db, tindakan, butiran) {
  try {
    await db.ref("audit_log").push({
      tindakan,
      butiran: butiran || {},
      oleh: "admin",
      tarikh: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[Audit] Gagal merekod tindakan:", tindakan, err?.message || err);
  }
}


/**
 * [KESELAMATAN S2] Had cubaan untuk pintu masuk admin.
 *
 * Tanpa had ini, sesiapa boleh mencuba kod admin beribu kali sesaat
 * (brute-force) sehingga berjaya. Dengan 20 cubaan / 15 minit:
 *  - Penyerang hanya boleh cuba ~80 kod sejam (dahulu boleh jutaan).
 *  - Admin sebenar (biasanya 1-2 cubaan) tiada masalah.
 *
 * Tetapan boleh ubah melalui .env:
 *  - ADMIN_RATE_MAX   (lalai 20)  — bilangan cubaan dibenarkan
 *  - ADMIN_RATE_WINDOW_MS (lalai 900000 = 15 minit)
 */
const adminVerifyLimiter = rateLimit({
  windowMs: Number(process.env.ADMIN_RATE_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.ADMIN_RATE_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  // Jangan kira cubaan yang BERJAYA (200) — hanya cubaan gagal yang dihad.
  skipSuccessfulRequests: true,
  // Mesej mesra dalam Bahasa Melayu supaya boleh dipaparkan terus di UI.
  message: {
    success: false,
    message: "Terlalu banyak cubaan. Sila cuba lagi dalam 15 minit.",
  },
});

async function startServer() {
  const app = express();
  // App Hosting / Cloud Run menyuntik PORT melalui persekitaran. Mesti dipatuhi,
  // jika tidak health check akan gagal dan rollout ditolak.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "1mb" }));

  /**
   * [KESELAMATAN S3 + S6] Perisai asas (helmet) + had saiz badan permintaan.
   *
   * S3: helmet memasang beberapa header keselamatan penting sekaligus:
   *   - X-Frame-Options: SAMEORIGIN   → halang clickjacking (panel admin tak
   *     boleh "dibingkaikan" dalam laman lain).
   *   - X-Content-Type-Options: nosniff → halang penyamaran jenis fail.
   *   - Strict-Transport-Security      → paksa HTTPS.
   *   - Referrer-Policy                → jangan bocorkan URL dalam.
   *
   *   CSP (Content-Security-Policy) SENGAJA dinyahaktifkan (false) buat masa ini
   *   kerana index.html menggunakan banyak skrip CDN luar (aframe, mediapipe,
   *   jspdf, chart.js) + skrip inline. CSP yang ketat akan memecahkan ciri-ciri
   *   tersebut. Ia boleh diketatkan kemudian selepas setiap CDN dibenarkan
   *   secara eksplisit dan inline-script dinyahaktifkan.
   *
   * S6: express.json({ limit: "1mb" }) menghalang permintaan bersaiz besar
   *   (cth. 500MB) yang boleh menghabiskan memori dan meruntuhkan pelayan.
   */
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Sediakan header CSP ringkas LEWAT (selepas helmet) untuk asal sendiri sahaja
  // jika perlu pada masa hadapan. Kekalkan longgar supaya CDN terus berfungsi.
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  /**
   * Senarai pakej awam (harga + tempoh).
   *
   * Klien menggunakan ini supaya harga dipaparkan dalam modal cipta akaun dan
   * modal lanjut tempoh sentiasa sepadan dengan apa yang pelayan akan rekod.
   * Tiada data sensitif di sini - hanya katalog pakej.
   */
  app.get("/api/plans", (req, res) => {
    try {
      return res.json({ success: true, plans: senaraiPakej() });
    } catch (err) {
      console.error("[API Plans]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan senarai pakej." });
    }
  });

  /**
   * Pengesahan kod admin.
   *
   * Kod admin disimpan HANYA dalam process.env.ADMIN_CODE di pelayan, jadi ia
   * tidak pernah masuk ke dalam bundle JavaScript pelayar. Jika kod betul,
   * pelayan memulangkan Firebase custom token dengan claim { admin: true }.
   * Klien kemudian signInWithCustomToken() supaya auth != null dan peraturan
   * pangkalan data boleh mempercayai token tersebut.
   */
  /**
   * Semak & turunkan langganan pengguna yang sudah luput (auto-expiry).
   *
   * Dipanggil oleh klien apabila aplikasi dimuatkan / dibuka semula. Ia
   * menggunakan tarikh PELAYAN (Date.now di sini) - bukan tarikh peranti -
   * supaya pengguna tidak boleh mengelak luput dengan menukar jam peranti.
   *
   * Fail-safe: jika pelayan tidak dapat dihubungi, klien TIDAK menurunkan
   * apa-apa (lihat klien). Endpoint ini memulangkan keadaan terkini supaya
   * klien boleh memutuskan tanpa logik tarikh sendiri.
   */
  app.post("/api/subscription/check", async (req, res) => {
    try {
      const header = (req.headers.authorization || "").toString();
      const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
      if (!idToken) {
        return res.status(401).json({ success: false, message: "Sesi diperlukan." });
      }
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Pelayan belum sedia; kekalkan keadaan semasa." });
      }
      let decoded;
      try {
        decoded = await getAuth(appInstance).verifyIdToken(idToken);
      } catch (err) {
        return res.status(401).json({ success: false, message: "Token tidak sah atau tamat tempoh." });
      }
      const uid = decoded.uid;
      const email = String(decoded.email || "").toLowerCase().trim();
      const db = getDatabase(appInstance);
      // Utamakan profil mengikut UID; jatuh balik kepada carian emel.
      let kunci = null;
      let profil = null;
      const snapUid = await db.ref("profiles/" + uid).get();
      if (snapUid.exists()) {
        kunci = uid;
        profil = snapUid.val();
      } else if (email) {
        kunci = await cariKunciProfil(db, null, email);
        if (kunci) {
          const snapE = await db.ref("profiles/" + kunci).get();
          profil = snapE.exists() ? snapE.val() : null;
        }
      }
      if (!kunci || !profil) {
        return res.json({ success: true, status: "tiada_profil" });
      }
      const hasil = await turunkanJikaLuput(db, kunci, profil);
      const terkini = hasil.profil || profil;
      return res.json({
        success: true,
        status: hasil.berubah ? "diturunkan" : "kekal",
        langganan: terkini.langganan || "",
        tarikh_tamat: terkini.tarikh_tamat || "",
      });
    } catch (err) {
      console.error("[Subscription Check]", err);
      // Fail-safe: klien TIDAK menurunkan apa-apa jika berlaku ralat.
      return res.status(500).json({ success: false, message: "Semakan gagal; kekalkan keadaan." });
    }
  });

  app.post("/api/admin/verify", adminVerifyLimiter, async (req, res) => {
    try {
      const expectedCode = process.env.ADMIN_CODE;
      if (!expectedCode) {
        console.error("[Admin Verify] ADMIN_CODE belum ditetapkan dalam .env.");
        return res
          .status(500)
          .json({ success: false, message: "Mod admin belum dikonfigurasikan." });
      }

      const submitted = (req.body?.kod || "").toString().trim().toUpperCase();
      if (!submitted) {
        return res.status(400).json({ success: false, message: "Kod diperlukan." });
      }

      if (!selamatSamaDengan(submitted, expectedCode.trim().toUpperCase())) {
        // Mesej generik: jangan dedahkan sama ada kod admin itu wujud.
        return res.status(401).json({ success: false, message: "Kod tidak sah." });
      }

      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(500).json({
          success: false,
          message: "Firebase Admin SDK belum dikonfigurasikan di pelayan.",
        });
      }

      const adminUid = process.env.ADMIN_UID || "bunyikata-admin";
      const customToken = await getAuth(appInstance).createCustomToken(adminUid, {
        admin: true,
        peranan: "admin",
      });

      console.log("[Admin Verify] Custom token admin dikeluarkan.");
      return res.json({ success: true, token: customToken, uid: adminUid });
    } catch (err) {
      console.error("[Admin Verify Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Cipta akaun pengguna baharu (guru / ibu bapa).
   *
   * Ini menggantikan aliran pendaftaran sendiri: ADMIN sahaja yang mencipta
   * akaun, dan pengguna menerima kata laluan sementara melalui WhatsApp.
   *
   * Menggunakan Firebase Admin SDK, jadi penulisan ke Realtime Database
   * MEMINTAS peraturan keselamatan RTDB (Admin SDK sentiasa memintas).
   * Ini bermakna kita tidak perlu melonggarkan database.rules.json.
   *
   * Kata laluan TIDAK PERNAH disimpan dalam pangkalan data — ia hanya
   * dipulangkan sekali kepada admin untuk dihantar kepada pengguna.
   */
  /**
   * Fasa 1.6: ambil jejak audit tindakan admin (200 terbaharu).
   *
   * Hanya admin (requireAdmin) boleh melihat log ini - ia mengandungi emel
   * dan detail langganan pengguna.
   */
  app.get("/api/admin/audit", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const snap = await db.ref("audit_log").limitToLast(200).get();
      const log = [];
      if (snap.exists()) {
        snap.forEach((anak) => {
          log.push(Object.assign({ id: anak.key }, anak.val()));
          return false;
        });
      }
      // Terbaharu dahulu.
      log.sort((a, b) => new Date(b.tarikh || 0).getTime() - new Date(a.tarikh || 0).getTime());
      return res.json({ success: true, log });
    } catch (err) {
      console.error("[Admin Audit]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan log audit." });
    }
  });

  /**
   * Fasa 2: senarai affiliate + agregat jualan/komisen/baki.
   *
   * Baki dan agregat DIKIRA daripada nod `referrals/{kod}` supaya angka di
   * jadual admin sentiasa konsisten dengan rekod komisen sebenar (tiada
   * pengiraan berasingan yang boleh menyimpang).
   */
  app.get("/api/admin/affiliate/list", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      // Selaraskan status semua kod affiliate dengan rekod pembayaran
      // sebenar sebelum agregat dikira, supaya jadual admin tidak
      // bercanggah dengan laporan pembayaran.
      try {
        const snapKod = await db.ref("affiliates").get();
        if (snapKod.exists()) {
          await Promise.all(
            Object.keys(snapKod.val() || {}).map((k) =>
              selarasStatusKomisen(db, k).catch(() => null),
            ),
          );
        }
      } catch (err) {
        console.warn("[Admin Affiliate List] Selaras gagal:", err?.message || err);
      }

      const [snapAff, snapRef] = await Promise.all([
        db.ref("affiliates").get(),
        db.ref("referrals").get(),
      ]);

      // Kumpul agregat setiap kod affiliate.
      const agregat = {};
      if (snapRef.exists()) {
        snapRef.forEach((kodSnap) => {
          const kod = kodSnap.key;
          const agg = {
            jualan_bil: 0, jumlah_jualan_sen: 0, komisen_keseluruhan_sen: 0,
            dibayar_sen: 0, baki_sen: 0, tarikh_bayar_terakhir: "",
          };
          kodSnap.forEach((rekod) => {
            const r = rekod.val() || {};
            // Hanya baris SAH/pending/dibayar dikira; `batal` diabaikan.
            if (r.status === "batal") return false;
            agg.jualan_bil += 1;
            agg.jumlah_jualan_sen += Number(r.harga_sen) || 0;
            const kom = Number(r.komisen_sen) || 0;
            agg.komisen_keseluruhan_sen += kom;
            if (r.status === "dibayar") {
              agg.dibayar_sen += kom;
            } else {
              agg.baki_sen += kom;
            }
            if (r.tarikh_bayar && (!agg.tarikh_bayar_terakhir || r.tarikh_bayar > agg.tarikh_bayar_terakhir)) {
              agg.tarikh_bayar_terakhir = r.tarikh_bayar;
            }
            return false;
          });
          agregat[kod] = agg;
        });
      }

      const senarai = [];
      if (snapAff.exists()) {
        snapAff.forEach((anak) => {
          const a = anak.val() || {};
          const agg = agregat[anak.key] || {
            jualan_bil: 0, jumlah_jualan_sen: 0, komisen_keseluruhan_sen: 0,
            dibayar_sen: 0, baki_sen: 0, tarikh_bayar_terakhir: "",
          };
          senarai.push(Object.assign({ kod: anak.key }, a, agg));
          return false;
        });
      }

      // Terbaharu didaftar dahulu.
      senarai.sort((a, b) => String(b.dicipta_pada || "").localeCompare(String(a.dicipta_pada || "")));
      return res.json({ success: true, affiliates: senarai });
    } catch (err) {
      console.error("[Admin Affiliate List]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan senarai affiliate." });
    }
  });

  /**
   * Fasa 2: daftar affiliate baharu -> jana kod unik 6 aksara.
   *
   * Kod dijana di pelayan supaya ia tidak boleh diteka/dipalsukan dari pelayar,
   * dan supaya pertembungan kekunci dapat disemak terhadap RTDB sebenar.
   */
  app.post("/api/admin/affiliate/create", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      const authAdmin = getAuth(appInstance);
      const nama = String(req.body?.nama || "").trim();
      const emailBersih = String(req.body?.email || "").trim().toLowerCase();
      const whatsapp = bersihkanWhatsapp(req.body?.whatsapp);
      if (!nama) {
        return res.status(400).json({ success: false, message: "Nama affiliate diperlukan." });
      }
      if (!whatsapp || whatsapp.length < 9) {
        return res.status(400).json({ success: false, message: "Nombor WhatsApp tidak sah (cth. 60173955657)." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBersih)) {
        return res.status(400).json({ success: false, message: "Format emel tidak sah." });
      }

      // --- Pastikan emel belum digunakan oleh akaun lain ---
      try {
        const sediaAda = await authAdmin.getUserByEmail(emailBersih);
        if (sediaAda) {
          return res.status(409).json({
            success: false,
            message: "Emel ini sudah mempunyai akaun. Gunakan emel lain.",
          });
        }
      } catch (err) {
        // auth/user-not-found bermakna emel bebas — inilah keadaan yang kita mahu.
        if (err?.code !== "auth/user-not-found") throw err;
      }

      const kod = await janaKodAffiliate(db);
      if (!kod) {
        return res.status(500).json({ success: false, message: "Gagal menjana kod unik. Cuba lagi." });
      }

      // --- Jana kata laluan sementara (dipapar SEKALI kepada admin) ---
      const kataLaluan = String(req.body?.password || "").trim() || janaKataLaluan();

      // --- Cipta akaun Firebase Auth untuk affiliate ---
      const rekodAuth = await authAdmin.createUser({
        email: emailBersih,
        password: kataLaluan,
        displayName: nama,
        emailVerified: false,
      });
      const uid = rekodAuth.uid;

      // Tanda pada token: claim ini yang membenarkan akses /api/affiliate/*.
      // PENTING: gabung dengan claims sedia ada (setCustomUserClaims menggantikan
      // SEMUA claim), supaya claim lain tidak hilang.
      try {
        let claimSediaAda = {};
        try {
          const rekodSemasa = await authAdmin.getUser(uid);
          claimSediaAda = rekodSemasa?.customClaims || {};
        } catch (bacaErr) {
          // Abaikan: jika gagal baca, teruskan dengan claim baharu sahaja.
          console.warn("[Affiliate] Gagal baca claim sedia ada:", bacaErr?.message || bacaErr);
        }
        await authAdmin.setCustomUserClaims(uid, { ...claimSediaAda, affiliate_kod: kod });
      } catch (err) {
        // Jika claim gagal, padam akaun supaya tidak wujud affiliate tanpa akses.
        await authAdmin.deleteUser(uid).catch((delErr) => {
          // Rollback gagal -> akaun Auth yatim tanpa claim affiliate_kod.
          // Log supaya admin boleh padam manual (jangan telan senyap).
          console.warn(`[Affiliate] Gagal padam akaun yatim ${uid}:`, delErr?.message || delErr);
        });
        throw err;
      }

      const rekod = {
        nama,
        whatsapp,
        kod,
        email: emailBersih,
        uid,
        status: "aktif",
        dicipta_pada: new Date().toISOString(),
      };
      await db.ref(`affiliates/${kod}`).set(rekod);
      await rekodAudit(db, "affiliate_cipta", { kod, nama, whatsapp, email: emailBersih, uid });

      console.log(`[Affiliate] Didaftar: ${nama} (${kod}) <${emailBersih}>`);
      // Kata laluan dipulangkan SEKALI sahaja — tidak disimpan di mana-mana.
      return res.json({ success: true, affiliate: rekod, email: emailBersih, password: kataLaluan });
    } catch (err) {
      console.error("[Admin Affiliate Create]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Fasa 2: tukar status affiliate (aktif <-> gantung).
   *
   * Gantung mengekalkan sejarah & baki komisen; kod sahaja berhenti menerima
   * rujukan baharu. Ini lebih selamat daripada padam (lihat /delete).
   */
  app.post("/api/admin/affiliate/status", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      const kod = String(req.body?.kod || "").trim().toUpperCase();
      const status = String(req.body?.status || "").trim().toLowerCase();
      if (!kod || ["aktif", "gantung"].indexOf(status) === -1) {
        return res.status(400).json({ success: false, message: "Kod atau status tidak sah." });
      }

      const snap = await db.ref(`affiliates/${kod}`).get();
      if (!snap.exists()) {
        return res.status(404).json({ success: false, message: "Affiliate tidak ditemui." });
      }

      await db.ref(`affiliates/${kod}`).update({ status });
      await rekodAudit(db, "affiliate_status", { kod, status });
      return res.json({ success: true, kod, status });
    } catch (err) {
      console.error("[Admin Affiliate Status]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Fasa 2: padam affiliate secara kekal.
   *
   * DIBLOK jika masih ada baki komisen belum dibayar - supaya hutang kepada
   * affiliate tidak hilang begitu sahaja. Admin perlu bayar/tanda dahulu.
   */
  app.post("/api/admin/affiliate/delete", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      const kod = String(req.body?.kod || "").trim().toUpperCase();
      if (!kod) {
        return res.status(400).json({ success: false, message: "Kod affiliate diperlukan." });
      }

      const snap = await db.ref(`affiliates/${kod}`).get();
      if (!snap.exists()) {
        return res.status(404).json({ success: false, message: "Affiliate tidak ditemui." });
      }

      // Semak baki belum dibayar sebelum membenarkan padam.
      const snapRef = await db.ref(`referrals/${kod}`).get();
      let bakiSen = 0;
      if (snapRef.exists()) {
        snapRef.forEach((rekod) => {
          const r = rekod.val() || {};
          if (r.status !== "batal" && r.status !== "dibayar") {
            bakiSen += Number(r.komisen_sen) || 0;
          }
          return false;
        });
      }
      if (bakiSen > 0) {
        return res.status(409).json({
          success: false,
          message: `Tidak boleh padam: masih ada baki komisen RM${(bakiSen / 100).toFixed(2)} belum dibayar.`,
          baki_sen: bakiSen,
        });
      }

      const rekodAsal = snap.val() || {};
      await db.ref(`affiliates/${kod}`).remove();
      await rekodAudit(db, "affiliate_padam", {
        kod,
        nama: rekodAsal.nama || "",
        whatsapp: rekodAsal.whatsapp || "",
      });

      console.log(`[Affiliate] Dipadam: ${kod}`);
      return res.json({ success: true, kod });
    } catch (err) {
      console.error("[Admin Affiliate Delete]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Fasa 2: laporan pembayaran komisen (kitaran 2 minggu).
   *
   * Pembayaran komisen adalah MANUAL sepenuhnya oleh admin — tiada tempoh
   * tahan automatik. Semua baris komisen belum dibayar (status bukan `batal`
   * atau `dibayar`) terus dianggap layak dibayar.
   */
  app.get("/api/admin/affiliate/payments", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      // Ambil rekod pembayaran dahulu, kemudian selaraskan status baris
      // rujukan (auto-tanda 'dibayar') SEBELUM snapshot rujukan dibaca,
      // supaya jadual "Rujukan & Komisen" dan "Laporan Pembayaran" sepadan.
      let snapBayarAwal;
      let snapAffAwal;
      try {
        [snapAffAwal, snapBayarAwal] = await Promise.all([
          db.ref("affiliates").get(),
          db.ref("affiliate_payments").get(),
        ]);
        if (snapAffAwal.exists()) {
          const kodSenarai = Object.keys(snapAffAwal.val() || {});
          await Promise.all(
            kodSenarai.map((k) => selarasStatusKomisen(db, k).catch(() => null)),
          );
        }
      } catch (err) {
        console.warn("[Admin Affiliate Payments] Selaras gagal:", err?.message || err);
      }

      const [snapAff, snapRef, snapBayar] = await Promise.all([
        db.ref("affiliates").get(),
        db.ref("referrals").get(),
        db.ref("affiliate_payments").get(),
      ]);

      const namaKod = {};
      if (snapAff.exists()) {
        snapAff.forEach((a) => { namaKod[a.key] = (a.val() || {}).nama || ""; return false; });
      }

      const layak = []; // baris komisen yang boleh dibayar sekarang.
      // Baki belum dibayar (semua baris pending layak kecuali yang telah dibayar).
      const bakiLayakSen = {}; // kod -> jumlah layak belum dibayar
      const bakiSemuaSen = {}; // kod -> jumlah komisen belum dibayar (semua peringkat)
      if (snapRef.exists()) {
        snapRef.forEach((kodSnap) => {
          const kod = kodSnap.key;
          kodSnap.forEach((rekod) => {
            const r = rekod.val() || {};
            if (r.status === "batal" || r.status === "dibayar") return false;
            const komisen = Number(r.komisen_sen) || 0;
            bakiSemuaSen[kod] = (bakiSemuaSen[kod] || 0) + komisen;
            const item = Object.assign({ kod, id: rekod.key, nama_affiliate: namaKod[kod] || "" }, r);
            layak.push(item);
            bakiLayakSen[kod] = (bakiLayakSen[kod] || 0) + komisen;
            return false;
          });
          return false;
        });
      }

      // Kumpulkan jumlah layak mengikut affiliate.
      const ikutKod = {};
      layak.forEach((it) => {
        if (!ikutKod[it.kod]) {
          ikutKod[it.kod] = { kod: it.kod, nama: it.nama_affiliate, bil: 0, jumlah_sen: 0 };
        }
        ikutKod[it.kod].bil += 1;
        ikutKod[it.kod].jumlah_sen += Number(it.komisen_sen) || 0;
      });

      // Sejarah pembayaran manual (paling baharu dahulu) + tarikh bayar terakhir.
      const dibayarSejarah = [];
      const tarikhBayarTerakhir = {};
      if (snapBayar.exists()) {
        snapBayar.forEach((rekod) => {
          const p = rekod.val() || {};
          const kodP = String(p.kod || "").trim().toUpperCase();
          dibayarSejarah.push({
            id: rekod.key,
            kod: kodP,
            nama: p.nama || namaKod[kodP] || "",
            jumlah_sen: Number(p.jumlah_sen) || 0,
            kaedah: p.kaedah || "",
            rujukan: p.rujukan || "",
            nota: p.nota || "",
            bil: Number(p.bil) || 0,
            tarikh: p.tarikh || p.dicipta_pada || "",
          });
          const t = p.tarikh || p.dicipta_pada || "";
          if (kodP && (!tarikhBayarTerakhir[kodP] || String(t) > String(tarikhBayarTerakhir[kodP]))) {
            tarikhBayarTerakhir[kodP] = t;
          }
          return false;
        });
        dibayarSejarah.sort((a, b) => String(b.tarikh || "").localeCompare(String(a.tarikh || "")));
      }

      // Sertakan baris ringkasan untuk SEMUA affiliate (walaupun tiada komisen
      // layak) supaya admin boleh merekod bayaran manual + nampak baki.
      Object.keys(namaKod).forEach((kod) => {
        if (!ikutKod[kod]) {
          ikutKod[kod] = { kod, nama: namaKod[kod] || "", bil: 0, jumlah_sen: 0 };
        }
      });

      const ringkasan = Object.values(ikutKod)
        .map((r) => ({
          ...r,
          baki_sen: bakiLayakSen[r.kod] || 0,
          baki_semua_sen: bakiSemuaSen[r.kod] || 0,
          tarikh_bayar_terakhir: tarikhBayarTerakhir[r.kod] || "",
        }))
        .sort((a, b) => b.jumlah_sen - a.jumlah_sen || String(a.nama || "").localeCompare(String(b.nama || "")));
      const jumlahLayakSen = ringkasan.reduce((s, r) => s + r.jumlah_sen, 0);

      return res.json({
        success: true,
        ringkasan,
        layak,
        dibayar_sejarah: dibayarSejarah,
        jumlah_layak_sen: jumlahLayakSen,
      });
    } catch (err) {
      console.error("[Admin Affiliate Payments]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan laporan pembayaran." });
    }
  });

  /**
   * Fasa 2: tanda komisen dibayar (kitaran 2 minggu).
   *
   * Menerima senarai `ids` (atau `kod` untuk semua baris layak affiliate itu).
   * Setiap baris ditanda `status: dibayar` + `tarikh_bayar` supaya kitaran
   * mana sudah dibayar boleh diaudit kemudian.
   */
  app.post("/api/admin/affiliate/mark-paid", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const tarikh = new Date().toISOString();

      const senarai = Array.isArray(req.body?.items) ? req.body.items : [];
      if (!senarai.length) {
        return res.status(400).json({ success: false, message: "Tiada baris komisen dipilih." });
      }

      let dibayarBil = 0;
      let jumlahSen = 0;
      for (const it of senarai) {
        const kod = String(it?.kod || "").trim().toUpperCase();
        const id = String(it?.id || "").trim();
        if (!kod || !id) continue;
        const ref = db.ref(`referrals/${kod}/${id}`);
        const snap = await ref.get();
        if (!snap.exists()) continue;
        const r = snap.val() || {};
        if (r.status === "dibayar" || r.status === "batal") continue;
        await ref.update({ status: "dibayar", tarikh_bayar: tarikh });
        dibayarBil += 1;
        jumlahSen += Number(r.komisen_sen) || 0;
      }

      await rekodAudit(db, "affiliate_bayar", { bil: dibayarBil, jumlah_sen: jumlahSen, tarikh });
      return res.json({ success: true, dibayar_bil: dibayarBil, jumlah_sen: jumlahSen, tarikh });
    } catch (err) {
      console.error("[Admin Affiliate Mark Paid]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Fasa 2 (baharu): rekod pembayaran komisen SECARA MANUAL.
   *
   * Berbeza daripada /mark-paid (yang menanda baris komisen yang ditunjuk),
   * endpoint ini merekod satu TRANSAKSI pembayaran sebenar ke dalam
   * `affiliate_payments/{id}` — cth. bank transfer / DuitNow yang diterima.
   *
   * Pilihan `tanda_komisen` (lalai true): baris komisen LAYAK (matang) bagi
   * affiliate itu akan ditanda `dibayar` mengikut turutan tertua dahulu,
   * sehingga jumlah pembayaran dipenuhi. Ini menyebabkan baki dikira semula
   * di SEMUA paparan (admin + dashboard affiliate) secara automatik.
   */
  app.post("/api/admin/affiliate/payment-record", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);

      const kod = String(req.body?.kod || "").trim().toUpperCase();
      const jumlahSen = Math.round(Number(req.body?.jumlah_sen) || 0);
      const kaedah = String(req.body?.kaedah || "").trim();
      const rujukan = String(req.body?.rujukan || "").trim();
      const nota = String(req.body?.nota || "").trim();
      const tarikhInput = String(req.body?.tarikh || "").trim();
      const tandaKomisen = req.body?.tanda_komisen !== false;

      if (!kod) {
        return res.status(400).json({ success: false, message: "Kod affiliate diperlukan." });
      }
      if (jumlahSen <= 0) {
        return res.status(400).json({ success: false, message: "Jumlah bayaran mesti lebih daripada RM0." });
      }

      const affSnap = await db.ref(`affiliates/${kod}`).get();
      if (!affSnap.exists()) {
        return res.status(404).json({ success: false, message: "Rekod affiliate tidak dijumpai." });
      }
      const namaAff = (affSnap.val() || {}).nama || "";

      const tarikh = tarikhInput || new Date().toISOString();

      // 1) Kira baris komisen yang layak untuk ditanda dibayar (pembayaran manual oleh admin).
      let bilDitanda = 0;
      let jumlahDitanda = 0;
      if (tandaKomisen) {
        const snapRef = await db.ref(`referrals/${kod}`).get();
        const calon = [];
        if (snapRef.exists()) {
          snapRef.forEach((rekod) => {
            const r = rekod.val() || {};
            if (r.status === "batal" || r.status === "dibayar") return false;
            calon.push({ id: rekod.key, komisen_sen: Number(r.komisen_sen) || 0, tarikh_beli: r.tarikh_beli || "" });
            return false;
          });
        }
        // Tertua dahulu supaya baki yang paling lama dijelaskan dulu.
        calon.sort((a, b) => String(a.tarikh_beli || "").localeCompare(String(b.tarikh_beli || "")));

        const kemasKini = {};
        for (const c of calon) {
          if (jumlahDitanda >= jumlahSen) break;
          kemasKini[`referrals/${kod}/${c.id}/status`] = "dibayar";
          kemasKini[`referrals/${kod}/${c.id}/tarikh_bayar`] = tarikh;
          jumlahDitanda += c.komisen_sen;
          bilDitanda += 1;
        }
        if (Object.keys(kemasKini).length) {
          await db.ref().update(kemasKini);
        }
      }

      // 2) Tulis rekod pembayaran (transaksi) untuk sejarah/audit.
      const rekod = {
        kod,
        nama: namaAff,
        jumlah_sen: jumlahSen,
        kaedah,
        rujukan,
        nota,
        bil: bilDitanda,
        tarikh,
        dicipta_pada: new Date().toISOString(),
        oleh: req.adminUid || "",
      };
      const baru = db.ref("affiliate_payments").push();
      await baru.set(rekod);

      // 3) Selaraskan semula status baris dengan SEMUA rekod pembayaran
      //    (termasuk rekod lama) supaya tiada baris tertinggal "Belum
      //    Dibayar" walaupun bayaran sudah direkod.
      await selarasStatusKomisen(db, kod);

      await rekodAudit(db, "affiliate_bayar", {
        id: baru.key,
        kod,
        jumlah_sen: jumlahSen,
        bil: bilDitanda,
        kaedah,
        tarikh,
      });

      return res.json({
        success: true,
        id: baru.key,
        bil_ditanda: bilDitanda,
        jumlah_ditanda_sen: jumlahDitanda,
        jumlah_sen: jumlahSen,
        tarikh,
      });
    } catch (err) {
      console.error("[Admin Affiliate Payment Record]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Fasa 3 (Affiliate Login): profil + ringkasan prestasi affiliate sendiri.
   *
   * Kod affiliate diambil DARIPADA token (requireAffiliate), jadi affiliate
   * tidak boleh melebar pandang ke kod orang lain walaupun menukar body.
   * Formula agregat adalah SAMA seperti /api/admin/affiliate/list supaya angka
   * yang dilihat affiliate sepadan dengan jadual admin.
   */
  app.get("/api/affiliate/me", requireAffiliate, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const kod = req.affiliateKod;

      // Selaraskan status baris (rekod pembayaran sebenar -> status rujukan)
      // supaya kad "Telah Dibayar" & baki tidak kekal RM0.00 apabila admin
      // sudah merekod pembayaran.
      await selarasStatusKomisen(db, kod);

      const [snapAff, snapRef] = await Promise.all([
        db.ref(`affiliates/${kod}`).get(),
        db.ref(`referrals/${kod}`).get(),
      ]);
      if (!snapAff.exists()) {
        return res.status(404).json({ success: false, message: "Rekod affiliate tidak dijumpai." });
      }
      const profil = snapAff.val() || {};

      const agg = {
        jualan_bil: 0, jumlah_jualan_sen: 0, komisen_keseluruhan_sen: 0,
        dibayar_sen: 0, baki_sen: 0,
      };
      if (snapRef.exists()) {
        snapRef.forEach((rekod) => {
          const r = rekod.val() || {};
          if (r.status === "batal") return false;
          agg.jualan_bil += 1;
          agg.jumlah_jualan_sen += Number(r.harga_sen) || 0;
          const kom = Number(r.komisen_sen) || 0;
          agg.komisen_keseluruhan_sen += kom;
          if (r.status === "dibayar") agg.dibayar_sen += kom;
          else agg.baki_sen += kom;
          return false;
        });
      }

      return res.json({
        success: true,
        affiliate: {
          nama: profil.nama || "",
          kod,
          email: profil.email || "",
          whatsapp: profil.whatsapp || "",
          status: profil.status || "aktif",
          dicipta_pada: profil.dicipta_pada || "",
        },
        ringkasan: agg,
      });
    } catch (err) {
      console.error("[Affiliate Me]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan profil affiliate." });
    }
  });

  /**
   * Fasa 3: senarai baris rujukan (bagi affiliate sendiri sahaja).
   * Kod diambil daripada token — bukan query/body.
   */
  app.get("/api/affiliate/referrals", requireAffiliate, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const kod = req.affiliateKod;

      // Selaraskan status sebelum membaca supaya baris yang sudah dibayar
      // (mengikut rekod `affiliate_payments`) tidak lagi dipaparkan
      // "Belum Dibayar".
      await selarasStatusKomisen(db, kod);

      const snapRef = await db.ref(`referrals/${kod}`).get();
      const senarai = [];
      const perluPeranan = [];
      if (snapRef.exists()) {
        snapRef.forEach((rekod) => {
          const r = rekod.val() || {};
          const peranan = String(r.peranan || "").toLowerCase();
          // Simpan calon carian untuk fallback: uid (utama) + emel (jika profil
          // lama berkunci emel / uid tiada).
          if (!peranan && (r.pelanggan_uid || r.pelanggan_emel)) {
            perluPeranan.push({ uid: r.pelanggan_uid || "", emel: String(r.pelanggan_emel || "").toLowerCase() });
          }
          senarai.push({
            id: rekod.key,
            pelanggan_uid: r.pelanggan_uid || "",
            pelanggan_nama: r.pelanggan_nama || "",
            // Peranan pelanggan (guru / ibubapa) — dipaparkan sebagai lajur
            // "Peranan" supaya nama pelanggan tidak didedahkan.
            peranan,
            nama_pakej: r.nama_pakej || "",
            harga_sen: Number(r.harga_sen) || 0,
            komisen_sen: Number(r.komisen_sen) || 0,
            status: r.status || "sah",
            tarikh_beli: r.tarikh_beli || "",
            tarikh_bayar: r.tarikh_bayar || "",
          });
          return false;
        });
      }

      // --- Fallback: rekod LAMA tiada medan `peranan` ---
      // Rujuk profil pelanggan untuk mendapatkan peranan sebenar (guru/ibubapa).
      // Carian cuba uid dahulu, kemudian emel (profil lama boleh berkunci emel).
      if (perluPeranan.length) {
        const petaUid = {};
        const petaEmel = {};
        const uidsUnik = [...new Set(perluPeranan.map((p) => p.uid).filter(Boolean))];
        const emelUnik = [...new Set(perluPeranan.map((p) => p.emel).filter(Boolean))];
        await Promise.all([
          ...uidsUnik.map(async (u) => {
            try {
              const snapP = await db.ref(`profiles/${u}/peranan`).get();
              if (snapP.exists()) petaUid[u] = String(snapP.val() || "").toLowerCase();
            } catch (err) {
              console.warn("[Affiliate Referrals] Gagal ambil peranan (uid):", u, err?.message || err);
            }
          }),
          ...emelUnik.map(async (e) => {
            try {
              const snapE = await db.ref("profiles").orderByChild("email").equalTo(e).limitToFirst(1).get();
              if (snapE.exists()) {
                snapE.forEach((c) => {
                  const pr = c.val()?.peranan;
                  if (pr) petaEmel[e] = String(pr).toLowerCase();
                  return true;
                });
              }
            } catch (err) {
              console.warn("[Affiliate Referrals] Gagal ambil peranan (emel):", e, err?.message || err);
            }
          }),
        ]);
        senarai.forEach((s, i) => {
          if (s.peranan) return;
          const calon = perluPeranan.find((p) => p.uid && p.uid === s.pelanggan_uid) || null;
          const emelRekod = calon ? calon.emel : (perluPeranan[i] ? perluPeranan[i].emel : "");
          if (s.pelanggan_uid && petaUid[s.pelanggan_uid]) {
            s.peranan = petaUid[s.pelanggan_uid];
          } else if (emelRekod && petaEmel[emelRekod]) {
            s.peranan = petaEmel[emelRekod];
          }
        });
      }

      // Terbaharu dahulu.
      senarai.sort((a, b) => String(b.tarikh_beli || "").localeCompare(String(a.tarikh_beli || "")));
      return res.json({ success: true, referrals: senarai });
    } catch (err) {
      console.error("[Affiliate Referrals]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan rujukan." });
    }
  });

  /**
   * Fasa 3: rekod pembayaran komisen SECARA MANUAL bagi affiliate sendiri.
   *
   * Kod diambil DARIPADA token (requireAffiliate) — bukan query — supaya
   * affiliate tidak boleh mengintai pembayaran orang lain. Hanya rekod dengan
   * kod yang sepadan dipulangkan.
   */
  app.get("/api/affiliate/payments", requireAffiliate, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const kod = req.affiliateKod;

      // Selaraskan status rujukan dengan rekod pembayaran sebelum membaca
      // supaya laporan ini sepadan dengan Jadual Rujukan & Komisen.
      await selarasStatusKomisen(db, kod);

      const snapBayar = await db.ref("affiliate_payments").get();
      const senarai = [];
      let jumlahDibayarSen = 0;
      let tarikhTerakhir = "";
      if (snapBayar.exists()) {
        snapBayar.forEach((rekod) => {
          const p = rekod.val() || {};
          const kodP = String(p.kod || "").trim().toUpperCase();
          if (kodP !== String(kod).trim().toUpperCase()) return false;
          const tarikh = p.tarikh || p.dicipta_pada || "";
          senarai.push({
            id: rekod.key,
            kod: kodP,
            nama: p.nama || "",
            jumlah_sen: Number(p.jumlah_sen) || 0,
            kaedah: p.kaedah || "",
            rujukan: p.rujukan || "",
            nota: p.nota || "",
            bil: Number(p.bil) || 0,
            tarikh,
          });
          jumlahDibayarSen += Number(p.jumlah_sen) || 0;
          if (tarikh && String(tarikh) > String(tarikhTerakhir)) tarikhTerakhir = tarikh;
          return false;
        });
        senarai.sort((a, b) => String(b.tarikh || "").localeCompare(String(a.tarikh || "")));
      }

      return res.json({
        success: true,
        dibayar_sejarah: senarai,
        jumlah_dibayar_sen: jumlahDibayarSen,
        tarikh_bayar_terakhir: tarikhTerakhir,
      });
    } catch (err) {
      console.error("[Affiliate Payments]", err);
      return res.status(500).json({ success: false, message: "Gagal memuatkan laporan pembayaran." });
    }
  });

  /**
   * Fasa 3: Kemas kini profil affiliate (nama / whatsapp).
   */
  app.post("/api/affiliate/update-profile", requireAffiliate, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(503).json({ success: false, message: "Firebase Admin SDK belum sedia." });
      }
      const db = getDatabase(appInstance);
      const authAdmin = getAuth(appInstance);
      const kod = req.affiliateKod;
      const { nama, whatsapp } = req.body || {};

      const updates = {};
      if (typeof nama === "string" && nama.trim()) updates.nama = nama.trim();
      if (typeof whatsapp === "string") updates.whatsapp = whatsapp.trim();
      updates.dikemaskini_pada = new Date().toISOString();

      await db.ref(`affiliates/${kod}`).update(updates);
      if (req.user && req.user.uid && updates.nama) {
        try {
          await authAdmin.updateUser(req.user.uid, { displayName: updates.nama });
        } catch (e) {
          console.warn("[Affiliate update displayName]", e);
        }
      }

      return res.json({ success: true, message: "Profil affiliate berjaya dikemaskini." });
    } catch (err) {
      console.error("[Affiliate Update Profile]", err);
      return res.status(500).json({ success: false, message: "Gagal mengemaskini profil affiliate." });
    }
  });

  app.post("/api/admin/create-account", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(500).json({ success: false, message: "Firebase Admin SDK belum dikonfigurasikan." });
      }

      const {
        nama = "",
        email = "",
        peranan = "",
        no_telefon = "",
        nama_sekolah = "",
        nama_keluarga = "",
        planKey = "",
        kod_rujukan = "",
      } = req.body || {};

      const namaBersih = String(nama).trim();
      const emailBersih = String(email).trim().toLowerCase();
      const perananBersih = String(peranan).trim().toLowerCase();
      const planBersih = String(planKey).trim();
      const kodRujukanBersih = String(kod_rujukan).trim().toUpperCase();

      // --- Pengesahan input ---
      if (!namaBersih || !emailBersih || !perananBersih || !planBersih) {
        return res.status(400).json({ success: false, message: "Nama, emel, peranan dan pakej diperlukan." });
      }
      if (!["guru", "ibubapa"].includes(perananBersih)) {
        return res.status(400).json({ success: false, message: "Peranan tidak sah (guru / ibubapa sahaja)." });
      }
      if (!PLAN_CATALOG[planBersih]) {
        return res.status(400).json({ success: false, message: "Pakej tidak sah." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBersih)) {
        return res.status(400).json({ success: false, message: "Format emel tidak sah." });
      }

      const authAdmin = getAuth(appInstance);
      const db = getDatabase(appInstance);

      // --- Fasa 2: sahkan kod rujukan (jika ada) ---
      // Kod tidak dikenali / digantung TIDAK menghalang cipta akaun — ia hanya
      // bermakna tiada komisen dikreditkan (fail-safe: jangan sekat jualan).
      let affiliateSah = null;
      if (kodRujukanBersih) {
        try {
          const snapAff = await db.ref(`affiliates/${kodRujukanBersih}`).get();
          if (snapAff.exists()) {
            const a = snapAff.val() || {};
            // Rekod lama tanpa medan status dianggap aktif (fail-safe), supaya
            // kod sah tidak dilabel "digantung" hanya kerana medan tiada.
            const statusAff = String(a.status || "aktif").toLowerCase();
            if (statusAff === "aktif") affiliateSah = a;
            else console.warn(`[Affiliate] Kod ${kodRujukanBersih} status="${statusAff}" — tiada komisen.`);
          } else {
            console.warn(`[Affiliate] Kod ${kodRujukanBersih} tidak ditemui — tiada komisen.`);
          }
        } catch (err) {
          console.warn("[Affiliate] Gagal menyemak kod rujukan:", err?.message || err);
        }
      }

      // --- Pastikan emel belum digunakan ---
      try {
        const sediaAda = await authAdmin.getUserByEmail(emailBersih);
        if (sediaAda) {
          return res.status(409).json({
            success: false,
            message: "Emel ini sudah mempunyai akaun. Gunakan 'Reset Kata Laluan' sebagai ganti.",
          });
        }
      } catch (err) {
        // auth/user-not-found bermakna emel bebas — inilah keadaan yang kita mahu.
        if (err?.code !== "auth/user-not-found") throw err;
      }

      // --- Jana kata laluan sementara (atau guna yang diberi admin) ---
      const kataLaluan = String(req.body?.password || "").trim() || janaKataLaluan();

      // --- Cipta pengguna Firebase Auth ---
      const rekodAuth = await authAdmin.createUser({
        email: emailBersih,
        password: kataLaluan,
        displayName: namaBersih,
        emailVerified: false,
      });
      const uid = rekodAuth.uid;

      // --- Kira tempoh langganan dari katalog pakej pelayan ---
      const plan = PLAN_CATALOG[planBersih];
      const tarikhMula = new Date().toISOString();
      const tarikhTamat = kiraTarikhTamat(plan.days, tarikhMula);

      const profilBaharu = {
        nama: namaBersih,
        emel: emailBersih,
        email: emailBersih,
        peranan: perananBersih,
        no_telefon: String(no_telefon).trim(),
        // Medan khusus mengikut peranan — simpan hanya yang berkaitan.
        nama_sekolah: perananBersih === "guru" ? String(nama_sekolah).trim() : "",
        nama_keluarga: perananBersih === "ibubapa" ? String(nama_keluarga).trim() : "",
        langganan: plan.name,
        pakej: planBersih,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat,
        dicipta_oleh: "admin",
        sumber: "admin",
        // Fasa 2: jejak kod rujukan affiliate (kosong jika tiada).
        referred_by: affiliateSah ? kodRujukanBersih : "",
        tarikh_dicipta: tarikhMula,
      };

      await db.ref(`profiles/${uid}`).set(profilBaharu);

      // Rekod pesanan manual (bayaran di luar sistem, direkod oleh admin).
      await db.ref("orders").push({
        uid,
        nama: namaBersih,
        emel: emailBersih,
        peranan: perananBersih,
        pakej: planBersih,
        nama_pakej: plan.name,
        harga_sen: plan.priceCents,
        jumlah_hari: plan.days,
        status: "paid",
        kaedah: "manual",
        jenis: "cipta_akaun",
        kod_rujukan: affiliateSah ? kodRujukanBersih : "",
        direkod_oleh: "admin",
        tarikh: tarikhMula,
      });

      // --- Fasa 2: kreditkan komisen 30% kepada affiliate (fail-safe) ---
      // Kegagalan kredit komisen TIDAK menghalang akaun dicipta; hanya log.
      let komisenSen = 0;
      if (affiliateSah) {
        try {
          komisenSen = kiraKomisenSen(plan.priceCents);
          await db.ref(`referrals/${kodRujukanBersih}`).push({
            pelanggan_uid: uid,
            pelanggan_nama: namaBersih,
            pelanggan_emel: emailBersih,
            // Peranan pelanggan (guru / ibubapa). Tanpa medan ini, lajur
            // "Peranan" pada jadual affiliate tidak dapat dipaparkan.
            peranan: perananBersih,
            pakej: planBersih,
            nama_pakej: plan.name,
            harga_sen: plan.priceCents,
            komisen_sen: komisenSen,
            status: "pending",
            tarikh_beli: tarikhMula,
          });
        } catch (err) {
          console.warn("[Affiliate] Gagal merekod komisen:", err?.message || err);
        }
      }

      await rekodAudit(db, "cipta_akaun", {
        uid,
        emel: emailBersih,
        peranan: perananBersih,
        pakej: planBersih,
        harga_sen: plan.priceCents,
        jumlah_hari: plan.days,
        kod_rujukan: affiliateSah ? kodRujukanBersih : "",
        komisen_sen: komisenSen,
      });
      console.log(`[Admin Cipta Akaun] Akaun dicipta: ${emailBersih} (${uid}) pakej=${planBersih}`);

      // Kata laluan dipulangkan SEKALI sahaja — tidak disimpan di mana-mana.
      return res.json({
        success: true,
        uid,
        email: emailBersih,
        nama: namaBersih,
        password: kataLaluan,
        plan: { key: planBersih, name: plan.name, days: plan.days },
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat,
      });
    } catch (err) {
      console.error("[Admin Cipta Akaun Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Cari kunci profil dalam `profiles/`.
   *
   * Senarai admin menyimpan `id` yang kadang ialah UID Firebase, kadang kekunci
   * profil (cth. emel disanitasi daripada aliran lama). Jadi kita cuba uid
   * dahulu, kemudian jatuh balik ke carian emel.
   */
  async function cariKunciProfil(db, uid, email) {
    const bersihUid = String(uid || "").trim();
    if (bersihUid) {
      const snap = await db.ref(`profiles/${bersihUid}`).get();
      if (snap.exists()) return { kunci: bersihUid, profil: snap.val() || {} };
    }

    const bersihEmail = String(email || "").trim().toLowerCase();
    if (bersihEmail) {
      const snapMail = await db
        .ref("profiles")
        .orderByChild("email")
        .equalTo(bersihEmail)
        .get();
      if (snapMail.exists()) {
        let hasil = null;
        snapMail.forEach((child) => {
          if (!hasil) hasil = { kunci: child.key, profil: child.val() || {} };
        });
        if (hasil) return hasil;
      }
    }

    return null;
  }

  /** Cuba dapatkan emel daripada profil (fallback bila `uid` bukan UID Auth). */
  async function emailProfilDaripadaUid(appInstance, uid) {
    try {
      const snap = await getDatabase(appInstance).ref(`profiles/${uid}`).get();
      if (!snap.exists()) return "";
      const p = snap.val() || {};
      return String(p.email || p.emel || "").trim();
    } catch (e) {
      return "";
    }
  }

  /**
   * Set semula kata laluan pengguna atas permintaan admin.
   * Jika kata laluan tidak diberi, yang baharu akan dijana dan dipulangkan.
   */
  app.post("/api/admin/reset-password", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(500).json({ success: false, message: "Firebase Admin SDK belum dikonfigurasikan." });
      }

      const uid = String(req.body?.uid || "").trim();
      if (!uid) {
        return res.status(400).json({ success: false, message: "UID diperlukan." });
      }

      const kataLaluan = String(req.body?.password || "").trim() || janaKataLaluan();
      const emailDiminta = String(req.body?.email || "").trim();

      try {
        await getAuth(appInstance).updateUser(uid, { password: kataLaluan });
      } catch (errUid) {
        // `uid` mungkin bukan UID Firebase (cth. kekunci profil berasaskan emel),
        // atau profil wujud dalam RTDB tetapi akaun Auth-nya tiada. Cuba cari
        // akaun Auth mengikut emel sebagai jalan terakhir.
        const email = (emailDiminta || (await emailProfilDaripadaUid(appInstance, uid)) || "").trim();
        if (!email) throw errUid;
        const rekod = await getAuth(appInstance).getUserByEmail(email);
        await getAuth(appInstance).updateUser(rekod.uid, { password: kataLaluan });
        console.log(`[Admin Reset Kata Laluan] Diselesaikan melalui emel=${email} (uid asal tidak sah).`);
      }

      const dbReset = getDatabase(appInstance);
      await rekodAudit(dbReset, "reset_kata_laluan", { uid, emel: emailDiminta || "" });
      console.log(`[Admin Reset Kata Laluan] Kata laluan direset untuk uid=${uid}`);
      return res.json({ success: true, uid, password: kataLaluan });
    } catch (err) {
      console.error("[Admin Reset Kata Laluan Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Lanjutkan tempoh langganan pengguna.
   * Tempoh baharu dikira dari tarikh tamat SEDIA ADA (bukan dari hari ini),
   * supaya admin boleh menambah masa tanpa merugikan baki yang belum habis.
   *
   * Dua mod:
   *   - `planKey` (cth. "1bulan") -> tambah ikut pakej katalog.
   *   - `hari`    (cth. 10)       -> tambah bilangan hari budi bicara admin.
   * Jika `hari` diberi, ia mengatasi `planKey`.
   */
  app.post("/api/admin/extend-expiry", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(500).json({ success: false, message: "Firebase Admin SDK belum dikonfigurasikan." });
      }

      const uid = String(req.body?.uid || "").trim();
      const planBersih = String(req.body?.planKey || "").trim();
      const emailDiminta = String(req.body?.email || "").trim();
      const hariDiminta = Number(req.body?.hari || 0);

      if (!uid) {
        return res.status(400).json({ success: false, message: "UID diperlukan." });
      }

      const gunaHari = Number.isFinite(hariDiminta) && hariDiminta > 0;
      if (gunaHari) {
        if (hariDiminta > 3650) {
          return res.status(400).json({ success: false, message: "Maksimum 3650 hari (10 tahun) sekali gus." });
        }
      } else if (!PLAN_CATALOG[planBersih]) {
        return res.status(400).json({ success: false, message: "Pakej tidak sah." });
      }

      const db = getDatabase(appInstance);
      const jumpa = await cariKunciProfil(db, uid, emailDiminta);
      if (!jumpa) {
        return res.status(404).json({ success: false, message: "Profil tidak dijumpai." });
      }
      const kunciProfil = jumpa.kunci;
      const profil = jumpa.profil;

      // Lanjut dari tarikh tamat lama; jika tiada/tidak sah, mula dari sekarang.
      const tarikhTamatLama = profil.tarikh_tamat || "";
      const rujukan =
        tarikhTamatLama && new Date(tarikhTamatLama).getTime() > Date.now()
          ? tarikhTamatLama
          : new Date().toISOString();

      const plan = gunaHari
        ? { key: "hari-" + hariDiminta, name: namaPelanSediaAda(profil.langganan), days: hariDiminta, priceCents: 0 }
        : PLAN_CATALOG[planBersih];
      const tarikhTamatBaharu = kiraTarikhTamat(plan.days, rujukan);

      const kemaskini = { tarikh_tamat: tarikhTamatBaharu };
      // Mod pakej menetapkan semula nama langganan; mod hari hanya memanjangkan
      // masa dan MENGEKALKAN jenis langganan sedia ada.
      if (!gunaHari) {
        kemaskini.langganan = plan.name;
        kemaskini.pakej = planBersih;
      }

      await db.ref(`profiles/${kunciProfil}`).update(kemaskini);

      await db.ref("orders").push({
        uid: kunciProfil,
        nama: profil.nama || "",
        emel: profil.email || profil.emel || "",
        peranan: profil.peranan || "",
        pakej: plan.key,
        nama_pakej: plan.name,
        harga_sen: plan.priceCents,
        jumlah_hari: plan.days,
        status: "paid",
        kaedah: "manual",
        jenis: gunaHari ? "lanjutan_tempoh_hari" : "lanjutan_tempoh",
        direkod_oleh: "admin",
        tarikh: new Date().toISOString(),
      });

      await rekodAudit(db, "lanjut_tempoh", {
        uid,
        kunci_profil: kunciProfil,
        nama_pakej: plan.name,
        jumlah_hari: plan.days,
        harga_sen: plan.priceCents,
        mod: gunaHari ? "hari" : "pakej",
        tarikh_tamat_baharu: tarikhTamatBaharu,
      });
      console.log(`[Admin Lanjutan Tempoh] uid=${uid} -> ${tarikhTamatBaharu} (${gunaHari ? hariDiminta + " hari" : planBersih})`);
      return res.json({
        success: true,
        uid,
        plan: { key: plan.key, name: plan.name, days: plan.days },
        tarikh_tamat: tarikhTamatBaharu,
      });
    } catch (err) {
      console.error("[Admin Lanjutan Tempoh Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Legacy audio path compatibility middleware
  app.use((req, res, next) => {
    if (req.url) {
      const decoded = decodeURIComponent(req.url);
      if (decoded.startsWith('/AUDIO FONIK/')) {
        req.url = req.url.replace(/^\/AUDIO(%20| )FONIK\//i, '/audio/fonik/');
      } else if (decoded.startsWith('/AUDIO BACAAN BERGRED/')) {
        req.url = req.url.replace(/^\/AUDIO(%20| )BACAAN(%20| )BERGRED\//i, '/audio/bacaan-bergred/');
      } else if (decoded.startsWith('/AUDIO TAMBAH TOLAK/audio tambah/')) {
        req.url = req.url.replace(/^\/AUDIO(%20| )TAMBAH(%20| )TOLAK\/audio(%20| )tambah\//i, '/audio/tambah/');
      } else if (decoded.startsWith('/AUDIO TAMBAH TOLAK/audio tolak/')) {
        req.url = req.url.replace(/^\/AUDIO(%20| )TAMBAH(%20| )TOLAK\/audio(%20| )tolak\//i, '/audio/tolak/');
      }
    }
    next();
  });

  // Fail statik dalam public/ (audio, imej, fon, sw.js, app-logic.js) —
  // hanya untuk mod pembangunan. Vite menyalin public/ ke dist/ semasa build,
  // jadi dalam production kita hidangkan dist/ sahaja supaya fail lama dalam
  // public/ tidak menutup fail yang baharu dibina.
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "public")));
  }

  // Vite middleware untuk pembangunan sahaja.
  // Import dinamik: toolchain build tidak perlu dimuatkan dalam runtime
  // production, dan pelayan tetap hidup walaupun `vite` tiada di sana.
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      // Muatkan vite.config.ts supaya semua plugin (react, tailwind, alias)
      // digunakan — tanpa ini Vite scan semula dari scratch setiap request.
      configFile: path.join(__dirname, "vite.config.ts"),
      server: {
        middlewareMode: true,
        // Hormati tetapan HMR dari vite.config.ts (DISABLE_HMR)
        hmr: process.env.DISABLE_HMR !== "true",
        // Elak Vite memerhatikan node_modules — jimat CPU yang banyak
        watch: process.env.DISABLE_HMR === "true" ? null : {
          ignored: ["**/node_modules/**", "**/.git/**"],
          usePolling: false,
        },
      },
      appType: "spa",
      // Guna cache deps supaya Vite tidak re-bundle dependencies pada setiap restart
      cacheDir: path.join(__dirname, "node_modules/.vite"),
      optimizeDeps: {
        // Jangan paksa bundle semula jika deps tidak berubah
        force: false,
      },
    });
    app.use(vite.middlewares);
  } else {
    // Guna __dirname (bukan process.cwd()) supaya laluan betul tanpa mengira
    // dari direktori mana proses dimulakan.
    const distPath = path.join(__dirname, 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');

    // PENTING: index.html TIDAK boleh dicache. Ia mengandungi nama fail
    // bundle berhash yang berubah setiap deploy. Jika pelayar menyimpan
    // index.html lama, ia akan meminta bundle lama yang sudah tiada dan
    // halaman menjadi KOSONG.
    // Nota: JANGAN tetapkan Cache-Control secara global di sini — express.static
    // hanya menetapkan header cache jika ia belum wujud, jadi header global
    // akan mematikan caching immutable untuk /assets.
    const NO_STORE = 'no-cache, no-store, must-revalidate';

    // Aset berhash kekal selamanya — namanya berubah apabila kandungan berubah.
    // fallthrough dibiarkan lalai (true) supaya aset yang tiada jatuh ke
    // catch-all di bawah dan menerima 404 yang jelas, bukan HTML.
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        immutable: true,
        maxAge: '1y',
      }),
    );

    // Audio/imej/fon/model jarang berubah.
    for (const dir of ['audio', 'images', 'fonts', 'models']) {
      app.use(
        '/' + dir,
        express.static(path.join(distPath, dir), { maxAge: '7d' }),
      );
    }

    // sw.js TIDAK boleh dicache lama — jika tidak pelayar akan terus
    // menggunakan logik cache yang lama walaupun kita sudah menaik tarafnya.
    app.get('/sw.js', (req, res) => {
      res.setHeader('Cache-Control', NO_STORE);
      res.setHeader('Service-Worker-Allowed', '/');
      res.sendFile(path.join(distPath, 'sw.js'));
    });

    // Fail baki di akar dist/ (styles.css, app-logic.js, surih-logic.js,
    // surih-nombor-logic.js, manifest.json).
    //
    // PENTING: Fail-fail ini BUKAN berhash — namanya kekal sama walaupun
    // kandungannya berubah setiap deploy. Jika dicache lama, pembetulan
    // tidak akan sampai kepada pengguna sehingga mereka hard refresh.
    // Setiap satunya dihantar dengan no-cache supaya sentiasa segar.
    app.use(
      express.static(distPath, {
        index: false,
        etag: true,
        lastModified: true,
        setHeaders: (res) => {
          res.setHeader('Cache-Control', NO_STORE);
        },
      }),
    );

    // SPA fallback: hanya untuk laluan NAVIGASI (bukan aset, bukan /api).
    // Tanpa penapis ini, permintaan aset yang tiada akan menerima HTML dengan
    // status 200, lalu pelayar gagal menghurai JS dan paparan menjadi kosong.
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      if (/\.[a-z0-9]+$/i.test(req.path)) {
        return res.status(404).type('text/plain').send('404 Not Found');
      }
      return res.sendFile(indexHtmlPath, {
        headers: { 'Cache-Control': NO_STORE },
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
