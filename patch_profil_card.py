import re

with open("index.html", "r") as f:
    html = f.read()

old_code = r"""                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <h2 id="profil-nama-besar" style="color: white; font-size: 1\.2rem; margin: 0; ">Nama Murid</h2>
                    <div style="color: white; font-size: 0\.85rem; font-weight: 600; opacity: 0\.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0\.8rem; font-weight: 500; opacity: 0\.9;">SK Bandar Anggerik</div>
                </div>"""

new_code = """                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h2 id="profil-nama-besar" style="color: white; font-size: 1.2rem; margin: 0; ">Nama Murid</h2>
                        <button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0.8rem; color: var(--color-dark);" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                    </div>
                    <div style="color: white; font-size: 0.85rem; font-weight: 600; opacity: 0.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0.8rem; font-weight: 500; opacity: 0.9;">SK Bandar Anggerik</div>
                </div>"""

if re.search(old_code, html):
    html = re.sub(old_code, new_code, html)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched profil card successfully")
else:
    print("Failed to patch profil card - pattern not found")
