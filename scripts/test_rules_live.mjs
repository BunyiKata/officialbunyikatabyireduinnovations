/**
 * Uji peraturan `students` terhadap RTDB LIVE, tanpa auth.
 *
 * Ini mensimulasikan tepat apa yang boleh dilakukan oleh murid (tiada akaun)
 * dan oleh penyerang. Jalankan SELEPAS backfill + deploy rules.
 *
 *   node scripts/test_rules_live.mjs
 *
 * Skrip membersihkan sendiri setiap nod ujian yang berjaya ditulis.
 */
const DB =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  'https://bunyi-kata-official-default-rtdb.asia-southeast1.firebasedatabase.app';

async function tulis(laluan, data) {
  const res = await fetch(`${DB}/${laluan}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const teks = await res.text();
  return { ok: res.ok, status: res.status, teks };
}

/**
 * Padam melalui Firebase CLI (kebenaran pemilik).
 * Perlu kerana rules dengan betul MENGHALANG pemadaman tanpa auth — jadi
 * pembersihan melalui REST tanpa auth akan gagal dan tinggalkan data sampah
 * dalam pangkalan data production.
 */
async function buangSebagaiPemilik(laluan) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const jalan = promisify(execFile);
  const projek = process.env.FIREBASE_PROJECT_ID || 'bunyi-kata-official';
  try {
    // shell:true diperlukan di Windows supaya npx.cmd dapat diselesaikan.
    await jalan(
      'npx',
      ['firebase', 'database:remove', `/${laluan}`, '--project', projek, '--force'],
      { timeout: 90000, shell: true },
    );
  } catch (err) {
    console.warn(
      `  AMARAN: gagal buang ${laluan} — jalankan:\n` +
        `    npx firebase database:remove /${laluan} --project ${projek} --force`,
    );
  }
}

const ujian = [];
function lapor(nama, lulus, butiran) {
  ujian.push({ nama, lulus });
  console.log(`  ${lulus ? 'PASS' : 'FAIL'}  ${nama}`);
  if (!lulus && butiran) console.log(`        ${butiran}`);
}

console.log('=== Ujian rules LIVE (tanpa auth) ===');
console.log(`Pangkalan data: ${DB}\n`);

// 1. Kod kelas SAH -> mesti DIBENARKAN (murid sertai kelas guru)
const a = await tulis('students/zz_ujian_sah_kelas', {
  nama: 'Ujian Kod Sah',
  kod_kelas: 'CERIA#01',
});
lapor('Kod kelas sah (CERIA#01) dibenarkan', a.ok, `status ${a.status} ${a.teks}`);
if (a.ok) await buangSebagaiPemilik('students/zz_ujian_sah_kelas');

// 2. Kod keluarga SAH -> mesti DIBENARKAN
const b = await tulis('students/zz_ujian_sah_keluarga', {
  nama: 'Ujian Keluarga',
  kod_keluarga: 'ABUXX#01',
});
lapor('Kod keluarga sah (ABUXX#01) dibenarkan', b.ok, `status ${b.status} ${b.teks}`);
if (b.ok) await buangSebagaiPemilik('students/zz_ujian_sah_keluarga');

// 3. Kod huruf kecil -> mesti DIBENARKAN (rules guna toUpperCase)
const c = await tulis('students/zz_ujian_huruf_kecil', {
  nama: 'Ujian Huruf Kecil',
  kod_kelas: 'ceria#01',
});
lapor('Kod huruf kecil (ceria#01) dibenarkan', c.ok, `status ${c.status} ${c.teks}`);
if (c.ok) await buangSebagaiPemilik('students/zz_ujian_huruf_kecil');

// 4. Kod PALSU -> mesti DITOLAK
const d = await tulis('students/zz_ujian_palsu', {
  nama: 'Penyerang',
  kod_kelas: 'HACK#99',
});
lapor('Kod palsu (HACK#99) DITOLAK', !d.ok, `sepatutnya ditolak, dapat ${d.status}`);
if (d.ok) await buangSebagaiPemilik('students/zz_ujian_palsu');

// 5. Tiada kod sama sekali -> mesti DITOLAK
const e = await tulis('students/zz_ujian_tiada_kod', { nama: 'Tiada Kod' });
lapor('Tiada kod DITOLAK', !e.ok, `sepatutnya ditolak, dapat ${e.status}`);
if (e.ok) await buangSebagaiPemilik('students/zz_ujian_tiada_kod');

// 6. Kod yang menyamai kunci indeks (CERIA_01 vs CERIA#01).
//    Ini DIBENARKAN dan memang betul: kedua-duanya membersih kepada kunci
//    indeks yang sama, jadi ia merujuk kelas SAMA milik guru SAMA. Tiada
//    peningkatan keistimewaan — cuma ejaan alternatif kod yang sah.
//    Yang penting ialah kod yang tiada dalam indeks ditolak (ujian 4).
const f = await tulis('students/zz_ujian_kunci_setara', {
  nama: 'Bentuk Kod Setara',
  kod_kelas: 'CERIA_01',
});
lapor(
  'Kod setara (CERIA_01) dibenarkan — kelas sama',
  f.ok,
  `status ${f.status} ${f.teks}`,
);
if (f.ok) await buangSebagaiPemilik('students/zz_ujian_kunci_setara');

// 7. Tulis ke code_index tanpa auth -> mesti DITOLAK (kalau tidak sesiapa boleh cipta kod)
const g = await tulis('code_index/PALSU_99', { kod: 'PALSU#99', jenis: 'kelas' });
lapor('Tulis code_index tanpa auth DITOLAK', !g.ok, `sepatutnya ditolak, dapat ${g.status}`);
if (g.ok) await buangSebagaiPemilik('code_index/PALSU_99');

// 8. Skor untuk murid tidak wujud -> mesti DITOLAK
const h = await tulis('scores/zz_ujian_skor_palsu', {
  student_id: 'murid_tak_wujud_xyz',
  markah: 999,
});
lapor('Skor untuk murid tiada DITOLAK', !h.ok, `sepatutnya ditolak, dapat ${h.status}`);
if (h.ok) await buangSebagaiPemilik('scores/zz_ujian_skor_palsu');

// 9. Pesanan sedia ada tidak boleh diubah tanpa admin -> mesti DITOLAK
const orders = await fetch(`${DB}/orders.json?shallow=true`).then((r) =>
  r.ok ? r.json() : null,
);
if (orders && Object.keys(orders).length > 0) {
  const idPesanan = Object.keys(orders)[0];
  const i = await tulis(`orders/${idPesanan}`, {
    purchase_id: 'dirampas',
    email: 'penyerang@ujian.com',
    status: 'paid',
  });
  lapor(
    'Ubah pesanan sedia ada DITOLAK',
    !i.ok,
    `sepatutnya ditolak, dapat ${i.status}`,
  );
} else {
  console.log('  SKIP  Ubah pesanan (tiada pesanan untuk diuji)');
}

// 10. Fasa 2: tulis affiliate tanpa auth -> mesti DITOLAK
const j = await tulis('affiliates/PALSU1', {
  nama: 'Penyerang',
  whatsapp: '60123456789',
  kod: 'PALSU1',
  status: 'aktif',
});
lapor('Tulis affiliates tanpa auth DITOLAK', !j.ok, `sepatutnya ditolak, dapat ${j.status}`);
if (j.ok) await buangSebagaiPemilik('affiliates/PALSU1');

// 11. Fasa 2: tulis referrals (komisen) tanpa auth -> mesti DITOLAK
const k2 = await tulis('referrals/PALSU1/xx1', {
  komisen_sen: 999999,
  status: 'dibayar',
});
lapor('Tulis referrals tanpa auth DITOLAK', !k2.ok, `sepatutnya ditolak, dapat ${k2.status}`);
if (k2.ok) await buangSebagaiPemilik('referrals/PALSU1');

const gagal = ujian.filter((u) => !u.lulus).length;
console.log('');
console.log(`Lulus: ${ujian.length - gagal}/${ujian.length}`);
console.log(gagal === 0 ? 'RULES_LIVE_PASS' : `RULES_LIVE_FAIL (${gagal})`);
process.exitCode = gagal === 0 ? 0 : 1;
