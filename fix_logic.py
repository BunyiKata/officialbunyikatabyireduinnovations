import re
with open('public/app-logic.js', 'r') as f:
    content = f.read()

# I want to add logic to load Kod Kelas in init
old_init = """        let elKelas = document.getElementById('guru-dashboard-nama-kelas-title');
        if (elKelas) elKelas.innerText = localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang';

        let elGuru = document.getElementById('guru-dashboard-nama-guru-title');
        if (elGuru) elGuru.innerText = localStorage.getItem('pdf_guru') || '-';"""
new_init = """        let elKelas = document.getElementById('guru-dashboard-nama-kelas-title');
        if (elKelas) elKelas.innerText = localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang';

        let elGuru = document.getElementById('guru-dashboard-nama-guru-title');
        if (elGuru) elGuru.innerText = localStorage.getItem('pdf_guru') || '-';

        let kodGuru = document.getElementById('guru-dashboard-kod-kelas-title');
        if (kodGuru) kodGuru.innerText = localStorage.getItem('bunyiKataKodKelas') || '-';

        let kodIbu = document.getElementById('ibubapa-kod-keluarga-title');
        if (kodIbu) kodIbu.innerText = localStorage.getItem('bunyiKataKodKelas') || '-';"""

content = content.replace(old_init, new_init)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
