import re

with open("index.html", "r") as f:
    html = f.read()

old_btn = r"""<button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0\.8rem; color: var\(--color-dark\);" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""
new_btn = """<button class="neo-btn bg-white" style="padding: 0; width: 32px; height: 32px; border-radius: 50%; min-width: auto; min-height: auto; font-size: 0.9rem; color: var(--color-dark); display: flex; align-items: center; justify-content: center;" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""

if re.search(old_btn, html):
    html = re.sub(old_btn, new_btn, html)
    print("Patched pencil button")
else:
    print("Pattern not found")

with open("index.html", "w") as f:
    f.write(html)
