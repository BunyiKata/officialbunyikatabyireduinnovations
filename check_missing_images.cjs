const fs = require('fs');
const path = require('path');

const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
const appLogic = fs.readFileSync(appLogicPath, 'utf8');

const sukukataDir = path.join(__dirname, 'public', 'images', 'sukukata');
const existingImages = new Set(fs.readdirSync(sukukataDir).map(f => f.toLowerCase().replace('.png', '')));

console.log(`Total available images in public/images/sukukata: ${existingImages.size}`);

// Regex to find flashcard entries: { front: '...', back: 'WORD', icon: '...' }
const regex = /\{front:\s*'([^']+)',\s*back:\s*'([^']+)',\s*icon:\s*'([^']+)'\}/g;

let match;
let countTotal = 0;
let countImages = 0;
let countEmoji = 0;
const missing = [];

while ((match = regex.exec(appLogic)) !== null) {
  countTotal++;
  const front = match[1];
  const back = match[2];
  const icon = match[3];

  const wordLower = back.toLowerCase();

  if (icon.includes('<img')) {
    countImages++;
  } else {
    countEmoji++;
    const hasImage = existingImages.has(wordLower);
    missing.push({ front, back, icon, hasImage });
  }
}

console.log(`Total flashcard entries found: ${countTotal}`);
console.log(`Entries with <img>: ${countImages}`);
console.log(`Entries with emoji/other: ${countEmoji}`);

console.log('\n--- Missing/Non-img Entries ---');
for (const item of missing) {
  console.log(`Word: "${item.back}" | Front: "${item.front}" | Icon: ${item.icon} | PNG available: ${item.hasImage}`);
}
