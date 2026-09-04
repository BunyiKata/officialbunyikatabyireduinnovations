import re
with open("public/app.js", "r") as f:
    js = f.read()

# 1. Update the render loop in bukaPeta
render_loop_orig = """                if (modSemasa === 'latihan') {
                    unlockedIndex = modGuruAktif ? latihanSequence.length : getLatihanUnlockIndex();
                    moduleComplete = moduleIndex < unlockedIndex;
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                    starsHTML = `<div class="stars-container"><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i></div>`;
                } else {
                    let defaultUnlocked = window.currentPeta === 1 ? 2 : 0;
                    unlockedIndex = modGuruAktif ? modules.length : Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || defaultUnlocked);
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                }"""

render_loop_new = """                if (modSemasa === 'latihan') {
                    unlockedIndex = modGuruAktif ? latihanSequence.length : getLatihanUnlockIndex();
                    moduleComplete = moduleIndex < unlockedIndex;
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                    starsHTML = `<div class="stars-container"><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i><i class="fa-solid fa-star star ${moduleComplete ? 'earned' : ''}"></i></div>`;
                } else {
                    window.sessionBelajarProgress = window.sessionBelajarProgress || {};
                    let defaultUnlocked = window.currentPeta === 1 ? 2 : 0;
                    if (window.sessionBelajarProgress[window.currentPeta] === undefined) {
                        window.sessionBelajarProgress[window.currentPeta] = defaultUnlocked;
                    }
                    unlockedIndex = modGuruAktif ? modules.length : window.sessionBelajarProgress[window.currentPeta];
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                }"""

js = js.replace(render_loop_orig, render_loop_new)

# 2. Update unlockNextBelajar function
unlockNextBelajar_orig = """function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        const index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            let defaultUnlocked = window.currentPeta === 1 ? 2 : 0;
            const currentUnlocked = Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || defaultUnlocked);
            if (index >= currentUnlocked) {
                localStorage.setItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`, String(index + 1));
                bukaPeta(window.currentPeta, true); // Re-render map silently
            }
        }
    }
}"""

unlockNextBelajar_new = """function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        const index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            window.sessionBelajarProgress = window.sessionBelajarProgress || {};
            let defaultUnlocked = window.currentPeta === 1 ? 2 : 0;
            if (window.sessionBelajarProgress[window.currentPeta] === undefined) {
                window.sessionBelajarProgress[window.currentPeta] = defaultUnlocked;
            }
            
            const currentUnlocked = window.sessionBelajarProgress[window.currentPeta];
            if (index >= currentUnlocked) {
                window.sessionBelajarProgress[window.currentPeta] = index + 1;
                bukaPeta(window.currentPeta, true); // Re-render map silently
            }
        }
    }
}"""

js = js.replace(unlockNextBelajar_orig, unlockNextBelajar_new)

with open("public/app.js", "w") as f:
    f.write(js)
