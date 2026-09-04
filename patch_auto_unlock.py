import re
with open("public/app.js", "r") as f:
    js = f.read()

# Update bukaPeta to accept skipScreenChange
js = js.replace("function bukaPeta(nomborPeta) {", "function bukaPeta(nomborPeta, skipScreenChange = false) {")

# Update paparSkrin inside bukaPeta
paparSkrin_orig = "            paparSkrin('map-screen');\n        }\n\n        function navigate(viewId, btnNode) {"
paparSkrin_new = "            if (!skipScreenChange) paparSkrin('map-screen');\n        }\n\n        function navigate(viewId, btnNode) {"
js = js.replace(paparSkrin_orig, paparSkrin_new)

# Update unlockNextBelajar to re-render the map quietly
unlockNextBelajar_orig = """function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        const index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            const currentUnlocked = Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || 0);
            if (index >= currentUnlocked) {
                localStorage.setItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`, String(index + 1));
            }
        }
    }
}"""

unlockNextBelajar_new = """function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        const index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            const currentUnlocked = Number(localStorage.getItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`) || 0);
            if (index >= currentUnlocked) {
                localStorage.setItem(`bunyiKataUnlockedBelajar_${namaMuridAktif || 'Murid'}_Peta_${window.currentPeta}`, String(index + 1));
                bukaPeta(window.currentPeta, true); // Re-render map silently
            }
        }
    }
}"""

js = js.replace(unlockNextBelajar_orig, unlockNextBelajar_new)

with open("public/app.js", "w") as f:
    f.write(js)
