/**
 * Ujian /api/admin/verify tanpa perlu Firebase Admin SDK dikonfigurasikan.
 *
 * Yang diuji:
 *  1. Kod salah  -> 401 (fail-closed)
 *  2. Kod kosong -> 400
 *  3. Kod betul  -> BUKAN 401 (bermakna perbandingan rahsia lulus)
 *
 * Untuk (3), tanpa FIREBASE_SERVICE_ACCOUNT kita jangkakan 500 dengan mesej
 * berkaitan Admin SDK — itu membuktikan semakan kod berjaya dan hanya penjanaan
 * token yang tertunggak.
 */
import { spawn } from 'node:child_process';

const KOD_UJIAN = 'UJIAN-KOD-ADMIN-SANGAT-RAHSIA-12345';
const PORT = 3000;
const BASE = `http://127.0.0.1:${PORT}`;

function tunggu(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tungguPelayan(maksCuba = 40) {
  for (let i = 0; i < maksCuba; i++) {
    try {
      const res = await fetch(BASE, { method: 'GET' });
      if (res) return true;
    } catch {
      /* belum sedia */
    }
    await tunggu(500);
  }
  return false;
}

async function hantar(kod) {
  const res = await fetch(`${BASE}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kod === undefined ? {} : { kod }),
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

const pelayan = spawn('node', ['server.js'], {
  env: { ...process.env, ADMIN_CODE: KOD_UJIAN, NODE_ENV: 'development' },
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: false,
});

pelayan.stdout.on('data', () => { });
pelayan.stderr.on('data', () => { });

let kodKeluar = 0;

try {
  const sedia = await tungguPelayan();
  if (!sedia) {
    console.error('GAGAL: pelayan tidak bersedia dalam masa yang ditetapkan.');
    pelayan.kill();
    process.exit(1);
  }

  console.log('=== Ujian /api/admin/verify ===\n');

  // 1. Kod salah
  const salah = await hantar('KOD-YANG-SALAH-SEKALI');
  const lulus1 = salah.status === 401;
  console.log(`1. Kod salah      -> ${salah.status} ${lulus1 ? 'PASS' : 'FAIL (patut 401)'}`);
  if (!lulus1) kodKeluar = 1;

  // 2. Kod kosong
  const kosong = await hantar('');
  const lulus2 = kosong.status === 400;
  console.log(`2. Kod kosong     -> ${kosong.status} ${lulus2 ? 'PASS' : 'FAIL (patut 400)'}`);
  if (!lulus2) kodKeluar = 1;

  // 3. Kod betul: mesti BUKAN 401
  const betul = await hantar(KOD_UJIAN);
  const lulus3 = betul.status !== 401;
  console.log(
    `3. Kod betul      -> ${betul.status} ${lulus3 ? 'PASS (semakan rahsia lulus)' : 'FAIL (ditolak sebagai kod salah)'}`,
  );
  if (!lulus3) kodKeluar = 1;

  if (betul.status === 200 && betul.body?.token) {
    console.log('   Custom token dijana — Firebase Admin SDK berfungsi.');
  } else if (betul.status === 500) {
    console.log(`   Mesej: ${betul.body?.message || '(tiada)'}`);
    console.log('   Dijangka: FIREBASE_SERVICE_ACCOUNT belum ditetapkan.');
  }

  // 4. Sensitiviti huruf besar/kecil (kod dinormalkan ke huruf besar)
  const kecil = await hantar(KOD_UJIAN.toLowerCase());
  const lulus4 = kecil.status !== 401;
  console.log(
    `4. Huruf kecil    -> ${kecil.status} ${lulus4 ? 'PASS (dinormalkan)' : 'FAIL'}`,
  );
  if (!lulus4) kodKeluar = 1;

  console.log('');
  console.log(kodKeluar === 0 ? 'ADMIN_ENDPOINT_PASS' : 'ADMIN_ENDPOINT_FAIL');
} catch (err) {
  console.error('RALAT ujian:', err.message);
  kodKeluar = 1;
} finally {
  pelayan.kill();
  await tunggu(300);
  process.exit(kodKeluar);
}
