import re
with open("public/app.js", "r") as f:
    js = f.read()

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

function klikModul(id, title) {"""

js = re.sub(r'function klikModul\(id, title\) \{', klikModul_new, js)

with open("public/app.js", "w") as f:
    f.write(js)
