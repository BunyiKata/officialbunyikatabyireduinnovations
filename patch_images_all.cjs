const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'app-logic.js');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================================
// 1. AVATAR URL REPLACEMENTS (postimg.cc → local)
// ============================================================
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
  const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  const count = (content.match(regex) || []).length;
  content = content.replace(regex, newUrl);
  console.log(`Avatar: replaced ${count} occurrences → ${newUrl}`);
}

// ============================================================
// 2. BADGE IMAGE REPLACEMENTS
// ============================================================
const fiveBadgesMatch = content.match(/const FIVE_BADGES = \[([\s\S]*?)\];/);
if (fiveBadgesMatch) {
  let badgesBlock = fiveBadgesMatch[0];
  const originalBadgesBlock = badgesBlock;
  
  badgesBlock = badgesBlock.replace(
    /image: "\/images\/avatar\/avatar1\.png"/,
    'image: "/images/lencana/lencana-penjelajah-alfabet.png"'
  );
  badgesBlock = badgesBlock.replace(
    /image: "\/images\/avatar\/avatar3\.png"/,
    'image: "/images/lencana/lencana-pemburu-suku-kata.png"'
  );
  badgesBlock = badgesBlock.replace(
    /image: "\/images\/avatar\/avatar4\.png"/,
    'image: "/images/lencana/lencana-wira-pulau.png"'
  );
  badgesBlock = badgesBlock.replace(
    /image: "\/images\/avatar\/avatar6\.png"/,
    'image: "/images/lencana/lencana-naib-raja-bacaan.png"'
  );
  badgesBlock = badgesBlock.replace(
    /image: "\/images\/avatar\/avatar2\.png"/,
    'image: "/images/lencana/lencana-kapten-harta-karun.png"'
  );
  
  content = content.replace(originalBadgesBlock, badgesBlock);
  console.log('Badge images updated in FIVE_BADGES');
}

// ============================================================
// 3. SUKU KATA ICON REPLACEMENTS (emoji → image path)
// ============================================================
const sukuKataImgPath = (word) => `/images/sukukata/${word.toLowerCase()}.png`;

const allWords = {
  'BECA': true, 'CIKU': true, 'JARI': true, 'KUKU': true,
  'LABU': true, 'LIDI': true, 'MATA': true, 'NASI': true,
  'PAKU': true, 'RAGA': true, 'RUSA': true, 'SAWI': true,
  'SUDU': true, 'TALI': true, 'TEBU': true,
  'ALU': true, 'API': true, 'IBU': true, 'ISI': true,
  'UBI': true, 'ULU': true,
  'BERUDU': true, 'KELADI': true, 'KELAPA': true, 'KEMEJA': true,
  'KERETA': true, 'KERUSI': true, 'PELITA': true, 'PERIGI': true,
  'PETANI': true, 'PETOLA': true, 'SEMALU': true, 'SEPATU': true,
  'TOMATO': true, 'WANITA': true,
  'BAS': true, 'BEG': true, 'BOT': true, 'CAT': true,
  'JAG': true, 'JAM': true, 'JEM': true, 'JET': true,
  'KEK': true, 'RAK': true, 'RIM': true, 'ROS': true,
  'SUP': true, 'TIN': true, 'VAN': true,
  'AYAM': true, 'ENAM': true, 'EPAL': true, 'IKAN': true,
  'ITIK': true, 'OBOR': true, 'OREN': true, 'OTAK': true,
  'ULAR': true, 'ULAT': true,
  'BAKUL': true, 'BELON': true, 'BERUK': true, 'BETIK': true,
  'BOTOL': true, 'CAWAN': true, 'CEREK': true, 'GAJAH': true,
  'GELAS': true, 'GITAR': true, 'KAPAK': true, 'KAPAL': true,
  'KASUT': true, 'KATIL': true, 'KETAM': true, 'KICAP': true,
  'KILAT': true, 'KIPAS': true, 'LILIN': true, 'MAKAN': true,
  'MARAH': true, 'NANAS': true, 'PAGAR': true, 'SABUN': true,
  'SIKAT': true, 'TAYAR': true,
  'BALDI': true, 'BENDI': true, 'GARPU': true, 'JAMBU': true,
  'KUNCI': true, 'LAMPU': true, 'LEMBU': true, 'PINTU': true,
  'BISKUT': true, 'CERMIN': true, 'CINCIN': true, 'DOKTOR': true,
  'MANCIS': true, 'MASJID': true, 'RAMBUT': true, 'RUMPUT': true,
  'SAMPAH': true, 'SAMPAN': true, 'TANDUK': true, 'TOMBOL': true,
  'BANK': true, 'GONG': true, 'JONG': true, 'TONG': true,
  'WANG': true, 'ZINK': true,
  'BASIKAL': true, 'KELAWAR': true, 'KELEDEK': true, 'KETUPAT': true,
  'PIRAMID': true, 'PULASAN': true, 'TELEFON': true, 'TETIKUS': true,
  'ZIRAFAH': true,
  'CEMPEDAK': true, 'CENDAWAN': true, 'JAMBATAN': true,
  'KOMPUTER': true, 'PEMBARIS': true, 'TEMPAYAN': true,
};

