import re

with open("public/app.js", "r") as f:
    js = f.read()

old_js = r"""        window\.bukaModalAvatar = function\(\) \{
            tutupSidePanel\(\);
            const container = document\.getElementById\('avatar-options'\);
            if \(container\) \{
                container\.innerHTML = avatarList\.map\(icon => `
                    <button class="neo-btn bg-white" style="font-size: 2rem; width: 60px; height: 60px; padding: 0; border-radius: 50%;" onclick="pilihAvatar\('\$\{icon\}'\)">
                        <i class="fa-solid \$\{icon\}" style="color: var\(--color-dark\);"></i>
                    </button>
                `\)\.join\(''\);
            \}
            document\.getElementById\('modal-pilih-avatar'\)\.classList\.add\('active'\);
        \};

        window\.pilihAvatar = function\(icon\) \{
            if \(namaMuridAktif && studentData\[namaMuridAktif\]\) \{
                studentData\[namaMuridAktif\]\.avatar = icon;
                window\.selectedAvatarIcon = icon;
                saveStudentData\(\);
                updateProfilUI\(\);
                tutupModal\(\);
            \}
        \};"""

new_js = """        window.bukaModalAvatar = function() {
            tutupSidePanel();
            if (!namaMuridAktif || !studentData[namaMuridAktif]) return;
            
            document.getElementById('edit-nama-input').value = namaMuridAktif;
            window.tempSelectedAvatar = studentData[namaMuridAktif].avatar || 'fa-child-reaching';
            
            renderAvatarOptions();
            document.getElementById('modal-pilih-avatar').classList.add('active');
        };
        
        function renderAvatarOptions() {
            const container = document.getElementById('avatar-options');
            if (container) {
                container.innerHTML = avatarList.map(icon => `
                    <button class="neo-btn ${window.tempSelectedAvatar === icon ? 'bg-green' : 'bg-white'}" style="font-size: 2rem; width: 60px; height: 60px; padding: 0; border-radius: 50%;" onclick="pilihAvatarTemp('${icon}')">
                        <i class="fa-solid ${icon}" style="color: var(--color-dark);"></i>
                    </button>
                `).join('');
            }
        }

        window.pilihAvatarTemp = function(icon) {
            window.tempSelectedAvatar = icon;
            renderAvatarOptions();
        };
        
        window.simpanProfilEdit = function() {
            let newName = document.getElementById('edit-nama-input').value.trim();
            if(!newName) return alert('Sila masukkan nama.');
            
            if (newName !== namaMuridAktif) {
                if (studentData[newName]) {
                    return alert('Nama ini sudah wujud, sila pilih nama lain.');
                }
                studentData[newName] = studentData[namaMuridAktif];
                delete studentData[namaMuridAktif];
                namaMuridAktif = newName;
                localStorage.setItem('muridAktif', namaMuridAktif);
            }
            
            studentData[namaMuridAktif].avatar = window.tempSelectedAvatar;
            window.selectedAvatarIcon = window.tempSelectedAvatar;
            saveStudentData();
            updateProfilUI();
            
            // force updates for all elements
            if(document.getElementById('profil-nama-besar')) document.getElementById('profil-nama-besar').innerText = namaMuridAktif;
            document.querySelectorAll('.murid-info-name').forEach(el => el.innerText = namaMuridAktif);
            if(document.getElementById('nav-nama-murid')) document.getElementById('nav-nama-murid').innerText = namaMuridAktif;
            
            tutupModal();
        };"""

if re.search(old_js, js):
    js = re.sub(old_js, new_js, js)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched app.js successfully for avatar modal")
else:
    print("Failed to patch app.js - pattern not found")
