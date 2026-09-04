const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

js = js.replace(
    "const isLockedForUser = !modGuruAktif && (modul.locked || (modSemasa === 'latihan' && moduleIndex > unlockedIndex));",
    "const isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);"
);

fs.writeFileSync('public/app.js', js);
