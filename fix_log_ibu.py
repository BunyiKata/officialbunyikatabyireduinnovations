import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_log = """        window.logMasukIbuBapa = function() {
            const select = document.getElementById('ibubapa-child-select');
            if (!select || !select.value) {
                alert("Sila pilih nama anak!");
                return;
            }
            window.masukModIbuBapa(select.value);
        };"""

new_log = """        window.logMasukIbuBapa = function() {
            const select = document.getElementById('ibubapa-child-select');
            if (!select || !select.value) {
                alert("Sila pilih profil anak!");
                return;
            }
            if (select.value === "+ Tambah Profil Anak") {
                const newName = prompt("Sila masukkan nama profil anak baharu:");
                if (newName && newName.trim()) {
                    window.masukModIbuBapa(newName.trim());
                } else {
                    alert("Nama profil tidak sah.");
                }
            } else {
                window.masukModIbuBapa(select.value);
            }
        };"""
content = content.replace(old_log, new_log)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
