import re

with open("index.html", "r") as f:
    html = f.read()

old_buttons = r"""            <div style="padding: 20px; padding-bottom: 0; display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
                <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('prestasi-screen'\)"><i class="fa-solid fa-chart-line" style="width: 30px; color: var\(--color-blue\);"></i> Prestasi Mingguan</button>
                <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1\.1rem; padding: 12px;" onclick="tutupSidePanel\(\); paparSkrin\('profile-screen'\)"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
            </div>
            
            <div style="padding: 20px; margin-top: 20px; border-top: var\(--border-thick\); display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
                <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1\.1rem;" onclick="tutupSidePanel\(\); paparSkrin\('login-screen'\)"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </div>"""

new_buttons = """            <div style="background: #f8fafc; display: flex; flex-direction: column;">
                <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                    <button class="neo-btn bg-white map-select-text" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('prestasi-screen')"><i class="fa-solid fa-chart-line" style="width: 30px; color: var(--color-blue);"></i> Prestasi Mingguan</button>
                    <button class="neo-btn bg-purple" style="justify-content: flex-start; font-size: 1.1rem; padding: 12px;" onclick="tutupSidePanel(); paparSkrin('profile-screen')"><i class="fa-solid fa-user" style="width: 30px;"></i> Profil</button>
                </div>
                <div style="padding: 20px; border-top: var(--border-thick); display: flex; flex-direction: column; gap: 12px;">
                    <button class="neo-btn bg-red" style="width: 100%; justify-content: center; font-size: 1.1rem;" onclick="tutupSidePanel(); paparSkrin('login-screen')"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
                </div>
            </div>"""

if re.search(old_buttons, html):
    html = re.sub(old_buttons, new_buttons, html)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched side panel 4 successfully")
else:
    print("Failed to patch side panel 4 - pattern not found")
