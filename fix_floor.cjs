const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

code = code.replace(
    /backgroundImage: 'url\("https:\/\/i\.postimg\.cc\/NMtPV4vm\/BUNYI-KATA-APPS-\(2\)\.png"\)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%'/g,
    `backgroundImage: 'url("https://i.postimg.cc/NMtPV4vm/BUNYI-KATA-APPS-(2).png")', backgroundRepeat: 'repeat-x', backgroundSize: '1500px auto', backgroundPosition: 'top left'`
);

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
