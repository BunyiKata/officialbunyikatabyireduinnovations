const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

const updatedBukaSenaraiHuruf = `function bukaSenaraiHuruf(jenis) {
    document.getElementById('modal-pilih-jenis-huruf').style.display = 'none';
    currentListHurufType = jenis;
    let title = "";
    let hurufList = [];
    
    let isKecil = jenis === 'kecil';
    
    if (currentModuleId === 'kenali_huruf') {
        title = "Kenali Huruf " + (isKecil ? "Kecil" : "Besar");
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode((isKecil ? 97 : 65) + i));
    } else if (currentModuleId === 'huruf_vokal') {
        title = "Huruf Vokal " + (isKecil ? "Kecil" : "Besar");
        hurufList = isKecil ? ['a', 'e', 'i', 'o', 'u'] : ['A', 'E', 'I', 'O', 'U'];
    } else if (currentModuleId === 'huruf_konsonan') {
        title = "Huruf Konsonan " + (isKecil ? "Kecil" : "Besar");
        hurufList = isKecil 
            ? ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z']
            : ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    } else if (currentModuleId === 'fonik_abc') {
        title = "Fonik ABC " + (isKecil ? "Kecil" : "Besar");
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode((isKecil ? 97 : 65) + i));
    }

    document.getElementById('view-belajar-huruf-title').innerText = title;
    
    const container = document.getElementById('grid-huruf-container');
    container.innerHTML = '';
    
    hurufList.forEach(huruf => {
        const btn = document.createElement('button');
        btn.className = 'neo-btn bg-purple';
        btn.style.fontSize = '2.5rem';
        btn.style.fontWeight = 'bold';
        btn.style.padding = '20px';
        btn.style.minHeight = '90px';
        btn.innerText = huruf;
        btn.onclick = () => sebutHuruf(huruf, currentModuleId === 'fonik_abc');
        container.appendChild(btn);
    });
    
    paparSkrin('view-belajar-huruf');
}

function sebutHuruf(huruf, isFonik)`;

js = js.replace(/function bukaSenaraiHuruf\(jenis\) \{[\s\S]*?function sebutHuruf\(huruf, isFonik\)/, updatedBukaSenaraiHuruf);
fs.writeFileSync('public/app.js', js);
