import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_code = """        function renderProfile() {
            const data = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : studentRecord();
            
            if (document.getElementById('profil-jumlah-markah')) {
                const total = jumlahMarkah(data);
                const spent = data.spentStars || 0;
                animateValue('profil-jumlah-markah', total - spent);
            }"""

new_code = """        function renderProfile() {
            const data = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : studentRecord();
            
            if (document.getElementById('profil-jumlah-markah')) {
                const total = jumlahMarkah(data);
                const spent = data.spentStars || 0;
                animateValue('profil-jumlah-markah', total - spent);
            }
            if (document.getElementById('side-panel-jumlah-markah')) {
                const total = jumlahMarkah(data);
                const spent = data.spentStars || 0;
                animateValue('side-panel-jumlah-markah', total - spent);
            }"""

content = content.replace(old_code, new_code)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched renderProfile again")
