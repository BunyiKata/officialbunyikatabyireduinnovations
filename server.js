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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHIP_API_BASE = "https://gate.chip-in.asia/api/v1";

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

function getChipCredentials() {
  const secretKey = process.env.CHIP_SECRET_KEY;
  const brandId = process.env.CHIP_BRAND_ID;
  if (!secretKey || !brandId) return { ok: false };
  return { ok: true, secretKey, brandId };
}

function normalizePublicKey(key) {
  if (!key) return "";
  const trimmed = key.trim().replace(/\\n/g, "\n");
  if (trimmed.includes("BEGIN")) return trimmed;
  return `-----BEGIN PUBLIC KEY-----\n${trimmed}\n-----END PUBLIC KEY-----`;
}

/**
 * Mengesahkan tandatangan callback/webhook CHIP.
 * CHIP menandatangani RAW body: base64 RSA PKCS#1 v1.5 bagi digest SHA256.
 */
function verifyChipSignature(rawBody, signatureBase64, publicKeyPem) {
  if (!rawBody || !signatureBase64 || !publicKeyPem) return false;
  try {
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(rawBody);
    verifier.end();
    return verifier.verify(publicKeyPem, Buffer.from(signatureBase64, "base64"));
  } catch (err) {
    console.error("[Chip] Ralat pengesahan tandatangan:", err.message);
    return false;
  }
}

