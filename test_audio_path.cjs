const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'audio');

const getFiles = (dir) => {
  const full = path.join(baseDir, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).map(f => f.toLowerCase());
};

const abcFiles = new Set(getFiles('abc'));
const kvFiles = new Set(getFiles('kv'));
const nomborFiles = new Set(getFiles('nombor'));
const sukukataFiles = new Set(getFiles('sukukata'));

console.log(`ABC files: ${abcFiles.size}`);
console.log(`KV files: ${kvFiles.size}`);
console.log(`Nombor files: ${nomborFiles.size}`);
console.log(`Suku kata files: ${sukukataFiles.size}`);

const numberWordMap = {
  '0': 'sifar',
  '1': 'satu',
  '2': 'dua',
  '3': 'tiga',
  '4': 'empat',
  '5': 'lima',
  '6': 'enam',
  '7': 'tujuh',
  '8': 'lapan',
  '9': 'sembilan',
  '10': 'sepuluh',
  '20': 'dua-puluh',
  '30': 'tiga-puluh',
  '40': 'empat-puluh',
  '50': 'lima-puluh',
  '60': 'enam-puluh',
  '70': 'tujuh-puluh',
  '80': 'lapan-puluh',
  '90': 'sembilan-puluh',
  '100': 'seratus',
  'dua puluh': 'dua-puluh',
  'tiga puluh': 'tiga-puluh',
  'empat puluh': 'empat-puluh',
  'lima puluh': 'lima-puluh',
  'enam puluh': 'enam-puluh',
  'tujuh puluh': 'tujuh-puluh',
  'lapan puluh': 'lapan-puluh',
  'sembilan puluh': 'sembilan-puluh'
};

function getAudioPath(text) {
  if (!text) return null;
  let raw = String(text).toLowerCase().trim();
  raw = raw.replace(/^(huruf|vokal|konsonan)\s+(besar|kecil)\s+/, '');
  raw = raw.replace(/^suku\s+kata\s+/, '');
  raw = raw.trim();

  // 1. Try raw as-is
  let clean = raw.replace(/[-|\s]/g, '').trim();

  // Check nombor map
  if (numberWordMap[raw]) {
    const target = numberWordMap[raw] + '.mp3';
    if (nomborFiles.has(target)) return `/audio/nombor/${target}`;
  }
  if (numberWordMap[clean]) {
    const target = numberWordMap[clean] + '.mp3';
    if (nomborFiles.has(target)) return `/audio/nombor/${target}`;
  }

  // File lookups
  const file = clean + '.mp3';
  if (sukukataFiles.has(file)) return `/audio/sukukata/${file}`;
  if (kvFiles.has(file)) return `/audio/kv/${file}`;
  if (abcFiles.has(file)) return `/audio/abc/${file}`;
  if (nomborFiles.has(file)) return `/audio/nombor/${file}`;

  // Try hyphenated for nombor/phrase
  const hyphenated = raw.replace(/[-|\s]+/g, '-') + '.mp3';
  if (nomborFiles.has(hyphenated)) return `/audio/nombor/${hyphenated}`;
  if (sukukataFiles.has(hyphenated)) return `/audio/sukukata/${hyphenated}`;

  return null;
}

// Test various inputs
const testInputs = [
  'beca', 'BECA', 'be - ca', 'ba', 'a', 'A', 'Huruf besar A', 'Huruf kecil b',
  '0', '1', '10', '20', 'dua puluh', 'se - pu - luh', '100', 'seratus',
  'keladi', 'ke - la - di', 'basikal', 'zink', 'cempedak'
];

console.log('\n--- Test Audio Path Resolver ---');
for (const inp of testInputs) {
  console.log(`"${inp}" => ${getAudioPath(inp)}`);
}
