import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import dotenv from 'dotenv';
dotenv.config();

const FAKE_GURU = 'AxBApDtgb7SyGlLnXIT2815cFjW2';        // Test kejap (Percuma) - tidak sepatutnya punya murid
const FAKE_GURU_EMAIL = 'miloaiseenam@gmail.com';
const REAL_GURU = 'kumdbfX6qjfgP5pxVVnQW3AJpFx1';         // MUHAMMAD IZZAT (Pro) - pemilik kelas CERIA#01
const REAL_GURU_EMAIL = 'ijatlorhh@gmail.com';
const KELAS_ID_CERIA = '-P14-Axnq9KU7isDW7DJ';            // kelas PRA CERIA (CERIA#01)

const TARGET_IDS = [
  '-P14-sWIlwRIRkOYQOBB',
  '-P14-sWJytHa0mWnggyD',
  '-P14-sWK-3n1vnHGBBxM',
  '-P14-sWK-3n1vnHGBBxN',
  '-P14-sWLNG8c8Pu8uHV3',
  '-P14-sWMS3l5tKkvQYyz',
  '-P14-sWMS3l5tKkvQYz-',
  '-P14-sWNLSdesn2Y-m-D',
  '-P14-sWOq5QnDFcQB2de',
];

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getDatabase(app);

const MODE = process.argv.includes('--apply') ? 'APPLY' : 'DRY-RUN';

async function main() {
  console.log(`=== PEMBETULAN GURU_ID MURID [${MODE}] ===\n`);
  const backup = {};
  let count = 0;
  for (const id of TARGET_IDS) {
    const snap = await get(ref(db, `students/${id}`));
    if (!snap.exists()) { console.log(`  ! ${id} TIADA - skip`); continue; }
    const v = snap.val();
    const isGhost = v.guru_id === FAKE_GURU && v.kelas_id === KELAS_ID_CERIA;
    backup[id] = { guru_id: v.guru_id, guru_email: v.guru_email, kod_kelas: v.kod_kelas, nama: v.nama };
    console.log(`  ${id} | ${v.nama} | guru_id=${v.guru_id} -> ${REAL_GURU} | ${isGhost?'(GHOST)':'(semak!)'}`);
    if (isGhost) {
      count++;
      if (MODE === 'APPLY') {
        await update(ref(db, `students/${id}`), {
          guru_id: REAL_GURU,
          guru_email: REAL_GURU_EMAIL,
          dikemaskini_pada: new Date().toISOString(),
        });
      }
    }
  }
  console.log(`\nJumlah murid ghost untuk dibetulkan: ${count}/${TARGET_IDS.length}`);
  if (MODE === 'DRY-RUN') {
    console.log('(Dry-run sahaja. Jalankan dengan --apply untuk tulis ke DB.)');
  } else {
    // simpan backup
    await set(ref(db, `backup/ghost_fix_${Date.now()}`), backup);
    console.log('Selesai. Backup disimpan dalam node /backup.');
  }
  process.exit(0);
}
main().catch(e => { console.error('ERR', e); process.exit(1); });
