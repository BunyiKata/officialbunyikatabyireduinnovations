import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Modify population of child select
old_select = """            const select = document.getElementById('ibubapa-child-select');
            if (select) {
                select.innerHTML = '';
                const names = window.studentNames || defaultStudentNames || [];
                names.forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (window.anakTerpilih && name === window.anakTerpilih) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });
                if (!window.anakTerpilih && names.length > 0) {
                    window.anakTerpilih = names[0];
                }
            }"""
new_select = """            const select = document.getElementById('ibubapa-child-select');
            if (select) {
                select.innerHTML = '';
                const names = ["Profil Ibu Bapa", "+ Tambah Profil Anak"];
                names.forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (window.anakTerpilih && name === window.anakTerpilih) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });
                if (!window.anakTerpilih && names.length > 0) {
                    window.anakTerpilih = names[0];
                }
            }"""
content = content.replace(old_select, new_select)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
