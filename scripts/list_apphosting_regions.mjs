// Senarai region App Hosting yang disokong, terus dari API Google.
import { readFileSync } from 'node:fs';

const CFG = 'C:/Users/User/.config/configstore/firebase-tools.json';
const cfg = JSON.parse(readFileSync(CFG, 'utf8'));
const refresh = cfg.tokens?.refresh_token;
if (!refresh) {
  console.error('Tiada refresh_token. Jalankan: npx firebase login');
  process.exit(1);
}

// Client ID/secret awam Firebase CLI.
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const tokRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refresh,
    grant_type: 'refresh_token',
  }),
});
if (!tokRes.ok) {
  console.error('Gagal refresh token:', tokRes.status, await tokRes.text());
  process.exit(1);
}
const { access_token: at } = await tokRes.json();

const url =
  'https://firebaseapphosting.googleapis.com/v1beta/projects/bunyi-kata-official/locations?pageSize=200';
const res = await fetch(url, { headers: { Authorization: `Bearer ${at}` } });
if (!res.ok) {
  console.error('API gagal:', res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
const ids = (data.locations || []).map((l) => l.locationId).sort();

console.log(`\nJumlah region App Hosting disokong: ${ids.length}\n`);
for (const id of ids) {
  const mark = id === 'asia-southeast1' ? '   <== SINGAPORE (paling dekat Malaysia)' : '';
  console.log(`  ${id}${mark}`);
}
const ok = ids.includes('asia-southeast1');
console.log(`\nasia-southeast1 disokong? ${ok ? 'YA' : 'TIDAK'}`);
if (!ok) {
  const asia = ids.filter((i) => i.startsWith('asia'));
  console.log(`Pilihan Asia yang ada: ${asia.join(', ') || '(tiada)'}`);
}
console.log('');

