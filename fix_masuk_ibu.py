import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_masuk_ibu = """        window.masukModIbuBapa = function(namaAnak) {
            const names = window.studentNames || defaultStudentNames || [];
            window.anakTerpilih = namaAnak || names[0] || '';
            localStorage.setItem('ibubapaAnakTerpilih', window.anakTerpilih);
            
            modIbuBapaAktif = true;
            window.modIbuBapaAktif = true;
            modGuruAktif = false;
            window.modGuruAktif = false;
            
            document.body.classList.add('parent-mode');
            document.body.classList.remove('teacher-mode');"""

new_masuk_ibu = """        window.masukModIbuBapa = function(namaAnak) {
            const baseNames = window.studentNames || defaultStudentNames || [];
            const childNames = baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak");
            
            if (namaAnak === "Profil Ibu Bapa") {
                window.anakTerpilih = childNames.length > 0 ? childNames[0] : '';
            } else {
                window.anakTerpilih = namaAnak || (childNames.length > 0 ? childNames[0] : '');
            }
            
            localStorage.setItem('ibubapaAnakTerpilih', window.anakTerpilih);
            
            modIbuBapaAktif = true;
            window.modIbuBapaAktif = true;
            modGuruAktif = false;
            window.modGuruAktif = false;
            
            document.body.classList.add('parent-mode');
            document.body.classList.remove('teacher-mode');"""

content = content.replace(old_masuk_ibu, new_masuk_ibu)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
