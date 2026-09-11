// Ujian PENTING: kod admin yang BETUL mesti memulangkan custom token.
// Ini membuktikan createCustomToken() (yang perlukan IAM signBlob) berfungsi.
const BASE = "https://bunyikata--bunyi-kata-official.asia-southeast1.hosted.app";
const KOD = process.argv[2];

if (!KOD) {
  console.error("Guna: node scripts/test_admin_login.mjs <KOD>");
  process.exit(1);
}

const res = await fetch(BASE + "/api/admin/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ kod: KOD }),
});
const json = await res.json().catch(() => ({}));

console.log("status  = " + res.status);
console.log("success = " + json.success);
console.log("uid     = " + (json.uid || "-"));
console.log("token   = " + (json.token ? "ADA (" + json.token.length + " aksara)" : "TIADA"));
console.log("mesej   = " + (json.message || "-"));
console.log("");

if (res.status === 200 && json.success === true && json.token) {
  console.log("LULUS: login admin berfungsi sepenuhnya di App Hosting.");
} else if (res.status === 500) {
  console.log("GAGAL 500: kemungkinan besar SA tidak boleh menandatangani token.");
} else {
  console.log("GAGAL: periksa nilai ADMIN_CODE.");
}
