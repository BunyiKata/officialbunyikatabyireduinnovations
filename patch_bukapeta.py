import re

with open("public/app.js", "r") as f:
    js = f.read()

# Store currentPeta and modules globally in bukaPeta
bukaPeta_replacement = """function bukaPeta(nomborPeta) {
            window.currentPeta = nomborPeta;
            tutupModal();
            const mapTitles = { 1: 'MISI HURUF', 2: 'MISI SUKU KATA ASAS', 3: 'MISI SUKU KATA HERO', 4: 'MISI BACAAN BERGRED' };
            document.getElementById('map-title-bar').innerHTML = mapTitles[nomborPeta] || `PETA ${nomborPeta}`;
            
            const mapArea = document.getElementById('map-board-area');
            mapArea.innerHTML = ''; 
            
            let modules = [];"""

js = js.replace("""function bukaPeta(nomborPeta) {
            tutupModal();
            const mapTitles = { 1: 'MISI HURUF', 2: 'MISI SUKU KATA ASAS', 3: 'MISI SUKU KATA HERO', 4: 'MISI BACAAN BERGRED' };
            document.getElementById('map-title-bar').innerHTML = mapTitles[nomborPeta] || `PETA ${nomborPeta}`;
            
            const mapArea = document.getElementById('map-board-area');
            mapArea.innerHTML = ''; 
            
            let modules = [];""", bukaPeta_replacement)

# Also update the rendering loop in bukaPeta for modSemasa === 'belajar'
render_loop_orig = """modules.forEach((modul, moduleIndex) => {
                let starsHTML = '';
                const unlockedIndex = modGuruAktif ? latihanSequence.length : getLatihanUnlockIndex();
                const moduleComplete = modSemasa === 'latihan' && moduleIndex < unlockedIndex;
                const isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);

                if(modSemasa === 'latihan') {
                    starsHTML = `<div class="stars-container"><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i></div>`;
                }

const lockedClass = isLockedForUser ? 'locked' : '';                const activeClass = (!isLockedForUser && moduleIndex === unlockedIndex) ? 'active-level' : '';                const completedClass = (!isLockedForUser && moduleIndex < unlockedIndex) ? 'completed-level' : '';"""

render_loop_new = """window.currentPetaModules = modules;
            modules.forEach((modul, moduleIndex) => {
                let starsHTML = '';
                
                let unlockedIndex = 0;
                let isLockedForUser = false;
                let moduleComplete = false;
                
                if (modSemasa === 'latihan') {
                    unlockedIndex = modGuruAktif ? latihanSequence.length : getLatihanUnlockIndex();
                    moduleComplete = moduleIndex < unlockedIndex;
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                    starsHTML = `<div class="stars-container"><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i></div>`;
                } else {
                    unlockedIndex = modGuruAktif ? modules.length : Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || 0);
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                }

                const lockedClass = isLockedForUser ? 'locked' : '';
                const activeClass = (!isLockedForUser && moduleIndex === unlockedIndex) ? 'active-level' : '';
                const completedClass = (!isLockedForUser && moduleIndex < unlockedIndex) ? 'completed-level' : '';"""

js = js.replace(render_loop_orig, render_loop_new)

# Add unlockNextBelajar logic to klikModul
klikModul_orig = """function klikModul(id, title) {
    currentModuleId = id;"""

klikModul_new = """function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        const index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            const currentUnlocked = Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || 0);
            if (index >= currentUnlocked) {
                localStorage.setItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`, String(index + 1));
            }
        }
    }
}

function klikModul(id, title) {
    currentModuleId = id;
    if(modSemasa === 'belajar') unlockNextBelajar(id);"""

js = js.replace(klikModul_orig, klikModul_new)

with open("public/app.js", "w") as f:
    f.write(js)
