import re

with open("index.html", "r") as f:
    html = f.read()

old_side = r"""                <div style="display: flex; align-items: center; gap: 10px;">
                    <h2 class="murid-info-name" style="font-size: 1\.2rem; margin: 0; word-break: break-word;">Murid</h2>
                    <button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0\.8rem; color: var\(--color-dark\);" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                </div>"""

new_side = """                <div style="display: flex; flex-direction: column; gap: 5px; align-items: flex-start;">
                    <h2 class="murid-info-name" style="font-size: 1.2rem; margin: 0; word-break: break-word;">Murid</h2>
                    <span class="score-pill" style="font-size: 0.85rem; padding: 4px 10px; background: white; border: 1.5px solid var(--color-dark); border-radius: 20px; color: var(--color-dark); font-weight: bold; box-shadow: 1px 2px 0 var(--color-dark);"><i class="fa-solid fa-star" style="color: #ffc107; -webkit-text-stroke: 1px var(--color-dark);"></i> <strong id="side-panel-jumlah-markah">0</strong></span>
                </div>"""

html = re.sub(old_side, new_side, html)

old_buttons = r"""            <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1;">
                <button class="neo-btn bg-green" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('murid-menu-belajar'\)"><i class="fa-solid fa-book-open" style="width: 30px;"></i> Belajar</button>
                <button class="neo-btn bg-orange" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('murid-menu-latihan'\)"><i class="fa-solid fa-gamepad" style="width: 30px;"></i> Latihan</button>
                <button class="neo-btn bg-yellow" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('leaderboard-screen'\)"><i class="fa-solid fa-trophy" style="width: 30px;"></i> Kedudukan</button>
            </div>
            
            <div style="padding: 20px; border-top: var\(--border-thick\); display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
                <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('prestasi-screen'\)"><i class="fa-solid fa-chart-line" style="width: 30px; color: var\(--color-blue\);"></i> Prestasi Mingguan</button>
                <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('profile-screen'\)"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
                <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1\.1rem;" onclick="tutupSidePanel\(\); paparSkrin\('login-screen'\)"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </div>"""

new_buttons = """            <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1;">
                <button class="neo-btn bg-green" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('murid-menu-belajar')"><i class="fa-solid fa-book-open" style="width: 30px;"></i> Belajar</button>
                <button class="neo-btn bg-orange" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('murid-menu-latihan')"><i class="fa-solid fa-gamepad" style="width: 30px;"></i> Latihan</button>
                <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('profile-screen')"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
                <button class="neo-btn bg-yellow" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('leaderboard-screen')"><i class="fa-solid fa-trophy" style="width: 30px;"></i> Kedudukan</button>
                <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('prestasi-screen')"><i class="fa-solid fa-chart-line" style="width: 30px; color: var(--color-blue);"></i> Prestasi Mingguan</button>
            </div>
            
            <div style="padding: 20px; border-top: var(--border-thick); display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
                <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1.1rem;" onclick="tutupSidePanel(); paparSkrin('login-screen')"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </div>"""

html = re.sub(old_buttons, new_buttons, html)

with open("index.html", "w") as f:
    f.write(html)
