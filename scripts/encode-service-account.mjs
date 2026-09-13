#!/usr/bin/env node
/**
 * Alat bantu: tukar fail service account JSON (Firebase Admin SDK) kepada
 * base64 satu baris untuk ditempel ke FIREBASE_SERVICE_ACCOUNT dalam .env.
 *
 * GUNA:
 *   node scripts/encode-service-account.mjs "C:\Users\User\Downloads\bunyi-kata-official-firebase-adminsdk-xxxxx.json"
 *
 * Hasilnya akan dipaparkan di skrin DAN disalin ke clipboard.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("\n❌ Tiada laluan fail diberi.\n");
  console.error("GUNA:");
  console.error(
    '  node scripts/encode-service-account.mjs "<laluan-ke-fail-service-account.json>"\n',
  );
  process.exit(1);
}

const resolved = path.resolve(inputPath.replace(/^"|"$/g, ""));

if (!fs.existsSync(resolved)) {
  console.error(`\n❌ Fail tidak dijumpai: ${resolved}\n`);
  process.exit(1);
}

let json;
try {
  json = JSON.parse(fs.readFileSync(resolved, "utf8"));
} catch (err) {
  console.error(`\n❌ Fail itu bukan JSON yang sah: ${err.message}\n`);
  process.exit(1);
}

// Sahkan ia benar-benar service account (bukan fail lain).
const wajib = ["type", "project_id", "private_key", "client_email"];
const hilang = wajib.filter((k) => !json[k]);
if (hilang.length > 0) {
  console.error(
    `\n❌ Fail ini tidak lengkap. Medan tiada: ${hilang.join(", ")}\n` +
      "   Pastikan anda memuat turun dari: Firebase Console > Project settings >\n" +
      "   Service accounts > Generate new private key\n",
  );
  process.exit(1);
}

if (json.type !== "service_account") {
  console.error(`\n❌ Jenis tidak sah: "${json.type}" (sepatutnya "service_account").\n`);
  process.exit(1);
}

const base64 = Buffer.from(JSON.stringify(json)).toString("base64");

// Cuba salin ke clipboard (Windows).
try {
  execSync("clip", { input: base64 });
  console.log("\n✅ Base64 telah disalin ke clipboard!");
} catch {
  console.log("\n⚠️  Tidak dapat menyalin ke clipboard — salin manual dari bawah.");
}

console.log("\n" + "─".repeat(70));
console.log(`📁 Fail   : ${path.basename(resolved)}`);
console.log(`🏷️  Projek : ${json.project_id}`);
console.log(`📧 Akaun  : ${json.client_email}`);
console.log(`📏 Panjang: ${base64.length} aksara`);
console.log("─".repeat(70));
console.log("\n➡️  Tampal ini selepas FIREBASE_SERVICE_ACCOUNT= dalam .env :\n");
console.log(base64 + "\n");
console.log("─".repeat(70));
console.log("\nSelepas tampal, jalankan:  npm run dev\n");
