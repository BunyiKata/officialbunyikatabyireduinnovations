// ============================================================================
// xssGuard.test.ts — Ujian pelindung (Fasa A.5)
// ----------------------------------------------------------------------------
// Mengunci supaya `dangerouslySetInnerHTML` TIDAK kembali dalam kod src/,
// serta mengesahkan util render selamat berkelakuan betul:
//   - renderIconHtml()  : menerima <img src="/images/..."> sah sahaja
//   - menolak  javascript:, data:, http(s):, <script>, onerror dsb.
//   - formatSukuKataTeksReact() : warna hitam/merah berselang-seli kekal sama
//
// Dijalankan: npm test
// ============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  renderIconHtml,
  uraiIkonImg,
  srcIkonSah,
  splitMalayWordSyllables,
  formatSukuKataTeksReact,
} from "../src/utils/renderIconHtml.tsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

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
// 1. GUARD: tiada `dangerouslySetInnerHTML` dalam mana-mana src/**/*.ts(x).
// ---------------------------------------------------------------------------
test("src: tiada `dangerouslySetInnerHTML` (XSS — guna render selamat)", () => {
  const pelanggar: string[] = [];
  for (const fail of failSumber) {
    const teks = fs.readFileSync(fail, "utf8");
    const padanan = teks.match(/dangerouslySetInnerHTML/g);
    if (padanan) {
      pelanggar.push(`${path.relative(ROOT, fail)} (${padanan.length})`);
    }
  }
  assert.deepEqual(
    pelanggar,
    [],
    `dangerouslySetInnerHTML dijumpai — guna renderIconHtml()/formatSukuKataTeksReact():\n${pelanggar.join("\n")}`,
  );
});

// ---------------------------------------------------------------------------
// 2. renderIconHtml: menerima format <img> statik sebenar (4 variasi).
// ---------------------------------------------------------------------------
test("renderIconHtml: terima <img> /images/ sah (petikan berganda & tunggal)", () => {
  const sah = [
    '<img src="/images/sukukata/bas.png" class="sk-icon-img" alt="bas"/>',
    '<img src="/images/sukukata/cermin.png" class="sk-icon-img" alt="cermin"/>',
    "<img src='/images/a.png' alt='a'/>",
    '<img alt="b" src="/images/sub/b.jpg">',
  ];
  for (const html of sah) {
    const diurai = uraiIkonImg(html);
    assert.ok(diurai, `patut terima: ${html}`);
    assert.ok(diurai!.src.startsWith("/images/"));
    const elemen: any = renderIconHtml(html, { maxHeight: 110 });
    assert.ok(elemen, `patut render: ${html}`);
    assert.equal(elemen.type, "img");
    assert.equal(elemen.props.src, diurai!.src);
  }
});

// ---------------------------------------------------------------------------
// 3. renderIconHtml: MENOLAK input berbahaya -> null (jatuh ke teks biasa).
// ---------------------------------------------------------------------------
test("renderIconHtml: tolak javascript:/data:/http/script/onerror -> null", () => {
  const bahaya = [
    '<img src="javascript:alert(1)">',
    '<img src="data:text/html,x">',
    '<img src="https://jahat.example/x.png">',
    '<img src="http://jahat.example/x.png">',
    '<img src="/images/x.png" onerror="alert(1)">',
    "<script>alert(1)</script>",
    '<img src="/etc/passwd">',
    "/images/bukan-img.png",
    "",
    null,
    undefined,
  ];
  for (const html of bahaya) {
    assert.equal(
      renderIconHtml(html as string),
      null,
      `patut tolak: ${String(html)}`,
    );
  }
});

// ---------------------------------------------------------------------------
// 4. srcIkonSah: kunci kawalan src secara terus.
// ---------------------------------------------------------------------------
test("srcIkonSah: /images/ sah = true; skema lain = false", () => {
  assert.equal(srcIkonSah("/images/x.png"), true);
  assert.equal(srcIkonSah("/images/sub/x.jpg"), true);
  assert.equal(srcIkonSah("javascript:alert(1)"), false);
  assert.equal(srcIkonSah("data:image/png;base64,AAAA"), false);
  assert.equal(srcIkonSah("https://x/y.png"), false);
  assert.equal(srcIkonSah(""), false);
  assert.equal(srcIkonSah(null), false);
});

// ---------------------------------------------------------------------------
// 5. splitMalayWordSyllables: kelakuan asas kekal.
// ---------------------------------------------------------------------------
test("splitMalayWordSyllables: pecahan asas stabil", () => {
  assert.deepEqual(splitMalayWordSyllables("bas"), ["bas"]);
  assert.deepEqual(splitMalayWordSyllables("buku"), ["bu", "ku"]);
  assert.deepEqual(splitMalayWordSyllables(""), []);
});

// ---------------------------------------------------------------------------
// 6. formatSukuKataTeksReact: warna hitam/merah berselang-seli + struktur.
// ---------------------------------------------------------------------------
function kumpulSpanWarna(nod: any): string[] {
  const warna: string[] = [];
  const jelajah = (n: any) => {
    if (n == null || typeof n !== "object") return;
    if (Array.isArray(n)) {
      n.forEach(jelajah);
      return;
    }
    if (n.type === "span" && n.props?.style?.color) {
      warna.push(n.props.style.color);
    }
    if (n.props?.children) jelajah(n.props.children);
  };
  jelajah(nod);
  return warna;
}

test("formatSukuKataTeksReact: warna berselang-seli hitam/merah", () => {
  const nod = formatSukuKataTeksReact("buku saya", "left");
  const warna = kumpulSpanWarna(nod);
  assert.ok(warna.length >= 3, "patut ada beberapa span suku kata");
  assert.equal(warna[0], "#0f172a");
  const unik = [...new Set(warna)];
  assert.ok(unik.includes("#0f172a"));
  assert.ok(unik.includes("#dc2626"));
});

test("formatSukuKataTeksReact: kosong -> null, ayat panjang -> lineHeight 1.25", () => {
  assert.equal(formatSukuKataTeksReact(""), null);
  const nod: any = formatSukuKataTeksReact("buku", "center", true);
  assert.equal(nod[0].props.style.lineHeight, "1.25");
  const nod2: any = formatSukuKataTeksReact("buku", "center", false);
  assert.equal(nod2[0].props.style.lineHeight, "1.45");
});
