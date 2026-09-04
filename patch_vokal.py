with open("public/app.js", "r") as f:
    js = f.read()

import re

# Update bukaModalPilihJenisHuruf
new_bukaModal = """function bukaModalPilihJenisHuruf(id) {
    currentModuleId = id;
    if (id === 'kenali_huruf') {
        document.getElementById('modal-pilih-jenis-huruf-title').innerText = "Kenali Huruf";
        document.getElementById('modal-pilih-jenis-huruf').style.display = 'flex';
    } else {
        bukaSenaraiHuruf('kecil');
    }
}"""

js = re.sub(r'function bukaModalPilihJenisHuruf\(id\) \{[\s\S]*?\}', new_bukaModal, js, count=1)

# Update bukaSenaraiHuruf
new_bukaSenarai = """function bukaSenaraiHuruf(jenis) {
    document.getElementById('modal-pilih-jenis-huruf').style.display = 'none';
    currentListHurufType = jenis;
    let title = "";
    let hurufList = [];
    
    let isKecil = jenis === 'kecil';
    
    if (currentModuleId === 'kenali_huruf') {
        title = "Kenali Huruf " + (isKecil ? "Kecil" : "Besar");
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode((isKecil ? 97 : 65) + i));
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
        btn.style.fontWeight = 'bold';
        btn.style.padding = '10px 5px';
        btn.style.minHeight = '65px';
        btn.style.minWidth = '0';
        btn.innerText = huruf;
        btn.onclick = () => sebutHuruf(huruf, currentModuleId === 'fonik_abc');
        container.appendChild(btn);
    });
    
    paparSkrin('view-belajar-huruf');
    unlockNextBelajar(currentModuleId);
}"""

js = re.sub(r'function bukaSenaraiHuruf\(jenis\) \{[\s\S]*?paparSkrin\('view-belajar-huruf'\);\n\}', new_bukaSenarai, js)

with open("public/app.js", "w") as f:
    f.write(js)
