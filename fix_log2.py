import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_log = """            if (select.value === "+ Tambah Profil Anak") {
                const newName = prompt("Sila masukkan nama profil anak baharu:");
                if (newName && newName.trim()) {
                    window.masukModIbuBapa(newName.trim());
                } else {
                    alert("Nama profil tidak sah.");
                }
            } else {"""

new_log = """            if (select.value === "+ Tambah Profil Anak") {
                const newName = prompt("Sila masukkan nama profil anak baharu:");
                if (newName && newName.trim()) {
                    const finalName = newName.trim();
                    if (window.studentNames && !window.studentNames.includes(finalName)) {
                        window.studentNames.push(finalName);
                    } else if (!window.studentNames) {
                        window.studentNames = [finalName];
                    }
                    window.masukModIbuBapa(finalName);
                } else {
                    alert("Nama profil tidak sah.");
                }
            } else {"""
content = content.replace(old_log, new_log)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
