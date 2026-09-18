// ============================================================================
// wangKritikal.test.ts — Ujian pelindung (guard tests) untuk laluan WANG & AUTH.
// ----------------------------------------------------------------------------
// Tujuan: mengunci kontrak kritikal supaya regresi pada laluan pembayaran,
// komisen dan pengesahan admin ditangkap SEBELUM ke produksi.
//
// Dua lapisan:
//   1. Logik tulen (matematik komisen, kelayakan, tarikh tamat) — diuji dengan
//      nilai yang dikira secara MANUAL.
//   2. Invarian sumber (server.js dibaca sebagai teks) — mengunci harga pakej,
//      kadar komisen 30%, middleware kebenaran, dan ketiadaan sisa model
//      "tempoh tahan komisen" yang telah dibuang (Konteks 3).
//
// Dijalankan: npm test
// ============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SERVER_SRC = fs.readFileSync(path.join(ROOT, "server.js"), "utf8");

// ---------------------------------------------------------------------------
// 1. Matematik komisen — 30% daripada harga, dibundarkan ke sen terdekat.
// ---------------------------------------------------------------------------
const KOMISEN_PERSEN = 30;
function kiraKomisenSen(hargaSen: number): number {
  return Math.round(((Number(hargaSen) || 0) * KOMISEN_PERSEN) / 100);
}

test("komisen 30%: harga pakej rasmi dikira tepat", () => {
  // RM15.00 -> RM4.50 ; RM40.00 -> RM12.00 ; RM69.00 -> RM20.70
  assert.equal(kiraKomisenSen(1500), 450, "1 Bulan RM15 -> RM4.50");
  assert.equal(kiraKomisenSen(4000), 1200, "3 Bulan RM40 -> RM12.00");
  assert.equal(kiraKomisenSen(6900), 2070, "1 Tahun RM69 -> RM20.70");
});

test("komisen 30%: pembundaran & input tidak sah selamat", () => {
  assert.equal(kiraKomisenSen(1), 0, "0.3 sen dibundarkan ke bawah -> 0");
  assert.equal(kiraKomisenSen(5), 2, "1.5 sen dibundarkan ke atas -> 2");
  assert.equal(kiraKomisenSen(0), 0);
  assert.equal(kiraKomisenSen(NaN), 0, "NaN -> 0, tidak merebak NaN");
  assert.equal(kiraKomisenSen(undefined as any), 0);
  assert.equal(kiraKomisenSen("1500" as any), 450, "rentetan angka diterima");
});

// ---------------------------------------------------------------------------
// 2. Kelayakan bayaran — baris bukan batal/dibayar LAYAK segera
//    (model tempoh tahan telah DIBUANG; tiada penangguhan automatik).
// ---------------------------------------------------------------------------
function adaLayakBayar(status: string): boolean {
  return status !== "batal" && status !== "dibayar";
}

test("kelayakan: pending & sah layak; batal & dibayar tidak", () => {
  assert.equal(adaLayakBayar("pending"), true);
  assert.equal(adaLayakBayar("sah"), true, "baris 'sah' lama dianggap layak");
  assert.equal(adaLayakBayar("batal"), false);
  assert.equal(adaLayakBayar("dibayar"), false);
});

// ---------------------------------------------------------------------------
// 3. Tarikh tamat langganan — tambah hari tepat, lindungi tarikh tidak sah.
// ---------------------------------------------------------------------------
function kiraTarikhTamat(days: number, dariISO?: string): string {
  const asas = dariISO ? new Date(dariISO) : new Date();
  const masaAsas = Number.isNaN(asas.getTime()) ? new Date() : asas;
  masaAsas.setDate(masaAsas.getDate() + days);
  return masaAsas.toISOString();
}

test("tarikh tamat: tambah hari dengan betul", () => {
  assert.equal(kiraTarikhTamat(30, "2026-01-01T00:00:00.000Z"), "2026-01-31T00:00:00.000Z");
  assert.equal(kiraTarikhTamat(1, "2024-02-28T00:00:00.000Z"), "2024-02-29T00:00:00.000Z");
  assert.equal(kiraTarikhTamat(1, "2023-02-28T00:00:00.000Z"), "2023-03-01T00:00:00.000Z");
});

test("tarikh tamat: input tidak sah jatuh balik ke sekarang, bukan Invalid Date", () => {
  const before = Date.now();
  const hasil = kiraTarikhTamat(1, "bukan-tarikh");
  const masa = new Date(hasil).getTime();
  assert.ok(Number.isFinite(masa), "hasil mesti tarikh sah");
  const dijangka = before + 24 * 60 * 60 * 1000;
  assert.ok(Math.abs(masa - dijangka) < 60_000, "kira-kira sehari dari sekarang");
});

