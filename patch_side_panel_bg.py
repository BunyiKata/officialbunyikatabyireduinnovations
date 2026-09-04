import re

with open("index.html", "r") as f:
    html = f.read()

old_side = r"""        <div class="murid-side-panel" style="background: white; width: 280px; height: 100%; border-right: var\(--border-thick\); display: flex; flex-direction: column; animation: slideInLeft 0\.3s forwards;">"""
new_side = """        <div class="murid-side-panel" style="background-color: white; background-image: radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px); background-size: 15px 15px; width: 280px; height: 100%; border-right: var(--border-thick); display: flex; flex-direction: column; animation: slideInLeft 0.3s forwards;">"""

if re.search(old_side, html):
    html = re.sub(old_side, new_side, html)
    print("Patched main side panel bg")

old_bottom = r"""            <div style="background: #f8fafc; display: flex; flex-direction: column;">"""
new_bottom = """            <div style="background: transparent; display: flex; flex-direction: column;">"""

if re.search(old_bottom, html):
    html = re.sub(old_bottom, new_bottom, html)
    print("Patched bottom bg")

with open("index.html", "w") as f:
    f.write(html)
