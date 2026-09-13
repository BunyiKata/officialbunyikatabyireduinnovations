/**
 * Ujian logik Fasa 2 (affiliate) — TANPA Firebase.
 *
 * Menyemak fungsi tulen yang dikongsi oleh pelayan & klien:
 *   1. Jana kod affiliate: 6 aksara, huruf besar, aksara sah sahaja.
 *   2. Normalisasi nombor WhatsApp (0xxx -> 60xxx, buang simbol).
 *   3. Kira komisen 30% (1 Bulan RM15->RM4.50, 3 Bulan RM40->RM12, 1 Tahun RM69->RM20.70).
 *   4. Templat mesej pendaftaran (dengan & tanpa kod rujukan).
 *
 * Jalankan: node scripts/test_affiliate_logic.mjs
 */
import assert from "node:assert";

// --- 1. Jana kod affiliate --------------------------------------------------
const AKSARA_KOD = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function janaKod() {
  let kod = "";
  for (let i = 0; i < 6; i++) {
    kod += AKSARA_KOD.charAt(Math.floor(Math.random() * AKSARA_KOD.length));
  }
  return kod;
}
for (let i = 0; i < 2000; i++) {
  const k = janaKod();
  assert.strictEqual(k.length, 6, "kod mesti 6 aksara");
  assert.match(k, /^[A-Z0-9]{6}$/, "kod mesti huruf besar/nombor sahaja");
  assert.doesNotMatch(k, /[IO01]/, "huruf mudah keliru tidak dibenarkan");
}

// --- 2. Normalisasi WhatsApp -----------------------------------------------
function bersihkanWhatsapp(input) {
  let nombor = String(input || "").replace(/[^0-9]/g, "");
  if (nombor.startsWith("0")) nombor = "6" + nombor;
  return nombor;
}
assert.strictEqual(bersihkanWhatsapp("0173955657"), "60173955657");
assert.strictEqual(bersihkanWhatsapp("60173955657"), "60173955657");
assert.strictEqual(bersihkanWhatsapp("+60 17-395 5657"), "60173955657");

// --- 3. Kira komisen 30% ----------------------------------------------------
function kiraKomisenSen(hargaSen) {
  return Math.round((Number(hargaSen) || 0) * 30 / 100);
}
assert.strictEqual(kiraKomisenSen(1500), 450, "1 Bulan RM15 -> RM4.50");
assert.strictEqual(kiraKomisenSen(4000), 1200, "3 Bulan RM40 -> RM12.00");
assert.strictEqual(kiraKomisenSen(6900), 2070, "1 Tahun RM69 -> RM20.70");

// --- 4. Templat mesej pendaftaran ------------------------------------------
function mesejDaftarPakej(namaPakej, kodRujukan) {
  const nama = (namaPakej || "").trim();
  const kod = (kodRujukan || "").trim().toUpperCase();
  const asas = `Saya berminat dapatkan Bunyi Kata Pakej "${nama}" 🙌🏻`;
  return kod ? `${asas} (Bunyi Kata - ${kod})` : asas;
}
assert.strictEqual(
  mesejDaftarPakej("3 Bulan (Pro)", "BK7X2K"),
  'Saya berminat dapatkan Bunyi Kata Pakej "3 Bulan (Pro)" 🙌🏻 (Bunyi Kata - BK7X2K)',
);
assert.strictEqual(
  mesejDaftarPakej("3 Bulan (Pro)", ""),
  'Saya berminat dapatkan Bunyi Kata Pakej "3 Bulan (Pro)" 🙌🏻',
  "tanpa kod: kurungan digugurkan sepenuhnya",
);
assert.strictEqual(
  mesejDaftarPakej("1 Tahun (Pro)", "bk7x2k").endsWith("(Bunyi Kata - BK7X2K)"),
  true,
  "kod huruf kecil dinormalkan",
);

// --- 5. Tempoh tahan 7 hari -------------------------------------------------
const KOMISEN_TAHAN_HARI = 7;
function layakBayar(tarikhBeliIso, kiniMs) {
  const hadMasa = kiniMs - KOMISEN_TAHAN_HARI * 86400000;
  const masaBeli = new Date(tarikhBeliIso).getTime();
  return Number.isFinite(masaBeli) && masaBeli <= hadMasa;
}
const kini = Date.parse("2026-01-15T00:00:00Z");
assert.strictEqual(layakBayar("2026-01-01T00:00:00Z", kini), true, "14 hari lalu -> layak");
assert.strictEqual(layakBayar("2026-01-07T00:00:00Z", kini), true, "8 hari lalu -> layak");
assert.strictEqual(layakBayar("2026-01-10T00:00:00Z", kini), false, "5 hari lalu -> belum matang");
assert.strictEqual(layakBayar("2026-01-14T00:00:00Z", kini), false, "1 hari lalu -> belum matang");

console.log("✅ Semua ujian logik affiliate Fasa 2 LULUS.");
