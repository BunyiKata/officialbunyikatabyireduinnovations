/**
 * Backfill nod `code_index` daripada data `classes` dan `families` sedia ada.
 *
 * Peraturan pangkalan data yang baharu bergantung pada `code_index` untuk
 * mengesahkan bahawa kod kelas/keluarga yang digunakan oleh murid memang
 * dimiliki oleh guru/ibu bapa berdaftar. Kelas & keluarga yang dicipta SEBELUM
 * indeks ini diperkenalkan belum mempunyai entri, jadi skrip ini mengisinya.
 *
 * Jalankan SEKALI sebelum men-deploy peraturan baharu:
 *   node scripts/backfill_code_index.mjs
 *
 * Skrip ini idempoten — selamat dijalankan berulang kali.
 */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.databaseURL) {
  console.error('RALAT: VITE_FIREBASE_DATABASE_URL tiada dalam .env');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function bersihkanKunciKod(kod) {
  return (kod || '').trim().toUpperCase().replace(/[.$#[\]/]/g, '_');
}

async function main() {
  console.log('=== Backfill code_index ===');
  console.log('Pangkalan data:', firebaseConfig.databaseURL);
  console.log('');

  const [classesSnap, familiesSnap, existingSnap] = await Promise.all([
    get(ref(db, 'classes')),
    get(ref(db, 'families')),
    get(ref(db, 'code_index')),
  ]);

  const existing = existingSnap.exists() ? existingSnap.val() : {};
  const tulisan = [];
  const langkau = [];
  const amaran = [];

  if (classesSnap.exists()) {
    classesSnap.forEach((child) => {
      const v = child.val() || {};
      const kod = (v.kod_kelas || '').trim().toUpperCase();
      if (!kod) {
        amaran.push(`classes/${child.key} — tiada kod_kelas, dilangkau`);
        return;
      }
      const kunci = bersihkanKunciKod(kod);
      if (existing[kunci]) {
        langkau.push(`${kod} (kelas) — indeks sudah ada`);
        return;
      }
      tulisan.push({
        kunci,
        payload: {
          kod,
          jenis: 'kelas',
          kelas_id: child.key,
          guru_id: v.guru_id || null,
          dikemaskini_pada: new Date().toISOString(),
        },
      });
    });
  }

  if (familiesSnap.exists()) {
    familiesSnap.forEach((child) => {
      const v = child.val() || {};
      const kod = (v.kod_keluarga || '').trim().toUpperCase();
      if (!kod) {
        amaran.push(`families/${child.key} — tiada kod_keluarga, dilangkau`);
        return;
      }
      const kunci = bersihkanKunciKod(kod);
      if (existing[kunci]) {
        langkau.push(`${kod} (keluarga) — indeks sudah ada`);
        return;
      }
      tulisan.push({
        kunci,
        payload: {
          kod,
          jenis: 'keluarga',
          keluarga_id: child.key,
          parent_id: v.parent_id || null,
          dikemaskini_pada: new Date().toISOString(),
        },
      });
    });
  }

  // Kesan pertembungan: dua kod berbeza yang menghasilkan kunci sama
  const kunciDilihat = new Map();
  for (const t of tulisan) {
    if (kunciDilihat.has(t.kunci)) {
      amaran.push(
        `PERTEMBUNGAN: "${t.payload.kod}" dan "${kunciDilihat.get(t.kunci)}" ` +
        `menghasilkan kunci indeks sama (${t.kunci})`
      );
    } else {
      kunciDilihat.set(t.kunci, t.payload.kod);
    }
  }

  for (const t of tulisan) {
    await set(ref(db, `code_index/${t.kunci}`), t.payload);
    console.log(`  + ${t.payload.kod.padEnd(16)} ${t.payload.jenis}`);
  }

  console.log('');
  console.log(`Ditulis  : ${tulisan.length}`);
  console.log(`Dilangkau: ${langkau.length} (sudah diindeks)`);

  if (amaran.length > 0) {
    console.log('');
    console.log('AMARAN:');
    amaran.forEach((a) => console.log(`  ! ${a}`));
  }

  console.log('');
  console.log('Selesai. code_index sedia untuk peraturan baharu.');
  process.exit(0);
}

main().catch((err) => {
  console.error('RALAT backfill:', err);
  process.exit(1);
});
