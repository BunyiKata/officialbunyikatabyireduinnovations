const fs = require('fs');
const path = require('path');

// 1. PATCH App.tsx
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appTsx = fs.readFileSync(appTsxPath, 'utf8');

const avatarMap = {
  'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png': '/images/avatar/avatar1.png',
  'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png': '/images/avatar/avatar2.png',
  'https://i.postimg.cc/fTp4tg2b/Copy-of-BUNYI-KATA-APPS-(2).png': '/images/avatar/avatar3.png',
  'https://i.postimg.cc/T3DzrqFV/Copy-of-BUNYI-KATA-APPS-(3).png': '/images/avatar/avatar4.png',
  'https://i.postimg.cc/fLw1Q4LX/Copy-of-BUNYI-KATA-APPS-(5).png': '/images/avatar/avatar5.png',
  'https://i.postimg.cc/85t91yJm/Copy-of-BUNYI-KATA-APPS-(6).png': '/images/avatar/avatar6.png',
  'https://i.postimg.cc/63DYpLtR/Copy-of-BUNYI-KATA-APPS-(1).png': '/images/avatar/avatar1.png',
};

for (const [oldUrl, newUrl] of Object.entries(avatarMap)) {
  const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  appTsx = appTsx.replace(regex, newUrl);
}
fs.writeFileSync(appTsxPath, appTsx, 'utf8');
console.log('✅ App.tsx updated with local avatar paths');

// List of all word image files available in public/images/sukukata/
const sukukataDir = path.join(__dirname, 'public', 'images', 'sukukata');
const existingImages = new Set(fs.readdirSync(sukukataDir).map(f => f.toLowerCase().replace('.png', '')));

// 2. PATCH TandukKataGame.tsx
const tandukPath = path.join(__dirname, 'src', 'components', 'TandukKataGame.tsx');
let tandukCode = fs.readFileSync(tandukPath, 'utf8');

// Replace word entries in TandukKataGame
// Pattern: { word: 'beca', syllables: [...], emoji: '...' }
tandukCode = tandukCode.replace(/\{ word: '([^']+)', syllables: (\[[^\]]+\]), emoji: '([^']+)' \}/g, (match, word, syl, oldEmoji) => {
  const cleanWord = word.toLowerCase();
  if (existingImages.has(cleanWord)) {
    return `{ word: '${word}', syllables: ${syl}, emoji: '/images/sukukata/${cleanWord}.png' }`;
  }
  return match;
});

// Replace display logic in TandukKataGame
const tandukDisplayOld = `{activeWord.emoji && selectedCategory !== 'KV' && (
                                <div style={{ fontSize: '6rem', lineHeight: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                                    {activeWord.emoji}
                                </div>
                            )}`;

const tandukDisplayNew = `{activeWord.emoji && selectedCategory !== 'KV' && (
                                <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
                                    {activeWord.emoji.includes('/') || activeWord.emoji.includes('.png') ? (
                                        <img src={activeWord.emoji} alt={activeWord.word} style={{ maxHeight: '130px', maxWidth: '180px', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '6rem', lineHeight: 1 }}>{activeWord.emoji}</span>
                                    )}
                                </div>
                            )}`;

if (tandukCode.includes(tandukDisplayOld)) {
  tandukCode = tandukCode.replace(tandukDisplayOld, tandukDisplayNew);
  console.log('✅ TandukKataGame rendering updated');
} else {
  console.log('⚠️ TandukKataGame rendering pattern did not match exactly, checking manual replacement...');
  tandukCode = tandukCode.replace(
    /\{activeWord\.emoji && selectedCategory !== 'KV' && \([\s\S]*?\{activeWord\.emoji\}[\s\S]*?\}<\/div>\s*\)\}/,
    tandukDisplayNew
  );
}

fs.writeFileSync(tandukPath, tandukCode, 'utf8');
console.log('✅ TandukKataGame.tsx updated');

// 3. PATCH PerpustakaanGame.tsx
const perpPath = path.join(__dirname, 'src', 'components', 'PerpustakaanGame.tsx');
let perpCode = fs.readFileSync(perpPath, 'utf8');

// Replace word entries in PerpustakaanGame
// Pattern: { syl: [...], word: 'beca', emoji: '...' }
perpCode = perpCode.replace(/\{ syl: (\[[^\]]+\]), word: '([^']+)', emoji: '([^']+)' \}/g, (match, syl, word, oldEmoji) => {
  const cleanWord = word.toLowerCase();
  if (existingImages.has(cleanWord)) {
    return `{ syl: ${syl}, word: '${word}', emoji: '/images/sukukata/${cleanWord}.png' }`;
  }
  return match;
});

// Replace display logic in PerpustakaanGame
const perpDisplayOld = `{SHELVES_DATA[activeShelf].id !== 'KV' && item.emoji !== '🔊' && (
                                            <div style={{ fontSize: '2rem', lineHeight: 1.1 }}>{item.emoji}</div>
                                        )}`;

const perpDisplayNew = `{SHELVES_DATA[activeShelf].id !== 'KV' && item.emoji !== '🔊' && (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '45px' }}>
                                                {item.emoji.includes('/') || item.emoji.includes('.png') ? (
                                                    <img src={item.emoji} alt={item.word} style={{ maxHeight: '42px', maxWidth: '50px', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ fontSize: '2rem', lineHeight: 1.1 }}>{item.emoji}</div>
                                                )}
                                            </div>
                                        )}`;

if (perpCode.includes(perpDisplayOld)) {
  perpCode = perpCode.replace(perpDisplayOld, perpDisplayNew);
  console.log('✅ PerpustakaanGame rendering updated');
} else {
  console.log('⚠️ PerpustakaanGame rendering pattern did not match exactly, checking manual replacement...');
  perpCode = perpCode.replace(
    /\{SHELVES_DATA\[activeShelf\]\.id !== 'KV' && item\.emoji !== '🔊' && \([\s\S]*?\{item\.emoji\}<\/div>\s*\)\}/,
    perpDisplayNew
  );
}

fs.writeFileSync(perpPath, perpCode, 'utf8');
console.log('✅ PerpustakaanGame.tsx updated');

// 4. ADD CSS TO src/index.css
const cssPath = path.join(__dirname, 'src', 'index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');
if (!cssCode.includes('.sk-icon-img')) {
  cssCode += `

/* SUKU KATA & NOMBOR IMAGE STYLES */
.sk-icon-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
.nombor-img {
    max-height: 140px;
}
`;
  fs.writeFileSync(cssPath, cssCode, 'utf8');
  console.log('✅ index.css updated with .sk-icon-img styles');
}
