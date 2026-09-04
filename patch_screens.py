import re

with open("index.html", "r") as f:
    html = f.read()

# Replace profile-screen
old_profile = """    <div id="profile-screen" class="screen">
        <div class="map-top-bar">
            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin('main-menu-screen')"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="neo-btn bg-orange page-title" style="pointer-events:none; font-size: 1.2rem;; white-space: nowrap;">Papan Ganjaran & Lencana</div>
            <div></div>
        </div>
        
        
        <div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto 20px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 25px; gap: 10px; background-color: #168f81; background-image: linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px); background-size: 100% 100%, 15px 15px;">
            <div style="display: flex; align-items: center; gap: 15px; text-align: left;">
                <div style="font-size: 2rem; background: white; width: 60px; height: 60px; border-radius: 50%; border:var(--border-thick); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: none !important;"><i id="profil-avatar-icon" class="fa-solid fa-child-reaching" style="color:var(--color-dark); "></i></div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <h2 id="profil-nama-besar" style="color: white; font-size: 1.2rem; margin: 0; ">Nama Murid</h2>
                    <div style="color: white; font-size: 0.85rem; font-weight: 600; opacity: 0.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0.8rem; font-weight: 500; opacity: 0.9;">SK Bandar Anggerik</div>
                </div>
            </div>
            <div class="badge-summary" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <span class="score-pill" style="font-size: 0.85rem; padding: 6px 12px;"><i class="fa-solid fa-star"></i> <strong id="profil-jumlah-markah">0</strong></span>
                <span class="score-pill" style="font-size: 0.85rem; padding: 6px 12px;"><i class="fa-solid fa-medal"></i> <strong id="profil-jumlah-lencana">0</strong></span>
            </div>
        </div>
        <div class="neo-box">
            <div class="badge-grid" id="badge-grid"></div>
        </div>
    </div>"""

new_profile = """    <div id="profile-screen" class="screen">
        <div class="map-top-bar">
            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin('main-menu-screen')"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="neo-btn bg-orange page-title" style="pointer-events:none; font-size: 1.2rem;; white-space: nowrap;">Profil Murid</div>
            <div></div>
        </div>
        
        <div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto 20px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 15px 25px; gap: 10px; background-color: #168f81; background-image: linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px); background-size: 100% 100%, 15px 15px;">
            <div style="display: flex; align-items: center; gap: 15px; text-align: left;">
                <div style="font-size: 2rem; background: white; width: 60px; height: 60px; border-radius: 50%; border:var(--border-thick); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: none !important;"><i id="profil-avatar-icon" class="fa-solid fa-child-reaching" style="color:var(--color-dark); "></i></div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <h2 id="profil-nama-besar" style="color: white; font-size: 1.2rem; margin: 0; ">Nama Murid</h2>
                    <div style="color: white; font-size: 0.85rem; font-weight: 600; opacity: 0.9;">Tahun 1 Cemerlang</div>
                    <div style="color: white; font-size: 0.8rem; font-weight: 500; opacity: 0.9;">SK Bandar Anggerik</div>
                </div>
            </div>
            <div class="badge-summary" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <span class="score-pill" style="font-size: 0.85rem; padding: 6px 12px;"><i class="fa-solid fa-star"></i> <strong id="profil-jumlah-markah">0</strong></span>
            </div>
        </div>

        <div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto;">
            <h3 style="margin-top:0; font-size:1.2rem; margin-bottom:10px;">Belum Disiapkan</h3>
            <div id="incomplete-modules-container" style="display:flex; flex-direction:column; gap:10px;">
                <!-- Auto populated -->
            </div>
        </div>
    </div>
    
    <div id="lencana-screen" class="screen">
        <div class="map-top-bar">
            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin('main-menu-screen')"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="neo-btn bg-purple page-title" style="pointer-events:none; font-size: 1.2rem;; white-space: nowrap; color:white;">Lencana Saya</div>
            <div></div>
        </div>
        
        <div class="neo-box" style="width: 100%; max-width: 900px; margin: 0 auto;">
            <div class="badge-grid" id="badge-grid"></div>
            <button id="sijil-btn" class="neo-btn bg-yellow" style="width:100%; margin-top:20px; font-size:1.1rem; opacity: 0.5;" onclick="muatTurunSijil()" disabled>
                <i class="fa-solid fa-certificate"></i> Muat Turun Sijil Pencapaian
            </button>
        </div>
    </div>"""

if old_profile in html:
    html = html.replace(old_profile, new_profile)
    # Also change the nav link to lencana
    html = html.replace("onclick=\"paparSkrin('profile-screen')\">\n        <i class=\"fa-solid fa-medal\"></i>", "onclick=\"paparSkrin('lencana-screen')\">\n        <i class=\"fa-solid fa-medal\"></i>")
    
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched screens successfully.")
else:
    print("Could not find old_profile")

