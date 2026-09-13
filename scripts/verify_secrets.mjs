/**
 * Mengesahkan rahsia App Hosting TANPA mendedahkan nilainya.
 *
 * Hanya melaporkan:
 *   - panjang bait
 *   - ada/tiada ruang atau baris baru di hujung (punca 401 yang sukar dijejak)
 *   - sama ada nilai masih nilai ujian yang ditulis semasa pembangunan
 *
 * Nilai sebenar TIDAK PERNAH dicetak.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const PROJEK = 'bunyi-kata-official';

// Nilai ujian yang pernah ditulis semasa menguji kaedah fail.
// Disimpan sebagai hash supaya skrip ini sendiri tidak mengandungi nilai.
const HASH_NILAI_UJIAN = new Set([
  createHash('sha256').update('probe-value-abc').digest('hex'),
  createHash('sha256').update('dummy-value-123').digest('hex'),
]);

let gagal = 0;

function baca(nama) {
  const buf = execFileSync(
    'npx',
    ['--yes', 'firebase', 'apphosting:secrets:access', nama, '--project', PROJEK],
    { encoding: 'buffer', shell: true, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return buf.toString('utf8');
}

for (const nama of ['ADMIN_CODE']) {
  console.log(`\n===== ${nama} =====`);

  let mentah;
  try {
    mentah = baca(nama);
  } catch (e) {
    console.log('  GAGAL  tidak dapat dibaca');
    gagal++;
    continue;
  }

  // CLI menambah SATU baris baru pada output paparan. Baris baru
  // tambahan selepas itu bermakna nilai yang disimpan memang tercemar.
  const tanpaSatuNewline = mentah.replace(/\r?\n$/, '');
  const dipangkas = tanpaSatuNewline.trim();

  const panjang = Buffer.byteLength(dipangkas, 'utf8');
  console.log(`  panjang: ${panjang} bait`);

  if (panjang === 0) {
    console.log('  GAGAL  kosong');
    gagal++;
    continue;
  }

  // Semakan pencemaran: selepas membuang satu baris baru paparan,
  // sepatutnya tiada ruang putih di hujung lagi.
  if (tanpaSatuNewline !== dipangkas) {
    console.log('  GAGAL  ada ruang/baris baru tambahan di hujung');
    gagal++;
  } else {
    console.log('  LULUS  bersih (tiada ruang/baris baru di hujung)');
  }

  // Semakan nilai ujian.
  const hash = createHash('sha256').update(dipangkas).digest('hex');
  if (HASH_NILAI_UJIAN.has(hash)) {
    console.log('  GAGAL  ini masih NILAI UJIAN, bukan nilai sebenar anda');
    gagal++;
  } else {
    console.log('  LULUS  bukan nilai ujian');
  }

  // Semakan khusus setiap rahsia.
  if (nama === 'ADMIN_CODE') {
    const haram = ['#', '.', '$', '[', ']', '/'].filter((c) => dipangkas.includes(c));
    if (haram.length) {
      console.log(`  AMARAN aksara bermasalah untuk laluan RTDB: ${haram.join(' ')}`);
    } else {
      console.log('  LULUS  tiada aksara yang merosakkan laluan RTDB');
    }
    if (panjang < 6) {
      console.log('  AMARAN sangat pendek untuk kod admin');
    }
  }
}

console.log(`\n${gagal === 0 ? 'RAHSIA_OK' : `RAHSIA_GAGAL (${gagal} masalah)`}`);
process.exit(gagal === 0 ? 0 : 1);
