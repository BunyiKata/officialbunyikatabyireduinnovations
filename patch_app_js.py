import re

with open('public/app.js', 'r') as f:
    content = f.read()

# Fix bukaModalPilihPeta
old_bukaModal = """        function bukaModalPilihPeta(mod) {
            modSemasa = mod;
            const petaTajuk = document.getElementById('modal-pilih-peta-tajuk'); if(petaTajuk) petaTajuk.innerText = mod === 'belajar' ? 'PILIH PETA KEMBARA' : 'PILIH PETA LATIHAN';
            document.getElementById('modal-pilih-peta').style.display = 'flex';
        }"""

new_bukaModal = """        function bukaModalPilihPeta(mod) {
            modSemasa = mod;
            const petaTajuk = document.getElementById('modal-pilih-peta-tajuk'); 
            if(petaTajuk) {
                petaTajuk.innerText = mod === 'belajar' ? 'PILIH PETA KEMBARA' : 'PILIH PETA LATIHAN';
                if (mod === 'latihan') {
                    petaTajuk.classList.remove('bg-orange');
                    petaTajuk.classList.add('bg-purple');
                } else {
                    petaTajuk.classList.remove('bg-purple');
                    petaTajuk.classList.add('bg-orange');
                }
            }
            document.getElementById('modal-pilih-peta').style.display = 'flex';
        }"""

content = content.replace(old_bukaModal, new_bukaModal)

# Fix bukaPeta
old_bukaPeta = """        function bukaPeta(nomborPeta, skipScreenChange = false) {
            window.currentPeta = nomborPeta;
            tutupModal();
            const mapTitles = { 1: 'MISI HURUF', 2: 'MISI SUKU KATA ASAS', 3: 'MISI SUKU KATA HERO', 4: 'MISI BACAAN BERGRED' };
            document.getElementById('map-title-bar').innerHTML = mapTitles[nomborPeta] || `PETA ${nomborPeta}`;
            
            const mapArea = document.getElementById('map-board-area');"""

new_bukaPeta = """        function bukaPeta(nomborPeta, skipScreenChange = false) {
            window.currentPeta = nomborPeta;
            tutupModal();
            const mapTitles = { 1: 'MISI HURUF', 2: 'MISI SUKU KATA ASAS', 3: 'MISI SUKU KATA HERO', 4: 'MISI BACAAN BERGRED' };
            
            const titleBar = document.getElementById('map-title-bar');
            if (titleBar) {
                titleBar.innerHTML = mapTitles[nomborPeta] || `PETA ${nomborPeta}`;
                if (modSemasa === 'latihan') {
                    titleBar.classList.remove('bg-orange');
                    titleBar.classList.add('bg-purple');
                } else {
                    titleBar.classList.remove('bg-purple');
                    titleBar.classList.add('bg-orange');
                }
            }
            
            const backBtn = document.getElementById('map-back-btn');
            if (backBtn) {
                if (modSemasa === 'latihan') {
                    backBtn.classList.remove('bg-orange');
                    backBtn.classList.add('bg-purple');
                } else {
                    backBtn.classList.remove('bg-purple');
                    backBtn.classList.add('bg-orange');
                }
            }
            
            const mapArea = document.getElementById('map-board-area');"""

content = content.replace(old_bukaPeta, new_bukaPeta)

with open('public/app.js', 'w') as f:
    f.write(content)

