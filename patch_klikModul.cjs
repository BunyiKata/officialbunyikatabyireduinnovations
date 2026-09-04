const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

const additionalJS = `
let currentListHurufType = '';

function bukaModalPilihJenisHuruf(id) {
    currentModuleId = id;
    if (id === 'kenali_huruf') {
        document.getElementById('modal-pilih-jenis-huruf-title').innerText = "Kenali Huruf";
        document.getElementById('modal-pilih-jenis-huruf').style.display = 'flex';
    } else {
        bukaSenaraiHuruf(id);
    }
}

function bukaSenaraiHuruf(jenis) {
    document.getElementById('modal-pilih-jenis-huruf').style.display = 'none';
    currentListHurufType = jenis;
    let title = "";
    let hurufList = [];
    
    if (currentModuleId === 'kenali_huruf' && jenis === 'kecil') {
        title = "Huruf Kecil";
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
    } else if (currentModuleId === 'kenali_huruf' && jenis === 'besar') {
        title = "Huruf Besar";
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
    } else if (currentModuleId === 'huruf_vokal') {
        title = "Huruf Vokal";
        hurufList = ['a', 'e', 'i', 'o', 'u'];
    } else if (currentModuleId === 'huruf_konsonan') {
        title = "Huruf Konsonan";
        hurufList = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    } else if (currentModuleId === 'fonik_abc') {
        title = "Fonik ABC";
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
    }

    document.getElementById('view-belajar-huruf-title').innerText = title;
    
    const container = document.getElementById('grid-huruf-container');
    container.innerHTML = '';
    
    hurufList.forEach(huruf => {
        const btn = document.createElement('button');
        btn.className = 'neo-btn bg-purple';
        btn.style.fontSize = '2rem';
        btn.style.padding = '20px';
        btn.style.minHeight = '80px';
        btn.innerText = huruf;
        btn.onclick = () => sebutHuruf(huruf, currentModuleId === 'fonik_abc');
        container.appendChild(btn);
    });
    
    paparSkrin('view-belajar-huruf');
}

function sebutHuruf(huruf, isFonik) {
    if(isFonik) {
        sebutAudio(huruf + " bunyi fonik"); // Ganti dengan logik audio sebenar
    } else {
        sebutAudio(huruf);
    }
}
`;

js = js.replace('function klikModul(id, title) {', `
${additionalJS}
function klikModul(id, title) {
`);

const replacement = `
            if(modSemasa === 'belajar') {
                if (['kenali_huruf', 'huruf_vokal', 'huruf_konsonan', 'fonik_abc'].includes(id)) {
                    bukaModalPilihJenisHuruf(id);
                    return;
                }
`;

js = js.replace("if(modSemasa === 'belajar') {", replacement);

fs.writeFileSync('public/app.js', js);
