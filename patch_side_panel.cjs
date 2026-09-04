const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div style="padding: 20px; background: var\(--color-blue\); color: white; display: flex; align-items: center; gap: 15px; border-bottom: var\(--border-thick\);">/;
const replacement = `<div style="padding: 20px; background: var(--color-green); color: white; display: flex; align-items: center; gap: 15px; border-bottom: var(--border-thick); position: relative;">
    <button class="neo-btn bg-white" style="position: absolute; top: 10px; right: 10px; padding: 5px; min-width: auto; min-height: auto; font-size: 1rem; color: var(--color-dark);" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>`;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html);
