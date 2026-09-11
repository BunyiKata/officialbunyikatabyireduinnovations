// Skrip pembetulan data: keluarga tanpa kod_keluarga.
// Sebab: "KELUARGA ABU" mempunyai kod_keluarga kosong, jadi ibu bapa tidak
// dapat log masuk / anak tidak dipaparkan.
import 'dotenv/config';

const BASE = process.env.VITE_FIREBASE_DATABASE_URL;
if (!BASE) {
  console.error('VITE_FIREBASE_DATABASE_URL tiada dalam .env');
  process.exit(1);
}

const get = async (p) => (await fetch(`${BASE}/${p}.json`)).json();

const families = (await get('families')) || {};
const students = (await get('students')) || {};

// Kumpul semua kod yang sedang digunakan supaya kod baharu tidak bertindih.
const usedCodes = new Set(
  Object.values(families)
    .map((f) => (f?.kod_keluarga || '').toUpperCase())
    .filter(Boolean),
);

const broken = Object.entries(families).filter(
  ([, f]) => !f?.kod_keluarga || String(f.kod_keluarga).trim() === '',
);

if (broken.length === 0) {
  console.log('Tiada keluarga tanpa kod_keluarga. Data sudah baik.');
  process.exit(0);
}

for (const [key, fam] of broken) {
  // Jana kod mengikut format sedia ada: 5 huruf nama + #NN
  const namaBersih = (fam?.nama_keluarga || 'KELUARGA')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  const prefix = (namaBersih.replace(/^KELUARGA/, '') || namaBersih).slice(0, 5).padEnd(5, 'X');

  let kod = '';
  for (let n = 1; n < 100; n++) {
    const cand = `${prefix}#${String(n).padStart(2, '0')}`;
    if (!usedCodes.has(cand)) {
      kod = cand;
      break;
    }
  }
  usedCodes.add(kod);

  const res = await fetch(`${BASE}/families/${key}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kod_keluarga: kod, dikemaskini_pada: new Date().toISOString() }),
  });

  const anak = Object.values(students).filter(
    (s) => s?.kod_keluarga === kod || s?.family_id === key,
  ).length;

  console.log(
    `${res.ok ? 'OK  ' : 'GAGAL'} ${key} "${fam?.nama_keluarga}" -> kod_keluarga=${kod} (anak dikaitkan: ${anak})`,
  );
}

console.log('\nSelesai. Sahkan semula:');
console.log(JSON.stringify(await get('families'), null, 2));
