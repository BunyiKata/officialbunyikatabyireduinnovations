// Semakan cepat: peraturan DB adalah JSON sah & nod penting hadir.
import { readFileSync } from 'node:fs';

const rules = JSON.parse(readFileSync('database.rules.json', 'utf8')).rules;

console.log('Root .read  =', rules['.read']);
console.log('Root .write =', rules['.write']);
console.log('');

for (const node of ['profiles', 'classes', 'families', 'students', 'scores', 'badges', 'feedbacks', 'orders']) {
  const n = rules[node];
  if (!n) { console.log(`${node.padEnd(10)} TIADA`); continue; }
  const wildcard = Object.keys(n).find((k) => k.startsWith('$'));
  console.log(
    `${node.padEnd(10)} read=${String(n['.read']).padEnd(12)} write=${wildcard ? n[wildcard]['.write'] : '-'}`,
  );
}