let totalReplacements = 0;
for (const word of Object.keys(allWords)) {
  const imgTag = `<img src="${sukuKataImgPath(word)}" class="sk-icon-img" alt="${word.toLowerCase()}"/>`;
  // Use a regex that matches: back: 'WORD', icon: 'ANYTHING'
  const pattern = new RegExp(
    `(back:\\s*'${word}',\\s*icon:\\s*')[^']*(')`
  );
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1${imgTag}$2`);
    totalReplacements++;
  } else {
    console.log(`WARNING: Could not find flashcard pattern for word: ${word}`);
  }
}
console.log(`Total suku kata icon replacements: ${totalReplacements}`);

// Also replace KVK words that have extra entries (kot, pam, pen, pil, pin) that don't have images
// These words don't have images in the folder, so leave them as emojis

// ============================================================
// 4. NOMBOR ICON REPLACEMENTS
// ============================================================
const nomborEntries = [
  { front: "sa - tu", back: "1", img: "/images/nombor/satu.png" },
  { front: "du - a", back: "2", img: "/images/nombor/dua.png" },
  { front: "ti - ga", back: "3", img: "/images/nombor/tiga.png" },
  { front: "em - pat", back: "4", img: "/images/nombor/empat.png" },
  { front: "li - ma", back: "5", img: "/images/nombor/lima.png" },
  { front: "e - nam", back: "6", img: "/images/nombor/enam.png" },
  { front: "tu - juh", back: "7", img: "/images/nombor/tujuh.png" },
  { front: "la - pan", back: "8", img: "/images/nombor/lapan.png" },
  { front: "sem - bi - lan", back: "9", img: "/images/nombor/sembilan.png" },
  { front: "se - pu - luh", back: "10", img: "/images/nombor/sepuluh.png" },
];

for (const entry of nomborEntries) {
  const imgTag = `<img src="${entry.img}" class="sk-icon-img nombor-img" alt="${entry.back}"/>`;
  const escapedFront = entry.front.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(\\{front:\\s*'${escapedFront}',\\s*back:\\s*'${entry.back}',\\s*icon:\\s*')[^']*('\\})`
  );
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1${imgTag}$2`);
    console.log(`Nombor ${entry.back} replaced`);
  } else {
    console.log(`WARNING: Could not find nombor pattern for: ${entry.back}`);
  }
}

// Siri nombor
const siriEntries = [
  { front: "se - pu - luh", back: "10", img: "/images/nombor/siri-sepuluh.png" },
  { front: "du - a | pu - luh", back: "20", img: "/images/nombor/siri-dua-puluh.png" },
  { front: "ti - ga | pu - luh", back: "30", img: "/images/nombor/siri-tiga-puluh.png" },
  { front: "em - pat | pu - luh", back: "40", img: "/images/nombor/siri-empat-puluh.png" },
  { front: "li - ma | pu - luh", back: "50", img: "/images/nombor/siri-lima-puluh.png" },
  { front: "e - nam | pu - luh", back: "60", img: "/images/nombor/siri-enam-puluh.png" },
  { front: "tu - juh | pu - luh", back: "70", img: "/images/nombor/siri-tujuh-puluh.png" },
  { front: "la - pan | pu - luh", back: "80", img: "/images/nombor/siri-lapan-puluh.png" },
  { front: "sem - bi - lan | pu - luh", back: "90", img: "/images/nombor/siri-sembilan-puluh.png" },
  { front: "se - ra - tus", back: "100", img: "/images/nombor/siri-seratus.png" },
];

for (const entry of siriEntries) {
  const imgTag = `<img src="${entry.img}" class="sk-icon-img nombor-img" alt="siri ${entry.back}"/>`;
  const escapedFront = entry.front.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(\\{front:\\s*'${escapedFront}',\\s*back:\\s*'${entry.back}',\\s*icon:\\s*')[^']*('\\})`
  );
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1${imgTag}$2`);
    console.log(`Siri nombor ${entry.back} replaced`);
  } else {
    console.log(`WARNING: Could not find siri nombor pattern for: ${entry.back}`);
  }
}

// ============================================================
// 5. REPLACE GENERIC FLASHCARD IMAGE
// ============================================================
content = content.replace(
  /https:\/\/i\.postimg\.cc\/TPbGvTHW\/Copy-of-BUNYI-KATA-APPS\.png/g,
  '/images/avatar/avatar1.png'
);
console.log('Generic flashcard image replaced');

// ============================================================
// 6. UPDATE RENDERING CODE
// ============================================================

// 6a. Front card rendering - show the word's own image
const oldFrontRender = `if (iconEl) iconEl.innerHTML = '<img referrerpolicy="no-referrer" src="/images/avatar/avatar1.png" class="sukukata-flashcard-img" alt="Flashcard"/>'; // Show provided image`;
const newFrontRender = `if (iconEl) { if (item.icon && item.icon.includes('<img')) { iconEl.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>'; } else { iconEl.innerHTML = '<div style="font-size:8rem;display:flex;align-items:center;justify-content:center;height:100%;">' + (item.icon || '\\u2753') + '</div>'; } } // Show word image`;