async function startServer() {
  const app = express();
  // App Hosting / Cloud Run menyuntik PORT melalui persekitaran. Mesti dipatuhi,
  // jika tidak health check akan gagal dan rollout ditolak.
  const PORT = Number(process.env.PORT) || 3000;

  // Webhook CHIP perlukan RAW body untuk pengesahan tandatangan,
  // jadi ia MESTI didaftarkan sebelum express.json().
  app.post("/api/chip/webhook", express.raw({ type: "*/*" }), (req, res) => {
    const publicKey = normalizePublicKey(process.env.CHIP_WEBHOOK_PUBLIC_KEY);
    if (!publicKey) {
      console.error("[Chip Webhook] CHIP_WEBHOOK_PUBLIC_KEY belum ditetapkan.");
      return res.status(500).json({ success: false, message: "Webhook belum dikonfigurasikan." });
    }

    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    if (!verifyChipSignature(rawBody, req.get("X-Signature"), publicKey)) {
      console.warn("[Chip Webhook] Tandatangan tidak sah — callback ditolak.");
      return res.status(401).json({ success: false, message: "Tandatangan tidak sah." });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      return res.status(400).json({ success: false, message: "Payload bukan JSON sah." });
    }

    console.log(
      `[Chip Webhook] Disahkan: event=${payload?.event_type} id=${payload?.id} status=${payload?.status}`,
    );

    // Balas 200 supaya CHIP tidak menghantar berulang kali.
    return res.status(200).json({ success: true });
  });

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
   * Kata laluan TIDAK PERNAH disimpan dalam pangkalan data — ia hanya
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
        // Disediakan untuk fasa affiliate akan datang — sengaja dibiarkan kosong.
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
      await getAuth(appInstance).updateUser(uid, { password: kataLaluan });

      console.log(`[Admin Reset Kata Laluan] Kata laluan direset untuk uid=${uid}`);
      return res.json({ success: true, uid, password: kataLaluan });
    } catch (err) {
      console.error("[Admin Reset Kata Laluan Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Panjangkan tempoh langganan pengguna.
   * Tempoh baharu dikira dari tarikh tamat SEDIA ADA (bukan dari hari ini),
   * supaya admin boleh menambah masa tanpa merugikan baki yang belum habis.
   */
  app.post("/api/admin/extend-expiry", requireAdmin, async (req, res) => {
    try {
      const appInstance = getAdminApp();
      if (!appInstance) {
        return res.status(500).json({ success: false, message: "Firebase Admin SDK belum dikonfigurasikan." });
      }

      const uid = String(req.body?.uid || "").trim();
      const planBersih = String(req.body?.planKey || "").trim();
      if (!uid) {
        return res.status(400).json({ success: false, message: "UID diperlukan." });
      }
      if (!PLAN_CATALOG[planBersih]) {
        return res.status(400).json({ success: false, message: "Pakej tidak sah." });
      }

      const db = getDatabase(appInstance);
      const profilSnap = await db.ref(`profiles/${uid}`).get();
      if (!profilSnap.exists()) {
        return res.status(404).json({ success: false, message: "Profil tidak dijumpai." });
      }
      const profil = profilSnap.val() || {};

      // Lanjut dari tarikh tamat lama; jika tiada/tidak sah, mula dari sekarang.
      const tarikhTamatLama = profil.tarikh_tamat || "";
      const rujukan =
        tarikhTamatLama && new Date(tarikhTamatLama).getTime() > Date.now()
          ? tarikhTamatLama // masih aktif → sambung dari tarikh itu
          : new Date().toISOString(); // sudah tamat → mula semula dari sekarang

      const plan = PLAN_CATALOG[planBersih];
      const tarikhTamatBaharu = kiraTarikhTamat(plan.days, rujukan);

      await db.ref(`profiles/${uid}`).update({
        langganan: plan.name,
        pakej: planBersih,
        tarikh_tamat: tarikhTamatBaharu,
      });

      await db.ref("orders").push({
        uid,
        nama: profil.nama || "",
        emel: profil.email || profil.emel || "",
        peranan: profil.peranan || "",
        pakej: planBersih,
        nama_pakej: plan.name,
        harga_sen: plan.priceCents,
        jumlah_hari: plan.days,
        status: "paid",
        kaedah: "manual",
        jenis: "panjang_tempoh",
        direkod_oleh: "admin",
        tarikh: new Date().toISOString(),
      });

      console.log(`[Admin Panjang Tempoh] uid=${uid} pakej=${planBersih} → ${tarikhTamatBaharu}`);
      return res.json({
        success: true,
        uid,
        plan: { key: planBersih, name: plan.name, days: plan.days },
        tarikh_tamat: tarikhTamatBaharu,
      });
    } catch (err) {
      console.error("[Admin Panjang Tempoh Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Menjana sesi pembelian CHIP. Semua rahsia kekal di pelayan.
  app.post("/api/chip/create-purchase", async (req, res) => {
    try {
      const creds = getChipCredentials();
      if (!creds.ok) {
        return res.status(500).json({
          success: false,
          message: "CHIP_SECRET_KEY / CHIP_BRAND_ID belum ditetapkan dalam .env pelayan.",
        });
      }

      const { email, name, fullName, planInfo, redirectOrigin } = req.body || {};
      const clientEmail = (email || "").trim().toLowerCase();
      if (!clientEmail) {
        return res.status(400).json({
          success: false,
          message: "Emel diperlukan untuk memproses pembayaran.",
        });
      }

      const planKey = resolvePlanKey(planInfo);
      const plan = PLAN_CATALOG[planKey];
      const origin =
        redirectOrigin || req.headers.origin || "https://bunyikata--bunyi-kata-official.asia-southeast1.hosted.app";
      const clientName =
        fullName ||
        name ||
        (planInfo?.category === "guru" ? "Guru Bunyi Kata" : "Keluarga Bunyi Kata");

      const purchasePayload = {
        client: { email: clientEmail, full_name: clientName },
        purchase: {
          currency: "MYR",
          products: [
            { name: `Bunyi Kata - ${plan.name}`, price: plan.priceCents, quantity: 1 },
          ],
        },
        brand_id: creds.brandId,
        reference: `bunyikata_${planKey}_${Date.now()}`,
        success_redirect: `${origin}/?payment=pending`,
        failure_redirect: `${origin}/?payment=failed`,
        cancel_redirect: `${origin}/?payment=cancelled`,
      };

      const chipResponse = await fetch(`${CHIP_API_BASE}/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${creds.secretKey}`,
        },
        body: JSON.stringify(purchasePayload),
      });

      const data = await chipResponse.json();
      if (!chipResponse.ok) {
        console.error("[Chip API Error]", data);
        return res.status(chipResponse.status).json({ success: false, error: data });
      }

      return res.json({
        success: true,
        checkout_url: data.checkout_url,
        purchase_id: data.id,
        plan: { key: planKey, name: plan.name, days: plan.days },
      });
    } catch (err) {
      console.error("[Chip API Exception]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * Sumber kebenaran tunggal bagi status pembayaran.
   * Klien TIDAK boleh mengaktifkan Pro sendiri; ia mesti bertanya di sini.
   */
  app.get("/api/chip/verify-purchase/:purchaseId", async (req, res) => {
    try {
      const creds = getChipCredentials();
      if (!creds.ok) {
        return res
          .status(500)
          .json({ success: false, paid: false, message: "CHIP belum dikonfigurasikan." });
      }

      const { purchaseId } = req.params;
      const chipRes = await fetch(
        `${CHIP_API_BASE}/purchases/${encodeURIComponent(purchaseId)}/`,
        { headers: { Authorization: `Bearer ${creds.secretKey}` } },
      );

      if (!chipRes.ok) {
        console.warn("[Chip Verify] Gagal mendapatkan purchase:", chipRes.status);
        return res.status(chipRes.status).json({
          success: false,
          paid: false,
          message: "Tidak dapat mengesahkan pembayaran dengan CHIP.",
        });
      }

      const purchase = await chipRes.json();
      const productName = purchase?.purchase?.products?.[0]?.name || "";
      const planKey = resolvePlanKey({ name: productName });
      const plan = PLAN_CATALOG[planKey];
      const paidAmount = Number(purchase?.purchase?.total ?? purchase?.payment?.amount ?? 0);
      const amountMatches = !paidAmount || paidAmount >= plan.priceCents;
      const isPaid = purchase?.status === "paid";

      if (!isPaid || !amountMatches) {
        return res.json({
          success: true,
          paid: false,
          status: purchase?.status || "unknown",
          message: amountMatches
            ? "Pembayaran belum selesai."
            : "Jumlah bayaran tidak sepadan dengan pakej.",
        });
      }

      // Emel diambil daripada CHIP, bukan daripada URL pelayar.
      return res.json({
        success: true,
        paid: true,
        status: purchase.status,
        email: purchase?.client?.email || "",
        purchase_id: purchase?.id,
        amount: paidAmount,
        currency: purchase?.purchase?.currency || "MYR",
        plan: { key: planKey, name: plan.name, days: plan.days },
      });
    } catch (err) {
      console.error("[Chip Verify Exception]", err);
      return res.status(500).json({ success: false, paid: false, message: err.message });
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
