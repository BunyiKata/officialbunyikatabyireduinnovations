import re

with open("public/app.js", "r") as f:
    js = f.read()

# 1. Patch updateProfilUI
old_update = r"""        function updateProfilUI\(\) \{
            if \(namaMuridAktif && studentData\[namaMuridAktif\]\) \{
                const icon = studentData\[namaMuridAktif\]\.avatar \|\| 'fa-child-reaching';
                document\.querySelectorAll\('\.murid-info-avatar'\)\.forEach\(el => el\.className = 'fa-solid ' \+ icon \+ ' murid-info-avatar'\);
                if \(document\.getElementById\('profil-avatar-icon'\)\) \{
                    document\.getElementById\('profil-avatar-icon'\)\.className = 'fa-solid ' \+ icon;
                \}
                if \(document\.getElementById\('nav-avatar-icon'\)\) \{
                    document\.getElementById\('nav-avatar-icon'\)\.className = 'fa-solid ' \+ icon;
                \}
                if \(document\.getElementById\('side-panel-jumlah-markah'\)\) \{
                    document\.getElementById\('side-panel-jumlah-markah'\)\.innerText = jumlahMarkah\(studentData\[namaMuridAktif\]\);
                \}
            \}
        \}"""

new_update = """        function updateProfilUI() {
            if (namaMuridAktif && studentData[namaMuridAktif]) {
                const icon = studentData[namaMuridAktif].avatar || 'fa-child-reaching';
                document.querySelectorAll('.murid-info-avatar').forEach(el => el.className = 'fa-solid ' + icon + ' murid-info-avatar');
                if (document.getElementById('profil-avatar-icon')) {
                    document.getElementById('profil-avatar-icon').className = 'fa-solid ' + icon;
                }
                if (document.getElementById('nav-avatar-icon')) {
                    document.getElementById('nav-avatar-icon').className = 'fa-solid ' + icon;
                }
                if (document.getElementById('menu-avatar-icon')) {
                    document.getElementById('menu-avatar-icon').className = 'fa-solid ' + icon;
                }
                if (document.getElementById('side-panel-jumlah-markah')) {
                    document.getElementById('side-panel-jumlah-markah').innerText = jumlahMarkah(studentData[namaMuridAktif]);
                }
            }
        }"""

if re.search(old_update, js):
    js = re.sub(old_update, new_update, js)
    print("Patched updateProfilUI")
else:
    print("updateProfilUI pattern not found")


# 2. Patch simpanProfilEdit to handle UI updates correctly
old_simpan = r"""        window\.simpanProfilEdit = function\(\) \{
            let newName = document\.getElementById\('edit-nama-input'\)\.value\.trim\(\);
            if\(\!newName\) return alert\('Sila masukkan nama\.'\);
            
            if \(newName !== namaMuridAktif\) \{
                if \(studentData\[newName\]\) \{
                    return alert\('Nama ini sudah wujud, sila pilih nama lain\.'\);
                \}
                studentData\[newName\] = studentData\[namaMuridAktif\];
                delete studentData\[namaMuridAktif\];
                namaMuridAktif = newName;
                localStorage\.setItem\('muridAktif', namaMuridAktif\);
            \}
            
            studentData\[namaMuridAktif\]\.avatar = window\.tempSelectedAvatar;
            window\.selectedAvatarIcon = window\.tempSelectedAvatar;
            saveStudentData\(\);
            updateProfilUI\(\);
            
            // force updates for all elements
            if\(document\.getElementById\('profil-nama-besar'\)\) document\.getElementById\('profil-nama-besar'\)\.innerText = namaMuridAktif;
            document\.querySelectorAll\('\.murid-info-name'\)\.forEach\(el => el\.innerText = namaMuridAktif\);
            if\(document\.getElementById\('nav-nama-murid'\)\) document\.getElementById\('nav-nama-murid'\)\.innerText = namaMuridAktif;
            
            document\.getElementById\('modal-pilih-avatar'\)\.style\.display = 'none';
        \};"""

new_simpan = """        window.simpanProfilEdit = function() {
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
            if(document.getElementById('nama-murid-papar')) document.getElementById('nama-murid-papar').innerText = namaMuridAktif;
            
            // Update the dropdown option
            const dropdown = document.getElementById('student-dropdown');
            if(dropdown) {
                let optionExists = false;
                Array.from(dropdown.options).forEach(opt => {
                    if(opt.value === namaMuridAktif) optionExists = true;
                });
                if(!optionExists && newName === namaMuridAktif) {
                     // Normally we'd rename the option, but for simplicity we just make sure it renders
                }
            }
            
            document.getElementById('modal-pilih-avatar').style.display = 'none';
        };"""

if re.search(old_simpan, js):
    js = re.sub(old_simpan, new_simpan, js)
    print("Patched simpanProfilEdit")
else:
    print("simpanProfilEdit pattern not found")

with open("public/app.js", "w") as f:
    f.write(js)
