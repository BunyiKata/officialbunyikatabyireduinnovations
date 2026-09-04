const fs = require('fs');
const path = require('path');

// 1. PATCH public/app-logic.js
const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
let appLogic = fs.readFileSync(appLogicPath, 'utf8');

// Fix 1a: updateAvatarElement logic to accept local image paths (/images/avatar/...)
appLogic = appLogic.replace(
  'if (icon && icon.startsWith(\'http\')) {',
  'if (icon && (icon.startsWith(\'http\') || icon.startsWith(\'/\') || icon.includes(\'.png\'))) {'
);

// Fix 1b: Remove line updating menu-avatar-icon with avatar image!
appLogic = appLogic.replace(
  'updateAvatarElement(document.getElementById(\'menu-avatar-icon\'), icon);',
  '// menu-avatar-icon is main screen logo, do not replace with avatar'
);

// Fix 1c: Leaderboard avatar rendering checks
appLogic = appLogic.replace(
  "pos.data.avatar.startsWith('http')",
  "(pos.data.avatar && (pos.data.avatar.startsWith('http') || pos.data.avatar.startsWith('/') || pos.data.avatar.includes('.png')))"
);
appLogic = appLogic.replace(
  "student.avatar.startsWith('http')",
  "(student.avatar && (student.avatar.startsWith('http') || student.avatar.startsWith('/') || student.avatar.includes('.png')))"
);

// Fix 1d: Cerita / Item image rendering checks
appLogic = appLogic.replace(
  "if (imgSrc && imgSrc.startsWith('http')) {",
  "if (imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/') || imgSrc.includes('.png'))) {"
);
appLogic = appLogic.replace(
  "if (imgSrc && imgSrc.startsWith('http')) {",
  "if (imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/') || imgSrc.includes('.png'))) {"
);
appLogic = appLogic.replace(
  "if (item.image && item.image.startsWith('http')) {",
  "if (item.image && (item.image.startsWith('http') || item.image.startsWith('/') || item.image.includes('.png'))) {"
);

fs.writeFileSync(appLogicPath, appLogic, 'utf8');
console.log('✅ public/app-logic.js patched cleanly');

// 2. PATCH src/components/PerpustakaanGame.tsx
const perpPath = path.join(__dirname, 'src', 'components', 'PerpustakaanGame.tsx');
let perpCode = fs.readFileSync(perpPath, 'utf8');

perpCode = perpCode.replace(
  "const avatarStr = currentAvatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';",
  "const avatarStr = currentAvatar || '/images/avatar/avatar1.png';"
);
perpCode = perpCode.replace(
  "if (typeof avatarStr === 'string' && avatarStr.startsWith('http')) {",
  "if (typeof avatarStr === 'string' && (avatarStr.startsWith('http') || avatarStr.startsWith('/') || avatarStr.includes('.png'))) {"
);

fs.writeFileSync(perpPath, perpCode, 'utf8');
console.log('✅ PerpustakaanGame.tsx patched cleanly');

// 3. PATCH src/components/TandukKataGame.tsx
const tandukPath = path.join(__dirname, 'src', 'components', 'TandukKataGame.tsx');
let tandukCode = fs.readFileSync(tandukPath, 'utf8');

tandukCode = tandukCode.replace(
  "const avatarStr = currentAvatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';",
  "const avatarStr = currentAvatar || '/images/avatar/avatar1.png';"
);
tandukCode = tandukCode.replace(
  "if (avatarStr.startsWith('http')) {",
  "if (typeof avatarStr === 'string' && (avatarStr.startsWith('http') || avatarStr.startsWith('/') || avatarStr.includes('.png'))) {"
);

fs.writeFileSync(tandukPath, tandukCode, 'utf8');
console.log('✅ TandukKataGame.tsx patched cleanly');
