import re

with open("index.html", "r") as f:
    html = f.read()

# 1. Add position: relative to the container
old_container = r"""<div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto 20px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 25px; gap: 10px; background-color: #168f81; background-image: linear-gradient\(to bottom, transparent 50%, #168f81 100%\), radial-gradient\(rgba\(255,255,255,0\.15\) 2px, transparent 2px\); background-size: 100% 100%, 15px 15px;">"""
new_container = """<div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto 20px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 25px; gap: 10px; background-color: #168f81; background-image: linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px); background-size: 100% 100%, 15px 15px; position: relative;">"""
if re.search(old_container, html):
    html = re.sub(old_container, new_container, html)
    print("Patched container")
else:
    print("Container pattern not found")

# 2. Modify the button
old_btn = r"""<button class="neo-btn bg-white" style="padding: 0; width: 32px; height: 32px; border-radius: 50%; min-width: auto; min-height: auto; font-size: 0\.9rem; color: var\(--color-dark\); display: flex; align-items: center; justify-content: center;" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""
new_btn = """<button class="neo-btn bg-white" style="position: absolute; top: 15px; right: 15px; padding: 0; width: 32px; height: 32px; border-radius: 50%; min-width: auto; min-height: auto; font-size: 0.9rem; color: var(--color-dark); display: flex; align-items: center; justify-content: center; z-index: 10;" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>"""
if re.search(old_btn, html):
    html = re.sub(old_btn, new_btn, html)
    print("Patched button")
else:
    print("Button pattern not found")

with open("index.html", "w") as f:
    f.write(html)