// ---------------------------------------------------------------------------
// 4. Invarian sumber server.js — harga & kadar komisen TIDAK boleh menyimpang.
// ---------------------------------------------------------------------------
test("server.js: harga pakej rasmi terkunci (satu sumber harga)", () => {
  assert.match(SERVER_SRC, /"1bulan":\s*\{\s*name:\s*"1 Bulan \(Pro\)",\s*priceCents:\s*1500,\s*days:\s*30\s*\}/);
  assert.match(SERVER_SRC, /"3bulan":\s*\{\s*name:\s*"3 Bulan \(Pro\)",\s*priceCents:\s*4000,\s*days:\s*90\s*\}/);
  assert.match(SERVER_SRC, /"1tahun":\s*\{\s*name:\s*"1 Tahun \(Pro\)",\s*priceCents:\s*6900,\s*days:\s*365\s*\}/);
});

test("server.js: kadar komisen 30% terkunci", () => {
  assert.match(SERVER_SRC, /const KOMISEN_PERSEN = 30;/);
});

test("server.js: harga TIDAK diambil daripada body (jangan percaya pelayar)", () => {
  assert.match(SERVER_SRC, /komisenSen = kiraKomisenSen\(plan\.priceCents\)/);
});

// ---------------------------------------------------------------------------
// 5. Invarian keselamatan: middleware kebenaran melindungi endpoint wang.
// ---------------------------------------------------------------------------
test("server.js: setiap endpoint affiliate admin dilindungi requireAdmin", () => {
  const endpointWajib = [
    "/api/admin/audit",
    "/api/admin/affiliate/list",
    "/api/admin/affiliate/create",
    "/api/admin/affiliate/status",
    "/api/admin/affiliate/delete",
    "/api/admin/affiliate/payments",
    "/api/admin/affiliate/mark-paid",
    "/api/admin/affiliate/payment-record",
    "/api/admin/create-account",
    "/api/admin/reset-password",
    "/api/admin/extend-expiry",
  ];
  for (const ep of endpointWajib) {
    const re = new RegExp(
      `app\\.(get|post)\\(\\s*"${ep.replace(/[/]/g, "\\/")}"\\s*,\\s*requireAdmin`,
    );
    assert.match(SERVER_SRC, re, `endpoint ${ep} mesti guna requireAdmin`);
  }
});

test("server.js: endpoint affiliate pengguna dilindungi requireAffiliate", () => {
  assert.match(SERVER_SRC, /app\.get\(\s*"\/api\/affiliate\/me"\s*,\s*requireAffiliate/);
  assert.match(SERVER_SRC, /app\.get\(\s*"\/api\/affiliate\/referrals"\s*,\s*requireAffiliate/);
  assert.match(SERVER_SRC, /app\.get\(\s*"\/api\/affiliate\/payments"\s*,\s*requireAffiliate/);
});

test("server.js: kod affiliate daripada TOKEN, bukan body/query", () => {
  assert.match(SERVER_SRC, /req\.affiliateKod = kod;/);
  assert.match(SERVER_SRC, /decoded\.affiliate_kod/);
});

test("server.js: /api/admin/verify guna perbandingan masa-tetap", () => {
  assert.match(SERVER_SRC, /selamatSamaDengan\(/, "guna selamatSamaDengan (timing-safe)");
  assert.match(SERVER_SRC, /crypto\.timingSafeEqual/);
});

// ---------------------------------------------------------------------------
// 6. Invarian Konteks 3: model "tempoh tahan komisen" TIDAK boleh kembali.
// ---------------------------------------------------------------------------
test("tiada sisa model tempoh tahan komisen dalam kod aktif", () => {
  for (const [nama, corak] of [
    ["KOMISEN_TAHAN_HARI", /KOMISEN_TAHAN_HARI/],
    ["belum_matang", /belum_matang/],
    ["tempoh_tahan_hari", /tempoh_tahan_hari/],
    ["belumMatang", /belumMatang/],
  ] as const) {
    assert.doesNotMatch(SERVER_SRC, corak, `server.js tidak boleh ada ${nama}`);
  }
  const appLogic = fs.readFileSync(path.join(ROOT, "public", "app-logic.js"), "utf8");
  assert.doesNotMatch(appLogic, /belumMatang|tempoh_tahan/i);
});

test("komisen layak dibayar TANPA penangguhan masa (tiada tapisan tarikh_beli)", () => {
  assert.match(
    SERVER_SRC,
    /if\s*\(\s*r\.status === "batal" \|\| r\.status === "dibayar"\s*\)\s*return false;/,
  );
});
