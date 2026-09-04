const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

js = js.replace(/function bukaModalPilihJenisHuruf\(id\) \{[\s\S]*?function bukaSenaraiHuruf\(jenis\) \{/, `function bukaModalPilihJenisHuruf(id) {
    currentModuleId = id;
    let title = "Pilih Jenis Huruf";
    if (id === 'kenali_huruf') title = "Kenali Huruf";
    if (id === 'huruf_vokal') title = "Huruf Vokal";
    if (id === 'huruf_konsonan') title = "Huruf Konsonan";
    if (id === 'fonik_abc') title = "Fonik ABC";
    
    document.getElementById('modal-pilih-jenis-huruf-title').innerText = title;
    document.getElementById('modal-pilih-jenis-huruf').style.display = 'flex';
}

function bukaSenaraiHuruf(jenis) {`);

fs.writeFileSync('public/app.js', js);
