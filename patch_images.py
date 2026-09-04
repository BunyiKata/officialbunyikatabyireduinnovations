with open("public/app.js", "r") as f:
    js = f.read()

orig_modules = """            if (nomborPeta === 1) {
                modules = [
                    { id: "kenali_huruf", title: "Kenali Huruf", content: "A a B b", color: "var(--color-red)" },
                    { id: "huruf_vokal", title: "Huruf Vokal", content: "A E I O U", color: "var(--color-red)" },
                    { id: "huruf_konsonan", title: "Huruf Konsonan", content: "B C D F G", color: "var(--color-red)" },
                    { id: "fonik_abc", title: "Fonik ABC", content: "a b c", color: "var(--color-red)" }
                ];"""

new_modules = """            if (nomborPeta === 1) {
                modules = [
                    { id: "kenali_huruf", title: "Kenali Huruf", content: "A a B b", image: "https://i.postimg.cc/W32TBcmP/Copy-of-BUNYI-KATA-APPS-(7).png", color: "var(--color-red)" },
                    { id: "huruf_vokal", title: "Huruf Vokal", content: "A E I O U", image: "https://i.postimg.cc/ZnQmv911/Copy-of-BUNYI-KATA-APPS-(6).png", color: "var(--color-red)" },
                    { id: "huruf_konsonan", title: "Huruf Konsonan", content: "B C D F G", image: "https://i.postimg.cc/MZ3qF4nk/Copy-of-BUNYI-KATA-APPS-(5).png", color: "var(--color-red)" },
                    { id: "fonik_abc", title: "Fonik ABC", content: "a b c", image: "https://i.postimg.cc/PrLTs4Dx/Copy-of-BUNYI-KATA-APPS-(8).png", color: "var(--color-red)" }
                ];"""
js = js.replace(orig_modules, new_modules)

orig_render = """                            ${isLockedForUser ? '' : `<div class="island-inner-text">${modul.content}</div>`}"""

new_render = """                            ${isLockedForUser ? '' : (modul.image ? `<div class="island-inner-image" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('${modul.image}');"></div>` : `<div class="island-inner-text">${modul.content}</div>`)}"""

js = js.replace(orig_render, new_render)

with open("public/app.js", "w") as f:
    f.write(js)
