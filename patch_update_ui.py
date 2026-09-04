import re

with open("public/app.js", "r") as f:
    js = f.read()

old_func = r"""        function updateProfilUI\(\) \{
            if \(namaMuridAktif && studentData\[namaMuridAktif\]\) \{
                const icon = studentData\[namaMuridAktif\]\.avatar \|\| 'fa-child-reaching';
                document\.querySelectorAll\('\.murid-info-avatar'\)\.forEach\(el => el\.className = 'fa-solid ' \+ icon \+ ' murid-info-avatar'\);
                if \(document\.getElementById\('profil-avatar-icon'\)\) \{
                    document\.getElementById\('profil-avatar-icon'\)\.className = 'fa-solid ' \+ icon;
                \}
                if \(document\.getElementById\('nav-avatar-icon'\)\) \{
                    document\.getElementById\('nav-avatar-icon'\)\.className = 'fa-solid ' \+ icon;
                \}
            \}
        \}"""

new_func = """        function updateProfilUI() {
            if (namaMuridAktif && studentData[namaMuridAktif]) {
                const icon = studentData[namaMuridAktif].avatar || 'fa-child-reaching';
                document.querySelectorAll('.murid-info-avatar').forEach(el => el.className = 'fa-solid ' + icon + ' murid-info-avatar');
                if (document.getElementById('profil-avatar-icon')) {
                    document.getElementById('profil-avatar-icon').className = 'fa-solid ' + icon;
                }
                if (document.getElementById('nav-avatar-icon')) {
                    document.getElementById('nav-avatar-icon').className = 'fa-solid ' + icon;
                }
                if (document.getElementById('side-panel-jumlah-markah')) {
                    document.getElementById('side-panel-jumlah-markah').innerText = jumlahMarkah(studentData[namaMuridAktif]);
                }
            }
        }"""

if re.search(old_func, js):
    js = re.sub(old_func, new_func, js)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched updateProfilUI successfully")
else:
    print("Failed to patch updateProfilUI - pattern not found")
