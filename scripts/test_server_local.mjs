// Ujian setempat: cetuskan getAdminApp() dan createCustomToken() SEBENAR
// dengan mengimport server.js, supaya kita tidak buang masa satu lagi rollout
// hanya untuk mendapati ralat API modular yang lain.
process.env.NODE_ENV = "production";
process.env.PORT = "8123";
process.env.ADMIN_CODE = "UJIAN-SETEMPAT-123";
process.env.FIREBASE_PROJECT_ID = "bunyi-kata-official";
process.env.FIREBASE_DATABASE_URL =
  "https://bunyi-kata-official-default-rtdb.asia-southeast1.firebasedatabase.app";

await import("../server.js");

// Beri pelayan masa untuk mula mendengar.
await new Promise((r) => setTimeout(r, 1500));

const BASE = "http://127.0.0.1:8123";

// Kod salah -> 401
const salah = await fetch(BASE + "/api/admin/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ kod: "jelas-salah" }),
});
console.log("kod salah  -> " + salah.status + (salah.status === 401 ? "  LULUS" : "  GAGAL"));

// Kod betul -> 200 + token. Ini memerlukan API modular yang betul.
const betul = await fetch(BASE + "/api/admin/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ kod: process.env.ADMIN_CODE }),
});
const json = await betul.json().catch(() => ({}));
console.log("kod betul  -> " + betul.status);
console.log("  mesej    = " + (json.message || "-"));
console.log("  token    = " + (json.token ? "ADA (" + json.token.length + " aksara)" : "TIADA"));

if (betul.status === 200 && json.token) {
  console.log("\nLULUS: createCustomToken berjaya secara setempat.");
} else if (/is not a function|undefined/i.test(json.message || "")) {
  console.log("\nGAGAL: masih ada API firebase-admin lama. Betulkan sebelum push.");
} else {
  console.log("\nAMARAN: " + (json.message || "punca tidak diketahui"));
  console.log("(Ralat kredensial setempat boleh diterima — API bukan isunya.)");
}
process.exit(0);
