import re

with open("index.html", "r") as f:
    html = f.read()

old_code = r"""                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h2 id="profil-nama-besar" style="color: white; font-size: 1\.2rem; margin: 0; ">Nama Murid</h2>
                        <button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0\.8rem; color: var\(--color-dark\);" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                    </div>
                    <div style="color: white; font-size: 0\.85rem; font-weight: 600; opacity: 0\.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0\.8rem; font-weight: 500; opacity: 0\.9;">SK Bandar Anggerik</div>
                </div>
            </div>
            <div class="badge-summary" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <span class="score-pill" style="font-size: 0\.85rem; padding: 6px 12px;"><i class="fa-solid fa-star"></i> <strong id="profil-jumlah-markah">0</strong></span>
            </div>"""

new_code = """                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <h2 id="profil-nama-besar" style="color: white; font-size: 1.2rem; margin: 0; ">Nama Murid</h2>
                    <div style="color: white; font-size: 0.85rem; font-weight: 600; opacity: 0.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0.8rem; font-weight: 500; opacity: 0.9;">SK Bandar Anggerik</div>
                </div>
            </div>
            <div class="badge-summary" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0.8rem; color: var(--color-dark);" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                <span class="score-pill" style="font-size: 0.85rem; padding: 6px 12px; background: white; border: 1.5px solid var(--color-dark); border-radius: 20px; color: var(--color-dark); font-weight: bold; box-shadow: 1px 2px 0 var(--color-dark);"><i class="fa-solid fa-star" style="color: #ffc107; -webkit-text-stroke: 1px var(--color-dark);"></i> <strong id="profil-jumlah-markah">0</strong></span>
            </div>"""

html = re.sub(old_code, new_code, html)

with open("index.html", "w") as f:
    f.write(html)
