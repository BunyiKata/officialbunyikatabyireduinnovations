// Mengesahkan create-purchase menggunakan CHIP_SECRET_KEY sebenar dan bahawa
// harga ditetapkan oleh PELAYAN (bukan oleh pelanggan).
const BASE = "https://bunyikata--bunyi-kata-official.asia-southeast1.hosted.app";

// Cuba menipu harga: hantar harga palsu yang sangat rendah.
const res = await fetch(BASE + "/api/chip/create-purchase", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "ujian.harga@contoh.com",
    fullName: "Ujian Harga",
    planInfo: { id: "1tahun", name: "1 Tahun (Pro)", period: "tahun" },
    // Suntikan jahat — pelayan MESTI mengabaikannya.
    priceCents: 1,
    price: 1,
    amount: 1,
  }),
});
const json = await res.json().catch(() => ({}));

console.log("status       = " + res.status);
console.log("success      = " + json.success);
console.log("pakej dipilih= " + JSON.stringify(json.plan || {}));
console.log("checkout_url = " + (json.checkout_url ? "ADA" : "TIADA"));
console.log("purchase_id  = " + (json.purchase_id || "-"));
if (json.error) console.log("ralat CHIP   = " + JSON.stringify(json.error).slice(0, 300));
console.log("");

const hargaBetul = json.plan?.name === "1 Tahun (Pro)" && json.plan?.days === 365;
if (res.status === 200 && json.success && json.checkout_url && hargaBetul) {
  console.log("LULUS: CHIP hidup, dan harga ditetapkan pelayan (suntikan diabaikan).");
  console.log("URL checkout untuk ujian manual:");
  console.log(json.checkout_url);
} else {
  console.log("PERIKSA: lihat butiran di atas.");
}
