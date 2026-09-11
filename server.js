import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import crypto from "crypto";
// firebase-admin v14 hanya menyediakan API modular. Import lalai `admin`
// tidak lagi mendedahkan .apps/.auth/.credential, jadi kita import terus.
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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
        redirectOrigin || req.headers.origin || "https://bunyi-kata-official.web.app";
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

  // Serve static files from public directory directly (handles audio, images, fonts)
  app.use(express.static(path.join(__dirname, 'public')));

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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
