import express from "express";
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
 * Firebase Admin SDK â€” dimulakan secara "lazy" supaya pelayan masih boleh
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
    // blok catch di bawah, yang menetapkan adminInitError SECARA KEKAL â€” jadi
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

      // Kesan nilai placeholder daripada .env.example â€” beri mesej jelas
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
 * Format: BunyiKata#<4 digit> â€” mudah dibaca melalui telefon, masih ada
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Harga rasmi setiap pakej dalam sen. Harga MESTI ditentukan di pelayan;
// jangan sesekali percaya harga yang dihantar dari pelayar.
const PLAN_CATALOG = {
  "1bulan": { name: "1 Bulan (Pro)", priceCents: 1500, days: 30 },
  "3bulan": { name: "3 Bulan (Pro)", priceCents: 4000, days: 90 },
  "1tahun": { name: "1 Tahun (Pro)", priceCents: 6900, days: 365 },
};

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

async function startServer() {
  const app = express();
  // App Hosting / Cloud Run menyuntik PORT melalui persekitaran. Mesti dipatuhi,
  // jika tidak health check akan gagal dan rollout ditolak.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  /**
   * Pengesahan kod admin.
   *
   * Kod admin disimpan HANYA dalam process.env.ADMIN_CODE di pelayan, jadi ia
   * tidak pernah masuk ke dalam bundle JavaScript pelayar. Jika kod betul,
   * pelayan memulangkan Firebase custom token dengan claim { admin: true }.
   * Klien kemudian signInWithCustomToken() supaya auth != null dan peraturan
   * pangkalan data boleh mempercayai token tersebut.
   */
  app.post("/api/admin/verify", async (req, res) => {
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
   * Kata laluan TIDAK PERNAH disimpan dalam pangkalan data â€” ia hanya
   * dipulangkan sekali kepada admin untuk dihantar kepada pengguna.
   */
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
      } = req.body || {};

      const namaBersih = String(nama).trim();
      const emailBersih = String(email).trim().toLowerCase();
      const perananBersih = String(peranan).trim().toLowerCase();
      const planBersih = String(planKey).trim();

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
        // auth/user-not-found bermakna emel bebas â€” inilah keadaan yang kita mahu.
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
        // Medan khusus mengikut peranan â€” simpan hanya yang berkaitan.
        nama_sekolah: perananBersih === "guru" ? String(nama_sekolah).trim() : "",
        nama_keluarga: perananBersih === "ibubapa" ? String(nama_keluarga).trim() : "",
        langganan: plan.name,
        pakej: planBersih,
        tarikh_mula: tarikhMula,
        tarikh_tamat: tarikhTamat,
        dicipta_oleh: "admin",
        sumber: "admin",
        // Disediakan untuk fasa affiliate akan datang â€” sengaja dibiarkan kosong.
        referred_by: "",
        tarikh_dicipta: tarikhMula,
      };

      const db = getDatabase(appInstance);
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
        direkod_oleh: "admin",
        tarikh: tarikhMula,
      });

      console.log(`[Admin Cipta Akaun] Akaun dicipta: ${emailBersih} (${uid}) pakej=${planBersih}`);

      // Kata laluan dipulangkan SEKALI sahaja â€” tidak disimpan di mana-mana.
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

  // Fail statik dalam public/ (audio, imej, fon, sw.js, app-logic.js) â€”
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
      server: { middlewareMode: true },
      appType: "spa",
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
    // Nota: JANGAN tetapkan Cache-Control secara global di sini â€” express.static
    // hanya menetapkan header cache jika ia belum wujud, jadi header global
    // akan mematikan caching immutable untuk /assets.
    const NO_STORE = 'no-cache, no-store, must-revalidate';

    // Aset berhash kekal selamanya â€” namanya berubah apabila kandungan berubah.
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

    // sw.js TIDAK boleh dicache lama â€” jika tidak pelayar akan terus
    // menggunakan logik cache yang lama walaupun kita sudah menaik tarafnya.
    app.get('/sw.js', (req, res) => {
      res.setHeader('Cache-Control', NO_STORE);
      res.setHeader('Service-Worker-Allowed', '/');
      res.sendFile(path.join(distPath, 'sw.js'));
    });

    // Fail baki di akar dist/ (styles.css, app-logic.js, surih-logic.js,
    // surih-nombor-logic.js, manifest.json).
    //
    // PENTING: Fail-fail ini BUKAN berhash â€” namanya kekal sama walaupun
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
