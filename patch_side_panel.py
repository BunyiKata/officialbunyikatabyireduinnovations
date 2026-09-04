import re

with open("index.html", "r") as f:
    html = f.read()

old_code = r"""            <div style="padding: 20px; background: var\(--color-green\); color: white; display: flex; align-items: center; gap: 15px; border-bottom: var\(--border-thick\); position: relative;">
    <button class="neo-btn bg-white map-select-text" style="position: absolute; top: 10px; right: 10px; padding: 5px; min-width: auto; min-height: auto; font-size: 1rem; color: var\(--color-dark\);" onclick="bukaModalAvatar\(\)" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                <div style="font-size: 1\.5rem; background: white; width: 50px; height: 50px; border-radius: 50%; border:var\(--border-thick\); display:inline-flex; align-items:center; justify-content:center; box-shadow: none !important;">
                    <i class="fa-solid fa-child-reaching murid-info-avatar" style="color:var\(--color-dark\); "></i>
                </div>
                <h2 class="murid-info-name" style="font-size: 1\.2rem;  margin: 0;">Murid</h2>
                <button class="neo-btn bg-red" style="display: none; margin-left: auto; padding: 5px 10px; min-width: auto; min-height: auto;" onclick="tutupSidePanel\(\)"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1;">
                <button class="neo-btn bg-green" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('murid-menu-belajar'\)"><i class="fa-solid fa-book-open" style="width: 30px;"></i> Belajar</button>
                <button class="neo-btn bg-orange" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('murid-menu-latihan'\)"><i class="fa-solid fa-gamepad" style="width: 30px;"></i> Latihan</button>
                <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('profile-screen'\)"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
                <button class="neo-btn bg-yellow" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('leaderboard-screen'\)"><i class="fa-solid fa-trophy" style="width: 30px;"></i> Kedudukan</button>
                <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('prestasi-screen'\)"><i class="fa-solid fa-chart-line" style="width: 30px; color: var\(--color-blue\);"></i> Prestasi Mingguan</button>
            </div>
            
            <div style="padding: 20px; border-top: var\(--border-thick\);">
                <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1\.1rem;" onclick="tutupSidePanel\(\); paparSkrin\('login-screen'\)"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </div>"""

new_code = """            <div style="padding: 20px; background-color: #168f81; background-image: linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px); background-size: 100% 100%, 15px 15px; color: white; display: flex; align-items: center; gap: 15px; border-bottom: var(--border-thick); position: relative;">
                <div style="font-size: 1.5rem; background: white; width: 50px; height: 50px; border-radius: 50%; border:var(--border-thick); display:inline-flex; align-items:center; justify-content:center; box-shadow: none !important; flex-shrink: 0;">
                    <i class="fa-solid fa-child-reaching murid-info-avatar" style="color:var(--color-dark); "></i>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <h2 class="murid-info-name" style="font-size: 1.2rem; margin: 0; word-break: break-word;">Murid</h2>
                    <button class="neo-btn bg-white" style="padding: 4px 8px; min-width: auto; min-height: auto; font-size: 0.8rem; color: var(--color-dark);" onclick="bukaModalAvatar()" aria-label="Edit Profil"><i class="fa-solid fa-pencil"></i></button>
                </div>
                <button class="neo-btn bg-red" style="display: none; margin-left: auto; padding: 5px 10px; min-width: auto; min-height: auto;" onclick="tutupSidePanel()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1;">
                <button class="neo-btn bg-green" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('murid-menu-belajar')"><i class="fa-solid fa-book-open" style="width: 30px;"></i> Belajar</button>
                <button class="neo-btn bg-orange" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('murid-menu-latihan')"><i class="fa-solid fa-gamepad" style="width: 30px;"></i> Latihan</button>
                <button class="neo-btn bg-yellow" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('leaderboard-screen')"><i class="fa-solid fa-trophy" style="width: 30px;"></i> Kedudukan</button>
            </div>
            
            <div style="padding: 20px; border-top: var(--border-thick); display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
                <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('prestasi-screen')"><i class="fa-solid fa-chart-line" style="width: 30px; color: var(--color-blue);"></i> Prestasi Mingguan</button>
                <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('profile-screen')"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
                <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1.1rem;" onclick="tutupSidePanel(); paparSkrin('login-screen')"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </div>"""

if re.search(old_code, html):
    html = re.sub(old_code, new_code, html)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched side panel successfully")
else:
    print("Failed to patch side panel - pattern not found")
