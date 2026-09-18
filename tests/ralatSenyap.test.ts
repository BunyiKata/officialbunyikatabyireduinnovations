// ============================================================================
// ralatSenyap.test.ts — Ujian pelindung (guard tests) untuk Konteks 4 (baki).
// ----------------------------------------------------------------------------
// Tujuan: mengunci prinsip "tiada ralat ditelan senyap" pada laluan UI/aplikasi
// di dalam `src/`. Setakat ini SEMUA blok `catch` dalam `src` sama ada:
//   (a) memanggil console.warn/error dengan mesej berkonteks, atau
//   (b) mengendalikan ralat secara eksplisit (fallback/notify/setState/return).
// Ujian ini menghalang regresi (cth. menambah `catch {}` baharu tanpa log)
// daripada masuk ke produksi.
//
// Skop SENGAJA dihadkan kepada `src/**/*.ts(x)`:
//   - `public/app-logic.js` & `surih-logic.js` (warisan DOM) mengekalkan
//     `catch(e){}` senyap pada laluan audio/speech/AR yang memang best-effort.
//   - Jadi kita kunci hanya kod aplikasi React yang aktif dibangunkan.
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
const SRC = path.join(ROOT, "src");

// ---------------------------------------------------------------------------
// Pengumpul fail sumber (rekursif) untuk *.ts dan *.tsx.
// ---------------------------------------------------------------------------
function kumpulFailSumber(dir: string): string[] {
  const hasil: string[] = [];
  for (const entri of fs.readdirSync(dir, { withFileTypes: true })) {
    const penuh = path.join(dir, entri.name);
    if (entri.isDirectory()) {
      hasil.push(...kumpulFailSumber(penuh));
    } else if (/\.tsx?$/.test(entri.name)) {
      hasil.push(penuh);
    }
  }
  return hasil;
}

const failSumber = kumpulFailSumber(SRC);

// ---------------------------------------------------------------------------
// 1. Tiada blok `catch` KOSONG dalam kod aplikasi (src).
//    Merangkumi: catch {} , catch (e) {} , catch (e) { } , catch { } .
// ---------------------------------------------------------------------------
const CORAK_CATCH_KOSONG = /catch\s*(?:\([^)]*\))?\s*\{\s*\}/g;

test("src: tiada blok `catch` kosong (tiada ralat ditelan senyap)", () => {
  const pelanggar: string[] = [];
  for (const fail of failSumber) {
    const teks = fs.readFileSync(fail, "utf8");
    const padanan = teks.match(CORAK_CATCH_KOSONG);
    if (padanan) {
      pelanggar.push(`${path.relative(ROOT, fail)} (${padanan.length})`);
    }
  }
  assert.deepEqual(
    pelanggar,
    [],
    `Blok catch kosong dijumpai — tambah console.warn berkonteks:\n${pelanggar.join("\n")}`,
  );
});

// ---------------------------------------------------------------------------
// 2. Setiap `catch` bukan-kosong dalam src mesti merekod (console.warn/error)
//    ATAU mengendalikan ralat secara eksplisit: memulihkan/meneruskan aliran
//    (fallback, onEnd, resolve, throw, return, setState) atau memaklumkan
//    pengguna (notify/alert). Ini menghalang "catch lalu" yang menelan ralat
//    tanpa sebarang tindak balas.
// ---------------------------------------------------------------------------
test("src: setiap blok catch merekod amaran atau mengendalikan ralat", () => {
  // Cari setiap `catch` dan ambil kandungan blok ringkas selepasnya.
  const corakCatch = /catch\s*(?:\([^)]*\))?\s*\{([^{}]*)\}/g;
  const mencurigakan: string[] = [];

  // Kata kunci pengendalian/fallback yang sah (memulihkan aliran atau
  // memaklumkan pengguna) — bukan sekadar menelan ralat.
  const corakPengendali =
    /console\.(warn|error|log|info)|\b(throw|return|resolve|reject|notify|alert|onEnd|onError|speakFallback|fallback|set[A-Z]\w*)\b|=/;

  for (const fail of failSumber) {
    const teks = fs.readFileSync(fail, "utf8");
    // Buang komen supaya komen tidak menyelamatkan blok kosong.
    const teksTanpaKomen = teks.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    let m: RegExpExecArray | null;
    while ((m = corakCatch.exec(teksTanpaKomen)) !== null) {
      const isi = (m[1] || "").trim();
      if (isi.length === 0) continue; // ditangkap oleh ujian #1
      if (!corakPengendali.test(isi)) {
        const baris = teksTanpaKomen.slice(0, m.index).split("\n").length;
        mencurigakan.push(`${path.relative(ROOT, fail)}:${baris} -> { ${isi.slice(0, 60)} }`);
      }
    }
  }

  assert.deepEqual(
    mencurigakan,
    [],
    `Blok catch yang mungkin menelan ralat tanpa rekod/pengendalian:\n${mencurigakan.join("\n")}`,
  );
});