if (content.includes(oldFrontRender)) {
  content = content.replace(oldFrontRender, newFrontRender);
  console.log('Front card rendering updated');
} else {
  console.log('WARNING: Could not find front card rendering pattern');
  // Try alternative
  const altOld = `if (iconEl) iconEl.innerHTML = '<img referrerpolicy=`;
  if (content.includes(altOld)) {
    console.log('Found alternative front card pattern, checking...');
  }
}

// 6b. Back card rendering
const oldBackRender = "backContentEl.innerHTML = `<div style=\"font-size: 8rem;\">${item.icon || '❓'}</div>`;";
const newBackRender = `backContentEl.innerHTML = (item.icon && item.icon.includes('<img')) ? '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>' : '<div style="font-size: 8rem;">' + (item.icon || '❓') + '</div>';`;

if (content.includes(oldBackRender)) {
  content = content.replace(oldBackRender, newBackRender);
  console.log('Back card rendering updated');
} else {
  console.log('WARNING: Could not find back card rendering pattern');
}

// 6c. innerText → innerHTML for icon (line ~3927)
const oldInnerText1 = "if(faceBackIcon) faceBackIcon.innerText = item.icon;";
const newInnerText1 = "if(faceBackIcon) { if (item.icon && item.icon.includes('<img')) { faceBackIcon.innerHTML = item.icon; faceBackIcon.style.fontSize = ''; } else { faceBackIcon.innerText = item.icon; } }";
if (content.includes(oldInnerText1)) {
  content = content.replace(oldInnerText1, newInnerText1);
  console.log('faceBackIcon innerText updated');
} else {
  console.log('WARNING: Could not find faceBackIcon.innerText pattern');
}

// 6d. iconEl.innerText (line ~5219)
const oldInnerText2 = "if (iconEl) iconEl.innerText = item.icon || '❓';";
const newInnerText2 = "if (iconEl) { if (item.icon && item.icon.includes('<img')) { iconEl.innerHTML = item.icon; } else { iconEl.innerText = item.icon || '❓'; } }";
if (content.includes(oldInnerText2)) {
  content = content.replace(oldInnerText2, newInnerText2);
  console.log('iconEl.innerText updated');
} else {
  console.log('WARNING: Could not find iconEl.innerText pattern');
}

// 6e. btn.innerHTML with icon (line ~5334)
const oldBtnInner = "btn.innerHTML = `<span style=\"font-size: 2.8rem; line-height: 1;\">${item.icon || '❓'}</span>`;";
const newBtnInner = "btn.innerHTML = (item.icon && item.icon.includes('<img')) ? '<div style=\"width:60px;height:60px;display:flex;align-items:center;justify-content:center;\">' + item.icon + '</div>' : '<span style=\"font-size: 2.8rem; line-height: 1;\">' + (item.icon || '❓') + '</span>';";
if (content.includes(oldBtnInner)) {
  content = content.replace(oldBtnInner, newBtnInner);
  console.log('btn.innerHTML updated');
} else {
  console.log('WARNING: Could not find btn.innerHTML pattern');
}

// 6f. iconEl.innerHTML with postimg fallback (line ~4990)
const oldIconInner = `iconEl.innerHTML = item.icon ? item.icon : '<img referrerpolicy="no-referrer" src="/images/avatar/avatar1.png" style="width: 50px; height: 50px; object-fit: contain;" alt="Icon"/>';`;
const newIconInner = `iconEl.innerHTML = item.icon ? ((item.icon.includes('<img')) ? '<div style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;">' + item.icon + '</div>' : item.icon) : '❓';`;
if (content.includes(oldIconInner)) {
  content = content.replace(oldIconInner, newIconInner);
  console.log('iconEl.innerHTML fallback updated');
} else {
  console.log('WARNING: Could not find iconEl.innerHTML fallback pattern');
}

// 6g. Number module rendering - handle img tags in icon
const oldNumRender = `let formattedContent = item.icon || '❓';
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                
                if (isSiriNombor) {
                    fSize = 'clamp(4.5rem, 15vw, 6.5rem)';
                } else if (item.icon) {
                    let cookieArray = [...item.icon].filter(c => c === '🍪');`;
const newNumRender = `let formattedContent = item.icon || '❓';
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                let isImgIcon = item.icon && item.icon.includes('<img');
                
                if (isImgIcon) {
                    formattedContent = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;">' + item.icon + '</div>';
                    fSize = 'unset';
                } else if (isSiriNombor) {
                    fSize = 'clamp(4.5rem, 15vw, 6.5rem)';
                } else if (item.icon) {
                    let cookieArray = [...item.icon].filter(c => c === '🍪');`;
if (content.includes(oldNumRender)) {
  content = content.replace(oldNumRender, newNumRender);
  console.log('Number module rendering updated');
} else {
  console.log('WARNING: Could not find number module rendering pattern');
}

// ============================================================
// WRITE OUTPUT
// ============================================================
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ app-logic.js updated successfully!');
console.log(`File size: ${content.length} bytes`);
