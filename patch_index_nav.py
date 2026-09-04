import re

with open("index.html", "r") as f:
    html = f.read()

old_nav = """    <nav id="student-global-nav" class="student-nav-bar">
    <button class="nav-item nav-modern desktop-nav-only" onclick="paparSkrin('login-screen')">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Keluar</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="bukaSidePanel()">
        <i class="fa-solid fa-bars"></i>
        <span>Menu</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="paparSkrin('murid-menu-belajar')">
        <i class="fa-solid fa-book-open"></i>
        <span>Belajar</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="paparSkrin('murid-menu-latihan')">
        <i class="fa-solid fa-gamepad"></i>
        <span>Latihan</span>
    </button>
    <button class="nav-item nav-modern desktop-nav-only" onclick="paparSkrin('profile-screen')">
        <i class="fa-solid fa-medal"></i>
        <span>Lencana</span>
    </button>
    <button class="nav-item nav-modern" onclick="paparSkrin('leaderboard-screen')">
        <i class="fa-solid fa-trophy"></i>
        <span>Kedudukan</span>
    </button>
</nav>"""

new_nav = """    <nav id="student-global-nav" class="student-nav-bar">
    <button class="nav-item nav-modern desktop-nav-only" onclick="paparSkrin('profile-screen')" style="gap: 8px;">
        <div style="width: 26px; height: 26px; background: #e2e8f0; border-radius: 50%; border: 1.5px solid var(--color-dark); display: flex; align-items: center; justify-content: center; box-shadow: 1px 2px 0 var(--color-dark);">
            <i id="nav-avatar-icon" class="fa-solid fa-child-reaching" style="font-size: 0.95rem; color: var(--color-dark);"></i>
        </div>
        <span>Profil</span>
    </button>
    <button class="nav-item bg-purple desktop-nav-only" onclick="paparSkrin('profile-screen')">
        <i class="fa-solid fa-medal"></i>
        <span>Lencana</span>
    </button>
    <button class="nav-item bg-yellow desktop-nav-only" onclick="paparSkrin('leaderboard-screen')">
        <i class="fa-solid fa-trophy"></i>
        <span>Kedudukan</span>
    </button>
    <button class="nav-item bg-red desktop-nav-only" onclick="paparSkrin('login-screen')" title="Keluar">
        <i class="fa-solid fa-right-from-bracket" style="font-size: 1.2rem; margin: 0 4px;"></i>
    </button>
    
    <button class="nav-item nav-modern mobile-nav-only" onclick="bukaSidePanel()">
        <i class="fa-solid fa-bars"></i>
        <span>Menu</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="paparSkrin('murid-menu-belajar')">
        <i class="fa-solid fa-book-open"></i>
        <span>Belajar</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="paparSkrin('murid-menu-latihan')">
        <i class="fa-solid fa-gamepad"></i>
        <span>Latihan</span>
    </button>
    <button class="nav-item nav-modern mobile-nav-only" onclick="paparSkrin('leaderboard-screen')">
        <i class="fa-solid fa-trophy"></i>
        <span>Kedudukan</span>
    </button>
</nav>"""

if old_nav in html:
    html = html.replace(old_nav, new_nav)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched index.html")
else:
    print("Could not find old_nav in index.html")

