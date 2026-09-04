with open("public/app.js", "r") as f:
    js = f.read()

orig_modules = """            } else if (nomborPeta === 4) {
                modules = [
                    { id: "ayat_mudah", title: "Ayat Mudah", content: "Ayat", color: "#ff66c4" },
                    { id: "ayat_pendek", title: "Ayat Pendek", content: "Ayat Pendek", color: "#ff66c4" },
                    { id: "ayat_panjang", title: "Ayat Panjang", content: "Ayat Panjang", color: "#ff66c4" },
                    { id: "petikan_tahap_1", title: "Petikan Tahap 1", content: "Petikan 1", color: "#ff66c4" },
                    { id: "petikan_tahap_2", title: "Petikan Tahap 2", content: "Petikan 2", color: "#ff66c4" },
                    { id: "cerita_pendek", title: "Cerita Pendek", content: "Cerita", color: "#ff66c4" }
                ];"""

new_modules = """            } else if (nomborPeta === 4) {
                modules = [
                    { id: "ayat_mudah", title: "Ayat Mudah", content: "Ayat", image: "https://i.postimg.cc/5trVjQL8/Copy-of-BUNYI-KATA-APPS-(21).png", color: "#ff66c4" },
                    { id: "ayat_pendek", title: "Ayat Pendek", content: "Ayat Pendek", image: "https://i.postimg.cc/28YfqDb0/Copy-of-BUNYI-KATA-APPS-(22).png", color: "#ff66c4" },
                    { id: "ayat_panjang", title: "Ayat Panjang", content: "Ayat Panjang", image: "https://i.postimg.cc/zBh9BtJ3/Copy-of-BUNYI-KATA-APPS-(23).png", color: "#ff66c4" },
                    { id: "petikan_tahap_1", title: "Petikan Tahap 1", content: "Petikan 1", image: "https://i.postimg.cc/RZ0yfVSS/Copy-of-BUNYI-KATA-APPS-(24).png", color: "#ff66c4" },
                    { id: "petikan_tahap_2", title: "Petikan Tahap 2", content: "Petikan 2", image: "https://i.postimg.cc/J4pd1Vby/Copy-of-BUNYI-KATA-APPS-(25).png", color: "#ff66c4" },
                    { id: "cerita_pendek", title: "Cerita Pendek", content: "Cerita", image: "https://i.postimg.cc/qRH1mkTV/Copy-of-BUNYI-KATA-APPS-(26).png", color: "#ff66c4" }
                ];"""

if orig_modules in js:
    js = js.replace(orig_modules, new_modules)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched successfully")
else:
    print("Could not find the original block")

