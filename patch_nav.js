const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<nav id="student-global-nav" class="student-nav-bar">[\s\S]*?<\/nav>/;
const newNav = `<nav id="student-global-nav" class="student-nav-bar">
    <button class="nav-item bg-orange desktop-nav-only" onclick="paparSkrin('login-screen')">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Keluar</span>
    </button>
    <button class="nav-item bg-blue mobile-nav-only" onclick="bukaSidePanel()">
        <i class="fa-solid fa-bars"></i>
        <span>Menu</span>
    </button>
    <button class="nav-item bg-green mobile-nav-only" onclick="paparSkrin('murid-menu-belajar')">
        <i class="fa-solid fa-book-open"></i>
        <span>Belajar</span>
    </button>
    <button class="nav-item bg-purple mobile-nav-only" onclick="paparSkrin('murid-menu-latihan')">
        <i class="fa-solid fa-gamepad"></i>
        <span>Latihan</span>
    </button>
    <button class="nav-item bg-purple desktop-nav-only" onclick="paparSkrin('profile-screen')">
        <i class="fa-solid fa-medal"></i>
        <span>Lencana</span>
    </button>
    <button class="nav-item bg-yellow" onclick="paparSkrin('leaderboard-screen')">
        <i class="fa-solid fa-trophy"></i>
        <span>Kedudukan</span>
    </button>
</nav>`;

html = html.replace(regex, newNav);
fs.writeFileSync('index.html', html);
