import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

new_func = """        window.simpanNamaKelas = function() {
            const kelasInput = document.getElementById('input-nama-kelas');
            if (!kelasInput) return;
            const val = kelasInput.value.trim() || '1 Cemerlang';
            localStorage.setItem('bunyiKataNamaKelas', val);
            let el1 = document.getElementById('guru-dashboard-nama-kelas-title');
            if (el1) el1.innerText = val;
            let el2 = document.getElementById('ibubapa-nama-kelas-title');
            if (el2) el2.innerText = val;
            alert('Nama kelas telah disimpan: ' + val);
        };"""

content = re.sub(r'window\.simpanNamaKelas\s*=\s*function\(\)\s*\{[^\}]+\};', new_func, content)

with open('public/app-logic.js', 'w') as f:
    f.write(content)

