import re

with open("index.html", "r") as f:
    html = f.read()

old_btn = r"""<button class="neo-btn bg-white" style="position: absolute; top: 15px; right: 15px; padding: 0; width: 32px; height: 32px; border-radius: 50%; min-width: auto; min-height: auto; font-size: 0\.9rem; color: var\(--color-dark\); display: flex; align-items: center; justify-content: center; z-index: 10;" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""
new_btn = """<button id="btn-edit-profil" class="neo-btn bg-white" style="position: absolute; top: 15px; right: 15px; padding: 0; width: 32px; height: 32px; border-radius: 50%; min-width: auto; min-height: auto; font-size: 0.9rem; color: var(--color-dark); display: flex; align-items: center; justify-content: center; z-index: 100; cursor: pointer;" onclick="if(window.bukaModalAvatar) window.bukaModalAvatar(); else console.error('bukaModalAvatar not found!');" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""

if re.search(old_btn, html):
    html = re.sub(old_btn, new_btn, html)
    print("Patched button explicitly")
else:
    print("Button pattern not found")

with open("index.html", "w") as f:
    f.write(html)
