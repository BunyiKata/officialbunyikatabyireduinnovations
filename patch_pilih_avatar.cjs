const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

js = js.replace("studentData[namaMuridAktif].avatar = icon;", "studentData[namaMuridAktif].avatar = icon;\n                window.selectedAvatarIcon = icon;");

fs.writeFileSync('public/app.js', js);
