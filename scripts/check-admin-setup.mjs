#!/usr/bin/env node
/**
 * Diagnostik persediaan mod admin.
 *
 * Menyemak sama ada .env sudah lengkap untuk mod admin BERFUNGSI:
 *   1. ADMIN_CODE               — kod rahsia untuk masuk mod admin
 *   2. FIREBASE_SERVICE_ACCOUNT — kredensial Admin SDK (JSON atau base64)
 *   3. FIREBASE_DATABASE_URL / FIREBASE_PROJECT_ID
 *   4. Firebase Admin SDK benar-benar boleh dimulakan & jana token.
 *
 * GUNA:  npm run check-admin
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env"), quiet: true });

let adaGagal = false;

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}
function gagal(msg, petua) {
  adaGagal = true;
  console.log(`  ❌ ${msg}`);
  if (petua) console.log(`     ↳ ${petua}`);
}
function maklumat(msg) {
  console.log(`  ℹ️  ${msg}`);
}

console.log("\n══════════════════════════════════════════════════════════");
console.log("  DIAGNOSTIK MOD ADMIN — Bunyi Kata");
console.log("══════════════════════════════════════════════════════════\n");

// ── 1. ADMIN_CODE ──────────────────────────────────────────────────────────
console.log("1️⃣  ADMIN_CODE (kod untuk masuk mod admin)");
const adminCode = (process.env.ADMIN_CODE || "").trim();
if (!adminCode) {
  gagal("ADMIN_CODE tiada dalam .env", 'Tambah:  ADMIN_CODE="KOD-RAHSIA-PANJANG-ANDA"');
} else if (/TUKAR|ISI_|CHANGE|XXXX/i.test(adminCode)) {
  gagal(
    `ADMIN_CODE masih placeholder: "${adminCode}"`,
    "Tukar kepada kod rahsia sebenar yang panjang & sukar diteka.",
  );
} else if (adminCode.length < 10) {
  gagal(
    `ADMIN_CODE terlalu pendek (${adminCode.length} aksara)`,
    "Guna sekurang-kurangnya 16 aksara supaya sukar diteka.",
  );
} else {
  ok(`ADMIN_CODE ditetapkan (${adminCode.length} aksara)`);
  maklumat(`Kod awak: "${adminCode}"  ← taip ini di skrin masuk`);
}

// ── 2. FIREBASE_SERVICE_ACCOUNT ────────────────────────────────────────────
console.log("\n2️⃣  FIREBASE_SERVICE_ACCOUNT (kredensial Admin SDK)");
const rawSA = (process.env.FIREBASE_SERVICE_ACCOUNT || "").trim();
let saSah = false;
let saProjek = null;

if (!rawSA) {
  gagal(
    "FIREBASE_SERVICE_ACCOUNT tiada dalam .env",
    "Lihat blok 'FIREBASE ADMIN SDK' dalam .env untuk arahan.",
  );
} else if (rawSA.includes("ISI_BASE64") || rawSA.includes("GANTIKAN_DENGAN")) {
  gagal(
    "FIREBASE_SERVICE_ACCOUNT masih placeholder",
    'Jalankan:  npm run encode-sa "<laluan-fail-json>"',
  );
} else {
  try {
    const json = rawSA.startsWith("{")
      ? JSON.parse(rawSA)
      : JSON.parse(Buffer.from(rawSA, "base64").toString("utf8"));
    const format = rawSA.startsWith("{") ? "JSON mentah" : "base64";
    if (json.type === "service_account" && json.private_key) {
      saSah = true;
      saProjek = json.project_id;
      ok(`Service account sah (format ${format})`);
      maklumat(`Projek: ${json.project_id}`);
      maklumat(`Akaun : ${json.client_email}`);
    } else {
      gagal("JSON sah tetapi bukan service account yang lengkap");
    }
  } catch (err) {
    gagal(`Tidak dapat menghurai: ${err.message}`);
  }
}

// ── 3. DATABASE URL / PROJECT ID ───────────────────────────────────────────
console.log("\n3️⃣  FIREBASE_DATABASE_URL / FIREBASE_PROJECT_ID");
const dbUrl =
  process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
const projId =
  process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

if (dbUrl) ok(`DATABASE_URL = ${dbUrl}`);
else gagal("DATABASE_URL tiada", "Tambah FIREBASE_DATABASE_URL=...");

if (projId) ok(`PROJECT_ID   = ${projId}`);
else gagal("PROJECT_ID tiada", "Tambah FIREBASE_PROJECT_ID=...");

if (saProjek && projId && saProjek !== projId) {
  gagal(`Projek TIDAK sepadan: service account "${saProjek}" vs env "${projId}"`);
}

// ── 4. Ujian hidup Admin SDK ───────────────────────────────────────────────
console.log("\n4️⃣  Ujian hidup Firebase Admin SDK");
if (saSah) {
  try {
    const { initializeApp, cert } = await import("firebase-admin/app");
    const json = rawSA.startsWith("{")
      ? JSON.parse(rawSA)
      : JSON.parse(Buffer.from(rawSA, "base64").toString("utf8"));
    if (json.private_key) json.private_key = json.private_key.replace(/\\n/g, "\n");

    const app = initializeApp({ credential: cert(json), databaseURL: dbUrl });
    const { getAuth } = await import("firebase-admin/auth");
    const { getDatabase } = await import("firebase-admin/database");

    // Baca RTDB — bukti kredensial & URL betul.
    await getDatabase(app).ref(".info/connected").once("value");
    ok("Boleh sambung ke Realtime Database");

    // Jana custom token — bukti createCustomToken berfungsi.
    const token = await getAuth(app).createCustomToken(
      process.env.ADMIN_UID || "bunyikata-admin",
      { admin: true, peranan: "admin" },
    );
    if (token && token.length > 20) ok("Boleh jana custom token admin");
    else gagal("Custom token janggal — semak kredensial");
  } catch (err) {
    gagal(`Admin SDK gagal: ${err.message}`, "Semak service account & URL RTDB.");
  }
} else {
  maklumat("Dilangkau — lengkapkan langkah 2 dahulu.");
}

// ── Kesimpulan ─────────────────────────────────────────────────────────────
console.log("\n══════════════════════════════════════════════════════════");
if (adaGagal) {
  console.log("  ⚠️  BELUM SIAP — betulkan perkara ❌ di atas, kemudian jalankan");
  console.log("      semula:  npm run check-admin");
} else {
  console.log("  🎉 SEMUA OK! Mod admin sudah bersedia.");
  console.log("      Jalankan:  npm run dev");
  console.log(`      Masuk mod admin dengan kod: ${adminCode}`);
}
console.log("══════════════════════════════════════════════════════════\n");

process.exit(adaGagal ? 1 : 0);
