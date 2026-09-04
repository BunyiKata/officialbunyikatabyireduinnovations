import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_buka = """                btnTambah.onclick = () => {
                    const newName = prompt("Sila masukkan nama profil anak baharu:");
                    if (newName && newName.trim()) {
                        const finalName = newName.trim();
                        if (window.studentNames && !window.studentNames.includes(finalName)) {
                            window.studentNames.push(finalName);
                        } else if (!window.studentNames) {
                            window.studentNames = [finalName];
                        }
                        window.bukaModalPilihAnak();
                    } else {
                        alert("Nama profil tidak sah.");
                    }
                };"""

new_buka = """                btnTambah.onclick = () => {
                    const newName = prompt("Sila masukkan nama profil anak baharu:");
                    if (newName && newName.trim()) {
                        const finalName = newName.trim();
                        if (window.studentNames && !window.studentNames.includes(finalName)) {
                            window.studentNames.push(finalName);
                        } else if (!window.studentNames) {
                            window.studentNames = [finalName];
                        }
                        
                        if (typeof studentData !== 'undefined') {
                            if(!studentData[finalName]) {
                                studentData[finalName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png' };
                            }
                        }
                        if (typeof saveStudentData === 'function') saveStudentData();
                        
                        window.bukaModalPilihAnak();
                    } else {
                        alert("Nama profil tidak sah.");
                    }
                };"""

content = content.replace(old_buka, new_buka)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
