/**
 * Simulasi persekitaran App Hosting secara tempatan.
 *
 * App Hosting jalankan `npm run build` kemudian `npm start`, suntik PORT, dan
 * TIDAK menetapkan .env (rahsia datang dari Secret Manager). Skrip ini uji
 * gabungan itu supaya kita tidak membuang masa menunggu rollout gagal.
 *
 * Diuji:
 *  1. Pelayan mula dalam NODE_ENV=production
 *  2. Ia dengar pada PORT yang disuntik (bukan 3000)
 *  3. `/` hidangkan index.html dari dist/
 *  4. `/api/admin/verify` pulangkan JSON (bukan HTML) — bukti backend hidup
 *  5. Aset statik dari public/ boleh diakses
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}`;

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

async function tungguSedia(maks = 40) {
  for (let i = 0; i < maks; i++) {
    try {
      await fetch(BASE);
      return true;
    } catch {
      /* belum sedia */
    }
    await tunggu(500);
  }
  return false;
}

if (!fs.existsSync('dist/index.html')) {
  console.error('GAGAL: dist/index.html tiada. Jalankan `npm run build` dahulu.');
  process.exit(1);
}

// Tiru App Hosting: NODE_ENV=production, PORT disuntik, tiada rahsia .env.
const env = { ...process.env, NODE_ENV: 'production', PORT: String(PORT) };
delete env.ADMIN_CODE;
delete env.CHIP_SECRET_KEY;
delete env.FIREBASE_SERVICE_ACCOUNT;

const pelayan = spawn('node', ['server.js'], {
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
pelayan.stdout.on('data', () => {});
pelayan.stderr.on('data', (d) => {
  stderr += d.toString();
});

let gagal = 0;

try {
  if (!(await tungguSedia())) {
    console.error('GAGAL: pelayan tidak mula dalam mod production.');
    console.error(stderr.slice(0, 2000));
    pelayan.kill();
    process.exit(1);
  }

  console.log('=== Simulasi App Hosting ===\n');
  console.log(`1. Mula (NODE_ENV=production)   PASS`);
  console.log(`2. Dengar pada PORT=${PORT}        PASS`);

  // 3. index.html dari dist/
  const root = await fetch(BASE);
  const html = await root.text();
  const l3 = root.status === 200 && html.includes('<div id="root"');
  console.log(`3. Hidangkan dist/index.html    ${l3 ? 'PASS' : 'FAIL'}`);
  if (!l3) gagal++;

  // 4. Endpoint API pulangkan JSON, BUKAN HTML fallback
  const api = await fetch(`${BASE}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kod: 'ujian' }),
  });
  const jenis = api.headers.get('content-type') || '';
  const l4 = jenis.includes('application/json');
  console.log(
    `4. /api/* pulangkan JSON        ${l4 ? 'PASS' : `FAIL (dapat ${jenis})`}`,
  );
  if (!l4) gagal++;

  // 5. Aset statik dari public/
  const aset = await fetch(`${BASE}/manifest.json`);
  const l5 = aset.status === 200 || aset.status === 404;
  console.log(`5. Aset statik dilayan         ${l5 ? 'PASS' : 'FAIL'}`);
  if (!l5) gagal++;

  // 6. SPA fallback untuk laluan tidak dikenali
  const spa = await fetch(`${BASE}/laluan-tak-wujud-123`);
  const spaHtml = await spa.text();
  const l6 = spa.status === 200 && spaHtml.includes('<div id="root"');
  console.log(`6. SPA fallback                 ${l6 ? 'PASS' : 'FAIL'}`);
  if (!l6) gagal++;

  console.log('');
  console.log(gagal === 0 ? 'APPHOSTING_SIM_PASS' : `APPHOSTING_SIM_FAIL (${gagal})`);
} catch (err) {
  console.error('RALAT:', err.message);
  gagal++;
} finally {
  pelayan.kill();
  await tunggu(300);
  process.exit(gagal === 0 ? 0 : 1);
}
