// Skrip sekali guna: memulihkan mojibake double-encoded (UTF-8 yang dibaca
// sebagai Windows-1252 lalu ditulis semula sebagai UTF-8) dalam fail teks.
//
// Punca: edit PowerShell `Get-Content -Raw` (baca sebagai ANSI/Windows-1252)
// + tulis UTF-8 menyebabkan urutan UTF-8 seperti em-dash (E2 80 94) menjadi
// 'â€"' dsb.
//
// Strategi: untuk setiap jalur aksara >= 0x80, cuba decode round-trip melalui
// Windows-1252 -> UTF-8. Terima hanya jika hasil tiada aksara pengganti dan
// tiada lagi penanda mojibake.
import fs from 'node:fs';

const fail = process.argv.slice(2);
if (fail.length === 0) {
  console.error('Guna: node scripts/fix-mojibake.mjs <fail...>');
  process.exit(1);
}

// Peta Windows-1252 untuk bait 0x80-0x9F -> code point Unicode sebenar.
const CP1252_HIGH = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160,
  0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153,
  0x9e: 0x017e, 0x9f: 0x0178,
};
// Peta songsang: code point Unicode -> bait (untuk encode ke cp1252)
const UNI_KE_BAIT = new Map();
for (const [bait, uni] of Object.entries(CP1252_HIGH)) {
  UNI_KE_BAIT.set(uni, Number(bait));
}
for (let b = 0x00; b <= 0xff; b++) {
  if (!(b in CP1252_HIGH)) UNI_KE_BAIT.set(b, b);
}
// Aksara kawalan C1 (U+0080-U+009F) yang muncul akibat decode separa:
// petakan kembali ke bait asalnya supaya round-trip cp1252 berfungsi.
for (let b = 0x80; b <= 0x9f; b++) {
  if (!UNI_KE_BAIT.has(b)) UNI_KE_BAIT.set(b, b);
}

function encodeCp1252(str) {
  const out = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    const bait = UNI_KE_BAIT.get(cp);
    if (bait === undefined) return null; // aksara di luar cp1252
    out.push(bait);
  }
  return Buffer.from(out);
}

const PENANDA = [
  'Ã', 'Â', 'â€', 'â‚¬', 'â€ž', '\u00e2\u201d\u20ac', '\u00e2\u201a\u00ac', // â”€, â‚¬ (box/em dash)
];

for (const path of fail) {
  const asal = fs.readFileSync(path, 'utf8');
  let txt = asal;

  const bersihkan = (sumber) =>
    sumber.replace(/[\u0080-\uffff]{1,}/g, (run) => {
      if (!PENANDA.some((p) => run.includes(p))) return run;
      const buf = encodeCp1252(run);
      if (!buf) return run;
      const cuba = buf.toString('utf8');
      if (cuba.includes('\uFFFD')) return run;
      return cuba;
    });

  // Ulang sehingga stabil (mojibake mungkin berlapis >1).
  let sebelum;
  let kali = 0;
  do {
    sebelum = txt;
    txt = bersihkan(txt);
    kali++;
  } while (txt !== sebelum && kali < 6);

  if (txt !== asal) {
    fs.writeFileSync(path, txt, 'utf8');
    console.log(`Dibaiki: ${path} (${kali} hantaran)`);
  } else {
    console.log(`Tiada perubahan: ${path}`);
  }
}

