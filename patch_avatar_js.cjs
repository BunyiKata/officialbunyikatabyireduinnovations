const fs = require('fs');
let js = fs.readFileSync('public/app.js', 'utf8');

const jsCode = `
        const avatarList = [
            'fa-child-reaching', 'fa-child', 'fa-user-graduate', 'fa-user-astronaut', 'fa-user-ninja', 'fa-face-smile', 'fa-face-laugh-beam'
        ];

        window.bukaModalAvatar = function() {
            tutupSidePanel();
            const container = document.getElementById('avatar-options');
            if (container) {
                container.innerHTML = avatarList.map(icon => \`
                    <button class="neo-btn bg-white" style="font-size: 2rem; width: 60px; height: 60px; padding: 0; border-radius: 50%;" onclick="pilihAvatar('\${icon}')">
                        <i class="fa-solid \${icon}" style="color: var(--color-dark);"></i>
                    </button>
                \`).join('');
            }
            document.getElementById('modal-pilih-avatar').classList.add('active');
        };

        window.pilihAvatar = function(icon) {
            if (namaMuridAktif && studentData[namaMuridAktif]) {
                studentData[namaMuridAktif].avatar = icon;
                saveStudentData();
                updateProfilUI();
                tutupModal();
            }
        };

        function updateProfilUI() {
            if (namaMuridAktif && studentData[namaMuridAktif]) {
                const icon = studentData[namaMuridAktif].avatar || 'fa-child-reaching';
                document.querySelectorAll('.murid-info-avatar').forEach(el => el.className = 'fa-solid ' + icon + ' murid-info-avatar');
                if (document.getElementById('profil-avatar-icon')) {
                    document.getElementById('profil-avatar-icon').className = 'fa-solid ' + icon;
                }
            }
        }
`;

if (!js.includes('bukaModalAvatar')) {
    js = js.replace('function renderProfile() {', jsCode + '\n        function renderProfile() {');
    fs.writeFileSync('public/app.js', js);
}
