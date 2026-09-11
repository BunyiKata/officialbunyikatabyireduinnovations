/**
 * Semakan pra-terbang untuk apphosting.yaml.
 *
 * Mengesahkan:
 *   1. YAML sah dan boleh dihurai.
 *   2. Setiap nilai `value:` sepadan TEPAT dengan .env tempatan
 *      (tiada ruang tersembunyi, tiada baris baru, tiada typo).
 *   3. Nilai berangka/bertanda-titik-bertindih dibaca sebagai string,
 *      bukan integer -- ini punca pepijat senyap dalam YAML.
 *   4. Hanya rahsia yang benar-benar rahsia kekal sebagai `secret:`.
 *   5. Tiada rahsia terdedah kepada BUILD (yang bermakna terdedah
 *      kepada pelayar).
 *
 * Jalankan: node scripts/test_apphosting_config.mjs
 */
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

let lulus = 0;
let gagal = 0;

function semak(label, syarat, butiran = '') {
  if (syarat) {
    console.log(`  LULUS  ${label}`);
    lulus++;
  } else {
    console.log(`  GAGAL  ${label}${butiran ? ` -- ${butiran}` : ''}`);
    gagal++;
  }
}

// --- Baca .env sebagai sumber kebenaran -------------------------------------
const env = {};
for (const baris of readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = baris.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

// --- Hurai YAML -------------------------------------------------------------
const mentah = readFileSync('apphosting.yaml', 'utf8');
let doc;
try {
  doc = parse(mentah);
  semak('apphosting.yaml adalah YAML yang sah', true);
} catch (e) {
  semak('apphosting.yaml adalah YAML yang sah', false, e.message);
  process.exit(1);
}

const entri = doc.env ?? [];
const ikutNama = new Map(entri.map((e) => [e.variable, e]));

// --- 1. Tiada nama pemboleh ubah berulang ----------------------------------
semak(
  'tiada pemboleh ubah berulang',
  ikutNama.size === entri.length,
  `${entri.length} entri, ${ikutNama.size} nama unik`
);

// --- 2. Tiada sisa ujian ----------------------------------------------------
semak('tiada sisa ZZ_TEST_DELETE_ME', !/ZZ_TEST_DELETE_ME/.test(mentah));

// --- 3. Hanya 2 rahsia sebenar ---------------------------------------------
const rahsia = entri.filter((e) => e.secret).map((e) => e.variable).sort();
semak(
  'tepat 2 rahsia: ADMIN_CODE + CHIP_SECRET_KEY',
  JSON.stringify(rahsia) === JSON.stringify(['ADMIN_CODE', 'CHIP_SECRET_KEY']),
  `dijumpai: ${JSON.stringify(rahsia)}`
);

// --- 4. Tiada rahsia dalam BUILD (BUILD = terdedah kepada pelayar) ---------
const rahsiaDalamBuild = entri.filter(
  (e) => e.secret && (e.availability ?? []).includes('BUILD')
);
semak(
  'tiada rahsia terdedah kepada BUILD/pelayar',
  rahsiaDalamBuild.length === 0,
  rahsiaDalamBuild.map((e) => e.variable).join(', ')
);

// --- 5. Setiap VITE_* mesti BUILD (jika tidak, ia undefined di pelayar) ----
const viteBukanBuild = entri.filter(
  (e) => e.variable.startsWith('VITE_') && !(e.availability ?? []).includes('BUILD')
);
semak(
  'setiap VITE_* mempunyai availability BUILD',
  viteBukanBuild.length === 0,
  viteBukanBuild.map((e) => e.variable).join(', ')
);

// --- 6. Nilai sepadan TEPAT dengan .env -----------------------------------
const mestiSepadan = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_CHIP_BRAND_ID',
  'CHIP_BRAND_ID',
];

for (const nama of mestiSepadan) {
  const e = ikutNama.get(nama);
  if (!e) {
    semak(`${nama} hadir dalam apphosting.yaml`, false, 'tiada');
    continue;
  }
  const diYaml = e.value;
  const diEnv = env[nama];
  if (diEnv === undefined) {
    semak(`${nama} sepadan dengan .env`, false, 'tiada dalam .env');
    continue;
  }
  // Mesti string: jika YAML membacanya sebagai nombor, Vite akan
  // menyuntik nilai yang berbeza daripada yang dijangka.
  const jenisBetul = typeof diYaml === 'string';
  semak(
    `${nama} adalah string (bukan nombor) dalam YAML`,
    jenisBetul,
    `jenis=${typeof diYaml}`
  );
  semak(
    `${nama} sepadan TEPAT dengan .env`,
    String(diYaml) === diEnv,
    `yaml=${JSON.stringify(diYaml)} env=${JSON.stringify(diEnv)}`
  );
}

// --- 7. CHIP_BRAND_ID dan VITE_CHIP_BRAND_ID mesti sama -------------------
semak(
  'CHIP_BRAND_ID == VITE_CHIP_BRAND_ID',
  ikutNama.get('CHIP_BRAND_ID')?.value === ikutNama.get('VITE_CHIP_BRAND_ID')?.value
);

// --- 8. Rahsia RUNTIME sahaja, dan tiada nilai literal --------------------
for (const nama of ['ADMIN_CODE', 'CHIP_SECRET_KEY']) {
  const e = ikutNama.get(nama);
  semak(`${nama} ditanda sebagai secret`, Boolean(e?.secret));
  semak(
    `${nama} tiada nilai literal dalam repo`,
    e?.value === undefined,
    'nilai rahsia TIDAK BOLEH ditulis dalam apphosting.yaml'
  );
  semak(
    `${nama} adalah RUNTIME sahaja`,
    JSON.stringify(e?.availability) === JSON.stringify(['RUNTIME'])
  );
}

// --- 9. runConfig berpatutan ----------------------------------------------
semak('runConfig.minInstances = 0 (kawal kos)', doc.runConfig?.minInstances === 0);

console.log(`\n  ${lulus} lulus, ${gagal} gagal`);
console.log(gagal === 0 ? '\nAPPHOSTING_CONFIG_PASS' : '\nAPPHOSTING_CONFIG_FAIL');
process.exit(gagal === 0 ? 0 : 1);
