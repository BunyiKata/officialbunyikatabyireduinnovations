#!/usr/bin/env node
/**
 * Sandaran (backup) Realtime Database — Bunyi Kata
 * =================================================
 *
 * Skrip ini memuat turun SELURUH kandungan Realtime Database ke satu fail
 * JSON bertarikh di dalam folder `backups/`. Ia berguna sebagai "cermin"
 * keselamatan sekiranya data terpadam atau rosak secara tidak sengaja.
 *
 * GUNA:
 *   node scripts/backup-rtdb.mjs
 *
 * Ia akan menggunakan kredensial yang SAMA seperti server.js:
 *   1. FIREBASE_SERVICE_ACCOUNT (JSON mentah ATAU base64) dari .env — cara biasa.
 *   2. Application Default Credentials (ADC) — jika dijalankan di Cloud.
 *
 * Hasil:
 *   backups/bunyi-kata-YYYY-MM-DD-HHmmss.json
 *
 * Nota: folder `backups/` sudah disenaraikan dalam .gitignore, jadi fail
 * sandaran TIDAK akan ter-commit ke Git.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

dotenv.config();

// ── Bina aplikasi Admin (tiru logik server.js) ──────────────────────────────
function initAdminApp() {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const databaseURL =
    process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;

  if (rawServiceAccount) {
    const trimmed = rawServiceAccount.trim();

    if (
      trimmed.includes("ISI_BASE64") ||
      trimmed.includes("GANTIKAN_DENGAN") ||
      trimmed.startsWith("ISI_")
    ) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT masih nilai placeholder. Isi dengan service account sebenar.",
      );
    }

    let parsed;
    if (trimmed.startsWith("{")) {
      parsed = JSON.parse(trimmed);
    } else {
      parsed = JSON.parse(Buffer.from(trimmed, "base64").toString("utf8"));
    }
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }

    return initializeApp({ credential: cert(parsed), databaseURL });
  }

  // ADC (App Hosting / Cloud Run)
  return initializeApp({
    credential: applicationDefault(),
    projectId,
    databaseURL,
  });
}

// ── Bantuan masa ────────────────────────────────────────────────────────────
function capMasaFail() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

function saizManusia(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Utama ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔄 Memulakan sandaran Realtime Database…\n");

  const app = initAdminApp();
  const db = getDatabase(app);

  console.log("⬇️  Memuat turun data…");
  const snapshot = await db.ref("/").get();
  const data = snapshot.val();

  if (data === null || data === undefined) {
    console.warn("⚠️  Pangkalan data kosong. Tiada apa untuk disandarkan.");
  }

  const dirBackup = path.resolve("backups");
  fs.mkdirSync(dirBackup, { recursive: true });

  const namaFail = `bunyi-kata-${capMasaFail()}.json`;
  const laluanFail = path.join(dirBackup, namaFail);

  fs.writeFileSync(laluanFail, JSON.stringify(data, null, 2), "utf8");

  const stat = fs.statSync(laluanFail);
  const bilanganRoot = data && typeof data === "object" ? Object.keys(data).length : 0;

  console.log("\n" + "─".repeat(70));
  console.log("✅ Sandaran BERJAYA!");
  console.log("─".repeat(70));
  console.log(`📁 Fail       : ${laluanFail}`);
  console.log(`📦 Saiz       : ${saizManusia(stat.size)}`);
  console.log(`🌳 Nod utama  : ${bilanganRoot}${bilanganRoot ? " (" + Object.keys(data).join(", ") + ")" : ""}`);
  console.log("─".repeat(70));
  console.log("\nSimpan fail ini di tempat yang selamat (cth. pemacu luaran / awan).\n");
}

main().catch((err) => {
  console.error("\n❌ Sandaran GAGAL:", err.message);
  console.error(
    "\nPetua: pastikan .env mengandungi FIREBASE_SERVICE_ACCOUNT dan " +
      "FIREBASE_DATABASE_URL yang sah.\n",
  );
  process.exit(1);
});
