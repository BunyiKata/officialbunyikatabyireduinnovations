/**
 * Sahkan bahawa pembersihan kunci dalam database.rules.json menghasilkan kunci
 * yang SAMA seperti scripts/backfill_code_index.mjs dan firebaseService.ts.
 *
 * Mengapa skrip ini penting:
 *   Kod kelas/keluarga sebenar mengandungi '#' (cth. CERIA#01). RTDB menolak
 *   '#' dalam laluan kunci. Jika rules mencari kod mentah sedangkan backfill
 *   menulis kunci yang dibersihkan, carian TIDAK akan padan dan SEMUA murid
 *   akan hilang akses. Ini menyemak ketiga-tiga tempat sehaluan.
 *
 * Jalankan tanpa auth (data awam untuk dibaca):
 *   node scripts/test_code_index_match.mjs
 */
import fs from 'node:fs';

const DB =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  'https://bunyi-kata-official-default-rtdb.asia-southeast1.firebasedatabase.app';

// Salinan tepat bersihkanKunciKod() dari firebaseService.ts / backfill.
function bersihkanKunciKod(kod) {
  return (kod || '').trim().toUpperCase().replace(/[.$#[\]/]/g, '_');
}

/**
 * Tiru rantaian .replace() dalam database.rules.json.
 * Bahasa rules RTDB hanya ada replace(cari, ganti) yang menggantikan SEMUA
 * kemunculan, tiada regex. Kita tiru rantaian itu dengan tepat.
 */
function bersihGayaRules(kod) {
  return (kod || '')
    .toUpperCase()
    .split('#').join('_')
    .split('.').join('_')
    .split('$').join('_')
    .split('[').join('_')
    .split(']').join('_')
    .split('/').join('_');
}

async function ambil(laluan) {
  const res = await fetch(`${DB}/${laluan}.json`);
  if (!res.ok) throw new Error(`${laluan} -> HTTP ${res.status}`);
  return res.json();
}

// Sahkan rules sebenar memang mengandungi rantaian replace yang dijangka.
function semakRulesMengandungiPembersihan() {
  const teks = fs.readFileSync('database.rules.json', 'utf8');
  const rules = JSON.parse(teks);
  const tulis = rules.rules?.students?.$studentId?.['.write'] || '';
  const perlu = [
    "replace('#','_')",
    "replace('.','_')",
    "replace('$','_')",
    "replace('[','_')",
    "replace(']','_')",
    "replace('/','_')",
    '.toUpperCase()',
  ];
  const hilang = perlu.filter((p) => !tulis.includes(p));
  return { ok: hilang.length === 0, hilang, adaHasChild: tulis.includes('hasChild') };
}

let gagal = 0;

console.log('=== Semakan padanan code_index ===\n');

// Semakan 1: rules mengandungi pembersihan
const r = semakRulesMengandungiPembersihan();
console.log(`1. Rules ada rantaian pembersihan   ${r.ok ? 'PASS' : 'FAIL'}`);
if (!r.ok) {
  console.log(`   Hilang: ${r.hilang.join(', ')}`);
  gagal++;
}

// Semakan 2: rules guard hasChild (elak val() null pada rekod separa)
console.log(`2. Rules guard hasChild             ${r.adaHasChild ? 'PASS' : 'FAIL'}`);
if (!r.adaHasChild) gagal++;

// Semakan 3 & 4: kunci padan untuk setiap kod sebenar
const [classes, families, students] = await Promise.all([
  ambil('classes'),
  ambil('families'),
  ambil('students'),
]);

const kodSemua = [];
Object.entries(classes || {}).forEach(([id, v]) => {
  if (v?.kod_kelas) kodSemua.push({ jenis: 'kelas', id, kod: v.kod_kelas });
});
Object.entries(families || {}).forEach(([id, v]) => {
  if (v?.kod_keluarga) kodSemua.push({ jenis: 'keluarga', id, kod: v.kod_keluarga });
});

let tidakPadan = 0;
console.log('\n3. Padanan kunci backfill vs rules');
for (const { jenis, kod } of kodSemua) {
  const kunciBackfill = bersihkanKunciKod(kod);
  const kunciRules = bersihGayaRules(kod);
  const padan = kunciBackfill === kunciRules;
  if (!padan) tidakPadan++;
  console.log(
    `   ${padan ? 'PASS' : 'FAIL'}  ${kod.padEnd(12)} ${jenis.padEnd(9)} ` +
      `backfill=${kunciBackfill} rules=${kunciRules}`,
  );
}
if (tidakPadan > 0) gagal++;

// Semakan 4: tiada kunci yang dibersihkan mengandungi aksara haram RTDB
console.log('\n4. Kunci sah untuk laluan RTDB');
let kunciHaram = 0;
for (const { kod } of kodSemua) {
  const kunci = bersihkanKunciKod(kod);
  if (/[.$#[\]/]/.test(kunci)) {
    console.log(`   FAIL  ${kod} -> ${kunci} masih ada aksara haram`);
    kunciHaram++;
  }
}
console.log(
  kunciHaram === 0 ? `   PASS  ${kodSemua.length} kunci semuanya sah` : '',
);
if (kunciHaram > 0) gagal++;

// Semakan 5: setiap murid ada kod yang akan diindeks
console.log('\n5. Setiap murid ada kod boleh diindeks');
const setKunci = new Set(kodSemua.map(({ kod }) => bersihkanKunciKod(kod)));
const yatim = [];
Object.entries(students || {}).forEach(([id, v]) => {
  if (!v) return;
  const kk = v.kod_kelas ? bersihkanKunciKod(v.kod_kelas) : null;
  const kf = v.kod_keluarga ? bersihkanKunciKod(v.kod_keluarga) : null;
  const adaSah = (kk && setKunci.has(kk)) || (kf && setKunci.has(kf));
  if (!adaSah) yatim.push({ id, nama: v.nama, kk, kf });
});
if (yatim.length === 0) {
  console.log(`   PASS  ${Object.keys(students || {}).length} murid semuanya terliput`);
} else {
  console.log(`   FAIL  ${yatim.length} murid akan HILANG AKSES:`);
  yatim.slice(0, 20).forEach((m) =>
    console.log(`         ${m.id} (${m.nama}) kelas=${m.kk} keluarga=${m.kf}`),
  );
  gagal++;
}

// Semakan 6: pertembungan — dua kod berbeza jadi satu kunci
console.log('\n6. Tiada pertembungan kunci');
const peta = new Map();
const bertembung = [];
for (const { kod } of kodSemua) {
  const k = bersihkanKunciKod(kod);
  if (peta.has(k) && peta.get(k) !== kod) {
    bertembung.push(`${kod} <-> ${peta.get(k)} (kedua-dua -> ${k})`);
  }
  peta.set(k, kod);
}
if (bertembung.length === 0) {
  console.log('   PASS  tiada pertembungan');
} else {
  bertembung.forEach((b) => console.log(`   FAIL  ${b}`));
  gagal++;
}

console.log('');
console.log(gagal === 0 ? 'CODE_INDEX_MATCH_PASS' : `CODE_INDEX_MATCH_FAIL (${gagal})`);
// Guna exitCode (bukan process.exit) supaya soket fetch ditutup dengan bersih.
process.exitCode = gagal === 0 ? 0 : 1;
